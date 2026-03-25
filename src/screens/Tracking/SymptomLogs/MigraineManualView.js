import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Ellipse, Circle as SvgCircle, Path, Line as SvgLine, Text as SvgText} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

// ─── Constants & Data ───────────────────────────────────────────────────

const EPISODE_STATUSES = [
  'New episode starting now',
  'Episode in progress',
  'Logging past episode',
  'Episode ended',
];

const LOCATION_CHIPS = ['Home', 'Work', 'Commute', 'Other'];

const HEAD_REGIONS = [
  {id: 'leftTemporal', label: 'Left temporal', desc: 'Classic migraine'},
  {id: 'rightTemporal', label: 'Right temporal', desc: ''},
  {id: 'frontal', label: 'Frontal', desc: 'Forehead band'},
  {id: 'occipital', label: 'Occipital', desc: 'Back of head'},
  {id: 'behindEyes', label: 'Behind eyes', desc: 'Orbital / retro'},
  {id: 'bilateral', label: 'Bilateral', desc: 'Whole head'},
];

const PAIN_CHARACTERS = [
  {name: 'Pulsating', icon: 'heart-outline', desc: 'Rhythmic throbbing'},
  {name: 'Stabbing', icon: 'flash-outline', desc: 'Sharp piercing jabs'},
  {name: 'Pressure', icon: 'lock-closed-outline', desc: 'Tight band feeling'},
  {name: 'Burning', icon: 'flame-outline', desc: 'Hot searing pain'},
  {name: 'Wave-like', icon: 'water-outline', desc: 'Rises and falls'},
  {name: 'Splitting', icon: 'cut-outline', desc: 'Head about to split'},
];

const PRODROME_TAGS = [
  'Fatigue', 'Yawning', 'Food cravings', 'Irritability', 'Brain fog',
  'Thirst', 'Sleep change', 'Mild nausea', 'Neck stiffness',
  'Light sensitivity', 'Smell sensitivity', 'Mood elevation', 'Excessive yawning',
];
const PRODROME_ACTIVE = new Set(['Fatigue', 'Yawning', 'Sleep change']);

const AURA_VISUAL = [
  'Scintillating scotoma', 'Blind spot', 'Flashing lights', 'Coloured lights',
  'Tunnel vision', 'Visual distortion', 'Blurred vision',
];
const AURA_VISUAL_ACTIVE = new Set(['Scintillating scotoma', 'Blind spot']);

const AURA_SENSORY = ['Pins and needles', 'Numbness', 'Tingling'];
const AURA_MOTOR = [
  'Difficulty words', 'Slurred speech', 'Arm weakness', 'Hearing changes', 'Vertigo',
];
const AURA_DURATION_CHIPS = ['<5 min', '5-20 min', '20-60 min', '>60 min'];

const HEADACHE_SYMPTOMS = [
  'Nausea', 'Vomiting', 'Photophobia', 'Phonophobia', 'Osmophobia',
  'Vertigo', 'Flushing', 'Sweating', 'Eye watering', 'Nasal congestion',
  'Neck pain', 'Fatigue',
];
const HEADACHE_SYMPTOMS_ACTIVE = new Set(['Nausea', 'Photophobia', 'Fatigue']);

const WORSENED_BY = [
  'Routine activity', 'Loud sounds', 'Bright light', 'Car/movement', 'Strong smells', 'Bending',
];
const WORSENED_ACTIVE = new Set(['Routine activity', 'Bright light']);

const DISABILITY_LEVELS = [
  'Functioning normally',
  'Impaired but managing',
  'Bed rest needed',
  'Completely incapacitated',
];

const TRIGGERS = [
  'Poor sleep', 'Stress', 'Let-down', 'Alcohol', 'Too much caffeine',
  'Caffeine withdrawal', 'Skipped meal', 'Aged cheese', 'Chocolate',
  'Weather change', 'Barometric pressure', 'Bright light', 'Screen time',
  'Hormonal', 'Blood glucose fluctuation', 'Medication timing', 'Exercise',
  'Strong smells', 'Temperature change', 'Travel', 'Unknown',
];
const TRIGGERS_ACTIVE = new Set(['Stress', 'Skipped meal', 'Blood glucose fluctuation']);

