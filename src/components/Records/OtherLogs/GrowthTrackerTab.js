import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';
import Svg, {Polyline, Circle as SvgCircle, Line as SvgLine, Text as SvgText, Rect, Path} from 'react-native-svg';

// ---------------------------------------------------------------------------
// Data
// ---------------------------------------------------------------------------

const CHART_TYPES = [
  {key: 'height', label: 'Height-for-age'},
  {key: 'weight', label: 'Weight-for-age'},
  {key: 'bmi', label: 'BMI-for-age'},
];

const CHART_TITLES = {
  height: 'Height-for-age \u00B7 Boys \u00B7 2\u201318 years \u00B7 IAP 2015',
  weight: 'Weight-for-age \u00B7 Boys \u00B7 2\u201318 years \u00B7 IAP 2015',
  bmi: 'BMI-for-age \u00B7 Boys \u00B7 2\u201318 years \u00B7 IAP 2015',
};

// IAP 2015 Boys percentile data (approximate) — ages 0-11 years
const GROWTH_DATA = {
  height: {
    ages: [0,1,2,3,4,5,6,7,8,9,10,11],
    p3:  [48.5,71.5,81.5,89.5,97.0,104.0,110.5,116.5,122.0,127.5,133.0,138.5],
    p15: [50.0,74.0,85.0,93.0,101.0,108.0,115.0,121.5,127.5,133.5,139.5,145.5],
    p50: [50.5,76.5,88.0,96.0,104.0,111.5,118.5,125.0,131.5,138.0,144.5,151.0],
    p85: [51.5,79.5,91.5,99.5,107.5,115.0,122.5,129.5,136.5,143.5,150.5,157.5],
    p97: [53.0,82.5,95.0,103.5,111.5,119.5,127.0,134.5,142.0,149.5,157.0,164.0],
    child: [49.0,74.8,84.0,91.5,97.2,103.6,109.4,115.8,122.0,128.5,null,null],
    minV: 44, maxV: 170, unit: 'cm',
  },
  weight: {
    ages: [0,1,2,3,4,5,6,7,8,9,10,11],
    p3:  [2.5,8.0,10.5,12.5,14.5,16.0,18.0,20.0,22.0,24.5,27.0,30.0],
    p15: [2.8,8.8,11.5,13.8,16.0,18.0,20.5,23.0,25.5,28.5,31.5,35.0],
    p50: [3.3,10.2,12.5,15.0,17.5,19.5,22.0,25.0,27.5,30.5,34.0,38.0],
    p85: [3.8,11.8,14.5,17.0,20.0,22.5,25.5,29.0,32.5,36.5,41.0,46.0],
    p97: [4.4,13.5,17.0,20.0,23.5,27.0,31.0,35.5,40.5,46.0,52.0,59.0],
    child: [3.1,9.5,11.8,13.6,15.8,18.0,20.1,22.8,25.2,27.4,null,null],
    minV: 1, maxV: 65, unit: 'kg',
  },
  bmi: {
    ages: [0,1,2,3,4,5,6,7,8,9,10,11],
    p3:  [11.5,14.5,14.5,14.0,13.8,13.8,14.0,14.5,15.0,15.5,16.0,16.5],
    p15: [12.5,15.5,15.5,15.0,14.8,14.8,15.0,15.5,16.0,16.5,17.0,17.5],
    p50: [13.5,17.0,16.5,15.5,15.5,15.5,15.8,16.2,16.5,17.0,17.5,18.0],
    p85: [14.5,19.0,18.5,17.0,17.0,17.0,17.5,18.0,18.5,19.0,20.0,21.0],
    p97: [15.5,21.5,21.0,19.5,19.0,19.0,19.5,20.5,21.5,22.5,24.0,25.5],
    child: [12.9,17.0,16.7,16.2,16.7,16.8,16.8,17.0,16.9,16.6,null,null],
    minV: 10, maxV: 28, unit: 'kg/m²',
  },
};

const PERCENTILE_LEGEND = [
  {label: '3rd %ile', color: Colors.red, dash: false},
  {label: '15th %ile', color: Colors.amber, dash: true},
  {label: '50th %ile', color: Colors.teal, dash: false},
  {label: '85th %ile', color: Colors.teal, dash: true},
  {label: '97th %ile', color: Colors.primary, dash: false},
  {label: 'Aarav', color: Colors.blueText, dash: false, dot: true},
];

