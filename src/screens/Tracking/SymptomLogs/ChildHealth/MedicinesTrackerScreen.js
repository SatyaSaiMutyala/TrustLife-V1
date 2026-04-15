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

const DRUGS = {
  para: {name: 'Paracetamol', mgkg: 15, max: 1000, freq: '4-6h', maxDoses: 5, suspConc: 250, suspMl: 5},
  ibu: {name: 'Ibuprofen', mgkg: 7.5, max: 400, freq: '6-8h', maxDoses: 3, suspConc: 100, suspMl: 5},
  amox: {name: 'Amoxicillin', mgkg: 45, max: 875, freq: '8h', maxDoses: 3, suspConc: 250, suspMl: 5},
  cetirizine: {name: 'Cetirizine', mgkg: null, fixed: 5, max: 10, freq: '24h', maxDoses: 1, suspConc: 5, suspMl: 5},
};

const DRUG_ORDER = ['para', 'ibu', 'amox', 'cetirizine'];

const CHILD_CHIPS = [
  {key: 'zara', label: 'Baby Zara'},
  {key: 'aarav', label: 'Aarav'},
];

const MED_CHIPS = [
  {key: 'amox', label: 'Amoxicillin'},
  {key: 'azi', label: 'Azithromycin'},
  {key: 'cet', label: 'Cetirizine'},
  {key: 'pred', label: 'Prednisolone'},
  {key: 'sal', label: 'Salbutamol'},
  {key: 'other', label: 'Other'},
];

const COURSE_CHIPS = [
  {key: '3', label: '3 days'},
  {key: '5', label: '5 days'},
  {key: '7', label: '7 days'},
  {key: '10', label: '10 days'},
  {key: '14', label: '14 days'},
];

const FORM_CHIPS = ['Suspension', 'Tablet', 'Drops', 'Injection'];
const TIMING_CHIPS = ['Before food', 'After food', 'Empty stomach'];

