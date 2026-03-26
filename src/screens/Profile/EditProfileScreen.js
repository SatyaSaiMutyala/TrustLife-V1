import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, StatusBar, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import {PROFILE_TABS} from '../../constants/profileData';

import OverviewTab from './tabs/OverviewTab';
import PersonalTab from './tabs/PersonalTab';
import ContactTab from './tabs/ContactTab';
import DependentsTab from './tabs/DependentsTab';
import SecurityTab from './tabs/SecurityTab';
import PreferencesTab from './tabs/PreferencesTab';
import LifestyleTab from './tabs/LifestyleTab';
import HealthTab from './tabs/HealthTab';
import FamilyHistoryTab from './tabs/FamilyHistoryTab';
import EnvironmentTab from './tabs/EnvironmentTab';
import ReproductiveTab from './tabs/ReproductiveTab';
import DentalTab from './tabs/DentalTab';
import VisionTab from './tabs/VisionTab';
import GeneticTab from './tabs/GeneticTab';
import DigitalHealthTab from './tabs/DigitalHealthTab';
import BodyCompTab from './tabs/BodyCompTab';
import SupplementsTab from './tabs/SupplementsTab';
import InsuranceTab from './tabs/InsuranceTab';

/* ─── Component ─────────────────────────────────────── */

const TAB_MAP = {
  overview: OverviewTab,
  personal: PersonalTab,
  contact: ContactTab,
  dependents: DependentsTab,
  security: SecurityTab,
  preferences: PreferencesTab,
  lifestyle: LifestyleTab,
  health: HealthTab,
  family: FamilyHistoryTab,
  environment: EnvironmentTab,
  reproductive: ReproductiveTab,
  dental: DentalTab,
  vision: VisionTab,
  genetic: GeneticTab,
  digital: DigitalHealthTab,
  bodycomp: BodyCompTab,
  supplements: SupplementsTab,
  insurance: InsuranceTab,
};

const EditProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('overview');

  const handleTabPress = (key) => {
    if (key === 'goals') {
      navigation.navigate('Goals');
    } else {
      setActiveTab(key);
    }
  };

  const renderTabContent = () => {
    const TabComponent = TAB_MAP[activeTab];
    if (TabComponent) return <TabComponent />;
    return null;
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

          <TouchableOpacity style={styles.savePill} activeOpacity={0.8}>
            <AppText variant="small" style={styles.savePillText}>
              Save Changes
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Avatar */}
        <View style={styles.avatarRow}>
          <View style={styles.avatar}>
            <AppText variant="bodyBold" style={styles.avatarText}>PR</AppText>
          </View>
        </View>

        {/* Name & subtitle */}
        <AppText variant="screenName" style={styles.headerName}>
          Priya Raghunathan
        </AppText>
        <AppText variant="caption" style={styles.headerSubtitle}>
          Member since January 2020 · ID #PRF-40291
        </AppText>

        {/* Badges */}
        <View style={styles.badgesRow}>
          <View style={[styles.badge, styles.badgeVerified]}>
            <AppText variant="small" style={styles.badgeVerifiedText}>
              ✓ Verified
            </AppText>
          </View>
          <View style={[styles.badge, styles.badgePremium]}>
            <AppText variant="small" style={styles.badgePremiumText}>
              ★ Premium Member
            </AppText>
          </View>
        </View>
      </View>

      {/* ── TAB BAR ────────────────────────────────────── */}
      <View style={styles.tabBarWrapper}>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabBarContent}>
          {PROFILE_TABS.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, isActive && styles.tabActive]}
                activeOpacity={0.7}
                onPress={() => handleTabPress(tab.key)}>
                <AppText
                  variant="small"
                  style={[
                    styles.tabLabel,
                    isActive && styles.tabLabelActive,
                  ]}>
                  {tab.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── TAB CONTENT ────────────────────────────────── */}
      <View style={styles.content}>{renderTabContent()}</View>
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
    alignItems: 'center',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
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
  savePill: {
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    backgroundColor: 'rgba(93,202,165,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(93,202,165,0.3)',
  },
  savePillText: {
    color: Colors.lightGreen,
    fontSize: ms(12),
    fontWeight: '600',
  },

  /* Avatar */
  avatarRow: {
    alignItems: 'center',
    marginBottom: vs(8),
  },
  avatar: {
    width: ms(80),
    height: ms(80),
    borderRadius: ms(40),
    backgroundColor: '#2D6A4F',
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    color: Colors.white,
    fontSize: ms(28),
    fontWeight: '700',
  },

  /* Name & subtitle */
  headerName: {
    color: Colors.white,
    fontSize: ms(24),
    fontWeight: '700',
    marginBottom: vs(4),
    textAlign: 'center',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: ms(12),
    textAlign: 'center',
    marginBottom: vs(10),
  },

  /* Badges */
  badgesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  badge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(12),
  },
  badgeVerified: {
    backgroundColor: 'rgba(45,106,79,0.35)',
  },
  badgeVerifiedText: {
    color: '#5DCAA5',
    fontSize: ms(11),
    fontWeight: '600',
  },
  badgePremium: {
    backgroundColor: 'rgba(217,164,6,0.25)',
  },
  badgePremiumText: {
    color: '#F5C842',
    fontSize: ms(11),
    fontWeight: '600',
  },

  /* Tab bar */
  tabBarWrapper: {
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  tabBarContent: {
    paddingHorizontal: s(8),
  },
  tab: {
    alignItems: 'center',
    paddingVertical: vs(10),
    paddingHorizontal: s(14),
    borderBottomWidth: 2.5,
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
});

export default EditProfileScreen;
