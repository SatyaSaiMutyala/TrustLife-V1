const CYCLES = [
  {id: 1, start: '07 Jan 2026', cycleLen: 27, periodLen: 5, label: 'Jan'},
  {id: 2, start: '03 Feb 2026', cycleLen: 28, periodLen: 4, label: 'Feb'},
  {id: 3, start: '03 Mar 2026', cycleLen: 28, periodLen: 5, label: 'Mar'},
];

const CURRENT_CYCLE_DAY = 24;

const PHASE_DATES = {
  nextPeriod: {date: 'Apr 3', daysAway: 10},
  ovulation: {date: 'Mar 20', daysAgo: 4},
  fertileWindow: {start: 'Mar 17', end: 'Mar 22', status: 'Ended Mar 22'},
};

const CYCLE_STATS = {
  currentDay: 24,
  cycleLength: 28,
  periodAvg: '5d',
  avgLength: '28d',
  trackedCycles: 9,
  trackingSince: 'Jan 2024',
  stdDev: 0.9,
  range: '27-29',
};

const PHYSICAL_SYMPTOMS = [
  {id: 'cramps', ico: '\uD83E\uDD1C', name: 'Cramps'},
  {id: 'bloating', ico: '\uD83C\uDF2C\uFE0F', name: 'Bloating'},
  {id: 'fatigue', ico: '\uD83D\uDE34', name: 'Fatigue'},
  {id: 'headache', ico: '\uD83C\uDFAF', name: 'Headache'},
  {id: 'breast', ico: '\uD83E\uDEAB', name: 'Breast tender'},
  {id: 'nausea', ico: '\uD83E\uDD22', name: 'Nausea'},
  {id: 'backpain', ico: '\uD83E\uDDB4', name: 'Back pain'},
  {id: 'acne', ico: '\uD83E\uDDF4', name: 'Acne / oily skin'},
  {id: 'sleep', ico: '\uD83E\uDD24', name: 'Poor sleep'},
  {id: 'cravings', ico: '\uD83E\uDEAB', name: 'Food cravings'},
  {id: 'hotflash', ico: '\uD83E\uDD75', name: 'Hot flashes'},
  {id: 'dizzy', ico: '\uD83D\uDE35', name: 'Dizziness'},
];

const PAIN_LOCATIONS = [
  {id: 'abdomen', ico: '\uD83E\uDEAB', name: 'Lower abdomen'},
  {id: 'back', ico: '\uD83D\uDC86', name: 'Lower back'},
  {id: 'legs', ico: '\uD83E\uDDB5', name: 'Thighs / legs'},
  {id: 'head', ico: '\uD83D\uDDE3\uFE0F', name: 'Head / migraine'},
  {id: 'chest', ico: '\uD83E\uDEAB', name: 'Chest / breast'},
  {id: 'none', ico: '\u2705', name: 'No pain'},
];

const MOOD_EMOJIS = ['\uD83D\uDE2D', '\uD83D\uDE1E', '\uD83D\uDE10', '\uD83D\uDE42', '\uD83D\uDE04'];

const MOOD_TAGS = [
  {id: 'irritable', label: '\uD83E\uDD2C Irritable'},
  {id: 'tearful', label: '\uD83D\uDE22 Tearful'},
  {id: 'anxious', label: '\uD83D\uDE30 Anxious'},
  {id: 'unmotivated', label: '\uD83E\uDD71 Unmotivated'},
  {id: 'calm', label: '\uD83D\uDE0C Calm'},
  {id: 'energetic', label: '\uD83D\uDCAA Energetic'},
  {id: 'grateful', label: '\uD83E\uDD1D Grateful'},
];

const CONTEXT_TAGS = [
  {id: 'workstress', label: '\uD83D\uDCBC Work stress'},
  {id: 'healthanx', label: '\uD83E\uDDD1\u200D\u2695\uFE0F Health anxiety'},
  {id: 'poorsleep', label: '\uD83D\uDE34 Poor sleep last night'},
  {id: 'bsoff', label: '\uD83E\uDE78 Blood sugar off'},
  {id: 'medeffect', label: '\uD83D\uDC8A Medication effect'},
  {id: 'skipex', label: '\uD83C\uDFC3 Skipped exercise'},
  {id: 'feelwell', label: '\uD83C\uDF1F Feeling well today'},
  {id: 'tests', label: '\uD83E\uDDEC Upcoming tests'},
  {id: 'cyclemood', label: '\uD83C\uDF38 Cycle-related mood'},
];

