const Colors = require('./colors').default || require('./colors');

// ─── 1. USER CONFIG ─────────────────────────────────────────────────────────
const USER_CONFIG = {
  name: 'Priya',
  weightKg: 64,
  stepGoal: 8000,
  activeGoal: 60,
  calGoal: 500,
  distGoal: 7,
  maxHR: 181,
  safeMaxHR: 154,
};

// ─── 2. ACTIVITIES ──────────────────────────────────────────────────────────
const ACTIVITIES = [
  { id: 'lw',    name: 'Leisure walk',  ico: '🚶',     met: 2.8,  col: '#22c55e', stepsKm: 1320, cat: 'walk'  },
  { id: 'bw',    name: 'Brisk walk',    ico: '🚶‍♂️',    met: 4.5,  col: '#1D9E75', stepsKm: 1380, cat: 'walk'  },
  { id: 'pw',    name: 'Power walk',    ico: '⚡',     met: 5.5,  col: '#06b6d4', stepsKm: 1400, cat: 'walk'  },
  { id: 'jog',   name: 'Light jog',     ico: '🏃',     met: 7.0,  col: '#3b82f6', stepsKm: 1480, cat: 'run'   },
  { id: 'run',   name: 'Running',       ico: '🏃‍♂️',    met: 9.5,  col: '#a855f7', stepsKm: 1550, cat: 'run'   },
  { id: 'hiit',  name: 'HIIT/Cardio',   ico: '🔥',     met: 10.0, col: '#ef4444', stepsKm: 1600, cat: 'hiit'  },
  { id: 'cyc',   name: 'Cycling',       ico: '🚴',     met: 6.8,  col: '#f97316', stepsKm: 0,    cat: 'cycle' },
  { id: 'swim',  name: 'Swimming',      ico: '🏊',     met: 6.0,  col: '#0ea5e9', stepsKm: 0,    cat: 'swim'  },
  { id: 'hike',  name: 'Hiking',        ico: '⛰️',     met: 5.8,  col: '#84cc16', stepsKm: 1350, cat: 'walk'  },
  { id: 'stair', name: 'Stair climb',   ico: '🪜',     met: 9.0,  col: '#f59e0b', stepsKm: 1200, cat: 'hiit'  },
  { id: 'dance', name: 'Dancing',       ico: '💃',     met: 5.5,  col: '#ec4899', stepsKm: 0,    cat: 'dance' },
  { id: 'row',   name: 'Rowing',        ico: '🚣',     met: 7.0,  col: '#14b8a6', stepsKm: 0,    cat: 'row'   },
  { id: 'ell',   name: 'Elliptical',    ico: '🔄',     met: 5.5,  col: '#6366f1', stepsKm: 1200, cat: 'cycle' },
  { id: 'bball', name: 'Basketball',    ico: '🏀',     met: 6.5,  col: '#f97316', stepsKm: 0,    cat: 'sport' },
  { id: 'skip',  name: 'Jump rope',     ico: '🪢',     met: 10.0, col: '#ef4444', stepsKm: 0,    cat: 'hiit'  },
  { id: 'zumba', name: 'Zumba',         ico: '🎵',     met: 6.5,  col: '#ec4899', stepsKm: 0,    cat: 'dance' },
];

// ─── 3. HR ZONES ────────────────────────────────────────────────────────────
const HR_ZONES = [
  { id: 1, name: 'Rest',      pct: 0,  col: '#64748b' },
  { id: 2, name: 'Easy',      pct: 25, col: '#22c55e' },
  { id: 3, name: 'Aerobic',   pct: 45, col: '#f59e0b' },
  { id: 4, name: 'Threshold', pct: 20, col: '#f97316' },
  { id: 5, name: 'Max',       pct: 10, col: '#ef4444' },
];

// ─── 4. INTENSITY CONFIG ───────────────────────────────────────────────────
const INTENSITY_CONFIG = [
  { id: 1, label: 'Light (Zone 1\u20132)',   met: 2.5, color: '#64748b', zonePcts: [60, 30, 10, 0, 0] },
  { id: 2, label: 'Moderate-Light (Zone 2)', met: 3.5, color: '#22c55e', zonePcts: [20, 50, 25, 5, 0] },
  { id: 3, label: 'Moderate (Zone 3)',       met: 4.5, color: '#f59e0b', zonePcts: [5, 20, 50, 20, 5] },
  { id: 4, label: 'Hard (Zone 4)',           met: 6.5, color: '#f97316', zonePcts: [0, 5, 25, 50, 20] },
  { id: 5, label: 'Max Effort (Zone 5)',     met: 9.5, color: '#ef4444', zonePcts: [0, 0, 10, 30, 60] },
];

