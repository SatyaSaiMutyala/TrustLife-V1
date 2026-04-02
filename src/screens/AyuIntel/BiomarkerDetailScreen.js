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
import {
  BIOMARKERS,
  LIFESTYLE_SECTIONS,
  LIFESTYLE_DETAIL_DATA,
  MEDICAL_CONDITIONS,
  MEDICAL_DETAIL_DATA,
  ORGANS,
} from '../../constants/ayuIntelData';

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

const PLACEHOLDER_LIFESTYLE = {
  id: 'sleep_quality',
  name: 'Sleep Quality',
  category: 'Lifestyle',
  unit: 'score',
  refRange: '80 \u2013 100',
  latestValue: 62,
  latestRIR: 0.78,
  delta: '-5',
  deltaDirection: 'down',
  readingsCount: 30,
  baseline: 82,
  urgency: 'Suboptimal',
  urgencyColor: Colors.amber,
  narrative:
    'Your sleep quality has been declining over the past month, correlating with increased screen time and irregular sleep schedule.',
  correlations: [],
  history: [{date: '2026-03-30', value: 62, status: 'low', delta: '-5'}],
  trendChart: [82, 78, 75, 70, 67, 62],
  trendDates: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  refLow: 80,
  refHigh: 100,
  timeline: [],
  about:
    'Sleep quality score based on duration, efficiency, and disruption metrics.',
  symptoms: [],
  causes: [],
  progression: {
    currentPosition: 0.38,
    rangeLabels: ['Poor', 'Fair', 'Good'],
    rangeBreaks: [0.33, 0.66],
    scores: {
      status: {
        score: 55,
        label: 'Status',
        badge: 'Fair',
        badgeColor: Colors.amber,
        detail: '',
      },
      stability: {
        score: 40,
        label: 'Stability',
        badge: 'Declining',
        badgeColor: Colors.red,
        detail: '',
      },
      velocity: {
        score: 50,
        label: 'Velocity',
        badge: 'Moderate',
        badgeColor: Colors.amber,
        detail: '',
      },
    },
    hpsHistory: [],
    measurementTable: [],
  },
  organs: [],
  organDetails: [],
  cluster: {name: '', description: '', riskScore: 0, diseases: [], timeline: []},
  care: {actions: [], treatment: [], prevention: ''},
};

