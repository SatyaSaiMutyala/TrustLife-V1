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
import Svg, {Rect, Circle as SvgCircle} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

// ─── Constants & Data ───────────────────────────────────────────────────

const HR_RANGE_ZONES = [
  {color: '#3b82f6', flex: 1},   // very low  30-50
  {color: '#60a5fa', flex: 0.7}, // low       50-60
  {color: '#10b981', flex: 1.3}, // normal    60-100
  {color: '#f59e0b', flex: 1.3}, // elevated  100-120
  {color: '#ef4444', flex: 4},   // tachy     120-180
];

const HR_RANGE_LABELS = ['30', '50', '60\u2713', '80', '100\u2713', '120', '180'];

const SLIDER_ZONES = [
  {color: '#3b82f6', flex: 1.5}, // very low
  {color: '#60a5fa', flex: 1},   // low
  {color: '#10b981', flex: 2},   // normal
  {color: '#f59e0b', flex: 1},   // elevated
  {color: '#ef4444', flex: 2.5}, // tachy
];

const SLIDER_LABELS = [30, 60, 80, 100, 120, 150, 200, 220];

const METHOD_CHIPS = ['Wrist device', 'Pulse oximeter', 'Manual count', 'BP monitor', 'Camera PPG'];
const DURATION_CHIPS = ['15 seconds', '30 seconds', '1 minute', '5 minutes', 'Continuous'];

const CONTEXT_TAGS = [
  '5+ min rest', 'Morning reading', 'Caffeine', 'Light walking',
  'Post-exercise', 'Stressed', 'Feeling unwell', 'After medication',
  'After meal', 'Hot environment', 'Just woken up', 'After meditation',
];

const SYMPTOM_TAGS = [
  'Palpitations', 'Skipping beats', 'Racing heart', 'Dizziness',
  'Breathlessness', 'Chest tightness', 'Fluttering sensation',
  'Light-headed', 'No symptoms',
];

const RHYTHM_CHIPS = ['Regular', 'Mostly regular', 'Irregular/skipping', 'Not sure'];

const COMPARISON_ROWS = [
  {label: 'Last reading (yesterday)', prev: '74', curr: '72', delta: '\u2193', deltaColor: Colors.tealText},
  {label: '7-day resting avg', prev: '76', curr: '72', delta: '\u2193', deltaColor: Colors.tealText},
  {label: '30-day resting avg', prev: '75', curr: '72', delta: '\u2193', deltaColor: Colors.tealText},
  {label: 'Optimal resting range', prev: '60\u201380', curr: 'In range', delta: '\u2713', deltaColor: Colors.tealText},
];

// ─── Slider Bar Component ───────────────────────────────────────────────

const HRSliderBar = ({zones, value, min, max, markerColor}) => {
  const barWidth = 280;
  const totalFlex = zones.reduce((a, b) => a + b.flex, 0);
  const fillFraction = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const fillPos = fillFraction * barWidth;

  return (
    <Svg width={ms(barWidth)} height={ms(14)} viewBox={`0 0 ${barWidth} 14`}>
      <Rect x={0} y={3} width={barWidth} height={8} rx={4} fill="#e5e7eb" />
      {zones.reduce((acc, seg, i) => {
        const prevWidth = acc.offset;
        const w = (seg.flex / totalFlex) * barWidth;
        const clippedW = Math.min(w, Math.max(0, fillPos - prevWidth));
        if (clippedW > 0) {
          acc.elements.push(
            <Rect key={i} x={prevWidth} y={3} width={clippedW} height={8} rx={i === 0 ? 4 : 0} fill={seg.color} />,
          );
        }
        acc.offset += w;
        return acc;
      }, {elements: [], offset: 0}).elements}
      <SvgCircle cx={fillPos} cy={7} r={6} fill={Colors.white} stroke={markerColor} strokeWidth={2} />
    </Svg>
  );
};

// ─── Range Track Bar (for HR Display card) ──────────────────────────────