// ─── 5. WEARABLES ───────────────────────────────────────────────────────────
const WEARABLES = [
  {
    id: 'apple',
    name: 'Apple Health',
    ico: '🍎',
    sub: 'iPhone\u00B7Apple Watch',
    status: 'connected',
    lastSync: 'Just now',
    data: ['Steps', 'Heart rate', 'Active calories', 'Distance', 'Flights climbed', 'Stand hours', 'VO2 Max', 'Sleep'],
  },
  {
    id: 'fitbit',
    name: 'Fitbit',
    ico: '📱',
    sub: 'Fitbit Sense 2',
    status: 'sync',
    lastSync: '2 min ago',
    data: ['Steps', 'Heart rate', 'Active minutes', 'Sleep score', 'Stress', 'SpO2'],
  },
  {
    id: 'garmin',
    name: 'Garmin',
    ico: '🏠',
    sub: 'Garmin Forerunner',
    status: 'disconnected',
    lastSync: '\u2014',
    data: ['Steps', 'GPS route', 'VO2 Max', 'Training load', 'Body battery', 'HRV'],
  },
  {
    id: 'samsung',
    name: 'Samsung Health',
    ico: '🔵',
    sub: 'Galaxy Watch 6',
    status: 'disconnected',
    lastSync: '\u2014',
    data: ['Steps', 'Heart rate', 'ECG', 'Blood pressure', 'Sleep', 'Energy score'],
  },
  {
    id: 'google',
    name: 'Google Fit',
    ico: '🔴',
    sub: 'Android/Pixel',
    status: 'disconnected',
    lastSync: '\u2014',
    data: ['Steps', 'Move minutes', 'Heart points', 'Weight', 'Workouts'],
  },
];

// ─── 6. DATA PERMISSIONS ───────────────────────────────────────────────────
const DATA_PERMISSIONS = [
  { ico: '👣', name: 'Steps',           on: true  },
  { ico: '❤️', name: 'Heart rate',      on: true  },
  { ico: '🔥', name: 'Calories',        on: true  },
  { ico: '📏', name: 'Distance',        on: true  },
  { ico: '😴', name: 'Sleep',           on: true  },
  { ico: '🩸', name: 'Blood oxygen',    on: false },
  { ico: '⚖️', name: 'Weight',          on: false },
  { ico: '🫀', name: 'Blood pressure',  on: false },
];

// ─── 7. TODAY ACTIVITIES ────────────────────────────────────────────────────
const TODAY_ACTIVITIES = [
  { actId: 'bw',    name: 'Brisk walk',  duration: 25, dist: 2.1, steps: 2898, kcal: 120, time: '7:15 AM',  zone: 'Easy',    postMeal: true  },
  { actId: 'jog',   name: 'Light jog',   duration: 20, dist: 2.8, steps: 4144, kcal: 149, time: '6:30 AM',  zone: 'Aerobic', postMeal: false },
  { actId: 'cyc',   name: 'Cycling',     duration: 30, dist: 8.5, steps: 0,    kcal: 217, time: '5:00 PM',  zone: 'Aerobic', postMeal: false },
  { actId: 'stair', name: 'Stair climb', duration: 10, dist: 0.2, steps: 240,  kcal: 96,  time: '12:30 PM', zone: 'Hard',    postMeal: true  },
];

// ─── 8. HOURLY STEPS ───────────────────────────────────────────────────────
const HOURLY_STEPS = [
  0, 0, 0, 0, 0, 0,
  320, 2898, 450, 600, 350, 200,
  240, 180, 120, 80, 150, 400,
  300, 200, 100, 50, 0, 0,
];

// ─── 9. WEEK DATA ───────────────────────────────────────────────────────────
const WEEK_DATA = [
  { day: 'Mon', steps: 7200,  date: '17 Mar', kcal: 310, mins: 48 },
  { day: 'Tue', steps: 9100,  date: '18 Mar', kcal: 420, mins: 62 },
  { day: 'Wed', steps: 5400,  date: '19 Mar', kcal: 240, mins: 35 },
  { day: 'Thu', steps: 8800,  date: '20 Mar', kcal: 400, mins: 58 },
  { day: 'Fri', steps: 10200, date: '21 Mar', kcal: 480, mins: 70 },
  { day: 'Sat', steps: 6300,  date: '22 Mar', kcal: 280, mins: 42 },
  { day: 'Sun', steps: 7282,  date: '23 Mar', kcal: 582, mins: 85 },
];

// ─── 10. THIRTY DAY STEPS ──────────────────────────────────────────────────
const THIRTY_DAY_STEPS = [
  6200, 7800, 5400, 9100, 8300, 4200, 7600,
  8900, 10200, 6800, 5500, 7200, 9400, 8100,
  3800, 6700, 7400, 8800, 9600, 5200, 7100,
  8500, 6900, 10500, 7800, 4600, 8200, 9300,
  7200, 7282,
];

// ─── 11. ACTIVITY BREAKDOWN ────────────────────────────────────────────────
const ACT_BREAKDOWN = [
  { ico: '🚶‍♂️', name: 'Brisk walk',  mins: 25, col: '#1D9E75' },
  { ico: '🏃',   name: 'Light jog',   mins: 20, col: '#3b82f6' },
  { ico: '🚴',   name: 'Cycling',     mins: 30, col: '#f97316' },
  { ico: '🪜',   name: 'Stair climb', mins: 10, col: '#f59e0b' },
  { ico: '🚶',   name: 'Casual walk', mins: 15, col: '#22c55e' },
  { ico: '💃',   name: 'Dancing',     mins: 12, col: '#ec4899' },
];

