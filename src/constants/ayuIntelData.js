/* ================================================================
   ayuIntelData.js
   Comprehensive data for the Ayu Intel health-intelligence screen
   – score strip, 6 main tabs, biomarkers, lifestyle, medical,
     symptoms, organs, analytics
   ================================================================ */

// ─── 1. SCORE STRIP ───────────────────────────────────────────
const SCORE_STRIP = [
  { key: 'score',      label: 'Health score', value: '62/100',  color: '#F5A623', bg: '#FFF5E0', ico: 'heart-circle-outline' },
  { key: 'conditions', label: 'Conditions',   value: '3',       color: '#F5A623', bg: '#FFF5E0', ico: 'alert-circle-outline', sub: 'active' },
  { key: 'flags',      label: 'Flags',        value: '7',       color: '#E53935', bg: '#FDECEC', ico: 'flag-outline',         sub: 'attention' },
  { key: 'improving',  label: 'Improving',    value: '4',       color: '#2E7D32', bg: '#E8F5E9', ico: 'trending-up-outline',  sub: 'params' },
];

// ─── 2. MAIN TABS ─────────────────────────────────────────────
const MAIN_TABS = [
  { key: 'overview',  label: 'AI Overview', ico: 'brain-outline' },
  { key: 'biomarker', label: 'Biomarker',   ico: 'flask-outline' },
  { key: 'lifestyle', label: 'Lifestyle',   ico: 'fitness-outline' },
  { key: 'medical',   label: 'Medical',     ico: 'medical-outline' },
  { key: 'symptoms',  label: 'Symptoms',    ico: 'pulse-outline' },
  { key: 'analytics', label: 'Analytics',   ico: 'analytics-outline' },
];

// ─── 3. OVERVIEW DATA ─────────────────────────────────────────
const OVERVIEW_DATA = {
  narrativeTitle: 'Ayu’s health narrative · March 2026',
  narrativeSubtitle: '284 data points synthesised',
  narrative:
    'Priya, your overall trajectory is cautiously improving. Metformin uptitration (5 Mar) is working. However, three inter-linked issues hold back progress: chronic sleep deficit, post-dinner glucose spikes, and PM Metformin misses – Ayu found they form one cascade.',

  correlation: {
    title: '🔗 Ayu’s most important cross-correlation',
    body: 'Poor sleep → stress → PM Metformin miss → large dinner → glucose spike. This single cascade drives 60% of Priya’s above-range readings. Fixing sleep alone would lower FBG by ~15 mg/dL per night.',
  },

  flags: [
    {text: 'HbA1c 7.8% – above 7.0% target. Third consecutive above-target test.', severity: 'urgent', dotColor: '#E24B4A'},
    {text: 'Sleep 5.9h avg – 16% below 7h clinical recommendation for T2DM.', severity: 'urgent', dotColor: '#E24B4A'},
    {text: 'Foot tingling – 5 episodes this month. Pattern consistent with early neuropathy.', severity: 'watch', dotColor: '#BA7517'},
    {text: 'Vit D 18 ng/mL – deficient. Worsens insulin resistance and fatigue.', severity: 'watch', dotColor: '#BA7517'},
    {text: 'Hb 11.8 g/dL – mild anaemia. Methylcobalamin started 5 Mar.', severity: 'watch', dotColor: '#BA7517'},
    {text: 'BP 136/86 – above 130/80 target. Olmesartan (Jan 26) still taking effect.', severity: 'monitor', dotColor: '#BA7517'},
    {text: 'PM Metformin 58% – 13 misses. Each miss = +12 mg/dL next-morning FBG.', severity: 'improve', dotColor: '#1565c0'},
  ],

  improving: [
    {text: 'FBG −10 mg/dL – 131 (1 Mar) → 121 (28 Mar). Metformin 1000mg working.'},
    {text: 'Steps ↑24% vs last quarter (5,100→6,240/day). Evening walk forming.'},
    {text: 'BP trending ↓ – Olmesartan taking effect. Peak readings reducing.'},
    {text: 'Weight −1.2kg since January. BMI toward 25.0.'},
  ],

  actions: [
    {rank: 1, title: 'Sleep 7h tonight.', detail: 'Single most impactful action – lowers tomorrow’s FBG by ~15 mg/dL.'},
    {rank: 2, title: '15-min after-dinner walk.', detail: 'Brings post-dinner glucose from avg 180→155 mg/dL. Pushes TIR above 70%.'},
    {rank: 3, title: 'PM Metformin at 9 PM sharp.', detail: 'Set recurring alert – each dose = −12 mg/dL FBG.'},
  ],
};

// ─── 4. BIOMARKERS ────────────────────────────────────────────────────────
const BIOMARKERS = [
  {
    id: 'hba1c', name: 'HbA1c', cat: 'Glycaemic Control', val: 7.8, unit: '%', lo: 4.0, hi: 7.0, pr: 1, col: '#DC2626', hps: 52,
    st:   { s: 18, lbl: 'Above target', d: '7.8% exceeds the 7.0% target by 0.8 points — reflects elevated 90-day average blood glucose.' },
    stab: { s: 22, dir: 'worsening', lbl: 'Worsening trend', d: 'Rising from 7.2% a year ago to 7.8% now. Three consecutive above-target results.' },
    vel:  { s: 16, sp: 'medium', pct: 4.2, lbl: 'Rising 4.2%/mo', d: 'Upward drift of ~0.1% per quarter. Current trajectory moves away from target.' },
    hist: [
      { dt: 'Mar 26', v: 7.8, st: 'h' },
      { dt: 'Sep 25', v: 7.5, st: 'h' },
      { dt: 'Mar 25', v: 7.2, st: 'h' },
      { dt: 'Sep 24', v: 7.4, st: 'h' },
      { dt: 'Mar 24', v: 7.6, st: 'h' },
    ],
    insight: 'PM Metformin misses and post-dinner spikes are the biggest drag on HbA1c. Fixing the sleep-spike cascade alone could shave 0.4–0.6%.',
  },
  {
    id: 'fbg', name: 'Fasting Blood Glucose', cat: 'Glycaemic Control', val: 126, unit: 'mg/dL', lo: 70, hi: 100, pr: 0, col: '#F59E0B', hps: 58,
    st:   { s: 20, lbl: 'Above range', d: '126 mg/dL is 26% above the upper normal of 100 mg/dL.' },
    stab: { s: 20, dir: 'improving', lbl: 'Improving', d: 'Down from 136 mg/dL four weeks ago. Steady 10-point drop since Metformin uptitration.' },
    vel:  { s: 18, sp: 'medium', pct: 3.8, lbl: 'Falling 3.8%/mo', d: 'Losing ~2.5 mg/dL per week. On track to enter near-normal range in 10 weeks.' },
    hist: [
      { dt: 'Mar 26', v: 126, st: 'h' },
      { dt: 'Dec 25', v: 131, st: 'h' },
      { dt: 'Sep 25', v: 136, st: 'h' },
      { dt: 'Jun 25', v: 138, st: 'h' },
      { dt: 'Mar 25', v: 142, st: 'h' },
    ],
    insight: 'Nights with 7+ h sleep produce a next-morning FBG averaging 118 mg/dL. Prioritise sleep consistency.',
  },
  {
    id: 'ldl', name: 'LDL Cholesterol', cat: 'Cardiac Risk', val: 118, unit: 'mg/dL', lo: 0, hi: 100, pr: 0, col: '#DC2626', hps: 62,
    st:   { s: 16, lbl: 'Above target', d: '118 mg/dL is above the <100 mg/dL target for a diabetic patient.' },
    stab: { s: 20, dir: 'improving', lbl: 'Improving', d: 'Down from 134 mg/dL a year ago on Atorvastatin 10 mg.' },
    vel:  { s: 14, sp: 'slow', pct: 2.1, lbl: 'Falling 2.1%/mo', d: 'Dropping ~1.7 mg/dL per month; may reach target in 10–12 months at this rate.' },
    hist: [
      { dt: 'Mar 26', v: 118, st: 'h' },
      { dt: 'Sep 25', v: 128, st: 'h' },
      { dt: 'Mar 25', v: 134, st: 'h' },
      { dt: 'Sep 24', v: 140, st: 'h' },
    ],
    insight: 'Atorvastatin is working. Adding 2 servings of soluble fibre (oats, dals) daily can accelerate LDL reduction by 5–10%.',
  },
  {
    id: 'tg', name: 'Triglycerides', cat: 'Cardiac Risk', val: 162, unit: 'mg/dL', lo: 0, hi: 150, pr: 0, col: '#F59E0B', hps: 60,
    st:   { s: 14, lbl: 'Mildly elevated', d: '162 mg/dL is 8% above the <150 target.' },
    stab: { s: 18, dir: 'stable', lbl: 'Stable', d: 'Fluctuating between 155–168 mg/dL over 6 months; no clear trend.' },
    vel:  { s: 10, sp: 'slow', pct: 1.2, lbl: 'Flat', d: 'Minimal change. Dietary and exercise interventions needed for meaningful reduction.' },
    hist: [
      { dt: 'Mar 26', v: 162, st: 'h' },
      { dt: 'Sep 25', v: 168, st: 'h' },
      { dt: 'Mar 25', v: 158, st: 'h' },
      { dt: 'Sep 24', v: 174, st: 'h' },
    ],
    insight: 'Triglycerides respond strongly to refined carbs and evening snacking. Cutting post-8 PM snacks could lower TG by 15–20 mg/dL.',
  },
  {
    id: 'hdl', name: 'HDL Cholesterol', cat: 'Cardiac Risk', val: 52, unit: 'mg/dL', lo: 50, hi: 80, pr: 0, col: '#16A34A', hps: 90,
    st:   { s: 32, lbl: 'Normal', d: '52 mg/dL is within the normal range (50–80). Higher is better for cardio-protection.' },
    stab: { s: 28, dir: 'stable', lbl: 'Stable', d: 'Holding between 50–54 mg/dL over the past year.' },
    vel:  { s: 20, sp: 'slow', pct: 2.0, lbl: 'Stable', d: 'Small upward nudge (+2 mg/dL) coinciding with increased walking.' },
    hist: [
      { dt: 'Mar 26', v: 52, st: 'n' },
      { dt: 'Sep 25', v: 50, st: 'n' },
      { dt: 'Mar 25', v: 48, st: 'l' },
      { dt: 'Sep 24', v: 46, st: 'l' },
    ],
    insight: 'Regular brisk walking (30 min/day) can raise HDL by 3–5 mg/dL over 3 months. Continue the step-count trend.',
  },
  {
    id: 'hb', name: 'Haemoglobin', cat: 'Blood Health', val: 11.8, unit: 'g/dL', lo: 12.0, hi: 16.0, pr: 1, col: '#D97706', hps: 72,
    st:   { s: 22, lbl: 'Below range', d: '11.8 g/dL is just below the 12.0 lower limit for adult females.' },
    stab: { s: 24, dir: 'stable', lbl: 'Stable', d: 'Hovering between 11.5–12.0 g/dL for 6 months.' },
    vel:  { s: 16, sp: 'slow', pct: 1.7, lbl: 'Marginal rise', d: 'Up from 11.6 three months ago. Iron + B12 supplementation may help.' },
    hist: [
      { dt: 'Mar 26', v: 11.8, st: 'l' },
      { dt: 'Sep 25', v: 11.5, st: 'l' },
      { dt: 'Mar 25', v: 11.6, st: 'l' },
      { dt: 'Sep 24', v: 11.4, st: 'l' },
    ],
    insight: 'Metformin can impair B12 absorption, which in turn affects haemoglobin synthesis. Monitor B12 every 6 months.',
  },
  {
    id: 'vitd', name: 'Vitamin D', cat: 'Micronutrients', val: 18, unit: 'ng/mL', lo: 30, hi: 100, pr: 0, col: '#D97706', hps: 48,
    st:   { s: 10, lbl: 'Deficient', d: '18 ng/mL is well below the 30 ng/mL threshold. Increases insulin resistance and fracture risk.' },
    stab: { s: 16, dir: 'improving', lbl: 'Improving', d: 'Up from 14 ng/mL six months ago with improved supplementation compliance.' },
    vel:  { s: 12, sp: 'medium', pct: 5.6, lbl: 'Rising 5.6%/mo', d: 'Gaining ~1 ng/mL per month. Will take 12+ months to reach sufficiency at this rate.' },
    hist: [
      { dt: 'Mar 26', v: 18, st: 'l' },
      { dt: 'Sep 25', v: 14, st: 'l' },
      { dt: 'Mar 25', v: 12, st: 'l' },
      { dt: 'Sep 24', v: 16, st: 'l' },
    ],
    insight: 'Vitamin D deficiency worsens insulin resistance. Ensure the weekly 60K IU sachet is actually taken — consider switching to daily 2000 IU drops for better compliance.',
  },
  {
    id: 'b12', name: 'Vitamin B12', cat: 'Micronutrients', val: 312, unit: 'pg/mL', lo: 200, hi: 900, pr: 0, col: '#16A34A', hps: 78,
    st:   { s: 26, lbl: 'Normal', d: '312 pg/mL is within range but on the lower side, especially for a patient on Metformin.' },
    stab: { s: 26, dir: 'stable', lbl: 'Stable', d: 'Holding between 300–340 pg/mL over 9 months with Methylcobalamin 1500 mcg.' },
    vel:  { s: 18, sp: 'slow', pct: 3.3, lbl: 'Slight rise', d: 'Marginal improvement; may need to increase dose or check absorption.' },
    hist: [
      { dt: 'Mar 26', v: 312, st: 'n' },
      { dt: 'Sep 25', v: 305, st: 'n' },
      { dt: 'Mar 25', v: 298, st: 'n' },
      { dt: 'Sep 24', v: 290, st: 'n' },
    ],
    insight: 'Metformin reduces B12 absorption by 10–30%. Current Methylcobalamin is maintaining levels but not building reserves. Consider sublingual route.',
  },
  {
    id: 'tsh', name: 'TSH (Thyroid)', cat: 'Thyroid Function', val: 2.8, unit: 'mIU/L', lo: 0.5, hi: 4.5, pr: 1, col: '#16A34A', hps: 95,
    st:   { s: 34, lbl: 'Normal', d: '2.8 mIU/L is comfortably within the 0.5–4.5 range.' },
    stab: { s: 30, dir: 'stable', lbl: 'Stable', d: 'Consistent between 2.5–3.0 mIU/L over a year.' },
    vel:  { s: 22, sp: 'slow', pct: 1.2, lbl: 'Stable', d: 'Minimal fluctuation; no thyroid intervention needed.' },
    hist: [
      { dt: 'Mar 26', v: 2.8, st: 'n' },
      { dt: 'Sep 25', v: 2.7, st: 'n' },
      { dt: 'Mar 25', v: 2.9, st: 'n' },
      { dt: 'Sep 24', v: 2.6, st: 'n' },
    ],
    insight: 'Thyroid function is normal. Annual monitoring is sufficient unless symptoms change.',
  },
  {
    id: 'egfr', name: 'eGFR (Kidney)', cat: 'Renal Health', val: 72, unit: 'mL/min', lo: 60, hi: 120, pr: 0, col: '#16A34A', hps: 80,
    st:   { s: 24, lbl: 'Normal', d: '72 mL/min is within range but below the ideal >90 for a 42-year-old.' },
    stab: { s: 26, dir: 'stable', lbl: 'Stable', d: 'Holding at 70–75 mL/min over the past year.' },
    vel:  { s: 18, sp: 'slow', pct: 1.4, lbl: 'Stable', d: 'Very slow drift; diabetes-related nephropathy risk needs monitoring.' },
    hist: [
      { dt: 'Mar 26', v: 72, st: 'n' },
      { dt: 'Sep 25', v: 74, st: 'n' },
      { dt: 'Mar 25', v: 73, st: 'n' },
      { dt: 'Sep 24', v: 76, st: 'n' },
    ],
    insight: 'eGFR is in the CKD stage-2 band. Tight BP and glucose control are critical to preserving kidney function. Recheck with microalbumin every 6 months.',
  },
  {
    id: 'malb', name: 'Urine Microalbumin', cat: 'Renal Health', val: 18, unit: 'mg/L', lo: 0, hi: 30, pr: 0, col: '#16A34A', hps: 94,
    st:   { s: 32, lbl: 'Normal', d: '18 mg/L is within the <30 normal range. No albuminuria detected.' },
    stab: { s: 30, dir: 'stable', lbl: 'Stable', d: 'Fluctuating between 15–20 mg/L over 9 months.' },
    vel:  { s: 22, sp: 'slow', pct: 2.1, lbl: 'Stable', d: 'Small upward nudge from 16 to 18 — within noise but worth watching.' },
    hist: [
      { dt: 'Mar 26', v: 18, st: 'n' },
      { dt: 'Sep 25', v: 16, st: 'n' },
      { dt: 'Mar 25', v: 17, st: 'n' },
      { dt: 'Sep 24', v: 14, st: 'n' },
    ],
    insight: 'Microalbumin is normal but trending up at the margin. If it crosses 30 mg/L, it signals early diabetic nephropathy. Continue ACE-inhibitor benefit from Olmesartan.',
  },
];

