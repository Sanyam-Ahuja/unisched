import React, { useState } from 'react';
import { useUniSchedStore } from '../../store/useUniSchedStore';
import { CourseSection, DayOfWeek, SectionType } from '../../types';
import { 
  BookOpen, 
  Search, 
  Plus, 
  MapPin, 
  User, 
  Clock, 
  Check, 
  Filter,
  CheckCircle2
} from 'lucide-react';

const DAYS: DayOfWeek[] = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'];
const TYPES: SectionType[] = ['lecture', 'lab', 'seminar'];

export const CourseCatalogView: React.FC = () => {
  const { 
    catalogSections, 
    activeSections, 
    addCatalogSection, 
    toggleCourseSelection,
    requiredCourses 
  } = useUniSchedStore();

  const [search, setSearch] = useState('');
  const [filterType, setFilterType] = useState<string>('all');
  const [showAddModal, setShowAddModal] = useState(false);

  // Form State for new section
  const [newCode, setNewCode] = useState('');
  const [newName, setNewName] = useState('');
  const [newInstructor, setNewInstructor] = useState('');
  const [newRoom, setNewRoom] = useState('');
  const [newDay, setNewDay] = useState<DayOfWeek>('Mon');
  const [newStart, setNewStart] = useState(10);
  const [newEnd, setNewEnd] = useState(12);
  const [newType, setNewType] = useState<SectionType>('lecture');
  const [newCredits, setNewCredits] = useState(3);

  const filteredSections = catalogSections.filter((s) => {
    const matchesSearch = 
      s.courseCode.toLowerCase().includes(search.toLowerCase()) ||
      s.courseName.toLowerCase().includes(search.toLowerCase()) ||
      s.instructor.toLowerCase().includes(search.toLowerCase()) ||
      s.room.toLowerCase().includes(search.toLowerCase());

    const matchesType = filterType === 'all' || s.type === filterType;
    return matchesSearch && matchesType;
  });

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCode || !newName || !newInstructor) return;

    const newSec: CourseSection = {
      id: `custom-${Date.now()}`,
      courseCode: newCode.trim().toUpperCase(),
      courseName: newName.trim(),
      instructor: newInstructor.trim(),
      room: newRoom.trim() || 'Room 101',
      day: newDay,
      startHour: Number(newStart),
      endHour: Number(newEnd),
      type: newType,
      credits: Number(newCredits),
      color: newType === 'lab' ? '#A855F7' : newType === 'seminar' ? '#10B981' : '#06B6D4',
    };

    addCatalogSection(newSec);
    setShowAddModal(false);
    // Reset form
    setNewCode('');
    setNewName('');
    setNewInstructor('');
    setNewRoom('');
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="bg-[#0B132B]/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center space-x-2">
            <span className="text-xs font-mono px-2 py-0.5 rounded bg-cyan-500/10 text-cyan-400 border border-cyan-500/20 uppercase font-semibold">
              Curriculum Registry
            </span>
            <span className="text-xs text-slate-500 font-mono">{catalogSections.length} Sections Available</span>
          </div>
          <h2 className="text-xl font-bold text-white mt-2">Department Course Catalog</h2>
          <p className="text-sm text-slate-400 max-w-2xl mt-1">
            Browse all accredited university course sections, laboratory workshops, and seminar cohorts.
          </p>
        </div>

        <button
          onClick={() => setShowAddModal(true)}
          className="px-4 py-2.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium text-xs shadow-lg shadow-cyan-600/30 flex items-center space-x-1.5 self-start md:self-auto transition-all"
        >
          <Plus className="w-4 h-4" />
          <span>Add Custom Section</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 absolute left-3 top-3 text-slate-500" />
          <input
            type="text"
            placeholder="Search code, course, instructor..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-4 py-2 bg-[#0B132B]/60 border border-slate-800 rounded-xl text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-500 transition-colors"
          />
        </div>

        <div className="flex items-center space-x-2 w-full sm:w-auto">
          <Filter className="w-3.5 h-3.5 text-slate-400" />
          <div className="flex items-center space-x-1 bg-slate-900/60 p-1 rounded-xl border border-slate-800 text-xs">
            {['all', 'lecture', 'lab', 'seminar'].map((t) => (
              <button
                key={t}
                onClick={() => setFilterType(t)}
                className={`px-3 py-1 rounded-lg capitalize transition-colors ${
                  filterType === t
                    ? 'bg-cyan-500/20 text-cyan-300 font-medium'
                    : 'text-slate-400 hover:text-white'
                }`}
              >
                {t}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Course Section Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filteredSections.map((sec) => {
          const isRequired = requiredCourses.includes(sec.courseCode);
          const isCurrentlyActive = activeSections.some((s) => s.id === sec.id);

          return (
            <div
              key={sec.id}
              className="bg-[#0B132B]/60 border border-slate-800 rounded-2xl p-5 hover:border-slate-700 transition-all flex flex-col justify-between shadow-lg"
            >
              <div>
                <div className="flex items-start justify-between">
                  <div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded uppercase border font-semibold ${
                      sec.type === 'lab'
                        ? 'bg-purple-500/10 text-purple-400 border-purple-500/30'
                        : sec.type === 'seminar'
                        ? 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30'
                        : 'bg-cyan-500/10 text-cyan-400 border-cyan-500/30'
                    }`}>
                      {sec.type}
                    </span>
                    <h3 className="text-base font-bold text-white mt-2">{sec.courseCode}</h3>
                    <p className="text-xs text-slate-300 font-medium line-clamp-1">{sec.courseName}</p>
                  </div>

                  <span className="text-xs font-mono font-bold text-slate-400 bg-slate-900 px-2 py-1 rounded-lg border border-slate-800">
                    {sec.credits} CR
                  </span>
                </div>

                <div className="my-4 space-y-2 text-xs font-mono text-slate-400 border-t border-b border-slate-800/80 py-3">
                  <div className="flex items-center space-x-2">
                    <Clock className="w-3.5 h-3.5 text-cyan-400" />
                    <span>{sec.day} {sec.startHour}:00 – {sec.endHour}:00</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <MapPin className="w-3.5 h-3.5 text-amber-400" />
                    <span>{sec.room}</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <User className="w-3.5 h-3.5 text-purple-400" />
                    <span className="truncate">{sec.instructor}</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <button
                  onClick={() => toggleCourseSelection(sec.courseCode)}
                  className={`text-xs px-3 py-1.5 rounded-lg border font-medium flex items-center space-x-1.5 transition-colors ${
                    isRequired
                      ? 'bg-cyan-500/20 border-cyan-500/40 text-cyan-300'
                      : 'bg-slate-900 border-slate-800 text-slate-400 hover:text-white'
                  }`}
                >
                  {isRequired && <Check className="w-3 h-3 text-cyan-400" />}
                  <span>{isRequired ? 'Required in Optimizer' : 'Mark Required'}</span>
                </button>

                {isCurrentlyActive && (
                  <span className="text-[10px] font-mono text-emerald-400 bg-emerald-950/40 px-2 py-0.5 rounded border border-emerald-800/50 flex items-center space-x-1">
                    <CheckCircle2 className="w-3 h-3" />
                    <span>Enrolled</span>
                  </span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Add Custom Section Modal */}
      {showAddModal && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl p-6 max-w-md w-full shadow-2xl">
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-base font-bold text-white">Add Custom Course Section</h3>
              <button
                onClick={() => setShowAddModal(false)}
                className="text-slate-400 hover:text-white text-lg p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSection} className="space-y-3.5 text-xs">
              <div>
                <label className="block text-slate-400 mb-1">Course Code (e.g. CS 490)</label>
                <input
                  type="text"
                  required
                  placeholder="CS 490"
                  value={newCode}
                  onChange={(e) => setNewCode(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500 font-mono"
                />
              </div>

              <div>
                <label className="block text-slate-400 mb-1">Course Name</label>
                <input
                  type="text"
                  required
                  placeholder="Advanced Distributed Systems"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Instructor</label>
                  <input
                    type="text"
                    required
                    placeholder="Prof. Turing"
                    value={newInstructor}
                    onChange={(e) => setNewInstructor(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Room</label>
                  <input
                    type="text"
                    placeholder="Turing Hall 301"
                    value={newRoom}
                    onChange={(e) => setNewRoom(e.target.value)}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none focus:border-cyan-500"
                  />
                </div>
              </div>

              <div className="grid grid-cols-3 gap-2">
                <div>
                  <label className="block text-slate-400 mb-1">Day</label>
                  <select
                    value={newDay}
                    onChange={(e) => setNewDay(e.target.value as DayOfWeek)}
                    className="w-full px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none font-mono"
                  >
                    {DAYS.map((d) => (
                      <option key={d} value={d}>{d}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Start Hour</label>
                  <select
                    value={newStart}
                    onChange={(e) => {
                      const s = Number(e.target.value);
                      setNewStart(s);
                      if (newEnd <= s) setNewEnd(s + 2);
                    }}
                    className="w-full px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none font-mono"
                  >
                    {[8, 9, 10, 11, 12, 13, 14, 15, 16].map((h) => (
                      <option key={h} value={h}>{h}:00</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">End Hour</label>
                  <select
                    value={newEnd}
                    onChange={(e) => setNewEnd(Number(e.target.value))}
                    className="w-full px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none font-mono"
                  >
                    {[9, 10, 11, 12, 13, 14, 15, 16, 17, 18]
                      .filter((h) => h > newStart)
                      .map((h) => (
                        <option key={h} value={h}>{h}:00</option>
                      ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-slate-400 mb-1">Section Type</label>
                  <select
                    value={newType}
                    onChange={(e) => setNewType(e.target.value as SectionType)}
                    className="w-full px-2 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none capitalize"
                  >
                    {TYPES.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-slate-400 mb-1">Credits</label>
                  <input
                    type="number"
                    min={1}
                    max={6}
                    value={newCredits}
                    onChange={(e) => setNewCredits(Number(e.target.value))}
                    className="w-full px-3 py-2 bg-slate-950 border border-slate-800 rounded-xl text-white focus:outline-none font-mono"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end space-x-2 pt-4">
                <button
                  type="button"
                  onClick={() => setShowAddModal(false)}
                  className="px-3 py-2 text-slate-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-medium shadow-md shadow-cyan-600/30"
                >
                  Add Section
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
