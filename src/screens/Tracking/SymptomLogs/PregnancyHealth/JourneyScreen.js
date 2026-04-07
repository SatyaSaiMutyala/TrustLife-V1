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
  {key: 't1', label: 'Trimester 1'},
  {key: 't2', label: 'Trimester 2'},
  {key: 't3', label: 'Trimester 3'},
  {key: 'pp', label: 'Postpartum'},
];

const T1_INSIGHT = {
  bg: Colors.pinkBg,
  border: '#F4D2DE',
  color: '#9B2C4E',
  text: 'Trimester 1 complete! (Weeks 1-13) All major organs have formed. The embryo is now a foetus. Risk of miscarriage drops from ~20% at conception to ~2% after 12 weeks.',
};

const T1_EVENTS = [
  {
    status: 'done',
    week: 'Week 4 - 3 Jan 2025',
    title: 'Positive pregnancy test - Confirmed!',
    desc: 'First missed period. urine hCG positive. Blood beta-hCG 150 mIU/mL. LMP: 9 Dec 2024. Expected delivery date (EDD): 15 Sep 2025.',
  },
  {
    status: 'done',
    week: 'Week 6 - 18 Jan 2025',
    title: 'Heartbeat confirmed - Viability scan',
    desc: 'Transvaginal ultrasound. Foetal heart rate: 128 bpm. Crown-rump length: 5.8mm. Sac location: intrauterine. Singleton pregnancy confirmed.',
  },
  {
    status: 'done',
    week: 'Week 8-10 - First booking visit',
    title: 'Booking appointment - Dr. Suma Rao',
    desc: 'Full medical history. Blood group B+. Rubella immune. HIV, HBsAg, syphilis - all negative. Haemoglobin 11.8 g/dL (mild anaemia). IFA tablets, folic acid 5mg, calcium 500mg prescribed. TT vaccine scheduled.',
  },
  {
    status: 'done',
    week: 'Week 11-13+6 - 12 Feb 2025',
    title: 'Nuchal translucency scan + Combined test',
    desc: 'NT measurement: 1.4mm (normal <3.5mm). Combined risk (NT + PAPP-A + hCG + age): 1:4800 for Trisomy 21. Low risk - no invasive testing required. NIPT offered - declined.',
  },
  {
    status: 'done',
    week: 'Week 13 - First trimester ends',
    title: 'Out of the first trimester',
    desc: "All major organs formed. Foetal length 7.4cm. Miscarriage risk now <2%. Nausea typically improves from this point. Welcome to the 'golden trimester.'",
  },
];

const T2_INSIGHT = {
  bg: Colors.pinkBg,
  border: '#F4D2DE',
  color: '#9B2C4E',
  text: "You are here - Week 16 of Trimester 2 (Weeks 14-27). The most comfortable trimester for most women. Baby's movements will become perceptible soon.",
};

