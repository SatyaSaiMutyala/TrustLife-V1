import React, {useState, useRef, useEffect} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
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
const PINK_BORDER = '#F3C6D5';

const TABS = [
  {key: 'wellbeing', label: 'Wellbeing'},
  {key: 'kicks', label: 'Kick count'},
  {key: 'vitals', label: 'Vitals'},
  {key: 'epds', label: 'EPDS screen'},
];

const SCALE_COLORS = [
  '#E24B4A', '#E85D24', '#F97316', '#F0B429', '#A3D977',
  '#84CC16', '#52B788', '#1D9E75', '#0F6E56', '#085041',
];

const MOOD_LABELS = [
  'Very low (1)', 'Low (2)', 'Quite low (3)', 'Below average (4)', 'OK (5)',
  'Moderate (6)', 'Good (7)', 'Very good (8)', 'Excellent (9)', 'Amazing (10)',
];

const ENERGY_LABELS = [
  'Exhausted (1)', 'Very low (2)', 'Low (3)', 'Below average (4)', 'OK (5)',
  'Moderate (6)', 'Good (7)', 'Very good (8)', 'Energetic (9)', 'Full energy (10)',
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

const WARNINGS = [
  'Sudden severe headache or visual disturbance (flashing lights) - pre-eclampsia sign',
  'Sudden gush or continuous trickle of fluid from vagina - waters breaking',
  'Any vaginal bleeding - red, fresh blood (small amounts of brown discharge can be normal)',
  'No foetal movement felt for 2 hours after drinking cold water and lying on your left side',
  'Regular painful contractions before 37 weeks (preterm labour)',
];

const KICK_HISTORY = [
  {date: 'Apr 4', count: '12', dur: '1h 22m', status: 'Good', color: '#1D9E75'},
  {date: 'Apr 3', count: '9', dur: '1h 58m', status: 'Borderline', color: '#BA7517'},
  {date: 'Apr 2', count: '14', dur: '55m', status: 'Good', color: '#1D9E75'},
];

const SUPPLEMENTS = [
  {key: 'ifa', name: 'IFA tablet', sub: 'Iron-Folic Acid'},
  {key: 'calcium', name: 'Calcium 500mg', sub: 'Bone & teeth development'},
  {key: 'vitd', name: 'Vitamin D 2000 IU', sub: 'Bone & immunity'},
  {key: 'folic', name: 'Folic acid 5mg', sub: 'Neural tube development'},
  {key: 'omega', name: 'Omega-3 DHA 200mg', sub: 'Brain & eye development'},
];

const EPDS_QUESTIONS = [
  {
    key: 'q1',
    text: 'I have been able to laugh and see the funny side of things',
    options: [
      {label: 'As much as always', score: 0},
      {label: 'Not quite so much now', score: 1},
      {label: 'Definitely not so much now', score: 2},
      {label: 'Not at all', score: 3},
    ],
    default: 0,
  },
  {
    key: 'q2',
    text: 'I have looked forward with enjoyment to things',
    options: [
      {label: 'As much as ever', score: 0},
      {label: 'Rather less than I used to', score: 1},
      {label: 'Definitely less than I used to', score: 2},
      {label: 'Hardly at all', score: 3},
    ],
    default: 0,
  },
  {
    key: 'q3',
    text: 'I have blamed myself unnecessarily when things went wrong',
    options: [
      {label: 'No, never', score: 0},
      {label: 'Not very often', score: 1},
      {label: 'Yes, some of the time', score: 2},
      {label: 'Yes, most of the time', score: 3},
    ],
    default: 1,
  },
  {
    key: 'q4',
    text: 'I have been anxious or worried for no good reason',
    options: [
      {label: 'No, not at all', score: 0},
      {label: 'Hardly ever', score: 1},
      {label: 'Yes, sometimes', score: 2},
      {label: 'Yes, very often', score: 3},
    ],
    default: 0,
  },
  {
    key: 'q5',
    text: 'I have felt scared or panicky for no good reason',
    options: [
      {label: 'No, not at all', score: 0},
      {label: 'No, not much', score: 1},
      {label: 'Yes, sometimes', score: 2},
      {label: 'Yes, quite a lot', score: 3},
    ],
    default: 0,
  },
  {
    key: 'q6',
    text: 'Things have been getting on top of me',
    options: [
      {label: 'No, coping well', score: 0},
      {label: 'Mostly coping', score: 1},
      {label: 'Yes, sometimes', score: 2},
      {label: 'Yes, most of the time', score: 3},
    ],
    default: 1,
  },
  {
    key: 'q7',
    text: 'I have been so unhappy that I have had difficulty sleeping',
    options: [
      {label: 'No, not at all', score: 0},
      {label: 'Not very often', score: 1},
      {label: 'Yes, sometimes', score: 2},
      {label: 'Yes, most of the time', score: 3},
    ],
    default: 0,
  },
  {
    key: 'q8',
    text: 'I have felt sad or miserable',
    options: [
      {label: 'No, not at all', score: 0},
      {label: 'Not very often', score: 1},
      {label: 'Yes, quite often', score: 2},
      {label: 'Yes, most of the time', score: 3},
    ],
    default: 0,
  },
  {
    key: 'q9',
    text: 'I have been so unhappy that I have been crying',
    options: [
      {label: 'No, never', score: 0},
      {label: 'Only occasionally', score: 1},
      {label: 'Yes, quite often', score: 2},
      {label: 'Yes, most of the time', score: 3},
    ],
    default: 0,
  },
  {
    key: 'q10',
    text: 'The thought of harming myself has occurred to me',
    warning: true,
    options: [
      {label: 'Never', score: 0},
      {label: 'Hardly ever', score: 1},
      {label: 'Sometimes', score: 2},
      {label: 'Yes, quite often', score: 3},
    ],
    default: 0,
  },
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
            selected && {transform: [{scale: 1.08}], borderWidth: 2, borderColor: Colors.white},
          ]}>
          <AppText variant="subtext" color={Colors.white} style={{fontWeight: '700', fontSize: ms(10)}}>{num}</AppText>
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

  const [activeTab, setActiveTab] = useState('wellbeing');

  // Wellbeing tab
  const [moodValue, setMoodValue] = useState(5);
  const [energyValue, setEnergyValue] = useState(3);
  const [activeSymptoms, setActiveSymptoms] = useState(['nausea', 'fatigue', 'urination']);

  // Kick tab
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

  // Vitals tab
  const [systolic, setSystolic] = useState(118);
  const [diastolic, setDiastolic] = useState(74);
  const [weight, setWeight] = useState(58.4);
  const [sleepHours, setSleepHours] = useState(7.5);
  const [suppLogged, setSuppLogged] = useState({ifa: true, calcium: true, vitd: false, folic: true, omega: false});

  // EPDS tab
  const [epdsAnswers, setEpdsAnswers] = useState(() => {
    const init = {};
    EPDS_QUESTIONS.forEach(q => { init[q.key] = q.default; });
    return init;
  });

  const epdsScore = EPDS_QUESTIONS.reduce((acc, q) => acc + (q.options[epdsAnswers[q.key]]?.score || 0), 0);

  // Numpad
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
    if (numpadField === 'systolic') setSystolic(Math.round(v));
    else if (numpadField === 'diastolic') setDiastolic(Math.round(v));
    else if (numpadField === 'weight') setWeight(v);
    else if (numpadField === 'sleep') setSleepHours(v);
  };

  const toggleSymptom = (key) => {
    setActiveSymptoms(prev => prev.includes(key) ? prev.filter(s => s !== key) : [...prev, key]);
  };

  const toggleSupp = (key) => {
    setSuppLogged(prev => ({...prev, [key]: !prev[key]}));
  };

  const formatTime = (sec) => {
    const m = Math.floor(sec / 60);
    const s2 = sec % 60;
    return `${String(m).padStart(2, '0')}:${String(s2).padStart(2, '0')}`;
  };

  // ── Render helpers ──

  const renderWellbeing = () => (
    <>
      <Section title="Overall mood today - 1 to 10" />
      <View style={st.card}>
        <ScaleRow value={moodValue} onChange={setMoodValue} />
        <View style={st.scaleLabelRow}>
          <AppText variant="subtext" color={Colors.textSecondary}>Very low</AppText>
          <AppText variant="subtext" color={Colors.textPrimary} style={{fontWeight: '700'}}>{MOOD_LABELS[moodValue - 1]}</AppText>
          <AppText variant="subtext" color={Colors.textSecondary}>Excellent</AppText>
        </View>
      </View>

      <Section title="Energy level today" />
      <View style={st.card}>
        <ScaleRow value={energyValue} onChange={setEnergyValue} />
        <View style={st.scaleLabelRow}>
          <AppText variant="subtext" color={Colors.textSecondary}>Exhausted</AppText>
          <AppText variant="subtext" color={Colors.textPrimary} style={{fontWeight: '700'}}>{ENERGY_LABELS[energyValue - 1]}</AppText>
          <AppText variant="subtext" color={Colors.textSecondary}>Full energy</AppText>
        </View>
      </View>

      <Section title="Symptoms today - select all that apply" />
      <View style={st.chipWrap}>
        {SYMPTOMS.map(sym => {
          const active = activeSymptoms.includes(sym.key);
          return (
            <TouchableOpacity
              key={sym.key}
              activeOpacity={0.7}
              onPress={() => toggleSymptom(sym.key)}
              style={[st.chip, active && {backgroundColor: PINK_BG, borderColor: PINK}]}>
              <Icon family="Ionicons" name={sym.icon} size={ms(14)} color={active ? PINK : Colors.textSecondary} />
              <AppText variant="caption" color={active ? PINK : Colors.textPrimary} style={{fontWeight: active ? '700' : '500'}}>{sym.label}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      <View style={[st.alertBox]}>
        <View style={st.alertHeader}>
          <Icon family="Ionicons" name="warning-outline" size={ms(16)} color={Colors.redText} />
          <AppText variant="bodyBold" color={Colors.redText} style={{fontSize: ms(12)}}>Report immediately - call doctor now if:</AppText>
        </View>
        {WARNINGS.map((w, i) => (
          <View key={i} style={st.warnRow}>
            <Icon family="Ionicons" name="alert-circle" size={ms(14)} color={Colors.redText} />
            <AppText variant="caption" color={Colors.redDark} style={{flex: 1, lineHeight: ms(16)}}>{w}</AppText>
          </View>
        ))}
      </View>
    </>
  );

  const renderKicks = () => (
    <>
      <View style={st.kickHero}>
        <AppText variant="subtext" color="rgba(255,255,255,0.6)" style={{textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '700'}}>Kick count - Apr 5</AppText>
        <AppText color={Colors.white} style={{fontSize: ms(54), fontWeight: '800', marginTop: vs(4)}}>{kickCount}</AppText>
        <AppText variant="caption" color="rgba(255,255,255,0.7)" style={{marginBottom: vs(12)}}>movements counted today</AppText>

        <TouchableOpacity activeOpacity={0.8} onPress={onKick} style={st.kickBtn}>
          <Icon family="Ionicons" name="footsteps-outline" size={ms(34)} color={Colors.white} />
        </TouchableOpacity>
        <AppText variant="subtext" color="rgba(255,255,255,0.6)" style={{marginTop: vs(8)}}>Tap every time baby moves</AppText>

        <View style={st.kickStatsRow}>
          <View style={st.kickStat}>
            <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(15)}}>{formatTime(elapsed)}</AppText>
            <AppText variant="subtext" color="rgba(255,255,255,0.5)" style={{fontSize: ms(8), textTransform: 'uppercase', letterSpacing: 0.4}}>Session time</AppText>
          </View>
          <View style={st.kickStat}>
            <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(15)}}>10 / 2h</AppText>
            <AppText variant="subtext" color="rgba(255,255,255,0.5)" style={{fontSize: ms(8), textTransform: 'uppercase', letterSpacing: 0.4}}>Target</AppText>
          </View>
          <View style={st.kickStat}>
            <Icon family="Ionicons" name={kickCount >= 10 ? 'checkmark-circle' : 'time-outline'} size={ms(18)} color={kickCount >= 10 ? Colors.paleGreen : 'rgba(255,255,255,0.7)'} />
            <AppText variant="subtext" color="rgba(255,255,255,0.5)" style={{fontSize: ms(8), textTransform: 'uppercase', letterSpacing: 0.4, marginTop: vs(2)}}>Status</AppText>
          </View>
        </View>
      </View>

      <View style={[st.insight, {backgroundColor: PINK_BG, borderColor: PINK_BORDER}]}>
        <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={PINK} />
        <AppText variant="caption" color={PINK} style={{flex: 1, lineHeight: ms(17)}}>
          <AppText style={{fontWeight: '700'}}>Kick counting begins at Week 20.</AppText> At Week 16, you may feel the first gentle flutters. Count regularly from Week 20 - aim for 10 movements in 2 hours, ideally after a meal (when baby is most active). Lie on your left side for best results. Position increases placental blood flow.
        </AppText>
      </View>

      <Section title="Recent kick count history" />
      <View style={st.card}>
        <View style={st.histHeader}>
          <AppText variant="subtext" color={Colors.textSecondary} style={[st.histCell, {fontWeight: '700'}]}>Date</AppText>
          <AppText variant="subtext" color={Colors.textSecondary} style={[st.histCell, {fontWeight: '700'}]}>Count</AppText>
          <AppText variant="subtext" color={Colors.textSecondary} style={[st.histCell, {fontWeight: '700'}]}>Duration</AppText>
          <AppText variant="subtext" color={Colors.textSecondary} style={[st.histCell, {fontWeight: '700'}]}>Status</AppText>
        </View>
        {KICK_HISTORY.map((row, i) => (
          <TouchableOpacity key={i} activeOpacity={0.7} style={st.histRow}>
            <AppText variant="caption" color={Colors.textPrimary} style={st.histCell}>{row.date}</AppText>
            <AppText variant="caption" color={Colors.textPrimary} style={st.histCell}>{row.count}</AppText>
            <AppText variant="caption" color={Colors.textPrimary} style={st.histCell}>{row.dur}</AppText>
            <View style={st.histCell}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: s(3)}}>
                <AppText variant="caption" color={row.color} style={{fontWeight: '700'}}>{row.status}</AppText>
                {row.status === 'Good' && <Icon family="Ionicons" name="checkmark-circle" size={ms(12)} color={row.color} />}
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      <View style={[st.insight, {backgroundColor: Colors.redBg, borderColor: '#F3C6C6'}]}>
        <Icon family="Ionicons" name="alert-circle-outline" size={ms(16)} color={Colors.redText} />
        <AppText variant="caption" color={Colors.redText} style={{flex: 1, lineHeight: ms(17)}}>
          <AppText style={{fontWeight: '700'}}>Reduced movements = contact doctor same day.</AppText> If you count fewer than 10 movements in 2 hours after a meal, drink cold water, lie on your left side, and count again for a further hour. If still fewer than 10, call your obstetrician - not your next appointment, today. Do not wait and see. Reduced movement is the most common warning sign of foetal compromise.
        </AppText>
      </View>
    </>
  );

  const renderVitals = () => (
    <>
      <Section title="Blood pressure - today" />
      <View style={st.row2}>
        <TouchableOpacity activeOpacity={0.7} style={st.inputBox} onPress={() => openNumpad('systolic', systolic, 'Systolic BP', 'mmHg')}>
          <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '700'}}>Systolic</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(20), marginVertical: vs(4)}}>{systolic} mmHg</AppText>
          <View style={[st.pill, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="subtext" color={Colors.tealText} style={{fontWeight: '700'}}>Normal (&lt;140)</AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={st.inputBox} onPress={() => openNumpad('diastolic', diastolic, 'Diastolic BP', 'mmHg')}>
          <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '700'}}>Diastolic</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(20), marginVertical: vs(4)}}>{diastolic} mmHg</AppText>
          <View style={[st.pill, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="subtext" color={Colors.tealText} style={{fontWeight: '700'}}>Normal (&lt;90)</AppText>
          </View>
        </TouchableOpacity>
      </View>

      <View style={[st.insight, {backgroundColor: Colors.amberBg, borderColor: '#FDDCB5'}]}>
        <Icon family="Ionicons" name="warning-outline" size={ms(16)} color={Colors.amberDark} />
        <AppText variant="caption" color={Colors.amberDark} style={{flex: 1, lineHeight: ms(17)}}>
          <AppText style={{fontWeight: '700'}}>Pre-eclampsia threshold: BP \u2265140/90.</AppText> Measure BP 2\u00d7 daily from Week 20. If BP \u2265140/90 + headache + visual disturbance + swelling - go to hospital immediately. Pre-eclampsia is life-threatening and can only be cured by delivery.
        </AppText>
      </View>

      <Section title="Weight this week" />
      <TouchableOpacity activeOpacity={0.7} style={[st.inputBox, {width: '100%'}]} onPress={() => openNumpad('weight', weight, 'Weight', 'kg')}>
        <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '700'}}>Weight - undressed - morning</AppText>
        <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(22), marginVertical: vs(4)}}>{weight} kg</AppText>
        <View style={{flexDirection: 'row', gap: s(6), flexWrap: 'wrap'}}>
          <View style={[st.pill, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="subtext" color={Colors.tealText} style={{fontWeight: '700'}}>+6.4 kg from pre-pregnancy</AppText>
          </View>
          <View style={[st.pill, {backgroundColor: '#F1F1F1'}]}>
            <AppText variant="subtext" color={Colors.textSecondary} style={{fontWeight: '700'}}>Target by W16: +4-6 kg</AppText>
          </View>
        </View>
      </TouchableOpacity>

      <Section title="Supplements taken today" />
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
        <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(8), lineHeight: ms(15), fontStyle: 'italic'}}>
          Take IFA and Vitamin D together in the morning. Take Calcium separately (2h apart from IFA). Never take IFA with tea, coffee, or dairy.
        </AppText>
      </View>

      <Section title="Sleep last night" />
      <View style={st.card}>
        <View style={st.sleepRow}>
          <TouchableOpacity activeOpacity={0.7} style={st.sleepCell} onPress={() => openNumpad('sleep', sleepHours, 'Sleep hours', 'hours')}>
            <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '700'}}>Hours</AppText>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(18), marginTop: vs(2)}}>{sleepHours}h</AppText>
          </TouchableOpacity>
          <View style={st.sleepCell}>
            <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '700'}}>Quality</AppText>
            <AppText variant="bodyBold" color={Colors.amberDark} style={{fontSize: ms(13), marginTop: vs(2)}}>Interrupted</AppText>
            <AppText variant="subtext" color={Colors.textSecondary}>3 wakeups</AppText>
          </View>
          <View style={st.sleepCell}>
            <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '700'}}>Position</AppText>
            <AppText variant="bodyBold" color={Colors.tealText} style={{fontSize: ms(13), marginTop: vs(2)}}>Left side</AppText>
            <AppText variant="subtext" color={Colors.textSecondary}>Recommended</AppText>
          </View>
        </View>
        <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(10), lineHeight: ms(15), fontStyle: 'italic'}}>
          Sleep on your left side from Week 28 onwards - it optimises blood flow to placenta and baby. Before Week 28, any comfortable position is fine. A pillow between knees reduces hip/back strain.
        </AppText>
      </View>
    </>
  );

  const renderEpds = () => {
    let interp = '';
    if (epdsScore <= 8) interp = 'Score 0-8: low risk. Your answers indicate good emotional wellbeing this week. Continue to share how you\u2019re feeling with your birth partner and OB at each visit.';
    else if (epdsScore <= 12) interp = 'Score 9-12: borderline. Some low mood indicators. Discuss with Dr. Suma Rao at your next visit.';
    else interp = 'Score \u226513: clinical range. Please contact Dr. Suma Rao or iCall (9152987821) for support. This is medical and treatable.';

    const scoreBg = epdsScore <= 8 ? Colors.tealBg : epdsScore <= 12 ? Colors.amberBg : Colors.redBg;
    const scoreText = epdsScore <= 8 ? Colors.tealText : epdsScore <= 12 ? Colors.amberDark : Colors.redText;
    const scoreBorder = epdsScore <= 8 ? Colors.paleGreen : epdsScore <= 12 ? '#FDDCB5' : '#F3C6C6';

    return (
      <>
        <View style={[st.insight, {backgroundColor: Colors.blueBg, borderColor: '#BBD6F0'}]}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={Colors.blueText} />
          <AppText variant="caption" color={Colors.blueText} style={{flex: 1, lineHeight: ms(17)}}>
            <AppText style={{fontWeight: '700'}}>Edinburgh Postnatal Depression Scale (EPDS).</AppText> Validated for antenatal AND postnatal use. 10 questions. Recommended at every trimester during pregnancy and at 2 weeks, 6 weeks, and 3 months postpartum by IAP. Score \u226513 = seek support.
          </AppText>
        </View>

        {EPDS_QUESTIONS.map((q, qi) => (
          <View key={q.key} style={[st.card, q.warning && {borderColor: PINK_BORDER, backgroundColor: '#FFF7FA'}]}>
            <View style={{flexDirection: 'row', alignItems: 'flex-start', gap: s(6), marginBottom: vs(8)}}>
              {q.warning && <Icon family="Ionicons" name="warning" size={ms(14)} color={PINK} />}
              <AppText variant="bodyBold" color={q.warning ? PINK : Colors.textPrimary} style={{flex: 1, fontSize: ms(13)}}>
                {qi + 1}. {q.text}
              </AppText>
            </View>
            {q.warning && (
              <AppText variant="subtext" color={PINK} style={{marginBottom: vs(8), fontStyle: 'italic'}}>
                This question is asked for your safety. Your answers are confidential.
              </AppText>
            )}
            <View style={st.epdsGrid}>
              {q.options.map((opt, oi) => {
                const selected = epdsAnswers[q.key] === oi;
                return (
                  <TouchableOpacity
                    key={oi}
                    activeOpacity={0.7}
                    onPress={() => setEpdsAnswers(prev => ({...prev, [q.key]: oi}))}
                    style={[st.epdsOpt, selected && {backgroundColor: PINK_BG, borderColor: PINK}]}>
                    <AppText variant="caption" color={selected ? PINK : Colors.textPrimary} style={{fontWeight: selected ? '700' : '500', textAlign: 'center'}}>{opt.label}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}

        <View style={[st.scoreBox, {backgroundColor: scoreBg, borderColor: scoreBorder}]}>
          <AppText variant="bodyBold" color={scoreText} style={{fontSize: ms(15)}}>Current EPDS score: {epdsScore} / 30</AppText>
          <AppText variant="caption" color={scoreText} style={{marginTop: vs(6), lineHeight: ms(17)}}>{interp}</AppText>
        </View>

        <View style={[st.insight, {backgroundColor: PINK_BG, borderColor: PINK_BORDER}]}>
          <Icon family="Ionicons" name="heart-outline" size={ms(16)} color={PINK} />
          <AppText variant="caption" color={PINK} style={{flex: 1, lineHeight: ms(17)}}>
            If you score \u226513, or if question 10 is answered with anything other than \u201cNever,\u201d please contact Dr. Suma Rao, iCall (9152987821), or Vandrevala Foundation (1860-2662-345). You are not alone - perinatal mental illness is common, treatable, and never your fault.
          </AppText>
        </View>
      </>
    );
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Fixed Header */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topRow}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
            <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
            </TouchableOpacity>
            <AppText variant="body" color="rgba(255,255,255,0.8)">Daily wellbeing</AppText>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={st.savePill}>
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Save</AppText>
            <Icon family="Ionicons" name="checkmark" size={ms(14)} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <View style={{paddingHorizontal: s(2), paddingBottom: vs(10)}}>
          <AppText variant="screenName" color={Colors.white}>Daily wellbeing</AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.6)" style={{marginTop: vs(2)}}>Week 16 - Kicks - Vitals - Mood - Symptoms</AppText>
        </View>

        {/* Tab bar */}
        <View style={st.tabBar}>
          {TABS.map(t => {
            const active = activeTab === t.key;
            return (
              <TouchableOpacity
                key={t.key}
                activeOpacity={0.7}
                onPress={() => setActiveTab(t.key)}
                style={[st.tabPill, active && {backgroundColor: Colors.white}]}>
                <AppText variant="caption" color={active ? Colors.primary : 'rgba(255,255,255,0.8)'} style={{fontWeight: '700'}}>{t.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Scrollable Body */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'wellbeing' && renderWellbeing()}
        {activeTab === 'kicks' && renderKicks()}
        {activeTab === 'vitals' && renderVitals()}
        {activeTab === 'epds' && renderEpds()}
        <View style={{height: vs(20)}} />
      </ScrollView>

      {/* Sticky save bar */}
      <View style={[st.saveBar, {paddingBottom: Math.max(insets.bottom, vs(10))}]}>
        <TouchableOpacity activeOpacity={0.85} style={st.saveBtn}>
          <Icon family="Ionicons" name="save-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white}>Save wellbeing log</AppText>
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
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(8)},
  topRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(8)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  savePill: {flexDirection: 'row', alignItems: 'center', gap: s(4), paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(20), backgroundColor: 'rgba(255,255,255,0.18)'},

  // Tab bar
  tabBar: {flexDirection: 'row', gap: s(6), backgroundColor: 'rgba(0,0,0,0.18)', padding: s(4), borderRadius: ms(12)},
  tabPill: {flex: 1, paddingVertical: vs(7), borderRadius: ms(9), alignItems: 'center'},

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(6)},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Card
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12), marginBottom: vs(8)},

  // Scale
  scaleRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(10)},
  scaleDot: {width: ms(26), height: ms(26), borderRadius: ms(13), alignItems: 'center', justifyContent: 'center'},
  scaleLabelRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},

  // Chips
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6)},
  chip: {flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(10), paddingVertical: vs(6), borderRadius: ms(20), backgroundColor: Colors.white, borderWidth: 1, borderColor: '#E5DDD3'},

  // Alert
  alertBox: {marginTop: vs(12), backgroundColor: Colors.redBg, borderWidth: 1, borderColor: '#F3C6C6', borderRadius: ms(12), padding: ms(11)},
  alertHeader: {flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(8)},
  warnRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(6), paddingVertical: vs(4)},

  // Insight
  insight: {borderRadius: ms(11), borderWidth: 1, padding: ms(10), marginBottom: vs(8), marginTop: vs(8), flexDirection: 'row', alignItems: 'flex-start', gap: s(8)},

  // Kick hero
  kickHero: {backgroundColor: Colors.primary, borderRadius: ms(18), padding: ms(18), alignItems: 'center', marginTop: vs(6)},
  kickBtn: {width: ms(72), height: ms(72), borderRadius: ms(36), backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 2, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center', marginTop: vs(6)},
  kickStatsRow: {flexDirection: 'row', justifyContent: 'space-between', width: '100%', marginTop: vs(14), paddingTop: vs(12), borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.2)'},
  kickStat: {flex: 1, alignItems: 'center'},

  // History table
  histHeader: {flexDirection: 'row', paddingBottom: vs(6), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5DDD3'},
  histRow: {flexDirection: 'row', paddingVertical: vs(8), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F3EFE8', alignItems: 'center'},
  histCell: {flex: 1},

  // Vitals
  row2: {flexDirection: 'row', gap: s(8)},
  inputBox: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12)},
  pill: {alignSelf: 'flex-start', paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(10), marginTop: vs(4)},

  // Supplements
  suppRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(9), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F3EFE8'},
  suppCheck: {width: ms(28), height: ms(28), borderRadius: ms(8), borderWidth: 1.5, borderColor: '#D5D5D5', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white},

  // Sleep
  sleepRow: {flexDirection: 'row', gap: s(8)},
  sleepCell: {flex: 1, backgroundColor: '#FAF8F5', borderRadius: ms(10), padding: ms(10), alignItems: 'center'},

  // EPDS
  epdsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6)},
  epdsOpt: {width: '48%', paddingVertical: vs(8), paddingHorizontal: s(8), borderRadius: ms(10), borderWidth: 1, borderColor: '#E5DDD3', backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center', minHeight: vs(38)},
  scoreBox: {borderRadius: ms(12), borderWidth: 1, padding: ms(12), marginTop: vs(10), marginBottom: vs(4)},

  // Save bar
  saveBar: {paddingHorizontal: s(13), paddingTop: vs(10), backgroundColor: Colors.white, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5DDD3'},
  saveBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(8), backgroundColor: Colors.primary, paddingVertical: vs(13), borderRadius: ms(12)},
});

export default WellbeingScreen;
