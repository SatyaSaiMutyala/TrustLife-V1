import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Rect, Circle as SvgCircle, Text as SvgText, Line as SvgLine} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

// ─── Constants & Data ───────────────────────────────────────────────────

const DEFAULT_GLUCOSE = 8.4;
const GLUCOSE_UNIT = 'mmol/L';

const ZONE_COLORS = {
  severeHypo: '#1e293b',
  hypo: '#dc2626',
  lowNormal: '#3b82f6',
  target: '#10b981',
  above: '#f59e0b',
  high: '#ef4444',
  veryHigh: '#7f1d1d',
};

const RANGE_SEGMENTS = [
  {color: ZONE_COLORS.severeHypo, flex: 0.8, label: '2.8 Hypo'},
  {color: ZONE_COLORS.hypo, flex: 1.1},
  {color: ZONE_COLORS.lowNormal, flex: 1.1, label: '3.9'},
  {color: ZONE_COLORS.target, flex: 3, label: '7.0 Target'},
  {color: ZONE_COLORS.above, flex: 3, label: '10.0 PP limit'},
  {color: ZONE_COLORS.high, flex: 4, label: '14'},
  {color: ZONE_COLORS.veryHigh, flex: 8, label: '22'},
];

const TREND_OPTIONS = [
  {label: 'Falling fast', icon: 'arrow-down'},
  {label: 'Falling', icon: 'trending-down'},
  {label: 'Stable', icon: 'remove-outline'},
  {label: 'Rising', icon: 'trending-up'},
  {label: 'Rising fast', icon: 'arrow-up'},
];

const SLIDER_LABELS = [2.8, 3.9, 5.0, 7.0, 10, 14, 22, 30];

const SLIDER_SEGMENTS = [
  {color: ZONE_COLORS.severeHypo, flex: 1.1},
  {color: ZONE_COLORS.hypo, flex: 1.1},
  {color: ZONE_COLORS.lowNormal, flex: 1.1},
  {color: ZONE_COLORS.target, flex: 3},
  {color: ZONE_COLORS.above, flex: 3},
  {color: ZONE_COLORS.high, flex: 4},
  {color: ZONE_COLORS.veryHigh, flex: 8},
  {color: '#4a0f0f', flex: 8},
];

const MEAL_OPTIONS = [
  {id: 'fasting', name: 'Fasting', icon: 'moon-outline', desc: '8+ hours', target: '<7.0', badgeBg: Colors.tealBg, badgeColor: Colors.tealText},
  {id: 'before', name: 'Before meal', icon: 'restaurant-outline', desc: 'About to eat', target: '4.4\u20137.2', badgeBg: Colors.blueBg, badgeColor: Colors.blueText},
  {id: '1h_after', name: '1h after meal', icon: 'time-outline', desc: '~60 min post-meal', target: '<10.0', badgeBg: Colors.amberBg, badgeColor: Colors.amberText},
  {id: '2h_after', name: '2h after meal', icon: 'checkmark-circle-outline', desc: 'Standard post-prandial', target: '<8.5', badgeBg: Colors.tealBg, badgeColor: Colors.tealText},
];

const MEAL_SCALE_LABELS = ['Just eaten', '1h', '2h PP', '4h', '6h', '8h', 'Fasting'];

const ACTIVITY_TAGS = [
  'Took Metformin', 'Missed PM Metformin', 'Morning routine', 'Poor sleep',
  'Stressed', 'Post-exercise', 'After walk', 'Feeling unwell',
  'Caffeine', 'Alcohol', 'Insulin taken', 'At clinic',
  'Hot weather', 'Rested well',
];

const SYMPTOM_TAGS = [
  'Fatigue', 'Excessive thirst', 'Frequent urination', 'Dizziness',
  'Shakiness', 'Confusion', 'Sweating', 'Nausea',
  'Headache', 'Blurred vision', 'Palpitations', 'No symptoms',
];

