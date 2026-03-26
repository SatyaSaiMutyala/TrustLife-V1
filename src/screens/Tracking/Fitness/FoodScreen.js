import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';

import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import {DEFAULT_MEALS, WATER_STATE} from '../../../constants/foodData';

import TodayTab from '../../../components/Fitness/Food/TodayTab';
import AddFoodTab from '../../../components/Fitness/Food/AddFoodTab';
import NutrientsTab from '../../../components/Fitness/Food/NutrientsTab';
import TrendsTab from '../../../components/Fitness/Food/TrendsTab';

/* ─── Tab configuration ─────────────────────────────── */

const TABS = [
  {key: 'today', label: 'Today', emoji: '\uD83C\uDF7D'},
  {key: 'add', label: 'Add food', emoji: '\u270F'},
  {key: 'nutrients', label: 'Nutrients', emoji: '\uD83D\uDD2C'},
  {key: 'trends', label: 'Trends', emoji: '\uD83D\uDCCA'},
];

/* ─── Helpers ───────────────────────────────────────── */

const fmtDate = () => {
  const d = new Date();
  const opts = {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'};
  return d.toLocaleDateString('en-IN', opts);
};

/* ─── Component ─────────────────────────────────────── */

const FoodScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // ── State ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('today');
  const [meals, setMeals] = useState(() =>
    DEFAULT_MEALS.map((m) => ({...m, entries: [...m.entries]})),
  );
  const [water, setWater] = useState({...WATER_STATE});
  const [selectedMeal, setSelectedMeal] = useState('breakfast');

  // ── Handlers ───────────────────────────────────────
  const handleAddFood = (mealId) => {
    setSelectedMeal(mealId || 'breakfast');
    setActiveTab('add');
  };

  const handleDoneAdding = () => {
    setActiveTab('today');
  };

  // ── Tab content ────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'today':
        return (
          <TodayTab
            meals={meals}
            setMeals={setMeals}
            water={water}
            setWater={setWater}
            onAddFood={handleAddFood}
            onSwitchTab={setActiveTab}
          />
        );
      case 'add':
        return (
          <AddFoodTab
            meals={meals}
            setMeals={setMeals}
            selectedMeal={selectedMeal}
            setSelectedMeal={setSelectedMeal}
            onDone={handleDoneAdding}
          />
        );
      case 'nutrients':
        return <NutrientsTab meals={meals} />;
      case 'trends':
        return <TrendsTab />;
      default:
        return null;
    }
  };

  // ── Bottom bar ─────────────────────────────────────
  const renderBottomBar = () => {
    if (activeTab !== 'today' && activeTab !== 'add') return null;

    const isToday = activeTab === 'today';
    const label = isToday ? '+ Log food' : '\u2713 Add to diary';
    const onPress = isToday ? () => handleAddFood('breakfast') : handleDoneAdding;

    return (
      <View style={[styles.bottomBar, {paddingBottom: Math.max(insets.bottom, vs(12))}]}>
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.8}
          onPress={onPress}>
          <AppText variant="bodyBold" style={styles.actionBtnText}>
            {label}
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── HEADER ─────────────────────────────────────── */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}>
            <AppText variant="body" style={styles.backText}>
              {'\u2039'} Dashboard
            </AppText>
          </TouchableOpacity>

          <View style={styles.pillBtn}>
            <AppText variant="small" style={styles.pillBtnText}>
              {'\uD83E\uDD57'} Nutrition
            </AppText>
          </View>
        </View>

        <AppText variant="screenName" style={styles.headerTitle}>
          Food Tracker
        </AppText>
        <AppText variant="caption" style={styles.headerSubtitle}>
          {fmtDate()}
        </AppText>
      </View>

      {/* ── TAB BAR ────────────────────────────────────── */}
      <View style={styles.tabBar}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab.key)}>
              <AppText
                variant="small"
                style={[
                  styles.tabLabel,
                  isActive && styles.tabLabelActive,
                ]}>
                {tab.emoji} {tab.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── TAB CONTENT ────────────────────────────────── */}
      <View style={styles.content}>{renderTabContent()}</View>

      {/* ── BOTTOM BAR ─────────────────────────────────── */}
      {renderBottomBar()}
    </View>
  );
};

/* ── STYLES ──────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  /* Header */
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: vs(16),
    paddingHorizontal: s(16),
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  backBtn: {
    paddingVertical: vs(4),
    paddingRight: s(12),
  },
  backText: {
    color: Colors.white,
    fontSize: ms(15),
  },
  pillBtn: {
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    backgroundColor: 'rgba(93,202,165,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(93,202,165,0.3)',
  },
  pillBtnText: {
    color: Colors.lightGreen,
    fontSize: ms(12),
    fontWeight: '600',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: ms(24),
    fontWeight: '700',
    marginBottom: vs(4),
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: ms(12),
  },

  /* Tab bar */
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(10),
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabLabel: {
    fontSize: ms(11),
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },

  /* Content */
  content: {
    flex: 1,
  },
  placeholder: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: s(24),
  },

  /* Bottom bar */
  bottomBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: s(16),
    paddingTop: vs(12),
  },
  actionBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: Colors.white,
    fontSize: ms(15),
  },
});

export default FoodScreen;
