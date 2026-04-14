import React, {useState, useMemo} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const TABS = [
  {key: 'ayuIntel', label: '\uD83E\uDDE0 Ayu Intel'},
  {key: 'progression', label: '\uD83D\uDCC8 Progression'},
  {key: 'organs', label: '\uD83E\uDEC1 Organs'},
  {key: 'cluster', label: '\uD83D\uDD17 Cluster'},
  {key: 'care', label: '\u2713 Care'},
];

const TONE = {
  green: {bg: Colors.tealBg, color: Colors.tealText, icon: 'checkmark-circle-outline'},
  amber: {bg: Colors.amberBg, color: Colors.amberDark, icon: 'alert-circle-outline'},
  red: {bg: '#FCEBEB', color: '#791F1F', icon: 'warning-outline'},
};

// ──────────────────────────────────────────────
// DATA PER CHILD
// ──────────────────────────────────────────────

const DATA = {
  neonatal: {
    name: 'Baby Zara - Neonatal', col: Colors.accent, cat: 'Baby Health',
    hdr: [
      {lbl: 'Weight', val: '3.82 kg', col: Colors.accent},
      {lbl: 'Length', val: '53.1 cm', col: Colors.accent},
      {lbl: 'Feeds/day', val: '6-7', col: Colors.accent},
      {lbl: 'Sleep', val: '14.5h', col: Colors.accent},
    ],
    ayu: {
      narrative: "Zara's growth is tracking beautifully along the 50th percentile for WHO girls. Weight gain of 28g/day is within the ideal 25-30g range. Breastfeeding frequency of 6-7 feeds/day with good latch duration suggests adequate milk transfer. Sleep of 14.5h/24h is age-appropriate. All newborn screens completed. The 6-week paediatrician visit is the next critical checkpoint.",
      insights: [
        {title: 'Weight gain trajectory', body: '28g/day gain - optimal range. Will reach 5kg by 3 months confirming adequate nutrition.', tone: 'green'},
        {title: 'Feeding pattern', body: '6-7 feeds/day, avg 32 min total. Night feed intervals lengthening from 2h to 3h - normal maturation.', tone: 'green'},
        {title: 'Sleep architecture', body: '14.5h/24h with 2 structured naps. Active sleep appropriately high for brain development.', tone: 'green'},
        {title: '6-week vaccines due', body: 'Pentavalent, Rotavirus Dose 1, PCV Dose 1 due at 6 weeks per IAP 2024. Book within 2 days.', tone: 'amber'},
      ],
    },
    progression: {
      primary: {lbl: 'Weight', val: 3.82, lo: 3.0, hi: 5.0, unit: 'kg', col: Colors.accent},
      hist: [
        {dt: 'Birth', v: 3.1}, {dt: 'W1', v: 3.0}, {dt: 'W2', v: 3.15}, {dt: 'W3', v: 3.28},
        {dt: 'W4', v: 3.42}, {dt: 'W5', v: 3.58}, {dt: 'W6', v: 3.82},
      ],
      panels: [
        {lbl: 'Weight gain rate', score: '28g/day', bar: 85, badge: 'Optimal', badge_col: Colors.accent, detail: 'Target 25-30g/day. Consistent upward trend since birth.'},
        {lbl: 'Feed efficiency', score: '92%', bar: 92, badge: 'Excellent', badge_col: Colors.accent, detail: 'Transfer rate estimated from weight gain vs feed frequency.'},
        {lbl: 'Growth percentile', score: '50th', bar: 50, badge: 'Median', badge_col: Colors.blue, detail: 'Tracking steadily on 50th centile for WHO girls.'},
      ],
    },
    organs: [
      {n: 'Brain', c: '#7C3AED', sev: 10, impact: 'Active sleep (REM) is appropriately high at 44 days - critical for synapse formation and neurological development.'},
      {n: 'GI tract', c: Colors.amber, sev: 15, impact: 'Yellow seedy stools and 8 wet nappies/day confirm healthy gut function and adequate hydration from breastfeeding.'},
      {n: 'Immune system', c: Colors.accent, sev: 20, impact: 'Passive immunity from maternal antibodies active. First active immunisation due at 6 weeks (Pentavalent + Rotavirus + PCV).'},
    ],
    cluster: {
      risk: '5%', name: 'Low-Risk Neonate',
      desc: 'Zara has no identified risk factors. Growth, feeding, and development are all within normal parameters.',
      diseases: [{n: 'Neonatal jaundice', p: 5, type: 'resolved'}, {n: 'Feeding difficulty', p: 3, type: 'resolved'}],
    },
    care: {
      treat: ['6-week paediatrician visit (growth, hip check, developmental)', 'First vaccination dose (Pentavalent + Rotavirus + PCV)', 'Continue exclusive breastfeeding until 6 months', 'Tummy time 3-5 min x3 daily for neck strength'],
      prev: 'Maintain exclusive breastfeeding, age-appropriate sleep environment (back-to-sleep), and timely vaccination per IAP 2024 schedule.',
    },
  },
  paediatric: {
    name: 'Aarav - Child Health', col: Colors.blue, cat: 'Child Development',
    hdr: [
      {lbl: 'Height', val: '132.4 cm', col: Colors.blue},
      {lbl: 'Weight', val: '28.6 kg', col: Colors.accent},
      {lbl: 'BMI', val: '16.3', col: Colors.accent},
      {lbl: 'Milestones', val: 'On track', col: Colors.accent},
    ],
    ayu: {
      narrative: "Aarav at 9 years is in an excellent developmental phase. Height and weight track normally with BMI 16.3 (healthy). Sustained attention of 25+ minutes and complex problem-solving suggest on-track cognitive development. Allergen introduction is progressing (3 of 8). Orthodontic review is due per IAP guidelines (7-9 years).",
      insights: [
        {title: 'Cognitive milestones', body: 'Reading fluency, sustained attention 25+ min, peer collaboration - all on track for 9 years.', tone: 'green'},
        {title: 'Allergen introduction', body: '3 of 8 done (peanut, tree nut, egg). Cashew trial successful. 5 remaining: wheat, soy, fish, shellfish, milk.', tone: 'amber'},
        {title: 'Physical activity', body: 'Football, swimming, karate, cricket - excellent variety. 45+ min structured activity most days.', tone: 'green'},
        {title: 'Orthodontic review due', body: '20 teeth, mixed dentition phase. IAP recommends first orthodontic assessment at 7-9 years.', tone: 'amber'},
        {title: 'Vaccination current', body: 'All IAP 2024 vaccines current. HPV vaccine discussion at 9-12 years.', tone: 'green'},
      ],
    },
    progression: {
      primary: {lbl: 'Height', val: 132.4, lo: 120, hi: 145, unit: 'cm', col: Colors.blue},
      hist: [
        {dt: 'Age 7', v: 121}, {dt: 'Age 7.5', v: 124}, {dt: 'Age 8', v: 127},
        {dt: 'Age 8.5', v: 129.5}, {dt: 'Age 9', v: 132.4},
      ],
      panels: [
        {lbl: 'Height velocity', score: '5.7 cm/yr', bar: 75, badge: 'Normal', badge_col: Colors.accent, detail: 'Expected 5-6 cm/year pre-puberty. On track.'},
        {lbl: 'BMI trend', score: '16.3', bar: 60, badge: 'Healthy', badge_col: Colors.accent, detail: 'Stable BMI over 2 years. No overweight or underweight risk.'},
        {lbl: 'Allergen progress', score: '3/8', bar: 38, badge: 'In progress', badge_col: Colors.amber, detail: '5 allergens remaining. Target: complete by age 10.'},
      ],
    },
    organs: [
      {n: 'Brain', c: '#7C3AED', sev: 5, impact: 'Cognitive development on track. SDQ assessment recommended to replace ASQ-3 at this age.'},
      {n: 'Teeth', c: Colors.blue, sev: 15, impact: '20 teeth erupted, mixed dentition. Orthodontic assessment needed for crowding/crossbite screening.'},
      {n: 'Immune system', c: Colors.accent, sev: 10, impact: 'All vaccinations current. Allergen introduction building oral tolerance to major food groups.'},
    ],
    cluster: {
      risk: '3%', name: 'Healthy School-Age Child',
      desc: 'Aarav has no chronic conditions. Growth, development, and activity levels are excellent for age.',
      diseases: [{n: 'Mild fever episode', p: 5, type: 'resolved'}, {n: 'Allergen sensitivity', p: 15, type: 'monitoring'}],
    },
    care: {
      treat: ['Book orthodontic assessment within 1 month', 'Continue allergen protocol - wheat and soy next', 'Complete SDQ questionnaire', 'Annual vision screening'],
      prev: 'Maintain varied physical activity, balanced diet, regular dental checks every 6 months, and age-appropriate vaccination per IAP 2024.',
    },
  },
  pregnancy: {
    name: 'Ananya - Pregnancy', col: '#BE185D', cat: 'Maternal Health',
    hdr: [
      {lbl: 'Week', val: '16', col: '#BE185D'},
      {lbl: 'BP avg', val: '110/72', col: Colors.accent},
      {lbl: 'Supplements', val: '92%', col: Colors.accent},
      {lbl: 'Weight gain', val: '+4.2 kg', col: Colors.accent},
    ],
    ayu: {
      narrative: "Ananya is at Week 16, entering the comfortable second trimester window. BP consistently normal. Supplement adherence 92% (DHA missed 3 times). Nausea reducing as expected. Baby is avocado-sized with inner ear fully formed. Anomaly scan in 13 days is the next critical milestone.",
      insights: [
        {title: 'Blood pressure', body: 'Consistently normal at 110/72 avg. No pre-eclampsia risk markers.', tone: 'green'},
        {title: 'Supplement adherence', body: '92% - IFA and Calcium consistent, DHA missed 3 times. DHA critical for fetal brain in T2.', tone: 'amber'},
        {title: 'Nausea trajectory', body: 'Reducing as expected entering T2. Most days now nausea-free.', tone: 'green'},
        {title: 'Anomaly scan', body: 'Week 18 TIFFA scan at Apollo - checks heart, spine, kidneys, placenta. 13 days away.', tone: 'amber'},
        {title: 'Weight gain', body: '+4.2 kg at Week 16 - within 1-2 kg/month target. Healthy trajectory.', tone: 'green'},
      ],
    },
    progression: {
      primary: {lbl: 'Week', val: 16, lo: 0, hi: 40, unit: 'weeks', col: '#BE185D'},
      hist: [
        {dt: 'W4', v: 4}, {dt: 'W8', v: 8}, {dt: 'W12', v: 12}, {dt: 'W16', v: 16},
      ],
      panels: [
        {lbl: 'Weight gain', score: '+4.2 kg', bar: 70, badge: 'On track', badge_col: Colors.accent, detail: '1-2 kg/month target in T2. Consistent gain.'},
        {lbl: 'BP stability', score: '110/72', bar: 85, badge: 'Normal', badge_col: Colors.accent, detail: 'No hypertensive readings. Continue weekly monitoring.'},
        {lbl: 'Supplement adherence', score: '92%', bar: 92, badge: 'Good', badge_col: Colors.accent, detail: 'Missed DHA 3 times. Set separate reminder.'},
      ],
    },
    organs: [
      {n: 'Placenta', c: '#BE185D', sev: 10, impact: 'Functioning normally. Iron supplementation supporting increased blood volume and placental oxygen transfer.'},
      {n: 'Baby - ears', c: '#7C3AED', sev: 5, impact: 'Inner ear fully formed at Week 16. Baby can now hear maternal voice. Auditory stimulation beneficial.'},
      {n: 'Kidneys (maternal)', c: Colors.blue, sev: 8, impact: 'GFR increasing as expected in pregnancy. Adequate hydration important.'},
    ],
    cluster: {
      risk: '8%', name: 'Low-Risk Pregnancy',
      desc: 'No gestational diabetes, pre-eclampsia, or growth restriction markers. All booking bloods normal.',
      diseases: [{n: 'Gestational diabetes', p: 8, type: 'screening'}, {n: 'Pre-eclampsia', p: 5, type: 'monitoring'}],
    },
    care: {
      treat: ['Set separate DHA reminder for fetal brain development', 'Prepare for Week 18 anomaly scan - drink 1L water before', 'Start prenatal exercise - walking 20 min + yoga 2x/week', 'Review quadruple screen results with Dr. Suma Rao'],
      prev: 'Continue IFA + Calcium + DHA daily. Anomaly scan at W18, OGTT at W24, Rhesus check at W28, GBS swab at W36.',
    },
  },
};

