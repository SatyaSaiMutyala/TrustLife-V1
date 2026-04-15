import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Platform} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../../constants/colors';
import AppText from '../../../../components/shared/AppText';
import Icon from '../../../../components/shared/Icons';

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const INITIAL_UPPER = [
  {label: 'L', state: 'erupted'},
  {label: 'C', state: 'erupted'},
  {label: 'K', state: 'erupting'},
  {label: 'M1', state: 'not'},
  {label: 'M2', state: 'not'},
  {label: 'M2', state: 'not'},
  {label: 'M1', state: 'not'},
  {label: 'K', state: 'not'},
  {label: 'C', state: 'erupted'},
  {label: 'L', state: 'erupted'},
];

const INITIAL_LOWER = [
  {label: 'L', state: 'erupted'},
  {label: 'C', state: 'erupted'},
  {label: 'K', state: 'not'},
  {label: 'M1', state: 'not'},
  {label: 'M2', state: 'not'},
  {label: 'M2', state: 'not'},
  {label: 'M1', state: 'not'},
  {label: 'K', state: 'not'},
  {label: 'C', state: 'erupted'},
  {label: 'L', state: 'erupted'},
];

const NEXT_STATE = {not: 'erupting', erupting: 'erupted', erupted: 'not'};

const PASTE_OPTS = ['Smear (rice grain)', 'Pea-sized', 'Adult amount'];
const QUALITY_OPTS = ['Quick', 'Good', 'Thorough (2+ min)'];
const HELPER_OPTS = ['Self', 'Parent', 'Supervised'];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const Section = ({title}) => (
  <View style={st.sec}>
    <AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{title}</AppText>
    <View style={st.secLine} />
  </View>
);

