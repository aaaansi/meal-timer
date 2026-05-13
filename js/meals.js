const foodSuggestions = {
    breakfast: {
        lose: {
            eat:   [
                "🥚 Scrambled eggs (high protein, keeps you full)",
                "🥛 Greek yogurt with berries (protein + antioxidants)",
                "🧀 Cottage cheese (slow digesting protein)",
                "🦃 Turkey slices (lean protein, zero carbs)",
                "🥑 Avocado + eggs (healthy fats + protein)"
            ],
            avoid: [
                "🥐 Pastries and croissants (high sugar, spikes insulin)",
                "🧃 Fruit juice (liquid sugar, no fibre)",
                "🥣 Sugary cereals (crashes energy fast)",
                "🍞 White toast (refined carbs, low satiety)",
                "🧇 Waffles and pancakes with syrup"
            ]
        },
        energy: {
            eat:   [
                "🌾 Oats with banana and honey (slow release energy)",
                "🍳 Eggs on whole grain toast (carbs + protein)",
                "🥛 Greek yogurt + granola + berries",
                "🥤 Protein smoothie with oats and fruit",
                "🌰 Whole grain cereal with milk and nuts"
            ],
            avoid: [
                "🥐 Pastries (energy crash within 1-2 hours)",
                "🧃 Fruit juice (sugar spike without fibre)",
                "🥣 Sugary cereals (poor sustained energy)",
                "☕ Coffee only — always pair with food",
                "🍩 Donuts or muffins (refined sugar)"
            ]
        },
        sleep: {
            eat:   [
                "🌾 Oats (contains melatonin precursors)",
                "🥛 Warm milk with oats (tryptophan rich)",
                "🍌 Banana with nut butter (magnesium + tryptophan)",
                "🥚 Eggs on whole grain toast (balanced, not heavy)",
                "🫐 Greek yogurt with berries (light and nutritious)"
            ],
            avoid: [
                "☕ High caffeine foods or drinks",
                "🧃 Sugary juices (blood sugar instability affects sleep)",
                "🍩 Heavy fried foods (digestive burden)",
                "🌶️ Spicy foods (raises core temperature)",
                "🥐 Refined carbs (disrupts circadian rhythm)"
            ]
        },
        muscle: {
            eat:   [
                "🥚 4-5 eggs scrambled (complete amino acid profile)",
                "🌾 Oats + whey protein (carbs + fast protein)",
                "🥛 Greek yogurt + granola + banana (protein + carbs)",
                "🍗 Chicken + sweet potato hash (lean protein + complex carbs)",
                "🥤 Mass gainer shake if bulking"
            ],
            avoid: [
                "🥐 Pastries (empty calories, no muscle building value)",
                "🧃 Fruit juice only (insufficient protein)",
                "🍩 Donuts (high fat, high sugar, no protein)",
                "🥣 Low protein cereals",
                "☕ Skipping food entirely — muscles need morning protein"
            ]
        }
    },
    snack: {
        lose: {
            eat:   [
                "🥛 Greek yogurt plain (high protein, low sugar)",
                "🥚 Hard boiled eggs (protein, zero carbs)",
                "🧀 Cottage cheese (filling, low calorie)",
                "🥒 Cucumber + hummus (fibre + protein)",
                "🌰 Small handful of almonds (healthy fats, filling)"
            ],
            avoid: [
                "🍫 Chocolate bars (high sugar, high calorie)",
                "🍪 Biscuits and cookies (refined carbs)",
                "🥤 Energy drinks (sugar spike and crash)",
                "🍟 Crisps (empty calories, addictive)",
                "🧃 Fruit juice (liquid calories)"
            ]
        },
        energy: {
            eat:   [
                "🍎 Apple with almond butter (fibre + healthy fat)",
                "🌰 Mixed nuts and dried fruit (sustained energy)",
                "🥛 Greek yogurt with honey (protein + quick carbs)",
                "🍌 Banana (fast acting natural sugars)",
                "🧀 Cheese and whole grain crackers"
            ],
            avoid: [
                "🍫 Chocolate bars (energy spike then crash)",
                "🥤 Energy drinks (jittery energy, poor quality)",
                "🍪 Biscuits (fast carbs, no sustained energy)",
                "🍟 Crisps (fat + salt, no energy value)",
                "🧃 Sugary drinks"
            ]
        },
        sleep: {
            eat:   [
                "🍒 Tart cherries (natural melatonin source)",
                "🌰 Walnuts (melatonin + omega 3)",
                "🥛 Small glass of warm milk (tryptophan)",
                "🍌 Banana (magnesium + tryptophan)",
                "🫐 Blueberries (antioxidants, anti-inflammatory)"
            ],
            avoid: [
                "☕ Caffeine in any form",
                "🍫 Dark chocolate (contains caffeine)",
                "🥤 Energy drinks",
                "🍟 Salty snacks (raises blood pressure)",
                "🍪 Sugary snacks (blood sugar instability)"
            ]
        },
        muscle: {
            eat:   [
                "🥛 Protein shake (fast muscle protein synthesis)",
                "🧀 Cottage cheese + fruit (casein + carbs)",
                "🥚 Hard boiled eggs (complete protein)",
                "🌰 Mixed nuts + Greek yogurt (protein + healthy fats)",
                "🍗 Chicken strips (lean complete protein)"
            ],
            avoid: [
                "🍫 Chocolate (insufficient protein)",
                "🍪 Biscuits (empty carbs no protein)",
                "🥤 Sugary drinks (no muscle building value)",
                "🍟 Crisps (fat + salt, no protein)",
                "🍩 Pastries (no muscle building value)"
            ]
        }
    },
    lunch: {
        lose: {
            eat:   [
                "🥗 Large salad with grilled chicken (high volume, low calorie)",
                "🐟 Salmon + steamed vegetables (omega 3 + protein)",
                "🍗 Grilled chicken + roasted vegetables (lean protein)",
                "🥙 Turkey wrap in whole grain (balanced macros)",
                "🫘 Lentil soup (fibre + plant protein, very filling)"
            ],
            avoid: [
                "🍔 Burgers (high calorie, high fat)",
                "🍕 Pizza (refined carbs + high fat)",
                "🍝 Creamy pasta (high calorie density)",
                "🌯 Mayo heavy wraps",
                "🍟 Anything fried"
            ]
        },
        energy: {
            eat:   [
                "🍗 Chicken + brown rice + vegetables (balanced macros)",
                "🐟 Tuna salad on whole grain bread",
                "🥗 Buddha bowl with quinoa + chickpeas + avocado",
                "🥙 Grilled wrap with lean meat + salad",
                "🫘 Bean and vegetable soup + whole grain roll"
            ],
            avoid: [
                "🍔 Heavy burgers (post-lunch energy crash)",
                "🍝 Heavy pasta dishes (blood sugar spike)",
                "🍕 Pizza (high fat, causes afternoon sluggishness)",
                "🍟 Fried foods (digestive burden)",
                "🥤 Sugary drinks with lunch"
            ]
        },
        sleep: {
            eat:   [
                "🐟 Salmon + sweet potato (tryptophan + complex carbs)",
                "🍗 Turkey + brown rice (tryptophan rich)",
                "🥗 Salad with tuna + whole grain bread",
                "🫘 Lentil and vegetable stew",
                "🥙 Hummus + vegetable wrap"
            ],
            avoid: [
                "🌶️ Very spicy foods (raises body temperature)",
                "☕ Caffeinated drinks with lunch",
                "🍔 Heavy greasy meals (digestive burden)",
                "🍺 Alcohol (fragments sleep architecture)",
                "🍝 Heavy creamy sauces"
            ]
        },
        muscle: {
            eat:   [
                "🍗 Chicken breast + white rice + broccoli (classic bulk meal)",
                "🥩 Lean beef + sweet potato + salad",
                "🐟 Salmon + quinoa + vegetables (omega 3 + complete protein)",
                "🥚 Omelette with cheese + whole grain toast + fruit",
                "🫘 High protein bean bowl with chicken"
            ],
            avoid: [
                "🥗 Salad only (insufficient calories for muscle growth)",
                "🍕 Pizza (poor macro split for muscle building)",
                "🍔 Fast food burgers (bad fats, processed)",
                "🍟 Fried foods (inflammation)",
                "🥤 Sugary drinks (insulin spike at wrong time)"
            ]
        }
    },
    dinner: {
        lose: {
            eat:   [
                "🐟 White fish + steamed vegetables (very low calorie, high protein)",
                "🥗 Large salad with grilled protein",
                "🍗 Grilled chicken + roasted broccoli + cauliflower",
                "🦐 Stir fried prawns + vegetables (no rice)",
                "🥚 Vegetable omelette (light, high protein)"
            ],
            avoid: [
                "🍝 Pasta (high carbs before bed = fat storage)",
                "🍕 Pizza (high calorie, high fat)",
                "🍚 Large portions of rice or bread",
                "🍔 Burgers (high calorie density)",
                "🍷 Alcohol (stops fat burning for hours)"
            ]
        },
        energy: {
            eat:   [
                "🍗 Grilled chicken + sweet potato + greens",
                "🐟 Salmon + quinoa + roasted vegetables",
                "🥩 Lean steak + salad + small portion of rice",
                "🫘 Bean stew with vegetables",
                "🥚 Frittata with vegetables and cheese"
            ],
            avoid: [
                "🍝 Heavy pasta (sluggish next morning)",
                "🍷 Alcohol (disrupts sleep and next day energy)",
                "🍔 Fast food (poor recovery nutrition)",
                "🍟 Fried foods",
                "🍕 Pizza (too heavy for evening)"
            ]
        },
        sleep: {
            eat:   [
                "🦃 Turkey + sweet potato (tryptophan + complex carbs = melatonin boost)",
                "🐟 Salmon + brown rice (omega 3 improves sleep quality)",
                "🥛 Warm milk based dish (tryptophan rich)",
                "🍗 Chicken + vegetables + small portion of rice",
                "🫘 Chickpea curry (light, tryptophan rich)"
            ],
            avoid: [
                "🍷 Alcohol (suppresses REM sleep)",
                "☕ Any caffeine",
                "🌶️ Spicy foods (raises core temp, delays sleep)",
                "🍔 High fat meals (slow digestion disrupts sleep)",
                "🍫 Chocolate (contains caffeine + sugar)"
            ]
        },
        muscle: {
            eat:   [
                "🥩 Lean steak + sweet potato + broccoli (complete muscle meal)",
                "🍗 Chicken thigh + rice + salad (protein + carbs for recovery)",
                "🐟 Salmon + quinoa + asparagus (omega 3 reduces muscle soreness)",
                "🥚 Whole egg omelette + sweet potato",
                "🫘 High protein bean bowl with lean meat"
            ],
            avoid: [
                "🍷 Alcohol (blocks muscle protein synthesis)",
                "🍟 Fried foods (inflammation slows recovery)",
                "🍕 Pizza (poor macro split)",
                "🍔 Fast food (processed, inflammatory)",
                "🍝 Heavy cream pasta (too much fat, insufficient protein)"
            ]
        }
    },
    stop: {
        lose: {
            eat:   [
                "💧 Water or herbal tea only",
                "🍵 Chamomile tea (calming, zero calories)",
                "🫖 Peppermint tea (suppresses appetite)",
                "💧 Sparkling water if hungry"
            ],
            avoid: [
                "🍫 Any snacks (breaks fat burning window)",
                "🍷 Alcohol (stops fat burning entirely)",
                "🧃 Any juice or sugary drinks",
                "🍪 Biscuits or chocolate",
                "🥜 Even healthy snacks — stay strong!"
            ]
        },
        energy: {
            eat:   [
                "💧 Water or herbal tea",
                "🍵 Chamomile or valerian tea (promotes sleep)",
                "🫖 Peppermint tea"
            ],
            avoid: [
                "☕ Caffeine in any form",
                "🍫 Chocolate (stimulating)",
                "🍷 Alcohol (disrupts sleep quality)",
                "🧃 Sugary drinks (blood sugar spike before bed)",
                "🍪 Any heavy snacks"
            ]
        },
        sleep: {
            eat:   [
                "🍵 Chamomile tea (proven sleep aid)",
                "🫖 Valerian root tea (reduces sleep latency)",
                "💧 Water — stay hydrated",
                "🍵 Passionflower tea (reduces anxiety before sleep)"
            ],
            avoid: [
                "☕ Any caffeine — even decaf has some",
                "🍷 Alcohol (fragments deep sleep)",
                "🍫 Chocolate (caffeine + sugar)",
                "🌶️ Spicy foods (raises core temperature)",
                "🍔 Any heavy foods (active digestion = poor sleep)"
            ]
        },
        muscle: {
            eat:   [
                "💧 Water to stay hydrated for overnight recovery",
                "🍵 Herbal tea",
                "🫖 Tart cherry juice (reduces muscle soreness)"
            ],
            avoid: [
                "🍷 Alcohol (blocks growth hormone and muscle synthesis)",
                "☕ Caffeine (disrupts sleep = disrupts muscle recovery)",
                "🍔 Heavy meals (digestion competes with recovery)",
                "🍫 Chocolate",
                "🧃 Sugary drinks"
            ]
        }
    },
    preWorkoutMeal: {
        lose: {
            eat:   [
                "🌾 Oats + banana (slow release energy without excess calories)",
                "🍗 Chicken + sweet potato (lean protein + complex carbs)",
                "🥛 Greek yogurt + granola (protein + carbs)",
                "🍳 Eggs on whole grain toast",
                "🥙 Turkey wrap (lean protein + carbs)"
            ],
            avoid: [
                "🍔 Heavy high fat meals (slows you down)",
                "🍝 Creamy pasta (too heavy for training)",
                "🍟 Fried foods (poor performance fuel)",
                "🍷 Alcohol",
                "🧁 Sugary baked goods (energy crash mid workout)"
            ]
        },
        energy: {
            eat:   [
                "🌾 Oats with berries and honey (optimal glycogen loading)",
                "🍗 Chicken + rice (classic pre workout meal)",
                "🥛 Greek yogurt + granola + banana",
                "🥙 Whole grain wrap with lean protein",
                "🍳 Eggs + whole grain toast + fruit"
            ],
            avoid: [
                "🍔 Heavy burgers (digestive burden during exercise)",
                "🍝 Heavy pasta (too much fat slows absorption)",
                "🍟 Fried foods (poor exercise fuel)",
                "🥑 Too much fat (slows gastric emptying)",
                "🍷 Alcohol"
            ]
        },
        sleep: {
            eat:   [
                "🌾 Oats + banana (won't disrupt evening sleep)",
                "🍗 Chicken + rice (easily digestible)",
                "🥛 Greek yogurt + granola",
                "🥙 Light wrap with lean protein",
                "🍳 Eggs on toast"
            ],
            avoid: [
                "🌶️ Spicy foods (raises body temperature)",
                "🍝 Heavy creamy meals (slow digestion)",
                "🍟 Fried foods",
                "🍷 Alcohol",
                "☕ High caffeine pre workout supplements late in day"
            ]
        },
        muscle: {
            eat:   [
                "🌾 Oats + whey protein + banana (glycogen + protein)",
                "🍗 Chicken breast + white rice + broccoli",
                "🥛 Greek yogurt + granola + protein shake",
                "🥩 Lean steak + sweet potato (creatine naturally in beef)",
                "🍳 4-5 eggs + whole grain toast + fruit"
            ],
            avoid: [
                "🥗 Salad only (insufficient fuel for heavy training)",
                "🍔 Fast food (inflammatory, poor performance)",
                "🍟 Fried foods",
                "🍷 Alcohol",
                "🧁 Sugary foods only (no protein = muscle breakdown)"
            ]
        }
    },
    preWorkoutSnack: {
        lose: {
            eat:   [
                "🍌 Banana (fast carbs, easy to digest)",
                "🍚 Rice cakes with honey (quick fuel)",
                "🧃 Small fruit smoothie",
                "🍇 Handful of grapes or dates",
                "🥛 Small glass of chocolate milk"
            ],
            avoid: [
                "🥑 Avocado (too much fat slows you down)",
                "🌰 Nuts (too much fat for immediate energy)",
                "🧀 Cheese (slow digesting fat + protein)",
                "🍔 Any heavy food",
                "🍟 Fried food"
            ]
        },
        energy: {
            eat:   [
                "🍌 Banana (optimal pre workout carb source)",
                "🍚 Rice cakes with honey or jam",
                "🧃 Fresh fruit juice or smoothie",
                "🍇 Dates (fast energy, easy to digest)",
                "🌾 Small bowl of oats"
            ],
            avoid: [
                "🥑 High fat foods (slow energy release)",
                "🌰 Nuts (fat slows absorption)",
                "🧀 Dairy heavy foods",
                "🍔 Any solid heavy meal",
                "🍟 Anything fried"
            ]
        },
        sleep: {
            eat:   [
                "🍌 Banana (quick fuel, won't disrupt sleep later)",
                "🍚 Rice cakes",
                "🍇 Small portion of grapes",
                "🧃 Small fruit smoothie",
                "🌾 Small oat snack"
            ],
            avoid: [
                "☕ High caffeine pre workout",
                "🌶️ Spicy snacks",
                "🍫 Dark chocolate (caffeine)",
                "🥤 Energy drinks (will affect sleep)",
                "🍔 Heavy food"
            ]
        },
        muscle: {
            eat:   [
                "🍌 Banana + small protein shake (carbs + protein)",
                "🍚 Rice cakes + peanut butter",
                "🧃 Fruit smoothie + scoop of protein",
                "🍇 Dates + Greek yogurt",
                "🌾 Oats + honey + protein powder"
            ],
            avoid: [
                "🥑 Too much fat (slows protein absorption)",
                "🌰 Large amounts of nuts",
                "🧀 Heavy dairy",
                "🍔 Any large meal",
                "🍟 Fried food"
            ]
        }
    },
    postWorkout: {
        lose: {
            eat:   [
                "🥛 Protein shake + banana (fast recovery, controlled calories)",
                "🍗 Grilled chicken + small portion of rice",
                "🥚 Eggs + whole grain toast",
                "🧀 Cottage cheese + fruit",
                "🥛 Greek yogurt + berries"
            ],
            avoid: [
                "🍔 Fast food (inflammatory, poor recovery)",
                "🍷 Alcohol (blocks fat burning and recovery)",
                "🍟 Fried foods",
                "🍕 Pizza",
                "🍩 Donuts or pastries (poor recovery nutrition)"
            ]
        },
        energy: {
            eat:   [
                "🌾 Oats + protein shake (glycogen + muscle repair)",
                "🍗 Chicken + rice + vegetables (complete recovery meal)",
                "🥛 Chocolate milk (carb:protein ratio is ideal)",
                "🥛 Greek yogurt + granola + banana",
                "🥚 Eggs on whole grain toast + fruit"
            ],
            avoid: [
                "🍷 Alcohol (impairs glycogen resynthesis)",
                "🍔 Fast food (inflammatory)",
                "🍟 Fried foods",
                "🍩 Pastries (poor nutrient density)",
                "🧃 Juice only (no protein for muscle repair)"
            ]
        },
        sleep: {
            eat:   [
                "🍗 Chicken + sweet potato (tryptophan + complex carbs)",
                "🥛 Protein shake + banana",
                "🐟 Salmon + quinoa (omega 3 reduces soreness)",
                "🥚 Eggs + whole grain toast",
                "🧀 Cottage cheese + fruit"
            ],
            avoid: [
                "🍷 Alcohol (worst thing for sleep + recovery combined)",
                "☕ Caffeine",
                "🌶️ Spicy foods",
                "🍔 Heavy fatty meals",
                "🍟 Fried foods"
            ]
        },
        muscle: {
            eat:   [
                "🥛 Whey protein shake + banana (fastest muscle synthesis)",
                "🍗 Chicken breast + white rice (fast digesting carbs + protein)",
                "🥛 Chocolate milk (scientifically proven recovery drink)",
                "🥚 4-5 eggs + white rice",
                "🥩 Lean beef + potato (creatine + carbs)"
            ],
            avoid: [
                "🍷 Alcohol (directly blocks muscle protein synthesis)",
                "🍔 Fast food (inflammatory, poor amino acid profile)",
                "🍟 Fried foods (inflammation)",
                "🍩 Pastries (no muscle building nutrition)",
                "🧃 Juice only (insufficient protein)"
            ]
        }
    },
    preSleep: {
        lose: {
            eat:   [
                "🧀 Cottage cheese (slow casein protein, very low calorie)",
                "🥛 Small Greek yogurt plain (protein without excess calories)",
                "🥛 Casein protein shake (pure protein, minimal calories)",
                "🥚 2 hard boiled egg whites",
                "🫙 Small quark portion"
            ],
            avoid: [
                "🌾 Oats or carb heavy foods (unnecessary calories before sleep)",
                "🍫 Chocolate (caffeine + sugar)",
                "🍪 Biscuits",
                "🍷 Alcohol",
                "🍔 Any heavy meal"
            ]
        },
        energy: {
            eat:   [
                "🧀 Cottage cheese + small portion of fruit",
                "🥛 Greek yogurt with honey",
                "🥛 Casein protein shake",
                "🌰 Small handful of almonds + Greek yogurt",
                "🥛 Warm milk with cinnamon"
            ],
            avoid: [
                "☕ Caffeine",
                "🍫 Dark chocolate",
                "🍷 Alcohol",
                "🍔 Heavy meals",
                "🍪 Sugary snacks (blood sugar spike disrupts sleep)"
            ]
        },
        sleep: {
            eat:   [
                "🧀 Cottage cheese + tart cherry juice (casein + natural melatonin)",
                "🥛 Warm milk + honey (tryptophan + insulin response aids sleep)",
                "🌰 Walnuts + small Greek yogurt (melatonin + protein)",
                "🥛 Casein shake + chamomile tea",
                "🍌 Small banana + Greek yogurt (magnesium + tryptophan)"
            ],
            avoid: [
                "☕ Any caffeine",
                "🍷 Alcohol (suppresses REM sleep)",
                "🍫 Chocolate",
                "🌶️ Spicy foods",
                "🍔 Heavy meals (digestion competes with sleep)"
            ]
        },
        muscle: {
            eat:   [
                "🧀 Cottage cheese (best pre-sleep muscle food — slow casein)",
                "🥛 Casein protein shake (feeds muscles for 6-8 hours)",
                "🥛 Greek yogurt + small portion of oats",
                "🌰 Almonds + casein shake (healthy fats + slow protein)",
                "🫙 Quark with berries (European cottage cheese, high casein)"
            ],
            avoid: [
                "🍷 Alcohol (growth hormone suppression = no muscle growth overnight)",
                "🌾 Whey protein (too fast digesting for overnight use)",
                "🍫 Chocolate",
                "☕ Caffeine",
                "🍔 Heavy fatty meals (poor digestion during sleep)"
            ]
        }
    }
};

