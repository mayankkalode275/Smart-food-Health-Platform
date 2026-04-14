# 🧠 NutriMind AI – Context-Aware Food & Health Assistant

An intelligent, AI-powered nutrition assistant that goes beyond simple calorie tracking.
NutriMind AI acts like a **real-time health coach**, understanding user behavior, analyzing food intake, and providing **personalized, context-aware guidance**.

---

## 🚀 Problem Statement

Most health apps only track calories — they don’t **understand behavior**.

Users often:

* Overeat without realizing patterns
* Skip meals and compensate later
* Receive generic, non-actionable suggestions

👉 There is a need for a **smart system** that not only tracks but **thinks, analyzes, and guides**.

---

## 💡 Solution

NutriMind AI is a **context-aware AI health assistant** that:

* Understands what you eat (natural language input)
* Tracks your daily intake intelligently
* Analyzes behavior patterns
* Provides **personalized, real-time suggestions**
* Acts like a **nutrition coach**, not just a tracker

---

## 🧠 Key Features

### 🔹 1. Context-Aware Intelligence

* Tracks all meals throughout the day
* Understands total calorie consumption
* Provides responses based on **full-day context**

---

### 🔹 2. AI-Powered Meal Analysis

* Input meals in natural language
  *e.g., “I ate pizza and coke”*
* AI returns:

  * Estimated calories
  * Health feedback
  * Suggestions
  * Reasoning

---

### 🔹 3. Behavioral Intelligence

* Detects patterns like:

  * Overeating
  * Skipping meals
  * Unhealthy streaks
* Adapts tone:

  * Supportive → Normal usage
  * Strict → Repeated unhealthy behavior

---

### 🔹 4. Goal-Based Personalization

* Supports:

  * Weight loss
  * Weight gain
  * Maintain health
* AI adjusts recommendations based on user goals

---

### 🔹 5. Smart Alerts System 🚨

* Real-time alerts such as:

  * “You skipped lunch”
  * “You exceeded your calorie limit”
  * “High sugar intake detected”

---

### 🔹 6. Daily AI Health Report 📊

* Generates end-of-day summary:

  * Strengths
  * Mistakes
  * Improvements
  * Actionable insights

---

### 🔹 7. Demo Mode (Hackathon Feature) 🎯

* Preloaded scenario:

  * Healthy breakfast
  * Skipped lunch
  * Heavy dinner
* Demonstrates AI intelligence in seconds

---

## 🏗️ Tech Stack

* **Frontend:** React + TypeScript (Vite)
* **Styling:** Tailwind CSS
* **Backend / Database:** Firebase Firestore
* **AI Engine:** Google Gemini API
* **Architecture:** Client-driven with AI-enhanced decision logic

---

## ⚙️ How It Works

1. User enters meal (natural language)
2. App processes input
3. Fetches daily context (previous meals)
4. Sends data to Gemini AI
5. AI generates structured response
6. UI updates with insights + feedback

---

## 🔁 Data Flow

User Input → Context Fetch → AI Processing → Response → UI Update

---

## 📦 Installation & Setup

```bash
# Clone the repository
git clone (https://github.com/mayankkalode275/Smart-food-Health-Platform)

# Install dependencies
npm install

# Start development server
npm run dev
```

---

## 🔐 Environment Variables

Create a `.env` file:

```env
VITE_GEMINI_API_KEY=your_api_key_here
```

---

## 🎯 Demo Usage

1. Enter a meal:

   > “I ate burger and coke”

2. Get:

   * Calories estimate
   * Personalized feedback
   * Smart suggestion

3. Generate daily report

---

## 🧪 Assumptions

* Calorie values are estimated using AI
* User input is natural language (no strict format required)
* Focus is on **behavioral intelligence**, not medical precision

---

## 🏆 Why This Project Stands Out

✔ Not just tracking — **thinking system**
✔ Context-aware AI (rare in hackathons)
✔ Behavioral intelligence
✔ Real-world usability
✔ Strong integration of Google AI

---

## 🔮 Future Enhancements

* Integration with wearable devices (Google Fit)
* Nutrition breakdown (protein, carbs, fats)
* Voice input support
* Multi-day analytics dashboard

---

## ⭐ Final Note

NutriMind AI is not just an app.
It’s a step toward **smarter, AI-driven health awareness**.
