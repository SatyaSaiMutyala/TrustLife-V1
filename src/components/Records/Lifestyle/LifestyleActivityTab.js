import React from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';
const BG_SECONDARY = Colors.backgroundSecondary || '#f5f5f5';

const calendarDays = [
  {day: 'M', date: 17},
  {day: 'T', date: 18},
  {day: 'W', date: 19},
  {day: 'T', date: 20},
  {day: 'F', date: 21},
  {day: 'S', date: 22},
  {day: 'S', date: 23},
  {day: 'M', date: 24, active: true},
  {day: 'T', date: 25},
  {day: 'W', date: 26},
];

const months = ['Jan', 'Feb', 'Mar'];

const heroMetrics = [
  {label: 'Steps', value: '8,240', target: '/ 10,000', pct: 82, barColor: Colors.teal},
  {label: 'Active min', value: '42', target: null, pct: 70, barColor: Colors.teal},
  {label: 'km walked', value: '5.8', target: null, pct: 72, barColor: Colors.amber},
];

const hrZones = [
  {label: 'Rest', color: Colors.blue, flex: 8},
  {label: 'Fat burn', color: Colors.lightGreen, flex: 5},
  {label: 'Cardio', color: Colors.teal, flex: 3},
  {label: 'Peak', color: Colors.primary, flex: 1},
];

const hrDetails = [
  {label: 'Resting', time: '9h 12m'},
  {label: 'Fat burn', time: '28m'},
  {label: 'Cardio', time: '12m'},
  {label: 'Peak', time: '2m'},
];

const activityBreakdown = [
  {
    title: 'Morning walk',
    time: '7:50 AM',
    icon: 'walk-outline',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    detail: '22 min \u00B7 2,400 steps \u00B7 1.7 km',
    status: 'Done',
    statusColor: Colors.tealText,
    statusBg: Colors.tealBg,
  },
  {
    title: 'Office steps',
    time: null,
    icon: 'business-outline',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    detail: '4,800 steps \u00B7 Stairs x6 flights',
    status: 'Active',
    statusColor: Colors.tealText,
    statusBg: Colors.tealBg,
  },
  {
    title: 'Post-dinner walk',
    time: null,
    icon: 'restaurant-outline',
    iconBg: BG_SECONDARY,
    iconColor: Colors.textTertiary,
    detail: 'Target: 20 min after dinner',
    status: 'Pending',
    statusColor: Colors.tealText,
    statusBg: Colors.tealBg,
  },
];

const hydrationBars = [
  {height: 0.6, color: Colors.teal},
  {height: 0.8, color: Colors.teal},
  {height: 0.45, color: Colors.blue},
  {height: 0.7, color: Colors.teal},
  {height: 0.35, color: Colors.blue},
];

// Monthly data
const monthlyStats = [
  {label: 'Avg steps', value: '8,240', bg: Colors.tealBg, color: Colors.tealText},
  {label: 'Avg active min', value: '38m', bg: Colors.tealBg, color: Colors.tealText},
  {label: 'Hydration', value: '56%', bg: Colors.amberBg, color: Colors.amberText},
  {label: 'Dinner walks', value: '8', bg: Colors.tealBg, color: Colors.tealText},
];

// Steps heatmap: March 2026 calendar grid (matches HTML)
const heatmapData = [
  // Row 1 (6 empty + day 1)
  {day: null}, {day: null}, {day: null}, {day: null}, {day: null}, {day: null}, {day: 1, steps: '8.2k', c: 'amber'},
  // Row 2
  {day: 2, steps: '10.1k', c: 'green'}, {day: 3, steps: '11.2k', c: 'green'}, {day: 4, steps: '9.1k', c: 'amber'}, {day: 5, steps: '8.8k', c: 'amber'}, {day: 6, steps: '5.2k', c: 'red'}, {day: 7, steps: '7.4k', c: 'amber'},
  // Row 3
  {day: 8, steps: '6.1k', c: 'red'}, {day: 9, steps: '8.0k', c: 'amber'}, {day: 10, steps: '7.9k', c: 'amber'}, {day: 11, steps: '8.4k', c: 'amber'}, {day: 12, steps: '10.2k', c: 'green'}, {day: 13, steps: '12.1k', c: 'green'}, {day: 14, steps: '13.4k', c: 'green'},
  // Row 4
  {day: 15, steps: '7.8k', c: 'amber'}, {day: 16, steps: '8.1k', c: 'amber'}, {day: 17, steps: '8.6k', c: 'amber'}, {day: 18, steps: '10.0k', c: 'green'}, {day: 19, steps: '11.8k', c: 'green'}, {day: 20, steps: '6.4k', c: 'red'}, {day: 21, steps: '14.2k', c: 'green'},
  // Row 5
  {day: 22, steps: '9.2k', c: 'amber'}, {day: 23, steps: '8.8k', c: 'amber'}, {day: 24, steps: '8.2k', c: 'amber'},
];

