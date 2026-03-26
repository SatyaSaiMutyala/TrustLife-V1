import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';
import TempManualView from './TempManualView';
import TempAutoView from './TempAutoView';

// ──────────────────────────────────────────────
// Constants & Data
// ──────────────────────────────────────────────

const MODE_TABS = [
  {id: 'manual', label: 'Manual'},
  {id: 'auto', label: 'Smart thermometer'},
];

const MEMBERS = [
  {id: 'priya', label: 'Priya'},
  {id: 'raj', label: 'Raj'},
  {id: 'aarav', label: 'Aarav'},
  {id: 'add', label: '+ Add'},
];

const SOURCES = [
  {id: 'manual', label: 'Manual'},
  {id: 'digital', label: 'Digital probe'},
  {id: 'infrared', label: 'Infrared'},
  {id: 'wearable', label: 'Wearable'},
  {id: 'camera', label: 'Camera'},
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const MemberChip = ({item, isActive, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[
      styles.memberChip,
      isActive && styles.memberChipActive,
    ]}>
    <AppText
      variant="small"
      color={isActive ? Colors.white : 'rgba(255,255,255,0.7)'}
      style={{fontWeight: isActive ? '700' : '500'}}>
      {item.label}
    </AppText>
  </TouchableOpacity>
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

const ZoneBanner = () => (
  <View style={styles.zoneBanner}>
    <View style={styles.zoneBannerTop}>
      <View style={styles.zoneIconRow}>
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
          Normal body temperature
        </AppText>
      </View>
      <View style={styles.zoneBadge}>
        <AppText variant="small" color={Colors.primary} style={{fontWeight: '700'}}>
          Normal
        </AppText>
      </View>
    </View>
    <AppText
      variant="caption"
      color={Colors.tealText}
      style={{marginTop: vs(6), lineHeight: ms(17)}}>
      36.6{'\u00b0'}C {'\u00b7'} Within normal range 36.1{'\u2013'}37.2{'\u00b0'}C
    </AppText>
  </View>
);

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const TempLogScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [activeMode, setActiveMode] = useState('manual');
  const [activeMember, setActiveMember] = useState('priya');
  const [activeSource, setActiveSource] = useState('manual');
  const [unit, setUnit] = useState('C');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Compact Header (fixed) ── */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
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
            <TouchableOpacity
              style={styles.unitPill}
              activeOpacity={0.7}
              onPress={() => setUnit(unit === 'C' ? 'F' : 'C')}>
              <AppText variant="small" color={Colors.white} style={{fontWeight: '600'}}>
                {'\u00b0'}{unit === 'C' ? 'C' : 'F'} / {'\u00b0'}{unit === 'C' ? 'F' : 'C'}
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.savePill} activeOpacity={0.7}>
              <AppText variant="small" color={Colors.primary} style={{fontWeight: '700'}}>
                Save
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(6)}}>
          Body temperature
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

          {/* Who tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.memberChipsContainer}
            style={{marginTop: vs(10)}}>
            {MEMBERS.map(item => (
              <MemberChip
                key={item.id}
                item={item}
                isActive={activeMember === item.id}
                onPress={() => setActiveMember(item.id)}
              />
            ))}
          </ScrollView>

          <ZoneBanner />
        </View>

        {/* Source strip */}
        <View style={styles.sourceCard}>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginRight: s(8)}}>
            Source:
          </AppText>
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={{gap: s(6)}}>
            {SOURCES.map(item => (
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
        {activeMode === 'manual' ? <TempManualView /> : <TempAutoView />}
        <View style={{height: vs(90)}} />
      </ScrollView>

      {/* ── BOTTOM BAR ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
          <AppText
            variant="bodyBold"
            color={Colors.white}
            style={{textAlign: 'center'}}>
            Save {'\u00b7'} 36.6{'\u00b0'}C {'\u00b7'} Axillary {'\u00b7'} Normal
          </AppText>
        </TouchableOpacity>
        <View style={styles.secondaryButtonRow}>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
            <Icon
              family="Ionicons"
              name="alarm-outline"
              size={ms(16)}
              color={Colors.primary}
            />
            <AppText
              variant="body"
              color={Colors.primary}
              style={{marginLeft: s(6), fontWeight: '600'}}>
              Set reminder
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
  unitPill: {
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

  // Member chips
  memberChipsContainer: {
    paddingRight: s(16),
    gap: s(8),
  },
  memberChip: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  memberChipActive: {
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
    borderColor: Colors.primary,
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(12),
  },

  // Source card
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
  sourceChip: {
    paddingHorizontal: s(12),
    paddingVertical: vs(5),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    backgroundColor: Colors.white,
  },
  sourceChipActive: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.primary,
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

export default TempLogScreen;
