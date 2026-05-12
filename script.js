const HOURS = 60;
const MINUTESADAY = 1440;

// ---- VIEW MANAGEMENT ----
function showView(viewId){
    document.getElementById("dashboard").style.display = "none";
    document.getElementById("settings").style.display = "none";
    document.getElementById("firstTime").style.display = "none";
    document.getElementById(viewId).style.display = "block";
}

// ---- EVENT LISTENERS ----
document.getElementById("settingsButton")
    .addEventListener("click", function(){
        syncSettingsFromStorage();
        showView("settings");
    });

document.getElementById("backButton")
    .addEventListener("click", function(){
        showView("dashboard");
        calculate();
    });

document.getElementById("saveButton")
    .addEventListener("click", function(){
        saveFromSettings();
        showView("dashboard");
        calculate();
    });

document.getElementById("getStartedButton")
    .addEventListener("click", function(){
        if (!saveFromFirstTime()) return;
        showView("dashboard");
        calculate();
    });

document.getElementById("exerciseToggle")
    .addEventListener("change", function(){
        document.getElementById("exerciseTimeContainer").style.display =
            this.checked ? "block" : "none";
        if (!this.checked){
            document.getElementById("exerciseTime").value = "";
            localStorage.removeItem("exerciseTime");
        }
    });

document.addEventListener("click", function(e){
    const collapsible = e.target.closest(".collapsible");
    if (collapsible){
        collapsible.classList.toggle("expanded");
    } else {
        const scheduleItem = e.target.closest(".schedule-item");
        if (scheduleItem) scheduleItem.classList.toggle("expanded");
    }
});

document.getElementById("appTitle")
    .addEventListener("click", function(){
        // pre-fill onboarding inputs with saved values
        const wake = localStorage.getItem("wakeupTime");
        const sleep = localStorage.getItem("sleepTime");
        if (wake) document.getElementById("wakeupTimeFirst").value = wake;
        if (sleep) document.getElementById("sleepTimeFirst").value = sleep;
        showView("firstTime");
    });

// ---- SAVE / LOAD ----
function saveFromFirstTime(){
    const wake = document.getElementById("wakeupTimeFirst").value;
    const sleep = document.getElementById("sleepTimeFirst").value;
    if (!wake || !sleep){
        alert("Please enter your wake and sleep times!");
        return false;
    }
    localStorage.setItem("wakeupTime", wake);
    localStorage.setItem("sleepTime", sleep);
    return true;
}

function saveFromSettings(){
    const wake = document.getElementById("wakeupTime").value;
    const sleep = document.getElementById("sleepTime").value;
    if (!wake || !sleep) return;
    localStorage.setItem("wakeupTime", wake);
    localStorage.setItem("sleepTime", sleep);
    localStorage.setItem("exerciseTime", document.getElementById("exerciseTime").value);
    localStorage.setItem("timeFormat", document.getElementById("timeFormat").checked);
    localStorage.setItem("exerciseToggle", document.getElementById("exerciseToggle").checked);
    localStorage.setItem("profileToggle", document.getElementById("profileToggle").checked);
    localStorage.setItem("age", document.getElementById("age").value);
    localStorage.setItem("weight", document.getElementById("weight").value);
    localStorage.setItem("height", document.getElementById("height").value);
    localStorage.setItem("sex", document.getElementById("sex").value);
    localStorage.setItem("goal", document.getElementById("goal").value);
    localStorage.setItem("activity", document.getElementById("activity").value);
    localStorage.setItem("extraCalories", document.getElementById("extraCalories").value);
}

