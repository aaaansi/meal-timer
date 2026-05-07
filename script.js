const HOURS = 60;
const MINUTESADAY = 1440;

function calculate() {
    const inputElementWakeUpTime = document.getElementById("wakeupTime").value;
    const inputElementSleepTime = document.getElementById("sleepTime").value;
    const inputElementExerciseTime = document.getElementById("exerciseTime").value;
    
    const bestTimeToEatBreakfast = minutesToTime(timeToMinutes(inputElementWakeUpTime) + 30);
    const bestTimeToEatSnack = minutesToTime(timeToMinutes(inputElementWakeUpTime) + HOURS * 3);
    const bestTimeToEatLunch = minutesToTime(timeToMinutes(inputElementWakeUpTime) + HOURS * 5);
    const bestTimeToEatDinner = minutesToTime(timeToMinutes(inputElementSleepTime) - HOURS * 3);
    const bestTimeToStopEating = minutesToTime(timeToMinutes(inputElementSleepTime) - HOURS * 2);

    console.log("Best time to eat breakfast is: " + bestTimeToEatBreakfast);
    console.log("Best time to eat a snack is: " + bestTimeToEatSnack);
    console.log("Best time to eat Lunch is: " + bestTimeToEatLunch);
    console.log("Best time to eat Dinner is: " + bestTimeToEatDinner);
    console.log("Best time to stop eating is: " + bestTimeToStopEating);

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