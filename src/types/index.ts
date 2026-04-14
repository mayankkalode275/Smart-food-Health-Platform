export interface Meal {
  id: string;
  description: string;
  calories: number;
  timestamp: string; // ISO string
  feedback: string;
  suggestion: string;
  reason: string;
  impact: 'healthy' | 'warning' | 'danger';
}

export interface UserGoal {
  targetCalories: number;
  dietaryGoals: string[]; // e.g. "Low Carb", "Weight Loss"
}

export interface DailySummary {
  date: string; // YYYY-MM-DD
  totalCalories: number;
  strengths: string[];
  mistakes: string[];
  improvements: string[];
  fullSummary: string;
}

// AI Output Interface
export interface AIAnalysisResponse {
  calories: number;
  feedback: string;
  suggestion: string;
  reason: string;
  impact: 'healthy' | 'warning' | 'danger';
}
