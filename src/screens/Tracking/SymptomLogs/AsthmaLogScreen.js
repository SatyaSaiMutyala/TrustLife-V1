import React, {useState, useMemo} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, TextInput, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';
import AsthmaManualView from './AsthmaManualView';
import AsthmaAutoView from './AsthmaAutoView';

const MODE_TABS = [{id: 'manual', label: 'Manual'}, {id: 'auto', label: 'Auto / Smart device'}];
const TIME_CHIPS = ['Morning (on waking)', 'Evening (before bed)', 'During symptoms', 'After rescue inhaler', 'After exercise', 'Clinic check'];
const SYMPTOM_CHIPS = ['Wheeze', 'Shortness of breath', 'Chest tightness', 'Cough', 'Night cough / waking', 'Exercise-induced', 'Can\'t sleep', 'No symptoms today'];
const TRIGGER_CHIPS = ['Dust / pollen', 'Pet dander', 'Air pollution', 'Cold air', 'Respiratory infection', 'Stress / anxiety', 'Strong smell / smoke', 'Weather change', 'No trigger identified'];

const PERSONAL_BEST = 380;

const getZone = (pef, pb) => {
  const pct = Math.round(pef / pb * 100);
  if (pct >= 80) return {label: 'Green zone - Well controlled', color: Colors.tealText, bg: Colors.tealBg, icon: 'checkmark-circle-outline', badge: `${pef} L/min`, pct};
  if (pct >= 50) return {label: 'Yellow zone - Caution', color: Colors.amberDark, bg: Colors.amberBg, icon: 'warning-outline', badge: `${pef} L/min`, pct};
  return {label: 'Red zone - Medical emergency', color: Colors.redDark, bg: Colors.redBg, icon: 'alert-circle-outline', badge: 'EMERGENCY', pct};
};

const AsthmaLogScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [mode, setMode] = useState('manual');
  const [pef, setPef] = useState(335);
  const [rescuePuffs, setRescuePuffs] = useState(0);
  const [selectedTime, setSelectedTime] = useState(['Morning (on waking)']);
  const [selectedSymptoms, setSelectedSymptoms] = useState(['No symptoms today']);
  const [selectedTriggers, setSelectedTriggers] = useState(['No trigger identified']);
  const [notes, setNotes] = useState('');
  const [selectedDate] = useState(new Date());

  const zone = useMemo(() => getZone(pef, PERSONAL_BEST), [pef]);

  const formatDate = (d) => { const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec']; const isToday = d.toDateString() === new Date().toDateString(); return `${isToday ? 'Today, ' : ''}${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`; };
  const formatTime = (d) => { let h = d.getHours(); const m = d.getMinutes().toString().padStart(2, '0'); const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12; return `${h}:${m} ${ap}`; };

  const toggleChip = (chip, list, setter, exclusive) => {
    if (exclusive) { setter([chip]); return; }
    setter(prev => {
      const excl = list === SYMPTOM_CHIPS ? 'No symptoms today' : 'No trigger identified';
      const without = prev.filter(c => c !== excl);
      const next = without.includes(chip) ? without.filter(c => c !== chip) : [...without, chip];
      return next.length === 0 ? [excl] : next;
    });
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText style={st.headerTitle}>Asthma & Peak Flow</AppText>
            <AppText style={st.headerSub}>{formatDate(selectedDate)} - {formatTime(selectedDate)}</AppText>
          </View>
        </View>

        {/* Zone banner */}
        <View style={{paddingTop: vs(8), paddingBottom: vs(10)}}>
          <View style={[st.zoneBanner, {backgroundColor: zone.bg}]}>
            <Icon family="Ionicons" name={zone.icon} size={ms(26)} color={zone.color} style={{flexShrink: 0, marginTop: vs(1)}} />
            <View style={{flex: 1}}>
              <AppText style={{fontSize: ms(13), fontWeight: '700', color: zone.color, lineHeight: ms(16)}}>{zone.label}</AppText>
              <AppText style={{fontSize: ms(10), color: zone.color, marginTop: vs(3), opacity: 0.8, lineHeight: ms(15)}}>
                PEF {zone.pct}% of personal best. {zone.pct >= 80 ? 'Continue preventer inhaler as scheduled.' : zone.pct >= 50 ? 'Take 2-4 puffs Salbutamol now.' : 'Seek emergency care immediately.'}
              </AppText>
            </View>
            <View style={[st.zoneBadge, {backgroundColor: zone.color}]}>
              <AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.white}}>{zone.badge}</AppText>
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

      <ScrollView style={st.scroll} contentContainerStyle={st.body} showsVerticalScrollIndicator={false} keyboardShouldPersistTaps="handled">
        {mode === 'auto' && <AsthmaAutoView />}
        {mode === 'manual' && (
          <View>
            <AsthmaManualView pef={pef} setPef={setPef} personalBest={PERSONAL_BEST} />

            {/* When is this reading */}
            <View style={st.secLabel}>
              <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>When is this reading?</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            <View style={st.chipWrap}>
              {TIME_CHIPS.map(chip => {
                const isOn = selectedTime.includes(chip);
                return (
                  <TouchableOpacity key={chip} style={[st.chip, isOn && st.chipOnG]} onPress={() => toggleChip(chip, TIME_CHIPS, setSelectedTime, false)} activeOpacity={0.7}>
                    <AppText variant="small" color={isOn ? Colors.tealText : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>{chip}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Rescue inhaler */}
            <View style={st.secLabel}>
              <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>Rescue inhaler - Salbutamol</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            <View style={st.rescueRow}>
              <Icon family="Ionicons" name="medkit-outline" size={ms(22)} color={Colors.red} />
              <View style={{flex: 1, marginLeft: s(10)}}>
                <AppText style={{fontSize: ms(12), fontWeight: '600', color: Colors.textPrimary}}>Puffs used today</AppText>
                <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>Before this reading - Salbutamol 100mcg</AppText>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
                <TouchableOpacity style={st.rcBtn} onPress={() => setRescuePuffs(p => Math.max(0, p - 1))}><AppText style={{fontSize: ms(18), fontWeight: '700', color: Colors.textSecondary}}>-</AppText></TouchableOpacity>
                <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.red, minWidth: s(28), textAlign: 'center'}}>{rescuePuffs}</AppText>
                <TouchableOpacity style={st.rcBtn} onPress={() => setRescuePuffs(p => p + 1)}><AppText style={{fontSize: ms(18), fontWeight: '700', color: Colors.textSecondary}}>+</AppText></TouchableOpacity>
              </View>
            </View>

            {/* Symptoms */}
            <View style={st.secLabel}>
              <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>Symptoms</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            <View style={st.chipWrap}>
              {SYMPTOM_CHIPS.map(chip => {
                const isOn = selectedSymptoms.includes(chip);
                const isNoSym = chip === 'No symptoms today';
                return (
                  <TouchableOpacity key={chip} style={[st.chip, isOn && (isNoSym ? st.chipOnG : st.chipOnR)]} onPress={() => toggleChip(chip, SYMPTOM_CHIPS, setSelectedSymptoms, isNoSym)} activeOpacity={0.7}>
                    <AppText variant="small" color={isOn ? (isNoSym ? Colors.tealText : Colors.redDark) : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>{chip}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Triggers */}
            <View style={[st.secLabel, {marginTop: vs(8)}]}>
              <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>Triggers</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            <View style={st.chipWrap}>
              {TRIGGER_CHIPS.map(chip => {
                const isOn = selectedTriggers.includes(chip);
                const isNone = chip === 'No trigger identified';
                return (
                  <TouchableOpacity key={chip} style={[st.chip, isOn && st.chipOnG]} onPress={() => toggleChip(chip, TRIGGER_CHIPS, setSelectedTriggers, isNone)} activeOpacity={0.7}>
                    <AppText variant="small" color={isOn ? Colors.tealText : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>{chip}</AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Note */}
            <View style={[st.secLabel, {marginTop: vs(8)}]}>
              <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>Note</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            <TextInput style={st.notesInput} placeholder="e.g. 'Dusty house cleaning today', 'Walking outside in cold air'..." placeholderTextColor={Colors.textTertiary} multiline value={notes} onChangeText={setNotes} />
          </View>
        )}
        <View style={{height: vs(100)}} />
      </ScrollView>

      {/* Bottom bar */}
      <View style={st.bottomBar}>
        <TouchableOpacity style={st.savePrimary} activeOpacity={0.8}>
          <Icon family="Ionicons" name="save-outline" size={ms(20)} color={Colors.white} />
          <AppText variant="body" color={Colors.white} style={{fontWeight: '700', fontSize: ms(15)}}>
            Save - {pef} L/min - {zone.pct}% - {zone.pct >= 80 ? 'Green zone' : zone.pct >= 50 ? 'Yellow zone' : 'Red zone'}
          </AppText>
        </TouchableOpacity>
        <View style={st.saveSecRow}>
          <TouchableOpacity style={st.saveSecBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Records', {tab: 'healthlogs', logFilter: 'asthma'})}>
            <Icon family="Ionicons" name="document-text-outline" size={ms(14)} color={Colors.textSecondary} />
            <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '600'}}>Records</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={st.saveSecBtn} activeOpacity={0.7} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'asthma', initialTab: 'asthmaIntel'})}>
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
  zoneBanner: {borderRadius: ms(14), padding: ms(12), flexDirection: 'row', alignItems: 'flex-start', gap: s(11)},
  zoneBadge: {paddingHorizontal: s(9), paddingVertical: vs(3), borderRadius: ms(20), flexShrink: 0, marginTop: vs(2)},
  modeTabs: {flexDirection: 'row', marginTop: vs(6), marginBottom: vs(10), backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: ms(20), borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.12)', overflow: 'hidden'},
  modeTab: {flex: 1, paddingVertical: vs(6), alignItems: 'center'},
  modeTabOn: {backgroundColor: 'rgba(255,255,255,0.18)'},
  scroll: {flex: 1},
  body: {paddingHorizontal: s(13), paddingTop: vs(12)},
  secLabel: {flexDirection: 'row', alignItems: 'center', marginTop: vs(4), marginBottom: vs(8)},
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(6)},
  chip: {paddingHorizontal: s(12), paddingVertical: vs(7), borderRadius: ms(22), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.white, marginBottom: vs(3)},
  chipOnG: {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen},
  chipOnR: {backgroundColor: Colors.redBg, borderColor: '#FBBCBC'},
  rescueRow: {flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: ms(13), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(13), marginBottom: vs(10)},
  rcBtn: {width: ms(32), height: ms(32), borderRadius: ms(16), backgroundColor: Colors.background, borderWidth: 0.5, borderColor: '#dde8e2', alignItems: 'center', justifyContent: 'center'},
  notesInput: {width: '100%', borderWidth: 0.5, borderColor: '#dde8e2', borderRadius: ms(11), padding: ms(11), backgroundColor: Colors.white, minHeight: vs(60), fontSize: ms(12), color: Colors.textPrimary, textAlignVertical: 'top', lineHeight: ms(18)},
  bottomBar: {backgroundColor: Colors.white, borderTopWidth: 0.5, borderTopColor: '#dde8e2', paddingHorizontal: s(13), paddingTop: vs(12), paddingBottom: Platform.OS === 'ios' ? vs(28) : vs(12)},
  savePrimary: {backgroundColor: Colors.primary, borderRadius: ms(13), paddingVertical: vs(15), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(10), marginBottom: vs(8)},
  saveSecRow: {flexDirection: 'row', gap: s(8)},
  saveSecBtn: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(5), backgroundColor: Colors.background, borderRadius: ms(11), paddingVertical: vs(11), borderWidth: 0.5, borderColor: '#dde8e2'},
});

export default AsthmaLogScreen;
