import React, { useState } from 'react';
import { useUniSchedStore } from '../../store/useUniSchedStore';
import { DayOfWeek } from '../../types';
import { Bullet, hh, line } from '../Transit';
import { ChevronDown, ChevronLeft, ChevronRight, ChevronUp, X } from 'lucide-react';

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const START = 8, END = 18, ROW = 56;

export const WeeklyCalendar: React.FC = () => {
  const { activeSections, conflicts, metrics, moveSectionTime, removeActiveSection, setActiveTab } = useUniSchedStore();
  const [selId, setSelId] = useState<string | null>(null);
  const sel = activeSections.find((s) => s.id === selId) || null;
  const clashing = (id: string) => conflicts.some((c) => c.sectionA.id === id || c.sectionB.id === id);

  const shiftHour = (d: number) => { if (!sel) return; const s = sel.startHour + d, len = sel.endHour - sel.startHour; if (s >= START && s + len <= END) moveSectionTime(sel.id, sel.day, s); };
  const shiftDay = (d: number) => { if (!sel) return; const i = DAYS.indexOf(sel.day) + d; if (i >= 0 && i < DAYS.length) moveSectionTime(sel.id, DAYS[i], sel.startHour); };

  const status = [
    ['Score', `${metrics.qualityScore}`, metrics.qualityScore >= 80 ? 'text-ok' : metrics.qualityScore >= 60 ? 'text-[#b07d00]' : 'text-alert'],
    ['Credits', `${metrics.totalCredits}`, ''],
    ['Days on campus', `${metrics.campusDaysCount}/5`, ''],
    ['1-hour gaps', `${metrics.fragmentedGapsCount}`, metrics.fragmentedGapsCount ? 'text-[#b07d00]' : ''],
    ['Study blocks ≥2h', `${metrics.studyBlocksCount}`, ''],
    ['Clashes', `${conflicts.length}`, conflicts.length ? 'text-alert' : 'text-ok'],
  ];

  return (
    <div>
      {/* departure-board style status line */}
      <div className="grid grid-cols-3 md:grid-cols-6 bg-tile rounded-md border-2 border-sign mb-6">
        {status.map(([k, v, c], i) => (
          <div key={k} className={`px-4 py-3 ${i % 3 !== 2 ? 'border-r-2' : ''} md:border-r-2 md:last:border-r-0 ${i < 3 ? 'border-b-2 md:border-b-0' : ''} border-sign`}>
            <div className="cap">{k}</div>
            <div className={`signtext text-[30px] leading-none mt-1 ${c}`}>{v}</div>
          </div>
        ))}
      </div>

      {conflicts.length > 0 && (
        <div className="bg-alert text-white rounded-md px-4 py-3 mb-6 flex flex-wrap items-center gap-x-4 gap-y-1">
          <span className="signtext text-[17px]">Service change</span>
          {conflicts.map((c, i) => <span key={i} className="text-[14px]">{c.description}</span>)}
          <button className="ml-auto underline font-bold text-[14px]" onClick={() => setActiveTab('generator')}>Re-plan route</button>
        </div>
      )}

      <div className="grid xl:grid-cols-[minmax(0,1fr)_320px] gap-6 items-start">
        <section className="bg-tile rounded-md border-2 border-sign overflow-x-auto">
          <div className="min-w-[720px]">
            <div className="grid grid-cols-[64px_repeat(5,1fr)] band rounded-t-[4px]">
              <span />
              {DAYS.map((d) => <span key={d} className="signtext text-[17px] px-3 pt-3 pb-2">{d}</span>)}
            </div>
            <div className="grid grid-cols-[64px_repeat(5,1fr)] relative">
              <div>
                {Array.from({ length: END - START }).map((_, i) => (
                  <div key={i} className="text-[12px] font-semibold text-steel pr-2 text-right border-b border-rail" style={{ height: ROW }}>{hh(START + i)}</div>
                ))}
              </div>
              {DAYS.map((d) => (
                <div key={d} className="relative border-l border-rail" style={{ height: ROW * (END - START) }}>
                  {Array.from({ length: END - START }).map((_, i) => <div key={i} className="border-b border-rail" style={{ height: ROW }} />)}
                  {activeSections.filter((s) => s.day === d).map((s) => {
                    const c = line(s.courseCode);
                    const bad = clashing(s.id);
                    return (
                      <button key={s.id} onClick={() => setSelId(s.id)}
                        className={`absolute left-1 right-1 rounded-md p-2 text-left overflow-hidden transition-transform hover:-translate-y-0.5 ${sel?.id === s.id ? 'ring-[3px] ring-sign ring-offset-2' : ''} ${bad ? 'outline-[3px] outline-dashed outline-alert outline-offset-[-3px]' : ''}`}
                        style={{ top: (s.startHour - START) * ROW + 3, height: (s.endHour - s.startHour) * ROW - 6, background: c.bg, color: c.fg }}>
                        <span className="signtext block text-[15px] leading-tight">{s.courseCode}</span>
                        <span className="block text-[12.5px] leading-tight opacity-90 truncate">{s.type} · {s.room}</span>
                        {bad && <span className="absolute bottom-1.5 right-1.5 bg-alert text-white text-[11px] font-bold px-1.5 rounded">clash</span>}
                      </button>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        </section>

        <aside className="bg-tile rounded-md border-2 border-sign xl:sticky xl:top-6">
          {sel ? (
            <div>
              <div className="flex justify-between items-start gap-3 p-4" style={{ background: line(sel.courseCode).bg, color: line(sel.courseCode).fg }}>
                <div>
                  <div className="text-[12px] font-bold uppercase tracking-wider opacity-85">{sel.type} · {sel.credits} credits</div>
                  <div className="signtext text-[26px] leading-none mt-1">{sel.courseCode}</div>
                  <div className="text-[14px] mt-1">{sel.courseName}</div>
                </div>
                <button onClick={() => setSelId(null)} aria-label="Close"><X size={20} /></button>
              </div>
              <dl className="p-4 space-y-2 text-[14.5px]">
                <div className="flex justify-between"><dt className="text-steel">When</dt><dd className="font-semibold">{sel.day} {hh(sel.startHour)}–{hh(sel.endHour)}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-steel">Where</dt><dd className="font-semibold text-right">{sel.room}</dd></div>
                <div className="flex justify-between gap-3"><dt className="text-steel">Who</dt><dd className="font-semibold text-right">{sel.instructor}</dd></div>
              </dl>
              <div className="px-4 pb-4">
                <div className="cap mb-2">Move this departure</div>
                <div className="grid grid-cols-4 gap-1.5">
                  <button className="tbtn tbtn-quiet !px-0" onClick={() => shiftDay(-1)} disabled={DAYS.indexOf(sel.day) === 0} aria-label="Previous day"><ChevronLeft size={18} /></button>
                  <button className="tbtn tbtn-quiet !px-0" onClick={() => shiftHour(-1)} disabled={sel.startHour <= START} aria-label="One hour earlier"><ChevronUp size={18} /></button>
                  <button className="tbtn tbtn-quiet !px-0" onClick={() => shiftHour(1)} disabled={sel.endHour >= END} aria-label="One hour later"><ChevronDown size={18} /></button>
                  <button className="tbtn tbtn-quiet !px-0" onClick={() => shiftDay(1)} disabled={DAYS.indexOf(sel.day) === DAYS.length - 1} aria-label="Next day"><ChevronRight size={18} /></button>
                </div>
                <button className="w-full mt-3 text-[14px] font-bold text-alert underline" onClick={() => { removeActiveSection(sel.id); setSelId(null); }}>Drop this section</button>
              </div>
            </div>
          ) : (
            <div className="p-4">
              <div className="cap mb-3">Lines this week</div>
              <ul className="space-y-2.5">
                {Array.from(new Map(activeSections.map((s) => [s.courseCode, s])).values()).map((s) => (
                  <li key={s.courseCode} className="flex items-center gap-3">
                    <Bullet code={s.courseCode} size={30} />
                    <span className="min-w-0">
                      <span className="font-bold block leading-tight truncate">{s.courseName}</span>
                      <span className="text-[13px] text-steel">{activeSections.filter((x) => x.courseCode === s.courseCode).length} departures · {s.credits} cr</span>
                    </span>
                  </li>
                ))}
              </ul>
              {activeSections.length === 0 && <p className="text-steel">No classes yet. <button className="underline font-bold text-sign" onClick={() => setActiveTab('generator')}>Plan a route</button>.</p>}
              <p className="text-[13px] text-steel mt-4">Pick any block to see where it is and nudge it to another slot.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
};
