import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import {SCORE_STRIP, MAIN_TABS} from '../../constants/ayuIntelData';

import AIOverviewTab from '../../components/AyuIntel/AIOverviewTab';
import BiomarkerTab from '../../components/AyuIntel/BiomarkerTab';
import LifestyleTab from '../../components/AyuIntel/LifestyleTab';
import MedicalTab from '../../components/AyuIntel/MedicalTab';
import SymptomsTab from '../../components/AyuIntel/SymptomsTab';
import AnalyticsTab from '../../components/AyuIntel/AnalyticsTab';

const AyuIntelScreen = () => {
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('overview');
  const tabScrollRef = useRef(null);
  const contentScrollRef = useRef(null);

  const handleTabPress = useCallback((key) => {
    setActiveTab(key);
    contentScrollRef.current?.scrollTo({y: 0, animated: false});
  }, []);

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
        {/* Ayu Header */}
        <View style={styles.ayuHeader}>
          <View style={styles.ayuTitleRow}>
            <View style={styles.ayuGlyph}>
              <AppText style={{fontSize: ms(16)}}>🧠</AppText>
            </View>
            <AppText style={styles.ayuName}>Ayu Intelligence</AppText>
          </View>
          <AppText style={styles.ayuSub}>Priya Reddy · T2DM, HTN, Dyslipidaemia · Updated 28 Mar 2026</AppText>
        </View>

        {/* Score Strip */}
        <View style={styles.scoreStrip}>
          {SCORE_STRIP.map((item, idx) => (
            <View key={idx} style={[styles.scoreItem, idx < SCORE_STRIP.length - 1 && styles.scoreItemBorder]}>
              <AppText style={styles.scoreLbl}>{item.label}</AppText>
              <AppText style={[styles.scoreVal, {color: item.color || '#fff'}]}>{item.value}</AppText>
              <AppText style={styles.scoreSub}>{item.sub}</AppText>
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
          {MAIN_TABS.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.7}
                style={[styles.tabPill, isActive && styles.tabPillActive]}
                onPress={() => handleTabPress(tab.key)}>
                <Icon
                  family="Ionicons"
                  name={tab.ico}
                  size={ms(16)}
                  color={isActive ? '#063d2f' : 'rgba(255,255,255,0.5)'}
                />
                <AppText
                  style={[
                    styles.tabPillText,
                    isActive && styles.tabPillTextActive,
                  ]}>
                  {tab.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Tab Content */}
      <ScrollView
        ref={contentScrollRef}
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        {renderTabContent()}
        <View style={{height: vs(80)}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.primary},

  /* Header */
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: vs(4),
  },
  /* Ayu Header */
  ayuHeader: {
    paddingHorizontal: s(16),
    paddingTop: vs(8),
  },
  ayuTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(9),
    marginBottom: vs(2),
  },
  ayuGlyph: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(10),
    backgroundColor: 'rgba(29,158,117,0.3)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayuName: {
    fontSize: ms(19),
    fontWeight: '800',
    color: '#fff',
    letterSpacing: -0.3,
  },
  ayuSub: {
    fontSize: ms(10),
    color: 'rgba(255,255,255,0.45)',
    marginBottom: vs(8),
  },

  /* Score Strip */
  scoreStrip: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
    marginHorizontal: s(0),
  },
  scoreItem: {
    flex: 1,
    paddingVertical: vs(7),
    paddingHorizontal: s(9),
    alignItems: 'center',
  },
  scoreItemBorder: {
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },
  scoreLbl: {
    fontSize: ms(8),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    color: 'rgba(255,255,255,0.38)',
    marginBottom: vs(1),
  },
  scoreVal: {
    fontSize: ms(14),
    fontWeight: '700',
    fontFamily: 'monospace',
    color: '#fff',
  },
  scoreSub: {
    fontSize: ms(8),
    color: 'rgba(255,255,255,0.35)',
    marginTop: vs(1),
  },

  /* Tab Pills */
  tabScroll: {
    paddingTop: vs(9),
    paddingBottom: vs(12),
  },
  tabScrollContent: {
    paddingHorizontal: s(13),
    gap: s(5),
  },
  tabPill: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: s(14),
    borderRadius: ms(12),
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    gap: vs(3),
    minWidth: ms(62),
  },
  tabPillActive: {
    backgroundColor: '#fff',
    borderColor: '#fff',
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  tabPillText: {
    fontSize: ms(9),
    fontWeight: '700',
    color: 'rgba(255,255,255,0.5)',
    textAlign: 'center',
  },
  tabPillTextActive: {
    color: '#063d2f',
  },

  /* Body */
  body: {
    flex: 1,
    backgroundColor: Colors.background,
    borderTopLeftRadius: ms(0),
    borderTopRightRadius: ms(0),
  },
  bodyContent: {
    padding: s(12),
    paddingTop: s(10),
  },
});

export default AyuIntelScreen;
