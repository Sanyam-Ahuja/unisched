import React, { useState } from 'react';
import { useUniSchedStore } from '../../store/useUniSchedStore';
import { DayOfWeek, CourseSection } from '../../types';
import { 
  AlertOctagon, 
  Clock, 
  MapPin, 
  User, 
  ChevronLeft, 
  ChevronRight, 
  Trash2, 
  Sparkles,
  CalendarDays,
  ShieldCheck,
  CheckCircle2
} from 'lucide-react';

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const HOURS = [8, 9, 10, 11, 12, 13, 14, 15, 16, 17];

export const WeeklyCalendar: React.FC = () => {
  const { 
    activeSections, 
    conflicts, 
    metrics, 
    moveSectionTime, 
    removeActiveSection,
    setActiveTab 
  } = useUniSchedStore();

  const [selectedSection, setSelectedSection] = useState<CourseSection | null>(null);

  // Group sections by day
  const getSectionsForDayAndHour = (day: DayOfWeek, hour: number) => {
    return activeSections.filter((s) => s.day === day && s.startHour === hour);
  };

  const handleShiftTime = (section: CourseSection, hourDelta: number) => {
    const newStart = section.startHour + hourDelta;
    const duration = section.endHour - section.startHour;
    if (newStart >= 8 && newStart + duration <= 18) {
      moveSectionTime(section.id, section.day, newStart);
    }
  };

  const handleShiftDay = (section: CourseSection, dayDelta: number) => {
    const currentIndex = DAYS.indexOf(section.day);
    const newIndex = currentIndex + dayDelta;
    if (newIndex >= 0 && newIndex < DAYS.length) {
      moveSectionTime(section.id, DAYS[newIndex], section.startHour);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Telemetry & Health Bar */}
      <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>QUALITY SCORE</span>
            <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          </div>
          <div className="mt-1 flex items-baseline space-x-1">
            <span className={`text-2xl font-bold font-mono ${
              metrics.qualityScore >= 80 ? 'text-emerald-400' : metrics.qualityScore >= 60 ? 'text-amber-400' : 'text-rose-400'
            }`}>
              {metrics.qualityScore}%
            </span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Constraint fitness</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>TOTAL CREDITS</span>
            <CalendarDays className="w-3.5 h-3.5 text-purple-400" />
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-purple-400">
            {metrics.totalCredits} <span className="text-xs text-slate-400">hrs</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Active curriculum</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>CAMPUS DAYS</span>
            <Clock className="w-3.5 h-3.5 text-blue-400" />
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-blue-400">
            {metrics.campusDaysCount} <span className="text-xs text-slate-400">/ 5 days</span>
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Commute footprint</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800">
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>STUDY BLOCKS</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-emerald-400">
            {metrics.studyBlocksCount}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">Focus windows (≥2h)</p>
        </div>

        <div className="p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 col-span-2 md:col-span-1">
          <div className="text-[11px] text-slate-400 font-mono flex items-center justify-between">
            <span>HARD CONFLICTS</span>
            <AlertOctagon className={`w-3.5 h-3.5 ${conflicts.length > 0 ? 'text-rose-400 animate-pulse' : 'text-emerald-400'}`} />
          </div>
          <div className={`mt-1 text-2xl font-bold font-mono ${conflicts.length > 0 ? 'text-rose-400' : 'text-emerald-400'}`}>
            {conflicts.length}
          </div>
          <p className="text-[10px] text-slate-500 mt-0.5">
            {conflicts.length === 0 ? 'Feasible schedule' : 'Clash detected'}
          </p>
        </div>
      </div>

      {/* Conflicts Banner if any */}
      {conflicts.length > 0 && (
        <div className="p-4 rounded-xl bg-rose-950/40 border border-rose-800/80 text-rose-200">
          <div className="flex items-start space-x-3">
            <AlertOctagon className="w-5 h-5 text-rose-400 flex-shrink-0 mt-0.5" />
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-rose-300 font-mono">
                Schedule Conflict Infeasibility Detected ({conflicts.length})
              </h4>
              <div className="mt-2 space-y-1">
                {conflicts.map((c, idx) => (
                  <div key={idx} className="text-xs bg-rose-900/30 p-2 rounded border border-rose-800/50 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-rose-200">{c.description}</span>
                      <span className="text-rose-400 ml-2">
                        ({c.sectionA.courseCode} vs {c.sectionB.courseCode} on {c.sectionA.day})
                      </span>
                    </div>
                    <button
                      onClick={() => setActiveTab('generator')}
                      className="px-2 py-0.5 rounded bg-rose-800/60 hover:bg-rose-700 text-rose-100 text-[11px]"
                    >
                      Auto-Resolve
                    </button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Main Weekly Grid */}
      <div className="bg-[#0B132B]/60 border border-slate-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="p-4 border-b border-slate-800/80 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-semibold text-white">Active Timetable Matrix</h3>
            <p className="text-xs text-slate-400">Weekly breakdown (08:00 – 18:00). Click any block to inspect or shift time slots.</p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-cyan-500/30 border border-cyan-400"></span>
              <span className="text-slate-300">Lecture</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-purple-500/30 border border-purple-400"></span>
              <span className="text-slate-300">Lab</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-emerald-500/30 border border-emerald-400"></span>
              <span className="text-slate-300">Seminar</span>
            </div>
          </div>
        </div>

        {/* Calendar Viewport */}
        <div className="overflow-x-auto">
          <div className="min-w-[850px]">
            {/* Header Days */}
            <div className="grid grid-cols-6 border-b border-slate-800 bg-slate-900/60 text-xs font-mono font-medium text-slate-400 text-center py-2.5">
              <div className="text-slate-500 border-r border-slate-800/50">TIME</div>
              {DAYS.map((day) => {
                const daySections = activeSections.filter((s) => s.day === day);
                return (
                  <div key={day} className="border-r border-slate-800/50 last:border-r-0">
                    <span className="text-white font-bold">{day}</span>
                    <span className="text-[10px] text-slate-500 ml-1">({daySections.length} sessions)</span>
                  </div>
                );
              })}
            </div>

            {/* Time Rows */}
            <div className="divide-y divide-slate-800/60 font-mono text-xs">
              {HOURS.map((hour) => {
                const hourFormatted = `${hour.toString().padStart(2, '0')}:00`;
                return (
                  <div key={hour} className="grid grid-cols-6 min-h-[64px]">
                    {/* Hour Column */}
                    <div className="p-2 border-r border-slate-800/50 text-[11px] text-slate-500 font-mono bg-slate-950/40 flex items-start justify-center">
                      {hourFormatted}
                    </div>

                    {/* Day Cells */}
                    {DAYS.map((day) => {
                      const sectionsStartingNow = getSectionsForDayAndHour(day, hour);
                      // Check if there is an overlapping section spanning this hour
                      const isSpanned = activeSections.some(
                        (s) => s.day === day && hour > s.startHour && hour < s.endHour
                      );

                      return (
                        <div
                          key={`${day}-${hour}`}
                          className={`border-r border-slate-800/40 last:border-r-0 p-1 relative transition-colors ${
                            isSpanned ? 'bg-slate-900/20' : 'hover:bg-slate-800/20'
                          }`}
                        >
                          {sectionsStartingNow.map((section) => {
                            const duration = section.endHour - section.startHour;
                            const isConflict = conflicts.some(
                              (c) => c.sectionA.id === section.id || c.sectionB.id === section.id
                            );

                            return (
                              <div
                                key={section.id}
                                onClick={() => setSelectedSection(section)}
                                style={{
                                  height: `${duration * 62}px`,
                                  zIndex: 10,
                                }}
                                className={`absolute inset-x-1 rounded-lg p-2 transition-all cursor-pointer shadow-md flex flex-col justify-between border ${
                                  isConflict
                                    ? 'bg-rose-950/80 border-rose-500 text-rose-100 ring-2 ring-rose-500/50'
                                    : section.type === 'lab'
                                    ? 'bg-purple-950/60 border-purple-500/60 text-purple-100 hover:border-purple-400'
                                    : section.type === 'seminar'
                                    ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-100 hover:border-emerald-400'
                                    : 'bg-cyan-950/60 border-cyan-500/60 text-cyan-100 hover:border-cyan-400'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-xs tracking-tight">{section.courseCode}</span>
                                    <span className="text-[10px] uppercase font-mono px-1 rounded bg-black/40">
                                      {section.type}
                                    </span>
                                  </div>
                                  <p className="text-[11px] font-sans font-medium line-clamp-1 opacity-90">
                                    {section.courseName}
                                  </p>
                                </div>

                                <div className="text-[10px] space-y-0.5 opacity-80 font-sans">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-2.5 h-2.5" />
                                    <span>{section.room}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <User className="w-2.5 h-2.5" />
                                    <span className="truncate">{section.instructor}</span>
                                  </div>
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      );
                    })}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>

      {/* Selected Section Inspector Modal/Drawer */}
      {selectedSection && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase">
                  {selectedSection.type}
                </span>
                <h3 className="text-xl font-bold text-white mt-1.5">{selectedSection.courseCode}</h3>
                <p className="text-sm text-slate-300">{selectedSection.courseName}</p>
              </div>
              <button
                onClick={() => setSelectedSection(null)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 my-5 text-xs font-mono">
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-500">SCHEDULE</span>
                <p className="text-white font-semibold mt-1">
                  {selectedSection.day} {selectedSection.startHour}:00 – {selectedSection.endHour}:00
                </p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-500">LOCATION</span>
                <p className="text-white font-semibold mt-1">{selectedSection.room}</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-500">INSTRUCTOR</span>
                <p className="text-white font-semibold mt-1 truncate">{selectedSection.instructor}</p>
              </div>
              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800">
                <span className="text-slate-500">CREDIT WEIGHT</span>
                <p className="text-white font-semibold mt-1">{selectedSection.credits} Units</p>
              </div>
            </div>

            {/* Shift Controls */}
            <div className="space-y-3 pt-3 border-t border-slate-800">
              <span className="text-xs font-semibold text-slate-300">Live Constraint Adjustment:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleShiftDay(selectedSection, -1)}
                    disabled={DAYS.indexOf(selectedSection.day) === 0}
                    className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded flex items-center justify-center space-x-1 text-slate-200"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev Day</span>
                  </button>
                  <button
                    onClick={() => handleShiftDay(selectedSection, 1)}
                    disabled={DAYS.indexOf(selectedSection.day) === DAYS.length - 1}
                    className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded flex items-center justify-center space-x-1 text-slate-200"
                  >
                    <span>Next Day</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleShiftTime(selectedSection, -1)}
                    disabled={selectedSection.startHour <= 8}
                    className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded flex items-center justify-center space-x-1 text-slate-200"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>-1 Hour</span>
                  </button>
                  <button
                    onClick={() => handleShiftTime(selectedSection, 1)}
                    disabled={selectedSection.endHour >= 18}
                    className="flex-1 py-1.5 px-2 bg-slate-800 hover:bg-slate-700 disabled:opacity-40 rounded flex items-center justify-center space-x-1 text-slate-200"
                  >
                    <span>+1 Hour</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              <div className="flex items-center justify-between pt-3">
                <button
                  onClick={() => {
                    removeActiveSection(selectedSection.id);
                    setSelectedSection(null);
                  }}
                  className="px-3 py-1.5 text-xs rounded-lg text-rose-400 hover:bg-rose-950/40 border border-rose-800/40 flex items-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove from Schedule</span>
                </button>
                <button
                  onClick={() => setSelectedSection(null)}
                  className="px-4 py-1.5 text-xs rounded-lg bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-md shadow-cyan-600/30"
                >
                  Done
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
