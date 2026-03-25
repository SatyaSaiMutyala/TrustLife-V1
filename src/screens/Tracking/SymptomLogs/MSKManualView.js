import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Path, Circle as SvgCircle, Rect, Text as SvgText, Line as SvgLine} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

// ─── Constants & Data ───────────────────────────────────────────────────

const PAIN_CHARACTERS = [
  {name: 'Aching', icon: 'pulse-outline', desc: 'Dull deep pain'},
  {name: 'Sharp', icon: 'cut-outline', desc: 'Stabbing pain'},
  {name: 'Burning', icon: 'flame-outline', desc: 'Hot sensation'},
  {name: 'Stiffness', icon: 'lock-closed-outline', desc: 'Reduced range'},
  {name: 'Throbbing', icon: 'heart-outline', desc: 'Pulsating pain'},
  {name: 'Shooting', icon: 'flash-outline', desc: 'Radiates along nerve'},
  {name: 'Weakness', icon: 'barbell-outline', desc: 'Loss of strength'},
  {name: 'Numbness', icon: 'hand-left-outline', desc: 'Reduced sensation'},
  {name: 'Grinding', icon: 'construct-outline', desc: 'Crepitus feeling'},
];

const JOINTS = [
  {name: 'R.Knee', icon: 'body-outline'},
  {name: 'L.Knee', icon: 'body-outline'},
  {name: 'R.Hip', icon: 'body-outline'},
  {name: 'L.Hip', icon: 'body-outline'},
  {name: 'R.Shoulder', icon: 'body-outline'},
  {name: 'L.Shoulder', icon: 'body-outline'},
  {name: 'R.Wrist', icon: 'hand-left-outline'},
  {name: 'L.Wrist', icon: 'hand-left-outline'},
  {name: 'Fingers', icon: 'hand-left-outline'},
  {name: 'Ankle', icon: 'walk-outline'},
  {name: 'Foot/Toe', icon: 'walk-outline'},
  {name: 'Lumbar spine', icon: 'body-outline'},
  {name: 'Cervical', icon: 'body-outline'},
  {name: 'Thoracic', icon: 'body-outline'},
  {name: 'Sacroiliac', icon: 'body-outline'},
  {name: 'Widespread', icon: 'pulse-outline'},
];

const SYMPTOMS_LIST = [
  {name: 'Swelling/effusion', icon: 'water-outline', sub: 'Visible puffiness', default: 0},
  {name: 'Warmth/heat', icon: 'thermometer-outline', sub: 'Joint feels warm', default: 0},
  {name: 'Redness', icon: 'ellipse-outline', sub: 'Skin redness over joint', default: 0},
  {name: 'Crepitus/grinding', icon: 'construct-outline', sub: 'Clicking sounds', default: 1},
  {name: 'Locking/catching', icon: 'lock-closed-outline', sub: 'Joint locks in position', default: 0},
  {name: 'Instability', icon: 'alert-outline', sub: 'Joint giving way', default: 0},
  {name: 'Muscle weakness', icon: 'barbell-outline', sub: 'Reduced strength', default: 1},
  {name: 'Night pain', icon: 'moon-outline', sub: 'Pain disturbing sleep', default: 0},
];

const STIFFNESS_OPTIONS = [
  {label: 'No stiffness', value: 0},
  {label: '<15 min', value: 10},
  {label: '15-30 min', value: 20},
  {label: '30-60 min', value: 45},
  {label: '>60 min', value: 75, warn: true},
  {label: 'All day', value: 999},
];

const TIMING_OPTIONS = [
  'Morning', 'After rest', 'During activity', 'After walking',
  'Stairs ascending', 'Stairs descending', 'Prolonged sitting', 'Night',
  'Cold/damp weather', 'After exercise', 'Lifting/bending', 'Constant',
];

const FUNCTIONAL_TAGS = [
  'Reduced walking', 'Difficulty on stairs', 'Disrupted sleep', 'Work affected',
  'Daily tasks harder', 'Cannot drive', 'Cannot exercise', 'Need walking aid', 'Limiting activity',
];

const CHANGE_TAGS = [
  'Rainy/damp', 'Cold', 'More activity', 'Less active', 'Poor sleep',
  'Higher stress', 'Alcohol', 'Missed medication', 'New footwear', 'Weight gain', 'Unusual posture',
];

const WOMAC_QUESTIONS = [
  {q: 'Walking on flat', default: 0},
  {q: 'Descending stairs', default: 2},
  {q: 'Standing from sitting', default: 1},
  {q: 'Putting on socks/shoes', default: 0},
];
const WOMAC_LABELS = ['None', 'Slight', 'Moderate', 'Severe', 'Extreme'];

const MEDICATIONS = [
  {name: 'Ibuprofen/Naproxen', icon: 'medical-outline', desc: 'Caution: NSAIDs interact with Amlodipine. Monitor BP closely.', badge: 'Caution \u2014 HTN', badgeColor: 'red'},
  {name: 'Paracetamol', icon: 'medical-outline', desc: 'Safe with current meds. Max 4g/day.', action: 'Log'},
  {name: 'Intra-articular injection', icon: 'medical-outline', desc: 'Last: none logged', action: 'Log injection'},
  {name: 'Topical NSAIDs (diclofenac)', icon: 'medical-outline', desc: 'Lower systemic absorption', badge: 'Applied AM', badgeColor: 'green'},
  {name: 'Glucosamine/Chondroitin', icon: 'medical-outline', desc: 'Mixed evidence', badge: 'Optional', badgeColor: 'gray'},
];

const EXERCISES = [
  {name: 'Quadriceps strengthening', detail: '3\u00d715', done: true},
  {name: 'Hamstring stretch', detail: '3\u00d730s', done: true},
  {name: 'Hip abductor strengthening', detail: '3\u00d715', done: false},
  {name: 'Walking program', detail: '20 min', done: false},
  {name: 'Pool/water exercises', detail: 'If avail.', done: false},
];

const COMPARISON_ROWS = [
  {label: 'Yesterday pain', prev: '3/10', curr: 'Same', color: null},
  {label: '7-day avg', prev: '3.4', curr: '3/10', color: '#10b981'},
  {label: 'Walking distance', prev: '400m avg', curr: '500m', color: '#10b981'},
  {label: 'Stiffness', prev: '25 min avg', curr: '20 min', color: '#10b981'},
];

