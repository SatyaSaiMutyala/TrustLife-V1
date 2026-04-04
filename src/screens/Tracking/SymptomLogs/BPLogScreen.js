import React, {useState, useCallback} from 'react';
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
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import BPDeviceSync from './BPAutoView';
import BPManualEntry from './BPManualView';

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const ACTIVITY_CHIPS = [
  'Took BP medication', 'Took other medication', 'Short walk',
  'Workout / exercise', 'Caffeine', 'Alcohol', 'Smoking',
  'Just ate', 'Just woke up', 'Feeling stressed',
  'White coat anxiety', 'Just rested 5 min', 'Nothing in particular',
];

const SYMPTOM_CHIPS = [
  'None', 'Headache', 'Dizziness', 'Blurred vision',
  'Palpitations', 'Shortness of breath', 'Flushing / warmth',
  'Chest tightness', 'Ankle swelling', 'Ringing in ears',
  'Fatigue', 'Nosebleed',
];

const TARGET_DATA = [
  {label: 'Systolic', value: '<130', unit: 'mmHg'},
  {label: 'Diastolic', value: '<80', unit: 'mmHg'},
  {label: 'Target', value: '130/80', unit: 'T2DM guideline'},
  {label: 'Medication', value: 'Olmesartan', unit: '+ Amlodipine'},
];

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const BPLogScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  // BP values
  const [sysVal, setSysVal] = useState('');
  const [diaVal, setDiaVal] = useState('');
  const [pulseVal, setPulseVal] = useState('');

  // Activity chips
  const [selectedActivities, setSelectedActivities] = useState([]);

  // Mood / stress / energy
  const [mood, setMood] = useState(7);
  const [stress, setStress] = useState('Very low');
  const [energy, setEnergy] = useState('Moderate');

  // Symptoms
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  // Notes
  const [notes, setNotes] = useState('');

  // Date & Time
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatDate = (d) => {
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${isToday ? 'Today, ' : ''}${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const formatTime = (d) => {
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(prev => {
      const d = new Date(prev);
      d.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      return d;
    });
  };

  const onTimeChange = (event, date) => {
    setShowTimePicker(false);
    if (date) setSelectedDate(prev => {
      const d = new Date(prev);
      d.setHours(date.getHours(), date.getMinutes());
      return d;
    });
  };

  // BP indicator
  const getBPIndicator = useCallback(() => {
    const sys = parseInt(sysVal);
    const dia = parseInt(diaVal);
    if (isNaN(sys) && isNaN(dia)) return null;
    const s2 = isNaN(sys) ? 0 : sys;
    const d2 = isNaN(dia) ? 0 : dia;
    if (s2 === 0 && d2 === 0) return null;
    if (s2 < 90 || d2 < 60) return {bg: '#EFF6FF', color: '#185FA5', text: 'Low - check if symptomatic'};
    if (s2 < 120 && d2 < 80) return {bg: Colors.tealBg, color: Colors.tealText, text: 'Normal - below 120/80'};
    if (s2 < 130 && d2 < 80) return {bg: Colors.tealBg, color: Colors.tealText, text: 'At your target - below 130/80'};
    if (s2 < 140 || d2 < 90) return {bg: Colors.amberBg, color: Colors.amberDark, text: 'Stage 1 - slightly above target'};
    if (s2 < 180 || d2 < 120) return {bg: Colors.redBg, color: Colors.redDark, text: 'Stage 2 - take reading again in 5 min'};
    return {bg: Colors.redBg, color: Colors.redDark, text: 'Hypertensive crisis - seek care now'};
  }, [sysVal, diaVal]);

  const toggleActivity = (chip) => {
    const isNeutral = chip === 'Nothing in particular';
    if (isNeutral) {
      setSelectedActivities([chip]);
    } else {
      setSelectedActivities(prev => {
        const without = prev.filter(c => c !== 'Nothing in particular');
        const next = without.includes(chip) ? without.filter(c => c !== chip) : [...without, chip];
        return next.length === 0 ? [] : next;
      });
    }
  };

  const toggleSymptom = (chip) => {
    const isNone = chip === 'None';
    if (isNone) {
      setSelectedSymptoms([chip]);
    } else {
      setSelectedSymptoms(prev => {
        const without = prev.filter(c => c !== 'None');
        const next = without.includes(chip) ? without.filter(c => c !== chip) : [...without, chip];
        return next.length === 0 ? [] : next;
      });
    }
  };

  const bpIndicator = getBPIndicator();

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={st.headerTitle}>Blood Pressure</AppText>
            <AppText variant="caption" style={st.headerSub}>Manual entry - Omron device sync</AppText>
          </View>
        </View>
      </View>

      <ScrollView style={st.scroll} contentContainerStyle={st.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {/* Device sync */}
        <BPDeviceSync />

        {/* Ayu Intel */}
        <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'bp', initialTab: 'bpIntel'})}>
          <View style={st.ayuIconWrap}><Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.white} /></View>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Blood Pressure</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginTop: vs(1)}}>Patterns - Activity impact - Recommendations</AppText>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        {/* Divider */}
        <View style={st.dividerRow}>
          <View style={st.dividerLine} />
          <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '600'}}>or enter manually</AppText>
          <View style={st.dividerLine} />
        </View>

        {/* Manual entry */}
        <BPManualEntry
          sysVal={sysVal}
          setSysVal={setSysVal}
          diaVal={diaVal}
          setDiaVal={setDiaVal}
          pulseVal={pulseVal}
          setPulseVal={setPulseVal}
          bpIndicator={bpIndicator}
        />

        {/* Date / Time */}
        <View style={st.inputCard}>
          <View style={st.dateTimeRow}>
            <TouchableOpacity style={{flex: 1}} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
              <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginBottom: vs(5)}}>Date</AppText>
              <AppText variant="bodyBold" color={Colors.textPrimary}>{formatDate(selectedDate)}</AppText>
            </TouchableOpacity>
            <View style={st.dateTimeDivider} />
            <TouchableOpacity style={{flex: 1}} onPress={() => setShowTimePicker(true)} activeOpacity={0.7}>
              <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginBottom: vs(5)}}>Time</AppText>
              <AppText variant="bodyBold" color={Colors.textPrimary}>{formatTime(selectedDate)}</AppText>
            </TouchableOpacity>
          </View>
          {showDatePicker && <DateTimePicker value={selectedDate} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} maximumDate={new Date()} onChange={onDateChange} />}
          {showTimePicker && <DateTimePicker value={selectedDate} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} maximumDate={new Date()} onChange={onTimeChange} />}
        </View>

        {/* Notes */}
        <View style={st.inputCard}>
          <AppText variant="subtext" color={Colors.textSecondary} style={st.icLabel}>Notes (optional)</AppText>
          <TextInput
            style={st.notesInput}
            placeholder="e.g. Felt anxious before reading, took it twice..."
            placeholderTextColor={Colors.textTertiary}
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* Before this reading */}
        <View style={st.inputCard}>
          <AppText variant="subtext" color={Colors.textSecondary} style={st.icLabel}>Before this reading</AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(10), lineHeight: ms(17)}}>
            What did you do{' '}
            <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>just before</AppText>
            {' '}taking this reading? Tap all that apply.
          </AppText>
          <View style={st.chipWrap}>
            {ACTIVITY_CHIPS.map(chip => {
              const isOn = selectedActivities.includes(chip);
              return (
                <TouchableOpacity key={chip} style={[st.symChip, isOn && st.symChipOn]} onPress={() => toggleActivity(chip)} activeOpacity={0.7}>
                  <AppText variant="small" color={isOn ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{chip}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Symptoms & Mood */}
        <View style={st.inputCard}>
          <AppText variant="subtext" color={Colors.textSecondary} style={st.icLabel}>Symptoms & mood</AppText>

          {/* Mood slider */}
          <View style={{marginBottom: vs(12)}}>
            <View style={st.moodHeader}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>How are you feeling?</AppText>
              <AppText variant="header" color={Colors.primary} style={{fontWeight: '800'}}>{mood}</AppText>
            </View>
            <View style={st.sliderTrack}>
              <View style={[st.sliderFill, {width: `${(mood / 10) * 100}%`}]} />
              <View style={[st.sliderThumb, {left: `${(mood / 10) * 100}%`}]} />
            </View>
            <View style={st.sliderLabels}>
              <AppText variant="subtext" color={Colors.textTertiary}>Very low</AppText>
              <AppText variant="subtext" color={Colors.textTertiary}>Neutral</AppText>
              <AppText variant="subtext" color={Colors.textTertiary}>Great</AppText>
            </View>
            <View style={st.moodBtnRow}>
              <TouchableOpacity style={st.moodBtn} onPress={() => setMood(prev => Math.max(1, prev - 1))}>
                <AppText variant="bodyBold" color={Colors.primary}>-</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={st.moodBtn} onPress={() => setMood(prev => Math.min(10, prev + 1))}>
                <AppText variant="bodyBold" color={Colors.primary}>+</AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Stress & Energy */}
          <View style={{flexDirection: 'row', gap: s(10), marginBottom: vs(12)}}>
            <View style={{flex: 1}}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', marginBottom: vs(7)}}>Stress level</AppText>
              {['Very low', 'Low', 'Moderate', 'High'].map(opt => {
                const isOn = stress === opt;
                return (
                  <TouchableOpacity key={opt} style={[st.optionBtn, isOn && st.optionBtnOn]} onPress={() => setStress(opt)} activeOpacity={0.7}>
                    <AppText variant="caption" color={isOn ? Colors.white : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>{opt}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={{flex: 1}}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', marginBottom: vs(7)}}>Energy</AppText>
              {['Very low', 'Low', 'Moderate', 'Good'].map(opt => {
                const isOn = energy === opt;
                return (
                  <TouchableOpacity key={opt} style={[st.optionBtn, isOn && st.optionBtnOn]} onPress={() => setEnergy(opt)} activeOpacity={0.7}>
                    <AppText variant="caption" color={isOn ? Colors.white : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>{opt}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Symptoms */}
          <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', marginBottom: vs(7)}}>
            Symptoms right now{' '}
            <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '400'}}>(tap all that apply)</AppText>
          </AppText>
          <View style={st.chipWrap}>
            {SYMPTOM_CHIPS.map(chip => {
              const isOn = selectedSymptoms.includes(chip);
              const isNone = chip === 'None';
              return (
                <TouchableOpacity
                  key={chip}
                  style={[st.symChip, isOn && st.symChipOn, isNone && isOn && {backgroundColor: Colors.tealBg, borderColor: '#a5d6c0'}]}
                  onPress={() => toggleSymptom(chip)}
                  activeOpacity={0.7}>
                  <AppText variant="small" color={isOn ? (isNone ? Colors.tealText : Colors.white) : Colors.textSecondary} style={{fontWeight: '600'}}>{chip}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Target reference */}
        <View style={[st.inputCard, {padding: 0, overflow: 'hidden'}]}>
          <View style={{paddingHorizontal: s(13), paddingTop: vs(10), paddingBottom: vs(6)}}>
            <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6}}>
              Your targets - Dr. Meera Krishnamurthy
            </AppText>
          </View>
          <View style={st.targetRow}>
            {TARGET_DATA.map((t, i) => (
              <View key={i} style={st.targetItem}>
                <AppText variant="subtext" color={Colors.textTertiary} style={{marginBottom: vs(2)}}>{t.label}</AppText>
                <AppText variant="caption" color={Colors.primary} style={{fontWeight: '700'}}>{t.value}</AppText>
                <AppText variant="subtext" color={Colors.textTertiary} style={{fontSize: Fonts.sizes.xs}}>{t.unit}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Save button */}
        <TouchableOpacity style={st.logBtn} activeOpacity={0.8}>
          <AppText variant="body" color={Colors.white} style={{fontWeight: '700', fontSize: ms(15)}}>Save reading</AppText>
        </TouchableOpacity>

        {/* Past readings */}
        <View style={st.secLabel}>
          <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>Past readings</AppText>
          <View style={st.secLabelLine} />
        </View>

        <TouchableOpacity style={st.linkCard} activeOpacity={0.8} onPress={() => navigation.navigate('Records', {tab: 'healthlogs', logFilter: 'bp'})}>
          <View style={st.lcIconWrap}>
            <Icon family="Ionicons" name="heart" size={ms(20)} color={Colors.red} />
          </View>
          <View style={{flex: 1, minWidth: 0}}>
            <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5, marginBottom: vs(2)}}>Blood pressure records</AppText>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginBottom: vs(3)}}>31 readings - March 2026</AppText>
            <View style={{flexDirection: 'row', gap: s(5), flexWrap: 'wrap'}}>
              <View style={[st.lcChip, {backgroundColor: Colors.amberBg}]}>
                <AppText variant="small" color={Colors.amberDark} style={{fontWeight: '600'}}>Avg 136/86 mmHg</AppText>
              </View>
              <View style={[st.lcChip, {backgroundColor: Colors.blueBg}]}>
                <AppText variant="small" color={Colors.blueText} style={{fontWeight: '600'}}>74 bpm avg</AppText>
              </View>
            </View>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color={Colors.primary} />
        </TouchableOpacity>

        <View style={{height: vs(30)}} />
      </ScrollView>
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingTop: vs(10), paddingBottom: vs(10), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(2)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(11)},
  scroll: {flex: 1},
  body: {paddingHorizontal: s(13), paddingTop: vs(12), paddingBottom: vs(30)},
  dividerRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(12)},
  dividerLine: {flex: 1, height: 0.5, backgroundColor: '#dde8e2'},
  inputCard: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(16), marginBottom: vs(12)},
  icLabel: {textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginBottom: vs(10)},
  dateTimeRow: {flexDirection: 'row', alignItems: 'center', gap: s(10)},
  dateTimeDivider: {width: 0.5, height: vs(36), backgroundColor: '#edf2ef'},
  notesInput: {width: '100%', borderWidth: 0.5, borderColor: '#dde8e2', borderRadius: ms(10), padding: ms(10), backgroundColor: Colors.background, minHeight: vs(60), fontSize: ms(12), color: Colors.textPrimary, textAlignVertical: 'top'},
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(7)},
  symChip: {paddingHorizontal: s(10), paddingVertical: vs(5), borderRadius: ms(8), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.background},
  symChipOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  moodHeader: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(8)},
  sliderTrack: {height: ms(6), backgroundColor: '#e5e7eb', borderRadius: ms(3), overflow: 'visible', position: 'relative'},
  sliderFill: {height: '100%', backgroundColor: Colors.primary, borderRadius: ms(3)},
  sliderThumb: {position: 'absolute', top: -ms(5), width: ms(16), height: ms(16), borderRadius: ms(8), backgroundColor: Colors.white, borderWidth: 2, borderColor: Colors.primary, marginLeft: -ms(8)},
  sliderLabels: {flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(3)},
  moodBtnRow: {flexDirection: 'row', justifyContent: 'center', gap: s(12), marginTop: vs(8)},
  moodBtn: {width: ms(36), height: ms(36), borderRadius: ms(18), backgroundColor: Colors.background, borderWidth: 0.5, borderColor: '#dde8e2', alignItems: 'center', justifyContent: 'center'},
  optionBtn: {paddingVertical: vs(6), paddingHorizontal: s(10), borderRadius: ms(10), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.background, marginBottom: vs(5)},
  optionBtnOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  targetRow: {flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: '#f0f4f2', paddingVertical: vs(7), paddingHorizontal: s(13)},
  targetItem: {flex: 1, alignItems: 'center'},
  logBtn: {width: '100%', paddingVertical: vs(15), borderRadius: ms(14), backgroundColor: Colors.primary, alignItems: 'center', marginTop: vs(4), marginBottom: vs(12)},
  secLabel: {flexDirection: 'row', alignItems: 'center', marginTop: vs(4), marginBottom: vs(10)},
  secLabelLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'},
  linkCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(13), flexDirection: 'row', alignItems: 'center', gap: s(12), marginBottom: vs(10)},
  lcIconWrap: {width: ms(44), height: ms(44), borderRadius: ms(12), backgroundColor: '#FBEAF0', alignItems: 'center', justifyContent: 'center'},
  lcChip: {paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(7)},
  ayuBtn: {flexDirection: 'row', alignItems: 'center', gap: s(8), backgroundColor: Colors.accent, borderRadius: ms(12), padding: ms(12), marginBottom: vs(12)},
  ayuIconWrap: {width: ms(36), height: ms(36), borderRadius: ms(10), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
});

export default BPLogScreen;
