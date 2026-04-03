import React, {useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Dimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import TrendChart from '../../components/shared/TrendChart';

const {width: SCREEN_W} = Dimensions.get('window');

// ──────────────────────────────────────────────
// LIFESTYLE DETAIL DATA (embedded per screen)
// ──────────────────────────────────────────────

const LIFESTYLE_DATA = {
  nutrition: {
    name: 'Nutrition',
    cat: 'Diet & Food',
    col: '#F59E0B',
    hdr: [
      {lbl: 'Calories', val: '1,720', unit: 'kcal/day', col: '#16A34A'},
      {lbl: 'Carbs', val: '58%', unit: 'of intake', col: '#DC2626'},
      {lbl: 'Sodium', val: '2.1g', unit: '/day', col: '#DC2626'},
      {lbl: 'Hydration', val: '1.4L', unit: '/day', col: '#DC2626'},
    ],
    ayu: {
      urgency: 'high',
      narrative:
        "Priya, your 58% carbohydrate diet is the single largest nutrition-driven contributor to your HbA1c of 7.8% and TG of 162 mg/dL. Ayu found that post-dinner glucose spikes (avg 180 mg/dL) are almost entirely driven by dinner carb load \u2014 typically 3 rotis + rice. Sodium at 2,100 mg/day is directly opposing Olmesartan\u2019s BP-lowering effect daily. The two changes with the highest combined impact: reduce dinner carbs and double hydration.",
      corrs: [
        {lbl: 'Dinner carbs \u2192 post-dinner glucose', val: 'High-carb dinners (3 rotis + rice): post-dinner glucose avg 196 mg/dL. Replace 1 roti with salad: avg 158 mg/dL \u2014 a 38 mg/dL improvement from one meal change.'},
        {lbl: 'Sodium \u2192 BP opposition', val: 'At 2,100 mg/day sodium, Priya consumes 140% above target. Each 500mg reduction lowers systolic BP by 2\u20133 mmHg \u2014 currently undoing part of Olmesartan\u2019s effect.'},
        {lbl: 'Fibre deficit \u2192 glucose spike shape', val: '14g/day fibre (target 25\u201330g) means rapid gastric emptying and sharper glucose spikes. Each +5g/day fibre flattens post-meal glucose spike by ~8\u201310 mg/dL.'},
        {lbl: 'Hydration \u2192 migraines + kidney', val: 'At 1.4L/day vs 2.5L target, Priya is chronically dehydrated \u2014 driving 3 migraine episodes/quarter and transiently elevating microalbumin readings.'},
      ],
    },
    insight: {
      desc: 'Nutrition is Priya\u2019s highest-leverage modifiable health factor. The Indian diet pattern \u2014 high in refined carbohydrates (white rice, maida roti), high sodium (pickles, processed snacks), and low in fibre \u2014 is directly driving HbA1c elevation, TG elevation, and BP resistance to treatment.',
      symp: [
        'Post-meal fatigue and brain fog (carbohydrate load)',
        'Persistent thirst (high sodium + inadequate hydration)',
        'Migraine episodes (chronic dehydration)',
        'Bloating and slow digestion (low fibre, 14g/day)',
        'Difficulty losing weight (58% carb diet driving fat storage)',
      ],
      causes: [
        'High-carbohydrate traditional Indian dinner pattern (3 rotis + rice)',
        'Low awareness of sodium content in pickles, papad, processed snacks',
        'Inadequate water intake \u2014 less than 6 glasses/day',
        'Low fibre diet \u2014 minimal vegetables and whole grains',
        'Late dinner timing \u2014 large meals within 2 hours of sleep',
      ],
    },
    organs: [
      {n: 'Liver', c: '#06B6D4', stage: 'Grade 1 NAFLD', sev: 52, impact: 'High carbohydrate diet is the primary driver of Priya\u2019s Grade 1 NAFLD (confirmed USG 2023). Excess dietary carbs are converted to TG via de novo lipogenesis and deposited as liver fat.'},
      {n: 'Kidneys', c: '#3B82F6', stage: 'Sodium Load', sev: 35, impact: '2,100 mg/day sodium creates pressure on the kidneys to excrete excess sodium \u2014 elevating BP and increasing glomerular filtration pressure. Directly opposing Olmesartan\u2019s renoprotective effect.'},
      {n: 'Pancreas', c: '#F59E0B', stage: 'Beta Cell Stress', sev: 55, impact: 'Post-dinner glucose spikes averaging 180 mg/dL force repeated large insulin releases from pancreatic beta cells. Sustained over years, this pattern accelerates beta cell exhaustion.'},
      {n: 'Blood Vessels', c: '#EF4444', stage: 'Atherogenic Diet', sev: 45, impact: 'High TG (162 mg/dL) from carbohydrate excess creates small dense LDL \u2014 the most atherogenic form. Combined with LDL 118 mg/dL, Priya\u2019s dietary pattern is actively building arterial plaque.'},
      {n: 'Brain', c: '#7C3AED', stage: 'Dehydration Impact', sev: 38, impact: 'At 1.4L/day hydration, chronic mild dehydration impairs cerebral blood flow. This contributes to brain fog, difficulty concentrating, and is the primary driver of Priya\u2019s 3 migraine episodes per quarter.'},
    ],
    cluster: {
      risk: '68%', name: 'Dietary-Metabolic Cascade',
      desc: 'High-carbohydrate, high-sodium, low-fibre diet is the nutritional underpinning of Priya\u2019s entire metabolic syndrome \u2014 directly driving T2DM control, dyslipidaemia, NAFLD, and hypertension simultaneously.',
      diseases: [
        {n: 'T2DM Glycaemic Instability', p: 78, type: 'active'},
        {n: 'NAFLD Progression', p: 60, type: 'active'},
        {n: 'Hypertension Resistance', p: 55, type: 'emerging'},
        {n: 'Dyslipidaemia', p: 65, type: 'active'},
      ],
      timeline: [
        {time: 'Now', event: 'Diet driving: HbA1c 7.8%, TG 162, BP 136/86, Grade 1 NAFLD. All four linked to current dietary pattern.', col: '#EF4444'},
        {time: '3 months', event: 'Reducing carbs to <50% + doubling hydration: expected HbA1c drop 0.3%, TG drop 15\u201320 mg/dL, BP drop 4\u20136 mmHg.', col: '#F97316'},
        {time: '12 months', event: 'Sustained dietary change: NAFLD may regress from grade 1 toward normal. LDL:TG ratio improving.', col: '#F59E0B'},
        {time: '2\u20133 years', event: 'Without dietary change: TG rises to 200+, NAFLD progresses to grade 2, BP medication escalation needed.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Replace 1 Roti with Salad at Dinner', desc: 'Single most impactful change. Reduces dinner carb load by ~30g, lowers post-dinner glucose from 196 to 158 mg/dL average. No cooking change needed \u2014 just swap.', pri: 'high', ico: 'restaurant-outline'},
      {title: 'Drink 8 Glasses Water Daily', desc: 'Set reminders for 10 AM, 1 PM, 4 PM, 7 PM \u2014 2 glasses at each. Directly addresses migraine, microalbumin, and energy. 250ml bottles at desk.', pri: 'high', ico: 'water-outline'},
      {title: 'Cut Pickles, Papad and Processed Snacks', desc: 'These 3 items account for ~800 mg/day of the sodium excess. Eliminating them alone would reduce sodium from 2,100 to ~1,300 mg/day \u2014 below target.', pri: 'high', ico: 'close-circle-outline'},
      {title: 'Add 1 Cup Dal or Legumes at Dinner', desc: 'Dal adds 4\u20136g fibre per serving, slows gastric emptying, and reduces glucose spike. Doubles as protein source reducing carb % simultaneously.', pri: 'medium', ico: 'leaf-outline'},
    ],
    care: {
      treat: [
        'Nutrition consult for T2DM-specific low-GI Indian meal plan \u2014 priority referral',
        'Target: carbohydrate <50% of calories (currently 58%)',
        'Target: sodium <1,500 mg/day (currently 2,100 mg)',
        'Target: fibre 25\u201330g/day (currently 14g)',
        'Target: hydration 2.5L/day (currently 1.4L)',
      ],
      prev: 'Low-GI traditional Indian diet is achievable without sacrificing cultural food preferences. The key swaps: brown rice for white, dal for extra roti, and 1 glass water before each meal. Annual dietary review aligned with HbA1c testing.',
    },
    prog: {
      primary: {lbl: 'Carbohydrate %', val: 58, lo: 40, hi: 50, unit: '%', col: '#F59E0B'},
      panels: [
        {lbl: 'Macros', cls: 'tl', score: '58%', bar: 50, badge: '\u2192 Stable', badge_col: '#D97706', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'Carbohydrate intake at 58% \u2014 declining slowly from 62% (Oct 25). Target <50%. Protein at 18% (target 25%). Fat at 24% (target 25%).'},
        {lbl: 'Hydration', cls: 'pu', score: '1.4L', bar: 28, badge: '\u2193 Low', badge_col: '#DC2626', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: '1.4L/day vs 2.5L target \u2014 only 56% of daily hydration goal. Pattern is consistent: no water at desk, forgets to drink until thirsty.'},
        {lbl: 'Sodium', cls: 'bl', score: '2.1g', bar: 70, badge: '\u2191 High', badge_col: '#DC2626', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: '2,100 mg/day vs target <1,500 mg. Primary sources: pickles (700mg), papad (400mg), packaged snacks (500mg). Removing these three would hit target.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 62, st: 'h'}, {dt: 'Nov 25', v: 61, st: 'h'}, {dt: 'Dec 25', v: 60, st: 'h'},
        {dt: 'Jan 26', v: 59, st: 'h'}, {dt: 'Feb 26', v: 59, st: 'h'}, {dt: 'Mar 26', v: 58, st: 'h'},
      ],
      histLabel: 'Carbohydrate % trend',
    },
  },

  sleep: {
    name: 'Sleep',
    cat: 'Sleep & Recovery',
    col: '#7C3AED',
    hdr: [
      {lbl: 'Avg nightly', val: '5.9h', unit: '/night', col: '#DC2626'},
      {lbl: 'Sleep debt', val: '~13h', unit: 'March', col: '#DC2626'},
      {lbl: 'Deep sleep', val: '18%', unit: 'of total', col: '#D97706'},
      {lbl: 'Awakenings', val: '3.2', unit: '/night', col: '#D97706'},
    ],
    ayu: {
      urgency: 'high',
      narrative:
        "Priya\u2019s average 5.9h sleep \u2014 1.1h below the T2DM clinical recommendation \u2014 is Ayu\u2019s #1 ranked lifestyle intervention. Sleep acts through cortisol: short sleep \u2192 elevated morning cortisol \u2192 impaired insulin signalling \u2192 higher FBG \u2192 higher HbA1c over time. Ayu\u2019s analysis across 31 March nights shows sleep duration alone explains 40% of FBG day-to-day variability. No medication can compensate for 13 hours of accumulated monthly sleep debt.",
      corrs: [
        {lbl: 'Sleep <6h \u2192 next-morning FBG', val: 'On nights with less than 6h sleep, next-morning FBG averages 129 mg/dL. On 7h+ nights: 114 mg/dL. A 15 mg/dL swing entirely controlled by bedtime.'},
        {lbl: 'Sleep \u2192 HRV \u2192 cardiac health', val: 'HRV of 28ms (low) directly reflects chronic sleep debt. Each additional hour of sleep raises HRV by an estimated 3\u20135ms, reducing cardiac compensation load.'},
        {lbl: 'Sleep \u2192 cortisol \u2192 PM Metformin miss cascade', val: 'Late sleep onset (avg 12:08 AM) is correlated with missed PM Metformin on the same night \u2014 the two-step cascade that most worsens FBG the next morning.'},
        {lbl: 'Deep sleep deficit \u2192 memory + mood', val: '18% deep sleep (target >20%) means inadequate cognitive restoration. Directly contributing to PHQ-9 score of 8 and difficulty concentrating noted in symptom log.'},
      ],
    },
    insight: {
      desc: 'Sleep is the most underestimated metabolic drug available to Priya. T2DM clinical guidelines recommend 7\u20139h sleep \u2014 Priya averages 5.9h. The mechanism is direct: insufficient sleep elevates cortisol and growth hormone, both of which impair insulin signalling and raise fasting blood glucose. Every night below 6h is equivalent to a partial metabolic stressor.',
      symp: [
        'Morning fatigue despite sleeping \u2014 non-restorative sleep',
        'Difficulty concentrating and brain fog throughout the day',
        'Increased hunger and carbohydrate cravings next day',
        'Higher FBG and impaired glucose control on poor sleep nights',
        'Mood dip and low motivation (links to PHQ-9 score of 8)',
        'Increased evening screen time delaying sleep onset',
      ],
      causes: [
        'Late sleep onset (avg 12:08 AM) due to phone/screen use',
        'High cognitive arousal at bedtime \u2014 no wind-down routine',
        'Stress and work-related rumination at night (GAD-7: 6)',
        '3.2 awakenings/night possibly from nocturia (high FBG drives increased urination)',
        'No consistent sleep schedule \u2014 weekends vary by 2+ hours',
      ],
    },
    organs: [
      {n: 'Brain', c: '#7C3AED', stage: 'Impaired Restoration', sev: 55, impact: 'Deep sleep (18%) is below the 20% threshold needed for complete hippocampal memory consolidation and prefrontal cortex restoration. Contributing to brain fog, PHQ-9 score of 8, and impaired decision-making under stress.'},
      {n: 'Pancreas', c: '#F59E0B', stage: 'Insulin Resistance', sev: 60, impact: 'Sleep deprivation reduces insulin sensitivity by up to 25% within 3 nights. Priya\u2019s chronic 5.9h average means her pancreas is permanently working against impaired receptor sensitivity.'},
      {n: 'Heart', c: '#EF4444', stage: 'HRV Suppressed', sev: 48, impact: 'HRV of 28ms (low) is directly reflecting chronic sleep debt. Sleep deprivation prevents the nocturnal cardiac recovery that raises HRV and reduces resting heart rate. Sustained elevation of nocturnal sympathetic tone.'},
      {n: 'Adrenal Glands', c: '#DC2626', stage: 'Cortisol Dysregulation', sev: 52, impact: 'Short sleep elevates morning cortisol, which directly raises hepatic glucose output and drives insulin resistance. Priya\u2019s high-stress days + poor sleep = cortisol double-hit that accounts for her worst FBG readings.'},
      {n: 'Immune System', c: '#06B6D4', stage: 'Compromised', sev: 42, impact: 'Less than 6h sleep reduces immune cytokine production. Combined with Vit D deficiency (18 ng/mL), this explains Priya\u2019s URTI in Dec 2025 and recurrent infection susceptibility.'},
    ],
    cluster: {
      risk: '72%', name: 'Sleep-Metabolic Syndrome Cluster',
      desc: 'Chronic sleep deprivation is now recognised as a standalone risk factor for T2DM, hypertension, and cardiovascular disease. For Priya, it is the behavioural amplifier of every other condition she has.',
      diseases: [
        {n: 'T2DM Glycaemic Instability', p: 75, type: 'active'},
        {n: 'Hypertension Worsening', p: 60, type: 'active'},
        {n: 'Depression / Anxiety', p: 55, type: 'emerging'},
        {n: 'Cardiovascular Risk', p: 40, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: '5.9h avg sleep driving: FBG +15 mg/dL, HRV 28ms, PHQ-9 8, BP 136/86. Sleep debt of 13h accumulated in March.', col: '#EF4444'},
        {time: '2 weeks', event: 'With 7h sleep: FBG drops ~15 mg/dL. HRV begins recovering. Mood score expected to rise 1\u20132 points.', col: '#F97316'},
        {time: '3 months', event: 'Consistent 7h sleep: HbA1c reduction 0.3\u20130.4% independent of medication. HRV normalising to 35+ ms.', col: '#F59E0B'},
        {time: 'Without change', event: 'Continued <6h sleep: HbA1c trajectory worsens, BP escalation likely, depression risk rising significantly.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Sleep by 11 PM Tonight', desc: 'The most impactful single action in Priya\u2019s profile. Tomorrow\u2019s FBG will be ~15 mg/dL lower. Set hard phone cutoff at 10:30 PM. Charge phone outside bedroom.', pri: 'high', ico: 'moon-outline'},
      {title: 'Set 10:30 PM Wind-Down Alarm', desc: '30-min wind-down period before target sleep time. Dim lights, no new email/messages. This is the single most effective sleep onset intervention in studies.', pri: 'high', ico: 'alarm-outline'},
      {title: 'Fix Nocturia \u2014 Reduce Evening Fluids After 8 PM', desc: '3.2 awakenings/night is partly from nocturia driven by high nocturnal glucose. Controlling evening FBG via PM Metformin + no carbs after 8 PM will reduce awakenings.', pri: 'medium', ico: 'water-outline'},
      {title: 'Keep Weekend Wake Time Consistent', desc: 'Weekend sleep-ins beyond 7:30 AM disrupt circadian rhythm and make Monday sleep onset harder. Consistent wake time is more important than consistent sleep time.', pri: 'medium', ico: 'calendar-outline'},
    ],
    care: {
      treat: [
        'No medication for sleep \u2014 behavioural intervention first-line',
        'Target: 7h sleep minimum, ideally 7.5h',
        'Track nightly via Apple Watch \u2014 review weekly trends',
        'Consider cognitive behavioural therapy for insomnia (CBT-I) if no improvement in 4 weeks',
        'Rule out sleep apnoea if awakenings persist despite good sleep hygiene',
      ],
      prev: 'Sleep hygiene: consistent 10:30 PM wind-down, no screens after 10 PM, cool dark bedroom, charge phone outside. Sleep is the most powerful free metabolic drug available \u2014 prioritise it with the same seriousness as medication adherence.',
    },
    prog: {
      primary: {lbl: 'Avg Sleep Duration', val: 5.9, lo: 7, hi: 8, unit: 'h', col: '#7C3AED'},
      panels: [
        {lbl: 'Duration', cls: 'tl', score: '5.9h', bar: 35, badge: '\u2193 Low', badge_col: '#DC2626', lbl_col: '#0F766E', score_col: '#0F766E', detail: '5.9h average (target 7\u20138h). Has been declining: 6.3h (Oct 25) \u2192 5.9h (Mar 26). Sleep debt of ~13h accumulated this month alone.'},
        {lbl: 'Quality', cls: 'pu', score: '18%', bar: 45, badge: '\u2192 Stable', badge_col: '#D97706', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'Deep sleep 18% (target >20%). REM 19% (target 20\u201325%). Both stages slightly below target. Quality is not the primary problem \u2014 duration is.'},
        {lbl: 'Consistency', cls: 'bl', score: '\u00b11.8h', bar: 30, badge: '\u2193 Poor', badge_col: '#DC2626', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'Sleep timing varies by \u00b11.8h across the week (weekday vs weekend). High variability = social jet lag, disrupting circadian cortisol and glucose rhythms.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 6.3, st: 'l'}, {dt: 'Nov 25', v: 6.1, st: 'l'}, {dt: 'Dec 25', v: 6.0, st: 'l'},
        {dt: 'Jan 26', v: 6.2, st: 'l'}, {dt: 'Feb 26', v: 5.8, st: 'l'}, {dt: 'Mar 26', v: 5.9, st: 'l'},
      ],
      histLabel: 'Average sleep duration trend',
    },
  },

  fitness: {
    name: 'Fitness',
    cat: 'Physical Activity',
    col: '#16A34A',
    hdr: [
      {lbl: 'Daily steps', val: '6,240', unit: '/day', col: '#D97706'},
      {lbl: 'Active min', val: '22', unit: 'min/day', col: '#D97706'},
      {lbl: 'VO\u2082 max', val: '28', unit: 'mL/kg/min', col: '#D97706'},
      {lbl: '6-mo trend', val: '\u219124%', unit: 'steps', col: '#16A34A'},
    ],
    ayu: {
      urgency: 'medium',
      narrative:
        "Priya\u2019s fitness is on the most encouraging trajectory in her profile \u2014 steps up 24% over 6 months (5,100\u21926,240/day). But the target of 8,000 steps/day is still 22% away, and VO\u2082 max of 28 mL/kg/min is in the low range for a 38-year-old female. The data shows fitness acts as a BP lever more powerfully than any single dietary change: 6,000+ step days average BP 128/82 vs 138/90 on low-activity days.",
      corrs: [
        {lbl: 'Steps \u2192 BP control', val: 'Days with 6,000+ steps: BP avg 128/82 mmHg. Days below 4,000 steps: BP 138/90 mmHg. Each 1,000 additional steps reduces systolic BP by ~1 mmHg.'},
        {lbl: 'Activity \u2192 post-dinner glucose', val: 'Evening walk (15 min after dinner): post-dinner glucose 158 mg/dL. No walk: 196 mg/dL. Done on only 9 of 31 March evenings.'},
        {lbl: 'VO\u2082 max \u2192 insulin sensitivity', val: 'VO\u2082 max of 28 mL/kg/min is in the low-normal range. Each 1 mL/kg/min improvement in VO\u2082 max improves insulin sensitivity by ~2\u20133%, directly lowering HbA1c.'},
        {lbl: 'Step count \u2192 HDL trajectory', val: '\u219124% steps over 6 months is already nudging HDL upward. Reaching 8,000 steps/day is projected to raise HDL from 52 to 55\u201357 mg/dL by Sep 2026.'},
      ],
    },
    insight: {
      desc: 'Physical activity is the strongest non-medication lever for BP control in Priya\u2019s profile. Steps have risen 24% in 6 months \u2014 the best sustained improvement in her health data. However, at 6,240 steps/day, she is still 22% below the 8,000-step target that would meaningfully improve insulin sensitivity, VO\u2082 max, and HDL simultaneously.',
      symp: [
        'Breathlessness on climbing stairs or fast walking',
        'Low stamina and exercise intolerance',
        'Slow post-exercise recovery',
        'Ankle oedema worsened by prolonged sitting',
        'Low mood on sedentary days (activity-mood correlation confirmed)',
      ],
      causes: [
        'Desk-based work with minimal movement',
        'Breathlessness from mild anaemia reducing exercise motivation',
        'Knee pain (4\u00d7/month) creating a barrier to sustained walking',
        'No structured exercise routine \u2014 activity is incidental',
        'Fatigue from poor sleep and Vit D deficiency limiting energy reserves',
      ],
    },
    organs: [
      {n: 'Heart', c: '#EF4444', stage: 'Deconditioning', sev: 48, impact: 'VO\u2082 max of 28 mL/kg/min reflects cardiac deconditioning \u2014 below the 30+ mL/kg/min expected for Priya\u2019s age and sex. High-activity days (6k+ steps) already show BP improvement to 128/82 vs 138/90 on low-activity days.'},
      {n: 'Muscles', c: '#F59E0B', stage: 'Suboptimal Capacity', sev: 40, impact: 'Skeletal muscle is the primary site of glucose disposal during exercise. At current activity levels, Priya\u2019s muscle glucose uptake is insufficient, driving sustained hyperglycaemia between meals.'},
      {n: 'Blood Vessels', c: '#16A34A', stage: 'Improving', sev: 30, impact: 'The \u219124% step count improvement is already generating vascular benefits \u2014 shear stress from walking stimulates endothelial nitric oxide production, which lowers BP and improves arterial flexibility.'},
      {n: 'Liver', c: '#06B6D4', stage: 'NAFLD Benefit', sev: 35, impact: 'Aerobic exercise is the most effective non-surgical intervention for NAFLD. At current trajectory, reaching 8,000 steps/day would reduce hepatic fat content by an estimated 10\u201315% over 6 months.'},
      {n: 'Brain', c: '#7C3AED', stage: 'BDNF Deficient', sev: 35, impact: 'Physical inactivity reduces brain-derived neurotrophic factor (BDNF). This is a direct contributor to Priya\u2019s PHQ-9 score of 8 \u2014 150 min/week of moderate activity raises mood equivalently to mild antidepressants.'},
    ],
    cluster: {
      risk: '48%', name: 'Deconditioning-Metabolic Cluster',
      desc: 'Physical inactivity amplifies all of Priya\u2019s conditions \u2014 worsening insulin resistance, BP, NAFLD, mood, and neuropathy simultaneously. The good news: improvement is already underway.',
      diseases: [
        {n: 'T2DM Insulin Resistance', p: 60, type: 'active'},
        {n: 'Hypertension', p: 55, type: 'active'},
        {n: 'NAFLD', p: 50, type: 'active'},
        {n: 'Depression / Low Mood', p: 45, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: '6,240 steps/day \u2014 22% below target. VO\u2082 max 28. BUT \u219124% improvement over 6 months is strong positive momentum.', col: '#D97706'},
        {time: '3 months', event: 'If steps reach 8,000/day: BP expected to drop 4\u20136 mmHg. HDL rises to 55 mg/dL. HbA1c benefits 0.2\u20130.3% from improved insulin sensitivity.', col: '#F97316'},
        {time: '6\u201312 months', event: 'NAFLD regression possible. VO\u2082 max improves to 31\u201332 mL/kg/min. Mood score rises 1\u20132 points.', col: '#F59E0B'},
        {time: 'Without progress', event: 'Stagnation at 6,240 steps: deconditioning deepens, VO\u2082 max declines, BP escalation requiring medication adjustment.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Add 15-min Post-Dinner Walk Daily', desc: 'Single highest-impact action: lowers post-dinner glucose from 196 to 158 mg/dL AND adds ~1,200 steps toward target. Done on only 9 of 31 March evenings.', pri: 'high', ico: 'walk-outline'},
      {title: 'Take Stairs Instead of Lift', desc: '2 flights of stairs \u00d74 per day = ~400 extra steps and 3 min activity. No schedule change needed \u2014 purely a routing habit.', pri: 'medium', ico: 'trending-up-outline'},
      {title: '10-min Morning Stretch + Walk', desc: '5 min walking after waking raises morning metabolism by 8% and improves insulin receptor sensitivity before breakfast.', pri: 'medium', ico: 'sunny-outline'},
      {title: 'Physiotherapy for Knee Pain', desc: 'Knee pain 4\u00d7/month is a limiting factor. 3 physio sessions already done \u2014 continue for 3 more to build quadricep strength and reduce pain barrier.', pri: 'medium', ico: 'fitness-outline'},
    ],
    care: {
      treat: [
        'Target: 8,000 steps/day by June 2026 (currently 6,240)',
        'Post-dinner 15-min walk \u2014 schedule as recurring calendar event',
        'Physiotherapy: 3 more sessions for knee pain resolution',
        'Annual VO\u2082 max estimation via Apple Watch \u2014 target >30 mL/kg/min',
        'Consider swimming or cycling to reduce knee joint stress if pain persists',
      ],
      prev: '30 min/day moderate activity is the most evidence-based diabetes and hypertension prevention intervention. Step count is a reliable proxy \u2014 track daily and review weekly. Even 10 min post-meal walks 3\u00d7 per day match a single 30-min session in glucose impact.',
    },
    prog: {
      primary: {lbl: 'Daily Step Count', val: 6240, lo: 7000, hi: 10000, unit: 'steps', col: '#16A34A'},
      panels: [
        {lbl: 'Activity', cls: 'tl', score: '6.2k', bar: 62, badge: '\u2191 Improving', badge_col: '#16A34A', lbl_col: '#0F766E', score_col: '#0F766E', detail: '6,240 steps/day \u2014 up 24% from 5,100 in Oct 25. Below 8,000 target by 22%. Evening walk on only 9 of 31 March days.'},
        {lbl: 'Cardiovascular', cls: 'pu', score: '28', bar: 46, badge: '\u2193 Low', badge_col: '#D97706', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'VO\u2082 max 28 mL/kg/min \u2014 low normal for age 38F. Active minutes: 22/day (target 30). HRV 28ms reflects cardiac deconditioning.'},
        {lbl: 'Consistency', cls: 'bl', score: '72%', bar: 72, badge: '\u2191 Good', badge_col: '#16A34A', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: '72% of days reached at least 5,000 steps \u2014 the best consistency metric in Priya\u2019s fitness data. Baseline habit is forming.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 5100, st: 'l'}, {dt: 'Nov 25', v: 5200, st: 'l'}, {dt: 'Dec 25', v: 5400, st: 'l'},
        {dt: 'Jan 26', v: 5700, st: 'l'}, {dt: 'Feb 26', v: 6100, st: 'l'}, {dt: 'Mar 26', v: 6240, st: 'l'},
      ],
      histLabel: 'Daily step count trend',
    },
  },

  medication: {
    name: 'Medication Adherence',
    cat: 'Treatment Compliance',
    col: '#7C3AED',
    hdr: [
      {lbl: 'Overall', val: '78%', unit: 'adherence', col: '#D97706'},
      {lbl: 'PM Metformin', val: '58%', unit: 'adherence', col: '#DC2626'},
      {lbl: 'Misses', val: '13', unit: 'in March', col: '#DC2626'},
      {lbl: 'FBG impact', val: '\u221212', unit: 'mg/dL/dose', col: '#16A34A'},
    ],
    ayu: {
      urgency: 'high',
      narrative:
        "Priya\u2019s medication adherence of 78% overall masks a critical split: AM Metformin is near-perfect (97%) but PM Metformin is at 58% \u2014 13 misses in March alone. This single gap is responsible for an estimated +12 mg/dL on every missed morning\u2019s FBG. Ayu found the misses cluster on evenings with late sleep onset and high-stress days \u2014 the same cascade that drives glucose spikes. Fixing PM Metformin adherence alone would lower HbA1c by an estimated 0.2\u20130.3%.",
      corrs: [
        {lbl: 'PM Metformin miss \u2192 next-morning FBG', val: 'Evenings with PM Metformin taken: next FBG avg 119 mg/dL. Evenings missed: avg 131 mg/dL. Each miss costs exactly 12 mg/dL.'},
        {lbl: 'Miss pattern \u2192 late nights + stress', val: '10 of 13 March PM Metformin misses occurred on evenings with sleep onset after midnight. Setting a 9 PM alarm would catch the dose before late-night distraction.'},
        {lbl: 'Cumulative March miss impact', val: '13 misses \u00d7 12 mg/dL = 156 mg/dL of unnecessary glucose burden accumulated in March. Compounded over 12 months, this is a significant HbA1c driver.'},
        {lbl: 'Methylcobalamin misses \u2192 neuropathy risk', val: '5 Methylcobalamin misses in March slow the B12 repletion trajectory. At 84% adherence, foot tingling improvement will take 3\u20134 months instead of 6\u20138 weeks.'},
      ],
    },
    insight: {
      desc: 'Medication adherence of 78% is dangerously misleading as a headline number \u2014 it hides a 97% AM Metformin vs 58% PM Metformin split that has direct measurable consequences on every morning\u2019s FBG reading. PM Metformin is the most important single dose in Priya\u2019s regimen: it controls hepatic glucose release overnight, directly setting the starting FBG for the next day.',
      symp: [
        'Higher FBG readings on mornings following missed PM Metformin',
        'Increased fatigue and brain fog on high-glucose mornings',
        'Reduced sense of wellbeing on days with poor glycaemic control',
        'Anxiety about blood sugar control contributing to GAD-7 score of 6',
      ],
      causes: [
        'No PM Metformin reminder set \u2014 forgetting by evening',
        'Late night activities pushing medication out of routine',
        'PM Metformin taken with dinner but dinner timing varies',
        'Methylcobalamin not added to pill organiser \u2014 taken inconsistently',
        'No visual medication tracker to create accountability',
      ],
    },
    organs: [
      {n: 'Liver', c: '#06B6D4', stage: 'Overnight Glucose Release', sev: 55, impact: 'PM Metformin specifically targets hepatic glucose output overnight. When missed, the liver releases 40\u201360 mg/dL of glucose into the bloodstream during the fasting hours \u2014 directly setting a higher baseline FBG by morning.'},
      {n: 'Kidneys', c: '#3B82F6', stage: 'Hydration Concern', sev: 25, impact: 'Metformin is renally cleared. With eGFR at 72 mL/min (CKD2 borderline) and low hydration (1.4L/day), Metformin concentration can rise transiently with missed doses and restarting. Adequate hydration is essential.'},
      {n: 'Nerves', c: '#F59E0B', stage: 'B12 Depletion Accelerating', sev: 42, impact: 'Methylcobalamin misses (84% adherence, 5 misses) slow the B12 repletion needed to address foot tingling and peripheral neuropathy. Each missed Methylcobalamin dose delays nerve healing by approximately 1\u20132 days.'},
      {n: 'Brain', c: '#7C3AED', stage: 'Adherence Fatigue', sev: 30, impact: 'Managing 6 medications creates cognitive load that contributes to adherence fatigue. Combined with poor sleep (5.9h), the evening routine is the highest-risk period for missed doses.'},
    ],
    cluster: {
      risk: '62%', name: 'Non-Adherence Cascade Cluster',
      desc: 'PM Metformin non-adherence is not an isolated gap \u2014 it triggers a cascade: missed dose \u2192 high overnight glucose \u2192 high FBG \u2192 poor sleep (nocturia) \u2192 stress \u2192 more misses. Breaking this loop is high priority.',
      diseases: [
        {n: 'HbA1c Non-Achievement', p: 72, type: 'active'},
        {n: 'B12 Deficiency Neuropathy', p: 45, type: 'emerging'},
        {n: 'Glycaemic Instability', p: 68, type: 'active'},
        {n: 'CKD Progression Risk', p: 25, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: '78% overall adherence. PM Metformin 58% \u2014 13 misses causing +12 mg/dL FBG per miss. HbA1c target unreachable at current adherence.', col: '#EF4444'},
        {time: '1 month', event: 'If PM Metformin adherence reaches 90%: estimated FBG reduction 8\u201310 mg/dL. HbA1c trajectory improves by 0.2\u20130.3%.', col: '#F97316'},
        {time: '3 months', event: 'If all medications at >95%: HbA1c projected to reach 7.2\u20137.4% by Jun 2026 retest. B12 repletion on track.', col: '#F59E0B'},
        {time: 'Without improvement', event: 'At 58% PM Metformin: HbA1c likely to remain above 7.5% despite dose increase. Neuropathy improvement stalled.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Set 9 PM Daily PM Metformin Alarm', desc: 'Non-dismissible alarm on phone. The single action with the highest FBG impact: each dose taken = \u221212 mg/dL next morning. Takes 5 seconds to take.', pri: 'high', ico: 'alarm-outline'},
      {title: 'Place Medications Beside Dinner Plate', desc: 'Visual cue removes the need to remember. Laying out evening medications before sitting down for dinner achieves near-100% adherence in behavioral studies.', pri: 'high', ico: 'restaurant-outline'},
      {title: 'Add Methylcobalamin to Evening Pill Organiser', desc: '5 misses in March are slowing B12 repletion and foot tingling improvement. Adding it to the physical organiser next to PM Metformin catches it in one action.', pri: 'medium', ico: 'medkit-outline'},
      {title: 'Weekly Adherence Check in TrustLife', desc: 'Review the adherence log every Sunday. Visual accountability \u2014 even reviewing without changing behaviour improves next week\u2019s adherence by 12\u201318% in studies.', pri: 'medium', ico: 'checkbox-outline'},
    ],
    care: {
      treat: [
        'Metformin 1000mg PM \u2014 target: 95% adherence (currently 58%)',
        'Methylcobalamin 500mcg OD \u2014 continue; target >95% adherence',
        'Weekly FBG review to track PM Metformin impact directly',
        'Consider blister pack dispensing for PM medications \u2014 reduces misses by ~40%',
        'Pharmacist medication review at next dispensing to simplify regimen if possible',
      ],
      prev: 'Medication adherence is a skill, not a personality trait \u2014 it requires systems, not willpower. The three highest-impact systems: visual cue (meds beside plate), alarm (9 PM), and weekly review. Once these are habitual, 95% adherence is consistently achievable.',
    },
    prog: {
      primary: {lbl: 'Overall Adherence', val: 78, lo: 90, hi: 100, unit: '%', col: '#7C3AED'},
      panels: [
        {lbl: 'Critical Meds', cls: 'tl', score: '88%', bar: 73, badge: '\u2192 Moderate', badge_col: '#D97706', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'Critical medications (Metformin AM+PM, Amlodipine, Olmesartan): 88% combined adherence. PM Metformin (58%) pulling this average down significantly.'},
        {lbl: 'BP Meds', cls: 'pu', score: '98%', bar: 98, badge: '\u2191 Excellent', badge_col: '#16A34A', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'Amlodipine 5mg (100%) and Olmesartan 20mg (96%) \u2014 exemplary adherence. These two medications are working as designed. Sustain this standard.'},
        {lbl: 'New Meds', cls: 'bl', score: '84%', bar: 70, badge: '\u2192 Improve', badge_col: '#D97706', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'Methylcobalamin 500mcg (84%) and Atorvastatin 10mg (97%). Methylcobalamin is the weak point \u2014 5 misses delaying B12/neuropathy response.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 82, st: 'l'}, {dt: 'Nov 25', v: 80, st: 'l'}, {dt: 'Dec 25', v: 79, st: 'l'},
        {dt: 'Jan 26', v: 76, st: 'l'}, {dt: 'Feb 26', v: 78, st: 'l'}, {dt: 'Mar 26', v: 78, st: 'l'},
      ],
      histLabel: 'Overall medication adherence %',
    },
  },
};

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const ORGAN_ICON_MAP = {
  Liver: 'medical-outline',
  Kidneys: 'water-outline',
  Pancreas: 'fitness-outline',
  Heart: 'heart-outline',
  'Blood Vessels': 'pulse-outline',
  Brain: 'bulb-outline',
  Muscles: 'barbell-outline',
  'Adrenal Glands': 'flash-outline',
  Nerves: 'flash-outline',
  'Immune System': 'shield-outline',
};

const statusColor = status => {
  if (!status) return Colors.textSecondary;
  const lc = status.toLowerCase();
  if (lc === 'normal' || lc === 'good' || lc === 'optimal' || lc === 'stable' || lc === 'on track')
    return Colors.teal;
  if (lc === 'borderline' || lc === 'elevated' || lc === 'fair' || lc === 'suboptimal' || lc === 'watch' || lc === 'moderate' || lc === 'above target' || lc === 'below target')
    return Colors.amber;
  return Colors.red;
};

const statusBg = status => {
  if (!status) return Colors.tealBg;
  const lc = status.toLowerCase();
  if (lc === 'normal' || lc === 'good' || lc === 'optimal' || lc === 'stable' || lc === 'on track')
    return Colors.tealBg;
  if (lc === 'borderline' || lc === 'elevated' || lc === 'fair' || lc === 'suboptimal' || lc === 'watch' || lc === 'moderate' || lc === 'above target' || lc === 'below target')
    return Colors.amberBg;
  return Colors.redBg;
};

const TABS = [
  {key: 'ayuIntel', label: '\uD83E\uDDE0 Ayu Intel'},
  {key: 'progression', label: '\uD83D\uDCC8 Progression'},
  {key: 'organs', label: '\uD83E\uDEC1 Organs'},
  {key: 'cluster', label: '\uD83D\uDD17 Cluster'},
  {key: 'care', label: '\u2713 Care'},
];

// ──────────────────────────────────────────────
// Chart components
// ──────────────────────────────────────────────

const SimpleChart = ({data, dates, refLow, refHigh, color, height = vs(120)}) => {
  if (!data || data.length === 0) return null;
  const chartW = SCREEN_W - s(48);
  const minV = Math.min(...data, refLow != null ? refLow : Infinity) * 0.92;
  const maxV = Math.max(...data, refHigh != null ? refHigh : -Infinity) * 1.08;
  const range = maxV - minV || 1;
  const stepX = chartW / (data.length - 1 || 1);
  const yPos = v => height - ((v - minV) / range) * height;
  const refBandTop = refHigh != null ? yPos(refHigh) : 0;
  const refBandBottom = refLow != null ? yPos(refLow) : height;

  return (
    <View style={{height: height + vs(28), marginTop: vs(8)}}>
      {refLow != null && refHigh != null && (
        <View style={{position: 'absolute', top: refBandTop, left: 0, right: 0, height: refBandBottom - refBandTop, backgroundColor: Colors.tealBg, opacity: 0.5, borderRadius: ms(4)}} />
      )}
      {data.map((v, i) => {
        const x = i * stepX;
        const y = yPos(v);
        const dotColor = color || (refHigh != null && v > refHigh ? Colors.red : refLow != null && v < refLow ? Colors.amber : Colors.teal);
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <View style={{position: 'absolute', left: (i - 1) * stepX + ms(4), top: yPos(data[i - 1]) + ms(2), width: stepX, height: 1.5, backgroundColor: Colors.borderLight, transform: [{rotate: `${Math.atan2(y - yPos(data[i - 1]), stepX) * (180 / Math.PI)}deg`}], transformOrigin: 'left center'}} />
            )}
            <View style={{position: 'absolute', left: x, top: y - ms(4), width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: dotColor, borderWidth: 2, borderColor: Colors.white, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.15, shadowRadius: 2}} />
          </React.Fragment>
        );
      })}
      {dates && (
        <View style={{position: 'absolute', bottom: 0, left: 0, right: 0, flexDirection: 'row', justifyContent: 'space-between'}}>
          {dates.map((d, i) => (
            <AppText key={i} variant="small" color={Colors.textTertiary} style={{fontSize: ms(7)}}>{d}</AppText>
          ))}
        </View>
      )}
    </View>
  );
};

const ProgressBar = ({progress, color, height = 6, bg = Colors.borderLight}) => (
  <View style={{height, borderRadius: height / 2, backgroundColor: bg, overflow: 'hidden'}}>
    <View style={{height, borderRadius: height / 2, backgroundColor: color, width: `${Math.min(Math.max(progress * 100, 0), 100)}%`}} />
  </View>
);

// ──────────────────────────────────────────────
// Tab content components
// ──────────────────────────────────────────────

const AyuIntelTab = ({ls}) => {
  const ayu = ls.ayu;
  const hist = ls.prog.hist;
  const trendData = hist.map(h => h.v);
  const trendDates = hist.map(h => h.dt);

  return (
    <View style={{gap: vs(12)}}>
      {/* Ayu Analysis Card */}
      <View style={[sty.analysisCard, {backgroundColor: '#064e3b', overflow: 'hidden'}]}>
        <View style={{position: 'absolute', top: -30, right: -30, width: ms(110), height: ms(110), borderRadius: ms(55), backgroundColor: 'rgba(216,90,48,0.12)'}} />
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(9), marginBottom: vs(8), zIndex: 1}}>
          <View style={{width: ms(28), height: ms(28), borderRadius: ms(8), backgroundColor: '#D85A30', alignItems: 'center', justifyContent: 'center'}}>
            <AppText style={{fontSize: ms(14)}}>🧠</AppText>
          </View>
          <AppText variant="caption" color={Colors.white} style={{fontWeight: '700', flex: 1}}>Ayu's Analysis — {ls.name}</AppText>
          <View style={[sty.urgencyBadge, {backgroundColor: ayu.urgency === 'high' ? 'rgba(220,38,38,0.25)' : ayu.urgency === 'medium' ? 'rgba(217,119,6,0.25)' : 'rgba(22,163,74,0.25)', borderColor: 'transparent'}]}>
            <AppText variant="small" color={ayu.urgency === 'high' ? '#fca5a5' : ayu.urgency === 'medium' ? '#fcd34d' : '#86efac'} style={{fontWeight: '700', fontSize: ms(9)}}>
              {ayu.urgency === 'high' ? 'Urgent' : ayu.urgency === 'medium' ? 'Watch' : 'Healthy'}
            </AppText>
          </View>
        </View>
        <AppText variant="caption" color="rgba(255,255,255,0.82)" style={{lineHeight: ms(19), marginBottom: vs(10), zIndex: 1}}>{ayu.narrative}</AppText>
        {ayu.corrs.length > 0 && (
          <View style={{marginTop: vs(6), gap: vs(6), zIndex: 1}}>
            {ayu.corrs.map((c, i) => (
              <View key={i} style={sty.correlationCard}>
                <AppText variant="small" color="rgba(255,255,255,0.45)" style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, fontSize: ms(8), marginBottom: vs(3)}}>{'\uD83D\uDD17 '}{c.lbl}</AppText>
                <AppText variant="caption" color="rgba(255,255,255,0.88)" style={{lineHeight: ms(17)}}>{c.val}</AppText>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Trend Chart */}
      <View style={sty.card}>
        <AppText variant="body" style={{fontWeight: '700', marginBottom: vs(4)}}>{ls.name} Trend</AppText>
        <AppText variant="small" color={Colors.textTertiary} style={{marginBottom: vs(4)}}>{ls.prog.histLabel}</AppText>
        <TrendChart data={trendData} dates={trendDates} refLow={ls.prog.primary.lo} refHigh={ls.prog.primary.hi} color={ls.col} width={SCREEN_W - s(48)} />
      </View>

      {/* Timeline - Without Intervention */}
      {ls.cluster.timeline && ls.cluster.timeline.length > 0 && (
        <View style={[sty.card, {borderColor: 'rgba(249,115,22,0.2)'}]}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(10)}}>
            <View style={{width: ms(26), height: ms(26), borderRadius: ms(8), backgroundColor: '#FFF7ED', alignItems: 'center', justifyContent: 'center'}}>
              <AppText style={{fontSize: ms(13)}}>⏱️</AppText>
            </View>
            <AppText variant="body" style={{fontWeight: '700', color: '#C2410C'}}>Timeline — Without Intervention</AppText>
          </View>
          {ls.cluster.timeline.map((t, i) => (
            <View key={i} style={{flexDirection: 'row', marginBottom: i < ls.cluster.timeline.length - 1 ? vs(2) : 0}}>
              <View style={{alignItems: 'center', width: s(20)}}>
                <View style={{width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: t.col, zIndex: 1}} />
                {i < ls.cluster.timeline.length - 1 && <View style={{width: 2, flex: 1, backgroundColor: Colors.borderLight, marginVertical: vs(2)}} />}
              </View>
              <View style={{flex: 1, marginLeft: s(8), paddingBottom: vs(12)}}>
                <AppText variant="caption" style={{fontWeight: '700'}} color={t.col}>{t.time}</AppText>
                <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(16)}}>{t.event}</AppText>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* About */}
      <View style={sty.card}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(6)}}>
          <View style={{width: ms(26), height: ms(26), borderRadius: ms(8), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center'}}>
            <AppText style={{fontSize: ms(13)}}>💡</AppText>
          </View>
          <AppText variant="body" style={{fontWeight: '700'}}>{ls.name}</AppText>
        </View>
        <AppText variant="caption" color={Colors.textSecondary} style={{lineHeight: ms(18)}}>{ls.insight.desc}</AppText>
      </View>

      {/* Symptoms */}
      {ls.insight.symp.length > 0 && (
        <View style={sty.card}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(8)}}>
            <View style={{width: ms(26), height: ms(26), borderRadius: ms(8), backgroundColor: '#FEF3C7', alignItems: 'center', justifyContent: 'center'}}>
              <AppText style={{fontSize: ms(13)}}>⚠️</AppText>
            </View>
            <AppText variant="body" style={{fontWeight: '700', color: '#D97706'}}>Symptoms</AppText>
          </View>
          {ls.insight.symp.map((sym, i) => (
            <View key={i} style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(6)}}>
              <View style={{width: ms(6), height: ms(6), borderRadius: ms(3), backgroundColor: Colors.amber, marginTop: ms(5), marginRight: s(8)}} />
              <AppText variant="caption" color={Colors.textSecondary} style={{flex: 1, lineHeight: ms(17)}}>{sym}</AppText>
            </View>
          ))}
        </View>
      )}

      {/* Causes */}
      {ls.insight.causes.length > 0 && (
        <View style={[sty.card, {borderColor: 'rgba(220,38,38,0.15)'}]}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(8)}}>
            <View style={{width: ms(26), height: ms(26), borderRadius: ms(8), backgroundColor: '#FEF2F2', alignItems: 'center', justifyContent: 'center'}}>
              <AppText style={{fontSize: ms(13)}}>🔴</AppText>
            </View>
            <AppText variant="body" style={{fontWeight: '700', color: '#DC2626'}}>Causes</AppText>
          </View>
          {ls.insight.causes.map((cause, i) => (
            <View key={i} style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(6)}}>
              <View style={{width: ms(6), height: ms(6), borderRadius: ms(3), backgroundColor: Colors.red, marginTop: ms(5), marginRight: s(8)}} />
              <AppText variant="caption" color={Colors.textSecondary} style={{flex: 1, lineHeight: ms(17)}}>{cause}</AppText>
            </View>
          ))}
        </View>
      )}

      {/* Monthly Log */}
      <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8}}>Monthly Log</AppText>
      {hist.map((h, i) => {
        const col = h.st === 'n' ? '#16A34A' : h.st === 'h' ? '#DC2626' : '#D97706';
        const bg = h.st === 'n' ? '#F0FDF4' : h.st === 'h' ? '#FEF2F2' : '#FEF3C7';
        const lbl = h.st === 'n' ? 'On Track' : h.st === 'h' ? 'Above Target' : 'Below Target';
        return (
          <View key={i} style={sty.visitCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
                <View style={{width: ms(38), height: ms(38), borderRadius: ms(10), backgroundColor: bg, alignItems: 'center', justifyContent: 'center'}}>
                  <AppText style={{fontSize: ms(14), fontWeight: '700', fontFamily: 'monospace', color: col}}>{i + 1}</AppText>
                  <AppText style={{fontSize: ms(8), fontWeight: '600', color: col, marginTop: vs(1)}}>Month</AppText>
                </View>
                <View>
                  <AppText variant="body" style={{fontWeight: '700'}}>{h.dt}</AppText>
                  <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(1)}}>Monthly average</AppText>
                </View>
              </View>
              <View style={[sty.pill, {backgroundColor: bg}]}>
                <AppText variant="small" color={col} style={{fontWeight: '700'}}>{lbl}</AppText>
              </View>
            </View>
            <View style={{height: 0.5, backgroundColor: '#f0f4f2', marginVertical: vs(8)}} />
            <View style={{flexDirection: 'row'}}>
              <View style={{flex: 1}}>
                <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: ms(8)}}>{ls.prog.primary.lbl}</AppText>
                <AppText style={{fontSize: ms(15), fontWeight: '700', fontFamily: 'monospace', color: col, marginTop: vs(2)}}>{h.v} {ls.prog.primary.unit}</AppText>
              </View>
              <View style={{flex: 1, alignItems: 'center'}}>
                <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: ms(8)}}>Target</AppText>
                <AppText style={{fontSize: ms(9), color: Colors.textTertiary, marginTop: vs(4)}}>{ls.prog.primary.lo}–{ls.prog.primary.hi} {ls.prog.primary.unit}</AppText>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: ms(8)}}>Status</AppText>
                <AppText style={{fontSize: ms(12), fontWeight: '700', color: col, marginTop: vs(2)}}>{lbl}</AppText>
              </View>
            </View>
          </View>
        );
      })}
    </View>
  );
};

