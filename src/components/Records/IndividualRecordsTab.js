import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import LifestyleSummaryTab from './Lifestyle/LifestyleSummaryTab';
import LifestyleFoodTab from './Lifestyle/LifestyleFoodTab';
import LifestyleSleepTab from './Lifestyle/LifestyleSleepTab';
import LifestyleMedicationTab from './Lifestyle/LifestyleMedicationTab';
import LifestyleActivityTab from './Lifestyle/LifestyleActivityTab';
import VaxOverviewTab from './Vaccination/VaxOverviewTab';
import VaxAdministrationTab from './Vaccination/VaxAdministrationTab';
import VaxHowItWorksTab from './Vaccination/VaxHowItWorksTab';
import VaxSideEffectsTab from './Vaccination/VaxSideEffectsTab';
import VaxScheduleTab from './Vaccination/VaxScheduleTab';
import VaxCertificateTab from './Vaccination/VaxCertificateTab';
import SymDayByDayTab from './Symptoms/SymDayByDayTab';
import SymCorrelationsTab from './Symptoms/SymCorrelationsTab';
import SymTriggersTab from './Symptoms/SymTriggersTab';
import SymPatternsTab from './Symptoms/SymPatternsTab';
import SymDoctorNotesTab from './Symptoms/SymDoctorNotesTab';
import SymVsLastMonthTab from './Symptoms/SymVsLastMonthTab';
import LabAllReportsTab from './LabReports/LabAllReportsTab';
import LabByLabTab from './LabReports/LabByLabTab';
import LabBiomarkersTab from './LabReports/LabBiomarkersTab';
import LabReportSmartView from './LabReports/LabReportSmartView';
import LabReportTraditionalView from './LabReports/LabReportTraditionalView';
import LabBiomarkerDetailView from './LabReports/LabBiomarkerDetailView';
import ImgAllTab from './Imaging/ImgAllTab';
import ImgByFacilityTab from './Imaging/ImgByFacilityTab';
import XraySummaryTab from './Imaging/XraySummaryTab';
import XrayFindingsTab from './Imaging/XrayFindingsTab';
import XrayPeerGroupTab from './Imaging/XrayPeerGroupTab';
import XrayClinicalContextTab from './Imaging/XrayClinicalContextTab';
import XrayDetailsTab from './Imaging/XrayDetailsTab';
import EchoSummaryTab from './Imaging/EchoSummaryTab';
import EchoMeasurementsTab from './Imaging/EchoMeasurementsTab';
import EchoPeerGroupTab from './Imaging/EchoPeerGroupTab';
import EchoContextTab from './Imaging/EchoContextTab';
import UsgSummaryTab from './Imaging/UsgSummaryTab';
import UsgFindingsTab from './Imaging/UsgFindingsTab';
import UsgPeerGroupTab from './Imaging/UsgPeerGroupTab';
import UsgContextTab from './Imaging/UsgContextTab';
import RxCurrentTab from './Prescriptions/RxCurrentTab';
import RxHistoryTab from './Prescriptions/RxHistoryTab';
import RxByDoctorTab from './Prescriptions/RxByDoctorTab';
import RxInteractionsTab from './Prescriptions/RxInteractionsTab';
import MetDrugDetailsTab from './Prescriptions/MetDrugDetailsTab';
import MetAdherenceTab from './Prescriptions/MetAdherenceTab';
import MetSymptomsTab from './Prescriptions/MetSymptomsTab';
import MetVisitsTab from './Prescriptions/MetVisitsTab';
import MetHistoryTab from './Prescriptions/MetHistoryTab';
import InsOverviewTab from './Insurance/InsOverviewTab';
import InsClaimsTab from './Insurance/InsClaimsTab';
import InsAnalyticsTab from './Insurance/InsAnalyticsTab';
import InsBenefitsTab from './Insurance/InsBenefitsTab';
import InsPremiumTab from './Insurance/InsPremiumTab';
import InsDocumentsTab from './Insurance/InsDocumentsTab';
import NotesChronologicalTab from './DoctorNotes/NotesChronologicalTab';
import NotesByDoctorTab from './DoctorNotes/NotesByDoctorTab';
import VisitSummaryTab from './DoctorNotes/VisitSummaryTab';
import VisitVitalsTab from './DoctorNotes/VisitVitalsTab';
import VisitFindingsTab from './DoctorNotes/VisitFindingsTab';
import VisitPrescriptionTab from './DoctorNotes/VisitPrescriptionTab';
import VisitInvestigationsTab from './DoctorNotes/VisitInvestigationsTab';
import VisitFollowUpTab from './DoctorNotes/VisitFollowUpTab';
import BmiTrackerTab from './OtherLogs/BmiTrackerTab';
import GrowthTrackerTab from './OtherLogs/GrowthTrackerTab';
import AddLogTab from './OtherLogs/AddLogTab';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

const backgroundSecondary = '#F3F4F6';
const borderTertiary = '#d1d5db';

