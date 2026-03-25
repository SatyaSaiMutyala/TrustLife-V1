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
import MSKManualView from './MSKManualView';
import MSKAutoView from './MSKAutoView';

// ──────────────────────────────────────────────
// Constants & Data
// ──────────────────────────────────────────────

const CONDITION_TYPES = [
  {id: 'oa', label: 'Osteoarthritis', icon: 'body-outline'},
  {id: 'ra', label: 'Rheumatoid / Inflammatory', icon: 'flame-outline'},
  {id: 'postsurg', label: 'Post-surgical / Ortho', icon: 'bandage-outline'},
  {id: 'fibro', label: 'Fibromyalgia', icon: 'pulse-outline'},
  {id: 'gout', label: 'Gout / Crystal', icon: 'flash-outline'},
  {id: 'sports', label: 'Sports / Tendon', icon: 'football-outline'},
  {id: 'spine', label: 'Spine / Disc', icon: 'git-branch-outline'},
];

const MODE_TABS = [
  {id: 'manual', label: 'Manual log'},
  {id: 'auto', label: 'Auto \u00b7 Wearable & sensors'},
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const ConditionChip = ({item, isActive, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[
      styles.conditionChip,
      isActive && styles.conditionChipActive,
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

const PainBanner = () => (
  <View style={styles.painBanner}>
    <View style={styles.painBannerTop}>
      <View style={styles.painIconRow}>
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
          Mild pain {'\u00b7'} Right knee {'\u00b7'} OA
        </AppText>
      </View>
      <View style={styles.painBadge}>
        <AppText variant="small" color={Colors.amberText} style={{fontWeight: '700'}}>
          3/10
        </AppText>
      </View>
    </View>
    <AppText
      variant="caption"
      color={Colors.amberText}
      style={{marginTop: vs(6), lineHeight: ms(17)}}>
      Pain 3/10 {'\u00b7'} Morning stiffness 20 min {'\u00b7'} Aching character {'\u00b7'} Worsened by stairs and prolonged sitting
    </AppText>
  </View>
);

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const MSKLogScreen = ({navigation}) => {
  const [activeCondition, setActiveCondition] = useState('oa');
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
            <View style={styles.routinePill}>
              <AppText variant="small" color={Colors.white} style={{fontWeight: '600'}}>
                Routine check
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
          Musculoskeletal log
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
            Priya Reddy {'\u00b7'} Right knee {'\u00b7'} Osteoarthritis {'\u00b7'} 24 Mar 2026
          </AppText>

          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.conditionChipsContainer}
            style={{marginTop: vs(10)}}>
            {CONDITION_TYPES.map(item => (
              <ConditionChip
                key={item.id}
                item={item}
                isActive={activeCondition === item.id}
                onPress={() => setActiveCondition(item.id)}
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

          <PainBanner />
        </View>

        {/* Tab content */}
        {activeMode === 'manual' ? (
          <MSKManualView activeCondition={activeCondition} />
        ) : (
          <MSKAutoView />
        )}
        <View style={{height: vs(90)}} />
      </ScrollView>

      {/* ── BOTTOM BAR ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
          <AppText
            variant="bodyBold"
            color={Colors.white}
            style={{textAlign: 'center'}}>
            Save {'\u00b7'} Right knee {'\u00b7'} Pain 3/10 {'\u00b7'} OA {'\u00b7'} Physio 2/5
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
              Share with ortho
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
              Physio report
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
  routinePill: {
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

  // Condition type chips
  conditionChipsContainer: {
    paddingRight: s(16),
    gap: s(8),
  },
  conditionChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  conditionChipActive: {
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

  // Pain banner
  painBanner: {
    backgroundColor: Colors.amberBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginTop: vs(14),
  },
  painBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  painIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  painBadge: {
    backgroundColor: Colors.amberBg,
    borderWidth: 1,
    borderColor: Colors.amberText,
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

export default MSKLogScreen;
