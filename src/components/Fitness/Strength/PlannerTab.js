import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Switch,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {EXERCISES, BODY_PARTS} from '../../../constants/fitnessData';

/* ─── Local constants ─────────────────────────────────── */

const FUNC_GROUPS = [
  {id: 'push', name: 'Push', ico: '🫸'},
  {id: 'pull', name: 'Pull', ico: '🫳'},
  {id: 'legs', name: 'Legs', ico: '🦵'},
  {id: 'core', name: 'Core', ico: '🎯'},
  {id: 'full', name: 'Full body', ico: '🏋️'},
  {id: 'cardio', name: 'Cardio', ico: '❤️‍🔥'},
];

const FG_EMOJI = {push: '🫸', pull: '🫳', legs: '🦵', core: '🎯', full: '🏋️', cardio: '❤️‍🔥', rest: '😴'};

const MUSCLES_BY_FG = {
  push: ['chest', 'shoulders', 'triceps'],
  pull: ['back', 'biceps', 'forearms', 'traps', 'lats'],
  legs: ['quads', 'hamstrings', 'glutes', 'calves'],
  core: ['abs', 'obliques', 'lowerback'],
  full: ['chest', 'back', 'shoulders', 'quads', 'hamstrings', 'glutes', 'abs'],
  cardio: [],
};

const GOALS = [
  {id: 'strength', name: 'Strength', ico: '🏋️', color: '#3b82f6', bg: '#EEF3FE'},
  {id: 'hypertrophy', name: 'Hypertrophy', ico: '💪', color: Colors.purple, bg: Colors.purpleBg},
  {id: 'endurance', name: 'Endurance', ico: '🔄', color: Colors.teal, bg: Colors.tealBg},
  {id: 'power', name: 'Power', ico: '⚡', color: Colors.red, bg: Colors.redBg},
  {id: 'functional', name: 'Functional', ico: '⚙️', color: '#f59e0b', bg: '#FFF7EE'},
  {id: 'recovery', name: 'Recovery', ico: '🩹', color: Colors.amber, bg: Colors.amberBg},
];

const DAY_NAMES = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const DURATION_OPTIONS = [4, 6, 8, 12];

