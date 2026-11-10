import React, { useState } from 'react';
import { useUniSchedStore } from '../../store/useUniSchedStore';
import { Bullet } from '../Transit';

type Tab = ReturnType<typeof useUniSchedStore.getState>['activeTab'];
const TABS: { id: Tab; label: string }[] = [
  { id: 'calendar', label: 'My week' },
  { id: 'generator', label: 'Plan a route' },
  { id: 'comparison', label: 'Compare' },
  { id: 'catalog', label: 'All lines' },
];

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, resetAll, activeSections, conflicts } = useUniSchedStore();
  const [confirm, setConfirm] = useState(false);
  const codes = Array.from(new Set(activeSections.map((s) => s.courseCode)));

  return (
    <header className="band">
      <div className="max-w-[1320px] mx-auto px-4 md:px-8 pt-6 pb-3 flex flex-wrap items-center gap-x-8 gap-y-3">
        <button onClick={() => setActiveTab('calendar')} className="signtext text-[26px] leading-none">UniSched</button>
        <div className="flex items-center gap-1.5" aria-label="Lines you ride this week">
          {codes.map((c) => <Bullet key={c} code={c} size={26} />)}
        </div>
        <span className={`text-[14px] font-semibold flex items-center gap-2 ${conflicts.length ? 'text-[#ffb3ae]' : 'text-white/80'}`}>
          <span className={`w-2.5 h-2.5 rounded-full ${conflicts.length ? 'bg-alert' : 'bg-ok'}`} />
          {conflicts.length ? `Service change · ${conflicts.length} clash${conflicts.length > 1 ? 'es' : ''}` : 'Good service'}
        </span>
        <span className="ml-auto text-[13px]">
          {confirm ? (
            <span className="flex gap-3"><button className="underline font-bold" onClick={() => { resetAll(); setConfirm(false); }}>Reset timetable</button><button className="underline text-white/70" onClick={() => setConfirm(false)}>Cancel</button></span>
          ) : (
            <button className="underline underline-offset-4 text-white/70 hover:text-white" onClick={() => setConfirm(true)}>Reset demo</button>
          )}
        </span>
      </div>
      <nav className="max-w-[1320px] mx-auto px-4 md:px-8 flex gap-1 overflow-x-auto" aria-label="Sections">
        {TABS.map((t) => {
          const on = activeTab === t.id;
          return (
            <button key={t.id} onClick={() => setActiveTab(t.id)} aria-current={on ? 'page' : undefined}
              className={`px-4 py-2.5 font-bold whitespace-nowrap rounded-t-md ${on ? 'bg-platform text-sign' : 'text-white/70 hover:text-white'}`}>
              {t.label}
            </button>
          );
        })}
      </nav>
    </header>
  );
};