const ProgressionTab = ({ls}) => {
  const p = ls.prog;
  const pv = p.primary.val, plo = p.primary.lo, phi = p.primary.hi;
  let rpct;
  if (pv < plo) rpct = Math.max(3, (pv / plo) * 70);
  else rpct = Math.max(3, Math.min(97, ((pv - plo) / (phi - plo || 1)) * 100));

  const panelBgs = [
    {bg: '#F0FDFA', fill: '#0D9488'},
    {bg: '#F5F3FF', fill: '#7C3AED'},
    {bg: '#EFF6FF', fill: '#1D4ED8'},
  ];

  const hist = p.hist;
  const trendData = hist.map(h => h.v);
  const trendDates = hist.map(h => h.dt);

  return (
    <View style={{gap: vs(12)}}>
      {/* Current Position Bar */}
      <View style={sty.card}>
        <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: vs(8)}}>Current position in range</AppText>
        <View style={{height: ms(8), borderRadius: ms(4), backgroundColor: '#E2E8F0', overflow: 'hidden', position: 'relative'}}>
          <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(13,148,136,0.12)'}} />
        </View>
        <View style={{position: 'absolute', left: s(14) + (SCREEN_W - s(56)) * Math.max(0.03, Math.min(0.97, rpct / 100)), top: vs(28), zIndex: 2}}>
          <View style={{width: ms(16), height: ms(16), borderRadius: ms(8), backgroundColor: p.primary.col, borderWidth: 3, borderColor: Colors.white, elevation: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.2, shadowRadius: 3}} />
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(10)}}>
          <AppText variant="small" color={Colors.textTertiary}>Low</AppText>
          <AppText variant="small" color={Colors.teal} style={{fontWeight: '600'}}>Target: {plo}–{phi} {p.primary.unit}</AppText>
          <AppText variant="small" color={Colors.textTertiary}>High</AppText>
        </View>
      </View>

      {/* Score Breakdown */}
      <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8}}>Score breakdown</AppText>
      {p.panels.map((panel, idx) => {
        const pb = panelBgs[idx] || panelBgs[0];
        return (
          <View key={idx} style={[sty.scorePanel, {backgroundColor: pb.bg}]}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(7)}}>
              <AppText variant="small" color={panel.lbl_col} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8}}>{panel.lbl}</AppText>
              <AppText style={{fontSize: ms(20), lineHeight: ms(24), fontWeight: '700', color: panel.score_col, fontFamily: 'monospace'}}>{panel.score}</AppText>
            </View>
            <ProgressBar progress={panel.bar / 100} color={pb.fill} height={5} bg="rgba(0,0,0,0.08)" />
            <View style={{flexDirection: 'row', marginTop: vs(6)}}>
              <View style={[sty.pill, {backgroundColor: panel.badge_col + '18'}]}>
                <AppText variant="small" color={panel.badge_col} style={{fontWeight: '700'}}>{panel.badge}</AppText>
              </View>
            </View>
            <AppText variant="caption" color="#334155" style={{marginTop: vs(6), lineHeight: ms(17)}}>{panel.detail}</AppText>
          </View>
        );
      })}

      {/* Historical trend */}
      <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8}}>Historical trend</AppText>
      <View style={sty.card}>
        <AppText variant="body" style={{fontWeight: '700', marginBottom: vs(4)}}>{p.histLabel}</AppText>
        <TrendChart data={trendData} dates={trendDates} refLow={plo} refHigh={phi} color={p.primary.col} width={SCREEN_W - s(48)} />
      </View>

      {/* Measurement History Table */}
      <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8}}>Measurement history</AppText>
      <View style={sty.card}>
        <View style={sty.tableRow}>
          {['Date', 'Value', '\u0394', 'Status'].map(h => (
            <AppText key={h} variant="small" color={Colors.textTertiary} style={{fontWeight: '600', flex: h === 'Date' ? 1.2 : 1, textAlign: h === 'Date' ? 'left' : 'center'}}>{h}</AppText>
          ))}
        </View>
        {hist.map((h, i) => {
          const prev = hist[i + 1];
          const delta = prev ? +(h.v - prev.v).toFixed(1) : null;
          const ds = delta === null ? '\u2014' : (delta >= 0 ? '+' : '') + delta;
          const col = h.st === 'n' ? '#16A34A' : h.st === 'h' ? '#DC2626' : '#D97706';
          const bg = h.st === 'n' ? '#F0FDF4' : h.st === 'h' ? '#FEF2F2' : '#FEF3C7';
          const lbl = h.st === 'n' ? 'On Track' : h.st === 'h' ? 'Above' : 'Below';
          return (
            <View key={i} style={[sty.tableRow, {backgroundColor: i % 2 === 0 ? Colors.background : Colors.white}]}>
              <AppText variant="small" style={{flex: 1.2, color: '#888'}}>{h.dt}</AppText>
              <AppText variant="small" style={{flex: 1, textAlign: 'center', fontWeight: '700', color: col}}>{h.v} {p.primary.unit}</AppText>
              <AppText variant="small" style={{flex: 1, textAlign: 'center'}} color={delta === null ? '#888' : delta > 0 ? Colors.red : Colors.teal}>{ds}</AppText>
              <View style={{flex: 1, alignItems: 'center'}}>
                <View style={[sty.pill, {backgroundColor: bg, paddingHorizontal: s(6), paddingVertical: vs(1)}]}>
                  <AppText variant="small" color={col} style={{fontWeight: '600', fontSize: ms(8)}}>{lbl}</AppText>
                </View>
              </View>
            </View>
          );
        })}
      </View>
    </View>
  );
};

