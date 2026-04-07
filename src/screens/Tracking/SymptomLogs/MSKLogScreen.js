import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Svg, {Ellipse, Rect as SvgRect, Circle as SvgCircle} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

// ──────────────────────────────────────────────
// Constants & Data
// ──────────────────────────────────────────────

const FRONT_ZONES = [
  {id: 'head', label: 'Head', type: 'ellipse', cx: 60, cy: 18, rx: 14, ry: 16},
  {id: 'neck', label: 'Neck', type: 'rect', x: 53, y: 33, w: 14, h: 10, r: 4},
  {id: 'lshoulder', label: 'Left shoulder', type: 'ellipse', cx: 30, cy: 50, rx: 11, ry: 9},
  {id: 'rshoulder', label: 'Right shoulder', type: 'ellipse', cx: 90, cy: 50, rx: 11, ry: 9},
  {id: 'chest', label: 'Chest', type: 'rect', x: 38, y: 43, w: 44, h: 28, r: 5},
  {id: 'lupperarm', label: 'Left upper arm', type: 'rect', x: 18, y: 58, w: 11, h: 22, r: 5},
  {id: 'rupperarm', label: 'Right upper arm', type: 'rect', x: 91, y: 58, w: 11, h: 22, r: 5},
  {id: 'abdomen', label: 'Abdomen', type: 'rect', x: 38, y: 71, w: 44, h: 22, r: 4},
  {id: 'lelbow', label: 'Left elbow', type: 'circle', cx: 23, cy: 83, r: 6},
  {id: 'relbow', label: 'Right elbow', type: 'circle', cx: 97, cy: 83, r: 6},
  {id: 'lforearm', label: 'Left forearm', type: 'rect', x: 16, y: 90, w: 11, h: 18, r: 4},
  {id: 'rforearm', label: 'Right forearm', type: 'rect', x: 93, y: 90, w: 11, h: 18, r: 4},
  {id: 'pelvis', label: 'Lower back / Pelvis', type: 'rect', x: 35, y: 93, w: 50, h: 18, r: 5},
  {id: 'lwrist', label: 'Left wrist & hand', type: 'ellipse', cx: 22, cy: 115, rx: 8, ry: 7},
  {id: 'rwrist', label: 'Right wrist & hand', type: 'ellipse', cx: 98, cy: 115, rx: 8, ry: 7},
  {id: 'lthigh', label: 'Left thigh', type: 'rect', x: 35, y: 112, w: 18, h: 32, r: 6},
  {id: 'rthigh', label: 'Right thigh', type: 'rect', x: 67, y: 112, w: 18, h: 32, r: 6},
  {id: 'lknee', label: 'Left knee', type: 'circle', cx: 44, cy: 150, r: 8},
  {id: 'rknee', label: 'Right knee', type: 'circle', cx: 76, cy: 150, r: 8},
  {id: 'lshin', label: 'Left shin', type: 'rect', x: 36, y: 159, w: 16, h: 28, r: 5},
  {id: 'rshin', label: 'Right shin', type: 'rect', x: 68, y: 159, w: 16, h: 28, r: 5},
  {id: 'lankle', label: 'Left ankle & foot', type: 'ellipse', cx: 44, cy: 195, rx: 10, ry: 7},
  {id: 'rankle', label: 'Right ankle & foot', type: 'ellipse', cx: 76, cy: 195, rx: 10, ry: 7},
];

