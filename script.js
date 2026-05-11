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

function calculate() {
    // Read values at click time, not page load
    const inputElementWakeUpTime = document.getElementById("wakeupTime").value;
    const inputElementSleepTime = document.getElementById("sleepTime").value;
    const inputElementExerciseTime = document.getElementById("exerciseTime").value;

    const validWakeUpTime = validateInputs(inputElementWakeUpTime);
    const validSleepTime = validateInputs(inputElementSleepTime);
    const validExerciseTime = validateInputs(inputElementExerciseTime);

    if (!validWakeUpTime || !validSleepTime){
        results.innerHTML = "<p class='error'>Please enter wake & sleep times!</p>"
        return;
    }
    const wakeMinutes = timeToMinutes(inputElementWakeUpTime);
    let sleepMinutes = timeToMinutes(inputElementSleepTime);

    // If sleep is before wake, assume next day
    if (sleepMinutes < wakeMinutes){
        sleepMinutes += MINUTESADAY;
    }

    const meals = [
        {label: "🌅 Breakfast", sortTime: wakeMinutes + 30, type: "Largest meal • High carbs + protein", description: "Eat within 30 mins of waking. Focus on complex carbs + protein. Oats, eggs, whole grain toast. Biggest meal — boosts metabolism and resets your circadian clock."},
        {label: "🍿 Snack", sortTime: wakeMinutes + HOURS * 3, type: "Small • Fruits, nuts or yogurt", description: "Keep it small. Fruits, nuts, or Greek yogurt. Maintains blood sugar between meals and prevents overeating at lunch."},
        {label: "☀️ Lunch", sortTime: wakeMinutes + HOURS * 5, type: "Moderate • Balanced macros", description: "Balanced macros — protein, carbs and healthy fats. Good time for your second largest meal. Energy levels are optimal mid-day."},
        {label: "🌄 Dinner", sortTime: sleepMinutes - HOURS * 3, type: "Small • Low carb, high protein", description: "Keep it light and low carb. Focus on protein and vegetables. Heavy meals late disrupt sleep quality and fat metabolism."},
        {label: "🎑 Stop Eating", sortTime: sleepMinutes - HOURS * 2, type: "⚠️ No food after this", description: "Your body needs 2-3 hrs to digest before sleep. Eating after this raises blood glucose overnight and disrupts melatonin."},
    ];

    if (validExerciseTime){
        const exerciseMinutes = timeToMinutes(inputElementExerciseTime);
        meals.push(
            {label: "🍽️ Pre-workout meal", sortTime: exerciseMinutes - HOURS * 3, type: "High carbs + moderate protein", description: "Eat 2-3 hrs before. High complex carbs + moderate protein. Maximises glycogen stores for performance."},
            {label: "⚡ Pre-workout snack", sortTime: exerciseMinutes - HOURS * 0.75, type: "Quick carbs • Banana, rice cakes", description: "45 mins before. Quick carbs only — banana, rice cakes, energy gel. Easy to digest, fast energy."},
            {label: "💪 Post workout", sortTime: exerciseMinutes + HOURS / 2, type: "Carbs + protein within 30 mins", description: "Most critical window. Carbs + protein within 30 mins. Repairs muscle and replenishes glycogen fast."},
            {label: "🌙 Pre sleep", sortTime: sleepMinutes - HOURS / 2, type: "Casein only • Greek yogurt, cottage cheese", description: "Casein protein only — Greek yogurt or cottage cheese. Slow digesting, feeds muscles overnight without spiking blood sugar."},
        );
    }
    meals.sort((a, b) => a.sortTime - b.sortTime);

    results.innerHTML = "";
    meals.forEach(meal => createMealCard(meal.label, minutesToTime(meal.sortTime), meal.type, meal.description));

    saveTimes("wakeupTime", inputElementWakeUpTime);
    saveTimes("sleepTime", inputElementSleepTime);
    saveTimes("exerciseTime", inputElementExerciseTime);
}

function validateInputs(timeInput){
    return timeInput !== "";
}

function createMealCard(label, time, mealType, description){
    results.innerHTML += `<div class="meal-card">
        <span class="meal-label">${label}</span>
        <span class="meal-time">${time}</span>
        <span class="meal-type">${mealType}</span>
        <div class="meal-description">${description}</div>
    </div>`;
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
    // Read checkbox at format time, not page load
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
    localStorage.setItem(`${inputId}`, `${inputTime}`);
    localStorage.setItem("timeFormat", document.getElementById("timeFormat").checked);
    localStorage.setItem("exerciseToggle", document.getElementById("exerciseToggle").checked);
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
    // load checkbox states
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

if (localStorage.length > 0){
   loadTimes("wakeupTime");
   loadTimes("sleepTime");
   loadTimes("exerciseTime");
}

document.getElementById("calculateButton").addEventListener("click", calculate)