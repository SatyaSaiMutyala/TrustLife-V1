const Colors = require('./colors').default || require('./colors');

/* ───────────────────────────────────────────────────────
   A – H  FITNESS CATEGORIES  +  SUB-CATEGORIES
   ─────────────────────────────────────────────────────── */

const CATEGORIES = {
  A: {
    name: 'Movement / Activity',
    color: Colors.teal,
    ico: '🏃',
    desc: 'Everyday movement — walking, cycling, stairs, gardening and more.',
    subcats: [
      {
        id: 'walk-slow',
        name: 'Leisurely walk',
        ico: '🚶',
        sub: '<5 km/h · Casual pace',
        tags: ['Low intensity', 'Aerobic'],
        kcal_per_min: 3.2,
        met: 2.5,
        biomarkers: ['Steps', 'Distance', 'HR Zone 1', 'Glucose'],
      },
      {
        id: 'walk-brisk',
        name: 'Brisk walk',
        ico: '🚶‍♂️',
        sub: '5–6.5 km/h · Elevated HR',
        tags: ['Moderate', 'Aerobic'],
        kcal_per_min: 4.8,
        met: 3.5,
        biomarkers: ['Steps', 'Distance', 'HR Zone 2', 'Glucose', 'Insulin sensitivity'],
      },
      {
        id: 'walk-nordic',
        name: 'Nordic walking',
        ico: '🥢',
        sub: 'Poles · Upper body + core engaged',
        tags: ['Moderate', 'Full body'],
        kcal_per_min: 5.5,
        met: 4.8,
        biomarkers: ['Steps', 'HR Zone 2', 'Upper body'],
      },
      {
        id: 'climb-stairs',
        name: 'Stair climbing',
        ico: '🪜',
        sub: 'Floors climbed · Lower body + cardio',
        tags: ['Moderate', 'Legs'],
        kcal_per_min: 8.0,
        met: 6.0,
        biomarkers: ['Floors', 'HR Zone 2–3', 'Glucose'],
      },
      {
        id: 'cycling-leisure',
        name: 'Leisure cycling',
        ico: '🚴',
        sub: 'Easy pace · Recreational',
        tags: ['Low-Mod', 'Cardio'],
        kcal_per_min: 5.0,
        met: 4.0,
        biomarkers: ['Distance', 'Cadence', 'HR Zone 1–2'],
      },
      {
        id: 'gardening',
        name: 'Gardening / yard work',
        ico: '🌱',
        sub: 'Digging · Raking · Planting',
        tags: ['Mod', 'Functional'],
        kcal_per_min: 4.0,
        met: 3.5,
        biomarkers: ['Active minutes', 'Steps'],
      },
    ],
  },

  B: {
    name: 'Cardio / Endurance',
    color: Colors.blue,
    ico: '❤️',
    desc: 'Sustained aerobic effort — running, swimming, rowing, jump rope and more.',
    subcats: [
      {
        id: 'jog',
        name: 'Jogging',
        ico: '🏃',
        sub: '6–8 km/h · Moderate effort',
        tags: ['Moderate', 'Aerobic', 'Zone 2–3'],
        kcal_per_min: 9.5,
        met: 8.0,
        biomarkers: ['Distance', 'Pace', 'HR Zone 2–3', 'VO₂max est.', 'Glucose'],
      },
      {
        id: 'run',
        name: 'Running',
        ico: '🏃‍♂️',
        sub: '8–12 km/h · Structured training',
        tags: ['High', 'Aerobic', 'Zone 3–4'],
        kcal_per_min: 12.0,
        met: 10.5,
        biomarkers: ['Distance', 'Pace', 'Cadence', 'HR Zone 3–4', 'VO₂max', 'Lactate threshold'],
      },
      {
        id: 'run-pro',
        name: 'Performance running',
        ico: '⚡',
        sub: '>12 km/h · Structured intervals',
        tags: ['Very High', 'Zone 4–5'],
        kcal_per_min: 15.5,
        met: 13.5,
        biomarkers: ['Pace/km', 'HR Zone 4–5', 'VO₂max', 'Lactate', 'Power'],
      },
      {
        id: 'cycling-cardio',
        name: 'Cycling (cardio)',
        ico: '🚴‍♂️',
        sub: 'Moderate–high effort · 20+ km/h',
        tags: ['Moderate-High', 'Aerobic'],
        kcal_per_min: 10.0,
        met: 8.5,
        biomarkers: ['Distance', 'Power (W)', 'Cadence', 'HR Zone 3', 'VO₂max est.'],
      },
      {
        id: 'swimming',
        name: 'Swimming laps',
        ico: '🏊',
        sub: 'Freestyle / breaststroke · Continuous',
        tags: ['Moderate-High', 'Full body'],
        kcal_per_min: 11.0,
        met: 9.5,
        biomarkers: ['Laps', 'Stroke rate', 'HR (est.)', 'VO₂max'],
      },
      {
        id: 'rowing',
        name: 'Rowing / Ergometer',
        ico: '🚣',
        sub: 'Full body · Pull-dominant',
        tags: ['High', 'Full body', 'Zone 2–4'],
        kcal_per_min: 9.8,
        met: 8.5,
        biomarkers: ['Distance', 'Stroke rate', '500m split', 'HR Zone 3', 'Power (W)'],
      },
      {
        id: 'jump-rope',
        name: 'Jump rope / skipping',
        ico: '🪢',
        sub: 'Continuous · High cardiovascular demand',
        tags: ['High', 'Cardio', 'Coordination'],
        kcal_per_min: 13.0,
        met: 11.0,
        biomarkers: ['Jumps/min', 'HR Zone 3–4'],
      },
      {
        id: 'elliptical',
        name: 'Elliptical trainer',
        ico: '㊗️',
        sub: 'Low-impact · Cardio',
        tags: ['Moderate', 'Low impact'],
        kcal_per_min: 8.0,
        met: 7.0,
        biomarkers: ['Strides/min', 'Resistance', 'HR Zone 2–3'],
      },
    ],
  },

  C: {
    name: 'Strength / Resistance',
    color: Colors.purple,
    ico: '🏋️',
    desc: 'Resistance training — free weights, machines, bands, bodyweight and kettlebells.',
    subcats: [
      {
        id: 'strength-free',
        name: 'Free weights',
        ico: '🏋️',
        sub: 'Dumbbell / Barbell · Compound + isolation',
        tags: ['Strength', 'Hypertrophy'],
        kcal_per_min: 6.0,
        met: 5.0,
        biomarkers: ['Volume load', 'Estimated 1RM', 'Muscle activation', 'Cortisol', 'Testosterone'],
      },
      {
        id: 'strength-machine',
        name: 'Machine training',
        ico: '🔩',
        sub: 'Guided path · Isolation focus',
        tags: ['Hypertrophy', 'Rehab'],
        kcal_per_min: 5.0,
        met: 4.5,
        biomarkers: ['Volume load', '1RM est.', 'Muscle group balance'],
      },
      {
        id: 'bodyweight',
        name: 'Bodyweight training',
        ico: '💪',
        sub: 'Push-ups · Pull-ups · Dips',
        tags: ['Functional', 'Endurance'],
        kcal_per_min: 7.0,
        met: 5.5,
        biomarkers: ['Volume', 'RPE', 'Muscle endurance'],
      },
      {
        id: 'powerlifting',
        name: 'Powerlifting / Olympic',
        ico: '🥇',
        sub: 'Squat · Bench · Deadlift · Snatch',
        tags: ['Max strength', 'Power'],
        kcal_per_min: 6.5,
        met: 6.0,
        biomarkers: ['1RM', 'Power output', 'Neural adaptation'],
      },
      {
        id: 'resistance-band',
        name: 'Resistance bands',
        ico: '🔴',
        sub: 'Variable resistance · Rehab friendly',
        tags: ['Rehab', 'Toning'],
        kcal_per_min: 4.5,
        met: 3.5,
        biomarkers: ['Band resistance', 'Volume'],
      },
      {
        id: 'kettlebell',
        name: 'Kettlebell training',
        ico: '🫗',
        sub: 'Swings · Turkish get-ups · Hybrid',
        tags: ['Functional', 'Cardio-Strength'],
        kcal_per_min: 12.0,
        met: 9.8,
        biomarkers: ['Volume', 'HR Zone 3', 'Posterior chain', 'Core'],
      },
    ],
  },

  D: {
    name: 'Flexibility & Mobility',
    color: Colors.amber,
    ico: '🤸',
    desc: 'Stretching, foam rolling, Pilates, joint mobility and barre.',
    subcats: [
      {
        id: 'static-stretch',
        name: 'Static stretching',
        ico: '🤸',
        sub: 'Hold 20–60s · Passive lengthening',
        tags: ['Recovery', 'Flexibility'],
        kcal_per_min: 2.5,
        met: 2.0,
        biomarkers: ['ROM', 'Flexibility score', 'Parasympathetic HRV'],
      },
      {
        id: 'dynamic-stretch',
        name: 'Dynamic stretching / warm-up',
        ico: '🌀',
        sub: 'Controlled movement · Pre-workout',
        tags: ['Warm-up', 'Mobility'],
        kcal_per_min: 4.0,
        met: 3.5,
        biomarkers: ['ROM', 'HR preparation'],
      },
      {
        id: 'foam-roll',
        name: 'Foam rolling / SMR',
        ico: '🫧',
        sub: 'Myofascial release · Trigger points',
        tags: ['Recovery', 'Fascia'],
        kcal_per_min: 2.0,
        met: 1.8,
        biomarkers: ['Soreness score', 'Muscle tightness', 'Recovery rate'],
      },
      {
        id: 'pilates',
        name: 'Pilates',
        ico: '🧘‍♀️',
        sub: 'Core stability · Controlled movement',
        tags: ['Core', 'Posture', 'Low-impact'],
        kcal_per_min: 5.0,
        met: 4.5,
        biomarkers: ['Core strength', 'Postural alignment', 'Balance'],
      },
      {
        id: 'mobility-drill',
        name: 'Joint mobility drills',
        ico: '⚙️',
        sub: 'Circles · CARs · Loaded stretching',
        tags: ['Mobility', 'Injury prevention'],
        kcal_per_min: 3.5,
        met: 3.0,
        biomarkers: ['Joint ROM', 'Proprioception'],
      },
      {
        id: 'barre',
        name: 'Barre / ballet fitness',
        ico: '🩰',
        sub: 'Isometric holds · Flexibility + strength',
        tags: ['Moderate', 'Flexibility', 'Tone'],
        kcal_per_min: 5.5,
        met: 4.8,
        biomarkers: ['Balance', 'Flexibility', 'Lower body tone'],
      },
    ],
  },

  E: {
    name: 'Mind-Body / Recovery',
    color: '#ec4899',
    ico: '🧘',
    desc: 'Yoga, meditation, breathwork, Tai Chi and deep recovery practices.',
    subcats: [
      {
        id: 'hatha',
        name: 'Hatha Yoga',
        ico: '🧘',
        sub: 'Slow · Held poses · Deep flexibility',
        tags: ['Flexibility', 'Parasympathetic', 'Low HR'],
        kcal_per_min: 3.5,
        met: 2.8,
        biomarkers: ['HRV', 'Cortisol\u2193', 'Flexibility', 'Blood pressure', 'Parasympathetic tone'],
      },
      {
        id: 'vinyasa',
        name: 'Vinyasa Yoga',
        ico: '🌊',
        sub: 'Flow-based · Cardio + flexibility',
        tags: ['Moderate cardio', 'Flow', 'Core'],
        kcal_per_min: 7.0,
        met: 5.5,
        biomarkers: ['HR Zone 2–3', 'Flexibility', 'Core strength', 'HRV'],
      },
      {
        id: 'power-yoga',
        name: 'Power Yoga',
        ico: '⚡',
        sub: 'Strength + cardio · High demand',
        tags: ['High', 'Strength', 'Cardio'],
        kcal_per_min: 9.0,
        met: 7.0,
        biomarkers: ['HR Zone 3', 'Strength', 'Muscle endurance', 'Glucose'],
      },
      {
        id: 'yin-yoga',
        name: 'Yin Yoga',
        ico: '🌙',
        sub: 'Deep passive stretch · 3–10 min holds',
        tags: ['Deep recovery', 'Fascia', 'Parasympathetic'],
        kcal_per_min: 2.5,
        met: 1.8,
        biomarkers: ['HRV\u2191', 'Cortisol\u2193', 'Fascia flexibility', 'Parasympathetic', 'Sleep quality'],
      },
      {
        id: 'pranayama',
        name: 'Pranayama',
        ico: '🌬️',
        sub: 'Breathing exercises only · No postures',
        tags: ['Breathing', 'Stress\u2193', 'HRV\u2191'],
        kcal_per_min: 1.8,
        met: 1.5,
        biomarkers: ['HRV\u2191', 'Cortisol\u2193', 'SpO\u2082', 'Blood pressure\u2193', 'Stress markers'],
      },
      {
        id: 'meditation',
        name: 'Meditation',
        ico: '🕯️',
        sub: 'Mindfulness · Body scan · Guided',
        tags: ['Stress\u2193', 'Cognitive', 'Recovery'],
        kcal_per_min: 1.2,
        met: 1.3,
        biomarkers: ['HRV\u2191', 'Cortisol\u2193', 'Inflammatory markers\u2193', 'Sleep quality', 'Cognitive function'],
      },
      {
        id: 'tai-chi',
        name: 'Tai Chi / Qigong',
        ico: '☯️',
        sub: 'Slow flowing movement · Balance + breathing',
        tags: ['Gentle', 'Balance', 'Mindful movement'],
        kcal_per_min: 3.0,
        met: 2.5,
        biomarkers: ['Balance', 'Blood pressure\u2193', 'HRV\u2191', 'Fall risk\u2193'],
      },
      {
        id: 'savasana',
        name: 'Yoga Nidra / Savasana',
        ico: '😴',
        sub: 'Conscious relaxation · Recovery state',
        tags: ['Deep recovery', 'NS reset'],
        kcal_per_min: 1.0,
        met: 1.0,
        biomarkers: ['Cortisol\u2193', 'HRV\u2191', 'Deep rest markers'],
      },
    ],
  },

  F: {
    name: 'High-Intensity / Performance',
    color: Colors.red,
    ico: '⚡',
    desc: 'HIIT, Tabata, CrossFit, plyometrics and sprint intervals.',
    subcats: [
      {
        id: 'hiit',
        name: 'HIIT (generic)',
        ico: '⚡',
        sub: '20–40s work / 10–20s rest · Repeated',
        tags: ['High', 'Zone 4–5', 'EPOC'],
        kcal_per_min: 14.0,
        met: 12.0,
        biomarkers: ['HR Zone 4–5', 'EPOC', 'VO₂max', 'Glucose', 'Lactate', 'EPOC (48h afterburn)'],
      },
      {
        id: 'tabata',
        name: 'Tabata protocol',
        ico: '🔥',
        sub: '20s on / 10s off × 8 rounds · 4 min',
        tags: ['Max intensity', 'Zone 5', '<4 min'],
        kcal_per_min: 18.0,
        met: 15.0,
        biomarkers: ['HR max', 'VO₂max peak', 'Lactate', 'Epinephrine', 'EPOC'],
      },
      {
        id: 'circuit',
        name: 'Circuit training',
        ico: '🔄',
        sub: 'Station-to-station · No rest',
        tags: ['High', 'Full body', 'Cardio-strength'],
        kcal_per_min: 11.0,
        met: 9.5,
        biomarkers: ['HR Zone 3–4', 'Volume', 'Full body activation', 'Glucose'],
      },
      {
        id: 'crossfit',
        name: 'CrossFit / WOD',
        ico: '🏆',
        sub: 'Benchmark workouts · Functional + HIIT',
        tags: ['Very High', 'Functional', 'Competitive'],
        kcal_per_min: 15.0,
        met: 13.0,
        biomarkers: ['HR max', 'Volume load', 'Power output', 'Cortisol', 'Testosterone'],
      },
      {
        id: 'plyometrics',
        name: 'Plyometrics',
        ico: '🦘',
        sub: 'Jump training · Power development',
        tags: ['Power', 'High impact', 'Explosive'],
        kcal_per_min: 12.0,
        met: 10.5,
        biomarkers: ['Power output', 'Ground contact time', 'HR Zone 4'],
      },
      {
        id: 'sprint-intervals',
        name: 'Sprint intervals',
        ico: '💨',
        sub: 'Max effort sprints · 10–60s with full recovery',
        tags: ['Max', 'Anaerobic', 'Speed'],
        kcal_per_min: 17.0,
        met: 14.5,
        biomarkers: ['HR max', 'Lactate', 'Speed (m/s)', 'Power', 'EPOC', 'Testosterone'],
      },
    ],
  },

  G: {
    name: 'Sports-Based',
    color: '#0891b2',
    ico: '🏅',
    desc: 'Structured sports — badminton, cricket, football, swimming, tennis, martial arts and basketball.',
    subcats: [
      {
        id: 'badminton',
        name: 'Badminton',
        ico: '🏸',
        sub: 'Singles / doubles · Competitive or casual',
        tags: ['Mod-High', 'Agility', 'Cardio'],
        kcal_per_min: 8.0,
        met: 7.0,
        biomarkers: ['HR Zone 2–4', 'Agility', 'Steps', 'Lateral movement'],
      },
      {
        id: 'cricket',
        name: 'Cricket',
        ico: '🏏',
        sub: 'Batting · Bowling · Fielding · Separate logs',
        tags: ['Intermittent', 'Variable'],
        kcal_per_min: 5.0,
        met: 4.5,
        biomarkers: ['Sprints count', 'HR zones', 'Bowling mechanics'],
      },
      {
        id: 'football',
        name: 'Football / Soccer',
        ico: '⚽',
        sub: 'Indoor or outdoor · 11-a-side or 5-a-side',
        tags: ['High', 'Intermittent sprint', 'Team'],
        kcal_per_min: 10.0,
        met: 9.0,
        biomarkers: ['Distance', 'Sprints', 'HR Zone 3–4', 'Agility'],
      },
      {
        id: 'swimming-sport',
        name: 'Competitive swimming',
        ico: '🏊‍♂️',
        sub: 'Timed laps · Stroke-specific',
        tags: ['High', 'Technical', 'Full body'],
        kcal_per_min: 12.0,
        met: 10.5,
        biomarkers: ['Lap time', 'Stroke rate', 'Turn time', 'HR', 'VO₂max'],
      },
      {
        id: 'tennis',
        name: 'Tennis / Table tennis',
        ico: '🎾',
        sub: 'Match play or rallying',
        tags: ['Mod-High', 'Lateral', 'Agility'],
        kcal_per_min: 7.5,
        met: 6.5,
        biomarkers: ['HR Zone 2–4', 'Lateral movement', 'Reaction time'],
      },
      {
        id: 'martial-arts',
        name: 'Martial arts / Boxing',
        ico: '🥊',
        sub: 'Sparring · Bag work · Katas',
        tags: ['High', 'Full body', 'Anaerobic'],
        kcal_per_min: 11.0,
        met: 10.0,
        biomarkers: ['HR Zone 3–5', 'Power output', 'Reaction time', 'Glucose'],
      },
      {
        id: 'basketball',
        name: 'Basketball',
        ico: '🏀',
        sub: 'Team game or drills',
        tags: ['High', 'Intermittent', 'Jump'],
        kcal_per_min: 9.5,
        met: 8.0,
        biomarkers: ['Jump height', 'Sprints', 'HR Zone 3–4', 'Agility'],
      },
    ],
  },

  H: {
    name: 'Occupational / Lifestyle',
    color: '#78716c',
    ico: '🏠',
    desc: 'Daily life activities — housework, cooking, childcare, commuting, standing work and manual labour.',
    subcats: [
      {
        id: 'housework',
        name: 'Housework (vigorous)',
        ico: '🧹',
        sub: 'Mopping · Scrubbing · Heavy cleaning',
        tags: ['Moderate', 'Functional'],
        kcal_per_min: 4.0,
        met: 3.5,
        biomarkers: ['Active minutes', 'Steps', 'Posture strain'],
      },
      {
        id: 'cooking',
        name: 'Cooking / Kitchen prep',
        ico: '👩‍🍳',
        sub: 'Standing · Light movement',
        tags: ['Light', 'Standing'],
        kcal_per_min: 2.5,
        met: 2.0,
        biomarkers: ['Standing time', 'Light activity'],
      },
      {
        id: 'childcare',
        name: 'Active childcare',
        ico: '👶',
        sub: 'Playing with children · Running around',
        tags: ['Moderate', 'Intermittent'],
        kcal_per_min: 5.0,
        met: 4.0,
        biomarkers: ['Active minutes', 'HR Zone 2'],
      },
      {
        id: 'commute-walk',
        name: 'Commute walking',
        ico: '🚶',
        sub: 'Walking to / from work or transit',
        tags: ['Light-Mod', 'Steps'],
        kcal_per_min: 3.8,
        met: 3.2,
        biomarkers: ['Steps', 'Distance', 'Daily movement total'],
      },
      {
        id: 'standing-work',
        name: 'Standing desk / active work',
        ico: '🧍',
        sub: 'Prolonged standing · Alternating posture',
        tags: ['Light', 'Postural'],
        kcal_per_min: 1.8,
        met: 1.5,
        biomarkers: ['Standing minutes', 'Sitting break ratio'],
      },
      {
        id: 'manual-labour',
        name: 'Manual labour / construction',
        ico: '🔨',
        sub: 'Heavy physical work · Lifting · Carrying',
        tags: ['Moderate-High', 'Functional'],
        kcal_per_min: 7.0,
        met: 6.0,
        biomarkers: ['Active time', 'Volume of carry', 'Musculoskeletal load'],
      },
    ],
  },
};

