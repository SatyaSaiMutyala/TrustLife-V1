import React, {useState, useRef} from 'react';
import {View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import VisitSummaryTab from '../../components/Records/VisitSummaryTab';
import IndividualRecordsTab, {LifestyleSubTabs, LIFESTYLE_TAB_LIST} from '../../components/Records/IndividualRecordsTab';
import {InsuranceClaimsBody} from '../Insurance/InsuranceClaimsScreen';
import NeonatalRecordsTab from '../../components/Records/Paediatrics/NeonatalRecordsTab';
import PaediatricRecordsTab from '../../components/Records/Paediatrics/PaediatricRecordsTab';
import PregnancyRecordsTab from '../../components/Records/Paediatrics/PregnancyRecordsTab';
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
import StressMoodRecordsTab from '../../components/Records/StressMoodRecordsTab';
import VaccineRecordsTab from '../../components/Records/VaccineRecordsTab';
import ECGRecordsTab from '../../components/Records/ECGRecordsTab';
import MSKRecordsTab from '../../components/Records/MSKRecordsTab';
import MenstrualRecordsTab from '../../components/Records/MenstrualRecordsTab';
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
  {key: 'gadgets', label: 'Gadgets', icon: 'phone-portrait-outline', bg: 'rgba(255,255,255,0.1)'},
];

const mainTabs = [
  {key: 'summary', label: 'Visit summary', icon: 'document-text-outline'},
  {key: 'lifestyle', label: 'Life style', icon: 'leaf-outline'},
  {key: 'healthlogs', label: 'Health Records', icon: 'pulse-outline'},
  {key: 'paediatrics', label: 'Paediatrics', icon: 'people-outline'},
  {key: 'insurance', label: 'Insurance', icon: 'shield-checkmark-outline'},
  {key: 'services', label: 'Bills', icon: 'receipt-outline'},
];