const MEDICATIONS = [
  {
    name: 'Sumatriptan 50 mg',
    icon: 'medical-outline',
    note: 'First-line acute \u00B7 Caution with BP 140/90',
    status: 'action',
    statusLabel: 'Log 6:20 AM',
  },
  {
    name: 'Paracetamol',
    icon: 'medical-outline',
    note: 'Safe \u00B7 No BP interaction',
    status: 'green',
    statusLabel: 'Logged \u2713 6:25 AM',
  },
  {
    name: 'Naproxen / Ibuprofen',
    icon: 'medical-outline',
    note: 'NSAIDs interact with Amlodipine',
    status: 'amber',
    statusLabel: 'Caution',
  },
  {
    name: 'Metoclopramide',
    icon: 'medical-outline',
    note: 'Anti-nausea \u00B7 Speeds absorption',
    status: 'action',
    statusLabel: 'Log',
  },
  {
    name: 'Ergotamine',
    icon: 'close-circle-outline',
    note: 'Contraindicated with HTN',
    status: 'red',
    statusLabel: 'Avoid \u2014 HTN',
  },
];

const TIMELINE_ROWS = [
  {time: '11:30 PM 23 Mar', dot: Colors.accent, label: 'Prodrome noticed', badge: '~8h before pain', badgeBg: Colors.tealBg, badgeText: Colors.tealText},
  {time: '6:05 AM', dot: Colors.amber, label: 'Aura onset', badge: 'Visual aura \u00B7 20 min', badgeBg: Colors.amberBg, badgeText: Colors.amberText},
  {time: '6:15 AM', dot: Colors.red, label: 'Headache started', badge: 'Active now \u00B7 67 min', badgeBg: Colors.redBg, badgeText: Colors.redText},
  {time: 'Pending', dot: '#9ca3af', label: 'Postdrome \u00B7 pending', badge: '', badgeBg: 'transparent', badgeText: '#9ca3af'},
];

const IMPACT_CHIPS = [
  'Reduced productivity', 'Stayed home', 'Bed rest', 'Cancelled plans', 'Aarav school drop missed',
];

const SLEEP_OPTIONS = ['Excellent (7h+)', 'Fair (5-6h)', 'Poor (<5h)', 'Disrupted'];
const MENSTRUAL_OPTIONS = ['Day 1-2', 'Perimenstrual', 'Mid-cycle', 'Not related'];
const WEATHER_OPTIONS = ['Rainy', 'Bright sunshine', 'Temp change', 'Normal'];

const ATTACK_HISTORY = [
  {date: 'Today', pain: '6/10', dur: '67m+', trigger: 'Stress', meds: 'Para \u2713', medsColor: Colors.accent, highlight: true},
  {date: '15 Mar', pain: '7/10', dur: '8h', trigger: 'Sleep', meds: 'Trip \u2713', medsColor: Colors.accent, highlight: false},
  {date: '2 Mar', pain: '5/10', dur: '5h', trigger: 'Glucose', meds: 'Para \u2713', medsColor: Colors.accent, highlight: false},
  {date: '22 Feb', pain: '8/10', dur: '18h', trigger: 'Period', meds: 'Trip+Para', medsColor: Colors.redText, highlight: false},
  {date: '10 Feb', pain: '4/10', dur: '3h', trigger: 'Screen', meds: 'Para \u2713', medsColor: Colors.accent, highlight: false},
];

// ─── Pain bar colors ─────────────────────────────────────────────────────
const BAR_COLORS = [
  '#4CAF50', '#66BB6A', '#8BC34A', '#CDDC39', '#FFEB3B',
  '#FFC107', '#FF9800', '#FF5722', '#F44336', '#D32F2F', '#B71C1C',
];

// ─── Component ───────────────────────────────────────────────────────────