/* ───────────────────────────────────────────────────────
   BODY PARTS
   ─────────────────────────────────────────────────────── */

const BODY_PARTS = [
  { id: 'chest', name: 'Chest', ico: '💪', group: 'push' },
  { id: 'back', name: 'Back', ico: '🫁', group: 'pull' },
  { id: 'shoulders', name: 'Shoulders', ico: '🦾', group: 'push' },
  { id: 'biceps', name: 'Biceps', ico: '💪', group: 'pull' },
  { id: 'triceps', name: 'Triceps', ico: '💪', group: 'push' },
  { id: 'quads', name: 'Quads', ico: '🦵', group: 'legs' },
  { id: 'hamstrings', name: 'Hamstrings', ico: '🦵', group: 'legs' },
  { id: 'glutes', name: 'Glutes', ico: '🍑', group: 'legs' },
  { id: 'calves', name: 'Calves', ico: '🦵', group: 'legs' },
  { id: 'abs', name: 'Abs', ico: '🎯', group: 'core' },
  { id: 'obliques', name: 'Obliques', ico: '🎯', group: 'core' },
  { id: 'lowerback', name: 'Lower back', ico: '🔙', group: 'core' },
  { id: 'forearms', name: 'Forearms', ico: '💪', group: 'pull' },
  { id: 'traps', name: 'Traps', ico: '🦾', group: 'pull' },
  { id: 'lats', name: 'Lats', ico: '🫁', group: 'pull' },
  { id: 'fullbody', name: 'Full body', ico: '🏋', group: 'functional' },
];

