const Colors = require('./colors').default || require('./colors');

// ─── 1. EXERCISES_DB ─────────────────────────────────────────────────────────
const EXERCISES_DB = {
  push: [
    { id: 'bp', name: 'Bench Press', type: 'Compound', pattern: 'Push', equip: 'Barbell', muscle: 'Chest' },
    { id: 'ibp', name: 'Incline DB Press', type: 'Compound', pattern: 'Push', equip: 'Dumbbell', muscle: 'Upper Chest' },
    { id: 'ohp', name: 'Overhead Press', type: 'Compound', pattern: 'Push', equip: 'Barbell', muscle: 'Front Delt' },
    { id: 'dips', name: 'Weighted Dips', type: 'Compound', pattern: 'Push', equip: 'BW+Belt', muscle: 'Chest/Triceps' },
    { id: 'lat_r', name: 'Lateral Raise', type: 'Isolation', pattern: 'Push', equip: 'Dumbbell', muscle: 'Side Delt' },
    { id: 'tri_p', name: 'Tricep Pushdown', type: 'Isolation', pattern: 'Push', equip: 'Cable', muscle: 'Triceps' },
    { id: 'sku', name: 'Skull Crusher', type: 'Isolation', pattern: 'Push', equip: 'Barbell', muscle: 'Triceps' },
    { id: 'cfl', name: 'Cable Fly', type: 'Isolation', pattern: 'Push', equip: 'Cable', muscle: 'Chest' },
  ],
  pull: [
    { id: 'dl', name: 'Deadlift', type: 'Compound', pattern: 'Hinge', equip: 'Barbell', muscle: 'Back/Glutes' },
    { id: 'row', name: 'Bent-over Row', type: 'Compound', pattern: 'Pull', equip: 'Barbell', muscle: 'Lats/Rhomboids' },
    { id: 'pu', name: 'Pull-up / Chin-up', type: 'Compound', pattern: 'Pull', equip: 'BW', muscle: 'Lats/Biceps' },
    { id: 'lpd', name: 'Lat Pulldown', type: 'Compound', pattern: 'Pull', equip: 'Machine', muscle: 'Lats' },
    { id: 'cabl', name: 'Cable Row', type: 'Compound', pattern: 'Pull', equip: 'Cable', muscle: 'Mid-back' },
    { id: 'curl', name: 'Barbell Curl', type: 'Isolation', pattern: 'Pull', equip: 'Barbell', muscle: 'Biceps' },
    { id: 'hmr', name: 'Hammer Curl', type: 'Isolation', pattern: 'Pull', equip: 'Dumbbell', muscle: 'Biceps/Brachialis' },
    { id: 'fp', name: 'Face Pull', type: 'Isolation', pattern: 'Pull', equip: 'Cable', muscle: 'Rear Delt' },
  ],
  legs: [
    { id: 'sq', name: 'Barbell Squat', type: 'Compound', pattern: 'Squat', equip: 'Barbell', muscle: 'Quads/Glutes' },
    { id: 'rdl', name: 'Romanian Deadlift', type: 'Compound', pattern: 'Hinge', equip: 'Barbell', muscle: 'Hamstrings/Glutes' },
    { id: 'ht', name: 'Hip Thrust', type: 'Compound', pattern: 'Hinge', equip: 'Barbell', muscle: 'Glutes' },
    { id: 'lp', name: 'Leg Press', type: 'Compound', pattern: 'Push', equip: 'Machine', muscle: 'Quads/Glutes' },
    { id: 'le', name: 'Leg Extension', type: 'Isolation', pattern: 'Push', equip: 'Machine', muscle: 'Quads' },
    { id: 'lc', name: 'Leg Curl', type: 'Isolation', pattern: 'Hinge', equip: 'Machine', muscle: 'Hamstrings' },
    { id: 'cr', name: 'Standing Calf Raise', type: 'Isolation', pattern: 'Push', equip: 'Machine', muscle: 'Calves' },
    { id: 'bss', name: 'Bulgarian Split Squat', type: 'Compound', pattern: 'Squat', equip: 'Dumbbell', muscle: 'Quads/Glutes' },
  ],
  core: [
    { id: 'plk', name: 'Plank', type: 'Isolation', pattern: 'Stability', equip: 'BW', muscle: 'Core' },
    { id: 'ab', name: 'Cable Crunch', type: 'Isolation', pattern: 'Flexion', equip: 'Cable', muscle: 'Abs' },
    { id: 'rus', name: 'Russian Twist', type: 'Isolation', pattern: 'Rotation', equip: 'BW', muscle: 'Obliques' },
    { id: 'abw', name: 'Ab Wheel Rollout', type: 'Compound', pattern: 'Stability', equip: 'BW', muscle: 'Full core' },
  ],
};

// ─── 2. FUNC_GROUPS ──────────────────────────────────────────────────────────
const FUNC_GROUPS = {
  push:     { name: 'Push',     ico: '\u{1F53C}', color: '#f97316' },
  pull:     { name: 'Pull',     ico: '\u{1F53D}', color: '#3b82f6' },
  legs:     { name: 'Legs',     ico: '\u{1F9B5}', color: '#22c55e' },
  core:     { name: 'Core',     ico: '\u{1F3AF}', color: '#a855f7' },
  fullbody: { name: 'Full',     ico: '\u{1F3CB}', color: '#06b6d4' },
  cardio:   { name: 'Cardio',   ico: '\u{2764}\u{FE0F}', color: '#ef4444' },
  mobility: { name: 'Mobility', ico: '\u{1F938}', color: '#f59e0b' },
  rest:     { name: 'Rest',     ico: '\u{1F634}', color: '#64748b' },
};

