import React, {useState, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';

import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {
  SOURCES,
  DEVICES,
  SLEEP_CHECKLIST,
  LAST_NIGHT,
  STAGE_COLORS,
  STAGE_LABELS,
} from '../../../constants/sleepData';

/* ─── Constants ─────────────────────────────────────── */

const PHONE_SENSORS = [
  {ico: '\uD83D\uDCF1', name: 'Accelerometer', sub: 'Movement & restlessness'},
  {ico: '\uD83C\uDFA4', name: 'Microphone', sub: 'Snoring & breathing patterns'},
  {ico: '\uD83D\uDCA1', name: 'Ambient light', sub: 'Room darkness level'},
];

const PLACEMENT_OPTIONS = ['Bedside table', 'Under pillow', 'On mattress', 'Nightstand'];

const GOAL_TYPES = ['General wellness', 'Deep sleep focus', 'REM optimisation', 'Consistency'];

const MIND_STATES = ['Calm', 'Relaxed', 'Neutral', 'Anxious', 'Stressed', 'Racing thoughts', 'Drowsy'];

const IDEAL_RANGES = {
  deep: '15–25%',
  rem: '20–25%',
  light: '45–55%',
  awake: '<5%',
};

const RING_SIZE = ms(100);

/* ─── Helpers ───────────────────────────────────────── */

const fmtMin = (m) => {
  const h = Math.floor(m / 60);
  const r = m % 60;
  return h > 0 ? `${h}h ${r}m` : `${r}m`;
};

const glucoseAlert = (val) => {
  const n = Number(val);
  if (!n) return null;
  if (n < 100) return {msg: 'Low — consider a small snack', color: Colors.amber, bg: Colors.amberBg};
  if (n <= 140) return {msg: 'Ideal bedtime range', color: Colors.teal, bg: Colors.tealBg};
  if (n <= 180) return {msg: 'Elevated — monitor overnight', color: Colors.amber, bg: Colors.amberBg};
  return {msg: 'High — consider correction', color: Colors.red, bg: Colors.redBg};
};

/* ─── Component ─────────────────────────────────────── */

const TonightTab = ({isTracking, onToggleTracking}) => {
  // ── State ──────────────────────────────────────────
  const [selectedSource, setSelectedSource] = useState('phone');
  const [placement, setPlacement] = useState('Bedside table');
  const [showPlacement, setShowPlacement] = useState(false);
  const [chargerConnected, setChargerConnected] = useState(true);

  const [pairedDevices, setPairedDevices] = useState(() => {
    const map = {};
    DEVICES.forEach((d) => { map[d.id] = d.paired; });
    return map;
  });

  const [bedtime, setBedtime] = useState('22:30');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [targetDuration, setTargetDuration] = useState('8');
  const [goalType, setGoalType] = useState('General wellness');
  const [showGoalType, setShowGoalType] = useState(false);

  const [checkedItems, setCheckedItems] = useState(() =>
    SLEEP_CHECKLIST.reduce((acc, _, i) => ({...acc, [i]: false}), {}),
  );

  const [glucose, setGlucose] = useState('');
  const [bpSystolic, setBpSystolic] = useState('');
  const [metforminTaken, setMetforminTaken] = useState('Yes');
  const [amlodipineTaken, setAmlodipineTaken] = useState('Yes');
  const [stressLevel, setStressLevel] = useState('');
  const [mindState, setMindState] = useState('Calm');
  const [showMindState, setShowMindState] = useState(false);

  // ── Derived ────────────────────────────────────────
  const gAlert = useMemo(() => glucoseAlert(glucose), [glucose]);

  const totalStages = LAST_NIGHT.stages.deep + LAST_NIGHT.stages.rem +
    LAST_NIGHT.stages.light + LAST_NIGHT.stages.awake;

  const stagePcts = useMemo(() => ({
    deep: Math.round((LAST_NIGHT.stages.deep / totalStages) * 100),
    rem: Math.round((LAST_NIGHT.stages.rem / totalStages) * 100),
    light: Math.round((LAST_NIGHT.stages.light / totalStages) * 100),
    awake: Math.round((LAST_NIGHT.stages.awake / totalStages) * 100),
  }), [totalStages]);

  const scoreColor = LAST_NIGHT.score >= 80
    ? Colors.teal
    : LAST_NIGHT.score >= 60
      ? Colors.amber
      : Colors.red;
  const scorePct = Math.min((LAST_NIGHT.score || 0) / 100, 1);

  // ── Handlers ───────────────────────────────────────
  const toggleCheck = (i) =>
    setCheckedItems((prev) => ({...prev, [i]: !prev[i]}));

  const togglePaired = (id) =>
    setPairedDevices((prev) => ({...prev, [id]: !prev[id]}));

  /* ═══════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════ */
  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>

      {/* ─── 1. SOURCE SELECTOR ───────────────────────── */}
      <AppText variant="bodyBold" style={styles.sectionTitle}>
        Data source
      </AppText>
      <View style={styles.sourceGrid}>
        {SOURCES.map((src) => {
          const active = selectedSource === src.id;
          return (
            <TouchableOpacity
              key={src.id}
              style={[
                styles.sourceCard,
                active && {borderColor: src.col, backgroundColor: src.col + '12'},
              ]}
              activeOpacity={0.7}
              onPress={() => setSelectedSource(src.id)}>
              <AppText style={styles.sourceIco}>{src.ico}</AppText>
              <AppText variant="smallBold" style={[styles.sourceName, active && {color: src.col}]}>
                {src.name}
              </AppText>
              <AppText variant="caption" style={styles.sourceSub}>{src.sub}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ─── 2. SOURCE-SPECIFIC SETUP ─────────────────── */}
      {selectedSource === 'phone' && (
        <View style={styles.card}>
          <AppText variant="bodyBold" style={styles.cardTitle}>
            {'\uD83D\uDCF1'} Phone-based sleep detection
          </AppText>
          <AppText variant="caption" style={styles.cardSub}>
            TrustLife Sense uses built-in phone sensors to track your sleep without a wearable.
          </AppText>

          {PHONE_SENSORS.map((sensor, i) => (
            <View key={i} style={styles.sensorRow}>
              <View style={styles.sensorIcoWrap}>
                <AppText style={styles.sensorIco}>{sensor.ico}</AppText>
              </View>
              <View style={{flex: 1}}>
                <AppText variant="smallBold" style={styles.sensorName}>{sensor.name}</AppText>
                <AppText variant="caption" style={styles.sensorSub}>{sensor.sub}</AppText>
              </View>
            </View>
          ))}

          <View style={styles.divider} />

          <AppText variant="smallBold" style={styles.fieldLabel}>Phone placement</AppText>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowPlacement(!showPlacement)}>
            <AppText variant="small" style={styles.dropdownText}>{placement}</AppText>
            <AppText style={styles.dropdownArrow}>{showPlacement ? '\u25B2' : '\u25BC'}</AppText>
          </TouchableOpacity>
          {showPlacement && (
            <View style={styles.dropdownList}>
              {PLACEMENT_OPTIONS.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.dropdownItem, placement === opt && styles.dropdownItemActive]}
                  onPress={() => { setPlacement(opt); setShowPlacement(false); }}>
                  <AppText variant="small" style={[
                    styles.dropdownItemText,
                    placement === opt && {color: Colors.accent, fontWeight: '700'},
                  ]}>{opt}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          )}

          <View style={styles.chargerRow}>
            <AppText variant="smallBold" style={styles.fieldLabel}>Charger connected</AppText>
            <TouchableOpacity
              style={[styles.togglePill, chargerConnected && styles.togglePillActive]}
              onPress={() => setChargerConnected(!chargerConnected)}>
              <AppText variant="caption" style={[
                styles.togglePillText,
                chargerConnected && styles.togglePillTextActive,
              ]}>
                {chargerConnected ? 'Yes' : 'No'}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {selectedSource === 'wearable' && (
        <View style={styles.card}>
          <AppText variant="bodyBold" style={styles.cardTitle}>
            {'\u231A'} Connect a wearable
          </AppText>
          <AppText variant="caption" style={styles.cardSub}>
            Tap a device to pair or unpair. Paired devices sync sleep data automatically.
          </AppText>

          <View style={styles.deviceGrid}>
            {DEVICES.map((dev) => {
              const isPaired = pairedDevices[dev.id];
              return (
                <TouchableOpacity
                  key={dev.id}
                  style={[styles.deviceCard, isPaired && styles.deviceCardPaired]}
                  activeOpacity={0.7}
                  onPress={() => togglePaired(dev.id)}>
                  <AppText style={styles.deviceIco}>{dev.ico}</AppText>
                  <AppText variant="smallBold" style={styles.deviceName}>{dev.name}</AppText>
                  <AppText variant="caption" style={styles.deviceBrand}>{dev.brand}</AppText>
                  <View style={[styles.pairedBadge, isPaired && styles.pairedBadgeActive]}>
                    <AppText variant="caption" style={[
                      styles.pairedBadgeText,
                      isPaired && styles.pairedBadgeTextActive,
                    ]}>
                      {isPaired ? 'Paired' : 'Tap to pair'}
                    </AppText>
                  </View>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {selectedSource === 'manual' && (
        <View style={styles.card}>
          <AppText variant="bodyBold" style={styles.cardTitle}>
            {'\u270F\uFE0F'} Manual sleep entry
          </AppText>

          <AppText variant="smallBold" style={styles.fieldLabel}>Planned bedtime</AppText>
          <TextInput
            style={styles.input}
            value={bedtime}
            onChangeText={setBedtime}
            placeholder="22:30"
            placeholderTextColor={Colors.textTertiary}
          />

          <AppText variant="smallBold" style={styles.fieldLabel}>Planned wake time</AppText>
          <TextInput
            style={styles.input}
            value={wakeTime}
            onChangeText={setWakeTime}
            placeholder="06:30"
            placeholderTextColor={Colors.textTertiary}
          />

          <AppText variant="smallBold" style={styles.fieldLabel}>Target duration (hrs)</AppText>
          <TextInput
            style={styles.input}
            value={targetDuration}
            onChangeText={setTargetDuration}
            keyboardType="numeric"
            placeholder="8"
            placeholderTextColor={Colors.textTertiary}
          />

          <AppText variant="smallBold" style={styles.fieldLabel}>Sleep goal type</AppText>
          <TouchableOpacity
            style={styles.dropdown}
            onPress={() => setShowGoalType(!showGoalType)}>
            <AppText variant="small" style={styles.dropdownText}>{goalType}</AppText>
            <AppText style={styles.dropdownArrow}>{showGoalType ? '\u25B2' : '\u25BC'}</AppText>
          </TouchableOpacity>
          {showGoalType && (
            <View style={styles.dropdownList}>
              {GOAL_TYPES.map((opt) => (
                <TouchableOpacity
                  key={opt}
                  style={[styles.dropdownItem, goalType === opt && styles.dropdownItemActive]}
                  onPress={() => { setGoalType(opt); setShowGoalType(false); }}>
                  <AppText variant="small" style={[
                    styles.dropdownItemText,
                    goalType === opt && {color: Colors.accent, fontWeight: '700'},
                  ]}>{opt}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>
      )}

      {/* ─── 3. PRE-SLEEP CHECKLIST ───────────────────── */}
      <AppText variant="bodyBold" style={styles.sectionTitle}>
        Pre-sleep checklist
      </AppText>
      <View style={styles.card}>
        {SLEEP_CHECKLIST.map((item, i) => {
          const checked = checkedItems[i];
          return (
            <TouchableOpacity
              key={i}
              style={[styles.checkRow, i < SLEEP_CHECKLIST.length - 1 && styles.checkRowBorder]}
              activeOpacity={0.7}
              onPress={() => toggleCheck(i)}>
              <View style={[styles.checkbox, checked && styles.checkboxChecked]}>
                {checked && <AppText style={styles.checkmark}>{'\u2713'}</AppText>}
              </View>
              <AppText style={styles.checkIco}>{item.ico}</AppText>
              <View style={{flex: 1}}>
                <AppText variant="smallBold" style={[
                  styles.checkTitle,
                  checked && styles.checkTitleDone,
                ]}>{item.title}</AppText>
                <AppText variant="caption" style={styles.checkSub}>{item.sub}</AppText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ─── 4. PRE-SLEEP CLINICAL MARKERS ────────────── */}
      <AppText variant="bodyBold" style={styles.sectionTitle}>
        Pre-sleep clinical markers
      </AppText>
      <View style={styles.card}>
        {/* Glucose */}
        <AppText variant="smallBold" style={styles.fieldLabel}>
          Bedtime glucose (mg/dL)
        </AppText>
        <TextInput
          style={styles.input}
          value={glucose}
          onChangeText={setGlucose}
          keyboardType="numeric"
          placeholder="e.g. 124"
          placeholderTextColor={Colors.textTertiary}
        />
        {gAlert && (
          <View style={[styles.alertBanner, {backgroundColor: gAlert.bg}]}>
            <AppText variant="caption" style={{color: gAlert.color, fontWeight: '600'}}>
              {gAlert.msg}
            </AppText>
          </View>
        )}

        {/* BP */}
        <AppText variant="smallBold" style={styles.fieldLabel}>BP systolic (mmHg)</AppText>
        <TextInput
          style={styles.input}
          value={bpSystolic}
          onChangeText={setBpSystolic}
          keyboardType="numeric"
          placeholder="e.g. 128"
          placeholderTextColor={Colors.textTertiary}
        />

        {/* Meds */}
        <View style={styles.medRow}>
          <View style={{flex: 1}}>
            <AppText variant="smallBold" style={styles.fieldLabel}>Metformin taken</AppText>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setMetforminTaken(metforminTaken === 'Yes' ? 'No' : 'Yes')}>
              <AppText variant="small" style={styles.dropdownText}>{metforminTaken}</AppText>
            </TouchableOpacity>
          </View>
          <View style={{width: s(12)}} />
          <View style={{flex: 1}}>
            <AppText variant="smallBold" style={styles.fieldLabel}>Amlodipine taken</AppText>
            <TouchableOpacity
              style={styles.dropdown}
              onPress={() => setAmlodipineTaken(amlodipineTaken === 'Yes' ? 'No' : 'Yes')}>
              <AppText variant="small" style={styles.dropdownText}>{amlodipineTaken}</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Stress */}
        <AppText variant="smallBold" style={styles.fieldLabel}>Stress level (1-10)</AppText>
        <TextInput
          style={styles.input}
          value={stressLevel}
          onChangeText={setStressLevel}
          keyboardType="numeric"
          placeholder="e.g. 4"
          placeholderTextColor={Colors.textTertiary}
        />

        {/* Mind state */}
        <AppText variant="smallBold" style={styles.fieldLabel}>Mind state at bedtime</AppText>
        <TouchableOpacity
          style={styles.dropdown}
          onPress={() => setShowMindState(!showMindState)}>
          <AppText variant="small" style={styles.dropdownText}>{mindState}</AppText>
          <AppText style={styles.dropdownArrow}>{showMindState ? '\u25B2' : '\u25BC'}</AppText>
        </TouchableOpacity>
        {showMindState && (
          <View style={styles.dropdownList}>
            {MIND_STATES.map((opt) => (
              <TouchableOpacity
                key={opt}
                style={[styles.dropdownItem, mindState === opt && styles.dropdownItemActive]}
                onPress={() => { setMindState(opt); setShowMindState(false); }}>
                <AppText variant="small" style={[
                  styles.dropdownItemText,
                  mindState === opt && {color: Colors.accent, fontWeight: '700'},
                ]}>{opt}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>

      {/* ─── 5. LAST NIGHT SUMMARY ────────────────────── */}
      <AppText variant="bodyBold" style={styles.sectionTitle}>
        Last night — {LAST_NIGHT.date}
      </AppText>

      {/* Score ring + key metrics */}
      <View style={styles.card}>
        <View style={styles.scoreSection}>
          {/* Score Ring - segmented arc */}
          <View style={styles.scoreRingOuter}>
            {/* Render 20 segments around the circle */}
            {Array.from({length: 20}).map((_, i) => {
              const filled = i < Math.round(scorePct * 20);
              const angle = (i / 20) * 360 - 90;
              const rad = (RING_SIZE - ms(8)) / 2;
              const x = RING_SIZE / 2 + rad * Math.cos((angle * Math.PI) / 180) - ms(4);
              const y = RING_SIZE / 2 + rad * Math.sin((angle * Math.PI) / 180) - ms(4);
              return (
                <View
                  key={i}
                  style={{
                    position: 'absolute',
                    left: x,
                    top: y,
                    width: ms(8),
                    height: ms(8),
                    borderRadius: ms(4),
                    backgroundColor: filled ? scoreColor : Colors.borderLight,
                  }}
                />
              );
            })}
            {/* Center content */}
            <AppText style={[styles.scoreNumber, {color: scoreColor}]}>
              {LAST_NIGHT.score}
            </AppText>
            <AppText variant="caption" style={styles.scoreLabel}>Score</AppText>
          </View>

          {/* Key metrics */}
          <View style={styles.keyMetrics}>
            <View style={styles.keyMetricRow}>
              <AppText variant="caption" style={styles.keyMetricLabel}>Total sleep</AppText>
              <AppText variant="smallBold" style={styles.keyMetricValue}>
                {fmtMin(LAST_NIGHT.totalMins)}
              </AppText>
            </View>
            <View style={styles.keyMetricRow}>
              <AppText variant="caption" style={styles.keyMetricLabel}>Sleep latency</AppText>
              <AppText variant="smallBold" style={styles.keyMetricValue}>
                {LAST_NIGHT.sleepLatency} min
              </AppText>
            </View>
            <View style={styles.keyMetricRow}>
              <AppText variant="caption" style={styles.keyMetricLabel}>Awakenings</AppText>
              <AppText variant="smallBold" style={styles.keyMetricValue}>
                {LAST_NIGHT.awakenings}
              </AppText>
            </View>
            <View style={styles.keyMetricRow}>
              <AppText variant="caption" style={styles.keyMetricLabel}>Sleep window</AppText>
              <AppText variant="smallBold" style={styles.keyMetricValue}>
                {LAST_NIGHT.bedtime} — {LAST_NIGHT.wake}
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* Hypnogram */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.cardTitle}>Hypnogram</AppText>
        <AppText variant="caption" style={styles.cardSub}>Sleep stage progression through the night</AppText>
        <View style={styles.hypnogramBar}>
          {LAST_NIGHT.hypnogram.map((stage, i) => {
            const colorKey = ['awake', 'rem', 'light', 'deep'][stage];
            return (
              <View
                key={i}
                style={[styles.hypnogramSeg, {backgroundColor: STAGE_COLORS[colorKey]}]}
              />
            );
          })}
        </View>
        <View style={styles.hypnogramLegend}>
          {['deep', 'rem', 'light', 'awake'].map((key) => (
            <View key={key} style={styles.legendItem}>
              <View style={[styles.legendDot, {backgroundColor: STAGE_COLORS[key]}]} />
              <AppText variant="caption" style={styles.legendText}>
                {key.charAt(0).toUpperCase() + key.slice(1)}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Stage breakdown */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.cardTitle}>Stage breakdown</AppText>
        {['deep', 'rem', 'light', 'awake'].map((key) => (
          <View key={key} style={styles.stageRow}>
            <View style={styles.stageHeader}>
              <View style={styles.stageNameRow}>
                <View style={[styles.stageDot, {backgroundColor: STAGE_COLORS[key]}]} />
                <AppText variant="smallBold" style={styles.stageName}>
                  {key.charAt(0).toUpperCase() + key.slice(1)}
                </AppText>
              </View>
              <AppText variant="small" style={styles.stageTime}>
                {fmtMin(LAST_NIGHT.stages[key])} ({stagePcts[key]}%)
              </AppText>
            </View>
            <View style={styles.progressTrack}>
              <View
                style={[
                  styles.progressFill,
                  {width: `${stagePcts[key]}%`, backgroundColor: STAGE_COLORS[key]},
                ]}
              />
            </View>
            <AppText variant="caption" style={styles.idealRange}>
              Ideal: {IDEAL_RANGES[key]}
            </AppText>
          </View>
        ))}
      </View>

      {/* Biometric signals */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.cardTitle}>Biometric signals</AppText>
        <View style={styles.bioGrid}>
          {[
            {label: 'HR avg', value: `${LAST_NIGHT.heartRateAvg} bpm`, ico: '\u2764\uFE0F'},
            {label: 'HR min', value: `${LAST_NIGHT.heartRateMin} bpm`, ico: '\uD83D\uDC93'},
            {label: 'HRV', value: `${LAST_NIGHT.hrv} ms`, ico: '\uD83D\uDCC9'},
            {label: 'SpO\u2082 avg', value: `${LAST_NIGHT.spo2avg}%`, ico: '\uD83E\uDE78'},
            {label: 'Breathing', value: `${LAST_NIGHT.breathRate}/min`, ico: '\uD83C\uDF2C\uFE0F'},
            {label: 'Temp dev', value: `${LAST_NIGHT.tempDeviation}\u00B0C`, ico: '\uD83C\uDF21\uFE0F'},
          ].map((m, i) => (
            <View key={i} style={styles.bioCell}>
              <AppText style={styles.bioIco}>{m.ico}</AppText>
              <AppText variant="smallBold" style={styles.bioValue}>{m.value}</AppText>
              <AppText variant="caption" style={styles.bioLabel}>{m.label}</AppText>
            </View>
          ))}
        </View>

        {/* Restlessness */}
        <View style={styles.restlessnessRow}>
          <AppText variant="caption" style={styles.bioLabel}>Restlessness index</AppText>
          <View style={styles.restlessnessBarTrack}>
            <View style={[styles.restlessnessBarFill, {width: `${Math.min(LAST_NIGHT.restlessness, 100)}%`}]} />
          </View>
          <AppText variant="smallBold" style={styles.bioValue}>{LAST_NIGHT.restlessness}</AppText>
        </View>
      </View>

      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

/* ── STYLES ──────────────────────────────────────────── */
const styles = StyleSheet.create({
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: s(16), paddingTop: vs(16)},

  /* Section title */
  sectionTitle: {
    fontSize: ms(14),
    color: Colors.textPrimary,
    marginBottom: vs(10),
    marginTop: vs(8),
  },

  /* Source selector */
  sourceGrid: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(16),
  },
  sourceCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    padding: s(10),
    alignItems: 'center',
  },
  sourceIco: {fontSize: ms(22), marginBottom: vs(4)},
  sourceName: {fontSize: ms(10), color: Colors.textPrimary, textAlign: 'center'},
  sourceSub: {fontSize: ms(8), color: Colors.textTertiary, textAlign: 'center', marginTop: vs(2)},

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  cardTitle: {fontSize: ms(14), color: Colors.textPrimary, marginBottom: vs(4)},
  cardSub: {fontSize: ms(11), color: Colors.textTertiary, marginBottom: vs(12)},

  /* Phone sensors */
  sensorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  sensorIcoWrap: {
    width: s(36),
    height: s(36),
    borderRadius: ms(10),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  sensorIco: {fontSize: ms(16)},
  sensorName: {fontSize: ms(12), color: Colors.textPrimary},
  sensorSub: {fontSize: ms(10), color: Colors.textTertiary},

  divider: {
    height: 0.5,
    backgroundColor: Colors.borderLight,
    marginVertical: vs(12),
  },

  /* Fields */
  fieldLabel: {fontSize: ms(11), color: Colors.textSecondary, marginBottom: vs(6), marginTop: vs(10)},
  input: {
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
    fontSize: ms(13),
    color: Colors.textPrimary,
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  dropdown: {
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  dropdownText: {fontSize: ms(13), color: Colors.textPrimary},
  dropdownArrow: {fontSize: ms(8), color: Colors.textTertiary},
  dropdownList: {
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    marginTop: vs(4),
    overflow: 'hidden',
  },
  dropdownItem: {paddingHorizontal: s(12), paddingVertical: vs(10)},
  dropdownItemActive: {backgroundColor: Colors.tealBg},
  dropdownItemText: {fontSize: ms(13), color: Colors.textPrimary},

  /* Charger */
  chargerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(10),
  },
  togglePill: {
    paddingHorizontal: s(16),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    backgroundColor: Colors.background,
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  togglePillActive: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.accent,
  },
  togglePillText: {fontSize: ms(12), color: Colors.textTertiary, fontWeight: '600'},
  togglePillTextActive: {color: Colors.accent},

  /* Device grid */
  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  deviceCard: {
    width: '48%',
    backgroundColor: Colors.background,
    borderRadius: ms(12),
    padding: s(12),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  deviceCardPaired: {
    borderColor: Colors.accent,
    backgroundColor: Colors.tealBg,
  },
  deviceIco: {fontSize: ms(24), marginBottom: vs(4)},
  deviceName: {fontSize: ms(11), color: Colors.textPrimary, textAlign: 'center'},
  deviceBrand: {fontSize: ms(9), color: Colors.textTertiary, marginBottom: vs(6)},
  pairedBadge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(12),
    backgroundColor: Colors.borderLight,
  },
  pairedBadgeActive: {backgroundColor: Colors.accent},
  pairedBadgeText: {fontSize: ms(9), color: Colors.textTertiary, fontWeight: '600'},
  pairedBadgeTextActive: {color: Colors.white},

  /* Med row */
  medRow: {flexDirection: 'row', marginTop: vs(4)},

  /* Alert */
  alertBanner: {
    borderRadius: ms(8),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    marginTop: vs(8),
  },

  /* Checklist */
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  checkRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  checkbox: {
    width: s(22),
    height: s(22),
    borderRadius: ms(6),
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  checkboxChecked: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  checkmark: {color: Colors.white, fontSize: ms(12), fontWeight: '700'},
  checkIco: {fontSize: ms(18), marginRight: s(10)},
  checkTitle: {fontSize: ms(12), color: Colors.textPrimary},
  checkTitleDone: {textDecorationLine: 'line-through', color: Colors.textTertiary},
  checkSub: {fontSize: ms(10), color: Colors.textTertiary, marginTop: vs(1)},

  /* Score ring */
  scoreSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreRingOuter: {
    width: RING_SIZE,
    height: RING_SIZE,
    marginRight: s(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNumber: {fontSize: ms(28), fontWeight: '800'},
  scoreLabel: {fontSize: ms(10), color: Colors.textTertiary, marginTop: vs(-2)},

  /* Key metrics */
  keyMetrics: {flex: 1},
  keyMetricRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(5),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  keyMetricLabel: {fontSize: ms(11), color: Colors.textTertiary},
  keyMetricValue: {fontSize: ms(12), color: Colors.textPrimary},

  /* Hypnogram */
  hypnogramBar: {
    flexDirection: 'row',
    height: vs(32),
    borderRadius: ms(6),
    overflow: 'hidden',
    marginBottom: vs(8),
  },
  hypnogramSeg: {flex: 1, marginHorizontal: 0.5},
  hypnogramLegend: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(14),
  },
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: s(4)},
  legendDot: {width: s(8), height: s(8), borderRadius: s(4)},
  legendText: {fontSize: ms(10), color: Colors.textSecondary},

  /* Stage breakdown */
  stageRow: {marginBottom: vs(12)},
  stageHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  stageNameRow: {flexDirection: 'row', alignItems: 'center', gap: s(6)},
  stageDot: {width: s(10), height: s(10), borderRadius: s(5)},
  stageName: {fontSize: ms(12), color: Colors.textPrimary},
  stageTime: {fontSize: ms(11), color: Colors.textSecondary},
  progressTrack: {
    height: vs(6),
    borderRadius: ms(3),
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  progressFill: {height: '100%', borderRadius: ms(3)},
  idealRange: {fontSize: ms(9), color: Colors.textTertiary, marginTop: vs(3)},

  /* Biometric signals */
  bioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginTop: vs(8),
  },
  bioCell: {
    width: '31%',
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    padding: s(10),
    alignItems: 'center',
  },
  bioIco: {fontSize: ms(18), marginBottom: vs(4)},
  bioValue: {fontSize: ms(13), color: Colors.textPrimary},
  bioLabel: {fontSize: ms(10), color: Colors.textTertiary, marginTop: vs(2)},

  /* Restlessness */
  restlessnessRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(12),
    gap: s(8),
  },
  restlessnessBarTrack: {
    flex: 1,
    height: vs(6),
    borderRadius: ms(3),
    backgroundColor: Colors.background,
    overflow: 'hidden',
  },
  restlessnessBarFill: {
    height: '100%',
    borderRadius: ms(3),
    backgroundColor: Colors.amber,
  },
});

export default TonightTab;
