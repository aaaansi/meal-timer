const HOURS = 60;
const MINUTESADAY = 1440;

// ---- VIEW MANAGEMENT ----
function showView(viewId){
    ["homeView", "historyView", "settingsView"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
    document.getElementById(viewId).style.display = "block";

    document.querySelectorAll(".nav-item").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.view === viewId);
    });
}

function showApp(){
    document.getElementById("firstTime").style.display = "none";
    document.getElementById("mainApp").style.display = "block";
    showView("homeView");
}

function showOnboarding(){
    document.getElementById("mainApp").style.display = "none";
    document.getElementById("firstTime").style.display = "block";
}

// ---- NAV ----
document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", function(){
        showView(this.dataset.view);
        if (this.dataset.view === "historyView") renderHistory();
        if (this.dataset.view === "settingsView") syncSettingsFromStorage();
    });
});

// ---- APP TITLE ----
document.getElementById("appTitle")
    .addEventListener("click", function(){
        const wake = localStorage.getItem("wakeupTime");
        const sleep = localStorage.getItem("sleepTime");
        if (wake) document.getElementById("wakeupTimeFirst").value = wake;
        if (sleep) document.getElementById("sleepTimeFirst").value = sleep;
        showOnboarding();
    });

// ---- GOAL SELECTION ----
let selectedGoal = null;

document.querySelectorAll(".goal-card").forEach(card => {
    card.addEventListener("click", function(){
        document.querySelectorAll(".goal-card").forEach(c => c.classList.remove("selected"));
        this.classList.add("selected");
        selectedGoal = this.dataset.goal;
        document.getElementById("step1Next").style.display = "block";
    });
});

document.getElementById("step1Next")
    .addEventListener("click", function(){
        document.getElementById("step1").style.display = "none";
        document.getElementById("step2").style.display = "flex";
    });

document.getElementById("step2Back")
    .addEventListener("click", function(){
        document.getElementById("step2").style.display = "none";
        document.getElementById("step1").style.display = "flex";
    });

document.getElementById("getStartedButton")
    .addEventListener("click", function(){
        const wake  = document.getElementById("wakeupTimeFirst").value;
        const sleep = document.getElementById("sleepTimeFirst").value;
        if (!wake || !sleep){
            alert("Please enter your wake and sleep times!");
            return;
        }
        localStorage.setItem("wakeupTime", wake);
        localStorage.setItem("sleepTime", sleep);
        localStorage.setItem("goal", selectedGoal || "energy");
        showApp();
        calculate();
    });

// ---- SETTINGS ----
document.getElementById("exerciseToggle")
    .addEventListener("change", function(){
        document.getElementById("exerciseTimeContainer").style.display =
            this.checked ? "block" : "none";
        if (!this.checked){
            document.getElementById("exerciseTime").value = "";
            localStorage.removeItem("exerciseTime");
        }
    });

document.getElementById("profileToggle")
    .addEventListener("change", function(){
        document.getElementById("profileContainer").style.display =
            this.checked ? "block" : "none";
    });

document.getElementById("saveButton")
    .addEventListener("click", function(){
        saveFromSettings();
        showView("homeView");
        calculate();
    });

document.getElementById("resetButton")
    .addEventListener("click", function(){
        if (confirm("Reset everything and start over?")){
            localStorage.clear();
            showOnboarding();
        }
    });

function saveFromSettings(){
    const wake  = document.getElementById("wakeupTime").value;
    const sleep = document.getElementById("sleepTime").value;
    if (!wake || !sleep){
        alert("Please enter wake and sleep times!");
        return;
    }

    const age    = parseInt(document.getElementById("age").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);

    const profileOn = document.getElementById("profileToggle").checked;
    if (profileOn){
        if (age < 10 || age > 100){
            alert("Please enter a valid age (10-100)");
            return;
        }
        if (weight < 30 || weight > 300){
            alert("Please enter a valid weight (30-300 kg)");
            return;
        }
        if (height < 100 || height > 250){
            alert("Please enter a valid height (100-250 cm)");
            return;
        }
    }
    localStorage.setItem("lightMode", document.getElementById("lightMode").checked);
    localStorage.setItem("wakeupTime", wake);
    localStorage.setItem("sleepTime", sleep);
    localStorage.setItem("exerciseTime", document.getElementById("exerciseTime").value);
    localStorage.setItem("timeFormat", document.getElementById("timeFormat").checked);
    localStorage.setItem("exerciseToggle", document.getElementById("exerciseToggle").checked);
    localStorage.setItem("goal", document.getElementById("goalSelect").value);

    const profileEnabled = document.getElementById("profileToggle").checked;
    localStorage.setItem("profileToggle", profileEnabled);


    if (profileEnabled){
        localStorage.setItem("age", document.getElementById("age").value);
        localStorage.setItem("weight", document.getElementById("weight").value);
        localStorage.setItem("height", document.getElementById("height").value);
        localStorage.setItem("sex", document.getElementById("sex").value);
        localStorage.setItem("goal", document.getElementById("goal").value);
        localStorage.setItem("activity", document.getElementById("activity").value);
        localStorage.setItem("extraCalories", document.getElementById("extraCalories").value);
    } else {
        ["age","weight","height","sex","goal","activity","extraCalories"]
            .forEach(key => localStorage.removeItem(key));
    }
}



function syncSettingsFromStorage(){
    const fields = ["wakeupTime","sleepTime","exerciseTime","age","weight","height","sex","goal","activity","extraCalories"];
    fields.forEach(id => {
        const saved = localStorage.getItem(id);
        const el = document.getElementById(id);
        if (saved && el) el.value = saved;
    });

    const timeFormat = localStorage.getItem("timeFormat");
    if (timeFormat !== null)
        document.getElementById("timeFormat").checked = timeFormat === "true";

    const exerciseToggle = localStorage.getItem("exerciseToggle");
    if (exerciseToggle === "true"){
        document.getElementById("exerciseToggle").checked = true;
        document.getElementById("exerciseTimeContainer").style.display = "block";
    }

    const profileToggle = localStorage.getItem("profileToggle");
    if (profileToggle === "true"){
        document.getElementById("profileToggle").checked = true;
        document.getElementById("profileContainer").style.display = "block";
    }

    const goal = localStorage.getItem("goal");
    if (goal){
        const goalSelect = document.getElementById("goalSelect");
        if (goalSelect) goalSelect.value = goal;
    }

    applyTheme(); 
}

// ---- CLICK HANDLERS ----
document.addEventListener("click", function(e){
    const collapsible = e.target.closest(".collapsible");
    if (collapsible){
        collapsible.classList.toggle("expanded");
    } else {
        const scheduleItem = e.target.closest(".schedule-item");
        if (scheduleItem) scheduleItem.classList.toggle("expanded");
    }
});