// ─── 12. PERSONAL BESTS ────────────────────────────────────────────────────
const PERSONAL_BESTS = [
  { ico: '👣', metric: 'Most steps (day)',    val: '14,820',   date: '12 Feb 2026' },
  { ico: '🔥', metric: 'Highest calories',    val: '680 kcal', date: '28 Jan 2026' },
  { ico: '📏', metric: 'Longest distance',    val: '11.2 km',  date: '5 Mar 2026'  },
  { ico: '⏱️', metric: 'Longest active time', val: '142 min',  date: '18 Feb 2026' },
  { ico: '🏃', metric: 'Fastest 5K',          val: '28:45',    date: '1 Mar 2026'  },
];

// ─── 13. ACTIVITY FORMS ────────────────────────────────────────────────────
const ACTIVITY_FORMS = {
  lw: {
    title: 'Log Leisure Walk',
    fields: [
      { row: [
        { id: 'duration', lbl: 'Duration (min)', type: 'number', val: 30, min: 1, max: 300, step: 1 },
        { id: 'distance', lbl: 'Distance (km)', type: 'number', val: 2.0, min: 0.1, max: 50, step: 0.1 },
      ]},
      { row: [
        { id: 'steps', lbl: 'Steps', type: 'number', val: 2640, min: 0, max: 99999, step: 1 },
        { id: 'pace', lbl: 'Pace (min/km)', type: 'number', val: 15.0, min: 5, max: 30, step: 0.1 },
      ]},
      { row: [
        { id: 'terrain', lbl: 'Terrain', type: 'select', options: ['Flat', 'Hilly', 'Mixed', 'Trail', 'Treadmill'] },
        { id: 'location', lbl: 'Location', type: 'text', placeholder: 'e.g. Park, Neighbourhood' },
      ]},
    ],
    tips: 'Leisure walks are great for recovery and mental health. Aim for 20\u201340 minutes at a comfortable pace.',
  },

  bw: {
    title: 'Log Brisk Walk',
    fields: [
      { row: [
        { id: 'duration', lbl: 'Duration (min)', type: 'number', val: 25, min: 1, max: 300, step: 1 },
        { id: 'distance', lbl: 'Distance (km)', type: 'number', val: 2.5, min: 0.1, max: 50, step: 0.1 },
      ]},
      { row: [
        { id: 'steps', lbl: 'Steps', type: 'number', val: 3450, min: 0, max: 99999, step: 1 },
        { id: 'pace', lbl: 'Pace (min/km)', type: 'number', val: 10.0, min: 5, max: 20, step: 0.1 },
      ]},
      { row: [
        { id: 'incline', lbl: 'Incline (%)', type: 'number', val: 0, min: 0, max: 30, step: 0.5 },
        { id: 'terrain', lbl: 'Terrain', type: 'select', options: ['Flat', 'Hilly', 'Mixed', 'Trail', 'Treadmill'] },
      ]},
      { row: [
        { id: 'cadence', lbl: 'Cadence (steps/min)', type: 'number', val: 120, min: 60, max: 200, step: 1 },
        { id: 'armSwing', lbl: 'Arm Swing', type: 'select', options: ['Normal', 'Active', 'Weighted'] },
      ]},
    ],
    tips: 'Brisk walking at 5.5\u20136.5 km/h is one of the best exercises for heart health. Keep your arms swinging naturally.',
  },

  pw: {
    title: 'Log Power Walk',
    fields: [
      { row: [
        { id: 'duration', lbl: 'Duration (min)', type: 'number', val: 30, min: 1, max: 300, step: 1 },
        { id: 'distance', lbl: 'Distance (km)', type: 'number', val: 3.0, min: 0.1, max: 50, step: 0.1 },
      ]},
      { row: [
        { id: 'steps', lbl: 'Steps', type: 'number', val: 4200, min: 0, max: 99999, step: 1 },
        { id: 'cadence', lbl: 'Cadence (steps/min)', type: 'number', val: 140, min: 60, max: 200, step: 1 },
      ]},
      { row: [
        { id: 'incline', lbl: 'Incline (%)', type: 'number', val: 2, min: 0, max: 30, step: 0.5 },
        { id: 'pace', lbl: 'Pace (min/km)', type: 'number', val: 8.5, min: 5, max: 15, step: 0.1 },
      ]},
      { row: [
        { id: 'intervals', lbl: 'Intervals', type: 'select', options: ['None', '1 min fast/1 min slow', '2 min fast/1 min slow', 'Custom'] },
        { id: 'poles', lbl: 'Walking Poles', type: 'select', options: ['No', 'Yes'] },
      ]},
    ],
    tips: 'Power walking pushes your heart rate into the aerobic zone. Focus on heel-to-toe technique and strong arm drive.',
  },

  jog: {
    title: 'Log Light Jog',
    fields: [
      { row: [
        { id: 'duration', lbl: 'Duration (min)', type: 'number', val: 20, min: 1, max: 300, step: 1 },
        { id: 'distance', lbl: 'Distance (km)', type: 'number', val: 3.0, min: 0.1, max: 50, step: 0.1 },
      ]},
      { row: [
        { id: 'pace', lbl: 'Pace (min/km)', type: 'number', val: 7.0, min: 3, max: 15, step: 0.1 },
        { id: 'cadence', lbl: 'Cadence (steps/min)', type: 'number', val: 160, min: 100, max: 220, step: 1 },
      ]},
      { row: [
        { id: 'elevationGain', lbl: 'Elevation Gain (m)', type: 'number', val: 0, min: 0, max: 5000, step: 1 },
        { id: 'surface', lbl: 'Surface', type: 'select', options: ['Road', 'Trail', 'Track', 'Treadmill', 'Grass', 'Sand'] },
      ]},
      { row: [
        { id: 'splits', lbl: 'Splits', type: 'text', placeholder: 'e.g. 7:10, 6:55, 7:05' },
        { id: 'shoes', lbl: 'Shoes', type: 'text', placeholder: 'e.g. Nike Pegasus 41' },
      ]},
    ],
    tips: 'Light jogging should feel conversational. If you can\'t speak comfortably, slow down. Great for building aerobic base.',
  },

  run: {
    title: 'Log Running',
    fields: [
      { row: [
        { id: 'duration', lbl: 'Duration (min)', type: 'number', val: 30, min: 1, max: 300, step: 1 },
        { id: 'distance', lbl: 'Distance (km)', type: 'number', val: 5.0, min: 0.1, max: 100, step: 0.1 },
      ]},
      { row: [
        { id: 'pace', lbl: 'Pace (min/km)', type: 'number', val: 6.0, min: 2, max: 15, step: 0.1 },
        { id: 'cadence', lbl: 'Cadence (steps/min)', type: 'number', val: 170, min: 100, max: 220, step: 1 },
      ]},
      { row: [
        { id: 'elevationGain', lbl: 'Elevation Gain (m)', type: 'number', val: 0, min: 0, max: 5000, step: 1 },
        { id: 'surface', lbl: 'Surface', type: 'select', options: ['Road', 'Trail', 'Track', 'Treadmill', 'Grass', 'Sand'] },
      ]},
      { row: [
        { id: 'runType', lbl: 'Run Type', type: 'select', options: ['Easy', 'Tempo', 'Interval', 'Long run', 'Fartlek', 'Race'] },
        { id: 'fastestKm', lbl: 'Fastest km (min)', type: 'number', val: 5.5, min: 2, max: 15, step: 0.1 },
      ]},
      { row: [
        { id: 'rpe', lbl: 'RPE (1\u201310)', type: 'number', val: 6, min: 1, max: 10, step: 1 },
        { id: 'splits', lbl: 'Splits', type: 'text', placeholder: 'e.g. 6:10, 5:55, 6:05' },
      ]},
    ],
    tips: 'Mix up your runs \u2014 80% easy, 20% hard. Track your cadence to improve efficiency. Aim for 170+ steps/min.',
  },

  hiit: {
    title: 'Log HIIT/Cardio',
    fields: [
      { row: [
        { id: 'duration', lbl: 'Duration (min)', type: 'number', val: 25, min: 1, max: 120, step: 1 },
        { id: 'rounds', lbl: 'Rounds', type: 'number', val: 5, min: 1, max: 50, step: 1 },
      ]},
      { row: [
        { id: 'workInterval', lbl: 'Work Interval (sec)', type: 'number', val: 40, min: 5, max: 300, step: 5 },
        { id: 'restInterval', lbl: 'Rest Interval (sec)', type: 'number', val: 20, min: 5, max: 300, step: 5 },
      ]},
      { row: [
        { id: 'exercisesPerRound', lbl: 'Exercises/Round', type: 'number', val: 4, min: 1, max: 20, step: 1 },
        { id: 'protocol', lbl: 'Protocol', type: 'select', options: ['Tabata', 'EMOM', 'AMRAP', 'Circuit', 'Custom'] },
      ]},
      { row: [
        { id: 'focus', lbl: 'Focus', type: 'select', options: ['Full body', 'Upper body', 'Lower body', 'Core', 'Cardio'] },
        { id: 'equipment', lbl: 'Equipment', type: 'select', options: ['None (bodyweight)', 'Dumbbells', 'Kettlebell', 'Resistance bands', 'Mixed'] },
      ]},
      { row: [
        { id: 'peakHR', lbl: 'Peak HR (bpm)', type: 'number', val: 165, min: 60, max: 220, step: 1 },
        { id: 'deviceCalories', lbl: 'Device Calories', type: 'number', placeholder: 'From watch/band', min: 0, max: 2000, step: 1 },
      ]},
    ],
    tips: 'HIIT is intense \u2014 ensure proper warm-up. Keep rest periods strict. Cool down for 3\u20135 minutes after.',
  },

  cyc: {
    title: 'Log Cycling',
    fields: [
      { row: [
        { id: 'duration', lbl: 'Duration (min)', type: 'number', val: 30, min: 1, max: 600, step: 1 },
        { id: 'distance', lbl: 'Distance (km)', type: 'number', val: 10.0, min: 0.1, max: 300, step: 0.1 },
      ]},
      { row: [
        { id: 'avgSpeed', lbl: 'Avg Speed (km/h)', type: 'number', val: 20.0, min: 1, max: 80, step: 0.1 },
        { id: 'maxSpeed', lbl: 'Max Speed (km/h)', type: 'number', val: 30.0, min: 1, max: 100, step: 0.1 },
      ]},
      { row: [
        { id: 'cadence', lbl: 'Cadence (rpm)', type: 'number', val: 70, min: 20, max: 150, step: 1 },
        { id: 'elevationGain', lbl: 'Elevation Gain (m)', type: 'number', val: 0, min: 0, max: 5000, step: 1 },
      ]},
      { row: [
        { id: 'bikeType', lbl: 'Bike Type', type: 'select', options: ['Road', 'Mountain', 'Hybrid', 'Stationary', 'E-bike'] },
        { id: 'resistance', lbl: 'Resistance', type: 'select', options: ['Low', 'Medium', 'High', 'Variable', 'N/A'] },
      ]},
      { row: [
        { id: 'power', lbl: 'Avg Power (watts)', type: 'number', placeholder: 'If available', min: 0, max: 2000, step: 1 },
        { id: 'conditions', lbl: 'Conditions', type: 'select', options: ['Indoor', 'Sunny', 'Cloudy', 'Windy', 'Rainy'] },
      ]},
    ],
    tips: 'Maintain a steady cadence of 60\u201390 rpm. Adjust gears to keep effort consistent on hills.',
  },

  swim: {
    title: 'Log Swimming',
    fields: [
      { row: [
        { id: 'duration', lbl: 'Duration (min)', type: 'number', val: 30, min: 1, max: 300, step: 1 },
        { id: 'laps', lbl: 'Laps', type: 'number', val: 20, min: 1, max: 500, step: 1 },
      ]},
      { row: [
        { id: 'poolLength', lbl: 'Pool Length (m)', type: 'select', options: ['25', '50', 'Open water'] },
        { id: 'distance', lbl: 'Distance (m)', type: 'number', val: 500, min: 10, max: 20000, step: 10 },
      ]},
      { row: [
        { id: 'stroke', lbl: 'Stroke', type: 'select', options: ['Freestyle', 'Backstroke', 'Breaststroke', 'Butterfly', 'Mixed'] },
        { id: 'pacePer100', lbl: 'Pace per 100m (sec)', type: 'number', val: 120, min: 30, max: 600, step: 1 },
      ]},
      { row: [
        { id: 'restIntervals', lbl: 'Rest Intervals (sec)', type: 'number', val: 15, min: 0, max: 300, step: 5 },
        { id: 'sets', lbl: 'Sets', type: 'number', val: 4, min: 1, max: 50, step: 1 },
      ]},
      { row: [
        { id: 'waterTemp', lbl: 'Water Temp (\u00B0C)', type: 'number', val: 28, min: 10, max: 40, step: 1 },
        { id: 'drills', lbl: 'Drills', type: 'select', options: ['None', 'Kick drills', 'Pull drills', 'Technique', 'Mixed'] },
      ]},
    ],
    tips: 'Focus on smooth, efficient strokes. Exhale underwater and rotate your body with each stroke for better propulsion.',
  },

  hike: {
    title: 'Log Hiking',
    fields: [
      { row: [
        { id: 'duration', lbl: 'Duration (min)', type: 'number', val: 60, min: 1, max: 600, step: 1 },
        { id: 'distance', lbl: 'Distance (km)', type: 'number', val: 5.0, min: 0.1, max: 100, step: 0.1 },
      ]},
      { row: [
        { id: 'elevationGain', lbl: 'Elevation Gain (m)', type: 'number', val: 200, min: 0, max: 5000, step: 1 },
        { id: 'elevationLoss', lbl: 'Elevation Loss (m)', type: 'number', val: 200, min: 0, max: 5000, step: 1 },
      ]},
      { row: [
        { id: 'trailName', lbl: 'Trail Name', type: 'text', placeholder: 'e.g. Western Ghats Loop' },
        { id: 'difficulty', lbl: 'Difficulty', type: 'select', options: ['Easy', 'Moderate', 'Hard', 'Expert'] },
      ]},
      { row: [
        { id: 'terrain', lbl: 'Terrain', type: 'select', options: ['Dirt trail', 'Rocky', 'Forest', 'Mountain', 'Coastal', 'Mixed'] },
        { id: 'packWeight', lbl: 'Pack Weight (kg)', type: 'number', val: 0, min: 0, max: 40, step: 0.5 },
      ]},
      { row: [
        { id: 'steps', lbl: 'Steps', type: 'number', val: 6750, min: 0, max: 99999, step: 1 },
        { id: 'poles', lbl: 'Trekking Poles', type: 'select', options: ['No', 'Yes'] },
      ]},
    ],
    tips: 'Hiking is excellent for mental health and endurance. Carry water, wear proper shoes, and check weather before heading out.',
  },

  stair: {
    title: 'Log Stair Climb',
    fields: [
      { row: [
        { id: 'duration', lbl: 'Duration (min)', type: 'number', val: 15, min: 1, max: 120, step: 1 },
        { id: 'floors', lbl: 'Floors', type: 'number', val: 20, min: 1, max: 500, step: 1 },
      ]},
      { row: [
        { id: 'steps', lbl: 'Steps', type: 'number', val: 1200, min: 0, max: 99999, step: 1 },
        { id: 'stepHeight', lbl: 'Step Height (cm)', type: 'number', val: 18, min: 10, max: 30, step: 1 },
      ]},
      { row: [
        { id: 'type', lbl: 'Type', type: 'select', options: ['Building stairs', 'StairMaster', 'Stadium stairs', 'Outdoor steps'] },
        { id: 'pace', lbl: 'Pace (floors/min)', type: 'number', val: 1.5, min: 0.5, max: 5, step: 0.1 },
      ]},
      { row: [
        { id: 'carryingWeight', lbl: 'Carrying Weight (kg)', type: 'number', val: 0, min: 0, max: 40, step: 0.5 },
        { id: 'location', lbl: 'Location', type: 'text', placeholder: 'e.g. Office building, Gym' },
      ]},
    ],
    tips: 'Stair climbing burns 2\u20133x more calories than walking. Keep a steady pace and use the railing only for balance.',
  },

  dance: {
    title: 'Log Dancing',
    fields: [
      { row: [
        { id: 'duration', lbl: 'Duration (min)', type: 'number', val: 30, min: 1, max: 300, step: 1 },
        { id: 'style', lbl: 'Style', type: 'select', options: ['Bollywood', 'Salsa', 'Hip hop', 'Contemporary', 'Classical', 'Freestyle', 'Other'] },
      ]},
      { row: [
        { id: 'format', lbl: 'Format', type: 'select', options: ['Solo', 'Partner', 'Group class', 'Online video', 'Social dance'] },
        { id: 'energyLevel', lbl: 'Energy Level', type: 'select', options: ['Low', 'Medium', 'High', 'Very high'] },
      ]},
      { row: [
        { id: 'songs', lbl: 'Songs', type: 'number', val: 8, min: 1, max: 50, step: 1 },
        { id: 'breaks', lbl: 'Breaks (min)', type: 'number', val: 5, min: 0, max: 60, step: 1 },
      ]},
      { row: [
        { id: 'footwear', lbl: 'Footwear', type: 'select', options: ['Dance shoes', 'Sneakers', 'Barefoot', 'Heels'] },
        { id: 'surface', lbl: 'Surface', type: 'select', options: ['Wood floor', 'Studio', 'Concrete', 'Carpet', 'Outdoor'] },
      ]},
    ],
    tips: 'Dancing is a fun way to burn calories! Focus on enjoying the music. Warm up before and stretch after.',
  },

  row: {
    title: 'Log Rowing',
    fields: [
      { row: [
        { id: 'duration', lbl: 'Duration (min)', type: 'number', val: 20, min: 1, max: 300, step: 1 },
        { id: 'distance', lbl: 'Distance (m)', type: 'number', val: 4000, min: 100, max: 50000, step: 100 },
      ]},
      { row: [
        { id: 'strokeRate', lbl: 'Stroke Rate (spm)', type: 'number', val: 24, min: 10, max: 50, step: 1 },
        { id: 'splitTime', lbl: 'Split Time (/500m)', type: 'text', placeholder: 'e.g. 2:15' },
      ]},
      { row: [
        { id: 'damperSetting', lbl: 'Damper Setting', type: 'number', val: 5, min: 1, max: 10, step: 1 },
        { id: 'rowerType', lbl: 'Rower Type', type: 'select', options: ['Concept2', 'Water rower', 'Magnetic', 'Air', 'On water'] },
      ]},
      { row: [
        { id: 'sessionType', lbl: 'Session Type', type: 'select', options: ['Steady state', 'Intervals', 'Time trial', 'Pyramid', 'Free row'] },
        { id: 'avgWatts', lbl: 'Avg Watts', type: 'number', placeholder: 'If available', min: 0, max: 1000, step: 1 },
      ]},
    ],
    tips: 'Focus on the drive sequence: legs, back, arms. Keep stroke rate steady. 80% of power comes from the legs.',
  },

  ell: {
    title: 'Log Elliptical',
    fields: [
      { row: [
        { id: 'duration', lbl: 'Duration (min)', type: 'number', val: 30, min: 1, max: 300, step: 1 },
        { id: 'distance', lbl: 'Distance (km)', type: 'number', val: 3.5, min: 0.1, max: 50, step: 0.1 },
      ]},
      { row: [
        { id: 'resistance', lbl: 'Resistance Level', type: 'number', val: 6, min: 1, max: 25, step: 1 },
        { id: 'incline', lbl: 'Incline Level', type: 'number', val: 5, min: 0, max: 20, step: 1 },
      ]},
      { row: [
        { id: 'stridesPerMin', lbl: 'Strides/min', type: 'number', val: 130, min: 50, max: 200, step: 1 },
        { id: 'totalStrides', lbl: 'Total Strides', type: 'number', val: 3900, min: 0, max: 99999, step: 1 },
      ]},
      { row: [
        { id: 'direction', lbl: 'Direction', type: 'select', options: ['Forward', 'Reverse', 'Mixed'] },
        { id: 'upperBodyPoles', lbl: 'Upper Body Poles', type: 'select', options: ['Yes', 'No'] },
      ]},
      { row: [
        { id: 'deviceCalories', lbl: 'Device Calories', type: 'number', placeholder: 'From machine display', min: 0, max: 2000, step: 1 },
        { id: 'machineBrand', lbl: 'Machine Brand', type: 'text', placeholder: 'e.g. Life Fitness, Precor' },
      ]},
    ],
    tips: 'The elliptical is joint-friendly. Try reverse motion to target different muscles. Keep your core engaged throughout.',
  },

  bball: {
    title: 'Log Basketball',
    fields: [
      { row: [
        { id: 'duration', lbl: 'Duration (min)', type: 'number', val: 45, min: 1, max: 300, step: 1 },
        { id: 'quarters', lbl: 'Quarters/Halves', type: 'number', val: 4, min: 1, max: 8, step: 1 },
      ]},
      { row: [
        { id: 'format', lbl: 'Format', type: 'select', options: ['Full court 5v5', 'Half court 3v3', 'Shooting practice', 'Drills', 'Pickup game'] },
        { id: 'courtType', lbl: 'Court Type', type: 'select', options: ['Indoor', 'Outdoor', 'Street'] },
      ]},
      { row: [
        { id: 'position', lbl: 'Position', type: 'select', options: ['Guard', 'Forward', 'Center', 'All-round'] },
        { id: 'intensity', lbl: 'Intensity', type: 'select', options: ['Light', 'Moderate', 'Competitive', 'All-out'] },
      ]},
      { row: [
        { id: 'sprints', lbl: 'Sprints (est.)', type: 'number', val: 15, min: 0, max: 200, step: 1 },
        { id: 'contactLevel', lbl: 'Contact Level', type: 'select', options: ['No contact', 'Light', 'Normal', 'Physical'] },
      ]},
    ],
    tips: 'Basketball is great cardio with natural intervals. Stay hydrated and warm up your ankles and knees properly.',
  },

  skip: {
    title: 'Log Jump Rope',
    fields: [
      { row: [
        { id: 'duration', lbl: 'Duration (min)', type: 'number', val: 15, min: 1, max: 120, step: 1 },
        { id: 'totalJumps', lbl: 'Total Jumps', type: 'number', val: 1500, min: 10, max: 20000, step: 10 },
      ]},
      { row: [
        { id: 'sets', lbl: 'Sets', type: 'number', val: 5, min: 1, max: 30, step: 1 },
        { id: 'workInterval', lbl: 'Work Interval (sec)', type: 'number', val: 120, min: 10, max: 600, step: 5 },
      ]},
      { row: [
        { id: 'rest', lbl: 'Rest (sec)', type: 'number', val: 30, min: 5, max: 300, step: 5 },
        { id: 'jumpStyle', lbl: 'Jump Style', type: 'select', options: ['Basic bounce', 'Alternate foot', 'High knees', 'Double unders', 'Criss-cross', 'Mixed'] },
      ]},
      { row: [
        { id: 'ropeType', lbl: 'Rope Type', type: 'select', options: ['Speed rope', 'Weighted rope', 'Beaded rope', 'Leather rope'] },
        { id: 'surface', lbl: 'Surface', type: 'select', options: ['Rubber mat', 'Wood floor', 'Concrete', 'Grass', 'Gym floor'] },
      ]},
    ],
    tips: 'Jump rope is one of the best calorie burners! Stay light on your feet and use wrist rotation, not arm swings.',
  },

  zumba: {
    title: 'Log Zumba',
    fields: [
      { row: [
        { id: 'duration', lbl: 'Duration (min)', type: 'number', val: 45, min: 1, max: 120, step: 1 },
        { id: 'classType', lbl: 'Class Type', type: 'select', options: ['Zumba', 'Zumba Toning', 'Aqua Zumba', 'Zumba Gold', 'Strong by Zumba', 'Zumba Step'] },
      ]},
      { row: [
        { id: 'format', lbl: 'Format', type: 'select', options: ['In-person class', 'Online live', 'Video/recorded', 'Self-guided'] },
        { id: 'instructorLevel', lbl: 'Instructor Level', type: 'select', options: ['Beginner', 'Intermediate', 'Advanced', 'N/A'] },
      ]},
      { row: [
        { id: 'energy', lbl: 'Energy', type: 'select', options: ['Low', 'Medium', 'High', 'Very high'] },
        { id: 'songs', lbl: 'Songs', type: 'number', val: 12, min: 1, max: 30, step: 1 },
      ]},
      { row: [
        { id: 'routinesLearned', lbl: 'Routines Learned', type: 'number', val: 3, min: 0, max: 20, step: 1 },
        { id: 'footwear', lbl: 'Footwear', type: 'select', options: ['Dance sneakers', 'Regular sneakers', 'Barefoot', 'Zumba shoes'] },
      ]},
      { row: [
        { id: 'surface', lbl: 'Surface', type: 'select', options: ['Wood floor', 'Studio', 'Gym floor', 'Carpet', 'Outdoor'] },
        { id: 'sweatLevel', lbl: 'Sweat Level', type: 'select', options: ['Light', 'Moderate', 'Drenched', 'Soaked'] },
      ]},
    ],
    tips: 'Zumba is a party workout! Don\'t worry about perfect moves \u2014 just keep moving and have fun. Stay hydrated!',
  },
};

