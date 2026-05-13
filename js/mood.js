// ---- MOOD & ENERGY DATA ----
function getMoodData(){
    const data = localStorage.getItem("moodData");
    return data ? JSON.parse(data) : {};
}

function saveMoodData(data){
    localStorage.setItem("moodData", JSON.stringify(data));
}

function logMoodEntry(mealLabel, energy, hunger){
    const data    = getMoodData();
    const today   = getTodayKey();
    const now     = new Date();
    const timeKey = `${now.getHours()}:${now.getMinutes()}`;

    if (!data[today]) data[today] = {};
    data[today][mealLabel] = {
        energy:    energy,
        hunger:    hunger,
        time:      timeKey,
        timestamp: Date.now()
    };

    saveMoodData(data);
    renderInsights();
}

// ---- MOOD RATING POPUP ----
function showMoodRating(mealLabel){
    // Remove any existing popup
    const existing = document.getElementById("moodPopup");
    if (existing) existing.remove();

    const popup = document.createElement("div");
    popup.id    = "moodPopup";
    popup.className = "mood-popup";
    popup.innerHTML = `
        <div class="mood-popup-content">
            <div class="mood-popup-title">How do you feel after ${mealLabel}?</div>
            <div class="mood-popup-close" onclick="document.getElementById('moodPopup').remove()">✕</div>

            <div class="mood-section">
                <div class="mood-label">⚡ Energy level</div>
                <div class="mood-emojis" data-type="energy">
                    <span class="mood-emoji" data-value="1">😴</span>
                    <span class="mood-emoji" data-value="2">😕</span>
                    <span class="mood-emoji" data-value="3">😐</span>
                    <span class="mood-emoji" data-value="4">🙂</span>
                    <span class="mood-emoji" data-value="5">⚡</span>
                </div>
            </div>

            <div class="mood-section">
                <div class="mood-label">🍽️ Hunger level</div>
                <div class="mood-emojis" data-type="hunger">
                    <span class="mood-emoji" data-value="1">🤢</span>
                    <span class="mood-emoji" data-value="2">😕</span>
                    <span class="mood-emoji" data-value="3">😐</span>
                    <span class="mood-emoji" data-value="4">🙂</span>
                    <span class="mood-emoji" data-value="5">😋</span>
                </div>
            </div>

            <button class="mood-save-btn" id="moodSaveBtn" disabled
                onclick="saveMoodFromPopup('${mealLabel}')">
                Save
            </button>
        </div>
    `;

    document.body.appendChild(popup);

    // Emoji selection logic
    let selectedEnergy = null;
    let selectedHunger = null;

    popup.querySelectorAll(".mood-emojis").forEach(group => {
        group.querySelectorAll(".mood-emoji").forEach(emoji => {
            emoji.addEventListener("click", function(){
                const type  = group.dataset.type;
                const value = parseInt(this.dataset.value);

                group.querySelectorAll(".mood-emoji").forEach(e => e.classList.remove("selected"));
                this.classList.add("selected");

                if (type === "energy") selectedEnergy = value;
                if (type === "hunger") selectedHunger = value;

                popup.dataset.energy = selectedEnergy;
                popup.dataset.hunger = selectedHunger;

                if (selectedEnergy && selectedHunger){
                    document.getElementById("moodSaveBtn").disabled = false;
                }
            });
        });
    });
}

function saveMoodFromPopup(mealLabel){
    const popup  = document.getElementById("moodPopup");
    if (!popup) return;

    const energy = parseInt(popup.dataset.energy);
    const hunger = parseInt(popup.dataset.hunger);

    if (!energy || !hunger) return;

    logMoodEntry(mealLabel, energy, hunger);
    popup.remove();

    // Show brief confirmation
    showToast(`Logged! ✓`);
}