// ─── 3. MUSCLES ──────────────────────────────────────────────────────────────
const MUSCLES = {
  chest:       '\u{1F4AA} Chest',
  upper_chest: '\u{1F4AA} Upper Chest',
  lower_chest: '\u{1F4AA} Lower Chest',
  ant_delt:    '\u{1F9BE} Front Delts',
  lat_delt:    '\u{1F9BE} Side Delts',
  rear_delt:   '\u{1F9BE} Rear Delts',
  triceps:     '\u{1F4AA} Triceps',
  biceps:      '\u{1F4AA} Biceps',
  forearms:    '\u{1F4AA} Forearms',
  lats:        '\u{1FAC1} Lats',
  upper_back:  '\u{1FAC1} Upper Back',
  traps:       '\u{1F9BE} Traps',
  quads:       '\u{1F9B5} Quads',
  hamstrings:  '\u{1F9B5} Hamstrings',
  glutes:      '\u{1F351} Glutes',
  calves:      '\u{1F9B5} Calves',
  adductors:   '\u{1F9B5} Adductors',
  hip_flex:    '\u{1F9B5} Hip Flexors',
  abs:         '\u{1F3AF} Abs',
  obliques:    '\u{1F3AF} Obliques',
  lower_back:  '\u{1F519} Lower Back',
};

// ─── 4. MUSCLE_BY_FG ─────────────────────────────────────────────────────────
const MUSCLE_BY_FG = {
  push:     ['chest', 'upper_chest', 'lower_chest', 'ant_delt', 'lat_delt', 'triceps'],
  pull:     ['lats', 'upper_back', 'rear_delt', 'biceps', 'forearms', 'traps'],
  legs:     ['quads', 'hamstrings', 'glutes', 'calves', 'adductors', 'hip_flex'],
  core:     ['abs', 'obliques', 'lower_back'],
  fullbody: ['chest', 'lats', 'quads', 'glutes', 'ant_delt', 'abs'],
};

// ─── 5. GOALS ────────────────────────────────────────────────────────────────
const GOALS = [
  { id: 'strength',    name: 'Strength',    color: '#3b82f6' },
  { id: 'hypertrophy', name: 'Hypertrophy', color: '#a855f7' },
  { id: 'endurance',   name: 'Endurance',   color: '#22c55e' },
  { id: 'power',       name: 'Power',       color: '#ef4444' },
  { id: 'functional',  name: 'Functional',  color: '#f59e0b' },
  { id: 'recovery',    name: 'Recovery',    color: '#06b6d4' },
];

