import React, {useState, useRef} from 'react';
import {View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import VisitSummaryTab from '../../components/Records/VisitSummaryTab';
import IndividualRecordsTab from '../../components/Records/IndividualRecordsTab';
import ServiceRecordsTab from '../../components/Records/ServiceRecordsTab';
import RecordsFinalTab from '../../components/Records/RecordsFinalTab';
import GlucoseRecordsTab from '../../components/Records/GlucoseRecordsTab';
import BPRecordsTab from '../../components/Records/BPRecordsTab';
import HRRecordsTab from '../../components/Records/HRRecordsTab';
import WeightRecordsTab from '../../components/Records/WeightRecordsTab';
import TempRecordsTab from '../../components/Records/TempRecordsTab';
import AsthmaRecordsTab from '../../components/Records/AsthmaRecordsTab';
import MigraineRecordsTab from '../../components/Records/MigraineRecordsTab';
import AnemiaRecordsTab from '../../components/Records/AnemiaRecordsTab';
const SERVICE_FILTERS = [
  {key: 'all', label: 'All', icon: 'grid-outline', bg: 'rgba(255,255,255,0.15)'},
  {key: 'lab', label: 'Lab', icon: 'flask-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'doc', label: 'Doctor', icon: 'medical-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'med', label: 'Medicines', icon: 'medkit-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'tele', label: 'Tele', icon: 'videocam-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'coach', label: 'Coach', icon: 'barbell-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'couns', label: 'Counsel', icon: 'chatbubbles-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'nurse', label: 'Nurse', icon: 'heart-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'physio', label: 'Physio', icon: 'fitness-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'hosp', label: 'Hospital', icon: 'business-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'well', label: 'Wellness', icon: 'leaf-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'ins', label: 'Insurance', icon: 'shield-checkmark-outline', bg: 'rgba(255,255,255,0.1)'},
];

const mainTabs = [
  {key: 'summary', label: 'Visit summary'},
  {key: 'individual', label: 'Individual records'},
  {key: 'services', label: 'Service records'},
  {key: 'final', label: 'My records'},
  {key: 'healthlogs', label: 'Log screens'},
];

const HEALTHLOG_FILTERS = [
  {key: 'glucose', label: 'Glucose', icon: 'water-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'bp', label: 'BP', icon: 'heart-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'heartrate', label: 'Heart Rate', icon: 'pulse-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'ecg', label: 'ECG', icon: 'analytics-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'temp', label: 'Temperature', icon: 'thermometer-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'weight', label: 'Weight', icon: 'scale-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'mood', label: 'Mood', icon: 'happy-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'migraine', label: 'Migraine', icon: 'flash-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'asthma', label: 'Asthma', icon: 'cloud-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'anemia', label: 'Anemia', icon: 'water-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'msk', label: 'MSK', icon: 'body-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'symptoms', label: 'Symptoms', icon: 'bandage-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'menstrual', label: 'Menstrual', icon: 'calendar-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'vaccination', label: 'Vaccination', icon: 'shield-checkmark-outline', bg: 'rgba(255,255,255,0.1)'},
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

const RecordsScreen = ({route}) => {

  const navigation = useNavigation();
  const initialTab = route?.params?.tab || 'summary';
  const initialLogFilter = route?.params?.logFilter || 'glucose';
  const [activeTab, setActiveTab] = useState(initialTab);
  const [activeFilter, setActiveFilter] = useState('all');
  const [serviceFilter, setServiceFilter] = useState('all');
  const [healthlogFilter, setHealthlogFilter] = useState(initialLogFilter);
  const addRef = useRef(null);

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

        {activeTab === 'services' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ribbonScroll}>
            {SERVICE_FILTERS.map(f => {
              const active = serviceFilter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  style={styles.ribbonItem}
                  onPress={() => setServiceFilter(f.key)}
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

        {activeTab === 'healthlogs' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ribbonScroll}>
            {HEALTHLOG_FILTERS.map(f => {
              const active = healthlogFilter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  style={styles.ribbonItem}
                  onPress={() => setHealthlogFilter(f.key)}
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
        {activeTab === 'summary' && <VisitSummaryTab />}
        {activeTab === 'individual' && <IndividualRecordsTab activeFilter={activeFilter} />}
        {activeTab === 'services' && <ServiceRecordsTab navigation={navigation} onAddRef={addRef} activeFilter={serviceFilter} />}
        {activeTab === 'final' && <RecordsFinalTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'glucose' && <GlucoseRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'bp' && <BPRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'heartrate' && <HRRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'weight' && <WeightRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'temp' && <TempRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'asthma' && <AsthmaRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'migraine' && <MigraineRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'anemia' && <AnemiaRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter !== 'glucose' && healthlogFilter !== 'bp' && healthlogFilter !== 'heartrate' && healthlogFilter !== 'weight' && healthlogFilter !== 'temp' && healthlogFilter !== 'asthma' && healthlogFilter !== 'migraine' && healthlogFilter !== 'anemia' && (
          <View style={{alignItems: 'center', paddingVertical: vs(40)}}>
            <AppText variant="body" color={Colors.textTertiary}>
              {HEALTHLOG_FILTERS.find(f => f.key === healthlogFilter)?.label} records coming soon
            </AppText>
          </View>
        )}
        <View style={{height: vs(80)}} />
      </ScrollView>

      {/* FAB - visible on service records tab */}
      {activeTab === 'services' && (
        <TouchableOpacity
          style={styles.fab}
          activeOpacity={0.8}
          onPress={() => addRef.current && addRef.current()}>
          <Icon family="Ionicons" name="add" size={26} color={Colors.white} />
        </TouchableOpacity>
      )}
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
  fab: {position: 'absolute', bottom: vs(24), right: s(16), width: ms(52), height: ms(52), borderRadius: ms(26), backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', elevation: 6, shadowColor: Colors.primary, shadowOffset: {width: 0, height: 4}, shadowOpacity: 0.3, shadowRadius: 8},
});

export default RecordsScreen;