const COMPARISON_ROWS = [
  {label: 'Yesterday fasting', prev: '8.8', curr: '8.4', delta: '\u2193', deltaColor: Colors.tealText, note: ''},
  {label: '7-day fasting avg', prev: '8.6', curr: '8.4', delta: '\u2193', deltaColor: Colors.tealText, note: ''},
  {label: 'This month avg', prev: '8.5', curr: '', delta: '', deltaColor: Colors.textSecondary, note: 'Similar'},
  {label: 'Fasting target', prev: '<7.0', curr: '', delta: '', deltaColor: Colors.redText, note: '+1.4 above'},
  {label: 'Best fasting this month', prev: '6.8', curr: '', delta: '', deltaColor: Colors.tealText, note: 'Mar 20 \u00b7 walk PM'},
];

const TARGET_ROWS = [
  {label: 'Fasting', current: '8.4', currentColor: Colors.amberText, target: '<7.0'},
  {label: 'Pre-meal', current: '\u2014', currentColor: Colors.textTertiary, target: '4.4\u20137.2'},
  {label: '2h post-meal', current: '\u2014', currentColor: Colors.textTertiary, target: '<8.5'},
  {label: 'Bedtime', current: '\u2014', currentColor: Colors.textTertiary, target: '6.0\u20138.0'},
  {label: 'HbA1c', current: '7.8%', currentColor: Colors.amberText, target: '<7.0%'},
];

const INSULIN_ROWS = [
  {name: 'Basal insulin', desc: 'Not currently prescribed'},
  {name: 'Bolus insulin', desc: 'Not currently prescribed'},
];

// ─── Glucose Range Track Bar ────────────────────────────────────────────

const GlucoseRangeBar = ({glucoseVal}) => {
  const barWidth = 280;
  const totalFlex = RANGE_SEGMENTS.reduce((a, b) => a + b.flex, 0);
  const minVal = 2.8;
  const maxVal = 22;
  const markerFraction = (glucoseVal - minVal) / (maxVal - minVal);
  const markerPos = markerFraction * barWidth;

  return (
    <View>
      <Svg width={ms(barWidth)} height={ms(24)} viewBox={`0 0 ${barWidth} 24`}>
        {RANGE_SEGMENTS.reduce((acc, seg, i) => {
          const prevWidth = acc.offset;
          const w = (seg.flex / totalFlex) * barWidth;
          acc.elements.push(
            <Rect key={i} x={prevWidth} y={8} width={w} height={8} rx={i === 0 ? 4 : 0} ry={i === RANGE_SEGMENTS.length - 1 ? 4 : 0} fill={seg.color} />,
          );
          acc.offset += w;
          return acc;
        }, {elements: [], offset: 0}).elements}
        <SvgCircle cx={markerPos} cy={12} r={5} fill={Colors.white} stroke={Colors.amber} strokeWidth={2} />
      </Svg>
      <View style={styles.rangeLabels}>
        {RANGE_SEGMENTS.map((seg, i) => seg.label ? (
          <AppText key={i} variant="small" color={Colors.textTertiary} style={{position: 'absolute', left: ms((RANGE_SEGMENTS.slice(0, i).reduce((a, b) => a + b.flex, 0) / totalFlex) * barWidth) - ms(10)}}>{seg.label}</AppText>
        ) : null)}
      </View>
    </View>
  );
};

// ─── Slider Visual ──────────────────────────────────────────────────────

