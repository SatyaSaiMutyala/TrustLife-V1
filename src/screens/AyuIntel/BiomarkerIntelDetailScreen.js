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
import {BIOMARKERS} from '../../constants/ayuIntelData';
import TrendChart from '../../components/shared/TrendChart';

const {width: SCREEN_W} = Dimensions.get('window');

// ──────────────────────────────────────────────
// Data mapping helpers – convert ayuIntelData.js shapes to detail screen format
// ──────────────────────────────────────────────

const PLACEHOLDER_BIOMARKER = {
  id: 'hba1c',
  name: 'HbA1c',
  category: 'Metabolic',
  unit: '%',
  refRange: '4.0 \u2013 5.6',
  latestValue: 6.8,
  latestRIR: 1.42,
  delta: '+0.3',
  deltaDirection: 'up',
  readingsCount: 8,
  baseline: 5.4,
  urgency: 'Elevated',
  urgencyColor: Colors.amber,
  narrative:
    'Your <b>HbA1c</b> has risen steadily over the past 18 months, crossing into the pre-diabetic range. The <b>rate of increase (0.15 %/quarter)</b> suggests progressive insulin resistance. Combined with your elevated fasting glucose and rising triglycerides, this forms a classic metabolic syndrome pattern.',
  correlations: [
    {label: 'Fasting Glucose', value: '112 mg/dL', status: 'elevated'},
    {label: 'Triglycerides', value: '189 mg/dL', status: 'elevated'},
    {label: 'HOMA-IR', value: '3.8', status: 'high'},
  ],
  history: [
    {date: '2026-03-15', value: 6.8, status: 'elevated', delta: '+0.3'},
    {date: '2025-12-10', value: 6.5, status: 'elevated', delta: '+0.2'},
    {date: '2025-09-05', value: 6.3, status: 'borderline', delta: '+0.4'},
    {date: '2025-06-01', value: 5.9, status: 'borderline', delta: '+0.2'},
    {date: '2025-03-01', value: 5.7, status: 'borderline', delta: '+0.1'},
    {date: '2024-12-01', value: 5.6, status: 'normal', delta: '+0.1'},
    {date: '2024-09-01', value: 5.5, status: 'normal', delta: '+0.1'},
    {date: '2024-06-01', value: 5.4, status: 'normal', delta: '\u2014'},
  ],
  trendChart: [5.4, 5.5, 5.6, 5.7, 5.9, 6.3, 6.5, 6.8],
  trendDates: [
    'Jun 24',
    'Sep 24',
    'Dec 24',
    'Mar 25',
    'Jun 25',
    'Sep 25',
    'Dec 25',
    'Mar 26',
  ],
  refLow: 4.0,
  refHigh: 5.6,
  timeline: [
    {label: 'Now', detail: 'Pre-diabetic range (6.8%)', color: Colors.amber},
    {
      label: '6 months',
      detail: 'Likely > 7.0% \u2014 diabetic threshold',
      color: Colors.red,
    },
    {
      label: '12 months',
      detail: 'HbA1c 7.2\u20137.5%, microvascular risk rises',
      color: Colors.red,
    },
    {
      label: '24 months',
      detail: 'Possible retinopathy / nephropathy screening needed',
      color: Colors.red,
    },
  ],
  about:
    'HbA1c (glycated hemoglobin) measures the average blood glucose level over the past 2\u20133 months. It reflects how well blood sugar is controlled and is a key indicator for diabetes diagnosis and management.',
  symptoms: [
    'Increased thirst and frequent urination',
    'Fatigue and low energy',
    'Blurred vision',
    'Slow-healing wounds',
    'Tingling in hands/feet',
  ],
  causes: [
    'Insulin resistance',
    'High-carb / high-sugar diet',
    'Sedentary lifestyle',
    'Chronic stress / elevated cortisol',
    'Genetic predisposition',
  ],
  progression: {
    currentPosition: 0.68,
    rangeLabels: ['Normal', 'Pre-diabetic', 'Diabetic'],
    rangeBreaks: [0.4, 0.7],
    scores: {
      status: {
        score: 62,
        label: 'Status',
        badge: 'Borderline',
        badgeColor: Colors.amber,
        detail:
          'Value exceeds reference range upper bound. Monitoring required.',
      },
      stability: {
        score: 38,
        label: 'Stability',
        badge: 'Declining',
        badgeColor: Colors.red,
        detail:
          'Consistent upward trend across 8 readings. No plateau detected.',
      },
      velocity: {
        score: 45,
        label: 'Velocity',
        badge: 'Moderate',
        badgeColor: Colors.amber,
        detail:
          'Rate of change: +0.15 %/quarter. Acceleration detected in last 2 readings.',
      },
    },
    hpsHistory: [72, 68, 63, 58, 52, 48, 44, 40],
    measurementTable: [
      {
        date: '15 Mar 2026',
        value: '6.8%',
        delta: '+0.3',
        status: 'Elevated',
        hps: 40,
      },
      {
        date: '10 Dec 2025',
        value: '6.5%',
        delta: '+0.2',
        status: 'Elevated',
        hps: 44,
      },
      {
        date: '05 Sep 2025',
        value: '6.3%',
        delta: '+0.4',
        status: 'Borderline',
        hps: 48,
      },
      {
        date: '01 Jun 2025',
        value: '5.9%',
        delta: '+0.2',
        status: 'Borderline',
        hps: 52,
      },
      {
        date: '01 Mar 2025',
        value: '5.7%',
        delta: '+0.1',
        status: 'Borderline',
        hps: 58,
      },
      {
        date: '01 Dec 2024',
        value: '5.6%',
        delta: '+0.1',
        status: 'Normal',
        hps: 63,
      },
    ],
  },
  organs: [
    {
      name: 'Pancreas',
      stage: 'Stage 2',
      severity: 72,
      trend: 'Worsening',
      icon: 'fitness-outline',
    },
    {
      name: 'Kidneys',
      stage: 'Stage 1',
      severity: 35,
      trend: 'Stable',
      icon: 'water-outline',
    },
    {
      name: 'Eyes',
      stage: 'Stage 0',
      severity: 15,
      trend: 'Stable',
      icon: 'eye-outline',
    },
    {
      name: 'Heart',
      stage: 'Stage 1',
      severity: 42,
      trend: 'Watch',
      icon: 'heart-outline',
    },
  ],
  organDetails: [
    {
      name: 'Pancreas',
      stage: 'Stage 2 \u2014 Beta-cell stress',
      impact:
        'Sustained hyperglycemia is increasing insulin demand. Beta-cell compensation is declining, raising progression risk to Type 2 DM.',
      icon: 'fitness-outline',
    },
    {
      name: 'Kidneys',
      stage: 'Stage 1 \u2014 Early filtration stress',
      impact:
        'Microalbumin levels normal but eGFR shows early decline trend. Sustained HbA1c > 7% would accelerate nephropathy onset.',
      icon: 'water-outline',
    },
    {
      name: 'Eyes',
      stage: 'Stage 0 \u2014 No current damage',
      impact:
        'Retinal screening clear. However, crossing 7% HbA1c threshold significantly increases retinopathy risk within 3\u20135 years.',
      icon: 'eye-outline',
    },
    {
      name: 'Heart',
      stage: 'Stage 1 \u2014 Vascular stress detected',
      impact:
        'Combined with elevated triglycerides and borderline BP, cardiovascular risk score is rising. Endothelial function may be impaired.',
      icon: 'heart-outline',
    },
  ],
  cluster: {
    name: 'Metabolic Syndrome Cluster',
    description:
      'A constellation of interconnected metabolic markers indicating systemic insulin resistance and cardiovascular risk.',
    riskScore: 74,
    diseases: [
      {name: 'Type 2 Diabetes', type: 'Primary', progress: 0.68},
      {name: 'Cardiovascular Disease', type: 'Secondary', progress: 0.42},
      {name: 'Non-Alcoholic Fatty Liver', type: 'Associated', progress: 0.35},
      {name: 'Chronic Kidney Disease', type: 'Downstream', progress: 0.18},
    ],
    timeline: [
      {
        stage: 'Current',
        detail: 'Pre-diabetic with metabolic syndrome features',
        color: Colors.amber,
      },
      {
        stage: '1\u20132 years',
        detail: 'Type 2 DM diagnosis likely without intervention',
        color: Colors.red,
      },
      {
        stage: '3\u20135 years',
        detail: 'Microvascular complications onset risk',
        color: Colors.red,
      },
      {
        stage: '5\u201310 years',
        detail: 'Macrovascular events (MI/stroke) risk elevated',
        color: Colors.red,
      },
    ],
  },
  care: {
    actions: [
      {
        priority: 'High',
        icon: 'restaurant-outline',
        title: 'Dietary intervention',
        description:
          'Reduce refined carbs to < 100g/day. Increase fiber intake to 30g+/day. Mediterranean diet pattern recommended.',
        color: Colors.red,
      },
      {
        priority: 'High',
        icon: 'walk-outline',
        title: 'Exercise protocol',
        description:
          '150 min/week moderate aerobic + 2x resistance training. Post-meal walks (15 min) shown to reduce HbA1c by 0.3%.',
        color: Colors.red,
      },
      {
        priority: 'Medium',
        icon: 'medkit-outline',
        title: 'Metformin consideration',
        description:
          'Discuss with endocrinologist. Pre-diabetic range with rising trajectory may warrant early pharmacological intervention.',
        color: Colors.amber,
      },
      {
        priority: 'Low',
        icon: 'analytics-outline',
        title: 'Continuous glucose monitor',
        description:
          'Consider 2-week CGM trial to identify glycemic spikes and optimize meal timing.',
        color: Colors.teal,
      },
    ],
    treatment: [
      'Schedule endocrinology consult within 2 weeks',
      'Begin Mediterranean diet plan \u2014 reduce glycemic load',
      'Start structured exercise: 30 min walk daily + 2x weights',
      'Retest HbA1c in 3 months to assess trajectory change',
      'Add chromium picolinate 200mcg daily (discuss with doctor)',
    ],
    prevention:
      'Early intervention at the pre-diabetic stage has a 58% success rate in preventing Type 2 DM progression. Lifestyle modifications alone can reduce HbA1c by 0.5\u20131.0% within 6 months. The window for reversal narrows significantly once HbA1c exceeds 7.0%.',
  },
};

