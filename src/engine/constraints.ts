import { CourseSection, ScheduleConflict } from '../types';

export function isTimeOverlapping(a: CourseSection, b: CourseSection): boolean {
  if (a.day !== b.day) return false;
  return Math.max(a.startHour, b.startHour) < Math.min(a.endHour, b.endHour);
}

export function detectScheduleConflicts(sections: CourseSection[]): ScheduleConflict[] {
  const conflicts: ScheduleConflict[] = [];
  const n = sections.length;

  for (let i = 0; i < n; i++) {
    for (let j = i + 1; j < n; j++) {
      const secA = sections[i];
      const secB = sections[j];

      if (isTimeOverlapping(secA, secB)) {
        // 1. Same room collision
        if (secA.room.toLowerCase() === secB.room.toLowerCase()) {
          conflicts.push({
            type: 'room_clash',
            sectionA: secA,
            sectionB: secB,
            description: `Room double-booking clash: Both ${secA.courseCode} and ${secB.courseCode} are scheduled in ${secA.room} on ${secA.day} between ${Math.max(secA.startHour, secB.startHour)}:00 and ${Math.min(secA.endHour, secB.endHour)}:00.`,
          });
        }

        // 2. Same faculty clash
        if (secA.instructor.toLowerCase() === secB.instructor.toLowerCase()) {
          conflicts.push({
            type: 'faculty_clash',
            sectionA: secA,
            sectionB: secB,
            description: `Faculty schedule clash: ${secA.instructor} cannot teach ${secA.courseCode} and ${secB.courseCode} simultaneously on ${secA.day}.`,
          });
        }

        // 3. Student time slot overlap
        conflicts.push({
          type: 'overlap',
          sectionA: secA,
          sectionB: secB,
          description: `Time slot conflict: ${secA.courseCode} (${secA.startHour}:00 - ${secA.endHour}:00) overlaps with ${secB.courseCode} (${secB.startHour}:00 - ${secB.endHour}:00) on ${secA.day}.`,
        });
      }
    }
  }

  return conflicts;
}
