import { describe, it, expect } from 'vitest';
import { detectScheduleConflicts } from './constraints';
import { computeScheduleMetrics } from './scoring';
import { generateCandidateSchedules } from './generator';
import { CourseSection, OptimizationPreferences } from '../types';

describe('UniSched Constraint Engine & CSP Solver', () => {
  const dummyA: CourseSection = {
    id: 'sec-1',
    courseCode: 'CS 301',
    courseName: 'Algorithms',
    instructor: 'Dr. Turing',
    room: 'Hall A',
    day: 'Mon',
    startHour: 9,
    endHour: 11,
    type: 'lecture',
    credits: 3,
    color: '#06B6D4',
  };

  const dummyB_clash: CourseSection = {
    id: 'sec-2',
    courseCode: 'CS 405',
    courseName: 'Compilers',
    instructor: 'Dr. Hopper',
    room: 'Hall B',
    day: 'Mon',
    startHour: 10, // overlaps 10-11
    endHour: 12,
    type: 'lecture',
    credits: 3,
    color: '#06B6D4',
  };

  const dummyB_noClash: CourseSection = {
    id: 'sec-3',
    courseCode: 'CS 405',
    courseName: 'Compilers',
    instructor: 'Dr. Hopper',
    room: 'Hall B',
    day: 'Mon',
    startHour: 11, // starts right after dummyA
    endHour: 13,
    type: 'lecture',
    credits: 3,
    color: '#06B6D4',
  };

  const dummyRoomClash: CourseSection = {
    id: 'sec-4',
    courseCode: 'MATH 210',
    courseName: 'Linear Algebra',
    instructor: 'Dr. Gauss',
    room: 'Hall A', // Same room as dummyA
    day: 'Mon',
    startHour: 9,
    endHour: 11,
    type: 'lecture',
    credits: 3,
    color: '#06B6D4',
  };

  const dummyFacultyClash: CourseSection = {
    id: 'sec-5',
    courseCode: 'CS 499',
    courseName: 'Seminar',
    instructor: 'Dr. Turing', // Same instructor as dummyA
    room: 'Hall C',
    day: 'Mon',
    startHour: 9,
    endHour: 11,
    type: 'seminar',
    credits: 1,
    color: '#10B981',
  };

  it('detects timing overlap conflict correctly', () => {
    const conflicts = detectScheduleConflicts([dummyA, dummyB_clash]);
    expect(conflicts.length).toBeGreaterThan(0);
    expect(conflicts[0].type).toBe('overlap');
  });

  it('detects room clash correctly', () => {
    const conflicts = detectScheduleConflicts([dummyA, dummyRoomClash]);
    expect(conflicts.some((c) => c.type === 'room_clash')).toBe(true);
  });

  it('detects faculty double-booking correctly', () => {
    const conflicts = detectScheduleConflicts([dummyA, dummyFacultyClash]);
    expect(conflicts.some((c) => c.type === 'faculty_clash')).toBe(true);
  });

  it('returns no conflicts for non-overlapping sections', () => {
    const conflicts = detectScheduleConflicts([dummyA, dummyB_noClash]);
    expect(conflicts.length).toBe(0);
  });

  it('computes schedule metrics and fitness scores', () => {
    const prefs: OptimizationPreferences = {
      preferCompactDays: true,
      minimizeMorningClasses: false,
      minimizeFragmentedGaps: true,
      maximizeStudyBlocks: true,
    };

    const metrics = computeScheduleMetrics([dummyA, dummyB_noClash], prefs);
    expect(metrics.totalCredits).toBe(6);
    expect(metrics.campusDaysCount).toBe(1); // both on Monday
    expect(metrics.qualityScore).toBeGreaterThan(0);
  });

  it('generates conflict-free candidate schedules via backtracking', () => {
    const catalog: CourseSection[] = [
      dummyA,
      { ...dummyA, id: 'sec-1-alt', day: 'Tue', startHour: 14, endHour: 16 },
      dummyB_clash,
      dummyB_noClash,
    ];

    const prefs: OptimizationPreferences = {
      preferCompactDays: true,
      minimizeMorningClasses: false,
      minimizeFragmentedGaps: true,
      maximizeStudyBlocks: true,
    };

    const candidates = generateCandidateSchedules(catalog, ['CS 301', 'CS 405'], prefs, 3);
    expect(candidates.length).toBeGreaterThan(0);

    for (const cand of candidates) {
      expect(cand.conflicts.length).toBe(0);
      expect(cand.sections.length).toBe(2);
    }
  });
});