const SKIN_HAIR_TAGS = [
  {id: 'oily', label: '\uD83E\uDDF4 Oily skin'},
  {id: 'acneface', label: '\uD83E\uDD2C Acne (face/back)'},
  {id: 'facialhair', label: '\uD83D\uDC68 Increased facial hair'},
  {id: 'thinning', label: '\uD83D\uDC7C Thinning scalp hair'},
  {id: 'weightgain', label: '\u2696\uFE0F Weight gain this cycle'},
  {id: 'nosigns', label: '\u2705 No unusual signs'},
];

const PERIOD_STATUS_OPTIONS = [
  {id: 'started', label: '\uD83D\uDD34 Period started today'},
  {id: 'spotting', label: '\uD83E\uDEE7 Spotting only'},
  {id: 'noperiod', label: '\u274C No period today'},
  {id: 'ended', label: '\uD83C\uDFC1 Period ended today'},
];

const FLOW_OPTIONS = ['Spotting', 'Light', 'Moderate', 'Heavy', 'Very heavy'];
const CRAMP_OPTIONS = ['0 None', '1 Mild', '2 Moderate', '3 Severe', '4 Debilitating'];
const CM_OPTIONS = ['Dry', 'Sticky', 'Creamy', 'Egg-white', 'Watery'];
const SEX_OPTIONS = [
  {id: 'protected', label: '\u2705 Protected'},
  {id: 'unprotected', label: '\u26A0\uFE0F Unprotected'},
  {id: 'none', label: '\u274C No activity'},
  {id: 'private', label: '\uD83D\uDD12 Private'},
];
const CONTRA_OPTIONS = [
  {id: 'none', label: '\u274C None'},
  {id: 'ocp', label: '\uD83D\uDC8A OCP'},
  {id: 'iud', label: '\uD83D\uDD35 IUD'},
  {id: 'inject', label: '\uD83D\uDC89 Injectable'},
  {id: 'natural', label: '\uD83C\uDF3F Natural'},
];

const PCOS_QUESTIONS = [
  {id: 'irreg', q: 'Are your cycles irregular (shorter than 21 days or longer than 35 days)?'},
  {id: 'hirsutism', q: 'Do you experience increased facial or body hair growth (hirsutism)?'},
  {id: 'alopecia', q: 'Scalp hair thinning or hair loss (androgenic alopecia)?'},
  {id: 'acne', q: 'Persistent acne on face, chest, or back (especially adult-onset)?'},
  {id: 'oily', q: 'Oily skin significantly worse than peers or during certain cycle phases?'},
  {id: 'weight', q: 'Difficulty losing weight despite diet and exercise changes?'},
  {id: 'ovulation', q: 'Do you ovulate irregularly or have you ever been told ovulation may be absent?'},
  {id: 'cysts', q: 'Has an ultrasound ever shown multiple small cysts on the ovaries?'},
  {id: 'acanthosis', q: 'Dark patches of skin (acanthosis nigricans) on neck, armpits, or groin?'},
];

const PCOS_T2DM_CONNECTIONS = [
  {ico: '\uD83D\uDD17', title: 'Insulin resistance is the shared root', body: 'Both PCOS and T2DM are driven by insulin resistance. Hyperinsulinemia from T2DM stimulates ovarian androgen production. Metformin treats both conditions simultaneously.'},
  {ico: '\uD83D\uDC8A', title: 'Metformin dual benefit', body: 'Metformin 500mg BD reduces hepatic glucose output (T2DM) AND reduces androgen levels (PCOS protective). It also improves menstrual regularity. Your regular cycles (27-29 days) suggest Metformin may be providing ovarian benefit.'},
  {ico: '\uD83D\uDCC5', title: 'Recommended screening at Apr 4 visit', body: 'Ask Dr. Kavitha for: Free androgen index (FAI), DHEAS, LH/FSH ratio. Pelvic ultrasound if any androgen signs develop. AMH to assess ovarian reserve.'},
];

