import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {LAST_NIGHT, SLEEP_USER} from '../../../constants/sleepData';

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const QUALITY_OPTIONS = ['Excellent', 'Good', 'Fair', 'Poor', 'Very poor'];

const DREAM_OPTIONS = [
  'Vivid / positive',
  'Neutral',
  'Disturbing',
  'None recalled',
];

const WAKE_REASONS = [
  'Alarm',
  'Natural',
  'Noise',
  'Bathroom',
  'Pain / discomfort',
  'Unknown',
];

const HEADACHE_OPTIONS = ['None', 'Mild', 'Moderate', 'Severe'];

const DRY_MOUTH_OPTIONS = ['No', 'Mild', 'Yes, very'];

const getGlucoseFlag = (val) => {
  const v = parseFloat(val);
  if (isNaN(v)) return {label: '—', color: Colors.textTertiary, bg: Colors.borderLight};
  if (v < 70) return {label: 'Hypo', color: Colors.redText, bg: Colors.redBg};
  if (v <= 100) return {label: 'Excellent', color: Colors.tealText, bg: Colors.tealBg};
  if (v <= 126) return {label: 'Normal', color: Colors.tealText, bg: Colors.tealBg};
  if (v <= 180) return {label: 'Elevated', color: Colors.amberText, bg: Colors.amberBg};
  return {label: 'High', color: Colors.redText, bg: Colors.redBg};
};

const formatMins = (m) => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return `${h}h ${min}m`;
};

// ──────────────────────────────────────────────
// Dropdown Picker
// ──────────────────────────────────────────────

const DropdownPicker = ({label, options, value, onSelect}) => {
  const [open, setOpen] = useState(false);

  return (
    <View style={styles.dropdownWrap}>
      <AppText style={styles.inputLabel}>{label}</AppText>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setOpen(!open)}
        style={[styles.dropdownTrigger, open && styles.dropdownTriggerOpen]}>
        <AppText
          style={styles.dropdownText}
          color={value ? Colors.textPrimary : Colors.textTertiary}>
          {value || 'Select...'}
        </AppText>
        <AppText style={styles.dropdownArrow}>{open ? '▲' : '▼'}</AppText>
      </TouchableOpacity>
      {open && (
        <View style={styles.dropdownList}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              activeOpacity={0.7}
              onPress={() => {
                onSelect(opt);
                setOpen(false);
              }}
              style={[
                styles.dropdownItem,
                value === opt && styles.dropdownItemActive,
              ]}>
              <AppText
                style={styles.dropdownItemText}
                color={value === opt ? Colors.primary : Colors.textPrimary}>
                {opt}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );
};

// ──────────────────────────────────────────────
// Numeric Input Row
// ──────────────────────────────────────────────

const NumericRow = ({label, unit, value, onChangeText, placeholder, flag}) => (
  <View style={styles.numericRow}>
    <View style={styles.numericLeft}>
      <AppText style={styles.inputLabel}>{label}</AppText>
      {unit ? (
        <AppText style={styles.unitText}>{unit}</AppText>
      ) : null}
    </View>
    <View style={styles.numericRight}>
      <TextInput
        style={styles.numericInput}
        keyboardType="numeric"
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder || '—'}
        placeholderTextColor={Colors.textTertiary}
        maxLength={6}
      />
      {flag && (
        <View style={[styles.flagBadge, {backgroundColor: flag.bg}]}>
          <AppText style={[styles.flagText, {color: flag.color}]}>
            {flag.label}
          </AppText>
        </View>
      )}
    </View>
  </View>
);

// ──────────────────────────────────────────────
// Insight Card
// ──────────────────────────────────────────────

const InsightCard = ({emoji, title, description}) => (
  <View style={styles.insightCard}>
    <AppText style={styles.insightEmoji}>{emoji}</AppText>
    <View style={styles.insightBody}>
      <AppText variant="bodyBold" style={styles.insightTitle}>
        {title}
      </AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={styles.insightDesc}>
        {description}
      </AppText>
    </View>
  </View>
);

// ──────────────────────────────────────────────
// Section Card Wrapper
// ──────────────────────────────────────────────

const SectionCard = ({title, emoji, children}) => (
  <View style={styles.sectionCard}>
    {title && (
      <View style={styles.sectionHeader}>
        {emoji && <AppText style={styles.sectionEmoji}>{emoji}</AppText>}
        <AppText variant="bodyBold" style={styles.sectionTitle}>
          {title}
        </AppText>
      </View>
    )}
    {children}
  </View>
);