// ──────────────────────────────────────────────
// Per-biomarker detail data (inline)
// ──────────────────────────────────────────────
const BM_DETAIL = {
  hba1c: {
    narrative: 'Priya, your HbA1c of 7.8% is above your 7.0% target for the third test in a row. The root cause is not your medication (Metformin AM adherence is 97%), but the evening cascade: missed PM Metformin (58%) \u2192 large dinner \u2192 post-dinner glucose averaging 180 mg/dL \u2192 poor sleep raising cortisol \u2192 elevated FBG. Ayu estimates fixing this single cascade would lower HbA1c by 0.4\u20130.6% within one test cycle.',
    urgLabel: 'Urgent',
    correlations: [
      {label: 'PM Metformin misses \u2192 HbA1c', value: '13 misses in March = estimated +0.18% contribution to HbA1c. Each miss adds ~12 mg/dL to next-morning FBG.', status: 'elevated'},
      {label: 'Sleep \u2192 FBG \u2192 HbA1c', value: 'Nights with <6h sleep: next-morning FBG +15 mg/dL higher. Ayu found this on 18 of 31 March nights.', status: 'elevated'},
      {label: 'Post-dinner inactivity', value: 'Days without evening walk: post-dinner glucose peaks at 196 mg/dL vs 158 mg/dL on walking days \u2014 a 38 mg/dL difference.', status: 'elevated'},
      {label: 'Vit D deficiency worsening control', value: 'Vit D 18 ng/mL worsens insulin resistance. Correcting it may reduce HbA1c by 0.2\u20130.4% independently.', status: 'elevated'},
    ],
    about: 'HbA1c reflects average blood glucose over 2\u20133 months. Above 7.0% signals poor T2DM control; sustained elevation causes microvascular complications affecting kidneys, eyes, and nerves.',
    symptoms: ['Increased thirst and frequent urination','Unexplained fatigue and brain fog','Blurred or fluctuating vision','Slow-healing cuts and wounds','Frequent skin and urinary infections','Foot tingling or numbness (neuropathy)'],
    causes: ['Uncontrolled blood glucose','High-carbohydrate diet with refined sugars','Physical inactivity worsening insulin resistance','PM Metformin dose misses (58% adherence)','Chronic sleep deficit raising cortisol and FBG','Post-dinner glucose spikes not adequately managed'],
    timeline: [{label:'Now',detail:'HbA1c 7.8% \u2014 above target for 3 consecutive tests',color:Colors.amber},{label:'3\u20136 months',detail:'With Metformin 1000mg: HbA1c could reach 7.0\u20137.3%',color:Colors.red},{label:'12\u201318 months',detail:'Risk of early retinopathy and microalbuminuria',color:Colors.red},{label:'2\u20133 years',detail:'CV event risk significantly elevated. Neuropathy accelerates.',color:Colors.red}],
    organs: [{name:'Heart',stage:'Early Stress',severity:52,trend:'Watch',icon:'heart-outline'},{name:'Kidneys',stage:'Stage 2 CKD',severity:42,trend:'Stable',icon:'water-outline'},{name:'Eyes',stage:'Screening Due',severity:35,trend:'Stable',icon:'eye-outline'},{name:'Nerves',stage:'Early Neuropathy',severity:48,trend:'Watch',icon:'flash-outline'}],
    organDetails: [{name:'Heart',stage:'Early Stress',impact:'Hyperglycaemia accelerates atherosclerosis. HbA1c >7% doubles long-term CV event risk.',icon:'heart-outline'},{name:'Kidneys',stage:'Stage 2 CKD',impact:'Sustained high glucose damages glomerular filtration. eGFR 72 mL/min confirms early-stage impact.',icon:'water-outline'},{name:'Eyes',stage:'Screening Due',impact:'Retinal microvasculature damaged by chronic hyperglycaemia. No fundus exam on record.',icon:'eye-outline'},{name:'Nerves',stage:'Early Neuropathy',impact:'Glycation of myelin sheaths degrades nerve conduction. Foot tingling 5x/month.',icon:'flash-outline'}],
    cluster: {name:'Metabolic Syndrome Cluster',description:'HbA1c elevation is the central driver of a cascade affecting cardiovascular, renal and neurological systems.',riskScore:72,diseases:[{name:'Type 2 Diabetes',type:'active',progress:0.85},{name:'Cardiovascular Disease',type:'emerging',progress:0.55},{name:'Chronic Kidney Disease',type:'watch',progress:0.38}],timeline:[{stage:'Current',detail:'Pre-diabetic with metabolic syndrome features',color:Colors.amber},{stage:'1\u20132 years',detail:'Complications onset risk without intervention',color:Colors.red}]},
    care: {actions:[{priority:'High',icon:'walk-outline',title:'15-min Post-Dinner Walk',description:'Reduces post-dinner glucose spike by up to 30%.',color:Colors.red},{priority:'High',icon:'alarm-outline',title:'Fix PM Metformin Adherence',description:'Each missed PM dose adds +12 mg/dL to next-morning FBG. Set a 9 PM alert.',color:Colors.red},{priority:'High',icon:'moon-outline',title:'Sleep 7 Hours',description:'Sleep below 6h raises cortisol which directly increases FBG by ~15 mg/dL.',color:Colors.red},{priority:'Medium',icon:'restaurant-outline',title:'Reduce Dinner Carb Portion',description:'Replace 1 roti with a salad \u2014 estimated -18\u201325 mg/dL post-dinner.',color:Colors.amber}],treatment:['Metformin 1000mg BD \u2014 AM 97%, PM 58% (improve urgently)','HbA1c retest Jun 2026','Retinal screening \u2014 overdue','Annual kidney function panel'],prevention:'Maintain HbA1c below 7.0% through consistent Metformin, low-GI diet, 30 min/day activity, and 7h sleep.'},
  },
  fbg: {
    narrative: 'Your FBG of 126 mg/dL is improving \u2014 down 10 mg/dL across March since Metformin 1000mg started. Your FBG is highly predictable from the prior evening\'s behaviour. On evenings you took PM Metformin + walked + slept 7h, FBG averaged 108 mg/dL. On evenings you missed all three, it averaged 138 mg/dL \u2014 a 30 mg/dL swing.',
    urgLabel: 'Urgent',
    correlations: [{label:'Evening walk impact',value:'15-min post-dinner walk \u2192 FBG next morning 18 mg/dL lower on average.',status:'elevated'},{label:'Sleep duration \u2192 FBG',value:'FBG on 7h+ sleep nights: avg 114 mg/dL. On <6h nights: avg 129 mg/dL.',status:'elevated'},{label:'PM Metformin adherence',value:'Evenings with PM Metformin taken: next FBG avg 119 mg/dL. Missed: avg 131 mg/dL.',status:'elevated'},{label:'Stress-cortisol pattern',value:'High-stress Mondays \u2192 Tuesday FBG avg +12 mg/dL above weekly average.',status:'elevated'}],
    about: 'Fasting blood glucose measures blood sugar after an overnight fast. Normal: 70\u2013100 mg/dL. Priya\'s FBG of 126 reflects T2DM.',
    symptoms: ['Increased morning thirst','Frequent urination at night','Fatigue throughout the day','Headaches and difficulty concentrating','Blurred vision on high-glucose mornings'],
    causes: ['Large dinner carbohydrate portions','PM Metformin misses (58%)','Poor sleep (5.9h avg)','Post-dinner inactivity','Stress-cortisol cascade'],
    timeline: [{label:'Now',detail:'FBG 126 mg/dL \u2014 diabetic range. March downtrend encouraging.',color:Colors.amber},{label:'3 months',detail:'If walk + sleep improve: FBG could reach 110\u2013115.',color:Colors.amber},{label:'12 months',detail:'Without changes: FBG likely 130\u2013140 requiring dose escalation.',color:Colors.red}],
    organs: [{name:'Pancreas',stage:'Beta Cell Stress',severity:55,trend:'Watch',icon:'fitness-outline'},{name:'Liver',stage:'Glycogen Overload',severity:48,trend:'Watch',icon:'medical-outline'}],
    organDetails: [{name:'Pancreas',stage:'Beta Cell Stress',impact:'Beta cells chronically overworked. Long-term exhaustion leads to reduced insulin output.',icon:'fitness-outline'},{name:'Liver',stage:'Glycogen Overload',impact:'Excess glucose converted to liver fat \u2014 Grade 1 NAFLD confirmed.',icon:'medical-outline'}],
    cluster: {name:'Insulin Resistance Cluster',description:'Elevated FBG clusters with insulin resistance, NAFLD, and metabolic syndrome.',riskScore:68,diseases:[{name:'T2DM',type:'active',progress:0.85},{name:'Non-alcoholic Fatty Liver',type:'emerging',progress:0.45},{name:'Hypertension',type:'emerging',progress:0.55}],timeline:[{stage:'Current',detail:'FBG 126 \u2014 diabetic range with encouraging downtrend',color:Colors.amber}]},
    care: {actions:[{priority:'High',icon:'walk-outline',title:'Post-Dinner Walk (15 min)',description:'Reduces post-dinner glucose by 30%.',color:Colors.red},{priority:'High',icon:'alarm-outline',title:'PM Metformin at 9 PM',description:'Each PM dose reduces next-morning FBG by ~12 mg/dL.',color:Colors.red}],treatment:['Metformin 1000mg BD','Target FBG: 70\u2013100 mg/dL','Weekly FBG self-monitoring'],prevention:'Maintain FBG below 100 mg/dL with post-dinner activity, low-GI dinner, and 7h sleep.'},
  },
  ldl: {
    narrative: 'Your LDL of 118 mg/dL is on a clear downward trajectory \u2014 Atorvastatin 10mg has brought it from 145 to 118 over 2.5 years. At the current rate (~2 mg/dL/month), you should reach the T2DM target of <100 mg/dL by approximately September 2026.',
    urgLabel: 'Watch',
    correlations: [{label:'LDL:HDL ratio',value:'Current ratio: 2.27. Target for T2DM is <2.0. Bringing LDL to 100 would achieve this.',status:'elevated'},{label:'Carb diet \u2192 TG \u2192 LDL quality',value:'High-carb diet creates small dense LDL particles \u2014 3\u00D7 more atherogenic.',status:'elevated'},{label:'Exercise deficit',value:'Current 6,240 steps/day vs target 8,000. Each 1,000 steps improves LDL quality.',status:'watch'}],
    about: 'LDL carries cholesterol to arterial walls. For T2DM patients, target is <100 mg/dL (stricter than general <130).',
    symptoms: ['Usually asymptomatic','Elevated cardiac risk is the key danger'],
    causes: ['High-saturated-fat diet','Low physical activity','T2DM worsens lipid metabolism'],
    timeline: [{label:'Now',detail:'LDL 118 \u2014 declining on Atorvastatin 10mg',color:Colors.amber},{label:'6\u20139 months',detail:'LDL should reach 100\u2013108 mg/dL',color:Colors.amber}],
    organs: [{name:'Heart',stage:'Atherosclerosis Risk',severity:55,trend:'Watch',icon:'heart-outline'},{name:'Brain',stage:'Stroke Risk',severity:40,trend:'Stable',icon:'bulb-outline'}],
    organDetails: [{name:'Heart',stage:'Atherosclerosis Risk',impact:'LDL deposits in coronary arteries accelerate plaque formation.',icon:'heart-outline'},{name:'Brain',stage:'Stroke Risk',impact:'Carotid plaque from LDL elevation raises ischaemic stroke risk.',icon:'bulb-outline'}],
    cluster: {name:'Atherogenic Dyslipidaemia Cluster',description:'Elevated LDL with elevated TG and T2DM creates a triple-threat.',riskScore:58,diseases:[{name:'Coronary Artery Disease',type:'emerging',progress:0.50},{name:'Ischaemic Stroke',type:'watch',progress:0.35}],timeline:[]},
    care: {actions:[{priority:'High',icon:'medkit-outline',title:'Continue Atorvastatin 10mg',description:'Clear downward trend. Discuss titration if LDL >100 at Sep 2026.',color:Colors.red}],treatment:['Atorvastatin 10mg ON daily (97% adherence)','LDL retest Sep 2026','Annual LFT while on statin'],prevention:'Maintain LDL <100 through Atorvastatin, saturated fat reduction, and exercise.'},
  },
  tg: {
    narrative: 'Your Triglycerides of 162 mg/dL have been flat for 18 months. Dinner averages 58% calories from carbohydrates, directly converted to TG in the liver. Reducing dinner carbs alone could bring TG to <150 mg/dL.',
    urgLabel: 'Watch',
    correlations: [{label:'Dinner carb load \u2192 TG',value:'Days with rice + roti dinner: next-day TG estimated +15\u201320 mg/dL higher.',status:'elevated'},{label:'NAFLD connection',value:'Grade 1 NAFLD confirmed \u2014 excess TG deposits directly as liver fat.',status:'elevated'},{label:'TG:HDL ratio',value:'TG:HDL = 3.1. Above 3.0 is a surrogate marker for insulin resistance.',status:'elevated'}],
    about: 'Triglycerides are blood fat linked to insulin resistance, NAFLD, and cardiovascular risk.',
    symptoms: ['Usually asymptomatic at 162 mg/dL','Fatigue and brain fog'],
    causes: ['High-carbohydrate diet (58% carbs)','Insulin resistance','Grade 1 NAFLD','Sedentary lifestyle'],
    timeline: [{label:'Now',detail:'TG 162 \u2014 mildly elevated, stable',color:Colors.amber},{label:'6 months',detail:'Carb reduction + exercise could bring TG <150',color:Colors.amber}],
    organs: [{name:'Liver',stage:'Grade 1 NAFLD',severity:52,trend:'Watch',icon:'medical-outline'},{name:'Arteries',stage:'Atherogenic Risk',severity:45,trend:'Watch',icon:'pulse-outline'}],
    organDetails: [{name:'Liver',stage:'Grade 1 NAFLD',impact:'Excess TG converted to liver fat via de novo lipogenesis.',icon:'medical-outline'},{name:'Arteries',stage:'Atherogenic Risk',impact:'VLDL carries TG and becomes small dense LDL \u2014 most atherogenic form.',icon:'pulse-outline'}],
    cluster: {name:'Metabolic-Hepatic Cluster',description:'Elevated TG clusters with NAFLD and insulin resistance.',riskScore:55,diseases:[{name:'NAFLD',type:'active',progress:0.60},{name:'Metabolic Syndrome',type:'active',progress:0.70}],timeline:[]},
    care: {actions:[{priority:'High',icon:'restaurant-outline',title:'Reduce Dietary Carbohydrates',description:'Target <50% calories from carbs. Replace rice with dal.',color:Colors.red}],treatment:['No TG medication at 162 \u2014 lifestyle-first','Target TG <150 through diet and exercise'],prevention:'Reduce refined carbs, increase omega-3, maintain 7,000+ daily steps.'},
  },
  hdl: {
    narrative: 'Your HDL of 52 mg/dL is healthy and stable \u2014 one of the few unconditionally positive markers. Your step count increase is already working on HDL. If maintained, HDL should reach 55\u201358 mg/dL by September 2026.',
    urgLabel: 'Healthy',
    correlations: [{label:'Steps \u2192 HDL trajectory',value:'Steps rose from 5,100 to 6,240/day. Ayu projects +3\u20134 mg/dL by Sep 2026.',status:'normal'},{label:'HDL as LDL counterweight',value:'LDL:HDL ratio 2.27. Getting HDL to 59 would bring ratio to 2.0 safe threshold.',status:'normal'}],
    about: 'HDL is the protective cholesterol that removes LDL from arterial walls.',
    symptoms: ['Low HDL causes no symptoms','Protective effect reduces cardiovascular risk'],
    causes: ['Sedentary lifestyle (primary modifiable cause)','Partially offset by walking improvement'],
    timeline: [{label:'Now',detail:'HDL 52 \u2014 adequate protection',color:Colors.teal},{label:'12 months',detail:'With 8,000+ steps: HDL 56\u201360 mg/dL',color:Colors.teal}],
    organs: [{name:'Heart',stage:'Protected',severity:20,trend:'Stable',icon:'heart-outline'}],
    organDetails: [{name:'Heart',stage:'Protected',impact:'HDL at 52 provides adequate cardiovascular protection.',icon:'heart-outline'}],
    cluster: {name:'Cardiovascular Protection',description:'HDL at 52 provides adequate protection.',riskScore:25,diseases:[{name:'Coronary Artery Disease',type:'watch',progress:0.35}],timeline:[]},
    care: {actions:[{priority:'Medium',icon:'walk-outline',title:'Sustain Step Count',description:'Reaching 8,000 steps/day would raise HDL by 3\u20135 mg/dL.',color:Colors.amber}],treatment:['No medication needed for HDL at 52','Focus on exercise and Mediterranean diet'],prevention:'Maintain HDL >50 with consistent aerobic activity.'},
  },
  hb: {
    narrative: 'Your Haemoglobin of 11.8 g/dL has been borderline for 2+ years without investigation. Iron and ferritin have never been tested \u2014 the most common cause of borderline anaemia in Indian women. Methylcobalamin addresses B12, but if iron deficiency is primary, response will be limited.',
    urgLabel: 'Watch',
    correlations: [{label:'Anaemia \u2192 fatigue \u2192 inactivity',value:'Low Hb reduces VO2 max \u2192 less exercise tolerance \u2192 lower step count. Fixing Hb may improve steps without extra effort.',status:'elevated'},{label:'Anaemia \u2192 HRV \u2192 sleep',value:'HRV is 28ms (low). Anaemia forces higher heart rate, reducing HRV and worsening sleep quality.',status:'elevated'},{label:'Menstrual blood loss',value:'Irregular cycles (\u00B16 days) suggest possible heavier losses. Monthly iron deficit is likely driver.',status:'elevated'}],
    about: 'Haemoglobin carries oxygen in red blood cells. 11.8 g/dL is just below the 12.0 threshold for females.',
    symptoms: ['Persistent fatigue','Breathlessness on stairs','Pale skin','Cold hands and feet','Brain fog','Palpitations on exertion'],
    causes: ['Likely iron deficiency \u2014 NOT yet tested','Possible Metformin-induced B12 malabsorption','Menstrual blood loss'],
    timeline: [{label:'Now',detail:'Hb 11.8 \u2014 borderline for 2+ years',color:Colors.amber},{label:'6 weeks',detail:'Methylcobalamin effect: Hb +0.2\u20130.5 if B12 pathway',color:Colors.amber}],
    organs: [{name:'Heart',stage:'Compensating',severity:40,trend:'Watch',icon:'heart-outline'},{name:'Brain',stage:'Cognitive Dip',severity:38,trend:'Watch',icon:'bulb-outline'},{name:'Muscles',stage:'Reduced VO2',severity:35,trend:'Stable',icon:'barbell-outline'}],
    organDetails: [{name:'Heart',stage:'Compensating',impact:'Heart compensates by increasing output. HRV 28ms is a marker of this stress.',icon:'heart-outline'},{name:'Brain',stage:'Cognitive Dip',impact:'Mild anaemia reduces cerebral oxygen, impairing concentration and mood.',icon:'bulb-outline'}],
    cluster: {name:'Anaemia-Fatigue Cluster',description:'Declining Hb clusters with iron deficiency, B12 depletion, and chronic disease anaemia.',riskScore:42,diseases:[{name:'Iron Deficiency Anaemia',type:'emerging',progress:0.60},{name:'B12-related Anaemia',type:'watch',progress:0.35}],timeline:[]},
    care: {actions:[{priority:'High',icon:'flask-outline',title:'Order Iron Panel Urgently',description:'Serum iron, ferritin, TIBC \u2014 most likely undiagnosed cause.',color:Colors.red}],treatment:['Methylcobalamin 500mcg OD','Order iron panel','If ferritin <20: start iron sulphate 200mg daily'],prevention:'Annual full blood count. Adequate dietary iron and B12.'},
  },
  vitd: {
    narrative: 'Your Vitamin D of 18 ng/mL has been deficient across all 4 readings spanning 2 years. Correcting Vit D deficiency in T2DM patients produces an average 0.3\u20130.5% reduction in HbA1c \u2014 purely from improved insulin sensitivity. Your supplement (started Jan 2026) is actively working on your primary concern.',
    urgLabel: 'Watch',
    correlations: [{label:'Vit D \u2192 insulin sensitivity',value:'Vit D deficiency reduces pancreatic beta-cell responsiveness. At 18 ng/mL, estimated 12\u201318% worsening of baseline insulin sensitivity.',status:'elevated'},{label:'Vit D \u2192 fatigue \u2192 inactivity',value:'Vit D deficiency causes generalised fatigue and muscle weakness. Partly why step count remains below target.',status:'elevated'},{label:'Vit D \u2192 mood',value:'Vit D deficiency is independently linked to depression (PHQ-9: 8). Correcting may improve mood score by 1\u20132 points.',status:'elevated'}],
    about: 'Vitamin D is essential for calcium metabolism, immune function, and insulin signalling. Chronic deficiency worsens insulin resistance.',
    symptoms: ['Fatigue and weakness','Muscle aches and bone pain','Frequent infections','Low mood and brain fog','Reduced exercise tolerance'],
    causes: ['Minimal sun exposure','No supplementation until Jan 2026','T2DM patients have higher Vit D requirements','BMI 25 \u2014 Vit D sequestered in fat'],
    timeline: [{label:'Now',detail:'Vit D 18 ng/mL \u2014 4 consecutive deficient readings',color:Colors.amber},{label:'6\u20138 weeks',detail:'Expect 26\u201330 ng/mL \u2014 approaching threshold',color:Colors.amber},{label:'3\u20134 months',detail:'Target range 30\u201360 achievable. HbA1c improvement expected.',color:Colors.teal}],
    organs: [{name:'Pancreas',stage:'Insulin Resistance',severity:50,trend:'Watch',icon:'fitness-outline'},{name:'Bones',stage:'Subclinical Deficiency',severity:38,trend:'Watch',icon:'body-outline'},{name:'Muscles',stage:'Proximal Myopathy',severity:45,trend:'Watch',icon:'barbell-outline'},{name:'Brain',stage:'Mood Impacted',severity:40,trend:'Watch',icon:'bulb-outline'},{name:'Immune System',stage:'Innate Immunity Low',severity:42,trend:'Watch',icon:'shield-outline'}],
    organDetails: [{name:'Pancreas',stage:'Insulin Resistance',impact:'VDR on beta-cells essential for insulin secretion. Deficiency worsens resistance by 10\u201320%.',icon:'fitness-outline'},{name:'Bones',stage:'Subclinical Deficiency',impact:'Chronic deficiency means negative calcium balance \u2014 silent osteoporosis risk.',icon:'body-outline'},{name:'Brain',stage:'Mood Impacted',impact:'VDR in hippocampus impairs serotonin synthesis \u2014 contributing to PHQ-9 score of 8.',icon:'bulb-outline'}],
    cluster: {name:'Micronutrient-Metabolic Cluster',description:'Vit D deficiency clusters with worsened T2DM, mood disorders, and musculoskeletal weakness.',riskScore:45,diseases:[{name:'Worsened T2DM control',type:'active',progress:0.65},{name:'Musculoskeletal weakness',type:'active',progress:0.55},{name:'Mood disorder',type:'emerging',progress:0.48}],timeline:[]},
    care: {actions:[{priority:'High',icon:'medkit-outline',title:'Do Not Miss Supplement',description:'60,000 IU weekly cholecalciferol \u2014 take consistently.',color:Colors.red},{priority:'High',icon:'flask-outline',title:'Vit D Test April 2026',description:'Confirm repletion is on track.',color:Colors.red},{priority:'Medium',icon:'sunny-outline',title:'15-min Morning Sunlight',description:'Expose arms and face to morning sun 4x/week.',color:Colors.amber}],treatment:['Cholecalciferol 60,000 IU weekly','Retest Vit D Apr 2026','Check serum calcium and PTH'],prevention:'Maintain Vit D 40\u201360 ng/mL through daily supplementation after repletion.'},
  },
  b12: {
    narrative: 'Your B12 of 312 pg/mL has been slowly declining over 18 months as Metformin reduces ileal B12 absorption. Your foot tingling (5\u00D7 this month) occurs with two simultaneous neuropathy risks \u2014 T2DM peripheral neuropathy AND B12 demyelination.',
    urgLabel: 'Watch',
    correlations: [{label:'Metformin \u2192 B12 depletion',value:'B12 declining ~32 pg/mL over 18 months. Deficiency (<200) in 3\u20134 years without supplementation.',status:'elevated'},{label:'B12 \u2192 foot tingling',value:'B12 deficiency demyelinates peripheral nerves. Dual causation with T2DM neuropathy.',status:'elevated'},{label:'B12 \u2192 mood',value:'B12 is a cofactor for serotonin synthesis. Low B12 contributes to PHQ-9 score of 8.',status:'elevated'}],
    about: 'Vitamin B12 is essential for nerve function, RBC formation, and DNA synthesis.',
    symptoms: ['Peripheral tingling in feet','Fatigue and weakness','Mood changes','Difficulty concentrating'],
    causes: ['Long-term Metformin use','Low dietary B12','No supplementation until Mar 2026'],
    timeline: [{label:'Now',detail:'B12 312 pg/mL \u2014 declining slowly',color:Colors.amber},{label:'2\u20133 months',detail:'Expect 350\u2013400 pg/mL with supplementation',color:Colors.amber}],
    organs: [{name:'Nerves',stage:'Early Demyelination',severity:42,trend:'Watch',icon:'flash-outline'},{name:'Brain',stage:'Mood Impact',severity:35,trend:'Watch',icon:'bulb-outline'}],
    organDetails: [{name:'Nerves',stage:'Early Demyelination',impact:'B12 essential for myelin synthesis. Foot tingling 5x/month is the manifestation.',icon:'flash-outline'},{name:'Brain',stage:'Mood Impact',impact:'B12 is cofactor for serotonin/dopamine. Partially driving PHQ-9 of 8.',icon:'bulb-outline'}],
    cluster: {name:'Metformin-Micronutrient Cluster',description:'Long-term Metformin depletes B12, worsening neuropathy and anaemia.',riskScore:38,diseases:[{name:'B12 Neuropathy',type:'emerging',progress:0.45},{name:'Mild Anaemia',type:'active',progress:0.55}],timeline:[]},
    care: {actions:[{priority:'High',icon:'medkit-outline',title:'Continue Methylcobalamin 500mcg',description:'Daily methylcobalamin preferred for Metformin users.',color:Colors.red}],treatment:['Methylcobalamin 500mcg OD indefinitely','B12 recheck Jun 2026','Annual B12 monitoring on Metformin'],prevention:'All patients on Metformin >2 years should take prophylactic B12.'},
  },
  tsh: {
    narrative: 'Your TSH of 2.8 mIU/L is excellent and perfectly stable across 5 readings. Thyroid function is not contributing to any of your active health issues. Your fatigue is from anaemia, poor sleep, and deconditioning \u2014 not thyroid.',
    urgLabel: 'Healthy',
    correlations: [{label:'TSH rules out thyroid-insulin link',value:'Normal TSH confirms thyroid is not a driver of HbA1c elevation.',status:'normal'},{label:'TSH rules out thyroid-anaemia link',value:'Normal TSH confirms Hb decline is not thyroid-related.',status:'normal'}],
    about: 'TSH regulates thyroid function. 2.8 mIU/L is comfortably mid-range (0.5\u20134.5). No dysfunction detected.',
    symptoms: ['No thyroid symptoms \u2014 TSH is healthy','Fatigue is from anaemia, not thyroid'],
    causes: ['Normal thyroid axis','Adequate iodine intake'],
    timeline: [{label:'Now',detail:'TSH 2.8 \u2014 healthy and stable',color:Colors.teal}],
    organs: [{name:'Thyroid',stage:'Normal Function',severity:15,trend:'Stable',icon:'body-outline'}],
    organDetails: [{name:'Thyroid',stage:'Normal Function',impact:'TSH mid-range indicates optimal thyroid output. No hypothyroid component.',icon:'body-outline'}],
    cluster: {name:'Thyroid Health \u2014 No Cluster',description:'Thyroid function excellent. No thyroid-driven cluster applies.',riskScore:12,diseases:[{name:'Hypothyroidism',type:'watch',progress:0.08}],timeline:[]},
    care: {actions:[{priority:'Low',icon:'flask-outline',title:'Annual TSH Screening',description:'Annual check appropriate for T2DM females over 35.',color:Colors.teal}],treatment:['No thyroid medication required','Annual TSH check'],prevention:'Maintain adequate iodine intake. Annual TSH screening.'},
  },
  egfr: {
    narrative: 'Your eGFR of 72 mL/min is stable and within normal range but sits at CKD Stage 2 boundary. This stability is a direct result of Olmesartan (96% adherence). The two parameters that determine eGFR trajectory are BP control and HbA1c.',
    urgLabel: 'Watch',
    correlations: [{label:'BP \u2192 eGFR protection',value:'Each 10 mmHg systolic reduction slows eGFR decline by ~30% in T2DM.',status:'elevated'},{label:'HbA1c \u2192 eGFR trajectory',value:'Each 1% HbA1c reduction slows eGFR decline by ~30%.',status:'elevated'},{label:'Olmesartan dual benefit',value:'Olmesartan lowers BP AND reduces glomerular hyperfiltration. Full renoprotective effect at 96% adherence.',status:'normal'}],
    about: 'eGFR measures kidney filtering capacity. 72 mL/min is within normal (>60) but in CKD Stage 2 range.',
    symptoms: ['Usually asymptomatic at Stage 2','Ankle oedema from Amlodipine (not kidney)'],
    causes: ['5-year T2DM history','Hypertension','Age-related decline (~1 mL/min/year)'],
    timeline: [{label:'Now',detail:'eGFR 72 \u2014 stable CKD2. No proteinuria.',color:Colors.teal},{label:'1 year',detail:'If BP <130/80 and HbA1c <7.0%: eGFR stable or improving',color:Colors.teal}],
    organs: [{name:'Kidneys',stage:'CKD Stage 2',severity:42,trend:'Stable',icon:'water-outline'},{name:'Heart',stage:'Cardiorenal Risk',severity:38,trend:'Watch',icon:'heart-outline'}],
    organDetails: [{name:'Kidneys',stage:'CKD Stage 2',impact:'eGFR 72 reflects 72% of full capacity. Stable for 18 months.',icon:'water-outline'},{name:'Heart',stage:'Cardiorenal Risk',impact:'CKD doubles CV risk through fluid dysregulation.',icon:'heart-outline'}],
    cluster: {name:'Cardiorenal-Metabolic Cluster',description:'T2DM + HTN + CKD2 form a self-reinforcing triad.',riskScore:40,diseases:[{name:'CKD Progression',type:'watch',progress:0.42},{name:'Cardiovascular Disease',type:'emerging',progress:0.50}],timeline:[]},
    care: {actions:[{priority:'High',icon:'heart-outline',title:'Control BP to <130/80',description:'Single most effective renal protection intervention.',color:Colors.red},{priority:'High',icon:'close-circle-outline',title:'Avoid NSAIDs',description:'Ibuprofen reduces renal perfusion acutely. Use paracetamol only.',color:Colors.red}],treatment:['Olmesartan 20mg OD \u2014 maintain 96%','Target BP <130/80','Annual kidney panel'],prevention:'Control BP <130/80 and HbA1c <7.0%. Avoid NSAIDs. Maintain hydration.'},
  },
  malb: {
    narrative: 'Your Microalbumin of 18 mg/L is consistently normal \u2014 one of the most reassuring findings. After 5 years of T2DM, maintaining normal microalbumin means your kidney barrier is intact. This reflects Olmesartan working as a renoprotective agent.',
    urgLabel: 'Healthy',
    correlations: [{label:'Olmesartan \u2192 microalbumin',value:'ARBs reduce intraglomerular pressure directly. Normal microalbumin is evidence Olmesartan is working.',status:'normal'},{label:'HbA1c ceiling watch',value:'If HbA1c rises above 8.5%, microalbumin likely to cross 30 mg/L within 12\u201318 months.',status:'watch'},{label:'Hydration gap risk',value:'Current hydration 1.4L/day. Dehydration transiently elevates microalbumin readings.',status:'watch'}],
    about: 'Urine Microalbumin detects the earliest sign of diabetic kidney damage. 18 mg/L is well within normal (<30).',
    symptoms: ['No symptoms \u2014 preclinical biomarker','Foamy urine would indicate proteinuria (not present)'],
    causes: ['No pathological cause \u2014 microalbumin is normal','Olmesartan and glucose control are protecting kidneys'],
    timeline: [{label:'Now',detail:'Microalbumin 18 \u2014 consistently normal. Kidney barrier intact.',color:Colors.teal}],
    organs: [{name:'Kidneys',stage:'No Nephropathy',severity:18,trend:'Stable',icon:'water-outline'}],
    organDetails: [{name:'Kidneys',stage:'No Nephropathy',impact:'Normal microalbumin confirms glomerular barrier is intact.',icon:'water-outline'}],
    cluster: {name:'Renal Protection \u2014 Holding',description:'Normal microalbumin confirms kidney protection is effective.',riskScore:18,diseases:[{name:'Diabetic Nephropathy',type:'watch',progress:0.18}],timeline:[]},
    care: {actions:[{priority:'High',icon:'medkit-outline',title:'Continue Olmesartan',description:'ARBs provide direct renal protection. Sustain 96% adherence.',color:Colors.red},{priority:'High',icon:'flask-outline',title:'Annual Microalbumin Test',description:'Any rise above 30 mg/L requires nephrology review.',color:Colors.red}],treatment:['Olmesartan 20mg OD','Annual microalbumin test','Maintain HbA1c <7.0%'],prevention:'Maintain BP <130/80 and HbA1c <7.0%. Annual testing. Stay hydrated.'},
  },
};

