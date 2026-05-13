// ---- THEME ----
function applyTheme(){
    const isLight = localStorage.getItem("lightMode") === "true";
    document.body.classList.toggle("light-mode", isLight);
    const toggle = document.getElementById("lightMode");
    if (toggle) toggle.checked = isLight;
}

// ---- VIEW MANAGEMENT ----
function showView(viewId){
    ["homeView","historyView","settingsView","insightsView"].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.style.display = "none";
    });
    document.getElementById(viewId).style.display = "block";
    document.querySelectorAll(".nav-item").forEach(btn => {
        btn.classList.toggle("active", btn.dataset.view === viewId);
    });
}

function showApp(){
    document.getElementById("firstTime").style.display  = "none";
    document.getElementById("mainApp").style.display    = "block";
    showView("homeView");
}

function showOnboarding(){
    document.getElementById("mainApp").style.display   = "none";
    document.getElementById("firstTime").style.display = "block";
}

// ---- CALCULATE ----
function calculate(){
    const wakeupTime = localStorage.getItem("wakeupTime");
    const sleepTime  = localStorage.getItem("sleepTime");
    if (!wakeupTime || !sleepTime) return;

    const wakeMinutes = timeToMinutes(wakeupTime);
    let sleepMinutes  = timeToMinutes(sleepTime);
    if (sleepMinutes < wakeMinutes) sleepMinutes += MINUTESADAY;

    const windowMinutes = sleepMinutes - wakeMinutes;
    const windowHours   = windowMinutes / HOURS;

    const userGoal = localStorage.getItem("goal") || "energy";
    const tdeeData = calculateTDEE();
    const tdee     = tdeeData ? tdeeData.target : null;

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

    // Show window warning
    const warningEl = document.getElementById("windowWarning");
    if (warningEl){
        if (windowHours < 1){
            warningEl.innerHTML = `
                <div class="window-warning">
                    ⚠️ Your wake and sleep times are too close together.
                    Please set at least a 4 hour window for meal recommendations.
                </div>
            `;
            document.getElementById("scheduleList").innerHTML = "";
            document.getElementById("summary").innerHTML = "";
            renderFastingBar(wakeMinutes, sleepMinutes, windowHours);
            return;
        } else if (windowHours < 6){
            warningEl.innerHTML = `
                <div class="window-warning">
                    ⚠️ Your eating window is only ${Math.round(windowHours)} hours.
                    Research suggests a minimum of 8-10 hours for optimal nutrition.
                </div>
            `;
        } else {
            warningEl.innerHTML = "";
        }
    }

    const meals = buildMeals(wakeMinutes, sleepMinutes, cal, userGoal);

    // Only add exercise meals if window is large enough and they fit
    const exerciseTime   = localStorage.getItem("exerciseTime");
    const exerciseToggle = localStorage.getItem("exerciseToggle") === "true";
    if (exerciseToggle && exerciseTime && windowHours >= 6){
        const exerciseMinutes = timeToMinutes(exerciseTime);
        const exerciseMeals   = buildExerciseMeals(exerciseMinutes, sleepMinutes, cal, userGoal);
        exerciseMeals
            .filter(meal => meal.sortTime >= wakeMinutes && meal.sortTime <= sleepMinutes)
            .forEach(meal => meals.push(meal));
    }

    meals.sort((a, b) => a.sortTime - b.sortTime);

    const fastingData = calculateFastingWindow(wakeMinutes, sleepMinutes);
    renderStatus(meals);
    renderFastingBar(wakeMinutes, sleepMinutes, windowHours);
    renderSchedule(meals, tdee);
    renderSummary(tdeeData, fastingData);
}

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
    updateCaloriesRemaining(
        eatenCal,
        totalCal,
        tdeeData ? tdeeData.target : null
    );

    // Only show mood popup if:
    // 1. Meal was CHECKED not unchecked
    // 2. Not stop eating
    // 3. No mood entry already exists for this meal today
    if (!checked) return; // ← exit early if unchecking
    if (mealLabel === "🎑 Stop Eating") return; // ← skip stop eating

    const moodData  = getMoodData();
    const today     = getTodayKey();
    const todayMood = moodData[today] || {};

    if (todayMood[mealLabel]){
        // Already rated today — show a small toast instead
        showToast(`Already rated ${mealLabel} today ✓`);
        return;
    }

    showMoodRating(mealLabel);
}