const MigraineManualView = () => {
  const [episodeStatus, setEpisodeStatus] = useState('Episode in progress');
  const [locationChip, setLocationChip] = useState('Home');
  const [painLevel, setPainLevel] = useState(6);
  const [activeRegions, setActiveRegions] = useState(new Set(['leftTemporal']));
  const [activePainChar, setActivePainChar] = useState(new Set(['Pulsating']));
  const [prodromeActive, setProdromeActive] = useState(new Set(PRODROME_ACTIVE));
  const [auraVisualActive, setAuraVisualActive] = useState(new Set(AURA_VISUAL_ACTIVE));
  const [auraSensoryActive, setAuraSensoryActive] = useState(new Set());
  const [auraMotorActive, setAuraMotorActive] = useState(new Set());
  const [auraDuration, setAuraDuration] = useState('20-60 min');
  const [headacheSymptomsActive, setHeadacheSymptomsActive] = useState(new Set(HEADACHE_SYMPTOMS_ACTIVE));
  const [worsenedActive, setWorsenedActive] = useState(new Set(WORSENED_ACTIVE));
  const [disabilityLevel, setDisabilityLevel] = useState('Impaired but managing');
  const [triggersActive, setTriggersActive] = useState(new Set(TRIGGERS_ACTIVE));
  const [impactActive, setImpactActive] = useState(new Set(['Reduced productivity']));
  const [sleepChoice, setSleepChoice] = useState('Fair (5-6h)');
  const [menstrualChoice, setMenstrualChoice] = useState('Not related');
  const [weatherChoice, setWeatherChoice] = useState('Normal');
  const [notes, setNotes] = useState('');

  // ─── helpers ─────────────────────────────────────────────────────────
  const toggleSet = (setter, value) => {
    setter(prev => {
      const next = new Set(prev);
      next.has(value) ? next.delete(value) : next.add(value);
      return next;
    });
  };

  const renderChip = (label, active, onPress, activeColor = Colors.primary, activeBg = Colors.tealBg) => (
    <TouchableOpacity
      key={label}
      onPress={onPress}
      style={[
        styles.chip,
        active && {backgroundColor: activeBg, borderColor: activeColor},
      ]}>
      <AppText
        variant="small"
        style={{color: active ? activeColor : Colors.textSecondary}}>
        {label}
      </AppText>
    </TouchableOpacity>
  );

  const renderTag = (label, active, onPress, activeColor = Colors.primary, activeBg = Colors.tealBg) => (
    <TouchableOpacity
      key={label}
      onPress={onPress}
      style={[
        styles.tag,
        active && {backgroundColor: activeBg, borderColor: activeColor},
      ]}>
      <AppText
        variant="small"
        style={{color: active ? activeColor : Colors.textSecondary}}>
        {label}
      </AppText>
    </TouchableOpacity>
  );

  // ─── RENDER ──────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>

      {/* ── 1. Episode Status ──────────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>EPISODE STATUS</AppText>
      <View style={styles.chipRow}>
        {EPISODE_STATUSES.map(st =>
          renderChip(st, episodeStatus === st, () => setEpisodeStatus(st)),
        )}
      </View>

      {/* ── 2. Onset Time & Location ───────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>ONSET TIME & LOCATION</AppText>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={{flex: 1}}>
            <AppText variant="caption" style={{color: Colors.textSecondary}}>Started at</AppText>
            <AppText variant="bodyBold" style={{color: Colors.redText, fontSize: ms(20), marginTop: vs(2)}}>6:15 AM</AppText>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <AppText variant="caption" style={{color: Colors.textSecondary}}>Duration</AppText>
            <AppText variant="bodyBold" style={{color: Colors.redText, fontSize: ms(20), marginTop: vs(2)}}>67 min</AppText>
            <AppText variant="small" style={{color: Colors.redText, marginTop: vs(1)}}>Ongoing {'\u00B7'} Live</AppText>
          </View>
        </View>
        <View style={[styles.divider, {marginVertical: vs(10)}]} />
        <AppText variant="caption" style={{color: Colors.textSecondary, marginBottom: vs(6)}}>Where?</AppText>
        <View style={styles.chipRow}>
          {LOCATION_CHIPS.map(loc =>
            renderChip(loc, locationChip === loc, () => setLocationChip(loc)),
          )}
        </View>
      </View>

      {/* ── 3. Pain Intensity NRS 0-10 ─────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>PAIN INTENSITY</AppText>
      <AppText variant="caption" style={{color: Colors.textSecondary, marginBottom: vs(8), paddingHorizontal: s(4)}}>
        Numerical Rating Scale 0{'\u2013'}10
      </AppText>
      <View style={styles.card}>
        <View style={styles.barRow}>
          {BAR_COLORS.map((color, i) => {
            const barH = vs(18) + vs(i * 4);
            const isActive = painLevel === i;
            return (
              <TouchableOpacity
                key={i}
                onPress={() => setPainLevel(i)}
                style={styles.barCol}>
                <View
                  style={[
                    styles.bar,
                    {
                      height: barH,
                      backgroundColor: color,
                      opacity: isActive ? 1 : 0.4,
                      borderWidth: isActive ? 2 : 0,
                      borderColor: isActive ? Colors.textPrimary : 'transparent',
                      borderRadius: ms(4),
                    },
                  ]}
                />
                <AppText
                  variant="small"
                  style={{
                    marginTop: vs(4),
                    fontWeight: isActive ? '700' : '400',
                    color: isActive ? Colors.textPrimary : Colors.textSecondary,
                  }}>
                  {i}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
        <AppText variant="small" style={{color: Colors.textTertiary, marginTop: vs(10), textAlign: 'center'}}>
          0 = No pain {'  \u00B7  '} 5 = Can function with difficulty {'  \u00B7  '} 10 = Worst imaginable
        </AppText>
      </View>

      {/* ── 4. Head Pain Map ───────────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>PAIN LOCATION</AppText>
      <AppText variant="caption" style={{color: Colors.textSecondary, marginBottom: vs(8), paddingHorizontal: s(4)}}>
        Select all affected areas
      </AppText>
      <View style={styles.card}>
        <View style={styles.row}>
          {/* SVG head outline */}
          <View style={{width: s(110), alignItems: 'center', marginRight: s(12)}}>
            <Svg width={s(100)} height={vs(130)} viewBox="0 0 100 130">
              {/* Head */}
              <Ellipse cx="50" cy="55" rx="40" ry="50" stroke="#9ca3af" strokeWidth="1.5" fill="#f9fafb" />
              {/* Left temporal highlight */}
              {activeRegions.has('leftTemporal') && (
                <Ellipse cx="18" cy="50" rx="14" ry="22" fill={Colors.red} opacity={0.3} />
              )}
              {/* Eyes */}
              <Ellipse cx="35" cy="48" rx="6" ry="3.5" stroke="#6b7280" strokeWidth="1" fill="none" />
              <Ellipse cx="65" cy="48" rx="6" ry="3.5" stroke="#6b7280" strokeWidth="1" fill="none" />
              {/* Nose */}
              <Path d="M50 55 L46 68 L54 68 Z" stroke="#6b7280" strokeWidth="1" fill="none" />
              {/* Mouth */}
              <Path d="M40 78 Q50 86 60 78" stroke="#6b7280" strokeWidth="1" fill="none" />
              {/* Neck */}
              <SvgLine x1="38" y1="100" x2="38" y2="125" stroke="#9ca3af" strokeWidth="1.2" />
              <SvgLine x1="62" y1="100" x2="62" y2="125" stroke="#9ca3af" strokeWidth="1.2" />
            </Svg>
          </View>

          {/* Region grid 2x3 */}
          <View style={{flex: 1}}>
            <View style={styles.regionGrid}>
              {HEAD_REGIONS.map(r => {
                const active = activeRegions.has(r.id);
                return (
                  <TouchableOpacity
                    key={r.id}
                    onPress={() => toggleSet(setActiveRegions, r.id)}
                    style={[
                      styles.regionCard,
                      active && {borderColor: Colors.red, backgroundColor: Colors.redBg},
                    ]}>
                    <AppText variant="small" style={{fontWeight: '600', color: active ? Colors.redText : Colors.textPrimary}}>
                      {r.label}
                    </AppText>
                    {r.desc ? (
                      <AppText variant="small" style={{color: active ? Colors.redText : Colors.textTertiary, fontSize: ms(9), marginTop: vs(1)}}>
                        {r.desc}
                      </AppText>
                    ) : null}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>
      </View>

      {/* ── 5. Pain Character ──────────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>PAIN CHARACTER</AppText>
      <View style={styles.card}>
        <View style={styles.charGrid}>
          {PAIN_CHARACTERS.map(pc => {
            const active = activePainChar.has(pc.name);
            return (
              <TouchableOpacity
                key={pc.name}
                onPress={() => toggleSet(setActivePainChar, pc.name)}
                style={[
                  styles.charItem,
                  active && {borderColor: Colors.primary, backgroundColor: Colors.tealBg},
                ]}>
                <Icon name={pc.icon} size={ms(20)} color={active ? Colors.primary : Colors.textSecondary} />
                <AppText variant="small" style={{fontWeight: '600', marginTop: vs(4), color: active ? Colors.primary : Colors.textPrimary}}>
                  {pc.name}
                </AppText>
                <AppText variant="small" style={{color: active ? Colors.tealText : Colors.textTertiary, fontSize: ms(9), marginTop: vs(1)}}>
                  {pc.desc}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── 6. Phase 1: Prodrome ───────────────────────────────────── */}
      <View style={styles.card}>
        <View style={[styles.row, {alignItems: 'center', marginBottom: vs(10)}]}>
          <View style={[styles.dot, {backgroundColor: Colors.accent}]} />
          <AppText variant="bodyBold" style={{flex: 1, marginLeft: s(8)}}>
            Phase 1 {'\u00B7'} Prodrome {'\u00B7'} Warning signs
          </AppText>
          <AppText variant="small" style={{color: Colors.accent}}>Noticed {'\u2713'}</AppText>
        </View>
        <View style={styles.chipRow}>
          {PRODROME_TAGS.map(t =>
            renderTag(
              t,
              prodromeActive.has(t),
              () => toggleSet(setProdromeActive, t),
              Colors.accent,
              Colors.tealBg,
            ),
          )}
        </View>
      </View>

      {/* ── 7. Phase 2: Aura ───────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={[styles.row, {alignItems: 'center', marginBottom: vs(10)}]}>
          <View style={[styles.dot, {backgroundColor: Colors.amber}]} />
          <AppText variant="bodyBold" style={{flex: 1, marginLeft: s(8)}}>
            Phase 2 {'\u00B7'} Aura {'\u00B7'} Neurological symptoms
          </AppText>
          <AppText variant="small" style={{color: Colors.amber}}>In progress</AppText>
        </View>

        {/* Visual */}
        <AppText variant="caption" style={styles.subLabel}>VISUAL</AppText>
        <View style={styles.chipRow}>
          {AURA_VISUAL.map(t =>
            renderTag(t, auraVisualActive.has(t), () => toggleSet(setAuraVisualActive, t), Colors.amberText, Colors.amberBg),
          )}
        </View>

        {/* Sensory */}
        <AppText variant="caption" style={[styles.subLabel, {marginTop: vs(10)}]}>SENSORY</AppText>
        <View style={styles.chipRow}>
          {AURA_SENSORY.map(t =>
            renderTag(t, auraSensoryActive.has(t), () => toggleSet(setAuraSensoryActive, t), Colors.amberText, Colors.amberBg),
          )}
        </View>

        {/* Motor / Speech */}
        <AppText variant="caption" style={[styles.subLabel, {marginTop: vs(10)}]}>MOTOR / SPEECH</AppText>
        <View style={styles.chipRow}>
          {AURA_MOTOR.map(t =>
            renderTag(t, auraMotorActive.has(t), () => toggleSet(setAuraMotorActive, t), Colors.amberText, Colors.amberBg),
          )}
        </View>

        {/* Aura duration */}
        <AppText variant="caption" style={[styles.subLabel, {marginTop: vs(10)}]}>AURA DURATION</AppText>
        <View style={styles.chipRow}>
          {AURA_DURATION_CHIPS.map(d =>
            renderChip(d, auraDuration === d, () => setAuraDuration(d), Colors.amberText, Colors.amberBg),
          )}
        </View>

        {/* Warning */}
        <View style={[styles.insightBox, {backgroundColor: Colors.amberBg, marginTop: vs(12)}]}>
          <Icon name="warning-outline" size={ms(16)} color={Colors.amberText} />
          <AppText variant="small" style={{color: Colors.amberText, flex: 1, marginLeft: s(8)}}>
            Aura &gt;60 minutes or motor weakness {'\u2192'} seek urgent evaluation. BP 140/90 increases risk.
          </AppText>
        </View>
      </View>

      {/* ── 8. Phase 3: Headache ───────────────────────────────────── */}
      <View style={styles.card}>
        <View style={[styles.row, {alignItems: 'center', marginBottom: vs(10)}]}>
          <View style={[styles.dot, {backgroundColor: Colors.red}]} />
          <AppText variant="bodyBold" style={{flex: 1, marginLeft: s(8)}}>
            Phase 3 {'\u00B7'} Headache {'\u00B7'} Main pain phase
          </AppText>
          <AppText variant="small" style={{color: Colors.red}}>Active now</AppText>
        </View>

        {/* Associated symptoms */}
        <View style={styles.chipRow}>
          {HEADACHE_SYMPTOMS.map(t =>
            renderTag(t, headacheSymptomsActive.has(t), () => toggleSet(setHeadacheSymptomsActive, t), Colors.redText, Colors.redBg),
          )}
        </View>

        {/* Worsened by */}
        <AppText variant="caption" style={[styles.subLabel, {marginTop: vs(10)}]}>WORSENED BY</AppText>
        <View style={styles.chipRow}>
          {WORSENED_BY.map(t =>
            renderTag(t, worsenedActive.has(t), () => toggleSet(setWorsenedActive, t), Colors.redText, Colors.redBg),
          )}
        </View>

        {/* Disability level */}
        <AppText variant="caption" style={[styles.subLabel, {marginTop: vs(10)}]}>DISABILITY LEVEL</AppText>
        <View style={styles.chipRow}>
          {DISABILITY_LEVELS.map(d =>
            renderChip(d, disabilityLevel === d, () => setDisabilityLevel(d), Colors.redText, Colors.redBg),
          )}
        </View>
      </View>

      {/* ── 9. Triggers ────────────────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>POTENTIAL TRIGGERS</AppText>
      <View style={styles.card}>
        <View style={styles.chipRow}>
          {TRIGGERS.map(t =>
            renderTag(t, triggersActive.has(t), () => toggleSet(setTriggersActive, t), Colors.amberText, Colors.amberBg),
          )}
        </View>

        <View style={[styles.insightBox, {backgroundColor: Colors.amberBg, marginTop: vs(12)}]}>
          <Icon name="analytics-outline" size={ms(16)} color={Colors.amberText} />
          <AppText variant="small" style={{color: Colors.amberText, flex: 1, marginLeft: s(8)}}>
            Blood glucose and migraine: glucose today 8.4 mmol/L — hyperglycaemia increases neurological inflammation and may lower migraine threshold. Consider tighter glycaemic management.
          </AppText>
        </View>
      </View>

      {/* ── 10. Medication Log ─────────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>MEDICATIONS TAKEN</AppText>
      <View style={styles.card}>
        {/* MOH warning */}
        <View style={[styles.insightBox, {backgroundColor: Colors.amberBg, marginBottom: vs(12)}]}>
          <Icon name="medication-outline" size={ms(16)} color={Colors.amberText} />
          <AppText variant="small" style={{color: Colors.amberText, flex: 1, marginLeft: s(8)}}>
            Medication overuse risk: using acute meds &gt;10 days/month can cause rebound headaches. This month: 4 of 8 days {'\u2014'} currently safe. Limit: 10 days/month.
          </AppText>
        </View>

        {MEDICATIONS.map((med, idx) => (
          <View key={idx} style={[styles.medRow, idx < MEDICATIONS.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: '#d1d5db'}]}>
            <Icon
              name={med.icon}
              size={ms(20)}
              color={med.status === 'red' ? Colors.redText : Colors.textSecondary}
              style={{marginRight: s(10)}}
            />
            <View style={{flex: 1}}>
              <AppText variant="body" style={{fontWeight: '600'}}>{med.name}</AppText>
              <AppText variant="small" style={{color: Colors.textSecondary, marginTop: vs(1)}}>{med.note}</AppText>
            </View>
            <View
              style={[
                styles.medBadge,
                med.status === 'green' && {backgroundColor: Colors.tealBg},
                med.status === 'amber' && {backgroundColor: Colors.amberBg},
                med.status === 'red' && {backgroundColor: Colors.redBg},
                med.status === 'action' && {backgroundColor: Colors.tealBg},
              ]}>
              <AppText
                variant="small"
                style={{
                  fontWeight: '600',
                  color:
                    med.status === 'green' ? Colors.accent :
                    med.status === 'amber' ? Colors.amberText :
                    med.status === 'red' ? Colors.redText :
                    Colors.primary,
                }}>
                {med.statusLabel}
              </AppText>
            </View>
          </View>
        ))}

        {/* Amlodipine note */}
        <View style={[styles.insightBox, {backgroundColor: Colors.purpleBg, marginTop: vs(12)}]}>
          <Icon name="information-circle-outline" size={ms(16)} color={Colors.purpleText} />
          <AppText variant="small" style={{color: Colors.purpleText, flex: 1, marginLeft: s(8)}}>
            Amlodipine note: some evidence for migraine prevention benefit via calcium-channel blockade. Discuss dual-purpose use at next review.
          </AppText>
        </View>
      </View>

      {/* ── 11. Episode Timeline ───────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>EPISODE TIMELINE</AppText>
      <View style={styles.card}>
        {TIMELINE_ROWS.map((row, idx) => (
          <View key={idx} style={styles.timelineRow}>
            {/* Dot + connecting line */}
            <View style={styles.timelineDotCol}>
              <View style={[styles.timelineDot, {backgroundColor: row.dot}]} />
              {idx < TIMELINE_ROWS.length - 1 && (
                <View style={styles.timelineLine} />
              )}
            </View>

            {/* Content */}
            <View style={styles.timelineContent}>
              <AppText variant="small" style={{color: Colors.textTertiary}}>{row.time}</AppText>
              <AppText variant="body" style={{fontWeight: '600', marginTop: vs(2)}}>{row.label}</AppText>
              {row.badge ? (
                <View style={[styles.timelineBadge, {backgroundColor: row.badgeBg}]}>
                  <AppText variant="small" style={{color: row.badgeText}}>{row.badge}</AppText>
                </View>
              ) : null}
            </View>
          </View>
        ))}

        <TouchableOpacity style={{alignSelf: 'center', marginTop: vs(10)}}>
          <AppText variant="body" style={{color: Colors.red, fontWeight: '600'}}>Log end time / resolution</AppText>
        </TouchableOpacity>
      </View>

      {/* ── 12. Functional Impact ──────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>FUNCTIONAL IMPACT</AppText>
      <View style={styles.card}>
        <View style={styles.metricRow}>
          <View style={[styles.metricBox, {borderColor: Colors.redBg}]}>
            <AppText variant="bodyBold" style={{color: Colors.redText, fontSize: ms(22)}}>3</AppText>
            <AppText variant="small" style={{color: Colors.textSecondary, marginTop: vs(2)}}>Days affected</AppText>
          </View>
          <View style={[styles.metricBox, {borderColor: Colors.amberBg}]}>
            <AppText variant="bodyBold" style={{color: Colors.amberText, fontSize: ms(22)}}>1.5h</AppText>
            <AppText variant="small" style={{color: Colors.textSecondary, marginTop: vs(2)}}>Work lost</AppText>
          </View>
          <View style={[styles.metricBox, {borderColor: '#e5e7eb'}]}>
            <AppText variant="bodyBold" style={{color: Colors.textSecondary, fontSize: ms(22)}}>8</AppText>
            <AppText variant="small" style={{color: Colors.textSecondary, marginTop: vs(2)}}>Total migraine days</AppText>
          </View>
        </View>

        <View style={[styles.chipRow, {marginTop: vs(10)}]}>
          {IMPACT_CHIPS.map(c =>
            renderTag(c, impactActive.has(c), () => toggleSet(setImpactActive, c)),
          )}
        </View>
      </View>

      {/* ── 13. Additional Context ─────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>ADDITIONAL CONTEXT</AppText>
      <View style={styles.card}>
        {/* Sleep */}
        <View style={styles.contextSection}>
          <AppText variant="caption" style={styles.subLabel}>SLEEP</AppText>
          <View style={styles.chipRow}>
            {SLEEP_OPTIONS.map(opt =>
              renderChip(opt, sleepChoice === opt, () => setSleepChoice(opt)),
            )}
          </View>
        </View>

        <View style={styles.divider} />

        {/* Menstrual cycle */}
        <View style={styles.contextSection}>
          <AppText variant="caption" style={styles.subLabel}>MENSTRUAL CYCLE</AppText>
          <View style={styles.chipRow}>
            {MENSTRUAL_OPTIONS.map(opt =>
              renderChip(opt, menstrualChoice === opt, () => setMenstrualChoice(opt)),
            )}
          </View>
          <AppText variant="small" style={{color: Colors.textTertiary, marginTop: vs(4)}}>
            Menstrual migraine typically occurs Day 1{'\u2013'}2 or perimenstrual window.
          </AppText>
        </View>

        <View style={styles.divider} />

        {/* Weather */}
        <View style={styles.contextSection}>
          <AppText variant="caption" style={styles.subLabel}>WEATHER</AppText>
          <View style={styles.chipRow}>
            {WEATHER_OPTIONS.map(opt =>
              renderChip(opt, weatherChoice === opt, () => setWeatherChoice(opt)),
            )}
          </View>
        </View>
      </View>

      {/* ── 14. Attack History ─────────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>ATTACK HISTORY {'\u00B7'} 2026</AppText>
      <View style={styles.card}>
        {/* Header row */}
        <View style={styles.tableHeaderRow}>
          <AppText variant="small" style={[styles.tableCell, {flex: 1.3, fontWeight: '700'}]}>Date</AppText>
          <AppText variant="small" style={[styles.tableCell, {flex: 0.8, fontWeight: '700'}]}>Pain</AppText>
          <AppText variant="small" style={[styles.tableCell, {flex: 0.8, fontWeight: '700'}]}>Dur</AppText>
          <AppText variant="small" style={[styles.tableCell, {flex: 1, fontWeight: '700'}]}>Trigger</AppText>
          <AppText variant="small" style={[styles.tableCell, {flex: 1, fontWeight: '700'}]}>Meds</AppText>
        </View>

        {ATTACK_HISTORY.map((row, idx) => {
          const painNum = parseInt(row.pain, 10);
          const painColor = painNum >= 8 ? Colors.redDark : painNum >= 6 ? Colors.redText : Colors.textPrimary;
          return (
            <View
              key={idx}
              style={[
                styles.tableRow,
                row.highlight && {backgroundColor: Colors.redBg},
              ]}>
              <AppText variant="small" style={[styles.tableCell, {flex: 1.3, fontWeight: row.highlight ? '700' : '400'}]}>
                {row.date}
              </AppText>
              <AppText variant="small" style={[styles.tableCell, {flex: 0.8, color: painColor, fontWeight: '600'}]}>
                {row.pain}
              </AppText>
              <AppText variant="small" style={[styles.tableCell, {flex: 0.8}]}>{row.dur}</AppText>
              <AppText variant="small" style={[styles.tableCell, {flex: 1}]}>{row.trigger}</AppText>
              <AppText variant="small" style={[styles.tableCell, {flex: 1, color: row.medsColor, fontWeight: '600'}]}>
                {row.meds}
              </AppText>
            </View>
          );
        })}

        <AppText variant="small" style={{color: Colors.textSecondary, marginTop: vs(10), textAlign: 'center'}}>
          8 migraine days this month {'\u00B7'} Avg 2.3/month {'\u00B7'} Stress + sleep top triggers
        </AppText>
      </View>

      {/* ── 15. Notes ──────────────────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>NOTE</AppText>
      <View style={styles.card}>
        <TextInput
          style={styles.textInput}
          multiline
          placeholder="Add notes about this migraine episode..."
          placeholderTextColor={Colors.textTertiary}
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />
      </View>

      {/* ── 16. Prophylaxis Insight ────────────────────────────────── */}
      <View style={[styles.insightBox, {backgroundColor: Colors.purpleBg, marginTop: vs(8), marginHorizontal: 0}]}>
        <Icon name="bulb-outline" size={ms(16)} color={Colors.purpleText} />
        <AppText variant="small" style={{color: Colors.purpleText, flex: 1, marginLeft: s(8)}}>
          With 8 migraine days/month, preventive treatment is indicated per guidelines. Options to discuss: Topiramate, Amitriptyline, Propranolol (also helps BP). CGRP inhibitors if first-line fails. Add to Apr 4 agenda.
        </AppText>
      </View>

    </View>
  );
};

