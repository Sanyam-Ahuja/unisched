import React from 'react';
import { useUniSchedStore } from '../../store/useUniSchedStore';
import { ScheduleMetrics } from '../../types';
import { Sign } from '../Transit';
import { StripMap } from '../StripMap';
import { Check } from 'lucide-react';

const ROWS: { k: keyof ScheduleMetrics; label: string; better: 'high' | 'low' }[] = [
  { k: 'qualityScore', label: 'Score', better: 'high' },
  { k: 'campusDaysCount', label: 'Days on campus', better: 'low' },
  { k: 'fragmentedGapsCount', label: 'Dead hours', better: 'low' },
  { k: 'longGapsCount', label: 'Long waits', better: 'low' },
  { k: 'studyBlocksCount', label: 'Study blocks ≥2h', better: 'high' },
  { k: 'totalCredits', label: 'Credits', better: 'high' },
];

export const ScheduleComparisonView: React.FC = () => {
  const { candidates, selectedCandidateId, applyCandidateSchedule, setActiveTab } = useUniSchedStore();
  if (candidates.length === 0) return (
    <div>
      <Sign title="Compare routes" />
      <div className="bg-tile rounded-md border-2 border-sign p-10 text-center">
        <p className="signtext text-[22px]">Nothing to compare yet</p>
        <p className="text-steel mt-2">Run the planner first and its routes will line up here.</p>
        <button className="tbtn mt-5" onClick={() => setActiveTab('generator')}>Plan a route</button>
      </div>
    </div>
  );

  const best = (k: keyof ScheduleMetrics, dir: 'high' | 'low') => {
    const vals = candidates.map((c) => c.metrics[k] as number);
    return dir === 'high' ? Math.max(...vals) : Math.min(...vals);
  };

  return (
    <div>
      <Sign title="Compare routes" note="Each column is a valid week. The best value in every row is boxed." />
      <div className="bg-tile rounded-md border-2 border-sign overflow-x-auto">
        <table className="w-full min-w-[720px] border-collapse">
          <thead>
            <tr>
              <th className="w-44" />
              {candidates.map((c, i) => (
                <th key={c.id} className="text-left align-top p-4 border-l-2 border-rail">
                  <div className="cap">Route {i + 1}</div>
                  <div className="font-bold leading-tight mt-1 mb-3">{c.title}</div>
                  <StripMap sections={c.sections} />
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {ROWS.map((r) => {
              const b = best(r.k, r.better);
              return (
                <tr key={r.k} className="border-t-2 border-rail">
                  <th className="text-left px-4 py-3 font-semibold text-steel">{r.label}</th>
                  {candidates.map((c) => {
                    const v = c.metrics[r.k] as number;
                    return (
                      <td key={c.id} className="px-4 py-3 border-l-2 border-rail">
                        <span className={`signtext text-[22px] px-2 py-0.5 rounded ${v === b ? 'ring-2 ring-sign' : ''}`}>{v}</span>
                      </td>
                    );
                  })}
                </tr>
              );
            })}
            <tr className="border-t-2 border-sign">
              <th />
              {candidates.map((c) => {
                const on = selectedCandidateId === c.id;
                return (
                  <td key={c.id} className="p-4 border-l-2 border-rail">
                    <button className={`tbtn w-full ${on ? '!bg-ok' : ''}`} onClick={() => applyCandidateSchedule(c.id)} disabled={on}>{on ? <><Check size={16} /> Riding this</> : 'Use this route'}</button>
                  </td>
                );
              })}
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
};
