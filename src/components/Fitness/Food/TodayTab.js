import React, {useMemo} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';

import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {
  FOOD_DB,
  NUTRITION_GOALS,
  calcEntry,
  calcMeal,
  calcTotal,
} from '../../../constants/foodData';

/* ─── Constants ─────────────────────────────────────── */

const RING_SIZE = ms(180);
const RING_STROKE = ms(14);
const RING_RADIUS = (RING_SIZE - RING_STROKE) / 2;
const RING_CIRCUMFERENCE = 2 * Math.PI * RING_RADIUS;

const MACRO_CONFIG = [
  {key: 'pro', label: 'Protein', unit: 'g', color: Colors.blue},
  {key: 'carb', label: 'Carbs', unit: 'g', color: Colors.amber},
  {key: 'fat', label: 'Fat', unit: 'g', color: Colors.purple},
  {key: 'fib', label: 'Fibre', unit: 'g', color: Colors.teal},
  {key: 'sug', label: 'Sugar', unit: 'g', color: Colors.red},
  {key: 'sod', label: 'Sodium', unit: 'mg', color: '#e67e22'},
];

const MICRO_CONFIG = [
  {key: 'vitA', label: 'Vitamin A', unit: '\u00B5g'},
  {key: 'vitC', label: 'Vitamin C', unit: 'mg'},
  {key: 'vitD', label: 'Vitamin D', unit: 'IU'},
  {key: 'vitB12', label: 'Vitamin B12', unit: '\u00B5g'},
  {key: 'folate', label: 'Folate', unit: '\u00B5g'},
  {key: 'cal_m', label: 'Calcium', unit: 'mg'},
  {key: 'iron', label: 'Iron', unit: 'mg'},
  {key: 'mag', label: 'Magnesium', unit: 'mg'},
  {key: 'pot', label: 'Potassium', unit: 'mg'},
  {key: 'zinc', label: 'Zinc', unit: 'mg'},
];

/* ─── Helpers ───────────────────────────────────────── */

const clamp01 = (v) => Math.min(1, Math.max(0, v));
const pct = (val, goal) => (goal > 0 ? Math.round((val / goal) * 100) : 0);

const microFlag = (ratio) => {
  if (ratio >= 1.5) return {label: 'Over', color: Colors.red, bg: Colors.redBg};
  if (ratio >= 0.8) return null;
  if (ratio >= 0.5) return {label: 'Low', color: Colors.amber, bg: Colors.amberBg};
  return {label: 'Very Low', color: Colors.red, bg: Colors.redBg};
};

/* ─── Component ─────────────────────────────────────── */

