import React, {useState, useMemo} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, TextInput, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';
import MigraineManualView from './MigraineManualView';
import MigraineAutoView from './MigraineAutoView';

const MODE_TABS = [{id: 'manual', label: 'Manual'}, {id: 'auto', label: 'Auto / Smart device'}];

const AURA_CHIPS = ['Visual (zigzag, blind spot)', 'Tingling / numbness', 'Speech difficulty', 'Weakness / motor', 'No aura'];
const SYMPTOM_CHIPS = ['Nausea', 'Vomiting', 'Light sensitivity', 'Sound sensitivity', 'Smell sensitivity', 'Dizziness', 'Neck stiffness', 'Fatigue', 'Chills'];
const TRIGGER_CHIPS = ['Stress / anxiety', 'Poor sleep / <6h', 'Hormonal (menstrual)', 'Skipped meal', 'Dehydration', 'Bright light / screen', 'Weather / pressure change', 'Too much / too little caffeine', 'Alcohol (red wine, beer)', 'Aged cheese / processed food', 'Intense exercise', 'Strong smell', 'No obvious trigger'];
const DURATION_CHIPS = ['Just started', '<1 hour', '1-4 hours', '4-12 hours', '>12 hours', '>24 hours', '>72h (Status)'];

const MEDICATIONS = [
  {name: 'Sumatriptan 50 mg', sub: 'Triptan - rescue - taken at onset', type: 'Rescue', typeBg: Colors.tealBg, typeColor: Colors.primaryText},
  {name: 'Paracetamol 1000 mg', sub: 'Analgesic - with metoclopramide', type: 'OTC', typeBg: '#f0f0f0', typeColor: '#555'},
  {name: 'Ibuprofen 400 mg', sub: 'NSAID - with food', type: 'OTC', typeBg: '#f0f0f0', typeColor: '#555'},
  {name: 'Topiramate 50 mg', sub: 'Preventer - taken as scheduled', type: 'Preventer', typeBg: Colors.tealBg, typeColor: Colors.tealText},
  {name: 'No medication taken', sub: 'Managed without medication', type: 'None', typeBg: '#f0f0f0', typeColor: '#888'},
];

const MigraineLogScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState('manual');
  const [pain, setPain] = useState(7);
  const [selectedAura, setSelectedAura] = useState(['No aura']);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [selectedTriggers, setSelectedTriggers] = useState(['No obvious trigger']);
  const [selectedDuration, setSelectedDuration] = useState('4-12 hours');
  const [selectedMeds, setSelectedMeds] = useState([]);
  const [selectedImpact, setSelectedImpact] = useState('Bed rest needed');
  const [notes, setNotes] = useState('');
  const [selectedDate] = useState(new Date());

  const formatDate = (d) => { const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; const isToday = d.toDateString() === new Date().toDateString(); return `${isToday ? 'Today, ' : ''}${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`; };
  const formatTime = (d) => { let h = d.getHours(); const m = d.getMinutes().toString().padStart(2, '0'); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${m} ${ap}`; };

  const toggleExclusive = (chip, excl, setter) => {
    if (chip === excl) { setter([chip]); return; }
    setter(prev => {
      const without = prev.filter(c => c !== excl);
      const next = without.includes(chip) ? without.filter(c => c !== chip) : [...without, chip];
      return next.length === 0 ? [excl] : next;
    });
  };
  const toggleSymptom = (chip) => setSelectedSymptoms(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]);
  const toggleMed = (name) => setSelectedMeds(prev => prev.includes(name) ? prev.filter(c => c !== name) : [...prev, name]);

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText style={st.headerTitle}>Migraine & Headache</AppText>
            <AppText style={st.headerSub}>{formatDate(selectedDate)} - {formatTime(selectedDate)}</AppText>
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

      <ScrollView style={st.scroll} contentContainerStyle={st.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {mode === 'auto' && <MigraineAutoView />}
        {mode === 'manual' && (
          <View>
            <MigraineManualView pain={pain} setPain={setPain} />

            {/* Aura */}
            <View style={st.secLabel}>
              <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Aura</AppText>
              <View style={st.secLine} />
            </View>
            <View style={st.chipWrap}>
              {AURA_CHIPS.map(chip => {
                const isOn = selectedAura.includes(chip);
                return (
                  <TouchableOpacity key={chip} style={[st.chip, isOn && st.chipOnP]} onPress={() => toggleExclusive(chip, 'No aura', setSelectedAura)} activeOpacity={0.7}>
                    <AppText variant="small" color={isOn ? Colors.primaryText : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>{chip}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Associated symptoms */}
            <View style={st.secLabel}>
              <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Associated symptoms</AppText>
              <View style={st.secLine} />
            </View>
            <View style={st.chipWrap}>
              {SYMPTOM_CHIPS.map(chip => {
                const isOn = selectedSymptoms.includes(chip);
                return (
                  <TouchableOpacity key={chip} style={[st.chip, isOn && st.chipOnR]} onPress={() => toggleSymptom(chip)} activeOpacity={0.7}>
                    <AppText variant="small" color={isOn ? Colors.redDark : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>{chip}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Triggers */}
            <View style={st.secLabel}>
              <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Triggers</AppText>
              <View style={st.secLine} />
            </View>
            <View style={st.chipWrap}>
              {TRIGGER_CHIPS.map(chip => {
                const isOn = selectedTriggers.includes(chip);
                return (
                  <TouchableOpacity key={chip} style={[st.chip, isOn && st.chipOnP]} onPress={() => toggleExclusive(chip, 'No obvious trigger', setSelectedTriggers)} activeOpacity={0.7}>
                    <AppText variant="small" color={isOn ? Colors.primaryText : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>{chip}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Medication taken */}
            <View style={st.secLabel}>
              <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Medication taken</AppText>
              <View style={st.secLine} />
            </View>
            {MEDICATIONS.map((med, i) => {
              const isOn = selectedMeds.includes(med.name);
              return (
                <TouchableOpacity key={i} style={[st.medRow, isOn && st.medRowOn]} onPress={() => toggleMed(med.name)} activeOpacity={0.7}>
                  <View style={[st.medCircle, isOn && st.medCircleOn]}>
                    {isOn && <Icon family="Ionicons" name="checkmark" size={ms(11)} color={Colors.white} />}
                  </View>
                  <View style={{flex: 1}}>
                    <AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.textPrimary}}>{med.name}</AppText>
                    <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>{med.sub}</AppText>
                  </View>
                  <View style={[st.medType, {backgroundColor: med.typeBg}]}>
                    <AppText style={{fontSize: ms(9), fontWeight: '700', color: med.typeColor}}>{med.type}</AppText>
                  </View>
                </TouchableOpacity>
              );
            })}

            {/* Functional impact */}
            <View style={[st.secLabel, {marginTop: vs(8)}]}>
              <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Functional impact</AppText>
              <View style={st.secLine} />
            </View>
            <View style={{flexDirection: 'row', gap: s(7), marginBottom: vs(10)}}>
              {['Able to work', 'Limited function', 'Bed rest needed'].map((imp, i) => {
                const icons = ['briefcase-outline', 'warning-outline', 'bed-outline'];
                const isOn = selectedImpact === imp;
                return (
                  <TouchableOpacity key={imp} style={[st.impactBtn, isOn && st.impactBtnOn]} onPress={() => setSelectedImpact(imp)} activeOpacity={0.7}>
                    <Icon family="Ionicons" name={icons[i]} size={ms(20)} color={isOn ? Colors.primary : Colors.textSecondary} />
                    <AppText style={{fontSize: ms(10), fontWeight: '600', color: isOn ? Colors.primary : Colors.textSecondary, marginTop: vs(4)}}>{imp}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Duration */}
            <View style={st.secLabel}>
              <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Duration so far</AppText>
              <View style={st.secLine} />
            </View>
            <View style={st.chipWrap}>
              {DURATION_CHIPS.map(chip => {
                const isOn = selectedDuration === chip;
                return (
                  <TouchableOpacity key={chip} style={[st.chip, isOn && st.chipOnP]} onPress={() => setSelectedDuration(chip)} activeOpacity={0.7}>
                    <AppText variant="small" color={isOn ? Colors.primaryText : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>{chip}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Note */}
            <View style={[st.secLabel, {marginTop: vs(4)}]}>
              <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Note</AppText>
              <View style={st.secLine} />
            </View>
            <TextInput style={st.notesInput} placeholder="e.g. 'Woke with headache after poor sleep', 'Visual aura started 20 min before pain'..." placeholderTextColor={Colors.textTertiary} multiline value={notes} onChangeText={setNotes} />
          </View>
        )}
        <View style={{height: vs(100)}} />
      </ScrollView>

      {/* Bottom bar */}
      <View style={st.bottomBar}>
        <TouchableOpacity style={st.savePrimary} activeOpacity={0.8}>
          <Icon family="Ionicons" name="save-outline" size={ms(20)} color={Colors.white} />
          <AppText variant="body" color={Colors.white} style={{fontWeight: '700', fontSize: ms(15)}}>
            Save - Pain {pain}/10 - {selectedImpact}
          </AppText>
        </TouchableOpacity>
        <View style={st.saveSecRow}>
          <TouchableOpacity style={st.saveSecBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Records', {tab: 'healthlogs', logFilter: 'migraine'})}>
            <Icon family="Ionicons" name="document-text-outline" size={ms(14)} color={Colors.textSecondary} />
            <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '600'}}>Records</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={st.saveSecBtn} activeOpacity={0.7} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'migraine', initialTab: 'migraineIntel'})}>
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
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
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
  chipOnP: {backgroundColor: Colors.tealBg, borderColor: '#9FE1CB'},
  chipOnR: {backgroundColor: Colors.redBg, borderColor: '#FBBCBC'},
  medRow: {backgroundColor: Colors.white, borderRadius: ms(13), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(12), marginBottom: vs(7), flexDirection: 'row', alignItems: 'center', gap: s(10)},
  medRowOn: {borderColor: Colors.primary, backgroundColor: '#f4faf8'},
  medCircle: {width: ms(20), height: ms(20), borderRadius: ms(10), borderWidth: 2, borderColor: '#dde8e2', alignItems: 'center', justifyContent: 'center'},
  medCircleOn: {borderColor: Colors.primary, backgroundColor: Colors.primary},
  medType: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(10)},
  impactBtn: {flex: 1, backgroundColor: Colors.white, borderWidth: 0.5, borderColor: '#dde8e2', borderRadius: ms(12), padding: ms(10), alignItems: 'center'},
  impactBtnOn: {borderColor: Colors.primary, backgroundColor: '#f4faf8'},
  notesInput: {width: '100%', borderWidth: 0.5, borderColor: '#dde8e2', borderRadius: ms(11), padding: ms(11), backgroundColor: Colors.white, minHeight: vs(60), fontSize: ms(12), color: Colors.textPrimary, textAlignVertical: 'top', lineHeight: ms(18)},
  bottomBar: {backgroundColor: Colors.white, borderTopWidth: 0.5, borderTopColor: '#dde8e2', paddingHorizontal: s(13), paddingTop: vs(12), paddingBottom: Platform.OS === 'ios' ? vs(28) : vs(12)},
  savePrimary: {backgroundColor: Colors.primary, borderRadius: ms(13), paddingVertical: vs(15), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(10), marginBottom: vs(8)},
  saveSecRow: {flexDirection: 'row', gap: s(8)},
  saveSecBtn: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(5), backgroundColor: Colors.background, borderRadius: ms(11), paddingVertical: vs(11), borderWidth: 0.5, borderColor: '#dde8e2'},
});

export default MigraineLogScreen;