// ──────────────────────────────────────────────
// Data mapping – convert ayuIntelData.js shapes to detail screen format
// ──────────────────────────────────────────────

const _histStatusLabel = code => {
  if (code === 'h') return 'elevated';
  if (code === 'l') return 'low';
  return 'normal';
};

const _urgencyFromValue = (val, lo, hi) => {
  if (val > hi * 1.15) return {label: 'High', color: Colors.red};
  if (val > hi) return {label: 'Elevated', color: Colors.amber};
  if (val < lo * 0.85) return {label: 'Low', color: Colors.red};
  if (val < lo) return {label: 'Below range', color: Colors.amber};
  return {label: 'Normal', color: Colors.teal};
};

const _buildScores = bm => {
  const stabBadgeColor =
    bm.stab.dir === 'worsening'
      ? Colors.red
      : bm.stab.dir === 'improving'
      ? Colors.teal
      : Colors.amber;
  const velBadgeColor = bm.vel.sp === 'medium' ? Colors.amber : Colors.teal;
  const stBadgeColor =
    bm.val > bm.hi || bm.val < bm.lo ? Colors.amber : Colors.teal;

  return {
    status: {
      score: bm.st.s,
      label: 'Status',
      badge: bm.st.lbl,
      badgeColor: stBadgeColor,
      detail: bm.st.d,
    },
    stability: {
      score: bm.stab.s,
      label: 'Stability',
      badge: bm.stab.lbl,
      badgeColor: stabBadgeColor,
      detail: bm.stab.d,
    },
    velocity: {
      score: bm.vel.s,
      label: 'Velocity',
      badge: bm.vel.lbl,
      badgeColor: velBadgeColor,
      detail: bm.vel.d,
    },
  };
};