// ──────────────────────────────────────────────
// Tab Content Components
// ──────────────────────────────────────────────

const AyuIntelTab = ({d}) => (
  <View>
    <View style={[st.card, {backgroundColor: Colors.primary}]}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(10)}}>
        <View style={{width: ms(28), height: ms(28), borderRadius: ms(8), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'}}>
          <Icon family="Ionicons" name="bulb-outline" size={ms(14)} color={Colors.paleGreen} />
        </View>
        <AppText variant="bodyBold" color={Colors.white}>Ayu narrative</AppText>
      </View>
      <AppText variant="caption" color="rgba(255,255,255,0.75)" style={{lineHeight: ms(18)}}>{d.ayu.narrative}</AppText>
    </View>
    {d.ayu.insights.map((ins, i) => {
      const tc = TONE[ins.tone] || TONE.green;
      return (
        <View key={i} style={[st.insightRow, {backgroundColor: tc.bg}]}>
          <Icon family="Ionicons" name={tc.icon} size={ms(16)} color={tc.color} />
          <View style={{flex: 1, marginLeft: s(8)}}>
            <AppText variant="bodyBold" color={tc.color} style={{fontSize: ms(12)}}>{ins.title}</AppText>
            <AppText variant="caption" color={tc.color} style={{marginTop: vs(2), lineHeight: ms(16), opacity: 0.85}}>{ins.body}</AppText>
          </View>
        </View>
      );
    })}
  </View>
);

const ProgressionTab = ({d}) => (
  <View>
    {d.progression.panels.map((p, i) => (
      <View key={i} style={st.card}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(6)}}>
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(12)}}>{p.lbl}</AppText>
          <View style={[st.pill, {backgroundColor: p.badge_col + '18'}]}>
            <AppText variant="small" color={p.badge_col} style={{fontWeight: '600'}}>{p.badge}</AppText>
          </View>
        </View>
        <AppText variant="bodyBold" color={Colors.primary} style={{fontSize: ms(18), marginBottom: vs(6)}}>{p.score}</AppText>
        <View style={st.progressTrack}><View style={[st.progressFill, {width: `${p.bar}%`, backgroundColor: p.badge_col}]} /></View>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(6), lineHeight: ms(16)}}>{p.detail}</AppText>
      </View>
    ))}
  </View>
);