const BACK_ZONES = [
  {id: 'bhead', label: 'Head (back)', type: 'ellipse', cx: 60, cy: 18, rx: 14, ry: 16},
  {id: 'bneck', label: 'Neck (back)', type: 'rect', x: 53, y: 33, w: 14, h: 10, r: 4},
  {id: 'blshoulder', label: 'Left shoulder (back)', type: 'ellipse', cx: 30, cy: 50, rx: 11, ry: 9},
  {id: 'brshoulder', label: 'Right shoulder (back)', type: 'ellipse', cx: 90, cy: 50, rx: 11, ry: 9},
  {id: 'upperback', label: 'Upper back', type: 'rect', x: 38, y: 43, w: 44, h: 28, r: 5},
  {id: 'lowerback', label: 'Lower back', type: 'rect', x: 38, y: 71, w: 44, h: 22, r: 4},
  {id: 'sacrum', label: 'Lower back / Sacrum', type: 'rect', x: 35, y: 93, w: 50, h: 18, r: 5},
  {id: 'blglute', label: 'Left glute / hip', type: 'rect', x: 35, y: 112, w: 18, h: 32, r: 6},
  {id: 'brglute', label: 'Right glute / hip', type: 'rect', x: 67, y: 112, w: 18, h: 32, r: 6},
  {id: 'blknee', label: 'Left knee (back)', type: 'ellipse', cx: 44, cy: 150, rx: 8, ry: 8},
  {id: 'brknee', label: 'Right knee (back)', type: 'ellipse', cx: 76, cy: 150, rx: 8, ry: 8},
  {id: 'blcalf', label: 'Left calf', type: 'rect', x: 36, y: 159, w: 16, h: 28, r: 5},
  {id: 'brcalf', label: 'Right calf', type: 'rect', x: 68, y: 159, w: 16, h: 28, r: 5},
  {id: 'blheel', label: 'Left heel / Achilles', type: 'ellipse', cx: 44, cy: 195, rx: 10, ry: 7},
  {id: 'brheel', label: 'Right heel / Achilles', type: 'ellipse', cx: 76, cy: 195, rx: 10, ry: 7},
];

const PAIN_COLORS = ['#1D9E75', '#52B788', '#84CC16', '#A3D977', '#F0B429', '#F97316', '#FB923C', '#E24B4A', '#C0392B', '#991B1B', '#7F1D1D'];
const PAIN_DESC = ['No pain', 'Minimal', 'Mild', 'Mild', 'Moderate', 'Moderate', 'Moderate-severe', 'Severe', 'Severe', 'Very severe', 'Worst possible'];

const PAIN_CHARS = [
  'Sharp / stabbing', 'Dull / aching', 'Burning', 'Stiffness', 'Throbbing',
  'Shooting / radiating', 'Cramping', 'Deep pressure', 'Pins & needles',
];

const WHEN_HURTS = [
  'On movement', 'At rest', 'Night pain', 'Constant', 'Weight-bearing',
  'Morning stiffness', 'Weather changes', 'After sitting long', 'After activity',
];

const FUNCTIONAL_IMPACT = [
  'Difficulty walking', "Can't climb stairs", "Can't sit/stand from chair",
  "Can't run or jog", 'Affects sleep', "Can't lift or carry",
  'Affects work / typing', 'Grip weakness', 'Limited range of motion',
  "Can't kneel / squat", 'Fully functional today',
];

const ASSOC_SYMPTOMS = [
  'Swelling', 'Warmth / redness', 'Clicking / crepitus', 'Locking or giving way',
  'Numbness', 'Tingling', 'Muscle weakness', 'Muscle spasm', 'Bruising',
  'Joint feels unstable', 'None of these',
];

const ONSET_DURATION = [
  'Just started (today)', 'Days (2-7d)', 'Weeks (1-6w)', 'Months (6w-3m)', 'Chronic (3m+)',
];

const ONSET_HOW = [
  'Sudden during activity', 'Gradual / slow onset', 'After injury / fall', 'Woke up with it', 'Unknown',
];

const TRIGGERS = [
  'Exercise / sport', 'Prolonged sitting', 'Prolonged standing', 'Heavy lifting',
  'Poor posture / desk work', 'Long drive', 'Cold / damp weather',
  'Walking on uneven ground', 'Overuse / repetitive motion', 'Stress / muscle tension',
];

const WHAT_HELPS = [
  'Ice / cold pack', 'Heat pad', 'Rest', 'NSAIDs (Ibuprofen)', 'Paracetamol',
  'Gentle stretching', 'Light walking', 'Compression / brace', 'Massage',
  'Elevating the limb', 'Nothing helps today',
];