// ─── Styles ──────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: s(16),
    paddingBottom: vs(24),
  },
  sectionHeading: {
    marginTop: vs(20),
    marginBottom: vs(8),
    paddingHorizontal: s(4),
  },
  card: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(14),
    backgroundColor: Colors.white,
    marginBottom: vs(10),
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(6),
  },
  chip: {
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: Colors.white,
  },
  tag: {
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: '#d1d5db',
    backgroundColor: Colors.white,
  },
  divider: {
    height: 0.5,
    backgroundColor: '#d1d5db',
    marginVertical: vs(8),
  },
  dot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
  },
  subLabel: {
    color: Colors.textSecondary,
    fontWeight: '600',
    marginBottom: vs(6),
    letterSpacing: 0.5,
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: ms(12),
    borderRadius: ms(10),
  },

  // Pain bars
  barRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-between',
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  bar: {
    width: s(18),
  },

  // Head regions
  regionGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(6),
  },
  regionCard: {
    width: '48%',
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(8),
    padding: ms(8),
    alignItems: 'center',
  },

  // Pain character grid
  charGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(8),
  },
  charItem: {
    width: '30%',
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(10),
    padding: ms(10),
    alignItems: 'center',
  },

  // Medication row
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  medBadge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(8),
    marginLeft: s(8),
  },

  // Timeline
  timelineRow: {
    flexDirection: 'row',
    minHeight: vs(60),
  },
  timelineDotCol: {
    width: s(24),
    alignItems: 'center',
  },
  timelineDot: {
    width: ms(12),
    height: ms(12),
    borderRadius: ms(6),
    marginTop: vs(2),
  },
  timelineLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: '#d1d5db',
    marginTop: vs(4),
  },
  timelineContent: {
    flex: 1,
    marginLeft: s(10),
    paddingBottom: vs(12),
  },
  timelineBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(6),
    marginTop: vs(4),
  },

  // Metrics
  metricRow: {
    flexDirection: 'row',
    gap: ms(8),
  },
  metricBox: {
    flex: 1,
    borderWidth: 1,
    borderRadius: ms(10),
    padding: ms(10),
    alignItems: 'center',
  },

  // Context
  contextSection: {
    paddingVertical: vs(6),
  },

  // Table
  tableHeaderRow: {
    flexDirection: 'row',
    paddingBottom: vs(6),
    borderBottomWidth: 0.5,
    borderBottomColor: '#d1d5db',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: vs(8),
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
    borderRadius: ms(4),
  },
  tableCell: {
    paddingHorizontal: s(2),
  },

  // Notes
  textInput: {
    minHeight: vs(80),
    fontSize: ms(14),
    color: Colors.textPrimary,
    padding: 0,
  },
});

export default MigraineManualView;
