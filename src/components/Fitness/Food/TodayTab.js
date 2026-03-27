import React, {useMemo, useState} from 'react';
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

const RING_SIZE = ms(130);
const DOT_COUNT = 20;
const DOT_SIZE = ms(10);

const MACRO_CONFIG = [
  {key: 'pro', label: 'Protein', unit: 'g', color: Colors.blue},
  {key: 'carb', label: 'Carbs', unit: 'g', color: Colors.amber},
  {key: 'fat', label: 'Fat', unit: 'g', color: Colors.purple},
  {key: 'fib', label: 'Fibre', unit: 'g', color: Colors.teal},
  {key: 'sug', label: 'Sugar', unit: 'g', color: Colors.red},
  {key: 'sod', label: 'Sodium', unit: 'mg', color: '#e67e22'},
];

const MICRO_CONFIG = [
  {key: 'sod', label: 'Sodium', unit: 'mg'},
  {key: 'pot', label: 'Potassium', unit: 'mg'},
  {key: 'iron', label: 'Iron', unit: 'mg'},
  {key: 'mag', label: 'Magnesium', unit: 'mg'},
  {key: 'folate', label: 'Folate', unit: '\u00B5g'},
  {key: 'vitC', label: 'Vitamin C', unit: 'mg'},
  {key: 'vitD', label: 'Vitamin D', unit: 'IU'},
  {key: 'vitB12', label: 'B12', unit: '\u00B5g'},
  {key: 'cal_m', label: 'Calcium', unit: 'mg'},
  {key: 'zinc', label: 'Zinc', unit: 'mg'},
];

const WATER_BOXES = 10;

/* ─── Helpers ───────────────────────────────────────── */

const clamp01 = v => Math.min(1, Math.max(0, v));
const pct = (val, goal) => (goal > 0 ? Math.round((val / goal) * 100) : 0);

const microFlag = ratio => {
  if (ratio >= 1.5) return {label: 'Over limit', color: Colors.red, bg: Colors.redBg};
  if (ratio >= 0.8) return null;
  if (ratio >= 0.5) return {label: 'Low', color: Colors.amber, bg: Colors.amberBg};
  return {label: 'Very low', color: Colors.red, bg: Colors.redBg};
};

const buildDinnerRec = totals => {
  const gaps = [];
  if (totals.pro < NUTRITION_GOALS.pro * 0.6) gaps.push('protein-rich dal or paneer');
  if (totals.mag < NUTRITION_GOALS.mag * 0.6) gaps.push('leafy greens like palak');
  if (totals.vitD < NUTRITION_GOALS.vitD * 0.5) gaps.push('egg or fortified milk');
  if (totals.fib < NUTRITION_GOALS.fib * 0.5) gaps.push('a bowl of salad');
  if (gaps.length === 0) return null;
  return `For dinner, consider adding ${gaps.join(', ')}.`;
};

/* ─── Component ─────────────────────────────────────── */

