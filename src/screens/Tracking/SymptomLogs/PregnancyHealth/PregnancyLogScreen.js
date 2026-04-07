import React from 'react';
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
  {key: 'mood', name: 'Mood', val: 'Not logged', icon: 'happy-outline', route: 'Wellbeing'},
  {key: 'kicks', name: 'Kick count', val: '0 today', icon: 'footsteps-outline', route: 'Wellbeing'},
  {key: 'supp', name: 'Supplements', val: 'Tap to log', icon: 'medkit-outline', route: 'Wellbeing'},
  {key: 'bp', name: 'BP today', val: 'Not taken', icon: 'pulse-outline', route: 'Wellbeing'},
  {key: 'nausea', name: 'Nausea', val: 'Tap to rate', icon: 'sad-outline', route: 'Wellbeing'},
  {key: 'tests', name: 'Test results', val: '2 pending', icon: 'flask-outline', route: 'Antenatal'},
];

const COMING_UP = [
  {
    week: 'W18', weekBg: '#FDF0F5', weekColor: '#BE185D',
    name: 'Anomaly scan (Level 2)',
    detail: 'Apr 18 - Dr. Suma Rao - Apollo Hospital - 10:30 AM',
    status: '13 days', statusColor: '#F0B429',
  },
  {
    week: 'W24', weekBg: Colors.amberBg, weekColor: '#D97316',
    name: 'OGTT (Glucose challenge test)',
    detail: 'Screen for gestational diabetes - 75g glucose - 2h test',
    status: '8 weeks', statusColor: Colors.textSecondary,
  },
  {
    week: 'W28', weekBg: Colors.purpleBg, weekColor: Colors.purpleText,
    name: 'Rhesus antibody test + Anti-D (if Rh-)',
    detail: 'Blood group check - Vaccination if Rh negative',
    status: '12 weeks', statusColor: Colors.textSecondary,
  },
  {
    week: 'W36', weekBg: Colors.tealBg, weekColor: Colors.tealText,
    name: 'Group B Streptococcus (GBS) swab',
    detail: 'Vaginal swab - determines intrapartum antibiotic need',
    status: '20 weeks', statusColor: Colors.textSecondary,
  },
];

