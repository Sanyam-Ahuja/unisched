export type DayOfWeek = 'Mon' | 'Tue' | 'Wed' | 'Thu' | 'Fri';
export type SectionType = 'lecture' | 'lab' | 'seminar';

export interface CourseSection {
  id: string;
  courseCode: string;
  courseName: string;
  instructor: string;
  room: string;
  day: DayOfWeek;
  startHour: number; // 8 to 18 (e.g., 9 = 09:00, 11 = 11:00)
  endHour: number;
  type: SectionType;
  credits: number;
  color: string;
}

export interface ScheduleConflict {
  type: 'overlap' | 'room_clash' | 'faculty_clash';
  sectionA: CourseSection;
  sectionB: CourseSection;
  description: string;
}

export interface ScheduleMetrics {
  conflictCount: number;
  totalCredits: number;
  campusDaysCount: number;
  fragmentedGapsCount: number;
  longGapsCount: number;
  studyBlocksCount: number;
  qualityScore: number;
}

export interface ScheduleCandidate {
  id: string;
  title: string;
  sections: CourseSection[];
  metrics: ScheduleMetrics;
  conflicts: ScheduleConflict[];
}

export interface OptimizationPreferences {
  preferCompactDays: boolean;
  minimizeMorningClasses: boolean;
  minimizeFragmentedGaps: boolean;
  maximizeStudyBlocks: boolean;
}