function getMealKey(label){
    const map = {
        "🌅 Breakfast":        "breakfast",
        "🍿 Snack":            "snack",
        "☀️ Lunch":            "lunch",
        "🌄 Dinner":           "dinner",
        "🎑 Stop Eating":      "stop",
        "🍽️ Pre-workout meal": "preWorkoutMeal",
        "⚡ Pre-workout snack": "preWorkoutSnack",
        "💪 Post workout":     "postWorkout",
        "🌙 Pre sleep":        "preSleep"
    };
    return map[label] || null;
}

function getFoodSuggestions(mealLabel, goal){
    const key = getMealKey(mealLabel);
    if (!key) return "";

    const suggestions = foodSuggestions[key]?.[goal];
    if (!suggestions) return "";

    const eatList   = suggestions.eat.map(f   => `<li class="food-eat">✓ ${f}</li>`).join("");
    const avoidList = suggestions.avoid.map(f => `<li class="food-avoid">✗ ${f}</li>`).join("");

    return `
        <div class="food-suggestions">
            <div class="food-section-title">💡 What to eat:</div>
            <ul class="food-list">${eatList}</ul>
            <div class="food-section-title avoid-title">⚠️ Avoid:</div>
            <ul class="food-list">${avoidList}</ul>
        </div>
    `;
}