// ---- CALCULATE ----
function calculate(){
    const wakeupTime = localStorage.getItem("wakeupTime");
    const sleepTime  = localStorage.getItem("sleepTime");
    const userGoal = localStorage.getItem("goal") || "energy";
    if (!wakeupTime || !sleepTime) return;

    const wakeMinutes = timeToMinutes(wakeupTime);
    let sleepMinutes  = timeToMinutes(sleepTime);
    if (sleepMinutes < wakeMinutes) sleepMinutes += MINUTESADAY;

    const tdeeData = calculateTDEE();
    const tdee = tdeeData ? tdeeData.target : null;

    // Goal based adjustments
    const goalAdjustments = {
        lose: {
            dinnerOffset:     HOURS * 4,    // earlier dinner
            stopEatingOffset: HOURS * 3,    // stop eating earlier
            emphasis: "stop eating"
        },
        energy: {
            dinnerOffset:     HOURS * 3,
            stopEatingOffset: HOURS * 2,
            emphasis: "breakfast"
        },
        sleep: {
            dinnerOffset:     HOURS * 4,    // much earlier dinner
            stopEatingOffset: HOURS * 3,    // strict cutoff
            emphasis: "stop eating"
        },
        muscle: {
            dinnerOffset:     HOURS * 3,
            stopEatingOffset: HOURS * 2,
            emphasis: "post workout"
        }
    };

    const adj = goalAdjustments[userGoal] || goalAdjustments.energy;

    const cal = {
        breakfast:       tdee ? Math.round(tdee * 0.30) : null,
        snack:           tdee ? Math.round(tdee * 0.10) : null,
        lunch:           tdee ? Math.round(tdee * 0.25) : null,
        dinner:          tdee ? Math.round(tdee * 0.20) : null,
        preWorkoutMeal:  tdee ? Math.round(tdee * 0.15) : null,
        preWorkoutSnack: tdee ? Math.round(tdee * 0.08) : null,
        postWorkout:     tdee ? Math.round(tdee * 0.15) : null,
        preSleep:        tdee ? Math.round(tdee * 0.05) : null,
    };

    const meals = [
        {label: "🌅 Breakfast", sortTime: wakeMinutes + 30, type: "Largest meal • High carbs + protein", description: getDescription("breakfast", userGoal), calories: cal.breakfast, macros: {carbs: 0.50, protein: 0.30, fat: 0.20}},
        {label: "🍿 Snack", sortTime: wakeMinutes + HOURS * 3, type: "Small • Fruits, nuts or yogurt", description: getDescription("snack", userGoal), calories: cal.snack, macros: {carbs: 0.40, protein: 0.40, fat: 0.20}},
        {label: "☀️ Lunch", sortTime: wakeMinutes + HOURS * 5, type: "Moderate • Balanced macros", description: getDescription("lunch", userGoal), calories: cal.lunch, macros: {carbs: 0.40, protein: 0.30, fat: 0.30}},
        {label: "🌄 Dinner", sortTime: sleepMinutes - adj.dinnerOffset, type: "Small • Low carb, high protein", description: getDescription("dinner", userGoal), calories: cal.dinner, macros: {carbs: 0.20, protein: 0.50, fat: 0.30}},
        {label: "🎑 Stop Eating", sortTime: sleepMinutes - adj.stopEatingOffset, type: "⚠️ No food after this", description: getDescription("stop", userGoal), calories: null, macros: null},
    ];

    const exerciseTime   = localStorage.getItem("exerciseTime");
    const exerciseToggle = localStorage.getItem("exerciseToggle") === "true";
    if (exerciseToggle && exerciseTime){
        const exerciseMinutes = timeToMinutes(exerciseTime);
        meals.push(
            {label: "🍽️ Pre-workout meal", sortTime: exerciseMinutes - HOURS * 3, type: "High carbs + moderate protein", description: "Eat 2-3 hrs before. High complex carbs + moderate protein. Maximises glycogen stores for performance.", calories: cal.preWorkoutMeal, macros: {carbs: 0.60, protein: 0.25, fat: 0.15}},
            {label: "⚡ Pre-workout snack", sortTime: exerciseMinutes - HOURS * 0.75, type: "Quick carbs • Banana, rice cakes", description: "45 mins before. Quick carbs only — banana, rice cakes, energy gel. Easy to digest, fast energy.", calories: cal.preWorkoutSnack, macros: {carbs: 0.80, protein: 0.10, fat: 0.10}},
            {label: "💪 Post workout", sortTime: exerciseMinutes + HOURS / 2, type: "Carbs + protein within 30 mins", description: "Most critical window. Carbs + protein within 30 mins. Repairs muscle and replenishes glycogen fast.", calories: cal.postWorkout, macros: {carbs: 0.50, protein: 0.40, fat: 0.10}},
            {label: "🌙 Pre sleep", sortTime: sleepMinutes - HOURS / 2, type: "Casein only • Greek yogurt, cottage cheese", description: "Casein protein only — Greek yogurt or cottage cheese. Slow digesting, feeds muscles overnight without spiking blood sugar.", calories: cal.preSleep, macros: {carbs: 0.10, protein: 0.80, fat: 0.10}},
        );
    }

    meals.sort((a, b) => a.sortTime - b.sortTime);

    renderStatus(meals);
    renderFastingBar(wakeMinutes, sleepMinutes);
    renderSchedule(meals, tdee);
}

// ---- RENDER STATUS ----
function renderStatus(meals){
    const now = new Date();
    const currentMinutes = now.getHours() * HOURS + now.getMinutes();

    let current = null;
    let next = null;

    for (let i = 0; i < meals.length; i++){
        if (meals[i].sortTime <= currentMinutes) current = meals[i];
        else { next = meals[i]; break; }
    }
    if (!next) next = meals[0];

    const minutesUntilNext = next
        ? next.sortTime > currentMinutes
            ? next.sortTime - currentMinutes
            : (next.sortTime + MINUTESADAY) - currentMinutes
        : null;

    const hoursUntil = Math.floor(minutesUntilNext / HOURS);
    const minsUntil  = minutesUntilNext % HOURS;
    const timeUntilText = hoursUntil > 0
        ? `${hoursUntil} hr ${minsUntil} min`
        : `${minsUntil} min`;

    document.getElementById("currentMeal").textContent =
        current ? current.label : "No meal window yet";
    document.getElementById("currentDetails").textContent =
        current ? current.type : "Your first meal window hasn't started yet";
    document.getElementById("nextMeal").innerHTML =
        next ? `Next: <span>${next.label}</span> at ${minutesToTime(next.sortTime)}` : "";
    document.getElementById("countdown").textContent =
        next ? `⏳ In ${timeUntilText}` : "";

    updateStreak();
}