// Dashboard expects {hour, steps} objects
const HOURLY_STEPS_OBJ = HOURLY_STEPS.map(function (s, i) {
  return {hour: i, steps: s};
});

const DASHBOARD_METRICS = {
  steps: {current: 7284, goal: 8000},
  activeMinutes: {current: 42, goal: 60},
  calories: {current: 312, goal: 500},
  distance: {current: 5.4, goal: 7},
  floors: 8,
};

const STAND_HOURS_RAW = [0,0,0,0,0,0,0,1,1,1,1,0,1,1,0,1,1,0,1,0,1,0,0,0];
const STAND_HOURS = STAND_HOURS_RAW.map(function(v, i) {
  return { hour: i, stood: v === 1 };
});

const AYU_INSIGHT =
  "Priya, you're at 91% of your step goal — excellent! Your 30-min post-breakfast brisk walk lowered your estimated glucose by ~18 mg/dL. 216 more steps completes your daily ring. A 3-minute evening stroll will do it.";

const GLUCOSE_IMPACT = {
  reduction: 22,
  note: "Today's activity estimated to reduce blood glucose by ~22 mg/dL · ideal for HbA1c management",
};

// ─── TrendsTab data ───────────────────────────────────────────
const TRENDS_HR_ZONES = [
  {id: 1, name: 'Rest',      mins: 42, col: '#64748b'},
  {id: 2, name: 'Easy',      mins: 73, col: '#22c55e'},
  {id: 3, name: 'Aerobic',   mins: 132, col: '#f59e0b'},
  {id: 4, name: 'Threshold', mins: 59, col: '#f97316'},
  {id: 5, name: 'Max',       mins: 29, col: '#ef4444'},
];

