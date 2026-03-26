/* ───────────────────────────────────────────────────────
   LIFESTYLE ACTIVITY DATA
   ─────────────────────────────────────────────────────── */

// 1. USER
const USER = {
  name: 'Priya',
  age: 38,
  weightKg: 64,
  maxHR: 181,
  safeMaxHR: 154,
};

// 2. LIFESTYLE_ACTIVITIES
const LIFESTYLE_ACTIVITIES = [
  { id: 'desk', name: 'Desk work', ico: '💻', col: '#3b82f6', cat: 'Work', met: 1.5 },
  { id: 'standing', name: 'Standing work', ico: '🧍', col: '#06b6d4', cat: 'Work', met: 2.0 },
  { id: 'screen', name: 'Screen time', ico: '📱', col: '#ef4444', cat: 'Self-care', met: 1.3 },
  { id: 'manual', name: 'Manual / field', ico: '🔧', col: '#f97316', cat: 'Work', met: 4.5 },
  { id: 'caregiving', name: 'Caregiving', ico: '🤲', col: '#ec4899', cat: 'Home', met: 3.0 },
  { id: 'cooking', name: 'Cooking', ico: '🍳', col: '#f59e0b', cat: 'Home', met: 2.5 },
  { id: 'cleaning', name: 'Cleaning', ico: '🧹', col: '#22c55e', cat: 'Home', met: 3.5 },
  { id: 'gardening', name: 'Gardening', ico: '🌿', col: '#84cc16', cat: 'Home', met: 4.0 },
  { id: 'childcare', name: 'Child / pet care', ico: '👶', col: '#f97316', cat: 'Home', met: 3.0 },
];