/* ───────────────────────────────────────────────────────
   EXERCISES  (keyed by body-part id)
   ─────────────────────────────────────────────────────── */

const EXERCISES = {
  chest: [
    { name: 'Bench Press', type: 'Compound', equip: 'Barbell', pattern: 'Push', muscles: 'Chest Triceps Anterior deltoid', prev: 'Last: 45kg × 3×10' },
    { name: 'Dumbbell Flyes', type: 'Isolation', equip: 'Dumbbell', pattern: 'Push', muscles: 'Chest pec major', prev: 'Last: 14kg × 3×12' },
    { name: 'Push-ups', type: 'Compound', equip: 'Bodyweight', pattern: 'Push', muscles: 'Chest Triceps Core', prev: 'Last: 3×15' },
    { name: 'Cable Crossover', type: 'Isolation', equip: 'Cable Machine', pattern: 'Push', muscles: 'Chest mid', prev: 'Last: 20kg × 3×12' },
    { name: 'Incline DB Press', type: 'Compound', equip: 'Dumbbell', pattern: 'Push', muscles: 'Upper chest Triceps', prev: 'Last: 16kg × 3×10' },
    { name: 'Decline Push-up', type: 'Compound', equip: 'Bodyweight', pattern: 'Push', muscles: 'Lower chest', prev: 'Last: 3×15' },
  ],

  back: [
    { name: 'Deadlift', type: 'Compound', equip: 'Barbell', pattern: 'Hinge', muscles: 'Erectors Glutes Hamstrings Traps', prev: 'Last: 60kg × 4×5' },
    { name: 'Bent-over Row', type: 'Compound', equip: 'Barbell', pattern: 'Pull', muscles: 'Lats Rhomboids Biceps', prev: 'Last: 40kg × 3×10' },
    { name: 'Lat Pulldown', type: 'Compound', equip: 'Machine', pattern: 'Pull', muscles: 'Lats Biceps Rear delts', prev: 'Last: 45kg × 3×12' },
    { name: 'Pull-up / Chin-up', type: 'Compound', equip: 'Bodyweight', pattern: 'Pull', muscles: 'Lats Biceps', prev: 'Last: 3×8' },
    { name: 'Cable Row', type: 'Compound', equip: 'Cable Machine', pattern: 'Pull', muscles: 'Mid-back Rhomboids', prev: 'Last: 40kg × 3×12' },
    { name: 'DB Row single arm', type: 'Compound', equip: 'Dumbbell', pattern: 'Pull', muscles: 'Lats Rhomboids', prev: 'Last: 20kg × 3×10' },
  ],

  shoulders: [
    { name: 'Overhead Press', type: 'Compound', equip: 'Barbell', pattern: 'Push', muscles: 'Deltoids Triceps Upper traps', prev: 'Last: 30kg × 3×8' },
    { name: 'Lateral Raise', type: 'Isolation', equip: 'Dumbbell', pattern: 'Push', muscles: 'Lateral deltoid', prev: 'Last: 8kg × 3×15' },
    { name: 'Face Pull', type: 'Isolation', equip: 'Cable Machine', pattern: 'Pull', muscles: 'Rear delts Rotator cuff', prev: 'Last: 15kg × 3×15' },
    { name: 'Arnold Press', type: 'Compound', equip: 'Dumbbell', pattern: 'Push', muscles: 'All deltoid heads', prev: 'Last: 14kg × 3×10' },
    { name: 'Upright Row', type: 'Compound', equip: 'Barbell', pattern: 'Pull', muscles: 'Deltoids Traps Biceps', prev: 'Last: 25kg × 3×10' },
  ],

  quads: [
    { name: 'Barbell Squat', type: 'Compound', equip: 'Barbell', pattern: 'Squat', muscles: 'Quads Glutes Core', prev: 'Last: 50kg × 4×8' },
    { name: 'Leg Press', type: 'Compound', equip: 'Machine', pattern: 'Push', muscles: 'Quads Glutes Hamstrings', prev: 'Last: 80kg × 3×12' },
    { name: 'Leg Extension', type: 'Isolation', equip: 'Machine', pattern: 'Push', muscles: 'Quadriceps', prev: 'Last: 35kg × 3×15' },
    { name: 'Bulgarian Split Squat', type: 'Compound', equip: 'Dumbbell', pattern: 'Squat', muscles: 'Quads Glutes Balance', prev: 'Last: 12kg × 3×10 each' },
    { name: 'Goblet Squat', type: 'Compound', equip: 'Dumbbell', pattern: 'Squat', muscles: 'Quads Glutes Core', prev: 'Last: 20kg × 3×12' },
  ],

  abs: [
    { name: 'Plank', type: 'Isolation', equip: 'Bodyweight', pattern: 'Rotation', muscles: 'Transverse abs Core stabilizers', prev: 'Last: 3×60s' },
    { name: 'Crunches', type: 'Isolation', equip: 'Bodyweight', pattern: 'Rotation', muscles: 'Rectus abdominis', prev: 'Last: 3×20' },
    { name: 'Leg Raises', type: 'Compound', equip: 'Bodyweight', pattern: 'Hinge', muscles: 'Lower abs Hip flexors', prev: 'Last: 3×15' },
    { name: 'Russian Twists', type: 'Isolation', equip: 'Bodyweight', pattern: 'Rotation', muscles: 'Obliques Rectus abdominis', prev: 'Last: 3×20' },
    { name: 'Ab Wheel Rollout', type: 'Compound', equip: 'Bodyweight', pattern: 'Rotation', muscles: 'Full core', prev: 'Last: 3×10' },
    { name: 'Cable Crunch', type: 'Isolation', equip: 'Cable Machine', pattern: 'Rotation', muscles: 'Rectus abdominis', prev: 'Last: 30kg × 3×15' },
  ],

  hamstrings: [
    { name: 'Romanian Deadlift', type: 'Compound', equip: 'Barbell', pattern: 'Hinge', muscles: 'Hamstrings Glutes Erectors', prev: 'Last: 45kg × 3×10' },
    { name: 'Leg Curl', type: 'Isolation', equip: 'Machine', pattern: 'Hinge', muscles: 'Hamstrings', prev: 'Last: 30kg × 3×12' },
    { name: 'Nordic Curl', type: 'Compound', equip: 'Bodyweight', pattern: 'Hinge', muscles: 'Hamstrings eccentric', prev: 'Last: 3×8' },
    { name: 'Good Morning', type: 'Compound', equip: 'Barbell', pattern: 'Hinge', muscles: 'Hamstrings Erectors Glutes', prev: 'Last: 25kg × 3×10' },
  ],

  glutes: [
    { name: 'Hip Thrust', type: 'Compound', equip: 'Barbell', pattern: 'Hinge', muscles: 'Glutes Hamstrings', prev: 'Last: 55kg × 3×12' },
    { name: 'Glute Bridge', type: 'Isolation', equip: 'Bodyweight', pattern: 'Hinge', muscles: 'Glutes', prev: 'Last: 3×20' },
    { name: 'Cable Kickback', type: 'Isolation', equip: 'Cable Machine', pattern: 'Hinge', muscles: 'Glutes', prev: 'Last: 15kg × 3×15' },
    { name: 'Sumo Deadlift', type: 'Compound', equip: 'Barbell', pattern: 'Hinge', muscles: 'Glutes Inner thighs', prev: 'Last: 50kg × 3×8' },
  ],

  biceps: [
    { name: 'Barbell Curl', type: 'Isolation', equip: 'Barbell', pattern: 'Pull', muscles: 'Biceps brachii', prev: 'Last: 20kg × 3×12' },
    { name: 'Hammer Curl', type: 'Isolation', equip: 'Dumbbell', pattern: 'Pull', muscles: 'Biceps Brachialis', prev: 'Last: 10kg × 3×12' },
    { name: 'Incline Curl', type: 'Isolation', equip: 'Dumbbell', pattern: 'Pull', muscles: 'Long head biceps', prev: 'Last: 8kg × 3×12' },
    { name: 'Preacher Curl', type: 'Isolation', equip: 'Machine', pattern: 'Pull', muscles: 'Biceps peak', prev: 'Last: 15kg × 3×10' },
  ],

  triceps: [
    { name: 'Skull Crusher', type: 'Isolation', equip: 'Barbell', pattern: 'Push', muscles: 'Triceps all heads', prev: 'Last: 20kg × 3×10' },
    { name: 'Tricep Pushdown', type: 'Isolation', equip: 'Cable Machine', pattern: 'Push', muscles: 'Triceps lateral head', prev: 'Last: 25kg × 3×15' },
    { name: 'Close Grip Bench', type: 'Compound', equip: 'Barbell', pattern: 'Push', muscles: 'Triceps Chest', prev: 'Last: 35kg × 3×10' },
    { name: 'Overhead Tricep Ext', type: 'Isolation', equip: 'Dumbbell', pattern: 'Push', muscles: 'Triceps long head', prev: 'Last: 12kg × 3×12' },
  ],

  calves: [
    { name: 'Standing Calf Raise', type: 'Isolation', equip: 'Machine', pattern: 'Push', muscles: 'Gastrocnemius', prev: 'Last: 50kg × 3×20' },
    { name: 'Seated Calf Raise', type: 'Isolation', equip: 'Machine', pattern: 'Push', muscles: 'Soleus', prev: 'Last: 30kg × 3×20' },
    { name: 'Single-leg Calf Raise', type: 'Isolation', equip: 'Bodyweight', pattern: 'Push', muscles: 'Gastrocnemius', prev: 'Last: 3×15 each' },
  ],

  lowerback: [
    { name: 'Back Extension', type: 'Isolation', equip: 'Machine', pattern: 'Hinge', muscles: 'Erector spinae', prev: 'Last: 3×15' },
    { name: 'Superman hold', type: 'Isolation', equip: 'Bodyweight', pattern: 'Hinge', muscles: 'Erectors Glutes', prev: 'Last: 3×20' },
    { name: 'Bird-Dog', type: 'Compound', equip: 'Bodyweight', pattern: 'Rotation', muscles: 'Erectors Core Glutes', prev: 'Last: 3×12 each' },
  ],

  obliques: [
    { name: 'Side Plank', type: 'Isolation', equip: 'Bodyweight', pattern: 'Rotation', muscles: 'Obliques Core', prev: 'Last: 3×45s each' },
    { name: 'Wood Chop', type: 'Compound', equip: 'Cable Machine', pattern: 'Rotation', muscles: 'Obliques Shoulders Core', prev: 'Last: 15kg × 3×12' },
    { name: 'Pallof Press', type: 'Compound', equip: 'Cable Machine', pattern: 'Rotation', muscles: 'Core anti-rotation', prev: 'Last: 20kg × 3×12' },
  ],

  traps: [
    { name: 'Barbell Shrug', type: 'Isolation', equip: 'Barbell', pattern: 'Pull', muscles: 'Upper trapezius', prev: 'Last: 50kg × 3×15' },
    { name: 'DB Shrug', type: 'Isolation', equip: 'Dumbbell', pattern: 'Pull', muscles: 'Upper traps', prev: 'Last: 20kg × 3×15' },
    { name: 'Farmer Carry', type: 'Compound', equip: 'Dumbbell', pattern: 'Carry', muscles: 'Traps Core Forearms', prev: 'Last: 22kg × 4×30m' },
  ],

  forearms: [
    { name: 'Wrist Curl', type: 'Isolation', equip: 'Barbell', pattern: 'Pull', muscles: 'Wrist flexors', prev: 'Last: 10kg × 3×15' },
    { name: 'Reverse Curl', type: 'Isolation', equip: 'Barbell', pattern: 'Pull', muscles: 'Brachioradialis', prev: 'Last: 12kg × 3×12' },
    { name: 'Dead Hang', type: 'Isolation', equip: 'Bodyweight', pattern: 'Pull', muscles: 'Forearms Grip strength', prev: 'Last: 3×30s' },
  ],

  lats: [
    { name: 'Straight Arm Pulldown', type: 'Isolation', equip: 'Cable Machine', pattern: 'Pull', muscles: 'Lats', prev: 'Last: 30kg × 3×15' },
    { name: 'Single Arm Pulldown', type: 'Compound', equip: 'Cable Machine', pattern: 'Pull', muscles: 'Lats Rear delt', prev: 'Last: 25kg × 3×12' },
    { name: 'Underhand Lat Pull', type: 'Compound', equip: 'Machine', pattern: 'Pull', muscles: 'Lats Biceps', prev: 'Last: 45kg × 3×12' },
  ],

  fullbody: [
    { name: 'Deadlift', type: 'Compound', equip: 'Barbell', pattern: 'Hinge', muscles: 'Posterior chain + legs + core', prev: 'Last: 60kg × 4×5' },
    { name: 'Clean & Press', type: 'Compound', equip: 'Barbell', pattern: 'Carry', muscles: 'Full body + power', prev: 'Last: 35kg × 3×6' },
    { name: 'Farmer Walk', type: 'Compound', equip: 'Dumbbell', pattern: 'Carry', muscles: 'Whole body functional', prev: 'Last: 22kg × 4×40m' },
    { name: 'Barbell Complex', type: 'Compound', equip: 'Barbell', pattern: 'Carry', muscles: 'Full body circuit', prev: 'Last: 20kg × 4 rounds' },
  ],
};