// ---- FASTING BAR ----
function renderFastingBar(wakeMinutes, sleepMinutes){
    const breakfastStart = wakeMinutes + 30;
    const eatStop = sleepMinutes - HOURS * 2;

    const now = new Date();
    const currentMinutes = now.getHours() * HOURS + now.getMinutes();

    const toPercent = (mins) => (mins / MINUTESADAY) * 100;

    const eatStartPct = toPercent(breakfastStart);
    const eatWidthPct = toPercent(eatStop - breakfastStart);
    const nowPct = toPercent(currentMinutes);

    const eatingWindow = document.getElementById("eatingWindow");
    const nowMarker = document.getElementById("nowMarker");

    eatingWindow.style.left  = `${eatStartPct}%`;
    eatingWindow.style.width = `${eatWidthPct}%`;
    nowMarker.style.left     = `${nowPct}%`;

    const isInEatingWindow = currentMinutes >= breakfastStart && currentMinutes <= eatStop;
    const minutesUntilOpen  = breakfastStart - currentMinutes;
    const minutesUntilClose = eatStop - currentMinutes;

    let countdownText = "";
    if (isInEatingWindow){
        const hrs = Math.floor(minutesUntilClose / HOURS);
        const mins = minutesUntilClose % HOURS;
        countdownText = hrs > 0
            ? `Eating window closes in ${hrs}h ${mins}m`
            : `Eating window closes in ${mins}m`;
    } else if (minutesUntilOpen > 0){
        const hrs = Math.floor(minutesUntilOpen / HOURS);
        const mins = minutesUntilOpen % HOURS;
        countdownText = hrs > 0
            ? `Eating window opens in ${hrs}h ${mins}m`
            : `Eating window opens in ${mins}m`;
    } else {
        countdownText = "Fasting window — no food until morning";
    }

    document.getElementById("fastingCountdown").textContent = countdownText;

    const eatingHrs  = Math.floor((eatStop - breakfastStart) / HOURS);
    const fastingHrs = 24 - eatingHrs;
    document.getElementById("eatingWindowText").textContent =
        `${minutesToTime(breakfastStart)} → ${minutesToTime(eatStop)} • ${eatingHrs}h eating / ${fastingHrs}h fasting`;
}

// ---- RENDER SCHEDULE ----
function renderSchedule(meals, tdee){
    const now = new Date();
    const currentMinutes = now.getHours() * HOURS + now.getMinutes();
    const scheduleList = document.getElementById("scheduleList");
    scheduleList.innerHTML = "";

    const lastPastMeal = meals.filter(m => m.sortTime <= currentMinutes).slice(-1)[0];
    const data = getComplianceData();
    const today = getTodayKey();
    const todayData = data[today] || {};

    let totalCal = 0;
    let eatenCal = 0;

    meals.forEach(meal => {
        const isCurrentMeal = meal === lastPastMeal;
        const isPast = meal.sortTime < currentMinutes && !isCurrentMeal;

        let className = "schedule-item";
        if (isPast) className += " past";
        if (isCurrentMeal) className += " current";

        let macroHTML = "";
        if (meal.calories && meal.macros){
            const protein = Math.round((meal.calories * meal.macros.protein) / 4);
            const carbs   = Math.round((meal.calories * meal.macros.carbs) / 4);
            const fat     = Math.round((meal.calories * meal.macros.fat) / 9);
            macroHTML = `
                <div class="meal-macros">
                    <span class="macro protein">🥩 ${protein}g protein</span>
                    <span class="macro carbs">🌾 ${carbs}g carbs</span>
                    <span class="macro fat">🥑 ${fat}g fat</span>
                </div>
            `;
        }

        const calorieText = meal.calories ? `${meal.calories} kcal` : "";
        const isChecked = todayData[meal.label] === true;

        if (meal.calories){
            totalCal += meal.calories;
            if (isChecked) eatenCal += meal.calories;
        }
        const isStopEating = meal.label === "🎑 Stop Eating";

        const item = document.createElement("div");
        item.className = className;
        item.innerHTML = `
            <div class="schedule-dot"></div>
            <div class="schedule-time">${minutesToTime(meal.sortTime)}</div>
            <div class="schedule-label">${meal.label}</div>
            <div class="schedule-calories">${calorieText}</div>
            ${!isStopEating ? `
            <input type="checkbox"
                class="meal-check"
                data-meal="${meal.label}"
                data-calories="${meal.calories || 0}"
                ${isChecked ? "checked" : ""}
                onclick="event.stopPropagation(); handleMealCheck('${meal.label}', this.checked, ${meal.calories || 0})"/>
            ` : ""}
        `;

        const userGoal = localStorage.getItem("goal") || "energy";
        const foodHTML = getFoodSuggestions(meal.label, userGoal);

        const details = document.createElement("div");
        details.className = "schedule-details";
        details.innerHTML = `
            <p>${meal.description}</p>
            ${macroHTML}
            ${foodHTML}
        `;

        scheduleList.appendChild(item);
        scheduleList.appendChild(details);
    });

    updateCaloriesRemaining(eatenCal, totalCal, tdee);
    updateDailyProgress();
    updateStreak();
}

// ---- MEAL CHECK ----
function handleMealCheck(mealLabel, checked, calories){
    markMeal(mealLabel, checked);

    let totalCal = 0;
    let eatenCal = 0;
    document.querySelectorAll(".meal-check").forEach(cb => {
        const cal = parseInt(cb.dataset.calories) || 0;
        if (cal > 0){
            totalCal += cal;
            if (cb.checked) eatenCal += cal;
        }
    });

    const tdeeData = calculateTDEE();
    updateCaloriesRemaining(eatenCal, totalCal, tdeeData ? tdeeData.target : null);
}

// ---- CALORIES REMAINING ----
function updateCaloriesRemaining(eaten, total, tdee){
    const el = document.getElementById("caloriesRemaining");
    if (!el) return;
    
    // hide entirely if no calorie data
    if (total === 0){
        el.innerHTML = "";
        el.style.display = "none";
        return;
    }
    
    el.style.display = "block";
    const remaining = total - eaten;
    el.innerHTML = `
        <div class="remaining-row">
            <span class="remaining-label">✅ Eaten so far</span>
            <span class="remaining-value green">${eaten} kcal</span>
        </div>
        <div class="remaining-row">
            <span class="remaining-label">🍽️ Remaining today</span>
            <span class="remaining-value ${remaining < 0 ? "red" : "highlight"}">${remaining} kcal</span>
        </div>
        <div class="remaining-row">
            <span class="remaining-label">📊 Daily total</span>
            <span class="remaining-value">${total} kcal</span>
        </div>
        ${tdee ? `
        <div class="remaining-row">
            <span class="remaining-label">🎯 TDEE target</span>
            <span class="remaining-value">${tdee} kcal</span>
        </div>` : ""}
    `;
}

// ---- COMPLIANCE ----
function getTodayKey(){
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
}

function getComplianceData(){
    const data = localStorage.getItem("compliance");
    return data ? JSON.parse(data) : {};
}

function saveComplianceData(data){
    localStorage.setItem("compliance", JSON.stringify(data));
}

function markMeal(mealLabel, checked){
    const data = getComplianceData();
    const today = getTodayKey();
    if (!data[today]) data[today] = {};
    data[today][mealLabel] = checked;
    saveComplianceData(data);
    updateDailyProgress();
    updateStreak();
}

function updateDailyProgress(){
    const checkboxes = document.querySelectorAll(".meal-check");
    const total = checkboxes.length;
    const hit   = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percent = total > 0 ? Math.round((hit / total) * 100) : 0;

    const el = document.getElementById("dailyProgress");
    if (el){
        el.innerHTML = `
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${percent}%"></div>
            </div>
            <div class="progress-text">${hit}/${total} meals today ${percent >= 75 ? "🎉" : ""}</div>
        `;
    }
}

