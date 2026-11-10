import React from 'react';
import { useUniSchedStore } from '../../store/useUniSchedStore';
import { OptimizationPreferences } from '../../types';
import { Bullet, Sign } from '../Transit';
import { StripMap } from '../StripMap';
import { Check, Route } from 'lucide-react';

const PREFS: { k: keyof OptimizationPreferences; label: string; hint: string }[] = [
  { k: 'preferCompactDays', label: 'Fewer days on campus', hint: 'Pack classes into as few days as possible.' },
  { k: 'minimizeMorningClasses', label: 'No 08:00 starts', hint: 'Penalise anything that begins at eight.' },
  { k: 'minimizeFragmentedGaps', label: 'No dead hours', hint: 'Avoid single free hours stuck between classes.' },
  { k: 'maximizeStudyBlocks', label: 'Keep study blocks', hint: 'Reward free stretches of two hours or more.' },
];

export const OptimizerStudio: React.FC = () => {
  const { catalogSections, requiredCourses, preferences, candidates, toggleCourseSelection, updatePreferences, runOptimizer, applyCandidateSchedule, selectedCandidateId } = useUniSchedStore();
  const courses = Array.from(new Map(catalogSections.map((s) => [s.courseCode, s])).values());

  return (
    <div>
      <Sign title="Plan a route" note="Choose the lines you must ride and how you like to travel. The solver tries every combination of sections, throws out the ones that clash, and ranks the rest."
        right={<button className="tbtn !bg-white !text-sign hover:!bg-[#fccc0a]" onClick={runOptimizer}><Route size={18} /> Find routes</button>} />

      <div className="grid lg:grid-cols-[340px_minmax(0,1fr)] gap-8 items-start">
        <aside className="space-y-8">
          <section>
            <h2 className="cap mb-3">Lines you need · {requiredCourses.length}</h2>
            <ul className="space-y-1.5">
              {courses.map((c) => {
                const on = requiredCourses.includes(c.courseCode);
                const n = catalogSections.filter((s) => s.courseCode === c.courseCode).length;
                return (
                  <li key={c.courseCode}>
                    <button onClick={() => toggleCourseSelection(c.courseCode)} aria-pressed={on}
                      className={`w-full flex items-center gap-3 p-2.5 rounded-md text-left border-2 ${on ? 'bg-tile border-sign' : 'border-transparent hover:bg-tile/60 opacity-70 hover:opacity-100'}`}>
                      <Bullet code={c.courseCode} size={34} hollow={!on} />
                      <span className="flex-1 min-w-0">
                        <span className="font-bold block leading-tight truncate">{c.courseName}</span>
                        <span className="text-[13px] text-steel">{n} sections · {c.credits} cr</span>
                      </span>
                      <span className={`w-5 h-5 rounded grid place-items-center ${on ? 'bg-sign text-white' : 'border-2 border-rail'}`}>{on && <Check size={14} strokeWidth={3} />}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </section>
          <section>
            <h2 className="cap mb-3">How you like to travel</h2>
            <div className="space-y-3">
              {PREFS.map((p) => {
                const on = preferences[p.k];
                return (
                  <label key={p.k} className="flex items-start gap-3 cursor-pointer">
                    <button role="switch" aria-checked={on} onClick={() => updatePreferences({ [p.k]: !on })}
                      className={`mt-0.5 w-11 h-6 rounded-full relative shrink-0 transition-colors ${on ? 'bg-ok' : 'bg-rail'}`}>
                      <span className={`absolute top-0.5 w-5 h-5 rounded-full bg-white shadow transition-all ${on ? 'left-[22px]' : 'left-0.5'}`} />
                    </button>
                    <span><span className="font-bold block">{p.label}</span><span className="text-[13px] text-steel">{p.hint}</span></span>
                  </label>
                );
              })}
            </div>
          </section>
        </aside>

        <section>
          <h2 className="cap mb-3">{candidates.length} route{candidates.length === 1 ? '' : 's'} found · best first</h2>
          {candidates.length === 0 ? (
            <div className="bg-tile rounded-md border-2 border-alert p-8 text-center">
              <p className="signtext text-[22px]">No clash-free route</p>
              <p className="text-steel mt-2">Every combination of these lines overlaps somewhere. Drop a line, or add another section of it in “All lines”.</p>
            </div>
          ) : (
            <div className="space-y-4">
              {candidates.map((c, i) => {
                const on = selectedCandidateId === c.id;
                return (
                  <article key={c.id} className={`bg-tile rounded-md border-2 ${on ? 'border-sign' : 'border-rail'} p-5 grid md:grid-cols-[110px_minmax(0,1fr)_auto] gap-5 items-center`}>
                    <div>
                      <div className="cap">Route {i + 1}</div>
                      <div className={`signtext text-[44px] leading-none ${c.metrics.qualityScore >= 80 ? 'text-ok' : ''}`}>{c.metrics.qualityScore}</div>
                      <div className="text-[13px] text-steel">score</div>
                    </div>
                    <div className="min-w-0">
                      <div className="font-bold mb-3">{c.title}</div>
                      <StripMap sections={c.sections} />
                      <div className="flex flex-wrap gap-x-5 gap-y-1 text-[13.5px] text-steel mt-3">
                        <span><b className="text-sign">{c.metrics.campusDaysCount}</b> day{c.metrics.campusDaysCount === 1 ? '' : 's'}</span>
                        <span><b className="text-sign">{c.metrics.fragmentedGapsCount}</b> dead hour{c.metrics.fragmentedGapsCount === 1 ? '' : 's'}</span>
                        <span><b className="text-sign">{c.metrics.studyBlocksCount}</b> study block{c.metrics.studyBlocksCount === 1 ? '' : 's'}</span>
                        <span><b className="text-sign">{c.metrics.totalCredits}</b> credits</span>
                      </div>
                    </div>
                    <button className={`tbtn ${on ? '!bg-ok' : ''}`} onClick={() => applyCandidateSchedule(c.id)} disabled={on}>
                      {on ? <><Check size={16} /> Riding this</> : 'Use this route'}
                    </button>
                  </article>
                );
              })}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};
