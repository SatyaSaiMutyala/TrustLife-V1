const GOALS_TABS = [
  {key: 'overview', label: 'Overview'},
  {key: 'clinical', label: 'Clinical'},
  {key: 'nutrition', label: 'Nutrition'},
  {key: 'fitness', label: 'Fitness'},
  {key: 'sleep', label: 'Sleep'},
  {key: 'lifestyle', label: 'Lifestyle'},
];

const CURRENT_VALUES = {
  hba1c: 7.8, fastingBG: 128, postmealBG: 168, bpSystolic: 140, bpDiastolic: 90,
  weight: 64, ldl: 112, hdl: 44, triglycerides: 182, waist: 84,
  stepsDay: 6200, activeMin: 22, workoutsWeek: 4, vo2max: 28, restingHR: 72,
  sleepScore: 73, deepSleep: 102, hrv: 36, spo2: 96.8, stressScore: 5.5,
};

const OVERVIEW_SUMMARY = [
  {label: 'HbA1c', current: '7.8%', target: '6.5%', color: '#f59e0b', trend: 'Down from 7.8%'},
  {label: 'Blood pressure', current: '140/90', target: '125/80 mmHg', color: '#f97316', trend: 'Stable'},
  {label: 'Weight', current: '64kg', target: '59kg', color: '#3b82f6', trend: 'Target -5kg'},
  {label: 'Steps/day', current: '6,200', target: '8,000', color: '#f59e0b', trend: '+1,800 needed'},
  {label: 'Sleep score', current: '73/100', target: '75/100', color: '#a855f7', trend: 'Last 7-day avg: 73'},
  {label: 'Stress level', current: '5.5/10', target: '4/10', color: '#f97316', trend: 'Yoga helping'},
];

const MILESTONES = [
  {color: '#22c55e', date: 'Mar 2026', text: 'HbA1c 7.8% baseline', sub: 'Starting point on TrustLife', done: true},
  {color: '#22c55e', date: 'Apr 2026', text: 'HbA1c 7.2% target', sub: '-0.6% via diet + 150 min/week aerobic', done: false},
  {color: '#3b82f6', date: 'May 2026', text: 'BP 130/82 target', sub: 'Reduce sodium + potassium + Amlodipine', done: false},
  {color: '#a855f7', date: 'Jun 2026', text: 'Weight 61kg target', sub: '-3kg via calorie deficit + movement', done: false},
  {color: '#f59e0b', date: 'Sep 2026', text: 'HbA1c 6.5% target', sub: 'Full 12-month lifestyle goal', done: false},
  {color: '#1D9E75', date: 'Dec 2026', text: 'LDL <70 mg/dL', sub: 'Atorvastatin + Omega-3 + dietary fats', done: false},
];