function calculateStreak(){
    const data = getComplianceData();
    let streak = 0;
    const now = new Date();
    for (let i = 0; i < 365; i++){
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const key = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        const dayData = data[key];
        if (!dayData) break;
        const total = Object.keys(dayData).length;
        const hit   = Object.values(dayData).filter(v => v).length;
        if (total === 0 || hit / total < 0.75) break;
        streak++;
    }
    return streak;
}

function calculateBestStreak(){
    const data = getComplianceData();
    const keys = Object.keys(data).sort();
    let best = 0;
    let current = 0;
    keys.forEach(key => {
        const dayData = data[key];
        const total = Object.keys(dayData).length;
        const hit   = Object.values(dayData).filter(v => v).length;
        if (total > 0 && hit / total >= 0.75){
            current++;
            best = Math.max(best, current);
        } else {
            current = 0;
        }
    });
    return best;
}

function updateStreak(){
    const streak = calculateStreak();
    const el = document.getElementById("streakCount");
    if (el){
        el.textContent = streak > 0
            ? `🔥 ${streak} day streak`
            : "Start your streak today!";
    }
}

// ---- HISTORY ----
function renderHistory(){
    const data = getComplianceData();
    const streak = calculateStreak();
    const best   = calculateBestStreak();
    const goodDays = Object.values(data).filter(day => {
        const total = Object.keys(day).length;
        const hit   = Object.values(day).filter(v => v).length;
        return total > 0 && hit / total >= 0.75;
    }).length;

    document.getElementById("currentStreak").textContent = streak;
    document.getElementById("bestStreak").textContent    = best;
    document.getElementById("totalDays").textContent     = goodDays;

    const now = new Date();
    let html = '<div class="calendar-grid">';

    for (let i = 29; i >= 0; i--){
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const key = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        const dayData = data[key];
        const day = date.getDate();

        let status = "empty";
        if (dayData){
            const total = Object.keys(dayData).length;
            const hit   = Object.values(dayData).filter(v => v).length;
            const pct   = total > 0 ? hit / total : 0;
            if      (pct >= 0.75) status = "good";
            else if (pct >= 0.50) status = "ok";
            else                  status = "bad";
        }

        html += `<div class="calendar-day ${status} ${i === 0 ? "today" : ""}"><span>${day}</span></div>`;
    }

    html += `</div>
    <div class="calendar-legend">
        <span class="legend-item"><span class="legend-dot good"></span> 75%+ meals</span>
        <span class="legend-item"><span class="legend-dot ok"></span> 50%+ meals</span>
        <span class="legend-item"><span class="legend-dot bad"></span> Below 50%</span>
        <span class="legend-item"><span class="legend-dot empty"></span> No data</span>
    </div>`;

    document.getElementById("calendar").innerHTML = html;
}

