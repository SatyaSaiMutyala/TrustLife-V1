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

const SLIDER_ZONES = {
  systolic: [
    {color: '#3b82f6', flex: 2},   // <120 optimal
    {color: '#f59e0b', flex: 0.5},  // 120-130 elevated
    {color: '#f97316', flex: 0.5},  // 130-140 stage 1
    {color: '#ef4444', flex: 1},    // 140-160 stage 2
    {color: '#991b1b', flex: 2},    // 160-220 crisis
  ],
  diastolic: [
    {color: '#3b82f6', flex: 2},    // <80 optimal
    {color: '#f59e0b', flex: 0.5},  // 80-90 elevated
    {color: '#f97316', flex: 1.5},  // 90-120 high
    {color: '#ef4444', flex: 1},    // 120-140 crisis
  ],
  pulse: [
    {color: '#3b82f6', flex: 1.5},  // <60 low
    {color: '#10b981', flex: 2},    // 60-100 normal
    {color: '#f97316', flex: 4},    // 100-180 high
  ],
};

const SYS_LABELS = [70, 120, 130, 140, 160, 180, 220];
const DIA_LABELS = [40, 80, 90, 120, 140];
const PULSE_LABELS = [30, 60, 78, 100, 180];

const ARM_CHIPS = ['Right arm', 'Left arm'];
const POSITION_CHIPS = ['Sitting', 'Standing', 'Lying down'];
const MED_TIMING_CHIPS = ['Before Amlodipine', 'After Amlodipine', 'Missed today\'s dose'];
const LOCATION_CHIPS = ['Home', 'Clinic/hospital', 'Work', 'Other'];

const CONTEXT_TAGS = [
  'Rested 5+ min', 'Morning routine', 'Had caffeine', 'Post-walk',
  'Post-exercise', 'Stressed', 'Anxious', 'After meal', 'Had alcohol',
  'Smoked recently', 'Just woken up', 'Late night', 'Feeling unwell',
  'During conversation', 'After meditation', 'In hot weather',
];

const SYMPTOM_TAGS = [
  'Headache', 'Dizziness', 'Palpitations', 'Breathlessness',
  'Visual changes', 'Nausea', 'Ankle swelling', 'Chest tightness',
  'Flushing', 'No symptoms',
];

const COMPARISON_ROWS = [
  {label: 'Last reading (23 Mar AM)', prev: '142/91', curr: '140/90', delta: '\u2193', deltaColor: Colors.tealText},
  {label: '7-day home average', prev: '136/86', curr: '140/90', delta: '\u2191', deltaColor: Colors.amberText},
  {label: 'This month average', prev: '138/88', curr: '+2/+2', delta: '', deltaColor: Colors.amberText},
  {label: 'Target', prev: '<130/80', curr: '\u221210/\u221210', delta: '', deltaColor: Colors.redText},
];

const HBPM_STEPS = [
  'Sit quietly 5 minutes',
  'Take 2 readings, 1 minute apart',
  'Morning: before medication \u00b7 Evening: before bed',
  'Repeat for 7 days before appointment (Apr 4)',
  'Dr. Kavitha uses 7-day average',
];

// ─── Slider Bar Component ───────────────────────────────────────────────

