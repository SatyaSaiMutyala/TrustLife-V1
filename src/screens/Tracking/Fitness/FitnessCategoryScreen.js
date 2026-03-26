import React, {useState, useCallback, useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRoute, useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import {CATEGORIES, INSIGHTS} from '../../../constants/fitnessData';
import SubcatGrid from '../../../components/Fitness/SubcatGrid';
import DurationPicker from '../../../components/Fitness/DurationPicker';
import IntensityPicker from '../../../components/Fitness/IntensityPicker';
import OutcomeCard from '../../../components/Fitness/OutcomeCard';
import StrengthFlow from '../../../components/Fitness/StrengthFlow';
import CardioExtras from '../../../components/Fitness/CardioExtras';
import MindBodyExtras from '../../../components/Fitness/MindBodyExtras';
import NumpadSheet from '../../../components/Fitness/NumpadSheet';

/* ───────────────────────────────────────────────────────
   Inline helpers
   ─────────────────────────────────────────────────────── */

const CONTEXTUAL_TAGS = [
  'Outdoor',
  'Indoor',
  'With shoes',
  'With music',
  'Fasted',
  'With partner',
];

const SectionTitle = ({label}) => (
  <View style={styles.sectionRow}>
    <AppText style={styles.sectionLabel}>{label}</AppText>
    <View style={styles.sectionLine} />
  </View>
);

const TagsRow = ({subcatTags = [], activeTags, setActiveTags}) => {
  const allTags = useMemo(() => {
    const combined = [...subcatTags];
    CONTEXTUAL_TAGS.forEach((t) => {
      if (!combined.includes(t)) combined.push(t);
    });
    return combined;
  }, [subcatTags]);

  const toggle = useCallback(
    (tag) => {
      setActiveTags((prev) =>
        prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag],
      );
    },
    [setActiveTags],
  );

  return (
    <View style={styles.tagsWrap}>
      {allTags.map((tag) => {
        const active = activeTags.includes(tag);
        return (
          <TouchableOpacity
            key={tag}
            activeOpacity={0.7}
            style={[styles.tagChip, active && styles.tagChipActive]}
            onPress={() => toggle(tag)}>
            <AppText
              style={[styles.tagChipText, active && styles.tagChipTextActive]}>
              {tag}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const InsightCard = ({subcatId}) => {
  const text = INSIGHTS[subcatId];
  if (!text) return null;

  return (
    <View style={styles.insightCard}>
      <AppText style={styles.insightTitle}>
        {'🔬 Health Intelligence Insight'}
      </AppText>
      <AppText style={styles.insightText}>{text}</AppText>
    </View>
  );
};

/* ───────────────────────────────────────────────────────
   Main Screen
   ─────────────────────────────────────────────────────── */

const FitnessCategoryScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const catId = route.params?.catId || 'A';

  const category = CATEGORIES[catId];
  const subcats = category?.subcats ?? [];

  /* ── State ── */
  const [subcat, setSubcat] = useState(null);
  const [intensity, setIntensity] = useState(null);
  const [bodyPart, setBodyPart] = useState(null);
  const [exercise, setExercise] = useState(null);
  const [sets, setSets] = useState([{reps: '', weight: '', rpe: ''}]);
  const [restSec, setRestSec] = useState(90);
  const [tempo, setTempo] = useState({e: '3', h: '0', c: '2'});
  const [rpe, setRpe] = useState(null);
  const [goal, setGoal] = useState(null);
  const [durationMin, setDurationMin] = useState(30);
  const [durationSec, setDurationSec] = useState(0);
  const [distance, setDistance] = useState(0);
  const [hrZone, setHrZone] = useState(null);
  const [totalCal, setTotalCal] = useState(0);
  const [totalMin, setTotalMin] = useState(0);
  const [numpadVisible, setNumpadVisible] = useState(false);
  const [numpadConfig, setNumpadConfig] = useState({});
  const [funcFilter, setFuncFilter] = useState('all');
  const [notes, setNotes] = useState('');
  const [activeTags, setActiveTags] = useState([]);

  /* ── Derived ── */
  const isCardio = catId === 'B';
  const isStrength = catId === 'C';
  const isMindBody = catId === 'E';
  const isGeneric = !isCardio && !isStrength && !isMindBody;

  const selectedSubcat = subcat;
  const estKcal = useMemo(() => {
    if (!selectedSubcat?.kcal_per_min) return 0;
    return Math.round(selectedSubcat.kcal_per_min * durationMin);
  }, [selectedSubcat, durationMin]);

  const saveLabel = useMemo(() => {
    let label = 'Save Activity';
    if (selectedSubcat?.name) {
      label = `Save ${selectedSubcat.name}`;
      if (intensity) label += ` · Z${intensity}`;
    }
    return label;
  }, [selectedSubcat, intensity]);

  /* ── Numpad handler ── */
  const openNumpad = useCallback((field, label, hint, min, max) => {
    const setterMap = {
      durationMin: setDurationMin,
      durationSec: setDurationSec,
      distance: setDistance,
      restSec: setRestSec,
    };
    setNumpadConfig({
      label,
      hint,
      onConfirm: (val) => {
        const clamped = Math.min(Math.max(val, min ?? 0), max ?? Infinity);
        setterMap[field]?.(clamped);
      },
    });
    setNumpadVisible(true);
  }, []);

  /* ── Save handler ── */
  const handleSave = useCallback(() => {
    const kcal = selectedSubcat?.kcal_per_min
      ? Math.round(selectedSubcat.kcal_per_min * durationMin)
      : 0;
    setTotalCal((prev) => prev + kcal);
    setTotalMin((prev) => prev + durationMin);
    navigation.goBack();
  }, [selectedSubcat, durationMin, navigation]);

  /* ── Subcat select handler ── */
  const handleSubcatSelect = useCallback((item) => {
    setSubcat(item);
    setActiveTags([]);
  }, []);

  /* ── Render ── */
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ═══════ HEADER ═══════ */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <TouchableOpacity
          activeOpacity={0.7}
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <AppText style={styles.backText}>{'‹ Back'}</AppText>
        </TouchableOpacity>

        <AppText variant="screenName" style={styles.headerTitle}>
          {category?.name ?? 'Fitness'}
        </AppText>
        <AppText style={styles.headerDesc}>
          {category?.desc ?? ''}
        </AppText>

        {/* Stats band */}
        <View style={styles.statsBand}>
          <View style={styles.statBox}>
            <AppText style={styles.statValue}>{totalCal + estKcal}</AppText>
            <AppText style={styles.statLabel}>kcal today</AppText>
          </View>
          <View style={styles.statBox}>
            <AppText style={styles.statValue}>{totalMin + durationMin}</AppText>
            <AppText style={styles.statLabel}>active min</AppText>
          </View>
          <View style={styles.statBox}>
            <AppText style={styles.statValue}>658</AppText>
            <AppText style={styles.statLabel}>HPS score</AppText>
          </View>
          <View style={styles.statBox}>
            <AppText style={styles.statValue}>3</AppText>
            <AppText style={styles.statLabel}>day streak</AppText>
          </View>
        </View>
      </View>

      {/* ═══════ SCROLLABLE BODY ═══════ */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">
        {/* ── 1. SubcatGrid (all flows) ── */}
        <SectionTitle label="CHOOSE ACTIVITY" />
        <SubcatGrid
          subcats={subcats}
          selectedId={selectedSubcat?.id}
          onSelect={handleSubcatSelect}
          durationMin={durationMin}
        />

        {selectedSubcat && (
          <>
            {/* ═══ GENERIC FLOW (A, D, F, G, H) ═══ */}
            {isGeneric && (
              <>
                <SectionTitle label="DURATION" />
                <DurationPicker
                  durationMin={durationMin}
                  durationSec={durationSec}
                  onChangeMin={setDurationMin}
                  onChangeSec={setDurationSec}
                  onOpenNumpad={openNumpad}
                />

                <SectionTitle label="INTENSITY" />
                <IntensityPicker
                  selectedId={intensity}
                  onSelect={setIntensity}
                />

                <SectionTitle label="TAGS" />
                <TagsRow
                  subcatTags={selectedSubcat.tags ?? []}
                  activeTags={activeTags}
                  setActiveTags={setActiveTags}
                />

                <SectionTitle label="OUTCOME" />
                <OutcomeCard
                  subcat={selectedSubcat}
                  durationMin={durationMin}
                  distance={distance}
                />

                <InsightCard subcatId={selectedSubcat.id} />

                <SectionTitle label="NOTES" />
                <TextInput
                  style={styles.notesInput}
                  placeholder="Add notes about this session..."
                  placeholderTextColor={Colors.textTertiary}
                  multiline
                  value={notes}
                  onChangeText={setNotes}
                  textAlignVertical="top"
                />
              </>
            )}

            {/* ═══ CARDIO FLOW (B) ═══ */}
            {isCardio && (
              <>
                <SectionTitle label="DURATION" />
                <DurationPicker
                  durationMin={durationMin}
                  durationSec={durationSec}
                  onChangeMin={setDurationMin}
                  onChangeSec={setDurationSec}
                  onOpenNumpad={openNumpad}
                />

                <SectionTitle label="DISTANCE & HR ZONE" />
                <CardioExtras
                  distance={distance}
                  durationMin={durationMin}
                  durationSec={durationSec}
                  hrZone={hrZone}
                  setHrZone={setHrZone}
                  onOpenNumpad={openNumpad}
                />

                <SectionTitle label="INTENSITY" />
                <IntensityPicker
                  selectedId={intensity}
                  onSelect={setIntensity}
                />

                <SectionTitle label="OUTCOME" />
                <OutcomeCard
                  subcat={selectedSubcat}
                  durationMin={durationMin}
                  distance={distance}
                />

                <SectionTitle label="NOTES" />
                <TextInput
                  style={styles.notesInput}
                  placeholder="Add notes about this session..."
                  placeholderTextColor={Colors.textTertiary}
                  multiline
                  value={notes}
                  onChangeText={setNotes}
                  textAlignVertical="top"
                />
              </>
            )}

            {/* ═══ STRENGTH FLOW (C) ═══ */}
            {isStrength && (
              <>
                <SectionTitle label="STRENGTH TRAINING" />
                <StrengthFlow
                  bodyPart={bodyPart}
                  setBodyPart={setBodyPart}
                  exercise={exercise}
                  setExercise={setExercise}
                  sets={sets}
                  setSets={setSets}
                  restSec={restSec}
                  setRestSec={setRestSec}
                  tempo={tempo}
                  setTempo={setTempo}
                  rpe={rpe}
                  setRpe={setRpe}
                  goal={goal}
                  setGoal={setGoal}
                  funcFilter={funcFilter}
                  setFuncFilter={setFuncFilter}
                />

                <SectionTitle label="OUTCOME" />
                <OutcomeCard
                  subcat={selectedSubcat}
                  durationMin={durationMin}
                  distance={distance}
                />

                <SectionTitle label="NOTES" />
                <TextInput
                  style={styles.notesInput}
                  placeholder="Add notes about this session..."
                  placeholderTextColor={Colors.textTertiary}
                  multiline
                  value={notes}
                  onChangeText={setNotes}
                  textAlignVertical="top"
                />
              </>
            )}

            {/* ═══ MIND-BODY FLOW (E) ═══ */}
            {isMindBody && (
              <>
                <SectionTitle label="DURATION" />
                <DurationPicker
                  durationMin={durationMin}
                  durationSec={durationSec}
                  onChangeMin={setDurationMin}
                  onChangeSec={setDurationSec}
                  onOpenNumpad={openNumpad}
                />

                <SectionTitle label="MIND-BODY DETAILS" />
                <MindBodyExtras subcatId={selectedSubcat.id} />

                <SectionTitle label="OUTCOME" />
                <OutcomeCard
                  subcat={selectedSubcat}
                  durationMin={durationMin}
                  distance={distance}
                />

                <SectionTitle label="NOTES" />
                <TextInput
                  style={styles.notesInput}
                  placeholder="Add notes about this session..."
                  placeholderTextColor={Colors.textTertiary}
                  multiline
                  value={notes}
                  onChangeText={setNotes}
                  textAlignVertical="top"
                />
              </>
            )}
          </>
        )}

        {/* Bottom spacer for fixed bar */}
        <View style={styles.bottomSpacer} />
      </ScrollView>

      {/* ═══════ BOTTOM BAR ═══════ */}
      <View style={styles.bottomBar}>
        <View style={styles.bottomSubRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.subBtn}
            onPress={() => {
              setSubcat(null);
              setIntensity(null);
              setNotes('');
              setActiveTags([]);
              setDistance(0);
              setHrZone(null);
              setDurationMin(30);
              setDurationSec(0);
            }}>
            <AppText style={styles.subBtnText}>Reset</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.subBtn}
            onPress={() => navigation.goBack()}>
            <AppText style={styles.subBtnText}>Cancel</AppText>
          </TouchableOpacity>
        </View>
        <TouchableOpacity
          activeOpacity={0.8}
          style={[styles.saveBtn, !selectedSubcat && styles.saveBtnDisabled]}
          disabled={!selectedSubcat}
          onPress={handleSave}>
          <AppText style={styles.saveBtnText}>{saveLabel}</AppText>
        </TouchableOpacity>
      </View>

      {/* ═══════ NUMPAD SHEET ═══════ */}
      <NumpadSheet
        visible={numpadVisible}
        label={numpadConfig.label}
        hint={numpadConfig.hint}
        onConfirm={numpadConfig.onConfirm}
        onClose={() => setNumpadVisible(false)}
      />
    </View>
  );
};

/* ───────────────────────────────────────────────────────
   Styles
   ─────────────────────────────────────────────────────── */

const styles = StyleSheet.create({
  /* ── Container ── */
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  /* ── Header ── */
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: vs(16),
    paddingHorizontal: s(16),
  },
  backBtn: {
    alignSelf: 'flex-start',
    paddingVertical: vs(4),
    paddingRight: s(12),
    marginBottom: vs(8),
  },
  backText: {
    fontSize: ms(15),
    fontWeight: '600',
    color: Colors.white,
  },
  headerTitle: {
    fontSize: ms(22),
    fontWeight: '700',
    color: Colors.white,
    marginBottom: vs(4),
  },
  headerDesc: {
    fontSize: ms(12),
    fontWeight: '500',
    color: 'rgba(255,255,255,0.7)',
    lineHeight: ms(17),
    marginBottom: vs(14),
  },

  /* Stats band */
  statsBand: {
    flexDirection: 'row',
    gap: s(6),
  },
  statBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: ms(10),
    paddingVertical: vs(8),
    paddingHorizontal: s(6),
    alignItems: 'center',
  },
  statValue: {
    fontSize: ms(16),
    fontWeight: '700',
    color: Colors.white,
  },
  statLabel: {
    fontSize: ms(8),
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginTop: vs(2),
  },

  /* ── Scroll ── */
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: s(16),
    paddingTop: vs(16),
    paddingBottom: vs(8),
  },

  /* ── Section Title ── */
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(20),
    marginBottom: vs(10),
  },
  sectionLabel: {
    fontSize: ms(10),
    fontWeight: '700',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 1,
    marginRight: s(8),
  },
  sectionLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: Colors.borderLight,
  },

  /* ── Tags Row ── */
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
  },
  tagChip: {
    paddingVertical: vs(6),
    paddingHorizontal: s(12),
    borderRadius: ms(22),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  tagChipActive: {
    backgroundColor: '#e0f5ec',
    borderColor: Colors.accent,
  },
  tagChipText: {
    fontSize: ms(11),
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tagChipTextActive: {
    color: Colors.primary,
  },

  /* ── Insight Card ── */
  insightCard: {
    backgroundColor: '#f0faf5',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.lightGreen,
    paddingVertical: vs(14),
    paddingHorizontal: s(14),
    marginTop: vs(12),
  },
  insightTitle: {
    fontSize: ms(11),
    fontWeight: '700',
    color: Colors.primary,
    marginBottom: vs(6),
  },
  insightText: {
    fontSize: ms(11),
    fontWeight: '500',
    color: Colors.textSecondary,
    lineHeight: ms(16),
  },

  /* ── Notes ── */
  notesInput: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingVertical: vs(12),
    paddingHorizontal: s(14),
    fontSize: ms(13),
    fontWeight: '500',
    color: Colors.textPrimary,
    minHeight: vs(90),
  },

  /* ── Bottom spacer ── */
  bottomSpacer: {
    height: vs(140),
  },

  /* ── Bottom Bar ── */
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: s(16),
    paddingTop: vs(10),
    paddingBottom: vs(28),
  },
  bottomSubRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(16),
    marginBottom: vs(10),
  },
  subBtn: {
    paddingVertical: vs(6),
    paddingHorizontal: s(20),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
  subBtnText: {
    fontSize: ms(12),
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  saveBtn: {
    backgroundColor: Colors.accent,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
  },
  saveBtnDisabled: {
    backgroundColor: Colors.borderLight,
  },
  saveBtnText: {
    fontSize: ms(15),
    fontWeight: '700',
    color: Colors.white,
  },
});

export default FitnessCategoryScreen;