const T2_EVENTS = [
  {
    status: 'done',
    week: 'Week 14 - 14 Mar 2025',
    title: 'Tetanus Toxoid (TT1) vaccination',
    desc: 'First dose of TT given. Second dose (TT2) due at Week 18. IAP recommends 2 doses at least 4 weeks apart for primary immunisation during pregnancy.',
  },
  {
    status: 'done',
    week: 'Week 15 - Mid-pregnancy blood panel',
    title: 'Blood tests - Quadruple screen offered',
    desc: 'Hb 12.4 g/dL (improved with IFA). Platelets 182k. Blood sugar 86 mg/dL (fasting). Urine protein - trace. Quadruple screen offered for open neural tube defects - accepted. Results: low risk.',
  },
  {
    status: 'current',
    week: 'Week 16 - NOW',
    title: 'You are here - Quickening window',
    desc: 'First foetal movements (quickening) typically felt Week 16-20 in first pregnancies, 14-16 in subsequent. Baby is ~11.6cm, 100g. Heart pumping 25 litres of blood per day. Facial expressions visible on scan.',
  },
  {
    status: 'upcoming',
    week: 'Week 18 - Apr 18, 2025',
    title: 'Anomaly scan (Level 2 / TIFFA)',
    desc: 'Targeted Imaging for Foetal Anomalies (TIFFA). Detailed anatomy survey: brain, heart (4 chambers), spine, kidneys, limbs, face, placenta position. Cervical length measurement. Gender can be determined (optional).',
  },
  {
    status: 'upcoming',
    week: 'Week 18 - Apr 18',
    title: 'TT2 vaccination due',
    desc: 'Second tetanus toxoid dose. At least 4 weeks after TT1. Protects against neonatal tetanus and maternal tetanus during delivery.',
  },
  {
    status: 'upcoming',
    week: 'Week 20 - Halfway milestone',
    title: '20 weeks - Halfway there',
    desc: 'Baby is now ~25cm (crown-heel length), ~300g. Uterus at the level of the navel. Regular kick counting recommended from this week onwards - aim for 10 movements in 2 hours.',
  },
  {
    status: 'upcoming',
    week: 'Week 24 - June 2025',
    title: 'OGTT - Gestational diabetes screening',
    desc: '75g oral glucose tolerance test. Fasting glucose, 1h, 2h samples. GDM diagnosis if any value exceeds threshold (fasting \u226592, 1h \u2265180, 2h \u2265153 mg/dL - IAP criteria). Critical test - GDM untreated causes macrosomia, neonatal hypoglycaemia.',
  },
];

const T3_INSIGHT = {
  bg: Colors.blueBg,
  border: '#C9DEF3',
  color: Colors.blueText,
  text: 'Trimester 3 (Weeks 28-40) - the final sprint. Foetal position matters from Week 32. More frequent antenatal visits (every 2 weeks from Week 32, weekly from Week 36).',
};

const T3_EVENTS = [
  {
    status: 'upcoming',
    week: 'Week 28 - Viability threshold',
    title: '28 weeks - Foetal viability milestone',
    desc: 'Survival rate >90% if born now with NICU support. Rhesus antibody screen + Anti-D injection (if Rh-negative). Foetal growth scan. Iron and calcium dose review. Attend Lamaze or birthing class.',
  },
  {
    status: 'upcoming',
    week: 'Week 32 - Growth scan',
    title: '32-week growth scan + presentation check',
    desc: 'Estimated foetal weight, growth centile, amniotic fluid index (AFI), placenta grading, Doppler blood flow (umbilical artery). Note whether baby is cephalic (head down) - if not, discuss plan for external cephalic version (ECV) at Week 36.',
  },
  {
    status: 'alert',
    week: 'Week 34-36 - Pre-term caution period',
    title: 'Know the warning signs now',
    desc: 'Preterm labour signs: regular uterine contractions before 37 weeks, watery discharge (possible PPROM), pelvic pressure, back pain increasing. Vaginal bleeding with pain = emergency. Go to hospital immediately - do not wait for a morning appointment.',
  },
  {
    status: 'upcoming',
    week: 'Week 36 - GBS swab',
    title: 'Group B Streptococcus (GBS) screening',
    desc: 'Vaginal swab. If GBS positive, IV penicillin during labour prevents neonatal GBS infection (neonatal GBS can cause sepsis, meningitis). Pack hospital bag. Finalise birth plan. Confirm paediatrician for newborn check.',
  },
  {
    status: 'upcoming',
    week: 'Week 38-39 - Term pregnancy',
    title: 'Term - Baby is ready',
    desc: 'Most babies born Week 38-41. Spontaneous labour is preferred up to Week 41. If no labour by Week 41, induction discussed. Stripping of membranes can be offered at Week 40 to stimulate labour. Cervical ripening with Foley catheter or Misoprostol if induction required.',
  },
  {
    status: 'upcoming',
    week: 'Week 40+ - Labour & delivery',
    title: 'Birth - Go to hospital when...',
    descBold: 'First baby:',
    desc: ' Contractions 5 minutes apart, lasting 60 seconds, for 1 hour (5-1-1 rule) - Waters breaking (any colour) - Significant bleeding - Reduced or absent foetal movement for 2+ hours after cold drink and lying on side.',
  },
];

