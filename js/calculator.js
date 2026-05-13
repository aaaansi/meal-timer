function calculateTDEE(){
    const profileEnabled = localStorage.getItem("profileToggle") === "true";
    if (!profileEnabled) return null;

    const age    = parseInt(localStorage.getItem("age"));
    const weight = parseFloat(localStorage.getItem("weight"));
    const height = parseFloat(localStorage.getItem("height"));
    const sex    = localStorage.getItem("sex") || "male";
    const goal   = localStorage.getItem("goal") || "maintain";
    const activity      = parseFloat(localStorage.getItem("activity")) || 1.2;
    const extraCalories = parseInt(localStorage.getItem("extraCalories")) || 0;

    if (!age || !weight || !height) return null;

    let bmr;
    if (sex === "male"){
        bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else {
        bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    }

    const tdee    = Math.round(bmr * activity);
    const netTDEE = tdee + extraCalories;
    let target    = netTDEE;
    if (goal === "lose")  target -= 500;
    if (goal === "muscle") target += 300;

    return {
        bmr:         Math.round(bmr),
        tdee:        tdee,
        extraBurn:   extraCalories,
        maintenance: netTDEE,
        target:      target,
        goal:        goal
    };
}

function calculateFastingWindow(wakeMinutes, sleepMinutes){
    const windowHours    = (sleepMinutes - wakeMinutes) / HOURS;
    const breakfastStart = wakeMinutes + 30;

    // Dynamic stop eating based on window size
    const eatStop = windowHours >= 4
        ? sleepMinutes - HOURS * 2
        : sleepMinutes;

    // Guard against negative eating window
    const eatingWindow  = Math.max(0, eatStop - breakfastStart);
    const fastingWindow = MINUTESADAY - eatingWindow;
    const eatingHrs     = Math.floor(eatingWindow / HOURS);
    const fastingHrs    = Math.floor(fastingWindow / HOURS);

    // Guard against nonsensical protocols
    if (eatingHrs <= 0 || fastingHrs >= 24){
        return {
            eatingHrs:  Math.round(windowHours),
            fastingHrs: Math.round(24 - windowHours),
            protocol:   `${Math.round(24 - windowHours)}:${Math.round(windowHours)}`
        };
    }

    return {
        eatingHrs:  eatingHrs,
        fastingHrs: fastingHrs,
        protocol:   `${fastingHrs}:${eatingHrs}`
    };
}