const PLAN_TEMPLATES = [
  {
    id: 'ppl',
    name: 'Push / Pull / Legs',
    ico: '🔄',
    desc: 'Classic 6-day split hitting each muscle group twice per week.',
    tags: ['Intermediate', '6 days', 'Hypertrophy'],
    days: [
      {label: 'Push A', fg: 'push', goal: 'hypertrophy', rest: false, muscles: ['chest', 'shoulders', 'triceps'], exercises: [{name: 'Bench Press', sets: 4, reps: 8, weight: '', restSec: 90}, {name: 'Overhead Press', sets: 3, reps: 10, weight: '', restSec: 90}, {name: 'Cable Crossover', sets: 3, reps: 12, weight: '', restSec: 60}]},
      {label: 'Pull A', fg: 'pull', goal: 'hypertrophy', rest: false, muscles: ['back', 'biceps', 'forearms'], exercises: [{name: 'Deadlift', sets: 4, reps: 5, weight: '', restSec: 120}, {name: 'Lat Pulldown', sets: 3, reps: 10, weight: '', restSec: 90}, {name: 'Cable Row', sets: 3, reps: 12, weight: '', restSec: 60}]},
      {label: 'Legs A', fg: 'legs', goal: 'hypertrophy', rest: false, muscles: ['quads', 'hamstrings', 'glutes'], exercises: [{name: 'Barbell Squat', sets: 4, reps: 8, weight: '', restSec: 120}, {name: 'Leg Press', sets: 3, reps: 12, weight: '', restSec: 90}, {name: 'Leg Extension', sets: 3, reps: 15, weight: '', restSec: 60}]},
      {label: 'Push B', fg: 'push', goal: 'strength', rest: false, muscles: ['chest', 'shoulders', 'triceps'], exercises: [{name: 'Incline DB Press', sets: 4, reps: 6, weight: '', restSec: 120}, {name: 'Arnold Press', sets: 3, reps: 8, weight: '', restSec: 90}]},
      {label: 'Pull B', fg: 'pull', goal: 'strength', rest: false, muscles: ['back', 'biceps'], exercises: [{name: 'Bent-over Row', sets: 4, reps: 6, weight: '', restSec: 120}, {name: 'Pull-up / Chin-up', sets: 3, reps: 8, weight: '', restSec: 90}]},
      {label: 'Legs B', fg: 'legs', goal: 'strength', rest: false, muscles: ['quads', 'glutes', 'calves'], exercises: [{name: 'Bulgarian Split Squat', sets: 4, reps: 8, weight: '', restSec: 90}, {name: 'Goblet Squat', sets: 3, reps: 10, weight: '', restSec: 90}]},
      {label: 'Rest', fg: 'rest', goal: '', rest: true, muscles: [], exercises: []},
    ],
  },
  {
    id: 'upper_lower',
    name: 'Upper / Lower',
    ico: '↕️',
    desc: '4-day split alternating upper and lower body for balanced growth.',
    tags: ['Beginner-Intermediate', '4 days', 'Balanced'],
    days: [
      {label: 'Upper A', fg: 'push', goal: 'hypertrophy', rest: false, muscles: ['chest', 'shoulders', 'back', 'biceps', 'triceps'], exercises: [{name: 'Bench Press', sets: 4, reps: 8, weight: '', restSec: 90}, {name: 'Bent-over Row', sets: 4, reps: 8, weight: '', restSec: 90}, {name: 'Lateral Raise', sets: 3, reps: 15, weight: '', restSec: 60}]},
      {label: 'Lower A', fg: 'legs', goal: 'hypertrophy', rest: false, muscles: ['quads', 'hamstrings', 'glutes', 'calves'], exercises: [{name: 'Barbell Squat', sets: 4, reps: 8, weight: '', restSec: 120}, {name: 'Leg Press', sets: 3, reps: 12, weight: '', restSec: 90}]},
      {label: 'Rest', fg: 'rest', goal: '', rest: true, muscles: [], exercises: []},
      {label: 'Upper B', fg: 'pull', goal: 'strength', rest: false, muscles: ['chest', 'shoulders', 'back', 'biceps', 'triceps'], exercises: [{name: 'Overhead Press', sets: 4, reps: 6, weight: '', restSec: 120}, {name: 'Lat Pulldown', sets: 3, reps: 10, weight: '', restSec: 90}]},
      {label: 'Lower B', fg: 'legs', goal: 'strength', rest: false, muscles: ['quads', 'hamstrings', 'glutes'], exercises: [{name: 'Deadlift', sets: 4, reps: 5, weight: '', restSec: 120}, {name: 'Bulgarian Split Squat', sets: 3, reps: 10, weight: '', restSec: 90}]},
      {label: 'Rest', fg: 'rest', goal: '', rest: true, muscles: [], exercises: []},
      {label: 'Rest', fg: 'rest', goal: '', rest: true, muscles: [], exercises: []},
    ],
  },
  {
    id: 'full_body',
    name: 'Full Body 3x',
    ico: '🏋️',
    desc: 'Hit every muscle group 3 times per week. Great for beginners.',
    tags: ['Beginner', '3 days', 'Full body'],
    days: [
      {label: 'Full Body A', fg: 'full', goal: 'functional', rest: false, muscles: ['chest', 'back', 'quads', 'abs'], exercises: [{name: 'Bench Press', sets: 3, reps: 10, weight: '', restSec: 90}, {name: 'Bent-over Row', sets: 3, reps: 10, weight: '', restSec: 90}, {name: 'Barbell Squat', sets: 3, reps: 10, weight: '', restSec: 90}, {name: 'Plank', sets: 3, reps: 60, weight: '', restSec: 60}]},
      {label: 'Rest', fg: 'rest', goal: '', rest: true, muscles: [], exercises: []},
      {label: 'Full Body B', fg: 'full', goal: 'functional', rest: false, muscles: ['shoulders', 'back', 'hamstrings', 'abs'], exercises: [{name: 'Overhead Press', sets: 3, reps: 10, weight: '', restSec: 90}, {name: 'Lat Pulldown', sets: 3, reps: 10, weight: '', restSec: 90}, {name: 'Deadlift', sets: 3, reps: 8, weight: '', restSec: 120}]},
      {label: 'Rest', fg: 'rest', goal: '', rest: true, muscles: [], exercises: []},
      {label: 'Full Body C', fg: 'full', goal: 'functional', rest: false, muscles: ['chest', 'back', 'quads', 'glutes'], exercises: [{name: 'Push-ups', sets: 3, reps: 15, weight: '', restSec: 60}, {name: 'Cable Row', sets: 3, reps: 12, weight: '', restSec: 90}, {name: 'Goblet Squat', sets: 3, reps: 12, weight: '', restSec: 90}]},
      {label: 'Rest', fg: 'rest', goal: '', rest: true, muscles: [], exercises: []},
      {label: 'Rest', fg: 'rest', goal: '', rest: true, muscles: [], exercises: []},
    ],
  },
];

/* ─── Helpers ─────────────────────────────────────────── */

const makeDay = (dayIdx) => ({
  label: DAY_NAMES[dayIdx] || `Day ${dayIdx + 1}`,
  fg: '',
  goal: '',
  rest: false,
  muscles: [],
  exercises: [],
});

const makeExercise = (name) => ({
  name,
  sets: 3,
  reps: 10,
  weight: '',
  restSec: 60,
});

const defaultDays = () =>
  DAY_NAMES.map((_, i) => ({...makeDay(i), rest: i >= 5}));

const exercisesForFg = (fg) => {
  const muscles = MUSCLES_BY_FG[fg] || [];
  const list = [];
  const exerciseDB = EXERCISES || {};
  muscles.forEach((m) => {
    if (exerciseDB[m]) {
      exerciseDB[m].forEach((ex) => {
        if (!list.find((e) => e.name === ex.name)) {
          list.push(ex);
        }
      });
    }
  });
  return list;
};

