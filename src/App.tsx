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
    <div className="min-h-screen bg-[#F8FAFC] text-slate-900 flex flex-col font-sans selection:bg-indigo-100 selection:text-indigo-900">
      <Navbar />

      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === 'calendar' && <WeeklyCalendar />}
        {activeTab === 'generator' && <OptimizerStudio />}
        {activeTab === 'comparison' && <ScheduleComparisonView />}
        {activeTab === 'catalog' && <CourseCatalogView />}
      </main>

      <footer className="border-t border-slate-200 bg-white py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <p className="font-semibold text-slate-800">
            © 2026 UniSched • Academic Timetable Optimization & Constraint Solving
          </p>
          <p className="font-mono text-[11px] text-slate-500">
            Backtracking Constraint Satisfaction Engine • In-Browser Optimization
          </p>
        </div>
      </footer>
    </div>
  );
};

export default App;