/* ───────────────────────────────────────────────────────
   INSIGHTS  (per subcategory)
   ─────────────────────────────────────────────────────── */

const INSIGHTS = {
  'walk-brisk':
    'Brisk walking at 5-6.5 km/h improves insulin sensitivity within 24 hours and reduces cardiovascular risk by up to 31%. Aim for 30 minutes daily to maintain blood glucose control and boost BDNF for brain health.',
  hatha:
    'Hatha Yoga activates the parasympathetic nervous system, lowering cortisol by 15-25% per session. Regular practice improves HRV, reduces blood pressure and increases flexibility by 35% over 8 weeks.',
  vinyasa:
    'Vinyasa flow bridges cardio and mindfulness — sustained HR Zone 2-3 effort builds aerobic capacity while synchronized breathing lowers stress hormones. Burns 7 kcal/min with significant core and flexibility gains.',
  pranayama:
    'Controlled breathing techniques directly modulate the vagus nerve, increasing HRV by 20-40% acutely. Regular practice reduces resting blood pressure, improves SpO2 and lowers baseline cortisol and inflammatory markers.',
  meditation:
    'Meditation reduces cortisol by 20-30%, improves HRV and lowers inflammatory markers (CRP, IL-6). Just 10 minutes daily enhances cognitive function, sleep quality and emotional regulation within 8 weeks.',
  hiit:
    'HIIT triggers EPOC (excess post-exercise oxygen consumption) burning calories for up to 48 hours post-workout. A single session improves VO2max, glucose uptake and mitochondrial density more efficiently than steady-state cardio.',
};

