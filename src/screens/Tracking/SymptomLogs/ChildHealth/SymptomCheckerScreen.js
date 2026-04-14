import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../../constants/colors';
import AppText from '../../../../components/shared/AppText';
import Icon from '../../../../components/shared/Icons';

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const AGES = ['0-1 month', '1-3 months', '3-12 months', '1-5 years', '5-12 years', '12+ years'];

const SYMPTOMS = [
  {key: 'fever', name: 'Fever', icon: 'thermometer-outline'},
  {key: 'cough', name: 'Cough / cold', icon: 'medical-outline'},
  {key: 'vomiting', name: 'Vomiting', icon: 'sad-outline'},
  {key: 'diarrhoea', name: 'Diarrhoea', icon: 'water-outline'},
  {key: 'ear', name: 'Ear pain', icon: 'ear-outline'},
  {key: 'rash', name: 'Rash', icon: 'color-palette-outline'},
  {key: 'fatigue', name: 'Fatigue', icon: 'battery-dead-outline'},
  {key: 'stomach', name: 'Stomach pain', icon: 'body-outline'},
  {key: 'dehydration', name: 'Dehydration', icon: 'water-outline'},
  {key: 'breathing', name: 'Breathing difficulty', icon: 'cloud-outline'},
  {key: 'headache', name: 'Headache', icon: 'flash-outline'},
  {key: 'limping', name: 'Limping / pain', icon: 'walk-outline'},
];

const FEVER_LEVELS = [
  {key: 'normal', temp: '36.5°C', label: 'Normal', color: '#16A34A'},
  {key: 'low', temp: '37.5°C', label: 'Low-grade', color: '#D97316'},
  {key: 'fever', temp: '38.4°C', label: 'Fever', color: '#EA580C'},
  {key: 'high', temp: '39.2°C', label: 'High', color: '#DC2626'},
  {key: 'veryhigh', temp: '40.0°C', label: 'Very high', color: '#7F1D1D'},
];

const FEVER_THRESHOLDS = [
  {
    icon: 'alert-circle',
    iconColor: Colors.red,
    bg: Colors.redBg,
    border: '#FDA4A4',
    titleColor: Colors.redDark,
    bodyColor: Colors.redText,
    title: 'Any fever in infant <3 months = EMERGENCY. Call 108 or go to A&E now.',
    body: 'A rectal temperature ≥38.0°C in a baby under 3 months is a medical emergency - risk of serious bacterial infection is high. Do not wait at home.',
  },
  {
    icon: 'warning-outline',
    iconColor: '#D97316',
    bg: '#FAEEDA',
    border: '#FDDCB5',
    titleColor: Colors.textPrimary,
    bodyColor: Colors.textSecondary,
    title: '3-6 months: ≥38°C - Same-day paediatrician visit',
    body: "Do not give paracetamol and 'wait and see' in this age group. Book Dr. Preethi Rao or go to KIMS A&E within 2 hours.",
  },
  {
    icon: 'warning-outline',
    iconColor: '#D97316',
    bg: '#FAEEDA',
    border: '#FDDCB5',
    titleColor: Colors.textPrimary,
    bodyColor: Colors.textSecondary,
    title: '6 months - 5 years: ≥39°C >48h, or any age with febrile seizure',
    body: 'Febrile seizure in a 6-month-5-year-old: do not put anything in the mouth, turn on side, call 108 if >5 minutes.',
  },
  {
    icon: 'information-circle-outline',
    iconColor: Colors.tealText,
    bg: Colors.tealBg,
    border: '#BBE3D2',
    titleColor: Colors.textPrimary,
    bodyColor: Colors.textSecondary,
    title: "5-12 years (Aarav's age): ≥38.5°C - manage at home if well",
    body: 'Paracetamol 15mg/kg 4-6 hourly. Ibuprofen 5-10mg/kg if temperature >39°C. Seek review if fever >5 days, appears very unwell, rash develops.',
  },
];

const EMERGENCY_SIGNS = [
  {icon: 'medkit-outline', text: 'Difficulty breathing, gasping, noisy breathing, ribs visible with each breath'},
  {icon: 'water-outline', text: 'Blue lips, fingertips, or tongue (cyanosis)'},
  {icon: 'eye-off-outline', text: 'Difficult to wake, unusually drowsy, not recognising parents'},
  {icon: 'flash-outline', text: 'Seizure lasting more than 5 minutes, or second seizure within 24 hours'},
  {icon: 'color-palette-outline', text: 'Non-blanching rash - purple/red spots that don\'t fade when pressed with a glass'},
  {icon: 'alert-circle-outline', text: 'No urine in 8 hours, sunken eyes, dry mouth - severe dehydration'},
];