const mapBiomarkerToDetail = bm => {
  if (!bm) return null;
  const hist = bm.hist || [];
  const latestHist = hist[0];
  const oldestHist = hist[hist.length - 1];
  const prevHist = hist[1];
  const deltaVal =
    latestHist && prevHist ? (latestHist.v - prevHist.v).toFixed(1) : '0';
  const deltaNum = parseFloat(deltaVal);
  const deltaStr = deltaNum >= 0 ? '+' + deltaVal : String(deltaVal);
  const urgency = _urgencyFromValue(bm.val, bm.lo, bm.hi);

  const VISIT_NOTES = ['Baseline','Follow-up','Review','Medication change','Follow-up','Review'];
  const history = hist.map((h, i) => {
    const prev = hist[i + 1];
    const d = prev ? (h.v - prev.v).toFixed(1) : '\u2014';
    const dStr = prev && parseFloat(d) >= 0 ? '+' + d : d;
    const rng = bm.hi - bm.lo || 1;
    const rir = ((h.v - bm.lo) / rng).toFixed(2);
    return {date: h.dt, value: h.v, status: _histStatusLabel(h.st), delta: dStr, rir: rir, note: VISIT_NOTES[i] || 'Review', unit: bm.unit, refRange: (bm.lo > 0 ? bm.lo + '\u2013' : '') + bm.hi + ' ' + bm.unit};
  });

  const trendChart = hist.slice().reverse().map(h => h.v);
  const trendDates = hist.slice().reverse().map(h => h.dt);

  const hpsHistory = hist.map((_, i) =>
    Math.min(100, Math.max(0, bm.hps + (hist.length - 1 - i) * 4)),
  );

  const measurementTable = hist.map((h, i) => {
    const prev = hist[i + 1];
    const d = prev ? (h.v - prev.v).toFixed(1) : '\u2014';
    const dStr = prev && parseFloat(d) >= 0 ? '+' + d : d;
    return {
      date: h.dt,
      value: '' + h.v + bm.unit,
      delta: dStr,
      status: _histStatusLabel(h.st) === 'normal' ? 'Normal' : 'Elevated',
      hps: Math.min(100, Math.max(0, bm.hps + (hist.length - 1 - i) * 4)),
    };
  });

  const range = bm.hi - bm.lo || 1;
  const overshoot = (bm.val - bm.lo) / (range * 2);
  const currentPosition = Math.max(0, Math.min(1, overshoot));

  // Get per-biomarker detail data
  const detail = BM_DETAIL[bm.id] || {};

  return {
    id: bm.id,
    name: bm.name,
    category: bm.cat,
    unit: bm.unit,
    refRange: bm.lo + ' \u2013 ' + bm.hi,
    latestValue: bm.val,
    latestRIR: bm.hps ? (bm.hps / 100).toFixed(2) : '0.00',
    delta: deltaStr,
    deltaDirection: deltaNum > 0 ? 'up' : deltaNum < 0 ? 'down' : 'stable',
    readingsCount: hist.length,
    baseline: oldestHist ? oldestHist.v : bm.val,
    urgency: detail.urgLabel || urgency.label,
    urgencyColor: urgency.color,
    narrative: detail.narrative || bm.insight || '',
    correlations: detail.correlations || [],
    history: history,
    trendChart: trendChart,
    trendDates: trendDates,
    refLow: bm.lo,
    refHigh: bm.hi,
    timeline: detail.timeline || [{label:'Now',detail:''+bm.val+bm.unit+' \u2014 '+bm.st.lbl,color:urgency.color}],
    about: detail.about || bm.st.d || '',
    symptoms: detail.symptoms || [],
    causes: detail.causes || [],
    progression: {
      currentPosition: currentPosition,
      rangeLabels: ['Low', 'Normal', 'Elevated'],
      rangeBreaks: [0.25, 0.5],
      scores: _buildScores(bm),
      hpsHistory: hpsHistory,
      measurementTable: measurementTable,
    },
    organs: (detail.organs || []).slice(0, 4),
    organDetails: (detail.organDetails || []).slice(0, 4),
    cluster: detail.cluster || {
      name: bm.cat + ' Cluster',
      description: bm.insight || '',
      riskScore: Math.max(0, 100 - bm.hps),
      diseases: [],
      timeline: [],
    },
    care: detail.care || {
      actions: [{priority:'Medium',icon:'medkit-outline',title:'Monitor '+bm.name,description:'Continue monitoring.',color:urgency.color}],
      treatment: ['Retest in 3 months'],
      prevention: bm.insight || '',
    },
  };
};

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const statusColor = status => {
  if (!status) return Colors.textSecondary;
  const lc = status.toLowerCase();
  if (lc === 'normal' || lc === 'good' || lc === 'optimal' || lc === 'stable')
    return Colors.teal;
  if (
    lc === 'borderline' ||
    lc === 'elevated' ||
    lc === 'fair' ||
    lc === 'suboptimal' ||
    lc === 'watch' ||
    lc === 'moderate'
  )
    return Colors.amber;
  return Colors.red;
};

