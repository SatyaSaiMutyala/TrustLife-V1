import React, {useMemo} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';

import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {
  HOURLY_STEPS,
  TODAY_ACTIVITIES,
  STAND_HOURS,
  DASHBOARD_METRICS,
  AYU_INSIGHT,
  GLUCOSE_IMPACT,
  ACTIVITIES,
} from '../../../constants/movementData';

const ZONE_COLORS = {
  Easy: {bg: '#E6F1FB', color: '#0C447C'},
  Aerobic: {bg: '#FAEEDA', color: '#854F0B'},
  Threshold: {bg: '#FCEBEB', color: '#A32D2D'},
  Hard: {bg: '#FCEBEB', color: '#791F1F'},
  Max: {bg: '#EEEDFE', color: '#3C3489'},
};

const mapActivities = (raw) =>
  (raw || []).map((a) => {
    const def = (ACTIVITIES || []).find((x) => x.id === a.actId) || {};
    const zc = ZONE_COLORS[a.zone] || ZONE_COLORS.Easy;
    return {
      ...a,
      icon: def.ico || '🚶',
      steps: a.steps || 0,
      distance: a.dist ? `${a.dist} km` : '—',
      calories: a.kcal || 0,
      duration: `${a.duration} min`,
      zone: a.zone || 'Easy',
      zoneBg: zc.bg,
      zoneColor: zc.color,
      postMeal: a.postMeal ? 'Post-meal' : null,
    };
  });

/* ─── Constants ─────────────────────────────────────── */

const RING_SIZE = ms(190);
const RING_THICKNESS = ms(12);
const INNER_RING_SIZE = RING_SIZE - RING_THICKNESS * 2 - ms(6);
const INNERMOST_RING_SIZE = INNER_RING_SIZE - RING_THICKNESS * 2 - ms(6);

const BAR_MAX_HEIGHT = vs(70);
const BAR_WIDTH = s(6);

const HOUR_LABELS = [
  {index: 0, label: '12AM'},
  {index: 6, label: '6AM'},
  {index: 12, label: '12PM'},
  {index: 18, label: '6PM'},
  {index: 23, label: '11PM'},
];

/* ─── Helpers ───────────────────────────────────────── */

const pct = (current, goal) => Math.min(Math.round((current / goal) * 100), 100);

const barColor = (steps) => {
  if (steps === 0) return Colors.borderLight;
  if (steps < 200) return Colors.paleGreen;
  if (steps < 500) return Colors.lightGreen;
  if (steps < 800) return Colors.accent;
  return Colors.primary;
};

const formatHour = (h) => {
  if (h === 0) return '12AM';
  if (h < 12) return `${h}AM`;
  if (h === 12) return '12PM';
  return `${h - 12}PM`;
};

/* ─── Sub-components ────────────────────────────────── */

/** Circular progress ring using View border approach */
const ProgressRing = ({size, thickness, progress, color, bgColor, children, style}) => {
  const clampedProgress = Math.min(Math.max(progress, 0), 100);
  const rotation = (clampedProgress / 100) * 360;

  return (
    <View
      style={[
        {
          width: size,
          height: size,
          borderRadius: size / 2,
          backgroundColor: bgColor || Colors.borderLight,
          alignItems: 'center',
          justifyContent: 'center',
        },
        style,
      ]}>
      {/* Background ring */}
      <View
        style={{
          position: 'absolute',
          width: size,
          height: size,
          borderRadius: size / 2,
          borderWidth: thickness,
          borderColor: bgColor || 'rgba(0,0,0,0.06)',
        }}
      />

      {/* Progress arc - left half */}
      {clampedProgress > 0 && (
        <View
          style={{
            position: 'absolute',
            width: size,
            height: size,
            borderRadius: size / 2,
            borderWidth: thickness,
            borderColor: 'transparent',
            borderTopColor: color,
            borderRightColor: rotation > 90 ? color : 'transparent',
            borderBottomColor: rotation > 180 ? color : 'transparent',
            borderLeftColor: rotation > 270 ? color : 'transparent',
            transform: [{rotateZ: '-90deg'}],
          }}
        />
      )}

      {/* Inner fill to create ring effect */}
      <View
        style={{
          width: size - thickness * 2,
          height: size - thickness * 2,
          borderRadius: (size - thickness * 2) / 2,
          backgroundColor: Colors.white,
          alignItems: 'center',
          justifyContent: 'center',
        }}>
        {children}
      </View>
    </View>
  );
};

