import React, { useState } from 'react';
import { useUniSchedStore } from '../../store/useUniSchedStore';
import { 
  Calendar, 
  Sparkles, 
  Columns, 
  BookOpen, 
  RotateCcw,
  CheckCircle2,
  CalendarCheck
} from 'lucide-react';

export const Navbar: React.FC = () => {
  const { activeTab, setActiveTab, resetAll, conflicts, metrics } = useUniSchedStore();
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  return (
    <header className="border-b border-slate-200 bg-white/95 backdrop-blur sticky top-0 z-40 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Brand */}
          <div className="flex items-center space-x-3 cursor-pointer" onClick={() => setActiveTab('calendar')}>
            <div className="w-10 h-10 rounded-xl bg-indigo-50 border border-indigo-200 flex items-center justify-center shadow-xs">
              <CalendarCheck className="w-5 h-5 text-indigo-600" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="font-bold text-lg tracking-tight text-slate-900 font-sans">
                  Uni<span className="text-indigo-600">Sched</span>
                </span>
                <span className="text-[10px] font-bold uppercase px-1.5 py-0.5 rounded bg-indigo-100 text-indigo-800 border border-indigo-200 font-mono">
                  CSP SOLVER
                </span>
              </div>
              <p className="text-[11px] text-slate-500 hidden sm:block">Intelligent Academic Timetable Optimizer</p>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-1">
            <button
              onClick={() => setActiveTab('calendar')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all relative ${
                activeTab === 'calendar'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Calendar className="w-3.5 h-3.5" />
              <span>Timetable Grid</span>
              {conflicts.length > 0 && (
                <span className="w-2 h-2 rounded-full bg-rose-500 animate-ping ml-1" />
              )}
            </button>

            <button
              onClick={() => setActiveTab('generator')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'generator'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5 text-amber-500" />
              <span>Optimizer Studio</span>
            </button>

            <button
              onClick={() => setActiveTab('comparison')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'comparison'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <Columns className="w-3.5 h-3.5 text-purple-600" />
              <span>Compare Candidates</span>
            </button>

            <button
              onClick={() => setActiveTab('catalog')}
              className={`px-3 py-1.5 rounded-lg text-xs font-semibold flex items-center space-x-1.5 transition-all ${
                activeTab === 'catalog'
                  ? 'bg-indigo-50 text-indigo-700 border border-indigo-200 shadow-xs'
                  : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
              }`}
            >
              <BookOpen className="w-3.5 h-3.5" />
              <span>Course Catalog</span>
            </button>
          </nav>

          {/* Right Status & Reset */}
          <div className="flex items-center space-x-2">
            <div className="hidden sm:flex items-center space-x-2 px-2.5 py-1 rounded-lg bg-slate-100 border border-slate-200 text-xs font-mono">
              <span className="text-slate-500">FITNESS:</span>
              <span className={`font-bold ${metrics.qualityScore > 80 ? 'text-emerald-700' : 'text-amber-700'}`}>
                {metrics.qualityScore}%
              </span>
            </div>

            <button
              onClick={() => setShowResetConfirm(true)}
              className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 border border-slate-200 text-slate-600 hover:text-slate-900 transition-all"
              title="Reset seeded simulation data"
            >
              <RotateCcw className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>

      {showResetConfirm && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 max-w-sm w-full shadow-2xl">
            <h3 className="text-base font-bold text-slate-900">Reset Timetable Configuration?</h3>
            <p className="text-xs text-slate-600 mt-2">
              This will restore all course section enrollments, preferences, and generated schedule candidates to defaults.
            </p>
            <div className="mt-5 flex items-center justify-end space-x-2 text-xs">
              <button
                onClick={() => setShowResetConfirm(false)}
                className="px-3 py-1.5 rounded-lg text-slate-600 hover:text-slate-900 font-medium"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  resetAll();
                  setShowResetConfirm(false);
                }}
                className="px-4 py-1.5 rounded-lg bg-indigo-600 hover:bg-indigo-700 text-white font-medium"
              >
                Reset All
              </button>
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
