import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Circle as SvgCircle, Text as SvgText, Rect, Line as SvgLine} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

// ─── Constants & Data ───────────────────────────────────────────────────

const LOG_TYPES = [
  'Routine daily check',
  'Symptom episode',
  'Acute attack',
  'Post-medication check',
  'Exercise-induced',
  'Nocturnal episode',
];

const SYMPTOMS = [
  {id: 'wheeze', name: 'Wheeze', icon: 'musical-notes-outline', sub: 'Whistling sound', levels: ['0', '1', '2', '3'], active: '1'},
  {id: 'cough', name: 'Cough', icon: 'megaphone-outline', sub: 'Frequency and intensity', levels: ['0', '1', '2', '3'], active: '1'},
  {id: 'chest', name: 'Chest tightness', icon: 'shield-outline', sub: 'Squeezing/pressure', levels: ['0', '1', '2', '3'], active: '0'},
  {id: 'breathless', name: 'Breathlessness', icon: 'cloud-outline', sub: 'Difficulty breathing', levels: ['0', '1', '2', '3'], active: '1'},
  {id: 'night', name: 'Night symptoms', icon: 'moon-outline', sub: 'Woke due to asthma', levels: ['No', '1\u00D7', '2\u00D7', '3+'], active: 'No'},
  {id: 'activity', name: 'Activity limitation', icon: 'walk-outline', sub: 'Did symptoms limit activity?', levels: ['No', 'Mild', 'Mod', 'Sev'], active: 'Mild'},
];

const MEDICATIONS = [
  {name: 'Salbutamol (Ventolin) Reliever', icon: 'cloud-outline', note: '100mcg/puff \u00B7 2 puffs via spacer', status: 'green', statusLabel: '2 puffs 7:10 AM'},
  {name: 'Budesonide (Pulmicort) Preventer ICS', icon: 'shield-checkmark-outline', note: '200mcg twice daily \u00B7 Must use every day', status: 'green', statusLabel: 'AM dose \u2713'},
  {name: 'Aerochamber spacer', icon: 'expand-outline', note: 'Always use spacer with pMDI', status: 'blue', statusLabel: 'Used \u2713'},
  {name: 'Salmeterol/Formoterol LABA', icon: 'add-circle-outline', note: 'Not currently prescribed', status: 'gray', statusLabel: 'Not prescribed'},
  {name: 'Montelukast (Singulair)', icon: 'tablet-portrait-outline', note: 'Not prescribed \u00B7 Useful in allergic asthma', status: 'gray', statusLabel: 'Not prescribed'},
  {name: 'Oral prednisolone', icon: 'alert-circle-outline', note: 'For severe acute attack only \u00B7 1-2 mg/kg/day', status: 'red', statusLabel: 'Emergency only'},
];

const TRIGGERS = [
  'Animal dander', 'Dust/dust mites', 'Pollen', 'Cold/URI', 'Exercise',
  'Emotional stress', 'Cold air', 'Air pollution', 'Perfume/chemicals',
  'Smoke', 'GERD', 'Aspirin/NSAIDs', 'Weather change', 'Cockroach/mould', 'Unknown',
];
const TRIGGERS_ACTIVE = new Set(['Animal dander', 'Dust/dust mites']);

const GINA_QUESTIONS = [
  {q: 'Daytime symptoms >2\u00D7/week?', defaultAnswer: 'No'},
  {q: 'Night waking?', defaultAnswer: 'No'},
  {q: 'Reliever >2\u00D7/week?', defaultAnswer: 'Yes'},
  {q: 'Activity limitation?', defaultAnswer: 'No'},
];

const TIME_CHIPS = ['Morning', 'Daytime', 'Evening', 'Night'];
const SETTING_CHIPS = ['At home', 'At school', 'During sport', 'On commute', 'Outdoors', 'At hospital'];

const SCHOOL_CHIPS = ['No school missed', 'Late to school', 'Missed school', 'Skipped PE', 'Rest day'];

const TREND_DATA = [
  {day: 'Mon', pef: 88},
  {day: 'Tue', pef: 74},
  {day: 'Wed', pef: 95},
  {day: 'Thu', pef: 71},
  {day: 'Fri', pef: 85},
  {day: 'Sat', pef: 90},
  {day: 'Today', pef: 74},
];