/** Metric card for active mins, calories, distance */
const MetricCard = ({label, current, goal, unit, color, bgColor}) => {
  const percentage = pct(current, goal);

  return (
    <View style={[styles.metricCard, {borderLeftColor: color, borderLeftWidth: ms(3)}]}>
      <View style={[styles.metricIconDot, {backgroundColor: bgColor}]}>
        <View style={[styles.metricInnerDot, {backgroundColor: color}]} />
      </View>
      <AppText variant="bodyBold" style={styles.metricValue}>
        {current}
        <AppText variant="small" color={Colors.textTertiary}>
          /{goal} {unit}
        </AppText>
      </AppText>
      <AppText variant="small" color={Colors.textSecondary}>
        {label}
      </AppText>
      {/* Mini progress bar */}
      <View style={styles.miniProgressBg}>
        <View
          style={[
            styles.miniProgressFill,
            {width: `${percentage}%`, backgroundColor: color},
          ]}
        />
      </View>
      <AppText variant="small" color={Colors.textTertiary} style={styles.metricPct}>
        {percentage}%
      </AppText>
    </View>
  );
};

/** Single activity row */
const ActivityCard = ({activity}) => (
  <View style={styles.activityCard}>
    <View style={styles.activityLeft}>
      <AppText style={styles.activityIcon}>{activity.icon}</AppText>
      <View style={styles.activityInfo}>
        <View style={styles.activityNameRow}>
          <AppText variant="bodyBold" style={styles.activityName}>
            {activity.name}
          </AppText>
          {activity.postMeal && (
            <View style={styles.postMealBadge}>
              <AppText variant="small" style={styles.postMealText}>
                {activity.postMeal}
              </AppText>
            </View>
          )}
        </View>
        <AppText variant="small" color={Colors.textSecondary}>
          {activity.time} {'\u00B7'} {activity.duration}
        </AppText>
      </View>
    </View>

    <View style={styles.activityStats}>
      <View style={styles.activityStatRow}>
        <AppText variant="small" color={Colors.textTertiary}>
          {'\uD83D\uDEB6'} {activity.steps.toLocaleString()} steps
        </AppText>
        <AppText variant="small" color={Colors.textTertiary}>
          {'\uD83D\uDCCF'} {activity.distance}
        </AppText>
      </View>
      <View style={styles.activityStatRow}>
        <AppText variant="small" color={Colors.textTertiary}>
          {'\uD83D\uDD25'} {activity.calories} kcal
        </AppText>
        <View style={[styles.zoneBadge, {backgroundColor: activity.zoneBg}]}>
          <AppText variant="small" style={[styles.zoneText, {color: activity.zoneColor}]}>
            {activity.zone}
          </AppText>
        </View>
      </View>
    </View>
  </View>
);

/** Stand hour dot indicator */
const StandDot = ({item}) => (
  <View style={styles.standDotCol}>
    <View
      style={[
        styles.standDot,
        {
          backgroundColor: item.stood ? Colors.accent : Colors.borderLight,
        },
      ]}
    />
    <AppText
      variant="small"
      color={item.stood ? Colors.textSecondary : Colors.textTertiary}
      style={styles.standLabel}>
      {formatHour(item.hour)}
    </AppText>
  </View>
);

/* ─── Main Component ────────────────────────────────── */

