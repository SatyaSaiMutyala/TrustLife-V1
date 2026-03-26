import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  ScrollView,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {
  EXERCISES_DB,
  FUNC_GROUPS,
  GOALS,
  MUSCLES,
  EQUIP_TYPES,
  BODY_PARTS_UPPER,
  BODY_PARTS_LOWER,
  FEELINGS,
  DAY_NAMES,
  generateDemoHistory,
} from '../../../constants/strengthData';

/* ─── Constants ──────────────────────────────────────── */

const REST_PRESETS = [30, 45, 90, 120, 180, 240, 300];

const RPE_COLORS = [
  {bg: '#E8F5E9', text: '#2E7D32'},
  {bg: '#E8F5E9', text: '#2E7D32'},
  {bg: '#E0F7FA', text: '#00695C'},
  {bg: '#E0F7FA', text: '#00695C'},
  {bg: '#FFF8E1', text: '#F57F17'},
  {bg: '#FFF8E1', text: '#F57F17'},
  {bg: '#FFF3E0', text: '#E65100'},
  {bg: Colors.redBg, text: Colors.redText},
  {bg: '#3b0a0a', text: '#fca5a5'},
  {bg: '#3b0a0a', text: '#fca5a5'},
];

const SEVERITY_CYCLE = ['none', 'mild', 'moderate', 'severe'];
const SEVERITY_COLORS = {
  none: {bg: Colors.borderLight, text: Colors.textTertiary, border: Colors.borderLight},
  mild: {bg: '#FFF8E1', text: '#F57F17', border: '#FFD54F'},
  moderate: {bg: Colors.amberBg, text: Colors.amberDark, border: Colors.amber},
  severe: {bg: Colors.redBg, text: Colors.redDark, border: Colors.red},
};

const FEELING_COLORS = {
  negative: {bg: Colors.redBg, text: Colors.redText, border: Colors.red},
  neutral: {bg: Colors.amberBg, text: Colors.amberText, border: Colors.amber},
  positive: {bg: Colors.tealBg, text: Colors.tealText, border: Colors.teal},
};

const WATER_GOAL = 8;

/* ─── Helpers ────────────────────────────────────────── */

const ALL_EXERCISES = Object.values(EXERCISES_DB).flat();
const findEx = (id) => ALL_EXERCISES.find((e) => e.id === id) || null;

const getPlanDay = (plan) => {
  if (!plan || !plan.startDate) return null;
  const start = new Date(plan.startDate);
  const now = new Date();
  const diffMs = now.getTime() - start.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
  if (!plan.days || plan.days.length === 0) return null;
  const dayIndex = diffDays % plan.days.length;
  return plan.days[dayIndex >= 0 ? dayIndex : 0];
};

const fmtTime = (sec) => {
  const m = Math.floor(sec / 60);
  const s_ = sec % 60;
  return `${m}:${s_ < 10 ? '0' : ''}${s_}`;
};

const presetLabel = (sec) =>
  sec < 60
    ? `${sec}s`
    : `${Math.floor(sec / 60)}:${sec % 60 === 0 ? '00' : sec % 60 < 10 ? '0' + (sec % 60) : sec % 60}`;

const rpeColor = (n) => RPE_COLORS[Math.max(0, Math.min(9, n - 1))] || RPE_COLORS[4];

const calcVolume = (weight, reps) => {
  const w = parseFloat(weight) || 0;
  const r = parseInt(reps, 10) || 0;
  return w * r;
};

const est1RM = (weight, reps) => {
  const w = parseFloat(weight) || 0;
  const r = parseInt(reps, 10) || 0;
  if (w <= 0 || r <= 0) return 0;
  if (r === 1) return w;
  return Math.round(w * (1 + r / 30));
};

const formatElapsed = (startTime) => {
  const diff = Math.floor((Date.now() - startTime) / 1000);
  const hrs = Math.floor(diff / 3600);
  const mins = Math.floor((diff % 3600) / 60);
  const secs = diff % 60;
  if (hrs > 0) return `${hrs}h ${mins}m`;
  return `${mins}m ${secs < 10 ? '0' : ''}${secs}s`;
};

const kgToLbs = (kg) => Math.round(parseFloat(kg) * 2.20462 * 10) / 10;
const lbsToKg = (lbs) => Math.round(parseFloat(lbs) / 2.20462 * 10) / 10;

const cupsToLitres = (cups) => Math.round(cups * 0.2366 * 100) / 100;

/* ─── Component ──────────────────────────────────────── */