// ─── 6. PLAN_TEMPLATES ──────────────────────────────────────────────────────
const PLAN_TEMPLATES = [
  {
    id: 'ppl6',
    name: 'PPL \u00B7 6 days',
    icon: '\u{26A1}',
    color: '#f97316',
    desc: 'Push/Pull/Legs \u00D7 2 + Rest. High volume, great for hypertrophy and strength.',
    split: ['Push A', 'Pull A', 'Legs A', 'Push B', 'Pull B', 'Legs B', 'Rest'],
    fgs: ['push', 'pull', 'legs', 'push', 'pull', 'legs', 'rest'],
    goals: ['strength', 'hypertrophy', 'hypertrophy', 'hypertrophy', 'strength', 'hypertrophy', 'recovery'],
    muscles: [
      ['chest', 'ant_delt', 'triceps'],
      ['lats', 'upper_back', 'biceps'],
      ['quads', 'hamstrings', 'glutes'],
      ['upper_chest', 'lat_delt', 'triceps'],
      ['lats', 'rear_delt', 'biceps'],
      ['quads', 'glutes', 'calves'],
      [],
    ],
    exIds: [
      ['bp', 'ohp', 'lat_r', 'tri_p', 'cfl'],
      ['dl', 'row', 'pu', 'curl', 'fp'],
      ['sq', 'rdl', 'lp', 'lc', 'cr'],
      ['ibp', 'dips', 'lat_r', 'sku', 'cfl'],
      ['row', 'lpd', 'cabl', 'hmr', 'fp'],
      ['sq', 'ht', 'le', 'lc', 'bss'],
      [],
    ],
    defaultSets: [4, 3, 3, 3],
    defaultReps: ['5', '8-10', '10-12', '12-15'],
    tags: ['hypertrophy', 'advanced', '6-day'],
  },
  {
    id: 'ul4',
    name: 'Upper/Lower \u00B7 4 days',
    icon: '\u{1F3CB}\u{FE0F}',
    color: '#3b82f6',
    desc: 'Upper A / Lower A / Rest / Upper B / Lower B / Cardio / Rest. Balanced volume.',
    split: ['Upper A', 'Lower A', 'Rest', 'Upper B', 'Lower B', 'Cardio', 'Rest'],
    fgs: ['push', 'legs', 'rest', 'pull', 'legs', 'cardio', 'rest'],
    goals: ['strength', 'strength', 'recovery', 'hypertrophy', 'hypertrophy', 'endurance', 'recovery'],
    muscles: [
      ['chest', 'ant_delt', 'triceps', 'lats', 'biceps'],
      ['quads', 'hamstrings', 'glutes', 'calves'],
      [],
      ['upper_chest', 'lat_delt', 'rear_delt', 'upper_back', 'biceps'],
      ['quads', 'glutes', 'hamstrings', 'calves'],
      [],
      [],
    ],
    exIds: [
      ['bp', 'row', 'ohp', 'lpd', 'curl', 'tri_p'],
      ['sq', 'rdl', 'lp', 'lc', 'cr'],
      [],
      ['ibp', 'cabl', 'lat_r', 'fp', 'hmr', 'sku'],
      ['sq', 'ht', 'le', 'lc', 'bss'],
      [],
      [],
    ],
    defaultSets: [4, 3, 3, 3],
    defaultReps: ['5', '8-10', '10-12', '12-15'],
    tags: ['balanced', 'intermediate', '4-day'],
  },
  {
    id: 'bro5',
    name: '5-Day Bro Split',
    icon: '\u{1F4AA}',
    color: '#a855f7',
    desc: 'Chest / Back / Shoulders / Arms / Legs / Active Recovery / Rest. Classic bodybuilding.',
    split: ['Chest', 'Back', 'Shoulders', 'Arms', 'Legs', 'Active Recovery', 'Rest'],
    fgs: ['push', 'pull', 'push', 'push', 'legs', 'mobility', 'rest'],
    goals: ['hypertrophy', 'hypertrophy', 'hypertrophy', 'hypertrophy', 'hypertrophy', 'recovery', 'recovery'],
    muscles: [
      ['chest', 'upper_chest', 'lower_chest'],
      ['lats', 'upper_back', 'rear_delt', 'traps'],
      ['ant_delt', 'lat_delt', 'rear_delt'],
      ['biceps', 'triceps', 'forearms'],
      ['quads', 'hamstrings', 'glutes', 'calves'],
      [],
      [],
    ],
    exIds: [
      ['bp', 'ibp', 'dips', 'cfl'],
      ['dl', 'row', 'lpd', 'cabl', 'fp'],
      ['ohp', 'lat_r', 'fp', 'dips'],
      ['curl', 'hmr', 'tri_p', 'sku'],
      ['sq', 'rdl', 'lp', 'le', 'lc', 'cr'],
      [],
      [],
    ],
    defaultSets: [4, 3, 3, 3],
    defaultReps: ['8-10', '10-12', '10-12', '12-15'],
    tags: ['bodybuilding', 'intermediate', '5-day'],
  },
  {
    id: 'fb3',
    name: 'Full Body \u00B7 3 days',
    icon: '\u{1F3C6}',
    color: '#22c55e',
    desc: 'Full Body A / Rest / Full Body B / Rest / Full Body C / Mobility / Rest. Efficient for beginners.',
    split: ['Full Body A', 'Rest', 'Full Body B', 'Rest', 'Full Body C', 'Mobility', 'Rest'],
    fgs: ['fullbody', 'rest', 'fullbody', 'rest', 'fullbody', 'mobility', 'rest'],
    goals: ['strength', 'recovery', 'hypertrophy', 'recovery', 'strength', 'recovery', 'recovery'],
    muscles: [
      ['chest', 'quads', 'lats', 'ant_delt', 'abs'],
      [],
      ['upper_chest', 'hamstrings', 'upper_back', 'glutes', 'obliques'],
      [],
      ['chest', 'quads', 'lats', 'glutes', 'abs'],
      [],
      [],
    ],
    exIds: [
      ['bp', 'sq', 'row', 'ohp', 'plk'],
      [],
      ['ibp', 'rdl', 'lpd', 'ht', 'ab'],
      [],
      ['dips', 'sq', 'pu', 'lat_r', 'abw'],
      [],
      [],
    ],
    defaultSets: [3, 3, 3, 3],
    defaultReps: ['5', '8-10', '8-10', '10-12'],
    tags: ['beginner', 'efficient', '3-day'],
  },
  {
    id: 'str4',
    name: 'Strength \u00B7 4 days',
    icon: '\u{1F3AF}',
    color: '#ef4444',
    desc: 'Squat / Bench / Rest / Deadlift / OHP / Active Recovery / Rest. Powerlifting focus.',
    split: ['Squat', 'Bench', 'Rest', 'Deadlift', 'OHP', 'Active Recovery', 'Rest'],
    fgs: ['legs', 'push', 'rest', 'pull', 'push', 'mobility', 'rest'],
    goals: ['strength', 'strength', 'recovery', 'strength', 'strength', 'recovery', 'recovery'],
    muscles: [
      ['quads', 'glutes', 'hamstrings'],
      ['chest', 'ant_delt', 'triceps'],
      [],
      ['lats', 'upper_back', 'glutes', 'hamstrings'],
      ['ant_delt', 'lat_delt', 'triceps'],
      [],
      [],
    ],
    exIds: [
      ['sq', 'lp', 'le', 'lc', 'plk'],
      ['bp', 'ibp', 'dips', 'tri_p', 'cfl'],
      [],
      ['dl', 'row', 'pu', 'curl', 'fp'],
      ['ohp', 'lat_r', 'fp', 'sku', 'ab'],
      [],
      [],
    ],
    defaultSets: [5, 3, 3, 3],
    defaultReps: ['3-5', '5', '8-10', '8-10'],
    tags: ['powerlifting', 'strength', '4-day'],
  },
  {
    id: 'ath5',
    name: 'Athlete \u00B7 5 days',
    icon: '\u{1F3AF}',
    color: '#06b6d4',
    desc: 'Lower Power / Upper Push / Conditioning / Lower Strength / Upper Pull / Mobility / Rest. Athletic performance.',
    split: ['Lower Power', 'Upper Push', 'Conditioning', 'Lower Strength', 'Upper Pull', 'Mobility', 'Rest'],
    fgs: ['legs', 'push', 'cardio', 'legs', 'pull', 'mobility', 'rest'],
    goals: ['power', 'strength', 'endurance', 'strength', 'hypertrophy', 'recovery', 'recovery'],
    muscles: [
      ['quads', 'glutes', 'hamstrings', 'calves'],
      ['chest', 'ant_delt', 'triceps'],
      [],
      ['quads', 'hamstrings', 'glutes', 'calves'],
      ['lats', 'upper_back', 'biceps', 'rear_delt'],
      [],
      [],
    ],
    exIds: [
      ['sq', 'ht', 'bss', 'cr'],
      ['bp', 'ohp', 'dips', 'lat_r', 'tri_p'],
      [],
      ['sq', 'rdl', 'lp', 'lc', 'le'],
      ['row', 'pu', 'cabl', 'hmr', 'fp'],
      [],
      [],
    ],
    defaultSets: [4, 3, 3, 3],
    defaultReps: ['3-5', '5', '8-10', '10-12'],
    tags: ['athletic', 'performance', '5-day'],
  },
];