/* ─── Records data ─── */
const RECORDS = [
  // March 2026
  {
    id: 1,
    type: 'notes',
    month: 'March 2026',
    iconName: 'medical-outline',
    iconBg: '#EAF3DE',
    title: 'Dr. Kavitha Reddy \u00B7 Endocrinology',
    sub: '6-month review \u00B7 T2DM + HTN + Dyslipidaemia',
    pillLabel: 'Doctor note',
    pillBg: Colors.blueBg,
    pillColor: Colors.blueText,
    source: 'KIMS Hospital',
    date: '15 Mar',
    size: 'Full visit \u203A',
    footerTags: [
      {label: 'HbA1c \u2192 7.8%', bg: Colors.tealBg, color: Colors.tealText},
      {label: 'LDL \u2192 118', bg: Colors.amberBg, color: Colors.amberText},
      {label: 'Eye exam overdue', bg: Colors.redBg, color: Colors.redText},
    ],
  },
  {
    id: 2,
    type: 'labs',
    month: 'March 2026',
    iconName: 'flask-outline',
    iconBg: Colors.amberBg,
    title: 'HbA1c + Lipid panel + Kidney function',
    sub: 'Apollo Diagnostics \u00B7 Fasting 12h \u00B7 NABL \u00B7 HPLC',
    pillLabel: 'Lab report',
    pillBg: Colors.amberBg,
    pillColor: Colors.amberText,
    source: '3 Mar 2026',
    date: '3 Mar',
    size: 'PDF \u00B7 248 KB',
    valueChips: [
      {label: 'HbA1c 7.8% \u2191', bg: Colors.redBg, color: Colors.redText},
      {label: 'LDL 118 \u2193', bg: Colors.tealBg, color: Colors.tealText},
      {label: 'TG 162 \u2191', bg: Colors.amberBg, color: Colors.amberText},
      {label: 'eGFR 72 \u2192', bg: Colors.tealBg, color: Colors.tealText},
    ],
    footerTags: [
      {label: 'Apollo Diagnostics', bg: Colors.amberBg, color: Colors.amberText},
    ],
  },
  {
    id: 3,
    type: 'symptoms',
    month: 'March 2026',
    iconName: 'bandage-outline',
    iconBg: Colors.pinkBg,
    title: 'Fatigue \u00B7 Breathlessness on exertion',
    sub: 'Logged by Priya \u00B7 Severity 4/10 \u00B7 2 weeks duration',
    pillLabel: 'Symptom log',
    pillBg: Colors.pinkBg,
    pillColor: '#72243E',
    source: 'Linked to B12 deficiency screen',
    date: '10 Mar',
    size: 'Self-logged',
    symptomPattern: [
      Colors.red, Colors.amber, Colors.red, Colors.amber, Colors.red,
      Colors.teal, Colors.teal, Colors.red, Colors.red, Colors.amber,
      Colors.red, Colors.amber, Colors.teal, Colors.red,
    ],
    footerTags: [
      {label: 'Discussed with Dr. Kavitha 15 Mar', bg: Colors.pinkBg, color: '#72243E'},
    ],
  },
  {
    id: 4,
    type: 'lifestyle',
    month: 'March 2026',
    iconName: 'fitness-outline',
    iconBg: Colors.tealBg,
    title: 'Monthly lifestyle snapshot \u00B7 Feb 2026',
    sub: 'Sleep \u00B7 Steps \u00B7 Hydration \u00B7 Meals \u00B7 Medication',
    pillLabel: 'Lifestyle habits',
    pillBg: Colors.tealBg,
    pillColor: Colors.tealText,
    source: 'Auto-generated by Ayu',
    date: '1 Mar',
    size: 'Auto-log',
    lifestyleGrid: [
      {label: 'Sleep avg', value: '5.9h', color: Colors.amberText, target: '7h', pct: 59, barColor: Colors.amber},
      {label: 'Steps avg', value: '8,240', color: Colors.tealText, target: '10k', pct: 82, barColor: Colors.teal},
      {label: 'Medication', value: '71%', color: Colors.redText, target: 'PM Metformin low', pct: 71, barColor: Colors.red},
      {label: 'Meals logged', value: '61%', color: Colors.amberText, target: '90%', pct: 61, barColor: Colors.amber},
    ],
    footerTags: [
      {label: 'Shared with Dr. Kavitha', bg: Colors.amberBg, color: Colors.amberText},
    ],
  },
  // February 2026
  {
    id: 5,
    type: 'rx',
    month: 'February 2026',
    iconName: 'document-text-outline',
    iconBg: Colors.purpleBg,
    title: 'Prescription \u00B7 Dr. Kavitha Reddy',
    sub: 'Metformin \u00B7 Amlodipine \u00B7 Atorvastatin \u00B7 Methylcobalamin',
    pillLabel: 'Prescription',
    pillBg: Colors.purpleBg,
    pillColor: Colors.purpleText,
    source: '4 drugs \u00B7 Valid 90 days',
    date: '15 Mar',
    size: 'PDF \u00B7 124 KB',
    valueChips: [
      {label: 'Metformin 500mg BD', bg: Colors.purpleBg, color: Colors.purpleText},
      {label: 'Amlodipine 5mg OD', bg: Colors.purpleBg, color: Colors.purpleText},
      {label: 'Methylcobalamin new', bg: Colors.tealBg, color: Colors.tealText},
    ],
    footerTags: [
      {label: 'Active till 13 Jun 2026', bg: Colors.tealBg, color: Colors.tealText},
    ],
  },
  {
    id: 6,
    type: 'vax',
    month: 'February 2026',
    iconName: 'shield-checkmark-outline',
    iconBg: '#EAF3DE',
    title: 'Influenza vaccine \u00B7 Annual',
    sub: 'Fluarix Tetra \u00B7 Intramuscular \u00B7 Left deltoid',
    pillLabel: 'Vaccination',
    pillBg: Colors.tealBg,
    pillColor: Colors.tealText,
    source: 'Kamineni Hospital',
    date: '10 Sep 25',
    size: 'Certificate',
    vaxProgress: {pct: 50, barColor: Colors.teal, nextDue: 'Sep 2026'},
    footerTags: [
      {label: 'Valid till Sep 2026', bg: Colors.tealBg, color: Colors.tealText},
    ],
  },
  // September 2025
  {
    id: 7,
    type: 'imaging',
    month: 'September 2025',
    iconName: 'scan-outline',
    iconBg: Colors.blueBg,
    title: 'Chest X-ray (PA view)',
    sub: 'Yashoda Hospitals \u00B7 Dr. Suresh Rao \u00B7 Cardiology',
    pillLabel: 'Imaging',
    pillBg: Colors.blueBg,
    pillColor: Colors.blueText,
    source: 'Digital \u00B7 DICOM',
    date: '18 Sep 25',
    size: 'DICOM \u00B7 4.2 MB',
    imagingThumb: true,
    footerTags: [
      {label: 'Cardiomegaly: absent \u00B7 Clear fields', bg: Colors.tealBg, color: Colors.tealText},
    ],
  },
  {
    id: 8,
    type: 'insurance',
    month: 'September 2025',
    iconName: 'shield-outline',
    iconBg: backgroundSecondary,
    title: 'Star Health \u00B7 Family Floater',
    sub: 'Policy #SH-FL-2024-HYD-38271 \u00B7 5 lakh cover',
    pillLabel: 'Insurance',
    pillBg: backgroundSecondary,
    pillColor: '#555',
    source: 'Renews 1 Apr 2026',
    date: 'Renews soon',
    size: '12 days',
    insuranceBand: {left: 'FY 2025\u201326 claimed', right: '\u20B914,200 / \u20B95,00,000'},
    footerTags: [
      {label: 'Renewal due 1 Apr 2026', bg: Colors.amberBg, color: Colors.amberText},
    ],
  },
];

const DAY_LETTERS = ['M', 'T', 'W', 'T', 'F', 'S', 'S', 'M', 'T', 'W', 'T', 'F', 'S', 'S'];