const OrgansTab = ({d}) => (
  <View>
    {d.organs.map((o, i) => (
      <View key={i} style={st.card}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(6)}}>
          <View style={{width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: o.c}} />
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(13)}}>{o.n}</AppText>
        </View>
        <AppText variant="caption" color={Colors.textSecondary} style={{lineHeight: ms(17)}}>{o.impact}</AppText>
      </View>
    ))}
  </View>
);

const ClusterTab = ({d}) => (
  <View>
    <View style={[st.card, {backgroundColor: Colors.primary}]}>
      <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(14)}}>{d.cluster.name}</AppText>
      <AppText variant="caption" color="rgba(255,255,255,0.6)" style={{marginTop: vs(4)}}>{d.cluster.desc}</AppText>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginTop: vs(10)}}>
        <AppText variant="bodyBold" color={Colors.paleGreen} style={{fontSize: ms(22)}}>{d.cluster.risk}</AppText>
        <AppText variant="small" color="rgba(255,255,255,0.5)">overall risk</AppText>
      </View>
    </View>
    {d.cluster.diseases.map((dis, i) => (
      <View key={i} style={st.card}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(12)}}>{dis.n}</AppText>
          <View style={[st.pill, {backgroundColor: dis.type === 'resolved' ? Colors.tealBg : Colors.amberBg}]}>
            <AppText variant="small" color={dis.type === 'resolved' ? Colors.tealText : Colors.amberDark} style={{fontWeight: '600'}}>{dis.type}</AppText>
          </View>
        </View>
        <View style={[st.progressTrack, {marginTop: vs(8)}]}><View style={[st.progressFill, {width: `${dis.p}%`, backgroundColor: dis.p > 20 ? Colors.amber : Colors.accent}]} /></View>
      </View>
    ))}
  </View>
);

