import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../../constants/colors';
import AppText from '../../../../components/shared/AppText';
import Icon from '../../../../components/shared/Icons';

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const TABS = [
  {key: 'visits', label: 'Visits'},
  {key: 'scans', label: 'Scans'},
  {key: 'labs', label: 'Lab tests'},
  {key: 'ayu', label: 'Ayu'},
];

const SUMMARY_CELLS = [
  {value: '3', label: 'Visits done', bg: Colors.pinkBg, color: '#A32D5A'},
  {value: '1', label: 'Upcoming', bg: Colors.amberBg, color: Colors.amberDark},
  {value: '~8', label: 'Remaining', bg: Colors.tealBg, color: Colors.primary},
];

const VISIT_DONE_STATS = [
  {value: '118/72', label: 'BP (mmHg)'},
  {value: '58.4', label: 'Weight (kg)'},
  {value: '152', label: 'FHR (bpm)'},
];

const SCHEDULE_ROWS = [
  {timing: 'W6-8', mark: '\u2713', markColor: Colors.tealText, focus: 'Booking visit', tests: 'Viability scan, blood panel, TT1'},
  {timing: 'W11-14', mark: '\u2713', markColor: Colors.tealText, focus: 'NT scan', tests: 'Combined screening, blood group'},
  {timing: 'W18', mark: '\u2192', markColor: Colors.amberDark, focus: 'Anomaly scan', tests: 'TIFFA, TT2, quadruple screen'},
  {timing: 'W24', mark: '', markColor: Colors.textTertiary, focus: 'GDM screen', tests: 'OGTT 75g, Hb recheck'},
  {timing: 'W28', mark: '', markColor: Colors.textTertiary, focus: '3rd trimester start', tests: 'Growth scan, Anti-D if Rh-'},
  {timing: 'W32-36', mark: '', markColor: Colors.textTertiary, focus: 'Fortnightly visits', tests: 'Growth scan, GBS swab W36'},
  {timing: 'W37-40', mark: '', markColor: Colors.textTertiary, focus: 'Weekly visits', tests: 'CTG if indicated, kick counts'},
];

const NT_STATS = [
  {value: '1.4 mm', label: 'NT thickness', sub: 'Normal (<3.5mm) \u2713'},
  {value: '62 mm', label: 'Crown-rump length', sub: '13w 0d \u2713'},
  {value: '168 bpm', label: 'Foetal heart rate', sub: 'Normal \u2713'},
  {value: '1 : 4800', label: 'T21 risk', sub: 'Low risk \u2713'},
];

const ANOMALY_CHECKS = [
  {icon: 'pulse-outline', name: 'Brain & head', sub: 'Ventricles, cerebellum, cisterna magna, corpus callosum'},
  {icon: 'heart-outline', name: 'Heart', sub: '4 chambers, outflow tracts, great vessels - CHD screening'},
  {icon: 'body-outline', name: 'Spine', sub: 'Open or closed spine - spina bifida - neural tube'},
  {icon: 'water-outline', name: 'Kidneys & bladder', sub: 'Renal pelvis dilation - bladder fills and empties'},
  {icon: 'ellipse-outline', name: 'Placenta & cord', sub: 'Placenta previa check - 3 vessels in cord - AFI'},
];

const BOOKING_TESTS = [
  {icon: 'water-outline', name: 'Haemoglobin', detail: 'Anaemia screening - IFA started', value: '11.8 g/dL', status: 'Mild anaemia', tone: 'amber'},
  {icon: 'pricetag-outline', name: 'Blood group', detail: 'ABO + Rhesus', value: 'B Rh+', status: 'Positive \u2713', tone: 'green'},
  {icon: 'shield-outline', name: 'HIV (VCTC)', detail: 'Mandatory PPTCT screening', value: 'Negative', status: 'Safe \u2713', tone: 'green'},
  {icon: 'shield-outline', name: 'HBsAg (Hepatitis B)', detail: 'Vertical transmission risk', value: 'Negative', status: 'Safe \u2713', tone: 'green'},
  {icon: 'shield-outline', name: 'VDRL (Syphilis)', detail: 'Mandatory screening', value: 'Non-reactive', status: 'Safe \u2713', tone: 'green'},
  {icon: 'shield-checkmark-outline', name: 'Rubella IgG', detail: 'Immunity status', value: 'Immune', status: 'Protected \u2713', tone: 'green'},
  {icon: 'analytics-outline', name: 'Fasting blood sugar', detail: 'Baseline glucose', value: '84 mg/dL', status: 'Normal \u2713', tone: 'green'},
];

