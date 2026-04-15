import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Circle as SvgCircle} from 'react-native-svg';
import Colors from '../../../../constants/colors';
import AppText from '../../../../components/shared/AppText';
import Icon from '../../../../components/shared/Icons';

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const QUICK_LOG = [
  {key: 'mood', name: 'Mood', val: 'Tap to log', icon: 'happy-outline', route: 'Wellbeing'},
  {key: 'kicks', name: 'Kick count', val: 'Tap to log', icon: 'footsteps-outline', route: 'Wellbeing'},
  {key: 'supp', name: 'Supplements', val: 'Tap to log', icon: 'medkit-outline', route: 'Wellbeing'},
  {key: 'bp', name: 'BP today', val: 'Tap to log', icon: 'pulse-outline', route: 'Wellbeing'},
  {key: 'nausea', name: 'Nausea', val: 'Tap to log', icon: 'sad-outline', route: 'Wellbeing'},
  {key: 'tests', name: 'Test results', val: 'Tap to log', icon: 'flask-outline', route: 'Antenatal'},
];

const TOOLS = [
  {key: 'journey', name: 'Journey', sub: 'Week-by-week log', icon: 'map-outline', route: 'Journey'},
  {key: 'antenatal', name: 'Antenatal', sub: 'Visits, scans, tests', icon: 'medkit-outline', route: 'Antenatal'},
  {key: 'wellbeing', name: 'Wellbeing', sub: 'Mood, kicks, vitals', icon: 'heart-outline', route: 'Wellbeing'},
  {key: 'birth', name: 'Birth plan', sub: 'Labour & postpartum', icon: 'flower-outline', route: 'BirthPlan'},
];

const TOTAL_WEEKS = 40;
const RING_SIZE = ms(100);
const VB = 100;
const VB_R = 42;
const VB_SW = 7;
const CIRC = 2 * Math.PI * VB_R;

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const Section = ({title}) => (
  <View style={st.sec}>
    <AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{title}</AppText>
    <View style={st.secLine} />
  </View>
);

