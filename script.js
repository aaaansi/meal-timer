const HOURS = 60;
const MINUTESADAY = 1440;
const results = document.getElementById("results");

document.getElementById("exerciseToggle")
    .addEventListener("change", function(){
        const container = document.getElementById("exerciseTimeContainer");
        if (this.checked){
            container.style.display = "block";
        } else {
            container.style.display = "none";
            document.getElementById("exerciseTime").value = "";
            localStorage.removeItem("exerciseTime");
        }
    });

results.addEventListener("click", function(e){
    const card = e.target.closest(".meal-card");
    if (card) card.classList.toggle("expanded");
});

document.addEventListener("click", function(e){
    const card = e.target.closest(".collapsible");
    if (card) card.classList.toggle("expanded");
});

document.getElementById("profileToggle")
    .addEventListener("change", function(){
        const container = document.getElementById("profileContainer");
        if (this.checked){
            container.style.display = "block";
        } else {
            container.style.display = "none";
        }
    });

function calculate() {
    const inputElementWakeUpTime = document.getElementById("wakeupTime").value;
    const inputElementSleepTime = document.getElementById("sleepTime").value;
    const inputElementExerciseTime = document.getElementById("exerciseTime").value;

    const validWakeUpTime = validateInputs(inputElementWakeUpTime);
    const validSleepTime = validateInputs(inputElementSleepTime);
    const validExerciseTime = validateInputs(inputElementExerciseTime);

    if (!validWakeUpTime || !validSleepTime){
        results.innerHTML = "<p class='error'>Please enter wake & sleep times!</p>";
        return;
    }

    const wakeMinutes = timeToMinutes(inputElementWakeUpTime);
    let sleepMinutes = timeToMinutes(inputElementSleepTime);
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

    const fastingData = calculateFastingWindow(wakeMinutes, sleepMinutes - HOURS * 2);
    renderSummary(tdeeData, fastingData);

    const meals = [
        {label: "🌅 Breakfast", sortTime: wakeMinutes + 30, type: "Largest meal • High carbs + protein", description: "Eat within 30 mins of waking. Focus on complex carbs + protein. Oats, eggs, whole grain toast. Biggest meal — boosts metabolism and resets your circadian clock.", calories: cal.breakfast},
        {label: "🍿 Snack", sortTime: wakeMinutes + HOURS * 3, type: "Small • Fruits, nuts or yogurt", description: "Keep it small. Fruits, nuts, or Greek yogurt. Maintains blood sugar between meals and prevents overeating at lunch.", calories: cal.snack},
        {label: "☀️ Lunch", sortTime: wakeMinutes + HOURS * 5, type: "Moderate • Balanced macros", description: "Balanced macros — protein, carbs and healthy fats. Good time for your second largest meal. Energy levels are optimal mid-day.", calories: cal.lunch},
        {label: "🌄 Dinner", sortTime: sleepMinutes - HOURS * 3, type: "Small • Low carb, high protein", description: "Keep it light and low carb. Focus on protein and vegetables. Heavy meals late disrupt sleep quality and fat metabolism.", calories: cal.dinner},
        {label: "🎑 Stop Eating", sortTime: sleepMinutes - HOURS * 2, type: "⚠️ No food after this", description: "Your body needs 2-3 hrs to digest before sleep. Eating after this raises blood glucose overnight and disrupts melatonin.", calories: null},
    ];

    if (validExerciseTime){
        const exerciseMinutes = timeToMinutes(inputElementExerciseTime);
        meals.push(
            {label: "🍽️ Pre-workout meal", sortTime: exerciseMinutes - HOURS * 3, type: "High carbs + moderate protein", description: "Eat 2-3 hrs before. High complex carbs + moderate protein. Maximises glycogen stores for performance.", calories: cal.preWorkoutMeal},
            {label: "⚡ Pre-workout snack", sortTime: exerciseMinutes - HOURS * 0.75, type: "Quick carbs • Banana, rice cakes", description: "45 mins before. Quick carbs only — banana, rice cakes, energy gel. Easy to digest, fast energy.", calories: cal.preWorkoutSnack},
            {label: "💪 Post workout", sortTime: exerciseMinutes + HOURS / 2, type: "Carbs + protein within 30 mins", description: "Most critical window. Carbs + protein within 30 mins. Repairs muscle and replenishes glycogen fast.", calories: cal.postWorkout},
            {label: "🌙 Pre sleep", sortTime: sleepMinutes - HOURS / 2, type: "Casein only • Greek yogurt, cottage cheese", description: "Casein protein only — Greek yogurt or cottage cheese. Slow digesting, feeds muscles overnight without spiking blood sugar.", calories: cal.preSleep},
        );
    }

    meals.sort((a, b) => a.sortTime - b.sortTime);
    results.innerHTML = "";
    meals.forEach(meal => createMealCard(meal.label, minutesToTime(meal.sortTime), meal.type, meal.description, meal.calories));

    saveTimes("wakeupTime", inputElementWakeUpTime);
    saveTimes("sleepTime", inputElementSleepTime);
    saveTimes("exerciseTime", inputElementExerciseTime);
    saveProfile();
}

function validateInputs(timeInput){
    return timeInput !== "";
}

