import React, {useMemo} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';

/* ─── Constants ─────────────────────────────────────── */

const DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const MUSCLE_GROUPS = [
  'Chest', 'Back', 'Shoulders', 'Biceps', 'Triceps', 'Quads',
  'Hamstrings', 'Glutes', 'Calves', 'Core', 'Traps', 'Forearms',
];

const FUNC_GROUPS = [
  {key: 'push', label: 'Push', emoji: '🏋️'},
  {key: 'pull', label: 'Pull', emoji: '🔗'},
  {key: 'legs', label: 'Legs', emoji: '🦵'},
  {key: 'core', label: 'Core', emoji: '🎯'},
  {key: 'fullbody', label: 'Full Body', emoji: '⚡'},
  {key: 'cardio', label: 'Cardio', emoji: '❤️'},
  {key: 'mobility', label: 'Mobility', emoji: '🧘'},
];

const DAY_ICONS = {
  Push: '🏋️',
  Pull: '🔗',
  Legs: '🦵',
  'Full Body': '⚡',
  Rest: '😴',
  Cardio: '🏃',
};

/* ─── Demo Plan Data ───────────────────────────────── */

const DEMO_PLAN = {
  name: 'Hypertrophy – PPL Split',
  weeks: 12,
  startDate: '2026-01-12',
  daysPerWeek: 5,
  currentWeek: 11,
  schedule: [
    {day: 'Mon', type: 'Push', name: 'Push A – Chest Focus', goal: 'Hypertrophy', sets: 22, exercises: 6, muscles: ['Chest', 'Shoulders', 'Triceps']},
    {day: 'Tue', type: 'Pull', name: 'Pull A – Back Width', goal: 'Hypertrophy', sets: 20, exercises: 5, muscles: ['Back', 'Biceps', 'Traps']},
    {day: 'Wed', type: 'Legs', name: 'Legs A – Quad Focus', goal: 'Hypertrophy', sets: 24, exercises: 6, muscles: ['Quads', 'Hamstrings', 'Glutes', 'Calves']},
    {day: 'Thu', type: 'Rest', name: 'Rest / Active Recovery', goal: 'Recovery', sets: 0, exercises: 0, muscles: []},
    {day: 'Fri', type: 'Push', name: 'Push B – Shoulder Focus', goal: 'Strength', sets: 20, exercises: 5, muscles: ['Shoulders', 'Chest', 'Triceps']},
    {day: 'Sat', type: 'Pull', name: 'Pull B – Back Thickness', goal: 'Strength', sets: 18, exercises: 5, muscles: ['Back', 'Biceps', 'Forearms']},
    {day: 'Sun', type: 'Rest', name: 'Rest Day', goal: 'Recovery', sets: 0, exercises: 0, muscles: []},
  ],
};

/* ─── Helpers ───────────────────────────────────────── */

const freqColor = (count) => {
  if (count === 0) return {bg: Colors.redBg, bar: Colors.red, text: Colors.redText};
  if (count === 1) return {bg: Colors.amberBg, bar: Colors.amber, text: Colors.amberText};
  if (count <= 3) return {bg: Colors.tealBg, bar: Colors.accent, text: Colors.tealText};
  return {bg: Colors.purpleBg, bar: Colors.purple, text: Colors.purpleText};
};

const insightColor = (type) => {
  switch (type) {
    case 'good': return {bg: Colors.tealBg, border: Colors.accent, text: Colors.tealText, icon: '✅'};
    case 'warning': return {bg: Colors.amberBg, border: Colors.amber, text: Colors.amberText, icon: '⚠️'};
    case 'info': return {bg: Colors.blueBg, border: Colors.blue, text: Colors.blueText, icon: 'ℹ️'};
    case 'critical': return {bg: Colors.redBg, border: Colors.red, text: Colors.redText, icon: '🚨'};
    default: return {bg: Colors.background, border: Colors.borderLight, text: Colors.textSecondary, icon: '•'};
  }
};

/* ─── Sub-components ────────────────────────────────── */

