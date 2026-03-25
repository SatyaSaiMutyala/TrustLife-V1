import React from 'react';
import {View, ScrollView, Text, StyleSheet} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

/* ─── Biomarker data store ─── */

const BIOMARKER_DATA = {
  hba1c: {
    name: 'HbA1c',
    value: '7.8%',
    unit: '%',
    scaleExplain:
      'HbA1c reflects your average blood glucose over the past 2--3 months. Normal < 5.7%, pre-diabetes 5.7--6.4%, diabetes >= 6.5%. Your current 7.8% indicates suboptimal glycaemic control.',
    sparkBars: [
      {date: 'Sep 22', value: 7.2, color: Colors.redText},
      {date: 'Mar 23', value: 7.0, color: Colors.amberText},
      {date: 'Sep 23', value: 7.1, color: Colors.amberText},
      {date: 'Mar 24', value: 7.3, color: Colors.redText},
      {date: 'Sep 24', value: 6.9, color: Colors.amberText},
      {date: 'Mar 25', value: 7.2, color: Colors.redText},
      {date: 'Sep 25', value: 7.5, color: Colors.redText},
      {date: 'Mar 26', value: 7.8, color: Colors.redText},
    ],
    ssv: [
      {label: 'Status', value: 'Elevated', bg: Colors.redBg, color: Colors.redText},
      {label: 'Stability', value: 'Variable', bg: Colors.amberBg, color: Colors.amberText},
      {label: 'Velocity', value: '\u2191 Rising', bg: Colors.redBg, color: Colors.redText},
    ],
    ssvInsight: 'HbA1c has risen 0.9% over 18 months. PM adherence and sleep quality are the primary drivers.',
    history: [
      {date: '3 Mar 2026', result: '7.8%', color: Colors.redText, lab: 'Apollo Diagnostics', target: 'Above', highlight: 'current'},
      {date: '18 Sep 2025', result: '7.5%', color: Colors.redText, lab: 'Apollo Diagnostics', target: 'Above'},
      {date: '10 Mar 2025', result: '7.2%', color: Colors.redText, lab: 'Apollo Diagnostics', target: 'Above'},
      {date: '22 Sep 2024', result: '6.9%', color: Colors.amberText, lab: 'Vijaya Diagnostics', target: 'Near', highlight: 'best'},
      {date: '15 Mar 2024', result: '7.3%', color: Colors.redText, lab: 'Apollo Diagnostics', target: 'Above'},
      {date: '8 Sep 2023', result: '7.1%', color: Colors.redText, lab: 'Apollo Diagnostics', target: 'Above'},
      {date: '2 Mar 2023', result: '7.0%', color: Colors.amberText, lab: 'Vijaya Diagnostics', target: 'Near'},
      {date: '14 Sep 2022', result: '7.2%', color: Colors.redText, lab: 'Apollo Diagnostics', target: 'Above'},
    ],
    condition: {label: 'T2DM', pills: [{text: 'Type 2 Diabetes', bg: Colors.redBg, color: Colors.redText}]},
    organs: [
      {text: 'Kidney -- nephropathy risk', bg: Colors.blueBg, color: Colors.blueText},
      {text: 'Eyes -- retinopathy risk', bg: Colors.blueBg, color: Colors.blueText},
      {text: 'Nerves -- neuropathy risk', bg: Colors.blueBg, color: Colors.blueText},
      {text: 'Heart -- CVD risk', bg: Colors.blueBg, color: Colors.blueText},
    ],
    syndromes: [
      {text: 'Metabolic syndrome', bg: Colors.purpleBg, color: Colors.purpleText},
      {text: 'Insulin resistance', bg: Colors.purpleBg, color: Colors.purpleText},
    ],
    interactions: [
      {marker: 'eGFR', relation: 'Bidirectional', detail: 'Declining eGFR worsens glycaemic control; high HbA1c accelerates kidney damage', icon: 'swap-horizontal-outline'},
      {marker: 'Haemoglobin', relation: 'False-low HbA1c', detail: 'Anaemia shortens RBC lifespan, potentially giving falsely low HbA1c readings', icon: 'warning-outline'},
      {marker: 'TSH', relation: 'Ruled out', detail: 'TSH 2.4 is normal -- thyroid dysfunction is not contributing to glucose swings', icon: 'checkmark-circle-outline'},
    ],
    nextTest: 'Next HbA1c: Apr 4, 2026. Target < 7.5%. Focus on PM Metformin adherence and improving sleep above 7 h to bring this down.',
  },

  ldl: {
    name: 'LDL Cholesterol',
    value: '118 mg/dL',
    unit: 'mg/dL',
    scaleExplain:
      'LDL carries cholesterol to arteries. For diabetic patients, target is < 100--130 mg/dL. Your 118 mg/dL is within the acceptable range with Atorvastatin.',
    sparkBars: [
      {date: 'Sep 22', value: 142, color: Colors.redText},
      {date: 'Mar 23', value: 134, color: Colors.amberText},
      {date: 'Sep 23', value: 126, color: Colors.amberText},
      {date: 'Mar 24', value: 120, color: Colors.tealText},
      {date: 'Sep 24', value: 115, color: Colors.tealText},
      {date: 'Mar 25', value: 119, color: Colors.tealText},
      {date: 'Sep 25', value: 116, color: Colors.tealText},
      {date: 'Mar 26', value: 118, color: Colors.tealText},
    ],
    ssv: [
      {label: 'Status', value: 'Normal', bg: Colors.tealBg, color: Colors.tealText},
      {label: 'Stability', value: 'Stable', bg: Colors.tealBg, color: Colors.tealText},
      {label: 'Velocity', value: '\u2192 Flat', bg: Colors.tealBg, color: Colors.tealText},
    ],
    ssvInsight: 'LDL has been consistently below 120 since Sep 2024. Atorvastatin adherence at 97%.',
    history: [
      {date: '3 Mar 2026', result: '118', color: Colors.tealText, lab: 'Apollo Diagnostics', target: 'On target', highlight: 'current'},
      {date: '18 Sep 2025', result: '116', color: Colors.tealText, lab: 'Apollo Diagnostics', target: 'On target'},
      {date: '10 Mar 2025', result: '119', color: Colors.tealText, lab: 'Apollo Diagnostics', target: 'On target'},
      {date: '22 Sep 2024', result: '115', color: Colors.tealText, lab: 'Vijaya Diagnostics', target: 'On target', highlight: 'best'},
    ],
    condition: {label: 'Dyslipidaemia', pills: [{text: 'Managed', bg: Colors.tealBg, color: Colors.tealText}]},
    organs: [
      {text: 'Heart -- atherosclerosis risk', bg: Colors.blueBg, color: Colors.blueText},
      {text: 'Brain -- stroke risk', bg: Colors.blueBg, color: Colors.blueText},
    ],
    syndromes: [
      {text: 'Metabolic syndrome', bg: Colors.purpleBg, color: Colors.purpleText},
    ],
    nextTest: 'Next lipid panel: Sep 2026. Continue Atorvastatin. Target LDL < 120.',
  },

  fpg: {
    name: 'Fasting Plasma Glucose',
    value: '8.4 mmol/L',
    unit: 'mmol/L',
    scaleExplain:
      'FPG measures glucose after an overnight fast. Normal < 5.6 mmol/L, pre-diabetes 5.6--6.9, diabetes >= 7.0. Your 8.4 is elevated.',
    sparkBars: [
      {date: 'Sep 24', value: 7.1, color: Colors.amberText},
      {date: 'Mar 25', value: 7.6, color: Colors.redText},
      {date: 'Sep 25', value: 8.0, color: Colors.redText},
      {date: 'Mar 26', value: 8.4, color: Colors.redText},
    ],
    ssv: [
      {label: 'Status', value: 'High', bg: Colors.redBg, color: Colors.redText},
      {label: 'Stability', value: 'Worsening', bg: Colors.redBg, color: Colors.redText},
      {label: 'Velocity', value: '\u2191 Rising', bg: Colors.redBg, color: Colors.redText},
    ],
    ssvInsight: 'FPG has climbed steadily over 18 months, correlating with reduced PM Metformin adherence.',
    history: [
      {date: '3 Mar 2026', result: '8.4', color: Colors.redText, lab: 'Apollo Diagnostics', target: 'Above', highlight: 'current'},
      {date: '18 Sep 2025', result: '8.0', color: Colors.redText, lab: 'Apollo Diagnostics', target: 'Above'},
      {date: '10 Mar 2025', result: '7.6', color: Colors.redText, lab: 'Apollo Diagnostics', target: 'Above'},
      {date: '22 Sep 2024', result: '7.1', color: Colors.amberText, lab: 'Vijaya Diagnostics', target: 'Near', highlight: 'best'},
    ],
    condition: {label: 'T2DM', pills: [{text: 'Type 2 Diabetes', bg: Colors.redBg, color: Colors.redText}]},
    organs: [
      {text: 'Pancreas -- beta-cell stress', bg: Colors.blueBg, color: Colors.blueText},
      {text: 'Liver -- gluconeogenesis', bg: Colors.blueBg, color: Colors.blueText},
    ],
    syndromes: [
      {text: 'Insulin resistance', bg: Colors.purpleBg, color: Colors.purpleText},
    ],
    nextTest: 'Next FPG: Apr 4, 2026 with HbA1c recheck. Target < 7.0 mmol/L.',
  },

  egfr: {
    name: 'eGFR',
    value: '72 mL/min',
    unit: 'mL/min/1.73m\u00B2',
    scaleExplain:
      'eGFR estimates how well your kidneys filter waste. > 90 normal, 60--89 mildly reduced (G2), 30--59 moderate (G3). Your 72 is stage G2 -- stable and within safe range.',
    sparkBars: [
      {date: 'Sep 23', value: 78, color: Colors.tealText},
      {date: 'Mar 24', value: 76, color: Colors.tealText},
      {date: 'Sep 24', value: 74, color: Colors.tealText},
      {date: 'Mar 25', value: 73, color: Colors.tealText},
      {date: 'Sep 25', value: 72, color: Colors.tealText},
      {date: 'Mar 26', value: 72, color: Colors.tealText},
    ],
    ssv: [
      {label: 'Status', value: 'G2', bg: Colors.tealBg, color: Colors.tealText},
      {label: 'Stability', value: 'Stable', bg: Colors.tealBg, color: Colors.tealText},
      {label: 'Velocity', value: '\u2192 Flat', bg: Colors.tealBg, color: Colors.tealText},
    ],
    ssvInsight: 'eGFR has been stable at 72--78 over 3 years. No signs of progressive nephropathy.',
    history: [
      {date: '3 Mar 2026', result: '72', color: Colors.tealText, lab: 'Apollo Diagnostics', target: 'Stable', highlight: 'current'},
      {date: '18 Sep 2025', result: '72', color: Colors.tealText, lab: 'Apollo Diagnostics', target: 'Stable'},
      {date: '10 Mar 2025', result: '73', color: Colors.tealText, lab: 'Apollo Diagnostics', target: 'Stable'},
      {date: '22 Sep 2024', result: '74', color: Colors.tealText, lab: 'Vijaya Diagnostics', target: 'Stable'},
    ],
    condition: {label: 'CKD-G2', pills: [{text: 'Stage G2', bg: Colors.tealBg, color: Colors.tealText}]},
    organs: [
      {text: 'Kidney -- filtration capacity', bg: Colors.blueBg, color: Colors.blueText},
    ],
    syndromes: [
      {text: 'Diabetic nephropathy risk', bg: Colors.purpleBg, color: Colors.purpleText},
    ],
    nextTest: 'Next eGFR: Sep 2026. Monitor alongside ACR. Target: maintain > 60.',
  },

  tsh: {
    name: 'TSH',
    value: '2.4 mIU/L',
    unit: 'mIU/L',
    scaleExplain:
      'TSH controls thyroid hormone production. Normal range 0.4--4.0 mIU/L. Your 2.4 is well within normal -- thyroid function is not contributing to metabolic issues.',
    sparkBars: [
      {date: 'Mar 24', value: 2.6, color: Colors.tealText},
      {date: 'Sep 24', value: 2.3, color: Colors.tealText},
      {date: 'Mar 25', value: 2.5, color: Colors.tealText},
      {date: 'Mar 26', value: 2.4, color: Colors.tealText},
    ],
    ssv: [
      {label: 'Status', value: 'Normal', bg: Colors.tealBg, color: Colors.tealText},
      {label: 'Stability', value: 'Stable', bg: Colors.tealBg, color: Colors.tealText},
      {label: 'Velocity', value: '\u2192 Flat', bg: Colors.tealBg, color: Colors.tealText},
    ],
    ssvInsight: 'TSH consistently in normal range. Thyroid ruled out as a factor in glucose variability.',
    history: [
      {date: '3 Mar 2026', result: '2.4', color: Colors.tealText, lab: 'Apollo Diagnostics', target: 'Normal', highlight: 'current'},
      {date: '10 Mar 2025', result: '2.5', color: Colors.tealText, lab: 'Apollo Diagnostics', target: 'Normal'},
      {date: '22 Sep 2024', result: '2.3', color: Colors.tealText, lab: 'Vijaya Diagnostics', target: 'Normal', highlight: 'best'},
      {date: '15 Mar 2024', result: '2.6', color: Colors.tealText, lab: 'Apollo Diagnostics', target: 'Normal'},
    ],
    condition: {label: 'Euthyroid', pills: [{text: 'Normal thyroid', bg: Colors.tealBg, color: Colors.tealText}]},
    organs: [
      {text: 'Thyroid -- metabolism regulation', bg: Colors.blueBg, color: Colors.blueText},
    ],
    syndromes: [],
    nextTest: 'Next TSH: Mar 2027 annual screen. No action needed.',
  },

  b12: {
    name: 'Vitamin B12',
    value: 'Ordered',
    unit: 'pg/mL',
    scaleExplain:
      'Vitamin B12 is essential for nerve function and red blood cell production. Normal > 300 pg/mL. Long-term Metformin use depletes B12 stores. Test ordered to confirm suspected deficiency.',
    sparkBars: [
      {date: 'Sep 24', value: 280, color: Colors.amberText},
      {date: 'Mar 25', value: 260, color: Colors.amberText},
      {date: 'Mar 26', value: 0, color: Colors.textTertiary},
    ],
    ssv: [
      {label: 'Status', value: 'Pending', bg: Colors.amberBg, color: Colors.amberText},
      {label: 'Stability', value: 'Declining', bg: Colors.amberBg, color: Colors.amberText},
      {label: 'Velocity', value: '\u2193 Falling', bg: Colors.amberBg, color: Colors.amberText},
    ],
    ssvInsight: 'B12 likely depleted from 6.5 years of Metformin. Methylcobalamin supplementation started.',
    history: [
      {date: '3 Mar 2026', result: 'Ordered', color: Colors.amberText, lab: 'Apollo Diagnostics', target: 'Pending', highlight: 'current'},
      {date: '10 Mar 2025', result: '260', color: Colors.amberText, lab: 'Apollo Diagnostics', target: 'Low'},
      {date: '22 Sep 2024', result: '280', color: Colors.amberText, lab: 'Vijaya Diagnostics', target: 'Borderline'},
    ],
    condition: {label: 'B12 depletion', pills: [{text: 'Metformin-induced', bg: Colors.amberBg, color: Colors.amberText}]},
    organs: [
      {text: 'Nerves -- peripheral neuropathy', bg: Colors.blueBg, color: Colors.blueText},
      {text: 'Blood -- megaloblastic anaemia', bg: Colors.blueBg, color: Colors.blueText},
    ],
    syndromes: [
      {text: 'Drug-induced deficiency', bg: Colors.purpleBg, color: Colors.purpleText},
    ],
    nextTest: 'B12 result expected by 10 Mar 2026. If < 200, increase Methylcobalamin dose.',
  },
};

