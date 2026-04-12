import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
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

const dailyStats = [
  {label: 'Taken', value: '3/4', bg: Colors.tealBg, color: Colors.tealText},
  {label: 'Pending', value: '1', bg: Colors.redBg, color: Colors.redText},
  {label: 'AM doses', value: '100%', bg: Colors.tealBg, color: Colors.tealText},
  {label: '7-day avg', value: '71%', bg: Colors.amberBg, color: Colors.amberText},
];

const medications = [
  {
    name: 'Metformin 500mg',
    schedule: 'AM',
    icon: 'medical-outline',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    description: 'With breakfast \u00B7 7:45 AM \u00B7 On time',
    chips: [
      {label: 'Taken', icon: 'checkmark', bg: Colors.tealBg, color: Colors.tealText},
      {label: '7:45 AM', bg: Colors.blueBg, color: Colors.blueText},
      {label: 'With food', icon: 'checkmark', bg: Colors.tealBg, color: Colors.tealText},
    ],
    status: 'Done',
    statusColor: Colors.tealText,
    statusBg: Colors.tealBg,
    rowBg: null,
  },
  {
    name: 'Amlodipine 5mg',
    schedule: 'Morning',
    icon: 'medical-outline',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    description: '8:02 AM \u00B7 Day 30 of streak',
    chips: [
      {label: 'Taken', icon: 'checkmark', bg: Colors.tealBg, color: Colors.tealText},
      {label: '8:02 AM', bg: Colors.blueBg, color: Colors.blueText},
      {label: '30-day streak', iconName: 'flame-outline', bg: Colors.tealBg, color: Colors.tealText},
    ],
    status: 'Done',
    statusColor: Colors.tealText,
    statusBg: Colors.tealBg,
    rowBg: null,
  },
  {
    name: 'Atorvastatin 10mg',
    schedule: 'Bedtime',
    icon: 'medical-outline',
    iconBg: Colors.blueBg,
    iconColor: Colors.blueText,
    description: 'Due 10:00 PM \u00B7 Not yet due',
    chips: [
      {label: 'Due at bedtime', bg: Colors.blueBg, color: Colors.blueText},
    ],
    status: 'Pending',
    statusColor: Colors.blueText,
    statusBg: Colors.blueBg,
    rowBg: null,
  },
  {
    name: 'Metformin 500mg',
    schedule: 'PM',
    icon: 'warning-outline',
    iconBg: Colors.amberBg,
    iconColor: Colors.amberText,
    description: 'Due 8:00 PM \u00B7 Set alarm \u00B7 Critical dose',
    chips: [
      {label: "Due tonight \u2013 don't miss", bg: Colors.amberBg, color: Colors.amberText},
    ],
    extraText: 'This dose suppresses overnight liver glucose. Missing it = fasting glucose ~9+ tomorrow.',
    status: 'Due',
    statusColor: Colors.amberText,
    statusBg: Colors.amberBg,
    rowBg: '#FFF9F0',
  },
  {
    name: 'Methylcobalamin 500mcg',
    schedule: null,
    icon: 'leaf-outline',
    iconBg: '#EAF3DE',
    iconColor: '#4A7C23',
    description: 'With lunch \u00B7 1:10 PM \u00B7 Started 15 Mar',
    chips: [
      {label: 'Taken', icon: 'checkmark', bg: Colors.tealBg, color: Colors.tealText},
      {label: 'Day 9 of treatment', bg: '#EAF3DE', color: '#4A7C23'},
    ],
    status: 'Done',
    statusColor: Colors.tealText,
    statusBg: Colors.tealBg,
    rowBg: null,
  },
];

const months = ['Jan', 'Feb', 'Mar'];