// ─── 5. LIFESTYLE SECTIONS ───────────────────────────────────
const LIFESTYLE_SECTIONS = [
  {
    id: 'nutrition',
    sectionLabel: 'Food & nutrition',
    title: 'Nutrition \u00b7 March 2026',
    ico: '\ud83c\udf7d\ufe0f',
    icoBg: '#FAEEDA',
    badge: '2 concerns',
    badgeBg: '#FAEEDA',
    badgeColor: '#633806',
    metrics: [
      {label: 'Avg daily calories', value: '1,720 kcal', ref: 'Target 1,600\u20131,800', valueColor: '#0F6E56', pillLabel: '\u2713', pillBg: '#E1F5EE', pillColor: '#085041'},
      {label: 'Sodium intake', value: '2,100 mg/day', ref: 'Target <1,500', valueColor: '#E24B4A', pillLabel: '\u26a0', pillBg: '#FCEBEB', pillColor: '#791F1F'},
      {label: 'Carbohydrates', value: '58%', ref: 'Target <50%', valueColor: '#BA7517', pillLabel: '\u26a0', pillBg: '#FAEEDA', pillColor: '#633806'},
      {label: 'Fibre', value: '14g/day', ref: 'Target 25\u201330g', valueColor: '#BA7517', pillLabel: 'Low', pillBg: '#FAEEDA', pillColor: '#633806'},
      {label: 'Hydration', value: '1.4L/day', ref: 'Target 2.5L', valueColor: '#E24B4A', pillLabel: 'Very low', pillBg: '#FCEBEB', pillColor: '#791F1F'},
    ],
    corrTitle: '\ud83d\udd17 Food insight',
    corrBody: 'Highest glucose follows dinner (3 rotis + rice). Replacing 1 roti with salad \u2192 estimated \u221220 mg/dL post-dinner.',
  },
  {
    id: 'sleep',
    sectionLabel: 'Sleep',
    title: 'Sleep \u00b7 Apple Watch \u00b7 March 2026',
    ico: '\ud83d\ude34',
    icoBg: '#E6F1FB',
    badge: 'Below target',
    badgeBg: '#FCEBEB',
    badgeColor: '#791F1F',
    metrics: [
      {label: 'Avg nightly', value: '5.9h', ref: 'Target 7\u20138h', valueColor: '#E24B4A', pillLabel: '\u2193 Low', pillBg: '#FCEBEB', pillColor: '#791F1F'},
      {label: 'Deep sleep', value: '18% \u00b7 64min', ref: 'Target >20%', valueColor: '#BA7517', pillLabel: 'Low', pillBg: '#FAEEDA', pillColor: '#633806'},
      {label: 'Awakenings/night', value: '3.2', ref: 'Normal <2', valueColor: '#BA7517', pillLabel: '\u26a0', pillBg: '#FAEEDA', pillColor: '#633806'},
      {label: 'SpO\u2082 nadir', value: '95%', ref: '', valueColor: '#0F6E56', pillLabel: '\u2713', pillBg: '#E1F5EE', pillColor: '#085041'},
      {label: 'Sleep debt month', value: '~13h', ref: '', valueColor: '#E24B4A', pillLabel: 'High', pillBg: '#FCEBEB', pillColor: '#791F1F'},
    ],
    corrTitle: '\ud83d\udd17 Sleep \u2192 Glucose',
    corrBody: 'Sleep <6h \u2192 next-morning FBG is +15 mg/dL higher on average.',
  },
  {
    id: 'fitness',
    sectionLabel: 'Fitness',
    title: 'Fitness \u00b7 Apple Watch \u00b7 March 2026',
    ico: '\ud83c\udfc3',
    icoBg: '#E1F5EE',
    badge: 'Below goal',
    badgeBg: '#FAEEDA',
    badgeColor: '#633806',
    metrics: [
      {label: 'Avg daily steps', value: '6,240', ref: 'Goal: 8,000', valueColor: '#BA7517', pillLabel: '78%', pillBg: '#FAEEDA', pillColor: '#633806'},
      {label: 'Active minutes/day', value: '22 min', ref: 'Target 30 min', valueColor: '#BA7517', pillLabel: 'Low', pillBg: '#FAEEDA', pillColor: '#633806'},
      {label: 'Step trend 6-mo', value: '\u219124%', ref: '', valueColor: '#0F6E56', pillLabel: '\u2191', pillBg: '#E1F5EE', pillColor: '#085041'},
      {label: 'Est. VO\u2082 max', value: '28 mL/kg/min', ref: '', valueColor: '#BA7517', pillLabel: 'Low', pillBg: '#FAEEDA', pillColor: '#633806'},
    ],
    corrTitle: '\ud83d\udd17 Steps \u2192 BP',
    corrBody: '6k+ steps days: BP avg 128/82. Low-activity days: BP 138/90.',
  },
  {
    id: 'medication',
    sectionLabel: 'Medication adherence',
    title: 'Medication \u00b7 March 2026',
    ico: '\ud83d\udc8a',
    icoBg: '#EEEDFE',
    badge: 'Needs attention',
    badgeBg: '#FAEEDA',
    badgeColor: '#633806',
    metrics: [
      {label: 'Overall adherence', value: '78%', ref: 'Target >95%', valueColor: '#BA7517', pillLabel: 'Low', pillBg: '#FAEEDA', pillColor: '#633806'},
      {label: 'Metformin 1000mg AM', value: '97%', ref: '', valueColor: '#0F6E56', pillLabel: '\u2713', pillBg: '#E1F5EE', pillColor: '#085041'},
      {label: 'Metformin 1000mg PM', value: '58%', ref: '13 misses', valueColor: '#E24B4A', pillLabel: '\u26a0', pillBg: '#FCEBEB', pillColor: '#791F1F'},
      {label: 'Amlodipine 5mg', value: '100%', ref: '', valueColor: '#0F6E56', pillLabel: '\u2713', pillBg: '#E1F5EE', pillColor: '#085041'},
      {label: 'Olmesartan 20mg', value: '96%', ref: '', valueColor: '#0F6E56', pillLabel: '\u2713', pillBg: '#E1F5EE', pillColor: '#085041'},
      {label: 'Atorvastatin 10mg', value: '97%', ref: '', valueColor: '#0F6E56', pillLabel: '\u2713', pillBg: '#E1F5EE', pillColor: '#085041'},
      {label: 'Methylcobalamin', value: '84%', ref: '', valueColor: '#BA7517', pillLabel: 'Improve', pillBg: '#FAEEDA', pillColor: '#633806'},
    ],
    corrTitle: '\ud83d\udd17 PM Metformin miss \u2192 FBG',
    corrBody: 'Each missed PM dose \u2192 +12 mg/dL next-morning FBG. 13 misses in March = unnecessary 156 mg/dL of glucose burden accumulated.',
  },
];

// ─── 6. MEDICAL CONDITIONS ───────────────────────────────────
const MEDICAL_CONDITIONS = [
  {
    id: 't2dm',
    ico: 'medkit-outline', icoBg: '#FAEEDA',
    title: 'T2DM \u00B7 Type 2 Diabetes',
    sub: 'Diagnosed 2021 \u00B7 HbA1c 7.8%',
    badge: 'Suboptimal', badgeStyle: {bg: '#FAEEDA', color: '#633806'},
    risks: [
      {
        label: 'HbA1c control',
        value: '7.8% \u2192 target 7.0%',
        valueColor: '#E24B4A',
        barWidth: 78, barColor: '#E24B4A',
        detail: 'Third consecutive above-target test. Metformin 1000mg started 5 Mar \u2014 reversal expected Jun 2026.',
      },
      {
        label: 'Complication risk (5yr)',
        value: '28% \u2014 Moderate',
        valueColor: '#BA7517',
        barWidth: 28, barColor: '#BA7517',
        detail: 'Based on HbA1c trajectory, BP, lipids, T2DM duration (5yr). Controlling both glucose+BP \u2192 \u221238% 10yr CV risk.',
      },
    ],
  },
  {
    id: 'htn',
    ico: 'heart-outline', icoBg: '#FBEAF0',
    title: 'Hypertension (HTN)',
    sub: 'BP 136/86 avg \u00B7 ICD I10',
    badge: 'Above target', badgeStyle: {bg: '#FAEEDA', color: '#633806'},
    risks: [
      {
        label: 'BP control',
        value: '136/86 mmHg',
        valueColor: '#BA7517',
        barWidth: 55, barColor: '#BA7517',
        detail: 'Olmesartan (Jan 26) needs 4\u20136 more weeks. Sodium <1,500mg/day would accelerate improvement.',
      },
    ],
  },
  {
    id: 'dyslip',
    ico: 'analytics-outline', icoBg: '#E6F1FB',
    title: 'Dyslipidaemia',
    sub: 'LDL 118 \u00B7 TG 162 \u00B7 ICD E78.5',
    badge: 'Borderline', badgeStyle: {bg: '#FAEEDA', color: '#633806'},
    metrics: [
      {label: 'LDL (T2DM target)', value: '118 mg/dL', ref: 'Target <100', valueColor: '#BA7517', pillLabel: 'Above', pillStyle: {bg: '#FAEEDA', color: '#633806'}},
      {label: 'HDL', value: '52 mg/dL', ref: '', valueColor: '#0F6E56', pillLabel: '\u2713', pillStyle: {bg: '#E1F5EE', color: '#085041'}},
      {label: 'Triglycerides', value: '162 mg/dL', ref: 'Target <150', valueColor: '#BA7517', pillLabel: '\u2191', pillStyle: {bg: '#FAEEDA', color: '#633806'}},
    ],
  },
];

