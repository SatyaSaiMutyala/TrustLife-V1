import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';
import MoodManualView from './MoodManualView';
import MoodAutoView from './MoodAutoView';

// ──────────────────────────────────────────────
// Constants & Data
// ──────────────────────────────────────────────

const MODE_TABS = [
  {id: 'manual', label: 'Manual check-in'},
  {id: 'auto', label: 'Auto \u00b7 Ayu reads signals'},
];

const CONTEXT_TABS = [
  {id: 'morning', label: 'Morning', icon: 'sunny-outline'},
  {id: 'midday', label: 'Midday', icon: 'partly-sunny-outline'},
  {id: 'evening', label: 'Evening', icon: 'moon-outline'},
  {id: 'night', label: 'Night', icon: 'cloudy-night-outline'},
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const ContextChip = ({item, isActive, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[
      styles.contextChip,
      isActive && styles.contextChipActive,
    ]}>
    <Icon
      family="Ionicons"
      name={item.icon}
      size={ms(14)}
      color={isActive ? Colors.white : 'rgba(255,255,255,0.7)'}
    />
    <AppText
      variant="small"
      color={isActive ? Colors.white : 'rgba(255,255,255,0.7)'}
      style={{marginLeft: s(5), fontWeight: isActive ? '700' : '500'}}>
      {item.label}
    </AppText>
  </TouchableOpacity>
);

const MoodBanner = () => (
  <View style={styles.moodBanner}>
    <View style={styles.moodBannerTop}>
      <View style={styles.moodIconRow}>
        <Icon
          family="Ionicons"
          name="help-circle-outline"
          size={ms(20)}
          color={Colors.purpleText}
        />
        <AppText
          variant="bodyBold"
          color={Colors.purpleText}
          style={{marginLeft: s(8)}}>
          Neutral {'\u2014'} okay but not great
        </AppText>
      </View>
      <View style={styles.moodBadge}>
        <AppText variant="small" color={Colors.purpleText} style={{fontWeight: '700'}}>
          Moderate
        </AppText>
      </View>
    </View>
    <AppText
      variant="caption"
      color={Colors.purpleText}
      style={{marginTop: vs(6), lineHeight: ms(17)}}>
      Stress 5/10 {'\u00b7'} Energy 5/10 {'\u00b7'} Morning routine
    </AppText>
  </View>
);

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const MoodLogScreen = ({navigation}) => {
  const [activeMode, setActiveMode] = useState('manual');
  const [activeCtx, setActiveCtx] = useState('morning');

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
          <TouchableOpacity style={styles.savePill} activeOpacity={0.7}>
            <AppText variant="small" color={Colors.primary} style={{fontWeight: '700'}}>
              Save
            </AppText>
          </TouchableOpacity>
        </View>
        <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(6)}}>
          Stress & mood
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
            Tuesday, 24 Mar 2026 {'\u00b7'} 7:22 AM
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

          {/* Context chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contextChipsContainer}
            style={{marginTop: vs(10)}}>
            {CONTEXT_TABS.map(item => (
              <ContextChip
                key={item.id}
                item={item}
                isActive={activeCtx === item.id}
                onPress={() => setActiveCtx(item.id)}
              />
            ))}
          </ScrollView>

          <MoodBanner />
        </View>

        {/* Tab content */}
        {activeMode === 'manual' ? <MoodManualView /> : <MoodAutoView />}

        <View style={{height: vs(90)}} />
      </ScrollView>

      {/* ── BOTTOM BAR ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
          <AppText
            variant="bodyBold"
            color={Colors.white}
            style={{textAlign: 'center'}}>
            Save {'\u00b7'} Mood 3/6 {'\u00b7'} Stress 5 {'\u00b7'} Energy 5
          </AppText>
        </TouchableOpacity>
        <View style={styles.secondaryButtonRow}>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
            <Icon
              family="Ionicons"
              name="share-outline"
              size={ms(16)}
              color={Colors.primary}
            />
            <AppText
              variant="body"
              color={Colors.primary}
              style={{marginLeft: s(6), fontWeight: '600'}}>
              Share with doctor
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
            <Icon
              family="Ionicons"
              name="trash-outline"
              size={ms(16)}
              color={Colors.primary}
            />
            <AppText
              variant="body"
              color={Colors.primary}
              style={{marginLeft: s(6), fontWeight: '600'}}>
              Discard
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
  savePill: {
    backgroundColor: Colors.white,
    paddingHorizontal: s(14),
    paddingVertical: vs(5),
    borderRadius: ms(20),
  },

  // Context chips
  contextChipsContainer: {
    paddingRight: s(16),
    gap: s(8),
  },
  contextChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  contextChipActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: 'rgba(255,255,255,0.4)',
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

  // Mood banner
  moodBanner: {
    backgroundColor: '#EEEDFE',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginTop: vs(14),
  },
  moodBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  moodIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  moodBadge: {
    backgroundColor: '#EEEDFE',
    borderWidth: 1,
    borderColor: '#3C3489',
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

export default MoodLogScreen;
