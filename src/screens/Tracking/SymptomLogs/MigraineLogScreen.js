import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
  Animated,
} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';
import MigraineManualView from './MigraineManualView';
import MigraineAutoView from './MigraineAutoView';

// ──────────────────────────────────────────────
// Constants & Data
// ──────────────────────────────────────────────

const MODE_TABS = [
  {id: 'manual', label: 'Log episode'},
  {id: 'auto', label: 'Auto \u00b7 Ayu watches'},
];

const PHASES = [
  {id: 'prodrome', label: 'Prodrome', status: 'done'},
  {id: 'aura', label: 'Aura', status: 'active'},
  {id: 'headache', label: 'Headache', status: 'pending'},
  {id: 'medication', label: 'Medication', status: 'pending'},
  {id: 'postdrome', label: 'Postdrome', status: 'pending'},
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const PulsingDot = ({color, size}) => {
  const pulseAnim = useRef(new Animated.Value(1)).current;
  useEffect(() => {
    Animated.loop(
      Animated.sequence([
        Animated.timing(pulseAnim, {toValue: 1.6, duration: 800, useNativeDriver: true}),
        Animated.timing(pulseAnim, {toValue: 1, duration: 800, useNativeDriver: true}),
      ]),
    ).start();
  }, [pulseAnim]);
  return (
    <Animated.View
      style={{
        width: size || ms(8),
        height: size || ms(8),
        borderRadius: (size || ms(8)) / 2,
        backgroundColor: color || Colors.red,
        transform: [{scale: pulseAnim}],
      }}
    />
  );
};

const PhaseStrip = ({activePhase}) => (
  <View style={styles.phaseStripContainer}>
    {PHASES.map((phase, idx) => {
      const isActive = activePhase === phase.id;
      const isDone = phase.status === 'done';
      return (
        <View
          key={phase.id}
          style={[
            styles.phaseTab,
            isActive && styles.phaseTabActive,
            isDone && !isActive && styles.phaseTabDone,
          ]}>
          {isDone && !isActive && (
            <Icon
              family="Ionicons"
              name="checkmark-circle"
              size={ms(12)}
              color="rgba(255,255,255,0.8)"
              style={{marginRight: s(3)}}
            />
          )}
          {isActive && (
            <View style={{marginRight: s(3)}}>
              <PulsingDot color={Colors.white} size={ms(6)} />
            </View>
          )}
          <AppText
            variant="small"
            color={isActive || isDone ? Colors.white : 'rgba(255,255,255,0.5)'}
            style={{fontWeight: isActive ? '700' : '500', fontSize: ms(9)}}>
            {phase.label}
          </AppText>
        </View>
      );
    })}
  </View>
);

const SeverityBanner = () => (
  <View style={styles.severityBanner}>
    <View style={styles.severityBannerTop}>
      <View style={styles.severityIconRow}>
        <Icon
          family="Ionicons"
          name="warning-outline"
          size={ms(20)}
          color={Colors.redText}
        />
        <AppText
          variant="bodyBold"
          color={Colors.redText}
          style={{marginLeft: s(8)}}>
          Moderate migraine in progress
        </AppText>
      </View>
      <View style={styles.severityBadge}>
        <AppText variant="small" color={Colors.redText} style={{fontWeight: '700'}}>
          6/10
        </AppText>
      </View>
    </View>
    <AppText
      variant="caption"
      color={Colors.redText}
      style={{marginTop: vs(6), lineHeight: ms(17)}}>
      Pain 6/10 {'\u00b7'} Left temporal {'\u00b7'} Pulsating {'\u00b7'} Started 6:15 AM {'\u00b7'} Duration 67 min
    </AppText>
  </View>
);

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const MigraineLogScreen = ({navigation}) => {
  const [activeMode, setActiveMode] = useState('manual');
  const [activePhase, setActivePhase] = useState('aura');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Compact Header (fixed) ── */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.topRowLeft}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon
                family="Ionicons"
                name="chevron-back"
                size={ms(22)}
                color={Colors.white}
              />
            </TouchableOpacity>
            <AppText
              variant="body"
              color="rgba(255,255,255,0.8)"
              style={{marginLeft: s(10)}}>
              Tracking
            </AppText>
          </View>
          <View style={styles.topRowRight}>
            <View style={styles.activePill}>
              <PulsingDot color={Colors.white} size={ms(6)} />
              <AppText variant="small" color={Colors.white} style={{fontWeight: '600', marginLeft: s(5)}}>
                Active episode
              </AppText>
            </View>
            <TouchableOpacity style={styles.savePill} activeOpacity={0.7}>
              <AppText variant="small" color={Colors.primary} style={{fontWeight: '700'}}>
                Save
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(6)}}>
          Migraine log
        </AppText>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>

        {/* Scrollable header content (green bg) */}
        <View style={styles.scrollableHeader}>
          <AppText
            variant="caption"
            color="rgba(255,255,255,0.7)">
            Priya Reddy {'\u00b7'} T2DM + HTN {'\u00b7'} 4 Apr 2026 {'\u00b7'} 7:22 AM
          </AppText>

          {/* Mode tabs */}
          <View style={styles.modeTabsContainer}>
            {MODE_TABS.map(tab => (
              <TouchableOpacity
                key={tab.id}
                activeOpacity={0.7}
                onPress={() => setActiveMode(tab.id)}
                style={[
                  styles.modeTab,
                  activeMode === tab.id && styles.modeTabActive,
                ]}>
                <AppText
                  variant="caption"
                  color={activeMode === tab.id ? Colors.primary : 'rgba(255,255,255,0.7)'}
                  style={{fontWeight: activeMode === tab.id ? '700' : '500'}}>
                  {tab.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Phase strip */}
          <PhaseStrip activePhase={activePhase} />

          {/* Severity banner */}
          <SeverityBanner />
        </View>

        {/* Tab content */}
        {activeMode === 'manual' ? <MigraineManualView /> : <MigraineAutoView />}
        <View style={{height: vs(90)}} />
      </ScrollView>

      {/* ── BOTTOM BAR ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
          <AppText
            variant="bodyBold"
            color={Colors.white}
            style={{textAlign: 'center'}}>
            Save episode {'\u00b7'} Pain 6/10 {'\u00b7'} Left temporal {'\u00b7'} Active
          </AppText>
        </TouchableOpacity>
        <View style={styles.secondaryButtonRow}>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
            <Icon
              family="Ionicons"
              name="calendar-outline"
              size={ms(16)}
              color={Colors.primary}
            />
            <AppText
              variant="body"
              color={Colors.primary}
              style={{marginLeft: s(6), fontWeight: '600'}}>
              Add to Apr 4
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
            <Icon
              family="Ionicons"
              name="alert-circle-outline"
              size={ms(16)}
              color={Colors.primary}
            />
            <AppText
              variant="body"
              color={Colors.primary}
              style={{marginLeft: s(6), fontWeight: '600'}}>
              Alert doctor
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header (compact)
  header: {
    backgroundColor: Colors.primary,
    paddingTop: Platform.OS === 'ios' ? vs(50) : vs(10),
    paddingHorizontal: s(13),
    paddingBottom: vs(8),
  },
  scrollableHeader: {
    backgroundColor: Colors.primary,
    marginHorizontal: s(-13),
    paddingHorizontal: s(13),
    paddingTop: vs(4),
    paddingBottom: vs(12),
    marginBottom: vs(10),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  topRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  activePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(239,68,68,0.7)',
    paddingHorizontal: s(12),
    paddingVertical: vs(4),
    borderRadius: ms(20),
  },
  savePill: {
    backgroundColor: Colors.white,
    paddingHorizontal: s(14),
    paddingVertical: vs(5),
    borderRadius: ms(20),
  },

  // Phase strip
  phaseStripContainer: {
    flexDirection: 'row',
    marginTop: vs(10),
    gap: s(4),
  },
  phaseTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(6),
    borderRadius: ms(8),
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  phaseTabActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.4)',
  },
  phaseTabDone: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },

  // Mode tabs
  modeTabsContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: ms(10),
    padding: ms(3),
    marginTop: vs(10),
  },
  modeTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(6),
    borderRadius: ms(8),
  },
  modeTabActive: {
    backgroundColor: Colors.white,
  },

  // Severity banner
  severityBanner: {
    backgroundColor: Colors.redBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginTop: vs(14),
  },
  severityBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  severityIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  severityBadge: {
    backgroundColor: Colors.redBg,
    borderWidth: 1,
    borderColor: Colors.redText,
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(12),
  },

  // Body
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: s(13),
  },

  // Bottom bar
  bottomBar: {
    backgroundColor: Colors.white,
    paddingHorizontal: s(13),
    paddingTop: vs(8),
    paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10),
    borderTopWidth: 0.5,
    borderTopColor: '#d1d5db',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: vs(11),
    borderRadius: ms(12),
    alignItems: 'center',
  },
  secondaryButtonRow: {
    flexDirection: 'row',
    marginTop: vs(6),
    gap: s(8),
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(7),
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    backgroundColor: Colors.white,
  },
});

export default MigraineLogScreen;
