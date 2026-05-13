// ============================================
// MEAL'O'CLOCK — UNIT TESTS
// Run by opening browser console and calling:
// runTests()
// ============================================

// ---- TEST RUNNER ----
function test(name, fn){
    try {
        fn();
        console.log(`✅ ${name}`);
        return true;
    } catch(e) {
        console.error(`❌ ${name}\n   ${e.message}`);
        return false;
    }
}

function assert(actual, expected, message){
    if (actual !== expected){
        throw new Error(
            `${message || "Assertion failed"}\n   Expected: ${JSON.stringify(expected)}\n   Got:      ${JSON.stringify(actual)}`
        );
    }
}

function assertRange(actual, min, max, message){
    if (actual < min || actual > max){
        throw new Error(
            `${message || "Range assertion failed"}\n   Expected between ${min} and ${max}\n   Got: ${actual}`
        );
    }
}

function assertTruthy(actual, message){
    if (!actual){
        throw new Error(`${message || "Expected truthy value"}\n   Got: ${JSON.stringify(actual)}`);
    }
}

// ---- RUN ALL TESTS ----
function runTests(){
    console.log("============================================");
    console.log("🧪 MEAL'O'CLOCK UNIT TESTS");
    console.log("============================================");

    let passed = 0;
    let failed = 0;

    const tests = [
        ...timeToMinutesTests(),
        ...minutesToTimeTests(),
        ...formatTimeTests(),
        ...calculateFastingWindowTests(),
        ...buildMealsTests(),
        ...calculateTDEETests(),
        ...getDailyMacroTargetsTests(),
        ...complianceTests(),
        ...edgeCaseTests()
    ];

    tests.forEach(({ name, fn }) => {
        if (test(name, fn)) passed++;
        else failed++;
    });

    console.log("============================================");
    console.log(`Results: ${passed} passed, ${failed} failed`);
    console.log("============================================");

    return { passed, failed };
}

// ============================================
// timeToMinutes() TESTS
// ============================================
function timeToMinutesTests(){
    return [
        {
            name: "timeToMinutes — standard time",
            fn: () => {
                assert(timeToMinutes("08:00"), 480, "08:00 should be 480 minutes");
            }
        },
        {
            name: "timeToMinutes — midnight",
            fn: () => {
                assert(timeToMinutes("00:00"), 0, "00:00 should be 0 minutes");
            }
        },
        {
            name: "timeToMinutes — end of day",
            fn: () => {
                assert(timeToMinutes("23:59"), 1439, "23:59 should be 1439 minutes");
            }
        },
        {
            name: "timeToMinutes — half hour",
            fn: () => {
                assert(timeToMinutes("07:30"), 450, "07:30 should be 450 minutes");
            }
        },
        {
            name: "timeToMinutes — noon",
            fn: () => {
                assert(timeToMinutes("12:00"), 720, "12:00 should be 720 minutes");
            }
        },
        {
            name: "timeToMinutes — single digit hour",
            fn: () => {
                assert(timeToMinutes("09:05"), 545, "09:05 should be 545 minutes");
            }
        }
    ];
}

// ============================================
// minutesToTime() TESTS
// ============================================
function minutesToTimeTests(){
    // Store original localStorage to restore after
    const originalFormat = localStorage.getItem("timeFormat");
    localStorage.setItem("timeFormat", "false"); // use 24hr for these tests

    const tests = [
        {
            name: "minutesToTime — standard minutes",
            fn: () => {
                assert(minutesToTime(480), "08:00", "480 minutes should be 08:00");
            }
        },
        {
            name: "minutesToTime — midnight rollover forward",
            fn: () => {
                assert(minutesToTime(1440), "00:00", "1440 minutes should rollover to 00:00");
            }
        },
        {
            name: "minutesToTime — negative rollover backward",
            fn: () => {
                assert(minutesToTime(-60), "23:00", "-60 minutes should rollover to 23:00");
            }
        },
        {
            name: "minutesToTime — zero",
            fn: () => {
                assert(minutesToTime(0), "00:00", "0 minutes should be 00:00");
            }
        },
        {
            name: "minutesToTime — pads single digit hours",
            fn: () => {
                assert(minutesToTime(65), "01:05", "65 minutes should be 01:05 not 1:5");
            }
        },
        {
            name: "minutesToTime — end of day",
            fn: () => {
                assert(minutesToTime(1439), "23:59", "1439 minutes should be 23:59");
            }
        },
        {
            name: "minutesToTime — roundtrip with timeToMinutes",
            fn: () => {
                const original = "14:35";
                const result   = minutesToTime(timeToMinutes(original));
                assert(result, original, "roundtrip conversion should return original time");
            }
        }
    ];

    // Restore localStorage
    if (originalFormat !== null) localStorage.setItem("timeFormat", originalFormat);
    else localStorage.removeItem("timeFormat");

    return tests;
}

