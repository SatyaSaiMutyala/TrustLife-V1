import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Circle as SvgCircle, Text as SvgText, Path, Rect, Line as SvgLine} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

// ─── Constants & Data ───────────────────────────────────────────────────

const BMI_ZONES = [
  {label: 'Under', range: '<18.5', color: '#3b82f6', flex: 2},
  {label: 'Normal', range: '18.5–23', color: '#10b981', flex: 4.5},
  {label: 'OW', range: '23–27.5', color: '#f59e0b', flex: 4.5},
  {label: 'Obese', range: '>27.5', color: '#ef4444', flex: 3},
  {label: 'Severe', range: '', color: '#991b1b', flex: 2},
];

const TIME_CHIPS = ['Morning', 'Evening', 'Random time'];
const CLOTHING_CHIPS = ['Light clothing', 'Full clothes', 'No clothes', 'With shoes'];
const MEAL_CHIPS = ['Before breakfast', 'After eating', 'After exercise'];

const CONTEXT_TAGS = [
  'Unwell/fever', 'Menstrual', 'Bloated', 'Heavy meal',
  'High sodium', 'Intense exercise', 'Travel', 'New medication',
  'Usual/baseline',
];

const DERIVED_DATA = [
  {label: 'Ideal weight range', value: '49\u201361 kg', sub: 'BMI 18.5\u201323 at 163 cm', color: Colors.textPrimary},
  {label: 'To reach BMI 23', value: '\u22127.2 kg', sub: '', color: Colors.amber},
  {label: 'Waist circumference', value: '84 cm', sub: 'Target <80 cm', color: Colors.red},
  {label: 'Waist/height ratio', value: '0.52', sub: 'Target <0.50', color: Colors.amber},
  {label: 'vs Last recorded', value: '\u22120.8 kg', sub: 'vs 69.2 kg Sep 2025', color: Colors.teal},
  {label: 'Loss rate', value: '\u22120.13 kg/wk', sub: 'Healthy pace', color: Colors.teal},
];

const COMPARISON_ROWS = [
  {label: 'Last recorded (15 Mar)', weight: '68.4', change: 'Same', color: Colors.textSecondary},
  {label: '6 months ago (Sep 2025)', weight: '69.2', change: '\u22120.8 kg', color: Colors.teal},
  {label: 'At T2DM diagnosis (Sep 2019)', weight: '72.4', change: '\u22124.0 kg', color: Colors.teal},
  {label: 'Peak weight (Jun 2022)', weight: '70.2', change: '\u22121.8 kg', color: Colors.teal},
  {label: 'Target (BMI 23)', weight: '61.2', change: '+7.2 kg away', color: Colors.red},
];

const CONDITION_LINKS = [
  {icon: 'analytics-outline', title: 'T2DM', bgColor: Colors.amberBg, iconColor: Colors.amber, desc: 'Each 1 kg lost reduces fasting glucose by ~0.2 mmol/L. Weight loss of 5\u201310% can significantly improve HbA1c.'},
  {icon: 'heart-outline', title: 'HTN', bgColor: Colors.redBg, iconColor: Colors.red, desc: 'Each 1 kg loss \u2248 ~1 mmHg systolic BP drop. Sustained loss reduces medication burden.'},
  {icon: 'beaker-outline', title: 'Dyslipidaemia', bgColor: Colors.blueBg, iconColor: Colors.blue, desc: 'Visceral fat drives TG and HDL imbalance. Even modest weight loss improves lipid profile.'},
  {icon: 'body-outline', title: 'NAFLD', bgColor: Colors.amberBg, iconColor: Colors.amber, desc: 'Weight loss of 7\u201310% is most effective intervention for NAFLD regression and fibrosis improvement.'},
];

