import React, {useState, useMemo} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, TextInput, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import WeightDeviceSync from './WeightAutoView';
import WeightManualEntry from './WeightManualView';

// ── Data ──
const MODE_TABS = [{id: 'manual', label: 'Manual'}, {id: 'auto', label: 'Smart scale / Auto'}];
const WHO_TABS = [{id: 'priya', label: 'Priya'}, {id: 'raj', label: 'Raj'}, {id: 'aarav', label: 'Aarav'}, {id: 'add', label: '+ Add profile'}];
const SOURCE_CHIPS = [
  {id: 'manual', label: 'Manual', color: Colors.primary},
  {id: 'scale', label: 'Smart scale', color: Colors.accent},
  {id: 'apple', label: 'Apple Health', color: Colors.red},
  {id: 'google', label: 'Google Fit', color: Colors.blue},
  {id: 'photo', label: 'Photo', color: Colors.amber},
];
const TIME_CHIPS = ['Morning', 'Evening', 'Random time'];
const CLOTHING_CHIPS = ['Light clothing', 'Full clothes', 'No clothes', 'With shoes'];
const MEAL_CHIPS = ['Before breakfast (fasted)', 'After eating', 'After exercise'];
const CONTEXT_CHIPS = ['Unwell / fever', 'Menstrual period', 'Feeling bloated', 'Heavy meal yesterday', 'High sodium yesterday', 'Intense exercise yesterday', 'Travel / jet lag', 'Started new medication', 'Usual / baseline'];

const WHO_DATA = {
  priya: {weight: '68.4', height: '163', waist: '84'},
  raj: {weight: '78.2', height: '172', waist: '92'},
  aarav: {weight: '27.4', height: '128.5', waist: ''},
};

// ── Unit conversion helpers ──
const kgToLb = (kg) => (parseFloat(kg) * 2.20462).toFixed(1);
const cmToFtIn = (cm) => {
  const totalIn = parseFloat(cm) / 2.54;
  const ft = Math.floor(totalIn / 12);
  const inches = Math.round(totalIn % 12);
  return `${ft}'${inches}"`;
};
const cmToIn = (cm) => (parseFloat(cm) / 2.54).toFixed(1);