const HORMONAL_TESTS = [
  {name: 'TSH', purpose: 'Thyroid', lastDone: 'Mar 2026', status: 'done'},
  {name: 'LH / FSH', purpose: 'Ovarian function', lastDone: 'Never', status: 'consider'},
  {name: 'Free testosterone', purpose: 'Androgens / PCOS', lastDone: 'Never', status: 'consider'},
  {name: 'Prolactin', purpose: 'Hyperprolactinaemia', lastDone: 'Never', status: 'optional'},
  {name: 'AMH', purpose: 'Ovarian reserve', lastDone: 'Never', status: 'optional'},
  {name: 'Pelvic USG', purpose: 'Ovarian morphology', lastDone: 'Never', status: 'consider'},
];

const CYCLE_HISTORY = [
  {month: 'February 2026', badge: '28d', cycleNum: 2, dateRange: 'Feb 3 - Mar 2, 2026', duration: '28-day cycle', periodDays: '4 days', flow: 'Moderate', status: 'Regular', statusColor: 'green', tags: ['\uD83D\uDD34 Feb 3-6', '\uD83E\uDD5A Feb 16', '\uD83D\uDD25 Feb 13-18', '\uD83E\uDD1C Migraine Feb 22', '\uD83E\uDD2C PMS Feb 25-28']},
  {month: 'January 2026', badge: '27d', cycleNum: 1, dateRange: 'Jan 7 - Feb 2, 2026', duration: '27-day cycle', periodDays: '5 days', flow: 'Moderate', status: 'Slightly short', statusColor: 'green', tags: ['\uD83D\uDD34 Jan 7-11', '\uD83E\uDD5A Jan 20', '\uD83D\uDD25 Jan 17-22', '\uD83D\uDE34 Fatigue Jan 25-27']},
  {month: 'December 2025', badge: '29d', cycleNum: 12, dateRange: 'Dec 9 - Jan 6, 2026', duration: '29-day cycle', periodDays: '6 days', flow: 'Heavy first 2 days', status: 'Slightly long', statusColor: 'amber', tags: ['\uD83D\uDD34 Dec 9-14', '\uD83E\uDD5A Dec 23', '\uD83D\uDD25 Dec 20-25', '\uD83E\uDD1C Cramps Dec 9-10']},
  {month: 'November 2025', badge: '28d', cycleNum: 11, dateRange: 'Nov 11 - Dec 8, 2025', duration: '28-day cycle', periodDays: '5 days', flow: 'Moderate', status: 'Regular', statusColor: 'green', tags: ['\uD83D\uDD34 Nov 11-15', '\uD83E\uDD5A Nov 25', '\uD83D\uDD25 Nov 22-27', '\uD83E\uDD1C Migraine Nov 8']},
];

const PHASE_INSIGHTS = {
  wheel: [
    {type: 'purple', ico: '\uD83E\uDDE0', text: 'Day 24. Late luteal. Progesterone declining. PMS window. Mood dips, bloating, breast tenderness, food cravings common. Glucose may rise 0.5-0.8 mmol/L from progesterone-driven insulin resistance. Migraine risk highest days 25-28 (estrogen withdrawal).'},
    {type: 'amber', ico: '\uD83E\uDDEC', text: 'Progesterone & insulin resistance: Luteal phase progesterone causes mild insulin resistance. If Metformin readings are elevated this week, the hormonal contribution is real. No medication change needed. Eating lower-GI and maintaining post-dinner walks helps counteract this effect.'},
    {type: 'red', ico: '\uD83E\uDD1C', text: 'Perimenstrual migraine pattern detected. Migraine logged in 3 of 4 previous cycles on days 25-28 (estrogen withdrawal window). Today is Day 24. Consider informing Dr. Kavitha at Apr 4 about preventive options (frovatriptan short-course, transdermal estrogen patch).'},
  ],
  log: {type: 'purple', ico: '\uD83D\uDCC5', text: 'Late luteal phase. Days 20-28. Progesterone falling. Period expected Apr 3 (10 days). Common: PMS, mood changes, bloating, breast tenderness, food cravings, fatigue.'},
  medInteraction: {type: 'amber', ico: '\uD83D\uDC8A', text: 'Medications & this cycle phase: Progesterone in days 20-28 mildly reduces Metformin\'s effectiveness. Check fasting glucose this week. Amlodipine may feel less effective. BP slightly higher than usual is expected. Methylcobalamin (B12) supports nerve function; fatigue in PMS is partly B12-mediated.'},
};