// ============================================
// formatTime() TESTS
// ============================================
function formatTimeTests(){
    return [
        {
            name: "formatTime — 24hr format",
            fn: () => {
                localStorage.setItem("timeFormat", "false");
                assert(formatTime("14", "30"), "14:30", "14:30 in 24hr should stay 14:30");
            }
        },
        {
            name: "formatTime — 12hr PM conversion",
            fn: () => {
                localStorage.setItem("timeFormat", "true");
                assert(formatTime("14", "30"), "2:30 PM", "14:30 in 12hr should be 2:30 PM");
            }
        },
        {
            name: "formatTime — 12hr AM conversion",
            fn: () => {
                localStorage.setItem("timeFormat", "true");
                assert(formatTime("08", "00"), "8:00 AM", "08:00 in 12hr should be 8:00 AM");
            }
        },
        {
            name: "formatTime — midnight in 12hr",
            fn: () => {
                localStorage.setItem("timeFormat", "true");
                assert(formatTime("00", "00"), "12:00 AM", "00:00 in 12hr should be 12:00 AM");
            }
        },
        {
            name: "formatTime — noon in 12hr",
            fn: () => {
                localStorage.setItem("timeFormat", "true");
                assert(formatTime("12", "00"), "12:00 PM", "12:00 in 12hr should be 12:00 PM");
            }
        }
    ];
}

// ============================================
// calculateFastingWindow() TESTS
// ============================================
function calculateFastingWindowTests(){
    return [
        {
            name: "calculateFastingWindow — standard 16:8",
            fn: () => {
                // Wake 08:00 (480), Sleep 00:00 (1440)
                // Breakfast 08:30, Stop eating 22:00
                // Eating window = 13.5hrs, Fasting = 10.5hrs
                const result = calculateFastingWindow(480, 1440);
                assertTruthy(result.eatingHrs >= 0, "eating hours should be positive");
                assertTruthy(result.fastingHrs >= 0, "fasting hours should be positive");
                assert(
                    result.eatingHrs + result.fastingHrs,
                    24,
                    "eating + fasting should equal 24 hours"
                );
            }
        },
        {
            name: "calculateFastingWindow — short window",
            fn: () => {
                // Wake 08:00 (480), Sleep 10:00 (600) — 2hr window
                const result = calculateFastingWindow(480, 600);
                assertTruthy(result.eatingHrs >= 0, "eating hours should not be negative");
                assertTruthy(result.fastingHrs >= 0, "fasting hours should not be negative");
            }
        },
        {
            name: "calculateFastingWindow — returns protocol string",
            fn: () => {
                const result = calculateFastingWindow(480, 1440);
                assertTruthy(result.protocol.includes(":"), "protocol should contain colon");
            }
        },
        {
            name: "calculateFastingWindow — eating never exceeds 24hrs",
            fn: () => {
                const result = calculateFastingWindow(480, 1440);
                assertRange(result.eatingHrs, 0, 24, "eating hours should be 0-24");
            }
        },
        {
            name: "calculateFastingWindow — fasting never exceeds 24hrs",
            fn: () => {
                const result = calculateFastingWindow(480, 1440);
                assertRange(result.fastingHrs, 0, 24, "fasting hours should be 0-24");
            }
        }
    ];
}

