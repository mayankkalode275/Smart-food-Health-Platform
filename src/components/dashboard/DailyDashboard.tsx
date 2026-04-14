import { useState } from 'react';
import { useEngine } from '../../store/engineContext';
import { Flame, AlertTriangle, FileText, X } from 'lucide-react';
import type { DailySummary } from '../../types';

export const DailyDashboard = () => {
  const { currentCalories, goal, updateGoal, generateSummary } = useEngine();
  const [reportLoading, setReportLoading] = useState(false);
  const [report, setReport] = useState<DailySummary | null>(null);

  const handleGoalChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const val = e.target.value;
    const map: Record<string, number> = { 'Weight Loss': 1800, 'Maintain': 2200, 'Weight Gain': 2800 };
    updateGoal({ targetCalories: map[val], dietaryGoals: [val] });
  };

  const handleGenerateReport = async () => {
    setReportLoading(true);
    try {
      const summary = await generateSummary();
      setReport(summary);
    } catch (e) {
        console.error("Failed to generate report", e);
    } finally {
      setReportLoading(false);
    }
  };

  const progress = Math.min((currentCalories / goal.targetCalories) * 100, 100);
  const isOver = currentCalories > goal.targetCalories;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex justify-between items-end px-1">
         <select 
            value={goal.dietaryGoals[0] || 'Maintain'} 
            onChange={handleGoalChange}
            className="bg-slate-800/80 border border-slate-700 text-slate-300 text-sm rounded-xl px-3 py-2 outline-none focus:border-brand-primary"
         >
            <option value="Weight Loss">Weight Loss Goal (1800 kcal)</option>
            <option value="Maintain">Maintenance Goal (2200 kcal)</option>
            <option value="Weight Gain">Muscle Gain Goal (2800 kcal)</option>
         </select>
         <button onClick={handleGenerateReport} disabled={reportLoading} className="flex items-center gap-2 text-sm bg-brand-primary/10 text-brand-primary hover:bg-brand-primary/20 px-4 py-2 rounded-xl transition-colors border border-brand-primary/20 font-medium">
            {reportLoading ? <span className="animate-pulse">Analyzing...</span> : <><FileText size={16} /> Daily AI Report</>}
         </button>
      </div>

      <div className="glass-card p-6 grid grid-cols-2 gap-4">
      <div className="flex flex-col justify-center">
        <h2 className="text-sm text-slate-400 font-medium uppercase tracking-wider mb-1">Today's Intake</h2>
        <div className="flex items-end gap-2">
            <span className={`text-4xl font-bold ${isOver ? 'text-brand-danger' : 'text-slate-100'}`}>
              {currentCalories}
            </span>
            <span className="text-slate-400 mb-1">/ {goal.targetCalories} kcal</span>
        </div>
        {isOver && (
            <div className="mt-2 text-xs text-brand-danger flex items-center gap-1">
                <AlertTriangle size={14} /> Over daily limit
            </div>
        )}
      </div>

      <div className="flex justify-end items-center relative">
        <svg className="w-24 h-24 transform -rotate-90">
            <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                className="text-slate-700"
            />
            <circle
                cx="48"
                cy="48"
                r="40"
                stroke="currentColor"
                strokeWidth="8"
                fill="transparent"
                strokeDasharray="251.2"
                strokeDashoffset={251.2 - (251.2 * progress) / 100}
                className={`${isOver ? 'text-brand-danger' : 'text-brand-primary'} transition-all duration-1000 ease-out`}
            />
        </svg>
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none pr-3">
            <Flame size={24} className={isOver ? 'text-brand-danger animate-pulse' : 'text-brand-primary'} />
        </div>
      </div>
      </div>
      {report && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-dark-bg/80 backdrop-blur-sm p-4">
            <div className="glass-card w-full max-w-md p-6 max-h-[80vh] overflow-y-auto">
                <div className="flex justify-between items-start mb-6">
                    <h2 className="text-xl font-bold flex items-center gap-2"><FileText className="text-brand-primary" /> Daily Coach Report</h2>
                    <button onClick={() => setReport(null)} className="text-slate-400 hover:text-white"><X size={20}/></button>
                </div>
                <div className="space-y-6 text-sm text-slate-300">
                    <p className="p-4 bg-slate-800/50 rounded-xl leading-relaxed text-slate-100 border border-slate-700/50 shadow-inner">{report.fullSummary}</p>
                    
                    <div>
                        <h3 className="text-emerald-400 font-semibold mb-2 uppercase tracking-wider text-xs">Strengths</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            {report.strengths.map(s => <li key={s}>{s}</li>)}
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-red-400 font-semibold mb-2 uppercase tracking-wider text-xs">Mistakes</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            {report.mistakes.map(s => <li key={s}>{s}</li>)}
                        </ul>
                    </div>
                    
                    <div>
                        <h3 className="text-brand-secondary font-semibold mb-2 uppercase tracking-wider text-xs">Action Plan for Tomorrow</h3>
                        <ul className="list-disc pl-5 space-y-1">
                            {report.improvements.map(s => <li key={s}>{s}</li>)}
                        </ul>
                    </div>
                </div>
            </div>
        </div>
      )}
    </div>
  );
};
