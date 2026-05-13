# 🍽️ Meal'o'Clock

> Research-backed meal timing app that tells you exactly what to eat and when — personalised to your goal, sleep schedule and workout routine.

**[Live Demo](https://aaaansi.github.io/meal-timer/)**

![Meal'o'Clock Dashboard](screenshot.png)

---

## 🎯 What It Does

Most diet apps focus on *what* to eat. Meal'o'Clock focuses on *when* to eat — which research shows is equally important for energy, sleep quality, fat loss and muscle growth.

You enter your wake time, sleep time and goal. The app calculates your optimal meal windows based on peer-reviewed research on circadian rhythm and nutrient timing, then tracks your daily compliance.

---

## ✨ Features

### Core
- **Goal-based meal timing** — personalised schedules for weight loss, energy, sleep quality or muscle building
- **Right Now status** — instantly shows your current meal window and countdown to the next
- **Chronological meal schedule** — all meals sorted by time with current meal highlighted
- **Midnight rollover** — handles sleep schedules that cross midnight correctly

### Nutrition
- **Calorie guidance** — TDEE calculated from BMR using Mifflin-St Jeor equation
- **Macro breakdown** — protein/carbs/fat targets per meal based on goal
- **Food suggestions** — research-backed eat/avoid lists per meal per goal
- **Mi Band integration** — add extra calories burned from wearable for accurate net target

### Tracking
- **Meal compliance** — check off meals as you eat them
- **Live calorie tracker** — remaining calories update as you check meals
- **30-day history** — calendar view of compliance over time
- **Streak counter** — tracks consecutive good days (75%+ meals hit)

### Experience
- **Dark/light mode** — complementary colour schemes
- **12/24hr time format** — toggleable
- **Fasting window visualiser** — interactive bar showing eating vs fasting window
- **Collapsible cards** — clean UI that shows detail on demand
- **localStorage persistence** — remembers everything between sessions
- **Onboarding flow** — goal selection → times → instant dashboard

### Exercise
- **Pre-workout meal** — timed 2-3 hours before exercise
- **Pre-workout snack** — timed 45 minutes before exercise
- **Post-workout window** — critical 30-minute recovery window
- **Pre-sleep protein** — casein protein timing for overnight muscle recovery

---

## 🔬 The Science

Meal timing is based on three peer-reviewed sources:

**1. ISSN Nutrient Timing Position Stand (Kerksick et al., 2017)**
- Post-exercise protein: 20-40g within 30 minutes
- Pre-sleep casein: 30-40g for overnight muscle protein synthesis
- Protein distribution: 20g every 3-4 hours optimises MPS rates
- Pre-workout meal: 1-4g/kg carbohydrates 1-4 hours before exercise

**2. Circadian Rhythm & Meal Timing (BaHammam & Pirzada, 2023)**
- Breakfast within 30 minutes of waking resets peripheral body clocks
- Largest meal in the morning → better weight and metabolic outcomes
- Stop eating 2-3 hours before sleep protects melatonin and glucose
- Late eating increases hunger hormones and decreases energy expenditure

**3. Calorie Calculation — Mifflin-St Jeor Equation**
- Men: BMR = 88.36 + (13.4 × kg) + (4.8 × cm) - (5.7 × age)
- Women: BMR = 447.6 + (9.2 × kg) + (3.1 × cm) - (4.3 × age)
- TDEE = BMR × activity multiplier
- Target = TDEE ± goal adjustment (−500 lose / +300 muscle)

---

## 🏗️ Technical Decisions

**No framework** — built in vanilla JS, HTML and CSS. Deliberate choice to demonstrate core web fundamentals without abstraction. The DOM manipulation, event delegation and state management patterns used here are the same concepts frameworks abstract away.

**localStorage as database** — all user data persisted client-side. No backend, no accounts, no privacy concerns. Data structure designed to be extensible for future cloud sync.

**Event delegation** — single document-level click listener handles all dynamic card interactions rather than attaching listeners to each element. More performant and handles dynamically rendered content correctly.

**Single Page Application pattern** — three views (home, history, settings) managed by JS show/hide rather than separate HTML files. Eliminates page reloads and enables instant view transitions.

**Compliance data structure:**
```javascript
{
  "2026-05-13": {
    "🌅 Breakfast": true,
    "🍿 Snack": false,
    "☀️ Lunch": true
  }
}
```

- Keyed by date string for O(1) lookup. Streak calculation iterates backwards from today until a gap is found.

- Time math — all internal calculations in minutes since midnight (0-1439). Avoids Date object complexity for time arithmetic. Midnight rollover handled with modulo: minutes % 1440.

## 🚀 Getting Started

No installation required. Open `index.html` in a browser or visit the live demo.

To run locally:

```bash
git clone https://github.com/aaaansi/meal-timer.git
cd meal-timer
```
---

## 📚 References

1. Kerksick, C.M. et al. (2017). International society of sports nutrition position stand: nutrient timing. Journal of the International Society of Sports Nutrition, 14, 33.
https://doi.org/10.1186/s12970-017-0189-4
2. BaHammam, A.S. & Pirzada, A. (2023). Timing Matters: The Interplay between Early Mealtime, Circadian Rhythms, Gene Expression, Circadian Hormones, and Metabolism. Clocks & Sleep, 5(3), 507-535.
https://doi.org/10.3390/clockssleep5030034
3. Mifflin, M.D. et al. (1990). A new predictive equation for resting energy expenditure in healthy individuals. American Journal of Clinical Nutrition, 51(2), 241-247.