// ============================================
// buildMeals() TESTS
// ============================================
function buildMealsTests(){
    // Mock localStorage values for testing
    const mockCal = {
        breakfast: 600, snack: 200, lunch: 500,
        dinner: 400, preWorkoutMeal: 300,
        preWorkoutSnack: 150, postWorkout: 300, preSleep: 150
    };

    return [
        {
            name: "buildMeals — returns array",
            fn: () => {
                const meals = buildMeals(480, 1440, mockCal, "energy");
                assertTruthy(Array.isArray(meals), "buildMeals should return an array");
            }
        },
        {
            name: "buildMeals — all meals within wake/sleep window",
            fn: () => {
                const wakeMinutes  = 480;
                const sleepMinutes = 1440;
                const meals        = buildMeals(wakeMinutes, sleepMinutes, mockCal, "energy");
                meals.forEach(meal => {
                    assertTruthy(
                        meal.sortTime >= wakeMinutes && meal.sortTime <= sleepMinutes,
                        `${meal.label} at ${meal.sortTime} is outside wake/sleep window`
                    );
                });
            }
        },
        {
            name: "buildMeals — short window returns fewer meals",
            fn: () => {
                const shortMeals = buildMeals(480, 600, mockCal, "energy");  // 2hr window
                const fullMeals  = buildMeals(480, 1440, mockCal, "energy"); // 16hr window
                assertTruthy(
                    shortMeals.length < fullMeals.length,
                    "short window should have fewer meals than full window"
                );
            }
        },
        {
            name: "buildMeals — meals are sorted by time",
            fn: () => {
                const meals = buildMeals(480, 1440, mockCal, "energy");
                for (let i = 1; i < meals.length; i++){
                    assertTruthy(
                        meals[i].sortTime >= meals[i-1].sortTime,
                        `Meal ${meals[i].label} should come after ${meals[i-1].label}`
                    );
                }
            }
        },
        {
            name: "buildMeals — each meal has required properties",
            fn: () => {
                const meals = buildMeals(480, 1440, mockCal, "energy");
                meals.forEach(meal => {
                    assertTruthy(meal.label,       `meal missing label`);
                    assertTruthy(meal.sortTime >= 0, `meal missing sortTime`);
                    assertTruthy(meal.type,        `meal missing type`);
                    assertTruthy(meal.description, `meal missing description`);
                });
            }
        },
        {
            name: "buildMeals — lose goal has earlier stop eating",
            fn: () => {
                const loseMeals   = buildMeals(480, 1440, mockCal, "lose");
                const energyMeals = buildMeals(480, 1440, mockCal, "energy");
                const loseStop    = loseMeals.find(m => m.label === "🎑 Stop Eating");
                const energyStop  = energyMeals.find(m => m.label === "🎑 Stop Eating");
                if (loseStop && energyStop){
                    assertTruthy(
                        loseStop.sortTime <= energyStop.sortTime,
                        "lose weight goal should stop eating earlier"
                    );
                }
            }
        },
        {
            name: "buildMeals — very short window returns single meal",
            fn: () => {
                const meals = buildMeals(480, 510, mockCal, "energy"); // 30min window
                assertTruthy(meals.length <= 2, "very short window should have at most 2 meals");
            }
        }
    ];
}

