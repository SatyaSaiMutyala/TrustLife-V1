import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Rect, Line as SvgLine, Polyline, Circle as SvgCircle, Text as SvgText, Path} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

// ─── ECG Waveform path (2-3 PQRST cycles) ─────────────────────────────
const ECG_WAVEFORM_PATH =
  'M 0,50 L 15,50 Q 20,50 22,46 Q 25,38 28,50 L 35,50 L 38,50 L 40,48 L 42,52 L 44,15 L 47,75 L 50,42 L 52,50 L 60,50 Q 65,50 68,44 Q 72,36 76,50 L 90,50' +
  ' L 105,50 Q 110,50 112,46 Q 115,38 118,50 L 125,50 L 128,50 L 130,48 L 132,52 L 134,15 L 137,75 L 140,42 L 142,50 L 150,50 Q 155,50 158,44 Q 162,36 166,50 L 180,50' +
  ' L 195,50 Q 200,50 202,46 Q 205,38 208,50 L 215,50 L 218,50 L 220,48 L 222,52 L 224,15 L 227,75 L 230,42 L 232,50 L 240,50 Q 245,50 248,44 Q 252,36 256,50 L 270,50' +
  ' L 285,50 Q 290,50 292,46 Q 295,38 298,50 L 305,50 L 308,50 L 310,48 L 312,52 L 314,15 L 317,75 L 320,42 L 322,50 L 330,50 L 340,50';

// mini waveform for 12-lead cells
const MINI_ECG_PATH = 'M 0,15 L 10,15 L 14,13 L 17,15 L 22,15 L 24,14 L 25,16 L 27,4 L 29,26 L 31,12 L 33,15 L 42,15 Q 46,15 48,12 Q 51,8 54,15 L 65,15 L 80,15';

// ─── Constants ──────────────────────────────────────────────────────────
const BADGE_COLORS = {
  green: {bg: '#d1fae5', text: '#065f46'},
  amber: {bg: '#fef3c7', text: '#92400e'},
  red: {bg: '#fee2e2', text: '#991b1b'},
  emergency: {bg: '#fecaca', text: '#7f1d1d'},
};

const MEASUREMENTS = [
  {label: 'HEART RATE', value: '72', unit: 'bpm', status: 'Normal', badge: 'green', range: 'Normal: 60\u2013100 bpm'},
  {label: 'PR INTERVAL', value: '158', unit: 'ms', status: 'Normal', badge: 'green', range: 'Normal: 120\u2013200 ms'},
  {label: 'QRS DURATION', value: '88', unit: 'ms', status: 'Normal', badge: 'green', range: 'Normal: 70\u2013120 ms'},
  {label: 'QT INTERVAL', value: '380', unit: 'ms', status: '\u2713', badge: 'green', range: 'Input to calculate QTc'},
  {label: 'QTc (BAZETT)', value: '418', unit: 'ms', status: 'Normal (F)', badge: 'green', range: 'Normal \u2640: <460ms \u00b7 \u2642: <440ms', highlight: true},
  {label: 'QRS AXIS', value: '+42\u00b0', unit: '', status: 'Normal', badge: 'green', range: 'Normal: \u221230\u00b0 to +90\u00b0'},
];

const RHYTHMS = [
  {name: 'Normal sinus rhythm', abbr: 'NSR', color: 'green', desc: 'Regular rhythm, 60\u2013100 bpm, upright P in II'},
  {name: 'Sinus bradycardia', abbr: 'SB', color: 'amber', desc: 'Regular rhythm, rate <60 bpm'},
  {name: 'Sinus tachycardia', abbr: 'ST', color: 'amber', desc: 'Regular rhythm, rate >100 bpm'},
  {name: 'Atrial fibrillation', abbr: 'AF', color: 'red', desc: 'Irregularly irregular, no P waves'},
  {name: 'Atrial flutter', abbr: 'AFL', color: 'red', desc: 'Sawtooth flutter waves, regular rate'},
  {name: 'SVT', abbr: 'SVT', color: 'red', desc: 'Narrow complex, rate >150 bpm'},
  {name: 'PVCs', abbr: 'PVC', color: 'amber', desc: 'Wide bizarre QRS, compensatory pause'},
  {name: '1st degree AVB', abbr: '1\u00b0HB', color: 'amber', desc: 'PR >200ms, all P waves conducted'},
  {name: '2nd degree AVB', abbr: '2\u00b0HB', color: 'red', desc: 'Dropped beats (Mobitz I or II)'},
  {name: '3rd degree AVB', abbr: 'CHB', color: 'emergency', desc: 'Complete AV dissociation'},
  {name: 'LBBB', abbr: 'LBBB', color: 'red', desc: 'Wide QRS, dominant S in V1'},
  {name: 'RBBB', abbr: 'RBBB', color: 'amber', desc: 'Wide QRS, RSR\u2019 in V1'},
  {name: 'Ventricular tachycardia', abbr: 'VT', color: 'emergency', desc: 'Wide complex, rate >100 bpm'},
  {name: 'Ventricular fibrillation', abbr: 'VF', color: 'emergency', desc: 'Chaotic rhythm, no QRS'},
];