const EPISODE_HISTORY = [
  {date: 'Today', pef: 74, spo2: 97, trigger: 'Dust', meds: 'Salb 2p', medsColor: Colors.accent, highlight: true},
  {date: '15 Mar', pef: 71, spo2: 96, trigger: 'Exercise', meds: 'Salb 2p', medsColor: Colors.accent, highlight: false},
  {date: '2 Mar', pef: 88, spo2: 98, trigger: 'Routine', meds: 'Prev \u2713', medsColor: Colors.accent, highlight: false},
  {date: '20 Feb', pef: 48, spo2: 93, trigger: 'Cold/URI', meds: '6p+Pred', medsColor: Colors.red, highlight: false},
  {date: '5 Jan', pef: 68, spo2: 97, trigger: 'Pollen', meds: 'Salb 2p', medsColor: Colors.accent, highlight: false},
];

// ─── Helpers ────────────────────────────────────────────────────────────

const pefColor = (pct) => {
  if (pct > 80) return Colors.accent;
  if (pct >= 50) return Colors.amber;
  return Colors.red;
};

const statusColors = {
  green: {color: Colors.accent, bg: Colors.tealBg},
  blue: {color: Colors.blue, bg: Colors.blueBg},
  gray: {color: Colors.textTertiary, bg: '#f3f4f6'},
  red: {color: Colors.red, bg: Colors.redBg},
  amber: {color: Colors.amber, bg: Colors.amberBg},
};

// ─── Component ──────────────────────────────────────────────────────────

