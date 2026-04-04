import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const PAIN_COLORS = ['#6b7280','#16a34a','#22c55e','#84cc16','#eab308','#f97316','#fb923c','#f87171','#ef4444','#dc2626','#991b1b'];
const PAIN_BG = ['#f3f4f6','#dcfce7','#dcfce7','#d9f99d','#fef9c3','#ffedd5','#ffedd5','#fee2e2','#fee2e2','#fee2e2','#7f1d1d'];
const PAIN_LABELS = ['No pain','Minimal','Mild','Mild-moderate','Moderate','Moderate','Moderate-severe','Severe','Severe','Very severe','Worst possible'];

const HEADACHE_TYPES = ['Migraine with aura', 'Migraine without aura', 'Tension headache', 'Cluster headache', 'Not sure'];
const PHASES = ['Prodrome (warning signs)', 'Aura', 'Headache (active)', 'Postdrome (after)'];
const LOCATIONS = [
  {id: 'left', label: 'Left side', icon: 'arrow-back-outline'},
  {id: 'right', label: 'Right side', icon: 'arrow-forward-outline'},
  {id: 'both', label: 'Both sides', icon: 'swap-horizontal-outline'},
  {id: 'forehead', label: 'Forehead', icon: 'remove-outline'},
  {id: 'back', label: 'Back of head', icon: 'return-down-back-outline'},
  {id: 'eye', label: 'Around eye', icon: 'eye-outline'},
];