const ST_OPTIONS = [
  {name: 'No ST change', icon: 'checkmark-circle-outline', sub: 'Isoelectric baseline'},
  {name: 'ST elevation', icon: 'arrow-up-outline', sub: '>1mm in 2+ leads \u00b7 STEMI until proven'},
  {name: 'ST depression', icon: 'arrow-down-outline', sub: 'Ischaemia \u00b7 LVH strain \u00b7 digoxin'},
  {name: 'T wave inversion', icon: 'caret-down-outline', sub: 'Ischaemia \u00b7 PE \u00b7 LVH \u00b7 LBBB'},
  {name: 'Peaked T waves', icon: 'triangle-outline', sub: 'Hyperkalaemia \u00b7 early MI'},
  {name: 'Pathological Q waves', icon: 'remove-outline', sub: '>1mm wide / >25% QRS \u00b7 old MI'},
  {name: 'P wave change', icon: 'pulse-outline', sub: 'P mitrale / P pulmonale'},
  {name: 'Prominent U wave', icon: 'water-outline', sub: 'Hypokalaemia \u00b7 bradycardia'},
  {name: 'Delta wave (WPW)', icon: 'flash-outline', sub: 'Pre-excitation \u00b7 Wolff-Parkinson-White'},
];

const SYMPTOMS = [
  'No symptoms (routine check)',
  'Palpitations',
  'Breathlessness',
  'Chest pain/pressure',
  'Dizziness',
  'Syncope/blackout',
  'Presyncope',
  'Exertional symptoms',
  'Woke with symptoms',
  'Anxiety/panic',
];

const LEADS = ['I', 'II', 'III', 'aVR', 'aVL', 'aVF', 'V1', 'V2', 'V3', 'V4', 'V5', 'V6'];

const INTERVAL_BARS = [
  {label: 'PR interval', value: 158, unit: 'ms', min: 0, max: 300, normalStart: 120, normalEnd: 200, color: '#10b981'},
  {label: 'QRS duration', value: 88, unit: 'ms', min: 0, max: 200, normalStart: 70, normalEnd: 120, color: '#10b981'},
  {label: 'QTc (Bazett)', value: 418, unit: 'ms', min: 200, max: 600, normalStart: 350, normalEnd: 460, color: '#10b981'},
];

const COMPARISON_ROWS = [
  {label: 'Rhythm', prev: 'NSR', curr: 'NSR'},
  {label: 'Heart rate', prev: '68', curr: '72'},
  {label: 'PR interval', prev: '162', curr: '158'},
  {label: 'QRS', prev: '86', curr: '88'},
  {label: 'QTc', prev: '422', curr: '418'},
  {label: 'ST changes', prev: 'None', curr: 'None'},
  {label: 'LVH (Sokolow)', prev: '25', curr: '26'},
];

const HISTORY_ROWS = [
  {date: 'Today', context: 'Apple Watch / manual', rhythm: 'NSR', hr: '72', qtc: '418ms', qtcStatus: 'green', highlight: true},
  {date: '14 Jan 2026', context: 'KIMS Cardiology', rhythm: 'NSR', hr: '68', qtc: '422ms', qtcStatus: 'green'},
  {date: '12 Mar 2025', context: 'Annual review', rhythm: 'NSR', hr: '74', qtc: '428ms', qtcStatus: 'green'},
  {date: '10 Sep 2025', context: 'HbA1c review', rhythm: 'NSR', hr: '76', qtc: '431ms', qtcStatus: 'green'},
  {date: '20 Mar 2021', context: 'HTN diagnosis', rhythm: 'NSR', hr: '88', qtc: '441ms', qtcStatus: 'amber'},
];

