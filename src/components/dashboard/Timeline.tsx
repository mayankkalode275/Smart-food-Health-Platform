import { useEngine } from '../../store/engineContext';
import { Clock, CheckCircle2, AlertCircle } from 'lucide-react';

export const Timeline = () => {
  const { meals } = useEngine();

  if (meals.length === 0) return null;

  return (
    <div className="mt-8 flex flex-col gap-4">
      <h3 className="text-xl font-semibold flex items-center gap-2">
        <Clock size={20} className="text-slate-400"/> Context Memory
      </h3>
      <div className="flex flex-col gap-4 relative">
        <div className="absolute left-6 top-4 bottom-4 w-0.5 bg-dark-border z-0"></div>
        {meals.map((meal) => {
           const time = new Date(meal.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
           return (
             <div key={meal.id} className="relative z-10 flex gap-4">
               <div className="mt-1 flex-shrink-0 w-12 text-xs text-slate-500 font-medium text-right pt-2">
                 {time}
               </div>
               <div className="glass-card flex-1 p-4">
                 <div className="flex justify-between items-start mb-2">
                   <h4 className="font-medium text-lg leading-tight capitalize">{meal.description}</h4>
                   <span className="text-brand-accent font-bold">{meal.calories} kcal</span>
                 </div>
                 
                 <div className={`text-sm flex flex-col gap-3 p-4 rounded-xl border ${
                    meal.impact === 'healthy' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-200' :
                    meal.impact === 'danger' ? 'bg-red-500/10 border-red-500/20 text-red-100' :
                    'bg-amber-500/10 border-amber-500/20 text-amber-100'
                 }`}>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} className={`mt-0.5 flex-shrink-0 ${meal.impact === 'healthy' ? 'text-emerald-400' : meal.impact === 'danger' ? 'text-red-400' : 'text-amber-400'}`} />
                      <p><strong>Coach says:</strong> {meal.feedback}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <AlertCircle size={16} className="mt-0.5 flex-shrink-0 opacity-70" />
                      <p><strong>Impact:</strong> {meal.reason}</p>
                    </div>
                    <div className="flex items-start gap-2">
                      <CheckCircle2 size={16} className="mt-0.5 flex-shrink-0 opacity-70" />
                      <p><strong>Action:</strong> {meal.suggestion}</p>
                    </div>
                 </div>
               </div>
             </div>
           );
        })}
      </div>
    </div>
  );
};