const W15_TESTS = [
  {icon: 'water-outline', name: 'Haemoglobin', detail: 'Response to IFA therapy', value: '12.4 g/dL', status: 'Improving \u2191', tone: 'amber'},
  {icon: 'flask-outline', name: 'Urine R/E', detail: 'Protein, glucose, casts, infection', value: 'Normal', status: 'Clear \u2713', tone: 'green'},
  {icon: 'analytics-outline', name: 'Quadruple screen', detail: 'AFP, hCG, uE3, Inhibin A', value: 'Low risk', status: '1:8200 \u2713', tone: 'green'},
  {icon: 'pulse-outline', name: 'Thyroid (TSH)', detail: 'Hypothyroidism common in India', value: '2.1 mIU/L', status: 'Normal \u2713', tone: 'green'},
];

const UPCOMING_TESTS = [
  {icon: 'time-outline', name: 'OGTT 75g', detail: 'GDM screening - Week 24 - fasting required', value: 'W24', status: 'Pending', tone: 'amber'},
  {icon: 'time-outline', name: 'GBS swab', detail: 'Group B Strep - Week 36', value: 'W36', status: 'Upcoming', tone: 'gray'},
  {icon: 'time-outline', name: 'Hb recheck', detail: 'Target \u226511g/dL by 28 weeks', value: 'W28', status: 'Upcoming', tone: 'gray'},
];

const KPI_CELLS = [
  {value: '\u2191 12.4', unit: 'g/dL', label: 'Hb trend', tone: 'amber'},
  {value: 'Low', unit: '', label: 'Risk screen', tone: 'green'},
  {value: 'OGTT', unit: 'Week 24', label: 'Next test', tone: 'white'},
];

const ANAEMIA_INSIGHTS = [
  {tone: 'amber', title: 'Haemoglobin of 12.4 g/dL is improving', body: ' but the target for 16 weeks is \u226511g/dL (minimum) to \u226512g/dL (optimal). Anaemia in pregnancy increases risk of preterm birth, low birth weight, postpartum haemorrhage, and maternal mortality. Continue IFA daily without missing doses.'},
  {tone: 'amber', title: 'Iron absorption is being blocked.', body: ' Tea and coffee tannins reduce iron absorption by 40-60% when consumed within 1-2 hours of IFA tablets. Calcium supplements (often prescribed alongside IFA) also compete for absorption. Take IFA alone, with a glass of lemon water, in the morning.'},
  {tone: 'green', title: 'Target Hb \u226513g/dL by Week 28.', body: ' This creates a buffer for the blood volume expansion of late pregnancy and the blood loss at delivery (average 300-500ml vaginal, 700-1000ml Caesarean). A well-stocked iron reserve going into labour significantly reduces postpartum anaemia risk.'},
  {tone: 'blue', title: 'OGTT at Week 24 is particularly important', body: ' given baseline fasting sugar of 84 mg/dL. While normal, this is at the higher end of fasting values. Family history of diabetes or high pre-pregnancy BMI raises GDM risk. If OGTT shows GDM, dietary management + monitoring reduces all major adverse outcomes by 30-40%.'},
];

const SUPP_INSIGHTS = [
  {tone: 'green', title: 'Folic acid 5mg daily', body: ' - continue until Week 12 minimum. After Week 12, 400mcg is sufficient but higher dose is not harmful. Critical for neural tube formation (already complete by Week 6 - if started from booking, it is for foetal red blood cell production now).'},
  {tone: 'green', title: 'IFA (Iron-Folic Acid) tablet daily', body: ' under Anaemia Mukt Bharat programme - available free from ASHA/subcentre. Doses of elemental iron 100mg + folic acid 0.5mg.'},
  {tone: 'amber', title: 'Calcium 500mg twice daily', body: ' - important for foetal bone mineralisation and to reduce risk of pre-eclampsia (high-quality evidence). Take separately from IFA to avoid absorption competition. Dairy + ragi + sesame are dietary sources.'},
  {tone: 'blue', title: 'Vitamin D 2000 IU daily', body: ' - most Indian women are deficient. Vit D deficiency in pregnancy is linked to GDM, pre-eclampsia, foetal skeletal issues, and neonatal hypocalcaemia. Get 15 minutes of morning sun exposure daily in addition to supplementation.'},
];

