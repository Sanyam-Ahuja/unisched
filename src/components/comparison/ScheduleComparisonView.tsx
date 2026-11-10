import React from 'react';
import { useUniSchedStore } from '../../store/useUniSchedStore';
import { Columns, Check, Star, ShieldCheck, Clock, CalendarDays, Award } from 'lucide-react';
import { DayOfWeek } from '../../types';

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

export const ScheduleComparisonView: React.FC = () => {
  const { candidates, selectedCandidateId, applyCandidateSchedule } = useUniSchedStore();

  if (candidates.length === 0) {
    return (
      <div className="p-12 text-center bg-[#0B132B]/60 border border-slate-800 rounded-2xl">
        <Columns className="w-12 h-12 text-slate-500 mx-auto mb-3" />
        <h3 className="text-lg font-bold text-white">No Schedule Candidates Available</h3>
        <p className="text-sm text-slate-400 mt-1 max-w-md mx-auto">
          Please run the optimizer in the Optimizer Studio to produce candidate schedules for comparison.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="bg-[#0B132B]/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono px-2 py-0.5 rounded bg-purple-500/10 text-purple-400 border border-purple-500/20 uppercase font-semibold">
            Candidate Trade-Off Matrix
          </span>
        </div>
        <h2 className="text-xl font-bold text-white mt-2">Side-by-Side Schedule Comparison</h2>
        <p className="text-sm text-slate-400 max-w-2xl mt-1">
          Evaluate trade-offs between different valid timetables. Compare commute frequency, study blocks, and idle waiting gaps across candidates.
        </p>
      </div>

      {/* Comparison Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {candidates.map((cand, idx) => {
          const isSelected = selectedCandidateId === cand.id;

          return (
            <div
              key={cand.id}
              className={`rounded-2xl border p-5 flex flex-col justify-between transition-all relative ${
                isSelected
                  ? 'bg-slate-900 border-cyan-500 ring-2 ring-cyan-500/20 shadow-xl'
                  : 'bg-[#0B132B]/60 border-slate-800 hover:border-slate-700'
              }`}
            >
              {idx === 0 && (
                <div className="absolute -top-3 right-4 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-400/50 text-amber-300 text-[10px] font-mono flex items-center space-x-1 font-bold">
                  <Award className="w-3 h-3" />
                  <span>TOP RECOMMENDED</span>
                </div>
              )}

              <div>
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono font-bold text-slate-400">
                    OPTION 0{idx + 1}
                  </span>
                  <div className="flex items-center space-x-1">
                    <span className={`text-base font-bold font-mono ${
                      cand.metrics.qualityScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                    }`}>
                      {cand.metrics.qualityScore}%
                    </span>
                  </div>
                </div>

                <h3 className="text-base font-bold text-white mt-1">{cand.title}</h3>

                {/* Score Breakdown Table */}
                <div className="my-4 space-y-2 text-xs font-mono">
                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">Campus Days:</span>
                    <span className="font-bold text-cyan-400">{cand.metrics.campusDaysCount} days / wk</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">Fragmented Gaps:</span>
                    <span className={`font-bold ${cand.metrics.fragmentedGapsCount === 0 ? 'text-emerald-400' : 'text-amber-400'}`}>
                      {cand.metrics.fragmentedGapsCount} (1-hr idle)
                    </span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">Study Blocks (≥2h):</span>
                    <span className="font-bold text-emerald-400">{cand.metrics.studyBlocksCount} continuous</span>
                  </div>

                  <div className="flex items-center justify-between p-2 rounded-lg bg-slate-950/60 border border-slate-800">
                    <span className="text-slate-400">Total Credits:</span>
                    <span className="font-bold text-purple-400">{cand.metrics.totalCredits} credit hrs</span>
                  </div>
                </div>

                {/* Micro Weekly Heatmap */}
                <div className="border border-slate-800/80 rounded-xl p-3 bg-slate-950/40">
                  <span className="text-[10px] text-slate-500 font-mono block mb-2">WEEKLY FOOTPRINT</span>
                  <div className="grid grid-cols-5 gap-1.5 text-center">
                    {DAYS.map((day) => {
                      const daySecs = cand.sections.filter((s) => s.day === day);
                      const hasClass = daySecs.length > 0;
                      return (
                        <div key={day} className="space-y-1">
                          <span className="text-[10px] font-mono text-slate-400">{day}</span>
                          <div className={`h-8 rounded flex items-center justify-center text-[10px] font-mono font-bold ${
                            hasClass ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40' : 'bg-slate-900 text-slate-600'
                          }`}>
                            {hasClass ? `${daySecs.length}` : '—'}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Section List */}
                <div className="mt-4 space-y-1.5 max-h-36 overflow-y-auto pr-1">
                  {cand.sections.map((sec) => (
                    <div key={sec.id} className="text-[11px] p-1.5 rounded bg-slate-900/50 border border-slate-800/60 flex items-center justify-between">
                      <span className="font-bold text-slate-200">{sec.courseCode}</span>
                      <span className="text-slate-400 font-mono text-[10px]">
                        {sec.day} {sec.startHour}:00-{sec.endHour}:00
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="pt-4 mt-4 border-t border-slate-800">
                <button
                  onClick={() => applyCandidateSchedule(cand.id)}
                  className={`w-full py-2 px-3 rounded-xl font-medium text-xs flex items-center justify-center space-x-1.5 transition-all ${
                    isSelected
                      ? 'bg-cyan-500 text-slate-950 font-bold shadow-md shadow-cyan-500/30'
                      : 'bg-slate-800 hover:bg-slate-700 text-white'
                  }`}
                >
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Active Selection</span>
                    </>
                  ) : (
                    <span>Choose This Schedule</span>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