const DailyLogTab = ({plan, logState, setLogState, onOpenRestTimer, onShowAyu}) => {
  const {dayId, sets, sessionUnit, restSec, sessionStartTime, waterAmount, waterUnit} = logState || {};

  /* --- Local UI state ---------------------------------- */
  const [gymName, setGymName] = useState('');
  const [gymLocation, setGymLocation] = useState('');
  const [sessionNotes, setSessionNotes] = useState('');
  const [wellnessNotes, setWellnessNotes] = useState('');
  const [effortValue, setEffortValue] = useState(5);
  const [sessionRpe, setSessionRpe] = useState(0);
  const [feelings, setFeelings] = useState({});
  const [discomfort, setDiscomfort] = useState({});
  const [equipOverrides, setEquipOverrides] = useState({});
  const [machineNames, setMachineNames] = useState({});
  const [elapsed, setElapsed] = useState('0m 00s');

  /* --- Rest timer local state -------------------------- */
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerValue, setTimerValue] = useState(restSec || 90);
  const [timerTarget, setTimerTarget] = useState(restSec || 90);
  const intervalRef = useRef(null);
  const scrollRef = useRef(null);

  /* --- Derived data ------------------------------------ */
  const planDay = useMemo(() => {
    if (!plan || !plan.days) return null;
    return plan.days.find((d) => d.id === dayId) || plan.days[0] || null;
  }, [plan, dayId]);

  const exercises = useMemo(() => {
    if (!planDay || !planDay.exercises) return [];
    return planDay.exercises.map((pe) => ({
      ...pe,
      info: findEx(pe.exId),
    }));
  }, [planDay]);

  const weekNumber = useMemo(() => {
    if (!plan || !plan.startDate) return 1;
    const diff = Math.floor((Date.now() - new Date(plan.startDate).getTime()) / (7 * 24 * 60 * 60 * 1000));
    return Math.max(1, diff + 1);
  }, [plan]);

  const goalObj = useMemo(() => {
    if (!planDay || !planDay.goal) return GOALS[0] || {name: 'General'};
    return GOALS.find((g) => g.id === planDay.goal) || GOALS[0] || {name: 'General'};
  }, [planDay]);

  /* --- Previous session lookup per exercise ------------- */
  const prevSessionMap = useMemo(() => {
    const history = generateDemoHistory(sessionUnit);
    const map = {};
    (exercises || []).forEach((pe) => {
      const exId = pe.exId;
      for (let i = 0; i < history.length; i++) {
        const sess = history[i];
        const ex = (sess.exercises || []).find(
          (e) => e.exId === exId,
        );
        if (ex && ex.sets && ex.sets.length > 0) {
          const maxW = Math.max(...ex.sets.map((s) => s.wt || 0));
          const totalVol = ex.sets.reduce(
            (a, s) => a + (s.wt || 0) * (s.reps || 0),
            0,
          );
          const bestSet = ex.sets.reduce((best, s) => {
            const e1 = est1RM(s.wt || 0, s.reps || 0);
            return e1 > (best.e1rm || 0) ? {wt: s.wt, reps: s.reps, e1rm: e1} : best;
          }, {e1rm: 0});
          map[exId] = {
            date: sess.date || 'Previous',
            sets: ex.sets,
            maxW,
            vol: Math.round(totalVol),
            est1RM: bestSet.e1rm || 0,
            unit: sess.unit || sessionUnit,
          };
          break;
        }
      }
    });
    return map;
  }, [exercises, sessionUnit]);

  /* --- Stats calculations ------------------------------ */
  const stats = useMemo(() => {
    let setsDone = 0;
    let totalSets = 0;
    let volume = 0;
    let maxWeight = 0;
    let prs = 0;

    Object.keys(sets || {}).forEach((exId) => {
      const exSets = (sets || {})[exId] || [];
      exSets.forEach((st) => {
        totalSets += 1;
        if (st.done) {
          setsDone += 1;
          const v = calcVolume(st.weight, st.reps);
          volume += v;
          const w = parseFloat(st.weight) || 0;
          if (w > maxWeight) maxWeight = w;
        }
        if (st.drops) {
          st.drops.forEach((d) => {
            totalSets += 1;
            if (d.done) {
              setsDone += 1;
              volume += calcVolume(d.weight, d.reps);
            }
          });
        }
      });
    });

    return {setsDone, totalSets, volume, maxWeight, prs};
  }, [sets]);

  const progressPct = stats.totalSets > 0 ? Math.round((stats.setsDone / stats.totalSets) * 100) : 0;

  /* --- Elapsed time ticker ----------------------------- */
  useEffect(() => {
    const tick = setInterval(() => {
      setElapsed(formatElapsed(sessionStartTime));
    }, 1000);
    return () => clearInterval(tick);
  }, [sessionStartTime]);

  /* --- Rest timer logic -------------------------------- */
  useEffect(() => {
    if (timerRunning && timerValue > 0) {
      intervalRef.current = setInterval(() => {
        setTimerValue((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            setTimerRunning(false);
            // timer complete
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [timerRunning, timerTarget]);

  const startTimer = () => {
    setTimerValue(timerTarget);
    setTimerRunning(true);
  };

  const resetTimer = () => {
    setTimerRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerValue(timerTarget);
  };

  const skipTimer = () => {
    setTimerRunning(false);
    if (intervalRef.current) clearInterval(intervalRef.current);
    setTimerValue(0);
  };

  /* --- Log state updaters ------------------------------ */
  const updateSet = useCallback((exId, setIdx, field, value) => {
    setLogState((prev) => {
      const exSets = [...(prev.sets[exId] || [])];
      exSets[setIdx] = {...exSets[setIdx], [field]: value};
      return {...prev, sets: {...prev.sets, [exId]: exSets}};
    });
  }, [setLogState]);

  const updateDropSet = useCallback((exId, setIdx, dropIdx, field, value) => {
    setLogState((prev) => {
      const exSets = [...(prev.sets[exId] || [])];
      const parentSet = {...exSets[setIdx]};
      const drops = [...(parentSet.drops || [])];
      drops[dropIdx] = {...drops[dropIdx], [field]: value};
      parentSet.drops = drops;
      exSets[setIdx] = parentSet;
      return {...prev, sets: {...prev.sets, [exId]: exSets}};
    });
  }, [setLogState]);

  const toggleSetDone = useCallback((exId, setIdx) => {
    setLogState((prev) => {
      const exSets = [...(prev.sets[exId] || [])];
      const current = {...exSets[setIdx]};
      const willBeDone = !current.done;

      if (willBeDone) {
        if (!current.reps && current.planned_reps) current.reps = current.planned_reps;
        if (!current.weight && current.planned_weight) current.weight = current.planned_weight;
        current.done = true;
        startTimer();
      } else {
        current.done = false;
      }

      exSets[setIdx] = current;
      return {...prev, sets: {...prev.sets, [exId]: exSets}};
    });
  }, [setLogState, timerTarget]);

  const toggleDropSetDone = useCallback((exId, setIdx, dropIdx) => {
    setLogState((prev) => {
      const exSets = [...(prev.sets[exId] || [])];
      const parentSet = {...exSets[setIdx]};
      const drops = [...(parentSet.drops || [])];
      drops[dropIdx] = {...drops[dropIdx], done: !drops[dropIdx].done};
      parentSet.drops = drops;
      exSets[setIdx] = parentSet;
      return {...prev, sets: {...prev.sets, [exId]: exSets}};
    });
  }, [setLogState]);

  const addSet = useCallback((exId) => {
    setLogState((prev) => {
      const exSets = [...(prev.sets[exId] || [])];
      const last = exSets[exSets.length - 1] || {};
      exSets.push({
        reps: '',
        weight: '',
        rpe: '',
        drops: [],
        done: false,
        planned_reps: last.planned_reps || '',
        planned_weight: last.planned_weight || '',
      });
      return {...prev, sets: {...prev.sets, [exId]: exSets}};
    });
  }, [setLogState]);

  const addDropSet = useCallback((exId, setIdx) => {
    setLogState((prev) => {
      const exSets = [...(prev.sets[exId] || [])];
      const parentSet = {...exSets[setIdx]};
      const drops = [...(parentSet.drops || [])];
      const parentWeight = parseFloat(parentSet.weight) || parseFloat(parentSet.planned_weight) || 0;
      const suggestedWeight = Math.round(parentWeight * 0.8 * 10) / 10;
      drops.push({
        reps: '',
        weight: suggestedWeight > 0 ? String(suggestedWeight) : '',
        rpe: '',
        done: false,
      });
      parentSet.drops = drops;
      exSets[setIdx] = parentSet;
      return {...prev, sets: {...prev.sets, [exId]: exSets}};
    });
  }, [setLogState]);

  const removeDropSet = useCallback((exId, setIdx, dropIdx) => {
    setLogState((prev) => {
      const exSets = [...(prev.sets[exId] || [])];
      const parentSet = {...exSets[setIdx]};
      const drops = [...(parentSet.drops || [])];
      drops.splice(dropIdx, 1);
      parentSet.drops = drops;
      exSets[setIdx] = parentSet;
      return {...prev, sets: {...prev.sets, [exId]: exSets}};
    });
  }, [setLogState]);

  const addExercise = useCallback(() => {
    if (onShowAyu) onShowAyu('addExercise');
  }, [onShowAyu]);

  const toggleUnit = useCallback(() => {
    setLogState((prev) => ({
      ...prev,
      sessionUnit: prev.sessionUnit === 'kg' ? 'lbs' : 'kg',
    }));
  }, [setLogState]);

  const adjustWater = useCallback((delta) => {
    setLogState((prev) => ({
      ...prev,
      waterAmount: Math.max(0, prev.waterAmount + delta),
    }));
  }, [setLogState]);

  const toggleWaterUnit = useCallback(() => {
    setLogState((prev) => ({
      ...prev,
      waterUnit: prev.waterUnit === 'cups' ? 'litres' : 'cups',
    }));
  }, [setLogState]);

  const cycleDiscomfort = useCallback((part) => {
    setDiscomfort((prev) => {
      const current = prev[part] || 'none';
      const idx = SEVERITY_CYCLE.indexOf(current);
      const next = SEVERITY_CYCLE[(idx + 1) % SEVERITY_CYCLE.length];
      return {...prev, [part]: next};
    });
  }, []);

  const toggleFeeling = useCallback((fId) => {
    setFeelings((prev) => ({...prev, [fId]: !prev[fId]}));
  }, []);

  const toggleEquipType = useCallback((exId, equipType) => {
    setEquipOverrides((prev) => ({...prev, [exId]: equipType}));
  }, []);

  /* --- Severity alert check ---------------------------- */
  const hasSevereDiscomfort = useMemo(() => {
    return Object.values(discomfort).some((v) => v === 'severe');
  }, [discomfort]);

  const hasDangerousFeeling = useMemo(() => {
    if (!FEELINGS) return false;
    return FEELINGS.filter((f) => f.type === 'neg').some((f) => feelings[f.id]);
  }, [feelings]);

  const showAlert = hasSevereDiscomfort || hasDangerousFeeling;

  /* --- Date formatting --------------------------------- */
  const todayStr = useMemo(() => {
    const d = new Date();
    return d.toLocaleDateString('en-US', {weekday: 'short', month: 'short', day: 'numeric', year: 'numeric'});
  }, []);

  /* ─── Render helpers ───────────────────────────────── */

  const renderSetRow = (exId, st, setIdx, isLast) => {
    const vol = calcVolume(st.weight, st.reps);
    return (
      <View key={`set-${exId}-${setIdx}`}>
        <View style={[styles.setRow, st.done && styles.setRowDone]}>
          {/* Set number */}
          <View style={styles.setNumCol}>
            <AppText variant="bodyBold" style={styles.setNum}>{setIdx + 1}</AppText>
          </View>

          {/* Weight input */}
          <View style={styles.setInputCol}>
            <TextInput
              style={[styles.setInput, st.done && styles.setInputDone]}
              value={st.weight}
              onChangeText={(v) => updateSet(exId, setIdx, 'weight', v)}
              placeholder={st.planned_weight || '—'}
              placeholderTextColor={Colors.textTertiary}
              keyboardType="decimal-pad"
              editable={!st.done}
            />
            <AppText variant="small" color={Colors.textTertiary}>{sessionUnit}</AppText>
          </View>

          {/* Reps input */}
          <View style={styles.setInputCol}>
            <TextInput
              style={[styles.setInput, st.done && styles.setInputDone]}
              value={st.reps}
              onChangeText={(v) => updateSet(exId, setIdx, 'reps', v)}
              placeholder={st.planned_reps || '—'}
              placeholderTextColor={Colors.textTertiary}
              keyboardType="number-pad"
              editable={!st.done}
            />
            <AppText variant="small" color={Colors.textTertiary}>reps</AppText>
          </View>

          {/* RPE input */}
          <View style={styles.setInputColSm}>
            <TextInput
              style={[styles.setInput, st.done && styles.setInputDone]}
              value={st.rpe}
              onChangeText={(v) => updateSet(exId, setIdx, 'rpe', v)}
              placeholder="—"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="number-pad"
              editable={!st.done}
              maxLength={2}
            />
            <AppText variant="small" color={Colors.textTertiary}>RPE</AppText>
          </View>

          {/* Previous */}
          <View style={styles.prevCol}>
            <AppText variant="small" color={Colors.textTertiary}>
              {st.planned_weight && st.planned_reps
                ? `${st.planned_weight}×${st.planned_reps}`
                : '—'}
            </AppText>
          </View>

          {/* Volume */}
          <View style={styles.volCol}>
            <AppText variant="small" color={vol > 0 ? Colors.textSecondary : Colors.textTertiary}>
              {vol > 0 ? `${vol}` : '—'}
            </AppText>
          </View>

          {/* Done checkbox */}
          <TouchableOpacity
            style={[styles.doneBtn, st.done && styles.doneBtnActive]}
            onPress={() => toggleSetDone(exId, setIdx)}
            activeOpacity={0.7}>
            <AppText variant="small" color={st.done ? Colors.white : Colors.textTertiary}>
              {st.done ? '✓' : '○'}
            </AppText>
          </TouchableOpacity>

          {/* Add drop set */}
          <TouchableOpacity
            style={styles.addDropBtn}
            onPress={() => addDropSet(exId, setIdx)}
            activeOpacity={0.7}>
            <AppText variant="small" color={Colors.amber}>+</AppText>
          </TouchableOpacity>
        </View>

        {/* Drop sets */}
        {(st.drops || []).map((drop, dropIdx) => (
          <View key={`drop-${exId}-${setIdx}-${dropIdx}`} style={styles.dropRow}>
            <View style={styles.setNumCol}>
              <AppText variant="small" color={Colors.amberText}>D{dropIdx + 1}</AppText>
            </View>
            <View style={styles.setInputCol}>
              <TextInput
                style={[styles.setInput, styles.dropInput, drop.done && styles.setInputDone]}
                value={drop.weight}
                onChangeText={(v) => updateDropSet(exId, setIdx, dropIdx, 'weight', v)}
                placeholder="—"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="decimal-pad"
                editable={!drop.done}
              />
              <AppText variant="small" color={Colors.amberText}>{sessionUnit}</AppText>
            </View>
            <View style={styles.setInputCol}>
              <TextInput
                style={[styles.setInput, styles.dropInput, drop.done && styles.setInputDone]}
                value={drop.reps}
                onChangeText={(v) => updateDropSet(exId, setIdx, dropIdx, 'reps', v)}
                placeholder="—"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="number-pad"
                editable={!drop.done}
              />
              <AppText variant="small" color={Colors.amberText}>reps</AppText>
            </View>
            <TouchableOpacity
              style={styles.removeDropBtn}
              onPress={() => removeDropSet(exId, setIdx, dropIdx)}
              activeOpacity={0.7}>
              <AppText style={styles.removeDropText}>×</AppText>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    );
  };

  const renderExerciseCard = (pe, exIdx) => {
    const exId = pe.exId;
    const info = pe.info;
    const exSets = sets[exId] || [];
    const equipType = equipOverrides[exId] || (info && (info.equip || info.equipment)) || '';
    const showMachineInput = ['machine', 'cable', 'smith'].includes(equipType);

    /* Per-exercise stats */
    let exSetsDone = 0;
    let exVolume = 0;
    let exMaxWeight = 0;
    exSets.forEach((st) => {
      if (st.done) {
        exSetsDone += 1;
        exVolume += calcVolume(st.weight, st.reps);
        const w = parseFloat(st.weight) || 0;
        if (w > exMaxWeight) exMaxWeight = w;
      }
      (st.drops || []).forEach((d) => {
        if (d.done) {
          exSetsDone += 1;
          exVolume += calcVolume(d.weight, d.reps);
        }
      });
    });

    const bestSet = exSets.reduce((best, st) => {
      if (!st.done) return best;
      const w = parseFloat(st.weight) || 0;
      const r = parseInt(st.reps, 10) || 0;
      const e = est1RM(w, r);
      return e > (best.e1rm || 0) ? {weight: w, reps: r, e1rm: e} : best;
    }, {e1rm: 0});

    return (
      <View key={`ex-${exId}-${exIdx}`} style={styles.exerciseCard}>
        {/* Exercise header */}
        <View style={styles.exHeader}>
          <View style={styles.exOrderBadge}>
            <AppText variant="bodyBold" color={Colors.white}>{exIdx + 1}</AppText>
          </View>
          <View style={{flex: 1, marginLeft: s(8)}}>
            <AppText variant="bodyBold" style={styles.exName}>
              {info ? info.name : `Exercise ${exId}`}
            </AppText>
            <AppText variant="small" color={Colors.textSecondary}>
              {pe.targetSets || pe.sets || 3}×{pe.targetReps || pe.reps || '8-12'}
              {(pe.targetWeight || pe.weight) ? ` @ ${pe.targetWeight || pe.weight}${sessionUnit}` : ''}
            </AppText>
          </View>
        </View>

        {/* Equipment type chips */}
        {EQUIP_TYPES && EQUIP_TYPES.length > 0 && (
          <View style={styles.equipRow}>
            {EQUIP_TYPES.map((eq) => {
              const active = equipType === eq.id;
              return (
                <TouchableOpacity
                  key={eq.id}
                  style={[styles.equipChip, active && styles.equipChipActive]}
                  onPress={() => toggleEquipType(exId, eq.id)}
                  activeOpacity={0.7}>
                  <AppText variant="small" color={active ? Colors.white : Colors.textSecondary}>
                    {eq.label || eq.id}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        )}

        {/* Machine name input */}
        {showMachineInput && (
          <View style={styles.machineNameRow}>
            <TextInput
              style={styles.machineNameInput}
              value={machineNames[exId] || ''}
              onChangeText={(v) => setMachineNames((prev) => ({...prev, [exId]: v}))}
              placeholder={`${equipType.charAt(0).toUpperCase() + equipType.slice(1)} name / number`}
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        )}

        {/* Previous session comparison */}
        {prevSessionMap[exId] ? (
          <View style={styles.prevBanner}>
            <View style={styles.prevHeader}>
              <AppText variant="small" color={Colors.accent} style={{fontWeight: '700'}}>
                📊 Previous · {prevSessionMap[exId].date}
              </AppText>
              <AppText variant="small" color={Colors.textTertiary}>
                {prevSessionMap[exId].sets.length} sets
              </AppText>
            </View>
            <View style={styles.prevChips}>
              {prevSessionMap[exId].sets.map((ps, psi) => (
                <View key={psi} style={styles.prevChip}>
                  <AppText style={styles.prevChipLabel}>S{psi + 1}</AppText>
                  <AppText style={styles.prevChipValue}>
                    {ps.wt}{sessionUnit} × {ps.reps}
                  </AppText>
                  {ps.rpe ? (
                    <AppText style={[styles.prevChipRpe, {color: ps.rpe >= 9 ? Colors.red : ps.rpe >= 7 ? Colors.teal : Colors.amber}]}>
                      R{ps.rpe}
                    </AppText>
                  ) : null}
                </View>
              ))}
            </View>
            <View style={styles.prevStats}>
              <AppText variant="small" color={Colors.textSecondary}>
                Max: <AppText variant="small" color={Colors.accent} style={{fontWeight: '700'}}>{prevSessionMap[exId].maxW} {sessionUnit}</AppText>
              </AppText>
              <AppText variant="small" color={Colors.textSecondary}>
                Vol: <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '700'}}>{prevSessionMap[exId].vol} {sessionUnit}</AppText>
              </AppText>
              {prevSessionMap[exId].est1RM > 0 && (
                <AppText variant="small" color={Colors.textSecondary}>
                  1RM: <AppText variant="small" color={Colors.purple} style={{fontWeight: '700'}}>{prevSessionMap[exId].est1RM} {sessionUnit}</AppText>
                </AppText>
              )}
            </View>
          </View>
        ) : (
          <View style={styles.prevBannerEmpty}>
            <AppText variant="small" color={Colors.textTertiary}>
              No previous session data · first logged entry
            </AppText>
          </View>
        )}

        {/* Sets table header */}
        <View style={styles.tableHeader}>
          <View style={styles.setNumCol}>
            <AppText variant="small" color={Colors.textTertiary}>SET</AppText>
          </View>
          <View style={styles.setInputCol}>
            <AppText variant="small" color={Colors.textTertiary}>WEIGHT</AppText>
          </View>
          <View style={styles.setInputCol}>
            <AppText variant="small" color={Colors.textTertiary}>REPS</AppText>
          </View>
          <View style={styles.setInputColSm}>
            <AppText variant="small" color={Colors.textTertiary}>RPE</AppText>
          </View>
          <View style={styles.prevCol}>
            <AppText variant="small" color={Colors.textTertiary}>PREV</AppText>
          </View>
          <View style={styles.volCol}>
            <AppText variant="small" color={Colors.textTertiary}>VOL</AppText>
          </View>
          <View style={{width: s(28)}} />
          <View style={{width: s(22)}} />
        </View>

        {/* Set rows */}
        {exSets.map((st, setIdx) => renderSetRow(exId, st, setIdx, setIdx === exSets.length - 1))}

        {/* Add Set button */}
        <TouchableOpacity style={styles.addSetBtn} onPress={() => addSet(exId)} activeOpacity={0.7}>
          <AppText variant="small" color={Colors.accent}>+ Add Set</AppText>
        </TouchableOpacity>

        {/* Exercise footer stats */}
        <View style={styles.exFooter}>
          <View style={styles.exFooterStat}>
            <AppText variant="small" color={Colors.textTertiary}>Sets</AppText>
            <AppText variant="bodyBold">{exSetsDone}/{exSets.length}</AppText>
          </View>
          <View style={styles.exFooterStat}>
            <AppText variant="small" color={Colors.textTertiary}>Volume</AppText>
            <AppText variant="bodyBold">{exVolume > 0 ? `${exVolume}` : '—'}</AppText>
          </View>
          <View style={styles.exFooterStat}>
            <AppText variant="small" color={Colors.textTertiary}>Max</AppText>
            <AppText variant="bodyBold">{exMaxWeight > 0 ? `${exMaxWeight}${sessionUnit}` : '—'}</AppText>
          </View>
          <View style={styles.exFooterStat}>
            <AppText variant="small" color={Colors.textTertiary}>Est 1RM</AppText>
            <AppText variant="bodyBold">
              {bestSet.e1rm > 0 ? `${bestSet.e1rm}${sessionUnit}` : '—'}
            </AppText>
          </View>
          {bestSet.e1rm > 0 && (
            <View style={styles.prBadge}>
              <AppText variant="small" color={Colors.amberDark}>PR</AppText>
            </View>
          )}
        </View>
      </View>
    );
  };

  /* ─── Main Render ──────────────────────────────────── */

  return (
    <ScrollView
      ref={scrollRef}
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">

      {/* ═══ 1. Session Header Card ═══════════════════════ */}
      <View style={styles.sessionCard}>
        <View style={styles.sessionCardInner}>
          {/* Day label */}
          <AppText variant="small" color={Colors.heroTextMuted} style={styles.dayLabel}>
            DAY {dayId} OF WEEK {weekNumber} · {planDay ? (planDay.label || planDay.name || '').toUpperCase() : 'REST'}
          </AppText>

          {/* Session name */}
          <AppText variant="header" color={Colors.white} style={styles.sessionName}>
            {planDay ? planDay.name || `Day ${dayId}` : `Day ${dayId}`}
          </AppText>
          {planDay && planDay.subtitle && (
            <AppText variant="caption" color={Colors.heroTextMuted}>
              {planDay.subtitle}
            </AppText>
          )}

          {/* Meta row */}
          <View style={styles.metaRow}>
            <AppText variant="small" color={Colors.heroTextSubtle}>{todayStr}</AppText>
            <View style={styles.metaDot} />
            <AppText variant="small" color={Colors.heroTextSubtle}>{goalObj.name}</AppText>
            <View style={styles.metaDot} />
            <AppText variant="small" color={Colors.heroTextSubtle}>
              {stats.totalSets} sets · {exercises.length} exercises
            </AppText>
          </View>

          {/* Gym inputs */}
          <View style={styles.gymRow}>
            <TextInput
              style={styles.gymInput}
              value={gymName}
              onChangeText={setGymName}
              placeholder="Gym name"
              placeholderTextColor={Colors.heroTextSubtle}
            />
            <TextInput
              style={[styles.gymInput, {marginLeft: s(8)}]}
              value={gymLocation}
              onChangeText={setGymLocation}
              placeholder="Location"
              placeholderTextColor={Colors.heroTextSubtle}
            />
          </View>

          {/* Unit toggle */}
          <TouchableOpacity style={styles.unitToggle} onPress={toggleUnit} activeOpacity={0.7}>
            <View style={[styles.unitOption, sessionUnit === 'kg' && styles.unitOptionActive]}>
              <AppText variant="small" color={sessionUnit === 'kg' ? Colors.white : Colors.heroTextSubtle}>
                kg
              </AppText>
            </View>
            <View style={[styles.unitOption, sessionUnit === 'lbs' && styles.unitOptionActive]}>
              <AppText variant="small" color={sessionUnit === 'lbs' ? Colors.white : Colors.heroTextSubtle}>
                lbs
              </AppText>
            </View>
          </TouchableOpacity>

          {/* Stats band */}
          <View style={styles.statsBand}>
            <View style={styles.statItem}>
              <AppText variant="small" color={Colors.heroTextMuted}>Sets Done</AppText>
              <AppText variant="bodyBold" color={Colors.white}>{stats.setsDone}/{stats.totalSets}</AppText>
            </View>
            <View style={styles.statItem}>
              <AppText variant="small" color={Colors.heroTextMuted}>Volume</AppText>
              <AppText variant="bodyBold" color={Colors.white}>
                {stats.volume > 0 ? `${Math.round(stats.volume)} ${sessionUnit}` : '—'}
              </AppText>
            </View>
            <View style={styles.statItem}>
              <AppText variant="small" color={Colors.heroTextMuted}>Active</AppText>
              <AppText variant="bodyBold" color={Colors.white}>{elapsed}</AppText>
            </View>
            <View style={styles.statItem}>
              <AppText variant="small" color={Colors.heroTextMuted}>PRs</AppText>
              <AppText variant="bodyBold" color={Colors.amber}>{stats.prs}</AppText>
            </View>
          </View>
        </View>
      </View>

      {/* ═══ 2. Water Intake Card ═════════════════════════ */}
      <View style={styles.waterCard}>
        <View style={styles.waterHeader}>
          <AppText variant="bodyBold">Water Intake</AppText>
          <TouchableOpacity style={styles.waterUnitToggle} onPress={toggleWaterUnit} activeOpacity={0.7}>
            <AppText variant="small" color={Colors.tealText}>
              {waterUnit === 'cups' ? 'cups' : 'litres'}
            </AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.waterControls}>
          <TouchableOpacity style={styles.waterBtn} onPress={() => adjustWater(-1)} activeOpacity={0.7}>
            <AppText variant="header" color={Colors.tealDark}>−</AppText>
          </TouchableOpacity>

          <View style={styles.waterDisplay}>
            <AppText variant="header" color={Colors.tealDark} style={styles.waterCount}>
              {waterAmount}
            </AppText>
            <AppText variant="small" color={Colors.tealText}>
              {waterUnit === 'cups'
                ? `cups (${cupsToLitres(waterAmount)}L)`
                : `litres (${Math.round(waterAmount / 0.2366)} cups)`}
            </AppText>
          </View>

          <TouchableOpacity style={styles.waterBtn} onPress={() => adjustWater(1)} activeOpacity={0.7}>
            <AppText variant="header" color={Colors.tealDark}>+</AppText>
          </TouchableOpacity>
        </View>

        {/* Dot indicators */}
        <View style={styles.waterDots}>
          {Array.from({length: WATER_GOAL}).map((_, i) => (
            <View
              key={`dot-${i}`}
              style={[
                styles.waterDot,
                i < waterAmount && styles.waterDotFilled,
              ]}
            />
          ))}
        </View>
        <AppText variant="small" color={Colors.textTertiary} style={styles.waterGoalText}>
          {waterAmount >= WATER_GOAL
            ? 'Goal reached!'
            : `${WATER_GOAL - waterAmount} ${waterUnit} to go`}
        </AppText>
      </View>

      {/* ═══ 3. Session Progress Bar ═════════════════════ */}
      <View style={styles.progressCard}>
        <View style={styles.progressHeader}>
          <AppText variant="bodyBold">Session Progress</AppText>
          <AppText variant="bodyBold" color={Colors.accent}>{progressPct}%</AppText>
        </View>
        <View style={styles.progressBarBg}>
          <View style={[styles.progressBarFill, {width: `${progressPct}%`}]} />
        </View>
        <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(4)}}>
          {stats.totalSets - stats.setsDone > 0
            ? `${stats.totalSets - stats.setsDone} sets remaining`
            : 'All sets completed!'}
        </AppText>
      </View>

      {/* ═══ 4. Exercise Log Cards ═══════════════════════ */}
      {exercises.map((pe, idx) => renderExerciseCard(pe, idx))}

      {/* ═══ 5. Rest Timer Card ══════════════════════════ */}
      <View style={styles.restCard}>
        <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>Rest Timer</AppText>

        {/* Preset buttons */}
        <View style={styles.presetRow}>
          {REST_PRESETS.map((sec) => (
            <TouchableOpacity
              key={`rest-${sec}`}
              style={[styles.presetBtn, timerTarget === sec && styles.presetBtnActive]}
              onPress={() => {
                setTimerTarget(sec);
                if (!timerRunning) setTimerValue(sec);
              }}
              activeOpacity={0.7}>
              <AppText
                variant="small"
                color={timerTarget === sec ? Colors.white : Colors.textSecondary}>
                {presetLabel(sec)}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Timer display */}
        <View style={styles.timerDisplay}>
          <AppText
            variant="header"
            color={timerValue === 0 && timerRunning === false && timerTarget !== timerValue ? Colors.accent : Colors.textPrimary}
            style={styles.timerText}>
            {fmtTime(timerValue)}
          </AppText>
        </View>

        {/* Timer controls */}
        <View style={styles.timerControls}>
          <TouchableOpacity
            style={[styles.timerBtn, timerRunning && styles.timerBtnRunning]}
            onPress={timerRunning ? resetTimer : startTimer}
            activeOpacity={0.7}>
            <AppText variant="bodyBold" color={Colors.white}>
              {timerRunning ? 'Reset' : 'Start'}
            </AppText>
          </TouchableOpacity>
          {timerRunning && (
            <TouchableOpacity style={styles.timerBtnSkip} onPress={skipTimer} activeOpacity={0.7}>
              <AppText variant="bodyBold" color={Colors.textSecondary}>Skip</AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ═══ 6. Add Exercise Button ═════════════════════ */}
      <TouchableOpacity style={styles.addExerciseBtn} onPress={addExercise} activeOpacity={0.7}>
        <AppText variant="bodyBold" color={Colors.accent}>+ Add Exercise</AppText>
      </TouchableOpacity>

      {/* ═══ 7. Session Notes ════════════════════════════ */}
      <View style={styles.notesCard}>
        <AppText variant="bodyBold" style={{marginBottom: vs(6)}}>Session Notes</AppText>
        <TextInput
          style={styles.notesInput}
          value={sessionNotes}
          onChangeText={setSessionNotes}
          placeholder="How did the session feel? Any technique cues, energy levels, adjustments..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* ═══ 8. Previous Session Insight Card ════════════ */}
      <View style={styles.insightCard}>
        <AppText variant="bodyBold" color={Colors.tealDark} style={{marginBottom: vs(4)}}>
          Previous Session Insight
        </AppText>
        <AppText variant="caption" color={Colors.tealText}>
          {Object.keys(prevSessionMap).length > 0
            ? 'Compare your performance with your last session to track progress over time.'
            : 'No previous session data available yet. Complete this session to start tracking your progress.'}
        </AppText>
      </View>

      {/* ═══ 9. Wellness & Discomfort Card ═══════════════ */}
      <View style={styles.wellnessCard}>
        <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
          Wellness & Discomfort
        </AppText>

        {/* Smart alert banner */}
        {showAlert && (
          <View style={styles.alertBanner}>
            <AppText variant="bodyBold" color={Colors.redDark}>
              ⚠ Attention Required
            </AppText>
            <AppText variant="caption" color={Colors.redText} style={{marginTop: vs(2)}}>
              {hasSevereDiscomfort
                ? 'You reported severe discomfort. Consider reducing intensity or stopping the exercise targeting that area.'
                : 'You reported negative feelings. Listen to your body and adjust your session if needed.'}
            </AppText>
          </View>
        )}

        {/* Body part discomfort — Upper body */}
        <AppText variant="caption" color={Colors.textSecondary} style={styles.sectionLabel}>
          UPPER BODY DISCOMFORT
        </AppText>
        <View style={styles.tagGrid}>
          {(BODY_PARTS_UPPER || []).map((part) => {
            const severity = discomfort[part.id] || 'none';
            const sc = SEVERITY_COLORS[severity];
            return (
              <TouchableOpacity
                key={`upper-${part.id}`}
                style={[
                  styles.tagChip,
                  {backgroundColor: sc.bg, borderColor: sc.border},
                  severity !== 'none' && styles.tagChipActive,
                ]}
                onPress={() => cycleDiscomfort(part.id)}
                activeOpacity={0.7}>
                <AppText variant="small" color={sc.text}>
                  {part.label || part.id}
                </AppText>
                {severity !== 'none' && (
                  <AppText variant="small" color={sc.text} style={{marginLeft: s(3), fontSize: ms(9)}}>
                    {severity === 'mild' ? '●' : severity === 'moderate' ? '●●' : '●●●'}
                  </AppText>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Body part discomfort — Lower body */}
        <AppText variant="caption" color={Colors.textSecondary} style={styles.sectionLabel}>
          LOWER BODY DISCOMFORT
        </AppText>
        <View style={styles.tagGrid}>
          {(BODY_PARTS_LOWER || []).map((part) => {
            const severity = discomfort[part.id] || 'none';
            const sc = SEVERITY_COLORS[severity];
            return (
              <TouchableOpacity
                key={`lower-${part.id}`}
                style={[
                  styles.tagChip,
                  {backgroundColor: sc.bg, borderColor: sc.border},
                  severity !== 'none' && styles.tagChipActive,
                ]}
                onPress={() => cycleDiscomfort(part.id)}
                activeOpacity={0.7}>
                <AppText variant="small" color={sc.text}>
                  {part.label || part.id}
                </AppText>
                {severity !== 'none' && (
                  <AppText variant="small" color={sc.text} style={{marginLeft: s(3), fontSize: ms(9)}}>
                    {severity === 'mild' ? '●' : severity === 'moderate' ? '●●' : '●●●'}
                  </AppText>
                )}
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Feelings chips */}
        <AppText variant="caption" color={Colors.textSecondary} style={styles.sectionLabel}>
          HOW DO YOU FEEL?
        </AppText>
        <View style={styles.tagGrid}>
          {(FEELINGS || []).map((f) => {
            const active = !!feelings[f.id];
            const sentimentMap = {neg: 'negative', neu: 'neutral', pos: 'positive'};
            const fc = FEELING_COLORS[sentimentMap[f.type]] || FEELING_COLORS.neutral;
            return (
              <TouchableOpacity
                key={`feel-${f.id}`}
                style={[
                  styles.tagChip,
                  active
                    ? {backgroundColor: fc.bg, borderColor: fc.border}
                    : {backgroundColor: Colors.white, borderColor: Colors.borderLight},
                ]}
                onPress={() => toggleFeeling(f.id)}
                activeOpacity={0.7}>
                <AppText variant="small" color={active ? fc.text : Colors.textSecondary}>
                  {f.ico ? `${f.ico} ` : ''}{f.label || f.id}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Overall effort slider */}
        <AppText variant="caption" color={Colors.textSecondary} style={styles.sectionLabel}>
          OVERALL EFFORT (1-10)
        </AppText>
        <View style={styles.effortRow}>
          {Array.from({length: 10}).map((_, i) => {
            const val = i + 1;
            const active = effortValue === val;
            const efColor = rpeColor(val);
            return (
              <TouchableOpacity
                key={`effort-${val}`}
                style={[
                  styles.effortBtn,
                  {backgroundColor: active ? efColor.bg : Colors.white},
                  active && {borderColor: efColor.text, borderWidth: 1.5},
                ]}
                onPress={() => setEffortValue(val)}
                activeOpacity={0.7}>
                <AppText
                  variant="small"
                  color={active ? efColor.text : Colors.textTertiary}
                  style={active ? {fontWeight: '700'} : null}>
                  {val}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* RPE buttons */}
        <AppText variant="caption" color={Colors.textSecondary} style={styles.sectionLabel}>
          SESSION RPE
        </AppText>
        <View style={styles.rpeRow}>
          {Array.from({length: 10}).map((_, i) => {
            const val = i + 1;
            const active = sessionRpe === val;
            const rc = rpeColor(val);
            return (
              <TouchableOpacity
                key={`rpe-${val}`}
                style={[
                  styles.rpeBtn,
                  {backgroundColor: active ? rc.bg : Colors.white},
                  active && {borderColor: rc.text, borderWidth: 1.5},
                ]}
                onPress={() => setSessionRpe(val)}
                activeOpacity={0.7}>
                <AppText
                  variant="small"
                  color={active ? rc.text : Colors.textTertiary}
                  style={active ? {fontWeight: '700'} : null}>
                  {val}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Wellness notes */}
        <AppText variant="caption" color={Colors.textSecondary} style={styles.sectionLabel}>
          WELLNESS NOTES
        </AppText>
        <TextInput
          style={styles.wellnessNotesInput}
          value={wellnessNotes}
          onChangeText={setWellnessNotes}
          placeholder="Any injuries, fatigue, sleep quality, stress level..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Bottom spacer */}
      <View style={{height: vs(100)}} />
    </ScrollView>
  );
};

/* ─── Styles ────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: s(16),
    paddingTop: vs(12),
  },

  /* ── 1. Session Header Card ─────────────────────── */
  sessionCard: {
    borderRadius: ms(16),
    overflow: 'hidden',
    marginBottom: vs(14),
  },
  sessionCardInner: {
    backgroundColor: Colors.primary,
    padding: s(16),
    paddingTop: vs(18),
    paddingBottom: vs(16),
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: 'rgba(108,99,255,0.25)',
  },
  dayLabel: {
    letterSpacing: 1.2,
    marginBottom: vs(2),
  },
  sessionName: {
    marginTop: vs(2),
    marginBottom: vs(4),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    marginTop: vs(6),
    marginBottom: vs(12),
  },
  metaDot: {
    width: s(3),
    height: s(3),
    borderRadius: s(1.5),
    backgroundColor: Colors.heroTextSubtle,
    marginHorizontal: s(6),
  },
  gymRow: {
    flexDirection: 'row',
    marginBottom: vs(10),
  },
  gymInput: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    color: Colors.white,
    fontSize: ms(12),
    borderWidth: 1,
    borderColor: Colors.heroBorder,
  },
  unitToggle: {
    flexDirection: 'row',
    alignSelf: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: ms(8),
    padding: s(2),
    marginBottom: vs(12),
  },
  unitOption: {
    paddingHorizontal: s(14),
    paddingVertical: vs(4),
    borderRadius: ms(6),
  },
  unitOptionActive: {
    backgroundColor: Colors.accent,
  },
  statsBand: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.statBg,
    borderRadius: ms(10),
    padding: s(10),
  },
  statItem: {
    alignItems: 'center',
    flex: 1,
  },

  /* ── 2. Water Intake Card ──────────────────────── */
  waterCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(14),
    borderWidth: 1,
    borderColor: '#B2EBF2',
  },
  waterHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  waterUnitToggle: {
    backgroundColor: Colors.tealBg,
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(6),
  },
  waterControls: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(10),
  },
  waterBtn: {
    width: s(40),
    height: s(40),
    borderRadius: s(20),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterDisplay: {
    alignItems: 'center',
    marginHorizontal: s(20),
    minWidth: s(80),
  },
  waterCount: {
    fontSize: ms(28),
    lineHeight: ms(34),
  },
  waterDots: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: vs(6),
  },
  waterDot: {
    width: s(10),
    height: s(10),
    borderRadius: s(5),
    backgroundColor: Colors.borderLight,
    marginHorizontal: s(3),
  },
  waterDotFilled: {
    backgroundColor: Colors.teal,
  },
  waterGoalText: {
    textAlign: 'center',
  },

  /* ── 3. Session Progress Bar ───────────────────── */
  progressCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(14),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  progressHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  progressBarBg: {
    height: vs(8),
    backgroundColor: Colors.borderLight,
    borderRadius: ms(4),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: ms(4),
  },

  /* ── 4. Exercise Log Cards ─────────────────────── */
  exerciseCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(14),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  exHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  exOrderBadge: {
    width: s(28),
    height: s(28),
    borderRadius: s(14),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  exName: {
    fontSize: ms(14),
  },
  equipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: vs(8),
    gap: s(6),
  },
  equipChip: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(6),
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  equipChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  machineNameRow: {
    marginBottom: vs(8),
  },
  machineNameInput: {
    backgroundColor: Colors.background,
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    fontSize: ms(12),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    color: Colors.textPrimary,
  },
  prevBanner: {
    backgroundColor: '#f0f7f4',
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    marginBottom: vs(10),
  },
  prevBannerEmpty: {
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    marginBottom: vs(10),
  },
  prevHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  prevChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(4),
    marginBottom: vs(6),
  },
  prevChip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
    backgroundColor: Colors.tealBg,
    borderWidth: 0.5,
    borderColor: Colors.paleGreen,
    borderRadius: ms(8),
    paddingHorizontal: s(7),
    paddingVertical: vs(3),
  },
  prevChipLabel: {
    fontSize: ms(8),
    fontWeight: '700',
    color: Colors.tealText,
    lineHeight: ms(12),
  },
  prevChipValue: {
    fontSize: ms(10),
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: ms(14),
  },
  prevChipRpe: {
    fontSize: ms(9),
    fontWeight: '600',
    lineHeight: ms(12),
  },
  prevStats: {
    flexDirection: 'row',
    gap: s(12),
    alignItems: 'center',
  },
  tableHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: vs(4),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    marginBottom: vs(4),
  },
  setRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(5),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  setRowDone: {
    backgroundColor: '#f0fdf4',
  },
  setNumCol: {
    width: s(26),
    alignItems: 'center',
  },
  setNum: {
    fontSize: ms(12),
  },
  setInputCol: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: s(2),
  },
  setInputColSm: {
    width: s(36),
    alignItems: 'center',
  },
  setInput: {
    backgroundColor: Colors.background,
    borderRadius: ms(6),
    paddingHorizontal: s(6),
    paddingVertical: vs(3),
    fontSize: ms(12),
    textAlign: 'center',
    color: Colors.textPrimary,
    minWidth: s(40),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  setInputDone: {
    backgroundColor: '#dcfce7',
    borderColor: '#86efac',
  },
  prevCol: {
    width: s(44),
    alignItems: 'center',
  },
  volCol: {
    width: s(36),
    alignItems: 'center',
  },
  doneBtn: {
    width: s(28),
    height: s(28),
    borderRadius: s(14),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  doneBtnActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  doneBtnDrop: {
    backgroundColor: Colors.amber,
    borderColor: Colors.amber,
  },
  addDropBtn: {
    width: s(22),
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Drop set row */
  dropRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(4),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.amberBg,
    backgroundColor: '#FFFBF0',
  },
  dropInput: {
    backgroundColor: Colors.amberBg,
    borderColor: '#FFD54F',
  },
  removeDropBtn: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(6),
    backgroundColor: Colors.redBg,
    borderWidth: 0.5,
    borderColor: 'rgba(239,68,68,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: s(4),
  },
  removeDropText: {
    fontSize: ms(14),
    fontWeight: '700',
    color: Colors.redText,
    lineHeight: ms(18),
  },

  addSetBtn: {
    alignItems: 'center',
    paddingVertical: vs(8),
    marginTop: vs(4),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
  },
  exFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(8),
    paddingTop: vs(8),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  exFooterStat: {
    flex: 1,
    alignItems: 'center',
  },
  prBadge: {
    backgroundColor: Colors.amberBg,
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(6),
    borderWidth: 1,
    borderColor: Colors.amber,
  },

  /* ── 5. Rest Timer Card ────────────────────────── */
  restCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(14),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  presetRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginBottom: vs(12),
  },
  presetBtn: {
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(8),
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  presetBtnActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  timerDisplay: {
    alignItems: 'center',
    marginBottom: vs(12),
  },
  timerText: {
    fontSize: ms(42),
    lineHeight: ms(48),
    fontVariant: ['tabular-nums'],
  },
  timerControls: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(12),
  },
  timerBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: s(28),
    paddingVertical: vs(10),
    borderRadius: ms(10),
    alignItems: 'center',
  },
  timerBtnRunning: {
    backgroundColor: Colors.red,
  },
  timerBtnSkip: {
    backgroundColor: Colors.background,
    paddingHorizontal: s(28),
    paddingVertical: vs(10),
    borderRadius: ms(10),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },

  /* ── 6. Add Exercise Button ────────────────────── */
  addExerciseBtn: {
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderStyle: 'dashed',
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
    marginBottom: vs(14),
    backgroundColor: Colors.white,
  },

  /* ── 7. Session Notes ──────────────────────────── */
  notesCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(14),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  notesInput: {
    backgroundColor: Colors.background,
    borderRadius: ms(8),
    padding: s(10),
    fontSize: ms(13),
    color: Colors.textPrimary,
    minHeight: vs(80),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },

  /* ── 8. Previous Session Insight Card ──────────── */
  insightCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(14),
    borderWidth: 1,
    borderColor: Colors.teal,
  },
  insightStats: {
    flexDirection: 'row',
    marginTop: vs(10),
  },
  insightStat: {
    flex: 1,
    alignItems: 'center',
  },

  /* ── 9. Wellness & Discomfort Card ─────────────── */
  wellnessCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(14),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  alertBanner: {
    backgroundColor: Colors.redBg,
    borderRadius: ms(10),
    padding: s(12),
    marginBottom: vs(12),
    borderWidth: 1,
    borderColor: Colors.red,
  },
  sectionLabel: {
    marginTop: vs(12),
    marginBottom: vs(6),
    letterSpacing: 0.8,
  },
  tagGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
  },
  tagChip: {
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  tagChipActive: {
    borderWidth: 1.5,
  },
  effortRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: s(4),
  },
  effortBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(8),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  rpeRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: s(4),
  },
  rpeBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(8),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  wellnessNotesInput: {
    backgroundColor: Colors.background,
    borderRadius: ms(8),
    padding: s(10),
    fontSize: ms(13),
    color: Colors.textPrimary,
    minHeight: vs(70),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
});

export default DailyLogTab;