const monthlyDrugs = [
  {
    name: 'Amlodipine 5mg',
    schedule: 'AM',
    pct: 100,
    color: Colors.tealText,
    barColor: Colors.teal,
    detail: '30-day streak \u00B7 Never missed \u00B7 Perfect',
    showDots: true,
    dots: Array(24).fill('green'),
  },
  {
    name: 'Atorvastatin 10mg',
    schedule: 'Bedtime',
    pct: 97,
    color: Colors.tealText,
    barColor: Colors.teal,
    detail: '1 dose missed (Mar 3)',
    showDots: false,
    dots: [],
  },
  {
    name: 'Metformin 500mg',
    schedule: 'AM',
    pct: 92,
    color: Colors.tealText,
    barColor: Colors.teal,
    detail: '2 missed \u2013 both weekends',
    showDots: false,
    dots: [],
  },
  {
    name: 'Metformin 500mg',
    schedule: 'PM',
    warn: true,
    pct: 71,
    color: Colors.redText,
    barColor: Colors.red,
    detail: '7 doses missed \u00B7 All weeknights after 10 PM \u00B7 Critical',
    showDots: true,
    dots: [
      'green','green','red','green','green','red','green','red',
      'green','green','green','red','green','green','green','red',
      'green','green','red','green','green','green','green','green',
    ],
  },
];

const missedPatterns = [
  {label: 'Monday evenings', pct: 80, color: Colors.red, barColor: Colors.red, detail: '3x missed'},
  {label: 'Friday evenings', pct: 53, color: Colors.amberText, barColor: Colors.amber, detail: '2x missed'},
  {label: 'When stayed up >11 PM', pct: 86, color: Colors.red, barColor: Colors.red, detail: '6 of 7'},
  {label: 'When dinner was late', pct: 71, color: Colors.amberText, barColor: Colors.amber, detail: '5 of 7'},
];

const MED_STATUS_COLORS = {
  Done: Colors.accent,
  Pending: Colors.blue,
  Due: Colors.amber,
  Missed: Colors.red,
};

const m = (name, schedule, status, icon, iconBg, iconColor, time, context, note) => ({
  name, schedule, status,
  statusColor: status === 'Done' ? Colors.tealText : status === 'Missed' ? Colors.redText : status === 'Due' ? Colors.amberText : Colors.blueText,
  statusBg: status === 'Done' ? Colors.tealBg : status === 'Missed' ? Colors.redBg : status === 'Due' ? Colors.amberBg : Colors.blueBg,
  icon, iconBg, iconColor, time, context, note,
});

