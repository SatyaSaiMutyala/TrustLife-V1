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

import WheelTab from '../../../components/Fitness/Cycle/WheelTab';
import CalendarTab from '../../../components/Fitness/Cycle/CalendarTab';
import LogTab from '../../../components/Fitness/Cycle/DailyLogTab';
import HistoryTab from '../../../components/Fitness/Cycle/HistoryTab';

/* ─── Tab configuration ─────────────────────────────── */

const TABS = [
  {key: 'wheel', label: 'Cycle wheel'},
  {key: 'calendar', label: 'Calendar'},
  {key: 'log', label: 'Log today'},
  {key: 'history', label: 'History'},
];

/* ─── Component ─────────────────────────────────────── */

const CycleScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // ── State ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('wheel');

  // ── Tab content ────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'wheel':
        return <WheelTab />;
      case 'calendar':
        return <CalendarTab />;
      case 'log':
        return <LogTab />;
      case 'history':
        return <HistoryTab />;
      default:
        return null;
    }
  };

  // ── Bottom bar ─────────────────────────────────────
  const renderBottomBar = () => (
    <View style={[styles.bottomBar, {paddingBottom: Math.max(insets.bottom, vs(12))}]}>
      <TouchableOpacity
        style={styles.actionBtn}
        activeOpacity={0.8}>
        <AppText variant="bodyBold" style={styles.actionBtnText}>
          Save Day 24 log · Late luteal
        </AppText>
      </TouchableOpacity>

      <View style={styles.secondaryRow}>
        <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7}>
          <AppText variant="small" style={styles.secondaryBtnText}>
            Share with doctor
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7}>
          <AppText variant="small" style={styles.secondaryBtnText}>
            Set reminder
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

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
              {'\u2039'} Tracking
            </AppText>
          </TouchableOpacity>

          <View style={styles.pillBtn}>
            <AppText variant="small" style={styles.pillBtnText}>
              Save
            </AppText>
          </View>
        </View>

        <AppText variant="screenName" style={styles.headerTitle}>
          Cycle & hormonal health
        </AppText>
        <AppText variant="caption" style={styles.headerSubtitle}>
          Priya · Avg 28d · Day 24 · Late luteal · Tracking since Jan 2024
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
                {tab.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── TAB CONTENT ────────────────────────────────── */}
      <View style={styles.content}>{renderTabContent()}</View>

      {/* ── BOTTOM BAR (only on Log tab) ────────────────── */}
      {activeTab === 'log' && renderBottomBar()}
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
    borderRadius: ms(13),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: Colors.white,
    fontSize: ms(15),
  },
  secondaryRow: {
    flexDirection: 'row',
    marginTop: vs(10),
    gap: s(10),
  },
  secondaryBtn: {
    flex: 1,
    backgroundColor: Colors.background,
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    borderRadius: ms(13),
    paddingVertical: vs(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  secondaryBtnText: {
    color: Colors.textPrimary,
    fontSize: ms(12),
    fontWeight: '600',
  },
});

export default CycleScreen;