const PLACEHOLDER_MEDICAL = {
  id: 'hypertension',
  name: 'Hypertension',
  category: 'Medical Condition',
  unit: 'mmHg',
  refRange: '< 120/80',
  latestValue: '138/88',
  latestRIR: 1.15,
  delta: '+4/+2',
  deltaDirection: 'up',
  readingsCount: 12,
  baseline: '120/78',
  urgency: 'Stage 1',
  urgencyColor: Colors.amber,
  narrative:
    'Blood pressure readings show a consistent upward trend, now classified as Stage 1 hypertension.',
  correlations: [],
  history: [
    {date: '2026-03-20', value: '138/88', status: 'elevated', delta: '+4/+2'},
  ],
  trendChart: [120, 124, 126, 130, 134, 138],
  trendDates: ['Oct', 'Nov', 'Dec', 'Jan', 'Feb', 'Mar'],
  refLow: 90,
  refHigh: 120,
  timeline: [],
  about:
    'Hypertension is sustained elevation of blood pressure above normal thresholds.',
  symptoms: [],
  causes: [],
  progression: {
    currentPosition: 0.58,
    rangeLabels: ['Normal', 'Elevated', 'Stage 1', 'Stage 2'],
    rangeBreaks: [0.3, 0.55, 0.8],
    scores: {
      status: {
        score: 50,
        label: 'Status',
        badge: 'Stage 1',
        badgeColor: Colors.amber,
        detail: '',
      },
      stability: {
        score: 45,
        label: 'Stability',
        badge: 'Worsening',
        badgeColor: Colors.red,
        detail: '',
      },
      velocity: {
        score: 55,
        label: 'Velocity',
        badge: 'Slow',
        badgeColor: Colors.amber,
        detail: '',
      },
    },
    hpsHistory: [],
    measurementTable: [],
  },
  organs: [],
  organDetails: [],
  cluster: {name: '', description: '', riskScore: 0, diseases: [], timeline: []},
  care: {actions: [], treatment: [], prevention: ''},
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

  const history = hist.map((h, i) => {
    const prev = hist[i + 1];
    const d = prev ? (h.v - prev.v).toFixed(1) : '\u2014';
    const dStr = prev && parseFloat(d) >= 0 ? '+' + d : d;
    return {date: h.dt, value: h.v, status: _histStatusLabel(h.st), delta: dStr};
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

  const relevantOrgans = (ORGANS || []).map(o => ({
    name: o.name,
    stage: o.pillLabel,
    severity:
      o.pillLabel === 'Normal' ? 15 : o.pillLabel === 'Borderline' ? 42 : 55,
    trend: o.pillLabel === 'Normal' ? 'Stable' : 'Watch',
    icon: o.ico,
  }));

  const organDetails = (ORGANS || []).map(o => ({
    name: o.name,
    stage: o.pillLabel,
    impact: o.detail,
    icon: o.ico,
  }));

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
    urgency: urgency.label,
    urgencyColor: urgency.color,
    narrative: bm.insight || '',
    correlations: [],
    history: history,
    trendChart: trendChart,
    trendDates: trendDates,
    refLow: bm.lo,
    refHigh: bm.hi,
    timeline: [
      {
        label: 'Now',
        detail: '' + bm.val + bm.unit + ' \u2014 ' + bm.st.lbl,
        color: urgency.color,
      },
    ],
    about: bm.st.d || '',
    symptoms: [],
    causes: [],
    progression: {
      currentPosition: currentPosition,
      rangeLabels: ['Low', 'Normal', 'Elevated'],
      rangeBreaks: [0.25, 0.5],
      scores: _buildScores(bm),
      hpsHistory: hpsHistory,
      measurementTable: measurementTable,
    },
    organs: relevantOrgans.slice(0, 4),
    organDetails: organDetails.slice(0, 4),
    cluster: {
      name: bm.cat + ' Cluster',
      description: bm.insight || 'Cluster analysis for ' + bm.name + '.',
      riskScore: Math.max(0, 100 - bm.hps),
      diseases: [],
      timeline: [],
    },
    care: {
      actions: [
        {
          priority: bm.hps < 60 ? 'High' : 'Medium',
          icon: 'medkit-outline',
          title: 'Monitor ' + bm.name,
          description: bm.insight || 'Continue monitoring ' + bm.name + ' levels.',
          color: urgency.color,
        },
      ],
      treatment: [
        'Retest ' + bm.name + ' in 3 months',
        'Discuss results with your doctor',
      ],
      prevention: bm.insight || '',
    },
  };
};

const ORGAN_ICON_MAP = {
  'Liver': 'medical-outline',
  'Kidneys': 'water-outline',
  'Pancreas': 'fitness-outline',
  'Heart': 'heart-outline',
  'Blood Vessels': 'pulse-outline',
  'Brain': 'bulb-outline',
  'Muscles': 'barbell-outline',
  'Adrenal Glands': 'flash-outline',
  'Nerves': 'flash-outline',
};

const mapLifestyleToDetail = section => {
  if (!section) return null;
  const metrics = section.metrics || [];
  const firstMetric = metrics[0];
  const numericVal = firstMetric
    ? parseFloat(firstMetric.value.replace(/[^0-9.\-]/g, '')) || 0
    : 0;

  const detail = LIFESTYLE_DETAIL_DATA[section.id] || {};

  const correlations = metrics.map(m => ({
    label: m.label,
    value: m.value,
    status:
      m.pillLabel === '\u2713'
        ? 'normal'
        : m.pillLabel === '\u26a0'
        ? 'elevated'
        : m.pillLabel.toLowerCase(),
  }));

  const trendChart = metrics.map((_, i) => numericVal - (metrics.length - 1 - i) * 2);
  const trendDates = metrics.map((_, i) => 'Point ' + (i + 1));

  const badgeText = section.badge || '';
  const isWarning =
    badgeText.toLowerCase().includes('concern') ||
    badgeText.toLowerCase().includes('below') ||
    badgeText.toLowerCase().includes('attention');
  const urgencyColor = detail.urgency === 'high' ? Colors.amber : isWarning ? Colors.amber : Colors.teal;
  const urgencyLabel = detail.urgency === 'high' ? 'Needs Attention' : isWarning ? 'Suboptimal' : 'Normal';

  // Build history from metrics as monthly entries
  var history = metrics.map(function(m, i) {
    var monthNames = ['Mar 26', 'Feb 26', 'Jan 26', 'Dec 25', 'Nov 25', 'Oct 25', 'Sep 25'];
    var val = parseFloat(m.value.replace(/[^0-9.\-]/g, '')) || 0;
    return {
      dt: monthNames[i] || 'Month ' + (i + 1),
      v: val,
      st: m.pillLabel === '\u2713' ? 'n' : 'h',
    };
  });

  // Build measurement table from metrics
  var measurementTable = metrics.map(function(m, i) {
    var monthNames = ['Mar 2026', 'Feb 2026', 'Jan 2026', 'Dec 2025', 'Nov 2025', 'Oct 2025', 'Sep 2025'];
    return {
      date: monthNames[i] || 'Month ' + (i + 1),
      label: m.label,
      value: m.value,
      ref: m.ref || '',
      status: m.pillLabel === '\u2713' ? 'normal' : 'elevated',
    };
  });

  // Map organs from detail data
  var detailOrgans = (detail.organs || []);
  var organs = detailOrgans.map(function(o) {
    return {
      name: o.n,
      icon: ORGAN_ICON_MAP[o.n] || 'body-outline',
      severity: o.sev,
      color: o.col,
    };
  });

  var organDetails = detailOrgans.map(function(o) {
    return {
      name: o.n,
      icon: ORGAN_ICON_MAP[o.n] || 'body-outline',
      stage: o.stage,
      severity: o.sev,
      color: o.col,
      description: o.n + ' is at ' + o.stage + ' stage with severity ' + o.sev + '%.',
    };
  });

  // Map cluster
  var detailCluster = detail.cluster || {};
  var clusterDiseases = (detailCluster.diseases || []).map(function(d) {
    return {
      name: d.n,
      probability: d.p,
      type: d.type,
    };
  });

  // Map timeline
  var timeline = (detail.timeline || []).map(function(t) {
    return {
      time: t.time,
      event: t.event,
      color: t.col,
    };
  });

  // Map care actions
  var careActions = (detail.actions || []).map(function(a) {
    return {
      priority: a.pri === 'high' ? 'High' : 'Medium',
      icon: a.ico,
      title: a.title,
      description: a.desc,
      color: a.pri === 'high' ? '#EF4444' : '#F59E0B',
    };
  });

  // Map progression panels to scores
  var panels = (detail.progression && detail.progression.panels) || [];
  var statusPanel = panels[0] || {};
  var stabilityPanel = panels[1] || {};
  var velocityPanel = panels[2] || {};

  return {
    id: section.id,
    name: section.sectionLabel || section.title,
    category: 'Lifestyle',
    unit: '',
    refRange: firstMetric ? firstMetric.ref : '',
    latestValue: firstMetric ? firstMetric.value : '\u2014',
    latestRIR: 0,
    delta: '\u2014',
    deltaDirection: 'stable',
    readingsCount: metrics.length,
    baseline: numericVal,
    urgency: urgencyLabel,
    urgencyColor: urgencyColor,
    narrative: detail.narrative || section.corrBody || '',
    correlations: correlations,
    history: history,
    trendChart: trendChart,
    trendDates: trendDates,
    refLow: 0,
    refHigh: 100,
    timeline: timeline,
    about: detail.about || section.corrBody || (section.sectionLabel || section.title) + ' lifestyle data.',
    symptoms: detail.symptoms || [],
    causes: detail.causes || [],
    progression: {
      currentPosition: detail.progression ? detail.progression.position : (isWarning ? 0.38 : 0.75),
      rangeLabels: ['Poor', 'Fair', 'Good'],
      rangeBreaks: [0.33, 0.66],
      scores: {
        status: {
          score: statusPanel.bar || (isWarning ? 50 : 80),
          label: statusPanel.lbl || 'Status',
          badge: statusPanel.badge || urgencyLabel,
          badgeColor: statusPanel.badgeCol || urgencyColor,
          detail: statusPanel.detail || section.corrBody || '',
        },
        stability: {
          score: stabilityPanel.bar || 50,
          label: stabilityPanel.lbl || 'Stability',
          badge: stabilityPanel.badge || 'Monitoring',
          badgeColor: stabilityPanel.badgeCol || Colors.amber,
          detail: stabilityPanel.detail || '',
        },
        velocity: {
          score: velocityPanel.bar || 50,
          label: velocityPanel.lbl || 'Velocity',
          badge: velocityPanel.badge || 'Stable',
          badgeColor: velocityPanel.badgeCol || Colors.amber,
          detail: velocityPanel.detail || '',
        },
      },
      hpsHistory: [],
      measurementTable: measurementTable,
    },
    organs: organs,
    organDetails: organDetails,
    cluster: {
      name: detailCluster.name || '',
      description: detailCluster.name ? 'Risk cluster: ' + detailCluster.name + '.' : '',
      riskScore: parseInt((detailCluster.risk || '0').replace('%', ''), 10),
      diseases: clusterDiseases,
      timeline: timeline,
    },
    care: {
      actions: careActions,
      treatment: detail.treatment || [],
      prevention: detail.prevention || '',
    },
  };
};

const mapMedicalToDetail = condition => {
  if (!condition) return null;
  const detail = MEDICAL_DETAIL_DATA[condition.id] || {};
  const risks = condition.risks || [];

  const badgeText = condition.badge || '';
  const isUrgent = detail.urgency === 'high' ||
    badgeText.toLowerCase().includes('suboptimal') ||
    badgeText.toLowerCase().includes('above');
  const urgencyColor = isUrgent ? Colors.amber : Colors.teal;
  const urgencyLabel = isUrgent ? 'Needs Attention' : condition.badge || 'Monitoring';

  // Build correlations from detail data
  var correlations = (detail.correlations || []).map(function(c) {
    return {label: c.lbl, value: c.val, status: 'elevated'};
  });

  // Build timeline from detail
  var timeline = (detail.timeline || []).map(function(t) {
    return {time: t.time, event: t.event, color: t.col};
  });

  // Build organs
  var detailOrgans = detail.organs || [];
  var organs = detailOrgans.map(function(o) {
    return {name: o.n, icon: ORGAN_ICON_MAP[o.n] || 'body-outline', severity: o.sev, color: o.col};
  });
  var organDetails = detailOrgans.map(function(o) {
    return {name: o.n, icon: ORGAN_ICON_MAP[o.n] || 'body-outline', stage: o.stage, severity: o.sev, color: o.col, description: o.n + ' is at ' + o.stage + ' with severity ' + o.sev + '%.'};
  });

  // Build cluster
  var detailCluster = detail.cluster || {};
  var clusterDiseases = (detailCluster.diseases || []).map(function(d) {
    return {name: d.n, probability: d.p, type: d.type};
  });

  // Build care actions
  var careActions = (detail.actions || []).map(function(a) {
    return {priority: a.pri === 'high' ? 'High' : 'Medium', icon: a.ico || 'medkit-outline', title: a.title, description: a.desc, color: a.pri === 'high' ? '#EF4444' : '#F59E0B'};
  });

  // Build progression panels as scores
  var panels = (detail.progression && detail.progression.panels) || [];
  var statusPanel = panels[0] || {};
  var stabilityPanel = panels[1] || {};
  var velocityPanel = panels[2] || {};

  // Build measurement table from risks
  var measurementTable = risks.map(function(r) {
    return {date: '\u2014', value: r.value, delta: '\u2014', status: r.label, hps: 100 - (r.barWidth || 0)};
  });

  return {
    id: condition.id,
    name: condition.title,
    category: 'Medical Condition',
    unit: '',
    refRange: 'Risk-based',
    latestValue: risks[0] ? risks[0].value : condition.badge,
    latestRIR: 0,
    delta: '\u2014',
    deltaDirection: 'stable',
    readingsCount: risks.length || correlations.length,
    baseline: 0,
    urgency: urgencyLabel,
    urgencyColor: urgencyColor,
    narrative: detail.narrative || condition.sub || '',
    correlations: correlations,
    history: [],
    trendChart: risks.map(function(r) { return r.barWidth; }),
    trendDates: risks.map(function(r) { return r.label; }),
    refLow: 0,
    refHigh: 100,
    timeline: timeline,
    about: detail.about || condition.sub || condition.title + ' medical condition.',
    symptoms: detail.symptoms || [],
    causes: detail.causes || [],
    progression: {
      currentPosition: detail.progression ? detail.progression.position : 0.5,
      rangeLabels: ['Low risk', 'Moderate', 'High risk'],
      rangeBreaks: [0.33, 0.66],
      scores: {
        status: {
          score: statusPanel.bar || 50,
          label: statusPanel.lbl || 'Status',
          badge: statusPanel.badge || urgencyLabel,
          badgeColor: statusPanel.badgeCol || urgencyColor,
          detail: statusPanel.detail || condition.sub || '',
        },
        stability: {
          score: stabilityPanel.bar || 50,
          label: stabilityPanel.lbl || 'Stability',
          badge: stabilityPanel.badge || 'Monitoring',
          badgeColor: stabilityPanel.badgeCol || Colors.amber,
          detail: stabilityPanel.detail || '',
        },
        velocity: {
          score: velocityPanel.bar || 50,
          label: velocityPanel.lbl || 'Velocity',
          badge: velocityPanel.badge || 'Stable',
          badgeColor: velocityPanel.badgeCol || Colors.amber,
          detail: velocityPanel.detail || '',
        },
      },
      hpsHistory: [],
      measurementTable: measurementTable,
    },
    organs: organs,
    organDetails: organDetails,
    cluster: {
      name: detailCluster.name || condition.title,
      description: detailCluster.name ? 'Risk cluster: ' + detailCluster.name : condition.sub || '',
      riskScore: parseInt((detailCluster.risk || '0').replace('%', ''), 10),
      diseases: clusterDiseases,
      timeline: timeline,
    },
    care: {
      actions: careActions,
      treatment: detail.treatment || [],
      prevention: detail.prevention || '',
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
  const minV =
    Math.min(...data, refLow != null ? refLow : Infinity) * 0.92;
  const maxV =
    Math.max(...data, refHigh != null ? refHigh : -Infinity) * 1.08;
  const range = maxV - minV || 1;
  const stepX = chartW / (data.length - 1 || 1);

  const yPos = v => height - ((v - minV) / range) * height;

  const refBandTop = refHigh != null ? yPos(refHigh) : 0;
  const refBandBottom = refLow != null ? yPos(refLow) : height;

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
        const dotColor =
          refHigh != null && v > refHigh
            ? v > refHigh * 1.15
              ? Colors.red
              : Colors.amber
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
          <AppText variant="body" style={{fontWeight: '700'}}>
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
        <SimpleChart
          data={data.trendChart}
          dates={data.trendDates}
          refLow={data.refLow}
          refHigh={data.refHigh}
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
            variant="body"
            style={{fontWeight: '700', marginBottom: vs(10)}}>
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
            variant="body"
            style={{fontWeight: '700', marginBottom: vs(6)}}>
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
            variant="body"
            style={{fontWeight: '700', marginBottom: vs(8)}}>
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
            variant="body"
            style={{fontWeight: '700', marginBottom: vs(8)}}>
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
          <AppText variant="body" style={{fontWeight: '700'}}>
            Visit Log
          </AppText>
          {data.history.map((h, i) => (
            <View key={i} style={sty.visitCard}>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <View>
                  <AppText variant="body" style={{fontWeight: '700'}}>
                    {h.value}
                    {typeof h.value === 'number' ? data.unit : ''}
                  </AppText>
                  <AppText
                    variant="small"
                    color={Colors.textTertiary}
                    style={{marginTop: vs(2)}}>
                    {h.date}
                  </AppText>
                </View>
                <View style={{alignItems: 'flex-end', gap: vs(3)}}>
                  <View
                    style={[
                      sty.pill,
                      {backgroundColor: statusBg(h.status)},
                    ]}>
                    <AppText
                      variant="small"
                      color={statusColor(h.status)}
                      style={{fontWeight: '600'}}>
                      {h.status}
                    </AppText>
                  </View>
                  <AppText
                    variant="small"
                    color={
                      (h.delta || '').startsWith('+')
                        ? Colors.red
                        : (h.delta || '').startsWith('-')
                        ? Colors.teal
                        : Colors.textTertiary
                    }
                    style={{fontWeight: '600'}}>
                    {h.delta}
                  </AppText>
                </View>
              </View>
            </View>
          ))}
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

      {/* Historical Trend Sparkline */}
      {prog.hpsHistory && prog.hpsHistory.length > 0 && (
        <View style={sty.card}>
          <AppText
            variant="body"
            style={{fontWeight: '700', marginBottom: vs(4)}}>
            Health Performance Score Trend
          </AppText>
          <SparkLine data={prog.hpsHistory} color={Colors.accent} />
        </View>
      )}

      {/* Measurement History Table */}
      {prog.measurementTable && prog.measurementTable.length > 0 && (
        <View style={sty.card}>
          <AppText
            variant="body"
            style={{fontWeight: '700', marginBottom: vs(8)}}>
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
const OrgansTab = ({data}) => {
  const organs = data.organs || [];
  const details = data.organDetails || [];
  if (organs.length === 0 && details.length === 0) {
    return (
      <View style={sty.card}>
        <AppText
          variant="body"
          color={Colors.textTertiary}
          style={{textAlign: 'center', paddingVertical: vs(20)}}>
          No organ impact data available yet.
        </AppText>
      </View>
    );
  }

  return (
    <View style={{gap: vs(12)}}>
      {/* Organ Grid (2x2) */}
      {organs.length > 0 && (
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(8)}}>
          {organs.map((org, i) => {
            const sevColor =
              org.severity > 60
                ? Colors.red
                : org.severity > 30
                ? Colors.amber
                : Colors.teal;
            const stageColor = statusColor(
              (org.stage || '').includes('2')
                ? 'high'
                : (org.stage || '').includes('1')
                ? 'elevated'
                : 'normal',
            );
            return (
              <View key={i} style={sty.organGridCard}>
                <View
                  style={{
                    flexDirection: 'row',
                    alignItems: 'center',
                    gap: s(6),
                    marginBottom: vs(6),
                  }}>
                  <Icon
                    family="Ionicons"
                    name={org.icon}
                    size={18}
                    color={Colors.primary}
                  />
                  <AppText variant="body" style={{fontWeight: '700'}}>
                    {org.name}
                  </AppText>
                </View>
                <AppText
                  variant="small"
                  color={stageColor}
                  style={{fontWeight: '600', marginBottom: vs(4)}}>
                  {org.stage}
                </AppText>
                <View style={{marginBottom: vs(4)}}>
                  <ProgressBar
                    progress={org.severity / 100}
                    color={sevColor}
                    height={5}
                  />
                </View>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}>
                  <AppText variant="small" color={Colors.textTertiary}>
                    Severity: {org.severity}
                  </AppText>
                  <AppText
                    variant="small"
                    color={statusColor(org.trend)}
                    style={{fontWeight: '600'}}>
                    {org.trend}
                  </AppText>
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* Organ Impact Cards */}
      {details.map((org, i) => (
        <View key={i} style={sty.card}>
          <View
            style={{
              flexDirection: 'row',
              alignItems: 'center',
              gap: s(8),
              marginBottom: vs(6),
            }}>
            <View
              style={{
                width: ms(32),
                height: ms(32),
                borderRadius: ms(16),
                backgroundColor: Colors.tealBg,
                alignItems: 'center',
                justifyContent: 'center',
              }}>
              <Icon
                family="Ionicons"
                name={org.icon}
                size={16}
                color={Colors.primary}
              />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="body" style={{fontWeight: '700'}}>
                {org.name}
              </AppText>
              <AppText variant="small" color={Colors.textTertiary}>
                {org.stage}
              </AppText>
            </View>
          </View>
          <AppText
            variant="caption"
            color={Colors.textSecondary}
            style={{lineHeight: ms(17)}}>
            {org.impact}
          </AppText>
        </View>
      ))}
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
          <View style={{alignItems: 'center'}}>
            <AppText
              style={{
                fontSize: ms(28),
                fontWeight: '900',
                color:
                  cl.riskScore > 60
                    ? Colors.red
                    : cl.riskScore > 40
                    ? Colors.amber
                    : Colors.teal,
              }}>
              {cl.riskScore}
            </AppText>
            <AppText variant="small" color={Colors.textTertiary}>
              Risk Score
            </AppText>
          </View>
        </View>
      </View>

      {/* Disease Progression Bars */}
      {cl.diseases && cl.diseases.length > 0 && (
        <View style={sty.card}>
          <AppText
            variant="body"
            style={{fontWeight: '700', marginBottom: vs(10)}}>
            Disease Progression
          </AppText>
          {cl.diseases.map((d, i) => {
            const pct = d.probability != null ? d.probability : (d.progress != null ? Math.round(d.progress * 100) : 0);
            const barPct = pct / 100;
            const barColor =
              pct > 50
                ? Colors.red
                : pct > 30
                ? Colors.amber
                : Colors.teal;
            const typeLabel = d.type === 'active' ? 'Active' : d.type === 'emerging' ? 'Emerging' : d.type === 'watch' ? 'Watch Zone' : d.type || 'Unknown';
            const typeBg =
              d.type === 'active' || d.type === 'Primary'
                ? Colors.redBg
                : d.type === 'emerging' || d.type === 'Secondary'
                ? Colors.amberBg
                : Colors.blueBg;
            const typeColor =
              d.type === 'active' || d.type === 'Primary'
                ? Colors.redText
                : d.type === 'emerging' || d.type === 'Secondary'
                ? Colors.amberText
                : Colors.blueText;
            return (
              <View key={i} style={{marginBottom: vs(10)}}>
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: vs(4),
                  }}>
                  <AppText variant="caption" style={{fontWeight: '600'}}>
                    {d.name}
                  </AppText>
                  <View style={[sty.pill, {backgroundColor: typeBg}]}>
                    <AppText
                      variant="small"
                      color={typeColor}
                      style={{fontWeight: '700', fontSize: ms(8)}}>
                      {typeLabel}
                    </AppText>
                  </View>
                </View>
                <ProgressBar
                  progress={barPct}
                  color={barColor}
                  height={5}
                />
                <AppText
                  variant="small"
                  color={Colors.textTertiary}
                  style={{marginTop: vs(2), textAlign: 'right'}}>
                  {pct}%
                </AppText>
              </View>
            );
          })}
        </View>
      )}

      {/* Cluster Timeline */}
      {cl.timeline && cl.timeline.length > 0 && (
        <View style={sty.card}>
          <AppText
            variant="body"
            style={{fontWeight: '700', marginBottom: vs(10)}}>
            Progression Timeline
          </AppText>
          {cl.timeline.map((t, i) => {
            const tlLabel = t.time || t.stage || '';
            const tlDetail = t.event || t.detail || '';
            const tlColor = t.color || t.col || Colors.textTertiary;
            return (
              <View
                key={i}
                style={{
                  flexDirection: 'row',
                  marginBottom: i < cl.timeline.length - 1 ? vs(2) : 0,
                }}>
                <View style={{alignItems: 'center', width: s(16)}}>
                  <View
                    style={{
                      width: ms(10),
                      height: ms(10),
                      borderRadius: ms(5),
                      backgroundColor: tlColor,
                      zIndex: 1,
                    }}
                  />
                  {i < cl.timeline.length - 1 && (
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
                <View
                  style={{
                    flex: 1,
                    marginLeft: s(8),
                    paddingBottom: vs(12),
                  }}>
                  <AppText
                    variant="caption"
                    style={{fontWeight: '700'}}
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
          <AppText variant="body" style={{fontWeight: '700'}}>
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
            variant="body"
            style={{fontWeight: '700', marginBottom: vs(8)}}>
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

const BiomarkerDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const {biomarkerId, lifestyleId, medicalId} = route.params || {};

  const [activeTab, setActiveTab] = useState('ayuIntel');

  // Determine data type and load placeholder
  const dataType = useMemo(() => {
    if (lifestyleId) return 'lifestyle';
    if (medicalId) return 'medical';
    return 'biomarker';
  }, [lifestyleId, medicalId]);

  const data = useMemo(() => {
    if (dataType === 'lifestyle') {
      const section = LIFESTYLE_SECTIONS.find(s => s.id === lifestyleId);
      return mapLifestyleToDetail(section) || mapLifestyleToDetail(LIFESTYLE_SECTIONS[0]);
    }
    if (dataType === 'medical') {
      // Check conditions first, then organs
      var condition = MEDICAL_CONDITIONS.find(c => c.id === medicalId);
      if (condition) return mapMedicalToDetail(condition);
      // Organ clicked - find organ and build a pseudo-condition from detail data
      var organ = ORGANS.find(o => o.id === medicalId);
      if (organ && MEDICAL_DETAIL_DATA[medicalId]) {
        var pseudoCondition = {
          id: organ.id,
          ico: 'body-outline',
          icoBg: organ.icoBg,
          title: organ.name,
          sub: organ.detail,
          badge: organ.pillLabel,
          badgeStyle: organ.pillStyle,
          risks: [],
        };
        return mapMedicalToDetail(pseudoCondition);
      }
      return mapMedicalToDetail(MEDICAL_CONDITIONS[0]);
    }
    const bm = BIOMARKERS.find(b => b.id === biomarkerId);
    return mapBiomarkerToDetail(bm) || mapBiomarkerToDetail(BIOMARKERS[0]);
  }, [dataType, biomarkerId, lifestyleId, medicalId]);

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
  const metricCards = useMemo(() => {
    // For medical/lifestyle, try to get hdr from source detail data
    if (dataType === 'medical' && medicalId) {
      var dd = MEDICAL_DETAIL_DATA[medicalId];
      if (dd && dd.hdr) {
        return dd.hdr.map(function(h) { return {label: h.lbl, value: h.val, sub: h.unit, color: h.col}; });
      }
    }
    if (dataType === 'lifestyle' && lifestyleId) {
      var ld = LIFESTYLE_DETAIL_DATA[lifestyleId];
      if (ld && ld.hdr) {
        return ld.hdr.map(function(h) { return {label: h.lbl, value: h.val, sub: h.unit, color: h.col}; });
      }
    }
    return [
      {label: 'Latest RIR', value: String(data.latestRIR), color: Colors.accent},
      {label: 'Value', value: String(data.latestValue) + (data.unit && typeof data.latestValue === 'number' ? data.unit : ''), color: Colors.blue},
      {label: '\u0394 Baseline', value: data.delta, color: data.deltaDirection === 'up' ? Colors.red : Colors.teal},
      {label: 'Readings', value: String(data.readingsCount), color: Colors.purple},
    ];
  }, [data, dataType, medicalId, lifestyleId]);

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
            {data.category !== 'Medical Condition' && data.category !== 'Lifestyle' ? (
              <AppText
                variant="caption"
                color="rgba(255,255,255,0.45)"
                style={{marginTop: vs(2)}}>
                Ref: {data.refRange} {data.unit}
              </AppText>
            ) : (
              <AppText
                variant="caption"
                color="rgba(255,255,255,0.45)"
                style={{marginTop: vs(2)}}>
                {data.category} · March 2026 · Priya Reddy
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
    padding: s(12),
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

export default BiomarkerDetailScreen;