// ──────────────────────────────────────────────
// Morning Tab Component
// ──────────────────────────────────────────────

const MorningTab = ({onSave}) => {
  // Clinical marker state
  const [glucose, setGlucose] = useState('');
  const [bpSystolic, setBpSystolic] = useState('');
  const [bpDiastolic, setBpDiastolic] = useState('');
  const [heartRate, setHeartRate] = useState('');
  const [weight, setWeight] = useState('');
  const [nocturia, setNocturia] = useState('');

  // Subjective quality state
  const [quality, setQuality] = useState('');
  const [energy, setEnergy] = useState('');
  const [dreamQuality, setDreamQuality] = useState('');
  const [wakeReason, setWakeReason] = useState('');
  const [headache, setHeadache] = useState('');
  const [dryMouth, setDryMouth] = useState('');

  const glucoseFlag = getGlucoseFlag(glucose);
  const deepMins = LAST_NIGHT.stages.deep;
  const remMins = LAST_NIGHT.stages.rem;
  const score = LAST_NIGHT.score;
  const spo2 = LAST_NIGHT.spo2avg;

  // Build clinical correlation insights from last night data
  const glucoseOutlook = score >= 75
    ? `Good sleep score (${score}) typically correlates with lower fasting glucose. Deep sleep of ${formatMins(deepMins)} supported overnight glucose regulation.`
    : `Sleep score of ${score} may reflect suboptimal glucose regulation overnight. Aim for more deep sleep to improve insulin sensitivity.`;

  const bpPattern = LAST_NIGHT.hrv >= 35
    ? `HRV of ${LAST_NIGHT.hrv} ms indicates decent autonomic balance. Morning BP may trend toward baseline. Monitor for white-coat effect.`
    : `Low HRV (${LAST_NIGHT.hrv} ms) suggests elevated sympathetic tone. Morning BP may be higher than usual. Practice slow breathing before measuring.`;

  const metforminInsight = deepMins >= 90
    ? `Deep sleep was ${formatMins(deepMins)} — above the 90-min threshold where metformin absorption is optimal. Evening dose timing appears well-calibrated.`
    : `Deep sleep was only ${formatMins(deepMins)}. Consider adjusting metformin timing closer to dinner for better overnight absorption.`;

  const ayuInsight = `${SLEEP_USER.name}, last night's sleep score was ${score}/100 with ${formatMins(deepMins)} deep sleep and ${formatMins(remMins)} REM. SpO2 averaged ${spo2}%. ${score >= 75 ? 'This is a solid night — your glucose response should be favourable this morning.' : 'This was below your best. Higher deep-sleep time typically correlates with fasting glucose 8–15 mg/dL lower.'} ${LAST_NIGHT.hrv >= 35 ? 'Your HRV suggests good recovery.' : 'HRV was low — consider a lighter morning routine today.'}`;

  const canSave =
    glucose.length > 0 ||
    bpSystolic.length > 0 ||
    quality.length > 0;

  const handleSave = () => {
    const payload = {
      glucose: parseFloat(glucose) || null,
      bpSystolic: parseFloat(bpSystolic) || null,
      bpDiastolic: parseFloat(bpDiastolic) || null,
      heartRate: parseFloat(heartRate) || null,
      weight: parseFloat(weight) || null,
      nocturia: parseInt(nocturia, 10) || 0,
      quality,
      energy: parseInt(energy, 10) || null,
      dreamQuality,
      wakeReason,
      headache,
      dryMouth,
      timestamp: new Date().toISOString(),
    };
    onSave?.(payload);
  };

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {/* ── Good Morning Banner ── */}
      <View style={styles.bannerCard}>
        <View style={styles.bannerTop}>
          <AppText style={styles.sunEmoji}>☀️</AppText>
          <View style={styles.bannerTextWrap}>
            <AppText variant="header" style={styles.bannerGreeting}>
              Good Morning, {SLEEP_USER.name}
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              {LAST_NIGHT.date} &middot; Woke at {LAST_NIGHT.wake}
            </AppText>
          </View>
        </View>
        <View style={styles.bannerScoreRow}>
          <View style={styles.bannerScoreBadge}>
            <AppText style={styles.bannerScoreValue}>{score}</AppText>
            <AppText style={styles.bannerScoreLabel}>SLEEP SCORE</AppText>
          </View>
          <View style={styles.bannerStatsCol}>
            <AppText variant="caption" color={Colors.textSecondary}>
              Duration: {formatMins(LAST_NIGHT.totalMins)}
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              Deep: {formatMins(deepMins)} &middot; REM: {formatMins(remMins)}
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              SpO2: {spo2}% &middot; HRV: {LAST_NIGHT.hrv} ms
            </AppText>
          </View>
        </View>
      </View>

      {/* ── Morning Clinical Markers ── */}
      <SectionCard title="Morning Clinical Markers" emoji="🩺">
        <NumericRow
          label="Fasting glucose"
          unit="mg/dL"
          value={glucose}
          onChangeText={setGlucose}
          placeholder="e.g. 110"
          flag={glucose.length > 0 ? glucoseFlag : null}
        />
        <View style={styles.divider} />

        <AppText style={styles.inputLabel}>Blood pressure</AppText>
        <View style={styles.bpRow}>
          <TextInput
            style={[styles.numericInput, styles.bpInput]}
            keyboardType="numeric"
            value={bpSystolic}
            onChangeText={setBpSystolic}
            placeholder="SYS"
            placeholderTextColor={Colors.textTertiary}
            maxLength={3}
          />
          <AppText style={styles.bpSlash}>/</AppText>
          <TextInput
            style={[styles.numericInput, styles.bpInput]}
            keyboardType="numeric"
            value={bpDiastolic}
            onChangeText={setBpDiastolic}
            placeholder="DIA"
            placeholderTextColor={Colors.textTertiary}
            maxLength={3}
          />
          <AppText style={styles.unitText}>mmHg</AppText>
        </View>
        <View style={styles.divider} />

        <NumericRow
          label="Heart rate"
          unit="bpm"
          value={heartRate}
          onChangeText={setHeartRate}
          placeholder="e.g. 68"
        />
        <View style={styles.divider} />

        <NumericRow
          label="Weight"
          unit="kg"
          value={weight}
          onChangeText={setWeight}
          placeholder="e.g. 64.0"
        />
        <View style={styles.divider} />

        <NumericRow
          label="Nocturia"
          unit="times"
          value={nocturia}
          onChangeText={setNocturia}
          placeholder="0"
        />
      </SectionCard>

      {/* ── Subjective Sleep Quality ── */}
      <SectionCard title="Subjective Sleep Quality" emoji="😴">
        <DropdownPicker
          label="Overall quality"
          options={QUALITY_OPTIONS}
          value={quality}
          onSelect={setQuality}
        />
        <View style={styles.divider} />

        <NumericRow
          label="Morning energy"
          unit="/ 10"
          value={energy}
          onChangeText={(t) => {
            const n = parseInt(t, 10);
            if (t === '' || (n >= 1 && n <= 10)) setEnergy(t);
          }}
          placeholder="1–10"
        />
        <View style={styles.divider} />

        <DropdownPicker
          label="Dream quality"
          options={DREAM_OPTIONS}
          value={dreamQuality}
          onSelect={setDreamQuality}
        />
        <View style={styles.divider} />

        <DropdownPicker
          label="Wake reason"
          options={WAKE_REASONS}
          value={wakeReason}
          onSelect={setWakeReason}
        />
        <View style={styles.divider} />

        <DropdownPicker
          label="Headache on waking"
          options={HEADACHE_OPTIONS}
          value={headache}
          onSelect={setHeadache}
        />
        <View style={styles.divider} />

        <DropdownPicker
          label="Mouth dry / thirsty"
          options={DRY_MOUTH_OPTIONS}
          value={dryMouth}
          onSelect={setDryMouth}
        />
      </SectionCard>

      {/* ── Clinical Correlations ── */}
      <SectionCard title="Clinical Correlations" emoji="🔬">
        <InsightCard
          emoji="🩸"
          title="Glucose outlook"
          description={glucoseOutlook}
        />
        <InsightCard
          emoji="💓"
          title="BP pattern (HRV-based)"
          description={bpPattern}
        />
        <InsightCard
          emoji="💊"
          title="Metformin timing"
          description={metforminInsight}
        />
      </SectionCard>

      {/* ── Ayu Morning Insight ── */}
      <View style={styles.ayuCard}>
        <View style={styles.ayuHeader}>
          <AppText style={styles.ayuEmoji}>🤖</AppText>
          <AppText variant="bodyBold" color={Colors.primary} style={styles.ayuTitle}>
            Ayu Morning Insight
          </AppText>
        </View>
        <AppText
          variant="body"
          color={Colors.textSecondary}
          style={styles.ayuBody}>
          {ayuInsight}
        </AppText>
      </View>

      {/* ── Save Button ── */}
      {/* <TouchableOpacity
        activeOpacity={0.8}
        onPress={handleSave}
        disabled={!canSave}
        style={[styles.saveBtn, !canSave && styles.saveBtnDisabled]}>
        <AppText
          variant="bodyBold"
          color={Colors.white}
          style={styles.saveBtnText}>
          Save Morning Log
        </AppText>
      </TouchableOpacity> */}

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: s(16),
    paddingTop: vs(16),
    paddingBottom: vs(40),
  },

  /* Banner */
  bannerCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    padding: ms(18),
    marginBottom: vs(16),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  bannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(14),
  },
  sunEmoji: {
    fontSize: ms(36),
    marginRight: s(12),
  },
  bannerTextWrap: {
    flex: 1,
  },
  bannerGreeting: {
    fontSize: ms(18),
    marginBottom: vs(2),
  },
  bannerScoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: ms(12),
    padding: ms(12),
  },
  bannerScoreBadge: {
    width: s(68),
    height: s(68),
    borderRadius: s(34),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(14),
  },
  bannerScoreValue: {
    fontSize: ms(24),
    fontWeight: '800',
    color: Colors.white,
  },
  bannerScoreLabel: {
    fontSize: ms(7),
    fontWeight: '700',
    color: 'rgba(255,255,255,0.7)',
    letterSpacing: 0.4,
    marginTop: vs(1),
  },
  bannerStatsCol: {
    flex: 1,
    gap: vs(3),
  },

  /* Section Card */
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    padding: ms(16),
    marginBottom: vs(16),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(14),
  },
  sectionEmoji: {
    fontSize: ms(18),
    marginRight: s(8),
  },
  sectionTitle: {
    fontSize: ms(15),
  },

  /* Numeric Input Row */
  numericRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(6),
  },
  numericLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  numericRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  inputLabel: {
    fontSize: ms(13),
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  unitText: {
    fontSize: ms(11),
    fontWeight: '500',
    color: Colors.textTertiary,
    marginLeft: s(6),
  },
  numericInput: {
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    fontSize: ms(14),
    fontWeight: '600',
    color: Colors.textPrimary,
    minWidth: s(72),
    textAlign: 'center',
  },
  flagBadge: {
    borderRadius: ms(8),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
  },
  flagText: {
    fontSize: ms(10),
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  /* BP Row */
  bpRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(8),
    gap: s(6),
  },
  bpInput: {
    minWidth: s(60),
    flex: 0,
  },
  bpSlash: {
    fontSize: ms(18),
    fontWeight: '300',
    color: Colors.textTertiary,
  },

  /* Divider */
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: vs(10),
  },

  /* Dropdown */
  dropdownWrap: {
    paddingVertical: vs(4),
  },
  dropdownTrigger: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    marginTop: vs(6),
  },
  dropdownTriggerOpen: {
    borderColor: Colors.primary,
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
  },
  dropdownText: {
    fontSize: ms(13),
    fontWeight: '500',
  },
  dropdownArrow: {
    fontSize: ms(10),
    color: Colors.textTertiary,
  },
  dropdownList: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderTopWidth: 0,
    borderColor: Colors.primary,
    borderBottomLeftRadius: ms(10),
    borderBottomRightRadius: ms(10),
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  dropdownItemActive: {
    backgroundColor: Colors.tealBg,
  },
  dropdownItemText: {
    fontSize: ms(13),
    fontWeight: '500',
  },

  /* Insight Cards */
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.background,
    borderRadius: ms(12),
    padding: ms(14),
    marginBottom: vs(10),
  },
  insightEmoji: {
    fontSize: ms(22),
    marginRight: s(12),
    marginTop: vs(2),
  },
  insightBody: {
    flex: 1,
  },
  insightTitle: {
    fontSize: ms(13),
    marginBottom: vs(4),
  },
  insightDesc: {
    fontSize: ms(11.5),
    lineHeight: ms(17),
  },

  /* Ayu Card */
  ayuCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(16),
    padding: ms(18),
    marginBottom: vs(16),
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  ayuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  ayuEmoji: {
    fontSize: ms(22),
    marginRight: s(8),
  },
  ayuTitle: {
    fontSize: ms(15),
  },
  ayuBody: {
    fontSize: ms(12.5),
    lineHeight: ms(19),
  },

  /* Save Button */
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(8),
  },
  saveBtnDisabled: {
    opacity: 0.45,
  },
  saveBtnText: {
    fontSize: ms(15),
  },

  /* Bottom */
  bottomSpacer: {
    height: vs(30),
  },
});

export default MorningTab;
