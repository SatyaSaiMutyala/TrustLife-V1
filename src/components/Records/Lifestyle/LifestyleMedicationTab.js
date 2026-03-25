import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
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

const LifestyleMedicationTab = () => {
  const [view, setView] = useState('daily');

  const renderToggle = () => (
    <View style={styles.toggleRow}>
      {['daily', 'monthly'].map(v => (
        <TouchableOpacity
          key={v}
          style={[styles.toggleBtn, view === v && styles.toggleBtnActive]}
          onPress={() => setView(v)}
          activeOpacity={0.7}>
          <AppText
            variant="caption"
            color={view === v ? Colors.white : Colors.textSecondary}
            style={{fontWeight: view === v ? '600' : '400'}}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDateNav = () => (
    <View style={styles.dateNav}>
      <TouchableOpacity activeOpacity={0.7}>
        <Icon family="Ionicons" name="chevron-back" size={ms(18)} color={Colors.textSecondary} />
      </TouchableOpacity>
      <AppText variant="bodyBold">Tue, 24 Mar 2026</AppText>
      <TouchableOpacity activeOpacity={0.7}>
        <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const renderCalendarStrip = () => (
    <View style={styles.calendarStrip}>
      {calendarDays.map((d, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.calDay, d.active && styles.calDayActive]}
          activeOpacity={0.7}>
          <AppText variant="small" color={d.active ? Colors.white : Colors.textTertiary}>
            {d.day}
          </AppText>
          <AppText
            variant="caption"
            color={d.active ? Colors.white : Colors.textPrimary}
            style={{fontWeight: d.active ? '700' : '500', marginTop: vs(2)}}>
            {d.date}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDailyView = () => (
    <View>
      {/* Stats row */}
      <View style={styles.statsRow}>
        {dailyStats.map((stat, i) => (
          <View key={i} style={[styles.statCard, {backgroundColor: stat.bg}]}>
            <AppText variant="bodyBold" color={stat.color}>{stat.value}</AppText>
            <AppText variant="small" color={stat.color}>{stat.label}</AppText>
          </View>
        ))}
      </View>

      {/* Medication log card */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.cardTitle}>
          Medication log {'\u00B7'} Tue 24 Mar
        </AppText>

        {medications.map((med, i) => (
          <View
            key={i}
            style={[
              styles.medRow,
              med.rowBg && {backgroundColor: med.rowBg},
              i < medications.length - 1 && styles.medRowBorder,
            ]}>
            {/* Icon */}
            <View style={[styles.medIcon, {backgroundColor: med.iconBg}]}>
              <Icon family="Ionicons" name={med.icon} size={ms(16)} color={med.iconColor} />
            </View>

            <View style={styles.medContent}>
              {/* Name + status pill */}
              <View style={styles.medHeader}>
                <View style={{flex: 1}}>
                  <AppText variant="bodyBold">
                    {med.name}{med.schedule ? ` \u00B7 ${med.schedule}` : ''}
                  </AppText>
                </View>
                <View style={[styles.pill, {backgroundColor: med.statusBg}]}>
                  <AppText variant="small" color={med.statusColor}>{med.status}</AppText>
                </View>
              </View>

              {/* Description */}
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                {med.description}
              </AppText>

              {/* Chips */}
              <View style={styles.chipsRow}>
                {med.chips.map((chip, ci) => (
                  <View key={ci} style={[styles.chip, {backgroundColor: chip.bg}]}>
                    {chip.icon === 'checkmark' && (
                      <Icon family="Ionicons" name="checkmark" size={ms(10)} color={chip.color} />
                    )}
                    {chip.iconName && (
                      <Icon family="Ionicons" name={chip.iconName} size={ms(10)} color={chip.color} />
                    )}
                    <AppText variant="small" color={chip.color}>{chip.label}</AppText>
                  </View>
                ))}
              </View>

              {/* Extra text */}
              {med.extraText && (
                <AppText variant="small" color={Colors.amberText} style={{marginTop: vs(4)}}>
                  {med.extraText}
                </AppText>
              )}
            </View>
          </View>
        ))}
      </View>

      {/* Green insight */}
      <View style={[styles.insightBox, {backgroundColor: Colors.tealBg}]}>
        <Icon family="Ionicons" name="time-outline" size={ms(16)} color={Colors.tealText} />
        <AppText variant="caption" color={Colors.tealText} style={{flex: 1}}>
          AM doses on time today. PM Metformin alarm set for 8 PM. Evening routine reminder will fire at 7:45 PM.
        </AppText>
      </View>
    </View>
  );

  const renderMonthlyView = () => (
    <View>
      {/* Month strip */}
      <View style={styles.monthStrip}>
        {months.map((m, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.monthBtn, m === 'Mar' && styles.monthBtnActive]}
            activeOpacity={0.7}>
            <AppText
              variant="caption"
              color={m === 'Mar' ? Colors.white : Colors.textSecondary}
              style={{fontWeight: m === 'Mar' ? '600' : '400'}}>
              {m}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Adherence by drug card */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.cardTitle}>
          Adherence by drug {'\u00B7'} March 2026
        </AppText>

        {monthlyDrugs.map((drug, i) => (
          <View key={i} style={[styles.drugSection, i < monthlyDrugs.length - 1 && styles.medRowBorder]}>
            {/* Header row */}
            <View style={styles.drugHeader}>
              <AppText variant="bodyBold" style={{flex: 1}}>
                {drug.name} {'\u00B7'} {drug.schedule}
                {drug.warn && (
                  <AppText variant="bodyBold" color={Colors.amberText}> </AppText>
                )}
              </AppText>
              {drug.warn && (
                <Icon family="Ionicons" name="warning-outline" size={ms(14)} color={Colors.amberText} />
              )}
              <AppText variant="bodyBold" color={drug.color} style={{marginLeft: s(4)}}>
                {drug.pct}%
              </AppText>
            </View>

            {/* Progress bar */}
            <View style={styles.barTrack}>
              <View style={[styles.barFill, {width: `${drug.pct}%`, backgroundColor: drug.barColor}]} />
            </View>

            {/* Detail text */}
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(4)}}>
              {drug.detail}
            </AppText>

            {/* Dots row */}
            {drug.showDots && (
              <View style={styles.dotsRow}>
                {drug.dots.map((dot, di) => (
                  <View
                    key={di}
                    style={[
                      styles.dot,
                      {backgroundColor: dot === 'green' ? Colors.teal : Colors.red},
                    ]}
                  />
                ))}
              </View>
            )}
          </View>
        ))}
      </View>

      {/* Missed dose pattern card */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.cardTitle}>
          Missed dose pattern {'\u00B7'} Metformin PM
        </AppText>

        {missedPatterns.map((p, i) => (
          <View key={i} style={styles.patternRow}>
            <View style={styles.patternLabel}>
              <AppText variant="caption" color={Colors.textPrimary}>{p.label}</AppText>
            </View>
            <View style={styles.patternBarWrap}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, {width: `${p.pct}%`, backgroundColor: p.barColor}]} />
              </View>
            </View>
            <AppText variant="small" color={p.color} style={{width: s(55), textAlign: 'right'}}>
              {p.detail}
            </AppText>
          </View>
        ))}
      </View>

      {/* Amber insight */}
      <View style={[styles.insightBox, {backgroundColor: Colors.amberBg}]}>
        <Icon family="Ionicons" name="bulb-outline" size={ms(16)} color={Colors.amberText} />
        <AppText variant="caption" color={Colors.amberText} style={{flex: 1}}>
          Pattern is clear: you miss the PM dose when you eat dinner late or stay up past 11 PM. Setting
          a fixed 8 PM alarm and eating by 7:30 PM could push adherence above 90%.
        </AppText>
      </View>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderToggle()}
      {view === 'daily' && renderDateNav()}
      {view === 'daily' && renderCalendarStrip()}
      {view === 'daily' ? renderDailyView() : renderMonthlyView()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
    paddingVertical: vs(6),
    borderRadius: ms(8),
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(8),
    paddingHorizontal: s(4),
  },
  calendarStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  calDay: {
    alignItems: 'center',
    paddingVertical: vs(6),
    paddingHorizontal: s(8),
    borderRadius: ms(10),
  },
  calDayActive: {
    backgroundColor: Colors.primary,
  },
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
