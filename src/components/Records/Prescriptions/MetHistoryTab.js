import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
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

/* ── Timeline data ── */
const TIMELINE = [
  {
    date: 'Mar 2026',
    dose: '500mg BD',
    badge: 'Current',
    badgeBg: Colors.tealBg,
    badgeColor: Colors.tealText,
    note: null,
  },
  {
    date: 'Sep 2025',
    dose: '500mg BD',
    badge: 'Expired',
    badgeBg: backgroundSecondary,
    badgeColor: Colors.textSecondary,
    note: null,
  },
  {
    date: 'Mar 2025',
    dose: '500mg BD',
    badge: 'Expired',
    badgeBg: backgroundSecondary,
    badgeColor: Colors.textSecondary,
    note: 'Best result HbA1c 7.2%',
  },
  {
    date: 'Sep 2021 - 2023',
    dose: '500mg BD',
    badge: 'Expired',
    badgeBg: backgroundSecondary,
    badgeColor: Colors.textSecondary,
    note: 'Dose increase considered',
  },
  {
    date: 'Sep 2019',
    dose: '500mg BD',
    badge: 'Origin',
    badgeBg: Colors.redBg,
    badgeColor: Colors.redText,
    note: 'First prescription',
  },
];

/* ── History timeline card ── */
const HistoryCard = () => (
  <View style={styles.card}>
    <AppText variant="bodyBold" style={{marginBottom: vs(12)}}>
      Metformin history {'\u00B7'} 6.5 years
    </AppText>
    {TIMELINE.map((item, i) => {
      const isLast = i === TIMELINE.length - 1;
      return (
        <View key={i} style={styles.timelineRow}>
          {/* Spine */}
          <View style={styles.spineCol}>
            <View
              style={[
                styles.spineDot,
                {
                  backgroundColor:
                    i === 0
                      ? Colors.teal
                      : isLast
                      ? Colors.red
                      : Colors.textTertiary,
                },
              ]}
            />
            {!isLast && <View style={styles.spineLine} />}
          </View>

          {/* Content */}
          <View style={styles.timelineContent}>
            <View style={styles.timelineHeader}>
              <AppText variant="bodyBold" style={{flex: 1}}>
                {item.date}
              </AppText>
              <View style={[styles.pill, {backgroundColor: item.badgeBg}]}>
                <AppText variant="small" color={item.badgeColor}>
                  {item.badge}
                </AppText>
              </View>
            </View>
            <AppText
              variant="caption"
              color={Colors.textSecondary}
              style={{marginTop: vs(2)}}>
              {item.dose}
            </AppText>
            {item.note ? (
              <AppText
                variant="caption"
                color={Colors.primary}
                style={{marginTop: vs(2)}}>
                {item.note}
              </AppText>
            ) : null}
          </View>
        </View>
      );
    })}
  </View>
);

/* ── Annual adherence trend card ── */
const ADHERENCE_YEARS = [
  {year: '2020', pct: 72},
  {year: '2021', pct: 78},
  {year: '2022', pct: 81},
  {year: '2023', pct: 84},
  {year: '2024', pct: 88},
  {year: '2025-26', pct: 71, isRed: true},
];

const AdherenceTrendCard = () => (
  <View style={styles.card}>
    <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
      Annual adherence trend
    </AppText>
    {ADHERENCE_YEARS.map((item, i) => {
      const barColor = item.isRed ? Colors.red : Colors.teal;
      return (
        <View key={i} style={styles.trendRow}>
          <AppText
            variant="caption"
            color={Colors.textSecondary}
            style={{width: s(60)}}>
            {item.year}
          </AppText>
          <View style={styles.trendBarTrack}>
            <View
              style={[
                styles.trendBarFill,
                {width: `${item.pct}%`, backgroundColor: barColor},
              ]}
            />
          </View>
          <AppText
            variant="bodyBold"
            color={item.isRed ? Colors.redText : Colors.tealText}
            style={{width: s(38), textAlign: 'right'}}>
            {item.pct}%
          </AppText>
        </View>
      );
    })}
  </View>
);

/* ── Action buttons ── */
const ActionButtons = () => (
  <View style={styles.btnRow}>
    <TouchableOpacity
      activeOpacity={0.7}
      style={[styles.actionBtn, {backgroundColor: Colors.primary}]}>
      <Icon family="Ionicons" name="share-outline" size={16} color={Colors.white} />
      <AppText
        variant="bodyBold"
        color={Colors.white}
        style={{marginLeft: s(6), fontSize: ms(13)}}>
        Share history
      </AppText>
    </TouchableOpacity>
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        styles.actionBtn,
        {
          backgroundColor: Colors.white,
          borderWidth: 1,
          borderColor: Colors.primary,
        },
      ]}>
      <Icon
        family="Ionicons"
        name="document-outline"
        size={16}
        color={Colors.primary}
      />
      <AppText
        variant="bodyBold"
        color={Colors.primary}
        style={{marginLeft: s(6), fontSize: ms(13)}}>
        Export PDF
      </AppText>
    </TouchableOpacity>
  </View>
);

/* ── Main component ── */
const MetHistoryTab = () => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}>
    <HistoryCard />
    <AdherenceTrendCard />
    <ActionButtons />
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
  /* timeline */
  timelineRow: {
    flexDirection: 'row',
    marginBottom: vs(2),
  },
  spineCol: {
    alignItems: 'center',
    width: ms(20),
  },
  spineDot: {
    width: ms(12),
    height: ms(12),
    borderRadius: ms(6),
    marginTop: vs(4),
  },
  spineLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: borderTertiary,
    marginVertical: vs(4),
  },
  timelineContent: {
    flex: 1,
    marginLeft: s(8),
    paddingBottom: vs(14),
  },
  timelineHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(12),
  },
  /* trend */
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  trendBarTrack: {
    flex: 1,
    height: vs(8),
    backgroundColor: backgroundSecondary,
    borderRadius: ms(4),
    marginHorizontal: s(8),
    overflow: 'hidden',
  },
  trendBarFill: {
    height: '100%',
    borderRadius: ms(4),
  },
  /* buttons */
  btnRow: {
    flexDirection: 'row',
    gap: s(10),
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(12),
    borderRadius: ms(14),
  },
});

export default MetHistoryTab;