const MED_RECORDS = [
  {date: 'Today - 24 Mar 2026', meds: [
    m('Metformin 500mg', 'AM', 'Done', 'medical-outline', Colors.tealBg, Colors.tealText, '7:45 AM', 'With breakfast', '28-day streak'),
    m('Amlodipine 5mg', 'Morning', 'Done', 'medical-outline', Colors.tealBg, Colors.tealText, '8:02 AM', 'Empty stomach', '30-day streak'),
    m('Atorvastatin 10mg', 'Bedtime', 'Pending', 'medical-outline', Colors.blueBg, Colors.blueText, 'Due 10 PM', 'Before sleep', null),
    m('Metformin 500mg', 'PM', 'Due', 'warning-outline', Colors.amberBg, Colors.amberText, 'Due 8 PM', 'With dinner', 'Critical - controls overnight glucose'),
    m('Methylcobalamin 500mcg', 'Lunch', 'Done', 'leaf-outline', '#EAF3DE', '#4A7C23', '1:10 PM', 'With food', 'Day 9 of treatment'),
  ]},
  {date: 'Yesterday - 23 Mar 2026', meds: [
    m('Metformin 500mg', 'AM', 'Done', 'medical-outline', Colors.tealBg, Colors.tealText, '7:50 AM', 'With breakfast', null),
    m('Amlodipine 5mg', 'Morning', 'Done', 'medical-outline', Colors.tealBg, Colors.tealText, '8:00 AM', 'Empty stomach', null),
    m('Methylcobalamin 500mcg', 'Lunch', 'Done', 'leaf-outline', '#EAF3DE', '#4A7C23', '1:15 PM', 'With food', null),
    m('Metformin 500mg', 'PM', 'Missed', 'warning-outline', Colors.redBg, Colors.redText, 'Missed', 'Dinner was late', 'Fasting glucose was 9.2 next morning'),
    m('Atorvastatin 10mg', 'Bedtime', 'Done', 'medical-outline', Colors.blueBg, Colors.blueText, '10:15 PM', 'Before sleep', null),
  ]},
  {date: '22 Mar 2026 - Saturday', meds: [
    m('Metformin 500mg', 'AM', 'Done', 'medical-outline', Colors.tealBg, Colors.tealText, '9:00 AM', 'Late breakfast', null),
    m('Amlodipine 5mg', 'Morning', 'Done', 'medical-outline', Colors.tealBg, Colors.tealText, '9:05 AM', 'Empty stomach', null),
    m('Metformin 500mg', 'PM', 'Done', 'medical-outline', Colors.tealBg, Colors.tealText, '8:10 PM', 'With dinner', null),
    m('Atorvastatin 10mg', 'Bedtime', 'Done', 'medical-outline', Colors.blueBg, Colors.blueText, '10:30 PM', 'Before sleep', null),
  ]},
  {date: '21 Mar 2026 - Friday', meds: [
    m('Metformin 500mg', 'AM', 'Done', 'medical-outline', Colors.tealBg, Colors.tealText, '7:40 AM', 'With breakfast', null),
    m('Amlodipine 5mg', 'Morning', 'Done', 'medical-outline', Colors.tealBg, Colors.tealText, '7:45 AM', 'Empty stomach', '29-day streak'),
    m('Metformin 500mg', 'PM', 'Missed', 'warning-outline', Colors.redBg, Colors.redText, 'Missed', 'Stayed up past 11 PM', 'Streak broken at 14 days'),
    m('Atorvastatin 10mg', 'Bedtime', 'Done', 'medical-outline', Colors.blueBg, Colors.blueText, '11:00 PM', 'Late but taken', null),
  ]},
  {date: '20 Mar 2026 - Thursday', meds: [
    m('Metformin 500mg', 'AM', 'Done', 'medical-outline', Colors.tealBg, Colors.tealText, '7:55 AM', 'With breakfast', null),
    m('Amlodipine 5mg', 'Morning', 'Done', 'medical-outline', Colors.tealBg, Colors.tealText, '8:00 AM', 'Empty stomach', null),
    m('Methylcobalamin 500mcg', 'Lunch', 'Done', 'leaf-outline', '#EAF3DE', '#4A7C23', '1:30 PM', 'With food', 'Day 5 of treatment'),
    m('Metformin 500mg', 'PM', 'Done', 'medical-outline', Colors.tealBg, Colors.tealText, '8:00 PM', 'With dinner', null),
    m('Atorvastatin 10mg', 'Bedtime', 'Done', 'medical-outline', Colors.blueBg, Colors.blueText, '10:20 PM', 'Before sleep', null),
  ]},
  {date: '19 Mar 2026 - Wednesday', meds: [
    m('Metformin 500mg', 'AM', 'Done', 'medical-outline', Colors.tealBg, Colors.tealText, '7:30 AM', 'With breakfast', null),
    m('Amlodipine 5mg', 'Morning', 'Done', 'medical-outline', Colors.tealBg, Colors.tealText, '7:35 AM', 'Empty stomach', null),
    m('Metformin 500mg', 'PM', 'Done', 'medical-outline', Colors.tealBg, Colors.tealText, '7:50 PM', 'With dinner', 'On time'),
    m('Atorvastatin 10mg', 'Bedtime', 'Done', 'medical-outline', Colors.blueBg, Colors.blueText, '10:00 PM', 'Before sleep', null),
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

const MedRow = ({med}) => {
  const barColor = MED_STATUS_COLORS[med.status] || Colors.accent;
  return (
    <View style={styles.medRowCard}>
      <View style={[styles.medLeftBar, {backgroundColor: barColor}]} />
      <View style={styles.medBodyCol}>
        {/* Top: icon + name + status */}
        <View style={styles.medTopRow}>
          <View style={[styles.medIcon, {backgroundColor: med.iconBg}]}>
            <Icon family="Ionicons" name={med.icon} size={ms(14)} color={med.iconColor} />
          </View>
          <View style={{flex: 1, marginLeft: s(8)}}>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(12)}}>{med.name}</AppText>
            <AppText variant="small" color={Colors.textTertiary}>{med.schedule} - {med.time || ''}</AppText>
          </View>
          <View style={[styles.statusPill, {backgroundColor: med.statusBg}]}>
            <AppText variant="small" color={med.statusColor} style={{fontWeight: '600'}}>{med.status}</AppText>
          </View>
        </View>
        {/* Bottom: context + note */}
        <View style={styles.medDetailRow}>
          {med.context ? (
            <View style={styles.contextChip}>
              <Icon family="Ionicons" name="information-circle-outline" size={ms(11)} color={Colors.textTertiary} />
              <AppText variant="small" color={Colors.textSecondary}>{med.context}</AppText>
            </View>
          ) : null}
          {med.note ? (
            <View style={[styles.contextChip, {backgroundColor: med.status === 'Missed' ? Colors.redBg : Colors.tealBg}]}>
              <Icon family="Ionicons" name={med.status === 'Missed' ? 'alert-circle-outline' : 'flame-outline'} size={ms(11)} color={med.status === 'Missed' ? Colors.redText : Colors.tealText} />
              <AppText variant="small" color={med.status === 'Missed' ? Colors.redText : Colors.tealText}>{med.note}</AppText>
            </View>
          ) : null}
        </View>
      </View>
    </View>
  );
};

const LifestyleMedicationTab = () => {
  const navigation = useNavigation();
  return (
    <View style={styles.container}>
      {/* Ayu Intel banner */}
      <TouchableOpacity style={styles.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('LifestyleDetail', {lifestyleId: 'medication'})}>
        <View style={styles.ayuIconWrap}><Icon family="Ionicons" name="bulb-outline" size={ms(16)} color={Colors.white} /></View>
        <View style={{flex: 1}}>
          <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Medication</AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.7)">Adherence patterns - Missed dose analysis</AppText>
        </View>
        <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      {MED_RECORDS.map((day, i) => (
        <View key={i}>
          <DateGroup label={day.date} />
          {day.meds.map((med, j) => (
            <MedRow key={j} med={med} />
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

  /* Med row */
  medRowCard: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#dde8e2', marginBottom: vs(7), overflow: 'hidden', flexDirection: 'row', alignItems: 'stretch'},
  medLeftBar: {width: ms(4)},
  medBodyCol: {flex: 1, padding: ms(10)},
  medTopRow: {flexDirection: 'row', alignItems: 'center', gap: s(4)},
  medIcon: {width: ms(30), height: ms(30), borderRadius: ms(8), alignItems: 'center', justifyContent: 'center'},
  statusPill: {paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(8)},
  medDetailRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6), marginTop: vs(6), paddingLeft: ms(38)},
  contextChip: {flexDirection: 'row', alignItems: 'center', gap: s(4), backgroundColor: Colors.background, paddingHorizontal: s(7), paddingVertical: vs(3), borderRadius: ms(6)},

  /* Legacy (kept for compatibility) */
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
  medRow: {
    flexDirection: 'row',
    paddingVertical: vs(10),
    alignItems: 'flex-start',
  },
  medRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  medIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
    marginTop: vs(2),
  },
  medContent: {
    flex: 1,
  },
  medHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(5),
    marginTop: vs(6),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
    paddingHorizontal: ms(7),
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
  drugSection: {
    paddingVertical: vs(10),
  },
  drugHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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
  dotsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(4),
    marginTop: vs(8),
  },
  dot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
  },
  patternRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  patternLabel: {
    width: s(110),
  },
  patternBarWrap: {
    flex: 1,
    marginHorizontal: s(8),
  },
});

export default LifestyleMedicationTab;
