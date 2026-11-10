import { CourseSection, ScheduleCandidate, OptimizationPreferences } from '../types';
import { detectScheduleConflicts } from './constraints';
import { computeScheduleMetrics } from './scoring';

export function generateCandidateSchedules(
  catalogSections: CourseSection[],
  requiredCourseCodes: string[],
  preferences: OptimizationPreferences,
  maxCandidates: number = 4
): ScheduleCandidate[] {
  // Group sections by course code
  const courseOptionsMap = new Map<string, CourseSection[]>();
  requiredCourseCodes.forEach((code) => {
    const matching = catalogSections.filter((s) => s.courseCode === code);
    if (matching.length > 0) {
      courseOptionsMap.set(code, matching);
    }
  });

  const validCombinations: CourseSection[][] = [];

  // Recursive backtracking solver
  function backtrack(courseIdx: number, currentSchedule: CourseSection[]) {
    if (courseIdx === requiredCourseCodes.length) {
      // Validate hard constraints
      const conflicts = detectScheduleConflicts(currentSchedule);
      if (conflicts.length === 0) {
        validCombinations.push([...currentSchedule]);
      }
      return;
    }

    const courseCode = requiredCourseCodes[courseIdx];
    const options = courseOptionsMap.get(courseCode) || [];

    for (const option of options) {
      // Pruning: check if option conflicts with anything already selected
      const partialSchedule = [...currentSchedule, option];
      const partialConflicts = detectScheduleConflicts(partialSchedule);

      if (partialConflicts.length === 0) {
        backtrack(courseIdx + 1, partialSchedule);
      }
    }
  }

  backtrack(0, []);

  // Score and rank candidates
  const scoredCandidates: ScheduleCandidate[] = validCombinations.map((sections, idx) => {
    const metrics = computeScheduleMetrics(sections, preferences);
    const conflicts = detectScheduleConflicts(sections);

    return {
      id: `candidate-${idx + 1}`,
      title: `Schedule Option ${String.fromCharCode(65 + idx)} (${metrics.campusDaysCount} Days, ${metrics.qualityScore}% Match)`,
      sections,
      metrics,
      conflicts,
    };
  });

  // Sort by quality score descending
  scoredCandidates.sort((a, b) => b.metrics.qualityScore - a.metrics.qualityScore);

  return scoredCandidates.slice(0, maxCandidates);
}
