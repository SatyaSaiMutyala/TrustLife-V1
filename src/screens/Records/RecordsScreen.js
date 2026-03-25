import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import VisitSummaryTab from '../../components/Records/VisitSummaryTab';
import IndividualRecordsTab from '../../components/Records/IndividualRecordsTab';

const mainTabs = [
  {key: 'summary', label: 'Visit summary'},
  {key: 'individual', label: 'Individual records', badge: '3'},
];

const FILTERS = [
  {key: 'all', label: 'All', icon: 'grid-outline', bg: 'rgba(255,255,255,0.15)'},
  {key: 'notes', label: 'Doctor notes', icon: 'medical-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'labs', label: 'Lab reports', icon: 'flask-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'imaging', label: 'Imaging', icon: 'scan-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'rx', label: 'Prescriptions', icon: 'document-text-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'vax', label: 'Vaccination', icon: 'shield-checkmark-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'lifestyle', label: 'Lifestyle', icon: 'fitness-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'symptoms', label: 'Symptoms', icon: 'bandage-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'insurance', label: 'Insurance', icon: 'shield-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'otherLogs', label: 'Other logs', icon: 'analytics-outline', bg: 'rgba(255,255,255,0.1)'},
];

const RecordsScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('summary');
  const [activeFilter, setActiveFilter] = useState('all');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.header}>
        <View style={styles.topRow}>
          <View>
            <AppText variant="subtitle" color={Colors.heroTextMuted}>Health vault</AppText>
            <AppText variant="screenName" color={Colors.white} style={styles.title}>Records</AppText>
          </View>
          <TouchableOpacity style={styles.uploadBtn} activeOpacity={0.7}>
            <AppText variant="small" color={Colors.white} style={{fontWeight: '500'}}>+ Upload</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.tabRow}>
          {mainTabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={styles.tab}
              onPress={() => setActiveTab(tab.key)}
              activeOpacity={0.7}>
              <View style={styles.tabInner}>
                <AppText variant="caption" color={activeTab === tab.key ? Colors.white : 'rgba(255,255,255,0.55)'} style={{fontWeight: '500'}}>
                  {tab.label}
                </AppText>
                {tab.badge && (
                  <View style={styles.tabBadge}>
                    <AppText variant="small" color={Colors.white} style={{fontWeight: '500'}}>{tab.badge}</AppText>
                  </View>
                )}
              </View>
              {activeTab === tab.key && <View style={styles.tabIndicator} />}
            </TouchableOpacity>
          ))}
        </View>

        {activeTab === 'individual' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ribbonScroll}>
            {FILTERS.map(f => {
              const active = activeFilter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  style={styles.ribbonItem}
                  onPress={() => {
                    if (f.key === 'vax') {
                      navigation.navigate('VaccinationLog');
                      return;
                    }
                    setActiveFilter(f.key);
                  }}
                  activeOpacity={0.7}>
                  <View style={[styles.ribbonIcon, {backgroundColor: active ? Colors.white : f.bg}]}>
                    <Icon
                      family="Ionicons"
                      name={f.icon}
                      size={16}
                      color={active ? Colors.primary : 'rgba(255,255,255,0.85)'}
                    />
                  </View>
                  <AppText
                    variant="small"
                    color={active ? Colors.white : 'rgba(255,255,255,0.6)'}
                    style={[styles.ribbonLabel, active && {fontWeight: '700'}]}
                    numberOfLines={1}>
                    {f.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </ScrollView>
        )}
      </View>

      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        {activeTab === 'summary' ? (
          <VisitSummaryTab />
        ) : (
          <IndividualRecordsTab activeFilter={activeFilter} />
        )}
        <View style={{height: vs(20)}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingTop: vs(14)},
  topRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(14)},
  title: {marginTop: vs(1)},
  uploadBtn: {backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)', borderRadius: ms(20), paddingVertical: vs(6), paddingHorizontal: s(12)},
  tabRow: {flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: 'rgba(255,255,255,0.15)'},
  tab: {flex: 1, alignItems: 'center', paddingVertical: vs(10), position: 'relative'},
  tabInner: {flexDirection: 'row', alignItems: 'center', gap: s(4)},
  tabBadge: {backgroundColor: '#D85A30', borderRadius: ms(20), paddingVertical: vs(1), paddingHorizontal: s(5)},
  tabIndicator: {position: 'absolute', bottom: 0, left: '20%', right: '20%', height: vs(2), backgroundColor: Colors.lightGreen, borderRadius: ms(1)},

  ribbonScroll: {paddingHorizontal: s(10), paddingTop: vs(12), paddingBottom: vs(10), gap: s(14)},
  ribbonItem: {alignItems: 'center', width: ms(56)},
  ribbonIcon: {width: ms(32), height: ms(32), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center'},
  ribbonLabel: {marginTop: vs(4), textAlign: 'center', fontSize: ms(9)},
  ribbonCount: {marginTop: vs(2), paddingHorizontal: s(6), paddingVertical: vs(1), borderRadius: ms(8), backgroundColor: 'rgba(255,255,255,0.15)', minWidth: ms(16), alignItems: 'center'},
  ribbonCountActive: {backgroundColor: Colors.white},

  body: {flex: 1},
  bodyContent: {padding: s(12)},
});

export default RecordsScreen;