const OrgansTab = ({ls}) => {
  const organs = ls.organs || [];
  if (organs.length === 0) return <View style={sty.card}><AppText variant="body" color={Colors.textTertiary} style={{textAlign: 'center', paddingVertical: vs(20)}}>No organ impact data available yet.</AppText></View>;

  return (
    <View style={{gap: vs(12)}}>
      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(8)}}>
        {organs.map((org, i) => {
          const sevColor = org.sev > 50 ? Colors.red : org.sev > 30 ? Colors.amber : Colors.teal;
          const trend = org.sev > 50 ? '\u2191 Worsening' : '\u2192 Stable';
          return (
            <View key={i} style={sty.organGridCard}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(6)}}>
                <View>
                  <AppText variant="body" style={{fontWeight: '700'}}>{org.n}</AppText>
                  <AppText variant="small" color={org.c} style={{fontWeight: '600', marginTop: vs(1)}}>{org.stage}</AppText>
                </View>
                <AppText style={{fontSize: ms(16), fontWeight: '700', fontFamily: 'monospace', color: org.c}}>{org.sev}<AppText style={{fontSize: ms(11), opacity: 0.5}}>/100</AppText></AppText>
              </View>
              <View style={{marginBottom: vs(4)}}>
                <ProgressBar progress={org.sev / 100} color={org.c} height={5} />
              </View>
              <AppText variant="small" color={Colors.textTertiary}>{trend}</AppText>
            </View>
          );
        })}
      </View>
      {organs.map((org, i) => (
        <View key={i} style={sty.card}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(6)}}>
            <View style={{width: ms(28), height: ms(28), borderRadius: ms(8), backgroundColor: org.c + '15', alignItems: 'center', justifyContent: 'center'}}>
              <Icon family="Ionicons" name={ORGAN_ICON_MAP[org.n] || 'body-outline'} size={14} color={org.c} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="body" style={{fontWeight: '700'}}>{org.n}</AppText>
              <AppText variant="small" color={org.c} style={{fontWeight: '600'}}>{org.stage}</AppText>
            </View>
          </View>
          <AppText variant="caption" color={Colors.textSecondary} style={{lineHeight: ms(17)}}>{org.impact}</AppText>
        </View>
      ))}
    </View>
  );
};

