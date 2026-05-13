function renderStatus(meals){
    const now            = new Date();
    const currentMinutes = now.getHours() * HOURS + now.getMinutes();

    let current = null;
    let next    = null;

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

    const hoursUntil    = Math.floor(minutesUntilNext / HOURS);
    const minsUntil     = minutesUntilNext % HOURS;
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

function renderFastingBar(wakeMinutes, sleepMinutes, windowHours){
    const breakfastStart = wakeMinutes + 30;
    const eatStop = windowHours >= 4
        ? sleepMinutes - HOURS * 2
        : sleepMinutes;

    const now            = new Date();
    const currentMinutes = now.getHours() * HOURS + now.getMinutes();
    const toPercent      = (mins) => (mins / MINUTESADAY) * 100;

    const eatStartPct = toPercent(breakfastStart);
    const eatWidthPct = toPercent(eatStop - breakfastStart);
    const nowPct      = toPercent(currentMinutes);

    const eatingWindowEl = document.getElementById("eatingWindow");
    const nowMarkerEl    = document.getElementById("nowMarker");
    const countdownEl    = document.getElementById("fastingCountdown");
    const legendEl       = document.getElementById("eatingWindowText");

    if (!eatingWindowEl || !nowMarkerEl || !countdownEl || !legendEl) return;

    // Guard against negative or zero eating window
    if (eatStop <= breakfastStart || windowHours < 1){
        eatingWindowEl.style.width = "0%";
        countdownEl.textContent    = "Window too short for fasting calculation";
        legendEl.textContent       = `Eating window: ${Math.round(windowHours * 10) / 10} hours`;
        return;
    }

    eatingWindowEl.style.left  = `${eatStartPct}%`;
    eatingWindowEl.style.width = `${eatWidthPct}%`;
    nowMarkerEl.style.left     = `${nowPct}%`;

    const isInEatingWindow  = currentMinutes >= breakfastStart && currentMinutes <= eatStop;
    const minutesUntilOpen  = breakfastStart - currentMinutes;
    const minutesUntilClose = eatStop - currentMinutes;

    let countdownText = "";
    if (isInEatingWindow){
        const hrs  = Math.floor(minutesUntilClose / HOURS);
        const mins = minutesUntilClose % HOURS;
        countdownText = hrs > 0
            ? `Eating window closes in ${hrs}h ${mins}m`
            : `Eating window closes in ${mins}m`;
    } else if (minutesUntilOpen > 0){
        const hrs  = Math.floor(minutesUntilOpen / HOURS);
        const mins = minutesUntilOpen % HOURS;
        countdownText = hrs > 0
            ? `Eating window opens in ${hrs}h ${mins}m`
            : `Eating window opens in ${mins}m`;
    } else {
        countdownText = "Fasting window — no food until morning";
    }

    countdownEl.textContent = countdownText;

    const eatingHrs  = Math.floor((eatStop - breakfastStart) / HOURS);
    const fastingHrs = 24 - eatingHrs;
    legendEl.textContent = `${minutesToTime(breakfastStart)} → ${minutesToTime(eatStop)} • ${eatingHrs}h eating / ${fastingHrs}h fasting`;
}

function renderSchedule(meals, tdee){
    const now            = new Date();
    const currentMinutes = now.getHours() * HOURS + now.getMinutes();
    const scheduleList   = document.getElementById("scheduleList");
    scheduleList.innerHTML = "";

    const lastPastMeal = meals.filter(m => m.sortTime <= currentMinutes).slice(-1)[0];
    const data         = getComplianceData();
    const today        = getTodayKey();
    const todayData    = data[today] || {};
    const userGoal     = localStorage.getItem("goal") || "energy";

    let totalCal = 0;
    let eatenCal = 0;

    meals.forEach(meal => {
        const isCurrentMeal = meal === lastPastMeal;
        const isPast        = meal.sortTime < currentMinutes && !isCurrentMeal;
        const isStopEating  = meal.label === "🎑 Stop Eating";

        let className = "schedule-item";
        if (isPast)        className += " past";
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
        const isChecked   = todayData[meal.label] === true;
        const foodHTML    = getFoodSuggestions(meal.label, userGoal);

        if (meal.calories){
            totalCal += meal.calories;
            if (isChecked) eatenCal += meal.calories;
        }

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
        details.innerHTML = `
            <p>${meal.description}</p>
            ${macroHTML}
            ${foodHTML}
        `;

        scheduleList.appendChild(item);
        scheduleList.appendChild(details);
    });

    updateCaloriesRemaining(eatenCal, totalCal, tdee);
    updateDailyProgress();
    updateStreak();
}

function renderSummary(tdeeData, fastingData){
    const summary = document.getElementById("summary");
    let html = "";

    if (tdeeData){
        const goalText = {
            lose:   "Lose weight (−500 cal deficit)",
            maintain: "Maintain weight",
            muscle: "Build muscle (+300 cal surplus)"
        };
        const deficitSurplus = tdeeData.target - tdeeData.maintenance;
        const deficitLabel   = deficitSurplus < 0
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
                    <span class="summary-value">${goalText[tdeeData.goal] || tdeeData.goal}</span>
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

function renderHistory(){
    const data     = getComplianceData();
    const streak   = calculateStreak();
    const best     = calculateBestStreak();
    const goodDays = Object.values(data).filter(day => {
        const total = Object.keys(day).length;
        const hit   = Object.values(day).filter(v => v).length;
        return total > 0 && hit / total >= 0.75;
    }).length;

    document.getElementById("currentStreak").textContent = streak;
    document.getElementById("bestStreak").textContent    = best;
    document.getElementById("totalDays").textContent     = goodDays;

    const now = new Date();
    let html  = '<div class="calendar-grid">';

    for (let i = 29; i >= 0; i--){
        const date    = new Date(now);
        date.setDate(date.getDate() - i);
        const key     = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        const dayData = data[key];
        const day     = date.getDate();

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

function updateCaloriesRemaining(eaten, total, tdee){
    const el = document.getElementById("caloriesRemaining");
    if (!el) return;

    if (total === 0){
        el.innerHTML = "";
        el.style.display = "none";
        return;
    }

    el.style.display = "block";
    const remaining  = total - eaten;
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
            <span class="summary-label">📊 Daily total</span>
            <span class="remaining-value">${total} kcal</span>
        </div>
        ${tdee ? `
        <div class="remaining-row">
            <span class="remaining-label">🎯 TDEE target</span>
            <span class="remaining-value">${tdee} kcal</span>
        </div>` : ""}
    `;
}