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
  ShieldCheck
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
        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>QUALITY SCORE</span>
            <Sparkles className="w-3.5 h-3.5 text-indigo-600" />
          </div>
          <div className="mt-1 flex items-baseline space-x-1">
            <span className={`text-2xl font-bold font-mono ${
              metrics.qualityScore >= 80 ? 'text-emerald-600' : metrics.qualityScore >= 60 ? 'text-amber-600' : 'text-rose-600'
            }`}>
              {metrics.qualityScore}%
            </span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Constraint fitness</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>TOTAL CREDITS</span>
            <CalendarDays className="w-3.5 h-3.5 text-purple-600" />
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-purple-700">
            {metrics.totalCredits} <span className="text-xs text-slate-400">hrs</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Active curriculum</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>CAMPUS DAYS</span>
            <Clock className="w-3.5 h-3.5 text-blue-600" />
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-blue-700">
            {metrics.campusDaysCount} <span className="text-xs text-slate-400">/ 5 days</span>
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Commute footprint</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs">
          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>STUDY BLOCKS</span>
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
          </div>
          <div className="mt-1 text-2xl font-bold font-mono text-emerald-700">
            {metrics.studyBlocksCount}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">Focus windows (≥2h)</p>
        </div>

        <div className="p-4 rounded-2xl bg-white border border-slate-200 shadow-xs col-span-2 md:col-span-1">
          <div className="text-[11px] text-slate-500 font-mono flex items-center justify-between">
            <span>HARD CONFLICTS</span>
            <AlertOctagon className={`w-3.5 h-3.5 ${conflicts.length > 0 ? 'text-rose-600 animate-pulse' : 'text-emerald-600'}`} />
          </div>
          <div className={`mt-1 text-2xl font-bold font-mono ${conflicts.length > 0 ? 'text-rose-600' : 'text-emerald-700'}`}>
            {conflicts.length}
          </div>
          <p className="text-[10px] text-slate-400 mt-0.5">
            {conflicts.length === 0 ? 'Feasible schedule' : 'Clash detected'}
          </p>
        </div>
      </div>

      {/* Main Weekly Grid */}
      <div className="bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-xs">
        <div className="p-4 border-b border-slate-200 flex flex-wrap items-center justify-between gap-3">
          <div>
            <h3 className="text-base font-bold text-slate-900">Active Timetable Matrix</h3>
            <p className="text-xs text-slate-500">Weekly breakdown (08:00 – 18:00). Click any block to inspect or shift time slots.</p>
          </div>
          <div className="flex items-center space-x-3 text-xs">
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-indigo-50 border-l-2 border-indigo-600"></span>
              <span className="text-slate-600 font-medium">Lecture</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-purple-50 border-l-2 border-purple-600"></span>
              <span className="text-slate-600 font-medium">Lab</span>
            </div>
            <div className="flex items-center space-x-1.5">
              <span className="w-3 h-3 rounded bg-emerald-50 border-l-2 border-emerald-600"></span>
              <span className="text-slate-600 font-medium">Seminar</span>
            </div>
          </div>
        </div>

        {/* Calendar Viewport */}
        <div className="overflow-x-auto">
          <div className="min-w-[850px]">
            {/* Header Days */}
            <div className="grid grid-cols-6 border-b border-slate-200 bg-slate-50 text-xs font-mono font-medium text-slate-500 text-center py-2.5">
              <div className="text-slate-400 border-r border-slate-200">TIME</div>
              {DAYS.map((day) => {
                const daySections = activeSections.filter((s) => s.day === day);
                return (
                  <div key={day} className="border-r border-slate-200 last:border-r-0">
                    <span className="text-slate-900 font-bold">{day}</span>
                    <span className="text-[10px] text-slate-400 ml-1">({daySections.length} sessions)</span>
                  </div>
                );
              })}
            </div>

            {/* Time Rows */}
            <div className="divide-y divide-slate-100 font-mono text-xs">
              {HOURS.map((hour) => {
                const hourFormatted = `${hour.toString().padStart(2, '0')}:00`;
                return (
                  <div key={hour} className="grid grid-cols-6 min-h-[64px]">
                    <div className="p-2 border-r border-slate-200 text-[11px] text-slate-400 font-mono bg-slate-50/60 flex items-start justify-center">
                      {hourFormatted}
                    </div>

                    {DAYS.map((day) => {
                      const sectionsStartingNow = getSectionsForDayAndHour(day, hour);
                      const isSpanned = activeSections.some(
                        (s) => s.day === day && hour > s.startHour && hour < s.endHour
                      );

                      return (
                        <div
                          key={`${day}-${hour}`}
                          className={`border-r border-slate-100 last:border-r-0 p-1 relative transition-colors ${
                            isSpanned ? 'bg-slate-50/50' : 'hover:bg-slate-50'
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
                                className={`absolute inset-x-1 rounded-xl p-2.5 transition-all cursor-pointer shadow-xs flex flex-col justify-between border-l-4 ${
                                  isConflict
                                    ? 'bg-rose-50 border-rose-500 text-rose-900 ring-2 ring-rose-500/30'
                                    : section.type === 'lab'
                                    ? 'bg-purple-50 border-l-purple-600 border-t border-r border-b border-purple-200 text-purple-950'
                                    : section.type === 'seminar'
                                    ? 'bg-emerald-50 border-l-emerald-600 border-t border-r border-b border-emerald-200 text-emerald-950'
                                    : 'bg-indigo-50 border-l-indigo-600 border-t border-r border-b border-indigo-200 text-indigo-950'
                                }`}
                              >
                                <div>
                                  <div className="flex items-center justify-between">
                                    <span className="font-bold text-xs font-mono">{section.courseCode}</span>
                                    <span className="text-[9px] uppercase font-mono px-1 py-0.2 rounded bg-white/80 border border-slate-200">
                                      {section.type}
                                    </span>
                                  </div>
                                  <p className="text-[11px] font-sans font-semibold line-clamp-1 mt-0.5">
                                    {section.courseName}
                                  </p>
                                </div>

                                <div className="text-[10px] space-y-0.5 text-slate-600 font-sans">
                                  <div className="flex items-center space-x-1">
                                    <MapPin className="w-2.5 h-2.5 text-slate-400" />
                                    <span>{section.room}</span>
                                  </div>
                                  <div className="flex items-center space-x-1">
                                    <User className="w-2.5 h-2.5 text-slate-400" />
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

      {/* Selected Section Inspector Modal */}
      {selectedSection && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-lg w-full shadow-2xl relative">
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono px-2 py-0.5 rounded bg-indigo-100 text-indigo-800 uppercase font-bold">
                  {selectedSection.type}
                </span>
                <h3 className="text-xl font-bold text-slate-900 mt-1.5">{selectedSection.courseCode}</h3>
                <p className="text-sm text-slate-600">{selectedSection.courseName}</p>
              </div>
              <button
                onClick={() => setSelectedSection(null)}
                className="text-slate-400 hover:text-slate-800 text-lg p-1"
              >
                ✕
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 my-5 text-xs font-mono">
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500">SCHEDULE</span>
                <p className="text-slate-900 font-bold mt-1">
                  {selectedSection.day} {selectedSection.startHour}:00 – {selectedSection.endHour}:00
                </p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500">LOCATION</span>
                <p className="text-slate-900 font-bold mt-1">{selectedSection.room}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500">INSTRUCTOR</span>
                <p className="text-slate-900 font-bold mt-1 truncate">{selectedSection.instructor}</p>
              </div>
              <div className="p-3 bg-slate-50 rounded-xl border border-slate-200">
                <span className="text-slate-500">CREDITS</span>
                <p className="text-slate-900 font-bold mt-1">{selectedSection.credits} Units</p>
              </div>
            </div>

            {/* Shift Controls */}
            <div className="space-y-3 pt-3 border-t border-slate-200">
              <span className="text-xs font-bold text-slate-700">Live Constraint Adjustment:</span>
              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleShiftDay(selectedSection, -1)}
                    disabled={DAYS.indexOf(selectedSection.day) === 0}
                    className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded flex items-center justify-center space-x-1 text-slate-700"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>Prev Day</span>
                  </button>
                  <button
                    onClick={() => handleShiftDay(selectedSection, 1)}
                    disabled={DAYS.indexOf(selectedSection.day) === DAYS.length - 1}
                    className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded flex items-center justify-center space-x-1 text-slate-700"
                  >
                    <span>Next Day</span>
                    <ChevronRight className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="flex items-center space-x-1">
                  <button
                    onClick={() => handleShiftTime(selectedSection, -1)}
                    disabled={selectedSection.startHour <= 8}
                    className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded flex items-center justify-center space-x-1 text-slate-700"
                  >
                    <ChevronLeft className="w-3.5 h-3.5" />
                    <span>-1 Hour</span>
                  </button>
                  <button
                    onClick={() => handleShiftTime(selectedSection, 1)}
                    disabled={selectedSection.endHour >= 18}
                    className="flex-1 py-1.5 px-2 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 rounded flex items-center justify-center space-x-1 text-slate-700"
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
                  className="px-3 py-1.5 text-xs rounded-lg text-rose-600 hover:bg-rose-50 border border-rose-200 flex items-center space-x-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                  <span>Remove from Schedule</span>
                </button>
                <button
                  onClick={() => setSelectedSection(null)}
                  className="px-4 py-1.5 text-xs rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
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