const HISTORY_ROWS = [
  {date: 'Today', weight: '68.4', bmi: '24.7', change: '\u2014', source: 'Manual', highlight: true},
  {date: '15 Mar 26', weight: '68.4', bmi: '24.7', change: '\u2014', source: 'Clinic', highlight: false},
  {date: '10 Sep 25', weight: '69.2', bmi: '26.0', change: '\u22120.8', changeColor: Colors.teal, source: 'Clinic', highlight: false},
  {date: '12 Mar 25', weight: '69.0', bmi: '25.9', change: '\u22120.2', changeColor: Colors.teal, source: 'Manual', highlight: false},
  {date: '2 Sep 24', weight: '69.2', bmi: '26.0', change: '+0.2', changeColor: Colors.red, source: 'Clinic', highlight: false},
  {date: 'Jun 2022', weight: '70.2', bmi: '26.4', change: 'Peak', changeColor: Colors.red, source: 'Clinic', highlight: false},
  {date: 'Sep 2019', weight: '72.4', bmi: '27.2', change: 'At Dx', changeColor: Colors.textSecondary, source: 'Lab', highlight: false},
];

const WEIGHT_SLIDER_LABELS = [30, 49, 61.2, 80, 100, 150];
const HEIGHT_SLIDER_LABELS = [100, 120, 140, 163, 180, 200, 220];

// ─── BMI Gauge SVG ──────────────────────────────────────────────────────

const BMIGauge = () => {
  const bmi = 24.7;
  const minBmi = 15;
  const maxBmi = 35;
  const startAngle = -140;
  const endAngle = 140;
  const totalAngle = endAngle - startAngle;
  const fraction = Math.min(1, Math.max(0, (bmi - minBmi) / (maxBmi - minBmi)));
  const needleAngle = startAngle + fraction * totalAngle;
  const cx = 40;
  const cy = 45;
  const r = 32;

  const toRad = (deg) => (deg * Math.PI) / 180;

  const arcPath = (sA, eA, radius) => {
    const x1 = cx + radius * Math.cos(toRad(sA));
    const y1 = cy + radius * Math.sin(toRad(sA));
    const x2 = cx + radius * Math.cos(toRad(eA));
    const y2 = cy + radius * Math.sin(toRad(eA));
    const largeArc = eA - sA > 180 ? 1 : 0;
    return `M ${x1} ${y1} A ${radius} ${radius} 0 ${largeArc} 1 ${x2} ${y2}`;
  };

  // Arc segments for BMI zones
  const zones = [
    {color: '#3b82f6', start: -140, end: -95},   // underweight
    {color: '#10b981', start: -95, end: -10},     // normal
    {color: '#f59e0b', start: -10, end: 55},      // overweight
    {color: '#ef4444', start: 55, end: 105},      // obese
    {color: '#991b1b', start: 105, end: 140},     // severe
  ];

  const needleX = cx + (r - 10) * Math.cos(toRad(needleAngle));
  const needleY = cy + (r - 10) * Math.sin(toRad(needleAngle));

  return (
    <Svg width={ms(80)} height={ms(80)} viewBox="0 0 80 80">
      {/* Background arc */}
      <Path d={arcPath(-140, 140, r)} fill="none" stroke="#e5e7eb" strokeWidth={5} strokeLinecap="round" />
      {/* Colored arc segments */}
      {zones.map((z, i) => (
        <Path key={i} d={arcPath(z.start, z.end, r)} fill="none" stroke={z.color} strokeWidth={5} strokeLinecap="butt" />
      ))}
      {/* Needle */}
      <SvgLine x1={cx} y1={cy} x2={needleX} y2={needleY} stroke={Colors.white} strokeWidth={2} strokeLinecap="round" />
      <SvgCircle cx={cx} cy={cy} r={3} fill={Colors.white} />
      {/* Center text */}
      <SvgText x={cx} y={cy + 16} fill={Colors.white} fontSize="11" fontWeight="700" textAnchor="middle">
        24.7
      </SvgText>
    </Svg>
  );
};

// ─── BMI Classification Bar ─────────────────────────────────────────────

