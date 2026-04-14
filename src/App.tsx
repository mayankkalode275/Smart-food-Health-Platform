import { EngineProvider } from './store/engineContext';
import { AppLayout } from './components/layout/AppLayout';
import { DailyDashboard } from './components/dashboard/DailyDashboard';
import { MealInput } from './components/chat/MealInput';
import { Timeline } from './components/dashboard/Timeline';

import { clearMockDb, seedFullDayDemo } from './core/firebase/db';
import { Play, RotateCcw } from 'lucide-react';

function AppContent() {
  return (
    <AppLayout>
      <div className="absolute top-6 right-6 flex items-center gap-3">
         <button onClick={seedFullDayDemo} className="flex items-center gap-2 px-3 py-1.5 bg-brand-secondary/20 text-brand-secondary border border-brand-secondary/30 rounded-lg hover:bg-brand-secondary/30 transition-all text-xs font-medium backdrop-blur-md">
            <Play size={14} /> Run Demo Sim
         </button>
         <button onClick={clearMockDb} className="flex items-center gap-2 p-1.5 bg-dark-card border border-dark-border rounded-lg hover:bg-slate-700 transition-all text-slate-400 hover:text-white backdrop-blur-md" title="Reset Database">
            <RotateCcw size={14} /> 
         </button>
      </div>

      <div className="flex flex-col gap-6 pt-6">
        <DailyDashboard />
        <MealInput />
        <Timeline />
      </div>
    </AppLayout>
  );
}

function App() {
  return (
    <EngineProvider>
      <AppContent />
    </EngineProvider>
  );
}

export default App;
