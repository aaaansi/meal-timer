const HOURS = 60;
const MINUTESADAY = 1440;

function timeToMinutes(timeString){
    const arr = timeString.split(':');
    return parseInt(arr[0]) * HOURS + parseInt(arr[1]);
}

function minutesToTime(minutes){
    minutes = minutes < 0 ? minutes + MINUTESADAY : minutes;
    minutes = minutes % MINUTESADAY;
    const hours = String(Math.floor(minutes / HOURS)).padStart(2, '0');
    const mins  = String(minutes % HOURS).padStart(2, '0');
    return formatTime(hours, mins);
}

function formatTime(hours, minutes){
    const is12Hour = localStorage.getItem("timeFormat") === "true";
    const h = parseInt(hours);
    if (is12Hour){
        const ampm = h >= 12 ? "PM" : "AM";
        const h12  = h % 12 || 12;
        return `${h12}:${minutes} ${ampm}`;
    }
    return `${hours}:${minutes}`;
}

function sanitise(str){
    if (!str) return "";
    return String(str)
        .replace(/&/g,  "&amp;")
        .replace(/</g,  "&lt;")
        .replace(/>/g,  "&gt;")
        .replace(/"/g,  "&quot;")
        .replace(/'/g,  "&#x27;");
}