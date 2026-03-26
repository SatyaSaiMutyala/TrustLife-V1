import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from'react-native-size-matters';

import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';

import TonightTab from '../../../components/Fitness/Sleep/TonightTab';
import MorningTab from '../../../components/Fitness/Sleep/MorningTab';
import TrendsTab from '../../../components/Fitness/Sleep/TrendsTab';

/* ─── Tab configuration ─────────────────────────────── */

const TABS = [
  {key: 'tonight', label: 'Tonight', emoji: '\uD83C\uDF19'},
  {key: 'morning', label: 'Morning', emoji: '\u2600\uFE0F'},
  {key: 'trends', label: 'Trends', emoji: '\uD83D\uDCCA'},
];

/* ─── Component ─────────────────────────────────────── */

const SleepScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // ── State ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('tonight');
  const [isTracking, setIsTracking] = useState(false);

  // ── Handlers ───────────────────────────────────────
  const handleToggleTracking = () => setIsTracking((prev) => !prev);

  // ── Tab content ────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'tonight':
        return (
          <TonightTab
            isTracking={isTracking}
            onToggleTracking={handleToggleTracking}
          />
        );
      case 'morning':
        return <MorningTab />;
      case 'trends':
        return <TrendsTab />;
      default:
        return null;
    }
  };

  // ── Bottom bar label ───────────────────────────────
  const renderBottomBar = () => {
    if (activeTab === 'trends') return null;

    let label = '';
    let icon = '';
    let onPress = null;
    let btnStyle = styles.saveBtn;

    if (activeTab === 'tonight') {
      if (isTracking) {
        label = 'Stop tracking';
        icon = '\u23F9';
        btnStyle = styles.stopBtn;
      } else {
        label = 'Start sleep tracking';
        icon = '\uD83C\uDF19';
      }
      onPress = handleToggleTracking;
    } else if (activeTab === 'morning') {
      label = 'Save morning data';
      icon = '\uD83D\uDCBE';
      onPress = () => {};
    }

    return (
      <View style={[styles.bottomBar, {paddingBottom: Math.max(insets.bottom, vs(12))}]}>
        <TouchableOpacity
          style={btnStyle}
          activeOpacity={0.8}
          onPress={onPress}>
          <AppText variant="bodyBold" style={styles.saveBtnText}>
            {icon} {label}
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
              {'\u2039'} Fitness
            </AppText>
          </TouchableOpacity>

          <View style={styles.pillBtn}>
            <AppText variant="small" style={styles.pillBtnText}>
              {'\uD83C\uDF19'} Sleep
            </AppText>
          </View>
        </View>

        <AppText variant="screenName" style={styles.headerTitle}>
          Sleep Tracker
        </AppText>
        <AppText variant="caption" style={styles.headerSubtitle}>
          Phone {'\u00B7'} Wearable {'\u00B7'} Manual — clinically contextualised
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
    backgroundColor: 'rgba(168,85,247,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(168,85,247,0.3)',
  },
  pillBtnText: {
    color: '#d8b4fe',
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
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  stopBtn: {
    backgroundColor: Colors.red,
    borderRadius: ms(12),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnText: {
    color: Colors.white,
    fontSize: ms(15),
  },
});

export default SleepScreen;