const weeklyTrend = [
  {label: 'Week 1', value: '8,960', color: Colors.tealText, barColor: Colors.teal, pct: 90},
  {label: 'Week 2', value: '9,100', color: Colors.tealText, barColor: Colors.teal, pct: 91},
  {label: 'Week 3', value: '8,810', color: Colors.tealText, barColor: Colors.teal, pct: 88},
  {label: 'Week 4', value: '8,730', color: Colors.amberText, barColor: Colors.amber, pct: 87},
];

const clinicalImpact = [
  {label: 'Fasting glucose walk days', pct: 54, color: Colors.tealText, barColor: Colors.teal, value: '7.4 mmol'},
  {label: 'Fasting glucose no walk', pct: 75, color: Colors.redText, barColor: Colors.red, value: '8.9 mmol'},
  {label: 'HRV walk days', pct: 58, color: Colors.tealText, barColor: Colors.teal, value: '52ms'},
  {label: 'Sleep quality walk days', pct: 72, color: Colors.tealText, barColor: Colors.teal, value: '78 score'},
];


const ACT_BAR_COLORS = {
  high: Colors.accent,
  medium: Colors.amber,
  low: Colors.red,
};

const a = (type, icon, iconBg, iconColor, time, duration, steps, distance, kcal, zone, note) => ({
  type, icon, iconBg, iconColor, time, duration, steps, distance, kcal, zone, note,
});

const ACTIVITY_RECORDS = [
  {date: 'Today - 24 Mar 2026', total: '8,240 steps - 5.8 km - 42 active min', level: 'high', activities: [
    a('Brisk walk', 'walk-outline', Colors.tealBg, Colors.tealText, '7:50 AM', '22 min', '2,400', '1.7 km', 140, 'Aerobic', 'MET 4.5 - Zone 2-3 HR'),
    a('Stair climb', 'trending-up-outline', Colors.amberBg, Colors.amberText, '10:30 AM', '8 min', '960', '—', 85, 'Threshold', '6 flights at office'),
    a('Leisure walk', 'walk-outline', '#EAF3DE', '#4A7C23', '1:40 PM', '10 min', '1,040', '0.8 km', 55, 'Easy', 'Post-lunch - glucose dropped 18 mg/dL'),
    a('Power walk', 'walk-outline', Colors.tealBg, Colors.tealText, '6:30 PM', '20 min', '2,200', '1.6 km', 130, 'Aerobic', 'Post-dinner walk target hit'),
  ]},
  {date: 'Yesterday - 23 Mar 2026', total: '10,120 steps - 7.1 km - 55 active min', level: 'high', activities: [
    a('Brisk walk', 'walk-outline', Colors.tealBg, Colors.tealText, '6:45 AM', '35 min', '3,800', '2.8 km', 210, 'Aerobic', 'Best walk this week - 5:30 AM alarm'),
    a('Light jog', 'fitness-outline', Colors.blueBg, Colors.blueText, '7:20 AM', '8 min', '1,100', '0.9 km', 95, 'Threshold', 'Last 8 min of morning session'),
    a('Stair climb', 'trending-up-outline', Colors.amberBg, Colors.amberText, '11:00 AM', '5 min', '600', '—', 55, 'Threshold', '4 flights'),
    a('Leisure walk', 'walk-outline', '#EAF3DE', '#4A7C23', '8:30 PM', '20 min', '2,120', '1.4 km', 95, 'Easy', 'Glucose dropped 22 mg/dL after dinner'),
  ]},
  {date: '22 Mar 2026 - Saturday', total: '12,600 steps - 9.4 km - 68 active min', level: 'high', activities: [
    a('Hiking', 'trail-sign-outline', '#EAF3DE', '#4A7C23', '7:00 AM', '55 min', '7,400', '5.5 km', 380, 'Aerobic', 'KBR Park trail - MET 5.8'),
    a('Cycling', 'bicycle-outline', Colors.amberBg, Colors.amberText, '5:30 PM', '25 min', '—', '6.2 km', 220, 'Aerobic', 'Evening ride around Hussain Sagar'),
    a('Leisure walk', 'walk-outline', Colors.tealBg, Colors.tealText, '8:45 PM', '15 min', '1,600', '1.1 km', 65, 'Easy', 'Post-dinner cooldown'),
  ]},
  {date: '21 Mar 2026 - Friday', total: '11,800 steps - 8.2 km - 62 active min', level: 'high', activities: [
    a('Brisk walk', 'walk-outline', Colors.tealBg, Colors.tealText, '6:30 AM', '40 min', '4,200', '3.1 km', 240, 'Aerobic', 'Longest walk this week'),
    a('Stair climb', 'trending-up-outline', Colors.amberBg, Colors.amberText, 'Office hours', null, '1,200', '—', 110, 'Threshold', '8 flights throughout the day'),
    a('Zumba', 'musical-notes-outline', '#FCE4EC', '#C62828', '7:00 PM', '30 min', '3,400', '—', 250, 'Cardio', 'Community class - MET 6.5'),
    a('Leisure walk', 'walk-outline', '#EAF3DE', '#4A7C23', '8:15 PM', '15 min', '1,600', '1.1 km', 65, 'Easy', null),
  ]},
  {date: '20 Mar 2026 - Thursday', total: '5,200 steps - 3.5 km - 18 active min', level: 'low', activities: [
    a('Leisure walk', 'walk-outline', Colors.redBg, Colors.redText, '1:15 PM', '12 min', '1,200', '0.9 km', 50, 'Easy', 'Only walk today - back pain'),
    a('Elliptical', 'sync-outline', Colors.blueBg, Colors.blueText, '9:00 PM', '15 min', '1,800', '—', 90, 'Easy', 'Low impact due to back - MET 5.5'),
  ]},
  {date: '19 Mar 2026 - Wednesday', total: '9,800 steps - 6.9 km - 48 active min', level: 'high', activities: [
    a('Brisk walk', 'walk-outline', Colors.tealBg, Colors.tealText, '7:00 AM', '30 min', '3,200', '2.3 km', 175, 'Aerobic', null),
    a('Swimming', 'water-outline', Colors.blueBg, Colors.blueText, '6:00 PM', '25 min', '—', '0.8 km', 190, 'Aerobic', 'Lap pool - MET 6.0 - great for recovery'),
    a('Leisure walk', 'walk-outline', '#EAF3DE', '#4A7C23', '8:20 PM', '18 min', '2,000', '1.5 km', 85, 'Easy', 'Glucose response improved post-dinner'),
  ]},
];

