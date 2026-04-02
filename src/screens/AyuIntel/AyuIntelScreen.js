import React, {useState, useRef} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Images from '../../constants/images';
import {SCORE_STRIP, MAIN_TABS} from '../../constants/ayuIntelData';

import AIOverviewTab from '../../components/AyuIntel/AIOverviewTab';
import BiomarkerTab from '../../components/AyuIntel/BiomarkerTab';
import LifestyleTab from '../../components/AyuIntel/LifestyleTab';
import MedicalTab from '../../components/AyuIntel/MedicalTab';
import SymptomsTab from '../../components/AyuIntel/SymptomsTab';
import AnalyticsTab from '../../components/AyuIntel/AnalyticsTab';

const AyuIntelScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('overview');
  const tabScrollRef = useRef(null);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <AIOverviewTab />;
      case 'biomarker':
        return <BiomarkerTab />;
      case 'lifestyle':
        return <LifestyleTab />;
      case 'medical':
        return <MedicalTab />;
      case 'symptoms':
        return <SymptomsTab />;
      case 'analytics':
        return <AnalyticsTab />;
      default:
        return <AIOverviewTab />;
    }
  };

  return (
    <View style={[styles.container, {paddingTop: insets.top}]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <View style={styles.headerLeft}>
            <Image source={Images.ayuLogo} style={styles.ayuLogo} resizeMode="contain" />
            <View>
              <AppText variant="screenName" color={Colors.white}>Ayu Intelligence</AppText>
              <AppText variant="small" color={Colors.heroTextMuted}>AI-powered health intelligence</AppText>
            </View>
          </View>
        </View>

        {/* Score Strip */}
        <View style={styles.scoreStrip}>
          {SCORE_STRIP.map((item, idx) => (
            <View key={idx} style={styles.scoreItem}>
              <AppText variant="small" color={Colors.heroTextMuted}>{item.label}</AppText>
              <AppText variant="header" color={item.color} style={styles.scoreValue}>{item.value}</AppText>
              <AppText variant="small" color={Colors.heroTextSubtle}>{item.sub}</AppText>
            </View>
          ))}
        </View>

        {/* Tab Pills */}
        <ScrollView
          ref={tabScrollRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabScrollContent}>
          {MAIN_TABS.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tabPill, activeTab === tab.key && styles.tabPillActive]}
              onPress={() => setActiveTab(tab.key)}>
              <AppText
                variant="caption"
                color={activeTab === tab.key ? Colors.primary : 'rgba(255,255,255,0.7)'}
                style={{fontWeight: activeTab === tab.key ? '600' : '400'}}>
                {tab.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        {renderTabContent()}
        <View style={{height: vs(20)}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.primary},
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingTop: vs(10), paddingBottom: vs(8)},
  headerTop: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  headerLeft: {flexDirection: 'row', alignItems: 'center', gap: s(10)},
  ayuLogo: {width: ms(36), height: ms(36), borderRadius: ms(18)},
  scoreStrip: {flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(14), backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: ms(12), padding: ms(10)},
  scoreItem: {alignItems: 'center', flex: 1},
  scoreValue: {fontWeight: '700', marginVertical: vs(1)},
  tabScroll: {marginTop: vs(10)},
  tabScrollContent: {gap: s(6)},
  tabPill: {paddingVertical: vs(5), paddingHorizontal: s(14), borderRadius: ms(20), backgroundColor: 'rgba(255,255,255,0.1)'},
  tabPillActive: {backgroundColor: Colors.white},
  body: {flex: 1, backgroundColor: Colors.background, },
  bodyContent: {padding: s(12)},
});

export default AyuIntelScreen;
