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

import LogTab from '../../../components/Fitness/Lifestyle/LogTab';
import AnalyticsTab from '../../../components/Fitness/Lifestyle/AnalyticsTab';

/* ─── Tab configuration ─────────────────────────────── */

const TABS = [
  {key: 'log', label: 'Log', emoji: '\uD83D\uDCCB'},
  {key: 'analytics', label: 'Analytics', emoji: '\uD83D\uDCCA'},
];

/* ─── Component ─────────────────────────────────────── */

const LifestyleScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('log');

  /* ── Save handler ────────────────────────────────── */
  const handleSave = (payload) => {
    // TODO: persist payload
  };

  /* ── Tab content ─────────────────────────────────── */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'log':
        return <LogTab onSave={handleSave} />;
      case 'analytics':
        return <AnalyticsTab />;
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

          <TouchableOpacity style={styles.settingsBtn}>
            <AppText variant="small" style={styles.settingsBtnText}>
              {'\u2699\uFE0F'}
            </AppText>
          </TouchableOpacity>
        </View>

        <AppText variant="screenName" style={styles.headerTitle}>
          Lifestyle Activity
        </AppText>
        <AppText variant="caption" style={styles.headerSubtitle}>
          Occupational & daily life {'\u00B7'} health impact logging
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
          <TouchableOpacity
            style={styles.saveBtn}
            activeOpacity={0.8}
            onPress={handleSave}>
            <AppText variant="bodyBold" style={styles.saveBtnText}>
              Save activity
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
});

export default LifestyleScreen;