const calcDose = (weight, medKey) => {
  const drug = DRUGS[medKey];
  const dose = drug.mgkg ? Math.round(Math.min(drug.mgkg * weight, drug.max)) : drug.fixed;
  const ml = Math.round((dose / drug.suspConc) * drug.suspMl * 10) / 10;
  return {dose, ml, drug};
};

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const Section = ({title}) => (
  <View style={st.sec}>
    <AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{title}</AppText>
    <View style={st.secLine} />
  </View>
);

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const MedicinesTrackerScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [currentWeight, setCurrentWeight] = useState(27.4);
  const [currentMedKey, setCurrentMedKey] = useState('para');
  const [numpadVisible, setNumpadVisible] = useState(false);

  const [selectedChild, setSelectedChild] = useState('aarav');
  const [selectedMed, setSelectedMed] = useState('amox');
  const [selectedCourseLength, setSelectedCourseLength] = useState('7');
  const [selectedForm, setSelectedForm] = useState(0);
  const [selectedTiming, setSelectedTiming] = useState(1);
  const [dosesToday, setDosesToday] = useState(0);

  const totalDays = parseInt(selectedCourseLength, 10);
  const [courseDays, setCourseDays] = useState(Array(14).fill(false));

  const {dose, ml, drug} = calcDose(currentWeight, currentMedKey);

  const cycleMed = () => {
    const idx = DRUG_ORDER.indexOf(currentMedKey);
    setCurrentMedKey(DRUG_ORDER[(idx + 1) % DRUG_ORDER.length]);
  };

  const toggleCourseDay = (idx) => {
    setCourseDays(prev => prev.map((d, i) => i === idx ? !d : d));
  };

  const completedDays = courseDays.slice(0, totalDays).filter(Boolean).length;

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
            <AppText variant="screenName" style={{color: Colors.white, fontSize: ms(18), fontWeight: '700'}}>Medicines tracker</AppText>
            <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', fontSize: ms(11)}}>Aarav - 9y 2m</AppText>
          </View>
        </View>
      </View>

      {/* ── BODY ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Dose calculator */}
        <View style={st.calcCard}>
          <AppText variant="subtext" color="rgba(255,255,255,0.55)" style={st.calcLabel}>Weight-based dose calculator</AppText>
          <View style={st.calcGrid}>
            <TouchableOpacity style={st.calcBox} activeOpacity={0.85} onPress={() => setNumpadVisible(true)}>
              <AppText variant="subtext" color="rgba(255,255,255,0.55)" style={st.calcBoxLbl}>Weight (kg)</AppText>
              <AppText variant="screenName" color={Colors.white} style={st.calcBoxVal}>{currentWeight}</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={st.calcBox} activeOpacity={0.85} onPress={cycleMed}>
              <AppText variant="subtext" color="rgba(255,255,255,0.55)" style={st.calcBoxLbl}>Medication</AppText>
              <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(16), marginTop: vs(6)}}>{drug.name}</AppText>
            </TouchableOpacity>
          </View>
          <View style={st.resultCard}>
            <AppText variant="screenName" color={Colors.white} style={st.resultBig}>{dose} mg</AppText>
            <AppText variant="subtext" color="rgba(255,255,255,0.7)" style={{textAlign: 'center', marginTop: vs(4)}}>
              = {ml} ml of {drug.suspConc}mg/{drug.suspMl}ml suspension
            </AppText>
            <AppText variant="subtext" color="rgba(255,255,255,0.5)" style={{textAlign: 'center', marginTop: vs(6), fontSize: ms(9), lineHeight: ms(13)}}>
              Every {drug.freq} {'\u00b7'} max {drug.maxDoses} doses/day {'\u00b7'} max {drug.max === 1000 ? '1g' : `${drug.max}mg`}/dose
            </AppText>
          </View>
        </View>

        {/* Doses today stepper */}
        <Section title="Doses given today" />
        <View style={st.card}>
          <View style={st.stepperRow}>
            <TouchableOpacity
              style={st.stepBtn}
              activeOpacity={0.7}
              onPress={() => setDosesToday(d => Math.max(0, d - 1))}>
              <Icon family="Ionicons" name="remove" size={ms(16)} color={Colors.primary} />
            </TouchableOpacity>
            <View style={{alignItems: 'center', flex: 1}}>
              <AppText color={Colors.primary} style={{fontSize: ms(28), fontWeight: '800'}}>{dosesToday} / {drug.maxDoses}</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(10)}}>doses today</AppText>
            </View>
            <TouchableOpacity
              style={st.stepBtn}
              activeOpacity={0.7}
              onPress={() => setDosesToday(d => Math.min(drug.maxDoses, d + 1))}>
              <Icon family="Ionicons" name="add" size={ms(16)} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add prescription */}
        <Section title="Prescription details" />
        <View style={st.card}>
          <AppText variant="subtext" color={Colors.textSecondary} style={st.fieldLabel}>For which child?</AppText>
          <View style={st.chipRow}>
            {CHILD_CHIPS.map((c) => {
              const active = selectedChild === c.key;
              return (
                <TouchableOpacity key={c.key} style={[st.chip, active && st.chipActive]} activeOpacity={0.7} onPress={() => setSelectedChild(c.key)}>
                  <AppText variant="subtext" color={active ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{c.label}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          <AppText variant="subtext" color={Colors.textSecondary} style={[st.fieldLabel, {marginTop: vs(12)}]}>Medication</AppText>
          <View style={st.chipRow}>
            {MED_CHIPS.map((c) => {
              const active = selectedMed === c.key;
              return (
                <TouchableOpacity key={c.key} style={[st.chip, active && st.chipActive]} activeOpacity={0.7} onPress={() => setSelectedMed(c.key)}>
                  <AppText variant="subtext" color={active ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{c.label}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          <AppText variant="subtext" color={Colors.textSecondary} style={[st.fieldLabel, {marginTop: vs(12)}]}>Form</AppText>
          <View style={st.chipRow}>
            {FORM_CHIPS.map((c, i) => {
              const active = selectedForm === i;
              return (
                <TouchableOpacity key={c} style={[st.chip, active && st.chipActive]} activeOpacity={0.7} onPress={() => setSelectedForm(i)}>
                  <AppText variant="subtext" color={active ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{c}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          <AppText variant="subtext" color={Colors.textSecondary} style={[st.fieldLabel, {marginTop: vs(12)}]}>Timing</AppText>
          <View style={st.chipRow}>
            {TIMING_CHIPS.map((c, i) => {
              const active = selectedTiming === i;
              return (
                <TouchableOpacity key={c} style={[st.chip, active && st.chipActive]} activeOpacity={0.7} onPress={() => setSelectedTiming(i)}>
                  <AppText variant="subtext" color={active ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{c}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          <AppText variant="subtext" color={Colors.textSecondary} style={[st.fieldLabel, {marginTop: vs(12)}]}>Course length</AppText>
          <View style={st.chipRow}>
            {COURSE_CHIPS.map((c) => {
              const active = selectedCourseLength === c.key;
              return (
                <TouchableOpacity key={c.key} style={[st.chip, active && st.chipActive]} activeOpacity={0.7} onPress={() => setSelectedCourseLength(c.key)}>
                  <AppText variant="subtext" color={active ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{c.label}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Course progress */}
        <Section title={`Course progress · ${completedDays}/${totalDays} days`} />
        <View style={st.card}>
          <AppText variant="subtext" color={Colors.textSecondary} style={{marginBottom: vs(8), fontSize: ms(10)}}>Tap each day after taking the dose</AppText>
          <View style={st.dayRow}>
            {Array.from({length: totalDays}, (_, i) => {
              const done = courseDays[i];
              return (
                <TouchableOpacity
                  key={i}
                  style={[st.dayBox, !done && st.dayBoxInactive]}
                  activeOpacity={0.7}
                  onPress={() => toggleCourseDay(i)}>
                  <AppText variant="subtext" color={done ? Colors.white : Colors.textSecondary} style={{fontWeight: '700'}}>{i + 1}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{height: vs(20)}} />
      </ScrollView>

      {/* ── Sticky bottom save ── */}
      <View style={st.bottomBar}>
        <TouchableOpacity style={st.primaryButton} activeOpacity={0.85}>
          <Icon family="Ionicons" name="save-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
            Save medicines log {'\u00b7'} {dosesToday} dose{dosesToday === 1 ? '' : 's'}
          </AppText>
        </TouchableOpacity>
      </View>

      <NumpadModal
        visible={numpadVisible}
        title="Child weight (kg)"
        hint="Enter weight in kilograms"
        initialValue={String(currentWeight)}
        onClose={() => setNumpadVisible(false)}
        onConfirm={(v) => { setCurrentWeight(Number(v) || 0); setNumpadVisible(false); }}
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

  // Calc card
  calcCard: {backgroundColor: Colors.primary, borderRadius: ms(18), padding: ms(14)},
  calcLabel: {textTransform: 'uppercase', letterSpacing: 0.5, fontSize: ms(9), marginBottom: vs(10)},
  calcGrid: {flexDirection: 'row', gap: s(9), marginBottom: vs(10)},
  calcBox: {flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.18)', borderRadius: ms(12), padding: ms(12)},
  calcBoxLbl: {textTransform: 'uppercase', letterSpacing: 0.5, fontSize: ms(9)},
  calcBoxVal: {fontSize: ms(26), fontWeight: '800', marginTop: vs(4)},
  resultCard: {backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.18)', borderRadius: ms(12), padding: ms(14)},
  resultBig: {fontSize: ms(40), fontWeight: '800', textAlign: 'center'},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7), fontSize: ms(9)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Card
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12), marginBottom: vs(4)},

  // Stepper
  stepperRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  stepBtn: {width: ms(36), height: ms(36), borderRadius: ms(18), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center'},

  // Field
  fieldLabel: {marginBottom: vs(6), fontSize: ms(10), fontWeight: '600'},

  // Chips
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6)},
  chip: {paddingHorizontal: s(11), paddingVertical: vs(6), borderRadius: ms(14), backgroundColor: '#F5F5F5', borderWidth: 0.5, borderColor: '#E5DDD3'},
  chipActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},

  // Course days
  dayRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6)},
  dayBox: {width: ms(32), height: ms(32), borderRadius: ms(8), backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center'},
  dayBoxInactive: {backgroundColor: '#F5F5F5', borderWidth: 0.5, borderColor: '#E5DDD3'},

  // Bottom
  bottomBar: {backgroundColor: Colors.white, paddingHorizontal: s(13), paddingTop: vs(8), paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10), borderTopWidth: 0.5, borderTopColor: '#d1d5db'},
  primaryButton: {flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: vs(13), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
});

export default MedicinesTrackerScreen;