const statusBg = status => {
  if (!status) return Colors.tealBg;
  const lc = status.toLowerCase();
  if (lc === 'normal' || lc === 'good' || lc === 'optimal' || lc === 'stable')
    return Colors.tealBg;
  if (
    lc === 'borderline' ||
    lc === 'elevated' ||
    lc === 'fair' ||
    lc === 'suboptimal' ||
    lc === 'watch' ||
    lc === 'moderate'
  )
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
// Simple view-based chart component
// ──────────────────────────────────────────────

const SimpleChart = ({data, dates, refLow, refHigh, height = vs(120)}) => {
  if (!data || data.length === 0) return null;
  const chartW = SCREEN_W - s(48);
  // Smart Y-axis: include ref range but only the nearby portion, not the full 0-100
  const dataMin = Math.min(...data);
  const dataMax = Math.max(...data);
  const lo = refLow != null ? refLow : dataMin;
  const hi = refHigh != null ? refHigh : dataMax;
  // Use a tight range around data + ref bounds so the chart isn't squashed
  const allVals = [...data, lo, hi];
  const rawMin = Math.min(...allVals);
  const rawMax = Math.max(...allVals);
  const padding = (rawMax - rawMin) * 0.15 || 2;
  const minV = rawMin - padding;
  const maxV = rawMax + padding;
  const range = maxV - minV || 1;
  const stepX = chartW / (data.length - 1 || 1);

  const yPos = v => height - ((v - minV) / range) * height;

  const refBandTop = refHigh != null ? yPos(Math.min(refHigh, maxV)) : 0;
  const refBandBottom = refLow != null ? yPos(Math.max(refLow, minV)) : height;

  return (
    <View style={{height: height + vs(28), marginTop: vs(8)}}>
      {/* Reference band */}
      {refLow != null && refHigh != null && (
        <View
          style={{
            position: 'absolute',
            top: refBandTop,
            left: 0,
            right: 0,
            height: refBandBottom - refBandTop,
            backgroundColor: Colors.tealBg,
            opacity: 0.5,
            borderRadius: ms(4),
          }}
        />
      )}
      {/* Dots + connecting lines */}
      {data.map((v, i) => {
        const x = i * stepX;
        const y = yPos(v);
        const isAbove = refHigh != null && v > refHigh;
        const isBelow = refLow != null && refLow > 0 && v < refLow;
        const dotColor = isAbove
          ? (v > refHigh * 1.15 ? Colors.red : Colors.amber)
          : isBelow
            ? (v < refLow * 0.85 ? Colors.red : Colors.amber)
            : Colors.teal;
        return (
          <React.Fragment key={i}>
            {i > 0 && (
              <View
                style={{
                  position: 'absolute',
                  left: (i - 1) * stepX + ms(4),
                  top: yPos(data[i - 1]) + ms(2),
                  width: stepX,
                  height: 1.5,
                  backgroundColor: Colors.borderLight,
                  transform: [
                    {
                      rotate: `${
                        Math.atan2(y - yPos(data[i - 1]), stepX) *
                        (180 / Math.PI)
                      }deg`,
                    },
                  ],
                  transformOrigin: 'left center',
                }}
              />
            )}
            <View
              style={{
                position: 'absolute',
                left: x,
                top: y - ms(4),
                width: ms(8),
                height: ms(8),
                borderRadius: ms(4),
                backgroundColor: dotColor,
                borderWidth: 2,
                borderColor: Colors.white,
                elevation: 2,
                shadowColor: '#000',
                shadowOffset: {width: 0, height: 1},
                shadowOpacity: 0.15,
                shadowRadius: 2,
              }}
            />
          </React.Fragment>
        );
      })}
      {/* Date labels */}
      {dates && (
        <View
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            flexDirection: 'row',
            justifyContent: 'space-between',
          }}>
          {dates.map((d, i) => (
            <AppText
              key={i}
              variant="small"
              color={Colors.textTertiary}
              style={{fontSize: ms(7)}}>
              {d}
            </AppText>
          ))}
        </View>
      )}
    </View>
  );
};

const SparkLine = ({data, height = vs(40), color = Colors.accent}) => {
  if (!data || data.length < 2) return null;
  const w = SCREEN_W - s(80);
  const min = Math.min(...data) * 0.9;
  const max = Math.max(...data) * 1.1;
  const range = max - min || 1;
  const stepX = w / (data.length - 1);
  const yPos = v => height - ((v - min) / range) * height;

  return (
    <View style={{height, width: w, marginVertical: vs(6)}}>
      {data.map((v, i) => {
        if (i === 0) return null;
        const x1 = (i - 1) * stepX;
        const y1 = yPos(data[i - 1]);
        const x2 = i * stepX;
        const y2 = yPos(v);
        const len = Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2);
        const angle = Math.atan2(y2 - y1, x2 - x1) * (180 / Math.PI);
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: x1,
              top: y1,
              width: len,
              height: 2,
              backgroundColor: color,
              borderRadius: 1,
              transform: [{rotate: `${angle}deg`}],
              transformOrigin: 'left center',
            }}
          />
        );
      })}
      {data.map((v, i) => (
        <View
          key={`d${i}`}
          style={{
            position: 'absolute',
            left: i * stepX - ms(2.5),
            top: yPos(v) - ms(2.5),
            width: ms(5),
            height: ms(5),
            borderRadius: ms(3),
            backgroundColor: color,
          }}
        />
      ))}
    </View>
  );
};

// ──────────────────────────────────────────────
// Progress bar component
// ──────────────────────────────────────────────

const ProgressBar = ({
  progress,
  color,
  height = 6,
  bg = Colors.borderLight,
}) => (
  <View
    style={{
      height,
      borderRadius: height / 2,
      backgroundColor: bg,
      overflow: 'hidden',
    }}>
    <View
      style={{
        height,
        borderRadius: height / 2,
        backgroundColor: color,
        width: `${Math.min(Math.max(progress * 100, 0), 100)}%`,
      }}
    />
  </View>
);

// ──────────────────────────────────────────────
// Tab content components
// ──────────────────────────────────────────────