/* ───────────────────────────────────────────────────────
   GOAL INSIGHTS
   ─────────────────────────────────────────────────────── */

const GOAL_INSIGHTS = {
  'weight-loss':
    'Combining caloric deficit with regular movement is the most sustainable approach. Focus on NEAT (non-exercise activity thermogenesis) alongside structured workouts. Brisk walking and strength training preserve lean mass while burning fat.',
  'muscle-gain':
    'Progressive overload is key — increase volume load by 5-10% weekly. Prioritise compound movements and aim for 10-20 sets per muscle group per week. Protein timing within 2 hours post-workout optimises muscle protein synthesis.',
  endurance:
    'Build aerobic base with 80% of training in Zone 2 (conversational pace). Add 1-2 high-intensity sessions per week. Monitor resting HR and HRV trends to avoid overtraining and optimise recovery windows.',
  flexibility:
    'Consistency beats intensity — 10-15 minutes of daily stretching outperforms occasional long sessions. Combine static holds (30-60s) with dynamic warm-ups. Track ROM improvements monthly for motivation.',
  'stress-relief':
    'Mind-body practices reduce cortisol by 20-30% per session. Combine breathing exercises (pranayama) with gentle movement (yoga, tai chi) for maximum parasympathetic activation. Evening sessions improve sleep quality within 1 week.',
  'general-health':
    'WHO recommends 150-300 minutes of moderate activity per week plus 2 strength sessions. Variety is protective — mix cardio, strength and flexibility work. Track resting HR, HRV and sleep quality as key health indicators.',
};

