import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import {BODY_PARTS, EXERCISES} from '../../constants/fitnessData';

/* ─── Constants ──────────────────────────────────────── */

const FUNC_GROUPS = ['push', 'pull', 'legs', 'core', 'all'];

const REST_PRESETS = [30, 45, 60, 90, 120, 180, 240, 300];

const RPE_DESCRIPTIONS = [
  'Very easy',
  'Easy',
  'Somewhat easy',
  'Light effort',
  'Moderate',
  'Somewhat hard',
  'Hard',
  'Very hard',
  'Almost max',
  'Max effort',
];

const RPE_PCT = [50, 55, 60, 65, 70, 75, 80, 85, 90, 100];

const GOALS = [
  {
    id: 'strength',
    emoji: '\u{1F3CB}\uFE0F',
    name: 'Strength',
    desc: 'Low reps (1\u20136) \u00B7 High load \u00B7 Neural adaptation \u00B7 RPE 8\u201310',
    activeBg: '#EEF3FE',
    activeBorder: '#3b82f6',
    activeColor: '#3b82f6',
  },
  {
    id: 'hypertrophy',
    emoji: '\uD83D\uDCAA',
    name: 'Hypertrophy',
    desc: '8\u201312 reps \u00B7 Moderate load \u00B7 TUT focus \u00B7 RPE 7\u20138',
    activeBg: Colors.purpleBg,
    activeBorder: Colors.purple,
    activeColor: Colors.purple,
  },
  {
    id: 'endurance',
    emoji: '\uD83D\uDD04',
    name: 'Muscular endurance',
    desc: '15+ reps \u00B7 Light\u2013mod load \u00B7 High volume \u00B7 RPE 5\u20137',
    activeBg: Colors.tealBg,
    activeBorder: Colors.teal,
    activeColor: Colors.teal,
  },
  {
    id: 'functional',
    emoji: '\u2699\uFE0F',
    name: 'Functional fitness',
    desc: 'Movement quality \u00B7 Multi-plane \u00B7 Real-world patterns',
    activeBg: '#FFF7EE',
    activeBorder: '#f59e0b',
    activeColor: '#f59e0b',
  },
  {
    id: 'rehab',
    emoji: '\uD83E\uDE7A',
    name: 'Rehabilitation',
    desc: 'Low load \u00B7 High control \u00B7 Pain-free ROM \u00B7 Activation',
    activeBg: Colors.redBg,
    activeBorder: Colors.red,
    activeColor: Colors.red,
  },
  {
    id: 'performance',
    emoji: '\uD83C\uDFC6',
    name: 'Performance/Power',
    desc: 'Explosive \u00B7 Olympic lifts \u00B7 Plyometric component',
    activeBg: '#1a0505',
    activeBorder: '#c0392b',
    activeColor: '#c0392b',
  },
];

const GOAL_INSIGHTS = {
  strength:
    '1\u20135 reps \u00B7 85\u2013100% 1RM \u00B7 3\u20135 min rest \u00B7 Primary adaptation: neural recruitment \u2014 your nervous system learns to fire more motor units simultaneously. Prioritise compound lifts with full recovery between sets.',
  hypertrophy:
    '8\u201312 reps \u00B7 67\u201385% 1RM \u00B7 60\u201390s rest \u00B7 Time under tension 40\u201370s/set. Metabolic stress and mechanical tension drive muscle protein synthesis. Volume is the key driver \u2014 aim for 10\u201320 hard sets per muscle group per week.',
  endurance:
    '15\u201325 reps \u00B7 <65% 1RM \u00B7 30\u201360s rest. Improves mitochondrial density, capillary density and lactate buffering. Great for joint health and work capacity. Pair with aerobic conditioning for maximum benefit.',
  functional:
    'Multi-plane \u00B7 Real-world movement patterns \u00B7 Stability + strength combined. Emphasise unilateral work, rotational patterns and ground-based movements. Quality of movement trumps load.',
  rehab:
    'Low load \u00B7 Pain-free range only \u00B7 Activation focus. Aim for neuromuscular re-education and tissue tolerance. Progress ROM before load. Keep RPE below 5 and prioritise control and proprioception.',
  performance:
    'Explosive contractions \u00B7 Minimal reps (3\u20135) \u00B7 Full recovery between sets (3\u20135 min). Focus on rate of force development. Combine Olympic lifts with plyometrics and ballistic movements for maximum power output.',
};

