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
import {AyuIntelPanel, OverviewPanel, TrendsPanel, PatternsPanel} from './GlucoseAyuIntelScreen';
import {BPOverviewPanel, BPTrendsPanel, BPPatternsPanel} from './BPAyuIntelScreen';
import {HROverviewPanel, HRTrendsPanel, HRPatternsPanel} from './HRAyuIntelScreen';
import {WeightOverviewPanel, WeightMeasurementsPanel, WeightPeerGroupPanel, WeightConditionsPanel, WeightPatternsPanel} from './WeightAyuIntelScreen';
import {TempOverviewPanel, TempTrendsPanel, TempConditionsPanel} from './TempAyuIntelScreen';
import {AsthmaOverviewPanel, AsthmaTriggersPanel, AsthmaConditionsPanel, AsthmaPatternsPanel} from './AsthmaAyuIntelScreen';
import {MigraineOverviewPanel, MigraineTriggersPanel, MigraineConditionsPanel, MigrainePatternsPanel} from './MigraineAyuIntelScreen';
import {AnemiaOverviewPanel, AnemiaIronB12Panel, AnemiaConditionsPanel, AnemiaDietPanel} from './AnemiaAyuIntelScreen';

const {width: SCREEN_W} = Dimensions.get('window');

// ──────────────────────────────────────────────
// SYMPTOMS DETAIL DATA (embedded per screen)
// ──────────────────────────────────────────────