const PAEDIATRIC_FILTERS = [
  {key: 'neonatal', label: 'Neonatal Log', icon: 'happy-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'paediatric', label: 'Paediatric', icon: 'body-outline', bg: 'rgba(255,255,255,0.1)'},
  {key: 'pregnancy', label: 'Pregnancy Log', icon: 'flower-outline', bg: 'rgba(255,255,255,0.1)'},
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
  const [lifestyleSubTab, setLifestyleSubTab] = useState('food');
  const [paedFilter, setPaedFilter] = useState('neonatal');
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

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.tabRow}>
          {mainTabs.map(tab => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.tab, active && styles.tabActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}>
                <View style={[styles.tabIconWrap, active && styles.tabIconWrapActive]}>
                  <Icon
                    family="Ionicons"
                    name={tab.icon}
                    size={14}
                    color={active ? Colors.white : 'rgba(255,255,255,0.85)'}
                  />
                </View>
                <AppText
                  variant="caption"
                  color={active ? Colors.primary : 'rgba(255,255,255,0.8)'}
                  style={{fontWeight: active ? '700' : '500'}}>
                  {tab.label}
                </AppText>
                {tab.badge && (
                  <View style={styles.tabBadge}>
                    <AppText variant="small" color={Colors.white} style={{fontWeight: '500'}}>{tab.badge}</AppText>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {activeTab === 'summary' && (
          <View style={styles.infoBar}>
            <View style={styles.infoChip}>
              <Icon family="Ionicons" name="calendar-outline" size={13} color={Colors.white} />
              <AppText variant="small" color={Colors.white} style={{fontWeight: '600'}}>Apr 2026</AppText>
            </View>
            <View style={styles.infoChip}>
              <Icon family="Ionicons" name="people-outline" size={13} color={Colors.white} />
              <AppText variant="small" color={Colors.white} style={{fontWeight: '600'}}>All members</AppText>
            </View>
            <View style={styles.infoChip}>
              <Icon family="Ionicons" name="funnel-outline" size={13} color={Colors.white} />
              <AppText variant="small" color={Colors.white} style={{fontWeight: '600'}}>Filter</AppText>
            </View>
          </View>
        )}

        {activeTab === 'paediatrics' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ribbonScroll}>
            {PAEDIATRIC_FILTERS.map(f => {
              const active = paedFilter === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  style={styles.ribbonItem}
                  onPress={() => setPaedFilter(f.key)}
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

        {activeTab === 'insurance' && (
          <View style={styles.infoBar}>
            <View style={styles.infoChip}>
              <Icon family="Ionicons" name="shield-checkmark-outline" size={13} color={Colors.white} />
              <AppText variant="small" color={Colors.white} style={{fontWeight: '600'}}>Active</AppText>
            </View>
            <View style={styles.infoChip}>
              <Icon family="Ionicons" name="cash-outline" size={13} color={Colors.white} />
              <AppText variant="small" color={Colors.white} style={{fontWeight: '600'}}>{'\u20B9'}9.1L left</AppText>
            </View>
            <View style={styles.infoChip}>
              <Icon family="Ionicons" name="time-outline" size={13} color={Colors.white} />
              <AppText variant="small" color={Colors.white} style={{fontWeight: '600'}}>Till Mar 27</AppText>
            </View>
          </View>
        )}

        {activeTab === 'lifestyle' && (
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.ribbonScroll}>
            {LIFESTYLE_TAB_LIST.map(f => {
              const active = lifestyleSubTab === f.key;
              return (
                <TouchableOpacity
                  key={f.key}
                  style={styles.ribbonItem}
                  onPress={() => setLifestyleSubTab(f.key)}
                  activeOpacity={0.7}>
                  <View style={[styles.ribbonIcon, {backgroundColor: active ? Colors.white : 'rgba(255,255,255,0.1)'}]}>
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
        {activeTab === 'lifestyle' && <LifestyleSubTabs activeSubTab={lifestyleSubTab} onSubTabChange={setLifestyleSubTab} />}
        {activeTab === 'paediatrics' && paedFilter === 'neonatal' && <NeonatalRecordsTab />}
        {activeTab === 'paediatrics' && paedFilter === 'paediatric' && <PaediatricRecordsTab />}
        {activeTab === 'paediatrics' && paedFilter === 'pregnancy' && <PregnancyRecordsTab />}
        {activeTab === 'insurance' && <InsuranceClaimsBody navigation={navigation} />}
        {activeTab === 'individual' && <IndividualRecordsTab activeFilter={activeFilter} />}
        {activeTab === 'services' && serviceFilter !== 'gadgets' && <ServiceRecordsTab navigation={navigation} onAddRef={addRef} activeFilter={serviceFilter} />}
        {activeTab === 'services' && serviceFilter === 'gadgets' && <RecordsFinalTab navigation={navigation} lockToTab="gadgets" />}
        {activeTab === 'final' && <RecordsFinalTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'glucose' && <GlucoseRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'bp' && <BPRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'heartrate' && <HRRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'weight' && <WeightRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'temp' && <TempRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'asthma' && <AsthmaRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'migraine' && <MigraineRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'anemia' && <AnemiaRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'mood' && <StressMoodRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'vaccination' && <VaccineRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'ecg' && <ECGRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'msk' && <MSKRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter === 'menstrual' && <MenstrualRecordsTab navigation={navigation} />}
        {activeTab === 'healthlogs' && healthlogFilter !== 'glucose' && healthlogFilter !== 'bp' && healthlogFilter !== 'heartrate' && healthlogFilter !== 'weight' && healthlogFilter !== 'temp' && healthlogFilter !== 'asthma' && healthlogFilter !== 'migraine' && healthlogFilter !== 'anemia' && healthlogFilter !== 'mood' && healthlogFilter !== 'vaccination' && healthlogFilter !== 'ecg' && healthlogFilter !== 'msk' && healthlogFilter !== 'menstrual' && (
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
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingTop: vs(10)},
  topRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(6)},
  title: {marginTop: vs(1)},
  uploadBtn: {backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)', borderRadius: ms(20), paddingVertical: vs(6), paddingHorizontal: s(12)},
  tabRow: {flexDirection: 'row', alignItems: 'center', gap: s(8), paddingVertical: vs(4), paddingRight: s(12)},
  tab: {flexDirection: 'row', alignItems: 'center', gap: s(7), paddingVertical: vs(7), paddingHorizontal: s(12), paddingRight: s(14), borderRadius: ms(22), backgroundColor: 'rgba(255,255,255,0.10)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.22)'},
  tabActive: {backgroundColor: Colors.white, borderColor: Colors.white, shadowColor: '#000', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.2, shadowRadius: 6, elevation: 4},
  tabIconWrap: {width: ms(22), height: ms(22), borderRadius: ms(11), backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center'},
  tabIconWrapActive: {backgroundColor: Colors.primary},
  tabBadge: {backgroundColor: '#D85A30', borderRadius: ms(20), paddingVertical: vs(1), paddingHorizontal: s(5)},

  ribbonScroll: {paddingHorizontal: s(10), paddingTop: vs(6), paddingBottom: vs(6), gap: s(14)},
  infoBar: {flexDirection: 'row', alignItems: 'center', gap: s(8), height: ms(32) + vs(4) + ms(11) + vs(12), paddingHorizontal: s(2)},
  infoChip: {flexDirection: 'row', alignItems: 'center', gap: s(5), backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.22)', borderRadius: ms(18), paddingVertical: vs(6), paddingHorizontal: s(10)},
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