function getDescription(meal, goal){
    const descriptions = {
        breakfast: {
            lose:   "Eat within 30 mins of waking. Keep it protein heavy to stay full longer. Eggs, Greek yogurt, or a protein shake. A strong breakfast reduces cravings all day.",
            energy: "Eat within 30 mins of waking. Focus on complex carbs + protein. Oats, eggs, whole grain toast. Biggest meal — boosts metabolism and resets your circadian clock.",
            sleep:  "Eat within 30 mins of waking. A good breakfast regulates your body clock which directly improves sleep quality at night. Don't skip this one.",
            muscle: "Eat within 30 mins of waking. High protein + carbs to kickstart muscle protein synthesis. Eggs, oats, protein shake. Your muscles have been fasting all night."
        },
        snack: {
            lose:   "Keep it very small and protein focused. Greek yogurt or a handful of nuts. Prevents blood sugar crashes that lead to overeating at lunch.",
            energy: "Strategic snack to maintain energy. Fruits, nuts, or yogurt. Avoids the mid-morning energy dip and keeps focus sharp.",
            sleep:  "Light snack only. Fruits or nuts. Keeping blood sugar stable during the day leads to better melatonin production at night.",
            muscle: "Protein focused snack. Greek yogurt, cottage cheese, or protein bar. Keeps muscle protein synthesis elevated between meals."
        },
        lunch: {
            lose:   "Your second largest meal. High protein, moderate carbs. Lean meat, salad, vegetables. Insulin sensitivity is good at midday — better time for carbs than evening.",
            energy: "Balanced macros — protein, carbs and healthy fats. Good time for your second largest meal. Energy levels are optimal mid-day.",
            sleep:  "Balanced meal at midday. Avoid heavy, greasy foods which can disrupt your circadian rhythm. Lean proteins and complex carbs work best.",
            muscle: "High protein + carbs. Chicken, rice, vegetables. This is a key muscle building meal — don't skip it or eat light here."
        },
        dinner: {
            lose:   "Light and early is key for weight loss. Low carb, high protein — grilled fish, chicken, or tofu with vegetables. No heavy carbs. Earlier dinner = better fat burning overnight.",
            energy: "Keep it light and low carb. Focus on protein and vegetables. Heavy meals late disrupt sleep quality and fat metabolism.",
            sleep:  "Most important meal for sleep quality. Eat early and light. Tryptophan-rich foods help: turkey, chicken, dairy. Avoid alcohol and heavy fats which fragment sleep.",
            muscle: "Moderate protein + carbs. This is your last real muscle building meal. Chicken, sweet potato, vegetables. Don't eat too late or it disrupts overnight recovery."
        },
        stop: {
            lose:   "Hard cutoff for weight loss. Your body switches to fat burning mode during the overnight fast. Every hour you push past this delays fat burning.",
            energy: "Your body needs 2-3 hrs to digest before sleep. Eating after this raises blood glucose overnight and disrupts melatonin.",
            sleep:  "Critical for sleep quality. Eating after this delays sleep onset, reduces deep sleep, and disrupts melatonin. This boundary matters more than any other for sleep.",
            muscle: "Stop eating heavy meals here. Light casein protein is okay but heavy meals disrupt growth hormone release which peaks during deep sleep."
        },
        preWorkoutMeal: {
            lose:   "Eat 2-3 hrs before. Moderate carbs + protein. Don't over-eat — you want fuel not a full stomach. Lean protein + complex carbs only.",
            energy: "Eat 2-3 hrs before. High complex carbs + moderate protein. Maximises glycogen stores for performance.",
            sleep:  "Eat 2-3 hrs before. Keep it light so it doesn't affect your post-workout sleep. Easily digestible carbs + lean protein.",
            muscle: "Eat 2-3 hrs before. High carbs + protein to maximise glycogen and pre-load amino acids. Biggest pre-workout meal of the week."
        },
        preWorkoutSnack: {
            lose:   "45 mins before. Quick carbs only — banana, rice cakes. Keep calories minimal. Just enough fuel to perform.",
            energy: "45 mins before. Quick carbs only — banana, rice cakes, energy gel. Easy to digest, fast energy.",
            sleep:  "45 mins before. Light and easily digestible only. Avoid anything that will still be digesting when you try to sleep.",
            muscle: "45 mins before. Fast carbs + small amount of protein. Banana + protein shake. Primes muscles for the workout."
        },
        postWorkout: {
            lose:   "Most critical window. Protein within 30 mins to preserve muscle. Keep carbs moderate — you want recovery not a calorie surplus.",
            energy: "Most critical window. Carbs + protein within 30 mins. Repairs muscle and replenishes glycogen fast.",
            sleep:  "Within 30 mins. Protein + some carbs. Choose tryptophan-rich proteins like chicken or turkey to help with later sleep.",
            muscle: "Most critical window. Maximum carbs + protein within 30 mins. This is when your muscles absorb nutrients fastest. Don't skip this."
        },
        preSleep: {
            lose:   "Casein protein only — cottage cheese or Greek yogurt. Slow digesting, feeds muscles overnight without spiking blood sugar or adding fat.",
            energy: "Casein protein only — Greek yogurt or cottage cheese. Slow digesting, feeds muscles overnight without spiking blood sugar.",
            sleep:  "Casein protein + sleep-promoting foods. Cottage cheese + tart cherry juice is the gold standard. Feeds muscles and boosts melatonin.",
            muscle: "Casein protein is essential here. 30-40g cottage cheese, casein shake or Greek yogurt. Feeds muscles for 6-8 hours during sleep. Never skip this."
        }
    };

    const mealKey = getMealKey(meal) || meal.toLowerCase();
    return descriptions[mealKey]?.[goal] || descriptions[mealKey]?.energy || "";
}