const ZSCORE_DATA = [
  {
    label: 'Height-for-age',
    z: '+0.04',
    percentile: '50th %ile',
    dotPosition: 50.8,
    color: Colors.teal,
    interpretation:
      'Exactly at Indian median height for 9-year-old boys. Normal growth.',
  },
  {
    label: 'Weight-for-age',
    z: '-0.08',
    percentile: '48th %ile',
    dotPosition: 49,
    color: Colors.teal,
    interpretation:
      'Slightly below median -- normal. Not underweight (-2 SD threshold is at 24.2 kg for this age).',
  },
  {
    label: 'BMI-for-age',
    z: '-0.1',
    percentile: '46th %ile',
    dotPosition: 48,
    color: Colors.teal,
    interpretation:
      'Healthy BMI-for-age. Well within normal range (-2 to +1 SD). Not underweight, not overweight.',
  },
];

const MEASUREMENT_HISTORY = [
  {age: '9y 2m', date: 'Feb 26', height: '128.5', weight: '27.4', htPile: '52nd', wtPile: '48th', highlight: true, pillBg: Colors.tealBg, pillColor: Colors.tealText},
  {age: '8y 2m', date: 'Mar 25', height: '122.0', weight: '25.2', htPile: '50th', wtPile: '46th', highlight: false, pillBg: Colors.tealBg, pillColor: Colors.tealText},
  {age: '7y 1m', date: 'Feb 24', height: '115.8', weight: '22.8', htPile: '51st', wtPile: '47th', highlight: false, pillBg: Colors.tealBg, pillColor: Colors.tealText},
  {age: '6y', date: 'Jan 23', height: '109.4', weight: '20.1', htPile: '49th', wtPile: '45th', highlight: false, pillBg: Colors.tealBg, pillColor: Colors.tealText},
  {age: '4y 1m', date: 'Feb 21', height: '97.2', weight: '15.8', htPile: '48th', wtPile: '44th', highlight: false, pillBg: Colors.tealBg, pillColor: Colors.tealText},
  {age: '2y', date: 'Jan 19', height: '84.0', weight: '11.8', htPile: '46th', wtPile: '42nd', highlight: false, pillBg: Colors.blueBg, pillColor: Colors.blueText},
  {age: 'Birth', date: 'Jan 17', height: '49.0', weight: '3.1', htPile: '44th', wtPile: '40th', highlight: false, pillBg: Colors.blueBg, pillColor: Colors.blueText},
];

const VELOCITY_DATA = [
  {range: 'Age 8\u20139', gain: '+6.5 cm', pct: 81, pill: 'Normal'},
  {range: 'Age 7\u20138', gain: '+6.2 cm', pct: 77, pill: 'Normal'},
  {range: 'Age 6\u20137', gain: '+6.4 cm', pct: 80, pill: 'Normal'},
];

const MILESTONES = [
  {
    icon: 'calendar-outline',
    title: 'Annual height & weight check',
    subtitle: 'Next due Feb 2027 (age 10y 1m) \u00B7 Book at paediatrician or school health',
    pill: 'Feb 27',
    pillBg: Colors.amberBg,
    pillColor: Colors.amberText,
  },
  {
    icon: 'medical-outline',
    title: 'Dental age assessment',
    subtitle: 'Permanent teeth eruption tracking \u00B7 9 years = typically 4 permanent molars present',
    pill: 'Age 9',
    pillBg: Colors.tealBg,
    pillColor: Colors.tealText,
  },
  {
    icon: 'eye-outline',
    title: 'Annual vision screening',
    subtitle: 'School-age myopia peaks at 9\u201312 years \u00B7 Ophthalmology check recommended',
    pill: 'Overdue',
    pillBg: Colors.amberBg,
    pillColor: Colors.amberText,
  },
  {
    icon: 'fitness-outline',
    title: 'Pre-pubertal BMI monitoring',
    subtitle:
      'Ages 9\u201311 are the critical window for identifying early childhood obesity before puberty. BMI-for-age currently normal -- continue annual checks.',
    pill: 'On track',
    pillBg: Colors.tealBg,
    pillColor: Colors.tealText,
  },
];

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