/* ─── HbA1c-specific data ─── */

const HBA1C_INTERACTIONS = BIOMARKER_DATA.hba1c.interactions;

/* ─── Component ─── */

const LabBiomarkerDetailView = ({biomarker = 'hba1c'}) => {
  const data = BIOMARKER_DATA[biomarker] || BIOMARKER_DATA.hba1c;
  const isHba1c = biomarker === 'hba1c';

  /* Scale explanation */
  const renderScaleExplain = () => (
    <View style={styles.scaleBox}>
      <Icon
        family="Ionicons"
        name="information-circle-outline"
        size={ms(16)}
        color={Colors.amberText}
      />
      <AppText
        variant="caption"
        color={Colors.amberText}
        style={{flex: 1, marginLeft: s(8)}}>
        {data.scaleExplain}
      </AppText>
    </View>
  );

  /* Sparkline bar chart */
  const renderChart = () => {
    const maxVal = Math.max(...data.sparkBars.filter(b => b.value > 0).map(b => b.value));
    return (
      <View style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
          {data.name} trend
        </AppText>
        <View style={styles.barContainer}>
          {data.sparkBars.map((bar, i) => {
            const height = bar.value > 0 ? (bar.value / maxVal) * vs(80) : vs(4);
            return (
              <View key={i} style={styles.barCol}>
                <Text
                  style={[
                    styles.barValue,
                    {color: bar.color, includeFontPadding: false},
                  ]}>
                  {bar.value > 0 ? bar.value : '--'}
                </Text>
                <View
                  style={[
                    styles.bar,
                    {
                      height,
                      backgroundColor: bar.color,
                      opacity: bar.value > 0 ? 1 : 0.3,
                    },
                  ]}
                />
                <Text
                  style={[
                    styles.barDate,
                    {includeFontPadding: false},
                  ]}>
                  {bar.date}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: Colors.tealText}]} />
            <AppText variant="small" color={Colors.textSecondary}>Normal</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: Colors.amberText}]} />
            <AppText variant="small" color={Colors.textSecondary}>Borderline</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: Colors.redText}]} />
            <AppText variant="small" color={Colors.textSecondary}>Elevated</AppText>
          </View>
        </View>
      </View>
    );
  };

  /* Status / Stability / Velocity */
  const renderSSV = () => (
    <View style={styles.card}>
      <View style={styles.ssvGrid}>
        {data.ssv.map((item, i) => (
          <View key={i} style={[styles.ssvCell, {backgroundColor: item.bg}]}>
            <AppText variant="small" color={Colors.textSecondary}>
              {item.label}
            </AppText>
            <AppText
              variant="bodyBold"
              color={item.color}
              style={{marginTop: vs(2), fontSize: ms(12)}}>
              {item.value}
            </AppText>
          </View>
        ))}
      </View>
      <View style={[styles.insightFooter, {backgroundColor: Colors.amberBg}]}>
        <AppText variant="caption" color={Colors.amberText}>
          {data.ssvInsight}
        </AppText>
      </View>
    </View>
  );

  /* Test history table */
  const renderHistory = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
        Test history
      </AppText>
      <View style={[styles.historyHeaderRow, styles.historyRow]}>
        <AppText variant="small" color={Colors.textSecondary} style={{flex: 1}}>
          Date
        </AppText>
        <AppText variant="small" color={Colors.textSecondary} style={{width: s(50), textAlign: 'center'}}>
          Result
        </AppText>
        <AppText variant="small" color={Colors.textSecondary} style={{flex: 1, textAlign: 'center'}}>
          Lab
        </AppText>
        <AppText variant="small" color={Colors.textSecondary} style={{width: s(60), textAlign: 'right'}}>
          vs Target
        </AppText>
      </View>
      {data.history.map((row, i) => (
        <View
          key={i}
          style={[
            styles.historyRow,
            i < data.history.length - 1 && styles.rowBorder,
            row.highlight === 'current' && {backgroundColor: Colors.redBg + '40'},
            row.highlight === 'best' && {backgroundColor: Colors.tealBg + '60'},
          ]}>
          <AppText variant="caption" style={{flex: 1}} numberOfLines={1}>
            {row.date}
          </AppText>
          <AppText
            variant="bodyBold"
            color={row.color}
            style={{width: s(50), textAlign: 'center', fontSize: ms(11)}}>
            {row.result}
          </AppText>
          <AppText
            variant="small"
            color={Colors.textSecondary}
            style={{flex: 1, textAlign: 'center'}}
            numberOfLines={1}>
            {row.lab}
          </AppText>
          <View style={{width: s(60), alignItems: 'flex-end'}}>
            <View
              style={[
                styles.targetPill,
                {
                  backgroundColor:
                    row.target === 'On target' || row.target === 'Normal' || row.target === 'Stable'
                      ? Colors.tealBg
                      : row.target === 'Near' || row.target === 'Borderline'
                      ? Colors.amberBg
                      : row.target === 'Pending'
                      ? Colors.amberBg
                      : Colors.redBg,
                },
              ]}>
              <AppText
                variant="small"
                color={
                  row.target === 'On target' || row.target === 'Normal' || row.target === 'Stable'
                    ? Colors.tealText
                    : row.target === 'Near' || row.target === 'Borderline'
                    ? Colors.amberText
                    : row.target === 'Pending'
                    ? Colors.amberText
                    : Colors.redText
                }>
                {row.target}
              </AppText>
            </View>
          </View>
        </View>
      ))}
    </View>
  );

  /* Clinical context */
  const renderClinicalContext = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        Clinical context
      </AppText>

      {/* Condition */}
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(4)}}>
        Condition
      </AppText>
      <View style={styles.pillRow}>
        {data.condition.pills.map((p, i) => (
          <View key={i} style={[styles.contextPill, {backgroundColor: p.bg}]}>
            <AppText variant="small" color={p.color}>{p.text}</AppText>
          </View>
        ))}
      </View>

      {/* Organ implications */}
      {data.organs.length > 0 && (
        <>
          <AppText
            variant="caption"
            color={Colors.textSecondary}
            style={{marginTop: vs(10), marginBottom: vs(4)}}>
            Organ implications
          </AppText>
          <View style={styles.pillRow}>
            {data.organs.map((o, i) => (
              <View key={i} style={[styles.contextPill, {backgroundColor: o.bg}]}>
                <AppText variant="small" color={o.color}>{o.text}</AppText>
              </View>
            ))}
          </View>
        </>
      )}

      {/* Syndrome cluster */}
      {data.syndromes.length > 0 && (
        <>
          <AppText
            variant="caption"
            color={Colors.textSecondary}
            style={{marginTop: vs(10), marginBottom: vs(4)}}>
            Syndrome cluster
          </AppText>
          <View style={styles.pillRow}>
            {data.syndromes.map((syn, i) => (
              <View key={i} style={[styles.contextPill, {backgroundColor: syn.bg}]}>
                <AppText variant="small" color={syn.color}>{syn.text}</AppText>
              </View>
            ))}
          </View>
        </>
      )}
    </View>
  );

  /* Biomarker interactions (HbA1c only) */
  const renderInteractions = () => {
    if (!isHba1c) return null;
    return (
      <View style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
          Biomarker interactions
        </AppText>
        {HBA1C_INTERACTIONS.map((item, i) => (
          <View
            key={i}
            style={[
              styles.interactionRow,
              i < HBA1C_INTERACTIONS.length - 1 && styles.rowBorder,
            ]}>
            <Icon
              family="Ionicons"
              name={item.icon}
              size={ms(18)}
              color={Colors.primary}
            />
            <View style={{flex: 1, marginLeft: s(10)}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
                <AppText variant="bodyBold">{item.marker}</AppText>
                <View style={[styles.relationPill, {backgroundColor: Colors.blueBg}]}>
                  <AppText variant="small" color={Colors.blueText}>
                    {item.relation}
                  </AppText>
                </View>
              </View>
              <AppText
                variant="caption"
                color={Colors.textSecondary}
                style={{marginTop: vs(2)}}>
                {item.detail}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    );
  };

  /* Next test insight */
  const renderNextTest = () => (
    <View style={styles.nextTestBox}>
      <Icon
        family="Ionicons"
        name="calendar-outline"
        size={ms(16)}
        color={Colors.amberText}
      />
      <AppText
        variant="caption"
        color={Colors.amberText}
        style={{flex: 1, marginLeft: s(8)}}>
        {data.nextTest}
      </AppText>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {renderScaleExplain()}
      {renderChart()}
      {renderSSV()}
      {renderHistory()}
      {renderClinicalContext()}
      {renderInteractions()}
      {renderNextTest()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: s(4),
    gap: vs(10),
  },
  scaleBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.amberBg,
    borderRadius: ms(12),
    padding: ms(12),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary || Colors.borderLight || '#e5e7eb',
    padding: ms(13),
  },
  barContainer: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: vs(110),
    paddingTop: vs(10),
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  bar: {
    width: ms(16),
    borderRadius: ms(4),
    minHeight: vs(4),
  },
  barValue: {
    fontSize: ms(8),
    fontWeight: '600',
    marginBottom: vs(3),
  },
  barDate: {
    fontSize: ms(7),
    color: Colors.textTertiary,
    marginTop: vs(4),
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(14),
    marginTop: vs(10),
    paddingTop: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderTertiary || Colors.borderLight || '#e5e7eb',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  legendDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
  },
  ssvGrid: {
    flexDirection: 'row',
    gap: s(6),
  },
  ssvCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(10),
    borderRadius: ms(10),
  },
  insightFooter: {
    marginTop: vs(8),
    borderRadius: ms(8),
    padding: ms(10),
  },
  historyHeaderRow: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderTertiary || Colors.borderLight || '#e5e7eb',
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(7),
    paddingHorizontal: ms(4),
    borderRadius: ms(6),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderTertiary || Colors.borderLight || '#e5e7eb',
  },
  targetPill: {
    paddingHorizontal: ms(6),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(6),
  },
  contextPill: {
    paddingHorizontal: ms(10),
    paddingVertical: vs(4),
    borderRadius: ms(10),
  },
  interactionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(10),
  },
  relationPill: {
    paddingHorizontal: ms(6),
    paddingVertical: vs(1),
    borderRadius: ms(6),
  },
  nextTestBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.amberBg,
    borderRadius: ms(12),
    padding: ms(12),
  },
});

export default LabBiomarkerDetailView;
