import React from 'react';
import {View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import DayStrip from '../../components/Tracking/DayStrip';
import DailyProgress from '../../components/Tracking/DailyProgress';
import TrackerGrid from '../../components/Tracking/TrackerGrid';
import PriorityReadings from '../../components/Tracking/PriorityReadings';
import SymptomLogs from '../../components/Tracking/SymptomLogs';
import LogTimeline from '../../components/Tracking/LogTimeline';

const TrackingScreen = () => (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

    <View style={styles.header}>
      <View style={styles.headerTop}>
        <View>
          <AppText variant="subtitle" color={Colors.heroTextMuted}>Friday, 21 March 2026</AppText>
          <AppText variant="screenName" color={Colors.white} style={styles.title}>Tracking</AppText>
        </View>
        <TouchableOpacity style={styles.addBtn} activeOpacity={0.7}>
          <AppText variant="small" color={Colors.white} style={{fontWeight: '500'}}>+ Log reading</AppText>
        </TouchableOpacity>
      </View>
      <DayStrip />
    </View>

    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      <DailyProgress />
      <TrackerGrid />
      <PriorityReadings />
      <SymptomLogs />
      <LogTimeline />
      <View style={{height: vs(20)}} />
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(16),
    paddingTop: vs(14),
    paddingBottom: vs(22),
  },
  headerTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(14),
  },
  title: {
    marginTop: vs(2),
  },
  addBtn: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.25)',
    borderRadius: ms(20),
    paddingVertical: vs(6),
    paddingHorizontal: s(12),
  },
  scroll: {flex: 1},
  scrollContent: {padding: s(12)},
});

export default TrackingScreen;