// ─── 7. ORGANS ───────────────────────────────────────────────
const ORGANS = [
  {id: 'heart',   ico: '\uD83E\uDEC1', icoBg: '#E1F5EE', name: 'Heart',             detail: 'Echo EF 62% normal. ECG NSR. HRV 28ms low \u2014 linked to poor sleep.',                                  pillLabel: 'Watch',   pillStyle: {bg: '#FAEEDA', color: '#633806'}},
  {id: 'kidneys', ico: '\uD83E\uDEC1', icoBg: '#E1F5EE', name: 'Kidneys',           detail: 'eGFR 72 mL/min (Stage 2 borderline). Microalbumin 18 mg/L normal. Annual monitoring.',                     pillLabel: 'Monitor', pillStyle: {bg: '#FAEEDA', color: '#633806'}},
  {id: 'liver',   ico: '\uD83E\uDEC1', icoBg: '#FAEEDA', name: 'Liver',             detail: 'Grade 1 NAFLD (USG 2023). Annual review. Weight loss primary Rx.',                                         pillLabel: 'Watch',   pillStyle: {bg: '#FAEEDA', color: '#633806'}},
  {id: 'eyes',    ico: '\uD83D\uDC41\uFE0F', icoBg: '#FCEBEB', name: 'Eyes (Retina)',    detail: 'No dilated fundus exam. HbA1c >7.5% for 3+ years \u2014 retinal screening overdue.',                   pillLabel: 'Overdue', pillStyle: {bg: '#FCEBEB', color: '#791F1F'}},
  {id: 'feet',    ico: '\uD83E\uDDB6', icoBg: '#FAEEDA', name: 'Feet (Neuropathy)', detail: 'Foot tingling 5\u00D7 this month. Physio started Mar 2026. Monofilament test needed.',                      pillLabel: 'Urgent',  pillStyle: {bg: '#FCEBEB', color: '#791F1F'}},
  {id: 'nerves',  ico: '\uD83E\uDDE0', icoBg: '#E6F1FB', name: 'Nervous system',    detail: 'Peripheral neuropathy risk moderate. B12 supplementation started.',                                        pillLabel: 'Monitor', pillStyle: {bg: '#FAEEDA', color: '#633806'}},
  {id: 'dental',  ico: '\uD83E\uDDB7', icoBg: '#f0f0f0', name: 'Dental',            detail: 'T2DM \u2192 periodontal risk. Check every 6 months. Last check: not on record.',                           pillLabel: 'No data', pillStyle: {bg: '#f0f0f0', color: '#555555'}},
];