// ============================================
// calculateTDEE() TESTS
// ============================================
function calculateTDEETests(){
    // Save current localStorage
    const saved = {
        profileToggle: localStorage.getItem("profileToggle"),
        age:           localStorage.getItem("age"),
        weight:        localStorage.getItem("weight"),
        height:        localStorage.getItem("height"),
        sex:           localStorage.getItem("sex"),
        goal:          localStorage.getItem("goal"),
        activity:      localStorage.getItem("activity"),
        extraCalories: localStorage.getItem("extraCalories")
    };

    const tests = [
        {
            name: "calculateTDEE — returns null when profile disabled",
            fn: () => {
                localStorage.setItem("profileToggle", "false");
                assert(calculateTDEE(), null, "should return null when profile disabled");
            }
        },
        {
            name: "calculateTDEE — returns null when missing data",
            fn: () => {
                localStorage.setItem("profileToggle", "true");
                localStorage.removeItem("age");
                localStorage.removeItem("weight");
                localStorage.removeItem("height");
                assert(calculateTDEE(), null, "should return null when age/weight/height missing");
            }
        },
        {
            name: "calculateTDEE — returns object with required fields",
            fn: () => {
                localStorage.setItem("profileToggle", "true");
                localStorage.setItem("age",      "25");
                localStorage.setItem("weight",   "70");
                localStorage.setItem("height",   "175");
                localStorage.setItem("sex",      "male");
                localStorage.setItem("goal",     "maintain");
                localStorage.setItem("activity", "1.55");
                localStorage.setItem("extraCalories", "0");

                const result = calculateTDEE();
                assertTruthy(result !== null,        "should return object");
                assertTruthy(result.bmr > 0,         "BMR should be positive");
                assertTruthy(result.tdee > 0,        "TDEE should be positive");
                assertTruthy(result.target > 0,      "target should be positive");
                assertTruthy(result.maintenance > 0, "maintenance should be positive");
            }
        },
        {
            name: "calculateTDEE — male BMR is reasonable",
            fn: () => {
                localStorage.setItem("profileToggle", "true");
                localStorage.setItem("age",    "25");
                localStorage.setItem("weight", "70");
                localStorage.setItem("height", "175");
                localStorage.setItem("sex",    "male");
                localStorage.setItem("activity", "1.2");
                localStorage.setItem("extraCalories", "0");
                localStorage.setItem("goal", "maintain");

                const result = calculateTDEE();
                // Mifflin St-Jeor for 25yo, 70kg, 175cm male ≈ 1724 BMR
                assertRange(result.bmr, 1500, 2000, "Male BMR should be between 1500-2000");
            }
        },
        {
            name: "calculateTDEE — female BMR is lower than male",
            fn: () => {
                localStorage.setItem("profileToggle", "true");
                localStorage.setItem("age",    "25");
                localStorage.setItem("weight", "70");
                localStorage.setItem("height", "175");
                localStorage.setItem("activity", "1.2");
                localStorage.setItem("extraCalories", "0");
                localStorage.setItem("goal", "maintain");

                localStorage.setItem("sex", "male");
                const maleTDEE = calculateTDEE();

                localStorage.setItem("sex", "female");
                const femaleTDEE = calculateTDEE();

                assertTruthy(
                    maleTDEE.bmr > femaleTDEE.bmr,
                    "Male BMR should be higher than female BMR for same stats"
                );
            }
        },
        {
            name: "calculateTDEE — lose goal reduces target by 500",
            fn: () => {
                localStorage.setItem("profileToggle", "true");
                localStorage.setItem("age",    "25");
                localStorage.setItem("weight", "70");
                localStorage.setItem("height", "175");
                localStorage.setItem("sex",    "male");
                localStorage.setItem("activity", "1.2");
                localStorage.setItem("extraCalories", "0");

                localStorage.setItem("goal", "maintain");
                const maintain = calculateTDEE();

                localStorage.setItem("goal", "lose");
                const lose = calculateTDEE();

                assert(
                    maintain.target - lose.target,
                    500,
                    "Lose goal should reduce target by exactly 500 kcal"
                );
            }
        },
        {
            name: "calculateTDEE — muscle goal increases target by 300",
            fn: () => {
                localStorage.setItem("profileToggle", "true");
                localStorage.setItem("age",    "25");
                localStorage.setItem("weight", "70");
                localStorage.setItem("height", "175");
                localStorage.setItem("sex",    "male");
                localStorage.setItem("activity", "1.2");
                localStorage.setItem("extraCalories", "0");

                localStorage.setItem("goal", "maintain");
                const maintain = calculateTDEE();

                localStorage.setItem("goal", "muscle");
                const muscle = calculateTDEE();

                assert(
                    muscle.target - maintain.target,
                    300,
                    "Muscle goal should increase target by exactly 300 kcal"
                );
            }
        },
        {
            name: "calculateTDEE — extra calories added to target",
            fn: () => {
                localStorage.setItem("profileToggle", "true");
                localStorage.setItem("age",    "25");
                localStorage.setItem("weight", "70");
                localStorage.setItem("height", "175");
                localStorage.setItem("sex",    "male");
                localStorage.setItem("activity", "1.2");
                localStorage.setItem("goal",   "maintain");

                localStorage.setItem("extraCalories", "0");
                const withoutExtra = calculateTDEE();

                localStorage.setItem("extraCalories", "300");
                const withExtra = calculateTDEE();

                assert(
                    withExtra.target - withoutExtra.target,
                    300,
                    "Extra calories should be added to target"
                );
            }
        }
    ];

    // Restore localStorage
    Object.keys(saved).forEach(key => {
        if (saved[key] !== null) localStorage.setItem(key, saved[key]);
        else localStorage.removeItem(key);
    });

    return tests;
}

