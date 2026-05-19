// Grade sorting utilities for Yosemite, V-Scale, and French systems.
// Used by the stats module to find hardest sends and sort grade buckets for charts.

export type GradeSystem = 'YOSEMITE' | 'V_SCALE' | 'FRENCH';

// Ordered arrays define the sort index for each system.
// A grade's position in the array = its numeric difficulty rank.
const YOSEMITE_ORDER = [
  '5.0','5.1','5.2','5.3','5.4','5.5','5.6','5.7','5.8','5.9',
  '5.10a','5.10b','5.10c','5.10d',
  '5.11a','5.11b','5.11c','5.11d',
  '5.12a','5.12b','5.12c','5.12d',
  '5.13a','5.13b','5.13c','5.13d',
  '5.14a','5.14b','5.14c','5.14d',
  '5.15a','5.15b','5.15c','5.15d',
];

const V_SCALE_ORDER = [
  'VB','V0','V0+','V1','V2','V3','V4','V5','V6',
  'V7','V8','V9','V10','V11','V12','V13','V14','V15','V16','V17',
];

const FRENCH_ORDER = [
  '3','3+','4','4+','5a','5a+','5b','5b+','5c','5c+',
  '6a','6a+','6b','6b+','6c','6c+',
  '7a','7a+','7b','7b+','7c','7c+',
  '8a','8a+','8b','8b+','8c','8c+',
  '9a','9a+','9b','9b+','9c',
];

// Returns the numeric rank of a grade (higher = harder).
// Returns -1 if the grade is not recognized.
export function gradeRank(grade: string, system: GradeSystem): number {
  const order = system === 'YOSEMITE' ? YOSEMITE_ORDER
    : system === 'V_SCALE' ? V_SCALE_ORDER
    : FRENCH_ORDER;
  return order.indexOf(grade.trim());
}

export function harderGrade(
  a: string,
  b: string,
  system: GradeSystem
): string | null {
  const rankA = gradeRank(a, system);
  const rankB = gradeRank(b, system);
  if (rankA === -1 && rankB === -1) return null;
  if (rankA === -1) return b;
  if (rankB === -1) return a;
  return rankA >= rankB ? a : b;
}

function normalizedRank(grade: string, system: GradeSystem): number {
  const order = system === 'YOSEMITE' ? YOSEMITE_ORDER
    : system === 'V_SCALE' ? V_SCALE_ORDER
    : FRENCH_ORDER;
  const rank = gradeRank(grade, system);
  if (rank === -1) return -1;
  return rank / (order.length - 1);
}

export function harderGradeCrossSystem(
  a: { grade: string; system: GradeSystem },
  b: { grade: string; system: GradeSystem }
): { grade: string; system: GradeSystem } | null {
  const normA = normalizedRank(a.grade, a.system);
  const normB = normalizedRank(b.grade, b.system);
  if (normA === -1 && normB === -1) return null;
  if (normA === -1) return b;
  if (normB === -1) return a;
  return normA >= normB ? a : b;
}

export function sortGrades(
  grades: Array<{ grade: string; system: GradeSystem }>
): Array<{ grade: string; system: GradeSystem }> {
  return [...grades].sort((a, b) => {
    const normA = normalizedRank(a.grade, a.system);
    const normB = normalizedRank(b.grade, b.system);
    if (normA === -1 && normB === -1) return 0;
    if (normA === -1) return 1;
    if (normB === -1) return -1;
    return normA - normB;
  });
}