const WHEEL_LEGEND = [
  {label: 'Period', color: '#E24B4A'},
  {label: 'Follicular', color: '#f9a825'},
  {label: 'Fertile', color: '#1D9E75'},
  {label: 'Ovulation', color: '#00c853'},
  {label: 'Luteal', color: '#7b2fbe'},
];

const LOG_TYPE_OPTIONS = [
  {id: 'daily', label: 'Daily check-in'},
  {id: 'periodstart', label: 'Period started'},
  {id: 'periodend', label: 'Period ended'},
  {id: 'ovday', label: 'Ovulation day'},
  {id: 'spotting', label: 'Spotting / irregular'},
  {id: 'medlog', label: 'Medication log'},
  {id: 'clinic', label: 'After clinic visit'},
];

const FLOW_LEVELS = [
  {id: 0, label: 'None /\nSpotting', w: 10, h: 10, opacity: 0.3},
  {id: 1, label: 'Light', w: 16, h: 18, opacity: 0.5},
  {id: 2, label: 'Moderate', w: 22, h: 26, opacity: 0.7},
  {id: 3, label: 'Heavy', w: 28, h: 34, opacity: 0.9},
  {id: 4, label: 'Very\nheavy', w: 32, h: 40, opacity: 1},
];

const FLOW_COLORS = [
  {id: 'bright', label: 'Bright red', color: '#ff1a1a'},
  {id: 'dark', label: 'Dark red', color: '#8B0000'},
  {id: 'brown', label: 'Brown', color: '#4a2c00'},
  {id: 'pink', label: 'Pink', color: '#ff69b4'},
  {id: 'black', label: 'Black/very dark', color: '#555'},
  {id: 'watery', label: 'Light pink / watery', color: '#f0a0b0'},
];

const SYMPTOM_SCALES = [
  {id: 'cramps', ico: '\uD83E\uDEAB', name: 'Cramps / dysmenorrhoea', sub: 'Lower abdominal / pelvic pain'},
  {id: 'bloat', ico: '\uD83C\uDF2C\uFE0F', name: 'Bloating', sub: 'Abdominal distension / gas'},
  {id: 'breast', ico: '\uD83E\uDEAB', name: 'Breast tenderness', sub: 'Swelling / soreness'},
  {id: 'pelvic', ico: '\uD83C\uDF21\uFE0F', name: 'Pelvic / ovarian pain', sub: 'Mittelschmerz or endo pain'},
  {id: 'head', ico: '\uD83E\uDD15', name: 'Headache / migraine', sub: 'Hormone-related headache'},
  {id: 'back', ico: '\uD83D\uDDE3\uFE0F', name: 'Back pain', sub: 'Lower back / sacral pain'},
  {id: 'nausea', ico: '\uD83E\uDD22', name: 'Nausea', sub: 'Stomach upset / queasiness'},
  {id: 'fatigue', ico: '\uD83E\uDD24', name: 'Fatigue', sub: 'Energy level / tiredness'},
  {id: 'flush', ico: '\u26A1', name: 'Hot flushes / sweating', sub: 'Vasomotor symptoms'},
  {id: 'acne', ico: '\uD83E\uDDF4', name: 'Acne / skin changes', sub: 'Hormonal acne. PCOS marker'},
  {id: 'hair', ico: '\uD83D\uDC87', name: 'Hair changes', sub: 'Excessive hair loss / facial hair. PCOS markers'},
];

const SYMPTOM_DEFAULTS = {cramps: 0, bloat: 1, breast: 1, pelvic: 0, head: 0, back: 0, nausea: 0, fatigue: 1, flush: 0, acne: 1, hair: 1};

const MOOD_SCALES = [
  {id: 'energy', ico: '\u26A1', name: 'Energy level', options: ['Low', 'Mid', 'Good', 'High']},
  {id: 'anxiety', ico: '\uD83D\uDE30', name: 'Anxiety / irritability'},
  {id: 'lowmood', ico: '\uD83D\uDE22', name: 'Low mood / tearfulness', sub: 'PMDD screening. Flag if severe'},
  {id: 'libido', ico: '\uD83D\uDC95', name: 'Libido', options: ['Low', 'Mid', 'High']},
];