const TodayTab = ({meals, setMeals, water, setWater, onAddFood, onSwitchTab}) => {
  // ── Derived totals ──────────────────────────────────
  const totals = useMemo(() => calcTotal(meals), [meals]);
  const goalCal = NUTRITION_GOALS.cal;
  const eaten = totals.cal;
  const remaining = goalCal - eaten;
  const calRatio = clamp01(eaten / goalCal);
  const exercised = 0; // placeholder for future integration

  // ── Ayu insight flags ───────────────────────────────
  const ayuFlags = useMemo(() => {
    const flags = [];
    if (totals.sod > NUTRITION_GOALS.sod) flags.push({ico: '\u26A0\uFE0F', msg: `Sodium ${Math.round(totals.sod)} mg exceeds ${NUTRITION_GOALS.sod} mg limit`});
    if (totals.vitD < NUTRITION_GOALS.vitD * 0.5) flags.push({ico: '\uD83C\uDF1E', msg: 'Vitamin D very low \u2014 consider sunlight or fortified foods'});
    if (totals.mag < NUTRITION_GOALS.mag * 0.6) flags.push({ico: '\uD83E\uDDEA', msg: 'Magnesium intake below 60% \u2014 add leafy greens or nuts'});
    if (totals.pro < NUTRITION_GOALS.pro * 0.5) flags.push({ico: '\uD83E\uDD69', msg: 'Protein under half of target \u2014 add dal, egg or paneer'});
    if (flags.length === 0) flags.push({ico: '\u2705', msg: 'Looking balanced so far! Keep it up.'});
    return flags;
  }, [totals]);

  // ── Add another meal ────────────────────────────────
  const handleAddMeal = () => {
    const idx = meals.length + 1;
    setMeals((prev) => [
      ...prev,
      {id: `custom_${idx}`, name: `Meal ${idx}`, ico: '\uD83C\uDF7D', entries: []},
    ]);
  };

  // ── Remove entry ────────────────────────────────────
  const handleRemoveEntry = (mealId, entryIdx) => {
    setMeals((prev) =>
      prev.map((m) =>
        m.id === mealId
          ? {...m, entries: m.entries.filter((_, i) => i !== entryIdx)}
          : m,
      ),
    );
  };

  // ── Water ───────────────────────────────────────────
  const addWater = () => setWater((w) => ({...w, glasses: w.glasses + 1}));
  const removeWater = () => setWater((w) => ({...w, glasses: Math.max(0, w.glasses - 1)}));
  const waterRatio = clamp01(water.glasses / water.goalGlasses);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>

      {/* ── 1. CALORIE RING ────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.ringContainer}>
          {/* Dot-segment calorie ring */}
          <View style={styles.ringOuter}>
            {Array.from({length: 30}).map((_, i) => {
              const filled = i < Math.round(calRatio * 30);
              const angle = (i / 30) * 360 - 90;
              const r = (RING_SIZE - RING_STROKE) / 2;
              const cx = RING_SIZE / 2 + r * Math.cos((angle * Math.PI) / 180) - ms(5);
              const cy = RING_SIZE / 2 + r * Math.sin((angle * Math.PI) / 180) - ms(5);
              const dotColor = filled
                ? (remaining >= 0 ? Colors.primary : Colors.red)
                : Colors.borderLight;
              return (
                <View
                  key={i}
                  style={{
                    position: 'absolute',
                    left: cx,
                    top: cy,
                    width: ms(10),
                    height: ms(10),
                    borderRadius: ms(5),
                    backgroundColor: dotColor,
                  }}
                />
              );
            })}
            <View style={styles.ringInner}>
              <AppText variant="header" style={styles.ringCalories}>
                {eaten}
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                kcal eaten
              </AppText>
              <AppText
                variant="bodyBold"
                color={remaining >= 0 ? Colors.primary : Colors.red}
                style={styles.ringRemaining}>
                {remaining >= 0 ? `${remaining} left` : `${Math.abs(remaining)} over`}
              </AppText>
            </View>
          </View>

          <View style={styles.ringStats}>
            <View style={styles.ringStatItem}>
              <AppText variant="caption" color={Colors.textTertiary}>Goal</AppText>
              <AppText variant="bodyBold">{goalCal}</AppText>
            </View>
            <View style={styles.ringStatDivider} />
            <View style={styles.ringStatItem}>
              <AppText variant="caption" color={Colors.textTertiary}>Food</AppText>
              <AppText variant="bodyBold">{eaten}</AppText>
            </View>
            <View style={styles.ringStatDivider} />
            <View style={styles.ringStatItem}>
              <AppText variant="caption" color={Colors.textTertiary}>Exercise</AppText>
              <AppText variant="bodyBold">{exercised}</AppText>
            </View>
          </View>
        </View>
      </View>

      {/* ── 2. MACRO GRID ──────────────────────────────── */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.sectionTitle}>Macronutrients</AppText>
        <View style={styles.macroGrid}>
          {MACRO_CONFIG.map((macro) => {
            const val = totals[macro.key] || 0;
            const goal = NUTRITION_GOALS[macro.key] || 1;
            const ratio = clamp01(val / goal);
            return (
              <View key={macro.key} style={styles.macroItem}>
                <View style={styles.macroHeader}>
                  <AppText variant="caption" color={Colors.textSecondary}>
                    {macro.label}
                  </AppText>
                  <AppText variant="small" color={Colors.textTertiary}>
                    {Math.round(val)}/{goal}{macro.unit}
                  </AppText>
                </View>
                <View style={styles.progressTrack}>
                  <View
                    style={[
                      styles.progressFill,
                      {width: `${ratio * 100}%`, backgroundColor: macro.color},
                    ]}
                  />
                </View>
                <AppText variant="small" color={macro.color} style={styles.macroPercent}>
                  {pct(val, goal)}%
                </AppText>
              </View>
            );
          })}
        </View>
      </View>

      {/* ── 3. MEAL SECTIONS ───────────────────────────── */}
      {meals.map((meal) => {
        const mealTotals = calcMeal(meal.entries);
        return (
          <View key={meal.id} style={styles.card}>
            {/* Meal header */}
            <View style={styles.mealHeader}>
              <View style={styles.mealHeaderLeft}>
                <AppText style={styles.mealIco}>{meal.ico}</AppText>
                <AppText variant="bodyBold">{meal.name}</AppText>
                <AppText variant="caption" color={Colors.textTertiary} style={styles.mealKcal}>
                  {mealTotals.cal} kcal
                </AppText>
              </View>
              <TouchableOpacity
                style={styles.mealAddBtn}
                onPress={() => onAddFood(meal.id)}>
                <AppText variant="bodyBold" color={Colors.accent}>+</AppText>
              </TouchableOpacity>
            </View>

            {/* Entries */}
            {meal.entries.length === 0 ? (
              <TouchableOpacity
                style={styles.emptyMeal}
                onPress={() => onAddFood(meal.id)}>
                <AppText variant="caption" color={Colors.textTertiary}>
                  No items yet {'\u2014'} tap + to add food
                </AppText>
              </TouchableOpacity>
            ) : (
              meal.entries.map((entry, idx) => {
                const food = FOOD_DB[entry.fid];
                if (!food) return null;
                const eNutr = calcEntry(entry.fid, entry.qty);
                return (
                  <TouchableOpacity
                    key={`${entry.fid}-${idx}`}
                    style={styles.entryRow}
                    activeOpacity={0.7}
                    onLongPress={() => handleRemoveEntry(meal.id, idx)}>
                    <AppText style={styles.entryIco}>{food.ico}</AppText>
                    <View style={styles.entryInfo}>
                      <AppText variant="body" numberOfLines={1}>
                        {food.n}
                      </AppText>
                      <AppText variant="small" color={Colors.textTertiary}>
                        {entry.qty} {food.u}
                        {entry.note ? ` \u00B7 ${entry.note}` : ''}
                      </AppText>
                      <AppText variant="small" color={Colors.textSecondary}>
                        P {eNutr?.pro || 0}g {'\u00B7'} C {eNutr?.carb || 0}g {'\u00B7'} F {eNutr?.fat || 0}g
                      </AppText>
                    </View>
                    <AppText variant="bodyBold" style={styles.entryCal}>
                      {eNutr?.cal || 0}
                    </AppText>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        );
      })}

      {/* ── 4. MICRONUTRIENT SNAPSHOT ──────────────────── */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.sectionTitle}>
          Micronutrient Snapshot
        </AppText>
        {MICRO_CONFIG.map((mic) => {
          const val = totals[mic.key] || 0;
          const goal = NUTRITION_GOALS[mic.key] || 1;
          const ratio = val / goal;
          const flag = microFlag(ratio);
          return (
            <View key={mic.key} style={styles.microRow}>
              <View style={styles.microLabel}>
                <AppText variant="caption" numberOfLines={1}>{mic.label}</AppText>
                {flag && (
                  <View style={[styles.microFlag, {backgroundColor: flag.bg}]}>
                    <AppText variant="small" color={flag.color}>
                      {flag.label}
                    </AppText>
                  </View>
                )}
              </View>
              <View style={styles.microBarContainer}>
                <View style={styles.microBarTrack}>
                  <View
                    style={[
                      styles.microBarFill,
                      {
                        width: `${clamp01(ratio) * 100}%`,
                        backgroundColor: flag ? flag.color : Colors.accent,
                      },
                    ]}
                  />
                </View>
                <AppText variant="small" color={Colors.textTertiary} style={styles.microVal}>
                  {Math.round(val)}/{goal}{mic.unit}
                </AppText>
              </View>
            </View>
          );
        })}
      </View>

      {/* ── 5. WATER INTAKE ────────────────────────────── */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.sectionTitle}>
          {'\uD83D\uDCA7'} Water Intake
        </AppText>

        <View style={styles.waterRow}>
          <TouchableOpacity style={styles.waterBtn} onPress={removeWater}>
            <AppText variant="bodyBold" color={Colors.blue}>{'\u2212'}</AppText>
          </TouchableOpacity>

          <View style={styles.waterCenter}>
            <AppText variant="header" color={Colors.blue}>
              {water.glasses}
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              of {water.goalGlasses} glasses ({water.glassML}ml each)
            </AppText>
          </View>

          <TouchableOpacity style={styles.waterBtn} onPress={addWater}>
            <AppText variant="bodyBold" color={Colors.blue}>+</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.progressTrack}>
          <View
            style={[
              styles.progressFill,
              {width: `${waterRatio * 100}%`, backgroundColor: Colors.blue},
            ]}
          />
        </View>

        {water.glasses < water.goalGlasses * 0.5 && (
          <View style={[styles.warningBox, {backgroundColor: Colors.amberBg}]}>
            <AppText variant="small" color={Colors.amber}>
              {'\u26A0\uFE0F'} You're behind on hydration. Try to drink a glass soon.
            </AppText>
          </View>
        )}

        <View style={styles.waterGlasses}>
          {Array.from({length: water.goalGlasses}).map((_, i) => (
            <View
              key={i}
              style={[
                styles.waterGlass,
                i < water.glasses && styles.waterGlassFilled,
              ]}>
              <AppText
                variant="small"
                color={i < water.glasses ? Colors.blue : Colors.textTertiary}>
                {'\uD83E\uDD43'}
              </AppText>
            </View>
          ))}
        </View>
      </View>

      {/* ── 6. AYU DAILY INSIGHT ───────────────────────── */}
      <View style={[styles.card, styles.ayuCard]}>
        <View style={styles.ayuHeader}>
          <AppText variant="bodyBold" color={Colors.primary}>
            {'\uD83E\uDDEC'} Ayu Daily Insight
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>
            Personalised for Priya
          </AppText>
        </View>
        {ayuFlags.map((flag, i) => (
          <View key={i} style={styles.ayuRow}>
            <AppText style={styles.ayuIco}>{flag.ico}</AppText>
            <AppText variant="caption" style={styles.ayuMsg}>{flag.msg}</AppText>
          </View>
        ))}
      </View>

      {/* ── 7. ADD ANOTHER MEAL ────────────────────────── */}
      <TouchableOpacity style={styles.addMealBtn} onPress={handleAddMeal}>
        <AppText variant="bodyBold" color={Colors.accent}>
          + Add another meal
        </AppText>
      </TouchableOpacity>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

/* ── STYLES ──────────────────────────────────────────── */
const styles = StyleSheet.create({
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: s(16), paddingTop: vs(12)},

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(16),
    marginBottom: vs(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  sectionTitle: {marginBottom: vs(10)},

  /* ── 1. Calorie Ring ─────────────────────────────────── */
  ringContainer: {alignItems: 'center'},
  ringOuter: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(12),
  },
  ringInner: {alignItems: 'center'},
  ringCalories: {fontSize: ms(32), fontWeight: '700', lineHeight: ms(38)},
  ringRemaining: {marginTop: vs(2), fontSize: ms(13)},
  ringStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(4),
  },
  ringStatItem: {alignItems: 'center', paddingHorizontal: s(16)},
  ringStatDivider: {
    width: 1,
    height: vs(24),
    backgroundColor: Colors.borderLight,
  },

  /* ── 2. Macro Grid ───────────────────────────────────── */
  macroGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: s(-4),
  },
  macroItem: {
    width: '50%',
    paddingHorizontal: s(4),
    marginBottom: vs(12),
  },
  macroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  macroPercent: {marginTop: vs(2)},
  progressTrack: {
    height: vs(6),
    backgroundColor: Colors.borderLight,
    borderRadius: ms(3),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: ms(3),
  },

  /* ── 3. Meal Sections ────────────────────────────────── */
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(8),
  },
  mealHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  mealIco: {fontSize: ms(18), marginRight: s(6)},
  mealKcal: {marginLeft: s(8)},
  mealAddBtn: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  emptyMeal: {
    paddingVertical: vs(16),
    alignItems: 'center',
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  entryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  entryIco: {fontSize: ms(22), marginRight: s(10)},
  entryInfo: {flex: 1},
  entryCal: {
    fontSize: ms(14),
    marginLeft: s(8),
    color: Colors.textPrimary,
  },

  /* ── 4. Micronutrient Snapshot ───────────────────────── */
  microRow: {
    marginBottom: vs(10),
  },
  microLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(3),
  },
  microFlag: {
    marginLeft: s(6),
    paddingHorizontal: s(6),
    paddingVertical: vs(1),
    borderRadius: ms(4),
  },
  microBarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  microBarTrack: {
    flex: 1,
    height: vs(5),
    backgroundColor: Colors.borderLight,
    borderRadius: ms(3),
    overflow: 'hidden',
    marginRight: s(8),
  },
  microBarFill: {
    height: '100%',
    borderRadius: ms(3),
  },
  microVal: {
    width: s(80),
    textAlign: 'right',
  },

  /* ── 5. Water Intake ─────────────────────────────────── */
  waterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(10),
  },
  waterBtn: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: Colors.blueBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterCenter: {
    alignItems: 'center',
    paddingHorizontal: s(20),
  },
  warningBox: {
    marginTop: vs(8),
    padding: s(10),
    borderRadius: ms(8),
  },
  waterGlasses: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: vs(10),
    gap: s(6),
  },
  waterGlass: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(6),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  waterGlassFilled: {
    backgroundColor: Colors.blueBg,
    borderColor: Colors.blue,
  },

  /* ── 6. Ayu Insight ──────────────────────────────────── */
  ayuCard: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.lightGreen,
  },
  ayuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  ayuRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(6),
  },
  ayuIco: {fontSize: ms(14), marginRight: s(8), marginTop: vs(1)},
  ayuMsg: {flex: 1},

  /* ── 7. Add Meal ─────────────────────────────────────── */
  addMealBtn: {
    alignItems: 'center',
    paddingVertical: vs(14),
    marginBottom: vs(8),
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: Colors.lightGreen,
    borderStyle: 'dashed',
  },

  bottomSpacer: {height: vs(80)},
});

export default TodayTab;
