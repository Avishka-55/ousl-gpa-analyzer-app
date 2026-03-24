export type DegreeType = 'general' | 'honours';

export type CourseRecord = {
  code: string;
  name: string;
  year: string;
  status: string;
  grade: string;
};

export type IncludedCourse = CourseRecord & {
  credits: number;
  level: number | null;
  gpv: number;
  effCredit: number;
  weighted: number;
};

export type SkippedCourse = CourseRecord & {
  reason: string;
};

export type DegreeClass = {
  label: string;
  color: string;
  background: string;
  minGPA: number;
};

export type GradeRequirement = {
  grade: string;
  credits: number;
  l56credits?: number;
};

export type ClassCriteria = {
  label: string;
  minGPA: number;
  gradeReq: GradeRequirement | null;
  extraLabel: string;
};

export type DegreeCriteria = {
  totalCredits: number;
  levelCredits: Record<number, number>;
  weighted?: boolean;
  classes: ClassCriteria[];
};

export type LevelGPAStat = {
  level: number;
  gpa: number;
  realCredits: number;
  courses: IncludedCourse[];
};

export type BaseData = {
  gpa: number;
  totalEffCredits: number;
  totalWeighted: number;
  totalRealCredits: number;
  included: IncludedCourse[];
  skipped: SkippedCourse[];
  levelGPA: LevelGPAStat[];
  gradeDist: Record<string, number>;
};

export type ProjectionResult = {
  projectedGPA: number;
  delta: number;
  projectedClass: DegreeClass;
};

export type TargetResult =
  | { status: 'no-remaining' }
  | { status: 'secured'; message: string }
  | { status: 'impossible'; message: string }
  | {
      status: 'needed';
      neededAvgGPV: number;
      closestGrade: string;
      message: string;
    };
