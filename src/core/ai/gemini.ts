import { GoogleGenAI } from '@google/genai';
import type { Meal, AIAnalysisResponse, DailySummary } from '../../types';

export const getGenClient = () => {
  const apiKey = import.meta.env.VITE_GEMINI_API_KEY;
  if(!apiKey || apiKey === 'your_gemini_api_key_here') throw new Error("API Key not set");
  return new GoogleGenAI({ apiKey });
};

// --- PROMPT TEMPLATES ---

export const getMealAnalysisPrompt = (
  mealDescription: string, 
  currentCalories: number, 
  targetCalories: number, 
  todaysMeals: Meal[],
  _isStrictTone: boolean
) => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});
  const isMorning = now.getHours() < 11;
  const isNight = now.getHours() >= 20;
  const remaining = targetCalories - currentCalories;
  const mealHistory = todaysMeals.map(m => `- ${new Date(m.timestamp).toLocaleTimeString()}: ${m.description} (${m.calories} kcal) [Impact: ${m.impact}]`).join('\n');
  const unhealthyCount = todaysMeals.filter(m => m.impact === 'danger' || m.impact === 'warning').length;

  return `
You are NutriMind, a highly intelligent, empathetic, but exceptionally realistic nutrition coach.
DO NOT use generic bot-like responses. Act like a real human coach holding the user accountable.

USER'S CURRENT STATE:
- Time of Day: ${timeStr} 
- Daily Goal: ${targetCalories} kcal
- Consumed So Far: ${currentCalories} kcal (Remaining: ${remaining} kcal)
- Unhealthy Meals Today: ${unhealthyCount}

MEAL HISTORY TODAY:
${mealHistory || "No meals logged yet today."}

NEW MEAL INPUT: "${mealDescription}"

BEHAVIORAL RULES:
1. Pattern Detection: If the user has multiple 'danger' meals today (Unhealthy Meals > 1), be very strict. If they have none, be highly supportive.
2. Time Awareness: If it is morning (${isMorning}), talk about setting the tone for the day. If it is night (${isNight}), warn about the consequences of late-night eating (sleep disruption, fat storage) especially if the meal is heavy.
3. Realistic Consequences: Ground your feedback in reality. Compare their input to their remaining limits and explain the physical consequence (e.g. energy crashes, slowing progress).
4. No Generic Output: "Try balanced diet" is strictly banned. Tailor exactly to what they ate.

Task:
1. Estimate the calories.
2. Provide personalized, conversational feedback (1-3 sentences) integrating the time of day and their calorie threshold limits. 
3. Provide one concrete, proactive suggestion. 
4. Explain the logical reason tied to their bodily biology or goal progress.
5. Classify the impact strictly as exactly one of: 'healthy', 'warning', or 'danger'.

Return ONLY pure valid JSON in exactly this format:
{
  "calories": number,
  "feedback": "string",
  "suggestion": "string",
  "reason": "string",
  "impact": "healthy" | "warning" | "danger"
}
`;
};

export const getDailySummaryPrompt = (
  targetCalories: number,
  totalCalories: number,
  meals: Meal[]
) => `
You are NutriMind. Provide an end-of-day health report.
Target: ${targetCalories} kcal. Consumed: ${totalCalories} kcal.

Meals today:
${JSON.stringify(meals, null, 2)}

Task: Provide actionable insights.
Return ONLY pure valid JSON in the exact format:
{
  "strengths": ["...", "..."],
  "mistakes": ["...", "..."],
  "improvements": ["...", "..."],
  "fullSummary": "..."
}
`;

// --- API METHODS ---

export const analyzeMealWithAI = async (
  mealDescription: string,
  currentCalories: number,
  targetCalories: number,
  todaysMeals: Meal[],
  _isStrictTone: boolean
): Promise<AIAnalysisResponse> => {
  try {
    const ai = getGenClient();
    const prompt = getMealAnalysisPrompt(mealDescription, currentCalories, targetCalories, todaysMeals, _isStrictTone);

    const response = await ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
          responseMimeType: 'application/json',
      }
    });

    if (!response.text) throw new Error("Failed to get response from Gemini");
    return JSON.parse(response.text) as AIAnalysisResponse;
  } catch (error) {
    console.warn("Gemini API falied. Using fallback response.", error);
    return {
      calories: 300,
      feedback: "Since I am offline, I am estimating this as a 300 kcal placeholder.",
      suggestion: "Make sure you connect an API key to unlock my true coaching potential.",
      reason: "API limits or missing key blocked this calculation.",
      impact: "warning"
    };
  }
};

export const generateDailySummaryWithAI = async (
    targetCalories: number,
    totalCalories: number,
    meals: Meal[]
  ): Promise<DailySummary> => {
    try {
      const ai = getGenClient();
      const prompt = getDailySummaryPrompt(targetCalories, totalCalories, meals);
    
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash',
        contents: prompt,
        config: {
            responseMimeType: 'application/json',
        }
      });
    
      if (!response.text) throw new Error("Failed to get response from Gemini");
      const parsed = JSON.parse(response.text);
      return {
          ...parsed,
          date: new Date().toISOString().split('T')[0] // today
      } as DailySummary;
    } catch (error) {
      console.warn("Gemini API failed. Using fallback summary.", error);
      return {
         date: new Date().toISOString().split('T')[0],
         totalCalories,
         strengths: ["Logged all your meals today"],
         mistakes: ["Missed API connection"],
         improvements: ["Add an API key to enable AI reporting"],
         fullSummary: "This is a fallback summary because the AI logic was unreachable."
      };
    }
  };
