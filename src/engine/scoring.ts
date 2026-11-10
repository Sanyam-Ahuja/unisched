import { CourseSection, ScheduleMetrics, DayOfWeek, OptimizationPreferences } from '../types';
import { detectScheduleConflicts } from './constraints';

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export function computeScheduleMetrics(
  sections: CourseSection[],
  preferences?: Partial<OptimizationPreferences>
): ScheduleMetrics {
  const conflicts = detectScheduleConflicts(sections);
  const conflictCount = conflicts.length;

  const totalCredits = sections.reduce((acc, s) => acc + s.credits, 0);

  // Group by day and sort by startHour
  const dayGroups: Record<DayOfWeek, CourseSection[]> = {
    Mon: [],
    Tue: [],
    Wed: [],
    Thu: [],
    Fri: [],
  };

  sections.forEach((s) => {
    dayGroups[s.day].push(s);
  });

  let campusDaysCount = 0;
  let fragmentedGapsCount = 0;
  let longGapsCount = 0;
  let studyBlocksCount = 0;

  DAYS.forEach((day) => {
    const list = dayGroups[day].sort((a, b) => a.startHour - b.startHour);
    if (list.length > 0) {
      campusDaysCount++;

      // Check gaps between sequential classes
      for (let i = 0; i < list.length - 1; i++) {
        const gap = list[i + 1].startHour - list[i].endHour;
        if (gap === 1) {
          fragmentedGapsCount++; // awkward 1-hour gap
        } else if (gap >= 2) {
          longGapsCount++; // inconvenient long wait
        }
      }

      // Check uninterrupted study blocks before first class or after last class
      const firstClass = list[0];
      const lastClass = list[list.length - 1];

      if (firstClass.startHour - 8 >= 3) {
        studyBlocksCount++; // 3+ hours free in morning
      }
      if (18 - lastClass.endHour >= 3) {
        studyBlocksCount++; // 3+ hours free in afternoon/evening
      }
    }
  });

  // Calculate score (0-100)
  let score = 95;

  // Severe penalty for hard conflicts
  score -= conflictCount * 30;

  // Gap penalties
  score -= fragmentedGapsCount * 6;
  score -= longGapsCount * 4;

  // Bonus for compact schedules (e.g. fewer than 5 campus days)
  if (campusDaysCount <= 4 && sections.length >= 4) {
    score += (5 - campusDaysCount) * 8;
  }

  // Bonus for study blocks
  score += studyBlocksCount * 3;

  // Preference weighting adjustments
  if (preferences?.minimizeMorningClasses) {
    const morningCount = sections.filter((s) => s.startHour < 10).length;
    score -= morningCount * 3;
  }

  const qualityScore = Math.min(100, Math.max(0, Math.round(score)));

  return {
    conflictCount,
    totalCredits,
    campusDaysCount,
    fragmentedGapsCount,
    longGapsCount,
    studyBlocksCount,
    qualityScore,
  };
}