const Tooth = ({label, state, onPress}) => {
  let bg = 'rgba(255,255,255,0.12)';
  let color = 'rgba(255,255,255,0.55)';
  if (state === 'erupted') {
    bg = Colors.white;
    color = Colors.primary;
  } else if (state === 'erupting') {
    bg = '#F59E0B';
    color = Colors.white;
  }
  return (
    <TouchableOpacity
      style={[st.tooth, {backgroundColor: bg}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <AppText variant="subtext" color={color} style={{fontSize: ms(8), fontWeight: '700'}}>{label}</AppText>
    </TouchableOpacity>
  );
};

const ChipRow = ({items, selected, onSelect}) => (
  <View style={st.chipWrap}>
    {items.map((item, i) => {
      const isOn = selected === i;
      return (
        <TouchableOpacity
          key={i}
          style={[st.mchip, isOn && st.mchipOn]}
          onPress={() => onSelect(i)}
          activeOpacity={0.7}>
          <AppText
            variant="caption"
            color={isOn ? Colors.primary : '#555'}
            style={{fontWeight: isOn ? '700' : '500'}}>
            {item}
          </AppText>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const DentalTrackerScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [upper, setUpper] = useState(INITIAL_UPPER);
  const [lower, setLower] = useState(INITIAL_LOWER);

  const [morningLogged, setMorningLogged] = useState(false);
  const [eveningLogged, setEveningLogged] = useState(false);
  const [duration, setDuration] = useState(2);
  const [paste, setPaste] = useState(0);
  const [quality, setQuality] = useState(1);
  const [helper, setHelper] = useState(2);
  const [flossed, setFlossed] = useState(false);

  const cycleTooth = (rowSetter, idx) => {
    rowSetter(prev => prev.map((t, i) => i === idx ? {...t, state: NEXT_STATE[t.state]} : t));
  };

  const counts = [...upper, ...lower].reduce((acc, t) => {
    acc[t.state] = (acc[t.state] || 0) + 1;
    return acc;
  }, {});

  const sessionCount = (morningLogged ? 1 : 0) + (eveningLogged ? 1 : 0);

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
            <AppText variant="screenName" style={{color: Colors.white, fontSize: ms(18), fontWeight: '700'}}>Dental tracker</AppText>
            <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', fontSize: ms(11)}}>Aarav - 9y 2m</AppText>
          </View>
        </View>
      </View>

      {/* ── BODY ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Mouth map - tap to log */}
        <View style={st.mouthCard}>
          <AppText variant="subtext" color="rgba(255,255,255,0.65)" style={st.mouthSub}>Upper (maxillary)</AppText>
          <View style={st.toothRow}>
            {upper.map((t, i) => (
              <Tooth key={`u${i}`} label={t.label} state={t.state} onPress={() => cycleTooth(setUpper, i)} />
            ))}
          </View>
          <View style={st.mouthDivider} />
          <View style={st.toothRow}>
            {lower.map((t, i) => (
              <Tooth key={`l${i}`} label={t.label} state={t.state} onPress={() => cycleTooth(setLower, i)} />
            ))}
          </View>
          <AppText variant="subtext" color="rgba(255,255,255,0.65)" style={[st.mouthSub, {marginTop: vs(8)}]}>Lower (mandibular) · tap a tooth to cycle state</AppText>

          <View style={st.legendRow}>
            <View style={st.legendItem}>
              <View style={[st.legendDot, {backgroundColor: Colors.white}]} />
              <AppText variant="subtext" color="rgba(255,255,255,0.8)" style={{fontSize: ms(9)}}>Erupted ({counts.erupted || 0})</AppText>
            </View>
            <View style={st.legendItem}>
              <View style={[st.legendDot, {backgroundColor: '#F59E0B'}]} />
              <AppText variant="subtext" color="rgba(255,255,255,0.8)" style={{fontSize: ms(9)}}>Erupting ({counts.erupting || 0})</AppText>
            </View>
            <View style={st.legendItem}>
              <View style={[st.legendDot, {backgroundColor: 'rgba(255,255,255,0.25)'}]} />
              <AppText variant="subtext" color="rgba(255,255,255,0.8)" style={{fontSize: ms(9)}}>Not yet ({counts.not || 0})</AppText>
            </View>
          </View>
        </View>

        {/* Brushing sessions */}
        <Section title="Today's brushing sessions" />
        <View style={st.card}>
          <View style={st.brushSession}>
            <View style={st.sessIcon}>
              <Icon family="Ionicons" name="sunny-outline" size={ms(18)} color={Colors.primary} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>Morning brush</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(9)}}>Tap to mark complete</AppText>
            </View>
            <TouchableOpacity
              style={[st.checkBtn, morningLogged ? {backgroundColor: '#16A34A'} : st.checkBtnEmpty]}
              onPress={() => setMorningLogged(!morningLogged)}
              activeOpacity={0.7}>
              {morningLogged && <Icon family="Ionicons" name="checkmark" size={ms(16)} color={Colors.white} />}
            </TouchableOpacity>
          </View>
          <View style={[st.brushSession, {borderBottomWidth: 0}]}>
            <View style={st.sessIcon}>
              <Icon family="Ionicons" name="moon-outline" size={ms(18)} color={Colors.primary} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>Evening brush</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(9)}}>Before bed - no eating after</AppText>
            </View>
            <TouchableOpacity
              style={[st.checkBtn, eveningLogged ? {backgroundColor: '#16A34A'} : st.checkBtnEmpty]}
              onPress={() => setEveningLogged(!eveningLogged)}
              activeOpacity={0.7}>
              {eveningLogged && <Icon family="Ionicons" name="checkmark" size={ms(16)} color={Colors.white} />}
            </TouchableOpacity>
          </View>
        </View>

        {/* Duration stepper */}
        <Section title="Duration" />
        <View style={st.card}>
          <View style={st.stepperRow}>
            <TouchableOpacity
              style={st.stepBtn}
              activeOpacity={0.7}
              onPress={() => setDuration(d => Math.max(0, d - 1))}>
              <Icon family="Ionicons" name="remove" size={ms(16)} color={Colors.primary} />
            </TouchableOpacity>
            <View style={{alignItems: 'center', flex: 1}}>
              <AppText color={Colors.primary} style={{fontSize: ms(28), fontWeight: '800'}}>{duration}</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(10)}}>minutes</AppText>
            </View>
            <TouchableOpacity
              style={st.stepBtn}
              activeOpacity={0.7}
              onPress={() => setDuration(d => d + 1)}>
              <Icon family="Ionicons" name="add" size={ms(16)} color={Colors.primary} />
            </TouchableOpacity>
          </View>
        </View>

        {/* Toothpaste amount */}
        <Section title="Toothpaste amount" />
        <View style={st.card}>
          <ChipRow items={PASTE_OPTS} selected={paste} onSelect={setPaste} />
        </View>

        {/* Brushing quality */}
        <Section title="Brushing quality" />
        <View style={st.card}>
          <ChipRow items={QUALITY_OPTS} selected={quality} onSelect={setQuality} />
        </View>

        {/* Who brushed */}
        <Section title="Who brushed" />
        <View style={st.card}>
          <ChipRow items={HELPER_OPTS} selected={helper} onSelect={setHelper} />
        </View>

        {/* Flossed */}
        <Section title="Flossed?" />
        <View style={st.card}>
          <View style={st.brushSession}>
            <View style={st.sessIcon}>
              <Icon family="Ionicons" name="git-branch-outline" size={ms(18)} color={Colors.primary} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>Flossing</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(9)}}>Tap to mark complete</AppText>
            </View>
            <TouchableOpacity
              style={[st.checkBtn, flossed ? {backgroundColor: '#16A34A'} : st.checkBtnEmpty]}
              onPress={() => setFlossed(!flossed)}
              activeOpacity={0.7}>
              {flossed && <Icon family="Ionicons" name="checkmark" size={ms(16)} color={Colors.white} />}
            </TouchableOpacity>
          </View>
        </View>

        <View style={{height: vs(20)}} />
      </ScrollView>

      {/* ── Sticky Save Bar ── */}
      <View style={st.bottomBar}>
        <TouchableOpacity style={st.primaryButton} activeOpacity={0.85}>
          <Icon family="Ionicons" name="save-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
            Save dental log {'\u00b7'} {sessionCount} session{sessionCount === 1 ? '' : 's'}
          </AppText>
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
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(12)},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7), fontSize: ms(9)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Card
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(11), marginBottom: vs(4)},

  // Mouth
  mouthCard: {backgroundColor: Colors.primary, borderRadius: ms(16), padding: ms(14)},
  mouthSub: {fontSize: ms(9), textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '700', marginBottom: vs(6)},
  toothRow: {flexDirection: 'row', justifyContent: 'space-between', gap: s(3)},
  tooth: {flex: 1, aspectRatio: 0.85, borderRadius: ms(6), alignItems: 'center', justifyContent: 'center', minHeight: ms(24)},
  mouthDivider: {height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.25)', marginVertical: vs(10)},
  legendRow: {flexDirection: 'row', justifyContent: 'space-around', marginTop: vs(10), paddingTop: vs(10), borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.15)'},
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: s(4)},
  legendDot: {width: ms(8), height: ms(8), borderRadius: ms(4)},

  // Brush session
  brushSession: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(8), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F5F0FF'},
  sessIcon: {width: ms(34), height: ms(34), borderRadius: ms(10), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center'},
  checkBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), alignItems: 'center', justifyContent: 'center'},
  checkBtnEmpty: {borderWidth: 1.5, borderColor: '#D1D5DB', backgroundColor: 'transparent'},

  // Stepper
  stepperRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  stepBtn: {width: ms(36), height: ms(36), borderRadius: ms(18), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center'},

  // Chips
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(5)},
  mchip: {paddingHorizontal: s(11), paddingVertical: vs(7), borderRadius: ms(20), borderWidth: 0.5, borderColor: '#E5DDD3', backgroundColor: '#fff'},
  mchipOn: {backgroundColor: '#F4F3FF', borderColor: Colors.primary},

  // Bottom
  bottomBar: {backgroundColor: Colors.white, paddingHorizontal: s(13), paddingTop: vs(8), paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10), borderTopWidth: 0.5, borderTopColor: '#d1d5db'},
  primaryButton: {flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: vs(13), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
});

export default DentalTrackerScreen;
