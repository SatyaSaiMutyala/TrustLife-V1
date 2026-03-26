import React, {useMemo} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {
  WEEK_DATA,
  THIRTY_DAY_STEPS,
  ACT_BREAKDOWN,
  PERSONAL_BESTS,
  TRENDS_HR_ZONES as HR_ZONES,
  HR_DAILY,
  WEEKLY_SUMMARY,
} from '../../../constants/movementData';

/* ─── Helpers ───────────────────────────────────────── */

const fmtNum = (n) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  return `${n}`;
};

const DAYS_SHORT = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

/* ─── Sub-components ────────────────────────────────── */

const ProgressBar = ({value, max, color, height}) => {
  const pct = max > 0 ? Math.min(value / max, 1) : 0;
  return (
    <View style={[sty.progressTrack, {height: height || vs(6)}]}>
      <View
        style={[
          sty.progressFill,
          {width: `${pct * 100}%`, backgroundColor: color || Colors.accent, height: height || vs(6)},
        ]}
      />
    </View>
  );
};

const SummaryCard = ({label, value, unit, progress, goal, goalLabel, color}) => (
  <View style={sty.summaryCard}>
    <AppText variant="small" color={Colors.textTertiary}>{label}</AppText>
    <View style={sty.summaryValueRow}>
      <AppText variant="bodyBold" color={Colors.textPrimary}>
        {value}
      </AppText>
      {unit ? (
        <AppText variant="small" color={Colors.textTertiary}> {unit}</AppText>
      ) : null}
    </View>
    <ProgressBar value={progress} max={goal} color={color} />
    <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(3)}}>
      {goalLabel}
    </AppText>
  </View>
);

/* ─── Main Component ───────────────────────────────── */

