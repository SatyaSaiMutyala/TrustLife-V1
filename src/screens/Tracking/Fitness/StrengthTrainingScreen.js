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
import {DEFAULT_PLAN} from '../../../constants/strengthData';

import PlannerTab from '../../../components/Fitness/Strength/PlannerTab';
import DailyLogTab from '../../../components/Fitness/Strength/DailyLogTab';
import HistoryTab from '../../../components/Fitness/Strength/HistoryTab';
import SummaryTab from '../../../components/Fitness/Strength/SummaryTab';
import RestTimerOverlay from '../../../components/Fitness/Strength/RestTimerOverlay';
import AyuOverlay from '../../../components/Fitness/Strength/AyuOverlay';

const TABS = [
  {key: 'planner', label: 'Planner', emoji: '\uD83D\uDCCB'},
  {key: 'log', label: 'Daily Log', emoji: '\uD83D\uDCDD'},
  {key: 'history', label: 'History', emoji: '\uD83D\uDCCA'},
  {key: 'summary', label: 'Summary', emoji: '\uD83D\uDCC8'},
];

const SAVE_LABELS = {
  planner: 'Save training plan',
  log: "Save today's session",
  history: 'Export log history',
  summary: 'Export programme summary',
};

const StrengthTrainingScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // ── State ──────────────────────────────────────────
  const [activeTab, setActiveTab] = useState('planner');
  const [plan, setPlan] = useState(DEFAULT_PLAN);
  const [logState, setLogState] = useState({
    dayId: 1,
    sets: {},
    sessionUnit: 'kg',
    restSec: 90,
    sessionStartTime: Date.now(),
    waterAmount: 0,
    waterUnit: 'cups',
  });
  const [restTimerVisible, setRestTimerVisible] = useState(false);
  const [ayuVisible, setAyuVisible] = useState(false);
  const [ayuSession, setAyuSession] = useState(null);

  // ── Handlers ───────────────────────────────────────
  const onOpenRestTimer = () => setRestTimerVisible(true);
  const onCloseRestTimer = () => setRestTimerVisible(false);

  const onShowAyu = (session) => {
    setAyuSession(session);
    setAyuVisible(true);
  };
  const onCloseAyu = () => {
    setAyuVisible(false);
    setAyuSession(null);
  };

  // ── Tab content ────────────────────────────────────
  const renderTabContent = () => {
    switch (activeTab) {
      case 'planner':
        return <PlannerTab plan={plan} setPlan={setPlan} onShowAyu={onShowAyu} />;
      case 'log':
        return (
          <DailyLogTab
            plan={plan}
            logState={logState}
            setLogState={setLogState}
            onOpenRestTimer={onOpenRestTimer}
            onShowAyu={onShowAyu}
          />
        );
      case 'history':
        return <HistoryTab onShowAyu={onShowAyu} />;
      case 'summary':
        return <SummaryTab plan={plan} setPlan={setPlan} onShowAyu={onShowAyu} />;
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
              ‹ Fitness
            </AppText>
          </TouchableOpacity>

          <View style={styles.topBarRight}>
            <TouchableOpacity
              style={styles.restTimerBtn}
              onPress={onOpenRestTimer}>
              <AppText variant="small" style={styles.restTimerText}>
                ⏱ Rest timer
              </AppText>
            </TouchableOpacity>

            <TouchableOpacity style={styles.saveHeaderBtn}>
              <AppText variant="small" style={styles.saveHeaderText}>
                Save
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        <AppText variant="screenName" style={styles.headerTitle}>
          Strength training
        </AppText>
        <AppText variant="caption" style={styles.headerSubtitle}>
          Planner · Daily Log · History · Summary
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
      <View style={[styles.bottomBar, {paddingBottom: Math.max(insets.bottom, vs(12))}]}>
        <TouchableOpacity style={styles.saveBtn} activeOpacity={0.8}>
          <AppText variant="bodyBold" style={styles.saveBtnText}>
            {SAVE_LABELS[activeTab]}
          </AppText>
        </TouchableOpacity>

        <View style={styles.subButtons}>
          <TouchableOpacity style={styles.subBtn} activeOpacity={0.7}>
            <AppText variant="small" style={styles.subBtnText}>
              🩺 Share
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity style={styles.subBtn} activeOpacity={0.7}>
            <AppText variant="small" style={styles.subBtnText}>
              📅 Calendar
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── OVERLAYS ───────────────────────────────────── */}
      <RestTimerOverlay
        visible={restTimerVisible}
        onClose={onCloseRestTimer}
      />
      <AyuOverlay
        visible={ayuVisible}
        session={ayuSession}
        onClose={onCloseAyu}
      />
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
  restTimerBtn: {
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  restTimerText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: ms(12),
    fontWeight: '600',
  },
  saveHeaderBtn: {
    paddingHorizontal: s(16),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    backgroundColor: Colors.accent,
  },
  saveHeaderText: {
    color: Colors.white,
    fontSize: ms(12),
    fontWeight: '700',
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

export default StrengthTrainingScreen;