const cardStyle = {
  borderWidth: 0.5,
  borderColor: Colors.borderLight,
  borderRadius: ms(14),
  backgroundColor: Colors.white,
  padding: ms(14),
  marginBottom: vs(10),
};

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

const SectionHeader = ({text}) => (
  <AppText
    variant="bodyBold"
    style={{marginTop: vs(16), marginBottom: vs(8)}}>
    {text}
  </AppText>
);

// ---------------------------------------------------------------------------
// 1. Child Selector Bar
// ---------------------------------------------------------------------------

const ChildSelectorBar = () => (
  <View style={styles.childBarRow}>
    {/* Active child card */}
    <View style={[styles.childCard, styles.childCardActive]}>
      <View style={styles.childAvatar}>
        <Icon family="Ionicons" name="person-outline" size={16} color={Colors.amberText} />
      </View>
      <View style={{marginLeft: s(6)}}>
        <AppText variant="caption" color={Colors.white} style={{fontWeight: '600'}}>
          Aarav
        </AppText>
        <AppText variant="small" color="rgba(255,255,255,0.7)">
          9 yrs 2 mo
        </AppText>
      </View>
    </View>

    {/* Add child card */}
    <TouchableOpacity style={styles.addChildCard} activeOpacity={0.7}>
      <Icon family="Ionicons" name="add" size={18} color={Colors.textTertiary} />
      <AppText variant="caption" color={Colors.textTertiary} style={{marginLeft: s(4)}}>
        Add child
      </AppText>
    </TouchableOpacity>
  </View>
);

// ---------------------------------------------------------------------------
// 2. Growth Hero Banner
// ---------------------------------------------------------------------------

const GrowthHeroBanner = () => (
  <View style={styles.heroBanner}>
    {/* Top row */}
    <View style={styles.heroTopRow}>
      <AppText
        variant="small"
        color="rgba(255,255,255,0.7)"
        style={{textTransform: 'uppercase', letterSpacing: 0.5, flex: 1}}>
        Aarav Reddy {'\u00B7'} Born 14 Jan 2017 {'\u00B7'} Male {'\u00B7'} Age 9y 2m
      </AppText>
      <View style={styles.heroNormalPill}>
        <AppText variant="small" color={Colors.tealText}>
          Normal growth
        </AppText>
      </View>
    </View>

    {/* Latest measurement label */}
    <View style={styles.heroLatestRow}>
      <AppText variant="caption" color="rgba(255,255,255,0.6)">
        Latest measurement
      </AppText>
      <AppText variant="subtitle" color={Colors.white} style={{marginLeft: s(8)}}>
        22 Feb 2026
      </AppText>
    </View>

    {/* 3-column metrics */}
    <View style={styles.heroMetricsRow}>
      <HeroMetric label="Height" value="128.5 cm" pileLabel="52nd %ile" />
      <HeroMetric label="Weight" value="27.4 kg" pileLabel="48th %ile" />
      <HeroMetric label="BMI for age" value="16.6" pileLabel="Normal" />
    </View>
  </View>
);

const HeroMetric = ({label, value, pileLabel}) => (
  <View style={{flex: 1, alignItems: 'center'}}>
    <AppText variant="small" color="rgba(255,255,255,0.6)">
      {label}
    </AppText>
    <AppText variant="header" color={Colors.white} style={{marginVertical: vs(2)}}>
      {value}
    </AppText>
    <View style={styles.heroPilePill}>
      <AppText variant="small" color={Colors.tealText}>
        {pileLabel}
      </AppText>
    </View>
  </View>
);

// ---------------------------------------------------------------------------
// 3. Chart Toggle Bar
// ---------------------------------------------------------------------------