function buildMeals(wakeMinutes, sleepMinutes, cal, userGoal){
    const windowMinutes = sleepMinutes - wakeMinutes;
    const windowHours   = windowMinutes / HOURS;
    const meals         = [];

    const goalAdjustments = {
        lose:   { dinnerOffset: HOURS * 4, stopEatingOffset: HOURS * 3 },
        energy: { dinnerOffset: HOURS * 3, stopEatingOffset: HOURS * 2 },
        sleep:  { dinnerOffset: HOURS * 4, stopEatingOffset: HOURS * 3 },
        muscle: { dinnerOffset: HOURS * 3, stopEatingOffset: HOURS * 2 }
    };
    const adj = goalAdjustments[userGoal] || goalAdjustments.energy;

    // Always add stop eating if window > 2 hours
    const stopEatingOffset = windowHours >= 8
        ? adj.stopEatingOffset          // full offset (2-3hrs)
        : windowHours >= 4
            ? HOURS                     // 1hr before sleep for medium windows
            : 0;                        // no stop eating for tiny windows

    const stopEatingTime = sleepMinutes - stopEatingOffset;

    if (windowHours < 4){
        // Ultra short window → one meal only
        meals.push({
            label:       "🌅 Light Meal",
            sortTime:    wakeMinutes + 30,
            type:        "Single balanced meal • Short window",
            description: "Your eating window is very short. Focus on one nutrient-dense balanced meal. Prioritise protein and healthy fats to sustain energy. Research shows compressed eating windows work best with fewer, more nutrient-dense meals.",
            calories:    cal.breakfast ? Math.round(cal.breakfast * 1.5) : null,
            macros:      {carbs: 0.35, protein: 0.40, fat: 0.25}
        });

    } else if (windowHours < 6){
        // Short window → breakfast + snack
        meals.push(
            {label: "🌅 Breakfast", sortTime: wakeMinutes + 30,         type: "Moderate meal • Short window",  description: getDescription("breakfast", userGoal), calories: cal.breakfast, macros: {carbs: 0.45, protein: 0.35, fat: 0.20}},
            {label: "🍿 Snack",     sortTime: wakeMinutes + HOURS * 2,  type: "Light snack • Keep it small",   description: getDescription("snack", userGoal),     calories: cal.snack,     macros: {carbs: 0.40, protein: 0.40, fat: 0.20}},
        );

    } else if (windowHours < 8){
        // Medium window → breakfast + snack + lunch
        meals.push(
            {label: "🌅 Breakfast", sortTime: wakeMinutes + 30,                    type: "Largest meal • High carbs + protein", description: getDescription("breakfast", userGoal), calories: cal.breakfast, macros: {carbs: 0.50, protein: 0.30, fat: 0.20}},
            {label: "🍿 Snack",     sortTime: wakeMinutes + HOURS * 2,             type: "Small • Fruits, nuts or yogurt",      description: getDescription("snack", userGoal),     calories: cal.snack,     macros: {carbs: 0.40, protein: 0.40, fat: 0.20}},
            {label: "☀️ Lunch",    sortTime: wakeMinutes + HOURS * 4,             type: "Moderate • Balanced macros",          description: getDescription("lunch", userGoal),     calories: cal.lunch,     macros: {carbs: 0.40, protein: 0.30, fat: 0.30}},
        );

    } else if (windowHours < 10){
        // Standard window → full plan minus pre-sleep
        meals.push(
            {label: "🌅 Breakfast", sortTime: wakeMinutes + 30,                    type: "Largest meal • High carbs + protein", description: getDescription("breakfast", userGoal), calories: cal.breakfast, macros: {carbs: 0.50, protein: 0.30, fat: 0.20}},
            {label: "🍿 Snack",     sortTime: wakeMinutes + HOURS * 3,             type: "Small • Fruits, nuts or yogurt",      description: getDescription("snack", userGoal),     calories: cal.snack,     macros: {carbs: 0.40, protein: 0.40, fat: 0.20}},
            {label: "☀️ Lunch",    sortTime: wakeMinutes + HOURS * 5,             type: "Moderate • Balanced macros",          description: getDescription("lunch", userGoal),     calories: cal.lunch,     macros: {carbs: 0.40, protein: 0.30, fat: 0.30}},
            {label: "🌄 Dinner",   sortTime: sleepMinutes - adj.dinnerOffset,     type: "Small • Low carb, high protein",      description: getDescription("dinner", userGoal),    calories: cal.dinner,    macros: {carbs: 0.20, protein: 0.50, fat: 0.30}},
        );

    } else {
        // Full window → complete meal plan
        meals.push(
            {label: "🌅 Breakfast", sortTime: wakeMinutes + 30,                    type: "Largest meal • High carbs + protein", description: getDescription("breakfast", userGoal), calories: cal.breakfast, macros: {carbs: 0.50, protein: 0.30, fat: 0.20}},
            {label: "🍿 Snack",     sortTime: wakeMinutes + HOURS * 3,             type: "Small • Fruits, nuts or yogurt",      description: getDescription("snack", userGoal),     calories: cal.snack,     macros: {carbs: 0.40, protein: 0.40, fat: 0.20}},
            {label: "☀️ Lunch",    sortTime: wakeMinutes + HOURS * 5,             type: "Moderate • Balanced macros",          description: getDescription("lunch", userGoal),     calories: cal.lunch,     macros: {carbs: 0.40, protein: 0.30, fat: 0.30}},
            {label: "🌄 Dinner",   sortTime: sleepMinutes - adj.dinnerOffset,     type: "Small • Low carb, high protein",      description: getDescription("dinner", userGoal),    calories: cal.dinner,    macros: {carbs: 0.20, protein: 0.50, fat: 0.30}},
        );

        // Only add snack 2 if window > 12 hours
        if (windowHours >= 12){
            meals.push({
                label:       "🫐 Afternoon Snack",
                sortTime:    wakeMinutes + HOURS * 7,
                type:        "Light • Keep energy stable",
                description: "With a long eating window, a second snack helps maintain stable blood sugar and prevents overeating at dinner.",
                calories:    cal.snack,
                macros:      {carbs: 0.40, protein: 0.40, fat: 0.20}
            });
        }
    }

    // Always add stop eating if it falls within the window
    if (stopEatingTime > wakeMinutes && stopEatingTime < sleepMinutes){
        meals.push({
            label:       "🎑 Stop Eating",
            sortTime:    stopEatingTime,
            type:        "⚠️ No food after this",
            description: getDescription("stop", userGoal),
            calories:    null,
            macros:      null
        });
    }

    // Filter out any meals that fall outside wake/sleep window
    return meals.filter(meal =>
        meal.sortTime >= wakeMinutes &&
        meal.sortTime <= sleepMinutes
    );
}