const BMIClassBar = () => {
  const barWidth = 280;
  const totalFlex = BMI_ZONES.reduce((a, b) => a + b.flex, 0);
  // BMI 24.7 position in range 15–35
  const bmiMin = 15;
  const bmiMax = 35;
  const markerFraction = (24.7 - bmiMin) / (bmiMax - bmiMin);
  const markerPos = markerFraction * barWidth;

  return (
    <View>
      <Svg width={ms(barWidth)} height={ms(20)} viewBox={`0 0 ${barWidth} 20`}>
        {BMI_ZONES.reduce((acc, zone, i) => {
          const prevWidth = acc.offset;
          const w = (zone.flex / totalFlex) * barWidth;
          acc.elements.push(
            <Rect
              key={i}
              x={prevWidth}
              y={4}
              width={w}
              height={10}
              rx={i === 0 ? 5 : 0}
              ry={i === BMI_ZONES.length - 1 ? 5 : 0}
              fill={zone.color}
            />,
          );
          acc.offset += w;
          return acc;
        }, {elements: [], offset: 0}).elements}
        {/* Marker */}
        <SvgCircle cx={markerPos} cy={9} r={5} fill={Colors.white} stroke="#f59e0b" strokeWidth={2} />
      </Svg>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: vs(2), marginLeft: s(markerFraction * 240)}}>
        <AppText variant="small" color={Colors.amber} style={{fontWeight: '700'}}>
          {'\u2190'} You 24.7
        </AppText>
      </View>
      <View style={styles.bmiScaleLabels}>
        {BMI_ZONES.map((z, i) => (
          <View key={i} style={{flex: z.flex, alignItems: 'center'}}>
            <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(9)}}>
              {z.label}
            </AppText>
            {z.range ? (
              <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(8)}}>
                {z.range}
              </AppText>
            ) : null}
          </View>
        ))}
      </View>
    </View>
  );
};

// ─── Weight Slider Visual ───────────────────────────────────────────────

const WeightSlider = () => {
  const barWidth = 260;
  const fillFraction = (68.4 - 30) / (150 - 30);
  const fillWidth = fillFraction * barWidth;
  const targetFraction = (61.2 - 30) / (150 - 30);
  const targetX = targetFraction * barWidth;

  return (
    <View>
      <View style={styles.sliderHeader}>
        <Icon family="Ionicons" name="scale-outline" size={16} color={Colors.textSecondary} />
        <View style={styles.sliderValueBadge}>
          <AppText variant="caption" color={Colors.primary} style={{fontWeight: '700'}}>68.4 kg</AppText>
        </View>
      </View>
      <View style={{marginTop: vs(8), alignItems: 'center'}}>
        <Svg width={ms(barWidth)} height={ms(18)} viewBox={`0 0 ${barWidth} 18`}>
          <Rect x={0} y={5} width={barWidth} height={8} rx={4} fill="#e5e7eb" />
          <Rect x={0} y={5} width={fillWidth} height={8} rx={4} fill={Colors.primary} />
          {/* Target marker */}
          <SvgLine x1={targetX} y1={2} x2={targetX} y2={16} stroke={Colors.amber} strokeWidth={1.5} strokeDasharray="2,2" />
          <SvgCircle cx={fillWidth} cy={9} r={6} fill={Colors.white} stroke={Colors.primary} strokeWidth={2} />
        </Svg>
      </View>
      <View style={styles.sliderLabels}>
        {WEIGHT_SLIDER_LABELS.map((l, i) => (
          <AppText key={i} variant="small" color={l === 61.2 ? Colors.amber : Colors.textTertiary} style={l === 61.2 ? {fontWeight: '700'} : {}}>
            {l}
          </AppText>
        ))}
      </View>
    </View>
  );
};

