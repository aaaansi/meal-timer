function getTodayKey(){
    const now = new Date();
    return `${now.getFullYear()}-${now.getMonth()+1}-${now.getDate()}`;
}

function getComplianceData(){
    const data = localStorage.getItem("compliance");
    return data ? JSON.parse(data) : {};
}

function saveComplianceData(data){
    localStorage.setItem("compliance", JSON.stringify(data));
}

function markMeal(mealLabel, checked){
    const data  = getComplianceData();
    const today = getTodayKey();
    if (!data[today]) data[today] = {};
    data[today][mealLabel] = checked;
    saveComplianceData(data);
    updateDailyProgress();
    updateStreak();
}

function updateDailyProgress(){
    const checkboxes = document.querySelectorAll(".meal-check");
    const total   = checkboxes.length;
    const hit     = Array.from(checkboxes).filter(cb => cb.checked).length;
    const percent = total > 0 ? Math.round((hit / total) * 100) : 0;

    const el = document.getElementById("dailyProgress");
    if (el){
        el.innerHTML = `
            <div class="progress-bar-container">
                <div class="progress-bar" style="width: ${percent}%"></div>
            </div>
            <div class="progress-text">${hit}/${total} meals today ${percent >= 75 ? "🎉" : ""}</div>
        `;
    }
}

function calculateStreak(){
    const data = getComplianceData();
    let streak  = 0;
    const now   = new Date();
    for (let i = 0; i < 365; i++){
        const date = new Date(now);
        date.setDate(date.getDate() - i);
        const key     = `${date.getFullYear()}-${date.getMonth()+1}-${date.getDate()}`;
        const dayData = data[key];
        if (!dayData) break;
        const total = Object.keys(dayData).length;
        const hit   = Object.values(dayData).filter(v => v).length;
        if (total === 0 || hit / total < 0.75) break;
        streak++;
    }
    return streak;
}

function calculateBestStreak(){
    const data = getComplianceData();
    const keys = Object.keys(data).sort();
    let best    = 0;
    let current = 0;
    keys.forEach(key => {
        const dayData = data[key];
        const total   = Object.keys(dayData).length;
        const hit     = Object.values(dayData).filter(v => v).length;
        if (total > 0 && hit / total >= 0.75){
            current++;
            best = Math.max(best, current);
        } else {
            current = 0;
        }
    });
    return best;
}

function updateStreak(){
    const streak = calculateStreak();
    const el     = document.getElementById("streakCount");
    if (el){
        el.textContent = streak > 0
            ? `🔥 ${streak} day streak`
            : "Start your streak today!";
    }
}