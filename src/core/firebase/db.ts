import type { Meal, DailySummary, UserGoal } from '../../types';

// This is a mocked Firebase Service for the MVP/Demo to allow it to run perfectly.
// In production, swap these with actual imported functions from 'firebase/firestore'
const STORAGE_KEY = 'nutrimind_db_v1';

interface MockDB {
  meals: Meal[];
  summaries: DailySummary[];
  goal: UserGoal;
}

const getDB = (): MockDB => {
  const data = localStorage.getItem(STORAGE_KEY);
  if (data) return JSON.parse(data);
  return {
    meals: [],
    summaries: [],
    goal: { targetCalories: 2000, dietaryGoals: ['Balanced Diet'] }
  };
};

const saveDB = (db: MockDB) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(db));
};

export const fetchMealsForDate = async (dateStr: string): Promise<Meal[]> => {
  // dateStr expected format YYYY-MM-DD
  const db = getDB();
  return db.meals.filter(m => m.timestamp.startsWith(dateStr));
};

export const addMeal = async (meal: Omit<Meal, 'id'>): Promise<Meal> => {
  const db = getDB();
  const newMeal = { ...meal, id: Math.random().toString(36).substr(2, 9) };
  db.meals.push(newMeal);
  saveDB(db);
  return newMeal;
};

export const fetchSummaryForDate = async (dateStr: string): Promise<DailySummary | null> => {
  const db = getDB();
  const summary = db.summaries.find(s => s.date === dateStr);
  return summary || null;
};

export const saveDailySummary = async (summary: DailySummary): Promise<void> => {
  const db = getDB();
  db.summaries = db.summaries.filter(s => s.date !== summary.date);
  db.summaries.push(summary);
  saveDB(db);
};

export const getUserGoal = async (): Promise<UserGoal> => {
  return getDB().goal;
};

export const saveUserGoal = async (goal: UserGoal): Promise<void> => {
  const db = getDB();
  db.goal = goal;
  saveDB(db);
};

export const clearMockDb = () => {
    localStorage.removeItem(STORAGE_KEY);
    window.location.reload();
}

export const seedFullDayDemo = () => {
    const today = new Date().toISOString().split('T')[0];
    const mockData = {
        meals: [
            {
                id: 'demo-1',
                description: 'Oatmeal with fresh berries and black coffee',
                calories: 320,
                timestamp: `${today}T08:30:00.000Z`,
                impact: 'healthy',
                feedback: 'Great start hitting your morning goals! The complex carbs will keep your energy stable.',
                suggestion: 'Remember to stay hydrated before your next meal.',
                reason: 'Morning oats structure your blood sugar and prevent midday crashes.'
            },
            {
                id: 'demo-2',
                description: 'Late heavy dinner: Double bacon cheeseburger, huge fries, and a milkshake',
                calories: 1650,
                timestamp: `${today}T21:45:00.000Z`,
                impact: 'danger',
                feedback: 'Warning: You skipped lunch completely and heavily backloaded your calories right before bed. This is far over your remaining limit.',
                suggestion: 'Tomorrow, do not skip lunch. Spacing out meals prevents late-night starvation logic.',
                reason: 'Consuming 1600+ kcal at night disrupts sleep architecture and strongly promotes fat storage.'
            }
        ],
        summaries: [],
        goal: { targetCalories: 2200, dietaryGoals: ['Weight Loss'] }
    };
    localStorage.setItem(STORAGE_KEY, JSON.stringify(mockData));
    window.location.reload();
};