// 3. LIFESTYLE_FORMS
const LIFESTYLE_FORMS = {
  /* ── Desk work ─────────────────────────────────────── */
  desk: {
    layers: [
      {
        ico: '🪑',
        t: 'Session',
        s: 'Sitting duration & posture',
        f: [
          [
            { id: 'unbroken-sit', lbl: 'Unbroken sit (min)', type: 'number', ph: '60', min: 0, max: 240, step: 5 },
            { id: 'breaks', lbl: 'Breaks taken', type: 'number', ph: '2', min: 0, max: 20, step: 1 },
          ],
          [
            { id: 'posture', lbl: 'Posture quality', type: 'sel', opts: ['Good', 'Fair', 'Poor'] },
            { id: 'screen-dist', lbl: 'Screen distance', type: 'sel', opts: ['Arm length', 'Too close', 'Too far'] },
          ],
        ],
      },
      {
        ico: '🧠',
        t: 'Cognitive & Stress',
        s: 'Mental load & strain signals',
        f: [
          [
            { id: 'stress', lbl: 'Stress (1-10)', type: 'number', ph: '5', min: 1, max: 10, step: 1 },
            { id: 'focus', lbl: 'Focus quality', type: 'sel', opts: ['Sharp', 'Moderate', 'Foggy'] },
          ],
          [
            { id: 'eye-strain', lbl: 'Eye strain', type: 'sel', opts: ['None', 'Mild', 'Moderate', 'Severe'] },
            { id: 'neck-pain', lbl: 'Neck / shoulder pain', type: 'sel', opts: ['None', 'Mild', 'Moderate', 'Severe'] },
          ],
        ],
      },
      {
        ico: '🩸',
        t: 'Metabolic Flags',
        s: 'Nutrition & energy cues',
        f: [
          [
            { id: 'meals-at-desk', lbl: 'Meals at desk', type: 'number', ph: '1', min: 0, max: 5, step: 1 },
            { id: 'water', lbl: 'Water (glasses)', type: 'number', ph: '4', min: 0, max: 20, step: 1 },
          ],
          [
            { id: 'glucose-flag', lbl: 'Glucose flag', type: 'sel', opts: ['Normal', 'Low', 'High'] },
            { id: 'energy-dip', lbl: 'Energy dip', type: 'sel', opts: ['None', 'Post-lunch', 'Late afternoon', 'Multiple'] },
          ],
        ],
      },
    ],
    tip: 'Break every 30 min — even a 2-min stand or stretch lowers glucose spikes and reduces neck strain. Keep screen at arm length and eyes level with the top third of the monitor.',
  },

  /* ── Standing work ─────────────────────────────────── */
  standing: {
    layers: [
      {
        ico: '🧍',
        t: 'Session',
        s: 'Surface, footwear & posture',
        f: [
          [
            { id: 'surface', lbl: 'Floor surface', type: 'sel', opts: ['Anti-fatigue mat', 'Hard floor', 'Carpet'] },
            { id: 'footwear', lbl: 'Footwear', type: 'sel', opts: ['Supportive', 'Flat', 'Barefoot', 'Heels'] },
          ],
          [
            { id: 'posture', lbl: 'Posture quality', type: 'sel', opts: ['Good', 'Fair', 'Poor'] },
            { id: 'lower-limb', lbl: 'Lower-limb discomfort', type: 'sel', opts: ['None', 'Mild', 'Moderate', 'Severe'] },
          ],
        ],
      },
      {
        ico: '🩸',
        t: 'Vascular & Metabolic',
        s: 'Circulation & hydration',
        f: [
          [
            { id: 'bp-flag', lbl: 'BP flag', type: 'sel', opts: ['Normal', 'Low', 'High'] },
            { id: 'water', lbl: 'Water (glasses)', type: 'number', ph: '4', min: 0, max: 20, step: 1 },
          ],
        ],
      },
    ],
    tip: 'Alternate sit-stand every 30–45 min. Use an anti-fatigue mat and supportive footwear to reduce venous pooling and lower-limb strain.',
  },

  /* ── Manual / field ────────────────────────────────── */
  manual: {
    layers: [
      {
        ico: '🔧',
        t: 'Session',
        s: 'Work type & physical demands',
        f: [
          [
            { id: 'work-type', lbl: 'Work type', type: 'sel', opts: ['Construction', 'Agriculture', 'Warehouse', 'Delivery', 'Other'] },
            { id: 'lifting-kg', lbl: 'Max lifting (kg)', type: 'number', ph: '15', min: 0, max: 100, step: 1 },
          ],
          [
            { id: 'posture-haz', lbl: 'Posture hazard', type: 'sel', opts: ['None', 'Bending', 'Overhead', 'Twisting', 'Kneeling'] },
            { id: 'steps', lbl: 'Steps (approx)', type: 'number', ph: '5000', min: 0, max: 50000, step: 100 },
          ],
          [
            { id: 'breaks', lbl: 'Breaks taken', type: 'number', ph: '3', min: 0, max: 20, step: 1 },
            { id: 'heat', lbl: 'Heat exposure', type: 'sel', opts: ['Indoor / cool', 'Mild sun', 'Hot sun', 'Extreme heat'] },
          ],
        ],
      },
      {
        ico: '💪',
        t: 'Physical Load',
        s: 'Exertion & pain signals',
        f: [
          [
            { id: 'rpe', lbl: 'RPE (1-10)', type: 'number', ph: '6', min: 1, max: 10, step: 1 },
            { id: 'fatigue', lbl: 'Fatigue level', type: 'sel', opts: ['Fresh', 'Mild', 'Moderate', 'Exhausted'] },
          ],
          [
            { id: 'pain-site', lbl: 'Pain site', type: 'sel', opts: ['None', 'Lower back', 'Shoulders', 'Knees', 'Hands / wrists', 'Multiple'] },
            { id: 'med-taken', lbl: 'Medication taken', type: 'sel', opts: ['None', 'Painkiller', 'Muscle relaxant', 'Other'] },
          ],
        ],
      },
      {
        ico: '🩸',
        t: 'Metabolic Flags',
        s: 'Hydration & glucose cues',
        f: [
          [
            { id: 'water-l', lbl: 'Water (litres)', type: 'number', ph: '1.5', min: 0, max: 10, step: 0.1 },
            { id: 'glucose-flag', lbl: 'Glucose flag', type: 'sel', opts: ['Normal', 'Low', 'High'] },
          ],
          [
            { id: 'meal-timing', lbl: 'Meal timing', type: 'sel', opts: ['Regular', 'Skipped meal', 'Late meal', 'Irregular'] },
          ],
        ],
      },
    ],
    tip: 'Lift with your legs, not your back. Hydrate 200–300 ml every 20 min in heat. Take micro-breaks every 30 min to reduce cumulative spinal load.',
  },

  /* ── Caregiving ────────────────────────────────────── */
  caregiving: {
    layers: [
      {
        ico: '🤲',
        t: 'Session',
        s: 'Care type & physical load',
        f: [
          [
            { id: 'care-type', lbl: 'Care type', type: 'sel', opts: ['Elderly parent', 'Disabled family', 'Post-surgery', 'Chronic illness', 'Other'] },
            { id: 'phys-load', lbl: 'Physical load', type: 'sel', opts: ['Light', 'Moderate', 'Heavy'] },
          ],
          [
            { id: 'steps', lbl: 'Steps (approx)', type: 'number', ph: '3000', min: 0, max: 30000, step: 100 },
            { id: 'breaks', lbl: 'Breaks taken', type: 'number', ph: '2', min: 0, max: 20, step: 1 },
          ],
        ],
      },
      {
        ico: '💜',
        t: 'Carer Wellbeing',
        s: 'Emotional & recovery state',
        f: [
          [
            { id: 'stress', lbl: 'Stress (1-10)', type: 'number', ph: '5', min: 1, max: 10, step: 1 },
            { id: 'mood', lbl: 'Mood', type: 'sel', opts: ['Good', 'Neutral', 'Low', 'Anxious', 'Overwhelmed'] },
          ],
          [
            { id: 'support', lbl: 'Support available', type: 'sel', opts: ['Yes', 'Partial', 'None'] },
            { id: 'sleep-disrupt', lbl: 'Sleep disruption', type: 'sel', opts: ['None', 'Mild', 'Moderate', 'Severe'] },
          ],
        ],
      },
    ],
    tip: 'Carer burnout is real — schedule at least one 15-min "me-time" break per shift. Ask for help before exhaustion peaks. Protect your sleep window.',
  },

  /* ── Cooking ───────────────────────────────────────── */
  cooking: {
    layers: [
      {
        ico: '🍳',
        t: 'Session',
        s: 'Cooking duration & movement',
        f: [
          [
            { id: 'meal-type', lbl: 'Meal type', type: 'sel', opts: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Batch cook'] },
            { id: 'standing-min', lbl: 'Standing (min)', type: 'number', ph: '30', min: 0, max: 300, step: 5 },
          ],
          [
            { id: 'steps', lbl: 'Steps (approx)', type: 'number', ph: '800', min: 0, max: 10000, step: 50 },
            { id: 'tasting', lbl: 'Tasting while cooking', type: 'sel', opts: ['None', 'A little', 'Frequent'] },
          ],
        ],
      },
      {
        ico: '🥗',
        t: 'Dietary Outcome',
        s: 'What was cooked & how',
        f: [
          [
            { id: 'cuisine', lbl: 'Cuisine', type: 'sel', opts: ['Indian', 'Continental', 'Asian', 'Salad / raw', 'Mixed', 'Other'] },
            { id: 'cooking-m', lbl: 'Cooking method', type: 'sel', opts: ['Steamed', 'Stir-fried', 'Deep-fried', 'Baked', 'Grilled', 'Boiled', 'Raw', 'Mixed'] },
          ],
          [
            { id: 'oil', lbl: 'Oil usage', type: 'sel', opts: ['None', 'Minimal', 'Moderate', 'Heavy'] },
            { id: 'portions', lbl: 'Portions served', type: 'number', ph: '2', min: 1, max: 20, step: 1 },
          ],
        ],
      },
    ],
    tip: 'Steaming and stir-frying retain more nutrients than deep-frying. Taste mindfully — frequent tasting can add 100-200 hidden kcal. Prep veggies first to boost fibre intake.',
  },

  /* ── Cleaning ──────────────────────────────────────── */
  cleaning: {
    layers: [
      {
        ico: '🧹',
        t: 'Session',
        s: 'Cleaning type & intensity',
        f: [
          [
            { id: 'type', lbl: 'Cleaning type', type: 'sel', opts: ['Light tidy', 'Vacuuming', 'Mopping', 'Deep clean', 'Bathroom', 'Kitchen', 'Mixed'] },
            { id: 'intensity', lbl: 'Intensity', type: 'sel', opts: ['Light', 'Moderate', 'Vigorous'] },
          ],
          [
            { id: 'steps', lbl: 'Steps (approx)', type: 'number', ph: '2000', min: 0, max: 20000, step: 100 },
            { id: 'bending', lbl: 'Bending / squatting', type: 'sel', opts: ['Minimal', 'Some', 'Frequent'] },
          ],
        ],
      },
      {
        ico: '💪',
        t: 'Physical Load',
        s: 'Fatigue & pain signals',
        f: [
          [
            { id: 'fatigue', lbl: 'Fatigue level', type: 'sel', opts: ['Fresh', 'Mild', 'Moderate', 'Exhausted'] },
            { id: 'pain-site', lbl: 'Pain site', type: 'sel', opts: ['None', 'Lower back', 'Shoulders', 'Knees', 'Hands / wrists', 'Multiple'] },
          ],
        ],
      },
    ],
    tip: 'Cleaning counts as real exercise — vigorous mopping burns ~3.5 MET. Bend at the knees, not the waist, to protect your lower back. Ventilate rooms when using chemical cleaners.',
  },

  /* ── Gardening ─────────────────────────────────────── */
  gardening: {
    layers: [
      {
        ico: '🌿',
        t: 'Session',
        s: 'Garden task & environment',
        f: [
          [
            { id: 'task', lbl: 'Task', type: 'sel', opts: ['Watering', 'Weeding', 'Digging', 'Planting', 'Pruning', 'Mowing', 'Mixed'] },
            { id: 'steps', lbl: 'Steps (approx)', type: 'number', ph: '2000', min: 0, max: 20000, step: 100 },
          ],
          [
            { id: 'posture', lbl: 'Posture', type: 'sel', opts: ['Upright', 'Bending', 'Kneeling', 'Mixed'] },
            { id: 'heat-exp', lbl: 'Heat exposure', type: 'sel', opts: ['Indoor / shade', 'Mild sun', 'Hot sun', 'Extreme heat'] },
          ],
        ],
      },
      {
        ico: '😊',
        t: 'Wellbeing Impact',
        s: 'Mood & hydration',
        f: [
          [
            { id: 'mood-after', lbl: 'Mood after', type: 'sel', opts: ['Great', 'Good', 'Neutral', 'Low'] },
            { id: 'hydration', lbl: 'Hydration', type: 'sel', opts: ['Well hydrated', 'Slightly dry', 'Dehydrated'] },
          ],
        ],
      },
    ],
    tip: 'Gardening is a proven mood booster — 30 min in soil lowers cortisol measurably. Wear a hat and drink water every 20 min in sun. Kneel on a pad to protect your knees.',
  },

  /* ── Child / pet care ──────────────────────────────── */
  childcare: {
    layers: [
      {
        ico: '👶',
        t: 'Session',
        s: 'Activities & energy',
        f: [
          [
            { id: 'activities', lbl: 'Activities', type: 'sel', opts: ['Active play', 'Park visit', 'Feeding / bathing', 'School run', 'Indoor games', 'Pet walk', 'Mixed'] },
            { id: 'steps', lbl: 'Steps (approx)', type: 'number', ph: '3000', min: 0, max: 30000, step: 100 },
          ],
          [
            { id: 'child-age', lbl: 'Child / pet age', type: 'text', ph: 'e.g. 3 yrs' },
            { id: 'energy', lbl: 'Energy demand', type: 'sel', opts: ['Low', 'Moderate', 'High', 'Exhausting'] },
          ],
        ],
      },
      {
        ico: '💜',
        t: 'Carer State',
        s: 'Stress & mood check',
        f: [
          [
            { id: 'stress', lbl: 'Stress (1-10)', type: 'number', ph: '4', min: 1, max: 10, step: 1 },
            { id: 'mood', lbl: 'Mood', type: 'sel', opts: ['Joyful', 'Good', 'Neutral', 'Tired', 'Overwhelmed'] },
          ],
        ],
      },
    ],
    tip: 'Active play with kids is great cardio — a park visit can clock 3,000+ steps easily. Match your energy to theirs by fuelling with a healthy snack beforehand.',
  },

  /* ── Screen time ───────────────────────────────────── */
  screen: {
    layers: [
      {
        ico: '📱',
        t: 'Session',
        s: 'Device & content',
        f: [
          [
            { id: 'device', lbl: 'Device', type: 'sel', opts: ['Phone', 'Tablet', 'Laptop', 'TV', 'Multiple'] },
            { id: 'content', lbl: 'Content', type: 'sel', opts: ['Social media', 'Streaming', 'News', 'Gaming', 'Browsing', 'Mixed'] },
          ],
          [
            { id: 'posture', lbl: 'Posture', type: 'sel', opts: ['Upright', 'Reclined', 'Lying down', 'Hunched'] },
            { id: 'snacking', lbl: 'Snacking', type: 'sel', opts: ['None', 'Healthy', 'Unhealthy', 'Heavy'] },
          ],
        ],
      },
      {
        ico: '👁️',
        t: 'Health Impact',
        s: 'Strain & sedentary effects',
        f: [
          [
            { id: 'eye-strain', lbl: 'Eye strain', type: 'sel', opts: ['None', 'Mild', 'Moderate', 'Severe'] },
            { id: 'blue-light', lbl: 'Blue-light filter', type: 'sel', opts: ['On', 'Off', 'Not sure'] },
          ],
          [
            { id: 'mood-fx', lbl: 'Mood effect', type: 'sel', opts: ['Positive', 'Neutral', 'Negative', 'Anxious'] },
            { id: 'sedentary', lbl: 'Sedentary stretch', type: 'sel', opts: ['< 1 hr', '1–2 hr', '2–3 hr', '3+ hr'] },
          ],
        ],
      },
    ],
    tip: 'Follow the 20-20-20 rule — every 20 min look at something 20 feet away for 20 seconds. Avoid screens 1 hr before bed to protect melatonin. Enable blue-light filter after sunset.',
  },
};

// 4. DEMO_HISTORY
const DEMO_HISTORY = [
  { id: 1, actId: 'desk', date: '24 Mar', dur: 480, stress: 6, kcal: 720, flags: ['90 min unbroken sit', 'Moderate eye strain'] },
  { id: 2, actId: 'cooking', date: '23 Mar', dur: 45, stress: 2, kcal: 112, flags: ['Steamed & stir-fried', 'Low GI meal'] },
  { id: 3, actId: 'cleaning', date: '21 Mar', dur: 75, stress: 1, kcal: 263, flags: ['Vigorous deep clean', '4,200 steps'] },
  { id: 4, actId: 'screen', date: '19 Mar', dur: 180, stress: 5, kcal: 234, flags: ['Late evening use', 'Social media + streaming'] },
  { id: 5, actId: 'gardening', date: '18 Mar', dur: 50, stress: 1, kcal: 200, flags: ['Morning sun', 'Good mood'] },
  { id: 6, actId: 'childcare', date: '17 Mar', dur: 90, stress: 4, kcal: 192, flags: ['Active play', 'Park visit'] },
  { id: 7, actId: 'caregiving', date: '16 Mar', dur: 120, stress: 7, kcal: 230, flags: ['Elderly parent', 'High stress'] },
  { id: 8, actId: 'manual', date: '15 Mar', dur: 360, stress: 5, kcal: 1152, flags: ['Lifting 20kg', '8,000 steps'] },
];

module.exports = {
  USER,
  LIFESTYLE_ACTIVITIES,
  LIFESTYLE_FORMS,
  DEMO_HISTORY,
};
