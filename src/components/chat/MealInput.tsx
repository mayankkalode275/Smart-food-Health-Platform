import React, { useState } from 'react';
import { useEngine } from '../../store/engineContext';
import { Send, Loader2, Bot } from 'lucide-react';
import { clsx } from 'clsx';

export const MealInput = () => {
  const [input, setInput] = useState('');
  const { addMealEntry, loading } = useEngine();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || loading) return;
    const desc = input;
    setInput('');
    await addMealEntry(desc);
  };

  return (
    <div className="glass-card p-4">
      <div className="flex items-center gap-3 mb-3 text-brand-secondary font-medium">
        <Bot size={20} />
        <span>Tell me what you ate...</span>
      </div>
      <form onSubmit={handleSubmit} className="relative flex items-center">
        <input 
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="e.g. 2 slices of pepperoni pizza and a diet coke"
          className={clsx(
            "w-full bg-slate-900/50 border border-dark-border rounded-xl px-4 py-3 pr-12 focus:outline-none focus:ring-2 focus:ring-brand-primary/50 transition-all text-slate-200 placeholder:text-slate-500",
            loading && "opacity-50 pointer-events-none"
          )}
          disabled={loading}
        />
        <button 
          type="submit" 
          disabled={!input.trim() || loading}
          className="absolute right-2 p-2 text-brand-primary hover:text-emerald-400 disabled:text-slate-500 transition-colors"
        >
          {loading ? <Loader2 className="animate-spin" /> : <Send size={20} />}
        </button>
      </form>
    </div>
  );
};