const TrendsTab = () => {
  const todayIdx = useMemo(() => new Date().getDay(), []);
  // Convert Sunday=0 to Mon-based index: Mon=0 ... Sun=6
  const todayMonIdx = todayIdx === 0 ? 6 : todayIdx - 1;

  const maxSteps = useMemo(
    () => Math.max(...(WEEK_DATA || []).map((d) => d.steps || 0), 1),
    [],
  );

  const maxThirtyDay = useMemo(
    () => Math.max(...(THIRTY_DAY_STEPS || [0]), 1),
    [],
  );

  const maxActMinutes = useMemo(
    () => Math.max(...(ACT_BREAKDOWN || []).map((a) => a.mins || 0), 1),
    [],
  );

  const totalZoneMinutes = useMemo(
    () => (HR_ZONES || []).reduce((sum, z) => sum + (z.mins || 0), 0) || 1,
    [],
  );

  const hrDailyObjects = useMemo(() => {
    if (!HR_DAILY || HR_DAILY.length === 0) return [];
    const labels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return HR_DAILY.map((item, idx) => {
      if (typeof item === 'number') {
        return {label: labels[idx] || '', total: item, zones: []};
      }
      return {label: item.label || labels[idx] || '', total: item.total || 0, zones: item.zones || []};
    });
  }, []);

  const maxDailyHR = useMemo(
    () => Math.max(...hrDailyObjects.map((d) => d.total), 1),
    [hrDailyObjects],
  );

  const summary = WEEKLY_SUMMARY || {};

  return (
    <ScrollView style={sty.container} showsVerticalScrollIndicator={false}>
      {/* ─── 1. Streak Card ───────────────────────── */}
      <View style={sty.streakCard}>
        <View style={sty.streakTop}>
          <AppText style={{fontSize: ms(36)}}>{'🔥'}</AppText>
          <View style={{marginLeft: s(12), flex: 1}}>
            <AppText variant="header" color={Colors.white}>
              9 days
            </AppText>
            <AppText variant="caption" color="rgba(255,255,255,0.7)">
              You've hit your step goal 9 days in a row!
            </AppText>
          </View>
        </View>
        <View style={sty.streakBest}>
          <AppText variant="small" color="rgba(255,255,255,0.5)">
            Personal best
          </AppText>
          <AppText variant="bodyBold" color={Colors.white}>
            {'🏆'} 21 days
          </AppText>
        </View>
      </View>

      {/* ─── 2. Last 7 Days Strip ─────────────────── */}
      <View style={sty.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          Last 7 Days
        </AppText>
        <View style={sty.weekStrip}>
          {(WEEK_DATA || []).map((day, idx) => {
            const pct = maxSteps > 0 ? Math.min(day.steps / maxSteps, 1) : 0;
            const isToday = idx === todayMonIdx;
            return (
              <View
                key={idx}
                style={[sty.dayCol, isToday && sty.dayColToday]}>
                <AppText
                  variant="small"
                  color={Colors.textSecondary}
                  style={{fontWeight: '600', marginBottom: vs(4)}}>
                  {fmtNum(day.steps)}
                </AppText>
                <View style={sty.dayBarTrack}>
                  <View
                    style={[
                      sty.dayBarFill,
                      {
                        height: `${pct * 100}%`,
                        backgroundColor: isToday ? Colors.accent : Colors.lightGreen,
                      },
                    ]}
                  />
                </View>
                <AppText
                  variant="small"
                  color={isToday ? Colors.accent : Colors.textTertiary}
                  style={{marginTop: vs(4), fontWeight: isToday ? '700' : '400'}}>
                  {day.day || day.label}
                </AppText>
              </View>
            );
          })}
        </View>
      </View>

      {/* ─── 3. Weekly Summary ────────────────────── */}
      <View style={sty.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          Weekly Summary
        </AppText>
        <View style={sty.summaryGrid}>
          <SummaryCard
            label="Total Steps"
            value={fmtNum(summary.totalSteps || 0)}
            progress={summary.totalSteps || 0}
            goal={summary.stepGoalWeekly || 56000}
            goalLabel={`Goal: ${fmtNum(summary.stepGoalWeekly || 56000)} / wk`}
            color={Colors.accent}
          />
          <SummaryCard
            label="Distance"
            value={(summary.totalDist || 0).toFixed(1)}
            unit="km"
            progress={summary.totalDist || 0}
            goal={summary.distGoalWeekly || 50}
            goalLabel={`Goal: ${summary.distGoalWeekly || 50} km / wk`}
            color={Colors.blue}
          />
          <SummaryCard
            label="Calories Burned"
            value={fmtNum(summary.totalCals || 0)}
            unit="kcal"
            progress={summary.totalCals || 0}
            goal={summary.calGoalWeekly || 3500}
            goalLabel={`Goal: ${fmtNum(summary.calGoalWeekly || 3500)} / wk`}
            color={Colors.amber}
          />
          <SummaryCard
            label="Active Minutes"
            value={summary.totalMins || 0}
            unit="min"
            progress={summary.totalMins || 0}
            goal={summary.minGoalWeekly || 150}
            goalLabel={`WHO: ${summary.minGoalWeekly || 150} min / wk`}
            color={Colors.purple}
          />
        </View>
      </View>

      {/* ─── 4. 30-Day Step Trend ─────────────────── */}
      <View style={sty.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          30-Day Step Trend
        </AppText>
        <View style={sty.trendCard}>
          {/* Goal line */}
          <View
            style={[
              sty.goalLine,
              {bottom: `${(8000 / maxThirtyDay) * 100}%`},
            ]}>
            <View style={sty.goalLineDash} />
            <AppText variant="small" color={Colors.red} style={{marginLeft: s(4)}}>
              8k goal
            </AppText>
          </View>
          <View style={sty.trendBars}>
            {(THIRTY_DAY_STEPS || []).map((steps, idx) => {
              const pct = maxThirtyDay > 0 ? Math.min(steps / maxThirtyDay, 1) : 0;
              const metGoal = steps >= 8000;
              return (
                <View key={idx} style={sty.trendBarCol}>
                  <View
                    style={[
                      sty.trendBarFill,
                      {
                        height: `${pct * 100}%`,
                        backgroundColor: metGoal ? Colors.accent : Colors.paleGreen,
                      },
                    ]}
                  />
                </View>
              );
            })}
          </View>
          <View style={sty.trendLabels}>
            <AppText variant="small" color={Colors.textTertiary}>30d ago</AppText>
            <AppText variant="small" color={Colors.textTertiary}>15d ago</AppText>
            <AppText variant="small" color={Colors.textTertiary}>Today</AppText>
          </View>
        </View>
      </View>

      {/* ─── 5. Activity Breakdown ────────────────── */}
      <View style={sty.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          Activity Breakdown
        </AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          Last 30 days
        </AppText>
        {(ACT_BREAKDOWN || []).map((act, idx) => (
          <View key={idx} style={sty.actRow}>
            <AppText style={{fontSize: ms(18), width: s(28)}}>{act.ico || act.icon}</AppText>
            <View style={{flex: 1}}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>
                {act.name}
              </AppText>
              <View style={sty.actBarTrack}>
                <View
                  style={[
                    sty.actBarFill,
                    {
                      width: `${((act.mins || act.minutes || 0) / maxActMinutes) * 100}%`,
                      backgroundColor: act.col || act.color || Colors.accent,
                    },
                  ]}
                />
              </View>
            </View>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginLeft: s(8), width: s(52), textAlign: 'right'}}>
              {act.mins || act.minutes || 0}
              <AppText variant="small" color={Colors.textTertiary}> min</AppText>
            </AppText>
          </View>
        ))}
      </View>

      {/* ─── 6. Heart Rate Zones ──────────────────── */}
      <View style={sty.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          Heart Rate Zones
        </AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          Last 7 days
        </AppText>

        {/* Stacked horizontal bar */}
        <View style={sty.hrCard}>
          <View style={sty.stackedBar}>
            {(HR_ZONES || []).map((zone, idx) => {
              const zoneMins = zone.mins || zone.minutes || 0;
              const pct = (zoneMins / totalZoneMinutes) * 100;
              return (
                <View
                  key={idx}
                  style={[
                    sty.stackedSegment,
                    {
                      width: `${pct}%`,
                      backgroundColor: zone.col || zone.color,
                      borderTopLeftRadius: idx === 0 ? ms(6) : 0,
                      borderBottomLeftRadius: idx === 0 ? ms(6) : 0,
                      borderTopRightRadius: idx === (HR_ZONES || []).length - 1 ? ms(6) : 0,
                      borderBottomRightRadius: idx === (HR_ZONES || []).length - 1 ? ms(6) : 0,
                    },
                  ]}
                />
              );
            })}
          </View>

          {/* Zone legend */}
          <View style={sty.zoneLegend}>
            {(HR_ZONES || []).map((zone, idx) => {
              const zoneMins = zone.mins || zone.minutes || 0;
              return (
                <View key={idx} style={sty.zoneRow}>
                  <View style={[sty.zoneDot, {backgroundColor: zone.col || zone.color}]} />
                  <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1}}>
                    {zone.name}
                  </AppText>
                  <AppText variant="small" color={Colors.textSecondary} style={{width: s(45), textAlign: 'right'}}>
                    {zoneMins} min
                  </AppText>
                  <AppText variant="small" color={Colors.textTertiary} style={{width: s(38), textAlign: 'right'}}>
                    {Math.round((zoneMins / totalZoneMinutes) * 100)}%
                  </AppText>
                </View>
              );
            })}
          </View>

          {/* Daily breakdown bars */}
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(14), marginBottom: vs(6)}}>
            Daily breakdown
          </AppText>
          {hrDailyObjects.map((day, idx) => (
            <View key={idx} style={sty.hrDayRow}>
              <AppText variant="small" color={Colors.textTertiary} style={{width: s(30)}}>
                {day.label}
              </AppText>
              <View style={sty.hrDayBarTrack}>
                {day.zones && day.zones.length > 0 ? (
                  (HR_ZONES || []).map((zone, zi) => {
                    const val = day.zones[zi] || 0;
                    const pct = maxDailyHR > 0 ? (val / maxDailyHR) * 100 : 0;
                    return (
                      <View
                        key={zi}
                        style={{
                          width: `${pct}%`,
                          height: '100%',
                          backgroundColor: zone.col || zone.color,
                        }}
                      />
                    );
                  })
                ) : (
                  <View
                    style={{
                      width: `${maxDailyHR > 0 ? (day.total / maxDailyHR) * 100 : 0}%`,
                      height: '100%',
                      backgroundColor: Colors.accent,
                    }}
                  />
                )}
              </View>
              <AppText variant="small" color={Colors.textSecondary} style={{width: s(36), textAlign: 'right'}}>
                {day.total}m
              </AppText>
            </View>
          ))}
        </View>
      </View>

      {/* ─── 7. Personal Bests ────────────────────── */}
      <View style={sty.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          Personal Bests
        </AppText>
        {(PERSONAL_BESTS || []).map((pb, idx) => (
          <View key={idx} style={sty.pbRow}>
            <AppText style={{fontSize: ms(18)}}>{pb.ico || '🏆'}</AppText>
            <View style={{flex: 1, marginLeft: s(10)}}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>
                {pb.metric}
              </AppText>
              <AppText variant="small" color={Colors.textTertiary}>
                {pb.date}
              </AppText>
            </View>
            <AppText variant="bodyBold" color={Colors.accent}>
              {pb.val || pb.value}
            </AppText>
          </View>
        ))}
      </View>

      <View style={{height: vs(40)}} />
    </ScrollView>
  );
};

