import React, {useState, useRef, useEffect} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../../constants/colors';
import AppText from '../../../../components/shared/AppText';
import Icon from '../../../../components/shared/Icons';
import NumpadModal from '../../../../components/BabyHealth/NumpadModal';

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const PINK = '#D6336C';
const PINK_BG = '#FBEAF0';

const SCALE_COLORS = [
  '#E24B4A', '#E85D24', '#F97316', '#F0B429', '#A3D977',
  '#84CC16', '#52B788', '#1D9E75', '#0F6E56', '#085041',
];

const MOOD_LABELS = [
  'Very low', 'Low', 'Quite low', 'Below average', 'OK',
  'Moderate', 'Good', 'Very good', 'Excellent', 'Amazing',
];

const ENERGY_LABELS = [
  'Exhausted', 'Very low', 'Low', 'Below average', 'OK',
  'Moderate', 'Good', 'Very good', 'Energetic', 'Full energy',
];

const SYMPTOMS = [
  {key: 'nausea', label: 'Nausea', icon: 'sad-outline'},
  {key: 'vomiting', label: 'Vomiting', icon: 'water-outline'},
  {key: 'heartburn', label: 'Heartburn', icon: 'flame-outline'},
  {key: 'fatigue', label: 'Fatigue', icon: 'bed-outline'},
  {key: 'headache', label: 'Headache', icon: 'pulse-outline'},
  {key: 'cramps', label: 'Leg cramps', icon: 'walk-outline'},
  {key: 'backpain', label: 'Back pain', icon: 'body-outline'},
  {key: 'urination', label: 'Frequent urination', icon: 'rainy-outline'},
  {key: 'breath', label: 'Breathlessness', icon: 'cloud-outline'},
  {key: 'swelling', label: 'Ankle swelling', icon: 'ellipse-outline'},
  {key: 'pelvic', label: 'Pelvic pressure', icon: 'arrow-down-outline'},
  {key: 'anxiety', label: 'Anxiety / worry', icon: 'alert-circle-outline'},
  {key: 'sleep', label: 'Sleep difficulty', icon: 'moon-outline'},
  {key: 'well', label: 'Feeling well today', icon: 'happy-outline'},
];

const SUPPLEMENTS = [
  {key: 'ifa', name: 'IFA tablet', sub: 'Iron-Folic Acid'},
  {key: 'calcium', name: 'Calcium 500mg', sub: 'Bone & teeth'},
  {key: 'vitd', name: 'Vitamin D 2000 IU', sub: 'Bone & immunity'},
  {key: 'folic', name: 'Folic acid 5mg', sub: 'Neural tube'},
  {key: 'omega', name: 'Omega-3 DHA 200mg', sub: 'Brain & eye'},
];

const SLEEP_QUALITY = ['Restful', 'OK', 'Interrupted', 'Poor'];
const SLEEP_POSITION = ['Left side', 'Right side', 'Back', 'Mixed'];