// --- Ayu Intel Tab ---
const AyuIntelTab = ({data}) => {
  const [chartMode, setChartMode] = useState('rir');

  return (
    <View style={{gap: vs(12)}}>
      {/* Ayu's Analysis Card */}
      <View style={[sty.analysisCard, {backgroundColor: '#064e3b', overflow: 'hidden'}]}>
        {/* Decorative circle */}
        <View style={{position: 'absolute', top: -30, right: -30, width: ms(110), height: ms(110), borderRadius: ms(55), backgroundColor: 'rgba(216,90,48,0.12)'}} />

        {/* Header row: glyph + title + urgency badge */}
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(9), marginBottom: vs(8), zIndex: 1}}>
          <View style={{width: ms(28), height: ms(28), borderRadius: ms(8), backgroundColor: '#D85A30', alignItems: 'center', justifyContent: 'center'}}>
            <AppText style={{fontSize: ms(14)}}>🧠</AppText>
          </View>
          <AppText variant="caption" color={Colors.white} style={{fontWeight: '700', flex: 1}}>
            Ayu's Analysis — {data.name}
          </AppText>
          <View
            style={[
              sty.urgencyBadge,
              {
                backgroundColor: data.urgencyColor + '22',
                borderColor: data.urgencyColor + '55',
              },
            ]}>
            <AppText
              variant="small"
              color={data.urgencyColor}
              style={{fontWeight: '700', fontSize: ms(9)}}>
              {data.urgency}
            </AppText>
          </View>
        </View>

        {/* Narrative */}
        <AppText
          variant="caption"
          color="rgba(255,255,255,0.82)"
          style={{lineHeight: ms(19), marginBottom: vs(10), zIndex: 1}}>
          {(data.narrative || '').replace(/<\/?b>/g, '').replace(/<\/?strong>/g, '')}
        </AppText>

        {/* Correlation cards */}
        {data.correlations && data.correlations.length > 0 && (
          <View style={{marginTop: vs(12), gap: vs(6)}}>
            {data.correlations.map((c, i) => (
              <View key={i} style={sty.correlationCard}>
                <AppText
                  variant="small"
                  color="rgba(255,255,255,0.45)"
                  style={{
                    fontWeight: '700',
                    textTransform: 'uppercase',
                    letterSpacing: 0.8,
                    fontSize: ms(8),
                    marginBottom: vs(3),
                  }}>
                  {'\uD83D\uDD17 '}{c.label}
                </AppText>
                <AppText
                  variant="caption"
                  color="rgba(255,255,255,0.88)"
                  style={{lineHeight: ms(17)}}>
                  {(c.value || '').replace(/<strong>/g, '').replace(/<\/strong>/g, '')}
                </AppText>
              </View>
            ))}
          </View>
        )}
      </View>

      {/* Trend Chart */}
      <View style={sty.card}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
            marginBottom: vs(4),
          }}>
          <AppText variant="sectionTitle">
            Trend
          </AppText>
          <View style={{flexDirection: 'row', gap: s(4)}}>
            {['rir', 'raw'].map(mode => (
              <TouchableOpacity
                key={mode}
                onPress={() => setChartMode(mode)}
                style={[
                  sty.toggleBtn,
                  chartMode === mode && sty.toggleBtnActive,
                ]}>
                <AppText
                  variant="small"
                  color={
                    chartMode === mode ? Colors.white : Colors.textSecondary
                  }
                  style={{fontWeight: '600'}}>
                  {mode === 'rir' ? 'RIR' : data.unit}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
        <TrendChart
          data={chartMode === 'rir' && data.refLow != null && data.refHigh != null
            ? data.trendChart.map(v => {
                const r = data.refHigh - data.refLow || 1;
                return ((v - data.refLow) / r);
              })
            : data.trendChart}
          dates={data.trendDates}
          refLow={chartMode === 'rir' ? 0 : data.refLow}
          refHigh={chartMode === 'rir' ? 1 : data.refHigh}
          width={SCREEN_W - s(48)}
        />
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: vs(4),
          }}>
          <AppText variant="small" color={Colors.teal}>
            Ref: {data.refRange} {data.unit}
          </AppText>
        </View>
      </View>

      {/* Timeline - Without Intervention */}
      {data.timeline && data.timeline.length > 0 && (
        <View style={sty.card}>
          <AppText
            variant="sectionTitle"
            style={{marginBottom: vs(10)}}>
            Without Intervention
          </AppText>
          {data.timeline.map((t, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                marginBottom: i < data.timeline.length - 1 ? vs(2) : 0,
              }}>
              {/* Vertical line + dot */}
              <View style={{alignItems: 'center', width: s(20)}}>
                <View
                  style={{
                    width: ms(10),
                    height: ms(10),
                    borderRadius: ms(5),
                    backgroundColor: t.color,
                    borderWidth: 2,
                    borderColor: t.color + '33',
                    zIndex: 1,
                  }}
                />
                {i < data.timeline.length - 1 && (
                  <View
                    style={{
                      width: 2,
                      flex: 1,
                      backgroundColor: Colors.borderLight,
                      marginVertical: vs(2),
                    }}
                  />
                )}
              </View>
              {/* Content */}
              <View
                style={{flex: 1, marginLeft: s(8), paddingBottom: vs(12)}}>
                <AppText
                  variant="caption"
                  style={{fontWeight: '700'}}
                  color={t.color}>
                  {t.label}
                </AppText>
                <AppText
                  variant="caption"
                  color={Colors.textSecondary}
                  style={{marginTop: vs(2)}}>
                  {t.detail}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      )}

      {/* About */}
      {data.about ? (
        <View style={sty.card}>
          <AppText
            variant="sectionTitle"
            style={{marginBottom: vs(6)}}>
            About {data.name}
          </AppText>
          <AppText
            variant="caption"
            color={Colors.textSecondary}
            style={{lineHeight: ms(18)}}>
            {data.about}
          </AppText>
        </View>
      ) : null}

      {/* Symptoms */}
      {data.symptoms && data.symptoms.length > 0 && (
        <View style={sty.card}>
          <AppText
            variant="sectionTitle"
            style={{marginBottom: vs(8)}}>
            Symptoms
          </AppText>
          {data.symptoms.map((sym, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: vs(6),
              }}>
              <View
                style={{
                  width: ms(6),
                  height: ms(6),
                  borderRadius: ms(3),
                  backgroundColor: Colors.amber,
                  marginTop: ms(5),
                  marginRight: s(8),
                }}
              />
              <AppText
                variant="caption"
                color={Colors.textSecondary}
                style={{flex: 1}}>
                {sym}
              </AppText>
            </View>
          ))}
        </View>
      )}

      {/* Causes */}
      {data.causes && data.causes.length > 0 && (
        <View style={sty.card}>
          <AppText
            variant="sectionTitle"
            style={{marginBottom: vs(8)}}>
            Causes
          </AppText>
          {data.causes.map((cause, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: vs(6),
              }}>
              <View
                style={{
                  width: ms(6),
                  height: ms(6),
                  borderRadius: ms(3),
                  backgroundColor: Colors.red,
                  marginTop: ms(5),
                  marginRight: s(8),
                }}
              />
              <AppText
                variant="caption"
                color={Colors.textSecondary}
                style={{flex: 1}}>
                {cause}
              </AppText>
            </View>
          ))}
        </View>
      )}

      {/* Visit Log */}
      {data.history && data.history.length > 0 && (
        <View style={{gap: vs(8)}}>
          <View style={sty.sectionLabel}>
            <AppText variant="small" color={Colors.textTertiary} style={{fontWeight:'700',textTransform:'uppercase',letterSpacing:0.8,fontSize:ms(9)}}>
              Visit Log
            </AppText>
            <View style={sty.sectionLine} />
          </View>
          {data.history.map((h, i) => {
            const sc = statusColor(h.status);
            const sb = statusBg(h.status);
            const rirNum = parseFloat(h.rir || 0);
            const rirColor = rirNum < 0 || rirNum > 1 ? Colors.red : rirNum < 0.15 || rirNum > 0.85 ? Colors.amber : Colors.teal;
            return (
              <View key={i} style={sty.visitCard}>
                {/* Top row: badge + date/note + status pill */}
                <View style={{flexDirection:'row',alignItems:'center',gap:s(10),paddingHorizontal:s(12),paddingVertical:vs(10)}}>
                  <View style={[sty.visitBadge,{backgroundColor:sb}]}>
                    <AppText style={{fontSize:ms(14),fontWeight:'700',fontFamily:'monospace',lineHeight:ms(16),color:sc}}>{i+1}</AppText>
                    <AppText style={{fontSize:ms(8),fontWeight:'600',color:sc,marginTop:vs(1)}}>Visit</AppText>
                  </View>
                  <View style={{flex:1}}>
                    <AppText variant="body" style={{fontWeight:'700'}}>{h.date}</AppText>
                    <AppText variant="small" color="#aaa" style={{marginTop:vs(1)}}>{h.note}</AppText>
                  </View>
                  <View style={[sty.pill,{backgroundColor:sb,paddingHorizontal:s(9),paddingVertical:vs(3),borderRadius:ms(12)}]}>
                    <AppText variant="small" color={sc} style={{fontWeight:'700',fontSize:ms(9)}}>{h.status === 'normal' ? 'Normal' : h.status === 'elevated' ? 'High' : 'Low'}</AppText>
                  </View>
                </View>

                {/* Divider */}
                <View style={{height:0.5,backgroundColor:'#f0f4f2',marginHorizontal:s(12)}} />

                {/* Value / Machine / RIR row */}
                <View style={{flexDirection:'row',gap:s(4),paddingHorizontal:s(12),paddingVertical:vs(10)}}>
                  <View style={{flex:1}}>
                    <AppText style={{fontSize:ms(8),fontWeight:'700',textTransform:'uppercase',letterSpacing:0.5,color:'#aaa',marginBottom:vs(3)}}>Value</AppText>
                    <AppText style={{fontSize:ms(15),fontWeight:'700',fontFamily:'monospace',lineHeight:ms(18),color:sc}}>{h.value}</AppText>
                    <AppText style={{fontSize:ms(9),color:'#aaa'}}>{h.unit}</AppText>
                  </View>
                  <View style={{flex:1}}>
                    <AppText style={{fontSize:ms(8),fontWeight:'700',textTransform:'uppercase',letterSpacing:0.5,color:'#aaa',marginBottom:vs(3)}}>Machine</AppText>
                    <View style={{backgroundColor:Colors.tealBg,paddingHorizontal:s(8),paddingVertical:vs(3),borderRadius:ms(8),alignSelf:'flex-start',marginTop:vs(4)}}>
                      <AppText style={{fontSize:ms(10),fontWeight:'700',color:Colors.primary}}>TrustLab</AppText>
                    </View>
                  </View>
                  <View style={{flex:1,alignItems:'flex-end'}}>
                    <AppText style={{fontSize:ms(8),fontWeight:'700',textTransform:'uppercase',letterSpacing:0.5,color:'#aaa',marginBottom:vs(3)}}>RIR</AppText>
                    <AppText style={{fontSize:ms(15),fontWeight:'700',fontFamily:'monospace',lineHeight:ms(18),color:rirColor}}>{h.rir}</AppText>
                  </View>
                </View>

                {/* Stats row: delta / range / status */}
                <View style={{flexDirection:'row',borderTopWidth:0.5,borderTopColor:'#f0f4f2',marginTop:vs(0),paddingTop:vs(8),marginHorizontal:s(12),paddingBottom:vs(8)}}>
                  <View style={{flex:1,alignItems:'center',borderRightWidth:0.5,borderRightColor:'#f0f4f2'}}>
                    <AppText style={{fontSize:ms(8),fontWeight:'700',textTransform:'uppercase',letterSpacing:0.5,color:'#aaa',marginBottom:vs(2)}}>{'\u0394'} vs baseline</AppText>
                    <AppText style={{fontSize:ms(12),fontWeight:'700',fontFamily:'monospace',color: h.delta === '\u2014' ? '#888' : (h.delta || '').startsWith('-') ? Colors.teal : Colors.red}}>{h.delta}</AppText>
                  </View>
                  <View style={{flex:1,alignItems:'center',borderRightWidth:0.5,borderRightColor:'#f0f4f2'}}>
                    <AppText style={{fontSize:ms(8),fontWeight:'700',textTransform:'uppercase',letterSpacing:0.5,color:'#aaa',marginBottom:vs(2)}}>Range</AppText>
                    <AppText style={{fontSize:ms(9),fontWeight:'700',color:'#888'}}>{h.refRange}</AppText>
                  </View>
                  <View style={{flex:1,alignItems:'center'}}>
                    <AppText style={{fontSize:ms(8),fontWeight:'700',textTransform:'uppercase',letterSpacing:0.5,color:'#aaa',marginBottom:vs(2)}}>Status</AppText>
                    <AppText style={{fontSize:ms(12),fontWeight:'700',fontFamily:'monospace',color:sc}}>{h.status === 'normal' ? 'Normal' : h.status === 'elevated' ? 'High' : 'Low'}</AppText>
                  </View>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

// --- Progression Tab ---
const ProgressionTab = ({data}) => {
  const prog = data.progression;
  if (!prog) return null;

  const panelBgs = [
    {bg: '#F0FDFA', border: '#CCFBF1', lbl: '#0F766E', fill: '#0D9488'},
    {bg: '#F5F3FF', border: '#EDE9FE', lbl: '#7C3AED', fill: '#7C3AED'},
    {bg: '#EFF6FF', border: '#DBEAFE', lbl: '#1D4ED8', fill: '#1D4ED8'},
  ];

  return (
    <View style={{gap: vs(12)}}>
      {/* Current Position Bar */}
      <View style={sty.card}>
        <AppText
          variant="small"
          color={Colors.textTertiary}
          style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: vs(8)}}>
          Current position in range
        </AppText>
        <View
          style={{
            height: ms(8),
            borderRadius: ms(4),
            backgroundColor: '#E2E8F0',
            overflow: 'hidden',
            position: 'relative',
          }}>
          {/* Normal band */}
          <View style={{position: 'absolute', left: 0, right: 0, top: 0, bottom: 0, backgroundColor: 'rgba(13,148,136,0.12)'}} />
        </View>
        {/* Marker dot */}
        <View
          style={{
            position: 'absolute',
            left: s(14) + (SCREEN_W - s(56)) * Math.max(0.03, Math.min(0.97, prog.currentPosition)),
            top: vs(28),
            zIndex: 2,
          }}>
          <View
            style={{
              width: ms(16),
              height: ms(16),
              borderRadius: ms(8),
              backgroundColor: Colors.primary,
              borderWidth: 3,
              borderColor: Colors.white,
              elevation: 3,
              shadowColor: '#000',
              shadowOffset: {width: 0, height: 1},
              shadowOpacity: 0.2,
              shadowRadius: 3,
            }}
          />
        </View>
        {/* Range labels */}
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            marginTop: vs(10),
          }}>
          {prog.rangeLabels.map((lbl, i) => (
            <AppText key={i} variant="small" color={i === 1 ? Colors.teal : Colors.textTertiary} style={{fontWeight: i === 1 ? '600' : '400'}}>
              {lbl}
            </AppText>
          ))}
        </View>
      </View>

      {/* Score Breakdown - light gradient panels matching HTML */}
      <AppText
        variant="small"
        color={Colors.textTertiary}
        style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8}}>
        Score breakdown
      </AppText>
      {Object.entries(prog.scores).map(([key, sc], idx) => {
        const p = panelBgs[idx] || panelBgs[0];
        return (
          <View
            key={key}
            style={[sty.scorePanel, {backgroundColor: p.bg}]}>
            {/* Header row */}
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                marginBottom: vs(7),
              }}>
              <View>
                <AppText
                  variant="small"
                  color={p.lbl}
                  style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8}}>
                  {sc.label}
                </AppText>
              </View>
              <AppText
                style={{
                  fontSize: ms(20),
                  lineHeight: ms(24),
                  fontWeight: '700',
                  color: p.lbl,
                  fontFamily: 'monospace',
                }}>
                {sc.score}
              </AppText>
            </View>

            {/* Progress bar */}
            <ProgressBar
              progress={sc.score / 100}
              color={p.fill}
              height={5}
              bg="rgba(0,0,0,0.08)"
            />

            {/* Badge */}
            <View style={{flexDirection: 'row', marginTop: vs(6)}}>
              <View style={[sty.pill, {backgroundColor: sc.badgeColor + '18'}]}>
                <AppText
                  variant="small"
                  color={sc.badgeColor}
                  style={{fontWeight: '700'}}>
                  {sc.badge}
                </AppText>
              </View>
            </View>

            {sc.detail ? (
              <AppText
                variant="caption"
                color="#334155"
                style={{marginTop: vs(6), lineHeight: ms(17)}}>
                {sc.detail}
              </AppText>
            ) : null}
          </View>
        );
      })}

      {/* Historical Trend */}
      <View style={sty.sectionLabel}>
        <AppText variant="small" color={Colors.textTertiary} style={{fontWeight:'700',textTransform:'uppercase',letterSpacing:0.8,fontSize:ms(9)}}>Historical trend</AppText>
        <View style={sty.sectionLine} />
      </View>
      {data.trendChart && data.trendChart.length > 0 && (
        <View style={{backgroundColor:Colors.background,borderWidth:0.5,borderColor:Colors.borderLight,borderRadius:ms(10),padding:s(10),marginBottom:vs(8)}}>
          {/* Header with title + legend */}
          <View style={{flexDirection:'row',alignItems:'center',justifyContent:'space-between',marginBottom:vs(6)}}>
            <AppText variant="small" color={Colors.textTertiary} style={{fontWeight:'700',textTransform:'uppercase',letterSpacing:0.6,fontSize:ms(9)}}>{data.name}</AppText>
            <View style={{flexDirection:'row',gap:s(10)}}>
              <View style={{flexDirection:'row',alignItems:'center',gap:s(4)}}>
                <View style={{width:ms(12),height:2,borderRadius:1,backgroundColor:Colors.amber}} />
                <AppText variant="small" color={Colors.textTertiary} style={{fontSize:ms(9)}}>Measured</AppText>
              </View>
              <View style={{flexDirection:'row',alignItems:'center',gap:s(4)}}>
                <AppText variant="small" color={Colors.teal} style={{fontSize:ms(9)}}>— Target</AppText>
              </View>
            </View>
          </View>
          {/* Chart with ref band */}
          <TrendChart
            data={data.trendChart}
            dates={data.trendDates}
            refLow={data.refLow}
            refHigh={data.refHigh}
            height={vs(72)}
            width={SCREEN_W - s(48)}
          />
        </View>
      )}

      {/* Measurement History Table */}
      {prog.measurementTable && prog.measurementTable.length > 0 && (
        <View style={sty.card}>
          <AppText
            variant="sectionTitle"
            style={{marginBottom: vs(8)}}>
            Measurement History
          </AppText>
          {/* Header row */}
          <View style={sty.tableRow}>
            {['Date', 'Value', '\u0394', 'Status', 'HPS'].map(h => (
              <AppText
                key={h}
                variant="small"
                color={Colors.textTertiary}
                style={{
                  fontWeight: '600',
                  flex: h === 'Date' ? 1.4 : h === 'Status' ? 1 : 0.7,
                  textAlign: h === 'Date' ? 'left' : 'center',
                }}>
                {h}
              </AppText>
            ))}
          </View>
          {prog.measurementTable.map((row, i) => (
            <View
              key={i}
              style={[
                sty.tableRow,
                {
                  backgroundColor:
                    i % 2 === 0 ? Colors.background : Colors.white,
                },
              ]}>
              <AppText variant="small" style={{flex: 1.4}}>
                {row.date}
              </AppText>
              <AppText
                variant="small"
                style={{
                  flex: 0.7,
                  textAlign: 'center',
                  fontWeight: '600',
                }}>
                {row.value}
              </AppText>
              <AppText
                variant="small"
                style={{flex: 0.7, textAlign: 'center'}}
                color={
                  (row.delta || '').startsWith('+') ? Colors.red : Colors.teal
                }>
                {row.delta}
              </AppText>
              <View style={{flex: 1, alignItems: 'center'}}>
                <View
                  style={[
                    sty.pill,
                    {
                      backgroundColor: statusBg(row.status),
                      paddingHorizontal: s(6),
                      paddingVertical: vs(1),
                    },
                  ]}>
                  <AppText
                    variant="small"
                    color={statusColor(row.status)}
                    style={{fontWeight: '600', fontSize: ms(8)}}>
                    {row.status}
                  </AppText>
                </View>
              </View>
              <AppText
                variant="small"
                style={{
                  flex: 0.7,
                  textAlign: 'center',
                  fontWeight: '600',
                }}>
                {row.hps}
              </AppText>
            </View>
          ))}
        </View>
      )}
    </View>
  );
};