const HRRangeBar = ({value}) => {
  const barWidth = 280;
  const min = 30;
  const max = 180;
  const totalFlex = HR_RANGE_ZONES.reduce((a, b) => a + b.flex, 0);
  const fraction = Math.max(0, Math.min(1, (value - min) / (max - min)));
  const markerPos = fraction * barWidth;

  let markerColor = '#10b981';
  if (value < 50) markerColor = '#3b82f6';
  else if (value < 60) markerColor = '#60a5fa';
  else if (value <= 100) markerColor = '#10b981';
  else if (value <= 120) markerColor = '#f59e0b';
  else markerColor = '#ef4444';

  return (
    <Svg width={ms(barWidth)} height={ms(14)} viewBox={`0 0 ${barWidth} 14`}>
      {HR_RANGE_ZONES.reduce((acc, seg, i) => {
        const w = (seg.flex / totalFlex) * barWidth;
        acc.elements.push(
          <Rect key={i} x={acc.offset} y={3} width={w} height={8} rx={i === 0 ? 4 : (i === HR_RANGE_ZONES.length - 1 ? 4 : 0)} fill={seg.color} />,
        );
        acc.offset += w;
        return acc;
      }, {elements: [], offset: 0}).elements}
      <SvgCircle cx={markerPos} cy={7} r={6} fill={Colors.white} stroke={markerColor} strokeWidth={2} />
    </Svg>
  );
};

// ─── Component ──────────────────────────────────────────────────────────