const EPDS_QUESTIONS = [
  {key: 'q1', text: 'I have been able to laugh and see the funny side of things', options: [{label: 'As much as always', score: 0}, {label: 'Not quite so much now', score: 1}, {label: 'Definitely not so much', score: 2}, {label: 'Not at all', score: 3}]},
  {key: 'q2', text: 'I have looked forward with enjoyment to things', options: [{label: 'As much as ever', score: 0}, {label: 'Rather less', score: 1}, {label: 'Definitely less', score: 2}, {label: 'Hardly at all', score: 3}]},
  {key: 'q3', text: 'I have blamed myself unnecessarily when things went wrong', options: [{label: 'No, never', score: 0}, {label: 'Not very often', score: 1}, {label: 'Yes, some of the time', score: 2}, {label: 'Yes, most of the time', score: 3}]},
  {key: 'q4', text: 'I have been anxious or worried for no good reason', options: [{label: 'No, not at all', score: 0}, {label: 'Hardly ever', score: 1}, {label: 'Yes, sometimes', score: 2}, {label: 'Yes, very often', score: 3}]},
  {key: 'q5', text: 'I have felt scared or panicky for no good reason', options: [{label: 'No, not at all', score: 0}, {label: 'No, not much', score: 1}, {label: 'Yes, sometimes', score: 2}, {label: 'Yes, quite a lot', score: 3}]},
  {key: 'q6', text: 'Things have been getting on top of me', options: [{label: 'No, coping well', score: 0}, {label: 'Mostly coping', score: 1}, {label: 'Yes, sometimes', score: 2}, {label: 'Yes, most of the time', score: 3}]},
  {key: 'q7', text: 'I have been so unhappy that I have had difficulty sleeping', options: [{label: 'No, not at all', score: 0}, {label: 'Not very often', score: 1}, {label: 'Yes, sometimes', score: 2}, {label: 'Yes, most of the time', score: 3}]},
  {key: 'q8', text: 'I have felt sad or miserable', options: [{label: 'No, not at all', score: 0}, {label: 'Not very often', score: 1}, {label: 'Yes, quite often', score: 2}, {label: 'Yes, most of the time', score: 3}]},
  {key: 'q9', text: 'I have been so unhappy that I have been crying', options: [{label: 'No, never', score: 0}, {label: 'Only occasionally', score: 1}, {label: 'Yes, quite often', score: 2}, {label: 'Yes, most of the time', score: 3}]},
  {key: 'q10', text: 'The thought of harming myself has occurred to me', options: [{label: 'Never', score: 0}, {label: 'Hardly ever', score: 1}, {label: 'Sometimes', score: 2}, {label: 'Yes, quite often', score: 3}]},
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

const ScaleRow = ({value, onChange}) => (
  <View style={st.scaleRow}>
    {SCALE_COLORS.map((c, i) => {
      const num = i + 1;
      const selected = value === num;
      return (
        <TouchableOpacity
          key={i}
          activeOpacity={0.7}
          onPress={() => onChange(num)}
          style={[
            st.scaleDot,
            {backgroundColor: c},
            selected && {transform: [{scale: 1.1}], borderWidth: 2, borderColor: Colors.white},
          ]}>
          <AppText variant="subtext" color={Colors.white} style={{fontWeight: '700', fontSize: ms(10)}}>{num}</AppText>
        </TouchableOpacity>
      );
    })}
  </View>
);

const ChipRow = ({items, selected, onSelect}) => (
  <View style={st.chipWrap}>
    {items.map((item, i) => {
      const isOn = selected === i;
      return (
        <TouchableOpacity
          key={i}
          style={[st.mchip, isOn && st.mchipOn]}
          onPress={() => onSelect(i)}
          activeOpacity={0.7}>
          <AppText variant="caption" color={isOn ? Colors.primary : '#555'} style={{fontWeight: isOn ? '700' : '500'}}>
            {item}
          </AppText>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const WellbeingScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [moodValue, setMoodValue] = useState(5);
  const [energyValue, setEnergyValue] = useState(3);
  const [activeSymptoms, setActiveSymptoms] = useState([]);

  const [kickCount, setKickCount] = useState(0);
  const [kickStart, setKickStart] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const kickInterval = useRef(null);

  useEffect(() => {
    if (kickStart) {
      kickInterval.current = setInterval(() => {
        setElapsed(Math.floor((Date.now() - kickStart) / 1000));
      }, 1000);
    }
    return () => {
      if (kickInterval.current) clearInterval(kickInterval.current);
    };
  }, [kickStart]);

  const onKick = () => {
    if (!kickStart) setKickStart(Date.now());
    setKickCount(c => c + 1);
  };

  const resetKicks = () => {
    if (kickInterval.current) clearInterval(kickInterval.current);
    setKickCount(0);
    setKickStart(null);
    setElapsed(0);
  };

  const [systolic, setSystolic] = useState(118);
  const [diastolic, setDiastolic] = useState(74);
  const [weight, setWeight] = useState(58.4);
  const [sleepHours, setSleepHours] = useState(7);
  const [wakeups, setWakeups] = useState(3);
  const [sleepQuality, setSleepQuality] = useState(2);
  const [sleepPos, setSleepPos] = useState(0);

  const [suppLogged, setSuppLogged] = useState({ifa: false, calcium: false, vitd: false, folic: false, omega: false});

  const [epdsAnswers, setEpdsAnswers] = useState(() => {
    const init = {};
    EPDS_QUESTIONS.forEach(q => { init[q.key] = null; });
    return init;
  });

  const epdsScore = EPDS_QUESTIONS.reduce((acc, q) => {
    const idx = epdsAnswers[q.key];
    return acc + (idx !== null ? q.options[idx].score : 0);
  }, 0);

  const answeredCount = EPDS_QUESTIONS.filter(q => epdsAnswers[q.key] !== null).length;

  const [numpadVisible, setNumpadVisible] = useState(false);
  const [numpadField, setNumpadField] = useState(null);
  const [numpadInitial, setNumpadInitial] = useState('');
  const [numpadTitle, setNumpadTitle] = useState('');
  const [numpadHint, setNumpadHint] = useState('');

  const openNumpad = (field, initial, title, hint) => {
    setNumpadField(field);
    setNumpadInitial(String(initial));
    setNumpadTitle(title);
    setNumpadHint(hint);
    setNumpadVisible(true);
  };

  const onNumpadConfirm = (v) => {
    if (numpadField === 'systolic') setSystolic(Math.round(Number(v)));
    else if (numpadField === 'diastolic') setDiastolic(Math.round(Number(v)));
    else if (numpadField === 'weight') setWeight(Number(v));
    else if (numpadField === 'sleep') setSleepHours(Number(v));
    setNumpadVisible(false);
  };

  const toggleSymptom = (key) => {
    setActiveSymptoms(prev => prev.includes(key) ? prev.filter(x => x !== key) : [...prev, key]);
  };

  const toggleSupp = (key) => {
    setSuppLogged(prev => ({...prev, [key]: !prev[key]}));
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s2 = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s2).padStart(2, '0')}`;
  };

  const suppsTaken = Object.values(suppLogged).filter(Boolean).length;

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── HEADER ── */}
      <View style={[st.header, {paddingTop: insets.top + vs(10)}]}>
        <View style={st.topRow}>
          <TouchableOpacity
            style={st.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={{color: Colors.white, fontSize: ms(18), fontWeight: '700'}}>Daily wellbeing</AppText>
            <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', fontSize: ms(11)}}>Week 16 log</AppText>
          </View>
        </View>
      </View>

      {/* ── BODY ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Mood */}
        <Section title="Overall mood today" />
        <View style={st.card}>
          <ScaleRow value={moodValue} onChange={setMoodValue} />
          <AppText variant="subtext" color={Colors.textPrimary} style={{fontWeight: '700', textAlign: 'center', marginTop: vs(4)}}>
            {moodValue} / 10 {'\u00b7'} {MOOD_LABELS[moodValue - 1]}
          </AppText>
        </View>

        {/* Energy */}
        <Section title="Energy level today" />
        <View style={st.card}>
          <ScaleRow value={energyValue} onChange={setEnergyValue} />
          <AppText variant="subtext" color={Colors.textPrimary} style={{fontWeight: '700', textAlign: 'center', marginTop: vs(4)}}>
            {energyValue} / 10 {'\u00b7'} {ENERGY_LABELS[energyValue - 1]}
          </AppText>
        </View>

        {/* Symptoms */}
        <Section title={`Symptoms today · ${activeSymptoms.length} selected`} />
        <View style={st.symptomWrap}>
          {SYMPTOMS.map(sym => {
            const active = activeSymptoms.includes(sym.key);
            return (
              <TouchableOpacity
                key={sym.key}
                activeOpacity={0.7}
                onPress={() => toggleSymptom(sym.key)}
                style={[st.symChip, active && {backgroundColor: PINK_BG, borderColor: PINK}]}>
                <Icon family="Ionicons" name={sym.icon} size={ms(14)} color={active ? PINK : Colors.textSecondary} />
                <AppText variant="caption" color={active ? PINK : Colors.textPrimary} style={{fontWeight: active ? '700' : '500', marginLeft: s(5)}}>{sym.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Kick counter */}
        <Section title="Kick count session" />
        <View style={st.kickHero}>
          <AppText color={Colors.white} style={{fontSize: ms(54), fontWeight: '800'}}>{kickCount}</AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.7)" style={{marginBottom: vs(12)}}>movements counted</AppText>

          <TouchableOpacity activeOpacity={0.8} onPress={onKick} style={st.kickBtn}>
            <Icon family="Ionicons" name="footsteps-outline" size={ms(34)} color={Colors.white} />
          </TouchableOpacity>
          <AppText variant="subtext" color="rgba(255,255,255,0.6)" style={{marginTop: vs(8)}}>Tap every time baby moves</AppText>

          <View style={st.kickStatsRow}>
            <View style={st.kickStat}>
              <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(15)}}>{formatTime(elapsed)}</AppText>
              <AppText variant="subtext" color="rgba(255,255,255,0.5)" style={{fontSize: ms(8), textTransform: 'uppercase', letterSpacing: 0.4}}>Session time</AppText>
            </View>
            <TouchableOpacity style={st.kickStat} onPress={resetKicks} activeOpacity={0.7}>
              <Icon family="Ionicons" name="refresh" size={ms(16)} color={Colors.white} />
              <AppText variant="subtext" color="rgba(255,255,255,0.5)" style={{fontSize: ms(8), textTransform: 'uppercase', letterSpacing: 0.4, marginTop: vs(2)}}>Reset</AppText>
            </TouchableOpacity>
            <View style={st.kickStat}>
              <Icon family="Ionicons" name={kickCount >= 10 ? 'checkmark-circle' : 'time-outline'} size={ms(18)} color={kickCount >= 10 ? Colors.paleGreen : 'rgba(255,255,255,0.7)'} />
              <AppText variant="subtext" color="rgba(255,255,255,0.5)" style={{fontSize: ms(8), textTransform: 'uppercase', letterSpacing: 0.4, marginTop: vs(2)}}>Target 10</AppText>
            </View>
          </View>
        </View>

        {/* BP */}
        <Section title="Blood pressure" />
        <View style={st.row2}>
          <TouchableOpacity activeOpacity={0.7} style={st.inputBox} onPress={() => openNumpad('systolic', systolic, 'Systolic BP', 'mmHg')}>
            <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '700'}}>Systolic</AppText>
            <AppText variant="bodyBold" color={Colors.primary} style={{fontSize: ms(22), marginTop: vs(4)}}>{systolic}</AppText>
            <AppText variant="subtext" color={Colors.textSecondary}>mmHg</AppText>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={st.inputBox} onPress={() => openNumpad('diastolic', diastolic, 'Diastolic BP', 'mmHg')}>
            <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '700'}}>Diastolic</AppText>
            <AppText variant="bodyBold" color={Colors.primary} style={{fontSize: ms(22), marginTop: vs(4)}}>{diastolic}</AppText>
            <AppText variant="subtext" color={Colors.textSecondary}>mmHg</AppText>
          </TouchableOpacity>
        </View>

        {/* Weight */}
        <Section title="Weight" />
        <TouchableOpacity activeOpacity={0.7} style={[st.inputBox, {width: '100%'}]} onPress={() => openNumpad('weight', weight, 'Weight', 'kg')}>
          <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '700'}}>Weight - morning</AppText>
          <AppText variant="bodyBold" color={Colors.primary} style={{fontSize: ms(24), marginTop: vs(4)}}>{weight} kg</AppText>
        </TouchableOpacity>

        {/* Supplements */}
        <Section title={`Supplements today · ${suppsTaken}/${SUPPLEMENTS.length}`} />
        <View style={st.card}>
          {SUPPLEMENTS.map((sup, i) => {
            const logged = suppLogged[sup.key];
            return (
              <View key={sup.key} style={[st.suppRow, i === SUPPLEMENTS.length - 1 && {borderBottomWidth: 0}]}>
                <View style={{flex: 1}}>
                  <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(13)}}>{sup.name}</AppText>
                  <AppText variant="subtext" color={Colors.textSecondary}>{sup.sub}</AppText>
                </View>
                <TouchableOpacity activeOpacity={0.7} onPress={() => toggleSupp(sup.key)} style={[st.suppCheck, logged && {backgroundColor: Colors.tealBg, borderColor: Colors.teal}]}>
                  {logged && <Icon family="Ionicons" name="checkmark" size={ms(16)} color={Colors.tealText} />}
                </TouchableOpacity>
              </View>
            );
          })}
        </View>

        {/* Sleep */}
        <Section title="Sleep last night" />
        <View style={st.row2}>
          <TouchableOpacity activeOpacity={0.7} style={st.inputBox} onPress={() => openNumpad('sleep', sleepHours, 'Sleep hours', 'hours')}>
            <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '700'}}>Hours</AppText>
            <AppText variant="bodyBold" color={Colors.primary} style={{fontSize: ms(22), marginTop: vs(4)}}>{sleepHours}h</AppText>
          </TouchableOpacity>
          <View style={st.inputBox}>
            <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '700'}}>Wakeups</AppText>
            <View style={[st.stepperRow, {marginTop: vs(4)}]}>
              <TouchableOpacity style={st.stepMini} activeOpacity={0.7} onPress={() => setWakeups(w => Math.max(0, w - 1))}>
                <Icon family="Ionicons" name="remove" size={ms(14)} color={Colors.primary} />
              </TouchableOpacity>
              <AppText variant="bodyBold" color={Colors.primary} style={{fontSize: ms(20)}}>{wakeups}</AppText>
              <TouchableOpacity style={st.stepMini} activeOpacity={0.7} onPress={() => setWakeups(w => w + 1)}>
                <Icon family="Ionicons" name="add" size={ms(14)} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <View style={[st.card, {marginTop: vs(6)}]}>
          <AppText variant="subtext" color={Colors.textSecondary} style={st.fieldLabel}>Quality</AppText>
          <ChipRow items={SLEEP_QUALITY} selected={sleepQuality} onSelect={setSleepQuality} />
          <AppText variant="subtext" color={Colors.textSecondary} style={[st.fieldLabel, {marginTop: vs(12)}]}>Position</AppText>
          <ChipRow items={SLEEP_POSITION} selected={sleepPos} onSelect={setSleepPos} />
        </View>

        {/* EPDS */}
        <Section title={`EPDS screen · ${answeredCount}/10 · score ${epdsScore}`} />
        {EPDS_QUESTIONS.map((q, qi) => (
          <View key={q.key} style={st.card}>
            <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700', marginBottom: vs(6)}}>
              {qi + 1}. {q.text}
            </AppText>
            <View style={st.epdsGrid}>
              {q.options.map((opt, oi) => {
                const isOn = epdsAnswers[q.key] === oi;
                return (
                  <TouchableOpacity
                    key={oi}
                    activeOpacity={0.7}
                    onPress={() => setEpdsAnswers(prev => ({...prev, [q.key]: oi}))}
                    style={[st.epdsOpt, isOn && {backgroundColor: '#F4F3FF', borderColor: Colors.primary}]}>
                    <AppText variant="subtext" color={isOn ? Colors.primary : Colors.textPrimary} style={{fontWeight: isOn ? '700' : '500', textAlign: 'center', fontSize: ms(10)}}>
                      {opt.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <View style={{height: vs(20)}} />
      </ScrollView>

      {/* ── Save Button ── */}
      <View style={st.bottomBar}>
        <TouchableOpacity style={st.primaryButton} activeOpacity={0.85}>
          <Icon family="Ionicons" name="save-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
            Save wellbeing log {'\u00b7'} mood {moodValue}/10
          </AppText>
        </TouchableOpacity>
      </View>

      <NumpadModal
        visible={numpadVisible}
        title={numpadTitle}
        hint={numpadHint}
        initialValue={numpadInitial}
        onClose={() => setNumpadVisible(false)}
        onConfirm={onNumpadConfirm}
      />
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  // Header
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(12)},
  topRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(8)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(12)},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7), fontSize: ms(9)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Card
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12), marginBottom: vs(6)},

  // Scale
  scaleRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  scaleDot: {width: ms(26), height: ms(26), borderRadius: ms(13), alignItems: 'center', justifyContent: 'center'},

  // Symptom chips (row wrap with icon)
  symptomWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6)},
  symChip: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(10), paddingVertical: vs(6), borderRadius: ms(20), backgroundColor: Colors.white, borderWidth: 1, borderColor: '#E5DDD3'},

  // Kick hero
  kickHero: {backgroundColor: Colors.primary, borderRadius: ms(18), padding: ms(18), alignItems: 'center'},
  kickBtn: {width: ms(72), height: ms(72), borderRadius: ms(36), backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center'},
  kickStatsRow: {flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: vs(14), paddingTop: vs(12), borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.2)'},
  kickStat: {flex: 1, alignItems: 'center'},

  // Vitals
  row2: {flexDirection: 'row', gap: s(8)},
  inputBox: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12)},

  // Stepper
  stepperRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  stepMini: {width: ms(28), height: ms(28), borderRadius: ms(14), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center'},

  // Chips
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(5)},
  mchip: {paddingHorizontal: s(11), paddingVertical: vs(7), borderRadius: ms(20), borderWidth: 0.5, borderColor: '#E5DDD3', backgroundColor: '#fff'},
  mchipOn: {backgroundColor: '#F4F3FF', borderColor: Colors.primary},
  fieldLabel: {marginBottom: vs(6), fontSize: ms(10), fontWeight: '600'},

  // Supplements
  suppRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(9), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F3EFE8'},
  suppCheck: {width: ms(28), height: ms(28), borderRadius: ms(8), borderWidth: 1.5, borderColor: '#D5D5D5', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white},

  // EPDS
  epdsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6)},
  epdsOpt: {width: '48%', paddingVertical: vs(8), paddingHorizontal: s(8), borderRadius: ms(10), borderWidth: 1, borderColor: '#E5DDD3', backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', minHeight: vs(38)},

  // Bottom
  bottomBar: {backgroundColor: Colors.white, paddingHorizontal: s(13), paddingTop: vs(8), paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10), borderTopWidth: 0.5, borderTopColor: '#d1d5db'},
  primaryButton: {flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: vs(13), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
});

export default WellbeingScreen;
