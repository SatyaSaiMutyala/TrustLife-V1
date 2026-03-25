import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import LifestyleSummaryTab from '../../components/Records/Lifestyle/LifestyleSummaryTab';
import LifestyleFoodTab from '../../components/Records/Lifestyle/LifestyleFoodTab';
import LifestyleSleepTab from '../../components/Records/Lifestyle/LifestyleSleepTab';
import LifestyleMedicationTab from '../../components/Records/Lifestyle/LifestyleMedicationTab';
import LifestyleActivityTab from '../../components/Records/Lifestyle/LifestyleActivityTab';

const tabs = [
  {key: 'summary', label: 'Summary', icon: 'grid-outline'},
  {key: 'food', label: 'Food', icon: 'restaurant-outline'},
  {key: 'sleep', label: 'Sleep', icon: 'moon-outline'},
  {key: 'medication', label: 'Medication', icon: 'medical-outline'},
  {key: 'activity', label: 'Activity', icon: 'walk-outline'},
];

const LifestyleScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('summary');

  const renderTab = () => {
    switch (activeTab) {
      case 'summary': return <LifestyleSummaryTab onTabChange={setActiveTab} />;
      case 'food': return <LifestyleFoodTab />;
      case 'sleep': return <LifestyleSleepTab />;
      case 'medication': return <LifestyleMedicationTab />;
      case 'activity': return <LifestyleActivityTab />;
      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.header}>
        <View style={styles.topRow}>
          <View style={styles.topRowLeft}>
            <TouchableOpacity
              style={styles.backBtn}
              activeOpacity={0.7}
              onPress={() => navigation.goBack()}>
              <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.white} />
            </TouchableOpacity>
            <View style={styles.titleBlock}>
              <AppText variant="screenName" color={Colors.white}>Lifestyle habits</AppText>
              <AppText variant="caption" color={Colors.heroTextMuted} style={styles.subtitle}>
                4 categories · Daily tracking · Monthly analysis
              </AppText>
            </View>
          </View>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.tabScroll}
          contentContainerStyle={styles.tabScrollContent}>
          {tabs.map(tab => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={styles.tab}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}>
                <View style={styles.tabInner}>
                  <Icon
                    family="Ionicons"
                    name={tab.icon}
                    size={16}
                    color={active ? Colors.white : 'rgba(255,255,255,0.45)'}
                  />
                  <AppText
                    variant="caption"
                    color={active ? Colors.white : 'rgba(255,255,255,0.55)'}
                    style={{fontWeight: '500', marginLeft: s(5)}}>
                    {tab.label}
                  </AppText>
                </View>
                {active && <View style={styles.tabIndicator} />}
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        {renderTab()}
        <View style={{height: vs(20)}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingTop: vs(14)},
  topRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(10)},
  topRowLeft: {flexDirection: 'row', alignItems: 'center'},
  backBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  titleBlock: {marginLeft: s(12)},
  subtitle: {marginTop: vs(2)},
  tabScroll: {borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.15)', marginTop: vs(2)},
  tabScrollContent: {paddingRight: s(16)},
  tab: {paddingVertical: vs(10), paddingHorizontal: s(14), position: 'relative'},
  tabInner: {flexDirection: 'row', alignItems: 'center'},
  tabIndicator: {position: 'absolute', bottom: 0, left: '10%', right: '10%', height: vs(2), backgroundColor: Colors.lightGreen, borderRadius: ms(1)},
  body: {flex: 1},
  bodyContent: {padding: s(12)},
});

export default LifestyleScreen;
