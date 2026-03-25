import React from 'react';
import {View, StyleSheet, ScrollView, Text} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const backgroundSecondary = '#F3F4F6';
const borderTertiary = '#d1d5db';

/* ── AM vs PM comparison card ── */
const DoseColumn = ({label, percent, missed, color, barColor}) => (
  <View style={{flex: 1, alignItems: 'center'}}>
    <AppText variant="bodyBold" style={{marginBottom: vs(4)}}>
      {label}
    </AppText>
    <AppText
      variant="header"
      color={color}
      style={{fontSize: ms(28), lineHeight: ms(34)}}>
      {percent}%
    </AppText>
    <AppText
      variant="caption"
      color={Colors.textSecondary}
      style={{marginTop: vs(2)}}>
      {missed} missed
    </AppText>
    <View style={styles.barTrack}>
      <View
        style={[styles.barFill, {width: `${percent}%`, backgroundColor: barColor}]}
      />
    </View>
  </View>
);

const ComparisonCard = () => (
  <View style={styles.card}>
    <AppText variant="bodyBold" style={{marginBottom: vs(12)}}>
      AM vs PM comparison
    </AppText>
    <View style={styles.compGrid}>
      <DoseColumn
        label="AM dose"
        percent={92}
        missed={2}
        color={Colors.tealText}
        barColor={Colors.teal}
      />
      <View style={styles.divider} />
      <DoseColumn
        label="PM dose"
        percent={71}
        missed={7}
        color={Colors.redText}
        barColor={Colors.red}
      />
    </View>
  </View>
);

/* ── 30-day heatmap ── */
// g=green (both), a=amber (AM only), r=red (both missed), x=empty
const HEATMAP = [
  'g','g','r','g','g','r','g',
  'g','r','g','g','a','g','g',
  'a','g','g','r','g','g','a',
  'g','g','g',
];

const heatColor = code => {
  if (code === 'g') return Colors.teal;
  if (code === 'a') return Colors.amber;
  if (code === 'r') return Colors.red;
  return backgroundSecondary;
};

const HeatmapCard = () => (
  <View style={styles.card}>
    <AppText variant="bodyBold" style={{marginBottom: vs(4)}}>
      30-day dose calendar
    </AppText>
    <AppText
      variant="caption"
      color={Colors.textSecondary}
      style={{marginBottom: vs(10)}}>
      Green = both doses {'\u00B7'} Amber = AM only {'\u00B7'} Red = both missed
    </AppText>
    <View style={styles.heatGrid}>
      {HEATMAP.map((code, i) => {
        const isToday = i === 23;
        return (
          <View
            key={i}
            style={[
              styles.heatCell,
              {backgroundColor: heatColor(code)},
              isToday && {borderWidth: 2, borderColor: Colors.primary},
            ]}>
            <Text
              style={{
                fontSize: ms(10),
                fontWeight: '700',
                color: Colors.white,
                includeFontPadding: false,
                textAlignVertical: 'center',
              }}>
              {i + 1}
            </Text>
          </View>
        );
      })}
    </View>
  </View>
);

/* ── Pattern analysis card ── */
const PATTERNS = [
  {
    icon: 'calendar-outline',
    label: 'Monday/Friday evenings',
    detail: '5/7 missed',
  },
  {
    icon: 'time-outline',
    label: 'After 10:30 PM',
    detail: '6/7 missed',
  },
  {
    icon: 'restaurant-outline',
    label: 'Late dinner nights',
    detail: '4/7 missed',
  },
];

const PatternCard = () => (
  <View style={styles.card}>
    <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
      Pattern analysis
    </AppText>
    {PATTERNS.map((p, i) => (
      <View
        key={i}
        style={[
          styles.patternRow,
          i > 0 && {
            marginTop: vs(8),
            paddingTop: vs(8),
            borderTopWidth: 0.5,
            borderTopColor: borderTertiary,
          },
        ]}>
        <Icon
          family="Ionicons"
          name={p.icon}
          size={16}
          color={Colors.textSecondary}
        />
        <AppText
          variant="body"
          color={Colors.textSecondary}
          style={{flex: 1, marginLeft: s(8)}}>
          {p.label}
        </AppText>
        <AppText variant="bodyBold" color={Colors.redText}>
          {p.detail}
        </AppText>
      </View>
    ))}
  </View>
);

/* ── Insight ── */
const InsightBanner = () => (
  <View style={[styles.insightCard, {backgroundColor: Colors.amberBg}]}>
    <Icon
      family="Ionicons"
      name="alert-circle-outline"
      size={18}
      color={Colors.amberText}
    />
    <AppText
      variant="caption"
      color={Colors.amberText}
      style={{marginLeft: s(8), flex: 1}}>
      Each missed PM dose = +1.6 mmol/L fasting glucose the next morning.
      Consistent PM adherence is the single biggest lever for improving your
      HbA1c.
    </AppText>
  </View>
);

/* ── Main component ── */
const MetAdherenceTab = () => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}>
    <ComparisonCard />
    <HeatmapCard />
    <PatternCard />
    <InsightBanner />
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
  compGrid: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  divider: {
    width: 0.5,
    backgroundColor: borderTertiary,
    alignSelf: 'stretch',
    marginHorizontal: s(12),
  },
  barTrack: {
    width: '100%',
    height: vs(6),
    backgroundColor: backgroundSecondary,
    borderRadius: ms(3),
    marginTop: vs(8),
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: ms(3),
  },
  heatGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
  },
  heatCell: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    padding: ms(14),
  },
});

export default MetAdherenceTab;
