import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, TextInput, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';
import AnemiaManualView from './AnemiaManualView';
import AnemiaAutoView from './AnemiaAutoView';

const MODE_TABS = [{id: 'manual', label: 'Manual'}, {id: 'eye', label: 'Eye scan'}, {id: 'auto', label: 'Auto / Lab'}];
const SYMPTOM_CHIPS = ['Fatigue / exhaustion', 'Breathlessness on exertion', 'Heart palpitations', 'Dizziness / lightheadedness', 'Cold hands and feet', 'Headache', 'Brain fog / poor concentration', 'Brittle nails', 'Hair loss', 'Sore / swollen tongue', 'Restless legs at night', 'Craving ice (pica)', 'No symptoms today'];
const CONTEXT_CHIPS = ['Heavy menstrual period', 'Vegetarian / low meat diet', 'Missed iron supplement', 'Tea/coffee with meals (blocks iron)', 'Recent illness / infection', 'Usual / no specific context'];

const AnemiaLogScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState('manual');
  const [fatigue, setFatigue] = useState(6);
  const [selectedSymptoms, setSelectedSymptoms] = useState(['Fatigue / exhaustion']);
  const [selectedContext, setSelectedContext] = useState(['Usual / no specific context']);
  const [ironTaken, setIronTaken] = useState(true);
  const [notes, setNotes] = useState('');
  const [selectedDate] = useState(new Date());

  const formatDate = (d) => { const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; const isToday = d.toDateString() === new Date().toDateString(); return `${isToday ? 'Today, ' : ''}${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`; };
  const formatTime = (d) => { let h = d.getHours(); const m = d.getMinutes().toString().padStart(2, '0'); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${m} ${ap}`; };

  const toggleExclusive = (chip, excl, list, setter) => {
    if (chip === excl) { setter([chip]); return; }
    setter(prev => {
      const without = prev.filter(c => c !== excl);
      const next = without.includes(chip) ? without.filter(c => c !== chip) : [...without, chip];
      return next.length === 0 ? [excl] : next;
    });
  };

  const FATIGUE_COLORS = ['#6b7280','#16a34a','#22c55e','#84cc16','#eab308','#f97316','#fb923c','#f87171','#ef4444','#dc2626','#7f1d1d'];
  const FATIGUE_LABELS = ['No fatigue','Almost none','Minimal','Mild','Moderate','Moderate','Noticeable','Significant','Severe','Very severe','Unable to function'];

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText style={st.headerTitle}>Anaemia & Haemoglobin</AppText>
            <AppText style={st.headerSub}>{formatDate(selectedDate)} - {formatTime(selectedDate)}</AppText>
          </View>
        </View>
        {/* 3 Mode tabs */}
        <View style={st.modeTabs}>
          {MODE_TABS.map(tab => (
            <TouchableOpacity key={tab.id} style={[st.modeTab, mode === tab.id && st.modeTabOn]} onPress={() => setMode(tab.id)} activeOpacity={0.7}>
              <AppText variant="caption" color={mode === tab.id ? Colors.white : 'rgba(255,255,255,0.5)'} style={{fontWeight: mode === tab.id ? '700' : '500'}}>{tab.label}</AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <ScrollView style={st.scroll} contentContainerStyle={st.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {mode === 'auto' && <AnemiaAutoView />}
        {(mode === 'manual' || mode === 'eye') && (
          <View>
            <AnemiaManualView mode={mode} fatigue={fatigue} setFatigue={setFatigue} fatigueColors={FATIGUE_COLORS} fatigueLabels={FATIGUE_LABELS} />

            {mode === 'manual' && (
              <View>
                {/* Symptoms */}
                <View style={st.secLabel}>
                  <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Symptoms</AppText>
                  <View style={st.secLine} />
                </View>
                <View style={st.chipWrap}>
                  {SYMPTOM_CHIPS.map(chip => {
                    const isOn = selectedSymptoms.includes(chip);
                    const isNone = chip === 'No symptoms today';
                    return (
                      <TouchableOpacity key={chip} style={[st.chip, isOn && (isNone ? st.chipOnG : st.chipOnR)]} onPress={() => toggleExclusive(chip, 'No symptoms today', SYMPTOM_CHIPS, setSelectedSymptoms)} activeOpacity={0.7}>
                        <AppText variant="small" color={isOn ? (isNone ? Colors.tealText : Colors.redDark) : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>{chip}</AppText>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Context */}
                <View style={[st.secLabel, {marginTop: vs(8)}]}>
                  <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Context</AppText>
                  <View style={st.secLine} />
                </View>
                <View style={st.chipWrap}>
                  {CONTEXT_CHIPS.map(chip => {
                    const isOn = selectedContext.includes(chip);
                    const isNone = chip === 'Usual / no specific context';
                    return (
                      <TouchableOpacity key={chip} style={[st.chip, isOn && (isNone ? st.chipOnG : st.chipOnR)]} onPress={() => toggleExclusive(chip, 'Usual / no specific context', CONTEXT_CHIPS, setSelectedContext)} activeOpacity={0.7}>
                        <AppText variant="small" color={isOn ? (isNone ? Colors.tealText : Colors.redDark) : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>{chip}</AppText>
                      </TouchableOpacity>
                    );
                  })}
                </View>

                {/* Iron supplement */}
                <View style={[st.secLabel, {marginTop: vs(8)}]}>
                  <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Iron supplement taken today</AppText>
                  <View style={st.secLine} />
                </View>
                <View style={st.ironRow}>
                  <Icon family="Ionicons" name="medical-outline" size={ms(22)} color={Colors.red} />
                  <View style={{flex: 1, marginLeft: s(10)}}>
                    <AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.textPrimary}}>Ferrous sulphate 200 mg</AppText>
                    <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>Prescribed - once daily - with Vitamin C</AppText>
                  </View>
                  <TouchableOpacity style={[st.ironBtn, ironTaken && st.ironBtnOn]} onPress={() => setIronTaken(!ironTaken)} activeOpacity={0.7}>
                    {ironTaken && <Icon family="Ionicons" name="checkmark" size={ms(14)} color={Colors.tealText} />}
                  </TouchableOpacity>
                  <AppText style={{fontSize: ms(12), fontWeight: '700', color: ironTaken ? Colors.tealText : Colors.textTertiary, marginLeft: s(6)}}>{ironTaken ? 'Taken' : 'Not taken'}</AppText>
                </View>

                {/* Note */}
                <View style={[st.secLabel, {marginTop: vs(8)}]}>
                  <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Note</AppText>
                  <View style={st.secLine} />
                </View>
                <TextInput style={st.notesInput} placeholder="e.g. 'Very tired after short walk', 'Started new iron supplement'..." placeholderTextColor={Colors.textTertiary} multiline value={notes} onChangeText={setNotes} />
              </View>
            )}
          </View>
        )}
        <View style={{height: vs(100)}} />
      </ScrollView>

      {/* Bottom bar */}
      <View style={st.bottomBar}>
        <TouchableOpacity style={st.savePrimary} activeOpacity={0.8}>
          <Icon family="Ionicons" name="save-outline" size={ms(20)} color={Colors.white} />
          <AppText variant="body" color={Colors.white} style={{fontWeight: '700', fontSize: ms(15)}}>
            Save - Fatigue {fatigue}/10 - {ironTaken ? 'Iron taken' : 'No iron'}
          </AppText>
        </TouchableOpacity>
        <View style={st.saveSecRow}>
          <TouchableOpacity style={st.saveSecBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Records', {tab: 'healthlogs', logFilter: 'anemia'})}>
            <Icon family="Ionicons" name="document-text-outline" size={ms(14)} color={Colors.textSecondary} />
            <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '600'}}>Records</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={st.saveSecBtn} activeOpacity={0.7} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'anemia', initialTab: 'anemiaIntel'})}>
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
  headerSub: {color: 'rgba(255,255,255,0.4)', fontSize: ms(11)},
  modeTabs: {flexDirection: 'row', marginTop: vs(6), marginBottom: vs(10), backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: ms(20), borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.12)', overflow: 'hidden'},
  modeTab: {flex: 1, paddingVertical: vs(6), alignItems: 'center'},
  modeTabOn: {backgroundColor: 'rgba(255,255,255,0.18)'},
  scroll: {flex: 1},
  body: {paddingHorizontal: s(13), paddingTop: vs(12)},
  secLabel: {flexDirection: 'row', alignItems: 'center', marginTop: vs(4), marginBottom: vs(8)},
  secText: {textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'},
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(6), marginBottom: vs(4)},
  chip: {paddingHorizontal: s(12), paddingVertical: vs(7), borderRadius: ms(22), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.white, marginBottom: vs(3)},
  chipOnR: {backgroundColor: Colors.redBg, borderColor: '#FBBCBC'},
  chipOnG: {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen},
  ironRow: {flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: ms(13), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(12), marginBottom: vs(10)},
  ironBtn: {width: ms(28), height: ms(28), borderRadius: ms(14), borderWidth: 2, borderColor: '#dde8e2', backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center'},
  ironBtnOn: {backgroundColor: Colors.tealBg, borderColor: Colors.accent},
  notesInput: {width: '100%', borderWidth: 0.5, borderColor: '#dde8e2', borderRadius: ms(11), padding: ms(11), backgroundColor: Colors.white, minHeight: vs(60), fontSize: ms(12), color: Colors.textPrimary, textAlignVertical: 'top', lineHeight: ms(18)},
  bottomBar: {backgroundColor: Colors.white, borderTopWidth: 0.5, borderTopColor: '#dde8e2', paddingHorizontal: s(13), paddingTop: vs(12), paddingBottom: Platform.OS === 'ios' ? vs(28) : vs(12)},
  savePrimary: {backgroundColor: Colors.primary, borderRadius: ms(13), paddingVertical: vs(15), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(10), marginBottom: vs(8)},
  saveSecRow: {flexDirection: 'row', gap: s(8)},
  saveSecBtn: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(5), backgroundColor: Colors.background, borderRadius: ms(11), paddingVertical: vs(11), borderWidth: 0.5, borderColor: '#dde8e2'},
});

export default AnemiaLogScreen;