// ─── 7. DEFAULT_PLAN ─────────────────────────────────────────────────────────
const DEFAULT_PLAN = {
  name: 'PPL Strength\u2013Hypertrophy',
  startDate: '2026-03-24',
  weeks: 6,
  unit: 'kg',
  gym: 'Goodlife Fitness',
  gymLocation: 'Hyderabad, India',
  days: [
    {
      id: 1,
      name: 'Push A',
      fg: 'push',
      goal: 'strength',
      muscles: ['chest', 'ant_delt', 'triceps'],
      exercises: [
        { exId: 'bp',    sets: 4, reps: '5',     weight: '45',  rest: 240, note: 'Heavy \u2013 warm up to working sets' },
        { exId: 'ohp',   sets: 3, reps: '8',     weight: '30',  rest: 180, note: 'Strict form, no leg drive' },
        { exId: 'lat_r', sets: 3, reps: '12-15', weight: '8',   rest: 90,  note: 'Controlled eccentrics' },
        { exId: 'tri_p', sets: 3, reps: '10-12', weight: '25',  rest: 90,  note: 'Squeeze at bottom' },
        { exId: 'cfl',   sets: 3, reps: '12-15', weight: '12',  rest: 90,  note: 'Stretch and squeeze' },
      ],
    },
    {
      id: 2,
      name: 'Pull A',
      fg: 'pull',
      goal: 'strength',
      muscles: ['lats', 'upper_back', 'biceps'],
      exercises: [
        { exId: 'dl',   sets: 4, reps: '5',     weight: '80',  rest: 300, note: 'Reset each rep, brace core' },
        { exId: 'row',  sets: 3, reps: '8',     weight: '50',  rest: 180, note: 'Controlled pull to navel' },
        { exId: 'pu',   sets: 3, reps: '6-8',   weight: 'BW',  rest: 180, note: 'Full ROM, dead hang start' },
        { exId: 'curl', sets: 3, reps: '10-12', weight: '25',  rest: 90,  note: 'No swinging' },
        { exId: 'fp',   sets: 3, reps: '15',    weight: '15',  rest: 90,  note: 'External rotation at top' },
      ],
    },
    {
      id: 3,
      name: 'Legs A',
      fg: 'legs',
      goal: 'strength',
      muscles: ['quads', 'hamstrings', 'glutes'],
      exercises: [
        { exId: 'sq',  sets: 4, reps: '5',     weight: '60',  rest: 300, note: 'Below parallel, brace hard' },
        { exId: 'rdl', sets: 3, reps: '8',     weight: '50',  rest: 180, note: 'Hinge at hips, soft knees' },
        { exId: 'lp',  sets: 3, reps: '10-12', weight: '100', rest: 120, note: 'Full ROM, no lockout' },
        { exId: 'lc',  sets: 3, reps: '10-12', weight: '30',  rest: 90,  note: 'Slow eccentric 3s' },
        { exId: 'cr',  sets: 3, reps: '15',    weight: '40',  rest: 90,  note: 'Pause at top 2s' },
      ],
    },
    {
      id: 4,
      name: 'Push B',
      fg: 'push',
      goal: 'hypertrophy',
      muscles: ['upper_chest', 'lat_delt', 'triceps'],
      exercises: [
        { exId: 'ibp',   sets: 4, reps: '8-10',  weight: '20',  rest: 150, note: '30\u00B0 incline, squeeze at top' },
        { exId: 'dips',  sets: 3, reps: '8-10',  weight: '+10', rest: 150, note: 'Lean forward for chest bias' },
        { exId: 'lat_r', sets: 4, reps: '12-15', weight: '8',   rest: 90,  note: 'Slight lean, pinky up' },
        { exId: 'sku',   sets: 3, reps: '10-12', weight: '20',  rest: 90,  note: 'Lower to forehead' },
        { exId: 'cfl',   sets: 3, reps: '12-15', weight: '12',  rest: 90,  note: 'Low-to-high angle' },
      ],
    },
    {
      id: 5,
      name: 'Pull B',
      fg: 'pull',
      goal: 'hypertrophy',
      muscles: ['lats', 'rear_delt', 'biceps'],
      exercises: [
        { exId: 'row',  sets: 3, reps: '10-12', weight: '45',  rest: 150, note: 'Wider grip for upper back' },
        { exId: 'lpd',  sets: 3, reps: '10-12', weight: '50',  rest: 120, note: 'Wide grip, lean back slightly' },
        { exId: 'cabl', sets: 3, reps: '10-12', weight: '40',  rest: 120, note: 'Squeeze shoulder blades' },
        { exId: 'hmr',  sets: 3, reps: '10-12', weight: '14',  rest: 90,  note: 'Neutral grip, no swing' },
        { exId: 'fp',   sets: 3, reps: '15',    weight: '12',  rest: 90,  note: 'High rope, pull apart' },
      ],
    },
    {
      id: 6,
      name: 'Legs B',
      fg: 'legs',
      goal: 'hypertrophy',
      muscles: ['quads', 'glutes', 'calves'],
      exercises: [
        { exId: 'sq',  sets: 3, reps: '8-10',  weight: '50',  rest: 180, note: 'Tempo 3-1-1, moderate load' },
        { exId: 'ht',  sets: 3, reps: '10-12', weight: '60',  rest: 120, note: 'Pause 2s at top, squeeze glutes' },
        { exId: 'le',  sets: 3, reps: '12-15', weight: '35',  rest: 90,  note: 'Hold peak contraction 1s' },
        { exId: 'lc',  sets: 3, reps: '10-12', weight: '30',  rest: 90,  note: 'Slow eccentric 3s' },
        { exId: 'bss', sets: 3, reps: '10/leg', weight: '14', rest: 120, note: 'Rear foot elevated on bench' },
      ],
    },
    {
      id: 7,
      name: 'Rest',
      fg: 'rest',
      goal: 'recovery',
      muscles: [],
      exercises: [],
    },
  ],
};

// ─── 8. EQUIP_TYPES ─────────────────────────────────────────────────────────
const EQUIP_TYPES = [
  { id: 'barbell',    ico: '\u{1F3CB}\u{FE0F}', label: 'Barbell' },
  { id: 'dumbbell',   ico: '\u{1F4AA}',          label: 'Dumbbell' },
  { id: 'machine',    ico: '\u{1F529}',          label: 'Machine' },
  { id: 'cable',      ico: '\u{3297}\u{FE0F}',   label: 'Cable' },
  { id: 'bodyweight', ico: '\u{1F938}',          label: 'BW' },
  { id: 'band',       ico: '\u{1F534}',          label: 'Band' },
  { id: 'kettlebell', ico: '\u{1F4AA}',          label: 'KB' },
  { id: 'smith',      ico: '\u{1F9CD}',          label: 'Smith' },
];

