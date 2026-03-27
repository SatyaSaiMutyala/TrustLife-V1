import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  FlatList,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';

import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {FOOD_DB, FOOD_CATEGORIES, calcEntry} from '../../../constants/foodData';

/* ─── Constants ─────────────────────────────────────── */

const FOOD_LIST = Object.entries(FOOD_DB).map(([fid, f]) => ({fid, ...f}));
const RECENT_FREQUENT = FOOD_LIST.slice(0, 8);
const PRESETS = [0.5, 1, 1.5, 2, 3];
const UNIT_MODES = ['serving', '100g', 'grams'];

const MACRO_COLORS = {pro: Colors.blue, carb: Colors.amber, fat: Colors.purple};
const CAL_PER_G = {pro: 4, carb: 4, fat: 9};

const SECONDARY_KEYS = [
  {k: 'fib', label: 'Fibre', unit: 'g'},
  {k: 'sug', label: 'Sugar', unit: 'g'},
  {k: 'sod', label: 'Sodium', unit: 'mg'},
  {k: 'pot', label: 'Potassium', unit: 'mg'},
];
const MICRO_KEYS = [
  {k: 'cal_m', label: 'Calcium', unit: 'mg'},
  {k: 'iron', label: 'Iron', unit: 'mg'},
  {k: 'mag', label: 'Magnesium', unit: 'mg'},
  {k: 'vitC', label: 'Vitamin C', unit: 'mg'},
  {k: 'vitD', label: 'Vitamin D', unit: 'IU'},
  {k: 'vitB12', label: 'B12', unit: '\u00B5g'},
];

/* ─── Helpers ───────────────────────────────────────── */

function computeNutrition(food, qty, fdUnit) {
  if (!food) return null;
  let grams;
  if (fdUnit === '100g') grams = 100;
  else if (fdUnit === 'grams') grams = qty;
  else grams = qty * food.w; // serving
  const mult = grams / 100;
  const r = (v) => Math.round(((v || 0) * mult) * 10) / 10;
  return {
    cal: r(food.cal), pro: r(food.pro), carb: r(food.carb), fat: r(food.fat),
    fib: r(food.fib), sug: r(food.sug), sod: r(food.sod), pot: r(food.pot),
    cal_m: r(food.cal_m), iron: r(food.iron), mag: r(food.mag),
    vitC: r(food.vitC), vitD: r(food.vitD), vitB12: r(food.vitB12),
    grams: Math.round(grams * 10) / 10,
  };
}

/* ─── Component ─────────────────────────────────────── */