function buildExerciseMeals(exerciseMinutes, sleepMinutes, cal, userGoal){
    return [
        {label: "🍽️ Pre-workout meal",  sortTime: exerciseMinutes - HOURS * 3,    type: "High carbs + moderate protein",          description: getDescription("preWorkoutMeal", userGoal),  calories: cal.preWorkoutMeal,  macros: {carbs: 0.60, protein: 0.25, fat: 0.15}},
        {label: "⚡ Pre-workout snack", sortTime: exerciseMinutes - HOURS * 0.75, type: "Quick carbs • Banana, rice cakes",        description: getDescription("preWorkoutSnack", userGoal), calories: cal.preWorkoutSnack, macros: {carbs: 0.80, protein: 0.10, fat: 0.10}},
        {label: "💪 Post workout",      sortTime: exerciseMinutes + HOURS / 2,    type: "Carbs + protein within 30 mins",         description: getDescription("postWorkout", userGoal),     calories: cal.postWorkout,     macros: {carbs: 0.50, protein: 0.40, fat: 0.10}},
        {label: "🌙 Pre sleep",         sortTime: sleepMinutes - HOURS / 2,       type: "Casein only • Greek yogurt, cottage cheese", description: getDescription("preSleep", userGoal),    calories: cal.preSleep,        macros: {carbs: 0.10, protein: 0.80, fat: 0.10}},
    ];
}