const TONE_MAP = {
  amber: {bg: Colors.amberBg, border: '#FDDCB5', text: Colors.amberDark, icon: Colors.amberDark},
  green: {bg: Colors.tealBg, border: Colors.paleGreen, text: Colors.tealText, icon: Colors.tealText},
  blue: {bg: Colors.blueBg, border: '#BFDCF5', text: Colors.blueText, icon: Colors.blueText},
  gray: {bg: '#F1F1F1', border: '#E5E5E5', text: Colors.textSecondary, icon: Colors.textSecondary},
};

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const Section = ({title}) => (
  <View style={st.sec}>
    <AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{title}</AppText>
    <View style={st.secLine} />
  </View>
);

const TestRow = ({row, last}) => {
  const tone = TONE_MAP[row.tone] || TONE_MAP.gray;
  return (
    <TouchableOpacity activeOpacity={0.7} onPress={() => {}} style={[st.testRow, last && {borderBottomWidth: 0}]}>
      <View style={[st.testIconWrap, {backgroundColor: tone.bg}]}>
        <Icon family="Ionicons" name={row.icon} size={ms(15)} color={tone.icon} />
      </View>
      <View style={{flex: 1}}>
        <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(12)}}>{row.name}</AppText>
        <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(1)}}>{row.detail}</AppText>
      </View>
      <View style={{alignItems: 'flex-end'}}>
        <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(12)}}>{row.value}</AppText>
        <View style={[st.statusBadge, {backgroundColor: tone.bg}]}>
          <AppText variant="subtext" color={tone.text} style={{fontWeight: '700', fontSize: ms(8)}}>{row.status}</AppText>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const InsightRow = ({item}) => {
  const tone = TONE_MAP[item.tone];
  return (
    <View style={[st.insight, {backgroundColor: tone.bg, borderColor: tone.border}]}>
      <AppText variant="caption" color={tone.text} style={{flex: 1, lineHeight: ms(17)}}>
        <AppText style={{fontWeight: '700'}}>{item.title}</AppText>{item.body}
      </AppText>
    </View>
  );
};

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const AntenatalScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('visits');

  // ── Visits tab ──
  const renderVisits = () => (
    <>
      <View style={st.summaryRow}>
        {SUMMARY_CELLS.map((cell, i) => (
          <View key={i} style={[st.summaryCell, {backgroundColor: cell.bg}]}>
            <AppText variant="bodyBold" color={cell.color} style={{fontSize: ms(18)}}>{cell.value}</AppText>
            <AppText variant="subtext" color={cell.color} style={{fontSize: ms(9), marginTop: vs(2)}}>{cell.label}</AppText>
          </View>
        ))}
      </View>

      {/* Visit card 1 - Done */}
      <TouchableOpacity activeOpacity={0.7} onPress={() => {}} style={st.card}>
        <View style={st.visitHead}>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(13)}}>Week 15 visit - 28 Mar 2025</AppText>
            <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(2)}}>Dr. Suma Rao - Apollo Hospital, Jubilee Hills</AppText>
          </View>
          <View style={[st.statusBadge, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="subtext" color={Colors.tealText} style={{fontWeight: '700', fontSize: ms(8)}}>Done</AppText>
          </View>
        </View>
        <View style={st.statGrid}>
          {VISIT_DONE_STATS.map((stat, i) => (
            <View key={i} style={st.statBox}>
              <AppText variant="bodyBold" color={Colors.primary} style={{fontSize: ms(14)}}>{stat.value}</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(8.5), marginTop: vs(2), textAlign: 'center'}}>{stat.label}</AppText>
            </View>
          ))}
        </View>
        <View style={st.noteBox}>
          <AppText variant="subtext" color={Colors.textSecondary} style={{lineHeight: ms(15)}}>
            Fundal height 16cm (= weeks). Urine protein: negative. Oedema: none. Uterus: at umbilicus. Doctor notes: Iron stores improving. Continue IFA. Next: anomaly scan at W18.
          </AppText>
        </View>
      </TouchableOpacity>

      {/* Visit card 2 - Upcoming amber border */}
      <TouchableOpacity activeOpacity={0.7} onPress={() => {}} style={[st.card, {borderColor: Colors.amber, borderWidth: 1.5}]}>
        <View style={st.visitHead}>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(13)}}>Week 18 visit - Apr 18, 2025</AppText>
            <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(2)}}>Dr. Suma Rao + Anomaly scan - Apollo</AppText>
          </View>
          <View style={[st.statusBadge, {backgroundColor: Colors.amberBg}]}>
            <AppText variant="subtext" color={Colors.amberDark} style={{fontWeight: '700', fontSize: ms(8)}}>In 13 days</AppText>
          </View>
        </View>
        <View style={st.noteBox}>
          <AppText variant="subtext" color={Colors.textSecondary} style={{lineHeight: ms(15)}}>
            TIFFA scan + TT2 vaccination + mid-pregnancy blood panel. Fasting required for glucose check. Arrive 30 minutes early. Bring previous scan reports. Companion allowed.
          </AppText>
        </View>
      </TouchableOpacity>

      <Section title="Recommended antenatal visit schedule" />
      <View style={st.card}>
        <View style={st.tableHeader}>
          <AppText variant="subtext" color={Colors.textSecondary} style={[st.thTiming, {fontWeight: '700'}]}>Timing</AppText>
          <AppText variant="subtext" color={Colors.textSecondary} style={[st.thFocus, {fontWeight: '700'}]}>Visit focus</AppText>
          <AppText variant="subtext" color={Colors.textSecondary} style={[st.thTests, {fontWeight: '700'}]}>Tests/Scans</AppText>
        </View>
        {SCHEDULE_ROWS.map((row, i) => (
          <TouchableOpacity key={i} activeOpacity={0.7} onPress={() => {}} style={[st.tableRow, i === SCHEDULE_ROWS.length - 1 && {borderBottomWidth: 0}]}>
            <View style={st.thTiming}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>
                {row.timing}{row.mark ? ' ' : ''}
                <AppText style={{color: row.markColor, fontWeight: '700'}}>{row.mark}</AppText>
              </AppText>
            </View>
            <AppText variant="caption" color={Colors.textPrimary} style={st.thFocus}>{row.focus}</AppText>
            <AppText variant="subtext" color={Colors.textSecondary} style={st.thTests}>{row.tests}</AppText>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  // ── Scans tab ──
  const renderScans = () => (
    <>
      <View style={st.bigScanCard}>
        <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(15)}}>Nuchal Translucency Scan</AppText>
        <AppText variant="subtext" color="rgba(255,255,255,0.65)" style={{marginTop: vs(3), marginBottom: vs(12)}}>Week 12 - 12 Feb 2025 - Dr. Suma Rao - Apollo</AppText>
        <View style={st.ntGrid}>
          {NT_STATS.map((stat, i) => (
            <View key={i} style={st.ntBox}>
              <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(15)}}>{stat.value}</AppText>
              <AppText variant="subtext" color="rgba(255,255,255,0.6)" style={{fontSize: ms(8.5), marginTop: vs(2)}}>{stat.label}</AppText>
              <AppText variant="subtext" color={Colors.paleGreen} style={{fontSize: ms(8.5), fontWeight: '700', marginTop: vs(3)}}>{stat.sub}</AppText>
            </View>
          ))}
        </View>
      </View>

      <View style={[st.card, {backgroundColor: Colors.amberBg, borderColor: Colors.amber, borderWidth: 1.5, marginTop: vs(10)}]}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(4)}}>
          <Icon family="Ionicons" name="alarm-outline" size={ms(16)} color={Colors.amberDark} />
          <AppText variant="bodyBold" color={Colors.amberDark} style={{fontSize: ms(13)}}>Anomaly scan (TIFFA) - Upcoming</AppText>
        </View>
        <AppText variant="subtext" color={Colors.amberText} style={{lineHeight: ms(15)}}>
          Week 18 - 18 Apr 2025 - 10:30 AM - Apollo Hospital - Dr. Radha Menon (foetal medicine){'\n'}
          What to expect: 45-60 minutes. Full anatomy survey - brain, spine, heart 4-chambers, kidneys, limbs, face, umbilical cord, placenta. Cervical length for preterm risk.
        </AppText>
        <View style={st.insetWhite}>
          <AppText variant="subtext" color={Colors.textSecondary} style={{lineHeight: ms(15)}}>
            Bring: Previous scan reports, referral letter, water bottle (full bladder for abdominal scan). Partner welcome for this scan.
          </AppText>
        </View>
      </View>

      <Section title="What the anomaly scan checks" />
      <View style={st.card}>
        {ANOMALY_CHECKS.map((row, i) => (
          <TouchableOpacity key={i} activeOpacity={0.7} onPress={() => {}} style={[st.checkRow, i === ANOMALY_CHECKS.length - 1 && {borderBottomWidth: 0}]}>
            <View style={[st.testIconWrap, {backgroundColor: Colors.tealBg}]}>
              <Icon family="Ionicons" name={row.icon} size={ms(15)} color={Colors.primary} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(12)}}>{row.name}</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(1)}}>{row.sub}</AppText>
            </View>
            <View style={[st.statusBadge, {backgroundColor: Colors.amberBg}]}>
              <AppText variant="subtext" color={Colors.amberDark} style={{fontWeight: '700', fontSize: ms(8)}}>W18 due</AppText>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    </>
  );

  // ── Lab tests tab ──
  const renderLabs = () => (
    <>
      <Section title="Booking blood results - Week 8" />
      <View style={st.card}>
        {BOOKING_TESTS.map((row, i) => (
          <TestRow key={i} row={row} last={i === BOOKING_TESTS.length - 1} />
        ))}
      </View>

      <Section title="Week 15 recheck - 28 Mar 2025" />
      <View style={st.card}>
        {W15_TESTS.map((row, i) => (
          <TestRow key={i} row={row} last={i === W15_TESTS.length - 1} />
        ))}
      </View>

      <Section title="Upcoming tests" />
      <View style={st.card}>
        {UPCOMING_TESTS.map((row, i) => (
          <TestRow key={i} row={row} last={i === UPCOMING_TESTS.length - 1} />
        ))}
      </View>
    </>
  );

  // ── Ayu tab ──
  const renderAyu = () => (
    <>
      <View style={st.ayuHeader}>
        <AppText variant="subtext" color="rgba(255,255,255,0.6)" style={{textTransform: 'uppercase', letterSpacing: 0.6, fontSize: ms(8.5)}}>Ayu Intel - Antenatal</AppText>
        <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(2), marginBottom: vs(12)}}>Antenatal intelligence</AppText>
        <View style={st.kpiStrip}>
          {KPI_CELLS.map((cell, i) => {
            const color = cell.tone === 'amber' ? '#FDD9A5' : cell.tone === 'green' ? Colors.paleGreen : Colors.white;
            return (
              <View key={i} style={st.kpiCell}>
                <AppText variant="subtext" color="rgba(255,255,255,0.55)" style={{fontSize: ms(8), textTransform: 'uppercase', letterSpacing: 0.5}}>{cell.label}</AppText>
                <AppText variant="bodyBold" color={color} style={{fontSize: ms(14), marginTop: vs(3)}}>{cell.value}</AppText>
                {cell.unit ? <AppText variant="subtext" color="rgba(255,255,255,0.5)" style={{fontSize: ms(8), marginTop: vs(1)}}>{cell.unit}</AppText> : null}
              </View>
            );
          })}
        </View>
      </View>

      <Section title="Anaemia - key priority for this pregnancy" />
      <AppText variant="subtext" color={Colors.textSecondary} style={{marginBottom: vs(8), marginTop: vs(-4)}}>Hb 11.8 \u2192 12.4 g/dL - still below optimal</AppText>
      {ANAEMIA_INSIGHTS.map((item, i) => (
        <InsightRow key={i} item={item} />
      ))}

      <Section title="Supplement adherence - Week 16" />
      <AppText variant="subtext" color={Colors.textSecondary} style={{marginBottom: vs(8), marginTop: vs(-4)}}>IFA + Folic acid + Calcium + Vit D</AppText>
      {SUPP_INSIGHTS.map((item, i) => (
        <InsightRow key={i} item={item} />
      ))}
    </>
  );

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Fixed Header ── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topRow}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
            <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
            </TouchableOpacity>
            <AppText variant="body" color="rgba(255,255,255,0.8)">Antenatal care</AppText>
          </View>
          <TouchableOpacity activeOpacity={0.8} onPress={() => {}} style={st.bookPill}>
            <Icon family="Ionicons" name="calendar-outline" size={ms(13)} color={Colors.white} />
            <AppText variant="subtext" color={Colors.white} style={{fontWeight: '700'}}>Book visit</AppText>
          </TouchableOpacity>
        </View>

        <View style={{paddingHorizontal: s(2), marginTop: vs(4)}}>
          <AppText variant="screenName" color={Colors.white}>Antenatal care</AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.6)" style={{marginTop: vs(2)}}>Visits - scans - tests - results</AppText>
        </View>

        <View style={st.tabBar}>
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                activeOpacity={0.8}
                onPress={() => setActiveTab(tab.key)}
                style={[st.tabPill, active && st.tabPillActive]}>
                <AppText variant="subtext" color={active ? Colors.primary : Colors.white} style={{fontWeight: '700'}}>{tab.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'visits' && renderVisits()}
        {activeTab === 'scans' && renderScans()}
        {activeTab === 'labs' && renderLabs()}
        {activeTab === 'ayu' && renderAyu()}
        <View style={{height: vs(20)}} />
      </ScrollView>

      {/* ── Bottom Save Bar ── */}
      <View style={[st.bottomBar, {paddingBottom: insets.bottom > 0 ? insets.bottom : vs(12)}]}>
        <TouchableOpacity activeOpacity={0.85} onPress={() => {}} style={st.saveBtn}>
          <Icon family="Ionicons" name="save-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(14)}}>Save antenatal log</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  // Header
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(10)},
  topRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(8)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  bookPill: {flexDirection: 'row', alignItems: 'center', gap: s(6), backgroundColor: 'rgba(255,255,255,0.18)', borderRadius: ms(16), paddingHorizontal: s(11), paddingVertical: vs(6)},

  // Tabs
  tabBar: {flexDirection: 'row', gap: s(6), marginTop: vs(12), backgroundColor: 'rgba(0,0,0,0.18)', padding: s(4), borderRadius: ms(12)},
  tabPill: {flex: 1, paddingVertical: vs(7), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center'},
  tabPillActive: {backgroundColor: Colors.white},

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(12)},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Card
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12), marginBottom: vs(8)},

  // Summary row
  summaryRow: {flexDirection: 'row', gap: s(8), marginBottom: vs(10)},
  summaryCell: {flex: 1, borderRadius: ms(12), paddingVertical: vs(12), paddingHorizontal: s(8), alignItems: 'center'},

  // Visit
  visitHead: {flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between', gap: s(8), marginBottom: vs(10)},
  statGrid: {flexDirection: 'row', gap: s(8), marginBottom: vs(10)},
  statBox: {flex: 1, backgroundColor: Colors.background, borderRadius: ms(10), paddingVertical: vs(10), paddingHorizontal: s(6), alignItems: 'center'},
  noteBox: {backgroundColor: Colors.background, borderRadius: ms(10), padding: ms(10)},

  // Status badge
  statusBadge: {paddingHorizontal: s(7), paddingVertical: vs(3), borderRadius: ms(8), marginTop: vs(3)},

  // Schedule table
  tableHeader: {flexDirection: 'row', paddingBottom: vs(6), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5DDD3', marginBottom: vs(2)},
  tableRow: {flexDirection: 'row', alignItems: 'flex-start', paddingVertical: vs(8), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F0EAE0'},
  thTiming: {width: '22%', paddingRight: s(4)},
  thFocus: {width: '32%', paddingRight: s(4)},
  thTests: {flex: 1},

  // Big scan card (dark)
  bigScanCard: {backgroundColor: Colors.primary, borderRadius: ms(16), padding: ms(14)},
  ntGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8)},
  ntBox: {width: '47.5%', backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.18)', borderRadius: ms(12), padding: ms(11)},

  // Inset white
  insetWhite: {backgroundColor: Colors.white, borderRadius: ms(10), padding: ms(10), marginTop: vs(10)},

  // Test row
  testRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(9), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F0EAE0'},
  testIconWrap: {width: ms(30), height: ms(30), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center'},

  // Anomaly check row
  checkRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(9), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F0EAE0'},

  // Insight
  insight: {borderRadius: ms(11), borderWidth: 1, padding: ms(11), marginBottom: vs(8), flexDirection: 'row', alignItems: 'flex-start', gap: s(8)},

  // Ayu header
  ayuHeader: {backgroundColor: Colors.primary, marginHorizontal: s(-13), marginTop: vs(-12), paddingHorizontal: s(16), paddingTop: vs(14), paddingBottom: vs(14), marginBottom: vs(8)},
  kpiStrip: {flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: ms(12), overflow: 'hidden', gap: 1},
  kpiCell: {flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', paddingVertical: vs(10), paddingHorizontal: s(8), alignItems: 'center'},

  // Bottom bar
  bottomBar: {backgroundColor: Colors.white, borderTopWidth: 0.5, borderTopColor: '#E5DDD3', paddingHorizontal: s(13), paddingTop: vs(10)},
  saveBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(8), backgroundColor: Colors.primary, borderRadius: ms(14), paddingVertical: vs(13)},
});

export default AntenatalScreen;