/* ───────────────────────────────────────────────────────
   HEART-RATE ZONES
   ─────────────────────────────────────────────────────── */

const HR_ZONES = [
  { n: 1, label: 'Zone 1 — Very Light', color: '#94a3b8', range: '50–60% HRmax', pct: 0.55 },
  { n: 2, label: 'Zone 2 — Light', color: '#22c55e', range: '60–70% HRmax', pct: 0.65 },
  { n: 3, label: 'Zone 3 — Moderate', color: '#eab308', range: '70–80% HRmax', pct: 0.75 },
  { n: 4, label: 'Zone 4 — Hard', color: '#f97316', range: '80–90% HRmax', pct: 0.85 },
  { n: 5, label: 'Zone 5 — Maximum', color: '#ef4444', range: '90–100% HRmax', pct: 0.95 },
];

/* ───────────────────────────────────────────────────────
   REST OPTIONS  (seconds)
   ─────────────────────────────────────────────────────── */

const REST_OPTIONS = [30, 45, 60, 90, 120, 180, 240, 300];

/* ───────────────────────────────────────────────────────
   INTENSITY OPTIONS  (Zone 1 → 5)
   ─────────────────────────────────────────────────────── */

const INTENSITY_OPTIONS = [
  { id: 1, label: 'Zone 1', sub: 'Very light — warm-up / recovery', color: '#94a3b8' },
  { id: 2, label: 'Zone 2', sub: 'Light — fat burn / aerobic base', color: '#22c55e' },
  { id: 3, label: 'Zone 3', sub: 'Moderate — cardio / tempo', color: '#eab308' },
  { id: 4, label: 'Zone 4', sub: 'Hard — threshold / lactate', color: '#f97316' },
  { id: 5, label: 'Zone 5', sub: 'Maximum — anaerobic / VO₂max', color: '#ef4444' },
];