/* ─── Styles ───────────────────────────────────────── */

const sty = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingTop: vs(8),
  },

  /* Progress bar */
  progressTrack: {
    width: '100%',
    backgroundColor: Colors.background,
    borderRadius: ms(4),
    overflow: 'hidden',
    marginTop: vs(4),
  },
  progressFill: {
    borderRadius: ms(4),
  },

  /* Section */
  section: {
    marginTop: vs(22),
  },

  /* ── 1. Streak Card ── */
  streakCard: {
    borderRadius: ms(16),
    padding: s(16),
    marginTop: vs(4),
    backgroundColor: Colors.amber,
    overflow: 'hidden',
  },
  streakTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  streakBest: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: vs(12),
    paddingTop: vs(10),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.2)',
  },

  /* ── 2. Last 7 Days Strip ── */
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(10),
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(12),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  dayCol: {
    alignItems: 'center',
    flex: 1,
  },
  dayColToday: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(8),
    paddingVertical: vs(4),
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  dayBarTrack: {
    width: s(14),
    height: vs(70),
    backgroundColor: Colors.background,
    borderRadius: ms(7),
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  dayBarFill: {
    width: '100%',
    borderRadius: ms(7),
    minHeight: vs(3),
  },

  /* ── 3. Weekly Summary Grid ── */
  summaryGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
    marginTop: vs(10),
  },
  summaryCard: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(12),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  summaryValueRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginTop: vs(2),
    marginBottom: vs(2),
  },

  /* ── 4. 30-Day Step Trend ── */
  trendCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(14),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    position: 'relative',
    overflow: 'hidden',
  },
  goalLine: {
    position: 'absolute',
    left: s(10),
    right: s(10),
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  goalLineDash: {
    flex: 1,
    height: 1.5,
    backgroundColor: Colors.red,
    opacity: 0.5,
  },
  trendBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: vs(110),
    gap: s(2),
    paddingTop: vs(10),
  },
  trendBarCol: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  trendBarFill: {
    width: '100%',
    borderRadius: ms(2),
    minHeight: vs(2),
  },
  trendLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(6),
  },

  /* ── 5. Activity Breakdown ── */
  actRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  actBarTrack: {
    height: vs(8),
    backgroundColor: Colors.background,
    borderRadius: ms(4),
    overflow: 'hidden',
    marginTop: vs(4),
  },
  actBarFill: {
    height: '100%',
    borderRadius: ms(4),
    minWidth: s(4),
  },

  /* ── 6. Heart Rate Zones ── */
  hrCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(14),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  stackedBar: {
    flexDirection: 'row',
    height: vs(16),
    borderRadius: ms(6),
    overflow: 'hidden',
  },
  stackedSegment: {
    height: '100%',
  },
  zoneLegend: {
    marginTop: vs(12),
    gap: vs(6),
  },
  zoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  zoneDot: {
    width: s(10),
    height: s(10),
    borderRadius: s(5),
  },
  hrDayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(5),
  },
  hrDayBarTrack: {
    flex: 1,
    height: vs(10),
    backgroundColor: Colors.background,
    borderRadius: ms(5),
    overflow: 'hidden',
    marginHorizontal: s(6),
    flexDirection: 'row',
  },

  /* ── 7. Personal Bests ── */
  pbRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(12),
    marginTop: vs(6),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
});

export default TrendsTab;
