import type { Meal } from '../../types';
import { analyzeMealWithAI } from '../ai/gemini';

export interface DecisionResult {
  isOvereatingWarning: boolean;
  isSkippedMealWarning: boolean;
}

export const runDeterministicLogic = (
  estimatedNewCalories: number,
  currentCalories: number,
  targetCalories: number,
  todaysMeals: Meal[]
): DecisionResult => {
  // Layer 1: Deterministic Engine
  const totalWithNew = currentCalories + estimatedNewCalories;
  const isOvereatingWarning = totalWithNew > targetCalories;
  
  let isSkippedMealWarning = false;
  if (todaysMeals.length > 0) {
    const lastMealTime = new Date(todaysMeals[todaysMeals.length - 1].timestamp).getTime();
    const now = new Date().getTime();
    const hoursSinceLastMeal = (now - lastMealTime) / (1000 * 60 * 60);
    
    if (hoursSinceLastMeal > 6 && now > new Date().setHours(12, 0, 0, 0)) {
       // Only trigger skipped meal if it's past noon and > 6 hours have passed
       isSkippedMealWarning = true;
    }
  }

  return { isOvereatingWarning, isSkippedMealWarning };
};

// Layer 3: Synthesis Function (combines logic + AI)
export const processMealInput = async (
    mealDescription: string,
    currentCalories: number,
    targetCalories: number,
    todaysMeals: Meal[]
) => {
    // We don't know the new calories exactly yet, but we will assume an average of 500 for the deterministic check layer prior to AI call
    // A better approach is to ask AI, then run rules, but for prompt injection we need tone beforehand.
    // So we do a pre-check: are they ALREADY deeply over target?
    const isAlreadyCloseToLimit = currentCalories > (targetCalories * 0.85);
    
    // Evaluate skipping
    let isSkippedMealWarning = false;
    if (todaysMeals.length > 0) {
      const lastMealTime = new Date(todaysMeals[todaysMeals.length - 1].timestamp).getTime();
      const hoursSinceLastMeal = (new Date().getTime() - lastMealTime) / (1000 * 60 * 60);
      if (hoursSinceLastMeal > 6) isSkippedMealWarning = true;
    }

    const isStrictTone = isAlreadyCloseToLimit || isSkippedMealWarning;

    // Call Layer 2: Gemini
    const aiResponse = await analyzeMealWithAI(
        mealDescription, 
        currentCalories, 
        targetCalories, 
        todaysMeals, 
        isStrictTone
    );

    return aiResponse;
};
