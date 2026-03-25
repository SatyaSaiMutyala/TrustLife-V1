import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import HPSScoreTab from '../../components/Progress/HPSScoreTab';
import BiomarkersTab from '../../components/Progress/BiomarkersTab';
import LifestyleTab from '../../components/Progress/LifestyleTab';
import MedicationTab from '../../components/Progress/MedicationTab';
import ConditionsTab from '../../components/Progress/ConditionsTab';

const periods = ['2W', '1M', '3M', '1Y'];
const tabs = [
  {key: 'score', label: 'HPS Score'},
  {key: 'biomarkers', label: 'Biomarkers'},
  {key: 'lifestyle', label: 'Lifestyle'},
  {key: 'medication', label: 'Medical'},
  {key: 'conditions', label: 'Conditions'},
];

const ProgressScreen = () => {
  const navigation = useNavigation();
  const [activePeriod, setActivePeriod] = useState('1M');
  const [activeTab, setActiveTab] = useState('score');

  const renderTab = () => {
    switch (activeTab) {
      case 'score': return <HPSScoreTab />;
      case 'biomarkers': return <BiomarkersTab />;
      case 'lifestyle': return <LifestyleTab />;
      case 'medication': return <MedicationTab />;
      case 'conditions': return <ConditionsTab />;
      default: return null;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.topRow}>
          <View>
            <AppText variant="subtitle" color={Colors.heroTextMuted}>Your health journey</AppText>
            <AppText variant="screenName" color={Colors.white} style={styles.title}>Progress</AppText>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8)}}>
            <View style={styles.periodToggle}>
              {periods.map(p => (
                <TouchableOpacity
                  key={p}
                  style={[styles.periodBtn, activePeriod === p && styles.periodBtnActive]}
                  onPress={() => setActivePeriod(p)}>
                  <AppText variant="caption" color={activePeriod === p ? Colors.primary : 'rgba(255,255,255,0.6)'} style={{fontWeight: '500'}}>{p}</AppText>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity
              style={styles.downloadBtn}
              onPress={() => navigation.navigate('HPSReport')}>
              <Icon family="Ionicons" name="download-outline" size={18} color="#fff" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabScroll}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}>
              <AppText variant="caption" color={activeTab === tab.key ? Colors.white : 'rgba(255,255,255,0.55)'} style={{fontWeight: '500'}}>{tab.label}</AppText>
              {activeTab === tab.key && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Tab Content */}
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
  topRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(14)},
  title: {marginTop: vs(1)},
  periodToggle: {flexDirection: 'row', backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: ms(20), padding: ms(3), gap: ms(2)},
  periodBtn: {paddingVertical: vs(4), paddingHorizontal: s(10), borderRadius: ms(16)},
  periodBtnActive: {backgroundColor: Colors.white},
  tabScroll: {borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.15)', marginTop: vs(2)},
  tab: {paddingVertical: vs(10), paddingHorizontal: s(14), position: 'relative'},
  tabIndicator: {position: 'absolute', bottom: 0, left: '10%', right: '10%', height: vs(2), backgroundColor: Colors.lightGreen, borderRadius: ms(1)},
  downloadBtn: {width: ms(34), height: ms(34), borderRadius: ms(17), backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center'},
  body: {flex: 1},
  bodyContent: {padding: s(12)},
});

export default ProgressScreen;