function syncSettingsFromStorage(){
    const fields = {
        "wakeupTime": "wakeupTime",
        "sleepTime": "sleepTime",
        "exerciseTime": "exerciseTime",
        "age": "age",
        "weight": "weight",
        "height": "height",
        "sex": "sex",
        "goal": "goal",
        "activity": "activity",
        "extraCalories": "extraCalories"
    };
    Object.keys(fields).forEach(id => {
        const saved = localStorage.getItem(fields[id]);
        if (saved) document.getElementById(id).value = saved;
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

// ---- CALCULATE ----
function calculate(){
    const wakeupTime = localStorage.getItem("wakeupTime");
    const sleepTime = localStorage.getItem("sleepTime");
    if (!wakeupTime || !sleepTime) return;

    const wakeMinutes = timeToMinutes(wakeupTime);
    let sleepMinutes = timeToMinutes(sleepTime);
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

    const exerciseTime = localStorage.getItem("exerciseTime");
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

    const fastingData = calculateFastingWindow(wakeMinutes, sleepMinutes - HOURS * 2);
    renderStatus(meals);
    renderSchedule(meals);
    renderSummary(tdeeData, fastingData);
}

// ---- RENDER STATUS ----
function renderStatus(meals){
    const now = new Date();
    const currentMinutes = now.getHours() * HOURS + now.getMinutes();

    let current = null;
    let next = null;

    for (let i = 0; i < meals.length; i++){
        if (meals[i].sortTime <= currentMinutes){
            current = meals[i];
        } else {
            next = meals[i];
            break;
        }
    }
    if (!next) next = meals[0];

    const minutesUntilNext = next
        ? next.sortTime > currentMinutes
            ? next.sortTime - currentMinutes
            : (next.sortTime + MINUTESADAY) - currentMinutes
        : null;

    const hoursUntil = Math.floor(minutesUntilNext / HOURS);
    const minsUntil = minutesUntilNext % HOURS;
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
}

// ---- RENDER SCHEDULE ----
function renderSchedule(meals){
    const now = new Date();
    const currentMinutes = now.getHours() * HOURS + now.getMinutes();
    const scheduleList = document.getElementById("scheduleList");
    scheduleList.innerHTML = "";

    const lastPastMeal = meals.filter(m => m.sortTime <= currentMinutes).slice(-1)[0];

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

        const item = document.createElement("div");
        item.className = className;
        item.innerHTML = `
            <div class="schedule-dot"></div>
            <div class="schedule-time">${minutesToTime(meal.sortTime)}</div>
            <div class="schedule-label">${meal.label}</div>
            <div class="schedule-calories">${calorieText}</div>
        `;

        const details = document.createElement("div");
        details.className = "schedule-details";
        details.innerHTML = `
            <p>${meal.description}</p>
            ${macroHTML}
        `;

        scheduleList.appendChild(item);
        scheduleList.appendChild(details);
    });
}

// ---- RENDER SUMMARY ----
function renderSummary(tdeeData, fastingData){
    const summary = document.getElementById("summary");
    let html = "";

    if (tdeeData){
        const goalText = {
            lose:     "Lose weight (−500 cal deficit)",
            maintain: "Maintain weight",
            gain:     "Build muscle (+300 cal surplus)"
        };
        const deficitSurplus = tdeeData.target - tdeeData.maintenance;
        const deficitLabel = deficitSurplus < 0
            ? `${deficitSurplus} cal deficit`
            : `+${deficitSurplus} cal surplus`;

        html += `
        <div class="summary-card collapsible">
            <div class="summary-header">
                <div class="summary-title">📊 Calorie Breakdown</div>
                <div class="summary-preview">
                    <span class="summary-value highlight">${tdeeData.target} kcal</span>
                    <span class="collapse-icon">▼</span>
                </div>
            </div>
            <div class="summary-body">
                <div class="summary-row">
                    <span class="summary-label">🔥 BMR (at rest)</span>
                    <span class="summary-value">${tdeeData.bmr} kcal</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">🏃 TDEE (with activity)</span>
                    <span class="summary-value">${tdeeData.tdee} kcal</span>
                </div>
                ${tdeeData.extraBurn > 0 ? `
                <div class="summary-row">
                    <span class="summary-label">⌚ Mi Band extra burn</span>
                    <span class="summary-value green">+${tdeeData.extraBurn} kcal</span>
                </div>` : ""}
                <div class="summary-row">
                    <span class="summary-label">⚖️ Maintenance calories</span>
                    <span class="summary-value">${tdeeData.maintenance} kcal</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">🎯 Goal</span>
                    <span class="summary-value">${goalText[tdeeData.goal]}</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">🍽️ Daily target</span>
                    <span class="summary-value highlight">${tdeeData.target} kcal</span>
                </div>
                <div class="summary-row">
                    <span class="summary-label">📉 Deficit / Surplus</span>
                    <span class="summary-value ${deficitSurplus < 0 ? '' : 'green'}">${deficitLabel}</span>
                </div>
            </div>
        </div>`;
    }

    html += `
    <div class="summary-card collapsible">
        <div class="summary-header">
            <div class="summary-title">⏱️ Fasting Window</div>
            <div class="summary-preview">
                <span class="summary-value highlight">${fastingData.protocol} IF</span>
                <span class="collapse-icon">▼</span>
            </div>
        </div>
        <div class="summary-body">
            <div class="summary-row">
                <span class="summary-label">🍽️ Eating window</span>
                <span class="summary-value">${fastingData.eatingHrs} hours</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">💤 Fasting window</span>
                <span class="summary-value">${fastingData.fastingHrs} hours</span>
            </div>
            <div class="summary-row">
                <span class="summary-label">📋 IF Protocol</span>
                <span class="summary-value highlight">${fastingData.protocol} Intermittent Fast</span>
            </div>
        </div>
    </div>`;

    summary.innerHTML = html;
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
    const activity = parseFloat(localStorage.getItem("activity")) || 1.2;
    const extraCalories = parseInt(localStorage.getItem("extraCalories")) || 0;

    if (!age || !weight || !height) return null;

    let bmr;
    if (sex === "male"){
        bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else {
        bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    }

    const tdee = Math.round(bmr * activity);
    const netTDEE = tdee + extraCalories;
    let target = netTDEE;
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

// ---- FASTING ----
function calculateFastingWindow(wakeMinutes, stopEatingMinutes){
    const breakfastTime = wakeMinutes + 30;
    const eatingWindow  = stopEatingMinutes - breakfastTime;
    const fastingWindow = MINUTESADAY - eatingWindow;
    const eatingHrs  = Math.floor(eatingWindow / HOURS);
    const fastingHrs = Math.floor(fastingWindow / HOURS);
    return { eatingHrs, fastingHrs, protocol: `${fastingHrs}:${eatingHrs}` };
}

// ---- TIME UTILS ----
function timeToMinutes(timeString){
    const timeArray = timeString.split(':');
    return parseInt(timeArray[0]) * HOURS + parseInt(timeArray[1]);
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
    showView("dashboard");
    calculate();
} else {
    showView("firstTime");
}