const TodayTab = ({meals, setMeals, water, setWater, onAddFood, onSwitchTab}) => {
  const [tappedGlasses, setTappedGlasses] = useState({});

  const totals = useMemo(() => calcTotal(meals), [meals]);
  const goalCal = NUTRITION_GOALS.cal;
  const eaten = totals.cal;
  const remaining = goalCal - eaten;
  const calRatio = clamp01(eaten / goalCal);
  const exercised = 0;

  /* Ayu insight */
  const ayuFlags = useMemo(() => {
    const flags = [];
    if (totals.sod > NUTRITION_GOALS.sod)
      flags.push({ico: '\u26A0\uFE0F', msg: `Sodium ${Math.round(totals.sod)} mg exceeds ${NUTRITION_GOALS.sod} mg limit`});
    if (totals.vitD < NUTRITION_GOALS.vitD * 0.5)
      flags.push({ico: '\uD83C\uDF1E', msg: 'Vitamin D very low \u2014 consider sunlight or fortified foods'});
    if (totals.mag < NUTRITION_GOALS.mag * 0.6)
      flags.push({ico: '\uD83E\uDDEA', msg: 'Magnesium intake below 60% \u2014 add leafy greens or nuts'});
    if (totals.pro < NUTRITION_GOALS.pro * 0.5)
      flags.push({ico: '\uD83E\uDD69', msg: 'Protein under half of target \u2014 add dal, egg or paneer'});
    if (flags.length === 0)
      flags.push({ico: '\u2705', msg: 'Looking balanced so far! Keep it up.'});
    return flags;
  }, [totals]);

  const dinnerRec = useMemo(() => buildDinnerRec(totals), [totals]);

  /* Handlers */
  const handleAddMeal = () => {
    const idx = meals.length + 1;
    setMeals(prev => [...prev, {id: `custom_${idx}`, name: `Meal ${idx}`, ico: '\uD83C\uDF7D', entries: []}]);
  };

  const handleRemoveEntry = (mealId, entryIdx) => {
    setMeals(prev =>
      prev.map(m => (m.id === mealId ? {...m, entries: m.entries.filter((_, i) => i !== entryIdx)} : m)),
    );
  };

  const handleRenameMeal = mealId => {
    // placeholder: cycles name suffix
    setMeals(prev =>
      prev.map(m => (m.id === mealId && m.id.startsWith('custom_') ? {...m, name: m.name + ' *'} : m)),
    );
  };

  const handleRemoveMeal = mealId => {
    setMeals(prev => prev.filter(m => m.id !== mealId));
  };

  const toggleGlass = idx => {
    if (idx < water.glasses) {
      // tapping a filled glass removes down to that level
      setWater(w => ({...w, glasses: idx}));
    } else {
      setWater(w => ({...w, glasses: idx + 1}));
    }
  };

  const addWater = () => setWater(w => ({...w, glasses: Math.min(w.glasses + 1, WATER_BOXES)}));
  const addWater500 = () => setWater(w => ({...w, glasses: Math.min(w.glasses + 2, WATER_BOXES)}));
  const removeWater = () => setWater(w => ({...w, glasses: Math.max(0, w.glasses - 1)}));
  const waterRatio = clamp01(water.glasses / (water.goalGlasses || WATER_BOXES));

  /* ─── Render ──────────────────────────────────────── */
  return (
    <ScrollView style={S.scroll} contentContainerStyle={S.content} showsVerticalScrollIndicator={false}>

      {/* ── 1. CALORIE RING ──────────────────────────── */}
      <View style={S.card}>
        <View style={S.ringWrap}>
          <View style={S.ringBox}>
            {Array.from({length: DOT_COUNT}).map((_, i) => {
              const filled = i < Math.round(calRatio * DOT_COUNT);
              const angle = (i / DOT_COUNT) * 2 * Math.PI - Math.PI / 2;
              const r = (RING_SIZE - DOT_SIZE) / 2;
              const cx = RING_SIZE / 2 + r * Math.cos(angle) - DOT_SIZE / 2;
              const cy = RING_SIZE / 2 + r * Math.sin(angle) - DOT_SIZE / 2;
              const dotColor = filled ? (remaining >= 0 ? Colors.primary : Colors.red) : Colors.borderLight;
              return (
                <View
                  key={i}
                  style={{
                    position: 'absolute',
                    left: cx,
                    top: cy,
                    width: DOT_SIZE,
                    height: DOT_SIZE,
                    borderRadius: DOT_SIZE / 2,
                    backgroundColor: dotColor,
                  }}
                />
              );
            })}
            <View style={S.ringCenter}>
              <AppText variant="header" style={S.ringCal}>{eaten}</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>kcal eaten</AppText>
              <AppText
                variant="bodyBold"
                color={remaining >= 0 ? Colors.primary : Colors.red}
                style={S.ringRem}>
                {remaining >= 0 ? `${remaining} remaining` : `${Math.abs(remaining)} over`}
              </AppText>
            </View>
          </View>
          <View style={S.ringStats}>
            <View style={S.ringStat}>
              <AppText variant="caption" color={Colors.textTertiary}>Goal</AppText>
              <AppText variant="bodyBold">{goalCal}</AppText>
            </View>
            <View style={S.ringDiv} />
            <View style={S.ringStat}>
              <AppText variant="caption" color={Colors.textTertiary}>Exercise</AppText>
              <AppText variant="bodyBold">{exercised}</AppText>
            </View>
          </View>
        </View>
      </View>

      {/* ── 2. MACRO GRID ────────────────────────────── */}
      <View style={S.card}>
        <AppText variant="bodyBold" style={S.secTitle}>Macronutrients</AppText>
        <View style={S.macroGrid}>
          {MACRO_CONFIG.map(m => {
            const val = Math.round(totals[m.key] || 0);
            const goal = NUTRITION_GOALS[m.key] || 1;
            const ratio = val / goal;
            const over = ratio > 1;
            const barColor = over ? Colors.red : m.color;
            return (
              <View key={m.key} style={S.macroCell}>
                <AppText variant="bodyBold" color={barColor}>{val}<AppText variant="small" color={Colors.textTertiary}>{m.unit}</AppText></AppText>
                <AppText variant="small" color={Colors.textSecondary}>{m.label} / {goal}{m.unit}</AppText>
                <View style={S.bar}>
                  <View style={[S.barFill, {width: `${clamp01(ratio) * 100}%`, backgroundColor: barColor}]} />
                </View>
              </View>
            );
          })}
        </View>
      </View>

      {/* ── 3. MEAL SECTIONS ─────────────────────────── */}
      {meals.map(meal => {
        const mt = calcMeal(meal.entries);
        const isCustom = meal.id.startsWith('custom_');
        return (
          <View key={meal.id} style={S.card}>
            <View style={S.mealHead}>
              <View style={S.mealHeadL}>
                <AppText style={S.mealIco}>{meal.ico}</AppText>
                <AppText variant="bodyBold">{meal.name}</AppText>
                <AppText variant="caption" color={Colors.textTertiary} style={{marginLeft: s(8)}}>
                  {mt.cal} kcal
                </AppText>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                {isCustom && (
                  <>
                    <TouchableOpacity onPress={() => handleRenameMeal(meal.id)} style={{marginRight: s(8)}}>
                      <AppText variant="small" color={Colors.blue}>Rename</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity onPress={() => handleRemoveMeal(meal.id)} style={{marginRight: s(8)}}>
                      <AppText variant="small" color={Colors.red}>Remove</AppText>
                    </TouchableOpacity>
                  </>
                )}
                <TouchableOpacity style={S.mealAddBtn} onPress={() => onAddFood(meal.id)}>
                  <AppText variant="bodyBold" color={Colors.accent}>+</AppText>
                </TouchableOpacity>
              </View>
            </View>

            {meal.entries.length === 0 ? (
              <TouchableOpacity style={S.emptyMeal} onPress={() => onAddFood(meal.id)}>
                <AppText variant="caption" color={Colors.textTertiary}>Tap + to log food</AppText>
              </TouchableOpacity>
            ) : (
              meal.entries.map((entry, idx) => {
                const food = FOOD_DB[entry.fid];
                if (!food) return null;
                const en = calcEntry(entry.fid, entry.qty);
                return (
                  <TouchableOpacity
                    key={`${entry.fid}-${idx}`}
                    style={S.entryRow}
                    activeOpacity={0.7}
                    onPress={() => onAddFood(meal.id, entry, idx)}
                    onLongPress={() => handleRemoveEntry(meal.id, idx)}>
                    <AppText style={S.entryIco}>{food.ico}</AppText>
                    <View style={S.entryInfo}>
                      <AppText variant="body" numberOfLines={1}>{food.n}</AppText>
                      <AppText variant="small" color={Colors.textTertiary}>
                        {entry.qty} {food.u}{entry.note ? ` \u00B7 ${entry.note}` : ''}
                      </AppText>
                      <AppText variant="small" color={Colors.textSecondary}>
                        P {en?.pro || 0}g {'\u00B7'} C {en?.carb || 0}g {'\u00B7'} F {en?.fat || 0}g
                      </AppText>
                    </View>
                    <View style={S.entryCalBadge}>
                      <AppText variant="bodyBold" color={Colors.textPrimary}>{en?.cal || 0}</AppText>
                      <AppText variant="small" color={Colors.textTertiary}>kcal</AppText>
                    </View>
                  </TouchableOpacity>
                );
              })
            )}
          </View>
        );
      })}

      {/* ── 4. MICRONUTRIENT SNAPSHOT ─────────────────── */}
      <View style={S.card}>
        <View style={S.microHead}>
          <AppText variant="bodyBold">Key micronutrients today</AppText>
          <TouchableOpacity onPress={() => onSwitchTab('nutrients')}>
            <AppText variant="caption" color={Colors.accent}>See all {'\u2192'}</AppText>
          </TouchableOpacity>
        </View>
        {MICRO_CONFIG.map(mic => {
          const val = totals[mic.key] || 0;
          const goal = NUTRITION_GOALS[mic.key] || 1;
          const ratio = val / goal;
          const flag = microFlag(ratio);
          return (
            <View key={mic.key} style={S.microRow}>
              <AppText variant="caption" numberOfLines={1} style={S.microLabel}>{mic.label}</AppText>
              <View style={S.microBarWrap}>
                <View style={S.microTrack}>
                  <View
                    style={[S.microFill, {
                      width: `${clamp01(ratio) * 100}%`,
                      backgroundColor: flag ? flag.color : Colors.accent,
                    }]}
                  />
                </View>
              </View>
              <AppText variant="small" color={Colors.textTertiary} style={S.microVal}>
                {Math.round(val)}/{goal}{mic.unit}
              </AppText>
              {flag ? (
                <View style={[S.microChip, {backgroundColor: flag.bg}]}>
                  <AppText variant="small" color={flag.color}>{flag.label}</AppText>
                </View>
              ) : (
                <View style={S.microChipPlaceholder} />
              )}
            </View>
          );
        })}
      </View>

      {/* ── 5. WATER INTAKE ──────────────────────────── */}
      <View style={S.card}>
        <View style={S.waterHead}>
          <AppText variant="bodyBold">{'\uD83D\uDCA7'} Water intake</AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            {water.glasses} / {water.goalGlasses || WATER_BOXES} glasses
          </AppText>
        </View>

        <View style={S.waterBoxes}>
          {Array.from({length: WATER_BOXES}).map((_, i) => {
            const filled = i < water.glasses;
            return (
              <TouchableOpacity
                key={i}
                style={[S.waterBox, filled && S.waterBoxFilled]}
                onPress={() => toggleGlass(i)}
                activeOpacity={0.7}>
                <AppText variant="small" color={filled ? Colors.white : Colors.textTertiary}>
                  {'\uD83E\uDD43'}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={S.bar}>
          <View style={[S.barFill, {width: `${waterRatio * 100}%`, backgroundColor: Colors.blue}]} />
        </View>

        <View style={S.waterBtns}>
          <TouchableOpacity style={S.waterBtn} onPress={removeWater}>
            <AppText variant="bodyBold" color={Colors.blue}>{'\u2212'}</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={[S.waterBtn, {flex: 1, marginHorizontal: s(8)}]} onPress={addWater}>
            <AppText variant="caption" color={Colors.blue}>+ Glass (250ml)</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={S.waterBtn} onPress={addWater500}>
            <AppText variant="caption" color={Colors.blue}>+ 500ml</AppText>
          </TouchableOpacity>
        </View>

        {water.glasses < (water.goalGlasses || WATER_BOXES) * 0.5 && (
          <View style={S.waterWarn}>
            <AppText variant="small" color={Colors.amber}>
              {'\u26A0\uFE0F'} You're behind on hydration. Try to drink a glass soon.
            </AppText>
          </View>
        )}
      </View>

      {/* ── 6. AYU DAILY INSIGHT ─────────────────────── */}
      <View style={[S.card, S.ayuCard]}>
        <View style={S.ayuTop}>
          <AppText style={{fontSize: ms(22), marginRight: s(8)}}>{'\uD83C\uDF3F'}</AppText>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={Colors.primary}>Ayu Daily Insight</AppText>
            {ayuFlags.map((f, i) => (
              <View key={i} style={S.ayuRow}>
                <AppText style={S.ayuIco}>{f.ico}</AppText>
                <AppText variant="caption" style={{flex: 1}}>{f.msg}</AppText>
              </View>
            ))}
            {dinnerRec && (
              <View style={S.ayuRow}>
                <AppText style={S.ayuIco}>{'\uD83C\uDF7D'}</AppText>
                <AppText variant="caption" color={Colors.primary} style={{flex: 1}}>{dinnerRec}</AppText>
              </View>
            )}
          </View>
        </View>
      </View>

      {/* ── 7. ADD ANOTHER MEAL ──────────────────────── */}
      <TouchableOpacity style={S.addMealBtn} onPress={handleAddMeal}>
        <AppText variant="bodyBold" color={Colors.accent}>+ Add another meal</AppText>
      </TouchableOpacity>

      <View style={{height: vs(100)}} />
    </ScrollView>
  );
};

/* ── STYLES ──────────────────────────────────────────── */
const S = StyleSheet.create({
  scroll: {flex: 1},
  content: {paddingHorizontal: s(16), paddingTop: vs(12)},

  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(16),
    marginBottom: vs(12),
  },
  secTitle: {marginBottom: vs(10)},

  /* 1 Ring */
  ringWrap: {alignItems: 'center'},
  ringBox: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(12),
  },
  ringCenter: {alignItems: 'center'},
  ringCal: {fontSize: ms(28), fontWeight: '700', lineHeight: ms(34)},
  ringRem: {marginTop: vs(2), fontSize: ms(12)},
  ringStats: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(4),
  },
  ringStat: {alignItems: 'center', paddingHorizontal: s(20)},
  ringDiv: {width: 1, height: vs(24), backgroundColor: Colors.borderLight},

  /* 2 Macro */
  macroGrid: {flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: s(-4)},
  macroCell: {
    width: '33.33%',
    paddingHorizontal: s(4),
    marginBottom: vs(12),
  },

  /* progress bar shared */
  bar: {
    height: vs(4),
    backgroundColor: Colors.borderLight,
    borderRadius: ms(2),
    overflow: 'hidden',
    marginTop: vs(4),
  },
  barFill: {height: '100%', borderRadius: ms(2)},

  /* 3 Meals */
  mealHead: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(8),
  },
  mealHeadL: {flexDirection: 'row', alignItems: 'center', flex: 1},
  mealIco: {fontSize: ms(18), marginRight: s(6)},
  mealAddBtn: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
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
  entryCalBadge: {
    alignItems: 'center',
    marginLeft: s(8),
    backgroundColor: Colors.background,
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },

  /* 4 Micro */
  microHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  microRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  microLabel: {width: s(70)},
  microBarWrap: {flex: 1, marginHorizontal: s(6)},
  microTrack: {
    height: vs(4),
    backgroundColor: Colors.borderLight,
    borderRadius: ms(2),
    overflow: 'hidden',
  },
  microFill: {height: '100%', borderRadius: ms(2)},
  microVal: {width: s(72), textAlign: 'right', marginRight: s(4)},
  microChip: {
    paddingHorizontal: s(6),
    paddingVertical: vs(1),
    borderRadius: ms(4),
    minWidth: s(52),
    alignItems: 'center',
  },
  microChipPlaceholder: {minWidth: s(52)},

  /* 5 Water */
  waterHead: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  waterBoxes: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: s(6),
    marginBottom: vs(8),
  },
  waterBox: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(6),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  waterBoxFilled: {
    backgroundColor: Colors.blue,
    borderColor: Colors.blue,
  },
  waterBtns: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10),
  },
  waterBtn: {
    paddingVertical: vs(8),
    paddingHorizontal: s(12),
    borderRadius: ms(8),
    backgroundColor: Colors.blueBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  waterWarn: {
    marginTop: vs(8),
    padding: s(10),
    borderRadius: ms(8),
    backgroundColor: Colors.amberBg,
  },

  /* 6 Ayu */
  ayuCard: {backgroundColor: Colors.tealBg},
  ayuTop: {flexDirection: 'row', alignItems: 'flex-start'},
  ayuRow: {flexDirection: 'row', alignItems: 'flex-start', marginTop: vs(6)},
  ayuIco: {fontSize: ms(14), marginRight: s(8), marginTop: vs(1)},

  /* 7 Add meal */
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
});

export default TodayTab;