// ---- TDEE ----
function calculateTDEE(){
    const profileEnabled = localStorage.getItem("profileToggle") === "true";
    if (!profileEnabled) return null;

    const age    = parseInt(localStorage.getItem("age"));
    const weight = parseFloat(localStorage.getItem("weight"));
    const height = parseFloat(localStorage.getItem("height"));
    const sex    = localStorage.getItem("sex") || "male";
    const goal   = localStorage.getItem("goal") || "maintain";
    const activity    = parseFloat(localStorage.getItem("activity")) || 1.2;
    const extraCalories = parseInt(localStorage.getItem("extraCalories")) || 0;

    if (!age || !weight || !height) return null;

    let bmr;
    if (sex === "male"){
        bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else {
        bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    }

    const tdee   = Math.round(bmr * activity);
    const netTDEE = tdee + extraCalories;
    let target   = netTDEE;
    if (goal === "lose") target -= 500;
    if (goal === "gain") target += 300;

    return {
        bmr:         Math.round(bmr),
        tdee:        tdee,
        extraBurn:   extraCalories,
        maintenance: netTDEE,
        target:      target,
        goal:        goal
    };
}

// ---- FASTING CALC ----
function calculateFastingWindow(wakeMinutes, stopEatingMinutes){
    const breakfastTime = wakeMinutes + 30;
    const eatingWindow  = stopEatingMinutes - breakfastTime;
    const fastingWindow = MINUTESADAY - eatingWindow;
    return {
        eatingHrs:  Math.floor(eatingWindow / HOURS),
        fastingHrs: Math.floor(fastingWindow / HOURS),
        protocol:   `${Math.floor(fastingWindow / HOURS)}:${Math.floor(eatingWindow / HOURS)}`
    };
}

// ---- TIME UTILS ----
function timeToMinutes(timeString){
    const arr = timeString.split(':');
    return parseInt(arr[0]) * HOURS + parseInt(arr[1]);
}

function minutesToTime(minutes){
    minutes = minutes < 0 ? minutes + MINUTESADAY : minutes;
    minutes = minutes % MINUTESADAY;
    const hours = String(Math.floor(minutes / HOURS)).padStart(2, '0');
    const mins  = String(minutes % HOURS).padStart(2, '0');
    return formatTime(hours, mins);
}

function formatTime(hours, minutes){
    const is12Hour = localStorage.getItem("timeFormat") === "true";
    const h = parseInt(hours);
    if (is12Hour){
        const ampm = h >= 12 ? "PM" : "AM";
        const h12  = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    }
    return `${hours}:${minutes}`;
}

function getMealKey(label){
    const map = {
        "🌅 Breakfast":       "breakfast",
        "🍿 Snack":           "snack",
        "☀️ Lunch":           "lunch",
        "🌄 Dinner":          "dinner",
        "🎑 Stop Eating":     "stop",
        "🍽️ Pre-workout meal": "preWorkoutMeal",
        "⚡ Pre-workout snack": "preWorkoutSnack",
        "💪 Post workout":    "postWorkout",
        "🌙 Pre sleep":       "preSleep"
    };
    return map[label] || null;
}

function getFoodSuggestions(mealLabel, goal){
    const key = getMealKey(mealLabel);
    if (!key) return "";
    
    const suggestions = foodSuggestions[key]?.[goal];
    if (!suggestions) return "";

    const eatList   = suggestions.eat.map(f   => `<li class="food-eat">✓ ${f}</li>`).join("");
    const avoidList = suggestions.avoid.map(f => `<li class="food-avoid">✗ ${f}</li>`).join("");

    return `
        <div class="food-suggestions">
            <div class="food-section-title">💡 What to eat:</div>
            <ul class="food-list">${eatList}</ul>
            <div class="food-section-title avoid-title">⚠️ Avoid:</div>
            <ul class="food-list">${avoidList}</ul>
        </div>
    `;
}

// ---- THEME ----
function applyTheme(){
    const isLight = localStorage.getItem("lightMode") === "true";
    document.body.classList.toggle("light-mode", isLight);
    const toggle = document.getElementById("lightMode");
    if (toggle) toggle.checked = isLight;
}

// ---- FOOD SUGGESTIONS ----
const foodSuggestions = {
    breakfast: {
        lose: {
            eat:   [
                "🥚 Scrambled eggs (high protein, keeps you full)",
                "🥛 Greek yogurt with berries (protein + antioxidants)",
                "🧀 Cottage cheese (slow digesting protein)",
                "🦃 Turkey slices (lean protein, zero carbs)",
                "🥑 Avocado + eggs (healthy fats + protein)"
            ],
            avoid: [
                "🥐 Pastries and croissants (high sugar, spikes insulin)",
                "🧃 Fruit juice (liquid sugar, no fibre)",
                "🥣 Sugary cereals (crashes energy fast)",
                "🍞 White toast (refined carbs, low satiety)",
                "🧇 Waffles and pancakes with syrup"
            ]
        },
        energy: {
            eat:   [
                "🌾 Oats with banana and honey (slow release energy)",
                "🍳 Eggs on whole grain toast (carbs + protein)",
                "🥛 Greek yogurt + granola + berries",
                "🥤 Protein smoothie with oats and fruit",
                "🌰 Whole grain cereal with milk and nuts"
            ],
            avoid: [
                "🥐 Pastries (energy crash within 1-2 hours)",
                "🧃 Fruit juice (sugar spike without fibre)",
                "🥣 Sugary cereals (poor sustained energy)",
                "☕ Coffee only — always pair with food",
                "🍩 Donuts or muffins (refined sugar)"
            ]
        },
        sleep: {
            eat:   [
                "🌾 Oats (contains melatonin precursors)",
                "🥛 Warm milk with oats (tryptophan rich)",
                "🍌 Banana with nut butter (magnesium + tryptophan)",
                "🥚 Eggs on whole grain toast (balanced, not heavy)",
                "🫐 Greek yogurt with berries (light and nutritious)"
            ],
            avoid: [
                "☕ High caffeine foods or drinks",
                "🧃 Sugary juices (blood sugar instability affects sleep)",
                "🍩 Heavy fried foods (digestive burden)",
                "🌶️ Spicy foods (raises core temperature)",
                "🥐 Refined carbs (disrupts circadian rhythm)"
            ]
        },
        muscle: {
            eat:   [
                "🥚 4-5 eggs scrambled (complete amino acid profile)",
                "🌾 Oats + whey protein (carbs + fast protein)",
                "🥛 Greek yogurt + granola + banana (protein + carbs)",
                "🍗 Chicken + sweet potato hash (lean protein + complex carbs)",
                "🥤 Mass gainer shake if bulking"
            ],
            avoid: [
                "🥐 Pastries (empty calories, no muscle building value)",
                "🧃 Fruit juice only (insufficient protein)",
                "🍩 Donuts (high fat, high sugar, no protein)",
                "🥣 Low protein cereals",
                "☕ Skipping food entirely — muscles need morning protein"
            ]
        }
    },
    snack: {
        lose: {
            eat:   [
                "🥛 Greek yogurt plain (high protein, low sugar)",
                "🥚 Hard boiled eggs (protein, zero carbs)",
                "🧀 Cottage cheese (filling, low calorie)",
                "🥒 Cucumber + hummus (fibre + protein)",
                "🌰 Small handful of almonds (healthy fats, filling)"
            ],
            avoid: [
                "🍫 Chocolate bars (high sugar, high calorie)",
                "🍪 Biscuits and cookies (refined carbs)",
                "🥤 Energy drinks (sugar spike and crash)",
                "🍟 Crisps (empty calories, addictive)",
                "🧃 Fruit juice (liquid calories)"
            ]
        },
        energy: {
            eat:   [
                "🍎 Apple with almond butter (fibre + healthy fat)",
                "🌰 Mixed nuts and dried fruit (sustained energy)",
                "🥛 Greek yogurt with honey (protein + quick carbs)",
                "🍌 Banana (fast acting natural sugars)",
                "🧀 Cheese and whole grain crackers"
            ],
            avoid: [
                "🍫 Chocolate bars (energy spike then crash)",
                "🥤 Energy drinks (jittery energy, poor quality)",
                "🍪 Biscuits (fast carbs, no sustained energy)",
                "🍟 Crisps (fat + salt, no energy value)",
                "🧃 Sugary drinks"
            ]
        },
        sleep: {
            eat:   [
                "🍒 Tart cherries (natural melatonin source)",
                "🌰 Walnuts (melatonin + omega 3)",
                "🥛 Small glass of warm milk (tryptophan)",
                "🍌 Banana (magnesium + tryptophan)",
                "🫐 Blueberries (antioxidants, anti-inflammatory)"
            ],
            avoid: [
                "☕ Caffeine in any form",
                "🍫 Dark chocolate (contains caffeine)",
                "🥤 Energy drinks",
                "🍟 Salty snacks (raises blood pressure)",
                "🍪 Sugary snacks (blood sugar instability)"
            ]
        },
        muscle: {
            eat:   [
                "🥛 Protein shake (fast muscle protein synthesis)",
                "🧀 Cottage cheese + fruit (casein + carbs)",
                "🥚 Hard boiled eggs (complete protein)",
                "🌰 Mixed nuts + Greek yogurt (protein + healthy fats)",
                "🍗 Chicken strips (lean complete protein)"
            ],
            avoid: [
                "🍫 Chocolate (insufficient protein)",
                "🍪 Biscuits (empty carbs no protein)",
                "🥤 Sugary drinks (no muscle building value)",
                "🍟 Crisps (fat + salt, no protein)",
                "🍩 Pastries (no muscle building value)"
            ]
        }
    },
    lunch: {
        lose: {
            eat:   [
                "🥗 Large salad with grilled chicken (high volume, low calorie)",
                "🐟 Salmon + steamed vegetables (omega 3 + protein)",
                "🍗 Grilled chicken + roasted vegetables (lean protein)",
                "🥙 Turkey wrap in whole grain (balanced macros)",
                "🫘 Lentil soup (fibre + plant protein, very filling)"
            ],
            avoid: [
                "🍔 Burgers (high calorie, high fat)",
                "🍕 Pizza (refined carbs + high fat)",
                "🍝 Creamy pasta (high calorie density)",
                "🌯 Mayo heavy wraps",
                "🍟 Anything fried"
            ]
        },
        energy: {
            eat:   [
                "🍗 Chicken + brown rice + vegetables (balanced macros)",
                "🐟 Tuna salad on whole grain bread",
                "🥗 Buddha bowl with quinoa + chickpeas + avocado",
                "🥙 Grilled wrap with lean meat + salad",
                "🫘 Bean and vegetable soup + whole grain roll"
            ],
            avoid: [
                "🍔 Heavy burgers (post-lunch energy crash)",
                "🍝 Heavy pasta dishes (blood sugar spike)",
                "🍕 Pizza (high fat, causes afternoon sluggishness)",
                "🍟 Fried foods (digestive burden)",
                "🥤 Sugary drinks with lunch"
            ]
        },
        sleep: {
            eat:   [
                "🐟 Salmon + sweet potato (tryptophan + complex carbs)",
                "🍗 Turkey + brown rice (tryptophan rich)",
                "🥗 Salad with tuna + whole grain bread",
                "🫘 Lentil and vegetable stew",
                "🥙 Hummus + vegetable wrap"
            ],
            avoid: [
                "🌶️ Very spicy foods (raises body temperature)",
                "☕ Caffeinated drinks with lunch",
                "🍔 Heavy greasy meals (digestive burden)",
                "🍺 Alcohol (fragments sleep architecture)",
                "🍝 Heavy creamy sauces"
            ]
        },
        muscle: {
            eat:   [
                "🍗 Chicken breast + white rice + broccoli (classic bulk meal)",
                "🥩 Lean beef + sweet potato + salad",
                "🐟 Salmon + quinoa + vegetables (omega 3 + complete protein)",
                "🥚 Omelette with cheese + whole grain toast + fruit",
                "🫘 High protein bean bowl with chicken"
            ],
            avoid: [
                "🥗 Salad only (insufficient calories for muscle growth)",
                "🍕 Pizza (poor macro split for muscle building)",
                "🍔 Fast food burgers (bad fats, processed)",
                "🍟 Fried foods (inflammation)",
                "🥤 Sugary drinks (insulin spike at wrong time)"
            ]
        }
    },
    dinner: {
        lose: {
            eat:   [
                "🐟 White fish + steamed vegetables (very low calorie, high protein)",
                "🥗 Large salad with grilled protein",
                "🍗 Grilled chicken + roasted broccoli + cauliflower",
                "🦐 Stir fried prawns + vegetables (no rice)",
                "🥚 Vegetable omelette (light, high protein)"
            ],
            avoid: [
                "🍝 Pasta (high carbs before bed = fat storage)",
                "🍕 Pizza (high calorie, high fat)",
                "🍚 Large portions of rice or bread",
                "🍔 Burgers (high calorie density)",
                "🍷 Alcohol (stops fat burning for hours)"
            ]
        },
        energy: {
            eat:   [
                "🍗 Grilled chicken + sweet potato + greens",
                "🐟 Salmon + quinoa + roasted vegetables",
                "🥩 Lean steak + salad + small portion of rice",
                "🫘 Bean stew with vegetables",
                "🥚 Frittata with vegetables and cheese"
            ],
            avoid: [
                "🍝 Heavy pasta (sluggish next morning)",
                "🍷 Alcohol (disrupts sleep and next day energy)",
                "🍔 Fast food (poor recovery nutrition)",
                "🍟 Fried foods",
                "🍕 Pizza (too heavy for evening)"
            ]
        },
        sleep: {
            eat:   [
                "🦃 Turkey + sweet potato (tryptophan + complex carbs = melatonin boost)",
                "🐟 Salmon + brown rice (omega 3 improves sleep quality)",
                "🥛 Warm milk based dish (tryptophan rich)",
                "🍗 Chicken + vegetables + small portion of rice",
                "🫘 Chickpea curry (light, tryptophan rich)"
            ],
            avoid: [
                "🍷 Alcohol (suppresses REM sleep)",
                "☕ Any caffeine",
                "🌶️ Spicy foods (raises core temp, delays sleep)",
                "🍔 High fat meals (slow digestion disrupts sleep)",
                "🍫 Chocolate (contains caffeine + sugar)"
            ]
        },
        muscle: {
            eat:   [
                "🥩 Lean steak + sweet potato + broccoli (complete muscle meal)",
                "🍗 Chicken thigh + rice + salad (protein + carbs for recovery)",
                "🐟 Salmon + quinoa + asparagus (omega 3 reduces muscle soreness)",
                "🥚 Whole egg omelette + sweet potato",
                "🫘 High protein bean bowl with lean meat"
            ],
            avoid: [
                "🍷 Alcohol (blocks muscle protein synthesis)",
                "🍟 Fried foods (inflammation slows recovery)",
                "🍕 Pizza (poor macro split)",
                "🍔 Fast food (processed, inflammatory)",
                "🍝 Heavy cream pasta (too much fat, insufficient protein)"
            ]
        }
    },
    stop: {
        lose: {
            eat:   [
                "💧 Water or herbal tea only",
                "🍵 Chamomile tea (calming, zero calories)",
                "🫖 Peppermint tea (suppresses appetite)",
                "💧 Sparkling water if hungry"
            ],
            avoid: [
                "🍫 Any snacks (breaks fat burning window)",
                "🍷 Alcohol (stops fat burning entirely)",
                "🧃 Any juice or sugary drinks",
                "🍪 Biscuits or chocolate",
                "🥜 Even healthy snacks — stay strong!"
            ]
        },
        energy: {
            eat:   [
                "💧 Water or herbal tea",
                "🍵 Chamomile or valerian tea (promotes sleep)",
                "🫖 Peppermint tea"
            ],
            avoid: [
                "☕ Caffeine in any form",
                "🍫 Chocolate (stimulating)",
                "🍷 Alcohol (disrupts sleep quality)",
                "🧃 Sugary drinks (blood sugar spike before bed)",
                "🍪 Any heavy snacks"
            ]
        },
        sleep: {
            eat:   [
                "🍵 Chamomile tea (proven sleep aid)",
                "🫖 Valerian root tea (reduces sleep latency)",
                "💧 Water — stay hydrated",
                "🍵 Passionflower tea (reduces anxiety before sleep)"
            ],
            avoid: [
                "☕ Any caffeine — even decaf has some",
                "🍷 Alcohol (fragments deep sleep)",
                "🍫 Chocolate (caffeine + sugar)",
                "🌶️ Spicy foods (raises core temperature)",
                "🍔 Any heavy foods (active digestion = poor sleep)"
            ]
        },
        muscle: {
            eat:   [
                "💧 Water to stay hydrated for overnight recovery",
                "🍵 Herbal tea",
                "🫖 Tart cherry juice (reduces muscle soreness — take earlier)"
            ],
            avoid: [
                "🍷 Alcohol (blocks growth hormone and muscle synthesis)",
                "☕ Caffeine (disrupts sleep = disrupts muscle recovery)",
                "🍔 Heavy meals (digestion competes with recovery)",
                "🍫 Chocolate",
                "🧃 Sugary drinks"
            ]
        }
    },
    preWorkoutMeal: {
        lose: {
            eat:   [
                "🌾 Oats + banana (slow release energy without excess calories)",
                "🍗 Chicken + sweet potato (lean protein + complex carbs)",
                "🥛 Greek yogurt + granola (protein + carbs)",
                "🍳 Eggs on whole grain toast",
                "🥙 Turkey wrap (lean protein + carbs)"
            ],
            avoid: [
                "🍔 Heavy high fat meals (slows you down)",
                "🍝 Creamy pasta (too heavy for training)",
                "🍟 Fried foods (poor performance fuel)",
                "🍷 Alcohol",
                "🧁 Sugary baked goods (energy crash mid workout)"
            ]
        },
        energy: {
            eat:   [
                "🌾 Oats with berries and honey (optimal glycogen loading)",
                "🍗 Chicken + rice (classic pre workout meal)",
                "🥛 Greek yogurt + granola + banana",
                "🥙 Whole grain wrap with lean protein",
                "🍳 Eggs + whole grain toast + fruit"
            ],
            avoid: [
                "🍔 Heavy burgers (digestive burden during exercise)",
                "🍝 Heavy pasta (too much fat slows absorption)",
                "🍟 Fried foods (poor exercise fuel)",
                "🥑 Too much fat (slows gastric emptying)",
                "🍷 Alcohol"
            ]
        },
        sleep: {
            eat:   [
                "🌾 Oats + banana (won't disrupt evening sleep)",
                "🍗 Chicken + rice (easily digestible)",
                "🥛 Greek yogurt + granola",
                "🥙 Light wrap with lean protein",
                "🍳 Eggs on toast"
            ],
            avoid: [
                "🌶️ Spicy foods (raises body temperature)",
                "🍝 Heavy creamy meals (slow digestion)",
                "🍟 Fried foods",
                "🍷 Alcohol",
                "☕ High caffeine pre workout supplements late in day"
            ]
        },
        muscle: {
            eat:   [
                "🌾 Oats + whey protein + banana (glycogen + protein)",
                "🍗 Chicken breast + white rice + broccoli",
                "🥛 Greek yogurt + granola + protein shake",
                "🥩 Lean steak + sweet potato (creatine naturally in beef)",
                "🍳 4-5 eggs + whole grain toast + fruit"
            ],
            avoid: [
                "🥗 Salad only (insufficient fuel for heavy training)",
                "🍔 Fast food (inflammatory, poor performance)",
                "🍟 Fried foods",
                "🍷 Alcohol",
                "🧁 Sugary foods only (no protein = muscle breakdown)"
            ]
        }
    },
    preWorkoutSnack: {
        lose: {
            eat:   [
                "🍌 Banana (fast carbs, easy to digest)",
                "🍚 Rice cakes with honey (quick fuel)",
                "🧃 Small fruit smoothie",
                "🍇 Handful of grapes or dates",
                "🥛 Small glass of chocolate milk"
            ],
            avoid: [
                "🥑 Avocado (too much fat slows you down)",
                "🌰 Nuts (too much fat for immediate energy)",
                "🧀 Cheese (slow digesting fat + protein)",
                "🍔 Any heavy food",
                "🍟 Fried food"
            ]
        },
        energy: {
            eat:   [
                "🍌 Banana (optimal pre workout carb source)",
                "🍚 Rice cakes with honey or jam",
                "🧃 Fresh fruit juice or smoothie",
                "🍇 Dates (fast energy, easy to digest)",
                "🌾 Small bowl of oats"
            ],
            avoid: [
                "🥑 High fat foods (slow energy release)",
                "🌰 Nuts (fat slows absorption)",
                "🧀 Dairy heavy foods",
                "🍔 Any solid heavy meal",
                "🍟 Anything fried"
            ]
        },
        sleep: {
            eat:   [
                "🍌 Banana (quick fuel, won't disrupt sleep later)",
                "🍚 Rice cakes",
                "🍇 Small portion of grapes",
                "🧃 Small fruit smoothie",
                "🌾 Small oat snack"
            ],
            avoid: [
                "☕ High caffeine pre workout",
                "🌶️ Spicy snacks",
                "🍫 Dark chocolate (caffeine)",
                "🥤 Energy drinks (will affect sleep)",
                "🍔 Heavy food"
            ]
        },
        muscle: {
            eat:   [
                "🍌 Banana + small protein shake (carbs + protein)",
                "🍚 Rice cakes + peanut butter",
                "🧃 Fruit smoothie + scoop of protein",
                "🍇 Dates + Greek yogurt",
                "🌾 Oats + honey + protein powder"
            ],
            avoid: [
                "🥑 Too much fat (slows protein absorption)",
                "🌰 Large amounts of nuts",
                "🧀 Heavy dairy",
                "🍔 Any large meal",
                "🍟 Fried food"
            ]
        }
    },
    postWorkout: {
        lose: {
            eat:   [
                "🥛 Protein shake + banana (fast recovery, controlled calories)",
                "🍗 Grilled chicken + small portion of rice",
                "🥚 Eggs + whole grain toast",
                "🧀 Cottage cheese + fruit",
                "🥛 Greek yogurt + berries"
            ],
            avoid: [
                "🍔 Fast food (inflammatory, poor recovery)",
                "🍷 Alcohol (blocks fat burning and recovery)",
                "🍟 Fried foods",
                "🍕 Pizza",
                "🍩 Donuts or pastries (poor recovery nutrition)"
            ]
        },
        energy: {
            eat:   [
                "🌾 Oats + protein shake (glycogen + muscle repair)",
                "🍗 Chicken + rice + vegetables (complete recovery meal)",
                "🥛 Chocolate milk (carb:protein ratio is ideal)",
                "🥛 Greek yogurt + granola + banana",
                "🥚 Eggs on whole grain toast + fruit"
            ],
            avoid: [
                "🍷 Alcohol (impairs glycogen resynthesis)",
                "🍔 Fast food (inflammatory)",
                "🍟 Fried foods",
                "🍩 Pastries (poor nutrient density)",
                "🧃 Juice only (no protein for muscle repair)"
            ]
        },
        sleep: {
            eat:   [
                "🍗 Chicken + sweet potato (tryptophan + complex carbs)",
                "🥛 Protein shake + banana",
                "🐟 Salmon + quinoa (omega 3 reduces soreness)",
                "🥚 Eggs + whole grain toast",
                "🧀 Cottage cheese + fruit"
            ],
            avoid: [
                "🍷 Alcohol (worst thing for sleep + recovery combined)",
                "☕ Caffeine",
                "🌶️ Spicy foods",
                "🍔 Heavy fatty meals",
                "🍟 Fried foods"
            ]
        },
        muscle: {
            eat:   [
                "🥛 Whey protein shake + banana (fastest muscle synthesis)",
                "🍗 Chicken breast + white rice (fast digesting carbs + protein)",
                "🥛 Chocolate milk (scientifically proven recovery drink)",
                "🥚 4-5 eggs + white rice",
                "🥩 Lean beef + potato (creatine + carbs)"
            ],
            avoid: [
                "🍷 Alcohol (directly blocks muscle protein synthesis)",
                "🍔 Fast food (inflammatory, poor amino acid profile)",
                "🍟 Fried foods (inflammation)",
                "🍩 Pastries (no muscle building nutrition)",
                "🧃 Juice only (insufficient protein)"
            ]
        }
    },
    preSleep: {
        lose: {
            eat:   [
                "🧀 Cottage cheese (slow casein protein, very low calorie)",
                "🥛 Small Greek yogurt plain (protein without excess calories)",
                "🥛 Casein protein shake (pure protein, minimal calories)",
                "🥚 2 hard boiled egg whites",
                "🫙 Small quark portion"
            ],
            avoid: [
                "🌾 Oats or carb heavy foods (unnecessary calories before sleep)",
                "🍫 Chocolate (caffeine + sugar)",
                "🍪 Biscuits",
                "🍷 Alcohol",
                "🍔 Any heavy meal"
            ]
        },
        energy: {
            eat:   [
                "🧀 Cottage cheese + small portion of fruit",
                "🥛 Greek yogurt with honey",
                "🥛 Casein protein shake",
                "🌰 Small handful of almonds + Greek yogurt",
                "🥛 Warm milk with cinnamon"
            ],
            avoid: [
                "☕ Caffeine",
                "🍫 Dark chocolate",
                "🍷 Alcohol",
                "🍔 Heavy meals",
                "🍪 Sugary snacks (blood sugar spike disrupts sleep)"
            ]
        },
        sleep: {
            eat:   [
                "🧀 Cottage cheese + tart cherry juice (casein + natural melatonin)",
                "🥛 Warm milk + honey (tryptophan + insulin response aids sleep)",
                "🌰 Walnuts + small Greek yogurt (melatonin + protein)",
                "🥛 Casein shake + chamomile tea",
                "🍌 Small banana + Greek yogurt (magnesium + tryptophan)"
            ],
            avoid: [
                "☕ Any caffeine",
                "🍷 Alcohol (suppresses REM sleep)",
                "🍫 Chocolate",
                "🌶️ Spicy foods",
                "🍔 Heavy meals (digestion competes with sleep)"
            ]
        },
        muscle: {
            eat:   [
                "🧀 Cottage cheese (best pre-sleep muscle food — slow casein)",
                "🥛 Casein protein shake (feeds muscles for 6-8 hours)",
                "🥛 Greek yogurt + small portion of oats",
                "🌰 Almonds + casein shake (healthy fats + slow protein)",
                "🫙 Quark with berries (European cottage cheese, high casein)"
            ],
            avoid: [
                "🍷 Alcohol (growth hormone suppression = no muscle growth overnight)",
                "🌾 Whey protein (too fast digesting for overnight use)",
                "🍫 Chocolate",
                "☕ Caffeine",
                "🍔 Heavy fatty meals (poor digestion during sleep)"
            ]
        }
    }
};

function getFoodSuggestions(mealKey, goal){
    const key = mealKey
        .replace("🌅 ", "").replace("🍿 ", "").replace("☀️ ", "")
        .replace("🌄 ", "").replace("🎑 ", "").replace("🍽️ ", "")
        .replace("⚡ ", "").replace("💪 ", "").replace("🌙 ", "")
        .toLowerCase()
        .replace("breakfast", "breakfast")
        .replace("snack", "snack")
        .replace("lunch", "lunch")
        .replace("dinner", "dinner")
        .replace("stop eating", "stop")
        .replace("pre-workout meal", "preWorkoutMeal")
        .replace("pre-workout snack", "preWorkoutSnack")
        .replace("post workout", "postWorkout")
        .replace("pre sleep", "preSleep");

    const suggestions = foodSuggestions[key]?.[goal];
    if (!suggestions) return "";

    const eatList  = suggestions.eat.map(f  => `<li class="food-eat">✓ ${f}</li>`).join("");
    const avoidList = suggestions.avoid.map(f => `<li class="food-avoid">✗ ${f}</li>`).join("");

    return `
        <div class="food-suggestions">
            <div class="food-section-title">💡 What to eat:</div>
            <ul class="food-list">${eatList}</ul>
            <div class="food-section-title avoid-title">⚠️ Avoid:</div>
            <ul class="food-list">${avoidList}</ul>
        </div>
    `;
}

function getDescription(meal, goal){
    const descriptions = {
        breakfast: {
            lose:   "Eat within 30 mins of waking. Keep it protein heavy to stay full longer. Eggs, Greek yogurt, or a protein shake. A strong breakfast reduces cravings all day.",
            energy: "Eat within 30 mins of waking. Focus on complex carbs + protein. Oats, eggs, whole grain toast. Biggest meal — boosts metabolism and resets your circadian clock.",
            sleep:  "Eat within 30 mins of waking. A good breakfast regulates your body clock which directly improves sleep quality at night. Don't skip this one.",
            muscle: "Eat within 30 mins of waking. High protein + carbs to kickstart muscle protein synthesis. Eggs, oats, protein shake. Your muscles have been fasting all night."
        },
        snack: {
            lose:   "Keep it very small and protein focused. Greek yogurt or a handful of nuts. Prevents blood sugar crashes that lead to overeating at lunch.",
            energy: "Strategic snack to maintain energy. Fruits, nuts, or yogurt. Avoids the mid-morning energy dip and keeps focus sharp.",
            sleep:  "Light snack only. Fruits or nuts. Keeping blood sugar stable during the day leads to better melatonin production at night.",
            muscle: "Protein focused snack. Greek yogurt, cottage cheese, or protein bar. Keeps muscle protein synthesis elevated between meals."
        },
        lunch: {
            lose:   "Your second largest meal. High protein, moderate carbs. Lean meat, salad, vegetables. Insulin sensitivity is good at midday — better time for carbs than evening.",
            energy: "Balanced macros — protein, carbs and healthy fats. Good time for your second largest meal. Energy levels are optimal mid-day.",
            sleep:  "Balanced meal at midday. Avoid heavy, greasy foods which can disrupt your circadian rhythm. Lean proteins and complex carbs work best.",
            muscle: "High protein + carbs. Chicken, rice, vegetables. This is a key muscle building meal — don't skip it or eat light here."
        },
        dinner: {
            lose:   "Light and early is key for weight loss. Low carb, high protein — grilled fish, chicken, or tofu with vegetables. No heavy carbs. Earlier dinner = better fat burning overnight.",
            energy: "Keep it light and low carb. Focus on protein and vegetables. Heavy meals late disrupt sleep quality and fat metabolism.",
            sleep:  "Most important meal for sleep quality. Eat early and light. Tryptophan-rich foods help: turkey, chicken, dairy. Avoid alcohol and heavy fats which fragment sleep.",
            muscle: "Moderate protein + carbs. This is your last real muscle building meal. Chicken, sweet potato, vegetables. Don't eat too late or it disrupts overnight recovery."
        },
        stop: {
            lose:   "Hard cutoff for weight loss. Your body switches to fat burning mode during the overnight fast. Every hour you push past this delays fat burning.",
            energy: "Your body needs 2-3 hrs to digest before sleep. Eating after this raises blood glucose overnight and disrupts melatonin.",
            sleep:  "Critical for sleep quality. Eating after this delays sleep onset, reduces deep sleep, and disrupts melatonin. This boundary matters more than any other for sleep.",
            muscle: "Stop eating heavy meals here. Light casein protein is okay but heavy meals disrupt growth hormone release which peaks during deep sleep."
        }
    };

    return descriptions[meal]?.[goal] || descriptions[meal]?.energy || "";
}

document.getElementById("lightMode")
    .addEventListener("change", function(){
        localStorage.setItem("lightMode", this.checked);
        applyTheme();
    });

// ---- INIT ----
applyTheme(); // ← add this

if (localStorage.getItem("wakeupTime") && localStorage.getItem("sleepTime")){
    showApp();
    calculate();
} else {
    document.getElementById("firstTime").style.display = "block";
    document.getElementById("mainApp").style.display = "none";
}