/* ─── Date group separator ─── */
const DateSeparator = ({label}) => (
  <View style={sty.sepRow}>
    <AppText variant="small" color={Colors.textTertiary} style={sty.sepText}>
      {label.toUpperCase()}
    </AppText>
    <View style={sty.sepLine} />
  </View>
);

/* ─── Progress bar helper ─── */
const ProgressBar = ({pct, color, height = ms(6)}) => (
  <View style={[sty.barTrack, {height}]}>
    <View style={[sty.barFill, {width: `${pct}%`, backgroundColor: color, height}]} />
  </View>
);

/* ─── Record Card ─── */
const RecordCard = ({rec}) => {
  const handlePress = () => {
    Alert.alert(rec.title, 'Record detail coming soon');
  };
  return (
  <TouchableOpacity activeOpacity={0.7} style={sty.card} onPress={handlePress}>
    {/* Top row */}
    <View style={sty.recTop}>
      <View style={[sty.recIcon, {backgroundColor: rec.iconBg}]}>
        <Icon family="Ionicons" name={rec.iconName} size={18} color={Colors.textPrimary} />
      </View>
      <View style={sty.recMain}>
        <AppText variant="bodyBold">{rec.title}</AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
          {rec.sub}
        </AppText>
        <View style={sty.metaRow}>
          <View style={[sty.pill, {backgroundColor: rec.pillBg}]}>
            <AppText variant="small" color={rec.pillColor}>{rec.pillLabel}</AppText>
          </View>
          <AppText variant="caption" color={Colors.textTertiary}>{rec.source}</AppText>
        </View>
      </View>
      <View style={sty.recRight}>
        <AppText variant="small" color={Colors.textTertiary}>{rec.date}</AppText>
        <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          {rec.size}
        </AppText>
      </View>
    </View>

    {/* Value chips (labs / rx) */}
    {rec.valueChips && (
      <View style={sty.chipsRow}>
        {rec.valueChips.map((c, i) => (
          <View key={i} style={[sty.chip, {backgroundColor: c.bg}]}>
            <AppText variant="small" color={c.color}>{c.label}</AppText>
          </View>
        ))}
      </View>
    )}

    {/* Symptom 14-day pattern */}
    {rec.symptomPattern && (
      <View style={sty.patternWrap}>
        <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(4)}}>
          14-day pattern
        </AppText>
        <View style={sty.patternRow}>
          {rec.symptomPattern.map((clr, i) => (
            <View key={i} style={[sty.patternSquare, {backgroundColor: clr}]}>
              <AppText variant="small" color={Colors.white} style={sty.patternLetter}>
                {DAY_LETTERS[i]}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    )}

    {/* Lifestyle 2x2 grid */}
    {rec.lifestyleGrid && (
      <View style={sty.gridWrap}>
        <View style={sty.gridRow}>
          {rec.lifestyleGrid.slice(0, 2).map((g, i) => (
            <View key={i} style={sty.gridCell}>
              <View style={sty.gridCellHeader}>
                <AppText variant="caption" color={Colors.textSecondary}>{g.label}</AppText>
                <AppText variant="bodyBold" color={g.color}>{g.value}</AppText>
              </View>
              <AppText variant="small" color={Colors.textTertiary} style={{marginBottom: vs(3)}}>
                {g.target}
              </AppText>
              <ProgressBar pct={g.pct} color={g.barColor} />
            </View>
          ))}
        </View>
        <View style={sty.gridRow}>
          {rec.lifestyleGrid.slice(2, 4).map((g, i) => (
            <View key={i} style={sty.gridCell}>
              <View style={sty.gridCellHeader}>
                <AppText variant="caption" color={Colors.textSecondary}>{g.label}</AppText>
                <AppText variant="bodyBold" color={g.color}>{g.value}</AppText>
              </View>
              <AppText variant="small" color={Colors.textTertiary} style={{marginBottom: vs(3)}}>
                {g.target}
              </AppText>
              <ProgressBar pct={g.pct} color={g.barColor} />
            </View>
          ))}
        </View>
      </View>
    )}

    {/* Vaccination progress */}
    {rec.vaxProgress && (
      <View style={sty.vaxRow}>
        <AppText variant="small" color={Colors.textSecondary} style={{marginRight: s(6)}}>
          Next due:
        </AppText>
        <View style={{flex: 1}}>
          <ProgressBar pct={rec.vaxProgress.pct} color={rec.vaxProgress.barColor} />
        </View>
        <AppText variant="small" color={Colors.textSecondary} style={{marginLeft: s(6)}}>
          {rec.vaxProgress.nextDue}
        </AppText>
      </View>
    )}

    {/* Imaging thumbnail */}
    {rec.imagingThumb && (
      <View style={sty.thumbWrap}>
        <View style={sty.thumbBox}>
          <Icon family="Ionicons" name="scan-outline" size={28} color={Colors.textTertiary} />
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(4)}}>
            Chest PA {'\u00B7'} 18 Sep 2025
          </AppText>
        </View>
      </View>
    )}

    {/* Insurance band */}
    {rec.insuranceBand && (
      <View style={sty.insuranceBand}>
        <AppText variant="small" color={Colors.textSecondary}>{rec.insuranceBand.left}</AppText>
        <AppText variant="bodyBold" color={Colors.primary}>{rec.insuranceBand.right}</AppText>
      </View>
    )}

    {/* Footer */}
    {rec.footerTags && rec.footerTags.length > 0 && (
      <View style={sty.recFooter}>
        <View style={sty.footerTags}>
          {rec.footerTags.map((t, i) => (
            <View key={i} style={[sty.chip, {backgroundColor: t.bg}]}>
              <AppText variant="small" color={t.color}>{t.label}</AppText>
            </View>
          ))}
        </View>
        <Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.textTertiary} />
      </View>
    )}
  </TouchableOpacity>
  );
};

/* ─── Lifestyle Sub-Tabs ─── */
const LIFESTYLE_TABS = [
  {key: 'summary', label: 'Summary', icon: 'grid-outline'},
  {key: 'food', label: 'Food', icon: 'restaurant-outline'},
  {key: 'sleep', label: 'Sleep', icon: 'moon-outline'},
  {key: 'medication', label: 'Medication', icon: 'medical-outline'},
  {key: 'activity', label: 'Activity', icon: 'walk-outline'},
];