const HISTORY_ROWS = [
  {date: 'Today', pain: '3/10', stiff: '20 min', walk: '500m', physio: '2/5', highlight: true},
  {date: '23 Mar', pain: '3/10', stiff: '25 min', walk: '450m', physio: '4/5'},
  {date: '20 Mar', pain: '4/10', stiff: '30 min', walk: '300m', physio: '3/5'},
  {date: '15 Mar', pain: '5/10', stiff: '35 min', walk: '200m', physio: '1/5', painRed: true},
  {date: '10 Mar', pain: '4/10', stiff: '30 min', walk: '250m', physio: '2/5'},
];

const FM_REGIONS = [
  'L.Jaw', 'R.Jaw', 'L.Shoulder girdle', 'R.Shoulder girdle',
  'L.Upper arm', 'R.Upper arm', 'L.Lower arm', 'R.Lower arm',
  'L.Hip/buttock', 'R.Hip/buttock', 'L.Upper leg', 'R.Upper leg',
  'L.Lower leg', 'R.Lower leg', 'Upper back', 'Lower back',
  'Chest', 'Abdomen',
];

const PAIN_BAR_COLORS = [
  '#22c55e', '#4ade80', '#a3e635', '#facc15', '#fbbf24',
  '#f59e0b', '#f97316', '#ef4444', '#dc2626', '#b91c1c', '#7f1d1d',
];

