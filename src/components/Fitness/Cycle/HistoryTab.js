import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {CYCLE_STATS, CYCLE_HISTORY} from '../../../constants/cycleData';

/* ─── Constants ────────────────────────────────────── */

const CYCLE_LENGTHS = [27, 28, 29, 28, 27, 28, 29, 28, 28];
const BAR_MAX_HEIGHT = vs(100);
const BAR_MIN = 26;
const BAR_RANGE = 4; // 26 to 30

const barColor = (len) => {
  if (len < 28) return Colors.amber;
  if (len > 28) return Colors.accent;
  return Colors.primary;
};

const barHeight = (len) => {
  const pct = (len - BAR_MIN) / BAR_RANGE;
  return Math.max(vs(16), BAR_MAX_HEIGHT * pct);
};

/* ─── Main Component ──────────────────────────────── */

const HistoryTab = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ─── 1. Cycle Statistics ──────────────── */}
      <AppText variant="sectionTitle" color={Colors.textSecondary} style={styles.sectionLabel}>
        CYCLE STATISTICS
      </AppText>
      <View style={styles.statsRow}>
        <View style={styles.statBox}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>
            {CYCLE_STATS.avgLength}
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>Avg length</AppText>
          <AppText variant="small" color={Colors.textTertiary}>
            ({CYCLE_STATS.range} range)
          </AppText>
        </View>
        <View style={styles.statBox}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>
            {CYCLE_STATS.periodAvg}
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>Period avg</AppText>
          <AppText variant="small" color={Colors.textTertiary}>(4-6 range)</AppText>
        </View>
        <View style={styles.statBox}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>
            {CYCLE_STATS.trackedCycles}
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>Cycles</AppText>
          <AppText variant="small" color={Colors.textTertiary}>
            since {CYCLE_STATS.trackingSince}
          </AppText>
        </View>
        <View style={styles.statBox}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>
            {CYCLE_STATS.stdDev}
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>Std dev</AppText>
          <AppText variant="small" color={Colors.textTertiary}>Very regular</AppText>
        </View>
      </View>

      {/* ─── 2. Regularity Insight ───────────── */}
      <View style={styles.insightGreen}>
        <AppText variant="body" color={Colors.tealText} style={{lineHeight: ms(20)}}>
          Excellent cycle regularity. Standard deviation 0.9 days across 9 cycles indicates
          consistent ovulation despite T2DM.
        </AppText>
      </View>

      {/* ─── 3. Cycle Length Trend ───────────── */}
      <AppText variant="sectionTitle" color={Colors.textSecondary} style={styles.sectionLabel}>
        CYCLE LENGTH TREND
      </AppText>
      <View style={styles.card}>
        <View style={styles.chartArea}>
          {/* Reference line at 28 */}
          <View style={styles.refLineContainer}>
            <View style={styles.refLine} />
            <AppText variant="small" color={Colors.textTertiary} style={styles.refLabel}>
              28d avg
            </AppText>
          </View>

          {/* Bars */}
          <View style={styles.barsRow}>
            {CYCLE_LENGTHS.map((len, idx) => (
              <View key={idx} style={styles.barCol}>
                <AppText variant="small" color={Colors.textSecondary} style={styles.barValue}>
                  {len}d
                </AppText>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barHeight(len),
                      backgroundColor: barColor(len),
                    },
                  ]}
                />
                <AppText variant="small" color={Colors.textTertiary} style={styles.barLabel}>
                  C{idx + 1}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: Colors.amber}]} />
            <AppText variant="small" color={Colors.textTertiary}>Short (&lt;28)</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: Colors.primary}]} />
            <AppText variant="small" color={Colors.textTertiary}>Normal (28)</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: Colors.accent}]} />
            <AppText variant="small" color={Colors.textTertiary}>Long (&gt;28)</AppText>
          </View>
        </View>
      </View>

      {/* ─── 4. Previous Cycles ──────────────── */}
      <AppText variant="sectionTitle" color={Colors.textSecondary} style={styles.sectionLabel}>
        PREVIOUS CYCLES
      </AppText>
      {CYCLE_HISTORY.map((entry, idx) => (
        <View key={idx} style={styles.historyBlock}>
          {/* Month separator */}
          <View style={styles.monthSeparator}>
            <View style={styles.monthLine} />
            <AppText variant="bodyBold" color={Colors.textPrimary} style={styles.monthLabel}>
              {entry.month}
            </AppText>
            <View style={styles.monthBadge}>
              <AppText variant="small" color={Colors.textSecondary}>
                {entry.badge} · Cycle {entry.cycleNum}
              </AppText>
            </View>
            <View style={styles.monthLine} />
          </View>

          {/* History entry card */}
          <View style={styles.card}>
            {/* Header */}
            <View style={styles.historyHeader}>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold" color={Colors.textPrimary}>
                  {entry.dateRange}
                </AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  {entry.duration} · Period {entry.periodDays} · {entry.flow}
                </AppText>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor:
                      entry.statusColor === 'green' ? Colors.tealBg : Colors.amberBg,
                  },
                ]}>
                <AppText
                  variant="small"
                  color={
                    entry.statusColor === 'green' ? Colors.tealText : Colors.amberDark
                  }>
                  {entry.status}
                </AppText>
              </View>
            </View>

            {/* Tags */}
            <View style={styles.tagsRow}>
              {entry.tags.map((tag, ti) => (
                <View key={ti} style={styles.tag}>
                  <AppText variant="small" color={Colors.textSecondary}>
                    {tag}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        </View>
      ))}

      {/* ─── 5. Migraine Pattern Insight ─────── */}
      <View style={styles.insightPink}>
        <AppText variant="body" color="#7C2D5B" style={{lineHeight: ms(20)}}>
          Perimenstrual migraine — confirmed pattern. Days 25-28 migraine in Nov 2025,
          Feb 2026, and today is Day 24. Classic estrogen-withdrawal migraine.
        </AppText>
      </View>

      <View style={{height: vs(80)}} />
    </ScrollView>
  );
};

