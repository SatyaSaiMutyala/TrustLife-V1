import React from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../../constants/colors';
import AppText from '../../../../components/shared/AppText';
import Icon from '../../../../components/shared/Icons';

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const TILES = [
  {
    key: 'growth', name: 'Growth monitor', icon: 'analytics-outline',
    status: '3.82 kg - 53.1 cm\n50th percentile weight',
    badge: 'On track', badgeBg: Colors.tealBg, badgeColor: Colors.tealText,
    barColor: Colors.primary, route: 'GrowthMonitor',
  },
  {
    key: 'feed', name: 'Feeding tracker', icon: 'restaurant-outline',
    status: '6 feeds today\nLast feed: 2h 14m ago',
    badge: 'Good frequency', badgeBg: Colors.tealBg, badgeColor: Colors.tealText,
    barColor: '#D97316', route: 'FeedingTracker',
  },
  {
    key: 'sleep', name: 'Sleep tracker', icon: 'moon-outline',
    status: '14.5h total - 2 naps\nLast wake: 45 min ago',
    badge: 'Age appropriate', badgeBg: Colors.tealBg, badgeColor: Colors.tealText,
    barColor: '#2A5FA0', route: 'BabySleepTracker',
  },
  {
    key: 'neo', name: 'Neonatal record', icon: 'happy-outline',
    status: 'APGAR 9 - Birth 3.1 kg\nNewborn screens \u2713',
    badge: 'All screens done', badgeBg: Colors.tealBg, badgeColor: Colors.tealText,
    barColor: Colors.accent, route: 'NeonatalRecord',
  },
];

const NAPPY_TILE = {
  key: 'nappy', name: 'Nappy output log', icon: 'water-outline',
  status: '8 wet - 2 stools today - Breastfed yellow - Adequate hydration',
  badge: 'Good output', badgeBg: Colors.tealBg, badgeColor: Colors.tealText,
  barColor: '#A16207', route: 'NappyOutput',
};

const TIMELINE = [
  {time: '09:00', color: '#D97316', text: 'Feed - Breastfeed L 18min, R 14min'},
  {time: '09:35', color: '#A16207', text: 'Nappy - Wet + stool (yellow, seedy)'},
  {time: '10:00', color: '#2A5FA0', text: 'Nap - Morning nap 1h 45m - Easy settle'},
  {time: '11:50', color: '#D97316', text: 'Feed - Breastfeed L 20min, R 12min'},
  {time: 'Now', color: Colors.primary, text: 'Awake - Feed due in ~1h', isNow: true},
];

