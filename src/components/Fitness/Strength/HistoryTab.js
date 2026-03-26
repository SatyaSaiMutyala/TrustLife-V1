import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  LayoutAnimation,
  Platform,
  UIManager,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';

if (Platform.OS === 'android' && UIManager.setLayoutAnimationEnabledExperimental) {
  UIManager.setLayoutAnimationEnabledExperimental(true);
}

/* ─── Demo Data Generator ──────────────────────────────── */

const SESSION_TYPES = ['Push', 'Pull', 'Legs', 'Full Body'];
const EXERCISE_POOL = {
  Push: [
    {name: 'Bench Press', maxW: 80, unit: 'kg'},
    {name: 'Overhead Press', maxW: 55, unit: 'kg'},
    {name: 'Incline DB Press', maxW: 30, unit: 'kg'},
    {name: 'Lateral Raises', maxW: 12, unit: 'kg'},
    {name: 'Tricep Pushdown', maxW: 35, unit: 'kg'},
  ],
  Pull: [
    {name: 'Deadlift', maxW: 120, unit: 'kg'},
    {name: 'Barbell Row', maxW: 70, unit: 'kg'},
    {name: 'Pull-ups', maxW: 0, unit: 'bw'},
    {name: 'Face Pulls', maxW: 20, unit: 'kg'},
    {name: 'Bicep Curls', maxW: 16, unit: 'kg'},
  ],
  Legs: [
    {name: 'Back Squat', maxW: 100, unit: 'kg'},
    {name: 'Romanian Deadlift', maxW: 80, unit: 'kg'},
    {name: 'Leg Press', maxW: 180, unit: 'kg'},
    {name: 'Walking Lunges', maxW: 24, unit: 'kg'},
    {name: 'Calf Raises', maxW: 60, unit: 'kg'},
  ],
  'Full Body': [
    {name: 'Clean & Press', maxW: 50, unit: 'kg'},
    {name: 'Front Squat', maxW: 70, unit: 'kg'},
    {name: 'Barbell Row', maxW: 65, unit: 'kg'},
    {name: 'Dips', maxW: 0, unit: 'bw'},
    {name: 'Farmer Walk', maxW: 40, unit: 'kg'},
  ],
};

const generateDemoHistory = () => {
  const sessions = [];
  const now = new Date();
  for (let d = 0; d < 90; d++) {
    const day = new Date(now);
    day.setDate(day.getDate() - d);
    const dow = day.getDay();
    if (dow === 0 || dow === 6 || Math.random() < 0.3) continue;

    const type = SESSION_TYPES[d % SESSION_TYPES.length];
    const exercises = EXERCISE_POOL[type].map((ex) => {
      const setsCount = 3 + Math.floor(Math.random() * 2);
      const sets = [];
      for (let si = 0; si < setsCount; si++) {
        const w = ex.maxW > 0 ? Math.round(ex.maxW * (0.7 + Math.random() * 0.3)) : 0;
        const reps = 6 + Math.floor(Math.random() * 8);
        sets.push({weight: w, reps, rpe: 6 + Math.floor(Math.random() * 4)});
      }
      return {...ex, sets, volume: sets.reduce((a, st) => a + st.weight * st.reps, 0)};
    });

    const totalVolume = exercises.reduce((a, e) => a + e.volume, 0);
    const totalSets = exercises.reduce((a, e) => a + e.sets.length, 0);
    const duration = 35 + Math.floor(Math.random() * 35);
    const isPR = Math.random() < 0.15;

    sessions.push({
      id: `s-${d}`,
      date: day.toISOString(),
      type,
      exercises,
      totalVolume,
      totalSets,
      duration,
      prsSet: isPR ? 1 : 0,
    });
  }
  return sessions;
};

/* ─── Constants ─────────────────────────────────────── */

const PERIOD_FILTERS = [
  {id: '1w', label: 'This week', days: 7},
  {id: '2w', label: '2 weeks', days: 14},
  {id: '3m', label: '3 months', days: 90},
  {id: 'all', label: 'All time', days: 9999},
];

const FG_FILTERS = ['All', 'Push', 'Pull', 'Legs', 'Full Body'];

/* ─── Helpers ───────────────────────────────────────── */

const fmtVolume = (v) => {
  if (v >= 1000000) return `${(v / 1000000).toFixed(1)}M`;
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return `${v}`;
};