// ─── Component ──────────────────────────────────────────────────────────
const ECGManualView = () => {
  const [activeRhythm, setActiveRhythm] = useState('Normal sinus rhythm');
  const [activeST, setActiveST] = useState('No ST change');
  const [activeSymptoms, setActiveSymptoms] = useState(['No symptoms (routine check)']);
  const [notes, setNotes] = useState('');

  const toggleSymptom = (symptom) => {
    setActiveSymptoms(prev =>
      prev.includes(symptom)
        ? prev.filter(s => s !== symptom)
        : [...prev, symptom],
    );
  };

  // ─── Render helpers ─────────────────────────────────────────────────
  const renderBadge = (text, colorKey) => {
    const c = BADGE_COLORS[colorKey] || BADGE_COLORS.green;
    return (
      <View style={[styles.badge, {backgroundColor: c.bg}]}>
        <AppText variant="small" style={{color: c.text, fontSize: ms(9), fontWeight: '700'}}>{text}</AppText>
      </View>
    );
  };

  // ─── 1. ECG Waveform Display ────────────────────────────────────────
  const renderWaveformCard = () => (
    <View style={styles.waveformCard}>
      {/* Header */}
      <View style={styles.waveformHeader}>
        <View style={{flex: 1}}>
          <AppText variant="caption" style={{color: '#94a3b8'}}>Lead II {'\u00b7'} Rhythm strip</AppText>
          <AppText variant="small" style={{color: '#64748b', marginTop: vs(2)}}>25 mm/s {'\u00b7'} 10 mm/mV</AppText>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
            <AppText variant="header" style={{color: '#ffffff', fontSize: ms(28), fontWeight: '700'}}>72</AppText>
            <AppText variant="caption" style={{color: '#94a3b8', marginLeft: s(4)}}>BPM</AppText>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: vs(2)}}>
            <View style={styles.liveDot} />
            <AppText variant="small" style={{color: '#22c55e', marginLeft: s(4)}}>Live</AppText>
          </View>
        </View>
      </View>

      {/* SVG Waveform */}
      <View style={{marginVertical: vs(8)}}>
        <Svg width="100%" height={vs(90)} viewBox="0 0 340 90" preserveAspectRatio="xMidYMid meet">
          {/* Faint grid lines every 10px */}
          {Array.from({length: 35}, (_, i) => (
            <SvgLine key={`vf-${i}`} x1={(i + 1) * 10} y1={0} x2={(i + 1) * 10} y2={90} stroke="rgba(0,200,83,0.07)" strokeWidth={0.5} />
          ))}
          {Array.from({length: 9}, (_, i) => (
            <SvgLine key={`hf-${i}`} x1={0} y1={(i + 1) * 10} x2={340} y2={(i + 1) * 10} stroke="rgba(0,200,83,0.07)" strokeWidth={0.5} />
          ))}
          {/* Brighter grid lines every 50px */}
          {Array.from({length: 7}, (_, i) => (
            <SvgLine key={`vb-${i}`} x1={(i + 1) * 50} y1={0} x2={(i + 1) * 50} y2={90} stroke="rgba(0,200,83,0.15)" strokeWidth={0.5} />
          ))}
          <SvgLine x1={0} y1={50} x2={340} y2={50} stroke="rgba(0,200,83,0.15)" strokeWidth={0.5} />
          {/* ECG waveform */}
          <Path d={ECG_WAVEFORM_PATH} stroke="#00e676" strokeWidth={1.5} fill="none" />
        </Svg>
      </View>

      {/* Footer */}
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        <AppText variant="small" style={{color: '#64748b', fontSize: ms(9)}}>1 small sq = 40ms / 0.1mV</AppText>
        <AppText variant="small" style={{color: '#64748b', fontSize: ms(9)}}>1 large sq = 200ms / 0.5mV</AppText>
      </View>
    </View>
  );

  // ─── 2. Key Measurements ────────────────────────────────────────────
  const renderKeyMeasurements = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">KEY MEASUREMENTS</AppText>
      <AppText variant="caption" style={styles.sectionSub}>Tap to enter {'\u00b7'} Auto-calculates QTc (Bazett)</AppText>
      <View style={styles.card}>
        <View style={styles.measureGrid}>
          {MEASUREMENTS.map((m, i) => (
            <View key={i} style={[styles.measureCell, m.highlight && {backgroundColor: '#eff6ff'}]}>
              <AppText variant="small" style={styles.measureLabel}>{m.label}</AppText>
              <View style={{flexDirection: 'row', alignItems: 'baseline', marginTop: vs(2)}}>
                <AppText variant="bodyBold" style={{fontSize: ms(18)}} numberOfLines={1} adjustsFontSizeToFit>{m.value}</AppText>
                {m.unit ? <AppText variant="caption" style={{marginLeft: s(3), color: '#6b7280'}}>{m.unit}</AppText> : null}
              </View>
              {renderBadge(m.status, m.badge)}
              <AppText variant="small" style={{color: '#9ca3af', marginTop: vs(3), fontSize: ms(9)}}>{m.range}</AppText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  // ─── 3. Interval Visual Bars ────────────────────────────────────────
  const renderIntervalBars = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">INTERVAL RANGES</AppText>
      <AppText variant="caption" style={styles.sectionSub}>Your values vs normal zones</AppText>
      <View style={styles.card}>
        {INTERVAL_BARS.map((bar, idx) => {
          const trackW = 280;
          const range = bar.max - bar.min;
          const normStartX = ((bar.normalStart - bar.min) / range) * trackW;
          const normEndX = ((bar.normalEnd - bar.min) / range) * trackW;
          const valX = ((bar.value - bar.min) / range) * trackW;
          return (
            <View key={idx} style={{marginBottom: idx < INTERVAL_BARS.length - 1 ? vs(14) : 0}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(6)}}>
                <AppText variant="body" style={{fontWeight: '600'}}>{bar.label}</AppText>
                {renderBadge(`${bar.value} ${bar.unit}`, 'green')}
              </View>
              <Svg width="100%" height={vs(24)} viewBox={`0 0 ${trackW} 24`} preserveAspectRatio="xMidYMid meet">
                {/* Track bg */}
                <Rect x={0} y={6} width={trackW} height={8} rx={4} fill="#e5e7eb" />
                {/* Normal zone */}
                <Rect x={normStartX} y={6} width={normEndX - normStartX} height={8} rx={4} fill="rgba(16,185,129,0.25)" />
                {/* Value fill */}
                <Rect x={0} y={6} width={valX} height={8} rx={4} fill={bar.color} opacity={0.5} />
                {/* Marker dot */}
                <SvgCircle cx={valX} cy={10} r={5} fill={bar.color} stroke="#fff" strokeWidth={1.5} />
                {/* Tick labels */}
                <SvgText x={normStartX} y={22} fontSize={8} fill="#9ca3af" textAnchor="middle">{bar.normalStart}</SvgText>
                <SvgText x={normEndX} y={22} fontSize={8} fill="#9ca3af" textAnchor="middle">{bar.normalEnd}</SvgText>
              </Svg>
            </View>
          );
        })}
      </View>
    </View>
  );

  // ─── 4. Rhythm Classification ───────────────────────────────────────
  const renderRhythmClassification = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">RHYTHM CLASSIFICATION</AppText>
      <AppText variant="caption" style={styles.sectionSub}>Select what best describes this ECG</AppText>
      <View style={styles.rhythmGrid}>
        {RHYTHMS.map((r, i) => {
          const isActive = activeRhythm === r.name;
          return (
            <TouchableOpacity
              key={i}
              style={[styles.rhythmCard, isActive && styles.rhythmCardActive]}
              onPress={() => setActiveRhythm(r.name)}
              activeOpacity={0.7}>
              <View style={{flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', marginBottom: vs(3)}}>
                <AppText variant="bodyBold" style={{fontSize: ms(12), marginRight: s(5)}}>{r.name}</AppText>
                {renderBadge(r.abbr, r.color)}
              </View>
              <AppText variant="small" style={{color: '#6b7280', fontSize: ms(10)}}>{r.desc}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // ─── 5. ST Segment & Waveform Changes ───────────────────────────────
  const renderSTChanges = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">ST SEGMENT & WAVEFORM CHANGES</AppText>
      <View style={styles.stGrid}>
        {ST_OPTIONS.map((opt, i) => {
          const isActive = activeST === opt.name;
          return (
            <TouchableOpacity
              key={i}
              style={[styles.stCell, isActive && styles.stCellActive]}
              onPress={() => setActiveST(opt.name)}
              activeOpacity={0.7}>
              <Icon name={opt.icon} size={ms(22)} color={isActive ? Colors.primary : '#6b7280'} />
              <AppText variant="bodyBold" style={{fontSize: ms(11), marginTop: vs(4), textAlign: 'center'}}>{opt.name}</AppText>
              <AppText variant="small" style={{color: '#9ca3af', fontSize: ms(9), textAlign: 'center', marginTop: vs(2)}}>{opt.sub}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // ─── 6. QTc Calculator ──────────────────────────────────────────────
  const renderQTcCalculator = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">QTC CALCULATOR</AppText>
      <AppText variant="caption" style={styles.sectionSub}>Bazett formula {'\u00b7'} QTc = QT {'\u00f7'} {'\u221a'}RR {'\u00b7'} Critical for T2DM patients</AppText>
      <View style={styles.card}>
        {/* Input displays */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(12)}}>
          <View style={styles.qtcInputBox}>
            <AppText variant="small" style={{color: '#64748b', marginBottom: vs(3)}}>QT interval</AppText>
            <AppText variant="bodyBold" style={{color: '#1e40af', fontSize: ms(22), lineHeight: ms(28)}} numberOfLines={1}>380</AppText>
            <AppText variant="caption" style={{color: '#64748b', marginTop: vs(2)}}>ms</AppText>
          </View>
          <View style={styles.qtcInputBox}>
            <AppText variant="small" style={{color: '#64748b', marginBottom: vs(3)}}>Heart rate</AppText>
            <AppText variant="bodyBold" style={{color: '#1e40af', fontSize: ms(22), lineHeight: ms(28)}} numberOfLines={1}>72</AppText>
            <AppText variant="caption" style={{color: '#64748b', marginTop: vs(2)}}>bpm</AppText>
          </View>
        </View>

        {/* Result row */}
        <View style={styles.qtcResult}>
          <View style={{flex: 1}}>
            <AppText variant="caption" style={{color: '#374151'}}>QTc (Bazett formula)</AppText>
            <AppText variant="bodyBold" style={{fontSize: ms(18), color: '#111827', marginTop: vs(2)}}>418 ms</AppText>
          </View>
          <View style={[styles.badge, {backgroundColor: '#d1fae5', paddingHorizontal: s(10), paddingVertical: vs(4)}]}>
            <AppText variant="small" style={{color: '#065f46', fontWeight: '700'}}>Normal {'\u2713'} ({'<'}460ms)</AppText>
          </View>
        </View>

        {/* Warning text */}
        <View style={[styles.warningBox, {marginTop: vs(10)}]}>
          <Icon name="alert-circle-outline" size={ms(14)} color="#92400e" />
          <AppText variant="small" style={{color: '#92400e', marginLeft: s(6), flex: 1, fontSize: ms(10)}}>
            QTc thresholds: Women {'<'}460ms, Men {'<'}440ms. T2DM patients on metformin have lower QT prolongation risk, but monitor if adding QT-prolonging medications. Hypoglycaemia can prolong QTc.
          </AppText>
        </View>
      </View>
    </View>
  );

  // ─── 7. 12-Lead View ────────────────────────────────────────────────
  const renderTwelveLeadView = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">12-LEAD VIEW</AppText>
      <AppText variant="caption" style={styles.sectionSub}>Tap lead to enter findings</AppText>
      <View style={styles.card}>
        <View style={styles.leadGrid}>
          {LEADS.map((lead, i) => (
            <View key={i} style={styles.leadCell}>
              <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                <AppText variant="bodyBold" style={{fontSize: ms(12)}}>{lead}</AppText>
                <Icon name="checkmark-circle" size={ms(14)} color="#22c55e" />
              </View>
              <Svg width="100%" height={vs(30)} viewBox="0 0 80 30" preserveAspectRatio="xMidYMid meet" style={{marginVertical: vs(3)}}>
                <Path d={MINI_ECG_PATH} stroke="#10b981" strokeWidth={1.2} fill="none" />
              </Svg>
              <AppText variant="small" style={{color: '#22c55e', fontSize: ms(9)}}>Normal</AppText>
            </View>
          ))}
        </View>
        <AppText variant="caption" style={{color: '#9ca3af', textAlign: 'center', marginTop: vs(8)}}>Tap any lead to log findings...</AppText>
      </View>
    </View>
  );

  // ─── 8. Symptoms ────────────────────────────────────────────────────
  const renderSymptoms = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">SYMPTOMS AT TIME OF RECORDING</AppText>
      <View style={styles.chipRow}>
        {SYMPTOMS.map((sym, i) => {
          const isActive = activeSymptoms.includes(sym);
          return (
            <TouchableOpacity
              key={i}
              style={[styles.chip, isActive && styles.chipActive]}
              onPress={() => toggleSymptom(sym)}
              activeOpacity={0.7}>
              <AppText variant="small" style={{color: isActive ? '#fff' : '#374151', fontSize: ms(11)}}>{sym}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // ─── 9. Cardiac Risk Context ────────────────────────────────────────
  const renderCardiacRiskContext = () => (
    <View style={styles.section}>
      {/* T2DM + HTN card */}
      <View style={[styles.insightCard, {backgroundColor: '#e0f2fe'}]}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)}}>
          <Icon name="heart-outline" size={ms(18)} color="#0369a1" />
          <AppText variant="bodyBold" style={{color: '#0369a1', marginLeft: s(6)}}>T2DM + HTN cardiac risk profile</AppText>
        </View>
        <AppText variant="body" style={{color: '#0c4a6e', fontSize: ms(11), lineHeight: ms(17)}}>
          Type 2 diabetes and hypertension together significantly increase cardiovascular risk. Silent MI is 3x more common in T2DM due to cardiac autonomic neuropathy. Regular ECG monitoring helps detect ischaemic changes, LVH progression, and arrhythmias early. HbA1c and BP control are the two most modifiable factors for reducing cardiac events.
        </AppText>
      </View>

      {/* Medications card */}
      <View style={[styles.insightCard, {backgroundColor: '#fef3c7', marginTop: vs(10)}]}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)}}>
          <Icon name="medkit-outline" size={ms(18)} color="#92400e" />
          <AppText variant="bodyBold" style={{color: '#92400e', marginLeft: s(6)}}>Medications and the ECG</AppText>
        </View>
        <AppText variant="body" style={{color: '#78350f', fontSize: ms(11), lineHeight: ms(17)}}>
          Amlodipine (CCB): may cause mild sinus tachycardia; rarely affects QT. Metformin: no direct ECG effects; cardioprotective in T2DM. Atorvastatin: no significant ECG changes; reduces cardiovascular events. Always check for new QT-prolonging drugs at each review.
        </AppText>
      </View>
    </View>
  );

  // ─── 10. LVH Voltage Criteria ──────────────────────────────────────
  const renderLVHCriteria = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">LVH VOLTAGE CRITERIA</AppText>
      <AppText variant="caption" style={styles.sectionSub}>HTN screening {'\u00b7'} Sokolow-Lyon</AppText>
      <View style={styles.card}>
        <AppText variant="body" style={{color: '#6b7280', marginBottom: vs(10), fontSize: ms(11)}}>
          Sokolow-Lyon criterion: SV1 + RV5 or RV6 {'>'}35mm = LVH
        </AppText>

        {/* Value boxes */}
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: vs(10)}}>
          <View style={styles.lvhBox}>
            <AppText variant="small" style={{color: '#6b7280'}}>S in V1</AppText>
            <AppText variant="bodyBold" style={{fontSize: ms(22)}}>12</AppText>
            <AppText variant="small" style={{color: '#6b7280'}}>mm</AppText>
          </View>
          <AppText variant="bodyBold" style={{marginHorizontal: s(8), fontSize: ms(18), color: '#9ca3af'}}>+</AppText>
          <View style={styles.lvhBox}>
            <AppText variant="small" style={{color: '#6b7280'}}>R in V5/V6</AppText>
            <AppText variant="bodyBold" style={{fontSize: ms(22)}}>14</AppText>
            <AppText variant="small" style={{color: '#6b7280'}}>mm</AppText>
          </View>
          <AppText variant="bodyBold" style={{marginHorizontal: s(8), fontSize: ms(18), color: '#9ca3af'}}>=</AppText>
          <View style={[styles.lvhBox, {backgroundColor: '#d1fae5'}]}>
            <AppText variant="small" style={{color: '#065f46'}}>Sokolow total</AppText>
            <AppText variant="bodyBold" style={{fontSize: ms(22), color: '#065f46'}}>26</AppText>
            <AppText variant="small" style={{color: '#065f46'}}>mm</AppText>
          </View>
        </View>

        {/* Status */}
        <View style={{alignItems: 'center', marginBottom: vs(8)}}>
          {renderBadge('Below LVH threshold', 'green')}
        </View>

        <AppText variant="small" style={{color: '#9ca3af', fontSize: ms(10), textAlign: 'center'}}>
          Sokolow-Lyon {'<'}35mm indicates no voltage criteria for LVH. Clinical correlation with echo recommended if borderline. HTN patients should be screened annually.
        </AppText>
      </View>
    </View>
  );

  // ─── 11. Comparison ─────────────────────────────────────────────────
  const renderComparison = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">COMPARISON WITH LAST ECG</AppText>
      <AppText variant="caption" style={styles.sectionSub}>Jan 14, 2026 {'\u00b7'} KIMS Cardiology</AppText>
      <View style={styles.card}>
        {COMPARISON_ROWS.map((row, i) => (
          <View key={i} style={[styles.compRow, i < COMPARISON_ROWS.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb'}]}>
            <AppText variant="body" style={{flex: 1, color: '#6b7280', fontSize: ms(12)}}>{row.label}</AppText>
            <AppText variant="body" style={{color: '#9ca3af', fontSize: ms(12), width: s(50), textAlign: 'right'}}>{row.prev}</AppText>
            <Icon name="arrow-forward-outline" size={ms(12)} color="#d1d5db" style={{marginHorizontal: s(6)}} />
            <AppText variant="bodyBold" style={{color: '#111827', fontSize: ms(12), width: s(50), textAlign: 'left'}}>{row.curr}</AppText>
          </View>
        ))}
      </View>
    </View>
  );

  // ─── 12. Stable ECG Insight ─────────────────────────────────────────
  const renderStableInsight = () => (
    <View style={styles.section}>
      <View style={[styles.insightCard, {backgroundColor: '#d1fae5'}]}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)}}>
          <Icon name="checkmark-circle-outline" size={ms(18)} color="#065f46" />
          <AppText variant="bodyBold" style={{color: '#065f46', marginLeft: s(6)}}>Stable ECG {'\u2013'} no concerning changes since Jan 14, 2026</AppText>
        </View>
        <AppText variant="body" style={{color: '#064e3b', fontSize: ms(11), lineHeight: ms(17)}}>
          All intervals remain within normal limits. No new ST changes, no axis shift, and no evidence of LVH by voltage criteria. Rhythm is consistently normal sinus. QTc is stable and below threshold for both men and women. Continue current medication regimen and annual ECG review.
        </AppText>
      </View>
    </View>
  );

  // ─── 13. ECG History ────────────────────────────────────────────────
  const renderECGHistory = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">ECG HISTORY</AppText>
      <View style={styles.card}>
        {/* Header */}
        <View style={[styles.historyRow, {borderBottomWidth: 1, borderBottomColor: '#e5e7eb', paddingBottom: vs(6)}]}>
          <AppText variant="small" style={[styles.histCol1, {fontWeight: '700', color: '#6b7280'}]}>Date / context</AppText>
          <AppText variant="small" style={[styles.histCol2, {fontWeight: '700', color: '#6b7280'}]}>Rhythm</AppText>
          <AppText variant="small" style={[styles.histCol3, {fontWeight: '700', color: '#6b7280'}]}>HR</AppText>
          <AppText variant="small" style={[styles.histCol4, {fontWeight: '700', color: '#6b7280'}]}>QTc</AppText>
        </View>
        {/* Rows */}
        {HISTORY_ROWS.map((row, i) => (
          <View key={i} style={[styles.historyRow, row.highlight && {backgroundColor: '#f0fdf4'}, {paddingVertical: vs(6)}]}>
            <View style={styles.histCol1}>
              <AppText variant="small" style={{fontWeight: row.highlight ? '700' : '400', color: '#111827', fontSize: ms(10)}}>{row.date}</AppText>
              <AppText variant="small" style={{color: '#9ca3af', fontSize: ms(9)}}>{row.context}</AppText>
            </View>
            <AppText variant="small" style={[styles.histCol2, {color: '#374151'}]}>{row.rhythm}</AppText>
            <AppText variant="small" style={[styles.histCol3, {color: '#374151'}]}>{row.hr}</AppText>
            <View style={styles.histCol4}>
              <AppText variant="small" style={{color: '#374151'}}>{row.qtc}</AppText>
              <AppText variant="small" style={{color: row.qtcStatus === 'amber' ? '#d97706' : '#22c55e', marginLeft: s(3)}}>
                {row.qtcStatus === 'amber' ? '~' : '\u2713'}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  // ─── 14. Notes ──────────────────────────────────────────────────────
  const renderNotes = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">NOTES</AppText>
      <View style={styles.card}>
        <TextInput
          style={styles.notesInput}
          multiline
          placeholder="Record any observations: palpitations, breathlessness, chest tightness, syncope, pre-syncope, medication changes, exercise context, emotional state..."
          placeholderTextColor="#9ca3af"
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />
      </View>
    </View>
  );

  // ─── Main render ────────────────────────────────────────────────────
  return (
    <View style={styles.container}>
      {renderWaveformCard()}
      {renderKeyMeasurements()}
      {renderIntervalBars()}
      {renderRhythmClassification()}
      {renderSTChanges()}
      {renderQTcCalculator()}
      {renderTwelveLeadView()}
      {renderSymptoms()}
      {renderCardiacRiskContext()}
      {renderLVHCriteria()}
      {renderComparison()}
      {renderStableInsight()}
      {renderECGHistory()}
      {renderNotes()}
    </View>
  );
};

// ─── Styles ───────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  container: {
    paddingVertical: vs(6),
  },

  // Section
  section: {
    marginTop: vs(18),
  },
  sectionSub: {
    color: '#6b7280',
    marginTop: vs(2),
    marginBottom: vs(8),
  },

  // Card
  card: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(12),
    backgroundColor: '#fff',
  },

  // 1. Waveform
  waveformCard: {
    backgroundColor: '#040d18',
    borderRadius: ms(14),
    padding: ms(14),
  },
  waveformHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(4),
  },
  liveDot: {
    width: ms(7),
    height: ms(7),
    borderRadius: ms(4),
    backgroundColor: '#22c55e',
  },

  // 2. Measurements
  measureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  measureCell: {
    width: '50%',
    paddingVertical: vs(8),
    paddingHorizontal: s(6),
    borderBottomWidth: 0.5,
    borderBottomColor: '#f3f4f6',
  },
  measureLabel: {
    color: '#9ca3af',
    fontSize: ms(9),
    fontWeight: '600',
    letterSpacing: 0.5,
  },

  // Badge
  badge: {
    alignSelf: 'flex-start',
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(8),
    marginTop: vs(3),
  },

  // 4. Rhythm grid
  rhythmGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  rhythmCard: {
    width: '48.5%',
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(10),
    marginBottom: vs(8),
    backgroundColor: '#fff',
  },
  rhythmCardActive: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    backgroundColor: '#f0fdfa',
  },

  // 5. ST grid
  stGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  stCell: {
    width: '31.5%',
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(10),
    marginBottom: vs(8),
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  stCellActive: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    backgroundColor: '#f0fdfa',
  },

  // 6. QTc
  qtcInputBox: {
    flex: 1,
    backgroundColor: '#eff6ff',
    borderRadius: ms(12),
    padding: ms(12),
    alignItems: 'center',
    marginHorizontal: s(4),
  },
  qtcResult: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f9fafb',
    borderRadius: ms(12),
    padding: ms(12),
  },
  warningBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#fffbeb',
    borderRadius: ms(10),
    padding: ms(10),
  },

  // 7. 12-lead
  leadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  leadCell: {
    width: '31.5%',
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    borderRadius: ms(10),
    padding: ms(8),
    marginBottom: vs(6),
  },

  // 8. Symptoms
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: vs(4),
  },
  chip: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(20),
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    marginRight: s(6),
    marginBottom: vs(6),
    backgroundColor: '#fff',
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // 9. Insight card
  insightCard: {
    borderRadius: ms(14),
    padding: ms(14),
  },

  // 10. LVH
  lvhBox: {
    backgroundColor: '#f9fafb',
    borderRadius: ms(10),
    padding: ms(10),
    alignItems: 'center',
    minWidth: s(70),
  },

  // 11. Comparison
  compRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(7),
  },

  // 13. History
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(4),
  },
  histCol1: {
    flex: 2,
  },
  histCol2: {
    flex: 1,
    textAlign: 'center',
    fontSize: ms(10),
  },
  histCol3: {
    flex: 0.6,
    textAlign: 'center',
    fontSize: ms(10),
  },
  histCol4: {
    flex: 1.2,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'flex-end',
    fontSize: ms(10),
  },

  // 14. Notes
  notesInput: {
    minHeight: vs(100),
    fontSize: ms(13),
    color: '#374151',
    lineHeight: ms(20),
  },
});

export default ECGManualView;