const HeightSlider = () => {
  const barWidth = 260;
  const fillFraction = (163 - 100) / (220 - 100);
  const fillWidth = fillFraction * barWidth;

  return (
    <View style={{marginTop: vs(16)}}>
      <View style={styles.sliderHeader}>
        <Icon family="Ionicons" name="resize-outline" size={16} color={Colors.textSecondary} />
        <View style={styles.sliderValueBadge}>
          <AppText variant="caption" color={Colors.primary} style={{fontWeight: '700'}}>163 cm</AppText>
        </View>
      </View>
      <View style={{marginTop: vs(8), alignItems: 'center'}}>
        <Svg width={ms(barWidth)} height={ms(14)} viewBox={`0 0 ${barWidth} 14`}>
          <Rect x={0} y={3} width={barWidth} height={8} rx={4} fill="#e5e7eb" />
          <Rect x={0} y={3} width={fillWidth} height={8} rx={4} fill={Colors.textSecondary} />
          <SvgCircle cx={fillWidth} cy={7} r={6} fill={Colors.white} stroke={Colors.textSecondary} strokeWidth={2} />
        </Svg>
      </View>
      <View style={styles.sliderLabels}>
        {HEIGHT_SLIDER_LABELS.map((l, i) => (
          <AppText key={i} variant="small" color={Colors.textTertiary}>{l}</AppText>
        ))}
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

const WeightManualView = () => {
  const [activeTime, setActiveTime] = useState('Morning');
  const [activeClothing, setActiveClothing] = useState('Light clothing');
  const [activeMeal, setActiveMeal] = useState('After eating');
  const [selectedContexts, setSelectedContexts] = useState(['Usual/baseline']);
  const [notes, setNotes] = useState('');

  const toggleTag = (tag, list, setter) => {
    setter(list.includes(tag) ? list.filter(t => t !== tag) : [...list, tag]);
  };

  return (
    <View style={styles.container}>
      {/* ── 1. Weight & Height Inputs ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>WEIGHT & HEIGHT</AppText>
      <View style={styles.inputCardsRow}>
        <TouchableOpacity activeOpacity={0.7} style={[styles.inputCard, {flex: 1, marginRight: s(5)}]}>
          <AppText variant="small" color={Colors.textSecondary} style={{letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: '700', fontSize: ms(9)}}>Weight</AppText>
          <View style={styles.inputValueRow}>
            <AppText style={[styles.bigNumber, {color: Colors.purple}]} numberOfLines={1} adjustsFontSizeToFit>68.4</AppText>
            <AppText variant="body" color={Colors.textTertiary} style={{marginLeft: s(3)}}>kg</AppText>
          </View>
          <AppText variant="small" color={Colors.textTertiary}>Tap to edit</AppText>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={[styles.inputCard, {flex: 1, marginLeft: s(5)}]}>
          <AppText variant="small" color={Colors.textSecondary} style={{letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: '700', fontSize: ms(9)}}>Height</AppText>
          <View style={styles.inputValueRow}>
            <AppText style={[styles.bigNumber, {color: Colors.textSecondary}]} numberOfLines={1} adjustsFontSizeToFit>163</AppText>
            <AppText variant="body" color={Colors.textTertiary} style={{marginLeft: s(3)}}>cm</AppText>
          </View>
          <AppText variant="small" color={Colors.textTertiary}>Tap to edit</AppText>
        </TouchableOpacity>
      </View>

      {/* ── 2. Height Note ── */}
      <View style={styles.heightNoteCard}>
        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
          <Icon family="Ionicons" name="lock-closed-outline" size={14} color={Colors.textSecondary} />
          <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(6), flex: 1, lineHeight: ms(17)}}>
            Height carried forward from last record (163 cm {'\u00b7'} Sep 2025). Tap to update if changed.
          </AppText>
        </View>
      </View>

      {/* ── 3. BMI Live Card ── */}
      <View style={styles.bmiLiveCard}>
        <View style={styles.bmiLiveRow}>
          <BMIGauge />
          <View style={{flex: 1, marginLeft: s(12)}}>
            <AppText variant="small" color={Colors.heroTextMuted}>BMI {'\u00b7'} Indian standard</AppText>
            <AppText style={styles.bmiBigValue}>24.7</AppText>
            <AppText variant="bodyBold" color={Colors.amber} style={{marginTop: vs(2)}}>Overweight</AppText>
            <View style={styles.bmiProgressRow}>
              <View style={styles.bmiProgressTrack}>
                <View style={[styles.bmiProgressFill, {width: '60%'}]} />
              </View>
            </View>
            <AppText variant="small" color={Colors.heroTextMuted} style={{marginTop: vs(4)}}>
              To BMI 23: {'\u22127.2 kg'}
            </AppText>
            <AppText variant="small" color={Colors.heroTextMuted} style={{marginTop: vs(2)}}>
              Ideal weight: 61.2 kg {'\u00b7'} Height: 163 cm
            </AppText>
          </View>
        </View>
      </View>

      {/* ── 4. BMI Classification Bar ── */}
      <View style={styles.card}>
        <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginBottom: vs(4)}}>
          BMI classification {'\u00b7'} Indian/WHO Asia-Pacific 2004
        </AppText>
        <View style={{marginTop: vs(8), alignItems: 'center'}}>
          <BMIClassBar />
        </View>
      </View>

      {/* ── 5. Derived Values ── */}
      <View style={styles.derivedGrid}>
        {DERIVED_DATA.map((item, i) => (
          <View key={i} style={styles.derivedBox}>
            <AppText variant="small" color={Colors.textSecondary}>{item.label}</AppText>
            <AppText variant="bodyBold" color={item.color} style={{marginTop: vs(2)}}>{item.value}</AppText>
            {item.sub ? (
              <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(1)}}>{item.sub}</AppText>
            ) : null}
          </View>
        ))}
      </View>

      {/* ── 6. Sliders ── */}
      <View style={styles.card}>
        <WeightSlider />
        <HeightSlider />
      </View>

      {/* ── 7. Measurement Conditions ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>MEASUREMENT CONDITIONS</AppText>
      <View style={styles.card}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>Time of day</AppText>
        <View style={styles.chipRow}>
          {TIME_CHIPS.map(chip => (
            <TouchableOpacity
              key={chip}
              activeOpacity={0.7}
              onPress={() => setActiveTime(chip)}
              style={[styles.chip, activeTime === chip && styles.chipActive]}>
              <AppText
                variant="caption"
                color={activeTime === chip ? Colors.white : Colors.textSecondary}
                style={{fontWeight: activeTime === chip ? '700' : '400'}}>
                {chip}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginTop: vs(12)}}>Clothing</AppText>
        <View style={styles.chipRow}>
          {CLOTHING_CHIPS.map(chip => (
            <TouchableOpacity
              key={chip}
              activeOpacity={0.7}
              onPress={() => setActiveClothing(chip)}
              style={[styles.chip, activeClothing === chip && styles.chipActive]}>
              <AppText
                variant="caption"
                color={activeClothing === chip ? Colors.white : Colors.textSecondary}
                style={{fontWeight: activeClothing === chip ? '700' : '400'}}>
                {chip}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginTop: vs(12)}}>Meal / activity</AppText>
        <View style={styles.chipRow}>
          {MEAL_CHIPS.map(chip => (
            <TouchableOpacity
              key={chip}
              activeOpacity={0.7}
              onPress={() => setActiveMeal(chip)}
              style={[styles.chip, activeMeal === chip && styles.chipActive]}>
              <AppText
                variant="caption"
                color={activeMeal === chip ? Colors.white : Colors.textSecondary}
                style={{fontWeight: activeMeal === chip ? '700' : '400'}}>
                {chip}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={styles.insightCard}>
          <Icon family="Ionicons" name="bulb-outline" size={14} color={Colors.purpleText} />
          <AppText variant="caption" color={Colors.purpleText} style={{marginLeft: s(6), flex: 1, lineHeight: ms(17)}}>
            Best practice: weigh first thing in the morning, after bathroom, in light clothing, before eating or drinking.
          </AppText>
        </View>
      </View>

      {/* ── 8. Context Tags ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>CONTEXT</AppText>
      <View style={styles.card}>
        <View style={styles.chipRow}>
          {CONTEXT_TAGS.map(tag => {
            const isActive = selectedContexts.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                activeOpacity={0.7}
                onPress={() => toggleTag(tag, selectedContexts, setSelectedContexts)}
                style={[styles.chip, isActive && styles.chipActive]}>
                <AppText
                  variant="caption"
                  color={isActive ? Colors.white : Colors.textSecondary}
                  style={{fontWeight: isActive ? '700' : '400'}}>
                  {tag}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── 9. Comparison ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>HOW THIS COMPARES</AppText>
      <View style={styles.card}>
        {COMPARISON_ROWS.map((row, i) => (
          <View key={i} style={[styles.comparisonRow, i < COMPARISON_ROWS.length - 1 && styles.comparisonRowBorder]}>
            <View style={{flex: 1}}>
              <AppText variant="caption" color={Colors.textSecondary}>{row.label}</AppText>
            </View>
            <AppText variant="body" color={Colors.textPrimary} style={{marginRight: s(10)}}>{row.weight} kg</AppText>
            <AppText variant="bodyBold" color={row.color}>{row.change}</AppText>
          </View>
        ))}
      </View>

      {/* ── 10. Milestone Badge ── */}
      <View style={styles.milestoneCard}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)}}>
          <Icon family="Ionicons" name="trophy-outline" size={18} color={Colors.tealText} />
          <AppText variant="bodyBold" color={Colors.tealText} style={{marginLeft: s(8)}}>
            {'\u22124 kg from diagnosis \u00b7 Progress noted'}
          </AppText>
        </View>
        <AppText variant="caption" color={Colors.tealText} style={{lineHeight: ms(17)}}>
          Slow, consistent loss of ~0.13 kg/week is sustainable. At this pace, reaching BMI 23 (61.2 kg) would take approximately 54 weeks. Continue daily walks of 30{'\u201345'} min to maintain momentum.
        </AppText>
      </View>

      {/* ── 11. Weight-Condition Links ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>WHY WEIGHT MATTERS {'\u00b7'} YOUR CONDITIONS</AppText>
      <View style={styles.card}>
        {CONDITION_LINKS.map((item, i) => (
          <View key={i} style={[styles.conditionRow, i < CONDITION_LINKS.length - 1 && styles.comparisonRowBorder]}>
            <View style={[styles.conditionIcon, {backgroundColor: item.bgColor}]}>
              <Icon family="Ionicons" name={item.icon} size={16} color={item.iconColor} />
            </View>
            <View style={{flex: 1, marginLeft: s(10)}}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>{item.title}</AppText>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(16)}}>
                {item.desc}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      {/* ── 12. Weight History ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>WEIGHT HISTORY</AppText>
      <View style={styles.card}>
        {/* Table header */}
        <View style={styles.tableHeaderRow}>
          <AppText variant="small" color={Colors.textTertiary} style={styles.colDate}>Date</AppText>
          <AppText variant="small" color={Colors.textTertiary} style={styles.colWeight}>Weight</AppText>
          <AppText variant="small" color={Colors.textTertiary} style={styles.colBmi}>BMI</AppText>
          <AppText variant="small" color={Colors.textTertiary} style={styles.colChange}>Change</AppText>
          <AppText variant="small" color={Colors.textTertiary} style={styles.colSource}>Source</AppText>
        </View>
        {HISTORY_ROWS.map((row, i) => (
          <View key={i} style={[styles.tableRow, row.highlight && styles.tableRowHighlight]}>
            <AppText variant="caption" color={row.highlight ? Colors.primary : Colors.textPrimary} style={[styles.colDate, row.highlight && {fontWeight: '700'}]}>
              {row.date}
            </AppText>
            <AppText variant="caption" color={Colors.textPrimary} style={styles.colWeight}>{row.weight}</AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.colBmi}>{row.bmi}</AppText>
            <AppText variant="caption" color={row.changeColor || Colors.textSecondary} style={styles.colChange}>{row.change}</AppText>
            <AppText variant="small" color={Colors.textTertiary} style={styles.colSource}>{row.source}</AppText>
          </View>
        ))}
      </View>

      {/* ── 13. Notes ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>NOTE</AppText>
      <View style={styles.card}>
        <TextInput
          style={styles.noteInput}
          placeholder="Add notes about this measurement..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          textAlignVertical="top"
          value={notes}
          onChangeText={setNotes}
        />
      </View>
    </View>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingVertical: vs(6),
  },
  sectionHeading: {
    marginTop: vs(18),
    marginBottom: vs(8),
  },
  card: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(14),
    backgroundColor: Colors.white,
    marginBottom: vs(8),
  },
  inputCardsRow: {
    flexDirection: 'row',
  },
  inputCard: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    paddingVertical: vs(14),
    paddingHorizontal: s(10),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(8),
    minHeight: vs(100),
  },
  inputValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    justifyContent: 'center',
    marginVertical: vs(6),
  },
  bigNumber: {
    fontSize: ms(38),
    fontWeight: '700',
    lineHeight: ms(42),
  },
  heightNoteCard: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(12),
    backgroundColor: '#f9fafb',
    marginBottom: vs(8),
  },
  bmiLiveCard: {
    borderRadius: ms(14),
    padding: ms(14),
    backgroundColor: Colors.primary,
    marginBottom: vs(8),
  },
  bmiLiveRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  bmiBigValue: {
    fontSize: ms(28),
    fontWeight: '700',
    color: '#f59e0b',
    marginTop: vs(2),
  },
  bmiProgressRow: {
    marginTop: vs(6),
  },
  bmiProgressTrack: {
    height: ms(4),
    borderRadius: ms(2),
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  bmiProgressFill: {
    height: ms(4),
    borderRadius: ms(2),
    backgroundColor: '#f59e0b',
  },
  bmiScaleLabels: {
    flexDirection: 'row',
    marginTop: vs(4),
  },
  derivedGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: vs(8),
  },
  derivedBox: {
    width: '33.33%',
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(10),
    backgroundColor: Colors.white,
    marginBottom: vs(0),
  },
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderValueBadge: {
    backgroundColor: Colors.tealBg,
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(10),
    marginLeft: s(8),
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(4),
    paddingHorizontal: s(2),
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: vs(8),
    gap: ms(6),
  },
  chip: {
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    backgroundColor: Colors.white,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.purpleBg,
    borderRadius: ms(10),
    padding: ms(10),
    marginTop: vs(12),
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  comparisonRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  milestoneCard: {
    borderRadius: ms(14),
    padding: ms(14),
    backgroundColor: Colors.tealBg,
    marginBottom: vs(8),
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(10),
  },
  conditionIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  tableHeaderRow: {
    flexDirection: 'row',
    paddingBottom: vs(6),
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
    marginBottom: vs(2),
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(6),
    borderBottomWidth: 0.5,
    borderBottomColor: '#f3f4f6',
  },
  tableRowHighlight: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(6),
    marginHorizontal: -ms(4),
    paddingHorizontal: ms(4),
  },
  colDate: {flex: 2.2},
  colWeight: {flex: 1.2},
  colBmi: {flex: 1},
  colChange: {flex: 1.2},
  colSource: {flex: 1.2},
  noteInput: {
    minHeight: vs(80),
    fontSize: ms(14),
    color: Colors.textPrimary,
    padding: 0,
    lineHeight: ms(20),
  },
});

export default WeightManualView;