const HRManualView = () => {
  const [hrVal, setHrVal] = useState(72);
  const [activeMethod, setActiveMethod] = useState('Wrist device');
  const [activeDuration, setActiveDuration] = useState('1 minute');
  const [selectedContexts, setSelectedContexts] = useState(['5+ min rest', 'Morning reading']);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [activeRhythm, setActiveRhythm] = useState('Regular');
  const [notes, setNotes] = useState('');

  // HRV values
  const [rmssd, setRmssd] = useState(35);
  const [sdnn, setSdnn] = useState(42);
  const [spo2, setSpo2] = useState(98);

  const toggleTag = (tag, list, setter) => {
    setter(list.includes(tag) ? list.filter(t => t !== tag) : [...list, tag]);
  };

  // ── Numpad modal ──
  const [numpadVisible, setNumpadVisible] = useState(false);
  const [numpadField, setNumpadField] = useState('hr');
  const [numpadVal, setNumpadVal] = useState('');

  const NUMPAD_CONFIG = {
    hr: {label: 'Heart rate', hint: 'Normal range: 60\u2013100 bpm', range: '30\u2013220 bpm', min: 30, max: 220},
    rmssd: {label: 'RMSSD', hint: 'Normal range: 20\u2013100 ms', range: '1\u2013300 ms', min: 1, max: 300},
    sdnn: {label: 'SDNN', hint: 'Normal range: 40\u2013100 ms', range: '1\u2013300 ms', min: 1, max: 300},
    spo2: {label: 'SpO\u2082', hint: 'Normal: \u226595%', range: '70\u2013100 %', min: 70, max: 100},
  };

  const openNumpad = (field) => {
    setNumpadField(field);
    setNumpadVal('');
    setNumpadVisible(true);
  };

  const currentFieldValue = () => {
    if (numpadField === 'hr') return String(hrVal);
    if (numpadField === 'rmssd') return String(rmssd);
    if (numpadField === 'sdnn') return String(sdnn);
    return String(spo2);
  };

  const npPress = (d) => {
    setNumpadVal(prev => {
      if (prev.length >= 3) return prev;
      return prev + d;
    });
  };

  const npDel = () => {
    setNumpadVal(prev => prev.slice(0, -1));
  };

  const npConfirm = () => {
    const raw = numpadVal || currentFieldValue();
    const val = parseInt(raw, 10);
    const cfg = NUMPAD_CONFIG[numpadField];
    if (!isNaN(val) && val >= cfg.min && val <= cfg.max) {
      if (numpadField === 'hr') setHrVal(val);
      else if (numpadField === 'rmssd') setRmssd(val);
      else if (numpadField === 'sdnn') setSdnn(val);
      else setSpo2(val);
      setNumpadVisible(false);
    }
  };

  // ── Derived values ──
  const getZone = () => {
    if (hrVal < 60) return {label: 'Low', color: Colors.blueText};
    if (hrVal <= 100) return {label: 'Resting', color: Colors.tealText};
    if (hrVal <= 120) return {label: 'Elevated', color: Colors.amberText};
    return {label: 'Tachy', color: Colors.redText};
  };

  const zone = getZone();
  const maxHR = 220 - 38;
  const pctMax = Math.round((hrVal / maxHR) * 100);
  const vsRestingAvg = hrVal - 76;

  // Slider marker color
  const getSliderMarkerColor = () => {
    if (hrVal < 60) return '#3b82f6';
    if (hrVal <= 100) return '#10b981';
    if (hrVal <= 120) return '#f59e0b';
    return '#ef4444';
  };

  return (
    <View style={{paddingVertical: vs(6)}}>

      {/* ── 1. Heart Rate Display ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>HEART RATE</AppText>
      <View style={styles.card}>
        <TouchableOpacity
          style={styles.hrTapArea}
          activeOpacity={0.6}
          onPress={() => openNumpad('hr')}>
          <AppText
            style={styles.hrBigNumber}
            numberOfLines={1}
            adjustsFontSizeToFit>
            {hrVal}
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            beats per minute (bpm)
          </AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(4)}}>
            Tap to type directly
          </AppText>
        </TouchableOpacity>

        {/* SVG range track bar */}
        <View style={{alignItems: 'center', marginTop: vs(10)}}>
          <HRRangeBar value={hrVal} />
        </View>
        <View style={styles.rangeLabels}>
          {HR_RANGE_LABELS.map((l, i) => (
            <AppText key={i} variant="small" color={Colors.textTertiary}>{l}</AppText>
          ))}
        </View>
      </View>

      {/* ── Numpad Bottom Modal ── */}
      <Modal
        visible={numpadVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNumpadVisible(false)}>
        <Pressable style={styles.numpadOverlay} onPress={() => setNumpadVisible(false)}>
          <Pressable style={styles.numpadSheet} onPress={e => e.stopPropagation()}>
            {/* Header */}
            <View style={styles.numpadHeader}>
              <AppText variant="bodyBold">{NUMPAD_CONFIG[numpadField]?.label}</AppText>
              <TouchableOpacity onPress={() => setNumpadVisible(false)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Icon family="Ionicons" name="close" size={ms(22)} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            {/* Display */}
            <View style={styles.numpadDisplay}>
              <AppText style={[
                styles.numpadValue,
                !numpadVal && {color: Colors.textTertiary},
              ]}>
                {numpadVal || currentFieldValue()}
              </AppText>
              {!numpadVal && (
                <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
                  Type a new value
                </AppText>
              )}
            </View>

            {/* Hint */}
            <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center', marginTop: vs(4)}}>
              {NUMPAD_CONFIG[numpadField]?.hint}
            </AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(2), marginBottom: vs(8)}}>
              {NUMPAD_CONFIG[numpadField]?.range}
            </AppText>

            {/* Numpad grid — 1-9 in 3 rows, then OK | 0 | backspace */}
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
            </View>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── 3. Slider ── */}
      <View style={styles.card}>
        <View style={styles.sliderHeader}>
          <Icon family="Ionicons" name="pulse-outline" size={ms(18)} color={Colors.primary} />
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginLeft: s(6), flex: 1}}>Heart rate</AppText>
          <View style={[styles.sliderBadge, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="caption" color={Colors.tealText} style={{fontWeight: '700'}}>
              {hrVal} bpm
            </AppText>
          </View>
        </View>
        <View style={{marginTop: vs(8), alignItems: 'center'}}>
          <HRSliderBar zones={SLIDER_ZONES} value={hrVal} min={30} max={220} markerColor={getSliderMarkerColor()} />
        </View>
        <View style={styles.sliderLabels}>
          {SLIDER_LABELS.map((l, i) => (
            <AppText key={i} variant="small" color={Colors.textTertiary}>{l}</AppText>
          ))}
        </View>
      </View>

      {/* ── 4. Derived Values ── */}
      <View style={styles.derivedRow}>
        <View style={styles.derivedBox}>
          <AppText variant="small" color={Colors.textSecondary}>Zone</AppText>
          <AppText variant="bodyBold" color={zone.color}>{zone.label}</AppText>
        </View>
        <View style={styles.derivedBox}>
          <AppText variant="small" color={Colors.textSecondary}>Max HR est.</AppText>
          <AppText variant="bodyBold" color={Colors.textSecondary}>{maxHR}</AppText>
          <AppText variant="small" color={Colors.textTertiary}>220 {'\u2212'} age 38</AppText>
        </View>
        <View style={styles.derivedBox}>
          <AppText variant="small" color={Colors.textSecondary}>% Max HR</AppText>
          <AppText variant="bodyBold" color={Colors.tealText}>{pctMax}%</AppText>
        </View>
        <View style={styles.derivedBox}>
          <AppText variant="small" color={Colors.textSecondary}>vs Resting avg</AppText>
          <AppText variant="bodyBold" color={Colors.tealText}>
            {vsRestingAvg >= 0 ? `+${vsRestingAvg}` : String(vsRestingAvg)}
          </AppText>
          <AppText variant="small" color={Colors.tealText}>bpm vs your 76</AppText>
        </View>
      </View>

      {/* ── 5. HRV Section ── */}
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: vs(18), marginBottom: vs(8)}}>
        <AppText variant="sectionTitle">HEART RATE VARIABILITY (HRV)</AppText>
        <View style={[styles.optionalBadge, {marginLeft: s(8)}]}>
          <AppText variant="small" color={Colors.textTertiary}>Optional</AppText>
        </View>
      </View>
      <View style={styles.hrvRow}>
        {/* RMSSD */}
        <TouchableOpacity style={styles.hrvBox} activeOpacity={0.6} onPress={() => openNumpad('rmssd')}>
          <AppText variant="small" color={Colors.textSecondary}>RMSSD</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginTop: vs(4)}}>{rmssd}</AppText>
          <AppText variant="small" color={Colors.textSecondary}>ms</AppText>
          <View style={[styles.hrvBadge, {backgroundColor: Colors.amberBg, marginTop: vs(6)}]}>
            <AppText variant="small" color={Colors.amberText} style={{fontWeight: '600'}}>
              Low {'\u00b7'} {'<'}40ms avg
            </AppText>
          </View>
        </TouchableOpacity>

        {/* SDNN */}
        <TouchableOpacity style={styles.hrvBox} activeOpacity={0.6} onPress={() => openNumpad('sdnn')}>
          <AppText variant="small" color={Colors.textSecondary}>SDNN</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginTop: vs(4)}}>{sdnn}</AppText>
          <AppText variant="small" color={Colors.textSecondary}>ms</AppText>
          <View style={[styles.hrvBadge, {backgroundColor: Colors.tealBg, marginTop: vs(6)}]}>
            <AppText variant="small" color={Colors.tealText} style={{fontWeight: '600'}}>
              Normal {'\u00b7'} 40{'\u2013'}100ms
            </AppText>
          </View>
        </TouchableOpacity>

        {/* SpO2 */}
        <TouchableOpacity style={styles.hrvBox} activeOpacity={0.6} onPress={() => openNumpad('spo2')}>
          <AppText variant="small" color={Colors.textSecondary}>SpO{'\u2082'}</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginTop: vs(4)}}>{spo2}</AppText>
          <AppText variant="small" color={Colors.textSecondary}>%</AppText>
          <View style={[styles.hrvBadge, {backgroundColor: Colors.tealBg, marginTop: vs(6)}]}>
            <AppText variant="small" color={Colors.tealText} style={{fontWeight: '600'}}>
              Normal {'\u2265'}95%
            </AppText>
          </View>
        </TouchableOpacity>
      </View>

      {/* HRV Insight */}
      <View style={styles.insightAmber}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(4)}}>
          <Icon family="Ionicons" name="analytics-outline" size={ms(16)} color={Colors.amberText} />
          <AppText variant="caption" color={Colors.amberText} style={{marginLeft: s(6), fontWeight: '700'}}>
            HRV Insight
          </AppText>
        </View>
        <AppText variant="caption" color={Colors.amberText} style={{lineHeight: ms(17)}}>
          HRV 35ms is below your baseline of 42ms. This may reflect recovery stress {'\u2014'} sleep was 5.9h last night (below your 7.2h average). Consider a rest day.
        </AppText>
      </View>

      {/* ── 6. Measurement Method ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>HOW DID YOU MEASURE?</AppText>
      <View style={styles.chipRow}>
        {METHOD_CHIPS.map(chip => (
          <TouchableOpacity
            key={chip}
            activeOpacity={0.7}
            onPress={() => setActiveMethod(chip)}
            style={[styles.chip, activeMethod === chip && styles.chipActive]}>
            <AppText
              variant="small"
              color={activeMethod === chip ? Colors.primary : Colors.textSecondary}
              style={{fontWeight: activeMethod === chip ? '700' : '500'}}>
              {chip}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── 7. Measurement Duration ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>MEASUREMENT DURATION</AppText>
      <View style={styles.chipRow}>
        {DURATION_CHIPS.map(chip => (
          <TouchableOpacity
            key={chip}
            activeOpacity={0.7}
            onPress={() => setActiveDuration(chip)}
            style={[styles.chip, activeDuration === chip && styles.chipActive]}>
            <AppText
              variant="small"
              color={activeDuration === chip ? Colors.primary : Colors.textSecondary}
              style={{fontWeight: activeDuration === chip ? '700' : '500'}}>
              {chip}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── 8. Activity Context ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>ACTIVITY CONTEXT</AppText>
      <View style={styles.chipRow}>
        {CONTEXT_TAGS.map(tag => (
          <TouchableOpacity
            key={tag}
            activeOpacity={0.7}
            onPress={() => toggleTag(tag, selectedContexts, setSelectedContexts)}
            style={[styles.chip, selectedContexts.includes(tag) && styles.chipActive]}>
            <AppText
              variant="small"
              color={selectedContexts.includes(tag) ? Colors.primary : Colors.textSecondary}
              style={{fontWeight: selectedContexts.includes(tag) ? '700' : '500'}}>
              {tag}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── 9. Symptoms ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>SYMPTOMS</AppText>
      <View style={styles.chipRow}>
        {SYMPTOM_TAGS.map(tag => {
          const isNoSymptoms = tag === 'No symptoms';
          const isActive = selectedSymptoms.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              activeOpacity={0.7}
              onPress={() => toggleTag(tag, selectedSymptoms, setSelectedSymptoms)}
              style={[
                styles.chip,
                isActive && !isNoSymptoms && styles.chipActive,
                isActive && isNoSymptoms && styles.chipActiveGreen,
              ]}>
              <AppText
                variant="small"
                color={isActive ? (isNoSymptoms ? Colors.tealText : Colors.primary) : Colors.textSecondary}
                style={{fontWeight: isActive ? '700' : '500'}}>
                {tag}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── 10. Rhythm Observation ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>RHYTHM {'\u2014'} DID IT FEEL REGULAR?</AppText>
      <View style={styles.chipRow}>
        {RHYTHM_CHIPS.map(chip => (
          <TouchableOpacity
            key={chip}
            activeOpacity={0.7}
            onPress={() => setActiveRhythm(chip)}
            style={[styles.chip, activeRhythm === chip && styles.chipActive]}>
            <AppText
              variant="small"
              color={activeRhythm === chip ? Colors.primary : Colors.textSecondary}
              style={{fontWeight: activeRhythm === chip ? '700' : '500'}}>
              {chip}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── 11. Comparison ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>HOW THIS COMPARES</AppText>
      <View style={styles.card}>
        {COMPARISON_ROWS.map((row, i) => (
          <View
            key={i}
            style={[styles.compareRow, i < COMPARISON_ROWS.length - 1 && styles.compareRowBorder]}>
            <AppText variant="body" color={Colors.textSecondary} style={{flex: 1.5}}>{row.label}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{width: s(45), textAlign: 'right'}}>{row.prev}</AppText>
            <Icon family="Ionicons" name="arrow-forward-outline" size={ms(12)} color={Colors.textTertiary} style={{marginHorizontal: s(6)}} />
            <AppText variant="bodyBold" color={row.deltaColor} style={{width: s(55), textAlign: 'right'}}>
              {row.curr}
            </AppText>
            {row.delta ? (
              <AppText variant="small" color={row.deltaColor} style={{width: s(20), textAlign: 'right'}}>
                {row.delta}
              </AppText>
            ) : (
              <View style={{width: s(20)}} />
            )}
          </View>
        ))}
      </View>

      {/* ── 12. HR + BP Insight ── */}
      <View style={styles.insightBlue}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(4)}}>
          <Icon family="Ionicons" name="heart-circle-outline" size={ms(16)} color={Colors.blueText} />
          <AppText variant="caption" color={Colors.blueText} style={{marginLeft: s(6), fontWeight: '700'}}>
            HR + BP Combined Insight
          </AppText>
        </View>
        <AppText variant="caption" color={Colors.blueText} style={{lineHeight: ms(17)}}>
          HR + BP combined reading: Today{'\u2019'}s BP 140/90 + HR {hrVal} = double product {(140 * hrVal).toLocaleString()}. Normal at rest {'<'}12,000. This suggests your cardiovascular workload is within acceptable range at rest.
        </AppText>
      </View>

      {/* ── 13. Notes ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>NOTE</AppText>
      <View style={styles.card}>
        <TextInput
          style={styles.textInput}
          placeholder="Add notes about this reading..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const styles = StyleSheet.create({
  sectionHeading: {
    marginTop: vs(18),
    marginBottom: vs(8),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: s(12),
    marginBottom: vs(10),
  },

  // 1. HR Display
  hrTapArea: {
    alignItems: 'center',
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    borderRadius: ms(10),
    backgroundColor: '#f9fafb',
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  hrBigNumber: {
    fontSize: ms(26),
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: ms(32),
    marginBottom: vs(4),
  },
  rangeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(4),
    paddingHorizontal: s(2),
  },

  // 3. Slider
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sliderBadge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(12),
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(4),
    paddingHorizontal: s(2),
  },

  // 4. Derived values
  derivedRow: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(10),
  },
  derivedBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(10),
    alignItems: 'center',
  },

  // 5. HRV
  optionalBadge: {
    backgroundColor: '#f3f4f6',
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  hrvRow: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(10),
  },
  hrvBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(10),
    alignItems: 'center',
  },
  hrvBadge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
    alignSelf: 'center',
  },
  insightAmber: {
    backgroundColor: Colors.amberBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginBottom: vs(10),
  },
  insightBlue: {
    backgroundColor: Colors.blueBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginBottom: vs(10),
  },

  // Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginBottom: vs(10),
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
    backgroundColor: Colors.tealBg,
    borderColor: Colors.primary,
  },
  chipActiveGreen: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.tealText,
  },

  // 11. Comparison
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  compareRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },

  // 13. Notes
  textInput: {
    fontSize: ms(14),
    color: Colors.textPrimary,
    minHeight: vs(80),
    textAlignVertical: 'top',
    padding: 0,
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

export default HRManualView;
