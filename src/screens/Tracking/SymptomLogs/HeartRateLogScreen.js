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
import HRManualView from './HRManualView';
import HRAutoView from './HRAutoView';

// ──────────────────────────────────────────────
// Constants & Data
// ──────────────────────────────────────────────

const MODE_TABS = [
  {id: 'manual', label: 'Manual'},
  {id: 'auto', label: 'Auto measure'},
];

const CONTEXT_TABS = [
  {id: 'rest', label: 'Resting', icon: 'bed-outline'},
  {id: 'active', label: 'Active', icon: 'walk-outline'},
  {id: 'sleep', label: 'Sleep', icon: 'moon-outline'},
  {id: 'recovery', label: 'Recovery', icon: 'refresh-outline'},
];

const SOURCE_CHIPS = [
  {id: 'manual', label: 'Manual'},
  {id: 'wearable', label: 'Wearable'},
  {id: 'bp', label: 'BP device'},
  {id: 'applehealth', label: 'Apple Health'},
  {id: 'camera', label: 'Camera PPG'},
];

const ZONE_ROWS = [
  {id: 'z0', label: 'Zone 0', name: 'Very low', range: '<60', color: Colors.blueText, barColor: Colors.blueBg, detail: 'Bradycardia territory'},
  {id: 'z1', label: 'Zone 1', name: 'Resting', range: '60\u2013100', color: Colors.tealText, barColor: Colors.tealBg, detail: '72 \u2713', highlight: true},
  {id: 'z2', label: 'Zone 2', name: 'Light aerobic', range: '100\u2013127', color: '#4d7c0f', barColor: '#ecfccb', detail: 'Fat burning'},
  {id: 'z3', label: 'Zone 3', name: 'Moderate', range: '127\u2013145', color: Colors.amberText, barColor: Colors.amberBg, detail: 'Cardio fitness'},
  {id: 'z4', label: 'Zone 4', name: 'Hard', range: '145\u2013163', color: '#c2410c', barColor: '#ffedd5', detail: 'Lactate threshold'},
  {id: 'z5', label: 'Zone 5', name: 'Maximum', range: '163\u2013182', color: Colors.redText, barColor: Colors.redBg, detail: 'Sprint / HIIT'},
  {id: 'z6', label: 'Zone 6', name: 'Danger', range: '>182', color: '#7f1d1d', barColor: '#fecaca', detail: 'Above max HR'},
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

const ZoneBanner = () => (
  <View style={styles.zoneBanner}>
    <View style={styles.zoneBannerTop}>
      <View style={styles.zoneIconRow}>
        <Icon
          family="Ionicons"
          name="checkmark-circle-outline"
          size={ms(20)}
          color={Colors.tealText}
        />
        <AppText
          variant="bodyBold"
          color={Colors.tealText}
          style={{marginLeft: s(8)}}>
          Normal resting heart rate
        </AppText>
      </View>
      <View style={styles.zoneBadge}>
        <AppText variant="small" color={Colors.tealText} style={{fontWeight: '700'}}>
          Normal
        </AppText>
      </View>
    </View>
    <AppText
      variant="caption"
      color={Colors.tealText}
      style={{marginTop: vs(6), lineHeight: ms(17)}}>
      60{'\u2013'}100 bpm {'\u00b7'} Your resting HR 72 bpm is in the healthy range
    </AppText>
  </View>
);

const SourceChip = ({item, isActive, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[
      styles.sourceChip,
      isActive && styles.sourceChipActive,
    ]}>
    <AppText
      variant="small"
      color={isActive ? Colors.primary : Colors.textSecondary}
      style={{fontWeight: isActive ? '700' : '500'}}>
      {item.label}
    </AppText>
  </TouchableOpacity>
);

const ZoneRow = ({zone, isLast}) => (
  <View
    style={[
      styles.zoneRow,
      !isLast && styles.zoneRowBorder,
    ]}>
    <View style={{flex: 1}}>
      <View style={styles.zoneRowHeader}>
        <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>
          {zone.label} {zone.name}
        </AppText>
        <AppText variant="small" color={Colors.textSecondary}>
          {zone.range} bpm
        </AppText>
      </View>
      <View style={[styles.zoneBar, {backgroundColor: zone.barColor}]}>
        <AppText variant="small" color={zone.color} style={{fontWeight: '600'}}>
          {zone.detail}
        </AppText>
        {zone.highlight && (
          <View style={[styles.zoneHighlightBadge, {borderColor: zone.color}]}>
            <AppText variant="small" color={zone.color} style={{fontWeight: '700'}}>
              You are here
            </AppText>
          </View>
        )}
      </View>
    </View>
  </View>
);

const HRZonesCard = () => (
  <View style={styles.zonesCard}>
    <AppText variant="bodyBold" color={Colors.textPrimary}>
      Heart rate zones reference
    </AppText>
    {ZONE_ROWS.map((zone, index) => (
      <ZoneRow
        key={zone.id}
        zone={zone}
        isLast={index === ZONE_ROWS.length - 1}
      />
    ))}
  </View>
);

const InsightCard = () => (
  <View style={styles.insightCard}>
    <View style={styles.insightIconRow}>
      <Icon
        family="Ionicons"
        name="information-circle-outline"
        size={ms(18)}
        color={Colors.blueText}
      />
      <AppText
        variant="bodyBold"
        color={Colors.blueText}
        style={{marginLeft: s(8)}}>
        Heart rate and your conditions
      </AppText>
    </View>
    <AppText
      variant="caption"
      color={Colors.blueText}
      style={{marginTop: vs(6), lineHeight: ms(17)}}>
      T2DM + HTN: resting HR {'>'}80 bpm = higher CV risk. Keeping resting heart rate in the 60{'\u2013'}75 bpm range is associated with lower cardiovascular events. Regular monitoring helps detect early autonomic neuropathy.
    </AppText>
  </View>
);

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const HeartRateLogScreen = ({navigation}) => {
  const [activeMode, setActiveMode] = useState('manual');
  const [activeCtx, setActiveCtx] = useState('rest');
  const [activeSource, setActiveSource] = useState('manual');

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
          Log heart rate
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

          <ZoneBanner />
        </View>

        {/* Source strip card */}
        <View style={styles.sourceCard}>
          <AppText
            variant="caption"
            color={Colors.textSecondary}
            style={{marginRight: s(8)}}>
            Source:
          </AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.sourceChipsContainer}>
            {SOURCE_CHIPS.map(item => (
              <SourceChip
                key={item.id}
                item={item}
                isActive={activeSource === item.id}
                onPress={() => setActiveSource(item.id)}
              />
            ))}
          </ScrollView>
        </View>

        {/* Tab content */}
        {activeMode === 'manual' ? <HRManualView /> : <HRAutoView />}

        {/* Shared section — always visible */}
        <HRZonesCard />

        {/* Blue insight card */}
        <InsightCard />

        <View style={{height: vs(90)}} />
      </ScrollView>

      {/* ── BOTTOM BAR ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
          <AppText
            variant="bodyBold"
            color={Colors.white}
            style={{textAlign: 'center'}}>
            Save {'\u00b7'} 72 bpm {'\u00b7'} Resting {'\u00b7'} Regular
          </AppText>
        </TouchableOpacity>
        <View style={styles.secondaryButtonRow}>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
            <Icon
              family="Ionicons"
              name="add-circle-outline"
              size={ms(16)}
              color={Colors.primary}
            />
            <AppText
              variant="body"
              color={Colors.primary}
              style={{marginLeft: s(6), fontWeight: '600'}}>
              Add to session
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

  // Zone banner
  zoneBanner: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginTop: vs(14),
  },
  zoneBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  zoneIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  zoneBadge: {
    backgroundColor: Colors.tealBg,
    borderWidth: 1,
    borderColor: Colors.tealText,
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(12),
  },

  // Source strip card
  sourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
    marginBottom: vs(10),
  },
  sourceChipsContainer: {
    gap: s(6),
  },
  sourceChip: {
    backgroundColor: Colors.background,
    paddingHorizontal: s(12),
    paddingVertical: vs(5),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
  },
  sourceChipActive: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.primary,
  },

  // HR Zones card
  zonesCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginTop: vs(10),
  },
  zoneRow: {
    paddingVertical: vs(8),
  },
  zoneRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#d1d5db',
  },
  zoneRowHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  zoneBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(4),
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(8),
  },
  zoneHighlightBadge: {
    borderWidth: 1,
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },

  // Insight card
  insightCard: {
    backgroundColor: Colors.blueBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginTop: vs(10),
  },
  insightIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default HeartRateLogScreen;
