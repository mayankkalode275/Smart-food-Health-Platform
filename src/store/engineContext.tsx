import { createContext, useContext, useState, useEffect, type ReactNode } from 'react';
import type { Meal, UserGoal, DailySummary } from '../types';
import * as db from '../core/firebase/db';
import { processMealInput } from '../core/engine/hybrid';
import { generateDailySummaryWithAI } from '../core/ai/gemini';

interface EngineContextType {
  meals: Meal[];
  goal: UserGoal;
  loading: boolean;
  addMealEntry: (description: string) => Promise<void>;
  generateSummary: () => Promise<DailySummary>;
  updateGoal: (newGoal: UserGoal) => Promise<void>;
  currentCalories: number;
}

const EngineContext = createContext<EngineContextType | undefined>(undefined);

export const EngineProvider = ({ children }: { children: ReactNode }) => {
  const [meals, setMeals] = useState<Meal[]>([]);
  const [goal, setGoal] = useState<UserGoal>({ targetCalories: 2000, dietaryGoals: [] });
  const [loading, setLoading] = useState(true);

  const currentCalories = meals.reduce((sum, m) => sum + (Number(m.calories) || 0), 0);

  useEffect(() => {
    const init = async () => {
      const today = new Date().toISOString().split('T')[0];
      const todaysMeals = await db.fetchMealsForDate(today);
      const userGoal = await db.getUserGoal();
      setMeals(todaysMeals);
      setGoal(userGoal);
      setLoading(false);
    };
    init();
  }, []);

  const addMealEntry = async (description: string) => {
    setLoading(true);
    try {
      // Run Hybrid Engine
      const aiResponse = await processMealInput(description, currentCalories, goal.targetCalories, meals);
      
      const newMeal: Omit<Meal, 'id'> = {
        description,
        calories: Number(aiResponse.calories) || 0,
        feedback: aiResponse.feedback || "Estimated meal",
        suggestion: aiResponse.suggestion || "Try balanced diet",
        reason: aiResponse.reason || "Fallback response",
        impact: aiResponse.impact || "warning",
        timestamp: new Date().toISOString()
      };

      const savedMeal = await db.addMeal(newMeal);
      setMeals(prev => [...prev, savedMeal]);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const generateSummary = async () => {
    setLoading(true);
    try {
      const summary = await generateDailySummaryWithAI(goal.targetCalories, currentCalories, meals);
      await db.saveDailySummary(summary);
      return summary;
    } catch(e) {
      console.error(e);
      throw e;
    } finally {
      setLoading(false);
    }
  };

  const updateGoal = async (newGoal: UserGoal) => {
    setGoal(newGoal);
    await db.saveUserGoal(newGoal);
  };

  return (
    <EngineContext.Provider value={{ meals, goal, loading, addMealEntry, generateSummary, updateGoal, currentCalories }}>
      {children}
    </EngineContext.Provider>
  );
};

export const useEngine = () => {
  const context = useContext(EngineContext);
  if (!context) throw new Error("useEngine must be used within an EngineProvider");
  return context;
};