/* ───────────────────────────────────────────────────────
   RPE DESCRIPTIONS  (1 → 10)
   ─────────────────────────────────────────────────────── */

const RPE_DESCRIPTIONS = [
  { rpe: 1, desc: 'Very light activity — barely any effort', pct: 10 },
  { rpe: 2, desc: 'Light — comfortable, could do this all day', pct: 20 },
  { rpe: 3, desc: 'Moderate — easy to breathe, conversation easy', pct: 30 },
  { rpe: 4, desc: 'Somewhat hard — breathing harder, still talking', pct: 40 },
  { rpe: 5, desc: 'Hard — challenging, short sentences only', pct: 50 },
  { rpe: 6, desc: 'Harder — pushing effort, few words at a time', pct: 60 },
  { rpe: 7, desc: 'Very hard — difficult to maintain, heavy breathing', pct: 70 },
  { rpe: 8, desc: 'Extremely hard — very short bursts possible', pct: 80 },
  { rpe: 9, desc: 'Near maximal — almost nothing left', pct: 90 },
  { rpe: 10, desc: 'Maximal effort — absolute limit, cannot continue', pct: 100 },
];

/* ───────────────────────────────────────────────────────
   BREATHING TECHNIQUES
   ─────────────────────────────────────────────────────── */

const BREATHING_TECHNIQUES = [
  'Diaphragmatic breathing',
  'Box breathing (4-4-4-4)',
  'Alternate nostril (Nadi Shodhana)',
  '4-7-8 breathing',
  'Bhramari (humming bee)',
  'Kapalabhati (skull shining)',
  'Ujjayi (ocean breath)',
  'Wim Hof method',
  'Buteyko breathing',
  'Sitali (cooling breath)',
];