function showToast(message){
    const existing = document.getElementById("toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id    = "toast";
    toast.className = "toast";
    toast.textContent = message;
    document.body.appendChild(toast);

    setTimeout(() => toast.classList.add("toast-show"), 10);
    setTimeout(() => {
        toast.classList.remove("toast-show");
        setTimeout(() => toast.remove(), 300);
    }, 2000);
}

// ---- INSIGHTS ----
function renderInsights(){
    const moodData  = getMoodData();
    const container = document.getElementById("insightsContent");
    if (!container) return;

    const allEntries = [];
    Object.keys(moodData).forEach(date => {
        Object.keys(moodData[date]).forEach(meal => {
            allEntries.push({
                date:   date,
                meal:   meal,
                energy: moodData[date][meal].energy,
                hunger: moodData[date][meal].hunger,
                time:   moodData[date][meal].time
            });
        });
    });

    if (allEntries.length < 3){
        container.innerHTML = `
            <div class="insights-empty">
                <div class="insights-empty-icon">📊</div>
                <div class="insights-empty-title">Not enough data yet</div>
                <div class="insights-empty-text">
                    Log at least 3 meals to see insights.
                    You have ${allEntries.length} so far.
                </div>
            </div>
        `;
        return;
    }

    // Calculate averages per meal
    const mealStats = {};
    allEntries.forEach(entry => {
        if (!mealStats[entry.meal]){
            mealStats[entry.meal] = { energy: [], hunger: [], count: 0 };
        }
        mealStats[entry.meal].energy.push(entry.energy);
        mealStats[entry.meal].hunger.push(entry.hunger);
        mealStats[entry.meal].count++;
    });

    const avg = arr => arr.reduce((a, b) => a + b, 0) / arr.length;

    // Overall averages
    const avgEnergy = avg(allEntries.map(e => e.energy));
    const avgHunger = avg(allEntries.map(e => e.hunger));

    // Best and worst meals
    const mealAverages = Object.keys(mealStats).map(meal => ({
        meal:      meal,
        energy:    avg(mealStats[meal].energy),
        hunger:    avg(mealStats[meal].hunger),
        count:     mealStats[meal].count
    }));

    const bestEnergyMeal  = mealAverages.sort((a, b) => b.energy - a.energy)[0];
    const worstEnergyMeal = mealAverages.sort((a, b) => a.energy - b.energy)[0];
    const mostHungryMeal  = mealAverages.sort((a, b) => b.hunger - a.hunger)[0];

    const energyEmoji = (val) => {
        if (val >= 4.5) return "⚡";
        if (val >= 3.5) return "🙂";
        if (val >= 2.5) return "😐";
        if (val >= 1.5) return "😕";
        return "😴";
    };

    const hungerEmoji = (val) => {
        if (val >= 4.5) return "😋";
        if (val >= 3.5) return "🙂";
        if (val >= 2.5) return "😐";
        if (val >= 1.5) return "😕";
        return "🤢";
    };

    // Build meal breakdown rows
    const mealRows = Object.keys(mealStats).map(meal => {
        const stats  = mealStats[meal];
        const avgE   = avg(stats.energy).toFixed(1);
        const avgH   = avg(stats.hunger).toFixed(1);
        return `
            <div class="insight-meal-row">
                <div class="insight-meal-name">${meal}</div>
                <div class="insight-meal-stats">
                    <span class="insight-stat">
                        ${energyEmoji(avgE)} ${avgE}
                    </span>
                    <span class="insight-stat">
                        ${hungerEmoji(avgH)} ${avgH}
                    </span>
                </div>
            </div>
        `;
    }).join("");

    container.innerHTML = `
        <!-- OVERVIEW CARD -->
        <div class="insight-card">
            <div class="insight-card-title">📈 Overall Averages</div>
            <div class="insight-overview">
                <div class="insight-overview-item">
                    <div class="insight-overview-value">${energyEmoji(avgEnergy)} ${avgEnergy.toFixed(1)}</div>
                    <div class="insight-overview-label">Avg Energy</div>
                </div>
                <div class="insight-overview-item">
                    <div class="insight-overview-value">${hungerEmoji(avgHunger)} ${avgHunger.toFixed(1)}</div>
                    <div class="insight-overview-label">Avg Hunger</div>
                </div>
                <div class="insight-overview-item">
                    <div class="insight-overview-value">${allEntries.length}</div>
                    <div class="insight-overview-label">Meals Logged</div>
                </div>
            </div>
        </div>

        <!-- HIGHLIGHTS CARD -->
        <div class="insight-card">
            <div class="insight-card-title">💡 Highlights</div>
            <div class="insight-highlight">
                <span class="highlight-icon">⚡</span>
                <span class="highlight-text">
                    Best energy after <strong>${bestEnergyMeal.meal}</strong>
                    (avg ${bestEnergyMeal.energy.toFixed(1)}/5)
                </span>
            </div>
            <div class="insight-highlight">
                <span class="highlight-icon">😴</span>
                <span class="highlight-text">
                    Lowest energy after <strong>${worstEnergyMeal.meal}</strong>
                    (avg ${worstEnergyMeal.energy.toFixed(1)}/5)
                </span>
            </div>
            <div class="insight-highlight">
                <span class="highlight-icon">🍽️</span>
                <span class="highlight-text">
                    Most hungry after <strong>${mostHungryMeal.meal}</strong>
                    (avg ${mostHungryMeal.hunger.toFixed(1)}/5)
                </span>
            </div>
        </div>

        <!-- MEAL BREAKDOWN CARD -->
        <div class="insight-card">
            <div class="insight-card-title">🍽️ Meal Breakdown</div>
            <div class="insight-meal-header">
                <span>Meal</span>
                <span>⚡ Energy &nbsp; 🍽️ Hunger</span>
            </div>
            ${mealRows}
        </div>

        <!-- RECENT LOG -->
        <div class="insight-card">
            <div class="insight-card-title">🕐 Recent Log</div>
            ${allEntries.slice(-5).reverse().map(entry => `
                <div class="insight-log-row">
                    <div class="insight-log-meal">${entry.meal}</div>
                    <div class="insight-log-date">${entry.date}</div>
                    <div class="insight-log-ratings">
                        ${energyEmoji(entry.energy)} ${entry.energy}
                        &nbsp;
                        ${hungerEmoji(entry.hunger)} ${entry.hunger}
                    </div>
                </div>
            `).join("")}
        </div>
    `;
}