// ─── 8. SYMPTOMS SECTIONS ────────────────────────────────────
const SYMPTOMS_SECTIONS = {
  glucose: {
    title: 'Glucose monitoring',
    ico: 'water-outline', icoBg: '#FFF5E0',
    metrics: [
      { label: 'Fasting glucose (avg)',      value: '126 mg/dL',  ref: '70\u2013100',  color: '#F5A623', pillLabel: 'Elevated',   pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'Post-meal peak (avg)',       value: '188 mg/dL',  ref: '<140',          color: '#E53935', pillLabel: 'High',       pillStyle: { bg: '#FDECEC', color: '#E53935' } },
      { label: 'Time in range (70\u2013180)', value: '62%',       ref: '\u226570%',     color: '#F5A623', pillLabel: 'Below',      pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'Hypoglycaemia events',       value: '0',          ref: '0',             color: '#2E7D32', pillLabel: 'None',       pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'Glucose variability (CV)',   value: '34%',        ref: '<36%',          color: '#2E7D32', pillLabel: 'Acceptable', pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
    ],
    correlationTitle: 'Post-dinner spikes dominate',
    correlationBody: '78% of above-range readings occur between 8 PM\u201311 PM, coinciding with high-carb dinners and missed PM Metformin. A post-dinner walk + PM dose compliance could halve these spikes.',
  },

  bp: {
    title: 'Blood pressure',
    ico: 'heart-outline', icoBg: '#FDECEC',
    metrics: [
      { label: 'Systolic (avg)',    value: '136 mmHg',        ref: '<130',        color: '#F5A623', pillLabel: 'Elevated',  pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'Diastolic (avg)',   value: '86 mmHg',         ref: '<80',         color: '#F5A623', pillLabel: 'Elevated',  pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'Morning surge',     value: '14 mmHg',         ref: '<15',         color: '#2E7D32', pillLabel: 'Normal',    pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'Nocturnal dipping', value: '8%',              ref: '10\u201320%', color: '#F5A623', pillLabel: 'Reduced',   pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'BP trend (4 wk)',   value: '\u22124/\u22123', ref: '\u2014',      color: '#2E7D32', pillLabel: 'Improving', pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
    ],
    correlationTitle: 'Sodium intake \u2192 next-day BP rise',
    correlationBody: 'Days when sodium exceeds 2,500 mg show a 6\u20138 mmHg systolic rise the following morning. Reducing pickles and processed snacks is the quickest win.',
  },

  heartRate: {
    title: 'Heart rate',
    ico: 'pulse-outline', icoBg: '#FDECEC',
    metrics: [
      { label: 'Resting HR (avg)',  value: '78 bpm',     ref: '60\u201380', color: '#2E7D32', pillLabel: 'Normal',    pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'Max HR (exercise)', value: '132 bpm',    ref: '<178',       color: '#2E7D32', pillLabel: 'Normal',    pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'HRV (RMSSD)',       value: '28 ms',      ref: '30\u201360', color: '#F5A623', pillLabel: 'Low',       pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'Resting HR trend',  value: '\u22122 bpm', ref: '\u2014',    color: '#2E7D32', pillLabel: 'Improving', pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
    ],
    correlationTitle: 'HRV dips on poor-sleep nights',
    correlationBody: 'HRV drops to ~22 ms on nights with < 5.5 h sleep, indicating elevated sympathetic tone. This raises next-day BP and glucose simultaneously.',
  },

  weight: {
    title: 'Weight & body composition',
    ico: 'scale-outline', icoBg: '#E8F5E9',
    metrics: [
      { label: 'Current weight',     value: '72.8 kg',      ref: 'Target 65 kg',   color: '#F5A623', pillLabel: 'Above',      pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'BMI',                value: '28.4',          ref: '18.5\u201324.9',  color: '#F5A623', pillLabel: 'Overweight', pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'Waist circumference', value: '88 cm',        ref: '<80 cm',          color: '#E53935', pillLabel: 'High',       pillStyle: { bg: '#FDECEC', color: '#E53935' } },
      { label: 'Weight trend (6 wk)', value: '\u22121.2 kg', ref: '\u2014',          color: '#2E7D32', pillLabel: 'Losing',     pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'Body fat % (est.)',   value: '34%',          ref: '21\u201333%',     color: '#F5A623', pillLabel: 'Above',      pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
    ],
    correlationTitle: 'Weight loss \u2192 insulin sensitivity',
    correlationBody: 'Every 1 kg lost improves insulin sensitivity by ~4\u20135%. The 1.2 kg loss is contributing to the FBG improvement. Target 0.5 kg/week.',
  },

  temperature: {
    title: 'Temperature',
    ico: 'thermometer-outline', icoBg: '#E6F1FB',
    metrics: [
      { label: 'Avg body temp',       value: '36.6 \u00B0C', ref: '36.1\u201337.2', color: '#2E7D32', pillLabel: 'Normal', pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'Max recorded (30 d)', value: '37.1 \u00B0C', ref: '<37.5',           color: '#2E7D32', pillLabel: 'Normal', pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'Fever episodes',      value: '0',             ref: '0',               color: '#2E7D32', pillLabel: 'None',   pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
    ],
    correlationTitle: 'No fever concerns',
    correlationBody: 'Temperature has been stable with no febrile episodes in the past 30 days. No infection-related glucose spikes observed.',
  },

  ecg: {
    title: 'ECG & rhythm',
    ico: 'pulse-outline', icoBg: '#EEEDFE',
    metrics: [
      { label: 'Rhythm',              value: 'Normal sinus', ref: 'NSR',     color: '#2E7D32', pillLabel: 'Normal',  pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'QTc interval',        value: '412 ms',       ref: '<440 ms', color: '#2E7D32', pillLabel: 'Normal',  pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'Atrial fib episodes', value: '0',            ref: '0',       color: '#2E7D32', pillLabel: 'None',    pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'Last ECG',            value: '22 Mar 2026',  ref: 'Annual',  color: '#2E7D32', pillLabel: 'Current', pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
    ],
    correlationTitle: 'Cardiac rhythm stable',
    correlationBody: 'No arrhythmia episodes detected on smartwatch or clinic ECG. Diabetics have 2\u00D7 AF risk, so continued monitoring is prudent.',
  },

  menstrual: {
    title: 'Menstrual health',
    ico: 'calendar-outline', icoBg: '#FBEAF0',
    metrics: [
      { label: 'Cycle length (avg)', value: '29 days',     ref: '24\u201335', color: '#2E7D32', pillLabel: 'Normal',  pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'Period duration',    value: '5 days',      ref: '3\u20137',   color: '#2E7D32', pillLabel: 'Normal',  pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'Flow',               value: 'Moderate',    ref: '\u2014',     color: '#2E7D32', pillLabel: 'Normal',  pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'PMS symptoms',       value: 'Mild',        ref: '\u2014',     color: '#F5A623', pillLabel: 'Present', pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'Last period',        value: '14 Mar 2026', ref: '\u2014',     color: '#2E7D32', pillLabel: '\u2014',  pillStyle: { bg: '#F5F5F5', color: '#666' } },
    ],
    correlationTitle: 'Peri-menstrual glucose rise',
    correlationBody: 'Fasting glucose rises by ~8\u201312 mg/dL in the 3 days before menstruation, likely due to progesterone-driven insulin resistance. Anticipatory dose timing can help.',
  },

  migraine: {
    title: 'Migraine & headache',
    ico: 'flash-outline', icoBg: '#EEEDFE',
    metrics: [
      { label: 'Episodes (30 d)',    value: '2',             ref: '\u22644', color: '#2E7D32', pillLabel: 'Mild',     pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'Avg intensity',      value: '5/10',          ref: '\u2014',  color: '#F5A623', pillLabel: 'Moderate', pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'Avg duration',       value: '4 h',           ref: '\u2014',  color: '#F5A623', pillLabel: 'Moderate', pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'Trigger identified', value: 'Sleep deficit', ref: '\u2014',  color: '#F5A623', pillLabel: 'Sleep',    pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
    ],
    correlationTitle: 'Migraines cluster after short sleep',
    correlationBody: 'Both migraine episodes occurred the morning after < 5 h sleep nights. Improving sleep duration is likely to reduce migraine frequency.',
  },

  msk: {
    title: 'Musculoskeletal',
    ico: 'body-outline', icoBg: '#FFF5E0',
    metrics: [
      { label: 'Foot tingling',  value: 'Intermittent', ref: 'None',     color: '#E53935', pillLabel: 'Present', pillStyle: { bg: '#FDECEC', color: '#E53935' } },
      { label: 'Knee pain (R)',  value: 'Mild',         ref: 'None',     color: '#F5A623', pillLabel: 'Mild',    pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'Ankle oedema',   value: 'Trace',        ref: 'None',     color: '#F5A623', pillLabel: 'Trace',   pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'Grip strength',  value: '22 kg',        ref: '\u226520', color: '#2E7D32', pillLabel: 'Normal',  pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
    ],
    correlationTitle: 'Foot tingling may signal early neuropathy',
    correlationBody: 'Intermittent tingling in toes (R > L) correlates with HbA1c > 7.5%. Improving glycaemic control and scheduling an NCV test are priority actions.',
  },

  stress: {
    title: 'Mental health & stress',
    ico: 'happy-outline', icoBg: '#EEEDFE',
    metrics: [
      { label: 'PHQ-9 score',          value: '8',            ref: '\u22644 (none)', color: '#F5A623', pillLabel: 'Mild',     pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'GAD-7 score',          value: '6',            ref: '\u22644 (none)', color: '#F5A623', pillLabel: 'Mild',     pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'Perceived stress',     value: 'Moderate',     ref: 'Low',            color: '#F5A623', pillLabel: 'Moderate', pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'Mood trend (30 d)',    value: 'Stable',       ref: '\u2014',         color: '#2E7D32', pillLabel: 'Stable',   pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'Counselling sessions', value: '2 this month', ref: 'Bi-weekly',      color: '#2E7D32', pillLabel: 'On track', pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
    ],
    correlationTitle: 'Stress \u2192 cortisol \u2192 glucose',
    correlationBody: 'Elevated stress (PHQ-9: 8, GAD-7: 6) drives cortisol-mediated glucose spikes. Counselling continuation and sleep improvement are synergistic interventions.',
  },

  anaemia: {
    title: 'Anaemia profile',
    ico: 'water-outline', icoBg: '#FDECEC',
    metrics: [
      { label: 'Haemoglobin',         value: '11.8 g/dL',   ref: '12.0\u201316.0', color: '#F5A623', pillLabel: 'Low',        pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'Serum ferritin',      value: '28 ng/mL',    ref: '30\u2013150',    color: '#F5A623', pillLabel: 'Borderline', pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'MCV',                 value: '82 fL',       ref: '80\u2013100',    color: '#2E7D32', pillLabel: 'Normal',     pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'Vitamin B12',         value: '312 pg/mL',   ref: '200\u2013900',   color: '#2E7D32', pillLabel: 'Low-normal', pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'Iron supplementation', value: 'Not started', ref: 'Consider',       color: '#F5A623', pillLabel: 'Pending',   pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
    ],
    correlationTitle: 'Metformin + low iron = persistent mild anaemia',
    correlationBody: 'Metformin impairs B12 absorption, and borderline ferritin (28 ng/mL) suggests early iron depletion. Combined supplementation could raise Hb above 12 g/dL within 8\u201312 weeks.',
  },

  vaccination: {
    title: 'Vaccination status',
    ico: 'shield-checkmark-outline', icoBg: '#E8F5E9',
    metrics: [
      { label: 'Influenza (annual)',    value: 'Oct 2025',  ref: 'Annual (Oct\u2013Nov)', color: '#2E7D32', pillLabel: 'Current',  pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'Hepatitis B',          value: '3/3 doses', ref: 'Complete',               color: '#2E7D32', pillLabel: 'Complete', pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'COVID-19 booster',     value: 'Mar 2025',  ref: 'Annual booster',         color: '#F5A623', pillLabel: 'Due soon', pillStyle: { bg: '#FFF5E0', color: '#E65100' } },
      { label: 'Pneumococcal (PPSV23)', value: 'Not given', ref: 'Recommended for DM',    color: '#E53935', pillLabel: 'Overdue',  pillStyle: { bg: '#FDECEC', color: '#E53935' } },
      { label: 'HPV',                  value: '3/3 doses', ref: 'Complete',               color: '#2E7D32', pillLabel: 'Complete', pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
      { label: 'Tetanus (Tdap)',       value: 'Jan 2022',  ref: 'Every 10 years',         color: '#2E7D32', pillLabel: 'Current',  pillStyle: { bg: '#E8F5E9', color: '#2E7D32' } },
    ],
    correlationTitle: 'Pneumococcal vaccine overdue',
    correlationBody: 'Diabetics are at 3\u00D7 higher risk of invasive pneumococcal disease. PPSV23 vaccination is strongly recommended and should be scheduled at the next clinic visit (\u20B91,500\u2013\u20B92,200 at Apollo).',
  },
};

// ─── LIFESTYLE DETAIL DATA ──────────────────────────────────
const LIFESTYLE_DETAIL_DATA = {
  nutrition: {
    about: 'Nutrition is the highest-leverage modifiable health factor. High refined carbs, high sodium, low fibre drives HbA1c, TG, and BP.',
    urgency: 'high',
    narrative: 'Dinner carb load (3 rotis + rice) drives 60% of glucose spikes. Replacing 1 roti with salad reduces post-dinner glucose by ~20 mg/dL.',
    symptoms: [
      'Post-meal fatigue and brain fog',
      'Persistent thirst (high sodium)',
      'Migraine episodes (dehydration)',
      'Bloating (low fibre, 14g/day)',
      'Difficulty losing weight (58% carbs)',
    ],
    causes: [
      'High-carb dinner pattern (3 rotis + rice)',
      'Sodium in pickles, papad, snacks',
      'Inadequate water (<6 glasses/day)',
      'Low fibre diet',
      'Late dinner timing',
    ],
    organs: [
      {n: 'Liver', stage: 'Grade 1 NAFLD', sev: 52, col: '#06B6D4'},
      {n: 'Kidneys', stage: 'Sodium Load', sev: 35, col: '#3B82F6'},
      {n: 'Pancreas', stage: 'Beta Cell Stress', sev: 55, col: '#F59E0B'},
      {n: 'Blood Vessels', stage: 'Atherogenic', sev: 45, col: '#EF4444'},
    ],
    cluster: {
      risk: '68%',
      name: 'Dietary-Metabolic Cascade',
      diseases: [
        {n: 'T2DM Instability', p: 78, type: 'active'},
        {n: 'NAFLD', p: 60, type: 'active'},
        {n: 'HTN Resistance', p: 55, type: 'emerging'},
        {n: 'Dyslipidaemia', p: 65, type: 'active'},
      ],
    },
    timeline: [
      {time: 'Now', event: 'Diet driving HbA1c 7.8%, TG 162, BP 136/86, NAFLD', col: '#EF4444'},
      {time: '3 months', event: 'Reducing carbs <50% + hydration: HbA1c drop 0.3%', col: '#F97316'},
      {time: '12 months', event: 'NAFLD may regress, LDL:TG improving', col: '#F59E0B'},
      {time: 'Without change', event: 'TG rises to 200+, NAFLD grade 2', col: '#9CA3AF'},
    ],
    actions: [
      {title: 'Replace 1 roti with salad', desc: 'Reduces post-dinner glucose 196→158 mg/dL', pri: 'high', ico: 'restaurant-outline'},
      {title: 'Drink 8 glasses water', desc: 'Addresses migraine and microalbumin', pri: 'high', ico: 'water-outline'},
      {title: 'Cut pickles & papad', desc: 'Removes 800mg/day sodium excess', pri: 'high', ico: 'close-circle-outline'},
      {title: 'Add 1 cup dal at dinner', desc: '4-6g fibre, slows gastric emptying', pri: 'medium', ico: 'leaf-outline'},
    ],
    treatment: [
      'Nutrition consult for T2DM low-GI Indian meal plan',
      'Target carbs <50%',
      'Target sodium <1,500 mg/day',
      'Target fibre 25-30g/day',
      'Target hydration 2.5L/day',
    ],
    prevention: 'Low-GI Indian diet achievable without sacrificing cultural food. Key swaps: brown rice for white, dal for extra roti, 1 glass water before each meal.',
    progression: {
      position: 0.72,
      panels: [
        {lbl: 'Macros', score: '58%', bar: 50, badge: 'Stable', badgeCol: '#D97706', detail: 'Carbs 58%, declining from 62%'},
        {lbl: 'Hydration', score: '1.4L', bar: 28, badge: 'Low', badgeCol: '#DC2626', detail: '1.4L/day vs 2.5L target'},
        {lbl: 'Sodium', score: '2.1g', bar: 70, badge: 'High', badgeCol: '#DC2626', detail: '2,100 mg/day vs <1,500 target'},
      ],
    },
  },

  sleep: {
    about: 'Sleep is the most underestimated metabolic drug. <6h raises cortisol, impairs insulin, raises FBG.',
    urgency: 'high',
    narrative: 'Chronic sleep deficit of 5.9h (vs 7h target) is raising FBG by ~15 mg/dL per night and suppressing HRV to 28ms.',
    symptoms: [
      'Morning fatigue',
      'Brain fog',
      'Carb cravings next day',
      'Higher FBG on poor sleep nights',
      'Mood dip',
      'Screen time delay',
    ],
    causes: [
      'Late sleep onset (12:08 AM avg)',
      'No wind-down routine',
      'Work rumination (GAD-7: 6)',
      'Nocturia (3.2 awakenings)',
      'Inconsistent weekend schedule',
    ],
    organs: [
      {n: 'Brain', stage: 'Impaired Restoration', sev: 55, col: '#7C3AED'},
      {n: 'Pancreas', stage: 'Insulin Resistance', sev: 60, col: '#F59E0B'},
      {n: 'Heart', stage: 'HRV Suppressed', sev: 48, col: '#EF4444'},
      {n: 'Adrenal Glands', stage: 'Cortisol Dysregulation', sev: 52, col: '#DC2626'},
    ],
    cluster: {
      risk: '72%',
      name: 'Sleep-Metabolic Cluster',
      diseases: [
        {n: 'T2DM Instability', p: 75, type: 'active'},
        {n: 'HTN Worsening', p: 60, type: 'active'},
        {n: 'Depression/Anxiety', p: 55, type: 'emerging'},
        {n: 'CV Risk', p: 40, type: 'watch'},
      ],
    },
    timeline: [
      {time: 'Now', event: '5.9h sleep: FBG +15, HRV 28ms, PHQ-9 8', col: '#EF4444'},
      {time: '2 weeks', event: '7h sleep: FBG drops ~15 mg/dL', col: '#F97316'},
      {time: '3 months', event: 'HbA1c -0.3-0.4%, HRV normalising', col: '#F59E0B'},
      {time: 'Without change', event: 'HbA1c worsens, BP escalation, depression rising', col: '#9CA3AF'},
    ],
    actions: [
      {title: 'Sleep by 11 PM tonight', desc: "Tomorrow FBG ~15 mg/dL lower", pri: 'high', ico: 'moon-outline'},
      {title: '10:30 PM wind-down alarm', desc: '30-min dim lights, no screens', pri: 'high', ico: 'alarm-outline'},
      {title: 'Reduce evening fluids after 8 PM', desc: 'Reduce 3.2 awakenings from nocturia', pri: 'medium', ico: 'water-outline'},
      {title: 'Keep weekend wake time consistent', desc: 'Prevents Monday circadian disruption', pri: 'medium', ico: 'calendar-outline'},
    ],
    treatment: [
      'No medication - behavioural first',
      'Target 7h minimum',
      'Track via Apple Watch',
      'Consider CBT-I if no improvement in 4 weeks',
      'Rule out sleep apnoea if awakenings persist',
    ],
    prevention: 'Consistent 10:30 PM wind-down, no screens after 10 PM, cool dark bedroom, phone outside.',
    progression: {
      position: 0.3,
      panels: [
        {lbl: 'Duration', score: '5.9h', bar: 35, badge: 'Low', badgeCol: '#DC2626', detail: '5.9h avg, declining from 6.3h'},
        {lbl: 'Quality', score: '18%', bar: 45, badge: 'Stable', badgeCol: '#D97706', detail: 'Deep sleep 18%, target >20%'},
        {lbl: 'Consistency', score: '\u00b11.8h', bar: 30, badge: 'Poor', badgeCol: '#DC2626', detail: 'Weekday vs weekend varies 1.8h'},
      ],
    },
  },

  fitness: {
    about: 'Physical activity is the strongest non-medication BP lever. 6k+ step days: BP 128/82 vs 138/90.',
    urgency: 'medium',
    narrative: 'Steps up 24% to 6,240/day but still below 8,000 target. 6k+ step days show BP 128/82 vs 138/90 on low-activity days.',
    symptoms: [
      'Breathlessness on stairs',
      'Low stamina',
      'Slow recovery',
      'Ankle oedema sitting',
      'Low mood sedentary days',
    ],
    causes: [
      'Desk-based work',
      'Anaemia reducing motivation',
      'Knee pain 4x/month',
      'No structured routine',
      'Fatigue from poor sleep + Vit D',
    ],
    organs: [
      {n: 'Heart', stage: 'Deconditioning', sev: 48, col: '#EF4444'},
      {n: 'Muscles', stage: 'Suboptimal', sev: 40, col: '#F59E0B'},
      {n: 'Blood Vessels', stage: 'Improving', sev: 30, col: '#16A34A'},
      {n: 'Liver', stage: 'NAFLD Benefit', sev: 35, col: '#06B6D4'},
    ],
    cluster: {
      risk: '48%',
      name: 'Deconditioning-Metabolic Cluster',
      diseases: [
        {n: 'T2DM Insulin Resistance', p: 60, type: 'active'},
        {n: 'Hypertension', p: 55, type: 'active'},
        {n: 'NAFLD', p: 50, type: 'active'},
        {n: 'Depression', p: 45, type: 'watch'},
      ],
    },
    timeline: [
      {time: 'Now', event: '6,240 steps/day, VO2 max 28, active minutes 22/day', col: '#F59E0B'},
      {time: '1 month', event: '8,000 steps target: BP drops ~5 mmHg systolic', col: '#F97316'},
      {time: '6 months', event: 'VO2 max improving, NAFLD benefit, weight loss', col: '#F59E0B'},
      {time: 'Without change', event: 'Deconditioning worsens, BP remains elevated', col: '#9CA3AF'},
    ],
    actions: [
      {title: '15-min after-dinner walk', desc: 'Post-dinner glucose 180→155 mg/dL', pri: 'high', ico: 'walk-outline'},
      {title: 'Add 10-min morning stretch', desc: 'Improves mobility, reduces knee pain', pri: 'medium', ico: 'body-outline'},
      {title: 'Weekend 30-min walk', desc: 'Builds aerobic base, improves VO2 max', pri: 'medium', ico: 'fitness-outline'},
      {title: 'Track active minutes daily', desc: 'Target 30 min/day via Apple Watch', pri: 'medium', ico: 'watch-outline'},
    ],
    treatment: [
      'No medication needed - activity modification',
      'Target 8,000 steps/day',
      'Target 30 active minutes/day',
      'Knee assessment if pain persists',
      'Reassess VO2 max in 3 months',
    ],
    prevention: 'Daily evening walk is the single most impactful habit. Start with 15 min post-dinner, build to 30 min. Combine with weekend longer walks.',
    progression: {
      position: 0.5,
      panels: [
        {lbl: 'Activity', score: '6.2k', bar: 62, badge: 'Improving', badgeCol: '#16A34A', detail: '6,240 steps/day, up 24%'},
        {lbl: 'Cardiovascular', score: '28', bar: 46, badge: 'Low', badgeCol: '#D97706', detail: 'VO2 max 28, target >30'},
        {lbl: 'Consistency', score: '72%', bar: 72, badge: 'Good', badgeCol: '#16A34A', detail: '72% of days reached 5,000+ steps'},
      ],
    },
  },

  medication: {
    about: '78% overall adherence masks 97% AM vs 58% PM split. PM Metformin controls overnight glucose.',
    urgency: 'high',
    narrative: 'PM Metformin adherence at 58% (13 misses) is the critical gap. Each miss adds +12 mg/dL to next-morning FBG.',
    symptoms: [
      'Higher FBG after PM misses',
      'Fatigue on high-glucose mornings',
      'Reduced wellbeing',
      'Anxiety about control',
    ],
    causes: [
      'No PM reminder set',
      'Late night pushing meds out',
      'Dinner timing varies',
      'Methylcobalamin not in organiser',
      'No visual tracker',
    ],
    organs: [
      {n: 'Liver', stage: 'Overnight Glucose Release', sev: 55, col: '#06B6D4'},
      {n: 'Kidneys', stage: 'Hydration Concern', sev: 25, col: '#3B82F6'},
      {n: 'Nerves', stage: 'B12 Depletion', sev: 42, col: '#F59E0B'},
      {n: 'Brain', stage: 'Adherence Fatigue', sev: 30, col: '#7C3AED'},
    ],
    cluster: {
      risk: '62%',
      name: 'Non-Adherence Cascade',
      diseases: [
        {n: 'HbA1c Non-Achievement', p: 72, type: 'active'},
        {n: 'B12 Neuropathy', p: 45, type: 'emerging'},
        {n: 'Glycaemic Instability', p: 68, type: 'active'},
        {n: 'CKD Progression', p: 25, type: 'watch'},
      ],
    },
    timeline: [
      {time: 'Now', event: '78% adherence, PM Metformin 58%, FBG +12 per miss', col: '#EF4444'},
      {time: '2 weeks', event: '95%+ PM adherence: FBG drops ~12 mg/dL', col: '#F97316'},
      {time: '3 months', event: 'HbA1c -0.3-0.5% from adherence alone', col: '#F59E0B'},
      {time: 'Without change', event: 'HbA1c continues rising, B12 neuropathy risk', col: '#9CA3AF'},
    ],
    actions: [
      {title: 'Set 9 PM Metformin alarm', desc: 'Each dose = -12 mg/dL next-morning FBG', pri: 'high', ico: 'alarm-outline'},
      {title: 'Add Methylcobalamin to pill organiser', desc: 'Prevents B12 depletion neuropathy', pri: 'high', ico: 'medkit-outline'},
      {title: 'Use visual adherence tracker', desc: 'Daily check-off builds habit loop', pri: 'medium', ico: 'checkbox-outline'},
      {title: 'Pair PM meds with dinner', desc: 'Anchors habit to existing routine', pri: 'medium', ico: 'restaurant-outline'},
    ],
    treatment: [
      'PM Metformin alarm at 9 PM daily',
      'Pill organiser for all medications',
      'Monthly adherence review with pharmacist',
      'Consider extended-release Metformin if PM dose remains problematic',
      'B12 monitoring every 6 months on Metformin',
    ],
    prevention: 'Simple 9 PM phone alarm + pill organiser eliminates 90% of PM misses. Pair with dinner to anchor the habit.',
    progression: {
      position: 0.45,
      panels: [
        {lbl: 'Critical Meds', score: '88%', bar: 73, badge: 'Moderate', badgeCol: '#D97706', detail: 'AM+PM+BP combined 88%'},
        {lbl: 'BP Meds', score: '98%', bar: 98, badge: 'Excellent', badgeCol: '#16A34A', detail: 'Amlodipine 100%, Olmesartan 96%'},
        {lbl: 'New Meds', score: '84%', bar: 70, badge: 'Improve', badgeCol: '#D97706', detail: 'Methylcobalamin 84%, Atorvastatin 97%'},
      ],
    },
  },
};

// ─── 9. MEDICAL DETAIL DATA ──────────────────────────────────
const MEDICAL_DETAIL_DATA = {
  t2dm: {
    hdr: [
      {lbl: 'HbA1c', val: '7.8%', unit: 'target <7.0%', col: '#DC2626'},
      {lbl: 'FBG', val: '126', unit: 'mg/dL', col: '#F59E0B'},
      {lbl: 'Comp. risk', val: '28%', unit: '5-year', col: '#D97706'},
      {lbl: 'Duration', val: '5 yrs', unit: 'since 2021', col: '#888888'},
    ],
    about: 'Type 2 Diabetes Mellitus is Priya\'s primary condition, diagnosed 2021. HbA1c of 7.8% is above the 7.0% T2DM target for the third consecutive test. Managed with Metformin 1000mg BD.',
    urgency: 'high',
    narrative: 'Priya, your T2DM has been above-target for 3 consecutive tests \u2014 HbA1c rising from 7.2% to 7.8%. The root is the evening cascade: PM Metformin misses \u2192 large dinner \u2192 poor sleep \u2192 cortisol spike \u2192 high FBG. Metformin uptitration on 5 Mar is your strongest medication signal in 18 months.',
    correlations: [
      {lbl: 'PM Metformin miss \u2192 overnight glucose', val: '13 PM misses in March. Each miss = +12 mg/dL next-morning FBG.'},
      {lbl: 'Sleep deprivation \u2192 HbA1c', val: 'Sleep <6h \u2192 cortisol \u2192 insulin resistance. Sleep explains 40% of FBG variability.'},
      {lbl: 'Post-dinner inactivity', val: 'No walk on 22 of 31 evenings. Walk days: 158 mg/dL. No-walk: 196 mg/dL.'},
      {lbl: 'Vit D deficiency', val: 'Vit D 18 ng/mL worsens beta-cell function. Correcting may reduce HbA1c by 0.2\u20130.4%.'},
    ],
    symptoms: [
      'Increased thirst and frequent urination',
      'Fatigue especially post-meals',
      'Foot tingling and numbness (early neuropathy)',
      'Blurred vision on high-glucose days',
      'Slow-healing cuts and frequent infections',
      'Brain fog and difficulty concentrating',
    ],
    causes: [
      'Insulin resistance from adiposity (BMI 25, WHR 0.84)',
      'High-carbohydrate diet (58%) driving hyperglycaemia',
      'Sleep deprivation (5.9h) elevating cortisol',
      'PM Metformin non-adherence (58%)',
      'Vit D deficiency (18 ng/mL) worsening beta-cell function',
    ],
    organs: [
      {n: 'Kidneys', stage: 'CKD Stage 2', sev: 42, col: '#3B82F6'},
      {n: 'Eyes', stage: 'Screening Overdue', sev: 55, col: '#8B5CF6'},
      {n: 'Nerves', stage: 'Early Neuropathy', sev: 50, col: '#F59E0B'},
      {n: 'Heart', stage: 'Elevated Risk', sev: 52, col: '#EF4444'},
      {n: 'Liver', stage: 'Grade 1 NAFLD', sev: 45, col: '#06B6D4'},
    ],
    cluster: {
      risk: '75%', name: 'T2DM Complication Cascade',
      diseases: [
        {n: 'Diabetic Nephropathy', p: 38, type: 'watch'},
        {n: 'Diabetic Retinopathy', p: 45, type: 'emerging'},
        {n: 'Peripheral Neuropathy', p: 52, type: 'active'},
        {n: 'Cardiovascular Disease', p: 55, type: 'emerging'},
        {n: 'NAFLD', p: 60, type: 'active'},
      ],
    },
    timeline: [
      {time: 'Now', event: 'HbA1c 7.8% \u2014 above target for 3 tests. Neuropathy early symptoms.', col: '#EF4444'},
      {time: 'Jun 2026', event: 'Metformin 1000mg effect expected: HbA1c 7.3\u20137.5%.', col: '#F97316'},
      {time: '12\u201318 months', event: 'If HbA1c reaches 7.0%: complication risk stabilises.', col: '#F59E0B'},
      {time: 'Without control', event: 'HbA1c stays >7.5%: microalbumin crosses 30. Retinopathy progresses.', col: '#9CA3AF'},
    ],
    actions: [
      {title: 'Fix PM Metformin \u2014 Tonight', desc: 'Set 9 PM alarm. Each dose = \u221212 mg/dL tomorrow morning.', pri: 'high', ico: 'alarm-outline'},
      {title: 'Book Retinal Screening', desc: '5 years of T2DM, 0 fundus exams. Early retinopathy is treatable.', pri: 'high', ico: 'eye-outline'},
      {title: '15-min Post-Dinner Walk', desc: 'Reduces post-dinner glucose from 196 to 158 mg/dL average.', pri: 'high', ico: 'walk-outline'},
      {title: 'HbA1c Retest June 2026', desc: 'First post-uptitration test. Expected: 7.3\u20137.5%.', pri: 'medium', ico: 'flask-outline'},
    ],
    treatment: [
      'Metformin 1000mg BD \u2014 AM 97% (maintain), PM 58% (critical to improve to >95%)',
      'HbA1c target: <7.0% \u2014 current 7.8%, declining trajectory with new dose',
      'Annual organ screening: eye (overdue), kidney, foot (monofilament), neuropathy',
      'T2DM education: carbohydrate counting, glycaemic index, post-meal activity',
    ],
    prevention: 'Maintaining HbA1c <7.0% with Metformin + diet + activity reduces microvascular complication risk by 37%. Every 1% HbA1c reduction = significant organ protection.',
    progression: {
      position: 0.82,
      panels: [
        {lbl: 'Glycaemic control', score: '7.8%', bar: 40, badge: '\u2191 Worsening', badgeCol: '#DC2626', detail: 'HbA1c rising: 7.2% (Mar 25) \u2192 7.8% (Mar 26). Metformin 1000mg started 5 Mar.'},
        {lbl: 'Medication response', score: '97%', bar: 70, badge: 'AM good / PM poor', badgeCol: '#D97706', detail: 'AM adherence 97% (excellent). PM 58% (critical gap \u2014 13 misses in March).'},
        {lbl: 'Complication risk', score: '28%', bar: 28, badge: '\u2191 Rising', badgeCol: '#D97706', detail: '5-year T2DM + HbA1c 7.8% + BP 136/86 \u2192 28% 5-year complication risk.'},
      ],
    },
  },
  htn: {
    hdr: [
      {lbl: 'Systolic', val: '136', unit: 'mmHg', col: '#D97706'},
      {lbl: 'Diastolic', val: '86', unit: 'mmHg', col: '#D97706'},
      {lbl: 'Target', val: '130/80', unit: 'T2DM', col: '#888888'},
      {lbl: 'Since', val: 'Jan 26', unit: 'Olmesartan', col: '#16A34A'},
    ],
    about: 'Hypertension with BP averaging 136/86 mmHg \u2014 above the T2DM-specific target of 130/80. Olmesartan 20mg started January 2026 at 96% adherence.',
    urgency: 'medium',
    narrative: 'BP of 136/86 mmHg is above target but improving. Olmesartan is producing its effect. BP is activity-dependent \u2014 6,000+ step days average 128/82, low-activity days 138/90. Sodium excess (2,100 mg/day) is fighting Olmesartan\'s effect.',
    correlations: [
      {lbl: 'Activity \u2192 BP', val: '6,000+ step days: BP 128/82. Below 4,000 steps: 138/90. Strongest non-medication lever.'},
      {lbl: 'Sodium \u2192 BP opposition', val: 'At 2,100 mg/day sodium (target <1,500), each 500mg reduction lowers systolic by 2\u20133 mmHg.'},
      {lbl: 'Sleep \u2192 BP', val: 'Sleep <6h adds +4 mmHg systolic vs 7h sleep nights.'},
      {lbl: 'T2DM \u2192 HTN coupling', val: 'Hyperglycaemia causes endothelial dysfunction. Lowering HbA1c reduces systolic by 2\u20133 mmHg.'},
    ],
    symptoms: [
      'Usually asymptomatic \u2014 the silent killer',
      'Occasional morning headaches',
      'Ankle oedema bilateral (Amlodipine side effect)',
      'Reduced exercise tolerance',
    ],
    causes: [
      'High sodium diet (2,100 mg/day vs target <1,500)',
      'Physical inactivity on low-activity days',
      'T2DM endothelial dysfunction',
      'Stress cortisol elevation (GAD-7: 6)',
      'Sleep deprivation raising nocturnal sympathetic tone',
    ],
    organs: [
      {n: 'Heart', stage: 'Pressure Load', sev: 48, col: '#EF4444'},
      {n: 'Kidneys', stage: 'Nephropathy Risk', sev: 42, col: '#3B82F6'},
      {n: 'Brain', stage: 'Stroke Risk', sev: 40, col: '#7C3AED'},
      {n: 'Eyes', stage: 'Hypertensive Retinopathy', sev: 38, col: '#8B5CF6'},
    ],
    cluster: {
      risk: '58%', name: 'Cardiometabolic HTN Cluster',
      diseases: [
        {n: 'Cardiovascular Disease', p: 50, type: 'emerging'},
        {n: 'Hypertensive Nephropathy', p: 40, type: 'emerging'},
        {n: 'Stroke Risk', p: 35, type: 'watch'},
        {n: 'Hypertensive Retinopathy', p: 30, type: 'watch'},
      ],
    },
    timeline: [
      {time: 'Now', event: 'BP 136/86 \u2014 above T2DM target. Olmesartan still in onset window.', col: '#F59E0B'},
      {time: '3 months', event: 'With sodium + activity: BP expected 128\u2013130/80.', col: '#F97316'},
      {time: '12 months', event: 'Sustained <130/80: eGFR stabilises, cardiac load normalises.', col: '#F59E0B'},
      {time: 'Without control', event: 'BP stays 136/86+: LVH risk, eGFR decline accelerates.', col: '#9CA3AF'},
    ],
    actions: [
      {title: 'Cut Sodium Below 1,500 mg/day', desc: 'Remove pickles, papad, snacks. \u22122\u20133 mmHg systolic per 500mg.', pri: 'high', ico: 'water-outline'},
      {title: '8,000 Steps Daily', desc: '6k+ step days already show BP 128/82 vs 138/90 on low days.', pri: 'high', ico: 'walk-outline'},
      {title: 'Continue Olmesartan 96%', desc: 'Dual benefit: BP lowering + renal protection.', pri: 'high', ico: 'medkit-outline'},
      {title: 'BP Self-Monitoring Weekly', desc: 'Home BP every Sunday morning after 5 min rest.', pri: 'medium', ico: 'pulse-outline'},
    ],
    treatment: [
      'Olmesartan 20mg OD \u2014 continue (96% adherence, renoprotective)',
      'Amlodipine 5mg OD \u2014 continue (100% adherence)',
      'BP target: <130/80 mmHg (currently 136/86, improving)',
      'Annual echo if BP not at target by Dec 2026',
      'Reduce sodium to <1,500 mg/day',
    ],
    prevention: 'HTN prevention requires: lower carbs, increase activity, reduce sodium, improve sleep. All four are within Priya\'s current change agenda.',
    progression: {
      position: 0.62,
      panels: [
        {lbl: 'Systolic control', score: '136', bar: 55, badge: '\u2191 Above target', badgeCol: '#D97706', detail: 'Systolic 136 mmHg vs target 130. Olmesartan still in onset phase.'},
        {lbl: 'Activity impact', score: '128', bar: 75, badge: '\u2193 On active days', badgeCol: '#16A34A', detail: '6k+ step days: 128/82. Low-activity: 138/90. 10 mmHg difference.'},
        {lbl: 'Medication effect', score: '96%', bar: 96, badge: '\u2713 Excellent', badgeCol: '#16A34A', detail: 'Olmesartan 96% + Amlodipine 100%. Gap is sodium + inactivity.'},
      ],
    },
  },
  dyslip: {
    hdr: [{lbl:'LDL',val:'118',unit:'mg/dL',col:'#D97706'},{lbl:'TG',val:'162',unit:'mg/dL',col:'#D97706'},{lbl:'HDL',val:'52',unit:'mg/dL',col:'#16A34A'},{lbl:'TC',val:'188',unit:'mg/dL',col:'#D97706'}],
    about: 'Dyslipidaemia with atherogenic pattern: LDL 118 (above T2DM target <100), TG 162 (mildly elevated), HDL 52 (adequate). Managed with Atorvastatin 10mg.',
    urgency: 'medium',
    narrative: 'LDL on clear downward trajectory \u2014 145 to 118 over 2.5 years on Atorvastatin. TG 162 is flat, driven by 58% carbohydrate diet. TG:HDL ratio of 3.1 confirms insulin resistance pattern.',
    correlations: [
      {lbl: 'High carb \u2192 TG \u2192 LDL quality', val: '58% carbs creates small dense LDL \u2014 3\u00D7 more atherogenic.'},
      {lbl: 'T2DM \u2192 dyslipidaemia', val: 'Every 1% HbA1c improvement modestly improves all lipids.'},
      {lbl: 'LDL trajectory', val: 'Declining ~2 mg/dL/month. Target <100 by Sep\u2013Oct 2026.'},
      {lbl: 'TG \u2192 NAFLD', val: 'TG 162 feeds liver fat. Reducing TG is the primary NAFLD lever.'},
    ],
    symptoms: [
      'Usually asymptomatic \u2014 detected on blood tests',
      'Elevated atherogenic risk is the key concern',
    ],
    causes: [
      'T2DM insulin resistance worsening all lipid parameters',
      'High-carbohydrate diet (58%) driving TG via VLDL',
      'Physical inactivity reducing clearance and HDL',
    ],
    organs: [
      {n: 'Arteries', stage: 'Plaque Building', sev: 50, col: '#EF4444'},
      {n: 'Heart', stage: 'Coronary Risk', sev: 48, col: '#EF4444'},
      {n: 'Liver', stage: 'NAFLD Driver', sev: 52, col: '#06B6D4'},
    ],
    cluster: {
      risk: '58%', name: 'Atherogenic Dyslipidaemia Cluster',
      diseases: [
        {n: 'Coronary Artery Disease', p: 50, type: 'emerging'},
        {n: 'NAFLD Grade 1', p: 60, type: 'active'},
        {n: 'Ischaemic Stroke', p: 35, type: 'watch'},
      ],
    },
    timeline: [
      {time: 'Now', event: 'LDL 118 declining on Atorvastatin. TG 162 stable. HDL 52 adequate.', col: '#F59E0B'},
      {time: 'Sep 2026', event: 'Expected LDL 100\u2013108. TG may decline if carbs reduced.', col: '#F97316'},
      {time: '12\u201324 months', event: 'LDL <100: atherogenic risk significantly reduced.', col: '#F59E0B'},
      {time: 'Without progress', event: 'LDL stays >100, TG rises: accelerated arterial disease.', col: '#9CA3AF'},
    ],
    actions: [
      {title: 'Continue Atorvastatin 10mg', desc: 'LDL declining 2 mg/dL/month. Discuss 20mg if plateau >100 at Sep 2026.', pri: 'high', ico: 'medkit-outline'},
      {title: 'Reduce Dinner Carbohydrates', desc: 'Replace rice + 3 rotis with 1 roti + dal + vegetables.', pri: 'high', ico: 'restaurant-outline'},
      {title: 'Add Omega-3 Sources', desc: 'Sardines, walnuts, flaxseed. Reduces TG 10\u201330%.', pri: 'medium', ico: 'leaf-outline'},
    ],
    treatment: [
      'Atorvastatin 10mg ON daily \u2014 continue (97% adherence)',
      'LDL target <100 mg/dL for T2DM (currently 118, declining)',
      'Annual LFT while on statin',
      'Consider Ezetimibe if LDL plateaus above 100 at Sep 2026',
    ],
    prevention: 'Annual lipid panel. Replace saturated fats with unsaturated. Carb reduction is the TG intervention.',
    progression: {
      position: 0.58,
      panels: [
        {lbl: 'LDL trajectory', score: '118', bar: 55, badge: '\u2193 Improving', badgeCol: '#16A34A', detail: 'LDL 145 \u2192 118 over 2.5 years on Atorvastatin. Target <100 by Sep 2026.'},
        {lbl: 'TG control', score: '162', bar: 42, badge: '\u2194 Stable', badgeCol: '#D97706', detail: 'TG 162 (target <150). Flat 18 months. Dietary carb reduction needed.'},
        {lbl: 'HDL protection', score: '52', bar: 80, badge: '\u2713 Adequate', badgeCol: '#16A34A', detail: 'HDL 52 (target 50\u201380). Holding steady. Steps should push to 55\u201357.'},
      ],
    },
  },
  heart: {
    hdr: [{lbl:'EF',val:'62%',unit:'Echo normal',col:'#16A34A'},{lbl:'HRV',val:'28ms',unit:'low',col:'#DC2626'},{lbl:'BP load',val:'136/86',unit:'mmHg',col:'#D97706'},{lbl:'Risk',val:'Moderate',unit:'10yr',col:'#D97706'}],
    about: 'Heart structurally normal (Echo EF 62%, ECG NSR) but under functional stress from T2DM atherosclerotic risk, HTN 136/86, and anaemia compensation. HRV 28ms is the most actionable marker.',
    urgency: 'medium',
    narrative: 'Echo EF 62% normal, ECG NSR. But HRV 28ms is low \u2014 reflecting poor sleep and chronic sympathetic activation. Three pressures: T2DM-driven atherosclerotic risk, HTN, and anaemia compensation. Improving sleep is the primary HRV intervention.',
    correlations: [
      {lbl: 'HRV \u2192 sleep quality', val: 'HRV 28ms below 40ms threshold. Each hour of sleep raises HRV by 3\u20135ms.'},
      {lbl: 'Anaemia \u2192 cardiac compensation', val: 'Hb 11.8 forces higher cardiac output \u2192 breathlessness on exertion.'},
      {lbl: 'BP \u2192 LV load', val: 'Chronic 136/86 adds 8% extra systolic pressure. Window to prevent LVH is open.'},
      {lbl: 'LDL + TG \u2192 atherogenic risk', val: 'LDL:HDL ratio 2.27 (target <2.0). Atorvastatin reducing trajectory.'},
    ],
    symptoms: ['Breathlessness on exertion', 'Palpitations on stairs', 'Occasional chest tightness on stress days', 'VO\u2082 max 28 mL/kg/min \u2014 low normal'],
    causes: ['T2DM endothelial dysfunction', 'HTN 136/86 chronic pressure overload', 'Anaemia forcing cardiac compensation', 'Sleep deprivation suppressing HRV', 'LDL 118 + TG 162 lipid burden'],
    organs: [
      {n: 'Coronary Arteries', stage: 'Atherogenic Risk', sev: 52, col: '#EF4444'},
      {n: 'Left Ventricle', stage: 'Pressure Load', sev: 40, col: '#EF4444'},
      {n: 'Autonomic NS', stage: 'HRV Suppressed', sev: 48, col: '#7C3AED'},
    ],
    cluster: {
      risk: '52%', name: 'Cardiometabolic Risk Cluster',
      diseases: [{n: 'Coronary Artery Disease', p: 50, type: 'emerging'}, {n: 'LV Hypertrophy', p: 30, type: 'watch'}, {n: 'Cardiac Autonomic Neuropathy', p: 38, type: 'watch'}],
    },
    timeline: [
      {time: 'Now', event: 'EF 62% normal. HRV 28ms low. BP 136/86. Subclinical atherogenic risk.', col: '#D97706'},
      {time: '6 months', event: 'With BP <130/80 + sleep: HRV targets 38\u201342ms.', col: '#F97316'},
      {time: '2\u20133 years', event: 'If controlled: coronary risk stabilises, LVH eliminated.', col: '#F59E0B'},
      {time: 'Without control', event: 'LVH possible by 3\u20135 years. CV event risk 2\u20133\u00D7.', col: '#9CA3AF'},
    ],
    actions: [
      {title: '7h Sleep \u2014 HRV Recovery', desc: 'Each hour raises HRV 3\u20135ms. Target: HRV 38+ ms in 8 weeks.', pri: 'high', ico: 'moon-outline'},
      {title: 'Reach BP Target <130/80', desc: 'Every 10 mmHg systolic reduction prevents LVH.', pri: 'high', ico: 'heart-outline'},
      {title: 'LDL to <100 mg/dL', desc: 'Atorvastatin on track \u2014 confirm at Sep 2026.', pri: 'medium', ico: 'medkit-outline'},
    ],
    treatment: ['Manage BP, LDL, sleep, anaemia \u2014 no cardiac-specific med needed', 'Annual ECG as part of T2DM review', 'Echo repeat if BP >135/85 persists for 12 months'],
    prevention: 'Cardiac health protected by: HbA1c <7.0%, BP <130/80, LDL <100. Sleep is the most underappreciated cardiac intervention.',
    progression: {position: 0.45, panels: [
      {lbl: 'Structural', score: 'EF 62%', bar: 92, badge: '\u2713 Normal', badgeCol: '#16A34A', detail: 'Echo EF 62% \u2014 normal. ECG NSR. No structural abnormality.'},
      {lbl: 'Autonomic (HRV)', score: '28ms', bar: 35, badge: '\u2193 Low', badgeCol: '#DC2626', detail: 'HRV 28ms vs target 40\u201355ms. Driven by poor sleep and stress.'},
      {lbl: 'Pressure load', score: '136/86', bar: 55, badge: '\u2191 Above target', badgeCol: '#D97706', detail: 'BP 136/86 vs <130/80. Olmesartan working. Activity + sodium will close gap.'},
    ]},
  },
  kidneys: {
    hdr: [{lbl:'eGFR',val:'72',unit:'mL/min',col:'#D97706'},{lbl:'Microalbumin',val:'18',unit:'mg/L',col:'#16A34A'},{lbl:'BP target',val:'136/86',unit:'vs <130/80',col:'#D97706'},{lbl:'CKD stage',val:'Stage 2',unit:'borderline',col:'#D97706'}],
    about: 'Kidneys stable but vulnerable: eGFR 72 mL/min (CKD Stage 2), microalbumin 18 mg/L (normal). Olmesartan at 96% adherence is the primary protective factor.',
    urgency: 'medium',
    narrative: 'eGFR 72 stable for 18 months. Microalbumin normal. Olmesartan is holding the line. BP and HbA1c are the two determinants of whether eGFR holds or declines.',
    correlations: [
      {lbl: 'BP \u2192 eGFR protection', val: 'Each 10 mmHg systolic reduction slows eGFR decline by ~30%.'},
      {lbl: 'HbA1c \u2192 nephropathy risk', val: 'HbA1c >7.5% for 3+ years carries significant microalbumin risk.'},
      {lbl: 'Olmesartan \u2192 glomerular pressure', val: 'Reduces intraglomerular pressure. 96% adherence = full renoprotective benefit.'},
    ],
    symptoms: ['Currently asymptomatic', 'Ankle oedema from Amlodipine (not kidney failure)', 'Fatigue has minor renal anaemia component'],
    causes: ['T2DM chronic hyperglycaemia damages glomeruli', 'HTN damages renal microvasculature', 'Age-related eGFR decline (~1 mL/min/year)'],
    organs: [
      {n: 'Glomeruli', stage: 'CKD Stage 2', sev: 42, col: '#3B82F6'},
      {n: 'Heart', stage: 'Cardiorenal Risk', sev: 38, col: '#EF4444'},
      {n: 'Bones', stage: 'CKD-Mineral Disorder', sev: 28, col: '#8B5CF6'},
    ],
    cluster: {
      risk: '40%', name: 'Cardiorenal-Metabolic Cluster',
      diseases: [{n: 'CKD Progression', p: 42, type: 'watch'}, {n: 'Diabetic Nephropathy', p: 38, type: 'watch'}, {n: 'Cardiovascular Disease', p: 50, type: 'emerging'}],
    },
    timeline: [
      {time: 'Now', event: 'eGFR 72 stable. Microalbumin 18 normal. Olmesartan protecting.', col: '#16A34A'},
      {time: '1 year', event: 'If BP <130/80 and HbA1c <7.0%: eGFR stable or improving.', col: '#F97316'},
      {time: '3\u20135 years', event: 'Without control: eGFR may decline to Stage 3 (<60).', col: '#F59E0B'},
    ],
    actions: [
      {title: 'Control BP to <130/80', desc: 'Single most effective renal protection intervention.', pri: 'high', ico: 'heart-outline'},
      {title: 'Avoid NSAIDs', desc: 'Ibuprofen reduces renal perfusion. Use paracetamol only.', pri: 'high', ico: 'close-circle-outline'},
      {title: 'Hydrate to 2.5L/day', desc: 'Chronic dehydration raises microalbumin transiently.', pri: 'medium', ico: 'water-outline'},
    ],
    treatment: ['Olmesartan 20mg OD \u2014 maintain 96% adherence', 'Target BP <130/80', 'Annual kidney panel: eGFR, microalbumin, creatinine', 'Avoid NSAIDs, contrast dyes'],
    prevention: 'CKD progression preventable with BP and HbA1c control. Microalbumin remaining normal at 5 years of T2DM is a success.',
    progression: {position: 0.55, panels: [
      {lbl: 'Filtration (eGFR)', score: '72', bar: 68, badge: '\u2194 Stable', badgeCol: '#16A34A', detail: 'eGFR 72 in CKD Stage 2 range (60\u201390). Stable 18 months.'},
      {lbl: 'Proteinuria', score: '18 mg/L', bar: 88, badge: '\u2713 Normal', badgeCol: '#16A34A', detail: 'Microalbumin 18 (target <30). Normal all readings. Olmesartan protecting.'},
      {lbl: 'BP load', score: '136/86', bar: 55, badge: '\u2191 Above', badgeCol: '#D97706', detail: 'BP 136/86 vs <130/80. Most modifiable renal risk factor.'},
    ]},
  },
  liver: {
    hdr: [{lbl:'NAFLD',val:'Grade 1',unit:'USG 2023',col:'#D97706'},{lbl:'TG',val:'162',unit:'mg/dL',col:'#D97706'},{lbl:'BMI',val:'25.0',unit:'borderline',col:'#D97706'},{lbl:'Last scan',val:'2023',unit:'3 yrs ago',col:'#DC2626'}],
    about: 'Grade 1 NAFLD confirmed USG 2023 \u2014 no follow-up scan in 3 years. Driven by excess dietary carbs converted to TG deposited as liver fat. Reversible at Grade 1.',
    urgency: 'medium',
    narrative: 'NAFLD is the hepatic manifestation of insulin resistance. 58% carbohydrate diet + TG 162 = ongoing liver fat deposition. Weight loss of 5% (3.4kg) is the evidence-based reversal threshold \u2014 Priya has lost 1.2kg already.',
    correlations: [
      {lbl: 'Carb intake \u2192 liver fat', val: 'Reducing from 58% to <50% directly reduces hepatic lipogenesis.'},
      {lbl: 'TG 162 \u2192 NAFLD signal', val: 'TG above 150 means liver is in positive fat-storage balance.'},
      {lbl: 'Weight loss \u2192 NAFLD regression', val: '5% BW loss (3.4kg from 68kg) is the threshold. 1.2kg done, 2.2kg to go.'},
    ],
    symptoms: ['Usually asymptomatic at Grade 1', 'Fatigue from metabolic inefficiency'],
    causes: ['High-carb diet (58%) driving de novo lipogenesis', 'Insulin resistance routing glucose to hepatic fat', 'Adiposity (BMI 25, waist 86 cm)'],
    organs: [
      {n: 'Liver cells', stage: 'Grade 1 Steatosis', sev: 45, col: '#06B6D4'},
      {n: 'Pancreas', stage: 'Insulin Resistance', sev: 55, col: '#F59E0B'},
      {n: 'Heart', stage: 'NAFLD-CV Link', sev: 38, col: '#EF4444'},
    ],
    cluster: {
      risk: '55%', name: 'Metabolic Liver Cluster',
      diseases: [{n: 'NAFLD \u2192 NASH', p: 25, type: 'watch'}, {n: 'T2DM Worsening', p: 55, type: 'active'}, {n: 'Dyslipidaemia', p: 65, type: 'active'}],
    },
    timeline: [
      {time: 'Now', event: 'Grade 1 NAFLD. No LFT recently. No follow-up USG for 3 years.', col: '#D97706'},
      {time: '6 months', event: 'With 5% weight loss + carb reduction: hepatic fat reduces. Repeat USG.', col: '#F97316'},
      {time: 'Without change', event: 'Grade 1 \u2192 Grade 2 in 2\u20133 years. Fibrosis risk begins.', col: '#9CA3AF'},
    ],
    actions: [
      {title: 'Lose 3.4kg (5% of BW)', desc: 'Evidence-based NAFLD reversal. 1.2kg done, 2.2kg to go.', pri: 'high', ico: 'fitness-outline'},
      {title: 'Reduce Carbs to <50%', desc: 'Most direct lever for hepatic de novo lipogenesis.', pri: 'high', ico: 'restaurant-outline'},
      {title: 'Annual LFT (AST/ALT)', desc: 'Not in recent panel. Grade 1 may be progressing silently.', pri: 'medium', ico: 'flask-outline'},
    ],
    treatment: ['No medication for NAFLD Grade 1 \u2014 lifestyle is the treatment', 'Weight loss target: 3.4kg (5% BW)', 'Dietary carb reduction to <50%', 'Repeat liver USG by Oct 2026'],
    prevention: 'Grade 1 NAFLD is one of the most reversible conditions. Same interventions that improve T2DM directly reverse NAFLD.',
    progression: {position: 0.50, panels: [
      {lbl: 'Steatosis grade', score: 'Grade 1', bar: 50, badge: '\u2194 Stable', badgeCol: '#D97706', detail: 'Grade 1 (5\u201310% hepatocyte fat). Diagnosed 2023, no follow-up. Reversible.'},
      {lbl: 'TG trend', score: '162', bar: 42, badge: '\u2194 Flat', badgeCol: '#D97706', detail: 'TG 162 (target <150). Flat 18 months. Reducing carbs will reduce TG and liver fat.'},
      {lbl: 'Weight loss', score: '\u22121.2kg', bar: 35, badge: '\u2191 Progress', badgeCol: '#16A34A', detail: '\u22121.2kg since Jan 2026. Target 3.4kg total for NAFLD reversal. 35% there.'},
    ]},
  },
  eyes: {
    hdr: [{lbl:'Fundus',val:'None',unit:'overdue 5yr',col:'#DC2626'},{lbl:'HbA1c yrs',val:'3+',unit:'years >7.5%',col:'#DC2626'},{lbl:'Risk',val:'20-30%',unit:'estimated',col:'#DC2626'},{lbl:'Priority',val:'URGENT',unit:'book now',col:'#DC2626'}],
    about: 'No dilated fundus exam on record. HbA1c >7.5% for 3+ years. This is the highest-priority unaddressed screening gap. Early retinopathy is treatable; advanced is not.',
    urgency: 'high',
    narrative: 'With HbA1c above 7.5% for 3+ years and zero fundus exams, Priya is in the window where early diabetic retinopathy develops silently. 5 years post-diagnosis with zero eye screenings. Estimated 20\u201330% probability of background retinopathy already present.',
    correlations: [
      {lbl: 'HbA1c duration \u2192 retinopathy', val: 'HbA1c >7.5% for 3+ years carries significantly elevated risk of background retinopathy.'},
      {lbl: 'HTN \u2192 retinopathy', val: 'BP 136/86 causes independent hypertensive retinal changes. T2DM + HTN = additive damage.'},
      {lbl: 'Zero exams in 5 years', val: '5 exams overdue. Standard: annual from diagnosis. Retinopathy at early stage is treatable.'},
    ],
    symptoms: ['Asymptomatic until late', 'Blurred vision on high-glucose days (may have retinal component)', 'Floaters or dark spots (advanced \u2014 not reported)'],
    causes: ['T2DM 5 years damaging retinal microvasculature', 'HbA1c >7.5% for 3+ years', 'HTN 136/86 additive retinal damage', 'No fundus exam for early detection'],
    organs: [
      {n: 'Retina', stage: 'High-Risk Unscreened', sev: 60, col: '#8B5CF6'},
      {n: 'Optic nerve', stage: 'T2DM risk', sev: 30, col: '#8B5CF6'},
      {n: 'Lens', stage: 'Cataract risk', sev: 28, col: '#D97706'},
    ],
    cluster: {
      risk: '65%', name: 'Diabetic Microvascular Eye Cluster',
      diseases: [{n: 'Diabetic Retinopathy', p: 45, type: 'emerging'}, {n: 'Diabetic Maculopathy', p: 25, type: 'watch'}, {n: 'Hypertensive Retinopathy', p: 35, type: 'watch'}],
    },
    timeline: [
      {time: 'Now', event: 'Zero fundus exams. 5 yrs T2DM. 20\u201330% retinopathy probability.', col: '#EF4444'},
      {time: '2 weeks', event: 'Book dilated fundus exam immediately.', col: '#F97316'},
      {time: '3 months', event: 'If found: laser + HbA1c control prevents progression.', col: '#F59E0B'},
      {time: 'Without exam', event: 'Proliferative retinopathy risk by 2028. Irreversible vision loss.', col: '#9CA3AF'},
    ],
    actions: [
      {title: 'Book Fundus Exam \u2014 This Week', desc: 'Most urgent action. AIIMS or LV Prasad Eye Institute.', pri: 'high', ico: 'eye-outline'},
      {title: 'Control HbA1c to <7.0%', desc: 'Every 1% reduction reduces retinopathy progression by 39%.', pri: 'high', ico: 'analytics-outline'},
      {title: 'Annual Dilated Exam Going Forward', desc: 'Once baseline established, annual screening is standard.', pri: 'medium', ico: 'calendar-outline'},
    ],
    treatment: ['URGENT: Dilated fundus exam \u2014 book within 2 weeks', 'Annual dilated exam from this point', 'If retinopathy: HbA1c <7.0% + BP <130/80 + 6-monthly ophthalmology', 'If maculopathy: anti-VEGF injections'],
    prevention: 'Annual dilated fundus exam is the only method to detect retinopathy before symptoms. Window for reversible treatment is background and pre-proliferative stages.',
    progression: {position: 0.80, panels: [
      {lbl: 'Screening status', score: '0 exams', bar: 0, badge: '\u26A0 Overdue', badgeCol: '#DC2626', detail: 'Zero fundus exams in 5 years of T2DM. Highest-priority screening gap.'},
      {lbl: 'Glycaemic risk', score: '3+ yrs', bar: 72, badge: '\u2191 High', badgeCol: '#DC2626', detail: 'HbA1c >7.5% for 3+ years. Progressive retinal microangiopathy.'},
      {lbl: 'BP risk', score: '136/86', bar: 55, badge: 'Additive', badgeCol: '#D97706', detail: 'HTN adds independent hypertensive retinal changes on top of T2DM.'},
    ]},
  },
  feet: {
    hdr: [{lbl:'Tingling',val:'5\u00D7',unit:'this month',col:'#DC2626'},{lbl:'Monofilament',val:'Pending',unit:'not done',col:'#DC2626'},{lbl:'B12',val:'312',unit:'pg/mL',col:'#D97706'},{lbl:'Physio',val:'3 done',unit:'active',col:'#16A34A'}],
    about: 'Bilateral foot tingling 5\u00D7 this month. Early peripheral neuropathy from T2DM glycation + Metformin-induced B12 depletion. Monofilament test not yet done.',
    urgency: 'high',
    narrative: 'Foot tingling 5 episodes bilateral is a red flag. Three simultaneous neuropathy risk factors: T2DM glycation, B12 demyelination from Metformin, and deconditioning. Monofilament test is the standard screening \u2014 not yet done.',
    correlations: [
      {lbl: 'HbA1c \u2192 glycation', val: 'HbA1c >7.5% for 3+ years causes progressive myelin glycation.'},
      {lbl: 'B12 decline \u2192 demyelination', val: 'B12 312 pg/mL declining. Two simultaneous demyelination pathways compound tingling.'},
      {lbl: 'Methylcobalamin \u2192 recovery', val: 'Started 5 Mar at 84% adherence. At 84%, improvement takes 3\u20134 months instead of 6\u20138 weeks.'},
    ],
    symptoms: ['Bilateral foot tingling 5\u00D7/month', 'Worse at night', 'Knee pain 4\u00D7/month', 'Possible reduced sensation (monofilament needed)'],
    causes: ['T2DM glycation of myelin sheaths', 'Metformin-induced B12 malabsorption', 'Deconditioning reducing peripheral perfusion', 'No monofilament test done'],
    organs: [
      {n: 'Peripheral nerves', stage: 'Early Demyelination', sev: 52, col: '#F59E0B'},
      {n: 'Feet vasculature', stage: 'Perfusion Risk', sev: 40, col: '#EF4444'},
    ],
    cluster: {
      risk: '55%', name: 'Diabetic Neuropathy Cluster',
      diseases: [{n: 'Peripheral Neuropathy', p: 52, type: 'active'}, {n: 'Diabetic Foot Ulcer', p: 15, type: 'watch'}, {n: 'B12 Deficiency Neuropathy', p: 45, type: 'emerging'}],
    },
    timeline: [
      {time: 'Now', event: '5 tingling episodes/month. B12 declining. Methylcobalamin started.', col: '#EF4444'},
      {time: '6\u20138 weeks', event: 'B12-pathway tingling may reduce 30\u201350%.', col: '#F97316'},
      {time: '12 months', event: 'If HbA1c <7.0%: glycation slows. Tingling frequency declines.', col: '#F59E0B'},
      {time: 'Without control', event: 'Loss of protective sensation \u2192 foot ulcer risk.', col: '#9CA3AF'},
    ],
    actions: [
      {title: 'Monofilament Test \u2014 Next Visit', desc: '10g test takes 3 minutes and quantifies sensory loss.', pri: 'high', ico: 'footsteps-outline'},
      {title: 'Continue Methylcobalamin 500mcg', desc: 'B12-pathway is the treatable component. Reach 95% adherence.', pri: 'high', ico: 'medkit-outline'},
      {title: 'Daily Foot Inspection', desc: 'Check both feet for cuts, blisters, redness. 30 seconds daily.', pri: 'medium', ico: 'search-outline'},
    ],
    treatment: ['Methylcobalamin 500mcg OD \u2014 increase to >95%', 'Monofilament test at next GP visit', 'Physiotherapy: continue remaining 3 sessions', 'HbA1c control: primary neuropathy treatment'],
    prevention: 'Maintain HbA1c <7.0%, supplement B12 while on Metformin, annual monofilament screening.',
    progression: {position: 0.72, panels: [
      {lbl: 'Neuropathy symptoms', score: '5\u00D7/mo', bar: 75, badge: '\u2191 Worsening', badgeCol: '#DC2626', detail: 'Bilateral tingling 5\u00D7/month. Monofilament baseline not done.'},
      {lbl: 'B12 (driver)', score: '312', bar: 32, badge: '\u2193 Declining', badgeCol: '#DC2626', detail: 'B12 312 declining. Methylcobalamin 500mcg started 5 Mar.'},
      {lbl: 'Glycaemic (driver)', score: '7.8%', bar: 40, badge: '\u2191 Above', badgeCol: '#DC2626', detail: 'HbA1c 7.8% is the primary neuropathy driver.'},
    ]},
  },
  nerves: {
    hdr: [{lbl:'PHQ-9',val:'8',unit:'mild depr.',col:'#D97706'},{lbl:'GAD-7',val:'6',unit:'mild anxiety',col:'#D97706'},{lbl:'B12',val:'312',unit:'pg/mL',col:'#D97706'},{lbl:'Vit D',val:'18',unit:'ng/mL',col:'#DC2626'}],
    about: 'Peripheral (foot tingling) and central (PHQ-9: 8, GAD-7: 6) nervous system affected. B12 deficiency, Vit D deficiency, poor sleep, and chronic hyperglycaemia are the drivers.',
    urgency: 'medium',
    narrative: 'Nervous system affected at two levels: peripheral (neuropathy) and central (mild depression + anxiety). Not just stress \u2014 measurable biochemical drivers: B12, Vit D, poor sleep, hyperglycaemia.',
    correlations: [
      {lbl: 'B12 \u2192 peripheral neuropathy', val: 'B12 312 declining. Foot tingling 5\u00D7/month is the manifestation.'},
      {lbl: 'Vit D \u2192 serotonin', val: 'VDR in hippocampus regulates serotonin. Vit D 18 impairs mood regulation.'},
      {lbl: 'Sleep \u2192 neural restoration', val: 'Deep sleep 18% (target >20%). 7h sleep is neural medicine.'},
    ],
    symptoms: ['Foot tingling 5\u00D7/month', 'Mood score 6.4/10, PHQ-9: 8', 'GAD-7: 6 (mild anxiety)', 'Brain fog, difficulty concentrating', 'Fatigue (multi-factorial)'],
    causes: ['T2DM glycation of peripheral nerves', 'Metformin-induced B12 decline', 'Vit D deficiency (18 ng/mL)', 'Poor sleep (5.9h)', 'Chronic stress'],
    organs: [
      {n: 'Peripheral nerves', stage: 'Early Neuropathy', sev: 52, col: '#F59E0B'},
      {n: 'Brain', stage: 'Multi-factor stress', sev: 50, col: '#7C3AED'},
    ],
    cluster: {
      risk: '48%', name: 'Neurological-Metabolic Cluster',
      diseases: [{n: 'Peripheral Neuropathy', p: 52, type: 'active'}, {n: 'Mild Depression', p: 48, type: 'active'}, {n: 'Mild Anxiety', p: 45, type: 'active'}],
    },
    timeline: [
      {time: 'Now', event: 'PHQ-9 8, GAD-7 6. Foot tingling 5\u00D7/month. Three modifiable drivers.', col: '#D97706'},
      {time: '3 months', event: 'With B12 + Vit D + 7h sleep: PHQ-9 expected 5\u20136.', col: '#F97316'},
      {time: 'Without treatment', event: 'PHQ-9 may reach 10+ (moderate depression). Neuropathy irreversible.', col: '#9CA3AF'},
    ],
    actions: [
      {title: 'Sleep 7 Hours \u2014 Neural Medicine', desc: 'Deep sleep restores hippocampal BDNF. Most impactful.', pri: 'high', ico: 'moon-outline'},
      {title: 'Continue Methylcobalamin + Vit D', desc: 'Treating the two biochemical drivers of mood and neuropathy.', pri: 'high', ico: 'medkit-outline'},
      {title: '15-min Daily Walk \u2014 BDNF', desc: '150 min/week raises BDNF by 30% \u2014 equivalent to mild antidepressants.', pri: 'medium', ico: 'walk-outline'},
    ],
    treatment: ['Methylcobalamin 500mcg OD \u2014 >95% adherence', 'Vit D 60,000 IU weekly \u2014 continue 12 weeks', 'PHQ-9 + GAD-7 reassessment at Jun 2026', 'If PHQ-9 >10: CBT referral'],
    prevention: 'Neural health = metabolic health: sleep, glucose control, micronutrient sufficiency, physical activity.',
    progression: {position: 0.60, panels: [
      {lbl: 'Mood (PHQ-9)', score: '8/27', bar: 62, badge: 'Mild depr.', badgeCol: '#D97706', detail: 'PHQ-9: 8. Three drivers: B12, Vit D, poor sleep. All being treated.'},
      {lbl: 'Anxiety (GAD-7)', score: '6/21', bar: 57, badge: 'Mild anxiety', badgeCol: '#D97706', detail: 'GAD-7: 6. Primary themes: blood sugar, work-health balance.'},
      {lbl: 'Neuropathy', score: '5\u00D7/mo', bar: 75, badge: '\u2191 Worsening', badgeCol: '#DC2626', detail: 'Two drivers: T2DM glycation + B12 demyelination.'},
    ]},
  },
  dental: {
    hdr: [{lbl:'Last check',val:'None',unit:'on record',col:'#DC2626'},{lbl:'T2DM risk',val:'2-3\u00D7',unit:'periodontal',col:'#D97706'},{lbl:'HbA1c link',val:'+0.3%',unit:'if active PD',col:'#D97706'},{lbl:'Overdue',val:'5 yrs',unit:'of checks',col:'#DC2626'}],
    about: 'No dental check on record. T2DM raises periodontal disease risk 2\u20133\u00D7. Active periodontitis raises systemic inflammation which worsens HbA1c by 0.3\u20130.4%.',
    urgency: 'low',
    narrative: 'Dental health is a documented T2DM complication vector. T2DM raises periodontal risk 2\u20133\u00D7. Conversely, active periodontal disease raises HbA1c by 0.3\u20130.4% via systemic inflammation.',
    correlations: [
      {lbl: 'T2DM \u2192 periodontal risk', val: '2\u20133\u00D7 higher periodontal disease due to impaired neutrophil function.'},
      {lbl: 'Periodontal \u2192 HbA1c', val: 'Treatment reduces HbA1c by 0.3\u20130.4% via reduced systemic inflammation.'},
      {lbl: 'Dehydration \u2192 xerostomia', val: '1.4L/day reduces saliva, accelerating cavity and gum disease.'},
    ],
    symptoms: ['Bleeding gums possible', 'Dry mouth from hyperglycaemia', 'Sensitivity to hot/cold'],
    causes: ['T2DM impairs neutrophil function', 'Hyperglycaemia raises oral glucose', 'Dehydration reduces saliva flow'],
    organs: [
      {n: 'Gums', stage: 'Risk \u2014 unscreened', sev: 35, col: '#6B7280'},
      {n: 'Teeth', stage: 'Caries risk elevated', sev: 25, col: '#D97706'},
    ],
    cluster: {
      risk: '28%', name: 'Oral-Metabolic Cluster',
      diseases: [{n: 'Periodontal Disease', p: 35, type: 'watch'}, {n: 'Dental Caries', p: 28, type: 'watch'}],
    },
    timeline: [
      {time: 'Now', event: 'No dental check on record. 5 years T2DM.', col: '#D97706'},
      {time: 'Next month', event: 'Dental check + clean. If PD found: treatment reduces HbA1c 0.3\u20130.4%.', col: '#F97316'},
      {time: '6-monthly', event: 'Regular checks become standard for T2DM.', col: '#F59E0B'},
    ],
    actions: [
      {title: 'Book Dental Appointment', desc: 'Any dentist. Mention T2DM. Ask for periodontal assessment.', pri: 'medium', ico: 'happy-outline'},
      {title: 'Hydration to 2.5L/day', desc: 'More saliva = better bacterial clearance.', pri: 'medium', ico: 'water-outline'},
    ],
    treatment: ['Dental check + clean within 4 weeks', 'Periodontal assessment given T2DM', '6-monthly dental review going forward'],
    prevention: 'Twice-daily brushing, daily flossing, 2.5L hydration, 6-monthly professional checks.',
    progression: {position: 0.40, panels: [
      {lbl: 'Screening gap', score: '5 years', bar: 85, badge: '\u26A0 Overdue', badgeCol: '#DC2626', detail: 'No dental check on record. 5 years T2DM at 2\u20133\u00D7 periodontal risk.'},
      {lbl: 'Salivary protection', score: '1.4L', bar: 22, badge: '\u2193 Low', badgeCol: '#D97706', detail: 'Hydration 1.4L/day (target 2.5L). Chronic xerostomia.'},
      {lbl: 'Systemic impact', score: '\u00B10.3%', bar: 30, badge: 'HbA1c link', badgeCol: '#D97706', detail: 'If active PD present, systemic inflammation raises HbA1c by 0.3\u20130.4%.'},
    ]},
  },
};

// ─── EXPORTS ─────────────────────────────────────────────────
module.exports = {
  SCORE_STRIP,
  MAIN_TABS,
  OVERVIEW_DATA,
  BIOMARKERS,
  LIFESTYLE_SECTIONS,
  LIFESTYLE_DETAIL_DATA,
  MEDICAL_CONDITIONS,
  MEDICAL_DETAIL_DATA,
  ORGANS,
  SYMPTOMS_SECTIONS,
};
