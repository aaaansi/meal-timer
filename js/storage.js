function saveFromSettings(){
    const wake  = document.getElementById("wakeupTime").value;
    const sleep = document.getElementById("sleepTime").value;
    if (!wake || !sleep){
        alert("Please enter wake and sleep times!");
        return;
    }

    const profileOn = document.getElementById("profileToggle").checked;
    if (profileOn){
        const age    = parseInt(document.getElementById("age").value);
        const weight = parseFloat(document.getElementById("weight").value);
        const height = parseFloat(document.getElementById("height").value);
        if (age < 10 || age > 100){
            alert("Please enter a valid age (10-100)"); return;
        }
        if (weight < 30 || weight > 300){
            alert("Please enter a valid weight (30-300 kg)"); return;
        }
        if (height < 100 || height > 250){
            alert("Please enter a valid height (100-250 cm)"); return;
        }
    }

    localStorage.setItem("wakeupTime",     wake);
    localStorage.setItem("sleepTime",      sleep);
    localStorage.setItem("exerciseTime",   document.getElementById("exerciseTime").value);
    localStorage.setItem("timeFormat",     document.getElementById("timeFormat").checked);
    localStorage.setItem("exerciseToggle", document.getElementById("exerciseToggle").checked);
    localStorage.setItem("goal",           document.getElementById("goalSelect").value);
    localStorage.setItem("lightMode",      document.getElementById("lightMode").checked);

    if (profileOn){
        localStorage.setItem("profileToggle", true);
        localStorage.setItem("age",           document.getElementById("age").value);
        localStorage.setItem("weight",        document.getElementById("weight").value);
        localStorage.setItem("height",        document.getElementById("height").value);
        localStorage.setItem("sex",           document.getElementById("sex").value);
        localStorage.setItem("activity",      document.getElementById("activity").value);
        localStorage.setItem("extraCalories", document.getElementById("extraCalories").value);
    } else {
        ["profileToggle","age","weight","height","sex","goal","activity","extraCalories"]
            .forEach(k => localStorage.removeItem(k));
    }
}

function syncSettingsFromStorage(){
    const fields = [
        "wakeupTime",
        "sleepTime",
        "exerciseTime",
        "age",
        "weight",
        "height",
        "sex",
        "activity",
        "extraCalories"
    ];

    fields.forEach(id => {
        const saved = localStorage.getItem(id);
        const el    = document.getElementById(id);
        if (saved && el) el.value = saved;
    });

    // Sync goal dropdown
    const goal     = localStorage.getItem("goal");
    const goalEl   = document.getElementById("goalSelect");
    if (goal && goalEl){
        goalEl.value = goal;
        // If value didn't set (mismatch) default to energy
        if (!goalEl.value) goalEl.value = "energy";
    }

    // Sync toggles
    const timeFormat = localStorage.getItem("timeFormat");
    if (timeFormat !== null)
        document.getElementById("timeFormat").checked = timeFormat === "true";

    const lightMode = localStorage.getItem("lightMode");
    if (lightMode !== null)
        document.getElementById("lightMode").checked = lightMode === "true";

    const exerciseToggle = localStorage.getItem("exerciseToggle");
    if (exerciseToggle === "true"){
        document.getElementById("exerciseToggle").checked = true;
        document.getElementById("exerciseTimeContainer").style.display = "block";
    } else {
        document.getElementById("exerciseToggle").checked = false;
        document.getElementById("exerciseTimeContainer").style.display = "none";
    }

    const profileToggle = localStorage.getItem("profileToggle");
    if (profileToggle === "true"){
        document.getElementById("profileToggle").checked = true;
        document.getElementById("profileContainer").style.display = "block";
    } else {
        document.getElementById("profileToggle").checked = false;
        document.getElementById("profileContainer").style.display = "none";
    }

    applyTheme();
}