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
import GlucoseManualView from './GlucoseManualView';
import GlucoseAutoView from './GlucoseAutoView';

// ──────────────────────────────────────────────
// Constants & Data
// ──────────────────────────────────────────────

const MODE_TABS = [
  {id: 'manual', label: 'Manual'},
  {id: 'auto', label: 'Auto / CGM'},
];

const UNIT_OPTIONS = [
  {id: 'mmol', label: 'mmol/L'},
  {id: 'mgdl', label: 'mg/dL'},
];

const READING_TYPES = [
  {id: 'fasting', label: 'Fasting', icon: 'moon-outline'},
  {id: 'premeal', label: 'Pre-meal', icon: 'restaurant-outline'},
  {id: 'postmeal', label: 'Post-meal', icon: 'time-outline'},
  {id: 'bedtime', label: 'Bedtime', icon: 'bed-outline'},
  {id: 'random', label: 'Random', icon: 'shuffle-outline'},
];

const SOURCE_CHIPS = [
  {id: 'manual', label: 'Manual'},
  {id: 'glucometer', label: 'Glucometer'},
  {id: 'cgm', label: 'CGM patch'},
  {id: 'applehealth', label: 'Apple Health'},
  {id: 'scanstrip', label: 'Scan strip'},
];

const CONDITION_ROWS = [
  {id: 'kidneys', icon: 'fitness-outline', label: 'Kidneys', detail: 'High glucose damages filtration over time'},
  {id: 'heart', icon: 'heart-outline', label: 'Heart', detail: 'Elevated glucose accelerates arterial plaque'},
  {id: 'eyes', icon: 'eye-outline', label: 'Eyes', detail: 'Sustained highs can harm retinal blood vessels'},
  {id: 'nerves', icon: 'flash-outline', label: 'Nerves', detail: 'Prolonged elevation leads to peripheral neuropathy'},
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

const ZoneBanner = () => (
  <View style={styles.zoneBanner}>
    <View style={styles.zoneBannerTop}>
      <View style={styles.zoneIconRow}>
        <Icon
          family="Ionicons"
          name="warning-outline"
          size={ms(20)}
          color={Colors.amberText}
        />
        <AppText
          variant="bodyBold"
          color={Colors.amberText}
          style={{marginLeft: s(8)}}>
          Above fasting target
        </AppText>
      </View>
      <View style={styles.zoneBadge}>
        <AppText variant="small" color={Colors.amberText} style={{fontWeight: '700'}}>
          Above target
        </AppText>
      </View>
    </View>
    <AppText
      variant="caption"
      color={Colors.amberText}
      style={{marginTop: vs(6), lineHeight: ms(17)}}>
      8.4 mmol/L {'\u00b7'} Your fasting target is {'<'}7.0 {'\u00b7'} PM Metformin adherence is the primary driver
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

const GlucoseMattersCard = () => (
  <View style={styles.mattersCard}>
    <AppText variant="bodyBold" color={Colors.textPrimary}>
      Why glucose control matters {'\u00b7'} Your conditions
    </AppText>
    {CONDITION_ROWS.map((row, index) => (
      <View
        key={row.id}
        style={[
          styles.conditionRow,
          index < CONDITION_ROWS.length - 1 && styles.conditionRowBorder,
        ]}>
        <Icon
          family="Ionicons"
          name={row.icon}
          size={ms(18)}
          color={Colors.primary}
        />
        <View style={{flex: 1, marginLeft: s(10)}}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>
            {row.label}
          </AppText>
          <AppText
            variant="caption"
            color={Colors.textSecondary}
            style={{marginTop: vs(2)}}>
            {row.detail}
          </AppText>
        </View>
      </View>
    ))}
  </View>
);

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const GlucoseLogScreen = ({navigation}) => {
  const [activeMode, setActiveMode] = useState('manual');
  const [activeUnit, setActiveUnit] = useState('mmol');
  const [activeType, setActiveType] = useState('fasting');
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
          <View style={styles.topRowRight}>
            <View style={styles.unitToggleContainer}>
              {UNIT_OPTIONS.map(unit => (
                <TouchableOpacity
                  key={unit.id}
                  activeOpacity={0.7}
                  onPress={() => setActiveUnit(unit.id)}
                  style={[
                    styles.unitToggle,
                    activeUnit === unit.id && styles.unitToggleActive,
                  ]}>
                  <AppText
                    variant="small"
                    color={activeUnit === unit.id ? Colors.primary : 'rgba(255,255,255,0.7)'}
                    style={{fontWeight: activeUnit === unit.id ? '700' : '500'}}>
                    {unit.label}
                  </AppText>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={styles.savePill} activeOpacity={0.7}>
              <AppText variant="small" color={Colors.primary} style={{fontWeight: '700'}}>
                Save
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(6)}}>
          Log blood glucose
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

          {/* Reading type chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.readingChipsContainer}
            style={{marginTop: vs(10)}}>
            {READING_TYPES.map(item => (
              <ReadingTypeChip
                key={item.id}
                item={item}
                isActive={activeType === item.id}
                onPress={() => setActiveType(item.id)}
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
        {activeMode === 'manual' ? <GlucoseManualView /> : <GlucoseAutoView />}

        {/* Shared section — always visible */}
        <GlucoseMattersCard />

        <View style={{height: vs(90)}} />
      </ScrollView>

      {/* ── BOTTOM BAR ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
          <AppText
            variant="bodyBold"
            color={Colors.white}
            style={{textAlign: 'center'}}>
            Save {'\u00b7'} 8.4 mmol/L {'\u00b7'} Fasting {'\u00b7'} Stable
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
              Add to log
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
  topRowRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  unitToggleContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: ms(20),
    padding: ms(2),
  },
  unitToggle: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(18),
  },
  unitToggleActive: {
    backgroundColor: Colors.white,
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

  // Zone banner
  zoneBanner: {
    backgroundColor: Colors.amberBg,
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
    backgroundColor: Colors.amberBg,
    borderWidth: 1,
    borderColor: Colors.amberText,
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

  // Glucose matters card
  mattersCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginTop: vs(10),
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  conditionRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#d1d5db',
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

export default GlucoseLogScreen;
