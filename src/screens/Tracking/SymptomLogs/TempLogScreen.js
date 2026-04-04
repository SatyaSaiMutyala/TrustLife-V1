import React, {useState, useMemo} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, TextInput, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import TempManualView from './TempManualView';
import TempAutoView from './TempAutoView';

// ── Data ──
const MODE_TABS = [{id: 'manual', label: 'Manual'}, {id: 'auto', label: 'Auto / Smart device'}];
const METHOD_CHIPS = [
  {id: 'oral', label: 'Oral'},
  {id: 'axillary', label: 'Axillary'},
  {id: 'ear', label: 'Ear (tympanic)'},
  {id: 'forehead', label: 'Forehead'},
  {id: 'rectal', label: 'Rectal'},
];
const CONTEXT_CHIPS = ['Took paracetamol', 'Took ibuprofen', 'Cold compress', 'Hot drink', 'Exercise', 'Hot bath', 'Nothing unusual', 'Just woke up'];
const SYMPTOM_CHIPS = ['Chills / shivering', 'Sweating', 'Headache', 'Body ache', 'Fatigue', 'Runny nose', 'Cough', 'Nausea', 'Sore throat', 'Loss of taste / smell', 'Dizziness'];

// ── Conversion ──
const cToF = (c) => Math.round((c * 9 / 5 + 32) * 10) / 10;
const fToC = (f) => Math.round((f - 32) * 5 / 9 * 10) / 10;

// ── Zone logic (always in °C) ──
const getZone = (tempC) => {
  if (tempC < 35) return {label: 'Hypothermia', color: Colors.blueText, bg: Colors.blueBg, icon: 'snow-outline', badge: 'Hypothermia'};
  if (tempC < 37.3) return {label: 'Normal temperature', color: Colors.tealText, bg: Colors.tealBg, icon: 'checkmark-circle-outline', badge: `${tempC.toFixed(1)}\u00B0C`};
  if (tempC < 38) return {label: 'Low-grade fever', color: Colors.amberDark, bg: Colors.amberBg, icon: 'warning-outline', badge: 'Low fever'};
  if (tempC < 39) return {label: 'Fever', color: Colors.redDark, bg: Colors.redBg, icon: 'flame-outline', badge: 'Fever'};
  if (tempC < 40) return {label: 'High fever - Seek care today', color: Colors.redDark, bg: Colors.redBg, icon: 'alert-circle-outline', badge: 'High fever'};
  return {label: 'Crisis - Emergency', color: '#fff', bg: '#2d0d0d', icon: 'warning-outline', badge: 'EMERGENCY'};
};