const FOCUS_INSIGHTS = [
  {
    icon: 'volume-medium-outline', iconColor: '#BE185D',
    bg: '#FDF0F5', textColor: '#5A0A2E', borderColor: '#F4A0C8',
    title: 'Baby can now hear your voice.',
    body: ' The inner ear is fully formed. Talking, singing, and playing music are not just nice - they stimulate the auditory system. Your voice has a unique acoustic signature to your baby right now.',
  },
  {
    icon: 'alert-circle-outline', iconColor: Colors.amberDark,
    bg: Colors.amberBg, textColor: Colors.amberDark, borderColor: '#FDDCB5',
    title: 'Iron supplementation is now critical.',
    body: ' Blood volume increases 50% during pregnancy - daily iron (IFA tablets) from Week 14 prevents anaemia and supports placental function. Take with vitamin C (lemon water) and 2 hours away from tea or calcium.',
  },
  {
    icon: 'fitness-outline', iconColor: Colors.tealText,
    bg: Colors.tealBg, textColor: Colors.tealText, borderColor: Colors.paleGreen,
    title: 'Second trimester energy window.',
    body: ' For most women, weeks 14-27 are the most comfortable of pregnancy. Use this window for prenatal exercise, birth preparation classes, and any travel before the third trimester.',
  },
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const Section = ({title}) => (
  <View style={st.sec}>
    <AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{title}</AppText>
    <View style={st.secLine} />
  </View>
);

// Week ring (SVG)
const WEEK = 16;
const TOTAL_WEEKS = 40;
const RING_SIZE = ms(100);
const VB = 100;
const VB_R = 42;
const VB_SW = 7;
const CIRC = 2 * Math.PI * VB_R;
const PROGRESS = WEEK / TOTAL_WEEKS;

const WeekRing = () => (
  <View style={{width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center'}}>
    <Svg width={RING_SIZE} height={RING_SIZE} viewBox={`0 0 ${VB} ${VB}`}>
      <SvgCircle cx={VB / 2} cy={VB / 2} r={VB_R} fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth={VB_SW} />
      <SvgCircle
        cx={VB / 2} cy={VB / 2} r={VB_R} fill="none"
        stroke="rgba(255,255,255,0.5)" strokeWidth={VB_SW}
        strokeDasharray={`${CIRC}`} strokeDashoffset={`${CIRC * (1 - PROGRESS)}`}
        strokeLinecap="round" rotation={-90} origin={`${VB / 2},${VB / 2}`}
      />
    </Svg>
    <View style={{position: 'absolute', alignItems: 'center'}}>
      <AppText style={{fontSize: ms(24), fontWeight: '700', color: Colors.white}}>{WEEK}</AppText>
      <AppText variant="subtext" color="rgba(255,255,255,0.5)">weeks</AppText>
      <AppText variant="subtext" color="rgba(255,255,255,0.35)" style={{fontSize: ms(8)}}>of {TOTAL_WEEKS}</AppText>
    </View>
  </View>
);

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const PregnancyLogScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const goRoute = (route) => {
    if (route) navigation.navigate(route);
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Fixed Header */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topRow}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
            <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
            </TouchableOpacity>
            <AppText variant="body" color="rgba(255,255,255,0.8)">Pregnancy</AppText>
          </View>
          <AppText variant="caption" color="rgba(255,255,255,0.4)" style={{fontWeight: '600'}}>Week 16</AppText>
        </View>
      </View>

      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Hero section */}
        <View style={st.heroBg}>
          <AppText variant="screenName" color={Colors.white} style={{marginBottom: vs(2)}}>Pregnancy</AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.55)" style={{marginBottom: vs(16)}}>Ananya {'-'} Week 16 {'-'} 2nd Trimester</AppText>

          {/* Week ring + baby card */}
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(16)}}>
            <WeekRing />
            <View style={st.babyCard}>
              <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(20)}}>Ananya</AppText>
              <AppText variant="subtext" color="rgba(255,255,255,0.55)" style={{marginTop: vs(2)}}>Week 16 {'-'} 2nd Trimester {'-'} Day 113</AppText>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: s(5), marginTop: vs(8)}}>
                <Icon family="Ionicons" name="leaf-outline" size={ms(12)} color="rgba(255,255,255,0.65)" />
                <AppText variant="subtext" color="rgba(255,255,255,0.65)">Avocado {'-'} ~11.6 cm {'-'} ~100g</AppText>
              </View>
              <AppText variant="subtext" color="rgba(255,255,255,0.65)" style={{marginTop: vs(2)}}>Heart pumping 25 litres/day</AppText>
            </View>
          </View>

          {/* Trimester bar */}
          <View style={st.trimBar}>
            {Array.from({length: 12}).map((_, i) => {
              let bg = 'rgba(255,255,255,0.15)';
              if (i < 4) bg = 'rgba(255,255,255,0.5)';
              else if (i === 4) bg = Colors.white;
              return <View key={i} style={[st.trimSeg, {backgroundColor: bg}]} />;
            })}
          </View>
          <View style={st.trimLabels}>
            <AppText variant="subtext" color="rgba(255,255,255,0.45)">Week 1</AppText>
            <AppText variant="subtext" color="rgba(255,255,255,0.85)" style={{fontWeight: '600'}}>Week 16 - You</AppText>
            <AppText variant="subtext" color="rgba(255,255,255,0.45)">Week 40</AppText>
          </View>

          {/* Today strip */}
          <View style={st.todayStrip}>
            {[
              {v: '167', l: 'Days to go'},
              {v: '24 wk', l: 'Next scan'},
              {v: 'Apr 18', l: 'OB appt'},
              {v: '98%', l: 'Supplement'},
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

        {/* Coming up */}
        <Section title="Coming up" />
        <View style={st.card}>
          {COMING_UP.map((item, i) => (
            <TouchableOpacity
              key={i}
              style={[st.milestoneRow, i === COMING_UP.length - 1 && {borderBottomWidth: 0}]}
              activeOpacity={0.7}
              onPress={() => navigation.navigate('Antenatal')}>
              <View style={[st.msWeek, {backgroundColor: item.weekBg}]}>
                <AppText variant="subtext" color={item.weekColor} style={{fontWeight: '700'}}>{item.week}</AppText>
              </View>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold" color={Colors.textPrimary}>{item.name}</AppText>
                <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(1)}}>{item.detail}</AppText>
              </View>
              <AppText variant="subtext" color={item.statusColor} style={{fontWeight: '700'}}>{item.status}</AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Week 16 focus */}
        <Section title="Week 16 focus" />
        {FOCUS_INSIGHTS.map((insight, i) => (
          <View key={i} style={[st.insight, {backgroundColor: insight.bg, borderColor: insight.borderColor}]}>
            <Icon family="Ionicons" name={insight.icon} size={ms(16)} color={insight.iconColor} />
            <AppText variant="caption" color={insight.textColor} style={{flex: 1, lineHeight: ms(17)}}>
              <AppText style={{fontWeight: '700'}}>{insight.title}</AppText>{insight.body}
            </AppText>
          </View>
        ))}

        {/* Quick navigation tiles to sub-screens */}
        <Section title="Pregnancy tools" />
        <View style={st.appGrid}>
          {[
            {key: 'journey', name: 'Journey', sub: 'Week-by-week timeline', icon: 'map-outline', route: 'Journey'},
            {key: 'antenatal', name: 'Antenatal', sub: 'Visits, scans, tests', icon: 'medkit-outline', route: 'Antenatal'},
            {key: 'wellbeing', name: 'Wellbeing', sub: 'Mood, kicks, vitals, EPDS', icon: 'heart-outline', route: 'Wellbeing'},
            {key: 'birth', name: 'Birth plan', sub: 'Labour & postpartum', icon: 'flower-outline', route: 'BirthPlan'},
          ].map(tile => (
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

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(8)},
  topRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(8)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},

  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13)},

  // Hero
  heroBg: {backgroundColor: Colors.primary, marginHorizontal: s(-13), paddingHorizontal: s(16), paddingTop: vs(4), paddingBottom: vs(20), marginBottom: vs(10)},

  babyCard: {flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.18)', borderRadius: ms(16), padding: ms(12)},

  trimBar: {flexDirection: 'row', height: 6, borderRadius: 3, overflow: 'hidden', gap: 2, marginTop: vs(14)},
  trimSeg: {flex: 1, borderRadius: 2},
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

  // Card
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#F0DDD8', overflow: 'hidden', marginBottom: vs(8)},

  // Milestone row
  milestoneRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), padding: ms(11), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#FDF0F5'},
  msWeek: {width: ms(34), height: ms(34), borderRadius: ms(11), alignItems: 'center', justifyContent: 'center'},

  // Insight
  insight: {borderRadius: ms(11), borderWidth: 1, padding: ms(10), marginBottom: vs(8), flexDirection: 'row', alignItems: 'flex-start', gap: s(8)},

  // App grid
  appGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(9)},
  tile: {width: '48%', backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#F0DDD8', padding: ms(13)},
});

export default PregnancyLogScreen;
