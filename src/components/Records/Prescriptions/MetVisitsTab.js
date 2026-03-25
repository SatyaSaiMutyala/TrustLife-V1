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

/* ── Visit data ── */
const VISITS = [
  {
    doctor: 'Dr. Kavitha',
    date: '15 Mar 2026',
    badge: 'Latest',
    badgeBg: Colors.tealBg,
    badgeColor: Colors.tealText,
    summary: 'Metformin continued, no dose change',
    pills: [
      {label: 'HbA1c \u2191', bg: Colors.amberBg, color: Colors.amberText},
      {label: 'PM 71%', bg: Colors.redBg, color: Colors.redText},
      {label: 'B12 added', bg: Colors.tealBg, color: Colors.tealText},
    ],
  },
  {
    doctor: 'Dr. Kavitha',
    date: '10 Sep 2025',
    badge: null,
    summary: 'Continued, no change',
    pills: [
      {label: 'HbA1c 7.5%', bg: Colors.amberBg, color: Colors.amberText},
      {label: 'Adherence 83%', bg: Colors.amberBg, color: Colors.amberText},
    ],
  },
  {
    doctor: 'Dr. Kavitha',
    date: '14 Sep 2019',
    extra: 'T2DM diagnosis',
    badge: 'Origin',
    badgeBg: Colors.redBg,
    badgeColor: Colors.redText,
    summary: 'Metformin initiated',
    pills: [
      {label: 'HbA1c 8.2%', bg: Colors.redBg, color: Colors.redText},
      {
        label: 'First prescription',
        bg: Colors.purpleBg,
        color: Colors.purpleText,
      },
    ],
  },
];

/* ── Visit card ── */
const VisitCard = ({visit}) => (
  <View style={[styles.card, {borderLeftWidth: 3, borderLeftColor: Colors.blueText}]}>
    {/* Header */}
    <View style={styles.headerRow}>
      <View style={[styles.iconCircle, {backgroundColor: Colors.blueBg}]}>
        <Icon
          family="Ionicons"
          name="calendar-outline"
          size={16}
          color={Colors.blueText}
        />
      </View>
      <View style={{flex: 1, marginLeft: s(10)}}>
        <AppText variant="bodyBold">
          {visit.doctor} {'\u00B7'} {visit.date}
        </AppText>
        {visit.extra ? (
          <AppText variant="caption" color={Colors.textSecondary}>
            {visit.extra}
          </AppText>
        ) : null}
      </View>
      {visit.badge ? (
        <View style={[styles.pill, {backgroundColor: visit.badgeBg}]}>
          <AppText variant="small" color={visit.badgeColor}>
            {visit.badge}
          </AppText>
        </View>
      ) : null}
    </View>

    {/* Summary */}
    <AppText
      variant="body"
      color={Colors.textSecondary}
      style={{marginTop: vs(8)}}>
      {visit.summary}
    </AppText>

    {/* Pills */}
    <View style={styles.pillRow}>
      {visit.pills.map((p, i) => (
        <View key={i} style={[styles.pill, {backgroundColor: p.bg}]}>
          <AppText variant="small" color={p.color}>
            {p.label}
          </AppText>
        </View>
      ))}
    </View>
  </View>
);

/* ── Main component ── */
const MetVisitsTab = () => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}>
    {VISITS.map((v, i) => (
      <VisitCard key={i} visit={v} />
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: s(4),
    paddingBottom: vs(32),
    gap: vs(12),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    padding: ms(14),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(12),
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginTop: vs(8),
  },
});

export default MetVisitsTab;