const ClusterTab = ({ls}) => {
  const cl = ls.cluster;
  if (!cl || !cl.name) return <View style={sty.card}><AppText variant="body" color={Colors.textTertiary} style={{textAlign: 'center', paddingVertical: vs(20)}}>No cluster data available yet.</AppText></View>;

  const riskNum = parseInt((cl.risk || '0').replace('%', ''), 10);

  return (
    <View style={{gap: vs(12)}}>
      <View style={sty.card}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'}}>
          <View style={{flex: 1, marginRight: s(12)}}>
            <AppText variant="body" style={{fontWeight: '800', fontSize: ms(15)}}>{cl.name}</AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(4), lineHeight: ms(17)}}>{cl.desc}</AppText>
          </View>
          <View style={{alignItems: 'center'}}>
            <AppText style={{fontSize: ms(28), fontWeight: '900', color: riskNum > 60 ? Colors.red : riskNum > 40 ? Colors.amber : Colors.teal}}>{cl.risk}</AppText>
            <AppText variant="small" color={Colors.textTertiary}>Risk Score</AppText>
          </View>
        </View>
      </View>

      {cl.diseases && cl.diseases.length > 0 && (
        <View style={sty.card}>
          <AppText variant="body" style={{fontWeight: '700', marginBottom: vs(10)}}>Disease Progression</AppText>
          {cl.diseases.map((d, i) => {
            const barColor = d.p > 50 ? Colors.red : d.p > 30 ? Colors.amber : Colors.teal;
            const typeLabel = d.type === 'active' ? 'Active' : d.type === 'emerging' ? 'Emerging' : 'Watch Zone';
            const typeBg = d.type === 'active' ? Colors.redBg : d.type === 'emerging' ? Colors.amberBg : Colors.blueBg;
            const typeColor = d.type === 'active' ? Colors.redText : d.type === 'emerging' ? Colors.amberText : Colors.blueText;
            return (
              <View key={i} style={{marginBottom: vs(10)}}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(4)}}>
                  <AppText variant="caption" style={{fontWeight: '600'}}>{d.n}</AppText>
                  <View style={[sty.pill, {backgroundColor: typeBg}]}><AppText variant="small" color={typeColor} style={{fontWeight: '700', fontSize: ms(8)}}>{typeLabel}</AppText></View>
                </View>
                <ProgressBar progress={d.p / 100} color={barColor} height={5} />
                <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2), textAlign: 'right'}}>{d.p}%</AppText>
              </View>
            );
          })}
        </View>
      )}

      {cl.timeline && cl.timeline.length > 0 && (
        <View style={sty.card}>
          <AppText variant="body" style={{fontWeight: '700', marginBottom: vs(10)}}>Progression Timeline</AppText>
          {cl.timeline.map((t, i) => (
            <View key={i} style={{flexDirection: 'row', marginBottom: i < cl.timeline.length - 1 ? vs(2) : 0}}>
              <View style={{alignItems: 'center', width: s(16)}}>
                <View style={{width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: t.col, zIndex: 1}} />
                {i < cl.timeline.length - 1 && <View style={{width: 2, flex: 1, backgroundColor: Colors.borderLight, marginVertical: vs(2)}} />}
              </View>
              <View style={{flex: 1, marginLeft: s(8), paddingBottom: vs(12)}}>
                <AppText variant="caption" style={{fontWeight: '700'}} color={t.col}>{t.time}</AppText>
                <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(16)}}>{t.event}</AppText>
              </View>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

const CareTab = ({ls}) => {
  const care = ls.care;
  const actions = ls.actions;

  return (
    <View style={{gap: vs(12)}}>
      {actions && actions.length > 0 && (
        <View style={{gap: vs(8)}}>
          <AppText variant="body" style={{fontWeight: '700'}}>Recommended Actions</AppText>
          {actions.map((a, i) => {
            const ac = a.pri === 'high' ? '#EF4444' : '#F59E0B';
            return (
              <View key={i} style={[sty.card, {borderLeftWidth: 2.5, borderLeftColor: ac}]}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(6)}}>
                  <View style={{width: ms(34), height: ms(34), borderRadius: ms(10), backgroundColor: ac + '15', alignItems: 'center', justifyContent: 'center'}}>
                    <Icon family="Ionicons" name={a.ico} size={16} color={ac} />
                  </View>
                  <View style={{flex: 1}}>
                    <AppText variant="body" style={{fontWeight: '700'}}>{a.title}</AppText>
                  </View>
                  <View style={[sty.pill, {backgroundColor: ac + '18'}]}>
                    <AppText variant="small" color={ac} style={{fontWeight: '700', fontSize: ms(8)}}>{a.pri === 'high' ? 'High' : 'Medium'}</AppText>
                  </View>
                </View>
                <AppText variant="caption" color={Colors.textSecondary} style={{lineHeight: ms(17)}}>{a.desc}</AppText>
              </View>
            );
          })}
        </View>
      )}

      <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8}}>Treatment</AppText>
      {care.treat && care.treat.length > 0 && (
        <View style={[sty.card, {borderColor: '#D1FAE5'}]}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(8)}}>
            <View style={{width: ms(26), height: ms(26), borderRadius: ms(8), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center'}}>
              <AppText style={{fontSize: ms(13)}}>📋</AppText>
            </View>
            <AppText variant="body" color={Colors.tealText} style={{fontWeight: '700'}}>Treatment plan</AppText>
          </View>
          {care.treat.map((step, i) => (
            <View key={i} style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(8)}}>
              <View style={{width: ms(22), height: ms(22), borderRadius: ms(7), backgroundColor: '#0a5c47', alignItems: 'center', justifyContent: 'center', marginRight: s(8)}}>
                <AppText variant="small" color={Colors.white} style={{fontWeight: '800'}}>{i + 1}</AppText>
              </View>
              <AppText variant="caption" color={Colors.textSecondary} style={{flex: 1, lineHeight: ms(17), marginTop: vs(2)}}>{step}</AppText>
            </View>
          ))}
        </View>
      )}

      {care.prev ? (
        <View style={[sty.card, {backgroundColor: 'rgba(10,92,71,0.04)', borderColor: 'rgba(10,92,71,0.15)'}]}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(6)}}>
            <Icon family="Ionicons" name="shield-checkmark-outline" size={16} color={Colors.tealText} />
            <AppText variant="body" color={Colors.tealText} style={{fontWeight: '700'}}>Prevention</AppText>
          </View>
          <AppText variant="caption" color={Colors.tealText} style={{lineHeight: ms(17), opacity: 0.85}}>{care.prev}</AppText>
        </View>
      ) : null}
    </View>
  );
};

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const LifestyleDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const {lifestyleId} = route.params || {};

  const [activeTab, setActiveTab] = useState('ayuIntel');

  const ls = useMemo(() => {
    return LIFESTYLE_DATA[lifestyleId] || LIFESTYLE_DATA.nutrition;
  }, [lifestyleId]);

  const metricCards = useMemo(() => {
    return ls.hdr.map(h => ({label: h.lbl, value: h.val, sub: h.unit, color: h.col}));
  }, [ls]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ayuIntel':
        return <AyuIntelTab ls={ls} />;
      case 'progression':
        return <ProgressionTab ls={ls} />;
      case 'organs':
        return <OrgansTab ls={ls} />;
      case 'cluster':
        return <ClusterTab ls={ls} />;
      case 'care':
        return <CareTab ls={ls} />;
      default:
        return <AyuIntelTab ls={ls} />;
    }
  };

  return (
    <View style={sty.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={[sty.header, {paddingTop: insets.top + vs(10)}]}>
        <View style={sty.topBar}>
          <TouchableOpacity style={sty.backBtn} activeOpacity={0.7} onPress={() => navigation.goBack()}>
            <Icon family="Ionicons" name="chevron-back" size={16} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="small" color="rgba(255,255,255,0.38)" style={{marginBottom: vs(2)}}>{ls.cat} · Ayu Intel</AppText>
            <AppText style={{fontSize: ms(17), fontWeight: '800', color: Colors.white}}>{ls.name}</AppText>
            <AppText variant="caption" color="rgba(255,255,255,0.45)" style={{marginTop: vs(2)}}>Lifestyle · March 2026 · Priya Reddy</AppText>
          </View>
        </View>

        {/* Metric cards row */}
        <View style={sty.metricRow}>
          {metricCards.map((m, i) => (
            <View key={i} style={[sty.metricCard, {borderLeftColor: m.color}]}>
              <AppText variant="small" color="rgba(255,255,255,0.38)" style={{marginBottom: vs(3), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: ms(8)}}>{m.label}</AppText>
              <AppText style={{fontSize: ms(14), fontWeight: '700', color: m.color || Colors.white, fontFamily: 'monospace', lineHeight: ms(18)}}>{m.value}</AppText>
              {m.sub ? <AppText variant="small" color="rgba(255,255,255,0.4)" style={{marginTop: vs(2), fontSize: ms(8)}}>{m.sub}</AppText> : null}
            </View>
          ))}
        </View>
      </View>

      {/* Tabs */}
      <View style={sty.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={sty.tabScroll}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity key={tab.key} style={[sty.tab, isActive && sty.tabActive]} activeOpacity={0.7} onPress={() => setActiveTab(tab.key)}>
                <AppText variant="small" color={isActive ? Colors.accent : 'rgba(255,255,255,0.4)'} style={{fontWeight: '700', fontSize: ms(10)}}>{tab.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={sty.scroll} contentContainerStyle={sty.scrollContent} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
      </ScrollView>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const sty = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingBottom: vs(8), paddingHorizontal: s(14)},
  topBar: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(12)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2), marginTop: vs(2)},
  metricRow: {flexDirection: 'row', gap: s(6), marginBottom: vs(12)},
  metricCard: {flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: ms(9), paddingVertical: vs(7), paddingHorizontal: s(7), borderLeftWidth: 2.5},
  tabContainer: {backgroundColor: Colors.primary, flexDirection: 'row'},
  tabScroll: {paddingHorizontal: s(10)},
  tab: {paddingHorizontal: s(11), paddingVertical: vs(9), borderBottomWidth: 2.5, borderBottomColor: 'transparent'},
  tabActive: {borderBottomColor: Colors.accent},
  scroll: {flex: 1},
  scrollContent: {padding: s(12), paddingBottom: vs(30)},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, padding: s(14)},
  visitCard: {backgroundColor: Colors.white, borderRadius: ms(13), borderWidth: 0.5, borderColor: Colors.borderLight, padding: s(12)},
  analysisCard: {borderRadius: ms(14), padding: s(13), position: 'relative'},
  correlationCard: {backgroundColor: 'rgba(255,255,255,0.07)', borderRadius: ms(9), paddingVertical: vs(8), paddingHorizontal: s(10), borderLeftWidth: 2.5, borderLeftColor: '#D85A30'},
  scorePanel: {borderRadius: ms(11), padding: s(11)},
  organGridCard: {width: (SCREEN_W - s(32)) / 2, backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, padding: s(10)},
  pill: {paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(8)},
  urgencyBadge: {flexDirection: 'row', alignItems: 'center', alignSelf: 'flex-start', paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(8), borderWidth: 0.5},
  tableRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(6), paddingHorizontal: s(4), borderRadius: ms(4)},
});

export default LifestyleDetailScreen;
