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
import {
  FOOD_DB,
  FOOD_CATEGORIES,
  calcEntry,
} from '../../../constants/foodData';

/* ─── Constants ─────────────────────────────────────── */

const FOOD_LIST = Object.entries(FOOD_DB).map(([fid, f]) => ({fid, ...f}));

const RECENT_FIDS = ['chai_milk', 'roti', 'dal_tadka', 'banana', 'curd'];
const FREQUENT_FIDS = ['idli', 'rice_brown', 'sambar', 'almonds', 'egg_whole', 'spinach'];

/* ─── Component ─────────────────────────────────────── */

const AddFoodTab = ({meals, setMeals, selectedMeal, setSelectedMeal, onDone}) => {
  // ── State ──────────────────────────────────────────
  const [search, setSearch] = useState('');
  const [activeCat, setActiveCat] = useState('All');
  const [selectedFood, setSelectedFood] = useState(null);
  const [qty, setQty] = useState('1');

  // ── Filtered food list ─────────────────────────────
  const filtered = useMemo(() => {
    let list = FOOD_LIST;
    if (activeCat !== 'All') {
      list = list.filter((f) => f.cat === activeCat);
    }
    if (search.trim()) {
      const q = search.trim().toLowerCase();
      list = list.filter((f) => f.n.toLowerCase().includes(q) || f.cat.toLowerCase().includes(q));
    }
    return list;
  }, [search, activeCat]);

  // ── Current meal name ──────────────────────────────
  const currentMealObj = meals.find((m) => m.id === selectedMeal) || meals[0];

  // ── Handlers ───────────────────────────────────────
  const handleSelectFood = useCallback((food) => {
    setSelectedFood(food);
    setQty('1');
  }, []);

  const handleAddToMeal = useCallback(() => {
    if (!selectedFood) return;
    const numQty = parseFloat(qty) || 1;
    setMeals((prev) =>
      prev.map((m) =>
        m.id === selectedMeal
          ? {
              ...m,
              entries: [
                ...m.entries,
                {fid: selectedFood.fid, qty: numQty, note: ''},
              ],
            }
          : m,
      ),
    );
    setSelectedFood(null);
    setQty('1');
  }, [selectedFood, qty, selectedMeal, setMeals]);

  const handleDismissDetail = () => {
    setSelectedFood(null);
    setQty('1');
  };

  // ── Preview nutrition ──────────────────────────────
  const preview = useMemo(() => {
    if (!selectedFood) return null;
    const numQty = parseFloat(qty) || 1;
    return calcEntry(selectedFood.fid, numQty);
  }, [selectedFood, qty]);

  // ── Render food item ───────────────────────────────
  const renderFoodItem = useCallback(
    ({item}) => {
      const isSelected = selectedFood?.fid === item.fid;
      return (
        <TouchableOpacity
          style={[styles.foodItem, isSelected && styles.foodItemSelected]}
          activeOpacity={0.7}
          onPress={() => handleSelectFood(item)}>
          <AppText style={styles.foodIco}>{item.ico}</AppText>
          <View style={styles.foodInfo}>
            <AppText variant="body" numberOfLines={1}>{item.n}</AppText>
            <AppText variant="small" color={Colors.textTertiary}>
              {item.w}g {'\u00B7'} {item.u} {'\u00B7'} {item.cat}
            </AppText>
            <AppText variant="small" color={Colors.textSecondary}>
              P {item.pro}g {'\u00B7'} C {item.carb}g {'\u00B7'} F {item.fat}g
            </AppText>
          </View>
          <View style={styles.foodCalBadge}>
            <AppText variant="bodyBold" style={styles.foodCalText}>
              {item.cal}
            </AppText>
            <AppText variant="small" color={Colors.textTertiary}>kcal</AppText>
          </View>
        </TouchableOpacity>
      );
    },
    [selectedFood, handleSelectFood],
  );

  const keyExtractor = useCallback((item) => item.fid, []);

  // ── Recent & Frequent ──────────────────────────────
  const recentFoods = useMemo(
    () => RECENT_FIDS.map((fid) => FOOD_LIST.find((f) => f.fid === fid)).filter(Boolean),
    [],
  );
  const frequentFoods = useMemo(
    () => FREQUENT_FIDS.map((fid) => FOOD_LIST.find((f) => f.fid === fid)).filter(Boolean),
    [],
  );

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={vs(100)}>

      {/* ── 1. MEAL SELECTOR ──────────────────────────── */}
      <View style={styles.mealSelector}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.mealPills}>
          {meals.map((meal) => {
            const isActive = meal.id === selectedMeal;
            return (
              <TouchableOpacity
                key={meal.id}
                style={[styles.mealPill, isActive && styles.mealPillActive]}
                onPress={() => setSelectedMeal(meal.id)}>
                <AppText
                  variant="small"
                  style={[styles.mealPillText, isActive && styles.mealPillTextActive]}>
                  {meal.ico} {meal.name}
                  {meal.entries.length > 0 ? ` (${meal.entries.length})` : ''}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── 2. SEARCH BAR ─────────────────────────────── */}
      <View style={styles.searchContainer}>
        <View style={styles.searchBox}>
          <AppText style={styles.searchIcon}>{'\uD83D\uDD0D'}</AppText>
          <TextInput
            style={styles.searchInput}
            placeholder="Search foods..."
            placeholderTextColor={Colors.textTertiary}
            value={search}
            onChangeText={setSearch}
            returnKeyType="search"
          />
          {search.length > 0 && (
            <TouchableOpacity onPress={() => setSearch('')}>
              <AppText variant="caption" color={Colors.textTertiary}>{'\u2715'}</AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>

      {/* ── 3. CATEGORY PILLS ─────────────────────────── */}
      <View style={styles.catContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.catPills}>
          {FOOD_CATEGORIES.map((cat) => {
            const isActive = activeCat === cat;
            return (
              <TouchableOpacity
                key={cat}
                style={[styles.catPill, isActive && styles.catPillActive]}
                onPress={() => setActiveCat(cat)}>
                <AppText
                  variant="small"
                  style={[styles.catPillText, isActive && styles.catPillTextActive]}>
                  {cat}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── 4. FOOD DETAIL PANEL (when food selected) ── */}
      {selectedFood && preview && (
        <View style={styles.detailPanel}>
          <View style={styles.detailTop}>
            <View style={styles.detailHeader}>
              <AppText style={styles.detailIco}>{selectedFood.ico}</AppText>
              <View style={styles.detailNameBlock}>
                <AppText variant="bodyBold" numberOfLines={1}>{selectedFood.n}</AppText>
                <AppText variant="small" color={Colors.textTertiary}>
                  {selectedFood.cat} {'\u00B7'} {selectedFood.w}g per {selectedFood.u}
                </AppText>
              </View>
              <TouchableOpacity onPress={handleDismissDetail} style={styles.detailClose}>
                <AppText variant="body" color={Colors.textTertiary}>{'\u2715'}</AppText>
              </TouchableOpacity>
            </View>

            {/* Qty input */}
            <View style={styles.qtyRow}>
              <AppText variant="caption" color={Colors.textSecondary}>Servings:</AppText>
              <View style={styles.qtyInputWrap}>
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQty((q) => String(Math.max(0.5, (parseFloat(q) || 1) - 0.5)))}>
                  <AppText variant="bodyBold" color={Colors.primary}>{'\u2212'}</AppText>
                </TouchableOpacity>
                <TextInput
                  style={styles.qtyInput}
                  value={qty}
                  onChangeText={setQty}
                  keyboardType="decimal-pad"
                  selectTextOnFocus
                />
                <TouchableOpacity
                  style={styles.qtyBtn}
                  onPress={() => setQty((q) => String((parseFloat(q) || 1) + 0.5))}>
                  <AppText variant="bodyBold" color={Colors.primary}>+</AppText>
                </TouchableOpacity>
              </View>
              <AppText variant="small" color={Colors.textTertiary}>{selectedFood.u}</AppText>
            </View>

            {/* 4-stat preview */}
            <View style={styles.previewStats}>
              {[
                {label: 'kcal', val: preview.cal, color: Colors.accent},
                {label: 'Protein', val: `${preview.pro}g`, color: Colors.blue},
                {label: 'Carbs', val: `${preview.carb}g`, color: Colors.amber},
                {label: 'Fat', val: `${preview.fat}g`, color: Colors.purple},
              ].map((st) => (
                <View key={st.label} style={styles.previewStat}>
                  <AppText variant="bodyBold" color={st.color}>{st.val}</AppText>
                  <AppText variant="small" color={Colors.textTertiary}>{st.label}</AppText>
                </View>
              ))}
            </View>

            {/* Add button */}
            <TouchableOpacity style={styles.addBtn} activeOpacity={0.8} onPress={handleAddToMeal}>
              <AppText variant="bodyBold" style={styles.addBtnText}>
                Add to {currentMealObj?.name || 'meal'}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── 5. FOOD LIST ──────────────────────────────── */}
      <FlatList
        data={filtered}
        renderItem={renderFoodItem}
        keyExtractor={keyExtractor}
        style={styles.foodList}
        contentContainerStyle={styles.foodListContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
        ListEmptyComponent={
          <View style={styles.emptyList}>
            <AppText variant="body" color={Colors.textTertiary}>
              No foods match your search
            </AppText>
          </View>
        }
        ListFooterComponent={
          /* ── 6. RECENT & FREQUENT ─────────────────────── */
          !search.trim() && activeCat === 'All' ? (
            <View style={styles.recentSection}>
              {/* Recent */}
              <AppText variant="bodyBold" style={styles.recentTitle}>
                {'\uD83D\uDD52'} Recently Logged
              </AppText>
              {recentFoods.map((food) => (
                <TouchableOpacity
                  key={food.fid}
                  style={styles.recentItem}
                  onPress={() => handleSelectFood(food)}>
                  <AppText style={styles.recentIco}>{food.ico}</AppText>
                  <View style={styles.recentInfo}>
                    <AppText variant="body" numberOfLines={1}>{food.n}</AppText>
                    <AppText variant="small" color={Colors.textTertiary}>
                      {food.cal} kcal {'\u00B7'} {food.u}
                    </AppText>
                  </View>
                </TouchableOpacity>
              ))}

              {/* Frequent */}
              <AppText variant="bodyBold" style={[styles.recentTitle, {marginTop: vs(16)}]}>
                {'\u2B50'} Most Frequent
              </AppText>
              {frequentFoods.map((food) => (
                <TouchableOpacity
                  key={food.fid}
                  style={styles.recentItem}
                  onPress={() => handleSelectFood(food)}>
                  <AppText style={styles.recentIco}>{food.ico}</AppText>
                  <View style={styles.recentInfo}>
                    <AppText variant="body" numberOfLines={1}>{food.n}</AppText>
                    <AppText variant="small" color={Colors.textTertiary}>
                      {food.cal} kcal {'\u00B7'} {food.u}
                    </AppText>
                  </View>
                </TouchableOpacity>
              ))}

              <View style={styles.bottomSpacer} />
            </View>
          ) : (
            <View style={styles.bottomSpacer} />
          )
        }
      />
    </KeyboardAvoidingView>
  );
};

/* ── STYLES ──────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {flex: 1},

  /* ── 1. Meal Selector ────────────────────────────────── */
  mealSelector: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  mealPills: {
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
    gap: s(8),
  },
  mealPill: {
    paddingHorizontal: s(14),
    paddingVertical: vs(7),
    borderRadius: ms(20),
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  mealPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  mealPillText: {
    fontSize: ms(12),
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  mealPillTextActive: {
    color: Colors.white,
    fontWeight: '700',
  },

  /* ── 2. Search Bar ───────────────────────────────────── */
  searchContainer: {
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
    backgroundColor: Colors.white,
  },
  searchBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    paddingHorizontal: s(12),
    height: vs(42),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  searchIcon: {fontSize: ms(16), marginRight: s(8)},
  searchInput: {
    flex: 1,
    fontSize: ms(14),
    color: Colors.textPrimary,
    paddingVertical: 0,
  },

  /* ── 3. Category Pills ──────────────────────────────── */
  catContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  catPills: {
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    gap: s(6),
  },
  catPill: {
    paddingHorizontal: s(12),
    paddingVertical: vs(5),
    borderRadius: ms(16),
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  catPillActive: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.accent,
  },
  catPillText: {
    fontSize: ms(11),
    fontWeight: '500',
    color: Colors.textSecondary,
  },
  catPillTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },

  /* ── 4. Detail Panel ─────────────────────────────────── */
  detailPanel: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
  },
  detailTop: {},
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  detailIco: {fontSize: ms(28), marginRight: s(10)},
  detailNameBlock: {flex: 1},
  detailClose: {
    padding: s(6),
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
    gap: s(10),
  },
  qtyInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  qtyBtn: {
    width: ms(36),
    height: ms(36),
    alignItems: 'center',
    justifyContent: 'center',
  },
  qtyInput: {
    width: ms(50),
    height: ms(36),
    textAlign: 'center',
    fontSize: ms(15),
    fontWeight: '600',
    color: Colors.textPrimary,
    paddingVertical: 0,
  },
  previewStats: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: vs(12),
    paddingVertical: vs(8),
    backgroundColor: Colors.background,
    borderRadius: ms(10),
  },
  previewStat: {alignItems: 'center'},
  addBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(10),
    paddingVertical: vs(12),
    alignItems: 'center',
  },
  addBtnText: {
    color: Colors.white,
    fontSize: ms(14),
  },

  /* ── 5. Food List ────────────────────────────────────── */
  foodList: {flex: 1},
  foodListContent: {paddingHorizontal: s(16), paddingTop: vs(8)},
  foodItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(12),
    marginBottom: vs(8),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  foodItemSelected: {
    borderColor: Colors.accent,
    borderWidth: 1.5,
    backgroundColor: Colors.tealBg,
  },
  foodIco: {fontSize: ms(24), marginRight: s(10)},
  foodInfo: {flex: 1},
  foodCalBadge: {
    alignItems: 'center',
    marginLeft: s(8),
  },
  foodCalText: {
    fontSize: ms(15),
    color: Colors.textPrimary,
  },
  emptyList: {
    alignItems: 'center',
    paddingVertical: vs(40),
  },

  /* ── 6. Recent & Frequent ────────────────────────────── */
  recentSection: {
    marginTop: vs(8),
    paddingTop: vs(12),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  recentTitle: {
    marginBottom: vs(8),
  },
  recentItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  recentIco: {fontSize: ms(20), marginRight: s(10)},
  recentInfo: {flex: 1},

  bottomSpacer: {height: vs(80)},
});

export default AddFoodTab;
