import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

// Doctor Notes
import VisitSummaryTab from '../../components/Records/DoctorNotes/VisitSummaryTab';
import VisitFindingsTab from '../../components/Records/DoctorNotes/VisitFindingsTab';
import VisitVitalsTab from '../../components/Records/DoctorNotes/VisitVitalsTab';
import VisitPrescriptionTab from '../../components/Records/DoctorNotes/VisitPrescriptionTab';
import VisitInvestigationsTab from '../../components/Records/DoctorNotes/VisitInvestigationsTab';
import VisitFollowUpTab from '../../components/Records/DoctorNotes/VisitFollowUpTab';

// Lab Reports
import LabReportSmartView from '../../components/Records/LabReports/LabReportSmartView';
import LabReportTraditionalView from '../../components/Records/LabReports/LabReportTraditionalView';

// Imaging
import EchoSummaryTab from '../../components/Records/Imaging/EchoSummaryTab';
import EchoMeasurementsTab from '../../components/Records/Imaging/EchoMeasurementsTab';
import EchoContextTab from '../../components/Records/Imaging/EchoContextTab';
import EchoPeerGroupTab from '../../components/Records/Imaging/EchoPeerGroupTab';
import XraySummaryTab from '../../components/Records/Imaging/XraySummaryTab';
import XrayFindingsTab from '../../components/Records/Imaging/XrayFindingsTab';
import XrayDetailsTab from '../../components/Records/Imaging/XrayDetailsTab';
import XrayClinicalContextTab from '../../components/Records/Imaging/XrayClinicalContextTab';
import XrayPeerGroupTab from '../../components/Records/Imaging/XrayPeerGroupTab';

// Prescriptions
import RxCurrentTab from '../../components/Records/Prescriptions/RxCurrentTab';
import RxHistoryTab from '../../components/Records/Prescriptions/RxHistoryTab';
import RxByDoctorTab from '../../components/Records/Prescriptions/RxByDoctorTab';
import RxInteractionsTab from '../../components/Records/Prescriptions/RxInteractionsTab';

const TITLES = {notes: 'Doctor Notes', labs: 'Lab Reports', imaging: 'Imaging', rx: 'Prescriptions'};
const SUBTITLES = {notes: 'Visit summary & clinical details', labs: 'Smart analysis & traditional view', imaging: 'Scans, echo & X-ray results', rx: 'Current medications & history'};

const TABS = {
  notes: [{key:'summary',label:'Summary'},{key:'findings',label:'Findings'},{key:'vitals',label:'Vitals'},{key:'prescription',label:'Rx'},{key:'investigations',label:'Labs'},{key:'followUp',label:'Follow-up'}],
  labs: [{key:'smart',label:'Smart view'},{key:'traditional',label:'Traditional'}],
  imaging: [{key:'summary',label:'Summary'},{key:'measurements',label:'Measurements'},{key:'context',label:'Context'},{key:'peerGroup',label:'Peer Group'}],
  rx: [{key:'current',label:'Current'},{key:'history',label:'History'},{key:'byDoctor',label:'By Doctor'},{key:'interactions',label:'Interactions'}],
};

const DEFAULTS = {notes: 'summary', labs: 'smart', imaging: 'summary', rx: 'current'};

const RecordDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const insets = useSafeAreaInsets();
  const {cat, record} = route.params;
  const [activeTab, setActiveTab] = useState(DEFAULTS[cat] || 'summary');

  const renderContent = () => {
    if (cat === 'notes') {
      switch (activeTab) {
        case 'summary': return <VisitSummaryTab />;
        case 'findings': return <VisitFindingsTab />;
        case 'vitals': return <VisitVitalsTab />;
        case 'prescription': return <VisitPrescriptionTab />;
        case 'investigations': return <VisitInvestigationsTab />;
        case 'followUp': return <VisitFollowUpTab />;
        default: return <VisitSummaryTab />;
      }
    }
    if (cat === 'labs') {
      return activeTab === 'smart' ? <LabReportSmartView /> : <LabReportTraditionalView />;
    }
    if (cat === 'imaging') {
      switch (activeTab) {
        case 'summary': return <EchoSummaryTab />;
        case 'measurements': return <EchoMeasurementsTab />;
        case 'context': return <EchoContextTab />;
        case 'peerGroup': return <EchoPeerGroupTab />;
        default: return <EchoSummaryTab />;
      }
    }
    if (cat === 'rx') {
      switch (activeTab) {
        case 'current': return <RxCurrentTab />;
        case 'history': return <RxHistoryTab />;
        case 'byDoctor': return <RxByDoctorTab />;
        case 'interactions': return <RxInteractionsTab />;
        default: return <RxCurrentTab />;
      }
    }
    return null;
  };

  const tabs = TABS[cat] || [];

  return (
    <View style={sty.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Green header */}
      <View style={[sty.header, {paddingTop: insets.top + vs(10)}]}>
        {/* Top bar: back + title */}
        <View style={sty.topBar}>
          <TouchableOpacity
            style={sty.backBtn}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}>
            <Icon family="Ionicons" name="chevron-back" size={ms(16)} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText style={sty.headerTitle}>{TITLES[cat]}</AppText>
            <AppText style={sty.headerSub}>{SUBTITLES[cat]}</AppText>
          </View>
        </View>

        {/* Sub-tab pills */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={sty.tabScroll}>
          {tabs.map(tab => (
            <TouchableOpacity
              key={tab.key}
              style={[sty.tab, activeTab === tab.key && sty.tabActive]}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab.key)}>
              <AppText
                variant="small"
                color={activeTab === tab.key ? Colors.primary : 'rgba(255,255,255,0.6)'}
                style={activeTab === tab.key ? {fontWeight: '600'} : undefined}>
                {tab.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={sty.scroll} contentContainerStyle={sty.scrollContent} showsVerticalScrollIndicator={false}>
        {renderContent()}
      </ScrollView>
    </View>
  );
};

const sty = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingBottom: vs(10), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  tabScroll: {paddingHorizontal: s(13), paddingBottom: vs(12), gap: s(6)},
  tab: {paddingHorizontal: s(13), paddingVertical: vs(6), borderRadius: ms(20), borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.25)', backgroundColor: 'transparent'},
  tabActive: {backgroundColor: Colors.white, borderColor: Colors.white},
  scroll: {flex: 1},
  scrollContent: {padding: s(12)},
});

export default RecordDetailScreen;