const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {day: 'numeric', month: 'short'});
};

const fmtDateLong = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'});
};

const getWeekLabel = (iso) => {
  const d = new Date(iso);
  const start = new Date(d);
  start.setDate(d.getDate() - d.getDay());
  const end = new Date(start);
  end.setDate(start.getDate() + 6);
  return `${fmtDate(start.toISOString())} – ${fmtDate(end.toISOString())}`;
};

const est1RM = (w, r) => {
  if (r <= 0 || w <= 0) return 0;
  return Math.round(w * (1 + r / 30));
};

/* ─── Sub-components ────────────────────────────────── */

const PillFilter = ({items, active, onSelect, style}) => (
  <ScrollView
    horizontal
    showsHorizontalScrollIndicator={false}
    contentContainerStyle={[styles.pillRow, style]}>
    {items.map((item) => {
      const isActive = active === (item.id || item);
      return (
        <TouchableOpacity
          key={item.id || item}
          onPress={() => onSelect(item.id || item)}
          style={[styles.pill, isActive && styles.pillActive]}>
          <AppText
            variant="small"
            color={isActive ? Colors.white : Colors.textSecondary}
            style={{fontWeight: isActive ? '600' : '400'}}>
            {item.label || item}
          </AppText>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const StatBox = ({label, value, unit}) => (
  <View style={styles.statBox}>
    <AppText variant="bodyBold" color={Colors.white}>
      {value}
      {unit ? (
        <AppText variant="small" color="rgba(255,255,255,0.6)">
          {' '}{unit}
        </AppText>
      ) : null}
    </AppText>
    <AppText variant="small" color="rgba(255,255,255,0.5)">
      {label}
    </AppText>
  </View>
);

const HBar = ({value, maxValue, color, label, subLabel}) => {
  const pct = maxValue > 0 ? Math.min(value / maxValue, 1) : 0;
  return (
    <View style={styles.hBarRow}>
      <View style={styles.hBarLabel}>
        <AppText variant="small" color={Colors.textPrimary} numberOfLines={1}>
          {label}
        </AppText>
        {subLabel ? (
          <AppText variant="small" color={Colors.textTertiary}>
            {subLabel}
          </AppText>
        ) : null}
      </View>
      <View style={styles.hBarTrack}>
        <View style={[styles.hBarFill, {width: `${pct * 100}%`, backgroundColor: color}]} />
      </View>
      <AppText variant="small" color={Colors.textSecondary} style={{width: s(50), textAlign: 'right'}}>
        {fmtVolume(value)} kg
      </AppText>
    </View>
  );
};

const SetChip = ({set, idx}) => (
  <View style={styles.setChip}>
    <AppText variant="small" color={Colors.textTertiary}>S{idx + 1}</AppText>
    <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '600'}}>
      {set.weight > 0 ? `${set.weight}kg` : 'BW'} x {set.reps}
    </AppText>
    <View style={[styles.rpeBadge, {backgroundColor: set.rpe >= 8 ? Colors.redBg : set.rpe >= 6 ? Colors.amberBg : Colors.tealBg}]}>
      <AppText variant="small" color={set.rpe >= 8 ? Colors.redText : set.rpe >= 6 ? Colors.amberText : Colors.tealText}>
        RPE {set.rpe}
      </AppText>
    </View>
  </View>
);

/* ─── Main Component ───────────────────────────────── */

const HistoryTab = ({plan, logState}) => {
  const [period, setPeriod] = useState('1w');
  const [fgFilter, setFgFilter] = useState('All');
  const [expandedSession, setExpandedSession] = useState(null);
  const [expandedExercise, setExpandedExercise] = useState(null);

  const allSessions = useMemo(() => generateDemoHistory(), []);

  /* Filter sessions by period */
  const filteredSessions = useMemo(() => {
    const periodDef = PERIOD_FILTERS.find((p) => p.id === period) || PERIOD_FILTERS[0];
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - (periodDef?.days || 7));
    let sessions = allSessions.filter((ses) => new Date(ses.date) >= cutoff);
    if (fgFilter !== 'All') {
      sessions = sessions.filter((ses) => ses.type === fgFilter);
    }
    return sessions;
  }, [allSessions, period, fgFilter]);

  /* Previous period for comparison */
  const prevSessions = useMemo(() => {
    const periodDef = PERIOD_FILTERS.find((p) => p.id === period) || PERIOD_FILTERS[0];
    const days = periodDef?.days || 7;
    const now = new Date();
    const cutoffCurrent = new Date();
    cutoffCurrent.setDate(now.getDate() - days);
    const cutoffPrev = new Date();
    cutoffPrev.setDate(now.getDate() - days * 2);
    let sessions = allSessions.filter(
      (ses) => new Date(ses.date) >= cutoffPrev && new Date(ses.date) < cutoffCurrent,
    );
    if (fgFilter !== 'All') {
      sessions = sessions.filter((ses) => ses.type === fgFilter);
    }
    return sessions;
  }, [allSessions, period, fgFilter]);

  /* Macro stats */
  const macroStats = useMemo(() => {
    const totalVol = filteredSessions.reduce((a, s) => a + s.totalVolume, 0);
    const prevVol = prevSessions.reduce((a, s) => a + s.totalVolume, 0);
    const delta = prevVol > 0 ? ((totalVol - prevVol) / prevVol * 100).toFixed(1) : 0;
    const totalSets = filteredSessions.reduce((a, s) => a + s.totalSets, 0);
    const totalTime = filteredSessions.reduce((a, s) => a + s.duration, 0);
    const prs = filteredSessions.reduce((a, s) => a + s.prsSet, 0);
    return {totalVol, delta, sessions: filteredSessions.length, totalSets, totalTime, prs};
  }, [filteredSessions, prevSessions]);

  /* Daily volume data for bars */
  const dailyBars = useMemo(() => {
    const maxVol = Math.max(...filteredSessions.map((s) => s.totalVolume), 1);
    return filteredSessions.slice(0, 14).map((ses) => ({
      label: fmtDate(ses.date),
      value: ses.totalVolume,
      pct: ses.totalVolume / maxVol,
      type: ses.type,
    }));
  }, [filteredSessions]);

  /* Weekly grouped data */
  const weeklyData = useMemo(() => {
    const weeks = {};
    filteredSessions.forEach((ses) => {
      const wk = getWeekLabel(ses.date);
      if (!weeks[wk]) weeks[wk] = {label: wk, volume: 0, sessions: []};
      weeks[wk].volume += ses.totalVolume;
      weeks[wk].sessions.push(ses);
    });
    const arr = Object.values(weeks);
    const maxVol = Math.max(...arr.map((w) => w.volume), 1);
    return arr.map((w) => ({...w, pct: w.volume / maxVol}));
  }, [filteredSessions]);

  /* Exercise breakdown (when filter is not All) */
  const exerciseBreakdown = useMemo(() => {
    if (fgFilter === 'All') return [];
    const map = {};
    filteredSessions.forEach((ses) => {
      ses.exercises.forEach((ex) => {
        if (!map[ex.name]) {
          map[ex.name] = {name: ex.name, maxWeight: 0, totalSets: 0, totalReps: 0, totalVol: 0, sessions: []};
        }
        const maxW = Math.max(...ex.sets.map((st) => st.weight));
        if (maxW > map[ex.name].maxWeight) map[ex.name].maxWeight = maxW;
        map[ex.name].totalSets += ex.sets.length;
        map[ex.name].totalReps += ex.sets.reduce((a, st) => a + st.reps, 0);
        map[ex.name].totalVol += ex.volume;
        map[ex.name].sessions.push({date: ses.date, sets: ex.sets});
      });
    });
    return Object.values(map).sort((a, b) => b.totalVol - a.totalVol);
  }, [filteredSessions, fgFilter]);

  /* Personal Records */
  const personalRecords = useMemo(() => {
    const map = {};
    allSessions.forEach((ses) => {
      ses.exercises.forEach((ex) => {
        ex.sets.forEach((st) => {
          const key = ex.name;
          if (!map[key] || st.weight > map[key].weight) {
            map[key] = {
              name: ex.name,
              weight: st.weight,
              reps: st.reps,
              date: ses.date,
              est1rm: est1RM(st.weight, st.reps),
            };
          }
        });
      });
    });
    return Object.values(map)
      .filter((r) => r.weight > 0)
      .sort((a, b) => b.weight - a.weight)
      .slice(0, 10);
  }, [allSessions]);

  /* Session log grouped by week */
  const sessionsByWeek = useMemo(() => {
    const weeks = {};
    filteredSessions.forEach((ses) => {
      const wk = getWeekLabel(ses.date);
      if (!weeks[wk]) weeks[wk] = [];
      weeks[wk].push(ses);
    });
    return Object.entries(weeks);
  }, [filteredSessions]);

  const toggleSession = useCallback((id) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedSession((prev) => (prev === id ? null : id));
  }, []);

  const toggleExercise = useCallback((key) => {
    LayoutAnimation.configureNext(LayoutAnimation.Presets.easeInEaseOut);
    setExpandedExercise((prev) => (prev === key ? null : key));
  }, []);

  const typeColor = (type) => {
    switch (type) {
      case 'Push': return Colors.blue;
      case 'Pull': return Colors.purple;
      case 'Legs': return Colors.amber;
      case 'Full Body': return Colors.accent;
      default: return Colors.accent;
    }
  };

  /* ─── Empty State ────────────────────────────────── */
  if (filteredSessions.length === 0) {
    return (
      <View style={styles.container}>
        <PillFilter items={PERIOD_FILTERS} active={period} onSelect={setPeriod} />
        <PillFilter items={FG_FILTERS} active={fgFilter} onSelect={setFgFilter} style={{marginTop: vs(4)}} />
        <View style={styles.emptyCard}>
          <AppText variant="header" color={Colors.textTertiary}>No sessions</AppText>
          <AppText variant="body" color={Colors.textTertiary} style={{marginTop: vs(4), textAlign: 'center'}}>
            No strength sessions recorded in this period. Start a workout to see your history here.
          </AppText>
        </View>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* ─── Period Filter ─────────────────────── */}
      <PillFilter items={PERIOD_FILTERS} active={period} onSelect={setPeriod} />

      {/* ─── Macro Headline Card ───────────────── */}
      <View style={styles.macroCard}>
        <View style={styles.macroTop}>
          <View>
            <AppText variant="small" color="rgba(255,255,255,0.6)">Total volume</AppText>
            <AppText style={styles.macroValue}>{fmtVolume(macroStats.totalVol)}</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.5)">kg lifted</AppText>
          </View>
          <View style={[styles.deltaBadge, {backgroundColor: macroStats.delta >= 0 ? 'rgba(93,202,165,0.2)' : 'rgba(226,75,74,0.2)'}]}>
            <AppText variant="small" color={macroStats.delta >= 0 ? Colors.lightGreen : Colors.red} style={{fontWeight: '700'}}>
              {macroStats.delta >= 0 ? '+' : ''}{macroStats.delta}%
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.4)"> vs prev</AppText>
          </View>
        </View>
        <View style={styles.statGrid}>
          <StatBox label="Sessions" value={macroStats.sessions} />
          <StatBox label="Total sets" value={macroStats.totalSets} />
          <StatBox label="Active time" value={`${macroStats.totalTime}`} unit="min" />
          <StatBox label="PRs set" value={macroStats.prs} />
        </View>
      </View>

      {/* ─── Daily Volume Bars ─────────────────── */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>Daily Volume</AppText>
        <View style={styles.barsContainer}>
          {dailyBars.map((bar, i) => (
            <View key={i} style={styles.dailyBarRow}>
              <AppText variant="small" color={Colors.textTertiary} style={styles.barDateLabel}>
                {bar.label}
              </AppText>
              <View style={styles.barTrackH}>
                <View
                  style={[
                    styles.barFillH,
                    {width: `${bar.pct * 100}%`, backgroundColor: typeColor(bar.type)},
                  ]}
                />
              </View>
              <AppText variant="small" color={Colors.textSecondary} style={styles.barValueLabel}>
                {fmtVolume(bar.value)}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      {/* ─── Weekly Comparison ─────────────────── */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>Weekly Comparison</AppText>
        <View style={styles.barsContainer}>
          {weeklyData.map((wk, i) => (
            <View key={i} style={styles.dailyBarRow}>
              <AppText variant="small" color={Colors.textTertiary} style={styles.barDateLabel} numberOfLines={1}>
                {wk.label}
              </AppText>
              <View style={styles.barTrackH}>
                <View
                  style={[styles.barFillH, {width: `${wk.pct * 100}%`, backgroundColor: Colors.purple}]}
                />
              </View>
              <AppText variant="small" color={Colors.textSecondary} style={styles.barValueLabel}>
                {fmtVolume(wk.volume)}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      {/* ─── Session Type Filter ───────────────── */}
      <PillFilter items={FG_FILTERS} active={fgFilter} onSelect={setFgFilter} style={{marginTop: vs(8)}} />

      {/* ─── Exercise Breakdown ────────────────── */}
      {fgFilter !== 'All' && exerciseBreakdown.length > 0 && (
        <View style={styles.section}>
          <AppText variant="sectionTitle" color={Colors.textSecondary}>Exercise Breakdown</AppText>
          {exerciseBreakdown.map((ex, idx) => {
            const avgReps = ex.totalSets > 0 ? Math.round(ex.totalReps / ex.totalSets) : 0;
            const isOpen = expandedExercise === ex.name;
            return (
              <TouchableOpacity
                key={ex.name}
                onPress={() => toggleExercise(ex.name)}
                activeOpacity={0.7}
                style={styles.exCard}>
                <View style={styles.exCardHeader}>
                  <AppText variant="bodyBold" color={Colors.textPrimary}>{ex.name}</AppText>
                  <AppText variant="small" color={Colors.textTertiary}>{isOpen ? '▲' : '▼'}</AppText>
                </View>
                <View style={styles.exStats}>
                  <View style={styles.exStat}>
                    <AppText variant="small" color={Colors.textTertiary}>Max</AppText>
                    <AppText variant="bodyBold" color={Colors.textPrimary}>{ex.maxWeight} kg</AppText>
                  </View>
                  <View style={styles.exStat}>
                    <AppText variant="small" color={Colors.textTertiary}>Sets</AppText>
                    <AppText variant="bodyBold" color={Colors.textPrimary}>{ex.totalSets}</AppText>
                  </View>
                  <View style={styles.exStat}>
                    <AppText variant="small" color={Colors.textTertiary}>Avg reps</AppText>
                    <AppText variant="bodyBold" color={Colors.textPrimary}>{avgReps}</AppText>
                  </View>
                  <View style={styles.exStat}>
                    <AppText variant="small" color={Colors.textTertiary}>Volume</AppText>
                    <AppText variant="bodyBold" color={Colors.textPrimary}>{fmtVolume(ex.totalVol)} kg</AppText>
                  </View>
                </View>
                {isOpen && (
                  <View style={styles.exSessions}>
                    {ex.sessions.map((ses, si) => (
                      <View key={si} style={styles.exSessionRow}>
                        <AppText variant="small" color={Colors.textTertiary}>{fmtDate(ses.date)}</AppText>
                        <View style={styles.setChips}>
                          {ses.sets.map((st, sti) => (
                            <SetChip key={sti} set={st} idx={sti} />
                          ))}
                        </View>
                      </View>
                    ))}
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </View>
      )}

      {/* ─── Personal Records ──────────────────── */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>Personal Records</AppText>
        {personalRecords.map((pr, idx) => (
          <View key={idx} style={styles.prRow}>
            <AppText style={{fontSize: ms(16)}}>🏆</AppText>
            <View style={styles.prInfo}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>{pr.name}</AppText>
              <AppText variant="small" color={Colors.textTertiary}>
                {fmtDateLong(pr.date)} · Est 1RM: {pr.est1rm} kg
              </AppText>
            </View>
            <View style={styles.prWeight}>
              <AppText variant="bodyBold" color={Colors.accent}>{pr.weight} kg</AppText>
              <AppText variant="small" color={Colors.textTertiary}>x {pr.reps}</AppText>
            </View>
          </View>
        ))}
      </View>

      {/* ─── Session Log ───────────────────────── */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>Session Log</AppText>
        {sessionsByWeek.map(([weekLabel, sessions]) => (
          <View key={weekLabel} style={styles.weekGroup}>
            <AppText variant="caption" color={Colors.textTertiary} style={styles.weekLabel}>
              {weekLabel}
            </AppText>
            {sessions.map((ses) => {
              const isOpen = expandedSession === ses.id;
              return (
                <TouchableOpacity
                  key={ses.id}
                  onPress={() => toggleSession(ses.id)}
                  activeOpacity={0.7}
                  style={styles.sessionCard}>
                  <View style={styles.sessionHeader}>
                    <View style={[styles.sessionDot, {backgroundColor: typeColor(ses.type)}]} />
                    <View style={{flex: 1}}>
                      <AppText variant="bodyBold" color={Colors.textPrimary}>
                        {ses.type}
                      </AppText>
                      <AppText variant="small" color={Colors.textTertiary}>
                        {fmtDate(ses.date)} · {ses.duration} min · {ses.totalSets} sets · {fmtVolume(ses.totalVolume)} kg
                      </AppText>
                    </View>
                    {ses.prsSet > 0 && (
                      <View style={styles.prBadge}>
                        <AppText variant="small" color={Colors.accent} style={{fontWeight: '700'}}>PR</AppText>
                      </View>
                    )}
                    <AppText variant="small" color={Colors.textTertiary}>{isOpen ? '▲' : '▼'}</AppText>
                  </View>
                  {isOpen && (
                    <View style={styles.sessionDetails}>
                      {ses.exercises.map((ex, ei) => (
                        <View key={ei} style={styles.sessionExRow}>
                          <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>
                            {ex.name}
                          </AppText>
                          <View style={styles.setChips}>
                            {ex.sets.map((st, sti) => (
                              <SetChip key={sti} set={st} idx={sti} />
                            ))}
                          </View>
                        </View>
                      ))}
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
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

  /* Pills */
  pillRow: {
    flexDirection: 'row',
    gap: s(8),
    paddingVertical: vs(6),
    paddingHorizontal: s(2),
  },
  pill: {
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  pillActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },

  /* Macro card */
  macroCard: {
    backgroundColor: Colors.primary,
    borderRadius: ms(16),
    padding: s(16),
    marginTop: vs(10),
    overflow: 'hidden',
  },
  macroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(14),
  },
  macroValue: {
    fontSize: ms(32),
    fontWeight: '800',
    color: Colors.white,
    lineHeight: ms(38),
    marginVertical: vs(2),
  },
  deltaBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(12),
  },
  statGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: vs(12),
  },
  statBox: {
    alignItems: 'center',
    flex: 1,
  },

  /* Section */
  section: {
    marginTop: vs(20),
  },

  /* Horizontal bars */
  barsContainer: {
    marginTop: vs(10),
  },
  dailyBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  barDateLabel: {
    width: s(65),
  },
  barTrackH: {
    flex: 1,
    height: vs(14),
    backgroundColor: Colors.background,
    borderRadius: ms(7),
    overflow: 'hidden',
    marginHorizontal: s(6),
  },
  barFillH: {
    height: '100%',
    borderRadius: ms(7),
  },
  barValueLabel: {
    width: s(46),
    textAlign: 'right',
  },

  /* HBar */
  hBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  hBarLabel: {
    width: s(80),
  },
  hBarTrack: {
    flex: 1,
    height: vs(10),
    backgroundColor: Colors.background,
    borderRadius: ms(5),
    overflow: 'hidden',
    marginHorizontal: s(8),
  },
  hBarFill: {
    height: '100%',
    borderRadius: ms(5),
  },

  /* Exercise breakdown */
  exCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(12),
    marginTop: vs(8),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  exCardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  exStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(8),
  },
  exStat: {
    alignItems: 'center',
  },
  exSessions: {
    marginTop: vs(10),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: vs(8),
  },
  exSessionRow: {
    marginBottom: vs(8),
  },

  /* Set chips */
  setChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginTop: vs(4),
  },
  setChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    backgroundColor: Colors.background,
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
  },
  rpeBadge: {
    paddingHorizontal: s(5),
    paddingVertical: vs(1),
    borderRadius: ms(6),
  },

  /* Personal Records */
  prRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(12),
    marginTop: vs(6),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: s(10),
  },
  prInfo: {
    flex: 1,
  },
  prWeight: {
    alignItems: 'flex-end',
  },

  /* Session log */
  weekGroup: {
    marginTop: vs(12),
  },
  weekLabel: {
    marginBottom: vs(6),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  sessionCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(12),
    marginBottom: vs(6),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sessionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  sessionDot: {
    width: s(10),
    height: s(10),
    borderRadius: s(5),
  },
  prBadge: {
    backgroundColor: Colors.tealBg,
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  sessionDetails: {
    marginTop: vs(10),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: vs(8),
  },
  sessionExRow: {
    marginBottom: vs(8),
  },

  /* Empty state */
  emptyCard: {
    marginTop: vs(40),
    alignItems: 'center',
    justifyContent: 'center',
    padding: s(24),
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.borderLight,
    borderRadius: ms(16),
  },
});

export default HistoryTab;
