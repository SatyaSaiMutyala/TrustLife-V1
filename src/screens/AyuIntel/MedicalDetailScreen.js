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
// MEDICAL DETAIL DATA (embedded per screen)
// ──────────────────────────────────────────────

const MEDICAL_DATA = {
  t2dm: {
    name: 'Type 2 Diabetes',
    cat: 'Endocrine',
    col: '#DC2626',
    hdr: [
      {lbl: 'HbA1c', val: '7.8%', unit: 'target <7.0%', col: '#DC2626'},
      {lbl: 'FBG', val: '126', unit: 'mg/dL', col: '#F59E0B'},
      {lbl: 'Comp. risk', val: '28%', unit: '5-year', col: '#D97706'},
      {lbl: 'Duration', val: '5 yrs', unit: 'since 2021', col: '#888888'},
    ],
    ayu: {
      urgency: 'high',
      narrative:
        "Priya, your T2DM has been above-target for 3 consecutive tests \u2014 HbA1c rising from 7.2% to 7.8%. The root is the evening cascade: PM Metformin misses \u2192 large dinner \u2192 poor sleep \u2192 cortisol spike \u2192 high FBG. Metformin uptitration on 5 Mar is your strongest medication signal in 18 months.",
      corrs: [
        {lbl: 'PM Metformin miss \u2192 overnight glucose', val: '13 PM misses in March. Each miss = +12 mg/dL next-morning FBG.'},
        {lbl: 'Sleep deprivation \u2192 HbA1c', val: 'Sleep <6h \u2192 cortisol \u2192 insulin resistance. Sleep explains 40% of FBG variability.'},
        {lbl: 'Post-dinner inactivity', val: 'No walk on 22 of 31 evenings. Walk days: 158 mg/dL. No-walk: 196 mg/dL.'},
        {lbl: 'Vit D deficiency', val: 'Vit D 18 ng/mL worsens beta-cell function. Correcting may reduce HbA1c by 0.2\u20130.4%.'},
      ],
    },
    insight: {
      desc: "Type 2 Diabetes Mellitus is Priya\u2019s primary condition, diagnosed 2021. HbA1c of 7.8% is above the 7.0% T2DM target for the third consecutive test. Managed with Metformin 1000mg BD.",
      symp: [
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
    },
    organs: [
      {n: 'Kidneys', c: '#3B82F6', stage: 'CKD Stage 2', sev: 42, impact: 'eGFR 72 mL/min places Priya in CKD Stage 2. Chronic hyperglycaemia damages glomerular microvasculature. Combined with HTN 136/86, the kidneys are under dual metabolic and pressure load. Olmesartan at 96% adherence is the primary protective factor.'},
      {n: 'Eyes', c: '#8B5CF6', stage: 'Screening Overdue', sev: 55, impact: 'Zero dilated fundus exams in 5 years of T2DM. HbA1c >7.5% for 3+ years carries significantly elevated risk of background retinopathy already present. Estimated 20\u201330% probability of early changes. This is the highest-priority unaddressed screening gap.'},
      {n: 'Nerves', c: '#F59E0B', stage: 'Early Neuropathy', sev: 50, impact: 'Bilateral foot tingling 5\u00D7/month is the clinical manifestation. T2DM glycation of myelin sheaths combined with Metformin-induced B12 decline (312 pg/mL) creates two simultaneous demyelination pathways compounding nerve damage.'},
      {n: 'Heart', c: '#EF4444', stage: 'Elevated Risk', sev: 52, impact: 'Echo EF 62% is structurally normal, but T2DM-driven atherosclerotic risk + HTN 136/86 + anaemia compensation (Hb 11.8) create triple cardiac stress. HRV 28ms reflects chronic sympathetic activation from poor sleep and metabolic load.'},
      {n: 'Liver', c: '#06B6D4', stage: 'Grade 1 NAFLD', sev: 45, impact: 'Grade 1 NAFLD confirmed USG 2023. High carbohydrate diet (58%) drives de novo lipogenesis \u2014 excess dietary carbs converted to TG and deposited as liver fat. NAFLD is the hepatic manifestation of insulin resistance.'},
    ],
    cluster: {
      risk: '75%', name: 'T2DM Complication Cascade',
      desc: 'T2DM is the root condition driving complications across kidneys, eyes, nerves, heart, and liver. HbA1c above target for 3 consecutive tests means the complication cascade is actively progressing.',
      diseases: [
        {n: 'Diabetic Nephropathy', p: 38, type: 'watch'},
        {n: 'Diabetic Retinopathy', p: 45, type: 'emerging'},
        {n: 'Peripheral Neuropathy', p: 52, type: 'active'},
        {n: 'Cardiovascular Disease', p: 55, type: 'emerging'},
        {n: 'NAFLD', p: 60, type: 'active'},
      ],
      timeline: [
        {time: 'Now', event: 'HbA1c 7.8% \u2014 above target for 3 tests. Neuropathy early symptoms.', col: '#EF4444'},
        {time: 'Jun 2026', event: 'Metformin 1000mg effect expected: HbA1c 7.3\u20137.5%.', col: '#F97316'},
        {time: '12\u201318 months', event: 'If HbA1c reaches 7.0%: complication risk stabilises.', col: '#F59E0B'},
        {time: 'Without control', event: 'HbA1c stays >7.5%: microalbumin crosses 30. Retinopathy progresses.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Fix PM Metformin \u2014 Tonight', desc: 'Set 9 PM alarm. Each dose = \u221212 mg/dL tomorrow morning.', pri: 'high', ico: 'alarm-outline'},
      {title: 'Book Retinal Screening', desc: '5 years of T2DM, 0 fundus exams. Early retinopathy is treatable.', pri: 'high', ico: 'eye-outline'},
      {title: '15-min Post-Dinner Walk', desc: 'Reduces post-dinner glucose from 196 to 158 mg/dL average.', pri: 'high', ico: 'walk-outline'},
      {title: 'HbA1c Retest June 2026', desc: 'First post-uptitration test. Expected: 7.3\u20137.5%.', pri: 'medium', ico: 'flask-outline'},
    ],
    care: {
      treat: [
        'Metformin 1000mg BD \u2014 AM 97% (maintain), PM 58% (critical to improve to >95%)',
        'HbA1c target: <7.0% \u2014 current 7.8%, declining trajectory with new dose',
        'Annual organ screening: eye (overdue), kidney, foot (monofilament), neuropathy',
        'T2DM education: carbohydrate counting, glycaemic index, post-meal activity',
      ],
      prev: 'Maintaining HbA1c <7.0% with Metformin + diet + activity reduces microvascular complication risk by 37%. Every 1% HbA1c reduction = significant organ protection.',
    },
    prog: {
      primary: {lbl: 'HbA1c', val: 7.8, lo: 6.0, hi: 7.0, unit: '%', col: '#DC2626'},
      panels: [
        {lbl: 'Glycaemic control', cls: 'tl', score: '7.8%', bar: 40, badge: '\u2191 Worsening', badge_col: '#DC2626', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'HbA1c rising: 7.2% (Mar 25) \u2192 7.8% (Mar 26). Metformin 1000mg started 5 Mar.'},
        {lbl: 'Medication response', cls: 'pu', score: '97%', bar: 70, badge: 'AM good / PM poor', badge_col: '#D97706', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'AM adherence 97% (excellent). PM 58% (critical gap \u2014 13 misses in March).'},
        {lbl: 'Complication risk', cls: 'bl', score: '28%', bar: 28, badge: '\u2191 Rising', badge_col: '#D97706', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: '5-year T2DM + HbA1c 7.8% + BP 136/86 \u2192 28% 5-year complication risk.'},
      ],
      hist: [
        {dt: 'Mar 25', v: 7.2, st: 'h'}, {dt: 'Jun 25', v: 7.4, st: 'h'}, {dt: 'Sep 25', v: 7.5, st: 'h'},
        {dt: 'Dec 25', v: 7.6, st: 'h'}, {dt: 'Jan 26', v: 7.7, st: 'h'}, {dt: 'Mar 26', v: 7.8, st: 'h'},
      ],
      histLabel: 'HbA1c trend',
    },
  },

  htn: {
    name: 'Hypertension',
    cat: 'Cardiovascular',
    col: '#F59E0B',
    hdr: [
      {lbl: 'Systolic', val: '136', unit: 'mmHg', col: '#D97706'},
      {lbl: 'Diastolic', val: '86', unit: 'mmHg', col: '#D97706'},
      {lbl: 'Target', val: '130/80', unit: 'T2DM', col: '#888888'},
      {lbl: 'Since', val: 'Jan 26', unit: 'Olmesartan', col: '#16A34A'},
    ],
    ayu: {
      urgency: 'medium',
      narrative:
        "BP of 136/86 mmHg is above target but improving. Olmesartan is producing its effect. BP is activity-dependent \u2014 6,000+ step days average 128/82, low-activity days 138/90. Sodium excess (2,100 mg/day) is fighting Olmesartan\u2019s effect.",
      corrs: [
        {lbl: 'Activity \u2192 BP', val: '6,000+ step days: BP 128/82. Below 4,000 steps: 138/90. Strongest non-medication lever.'},
        {lbl: 'Sodium \u2192 BP opposition', val: 'At 2,100 mg/day sodium (target <1,500), each 500mg reduction lowers systolic by 2\u20133 mmHg.'},
        {lbl: 'Sleep \u2192 BP', val: 'Sleep <6h adds +4 mmHg systolic vs 7h sleep nights.'},
        {lbl: 'T2DM \u2192 HTN coupling', val: 'Hyperglycaemia causes endothelial dysfunction. Lowering HbA1c reduces systolic by 2\u20133 mmHg.'},
      ],
    },
    insight: {
      desc: 'Hypertension with BP averaging 136/86 mmHg \u2014 above the T2DM-specific target of 130/80. Olmesartan 20mg started January 2026 at 96% adherence.',
      symp: [
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
    },
    organs: [
      {n: 'Heart', c: '#EF4444', stage: 'Pressure Load', sev: 48, impact: 'Chronic 136/86 adds 8% extra systolic pressure on the left ventricle. Window to prevent LVH is still open. Echo EF 62% is currently normal but sustained above-target BP accelerates LV remodelling.'},
      {n: 'Kidneys', c: '#3B82F6', stage: 'Nephropathy Risk', sev: 42, impact: 'HTN damages renal microvasculature. eGFR 72 in CKD Stage 2. Each 10 mmHg systolic reduction slows eGFR decline by ~30%. Olmesartan reduces intraglomerular pressure \u2014 dual benefit of BP lowering and direct renoprotection.'},
      {n: 'Brain', c: '#7C3AED', stage: 'Stroke Risk', sev: 40, impact: 'Sustained HTN above 135/85 raises stroke risk 2\u20133\u00D7 over 10 years. Combined with T2DM endothelial dysfunction, cerebrovascular risk is compounded. BP control is the single most effective stroke prevention intervention.'},
      {n: 'Eyes', c: '#8B5CF6', stage: 'Hypertensive Retinopathy', sev: 38, impact: 'HTN causes independent hypertensive retinal changes. T2DM + HTN = additive retinal damage. No fundus exam on record to assess current status. Dual pathology screening needed.'},
    ],
    cluster: {
      risk: '58%', name: 'Cardiometabolic HTN Cluster',
      desc: 'Hypertension in Priya is not an isolated condition \u2014 it is tightly coupled with T2DM, dyslipidaemia, and renal function. BP control is the single most impactful lever for preventing cardiovascular and renal complications.',
      diseases: [
        {n: 'Cardiovascular Disease', p: 50, type: 'emerging'},
        {n: 'Hypertensive Nephropathy', p: 40, type: 'emerging'},
        {n: 'Stroke Risk', p: 35, type: 'watch'},
        {n: 'Hypertensive Retinopathy', p: 30, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: 'BP 136/86 \u2014 above T2DM target. Olmesartan still in onset window.', col: '#F59E0B'},
        {time: '3 months', event: 'With sodium + activity: BP expected 128\u2013130/80.', col: '#F97316'},
        {time: '12 months', event: 'Sustained <130/80: eGFR stabilises, cardiac load normalises.', col: '#F59E0B'},
        {time: 'Without control', event: 'BP stays 136/86+: LVH risk, eGFR decline accelerates.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Cut Sodium Below 1,500 mg/day', desc: 'Remove pickles, papad, snacks. \u22122\u20133 mmHg systolic per 500mg.', pri: 'high', ico: 'water-outline'},
      {title: '8,000 Steps Daily', desc: '6k+ step days already show BP 128/82 vs 138/90 on low days.', pri: 'high', ico: 'walk-outline'},
      {title: 'Continue Olmesartan 96%', desc: 'Dual benefit: BP lowering + renal protection.', pri: 'high', ico: 'medkit-outline'},
      {title: 'BP Self-Monitoring Weekly', desc: 'Home BP every Sunday morning after 5 min rest.', pri: 'medium', ico: 'pulse-outline'},
    ],
    care: {
      treat: [
        'Olmesartan 20mg OD \u2014 continue (96% adherence, renoprotective)',
        'Amlodipine 5mg OD \u2014 continue (100% adherence)',
        'BP target: <130/80 mmHg (currently 136/86, improving)',
        'Annual echo if BP not at target by Dec 2026',
        'Reduce sodium to <1,500 mg/day',
      ],
      prev: "HTN prevention requires: lower carbs, increase activity, reduce sodium, improve sleep. All four are within Priya\u2019s current change agenda.",
    },
    prog: {
      primary: {lbl: 'Systolic BP', val: 136, lo: 120, hi: 130, unit: 'mmHg', col: '#F59E0B'},
      panels: [
        {lbl: 'Systolic control', cls: 'tl', score: '136', bar: 55, badge: '\u2191 Above target', badge_col: '#D97706', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'Systolic 136 mmHg vs target 130. Olmesartan still in onset phase.'},
        {lbl: 'Activity impact', cls: 'pu', score: '128', bar: 75, badge: '\u2193 On active days', badge_col: '#16A34A', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: '6k+ step days: 128/82. Low-activity: 138/90. 10 mmHg difference.'},
        {lbl: 'Medication effect', cls: 'bl', score: '96%', bar: 96, badge: '\u2713 Excellent', badge_col: '#16A34A', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'Olmesartan 96% + Amlodipine 100%. Gap is sodium + inactivity.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 142, st: 'h'}, {dt: 'Nov 25', v: 140, st: 'h'}, {dt: 'Dec 25', v: 139, st: 'h'},
        {dt: 'Jan 26', v: 138, st: 'h'}, {dt: 'Feb 26', v: 137, st: 'h'}, {dt: 'Mar 26', v: 136, st: 'h'},
      ],
      histLabel: 'Systolic BP trend',
    },
  },

  dyslip: {
    name: 'Dyslipidaemia',
    cat: 'Metabolic',
    col: '#D97706',
    hdr: [
      {lbl: 'LDL', val: '118', unit: 'mg/dL', col: '#D97706'},
      {lbl: 'TG', val: '162', unit: 'mg/dL', col: '#D97706'},
      {lbl: 'HDL', val: '52', unit: 'mg/dL', col: '#16A34A'},
      {lbl: 'TC', val: '188', unit: 'mg/dL', col: '#D97706'},
    ],
    ayu: {
      urgency: 'medium',
      narrative:
        "LDL on clear downward trajectory \u2014 145 to 118 over 2.5 years on Atorvastatin. TG 162 is flat, driven by 58% carbohydrate diet. TG:HDL ratio of 3.1 confirms insulin resistance pattern.",
      corrs: [
        {lbl: 'High carb \u2192 TG \u2192 LDL quality', val: '58% carbs creates small dense LDL \u2014 3\u00D7 more atherogenic.'},
        {lbl: 'T2DM \u2192 dyslipidaemia', val: 'Every 1% HbA1c improvement modestly improves all lipids.'},
        {lbl: 'LDL trajectory', val: 'Declining ~2 mg/dL/month. Target <100 by Sep\u2013Oct 2026.'},
        {lbl: 'TG \u2192 NAFLD', val: 'TG 162 feeds liver fat. Reducing TG is the primary NAFLD lever.'},
      ],
    },
    insight: {
      desc: 'Dyslipidaemia with atherogenic pattern: LDL 118 (above T2DM target <100), TG 162 (mildly elevated), HDL 52 (adequate). Managed with Atorvastatin 10mg.',
      symp: [
        'Usually asymptomatic \u2014 detected on blood tests',
        'Elevated atherogenic risk is the key concern',
      ],
      causes: [
        'T2DM insulin resistance worsening all lipid parameters',
        'High-carbohydrate diet (58%) driving TG via VLDL',
        'Physical inactivity reducing clearance and HDL',
      ],
    },
    organs: [
      {n: 'Arteries', c: '#EF4444', stage: 'Plaque Building', sev: 50, impact: 'LDL 118 mg/dL (above T2DM target <100) combined with TG 162 creates small dense LDL \u2014 the most atherogenic form. This pattern is actively building arterial plaque. Atorvastatin is reducing LDL trajectory but TG remains flat due to dietary carbs.'},
      {n: 'Heart', c: '#EF4444', stage: 'Coronary Risk', sev: 48, impact: 'LDL:HDL ratio 2.27 (target <2.0) places Priya in moderate coronary risk territory. Atorvastatin is on trajectory to close this gap. Combined with HTN 136/86 and T2DM, the cardiovascular risk is compounded.'},
      {n: 'Liver', c: '#06B6D4', stage: 'NAFLD Driver', sev: 52, impact: 'TG 162 means the liver is in positive fat-storage balance. High carbohydrate intake (58%) drives hepatic de novo lipogenesis \u2014 converting excess dietary carbs to TG deposited as liver fat. TG reduction is the primary NAFLD reversal lever.'},
    ],
    cluster: {
      risk: '58%', name: 'Atherogenic Dyslipidaemia Cluster',
      desc: 'Dyslipidaemia in Priya follows the classic T2DM atherogenic pattern: high TG, small dense LDL, and relatively preserved HDL. The risk is cardiovascular and hepatic simultaneously.',
      diseases: [
        {n: 'Coronary Artery Disease', p: 50, type: 'emerging'},
        {n: 'NAFLD Grade 1', p: 60, type: 'active'},
        {n: 'Ischaemic Stroke', p: 35, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: 'LDL 118 declining on Atorvastatin. TG 162 stable. HDL 52 adequate.', col: '#F59E0B'},
        {time: 'Sep 2026', event: 'Expected LDL 100\u2013108. TG may decline if carbs reduced.', col: '#F97316'},
        {time: '12\u201324 months', event: 'LDL <100: atherogenic risk significantly reduced.', col: '#F59E0B'},
        {time: 'Without progress', event: 'LDL stays >100, TG rises: accelerated arterial disease.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Continue Atorvastatin 10mg', desc: 'LDL declining 2 mg/dL/month. Discuss 20mg if plateau >100 at Sep 2026.', pri: 'high', ico: 'medkit-outline'},
      {title: 'Reduce Dinner Carbohydrates', desc: 'Replace rice + 3 rotis with 1 roti + dal + vegetables.', pri: 'high', ico: 'restaurant-outline'},
      {title: 'Add Omega-3 Sources', desc: 'Sardines, walnuts, flaxseed. Reduces TG 10\u201330%.', pri: 'medium', ico: 'leaf-outline'},
    ],
    care: {
      treat: [
        'Atorvastatin 10mg ON daily \u2014 continue (97% adherence)',
        'LDL target <100 mg/dL for T2DM (currently 118, declining)',
        'Annual LFT while on statin',
        'Consider Ezetimibe if LDL plateaus above 100 at Sep 2026',
      ],
      prev: 'Annual lipid panel. Replace saturated fats with unsaturated. Carb reduction is the TG intervention.',
    },
    prog: {
      primary: {lbl: 'LDL', val: 118, lo: 70, hi: 100, unit: 'mg/dL', col: '#D97706'},
      panels: [
        {lbl: 'LDL trajectory', cls: 'tl', score: '118', bar: 55, badge: '\u2193 Improving', badge_col: '#16A34A', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'LDL 145 \u2192 118 over 2.5 years on Atorvastatin. Target <100 by Sep 2026.'},
        {lbl: 'TG control', cls: 'pu', score: '162', bar: 42, badge: '\u2194 Stable', badge_col: '#D97706', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'TG 162 (target <150). Flat 18 months. Dietary carb reduction needed.'},
        {lbl: 'HDL protection', cls: 'bl', score: '52', bar: 80, badge: '\u2713 Adequate', badge_col: '#16A34A', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'HDL 52 (target 50\u201380). Holding steady. Steps should push to 55\u201357.'},
      ],
      hist: [
        {dt: 'Sep 23', v: 145, st: 'h'}, {dt: 'Mar 24', v: 138, st: 'h'}, {dt: 'Sep 24', v: 132, st: 'h'},
        {dt: 'Dec 24', v: 128, st: 'h'}, {dt: 'Sep 25', v: 122, st: 'h'}, {dt: 'Mar 26', v: 118, st: 'h'},
      ],
      histLabel: 'LDL cholesterol trend',
    },
  },

  heart: {
    name: 'Heart',
    cat: 'Cardiovascular',
    col: '#EF4444',
    hdr: [
      {lbl: 'EF', val: '62%', unit: 'Echo normal', col: '#16A34A'},
      {lbl: 'HRV', val: '28ms', unit: 'low', col: '#DC2626'},
      {lbl: 'BP load', val: '136/86', unit: 'mmHg', col: '#D97706'},
      {lbl: 'Risk', val: 'Moderate', unit: '10yr', col: '#D97706'},
    ],
    ayu: {
      urgency: 'medium',
      narrative:
        "Echo EF 62% normal, ECG NSR. But HRV 28ms is low \u2014 reflecting poor sleep and chronic sympathetic activation. Three pressures: T2DM-driven atherosclerotic risk, HTN, and anaemia compensation. Improving sleep is the primary HRV intervention.",
      corrs: [
        {lbl: 'HRV \u2192 sleep quality', val: 'HRV 28ms below 40ms threshold. Each hour of sleep raises HRV by 3\u20135ms.'},
        {lbl: 'Anaemia \u2192 cardiac compensation', val: 'Hb 11.8 forces higher cardiac output \u2192 breathlessness on exertion.'},
        {lbl: 'BP \u2192 LV load', val: 'Chronic 136/86 adds 8% extra systolic pressure. Window to prevent LVH is open.'},
        {lbl: 'LDL + TG \u2192 atherogenic risk', val: 'LDL:HDL ratio 2.27 (target <2.0). Atorvastatin reducing trajectory.'},
      ],
    },
    insight: {
      desc: 'Heart structurally normal (Echo EF 62%, ECG NSR) but under functional stress from T2DM atherosclerotic risk, HTN 136/86, and anaemia compensation. HRV 28ms is the most actionable marker.',
      symp: [
        'Breathlessness on exertion',
        'Palpitations on stairs',
        'Occasional chest tightness on stress days',
        'VO\u2082 max 28 mL/kg/min \u2014 low normal',
      ],
      causes: [
        'T2DM endothelial dysfunction',
        'HTN 136/86 chronic pressure overload',
        'Anaemia forcing cardiac compensation',
        'Sleep deprivation suppressing HRV',
        'LDL 118 + TG 162 lipid burden',
      ],
    },
    organs: [
      {n: 'Coronary Arteries', c: '#EF4444', stage: 'Atherogenic Risk', sev: 52, impact: 'T2DM endothelial dysfunction + LDL 118 + TG 162 create an atherogenic environment. Small dense LDL from TG elevation is 3\u00D7 more likely to penetrate arterial intima. Atorvastatin is reducing LDL trajectory but TG remains elevated.'},
      {n: 'Left Ventricle', c: '#EF4444', stage: 'Pressure Load', sev: 40, impact: 'Chronic BP 136/86 means the LV is working against 8% extra systolic pressure. Echo EF 62% is currently normal but sustained HTN above target leads to LV remodelling and eventual hypertrophy within 3\u20135 years.'},
      {n: 'Autonomic NS', c: '#7C3AED', stage: 'HRV Suppressed', sev: 48, impact: 'HRV 28ms is below the 40ms threshold for healthy autonomic balance. Chronic sleep debt (5.9h) prevents nocturnal parasympathetic recovery. This sustained sympathetic dominance increases cardiac workload and arrhythmia susceptibility.'},
    ],
    cluster: {
      risk: '52%', name: 'Cardiometabolic Risk Cluster',
      desc: 'Cardiac risk in Priya is subclinical but real \u2014 driven by the convergence of T2DM, HTN, dyslipidaemia, and anaemia. Structural heart is normal but functional markers (HRV, VO\u2082 max) are abnormal.',
      diseases: [
        {n: 'Coronary Artery Disease', p: 50, type: 'emerging'},
        {n: 'LV Hypertrophy', p: 30, type: 'watch'},
        {n: 'Cardiac Autonomic Neuropathy', p: 38, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: 'EF 62% normal. HRV 28ms low. BP 136/86. Subclinical atherogenic risk.', col: '#D97706'},
        {time: '6 months', event: 'With BP <130/80 + sleep: HRV targets 38\u201342ms.', col: '#F97316'},
        {time: '2\u20133 years', event: 'If controlled: coronary risk stabilises, LVH eliminated.', col: '#F59E0B'},
        {time: 'Without control', event: 'LVH possible by 3\u20135 years. CV event risk 2\u20133\u00D7.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: '7h Sleep \u2014 HRV Recovery', desc: 'Each hour raises HRV 3\u20135ms. Target: HRV 38+ ms in 8 weeks.', pri: 'high', ico: 'moon-outline'},
      {title: 'Reach BP Target <130/80', desc: 'Every 10 mmHg systolic reduction prevents LVH.', pri: 'high', ico: 'heart-outline'},
      {title: 'LDL to <100 mg/dL', desc: 'Atorvastatin on track \u2014 confirm at Sep 2026.', pri: 'medium', ico: 'medkit-outline'},
    ],
    care: {
      treat: [
        'Manage BP, LDL, sleep, anaemia \u2014 no cardiac-specific med needed',
        'Annual ECG as part of T2DM review',
        'Echo repeat if BP >135/85 persists for 12 months',
      ],
      prev: 'Cardiac health protected by: HbA1c <7.0%, BP <130/80, LDL <100. Sleep is the most underappreciated cardiac intervention.',
    },
    prog: {
      primary: {lbl: 'HRV', val: 28, lo: 40, hi: 55, unit: 'ms', col: '#EF4444'},
      panels: [
        {lbl: 'Structural', cls: 'tl', score: 'EF 62%', bar: 92, badge: '\u2713 Normal', badge_col: '#16A34A', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'Echo EF 62% \u2014 normal. ECG NSR. No structural abnormality.'},
        {lbl: 'Autonomic (HRV)', cls: 'pu', score: '28ms', bar: 35, badge: '\u2193 Low', badge_col: '#DC2626', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'HRV 28ms vs target 40\u201355ms. Driven by poor sleep and stress.'},
        {lbl: 'Pressure load', cls: 'bl', score: '136/86', bar: 55, badge: '\u2191 Above target', badge_col: '#D97706', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'BP 136/86 vs <130/80. Olmesartan working. Activity + sodium will close gap.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 32, st: 'l'}, {dt: 'Nov 25', v: 30, st: 'l'}, {dt: 'Dec 25', v: 29, st: 'l'},
        {dt: 'Jan 26', v: 27, st: 'l'}, {dt: 'Feb 26', v: 28, st: 'l'}, {dt: 'Mar 26', v: 28, st: 'l'},
      ],
      histLabel: 'HRV (ms) trend',
    },
  },

  kidneys: {
    name: 'Kidneys',
    cat: 'Renal',
    col: '#3B82F6',
    hdr: [
      {lbl: 'eGFR', val: '72', unit: 'mL/min', col: '#D97706'},
      {lbl: 'Microalbumin', val: '18', unit: 'mg/L', col: '#16A34A'},
      {lbl: 'BP target', val: '136/86', unit: 'vs <130/80', col: '#D97706'},
      {lbl: 'CKD stage', val: 'Stage 2', unit: 'borderline', col: '#D97706'},
    ],
    ayu: {
      urgency: 'medium',
      narrative:
        "eGFR 72 stable for 18 months. Microalbumin normal. Olmesartan is holding the line. BP and HbA1c are the two determinants of whether eGFR holds or declines.",
      corrs: [
        {lbl: 'BP \u2192 eGFR protection', val: 'Each 10 mmHg systolic reduction slows eGFR decline by ~30%.'},
        {lbl: 'HbA1c \u2192 nephropathy risk', val: 'HbA1c >7.5% for 3+ years carries significant microalbumin risk.'},
        {lbl: 'Olmesartan \u2192 glomerular pressure', val: 'Reduces intraglomerular pressure. 96% adherence = full renoprotective benefit.'},
      ],
    },
    insight: {
      desc: 'Kidneys stable but vulnerable: eGFR 72 mL/min (CKD Stage 2), microalbumin 18 mg/L (normal). Olmesartan at 96% adherence is the primary protective factor.',
      symp: [
        'Currently asymptomatic',
        'Ankle oedema from Amlodipine (not kidney failure)',
        'Fatigue has minor renal anaemia component',
      ],
      causes: [
        'T2DM chronic hyperglycaemia damages glomeruli',
        'HTN damages renal microvasculature',
        'Age-related eGFR decline (~1 mL/min/year)',
      ],
    },
    organs: [
      {n: 'Glomeruli', c: '#3B82F6', stage: 'CKD Stage 2', sev: 42, impact: 'eGFR 72 mL/min places Priya in CKD Stage 2 (60\u201390 range). Glomerular filtration is reduced but stable for 18 months. T2DM hyperglycaemia causes mesangial expansion and basement membrane thickening. Olmesartan reduces intraglomerular pressure directly.'},
      {n: 'Heart', c: '#EF4444', stage: 'Cardiorenal Risk', sev: 38, impact: 'Cardiorenal syndrome means kidney and heart dysfunction are bidirectional. CKD Stage 2 modestly increases cardiac preload and contributes to BP resistance. Conversely, uncontrolled HTN accelerates renal decline.'},
      {n: 'Bones', c: '#8B5CF6', stage: 'CKD-Mineral Disorder', sev: 28, impact: 'At eGFR 72, early CKD-mineral metabolism changes may begin. Phosphate handling is preserved but Vit D activation (1,25-dihydroxyvitamin D) begins to decline, compounding the existing Vit D deficiency of 18 ng/mL.'},
    ],
    cluster: {
      risk: '40%', name: 'Cardiorenal-Metabolic Cluster',
      desc: 'Kidney function in Priya is determined by two upstream conditions: T2DM (glycaemic damage) and HTN (pressure damage). Olmesartan addresses both pathways simultaneously.',
      diseases: [
        {n: 'CKD Progression', p: 42, type: 'watch'},
        {n: 'Diabetic Nephropathy', p: 38, type: 'watch'},
        {n: 'Cardiovascular Disease', p: 50, type: 'emerging'},
      ],
      timeline: [
        {time: 'Now', event: 'eGFR 72 stable. Microalbumin 18 normal. Olmesartan protecting.', col: '#16A34A'},
        {time: '1 year', event: 'If BP <130/80 and HbA1c <7.0%: eGFR stable or improving.', col: '#F97316'},
        {time: '3\u20135 years', event: 'Without control: eGFR may decline to Stage 3 (<60).', col: '#F59E0B'},
      ],
    },
    actions: [
      {title: 'Control BP to <130/80', desc: 'Single most effective renal protection intervention.', pri: 'high', ico: 'heart-outline'},
      {title: 'Avoid NSAIDs', desc: 'Ibuprofen reduces renal perfusion. Use paracetamol only.', pri: 'high', ico: 'close-circle-outline'},
      {title: 'Hydrate to 2.5L/day', desc: 'Chronic dehydration raises microalbumin transiently.', pri: 'medium', ico: 'water-outline'},
    ],
    care: {
      treat: [
        'Olmesartan 20mg OD \u2014 maintain 96% adherence',
        'Target BP <130/80',
        'Annual kidney panel: eGFR, microalbumin, creatinine',
        'Avoid NSAIDs, contrast dyes',
      ],
      prev: 'CKD progression preventable with BP and HbA1c control. Microalbumin remaining normal at 5 years of T2DM is a success.',
    },
    prog: {
      primary: {lbl: 'eGFR', val: 72, lo: 60, hi: 90, unit: 'mL/min', col: '#3B82F6'},
      panels: [
        {lbl: 'Filtration (eGFR)', cls: 'tl', score: '72', bar: 68, badge: '\u2194 Stable', badge_col: '#16A34A', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'eGFR 72 in CKD Stage 2 range (60\u201390). Stable 18 months.'},
        {lbl: 'Proteinuria', cls: 'pu', score: '18 mg/L', bar: 88, badge: '\u2713 Normal', badge_col: '#16A34A', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'Microalbumin 18 (target <30). Normal all readings. Olmesartan protecting.'},
        {lbl: 'BP load', cls: 'bl', score: '136/86', bar: 55, badge: '\u2191 Above', badge_col: '#D97706', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'BP 136/86 vs <130/80. Most modifiable renal risk factor.'},
      ],
      hist: [
        {dt: 'Sep 24', v: 74, st: 'n'}, {dt: 'Dec 24', v: 73, st: 'n'}, {dt: 'Mar 25', v: 73, st: 'n'},
        {dt: 'Sep 25', v: 72, st: 'n'}, {dt: 'Dec 25', v: 72, st: 'n'}, {dt: 'Mar 26', v: 72, st: 'n'},
      ],
      histLabel: 'eGFR (mL/min) trend',
    },
  },

  liver: {
    name: 'Liver',
    cat: 'Hepatic',
    col: '#06B6D4',
    hdr: [
      {lbl: 'NAFLD', val: 'Grade 1', unit: 'USG 2023', col: '#D97706'},
      {lbl: 'TG', val: '162', unit: 'mg/dL', col: '#D97706'},
      {lbl: 'BMI', val: '25.0', unit: 'borderline', col: '#D97706'},
      {lbl: 'Last scan', val: '2023', unit: '3 yrs ago', col: '#DC2626'},
    ],
    ayu: {
      urgency: 'medium',
      narrative:
        "NAFLD is the hepatic manifestation of insulin resistance. 58% carbohydrate diet + TG 162 = ongoing liver fat deposition. Weight loss of 5% (3.4kg) is the evidence-based reversal threshold \u2014 Priya has lost 1.2kg already.",
      corrs: [
        {lbl: 'Carb intake \u2192 liver fat', val: 'Reducing from 58% to <50% directly reduces hepatic lipogenesis.'},
        {lbl: 'TG 162 \u2192 NAFLD signal', val: 'TG above 150 means liver is in positive fat-storage balance.'},
        {lbl: 'Weight loss \u2192 NAFLD regression', val: '5% BW loss (3.4kg from 68kg) is the threshold. 1.2kg done, 2.2kg to go.'},
      ],
    },
    insight: {
      desc: 'Grade 1 NAFLD confirmed USG 2023 \u2014 no follow-up scan in 3 years. Driven by excess dietary carbs converted to TG deposited as liver fat. Reversible at Grade 1.',
      symp: [
        'Usually asymptomatic at Grade 1',
        'Fatigue from metabolic inefficiency',
      ],
      causes: [
        'High-carb diet (58%) driving de novo lipogenesis',
        'Insulin resistance routing glucose to hepatic fat',
        'Adiposity (BMI 25, waist 86 cm)',
      ],
    },
    organs: [
      {n: 'Liver cells', c: '#06B6D4', stage: 'Grade 1 Steatosis', sev: 45, impact: 'Grade 1 steatosis means 5\u201310% of hepatocytes contain fat vacuoles. This is the earliest reversible stage. Continued carbohydrate excess drives de novo lipogenesis \u2014 the liver converts excess glucose to fatty acids and stores them as triglycerides within hepatocytes.'},
      {n: 'Pancreas', c: '#F59E0B', stage: 'Insulin Resistance', sev: 55, impact: 'NAFLD and pancreatic insulin resistance form a bidirectional loop. Hepatic fat causes hepatic insulin resistance, which forces the pancreas to produce more insulin. This hyperinsulinaemia paradoxically drives more hepatic fat storage.'},
      {n: 'Heart', c: '#EF4444', stage: 'NAFLD-CV Link', sev: 38, impact: 'NAFLD is independently associated with 2\u00D7 cardiovascular risk even after adjusting for traditional risk factors. The liver in NAFLD produces atherogenic VLDL particles that contribute to coronary plaque formation.'},
    ],
    cluster: {
      risk: '55%', name: 'Metabolic Liver Cluster',
      desc: 'NAFLD in Priya is not a liver-only condition \u2014 it is the hepatic expression of systemic insulin resistance. Same interventions that improve T2DM directly reverse NAFLD.',
      diseases: [
        {n: 'NAFLD \u2192 NASH', p: 25, type: 'watch'},
        {n: 'T2DM Worsening', p: 55, type: 'active'},
        {n: 'Dyslipidaemia', p: 65, type: 'active'},
      ],
      timeline: [
        {time: 'Now', event: 'Grade 1 NAFLD. No LFT recently. No follow-up USG for 3 years.', col: '#D97706'},
        {time: '6 months', event: 'With 5% weight loss + carb reduction: hepatic fat reduces. Repeat USG.', col: '#F97316'},
        {time: 'Without change', event: 'Grade 1 \u2192 Grade 2 in 2\u20133 years. Fibrosis risk begins.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Lose 3.4kg (5% of BW)', desc: 'Evidence-based NAFLD reversal. 1.2kg done, 2.2kg to go.', pri: 'high', ico: 'fitness-outline'},
      {title: 'Reduce Carbs to <50%', desc: 'Most direct lever for hepatic de novo lipogenesis.', pri: 'high', ico: 'restaurant-outline'},
      {title: 'Annual LFT (AST/ALT)', desc: 'Not in recent panel. Grade 1 may be progressing silently.', pri: 'medium', ico: 'flask-outline'},
    ],
    care: {
      treat: [
        'No medication for NAFLD Grade 1 \u2014 lifestyle is the treatment',
        'Weight loss target: 3.4kg (5% BW)',
        'Dietary carb reduction to <50%',
        'Repeat liver USG by Oct 2026',
      ],
      prev: 'Grade 1 NAFLD is one of the most reversible conditions. Same interventions that improve T2DM directly reverse NAFLD.',
    },
    prog: {
      primary: {lbl: 'NAFLD Grade', val: 1, lo: 0, hi: 0.5, unit: 'grade', col: '#06B6D4'},
      panels: [
        {lbl: 'Steatosis grade', cls: 'tl', score: 'Grade 1', bar: 50, badge: '\u2194 Stable', badge_col: '#D97706', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'Grade 1 (5\u201310% hepatocyte fat). Diagnosed 2023, no follow-up. Reversible.'},
        {lbl: 'TG trend', cls: 'pu', score: '162', bar: 42, badge: '\u2194 Flat', badge_col: '#D97706', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'TG 162 (target <150). Flat 18 months. Reducing carbs will reduce TG and liver fat.'},
        {lbl: 'Weight loss', cls: 'bl', score: '\u22121.2kg', bar: 35, badge: '\u2191 Progress', badge_col: '#16A34A', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: '\u22121.2kg since Jan 2026. Target 3.4kg total for NAFLD reversal. 35% there.'},
      ],
      hist: [
        {dt: 'USG 2023', v: 1, st: 'h'}, {dt: 'Sep 24', v: 1, st: 'h'}, {dt: 'Dec 24', v: 1, st: 'h'},
        {dt: 'Mar 25', v: 1, st: 'h'}, {dt: 'Sep 25', v: 1, st: 'h'}, {dt: 'Mar 26', v: 1, st: 'h'},
      ],
      histLabel: 'NAFLD grade trend (estimated)',
    },
  },

  eyes: {
    name: 'Eyes',
    cat: 'Ophthalmology',
    col: '#8B5CF6',
    hdr: [
      {lbl: 'Fundus', val: 'None', unit: 'overdue 5yr', col: '#DC2626'},
      {lbl: 'HbA1c yrs', val: '3+', unit: 'years >7.5%', col: '#DC2626'},
      {lbl: 'Risk', val: '20-30%', unit: 'estimated', col: '#DC2626'},
      {lbl: 'Priority', val: 'URGENT', unit: 'book now', col: '#DC2626'},
    ],
    ayu: {
      urgency: 'high',
      narrative:
        "With HbA1c above 7.5% for 3+ years and zero fundus exams, Priya is in the window where early diabetic retinopathy develops silently. 5 years post-diagnosis with zero eye screenings. Estimated 20\u201330% probability of background retinopathy already present.",
      corrs: [
        {lbl: 'HbA1c duration \u2192 retinopathy', val: 'HbA1c >7.5% for 3+ years carries significantly elevated risk of background retinopathy.'},
        {lbl: 'HTN \u2192 retinopathy', val: 'BP 136/86 causes independent hypertensive retinal changes. T2DM + HTN = additive damage.'},
        {lbl: 'Zero exams in 5 years', val: '5 exams overdue. Standard: annual from diagnosis. Retinopathy at early stage is treatable.'},
      ],
    },
    insight: {
      desc: 'No dilated fundus exam on record. HbA1c >7.5% for 3+ years. This is the highest-priority unaddressed screening gap. Early retinopathy is treatable; advanced is not.',
      symp: [
        'Asymptomatic until late',
        'Blurred vision on high-glucose days (may have retinal component)',
        'Floaters or dark spots (advanced \u2014 not reported)',
      ],
      causes: [
        'T2DM 5 years damaging retinal microvasculature',
        'HbA1c >7.5% for 3+ years',
        'HTN 136/86 additive retinal damage',
        'No fundus exam for early detection',
      ],
    },
    organs: [
      {n: 'Retina', c: '#8B5CF6', stage: 'High-Risk Unscreened', sev: 60, impact: 'The retina is the most vulnerable microvascular target of T2DM. With HbA1c >7.5% for 3+ years, retinal capillary basement membrane thickening, microaneurysms, and early haemorrhages may already be present. Background retinopathy is treatable \u2014 but only if detected.'},
      {n: 'Optic nerve', c: '#8B5CF6', stage: 'T2DM risk', sev: 30, impact: 'T2DM carries increased risk of optic nerve ischaemia. At current glycaemic control (HbA1c 7.8%), the optic nerve head microvasculature is under chronic hypoxic stress.'},
      {n: 'Lens', c: '#D97706', stage: 'Cataract risk', sev: 28, impact: 'T2DM accelerates cataract formation via sorbitol pathway \u2014 glucose is converted to sorbitol in the lens, causing osmotic swelling. Risk is cumulative with HbA1c duration and level.'},
    ],
    cluster: {
      risk: '65%', name: 'Diabetic Microvascular Eye Cluster',
      desc: 'Eyes are the most time-sensitive screening gap in Priya\u2019s profile. Early diabetic retinopathy is 95% treatable with laser. Advanced retinopathy causes irreversible vision loss.',
      diseases: [
        {n: 'Diabetic Retinopathy', p: 45, type: 'emerging'},
        {n: 'Diabetic Maculopathy', p: 25, type: 'watch'},
        {n: 'Hypertensive Retinopathy', p: 35, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: 'Zero fundus exams. 5 yrs T2DM. 20\u201330% retinopathy probability.', col: '#EF4444'},
        {time: '2 weeks', event: 'Book dilated fundus exam immediately.', col: '#F97316'},
        {time: '3 months', event: 'If found: laser + HbA1c control prevents progression.', col: '#F59E0B'},
        {time: 'Without exam', event: 'Proliferative retinopathy risk by 2028. Irreversible vision loss.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Book Fundus Exam \u2014 This Week', desc: 'Most urgent action. AIIMS or LV Prasad Eye Institute.', pri: 'high', ico: 'eye-outline'},
      {title: 'Control HbA1c to <7.0%', desc: 'Every 1% reduction reduces retinopathy progression by 39%.', pri: 'high', ico: 'analytics-outline'},
      {title: 'Annual Dilated Exam Going Forward', desc: 'Once baseline established, annual screening is standard.', pri: 'medium', ico: 'calendar-outline'},
    ],
    care: {
      treat: [
        'URGENT: Dilated fundus exam \u2014 book within 2 weeks',
        'Annual dilated exam from this point',
        'If retinopathy: HbA1c <7.0% + BP <130/80 + 6-monthly ophthalmology',
        'If maculopathy: anti-VEGF injections',
      ],
      prev: 'Annual dilated fundus exam is the only method to detect retinopathy before symptoms. Window for reversible treatment is background and pre-proliferative stages.',
    },
    prog: {
      primary: {lbl: 'Screening Gap', val: 5, lo: 0, hi: 1, unit: 'yrs', col: '#8B5CF6'},
      panels: [
        {lbl: 'Screening status', cls: 'tl', score: '0 exams', bar: 0, badge: '\u26A0 Overdue', badge_col: '#DC2626', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'Zero fundus exams in 5 years of T2DM. Highest-priority screening gap.'},
        {lbl: 'Glycaemic risk', cls: 'pu', score: '3+ yrs', bar: 72, badge: '\u2191 High', badge_col: '#DC2626', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'HbA1c >7.5% for 3+ years. Progressive retinal microangiopathy.'},
        {lbl: 'BP risk', cls: 'bl', score: '136/86', bar: 55, badge: 'Additive', badge_col: '#D97706', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'HTN adds independent hypertensive retinal changes on top of T2DM.'},
      ],
      hist: [
        {dt: '2021', v: 0, st: 'l'}, {dt: '2022', v: 0, st: 'l'}, {dt: '2023', v: 0, st: 'l'},
        {dt: '2024', v: 0, st: 'l'}, {dt: '2025', v: 0, st: 'l'}, {dt: '2026', v: 0, st: 'l'},
      ],
      histLabel: 'Fundus exams completed (0 of 5 annual)',
    },
  },

  feet: {
    name: 'Feet',
    cat: 'Neuropathy',
    col: '#F59E0B',
    hdr: [
      {lbl: 'Tingling', val: '5\u00D7', unit: 'this month', col: '#DC2626'},
      {lbl: 'Monofilament', val: 'Pending', unit: 'not done', col: '#DC2626'},
      {lbl: 'B12', val: '312', unit: 'pg/mL', col: '#D97706'},
      {lbl: 'Physio', val: '3 done', unit: 'active', col: '#16A34A'},
    ],
    ayu: {
      urgency: 'high',
      narrative:
        "Foot tingling 5 episodes bilateral is a red flag. Three simultaneous neuropathy risk factors: T2DM glycation, B12 demyelination from Metformin, and deconditioning. Monofilament test is the standard screening \u2014 not yet done.",
      corrs: [
        {lbl: 'HbA1c \u2192 glycation', val: 'HbA1c >7.5% for 3+ years causes progressive myelin glycation.'},
        {lbl: 'B12 decline \u2192 demyelination', val: 'B12 312 pg/mL declining. Two simultaneous demyelination pathways compound tingling.'},
        {lbl: 'Methylcobalamin \u2192 recovery', val: 'Started 5 Mar at 84% adherence. At 84%, improvement takes 3\u20134 months instead of 6\u20138 weeks.'},
      ],
    },
    insight: {
      desc: 'Bilateral foot tingling 5\u00D7 this month. Early peripheral neuropathy from T2DM glycation + Metformin-induced B12 depletion. Monofilament test not yet done.',
      symp: [
        'Bilateral foot tingling 5\u00D7/month',
        'Worse at night',
        'Knee pain 4\u00D7/month',
        'Possible reduced sensation (monofilament needed)',
      ],
      causes: [
        'T2DM glycation of myelin sheaths',
        'Metformin-induced B12 malabsorption',
        'Deconditioning reducing peripheral perfusion',
        'No monofilament test done',
      ],
    },
    organs: [
      {n: 'Peripheral nerves', c: '#F59E0B', stage: 'Early Demyelination', sev: 52, impact: 'T2DM glycation of myelin sheaths combined with Metformin-induced B12 decline creates two simultaneous demyelination pathways. Bilateral tingling 5\u00D7/month indicates nerve conduction is impaired. This is reversible if B12 is repleted and HbA1c reaches target within 12 months.'},
      {n: 'Feet vasculature', c: '#EF4444', stage: 'Perfusion Risk', sev: 40, impact: 'T2DM causes progressive peripheral arterial disease. Reduced foot perfusion combined with neuropathy creates the classic diabetic foot risk: loss of protective sensation + poor blood supply = ulcer risk. Currently early stage \u2014 prevention window is open.'},
    ],
    cluster: {
      risk: '55%', name: 'Diabetic Neuropathy Cluster',
      desc: 'Feet are at the intersection of two pathways: glycation damage (T2DM) and demyelination (B12 deficiency from Metformin). Both are treatable if addressed within the current window.',
      diseases: [
        {n: 'Peripheral Neuropathy', p: 52, type: 'active'},
        {n: 'Diabetic Foot Ulcer', p: 15, type: 'watch'},
        {n: 'B12 Deficiency Neuropathy', p: 45, type: 'emerging'},
      ],
      timeline: [
        {time: 'Now', event: '5 tingling episodes/month. B12 declining. Methylcobalamin started.', col: '#EF4444'},
        {time: '6\u20138 weeks', event: 'B12-pathway tingling may reduce 30\u201350%.', col: '#F97316'},
        {time: '12 months', event: 'If HbA1c <7.0%: glycation slows. Tingling frequency declines.', col: '#F59E0B'},
        {time: 'Without control', event: 'Loss of protective sensation \u2192 foot ulcer risk.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Monofilament Test \u2014 Next Visit', desc: '10g test takes 3 minutes and quantifies sensory loss.', pri: 'high', ico: 'footsteps-outline'},
      {title: 'Continue Methylcobalamin 500mcg', desc: 'B12-pathway is the treatable component. Reach 95% adherence.', pri: 'high', ico: 'medkit-outline'},
      {title: 'Daily Foot Inspection', desc: 'Check both feet for cuts, blisters, redness. 30 seconds daily.', pri: 'medium', ico: 'search-outline'},
    ],
    care: {
      treat: [
        'Methylcobalamin 500mcg OD \u2014 increase to >95%',
        'Monofilament test at next GP visit',
        'Physiotherapy: continue remaining 3 sessions',
        'HbA1c control: primary neuropathy treatment',
      ],
      prev: 'Maintain HbA1c <7.0%, supplement B12 while on Metformin, annual monofilament screening.',
    },
    prog: {
      primary: {lbl: 'Tingling Episodes', val: 5, lo: 0, hi: 2, unit: '/month', col: '#F59E0B'},
      panels: [
        {lbl: 'Neuropathy symptoms', cls: 'tl', score: '5\u00D7/mo', bar: 75, badge: '\u2191 Worsening', badge_col: '#DC2626', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'Bilateral tingling 5\u00D7/month. Monofilament baseline not done.'},
        {lbl: 'B12 (driver)', cls: 'pu', score: '312', bar: 32, badge: '\u2193 Declining', badge_col: '#DC2626', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'B12 312 declining. Methylcobalamin 500mcg started 5 Mar.'},
        {lbl: 'Glycaemic (driver)', cls: 'bl', score: '7.8%', bar: 40, badge: '\u2191 Above', badge_col: '#DC2626', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'HbA1c 7.8% is the primary neuropathy driver.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 2, st: 'l'}, {dt: 'Nov 25', v: 3, st: 'l'}, {dt: 'Dec 25', v: 3, st: 'l'},
        {dt: 'Jan 26', v: 4, st: 'h'}, {dt: 'Feb 26', v: 4, st: 'h'}, {dt: 'Mar 26', v: 5, st: 'h'},
      ],
      histLabel: 'Tingling episodes per month',
    },
  },

  nerves: {
    name: 'Nerves',
    cat: 'Neurology',
    col: '#7C3AED',
    hdr: [
      {lbl: 'PHQ-9', val: '8', unit: 'mild depr.', col: '#D97706'},
      {lbl: 'GAD-7', val: '6', unit: 'mild anxiety', col: '#D97706'},
      {lbl: 'B12', val: '312', unit: 'pg/mL', col: '#D97706'},
      {lbl: 'Vit D', val: '18', unit: 'ng/mL', col: '#DC2626'},
    ],
    ayu: {
      urgency: 'medium',
      narrative:
        "Nervous system affected at two levels: peripheral (neuropathy) and central (mild depression + anxiety). Not just stress \u2014 measurable biochemical drivers: B12, Vit D, poor sleep, hyperglycaemia.",
      corrs: [
        {lbl: 'B12 \u2192 peripheral neuropathy', val: 'B12 312 declining. Foot tingling 5\u00D7/month is the manifestation.'},
        {lbl: 'Vit D \u2192 serotonin', val: 'VDR in hippocampus regulates serotonin. Vit D 18 impairs mood regulation.'},
        {lbl: 'Sleep \u2192 neural restoration', val: 'Deep sleep 18% (target >20%). 7h sleep is neural medicine.'},
      ],
    },
    insight: {
      desc: 'Peripheral (foot tingling) and central (PHQ-9: 8, GAD-7: 6) nervous system affected. B12 deficiency, Vit D deficiency, poor sleep, and chronic hyperglycaemia are the drivers.',
      symp: [
        'Foot tingling 5\u00D7/month',
        'Mood score 6.4/10, PHQ-9: 8',
        'GAD-7: 6 (mild anxiety)',
        'Brain fog, difficulty concentrating',
        'Fatigue (multi-factorial)',
      ],
      causes: [
        'T2DM glycation of peripheral nerves',
        'Metformin-induced B12 decline',
        'Vit D deficiency (18 ng/mL)',
        'Poor sleep (5.9h)',
        'Chronic stress',
      ],
    },
    organs: [
      {n: 'Peripheral nerves', c: '#F59E0B', stage: 'Early Neuropathy', sev: 52, impact: 'Two simultaneous demyelination pathways: T2DM glycation damages myelin sheaths directly, while Metformin-induced B12 decline (312 pg/mL) impairs myelin synthesis. The result is bilateral foot tingling 5\u00D7/month that worsens at night.'},
      {n: 'Brain', c: '#7C3AED', stage: 'Multi-factor stress', sev: 50, impact: 'PHQ-9 of 8 (mild depression) and GAD-7 of 6 (mild anxiety) are not purely psychological \u2014 they have measurable biochemical drivers. Vit D 18 ng/mL impairs hippocampal serotonin production. B12 decline impairs neural methylation. Sleep deficit of 1.1h/night reduces BDNF.'},
    ],
    cluster: {
      risk: '48%', name: 'Neurological-Metabolic Cluster',
      desc: 'Neurological symptoms in Priya are metabolic in origin \u2014 driven by measurable deficiencies (B12, Vit D), poor sleep, and chronic hyperglycaemia. All drivers are treatable.',
      diseases: [
        {n: 'Peripheral Neuropathy', p: 52, type: 'active'},
        {n: 'Mild Depression', p: 48, type: 'active'},
        {n: 'Mild Anxiety', p: 45, type: 'active'},
      ],
      timeline: [
        {time: 'Now', event: 'PHQ-9 8, GAD-7 6. Foot tingling 5\u00D7/month. Three modifiable drivers.', col: '#D97706'},
        {time: '3 months', event: 'With B12 + Vit D + 7h sleep: PHQ-9 expected 5\u20136.', col: '#F97316'},
        {time: 'Without treatment', event: 'PHQ-9 may reach 10+ (moderate depression). Neuropathy irreversible.', col: '#9CA3AF'},
      ],
    },
    actions: [
      {title: 'Sleep 7 Hours \u2014 Neural Medicine', desc: 'Deep sleep restores hippocampal BDNF. Most impactful.', pri: 'high', ico: 'moon-outline'},
      {title: 'Continue Methylcobalamin + Vit D', desc: 'Treating the two biochemical drivers of mood and neuropathy.', pri: 'high', ico: 'medkit-outline'},
      {title: '15-min Daily Walk \u2014 BDNF', desc: '150 min/week raises BDNF by 30% \u2014 equivalent to mild antidepressants.', pri: 'medium', ico: 'walk-outline'},
    ],
    care: {
      treat: [
        'Methylcobalamin 500mcg OD \u2014 >95% adherence',
        'Vit D 60,000 IU weekly \u2014 continue 12 weeks',
        'PHQ-9 + GAD-7 reassessment at Jun 2026',
        'If PHQ-9 >10: CBT referral',
      ],
      prev: 'Neural health = metabolic health: sleep, glucose control, micronutrient sufficiency, physical activity.',
    },
    prog: {
      primary: {lbl: 'PHQ-9', val: 8, lo: 0, hi: 5, unit: '/27', col: '#7C3AED'},
      panels: [
        {lbl: 'Mood (PHQ-9)', cls: 'tl', score: '8/27', bar: 62, badge: 'Mild depr.', badge_col: '#D97706', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'PHQ-9: 8. Three drivers: B12, Vit D, poor sleep. All being treated.'},
        {lbl: 'Anxiety (GAD-7)', cls: 'pu', score: '6/21', bar: 57, badge: 'Mild anxiety', badge_col: '#D97706', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'GAD-7: 6. Primary themes: blood sugar, work-health balance.'},
        {lbl: 'Neuropathy', cls: 'bl', score: '5\u00D7/mo', bar: 75, badge: '\u2191 Worsening', badge_col: '#DC2626', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'Two drivers: T2DM glycation + B12 demyelination.'},
      ],
      hist: [
        {dt: 'Oct 25', v: 6, st: 'l'}, {dt: 'Nov 25', v: 7, st: 'l'}, {dt: 'Dec 25', v: 7, st: 'h'},
        {dt: 'Jan 26', v: 8, st: 'h'}, {dt: 'Feb 26', v: 8, st: 'h'}, {dt: 'Mar 26', v: 8, st: 'h'},
      ],
      histLabel: 'PHQ-9 score trend',
    },
  },

  dental: {
    name: 'Dental',
    cat: 'Oral Health',
    col: '#6B7280',
    hdr: [
      {lbl: 'Last check', val: 'None', unit: 'on record', col: '#DC2626'},
      {lbl: 'T2DM risk', val: '2-3\u00D7', unit: 'periodontal', col: '#D97706'},
      {lbl: 'HbA1c link', val: '+0.3%', unit: 'if active PD', col: '#D97706'},
      {lbl: 'Overdue', val: '5 yrs', unit: 'of checks', col: '#DC2626'},
    ],
    ayu: {
      urgency: 'low',
      narrative:
        "Dental health is a documented T2DM complication vector. T2DM raises periodontal risk 2\u20133\u00D7. Conversely, active periodontal disease raises HbA1c by 0.3\u20130.4% via systemic inflammation.",
      corrs: [
        {lbl: 'T2DM \u2192 periodontal risk', val: '2\u20133\u00D7 higher periodontal disease due to impaired neutrophil function.'},
        {lbl: 'Periodontal \u2192 HbA1c', val: 'Treatment reduces HbA1c by 0.3\u20130.4% via reduced systemic inflammation.'},
        {lbl: 'Dehydration \u2192 xerostomia', val: '1.4L/day reduces saliva, accelerating cavity and gum disease.'},
      ],
    },
    insight: {
      desc: 'No dental check on record. T2DM raises periodontal disease risk 2\u20133\u00D7. Active periodontitis raises systemic inflammation which worsens HbA1c by 0.3\u20130.4%.',
      symp: [
        'Bleeding gums possible',
        'Dry mouth from hyperglycaemia',
        'Sensitivity to hot/cold',
      ],
      causes: [
        'T2DM impairs neutrophil function',
        'Hyperglycaemia raises oral glucose',
        'Dehydration reduces saliva flow',
      ],
    },
    organs: [
      {n: 'Gums', c: '#6B7280', stage: 'Risk \u2014 unscreened', sev: 35, impact: 'T2DM impairs neutrophil function in gingival tissue, reducing the ability to clear periodontal pathogens. This 2\u20133\u00D7 elevated periodontal risk means Priya may already have gingivitis or early periodontitis without symptoms. Undetected periodontal disease creates a systemic inflammatory burden that worsens HbA1c.'},
      {n: 'Teeth', c: '#D97706', stage: 'Caries risk elevated', sev: 25, impact: 'Hyperglycaemia raises oral glucose levels, feeding cariogenic bacteria. Combined with chronic dehydration (1.4L/day) reducing saliva flow and its protective buffering capacity, Priya\u2019s teeth are at elevated caries risk even without dietary sugar.'},
    ],
    cluster: {
      risk: '28%', name: 'Oral-Metabolic Cluster',
      desc: 'Dental health in T2DM is a bidirectional relationship: T2DM worsens periodontal health, and periodontal disease worsens glycaemic control. Treating one helps the other.',
      diseases: [
        {n: 'Periodontal Disease', p: 35, type: 'watch'},
        {n: 'Dental Caries', p: 28, type: 'watch'},
      ],
      timeline: [
        {time: 'Now', event: 'No dental check on record. 5 years T2DM.', col: '#D97706'},
        {time: 'Next month', event: 'Dental check + clean. If PD found: treatment reduces HbA1c 0.3\u20130.4%.', col: '#F97316'},
        {time: '6-monthly', event: 'Regular checks become standard for T2DM.', col: '#F59E0B'},
      ],
    },
    actions: [
      {title: 'Book Dental Appointment', desc: 'Any dentist. Mention T2DM. Ask for periodontal assessment.', pri: 'medium', ico: 'happy-outline'},
      {title: 'Hydration to 2.5L/day', desc: 'More saliva = better bacterial clearance.', pri: 'medium', ico: 'water-outline'},
    ],
    care: {
      treat: [
        'Dental check + clean within 4 weeks',
        'Periodontal assessment given T2DM',
        '6-monthly dental review going forward',
      ],
      prev: 'Twice-daily brushing, daily flossing, 2.5L hydration, 6-monthly professional checks.',
    },
    prog: {
      primary: {lbl: 'Screening Gap', val: 5, lo: 0, hi: 0.5, unit: 'yrs', col: '#6B7280'},
      panels: [
        {lbl: 'Screening gap', cls: 'tl', score: '5 years', bar: 85, badge: '\u26A0 Overdue', badge_col: '#DC2626', lbl_col: '#0F766E', score_col: '#0F766E', detail: 'No dental check on record. 5 years T2DM at 2\u20133\u00D7 periodontal risk.'},
        {lbl: 'Salivary protection', cls: 'pu', score: '1.4L', bar: 22, badge: '\u2193 Low', badge_col: '#D97706', lbl_col: '#7C3AED', score_col: '#7C3AED', detail: 'Hydration 1.4L/day (target 2.5L). Chronic xerostomia.'},
        {lbl: 'Systemic impact', cls: 'bl', score: '\u00B10.3%', bar: 30, badge: 'HbA1c link', badge_col: '#D97706', lbl_col: '#1D4ED8', score_col: '#1D4ED8', detail: 'If active PD present, systemic inflammation raises HbA1c by 0.3\u20130.4%.'},
      ],
      hist: [
        {dt: '2021', v: 0, st: 'l'}, {dt: '2022', v: 0, st: 'l'}, {dt: '2023', v: 0, st: 'l'},
        {dt: '2024', v: 0, st: 'l'}, {dt: '2025', v: 0, st: 'l'}, {dt: '2026', v: 0, st: 'l'},
      ],
      histLabel: 'Dental checks completed (0 of 10 expected)',
    },
  },
};

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────
const ORGAN_ICON_MAP = {
  Liver: 'medical-outline',
  'Liver cells': 'medical-outline',
  Kidneys: 'water-outline',
  Pancreas: 'fitness-outline',
  Heart: 'heart-outline',
  'Blood Vessels': 'pulse-outline',
  Arteries: 'pulse-outline',
  'Coronary Arteries': 'pulse-outline',
  Brain: 'bulb-outline',
  Muscles: 'barbell-outline',
  'Adrenal Glands': 'flash-outline',
  Nerves: 'flash-outline',
  'Peripheral nerves': 'flash-outline',
  'Immune System': 'shield-outline',
  Glomeruli: 'water-outline',
  Bones: 'body-outline',
  'Autonomic NS': 'flash-outline',
  'Left Ventricle': 'heart-outline',
  Retina: 'eye-outline',
  'Optic nerve': 'eye-outline',
  Lens: 'eye-outline',
  'Feet vasculature': 'pulse-outline',
  Gums: 'happy-outline',
  Teeth: 'happy-outline',
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

const MedicalDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const {medicalId} = route.params || {};

  const [activeTab, setActiveTab] = useState('ayuIntel');

  const ls = useMemo(() => {
    return MEDICAL_DATA[medicalId] || MEDICAL_DATA.t2dm;
  }, [medicalId]);

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
            <AppText variant="caption" color="rgba(255,255,255,0.45)" style={{marginTop: vs(2)}}>Medical · March 2026 · Priya Reddy</AppText>
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

export default MedicalDetailScreen;
