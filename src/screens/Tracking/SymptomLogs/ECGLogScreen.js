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
import ECGManualView from './ECGManualView';
import ECGAutoView from './ECGAutoView';

// ──────────────────────────────────────────────
// Constants & Data
// ──────────────────────────────────────────────

const READING_TYPES = [
  {id: 'resting', label: 'Resting', icon: 'heart-outline'},
  {id: 'symptoms', label: 'During symptoms', icon: 'warning-outline'},
  {id: 'exercise', label: 'Post-exercise', icon: 'fitness-outline'},
  {id: 'medication', label: 'After medication', icon: 'medkit-outline'},
  {id: 'procedure', label: 'Pre-procedure', icon: 'medical-outline'},
  {id: 'holter', label: 'Holter review', icon: 'time-outline'},
];

const MODE_TABS = [
  {id: 'manual', label: 'Manual entry'},
  {id: 'auto', label: 'Device / auto'},
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const ReadingTypeChip = ({item, isActive, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[
      styles.readingChip,
      isActive && styles.readingChipActive,
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

const RhythmBanner = () => (
  <View style={styles.rhythmBanner}>
    <View style={styles.rhythmBannerTop}>
      <View style={styles.rhythmIconRow}>
        <Icon
          family="Ionicons"
          name="checkmark-circle"
          size={ms(20)}
          color={Colors.primary}
        />
        <AppText
          variant="bodyBold"
          color={Colors.tealText}
          style={{marginLeft: s(8)}}>
          Normal sinus rhythm
        </AppText>
      </View>
      <View style={styles.rhythmBadge}>
        <AppText variant="small" color={Colors.primary} style={{fontWeight: '700'}}>
          Normal
        </AppText>
      </View>
    </View>
    <AppText
      variant="caption"
      color={Colors.tealText}
      style={{marginTop: vs(6), lineHeight: ms(17)}}>
      HR 72 bpm · Regular rhythm · PR 158ms · QRS 88ms · QTc 418ms · No ST changes · Consistent with last recording Jan 14
    </AppText>
  </View>
);

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const ECGLogScreen = ({navigation}) => {
  const [activeReadType, setActiveReadType] = useState('resting');
  const [activeMode, setActiveMode] = useState('manual');

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
            <View style={styles.restingPill}>
              <AppText variant="small" color={Colors.white} style={{fontWeight: '600'}}>
                Resting
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
          ECG log
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
            Priya Reddy {'\u00b7'} T2DM + HTN {'\u00b7'} Last ECG Jan 14, 2026 {'\u00b7'} Normal
          </AppText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.readingChipsContainer}
            style={{marginTop: vs(10)}}>
            {READING_TYPES.map(item => (
              <ReadingTypeChip
                key={item.id}
                item={item}
                isActive={activeReadType === item.id}
                onPress={() => setActiveReadType(item.id)}
              />
            ))}
          </ScrollView>

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

          <RhythmBanner />
        </View>

        {/* Tab content */}
        {activeMode === 'manual' ? <ECGManualView /> : <ECGAutoView />}
        <View style={{height: vs(90)}} />
      </ScrollView>

      {/* ── BOTTOM BAR ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
          <AppText
            variant="bodyBold"
            color={Colors.white}
            style={{textAlign: 'center'}}>
            Save ECG · NSR · HR 72 · QTc 418ms · Normal
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
              Share with cardiologist
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
            <Icon
              family="Ionicons"
              name="document-text-outline"
              size={ms(16)}
              color={Colors.primary}
            />
            <AppText
              variant="body"
              color={Colors.primary}
              style={{marginLeft: s(6), fontWeight: '600'}}>
              Export PDF
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
  restingPill: {
    backgroundColor: 'rgba(255,255,255,0.18)',
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

  // Reading type chips
  readingChipsContainer: {
    paddingRight: s(16),
    gap: s(8),
  },
  readingChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  readingChipActive: {
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

  // Rhythm banner
  rhythmBanner: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginTop: vs(14),
  },
  rhythmBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  rhythmIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  rhythmBadge: {
    backgroundColor: Colors.tealBg,
    borderWidth: 1,
    borderColor: Colors.primary,
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

export default ECGLogScreen;
