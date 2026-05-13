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

    // Validate all inputs are within safe ranges
    if (!age    || age    < 10  || age    > 100) return null;
    if (!weight || weight < 30  || weight > 300) return null;
    if (!height || height < 100 || height > 250) return null;

    // Validate activity multiplier is a known value
    const validActivities = [1.2, 1.375, 1.55, 1.725];
    const safeActivity    = validActivities.includes(activity) ? activity : 1.2;

    // Validate extra calories is reasonable
    const safeExtra = Math.min(Math.max(0, extraCalories), 3000);

    // Validate sex
    const safeSex = ["male", "female"].includes(sex) ? sex : "male";

    // Validate goal
    const validGoals = ["lose", "energy", "sleep", "muscle", "maintain"];
    const safeGoal   = validGoals.includes(goal) ? goal : "maintain";

    let bmr;
    if (safeSex === "male"){
        bmr = 88.36 + (13.4 * weight) + (4.8 * height) - (5.7 * age);
    } else {
        bmr = 447.6 + (9.2 * weight) + (3.1 * height) - (4.3 * age);
    }

    // Sanity check BMR is in reasonable range
    if (bmr < 500 || bmr > 5000) return null;

    const tdee    = Math.round(bmr * safeActivity);
    const netTDEE = tdee + safeExtra;
    let target    = netTDEE;

    if (safeGoal === "lose")   target -= 500;
    if (safeGoal === "muscle") target += 300;

    // Ensure target is never dangerously low
    target = Math.max(1200, target);

    return {
        bmr:         Math.round(bmr),
        tdee:        tdee,
        extraBurn:   safeExtra,
        maintenance: netTDEE,
        target:      target,
        goal:        safeGoal
    };
}

function calculateFastingWindow(wakeMinutes, sleepMinutes){
    const windowHours    = (sleepMinutes - wakeMinutes) / HOURS;
    const breakfastStart = wakeMinutes + 30;

    const eatStop = windowHours >= 4
        ? sleepMinutes - HOURS * 2
        : sleepMinutes;

    const eatingWindow  = Math.max(0, eatStop - breakfastStart);
    const eatingHrs     = Math.floor(eatingWindow / HOURS);

    // Calculate fasting from eating to avoid rounding mismatch
    const fastingHrs    = 24 - eatingHrs;

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