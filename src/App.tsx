import React from 'react';
import { Navbar } from './components/layout/Navbar';
import { WeeklyCalendar } from './components/calendar/WeeklyCalendar';
import { OptimizerStudio } from './components/optimizer/OptimizerStudio';
import { ScheduleComparisonView } from './components/comparison/ScheduleComparisonView';
import { CourseCatalogView } from './components/catalog/CourseCatalogView';
import { useUniSchedStore } from './store/useUniSchedStore';

export const App: React.FC = () => {
  const { activeTab } = useUniSchedStore();

  return (
    <div className="min-h-screen bg-[#070D1E] text-slate-100 flex flex-col font-sans selection:bg-cyan-500 selection:text-slate-950">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'calendar' && <WeeklyCalendar />}
        {activeTab === 'generator' && <OptimizerStudio />}
        {activeTab === 'comparison' && <ScheduleComparisonView />}
        {activeTab === 'catalog' && <CourseCatalogView />}
      </main>

      <footer className="border-t border-slate-800/80 bg-[#0B132B]/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p>© 2026 UniSched — Intelligent Academic Timetable Constraint Engine (CSP)</p>
          <p className="font-mono text-[11px] text-slate-400">
            Client-Side Backtracking • In-Browser CSP Solver • Zero Server Footprint
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