/* ─── Styles ───────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingTop: vs(8),
  },
  sectionLabel: {
    marginTop: vs(20),
    marginBottom: vs(8),
  },

  /* Stats row */
  statsRow: {
    flexDirection: 'row',
    gap: s(8),
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: s(10),
    alignItems: 'center',
  },

  /* Insight cards */
  insightGreen: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(14),
    padding: s(14),
    marginTop: vs(12),
  },
  insightPink: {
    backgroundColor: '#FEF0F6',
    borderRadius: ms(14),
    padding: s(14),
    marginTop: vs(20),
  },

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },

  /* Bar chart */
  chartArea: {
    padding: s(14),
    paddingBottom: vs(4),
  },
  refLineContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  refLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
    borderStyle: 'dashed',
  },
  refLabel: {
    marginLeft: s(6),
  },
  barsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingTop: vs(8),
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barValue: {
    marginBottom: vs(4),
    fontWeight: '600',
  },
  bar: {
    width: s(22),
    borderRadius: ms(6),
  },
  barLabel: {
    marginTop: vs(4),
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(16),
    paddingVertical: vs(10),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    marginTop: vs(8),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  legendDot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
  },

  /* Previous cycles */
  historyBlock: {
    marginBottom: vs(12),
  },
  monthSeparator: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
    gap: s(8),
  },
  monthLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: Colors.borderLight,
  },
  monthLabel: {
    marginHorizontal: s(4),
  },
  monthBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(12),
  },
  historyHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: s(14),
  },
  statusBadge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(10),
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    paddingHorizontal: s(14),
    paddingBottom: s(14),
  },
  tag: {
    backgroundColor: Colors.background,
    borderRadius: ms(20),
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
  },
});

export default HistoryTab;