const DateGroup = ({label}) => (
  <View style={styles.dateGroup}>
    <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5, marginRight: s(8)}}>
      {label}
    </AppText>
    <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
  </View>
);

const DaySummaryPill = ({total, level}) => {
  const color = ACT_BAR_COLORS[level] || Colors.accent;
  return (
    <View style={[styles.daySummary, {borderLeftColor: color}]}>
      <Icon family="Ionicons" name="footsteps-outline" size={ms(13)} color={color} />
      <AppText variant="small" color={Colors.textSecondary} style={{flex: 1, marginLeft: s(6)}}>{total}</AppText>
    </View>
  );
};

const ActivityRow = ({act}) => {
  const zoneColors = {
    Cardio: {bg: Colors.tealBg, color: Colors.tealText},
    'Fat burn': {bg: '#EAF3DE', color: '#4A7C23'},
    Light: {bg: Colors.blueBg, color: Colors.blueText},
    Rest: {bg: Colors.amberBg, color: Colors.amberText},
  };
  const zc = zoneColors[act.zone] || zoneColors.Light;

  return (
    <View style={styles.actRow}>
      <View style={[styles.actLeftBar, {backgroundColor: zc.color}]} />
      <View style={styles.actBodyCol}>
        <View style={styles.actTopRow}>
          <View style={[styles.actIcon, {backgroundColor: act.iconBg}]}>
            <Icon family="Ionicons" name={act.icon} size={ms(14)} color={act.iconColor} />
          </View>
          <View style={{flex: 1, marginLeft: s(8)}}>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(12)}}>{act.type}</AppText>
            <AppText variant="small" color={Colors.textTertiary}>{act.time}{act.duration ? ` - ${act.duration}` : ''}</AppText>
          </View>
          <View style={[styles.zonePill, {backgroundColor: zc.bg}]}>
            <AppText variant="small" color={zc.color} style={{fontWeight: '600'}}>{act.zone}</AppText>
          </View>
        </View>
        <View style={styles.actChipRow}>
          <View style={styles.actChip}>
            <Icon family="Ionicons" name="footsteps-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>{act.steps}</AppText>
          </View>
          <View style={styles.actChip}>
            <Icon family="Ionicons" name="navigate-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>{act.distance}</AppText>
          </View>
          <View style={styles.actChip}>
            <Icon family="Ionicons" name="flame-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>{act.kcal} kcal</AppText>
          </View>
        </View>
        {act.note ? (
          <View style={styles.actNote}>
            <Icon family="Ionicons" name="information-circle-outline" size={ms(11)} color={Colors.tealText} />
            <AppText variant="small" color={Colors.tealText}>{act.note}</AppText>
          </View>
        ) : null}
      </View>
    </View>
  );
};

