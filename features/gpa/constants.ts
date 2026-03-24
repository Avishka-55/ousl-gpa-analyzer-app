import { DegreeClass, DegreeCriteria } from '@/features/gpa/types';

export const GPV: Record<string, number> = {
  'A+': 4,
  A: 4,
  'A-': 3.7,
  'B+': 3.3,
  B: 3,
  'B-': 2.7,
  'C+': 2.3,
  C: 2,
  'C-': 1.7,
  'D+': 1.3,
  D: 1,
  E: 0,
};

export const GRADE_ORDER = ['A+', 'A', 'A-', 'B+', 'B', 'B-', 'C+', 'C', 'C-', 'D+', 'D', 'E'];

export const DEFAULT_EXCLUSIONS = ['LTE3401', 'FDE3020', 'CYE3200', 'CSE3213', 'FNE3000'];

export const DEGREE_CLASSES: DegreeClass[] = [
  { label: 'First Class', color: '#8B1A1A', background: '#FFF5F5', minGPA: 3.7 },
  { label: 'Second Class Upper', color: '#D69E2E', background: '#FFFFF0', minGPA: 3.3 },
  { label: 'Second Class Lower', color: '#2B6CB0', background: '#EBF8FF', minGPA: 3 },
  { label: 'Pass', color: '#2F855A', background: '#F0FFF4', minGPA: 2 },
  { label: 'Fail', color: '#718096', background: '#F7FAFC', minGPA: 0 },
];

export const CRITERIA: Record<'general' | 'honours', DegreeCriteria> = {
  general: {
    totalCredits: 90,
    levelCredits: { 3: 30, 4: 30, 5: 30 },
    classes: [
      {
        label: 'First Class',
        minGPA: 3.7,
        gradeReq: { grade: 'A', credits: 45 },
        extraLabel: 'A grades in 45 credits',
      },
      {
        label: 'Second Class Upper',
        minGPA: 3.3,
        gradeReq: { grade: 'B+', credits: 45 },
        extraLabel: 'B+ grades in 45 credits',
      },
      {
        label: 'Second Class Lower',
        minGPA: 3,
        gradeReq: { grade: 'B', credits: 45 },
        extraLabel: 'B grades in 45 credits',
      },
      {
        label: 'Pass',
        minGPA: 2,
        gradeReq: null,
        extraLabel: 'C grades or better in 84 credits',
      },
    ],
  },
  honours: {
    totalCredits: 120,
    levelCredits: { 3: 30, 4: 30, 5: 30, 6: 30 },
    weighted: true,
    classes: [
      {
        label: 'First Class',
        minGPA: 3.7,
        gradeReq: { grade: 'A', credits: 60, l56credits: 39 },
        extraLabel: 'A grades in 60cr (39 from L5/L6)',
      },
      {
        label: 'Second Class Upper',
        minGPA: 3.3,
        gradeReq: { grade: 'B+', credits: 60, l56credits: 39 },
        extraLabel: 'B+ grades in 60cr (39 from L5/L6)',
      },
      {
        label: 'Second Class Lower',
        minGPA: 3,
        gradeReq: { grade: 'B', credits: 60, l56credits: 39 },
        extraLabel: 'B grades in 60cr (39 from L5/L6)',
      },
      {
        label: 'Pass',
        minGPA: 2,
        gradeReq: null,
        extraLabel: 'C grades or above for 120 credits',
      },
    ],
  },
};