const CLINICAL_GOALS = {
  glycaemia: {
    color: '#ef4444', icon: '\uD83E\uDE78', title: 'Blood Glucose Control', sub: 'HbA1c / Fasting / Post-meal',
    goals: [
      {key: 'hba1c', label: 'HbA1c target', value: 6.5, unit: '%', step: 0.1, desc: 'ADA recommends <7.0% for most T2DM patients.'},
      {key: 'fastingBG', label: 'Fasting glucose target', value: 100, unit: 'mg/dL', step: 1, desc: 'Target fasting glucose on waking.'},
      {key: 'postmealBG', label: 'Post-meal glucose (<2hr)', value: 140, unit: 'mg/dL', step: 1, desc: '2-hour post-meal glucose target.'},
    ],
    ayu: 'A 0.3% HbA1c reduction per 3 months is realistic with consistent diet and 150 min/week aerobic exercise.',
  },
  bp: {
    color: '#f97316', icon: '\u2764\uFE0F', title: 'Blood Pressure', sub: 'Systolic / Diastolic',
    goals: [
      {key: 'bpSystolic', label: 'Systolic BP target', value: 125, unit: 'mmHg', step: 1, desc: 'Current 140 mmHg is Stage 1 HTN. Amlodipine target: 125-130.'},
      {key: 'bpDiastolic', label: 'Diastolic BP target', value: 80, unit: 'mmHg', step: 1, desc: 'Target diastolic BP.'},
    ],
    ayu: 'Each 1,000 mg reduction in sodium lowers systolic BP by ~2 mmHg.',
  },
  lipids: {
    color: '#a855f7', icon: '\uD83E\uDDEC', title: 'Lipid Profile', sub: 'LDL / HDL / Triglycerides',
    goals: [
      {key: 'ldl', label: 'LDL cholesterol', value: 70, unit: 'mg/dL', step: 1, desc: 'ADA recommends <70 for T2DM with CV risk.'},
      {key: 'hdl', label: 'HDL target (higher=better)', value: 55, unit: 'mg/dL', step: 1, desc: 'Target >55 for women.'},
      {key: 'triglycerides', label: 'Triglycerides', value: 150, unit: 'mg/dL', step: 1, desc: 'Values <150 are ideal.'},
    ],
    ayu: 'Atorvastatin reduces LDL by ~40%. Omega-3 (1,100 mg/day) reduces triglycerides by 15-30%.',
  },
  bodyComp: {
    color: '#3b82f6', icon: '\u2696\uFE0F', title: 'Body Composition', sub: 'Weight / BMI / Waist',
    goals: [
      {key: 'weight', label: 'Target weight', value: 59, unit: 'kg', step: 0.5, desc: 'A 5% reduction significantly improves insulin sensitivity.'},
      {key: 'bmi', label: 'Target BMI', value: 22.5, unit: 'kg/m\u00B2', step: 0.1, desc: 'Asian guidelines: <23 for T2DM risk reduction.'},
      {key: 'waist', label: 'Waist circumference', value: 75, unit: 'cm', step: 1, desc: 'Abdominal fat drives insulin resistance. Target <80cm.'},
    ],
    ayu: 'A 5% weight reduction (64 to 61 kg) lowers HbA1c by 0.4-0.5%, systolic BP by 3-5 mmHg.',
  },
};

const NUTRITION_GOALS = {
  macros: {
    color: '#f59e0b', icon: '\uD83C\uDF7D', title: 'Macronutrients', sub: 'Calories / Protein / Carbs / Fat',
    goals: [
      {key: 'calories', label: 'Daily calories', value: 1650, unit: 'kcal', step: 50},
      {key: 'protein', label: 'Protein', value: 65, unit: 'g', step: 1},
      {key: 'carbs', label: 'Carbohydrates (low-GI)', value: 185, unit: 'g', step: 5},
      {key: 'fat', label: 'Total fat', value: 55, unit: 'g', step: 1},
      {key: 'fibre', label: 'Dietary fibre', value: 28, unit: 'g', step: 1},
      {key: 'sugar', label: 'Added sugars (limit)', value: 30, unit: 'g', step: 1},
    ],
  },
  minerals: {
    color: '#06b6d4', icon: '\uD83E\uDDF1', title: 'Key Minerals', sub: 'Sodium / Potassium / Calcium / Magnesium',
    goals: [
      {key: 'sodium', label: 'Sodium (HTN limit)', value: 1500, unit: 'mg', step: 50},
      {key: 'potassium', label: 'Potassium', value: 3500, unit: 'mg', step: 100},
      {key: 'calcium', label: 'Calcium', value: 1000, unit: 'mg', step: 50},
      {key: 'magnesium', label: 'Magnesium', value: 320, unit: 'mg', step: 10},
      {key: 'iron', label: 'Iron', value: 18, unit: 'mg', step: 1},
      {key: 'zinc', label: 'Zinc', value: 8, unit: 'mg', step: 0.5},
    ],
  },
  vitamins: {
    color: '#a855f7', icon: '\uD83D\uDC8A', title: 'Vitamins', sub: 'C / D / B12 / Folate',
    goals: [
      {key: 'vitC', label: 'Vitamin C', value: 75, unit: 'mg', step: 5},
      {key: 'vitD', label: 'Vitamin D', value: 600, unit: 'IU', step: 100},
      {key: 'vitB12', label: 'Vitamin B12', value: 2.4, unit: 'mcg', step: 0.2},
      {key: 'folate', label: 'Folate', value: 400, unit: 'mcg', step: 20},
      {key: 'omega3', label: 'Omega-3 fatty acids', value: 1100, unit: 'mg', step: 100},
    ],
    ayu: 'Vitamin D supplementation (1,000-2,000 IU/day) is the single highest-impact nutrition intervention for Priya.',
  },
  hydration: {
    color: '#3b82f6', icon: '\uD83D\uDCA7', title: 'Hydration', sub: 'Daily water target',
    goals: [{key: 'water', label: 'Water intake', value: 2500, unit: 'ml', step: 250}],
  },
};