const LifestyleActivityTab = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Ayu Intel banner */}
      <TouchableOpacity style={styles.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('LifestyleDetail', {lifestyleId: 'fitness'})}>
        <View style={styles.ayuIconWrap}><Icon family="Ionicons" name="bulb-outline" size={ms(16)} color={Colors.white} /></View>
        <View style={{flex: 1}}>
          <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Activity</AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.7)">Step trends - Glucose impact - Movement patterns</AppText>
        </View>
        <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      {ACTIVITY_RECORDS.map((day, i) => (
        <View key={i}>
          <DateGroup label={day.date} />
          <DaySummaryPill total={day.total} level={day.level} />
          {day.activities.map((act, j) => (
            <ActivityRow key={j} act={act} />
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  /* Ayu Intel */
  ayuBtn: {flexDirection: 'row', alignItems: 'center', gap: s(8), backgroundColor: Colors.accent, borderRadius: ms(12), padding: ms(12), marginBottom: vs(12)},
  ayuIconWrap: {width: ms(32), height: ms(32), borderRadius: ms(9), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},

  /* Date group */
  dateGroup: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(10)},

  /* Day summary pill */
  daySummary: {flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: ms(10), borderWidth: 0.5, borderColor: '#dde8e2', borderLeftWidth: ms(3), paddingHorizontal: s(10), paddingVertical: vs(7), marginBottom: vs(7)},

  /* Activity row */
  actRow: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#dde8e2', marginBottom: vs(7), overflow: 'hidden', flexDirection: 'row', alignItems: 'stretch'},
  actLeftBar: {width: ms(4)},
  actBodyCol: {flex: 1, padding: ms(10)},
  actTopRow: {flexDirection: 'row', alignItems: 'center', gap: s(4)},
  actIcon: {width: ms(30), height: ms(30), borderRadius: ms(8), alignItems: 'center', justifyContent: 'center'},
  zonePill: {paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(8)},
  actChipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8), marginTop: vs(6), paddingLeft: ms(38)},
  actChip: {flexDirection: 'row', alignItems: 'center', gap: s(4), backgroundColor: Colors.background, paddingHorizontal: s(7), paddingVertical: vs(3), borderRadius: ms(6)},
  actNote: {flexDirection: 'row', alignItems: 'center', gap: s(4), backgroundColor: Colors.tealBg, paddingHorizontal: s(7), paddingVertical: vs(3), borderRadius: ms(6), marginTop: vs(6), marginLeft: ms(38), alignSelf: 'flex-start'},

  toggleRow: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    padding: ms(3),
    marginBottom: vs(10),
  },
  toggleBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(7),
    borderRadius: ms(8),
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(12),
    marginBottom: vs(8),
  },
  arrowBtn: {padding: ms(4)},
  calendarStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(14),
  },
  calDay: {
    alignItems: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: s(12),
    borderRadius: ms(12),
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: '#dde8e2',
  },
  calDayActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  statsRow: {
    flexDirection: 'row',
    gap: s(6),
    marginBottom: vs(12),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(8),
    borderRadius: ms(10),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
    marginBottom: vs(10),
  },
  cardTitle: {
    marginBottom: vs(10),
  },
  heroRow: {
    flexDirection: 'row',
    gap: s(10),
  },
  heroMetric: {
    flex: 1,
  },
  barTrack: {
    height: vs(6),
    backgroundColor: Colors.background,
    borderRadius: ms(3),
    marginTop: vs(6),
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: ms(3),
  },
  hrBar: {
    flexDirection: 'row',
    borderRadius: ms(5),
    overflow: 'hidden',
  },
  hrLabels: {
    flexDirection: 'row',
    marginTop: vs(4),
  },
  hrGrid: {
    flexDirection: 'row',
    marginTop: vs(10),
    gap: s(6),
  },
  hrGridItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: ms(8),
    paddingVertical: vs(6),
  },
  /* old actRow/actIcon removed - using new definitions above */
  actHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    padding: ms(12),
    borderRadius: ms(12),
    marginBottom: vs(10),
  },
  hydrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(16),
  },
  miniBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: s(6),
    height: vs(50),
    width: s(90),
  },
  miniBarCol: {
    flex: 1,
    height: '100%',
  },
  monthStrip: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(12),
  },
  monthBtn: {
    paddingHorizontal: ms(14),
    paddingVertical: vs(6),
    borderRadius: ms(10),
    backgroundColor: Colors.background,
  },
  monthBtnActive: {
    backgroundColor: Colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(13),
    paddingVertical: vs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderTertiary,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(4),
    marginBottom: vs(8),
  },
  heatSquare: {
    width: '13%',
    aspectRatio: 1,
    borderRadius: ms(6),
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  heatCellEmpty: {
    width: '13%',
    aspectRatio: 1,
  },
  heatCellText: {
    fontSize: ms(8),
    fontWeight: '700',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: ms(10),
  },
  legendRow: {
    flexDirection: 'row',
    gap: s(14),
    marginTop: vs(8),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  legendDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
});

export default LifestyleActivityTab;