const MigraineManualView = ({pain, setPain}) => {
  const [headacheType, setHeadacheType] = useState('Migraine with aura');
  const [phase, setPhase] = useState('Headache (active)');
  const [location, setLocation] = useState('left');
  const [onsetTime] = useState({h: 9, m: 41, ap: 'AM'});

  return (
    <View>
      {/* Best practice card */}
      <View style={st.tipCard}>
        <AppText variant="subtext" color={Colors.primary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginBottom: vs(7)}}>
          Best practice - Accurate migraine log
        </AppText>
        {[
          {text: 'Log at onset \u2013 record the migraine as soon as it starts, not after recovery, for the most accurate trigger data.', ok: true},
          {text: 'Note all triggers \u2013 migraine is usually multi-trigger. Stress + poor sleep + hormones together are more likely to cause an attack than any single trigger alone.', ok: true},
          {text: 'Take medication early \u2013 triptans and NSAIDs work best in the first 30 minutes of headache onset, before central sensitisation sets in.', ok: true},
          {text: 'Using rescue medication >10 days/month causes medication overuse headache \u2013 a worsening cycle. Track your usage here.', ok: false},
        ].map((tip, i) => (
          <View key={i} style={{flexDirection: 'row', alignItems: 'flex-start', gap: s(8), marginBottom: vs(5)}}>
            <View style={[st.tipDot, {backgroundColor: tip.ok ? Colors.primaryBg : Colors.amberBg}]}>
              {tip.ok
                ? <Icon family="Ionicons" name="checkmark" size={ms(9)} color={Colors.primary} />
                : <AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.amberDark}}>!</AppText>
              }
            </View>
            <AppText variant="small" color={tip.ok ? Colors.textPrimary : Colors.textSecondary} style={{flex: 1, lineHeight: ms(16)}}>{tip.text}</AppText>
          </View>
        ))}
      </View>

      {/* Companion gadgets */}
      <View style={st.secLabel}>
        <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Companion gadgets</AppText>
        <View style={st.secLine} />
      </View>
      <View style={{flexDirection: 'row', gap: s(7), marginBottom: vs(10)}}>
        {[
          {icon: 'heart-outline', name: 'BP monitor', val: '136/88', valColor: Colors.red},
          {icon: 'pulse-outline', name: 'Pulse oximeter', val: '97% - 88 bpm', valColor: Colors.primary},
          {icon: 'thermometer-outline', name: 'Thermometer', val: '37.1\u00B0C', valColor: Colors.primary},
        ].map((g, i) => (
          <TouchableOpacity key={i} style={st.gadgetCard} activeOpacity={0.7}>
            <Icon family="Ionicons" name={g.icon} size={ms(20)} color={Colors.textSecondary} />
            <AppText style={{fontSize: ms(10), fontWeight: '700', color: Colors.textPrimary, marginTop: vs(4)}}>{g.name}</AppText>
            <AppText style={{fontSize: ms(9), color: g.valColor, marginTop: vs(2)}}>{g.val}</AppText>
            <AppText style={{fontSize: ms(8), color: Colors.textTertiary, marginTop: vs(2)}}>Tap to log</AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Onset & finish time */}
      <View style={st.secLabel}>
        <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Onset & finish time</AppText>
        <View style={st.secLine} />
      </View>
      <View style={{flexDirection: 'row', gap: s(10), marginBottom: vs(10)}}>
        <View style={{flex: 1}}>
          <AppText style={{fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(6)}}>Started</AppText>
          <View style={st.timeBox}>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(4)}}>Onset time</AppText>
            <AppText style={{fontSize: ms(28), fontWeight: '800', color: Colors.primary}}>{onsetTime.h}:{String(onsetTime.m).padStart(2, '0')}</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary, marginTop: vs(2)}}>{onsetTime.ap}</AppText>
          </View>
        </View>
        <View style={{flex: 1}}>
          <AppText style={{fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(6)}}>Resolved</AppText>
          <View style={st.timeBox}>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(4)}}>Finish time</AppText>
            <AppText style={{fontSize: ms(28), fontWeight: '800', color: Colors.textTertiary}}>{'\u2014'}</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary, marginTop: vs(2)}}>Not yet resolved</AppText>
          </View>
        </View>
      </View>
      <View style={st.durationCalc}>
        <Icon family="Ionicons" name="time-outline" size={ms(14)} color={Colors.textSecondary} />
        <AppText variant="small" color={Colors.textSecondary}>Duration: ongoing since {onsetTime.h}:{String(onsetTime.m).padStart(2, '0')} {onsetTime.ap}</AppText>
      </View>

      {/* Pain intensity */}
      <View style={st.secLabel}>
        <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Pain intensity</AppText>
        <View style={st.secLine} />
      </View>
      <View style={{flexDirection: 'row', gap: ms(3), marginBottom: vs(6)}}>
        {Array.from({length: 11}, (_, i) => {
          const isOn = i <= pain;
          return (
            <TouchableOpacity key={i} style={[st.painBtn, isOn && {backgroundColor: PAIN_COLORS[pain], borderColor: PAIN_COLORS[pain]}]} onPress={() => setPain(i)} activeOpacity={0.7}>
              <AppText style={{fontSize: ms(12), fontWeight: '800', color: isOn ? '#fff' : Colors.textSecondary}}>{i}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={[st.painDesc, {backgroundColor: PAIN_BG[pain]}]}>
        <AppText style={{fontSize: ms(11), color: pain > 5 ? '#7f1d1d' : pain > 3 ? '#78350f' : '#166534', textAlign: 'center'}}>{pain}/10 - {PAIN_LABELS[pain]}</AppText>
      </View>

      {/* Headache type */}
      <View style={st.secLabel}>
        <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Headache type</AppText>
        <View style={st.secLine} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: ms(6), paddingBottom: vs(2), marginBottom: vs(6)}}>
        {HEADACHE_TYPES.map(type => {
          const isOn = headacheType === type;
          return (
            <TouchableOpacity key={type} style={[st.phaseChip, isOn && st.phaseChipOn]} onPress={() => setHeadacheType(type)} activeOpacity={0.7}>
              <AppText style={{fontSize: ms(11), fontWeight: isOn ? '700' : '600', color: isOn ? Colors.white : Colors.textSecondary}}>{type}</AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Current phase */}
      <View style={st.secLabel}>
        <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Current phase</AppText>
        <View style={st.secLine} />
      </View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: ms(6), paddingBottom: vs(2), marginBottom: vs(6)}}>
        {PHASES.map(p => {
          const isOn = phase === p;
          return (
            <TouchableOpacity key={p} style={[st.phaseChip, isOn && st.phaseChipOn]} onPress={() => setPhase(p)} activeOpacity={0.7}>
              <AppText style={{fontSize: ms(11), fontWeight: isOn ? '700' : '600', color: isOn ? Colors.white : Colors.textSecondary}}>{p}</AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Pain location */}
      <View style={st.secLabel}>
        <AppText variant="small" color={Colors.textSecondary} style={st.secText}>Pain location</AppText>
        <View style={st.secLine} />
      </View>
      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(7), marginBottom: vs(10)}}>
        {LOCATIONS.map(loc => {
          const isOn = location === loc.id;
          return (
            <TouchableOpacity key={loc.id} style={[st.locBtn, isOn && st.locBtnOn]} onPress={() => setLocation(loc.id)} activeOpacity={0.7}>
              <Icon family="Ionicons" name={loc.icon} size={ms(20)} color={isOn ? Colors.white : Colors.textSecondary} />
              <AppText style={{fontSize: ms(10), fontWeight: '600', color: isOn ? Colors.white : Colors.textSecondary, marginTop: vs(4)}}>{loc.label}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  tipCard: {backgroundColor: '#f0f4f2', borderRadius: ms(13), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(11), marginBottom: vs(12)},
  tipDot: {width: ms(18), height: ms(18), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center', marginTop: vs(1)},
  secLabel: {flexDirection: 'row', alignItems: 'center', marginTop: vs(4), marginBottom: vs(8)},
  secText: {textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'},
  gadgetCard: {flex: 1, backgroundColor: Colors.white, borderWidth: 0.5, borderColor: '#dde8e2', borderRadius: ms(12), padding: ms(10), alignItems: 'center'},
  timeBox: {backgroundColor: Colors.white, borderWidth: 0.5, borderColor: '#dde8e2', borderRadius: ms(13), padding: ms(13), alignItems: 'center'},
  durationCalc: {flexDirection: 'row', alignItems: 'center', gap: s(8), backgroundColor: '#f0f4f2', borderRadius: ms(10), padding: ms(9), marginBottom: vs(10)},
  painBtn: {flex: 1, paddingVertical: vs(10), borderRadius: ms(10), alignItems: 'center', borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.white},
  painDesc: {borderRadius: ms(10), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(9), marginBottom: vs(10)},
  phaseChip: {paddingHorizontal: s(13), paddingVertical: vs(8), borderRadius: ms(22), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.white},
  phaseChipOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  locBtn: {width: '31%', backgroundColor: Colors.white, borderWidth: 0.5, borderColor: '#dde8e2', borderRadius: ms(12), padding: ms(10), alignItems: 'center'},
  locBtnOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
});

export default MigraineManualView;