const OverviewStat = ({label, value, unit}) => (
  <View style={styles.overviewStat}>
    <AppText variant="bodyBold" color={Colors.white}>
      {value}
      {unit ? (
        <AppText variant="small" color="rgba(255,255,255,0.5)"> {unit}</AppText>
      ) : null}
    </AppText>
    <AppText variant="small" color="rgba(255,255,255,0.5)">{label}</AppText>
  </View>
);

const BarChart = ({data, maxVal, barColor}) => (
  <View style={styles.barChartRow}>
    {data.map((item, idx) => {
      const pct = maxVal > 0 ? Math.min(item.value / maxVal, 1) : 0;
      return (
        <View key={idx} style={styles.barChartCol}>
          <View style={styles.barChartTrack}>
            <View
              style={[
                styles.barChartFill,
                {
                  height: `${pct * 100}%`,
                  backgroundColor: item.color || barColor || Colors.accent,
                },
              ]}
            />
          </View>
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(4)}}>
            {item.label}
          </AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{fontWeight: '600'}}>
            {item.value}
          </AppText>
        </View>
      );
    })}
  </View>
);

const DotIndicator = ({count, max}) => (
  <View style={styles.dotRow}>
    {Array.from({length: max}).map((_, i) => (
      <View
        key={i}
        style={[
          styles.dot,
          {backgroundColor: i < count ? Colors.accent : Colors.borderLight},
        ]}
      />
    ))}
  </View>
);

/* ─── Main Component ───────────────────────────────── */

