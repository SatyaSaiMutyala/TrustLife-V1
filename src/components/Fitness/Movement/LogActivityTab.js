import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {
  ACTIVITIES,
  ACTIVITY_FORMS,
  HR_ZONES,
  INTENSITY_CONFIG,
  USER_CONFIG,
  UPPER_BODY,
  MOVEMENT_PATTERNS,
  BODY_POSITIONS,
  FEEL_OPTIONS,
  MOTIVATION_SOURCES,
  COMPLETION_STATUS,
  SOCIAL_CONTEXT,
  MEAL_FLAGS,
  HEALTH_BENEFITS,
} from '../../../constants/movementData';

/* ─── Helpers ──────────────────────────────────────────────── */

const pad = (n) => String(n).padStart(2, '0');

const formatElapsed = (ms_) => {
  const totalSec = Math.floor(ms_ / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const sec = totalSec % 60;
  if (h > 0) return `${h}h ${pad(m)}m ${pad(sec)}s`;
  return `${pad(m)}m ${pad(sec)}s`;
};

const calcCalories = (met, weightKg, durationMin) =>
  Math.round(met * weightKg * (durationMin / 60));

const getHRZone = (hr, maxHR) => {
  const pct = (hr / maxHR) * 100;
  for (let i = (HR_ZONES || []).length - 1; i >= 0; i--) {
    const zonePct = Array.isArray(HR_ZONES[i].pct) ? HR_ZONES[i].pct[0] : (HR_ZONES[i].pct || 0);
    if (pct >= zonePct) return HR_ZONES[i];
  }
  return (HR_ZONES || [])[0] || {name: 'Unknown', col: '#64748b', pct: 0};
};

const calcHRR = (peakHR, recoveryHR) => peakHR - recoveryHR;

const calcPctMaxHR = (hr, maxHR) =>
  maxHR > 0 ? Math.round((hr / maxHR) * 100) : 0;

const calcFitnessScore = (hrr, restingHR) => {
  if (hrr >= 40) return {score: 'Excellent', color: '#16a34a'};
  if (hrr >= 30) return {score: 'Good', color: '#2563eb'};
  if (hrr >= 20) return {score: 'Average', color: '#d97706'};
  return {score: 'Below avg', color: '#dc2626'};
};

const calcVO2Estimate = (met) => Math.round(met * 3.5 * 10) / 10;

/* ─── Section Header ───────────────────────────────────────── */

const SectionHeader = ({icon, title, subtitle}) => (
  <View style={sty.sectionHeader}>
    <View style={sty.sectionTitleRow}>
      {icon ? <AppText style={sty.sectionIcon}>{icon}</AppText> : null}
      <AppText variant="bodyBold" style={sty.sectionTitle}>{title}</AppText>
    </View>
    {subtitle ? (
      <AppText variant="caption" color={Colors.textTertiary} style={sty.sectionSub}>
        {subtitle}
      </AppText>
    ) : null}
  </View>
);

/* ─── Chip Select ──────────────────────────────────────────── */

const ChipRow = ({options, selected, onSelect, multi}) => (
  <View style={sty.chipRow}>
    {(options || []).map((opt, idx) => {
      const label = typeof opt === 'string' ? opt : opt.label || opt;
      const val = typeof opt === 'string' ? opt : opt.id || opt;
      const isActive = multi
        ? (selected || []).includes(val)
        : selected === val;
      return (
        <TouchableOpacity
          key={idx}
          activeOpacity={0.7}
          style={[sty.chip, isActive && sty.chipActive]}
          onPress={() => onSelect(val)}>
          <AppText
            variant="caption"
            style={[sty.chipText, isActive && sty.chipTextActive]}>
            {label}
          </AppText>
        </TouchableOpacity>
      );
    })}
  </View>
);

/* ─── Inline Field Input ───────────────────────────────────── */

const FieldInput = ({field, value, onChange}) => {
  if (!field) return null;
  if (field.type === 'select') {
    return (
      <View style={sty.fieldWrap}>
        <AppText variant="caption" color={Colors.textSecondary} style={sty.fieldLabel}>
          {field.lbl}
        </AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={sty.fieldSelectRow}>
          {(field.options || []).map((opt, i) => {
            const active = value === opt;
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                style={[sty.fieldSelectChip, active && sty.fieldSelectChipActive]}
                onPress={() => onChange(opt)}>
                <AppText
                  variant="small"
                  style={[sty.fieldSelectText, active && sty.fieldSelectTextActive]}>
                  {opt}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
    );
  }

  return (
    <View style={sty.fieldWrap}>
      <AppText variant="caption" color={Colors.textSecondary} style={sty.fieldLabel}>
        {field.lbl}
      </AppText>
      <TextInput
        style={sty.fieldInput}
        value={value != null ? String(value) : ''}
        onChangeText={onChange}
        placeholder={field.placeholder || (field.val != null ? String(field.val) : '')}
        placeholderTextColor={Colors.textTertiary}
        keyboardType={field.type === 'number' ? 'numeric' : 'default'}
      />
    </View>
  );
};

/* ─── Main Component ───────────────────────────────────────── */

const LogActivityTab = ({onSave}) => {
  /* ── State ─────────────────────────────────────────── */
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [formValues, setFormValues] = useState({});

  // Session timer
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerStart, setTimerStart] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // Manual time
  const [showManualTime, setShowManualTime] = useState(false);
  const [manualMin, setManualMin] = useState('');
  const [activeMin, setActiveMin] = useState('');
  const [idleMin, setIdleMin] = useState('');

  // Device calorie + intensity select
  const [deviceCal, setDeviceCal] = useState('');
  const [intensitySelect, setIntensitySelect] = useState('');

  // Physiological - HR
  const [hrBefore, setHrBefore] = useState('');
  const [hrPeak, setHrPeak] = useState('');
  const [hrRecovery, setHrRecovery] = useState('');
  const [hrAvg, setHrAvg] = useState('');
  const [trainingLoad, setTrainingLoad] = useState(5);
  const [selectedHRZone, setSelectedHRZone] = useState(null);

  // Motion & Biomechanics
  const [upperBody, setUpperBody] = useState('');
  const [movementPattern, setMovementPattern] = useState('');
  const [bodyPosition, setBodyPosition] = useState('');

  // Behavioral
  const [feelBefore, setFeelBefore] = useState('');
  const [feelAfter, setFeelAfter] = useState('');
  const [motivation, setMotivation] = useState('');
  const [completion, setCompletion] = useState('');
  const [enjoyment, setEnjoyment] = useState(5);
  const [socialCtx, setSocialCtx] = useState('');

  // HR Monitoring
  const [wearableConnected] = useState(false);
  const [liveHR] = useState(72);

  // Intensity slider
  const [intensityLevel, setIntensityLevel] = useState(3);
  const [zoneDistribution, setZoneDistribution] = useState([10, 25, 40, 20, 5]);

  // Post-meal
  const [mealFlag, setMealFlag] = useState('None');

  // Notes
  const [notes, setNotes] = useState('');

  const scrollRef = useRef(null);

  /* ── Derived ───────────────────────────────────────── */
  const activityObj = useMemo(
    () => ACTIVITIES.find((a) => a.id === selectedActivity) || null,
    [selectedActivity],
  );

  const durationMin = useMemo(() => {
    if (showManualTime && manualMin) return parseInt(manualMin, 10) || 0;
    return Math.floor(elapsed / 60000);
  }, [showManualTime, manualMin, elapsed]);

  const intensityObj = useMemo(
    () => (INTENSITY_CONFIG || []).find((ic) => ic.id === intensityLevel) || (INTENSITY_CONFIG || [])[2] || {id: 3, label: 'Moderate', met: 4.5, color: '#f59e0b', zonePcts: [5, 20, 50, 20, 5]},
    [intensityLevel],
  );

  const estCalories = useMemo(
    () =>
      activityObj
        ? calcCalories(
            intensityObj?.met || activityObj?.met || 4.5,
            (USER_CONFIG?.weightKg || USER_CONFIG?.weight || 64),
            durationMin,
          )
        : 0,
    [activityObj, durationMin, intensityObj],
  );

  const hrAnalysis = useMemo(() => {
    const peak = parseInt(hrPeak, 10) || 0;
    const recovery = parseInt(hrRecovery, 10) || 0;
    const avg = parseInt(hrAvg, 10) || 0;
    if (peak <= 0) return null;
    const maxHR = USER_CONFIG?.maxHR || 181;
    const zone = getHRZone(peak, maxHR);
    const hrr = recovery > 0 ? calcHRR(peak, recovery) : 0;
    const pctMax = calcPctMaxHR(peak, maxHR);
    const fitness = hrr > 0 ? calcFitnessScore(hrr, USER_CONFIG?.restingHR || 72) : null;
    return {zone, hrr, pctMax, fitness, peak, recovery, avg};
  }, [hrPeak, hrRecovery, hrAvg]);

  const vo2Est = useMemo(
    () => (activityObj ? calcVO2Estimate(activityObj.met) : 0),
    [activityObj],
  );

  const healthBenefits = useMemo(() => {
    if (!activityObj || durationMin < 1) return [];
    const hb = HEALTH_BENEFITS || [];
    const benefits = [];
    if (activityObj.met >= 3 && hb[0]) benefits.push(hb[0]); // insulin
    if (mealFlag !== 'None' && hb[1]) benefits.push(hb[1]); // glucose
    if (activityObj.met >= 5 && hb[2]) benefits.push(hb[2]); // bp
    if (durationMin >= 20 && hb[3]) benefits.push(hb[3]); // zone 3+ cardio
    if (activityObj.met >= 6 && hb[4]) benefits.push(hb[4]); // WHO target
    return benefits;
  }, [activityObj, durationMin, mealFlag]);

  /* ── Key functions ─────────────────────────────────── */

  const selectActivity = useCallback((id) => {
    setSelectedActivity(id);
    setFormValues({});
    // haptic feedback removed
  }, []);

  const updateFormField = useCallback((fieldId, value) => {
    setFormValues((prev) => ({...prev, [fieldId]: value}));
  }, []);

  const updateCalPreview = useCallback(() => {
    // recalc is handled reactively via useMemo
  }, []);

  const updateIntensity = useCallback((val) => {
    setIntensityLevel(val);
    // Redistribute zone percentages based on intensity
    const distributions = {
      1: [60, 30, 8, 2, 0],
      2: [30, 45, 20, 5, 0],
      3: [10, 25, 40, 20, 5],
      4: [5, 10, 25, 40, 20],
      5: [0, 5, 15, 35, 45],
    };
    setZoneDistribution(distributions[val] || distributions[3]);
  }, []);

  const setMealFlagHandler = useCallback((flag) => {
    setMealFlag(flag);
    // haptic feedback removed
  }, []);

  const updateHRAnalysis = useCallback(() => {
    // HR analysis is computed reactively via useMemo
  }, []);

  // Timer controls
  const startTimer = useCallback(() => {
    const now = Date.now();
    setTimerStart(now);
    setTimerRunning(true);
    // haptic feedback removed
  }, []);

  const stopTimer = useCallback(() => {
    setTimerRunning(false);
    if (timerRef.current) clearInterval(timerRef.current);
    // haptic feedback removed
  }, []);

  useEffect(() => {
    if (timerRunning && timerStart) {
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - timerStart);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, timerStart]);

  /* ── Save handler ──────────────────────────────────── */
  const handleSave = useCallback(() => {
    if (!activityObj) return;
    const payload = {
      activityId: selectedActivity,
      activityName: activityObj.name,
      met: activityObj.met,
      durationMin,
      activeMin: parseInt(activeMin, 10) || durationMin,
      idleMin: parseInt(idleMin, 10) || 0,
      formValues,
      deviceCal: parseInt(deviceCal, 10) || null,
      intensitySelect,
      hr: {
        before: parseInt(hrBefore, 10) || null,
        peak: parseInt(hrPeak, 10) || null,
        recovery: parseInt(hrRecovery, 10) || null,
        avg: parseInt(hrAvg, 10) || null,
      },
      trainingLoad,
      vo2Est,
      hrZone: selectedHRZone,
      motion: {upperBody, movementPattern, bodyPosition},
      behavioral: {
        feelBefore,
        feelAfter,
        motivation,
        completion,
        enjoyment,
        socialCtx,
      },
      intensity: {level: intensityLevel, distribution: zoneDistribution},
      mealFlag,
      estCalories,
      notes,
      timestamp: new Date().toISOString(),
    };
    onSave?.(payload);
    // haptic feedback removed
  }, [
    activityObj, selectedActivity, durationMin, activeMin, idleMin,
    formValues, deviceCal, intensitySelect, hrBefore, hrPeak,
    hrRecovery, hrAvg, trainingLoad, vo2Est, selectedHRZone,
    upperBody, movementPattern, bodyPosition, feelBefore, feelAfter,
    motivation, completion, enjoyment, socialCtx, intensityLevel,
    zoneDistribution, mealFlag, estCalories, notes, onSave,
  ]);

  /* ── Render helpers ────────────────────────────────── */

  const renderActivityGrid = () => (
    <View style={sty.section}>
      <SectionHeader icon="🏃" title="Select Activity" subtitle="Choose your activity type" />
      <View style={sty.actGrid}>
        {(ACTIVITIES || []).map((act) => {
          const isActive = selectedActivity === act.id;
          return (
            <TouchableOpacity
              key={act.id}
              activeOpacity={0.7}
              style={[
                sty.actCard,
                isActive && sty.actCardActive,
              ]}
              onPress={() => selectActivity(act.id)}>
              <AppText style={sty.actIcon}>{act.ico}</AppText>
              <AppText
                variant="small"
                numberOfLines={1}
                style={[sty.actName, isActive && sty.actNameActive]}>
                {act.name}
              </AppText>
              <AppText
                variant="small"
                color={isActive ? Colors.accent : Colors.textTertiary}
                style={sty.actMet}>
                {act.met} MET
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  /* ── Layer 1: Movement & Workout ───────────────────── */

  const renderLayer1 = () => {
    const formDef = selectedActivity ? (ACTIVITY_FORMS || {})[selectedActivity] : null;
    return (
      <View style={sty.section}>
        <SectionHeader
          icon="⏱️"
          title="Movement & Workout"
          subtitle="Session time, activity details and intensity"
        />

        {/* Session timer */}
        <View style={sty.timerCard}>
          <AppText variant="caption" color={Colors.textSecondary} style={sty.timerLabel}>
            SESSION TIMER
          </AppText>
          <AppText style={sty.timerDisplay}>{formatElapsed(elapsed)}</AppText>
          <View style={sty.timerBtnRow}>
            {!timerRunning ? (
              <TouchableOpacity
                activeOpacity={0.7}
                style={sty.timerBtnStart}
                onPress={startTimer}>
                <AppText variant="bodyBold" color={Colors.white}>Start</AppText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                style={sty.timerBtnStop}
                onPress={stopTimer}>
                <AppText variant="bodyBold" color={Colors.white}>Stop</AppText>
              </TouchableOpacity>
            )}
          </View>

          {/* Manual time toggle */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={sty.manualToggle}
            onPress={() => setShowManualTime(!showManualTime)}>
            <AppText variant="caption" color={Colors.accent}>
              {showManualTime ? 'Hide manual entry' : 'Enter time manually'}
            </AppText>
          </TouchableOpacity>

          {showManualTime && (
            <View style={sty.manualTimeRow}>
              <View style={sty.manualTimeField}>
                <AppText variant="small" color={Colors.textTertiary}>Total min</AppText>
                <TextInput
                  style={sty.manualInput}
                  value={manualMin}
                  onChangeText={setManualMin}
                  placeholder="0"
                  placeholderTextColor={Colors.textTertiary}
                  keyboardType="numeric"
                />
              </View>
            </View>
          )}
        </View>

        {/* Active / Idle time */}
        <View style={sty.inlineRow}>
          <View style={sty.inlineField}>
            <AppText variant="caption" color={Colors.textSecondary}>Active min</AppText>
            <TextInput
              style={sty.fieldInput}
              value={activeMin}
              onChangeText={setActiveMin}
              placeholder="0"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="numeric"
            />
          </View>
          <View style={sty.inlineField}>
            <AppText variant="caption" color={Colors.textSecondary}>Idle min</AppText>
            <TextInput
              style={sty.fieldInput}
              value={idleMin}
              onChangeText={setIdleMin}
              placeholder="0"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Dynamic activity form fields */}
        {formDef && formDef.fields && formDef.fields.map((rowObj, rIdx) => {
          const fields = rowObj.row || rowObj;
          return (
            <View key={rIdx} style={sty.formRow}>
              {(Array.isArray(fields) ? fields : [fields]).map((field, fIdx) => (
                <FieldInput
                  key={field?.id || fIdx}
                  field={field}
                  value={formValues[field?.id] != null ? formValues[field?.id] : ''}
                  onChange={(val) => field?.id && updateFormField(field.id, val)}
                />
              ))}
            </View>
          );
        })}

        {/* Device calorie + intensity */}
        <View style={sty.inlineRow}>
          <View style={sty.inlineField}>
            <AppText variant="caption" color={Colors.textSecondary}>Device kcal</AppText>
            <TextInput
              style={sty.fieldInput}
              value={deviceCal}
              onChangeText={setDeviceCal}
              placeholder="0"
              placeholderTextColor={Colors.textTertiary}
              keyboardType="numeric"
            />
          </View>
          <View style={sty.inlineField}>
            <AppText variant="caption" color={Colors.textSecondary}>Intensity</AppText>
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={sty.intensitySelectRow}>
              {['Low', 'Moderate', 'High', 'Max'].map((lvl) => {
                const active = intensitySelect === lvl;
                return (
                  <TouchableOpacity
                    key={lvl}
                    activeOpacity={0.7}
                    style={[sty.intensityChip, active && sty.intensityChipActive]}
                    onPress={() => setIntensitySelect(lvl)}>
                    <AppText
                      variant="small"
                      style={[sty.intensityChipText, active && sty.intensityChipTextActive]}>
                      {lvl}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </ScrollView>
          </View>
        </View>

        {/* Activity tip */}
        {formDef && formDef.tips && (
          <View style={sty.tipCard}>
            <AppText variant="caption" color={Colors.tealText} style={sty.tipText}>
              {'💡 '}{formDef.tips}
            </AppText>
          </View>
        )}
      </View>
    );
  };

  /* ── Layer 2: Physiological ────────────────────────── */

  const renderLayer2 = () => (
    <View style={sty.section}>
      <SectionHeader
        icon="❤️"
        title="Physiological"
        subtitle="Heart rate, training load and VO2 estimate"
      />

      {/* HR inputs */}
      <View style={sty.hrGrid}>
        <View style={sty.hrField}>
          <AppText variant="small" color={Colors.textTertiary}>Before</AppText>
          <TextInput
            style={sty.hrInput}
            value={hrBefore}
            onChangeText={setHrBefore}
            placeholder="bpm"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="numeric"
          />
        </View>
        <View style={sty.hrField}>
          <AppText variant="small" color={Colors.textTertiary}>Peak</AppText>
          <TextInput
            style={[sty.hrInput, sty.hrInputPeak]}
            value={hrPeak}
            onChangeText={setHrPeak}
            placeholder="bpm"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="numeric"
          />
        </View>
        <View style={sty.hrField}>
          <AppText variant="small" color={Colors.textTertiary}>Recovery +2m</AppText>
          <TextInput
            style={sty.hrInput}
            value={hrRecovery}
            onChangeText={setHrRecovery}
            placeholder="bpm"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="numeric"
          />
        </View>
        <View style={sty.hrField}>
          <AppText variant="small" color={Colors.textTertiary}>Average</AppText>
          <TextInput
            style={sty.hrInput}
            value={hrAvg}
            onChangeText={setHrAvg}
            placeholder="bpm"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="numeric"
          />
        </View>
      </View>

      {/* Training load + VO2 */}
      <View style={sty.inlineRow}>
        <View style={sty.inlineField}>
          <AppText variant="caption" color={Colors.textSecondary}>
            Training load (1-10)
          </AppText>
          <View style={sty.loadRow}>
            {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
              const active = trainingLoad === n;
              return (
                <TouchableOpacity
                  key={n}
                  activeOpacity={0.7}
                  style={[
                    sty.loadDot,
                    active && sty.loadDotActive,
                    n <= 3 && active && {backgroundColor: '#16a34a'},
                    n >= 4 && n <= 6 && active && {backgroundColor: '#d97706'},
                    n >= 7 && n <= 8 && active && {backgroundColor: '#dc2626'},
                    n >= 9 && active && {backgroundColor: '#7c3aed'},
                  ]}
                  onPress={() => setTrainingLoad(n)}>
                  <AppText
                    variant="small"
                    style={[sty.loadDotText, active && {color: Colors.white}]}>
                    {n}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      </View>

      <View style={sty.vo2Card}>
        <AppText variant="caption" color={Colors.textSecondary}>VO2 Estimate</AppText>
        <AppText variant="bodyBold" color={Colors.accent}>
          {vo2Est} ml/kg/min
        </AppText>
      </View>

      {/* HR zone picker */}
      <AppText variant="caption" color={Colors.textSecondary} style={sty.zonePickerLabel}>
        HR Zone
      </AppText>
      <View style={sty.zoneRow}>
        {(HR_ZONES || []).map((zone) => {
          const active = selectedHRZone === zone.id;
          const zoneColor = zone.col || zone.color || Colors.accent;
          return (
            <TouchableOpacity
              key={zone.id}
              activeOpacity={0.7}
              style={[
                sty.zoneBtn,
                {borderColor: active ? zoneColor : Colors.borderLight},
                active && {backgroundColor: zoneColor},
              ]}
              onPress={() => setSelectedHRZone(zone.id)}>
              <AppText
                variant="small"
                style={{
                  color: active ? Colors.white : Colors.textPrimary,
                  fontWeight: active ? '700' : '500',
                  fontSize: ms(10),
                }}>
                {zone.label || zone.name}
              </AppText>
              <AppText
                variant="small"
                style={{
                  color: active ? 'rgba(255,255,255,0.75)' : Colors.textTertiary,
                  fontSize: ms(8),
                }}>
                {zone.name}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* HR Analysis card */}
      {hrAnalysis && (
        <View style={sty.hrAnalysisCard}>
          <AppText variant="caption" color={Colors.tealText} style={sty.hrAnalysisTitle}>
            HR ANALYSIS
          </AppText>
          <View style={sty.hrAnalysisGrid}>
            <View style={sty.hrAnalysisItem}>
              <AppText variant="small" color={Colors.textTertiary}>Zone</AppText>
              <AppText variant="bodyBold" style={{color: hrAnalysis.zone?.col || hrAnalysis.zone?.color || Colors.accent}}>
                {hrAnalysis.zone?.label || hrAnalysis.zone?.name || '--'}
              </AppText>
            </View>
            <View style={sty.hrAnalysisItem}>
              <AppText variant="small" color={Colors.textTertiary}>HRR</AppText>
              <AppText variant="bodyBold" color={Colors.textPrimary}>
                {hrAnalysis.hrr > 0 ? `${hrAnalysis.hrr} bpm` : '--'}
              </AppText>
            </View>
            <View style={sty.hrAnalysisItem}>
              <AppText variant="small" color={Colors.textTertiary}>% Max HR</AppText>
              <AppText variant="bodyBold" color={Colors.textPrimary}>
                {hrAnalysis.pctMax}%
              </AppText>
            </View>
            {hrAnalysis.fitness && (
              <View style={sty.hrAnalysisItem}>
                <AppText variant="small" color={Colors.textTertiary}>Fitness</AppText>
                <AppText variant="bodyBold" style={{color: hrAnalysis.fitness.color}}>
                  {hrAnalysis.fitness.score}
                </AppText>
              </View>
            )}
          </View>
          <View style={sty.ayuNoteRow}>
            <AppText variant="small" color={Colors.tealText}>
              {'🧑‍⚕️ '}
              {hrAnalysis.pctMax >= 80
                ? 'High intensity zone — ensure adequate recovery.'
                : hrAnalysis.pctMax >= 60
                ? 'Good cardio zone — sustainable fat-burning range.'
                : 'Light effort — great for active recovery days.'}
            </AppText>
          </View>
        </View>
      )}
    </View>
  );

  /* ── Layer 3: Motion & Biomechanics ────────────────── */

  const renderLayer3 = () => (
    <View style={sty.section}>
      <SectionHeader
        icon="🦴"
        title="Motion & Biomechanics"
        subtitle="Body engagement, movement patterns and position"
      />
      <AppText variant="caption" color={Colors.textSecondary} style={sty.fieldLabelSpaced}>
        Upper body engagement
      </AppText>
      <ChipRow options={UPPER_BODY} selected={upperBody} onSelect={setUpperBody} />

      <AppText variant="caption" color={Colors.textSecondary} style={sty.fieldLabelSpaced}>
        Movement pattern
      </AppText>
      <ChipRow options={MOVEMENT_PATTERNS} selected={movementPattern} onSelect={setMovementPattern} />

      <AppText variant="caption" color={Colors.textSecondary} style={sty.fieldLabelSpaced}>
        Body position
      </AppText>
      <ChipRow options={BODY_POSITIONS} selected={bodyPosition} onSelect={setBodyPosition} />
    </View>
  );

  /* ── Layer 4: Behavioral ───────────────────────────── */

  const renderLayer4 = () => (
    <View style={sty.section}>
      <SectionHeader
        icon="🧠"
        title="Behavioral"
        subtitle="How you feel, motivation and social context"
      />

      <View style={sty.inlineRow}>
        <View style={sty.inlineField}>
          <AppText variant="caption" color={Colors.textSecondary}>Feel before</AppText>
          <ChipRow options={FEEL_OPTIONS} selected={feelBefore} onSelect={setFeelBefore} />
        </View>
      </View>

      <View style={sty.inlineRow}>
        <View style={sty.inlineField}>
          <AppText variant="caption" color={Colors.textSecondary}>Feel after</AppText>
          <ChipRow options={FEEL_OPTIONS} selected={feelAfter} onSelect={setFeelAfter} />
        </View>
      </View>

      <AppText variant="caption" color={Colors.textSecondary} style={sty.fieldLabelSpaced}>
        Motivation source
      </AppText>
      <ChipRow options={MOTIVATION_SOURCES} selected={motivation} onSelect={setMotivation} />

      <AppText variant="caption" color={Colors.textSecondary} style={sty.fieldLabelSpaced}>
        Completion status
      </AppText>
      <ChipRow options={COMPLETION_STATUS} selected={completion} onSelect={setCompletion} />

      {/* Enjoyment */}
      <View style={sty.enjoymentRow}>
        <AppText variant="caption" color={Colors.textSecondary}>
          Enjoyment (1-10)
        </AppText>
        <View style={sty.loadRow}>
          {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => {
            const active = enjoyment === n;
            return (
              <TouchableOpacity
                key={n}
                activeOpacity={0.7}
                style={[
                  sty.loadDot,
                  active && sty.loadDotActive,
                  active && {backgroundColor: Colors.accent},
                ]}
                onPress={() => setEnjoyment(n)}>
                <AppText
                  variant="small"
                  style={[sty.loadDotText, active && {color: Colors.white}]}>
                  {n}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <AppText variant="caption" color={Colors.textSecondary} style={sty.fieldLabelSpaced}>
        Social context
      </AppText>
      <ChipRow options={SOCIAL_CONTEXT} selected={socialCtx} onSelect={setSocialCtx} />
    </View>
  );

  /* ── Section 3: HR Monitoring ──────────────────────── */

  const renderHRMonitoring = () => (
    <View style={sty.section}>
      <SectionHeader
        icon="📡"
        title="Heart Rate Monitoring"
        subtitle={wearableConnected ? 'Apple Watch connected' : '3-point manual entry'}
      />

      {wearableConnected ? (
        <View style={sty.wearableCard}>
          <View style={sty.wearableLiveRow}>
            <AppText style={sty.wearableLiveIcon}>❤️</AppText>
            <AppText style={sty.wearableLiveHR}>{liveHR}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}> bpm</AppText>
          </View>
          {/* Mini waveform placeholder */}
          <View style={sty.waveformPlaceholder}>
            <View style={sty.waveformBar} />
            <View style={[sty.waveformBar, {height: vs(18)}]} />
            <View style={[sty.waveformBar, {height: vs(28)}]} />
            <View style={[sty.waveformBar, {height: vs(14)}]} />
            <View style={[sty.waveformBar, {height: vs(22)}]} />
            <View style={[sty.waveformBar, {height: vs(10)}]} />
            <View style={[sty.waveformBar, {height: vs(26)}]} />
            <View style={[sty.waveformBar, {height: vs(16)}]} />
            <View style={[sty.waveformBar, {height: vs(20)}]} />
            <View style={sty.waveformBar} />
          </View>
        </View>
      ) : (
        <View style={sty.hrManualGrid}>
          {[
            {label: 'Before', value: hrBefore, setter: setHrBefore},
            {label: 'Peak', value: hrPeak, setter: setHrPeak},
            {label: 'Recovery', value: hrRecovery, setter: setHrRecovery},
          ].map((item) => (
            <View key={item.label} style={sty.hrManualItem}>
              <AppText variant="caption" color={Colors.textSecondary}>
                {item.label}
              </AppText>
              <TextInput
                style={sty.hrManualInput}
                value={item.value}
                onChangeText={item.setter}
                placeholder="bpm"
                placeholderTextColor={Colors.textTertiary}
                keyboardType="numeric"
              />
              <TouchableOpacity
                activeOpacity={0.7}
                style={sty.measureBtn}
                onPress={() => {}}>
                <AppText variant="small" color={Colors.accent}>Measure</AppText>
              </TouchableOpacity>
            </View>
          ))}
        </View>
      )}

      {/* HR Analysis card (duplicate context for monitoring section) */}
      {hrAnalysis && (
        <View style={[sty.hrAnalysisCard, {marginTop: vs(10)}]}>
          <View style={sty.hrAnalysisGrid}>
            <View style={sty.hrAnalysisItem}>
              <AppText variant="small" color={Colors.textTertiary}>Zone</AppText>
              <AppText variant="bodyBold" style={{color: hrAnalysis.zone?.col || hrAnalysis.zone?.color || Colors.accent}}>
                {hrAnalysis.zone?.label || hrAnalysis.zone?.name || '--'}
              </AppText>
            </View>
            <View style={sty.hrAnalysisItem}>
              <AppText variant="small" color={Colors.textTertiary}>HRR</AppText>
              <AppText variant="bodyBold" color={Colors.textPrimary}>
                {hrAnalysis.hrr > 0 ? hrAnalysis.hrr : '--'}
              </AppText>
            </View>
            <View style={sty.hrAnalysisItem}>
              <AppText variant="small" color={Colors.textTertiary}>Intensity</AppText>
              <AppText variant="bodyBold" color={intensityObj?.color || Colors.accent}>
                {intensityObj?.label || 'Moderate'}
              </AppText>
            </View>
            <View style={sty.hrAnalysisItem}>
              <AppText variant="small" color={Colors.textTertiary}>% Max HR</AppText>
              <AppText variant="bodyBold" color={Colors.textPrimary}>
                {hrAnalysis.pctMax}%
              </AppText>
            </View>
            {hrAnalysis.fitness && (
              <View style={sty.hrAnalysisItem}>
                <AppText variant="small" color={Colors.textTertiary}>Fitness</AppText>
                <AppText variant="bodyBold" style={{color: hrAnalysis.fitness.color}}>
                  {hrAnalysis.fitness.score}
                </AppText>
              </View>
            )}
          </View>
        </View>
      )}
    </View>
  );

  /* ── Section 4: Intensity ──────────────────────────── */

  const renderIntensity = () => (
    <View style={sty.section}>
      <SectionHeader
        icon="🔥"
        title="Intensity"
        subtitle="Perceived effort and zone distribution"
      />

      {/* Slider (1-5) */}
      <View style={sty.intensitySliderCard}>
        <View style={sty.intensitySliderRow}>
          {(INTENSITY_CONFIG || []).map((cfg) => {
            const active = intensityLevel === cfg.id;
            return (
              <TouchableOpacity
                key={cfg.id}
                activeOpacity={0.7}
                style={[
                  sty.intensitySliderDot,
                  {borderColor: cfg.color},
                  active && {backgroundColor: cfg.color},
                ]}
                onPress={() => updateIntensity(cfg.id)}>
                <AppText
                  variant="small"
                  style={{
                    color: active ? Colors.white : cfg.color,
                    fontWeight: '700',
                    fontSize: ms(11),
                  }}>
                  {cfg.id}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={sty.intensityLabelRow}>
          <AppText variant="bodyBold" style={{color: intensityObj?.color || Colors.accent}}>
            {intensityObj?.label || 'Moderate'}
          </AppText>
        </View>
      </View>

      {/* Zone distribution */}
      <AppText variant="caption" color={Colors.textSecondary} style={sty.fieldLabelSpaced}>
        Zone distribution
      </AppText>
      <View style={sty.zoneDistRow}>
        {(HR_ZONES || []).map((zone, idx) => {
          const zoneColor = zone.col || zone.color || Colors.accent;
          return (
            <View key={zone.id} style={sty.zoneDistCard}>
              <View style={[sty.zoneDistBar, {backgroundColor: zoneColor}]}>
                <View
                  style={[
                    sty.zoneDistFill,
                    {
                      height: `${zoneDistribution[idx] || 0}%`,
                      backgroundColor: zoneColor,
                    },
                  ]}
                />
              </View>
              <AppText variant="small" style={{color: zoneColor, fontWeight: '700', fontSize: ms(11)}}>
                {zoneDistribution[idx] || 0}%
              </AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(8)}}>
                {zone.label || zone.name}
              </AppText>
            </View>
          );
        })}
      </View>
    </View>
  );

  /* ── Section 5: Post-meal Tag ──────────────────────── */

  const renderPostMeal = () => (
    <View style={sty.section}>
      <SectionHeader
        icon="🍽️"
        title="Post-meal Tag"
        subtitle="Tag if this was a post-meal activity"
      />
      <View style={sty.mealRow}>
        {(MEAL_FLAGS || []).map((flag) => {
          const active = mealFlag === flag;
          return (
            <TouchableOpacity
              key={flag}
              activeOpacity={0.7}
              style={[sty.mealBtn, active && sty.mealBtnActive]}
              onPress={() => setMealFlagHandler(flag)}>
              <AppText
                variant="caption"
                style={[sty.mealBtnText, active && sty.mealBtnTextActive]}>
                {flag}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
      <AppText variant="small" color={Colors.textTertiary} style={sty.glucoseHint}>
        Post-meal movement within 30 min can reduce glucose spikes by 20-40%
      </AppText>
    </View>
  );

  /* ── Section 6: Calorie Preview ────────────────────── */

  const renderCaloriePreview = () => (
    <View style={sty.section}>
      <SectionHeader
        icon="🔥"
        title="Calorie Preview"
        subtitle="Estimated burn based on MET calculation"
      />
      <View style={sty.calCard}>
        <View style={sty.calTopRow}>
          <View style={sty.calMain}>
            <AppText style={sty.calNumber}>{estCalories}</AppText>
            <AppText variant="caption" color={Colors.textTertiary}>kcal estimated</AppText>
          </View>
          <View style={sty.calSummary}>
            <AppText variant="small" color={Colors.textSecondary}>
              {activityObj ? activityObj.name : '--'} {' | '} {durationMin} min
            </AppText>
            <AppText variant="small" color={Colors.textTertiary}>
              MET {activityObj ? activityObj.met : '--'} x {(USER_CONFIG?.weightKg || USER_CONFIG?.weight || 64)}kg x{' '}
              {durationMin > 0 ? (durationMin / 60).toFixed(2) : '0'} hr
            </AppText>
          </View>
        </View>

        {/* Health benefit badges */}
        {healthBenefits.length > 0 && (
          <View style={sty.benefitRow}>
            {healthBenefits.map((b, idx) => (
              <View key={b?.label || idx} style={sty.benefitBadge}>
                <AppText variant="small" color={b?.color || Colors.tealText} style={sty.benefitLabel}>
                  {b?.label || ''}
                </AppText>
              </View>
            ))}
          </View>
        )}
      </View>
    </View>
  );

  /* ── Section 7: Ayu Intelligence ───────────────────── */

  const renderAyuIntelligence = () => (
    <View style={sty.section}>
      <SectionHeader
        icon="🧑‍⚕️"
        title="Ayu Intelligence"
        subtitle="AI-powered health insights for this activity"
      />
      <View style={sty.ayuCard}>
        <View style={sty.ayuInsightGrid}>
          <View style={sty.ayuInsightItem}>
            <AppText style={sty.ayuInsightIcon}>📉</AppText>
            <AppText variant="small" color={Colors.white} style={sty.ayuInsightTitle}>
              Glucose Impact
            </AppText>
            <AppText variant="small" style={sty.ayuInsightSub}>
              {mealFlag !== 'None'
                ? 'Post-meal activity detected. Expect ~20% glucose reduction.'
                : 'Log a post-meal tag to see glucose impact.'}
            </AppText>
          </View>
          <View style={sty.ayuInsightItem}>
            <AppText style={sty.ayuInsightIcon}>❤️</AppText>
            <AppText variant="small" color={Colors.white} style={sty.ayuInsightTitle}>
              Cardiovascular
            </AppText>
            <AppText variant="small" style={sty.ayuInsightSub}>
              {hrAnalysis
                ? `Peak ${hrAnalysis.pctMax}% max HR — ${hrAnalysis.zone?.name || 'Unknown'} zone.`
                : 'Enter HR data to see cardiovascular response.'}
            </AppText>
          </View>
          <View style={sty.ayuInsightItem}>
            <AppText style={sty.ayuInsightIcon}>🔄</AppText>
            <AppText variant="small" color={Colors.white} style={sty.ayuInsightTitle}>
              Recovery
            </AppText>
            <AppText variant="small" style={sty.ayuInsightSub}>
              {hrAnalysis && hrAnalysis.hrr > 0
                ? `HRR ${hrAnalysis.hrr} bpm — ${hrAnalysis.fitness?.score || 'N/A'} recovery.`
                : 'Enter recovery HR for recommendations.'}
            </AppText>
          </View>
          <View style={sty.ayuInsightItem}>
            <AppText style={sty.ayuInsightIcon}>📊</AppText>
            <AppText variant="small" color={Colors.white} style={sty.ayuInsightTitle}>
              Trend
            </AppText>
            <AppText variant="small" style={sty.ayuInsightSub}>
              {durationMin >= 20
                ? `${durationMin} min activity adds to weekly movement trend.`
                : 'Log 20+ min for trend contribution.'}
            </AppText>
          </View>
        </View>
      </View>

      {/* Notes textarea */}
      <AppText variant="caption" color={Colors.textSecondary} style={sty.fieldLabelSpaced}>
        Notes / context
      </AppText>
      <TextInput
        style={sty.notesInput}
        value={notes}
        onChangeText={setNotes}
        placeholder="Add any notes about this session..."
        placeholderTextColor={Colors.textTertiary}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
      />
    </View>
  );

  /* ── Main Render ───────────────────────────────────── */

  return (
    <ScrollView
      ref={scrollRef}
      style={sty.container}
      contentContainerStyle={sty.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">

      {/* 1. Activity Selector Grid */}
      {renderActivityGrid()}

      {/* Show form sections only when activity is selected */}
      {selectedActivity && (
        <>
          {/* 2. Dynamic Activity Form (Layers 1-4) */}
          {renderLayer1()}
          {renderLayer2()}
          {renderLayer3()}
          {renderLayer4()}

          {/* 3. HR Monitoring */}
          {renderHRMonitoring()}

          {/* 4. Intensity */}
          {renderIntensity()}

          {/* 5. Post-meal Tag */}
          {renderPostMeal()}

          {/* 6. Calorie Preview */}
          {renderCaloriePreview()}

          {/* 7. Ayu Intelligence */}
          {renderAyuIntelligence()}

          {/* Save Button */}
          <TouchableOpacity
            activeOpacity={0.8}
            style={sty.saveBtn}
            onPress={handleSave}>
            <AppText variant="bodyBold" color={Colors.white} style={sty.saveBtnText}>
              Save Activity Log
            </AppText>
          </TouchableOpacity>
        </>
      )}

      <View style={sty.bottomSpacer} />
    </ScrollView>
  );
};

/* ═══════════════════════════════════════════════════════════
   Styles
   ═══════════════════════════════════════════════════════════ */

const sty = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollContent: {
    paddingHorizontal: s(16),
    paddingTop: vs(12),
    paddingBottom: vs(40),
  },

  /* ── Section ──────────────────────────────────────── */
  section: {
    marginBottom: vs(18),
  },
  sectionHeader: {
    marginBottom: vs(10),
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sectionIcon: {
    fontSize: ms(16),
    marginRight: s(6),
  },
  sectionTitle: {
    fontSize: ms(14),
    fontWeight: '700',
  },
  sectionSub: {
    marginTop: vs(2),
    marginLeft: s(22),
  },

  /* ── Activity Grid ────────────────────────────────── */
  actGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  actCard: {
    width: '22.5%',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingVertical: vs(10),
    paddingHorizontal: s(4),
    alignItems: 'center',
  },
  actCardActive: {
    borderColor: Colors.accent,
    backgroundColor: Colors.tealBg,
    borderWidth: 1.5,
  },
  actIcon: {
    fontSize: ms(22),
    marginBottom: vs(4),
  },
  actName: {
    fontSize: ms(10),
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  actNameActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  actMet: {
    fontSize: ms(8),
    marginTop: vs(2),
  },

  /* ── Timer ────────────────────────────────────────── */
  timerCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(14),
    alignItems: 'center',
    marginBottom: vs(10),
  },
  timerLabel: {
    fontSize: ms(9),
    fontWeight: '600',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: vs(6),
  },
  timerDisplay: {
    fontSize: ms(36),
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: vs(10),
  },
  timerBtnRow: {
    flexDirection: 'row',
    gap: s(10),
  },
  timerBtnStart: {
    backgroundColor: Colors.accent,
    paddingHorizontal: s(32),
    paddingVertical: vs(10),
    borderRadius: ms(24),
  },
  timerBtnStop: {
    backgroundColor: Colors.red,
    paddingHorizontal: s(32),
    paddingVertical: vs(10),
    borderRadius: ms(24),
  },
  manualToggle: {
    marginTop: vs(10),
    paddingVertical: vs(4),
  },
  manualTimeRow: {
    flexDirection: 'row',
    gap: s(10),
    marginTop: vs(8),
    width: '100%',
  },
  manualTimeField: {
    flex: 1,
    alignItems: 'center',
  },
  manualInput: {
    backgroundColor: Colors.background,
    borderRadius: ms(8),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    fontSize: ms(14),
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: vs(4),
    width: '100%',
  },

  /* ── Inline rows / fields ─────────────────────────── */
  inlineRow: {
    flexDirection: 'row',
    gap: s(10),
    marginBottom: vs(10),
  },
  inlineField: {
    flex: 1,
  },
  fieldWrap: {
    flex: 1,
    marginBottom: vs(4),
  },
  fieldLabel: {
    fontSize: ms(10),
    marginBottom: vs(4),
  },
  fieldLabelSpaced: {
    marginBottom: vs(6),
    marginTop: vs(4),
  },
  fieldInput: {
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(12),
    paddingVertical: Platform.OS === 'ios' ? vs(10) : vs(6),
    fontSize: ms(13),
    color: Colors.textPrimary,
  },
  fieldSelectRow: {
    flexDirection: 'row',
    gap: s(4),
    paddingVertical: vs(2),
  },
  fieldSelectChip: {
    backgroundColor: Colors.background,
    borderRadius: ms(16),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
  },
  fieldSelectChipActive: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.accent,
  },
  fieldSelectText: {
    fontSize: ms(10),
    color: Colors.textSecondary,
  },
  fieldSelectTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  formRow: {
    flexDirection: 'row',
    gap: s(10),
    marginBottom: vs(8),
  },

  /* ── Intensity select (inline) ────────────────────── */
  intensitySelectRow: {
    flexDirection: 'row',
    gap: s(4),
    paddingVertical: vs(2),
  },
  intensityChip: {
    backgroundColor: Colors.background,
    borderRadius: ms(16),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
  },
  intensityChipActive: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.accent,
  },
  intensityChipText: {
    fontSize: ms(10),
    color: Colors.textSecondary,
  },
  intensityChipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },

  /* ── Tip ──────────────────────────────────────────── */
  tipCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(10),
    padding: ms(12),
    marginTop: vs(6),
  },
  tipText: {
    fontSize: ms(11),
    lineHeight: ms(16),
  },

  /* ── HR Grid ──────────────────────────────────────── */
  hrGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginBottom: vs(10),
  },
  hrField: {
    width: '47%',
    marginBottom: vs(2),
  },
  hrInput: {
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(12),
    paddingVertical: Platform.OS === 'ios' ? vs(10) : vs(6),
    fontSize: ms(14),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginTop: vs(4),
  },
  hrInputPeak: {
    borderColor: Colors.red,
    borderWidth: 1,
  },

  /* ── Training load ────────────────────────────────── */
  loadRow: {
    flexDirection: 'row',
    gap: s(4),
    marginTop: vs(6),
    flexWrap: 'wrap',
  },
  loadDot: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(14),
    backgroundColor: Colors.background,
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadDotActive: {
    borderWidth: 0,
  },
  loadDotText: {
    fontSize: ms(10),
    fontWeight: '600',
    color: Colors.textSecondary,
  },

  /* ── VO2 ──────────────────────────────────────────── */
  vo2Card: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    marginBottom: vs(10),
  },

  /* ── HR Zone picker ───────────────────────────────── */
  zonePickerLabel: {
    marginBottom: vs(6),
  },
  zoneRow: {
    flexDirection: 'row',
    gap: s(5),
    marginBottom: vs(10),
  },
  zoneBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(10),
    borderRadius: ms(10),
    borderWidth: 1,
    backgroundColor: Colors.white,
  },

  /* ── HR Analysis ──────────────────────────────────── */
  hrAnalysisCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.tealBg,
    padding: ms(12),
  },
  hrAnalysisTitle: {
    fontSize: ms(9),
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginBottom: vs(8),
  },
  hrAnalysisGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  hrAnalysisItem: {
    width: '46%',
    marginBottom: vs(6),
  },
  ayuNoteRow: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(8),
    padding: ms(10),
    marginTop: vs(8),
  },

  /* ── Chip Row ─────────────────────────────────────── */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
  },
  chip: {
    backgroundColor: Colors.white,
    borderRadius: ms(18),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(12),
    paddingVertical: vs(7),
  },
  chipActive: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.accent,
  },
  chipText: {
    fontSize: ms(10),
    color: Colors.textSecondary,
  },
  chipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },

  /* ── Enjoyment ────────────────────────────────────── */
  enjoymentRow: {
    marginTop: vs(8),
    marginBottom: vs(8),
  },

  /* ── HR Monitoring: Wearable ──────────────────────── */
  wearableCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(16),
    alignItems: 'center',
    marginBottom: vs(10),
  },
  wearableLiveRow: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: vs(10),
  },
  wearableLiveIcon: {
    fontSize: ms(18),
    marginRight: s(6),
  },
  wearableLiveHR: {
    fontSize: ms(42),
    fontWeight: '700',
    color: Colors.red,
  },
  waveformPlaceholder: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: s(4),
    height: vs(30),
  },
  waveformBar: {
    width: s(6),
    height: vs(12),
    borderRadius: ms(3),
    backgroundColor: Colors.red,
    opacity: 0.3,
  },

  /* ── HR Monitoring: Manual ────────────────────────── */
  hrManualGrid: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(10),
  },
  hrManualItem: {
    flex: 1,
    alignItems: 'center',
  },
  hrManualInput: {
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(8),
    paddingVertical: Platform.OS === 'ios' ? vs(10) : vs(6),
    fontSize: ms(14),
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    width: '100%',
    marginTop: vs(4),
    marginBottom: vs(6),
  },
  measureBtn: {
    paddingVertical: vs(4),
    paddingHorizontal: s(8),
    borderRadius: ms(12),
    backgroundColor: Colors.tealBg,
  },

  /* ── Intensity Section ────────────────────────────── */
  intensitySliderCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(14),
    marginBottom: vs(10),
  },
  intensitySliderRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: vs(10),
  },
  intensitySliderDot: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  intensityLabelRow: {
    alignItems: 'center',
    gap: vs(2),
  },

  /* ── Zone Distribution ────────────────────────────── */
  zoneDistRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    gap: s(6),
    marginBottom: vs(4),
  },
  zoneDistCard: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingVertical: vs(10),
    paddingHorizontal: s(4),
  },
  zoneDistBar: {
    width: s(8),
    height: vs(50),
    borderRadius: ms(4),
    backgroundColor: Colors.borderLight,
    marginBottom: vs(6),
    justifyContent: 'flex-end',
    overflow: 'hidden',
    opacity: 0.25,
  },
  zoneDistFill: {
    width: '100%',
    borderRadius: ms(4),
  },

  /* ── Post-meal ────────────────────────────────────── */
  mealRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginBottom: vs(6),
  },
  mealBtn: {
    backgroundColor: Colors.white,
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
  },
  mealBtnActive: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.accent,
  },
  mealBtnText: {
    fontSize: ms(11),
    color: Colors.textSecondary,
  },
  mealBtnTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },
  glucoseHint: {
    marginTop: vs(4),
    fontSize: ms(10),
    fontStyle: 'italic',
  },

  /* ── Calorie Preview ──────────────────────────────── */
  calCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(14),
  },
  calTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  calMain: {
    marginRight: s(16),
  },
  calNumber: {
    fontSize: ms(38),
    fontWeight: '800',
    color: Colors.accent,
    lineHeight: ms(42),
  },
  calSummary: {
    flex: 1,
    gap: vs(2),
  },
  benefitRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    paddingTop: vs(10),
  },
  benefitBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tealBg,
    borderRadius: ms(16),
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    gap: s(4),
  },
  benefitIco: {
    fontSize: ms(12),
  },
  benefitLabel: {
    fontSize: ms(9),
    fontWeight: '600',
  },

  /* ── Ayu Intelligence ─────────────────────────────── */
  ayuCard: {
    backgroundColor: '#071f12',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: 'rgba(93,202,165,0.15)',
    padding: ms(14),
    marginBottom: vs(10),
  },
  ayuInsightGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  ayuInsightItem: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: ms(10),
    padding: ms(12),
  },
  ayuInsightIcon: {
    fontSize: ms(18),
    marginBottom: vs(6),
  },
  ayuInsightTitle: {
    fontWeight: '700',
    marginBottom: vs(4),
    fontSize: ms(11),
  },
  ayuInsightSub: {
    fontSize: ms(9),
    color: 'rgba(255,255,255,0.5)',
    lineHeight: ms(14),
  },

  /* ── Notes ────────────────────────────────────────── */
  notesInput: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    fontSize: ms(13),
    color: Colors.textPrimary,
    minHeight: vs(80),
  },

  /* ── Save Button ──────────────────────────────────── */
  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: ms(26),
    paddingVertical: vs(14),
    alignItems: 'center',
    marginTop: vs(10),
    ...Platform.select({
      ios: {
        shadowColor: Colors.primary,
        shadowOffset: {width: 0, height: 4},
        shadowOpacity: 0.2,
        shadowRadius: 8,
      },
      android: {
        elevation: 4,
      },
    }),
  },
  saveBtnText: {
    fontSize: ms(15),
    letterSpacing: 0.5,
  },

  /* ── Bottom spacer ────────────────────────────────── */
  bottomSpacer: {
    height: vs(60),
  },
});

export default LogActivityTab;
