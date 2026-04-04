import React, {useState, useCallback} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';
import DateTimePicker from '@react-native-community/datetimepicker';
import GlucoseDeviceSync from './GlucoseAutoView';
import GlucoseManualEntry from './GlucoseManualView';

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const READING_TYPES = [
  {id: 'fasting', label: '\ud83c\udf19 Fasting'},
  {id: 'pre_breakfast', label: '\ud83c\udf73 Pre-breakfast'},
  {id: 'post_breakfast', label: '\ud83c\udf7d Post-breakfast'},
  {id: 'pre_lunch', label: '\u2615\ufe0f Pre-lunch'},
  {id: 'post_lunch', label: '\ud83e\udd57 Post-lunch'},
  {id: 'pre_dinner', label: '\ud83c\udf1a Pre-dinner'},
  {id: 'post_dinner', label: '\ud83c\udf72 Post-dinner'},
  {id: 'bedtime', label: '\ud83d\ude34 Bedtime'},
  {id: 'random', label: '\ud83c\udfb2 Random'},
];

const ACTIVITY_CHIPS = [
  // Medication
  '\ud83d\udc8a Took Metformin',
  '\ud83d\udc89 Took insulin',
  '\ud83d\udc8a Other medication',
  // Movement
  '\ud83d\udeb6 Short walk',
  '\ud83c\udfc3 Workout / exercise',
  '\ud83e\uddd8 Yoga / stretching',
  // Food & drink
  '\u2615 Caffeine',
  '\ud83c\udf7a Alcohol',
  '\ud83c\udf7d Just ate',
  '\ud83c\udf6c Sugary snack',
  // Other
  '\ud83d\ude30 Feeling stressed',
  '\ud83e\udd12 Feeling unwell',
  '\ud83d\ude34 Just woke up',
  'Nothing in particular',
];

const SYMPTOM_CHIPS = [
  'None \u2714',
  '\ud83d\ude34 Fatigue',
  '\ud83e\uddd1 Thirsty',
  '\ud83e\udd15 Headache',
  '\ud83d\ude35 Brain fog',
  '\ud83d\udca0 Dizziness',
  '\u26a1 Foot tingling',
  '\ud83d\udc41 Blurred vision',
  '\ud83d\udeab Palpitations',
  '\ud83d\udebd Frequent urination',
  '\ud83e\udd22 Nausea',
];

const TARGET_DATA = [
  {label: 'Fasting', value: '<130', unit: 'mg/dL'},
  {label: 'Post-meal', value: '<180', unit: 'mg/dL'},
  {label: 'Bedtime', value: '100\u2013140', unit: 'mg/dL'},
  {label: 'TIR target', value: '>70%', unit: 'in range'},
];