const GlucoseSliderBar = ({glucoseVal}) => {
  const barWidth = 280;
  const totalFlex = SLIDER_SEGMENTS.reduce((a, b) => a + b.flex, 0);
  const fillFraction = (glucoseVal - 2.8) / (30 - 2.8);
  const fillWidth = fillFraction * barWidth;

  return (
    <View>
      <Svg width={ms(barWidth)} height={ms(14)} viewBox={`0 0 ${barWidth} 14`}>
        <Rect x={0} y={3} width={barWidth} height={8} rx={4} fill="#e5e7eb" />
        {SLIDER_SEGMENTS.reduce((acc, seg, i) => {
          const prevWidth = acc.offset;
          const w = (seg.flex / totalFlex) * barWidth;
          const clippedW = Math.min(w, Math.max(0, fillWidth - prevWidth));
          if (clippedW > 0) {
            acc.elements.push(
              <Rect key={i} x={prevWidth} y={3} width={clippedW} height={8} rx={i === 0 ? 4 : 0} fill={seg.color} />,
            );
          }
          acc.offset += w;
          return acc;
        }, {elements: [], offset: 0}).elements}
        <SvgCircle cx={fillWidth} cy={7} r={6} fill={Colors.white} stroke={Colors.amber} strokeWidth={2} />
      </Svg>
      <View style={styles.sliderLabels}>
        {SLIDER_LABELS.map((l, i) => (
          <AppText key={i} variant="small" color={Colors.textTertiary}>{l}</AppText>
        ))}
      </View>
    </View>
  );
};

// ─── Meal Time Scale Bar ────────────────────────────────────────────────