/* ─── Helpers ────────────────────────────────────────── */

const fmtTime = (sec) => {
  const m = Math.floor(sec / 60);
  const s_ = sec % 60;
  return `${m}:${s_ < 10 ? '0' : ''}${s_}`;
};

const presetLabel = (sec) => (sec < 60 ? `${sec}s` : `${Math.floor(sec / 60)}:${sec % 60 === 0 ? '00' : sec % 60 < 10 ? '0' + (sec % 60) : sec % 60}`);

const rpeColor = (n) => {
  if (n <= 2) return {bg: Colors.tealBg, text: Colors.tealDark};
  if (n <= 4) return {bg: Colors.blueBg, text: Colors.blueText};
  if (n <= 6) return {bg: Colors.amberBg, text: Colors.amberText};
  if (n <= 8) return {bg: Colors.redBg, text: Colors.redText};
  return {bg: '#3b0a0a', text: '#fca5a5'};
};

/* ─── Default set row ────────────────────────────────── */

const makeSet = () => ({reps: '', weight: '', rpe: ''});

/* ─── Component ──────────────────────────────────────── */

const StrengthFlow = ({
  bodyPart,
  setBodyPart,
  exercise,
  setExercise,
  sets,
  setSets,
  restSec,
  setRestSec,
  tempo,
  setTempo,
  rpe,
  setRpe,
  goal,
  setGoal,
  funcFilter,
  setFuncFilter,
}) => {
  /* --- Rest timer state -------------------------------- */
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerValue, setTimerValue] = useState(restSec || 60);
  const intervalRef = useRef(null);

  useEffect(() => {
    setTimerValue(restSec || 60);
  }, [restSec]);

  useEffect(() => {
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  const startTimer = useCallback(() => {
    if (timerRunning) return;
    setTimerRunning(true);
    intervalRef.current = setInterval(() => {
      setTimerValue((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTimerRunning(false);
          return restSec || 60;
        }
        return prev - 1;
      });
    }, 1000);
  }, [timerRunning, restSec]);

  const resetTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    setTimerRunning(false);
    setTimerValue(restSec || 60);
  }, [restSec]);

  /* --- Set helpers ------------------------------------- */
  const addSet = () => setSets([...sets, makeSet()]);

  const removeSet = (idx) => {
    if (sets.length <= 1) return;
    setSets(sets.filter((_, i) => i !== idx));
  };

  const updateSet = (idx, field, value) => {
    const next = sets.map((row, i) => (i === idx ? {...row, [field]: value} : row));
    setSets(next);
  };

  /* --- Tempo helpers ----------------------------------- */
  const updateTempo = (idx, value) => {
    const next = [...tempo];
    next[idx] = value;
    setTempo(next);
  };

  const tempoTUT = () => {
    const nums = tempo.map((v) => parseInt(v, 10) || 0);
    return nums[0] + nums[1] + nums[2];
  };

  /* --- Derived data ------------------------------------ */
  const filteredParts =
    funcFilter === 'all'
      ? BODY_PARTS
      : BODY_PARTS.filter((bp) => bp.group === funcFilter);

  const exerciseList = bodyPart ? EXERCISES[bodyPart] || [] : [];

  const selectedExObj = exerciseList.find((e) => e.name === exercise);

  const bodyPartObj = BODY_PARTS.find((bp) => bp.id === bodyPart);

  /* --- Volume & 1RM ------------------------------------ */
  const totalVolume = sets.reduce((sum, row) => {
    const w = parseFloat(row.weight) || 0;
    const r = parseInt(row.reps, 10) || 0;
    return sum + w * r;
  }, 0);

  const estimated1RM = (() => {
    let best = 0;
    sets.forEach((row) => {
      const w = parseFloat(row.weight) || 0;
      const r = parseInt(row.reps, 10) || 0;
      if (r >= 1 && r <= 10 && w > 0) {
        const e = w * (1 + r / 30);
        if (e > best) best = e;
      }
    });
    return Math.round(best * 10) / 10;
  })();

  /* ═══════════════════════════════════════════════════════
     R E N D E R
     ═══════════════════════════════════════════════════════ */
  return (
    <View style={styles.container}>

      {/* ── Layer 1: Target Muscle Group ─────────────── */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.cardTitle}>
          Body part / muscle group
        </AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={styles.cardSub}>
          Tap to select
        </AppText>

        {/* Functional filter row */}
        <View style={styles.filterRow}>
          {FUNC_GROUPS.map((g) => {
            const active = funcFilter === g;
            return (
              <TouchableOpacity
                key={g}
                activeOpacity={0.7}
                style={[styles.filterPill, active && styles.filterPillActive]}
                onPress={() => setFuncFilter(g)}>
                <AppText
                  variant="small"
                  style={styles.filterPillText}
                  color={active ? Colors.white : Colors.purple}>
                  {g.toUpperCase()}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Body part grid */}
        <View style={styles.bpGrid}>
          {filteredParts.map((bp) => {
            const active = bodyPart === bp.id;
            return (
              <TouchableOpacity
                key={bp.id}
                activeOpacity={0.7}
                style={[styles.bpItem, active && styles.bpItemActive]}
                onPress={() => {
                  setBodyPart(bp.id === bodyPart ? null : bp.id);
                  if (bp.id !== bodyPart) {
                    setExercise(null);
                  }
                }}>
                <AppText style={styles.bpEmoji}>{bp.ico}</AppText>
                <AppText
                  variant="small"
                  numberOfLines={1}
                  style={styles.bpName}
                  color={active ? Colors.purpleText : Colors.textPrimary}>
                  {bp.name}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Layer 2: Exercise Selection ──────────────── */}
      {bodyPart && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText variant="bodyBold" style={styles.cardTitle}>
              {bodyPartObj?.name || bodyPart} exercises
            </AppText>
            <TouchableOpacity activeOpacity={0.6}>
              <AppText variant="caption" color={Colors.accent}>
                Search all &rarr;
              </AppText>
            </TouchableOpacity>
          </View>

          {exerciseList.map((ex, idx) => {
            const active = exercise === ex.name;
            const isCompound = ex.type === 'Compound';
            return (
              <TouchableOpacity
                key={ex.name + idx}
                activeOpacity={0.7}
                style={[styles.exRow, active && styles.exRowActive]}
                onPress={() => setExercise(active ? null : ex.name)}>
                {/* Type badge */}
                <View
                  style={[
                    styles.typeBadge,
                    {
                      backgroundColor: isCompound ? '#EEF3FE' : '#F4F3FF',
                    },
                  ]}>
                  <AppText
                    variant="small"
                    color={isCompound ? '#0C2E70' : '#4c1d95'}
                    style={styles.typeBadgeText}>
                    {ex.type}
                  </AppText>
                </View>

                {/* Name + muscles */}
                <View style={styles.exInfo}>
                  <AppText
                    variant="bodyBold"
                    style={{fontSize: ms(12)}}
                    color={active ? Colors.accent : Colors.textPrimary}>
                    {ex.name}
                  </AppText>
                  <AppText
                    variant="small"
                    color={Colors.textTertiary}
                    style={{fontSize: ms(9)}}>
                    {ex.muscles}
                  </AppText>
                </View>

                {/* Previous */}
                <AppText
                  variant="small"
                  color={Colors.textTertiary}
                  style={styles.exPrev}>
                  {ex.prev}
                </AppText>

                {/* Pattern badge */}
                <View style={styles.patternBadge}>
                  <AppText variant="small" color={Colors.textSecondary} style={{fontSize: ms(8)}}>
                    {ex.pattern}
                  </AppText>
                </View>

                {/* Equipment */}
                <AppText
                  variant="small"
                  color={Colors.textPrimary}
                  style={styles.exEquip}>
                  {ex.equip}
                </AppText>
              </TouchableOpacity>
            );
          })}

          <TouchableOpacity activeOpacity={0.6} style={styles.addCustom}>
            <AppText variant="caption" color={Colors.accent}>
              + Add custom exercise
            </AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* ── Layer 3: Sets / Reps / Weight Table ──────── */}
      {exercise && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText variant="bodyBold" style={styles.cardTitle}>
              Sets, reps &amp; load &ndash; {exercise}
            </AppText>
            <TouchableOpacity activeOpacity={0.6} onPress={addSet}>
              <AppText variant="caption" color={Colors.accent}>
                + Add set
              </AppText>
            </TouchableOpacity>
          </View>

          {/* Table header */}
          <View style={styles.tableHeader}>
            <AppText variant="small" color={Colors.textTertiary} style={styles.colSet}>
              Set
            </AppText>
            <AppText variant="small" color={Colors.textTertiary} style={styles.colReps}>
              Reps
            </AppText>
            <AppText variant="small" color={Colors.textTertiary} style={styles.colWeight}>
              Weight(kg)
            </AppText>
            <AppText variant="small" color={Colors.textTertiary} style={styles.colRpe}>
              RPE
            </AppText>
            <AppText variant="small" color={Colors.textTertiary} style={styles.colPrev}>
              Previous
            </AppText>
            <AppText variant="small" color={Colors.textTertiary} style={styles.colDel}>
              {' '}
            </AppText>
          </View>

          {/* Rows */}
          {sets.map((row, idx) => (
            <View key={idx} style={styles.tableRow}>
              <AppText variant="bodyBold" color={Colors.textSecondary} style={styles.colSet}>
                {idx + 1}
              </AppText>

              <TextInput
                style={[styles.tableInput, styles.colReps]}
                keyboardType="numeric"
                value={row.reps}
                onChangeText={(v) => updateSet(idx, 'reps', v)}
                placeholder="-"
                placeholderTextColor={Colors.textTertiary}
              />
              <TextInput
                style={[styles.tableInput, styles.colWeight]}
                keyboardType="numeric"
                value={row.weight}
                onChangeText={(v) => updateSet(idx, 'weight', v)}
                placeholder="-"
                placeholderTextColor={Colors.textTertiary}
              />
              <TextInput
                style={[styles.tableInput, styles.colRpe]}
                keyboardType="numeric"
                value={row.rpe}
                onChangeText={(v) => updateSet(idx, 'rpe', v)}
                placeholder="-"
                placeholderTextColor={Colors.textTertiary}
              />

              <AppText
                variant="small"
                color={Colors.textTertiary}
                style={styles.colPrev}>
                45x10
              </AppText>

              {sets.length > 1 ? (
                <TouchableOpacity
                  activeOpacity={0.6}
                  style={styles.colDel}
                  onPress={() => removeSet(idx)}>
                  <AppText variant="small" color={Colors.red}>
                    x
                  </AppText>
                </TouchableOpacity>
              ) : (
                <View style={styles.colDel} />
              )}
            </View>
          ))}

          {/* Footer: Volume + 1RM */}
          <View style={styles.tableFooter}>
            <AppText variant="small" color={Colors.textSecondary}>
              Total volume: {totalVolume.toLocaleString()} kg
            </AppText>
            <AppText variant="small" color={Colors.textSecondary}>
              Est. 1RM: {estimated1RM > 0 ? `${estimated1RM} kg` : '\u2013'}
            </AppText>
          </View>
        </View>
      )}

      {/* ── Rest Timer ───────────────────────────────── */}
      {exercise && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText variant="bodyBold" style={styles.cardTitle}>
              Rest timer
            </AppText>
            <AppText variant="small" color={Colors.textTertiary}>
              Auto-starts after each set
            </AppText>
          </View>

          {/* Preset buttons */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.restRow}>
            {REST_PRESETS.map((sec) => {
              const active = restSec === sec;
              return (
                <TouchableOpacity
                  key={sec}
                  activeOpacity={0.7}
                  style={[styles.restPill, active && styles.restPillActive]}
                  onPress={() => {
                    setRestSec(sec);
                    setTimerValue(sec);
                    resetTimer();
                  }}>
                  <AppText
                    variant="small"
                    color={active ? Colors.primary : Colors.textSecondary}>
                    {presetLabel(sec)}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>

          {/* Timer display */}
          <AppText style={styles.timerDisplay} color={Colors.accent}>
            {fmtTime(timerValue)}
          </AppText>

          {/* Start / Reset */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.startBtn}
            onPress={timerRunning ? resetTimer : startTimer}>
            <AppText variant="bodyBold" color={Colors.white}>
              {timerRunning ? 'Stop' : 'Start'}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.6} onPress={resetTimer} style={styles.resetBtn}>
            <AppText variant="caption" color={Colors.textSecondary}>
              Reset
            </AppText>
          </TouchableOpacity>

          <AppText variant="small" color={Colors.textTertiary} style={styles.restInfo}>
            Strength (3-5 min) &middot; Hypertrophy (60-90s) &middot; Endurance (30-60s)
          </AppText>
        </View>
      )}

      {/* ── Tempo Picker ─────────────────────────────── */}
      {exercise && (
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText variant="bodyBold" style={styles.cardTitle}>
              Lifting tempo
            </AppText>
            <AppText variant="small" color={Colors.textTertiary}>
              Seconds &middot; 0 = explosive
            </AppText>
          </View>

          <View style={styles.tempoRow}>
            {/* Eccentric */}
            <View style={styles.tempoCol}>
              <AppText variant="small" color={Colors.textTertiary} style={styles.tempoLabel}>
                ECCENTRIC (DOWN)
              </AppText>
              <TextInput
                style={styles.tempoInput}
                keyboardType="numeric"
                value={tempo[0]}
                onChangeText={(v) => updateTempo(0, v)}
                maxLength={2}
              />
            </View>

            <AppText style={styles.tempoDash} color={Colors.textTertiary}>
              &ndash;
            </AppText>

            {/* Pause */}
            <View style={styles.tempoCol}>
              <AppText variant="small" color={Colors.textTertiary} style={styles.tempoLabel}>
                PAUSE / HOLD
              </AppText>
              <TextInput
                style={styles.tempoInput}
                keyboardType="numeric"
                value={tempo[1]}
                onChangeText={(v) => updateTempo(1, v)}
                maxLength={2}
              />
            </View>

            <AppText style={styles.tempoDash} color={Colors.textTertiary}>
              &ndash;
            </AppText>

            {/* Concentric */}
            <View style={styles.tempoCol}>
              <AppText variant="small" color={Colors.textTertiary} style={styles.tempoLabel}>
                CONCENTRIC (UP)
              </AppText>
              <TextInput
                style={styles.tempoInput}
                keyboardType="numeric"
                value={tempo[2]}
                onChangeText={(v) => updateTempo(2, v)}
                maxLength={2}
              />
            </View>
          </View>

          <View style={styles.tempoFooter}>
            <AppText variant="small" color={Colors.textSecondary}>
              Tempo: {tempo[0] || '0'}-{tempo[1] || '0'}-{tempo[2] || '0'}
            </AppText>
            <AppText variant="small" color={Colors.textSecondary}>
              TUT per rep: {tempoTUT()}s
            </AppText>
          </View>
        </View>
      )}

      {/* ── RPE Scale ────────────────────────────────── */}
      {exercise && (
        <View style={styles.card}>
          <AppText variant="bodyBold" style={styles.cardTitle}>
            How hard was this session overall?
          </AppText>

          <View style={styles.rpeRow}>
            {Array.from({length: 10}, (_, i) => i + 1).map((n) => {
              const active = rpe === n;
              const colors = rpeColor(n);
              return (
                <TouchableOpacity
                  key={n}
                  activeOpacity={0.7}
                  style={[
                    styles.rpeBtn,
                    {backgroundColor: active ? Colors.accent : colors.bg},
                  ]}
                  onPress={() => setRpe(n)}>
                  <AppText
                    variant="small"
                    style={styles.rpeBtnText}
                    color={active ? Colors.white : colors.text}>
                    {n}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          {rpe > 0 && (
            <View style={styles.rpeFooter}>
              <AppText variant="small" color={Colors.textSecondary}>
                RPE {rpe}: {RPE_DESCRIPTIONS[rpe - 1]}
              </AppText>
              <AppText variant="small" color={Colors.textSecondary}>
                ~{RPE_PCT[rpe - 1]}% of 1RM
              </AppText>
            </View>
          )}
        </View>
      )}

      {/* ── Layer 4: Goal Grid ───────────────────────── */}
      {exercise && (
        <View style={styles.card}>
          <AppText variant="bodyBold" style={styles.cardTitle}>
            Training goal &ndash; how is this session structured?
          </AppText>

          <View style={styles.goalGrid}>
            {GOALS.map((g) => {
              const active = goal === g.id;
              const isPerformance = g.id === 'performance';
              return (
                <TouchableOpacity
                  key={g.id}
                  activeOpacity={0.7}
                  style={[
                    styles.goalItem,
                    active && {
                      backgroundColor: g.activeBg,
                      borderColor: g.activeBorder,
                    },
                  ]}
                  onPress={() => setGoal(active ? null : g.id)}>
                  <AppText style={styles.goalEmoji}>{g.emoji}</AppText>
                  <AppText
                    variant="bodyBold"
                    numberOfLines={1}
                    style={styles.goalName}
                    color={
                      active
                        ? isPerformance
                          ? Colors.white
                          : g.activeColor
                        : Colors.textPrimary
                    }>
                    {g.name}
                  </AppText>
                  <AppText
                    variant="small"
                    color={
                      active && isPerformance
                        ? '#fca5a5'
                        : Colors.textTertiary
                    }
                    style={styles.goalDesc}>
                    {g.desc}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>

          {/* Goal insight */}
          {goal && GOAL_INSIGHTS[goal] && (
            <View style={styles.goalInsight}>
              <AppText variant="small" color={Colors.blueText}>
                {GOAL_INSIGHTS[goal]}
              </AppText>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

/* ═══════════════════════════════════════════════════════
   S T Y L E S
   ═══════════════════════════════════════════════════════ */

const styles = StyleSheet.create({
  container: {
    gap: vs(12),
  },

  /* Card wrapper */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: ms(14),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  cardTitle: {
    fontSize: ms(13),
    marginBottom: vs(2),
  },
  cardSub: {
    marginBottom: vs(8),
  },

  /* ── Layer 1: Functional filter ─────────────────────── */
  filterRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginBottom: vs(10),
  },
  filterPill: {
    paddingHorizontal: s(12),
    paddingVertical: vs(5),
    borderRadius: ms(20),
    backgroundColor: Colors.purpleBg,
  },
  filterPillActive: {
    backgroundColor: Colors.purple,
  },
  filterPillText: {
    fontSize: ms(10),
    fontWeight: '700',
  },

  /* Body part grid */
  bpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
  },
  bpItem: {
    width: '23%',
    alignItems: 'center',
    paddingVertical: vs(8),
    borderRadius: ms(10),
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: 'transparent',
  },
  bpItemActive: {
    backgroundColor: Colors.purpleBg,
    borderColor: Colors.purple,
  },
  bpEmoji: {
    fontSize: ms(16),
    lineHeight: ms(20),
    textAlign: 'center',
    marginBottom: vs(2),
  },
  bpName: {
    fontSize: ms(9),
    fontWeight: '700',
    textAlign: 'center',
  },

  /* ── Layer 2: Exercise list ─────────────────────────── */
  exRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: s(6),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    gap: s(6),
  },
  exRowActive: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.teal,
    borderWidth: 1,
    borderRadius: ms(8),
    borderBottomWidth: 1,
    borderBottomColor: Colors.teal,
  },
  typeBadge: {
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(4),
  },
  typeBadgeText: {
    fontSize: ms(8),
    fontWeight: '600',
  },
  exInfo: {
    flex: 1,
    gap: vs(1),
  },
  exPrev: {
    fontSize: ms(9),
    maxWidth: s(70),
  },
  patternBadge: {
    backgroundColor: Colors.background,
    paddingHorizontal: s(5),
    paddingVertical: vs(2),
    borderRadius: ms(4),
  },
  exEquip: {
    fontSize: ms(9),
    fontWeight: '600',
    minWidth: s(50),
    textAlign: 'right',
  },
  addCustom: {
    paddingTop: vs(10),
    alignItems: 'center',
  },

  /* ── Layer 3: Sets table ────────────────────────────── */
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: vs(6),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginBottom: vs(4),
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(4),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  colSet: {width: s(28), textAlign: 'center'},
  colReps: {width: s(48), textAlign: 'center'},
  colWeight: {width: s(64), textAlign: 'center'},
  colRpe: {width: s(38), textAlign: 'center'},
  colPrev: {flex: 1, textAlign: 'center'},
  colDel: {width: s(24), alignItems: 'center'},
  tableInput: {
    backgroundColor: Colors.background,
    borderRadius: ms(6),
    paddingVertical: vs(4),
    paddingHorizontal: s(4),
    fontSize: ms(12),
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  tableFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: vs(8),
  },

  /* ── Rest timer ─────────────────────────────────────── */
  restRow: {
    flexDirection: 'row',
    gap: s(6),
    paddingBottom: vs(10),
  },
  restPill: {
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    backgroundColor: Colors.background,
  },
  restPillActive: {
    backgroundColor: Colors.tealBg,
  },
  timerDisplay: {
    fontSize: ms(32),
    fontWeight: '700',
    textAlign: 'center',
    marginVertical: vs(12),
  },
  startBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: vs(12),
    borderRadius: ms(10),
    alignItems: 'center',
    marginBottom: vs(6),
  },
  resetBtn: {
    alignItems: 'center',
    paddingVertical: vs(6),
  },
  restInfo: {
    textAlign: 'center',
    marginTop: vs(8),
  },

  /* ── Tempo ──────────────────────────────────────────── */
  tempoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(6),
    marginVertical: vs(10),
  },
  tempoCol: {
    alignItems: 'center',
    flex: 1,
  },
  tempoLabel: {
    fontSize: ms(8),
    fontWeight: '600',
    textTransform: 'uppercase',
    marginBottom: vs(4),
    textAlign: 'center',
  },
  tempoInput: {
    backgroundColor: Colors.background,
    borderRadius: ms(8),
    paddingVertical: vs(8),
    paddingHorizontal: s(8),
    fontSize: ms(18),
    fontWeight: '700',
    color: Colors.accent,
    textAlign: 'center',
    width: s(52),
  },
  tempoDash: {
    fontSize: ms(18),
    fontWeight: '700',
    marginTop: vs(16),
  },
  tempoFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: vs(4),
  },

  /* ── RPE ────────────────────────────────────────────── */
  rpeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginTop: vs(10),
    justifyContent: 'center',
  },
  rpeBtn: {
    width: s(28),
    height: s(28),
    borderRadius: ms(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rpeBtnText: {
    fontSize: ms(11),
    fontWeight: '700',
  },
  rpeFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(10),
  },

  /* ── Goal grid ──────────────────────────────────────── */
  goalGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginTop: vs(10),
  },
  goalItem: {
    width: '31%',
    borderRadius: ms(10),
    padding: ms(10),
    backgroundColor: Colors.background,
    borderWidth: 1.5,
    borderColor: 'transparent',
    alignItems: 'center',
  },
  goalEmoji: {
    fontSize: ms(18),
    lineHeight: ms(24),
    textAlign: 'center',
    marginBottom: vs(4),
  },
  goalName: {
    fontSize: ms(10),
    textAlign: 'center',
    marginBottom: vs(2),
  },
  goalDesc: {
    fontSize: ms(8),
    textAlign: 'center',
    lineHeight: ms(11),
  },
  goalInsight: {
    backgroundColor: Colors.blueBg,
    borderRadius: ms(8),
    padding: ms(10),
    marginTop: vs(10),
  },
});

export default StrengthFlow;
