import React from 'react';
import { CourseSection, DayOfWeek } from '../types';
import { Bullet } from './Transit';

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];

/** A route strip like the one above a train door: five stations, the lines that stop at each. */
export const StripMap: React.FC<{ sections: CourseSection[] }> = ({ sections }) => (
  <div className="relative pt-1">
    <div className="absolute left-[10%] right-[10%] top-[13px] h-[4px] bg-sign rounded" aria-hidden />
    <div className="grid grid-cols-5 relative">
      {DAYS.map((d) => {
        const here = sections.filter((s) => s.day === d).sort((a, b) => a.startHour - b.startHour);
        return (
          <div key={d} className="flex flex-col items-center">
            <span className={`w-[22px] h-[22px] rounded-full border-[4px] border-sign ${here.length ? 'bg-white' : 'bg-rail'}`} />
            <span className={`text-[12px] font-bold mt-1 ${here.length ? '' : 'text-steel/60'}`}>{d}</span>
            <div className="flex flex-col items-center gap-1 mt-1.5 min-h-[24px]">
              {here.map((s) => <Bullet key={s.id} code={s.courseCode} size={22} />)}
            </div>
          </div>
        );
      })}
    </div>
  </div>
);