// ── Main Screen ──
const WeightLogScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  // State
  const [unit, setUnit] = useState('metric');
  const [mode, setMode] = useState('manual');
  const [who, setWho] = useState('priya');
  const [source, setSource] = useState('manual');
  const [weightVal, setWeightVal] = useState('68.4');
  const [heightVal, setHeightVal] = useState('163');
  const [waistVal, setWaistVal] = useState('84');
  const [notes, setNotes] = useState('');
  const [selectedTime, setSelectedTime] = useState('Morning');
  const [selectedClothing, setSelectedClothing] = useState('Light clothing');
  const [selectedMeal, setSelectedMeal] = useState('After eating');
  const [selectedContext, setSelectedContext] = useState(['Usual / baseline']);
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  // BMI calc
  const bmi = useMemo(() => {
    const w = parseFloat(weightVal); const h = parseFloat(heightVal);
    if (isNaN(w) || isNaN(h) || h === 0) return null;
    return Math.round((w / ((h / 100) ** 2)) * 10) / 10;
  }, [weightVal, heightVal]);

  const bmiCat = useMemo(() => {
    if (!bmi) return {label: '', color: Colors.textTertiary, bg: Colors.background, icon: 'help-outline'};
    if (bmi < 18.5) return {label: 'Underweight', color: Colors.blueText, bg: Colors.blueBg, icon: 'information-circle-outline'};
    if (bmi < 23) return {label: 'Normal - Indian standard', color: Colors.tealText, bg: Colors.tealBg, icon: 'checkmark-circle-outline'};
    if (bmi < 27.5) return {label: 'Overweight - Indian standard', color: Colors.amberDark, bg: Colors.amberBg, icon: 'warning-outline'};
    return {label: 'Obese - Indian standard', color: Colors.redDark, bg: Colors.redBg, icon: 'warning-outline'};
  }, [bmi]);

  const idealWeight = useMemo(() => {
    const h = parseFloat(heightVal);
    if (isNaN(h)) return null;
    return Math.round(23.0 * (h / 100) ** 2 * 10) / 10;
  }, [heightVal]);

  const formatDate = (d) => { const now = new Date(); const isToday = d.toDateString() === now.toDateString(); const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return `${isToday ? 'Today, ' : ''}${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`; };
  const formatTime = (d) => { let h = d.getHours(); const m = d.getMinutes().toString().padStart(2, '0'); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${m} ${ap}`; };
  const onDateChange = (event, date) => { setShowDatePicker(false); if (date) setSelectedDate(prev => { const d = new Date(prev); d.setFullYear(date.getFullYear(), date.getMonth(), date.getDate()); return d; }); };
  const onTimeChange = (event, date) => { setShowTimePicker(false); if (date) setSelectedDate(prev => { const d = new Date(prev); d.setHours(date.getHours(), date.getMinutes()); return d; }); };

  const switchWho = (id) => {
    setWho(id);
    if (WHO_DATA[id]) {
      setWeightVal(WHO_DATA[id].weight);
      setHeightVal(WHO_DATA[id].height);
      setWaistVal(WHO_DATA[id].waist);
    }
  };

  const toggleContext = (chip) => {
    if (chip === 'Usual / baseline') { setSelectedContext([chip]); return; }
    setSelectedContext(prev => {
      const without = prev.filter(c => c !== 'Usual / baseline');
      const next = without.includes(chip) ? without.filter(c => c !== chip) : [...without, chip];
      return next.length === 0 ? ['Usual / baseline'] : next;
    });
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── HEADER ── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={st.headerTitle}>Weight & Height</AppText>
            <AppText variant="caption" style={st.headerSub}>{formatDate(selectedDate)} - {formatTime(selectedDate)}</AppText>
          </View>
          {/* Unit toggle */}
          <View style={st.unitToggle}>
            <TouchableOpacity style={[st.utBtn, unit === 'metric' && st.utBtnOn]} onPress={() => setUnit('metric')}>
              <AppText variant="small" color={unit === 'metric' ? Colors.white : 'rgba(255,255,255,0.5)'} style={{fontWeight: '600'}}>kg/cm</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[st.utBtn, unit === 'imperial' && st.utBtnOn]} onPress={() => setUnit('imperial')}>
              <AppText variant="small" color={unit === 'imperial' ? Colors.white : 'rgba(255,255,255,0.5)'} style={{fontWeight: '600'}}>lb/in</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Mode tabs */}
        <View style={st.modeTabs}>
          {MODE_TABS.map(tab => (
            <TouchableOpacity key={tab.id} style={[st.modeTab, mode === tab.id && st.modeTabOn]} onPress={() => setMode(tab.id)} activeOpacity={0.7}>
              <AppText variant="caption" color={mode === tab.id ? Colors.white : 'rgba(255,255,255,0.5)'} style={{fontWeight: mode === tab.id ? '700' : '500'}}>{tab.label}</AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Who tabs */}
        <View style={st.whoTabs}>
          {WHO_TABS.map(tab => (
            <TouchableOpacity key={tab.id} style={[st.whoTab, who === tab.id && st.whoTabOn]} onPress={() => switchWho(tab.id)} activeOpacity={0.7}>
              <AppText variant="small" color={who === tab.id ? Colors.white : 'rgba(255,255,255,0.45)'} style={{fontWeight: who === tab.id ? '700' : '500'}}>{tab.label}</AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* BMI zone banner */}
        {bmi && (
          <View style={{paddingHorizontal: s(16), paddingTop: vs(8), paddingBottom: vs(10)}}>
            <View style={[st.zoneBanner, {backgroundColor: bmiCat.bg}]}>
              <Icon family="Ionicons" name={bmiCat.icon} size={ms(24)} color={bmiCat.color} style={{flexShrink: 0, marginTop: vs(1)}} />
              <View style={{flex: 1}}>
                <AppText style={{fontSize: ms(13), fontWeight: '700', color: bmiCat.color, lineHeight: ms(16)}}>{bmiCat.label}</AppText>
                <AppText style={{fontSize: ms(10), color: bmiCat.color, marginTop: vs(3), opacity: 0.8, lineHeight: ms(15)}}>
                  BMI {bmi} - Indian cut-off: normal {'<'}23{idealWeight && parseFloat(weightVal) > idealWeight ? ` - Target: ${unit === 'imperial' ? kgToLb(idealWeight) + ' lb' : idealWeight + ' kg'}` : ''}
                </AppText>
              </View>
              <View style={[st.zoneBadge, {backgroundColor: bmiCat.color}]}>
                <AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.white}}>BMI {bmi}</AppText>
              </View>
            </View>
          </View>
        )}
      </View>

      {/* Source strip */}
      {mode === 'manual' && (
        <View style={st.sourceStrip}>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: s(13), gap: s(5), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(10), fontWeight: '600', color: Colors.textSecondary, flexShrink: 0}}>Source:</AppText>
            {SOURCE_CHIPS.map(src => (
              <TouchableOpacity key={src.id} style={[st.srcBtn, source === src.id && st.srcBtnOn]} onPress={() => setSource(src.id)} activeOpacity={0.7}>
                <View style={{width: ms(7), height: ms(7), borderRadius: ms(4), backgroundColor: src.color}} />
                <AppText style={{fontSize: ms(11), fontWeight: source === src.id ? '700' : '500', color: source === src.id ? Colors.white : Colors.textSecondary}}>{src.label}</AppText>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}

      {/* ── SCROLLABLE BODY ── */}
      <ScrollView style={st.scroll} contentContainerStyle={st.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {mode === 'auto' && <WeightDeviceSync />}

        {mode === 'manual' && (
          <View>
            {/* Ayu Intel */}
            <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'weight', initialTab: 'weightIntel'})}>
              <View style={st.ayuIconWrap}><Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.white} /></View>
              <View style={{flex: 1}}>
                <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Weight & BMI</AppText>
                <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginTop: vs(1)}}>Condition impact - Target timeline - Patterns</AppText>
              </View>
              <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color="rgba(255,255,255,0.6)" />
            </TouchableOpacity>

            {/* Manual entry */}
            <WeightManualEntry weightVal={weightVal} setWeightVal={setWeightVal} heightVal={heightVal} setHeightVal={setHeightVal} waistVal={waistVal} setWaistVal={setWaistVal} unit={unit} />

            {/* Measurement conditions */}
            <View style={st.secLabel}>
              <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>Measurement conditions</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            <View style={st.chipWrap}>
              {TIME_CHIPS.map(chip => (
                <TouchableOpacity key={chip} style={[st.chip, selectedTime === chip && st.chipOn]} onPress={() => setSelectedTime(chip)} activeOpacity={0.7}>
                  <AppText variant="small" color={selectedTime === chip ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{chip}</AppText>
                </TouchableOpacity>
              ))}
            </View>
            <View style={[st.chipWrap, {marginTop: vs(6)}]}>
              {CLOTHING_CHIPS.map(chip => (
                <TouchableOpacity key={chip} style={[st.chip, selectedClothing === chip && st.chipOn]} onPress={() => setSelectedClothing(chip)} activeOpacity={0.7}>
                  <AppText variant="small" color={selectedClothing === chip ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{chip}</AppText>
                </TouchableOpacity>
              ))}
            </View>
            <View style={[st.chipWrap, {marginTop: vs(6)}]}>
              {MEAL_CHIPS.map(chip => (
                <TouchableOpacity key={chip} style={[st.chip, selectedMeal === chip && st.chipOn]} onPress={() => setSelectedMeal(chip)} activeOpacity={0.7}>
                  <AppText variant="small" color={selectedMeal === chip ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{chip}</AppText>
                </TouchableOpacity>
              ))}
            </View>

            {/* Context tags */}
            <View style={[st.secLabel, {marginTop: vs(12)}]}>
              <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>Context</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            <View style={st.chipWrap}>
              {CONTEXT_CHIPS.map(chip => {
                const isOn = selectedContext.includes(chip);
                return (
                  <TouchableOpacity key={chip} style={[st.ctxChip, isOn && st.ctxChipOn]} onPress={() => toggleContext(chip)} activeOpacity={0.7}>
                    <AppText variant="small" color={isOn ? Colors.purpleText : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>{chip}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Date/Time */}
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
              {showTimePicker && <DateTimePicker value={selectedDate} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={onTimeChange} />}
            </View>

            {/* Notes */}
            <View style={[st.secLabel, {marginTop: vs(4)}]}>
              <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>Note</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            <TextInput style={st.notesInput} placeholder="e.g. 'Heavy dinner night before', 'Period week'..." placeholderTextColor={Colors.textTertiary} multiline value={notes} onChangeText={setNotes} />
          </View>
        )}

        <View style={{height: vs(100)}} />
      </ScrollView>

      {/* ── BOTTOM ACTION BAR ── */}
      <View style={st.bottomBar}>
        <TouchableOpacity style={st.savePrimary} activeOpacity={0.8}>
          <Icon family="Ionicons" name="save-outline" size={ms(20)} color={Colors.white} />
          <AppText variant="body" color={Colors.white} style={{fontWeight: '700', fontSize: ms(15)}}>
            Save - {unit === 'imperial' ? `${kgToLb(weightVal)} lb` : `${weightVal} kg`} - {unit === 'imperial' ? cmToFtIn(heightVal) : `${heightVal} cm`}{bmi ? ` - BMI ${bmi}` : ''}
          </AppText>
        </TouchableOpacity>
        <View style={st.saveSecRow}>
          <TouchableOpacity style={st.saveSecBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Records', {tab: 'healthlogs', logFilter: 'weight'})}>
            <Icon family="Ionicons" name="document-text-outline" size={ms(14)} color={Colors.textSecondary} />
            <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '600'}}>Records</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={st.saveSecBtn} activeOpacity={0.7} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'weight', initialTab: 'weightIntel'})}>
            <Icon family="Ionicons" name="bulb-outline" size={ms(14)} color={Colors.textSecondary} />
            <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '600'}}>Ayu Intel</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ── Styles ──
const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  // Header
  header: {backgroundColor: Colors.primary},
  topBar: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(16), paddingTop: vs(10)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(11)},

  // Unit toggle
  unitToggle: {flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: ms(16), borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)', overflow: 'hidden'},
  utBtn: {paddingHorizontal: s(10), paddingVertical: vs(5)},
  utBtnOn: {backgroundColor: 'rgba(255,255,255,0.2)'},

  // Mode tabs
  modeTabs: {flexDirection: 'row', marginHorizontal: s(16), marginTop: vs(6), backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: ms(20), borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.12)', overflow: 'hidden'},
  modeTab: {flex: 1, paddingVertical: vs(6), alignItems: 'center'},
  modeTabOn: {backgroundColor: 'rgba(255,255,255,0.18)'},

  // Who tabs
  whoTabs: {flexDirection: 'row', marginHorizontal: s(16), marginTop: vs(5), backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: ms(20), overflow: 'hidden'},
  whoTab: {flex: 1, paddingVertical: vs(5), alignItems: 'center'},
  whoTabOn: {backgroundColor: 'rgba(255,255,255,0.15)'},

  // Zone banner
  zoneBanner: {borderRadius: ms(14), padding: ms(12), flexDirection: 'row', alignItems: 'flex-start', gap: s(11)},
  zoneBadge: {paddingHorizontal: s(9), paddingVertical: vs(3), borderRadius: ms(20), flexShrink: 0, marginTop: vs(2)},

  // Source strip
  sourceStrip: {backgroundColor: Colors.white, borderBottomWidth: 0.5, borderBottomColor: '#dde8e2', paddingVertical: vs(6), flexShrink: 0},
  srcBtn: {flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(11), paddingVertical: vs(5), borderRadius: ms(20), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.white, flexShrink: 0},
  srcBtnOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},

  // Scroll
  scroll: {flex: 1},
  body: {paddingHorizontal: s(13), paddingTop: vs(12)},

  // Section label
  secLabel: {flexDirection: 'row', alignItems: 'center', marginTop: vs(4), marginBottom: vs(8)},

  // Chips
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(6)},
  chip: {paddingHorizontal: s(12), paddingVertical: vs(7), borderRadius: ms(22), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.white},
  chipOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  ctxChip: {paddingHorizontal: s(11), paddingVertical: vs(6), borderRadius: ms(22), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.white},
  ctxChipOn: {backgroundColor: Colors.purpleBg, borderColor: '#CECBF6'},

  // Input card
  inputCard: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(16), marginTop: vs(10), marginBottom: vs(10)},
  dateTimeRow: {flexDirection: 'row', alignItems: 'center', gap: s(10)},
  dateTimeDivider: {width: 0.5, height: vs(36), backgroundColor: '#edf2ef'},

  // Notes
  notesInput: {width: '100%', borderWidth: 0.5, borderColor: '#dde8e2', borderRadius: ms(11), padding: ms(11), backgroundColor: Colors.white, minHeight: vs(60), fontSize: ms(12), color: Colors.textPrimary, textAlignVertical: 'top', lineHeight: ms(18)},

  // Ayu Intel
  ayuBtn: {flexDirection: 'row', alignItems: 'center', gap: s(8), backgroundColor: Colors.accent, borderRadius: ms(12), padding: ms(12), marginBottom: vs(12)},
  ayuIconWrap: {width: ms(36), height: ms(36), borderRadius: ms(10), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},

  // Bottom bar
  bottomBar: {backgroundColor: Colors.white, borderTopWidth: 0.5, borderTopColor: '#dde8e2', paddingHorizontal: s(13), paddingTop: vs(12), paddingBottom: Platform.OS === 'ios' ? vs(28) : vs(12)},
  savePrimary: {backgroundColor: Colors.primary, borderRadius: ms(13), paddingVertical: vs(15), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(10), marginBottom: vs(8)},
  saveSecRow: {flexDirection: 'row', gap: s(8)},
  saveSecBtn: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(5), backgroundColor: Colors.background, borderRadius: ms(11), paddingVertical: vs(11), borderWidth: 0.5, borderColor: '#dde8e2'},
});

export default WeightLogScreen;