// ── Main Screen ──
const TempLogScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  const [unit, setUnit] = useState('C');
  const [mode, setMode] = useState('manual');
  const [tempC, setTempC] = useState(36.9);
  const [method, setMethod] = useState('oral');
  const [selectedContext, setSelectedContext] = useState(['Nothing unusual']);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [notes, setNotes] = useState('');
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const zone = useMemo(() => getZone(tempC), [tempC]);
  const displayTemp = unit === 'F' ? cToF(tempC).toFixed(1) : tempC.toFixed(1);
  const unitLabel = unit === 'F' ? '\u00B0F' : '\u00B0C';
  const methodLabel = METHOD_CHIPS.find(m => m.id === method)?.label || 'Oral';

  const formatDate = (d) => { const now = new Date(); const isToday = d.toDateString() === now.toDateString(); const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; return `${isToday ? 'Today, ' : ''}${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`; };
  const formatTime = (d) => { let h = d.getHours(); const m = d.getMinutes().toString().padStart(2, '0'); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${m} ${ap}`; };
  const onDateChange = (event, date) => { setShowDatePicker(false); if (date) setSelectedDate(prev => { const d = new Date(prev); d.setFullYear(date.getFullYear(), date.getMonth(), date.getDate()); return d; }); };
  const onTimeChange = (event, date) => { setShowTimePicker(false); if (date) setSelectedDate(prev => { const d = new Date(prev); d.setHours(date.getHours(), date.getMinutes()); return d; }); };

  const toggleContext = (chip) => {
    if (chip === 'Nothing unusual') { setSelectedContext([chip]); return; }
    setSelectedContext(prev => {
      const without = prev.filter(c => c !== 'Nothing unusual');
      const next = without.includes(chip) ? without.filter(c => c !== chip) : [...without, chip];
      return next.length === 0 ? ['Nothing unusual'] : next;
    });
  };
  const toggleSymptom = (chip) => {
    setSelectedSymptoms(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]);
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
            <AppText variant="screenName" style={st.headerTitle}>Body temperature</AppText>
            <AppText variant="caption" style={st.headerSub}>{formatDate(selectedDate)} - {formatTime(selectedDate)}</AppText>
          </View>
          {/* Unit toggle */}
          <View style={st.unitToggle}>
            <TouchableOpacity style={[st.utBtn, unit === 'C' && st.utBtnOn]} onPress={() => setUnit('C')}>
              <AppText variant="small" color={unit === 'C' ? Colors.white : 'rgba(255,255,255,0.5)'} style={{fontWeight: '600'}}>{'\u00B0'}C</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[st.utBtn, unit === 'F' && st.utBtnOn]} onPress={() => setUnit('F')}>
              <AppText variant="small" color={unit === 'F' ? Colors.white : 'rgba(255,255,255,0.5)'} style={{fontWeight: '600'}}>{'\u00B0'}F</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Zone banner */}
        <View style={{paddingTop: vs(8), paddingBottom: vs(10)}}>
          <View style={[st.zoneBanner, {backgroundColor: zone.bg}]}>
            <Icon family="Ionicons" name={zone.icon} size={ms(26)} color={zone.color} style={{flexShrink: 0, marginTop: vs(1)}} />
            <View style={{flex: 1}}>
              <AppText style={{fontSize: ms(13), fontWeight: '700', color: zone.color, lineHeight: ms(16)}}>{zone.label}</AppText>
              <AppText style={{fontSize: ms(10), color: zone.color, marginTop: vs(3), opacity: 0.8, lineHeight: ms(15)}}>
                {displayTemp}{unitLabel} is within the normal range of {unit === 'F' ? '96.8\u201398.9\u00B0F' : '36.1\u201337.2\u00B0C'}. No concern.
              </AppText>
            </View>
            <View style={[st.zoneBadge, {backgroundColor: zone.color}]}>
              <AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.white}}>{displayTemp}{unitLabel}</AppText>
            </View>
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
      </View>

      {/* ── SCROLLABLE BODY ── */}
      <ScrollView style={st.scroll} contentContainerStyle={st.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">

        {mode === 'auto' && <TempAutoView unit={unit} />}

        {mode === 'manual' && (
          <View>
            {/* Manual entry */}
            <TempManualView tempC={tempC} setTempC={setTempC} unit={unit} />

            {/* Measurement method */}
            <View style={st.secLabel}>
              <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>Measurement method</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: ms(6), paddingBottom: vs(2)}}>
              {METHOD_CHIPS.map(chip => (
                <TouchableOpacity key={chip.id} style={[st.chip, method === chip.id && st.chipOn]} onPress={() => setMethod(chip.id)} activeOpacity={0.7}>
                  <AppText variant="small" color={method === chip.id ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{chip.label}</AppText>
                </TouchableOpacity>
              ))}
            </ScrollView>

            {/* Method note */}
            <View style={[st.noteRow, {marginTop: vs(8)}]}>
              <Icon family="Ionicons" name="information-circle-outline" size={ms(13)} color={Colors.textTertiary} />
              <AppText variant="small" color={Colors.textSecondary} style={{flex: 1, lineHeight: ms(16)}}>
                <AppText style={{fontWeight: '700'}}>Oral</AppText> readings are most comparable. Axillary runs ~0.5{'\u00B0'}C lower; ear/forehead vary by technique. Always note the method for consistent records.
              </AppText>
            </View>

            {/* Before this reading */}
            <View style={[st.secLabel, {marginTop: vs(12)}]}>
              <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>Before this reading</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            <View style={st.chipWrap}>
              {CONTEXT_CHIPS.map(chip => {
                const isOn = selectedContext.includes(chip);
                return (
                  <TouchableOpacity key={chip} style={[st.ctxChip, isOn && st.ctxChipOn]} onPress={() => toggleContext(chip)} activeOpacity={0.7}>
                    <AppText variant="small" color={isOn ? Colors.tealText : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>{chip}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Symptoms */}
            <View style={[st.secLabel, {marginTop: vs(12)}]}>
              <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>Symptoms</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            <View style={st.chipWrap}>
              {SYMPTOM_CHIPS.map(chip => {
                const isOn = selectedSymptoms.includes(chip);
                return (
                  <TouchableOpacity key={chip} style={[st.symChip, isOn && st.symChipOn]} onPress={() => toggleSymptom(chip)} activeOpacity={0.7}>
                    <AppText variant="small" color={isOn ? Colors.redDark : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>{chip}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Note */}
            <View style={[st.secLabel, {marginTop: vs(12)}]}>
              <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>Note</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            <TextInput style={st.notesInput} placeholder="e.g. 'Day 2 of cold', 'Taken 1h after paracetamol'..." placeholderTextColor={Colors.textTertiary} multiline value={notes} onChangeText={setNotes} />
          </View>
        )}

        <View style={{height: vs(100)}} />
      </ScrollView>

      {/* ── BOTTOM ACTION BAR ── */}
      <View style={st.bottomBar}>
        <TouchableOpacity style={st.savePrimary} activeOpacity={0.8}>
          <Icon family="Ionicons" name="save-outline" size={ms(20)} color={Colors.white} />
          <AppText variant="body" color={Colors.white} style={{fontWeight: '700', fontSize: ms(15)}}>
            Save - {displayTemp}{unitLabel} - {methodLabel} - {zone.label.split(' - ')[0]}
          </AppText>
        </TouchableOpacity>
        <View style={st.saveSecRow}>
          <TouchableOpacity style={st.saveSecBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Records', {tab: 'healthlogs', logFilter: 'temp'})}>
            <Icon family="Ionicons" name="document-text-outline" size={ms(14)} color={Colors.textSecondary} />
            <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '600'}}>Records</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={st.saveSecBtn} activeOpacity={0.7} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'temperature', initialTab: 'tempIntel'})}>
            <Icon family="Ionicons" name="bulb-outline" size={ms(14)} color={Colors.textSecondary} />
            <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '600'}}>Ayu Intel</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', paddingTop: vs(10)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(11)},
  unitToggle: {flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: ms(16), borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)', overflow: 'hidden'},
  utBtn: {paddingHorizontal: s(11), paddingVertical: vs(5)},
  utBtnOn: {backgroundColor: 'rgba(255,255,255,0.2)'},
  zoneBanner: {borderRadius: ms(14), padding: ms(12), flexDirection: 'row', alignItems: 'flex-start', gap: s(11)},
  zoneBadge: {paddingHorizontal: s(9), paddingVertical: vs(3), borderRadius: ms(20), flexShrink: 0, marginTop: vs(2)},
  modeTabs: {flexDirection: 'row', marginTop: vs(6), marginBottom: vs(10), backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: ms(20), borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.12)', overflow: 'hidden'},
  modeTab: {flex: 1, paddingVertical: vs(6), alignItems: 'center'},
  modeTabOn: {backgroundColor: 'rgba(255,255,255,0.18)'},
  scroll: {flex: 1},
  body: {paddingHorizontal: s(13), paddingTop: vs(12)},
  secLabel: {flexDirection: 'row', alignItems: 'center', marginTop: vs(4), marginBottom: vs(8)},
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(6)},
  chip: {paddingHorizontal: s(12), paddingVertical: vs(7), borderRadius: ms(22), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.white},
  chipOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  ctxChip: {paddingHorizontal: s(11), paddingVertical: vs(6), borderRadius: ms(22), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.white, marginBottom: vs(2)},
  ctxChipOn: {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen},
  symChip: {paddingHorizontal: s(11), paddingVertical: vs(6), borderRadius: ms(22), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.white, marginBottom: vs(2)},
  symChipOn: {backgroundColor: Colors.redBg, borderColor: '#FBBCBC'},
  noteRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(8), backgroundColor: Colors.background, borderRadius: ms(10), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(9), marginBottom: vs(10)},
  notesInput: {width: '100%', borderWidth: 0.5, borderColor: '#dde8e2', borderRadius: ms(11), padding: ms(11), backgroundColor: Colors.white, minHeight: vs(60), fontSize: ms(12), color: Colors.textPrimary, textAlignVertical: 'top', lineHeight: ms(18)},
  bottomBar: {backgroundColor: Colors.white, borderTopWidth: 0.5, borderTopColor: '#dde8e2', paddingHorizontal: s(13), paddingTop: vs(12), paddingBottom: Platform.OS === 'ios' ? vs(28) : vs(12)},
  savePrimary: {backgroundColor: Colors.primary, borderRadius: ms(13), paddingVertical: vs(15), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(10), marginBottom: vs(8)},
  saveSecRow: {flexDirection: 'row', gap: s(8)},
  saveSecBtn: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(5), backgroundColor: Colors.background, borderRadius: ms(11), paddingVertical: vs(11), borderWidth: 0.5, borderColor: '#dde8e2'},
});

export default TempLogScreen;