const ChartToggleBar = ({activeChart, setActiveChart}) => (
  <View style={styles.toggleBar}>
    {CHART_TYPES.map(ct => {
      const active = ct.key === activeChart;
      return (
        <TouchableOpacity
          key={ct.key}
          style={[
            styles.toggleBtn,
            active ? styles.toggleBtnActive : styles.toggleBtnInactive,
          ]}
          activeOpacity={0.7}
          onPress={() => setActiveChart(ct.key)}>
          <AppText
            variant="caption"
            color={active ? Colors.white : Colors.textSecondary}
            style={{fontWeight: active ? '600' : '400'}}>
            {ct.label}
          </AppText>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ---------------------------------------------------------------------------
// 4. Growth Chart Placeholder
// ---------------------------------------------------------------------------

const GCW = 340, GCH = 220;
const GP = {l: 30, r: 15, t: 14, b: 30};
const gcw = GCW - GP.l - GP.r;
const gch = GCH - GP.t - GP.b;
const gpx = (ageIdx, totalAges) => GP.l + (ageIdx / (totalAges - 1)) * gcw;
const gpy = (val, minV, maxV) => GP.t + gch - ((val - minV) / (maxV - minV)) * gch;
const toPoints = (vals, d) => vals.map((v, i) => `${gpx(i, vals.length)},${gpy(v, d.minV, d.maxV)}`).join(' ');

const GrowthChartCard = ({activeChart}) => {
  const d = GROWTH_DATA[activeChart];
  const n = d.ages.length;

  // Build normal-band path (p15 forward, p85 backward)
  const bandPath = d.p15.map((v, i) => {
    const cmd = i === 0 ? 'M' : 'L';
    return `${cmd}${gpx(i, n)},${gpy(v, d.minV, d.maxV)}`;
  }).join(' ') + ' ' + d.p85.slice().reverse().map((v, i) => {
    const idx = n - 1 - i;
    return `L${gpx(idx, n)},${gpy(v, d.minV, d.maxV)}`;
  }).join(' ') + ' Z';

  // Child data points (filter nulls)
  const childPts = d.child
    .map((v, i) => (v != null ? {x: gpx(i, n), y: gpy(v, d.minV, d.maxV), v, i} : null))
    .filter(Boolean);
  const lastPt = childPts[childPts.length - 1];
  const childPolyline = childPts.map(p => `${p.x},${p.y}`).join(' ');

  // Y-axis labels: min, max, and 2 intermediate
  const yRange = d.maxV - d.minV;
  const yLabels = [d.minV, d.minV + yRange / 3, d.minV + (2 * yRange) / 3, d.maxV].map(v => Math.round(v));

  // X-axis labels
  const xLabels = [0, 2, 4, 6, 8, 9, 11];

  return (
    <View style={cardStyle}>
      <AppText variant="bodyBold">{CHART_TITLES[activeChart]}</AppText>

      <View style={{width: '100%', aspectRatio: GCW / GCH, marginVertical: vs(8)}}>
        <Svg width="100%" height="100%" viewBox={`0 0 ${GCW} ${GCH}`}>
          {/* Normal band (p15-p85) */}
          <Path d={bandPath} fill="rgba(29,158,117,0.08)" />

          {/* Horizontal grid lines */}
          {[0, 1, 2, 3, 4].map(i => {
            const yVal = GP.t + (i / 4) * gch;
            return (
              <SvgLine key={`g${i}`} x1={GP.l} y1={yVal} x2={GCW - GP.r} y2={yVal}
                stroke="rgba(0,0,0,0.04)" strokeWidth={0.5} />
            );
          })}

          {/* Percentile lines */}
          <Polyline points={toPoints(d.p3, d)} fill="none" stroke="#E24B4A" strokeWidth={1.2} />
          <Polyline points={toPoints(d.p15, d)} fill="none" stroke="#BA7517" strokeWidth={1} strokeDasharray="3,3" />
          <Polyline points={toPoints(d.p50, d)} fill="none" stroke="#1D9E75" strokeWidth={1.8} />
          <Polyline points={toPoints(d.p85, d)} fill="none" stroke="#1D9E75" strokeWidth={1} strokeDasharray="3,3" />
          <Polyline points={toPoints(d.p97, d)} fill="none" stroke="#0a5c47" strokeWidth={1.2} />

          {/* Child data line */}
          <Polyline points={childPolyline} fill="none" stroke="#1a3a6e" strokeWidth={2.2} />
          {childPts.map((p, i) => (
            <SvgCircle key={`cp${i}`} cx={p.x} cy={p.y}
              r={i === childPts.length - 1 ? 5 : 3.5}
              fill={i === childPts.length - 1 ? '#1a3a6e' : '#378ADD'}
              stroke={i === childPts.length - 1 ? 'white' : 'none'}
              strokeWidth={i === childPts.length - 1 ? 1.5 : 0} />
          ))}

          {/* Latest value label */}
          {lastPt && (
            <SvgText x={lastPt.x + 7} y={lastPt.y - 6} fontSize={9} fill="#1a3a6e" fontWeight="bold">
              {lastPt.v} {d.unit}
            </SvgText>
          )}

          {/* X-axis labels */}
          {xLabels.map(age => (
            <SvgText key={`x${age}`} x={gpx(age, n)} y={GCH - 6} fontSize={8} fill="#aaa" textAnchor="middle">
              {age}y
            </SvgText>
          ))}

          {/* Y-axis labels */}
          {yLabels.map(v => (
            <SvgText key={`y${v}`} x={GP.l - 4} y={gpy(v, d.minV, d.maxV) + 3} fontSize={8} fill="#bbb" textAnchor="end">
              {v}
            </SvgText>
          ))}
        </Svg>
      </View>

      {/* Percentile legend */}
      <View style={styles.legendRow}>
        {PERCENTILE_LEGEND.map((item, i) => (
          <View key={i} style={styles.legendItem}>
            {item.dot ? (
              <View
                style={[styles.legendDot, {backgroundColor: item.color}]}
              />
            ) : item.dash ? (
              <View style={styles.legendDashWrap}>
                <View style={[styles.legendDash, {backgroundColor: item.color}]} />
                <View style={{width: 2}} />
                <View style={[styles.legendDash, {backgroundColor: item.color}]} />
              </View>
            ) : (
              <View
                style={[styles.legendLine, {backgroundColor: item.color}]}
              />
            )}
            <AppText
              variant="small"
              color={Colors.textSecondary}
              style={{marginLeft: s(3)}}>
              {item.label}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
};

// ---------------------------------------------------------------------------
// 5. Growth Analysis Alert Cards
// ---------------------------------------------------------------------------

const GrowthAnalysisCards = () => (
  <View>
    {/* Normal growth card */}
    <View
      style={[
        cardStyle,
        {backgroundColor: Colors.tealBg, borderColor: Colors.teal},
      ]}>
      <View style={styles.alertRow}>
        <Icon
          family="Ionicons"
          name="checkmark-circle-outline"
          size={20}
          color={Colors.tealText}
        />
        <AppText
          variant="bodyBold"
          color={Colors.tealText}
          style={{marginLeft: s(8), flex: 1}}>
          Growth is normal for age and sex
        </AppText>
      </View>
      <AppText
        variant="body"
        color={Colors.tealText}
        style={{marginTop: vs(6)}}>
        Aarav's height (128.5 cm) is at the 52nd percentile for Indian boys
        aged 9 years -- exactly average. Weight (27.4 kg) is at the 48th
        percentile -- well proportioned. BMI-for-age is in the normal range.
        No growth concerns at this time.
      </AppText>
    </View>

    {/* Mid-parental height card */}
    <View
      style={[
        cardStyle,
        {backgroundColor: Colors.blueBg, borderColor: Colors.blue},
      ]}>
      <View style={styles.alertRow}>
        <Icon
          family="Ionicons"
          name="bulb-outline"
          size={20}
          color={Colors.blueText}
        />
        <AppText
          variant="bodyBold"
          color={Colors.blueText}
          style={{marginLeft: s(8), flex: 1}}>
          Parent heights suggest mid-parental height of ~171 cm
        </AppText>
      </View>
      <AppText
        variant="body"
        color={Colors.blueText}
        style={{marginTop: vs(6)}}>
        Mid-parental height for a boy = (Mother height + Father height + 13)
        / 2 = (163 + 172 + 13) / 2 = 174 cm. Aarav's current trajectory
        (52nd percentile) projects adult height of approximately 171-175 cm
        -- consistent with genetic potential.
      </AppText>
    </View>
  </View>
);

// ---------------------------------------------------------------------------
// 6. Z-Score Analysis Card
// ---------------------------------------------------------------------------

const ZScoreAnalysisCard = () => (
  <View style={cardStyle}>
    {ZSCORE_DATA.map((item, idx) => (
      <View
        key={idx}
        style={[
          styles.zRow,
          idx < ZSCORE_DATA.length - 1 && {
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.borderLight,
            paddingBottom: vs(10),
            marginBottom: vs(10),
          },
        ]}>
        {/* Label + value */}
        <View style={styles.zLabelRow}>
          <AppText variant="bodyBold">{item.label}</AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            Z = {item.z} ({item.percentile})
          </AppText>
        </View>

        {/* Visual bar */}
        <View style={styles.zBarOuter}>
          {/* Normal zone 25%-75% */}
          <View style={styles.zBarNormal} />
          {/* Dot marker */}
          <View
            style={[
              styles.zBarDot,
              {left: `${item.dotPosition}%`, backgroundColor: item.color},
            ]}
          />
        </View>

        {/* Scale labels */}
        <View style={styles.zScaleLabels}>
          <AppText variant="small" color={Colors.textTertiary}>
            -3 SD
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>
            -2 SD
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>
            0
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>
            +2 SD
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>
            +3 SD
          </AppText>
        </View>

        {/* Interpretation */}
        <AppText
          variant="caption"
          color={Colors.textSecondary}
          style={{marginTop: vs(4)}}>
          {item.interpretation}
        </AppText>
      </View>
    ))}

    {/* Footer */}
    <AppText
      variant="small"
      color={Colors.textTertiary}
      style={{marginTop: vs(8)}}>
      Reference: IAP (Indian Academy of Pediatrics) Growth Charts 2015{' '}
      {'\u00B7'} Indian-specific reference population {'\u00B7'} Age- and
      sex-specific.
    </AppText>
  </View>
);

// ---------------------------------------------------------------------------
// 7. Measurement History Table
// ---------------------------------------------------------------------------

const MeasurementHistoryTable = () => (
  <View style={cardStyle}>
    {/* Header row */}
    <View style={styles.tableRow}>
      <View style={styles.tableColAge}>
        <AppText variant="small" color={Colors.textTertiary}>
          Age
        </AppText>
      </View>
      <View style={styles.tableCol}>
        <AppText variant="small" color={Colors.textTertiary}>
          Height
        </AppText>
      </View>
      <View style={styles.tableCol}>
        <AppText variant="small" color={Colors.textTertiary}>
          Weight
        </AppText>
      </View>
      <View style={styles.tableCol}>
        <AppText variant="small" color={Colors.textTertiary}>
          Ht %ile
        </AppText>
      </View>
      <View style={styles.tableCol}>
        <AppText variant="small" color={Colors.textTertiary}>
          Wt %ile
        </AppText>
      </View>
    </View>

    {MEASUREMENT_HISTORY.map((row, idx) => (
      <View
        key={idx}
        style={[
          styles.tableRow,
          row.highlight && {backgroundColor: Colors.amberBg, borderRadius: ms(6)},
          {paddingVertical: vs(6)},
        ]}>
        <View style={styles.tableColAge}>
          <AppText variant="caption" style={{fontWeight: row.highlight ? '600' : '400'}}>
            {row.age}
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>
            {row.date}
          </AppText>
        </View>
        <View style={styles.tableCol}>
          <AppText variant="caption">{row.height}</AppText>
        </View>
        <View style={styles.tableCol}>
          <AppText variant="caption">{row.weight}</AppText>
        </View>
        <View style={styles.tableCol}>
          <View style={[styles.tablePill, {backgroundColor: row.pillBg}]}>
            <AppText variant="small" color={row.pillColor}>
              {row.htPile}
            </AppText>
          </View>
        </View>
        <View style={styles.tableCol}>
          <View style={[styles.tablePill, {backgroundColor: row.pillBg}]}>
            <AppText variant="small" color={row.pillColor}>
              {row.wtPile}
            </AppText>
          </View>
        </View>
      </View>
    ))}
  </View>
);

// ---------------------------------------------------------------------------
// 8. Annual Height Velocity Card
// ---------------------------------------------------------------------------

const HeightVelocityCard = () => (
  <View style={cardStyle}>
    <AppText variant="bodyBold">Height gained per year</AppText>
    <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(10)}}>
      Normal: 5-6 cm/year (school age)
    </AppText>

    {VELOCITY_DATA.map((v, idx) => (
      <View key={idx} style={styles.velocityRow}>
        <AppText variant="caption" style={{width: s(70)}}>
          {v.range}
        </AppText>
        <AppText variant="caption" style={{width: s(55), fontWeight: '600'}}>
          {v.gain}
        </AppText>
        <View style={styles.velocityBarOuter}>
          <View
            style={[
              styles.velocityBarInner,
              {width: `${v.pct}%`, backgroundColor: Colors.teal},
            ]}
          />
        </View>
        <View style={[styles.velocityPill, {backgroundColor: Colors.tealBg}]}>
          <AppText variant="small" color={Colors.tealText}>
            {v.pill}
          </AppText>
        </View>
      </View>
    ))}

    <View
      style={[
        styles.velocityFooter,
        {backgroundColor: Colors.tealBg, borderRadius: ms(8), marginTop: vs(10)},
      ]}>
      <AppText variant="caption" color={Colors.tealText}>
        Height velocity is consistently in the normal range (5-7 cm/year for
        school-age boys). No growth deceleration detected. Pubertal growth
        spurt expected around ages 11-13.
      </AppText>
    </View>
  </View>
);

// ---------------------------------------------------------------------------
// 9. Family History Alert Card
// ---------------------------------------------------------------------------

const FamilyHistoryCard = () => (
  <View
    style={[
      cardStyle,
      {backgroundColor: Colors.amberBg, borderColor: Colors.amber},
    ]}>
    <View style={styles.alertRow}>
      <Icon
        family="Ionicons"
        name="alert-circle-outline"
        size={20}
        color={Colors.amberText}
      />
      <AppText
        variant="bodyBold"
        color={Colors.amberText}
        style={{marginLeft: s(8), flex: 1}}>
        Family history alert -- T2DM risk monitoring
      </AppText>
    </View>
    <AppText variant="body" color={Colors.amberText} style={{marginTop: vs(6)}}>
      With both parents having metabolic conditions (mother: T2DM + HTN +
      Dyslipidaemia), Aarav has an elevated lifetime T2DM risk. Monitoring
      BMI-for-age and maintaining normal percentile range is the primary
      paediatric prevention strategy. Currently normal -- continue annual
      growth monitoring.
    </AppText>
  </View>
);

// ---------------------------------------------------------------------------
// 10. Upcoming Milestones Card
// ---------------------------------------------------------------------------

const MilestonesCard = () => (
  <View style={cardStyle}>
    {MILESTONES.map((m, idx) => (
      <View
        key={idx}
        style={[
          styles.milestoneRow,
          idx < MILESTONES.length - 1 && {
            borderBottomWidth: 0.5,
            borderBottomColor: Colors.borderLight,
            paddingBottom: vs(10),
            marginBottom: vs(10),
          },
        ]}>
        <View style={styles.milestoneIconWrap}>
          <Icon family="Ionicons" name={m.icon} size={18} color={Colors.primary} />
        </View>
        <View style={{flex: 1, marginLeft: s(10)}}>
          <View style={styles.milestoneTitleRow}>
            <AppText variant="bodyBold" style={{flex: 1}}>
              {m.title}
            </AppText>
            <View style={[styles.milestonePill, {backgroundColor: m.pillBg}]}>
              <AppText variant="small" color={m.pillColor}>
                {m.pill}
              </AppText>
            </View>
          </View>
          <AppText
            variant="caption"
            color={Colors.textSecondary}
            style={{marginTop: vs(2)}}>
            {m.subtitle}
          </AppText>
        </View>
      </View>
    ))}
  </View>
);

// ---------------------------------------------------------------------------
// 11. Log Measurement Button
// ---------------------------------------------------------------------------

const LogMeasurementButton = () => (
  <TouchableOpacity style={styles.logButton} activeOpacity={0.7}>
    <AppText variant="bodyBold" color={Colors.white}>
      + Log measurement today
    </AppText>
  </TouchableOpacity>
);

// ---------------------------------------------------------------------------
// Main Component
// ---------------------------------------------------------------------------

const GrowthTrackerTab = () => {
  const [activeChart, setActiveChart] = useState('height');

  return (
    <View style={styles.container}>
      {/* 1 */}
      <ChildSelectorBar />

      {/* 2 */}
      <GrowthHeroBanner />

      {/* 3 */}
      <ChartToggleBar activeChart={activeChart} setActiveChart={setActiveChart} />

      {/* 4 */}
      <GrowthChartCard activeChart={activeChart} />

      {/* 5 */}
      <GrowthAnalysisCards />

      {/* 6 */}
      <SectionHeader text="Z-score analysis \u00B7 Current measurement" />
      <ZScoreAnalysisCard />

      {/* 7 */}
      <SectionHeader text="Measurement history \u00B7 Aarav" />
      <MeasurementHistoryTable />

      {/* 8 */}
      <SectionHeader text="Annual height velocity" />
      <HeightVelocityCard />

      {/* 9 */}
      <FamilyHistoryCard />

      {/* 10 */}
      <SectionHeader text="Upcoming developmental milestones" />
      <MilestonesCard />

      {/* 11 */}
      <LogMeasurementButton />
    </View>
  );
};

// ---------------------------------------------------------------------------
// Styles
// ---------------------------------------------------------------------------

const styles = StyleSheet.create({
  container: {
    padding: s(4),
  },

  // 1 — Child Selector Bar
  childBarRow: {
    flexDirection: 'row',
    marginBottom: vs(12),
  },
  childCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ms(12),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    marginRight: s(8),
  },
  childCardActive: {
    backgroundColor: Colors.primary,
  },
  childAvatar: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(14),
    backgroundColor: Colors.amberBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  addChildCard: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: ms(12),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    borderWidth: 1,
    borderStyle: 'dashed',
    borderColor: Colors.borderLight,
  },

  // 2 — Hero Banner
  heroBanner: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: vs(12),
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  heroNormalPill: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(10),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    marginLeft: s(6),
  },
  heroLatestRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  heroMetricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroPilePill: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(8),
    paddingHorizontal: s(6),
    paddingVertical: vs(1),
  },

  // 3 — Toggle Bar
  toggleBar: {
    flexDirection: 'row',
    marginBottom: vs(12),
    borderRadius: ms(10),
    overflow: 'hidden',
  },
  toggleBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(8),
    borderRadius: ms(10),
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  toggleBtnInactive: {
    backgroundColor: Colors.background,
  },

  // 4 — Growth Chart
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: vs(6),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: s(10),
    marginBottom: vs(4),
  },
  legendDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  legendLine: {
    width: ms(14),
    height: ms(2),
    borderRadius: ms(1),
  },
  legendDashWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDash: {
    width: ms(5),
    height: ms(2),
    borderRadius: ms(1),
  },

  // 5 — Alert cards
  alertRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // 6 — Z-score
  zRow: {},
  zLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  zBarOuter: {
    height: vs(10),
    backgroundColor: Colors.borderLight,
    borderRadius: ms(5),
    overflow: 'hidden',
    position: 'relative',
  },
  zBarNormal: {
    position: 'absolute',
    left: '25%',
    width: '50%',
    height: '100%',
    backgroundColor: Colors.tealBg,
  },
  zBarDot: {
    position: 'absolute',
    top: vs(1),
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    marginLeft: -ms(4),
  },
  zScaleLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(2),
  },

  // 7 — Table
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(4),
    paddingHorizontal: s(4),
  },
  tableColAge: {
    flex: 1.3,
  },
  tableCol: {
    flex: 1,
    alignItems: 'center',
  },
  tablePill: {
    borderRadius: ms(8),
    paddingHorizontal: s(6),
    paddingVertical: vs(1),
  },

  // 8 — Velocity
  velocityRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  velocityBarOuter: {
    flex: 1,
    height: vs(6),
    backgroundColor: Colors.borderLight,
    borderRadius: ms(3),
    marginHorizontal: s(6),
    overflow: 'hidden',
  },
  velocityBarInner: {
    height: '100%',
    borderRadius: ms(3),
  },
  velocityPill: {
    borderRadius: ms(8),
    paddingHorizontal: s(6),
    paddingVertical: vs(1),
  },
  velocityFooter: {
    padding: ms(10),
  },

  // 10 — Milestones
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  milestoneIconWrap: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  milestonePill: {
    borderRadius: ms(8),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    marginLeft: s(6),
  },

  // 11 — Log button
  logButton: {
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(12),
    alignItems: 'center',
    marginTop: vs(6),
    marginBottom: vs(12),
  },
});

export default GrowthTrackerTab;
