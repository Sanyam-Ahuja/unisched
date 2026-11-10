import React from 'react';
import { useUniSchedStore } from '../../store/useUniSchedStore';
import { 
  Sparkles, 
  CheckCircle, 
  Sliders, 
  Layers, 
  ArrowRight, 
  Info,
  Calendar,
  Clock,
  BookOpen
} from 'lucide-react';

export const OptimizerStudio: React.FC = () => {
  const { 
    catalogSections, 
    requiredCourses, 
    preferences, 
    candidates,
    toggleCourseSelection, 
    updatePreferences, 
    runOptimizer, 
    applyCandidateSchedule,
    selectedCandidateId 
  } = useUniSchedStore();

  // Extract unique course codes and names from catalog
  const uniqueCourses = Array.from(
    new Map(catalogSections.map((s) => [s.courseCode, s])).values()
  );

  return (
    <div className="space-y-6">
      {/* Title & Introduction */}
      <div className="bg-[#0B132B]/80 border border-slate-800 rounded-2xl p-6 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center space-x-2">
              <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase font-semibold">
                CSP Backtracking Engine
              </span>
              <span className="text-xs text-slate-500 font-mono">Pruning Branch & Bound</span>
            </div>
            <h2 className="text-xl font-bold text-white mt-2">Constraint Optimization Studio</h2>
            <p className="text-sm text-slate-400 max-w-2xl mt-1">
              Select your required courses and soft preferences. The backtracking constraint solver prunes overlapping time-slots and evaluates feasible combinations against multi-objective fitness scores.
            </p>
          </div>

          <button
            onClick={runOptimizer}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-medium text-sm shadow-lg shadow-cyan-600/30 flex items-center space-x-2 self-start md:self-auto transition-all"
          >
            <Sparkles className="w-4 h-4 text-amber-300" />
            <span>Generate Schedules</span>
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column: Course Selection & Preferences */}
        <div className="space-y-6">
          {/* Required Courses Checklist */}
          <div className="bg-[#0B132B]/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3 mb-4">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center space-x-2">
                  <BookOpen className="w-4 h-4 text-cyan-400" />
                  <span>Required Courses ({requiredCourses.length})</span>
                </h3>
                <p className="text-xs text-slate-400 mt-0.5">Toggle courses to schedule</p>
              </div>
            </div>

            <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
              {uniqueCourses.map((c) => {
                const isSelected = requiredCourses.includes(c.courseCode);
                const sectionsCount = catalogSections.filter((s) => s.courseCode === c.courseCode).length;

                return (
                  <div
                    key={c.courseCode}
                    onClick={() => toggleCourseSelection(c.courseCode)}
                    className={`p-2.5 rounded-xl border cursor-pointer transition-all flex items-center justify-between ${
                      isSelected
                        ? 'bg-cyan-950/40 border-cyan-500/50 text-white'
                        : 'bg-slate-900/40 border-slate-800 text-slate-400 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center space-x-2">
                        <span className="font-mono font-bold text-xs">{c.courseCode}</span>
                        <span className="text-[10px] text-slate-400">({c.credits} cr)</span>
                      </div>
                      <p className="text-xs text-slate-300 line-clamp-1">{c.courseName}</p>
                    </div>

                    <div className="flex items-center space-x-2">
                      <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-slate-800 text-slate-400">
                        {sectionsCount} sects
                      </span>
                      <div className={`w-4 h-4 rounded border flex items-center justify-center ${
                        isSelected ? 'bg-cyan-500 border-cyan-400 text-slate-950' : 'border-slate-700'
                      }`}>
                        {isSelected && <CheckCircle className="w-3.5 h-3.5" />}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Soft Preferences */}
          <div className="bg-[#0B132B]/60 border border-slate-800 rounded-2xl p-5 shadow-lg">
            <div className="flex items-center space-x-2 border-b border-slate-800 pb-3 mb-4">
              <Sliders className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">Soft Optimization Goals</h3>
            </div>

            <div className="space-y-3">
              <label className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={preferences.preferCompactDays}
                  onChange={(e) => updatePreferences({ preferCompactDays: e.target.checked })}
                  className="mt-1 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <div>
                  <span className="text-xs font-semibold text-white">Compress Campus Days</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Maximize class clustering on fewer total days (3-day vs 5-day week).</p>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={preferences.minimizeMorningClasses}
                  onChange={(e) => updatePreferences({ minimizeMorningClasses: e.target.checked })}
                  className="mt-1 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <div>
                  <span className="text-xs font-semibold text-white">Avoid 08:00 AM Starts</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Penalize early morning sessions in fitness scoring.</p>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={preferences.minimizeFragmentedGaps}
                  onChange={(e) => updatePreferences({ minimizeFragmentedGaps: e.target.checked })}
                  className="mt-1 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <div>
                  <span className="text-xs font-semibold text-white">Eliminate Idle 1-Hour Gaps</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Reduce awkward dead time between lectures.</p>
                </div>
              </label>

              <label className="flex items-start space-x-3 p-2.5 rounded-xl bg-slate-900/40 border border-slate-800/80 cursor-pointer hover:border-slate-700">
                <input
                  type="checkbox"
                  checked={preferences.maximizeStudyBlocks}
                  onChange={(e) => updatePreferences({ maximizeStudyBlocks: e.target.checked })}
                  className="mt-1 rounded border-slate-700 bg-slate-800 text-cyan-500 focus:ring-cyan-500"
                />
                <div>
                  <span className="text-xs font-semibold text-white">Reward Focused Study Blocks</span>
                  <p className="text-[11px] text-slate-400 mt-0.5">Reward continuous free windows of ≥2 hours during the day.</p>
                </div>
              </label>
            </div>
          </div>
        </div>

        {/* Right Column: Generated Candidates */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-base font-bold text-white flex items-center space-x-2">
              <Layers className="w-4 h-4 text-amber-400" />
              <span>Optimized Schedule Candidates ({candidates.length})</span>
            </h3>
            <span className="text-xs text-slate-400 font-mono">Ranked by Fitness Score</span>
          </div>

          {candidates.length === 0 ? (
            <div className="p-8 text-center bg-[#0B132B]/40 border border-slate-800 rounded-2xl">
              <Info className="w-8 h-8 text-slate-500 mx-auto mb-2" />
              <p className="text-slate-300 font-medium">No Conflict-Free Solutions Found</p>
              <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
                The current course selection contains inescapable timing clashes. Try deselecting a course or adding more sections in the Catalog.
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {candidates.map((cand, idx) => {
                const isSelected = selectedCandidateId === cand.id;

                return (
                  <div
                    key={cand.id}
                    className={`rounded-2xl border p-5 transition-all flex flex-col justify-between ${
                      isSelected
                        ? 'bg-gradient-to-br from-cyan-950/40 to-slate-900 border-cyan-500/80 shadow-lg shadow-cyan-500/10 ring-1 ring-cyan-500/30'
                        : 'bg-[#0B132B]/60 border-slate-800 hover:border-slate-700'
                    }`}
                  >
                    <div>
                      <div className="flex items-center justify-between">
                        <span className="text-xs font-mono font-bold text-slate-400">
                          RANK #{idx + 1}
                        </span>
                        <div className="flex items-center space-x-1">
                          <span className={`text-sm font-bold font-mono ${
                            cand.metrics.qualityScore >= 80 ? 'text-emerald-400' : 'text-amber-400'
                          }`}>
                            {cand.metrics.qualityScore}%
                          </span>
                          <span className="text-[10px] text-slate-500 font-mono">fitness</span>
                        </div>
                      </div>

                      <h4 className="text-base font-bold text-white mt-2">{cand.title}</h4>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {cand.sections.length} course sections scheduled
                      </p>

                      {/* Metrics Badges */}
                      <div className="grid grid-cols-3 gap-2 my-4 text-xs font-mono">
                        <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80 text-center">
                          <span className="text-[10px] text-slate-500 block">DAYS</span>
                          <span className="font-bold text-cyan-400">{cand.metrics.campusDaysCount}d / wk</span>
                        </div>
                        <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80 text-center">
                          <span className="text-[10px] text-slate-500 block">GAPS</span>
                          <span className="font-bold text-amber-400">{cand.metrics.fragmentedGapsCount}</span>
                        </div>
                        <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80 text-center">
                          <span className="text-[10px] text-slate-500 block">FOCUS</span>
                          <span className="font-bold text-emerald-400">{cand.metrics.studyBlocksCount} blks</span>
                        </div>
                      </div>

                      {/* Sections breakdown */}
                      <div className="space-y-1.5 text-xs font-mono border-t border-slate-800/80 pt-3">
                        {cand.sections.map((s) => (
                          <div key={s.id} className="flex items-center justify-between text-slate-300">
                            <span className="font-semibold text-white">{s.courseCode}</span>
                            <span className="text-slate-400 text-[11px]">
                              {s.day} {s.startHour}:00–{s.endHour}:00 ({s.room})
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-slate-800/60">
                      <button
                        onClick={() => applyCandidateSchedule(cand.id)}
                        className={`w-full py-2 px-3 rounded-xl font-medium text-xs flex items-center justify-center space-x-1.5 transition-all ${
                          isSelected
                            ? 'bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 cursor-default'
                            : 'bg-slate-800 hover:bg-slate-700 text-white'
                        }`}
                      >
                        <span>{isSelected ? 'Currently Applied' : 'Apply to Calendar'}</span>
                        <ArrowRight className="w-3.5 h-3.5 ml-1" />
                      </button>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