/* ─── Component ───────────────────────────────────────── */

const PlannerTab = ({plan, setPlan}) => {
  const [plannerMode, setPlannerMode] = useState('selector'); // selector | templates | custom
  const [selectedTemplate, setSelectedTemplate] = useState(null);
  const [selectedDayIdx, setSelectedDayIdx] = useState(0);
  const [showExercisePicker, setShowExercisePicker] = useState(false);

  /* programme config local state (synced to plan on change) */
  const [config, setConfig] = useState({
    name: plan?.name || 'My Programme',
    startDate: plan?.startDate || new Date().toISOString().slice(0, 10),
    duration: plan?.duration || 8,
    daysPerWeek: plan?.daysPerWeek || 5,
    unit: plan?.unit || 'kg',
    gym: plan?.gym || '',
    location: plan?.location || '',
  });

  const [days, setDays] = useState(plan?.days?.length ? plan.days : defaultDays());

  /* sync back to parent */
  const syncPlan = useCallback(
    (newConfig, newDays) => {
      const c = newConfig || config;
      const d = newDays || days;
      setPlan({...c, days: d});
    },
    [config, days, setPlan],
  );

  const updateConfig = useCallback(
    (key, val) => {
      const next = {...config, [key]: val};
      setConfig(next);
      syncPlan(next, null);
    },
    [config, syncPlan],
  );

  const updateDay = useCallback(
    (idx, patch) => {
      const next = [...days];
      next[idx] = {...next[idx], ...patch};
      setDays(next);
      syncPlan(null, next);
    },
    [days, syncPlan],
  );

  const addDay = useCallback(() => {
    const next = [...days, makeDay(days.length)];
    setDays(next);
    setSelectedDayIdx(next.length - 1);
    syncPlan(null, next);
  }, [days, syncPlan]);

  const removeDay = useCallback(
    (idx) => {
      const next = days.filter((_, i) => i !== idx);
      setDays(next);
      if (selectedDayIdx >= next.length) setSelectedDayIdx(Math.max(0, next.length - 1));
      syncPlan(null, next);
    },
    [days, selectedDayIdx, syncPlan],
  );

  const addExerciseToDay = useCallback(
    (dayIdx, exName) => {
      const d = days[dayIdx];
      const next = [...(d.exercises || []), makeExercise(exName)];
      updateDay(dayIdx, {exercises: next});
      setShowExercisePicker(false);
    },
    [days, updateDay],
  );

  const removeExerciseFromDay = useCallback(
    (dayIdx, exIdx) => {
      const d = days[dayIdx];
      const next = (d.exercises || []).filter((_, i) => i !== exIdx);
      updateDay(dayIdx, {exercises: next});
    },
    [days, updateDay],
  );

  const updateExercise = useCallback(
    (dayIdx, exIdx, patch) => {
      const d = days[dayIdx];
      const exList = [...(d.exercises || [])];
      exList[exIdx] = {...exList[exIdx], ...patch};
      updateDay(dayIdx, {exercises: exList});
    },
    [days, updateDay],
  );

  const loadTemplate = useCallback(
    (tpl, andEdit) => {
      const newDays = tpl.days.map((d, i) => ({...d}));
      setDays(newDays);
      const newConfig = {...config, name: tpl.name};
      setConfig(newConfig);
      syncPlan(newConfig, newDays);
      if (andEdit) {
        setPlannerMode('custom');
        setSelectedDayIdx(0);
      } else {
        setPlannerMode('selector');
      }
    },
    [config, syncPlan],
  );

  const handleFgChange = useCallback(
    (dayIdx, fg) => {
      const newMuscles = MUSCLES_BY_FG[fg] || [];
      const defaultExercises = exercisesForFg(fg)
        .slice(0, 3)
        .map((ex) => makeExercise(ex.name));
      updateDay(dayIdx, {fg, muscles: newMuscles, exercises: defaultExercises});
    },
    [updateDay],
  );

  /* available exercises for currently selected day */
  const availableExercises = useMemo(() => {
    const day = days[selectedDayIdx];
    if (!day || !day.fg) return [];
    return exercisesForFg(day.fg);
  }, [days, selectedDayIdx]);

  /* ─── Render: Selector mode ──────────────────────────── */
  const renderSelector = () => (
    <View style={st.selectorWrap}>
      <AppText variant="header" style={st.sectionTitle}>
        Training Planner
      </AppText>
      <AppText variant="body" color={Colors.textSecondary} style={st.selectorDesc}>
        Build your weekly training programme from a template or from scratch.
      </AppText>
      <View style={st.selectorCards}>
        <TouchableOpacity
          style={[st.selectorCard, st.selectorCardPurple]}
          activeOpacity={0.7}
          onPress={() => setPlannerMode('templates')}>
          <AppText style={st.selectorIco}>{'📋'}</AppText>
          <AppText variant="bodyBold" style={st.selectorCardTitle}>
            Use a template
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={st.selectorCardSub}>
            Quick start from proven programmes
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={st.selectorCard}
          activeOpacity={0.7}
          onPress={() => setPlannerMode('custom')}>
          <AppText style={st.selectorIco}>{'🔧'}</AppText>
          <AppText variant="bodyBold" style={st.selectorCardTitle}>
            Custom planner
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={st.selectorCardSub}>
            Build your own from scratch
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ─── Render: Templates mode ─────────────────────────── */
  const renderTemplates = () => (
    <View style={st.templatesWrap}>
      <TouchableOpacity onPress={() => setPlannerMode('selector')} style={st.backLink}>
        <AppText variant="body" color={Colors.accent}>
          {'‹ Back'}
        </AppText>
      </TouchableOpacity>

      <AppText variant="header" style={st.sectionTitle}>
        Programme Templates
      </AppText>

      {PLAN_TEMPLATES.map((tpl) => {
        const isSelected = selectedTemplate === tpl.id;
        return (
          <TouchableOpacity
            key={tpl.id}
            style={[st.tplCard, isSelected && st.tplCardSelected]}
            activeOpacity={0.7}
            onPress={() => setSelectedTemplate(isSelected ? null : tpl.id)}>
            <View style={st.tplHeader}>
              <AppText style={st.tplIco}>{tpl.ico}</AppText>
              <View style={st.tplHeaderText}>
                <AppText variant="bodyBold">{tpl.name}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  {tpl.desc}
                </AppText>
              </View>
            </View>

            <View style={st.tplTags}>
              {tpl.tags.map((t) => (
                <View key={t} style={st.tplTag}>
                  <AppText variant="small" color={Colors.tealText}>
                    {t}
                  </AppText>
                </View>
              ))}
            </View>

            {/* day preview strip */}
            <View style={st.dayStrip}>
              {tpl.days.map((d, i) => (
                <View
                  key={i}
                  style={[st.dayStripCell, d.rest && st.dayStripCellRest]}>
                  <AppText style={st.dayStripEmoji}>
                    {FG_EMOJI[d.fg] || '📅'}
                  </AppText>
                  <AppText variant="small" color={Colors.textTertiary}>
                    {DAY_NAMES[i]}
                  </AppText>
                </View>
              ))}
            </View>

            {isSelected && (
              <View style={st.tplActions}>
                <TouchableOpacity
                  style={st.tplActionBtn}
                  onPress={() => loadTemplate(tpl, false)}>
                  <AppText variant="bodyBold" color={Colors.white}>
                    {'Load this plan →'}
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={st.tplActionBtnOutline}
                  onPress={() => loadTemplate(tpl, true)}>
                  <AppText variant="bodyBold" color={Colors.accent}>
                    Load & edit
                  </AppText>
                </TouchableOpacity>
              </View>
            )}
          </TouchableOpacity>
        );
      })}

      <View style={st.infoCard}>
        <AppText variant="caption" color={Colors.textSecondary}>
          Tap a template to preview its weekly layout. You can load it directly or load & customise
          it in the editor.
        </AppText>
      </View>
    </View>
  );

  /* ─── Render: Custom planner ─────────────────────────── */
  const renderCustom = () => {
    const day = days[selectedDayIdx] || {};
    const isExpanded = true; // selected day is always expanded

    return (
      <View style={st.customWrap}>
        <TouchableOpacity onPress={() => setPlannerMode('selector')} style={st.backLink}>
          <AppText variant="body" color={Colors.accent}>
            {'‹ Back'}
          </AppText>
        </TouchableOpacity>

        <AppText variant="header" style={st.sectionTitle}>
          Custom Planner
        </AppText>

        {/* ── Programme config card ─────────────────────── */}
        <View style={st.configCard}>
          <AppText variant="bodyBold" style={st.configTitle}>
            Programme config
          </AppText>

          <AppText variant="caption" color={Colors.textSecondary} style={st.fieldLabel}>
            Programme name
          </AppText>
          <TextInput
            style={st.input}
            value={config.name}
            onChangeText={(v) => updateConfig('name', v)}
            placeholder="e.g. Spring Bulk"
            placeholderTextColor={Colors.textTertiary}
          />

          <View style={st.configRow}>
            <View style={st.configHalf}>
              <AppText variant="caption" color={Colors.textSecondary} style={st.fieldLabel}>
                Start date
              </AppText>
              <TextInput
                style={st.input}
                value={config.startDate}
                onChangeText={(v) => updateConfig('startDate', v)}
                placeholder="YYYY-MM-DD"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>
            <View style={st.configHalf}>
              <AppText variant="caption" color={Colors.textSecondary} style={st.fieldLabel}>
                Duration (weeks)
              </AppText>
              <View style={st.chipRow}>
                {DURATION_OPTIONS.map((w) => (
                  <TouchableOpacity
                    key={w}
                    style={[st.chip, config.duration === w && st.chipActive]}
                    onPress={() => updateConfig('duration', w)}>
                    <AppText
                      variant="small"
                      color={config.duration === w ? Colors.white : Colors.textSecondary}>
                      {w}w
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={st.configRow}>
            <View style={st.configHalf}>
              <AppText variant="caption" color={Colors.textSecondary} style={st.fieldLabel}>
                Days / week
              </AppText>
              <View style={st.chipRow}>
                {[3, 4, 5, 6, 7].map((n) => (
                  <TouchableOpacity
                    key={n}
                    style={[st.chip, config.daysPerWeek === n && st.chipActive]}
                    onPress={() => updateConfig('daysPerWeek', n)}>
                    <AppText
                      variant="small"
                      color={config.daysPerWeek === n ? Colors.white : Colors.textSecondary}>
                      {n}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
            <View style={st.configHalf}>
              <AppText variant="caption" color={Colors.textSecondary} style={st.fieldLabel}>
                Default unit
              </AppText>
              <View style={st.chipRow}>
                {['kg', 'lbs'].map((u) => (
                  <TouchableOpacity
                    key={u}
                    style={[st.chip, config.unit === u && st.chipActive]}
                    onPress={() => updateConfig('unit', u)}>
                    <AppText
                      variant="small"
                      color={config.unit === u ? Colors.white : Colors.textSecondary}>
                      {u}
                    </AppText>
                  </TouchableOpacity>
                ))}
              </View>
            </View>
          </View>

          <View style={st.configRow}>
            <View style={st.configHalf}>
              <AppText variant="caption" color={Colors.textSecondary} style={st.fieldLabel}>
                Gym name
              </AppText>
              <TextInput
                style={st.input}
                value={config.gym}
                onChangeText={(v) => updateConfig('gym', v)}
                placeholder="Optional"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>
            <View style={st.configHalf}>
              <AppText variant="caption" color={Colors.textSecondary} style={st.fieldLabel}>
                Location
              </AppText>
              <TextInput
                style={st.input}
                value={config.location}
                onChangeText={(v) => updateConfig('location', v)}
                placeholder="Optional"
                placeholderTextColor={Colors.textTertiary}
              />
            </View>
          </View>
        </View>

        {/* ── Week strip ────────────────────────────────── */}
        <View style={st.weekStrip}>
          {days.map((d, i) => {
            const isActive = i === selectedDayIdx;
            return (
              <TouchableOpacity
                key={i}
                style={[st.weekDay, isActive && st.weekDayActive]}
                onPress={() => setSelectedDayIdx(i)}>
                <AppText style={st.weekDayEmoji}>
                  {d.rest ? '😴' : FG_EMOJI[d.fg] || '📅'}
                </AppText>
                <AppText
                  variant="small"
                  color={isActive ? Colors.white : Colors.textSecondary}>
                  {DAY_NAMES[i] || `D${i + 1}`}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* ── Day editor cards ──────────────────────────── */}
        {days.map((d, i) => {
          const isActive = i === selectedDayIdx;

          /* collapsed card */
          if (!isActive) {
            const setCount = (d.exercises || []).reduce((sum, ex) => sum + (ex.sets || 0), 0);
            const muscleStr = (d.muscles || []).slice(0, 3).join(', ');
            return (
              <TouchableOpacity
                key={i}
                style={st.dayCardCollapsed}
                onPress={() => setSelectedDayIdx(i)}>
                <AppText style={st.dayCollapseEmoji}>
                  {d.rest ? '😴' : FG_EMOJI[d.fg] || '📅'}
                </AppText>
                <View style={st.dayCollapseInfo}>
                  <AppText variant="bodyBold">
                    {d.label || DAY_NAMES[i] || `Day ${i + 1}`}
                  </AppText>
                  {!d.rest && (
                    <AppText variant="caption" color={Colors.textSecondary}>
                      {setCount} sets{muscleStr ? ` · ${muscleStr}` : ''}
                    </AppText>
                  )}
                  {d.rest && (
                    <AppText variant="caption" color={Colors.textTertiary}>
                      Rest day
                    </AppText>
                  )}
                </View>
              </TouchableOpacity>
            );
          }

          /* expanded card */
          return (
            <View key={i} style={st.dayCardExpanded}>
              {/* header */}
              <View style={st.dayHeader}>
                <View style={{flex: 1}}>
                  <AppText variant="caption" color={Colors.textSecondary}>
                    {DAY_NAMES[i] || `Day ${i + 1}`}
                  </AppText>
                  <TextInput
                    style={st.dayNameInput}
                    value={d.label}
                    onChangeText={(v) => updateDay(i, {label: v})}
                    placeholder="Day name"
                    placeholderTextColor={Colors.textTertiary}
                  />
                </View>
                <View style={st.restToggle}>
                  <AppText variant="caption" color={Colors.textSecondary}>
                    Rest
                  </AppText>
                  <Switch
                    value={d.rest}
                    onValueChange={(v) =>
                      updateDay(i, {rest: v, fg: v ? 'rest' : '', exercises: v ? [] : d.exercises})
                    }
                    trackColor={{false: Colors.borderLight, true: Colors.tealBg}}
                    thumbColor={d.rest ? Colors.accent : '#ccc'}
                  />
                </View>
              </View>

              {!d.rest && (
                <>
                  {/* functional group selector */}
                  <AppText variant="caption" color={Colors.textSecondary} style={st.fieldLabel}>
                    Functional group
                  </AppText>
                  <View style={st.chipRow}>
                    {FUNC_GROUPS.map((fg) => (
                      <TouchableOpacity
                        key={fg.id}
                        style={[st.fgChip, d.fg === fg.id && st.fgChipActive]}
                        onPress={() => handleFgChange(i, fg.id)}>
                        <AppText style={st.fgChipEmoji}>{fg.ico}</AppText>
                        <AppText
                          variant="small"
                          color={d.fg === fg.id ? Colors.white : Colors.textSecondary}>
                          {fg.name}
                        </AppText>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* training goal selector */}
                  <AppText variant="caption" color={Colors.textSecondary} style={st.fieldLabel}>
                    Training goal
                  </AppText>
                  <View style={st.chipRow}>
                    {GOALS.map((g) => (
                      <TouchableOpacity
                        key={g.id}
                        style={[
                          st.goalChip,
                          d.goal === g.id && {backgroundColor: g.bg, borderColor: g.color},
                        ]}
                        onPress={() => updateDay(i, {goal: g.id})}>
                        <AppText style={{fontSize: ms(12)}}>{g.ico}</AppText>
                        <AppText
                          variant="small"
                          color={d.goal === g.id ? g.color : Colors.textSecondary}>
                          {g.name}
                        </AppText>
                      </TouchableOpacity>
                    ))}
                  </View>

                  {/* body parts selector */}
                  {d.fg && d.fg !== 'cardio' && (
                    <>
                      <AppText
                        variant="caption"
                        color={Colors.textSecondary}
                        style={st.fieldLabel}>
                        Body parts
                      </AppText>
                      <View style={st.chipRow}>
                        {(MUSCLES_BY_FG[d.fg] || []).map((mId) => {
                          const bp = (BODY_PARTS || []).find((b) => b.id === mId);
                          if (!bp) return null;
                          const active = (d.muscles || []).includes(mId);
                          return (
                            <TouchableOpacity
                              key={mId}
                              style={[st.muscleChip, active && st.muscleChipActive]}
                              onPress={() => {
                                const next = active
                                  ? (d.muscles || []).filter((m) => m !== mId)
                                  : [...(d.muscles || []), mId];
                                updateDay(i, {muscles: next});
                              }}>
                              <AppText style={{fontSize: ms(11)}}>{bp.ico}</AppText>
                              <AppText
                                variant="small"
                                color={active ? Colors.white : Colors.textSecondary}>
                                {bp.name}
                              </AppText>
                            </TouchableOpacity>
                          );
                        })}
                      </View>
                    </>
                  )}

                  {/* exercise list */}
                  <AppText
                    variant="caption"
                    color={Colors.textSecondary}
                    style={[st.fieldLabel, {marginTop: vs(10)}]}>
                    Exercises
                  </AppText>
                  {(d.exercises || []).map((ex, ei) => (
                    <View key={ei} style={st.exerciseRow}>
                      <View style={st.exerciseNameRow}>
                        <AppText variant="body" style={{flex: 1}}>
                          {ex.name}
                        </AppText>
                        <TouchableOpacity onPress={() => removeExerciseFromDay(i, ei)}>
                          <AppText variant="caption" color={Colors.red}>
                            Remove
                          </AppText>
                        </TouchableOpacity>
                      </View>
                      <View style={st.exerciseParams}>
                        <View style={st.paramCell}>
                          <AppText variant="small" color={Colors.textTertiary}>
                            Sets
                          </AppText>
                          <TextInput
                            style={st.paramInput}
                            value={String(ex.sets)}
                            onChangeText={(v) =>
                              updateExercise(i, ei, {sets: parseInt(v, 10) || 0})
                            }
                            keyboardType="number-pad"
                          />
                        </View>
                        <AppText color={Colors.textTertiary} style={st.paramX}>
                          ×
                        </AppText>
                        <View style={st.paramCell}>
                          <AppText variant="small" color={Colors.textTertiary}>
                            Reps
                          </AppText>
                          <TextInput
                            style={st.paramInput}
                            value={String(ex.reps)}
                            onChangeText={(v) =>
                              updateExercise(i, ei, {reps: parseInt(v, 10) || 0})
                            }
                            keyboardType="number-pad"
                          />
                        </View>
                        <AppText color={Colors.textTertiary} style={st.paramX}>
                          @
                        </AppText>
                        <View style={st.paramCell}>
                          <AppText variant="small" color={Colors.textTertiary}>
                            {config.unit}
                          </AppText>
                          <TextInput
                            style={st.paramInput}
                            value={String(ex.weight)}
                            onChangeText={(v) => updateExercise(i, ei, {weight: v})}
                            keyboardType="number-pad"
                            placeholder="—"
                            placeholderTextColor={Colors.textTertiary}
                          />
                        </View>
                        <View style={st.paramCell}>
                          <AppText variant="small" color={Colors.textTertiary}>
                            Rest
                          </AppText>
                          <TextInput
                            style={st.paramInput}
                            value={String(ex.restSec)}
                            onChangeText={(v) =>
                              updateExercise(i, ei, {restSec: parseInt(v, 10) || 0})
                            }
                            keyboardType="number-pad"
                          />
                        </View>
                      </View>
                    </View>
                  ))}

                  {/* exercise picker */}
                  {showExercisePicker && d.fg ? (
                    <View style={st.pickerWrap}>
                      <AppText variant="caption" color={Colors.textSecondary} style={st.fieldLabel}>
                        Add exercise ({availableExercises.length} available)
                      </AppText>
                      <ScrollView
                        horizontal
                        showsHorizontalScrollIndicator={false}
                        style={st.pickerScroll}>
                        {availableExercises.map((ex) => (
                          <TouchableOpacity
                            key={ex.name}
                            style={st.pickerItem}
                            onPress={() => addExerciseToDay(i, ex.name)}>
                            <AppText variant="small">{ex.name}</AppText>
                            <AppText variant="small" color={Colors.textTertiary}>
                              {ex.type} · {ex.equip}
                            </AppText>
                          </TouchableOpacity>
                        ))}
                      </ScrollView>
                      <TouchableOpacity
                        style={st.pickerClose}
                        onPress={() => setShowExercisePicker(false)}>
                        <AppText variant="caption" color={Colors.red}>
                          Close picker
                        </AppText>
                      </TouchableOpacity>
                    </View>
                  ) : (
                    <TouchableOpacity
                      style={st.addExerciseBtn}
                      onPress={() => setShowExercisePicker(true)}>
                      <AppText variant="body" color={Colors.accent}>
                        + Add exercise
                      </AppText>
                    </TouchableOpacity>
                  )}

                  {/* done / remove buttons */}
                  <View style={st.dayActions}>
                    <TouchableOpacity
                      style={st.doneDayBtn}
                      onPress={() => setSelectedDayIdx(-1)}>
                      <AppText variant="bodyBold" color={Colors.white}>
                        Done
                      </AppText>
                    </TouchableOpacity>
                    {days.length > 1 && (
                      <TouchableOpacity
                        style={st.removeDayBtn}
                        onPress={() => removeDay(i)}>
                        <AppText variant="caption" color={Colors.red}>
                          Remove day
                        </AppText>
                      </TouchableOpacity>
                    )}
                  </View>
                </>
              )}
            </View>
          );
        })}

        {/* add training day */}
        {days.length < 7 && (
          <TouchableOpacity style={st.addDayBtn} onPress={addDay}>
            <AppText variant="body" color={Colors.accent}>
              ＋ Add training day
            </AppText>
          </TouchableOpacity>
        )}

        {/* insight card */}
        <View style={st.insightCard}>
          <AppText variant="caption" color={Colors.textSecondary}>
            {'💡 '}
            Your planner defines the skeleton of each training week. Once you start a session, sets
            and weights are tracked in real time and feed into your progress analytics.
          </AppText>
        </View>
      </View>
    );
  };

  /* ─── Main render ───────────────────────────────────── */
  return (
    <ScrollView
      style={st.root}
      contentContainerStyle={st.rootContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {plannerMode === 'selector' && renderSelector()}
      {plannerMode === 'templates' && renderTemplates()}
      {plannerMode === 'custom' && renderCustom()}
    </ScrollView>
  );
};

/* ─── Styles ──────────────────────────────────────────── */

const st = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  rootContent: {
    paddingHorizontal: s(16),
    paddingBottom: vs(40),
  },

  /* back link */
  backLink: {
    paddingVertical: vs(10),
  },

  sectionTitle: {
    marginBottom: vs(6),
  },

  /* ── Selector ──────── */
  selectorWrap: {
    paddingTop: vs(12),
  },
  selectorDesc: {
    marginBottom: vs(16),
  },
  selectorCards: {
    flexDirection: 'row',
    gap: s(12),
  },
  selectorCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: ms(16),
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  selectorCardPurple: {
    borderColor: Colors.purple,
    backgroundColor: Colors.purpleBg,
  },
  selectorIco: {
    fontSize: ms(32),
    marginBottom: vs(8),
  },
  selectorCardTitle: {
    textAlign: 'center',
    marginBottom: vs(4),
  },
  selectorCardSub: {
    textAlign: 'center',
  },

  /* ── Templates ─────── */
  templatesWrap: {
    paddingTop: vs(4),
  },
  tplCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: vs(12),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  tplCardSelected: {
    borderColor: Colors.accent,
    borderWidth: 1.5,
  },
  tplHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(8),
  },
  tplIco: {
    fontSize: ms(28),
    marginRight: s(10),
  },
  tplHeaderText: {
    flex: 1,
  },
  tplTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginBottom: vs(10),
  },
  tplTag: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(8),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
  },
  dayStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(6),
  },
  dayStripCell: {
    alignItems: 'center',
    width: s(36),
  },
  dayStripCellRest: {
    opacity: 0.4,
  },
  dayStripEmoji: {
    fontSize: ms(16),
    marginBottom: vs(2),
  },
  tplActions: {
    flexDirection: 'row',
    gap: s(10),
    marginTop: vs(10),
  },
  tplActionBtn: {
    flex: 1,
    backgroundColor: Colors.accent,
    borderRadius: ms(10),
    paddingVertical: vs(10),
    alignItems: 'center',
  },
  tplActionBtnOutline: {
    flex: 1,
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderRadius: ms(10),
    paddingVertical: vs(10),
    alignItems: 'center',
  },
  infoCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(12),
    padding: ms(14),
    marginTop: vs(4),
  },

  /* ── Custom planner ── */
  customWrap: {
    paddingTop: vs(4),
  },

  /* config card */
  configCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: vs(14),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  configTitle: {
    marginBottom: vs(10),
  },
  configRow: {
    flexDirection: 'row',
    gap: s(10),
    marginTop: vs(4),
  },
  configHalf: {
    flex: 1,
  },
  fieldLabel: {
    marginBottom: vs(4),
    marginTop: vs(8),
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    fontSize: ms(13),
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
  },
  chip: {
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    borderRadius: ms(8),
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },

  /* week strip */
  weekStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  weekDay: {
    alignItems: 'center',
    paddingVertical: vs(6),
    paddingHorizontal: s(6),
    borderRadius: ms(10),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minWidth: s(40),
  },
  weekDayActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  weekDayEmoji: {
    fontSize: ms(16),
    marginBottom: vs(2),
  },

  /* day card collapsed */
  dayCardCollapsed: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: ms(12),
    marginBottom: vs(8),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  dayCollapseEmoji: {
    fontSize: ms(22),
    marginRight: s(10),
  },
  dayCollapseInfo: {
    flex: 1,
  },

  /* day card expanded */
  dayCardExpanded: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: vs(8),
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  dayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  dayNameInput: {
    fontSize: ms(15),
    fontWeight: '600',
    color: Colors.textPrimary,
    padding: 0,
    marginTop: vs(2),
  },
  restToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },

  /* fg chips */
  fgChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: ms(10),
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: s(4),
  },
  fgChipActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  fgChipEmoji: {
    fontSize: ms(14),
  },

  /* goal chips */
  goalChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: ms(10),
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: s(4),
  },

  /* muscle chips */
  muscleChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(8),
    paddingVertical: vs(5),
    borderRadius: ms(8),
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    gap: s(3),
  },
  muscleChipActive: {
    backgroundColor: Colors.teal,
    borderColor: Colors.teal,
  },

  /* exercise row */
  exerciseRow: {
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    padding: ms(10),
    marginBottom: vs(6),
  },
  exerciseNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  exerciseParams: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  paramCell: {
    flex: 1,
    alignItems: 'center',
  },
  paramInput: {
    backgroundColor: Colors.white,
    borderRadius: ms(8),
    paddingHorizontal: s(6),
    paddingVertical: vs(4),
    fontSize: ms(13),
    color: Colors.textPrimary,
    textAlign: 'center',
    width: '100%',
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginTop: vs(2),
  },
  paramX: {
    fontSize: ms(13),
    marginTop: vs(12),
  },

  /* exercise picker */
  pickerWrap: {
    marginTop: vs(6),
  },
  pickerScroll: {
    maxHeight: vs(80),
  },
  pickerItem: {
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    padding: ms(10),
    marginRight: s(8),
    minWidth: s(120),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  pickerClose: {
    alignSelf: 'flex-end',
    marginTop: vs(6),
  },

  addExerciseBtn: {
    paddingVertical: vs(10),
    alignItems: 'center',
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: Colors.accent,
    borderStyle: 'dashed',
    marginTop: vs(6),
  },

  /* day actions */
  dayActions: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(12),
  },
  doneDayBtn: {
    backgroundColor: Colors.accent,
    borderRadius: ms(10),
    paddingVertical: vs(10),
    paddingHorizontal: s(24),
    alignItems: 'center',
  },
  removeDayBtn: {
    paddingVertical: vs(10),
    paddingHorizontal: s(12),
  },

  /* add day */
  addDayBtn: {
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderStyle: 'dashed',
    borderRadius: ms(12),
    paddingVertical: vs(14),
    alignItems: 'center',
    marginTop: vs(4),
    marginBottom: vs(8),
  },

  /* insight */
  insightCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(12),
    padding: ms(14),
    marginTop: vs(8),
  },
});

export default PlannerTab;
