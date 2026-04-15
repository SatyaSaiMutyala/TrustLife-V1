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

const VISIT_TYPES = [
  {key: 'booking', label: 'Booking'},
  {key: 'routine', label: 'Routine ANC'},
  {key: 'scan', label: 'Scan'},
  {key: 'lab', label: 'Lab tests'},
  {key: 'emergency', label: 'Emergency'},
];

const PROVIDERS = ['Apollo - Dr. Suma Rao', 'KIMS', 'Fernandez', 'Govt. PHC', 'Other'];

const TESTS_DONE = [
  'Hb', 'Urine R/E', 'Blood sugar', 'TSH', 'Blood group',
  'HIV', 'HBsAg', 'VDRL', 'Rubella IgG', 'OGTT', 'GBS swab', 'Anti-D',
];

const SCAN_TYPES = ['Viability', 'NT scan', 'Anomaly (TIFFA)', 'Growth scan', 'Doppler', 'Biophysical'];

const VACCINES = ['TT1', 'TT2', 'TdaP', 'Influenza', 'COVID booster'];

const SYMPTOMS_NOTED = [
  'None', 'Swelling', 'Headache', 'Vision changes', 'Cramps',
  'Bleeding', 'Discharge', 'Reduced movement', 'Contractions',
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

const Stepper = ({value, onChange, min = 0, max = 999, suffix}) => (
  <View style={st.stepperRow}>
    <TouchableOpacity style={st.stepBtn} activeOpacity={0.7} onPress={() => onChange(Math.max(min, value - 1))}>
      <Icon family="Ionicons" name="remove" size={ms(16)} color={Colors.primary} />
    </TouchableOpacity>
    <View style={{alignItems: 'center', flex: 1}}>
      <AppText color={Colors.primary} style={{fontSize: ms(28), fontWeight: '800'}}>{value}</AppText>
      {suffix ? <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(10)}}>{suffix}</AppText> : null}
    </View>
    <TouchableOpacity style={st.stepBtn} activeOpacity={0.7} onPress={() => onChange(Math.min(max, value + 1))}>
      <Icon family="Ionicons" name="add" size={ms(16)} color={Colors.primary} />
    </TouchableOpacity>
  </View>
);

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const AntenatalScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [visitType, setVisitType] = useState('routine');
  const [provider, setProvider] = useState(0);
  const [week, setWeek] = useState(16);

  const [systolic, setSystolic] = useState('118');
  const [diastolic, setDiastolic] = useState('72');
  const [weight, setWeight] = useState('58.4');
  const [fundalHeight, setFundalHeight] = useState(16);
  const [fhr, setFhr] = useState(152);

  const [tests, setTests] = useState(['Hb', 'Urine R/E']);
  const [scans, setScans] = useState([]);
  const [vaccines, setVaccines] = useState([]);
  const [symptoms, setSymptoms] = useState(['None']);

  const [numpadField, setNumpadField] = useState(null);
  const [numpadInitial, setNumpadInitial] = useState('');

  const openNumpad = (field, initial) => {
    setNumpadField(field);
    setNumpadInitial(initial);
  };

  const onNumpadConfirm = (val) => {
    if (numpadField === 'systolic') setSystolic(val);
    else if (numpadField === 'diastolic') setDiastolic(val);
    else if (numpadField === 'weight') setWeight(val);
    setNumpadField(null);
  };

  const toggle = (setArr, item) => {
    setArr(prev => prev.includes(item) ? prev.filter(x => x !== item) : [...prev, item]);
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
            <AppText variant="screenName" style={{color: Colors.white, fontSize: ms(18), fontWeight: '700'}}>Antenatal visit</AppText>
            <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', fontSize: ms(11)}}>Trimester {trimester} - Week {week}</AppText>
          </View>
        </View>
      </View>

      {/* ── BODY ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Visit type */}
        <Section title="Visit type" />
        <View style={st.card}>
          <View style={st.chipWrap}>
            {VISIT_TYPES.map(v => {
              const active = visitType === v.key;
              return (
                <TouchableOpacity key={v.key} style={[st.mchip, active && st.mchipOn]} onPress={() => setVisitType(v.key)} activeOpacity={0.7}>
                  <AppText variant="caption" color={active ? Colors.primary : '#555'} style={{fontWeight: active ? '700' : '500'}}>{v.label}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Week */}
        <Section title="Gestational week" />
        <View style={st.card}>
          <Stepper value={week} onChange={setWeek} min={1} max={42} suffix={`weeks · Trimester ${trimester}`} />
        </View>

        {/* Provider */}
        <Section title="Provider / facility" />
        <View style={st.card}>
          <View style={st.chipWrap}>
            {PROVIDERS.map((p, i) => {
              const active = provider === i;
              return (
                <TouchableOpacity key={p} style={[st.mchip, active && st.mchipOn]} onPress={() => setProvider(i)} activeOpacity={0.7}>
                  <AppText variant="caption" color={active ? Colors.primary : '#555'} style={{fontWeight: active ? '700' : '500'}}>{p}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Vitals */}
        <Section title="Vitals" />
        <View style={st.grid2}>
          <TouchableOpacity style={[st.measureBox, {marginRight: s(6)}]} activeOpacity={0.8} onPress={() => openNumpad('systolic', systolic)}>
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
            </View>
          </TouchableOpacity>

          <TouchableOpacity style={[st.measureBox, {marginLeft: s(6)}]} activeOpacity={0.8} onPress={() => openNumpad('weight', weight)}>
            <View style={st.measureHeaderRow}>
              <Icon family="Ionicons" name="scale-outline" size={ms(14)} color={Colors.textSecondary} />
              <AppText variant="subtext" color={Colors.textSecondary} style={{marginLeft: s(5), fontWeight: '700'}}>Weight</AppText>
            </View>
            <AppText variant="screenName" color={Colors.primary} style={{marginTop: vs(4)}}>{weight} kg</AppText>
          </TouchableOpacity>
        </View>

        {/* Fundal height */}
        <Section title="Fundal height" />
        <View style={st.card}>
          <Stepper value={fundalHeight} onChange={setFundalHeight} min={0} max={45} suffix="cm" />
        </View>

        {/* FHR */}
        <Section title="Foetal heart rate" />
        <View style={st.card}>
          <View style={st.stepperRow}>
            <TouchableOpacity style={st.stepBtn} activeOpacity={0.7} onPress={() => setFhr(f => Math.max(80, f - 5))}>
              <Icon family="Ionicons" name="remove" size={ms(16)} color={Colors.primary} />
            </TouchableOpacity>
            <View style={{alignItems: 'center', flex: 1}}>
              <AppText color={Colors.primary} style={{fontSize: ms(28), fontWeight: '800'}}>{fhr}</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(10)}}>bpm (normal 110-160)</AppText>
            </View>
            <TouchableOpacity style={st.stepBtn} activeOpacity={0.7} onPress={() => setFhr(f => Math.min(200, f + 5))}>
              <Icon family="Ionicons" name="add" size={ms(16)} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tests done */}
        <Section title={`Tests done · ${tests.length} selected`} />
        <View style={st.card}>
          <View style={st.chipWrap}>
            {TESTS_DONE.map(t => {
              const isOn = tests.includes(t);
              return (
                <TouchableOpacity key={t} style={[st.mchip, isOn && st.mchipOn]} onPress={() => toggle(setTests, t)} activeOpacity={0.7}>
                  <AppText variant="caption" color={isOn ? Colors.primary : '#555'} style={{fontWeight: isOn ? '700' : '500'}}>{t}</AppText>
                  {isOn && <Icon family="Ionicons" name="checkmark" size={ms(13)} color={Colors.primary} style={{marginLeft: s(4)}} />}
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Scans */}
        <Section title={`Scans done · ${scans.length} selected`} />
        <View style={st.card}>
          <View style={st.chipWrap}>
            {SCAN_TYPES.map(t => {
              const isOn = scans.includes(t);
              return (
                <TouchableOpacity key={t} style={[st.mchip, isOn && st.mchipOn]} onPress={() => toggle(setScans, t)} activeOpacity={0.7}>
                  <AppText variant="caption" color={isOn ? Colors.primary : '#555'} style={{fontWeight: isOn ? '700' : '500'}}>{t}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Vaccines */}
        <Section title={`Vaccines given · ${vaccines.length} selected`} />
        <View style={st.card}>
          <View style={st.chipWrap}>
            {VACCINES.map(t => {
              const isOn = vaccines.includes(t);
              return (
                <TouchableOpacity key={t} style={[st.mchip, isOn && st.mchipOn]} onPress={() => toggle(setVaccines, t)} activeOpacity={0.7}>
                  <AppText variant="caption" color={isOn ? Colors.primary : '#555'} style={{fontWeight: isOn ? '700' : '500'}}>{t}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Symptoms */}
        <Section title="Symptoms / observations" />
        <View style={st.card}>
          <View style={st.chipWrap}>
            {SYMPTOMS_NOTED.map(t => {
              const isOn = symptoms.includes(t);
              return (
                <TouchableOpacity key={t} style={[st.mchip, isOn && st.mchipOn]} onPress={() => toggle(setSymptoms, t)} activeOpacity={0.7}>
                  <AppText variant="caption" color={isOn ? Colors.primary : '#555'} style={{fontWeight: isOn ? '700' : '500'}}>{t}</AppText>
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
            Save week {week} visit
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

  // Chips
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(5)},
  mchip: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(11), paddingVertical: vs(7), borderRadius: ms(20), borderWidth: 0.5, borderColor: '#E5DDD3', backgroundColor: '#fff'},
  mchipOn: {backgroundColor: '#F4F3FF', borderColor: Colors.primary},

  // Bottom
  bottomBar: {backgroundColor: Colors.white, paddingHorizontal: s(13), paddingTop: vs(8), paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10), borderTopWidth: 0.5, borderTopColor: '#d1d5db'},
  primaryButton: {flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: vs(13), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
});

export default AntenatalScreen;