// ---- NAV ----
document.querySelectorAll(".nav-item").forEach(btn => {
    btn.addEventListener("click", function(){
        // Skip if this is the feedback button
        if (this.id === "feedbackButton") return;
        
        showView(this.dataset.view);
        if (this.dataset.view === "historyView")  renderHistory();
        if (this.dataset.view === "settingsView") syncSettingsFromStorage();
        if (this.dataset.view === "insightsView") renderInsights();
    });
});

// ---- APP TITLE ----
document.getElementById("appTitle")
    .addEventListener("click", function(){
        const wake  = localStorage.getItem("wakeupTime");
        const sleep = localStorage.getItem("sleepTime");
        if (wake)  document.getElementById("wakeupTimeFirst").value  = wake;
        if (sleep) document.getElementById("sleepTimeFirst").value   = sleep;
        showOnboarding();
    });

// ---- ONBOARDING ----
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
        localStorage.setItem("sleepTime",  sleep);
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

document.getElementById("lightMode")
    .addEventListener("change", function(){
        localStorage.setItem("lightMode", this.checked);
        applyTheme();
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

document.getElementById("feedbackButton")
.addEventListener("click", function(){
    window.open("https://forms.gle/UJYSr68XTcM7waHr9", "_blank");
});

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

// ---- INIT ----
applyTheme();

// ---- AUTO REFRESH ----
let lastDate = getTodayKey();

function autoRefresh(){
    const currentDate = getTodayKey();

    // Date has changed → full recalculate
    if (currentDate !== lastDate){
        lastDate = currentDate;
        calculate();
        return;
    }

    // Same day → just update time-sensitive parts
    const wakeupTime = localStorage.getItem("wakeupTime");
    const sleepTime  = localStorage.getItem("sleepTime");
    if (!wakeupTime || !sleepTime) return;

    const wakeMinutes = timeToMinutes(wakeupTime);
    let sleepMinutes  = timeToMinutes(sleepTime);
    if (sleepMinutes < wakeMinutes) sleepMinutes += MINUTESADAY;

    // Only update if on home view
    const homeView = document.getElementById("homeView");
    if (!homeView || homeView.style.display === "none") return;

    // Rebuild meals to recheck current/past status
    const userGoal = localStorage.getItem("goal") || "energy";
    const tdeeData = calculateTDEE();
    const tdee     = tdeeData ? tdeeData.target : null;

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

    const meals = buildMeals(wakeMinutes, sleepMinutes, cal, userGoal);

    const exerciseTime   = localStorage.getItem("exerciseTime");
    const exerciseToggle = localStorage.getItem("exerciseToggle") === "true";
    const windowHours    = (sleepMinutes - wakeMinutes) / HOURS;

    if (exerciseToggle && exerciseTime && windowHours >= 6){
        const exerciseMinutes = timeToMinutes(exerciseTime);
        const exerciseMeals   = buildExerciseMeals(exerciseMinutes, sleepMinutes, cal, userGoal);
        exerciseMeals
            .filter(meal => meal.sortTime >= wakeMinutes && meal.sortTime <= sleepMinutes)
            .forEach(meal => meals.push(meal));
    }

    meals.sort((a, b) => a.sortTime - b.sortTime);

    // Update only time-sensitive elements
    renderStatus(meals);
    renderFastingBar(wakeMinutes, sleepMinutes, windowHours);
    renderSchedule(meals, tdee);
}

// Run every minute
setInterval(autoRefresh, 60 * 1000);

// Also run when app comes back to foreground
document.addEventListener("visibilitychange", function(){
    if (document.visibilityState === "visible"){
        autoRefresh();
    }
});

if (localStorage.getItem("wakeupTime") && localStorage.getItem("sleepTime")){
    showApp();
    calculate();
} else {
    document.getElementById("firstTime").style.display  = "block";
    document.getElementById("mainApp").style.display    = "none";
}