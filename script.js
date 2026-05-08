const HOURS = 60;
const MINUTESADAY = 1440;
const results = document.getElementById("results");


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
    if (timeToMinutes(inputElementWakeUpTime) > timeToMinutes(inputElementSleepTime)){
        results.innerHTML = "<p class='error'>Sleep time must be after wake time!</p>"
        return;
    }

    const bestTimeToEatBreakfast = minutesToTime(timeToMinutes(inputElementWakeUpTime) + 30);
    const bestTimeToEatSnack = minutesToTime(timeToMinutes(inputElementWakeUpTime) + HOURS * 3);
    const bestTimeToEatLunch = minutesToTime(timeToMinutes(inputElementWakeUpTime) + HOURS * 5);
    const bestTimeToEatDinner = minutesToTime(timeToMinutes(inputElementSleepTime) - HOURS * 3);
    const bestTimeToStopEating = minutesToTime(timeToMinutes(inputElementSleepTime) - HOURS * 2);

    results.innerHTML = "";
    createMealCard("🌅 Breakfast", bestTimeToEatBreakfast, "Heavy meal");
    createMealCard("🍿 Snack", bestTimeToEatSnack, "Light meal");
    createMealCard("☀️ Lunch", bestTimeToEatLunch, "Moderate meal");
    createMealCard("🌄 Dinner", bestTimeToEatDinner, "Light meal");
    createMealCard("🎑 Stop Eating", bestTimeToStopEating, "");

    if (validExerciseTime){
        const bestTimetoEatpreWorkoutSnack = minutesToTime(timeToMinutes(inputElementExerciseTime) - HOURS);
        const bestTimetoEatpreWorkoutMeal = minutesToTime(timeToMinutes(inputElementExerciseTime) - HOURS * 2.5);
        const bestTimetoEatpostWorkout = minutesToTime(timeToMinutes(inputElementExerciseTime) + HOURS / 2);
        const bestTimetoEatpreSleep = minutesToTime(timeToMinutes(inputElementSleepTime) - HOURS / 2);
        createMealCard("⚡ Pre-workout snack", bestTimetoEatpreWorkoutSnack, "Light meal");
        createMealCard("🍽️ Pre-workout meal", bestTimetoEatpreWorkoutMeal, "Heavy meal");
        createMealCard("💪 Post workout", bestTimetoEatpostWorkout, "Recovery meal");
        createMealCard("🌙 Pre sleep", bestTimetoEatpreSleep, "Casein protein");
    }

    saveTimes("wakeupTime", inputElementWakeUpTime);
    saveTimes("sleepTime", inputElementSleepTime);
    saveTimes("exerciseTime", inputElementExerciseTime);
}

function validateInputs(timeInput){
    return timeInput !== "";
}

function createMealCard(label, time, mealType){
    results.innerHTML += `<div class="meal-card">
        <span class="meal-label">${label}</span>
        <span class="meal-time">${time}</span>
        <span class="meal-type">${mealType}</span>
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
}

function loadTimes(inputId){
   const input = localStorage.getItem(`${inputId}`);
    if (input){
        document.getElementById(`${inputId}`).value = input;
    }
}

if (localStorage.length > 0){
   loadTimes("wakeupTime");
   loadTimes("sleepTime");
   loadTimes("exerciseTime");
}

document.getElementById("calculateButton").addEventListener("click", calculate);