const TREATMENT_USED = [
  'RICE (rest/ice)', 'Medication taken', 'Physiotherapy session', 'Yoga / stretching',
  'Brace / support worn', 'Injection (corticosteroid)', 'Hydrotherapy',
  'Awaiting appointment', 'None yet',
];

const RED_FLAGS = [
  'Severe unrelenting pain at rest or night pain waking you from sleep',
  'Unexplained weight loss alongside joint or muscle pain',
  'Fever, hot swollen joint (possible septic arthritis - emergency)',
  'Bladder or bowel dysfunction with back pain (cauda equina - emergency)',
  'Numbness or weakness in both legs',
  'Pain following a fall, injury, or trauma',
  'History of cancer with new bone pain',
  'Significant swelling with inability to weight-bear',
];

const SLEEP_IMPACT = [
  'Woke due to pain', "Couldn't find comfortable position", 'Slept fine despite pain',
  'Pain worse after lying', 'Stiff on waking',
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const Section = ({title}) => (
  <View style={st.sec}>
    <AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{title}</AppText>
    <View style={st.secLine} />
  </View>
);

const ChipGroup = ({items, selected, onToggle, chipStyle}) => (
  <View style={st.chipWrap}>
    {items.map((item, i) => {
      const isOn = selected.includes(i);
      const base = chipStyle || 'default';
      const bg = isOn ? CHIP_STYLES[base].bg : '#fff';
      const color = isOn ? CHIP_STYLES[base].color : '#555';
      const border = isOn ? CHIP_STYLES[base].border : '#E5DDD3';
      return (
        <TouchableOpacity key={i} style={[st.mchip, {backgroundColor: bg, borderColor: border}]} onPress={() => onToggle(i)} activeOpacity={0.7}>
          <AppText variant="caption" color={color} style={{fontWeight: isOn ? '700' : '500'}}>{item}</AppText>
        </TouchableOpacity>
      );
    })}
  </View>
);

const CHIP_STYLES = {
  pain: {bg: '#FEF0F0', color: '#7F1D1D', border: '#FDA4A4'},
  time: {bg: '#EFF6FF', color: '#1E3A5F', border: '#93C5FD'},
  func: {bg: '#FFF7ED', color: '#7C3010', border: '#FBB97A'},
  assoc: {bg: '#F4F3FF', color: '#3730A3', border: '#A5B4FC'},
  good: {bg: '#ECFDF5', color: '#064E3B', border: '#6EE7B7'},
  trig: {bg: '#FEF0F0', color: '#7F1D1D', border: '#FDA4A4'},
  treat: {bg: '#F0FDF4', color: '#14532D', border: '#86EFAC'},
  default: {bg: '#EFF6FF', color: '#1E3A5F', border: '#93C5FD'},
};

const SingleSelect = ({items, selected, onSelect, chipStyle}) => (
  <View style={st.chipWrap}>
    {items.map((item, i) => {
      const isOn = selected === i;
      const base = chipStyle || 'default';
      const bg = isOn ? CHIP_STYLES[base].bg : '#fff';
      const color = isOn ? CHIP_STYLES[base].color : '#555';
      const border = isOn ? CHIP_STYLES[base].border : '#E5DDD3';
      return (
        <TouchableOpacity key={i} style={[st.mchip, {backgroundColor: bg, borderColor: border}]} onPress={() => onSelect(i)} activeOpacity={0.7}>
          <AppText variant="caption" color={color} style={{fontWeight: isOn ? '700' : '500'}}>{item}</AppText>
        </TouchableOpacity>
      );
    })}
  </View>
);

const BodyMapZone = ({zone, isSelected, onPress}) => {
  const fill = isSelected ? 'rgba(217,115,22,0.35)' : 'rgba(255,255,255,0.12)';
  const stroke = isSelected ? '#D97316' : 'rgba(255,255,255,0.25)';
  const sw = isSelected ? 1.5 : 1;

  const handlePress = () => onPress(zone.label);

  if (zone.type === 'ellipse') {
    return <Ellipse cx={zone.cx} cy={zone.cy} rx={zone.rx} ry={zone.ry} fill={fill} stroke={stroke} strokeWidth={sw} onPress={handlePress} />;
  }
  if (zone.type === 'circle') {
    return <SvgCircle cx={zone.cx} cy={zone.cy} r={zone.r} fill={fill} stroke={stroke} strokeWidth={sw} onPress={handlePress} />;
  }
  return <SvgRect x={zone.x} y={zone.y} width={zone.w} height={zone.h} rx={zone.r} fill={fill} stroke={stroke} strokeWidth={sw} onPress={handlePress} />;
};

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const MSKLogScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [mapView, setMapView] = useState('front');
  const [selectedRegions, setSelectedRegions] = useState(['Left knee']);
  const [painLevel, setPainLevel] = useState(5);
  const [painChars, setPainChars] = useState([0, 3]);
  const [whenHurts, setWhenHurts] = useState([0, 2, 8]);
  const [funcImpact, setFuncImpact] = useState([0, 2]);
  const [assocSymps, setAssocSymps] = useState([0, 2]);
  const [onsetDur, setOnsetDur] = useState(2);
  const [onsetHow, setOnsetHow] = useState(1);
  const [triggers, setTriggers] = useState([1, 2, 7]);
  const [whatHelps, setWhatHelps] = useState([0, 2]);
  const [treatment, setTreatment] = useState([0]);
  const [redFlags, setRedFlags] = useState([7]);
  const [sleepImpact, setSleepImpact] = useState([0]);
  const [notes, setNotes] = useState('Left knee been sore since last week\'s walk on uneven ground. Swelling worse by evening. Noticed clicking when climbing stairs. Lower back also tight from sitting at desk today.');

  const toggleMulti = (arr, setArr, idx) => {
    setArr(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const toggleRegion = (label) => {
    setSelectedRegions(prev =>
      prev.includes(label) ? prev.filter(r => r !== label) : [...prev, label]
    );
  };

  const toggleRedFlag = (idx) => {
    setRedFlags(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const zones = mapView === 'front' ? FRONT_ZONES : BACK_ZONES;

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Fixed Header ── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={st.headerTitle}>Musculoskeletal log</AppText>
            <AppText variant="caption" style={st.headerSub}>28 Mar - Day 1</AppText>
          </View>
        </View>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Scrollable header content (green bg) */}
        <View style={st.scrollableHeader}>
          <AppText variant="screenName" color={Colors.white} style={{marginBottom: vs(4)}}>
            Where does it <AppText variant="screenName" color={Colors.accent}>hurt?</AppText>
          </AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.4)" style={{marginBottom: vs(12)}}>Tap your body or select a region below.</AppText>

          {/* Body map */}
          <View style={st.bodyMapWrap}>
            <View style={st.bodyMapTabs}>
              <TouchableOpacity style={[st.bmt, mapView === 'front' && st.bmtOn]} onPress={() => setMapView('front')} activeOpacity={0.7}>
                <AppText variant="subtext" color={mapView === 'front' ? Colors.white : 'rgba(255,255,255,0.5)'} style={{fontWeight: '700'}}>Front</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={[st.bmt, mapView === 'back' && st.bmtOn]} onPress={() => setMapView('back')} activeOpacity={0.7}>
                <AppText variant="subtext" color={mapView === 'back' ? Colors.white : 'rgba(255,255,255,0.5)'} style={{fontWeight: '700'}}>Back</AppText>
              </TouchableOpacity>
            </View>
            <Svg width={ms(120)} height={ms(220)} viewBox="0 0 120 220">
              {zones.map(zone => (
                <BodyMapZone key={zone.id} zone={zone} isSelected={selectedRegions.includes(zone.label)} onPress={toggleRegion} />
              ))}
            </Svg>
            <AppText variant="subtext" color="rgba(255,255,255,0.6)" style={{textAlign: 'center', marginTop: vs(8)}}>
              {selectedRegions.length > 0 ? `${selectedRegions[0]} selected - tap another to add` : 'Tap a region to select'}
            </AppText>
          </View>

          {/* Active region chips */}
          <View style={st.regionChips}>
            {selectedRegions.map((r, i) => (
              <TouchableOpacity key={i} style={st.rchipOn} onPress={() => toggleRegion(r)} activeOpacity={0.7}>
                <Icon family="Ionicons" name="body-outline" size={ms(12)} color={Colors.white} />
                <AppText variant="caption" color={Colors.white} style={{fontWeight: '700', marginLeft: s(4)}}>{r}</AppText>
              </TouchableOpacity>
            ))}
            <TouchableOpacity style={st.rchipWarn} activeOpacity={0.7}>
              <Icon family="Ionicons" name="body-outline" size={ms(12)} color="#92400E" />
              <AppText variant="caption" color="#92400E" style={{fontWeight: '500', marginLeft: s(4)}}>Lower back</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* PAIN INTENSITY */}
        <Section title={`Pain intensity - ${selectedRegions[0] || 'left knee'}`} />
        <AppText variant="subtext" color={Colors.textSecondary} style={{fontStyle: 'italic', marginBottom: vs(7)}}>0 = no pain - 10 = worst imaginable - tap to select</AppText>
        <View style={st.painTrack}>
          {PAIN_COLORS.map((c, i) => (
            <TouchableOpacity key={i} style={[st.painDot, {backgroundColor: c}, painLevel === i && st.painDotOn]} onPress={() => setPainLevel(i)} activeOpacity={0.7}>
              <AppText variant="subtext" color="rgba(255,255,255,0.8)" style={{fontWeight: '700', fontSize: ms(10)}}>{i}</AppText>
            </TouchableOpacity>
          ))}
        </View>
        <View style={st.painLabels}>
          <AppText variant="subtext" color={Colors.textSecondary}>No pain</AppText>
          <AppText variant="subtext" color={PAIN_COLORS[painLevel]} style={{fontWeight: '700'}}>{PAIN_DESC[painLevel]} ({painLevel})</AppText>
          <AppText variant="subtext" color={Colors.textSecondary}>Worst</AppText>
        </View>

        {/* PAIN CHARACTER */}
        <Section title="Pain character - what it feels like" />
        <ChipGroup items={PAIN_CHARS} selected={painChars} onToggle={i => toggleMulti(painChars, setPainChars, i)} chipStyle="pain" />

        {/* WHEN DOES IT HURT */}
        <Section title="When does it hurt?" />
        <ChipGroup items={WHEN_HURTS} selected={whenHurts} onToggle={i => toggleMulti(whenHurts, setWhenHurts, i)} chipStyle="time" />

        {/* FUNCTIONAL IMPACT */}
        <Section title="Functional impact today" />
        <AppText variant="subtext" color={Colors.textSecondary} style={{fontStyle: 'italic', marginBottom: vs(7)}}>What activities are affected or limited?</AppText>
        <ChipGroup items={FUNCTIONAL_IMPACT} selected={funcImpact} onToggle={i => toggleMulti(funcImpact, setFuncImpact, i)} chipStyle="func" />

        {/* ASSOCIATED SYMPTOMS */}
        <Section title="Associated symptoms" />
        <ChipGroup items={ASSOC_SYMPTOMS} selected={assocSymps} onToggle={i => toggleMulti(assocSymps, setAssocSymps, i)} chipStyle="assoc" />

        {/* ONSET & DURATION */}
        <Section title="Onset & duration" />
        <View style={st.wcard}>
          <AppText variant="subtext" color={Colors.textSecondary} style={{fontWeight: '700', marginBottom: vs(7)}}>How long have you had this pain?</AppText>
          <SingleSelect items={ONSET_DURATION} selected={onsetDur} onSelect={setOnsetDur} chipStyle="time" />
          <AppText variant="subtext" color={Colors.textSecondary} style={{fontWeight: '700', marginTop: vs(12), marginBottom: vs(7)}}>How did it start?</AppText>
          <SingleSelect items={ONSET_HOW} selected={onsetHow} onSelect={setOnsetHow} chipStyle="trig" />
        </View>

        {/* TRIGGERS */}
        <Section title="Triggers & aggravating factors" />
        <ChipGroup items={TRIGGERS} selected={triggers} onToggle={i => toggleMulti(triggers, setTriggers, i)} chipStyle="trig" />

        {/* WHAT HELPS */}
        <Section title="What helps - relieving factors" />
        <ChipGroup items={WHAT_HELPS} selected={whatHelps} onToggle={i => toggleMulti(whatHelps, setWhatHelps, i)} chipStyle="good" />

        {/* TREATMENT USED */}
        <Section title="Treatment used today" />
        <ChipGroup items={TREATMENT_USED} selected={treatment} onToggle={i => toggleMulti(treatment, setTreatment, i)} chipStyle="treat" />

        {/* RED FLAGS */}
        <Section title="Red flag check - tap if present" />
        <View style={st.redFlagCard}>
          <AppText variant="caption" color="#7F1D1D" style={{fontWeight: '700', lineHeight: ms(17), marginBottom: vs(9)}}>
            These symptoms require urgent medical attention. Tap any that apply - TrustLife will alert you to seek care.
          </AppText>
          {RED_FLAGS.map((flag, i) => {
            const isOn = redFlags.includes(i);
            return (
              <TouchableOpacity key={i} style={st.rfRow} onPress={() => toggleRedFlag(i)} activeOpacity={0.7}>
                <View style={[st.rfCheck, isOn && st.rfCheckOn]}>
                  {isOn && <Icon family="Ionicons" name="checkmark" size={ms(12)} color={Colors.white} />}
                </View>
                <AppText variant="caption" color="#7F1D1D" style={{flex: 1, lineHeight: ms(17)}}>{flag}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
        {redFlags.length > 0 && (
          <View style={st.rfAlert}>
            <Icon family="Ionicons" name="warning" size={ms(18)} color="#E24B4A" />
            <AppText variant="caption" color="#7F1D1D" style={{flex: 1, lineHeight: ms(17)}}>
              <AppText style={{fontWeight: '700'}}>Red flag detected.</AppText> Significant swelling with inability to weight-bear warrants same-day medical assessment - not a "wait and see" approach. Please contact Dr. Kavitha or visit a walk-in clinic today.
            </AppText>
          </View>
        )}

        {/* SLEEP IMPACT */}
        <Section title="Sleep impact last night" />
        <ChipGroup items={SLEEP_IMPACT} selected={sleepImpact} onToggle={i => toggleMulti(sleepImpact, setSleepImpact, i)} chipStyle="time" />

        {/* NOTES */}
        <Section title="Notes - optional" />
        <TextInput
          style={st.noteInput}
          value={notes}
          onChangeText={setNotes}
          placeholder="Any other details - what you were doing when it started, how it's changed, what the doctor said..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          textAlignVertical="top"
        />

        <View style={{height: vs(90)}} />
      </ScrollView>

      {/* ── BOTTOM BAR ── */}
      <View style={st.bottomBar}>
        <TouchableOpacity style={st.primaryButton} activeOpacity={0.8}>
          <Icon family="Ionicons" name="save-outline" size={ms(20)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>Save log</AppText>
        </TouchableOpacity>
        <View style={st.secondaryButtonRow}>
          <TouchableOpacity style={st.secondaryButton} activeOpacity={0.7} onPress={() => navigation.navigate('Records', {tab: 'healthlogs', logFilter: 'msk'})}>
            <Icon family="Ionicons" name="document-text-outline" size={ms(14)} color={Colors.white} />
            <AppText variant="caption" color={Colors.white} style={{marginLeft: s(5), fontWeight: '600'}}>Records</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={st.secondaryButton} activeOpacity={0.7} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'msk', initialTab: 'mskIntel'})}>
            <Icon family="Ionicons" name="bulb-outline" size={ms(14)} color={Colors.white} />
            <AppText variant="caption" color={Colors.white} style={{marginLeft: s(5), fontWeight: '600'}}>Ayu Intel</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  // Header (fixed)
  header: {backgroundColor: Colors.primary, paddingTop: vs(10), paddingBottom: vs(10), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(2)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(11)},

  // Scrollable header (green bg)
  scrollableHeader: {backgroundColor: Colors.primary, marginHorizontal: s(-13), paddingHorizontal: s(13), paddingTop: vs(4), paddingBottom: vs(14), marginBottom: vs(10)},

  // Body map
  bodyMapWrap: {backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: ms(14), borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.12)', padding: ms(14), alignItems: 'center', marginBottom: vs(12)},
  bodyMapTabs: {flexDirection: 'row', gap: s(6), marginBottom: vs(10)},
  bmt: {paddingHorizontal: s(14), paddingVertical: vs(5), borderRadius: ms(20), borderWidth: 1, borderColor: 'rgba(255,255,255,0.2)'},
  bmtOn: {backgroundColor: Colors.accent, borderColor: Colors.accent},

  // Region chips
  regionChips: {flexDirection: 'row', flexWrap: 'wrap', gap: s(5)},
  rchipOn: {flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.primary, paddingHorizontal: s(11), paddingVertical: vs(6), borderRadius: ms(20), borderWidth: 1, borderColor: 'rgba(255,255,255,0.4)'},
  rchipWarn: {flexDirection: 'row', alignItems: 'center', backgroundColor: '#FFF3E5', paddingHorizontal: s(11), paddingVertical: vs(6), borderRadius: ms(20), borderWidth: 0.5, borderColor: '#F97316'},

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13)},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(16), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Pain track
  painTrack: {flexDirection: 'row', gap: ms(4), marginBottom: vs(6)},
  painDot: {flex: 1, height: ms(32), borderRadius: ms(7), alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: 'transparent'},
  painDotOn: {transform: [{scale: 1.08}], borderColor: 'rgba(255,255,255,0.4)'},
  painLabels: {flexDirection: 'row', justifyContent: 'space-between'},

  // Chips
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(5), marginBottom: vs(4)},
  mchip: {paddingHorizontal: s(11), paddingVertical: vs(7), borderRadius: ms(20), borderWidth: 0.5, borderColor: '#E5DDD3'},

  // White card
  wcard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12), marginBottom: vs(8)},

  // Red flag card
  redFlagCard: {backgroundColor: '#FEF0F0', borderRadius: ms(14), borderWidth: 1.5, borderColor: '#FDA4A4', padding: ms(13), marginBottom: vs(8)},
  rfRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(7), borderBottomWidth: 0.5, borderBottomColor: 'rgba(239,68,68,0.15)'},
  rfCheck: {width: ms(20), height: ms(20), borderRadius: ms(6), borderWidth: 1.5, borderColor: '#FDA4A4', alignItems: 'center', justifyContent: 'center'},
  rfCheckOn: {backgroundColor: '#E24B4A', borderColor: '#E24B4A'},

  // Red flag alert
  rfAlert: {backgroundColor: '#FEF0F0', borderRadius: ms(12), borderWidth: 1.5, borderColor: '#E24B4A', padding: ms(13), marginBottom: vs(8), flexDirection: 'row', alignItems: 'flex-start', gap: s(9)},

  // Notes
  noteInput: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(11), fontSize: ms(12), fontFamily: 'DMSans-Regular', color: Colors.textPrimary, minHeight: vs(72), lineHeight: ms(19), textAlignVertical: 'top'},

  // Bottom bar
  bottomBar: {backgroundColor: Colors.white, paddingHorizontal: s(13), paddingTop: vs(8), paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10), borderTopWidth: 0.5, borderTopColor: '#d1d5db'},
  primaryButton: {flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: vs(13), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center', gap: s(8)},
  secondaryButtonRow: {flexDirection: 'row', marginTop: vs(8), gap: s(8)},
  secondaryButton: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: vs(7), borderRadius: ms(10), borderWidth: 0.5, borderColor: Colors.accent, backgroundColor: Colors.accent},
});

export default MSKLogScreen;