const INDIAN_ILLNESSES = [
  {
    icon: 'bug-outline',
    iconColor: Colors.red,
    title: 'Dengue - April-October peak in Hyderabad',
    body: 'Warning signs: severe abdominal pain, persistent vomiting, bleeding gums, blood in stool, rapid breathing. Platelet drop below 100,000 = hospitalise. No ibuprofen or aspirin in dengue - can worsen bleeding. Paracetamol only.',
  },
  {
    icon: 'thermometer-outline',
    iconColor: '#D97316',
    title: 'Typhoid - endemic in Hyderabad, all year',
    body: 'Stepladder fever pattern (rising each day), rose-spot rash, constipation then diarrhoea. Blood culture is diagnostic. Widal test is unreliable - do not treat based on Widal alone.',
  },
  {
    icon: 'eye-outline',
    iconColor: '#2A5FA0',
    title: 'Viral conjunctivitis - highly contagious, school outbreaks',
    body: "Do not use steroid eye drops without a doctor's prescription - can cause corneal ulceration. Saline wash and keeping hands clean is first-line. School exclusion for 48 hours.",
  },
  {
    icon: 'snow-outline',
    iconColor: '#2A5FA0',
    title: 'Croup (barking cough) - ages 6 months-5 years, winter',
    body: 'Seal-bark cough + stridor (harsh breathing noise) + hoarse voice. Cool night air + sit upright. Dexamethasone from paediatrician dramatically reduces severity. If stridor at rest - emergency.',
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

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const SymptomCheckerScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [selectedAge, setSelectedAge] = useState('5-12 years');
  const [activeSymptoms, setActiveSymptoms] = useState(['cough', 'fatigue']);
  const [selectedFever, setSelectedFever] = useState('fever');

  const toggleSymptom = (key) => {
    setActiveSymptoms((prev) =>
      prev.includes(key) ? prev.filter((k) => k !== key) : [...prev, key],
    );
  };

  // Dynamic triage computation based on number of selected symptoms
  const symptomCount = activeSymptoms.length;
  const triage =
    symptomCount >= 5
      ? {
          level: 'urgent',
          pillText: 'Urgent care',
          pillBg: Colors.red,
          title: 'Urgent - see doctor immediately',
          body: 'Multiple concurrent symptoms suggest a significant illness. Do not delay - seek paediatric review within the next few hours or go to A&E.',
          icon: 'alert-circle',
          iconColor: Colors.redDark,
          textColor: Colors.redDark,
          cardBg: Colors.redBg,
          cardBorder: '#FDA4A4',
          btnBorder: '#FDA4A4',
        }
      : symptomCount >= 3
      ? {
          level: 'amber',
          pillText: 'See doctor today',
          pillBg: '#D97316',
          title: 'See doctor today',
          body: 'The combination of symptoms warrants a same-day paediatrician review. Book an appointment or visit an urgent care clinic today.',
          icon: 'warning',
          iconColor: '#D97316',
          textColor: '#92400E',
          cardBg: '#FAEEDA',
          cardBorder: '#FDDCB5',
          btnBorder: '#FDDCB5',
        }
      : {
          level: 'home',
          pillText: 'Home management',
          pillBg: Colors.tealText,
          title: 'Home management likely appropriate',
          body: 'Cough + fatigue in a 5-12 year old without fever, breathing difficulty, or dehydration. Likely viral upper respiratory infection. Monitor for 48-72 hours.',
          icon: 'checkmark-circle',
          iconColor: Colors.tealText,
          textColor: Colors.tealText,
          cardBg: Colors.tealBg,
          cardBorder: '#BBE3D2',
          btnBorder: '#BBE3D2',
        };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Fixed Header ── */}
      <View style={[st.header, {paddingTop: insets.top + vs(10)}]}>
        <View style={st.topRow}>
          <TouchableOpacity
            style={st.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={{color: Colors.white, fontSize: ms(18), fontWeight: '700'}}>Symptom checker</AppText>
            <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', fontSize: ms(11)}}>Aarav - 9y 2m</AppText>
          </View>
        </View>

        <AppText
          variant="subtext"
          color="rgba(255,255,255,0.5)"
          style={{marginTop: vs(12), marginBottom: vs(6), fontSize: ms(9)}}>
          Child's age
        </AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{gap: s(6), paddingBottom: vs(4)}}>
          {AGES.map((age) => {
            const active = age === selectedAge;
            return (
              <TouchableOpacity
                key={age}
                activeOpacity={0.7}
                onPress={() => setSelectedAge(age)}
                style={[st.ageChip, active && st.ageChipActive]}>
                <AppText
                  variant="subtext"
                  color={active ? Colors.primary : Colors.white}
                  style={{fontWeight: '600', fontSize: ms(10)}}>
                  {age}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Symptom grid */}
        <Section title="Presenting symptoms \u00b7 select all that apply" />
        <View style={st.symGrid}>
          {SYMPTOMS.map((sym) => {
            const active = activeSymptoms.includes(sym.key);
            return (
              <TouchableOpacity
                key={sym.key}
                activeOpacity={0.7}
                onPress={() => toggleSymptom(sym.key)}
                style={[st.symTile, active && st.symTileActive]}>
                <Icon
                  family="Ionicons"
                  name={sym.icon}
                  size={ms(20)}
                  color={active ? Colors.red : Colors.textSecondary}
                />
                <AppText
                  variant="subtext"
                  color={active ? Colors.redDark : Colors.textSecondary}
                  style={{fontWeight: active ? '700' : '500', marginTop: vs(5), textAlign: 'center', fontSize: ms(10)}}>
                  {sym.name}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Fever gauge card */}
        <View style={st.feverCard}>
          <AppText
            variant="subtext"
            color="rgba(255,255,255,0.55)"
            style={{textTransform: 'uppercase', letterSpacing: 0.6, fontSize: ms(9), textAlign: 'center'}}>
            Fever assessment {'\u00b7'} 5-12 year old
          </AppText>
          <AppText
            color={Colors.white}
            style={{fontSize: ms(44), fontWeight: '800', textAlign: 'center', marginTop: vs(10), lineHeight: ms(50)}}>
            {FEVER_LEVELS.find((f) => f.key === selectedFever)?.temp || '38.4°C'}
          </AppText>
          <AppText
            variant="subtext"
            color="rgba(255,255,255,0.45)"
            style={{textAlign: 'center', fontSize: ms(9), marginTop: vs(4)}}>
            Tap to change temperature
          </AppText>

          <View style={st.feverRow}>
            {FEVER_LEVELS.map((lvl) => {
              const active = lvl.key === selectedFever;
              return (
                <TouchableOpacity
                  key={lvl.key}
                  activeOpacity={0.7}
                  onPress={() => setSelectedFever(lvl.key)}
                  style={[
                    st.feverBtn,
                    {backgroundColor: active ? lvl.color : 'rgba(255,255,255,0.08)'},
                    active && {borderWidth: 1, borderColor: Colors.white},
                  ]}>
                  <AppText
                    color={Colors.white}
                    style={{fontSize: ms(9), fontWeight: '800'}}>
                    {lvl.temp}
                  </AppText>
                  <AppText
                    color="rgba(255,255,255,0.8)"
                    style={{fontSize: ms(7), marginTop: vs(1)}}>
                    {lvl.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Fever thresholds + Emergency + Indian illnesses — moved to Ayu Intel */}
        {false && (<>
        <Section title="Fever thresholds - age-stratified" />
        <View style={st.card}>
          {FEVER_THRESHOLDS.map((f, i) => (
            <View
              key={i}
              style={[
                st.flagRow,
                {backgroundColor: f.bg, borderColor: f.border},
                i < FEVER_THRESHOLDS.length - 1 && {marginBottom: vs(8)},
              ]}>
              <Icon family="Ionicons" name={f.icon} size={ms(18)} color={f.iconColor} />
              <View style={{flex: 1}}>
                <AppText variant="caption" color={f.titleColor} style={{fontWeight: '700', lineHeight: ms(16)}}>
                  {f.title}
                </AppText>
                <AppText variant="subtext" color={f.bodyColor} style={{marginTop: vs(3), lineHeight: ms(14)}}>
                  {f.body}
                </AppText>
              </View>
            </View>
          ))}
        </View>

        {/* Emergency */}
        <Section title="Seek emergency care immediately if any of these" />
        <View style={st.emergencyBox}>
          <View style={st.emergencyHeader}>
            <Icon family="Ionicons" name="alert-circle" size={ms(16)} color={Colors.white} />
            <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(12)}}>
              Call 108 - Do not wait - Any age
            </AppText>
          </View>
          {EMERGENCY_SIGNS.map((sign, i) => (
            <View key={i} style={st.emergencyRow}>
              <Icon family="Ionicons" name={sign.icon} size={ms(14)} color={Colors.redDark} />
              <AppText variant="subtext" color={Colors.redDark} style={{flex: 1, lineHeight: ms(15)}}>
                {sign.text}
              </AppText>
            </View>
          ))}
        </View>

        {/* Indian illnesses */}
        <Section title="Common Indian paediatric illnesses \u00b7 season-aware" />
        <View style={st.card}>
          {INDIAN_ILLNESSES.map((il, i) => (
            <View
              key={i}
              style={[
                st.illnessRow,
                i < INDIAN_ILLNESSES.length - 1 && {
                  borderBottomWidth: StyleSheet.hairlineWidth,
                  borderBottomColor: '#E5DDD3',
                  paddingBottom: vs(10),
                  marginBottom: vs(10),
                },
              ]}>
              <View style={[st.illnessIconWrap, {backgroundColor: il.iconColor + '18'}]}>
                <Icon family="Ionicons" name={il.icon} size={ms(16)} color={il.iconColor} />
              </View>
              <View style={{flex: 1}}>
                <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700', lineHeight: ms(16)}}>
                  {il.title}
                </AppText>
                <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(3), lineHeight: ms(14)}}>
                  {il.body}
                </AppText>
              </View>
            </View>
          ))}
        </View>

        </>)}

        <View style={{height: vs(20)}} />
      </ScrollView>

      {/* ── Bottom Save Bar ── */}
      <View style={[st.bottomBar, {paddingBottom: Math.max(insets.bottom, vs(10))}]}>
        <TouchableOpacity style={st.saveBtn} activeOpacity={0.85}>
          <Icon family="Ionicons" name="save-outline" size={ms(16)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white}>Save symptom log</AppText>
        </TouchableOpacity>
      </View>
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
  backBtn: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  alertPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    backgroundColor: Colors.red,
    paddingHorizontal: s(9),
    paddingVertical: vs(5),
    borderRadius: ms(12),
  },
  ageChip: {
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.25)',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  ageChipActive: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(4)},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7), fontSize: ms(9)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Symptom grid
  symGrid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: vs(8)},
  symTile: {
    width: '31%',
    aspectRatio: 1.15,
    backgroundColor: Colors.white,
    borderRadius: ms(13),
    borderWidth: 1,
    borderColor: '#E5DDD3',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(6),
  },
  symTileActive: {
    backgroundColor: '#FEF0F0',
    borderColor: '#FDA4A4',
  },

  // Triage card
  triageCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: '#BBE3D2',
    padding: ms(14),
    marginTop: vs(12),
    alignItems: 'flex-start',
  },
  triageIconWrap: {},
  triageBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    marginTop: vs(10),
    backgroundColor: Colors.white,
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: '#BBE3D2',
  },

  // Fever gauge
  feverCard: {
    backgroundColor: Colors.primary,
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: ms(16),
    marginTop: vs(12),
  },
  feverRow: {
    flexDirection: 'row',
    gap: s(5),
    marginTop: vs(14),
  },
  feverBtn: {
    flex: 1,
    borderRadius: ms(9),
    paddingVertical: vs(8),
    paddingHorizontal: s(2),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Card (shared)
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    padding: ms(11),
  },

  // Flag rows
  flagRow: {
    flexDirection: 'row',
    gap: s(10),
    padding: ms(11),
    borderRadius: ms(11),
    borderWidth: 1,
    alignItems: 'flex-start',
  },

  // Emergency
  emergencyBox: {
    backgroundColor: Colors.redBg,
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: '#FDA4A4',
    padding: ms(12),
  },
  emergencyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    backgroundColor: Colors.red,
    marginHorizontal: -ms(12),
    marginTop: -ms(12),
    paddingHorizontal: s(12),
    paddingVertical: vs(9),
    borderTopLeftRadius: ms(13),
    borderTopRightRadius: ms(13),
    marginBottom: vs(10),
  },
  emergencyRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(9),
    paddingVertical: vs(5),
  },

  // Indian illness
  illnessRow: {flexDirection: 'row', gap: s(10), alignItems: 'flex-start'},
  illnessIconWrap: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bottom save bar
  bottomBar: {
    backgroundColor: Colors.white,
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5DDD3',
    paddingHorizontal: s(13),
    paddingTop: vs(10),
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(13),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(8),
  },
});

export default SymptomCheckerScreen;
