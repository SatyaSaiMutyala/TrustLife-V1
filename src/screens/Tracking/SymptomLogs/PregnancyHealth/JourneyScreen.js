import React, {useState} from 'react';
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

const MOODS = [
  {key: 'great', label: 'Great', icon: 'happy-outline'},
  {key: 'okay', label: 'Okay', icon: 'remove-circle-outline'},
  {key: 'tired', label: 'Tired', icon: 'bed-outline'},
  {key: 'low', label: 'Low', icon: 'sad-outline'},
  {key: 'anxious', label: 'Anxious', icon: 'alert-circle-outline'},
];

const SYMPTOMS = [
  'Nausea', 'Heartburn', 'Backache', 'Swelling', 'Headache',
  'Cramps', 'Fatigue', 'Constipation', 'Dizziness', 'Insomnia',
];

const ENERGY_LEVELS = ['Low', 'Medium', 'High'];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const Section = ({title}) => (
  <View style={st.sec}>
    <AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{title}</AppText>
    <View style={st.secLine} />
  </View>
);

const Stepper = ({value, onChange, min = 0, max = 999, suffix}) => (
  <View style={st.stepperRow}>
    <TouchableOpacity
      style={st.stepBtn}
      activeOpacity={0.7}
      onPress={() => onChange(Math.max(min, value - 1))}>
      <Icon family="Ionicons" name="remove" size={ms(16)} color={Colors.primary} />
    </TouchableOpacity>
    <View style={{alignItems: 'center', flex: 1}}>
      <AppText color={Colors.primary} style={{fontSize: ms(28), fontWeight: '800'}}>{value}</AppText>
      {suffix ? <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(10)}}>{suffix}</AppText> : null}
    </View>
    <TouchableOpacity
      style={st.stepBtn}
      activeOpacity={0.7}
      onPress={() => onChange(Math.min(max, value + 1))}>
      <Icon family="Ionicons" name="add" size={ms(16)} color={Colors.primary} />
    </TouchableOpacity>
  </View>
);

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const JourneyScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [week, setWeek] = useState(16);
  const [weight, setWeight] = useState('62.5');
  const [systolic, setSystolic] = useState('118');
  const [diastolic, setDiastolic] = useState('76');
  const [mood, setMood] = useState('okay');
  const [energy, setEnergy] = useState(1);
  const [kicks, setKicks] = useState(0);
  const [sleepHours, setSleepHours] = useState(7);
  const [waterGlasses, setWaterGlasses] = useState(4);
  const [symptoms, setSymptoms] = useState(['Nausea']);

  const [numpadField, setNumpadField] = useState(null);
  const [numpadInitial, setNumpadInitial] = useState('');

  const openNumpad = (field, initial) => {
    setNumpadField(field);
    setNumpadInitial(initial);
  };

  const onNumpadConfirm = (val) => {
    if (numpadField === 'weight') setWeight(val);
    else if (numpadField === 'systolic') setSystolic(val);
    else if (numpadField === 'diastolic') setDiastolic(val);
    setNumpadField(null);
  };

  const toggleSymptom = (sym) => {
    setSymptoms(prev => prev.includes(sym) ? prev.filter(x => x !== sym) : [...prev, sym]);
  };

  const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;

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
            <AppText variant="screenName" style={{color: Colors.white, fontSize: ms(18), fontWeight: '700'}}>Pregnancy journey</AppText>
            <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', fontSize: ms(11)}}>Trimester {trimester} - Week {week}</AppText>
          </View>
        </View>
      </View>

      {/* ── BODY ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Current week */}
        <View style={st.heroCard}>
          <AppText variant="subtext" color="rgba(255,255,255,0.55)" style={st.heroLabel}>Current week</AppText>
          <View style={st.weekRow}>
            <TouchableOpacity
              style={st.weekStep}
              activeOpacity={0.7}
              onPress={() => setWeek(w => Math.max(1, w - 1))}>
              <Icon family="Ionicons" name="remove" size={ms(18)} color={Colors.white} />
            </TouchableOpacity>
            <View style={{alignItems: 'center', flex: 1}}>
              <AppText color={Colors.white} style={{fontSize: ms(48), fontWeight: '800'}}>{week}</AppText>
              <AppText variant="subtext" color="rgba(255,255,255,0.7)" style={{fontSize: ms(11)}}>Trimester {trimester} {'\u00b7'} {40 - week} weeks to go</AppText>
            </View>
            <TouchableOpacity
              style={st.weekStep}
              activeOpacity={0.7}
              onPress={() => setWeek(w => Math.min(42, w + 1))}>
              <Icon family="Ionicons" name="add" size={ms(18)} color={Colors.white} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Vitals */}
        <Section title="Vitals" />
        <View style={st.grid2}>
          <TouchableOpacity style={[st.measureBox, {marginRight: s(6)}]} activeOpacity={0.8} onPress={() => openNumpad('weight', weight)}>
            <View style={st.measureHeaderRow}>
              <Icon family="Ionicons" name="scale-outline" size={ms(14)} color={Colors.textSecondary} />
              <AppText variant="subtext" color={Colors.textSecondary} style={{marginLeft: s(5), fontWeight: '700'}}>Weight</AppText>
            </View>
            <AppText variant="screenName" color={Colors.primary} style={{marginTop: vs(4)}}>{weight} kg</AppText>
          </TouchableOpacity>

          <TouchableOpacity style={[st.measureBox, {marginLeft: s(6)}]} activeOpacity={0.8} onPress={() => openNumpad('systolic', systolic)}>
            <View style={st.measureHeaderRow}>
              <Icon family="Ionicons" name="heart-outline" size={ms(14)} color={Colors.textSecondary} />
              <AppText variant="subtext" color={Colors.textSecondary} style={{marginLeft: s(5), fontWeight: '700'}}>BP</AppText>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'flex-end', marginTop: vs(4)}}>
              <AppText variant="screenName" color={Colors.primary}>{systolic}</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{marginHorizontal: s(3)}}>/</AppText>
              <TouchableOpacity onPress={() => openNumpad('diastolic', diastolic)}>
                <AppText variant="screenName" color={Colors.primary}>{diastolic}</AppText>
              </TouchableOpacity>
              <AppText variant="subtext" color={Colors.textSecondary} style={{marginLeft: s(4), marginBottom: vs(3)}}>mmHg</AppText>
            </View>
          </TouchableOpacity>
        </View>

        {/* Mood */}
        <Section title="Mood today" />
        <View style={st.card}>
          <View style={st.moodRow}>
            {MOODS.map(m => {
              const active = mood === m.key;
              return (
                <TouchableOpacity
                  key={m.key}
                  style={[st.moodChip, active && st.moodChipActive]}
                  activeOpacity={0.7}
                  onPress={() => setMood(m.key)}>
                  <Icon family="Ionicons" name={m.icon} size={ms(20)} color={active ? Colors.primary : Colors.textSecondary} />
                  <AppText
                    variant="subtext"
                    color={active ? Colors.primary : Colors.textSecondary}
                    style={{fontSize: ms(9), marginTop: vs(4), fontWeight: active ? '700' : '500'}}>
                    {m.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Energy */}
        <Section title="Energy level" />
        <View style={st.card}>
          <View style={st.chipWrap}>
            {ENERGY_LEVELS.map((item, i) => {
              const isOn = energy === i;
              return (
                <TouchableOpacity
                  key={i}
                  style={[st.mchip, isOn && st.mchipOn]}
                  onPress={() => setEnergy(i)}
                  activeOpacity={0.7}>
                  <AppText variant="caption" color={isOn ? Colors.primary : '#555'} style={{fontWeight: isOn ? '700' : '500'}}>
                    {item}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Kick counts */}
        {week >= 16 && (
          <>
            <Section title="Foetal movements" />
            <View style={st.card}>
              <Stepper value={kicks} onChange={setKicks} min={0} max={50} suffix="kicks counted" />
            </View>
          </>
        )}

        {/* Sleep */}
        <Section title="Sleep last night" />
        <View style={st.card}>
          <Stepper value={sleepHours} onChange={setSleepHours} min={0} max={14} suffix="hours" />
        </View>

        {/* Water */}
        <Section title="Water intake" />
        <View style={st.card}>
          <Stepper value={waterGlasses} onChange={setWaterGlasses} min={0} max={20} suffix="glasses (250ml)" />
        </View>

        {/* Symptoms */}
        <Section title={`Symptoms today · ${symptoms.length} selected`} />
        <View style={st.card}>
          <View style={st.chipWrap}>
            {SYMPTOMS.map(sym => {
              const isOn = symptoms.includes(sym);
              return (
                <TouchableOpacity
                  key={sym}
                  style={[st.mchip, isOn && st.mchipOn]}
                  onPress={() => toggleSymptom(sym)}
                  activeOpacity={0.7}>
                  <AppText variant="caption" color={isOn ? Colors.primary : '#555'} style={{fontWeight: isOn ? '700' : '500'}}>
                    {sym}
                  </AppText>
                  {isOn && <Icon family="Ionicons" name="checkmark" size={ms(13)} color={Colors.primary} style={{marginLeft: s(4)}} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{height: vs(20)}} />
      </ScrollView>

      {/* ── Save Button ── */}
      <View style={st.bottomBar}>
        <TouchableOpacity style={st.primaryButton} activeOpacity={0.85}>
          <Icon family="Ionicons" name="save-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
            Save week {week} log
          </AppText>
        </TouchableOpacity>
      </View>

      <NumpadModal
        visible={!!numpadField}
        title={numpadField === 'weight' ? 'Weight (kg)' : numpadField === 'systolic' ? 'Systolic BP' : 'Diastolic BP'}
        hint={numpadField === 'weight' ? 'Enter weight in kg' : 'Enter BP in mmHg'}
        initialValue={numpadInitial}
        onClose={() => setNumpadField(null)}
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

  // Hero week card
  heroCard: {backgroundColor: Colors.primary, borderRadius: ms(18), padding: ms(16)},
  heroLabel: {textTransform: 'uppercase', letterSpacing: 0.5, fontSize: ms(9), marginBottom: vs(8), textAlign: 'center'},
  weekRow: {flexDirection: 'row', alignItems: 'center'},
  weekStep: {width: ms(40), height: ms(40), borderRadius: ms(20), backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center'},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7), fontSize: ms(9)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Card
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12), marginBottom: vs(4)},

  // Vitals grid
  grid2: {flexDirection: 'row'},
  measureBox: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12)},
  measureHeaderRow: {flexDirection: 'row', alignItems: 'center'},

  // Stepper
  stepperRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  stepBtn: {width: ms(36), height: ms(36), borderRadius: ms(18), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center'},

  // Mood
  moodRow: {flexDirection: 'row', justifyContent: 'space-between', gap: s(6)},
  moodChip: {flex: 1, paddingVertical: vs(10), borderRadius: ms(10), borderWidth: 0.5, borderColor: '#E5DDD3', backgroundColor: '#fff', alignItems: 'center'},
  moodChipActive: {backgroundColor: '#F4F3FF', borderColor: Colors.primary},

  // Chips
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(5)},
  mchip: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(11), paddingVertical: vs(7), borderRadius: ms(20), borderWidth: 0.5, borderColor: '#E5DDD3', backgroundColor: '#fff'},
  mchipOn: {backgroundColor: '#F4F3FF', borderColor: Colors.primary},

  // Bottom
  bottomBar: {backgroundColor: Colors.white, paddingHorizontal: s(13), paddingTop: vs(8), paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10), borderTopWidth: 0.5, borderTopColor: '#d1d5db'},
  primaryButton: {flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: vs(13), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
});

export default JourneyScreen;
