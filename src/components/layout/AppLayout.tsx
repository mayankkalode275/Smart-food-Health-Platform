import React from 'react';

export const AppLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-dark-bg text-slate-100 pb-20 md:pb-8 flex flex-col md:flex-row">
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-8 relative">
        <header className="mb-8 flex justify-between items-center">
            <div>
                <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-brand-primary to-emerald-300">NutriMind AI</h1>
                <p className="text-slate-400 text-sm mt-1 flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-brand-primary animate-pulse"></span>
                    Context-Aware Memory Active
                </p>
            </div>
            {/* Settings trigger can go here */}
        </header>
        {children}
      </main>
    </div>
  );
};