const SYMPTOMS_DATA = {
  glucose: {
    name: 'Blood Glucose',
    cat: 'Glycaemic Monitoring',
    col: '#F59E0B',
    hdr: [
      {lbl: 'Fasting avg', val: '126', unit: 'mg/dL', col: '#DC2626'},
      {lbl: 'Post-meal', val: '~180', unit: 'mg/dL', col: '#DC2626'},
      {lbl: 'Time in range', val: '58%', unit: 'target >70%', col: '#D97706'},
      {lbl: 'Low events', val: '0', unit: '/month', col: '#16A34A'},
    ],
    ayu: {
      urgency: 'high',
      narrative:
        'Priya, your fasting blood glucose of 126 mg/dL is improving \u2014 down 10 mg/dL across March since Metformin 1000mg started. Post-dinner glucose averaging 180 mg/dL is the primary driver. On evenings you took PM Metformin + walked + slept 7h, next-morning FBG averaged 108 mg/dL. On evenings you missed all three, it averaged 138 mg/dL \u2014 a 30 mg/dL swing entirely within your control.',
      corrs: [
        {lbl: 'Post-dinner spikes dominate', val: '78% of above-range readings occur between 8\u201311 PM. Post-dinner walk + PM Metformin could halve these spikes.'},
        {lbl: 'PM Metformin \u2192 FBG', val: 'Each missed PM dose adds +12 mg/dL to next-morning FBG. 13 misses in March.'},
        {lbl: 'Sleep \u2192 FBG', val: 'Sleep <6h: FBG avg 129. Sleep 7h+: FBG avg 114. 15 mg/dL swing from bedtime alone.'},
        {lbl: 'Stress \u2192 FBG', val: 'High-stress Mondays: Tuesday FBG avg +12 mg/dL above weekly average. Cortisol driven.'},
      ],
    },
    insight: {
      desc: 'Blood glucose monitoring combines CGM and home glucometer data. FBG of 126 mg/dL is in diabetic range (>100). Post-meal peaks averaging 180 mg/dL drive HbA1c above target. Time in range of 58% is below the 70% goal. FBG is declining \u2014 W1 avg 131 to W4 avg 121.',
      symp: [
        'Increased morning thirst and dry mouth',
        'Frequent urination especially at night',
        'Fatigue and low energy throughout the day',
        'Post-meal drowsiness and brain fog',
        'Blurred vision on high-glucose mornings',
        'Headaches and difficulty concentrating',
      ],
      causes: [
        'Large dinner carbohydrate portions (3 rotis + rice)',
        'PM Metformin misses (58% adherence \u2014 13 misses)',
        'Poor sleep (5.9h avg) raising cortisol',
        'Post-dinner inactivity \u2014 walk on only 9 of 31 evenings',
        'Stress-cortisol cascade on high-stress days',
      ],
    },
    organs: [
      {n: 'Pancreas', c: '#F59E0B', stage: 'Beta Cell Stress', sev: 55, impact: 'Post-dinner spikes averaging 180 mg/dL force repeated large insulin releases. Beta cells are chronically overworked producing excess insulin.'},
      {n: 'Liver', c: '#06B6D4', stage: 'Hepatic Glucose Output', sev: 48, impact: 'Overnight hepatic glucose release sets the fasting reading. PM Metformin controls this directly \u2014 each miss = +12 mg/dL.'},
      {n: 'Eyes', c: '#8B5CF6', stage: 'Retinopathy Risk', sev: 40, impact: 'Sustained glucose >180 mg/dL damages retinal microvasculature. Post-dinner spikes are the most damaging window.'},
      {n: 'Kidneys', c: '#3B82F6', stage: 'Hyperfiltration', sev: 35, impact: 'Glucose >180 mg/dL causes renal hyperfiltration. Chronic spikes accelerate CKD progression beyond baseline T2DM risk.'},
    ],
    cluster: {
      risk: '72%',
      name: 'Glycaemic Instability Cluster',
      desc: 'Post-dinner glucose spikes are the central driver affecting multiple organ systems simultaneously. Controlling the 8\u201311 PM window is the highest-leverage intervention.',
      diseases: [
        {n: 'T2DM Progression', p: 78, type: 'active'},
        {n: 'Diabetic Retinopathy', p: 42, type: 'emerging'},
        {n: 'Diabetic Nephropathy', p: 35, type: 'watch'},
        {n: 'Peripheral Neuropathy', p: 50, type: 'active'},
      ],
      timeline: [
        {time: 'Now', event: 'FBG 126, post-meal 180 avg. Time in range 58%. March downtrend encouraging.', col: '#EF4444'},
        {time: '1 month', event: 'With PM Metformin + walk: FBG target 115, TIR target 65%.', col: '#F97316'},
        {time: '3 months', event: 'HbA1c retest Jun 2026. Expected 7.3\u20137.5% with current trajectory.', col: '#F59E0B'},
        {time: 'Without change', event: 'FBG 130\u2013140 requiring dose escalation. TIR stays below 60%.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: '15-min Post-Dinner Walk', desc: 'Reduces post-dinner glucose from 196 to 158 mg/dL average. Done on only 9 of 31 March evenings.', pri: 'high', ico: 'walk-outline'},
      {title: 'PM Metformin at 9 PM', desc: 'Each dose = \u221212 mg/dL next-morning FBG. Set non-dismissible alarm.', pri: 'high', ico: 'alarm-outline'},
      {title: 'Reduce Dinner Carb Portion', desc: 'Replace 1 roti with salad. Estimated \u221220 mg/dL post-dinner.', pri: 'high', ico: 'restaurant-outline'},
      {title: 'Weekly FBG Home Check', desc: 'Monday morning glucometer reading tracks Metformin effectiveness.', pri: 'medium', ico: 'analytics-outline'},
    ],
    care: {
      treat: [
        'Metformin 1000mg BD \u2014 improve PM adherence from 58% to >95%',
        'Target FBG: 70\u2013100 mg/dL (current 126, improving)',
        'Target post-meal: <140 mg/dL (current ~180)',
        'Target time in range: >70% (current 58%)',
        'Weekly home FBG monitoring',
      ],
      prev: 'Post-dinner activity, low-GI dinner, PM Metformin adherence, and 7h sleep. Each improvement reduces FBG by 10\u201318 mg/dL independently.',
    },
    prog: {
      primary: {lbl: 'Fasting Glucose', val: 126, lo: 70, hi: 100, unit: 'mg/dL', col: '#F59E0B'},
      panels: [
        {lbl: 'Fasting control', cls: 'tl', score: '126', bar: 45, badge: '\u2193 Improving', badge_col: '#16A34A', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'FBG declining: W1 avg 131 \u2192 W4 avg 121 in March. Metformin 1000mg producing measurable response.'},
        {lbl: 'Post-meal control', cls: 'pu', score: '~180', bar: 30, badge: '\u2191 High', badge_col: '#DC2626', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'Post-dinner glucose avg 180 mg/dL (target <140). Walk days: 158 vs no-walk: 196.'},
        {lbl: 'Time in range', cls: 'bl', score: '58%', bar: 58, badge: '\u2193 Below', badge_col: '#D97706', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: '58% time in range vs 70% target. Post-dinner spikes (8\u201311 PM) are the main window pulling this down.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 132, st: 'h'}, {dt: 'Nov 25', v: 130, st: 'h'}, {dt: 'Dec 25', v: 134, st: 'h'},
        {dt: 'Jan 26', v: 134, st: 'h'}, {dt: 'Feb 26', v: 128, st: 'h'}, {dt: 'Mar 26', v: 126, st: 'h'},
      ],
      histLabel: 'Fasting blood glucose trend (mg/dL)',
    },
  },

  bp: {
    name: 'Blood Pressure',
    cat: 'Cardiovascular',
    col: '#EF4444',
    hdr: [
      {lbl: 'Systolic avg', val: '136', unit: 'mmHg', col: '#D97706'},
      {lbl: 'Diastolic avg', val: '86', unit: 'mmHg', col: '#D97706'},
      {lbl: 'Highest', val: '148/92', unit: 'stress day', col: '#DC2626'},
      {lbl: 'Lowest', val: '124/78', unit: '6k+ steps', col: '#16A34A'},
    ],
    ayu: {
      urgency: 'medium',
      narrative:
        'BP of 136/86 is above the T2DM target of 130/80 but improving. Olmesartan 20mg is producing its effect. BP is activity-dependent \u2014 6,000+ step days average 128/82, low-activity days average 138/90. Sodium excess (2,100 mg/day) is the primary lifestyle factor fighting Olmesartan.',
      corrs: [
        {lbl: 'Activity \u2192 BP', val: '6,000+ step days: BP avg 128/82. Below 4,000 steps: 138/90. 10 mmHg systolic difference from walking alone.'},
        {lbl: 'Sodium \u2192 BP', val: 'At 2,100 mg/day sodium (target <1,500), each 500mg reduction lowers systolic by 2\u20133 mmHg.'},
        {lbl: 'Sleep \u2192 BP', val: 'Sleep <6h adds +4 mmHg systolic vs 7h sleep nights. Nocturnal dipping blunted.'},
        {lbl: 'Medication adherence', val: 'Olmesartan 96% + Amlodipine 100% \u2014 medication is working. Gap is sodium + inactivity.'},
      ],
    },
    insight: {
      desc: 'Blood pressure averaging 136/86 mmHg from home cuff and clinic readings. Above T2DM-specific target of 130/80. Morning avg 138/88 (highest risk window). Evening avg 134/84. Olmesartan started Jan 2026 still in therapeutic onset phase.',
      symp: [
        'Usually asymptomatic \u2014 the silent killer',
        'Occasional morning headaches',
        'Ankle oedema bilateral (Amlodipine side effect)',
        'Reduced exercise tolerance on high-BP days',
        'Elevated resting heart rate on high-stress days',
      ],
      causes: [
        'High sodium diet (2,100 mg/day vs target <1,500)',
        'Physical inactivity \u2014 low-activity days correlate with 138/90',
        'T2DM endothelial dysfunction raising vascular resistance',
        'Stress cortisol elevation (GAD-7: 6)',
        'Sleep deprivation raising nocturnal sympathetic tone',
      ],
    },
    organs: [
      {n: 'Heart', c: '#EF4444', stage: 'Pressure Load', sev: 48, impact: 'Chronic 136/86 adds sustained pressure to the left ventricle. Echo EF 62% currently normal. Window to prevent LVH is still open.'},
      {n: 'Kidneys', c: '#3B82F6', stage: 'Nephropathy Risk', sev: 42, impact: 'HTN is the second most common cause of CKD after T2DM. eGFR 72 \u2014 Olmesartan is key to keeping it stable.'},
      {n: 'Brain', c: '#7C3AED', stage: 'Stroke Risk', sev: 40, impact: 'BP 136/86 raises ischaemic and haemorrhagic stroke risk. Combined with T2DM arterial disease, cerebrovascular risk elevated.'},
      {n: 'Eyes', c: '#8B5CF6', stage: 'Hypertensive Retinopathy', sev: 38, impact: 'HTN causes independent hypertensive retinal changes. Combined with T2DM \u2014 additive damage without annual fundus exam.'},
    ],
    cluster: {
      risk: '58%',
      name: 'Cardiometabolic HTN Cluster',
      desc: 'Hypertension clusters with T2DM, dyslipidaemia, and renal disease \u2014 the classic cardiometabolic quartet.',
      diseases: [
        {n: 'Cardiovascular Disease', p: 50, type: 'emerging'},
        {n: 'Hypertensive Nephropathy', p: 40, type: 'emerging'},
        {n: 'Stroke Risk', p: 35, type: 'watch'},
        {n: 'Hypertensive Retinopathy', p: 30, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: 'BP 136/86 \u2014 above T2DM target. Olmesartan still in onset window.', col: '#F59E0B'},
        {time: '3 months', event: 'With sodium reduction + 8k steps: BP expected 128\u2013130/80.', col: '#F97316'},
        {time: '12 months', event: 'Sustained <130/80: eGFR stabilises, cardiac load normalises.', col: '#F59E0B'},
        {time: 'Without control', event: 'BP stays 136/86+: LVH risk, eGFR decline accelerates.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Cut Sodium Below 1,500 mg/day', desc: 'Remove pickles, papad, processed snacks. These three account for ~800 mg excess.', pri: 'high', ico: 'water-outline'},
      {title: '8,000 Steps Daily', desc: '6k+ step days already show BP 128/82 vs 138/90 on low-activity days.', pri: 'high', ico: 'walk-outline'},
      {title: 'Continue Olmesartan 96%', desc: 'Dual benefit: BP lowering + renal protection. Maintain exemplary adherence.', pri: 'high', ico: 'medkit-outline'},
      {title: 'Weekly BP Self-Monitoring', desc: 'Home BP every Sunday morning after 5 min rest. Track AM and PM readings.', pri: 'medium', ico: 'pulse-outline'},
    ],
    care: {
      treat: [
        'Olmesartan 20mg OD \u2014 continue (96% adherence)',
        'Amlodipine 5mg OD \u2014 continue (100% adherence)',
        'BP target: <130/80 mmHg',
        'Reduce sodium to <1,500 mg/day',
        'Annual echo if BP not at target by Dec 2026',
      ],
      prev: 'Lower carbs, increase activity, reduce sodium, improve sleep. All four are within Priya\u2019s current change agenda.',
    },
    prog: {
      primary: {lbl: 'Systolic BP', val: 136, lo: 100, hi: 130, unit: 'mmHg', col: '#EF4444'},
      panels: [
        {lbl: 'Systolic control', cls: 'tl', score: '136', bar: 55, badge: '\u2191 Above target', badge_col: '#D97706', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'Systolic 136 vs target 130. Olmesartan still in onset phase. Trending down from 142 in Oct 25.'},
        {lbl: 'Activity impact', cls: 'pu', score: '128', bar: 75, badge: '\u2193 On active days', badge_col: '#16A34A', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: '6k+ step days: 128/82. Low-activity: 138/90. 10 mmHg systolic difference from walking alone.'},
        {lbl: 'Medication effect', cls: 'bl', score: '96%', bar: 96, badge: '\u2713 Excellent', badge_col: '#16A34A', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'Olmesartan 96% + Amlodipine 100%. Gap to target is sodium + inactivity, not medication.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 142, st: 'h'}, {dt: 'Nov 25', v: 140, st: 'h'}, {dt: 'Dec 25', v: 139, st: 'h'},
        {dt: 'Jan 26', v: 138, st: 'h'}, {dt: 'Feb 26', v: 137, st: 'h'}, {dt: 'Mar 26', v: 136, st: 'h'},
      ],
      histLabel: 'Systolic BP trend (mmHg)',
    },
  },

  heartRate: {
    name: 'Heart Rate',
    cat: 'Cardiac Monitoring',
    col: '#EF4444',
    hdr: [
      {lbl: 'Resting HR', val: '74', unit: 'bpm', col: '#16A34A'},
      {lbl: 'HRV avg', val: '28', unit: 'ms (low)', col: '#DC2626'},
      {lbl: 'Nocturnal', val: '62', unit: 'bpm', col: '#16A34A'},
      {lbl: 'Max recorded', val: '142', unit: 'bpm', col: '#16A34A'},
    ],
    ayu: {
      urgency: 'medium',
      narrative:
        'Resting HR of 74 bpm is normal. But HRV of 28ms is critically low (target >40ms), reflecting chronic sleep debt, anaemia compensation, and sustained sympathetic activation. Each additional hour of sleep raises HRV by 3\u20135ms. With consistent 7h sleep, HRV target 38\u201342ms is achievable within 8 weeks.',
      corrs: [
        {lbl: 'HRV \u2192 sleep quality', val: 'HRV drops to ~22ms on nights with <5.5h sleep. Each hour of sleep raises HRV by 3\u20135ms.'},
        {lbl: 'Anaemia \u2192 cardiac compensation', val: 'Hb 11.8 forces higher cardiac output. HRV suppression reflects this compensatory workload.'},
        {lbl: 'BP \u2192 cardiac load', val: 'Chronic 136/86 adds 8% extra systolic pressure burden vs target. LVH window still open.'},
        {lbl: 'Activity \u2192 HRV improvement', val: 'Active days show HRV 32\u201334ms vs sedentary days 24\u201326ms. Exercise improves autonomic balance.'},
      ],
    },
    insight: {
      desc: 'Heart rate monitored continuously via Apple Watch. Resting HR 74 bpm is within normal range (60\u2013100). HRV of 28ms is the concerning marker \u2014 well below the 40ms threshold for good cardiac autonomic tone. Nocturnal HR 62 bpm is normal. Active walking HR 118 bpm and max 142 bpm are both appropriate responses.',
      symp: [
        'Palpitations on stairs or fast walking',
        'Occasional chest tightness on high-stress days',
        'Breathlessness on exertion (anaemia + deconditioning)',
        'Reduced exercise capacity (VO\u2082 max 28 mL/kg/min)',
      ],
      causes: [
        'Sleep deprivation (5.9h) suppressing HRV',
        'Anaemia (Hb 11.8) forcing cardiac compensation',
        'HTN 136/86 adding chronic pressure overload',
        'Chronic stress maintaining sympathetic overdrive',
        'LDL 118 + TG 162 \u2014 combined lipid burden',
      ],
    },
    organs: [
      {n: 'Heart', c: '#EF4444', stage: 'HRV Suppressed', sev: 48, impact: 'HRV 28ms reflects chronic sympathetic overdrive from poor sleep, stress, and glycaemic instability. Normal HRV for Priya\u2019s age is 45\u201355ms.'},
      {n: 'Brain', c: '#7C3AED', stage: 'Autonomic Stress', sev: 42, impact: 'Low HRV indicates impaired parasympathetic tone. This manifests as difficulty relaxing, racing thoughts at bedtime, and elevated stress response.'},
      {n: 'Adrenal Glands', c: '#DC2626', stage: 'Cortisol Elevated', sev: 45, impact: 'Chronic HRV suppression reflects sustained cortisol elevation from sleep debt and stress. This directly worsens FBG and BP.'},
    ],
    cluster: {
      risk: '48%',
      name: 'Cardiac Autonomic Cluster',
      desc: 'Low HRV clusters with sleep deprivation, stress, anaemia, and HTN \u2014 all compounding cardiac autonomic dysfunction.',
      diseases: [
        {n: 'Cardiac Autonomic Neuropathy', p: 38, type: 'watch'},
        {n: 'Coronary Artery Disease', p: 45, type: 'emerging'},
        {n: 'LV Hypertrophy', p: 30, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: 'HRV 28ms. Resting HR normal. Echo EF 62% normal. Subclinical risk.', col: '#D97706'},
        {time: '2 months', event: 'With 7h sleep consistently: HRV targets 35\u201338ms.', col: '#F97316'},
        {time: '6 months', event: 'With BP <130/80 + improved Hb: HRV normalises to 40+ms.', col: '#F59E0B'},
        {time: 'Without change', event: 'Sustained low HRV: cardiac autonomic neuropathy risk rises.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: '7h Sleep \u2014 HRV Recovery', desc: 'Sleep is the primary HRV recovery mechanism. Each hour raises HRV 3\u20135ms. Target: 38+ms in 8 weeks.', pri: 'high', ico: 'moon-outline'},
      {title: 'Stress Management', desc: 'HRV responds to parasympathetic activation. 5-min breathing exercises before bed can raise HRV 2\u20133ms acutely.', pri: 'medium', ico: 'happy-outline'},
      {title: 'Fix Anaemia', desc: 'Order iron panel. Correcting Hb from 11.8 to 12.5+ will reduce cardiac compensation and improve HRV.', pri: 'medium', ico: 'medkit-outline'},
    ],
    care: {
      treat: [
        'No cardiac-specific medication needed \u2014 manage sleep, anaemia, BP',
        'Annual ECG as part of T2DM review',
        'HRV tracking via Apple Watch \u2014 weekly trend review',
        'Echo repeat if BP >135/85 persists for 12 months',
      ],
      prev: 'Sleep 7h, control BP <130/80, correct anaemia. HRV will normalise as these drivers improve.',
    },
    prog: {
      primary: {lbl: 'HRV (ms)', val: 28, lo: 40, hi: 60, unit: 'ms', col: '#EF4444'},
      panels: [
        {lbl: 'Autonomic tone', cls: 'tl', score: '28ms', bar: 35, badge: '\u2193 Low', badge_col: '#DC2626', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'HRV 28ms vs target 40\u201355ms. Driven by poor sleep (5.9h), chronic stress, and anaemia.'},
        {lbl: 'Structural', cls: 'pu', score: 'EF 62%', bar: 92, badge: '\u2713 Normal', badge_col: '#16A34A', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'Echo EF 62% normal. ECG NSR. No structural abnormality. Structure is protected.'},
        {lbl: 'Resting HR', cls: 'bl', score: '74 bpm', bar: 74, badge: '\u2713 Normal', badge_col: '#16A34A', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'Resting HR 74 bpm within normal range. Nocturnal 62 bpm. Not tachycardic.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 32, st: 'l'}, {dt: 'Nov 25', v: 30, st: 'l'}, {dt: 'Dec 25', v: 29, st: 'l'},
        {dt: 'Jan 26', v: 30, st: 'l'}, {dt: 'Feb 26', v: 28, st: 'l'}, {dt: 'Mar 26', v: 28, st: 'l'},
      ],
      histLabel: 'HRV trend (ms)',
    },
  },

  weight: {
    name: 'Weight',
    cat: 'Body Composition',
    col: '#F59E0B',
    hdr: [
      {lbl: 'Current', val: '68.8', unit: 'kg', col: '#D97706'},
      {lbl: 'Change', val: '-1.2', unit: 'kg (6 mo)', col: '#16A34A'},
      {lbl: 'BMI', val: '25.0', unit: 'borderline', col: '#D97706'},
      {lbl: 'Waist', val: '86', unit: 'cm', col: '#D97706'},
    ],
    ayu: {
      urgency: 'medium',
      narrative:
        'Priya has lost 1.2 kg over 6 months (70.0 \u2192 68.8 kg) \u2014 a slow but sustainable trajectory. BMI of 25.0 is borderline overweight. Waist circumference of 86 cm exceeds the 80 cm target for Asian women, indicating central adiposity driving insulin resistance. Each 1 kg of weight loss improves FBG by 3\u20135 mg/dL and insulin sensitivity by 5\u20137%. The weight loss is already contributing to her improving FBG trend.',
      corrs: [
        {lbl: 'Weight \u2192 insulin sensitivity', val: 'Each 1 kg lost improves insulin sensitivity by 5\u20137%. The 1.2 kg loss has contributed ~7% improvement in glucose disposal.'},
        {lbl: 'Waist circumference \u2192 NAFLD', val: 'Waist 86 cm (target <80) reflects visceral fat depositing in and around the liver. Grade 1 NAFLD directly driven by central adiposity.'},
        {lbl: 'Activity \u2192 weight trajectory', val: 'Step count up 24% over 6 months is the primary driver of weight loss. Reaching 8k steps would accelerate loss to 0.5 kg/month.'},
        {lbl: 'Carb reduction \u2192 weight', val: 'Reducing carbs from 58% to <50% shifts metabolism from fat storage to fat utilisation. Expected additional 0.3 kg/month loss.'},
      ],
    },
    insight: {
      desc: 'Weight is declining slowly \u2014 1.2 kg over 6 months. BMI 25.0 is at the overweight threshold. Waist circumference 86 cm exceeds the 80 cm Asian female target, reflecting central adiposity that drives insulin resistance, NAFLD, and dyslipidaemia. The trajectory is positive but acceleration is needed.',
      symp: [
        'Difficulty losing weight despite moderate calorie intake (1,720 kcal)',
        'Central weight distribution (waist 86 cm)',
        'Fatigue limiting exercise capacity',
        'Clothes fitting slightly better \u2014 positive motivational signal',
        'Knee pain on high-activity days from body weight',
      ],
      causes: [
        'High carbohydrate diet (58%) promoting fat storage via insulin',
        'Low physical activity \u2014 6,240 steps insufficient for meaningful caloric deficit',
        'Poor sleep (5.9h) elevating cortisol and promoting central fat deposition',
        'Insulin resistance creating a metabolic environment favouring fat storage',
        'Stress-driven cortisol directing fat to visceral compartment',
      ],
    },
    organs: [
      {n: 'Liver', c: '#06B6D4', stage: 'Grade 1 NAFLD', sev: 52, impact: 'Central adiposity is the primary driver of Priya\u2019s Grade 1 NAFLD. Visceral fat releases free fatty acids directly into the portal circulation, overwhelming hepatic fat metabolism.'},
      {n: 'Pancreas', c: '#F59E0B', stage: 'Insulin Resistance', sev: 50, impact: 'Excess visceral fat causes insulin resistance at the receptor level. The pancreas must produce more insulin to achieve the same glucose disposal \u2014 accelerating beta cell exhaustion.'},
      {n: 'Heart', c: '#EF4444', stage: 'Metabolic Load', sev: 40, impact: 'Each kg of excess weight adds cardiac workload. Central adiposity specifically increases arterial stiffness and BP \u2014 contributing to the 136/86 reading.'},
    ],
    cluster: {
      risk: '40%',
      name: 'Central Adiposity Cluster',
      desc: 'Central obesity (waist 86 cm) drives insulin resistance, NAFLD, and dyslipidaemia simultaneously. Weight loss is the single intervention that improves all three.',
      diseases: [
        {n: 'NAFLD Progression', p: 52, type: 'active'},
        {n: 'T2DM Worsening', p: 48, type: 'active'},
        {n: 'Dyslipidaemia', p: 45, type: 'active'},
        {n: 'Cardiovascular Risk', p: 35, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: 'Weight 68.8 kg, BMI 25.0, waist 86 cm. 1.2 kg lost in 6 months. Positive trajectory.', col: '#D97706'},
        {time: '3 months', event: 'With 8k steps + carb reduction: target 67.5 kg. Waist may drop to 84 cm.', col: '#F97316'},
        {time: '12 months', event: 'Target 65 kg, BMI 23.6, waist <82 cm. NAFLD regression possible at this weight.', col: '#F59E0B'},
        {time: 'Without change', event: 'Weight plateaus at 68\u201369 kg. Central adiposity persists. NAFLD stays grade 1.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Increase Steps to 8,000/day', desc: 'Step count increase is the primary driver of current weight loss. Reaching 8k steps adds ~150 kcal/day expenditure.', pri: 'high', ico: 'walk-outline'},
      {title: 'Reduce Carbs to <50%', desc: 'Lowering carb % shifts metabolism toward fat utilisation. Expected additional 0.3 kg/month weight loss.', pri: 'high', ico: 'restaurant-outline'},
      {title: 'Weekly Waist Measurement', desc: 'Waist circumference tracks visceral fat more accurately than weight alone. Measure at navel level every Sunday.', pri: 'medium', ico: 'resize-outline'},
      {title: 'Protein to 25% of Calories', desc: 'Increasing protein from 18% to 25% improves satiety, preserves muscle during weight loss, and improves insulin sensitivity.', pri: 'medium', ico: 'nutrition-outline'},
    ],
    care: {
      treat: [
        'Target weight: 65 kg (BMI 23.6) by Mar 2027',
        'Target waist: <80 cm (currently 86 cm)',
        'Rate: 0.5 kg/month sustainable loss',
        'Nutrition consult for Indian low-GI high-protein meal plan',
        'Monthly weight and waist tracking in TrustLife',
      ],
      prev: 'Sustainable weight loss through dietary modification (carb reduction, protein increase) and increased activity (8k steps). Avoid crash diets \u2014 they worsen metabolic adaptation and rebound weight gain.',
    },
    prog: {
      primary: {lbl: 'Weight', val: 68.8, lo: 55, hi: 65, unit: 'kg', col: '#F59E0B'},
      panels: [
        {lbl: 'Weight trend', cls: 'tl', score: '68.8', bar: 55, badge: '\u2193 Improving', badge_col: '#16A34A', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'Weight declining: 70.0 kg (Oct 25) \u2192 68.8 kg (Mar 26). 1.2 kg lost in 6 months. Slow but sustainable.'},
        {lbl: 'BMI', cls: 'pu', score: '25.0', bar: 60, badge: '\u2192 Borderline', badge_col: '#D97706', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'BMI 25.0 \u2014 at the overweight threshold. Target BMI 23.6 (weight 65 kg). Each kg lost reduces BMI by 0.36.'},
        {lbl: 'Waist', cls: 'bl', score: '86 cm', bar: 45, badge: '\u2191 Above target', badge_col: '#DC2626', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'Waist 86 cm vs target <80 cm for Asian women. Central adiposity driving NAFLD and insulin resistance.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 70.0, st: 'h'}, {dt: 'Nov 25', v: 69.8, st: 'h'}, {dt: 'Dec 25', v: 69.5, st: 'h'},
        {dt: 'Jan 26', v: 69.3, st: 'h'}, {dt: 'Feb 26', v: 69.0, st: 'h'}, {dt: 'Mar 26', v: 68.8, st: 'h'},
      ],
      histLabel: 'Weight trend (kg)',
    },
  },

  temperature: {
    name: 'Temperature',
    cat: 'Vitals',
    col: '#16A34A',
    hdr: [
      {lbl: 'Current', val: '36.6', unit: '\u00b0C', col: '#16A34A'},
      {lbl: 'Range', val: '36.2\u201336.8', unit: '\u00b0C (normal)', col: '#16A34A'},
      {lbl: 'Last fever', val: 'Dec 25', unit: 'URTI episode', col: '#D97706'},
      {lbl: 'Trend', val: 'Stable', unit: 'no concerns', col: '#16A34A'},
    ],
    ayu: {
      urgency: 'low',
      narrative:
        'Temperature is consistently normal at 36.6\u00b0C with a narrow range of 36.2\u201336.8\u00b0C. The only fever recorded in the past 6 months was during the Dec 2025 URTI episode (38.2\u00b0C), which resolved within 3 days. No persistent low-grade fevers, no pattern of temperature elevation. This is a reassuring marker \u2014 no active infection or inflammatory process.',
      corrs: [
        {lbl: 'Dec URTI \u2192 fever', val: 'Single fever episode (38.2\u00b0C) during Dec 2025 URTI. Resolved in 3 days with symptomatic treatment. No recurrence.'},
        {lbl: 'Immune status', val: 'Vit D 18 ng/mL (deficient) combined with poor sleep weakens immune defences. Dec URTI was predictable given these gaps.'},
        {lbl: 'T2DM \u2192 infection risk', val: 'T2DM patients have 2\u20133x higher infection risk. Maintaining glucose control and Vit D repletion are key to prevention.'},
        {lbl: 'Temperature stability', val: 'Consistent 36.2\u201336.8\u00b0C range indicates no chronic inflammation, no occult infection, and normal thermoregulation.'},
      ],
    },
    insight: {
      desc: 'Body temperature is normal and stable. The Dec 2025 URTI episode was the only significant temperature deviation in 6 months. T2DM patients have increased susceptibility to infections \u2014 monitoring temperature alongside glucose helps catch early signs of infection that could destabilise glycaemic control.',
      symp: [
        'No current temperature-related symptoms',
        'Dec 2025: fever, cough, fatigue (URTI \u2014 resolved)',
        'Occasional chills on very poor sleep nights (autonomic)',
      ],
      causes: [
        'Dec 2025 URTI: likely viral, community-acquired',
        'Vit D deficiency (18 ng/mL) weakening immune surveillance',
        'Poor sleep reducing immune cytokine production',
        'T2DM-related immune compromise (neutrophil dysfunction)',
      ],
    },
    organs: [
      {n: 'Immune System', c: '#06B6D4', stage: 'Adequate', sev: 25, impact: 'Temperature stability suggests no active immune challenge. However, Vit D deficiency and poor sleep create latent vulnerability for future infections.'},
    ],
    cluster: {
      risk: '15%',
      name: 'Infection Susceptibility Cluster',
      desc: 'Temperature is normal but underlying immune vulnerability exists from Vit D deficiency, poor sleep, and T2DM immune compromise.',
      diseases: [
        {n: 'Recurrent URTI', p: 30, type: 'watch'},
        {n: 'UTI Risk (T2DM)', p: 25, type: 'watch'},
        {n: 'Pneumonia Risk', p: 20, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: 'Temperature normal. No active infection. Last fever Dec 2025.', col: '#16A34A'},
        {time: '3 months', event: 'With Vit D repletion + 7h sleep: immune resilience improves significantly.', col: '#16A34A'},
        {time: '12 months', event: 'With pneumococcal vaccine + Vit D: infection risk normalised.', col: '#16A34A'},
        {time: 'Without change', event: 'Vit D stays low + poor sleep: another URTI likely within 6\u201312 months.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Continue Vit D Supplementation', desc: 'Vit D 18 ng/mL \u2014 deficient. Continue 60,000 IU weekly for 8 weeks, then maintenance. Supports immune function.', pri: 'medium', ico: 'sunny-outline'},
      {title: 'Pneumococcal Vaccine', desc: 'Overdue for T2DM patients. 3x higher pneumonia risk. Schedule with next clinic visit.', pri: 'medium', ico: 'medkit-outline'},
      {title: 'Monitor for Fever with Illness', desc: 'Any fever >38\u00b0C lasting >48h should prompt medical review \u2014 T2DM patients need earlier antibiotic consideration.', pri: 'low', ico: 'thermometer-outline'},
    ],
    care: {
      treat: [
        'No treatment needed \u2014 temperature is normal',
        'Vit D supplementation for immune support (ongoing)',
        'Annual flu vaccine recommended for T2DM',
        'Pneumococcal vaccine overdue \u2014 schedule',
        'Self-monitoring: check temperature if feeling unwell',
      ],
      prev: 'Vit D repletion, adequate sleep (7h), pneumococcal vaccination, and annual flu vaccine. These four measures significantly reduce infection risk for T2DM patients.',
    },
    prog: {
      primary: {lbl: 'Temperature', val: 36.6, lo: 36.1, hi: 37.2, unit: '\u00b0C', col: '#16A34A'},
      panels: [
        {lbl: 'Current reading', cls: 'tl', score: '36.6\u00b0C', bar: 90, badge: '\u2713 Normal', badge_col: '#16A34A', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'Temperature 36.6\u00b0C \u2014 well within normal range. Stable across all measurements.'},
        {lbl: 'Fever episodes', cls: 'pu', score: '1', bar: 15, badge: '\u2713 Minimal', badge_col: '#16A34A', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'Only 1 fever episode in 6 months (Dec 2025 URTI). No persistent or recurrent fevers.'},
        {lbl: 'Immune readiness', cls: 'bl', score: '70%', bar: 70, badge: '\u2192 Fair', badge_col: '#D97706', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'Vit D deficiency and poor sleep create immune vulnerability despite normal temperature. Pneumococcal vaccine overdue.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 36.5, st: 'n'}, {dt: 'Nov 25', v: 36.6, st: 'n'}, {dt: 'Dec 25', v: 38.2, st: 'h'},
        {dt: 'Jan 26', v: 36.6, st: 'n'}, {dt: 'Feb 26', v: 36.5, st: 'n'}, {dt: 'Mar 26', v: 36.6, st: 'n'},
      ],
      histLabel: 'Temperature trend (\u00b0C)',
    },
  },

  ecg: {
    name: 'ECG',
    cat: 'Cardiac Rhythm',
    col: '#16A34A',
    hdr: [
      {lbl: 'Rhythm', val: 'NSR', unit: 'normal sinus', col: '#16A34A'},
      {lbl: 'QTc', val: '412', unit: 'ms (normal)', col: '#16A34A'},
      {lbl: 'Rate', val: '74', unit: 'bpm', col: '#16A34A'},
      {lbl: 'Last ECG', val: 'Mar 26', unit: 'annual review', col: '#16A34A'},
    ],
    ayu: {
      urgency: 'low',
      narrative:
        'ECG shows normal sinus rhythm with a rate of 74 bpm and QTc of 412ms \u2014 all within normal limits. No arrhythmias, no conduction abnormalities, no ST-segment changes suggesting ischaemia. For a T2DM patient with HTN, this is reassuring. Annual ECG monitoring is recommended as part of the T2DM cardiovascular screening protocol.',
      corrs: [
        {lbl: 'ECG \u2192 structural health', val: 'Normal ECG combined with Echo EF 62% confirms no structural cardiac disease. The heart is electrically and mechanically normal.'},
        {lbl: 'QTc monitoring', val: 'QTc 412ms is normal (<450ms for women). Important to monitor as some T2DM medications can prolong QTc.'},
        {lbl: 'T2DM \u2192 cardiac screening', val: 'Annual ECG recommended for all T2DM patients. Silent ischaemia occurs in 10\u201320% of T2DM patients without symptoms.'},
        {lbl: 'HTN \u2192 LVH screening', val: 'ECG shows no LVH pattern. Consistent with Echo findings. BP control (<130/80) will maintain this normal status.'},
      ],
    },
    insight: {
      desc: 'ECG performed as part of annual T2DM cardiovascular review. Normal sinus rhythm at 74 bpm. QTc 412ms (normal <450ms for women). No ST-T changes. No LVH voltage criteria. No arrhythmia. This is a clean ECG with no abnormalities. Annual repeat recommended.',
      symp: [
        'No cardiac symptoms attributable to rhythm abnormality',
        'Palpitations reported are likely from HRV suppression and anxiety, not arrhythmia',
        'Occasional chest tightness is stress-related, not ischaemic',
      ],
      causes: [
        'No pathological causes \u2014 ECG is normal',
        'Annual screening performed for T2DM cardiovascular risk monitoring',
        'Palpitation symptoms are autonomic (low HRV), not arrhythmic',
      ],
    },
    organs: [
      {n: 'Heart', c: '#16A34A', stage: 'Electrically Normal', sev: 10, impact: 'ECG confirms normal electrical conduction. No evidence of ischaemia, LVH, or arrhythmia. Structure and function preserved.'},
    ],
    cluster: {
      risk: '12%',
      name: 'Cardiac Rhythm Cluster',
      desc: 'ECG is normal. Cardiac rhythm risk is minimal. Annual monitoring sufficient for T2DM cardiovascular screening.',
      diseases: [
        {n: 'Atrial Fibrillation', p: 8, type: 'watch'},
        {n: 'Silent Ischaemia', p: 15, type: 'watch'},
        {n: 'LVH', p: 12, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: 'ECG normal. NSR, QTc 412ms, no LVH. No concerns.', col: '#16A34A'},
        {time: '12 months', event: 'Annual ECG repeat at Mar 2027 T2DM review.', col: '#16A34A'},
        {time: '5 years', event: 'With BP control + glucose control: ECG expected to remain normal.', col: '#16A34A'},
        {time: 'Without BP control', event: 'LVH may develop on ECG if BP remains >135/85 for years.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Annual ECG at T2DM Review', desc: 'Next ECG due Mar 2027. Part of standard cardiovascular screening for T2DM patients.', pri: 'low', ico: 'pulse-outline'},
      {title: 'Report Palpitations if Worsening', desc: 'Current palpitations are autonomic. If they become sustained (>30 min) or associated with dizziness, seek ECG within 24h.', pri: 'low', ico: 'alert-circle-outline'},
      {title: 'Control BP to Prevent LVH', desc: 'LVH develops from chronic BP elevation. Maintaining <130/80 prevents ECG changes over years.', pri: 'medium', ico: 'heart-outline'},
    ],
    care: {
      treat: [
        'No cardiac treatment needed \u2014 ECG is normal',
        'Annual ECG as part of T2DM cardiovascular review',
        'Echo if ECG changes develop or BP remains uncontrolled',
        'Apple Watch ECG for interim monitoring if palpitations recur',
        'QTc monitoring if new medications added',
      ],
      prev: 'Maintain BP <130/80, control glucose, manage lipids. These three measures prevent the ECG changes (LVH, ischaemia) that develop in poorly controlled T2DM.',
    },
    prog: {
      primary: {lbl: 'QTc', val: 412, lo: 350, hi: 450, unit: 'ms', col: '#16A34A'},
      panels: [
        {lbl: 'Rhythm', cls: 'tl', score: 'NSR', bar: 95, badge: '\u2713 Normal', badge_col: '#16A34A', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'Normal sinus rhythm. No arrhythmias detected on 12-lead ECG or Apple Watch tracings.'},
        {lbl: 'QTc interval', cls: 'pu', score: '412ms', bar: 88, badge: '\u2713 Normal', badge_col: '#16A34A', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'QTc 412ms \u2014 well within normal range (<450ms for women). No QT prolongation risk.'},
        {lbl: 'LVH screening', cls: 'bl', score: 'Negative', bar: 95, badge: '\u2713 Normal', badge_col: '#16A34A', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'No LVH voltage criteria on ECG. Consistent with normal Echo EF 62%. BP control is key to maintaining this.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 410, st: 'n'}, {dt: 'Nov 25', v: 412, st: 'n'}, {dt: 'Dec 25', v: 414, st: 'n'},
        {dt: 'Jan 26', v: 411, st: 'n'}, {dt: 'Feb 26', v: 413, st: 'n'}, {dt: 'Mar 26', v: 412, st: 'n'},
      ],
      histLabel: 'QTc trend (ms)',
    },
  },

  menstrual: {
    name: 'Menstrual Cycle',
    cat: 'Reproductive Health',
    col: '#EC4899',
    hdr: [
      {lbl: 'Cycle length', val: '31', unit: 'days avg', col: '#D97706'},
      {lbl: 'Variability', val: '\u00b16', unit: 'days', col: '#DC2626'},
      {lbl: 'Flow', val: 'Moderate', unit: '4\u20135 days', col: '#16A34A'},
      {lbl: 'Glucose rise', val: '+14', unit: 'mg/dL D1\u20133', col: '#DC2626'},
    ],
    ayu: {
      urgency: 'medium',
      narrative:
        'Priya\u2019s menstrual cycle averages 31 days but with \u00b16 days variability (range 25\u201337 days) \u2014 indicating hormonal irregularity. FBG rises +14 mg/dL on menstrual days 1\u20133 due to progesterone withdrawal and prostaglandin release increasing insulin resistance. This predictable glucose rise can be preemptively managed with slightly higher Metformin adherence and reduced carbs during these days.',
      corrs: [
        {lbl: 'Menstrual \u2192 glucose', val: 'FBG rises +14 mg/dL on days 1\u20133 of each cycle. Progesterone withdrawal increases hepatic glucose output and insulin resistance.'},
        {lbl: 'Cycle variability \u2192 hormonal status', val: '\u00b16 days variability suggests suboptimal ovarian function. T2DM and insulin resistance are known disruptors of menstrual regularity.'},
        {lbl: 'Iron loss \u2192 anaemia', val: 'Monthly menstrual blood loss compounds Priya\u2019s borderline anaemia (Hb 11.8). Each cycle loses ~15\u201320 mg iron. Without testing, iron status is unknown.'},
        {lbl: 'Mood \u2192 premenstrual', val: 'PHQ-9 score of 8 may worsen premenstrually. Cycle-aware mood tracking could identify if depression worsens in luteal phase.'},
      ],
    },
    insight: {
      desc: 'Menstrual cycle is present but irregular \u2014 31-day average with \u00b16 days variability. Flow is moderate over 4\u20135 days. The key finding is the +14 mg/dL FBG rise on menstrual days 1\u20133, creating predictable glycaemic instability. Cycle irregularity in a 38-year-old with T2DM warrants hormonal evaluation if it persists.',
      symp: [
        'Irregular cycle timing causing unpredictable menstrual onset',
        'Higher blood glucose readings on days 1\u20133',
        'Increased fatigue and low mood premenstrually',
        'Moderate menstrual cramps managed with OTC analgesics',
        'Heavier flow contributing to iron depletion',
      ],
      causes: [
        'Insulin resistance disrupting ovarian hormone balance',
        'T2DM-related hormonal dysregulation',
        'Stress (GAD-7: 6) affecting hypothalamic-pituitary-ovarian axis',
        'Poor sleep disrupting circadian hormone release',
        'Possible iron deficiency worsening with monthly losses',
      ],
    },
    organs: [
      {n: 'Reproductive', c: '#EC4899', stage: 'Irregular Cycling', sev: 42, impact: 'Cycle variability of \u00b16 days reflects suboptimal ovarian function. Insulin resistance is a known cause of menstrual irregularity \u2014 improving glucose control may normalise cycles.'},
      {n: 'Pancreas', c: '#F59E0B', stage: 'Cyclical Stress', sev: 40, impact: 'Menstrual days 1\u20133 create a predictable +14 mg/dL FBG rise. The pancreas faces cyclical additional demand from hormonal insulin resistance.'},
    ],
    cluster: {
      risk: '35%',
      name: 'Reproductive-Metabolic Cluster',
      desc: 'Menstrual irregularity clusters with insulin resistance and anaemia \u2014 each worsening the other in a bidirectional loop.',
      diseases: [
        {n: 'PCOS/Metabolic Dysfunction', p: 30, type: 'watch'},
        {n: 'Iron Deficiency Anaemia', p: 45, type: 'emerging'},
        {n: 'T2DM Glycaemic Instability', p: 55, type: 'active'},
        {n: 'Premenstrual Mood Worsening', p: 35, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: 'Cycle 31 days \u00b16. FBG +14 mg/dL on days 1\u20133. Iron status unknown.', col: '#D97706'},
        {time: '3 months', event: 'With improved insulin sensitivity: cycle variability may reduce to \u00b13\u20134 days.', col: '#F97316'},
        {time: '6 months', event: 'Iron panel + possible supplementation: anaemia correction supports cycle regularity.', col: '#F59E0B'},
        {time: 'Without change', event: 'Irregularity persists. Monthly glucose disruption continues. Anaemia risk rises.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Cycle-Aware Glucose Management', desc: 'On menstrual days 1\u20133, ensure PM Metformin is taken and reduce dinner carbs. Preemptive management of the +14 mg/dL rise.', pri: 'high', ico: 'calendar-outline'},
      {title: 'Order Iron Panel', desc: 'Monthly menstrual losses + Hb 11.8 + untested iron = critical gap. Serum ferritin, TIBC, and iron saturation needed.', pri: 'high', ico: 'flask-outline'},
      {title: 'Track Cycle in TrustLife', desc: 'Logging cycle dates enables Ayu to correlate glucose, mood, and symptoms with menstrual phase automatically.', pri: 'medium', ico: 'calendar-outline'},
      {title: 'Gynaecology Review if Irregularity Persists', desc: 'If \u00b16 day variability continues >6 months: hormonal evaluation for PCOS or early perimenopause.', pri: 'medium', ico: 'medkit-outline'},
    ],
    care: {
      treat: [
        'Cycle-aware glucose management on days 1\u20133',
        'Iron panel blood test \u2014 priority order',
        'Track menstrual dates and symptoms in TrustLife',
        'Gynaecology referral if irregularity persists >6 months',
        'Improving insulin resistance (weight loss, activity) may normalise cycles',
      ],
      prev: 'Insulin sensitisation through weight loss and activity is the most effective long-term approach to menstrual regularity in T2DM. Iron status monitoring prevents anaemia worsening from monthly losses.',
    },
    prog: {
      primary: {lbl: 'Cycle Length', val: 31, lo: 25, hi: 35, unit: 'days', col: '#EC4899'},
      panels: [
        {lbl: 'Regularity', cls: 'tl', score: '\u00b16 days', bar: 40, badge: '\u2193 Irregular', badge_col: '#DC2626', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'Cycle variability \u00b16 days (range 25\u201337). Target variability: \u00b12\u20133 days. Insulin resistance is a likely driver.'},
        {lbl: 'Glucose impact', cls: 'pu', score: '+14', bar: 45, badge: '\u2191 Elevated', badge_col: '#DC2626', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'FBG rises +14 mg/dL on menstrual days 1\u20133. Predictable and manageable with cycle-aware Metformin adherence.'},
        {lbl: 'Flow', cls: 'bl', score: 'Moderate', bar: 70, badge: '\u2192 Normal', badge_col: '#16A34A', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'Flow moderate over 4\u20135 days. Not excessive but contributes to iron depletion given borderline Hb 11.8.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 29, st: 'n'}, {dt: 'Nov 25', v: 33, st: 'n'}, {dt: 'Dec 25', v: 27, st: 'l'},
        {dt: 'Jan 26', v: 35, st: 'h'}, {dt: 'Feb 26', v: 30, st: 'n'}, {dt: 'Mar 26', v: 31, st: 'n'},
      ],
      histLabel: 'Cycle length trend (days)',
    },
  },

  migraine: {
    name: 'Migraine',
    cat: 'Neurological',
    col: '#7C3AED',
    hdr: [
      {lbl: 'Frequency', val: '3', unit: '/quarter', col: '#D97706'},
      {lbl: 'Duration', val: '6\u20138', unit: 'hours avg', col: '#D97706'},
      {lbl: 'Trigger #1', val: 'Dehydration', unit: '1.4L/day', col: '#DC2626'},
      {lbl: 'Trigger #2', val: 'Stress', unit: 'GAD-7: 6', col: '#D97706'},
    ],
    ayu: {
      urgency: 'medium',
      narrative:
        'Priya experiences 3 migraine episodes per quarter \u2014 averaging one per month. The primary trigger is chronic dehydration (1.4L/day vs 2.5L target). Secondary triggers are stress and poor sleep. Ayu found that 2 of 3 March migraines occurred on days with <1.2L water intake AND sleep <5.5h. Increasing hydration to 2.5L/day alone is projected to eliminate 60\u201370% of episodes.',
      corrs: [
        {lbl: 'Hydration \u2192 migraine', val: 'All 3 quarterly migraines occurred on days with <1.3L water intake. At 1.4L/day average, Priya is chronically dehydrated \u2014 a known migraine trigger.'},
        {lbl: 'Sleep \u2192 migraine', val: '2 of 3 migraines followed nights with <5.5h sleep. Sleep deprivation lowers the migraine threshold, making triggers more potent.'},
        {lbl: 'Stress \u2192 migraine', val: 'GAD-7 score of 6 with high-stress days preceding migraines. Stress \u2192 muscle tension \u2192 reduced cerebral blood flow \u2192 migraine cascade.'},
        {lbl: 'Glucose \u2192 migraine', val: 'Post-meal glucose spikes >180 mg/dL create osmotic shifts that can trigger migraine in susceptible individuals. FBG control may reduce episodes.'},
      ],
    },
    insight: {
      desc: 'Migraine occurs approximately monthly (3/quarter). Episodes last 6\u20138 hours with moderate-to-severe unilateral headache, photophobia, and nausea. The pattern is strongly linked to dehydration, stress, and sleep deprivation \u2014 all modifiable factors. No aura reported. No neurological red flags.',
      symp: [
        'Unilateral throbbing headache lasting 6\u20138 hours',
        'Photophobia and phonophobia during episodes',
        'Nausea, occasionally vomiting',
        'Difficulty working during episodes \u2014 productivity lost',
        'Post-migraine fatigue lasting 12\u201324 hours',
        'Occasional prodromal neck stiffness',
      ],
      causes: [
        'Chronic dehydration \u2014 1.4L/day vs 2.5L target',
        'Poor sleep (5.9h avg) lowering migraine threshold',
        'Stress and anxiety (GAD-7: 6) causing muscle tension',
        'Glucose instability creating osmotic cerebral shifts',
        'Possible hormonal component linked to menstrual cycle',
      ],
    },
    organs: [
      {n: 'Brain', c: '#7C3AED', stage: 'Migraine Susceptibility', sev: 45, impact: 'Chronic dehydration reduces cerebral blood volume. Combined with poor sleep and stress, the migraine threshold is chronically lowered \u2014 requiring smaller triggers to initiate an attack.'},
      {n: 'Kidneys', c: '#3B82F6', stage: 'Dehydration Load', sev: 30, impact: 'At 1.4L/day, kidneys are concentrating urine excessively. This transiently elevates microalbumin readings and reduces renal reserve.'},
    ],
    cluster: {
      risk: '38%',
      name: 'Neurovascular Trigger Cluster',
      desc: 'Migraine clusters with dehydration, sleep deprivation, and stress \u2014 a trio of modifiable triggers that also worsen glucose control.',
      diseases: [
        {n: 'Chronic Migraine', p: 35, type: 'watch'},
        {n: 'Medication Overuse Headache', p: 15, type: 'watch'},
        {n: 'Cerebrovascular Risk', p: 25, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: '3 migraines/quarter. Primary trigger: dehydration (1.4L/day). Secondary: sleep + stress.', col: '#D97706'},
        {time: '1 month', event: 'With 2.5L/day hydration: expected 50\u201360% reduction in episodes.', col: '#F97316'},
        {time: '3 months', event: 'With hydration + 7h sleep + stress management: target <1 migraine/quarter.', col: '#F59E0B'},
        {time: 'Without change', event: 'Monthly migraines continue. Risk of chronification if triggers persist.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Drink 2.5L Water Daily', desc: 'The single most impactful migraine prevention. Set 4 reminders: 10 AM, 1 PM, 4 PM, 7 PM \u2014 2 glasses each. Keep water bottle visible at desk.', pri: 'high', ico: 'water-outline'},
      {title: '7h Sleep for Migraine Prevention', desc: '2 of 3 migraines followed <5.5h sleep. Sleep raises the migraine threshold \u2014 making triggers less potent.', pri: 'high', ico: 'moon-outline'},
      {title: 'Stress Reduction Techniques', desc: '5-min breathing exercises during high-stress periods. Neck stretches every 2 hours at desk. Preventive rather than reactive.', pri: 'medium', ico: 'happy-outline'},
      {title: 'Migraine Diary in TrustLife', desc: 'Log each episode with triggers, duration, and treatment. Enables Ayu to refine trigger identification over time.', pri: 'medium', ico: 'document-text-outline'},
    ],
    care: {
      treat: [
        'Acute: continue current OTC analgesic (paracetamol/ibuprofen) at onset',
        'If >4 episodes/month: consider prophylaxis (amitriptyline or propranolol)',
        'Hydration target: 2.5L/day (currently 1.4L)',
        'Sleep target: 7h minimum',
        'Neurology referral if frequency increases or aura develops',
      ],
      prev: 'Hydration (2.5L/day), adequate sleep (7h), and stress management are the three pillars of migraine prevention. Addressing all three could reduce episodes by 60\u201380%.',
    },
    prog: {
      primary: {lbl: 'Episodes/Quarter', val: 3, lo: 0, hi: 1, unit: 'episodes', col: '#7C3AED'},
      panels: [
        {lbl: 'Frequency', cls: 'tl', score: '3/qtr', bar: 40, badge: '\u2191 Above target', badge_col: '#D97706', lbl_col: '#0F766E', score_col: '#0F766E', detail: '3 episodes per quarter (1/month). Target: <1/quarter. All episodes linked to modifiable triggers.'},
        {lbl: 'Hydration status', cls: 'pu', score: '1.4L', bar: 28, badge: '\u2193 Low', badge_col: '#DC2626', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: '1.4L/day vs 2.5L target \u2014 56% of requirement. Primary migraine trigger. Doubling intake could halve episodes.'},
        {lbl: 'Severity', cls: 'bl', score: 'Moderate', bar: 55, badge: '\u2192 Stable', badge_col: '#D97706', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'Episodes are moderate severity, 6\u20138 hours duration. Responsive to OTC analgesics. No aura. No ER visits.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 3, st: 'h'}, {dt: 'Nov 25', v: 2, st: 'h'}, {dt: 'Dec 25', v: 4, st: 'h'},
        {dt: 'Jan 26', v: 3, st: 'h'}, {dt: 'Feb 26', v: 2, st: 'h'}, {dt: 'Mar 26', v: 3, st: 'h'},
      ],
      histLabel: 'Migraine episodes per quarter trend',
    },
  },

  msk: {
    name: 'Musculoskeletal',
    cat: 'MSK & Neuropathy',
    col: '#DC2626',
    hdr: [
      {lbl: 'Foot tingling', val: '5x', unit: '/month', col: '#DC2626'},
      {lbl: 'Knee pain', val: '4x', unit: '/month', col: '#D97706'},
      {lbl: 'Ankle oedema', val: 'Bilateral', unit: 'Amlodipine', col: '#D97706'},
      {lbl: 'Neuropathy', val: 'Early', unit: 'B12+glucose', col: '#DC2626'},
    ],
    ayu: {
      urgency: 'high',
      narrative:
        'Priya reports foot tingling 5 times in March \u2014 the earliest clinical sign of diabetic peripheral neuropathy. Combined with B12 of 312 pg/mL (borderline) and untested iron, the neuropathy picture is actively evolving. Knee pain (4x/month) limits her ability to increase physical activity \u2014 the single best intervention for all her conditions. Ankle oedema is bilateral, likely an Amlodipine side effect. This triad (neuropathy + knee pain + oedema) is creating a mobility barrier that must be addressed.',
      corrs: [
        {lbl: 'Glucose \u2192 neuropathy', val: 'Post-meal glucose >180 mg/dL damages peripheral nerves via sorbitol accumulation. Each reduction in glucose spikes slows neuropathy progression.'},
        {lbl: 'B12 \u2192 nerve health', val: 'B12 of 312 pg/mL (borderline) + Metformin depleting B12 further. Methylcobalamin 84% adherence is delaying repletion. Target B12 >400.'},
        {lbl: 'Knee pain \u2192 activity barrier', val: 'Knee pain on 4 of 31 days prevents sustained walking. Physiotherapy (3 sessions done) is helping. 3 more sessions recommended.'},
        {lbl: 'Amlodipine \u2192 oedema', val: 'Bilateral ankle oedema is a known CCB side effect. Not dangerous but uncomfortable. Elevating legs 15 min/day reduces it.'},
      ],
    },
    insight: {
      desc: 'Musculoskeletal and neuropathic symptoms are converging to create a mobility barrier. Foot tingling (5x/month) indicates early diabetic peripheral neuropathy. Knee pain (4x/month) limits activity. Ankle oedema (Amlodipine-related) adds discomfort. The combined effect is reduced physical activity, which worsens glucose, BP, weight, and mood \u2014 a vicious cycle.',
      symp: [
        'Foot tingling and numbness \u2014 5 episodes in March',
        'Bilateral ankle oedema \u2014 worse at end of day',
        'Knee pain during walking, stairs, and prolonged standing',
        'Reduced balance and proprioception in feet',
        'Difficulty wearing tight footwear due to oedema',
        'Occasional calf cramping at night',
      ],
      causes: [
        'Diabetic peripheral neuropathy from sustained hyperglycaemia',
        'B12 borderline (312 pg/mL) worsened by Metformin depletion',
        'Amlodipine 5mg causing bilateral ankle oedema',
        'BMI 25 and deconditioning contributing to knee stress',
        'Iron status unknown \u2014 possible contribution to nerve symptoms',
      ],
    },
    organs: [
      {n: 'Nerves', c: '#DC2626', stage: 'Early Neuropathy', sev: 55, impact: 'Foot tingling 5x/month indicates early small-fibre neuropathy. Glucose spikes >180 mg/dL are the primary neurotoxic driver. B12 borderline status compounds nerve damage.'},
      {n: 'Blood Vessels', c: '#EF4444', stage: 'Peripheral Vascular', sev: 42, impact: 'T2DM accelerates peripheral arterial disease. Combined with neuropathy, this creates a high-risk foot. Annual foot exam with monofilament testing is essential.'},
      {n: 'Muscles', c: '#F59E0B', stage: 'Deconditioning', sev: 38, impact: 'Knee pain and oedema limit activity, causing progressive muscle deconditioning. This reduces glucose disposal capacity and accelerates insulin resistance.'},
    ],
    cluster: {
      risk: '58%',
      name: 'Diabetic Neuropathy-Mobility Cluster',
      desc: 'Neuropathy, knee pain, and oedema form a mobility-limiting triad. Reduced mobility worsens glucose, BP, weight, and mood \u2014 creating a cascade.',
      diseases: [
        {n: 'Diabetic Peripheral Neuropathy', p: 55, type: 'active'},
        {n: 'Diabetic Foot Risk', p: 40, type: 'emerging'},
        {n: 'Osteoarthritis Progression', p: 35, type: 'watch'},
        {n: 'Peripheral Vascular Disease', p: 30, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: 'Foot tingling 5x/month. Knee pain 4x/month. Ankle oedema bilateral. Mobility limited.', col: '#EF4444'},
        {time: '3 months', event: 'With B12 repletion + glucose control: tingling episodes expected to halve.', col: '#F97316'},
        {time: '6 months', event: 'With physio + weight loss: knee pain expected <2x/month. Oedema managed.', col: '#F59E0B'},
        {time: 'Without change', event: 'Neuropathy progresses to numbness. Foot ulcer risk rises. Knee pain limits all activity.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Daily Foot Inspection', desc: 'Check feet every evening for cuts, blisters, redness. Early neuropathy means reduced pain sensation \u2014 injuries go unnoticed.', pri: 'high', ico: 'eye-outline'},
      {title: 'Methylcobalamin \u2014 100% Adherence', desc: 'B12 repletion is critical for nerve repair. Current 84% adherence (5 misses) is delaying recovery. Add to evening pill organiser.', pri: 'high', ico: 'medkit-outline'},
      {title: 'Physiotherapy for Knee Pain', desc: '3 sessions completed, 3 more needed. Quadricep strengthening reduces knee stress and enables more walking.', pri: 'high', ico: 'fitness-outline'},
      {title: 'Leg Elevation 15 min/day', desc: 'Elevate legs above heart level for 15 min in evening. Reduces Amlodipine-related ankle oedema without medication change.', pri: 'medium', ico: 'bed-outline'},
    ],
    care: {
      treat: [
        'Methylcobalamin 500mcg OD \u2014 improve adherence to 100%',
        'Order iron panel to rule out iron deficiency neuropathy',
        'Annual diabetic foot exam with monofilament testing',
        'Physiotherapy: 3 more sessions for knee rehabilitation',
        'Consider Amlodipine switch if oedema becomes limiting (discuss with doctor)',
      ],
      prev: 'Glucose control (<140 post-meal) is the primary neuropathy prevention. B12 repletion, daily foot care, and appropriate footwear. Annual foot exam is non-negotiable for T2DM patients with neuropathy symptoms.',
    },
    prog: {
      primary: {lbl: 'Tingling Episodes', val: 5, lo: 0, hi: 1, unit: '/month', col: '#DC2626'},
      panels: [
        {lbl: 'Neuropathy', cls: 'tl', score: '5x/mo', bar: 55, badge: '\u2191 Active', badge_col: '#DC2626', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'Foot tingling 5x in March \u2014 early diabetic peripheral neuropathy. Glucose control + B12 repletion are treatment priorities.'},
        {lbl: 'Mobility', cls: 'pu', score: '4x knee', bar: 45, badge: '\u2191 Limiting', badge_col: '#D97706', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'Knee pain 4x/month limits walking and exercise. Physiotherapy is helping \u2014 continue for 3 more sessions.'},
        {lbl: 'Oedema', cls: 'bl', score: 'Bilateral', bar: 40, badge: '\u2192 Managed', badge_col: '#D97706', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'Bilateral ankle oedema from Amlodipine. Not dangerous but uncomfortable. Leg elevation helps.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 2, st: 'l'}, {dt: 'Nov 25', v: 3, st: 'h'}, {dt: 'Dec 25', v: 3, st: 'h'},
        {dt: 'Jan 26', v: 4, st: 'h'}, {dt: 'Feb 26', v: 4, st: 'h'}, {dt: 'Mar 26', v: 5, st: 'h'},
      ],
      histLabel: 'Foot tingling episodes per month',
    },
  },

  stress: {
    name: 'Stress & Mental Health',
    cat: 'Psychological',
    col: '#7C3AED',
    hdr: [
      {lbl: 'PHQ-9', val: '8', unit: 'mild depression', col: '#D97706'},
      {lbl: 'GAD-7', val: '6', unit: 'mild anxiety', col: '#D97706'},
      {lbl: 'Stress days', val: '12', unit: '/month', col: '#DC2626'},
      {lbl: 'FBG impact', val: '+12', unit: 'mg/dL on stress', col: '#DC2626'},
    ],
    ayu: {
      urgency: 'medium',
      narrative:
        'Priya\u2019s PHQ-9 of 8 (mild depression) and GAD-7 of 6 (mild anxiety) are subclinical but metabolically significant. High-stress days drive a cortisol cascade: stress \u2192 cortisol \u2192 hepatic glucose release \u2192 FBG +12 mg/dL. Of 31 March days, 12 were logged as high-stress. On these days, FBG averaged 134 mg/dL vs 122 mg/dL on low-stress days. Stress management is not a \u201csoft\u201d intervention \u2014 it has direct, measurable metabolic impact.',
      corrs: [
        {lbl: 'Stress \u2192 cortisol \u2192 glucose', val: 'High-stress days: next-morning FBG avg +12 mg/dL above weekly average. Cortisol stimulates hepatic glucose output directly.'},
        {lbl: 'Stress \u2192 sleep disruption', val: 'High-stress days correlate with later sleep onset (avg 12:45 AM vs 11:50 PM). Creating a stress-sleep-glucose triple cascade.'},
        {lbl: 'Stress \u2192 medication misses', val: '8 of 13 PM Metformin misses occurred on high-stress days. Stress disrupts evening routine and medication habits.'},
        {lbl: 'Stress \u2192 HRV suppression', val: 'High-stress days show HRV 22\u201324ms vs 30\u201332ms on calm days. Sustained sympathetic activation impairs cardiac autonomic tone.'},
      ],
    },
    insight: {
      desc: 'Mental health scores (PHQ-9: 8, GAD-7: 6) are in the mild range but have outsized metabolic impact. The stress-cortisol-glucose cascade is measurable: 12 high-stress days in March each added +12 mg/dL to FBG. Stress also disrupts sleep, medication adherence, and HRV \u2014 amplifying every other condition in Priya\u2019s profile.',
      symp: [
        'Low mood and reduced motivation (PHQ-9: 8)',
        'Worry and difficulty controlling anxious thoughts (GAD-7: 6)',
        'Difficulty concentrating at work on high-stress days',
        'Emotional eating and carbohydrate cravings when stressed',
        'Racing thoughts at bedtime delaying sleep onset',
        'Fatigue and low energy compounding physical deconditioning',
      ],
      causes: [
        'Work-related stress \u2014 high-demand role with limited control',
        'Health anxiety from managing multiple chronic conditions',
        'Poor sleep (5.9h) reducing emotional regulation capacity',
        'Chronic disease burden \u2014 T2DM, HTN, anaemia, neuropathy',
        'Social isolation from reduced activity and fatigue',
      ],
    },
    organs: [
      {n: 'Brain', c: '#7C3AED', stage: 'Mood Disturbance', sev: 45, impact: 'PHQ-9 of 8 indicates mild depression. Combined with poor sleep and chronic disease burden, prefrontal cortex function is impaired \u2014 reducing decision-making, willpower, and adherence capacity.'},
      {n: 'Adrenal Glands', c: '#DC2626', stage: 'Cortisol Dysregulation', sev: 50, impact: 'Chronic stress maintains elevated cortisol. This directly raises FBG (+12 mg/dL on stress days), suppresses HRV, disrupts sleep, and promotes central fat deposition.'},
      {n: 'Pancreas', c: '#F59E0B', stage: 'Cortisol-Driven Load', sev: 42, impact: 'Cortisol-stimulated hepatic glucose release forces the pancreas to produce extra insulin. On 12 high-stress days in March, the pancreas faced an additional ~144 mg/dL cumulative glucose burden.'},
    ],
    cluster: {
      risk: '52%',
      name: 'Psycho-Metabolic Cascade Cluster',
      desc: 'Stress acts as a metabolic amplifier \u2014 worsening glucose, BP, sleep, HRV, and medication adherence simultaneously through the cortisol pathway.',
      diseases: [
        {n: 'Major Depression', p: 30, type: 'watch'},
        {n: 'Generalised Anxiety', p: 28, type: 'watch'},
        {n: 'T2DM Glycaemic Instability', p: 65, type: 'active'},
        {n: 'Cardiovascular Risk (stress)', p: 40, type: 'emerging'},
      ],
      timeline: [
        {time: 'Now', event: 'PHQ-9: 8, GAD-7: 6. 12 high-stress days in March. FBG +12 mg/dL per stress day.', col: '#D97706'},
        {time: '1 month', event: 'With breathing exercises + 7h sleep: stress days expected to halve. FBG impact reduced.', col: '#F97316'},
        {time: '3 months', event: 'With sustained sleep improvement + activity: PHQ-9 target <5. HRV improves.', col: '#F59E0B'},
        {time: 'Without change', event: 'PHQ-9 may rise to 10+ (moderate depression). Cortisol-glucose cascade worsens HbA1c.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: '5-min Breathing Exercise Before Bed', desc: 'Box breathing (4-4-4-4) activates parasympathetic system. Lowers cortisol, raises HRV, and improves sleep onset. Do nightly.', pri: 'high', ico: 'happy-outline'},
      {title: '7h Sleep \u2014 Emotional Buffer', desc: 'Sleep is the primary emotional regulation mechanism. Each hour of sleep raises stress resilience and reduces next-day cortisol.', pri: 'high', ico: 'moon-outline'},
      {title: 'Daily Activity for Mood', desc: '150 min/week moderate activity raises mood equivalent to mild antidepressants. BDNF release improves brain plasticity.', pri: 'medium', ico: 'walk-outline'},
      {title: 'Consider Counselling if PHQ-9 >10', desc: 'If PHQ-9 rises above 10 on next screening: cognitive behavioural therapy (CBT) referral recommended.', pri: 'medium', ico: 'people-outline'},
    ],
    care: {
      treat: [
        'No medication currently needed \u2014 subclinical scores',
        'Quarterly PHQ-9 and GAD-7 reassessment',
        'Sleep improvement as primary intervention (7h target)',
        'Breathing exercises nightly for cortisol reduction',
        'CBT referral if PHQ-9 >10 at any reassessment',
      ],
      prev: 'Sleep, activity, and stress management form the triad of mental health prevention. For Priya, improving sleep alone is expected to reduce PHQ-9 by 2\u20133 points. Activity adds another 1\u20132 points improvement.',
    },
    prog: {
      primary: {lbl: 'PHQ-9', val: 8, lo: 0, hi: 4, unit: 'score', col: '#7C3AED'},
      panels: [
        {lbl: 'Depression', cls: 'tl', score: 'PHQ-9: 8', bar: 40, badge: '\u2192 Mild', badge_col: '#D97706', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'PHQ-9 of 8 \u2014 mild depression. Driven by poor sleep, chronic disease burden, and reduced activity. Not yet at medication threshold.'},
        {lbl: 'Anxiety', cls: 'pu', score: 'GAD-7: 6', bar: 35, badge: '\u2192 Mild', badge_col: '#D97706', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'GAD-7 of 6 \u2014 mild anxiety. Health-related worry and work stress. Manageable with non-pharmacological interventions.'},
        {lbl: 'Metabolic impact', cls: 'bl', score: '+12 FBG', bar: 55, badge: '\u2191 Significant', badge_col: '#DC2626', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: '12 high-stress days added +12 mg/dL FBG each. Cumulative: 144 mg/dL extra glucose burden in March from stress alone.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 7, st: 'l'}, {dt: 'Nov 25', v: 8, st: 'l'}, {dt: 'Dec 25', v: 9, st: 'l'},
        {dt: 'Jan 26', v: 8, st: 'l'}, {dt: 'Feb 26', v: 8, st: 'l'}, {dt: 'Mar 26', v: 8, st: 'l'},
      ],
      histLabel: 'PHQ-9 score trend',
    },
  },

  anaemia: {
    name: 'Anaemia',
    cat: 'Haematology',
    col: '#DC2626',
    hdr: [
      {lbl: 'Haemoglobin', val: '11.8', unit: 'g/dL (low)', col: '#DC2626'},
      {lbl: 'Iron panel', val: 'NOT TESTED', unit: 'critical gap', col: '#DC2626'},
      {lbl: 'Vitamin B12', val: '312', unit: 'pg/mL (borderline)', col: '#D97706'},
      {lbl: 'Metformin effect', val: 'B12 depletion', unit: 'ongoing', col: '#D97706'},
    ],
    ayu: {
      urgency: 'medium',
      narrative:
        'Priya\u2019s Hb of 11.8 g/dL confirms mild anaemia (normal >12 for women). The critical gap is that iron has NEVER been tested \u2014 in a menstruating woman with borderline Hb, this is the single most important missing lab. B12 of 312 pg/mL is borderline, and Metformin actively depletes B12. Methylcobalamin supplementation at 84% adherence is insufficient for repletion. Anaemia drives cardiac compensation (HRV 28ms), fatigue, breathlessness, and reduced exercise capacity.',
      corrs: [
        {lbl: 'Anaemia \u2192 cardiac compensation', val: 'Hb 11.8 forces higher cardiac output to maintain oxygen delivery. This is a direct driver of HRV suppression (28ms) and exercise intolerance.'},
        {lbl: 'Untested iron \u2192 diagnostic gap', val: 'Iron deficiency is the #1 cause of anaemia in menstruating women. Without serum ferritin, TIBC, and iron saturation, the cause is unknown and untreatable.'},
        {lbl: 'Metformin \u2192 B12 depletion', val: 'Metformin 1000mg BD depletes B12 by 10\u201330% over 2 years. B12 of 312 (borderline) will continue declining without adequate Methylcobalamin adherence.'},
        {lbl: 'Menstrual loss \u2192 iron drain', val: 'Monthly menstrual blood loss of ~30\u201340 mL (moderate flow, 4\u20135 days) depletes 15\u201320 mg iron per cycle. Without dietary replacement or supplementation, stores decline.'},
      ],
    },
    insight: {
      desc: 'Mild anaemia (Hb 11.8) in a 38-year-old menstruating woman on Metformin. The two most common causes \u2014 iron deficiency and B12 deficiency \u2014 are both plausible. Iron has NEVER been tested, which is a critical diagnostic gap. B12 of 312 is borderline and actively depleted by Metformin. This anaemia is not benign \u2014 it drives fatigue, cardiac compensation, and limits the exercise that would improve every other condition.',
      symp: [
        'Fatigue and low energy throughout the day',
        'Breathlessness on exertion (stairs, fast walking)',
        'Palpitations and elevated resting heart rate compensation',
        'Difficulty concentrating and brain fog',
        'Pale conjunctivae and nail beds',
        'Reduced exercise tolerance limiting physical activity',
      ],
      causes: [
        'Iron deficiency \u2014 most likely cause (untested, menstruating woman)',
        'B12 borderline (312 pg/mL) with Metformin depletion',
        'Monthly menstrual iron losses (moderate flow, 4\u20135 days)',
        'Dietary iron intake may be insufficient (vegetarian-heavy Indian diet)',
        'Chronic inflammation from T2DM may contribute (anaemia of chronic disease)',
      ],
    },
    organs: [
      {n: 'Heart', c: '#EF4444', stage: 'Compensatory Overload', sev: 48, impact: 'Hb 11.8 forces the heart to pump faster and harder to deliver adequate oxygen. This directly suppresses HRV (28ms) and limits cardiac reserve for exercise.'},
      {n: 'Brain', c: '#7C3AED', stage: 'Oxygen Deficit', sev: 42, impact: 'Anaemia reduces cerebral oxygen delivery. This manifests as brain fog, difficulty concentrating, and contributes to the PHQ-9 score of 8 through fatigue and cognitive impairment.'},
      {n: 'Muscles', c: '#F59E0B', stage: 'Exercise Limitation', sev: 40, impact: 'Skeletal muscles require adequate oxygen for glucose disposal during exercise. Anaemia limits exercise capacity, reducing the effectiveness of physical activity for glucose control.'},
      {n: 'Bone Marrow', c: '#DC2626', stage: 'Production Demand', sev: 35, impact: 'If iron-deficient, bone marrow cannot produce adequate red blood cells despite demand. Ferritin testing would reveal whether iron stores are depleted.'},
    ],
    cluster: {
      risk: '48%',
      name: 'Anaemia-Fatigue-Deconditioning Cluster',
      desc: 'Anaemia drives fatigue and cardiac compensation. Fatigue limits exercise. Reduced exercise worsens glucose, BP, and mood. This is a deconditioning spiral.',
      diseases: [
        {n: 'Iron Deficiency Anaemia', p: 55, type: 'emerging'},
        {n: 'B12 Deficiency (Metformin)', p: 42, type: 'active'},
        {n: 'Cardiac Compensation', p: 40, type: 'active'},
        {n: 'Exercise Intolerance', p: 50, type: 'active'},
      ],
      timeline: [
        {time: 'Now', event: 'Hb 11.8. Iron NOT tested. B12 312 borderline. Cardiac compensation active (HRV 28ms).', col: '#EF4444'},
        {time: '1 month', event: 'With iron panel: diagnosis confirmed. If iron-deficient: oral iron started. B12 repletion continues.', col: '#F97316'},
        {time: '3 months', event: 'With iron + B12 correction: Hb target 12.5+. HRV expected improvement 3\u20135ms. Exercise capacity improves.', col: '#F59E0B'},
        {time: 'Without testing', event: 'Hb drifts to 11.0\u201311.5. Cardiac compensation deepens. Fatigue worsens. Exercise capacity declines further.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Order Iron Panel \u2014 URGENT', desc: 'Serum ferritin, TIBC, iron saturation. The single most important missing lab in Priya\u2019s profile. Cannot treat anaemia without knowing the cause.', pri: 'high', ico: 'flask-outline'},
      {title: 'Methylcobalamin 100% Adherence', desc: 'B12 of 312 borderline + Metformin depletion. Current 84% adherence (5 misses) is insufficient. Add to evening pill organiser next to PM Metformin.', pri: 'high', ico: 'medkit-outline'},
      {title: 'Iron-Rich Foods at Dinner', desc: 'Add spinach, lentils, or fortified cereals. Pair with vitamin C (lemon) to enhance iron absorption. Avoid tea with meals (inhibits absorption).', pri: 'medium', ico: 'nutrition-outline'},
      {title: 'Recheck CBC in 3 Months', desc: 'After iron panel results and treatment initiation, recheck Hb at Jun 2026 review. Target Hb >12.0 g/dL.', pri: 'medium', ico: 'analytics-outline'},
    ],
    care: {
      treat: [
        'Iron panel STAT \u2014 serum ferritin, TIBC, iron saturation',
        'If iron-deficient: oral iron 200mg OD with vitamin C (empty stomach)',
        'Methylcobalamin 500mcg OD \u2014 continue with 100% adherence',
        'Recheck CBC at Jun 2026 review',
        'If Hb <10.5 or not responding: haematology referral',
      ],
      prev: 'Annual CBC monitoring for all T2DM patients on Metformin. Iron panel at baseline and whenever Hb drops. B12 monitoring every 12 months. Dietary iron optimisation with vitamin C pairing.',
    },
    prog: {
      primary: {lbl: 'Haemoglobin', val: 11.8, lo: 12.0, hi: 15.5, unit: 'g/dL', col: '#DC2626'},
      panels: [
        {lbl: 'Haemoglobin', cls: 'tl', score: '11.8', bar: 42, badge: '\u2193 Low', badge_col: '#DC2626', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'Hb 11.8 g/dL \u2014 below normal (>12 for women). Mild anaemia causing cardiac compensation and fatigue.'},
        {lbl: 'Iron status', cls: 'pu', score: 'UNTESTED', bar: 5, badge: '\u26a0 Gap', badge_col: '#DC2626', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'Iron panel has NEVER been ordered. In a menstruating woman with Hb 11.8, this is the most critical missing investigation.'},
        {lbl: 'B12 status', cls: 'bl', score: '312', bar: 50, badge: '\u2192 Borderline', badge_col: '#D97706', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'B12 312 pg/mL (borderline, target >400). Metformin actively depletes B12. Methylcobalamin supplementation ongoing at 84% adherence.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 12.1, st: 'n'}, {dt: 'Nov 25', v: 12.0, st: 'n'}, {dt: 'Dec 25', v: 11.9, st: 'l'},
        {dt: 'Jan 26', v: 11.9, st: 'l'}, {dt: 'Feb 26', v: 11.8, st: 'l'}, {dt: 'Mar 26', v: 11.8, st: 'l'},
      ],
      histLabel: 'Haemoglobin trend (g/dL)',
    },
  },

  vaccination: {
    name: 'Vaccination',
    cat: 'Preventive Care',
    col: '#16A34A',
    hdr: [
      {lbl: 'Status', val: 'Mostly', unit: 'current', col: '#16A34A'},
      {lbl: 'Overdue', val: 'Pneumococcal', unit: '3x T2DM risk', col: '#DC2626'},
      {lbl: 'Flu vaccine', val: 'Oct 2025', unit: 'current', col: '#16A34A'},
      {lbl: 'COVID', val: 'Boosted', unit: 'Apr 2025', col: '#16A34A'},
    ],
    ayu: {
      urgency: 'low',
      narrative:
        'Priya\u2019s vaccination status is mostly current. The critical gap is the pneumococcal vaccine \u2014 T2DM patients have 3x higher risk of invasive pneumococcal disease, and Priya has never received it. Flu vaccine (Oct 2025) and COVID booster (Apr 2025) are current. With Vit D deficiency (18 ng/mL) and poor sleep weakening her immune system, vaccination is an essential preventive layer.',
      corrs: [
        {lbl: 'T2DM \u2192 infection risk', val: 'T2DM patients have 2\u20133x higher infection risk across all types. Vaccination is the most cost-effective preventive intervention.'},
        {lbl: 'Pneumococcal \u2192 T2DM', val: '3x higher risk of invasive pneumococcal disease in T2DM. Pneumococcal pneumonia can destabilise glucose for weeks.'},
        {lbl: 'Vit D \u2192 immune response', val: 'Vit D deficiency (18 ng/mL) reduces vaccine immune response. Correcting Vit D before vaccination improves antibody production.'},
        {lbl: 'Dec URTI reminder', val: 'Dec 2025 URTI (fever 38.2\u00b0C, 3 days) demonstrated infection vulnerability. Vaccination prevents the most dangerous infections.'},
      ],
    },
    insight: {
      desc: 'Vaccination is mostly up to date but the pneumococcal vaccine is critically overdue. T2DM patients are recommended to receive pneumococcal vaccination due to 3x higher risk of pneumococcal disease. Flu vaccine is current (Oct 2025). COVID booster is current (Apr 2025). Hepatitis B status should be confirmed.',
      symp: [
        'No vaccination-related symptoms currently',
        'Dec 2025 URTI highlighted infection susceptibility',
        'Vit D deficiency reduces baseline immune competence',
      ],
      causes: [
        'Pneumococcal vaccine not offered or scheduled at previous visits',
        'Lack of awareness of T2DM-specific vaccination recommendations',
        'No systematic vaccination review as part of T2DM annual care',
      ],
    },
    organs: [
      {n: 'Immune System', c: '#06B6D4', stage: 'Partially Protected', sev: 25, impact: 'Flu and COVID vaccination provide protection against the two most common serious infections. Pneumococcal gap leaves vulnerability to the #1 vaccine-preventable bacterial infection in T2DM.'},
    ],
    cluster: {
      risk: '18%',
      name: 'Infection Prevention Cluster',
      desc: 'Vaccination is the most effective infection prevention. The pneumococcal gap is the only significant concern. Overall preventive care is reasonable.',
      diseases: [
        {n: 'Pneumococcal Disease', p: 25, type: 'watch'},
        {n: 'Influenza Complications', p: 10, type: 'watch'},
        {n: 'COVID Severe Illness', p: 8, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: 'Flu and COVID current. Pneumococcal overdue. Vit D deficiency weakens baseline immunity.', col: '#D97706'},
        {time: '1 month', event: 'Schedule pneumococcal vaccine at next clinic visit. Complete Vit D loading.', col: '#16A34A'},
        {time: '6 months', event: 'All vaccinations current. Vit D replete. Immune resilience significantly improved.', col: '#16A34A'},
        {time: 'Without action', event: 'Pneumococcal gap persists. Next respiratory illness may be more severe.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Schedule Pneumococcal Vaccine', desc: 'Overdue for T2DM. 3x higher risk of invasive pneumococcal disease. Schedule PCV20 at next clinic visit.', pri: 'high', ico: 'medkit-outline'},
      {title: 'Annual Flu Vaccine \u2014 Oct 2026', desc: 'Current flu vaccine expires Oct 2026. Set reminder for annual renewal. T2DM patients are priority group.', pri: 'low', ico: 'calendar-outline'},
      {title: 'Confirm Hepatitis B Status', desc: 'T2DM patients aged 19\u201359 should have completed Hep B series. Confirm and complete if needed.', pri: 'low', ico: 'shield-outline'},
      {title: 'Vit D Repletion for Immune Response', desc: 'Correcting Vit D from 18 to >30 ng/mL improves vaccine antibody response and general immune function.', pri: 'medium', ico: 'sunny-outline'},
    ],
    care: {
      treat: [
        'Pneumococcal vaccine (PCV20) \u2014 schedule at next visit',
        'Annual flu vaccine \u2014 next due Oct 2026',
        'COVID booster per national guidelines',
        'Confirm Hepatitis B vaccination series complete',
        'Vit D supplementation to support immune response',
      ],
      prev: 'Vaccination is the most cost-effective preventive measure for T2DM patients. Annual flu, pneumococcal series, COVID per guidelines, and Hep B confirmation. Maintain Vit D >30 ng/mL for optimal immune function.',
    },
    prog: {
      primary: {lbl: 'Completion', val: 85, lo: 90, hi: 100, unit: '%', col: '#16A34A'},
      panels: [
        {lbl: 'Current vaccines', cls: 'tl', score: '3/4', bar: 75, badge: '\u2192 Mostly', badge_col: '#D97706', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'Flu (Oct 2025), COVID booster (Apr 2025), Tdap (current) \u2014 3 of 4 recommended vaccines are up to date.'},
        {lbl: 'Overdue', cls: 'pu', score: '1', bar: 25, badge: '\u2191 Gap', badge_col: '#DC2626', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'Pneumococcal vaccine overdue. T2DM-specific recommendation. 3x higher risk of invasive disease. Priority scheduling needed.'},
        {lbl: 'Immune readiness', cls: 'bl', score: '70%', bar: 70, badge: '\u2192 Fair', badge_col: '#D97706', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'Vit D deficiency (18 ng/mL) and poor sleep reduce immune competence. Vaccination provides essential protection despite these gaps.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 80, st: 'l'}, {dt: 'Nov 25', v: 80, st: 'l'}, {dt: 'Dec 25', v: 80, st: 'l'},
        {dt: 'Jan 26', v: 85, st: 'l'}, {dt: 'Feb 26', v: 85, st: 'l'}, {dt: 'Mar 26', v: 85, st: 'l'},
      ],
      histLabel: 'Vaccination completion % trend',
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
  Eyes: 'eye-outline',
  Reproductive: 'flower-outline',
  'Bone Marrow': 'body-outline',
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

// ──────────────────────────────────────────────
// Glucose Intel Tab (imported panels with sub-tabs)
// ──────────────────────────────────────────────

const GlucoseIntelTab = () => {
  const [subTab, setSubTab] = useState('intel');
  const SUB_TABS = [
    {key: 'intel', label: 'Ayu Intel'},
    {key: 'overview', label: 'Overview'},
    {key: 'trends', label: 'Trends'},
    {key: 'patterns', label: 'Patterns'},
  ];
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: vs(12)}} contentContainerStyle={{gap: s(6)}}>
        {SUB_TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={{paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(10), backgroundColor: subTab === t.key ? Colors.primary : Colors.white, borderWidth: 0.5, borderColor: subTab === t.key ? Colors.primary : Colors.borderLight}}
            onPress={() => setSubTab(t.key)}
            activeOpacity={0.7}>
            <AppText variant="small" color={subTab === t.key ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{t.label}</AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {subTab === 'intel' && <AyuIntelPanel />}
      {subTab === 'overview' && <OverviewPanel />}
      {subTab === 'trends' && <TrendsPanel />}
      {subTab === 'patterns' && <PatternsPanel />}
    </View>
  );
};

const BPIntelTab = () => {
  const [subTab, setSubTab] = useState('overview');
  const SUB_TABS = [
    {key: 'overview', label: 'Overview'},
    {key: 'trends', label: 'Trends'},
    {key: 'patterns', label: 'Patterns'},
  ];
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: vs(12)}} contentContainerStyle={{gap: s(6)}}>
        {SUB_TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={{paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(10), backgroundColor: subTab === t.key ? Colors.primary : Colors.white, borderWidth: 0.5, borderColor: subTab === t.key ? Colors.primary : Colors.borderLight}}
            onPress={() => setSubTab(t.key)}
            activeOpacity={0.7}>
            <AppText variant="small" color={subTab === t.key ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{t.label}</AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {subTab === 'overview' && <BPOverviewPanel />}
      {subTab === 'trends' && <BPTrendsPanel />}
      {subTab === 'patterns' && <BPPatternsPanel />}
    </View>
  );
};

const HRIntelTab = () => {
  const [subTab, setSubTab] = useState('overview');
  const SUB_TABS = [
    {key: 'overview', label: 'Overview'},
    {key: 'trends', label: 'Trends'},
    {key: 'patterns', label: 'Patterns'},
  ];
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: vs(12)}} contentContainerStyle={{gap: s(6)}}>
        {SUB_TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={{paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(10), backgroundColor: subTab === t.key ? Colors.primary : Colors.white, borderWidth: 0.5, borderColor: subTab === t.key ? Colors.primary : Colors.borderLight}}
            onPress={() => setSubTab(t.key)}
            activeOpacity={0.7}>
            <AppText variant="small" color={subTab === t.key ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{t.label}</AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {subTab === 'overview' && <HROverviewPanel />}
      {subTab === 'trends' && <HRTrendsPanel />}
      {subTab === 'patterns' && <HRPatternsPanel />}
    </View>
  );
};

const WeightIntelTab = () => {
  const [subTab, setSubTab] = useState('overview');
  const SUB_TABS = [
    {key: 'overview', label: 'Overview'},
    {key: 'measurements', label: 'Measurements'},
    {key: 'peergroup', label: 'Peer Group'},
    {key: 'conditions', label: 'Conditions'},
    {key: 'patterns', label: 'Patterns'},
  ];
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: vs(12)}} contentContainerStyle={{gap: s(6)}}>
        {SUB_TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={{paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(10), backgroundColor: subTab === t.key ? Colors.primary : Colors.white, borderWidth: 0.5, borderColor: subTab === t.key ? Colors.primary : Colors.borderLight}}
            onPress={() => setSubTab(t.key)}
            activeOpacity={0.7}>
            <AppText variant="small" color={subTab === t.key ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{t.label}</AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {subTab === 'overview' && <WeightOverviewPanel />}
      {subTab === 'measurements' && <WeightMeasurementsPanel />}
      {subTab === 'peergroup' && <WeightPeerGroupPanel />}
      {subTab === 'conditions' && <WeightConditionsPanel />}
      {subTab === 'patterns' && <WeightPatternsPanel />}
    </View>
  );
};

const TempIntelTab = () => {
  const [subTab, setSubTab] = useState('overview');
  const SUB_TABS = [
    {key: 'overview', label: 'Overview'},
    {key: 'trends', label: 'Trends'},
    {key: 'conditions', label: 'Conditions'},
  ];
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: vs(12)}} contentContainerStyle={{gap: s(6)}}>
        {SUB_TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={{paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(10), backgroundColor: subTab === t.key ? Colors.primary : Colors.white, borderWidth: 0.5, borderColor: subTab === t.key ? Colors.primary : Colors.borderLight}}
            onPress={() => setSubTab(t.key)}
            activeOpacity={0.7}>
            <AppText variant="small" color={subTab === t.key ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{t.label}</AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {subTab === 'overview' && <TempOverviewPanel />}
      {subTab === 'trends' && <TempTrendsPanel />}
      {subTab === 'conditions' && <TempConditionsPanel />}
    </View>
  );
};

const AsthmaIntelTab = () => {
  const [subTab, setSubTab] = useState('overview');
  const SUB_TABS = [
    {key: 'overview', label: 'Overview'},
    {key: 'triggers', label: 'Triggers'},
    {key: 'conditions', label: 'Conditions'},
    {key: 'patterns', label: 'Patterns'},
  ];
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: vs(12)}} contentContainerStyle={{gap: s(6)}}>
        {SUB_TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={{paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(10), backgroundColor: subTab === t.key ? Colors.primary : Colors.white, borderWidth: 0.5, borderColor: subTab === t.key ? Colors.primary : Colors.borderLight}}
            onPress={() => setSubTab(t.key)}
            activeOpacity={0.7}>
            <AppText variant="small" color={subTab === t.key ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{t.label}</AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {subTab === 'overview' && <AsthmaOverviewPanel />}
      {subTab === 'triggers' && <AsthmaTriggersPanel />}
      {subTab === 'conditions' && <AsthmaConditionsPanel />}
      {subTab === 'patterns' && <AsthmaPatternsPanel />}
    </View>
  );
};

const MigraineIntelTab = () => {
  const [subTab, setSubTab] = useState('overview');
  const SUB_TABS = [
    {key: 'overview', label: 'Overview'},
    {key: 'triggers', label: 'Triggers'},
    {key: 'conditions', label: 'Conditions'},
    {key: 'patterns', label: 'Patterns'},
  ];
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: vs(12)}} contentContainerStyle={{gap: s(6)}}>
        {SUB_TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={{paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(10), backgroundColor: subTab === t.key ? Colors.primary : Colors.white, borderWidth: 0.5, borderColor: subTab === t.key ? Colors.primary : Colors.borderLight}}
            onPress={() => setSubTab(t.key)}
            activeOpacity={0.7}>
            <AppText variant="small" color={subTab === t.key ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{t.label}</AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {subTab === 'overview' && <MigraineOverviewPanel />}
      {subTab === 'triggers' && <MigraineTriggersPanel />}
      {subTab === 'conditions' && <MigraineConditionsPanel />}
      {subTab === 'patterns' && <MigrainePatternsPanel />}
    </View>
  );
};

const AnemiaIntelTab = () => {
  const [subTab, setSubTab] = useState('overview');
  const SUB_TABS = [
    {key: 'overview', label: 'Overview'},
    {key: 'iron', label: 'Iron & B12'},
    {key: 'conditions', label: 'Conditions'},
    {key: 'diet', label: 'Diet & absorption'},
  ];
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: vs(12)}} contentContainerStyle={{gap: s(6)}}>
        {SUB_TABS.map(t => (
          <TouchableOpacity
            key={t.key}
            style={{paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(10), backgroundColor: subTab === t.key ? Colors.primary : Colors.white, borderWidth: 0.5, borderColor: subTab === t.key ? Colors.primary : Colors.borderLight}}
            onPress={() => setSubTab(t.key)}
            activeOpacity={0.7}>
            <AppText variant="small" color={subTab === t.key ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{t.label}</AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>
      {subTab === 'overview' && <AnemiaOverviewPanel />}
      {subTab === 'iron' && <AnemiaIronB12Panel />}
      {subTab === 'conditions' && <AnemiaConditionsPanel />}
      {subTab === 'diet' && <AnemiaDietPanel />}
    </View>
  );
};

const BASE_TABS = [
  {key: 'ayuIntel', label: '\uD83E\uDDE0 Ayu Intel'},
  {key: 'progression', label: '\uD83D\uDCC8 Progression'},
  {key: 'organs', label: '\uD83E\uDEC1 Organs'},
  {key: 'cluster', label: '\uD83D\uDD17 Cluster'},
  {key: 'care', label: '\u2713 Care'},
];

const INTEL_TABS = {
  glucose: {key: 'glucoseIntel', label: 'Glucose Intel'},
  bp: {key: 'bpIntel', label: 'BP Intel'},
  heartRate: {key: 'hrIntel', label: 'HR Intel'},
  weight: {key: 'weightIntel', label: 'Weight Intel'},
  temperature: {key: 'tempIntel', label: 'Temp Intel'},
  asthma: {key: 'asthmaIntel', label: 'Asthma Intel'},
  migraine: {key: 'migraineIntel', label: 'Migraine Intel'},
  anemia: {key: 'anemiaIntel', label: 'Anaemia Intel'},
};

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

const SymptomsDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const {symptomId, initialTab} = route.params || {};

  const [activeTab, setActiveTab] = useState(initialTab || 'ayuIntel');

  const tabs = useMemo(() => {
    const intelTab = INTEL_TABS[symptomId];
    return intelTab ? [...BASE_TABS, intelTab] : BASE_TABS;
  }, [symptomId]);

  const ls = useMemo(() => {
    return SYMPTOMS_DATA[symptomId] || SYMPTOMS_DATA.glucose;
  }, [symptomId]);

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
      case 'glucoseIntel':
        return <GlucoseIntelTab />;
      case 'bpIntel':
        return <BPIntelTab />;
      case 'hrIntel':
        return <HRIntelTab />;
      case 'weightIntel':
        return <WeightIntelTab />;
      case 'tempIntel':
        return <TempIntelTab />;
      case 'asthmaIntel':
        return <AsthmaIntelTab />;
      case 'migraineIntel':
        return <MigraineIntelTab />;
      case 'anemiaIntel':
        return <AnemiaIntelTab />;
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
            <AppText variant="caption" color="rgba(255,255,255,0.45)" style={{marginTop: vs(2)}}>Symptoms · March 2026 · Priya Reddy</AppText>
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
          {tabs.map(tab => {
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

export default SymptomsDetailScreen;