const SummaryTab = ({plan}) => {
  /* Normalise plan: real plans use `days` with {fg, exercises[]}, DEMO_PLAN uses `schedule` */
  const p = useMemo(() => {
    const raw = plan || DEMO_PLAN;
    if (raw.schedule) return raw; // already in DEMO_PLAN format
    // Convert DEFAULT_PLAN format → DEMO_PLAN-like schedule
    const schedule = (raw.days || []).map((d, i) => {
      const dayLabels = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
      const fgToType = {push: 'Push', pull: 'Pull', legs: 'Legs', core: 'Core', fullbody: 'Full Body', cardio: 'Cardio', mobility: 'Mobility', rest: 'Rest'};
      const type = fgToType[d.fg] || 'Push';
      const exCount = (d.exercises || []).length;
      const setCount = (d.exercises || []).reduce((sum, ex) => sum + (ex.sets || 0), 0);
      return {
        day: dayLabels[i % 7] || `D${i + 1}`,
        type,
        name: d.name || d.label || `Day ${i + 1}`,
        goal: d.goal || '',
        sets: setCount,
        exercises: exCount,
        muscles: (d.muscles || []).map((m) => typeof m === 'string' ? m.charAt(0).toUpperCase() + m.slice(1).replace(/_/g, ' ') : m),
      };
    });
    return {
      name: raw.name || 'My Programme',
      weeks: raw.weeks || 8,
      startDate: raw.startDate || '',
      daysPerWeek: raw.daysPerWeek || schedule.filter((s) => s.type !== 'Rest').length,
      currentWeek: raw.currentWeek || null,
      schedule,
    };
  }, [plan]);

  /* Volume per day of week */
  const weeklyVolume = useMemo(() => {
    return (p.schedule || []).map((day) => ({
      label: day.day,
      value: day.sets,
      color: day.type === 'Rest' ? Colors.borderLight : day.type === 'Push' ? Colors.blue : day.type === 'Pull' ? Colors.purple : day.type === 'Legs' ? Colors.amber : Colors.accent,
    }));
  }, [p]);

  const maxSets = useMemo(() => Math.max(...weeklyVolume.map((d) => d.value), 1), [weeklyVolume]);

  /* Muscle frequency */
  const muscleFreq = useMemo(() => {
    const freq = {};
    MUSCLE_GROUPS.forEach((m) => (freq[m] = 0));
    (p.schedule || []).forEach((day) => {
      if (day.muscles) day.muscles.forEach((m) => {
        if (freq[m] !== undefined) freq[m]++;
      });
    });
    return MUSCLE_GROUPS.map((m) => ({name: m, count: freq[m]}));
  }, [p]);

  const maxFreq = useMemo(() => Math.max(...muscleFreq.map((m) => m.count), 1), [muscleFreq]);

  /* Push/Pull/Legs balance */
  const pplBalance = useMemo(() => {
    let push = 0, pull = 0, legs = 0;
    (p.schedule || []).forEach((day) => {
      if (day.type === 'Push') push += day.sets;
      else if (day.type === 'Pull') pull += day.sets;
      else if (day.type === 'Legs') legs += day.sets;
      else if (day.type === 'Full Body') {
        push += Math.round(day.sets * 0.33);
        pull += Math.round(day.sets * 0.33);
        legs += Math.round(day.sets * 0.34);
      }
    });
    const total = push + pull + legs || 1;
    const balanced = Math.abs(push - pull) <= total * 0.15 && Math.abs(push - legs) <= total * 0.2;
    return {push, pull, legs, total, balanced};
  }, [p]);

  /* Functional group coverage */
  const funcCoverage = useMemo(() => {
    const cov = {};
    FUNC_GROUPS.forEach((fg) => (cov[fg.key] = 0));
    (p.schedule || []).forEach((day) => {
      const t = day.type?.toLowerCase().replace(' ', '');
      if (cov[t] !== undefined) cov[t]++;
      if (t === 'fullbody') {
        cov.push = (cov.push || 0) + 1;
        cov.pull = (cov.pull || 0) + 1;
        cov.legs = (cov.legs || 0) + 1;
      }
    });
    return FUNC_GROUPS.map((fg) => ({...fg, count: Math.min(cov[fg.key] || 0, 3)}));
  }, [p]);

  /* Programme insights */
  const insights = useMemo(() => {
    const result = [];
    const restDays = (p.schedule || []).filter((d) => d.type === 'Rest').length;
    const activeDays = 7 - restDays;

    if (restDays >= 2) {
      result.push({type: 'good', title: 'Rest days', text: `${restDays} rest days/week — adequate recovery time for muscle protein synthesis and CNS recovery.`});
    } else if (restDays === 1) {
      result.push({type: 'warning', title: 'Rest days', text: 'Only 1 rest day/week. Consider adding an active recovery day to prevent overtraining, especially with T2DM management.'});
    } else {
      result.push({type: 'critical', title: 'No rest days', text: 'Training 7 days/week risks overtraining. Add at least 1 rest day for hormonal recovery and glucose regulation.'});
    }

    if (pplBalance.balanced) {
      result.push({type: 'good', title: 'Push/Pull balance', text: `Push:Pull ratio is balanced (${pplBalance.push}:${pplBalance.pull} sets). Good for posture and joint health.`});
    } else {
      result.push({type: 'warning', title: 'Push/Pull imbalance', text: `Push:Pull ratio (${pplBalance.push}:${pplBalance.pull}) is uneven. Consider balancing to prevent shoulder impingement.`});
    }

    const gluteFreq = muscleFreq.find((m) => m.name === 'Glutes');
    if (gluteFreq && gluteFreq.count >= 2) {
      result.push({type: 'good', title: 'Glute training', text: `Glutes trained ${gluteFreq.count}×/week — excellent for insulin sensitivity and metabolic health.`});
    } else {
      result.push({type: 'info', title: 'Glute training', text: 'Consider adding glute-specific work. Glute training improves insulin sensitivity and glucose uptake — key for T2DM management.'});
    }

    const hasCardio = (p.schedule || []).some((d) => d.type === 'Cardio');
    if (!hasCardio) {
      result.push({type: 'warning', title: 'No cardio sessions', text: 'Adding 2-3 moderate-intensity cardio sessions (brisk walk, cycling) would improve HbA1c, cardiovascular health, and recovery between lifting sessions.'});
    }

    const totalWeeklySets = (p.schedule || []).reduce((a, d) => a + (d.sets || 0), 0);
    if (totalWeeklySets > 120) {
      result.push({type: 'warning', title: 'High weekly volume', text: `${totalWeeklySets} sets/week is very high. Monitor fatigue, sleep quality, and fasting glucose for signs of overreaching.`});
    } else if (totalWeeklySets >= 60) {
      result.push({type: 'good', title: 'Volume on target', text: `${totalWeeklySets} sets/week is well-suited for hypertrophy. Ensure progressive overload week-to-week.`});
    } else {
      result.push({type: 'info', title: 'Moderate volume', text: `${totalWeeklySets} sets/week — suitable for beginners. Gradually increase to 60-80 sets/week as tolerance improves.`});
    }

    return result;
  }, [p, pplBalance, muscleFreq]);

  /* Today marker */
  const todayIdx = new Date().getDay();
  const todayDay = DAYS[todayIdx];

  const totalExercises = (p.schedule || []).reduce((a, d) => a + (d.exercises || 0), 0);
  const totalWeeklySets = (p.schedule || []).reduce((a, d) => a + (d.sets || 0), 0);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ─── Programme Overview ─────────────────── */}
      <View style={styles.overviewCard}>
        <AppText variant="header" color={Colors.white}>{p.name}</AppText>
        <AppText variant="caption" color="rgba(255,255,255,0.6)" style={{marginTop: vs(4)}}>
          {p.weeks} weeks · Started {p.startDate} · {p.daysPerWeek} days/week
        </AppText>
        {p.currentWeek && (
          <View style={styles.weekBadge}>
            <AppText variant="small" color={Colors.accent} style={{fontWeight: '700'}}>
              Week {p.currentWeek} of {p.weeks}
            </AppText>
          </View>
        )}
        <View style={styles.overviewGrid}>
          <OverviewStat label="Days/wk" value={p.daysPerWeek} />
          <OverviewStat label="Exercises" value={totalExercises} />
          <OverviewStat label="Sets/wk" value={totalWeeklySets} />
          <OverviewStat label="Today" value={todayDay} />
        </View>
      </View>

      {/* ─── Weekly Volume Distribution ────────── */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>Weekly Volume Distribution</AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          Sets per day of the week
        </AppText>
        <View style={styles.chartCard}>
          <BarChart data={weeklyVolume} maxVal={maxSets} />
        </View>
      </View>

      {/* ─── Muscle Frequency Grid ─────────────── */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>Muscle Frequency</AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          Weekly hits per muscle group
        </AppText>
        <View style={styles.muscleGrid}>
          {muscleFreq.map((m) => {
            const fc = freqColor(m.count);
            const pct = maxFreq > 0 ? Math.min(m.count / maxFreq, 1) : 0;
            return (
              <View key={m.name} style={styles.muscleItem}>
                <View style={styles.muscleHeader}>
                  <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1}}>
                    {m.name}
                  </AppText>
                  <View style={[styles.muscleCountBadge, {backgroundColor: fc.bg}]}>
                    <AppText variant="small" color={fc.text} style={{fontWeight: '700'}}>
                      {m.count}×
                    </AppText>
                  </View>
                </View>
                <View style={styles.muscleBarTrack}>
                  <View style={[styles.muscleBarFill, {width: `${pct * 100}%`, backgroundColor: fc.bar}]} />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* ─── Push/Pull/Legs Balance ────────────── */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>Push / Pull / Legs Balance</AppText>
        <View style={styles.balanceCard}>
          <View style={styles.balanceRow}>
            <View style={styles.balanceItem}>
              <View style={[styles.balanceIndicator, {backgroundColor: Colors.blue}]} />
              <AppText variant="caption" color={Colors.textPrimary}>Push</AppText>
              <AppText variant="bodyBold" color={Colors.blue}>{pplBalance.push} sets</AppText>
              <AppText variant="small" color={Colors.textTertiary}>
                {Math.round((pplBalance.push / pplBalance.total) * 100)}%
              </AppText>
            </View>
            <View style={styles.balanceItem}>
              <View style={[styles.balanceIndicator, {backgroundColor: Colors.purple}]} />
              <AppText variant="caption" color={Colors.textPrimary}>Pull</AppText>
              <AppText variant="bodyBold" color={Colors.purple}>{pplBalance.pull} sets</AppText>
              <AppText variant="small" color={Colors.textTertiary}>
                {Math.round((pplBalance.pull / pplBalance.total) * 100)}%
              </AppText>
            </View>
            <View style={styles.balanceItem}>
              <View style={[styles.balanceIndicator, {backgroundColor: Colors.amber}]} />
              <AppText variant="caption" color={Colors.textPrimary}>Legs</AppText>
              <AppText variant="bodyBold" color={Colors.amber}>{pplBalance.legs} sets</AppText>
              <AppText variant="small" color={Colors.textTertiary}>
                {Math.round((pplBalance.legs / pplBalance.total) * 100)}%
              </AppText>
            </View>
          </View>
          {/* Ratio bar */}
          <View style={styles.ratioBar}>
            <View style={[styles.ratioSegment, {flex: pplBalance.push, backgroundColor: Colors.blue, borderTopLeftRadius: ms(6), borderBottomLeftRadius: ms(6)}]} />
            <View style={[styles.ratioSegment, {flex: pplBalance.pull, backgroundColor: Colors.purple}]} />
            <View style={[styles.ratioSegment, {flex: pplBalance.legs, backgroundColor: Colors.amber, borderTopRightRadius: ms(6), borderBottomRightRadius: ms(6)}]} />
          </View>
          <View style={[styles.balanceStatus, {backgroundColor: pplBalance.balanced ? Colors.tealBg : Colors.amberBg}]}>
            <AppText
              variant="small"
              color={pplBalance.balanced ? Colors.tealText : Colors.amberText}
              style={{fontWeight: '600'}}>
              {pplBalance.balanced ? '✓ Balanced' : '⚠ Imbalanced'}
            </AppText>
          </View>
        </View>
      </View>

      {/* ─── Functional Group Coverage ─────────── */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>Functional Group Coverage</AppText>
        <View style={styles.funcGrid}>
          {funcCoverage.map((fg) => (
            <View key={fg.key} style={styles.funcItem}>
              <View style={styles.funcHeader}>
                <AppText style={{fontSize: ms(16)}}>{fg.emoji}</AppText>
                <AppText variant="caption" color={Colors.textPrimary} style={{marginLeft: s(6), flex: 1}}>
                  {fg.label}
                </AppText>
              </View>
              <DotIndicator count={fg.count} max={3} />
            </View>
          ))}
        </View>
      </View>

      {/* ─── Weekly Schedule Preview ───────────── */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>Weekly Schedule</AppText>
        {(p.schedule || []).map((day, idx) => {
          const isToday = day.day === todayDay;
          const isRest = day.type === 'Rest';
          return (
            <View
              key={idx}
              style={[styles.scheduleRow, isToday && styles.scheduleRowToday]}>
              <View style={styles.schedDayCol}>
                <AppText
                  variant="caption"
                  color={isToday ? Colors.accent : Colors.textTertiary}
                  style={{fontWeight: isToday ? '700' : '400'}}>
                  {day.day}
                </AppText>
              </View>
              <AppText style={{fontSize: ms(16), width: s(24), textAlign: 'center'}}>
                {DAY_ICONS[day.type] || '💪'}
              </AppText>
              <View style={styles.schedInfo}>
                <AppText
                  variant="caption"
                  color={isRest ? Colors.textTertiary : Colors.textPrimary}
                  style={{fontWeight: '600'}}>
                  {day.name}
                </AppText>
                {!isRest && (
                  <AppText variant="small" color={Colors.textTertiary}>
                    {day.goal} · {day.sets} sets · {day.exercises} exercises
                  </AppText>
                )}
                {!isRest && (day.muscles || []).length > 0 && (
                  <View style={styles.muscleChips}>
                    {(day.muscles || []).map((m) => (
                      <View key={m} style={styles.muscleChip}>
                        <AppText variant="small" color={Colors.tealText}>{m}</AppText>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            </View>
          );
        })}
      </View>

      {/* ─── Programme Insights ────────────────── */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>Programme Insights</AppText>
        {insights.map((ins, idx) => {
          const ic = insightColor(ins.type);
          return (
            <View
              key={idx}
              style={[styles.insightCard, {backgroundColor: ic.bg, borderLeftColor: ic.border}]}>
              <View style={styles.insightHeader}>
                <AppText style={{fontSize: ms(14)}}>{ic.icon}</AppText>
                <AppText variant="bodyBold" color={ic.text} style={{marginLeft: s(6)}}>
                  {ins.title}
                </AppText>
              </View>
              <AppText variant="caption" color={ic.text} style={{marginTop: vs(4), lineHeight: ms(16)}}>
                {ins.text}
              </AppText>
            </View>
          );
        })}
      </View>

      <View style={{height: vs(40)}} />
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

  /* Overview card */
  overviewCard: {
    backgroundColor: Colors.primary,
    borderRadius: ms(16),
    padding: s(16),
    marginTop: vs(4),
  },
  weekBadge: {
    alignSelf: 'flex-start',
    backgroundColor: Colors.tealBg,
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(10),
    marginTop: vs(8),
  },
  overviewGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(16),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: vs(12),
  },
  overviewStat: {
    alignItems: 'center',
    flex: 1,
  },

  /* Section */
  section: {
    marginTop: vs(22),
  },

  /* Bar chart */
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(14),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  barChartRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    height: vs(120),
  },
  barChartCol: {
    alignItems: 'center',
    flex: 1,
  },
  barChartTrack: {
    width: s(24),
    height: vs(90),
    backgroundColor: Colors.background,
    borderRadius: ms(6),
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  barChartFill: {
    width: '100%',
    borderRadius: ms(6),
    minHeight: vs(2),
  },

  /* Muscle frequency grid */
  muscleGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: vs(10),
    gap: s(8),
  },
  muscleItem: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    padding: s(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  muscleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  muscleCountBadge: {
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  muscleBarTrack: {
    height: vs(6),
    backgroundColor: Colors.background,
    borderRadius: ms(3),
    overflow: 'hidden',
  },
  muscleBarFill: {
    height: '100%',
    borderRadius: ms(3),
    minWidth: s(4),
  },

  /* Balance */
  balanceCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(14),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  balanceRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: vs(12),
  },
  balanceItem: {
    alignItems: 'center',
    gap: vs(2),
  },
  balanceIndicator: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    marginBottom: vs(2),
  },
  ratioBar: {
    flexDirection: 'row',
    height: vs(10),
    borderRadius: ms(6),
    overflow: 'hidden',
    marginBottom: vs(10),
  },
  ratioSegment: {
    height: '100%',
  },
  balanceStatus: {
    alignSelf: 'center',
    paddingHorizontal: s(12),
    paddingVertical: vs(4),
    borderRadius: ms(10),
  },

  /* Functional coverage */
  funcGrid: {
    marginTop: vs(10),
    gap: vs(6),
  },
  funcItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    padding: s(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  funcHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dotRow: {
    flexDirection: 'row',
    gap: s(5),
  },
  dot: {
    width: s(10),
    height: s(10),
    borderRadius: s(5),
  },

  /* Schedule */
  scheduleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(10),
    paddingHorizontal: s(8),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: s(8),
  },
  scheduleRowToday: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(10),
    borderBottomWidth: 0,
    marginBottom: vs(2),
  },
  schedDayCol: {
    width: s(32),
    paddingTop: vs(2),
  },
  schedInfo: {
    flex: 1,
  },
  muscleChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(4),
    marginTop: vs(4),
  },
  muscleChip: {
    backgroundColor: Colors.tealBg,
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(6),
  },

  /* Insights */
  insightCard: {
    borderRadius: ms(10),
    padding: s(12),
    marginTop: vs(8),
    borderLeftWidth: s(4),
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default SummaryTab;