// ─── Component ──────────────────────────────────────────────────────────
const MSKManualView = ({activeCondition}) => {
  const [bodyView, setBodyView] = useState('Front');
  const [painLevel, setPainLevel] = useState(3);
  const [activeCharacters, setActiveCharacters] = useState(['Aching']);
  const [activeJoints, setActiveJoints] = useState(['R.Knee']);
  const [symptomScores, setSymptomScores] = useState(
    SYMPTOMS_LIST.reduce((acc, s) => ({...acc, [s.name]: s.default}), {}),
  );
  const [activeStiffness, setActiveStiffness] = useState(20);
  const [activeTiming, setActiveTiming] = useState(['During activity', 'After walking', 'Stairs descending']);
  const [activeFunctional, setActiveFunctional] = useState(['Difficulty on stairs', 'Limiting activity']);
  const [activeChanges, setActiveChanges] = useState(['Rainy/damp']);
  const [exercisesDone, setExercisesDone] = useState(
    EXERCISES.reduce((acc, e) => ({...acc, [e.name]: e.done}), {}),
  );
  const [womacScores, setWomacScores] = useState(
    WOMAC_QUESTIONS.reduce((acc, q) => ({...acc, [q.q]: q.default}), {}),
  );
  const [raData, setRaData] = useState({tender: 2, swollen: 1, global: 3});
  const [raMeds, setRaMeds] = useState(['Methotrexate']);
  const [orthoStep] = useState(3);
  const [fmActive] = useState(['L.Shoulder girdle', 'R.Shoulder girdle', 'Lower back', 'L.Upper leg']);
  const [goutPhase, setGoutPhase] = useState('Intercritical');
  const [goutUlt, setGoutUlt] = useState(['Allopurinol']);
  const [goutTriggers, setGoutTriggers] = useState(['Alcohol']);
  const [sportsScores, setSportsScores] = useState({walking: 7, calfRaises: 5, running: 3});
  const [spineRadiation, setSpineRadiation] = useState({leg: 1, arm: 0, pins: 1});
  const [notes, setNotes] = useState('');

  // ─── Toggle helpers ─────────────────────────────────────────────────
  const toggleArray = (arr, setArr, item) => {
    setArr(prev => prev.includes(item) ? prev.filter(i => i !== item) : [...prev, item]);
  };

  const BADGE_COLORS = {
    green: {bg: '#d1fae5', text: '#065f46'},
    amber: {bg: '#fef3c7', text: '#92400e'},
    red: {bg: '#fee2e2', text: '#991b1b'},
    gray: {bg: '#f3f4f6', text: '#6b7280'},
  };

  const renderBadge = (text, colorKey) => {
    const c = BADGE_COLORS[colorKey] || BADGE_COLORS.gray;
    return (
      <View style={[styles.badge, {backgroundColor: c.bg}]}>
        <AppText variant="small" style={{color: c.text, fontSize: ms(9), fontWeight: '700'}}>{text}</AppText>
      </View>
    );
  };

  // ─── 1. Body Map ──────────────────────────────────────────────────
  const renderBodyMap = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">BODY MAP</AppText>
      <AppText variant="caption" style={styles.sectionSub}>Tap regions to mark pain {'\u00b7'} Front and back views</AppText>
      <View style={styles.card}>
        {/* Controls row */}
        <View style={styles.controlRow}>
          <AppText variant="bodyBold" style={{flex: 1}}>Select affected areas</AppText>
          <View style={styles.toggleRow}>
            {['Front', 'Back'].map(v => (
              <TouchableOpacity
                key={v}
                onPress={() => setBodyView(v)}
                style={[styles.toggleBtn, bodyView === v && styles.toggleBtnActive]}
                activeOpacity={0.7}>
                <AppText variant="small" style={{color: bodyView === v ? Colors.white : Colors.textSecondary, fontWeight: '600'}}>{v}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SVG body silhouette */}
        <View style={{alignItems: 'center', marginVertical: vs(12)}}>
          <Svg width={s(160)} height={vs(280)} viewBox="0 0 160 280">
            {/* Head */}
            <SvgCircle cx="80" cy="22" r="16" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.8" />
            {/* Neck */}
            <Rect x="74" y="38" width="12" height="10" fill="#e5e7eb" stroke="#9ca3af" strokeWidth="0.5" />
            {/* Torso */}
            <Path
              d="M56 48 L104 48 L108 90 L110 130 L102 140 L58 140 L50 130 L52 90 Z"
              fill="#e5e7eb"
              stroke="#9ca3af"
              strokeWidth="0.8"
            />
            {/* Left arm */}
            <Path
              d="M56 48 L42 52 L30 80 L26 110 L22 130 L28 132 L34 112 L40 88 L50 70"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Right arm */}
            <Path
              d="M104 48 L118 52 L130 80 L134 110 L138 130 L132 132 L126 112 L120 88 L110 70"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Left leg */}
            <Path
              d="M66 140 L62 170 L58 200 L56 230 L54 260 L50 272 L60 272 L62 260 L64 232 L66 205 L70 175 L74 140"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Right leg */}
            <Path
              d="M86 140 L90 170 L94 200 L96 230 L98 260 L102 272 L112 272 L108 260 L104 232 L100 205 L96 175 L92 140"
              fill="none"
              stroke="#9ca3af"
              strokeWidth="3"
              strokeLinecap="round"
            />
            {/* Right knee pain highlight */}
            <SvgCircle cx="97" cy="205" r="14" fill="rgba(245,158,11,0.4)" stroke="#f59e0b" strokeWidth="1.5" />
            <SvgText x="97" y="208" fontSize="7" fill="#92400e" textAnchor="middle" fontWeight="bold">R.Knee</SvgText>
          </Svg>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          {[
            {color: '#f59e0b', label: 'Mild'},
            {color: '#ef4444', label: 'Moderate'},
            {color: '#7f1d1d', label: 'Severe'},
          ].map((l, i) => (
            <View key={i} style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: l.color}]} />
              <AppText variant="small" style={{color: Colors.textSecondary}}>{l.label}</AppText>
            </View>
          ))}
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: 'transparent', borderWidth: 1, borderColor: '#9ca3af', borderStyle: 'dashed'}]} />
            <AppText variant="small" style={{color: Colors.textSecondary}}>Tap to mark</AppText>
          </View>
        </View>

        {/* Active regions */}
        <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: vs(8)}}>
          <View style={[styles.chip, styles.chipActive]}>
            <AppText variant="small" style={{color: Colors.white, fontWeight: '600'}}>Right knee (3/10)</AppText>
          </View>
        </View>
      </View>
    </View>
  );

  // ─── 2. Pain Scale ────────────────────────────────────────────────
  const renderPainScale = () => {
    const painLabels = {0: 'None', 2: 'Mild', 4: 'Mod', 6: 'Sev', 10: 'Worst'};
    return (
      <View style={styles.section}>
        <AppText variant="sectionTitle">PAIN INTENSITY</AppText>
        <AppText variant="caption" style={styles.sectionSub}>NRS 0{'\u2013'}10 {'\u00b7'} Tap to select</AppText>
        <View style={styles.card}>
          <View style={styles.painBarRow}>
            {Array.from({length: 11}, (_, i) => {
              const barH = 8 + (i * 42) / 10;
              const isActive = painLevel === i;
              return (
                <TouchableOpacity
                  key={i}
                  onPress={() => setPainLevel(i)}
                  style={[styles.painBarCol, isActive && styles.painBarColActive]}
                  activeOpacity={0.7}>
                  <View style={[styles.painBar, {height: vs(barH), backgroundColor: PAIN_BAR_COLORS[i]}, isActive && {borderWidth: 2, borderColor: '#1a1a1a'}]} />
                  <AppText variant="small" style={[styles.painBarNum, isActive && {fontWeight: '700', color: Colors.textPrimary}]}>{i}</AppText>
                  {painLabels[i] && (
                    <AppText variant="small" style={{fontSize: ms(8), color: Colors.textTertiary, textAlign: 'center'}}>{painLabels[i]}</AppText>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
          <AppText variant="small" style={{color: Colors.textTertiary, marginTop: vs(10), textAlign: 'center'}}>
            0 = No pain {'  \u00b7  '} 5 = Significant {'  \u00b7  '} 10 = Worst imaginable
          </AppText>
        </View>
      </View>
    );
  };

  // ─── 3. Pain Character ────────────────────────────────────────────
  const renderPainCharacter = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">PAIN CHARACTER</AppText>
      <AppText variant="caption" style={styles.sectionSub}>What does it feel like?</AppText>
      <View style={styles.card}>
        <View style={styles.charGrid}>
          {PAIN_CHARACTERS.map((ch, i) => {
            const isActive = activeCharacters.includes(ch.name);
            return (
              <TouchableOpacity
                key={i}
                style={[styles.charCell, isActive && styles.charCellActive]}
                onPress={() => toggleArray(activeCharacters, setActiveCharacters, ch.name)}
                activeOpacity={0.7}>
                <Icon name={ch.icon} size={ms(22)} color={isActive ? Colors.primary : '#6b7280'} />
                <AppText variant="bodyBold" style={{fontSize: ms(11), marginTop: vs(4), textAlign: 'center'}}>{ch.name}</AppText>
                <AppText variant="small" style={{color: '#9ca3af', fontSize: ms(9), textAlign: 'center', marginTop: vs(2)}}>{ch.desc}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  // ─── 4. Joints Affected ──────────────────────────────────────────
  const renderJointsAffected = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">JOINTS AFFECTED</AppText>
      <AppText variant="caption" style={styles.sectionSub}>Select all involved</AppText>
      <View style={styles.card}>
        <View style={styles.jointGrid}>
          {JOINTS.map((j, i) => {
            const isActive = activeJoints.includes(j.name);
            return (
              <TouchableOpacity
                key={i}
                style={[styles.jointCell, isActive && styles.jointCellActive]}
                onPress={() => toggleArray(activeJoints, setActiveJoints, j.name)}
                activeOpacity={0.7}>
                <Icon name={j.icon} size={ms(16)} color={isActive ? Colors.primary : '#9ca3af'} />
                <AppText variant="small" style={{color: isActive ? Colors.primary : Colors.textSecondary, fontWeight: isActive ? '700' : '500', marginTop: vs(2), textAlign: 'center', fontSize: ms(9)}}>{j.name}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  // ─── 5. Symptoms ──────────────────────────────────────────────────
  const renderSymptoms = () => {
    const nightLabels = ['No', 'Mild', 'Mod', 'Sev'];
    const defaultLabels = ['0', '1', '2', '3'];
    return (
      <View style={styles.section}>
        <AppText variant="sectionTitle">SYMPTOMS</AppText>
        <AppText variant="caption" style={styles.sectionSub}>Rate: 0=None 1=Mild 2=Moderate 3=Severe</AppText>
        <View style={styles.card}>
          {SYMPTOMS_LIST.map((sym, idx) => {
            const currentVal = symptomScores[sym.name];
            const labels = sym.name === 'Night pain' ? nightLabels : defaultLabels;
            return (
              <View key={idx} style={[styles.symptomRow, idx < SYMPTOMS_LIST.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: '#f3f4f6'}]}>
                <View style={styles.symptomInfo}>
                  <Icon name={sym.icon} size={ms(18)} color={Colors.textSecondary} />
                  <View style={{marginLeft: s(8), flex: 1}}>
                    <AppText variant="bodyBold" style={{fontSize: ms(12)}}>{sym.name}</AppText>
                    <AppText variant="small" style={{color: Colors.textTertiary, fontSize: ms(9)}}>{sym.sub}</AppText>
                  </View>
                </View>
                <View style={styles.severityRow}>
                  {labels.map((lbl, sIdx) => {
                    const isActive = currentVal === sIdx;
                    const btnColor = sIdx === 0 ? '#d1fae5' : sIdx === 1 ? '#fef3c7' : sIdx === 2 ? '#fed7aa' : '#fee2e2';
                    const txtColor = sIdx === 0 ? '#065f46' : sIdx === 1 ? '#92400e' : sIdx === 2 ? '#9a3412' : '#991b1b';
                    return (
                      <TouchableOpacity
                        key={sIdx}
                        onPress={() => setSymptomScores(prev => ({...prev, [sym.name]: sIdx}))}
                        style={[styles.sevBtn, isActive && {backgroundColor: btnColor, borderColor: txtColor}]}
                        activeOpacity={0.7}>
                        <AppText variant="small" style={{fontSize: ms(9), fontWeight: isActive ? '700' : '500', color: isActive ? txtColor : Colors.textTertiary}}>{lbl}</AppText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            );
          })}
        </View>
      </View>
    );
  };

  // ─── 6. Morning Stiffness ─────────────────────────────────────────
  const renderMorningStiffness = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">MORNING STIFFNESS</AppText>
      <AppText variant="caption" style={styles.sectionSub}>Duration after waking {'\u00b7'} Key RA vs OA differentiator</AppText>
      <View style={styles.card}>
        <View style={styles.controlRow}>
          <AppText variant="body">How long before joint loosens after waking?</AppText>
          <AppText variant="bodyBold" style={{color: Colors.primary, fontSize: ms(16)}}>20 min</AppText>
        </View>
        <View style={styles.chipRow}>
          {STIFFNESS_OPTIONS.map((opt, i) => {
            const isActive = activeStiffness === opt.value;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => setActiveStiffness(opt.value)}
                style={[styles.chip, isActive && styles.chipActive]}
                activeOpacity={0.7}>
                <AppText variant="small" style={{color: isActive ? Colors.white : Colors.textSecondary, fontWeight: isActive ? '700' : '500'}}>
                  {opt.label}{opt.warn ? ' \u26a0\ufe0f RA' : ''}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={[styles.insightCard, {backgroundColor: Colors.amberBg, marginTop: vs(12)}]}>
          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <Icon name="information-circle-outline" size={ms(16)} color={Colors.amberText} />
            <AppText variant="small" style={{color: Colors.amberText, marginLeft: s(6), flex: 1, lineHeight: ms(18)}}>
              OA stiffness is typically brief ({'<'}30 min). RA stiffness is {'>'}45{'\u2013'}60 min and often a key differentiator. Track duration consistently for rheumatology review.
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );

  // ─── 7. When is pain worst? ───────────────────────────────────────
  const renderTimingPatterns = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">WHEN IS PAIN WORST?</AppText>
      <AppText variant="caption" style={styles.sectionSub}>Timing patterns</AppText>
      <View style={styles.chipRow}>
        {TIMING_OPTIONS.map((t, i) => {
          const isActive = activeTiming.includes(t);
          return (
            <TouchableOpacity
              key={i}
              onPress={() => toggleArray(activeTiming, setActiveTiming, t)}
              style={[styles.chip, isActive && styles.chipActive]}
              activeOpacity={0.7}>
              <AppText variant="small" style={{color: isActive ? Colors.white : Colors.textSecondary, fontWeight: isActive ? '700' : '500'}}>{t}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // ─── 8. Condition-Specific Panels ─────────────────────────────────
  const renderOAPanel = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">OA-SPECIFIC ASSESSMENT</AppText>
      <View style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>WOMAC Function</AppText>
        {WOMAC_QUESTIONS.map((wq, idx) => {
          const currentVal = womacScores[wq.q];
          return (
            <View key={idx} style={[styles.womacRow, idx < WOMAC_QUESTIONS.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: '#f3f4f6'}]}>
              <AppText variant="body" style={{fontSize: ms(12), flex: 1, marginRight: s(4)}}>{wq.q}</AppText>
              <View style={styles.womacBtns}>
                {WOMAC_LABELS.map((lbl, sIdx) => {
                  const isActive = currentVal === sIdx;
                  return (
                    <TouchableOpacity
                      key={sIdx}
                      onPress={() => setWomacScores(prev => ({...prev, [wq.q]: sIdx}))}
                      style={[styles.womacBtn, isActive && {backgroundColor: Colors.primary, borderColor: Colors.primary}]}
                      activeOpacity={0.7}>
                      <AppText variant="small" style={{fontSize: ms(8), color: isActive ? Colors.white : Colors.textTertiary, fontWeight: isActive ? '700' : '500'}}>{lbl}</AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          );
        })}
        <View style={styles.scoreFooter}>
          <AppText variant="bodyBold" style={{color: Colors.primary}}>Score: 28 / 100</AppText>
        </View>
      </View>
      <View style={[styles.insightCard, {backgroundColor: Colors.amberBg, marginTop: vs(10)}]}>
        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
          <Icon name="information-circle-outline" size={ms(16)} color={Colors.amberText} />
          <AppText variant="small" style={{color: Colors.amberText, marginLeft: s(6), flex: 1, lineHeight: ms(18)}}>
            OA context {'\u00b7'} Right knee {'\u00b7'} Weight management is the single most effective non-pharmacological intervention. Even 5% body weight loss reduces knee loading by ~20%. Consider BMI monitoring alongside this log.
          </AppText>
        </View>
      </View>
    </View>
  );

  const renderRAPanel = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">INFLAMMATORY / RA ASSESSMENT</AppText>
      <View style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>DAS28-like Quick Screen</AppText>
        {[
          {label: 'Tender joint count', value: raData.tender, key: 'tender'},
          {label: 'Swollen joint count', value: raData.swollen, key: 'swollen'},
          {label: 'Global activity (0\u201310)', value: raData.global, key: 'global'},
        ].map((item, idx) => (
          <View key={idx} style={[styles.raRow, idx < 2 && {borderBottomWidth: 0.5, borderBottomColor: '#f3f4f6'}]}>
            <AppText variant="body" style={{flex: 1, fontSize: ms(12)}}>{item.label}</AppText>
            <View style={styles.raValueBox}>
              <AppText variant="bodyBold" style={{color: Colors.primary, fontSize: ms(16)}}>{item.value}</AppText>
            </View>
          </View>
        ))}
        <AppText variant="bodyBold" style={{marginTop: vs(12), marginBottom: vs(6)}}>RA Medications</AppText>
        <View style={styles.chipRow}>
          {['Methotrexate', 'Hydroxychloroquine', 'Biologics', 'Prednisolone'].map((med, i) => {
            const isActive = raMeds.includes(med);
            return (
              <TouchableOpacity
                key={i}
                onPress={() => toggleArray(raMeds, setRaMeds, med)}
                style={[styles.chip, isActive && styles.chipActive]}
                activeOpacity={0.7}>
                <AppText variant="small" style={{color: isActive ? Colors.white : Colors.textSecondary, fontWeight: isActive ? '700' : '500'}}>{med}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    </View>
  );

  const renderOrthoPanel = () => {
    const steps = [
      {label: 'Surgery', status: 'done'},
      {label: 'Acute', status: 'done'},
      {label: 'Mobilise', status: 'done'},
      {label: 'Rehab', status: 'current'},
      {label: 'Return', status: 'pending'},
    ];
    return (
      <View style={styles.section}>
        <AppText variant="sectionTitle">POST-SURGICAL / ORTHO ASSESSMENT</AppText>
        <View style={styles.card}>
          <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>Milestone Track</AppText>
          <View style={styles.milestoneRow}>
            {steps.map((step, idx) => {
              const isDone = step.status === 'done';
              const isCurrent = step.status === 'current';
              const dotColor = isDone ? '#10b981' : isCurrent ? Colors.primary : '#d1d5db';
              return (
                <View key={idx} style={styles.milestoneItem}>
                  <View style={[styles.milestoneDot, {backgroundColor: dotColor}]}>
                    {isDone && <Icon name="checkmark" size={ms(10)} color={Colors.white} />}
                    {isCurrent && <Icon name="ellipse" size={ms(6)} color={Colors.white} />}
                  </View>
                  {idx < steps.length - 1 && (
                    <View style={[styles.milestoneLine, {backgroundColor: isDone ? '#10b981' : '#d1d5db'}]} />
                  )}
                  <AppText variant="small" style={{fontSize: ms(9), color: isCurrent ? Colors.primary : Colors.textSecondary, fontWeight: isCurrent ? '700' : '500', marginTop: vs(4), textAlign: 'center'}}>{step.label}</AppText>
                </View>
              );
            })}
          </View>
        </View>
        <View style={[styles.insightCard, {backgroundColor: Colors.tealBg, marginTop: vs(10)}]}>
          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <Icon name="checkmark-circle-outline" size={ms(16)} color={Colors.tealText} />
            <AppText variant="small" style={{color: Colors.tealText, marginLeft: s(6), flex: 1, lineHeight: ms(18)}}>
              Post-surgical status: Rehabilitation phase. Continue supervised physiotherapy and track ROM progress weekly.
            </AppText>
          </View>
        </View>
      </View>
    );
  };

  const renderFMPanel = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">FIBROMYALGIA ASSESSMENT</AppText>
      <View style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(6)}}>Widespread Pain Index (WPI)</AppText>
        <AppText variant="caption" style={{color: Colors.textTertiary, marginBottom: vs(8)}}>Select all painful body regions</AppText>
        <View style={styles.chipRow}>
          {FM_REGIONS.map((reg, i) => {
            const isActive = fmActive.includes(reg);
            return (
              <View key={i} style={[styles.chip, isActive && styles.chipActive]}>
                <AppText variant="small" style={{color: isActive ? Colors.white : Colors.textSecondary, fontWeight: isActive ? '700' : '500', fontSize: ms(9)}}>{reg}</AppText>
              </View>
            );
          })}
        </View>
        <View style={styles.scoreFooter}>
          <AppText variant="bodyBold" style={{color: Colors.primary}}>WPI Score: 4 / 19</AppText>
        </View>
      </View>
      <View style={[styles.insightCard, {backgroundColor: Colors.blueBg, marginTop: vs(10)}]}>
        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
          <Icon name="information-circle-outline" size={ms(16)} color={Colors.blueText} />
          <AppText variant="small" style={{color: Colors.blueText, marginLeft: s(6), flex: 1, lineHeight: ms(18)}}>
            Fibromyalgia: WPI {'\u2265'}7 and SSS {'\u2265'}5, or WPI 4{'\u2013'}6 and SSS {'\u2265'}9, supports FM diagnosis (2016 criteria). Track both indices consistently.
          </AppText>
        </View>
      </View>
    </View>
  );

  const renderGoutPanel = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">GOUT / CRYSTAL ASSESSMENT</AppText>
      <View style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(6)}}>Flare Assessment</AppText>
        <View style={styles.chipRow}>
          {['Active flare', 'Intercritical', 'Chronic'].map((phase, i) => {
            const isActive = goutPhase === phase;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => setGoutPhase(phase)}
                style={[styles.chip, isActive && styles.chipActive]}
                activeOpacity={0.7}>
                <AppText variant="small" style={{color: isActive ? Colors.white : Colors.textSecondary, fontWeight: isActive ? '700' : '500'}}>{phase}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <AppText variant="bodyBold" style={{marginTop: vs(12), marginBottom: vs(6)}}>ULT Therapy</AppText>
        <View style={styles.chipRow}>
          {['Allopurinol', 'Febuxostat', 'Probenecid', 'None'].map((ult, i) => {
            const isActive = goutUlt.includes(ult);
            return (
              <TouchableOpacity
                key={i}
                onPress={() => toggleArray(goutUlt, setGoutUlt, ult)}
                style={[styles.chip, isActive && styles.chipActive]}
                activeOpacity={0.7}>
                <AppText variant="small" style={{color: isActive ? Colors.white : Colors.textSecondary, fontWeight: isActive ? '700' : '500'}}>{ult}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <AppText variant="bodyBold" style={{marginTop: vs(12), marginBottom: vs(6)}}>Triggers</AppText>
        <View style={styles.chipRow}>
          {['Alcohol', 'High purine', 'Dehydration', 'Exercise', 'Diuretics'].map((trig, i) => {
            const isActive = goutTriggers.includes(trig);
            return (
              <TouchableOpacity
                key={i}
                onPress={() => toggleArray(goutTriggers, setGoutTriggers, trig)}
                style={[styles.chip, isActive && styles.chipActive]}
                activeOpacity={0.7}>
                <AppText variant="small" style={{color: isActive ? Colors.white : Colors.textSecondary, fontWeight: isActive ? '700' : '500'}}>{trig}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
      <View style={[styles.insightCard, {backgroundColor: Colors.redBg, marginTop: vs(10)}]}>
        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
          <Icon name="warning-outline" size={ms(16)} color={Colors.redText} />
          <AppText variant="small" style={{color: Colors.redText, marginLeft: s(6), flex: 1, lineHeight: ms(18)}}>
            Gout management: Target serum urate {'<'}0.36 mmol/L ({'\u2264'}6 mg/dL). In intercritical phase, continue ULT and monitor. Avoid triggers and maintain hydration.
          </AppText>
        </View>
      </View>
    </View>
  );

  const renderSportsPanel = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">SPORTS / TENDON ASSESSMENT</AppText>
      <View style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>VISA-A Style Questions</AppText>
        {[
          {label: 'Walking (30 min) without pain', key: 'walking', value: sportsScores.walking},
          {label: 'Single-leg calf raises (pain-free reps)', key: 'calfRaises', value: sportsScores.calfRaises},
          {label: 'Running ability (0\u201310)', key: 'running', value: sportsScores.running},
        ].map((item, idx) => (
          <View key={idx} style={[styles.raRow, idx < 2 && {borderBottomWidth: 0.5, borderBottomColor: '#f3f4f6'}]}>
            <AppText variant="body" style={{flex: 1, fontSize: ms(12)}}>{item.label}</AppText>
            <View style={styles.raValueBox}>
              <AppText variant="bodyBold" style={{color: Colors.primary, fontSize: ms(16)}}>{item.value}</AppText>
            </View>
          </View>
        ))}
      </View>
      <View style={[styles.insightCard, {backgroundColor: Colors.tealBg, marginTop: vs(10)}]}>
        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
          <Icon name="fitness-outline" size={ms(16)} color={Colors.tealText} />
          <AppText variant="small" style={{color: Colors.tealText, marginLeft: s(6), flex: 1, lineHeight: ms(18)}}>
            Tendinopathy management: Progressive loading is key. Isometric holds for pain relief, then eccentric loading. Avoid complete rest.
          </AppText>
        </View>
      </View>
    </View>
  );

  const renderSpinePanel = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">SPINE / DISC ASSESSMENT</AppText>
      <View style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>Radiculopathy Screen</AppText>
        {[
          {label: 'Leg radiation', key: 'leg', value: spineRadiation.leg},
          {label: 'Arm radiation', key: 'arm', value: spineRadiation.arm},
          {label: 'Pins & needles', key: 'pins', value: spineRadiation.pins},
        ].map((item, idx) => (
          <View key={idx} style={[styles.symptomRow, idx < 2 && {borderBottomWidth: 0.5, borderBottomColor: '#f3f4f6'}]}>
            <AppText variant="body" style={{flex: 1, fontSize: ms(12)}}>{item.label}</AppText>
            <View style={styles.severityRow}>
              {['None', 'Mild', 'Mod', 'Sev'].map((lbl, sIdx) => {
                const isActive = item.value === sIdx;
                const btnColor = sIdx === 0 ? '#d1fae5' : sIdx === 1 ? '#fef3c7' : sIdx === 2 ? '#fed7aa' : '#fee2e2';
                const txtColor = sIdx === 0 ? '#065f46' : sIdx === 1 ? '#92400e' : sIdx === 2 ? '#9a3412' : '#991b1b';
                return (
                  <TouchableOpacity
                    key={sIdx}
                    onPress={() => setSpineRadiation(prev => ({...prev, [item.key]: sIdx}))}
                    style={[styles.sevBtn, isActive && {backgroundColor: btnColor, borderColor: txtColor}]}
                    activeOpacity={0.7}>
                    <AppText variant="small" style={{fontSize: ms(9), fontWeight: isActive ? '700' : '500', color: isActive ? txtColor : Colors.textTertiary}}>{lbl}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </View>
      <View style={[styles.insightCard, {backgroundColor: Colors.redBg, marginTop: vs(10)}]}>
        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
          <Icon name="alert-circle-outline" size={ms(16)} color={Colors.redText} />
          <View style={{marginLeft: s(6), flex: 1}}>
            <AppText variant="bodyBold" style={{color: Colors.redText, marginBottom: vs(4)}}>Red Flag Warning</AppText>
            <AppText variant="small" style={{color: Colors.redText, lineHeight: ms(18)}}>
              Seek urgent medical review if: bilateral leg weakness, bladder or bowel dysfunction, saddle area numbness, progressive neurological deficit, or severe unremitting pain. These may indicate cauda equina syndrome.
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );

  const renderConditionPanel = () => {
    switch (activeCondition) {
      case 'oa': return renderOAPanel();
      case 'ra': return renderRAPanel();
      case 'ortho': return renderOrthoPanel();
      case 'fm': return renderFMPanel();
      case 'gout': return renderGoutPanel();
      case 'sports': return renderSportsPanel();
      case 'spine': return renderSpinePanel();
      default: return null;
    }
  };

  // ─── 9. Functional Impact ─────────────────────────────────────────
  const renderFunctionalImpact = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">FUNCTIONAL IMPACT TODAY</AppText>
      <View style={styles.chipRow}>
        {FUNCTIONAL_TAGS.map((tag, i) => {
          const isActive = activeFunctional.includes(tag);
          return (
            <TouchableOpacity
              key={i}
              onPress={() => toggleArray(activeFunctional, setActiveFunctional, tag)}
              style={[styles.chip, isActive && styles.chipActive]}
              activeOpacity={0.7}>
              <AppText variant="small" style={{color: isActive ? Colors.white : Colors.textSecondary, fontWeight: isActive ? '700' : '500'}}>{tag}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // ─── 10. Walking Distance ─────────────────────────────────────────
  const renderWalkingDistance = () => (
    <View style={styles.section}>
      <View style={styles.card}>
        <View style={styles.controlRow}>
          <AppText variant="bodyBold">Max walking distance today</AppText>
          <AppText variant="bodyBold" style={{color: Colors.primary, fontSize: ms(18)}}>500 m</AppText>
        </View>
        {/* Progress bar */}
        <View style={styles.progressTrack}>
          <View style={[styles.progressFill, {width: '25%'}]} />
        </View>
        <View style={styles.scaleRow}>
          <AppText variant="small" style={styles.scaleLabel}>0m</AppText>
          <AppText variant="small" style={styles.scaleLabel}>500m</AppText>
          <AppText variant="small" style={styles.scaleLabel}>1km</AppText>
          <AppText variant="small" style={styles.scaleLabel}>2km</AppText>
          <AppText variant="small" style={styles.scaleLabel}>5km+</AppText>
        </View>
      </View>
    </View>
  );

  // ─── 11. Medications ──────────────────────────────────────────────
  const renderMedications = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">MEDICATIONS TAKEN TODAY</AppText>
      <View style={styles.card}>
        {MEDICATIONS.map((med, idx) => (
          <View key={idx} style={[styles.medRow, idx < MEDICATIONS.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: '#f3f4f6'}]}>
            <View style={styles.medInfo}>
              <Icon name={med.icon} size={ms(20)} color={Colors.textSecondary} />
              <View style={{marginLeft: s(8), flex: 1}}>
                <AppText variant="bodyBold" style={{fontSize: ms(12)}}>{med.name}</AppText>
                <AppText variant="small" style={{color: Colors.textTertiary, fontSize: ms(10), marginTop: vs(2)}}>{med.desc}</AppText>
              </View>
            </View>
            <View style={{marginTop: vs(4), alignItems: 'flex-end'}}>
              {med.badge && renderBadge(med.badge, med.badgeColor)}
              {med.action && (
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                  <AppText variant="small" style={{color: Colors.primary, fontWeight: '600'}}>{med.action}</AppText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  // ─── 12. Physiotherapy ────────────────────────────────────────────
  const renderPhysiotherapy = () => {
    const doneCount = Object.values(exercisesDone).filter(Boolean).length;
    return (
      <View style={styles.section}>
        <AppText variant="sectionTitle">PHYSIOTHERAPY EXERCISES</AppText>
        <AppText variant="caption" style={styles.sectionSub}>Tap to mark done</AppText>
        <View style={styles.card}>
          {EXERCISES.map((ex, idx) => {
            const isDone = exercisesDone[ex.name];
            return (
              <TouchableOpacity
                key={idx}
                onPress={() => setExercisesDone(prev => ({...prev, [ex.name]: !prev[ex.name]}))}
                style={[styles.exerciseRow, idx < EXERCISES.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: '#f3f4f6'}]}
                activeOpacity={0.7}>
                <View style={[styles.checkbox, isDone && styles.checkboxDone]}>
                  {isDone && <Icon name="checkmark" size={ms(12)} color={Colors.white} />}
                </View>
                <View style={{flex: 1, marginLeft: s(10)}}>
                  <AppText variant="body" style={[{fontSize: ms(12)}, isDone && {textDecorationLine: 'line-through', color: Colors.textTertiary}]}>{ex.name}</AppText>
                </View>
                <AppText variant="small" style={{color: Colors.textTertiary}}>{ex.detail}</AppText>
              </TouchableOpacity>
            );
          })}
          <View style={[styles.scoreFooter, {marginTop: vs(8)}]}>
            <AppText variant="bodyBold" style={{color: Colors.primary}}>Completed today: {doneCount} of {EXERCISES.length}</AppText>
          </View>
        </View>
      </View>
    );
  };

  // ─── 13. What Changed Today? ──────────────────────────────────────
  const renderChanges = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">WHAT CHANGED TODAY?</AppText>
      <View style={styles.chipRow}>
        {CHANGE_TAGS.map((tag, i) => {
          const isActive = activeChanges.includes(tag);
          return (
            <TouchableOpacity
              key={i}
              onPress={() => toggleArray(activeChanges, setActiveChanges, tag)}
              style={[styles.chip, isActive && styles.chipActive]}
              activeOpacity={0.7}>
              <AppText variant="small" style={{color: isActive ? Colors.white : Colors.textSecondary, fontWeight: isActive ? '700' : '500'}}>{tag}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  // ─── 14. Comparison ───────────────────────────────────────────────
  const renderComparison = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">HOW THIS COMPARES</AppText>
      <View style={styles.card}>
        {COMPARISON_ROWS.map((row, idx) => (
          <View key={idx} style={[styles.compRow, idx < COMPARISON_ROWS.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: '#f3f4f6'}]}>
            <AppText variant="body" style={{flex: 1.2, fontSize: ms(12)}}>{row.label}</AppText>
            <AppText variant="small" style={{flex: 1, color: Colors.textTertiary, textAlign: 'center'}}>{row.prev}</AppText>
            <Icon name="arrow-forward-outline" size={ms(12)} color={Colors.textTertiary} />
            <AppText variant="bodyBold" style={{flex: 1, fontSize: ms(12), color: row.color || Colors.textPrimary, textAlign: 'center', marginLeft: s(4)}}>{row.curr}</AppText>
          </View>
        ))}
      </View>
    </View>
  );

  // ─── 15. Improvement Insight ──────────────────────────────────────
  const renderImprovementInsight = () => (
    <View style={styles.section}>
      <View style={[styles.insightCard, {backgroundColor: Colors.tealBg}]}>
        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
          <Icon name="trending-up-outline" size={ms(16)} color={Colors.tealText} />
          <AppText variant="small" style={{color: Colors.tealText, marginLeft: s(6), flex: 1, lineHeight: ms(18)}}>
            Steady improvement trend: Pain reduced from 5/10 to 3/10 over 3 weeks. Walking distance up 150%. Morning stiffness decreasing. Continue current physiotherapy programme and weight management.
          </AppText>
        </View>
      </View>
    </View>
  );

  // ─── 16. History ──────────────────────────────────────────────────
  const renderHistory = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">RECENT LOG HISTORY</AppText>
      <View style={styles.card}>
        {/* Header */}
        <View style={styles.histRow}>
          <AppText variant="small" style={[styles.histCol, {flex: 1.2, fontWeight: '700'}]}>Date</AppText>
          <AppText variant="small" style={[styles.histCol, {fontWeight: '700'}]}>Pain</AppText>
          <AppText variant="small" style={[styles.histCol, {fontWeight: '700'}]}>Stiff</AppText>
          <AppText variant="small" style={[styles.histCol, {fontWeight: '700'}]}>Walk</AppText>
          <AppText variant="small" style={[styles.histCol, {fontWeight: '700'}]}>Physio</AppText>
        </View>
        {HISTORY_ROWS.map((row, idx) => (
          <View key={idx} style={[styles.histRow, row.highlight && {backgroundColor: Colors.tealBg, borderRadius: ms(6)}]}>
            <AppText variant="small" style={[styles.histCol, {flex: 1.2, fontWeight: row.highlight ? '700' : '500'}]}>{row.date}</AppText>
            <AppText variant="small" style={[styles.histCol, row.painRed && {color: Colors.red, fontWeight: '700'}]}>{row.pain}</AppText>
            <AppText variant="small" style={styles.histCol}>{row.stiff}</AppText>
            <AppText variant="small" style={styles.histCol}>{row.walk}</AppText>
            <AppText variant="small" style={styles.histCol}>{row.physio}</AppText>
          </View>
        ))}
      </View>
    </View>
  );

  // ─── 17. Notes ────────────────────────────────────────────────────
  const renderNotes = () => (
    <View style={styles.section}>
      <AppText variant="sectionTitle">NOTES</AppText>
      <View style={styles.card}>
        <TextInput
          style={styles.notesInput}
          placeholder="e.g. Right knee felt better after hot soak last night. Stairs still tricky going down. Tried new cushioned insoles today..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          textAlignVertical="top"
          value={notes}
          onChangeText={setNotes}
        />
      </View>
    </View>
  );

  // ─── Main Render ──────────────────────────────────────────────────
  return (
    <View>
      {renderBodyMap()}
      {renderPainScale()}
      {renderPainCharacter()}
      {renderJointsAffected()}
      {renderSymptoms()}
      {renderMorningStiffness()}
      {renderTimingPatterns()}
      {renderConditionPanel()}
      {renderFunctionalImpact()}
      {renderWalkingDistance()}
      {renderMedications()}
      {renderPhysiotherapy()}
      {renderChanges()}
      {renderComparison()}
      {renderImprovementInsight()}
      {renderHistory()}
      {renderNotes()}
    </View>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────
const styles = StyleSheet.create({
  section: {
    marginTop: vs(16),
  },
  sectionSub: {
    color: Colors.textTertiary,
    marginTop: vs(2),
    marginBottom: vs(8),
  },
  card: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(14),
    backgroundColor: Colors.white,
  },
  controlRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(8),
  },
  toggleRow: {
    flexDirection: 'row',
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(8),
    overflow: 'hidden',
  },
  toggleBtn: {
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    backgroundColor: Colors.white,
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
  },

  // Legend
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: vs(8),
    paddingTop: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: '#f3f4f6',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    marginRight: s(4),
  },

  // Chips
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
    backgroundColor: Colors.white,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // Badge
  badge: {
    borderRadius: ms(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    marginTop: vs(3),
  },

  // Insight
  insightCard: {
    borderRadius: ms(14),
    padding: ms(14),
  },

  // Pain bars
  painBarRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  painBarCol: {
    alignItems: 'center',
    flex: 1,
    paddingVertical: vs(4),
    borderRadius: ms(6),
  },
  painBarColActive: {
    backgroundColor: '#f3f4f6',
  },
  painBar: {
    width: ms(16),
    borderRadius: ms(4),
  },
  painBarNum: {
    marginTop: vs(4),
    fontSize: ms(10),
    color: Colors.textSecondary,
  },

  // Pain character grid
  charGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  charCell: {
    width: '31%',
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(10),
    padding: ms(10),
    marginBottom: vs(8),
    alignItems: 'center',
  },
  charCellActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.tealBg,
  },

  // Joints grid
  jointGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  jointCell: {
    width: '23%',
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(10),
    padding: ms(8),
    marginBottom: vs(6),
    alignItems: 'center',
  },
  jointCellActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.tealBg,
  },

  // Symptoms
  symptomRow: {
    paddingVertical: vs(10),
  },
  symptomInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  severityRow: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: s(4),
  },
  sevBtn: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(6),
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    backgroundColor: Colors.white,
  },

  // WOMAC
  womacRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  womacBtns: {
    flexDirection: 'row',
    gap: s(3),
  },
  womacBtn: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(6),
    paddingHorizontal: s(6),
    paddingVertical: vs(4),
    backgroundColor: Colors.white,
  },
  scoreFooter: {
    marginTop: vs(10),
    paddingTop: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: '#f3f4f6',
    alignItems: 'center',
  },

  // RA
  raRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  raValueBox: {
    backgroundColor: '#f0f7f4',
    borderRadius: ms(8),
    paddingHorizontal: s(12),
    paddingVertical: vs(4),
    minWidth: s(44),
    alignItems: 'center',
  },

  // Milestones
  milestoneRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingHorizontal: s(4),
  },
  milestoneItem: {
    alignItems: 'center',
    flex: 1,
  },
  milestoneDot: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(11),
    alignItems: 'center',
    justifyContent: 'center',
  },
  milestoneLine: {
    position: 'absolute',
    top: ms(10),
    left: '60%',
    right: '-40%',
    height: 2,
  },

  // Walking distance
  progressTrack: {
    height: vs(10),
    backgroundColor: '#e5e7eb',
    borderRadius: ms(5),
    marginTop: vs(10),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: ms(5),
    backgroundColor: '#10b981',
  },
  scaleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(6),
  },
  scaleLabel: {
    fontSize: ms(9),
    color: Colors.textTertiary,
  },

  // Medications
  medRow: {
    paddingVertical: vs(10),
  },
  medInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  actionBtn: {
    marginTop: vs(4),
    borderWidth: 0.5,
    borderColor: Colors.primary,
    borderRadius: ms(6),
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
  },

  // Exercises
  exerciseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  checkbox: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(6),
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxDone: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // Comparison
  compRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
  },

  // History
  histRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(6),
    paddingHorizontal: s(4),
  },
  histCol: {
    flex: 1,
    fontSize: ms(10),
    color: Colors.textSecondary,
    textAlign: 'center',
  },

  // Notes
  notesInput: {
    minHeight: vs(100),
    fontSize: ms(13),
    color: '#374151',
    lineHeight: ms(20),
  },
});

export default MSKManualView;
