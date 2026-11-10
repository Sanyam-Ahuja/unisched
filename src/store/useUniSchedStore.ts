import { create } from 'zustand';
import { 
  CourseSection, 
  ScheduleCandidate, 
  OptimizationPreferences, 
  ScheduleConflict, 
  ScheduleMetrics,
  DayOfWeek
} from '../types';
import { SEED_CATALOG_SECTIONS } from '../data/seedCourses';
import { detectScheduleConflicts } from '../engine/constraints';
import { computeScheduleMetrics } from '../engine/scoring';
import { generateCandidateSchedules } from '../engine/generator';

interface UniSchedState {
  activeTab: 'calendar' | 'generator' | 'comparison' | 'catalog';
  setActiveTab: (tab: UniSchedState['activeTab']) => void;

  catalogSections: CourseSection[];
  activeSections: CourseSection[];
  requiredCourses: string[];
  preferences: OptimizationPreferences;
  candidates: ScheduleCandidate[];
  selectedCandidateId: string | null;

  conflicts: ScheduleConflict[];
  metrics: ScheduleMetrics;

  // Actions
  toggleCourseSelection: (courseCode: string) => void;
  updatePreferences: (prefs: Partial<OptimizationPreferences>) => void;
  runOptimizer: () => void;
  applyCandidateSchedule: (candidateId: string) => void;
  moveSectionTime: (sectionId: string, day: DayOfWeek, startHour: number) => void;
  addCatalogSection: (section: CourseSection) => void;
  removeActiveSection: (sectionId: string) => void;
  resetAll: () => void;
}

const DEFAULT_REQUIRED = ['CS 301', 'CS 405', 'MATH 210', 'CS 350'];
const DEFAULT_PREFERENCES: OptimizationPreferences = {
  preferCompactDays: true,
  minimizeMorningClasses: false,
  minimizeFragmentedGaps: true,
  maximizeStudyBlocks: true,
};

const initialActive = [
  SEED_CATALOG_SECTIONS[0], // CS 301-A (Mon 9-11)
  SEED_CATALOG_SECTIONS[3], // CS 405-A (Mon 11-13)
  SEED_CATALOG_SECTIONS[5], // MATH 210-A (Tue 9-11)
  SEED_CATALOG_SECTIONS[7], // CS 350-A (Mon 14-16)
];

const initialConflicts = detectScheduleConflicts(initialActive);
const initialMetrics = computeScheduleMetrics(initialActive, DEFAULT_PREFERENCES);
const initialCandidates = generateCandidateSchedules(
  SEED_CATALOG_SECTIONS,
  DEFAULT_REQUIRED,
  DEFAULT_PREFERENCES
);

export const useUniSchedStore = create<UniSchedState>((set, get) => ({
  activeTab: 'calendar',
  setActiveTab: (tab) => set({ activeTab: tab }),

  catalogSections: SEED_CATALOG_SECTIONS,
  activeSections: initialActive,
  requiredCourses: DEFAULT_REQUIRED,
  preferences: DEFAULT_PREFERENCES,
  candidates: initialCandidates,
  selectedCandidateId: initialCandidates[0]?.id || null,

  conflicts: initialConflicts,
  metrics: initialMetrics,

  toggleCourseSelection: (courseCode) => {
    const { requiredCourses } = get();
    const updated = requiredCourses.includes(courseCode)
      ? requiredCourses.filter((c) => c !== courseCode)
      : [...requiredCourses, courseCode];
    set({ requiredCourses: updated });
    get().runOptimizer();
  },

  updatePreferences: (prefs) => {
    set((state) => ({ preferences: { ...state.preferences, ...prefs } }));
    get().runOptimizer();
  },

  runOptimizer: () => {
    const { catalogSections, requiredCourses, preferences } = get();
    const candidates = generateCandidateSchedules(
      catalogSections,
      requiredCourses,
      preferences,
      4
    );

    if (candidates.length > 0) {
      const top = candidates[0];
      set({
        candidates,
        activeSections: top.sections,
        selectedCandidateId: top.id,
        conflicts: top.conflicts,
        metrics: top.metrics,
      });
    } else {
      set({ candidates: [] });
    }
  },

  applyCandidateSchedule: (candidateId) => {
    const { candidates } = get();
    const chosen = candidates.find((c) => c.id === candidateId);
    if (!chosen) return;

    set({
      selectedCandidateId: candidateId,
      activeSections: chosen.sections,
      conflicts: chosen.conflicts,
      metrics: chosen.metrics,
      activeTab: 'calendar',
    });
  },

  moveSectionTime: (sectionId, day, startHour) => {
    set((state) => {
      const updated = state.activeSections.map((s) => {
        if (s.id === sectionId) {
          const duration = s.endHour - s.startHour;
          return {
            ...s,
            day,
            startHour,
            endHour: startHour + duration,
          };
        }
        return s;
      });

      const conflicts = detectScheduleConflicts(updated);
      const metrics = computeScheduleMetrics(updated, state.preferences);

      return {
        activeSections: updated,
        conflicts,
        metrics,
      };
    });
  },

  addCatalogSection: (sec) => {
    set((state) => {
      const newCatalog = [...state.catalogSections, sec];
      return { catalogSections: newCatalog };
    });
    get().runOptimizer();
  },

  removeActiveSection: (sectionId) => {
    set((state) => {
      const updated = state.activeSections.filter((s) => s.id !== sectionId);
      const conflicts = detectScheduleConflicts(updated);
      const metrics = computeScheduleMetrics(updated, state.preferences);
      return { activeSections: updated, conflicts, metrics };
    });
  },

  resetAll: () => {
    set({
      catalogSections: SEED_CATALOG_SECTIONS,
      activeSections: initialActive,
      requiredCourses: DEFAULT_REQUIRED,
      preferences: DEFAULT_PREFERENCES,
      candidates: initialCandidates,
      selectedCandidateId: initialCandidates[0]?.id || null,
      conflicts: initialConflicts,
      metrics: initialMetrics,
    });
  },
}));