const HR_DAILY = [42, 48, 65, 58, 68, 85, 42];

const WEEKLY_SUMMARY = {
  totalSteps: 52184,
  totalDist: 38.2,
  totalCals: 2184,
  totalMins: 294,
  stepGoalWeekly: 56000,
  calGoalWeekly: 3500,
  minGoalWeekly: 420,
};

// ─── LogActivityTab data ──────────────────────────────────────
const UPPER_BODY = ['None / minimal', 'Moderate arm movement', 'Active — full arm swing', 'Dominant — arms drive effort'];
const MOVEMENT_PATTERNS = ['Linear (straight path)', 'Lateral (side to side)', 'Rotational', 'Multi-directional', 'Vertical (up/down)', 'Stationary'];
const BODY_POSITIONS = ['Upright / standing', 'Seated', 'Floor / prone', 'Mixed positions', 'Aquatic / floating'];
const FEEL_OPTIONS = ['Tired / low energy', 'Neutral', 'Good / motivated', 'Great / energised', 'Stressed / anxious'];
const MOTIVATION_SOURCES = ['Routine / habit', 'Health goal', 'Stress relief', 'Social / with friend', 'Challenge / target', 'Felt like it'];
const COMPLETION_STATUS = ['Yes — fully completed', 'Yes — slightly modified', 'Partial — stopped early', 'No — plan changed'];
const SOCIAL_CONTEXT = ['Solo', 'Partner', 'Group / class', 'Friend', 'Trainer / coach'];
const MEAL_FLAGS = ['None', 'Post breakfast', 'Post lunch', 'Post dinner'];
const HEALTH_BENEFITS = [
  {label: 'Insulin sensitivity ↑', color: '#22c55e'},
  {label: 'Glucose ↓15–25 mg/dL', color: '#22c55e'},
  {label: 'BP benefit ↓', color: '#3b82f6'},
  {label: 'Zone 3+ cardio', color: '#f59e0b'},
  {label: 'WHO target contribution', color: '#a855f7'},
];

module.exports = {
  USER_CONFIG,
  ACTIVITIES,
  HR_ZONES,
  INTENSITY_CONFIG,
  WEARABLES,
  DATA_PERMISSIONS,
  TODAY_ACTIVITIES,
  HOURLY_STEPS: HOURLY_STEPS_OBJ,
  WEEK_DATA,
  THIRTY_DAY_STEPS,
  ACT_BREAKDOWN,
  PERSONAL_BESTS,
  ACTIVITY_FORMS,
  DASHBOARD_METRICS,
  STAND_HOURS,
  AYU_INSIGHT,
  GLUCOSE_IMPACT,
  TRENDS_HR_ZONES,
  HR_DAILY,
  WEEKLY_SUMMARY,
  UPPER_BODY,
  MOVEMENT_PATTERNS,
  BODY_POSITIONS,
  FEEL_OPTIONS,
  MOTIVATION_SOURCES,
  COMPLETION_STATUS,
  SOCIAL_CONTEXT,
  MEAL_FLAGS,
  HEALTH_BENEFITS,
};
