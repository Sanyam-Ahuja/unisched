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
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1 w-full max-w-[1320px] mx-auto px-4 md:px-8 py-8">
        {activeTab === 'calendar' && <WeeklyCalendar />}
        {activeTab === 'generator' && <OptimizerStudio />}
        {activeTab === 'comparison' && <ScheduleComparisonView />}
        {activeTab === 'catalog' && <CourseCatalogView />}
      </main>
      <footer className="max-w-[1320px] w-full mx-auto px-4 md:px-8 py-6 text-[13px] text-steel">
        Timetables are solved in your browser by a backtracking search over section times. Your week is saved on this device.
      </footer>
    </div>
  );
};

export default App;