const PP_INSIGHT = {
  bg: Colors.tealBg,
  border: Colors.paleGreen,
  color: Colors.tealText,
  textBold: "The 'fourth trimester' - 0-6 months postpartum.",
  text: ' Recovery is not a short process. Physical recovery takes 6-12 weeks; hormonal stabilisation takes 3-6 months. The postpartum period is as important as pregnancy for long-term maternal health.',
};

const PP_EVENTS = [
  {
    status: 'upcoming',
    week: 'Days 1-3 - Hospital stay',
    title: 'Immediate postpartum care',
    desc: 'Skin-to-skin immediately after birth. Delayed cord clamping (30-60 seconds minimum). First breastfeed within 1 hour - colostrum is gold. Newborn checks: APGAR, weight, vitamin K, eye prophylaxis, HepB. Maternal vital signs monitored. Pain management.',
  },
  {
    status: 'upcoming',
    week: 'Days 3-14 - Early recovery',
    title: 'Home recovery - first two weeks',
    desc: 'Lochia (postpartum bleeding) expected 4-6 weeks - red \u2192 pink \u2192 white/yellow. Perineal care if stitches. Breast engorgement management - feed frequently, not less. Baby blues (days 3-5) is normal and resolves. Seek help if mood symptoms persist beyond 2 weeks.',
  },
  {
    status: 'upcoming',
    week: 'Week 2 - Home visit',
    title: 'ASHA / midwife home visit',
    desc: 'Baby weight check, breastfeeding assessment, maternal BP check, wound review. This visit is critical - it catches 90% of early postnatal complications before they become emergencies. Do not miss this visit.',
  },
  {
    status: 'upcoming',
    week: 'Week 6 - Postnatal check',
    title: 'Six-week postnatal assessment - Dr. Suma Rao',
    desc: 'EPDS (Edinburgh Postnatal Depression Scale) screening. Physical recovery review: perineum, uterus, BP, Hb. Contraception discussion. Return to exercise clearance. Blood pressure - especially important if pre-eclampsia during pregnancy. Cervical smear if due.',
  },
  {
    status: 'upcoming',
    week: 'Month 3',
    title: 'Contraception decision',
    desc: 'Ovulation can return as early as 3 weeks postpartum (even while breastfeeding). Breastfeeding is not a reliable contraceptive. Options: progestogen-only pill (safe while breastfeeding), IUD (copper or Mirena), condoms, DMPA injection. Combined OCP contraindicated in breastfeeding first 6 months.',
  },
  {
    status: 'upcoming',
    week: 'Month 6 - Final postpartum visit',
    title: '6-month maternal health check',
    desc: 'Haemoglobin check (IFA for 6 months postpartum under Anaemia Mukt Bharat). BP review. EPDS re-screen. Weight and metabolic health review. Breastfeeding support. Return to normal activities cleared. Next preconception window discussed if applicable.',
  },
];

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const STATUS_COLORS = {
  done: Colors.accent,
  current: '#E5638B',
  upcoming: '#CBD5E1',
  alert: '#D97316',
};

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const Insight = ({insight}) => (
  <View style={[st.insight, {backgroundColor: insight.bg, borderColor: insight.border}]}>
    <AppText variant="caption" color={insight.color} style={{lineHeight: ms(17)}}>
      {insight.textBold ? <AppText style={{fontWeight: '800'}} color={insight.color}>{insight.textBold}</AppText> : null}
      {insight.text}
    </AppText>
  </View>
);

const TimelineEvent = ({event, isLast}) => {
  const dotColor = STATUS_COLORS[event.status] || STATUS_COLORS.upcoming;
  const isCurrent = event.status === 'current';
  return (
    <View style={st.tlRow}>
      <View style={st.tlGutter}>
        <View style={[st.tlDot, {backgroundColor: dotColor, borderColor: isCurrent ? '#FBD3DE' : 'transparent', borderWidth: isCurrent ? 3 : 0}]} />
        {!isLast && <View style={st.tlLine} />}
      </View>
      <View style={[st.tlCard, isCurrent && {borderColor: '#E5638B', borderWidth: 1.2}]}>
        <AppText variant="subtext" color={Colors.textTertiary} style={{textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '700', marginBottom: vs(3)}}>{event.week}</AppText>
        <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginBottom: vs(4)}}>{event.title}</AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={{lineHeight: ms(17)}}>
          {event.descBold ? <AppText style={{fontWeight: '700'}} color={Colors.textPrimary}>{event.descBold}</AppText> : null}
          {event.desc}
        </AppText>
      </View>
    </View>
  );
};