const PMS_TAGS = [
  '\uD83E\uDD2C Irritability', '\uD83D\uDE22 Sadness / crying', '\uD83D\uDCA2 Rage / anger',
  '\uD83D\uDE30 Anxiety spikes', '\uD83E\uDEAB Food cravings', '\uD83D\uDE34 Fatigue / hypersomnia',
  '\uD83D\uDCA7 Fluid retention', '\uD83E\uDDE0 Brain fog', '\uD83E\uDDEC Tension / on edge',
  '\uD83D\uDE35 Social withdrawal', '\uD83D\uDE1E Feeling overwhelmed',
];

const CM_DETAILED = [
  {id: 'dry', ico: '\uD83D\uDFE1', name: 'Dry', sub: 'No mucus. Infertile'},
  {id: 'sticky', ico: '\uD83D\uDFE0', name: 'Sticky', sub: 'Thick, clumpy. Low fertility'},
  {id: 'creamy', ico: '\uD83D\uDCFA', name: 'Creamy', sub: 'White/yellow, lotion-like'},
  {id: 'watery', ico: '\uD83D\uDCA7', name: 'Watery', sub: 'Clear, flows. Medium fertility'},
  {id: 'eggwhite', ico: '\uD83E\uDD5A', name: 'Egg-white', sub: 'Clear, stretchy. Peak fertility'},
  {id: 'spotting', ico: '\uD83E\uDE78', name: 'Spotting', sub: 'Blood-tinged. Note for doctor'},
  {id: 'unusual', ico: '\u26AA', name: 'Unusual', sub: 'Odour / colour change'},
  {id: 'notchecked', ico: '\u2753', name: 'Not checked', sub: ''},
];

const OV_TESTS = [
  {id: 'lh', ico: '\uD83E\uDDEC', name: 'LH ovulation test strip', sub: 'Tests for LH surge. Positive = ovulation in 24-36 hours', results: ['Low', 'High', 'Peak']},
  {id: 'progesterone', ico: '\uD83C\uDF21\uFE0F', name: 'Progesterone (day 21 test)', sub: 'Confirms ovulation. >30 nmol/L = confirmed', results: ['Log result']},
  {id: 'pregnancy', ico: '\uD83E\uDD5A', name: 'Pregnancy test', sub: 'Use from Day 1 of missed period', results: ['Negative', 'Positive']},
  {id: 'amh', ico: '\uD83E\uDDEC', name: 'AMH (Anti-Mullerian Hormone)', sub: 'Ovarian reserve marker. Last: 4.8 ng/mL', value: '4.8 ng/mL'},
];

const PCOS_CHECKLIST = [
  {ico: '\uD83D\uDCC5', label: 'Irregular / infrequent periods', detail: 'Cycles avg 29 days with some variation 24-36 days. Borderline irregular.', status: 'Borderline'},
  {ico: '\uD83E\uDDEC', label: 'Hyperandrogenism (high testosterone)', detail: 'Free testosterone 3.2 pg/mL (borderline high). Acne (mild, score 1). Mild hirsutism noted.', status: 'Present'},
  {ico: '\uD83E\uDDEC', label: 'Polycystic ovaries on ultrasound', detail: 'Last USG (Mar 2023): multiple small follicles right ovary. Not definitively polycystic.', status: 'Borderline'},
  {ico: '\uD83E\uDDEC', label: 'Insulin resistance (T2DM link)', detail: 'HbA1c 7.8%, fasting glucose 8.4 mmol/L. Metformin treats both T2DM and reduces androgen.', status: 'Confirmed'},
  {ico: '\uD83D\uDCC8', label: 'AMH elevated (ovarian reserve)', detail: 'AMH 4.8 ng/mL. Above the 4.0 threshold suggesting PCOS-pattern ovarian activity.', status: 'High 4.8'},
];

