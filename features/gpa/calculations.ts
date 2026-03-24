import { CRITERIA, DEGREE_CLASSES, GPV, GRADE_ORDER } from '@/features/gpa/constants';
import {
    BaseData,
    CourseRecord,
    DegreeClass,
    DegreeType,
    IncludedCourse,
    ProjectionResult,
    TargetResult,
} from '@/features/gpa/types';

export function getCredits(code: string): number | null {
  if (!code || code.length < 5) return null;
  const digit = Number(code[4]);
  return Number.isNaN(digit) ? null : digit;
}

export function getLevel(code: string): number | null {
  if (!code || code.length < 4) return null;
  const digit = Number(code[3]);
  return Number.isNaN(digit) ? null : digit;
}

export function getDegreeClass(gpa: number): DegreeClass {
  return DEGREE_CLASSES.find((item) => gpa >= item.minGPA) ?? DEGREE_CLASSES[DEGREE_CLASSES.length - 1];
}

export function effectiveCredit(credits: number, level: number | null, degreeType: DegreeType): number {
  if (degreeType !== 'honours') return credits;
  return (level ?? 0) >= 5 ? credits * 3 : credits * 2;
}

function isIncomplete(status: string, grade: string): boolean {
  const cleanStatus = status.trim().toLowerCase();
  return cleanStatus === 'eligible' || cleanStatus === 'pending' || grade.trim() === '-';
}

export function parseExclusions(input: string): string[] {
  return input
    .split(',')
    .map((item) => item.trim().toUpperCase())
    .filter(Boolean);
}

export function calculateBaseData(
  allCourses: CourseRecord[],
  degreeType: DegreeType,
  exclusions: string[]
): BaseData {
  const included: IncludedCourse[] = [];
  const skipped: BaseData['skipped'] = [];

  allCourses.forEach((course) => {
    const code = course.code.toUpperCase();
    if (exclusions.includes(code)) {
      skipped.push({ ...course, reason: 'Excluded' });
      return;
    }

    if (isIncomplete(course.status, course.grade)) {
      skipped.push({ ...course, reason: 'Not completed yet' });
      return;
    }

    if (!(course.grade in GPV)) {
      skipped.push({ ...course, reason: 'Ungraded' });
      return;
    }

    const credits = getCredits(course.code);
    if (!credits) {
      skipped.push({ ...course, reason: 'No credits parsed' });
      return;
    }

    const level = getLevel(course.code);
    const gpv = GPV[course.grade];
    const effCredit = effectiveCredit(credits, level, degreeType);
    const weighted = effCredit * gpv;

    included.push({
      ...course,
      credits,
      level,
      gpv,
      effCredit,
      weighted,
    });
  });

  const totalEffCredits = included.reduce((sum, item) => sum + item.effCredit, 0);
  const totalWeighted = included.reduce((sum, item) => sum + item.weighted, 0);
  const totalRealCredits = included.reduce((sum, item) => sum + item.credits, 0);
  const gpa = totalEffCredits > 0 ? totalWeighted / totalEffCredits : 0;

  const levelMap = new Map<number, { weighted: number; effCredits: number; realCredits: number; courses: IncludedCourse[] }>();
  const gradeDist: Record<string, number> = {};

  included.forEach((item) => {
    if (item.level) {
      const stat = levelMap.get(item.level) ?? {
        weighted: 0,
        effCredits: 0,
        realCredits: 0,
        courses: [],
      };
      stat.weighted += item.weighted;
      stat.effCredits += item.effCredit;
      stat.realCredits += item.credits;
      stat.courses.push(item);
      levelMap.set(item.level, stat);
    }

    gradeDist[item.grade] = (gradeDist[item.grade] ?? 0) + item.credits;
  });

  const levelGPA = Array.from(levelMap.entries())
    .map(([level, stat]) => ({
      level,
      gpa: stat.effCredits > 0 ? stat.weighted / stat.effCredits : 0,
      realCredits: stat.realCredits,
      courses: stat.courses,
    }))
    .sort((a, b) => a.level - b.level);

  return {
    gpa,
    totalEffCredits,
    totalWeighted,
    totalRealCredits,
    included,
    skipped,
    levelGPA,
    gradeDist,
  };
}

export function listIncompleteCourses(allCourses: CourseRecord[], exclusions: string[]): CourseRecord[] {
  return allCourses.filter((course) => {
    const excluded = exclusions.includes(course.code.toUpperCase());
    return !excluded && isIncomplete(course.status, course.grade);
  });
}

export function calculateProjection(
  baseData: BaseData,
  degreeType: DegreeType,
  selectedGrades: Record<string, string>
): ProjectionResult | null {
  const entries = Object.entries(selectedGrades).filter(([, grade]) => Boolean(grade));
  if (!entries.length) return null;

  let effCredits = baseData.totalEffCredits;
  let weighted = baseData.totalWeighted;

  entries.forEach(([code, grade]) => {
    const credits = getCredits(code);
    if (!credits) return;

    const level = getLevel(code);
    const gpv = GPV[grade];
    if (gpv === undefined) return;

    const eff = effectiveCredit(credits, level, degreeType);
    effCredits += eff;
    weighted += eff * gpv;
  });

  const projectedGPA = effCredits > 0 ? weighted / effCredits : 0;
  return {
    projectedGPA,
    delta: projectedGPA - baseData.gpa,
    projectedClass: getDegreeClass(projectedGPA),
  };
}

export function calculateTarget(
  baseData: BaseData,
  allCourses: CourseRecord[],
  degreeType: DegreeType,
  exclusions: string[],
  targetGPA: number
): TargetResult {
  const incomplete = listIncompleteCourses(allCourses, exclusions);
  const remainingEff = incomplete.reduce((sum, course) => {
    const credits = getCredits(course.code);
    if (!credits) return sum;
    return sum + effectiveCredit(credits, getLevel(course.code), degreeType);
  }, 0);

  if (remainingEff === 0) {
    return { status: 'no-remaining' };
  }

  const neededWeighted = targetGPA * (baseData.totalEffCredits + remainingEff) - baseData.totalWeighted;
  const neededAvgGPV = neededWeighted / remainingEff;

  if (neededAvgGPV <= 0) {
    return {
      status: 'secured',
      message: `You have already secured GPA ${targetGPA.toFixed(2)} or above.`,
    };
  }

  if (neededAvgGPV > 4) {
    return {
      status: 'impossible',
      message: `Even straight A+ grades cannot reach GPA ${targetGPA.toFixed(2)}.`,
    };
  }

  const closestGrade = GRADE_ORDER.slice()
    .reverse()
    .find((grade) => GPV[grade] >= neededAvgGPV) ?? 'A+';

  return {
    status: 'needed',
    neededAvgGPV,
    closestGrade,
    message: `You need an average GPV of ${neededAvgGPV.toFixed(2)} across remaining courses.`,
  };
}

export function getCriteriaByDegree(degreeType: DegreeType) {
  return CRITERIA[degreeType];
}