const FITNESS_GOALS = {
  dailyMove: {
    color: '#1D9E75', icon: '\uD83D\uDEB6', title: 'Daily Movement', sub: 'Steps / Active minutes',
    goals: [
      {key: 'stepsDay', label: 'Daily step count', value: 8000, unit: 'steps', step: 500},
      {key: 'activeMin', label: 'Active minutes per day', value: 30, unit: 'min', step: 5},
    ],
    ayu: 'Even 2,000 additional steps/day lowers post-meal glucose by 15-20 mg/dL for 24 hours.',
  },
  aerobic: {
    color: '#22c55e', icon: '\u2764\uFE0F', title: 'Aerobic Exercise', sub: 'Weekly volume / WHO target',
    goals: [
      {key: 'workoutsWeek', label: 'Workout sessions per week', value: 5, unit: 'sessions', step: 1},
      {key: 'aerobicMin', label: 'Weekly aerobic (WHO target)', value: 150, unit: 'min/week', step: 15},
    ],
  },
  strength: {
    color: '#f97316', icon: '\uD83D\uDCAA', title: 'Strength Training', sub: 'Sessions per week',
    goals: [{key: 'strengthSess', label: 'Strength training sessions', value: 2, unit: 'per week', step: 1}],
  },
  hiit: {
    color: '#ef4444', icon: '\u26A1', title: 'High Intensity', sub: 'Sessions (capped for safety)',
    goals: [{key: 'hiitSess', label: 'HIIT sessions', value: 2, unit: 'per week', step: 1}],
    warning: 'Post-HIIT hypoglycaemia window: 30-90 min after session. Monitor glucose and carry 15g fast carbs.',
  },
  sports: {
    color: '#3b82f6', icon: '\uD83C\uDFC5', title: 'Sports & Recreation', sub: 'Sessions per week',
    goals: [{key: 'sportsSess', label: 'Sports sessions', value: 1, unit: 'per week', step: 1}],
  },
  mindBody: {
    color: '#a855f7', icon: '\uD83E\uDDE0', title: 'Mind & Body', sub: 'Sessions per week',
    goals: [{key: 'mindbodySess', label: 'Mind-body sessions', value: 4, unit: 'per week', step: 1}],
    ayu: 'Priya\'s current 4+ mind-body sessions/week is the strongest single habit for stress-driven glucose management.',
  },
  cardioFitness: {
    color: '#06b6d4', icon: '\uD83D\uDCC8', title: 'Cardiovascular Fitness', sub: 'VO2 max / Resting HR',
    goals: [
      {key: 'vo2max', label: 'VO2 max target', value: 35, unit: 'ml/kg/min', step: 1},
      {key: 'restingHR', label: 'Resting heart rate', value: 62, unit: 'bpm', step: 1},
      {key: 'maxHRWork', label: 'Max safe HR during exercise', value: 154, unit: 'bpm', step: 1},
    ],
    ayu: 'VO2 max improvement from 28 to 35 would reduce cardiovascular risk by 30%.',
  },
};