// ─── 9. BODY_PARTS_UPPER & BODY_PARTS_LOWER ─────────────────────────────────
const BODY_PARTS_UPPER = [
  { id: 'neck',        ico: '\u{1F9CD}', label: 'Neck' },
  { id: 'l_shoulder',  ico: '\u{1F9BE}', label: 'L Shoulder' },
  { id: 'r_shoulder',  ico: '\u{1F9BE}', label: 'R Shoulder' },
  { id: 'l_elbow',     ico: '\u{1F4AA}', label: 'L Elbow' },
  { id: 'r_elbow',     ico: '\u{1F4AA}', label: 'R Elbow' },
  { id: 'l_wrist',     ico: '\u{270B}',  label: 'L Wrist' },
  { id: 'r_wrist',     ico: '\u{270B}',  label: 'R Wrist' },
  { id: 'chest',       ico: '\u{1FAC1}', label: 'Chest' },
  { id: 'upper_back',  ico: '\u{1FAC1}', label: 'Upper Back' },
  { id: 'lower_back',  ico: '\u{1F519}', label: 'Lower Back' },
];

const BODY_PARTS_LOWER = [
  { id: 'core',         ico: '\u{1F3AF}', label: 'Core' },
  { id: 'hip',          ico: '\u{1F9B4}', label: 'Hip' },
  { id: 'l_knee',       ico: '\u{1F9B5}', label: 'L Knee' },
  { id: 'r_knee',       ico: '\u{1F9B5}', label: 'R Knee' },
  { id: 'l_hamstring',  ico: '\u{1F9B5}', label: 'L Hamstring' },
  { id: 'r_hamstring',  ico: '\u{1F9B5}', label: 'R Hamstring' },
  { id: 'l_quad',       ico: '\u{1F9B5}', label: 'L Quad' },
  { id: 'r_quad',       ico: '\u{1F9B5}', label: 'R Quad' },
  { id: 'calves',       ico: '\u{1F9B5}', label: 'Calves' },
  { id: 'l_ankle',      ico: '\u{1F9B6}', label: 'L Ankle' },
  { id: 'r_ankle',      ico: '\u{1F9B6}', label: 'R Ankle' },
];

// ─── 10. FEELINGS ────────────────────────────────────────────────────────────
const FEELINGS = [
  // Negative
  { id: 'dizzy',       ico: '\u{1F4AB}', label: 'Dizzy',       type: 'neg' },
  { id: 'nausea',      ico: '\u{1F922}', label: 'Nausea',      type: 'neg' },
  { id: 'headache',    ico: '\u{1F915}', label: 'Headache',    type: 'neg' },
  { id: 'palpitations',ico: '\u{1F493}', label: 'Palpitations',type: 'neg' },
  { id: 'breathless',  ico: '\u{1F4A8}', label: 'Breathless',  type: 'neg' },
  { id: 'very_tired',  ico: '\u{1F62B}', label: 'Very Tired',  type: 'neg' },
  { id: 'shaky',       ico: '\u{1FAE8}', label: 'Shaky',       type: 'neg' },
  { id: 'hot_flushed', ico: '\u{1F525}', label: 'Hot/Flushed', type: 'neg' },
  { id: 'anxiety',     ico: '\u{1F630}', label: 'Anxiety',     type: 'neg' },
  // Neutral
  { id: 'tired',       ico: '\u{1F634}', label: 'Tired',       type: 'neu' },
  { id: 'sore',        ico: '\u{1F9D8}', label: 'Sore',        type: 'neu' },
  { id: 'sluggish',    ico: '\u{1F40C}', label: 'Sluggish',    type: 'neu' },
  { id: 'distracted',  ico: '\u{1F914}', label: 'Distracted',  type: 'neu' },
  // Positive
  { id: 'strong',      ico: '\u{1F4AA}', label: 'Strong',      type: 'pos' },
  { id: 'energised',   ico: '\u{26A1}',  label: 'Energised',   type: 'pos' },
  { id: 'focused',     ico: '\u{1F3AF}', label: 'Focused',     type: 'pos' },
  { id: 'great',       ico: '\u{1F929}', label: 'Great',       type: 'pos' },
  { id: 'pumped',      ico: '\u{1F525}', label: 'Pumped',      type: 'pos' },
];

