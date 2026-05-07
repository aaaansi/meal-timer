const HOURS = 60;
const MINUTESADAY = 1440;

function calculate() {
    const inputElementWakeUpTime = document.getElementById("wakeupTime").value;
    const inputElementSleepTime = document.getElementById("sleepTime").value;
    const inputElementExerciseTime = document.getElementById("exerciseTime").value;
    const results = document.getElementById("results");

    const validWakeUpTime = validateInputs(inputElementWakeUpTime);
    const validSleepTime = validateInputs(inputElementSleepTime);
    const validExerciseTime = validateInputs(inputElementExerciseTime);

    // if (!validWakeUpTime || !validSleepTime){
    //     results.innerHTML = "<p>Please Enter Wake & Sleep times!<p>"
    //     return;
    // }
    // if (timeToMinutes(inputElementWakeUpTime) > timeToMinutes(inputElementSleepTime)){
    //     results.innerHTML = "<p>Do you wake up before you sleep?<p>"
    //     return;
    // }
    
    
    const bestTimeToEatBreakfast = minutesToTime(timeToMinutes(inputElementWakeUpTime) + 30);
    const bestTimeToEatSnack = minutesToTime(timeToMinutes(inputElementWakeUpTime) + HOURS * 3);
    const bestTimeToEatLunch = minutesToTime(timeToMinutes(inputElementWakeUpTime) + HOURS * 5);
    const bestTimeToEatDinner = minutesToTime(timeToMinutes(inputElementSleepTime) - HOURS * 3);
    const bestTimeToStopEating = minutesToTime(timeToMinutes(inputElementSleepTime) - HOURS * 2);
    results.innerHTML = ``;
    results.innerHTML += `<div class="meal-card">
        <span class="meal-label">🌅 Breakfast: </span>
        <span class="meal-time">${bestTimeToEatBreakfast}</span>
        <span class="meal-type">Heavy meal</span>
        </div>`;
    results.innerHTML +=  `<div class="meal-card">
        <span class="meal-label">🍿 Snack time: </span>
        <span class="meal-time">${bestTimeToEatSnack}</span>
        <span class="meal-type">Light meal</span>
        </div>`;
    results.innerHTML +=  `<div class="meal-card">
        <span class="meal-label">☀️ Lunch: </span>
        <span class="meal-time">${bestTimeToEatLunch}</span>
        <span class="meal-type">Moderate meal</span>
        </div>`;
    results.innerHTML +=  `<div class="meal-card">
        <span class="meal-label">🌄 Dinner: </span>
        <span class="meal-time">${bestTimeToEatDinner}</span>
        <span class="meal-type">Light meal</span>
        </div>`;
        results.innerHTML +=  `<div class="meal-card">
        <span class="meal-label">🎑 Stop Eating: </span>
        <span class="meal-time">${bestTimeToStopEating}</span>
        <span class="meal-type"></span>
        </div>`;
    
    if (validExerciseTime){
        const bestTimetoEatpreWorkoutSnack = minutesToTime(timeToMinutes(inputElementExerciseTime) - HOURS);
        const bestTimetoEatpreWorkoutMeal = minutesToTime(timeToMinutes(inputElementExerciseTime) - HOURS * 2.5);
        const bestTimetoEatpostWorkout = minutesToTime(timeToMinutes(inputElementExerciseTime) + HOURS / 2);
        const bestTimetoEatpreSleep = minutesToTime(timeToMinutes(inputElementSleepTime) - HOURS / 2);
        results.innerHTML += `<div class="meal-card">
            <span class="meal-label">⚡ Preworkout snack: </span>
            <span class="meal-time">${bestTimetoEatpreWorkoutSnack}</span>
            <span class="meal-type">Light meal</span>
            </div>`;
        results.innerHTML +=  `<div class="meal-card">
            <span class="meal-label">🍽️ Preworkout meal: </span>
            <span class="meal-time">${bestTimetoEatpreWorkoutMeal}</span>
            <span class="meal-type">Heavy meal</span>
            </div>`;
        results.innerHTML +=  `<div class="meal-card">
            <span class="meal-label">💪 Post workout: </span>
            <span class="meal-time">${bestTimetoEatpostWorkout}</span>
            <span class="meal-type">Recovery meal</span>
            </div>`;
        results.innerHTML +=  `<div class="meal-card">
            <span class="meal-label">🌙 Pre sleep: </span>
            <span class="meal-time">${bestTimetoEatpreSleep}</span>
            <span class="meal-type">Casein protein</span>
            </div>`;
    }
}

function validateInputs(timeInput){
    return timeInput !== "";
}

function timeToMinutes(timeString){
    const wakeUpTimeArray = timeString.split(':');
    const timeInMinutes = parseInt(wakeUpTimeArray[0])*60 + parseInt(wakeUpTimeArray[1]);

    return timeInMinutes;
}

function minutesToTime(timeString){
    timeString = timeString < 0 ? timeString + MINUTESADAY : timeString;
    const minutes = timeString % MINUTESADAY;
    const hours = String(Math.floor(minutes / HOURS)).padStart(2, '0');
    const minutesRemaining = String(minutes % HOURS).padStart(2, '0');

    return hours + ":" + minutesRemaining;
}


document.getElementById("calculateButton").addEventListener("click", calculate);