const LifestyleSubTabs = () => {
  const [activeSubTab, setActiveSubTab] = useState('summary');

  const renderTab = () => {
    switch (activeSubTab) {
      case 'summary': return <LifestyleSummaryTab onTabChange={setActiveSubTab} />;
      case 'food': return <LifestyleFoodTab />;
      case 'sleep': return <LifestyleSleepTab />;
      case 'medication': return <LifestyleMedicationTab />;
      case 'activity': return <LifestyleActivityTab />;
      default: return <LifestyleSummaryTab onTabChange={setActiveSubTab} />;
    }
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={sty.lifestyleTabScroll}>
        {LIFESTYLE_TABS.map(tab => {
          const active = activeSubTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[sty.lifestyleTab, active && sty.lifestyleTabActive]}
              onPress={() => setActiveSubTab(tab.key)}
              activeOpacity={0.7}>
              <Icon
                family="Ionicons"
                name={tab.icon}
                size={14}
                color={active ? Colors.white : Colors.textSecondary}
              />
              <AppText
                variant="small"
                color={active ? Colors.white : Colors.textSecondary}
                style={active ? {fontWeight: '600'} : undefined}>
                {tab.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {renderTab()}
    </View>
  );
};

/* ─── Vaccination Sub-Tabs ─── */
const VAX_TABS = [
  {key: 'overview', label: 'Overview', icon: 'shield-checkmark-outline'},
  {key: 'admin', label: 'Administration', icon: 'clipboard-outline'},
  {key: 'how', label: 'How it works', icon: 'flask-outline'},
  {key: 'side', label: 'Side effects', icon: 'warning-outline'},
  {key: 'schedule', label: 'Schedule', icon: 'calendar-outline'},
  {key: 'cert', label: 'Certificate', icon: 'document-text-outline'},
];

const VaccinationSubTabs = () => {
  const [activeSubTab, setActiveSubTab] = useState('overview');

  const renderTab = () => {
    switch (activeSubTab) {
      case 'overview': return <VaxOverviewTab />;
      case 'admin': return <VaxAdministrationTab />;
      case 'how': return <VaxHowItWorksTab />;
      case 'side': return <VaxSideEffectsTab />;
      case 'schedule': return <VaxScheduleTab />;
      case 'cert': return <VaxCertificateTab />;
      default: return <VaxOverviewTab />;
    }
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={sty.lifestyleTabScroll}>
        {VAX_TABS.map(tab => {
          const active = activeSubTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[sty.lifestyleTab, active && sty.lifestyleTabActive]}
              onPress={() => setActiveSubTab(tab.key)}
              activeOpacity={0.7}>
              <Icon
                family="Ionicons"
                name={tab.icon}
                size={14}
                color={active ? Colors.white : Colors.textSecondary}
              />
              <AppText
                variant="small"
                color={active ? Colors.white : Colors.textSecondary}
                style={active ? {fontWeight: '600'} : undefined}>
                {tab.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {renderTab()}
    </View>
  );
};

/* ─── Insurance Sub-Tabs ─── */
const INS_TABS = [
  {key: 'overview', label: 'Overview', icon: 'shield-checkmark-outline'},
  {key: 'claims', label: 'Claims', icon: 'receipt-outline'},
  {key: 'analytics', label: 'Analytics', icon: 'analytics-outline'},
  {key: 'benefits', label: 'Benefits', icon: 'checkmark-done-outline'},
  {key: 'premium', label: 'Premium', icon: 'cash-outline'},
  {key: 'documents', label: 'Documents', icon: 'folder-outline'},
];

const InsuranceSubTabs = () => {
  const [activeSubTab, setActiveSubTab] = useState('overview');

  const renderTab = () => {
    switch (activeSubTab) {
      case 'overview': return <InsOverviewTab />;
      case 'claims': return <InsClaimsTab />;
      case 'analytics': return <InsAnalyticsTab />;
      case 'benefits': return <InsBenefitsTab />;
      case 'premium': return <InsPremiumTab />;
      case 'documents': return <InsDocumentsTab />;
      default: return <InsOverviewTab />;
    }
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={sty.lifestyleTabScroll}>
        {INS_TABS.map(tab => {
          const active = activeSubTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[sty.lifestyleTab, active && sty.lifestyleTabActive]}
              onPress={() => setActiveSubTab(tab.key)}
              activeOpacity={0.7}>
              <Icon
                family="Ionicons"
                name={tab.icon}
                size={14}
                color={active ? Colors.white : Colors.textSecondary}
              />
              <AppText
                variant="small"
                color={active ? Colors.white : Colors.textSecondary}
                style={active ? {fontWeight: '600'} : undefined}>
                {tab.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {renderTab()}
    </View>
  );
};

/* ─── Symptoms Sub-Tabs ─── */
const SYM_TABS = [
  {key: 'dayByDay', label: 'Day-by-day', icon: 'calendar-outline'},
  {key: 'correlations', label: 'Correlations', icon: 'git-compare-outline'},
  {key: 'triggers', label: 'Triggers', icon: 'flash-outline'},
  {key: 'patterns', label: 'Patterns', icon: 'bar-chart-outline'},
  {key: 'doctorNotes', label: 'Doctor notes', icon: 'medical-outline'},
  {key: 'vsLastMonth', label: 'vs Last month', icon: 'analytics-outline'},
];

const SymptomsSubTabs = () => {
  const [activeSubTab, setActiveSubTab] = useState('dayByDay');

  const renderTab = () => {
    switch (activeSubTab) {
      case 'dayByDay': return <SymDayByDayTab />;
      case 'correlations': return <SymCorrelationsTab />;
      case 'triggers': return <SymTriggersTab />;
      case 'patterns': return <SymPatternsTab />;
      case 'doctorNotes': return <SymDoctorNotesTab />;
      case 'vsLastMonth': return <SymVsLastMonthTab />;
      default: return <SymDayByDayTab />;
    }
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={sty.lifestyleTabScroll}>
        {SYM_TABS.map(tab => {
          const active = activeSubTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[sty.lifestyleTab, active && sty.lifestyleTabActive]}
              onPress={() => setActiveSubTab(tab.key)}
              activeOpacity={0.7}>
              <Icon
                family="Ionicons"
                name={tab.icon}
                size={14}
                color={active ? Colors.white : Colors.textSecondary}
              />
              <AppText
                variant="small"
                color={active ? Colors.white : Colors.textSecondary}
                style={active ? {fontWeight: '600'} : undefined}>
                {tab.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {renderTab()}
    </View>
  );
};

/* ─── Prescriptions Sub-Tabs ─── */
const RX_TABS = [
  {key: 'current', label: 'Current', icon: 'medical-outline'},
  {key: 'history', label: 'History', icon: 'time-outline'},
  {key: 'byDoctor', label: 'By doctor', icon: 'person-outline'},
  {key: 'interactions', label: 'Interactions', icon: 'git-compare-outline'},
];

const MET_TABS = [
  {key: 'details', label: 'Drug details', icon: 'information-circle-outline'},
  {key: 'adherence', label: 'Adherence', icon: 'bar-chart-outline'},
  {key: 'symptoms', label: 'Symptoms', icon: 'bandage-outline'},
  {key: 'visits', label: 'Visits', icon: 'medical-outline'},
  {key: 'history', label: 'History', icon: 'time-outline'},
];

const PrescriptionsSubTabs = () => {
  const [activeSubTab, setActiveSubTab] = useState('current');
  const [selectedDrug, setSelectedDrug] = useState(null);
  const [drugSubTab, setDrugSubTab] = useState('details');

  if (selectedDrug) {
    // Show drug detail sub-tabs (Metformin detail for now)
    const renderDrugTab = () => {
      switch (drugSubTab) {
        case 'details': return <MetDrugDetailsTab />;
        case 'adherence': return <MetAdherenceTab />;
        case 'symptoms': return <MetSymptomsTab />;
        case 'visits': return <MetVisitsTab />;
        case 'history': return <MetHistoryTab />;
        default: return <MetDrugDetailsTab />;
      }
    };

    return (
      <View>
        <TouchableOpacity
          style={sty.backRow}
          onPress={() => { setSelectedDrug(null); setDrugSubTab('details'); }}>
          <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.primary} />
          <AppText variant="caption" color={Colors.primary} style={{fontWeight: '500'}}>Back to Prescriptions</AppText>
        </TouchableOpacity>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={sty.lifestyleTabScroll}>
          {MET_TABS.map(tab => {
            const active = drugSubTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[sty.lifestyleTab, active && sty.lifestyleTabActive]}
                onPress={() => setDrugSubTab(tab.key)}
                activeOpacity={0.7}>
                <Icon family="Ionicons" name={tab.icon} size={14} color={active ? Colors.white : Colors.textSecondary} />
                <AppText variant="small" color={active ? Colors.white : Colors.textSecondary} style={active ? {fontWeight: '600'} : undefined}>
                  {tab.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {renderDrugTab()}
      </View>
    );
  }

  const renderTab = () => {
    switch (activeSubTab) {
      case 'current': return <RxCurrentTab onDrugPress={(drug) => { setSelectedDrug(drug); setDrugSubTab('details'); }} />;
      case 'history': return <RxHistoryTab />;
      case 'byDoctor': return <RxByDoctorTab />;
      case 'interactions': return <RxInteractionsTab />;
      default: return <RxCurrentTab onDrugPress={(drug) => { setSelectedDrug(drug); setDrugSubTab('details'); }} />;
    }
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={sty.lifestyleTabScroll}>
        {RX_TABS.map(tab => {
          const active = activeSubTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[sty.lifestyleTab, active && sty.lifestyleTabActive]}
              onPress={() => setActiveSubTab(tab.key)}
              activeOpacity={0.7}>
              <Icon family="Ionicons" name={tab.icon} size={14} color={active ? Colors.white : Colors.textSecondary} />
              <AppText variant="small" color={active ? Colors.white : Colors.textSecondary} style={active ? {fontWeight: '600'} : undefined}>
                {tab.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {renderTab()}
    </View>
  );
};

/* ─── Imaging Sub-Tabs ─── */
const IMG_LIST_TABS = [
  {key: 'all', label: 'All imaging', icon: 'scan-outline'},
  {key: 'facility', label: 'By facility', icon: 'business-outline'},
];

const IMG_DETAIL_TABS = {
  xray: [
    {key: 'summary', label: 'Summary', icon: 'reader-outline'},
    {key: 'findings', label: 'Findings', icon: 'list-outline'},
    {key: 'peer', label: 'Peer group', icon: 'people-outline'},
    {key: 'context', label: 'Clinical', icon: 'medical-outline'},
    {key: 'details', label: 'Details', icon: 'information-circle-outline'},
  ],
  echo: [
    {key: 'summary', label: 'Summary', icon: 'reader-outline'},
    {key: 'measurements', label: 'Measurements', icon: 'analytics-outline'},
    {key: 'peer', label: 'Peer group', icon: 'people-outline'},
    {key: 'context', label: 'Context', icon: 'medical-outline'},
  ],
  usg: [
    {key: 'summary', label: 'Summary', icon: 'reader-outline'},
    {key: 'findings', label: 'Findings', icon: 'list-outline'},
    {key: 'peer', label: 'Peer group', icon: 'people-outline'},
    {key: 'context', label: 'Context', icon: 'medical-outline'},
  ],
};

const renderImgDetailTab = (scan, tab) => {
  if (scan === 'xray') {
    switch (tab) {
      case 'summary': return <XraySummaryTab />;
      case 'findings': return <XrayFindingsTab />;
      case 'peer': return <XrayPeerGroupTab />;
      case 'context': return <XrayClinicalContextTab />;
      case 'details': return <XrayDetailsTab />;
    }
  } else if (scan === 'echo') {
    switch (tab) {
      case 'summary': return <EchoSummaryTab />;
      case 'measurements': return <EchoMeasurementsTab />;
      case 'peer': return <EchoPeerGroupTab />;
      case 'context': return <EchoContextTab />;
    }
  } else if (scan === 'usg') {
    switch (tab) {
      case 'summary': return <UsgSummaryTab />;
      case 'findings': return <UsgFindingsTab />;
      case 'peer': return <UsgPeerGroupTab />;
      case 'context': return <UsgContextTab />;
    }
  }
  return null;
};

const ImagingSubTabs = () => {
  const [listTab, setListTab] = useState('all');
  const [selectedScan, setSelectedScan] = useState(null);
  const [detailTab, setDetailTab] = useState('summary');

  if (selectedScan) {
    const tabs = IMG_DETAIL_TABS[selectedScan] || [];
    const scanNames = {xray: 'Chest X-ray', echo: 'Echocardiogram', usg: 'USG Abdomen'};
    return (
      <View>
        <TouchableOpacity
          style={sty.backRow}
          onPress={() => { setSelectedScan(null); setDetailTab('summary'); }}>
          <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.primary} />
          <AppText variant="caption" color={Colors.primary} style={{fontWeight: '500'}}>
            Back to Imaging
          </AppText>
        </TouchableOpacity>
        <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>{scanNames[selectedScan]}</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={sty.lifestyleTabScroll}>
          {tabs.map(tab => {
            const active = detailTab === tab.key;
            return (
              <TouchableOpacity key={tab.key} style={[sty.lifestyleTab, active && sty.lifestyleTabActive]} onPress={() => setDetailTab(tab.key)} activeOpacity={0.7}>
                <Icon family="Ionicons" name={tab.icon} size={14} color={active ? Colors.white : Colors.textSecondary} />
                <AppText variant="small" color={active ? Colors.white : Colors.textSecondary} style={active ? {fontWeight: '600'} : undefined}>{tab.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {renderImgDetailTab(selectedScan, detailTab)}
      </View>
    );
  }

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={sty.lifestyleTabScroll}>
        {IMG_LIST_TABS.map(tab => {
          const active = listTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={[sty.lifestyleTab, active && sty.lifestyleTabActive]} onPress={() => setListTab(tab.key)} activeOpacity={0.7}>
              <Icon family="Ionicons" name={tab.icon} size={14} color={active ? Colors.white : Colors.textSecondary} />
              <AppText variant="small" color={active ? Colors.white : Colors.textSecondary} style={active ? {fontWeight: '600'} : undefined}>{tab.label}</AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {listTab === 'all' ? (
        <ImgAllTab onImagePress={(key) => { setSelectedScan(key); setDetailTab('summary'); }} />
      ) : (
        <ImgByFacilityTab onImagePress={(key) => { setSelectedScan(key); setDetailTab('summary'); }} />
      )}
    </View>
  );
};

/* ─── Lab Reports Sub-Tabs ─── */
const LAB_LIST_TABS = [
  {key: 'all', label: 'All reports', icon: 'flask-outline'},
  {key: 'byLab', label: 'By lab', icon: 'business-outline'},
  {key: 'biomarkers', label: 'Biomarkers', icon: 'analytics-outline'},
];

const LabReportsSubTabs = () => {
  const [listTab, setListTab] = useState('all');
  const [selectedReport, setSelectedReport] = useState(null);
  const [reportView, setReportView] = useState('smart');
  const [selectedBiomarker, setSelectedBiomarker] = useState(null);

  // Level 3: Biomarker detail
  if (selectedBiomarker) {
    return (
      <View>
        <TouchableOpacity
          style={sty.backRow}
          onPress={() => setSelectedBiomarker(null)}>
          <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.primary} />
          <AppText variant="caption" color={Colors.primary} style={{fontWeight: '500'}}>Back to Biomarkers</AppText>
        </TouchableOpacity>
        <LabBiomarkerDetailView biomarker={selectedBiomarker} />
      </View>
    );
  }

  // Level 2: Report detail (smart/traditional toggle)
  if (selectedReport) {
    return (
      <View>
        <TouchableOpacity
          style={sty.backRow}
          onPress={() => { setSelectedReport(null); setReportView('smart'); }}>
          <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.primary} />
          <AppText variant="caption" color={Colors.primary} style={{fontWeight: '500'}}>Back to Lab Reports</AppText>
        </TouchableOpacity>
        <View style={sty.toggleRow}>
          <TouchableOpacity
            style={[sty.lifestyleTab, reportView === 'smart' && sty.lifestyleTabActive]}
            onPress={() => setReportView('smart')}>
            <Icon family="Ionicons" name="sparkles-outline" size={14} color={reportView === 'smart' ? Colors.white : Colors.textSecondary} />
            <AppText variant="small" color={reportView === 'smart' ? Colors.white : Colors.textSecondary} style={reportView === 'smart' ? {fontWeight: '600'} : undefined}>Smart report</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[sty.lifestyleTab, reportView === 'traditional' && sty.lifestyleTabActive]}
            onPress={() => setReportView('traditional')}>
            <Icon family="Ionicons" name="document-text-outline" size={14} color={reportView === 'traditional' ? Colors.white : Colors.textSecondary} />
            <AppText variant="small" color={reportView === 'traditional' ? Colors.white : Colors.textSecondary} style={reportView === 'traditional' ? {fontWeight: '600'} : undefined}>Traditional</AppText>
          </TouchableOpacity>
        </View>
        {reportView === 'smart' ? (
          <LabReportSmartView onValuePress={(key) => { setSelectedReport(null); setSelectedBiomarker(key); }} />
        ) : (
          <LabReportTraditionalView />
        )}
      </View>
    );
  }

  // Level 1: List tabs
  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={sty.lifestyleTabScroll}>
        {LAB_LIST_TABS.map(tab => {
          const active = listTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={[sty.lifestyleTab, active && sty.lifestyleTabActive]} onPress={() => setListTab(tab.key)} activeOpacity={0.7}>
              <Icon family="Ionicons" name={tab.icon} size={14} color={active ? Colors.white : Colors.textSecondary} />
              <AppText variant="small" color={active ? Colors.white : Colors.textSecondary} style={active ? {fontWeight: '600'} : undefined}>{tab.label}</AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {listTab === 'all' && <LabAllReportsTab onReportPress={(key) => { setSelectedReport(key); setReportView('smart'); }} />}
      {listTab === 'byLab' && <LabByLabTab onReportPress={(key) => { setSelectedReport(key); setReportView('smart'); }} />}
      {listTab === 'biomarkers' && <LabBiomarkersTab onBiomarkerPress={(key) => setSelectedBiomarker(key)} />}
    </View>
  );
};

/* ─── Doctor Notes Sub-Tabs ─── */
const NOTES_LIST_TABS = [
  {key: 'chronological', label: 'Chronological', icon: 'time-outline'},
  {key: 'byDoctor', label: 'By doctor', icon: 'person-outline'},
];

const VISIT_DETAIL_TABS = [
  {key: 'summary', label: 'Summary', icon: 'reader-outline'},
  {key: 'vitals', label: 'Vitals', icon: 'heart-outline'},
  {key: 'findings', label: 'Findings', icon: 'search-outline'},
  {key: 'prescription', label: 'Prescription', icon: 'medical-outline'},
  {key: 'investigations', label: 'Investigations', icon: 'flask-outline'},
  {key: 'followUp', label: 'Follow-up', icon: 'calendar-outline'},
];

const DoctorNotesSubTabs = () => {
  const [listTab, setListTab] = useState('chronological');
  const [selectedVisit, setSelectedVisit] = useState(null);
  const [detailTab, setDetailTab] = useState('summary');

  if (selectedVisit) {
    const visitNames = {
      mar2026: 'Mar 2026 · Dr. Kavitha Reddy',
      jan2026: 'Jan 2026 · Dr. Kavitha Reddy',
      sep2025: 'Sep 2025 · Dr. Kavitha Reddy',
      aug2025: 'Aug 2025 · Dr. Suresh Rao',
      mar2025: 'Mar 2025 · Dr. Kavitha Reddy',
      jun2022: 'Jun 2022 · Dr. Kavitha Reddy',
      mar2021: 'Mar 2021 · Dr. Kavitha Reddy',
      sep2019: 'Sep 2019 · Dr. Kavitha Reddy',
    };

    const renderVisitTab = () => {
      switch (detailTab) {
        case 'summary': return <VisitSummaryTab visit={selectedVisit} />;
        case 'vitals': return <VisitVitalsTab visit={selectedVisit} />;
        case 'findings': return <VisitFindingsTab visit={selectedVisit} />;
        case 'prescription': return <VisitPrescriptionTab visit={selectedVisit} />;
        case 'investigations': return <VisitInvestigationsTab visit={selectedVisit} />;
        case 'followUp': return <VisitFollowUpTab visit={selectedVisit} />;
        default: return <VisitSummaryTab visit={selectedVisit} />;
      }
    };

    return (
      <View>
        <TouchableOpacity
          style={sty.backRow}
          onPress={() => { setSelectedVisit(null); setDetailTab('summary'); }}>
          <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.primary} />
          <AppText variant="caption" color={Colors.primary} style={{fontWeight: '500'}}>Back to Doctor Notes</AppText>
        </TouchableOpacity>
        <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>{visitNames[selectedVisit] || selectedVisit}</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={sty.lifestyleTabScroll}>
          {VISIT_DETAIL_TABS.map(tab => {
            const active = detailTab === tab.key;
            return (
              <TouchableOpacity key={tab.key} style={[sty.lifestyleTab, active && sty.lifestyleTabActive]} onPress={() => setDetailTab(tab.key)} activeOpacity={0.7}>
                <Icon family="Ionicons" name={tab.icon} size={14} color={active ? Colors.white : Colors.textSecondary} />
                <AppText variant="small" color={active ? Colors.white : Colors.textSecondary} style={active ? {fontWeight: '600'} : undefined}>{tab.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
        {renderVisitTab()}
      </View>
    );
  }

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={sty.lifestyleTabScroll}>
        {NOTES_LIST_TABS.map(tab => {
          const active = listTab === tab.key;
          return (
            <TouchableOpacity key={tab.key} style={[sty.lifestyleTab, active && sty.lifestyleTabActive]} onPress={() => setListTab(tab.key)} activeOpacity={0.7}>
              <Icon family="Ionicons" name={tab.icon} size={14} color={active ? Colors.white : Colors.textSecondary} />
              <AppText variant="small" color={active ? Colors.white : Colors.textSecondary} style={active ? {fontWeight: '600'} : undefined}>{tab.label}</AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {listTab === 'chronological' ? (
        <NotesChronologicalTab onVisitPress={(key) => { setSelectedVisit(key); setDetailTab('summary'); }} />
      ) : (
        <NotesByDoctorTab onVisitPress={(key) => { setSelectedVisit(key); setDetailTab('summary'); }} />
      )}
    </View>
  );
};

/* ─── Other Logs Sub-Tabs ─── */
const OTHER_LOGS_TABS = [
  {key: 'bmi', label: 'BMI', icon: 'scale-outline'},
  {key: 'growth', label: 'Growth', icon: 'trending-up-outline'},
  {key: 'addLog', label: '+ Add log', icon: 'add-circle-outline'},
];

const OtherLogsSubTabs = () => {
  const [activeSubTab, setActiveSubTab] = useState('bmi');

  const renderTab = () => {
    switch (activeSubTab) {
      case 'bmi': return <BmiTrackerTab />;
      case 'growth': return <GrowthTrackerTab />;
      case 'addLog': return <AddLogTab />;
      default: return <BmiTrackerTab />;
    }
  };

  return (
    <View>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={sty.lifestyleTabScroll}>
        {OTHER_LOGS_TABS.map(tab => {
          const active = activeSubTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[sty.lifestyleTab, active && sty.lifestyleTabActive]}
              onPress={() => setActiveSubTab(tab.key)}
              activeOpacity={0.7}>
              <Icon
                family="Ionicons"
                name={tab.icon}
                size={14}
                color={active ? Colors.white : Colors.textSecondary}
              />
              <AppText
                variant="small"
                color={active ? Colors.white : Colors.textSecondary}
                style={active ? {fontWeight: '600'} : undefined}>
                {tab.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
      {renderTab()}
    </View>
  );
};

/* ─── Main component ─── */
const IndividualRecordsTab = ({activeFilter = 'all'}) => {
  const filtered =
    activeFilter === 'all'
      ? RECORDS
      : RECORDS.filter(r => r.type === activeFilter);

  // Group by month
  const grouped = [];
  let lastMonth = '';
  filtered.forEach(r => {
    if (r.month !== lastMonth) {
      lastMonth = r.month;
      grouped.push({separator: r.month});
    }
    grouped.push(r);
  });

  // If lifestyle filter is active, show sub-tabs instead of record cards
  if (activeFilter === 'lifestyle') {
    return (
      <View style={sty.container}>
        <LifestyleSubTabs />
      </View>
    );
  }

  // If vaccination filter is active, show vaccination sub-tabs
  if (activeFilter === 'vax') {
    return (
      <View style={sty.container}>
        <VaccinationSubTabs />
      </View>
    );
  }

  // If prescriptions filter is active, show prescriptions sub-tabs
  // If imaging filter is active, show imaging sub-tabs
  // If labs filter is active, show lab reports sub-tabs
  if (activeFilter === 'labs') {
    return (
      <View style={sty.container}>
        <LabReportsSubTabs />
      </View>
    );
  }

  if (activeFilter === 'imaging') {
    return (
      <View style={sty.container}>
        <ImagingSubTabs />
      </View>
    );
  }

  if (activeFilter === 'rx') {
    return (
      <View style={sty.container}>
        <PrescriptionsSubTabs />
      </View>
    );
  }

  // If symptoms filter is active, show symptoms sub-tabs
  if (activeFilter === 'symptoms') {
    return (
      <View style={sty.container}>
        <SymptomsSubTabs />
      </View>
    );
  }

  // If insurance filter is active, show insurance sub-tabs
  if (activeFilter === 'insurance') {
    return (
      <View style={sty.container}>
        <InsuranceSubTabs />
      </View>
    );
  }

  // If doctor notes filter is active, show doctor notes sub-tabs
  if (activeFilter === 'notes') {
    return (
      <View style={sty.container}>
        <DoctorNotesSubTabs />
      </View>
    );
  }

  // If other logs filter is active, show other logs sub-tabs
  if (activeFilter === 'otherLogs') {
    return (
      <View style={sty.container}>
        <OtherLogsSubTabs />
      </View>
    );
  }

  return (
    <View style={sty.container}>
      {/* Search row */}
      <View style={sty.searchRow}>
        <View style={sty.searchInput}>
          <Icon family="Ionicons" name="search-outline" size={16} color={Colors.textTertiary} />
          <TextInput
            style={sty.searchField}
            placeholder="Search records, doctors, tests..."
            placeholderTextColor={Colors.textTertiary}
          />
        </View>
        <TouchableOpacity style={sty.searchBtn} activeOpacity={0.7}>
          <Icon family="Ionicons" name="swap-vertical-outline" size={18} color={Colors.textSecondary} />
        </TouchableOpacity>
        <TouchableOpacity style={sty.searchBtn} activeOpacity={0.7}>
          <AppText variant="small" color={Colors.textSecondary} style={{fontWeight: '500'}}>Filter</AppText>
          <Icon family="Ionicons" name="chevron-down" size={14} color={Colors.textSecondary} />
        </TouchableOpacity>
      </View>

      {/* Records list */}
      {filtered.length === 0 ? (
        <View style={sty.emptyState}>
          <Icon family="Ionicons" name="document-outline" size={36} color={Colors.textTertiary} />
          <AppText variant="body" color={Colors.textTertiary} style={{marginTop: vs(8)}}>
            No records found
          </AppText>
        </View>
      ) : (
        grouped.map((item, idx) =>
          item.separator ? (
            <DateSeparator key={`sep-${item.separator}`} label={item.separator} />
          ) : (
            <RecordCard key={item.id || idx} rec={item} />
          ),
        )
      )}
    </View>
  );
};

/* ─── Styles ─── */
const sty = StyleSheet.create({
  container: {
    paddingBottom: vs(20),
  },

  /* Lifestyle sub-tabs */
  lifestyleTabScroll: {
    paddingHorizontal: s(4),
    paddingBottom: vs(12),
    gap: s(8),
  },
  lifestyleTab: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
    borderRadius: ms(20),
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary,
  },
  lifestyleTabActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  backRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    paddingBottom: vs(10),
  },
  toggleRow: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(12),
  },

  /* Filter ribbon */
  filterScroll: {
    paddingHorizontal: s(4),
    paddingBottom: vs(12),
    gap: s(12),
  },
  filterItem: {
    alignItems: 'center',
    width: ms(60),
  },
  filterIconWrap: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterLabel: {
    marginTop: vs(4),
    textAlign: 'center',
  },
  countBadge: {
    marginTop: vs(2),
    paddingHorizontal: s(6),
    paddingVertical: vs(1),
    borderRadius: ms(10),
    backgroundColor: backgroundSecondary,
  },
  countBadgeActive: {
    backgroundColor: Colors.primary,
  },

  /* Search row */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginBottom: vs(12),
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    paddingHorizontal: s(10),
    height: vs(36),
    gap: s(6),
  },
  searchField: {
    flex: 1,
    fontSize: ms(13),
    color: Colors.textPrimary,
    padding: 0,
  },
  searchBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Date separator */
  sepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10),
    marginBottom: vs(8),
  },
  sepText: {
    marginRight: s(8),
    fontWeight: '600',
  },
  sepLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: borderTertiary,
  },

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    marginBottom: vs(10),
    overflow: 'hidden',
  },

  /* Record top */
  recTop: {
    flexDirection: 'row',
    padding: s(12),
    gap: s(10),
  },
  recIcon: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(11),
    alignItems: 'center',
    justifyContent: 'center',
  },
  recMain: {
    flex: 1,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    marginTop: vs(4),
    flexWrap: 'wrap',
  },
  pill: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
  recRight: {
    alignItems: 'flex-end',
  },

  /* Chips */
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    paddingHorizontal: s(12),
    paddingBottom: vs(8),
  },
  chip: {
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
  },

  /* Symptom pattern */
  patternWrap: {
    paddingHorizontal: s(12),
    paddingBottom: vs(8),
  },
  patternRow: {
    flexDirection: 'row',
    gap: 3,
  },
  patternSquare: {
    width: ms(14),
    height: ms(14),
    borderRadius: ms(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  patternLetter: {
    fontSize: ms(7),
    lineHeight: ms(10),
    fontWeight: '600',
  },

  /* Lifestyle grid */
  gridWrap: {
    paddingHorizontal: s(12),
    paddingBottom: vs(8),
    gap: vs(8),
  },
  gridRow: {
    flexDirection: 'row',
    gap: s(8),
  },
  gridCell: {
    flex: 1,
    backgroundColor: backgroundSecondary,
    borderRadius: ms(10),
    padding: s(10),
  },
  gridCellHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(2),
  },

  /* Progress bar */
  barTrack: {
    backgroundColor: '#E5E7EB',
    borderRadius: ms(4),
    overflow: 'hidden',
  },
  barFill: {
    borderRadius: ms(4),
  },

  /* Vaccination progress */
  vaxRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(12),
    paddingBottom: vs(8),
  },

  /* Imaging thumbnail */
  thumbWrap: {
    paddingHorizontal: s(12),
    paddingBottom: vs(8),
  },
  thumbBox: {
    backgroundColor: '#1a1a2e',
    borderRadius: ms(10),
    height: vs(80),
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Insurance band */
  insuranceBand: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: backgroundSecondary,
    marginHorizontal: s(12),
    marginBottom: vs(8),
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(8),
  },

  /* Footer */
  recFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 0.5,
    borderTopColor: borderTertiary,
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
  },
  footerTags: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    flex: 1,
  },

  /* Empty state */
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(40),
  },
});

export default IndividualRecordsTab;