// ============================================
// getDailyMacroTargets() TESTS
// ============================================
function getDailyMacroTargetsTests(){
    return [
        {
            name: "getDailyMacroTargets — returns positive values",
            fn: () => {
                const result = getDailyMacroTargets(2000, "energy", false, 70);
                assertTruthy(result.dailyProteinTarget > 0, "protein should be positive");
                assertTruthy(result.dailyCarbsTarget > 0,   "carbs should be positive");
                assertTruthy(result.dailyFatTarget > 0,     "fat should be positive");
            }
        },
        {
            name: "getDailyMacroTargets — muscle goal has more protein than energy",
            fn: () => {
                const muscle = getDailyMacroTargets(2000, "muscle", false, 70);
                const energy = getDailyMacroTargets(2000, "energy", false, 70);
                assertTruthy(
                    muscle.dailyProteinTarget > energy.dailyProteinTarget,
                    "muscle goal should have more protein than energy goal"
                );
            }
        },
        {
            name: "getDailyMacroTargets — exercise increases protein",
            fn: () => {
                const withExercise    = getDailyMacroTargets(2000, "energy", true,  70);
                const withoutExercise = getDailyMacroTargets(2000, "energy", false, 70);
                assertTruthy(
                    withExercise.dailyProteinTarget > withoutExercise.dailyProteinTarget,
                    "exercise should increase protein target"
                );
            }
        },
        {
            name: "getDailyMacroTargets — protein reasonable for 70kg person",
            fn: () => {
                const result = getDailyMacroTargets(2000, "muscle", true, 70);
                // 70kg muscle building with exercise: 70 × 2.4 = 168g max
                assertRange(
                    result.dailyProteinTarget,
                    100, 200,
                    "protein for 70kg muscle builder should be 100-200g"
                );
            }
        },
        {
            name: "getDailyMacroTargets — total macros dont wildly exceed TDEE",
            fn: () => {
                const tdee   = 2000;
                const result = getDailyMacroTargets(tdee, "muscle", false, 70);
                const totalCal =
                    (result.dailyProteinTarget * 4) +
                    (result.dailyCarbsTarget * 4) +
                    (result.dailyFatTarget * 9);
                // Allow 10% variance due to rounding
                assertRange(
                    totalCal,
                    tdee * 0.85,
                    tdee * 1.15,
                    "total macro calories should be within 15% of TDEE"
                );
            }
        }
    ];
}

// ============================================
// COMPLIANCE TESTS
// ============================================
function complianceTests(){
    return [
        {
            name: "getTodayKey — returns date string",
            fn: () => {
                const key = getTodayKey();
                assertTruthy(typeof key === "string", "getTodayKey should return string");
                assertTruthy(key.includes("-"), "date key should contain dashes");
            }
        },
        {
            name: "getTodayKey — format is YYYY-M-D",
            fn: () => {
                const key   = getTodayKey();
                const parts = key.split("-");
                assert(parts.length, 3, "date key should have 3 parts");
                assertTruthy(parseInt(parts[0]) > 2020, "year should be after 2020");
            }
        },
        {
            name: "getComplianceData — returns object",
            fn: () => {
                const data = getComplianceData();
                assertTruthy(typeof data === "object", "compliance data should be object");
            }
        },
        {
            name: "markMeal — saves meal to today",
            fn: () => {
                const today    = getTodayKey();
                const testMeal = "🧪 Test Meal";

                markMeal(testMeal, true);
                const data = getComplianceData();
                assert(data[today][testMeal], true, "meal should be marked as true");

                markMeal(testMeal, false);
                const data2 = getComplianceData();
                assert(data2[today][testMeal], false, "meal should be marked as false");

                // Cleanup
                const cleanData = getComplianceData();
                delete cleanData[today][testMeal];
                saveComplianceData(cleanData);
            }
        },
        {
            name: "calculateStreak — returns number",
            fn: () => {
                const streak = calculateStreak();
                assertTruthy(typeof streak === "number", "streak should be a number");
                assertTruthy(streak >= 0, "streak should be non-negative");
            }
        },
        {
            name: "calculateBestStreak — returns number >= current streak",
            fn: () => {
                const current = calculateStreak();
                const best    = calculateBestStreak();
                assertTruthy(best >= current, "best streak should be >= current streak");
            }
        }
    ];
}