const TARGET_DATA_MMOL = [
  {label: 'Fasting', value: '<7.2', unit: 'mmol/L'},
  {label: 'Post-meal', value: '<10.0', unit: 'mmol/L'},
  {label: 'Bedtime', value: '5.6\u20137.8', unit: 'mmol/L'},
  {label: 'TIR target', value: '>70%', unit: 'in range'},
];

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const GlucoseLogScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  // Unit state
  const [unit, setUnit] = useState('mgdl'); // 'mgdl' | 'mmol'

  // Glucose value (stored in mg/dL internally)
  const [glucoseVal, setGlucoseVal] = useState('');

  // Reading type
  const [activeType, setActiveType] = useState('fasting');

  // Activity chips (multi-select)
  const [selectedActivities, setSelectedActivities] = useState([]);

  // Mood / energy / stress
  const [mood, setMood] = useState(7);
  const [energy, setEnergy] = useState('Moderate');
  const [stress, setStress] = useState('Very low');

  // Symptom chips
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);

  // Notes
  const [notes, setNotes] = useState('');

  // Date & Time
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);

  const formatDate = (d) => {
    const now = new Date();
    const isToday = d.toDateString() === now.toDateString();
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    const prefix = isToday ? 'Today, ' : '';
    return `${prefix}${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };

  const formatTime = (d) => {
    let h = d.getHours();
    const m = d.getMinutes().toString().padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const onDateChange = (event, date) => {
    setShowDatePicker(false);
    if (date) setSelectedDate(prev => {
      const d = new Date(prev);
      d.setFullYear(date.getFullYear(), date.getMonth(), date.getDate());
      return d;
    });
  };

  const onTimeChange = (event, date) => {
    setShowTimePicker(false);
    if (date) setSelectedDate(prev => {
      const d = new Date(prev);
      d.setHours(date.getHours(), date.getMinutes());
      return d;
    });
  };

  // ── Helpers ──
  const isFastingType = activeType.includes('fasting') || activeType.includes('pre_');

  const getRangeIndicator = useCallback(() => {
    const raw = parseFloat(glucoseVal);
    if (isNaN(raw)) return null;
    const v = unit === 'mmol' ? raw * 18.0182 : raw;
    const target = isFastingType ? 130 : 180;
    if (v < 70) return {color: Colors.blueText, text: '\u2b07 Low \u2014 below ' + (unit === 'mmol' ? '3.9 mmol/L' : '70 mg/dL')};
    if (v <= target) return {color: Colors.tealText, text: '\u2713 In range'};
    if (v <= target + 50) return {color: Colors.amberDark, text: '\u2191 Slightly above target'};
    return {color: Colors.redDark, text: '\u26a0 High reading'};
  }, [glucoseVal, unit, isFastingType]);

  const toggleActivity = (chip) => {
    const isNeutral = chip === 'Nothing in particular';
    if (isNeutral) {
      setSelectedActivities([chip]);
    } else {
      setSelectedActivities(prev => {
        const without = prev.filter(c => c !== 'Nothing in particular');
        const next = without.includes(chip) ? without.filter(c => c !== chip) : [...without, chip];
        return next.length === 0 ? [] : next;
      });
    }
  };

  const toggleSymptom = (chip) => {
    const isNone = chip.startsWith('None');
    if (isNone) {
      setSelectedSymptoms([chip]);
    } else {
      setSelectedSymptoms(prev => {
        const without = prev.filter(c => !c.startsWith('None'));
        const next = without.includes(chip) ? without.filter(c => c !== chip) : [...without, chip];
        return next.length === 0 ? [] : next;
      });
    }
  };

  const targets = unit === 'mmol' ? TARGET_DATA_MMOL : TARGET_DATA;
  const rangeInfo = getRangeIndicator();

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── HEADER ── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={st.headerTitle}>Blood Glucose</AppText>
            <AppText variant="caption" style={st.headerSub}>Manual entry or sync from device</AppText>
          </View>
        </View>
      </View>

      {/* ── SCROLLABLE BODY ── */}
      <ScrollView
        style={st.scroll}
        contentContainerStyle={st.body}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* ── CONNECTED DEVICES SECTION ── */}
        <GlucoseDeviceSync unit={unit} />

        {/* ── AYU INTEL BUTTON ── */}
        <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'glucose', initialTab: 'glucoseIntel'})}>
          <View style={st.ayuIconWrap}>
            <Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.white} />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Blood Glucose</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginTop: vs(1)}}>Patterns - Risk flags - Recommendations</AppText>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>

        {/* ── "or enter manually" DIVIDER ── */}
        <View style={st.dividerRow}>
          <View style={st.dividerLine} />
          <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '600'}}>
            or enter manually
          </AppText>
          <View style={st.dividerLine} />
        </View>

        {/* ── INPUT CARD: Reading value ── */}
        <GlucoseManualEntry
          unit={unit}
          setUnit={setUnit}
          glucoseVal={glucoseVal}
          setGlucoseVal={setGlucoseVal}
          activeType={activeType}
          setActiveType={setActiveType}
          readingTypes={READING_TYPES}
          rangeInfo={rangeInfo}
        />

        {/* ── DATE / TIME CARD ── */}
        <View style={st.inputCard}>
          <View style={st.dateTimeRow}>
            {/* Date section */}
            <TouchableOpacity style={{flex: 1}} onPress={() => setShowDatePicker(true)} activeOpacity={0.7}>
              <AppText
                variant="subtext"
                color={Colors.textSecondary}
                style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginBottom: vs(5)}}>
                Date
              </AppText>
              <AppText variant="bodyBold" color={Colors.textPrimary}>
                {formatDate(selectedDate)}
              </AppText>
            </TouchableOpacity>
            <View style={st.dateTimeDivider} />
            {/* Time section */}
            <TouchableOpacity style={{flex: 1}} onPress={() => setShowTimePicker(true)} activeOpacity={0.7}>
              <AppText
                variant="subtext"
                color={Colors.textSecondary}
                style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginBottom: vs(5)}}>
                Time
              </AppText>
              <AppText variant="bodyBold" color={Colors.textPrimary}>
                {formatTime(selectedDate)}
              </AppText>
            </TouchableOpacity>
          </View>

          {showDatePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={onDateChange}
            />
          )}
          {showTimePicker && (
            <DateTimePicker
              value={selectedDate}
              mode="time"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              maximumDate={new Date()}
              onChange={onTimeChange}
            />
          )}
        </View>

        {/* ── NOTES CARD ── */}
        <View style={st.inputCard}>
          <AppText
            variant="subtext"
            color={Colors.textSecondary}
            style={st.icLabel}>
            Notes (optional)
          </AppText>
          <TextInput
            style={st.notesInput}
            placeholder="e.g. Had a large dinner last night, stressed at work..."
            placeholderTextColor={Colors.textTertiary}
            multiline
            value={notes}
            onChangeText={setNotes}
          />
        </View>

        {/* ── ACTIVITY CONTEXT ── */}
        <View style={st.inputCard}>
          <AppText variant="subtext" color={Colors.textSecondary} style={st.icLabel}>
            Before this reading
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(10), lineHeight: ms(17)}}>
            What did you do{' '}
            <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>just before</AppText>
            {' '}taking this reading? Tap all that apply.
          </AppText>
          <View style={st.chipWrap}>
            {ACTIVITY_CHIPS.map(chip => {
              const isOn = selectedActivities.includes(chip);
              return (
                <TouchableOpacity
                  key={chip}
                  style={[st.symChip, isOn && st.symChipOn]}
                  onPress={() => toggleActivity(chip)}
                  activeOpacity={0.7}>
                  <AppText variant="small" color={isOn ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>
                    {chip}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── SYMPTOMS & MOOD ── */}
        <View style={st.inputCard}>
          <AppText variant="subtext" color={Colors.textSecondary} style={st.icLabel}>
            Symptoms & mood
          </AppText>

          {/* Mood slider */}
          <View style={{marginBottom: vs(12)}}>
            <View style={st.moodHeader}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>
                😊 How are you feeling?
              </AppText>
              <AppText
                variant="header"
                color={Colors.primary}
                style={{fontWeight: '800'}}>
                {mood}
              </AppText>
            </View>
            {/* Slider track (visual only — tap increments) */}
            <View style={st.sliderTrack}>
              <View style={[st.sliderFill, {width: `${(mood / 10) * 100}%`}]} />
              <View style={[st.sliderThumb, {left: `${(mood / 10) * 100}%`}]} />
            </View>
            <View style={st.sliderLabels}>
              <AppText variant="subtext" color={Colors.textTertiary}>😢 Very low</AppText>
              <AppText variant="subtext" color={Colors.textTertiary}>😐 Neutral</AppText>
              <AppText variant="subtext" color={Colors.textTertiary}>😊 Great</AppText>
            </View>
            {/* Tap to adjust mood — simple +/- buttons */}
            <View style={st.moodBtnRow}>
              <TouchableOpacity
                style={st.moodBtn}
                onPress={() => setMood(prev => Math.max(1, prev - 1))}>
                <AppText variant="bodyBold" color={Colors.primary}>−</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={st.moodBtn}
                onPress={() => setMood(prev => Math.min(10, prev + 1))}>
                <AppText variant="bodyBold" color={Colors.primary}>+</AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Energy & Stress */}
          <View style={st.energyStressRow}>
            <View style={{flex: 1}}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', marginBottom: vs(7)}}>
                ⚡ Energy
              </AppText>
              {['Very low', 'Low', 'Moderate', 'Good'].map(opt => {
                const isOn = energy === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[st.optionBtn, isOn && st.optionBtnOn]}
                    onPress={() => setEnergy(opt)}
                    activeOpacity={0.7}>
                    <AppText
                      variant="caption"
                      color={isOn ? Colors.white : Colors.textSecondary}
                      style={{fontWeight: isOn ? '700' : '500'}}>
                      {opt}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
            <View style={{width: s(10)}} />
            <View style={{flex: 1}}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', marginBottom: vs(7)}}>
                🧠 Stress
              </AppText>
              {['Very low', 'Low', 'Moderate', 'High'].map(opt => {
                const isOn = stress === opt;
                return (
                  <TouchableOpacity
                    key={opt}
                    style={[st.optionBtn, isOn && st.optionBtnOn]}
                    onPress={() => setStress(opt)}
                    activeOpacity={0.7}>
                    <AppText
                      variant="caption"
                      color={isOn ? Colors.white : Colors.textSecondary}
                      style={{fontWeight: isOn ? '700' : '500'}}>
                      {opt}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Symptoms */}
          <View style={{marginTop: vs(12)}}>
            <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', marginBottom: vs(7)}}>
              🩺 Symptoms right now{' '}
              <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '400'}}>(tap all that apply)</AppText>
            </AppText>
            <View style={st.chipWrap}>
              {SYMPTOM_CHIPS.map(chip => {
                const isOn = selectedSymptoms.includes(chip);
                const isNone = chip.startsWith('None');
                return (
                  <TouchableOpacity
                    key={chip}
                    style={[
                      st.symChip,
                      isOn && st.symChipOn,
                      isNone && isOn && {backgroundColor: Colors.tealBg, borderColor: '#a5d6c0'},
                    ]}
                    onPress={() => toggleSymptom(chip)}
                    activeOpacity={0.7}>
                    <AppText
                      variant="small"
                      color={isOn ? (isNone ? Colors.tealText : Colors.white) : Colors.textSecondary}
                      style={{fontWeight: '600'}}>
                      {chip}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        </View>

        {/* ── TARGET REFERENCE ── */}
        <View style={[st.inputCard, {padding: 0, overflow: 'hidden'}]}>
          <View style={{paddingHorizontal: s(13), paddingTop: vs(10), paddingBottom: vs(6)}}>
            <AppText
              variant="subtext"
              color={Colors.textSecondary}
              style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6}}>
              Your targets · Dr. Meera Mehta
            </AppText>
          </View>
          <View style={st.targetRow}>
            {targets.map((t, i) => (
              <View key={i} style={st.targetItem}>
                <AppText variant="subtext" color={Colors.textTertiary} style={{marginBottom: vs(2)}}>
                  {t.label}
                </AppText>
                <AppText variant="caption" color={Colors.primary} style={{fontWeight: '700'}}>
                  {t.value}
                </AppText>
                <AppText variant="subtext" color={Colors.textTertiary} style={{fontSize: Fonts.sizes.xs}}>
                  {t.unit}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        {/* ── SAVE BUTTON ── */}
        <TouchableOpacity style={st.logBtn} activeOpacity={0.8}>
          <AppText variant="body" color={Colors.white} style={{fontWeight: '700', fontSize: ms(15)}}>
            Save reading
          </AppText>
        </TouchableOpacity>

        {/* ── PAST READINGS SECTION LABEL ── */}
        <View style={st.secLabel}>
          <AppText
            variant="small"
            color={Colors.textSecondary}
            style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>
            Past readings
          </AppText>
          <View style={st.secLabelLine} />
        </View>

        {/* ── RECORDS LINK CARD ── */}
        <TouchableOpacity
          style={st.linkCard}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('Records', {tab: 'healthlogs', logFilter: 'glucose'})}>
          <View style={st.lcIconWrap}>
            <AppText style={{fontSize: ms(22)}}>🩸</AppText>
          </View>
          <View style={{flex: 1, minWidth: 0}}>
            <AppText
              variant="subtext"
              color={Colors.textSecondary}
              style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5, marginBottom: vs(2)}}>
              Blood glucose records
            </AppText>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginBottom: vs(3)}}>
              46 readings · March 2026
            </AppText>
            <View style={{flexDirection: 'row', gap: s(5), flexWrap: 'wrap'}}>
              <View style={[st.lcChip, {backgroundColor: Colors.tealBg}]}>
                <AppText variant="small" color={Colors.tealText} style={{fontWeight: '600'}}>
                  Avg FBG 125 mg/dL
                </AppText>
              </View>
              <View style={[st.lcChip, {backgroundColor: Colors.amberBg}]}>
                <AppText variant="small" color={Colors.amberDark} style={{fontWeight: '600'}}>
                  TIR 68%
                </AppText>
              </View>
            </View>
          </View>
          <AppText style={{fontSize: ms(20), color: Colors.primary, fontWeight: '300'}}>›</AppText>
        </TouchableOpacity>

        <View style={{height: vs(30)}} />
      </ScrollView>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header
  header: {
    backgroundColor: Colors.primary,
    paddingTop: vs(10),
    paddingBottom: vs(10),
    paddingHorizontal: s(16),
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(2),
  },
  backBtn: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    paddingRight: ms(2),
  },
  headerTitle: {
    color: Colors.white,
    fontSize: ms(18),
    fontWeight: '700',
  },
  headerSub: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: ms(11),
  },

  // Scroll / Body
  scroll: {
    flex: 1,
  },
  body: {
    paddingHorizontal: s(13),
    paddingTop: vs(12),
    paddingBottom: vs(90),
  },

  // Divider row
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    marginBottom: vs(12),
  },
  dividerLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#dde8e2',
  },

  // Input card
  inputCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    borderWidth: 0.5,
    borderColor: '#dde8e2',
    padding: ms(16),
    marginBottom: vs(12),
  },
  icLabel: {
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: vs(10),
  },

  // Date/time
  dateTimeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  dateTimeDivider: {
    width: 0.5,
    height: vs(36),
    backgroundColor: '#edf2ef',
  },

  // Notes
  notesInput: {
    width: '100%',
    borderWidth: 0.5,
    borderColor: '#dde8e2',
    borderRadius: ms(10),
    padding: ms(10),
    backgroundColor: Colors.background,
    minHeight: vs(60),
    fontSize: ms(12),
    color: Colors.textPrimary,
    textAlignVertical: 'top',
  },


  // Chip wrap
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(7),
  },
  symChip: {
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    borderRadius: ms(8),
    borderWidth: 0.5,
    borderColor: '#dde8e2',
    backgroundColor: Colors.background,
  },
  symChipOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // Mood
  moodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(8),
  },
  sliderTrack: {
    height: ms(6),
    backgroundColor: '#e5e7eb',
    borderRadius: ms(3),
    overflow: 'visible',
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: ms(3),
  },
  sliderThumb: {
    position: 'absolute',
    top: -ms(5),
    width: ms(16),
    height: ms(16),
    borderRadius: ms(8),
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
    marginLeft: -ms(8),
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(3),
  },
  moodBtnRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(12),
    marginTop: vs(8),
  },
  moodBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: Colors.background,
    borderWidth: 0.5,
    borderColor: '#dde8e2',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Energy / Stress
  energyStressRow: {
    flexDirection: 'row',
  },
  optionBtn: {
    paddingVertical: vs(6),
    paddingHorizontal: s(10),
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: '#dde8e2',
    backgroundColor: Colors.background,
    marginBottom: vs(5),
  },
  optionBtnOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // Target reference
  targetRow: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: '#f0f4f2',
    paddingVertical: vs(7),
    paddingHorizontal: s(13),
  },
  targetItem: {
    flex: 1,
    alignItems: 'center',
  },

  // Log button
  logBtn: {
    width: '100%',
    paddingVertical: vs(15),
    borderRadius: ms(14),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    marginTop: vs(4),
    marginBottom: vs(12),
  },

  // Section label
  secLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(4),
    marginBottom: vs(10),
  },
  secLabelLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#dde8e2',
  },

  // Link card
  linkCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#dde8e2',
    padding: ms(13),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    marginBottom: vs(10),
  },
  lcIconWrap: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(12),
    backgroundColor: '#fce4ec',
    alignItems: 'center',
    justifyContent: 'center',
  },
  lcChip: {
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(7),
  },
  ayuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    backgroundColor: Colors.accent,
    borderRadius: ms(12),
    padding: ms(12),
    marginBottom: vs(12),
  },
  ayuIconWrap: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

});

export default GlucoseLogScreen;