// --- Organs Tab ---
const ORGAN_COLORS = {
  'Pancreas':'#F59E0B','Bones':'#8B5CF6','Muscles':'#F59E0B','Brain':'#7C3AED',
  'Immune System':'#06B6D4','Heart':'#EF4444','Kidneys':'#3B82F6','Liver':'#06B6D4',
  'Eyes':'#8B5CF6','Nerves':'#F59E0B','Thyroid':'#16A34A','Arteries':'#EF4444',
};

const OrgansTab = ({data}) => {
  const organs = data.organs || [];
  const details = data.organDetails || [];
  if (organs.length === 0 && details.length === 0) {
    return (
      <View style={sty.card}>
        <AppText variant="body" color={Colors.textTertiary} style={{textAlign:'center',paddingVertical:vs(20)}}>
          No organ impact data available yet.
        </AppText>
      </View>
    );
  }

  return (
    <View style={{gap: vs(10)}}>
      {/* Organ Grid (2-column) */}
      {organs.length > 0 && (
        <View style={{flexDirection:'row',flexWrap:'wrap',gap:s(8),marginBottom:vs(2)}}>
          {organs.map((org, i) => {
            const oc = ORGAN_COLORS[org.name] || Colors.amber;
            const sevColor = org.severity > 50 ? Colors.red : org.severity > 30 ? Colors.amber : Colors.teal;
            return (
              <View key={i} style={sty.organGridCard}>
                {/* Top row: name + score */}
                <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'flex-start',marginBottom:vs(7)}}>
                  <View style={{flex:1}}>
                    <AppText variant="caption" style={{fontWeight:'700',fontSize:ms(11),color:Colors.textPrimary,marginBottom:vs(1)}}>{org.name}</AppText>
                    <AppText variant="small" color={oc} style={{fontWeight:'600',fontSize:ms(9)}}>{org.stage}</AppText>
                  </View>
                  <AppText style={{fontSize:ms(16),fontWeight:'700',fontFamily:'monospace',color:oc}}>
                    {org.severity}<AppText style={{fontSize:ms(11),opacity:0.5,color:oc}}>/100</AppText>
                  </AppText>
                </View>
                {/* Progress bar */}
                <View style={{marginBottom:vs(6)}}>
                  <ProgressBar progress={org.severity / 100} color={oc} height={5} />
                </View>
                {/* Trend */}
                <AppText variant="small" color={Colors.textTertiary} style={{fontSize:ms(9)}}>
                  {org.severity > 50 ? '\u2191 Worsening' : '\u2192 Stable'}
                </AppText>
              </View>
            );
          })}
        </View>
      )}

      {/* Organ Impact Detail Cards */}
      {details.map((org, i) => {
        const oc = ORGAN_COLORS[org.name] || Colors.amber;
        return (
          <View key={i} style={[sty.card,{paddingHorizontal:s(12),paddingVertical:vs(10)}]}>
            {/* Header: icon + name + stage */}
            <View style={{flexDirection:'row',alignItems:'center',gap:s(7),marginBottom:vs(5)}}>
              <View style={{width:ms(28),height:ms(28),borderRadius:ms(8),backgroundColor:oc + '15',alignItems:'center',justifyContent:'center'}}>
                <Icon family="Ionicons" name={org.icon || 'body-outline'} size={13} color={oc} />
              </View>
              <View style={{flex:1}}>
                <AppText variant="body" style={{fontWeight:'700',fontSize:ms(12)}}>{org.name}</AppText>
                <AppText variant="small" color={oc} style={{fontWeight:'600',fontSize:ms(9)}}>{org.stage}</AppText>
              </View>
            </View>
            {/* Impact text */}
            <AppText variant="caption" color={Colors.textSecondary} style={{lineHeight:ms(18),fontSize:ms(11)}}>
              {org.impact}
            </AppText>
          </View>
        );
      })}
    </View>
  );
};

