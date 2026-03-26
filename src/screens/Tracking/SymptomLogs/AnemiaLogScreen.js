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
import AnemiaManualView from './AnemiaManualView';
import AnemiaAutoView from './AnemiaAutoView';

// ──────────────────────────────────────────────
// Constants & Data
// ──────────────────────────────────────────────

const VIEW_TABS = [
  {id: 'Daily', label: 'Daily'},
  {id: 'Labs', label: 'Labs'},
  {id: 'Diet', label: 'Diet'},
  {id: 'Supplements', label: 'Supplements'},
  {id: 'History', label: 'History'},
];

const MODE_TABS = [
  {id: 'daily', label: 'Daily log'},
  {id: 'labs', label: 'Lab values'},
  {id: 'diet', label: 'Diet & absorption'},
  {id: 'trend', label: 'Trend history'},
];

const ANEMIA_TYPE_CHIPS = [
  {id: 'iron', label: 'Iron deficiency'},
  {id: 'b12', label: 'B12/megaloblastic'},
  {id: 'folate', label: 'Folate deficiency'},
  {id: 'chronic', label: 'Anemia of chronic disease'},
  {id: 'hemolytic', label: 'Hemolytic'},
  {id: 'thalassemia', label: 'Thalassemia'},
  {id: 'aplastic', label: 'Aplastic'},
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const AnemiaTypeChip = ({item, isActive, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[
      styles.contextChip,
      isActive && styles.contextChipActive,
    ]}>
    <AppText
      variant="small"
      color={isActive ? Colors.white : 'rgba(255,255,255,0.7)'}
      style={{fontWeight: isActive ? '700' : '500'}}>
      {item.label}
    </AppText>
  </TouchableOpacity>
);

const HbBanner = () => (
  <View style={styles.hbBanner}>
    <View style={styles.hbBannerTop}>
      <View style={styles.hbIconRow}>
        <Icon
          family="Ionicons"
          name="warning-outline"
          size={ms(20)}
          color={Colors.amberText}
        />
        <View style={{marginLeft: s(8), flex: 1}}>
          <AppText variant="bodyBold" color={Colors.amberText}>
            Mild anemia {'\u2014'} Vitamin B12 deficiency
          </AppText>
        </View>
      </View>
      <View style={styles.hbBadge}>
        <AppText variant="small" color={Colors.amberText} style={{fontWeight: '700'}}>
          Mild
        </AppText>
      </View>
    </View>
    <AppText
      variant="caption"
      color={Colors.amberText}
      style={{marginTop: vs(6), lineHeight: ms(17)}}>
      Hb 10.8 g/dL (target {'\u2265'}12.0) {'\u00b7'} MCV 108 fL {'\u2014'} Macrocytic {'\u00b7'} B12 147 pg/mL (low) {'\u00b7'} Methylcobalamin started Day 9
    </AppText>
  </View>
);

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const AnemiaLogScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [activeView, setActiveView] = useState('Daily');
  const [activeType, setActiveType] = useState('b12');
  const [activeMode, setActiveMode] = useState('daily');

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
            <TouchableOpacity style={styles.logHbPill} activeOpacity={0.7}>
              <Icon
                family="Ionicons"
                name="add"
                size={ms(14)}
                color={Colors.primary}
              />
              <AppText variant="small" color={Colors.primary} style={{fontWeight: '700', marginLeft: s(3)}}>
                Log Hb
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
          Anemia log
        </AppText>
      </View>

      {/* ── View Tabs (sticky, white bg) ── */}
      <View style={styles.viewTabsContainer}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.viewTabsContent}>
          {VIEW_TABS.map(tab => (
            <TouchableOpacity
              key={tab.id}
              activeOpacity={0.7}
              onPress={() => setActiveView(tab.id)}
              style={[
                styles.viewTab,
                activeView === tab.id && styles.viewTabActive,
              ]}>
              <AppText
                variant="caption"
                color={activeView === tab.id ? Colors.primary : Colors.textSecondary}
                style={{fontWeight: activeView === tab.id ? '700' : '500'}}>
                {tab.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
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
            Priya Reddy {'\u00b7'} B12 deficiency {'\u00b7'} T2DM {'\u00b7'} Metformin-B12 link {'\u00b7'} 24 Mar 2026
          </AppText>

          {/* Anemia type chips */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.contextChipsContainer}
            style={{marginTop: vs(10)}}>
            {ANEMIA_TYPE_CHIPS.map(item => (
              <AnemiaTypeChip
                key={item.id}
                item={item}
                isActive={activeType === item.id}
                onPress={() => setActiveType(item.id)}
              />
            ))}
          </ScrollView>

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

          <HbBanner />
        </View>

        {/* Tab content */}
        {activeView === 'Daily' && <AnemiaManualView />}
        {activeView === 'Labs' && <AnemiaAutoView activePanel="labs" />}
        {activeView === 'Diet' && <AnemiaAutoView activePanel="diet" />}
        {activeView === 'Supplements' && <AnemiaAutoView activePanel="supp" />}
        {activeView === 'History' && <AnemiaAutoView activePanel="history" />}

        <View style={{height: vs(90)}} />
      </ScrollView>

      {/* ── BOTTOM BAR ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
          <AppText
            variant="bodyBold"
            color={Colors.white}
            style={{textAlign: 'center'}}>
            Save {'\u00b7'} Hb 10.8 {'\u00b7'} B12 147 {'\u00b7'} Day 9 Methylcobalamin
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
              name="alarm-outline"
              size={ms(16)}
              color={Colors.primary}
            />
            <AppText
              variant="body"
              color={Colors.primary}
              style={{marginLeft: s(6), fontWeight: '600'}}>
              Supplement reminder
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
  logHbPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: s(12),
    paddingVertical: vs(5),
    borderRadius: ms(20),
  },
  savePill: {
    backgroundColor: Colors.white,
    paddingHorizontal: s(14),
    paddingVertical: vs(5),
    borderRadius: ms(20),
  },

  // View tabs (sticky)
  viewTabsContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: '#d1d5db',
  },
  viewTabsContent: {
    paddingHorizontal: s(13),
    gap: s(4),
  },
  viewTab: {
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  viewTabActive: {
    borderBottomColor: Colors.primary,
  },

  // Context chips (anemia types)
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

  // Hb banner
  hbBanner: {
    backgroundColor: Colors.amberBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginTop: vs(14),
  },
  hbBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  hbIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  hbBadge: {
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

export default AnemiaLogScreen;