const AsthmaManualView = () => {
  const [logType, setLogType] = useState('Routine daily check');
  const [symptomLevels, setSymptomLevels] = useState(() => {
    const m = {};
    SYMPTOMS.forEach(s => { m[s.id] = s.active; });
    return m;
  });
  const [triggersActive, setTriggersActive] = useState(new Set(TRIGGERS_ACTIVE));
  const [ginaAnswers, setGinaAnswers] = useState(() => {
    const m = {};
    GINA_QUESTIONS.forEach((q, i) => { m[i] = q.defaultAnswer; });
    return m;
  });
  const [timeChip, setTimeChip] = useState('Morning');
  const [settingChip, setSettingChip] = useState('At home');
  const [schoolChip, setSchoolChip] = useState('No school missed');
  const [notes, setNotes] = useState('');

  // ─── helpers ────────────────────────────────────────────────────────
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

  // ─── SVG Gauge for PEF ─────────────────────────────────────────────
  const renderPefGauge = () => {
    const pct = 74;
    const radius = 32;
    const circumference = 2 * Math.PI * radius;
    const arcLength = circumference * (pct / 100);
    return (
      <Svg width={s(80)} height={vs(80)} viewBox="0 0 80 80">
        <SvgCircle cx="40" cy="40" r={radius} stroke="#1f2937" strokeWidth="6" fill="none" />
        <SvgCircle
          cx="40"
          cy="40"
          r={radius}
          stroke={Colors.amber}
          strokeWidth="6"
          fill="none"
          strokeDasharray={`${arcLength} ${circumference - arcLength}`}
          strokeDashoffset={circumference * 0.25}
          strokeLinecap="round"
          transform="rotate(-90 40 40)"
        />
        <SvgText x="40" y="38" textAnchor="middle" fontSize="16" fontWeight="bold" fill={Colors.amber}>
          74%
        </SvgText>
        <SvgText x="40" y="52" textAnchor="middle" fontSize="9" fill="#9ca3af">
          of best
        </SvgText>
      </Svg>
    );
  };

  // ─── RENDER ───────────────────────────────────────────────────────────

  return (
    <View style={styles.container}>

      {/* ── 1. Log Type ─────────────────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>LOG TYPE</AppText>
      <View style={styles.chipRow}>
        {LOG_TYPES.map(lt =>
          renderChip(lt, logType === lt, () => setLogType(lt)),
        )}
      </View>

      {/* ── 2. Peak Expiratory Flow (PEF) ───────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>PEAK EXPIRATORY FLOW (PEF)</AppText>
      <AppText variant="caption" style={{color: Colors.textSecondary, marginBottom: vs(8), paddingHorizontal: s(4)}}>
        Blow 3 times {'\u2014'} record best
      </AppText>

      <View style={[styles.card, {backgroundColor: '#040d18', borderColor: '#1f2937'}]}>
        {/* Device row */}
        <AppText variant="bodyBold" style={{color: '#ffffff'}}>Mini-Wright Peak Flow Meter</AppText>
        <AppText variant="caption" style={{color: '#9ca3af', marginTop: vs(2)}}>
          Aarav {'\u00B7'} Personal best: 260 L/min
        </AppText>

        <View style={[styles.divider, {borderColor: '#1f2937', marginVertical: vs(12)}]} />

        {/* Main row: Gauge + reading */}
        <View style={styles.row}>
          <View style={{marginRight: s(16)}}>
            {renderPefGauge()}
          </View>
          <View style={{flex: 1}}>
            <AppText variant="caption" style={{color: '#9ca3af'}}>Best of 3 blows</AppText>
            <AppText variant="bodyBold" style={{color: Colors.amber, fontSize: ms(30), lineHeight: ms(36)}} numberOfLines={1} adjustsFontSizeToFit>193</AppText>
            <AppText variant="small" style={{color: '#9ca3af'}}>L/min {'\u00B7'} Tap to enter</AppText>
            <AppText variant="small" style={{color: Colors.amber, marginTop: vs(4)}}>
              74% of personal best (260)
            </AppText>
          </View>
        </View>

        <View style={[styles.divider, {borderColor: '#1f2937', marginVertical: vs(12)}]} />

        {/* Zone bar */}
        <View style={{flexDirection: 'row', height: vs(10), borderRadius: ms(5), overflow: 'hidden'}}>
          <View style={{flex: 50, backgroundColor: Colors.red}} />
          <View style={{flex: 30, backgroundColor: Colors.amber}} />
          <View style={{flex: 20, backgroundColor: Colors.accent}} />
        </View>
        {/* Marker at 74% */}
        <View style={{position: 'relative', height: vs(12)}}>
          <View style={{position: 'absolute', left: '74%', top: 0, width: 2, height: vs(8), backgroundColor: '#ffffff', borderRadius: 1}} />
          <View style={{position: 'absolute', left: '72%', top: vs(8)}}>
            <AppText variant="small" style={{color: '#ffffff', fontSize: ms(8)}}>74%</AppText>
          </View>
        </View>

        {/* Zone labels */}
        <View style={[styles.row, {marginTop: vs(6)}]}>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: Colors.red, marginRight: s(4)}} />
              <AppText variant="small" style={{color: '#9ca3af'}}>Red &lt;50%</AppText>
            </View>
            <AppText variant="small" style={{color: '#6b7280'}}>&lt;130</AppText>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: Colors.amber, marginRight: s(4)}} />
              <AppText variant="small" style={{color: '#9ca3af'}}>Yellow 50-80%</AppText>
            </View>
            <AppText variant="small" style={{color: '#6b7280'}}>130-208</AppText>
          </View>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: Colors.accent, marginRight: s(4)}} />
              <AppText variant="small" style={{color: '#9ca3af'}}>Green &gt;80%</AppText>
            </View>
            <AppText variant="small" style={{color: '#6b7280'}}>&gt;208</AppText>
          </View>
        </View>

        <View style={[styles.divider, {borderColor: '#1f2937', marginVertical: vs(12)}]} />

        {/* 3-column metrics */}
        <View style={styles.row}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <AppText variant="small" style={{color: '#9ca3af'}}>Today's best</AppText>
            <AppText variant="bodyBold" style={{color: '#ffffff', fontSize: ms(18)}}>193</AppText>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <AppText variant="small" style={{color: '#9ca3af'}}>Personal best</AppText>
            <AppText variant="bodyBold" style={{color: '#ffffff', fontSize: ms(18)}}>260</AppText>
          </View>
          <View style={{flex: 1, alignItems: 'center'}}>
            <AppText variant="small" style={{color: '#9ca3af'}}>% Personal best</AppText>
            <AppText variant="bodyBold" style={{color: Colors.amber, fontSize: ms(18)}}>74%</AppText>
          </View>
        </View>
      </View>

      {/* ── 3. 3-Blow Entry ──────────────────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold">3 peak flow blows</AppText>
            <AppText variant="caption" style={{color: Colors.textSecondary}}>Record all 3 {'\u00B7'} Use best</AppText>
          </View>
        </View>

        <View style={[styles.divider, {marginVertical: vs(10)}]} />

        <View style={styles.row}>
          {[{label: 'Blow 1', val: '193'}, {label: 'Blow 2', val: '188'}, {label: 'Blow 3', val: '190'}].map(b => (
            <View key={b.label} style={{flex: 1, alignItems: 'center'}}>
              <AppText variant="caption" style={{color: Colors.textSecondary}}>{b.label}</AppText>
              <AppText variant="bodyBold" style={{color: Colors.blue, fontSize: ms(22), marginTop: vs(4)}}>{b.val}</AppText>
            </View>
          ))}
        </View>

        <View style={[styles.infoBox, {backgroundColor: Colors.blueBg, marginTop: vs(12)}]}>
          <Icon name="information-circle-outline" size={ms(16)} color={Colors.blueText} />
          <AppText variant="small" style={{color: Colors.blueText, flex: 1, marginLeft: s(6)}}>
            Technique: Stand up straight, take the deepest breath you can, seal lips around mouthpiece, blast out as hard and fast as possible.
          </AppText>
        </View>
      </View>

      {/* ── 4. 7-Day Trend ──────────────────────────────────────────── */}
      <View style={styles.card}>
        <AppText variant="bodyBold">Peak flow trend</AppText>
        <AppText variant="caption" style={{color: Colors.textSecondary, marginBottom: vs(12)}}>7 days</AppText>

        <View style={{height: vs(120), flexDirection: 'row', alignItems: 'flex-end', justifyContent: 'space-between', paddingHorizontal: s(4)}}>
          {/* Dashed threshold line at 80% */}
          <View style={{position: 'absolute', left: 0, right: 0, bottom: '80%', borderTopWidth: 1, borderStyle: 'dashed', borderColor: '#9ca3af', zIndex: 1}} />
          <View style={{position: 'absolute', right: s(4), bottom: '81%', zIndex: 2}}>
            <AppText variant="small" style={{color: '#9ca3af', fontSize: ms(8)}}>80%</AppText>
          </View>

          {TREND_DATA.map((d, i) => {
            const barColor = pefColor(d.pef);
            const heightPct = d.pef;
            return (
              <View key={i} style={{flex: 1, alignItems: 'center', marginHorizontal: s(2)}}>
                <AppText variant="small" style={{color: barColor, fontSize: ms(9), marginBottom: vs(2)}}>{d.pef}%</AppText>
                <View style={{
                  width: s(20),
                  height: `${heightPct}%`,
                  backgroundColor: barColor,
                  borderRadius: ms(4),
                  minHeight: vs(4),
                }} />
                <AppText variant="small" style={{color: Colors.textSecondary, fontSize: ms(9), marginTop: vs(4)}}>{d.day}</AppText>
              </View>
            );
          })}
        </View>

        <View style={[styles.divider, {marginVertical: vs(10)}]} />

        {/* Legend */}
        <View style={[styles.row, {justifyContent: 'center', gap: ms(16)}]}>
          {[
            {label: 'Green zone', color: Colors.accent},
            {label: 'Yellow zone', color: Colors.amber},
            {label: 'Red zone', color: Colors.red},
          ].map(l => (
            <View key={l.label} style={{flexDirection: 'row', alignItems: 'center'}}>
              <View style={{width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: l.color, marginRight: s(4)}} />
              <AppText variant="small" style={{color: Colors.textSecondary}}>{l.label}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* ── 5. SpO2 ─────────────────────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>OXYGEN SATURATION (SPO{'\u2082'})</AppText>
      <View style={styles.card}>
        <View style={styles.row}>
          <View style={{marginRight: s(16)}}>
            <AppText variant="bodyBold" style={{color: Colors.accent, fontSize: ms(32), lineHeight: ms(38)}} numberOfLines={1} adjustsFontSizeToFit>97%</AppText>
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" style={{color: Colors.accent}}>Normal {'\u00B7'} No hypoxia</AppText>

            {/* Range bar */}
            <View style={{flexDirection: 'row', height: vs(8), borderRadius: ms(4), overflow: 'hidden', marginTop: vs(8)}}>
              <View style={{flex: 12, backgroundColor: Colors.red}} />
              <View style={{flex: 6, backgroundColor: '#f97316'}} />
              <View style={{flex: 1, backgroundColor: Colors.amber}} />
              <View style={{flex: 5, backgroundColor: Colors.accent}} />
            </View>

            {/* Marker at 97% */}
            <View style={{position: 'relative', height: vs(10)}}>
              <View style={{position: 'absolute', left: '87.5%', top: 0, width: 2, height: vs(6), backgroundColor: Colors.textPrimary, borderRadius: 1}} />
            </View>

            {/* Scale labels */}
            <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
              <AppText variant="small" style={{color: Colors.textTertiary, fontSize: ms(8)}}>&lt;88%</AppText>
              <AppText variant="small" style={{color: Colors.textTertiary, fontSize: ms(8)}}>91%</AppText>
              <AppText variant="small" style={{color: Colors.textTertiary, fontSize: ms(8)}}>94%</AppText>
              <AppText variant="small" style={{color: Colors.textTertiary, fontSize: ms(8)}}>95%</AppText>
              <AppText variant="small" style={{color: Colors.textTertiary, fontSize: ms(8)}}>100%</AppText>
            </View>

            <AppText variant="small" style={{color: Colors.textSecondary, marginTop: vs(6)}}>
              Normal: 95-100% {'\u00B7'} Borderline: 92-94% {'\u00B7'} Low: &lt;92%
            </AppText>
          </View>
        </View>
      </View>

      {/* ── 6. Symptoms ─────────────────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>SYMPTOMS</AppText>
      <AppText variant="caption" style={{color: Colors.textSecondary, marginBottom: vs(8), paddingHorizontal: s(4)}}>
        Rate each 0=None 1=Mild 2=Moderate 3=Severe
      </AppText>

      <View style={styles.card}>
        {SYMPTOMS.map((sym, idx) => (
          <View key={sym.id}>
            {idx > 0 && <View style={[styles.divider, {marginVertical: vs(10)}]} />}
            <View style={styles.row}>
              <Icon name={sym.icon} size={ms(20)} color={Colors.textSecondary} style={{marginRight: s(10), marginTop: vs(2)}} />
              <View style={{flex: 1}}>
                <AppText variant="bodyBold">{sym.name}</AppText>
                <AppText variant="small" style={{color: Colors.textSecondary}}>{sym.sub}</AppText>
                <View style={[styles.chipRow, {marginTop: vs(6)}]}>
                  {sym.levels.map(lev => {
                    const isActive = symptomLevels[sym.id] === lev;
                    return (
                      <TouchableOpacity
                        key={lev}
                        onPress={() => setSymptomLevels(prev => ({...prev, [sym.id]: lev}))}
                        style={[
                          styles.severityBtn,
                          isActive && {backgroundColor: Colors.amberBg, borderColor: Colors.amber},
                        ]}>
                        <AppText
                          variant="small"
                          style={{color: isActive ? Colors.amber : Colors.textSecondary, fontWeight: isActive ? '700' : '400'}}>
                          {lev}
                        </AppText>
                      </TouchableOpacity>
                    );
                  })}
                </View>
              </View>
            </View>
          </View>
        ))}
      </View>

      {/* ── 7. Reliever Inhaler Counter ─────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>RELIEVER INHALER USE</AppText>
      <AppText variant="caption" style={{color: Colors.textSecondary, marginBottom: vs(8), paddingHorizontal: s(4)}}>
        Salbutamol / Ventolin {'\u00B7'} Count puffs today
      </AppText>

      <View style={styles.card}>
        <View style={[styles.row, {alignItems: 'center'}]}>
          <AppText variant="bodyBold" style={{flex: 1}}>Salbutamol puffs {'\u00B7'} Today</AppText>
          <View style={{backgroundColor: Colors.blueBg, paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(8)}}>
            <AppText variant="small" style={{color: Colors.blueText}}>8 puffs this month</AppText>
          </View>
        </View>

        <View style={[styles.divider, {marginVertical: vs(10)}]} />

        {/* Puff dots */}
        <View style={[styles.chipRow, {gap: ms(8)}]}>
          {[1, 2, 3, 4, 5, 6, 7, 8].map(n => {
            let bg = '#e5e7eb';
            let textColor = Colors.textTertiary;
            if (n <= 2) { bg = Colors.teal; textColor = '#ffffff'; }
            if (n === 3) { bg = Colors.primary; textColor = '#ffffff'; }
            return (
              <TouchableOpacity
                key={n}
                style={{
                  width: ms(32),
                  height: ms(32),
                  borderRadius: ms(16),
                  backgroundColor: bg,
                  alignItems: 'center',
                  justifyContent: 'center',
                }}>
                <AppText variant="small" style={{color: textColor, fontWeight: '600'}}>{n}</AppText>
              </TouchableOpacity>
            );
          })}
          <TouchableOpacity
            style={{
              width: ms(32),
              height: ms(32),
              borderRadius: ms(16),
              borderWidth: 1.5,
              borderStyle: 'dashed',
              borderColor: Colors.textTertiary,
              alignItems: 'center',
              justifyContent: 'center',
            }}>
            <Icon name="add-outline" size={ms(18)} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Warning */}
        <View style={[styles.infoBox, {backgroundColor: Colors.blueBg, marginTop: vs(12)}]}>
          <Icon name="alert-circle-outline" size={ms(16)} color={Colors.blueText} />
          <AppText variant="small" style={{color: Colors.blueText, flex: 1, marginLeft: s(6)}}>
            Using reliever &gt;2 puffs/episode indicates poorly controlled asthma. This month: 8 puffs across 3 episodes
          </AppText>
        </View>
      </View>

      {/* ── 8. Medications ──────────────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>MEDICATIONS</AppText>
      <View style={styles.card}>
        {MEDICATIONS.map((med, idx) => {
          const sc = statusColors[med.status];
          return (
            <View key={med.name}>
              {idx > 0 && <View style={[styles.divider, {marginVertical: 0}]} />}
              <View style={styles.medRow}>
                <View style={styles.medIconWrap}>
                  <Icon family="Ionicons" name={med.icon} size={ms(18)} color={Colors.primary} />
                </View>
                <View style={{flex: 1}}>
                  <AppText variant="bodyBold">{med.name}</AppText>
                  <AppText variant="small" style={{color: Colors.textSecondary, marginTop: vs(2), lineHeight: ms(16)}}>{med.note}</AppText>
                </View>
                <View style={{backgroundColor: sc.bg, paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(8), marginLeft: s(10)}}>
                  <AppText variant="small" style={{color: sc.color, fontWeight: '600'}}>{med.statusLabel}</AppText>
                </View>
              </View>
            </View>
          );
        })}

        <View style={[styles.infoBox, {backgroundColor: Colors.blueBg, marginTop: vs(14)}]}>
          <Icon name="information-circle-outline" size={ms(16)} color={Colors.blueText} />
          <AppText variant="small" style={{color: Colors.blueText, flex: 1, marginLeft: s(6)}}>
            Inhaler technique: Shake inhaler, breathe out fully, press canister while breathing in slowly, hold breath 10 seconds.
          </AppText>
        </View>
      </View>

      {/* ── 9. Inhaler Stock Tracker ────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>INHALER STOCK TRACKER</AppText>
      <View style={[styles.card, {backgroundColor: Colors.primary, borderColor: Colors.primary}]}>
        <View style={styles.row}>
          {/* Simple inhaler SVG icon */}
          <Svg width={s(40)} height={vs(50)} viewBox="0 0 40 50" style={{marginRight: s(12)}}>
            <Rect x="10" y="0" width="20" height="30" rx="4" fill="rgba(255,255,255,0.3)" />
            <Rect x="14" y="30" width="12" height="16" rx="2" fill="rgba(255,255,255,0.5)" />
            <Rect x="12" y="44" width="16" height="4" rx="2" fill="rgba(255,255,255,0.4)" />
          </Svg>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" style={{color: '#ffffff'}}>Budesonide 200mcg {'\u00B7'} Pulmicort 100-dose</AppText>
            <AppText variant="small" style={{color: 'rgba(255,255,255,0.7)', marginTop: vs(2)}}>
              62 doses remaining {'\u00B7'} Started 15 Feb
            </AppText>

            {/* Progress bar */}
            <View style={{height: vs(6), backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: ms(3), marginTop: vs(8)}}>
              <View style={{width: '62%', height: '100%', backgroundColor: Colors.teal, borderRadius: ms(3)}} />
            </View>

            <AppText variant="small" style={{color: 'rgba(255,255,255,0.7)', marginTop: vs(6)}}>
              Estimated empty: 13 Apr {'\u00B7'} Reorder before 6 Apr
            </AppText>
          </View>
        </View>
      </View>

      {/* ── 10. Triggers ────────────────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>POTENTIAL TRIGGERS</AppText>
      <View style={styles.chipRow}>
        {TRIGGERS.map(t =>
          renderTag(t, triggersActive.has(t), () => toggleSet(setTriggersActive, t)),
        )}
      </View>

      {/* ── 11. GINA Control Assessment ─────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>GINA SYMPTOM CONTROL ASSESSMENT</AppText>
      <AppText variant="caption" style={{color: Colors.textSecondary, marginBottom: vs(8), paddingHorizontal: s(4)}}>
        Past 4 weeks
      </AppText>

      <View style={styles.card}>
        <View style={[styles.infoBox, {backgroundColor: Colors.blueBg, marginBottom: vs(12)}]}>
          <Icon name="information-circle-outline" size={ms(16)} color={Colors.blueText} />
          <AppText variant="small" style={{color: Colors.blueText, flex: 1, marginLeft: s(6)}}>
            GINA (Global Initiative for Asthma) symptom control assessment. Answer based on the past 4 weeks.
          </AppText>
        </View>

        {GINA_QUESTIONS.map((gq, idx) => (
          <View key={idx}>
            {idx > 0 && <View style={[styles.divider, {marginVertical: vs(8)}]} />}
            <View style={styles.row}>
              <AppText variant="body" style={{flex: 1}}>{gq.q}</AppText>
              <View style={{flexDirection: 'row', gap: ms(8)}}>
                {['No', 'Yes'].map(opt => {
                  const isActive = ginaAnswers[idx] === opt;
                  const isYesActive = isActive && opt === 'Yes';
                  return (
                    <TouchableOpacity
                      key={opt}
                      onPress={() => setGinaAnswers(prev => ({...prev, [idx]: opt}))}
                      style={[
                        styles.severityBtn,
                        {paddingHorizontal: s(14)},
                        isActive && !isYesActive && {backgroundColor: Colors.tealBg, borderColor: Colors.primary},
                        isYesActive && {backgroundColor: Colors.amberBg, borderColor: Colors.amber},
                      ]}>
                      <AppText
                        variant="small"
                        style={{
                          color: isYesActive ? Colors.amber : isActive ? Colors.primary : Colors.textSecondary,
                          fontWeight: isActive ? '700' : '400',
                        }}>
                        {opt}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </View>
        ))}

        <View style={[styles.infoBox, {backgroundColor: Colors.amberBg, marginTop: vs(14)}]}>
          <View style={{flex: 1}}>
            <View style={[styles.row, {alignItems: 'center'}]}>
              <AppText variant="bodyBold" style={{color: Colors.amberText, flex: 1}}>
                Partly controlled {'\u00B7'} 1 positive answer
              </AppText>
              <AppText variant="bodyBold" style={{color: Colors.amberText}}>1/4</AppText>
            </View>
          </View>
        </View>

        <View style={[styles.infoBox, {backgroundColor: Colors.amberBg, marginTop: vs(8)}]}>
          <Icon name="alert-circle-outline" size={ms(16)} color={Colors.amberText} />
          <AppText variant="small" style={{color: Colors.amberText, flex: 1, marginLeft: s(6)}}>
            Step-up review indicated. Consider increasing preventer or adding LABA. Review inhaler technique and adherence first.
          </AppText>
        </View>
      </View>

      {/* ── 12. Episode Context ─────────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>WHEN & CONTEXT</AppText>
      <AppText variant="caption" style={{color: Colors.textSecondary, marginBottom: vs(6), paddingHorizontal: s(4)}}>
        Time of day
      </AppText>
      <View style={styles.chipRow}>
        {TIME_CHIPS.map(tc =>
          renderChip(tc, timeChip === tc, () => setTimeChip(tc)),
        )}
      </View>

      <AppText variant="caption" style={{color: Colors.textSecondary, marginTop: vs(10), marginBottom: vs(6), paddingHorizontal: s(4)}}>
        Setting
      </AppText>
      <View style={styles.chipRow}>
        {SETTING_CHIPS.map(sc =>
          renderChip(sc, settingChip === sc, () => setSettingChip(sc)),
        )}
      </View>

      {/* ── 13. School Impact ───────────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>SCHOOL / ACTIVITY IMPACT</AppText>
      <View style={styles.chipRow}>
        {SCHOOL_CHIPS.map(sc =>
          renderChip(sc, schoolChip === sc, () => setSchoolChip(sc)),
        )}
      </View>

      <View style={[styles.infoBox, {backgroundColor: '#e0f2fe', marginTop: vs(10)}]}>
        <Icon name="school-outline" size={ms(16)} color={Colors.blueText} />
        <AppText variant="small" style={{color: Colors.blueText, flex: 1, marginLeft: s(6)}}>
          School absence tracker: Aarav has missed 2 school days this term due to asthma. GP review recommended if &gt;3 days missed.
        </AppText>
      </View>

      {/* ── 14. Emergency Action Plan ───────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>GINA ACTION PLAN {'\u2014'} WHAT TO DO NOW</AppText>
      <View style={styles.card}>
        {/* Green zone */}
        <View style={[styles.zoneRow, {backgroundColor: Colors.tealBg}]}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(4)}}>
            <View style={{width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: Colors.accent, marginRight: s(8)}} />
            <AppText variant="bodyBold" style={{color: Colors.tealText}}>Well controlled (PEF &gt;80%)</AppText>
          </View>
          <AppText variant="small" style={{color: Colors.tealText, marginLeft: s(18)}}>
            Continue preventer as prescribed. No extra reliever needed.
          </AppText>
        </View>

        {/* Yellow zone — highlighted */}
        <View style={[styles.zoneRow, {backgroundColor: Colors.amberBg, borderWidth: 1.5, borderColor: Colors.primary, marginTop: vs(8)}]}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(4)}}>
            <View style={{width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: Colors.amber, marginRight: s(8)}} />
            <AppText variant="bodyBold" style={{color: Colors.amberText, flex: 1}}>Caution (PEF 50-80%)</AppText>
            <View style={{backgroundColor: Colors.primary, paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(6)}}>
              <AppText variant="small" style={{color: '#ffffff', fontWeight: '700'}}>AARAV NOW</AppText>
            </View>
          </View>
          <AppText variant="small" style={{color: Colors.amberText, marginLeft: s(18)}}>
            Give salbutamol 2-4 puffs via spacer. Repeat every 20 min for 1 hour if needed. If not improving, move to red zone plan.
          </AppText>
        </View>

        {/* Red zone */}
        <View style={[styles.zoneRow, {backgroundColor: Colors.redBg, marginTop: vs(8)}]}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(4)}}>
            <View style={{width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: Colors.red, marginRight: s(8)}} />
            <AppText variant="bodyBold" style={{color: Colors.redText}}>Danger (PEF &lt;50%)</AppText>
          </View>
          <AppText variant="small" style={{color: Colors.redText, marginLeft: s(18)}}>
            Give salbutamol 6 puffs via spacer immediately. Start oral prednisolone. Call ambulance / go to hospital if no improvement in 15 minutes.
          </AppText>
        </View>
      </View>

      {/* ── 15. Episode History ─────────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>EPISODE HISTORY {'\u00B7'} 2026</AppText>
      <View style={styles.card}>
        {/* Table header */}
        <View style={styles.tableHeaderRow}>
          <AppText variant="small" style={[styles.tableCell, {flex: 2, color: Colors.textSecondary, fontWeight: '600'}]}>Date</AppText>
          <AppText variant="small" style={[styles.tableCell, {flex: 1, color: Colors.textSecondary, fontWeight: '600'}]}>PEF%</AppText>
          <AppText variant="small" style={[styles.tableCell, {flex: 1, color: Colors.textSecondary, fontWeight: '600'}]}>SpO{'\u2082'}</AppText>
          <AppText variant="small" style={[styles.tableCell, {flex: 2, color: Colors.textSecondary, fontWeight: '600'}]}>Trigger</AppText>
          <AppText variant="small" style={[styles.tableCell, {flex: 2, color: Colors.textSecondary, fontWeight: '600'}]}>Meds</AppText>
        </View>

        {EPISODE_HISTORY.map((ep, idx) => (
          <View
            key={idx}
            style={[
              styles.tableRow,
              ep.highlight && {backgroundColor: Colors.tealBg, borderRadius: ms(6), paddingHorizontal: s(4)},
            ]}>
            <AppText variant="small" style={[styles.tableCell, {flex: 2, color: ep.highlight ? Colors.primary : Colors.textPrimary, fontWeight: ep.highlight ? '700' : '400'}]}>
              {ep.date}
            </AppText>
            <AppText variant="small" style={[styles.tableCell, {flex: 1, color: pefColor(ep.pef), fontWeight: '600'}]}>
              {ep.pef}%
            </AppText>
            <AppText variant="small" style={[styles.tableCell, {flex: 1, color: Colors.textPrimary}]}>
              {ep.spo2}%
            </AppText>
            <AppText variant="small" style={[styles.tableCell, {flex: 2, color: Colors.textSecondary}]}>
              {ep.trigger}
            </AppText>
            <View style={[styles.tableCell, {flex: 2}]}>
              <View style={{backgroundColor: ep.medsColor === Colors.red ? Colors.redBg : Colors.tealBg, paddingHorizontal: s(6), paddingVertical: vs(2), borderRadius: ms(4), alignSelf: 'flex-start'}}>
                <AppText variant="small" style={{color: ep.medsColor}}>{ep.meds}</AppText>
              </View>
            </View>
          </View>
        ))}

        <View style={[styles.divider, {marginVertical: vs(10)}]} />

        <AppText variant="small" style={{color: Colors.textSecondary, textAlign: 'center'}}>
          3 episodes in 2026 {'\u00B7'} Average PEF%: 74% {'\u00B7'} 1 red zone event
        </AppText>
      </View>

      {/* ── 16. Notes ───────────────────────────────────────────────── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>NOTE</AppText>
      <View style={styles.card}>
        <TextInput
          style={styles.textInput}
          placeholder="Add notes..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          value={notes}
          onChangeText={setNotes}
        />
      </View>

    </View>
  );
};

// ─── Styles ────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    paddingVertical: vs(6),
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
    alignItems: 'flex-start',
  },
  medRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(10),
    paddingHorizontal: s(4),
  },
  medIconWrap: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(9),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
    marginTop: vs(1),
  },
  divider: {
    borderTopWidth: 0.5,
    borderColor: '#d1d5db',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(8),
  },
  chip: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: ms(20),
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
  },
  tag: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
  },
  severityBtn: {
    borderWidth: 1,
    borderColor: '#d1d5db',
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    minWidth: ms(36),
    alignItems: 'center',
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: ms(10),
    borderRadius: ms(10),
  },
  zoneRow: {
    padding: ms(12),
    borderRadius: ms(10),
  },
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
    alignItems: 'center',
  },
  tableCell: {
    paddingHorizontal: s(2),
  },
  textInput: {
    minHeight: vs(80),
    fontSize: ms(14),
    color: Colors.textPrimary,
    padding: 0,
    textAlignVertical: 'top',
  },
});

export default AsthmaManualView;
