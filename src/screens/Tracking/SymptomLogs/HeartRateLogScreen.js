import React, {useState, useCallback} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, TextInput, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import HRDeviceSync from './HRAutoView';
import HRManualEntry from './HRManualView';

const ACTIVITY_CHIPS = [
  'Just woke up', 'Rested 5+ min', 'Light walk', 'Exercise / workout',
  'Climbed stairs', 'Caffeine', 'Alcohol', 'Took medication',
  'Feeling anxious', 'Stressful moment', 'Feeling unwell', 'Smoking',
  'Nothing in particular',
];

const SYMPTOM_CHIPS = [
  'None', 'Palpitations', 'Chest tightness', 'Short of breath',
  'Dizziness', 'Fatigue', 'Headache', 'Anxiety',
  "Can't catch breath", 'Flushing / warmth', 'Nausea', 'Skipped beats',
];

const TARGET_DATA = [
  {label: 'Resting HR', value: '60-100', unit: 'bpm'},
  {label: 'HRV target', value: '>40', unit: 'ms'},
  {label: 'Sleep HR', value: '50-70', unit: 'bpm'},
  {label: 'Recovery', value: '<2 min', unit: 'to normal'},
];

const HeartRateLogScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [hrVal, setHrVal] = useState('');
  const [hrvVal, setHrvVal] = useState('');
  const [spo2Val, setSpo2Val] = useState('');
  const [selectedActivities, setSelectedActivities] = useState([]);
  const [mood, setMood] = useState(7);
  const [energy, setEnergy] = useState('Moderate');
  const [stress, setStress] = useState('Very low');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
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
    let h = d.getHours(); const m = d.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };
  const onDateChange = (event, date) => { setShowDatePicker(false); if (date) setSelectedDate(prev => { const d = new Date(prev); d.setFullYear(date.getFullYear(), date.getMonth(), date.getDate()); return d; }); };
  const onTimeChange = (event, date) => { setShowTimePicker(false); if (date) setSelectedDate(prev => { const d = new Date(prev); d.setHours(date.getHours(), date.getMinutes()); return d; }); };

  const getHRIndicator = useCallback(() => {
    const v = parseInt(hrVal);
    if (isNaN(v)) return null;
    if (v < 40) return {bg: '#EFF6FF', color: '#185FA5', text: 'Very low - seek medical advice if symptomatic'};
    if (v < 60) return {bg: Colors.tealBg, color: Colors.tealText, text: 'Athletic range - excellent cardiac fitness'};
    if (v <= 75) return {bg: Colors.tealBg, color: Colors.tealText, text: 'Normal resting HR'};
    if (v <= 90) return {bg: Colors.amberBg, color: Colors.amberDark, text: 'Slightly elevated - check stress / caffeine / sleep'};
    if (v <= 100) return {bg: Colors.amberBg, color: Colors.amberDark, text: 'Upper-normal range - monitor closely'};
    return {bg: Colors.redBg, color: Colors.redDark, text: 'Elevated resting HR - log context and retake if settled'};
  }, [hrVal]);

  const toggleActivity = (chip) => {
    if (chip === 'Nothing in particular') { setSelectedActivities([chip]); return; }
    setSelectedActivities(prev => {
      const without = prev.filter(c => c !== 'Nothing in particular');
      const next = without.includes(chip) ? without.filter(c => c !== chip) : [...without, chip];
      return next.length === 0 ? [] : next;
    });
  };
  const toggleSymptom = (chip) => {
    if (chip === 'None') { setSelectedSymptoms([chip]); return; }
    setSelectedSymptoms(prev => {
      const without = prev.filter(c => c !== 'None');
      const next = without.includes(chip) ? without.filter(c => c !== chip) : [...without, chip];
      return next.length === 0 ? [] : next;
    });
  };

  const hrIndicator = getHRIndicator();

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={st.headerTitle}>Heart Rate</AppText>
            <AppText variant="caption" style={st.headerSub}>Apple Watch - Finger oximeter - Manual entry</AppText>
          </View>
        </View>
      </View>

      <ScrollView style={st.scroll} contentContainerStyle={st.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        <HRDeviceSync />

        {/* Ayu Intel */}
        <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'heartRate', initialTab: 'hrIntel'})}>
          <View style={st.ayuIconWrap}><Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.white} /></View>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Heart Rate</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginTop: vs(1)}}>HRV analysis - Sleep quality - Recovery patterns</AppText>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        <View style={st.dividerRow}>
          <View style={st.dividerLine} />
          <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '600'}}>or enter manually</AppText>
          <View style={st.dividerLine} />
        </View>

        <HRManualEntry hrVal={hrVal} setHrVal={setHrVal} hrvVal={hrvVal} setHrvVal={setHrvVal} spo2Val={spo2Val} setSpo2Val={setSpo2Val} hrIndicator={hrIndicator} />

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
          <TextInput style={st.notesInput} placeholder="e.g. Felt heart racing after climbing stairs..." placeholderTextColor={Colors.textTertiary} multiline value={notes} onChangeText={setNotes} />
        </View>

        {/* Activity chips */}
        <View style={st.inputCard}>
          <AppText variant="subtext" color={Colors.textSecondary} style={st.icLabel}>Before this reading</AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(10), lineHeight: ms(17)}}>
            What did you do <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>just before</AppText>? Tap all that apply.
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
              <TouchableOpacity style={st.moodBtn} onPress={() => setMood(prev => Math.max(1, prev - 1))}><AppText variant="bodyBold" color={Colors.primary}>-</AppText></TouchableOpacity>
              <TouchableOpacity style={st.moodBtn} onPress={() => setMood(prev => Math.min(10, prev + 1))}><AppText variant="bodyBold" color={Colors.primary}>+</AppText></TouchableOpacity>
            </View>
          </View>

          <View style={{flexDirection: 'row', gap: s(10), marginBottom: vs(12)}}>
            <View style={{flex: 1}}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', marginBottom: vs(7)}}>Energy</AppText>
              {['Very low', 'Low', 'Moderate', 'Good'].map(opt => {
                const isOn = energy === opt;
                return (<TouchableOpacity key={opt} style={[st.optionBtn, isOn && st.optionBtnOn]} onPress={() => setEnergy(opt)} activeOpacity={0.7}><AppText variant="caption" color={isOn ? Colors.white : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>{opt}</AppText></TouchableOpacity>);
              })}
            </View>
            <View style={{flex: 1}}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', marginBottom: vs(7)}}>Stress</AppText>
              {['Very low', 'Low', 'Moderate', 'High'].map(opt => {
                const isOn = stress === opt;
                return (<TouchableOpacity key={opt} style={[st.optionBtn, isOn && st.optionBtnOn]} onPress={() => setStress(opt)} activeOpacity={0.7}><AppText variant="caption" color={isOn ? Colors.white : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>{opt}</AppText></TouchableOpacity>);
              })}
            </View>
          </View>

          <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', marginBottom: vs(7)}}>
            Symptoms right now <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '400'}}>(tap all that apply)</AppText>
          </AppText>
          <View style={st.chipWrap}>
            {SYMPTOM_CHIPS.map(chip => {
              const isOn = selectedSymptoms.includes(chip);
              const isNone = chip === 'None';
              return (
                <TouchableOpacity key={chip} style={[st.symChip, isOn && st.symChipOn, isNone && isOn && {backgroundColor: Colors.tealBg, borderColor: '#a5d6c0'}]} onPress={() => toggleSymptom(chip)} activeOpacity={0.7}>
                  <AppText variant="small" color={isOn ? (isNone ? Colors.tealText : Colors.white) : Colors.textSecondary} style={{fontWeight: '600'}}>{chip}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Targets */}
        <View style={[st.inputCard, {padding: 0, overflow: 'hidden'}]}>
          <View style={{paddingHorizontal: s(13), paddingTop: vs(10), paddingBottom: vs(6)}}>
            <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6}}>Your targets - Apple Watch + Dr. Meera</AppText>
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

        <TouchableOpacity style={st.logBtn} activeOpacity={0.8}>
          <AppText variant="body" color={Colors.white} style={{fontWeight: '700', fontSize: ms(15)}}>Save reading</AppText>
        </TouchableOpacity>

        <View style={st.secLabel}>
          <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>Past readings</AppText>
          <View style={st.secLabelLine} />
        </View>

        <TouchableOpacity style={st.linkCard} activeOpacity={0.8} onPress={() => navigation.navigate('Records', {tab: 'healthlogs', logFilter: 'heartrate'})}>
          <View style={st.lcIconWrap}>
            <Icon family="Ionicons" name="pulse" size={ms(20)} color={Colors.red} />
          </View>
          <View style={{flex: 1, minWidth: 0}}>
            <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5, marginBottom: vs(2)}}>Heart rate records</AppText>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginBottom: vs(3)}}>62 readings - March 2026</AppText>
            <View style={{flexDirection: 'row', gap: s(5), flexWrap: 'wrap'}}>
              <View style={[st.lcChip, {backgroundColor: Colors.tealBg}]}><AppText variant="small" color={Colors.tealText} style={{fontWeight: '600'}}>Avg resting 74 bpm</AppText></View>
              <View style={[st.lcChip, {backgroundColor: Colors.redBg}]}><AppText variant="small" color={Colors.redDark} style={{fontWeight: '600'}}>HRV 28 ms - Low</AppText></View>
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

export default HeartRateLogScreen;
