/* ───────────────────────────────────────────────────────
   SLEEP TRACKER DATA
   ─────────────────────────────────────────────────────── */

const SLEEP_USER = {
  name: 'Priya',
  age: 38,
  wt: 64,
  conditions: ['T2DM', 'HTN', 'Dyslipidaemia'],
  meds: ['Metformin', 'Amlodipine', 'Atorvastatin'],
};

const SOURCES = [
  { id: 'phone', name: 'TrustLife Sense', ico: '📱', sub: 'Phone-based detection', col: '#6366f1' },
  { id: 'wearable', name: 'Wearable sync', ico: '⌚', sub: 'Watch / band / ring', col: '#3b82f6' },
  { id: 'manual', name: 'Manual entry', ico: '✏️', sub: 'Log it yourself', col: '#8b5cf6' },
];

const DEVICES = [
  { id: 'awatch', name: 'Apple Watch', ico: '⌚', brand: 'Apple', paired: true, lastSync: 'Just now' },
  { id: 'garmin', name: 'Garmin Venu', ico: '🟢', brand: 'Garmin', paired: false, lastSync: 'Never' },
  { id: 'fitbit', name: 'Fitbit Sense', ico: '🔵', brand: 'Fitbit', paired: false, lastSync: 'Never' },
  { id: 'samsung', name: 'Galaxy Watch', ico: '⭐', brand: 'Samsung', paired: false, lastSync: 'Never' },
  { id: 'oura', name: 'Oura Ring', ico: '💍', brand: 'Oura', paired: false, lastSync: 'Never' },
  { id: 'whoop', name: 'WHOOP 4.0', ico: '🤛', brand: 'WHOOP', paired: false, lastSync: 'Never' },
  { id: 'polar', name: 'Polar H10', ico: '🔴', brand: 'Polar', paired: false, lastSync: 'Never' },
  { id: 'withings', name: 'Withings ScanWatch', ico: '🔘', brand: 'Withings', paired: false, lastSync: 'Never' },
];

/* hypnogram values: 0 = awake, 1 = rem, 2 = light, 3 = deep */
const LAST_NIGHT = {
  source: 'phone',
  date: '25 Mar 2026',
  bedtime: '22:48',
  wake: '06:58',
  totalMins: 430,
  sleepLatency: 14,
  awakenings: 3,
  score: 74,
  stages: { awake: 28, rem: 92, light: 192, deep: 118 },
  heartRateAvg: 58,
  heartRateMin: 52,
  hrv: 38,
  spo2avg: 96.8,
  spo2min: 94.2,
  breathRate: 15.4,
  tempDeviation: -0.3,
  restlessness: 18,
  hypnogram: [
    2, 2, 3, 3, 3, 2, 2, 1, 1, 2,
    3, 3, 2, 2, 1, 1, 2, 2, 0, 0,
    2, 2, 1, 1, 2, 2, 3, 2, 2, 1,
  ],
};

const SLEEP_HISTORY = [
  { date: '25 Mar', dur: 430, score: 74, deep: 118, rem: 92, bedtime: '22:48', wake: '06:58', bg: 124, bp: 130, hrv: 38, spo2: 96.8 },
  { date: '24 Mar', dur: 385, score: 68, deep: 82, rem: 78, bedtime: '23:20', wake: '06:45', bg: 131, bp: 136, hrv: 32, spo2: 95.9 },
  { date: '23 Mar', dur: 455, score: 81, deep: 135, rem: 108, bedtime: '22:30', wake: '07:05', bg: 118, bp: 128, hrv: 44, spo2: 97.2 },
  { date: '22 Mar', dur: 362, score: 61, deep: 65, rem: 64, bedtime: '00:15', wake: '06:20', bg: 142, bp: 142, hrv: 28, spo2: 95.1 },
  { date: '21 Mar', dur: 440, score: 79, deep: 124, rem: 95, bedtime: '22:45', wake: '06:58', bg: 120, bp: 129, hrv: 41, spo2: 97.0 },
  { date: '20 Mar', dur: 415, score: 72, deep: 98, rem: 88, bedtime: '23:05', wake: '06:55', bg: 127, bp: 132, hrv: 36, spo2: 96.5 },
  { date: '19 Mar', dur: 490, score: 85, deep: 148, rem: 118, bedtime: '22:20', wake: '07:30', bg: 115, bp: 126, hrv: 48, spo2: 97.8 },
  { date: '18 Mar', dur: 350, score: 55, deep: 52, rem: 58, bedtime: '01:00', wake: '06:50', bg: 148, bp: 145, hrv: 24, spo2: 94.8 },
  { date: '17 Mar', dur: 428, score: 76, deep: 112, rem: 91, bedtime: '22:50', wake: '07:00', bg: 122, bp: 131, hrv: 39, spo2: 97.1 },
  { date: '16 Mar', dur: 402, score: 70, deep: 88, rem: 82, bedtime: '23:15', wake: '07:00', bg: 129, bp: 134, hrv: 33, spo2: 96.3 },
  { date: '15 Mar', dur: 462, score: 83, deep: 138, rem: 110, bedtime: '22:35', wake: '07:10', bg: 116, bp: 127, hrv: 46, spo2: 97.5 },
  { date: '14 Mar', dur: 375, score: 63, deep: 70, rem: 65, bedtime: '00:05', wake: '06:25', bg: 138, bp: 140, hrv: 29, spo2: 95.4 },
  { date: '13 Mar', dur: 445, score: 80, deep: 128, rem: 98, bedtime: '22:40', wake: '07:05', bg: 119, bp: 128, hrv: 42, spo2: 97.0 },
  { date: '12 Mar', dur: 410, score: 73, deep: 95, rem: 87, bedtime: '23:10', wake: '07:00', bg: 126, bp: 133, hrv: 37, spo2: 96.6 },
];

const SLEEP_CHECKLIST = [
  { ico: '🍽️', title: 'Last meal 3+ hrs ago', sub: 'Bedtime glucose ideal 100–140 mg/dL' },
  { ico: '📱', title: 'Screens off 1 hr before', sub: 'Blue light delays melatonin by 90 min' },
  { ico: '💊', title: 'Medications taken', sub: 'Metformin with evening meal, Amlodipine anytime' },
  { ico: '🌡️', title: 'Room cool (18–20°C)', sub: 'Optimal sleep temperature for deep sleep' },
  { ico: '🌙', title: 'Room dark', sub: 'Complete darkness increases melatonin 2–3×' },
  { ico: '🧘', title: 'Wind-down done', sub: '10-min relaxation reduces sleep latency by 18 min' },
];

const STAGE_COLORS = {
  awake: '#ef4444',
  rem: '#a855f7',
  light: '#3b82f6',
  deep: '#312e81',
};

const STAGE_LABELS = {
  0: 'Awake',
  1: 'REM',
  2: 'Light',
  3: 'Deep',
};

module.exports = {
  SLEEP_USER,
  SOURCES,
  DEVICES,
  LAST_NIGHT,
  SLEEP_HISTORY,
  SLEEP_CHECKLIST,
  STAGE_COLORS,
  STAGE_LABELS,
};
