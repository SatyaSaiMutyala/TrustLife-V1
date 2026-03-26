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

import DashboardTab from '../../../components/Fitness/Movement/DashboardTab';
import LogActivityTab from '../../../components/Fitness/Movement/LogActivityTab';
import TrendsTab from '../../../components/Fitness/Movement/TrendsTab';
import ConnectTab from '../../../components/Fitness/Movement/ConnectTab';

/* ─── Tab configuration ─────────────────────────────── */

const TABS = [
  {key: 'dashboard', label: 'Today', emoji: '\uD83D\uDCCA'},
  {key: 'log', label: 'Log', emoji: '\u270F\uFE0F'},
  {key: 'trends', label: 'Trends', emoji: '\uD83D\uDCC8'},
  {key: 'connect', label: 'Connect', emoji: '\uD83D\uDD17'},
];


/* ─── Helpers ───────────────────────────────────────── */

const formatDate = () => {
  const d = new Date();
  const days = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
  const months = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December',
  ];
  return `${days[d.getDay()]}, ${months[d.getMonth()]} ${d.getDate()}`;
};

/* ─── Component ─────────────────────────────────────── */

const MovementScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // ── State ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('dashboard');
  const [stepGoal, setStepGoal] = useState(8000);
  const [activeMinGoal, setActiveMinGoal] = useState(60);
  const [calorieGoal, setCalorieGoal] = useState(500);
  const [distanceGoal, setDistanceGoal] = useState(7);

  // ── Tab content ────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return (
          <DashboardTab
            stepGoal={stepGoal}
            activeMinGoal={activeMinGoal}
            calorieGoal={calorieGoal}
            distanceGoal={distanceGoal}
          />
        );
      case 'log':
        return <LogActivityTab />;
      case 'trends':
        return <TrendsTab />;
      case 'connect':
        return <ConnectTab />;
      default:
        return null;
    }
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
              {'\u2039'} Fitness
            </AppText>
          </TouchableOpacity>

          <View style={styles.topBarRight}>
            <TouchableOpacity style={styles.syncBtn}>
              <AppText variant="small" style={styles.syncBtnText}>
                {'\uD83D\uDD04'} Sync
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.settingsBtn}>
              <AppText variant="small" style={styles.settingsBtnText}>
                {'\u2699\uFE0F'}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        <AppText variant="screenName" style={styles.headerTitle}>
          Movement
        </AppText>
        <AppText variant="caption" style={styles.headerSubtitle}>
          {formatDate()} {'\u00B7'} Hyderabad
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

      {/* ── BOTTOM BAR (only on Log tab) ────────────────── */}
      {activeTab === 'log' && (
        <View style={[styles.bottomBar, {paddingBottom: Math.max(insets.bottom, vs(12))}]}>
          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8}>
            <AppText variant="bodyBold" style={styles.saveBtnText}>
              Save activity log
            </AppText>
          </TouchableOpacity>
        </View>
      )}
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
  topBarRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  syncBtn: {
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  syncBtnText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: ms(12),
    fontWeight: '600',
  },
  settingsBtn: {
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  settingsBtnText: {
    fontSize: ms(14),
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
    borderBottomColor: Colors.accent,
  },
  tabLabel: {
    fontSize: ms(11),
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: Colors.accent,
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
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: ms(15),
  },
  subButtons: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(24),
    marginTop: vs(10),
  },
  subBtn: {
    paddingVertical: vs(4),
    paddingHorizontal: s(8),
  },
  subBtnText: {
    color: Colors.textSecondary,
    fontSize: ms(12),
    fontWeight: '500',
  },
});

export default MovementScreen;