/* ───────────────────────────────────────────────────────
   MEDITATION TYPES
   ─────────────────────────────────────────────────────── */

const MEDITATION_TYPES = [
  'Mindfulness meditation',
  'Body scan',
  'Guided visualization',
  'Loving-kindness (Metta)',
  'Transcendental meditation',
  'Zen (Zazen)',
  'Yoga Nidra',
  'Walking meditation',
  'Mantra meditation',
  'Breath awareness',
];

/* ───────────────────────────────────────────────────────
   MOOD ARRAYS  (before & after session)
   ─────────────────────────────────────────────────────── */

const BEFORE_MOODS = [
  '😴 Tired',
  '😟 Anxious',
  '😐 Neutral',
  '🙂 Good',
  '😃 Energised',
  '😤 Stressed',
  '😢 Low',
  '🤕 Sore',
  '😌 Calm',
  '🔥 Motivated',
];

const AFTER_MOODS = [
  '😴 Exhausted',
  '😓 Fatigued',
  '😐 Neutral',
  '🙂 Good',
  '😃 Energised',
  '💪 Strong',
  '😌 Relaxed',
  '🧘 Centred',
  '🏆 Accomplished',
  '🔥 On fire',
];

/* ───────────────────────────────────────────────────────
   EXPORTS  (CommonJS)
   ─────────────────────────────────────────────────────── */

module.exports = {
  CATEGORIES,
  BODY_PARTS,
  EXERCISES,
  INSIGHTS,
  GOAL_INSIGHTS,
  HR_ZONES,
  REST_OPTIONS,
  INTENSITY_OPTIONS,
  RPE_DESCRIPTIONS,
  BREATHING_TECHNIQUES,
  MEDITATION_TYPES,
  BEFORE_MOODS,
  AFTER_MOODS,
};
