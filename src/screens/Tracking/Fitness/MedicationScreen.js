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
import {MEDICATIONS} from '../../../constants/medicationData';

import TodayTab from '../../../components/Fitness/Medication/TodayTab';
import MyMedsTab from '../../../components/Fitness/Medication/MyMedsTab';
import AdherenceTab from '../../../components/Fitness/Medication/AdherenceTab';
import AyuTab from '../../../components/Fitness/Medication/AyuTab';

/* ─── Tab configuration ─────────────────────────────── */

const TABS = [
  {key: 'today', label: 'Today', emoji: '\uD83D\uDC8A'},
  {key: 'mymeds', label: 'My Meds', emoji: '\uD83D\uDCCB'},
  {key: 'adherence', label: 'Adherence', emoji: '\uD83D\uDCCA'},
  {key: 'ayu', label: 'Ayu', emoji: '\uD83C\uDF3F'},
];

/* ─── Helpers ───────────────────────────────────────── */

const fmtDate = () => {
  const d = new Date();
  const opts = {weekday: 'short', day: 'numeric', month: 'short', year: 'numeric'};
  return d.toLocaleDateString('en-IN', opts);
};

/* ─── Component ─────────────────────────────────────── */

const MedicationScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // ── State ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('today');
  const [meds, setMeds] = useState(() =>
    MEDICATIONS.map((m) => ({
      ...m,
      times: m.times.map((t) => ({...t})),
      history: m.history ? [...m.history] : [],
    })),
  );

  // ── Tab content ────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'today':
        return <TodayTab meds={meds} setMeds={setMeds} />;
      case 'mymeds':
        return <MyMedsTab meds={meds} setMeds={setMeds} />;
      case 'adherence':
        return <AdherenceTab meds={meds} />;
      case 'ayu':
        return <AyuTab meds={meds} />;
      default:
        return null;
    }
  };

  // ── Bottom bar ─────────────────────────────────────
  const renderBottomBar = () => {
    if (activeTab !== 'today' && activeTab !== 'mymeds') return null;

    return (
      <View style={[styles.bottomBar, {paddingBottom: Math.max(insets.bottom, vs(12))}]}>
        <TouchableOpacity
          style={styles.actionBtn}
          activeOpacity={0.8}
          onPress={() => setActiveTab('mymeds')}>
          <AppText variant="bodyBold" style={styles.actionBtnText}>
            + Add medication
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
              {'\u2039'} Profile
            </AppText>
          </TouchableOpacity>

          <View style={styles.pillBtn}>
            <AppText variant="small" style={styles.pillBtnText}>
              {'\uD83D\uDD14'} Reminders on
            </AppText>
          </View>
        </View>

        <AppText variant="screenName" style={styles.headerTitle}>
          Medications
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

export default MedicationScreen;
