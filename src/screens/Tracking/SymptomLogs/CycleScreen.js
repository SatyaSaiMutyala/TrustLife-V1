import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';

import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

import WheelTab from '../../../components/Fitness/Cycle/WheelTab';
import CalendarTab from '../../../components/Fitness/Cycle/CalendarTab';
import LogTab from '../../../components/Fitness/Cycle/DailyLogTab';
import PCOSTab from '../../../components/Fitness/Cycle/PCOSTab';

/* ─── Tab configuration ─────────────────────────────── */

const TABS = [
  {key: 'wheel', label: 'Cycle', icon: 'ellipse-outline'},
  {key: 'calendar', label: 'Calendar', icon: 'calendar-outline'},
  {key: 'log', label: 'Log', icon: 'create-outline'},
  {key: 'pcos', label: 'PCOS', icon: 'flask-outline'},
];

/* ─── Component ─────────────────────────────────────── */

const CycleScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('wheel');

  const renderTabContent = () => {
    switch (activeTab) {
      case 'wheel':
        return <WheelTab />;
      case 'calendar':
        return <CalendarTab />;
      case 'log':
        return <LogTab />;
      case 'pcos':
        return <PCOSTab />;
      default:
        return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── HEADER ─────────────────────────────────────── */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={styles.headerTitle}>Cycle & hormonal health</AppText>
            <AppText variant="caption" style={styles.headerSub}>
              Priya - Avg 28d - Day 24 - Late luteal
            </AppText>
          </View>
        </View>
      </View>

      {/* ── TAB BAR ────────────────────────────────────── */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBarWrap} contentContainerStyle={styles.tabBarContent}>
        {TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[styles.tab, isActive && styles.tabActive]}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab.key)}>
              <AppText
                variant="small"
                color={isActive ? Colors.primary : Colors.textTertiary}
                style={{fontWeight: isActive ? '700' : '500'}}>
                {tab.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── TAB CONTENT ────────────────────────────────── */}
      <View style={styles.content}>{renderTabContent()}</View>

      {/* ── BOTTOM BAR ────────────────────────────────── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
          <Icon family="Ionicons" name="save-outline" size={ms(20)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
            Save Day 24 log {'\u00b7'} Late luteal
          </AppText>
        </TouchableOpacity>
        <View style={styles.secondaryButtonRow}>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7} onPress={() => navigation.navigate('Records', {tab: 'healthlogs', logFilter: 'menstrual'})}>
            <Icon family="Ionicons" name="document-text-outline" size={ms(14)} color={Colors.white} />
            <AppText variant="caption" color={Colors.white} style={{marginLeft: s(5), fontWeight: '600'}}>Records</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'cycle', initialTab: 'cycleIntel'})}>
            <Icon family="Ionicons" name="bulb-outline" size={ms(14)} color={Colors.white} />
            <AppText variant="caption" color={Colors.white} style={{marginLeft: s(5), fontWeight: '600'}}>Ayu Intel</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

/* ── STYLES ──────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  header: {backgroundColor: Colors.primary, paddingTop: vs(10), paddingBottom: vs(10), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(2)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(11)},

  tabBarWrap: {backgroundColor: Colors.white, borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight, flexGrow: 0},
  tabBarContent: {paddingHorizontal: s(4)},
  tab: {paddingHorizontal: s(10), paddingVertical: vs(10), borderBottomWidth: 2.5, borderBottomColor: 'transparent'},
  tabActive: {borderBottomColor: Colors.primary},

  content: {flex: 1},

  bottomBar: {backgroundColor: Colors.white, paddingHorizontal: s(13), paddingTop: vs(8), paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10), borderTopWidth: 0.5, borderTopColor: '#d1d5db'},
  primaryButton: {flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: vs(14), borderRadius: ms(13), alignItems: 'center', justifyContent: 'center', gap: s(8)},
  secondaryButtonRow: {flexDirection: 'row', marginTop: vs(8), gap: s(8)},
  secondaryButton: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: vs(7), borderRadius: ms(10), borderWidth: 0.5, borderColor: Colors.accent, backgroundColor: Colors.accent},
});

export default CycleScreen;