// ─── 11. DEMO_HISTORY_GENERATOR ─────────────────────────────────────────────
function generateDemoHistory(unit) {
  const u = unit || 'kg';
  const conv = u === 'lbs' ? 2.205 : 1;
  const r = (v) => Math.round(v * conv);

  const baseDate = new Date('2026-03-02'); // 4 weeks back from plan start
  const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

  const sessions = [
    // Week 1
    {
      offset: 0, dayName: 'Mon', fg: 'push', goal: 'strength',
      duration: 62, totalSets: 16, avgRPE: 7.5, prs: 0,
      notes: 'First session. Felt a bit rusty, focused on form.',
      exercises: [
        { exId: 'bp',    sets: [{ reps: 5, wt: r(40), rpe: 7 }, { reps: 5, wt: r(40), rpe: 7.5 }, { reps: 5, wt: r(40), rpe: 8 }, { reps: 4, wt: r(40), rpe: 8.5 }] },
        { exId: 'ohp',   sets: [{ reps: 8, wt: r(25), rpe: 7 }, { reps: 8, wt: r(25), rpe: 7.5 }, { reps: 7, wt: r(25), rpe: 8 }] },
        { exId: 'lat_r', sets: [{ reps: 12, wt: r(6), rpe: 7 }, { reps: 12, wt: r(6), rpe: 7 }, { reps: 10, wt: r(6), rpe: 7.5 }] },
        { exId: 'tri_p', sets: [{ reps: 10, wt: r(20), rpe: 7 }, { reps: 10, wt: r(20), rpe: 7.5 }, { reps: 9, wt: r(20), rpe: 8 }] },
        { exId: 'cfl',   sets: [{ reps: 12, wt: r(10), rpe: 7 }, { reps: 12, wt: r(10), rpe: 7 }, { reps: 11, wt: r(10), rpe: 7.5 }] },
      ],
    },
    {
      offset: 1, dayName: 'Tue', fg: 'pull', goal: 'strength',
      duration: 68, totalSets: 16, avgRPE: 7.8, prs: 0,
      notes: 'Good back session. Grip felt strong.',
      exercises: [
        { exId: 'dl',   sets: [{ reps: 5, wt: r(70), rpe: 7 }, { reps: 5, wt: r(70), rpe: 7.5 }, { reps: 5, wt: r(70), rpe: 8 }, { reps: 4, wt: r(70), rpe: 8.5 }] },
        { exId: 'row',  sets: [{ reps: 8, wt: r(45), rpe: 7 }, { reps: 8, wt: r(45), rpe: 7.5 }, { reps: 7, wt: r(45), rpe: 8 }] },
        { exId: 'pu',   sets: [{ reps: 6, wt: 0, rpe: 8 }, { reps: 5, wt: 0, rpe: 8.5 }, { reps: 5, wt: 0, rpe: 8.5 }] },
        { exId: 'curl', sets: [{ reps: 10, wt: r(20), rpe: 7 }, { reps: 10, wt: r(20), rpe: 7.5 }, { reps: 9, wt: r(20), rpe: 8 }] },
        { exId: 'fp',   sets: [{ reps: 15, wt: r(12), rpe: 7 }, { reps: 15, wt: r(12), rpe: 7 }, { reps: 13, wt: r(12), rpe: 7.5 }] },
      ],
    },
    {
      offset: 2, dayName: 'Wed', fg: 'legs', goal: 'strength',
      duration: 65, totalSets: 16, avgRPE: 8.0, prs: 0,
      notes: 'Squats felt heavy. Need to work on depth.',
      exercises: [
        { exId: 'sq',  sets: [{ reps: 5, wt: r(50), rpe: 7.5 }, { reps: 5, wt: r(50), rpe: 8 }, { reps: 5, wt: r(50), rpe: 8 }, { reps: 4, wt: r(50), rpe: 8.5 }] },
        { exId: 'rdl', sets: [{ reps: 8, wt: r(45), rpe: 7.5 }, { reps: 8, wt: r(45), rpe: 8 }, { reps: 7, wt: r(45), rpe: 8 }] },
        { exId: 'lp',  sets: [{ reps: 10, wt: r(80), rpe: 7 }, { reps: 10, wt: r(80), rpe: 7.5 }, { reps: 10, wt: r(80), rpe: 7.5 }] },
        { exId: 'lc',  sets: [{ reps: 10, wt: r(25), rpe: 7 }, { reps: 10, wt: r(25), rpe: 7.5 }, { reps: 9, wt: r(25), rpe: 8 }] },
        { exId: 'cr',  sets: [{ reps: 15, wt: r(35), rpe: 7 }, { reps: 15, wt: r(35), rpe: 7 }, { reps: 12, wt: r(35), rpe: 7.5 }] },
      ],
    },
    // Week 2
    {
      offset: 7, dayName: 'Mon', fg: 'push', goal: 'strength',
      duration: 60, totalSets: 16, avgRPE: 7.8, prs: 1,
      notes: 'Bench felt smoother. Hit 5x5 at 42.5 cleanly.',
      exercises: [
        { exId: 'bp',    sets: [{ reps: 5, wt: r(42.5), rpe: 7.5 }, { reps: 5, wt: r(42.5), rpe: 7.5 }, { reps: 5, wt: r(42.5), rpe: 8 }, { reps: 5, wt: r(42.5), rpe: 8 }] },
        { exId: 'ohp',   sets: [{ reps: 8, wt: r(27.5), rpe: 7.5 }, { reps: 8, wt: r(27.5), rpe: 8 }, { reps: 7, wt: r(27.5), rpe: 8 }] },
        { exId: 'lat_r', sets: [{ reps: 12, wt: r(7), rpe: 7 }, { reps: 12, wt: r(7), rpe: 7.5 }, { reps: 11, wt: r(7), rpe: 7.5 }] },
        { exId: 'tri_p', sets: [{ reps: 10, wt: r(22), rpe: 7.5 }, { reps: 10, wt: r(22), rpe: 7.5 }, { reps: 10, wt: r(22), rpe: 8 }] },
        { exId: 'cfl',   sets: [{ reps: 12, wt: r(10), rpe: 7 }, { reps: 12, wt: r(10), rpe: 7 }, { reps: 12, wt: r(10), rpe: 7 }] },
      ],
    },
    {
      offset: 8, dayName: 'Tue', fg: 'pull', goal: 'strength',
      duration: 70, totalSets: 16, avgRPE: 8.0, prs: 1,
      notes: 'Deadlift PR! 75 x 5 felt solid.',
      exercises: [
        { exId: 'dl',   sets: [{ reps: 5, wt: r(75), rpe: 8 }, { reps: 5, wt: r(75), rpe: 8 }, { reps: 5, wt: r(75), rpe: 8.5 }, { reps: 4, wt: r(75), rpe: 9 }] },
        { exId: 'row',  sets: [{ reps: 8, wt: r(47.5), rpe: 7.5 }, { reps: 8, wt: r(47.5), rpe: 8 }, { reps: 7, wt: r(47.5), rpe: 8 }] },
        { exId: 'pu',   sets: [{ reps: 7, wt: 0, rpe: 8 }, { reps: 6, wt: 0, rpe: 8.5 }, { reps: 5, wt: 0, rpe: 8.5 }] },
        { exId: 'curl', sets: [{ reps: 10, wt: r(22), rpe: 7.5 }, { reps: 10, wt: r(22), rpe: 8 }, { reps: 9, wt: r(22), rpe: 8 }] },
        { exId: 'fp',   sets: [{ reps: 15, wt: r(12), rpe: 7 }, { reps: 15, wt: r(12), rpe: 7 }, { reps: 14, wt: r(12), rpe: 7.5 }] },
      ],
    },
    {
      offset: 9, dayName: 'Wed', fg: 'legs', goal: 'strength',
      duration: 67, totalSets: 16, avgRPE: 8.2, prs: 0,
      notes: 'Better depth on squats today. Hamstrings tight from yesterday.',
      exercises: [
        { exId: 'sq',  sets: [{ reps: 5, wt: r(52.5), rpe: 8 }, { reps: 5, wt: r(52.5), rpe: 8 }, { reps: 5, wt: r(52.5), rpe: 8.5 }, { reps: 4, wt: r(52.5), rpe: 9 }] },
        { exId: 'rdl', sets: [{ reps: 8, wt: r(47.5), rpe: 8 }, { reps: 8, wt: r(47.5), rpe: 8 }, { reps: 7, wt: r(47.5), rpe: 8.5 }] },
        { exId: 'lp',  sets: [{ reps: 10, wt: r(85), rpe: 7.5 }, { reps: 10, wt: r(85), rpe: 8 }, { reps: 9, wt: r(85), rpe: 8 }] },
        { exId: 'lc',  sets: [{ reps: 10, wt: r(27), rpe: 7.5 }, { reps: 10, wt: r(27), rpe: 8 }, { reps: 10, wt: r(27), rpe: 8 }] },
        { exId: 'cr',  sets: [{ reps: 15, wt: r(37), rpe: 7 }, { reps: 15, wt: r(37), rpe: 7.5 }, { reps: 13, wt: r(37), rpe: 7.5 }] },
      ],
    },
    // Week 3
    {
      offset: 14, dayName: 'Mon', fg: 'push', goal: 'strength',
      duration: 58, totalSets: 16, avgRPE: 8.0, prs: 1,
      notes: 'Bench PR \u2013 45 x 5 all sets clean!',
      exercises: [
        { exId: 'bp',    sets: [{ reps: 5, wt: r(45), rpe: 7.5 }, { reps: 5, wt: r(45), rpe: 8 }, { reps: 5, wt: r(45), rpe: 8 }, { reps: 5, wt: r(45), rpe: 8.5 }] },
        { exId: 'ohp',   sets: [{ reps: 8, wt: r(30), rpe: 8 }, { reps: 8, wt: r(30), rpe: 8 }, { reps: 7, wt: r(30), rpe: 8.5 }] },
        { exId: 'lat_r', sets: [{ reps: 12, wt: r(8), rpe: 7 }, { reps: 12, wt: r(8), rpe: 7.5 }, { reps: 12, wt: r(8), rpe: 7.5 }] },
        { exId: 'tri_p', sets: [{ reps: 12, wt: r(22), rpe: 7.5 }, { reps: 11, wt: r(22), rpe: 8 }, { reps: 10, wt: r(22), rpe: 8 }] },
        { exId: 'cfl',   sets: [{ reps: 12, wt: r(12), rpe: 7 }, { reps: 12, wt: r(12), rpe: 7.5 }, { reps: 12, wt: r(12), rpe: 7.5 }] },
      ],
    },
    {
      offset: 15, dayName: 'Tue', fg: 'pull', goal: 'hypertrophy',
      duration: 65, totalSets: 16, avgRPE: 7.8, prs: 0,
      notes: 'Switched to hypertrophy rep range for pull day. Good pump.',
      exercises: [
        { exId: 'row',  sets: [{ reps: 10, wt: r(45), rpe: 7.5 }, { reps: 10, wt: r(45), rpe: 8 }, { reps: 9, wt: r(45), rpe: 8 }] },
        { exId: 'lpd',  sets: [{ reps: 10, wt: r(45), rpe: 7 }, { reps: 10, wt: r(45), rpe: 7.5 }, { reps: 10, wt: r(45), rpe: 7.5 }] },
        { exId: 'cabl', sets: [{ reps: 10, wt: r(35), rpe: 7 }, { reps: 10, wt: r(35), rpe: 7.5 }, { reps: 10, wt: r(35), rpe: 7.5 }] },
        { exId: 'hmr',  sets: [{ reps: 12, wt: r(12), rpe: 7.5 }, { reps: 10, wt: r(12), rpe: 8 }, { reps: 10, wt: r(12), rpe: 8 }] },
        { exId: 'fp',   sets: [{ reps: 15, wt: r(12), rpe: 7 }, { reps: 15, wt: r(12), rpe: 7 }, { reps: 15, wt: r(12), rpe: 7 }] },
      ],
    },
    {
      offset: 16, dayName: 'Wed', fg: 'legs', goal: 'hypertrophy',
      duration: 63, totalSets: 16, avgRPE: 8.0, prs: 0,
      notes: 'Higher rep squats. Quads on fire.',
      exercises: [
        { exId: 'sq',  sets: [{ reps: 8, wt: r(50), rpe: 8 }, { reps: 8, wt: r(50), rpe: 8 }, { reps: 7, wt: r(50), rpe: 8.5 }] },
        { exId: 'ht',  sets: [{ reps: 10, wt: r(50), rpe: 7.5 }, { reps: 10, wt: r(50), rpe: 8 }, { reps: 10, wt: r(50), rpe: 8 }] },
        { exId: 'le',  sets: [{ reps: 12, wt: r(30), rpe: 7.5 }, { reps: 12, wt: r(30), rpe: 8 }, { reps: 11, wt: r(30), rpe: 8 }] },
        { exId: 'lc',  sets: [{ reps: 12, wt: r(27), rpe: 7.5 }, { reps: 10, wt: r(27), rpe: 8 }, { reps: 10, wt: r(27), rpe: 8 }] },
        { exId: 'bss', sets: [{ reps: 10, wt: r(12), rpe: 8 }, { reps: 10, wt: r(12), rpe: 8 }, { reps: 8, wt: r(12), rpe: 8.5 }, { reps: 8, wt: r(12), rpe: 8.5 }] },
      ],
    },
    // Week 4
    {
      offset: 21, dayName: 'Mon', fg: 'push', goal: 'strength',
      duration: 64, totalSets: 16, avgRPE: 8.2, prs: 1,
      notes: 'Bench 47.5 x 5 \u2013 new 5RM! Shoulders feel great.',
      exercises: [
        { exId: 'bp',    sets: [{ reps: 5, wt: r(47.5), rpe: 8 }, { reps: 5, wt: r(47.5), rpe: 8 }, { reps: 5, wt: r(47.5), rpe: 8.5 }, { reps: 4, wt: r(47.5), rpe: 9 }] },
        { exId: 'ohp',   sets: [{ reps: 8, wt: r(32), rpe: 8 }, { reps: 7, wt: r(32), rpe: 8.5 }, { reps: 7, wt: r(32), rpe: 8.5 }] },
        { exId: 'lat_r', sets: [{ reps: 15, wt: r(8), rpe: 7.5 }, { reps: 14, wt: r(8), rpe: 7.5 }, { reps: 12, wt: r(8), rpe: 8 }] },
        { exId: 'tri_p', sets: [{ reps: 12, wt: r(25), rpe: 8 }, { reps: 10, wt: r(25), rpe: 8.5 }, { reps: 10, wt: r(25), rpe: 8.5 }] },
        { exId: 'cfl',   sets: [{ reps: 12, wt: r(12), rpe: 7 }, { reps: 12, wt: r(12), rpe: 7.5 }, { reps: 12, wt: r(12), rpe: 7.5 }] },
      ],
    },
    {
      offset: 22, dayName: 'Tue', fg: 'pull', goal: 'strength',
      duration: 72, totalSets: 16, avgRPE: 8.2, prs: 1,
      notes: 'Deadlift 80 x 5! Rows moving up too.',
      exercises: [
        { exId: 'dl',   sets: [{ reps: 5, wt: r(80), rpe: 8 }, { reps: 5, wt: r(80), rpe: 8.5 }, { reps: 5, wt: r(80), rpe: 8.5 }, { reps: 4, wt: r(80), rpe: 9 }] },
        { exId: 'row',  sets: [{ reps: 8, wt: r(50), rpe: 8 }, { reps: 8, wt: r(50), rpe: 8 }, { reps: 7, wt: r(50), rpe: 8.5 }] },
        { exId: 'pu',   sets: [{ reps: 8, wt: 0, rpe: 8 }, { reps: 7, wt: 0, rpe: 8.5 }, { reps: 6, wt: 0, rpe: 9 }] },
        { exId: 'curl', sets: [{ reps: 10, wt: r(25), rpe: 8 }, { reps: 10, wt: r(25), rpe: 8 }, { reps: 9, wt: r(25), rpe: 8.5 }] },
        { exId: 'fp',   sets: [{ reps: 15, wt: r(15), rpe: 7.5 }, { reps: 15, wt: r(15), rpe: 7.5 }, { reps: 14, wt: r(15), rpe: 8 }] },
      ],
    },
    {
      offset: 23, dayName: 'Wed', fg: 'legs', goal: 'strength',
      duration: 70, totalSets: 16, avgRPE: 8.5, prs: 1,
      notes: 'Squat 60 x 5 \u2013 all clean reps. Great session!',
      exercises: [
        { exId: 'sq',  sets: [{ reps: 5, wt: r(60), rpe: 8 }, { reps: 5, wt: r(60), rpe: 8.5 }, { reps: 5, wt: r(60), rpe: 8.5 }, { reps: 5, wt: r(60), rpe: 9 }] },
        { exId: 'rdl', sets: [{ reps: 8, wt: r(50), rpe: 8 }, { reps: 8, wt: r(50), rpe: 8.5 }, { reps: 7, wt: r(50), rpe: 8.5 }] },
        { exId: 'lp',  sets: [{ reps: 10, wt: r(90), rpe: 8 }, { reps: 10, wt: r(90), rpe: 8 }, { reps: 9, wt: r(90), rpe: 8.5 }] },
        { exId: 'lc',  sets: [{ reps: 10, wt: r(30), rpe: 8 }, { reps: 10, wt: r(30), rpe: 8 }, { reps: 10, wt: r(30), rpe: 8.5 }] },
        { exId: 'cr',  sets: [{ reps: 15, wt: r(40), rpe: 7.5 }, { reps: 15, wt: r(40), rpe: 8 }, { reps: 13, wt: r(40), rpe: 8 }] },
      ],
    },
  ];

  return sessions.map(function (s, i) {
    var d = new Date(baseDate);
    d.setDate(d.getDate() + s.offset);

    var totalVol = 0;
    var totalSetsActual = 0;
    s.exercises.forEach(function (ex) {
      ex.sets.forEach(function (set) {
        totalVol += set.reps * set.wt;
        totalSetsActual++;
      });
    });

    return {
      id: 'demo_' + (i + 1),
      date: d.toISOString().slice(0, 10),
      dateTs: d.getTime(),
      dayName: s.dayName,
      fg: s.fg,
      goal: s.goal,
      unit: u,
      gym: 'Goodlife Fitness',
      gymLoc: 'Hyderabad, India',
      duration: s.duration,
      totalSets: totalSetsActual,
      totalVol: totalVol,
      avgRPE: s.avgRPE,
      prs: s.prs,
      notes: s.notes,
      exercises: s.exercises,
    };
  });
}

// ─── 12. DAY_NAMES ───────────────────────────────────────────────────────────
const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

// ─── EXPORTS ─────────────────────────────────────────────────────────────────
module.exports = {
  EXERCISES_DB,
  FUNC_GROUPS,
  MUSCLES,
  MUSCLE_BY_FG,
  GOALS,
  PLAN_TEMPLATES,
  DEFAULT_PLAN,
  EQUIP_TYPES,
  BODY_PARTS_UPPER,
  BODY_PARTS_LOWER,
  FEELINGS,
  generateDemoHistory,
  DAY_NAMES,
};