const CareTab = ({d}) => (
  <View>
    <View style={st.card}>
      <AppText variant="sectionTitle" color={Colors.textSecondary} style={{marginBottom: vs(8)}}>Treatment plan</AppText>
      {d.care.treat.map((t, i) => (
        <View key={i} style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(8), gap: s(8)}}>
          <View style={{width: ms(22), height: ms(22), borderRadius: ms(7), backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center'}}>
            <AppText variant="small" color={Colors.white} style={{fontWeight: '800'}}>{i + 1}</AppText>
          </View>
          <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(17)}}>{t}</AppText>
        </View>
      ))}
    </View>
    <View style={[st.card, {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen}]}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(6)}}>
        <Icon family="Ionicons" name="shield-checkmark-outline" size={16} color={Colors.tealText} />
        <AppText variant="body" color={Colors.tealText} style={{fontWeight: '700'}}>Prevention</AppText>
      </View>
      <AppText variant="caption" color={Colors.tealText} style={{lineHeight: ms(17), opacity: 0.85}}>{d.care.prev}</AppText>
    </View>
  </View>
);

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const PaediatricAyuDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const {cardId, card} = route.params || {};
  const [activeTab, setActiveTab] = useState('ayuIntel');

  const d = useMemo(() => DATA[cardId] || DATA.neonatal, [cardId]);

  const metricCards = useMemo(() => d.hdr.map(h => ({label: h.lbl, value: h.val, color: h.col})), [d]);

  const renderTabContent = () => {
    switch (activeTab) {
      case 'ayuIntel': return <AyuIntelTab d={d} />;
      case 'progression': return <ProgressionTab d={d} />;
      case 'organs': return <OrgansTab d={d} />;
      case 'cluster': return <ClusterTab d={d} />;
      case 'care': return <CareTab d={d} />;
      default: return <AyuIntelTab d={d} />;
    }
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={[st.header, {paddingTop: insets.top + vs(10)}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="small" color="rgba(255,255,255,0.38)" style={{marginBottom: vs(2)}}>{d.cat} - Ayu Intel</AppText>
            <AppText style={{fontSize: ms(17), fontWeight: '800', color: Colors.white}}>{d.name}</AppText>
          </View>
        </View>

        <View style={st.metricRow}>
          {metricCards.map((m, i) => (
            <View key={i} style={[st.metricCard, {borderLeftColor: m.color}]}>
              <AppText variant="small" color="rgba(255,255,255,0.38)" style={{fontSize: ms(8), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5}}>{m.label}</AppText>
              <AppText style={{fontSize: ms(14), fontWeight: '700', color: m.color, fontFamily: 'monospace', lineHeight: ms(18)}}>{m.value}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Tabs */}
      <View style={st.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.tabScroll}>
          {TABS.map(tab => {
            const isActive = activeTab === tab.key;
            return (
              <TouchableOpacity key={tab.key} style={[st.tab, isActive && st.tabActive]} activeOpacity={0.7} onPress={() => setActiveTab(tab.key)}>
                <AppText variant="small" color={isActive ? Colors.accent : 'rgba(255,255,255,0.4)'} style={{fontWeight: '700', fontSize: ms(10)}}>{tab.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={{flex: 1}} contentContainerStyle={st.body} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
        <View style={{height: vs(40)}} />
      </ScrollView>
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingBottom: vs(8), paddingHorizontal: s(14)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(8)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  metricRow: {flexDirection: 'row', gap: s(5)},
  metricCard: {flex: 1, backgroundColor: 'rgba(255,255,255,0.06)', borderRadius: ms(10), padding: ms(8), borderLeftWidth: ms(3)},

  tabContainer: {backgroundColor: Colors.primary, flexDirection: 'row'},
  tabScroll: {paddingHorizontal: s(10)},
  tab: {paddingHorizontal: s(11), paddingVertical: vs(9), borderBottomWidth: 2.5, borderBottomColor: 'transparent'},
  tabActive: {borderBottomColor: Colors.accent},

  body: {padding: s(14)},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(14), marginBottom: vs(12)},
  insightRow: {flexDirection: 'row', alignItems: 'flex-start', padding: ms(10), borderRadius: ms(10), marginBottom: vs(8)},
  pill: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(6)},
  progressTrack: {height: vs(6), backgroundColor: Colors.borderLight, borderRadius: ms(3), overflow: 'hidden'},
  progressFill: {height: '100%', borderRadius: ms(3)},
});

export default PaediatricAyuDetailScreen;