const DashboardTab = ({stepGoal = 8000, activeMinGoal = 60, calorieGoal = 500, distanceGoal = 7}) => {
  const metrics = DASHBOARD_METRICS;

  const stepPct = useMemo(() => pct(metrics.steps.current, stepGoal), [stepGoal]);
  const activeMinPct = useMemo(() => pct(metrics.activeMinutes.current, activeMinGoal), [activeMinGoal]);
  const calPct = useMemo(() => pct(metrics.calories.current, calorieGoal), [calorieGoal]);

  const peakHour = useMemo(() => {
    let max = 0;
    let peak = 0;
    HOURLY_STEPS.forEach((h) => {
      if (h.steps > max) {
        max = h.steps;
        peak = h.hour;
      }
    });
    return {hour: peak, steps: max};
  }, []);

  const maxStepsInHour = useMemo(
    () => Math.max(...HOURLY_STEPS.map((h) => h.steps), 1),
    [],
  );

  const stoodCount = useMemo(
    () => STAND_HOURS.filter((h) => h.stood).length,
    [],
  );

  return (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* ── 1. Step Ring ──────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.ringContainer}>
          {/* Outer ring: Steps (teal) */}
          <ProgressRing
            size={RING_SIZE}
            thickness={RING_THICKNESS}
            progress={stepPct}
            color={Colors.accent}
            bgColor="rgba(29,158,117,0.1)">
            {/* Middle ring: Active minutes (blue) */}
            <ProgressRing
              size={INNER_RING_SIZE}
              thickness={RING_THICKNESS}
              progress={activeMinPct}
              color={Colors.blue}
              bgColor="rgba(55,138,221,0.1)">
              {/* Inner ring: Calories (amber) */}
              <ProgressRing
                size={INNERMOST_RING_SIZE}
                thickness={RING_THICKNESS}
                progress={calPct}
                color={Colors.amber}
                bgColor="rgba(186,117,23,0.1)">
                {/* Center content */}
                <View style={styles.ringCenter}>
                  <AppText variant="body" style={styles.ringStepCount}>
                    {metrics.steps.current.toLocaleString()}
                  </AppText>
                  <AppText variant="small" color={Colors.textSecondary}>
                    of {stepGoal.toLocaleString()} steps
                  </AppText>
                  <AppText
                    variant="small"
                    color={Colors.accent}
                    style={styles.ringPctLabel}>
                    {stepPct}%
                  </AppText>
                </View>
              </ProgressRing>
            </ProgressRing>
          </ProgressRing>

          {/* Ring legend */}
          <View style={styles.ringLegend}>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: Colors.accent}]} />
              <AppText variant="small" color={Colors.textSecondary}>
                Steps
              </AppText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: Colors.blue}]} />
              <AppText variant="small" color={Colors.textSecondary}>
                Active min
              </AppText>
            </View>
            <View style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: Colors.amber}]} />
              <AppText variant="small" color={Colors.textSecondary}>
                Calories
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* ── 2. Metric Cards ──────────────────────────── */}
      <View style={styles.metricsRow}>
        <MetricCard
          label="Active min"
          current={metrics.activeMinutes.current}
          goal={activeMinGoal}
          unit="min"
          color={Colors.blue}
          bgColor={Colors.blueBg}
        />
        <MetricCard
          label="Calories"
          current={metrics.calories.current}
          goal={calorieGoal}
          unit="kcal"
          color={Colors.amber}
          bgColor={Colors.amberBg}
        />
        <MetricCard
          label="Distance"
          current={metrics.distance.current}
          goal={distanceGoal}
          unit="km"
          color={Colors.accent}
          bgColor={Colors.tealBg}
        />
      </View>

      {/* ── 3. Hourly Steps Bar Chart ────────────────── */}
      <View style={styles.card}>
        <View style={styles.chartHeader}>
          <AppText variant="bodyBold">Hourly steps</AppText>
          <AppText variant="small" color={Colors.textTertiary}>
            Peak: {peakHour.steps.toLocaleString()} at {formatHour(peakHour.hour)}
          </AppText>
        </View>

        <View style={styles.chartArea}>
          {/* Bars */}
          <View style={styles.barsRow}>
            {HOURLY_STEPS.map((h) => {
              const height = h.steps > 0
                ? Math.max((h.steps / maxStepsInHour) * BAR_MAX_HEIGHT, vs(3))
                : vs(3);
              return (
                <View key={h.hour} style={styles.barCol}>
                  <View style={styles.barSlot}>
                    <View
                      style={[
                        styles.bar,
                        {
                          height,
                          backgroundColor: barColor(h.steps),
                          borderRadius: ms(3),
                        },
                      ]}
                    />
                  </View>
                </View>
              );
            })}
          </View>

          {/* Hour labels */}
          <View style={styles.hourLabelsRow}>
            {HOUR_LABELS.map((hl) => (
              <AppText
                key={hl.index}
                variant="small"
                color={Colors.textTertiary}
                style={styles.hourLabel}>
                {hl.label}
              </AppText>
            ))}
          </View>
        </View>

        {/* Total steps summary */}
        <View style={styles.chartFooter}>
          <AppText variant="small" color={Colors.textSecondary}>
            Total: {metrics.steps.current.toLocaleString()} steps across{' '}
            {HOURLY_STEPS.filter((h) => h.steps > 0).length} active hours
          </AppText>
        </View>
      </View>

      {/* ── 4. Ayu Insight Card ──────────────────────── */}
      <View style={styles.ayuCard}>
        <View style={styles.ayuHeader}>
          <AppText style={styles.ayuAvatar}>{typeof AYU_INSIGHT === 'object' ? (AYU_INSIGHT.avatar || '🧑‍⚕️') : '🧑‍⚕️'}</AppText>
          <View style={styles.ayuTitleWrap}>
            <AppText variant="bodyBold" color={Colors.tealText}>
              Ayu says
            </AppText>
            <View style={styles.ayuAiBadge}>
              <AppText variant="small" style={styles.ayuAiText}>
                AI insight
              </AppText>
            </View>
          </View>
        </View>
        <AppText variant="body" color={Colors.tealText} style={styles.ayuMessage}>
          {typeof AYU_INSIGHT === 'string' ? AYU_INSIGHT : (AYU_INSIGHT?.message || '')}
        </AppText>
      </View>

      {/* ── 5. Today's Activities ────────────────────── */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold">Today{'\u2019'}s Activities</AppText>
          <AppText variant="small" color={Colors.textTertiary}>
            {TODAY_ACTIVITIES.length} activities
          </AppText>
        </View>

        {mapActivities(TODAY_ACTIVITIES).map((act, idx) => (
          <React.Fragment key={act.actId || idx}>
            <ActivityCard activity={act} />
            {idx < TODAY_ACTIVITIES.length - 1 && <View style={styles.divider} />}
          </React.Fragment>
        ))}
      </View>

      {/* ── 6. Glucose Impact Badge ──────────────────── */}
      <View style={styles.glucoseCard}>
        <View style={styles.glucoseRow}>
          <View style={styles.glucoseLeft}>
            <AppText style={styles.glucoseIcon}>{'\uD83E\uDE78'}</AppText>
            <View>
              <AppText variant="bodyBold" color={Colors.tealText}>
                {GLUCOSE_IMPACT?.reduction || 0} mg/dL glucose reduction
              </AppText>
              <AppText variant="small" color={Colors.tealText} style={styles.glucoseLabel}>
                {GLUCOSE_IMPACT?.label || GLUCOSE_IMPACT?.note || ''}
              </AppText>
            </View>
          </View>
        </View>
        <AppText variant="small" color={Colors.textSecondary} style={styles.glucoseDetail}>
          {GLUCOSE_IMPACT?.detail || GLUCOSE_IMPACT?.note || ''}
        </AppText>
      </View>

      {/* ── 7. Stand Hours ───────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold">Stand Hours</AppText>
          <AppText variant="small" color={Colors.textTertiary}>
            {stoodCount}/{STAND_HOURS.length} hours
          </AppText>
        </View>

        <View style={styles.standGrid}>
          {STAND_HOURS.map((item) => (
            <StandDot key={item.hour} item={item} />
          ))}
        </View>

        <View style={styles.standLegend}>
          <View style={styles.standLegendItem}>
            <View style={[styles.standLegendDot, {backgroundColor: Colors.accent}]} />
            <AppText variant="small" color={Colors.textSecondary}>
              Stood
            </AppText>
          </View>
          <View style={styles.standLegendItem}>
            <View style={[styles.standLegendDot, {backgroundColor: Colors.borderLight}]} />
            <AppText variant="small" color={Colors.textSecondary}>
              Sedentary
            </AppText>
          </View>
        </View>
      </View>

      {/* Bottom spacing */}
      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

/* ── STYLES ──────────────────────────────────────────── */
const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: s(16),
    paddingTop: vs(16),
  },

  /* Card base */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: ms(16),
    marginBottom: vs(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },

  /* ── 1. Step Ring ─────────────────────────────────── */
  ringContainer: {
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringStepCount: {
    fontSize: ms(38),
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: ms(42),
  },
  ringPctLabel: {
    fontSize: ms(13),
    fontWeight: '700',
    marginTop: vs(2),
  },
  ringLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(20),
    marginTop: vs(16),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  legendDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },

  /* ── 2. Metric Cards ─────────────────────────────── */
  metricsRow: {
    flexDirection: 'row',
    gap: s(10),
    marginBottom: vs(14),
  },
  metricCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  metricIconDot: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(6),
  },
  metricInnerDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
  },
  metricValue: {
    fontSize: ms(15),
    marginBottom: vs(2),
  },
  miniProgressBg: {
    height: vs(4),
    backgroundColor: Colors.borderLight,
    borderRadius: ms(2),
    marginTop: vs(6),
    overflow: 'hidden',
  },
  miniProgressFill: {
    height: '100%',
    borderRadius: ms(2),
  },
  metricPct: {
    fontSize: ms(10),
    marginTop: vs(3),
    textAlign: 'right',
  },

  /* ── 3. Hourly Bar Chart ─────────────────────────── */
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(14),
  },
  chartArea: {
    marginBottom: vs(8),
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
    height: BAR_MAX_HEIGHT + vs(4),
    paddingHorizontal: s(2),
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barSlot: {
    justifyContent: 'flex-end',
    height: BAR_MAX_HEIGHT,
  },
  bar: {
    width: BAR_WIDTH,
    minHeight: vs(3),
  },
  hourLabelsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(8),
    paddingHorizontal: s(2),
  },
  hourLabel: {
    fontSize: ms(9),
  },
  chartFooter: {
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    paddingTop: vs(8),
  },

  /* ── 4. Ayu Insight ──────────────────────────────── */
  ayuCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(14),
    padding: ms(16),
    marginBottom: vs(14),
    borderWidth: 1,
    borderColor: Colors.lightGreen,
  },
  ayuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  ayuAvatar: {
    fontSize: ms(28),
    marginRight: s(10),
  },
  ayuTitleWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  ayuAiBadge: {
    backgroundColor: 'rgba(29,158,117,0.15)',
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  ayuAiText: {
    color: Colors.tealText,
    fontSize: ms(10),
    fontWeight: '600',
  },
  ayuMessage: {
    fontSize: ms(13),
    lineHeight: ms(20),
  },

  /* ── 5. Activities ───────────────────────────────── */
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  activityCard: {
    paddingVertical: vs(10),
  },
  activityLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  activityIcon: {
    fontSize: ms(24),
    marginRight: s(10),
  },
  activityInfo: {
    flex: 1,
  },
  activityNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginBottom: vs(2),
  },
  activityName: {
    fontSize: ms(14),
  },
  postMealBadge: {
    backgroundColor: Colors.amberBg,
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  postMealText: {
    color: Colors.amberText,
    fontSize: ms(10),
    fontWeight: '600',
  },
  activityStats: {
    marginLeft: s(34),
    gap: vs(4),
  },
  activityStatRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(16),
  },
  zoneBadge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  zoneText: {
    fontSize: ms(10),
    fontWeight: '600',
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.borderLight,
  },

  /* ── 6. Glucose Impact ───────────────────────────── */
  glucoseCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(14),
    padding: ms(16),
    marginBottom: vs(14),
    borderWidth: 1,
    borderColor: Colors.lightGreen,
  },
  glucoseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  glucoseLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  glucoseIcon: {
    fontSize: ms(28),
  },
  glucoseLabel: {
    marginTop: vs(2),
  },
  glucoseDetail: {
    marginLeft: s(38),
  },

  /* ── 7. Stand Hours ──────────────────────────────── */
  standGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    justifyContent: 'center',
    marginBottom: vs(12),
  },
  standDotCol: {
    alignItems: 'center',
    width: s(36),
    marginBottom: vs(4),
  },
  standDot: {
    width: ms(14),
    height: ms(14),
    borderRadius: ms(7),
    marginBottom: vs(3),
  },
  standLabel: {
    fontSize: ms(8),
  },
  standLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(20),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    paddingTop: vs(10),
  },
  standLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  standLegendDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },

  /* Spacing */
  bottomSpacer: {
    height: vs(20),
  },
});

export default DashboardTab;