const WeekRing = ({week}) => {
  const progress = week / TOTAL_WEEKS;
  return (
    <View style={{width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center'}}>
      <Svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${VB} ${VB}`}>
        <SvgCircle cx={VB / 2} cy={VB / 2} r={VB_R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={VB_SW} />
        <SvgCircle
          cx={VB / 2} cy={VB / 2} r={VB_R} fill="none"
          stroke="rgba(255,255,255,0.5)" strokeWidth={VB_SW}
          strokeDasharray={`${CIRC}`} strokeDashoffset={`${CIRC * (1 - progress)}`}
          strokeLinecap="round" rotation={-90} origin={`${VB / 2},${VB / 2}`}
        />
      </Svg>
      <View style={{position: 'absolute', alignItems: 'center'}}>
        <AppText style={{fontSize: ms(24), fontWeight: '700', color: Colors.white}}>{week}</AppText>
        <AppText variant="subtext" color="rgba(255,255,255,0.5)">weeks</AppText>
        <AppText variant="subtext" color="rgba(255,255,255,0.35)" style={{fontSize: ms(8)}}>of {TOTAL_WEEKS}</AppText>
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const PregnancyLogScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [week, setWeek] = useState(16);
  const trimester = week <= 13 ? 1 : week <= 27 ? 2 : 3;
  const daysElapsed = week * 7;
  const daysToGo = Math.max(0, TOTAL_WEEKS * 7 - daysElapsed);

  const goRoute = (route) => {
    if (route) navigation.navigate(route);
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Fixed Header */}
      <View style={[st.header, {paddingTop: insets.top + vs(10)}]}>
        <View style={st.topRow}>
          <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={{color: Colors.white, fontSize: ms(18), fontWeight: '700'}}>Pregnancy</AppText>
            <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', fontSize: ms(11)}}>Week {week} - Trimester {trimester}</AppText>
          </View>
        </View>
      </View>

      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Hero section */}
        <View style={st.heroBg}>
          {/* Week ring + stepper */}
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(16)}}>
            <WeekRing week={week} />
            <View style={st.babyCard}>
              <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(18)}}>Current week</AppText>
              <AppText variant="subtext" color="rgba(255,255,255,0.55)" style={{marginTop: vs(2)}}>Trimester {trimester} {'-'} Day {daysElapsed}</AppText>
              <View style={st.weekRow}>
                <TouchableOpacity
                  style={st.weekStep}
                  activeOpacity={0.7}
                  onPress={() => setWeek(w => Math.max(1, w - 1))}>
                  <Icon family="Ionicons" name="remove" size={ms(14)} color={Colors.white} />
                </TouchableOpacity>
                <AppText color={Colors.white} style={{fontSize: ms(18), fontWeight: '800'}}>{week}</AppText>
                <TouchableOpacity
                  style={st.weekStep}
                  activeOpacity={0.7}
                  onPress={() => setWeek(w => Math.min(42, w + 1))}>
                  <Icon family="Ionicons" name="add" size={ms(14)} color={Colors.white} />
                </TouchableOpacity>
              </View>
            </View>
          </View>

          {/* Trimester bar */}
          <View style={st.trimBar}>
            {Array.from({length: TOTAL_WEEKS}).map((_, i) => {
              let bg = 'rgba(255,255,255,0.15)';
              if (i < week - 1) bg = 'rgba(255,255,255,0.5)';
              else if (i === week - 1) bg = Colors.white;
              return <View key={i} style={[st.trimSeg, {backgroundColor: bg}]} />;
            })}
          </View>
          <View style={st.trimLabels}>
            <AppText variant="subtext" color="rgba(255,255,255,0.45)">Week 1</AppText>
            <AppText variant="subtext" color="rgba(255,255,255,0.85)" style={{fontWeight: '600'}}>Week {week} - You</AppText>
            <AppText variant="subtext" color="rgba(255,255,255,0.45)">Week {TOTAL_WEEKS}</AppText>
          </View>

          {/* Today strip */}
          <View style={st.todayStrip}>
            {[
              {v: `${daysToGo}`, l: 'Days to go'},
              {v: `T${trimester}`, l: 'Trimester'},
              {v: `${Math.round(progressPct(week))}%`, l: 'Progress'},
            ].map((cell, i) => (
              <View key={i} style={st.tsCell}>
                <AppText variant="bodyBold" color={Colors.white} style={{fontWeight: '800', fontSize: ms(14), lineHeight: ms(16)}}>{cell.v}</AppText>
                <AppText variant="subtext" color="rgba(255,255,255,0.4)" style={{fontSize: ms(7.5), textTransform: 'uppercase', letterSpacing: 0.4, marginTop: vs(2), textAlign: 'center'}}>{cell.l}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Quick log */}
        <Section title="Quick log - today" />
        <View style={st.quickGrid}>
          {QUICK_LOG.map((item) => (
            <TouchableOpacity key={item.key} style={st.qlTile} activeOpacity={0.7} onPress={() => goRoute(item.route)}>
              <Icon family="Ionicons" name={item.icon} size={ms(22)} color={Colors.primary} />
              <AppText variant="subtext" color={Colors.textPrimary} style={{fontWeight: '700', marginTop: vs(5)}}>{item.name}</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{item.val}</AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Pregnancy tools */}
        <Section title="Pregnancy tools" />
        <View style={st.appGrid}>
          {TOOLS.map(tile => (
            <TouchableOpacity key={tile.key} style={st.tile} activeOpacity={0.7} onPress={() => navigation.navigate(tile.route)}>
              <Icon family="Ionicons" name={tile.icon} size={ms(22)} color={Colors.primary} />
              <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginTop: vs(8)}}>{tile.name}</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{tile.sub}</AppText>
            </TouchableOpacity>
          ))}
        </View>

        <View style={{height: vs(40)}} />
      </ScrollView>
    </View>
  );
};

const progressPct = (week) => Math.min(100, (week / TOTAL_WEEKS) * 100);

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(12)},
  topRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(8)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},

  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13)},

  // Hero
  heroBg: {backgroundColor: Colors.primary, marginHorizontal: s(-13), paddingHorizontal: s(16), paddingTop: vs(4), paddingBottom: vs(20), marginBottom: vs(10)},

  babyCard: {flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.18)', borderRadius: ms(16), padding: ms(12)},
  weekRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: vs(10)},
  weekStep: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.3)', alignItems: 'center', justifyContent: 'center'},

  trimBar: {flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden', gap: 1, marginTop: vs(14)},
  trimSeg: {flex: 1, borderRadius: 1},
  trimLabels: {flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(5)},

  todayStrip: {flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: ms(12), overflow: 'hidden', gap: 1, marginTop: vs(14)},
  tsCell: {flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', paddingVertical: vs(9), paddingHorizontal: s(6), alignItems: 'center'},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(12), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#F0DDD8'},

  // Quick grid
  quickGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8), marginBottom: vs(4)},
  qlTile: {width: '31.5%', backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#F0DDD8', padding: ms(12), alignItems: 'center'},

  // App grid
  appGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(9)},
  tile: {width: '48%', backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#F0DDD8', padding: ms(13)},
});

export default PregnancyLogScreen;