const CYCLE_MEDICATIONS = [
  {ico: '\uD83D\uDC8A', bg: '#fce4ec', title: 'Metformin 500mg BD \u2014 PCOS + T2DM', body: 'Reduces hepatic glucose + lowers androgen production in PCOS. PM dose adherence only 71% this month.', badge: '71% PM', badgeBg: '#FFF7EE', badgeColor: '#633806'},
  {ico: '\uD83D\uDC8A', bg: '#F4F3FF', title: 'Inositol (Myo-inositol) \u2014 Consider for PCOS', body: 'Evidence-based PCOS supplement. Improves insulin sensitivity, ovulation regularity, and androgen levels.', badge: 'Not started', badgeBg: 'transparent', badgeColor: '#888', badgeBorder: true},
  {ico: '\uD83D\uDC8A', bg: '#EEF8F3', title: 'Folic acid 400mcg \u2014 Recommended', body: 'Standard for all women of reproductive age. Particularly important with T2DM.', badge: 'Log daily', badgeBg: '#EEF8F3', badgeColor: '#085041'},
  {ico: '\uD83D\uDC8A', bg: '#EBF0FA', title: 'Iron / Ferritin \u2014 Monitor if heavy periods', body: 'Last ferritin: 28 ng/mL (low-normal). Heavy periods + low ferritin leads to iron deficiency anaemia.', badge: '28 ng/mL', badgeBg: '#FAEEDA', badgeColor: '#633806'},
  {ico: '\uD83C\uDF3F', bg: '#f0e8d8', title: 'Spearmint tea \u2014 PCOS anti-androgen', body: '2 cups/day has evidence for reducing free testosterone in PCOS. Safe alongside Metformin.', badge: 'Log intake', badgeBg: 'transparent', badgeColor: '#888', badgeBorder: true},
];

const RELATED_CONDITIONS = [
  {ico: '\uD83E\uDDEC', bg: '#F4F3FF', title: 'Endometriosis screening', body: 'Painful periods, pain during intimacy, pelvic pain. Track consistently.', badge: 'Monitor', badgeBg: '#F4F3FF', badgeColor: '#2D1F70'},
  {ico: '\uD83E\uDE7A', bg: '#FEF0F0', title: 'Uterine fibroids', body: 'Heavy bleeding (7+ pads/day), prolonged periods. Pelvic USG 3 years ago, overdue for repeat.', badge: 'Scan due', badgeBg: '#FEF0F0', badgeColor: '#791F1F'},
  {ico: '\uD83E\uDDA0', bg: '#EBF0FA', title: 'Thyroid function (PCOS link)', body: 'Last TSH: 2.4 mIU/L (normal). Annual TSH check recommended with PCOS history.', badge: 'Normal', badgeBg: '#EEF8F3', badgeColor: '#085041'},
  {ico: '\u2696\uFE0F', bg: '#FFF7EE', title: 'PMDD (Pre-menstrual dysphoric disorder)', body: 'Severe mood symptoms 1-2 weeks before period. Document mood scores days 21-28.', badge: 'Track', badgeBg: '#FFF7EE', badgeColor: '#d97716'},
];

const CYCLE_HISTORY_TABLE = [
  {date: '11 Mar 26', latest: true, days: '5 days', flow: 'Mod', cycle: '29d', cycleColor: '#c2185b', notes: 'Mild cramps'},
  {date: '11 Feb 26', latest: false, days: '6 days', flow: 'Heavy', cycle: '28d', cycleColor: null, notes: 'Clots noted'},
  {date: '14 Jan 26', latest: false, days: '5 days', flow: 'Mod', cycle: '34d', cycleColor: '#d97716', notes: 'Late. stress'},
  {date: '11 Dec 25', latest: false, days: '5 days', flow: 'Light-mod', cycle: '28d', cycleColor: null, notes: 'Normal'},
];

module.exports = {
  CYCLES,
  CURRENT_CYCLE_DAY,
  PHASE_DATES,
  CYCLE_STATS,
  PHYSICAL_SYMPTOMS,
  PAIN_LOCATIONS,
  MOOD_EMOJIS,
  MOOD_TAGS,
  CONTEXT_TAGS,
  SKIN_HAIR_TAGS,
  PERIOD_STATUS_OPTIONS,
  FLOW_OPTIONS,
  CRAMP_OPTIONS,
  CM_OPTIONS,
  SEX_OPTIONS,
  CONTRA_OPTIONS,
  PCOS_QUESTIONS,
  PCOS_T2DM_CONNECTIONS,
  HORMONAL_TESTS,
  CYCLE_HISTORY,
  PHASE_INSIGHTS,
  WHEEL_LEGEND,
  LOG_TYPE_OPTIONS,
  FLOW_LEVELS,
  FLOW_COLORS,
  SYMPTOM_SCALES,
  SYMPTOM_DEFAULTS,
  MOOD_SCALES,
  PMS_TAGS,
  CM_DETAILED,
  OV_TESTS,
  PCOS_CHECKLIST,
  CYCLE_MEDICATIONS,
  RELATED_CONDITIONS,
  CYCLE_HISTORY_TABLE,
};