const MealTimeScaleBar = () => {
  const barWidth = 280;
  // Fasting = rightmost position
  const fillFraction = 1.0;
  const fillWidth = fillFraction * barWidth;

  return (
    <View>
      <Svg width={ms(barWidth)} height={ms(14)} viewBox={`0 0 ${barWidth} 14`}>
        <Rect x={0} y={3} width={barWidth} height={8} rx={4} fill="#e5e7eb" />
        <Rect x={0} y={3} width={fillWidth} height={8} rx={4} fill={Colors.teal} />
        <SvgCircle cx={fillWidth} cy={7} r={6} fill={Colors.white} stroke={Colors.teal} strokeWidth={2} />
      </Svg>
      <View style={styles.sliderLabels}>
        {MEAL_SCALE_LABELS.map((l, i) => (
          <AppText key={i} variant="small" color={Colors.textTertiary}>{l}</AppText>
        ))}
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

const GlucoseManualView = () => {
  const [glucoseVal, setGlucoseVal] = useState(DEFAULT_GLUCOSE);
  const [activeTrend, setActiveTrend] = useState('Stable');
  const [activeMeal, setActiveMeal] = useState('fasting');
  const [selectedActivities, setSelectedActivities] = useState(['Took Metformin']);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [notes, setNotes] = useState('');

  // Numpad modal
  const [numpadVisible, setNumpadVisible] = useState(false);
  const [numpadVal, setNumpadVal] = useState('');

  const openGlcNumpad = () => {
    setNumpadVal('');
    setNumpadVisible(true);
  };

  const npPress = (d) => {
    setNumpadVal(prev => {
      // Allow decimal: max format XX.X (5 chars including dot)
      if (d === '.' && prev.includes('.')) return prev;
      if (prev.includes('.') && prev.split('.')[1].length >= 1) return prev;
      if (!prev.includes('.') && prev.replace('.', '').length >= 2 && d !== '.') return prev;
      return prev + d;
    });
  };

  const npDel = () => setNumpadVal(prev => prev.slice(0, -1));

  const npConfirm = () => {
    const raw = numpadVal || String(glucoseVal);
    const val = parseFloat(raw);
    if (!isNaN(val) && val >= 1.0 && val <= 30.0) {
      setGlucoseVal(Math.round(val * 10) / 10);
      setNumpadVisible(false);
    }
  };

  const toggleTag = (tag, list, setter) => {
    setter(list.includes(tag) ? list.filter(t => t !== tag) : [...list, tag]);
  };

  return (
    <View style={styles.container}>

      {/* ── 1. Glucose Display ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>BLOOD GLUCOSE READING</AppText>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.glcDisplayTap}
          activeOpacity={0.6}
          onPress={openGlcNumpad}>
          <AppText style={styles.bigNumber} numberOfLines={1} adjustsFontSizeToFit>
            {glucoseVal.toFixed(1)}
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary}>{GLUCOSE_UNIT}</AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(4)}}>
            Tap to type directly
          </AppText>
        </TouchableOpacity>

        <View style={{alignItems: 'center', marginTop: vs(8)}}>
          <GlucoseRangeBar glucoseVal={glucoseVal} />
          <View style={{height: vs(16)}} />
        </View>

        {/* Trend Arrows */}
        <View style={styles.trendRow}>
          {TREND_OPTIONS.map(opt => {
            const isActive = activeTrend === opt.label;
            return (
              <TouchableOpacity
                key={opt.label}
                style={[styles.trendChip, isActive && styles.trendChipActive]}
                onPress={() => setActiveTrend(opt.label)}>
                <Icon name={opt.icon} size={ms(16)} color={isActive ? Colors.white : Colors.textSecondary} />
                <AppText variant="small" color={isActive ? Colors.white : Colors.textSecondary} style={{marginTop: vs(2)}}>
                  {opt.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── 2. Slider ── */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <AppText variant="bodyBold">Blood glucose</AppText>
          <View style={[styles.badge, {backgroundColor: Colors.amberBg}]}>
            <AppText variant="small" color={Colors.amberText}>{glucoseVal.toFixed(1)} {GLUCOSE_UNIT}</AppText>
          </View>
        </View>
        <View style={{alignItems: 'center', marginTop: vs(10)}}>
          <GlucoseSliderBar glucoseVal={glucoseVal} />
        </View>
      </View>

      {/* ── 3. Derived Values ── */}
      <View style={styles.derivedRow}>
        <View style={styles.derivedCol}>
          <AppText variant="small" color={Colors.textSecondary}>mg/dL equiv</AppText>
          <AppText variant="bodyBold">151</AppText>
        </View>
        <View style={styles.derivedCol}>
          <AppText variant="small" color={Colors.textSecondary}>vs Target</AppText>
          <AppText variant="bodyBold" color={Colors.amberText}>+1.4</AppText>
        </View>
        <View style={styles.derivedCol}>
          <AppText variant="small" color={Colors.textSecondary}>eHbA1c</AppText>
          <AppText variant="bodyBold" color={Colors.amberText}>7.8%</AppText>
        </View>
        <View style={styles.derivedCol}>
          <AppText variant="small" color={Colors.textSecondary}>vs Last</AppText>
          <AppText variant="bodyBold" color={Colors.tealText}>{'\u2212'}0.4</AppText>
        </View>
      </View>

      {/* ── 4. Meal Context ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>MEAL CONTEXT</AppText>
      <View style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>When did you last eat?</AppText>
        <View style={styles.mealGrid}>
          {MEAL_OPTIONS.map(opt => {
            const isActive = activeMeal === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[styles.mealCard, isActive && styles.mealCardActive]}
                onPress={() => setActiveMeal(opt.id)}>
                <Icon name={opt.icon} size={ms(20)} color={isActive ? Colors.primary : Colors.textSecondary} />
                <AppText variant="bodyBold" style={{marginTop: vs(4)}} color={isActive ? Colors.primary : Colors.textPrimary}>
                  {opt.name}
                </AppText>
                <AppText variant="small" color={Colors.textTertiary}>{opt.desc}</AppText>
                <View style={[styles.badge, {backgroundColor: opt.badgeBg, marginTop: vs(4)}]}>
                  <AppText variant="small" color={opt.badgeColor}>{opt.target}</AppText>
                </View>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Time since meal display */}
        <View style={{marginTop: vs(12)}}>
          <AppText variant="body" color={Colors.textPrimary}>Fasting (8+ hrs)</AppText>
          <View style={{alignItems: 'center', marginTop: vs(6)}}>
            <MealTimeScaleBar />
          </View>
        </View>
      </View>

      {/* ── 5. Last Meal Link ── */}
      <View style={styles.card}>
        <View style={styles.rowBetween}>
          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
            <Icon name="restaurant-outline" size={ms(18)} color={Colors.textSecondary} />
            <View style={{marginLeft: s(8), flex: 1}}>
              <AppText variant="bodyBold">Dinner {'\u00b7'} 23 Mar {'\u00b7'} 8:14 PM</AppText>
              <AppText variant="small" color={Colors.textSecondary}>
                Rice (1 cup) {'\u00b7'} Dal {'\u00b7'} Sabzi {'\u00b7'} 68g carbs {'\u00b7'} High GI
              </AppText>
            </View>
          </View>
          <TouchableOpacity>
            <AppText variant="bodyBold" color={Colors.primary}>Edit</AppText>
          </TouchableOpacity>
        </View>
      </View>
      <View style={styles.insightAmber}>
        <AppText variant="small" color={Colors.amberText}>
          Last night's dinner was high GI... white rice correlates with +1.2 mmol/L higher fasting (r=0.71)
        </AppText>
      </View>

      {/* ── 6. Activity Context ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>ACTIVITY CONTEXT</AppText>
      <View style={styles.tagWrap}>
        {ACTIVITY_TAGS.map(tag => {
          const isActive = selectedActivities.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, isActive && styles.tagActive]}
              onPress={() => toggleTag(tag, selectedActivities, setSelectedActivities)}>
              <AppText variant="small" color={isActive ? Colors.white : Colors.textSecondary}>{tag}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── 7. Symptoms ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>SYMPTOMS</AppText>
      <View style={styles.tagWrap}>
        {SYMPTOM_TAGS.map(tag => {
          const isActive = selectedSymptoms.includes(tag);
          const isNoSymptoms = tag === 'No symptoms';
          return (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tag,
                isActive && styles.tagActive,
                isNoSymptoms && !isActive && styles.tagNoSymptoms,
                isNoSymptoms && isActive && styles.tagNoSymptomsActive,
              ]}
              onPress={() => toggleTag(tag, selectedSymptoms, setSelectedSymptoms)}>
              <AppText variant="small" color={isActive ? Colors.white : isNoSymptoms ? Colors.tealText : Colors.textSecondary}>
                {tag}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── 8. Ketones ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>KETONES</AppText>
      <AppText variant="small" color={Colors.textTertiary} style={{marginBottom: vs(6)}}>
        Optional {'\u00b7'} Relevant when glucose {'>'} 14
      </AppText>
      <View style={styles.derivedRow}>
        <View style={styles.derivedCol}>
          <AppText variant="small" color={Colors.textSecondary}>Blood ketones</AppText>
          <AppText variant="bodyBold">{'\u2014'}</AppText>
          <AppText variant="small" color={Colors.textTertiary}>Not tested</AppText>
        </View>
        <View style={styles.derivedCol}>
          <AppText variant="small" color={Colors.textSecondary}>Urine ketones</AppText>
          <AppText variant="bodyBold">{'\u2014'}</AppText>
          <AppText variant="small" color={Colors.textTertiary}>Not tested</AppText>
        </View>
        <View style={styles.derivedCol}>
          <AppText variant="small" color={Colors.textSecondary}>DKA risk</AppText>
          <AppText variant="bodyBold" color={Colors.tealText}>Low</AppText>
          <AppText variant="small" color={Colors.textTertiary}>T2DM {'\u00b7'} on Metformin</AppText>
        </View>
      </View>

      {/* ── 9. Metformin Insight ── */}
      <View style={styles.insightBlue}>
        <AppText variant="small" color={Colors.blueText}>
          Metformin and fasting glucose connection... PM dose adherence 71%... each missed dose adds +0.8{'\u2013'}1.2 mmol/L
        </AppText>
      </View>

      {/* ── 10. Comparison ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>HOW THIS COMPARES</AppText>
      <View style={styles.card}>
        {COMPARISON_ROWS.map((row, i) => (
          <View key={i} style={[styles.comparisonRow, i < COMPARISON_ROWS.length - 1 && styles.comparisonBorder]}>
            <AppText variant="body" color={Colors.textSecondary} style={{flex: 1}}>{row.label}</AppText>
            <AppText variant="bodyBold" style={{width: s(40), textAlign: 'center'}}>{row.prev}</AppText>
            {row.curr ? (
              <View style={{flexDirection: 'row', alignItems: 'center', width: s(80), justifyContent: 'flex-end'}}>
                <AppText variant="body" color={Colors.textTertiary}> {'\u2192'} </AppText>
                <AppText variant="bodyBold">{row.curr}</AppText>
                <AppText variant="small" color={row.deltaColor} style={{marginLeft: s(4)}}>{row.delta}</AppText>
              </View>
            ) : (
              <View style={{width: s(80), alignItems: 'flex-end'}}>
                <AppText variant="small" color={row.deltaColor}>{row.note}</AppText>
              </View>
            )}
          </View>
        ))}
      </View>

      {/* ── 11. Glucose Targets ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>YOUR GLUCOSE TARGETS {'\u00b7'} DR. KAVITHA</AppText>
      <View style={styles.card}>
        {TARGET_ROWS.map((row, i) => (
          <View key={i} style={[styles.comparisonRow, i < TARGET_ROWS.length - 1 && styles.comparisonBorder]}>
            <AppText variant="body" color={Colors.textSecondary} style={{flex: 1}}>{row.label}</AppText>
            <AppText variant="bodyBold" color={row.currentColor} style={{width: s(50), textAlign: 'center'}}>
              {row.current}
            </AppText>
            <AppText variant="body" color={Colors.textTertiary} style={{width: s(60), textAlign: 'right'}}>
              {row.target}
            </AppText>
          </View>
        ))}
      </View>

      {/* ── 12. Insulin Log ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>INSULIN LOG</AppText>
      <AppText variant="small" color={Colors.textTertiary} style={{marginBottom: vs(6)}}>Optional</AppText>
      <View style={styles.card}>
        {INSULIN_ROWS.map((row, i) => (
          <View key={i} style={[styles.comparisonRow, i < INSULIN_ROWS.length - 1 && styles.comparisonBorder]}>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold">{row.name}</AppText>
              <AppText variant="small" color={Colors.textTertiary}>{row.desc}</AppText>
            </View>
            <TouchableOpacity>
              <AppText variant="bodyBold" color={Colors.primary}>+ Log</AppText>
            </TouchableOpacity>
          </View>
        ))}
        <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(8)}}>
          Priya is on oral medication only (Metformin). No insulin prescribed.
        </AppText>
      </View>

      {/* ── 13. Notes ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>NOTE</AppText>
      <View style={styles.card}>
        <TextInput
          style={styles.notesInput}
          placeholder="Add notes about this reading..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          value={notes}
          onChangeText={setNotes}
        />
      </View>

      {/* ── Numpad Bottom Modal ── */}
      <Modal
        visible={numpadVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNumpadVisible(false)}>
        <Pressable style={styles.numpadOverlay} onPress={() => setNumpadVisible(false)}>
          <Pressable style={styles.numpadSheet} onPress={e => e.stopPropagation()}>
            <View style={styles.numpadHeader}>
              <AppText variant="bodyBold">Blood glucose</AppText>
              <TouchableOpacity onPress={() => setNumpadVisible(false)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Icon family="Ionicons" name="close" size={ms(22)} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={styles.numpadDisplay}>
              <AppText style={[styles.numpadValue, !numpadVal && {color: Colors.textTertiary}]}>
                {numpadVal || glucoseVal.toFixed(1)}
              </AppText>
              {!numpadVal && (
                <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
                  Type a new value
                </AppText>
              )}
            </View>

            <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center', marginTop: vs(4)}}>
              Fasting target: {'<'}7.0 {'\u00b7'} Range: 1.0{'\u2013'}30.0 mmol/L
            </AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(2), marginBottom: vs(8)}}>
              Use decimal point for 0.1 precision
            </AppText>

            <View style={styles.numpadGrid}>
              {['1','2','3','4','5','6','7','8','9'].map(d => (
                <TouchableOpacity key={d} style={styles.npBtn} onPress={() => npPress(d)} activeOpacity={0.6}>
                  <AppText style={styles.npBtnText}>{d}</AppText>
                </TouchableOpacity>
              ))}
              {/* 4th row: OK | 0 | Backspace */}
              <TouchableOpacity style={styles.npBtnOk} onPress={npConfirm} activeOpacity={0.7}>
                <View style={styles.npBtnOkInner}>
                  <Icon family="Ionicons" name="checkmark-circle" size={ms(22)} color={Colors.white} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={styles.npBtn} onPress={() => npPress('0')} activeOpacity={0.6}>
                <AppText style={styles.npBtnText}>0</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.npBtn} onPress={npDel} activeOpacity={0.6}>
                <Icon family="Ionicons" name="backspace-outline" size={ms(22)} color={Colors.textSecondary} />
              </TouchableOpacity>
              {/* Decimal point row */}
              <TouchableOpacity style={styles.npBtn} onPress={() => npPress('.')} activeOpacity={0.6}>
                <AppText style={styles.npBtnText}>{'\u00b7'}</AppText>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>

    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingVertical: vs(6),
  },
  sectionHeading: {
    marginTop: vs(16),
    marginBottom: vs(8),
  },
  card: {
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: vs(8),
  },
  bigNumber: {
    fontSize: ms(26),
    fontWeight: '700',
    color: Colors.amber,
    lineHeight: ms(32),
  },
  glcDisplayTap: {
    alignItems: 'center',
    paddingVertical: vs(10),
    paddingHorizontal: s(10),
    backgroundColor: '#f9fafb',
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  rangeLabels: {
    position: 'relative',
    height: vs(16),
    marginTop: vs(2),
  },
  trendRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(10),
  },
  trendChip: {
    alignItems: 'center',
    paddingVertical: vs(6),
    paddingHorizontal: s(8),
    borderRadius: ms(8),
    backgroundColor: '#f3f4f6',
  },
  trendChipActive: {
    backgroundColor: Colors.primary,
  },
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  badge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(4),
    width: '100%',
  },
  derivedRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: vs(8),
  },
  derivedCol: {
    flex: 1,
    alignItems: 'center',
  },
  mealGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(8),
  },
  mealCard: {
    width: '48%',
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(10),
    padding: ms(10),
    alignItems: 'center',
  },
  mealCardActive: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    backgroundColor: Colors.tealBg,
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(6),
    marginBottom: vs(8),
  },
  tag: {
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: ms(8),
    backgroundColor: '#f3f4f6',
  },
  tagActive: {
    backgroundColor: Colors.primary,
  },
  tagNoSymptoms: {
    backgroundColor: Colors.tealBg,
  },
  tagNoSymptomsActive: {
    backgroundColor: Colors.teal,
  },
  insightAmber: {
    backgroundColor: Colors.amberBg,
    borderRadius: ms(10),
    padding: ms(12),
    marginBottom: vs(8),
  },
  insightBlue: {
    backgroundColor: Colors.blueBg,
    borderRadius: ms(10),
    padding: ms(12),
    marginBottom: vs(8),
  },
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  comparisonBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  notesInput: {
    minHeight: vs(80),
    textAlignVertical: 'top',
    fontSize: ms(14),
    color: Colors.textPrimary,
  },

  // ── Numpad Modal ──
  numpadOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  numpadSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: ms(22),
    borderTopRightRadius: ms(22),
    paddingBottom: vs(28),
  },
  numpadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingVertical: vs(14),
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  numpadDisplay: {
    alignItems: 'center',
    paddingVertical: vs(10),
    paddingHorizontal: s(20),
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  numpadValue: {
    fontSize: ms(28),
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 4,
    lineHeight: ms(34),
  },
  numpadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: s(16),
    paddingTop: vs(8),
  },
  npBtn: {
    width: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(14),
  },
  npBtnText: {
    fontSize: ms(20),
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  npBtnOk: {
    width: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(12),
  },
  npBtnOkInner: {
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(10),
    paddingHorizontal: s(18),
  },
});

export default GlucoseManualView;