const SLEEP_GOALS = {
  duration: {
    color: '#4f46e5', icon: '\u23F0', title: 'Sleep Duration & Timing', sub: 'Duration / Bedtime / Wake',
    goals: [
      {key: 'sleepDuration', label: 'Nightly sleep duration', value: 7.5, unit: 'hrs', step: 0.5},
      {key: 'bedtime', label: 'Target bedtime', value: '22:30', unit: '', type: 'time'},
      {key: 'wakeTime', label: 'Target wake time', value: '06:00', unit: '', type: 'time'},
      {key: 'sleepLatency', label: 'Sleep latency (time to fall asleep)', value: 20, unit: 'min', step: 5},
    ],
  },
  quality: {
    color: '#6366f1', icon: '\uD83D\uDE34', title: 'Sleep Quality & Stages', sub: 'Score / Deep / REM',
    goals: [
      {key: 'sleepScore', label: 'Sleep quality score', value: 75, unit: '/100', step: 5},
      {key: 'deepSleep', label: 'Deep sleep per night', value: 90, unit: 'min', step: 5},
      {key: 'remSleep', label: 'REM sleep per night', value: 90, unit: 'min', step: 5},
    ],
    ayu: 'Evening alcohol (even 1 unit) reduces deep sleep by 20-25 min. Evening Metformin with food improves sleep glucose stability.',
  },
  biometrics: {
    color: '#8b5cf6', icon: '\u2764\uFE0F', title: 'Sleep Biometrics', sub: 'HRV / SpO2 / Bedtime glucose',
    goals: [
      {key: 'hrv', label: 'HRV (heart rate variability)', value: 45, unit: 'ms', step: 1},
      {key: 'spo2', label: 'Minimum SpO2 during sleep', value: 96, unit: '%', step: 1},
      {key: 'bedtimeBG', label: 'Bedtime glucose (upper)', value: 140, unit: 'mg/dL', step: 5},
    ],
  },
};

const LIFESTYLE_GOALS = {
  sitting: {
    color: '#22c55e', icon: '\uD83E\uDE91', title: 'Sedentary Behaviour', sub: 'Sitting breaks / Standing hours',
    goals: [
      {key: 'sedentaryBreak', label: 'Max unbroken sitting', value: 45, unit: 'min', step: 5},
      {key: 'standingHours', label: 'Daily standing time', value: 3, unit: 'hrs/day', step: 0.5},
    ],
    ayu: 'A phone alarm every 45 min to stand for 2 minutes reduces post-lunch glucose spike by up to 20%.',
  },
  stress: {
    color: '#f97316', icon: '\uD83E\uDDE0', title: 'Stress Management', sub: 'Daily stress score',
    goals: [
      {key: 'stressScore', label: 'Target stress level', value: 4, unit: '/10', step: 0.5},
    ],
    ayu: 'When Priya\'s stress is >7/10, fasting glucose the next morning averages 18 mg/dL higher.',
  },
  screen: {
    color: '#ef4444', icon: '\uD83D\uDCF1', title: 'Screen & Digital', sub: 'Evening screen time',
    goals: [
      {key: 'screenBedtime', label: 'Screen-off before bed', value: 60, unit: 'min before', step: 15},
    ],
    toggles: ['Evening screen limiter', 'Social media time cap'],
  },
  meals: {
    color: '#f59e0b', icon: '\uD83C\uDF7D', title: 'Eating Behaviour', sub: 'Meal timing / Alcohol',
    goals: [
      {key: 'mealsPerDay', label: 'Main meals per day', value: 3, unit: 'meals', step: 1},
      {key: 'alcoholWeek', label: 'Alcohol per week', value: 0, unit: 'units', step: 1},
    ],
  },
  social: {
    color: '#06b6d4', icon: '\uD83D\uDC65', title: 'Social & Emotional', sub: 'Connection / Wellbeing',
    toggles: ['Track caregiver stress', 'Social connection goal (3+/week)', 'Outdoor time goal (30 min/day)'],
    ayu: 'Lifestyle habits like gardening and social sessions are as important as medication.',
  },
};

module.exports = {
  GOALS_TABS,
  CURRENT_VALUES,
  OVERVIEW_SUMMARY,
  MILESTONES,
  CLINICAL_GOALS,
  NUTRITION_GOALS,
  FITNESS_GOALS,
  SLEEP_GOALS,
  LIFESTYLE_GOALS,
};
