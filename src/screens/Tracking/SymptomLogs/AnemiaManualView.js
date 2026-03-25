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
import Svg, {Circle as SvgCircle, Text as SvgText, Rect} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

// ─── Constants & Data ───────────────────────────────────────────────────

const SYMPTOMS = [
  {icon: 'moon-outline', name: 'Fatigue', sub: 'Most sensitive anemia symptom', active: 1},
  {icon: 'cloud-outline', name: 'Breathlessness', sub: 'Reflects reduced O\u2082 delivery', active: 0},
  {icon: 'heart-outline', name: 'Palpitations', sub: 'Compensatory tachycardia', active: 0},
  {icon: 'compass-outline', name: 'Dizziness', sub: 'Especially on standing', active: 0},
  {icon: 'medical-outline', name: 'Headache', sub: 'Cerebral vasodilation', active: 0},
  {icon: 'flash-outline', name: 'Pins & needles', sub: 'B12-specific neuropathy', subRed: true, active: 1},
  {icon: 'bulb-outline', name: 'Brain fog', sub: 'B12 impairs myelin synthesis', active: 1},
  {icon: 'snow-outline', name: 'Cold hands/feet', sub: 'Peripheral vasoconstriction', active: 1},
  {icon: 'flame-outline', name: 'Burning tongue', sub: 'B12 glossitis', subRed: true, active: 0},
  {icon: 'leaf-outline', name: 'Hair loss', sub: 'Telogen effluvium', active: 0},
  {icon: 'walk-outline', name: 'Exercise intolerance', sub: 'VO\u2082max correlates with Hb', active: 1},
  {icon: 'body-outline', name: 'Restless legs', sub: 'Iron deficiency specific', active: 0},
  {icon: 'sad-outline', name: 'Low mood', sub: 'B12 \u2192 low serotonin/dopamine', active: 1},
  {icon: 'ear-outline', name: 'Tinnitus', sub: 'Turbulent blood flow', active: 0},
];

const PALLOR_SITES = [
  {icon: 'eye-outline', label: 'Conjunctival', sub: 'Pull down lower eyelid'},
  {icon: 'hand-left-outline', label: 'Palmar crease', sub: 'Creases when stretched'},
  {icon: 'finger-print-outline', label: 'Nail bed', sub: 'Press + release'},
  {icon: 'happy-outline', label: 'Mucosal', sub: 'Lips, gums, inner cheek', active: true},
  {icon: 'medical-outline', label: 'Tongue', sub: 'B12: smooth beefy red'},
  {icon: 'sad-outline', label: 'Angular cheilitis', sub: 'Cracking at mouth corners'},
];

const PALLOR_SEVERITY = ['None', 'Mild', 'Moderate', 'Severe'];

const NAIL_SKIN_TAGS = [
  'Koilonychia (spoon nails)', 'Brittle nails', 'Pale nail beds',
  'Dry skin', 'Hair shedding', 'Mouth ulcers', 'No changes',
];

const PICA_OPTIONS = ['Ice', 'Chalk/clay', 'Soil/mud', 'Paper', 'Raw starch', 'Uncooked rice'];
const PICA_TODAY = ['No unusual cravings', 'Ice cravings', 'Other pica'];

const STAIRS_CHIPS = ['Easy', 'Moderate', 'Difficult', 'Unable'];
const WORK_CHIPS = ['Full', 'Reduced', 'Unable'];

const PERIOD_FLOW = ['Light', 'Moderate', 'Heavy', 'Very heavy', 'With clots'];

// ─── Component ──────────────────────────────────────────────────────────