const NEXT_ACTIONS = [
  {
    icon: 'time-outline', iconColor: Colors.primary,
    bg: Colors.tealBg, textColor: Colors.tealText, borderColor: Colors.paleGreen,
    title: 'Feed window open.',
    body: " Last feed 2h 14m ago. Zara's average feeding interval is 2-3h. Watch for hunger cues: rooting, fist-to-mouth, turning head.",
  },
  {
    icon: 'medkit-outline', iconColor: Colors.tealText,
    bg: Colors.tealBg, textColor: Colors.tealText, borderColor: Colors.paleGreen,
    title: '6-week growth check due.',
    body: ' Paediatrician visit at 6 weeks (Dr. Preethi Rao, KIMS) should include weight, length, head circumference, and developmental check. Log the visit in Growth Monitor.',
  },
  {
    icon: 'shield-checkmark-outline', iconColor: Colors.amberDark,
    bg: Colors.amberBg, textColor: Colors.amberDark, borderColor: '#FDDCB5',
    title: '6-week vaccines due soon.',
    body: ' DTwP/Hib/HepB (Pentavalent), Rotavirus Dose 1, PCV Dose 1 - all due at 6 weeks per IAP 2024. Book with Vaccination log.',
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

const AppTile = ({tile, fullWidth, onPress}) => (
  <TouchableOpacity
    style={[st.tile, fullWidth && {width: '100%'}]}
    activeOpacity={0.7}
    onPress={onPress}>
    <View style={[st.tileBar, {backgroundColor: tile.barColor}]} />
    <View style={st.tileIconWrap}>
      <Icon family="Ionicons" name={tile.icon} size={ms(22)} color={tile.barColor} />
    </View>
    <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginBottom: vs(3)}}>{tile.name}</AppText>
    <AppText variant="small" color={Colors.textSecondary} style={{lineHeight: ms(14)}}>{tile.status}</AppText>
    <View style={[st.tileBadge, {backgroundColor: tile.badgeBg}]}>
      <AppText variant="subtext" color={tile.badgeColor} style={{fontWeight: '700'}}>{tile.badge}</AppText>
    </View>
  </TouchableOpacity>
);

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const NeonatalLogScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const goTile = (route) => {
    if (route) navigation.navigate(route);
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Fixed Header (back arrow only) ── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topRow}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
            <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <AppText variant="screenName" style={{color: Colors.white, fontSize: ms(18), fontWeight: '700'}}>Baby health</AppText>
              <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', fontSize: ms(11)}}>Day 44</AppText>
            </View>
          </View>
        </View>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Hero header section (green bg) */}
        <View style={st.heroBg}>

          {/* Baby card hero */}
          <View style={st.babyCard}>
            <View style={st.babyAvatar}>
              <Icon family="Ionicons" name="happy-outline" size={ms(28)} color={Colors.white} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(18)}}>Baby Zara</AppText>
              <AppText variant="subtext" color="rgba(255,255,255,0.55)">44 days {'-'} 6 weeks 2 days {'-'} Born 20 Feb 2026</AppText>
              <View style={st.babyStatsRow}>
                {[
                  {v: '3.82', l: 'kg - weight'},
                  {v: '53.1', l: 'cm - length'},
                  {v: '36.5', l: 'cm - HC'},
                ].map((stat, i) => (
                  <View key={i} style={{alignItems: 'center'}}>
                    <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(15)}}>{stat.v}</AppText>
                    <AppText variant="subtext" color="rgba(255,255,255,0.4)" style={{fontSize: ms(8), textTransform: 'uppercase', letterSpacing: 0.4, marginTop: vs(1)}}>{stat.l}</AppText>
                  </View>
                ))}
              </View>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <AppText variant="caption" color={Colors.paleGreen} style={{fontWeight: '700'}}>Normal</AppText>
              <AppText variant="subtext" color="rgba(255,255,255,0.4)" style={{marginTop: vs(2)}}>all growth</AppText>
            </View>
          </View>

          {/* Today strip */}
          <View style={st.todayStrip}>
            {[
              {v: '6', l: 'Feeds today'},
              {v: '14.5h', l: 'Sleep / 24h'},
              {v: '8', l: 'Diapers'},
              {v: '2', l: 'Stools'},
            ].map((cell, i) => (
              <View key={i} style={st.tsCell}>
                <AppText variant="bodyBold" color={Colors.white} style={{fontWeight: '800', fontSize: ms(17), lineHeight: ms(20)}}>{cell.v}</AppText>
                <AppText variant="subtext" color="rgba(255,255,255,0.4)" style={{fontSize: ms(7.5), textTransform: 'uppercase', letterSpacing: 0.5, marginTop: vs(2), textAlign: 'center'}}>{cell.l}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* App grid */}
        <Section title="Baby health apps - Phase 1" />
        <View style={st.appGrid}>
          {TILES.map((tile) => (
            <AppTile key={tile.key} tile={tile} onPress={() => goTile(tile.route)} />
          ))}
          <AppTile tile={NAPPY_TILE} fullWidth onPress={() => goTile(NAPPY_TILE.route)} />
        </View>

        {/* Today's timeline */}
        <Section title="Today's timeline" />
        <View style={st.card}>
          {TIMELINE.map((item, i) => (
            <View key={i} style={[st.timelineRow, i === TIMELINE.length - 1 && {borderBottomWidth: 0}]}>
              <AppText variant="subtext" color={Colors.textSecondary} style={{width: ms(38), fontSize: ms(9)}}>{item.time}</AppText>
              <View style={[st.timelineDot, {backgroundColor: item.color}]} />
              <AppText variant="caption" color={item.isNow ? Colors.primary : Colors.textPrimary} style={{flex: 1, fontWeight: item.isNow ? '600' : '400'}}>{item.text}</AppText>
            </View>
          ))}
        </View>

        {/* Next actions */}
        <Section title="Next actions" />
        {NEXT_ACTIONS.map((action, i) => (
          <View key={i} style={[st.insight, {backgroundColor: action.bg, borderColor: action.borderColor}]}>
            <Icon family="Ionicons" name={action.icon} size={ms(16)} color={action.iconColor} />
            <AppText variant="caption" color={action.textColor} style={{flex: 1, lineHeight: ms(17)}}>
              <AppText style={{fontWeight: '700'}}>{action.title}</AppText>{action.body}
            </AppText>
          </View>
        ))}

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

  // Header (fixed)
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(8)},
  topRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(8)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13)},

  // Hero (scrollable, green bg)
  heroBg: {backgroundColor: Colors.primary, marginHorizontal: s(-13), paddingHorizontal: s(16), paddingTop: vs(4), paddingBottom: vs(16), marginBottom: vs(10)},

  babyCard: {backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.18)', borderRadius: ms(18), padding: ms(14), flexDirection: 'row', alignItems: 'center', gap: s(14), marginBottom: vs(12)},
  babyAvatar: {width: ms(52), height: ms(52), borderRadius: ms(16), backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center'},
  babyStatsRow: {flexDirection: 'row', gap: s(14), marginTop: vs(8)},

  todayStrip: {flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: ms(12), overflow: 'hidden', gap: 1},
  tsCell: {flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', paddingVertical: vs(10), paddingHorizontal: s(8), alignItems: 'center'},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(12), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // App grid
  appGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(9)},
  tile: {width: '48%', backgroundColor: Colors.white, borderRadius: ms(17), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(13), paddingTop: ms(16), overflow: 'hidden'},
  tileBar: {position: 'absolute', top: 0, left: 0, right: 0, height: 3},
  tileIconWrap: {marginBottom: vs(8)},
  tileBadge: {alignSelf: 'flex-start', paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(8), marginTop: vs(5)},

  // Card
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(11), marginBottom: vs(8)},

  // Timeline
  timelineRow: {flexDirection: 'row', alignItems: 'flex-start', paddingVertical: vs(7), gap: s(10), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F5F0FF'},
  timelineDot: {width: ms(8), height: ms(8), borderRadius: ms(4), marginTop: vs(4)},

  // Insight
  insight: {borderRadius: ms(11), borderWidth: 1, padding: ms(10), marginBottom: vs(8), flexDirection: 'row', alignItems: 'flex-start', gap: s(8)},
});

export default NeonatalLogScreen;