// --- Cluster Tab ---
const ClusterTab = ({data}) => {
  const cl = data.cluster;
  if (!cl || !cl.name) {
    return (
      <View style={sty.card}>
        <AppText
          variant="body"
          color={Colors.textTertiary}
          style={{textAlign: 'center', paddingVertical: vs(20)}}>
          No cluster data available yet.
        </AppText>
      </View>
    );
  }

  return (
    <View style={{gap: vs(12)}}>
      {/* Risk Header */}
      <View style={sty.card}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}>
          <View style={{flex: 1, marginRight: s(12)}}>
            <AppText
              variant="body"
              style={{fontWeight: '800', fontSize: ms(15)}}>
              {cl.name}
            </AppText>
            <AppText
              variant="caption"
              color={Colors.textSecondary}
              style={{marginTop: vs(4), lineHeight: ms(17)}}>
              {cl.description}
            </AppText>
          </View>
          <View style={{alignItems:'center'}}>
            <AppText
              style={{
                fontSize: ms(24),
                fontWeight:'700',
                fontFamily:'monospace',
                lineHeight: ms(28),
                color: cl.riskScore > 60 ? Colors.red : cl.riskScore > 40 ? '#F97316' : Colors.teal,
              }}>
              {cl.riskScore}%
            </AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{fontSize:ms(8),textTransform:'uppercase',letterSpacing:0.5,fontWeight:'600'}}>
              Risk Score
            </AppText>
          </View>
        </View>

        {/* Disease rows inside same card */}
        {cl.diseases && cl.diseases.length > 0 && cl.diseases.map((d, i) => {
          const pct = d.probability != null ? d.probability : (d.progress != null ? Math.round(d.progress * 100) : 0);
          const barColor = d.type === 'active' ? Colors.red : d.type === 'emerging' ? '#F97316' : Colors.blue;
          const typeLabel = d.type === 'active' ? 'Active' : d.type === 'emerging' ? 'Emerging' : 'Watch Zone';
          const typeColor = d.type === 'active' ? Colors.red : d.type === 'emerging' ? '#F97316' : Colors.blue;
          return (
            <View key={i} style={{paddingVertical:vs(8),borderBottomWidth:i < cl.diseases.length - 1 ? 0.5 : 0,borderBottomColor:'#f4f4f4'}}>
              <View style={{flexDirection:'row',justifyContent:'space-between',alignItems:'center',marginBottom:vs(4)}}>
                <AppText variant="caption" style={{fontWeight:'600',color:'#374151',fontSize:ms(11)}}>{d.name}</AppText>
                <AppText variant="small" color={typeColor} style={{fontWeight:'700',fontSize:ms(9)}}>{typeLabel}</AppText>
              </View>
              <ProgressBar progress={pct / 100} color={barColor} height={5} />
            </View>
          );
        })}
      </View>

      {/* Cluster Timeline */}
      {cl.timeline && cl.timeline.length > 0 && (
        <View style={sty.card}>
          <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>
            Progression Timeline
          </AppText>
          {cl.timeline.map((t, i) => {
            const tlLabel = t.time || t.stage || '';
            const tlDetail = t.event || t.detail || '';
            const tlColor = t.color || t.col || Colors.textTertiary;
            return (
              <View key={i} style={{flexDirection:'row',marginBottom:i < cl.timeline.length - 1 ? vs(2) : 0}}>
                <View style={{alignItems:'center',width:s(16)}}>
                  <View style={{width:ms(10),height:ms(10),borderRadius:ms(5),backgroundColor:tlColor,zIndex:1}} />
                  {i < cl.timeline.length - 1 && (
                    <View style={{width:2,flex:1,backgroundColor:Colors.borderLight,marginVertical:vs(2)}} />
                  )}
                </View>
                <View style={{flex:1,marginLeft:s(8),paddingBottom:vs(12)}}>
                  <AppText variant="caption" style={{fontWeight:'700'}}
                    color={tlColor}>
                    {tlLabel}
                  </AppText>
                  <AppText
                    variant="caption"
                    color={Colors.textSecondary}
                    style={{marginTop: vs(2), lineHeight: ms(16)}}>
                    {tlDetail}
                  </AppText>
                </View>
              </View>
            );
          })}
        </View>
      )}
    </View>
  );
};

// --- Care Tab ---
const CareTab = ({data}) => {
  const care = data.care;
  if (!care) return null;

  return (
    <View style={{gap: vs(12)}}>
      {/* Action Cards */}
      {care.actions && care.actions.length > 0 && (
        <View style={{gap: vs(8)}}>
          <AppText variant="sectionTitle">
            Recommended Actions
          </AppText>
          {care.actions.map((a, i) => (
            <View
              key={i}
              style={[
                sty.card,
                {borderLeftWidth: 2.5, borderLeftColor: a.color},
              ]}>
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: s(8),
                  marginBottom: vs(6),
                }}>
                <View
                  style={{
                    width: ms(30),
                    height: ms(30),
                    borderRadius: ms(15),
                    backgroundColor: a.color + '15',
                    alignItems: 'center',
                    justifyContent: 'center',
                  }}>
                  <Icon
                    family="Ionicons"
                    name={a.icon}
                    size={15}
                    color={a.color}
                  />
                </View>
                <View style={{flex: 1}}>
                  <AppText variant="body" style={{fontWeight: '700'}}>
                    {a.title}
                  </AppText>
                </View>
                <View
                  style={[sty.pill, {backgroundColor: a.color + '15'}]}>
                  <AppText
                    variant="small"
                    color={a.color}
                    style={{fontWeight: '700', fontSize: ms(8)}}>
                    {a.priority}
                  </AppText>
                </View>
              </View>
              <AppText
                variant="caption"
                color={Colors.textSecondary}
                style={{lineHeight: ms(17)}}>
                {a.description}
              </AppText>
            </View>
          ))}
        </View>
      )}

      {/* Treatment Plan */}
      {care.treatment && care.treatment.length > 0 && (
        <View style={sty.card}>
          <AppText
            variant="sectionTitle"
            style={{marginBottom: vs(8)}}>
            Treatment Plan
          </AppText>
          {care.treatment.map((step, i) => (
            <View
              key={i}
              style={{
                flexDirection: 'row',
                alignItems: 'flex-start',
                marginBottom: vs(8),
              }}>
              <View
                style={{
                  width: ms(22),
                  height: ms(22),
                  borderRadius: ms(11),
                  backgroundColor: Colors.tealBg,
                  alignItems: 'center',
                  justifyContent: 'center',
                  marginRight: s(8),
                }}>
                <AppText
                  variant="small"
                  color={Colors.tealText}
                  style={{fontWeight: '800'}}>
                  {i + 1}
                </AppText>
              </View>
              <AppText
                variant="caption"
                color={Colors.textSecondary}
                style={{
                  flex: 1,
                  lineHeight: ms(17),
                  marginTop: vs(2),
                }}>
                {step}
              </AppText>
            </View>
          ))}
        </View>
      )}

      {/* Prevention */}
      {care.prevention ? (
        <View
          style={[
            sty.card,
            {
              backgroundColor: Colors.tealBg,
              borderColor: Colors.accent + '33',
            },
          ]}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: s(6),
              marginBottom: vs(6),
            }}>
            <Icon
              family="Ionicons"
              name="shield-checkmark-outline"
              size={16}
              color={Colors.tealText}
            />
            <AppText
              variant="body"
              color={Colors.tealText}
              style={{fontWeight: '700'}}>
              Prevention
            </AppText>
          </View>
          <AppText
            variant="caption"
            color={Colors.tealText}
            style={{lineHeight: ms(17), opacity: 0.85}}>
            {care.prevention}
          </AppText>
        </View>
      ) : null}
    </View>
  );
};

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const BiomarkerIntelDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const {biomarkerId} = route.params || {};

  const [activeTab, setActiveTab] = useState('ayuIntel');

  // Find biomarker and build detail data
  const data = useMemo(() => {
    const bm = BIOMARKERS.find(b => b.id === biomarkerId);
    return mapBiomarkerToDetail(bm) || mapBiomarkerToDetail(BIOMARKERS[0]);
  }, [biomarkerId]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ayuIntel':
        return <AyuIntelTab data={data} />;
      case 'progression':
        return <ProgressionTab data={data} />;
      case 'organs':
        return <OrgansTab data={data} />;
      case 'cluster':
        return <ClusterTab data={data} />;
      case 'care':
        return <CareTab data={data} />;
      default:
        return <AyuIntelTab data={data} />;
    }
  };

  // Header metric cards config - use hdr from detail data if available
  // Biomarker-specific metric cards
  const metricCards = [
    {label: 'Latest RIR', value: String(data.latestRIR), color: Colors.accent},
    {label: 'Value', value: String(data.latestValue) + (data.unit && typeof data.latestValue === 'number' ? data.unit : ''), color: Colors.blue},
    {label: '\u0394 Baseline', value: data.delta, color: data.deltaDirection === 'up' ? Colors.red : Colors.teal},
    {label: 'Readings', value: String(data.readingsCount), color: Colors.purple},
  ];

  return (
    <View style={sty.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={[sty.header, {paddingTop: insets.top + vs(10)}]}>
        {/* Top row: back + tag + name */}
        <View style={sty.topBar}>
          <TouchableOpacity
            style={sty.backBtn}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}>
            <Icon
              family="Ionicons"
              name="chevron-back"
              size={16}
              color={Colors.white}
            />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText
              variant="small"
              color="rgba(255,255,255,0.38)"
              style={{marginBottom: vs(2)}}>
              {data.category} \u00B7 Ayu Intel
            </AppText>
            <AppText
              style={{
                fontSize: ms(17),
                fontWeight: '800',
                color: Colors.white,
              }}>
              {data.name}
            </AppText>
            {(
              <AppText
                variant="caption"
                color="rgba(255,255,255,0.45)"
                style={{marginTop: vs(2)}}>
                Ref: {data.refRange} {data.unit}
              </AppText>
            )}
          </View>
        </View>

        {/* Metric cards row */}
        <View style={sty.metricRow}>
          {metricCards.map((m, i) => (
            <View
              key={i}
              style={[sty.metricCard, {borderLeftColor: m.color}]}>
              <AppText
                variant="small"
                color="rgba(255,255,255,0.38)"
                style={{marginBottom: vs(3), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, fontSize: ms(8)}}>
                {m.label}
              </AppText>
              <AppText
                style={{
                  fontSize: ms(14),
                  fontWeight: '700',
                  color: m.color || Colors.white,
                  fontFamily: 'monospace',
                  lineHeight: ms(18),
                }}>
                {m.value}
              </AppText>
              {m.sub ? (
                <AppText
                  variant="small"
                  color="rgba(255,255,255,0.4)"
                  style={{marginTop: vs(2), fontSize: ms(8)}}>
                  {m.sub}
                </AppText>
              ) : null}
            </View>
          ))}
        </View>

      </View>
      {/* Tabs - full width, outside header padding */}
      <View style={sty.tabContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={sty.tabScroll}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[sty.tab, isActive && sty.tabActive]}
                activeOpacity={0.7}
                onPress={() => setActiveTab(tab.key)}>
                <AppText
                  variant="small"
                  color={
                    isActive ? Colors.accent : 'rgba(255,255,255,0.4)'
                  }
                  style={{fontWeight: '700', fontSize: ms(10)}}>
                  {tab.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView
        style={sty.scroll}
        contentContainerStyle={sty.scrollContent}
        showsVerticalScrollIndicator={false}>
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

  // Header
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: vs(8),
    paddingHorizontal: s(14),
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(12),
  },
  backBtn: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: ms(2),
    marginTop: vs(2),
  },

  // Metric cards
  metricRow: {flexDirection: 'row', gap: s(6), marginBottom: vs(12)},
  metricCard: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: ms(9),
    paddingVertical: vs(7),
    paddingHorizontal: s(7),
    borderLeftWidth: 2.5,
  },

  // Tabs
  tabContainer: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
  },
  tabScroll: {paddingHorizontal: s(10)},
  tab: {
    paddingHorizontal: s(11),
    paddingVertical: vs(9),
    borderBottomWidth: 2.5,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.accent,
  },

  // Content
  scroll: {flex: 1},
  scrollContent: {padding: s(12), paddingBottom: vs(30)},

  // Cards
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: s(14),
  },
  visitCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(13),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  visitBadge: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginTop: vs(14),
    marginBottom: vs(7),
  },
  sectionLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: Colors.borderLight,
  },

  // Analysis card (gradient)
  analysisCard: {
    borderRadius: ms(14),
    padding: s(13),
    position: 'relative',
  },

  // Correlation card
  correlationCard: {
    backgroundColor: 'rgba(255,255,255,0.07)',
    borderRadius: ms(9),
    paddingVertical: vs(8),
    paddingHorizontal: s(10),
    borderLeftWidth: 2.5,
    borderLeftColor: '#D85A30',
  },

  // Score panel
  scorePanel: {
    borderRadius: ms(11),
    padding: s(11),
  },

  // Organ grid card
  organGridCard: {
    width: (SCREEN_W - s(32)) / 2,
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: s(10),
  },

  // Misc
  pill: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  urgencyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
    borderWidth: 0.5,
  },
  statusDot: {
    width: ms(7),
    height: ms(7),
    borderRadius: ms(4),
  },
  toggleBtn: {
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(6),
    backgroundColor: Colors.borderLight,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(6),
    paddingHorizontal: s(4),
    borderRadius: ms(4),
  },
});

export default BiomarkerIntelDetailScreen;