// ============================================
// EDGE CASE TESTS
// ============================================
function edgeCaseTests(){
    return [
        {
            name: "timeToMinutes — handles midnight next day",
            fn: () => {
                // Sleep at midnight = 0 minutes
                // Should be treated as end of day (1440) when sleep < wake
                const wake  = timeToMinutes("08:00"); // 480
                let sleep   = timeToMinutes("00:00"); // 0
                if (sleep < wake) sleep += 1440;
                assert(sleep, 1440, "midnight sleep should become 1440 when after wake time");
            }
        },
        {
            name: "minutesToTime — handles over 24hrs gracefully",
            fn: () => {
                localStorage.setItem("timeFormat", "false");
                // 1500 minutes = 25 hours = should wrap to 01:00
                assert(minutesToTime(1500), "01:00", "1500 minutes should wrap to 01:00");
            }
        },
        {
            name: "buildMeals — handles null calories gracefully",
            fn: () => {
                const nullCal = {
                    breakfast: null, snack: null, lunch: null,
                    dinner: null, preWorkoutMeal: null,
                    preWorkoutSnack: null, postWorkout: null, preSleep: null
                };
                const meals = buildMeals(480, 1440, nullCal, "energy");
                assertTruthy(Array.isArray(meals), "should handle null calories without crashing");
            }
        },
        {
            name: "buildMeals — all goals produce valid meals",
            fn: () => {
                const mockCal = {
                    breakfast: 600, snack: 200, lunch: 500,
                    dinner: 400, preWorkoutMeal: 300,
                    preWorkoutSnack: 150, postWorkout: 300, preSleep: 150
                };
                ["lose", "energy", "sleep", "muscle"].forEach(goal => {
                    const meals = buildMeals(480, 1440, mockCal, goal);
                    assertTruthy(meals.length > 0, `${goal} goal should produce meals`);
                });
            }
        },
        {
            name: "fasting window — eating + fasting always equals 24",
            fn: () => {
                const scenarios = [
                    { wake: 480,  sleep: 1440 }, // 08:00 - 00:00
                    { wake: 360,  sleep: 1380 }, // 06:00 - 23:00
                    { wake: 600,  sleep: 1320 }, // 10:00 - 22:00
                    { wake: 480,  sleep: 960  }, // 08:00 - 16:00
                ];
                scenarios.forEach(({ wake, sleep }) => {
                    const result = calculateFastingWindow(wake, sleep);
                    assert(
                        result.eatingHrs + result.fastingHrs,
                        24,
                        `eating(${result.eatingHrs}) + fasting(${result.fastingHrs}) should = 24`
                    );
                });
            }
        },
        {
            name: "getMealKey — returns null for unknown meal",
            fn: () => {
                assert(getMealKey("🦄 Unknown Meal"), null, "unknown meal should return null");
            }
        },
        {
            name: "getMealKey — maps all known meals",
            fn: () => {
                const knownMeals = [
                    "🌅 Breakfast",
                    "🍿 Snack",
                    "🫐 Afternoon Snack",
                    "☀️ Lunch",
                    "🌄 Dinner",
                    "🎑 Stop Eating",
                    "🍽️ Pre-workout meal",
                    "⚡ Pre-workout snack",
                    "💪 Post workout",
                    "🌙 Pre sleep"
                ];
                knownMeals.forEach(meal => {
                    assertTruthy(
                        getMealKey(meal) !== null,
                        `${meal} should have a valid key mapping`
                    );
                });
            }
        }
    ];
}