const AddFoodTab = ({meals, setMeals, selectedMeal, setSelectedMeal, onDone}) => {
  const [search, setSearch] = useState('');
  const [selectedFood, setSelectedFood] = useState(null);
  const [qty, setQty] = useState(1);
  const [fdUnit, setFdUnit] = useState('serving');

  const currentMealObj = meals.find((m) => m.id === selectedMeal) || meals[0];

  /* ── Filtered list ──────────────────────────────── */
  const filtered = useMemo(() => {
    if (!search.trim()) return [];
    const q = search.trim().toLowerCase();
    return FOOD_LIST.filter((f) => f.n.toLowerCase().includes(q));
  }, [search]);

  /* ── Preview nutrition ──────────────────────────── */
  const preview = useMemo(() => {
    if (!selectedFood) return null;
    return computeNutrition(selectedFood, qty, fdUnit);
  }, [selectedFood, qty, fdUnit]);

  const totalMacroCal = preview
    ? preview.pro * 4 + preview.carb * 4 + preview.fat * 9
    : 0;

  /* ── Handlers ───────────────────────────────────── */
  const handleSelectFood = useCallback((food) => {
    setSelectedFood(food);
    setQty(1);
    setFdUnit('serving');
  }, []);

  const handleAddToMeal = useCallback(() => {
    if (!selectedFood) return;
    const numQty = parseFloat(qty) || 1;
    setMeals((prev) =>
      prev.map((m) =>
        m.id === selectedMeal
          ? {...m, entries: [...m.entries, {fid: selectedFood.fid, qty: numQty, note: ''}]}
          : m,
      ),
    );
    setSelectedFood(null);
    setQty(1);
    setFdUnit('serving');
  }, [selectedFood, qty, selectedMeal, setMeals]);

  const adjustQty = useCallback((delta) => {
    setQty((q) => Math.max(0.5, Math.round(((parseFloat(q) || 1) + delta) * 10) / 10));
  }, []);

  /* ── Render food item ───────────────────────────── */
  const renderFoodItem = useCallback(
    ({item}) => (
      <TouchableOpacity
        style={[styles.foodItem, selectedFood?.fid === item.fid && styles.foodItemActive]}
        activeOpacity={0.7}
        onPress={() => handleSelectFood(item)}>
        <AppText style={styles.foodIco}>{item.ico}</AppText>
        <View style={styles.foodInfo}>
          <AppText variant="body" numberOfLines={1}>{item.n}</AppText>
          <AppText variant="small" color={Colors.textTertiary}>
            {item.cat} {'\u00B7'} {item.w}g per {item.u}
          </AppText>
          <AppText variant="small" color={Colors.textSecondary}>
            P {item.pro}g {'\u00B7'} C {item.carb}g {'\u00B7'} F {item.fat}g
          </AppText>
        </View>
        <View style={styles.calBadge}>
          <AppText variant="bodyBold">{item.cal}</AppText>
          <AppText variant="small" color={Colors.textTertiary}>kcal</AppText>
        </View>
      </TouchableOpacity>
    ),
    [selectedFood, handleSelectFood],
  );

  const keyExtractor = useCallback((item) => item.fid, []);

  /* ── Unit label helper ──────────────────────────── */
  const unitLabel = fdUnit === 'grams' ? 'g' : fdUnit === '100g' ? '(100g)' : selectedFood?.u || 'srv';

  /* ── LIST HEADER: meal selector + search + detail ─ */
  const ListHeader = useMemo(() => (
    <View>
      {/* ── 1. MEAL SELECTOR ──────────────────────── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mealPills}>
        {meals.map((meal) => {
          const active = meal.id === selectedMeal;
          return (
            <TouchableOpacity
              key={meal.id}
              style={[styles.mealPill, active && styles.mealPillActive]}
              onPress={() => setSelectedMeal(meal.id)}>
              <AppText variant="small" style={[styles.mealPillText, active && styles.mealPillTextActive]}>
                {meal.ico} {meal.name}{meal.entries.length > 0 ? ` (${meal.entries.length})` : ''}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── 2. SEARCH BAR ─────────────────────────── */}
      <View style={styles.searchWrap}>
        <View style={styles.searchBox}>
          <AppText style={styles.searchIco}>{'\uD83D\uDD0D'}</AppText>
          <TextInput
            style={styles.searchInput}
            placeholder="Search foods..."
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => { setSearch(''); setSelectedFood(null); }}>
              <AppText variant="caption" color={Colors.textTertiary}>{'\u2715'}</AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── 3. FOOD DETAIL PANEL ──────────────────── */}
      {selectedFood && preview && (
        <View style={styles.detailCard}>
          {/* Header */}
          <View style={styles.detailHeader}>
            <AppText style={styles.detailIco}>{selectedFood.ico}</AppText>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" numberOfLines={1}>{selectedFood.n}</AppText>
              <AppText variant="small" color={Colors.textTertiary}>
                {selectedFood.cat} {'\u00B7'} {selectedFood.w}g per {selectedFood.u}
              </AppText>
            </View>
            <TouchableOpacity onPress={() => { setSelectedFood(null); setQty(1); setFdUnit('serving'); }} style={styles.closeBtn}>
              <AppText variant="body" color={Colors.textTertiary}>{'\u2715'}</AppText>
            </TouchableOpacity>
          </View>

          {/* Quantity Section */}
          <View style={styles.qtyCard}>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.qtyLabel}>
              How much did you eat?
            </AppText>

            {/* Preset pills */}
            <View style={styles.presetRow}>
              {PRESETS.map((p) => {
                const label = p === 0.5 ? '\u00BD' : p === 1.5 ? '1\u00BD' : String(p);
                const active = qty === p && fdUnit === 'serving';
                return (
                  <TouchableOpacity
                    key={p}
                    style={[styles.presetPill, active && styles.presetPillActive]}
                    onPress={() => { setQty(p); setFdUnit('serving'); }}>
                    <AppText variant="small" style={active ? styles.presetTextActive : styles.presetText}>
                      {label} {selectedFood.u}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Stepper row */}
            <View style={styles.stepperRow}>
              <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustQty(-0.5)}>
                <AppText variant="bodyBold" color={Colors.primary}>{'\u2212'}</AppText>
              </TouchableOpacity>
              <TextInput
                style={styles.stepperInput}
                value={String(qty)}
                onChangeText={(t) => setQty(parseFloat(t) || 0)}
                keyboardType="decimal-pad"
                selectTextOnFocus
              />
              <TouchableOpacity style={styles.stepperBtn} onPress={() => adjustQty(0.5)}>
                <AppText variant="bodyBold" color={Colors.primary}>+</AppText>
              </TouchableOpacity>
              <AppText variant="small" color={Colors.textSecondary} style={{marginLeft: s(8)}}>
                {unitLabel}
              </AppText>
            </View>

            {/* Unit toggle */}
            <View style={styles.unitToggleRow}>
              {UNIT_MODES.map((mode) => {
                const active = fdUnit === mode;
                const lbl = mode === 'serving' ? `By ${selectedFood.u}` : mode === '100g' ? 'Per 100g' : 'Custom g';
                return (
                  <TouchableOpacity
                    key={mode}
                    style={[styles.unitPill, active && styles.unitPillActive]}
                    onPress={() => { setFdUnit(mode); if (mode === '100g') setQty(1); }}>
                    <AppText variant="small" style={active ? styles.unitPillTextActive : styles.unitPillText}>
                      {lbl}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>

          {/* Live Nutrition Preview */}
          <View style={styles.nutritionCard}>
            {/* Calorie hero */}
            <View style={styles.calHero}>
              <AppText variant="bodyBold" style={styles.calHeroNum}>{Math.round(preview.cal)}</AppText>
              <AppText variant="small" color={Colors.textTertiary}>kcal</AppText>
            </View>

            {/* Stacked % bar */}
            {totalMacroCal > 0 && (
              <View style={styles.stackedBar}>
                <View style={[styles.stackedSeg, {flex: preview.pro * 4, backgroundColor: Colors.blue, borderTopLeftRadius: ms(4), borderBottomLeftRadius: ms(4)}]} />
                <View style={[styles.stackedSeg, {flex: preview.carb * 4, backgroundColor: Colors.amber}]} />
                <View style={[styles.stackedSeg, {flex: preview.fat * 9, backgroundColor: Colors.purple, borderTopRightRadius: ms(4), borderBottomRightRadius: ms(4)}]} />
              </View>
            )}

            {/* 3 macro cards */}
            <View style={styles.macroRow}>
              {[
                {k: 'pro', label: 'Protein'},
                {k: 'carb', label: 'Carbs'},
                {k: 'fat', label: 'Fat'},
              ].map((m) => {
                const g = preview[m.k];
                const cal = Math.round(g * CAL_PER_G[m.k]);
                const pct = totalMacroCal > 0 ? Math.round((cal / totalMacroCal) * 100) : 0;
                return (
                  <View key={m.k} style={styles.macroCard}>
                    <AppText variant="bodyBold" color={MACRO_COLORS[m.k]}>{g}g</AppText>
                    <AppText variant="small" color={Colors.textTertiary}>{m.label}</AppText>
                    <AppText variant="small" color={Colors.textTertiary}>{cal} cal</AppText>
                    <View style={styles.miniBarBg}>
                      <View style={[styles.miniBarFill, {width: `${pct}%`, backgroundColor: MACRO_COLORS[m.k]}]} />
                    </View>
                  </View>
                );
              })}
            </View>

            {/* Secondary row */}
            <View style={styles.secondaryRow}>
              {SECONDARY_KEYS.map((s2) => (
                <View key={s2.k} style={styles.secondaryItem}>
                  <AppText variant="small" color={Colors.textSecondary}>{preview[s2.k]}{s2.unit}</AppText>
                  <AppText variant="small" color={Colors.textTertiary}>{s2.label}</AppText>
                </View>
              ))}
            </View>

            {/* Micro grid */}
            <View style={styles.microGrid}>
              {MICRO_KEYS.map((mi) => (
                <View key={mi.k} style={styles.microItem}>
                  <AppText variant="small" color={Colors.textSecondary}>{preview[mi.k]} {mi.unit}</AppText>
                  <AppText variant="small" color={Colors.textTertiary}>{mi.label}</AppText>
                </View>
              ))}
            </View>
          </View>

          {/* Add button */}
          <TouchableOpacity style={styles.addBtn} activeOpacity={0.8} onPress={handleAddToMeal}>
            <AppText variant="bodyBold" style={styles.addBtnText}>
              + Add to {currentMealObj?.name || 'meal'}
            </AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* ── 5. RECENT & FREQUENT (no search) ──────── */}
      {!search.trim() && !selectedFood && (
        <View style={styles.recentSection}>
          <AppText variant="bodyBold" style={styles.sectionLabel}>Recent & frequent</AppText>
        </View>
      )}
    </View>
  ), [meals, selectedMeal, search, selectedFood, preview, qty, fdUnit, unitLabel, totalMacroCal, handleAddToMeal, currentMealObj, adjustQty]);

  /* ── Data for FlatList ──────────────────────────── */
  const listData = search.trim() ? filtered : (!selectedFood ? RECENT_FREQUENT : []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={vs(100)}>
      <FlatList
        data={listData}
        renderItem={renderFoodItem}
        keyExtractor={keyExtractor}
        ListHeaderComponent={ListHeader}
        style={styles.list}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          search.trim() ? (
            <View style={styles.emptyWrap}>
              <AppText variant="body" color={Colors.textTertiary}>No foods match your search</AppText>
            </View>
          ) : null
        }
        ListFooterComponent={<View style={styles.bottomSpacer} />}
      />
    </KeyboardAvoidingView>
  );
};

/* ── STYLES ──────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {flex: 1},
  list: {flex: 1},
  listContent: {paddingBottom: vs(20)},

  /* 1. Meal pills */
  mealPills: {paddingHorizontal: s(12), paddingVertical: vs(10), gap: s(8)},
  mealPill: {
    paddingHorizontal: s(14), paddingVertical: vs(7), borderRadius: ms(20),
    backgroundColor: Colors.background, borderWidth: 1, borderColor: Colors.borderLight,
  },
  mealPillActive: {backgroundColor: Colors.accent + '18', borderColor: Colors.accent},
  mealPillText: {fontSize: ms(12), fontWeight: '500', color: Colors.textSecondary},
  mealPillTextActive: {color: Colors.accent, fontWeight: '700'},

  /* 2. Search */
  searchWrap: {paddingHorizontal: s(16), paddingVertical: vs(10), backgroundColor: Colors.white},
  searchBox: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background,
    borderRadius: ms(10), paddingHorizontal: s(12), height: vs(42),
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  searchIco: {fontSize: ms(16), marginRight: s(8)},
  searchInput: {flex: 1, fontSize: ms(14), color: Colors.textPrimary, paddingVertical: 0},

  /* 3. Detail panel */
  detailCard: {
    backgroundColor: Colors.white, marginHorizontal: s(16), marginTop: vs(8),
    borderRadius: ms(14), padding: s(16), borderWidth: 0.5, borderColor: Colors.borderLight,
  },
  detailHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(12)},
  detailIco: {fontSize: ms(32), marginRight: s(12)},
  closeBtn: {padding: s(6)},

  /* Quantity card */
  qtyCard: {
    backgroundColor: Colors.background, borderRadius: ms(14), padding: s(14), marginBottom: vs(12),
  },
  qtyLabel: {marginBottom: vs(8)},
  presetRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6), marginBottom: vs(10)},
  presetPill: {
    paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(20),
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderLight,
  },
  presetPillActive: {backgroundColor: Colors.tealBg, borderColor: Colors.accent},
  presetText: {color: Colors.textSecondary},
  presetTextActive: {color: Colors.primary, fontWeight: '700'},
  stepperRow: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(10)},
  stepperBtn: {
    width: ms(36), height: ms(36), alignItems: 'center', justifyContent: 'center',
    backgroundColor: Colors.background, borderRadius: ms(8), borderWidth: 1, borderColor: Colors.borderLight,
  },
  stepperInput: {
    width: ms(56), height: ms(36), textAlign: 'center', fontSize: ms(15),
    fontWeight: '600', color: Colors.textPrimary, paddingVertical: 0,
    backgroundColor: Colors.white, borderRadius: ms(8), marginHorizontal: s(6),
    borderWidth: 1, borderColor: Colors.borderLight,
  },
  unitToggleRow: {flexDirection: 'row', gap: s(6)},
  unitPill: {
    paddingHorizontal: s(12), paddingVertical: vs(5), borderRadius: ms(20),
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderLight,
  },
  unitPillActive: {backgroundColor: Colors.tealBg, borderColor: Colors.accent},
  unitPillText: {color: Colors.textSecondary},
  unitPillTextActive: {color: Colors.primary, fontWeight: '700'},

  /* Nutrition preview */
  nutritionCard: {
    backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14),
    marginBottom: vs(12), borderWidth: 0.5, borderColor: Colors.borderLight,
  },
  calHero: {alignItems: 'center', marginBottom: vs(8)},
  calHeroNum: {fontSize: ms(28), color: Colors.accent},
  stackedBar: {flexDirection: 'row', height: vs(8), borderRadius: ms(4), overflow: 'hidden', marginBottom: vs(12)},
  stackedSeg: {height: '100%'},
  macroRow: {flexDirection: 'row', justifyContent: 'space-between', gap: s(8), marginBottom: vs(12)},
  macroCard: {
    flex: 1, alignItems: 'center', backgroundColor: Colors.background,
    borderRadius: ms(10), paddingVertical: vs(8), paddingHorizontal: s(6),
  },
  miniBarBg: {
    width: '80%', height: vs(4), backgroundColor: Colors.borderLight,
    borderRadius: ms(2), marginTop: vs(4), overflow: 'hidden',
  },
  miniBarFill: {height: '100%', borderRadius: ms(2)},
  secondaryRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(10)},
  secondaryItem: {alignItems: 'center'},
  microGrid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between'},
  microItem: {width: '30%', alignItems: 'center', marginBottom: vs(6)},

  /* Add button */
  addBtn: {
    backgroundColor: Colors.primary, borderRadius: ms(10), paddingVertical: vs(13), alignItems: 'center',
  },
  addBtnText: {color: Colors.white, fontSize: ms(14)},

  /* 4. Food list items */
  foodItem: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white,
    borderRadius: ms(14), padding: s(12), marginHorizontal: s(16), marginBottom: vs(8),
    borderWidth: 0.5, borderColor: Colors.borderLight,
  },
  foodItemActive: {borderColor: Colors.accent, borderWidth: 1.5, backgroundColor: Colors.tealBg},
  foodIco: {fontSize: ms(24), marginRight: s(10)},
  foodInfo: {flex: 1},
  calBadge: {alignItems: 'center', marginLeft: s(8)},

  /* 5. Recent & frequent */
  recentSection: {paddingHorizontal: s(16), paddingTop: vs(12)},
  sectionLabel: {marginBottom: vs(6)},

  emptyWrap: {alignItems: 'center', paddingVertical: vs(40)},
  bottomSpacer: {height: vs(80)},
});

export default AddFoodTab;
