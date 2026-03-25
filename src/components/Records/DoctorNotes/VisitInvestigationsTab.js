import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const borderTertiary = '#d1d5db';

/* ── status pill ── */
const StatusPill = ({label, bg, color}) => (
  <View style={[styles.pill, {backgroundColor: bg}]}>
    <AppText variant="small" color={color}>
      {label}
    </AppText>
  </View>
);

/* ── reviewed item ── */
const ReviewedItem = ({icon, name, date, result, statusLabel, statusBg, statusColor}) => (
  <View style={styles.testRow}>
    <View style={styles.testHeader}>
      <View style={styles.testLeft}>
        <Icon family="Ionicons" name={icon} size={18} color={Colors.primary} />
        <View style={{marginLeft: s(8), flex: 1}}>
          <AppText variant="bodyBold">{name}</AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            {date}
          </AppText>
        </View>
      </View>
      <StatusPill label={statusLabel} bg={statusBg} color={statusColor} />
    </View>
    <AppText
      variant="caption"
      color={Colors.textSecondary}
      style={{marginTop: vs(4), marginLeft: s(26)}}>
      {result}
    </AppText>
  </View>
);

/* ── ordered item ── */
const OrderedItem = ({name, detail, subtext, statusLabel, statusBg, statusColor}) => (
  <View style={styles.testRow}>
    <View style={styles.testHeader}>
      <View style={styles.testLeft}>
        <Icon family="Ionicons" name="flask-outline" size={18} color={Colors.amber} />
        <View style={{marginLeft: s(8), flex: 1}}>
          <AppText variant="bodyBold">{name}</AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            {detail}
          </AppText>
        </View>
      </View>
      <StatusPill label={statusLabel} bg={statusBg} color={statusColor} />
    </View>
    <AppText
      variant="small"
      color={Colors.amberText}
      style={{marginTop: vs(4), marginLeft: s(26)}}>
      {subtext}
    </AppText>
  </View>
);

/* ── timeline entry ── */
const TimelineEntry = ({date, text, isFirst}) => (
  <View style={styles.timelineRow}>
    <View style={styles.timelineLeft}>
      <View style={styles.timelineDot} />
      {!isFirst && <View style={styles.timelineLine} />}
    </View>
    <View style={styles.timelineContent}>
      <AppText variant="small" color={Colors.textTertiary}>
        {date}
      </AppText>
      <AppText variant="body" style={{marginTop: vs(2)}}>
        {text}
      </AppText>
    </View>
  </View>
);

/* ── data ── */
const REVIEWED = [
  {
    icon: 'analytics-outline',
    name: 'HbA1c + Lipid panel + Kidney function',
    date: '3 Mar 2026',
    result: 'HbA1c 7.8% (up) -- LDL 118 -- eGFR 72',
    statusLabel: 'Reviewed',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    icon: 'water-outline',
    name: 'CBC',
    date: '3 Mar 2026',
    result: 'Hb 11.8 -- mild anaemia flagged',
    statusLabel: 'Reviewed',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    icon: 'pulse-outline',
    name: 'Thyroid function',
    date: '3 Mar 2026',
    result: 'TSH 2.4 -- normal',
    statusLabel: 'Reviewed',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
];

const ORDERED = [
  {
    name: 'Vitamin B12 level',
    detail: 'Ordered 15 Mar 2026',
    subtext: 'To confirm suspected B12 depletion from Metformin',
    statusLabel: 'Pending',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
  {
    name: 'Dilated eye exam',
    detail: 'Referral to LV Prasad Eye Institute',
    subtext: 'Overdue >2 years -- diabetic retinopathy screening',
    statusLabel: 'Referred',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
];

const TIMELINE = [
  {date: 'Mar 2026', text: 'Current -- HbA1c 7.8%, B12 concern'},
  {date: 'Jan 2026', text: 'Quarterly labs -- HbA1c 7.2% rising'},
  {date: 'Sep 2025', text: 'Annual labs -- comprehensive, all stable'},
  {date: 'Mar 2025', text: '6-month labs -- HbA1c 7.0%, kidney stable'},
  {date: 'Jun 2022', text: 'Annual labs -- LDL 156 -> Atorvastatin started'},
  {date: 'Mar 2021', text: 'Annual labs -- HbA1c 6.8%, lipids normal'},
  {date: 'Sep 2019', text: 'Initial labs -- FPG 186, HbA1c 8.4%'},
];

/* ── component ── */
const VisitInvestigationsTab = () => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}>
    {/* ── Reviewed at this visit ── */}
    <View style={styles.card}>
      <View style={styles.cardTitleRow}>
        <Icon family="Ionicons" name="checkmark-done-outline" size={18} color={Colors.primary} />
        <AppText variant="bodyBold" style={{marginLeft: s(6)}}>
          Reviewed at This Visit
        </AppText>
      </View>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(8)}}>
        Dr. Kavitha Reddy -- 15 Mar 2026
      </AppText>
      {REVIEWED.map((item, i) => (
        <React.Fragment key={item.name}>
          {i > 0 && <View style={styles.separator} />}
          <ReviewedItem {...item} />
        </React.Fragment>
      ))}
    </View>

    {/* ── Newly ordered ── */}
    <View style={styles.card}>
      <View style={styles.cardTitleRow}>
        <Icon family="Ionicons" name="add-circle-outline" size={18} color={Colors.amber} />
        <AppText variant="bodyBold" style={{marginLeft: s(6)}}>
          Newly Ordered
        </AppText>
      </View>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(8)}}>
        Ordered at this visit -- 15 Mar 2026
      </AppText>
      {ORDERED.map((item, i) => (
        <React.Fragment key={item.name}>
          {i > 0 && <View style={styles.separator} />}
          <OrderedItem {...item} />
        </React.Fragment>
      ))}
    </View>

    {/* ── Investigation timeline ── */}
    <View style={styles.card}>
      <View style={styles.cardTitleRow}>
        <Icon family="Ionicons" name="git-branch-outline" size={18} color={Colors.primary} />
        <AppText variant="bodyBold" style={{marginLeft: s(6)}}>
          Investigation Timeline
        </AppText>
      </View>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(10)}}>
        Priya Reddy -- since Sep 2019
      </AppText>
      {TIMELINE.map((entry, i) => (
        <TimelineEntry
          key={entry.date}
          date={entry.date}
          text={entry.text}
          isFirst={i === TIMELINE.length - 1}
        />
      ))}
    </View>
  </ScrollView>
);

/* ── styles ── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: s(4),
    paddingBottom: vs(32),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    padding: s(14),
    marginBottom: vs(14),
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  separator: {
    height: 0.5,
    backgroundColor: Colors.borderLight,
    marginVertical: vs(10),
  },
  /* pill */
  pill: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
  /* test rows */
  testRow: {
    marginBottom: vs(2),
  },
  testHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  testLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: s(8),
  },
  /* timeline */
  timelineRow: {
    flexDirection: 'row',
    minHeight: vs(48),
  },
  timelineLeft: {
    width: s(20),
    alignItems: 'center',
  },
  timelineDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    backgroundColor: Colors.primary,
    marginTop: vs(4),
  },
  timelineLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: Colors.borderLight,
    marginTop: vs(2),
  },
  timelineContent: {
    flex: 1,
    paddingLeft: s(8),
    paddingBottom: vs(12),
  },
});

export default VisitInvestigationsTab;