function createMealCard(label, time, mealType, description, calories){
    const calDisplay = calories ? `<span class="meal-calories">${calories} kcal</span>` : "";
    results.innerHTML += `<div class="meal-card">
        <span class="meal-label">${label}</span>
        <span class="meal-time">${time}</span>
        <span class="meal-type">${mealType}</span>
        ${calDisplay}
        <div class="meal-description">${description}</div>
    </div>`;
}

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
                    <span class="summary-value highlight">${tdeeData.target} kcal daily target</span>
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
                <span class="summary-value highlight">${fastingData.protocol} Intermittent Fast</span>
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

function calculateTDEE(){
    const age = parseInt(document.getElementById("age").value);
    const weight = parseFloat(document.getElementById("weight").value);
    const height = parseFloat(document.getElementById("height").value);
    const sex = document.getElementById("sex").value;
    const goal = document.getElementById("goal").value;
    const activity = parseFloat(document.getElementById("activity").value);
    const extraCalories = parseInt(document.getElementById("extraCalories").value) || 0;

    if (!age || !weight || !height) return null;

    let bmr;
    if (sex === "male"){
        bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else {
        bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    }

    const tdee = Math.round(bmr * activity);
    const netTDEE = tdee + extraCalories;
    const maintenance = netTDEE;

    let target = netTDEE;
    if (goal === "lose") target -= 500;
    if (goal === "gain") target += 300;

    return {
        bmr:         Math.round(bmr),
        tdee:        tdee,
        extraBurn:   extraCalories,
        maintenance: maintenance,
        target:      target,
        goal:        goal
    };
}

function calculateFastingWindow(wakeMinutes, stopEatingMinutes){
    const breakfastTime = wakeMinutes + 30;
    const eatingWindow = stopEatingMinutes - breakfastTime;
    const fastingWindow = MINUTESADAY - eatingWindow;
    const eatingHrs = Math.floor(eatingWindow / HOURS);
    const fastingHrs = Math.floor(fastingWindow / HOURS);
    return {
        eatingHrs,
        fastingHrs,
        protocol: `${fastingHrs}:${eatingHrs}`
    };
}

function timeToMinutes(timeString){
    const timeArray = timeString.split(':');
    return parseInt(timeArray[0]) * HOURS + parseInt(timeArray[1]);
}

function minutesToTime(minutes){
    minutes = minutes < 0 ? minutes + MINUTESADAY : minutes;
    minutes = minutes % MINUTESADAY;
    const hours = String(Math.floor(minutes / HOURS)).padStart(2, '0');
    const mins = String(minutes % HOURS).padStart(2, '0');
    return formatTime(hours, mins);
}

function formatTime(hours, minutes){
    const is12Hour = document.getElementById("timeFormat").checked;
    const h = parseInt(hours);
    if (is12Hour){
        const ampm = h >= 12 ? "PM" : "AM";
        const h12 = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    }
    return `${hours}:${minutes}`;
}

function saveTimes(inputId, inputTime){
    localStorage.setItem(inputId, inputTime);
    localStorage.setItem("timeFormat", document.getElementById("timeFormat").checked);
    localStorage.setItem("exerciseToggle", document.getElementById("exerciseToggle").checked);
}

function saveProfile(){
    localStorage.setItem("profileToggle", document.getElementById("profileToggle").checked);
    localStorage.setItem("age", document.getElementById("age").value);
    localStorage.setItem("weight", document.getElementById("weight").value);
    localStorage.setItem("height", document.getElementById("height").value);
    localStorage.setItem("sex", document.getElementById("sex").value);
    localStorage.setItem("goal", document.getElementById("goal").value);
    localStorage.setItem("activity", document.getElementById("activity").value);
    localStorage.setItem("extraCalories", document.getElementById("extraCalories").value);
}

function loadProfile(){
    const savedProfile = localStorage.getItem("profileToggle");
    if (savedProfile === "true"){
        document.getElementById("profileToggle").checked = true;
        document.getElementById("profileContainer").style.display = "block";
    }
    const fields = ["age", "weight", "height", "sex", "goal", "activity", "extraCalories"];
    fields.forEach(field => {
        const saved = localStorage.getItem(field);
        if (saved) document.getElementById(field).value = saved;
    });
}

function loadTimes(inputId){
    const input = localStorage.getItem(inputId);
    if (input){
        document.getElementById(inputId).value = input;
        if (inputId === "exerciseTime"){
            document.getElementById("exerciseToggle").checked = true;
            document.getElementById("exerciseTimeContainer").style.display = "block";
        }
    }
    const savedFormat = localStorage.getItem("timeFormat");
    if (savedFormat !== null){
        document.getElementById("timeFormat").checked = savedFormat === "true";
    }
    const savedExercise = localStorage.getItem("exerciseToggle");
    if (savedExercise === "true"){
        document.getElementById("exerciseToggle").checked = true;
        document.getElementById("exerciseTimeContainer").style.display = "block";
    }
}

function loadProfile(){
    const fields = ["age", "weight", "height", "sex", "goal", "activity", "extraCalories"];
    fields.forEach(field => {
        const saved = localStorage.getItem(field);
        if (saved) document.getElementById(field).value = saved;
    });
}

if (localStorage.length > 0){
    loadTimes("wakeupTime");
    loadTimes("sleepTime");
    loadTimes("exerciseTime");
    loadProfile();
}

document.getElementById("calculateButton").addEventListener("click", calculate);