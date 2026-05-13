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

// ---- ONBOARDING ----
document.getElementById("getStartedButton")
    .addEventListener("click", function(){
        const wake = document.getElementById("wakeupTimeFirst").value;
        const sleep = document.getElementById("sleepTimeFirst").value;
        if (!wake || !sleep){
            alert("Please enter your wake and sleep times!");
            return;
        }
        localStorage.setItem("wakeupTime", wake);
        localStorage.setItem("sleepTime", sleep);
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

    localStorage.setItem("wakeupTime", wake);
    localStorage.setItem("sleepTime", sleep);
    localStorage.setItem("exerciseTime", document.getElementById("exerciseTime").value);
    localStorage.setItem("timeFormat", document.getElementById("timeFormat").checked);
    localStorage.setItem("exerciseToggle", document.getElementById("exerciseToggle").checked);

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
    if (!wakeupTime || !sleepTime) return;

    const wakeMinutes = timeToMinutes(wakeupTime);
    let sleepMinutes  = timeToMinutes(sleepTime);
    if (sleepMinutes < wakeMinutes) sleepMinutes += MINUTESADAY;

    const tdeeData = calculateTDEE();
    const tdee = tdeeData ? tdeeData.target : null;

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
        {label: "🌅 Breakfast", sortTime: wakeMinutes + 30, type: "Largest meal • High carbs + protein", description: "Eat within 30 mins of waking. Focus on complex carbs + protein. Oats, eggs, whole grain toast. Biggest meal — boosts metabolism and resets your circadian clock.", calories: cal.breakfast, macros: {carbs: 0.50, protein: 0.30, fat: 0.20}},
        {label: "🍿 Snack", sortTime: wakeMinutes + HOURS * 3, type: "Small • Fruits, nuts or yogurt", description: "Keep it small. Fruits, nuts, or Greek yogurt. Maintains blood sugar between meals and prevents overeating at lunch.", calories: cal.snack, macros: {carbs: 0.40, protein: 0.40, fat: 0.20}},
        {label: "☀️ Lunch", sortTime: wakeMinutes + HOURS * 5, type: "Moderate • Balanced macros", description: "Balanced macros — protein, carbs and healthy fats. Good time for your second largest meal. Energy levels are optimal mid-day.", calories: cal.lunch, macros: {carbs: 0.40, protein: 0.30, fat: 0.30}},
        {label: "🌄 Dinner", sortTime: sleepMinutes - HOURS * 3, type: "Small • Low carb, high protein", description: "Keep it light and low carb. Focus on protein and vegetables. Heavy meals late disrupt sleep quality and fat metabolism.", calories: cal.dinner, macros: {carbs: 0.20, protein: 0.50, fat: 0.30}},
        {label: "🎑 Stop Eating", sortTime: sleepMinutes - HOURS * 2, type: "⚠️ No food after this", description: "Your body needs 2-3 hrs to digest before sleep. Eating after this raises blood glucose overnight and disrupts melatonin.", calories: null, macros: null},
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

        const details = document.createElement("div");
        details.className = "schedule-details";
        details.innerHTML = `<p>${meal.description}</p>${macroHTML}`;

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

// ---- INIT ----
if (localStorage.getItem("wakeupTime") && localStorage.getItem("sleepTime")){
    showApp();
    calculate();
} else {
    document.getElementById("firstTime").style.display = "block";
    document.getElementById("mainApp").style.display = "none";
}