const Timeline = ({events}) => (
  <View style={st.timelineWrap}>
    {events.map((ev, i) => (
      <TimelineEvent key={i} event={ev} isLast={i === events.length - 1} />
    ))}
  </View>
);

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const JourneyScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('t2');

  const renderTabContent = () => {
    switch (activeTab) {
      case 't1':
        return (
          <>
            <Insight insight={T1_INSIGHT} />
            <Timeline events={T1_EVENTS} />
          </>
        );
      case 't2':
        return (
          <>
            <Insight insight={T2_INSIGHT} />
            <Timeline events={T2_EVENTS} />
          </>
        );
      case 't3':
        return (
          <>
            <Insight insight={T3_INSIGHT} />
            <Timeline events={T3_EVENTS} />
          </>
        );
      case 'pp':
        return (
          <>
            <Insight insight={PP_INSIGHT} />
            <Timeline events={PP_EVENTS} />
          </>
        );
      default:
        return null;
    }
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Fixed Header ── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topRow}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10), flex: 1}}>
            <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
            </TouchableOpacity>
            <AppText variant="body" color="rgba(255,255,255,0.85)">Pregnancy journey</AppText>
          </View>
          <TouchableOpacity style={st.sharePill} activeOpacity={0.7}>
            <Icon family="Ionicons" name="share-social-outline" size={ms(13)} color={Colors.white} />
            <AppText variant="subtext" color={Colors.white} style={{fontWeight: '700'}}>Share</AppText>
          </TouchableOpacity>
        </View>

        <View style={{paddingHorizontal: s(4), marginTop: vs(6)}}>
          <AppText variant="screenName" color={Colors.white}>Your pregnancy journey</AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.6)" style={{marginTop: vs(2)}}>Week-by-week - milestones - all three trimesters</AppText>
        </View>

        {/* Tab pills */}
        <View style={st.tabBar}>
          {TABS.map((tab) => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[st.tabPill, active && st.tabPillActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.8}>
                <AppText
                  variant="subtext"
                  color={active ? Colors.primary : 'rgba(255,255,255,0.85)'}
                  style={{fontWeight: '700'}}>
                  {tab.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>
        {renderTabContent()}
        <View style={{height: vs(40)}} />
      </ScrollView>
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
  sharePill: {flexDirection: 'row', alignItems: 'center', gap: s(5), backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.25)', paddingHorizontal: s(11), paddingVertical: vs(6), borderRadius: ms(20)},

  // Tab bar
  tabBar: {flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.18)', borderRadius: ms(12), padding: ms(4), marginTop: vs(14), gap: s(3)},
  tabPill: {flex: 1, paddingVertical: vs(7), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center'},
  tabPillActive: {backgroundColor: Colors.white},

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(12)},

  // Insight banner
  insight: {borderRadius: ms(12), borderWidth: 1, padding: ms(12), marginBottom: vs(14)},

  // Timeline
  timelineWrap: {paddingLeft: s(2)},
  tlRow: {flexDirection: 'row', alignItems: 'flex-start'},
  tlGutter: {width: ms(22), alignItems: 'center'},
  tlDot: {width: ms(14), height: ms(14), borderRadius: ms(7), marginTop: vs(6), zIndex: 2},
  tlLine: {position: 'absolute', top: ms(20), bottom: -vs(10), left: ms(10), width: 2, backgroundColor: '#E5DDD3'},
  tlCard: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(13), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12), marginBottom: vs(12), marginLeft: s(8)},
});

export default JourneyScreen;
