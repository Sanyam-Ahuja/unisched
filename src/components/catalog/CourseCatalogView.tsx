import React, { useState } from 'react';
import { useUniSchedStore } from '../../store/useUniSchedStore';
import { CourseSection, DayOfWeek, SectionType } from '../../types';
import { Bullet, Sign, hh, line } from '../Transit';
import { Plus, Search, X } from 'lucide-react';

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const TYPES: SectionType[] = ['lecture', 'lab', 'seminar'];

export const CourseCatalogView: React.FC = () => {
  const { catalogSections, activeSections, addCatalogSection, toggleCourseSelection, requiredCourses } = useUniSchedStore();
  const [q, setQ] = useState('');
  const [type, setType] = useState<'all' | SectionType>('all');
  const [adding, setAdding] = useState(false);
  const [f, setF] = useState({ code: '', name: '', instructor: '', room: '', day: 'Mon' as DayOfWeek, start: 10, end: 12, type: 'lecture' as SectionType, credits: 3 });

  const t = q.toLowerCase();
  const shown = catalogSections.filter((s) => (!t || [s.courseCode, s.courseName, s.instructor, s.room].some((x) => x.toLowerCase().includes(t))) && (type === 'all' || s.type === type));
  const lines = Array.from(new Set(shown.map((s) => s.courseCode)));

  const add = (e: React.FormEvent) => {
    e.preventDefault();
    if (!f.code.trim() || !f.name.trim() || !f.instructor.trim()) return;
    const sec: CourseSection = { id: `custom-${Date.now()}`, courseCode: f.code.trim().toUpperCase(), courseName: f.name.trim(), instructor: f.instructor.trim(), room: f.room.trim() || 'Room 101', day: f.day, startHour: f.start, endHour: f.end, type: f.type, credits: f.credits, color: line(f.code.trim().toUpperCase()).bg };
    addCatalogSection(sec);
    setAdding(false);
    setF({ ...f, code: '', name: '', instructor: '', room: '' });
  };

  return (
    <div>
      <Sign title="All lines" note={`${catalogSections.length} departures across ${new Set(catalogSections.map((s) => s.courseCode)).size} lines. Mark a line as needed and the planner must fit it in.`}
        right={<button className="tbtn !bg-white !text-sign hover:!bg-[#fccc0a]" onClick={() => setAdding(!adding)}>{adding ? <><X size={16} /> Close</> : <><Plus size={16} /> Add a section</>}</button>} />

      {adding && (
        <form onSubmit={add} className="bg-tile rounded-md border-2 border-sign p-5 mb-8 grid sm:grid-cols-2 lg:grid-cols-4 gap-3">
          <label><span className="cap">Code</span><input className="tin mt-1" value={f.code} onChange={(e) => setF({ ...f, code: e.target.value })} placeholder="CS 490" required /></label>
          <label className="lg:col-span-2"><span className="cap">Course</span><input className="tin mt-1" value={f.name} onChange={(e) => setF({ ...f, name: e.target.value })} placeholder="Distributed Systems" required /></label>
          <label><span className="cap">Type</span><select className="tin mt-1" value={f.type} onChange={(e) => setF({ ...f, type: e.target.value as SectionType })}>{TYPES.map((x) => <option key={x}>{x}</option>)}</select></label>
          <label><span className="cap">Instructor</span><input className="tin mt-1" value={f.instructor} onChange={(e) => setF({ ...f, instructor: e.target.value })} placeholder="Prof. Lamport" required /></label>
          <label><span className="cap">Room</span><input className="tin mt-1" value={f.room} onChange={(e) => setF({ ...f, room: e.target.value })} placeholder="Turing Hall 301" /></label>
          <label><span className="cap">Day</span><select className="tin mt-1" value={f.day} onChange={(e) => setF({ ...f, day: e.target.value as DayOfWeek })}>{DAYS.map((d) => <option key={d}>{d}</option>)}</select></label>
          <div className="grid grid-cols-3 gap-2">
            <label><span className="cap">From</span><select className="tin mt-1 !px-1" value={f.start} onChange={(e) => { const s = Number(e.target.value); setF({ ...f, start: s, end: Math.max(f.end, s + 1) }); }}>{[8, 9, 10, 11, 12, 13, 14, 15, 16, 17].map((h) => <option key={h} value={h}>{h}</option>)}</select></label>
            <label><span className="cap">To</span><select className="tin mt-1 !px-1" value={f.end} onChange={(e) => setF({ ...f, end: Number(e.target.value) })}>{[9, 10, 11, 12, 13, 14, 15, 16, 17, 18].filter((h) => h > f.start).map((h) => <option key={h} value={h}>{h}</option>)}</select></label>
            <label><span className="cap">Cr</span><input type="number" min={1} max={6} className="tin mt-1 !px-1" value={f.credits} onChange={(e) => setF({ ...f, credits: Number(e.target.value) })} /></label>
          </div>
          <div className="sm:col-span-2 lg:col-span-4 flex justify-end"><button className="tbtn">Add departure</button></div>
        </form>
      )}

      <div className="flex flex-col sm:flex-row gap-2 mb-6">
        <label className="relative flex-1"><Search size={16} className="absolute left-3 top-1/2 -translate-y-1/2 text-steel" /><input className="tin !pl-9" value={q} onChange={(e) => setQ(e.target.value)} placeholder="Course, instructor or room" /></label>
        <div className="flex bg-tile rounded-md border-2 border-rail p-0.5">
          {(['all', ...TYPES] as const).map((x) => (
            <button key={x} onClick={() => setType(x)} aria-pressed={type === x} className={`px-3 py-1.5 rounded font-semibold capitalize text-[14px] ${type === x ? 'bg-sign text-white' : 'text-steel'}`}>{x}</button>
          ))}
        </div>
      </div>

      {lines.length === 0 && <p className="text-steel py-12 text-center">No departure matches. Clear the search or pick “all”.</p>}
      <div className="space-y-6">
        {lines.map((code) => {
          const secs = shown.filter((s) => s.courseCode === code).sort((a, b) => DAYS.indexOf(a.day) - DAYS.indexOf(b.day) || a.startHour - b.startHour);
          const need = requiredCourses.includes(code);
          return (
            <section key={code} className="bg-tile rounded-md border-2 border-sign overflow-hidden">
              <header className="flex flex-wrap items-center gap-4 px-4 py-3 border-b-2 border-sign">
                <Bullet code={code} size={40} />
                <div className="flex-1 min-w-0">
                  <h2 className="signtext text-[20px] leading-tight">{secs[0].courseName}</h2>
                  <p className="text-[13px] text-steel">{secs[0].credits} credits · {secs.length} departures</p>
                </div>
                <button onClick={() => toggleCourseSelection(code)} aria-pressed={need} className={`tbtn !py-1.5 text-[14px] ${need ? '' : 'tbtn-quiet'}`}>{need ? 'Needed' : 'Mark as needed'}</button>
              </header>
              <table className="w-full text-[14.5px]">
                <tbody>
                  {secs.map((s) => {
                    const riding = activeSections.some((a) => a.id === s.id);
                    return (
                      <tr key={s.id} className="border-t border-rail first:border-t-0">
                        <td className="pl-4 py-2.5 w-16 font-bold">{s.day}</td>
                        <td className="py-2.5 w-32 signtext">{hh(s.startHour)}–{hh(s.endHour)}</td>
                        <td className="py-2.5 capitalize text-steel w-24 hidden sm:table-cell">{s.type}</td>
                        <td className="py-2.5">{s.room}<span className="block sm:hidden text-[12.5px] text-steel capitalize">{s.type} · {s.instructor}</span></td>
                        <td className="py-2.5 text-steel hidden md:table-cell">{s.instructor}</td>
                        <td className="pr-4 py-2.5 text-right">{riding && <span className="text-[12px] font-bold bg-ok text-white px-2 py-0.5 rounded">in your week</span>}</td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </section>
          );
        })}
      </div>
    </div>
  );
};
