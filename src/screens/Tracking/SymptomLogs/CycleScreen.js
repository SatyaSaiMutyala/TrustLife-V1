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
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <TouchableOpacity onPress={() => navigation.goBack()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon family="Ionicons" name="chevron-back" size={ms(22)} color={Colors.white} />
            </TouchableOpacity>
            <AppText variant="body" color="rgba(255,255,255,0.8)" style={{marginLeft: s(10)}}>Tracking</AppText>
          </View>
          <TouchableOpacity style={styles.savePill} activeOpacity={0.7}>
            <AppText variant="small" color={Colors.primary} style={{fontWeight: '700'}}>Save</AppText>
          </TouchableOpacity>
        </View>
        <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(6)}}>
          Cycle & hormonal health
        </AppText>
        <AppText variant="caption" color="rgba(255,255,255,0.5)" style={{marginTop: vs(2), paddingBottom: vs(4)}}>
          Priya {'\u00b7'} Avg 28d {'\u00b7'} Day 24 {'\u00b7'} Late luteal {'\u00b7'} Tracking since Jan 2024
        </AppText>
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
            <Icon family="Ionicons" name="document-text-outline" size={ms(14)} color={Colors.textSecondary} />
            <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(5), fontWeight: '600'}}>Records</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'cycle', initialTab: 'cycleIntel'})}>
            <Icon family="Ionicons" name="bulb-outline" size={ms(14)} color={Colors.textSecondary} />
            <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(5), fontWeight: '600'}}>Ayu Intel</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

/* ── STYLES ──────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(8)},
  topBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(8)},
  savePill: {backgroundColor: Colors.white, paddingHorizontal: s(14), paddingVertical: vs(5), borderRadius: ms(20)},

  tabBarWrap: {backgroundColor: Colors.white, borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight, flexGrow: 0},
  tabBarContent: {paddingHorizontal: s(4)},
  tab: {paddingHorizontal: s(10), paddingVertical: vs(10), borderBottomWidth: 2.5, borderBottomColor: 'transparent'},
  tabActive: {borderBottomColor: Colors.primary},

  content: {flex: 1},

  bottomBar: {backgroundColor: Colors.white, paddingHorizontal: s(13), paddingTop: vs(8), paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10), borderTopWidth: 0.5, borderTopColor: '#d1d5db'},
  primaryButton: {flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: vs(14), borderRadius: ms(13), alignItems: 'center', justifyContent: 'center', gap: s(8)},
  secondaryButtonRow: {flexDirection: 'row', marginTop: vs(8), gap: s(8)},
  secondaryButton: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: vs(7), borderRadius: ms(10), borderWidth: 0.5, borderColor: '#d1d5db', backgroundColor: Colors.white},
});

export default CycleScreen;