const AnemiaManualView = () => {
  const [hbVal, setHbVal] = useState(10.8);
  const [symptomScores, setSymptomScores] = useState(
    SYMPTOMS.reduce((acc, s) => ({...acc, [s.name]: s.active}), {}),
  );
  const [activePallor, setActivePallor] = useState('Mucosal');
  const [pallorSeverity, setPallorSeverity] = useState('None');
  const [selectedNailSkin, setSelectedNailSkin] = useState(['No changes']);
  const [selectedPica, setSelectedPica] = useState(null);
  const [picaToday, setPicaToday] = useState('No unusual cravings');
  const [activityTolerance, setActivityTolerance] = useState(6);
  const [activeStairs, setActiveStairs] = useState('Easy');
  const [activeWork, setActiveWork] = useState('Full');
  const [menstrualStatus, setMenstrualStatus] = useState('Day 24 \u00b7 Not menstruating');
  const [periodFlow, setPeriodFlow] = useState('Moderate');
  const [notes, setNotes] = useState('');

  // ── Numpad modal ──
  const [numpadVisible, setNumpadVisible] = useState(false);
  const [numpadVal, setNumpadVal] = useState('');

  const openNumpad = () => {
    setNumpadVal('');
    setNumpadVisible(true);
  };

  const npPress = (d) => {
    setNumpadVal(prev => {
      if (d === '.') {
        if (prev.includes('.')) return prev;
        if (prev.length === 0) return '0.';
        return prev + '.';
      }
      const parts = prev.split('.');
      if (parts.length === 2 && parts[1].length >= 1) return prev;
      if (prev.length >= 4) return prev;
      return prev + d;
    });
  };

  const npDel = () => {
    setNumpadVal(prev => prev.slice(0, -1));
  };

  const npConfirm = () => {
    const raw = numpadVal || String(hbVal);
    const val = parseFloat(raw);
    if (!isNaN(val) && val >= 3.0 && val <= 20.0) {
      setHbVal(Math.round(val * 10) / 10);
      setNumpadVisible(false);
    }
  };

  const toggleNailSkin = (tag) => {
    if (tag === 'No changes') {
      setSelectedNailSkin(['No changes']);
    } else {
      setSelectedNailSkin(prev => {
        const without = prev.filter(t => t !== 'No changes');
        return without.includes(tag) ? without.filter(t => t !== tag) : [...without, tag];
      });
    }
  };

  // Hb color helper
  const hbColor = (v) => {
    if (v < 7) return Colors.redText;
    if (v < 10) return Colors.red;
    if (v < 12) return Colors.amberText;
    return Colors.tealText;
  };

  // SVG gauge arc
  const renderGauge = () => {
    const cx = 45, cy = 45, r = 36;
    const startAngle = 135;
    const totalAngle = 270;
    const fraction = Math.max(0, Math.min(1, (hbVal - 3) / (20 - 3)));
    const sweepAngle = fraction * totalAngle;
    const endAngle = startAngle + sweepAngle;

    const polarToCartesian = (a) => {
      const rad = (a - 90) * Math.PI / 180;
      return {x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad)};
    };

    const start = polarToCartesian(startAngle);
    const end = polarToCartesian(endAngle);
    const largeArc = sweepAngle > 180 ? 1 : 0;

    // Background arc
    const bgEnd = polarToCartesian(startAngle + totalAngle);
    const bgLargeArc = totalAngle > 180 ? 1 : 0;
    const bgPath = `M ${start.x} ${start.y} A ${r} ${r} 0 ${bgLargeArc} 1 ${bgEnd.x} ${bgEnd.y}`;
    const fgPath = `M ${start.x} ${start.y} A ${r} ${r} 0 ${largeArc} 1 ${end.x} ${end.y}`;

    return (
      <Svg width={ms(90)} height={ms(90)} viewBox="0 0 90 90">
        <SvgCircle cx={cx} cy={cy} r={r} fill="none" stroke="#333" strokeWidth={6} strokeDasharray="2 3" opacity={0.3} />
        <SvgCircle cx={cx} cy={cy} r={r} fill="none" stroke={hbColor(hbVal)} strokeWidth={6}
          strokeDasharray={`${(sweepAngle / 360) * 2 * Math.PI * r} ${2 * Math.PI * r}`}
          strokeDashoffset={0}
          strokeLinecap="round"
          transform={`rotate(${startAngle - 90} ${cx} ${cy})`}
        />
        <SvgText x={cx} y={cy - 4} textAnchor="middle" fontSize="16" fontWeight="700" fill={hbColor(hbVal)}>
          {hbVal.toFixed(1)}
        </SvgText>
        <SvgText x={cx} y={cy + 12} textAnchor="middle" fontSize="8" fill="#999">
          g/dL
        </SvgText>
      </Svg>
    );
  };

  return (
    <View style={{paddingVertical: vs(6)}}>

      {/* ── 1. Hb Meter ── */}
      <View style={styles.darkCard}>
        {/* Header */}
        <View style={styles.darkHeader}>
          <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon family="Ionicons" name="chevron-back" size={ms(18)} color="#aaa" />
          </TouchableOpacity>
          <AppText variant="bodyBold" color="#fff" style={{flex: 1, textAlign: 'center'}}>
            Hemoglobin — Today
          </AppText>
          <TouchableOpacity hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color="#aaa" />
          </TouchableOpacity>
        </View>

        {/* Main row */}
        <View style={styles.hbMainRow}>
          {renderGauge()}
          <View style={{flex: 1, marginLeft: s(12)}}>
            <TouchableOpacity activeOpacity={0.6} onPress={openNumpad}>
              <AppText
                style={{fontSize: ms(22), fontWeight: '700', color: hbColor(hbVal), lineHeight: ms(28)}}
                numberOfLines={1}
                adjustsFontSizeToFit>
                {hbVal.toFixed(1)}
              </AppText>
            </TouchableOpacity>
            <AppText variant="small" color="#999">g/dL · tap to enter</AppText>
            <AppText variant="small" color={Colors.tealText} style={{marginTop: vs(4)}}>
              +0.2 from last (10.6)
            </AppText>
          </View>
        </View>

        {/* Range bar */}
        <View style={{marginTop: vs(10), paddingHorizontal: s(8)}}>
          <View style={styles.rangeBar}>
            <View style={[styles.rangeSegment, {flex: 1, backgroundColor: '#991b1b', borderTopLeftRadius: ms(4), borderBottomLeftRadius: ms(4)}]} />
            <View style={[styles.rangeSegment, {flex: 1, backgroundColor: '#ef4444'}]} />
            <View style={[styles.rangeSegment, {flex: 1, backgroundColor: Colors.amberText, borderWidth: 1, borderColor: '#fff'}]} />
            <View style={[styles.rangeSegment, {flex: 1, backgroundColor: '#10b981', borderTopRightRadius: ms(4), borderBottomRightRadius: ms(4)}]} />
          </View>
          <View style={styles.rangeLabelRow}>
            <AppText variant="small" color="#999">&lt;7 Severe</AppText>
            <AppText variant="small" color="#999">7.0</AppText>
            <AppText variant="small" color="#999">10.0</AppText>
            <AppText variant="small" color={Colors.amberText}>{'\u2190'} {hbVal.toFixed(1)}</AppText>
            <AppText variant="small" color={Colors.tealText}>12.0 Normal {'\u2713'}</AppText>
            <AppText variant="small" color="#999">16.0</AppText>
          </View>
        </View>

        {/* 3-column metrics */}
        <View style={styles.metricsRow}>
          <View style={styles.metricCol}>
            <AppText variant="small" color="#999">Today Hb</AppText>
            <AppText variant="bodyBold" color={hbColor(hbVal)}>{hbVal.toFixed(1)}</AppText>
          </View>
          <View style={styles.metricCol}>
            <AppText variant="small" color="#999">MCV</AppText>
            <AppText variant="bodyBold" color={Colors.amberText}>108 <AppText variant="small" color={Colors.amberText}>{'\u2191'} macro</AppText></AppText>
          </View>
          <View style={styles.metricCol}>
            <AppText variant="small" color="#999">B12</AppText>
            <AppText variant="bodyBold" color={Colors.redText}>147 <AppText variant="small" color={Colors.redText}>{'\u2193'} low</AppText></AppText>
          </View>
        </View>
      </View>

      {/* ── 2. Numpad Modal ── */}
      <Modal
        visible={numpadVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNumpadVisible(false)}>
        <Pressable style={styles.numpadOverlay} onPress={() => setNumpadVisible(false)}>
          <Pressable style={styles.numpadSheet} onPress={e => e.stopPropagation()}>
            {/* Header */}
            <View style={styles.numpadHeader}>
              <AppText variant="bodyBold">Hemoglobin</AppText>
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
                {numpadVal || hbVal.toFixed(1)}
              </AppText>
              {!numpadVal && (
                <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
                  Type a new value
                </AppText>
              )}
            </View>

            {/* Hint */}
            <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center', marginTop: vs(4)}}>
              Normal {'\u2640'}: 12.0{'\u2013'}16.0 · Mild: 10{'\u2013'}12 · Mod: 7{'\u2013'}10 · Severe: &lt;7
            </AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(2), marginBottom: vs(8)}}>
              Range: 3.0{'\u2013'}20.0 g/dL
            </AppText>

            {/* Numpad grid */}
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

            {/* Decimal button */}
            <TouchableOpacity
              style={{alignItems: 'center', paddingVertical: vs(8)}}
              onPress={() => npPress('.')}
              activeOpacity={0.6}>
              <AppText style={styles.npBtnText}>.</AppText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>

      {/* ── 3. Metformin-B12 Insight ── */}
      <View style={[styles.insightCard, {backgroundColor: Colors.purpleBg}]}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)}}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(18)} color={Colors.purpleText} />
          <AppText variant="bodyBold" color={Colors.purpleText} style={{marginLeft: s(6)}}>Metformin-B12 Insight</AppText>
        </View>
        <AppText variant="body" color={Colors.purpleText}>
          Long-term Metformin (6.5 years) reduces B12 by 30%. Methylcobalamin 500mcg Day 9... recovery 6{'\u2013'}8 weeks. Does NOT require stopping Metformin.
        </AppText>
      </View>

      {/* ── 4. Daily Symptoms ── */}
      <View style={styles.sectionRow}>
        <AppText variant="sectionTitle" style={styles.sectionHeading}>DAILY SYMPTOMS</AppText>
        <AppText variant="caption" color={Colors.textSecondary}>Rate 0-3</AppText>
      </View>
      <View style={styles.card}>
        {SYMPTOMS.map((sym, idx) => (
          <View key={sym.name} style={[styles.symptomRow, idx > 0 && {borderTopWidth: 0.5, borderTopColor: '#e5e7eb'}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
              <Icon family="Ionicons" name={sym.icon} size={ms(18)} color={Colors.textSecondary} />
              <View style={{marginLeft: s(8), flex: 1}}>
                <AppText variant="bodyBold">{sym.name}</AppText>
                <AppText variant="small" color={sym.subRed ? Colors.redText : Colors.textTertiary}>{sym.sub}</AppText>
              </View>
            </View>
            <View style={{flexDirection: 'row', gap: s(4)}}>
              {[0, 1, 2, 3].map(score => {
                const isActive = symptomScores[sym.name] === score;
                const btnColor = score === 0 ? '#e5e7eb' : score === 1 ? Colors.amberBg : score === 2 ? '#fed7aa' : Colors.redBg;
                const txtColor = score === 0 ? Colors.textSecondary : score === 1 ? Colors.amberText : score === 2 ? '#c2410c' : Colors.redText;
                return (
                  <TouchableOpacity
                    key={score}
                    style={[styles.severityBtn, {backgroundColor: isActive ? btnColor : '#f9fafb', borderWidth: isActive ? 1 : 0.5, borderColor: isActive ? txtColor : '#d1d5db'}]}
                    onPress={() => setSymptomScores(prev => ({...prev, [sym.name]: score}))}>
                    <AppText variant="small" color={isActive ? txtColor : Colors.textTertiary} style={{fontWeight: isActive ? '700' : '400'}}>{score}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>

      {/* ── 5. Pallor Self-Assessment ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>PALLOR SELF-ASSESSMENT</AppText>
      <View style={styles.card}>
        <AppText variant="body" color={Colors.textSecondary} style={{marginBottom: vs(8)}}>
          Check these body sites for pale color, which may indicate anemia severity.
        </AppText>
        <View style={styles.gridRow}>
          {PALLOR_SITES.map(site => {
            const isActive = activePallor === site.label;
            return (
              <TouchableOpacity
                key={site.label}
                style={[styles.gridItem, isActive && {borderColor: Colors.primary, backgroundColor: Colors.tealBg}]}
                onPress={() => setActivePallor(site.label)}>
                <Icon family="Ionicons" name={site.icon} size={ms(22)} color={isActive ? Colors.primary : Colors.textSecondary} />
                <AppText variant="small" color={isActive ? Colors.primary : Colors.textPrimary} style={{marginTop: vs(4), textAlign: 'center', fontWeight: isActive ? '700' : '400'}}>{site.label}</AppText>
                <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(2)}}>{site.sub}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Severity chips */}
        <View style={styles.chipRow}>
          {PALLOR_SEVERITY.map(sev => {
            const isActive = pallorSeverity === sev;
            return (
              <TouchableOpacity
                key={sev}
                style={[styles.chip, isActive && {backgroundColor: Colors.tealBg, borderColor: Colors.primary}]}
                onPress={() => setPallorSeverity(sev)}>
                <AppText variant="small" color={isActive ? Colors.primary : Colors.textSecondary} style={{fontWeight: isActive ? '700' : '400'}}>{sev}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── 6. Nail & Skin Signs ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>NAIL & SKIN SIGNS</AppText>
      <View style={styles.card}>
        <View style={styles.chipRow}>
          {NAIL_SKIN_TAGS.map(tag => {
            const isActive = selectedNailSkin.includes(tag);
            const isGreen = tag === 'No changes' && isActive;
            return (
              <TouchableOpacity
                key={tag}
                style={[styles.chip, isActive && {backgroundColor: isGreen ? Colors.tealBg : Colors.amberBg, borderColor: isGreen ? Colors.tealText : Colors.amberText}]}
                onPress={() => toggleNailSkin(tag)}>
                <AppText variant="small" color={isActive ? (isGreen ? Colors.tealText : Colors.amberText) : Colors.textSecondary} style={{fontWeight: isActive ? '700' : '400'}}>{tag}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── 7. Pica Tracker ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>PICA / UNUSUAL CRAVINGS</AppText>
      <View style={styles.card}>
        <AppText variant="body" color={Colors.textSecondary} style={{marginBottom: vs(8)}}>
          Pica (craving non-food items) is a specific sign of iron deficiency anemia.
        </AppText>
        <View style={styles.gridRow}>
          {PICA_OPTIONS.map(item => {
            const isActive = selectedPica === item;
            return (
              <TouchableOpacity
                key={item}
                style={[styles.gridItem, isActive && {borderColor: Colors.amberText, backgroundColor: Colors.amberBg}]}
                onPress={() => setSelectedPica(isActive ? null : item)}>
                <AppText variant="small" color={isActive ? Colors.amberText : Colors.textPrimary} style={{textAlign: 'center', fontWeight: isActive ? '700' : '400'}}>{item}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
        {/* Today chips */}
        <View style={[styles.chipRow, {marginTop: vs(10)}]}>
          {PICA_TODAY.map(chip => {
            const isActive = picaToday === chip;
            const isGreen = chip === 'No unusual cravings' && isActive;
            return (
              <TouchableOpacity
                key={chip}
                style={[styles.chip, isActive && {backgroundColor: isGreen ? Colors.tealBg : Colors.amberBg, borderColor: isGreen ? Colors.tealText : Colors.amberText}]}
                onPress={() => setPicaToday(chip)}>
                <AppText variant="small" color={isActive ? (isGreen ? Colors.tealText : Colors.amberText) : Colors.textSecondary} style={{fontWeight: isActive ? '700' : '400'}}>{chip}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── 8. Functional Capacity ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>FUNCTIONAL CAPACITY</AppText>
      <View style={styles.card}>
        {/* Activity tolerance */}
        <View style={{marginBottom: vs(12)}}>
          <AppText variant="bodyBold">Activity tolerance</AppText>
          <View style={styles.sliderTrack}>
            {[...Array(10)].map((_, i) => {
              const val = i + 1;
              const isActive = val <= activityTolerance;
              return (
                <TouchableOpacity
                  key={val}
                  style={[styles.sliderDot, isActive && {backgroundColor: Colors.primary}]}
                  onPress={() => setActivityTolerance(val)}>
                  <AppText variant="small" color={isActive ? Colors.white : Colors.textTertiary}>{val}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
          <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(4)}}>
            {activityTolerance}/10
          </AppText>
        </View>

        {/* Stairs */}
        <AppText variant="bodyBold" style={{marginBottom: vs(6)}}>Climbing stairs</AppText>
        <View style={styles.chipRow}>
          {STAIRS_CHIPS.map(chip => {
            const isActive = activeStairs === chip;
            return (
              <TouchableOpacity
                key={chip}
                style={[styles.chip, isActive && {backgroundColor: Colors.tealBg, borderColor: Colors.primary}]}
                onPress={() => setActiveStairs(chip)}>
                <AppText variant="small" color={isActive ? Colors.primary : Colors.textSecondary} style={{fontWeight: isActive ? '700' : '400'}}>{chip}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Work */}
        <AppText variant="bodyBold" style={{marginTop: vs(10), marginBottom: vs(6)}}>Work capacity</AppText>
        <View style={styles.chipRow}>
          {WORK_CHIPS.map(chip => {
            const isActive = activeWork === chip;
            return (
              <TouchableOpacity
                key={chip}
                style={[styles.chip, isActive && {backgroundColor: Colors.tealBg, borderColor: Colors.primary}]}
                onPress={() => setActiveWork(chip)}>
                <AppText variant="small" color={isActive ? Colors.primary : Colors.textSecondary} style={{fontWeight: isActive ? '700' : '400'}}>{chip}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── 9. Menstrual Blood Loss ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>MENSTRUAL BLOOD LOSS</AppText>
      <View style={styles.card}>
        {/* Current status */}
        <AppText variant="bodyBold" style={{marginBottom: vs(6)}}>Current status</AppText>
        <View style={styles.chipRow}>
          {['Day 24 \u00b7 Not menstruating', 'Currently menstruating'].map(chip => {
            const isActive = menstrualStatus === chip;
            return (
              <TouchableOpacity
                key={chip}
                style={[styles.chip, isActive && {backgroundColor: Colors.tealBg, borderColor: Colors.primary}]}
                onPress={() => setMenstrualStatus(chip)}>
                <AppText variant="small" color={isActive ? Colors.primary : Colors.textSecondary} style={{fontWeight: isActive ? '700' : '400'}}>{chip}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Last period flow */}
        <AppText variant="bodyBold" style={{marginTop: vs(10), marginBottom: vs(6)}}>Last period flow</AppText>
        <View style={styles.chipRow}>
          {PERIOD_FLOW.map(chip => {
            const isActive = periodFlow === chip;
            return (
              <TouchableOpacity
                key={chip}
                style={[styles.chip, isActive && {backgroundColor: Colors.amberBg, borderColor: Colors.amberText}]}
                onPress={() => setPeriodFlow(chip)}>
                <AppText variant="small" color={isActive ? Colors.amberText : Colors.textSecondary} style={{fontWeight: isActive ? '700' : '400'}}>{chip}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(8)}}>
          Heavy menstrual bleeding is the most common cause of iron-deficiency anemia in premenopausal women.
        </AppText>
      </View>

      {/* ── 10. Anemia-Diabetes Connection ── */}
      <View style={[styles.insightCard, {backgroundColor: Colors.redBg}]}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)}}>
          <Icon family="Ionicons" name="warning-outline" size={ms(18)} color={Colors.redText} />
          <AppText variant="bodyBold" color={Colors.redText} style={{marginLeft: s(6)}}>Anemia-Diabetes Connection</AppText>
        </View>
        <AppText variant="body" color={Colors.redText}>
          T2DM increases anemia risk 1.6{'\u00d7'} through diabetic nephropathy, autonomic neuropathy, Metformin B12 depletion. Treating B12 may improve both Hb and HbA1c.
        </AppText>
      </View>

      {/* ── 11. Notes ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>NOTES</AppText>
      <View style={styles.card}>
        <TextInput
          style={styles.textInput}
          placeholder="Add any additional notes..."
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

// ─── Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sectionHeading: {
    marginTop: vs(18),
    marginBottom: vs(8),
  },
  sectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: vs(18),
    marginBottom: vs(8),
  },
  card: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: s(12),
    backgroundColor: Colors.white,
    marginBottom: vs(10),
  },
  darkCard: {
    backgroundColor: '#180808',
    borderRadius: ms(14),
    padding: s(12),
    marginTop: vs(4),
  },
  darkHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  hbMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  rangeBar: {
    flexDirection: 'row',
    height: ms(8),
    borderRadius: ms(4),
    overflow: 'hidden',
  },
  rangeSegment: {
    height: ms(8),
  },
  rangeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(4),
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(12),
    paddingTop: vs(10),
    borderTopWidth: 0.5,
    borderTopColor: '#333',
  },
  metricCol: {
    alignItems: 'center',
    flex: 1,
  },
  insightCard: {
    borderRadius: ms(14),
    padding: s(12),
    marginTop: vs(10),
    marginBottom: vs(10),
  },
  symptomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  severityBtn: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  gridRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: s(8),
  },
  gridItem: {
    width: '30%',
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(10),
    padding: s(8),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f9fafb',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginTop: vs(6),
  },
  chip: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(20),
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    backgroundColor: '#f9fafb',
  },
  sliderTrack: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(8),
  },
  sliderDot: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(14),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#e5e7eb',
  },
  textInput: {
    minHeight: vs(80),
    fontSize: ms(14),
    color: Colors.textPrimary,
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
    fontSize: ms(24),
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

export default AnemiaManualView;