const BPSliderBar = ({zones, value, min, max, markerColor}) => {
  const barWidth = 280;
  const totalFlex = zones.reduce((a, b) => a + b.flex, 0);
  const fillFraction = (value - min) / (max - min);
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

// ─── Component ──────────────────────────────────────────────────────────

const BPManualView = () => {
  const [activeArm, setActiveArm] = useState('Right arm');
  const [activePosition, setActivePosition] = useState('Sitting');
  const [activeMedTiming, setActiveMedTiming] = useState('Before Amlodipine');
  const [activeLocation, setActiveLocation] = useState('Home');
  const [selectedContexts, setSelectedContexts] = useState(['Rested 5+ min', 'Morning routine']);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [notes, setNotes] = useState('');

  const toggleTag = (tag, list, setter) => {
    setter(list.includes(tag) ? list.filter(t => t !== tag) : [...list, tag]);
  };

  // BP values
  const [systolic, setSystolic] = useState(140);
  const [diastolic, setDiastolic] = useState(90);
  const [pulse, setPulse] = useState(78);
  const showCrisis = systolic >= 180 || diastolic >= 120;

  // Numpad modal
  const [numpadVisible, setNumpadVisible] = useState(false);
  const [numpadField, setNumpadField] = useState('sys');
  const [numpadVal, setNumpadVal] = useState('');

  const NUMPAD_CONFIG = {
    sys: {label: 'Systolic BP', hint: 'Normal: <120 · Target: <130', range: '70–220 mmHg', min: 70, max: 220},
    dia: {label: 'Diastolic BP', hint: 'Normal: <80 · Target: <80', range: '40–140 mmHg', min: 40, max: 140},
    hr: {label: 'Pulse rate', hint: 'Normal: 60–100 bpm', range: '30–180 bpm', min: 30, max: 180},
  };

  const openNumpad = (field) => {
    setNumpadField(field);
    setNumpadVal('');
    setNumpadVisible(true);
  };

  const currentFieldValue = () => {
    if (numpadField === 'sys') return String(systolic);
    if (numpadField === 'dia') return String(diastolic);
    return String(pulse);
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
      if (numpadField === 'sys') setSystolic(val);
      else if (numpadField === 'dia') setDiastolic(val);
      else setPulse(val);
      setNumpadVisible(false);
    }
  };

  return (
    <View style={{paddingVertical: vs(6)}}>
      {/* ── 1. BP Number Display ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>BLOOD PRESSURE READING</AppText>
      <View style={styles.card}>
        <View style={styles.bpDisplayRow}>
          {/* Systolic */}
          <TouchableOpacity style={styles.bpColumn} activeOpacity={0.6} onPress={() => openNumpad('sys')}>
            <AppText variant="small" color={Colors.textSecondary}>Systolic</AppText>
            <AppText
              style={[styles.bpBigNumber, {color: Colors.red}]}
              numberOfLines={1}
              adjustsFontSizeToFit>
              {systolic}
            </AppText>
            <AppText variant="small" color={Colors.textSecondary}>mmHg</AppText>
          </TouchableOpacity>
          {/* Separator */}
          <AppText style={styles.bpSeparator}>/</AppText>
          {/* Diastolic */}
          <TouchableOpacity style={styles.bpColumn} activeOpacity={0.6} onPress={() => openNumpad('dia')}>
            <AppText variant="small" color={Colors.textSecondary}>Diastolic</AppText>
            <AppText
              style={[styles.bpBigNumber, {color: Colors.amber}]}
              numberOfLines={1}
              adjustsFontSizeToFit>
              {diastolic}
            </AppText>
            <AppText variant="small" color={Colors.textSecondary}>mmHg</AppText>
          </TouchableOpacity>
          {/* Heart separator */}
          <Icon family="Ionicons" name="heart" size={ms(18)} color={Colors.textTertiary} />
          {/* Pulse */}
          <TouchableOpacity style={styles.bpColumn} activeOpacity={0.6} onPress={() => openNumpad('hr')}>
            <AppText variant="small" color={Colors.textSecondary}>Pulse</AppText>
            <AppText
              style={[styles.bpBigNumber, {color: Colors.textSecondary}]}
              numberOfLines={1}
              adjustsFontSizeToFit>
              {pulse}
            </AppText>
            <AppText variant="small" color={Colors.textSecondary}>bpm</AppText>
          </TouchableOpacity>
        </View>
        <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(6)}}>
          Tap any number to edit
        </AppText>
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

      {/* ── 2. Sliders ── */}
      <View style={styles.card}>
        {/* Systolic slider */}
        <View style={styles.sliderRow}>
          <View style={styles.sliderHeader}>
            <Icon family="Ionicons" name="heart-circle-outline" size={ms(18)} color={Colors.red} />
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginLeft: s(6), flex: 1}}>Systolic</AppText>
            <View style={[styles.sliderBadge, {backgroundColor: Colors.redBg}]}>
              <AppText variant="caption" color={Colors.redText} style={{fontWeight: '700'}}>
                140 mmHg
              </AppText>
            </View>
          </View>
          <View style={{marginTop: vs(8), alignItems: 'center'}}>
            <BPSliderBar zones={SLIDER_ZONES.systolic} value={140} min={70} max={220} markerColor={Colors.red} />
          </View>
          <View style={styles.sliderLabels}>
            {SYS_LABELS.map((l, i) => (
              <AppText key={i} variant="small" color={Colors.textTertiary}>{l}</AppText>
            ))}
          </View>
        </View>

        {/* Diastolic slider */}
        <View style={[styles.sliderRow, {marginTop: vs(16)}]}>
          <View style={styles.sliderHeader}>
            <Icon family="Ionicons" name="heart-half-outline" size={ms(18)} color="#f97316" />
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginLeft: s(6), flex: 1}}>Diastolic</AppText>
            <View style={[styles.sliderBadge, {backgroundColor: Colors.amberBg}]}>
              <AppText variant="caption" color={Colors.amberText} style={{fontWeight: '700'}}>
                90 mmHg
              </AppText>
            </View>
          </View>
          <View style={{marginTop: vs(8), alignItems: 'center'}}>
            <BPSliderBar zones={SLIDER_ZONES.diastolic} value={90} min={40} max={140} markerColor="#f97316" />
          </View>
          <View style={styles.sliderLabels}>
            {DIA_LABELS.map((l, i) => (
              <AppText key={i} variant="small" color={Colors.textTertiary}>{l}</AppText>
            ))}
          </View>
        </View>

        {/* Pulse slider */}
        <View style={[styles.sliderRow, {marginTop: vs(16)}]}>
          <View style={styles.sliderHeader}>
            <Icon family="Ionicons" name="pulse-outline" size={ms(18)} color={Colors.textSecondary} />
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginLeft: s(6), flex: 1}}>Pulse</AppText>
            <View style={[styles.sliderBadge, {backgroundColor: '#f3f4f6'}]}>
              <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '700'}}>
                78 bpm
              </AppText>
            </View>
          </View>
          <View style={{marginTop: vs(8), alignItems: 'center'}}>
            <BPSliderBar zones={SLIDER_ZONES.pulse} value={78} min={30} max={180} markerColor={Colors.textSecondary} />
          </View>
          <View style={styles.sliderLabels}>
            {PULSE_LABELS.map((l, i) => (
              <AppText key={i} variant="small" color={Colors.textTertiary}>{l}</AppText>
            ))}
          </View>
        </View>
      </View>

      {/* ── 3. Derived Values ── */}
      <View style={styles.derivedRow}>
        <View style={styles.derivedBox}>
          <AppText variant="small" color={Colors.textSecondary}>Pulse pressure</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary}>50</AppText>
          <AppText variant="small" color={Colors.tealText}>Normal</AppText>
        </View>
        <View style={styles.derivedBox}>
          <AppText variant="small" color={Colors.textSecondary}>MAP</AppText>
          <AppText variant="bodyBold" color={Colors.amberText}>107</AppText>
          <AppText variant="small" color={Colors.amberText}>{`Mild \u2191`}</AppText>
        </View>
        <View style={styles.derivedBox}>
          <AppText variant="small" color={Colors.textSecondary}>vs Last</AppText>
          <AppText variant="bodyBold" color={Colors.tealText}>{'\u22122'}</AppText>
          <AppText variant="small" color={Colors.tealText}>{'\u2193'}</AppText>
        </View>
        <View style={styles.derivedBox}>
          <AppText variant="small" color={Colors.textSecondary}>vs 7-day avg</AppText>
          <AppText variant="bodyBold" color={Colors.amberText}>+4</AppText>
          <AppText variant="small" color={Colors.amberText}>{'\u2191'}</AppText>
        </View>
      </View>

      {/* ── 4. Second Reading ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>SECOND READING</AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(6)}}>
        HBPM protocol: log after 1 min
      </AppText>
      <View style={styles.card}>
        <View style={styles.secondReadingHeader}>
          <View style={styles.secondReadingBadge}>
            <AppText variant="small" color={Colors.blueText} style={{fontWeight: '700'}}>2nd reading</AppText>
          </View>
        </View>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(6), lineHeight: ms(17)}}>
          Wait 1 full minute {'\u00b7'} Same arm {'\u00b7'} Same position
        </AppText>
        <View style={styles.miniInputRow}>
          <View style={styles.miniInputBox}>
            <AppText variant="small" color={Colors.textSecondary}>Sys</AppText>
            <AppText variant="bodyBold" color={Colors.textTertiary} style={{marginTop: vs(4)}}>{'\u2014'}</AppText>
          </View>
          <View style={styles.miniInputBox}>
            <AppText variant="small" color={Colors.textSecondary}>Dia</AppText>
            <AppText variant="bodyBold" color={Colors.textTertiary} style={{marginTop: vs(4)}}>{'\u2014'}</AppText>
          </View>
          <View style={styles.miniInputBox}>
            <AppText variant="small" color={Colors.textSecondary}>Pulse</AppText>
            <AppText variant="bodyBold" color={Colors.textTertiary} style={{marginTop: vs(4)}}>{'\u2014'}</AppText>
          </View>
        </View>
        {/* Average display — hidden until both readings entered */}
        <View style={styles.averageArea}>
          <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center'}}>
            Average will appear once both readings are entered
          </AppText>
        </View>
      </View>

      {/* ── 5. Arm ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>ARM</AppText>
      <View style={styles.chipRow}>
        {ARM_CHIPS.map(chip => (
          <TouchableOpacity
            key={chip}
            activeOpacity={0.7}
            onPress={() => setActiveArm(chip)}
            style={[styles.chip, activeArm === chip && styles.chipActive]}>
            <AppText
              variant="small"
              color={activeArm === chip ? Colors.primary : Colors.textSecondary}
              style={{fontWeight: activeArm === chip ? '700' : '500'}}>
              {chip}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── 6. Body Position ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>BODY POSITION</AppText>
      <View style={styles.chipRow}>
        {POSITION_CHIPS.map(chip => (
          <TouchableOpacity
            key={chip}
            activeOpacity={0.7}
            onPress={() => setActivePosition(chip)}
            style={[styles.chip, activePosition === chip && styles.chipActive]}>
            <AppText
              variant="small"
              color={activePosition === chip ? Colors.primary : Colors.textSecondary}
              style={{fontWeight: activePosition === chip ? '700' : '500'}}>
              {chip}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── 7. Medication Timing ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>MEDICATION TIMING</AppText>
      <View style={styles.chipRow}>
        {MED_TIMING_CHIPS.map(chip => {
          const isActive = activeMedTiming === chip;
          const isRedStyle = chip === 'Before Amlodipine' && isActive;
          return (
            <TouchableOpacity
              key={chip}
              activeOpacity={0.7}
              onPress={() => setActiveMedTiming(chip)}
              style={[
                styles.chip,
                isActive && !isRedStyle && styles.chipActive,
                isRedStyle && styles.chipActiveRed,
              ]}>
              <AppText
                variant="small"
                color={isRedStyle ? Colors.redText : (isActive ? Colors.primary : Colors.textSecondary)}
                style={{fontWeight: isActive ? '700' : '500'}}>
                {chip}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── 8. Location ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>WHERE ARE YOU?</AppText>
      <View style={styles.chipRow}>
        {LOCATION_CHIPS.map(chip => (
          <TouchableOpacity
            key={chip}
            activeOpacity={0.7}
            onPress={() => setActiveLocation(chip)}
            style={[styles.chip, activeLocation === chip && styles.chipActive]}>
            <AppText
              variant="small"
              color={activeLocation === chip ? Colors.primary : Colors.textSecondary}
              style={{fontWeight: activeLocation === chip ? '700' : '500'}}>
              {chip}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── 9. Context Tags ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>CONTEXT</AppText>
      <View style={styles.card}>
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
      </View>

      {/* ── 10. Symptoms ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>SYMPTOMS RIGHT NOW</AppText>
      <View style={styles.card}>
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
      </View>

      {/* ── 11. Crisis Warning (hidden by default) ── */}
      {showCrisis && (
        <View style={styles.crisisCard}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon family="Ionicons" name="warning-outline" size={ms(18)} color={Colors.redText} />
            <AppText variant="bodyBold" color={Colors.redText} style={{marginLeft: s(6)}}>
              Critically Elevated BP
            </AppText>
          </View>
          <AppText variant="caption" color={Colors.redText} style={{marginTop: vs(4), lineHeight: ms(17)}}>
            BP is critically elevated. If you are experiencing symptoms such as severe headache, chest pain, breathlessness, or visual changes {'\u2014'} call 108 immediately. Do not wait. If no symptoms, rest quietly and re-measure in 5 minutes.
          </AppText>
        </View>
      )}

      {/* ── 12. Notes ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>YOUR NOTE</AppText>
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

      {/* ── 13. HBPM Protocol ── */}
      <View style={styles.hbpmCard}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(8)}}>
          <Icon family="Ionicons" name="clipboard-outline" size={ms(18)} color={Colors.blueText} />
          <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6)}}>
            HBPM Protocol
          </AppText>
        </View>
        {HBPM_STEPS.map((step, i) => (
          <View key={i} style={styles.hbpmStep}>
            <View style={styles.hbpmStepNumber}>
              <AppText variant="small" color={Colors.blueText} style={{fontWeight: '700'}}>
                {i + 1}
              </AppText>
            </View>
            <AppText variant="caption" color={Colors.blueText} style={{flex: 1, marginLeft: s(8), lineHeight: ms(17)}}>
              {step}
            </AppText>
          </View>
        ))}
        <View style={styles.hbpmFooter}>
          <Icon family="Ionicons" name="checkmark-circle-outline" size={ms(14)} color={Colors.tealText} />
          <AppText variant="small" color={Colors.tealText} style={{marginLeft: s(6), fontWeight: '600'}}>
            11 days to Apr 4 visit {'\u00b7'} 7 of 14 readings logged
          </AppText>
        </View>
      </View>

      {/* ── 14. Comparison ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>HOW THIS COMPARES</AppText>
      <View style={styles.card}>
        {COMPARISON_ROWS.map((row, i) => (
          <View
            key={i}
            style={[styles.compareRow, i < COMPARISON_ROWS.length - 1 && styles.compareRowBorder]}>
            <AppText variant="body" color={Colors.textSecondary} style={{flex: 1.5}}>{row.label}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{width: s(55), textAlign: 'right'}}>{row.prev}</AppText>
            <Icon family="Ionicons" name="arrow-forward-outline" size={ms(12)} color={Colors.textTertiary} style={{marginHorizontal: s(6)}} />
            <AppText variant="bodyBold" color={row.deltaColor} style={{width: s(60), textAlign: 'right'}}>
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

  // 1. BP Display
  bpDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(4),
  },
  bpColumn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: s(4),
    borderRadius: ms(10),
    backgroundColor: '#f9fafb',
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },
  bpBigNumber: {
    fontSize: ms(24),
    fontWeight: '700',
    lineHeight: ms(30),
    marginVertical: vs(4),
  },
  bpSeparator: {
    fontSize: ms(20),
    fontWeight: '300',
    color: Colors.textTertiary,
  },

  // 2. Sliders
  sliderRow: {},
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

  // 3. Derived values
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

  // 4. Second Reading
  secondReadingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  secondReadingBadge: {
    backgroundColor: Colors.blueBg,
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(10),
  },
  miniInputRow: {
    flexDirection: 'row',
    gap: s(8),
    marginTop: vs(12),
  },
  miniInputBox: {
    flex: 1,
    backgroundColor: '#f9fafb',
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(10),
    alignItems: 'center',
  },
  averageArea: {
    marginTop: vs(12),
    paddingVertical: vs(10),
    borderTopWidth: 0.5,
    borderTopColor: '#e5e7eb',
  },

  // 5-8. Chips
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
  chipActiveRed: {
    backgroundColor: Colors.redBg,
    borderColor: Colors.redText,
  },
  chipActiveGreen: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.tealText,
  },

  // 11. Crisis
  crisisCard: {
    backgroundColor: Colors.redBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginBottom: vs(10),
  },

  // 12. Notes
  textInput: {
    fontSize: ms(14),
    color: Colors.textPrimary,
    minHeight: vs(80),
    textAlignVertical: 'top',
    padding: 0,
  },

  // 13. HBPM Protocol
  hbpmCard: {
    backgroundColor: Colors.blueBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginBottom: vs(10),
  },
  hbpmStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(6),
  },
  hbpmStepNumber: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(11),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  hbpmFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(8),
    backgroundColor: Colors.tealBg,
    borderRadius: ms(10),
    padding: ms(10),
  },

  // 14. Comparison
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  compareRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
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

export default BPManualView;
