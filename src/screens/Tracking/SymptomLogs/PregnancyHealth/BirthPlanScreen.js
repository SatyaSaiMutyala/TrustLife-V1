import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../../constants/colors';
import AppText from '../../../../components/shared/AppText';
import Icon from '../../../../components/shared/Icons';

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const ROSE = '#C2185B';
const ROSE_BG = '#FCE4EC';
const ROSE_BORDER = '#F8BBD0';

const TABS = ['Birth plan', 'Labour', 'Postpartum', 'Ayu'];

// ──────────────────────────────────────────────
// Birth plan tab data
// ──────────────────────────────────────────────

const BIRTH_PLAN_SECTIONS = [
  {
    title: 'Where to deliver',
    options: [
      {key: 'bp-where-1', icon: 'business-outline', name: 'Apollo Hospital, Jubilee Hills', detail: 'Primary choice - Dr. Suma Rao on call - NICU available - private room', defaultActive: true},
      {key: 'bp-where-2', icon: 'business-outline', name: 'KIMS Hospital, Secunderabad', detail: 'Backup option if Apollo full', defaultActive: false},
    ],
  },
  {
    title: 'Delivery type preference',
    options: [
      {key: 'bp-type-1', icon: 'female-outline', name: 'Vaginal delivery if clinically possible', detail: 'I understand that medical indications may require changes to this preference', defaultActive: true},
      {key: 'bp-type-2', icon: 'medkit-outline', name: 'Elective Caesarean section', detail: 'Discuss with Dr. Suma Rao at 36-week visit', defaultActive: false},
      {key: 'bp-type-3', icon: 'water-outline', name: 'Water birth (if available)', detail: 'Labour in water, dry land delivery - check Apollo availability', defaultActive: false},
    ],
  },
  {
    title: 'Birth support',
    options: [
      {key: 'bp-supp-1', icon: 'people-outline', name: 'Partner present throughout labour and birth', detail: 'Including active pushing stage and any operative delivery', defaultActive: true},
      {key: 'bp-supp-2', icon: 'heart-outline', name: 'Mother/mother-in-law present for early labour', detail: 'Only partner for pushing and birth', defaultActive: false},
      {key: 'bp-supp-3', icon: 'person-outline', name: 'Doula / birth companion', detail: 'Independent birth support - discuss Apollo\u2019s policy', defaultActive: false},
    ],
  },
  {
    title: 'Newborn preferences',
    options: [
      {key: 'bp-nb-1', icon: 'happy-outline', name: 'Immediate skin-to-skin (minimum 1 hour)', detail: 'Unless medical emergency for baby or me prevents this', defaultActive: true},
      {key: 'bp-nb-2', icon: 'time-outline', name: 'Delayed cord clamping (minimum 1 minute)', detail: 'Improves iron stores in newborn - evidence-based', defaultActive: true},
      {key: 'bp-nb-3', icon: 'nutrition-outline', name: 'Breastfeed within first hour of birth', detail: 'First breast milk (colostrum) is critical - \u2018liquid gold\u2019', defaultActive: true},
      {key: 'bp-nb-4', icon: 'camera-outline', name: 'No photos during pushing stage or birth', detail: 'Photos welcome in recovery room only', defaultActive: false},
    ],
  },
];

// ──────────────────────────────────────────────
// Labour tab data
// ──────────────────────────────────────────────

const LABOUR_SECTIONS = [
  {
    title: 'Pain management preferences',
    options: [
      {key: 'lab-pm-1', icon: 'leaf-outline', name: 'Non-pharmacological first: massage, breathing, warm water', detail: 'Try natural methods first - escalate as needed', defaultActive: true},
      {key: 'lab-pm-2', icon: 'medkit-outline', name: 'Epidural if requested during labour', detail: 'Available at Apollo - does not increase C-section rate', defaultActive: false},
      {key: 'lab-pm-3', icon: 'eyedrop-outline', name: 'Pethidine / fentanyl IV if epidural not available', detail: 'Crosses placenta - may cause temporary newborn drowsiness', defaultActive: false},
      {key: 'lab-pm-4', icon: 'close-circle-outline', name: 'No pain medication unless I ask', detail: 'Unmedicated birth goal - I understand I may change my mind', defaultActive: false},
    ],
  },
  {
    title: 'During labour',
    options: [
      {key: 'lab-dur-1', icon: 'walk-outline', name: 'Freedom to move, walk, use birthing ball', detail: 'Continuous mobility reduces labour duration', defaultActive: true},
      {key: 'lab-dur-2', icon: 'hardware-chip-outline', name: 'IV access inserted but no routine IV drip unless needed', detail: 'Hep-lock cannula in place for emergency access', defaultActive: true},
      {key: 'lab-dur-3', icon: 'pulse-outline', name: 'Intermittent foetal monitoring (if low risk)', detail: 'Rather than continuous CTG - allows movement. Only if medically appropriate.', defaultActive: false},
      {key: 'lab-dur-4', icon: 'cut-outline', name: 'Avoid episiotomy unless emergency', detail: 'Warm compress, supported perineum during pushing', defaultActive: false},
    ],
  },
  {
    title: 'If Caesarean is needed',
    options: [
      {key: 'lab-cs-1', icon: 'people-outline', name: 'Partner present in theatre', detail: '', defaultActive: true},
      {key: 'lab-cs-2', icon: 'happy-outline', name: 'Skin-to-skin in theatre if both baby and I are stable', detail: 'The \u2018gentle Caesarean\u2019 protocol - ask Apollo if available', defaultActive: true},
      {key: 'lab-cs-3', icon: 'eye-outline', name: 'Transparent screen / drape lowered for moment of birth', detail: 'Discuss with Dr. Suma Rao', defaultActive: false},
    ],
  },
];

const HOSPITAL_BAG = [
  {icon: 'card-outline', text: 'ID + insurance card'},
  {icon: 'document-text-outline', text: 'Antenatal records'},
  {icon: 'shirt-outline', text: '2 loose nightgowns'},
  {icon: 'shirt-outline', text: 'Dark disposable underwear'},
  {icon: 'woman-outline', text: 'Nursing bras (\u00d73)'},
  {icon: 'fast-food-outline', text: 'Snacks for labour'},
  {icon: 'sparkles-outline', text: 'Toiletries - lip balm'},
  {icon: 'happy-outline', text: 'Baby: vest, suit, nappy'},
  {icon: 'car-outline', text: 'Car seat installed'},
  {icon: 'battery-charging-outline', text: 'Charger - camera'},
];

// ──────────────────────────────────────────────
// Postpartum tab data
// ──────────────────────────────────────────────

const RECOVERY_ITEMS = [
  {key: 'rec-1', icon: 'water-outline', name: 'Lochia log'},
  {key: 'rec-2', icon: 'thermometer-outline', name: 'Temperature check'},
  {key: 'rec-3', icon: 'heart-outline', name: 'BP monitoring'},
  {key: 'rec-4', icon: 'nutrition-outline', name: 'Breastfeed log'},
  {key: 'rec-5', icon: 'medkit-outline', name: 'IFA resumed'},
  {key: 'rec-6', icon: 'moon-outline', name: 'Sleep & rest'},
];

const LOCHIA_DOTS = [
  {key: 'l1', label: 'Red', color: '#C0392B'},
  {key: 'l2', label: 'Pink-R', color: '#E8756A'},
  {key: 'l3', label: 'Pink-B', color: '#C4847A'},
  {key: 'l4', label: 'Brown', color: '#A0785A'},
  {key: 'l5', label: 'Yell-B', color: '#C8B090'},
  {key: 'l6', label: 'Yellow', color: '#E8D8C0'},
  {key: 'l7', label: 'White', color: '#F0E8D8'},
  {key: 'l8', label: '\u26a0', color: '#E24B4A', dashed: true},
];

const SIX_WEEK_CHECK = [
  {icon: 'happy-outline', name: 'EPDS depression screening', sub: 'Score \u226513 = referral to perinatal psychiatry. Baby blues (Days 3-5) is normal and transient. PND is persistent and treatable.'},
  {icon: 'medkit-outline', name: 'Physical recovery review', sub: 'Perineum/scar check, uterus involution, BP, Hb, cervical smear if due'},
  {icon: 'shield-outline', name: 'Contraception discussion', sub: 'Ovulation returns as early as 3 weeks. Progestogen-only pill safe from Day 21. IUD from Week 4. Combined OCP not before 6 months if breastfeeding.'},
  {icon: 'walk-outline', name: 'Return to exercise', sub: 'Pelvic floor exercises from Day 1 (Kegels). Walking from Week 2. No high-impact exercise until cleared at 6-week check. C-section: extended recovery - no abdominal exercise until Week 12+.'},
];

// ──────────────────────────────────────────────
// Ayu tab data
// ──────────────────────────────────────────────

const AYU_CARDS = [
  {
    title: 'Breastfeeding preparation - start now',
    sub: 'Week 16 is the optimal time to prepare',
    rows: [
      {tone: 'green', bold: 'Attend a breastfeeding class before Week 32.', body: ' Apollo Hospital and Fernandez Hospital in Hyderabad offer breastfeeding preparation classes. In-person practice with positioning (cradle, cross-cradle, rugby ball, laid-back) dramatically improves success in the first 48 hours. Ask Dr. Suma Rao to refer you.'},
      {tone: 'amber', bold: 'Colostrum harvesting from Week 36', body: ' is now recommended by the WHO. Using a clean syringe, hand-express colostrum and freeze it. This gives your baby access to your antibody-rich first milk even if there is separation at birth (NICU, C-section recovery). Discuss this with Dr. Suma Rao.'},
      {tone: 'green', bold: 'Delayed cord clamping is in your birth plan - excellent choice.', body: ' Waiting 1-3 minutes increases the baby\u2019s iron stores by 40-50mg, reducing the risk of iron-deficiency anaemia in infancy - particularly important since your own iron stores are below optimal.'},
    ],
  },
  {
    title: 'Postpartum mental health preparation',
    sub: 'Act before delivery - not after',
    rows: [
      {tone: 'blue', bold: 'Identify your postpartum support system now.', body: ' WHO evidence shows that women with a named support person for the first 6 weeks have 40% lower rates of postnatal depression. List: partner, mother, mother-in-law, neighbour who can help with cooking. Expecting family support to \u2018just happen\u2019 is the most common oversight.'},
      {tone: 'amber', bold: 'Baby blues is not PND.', body: ' Days 3-5 postpartum bring a sharp oestrogen crash - most women feel tearful, overwhelmed, and exhausted. This resolves spontaneously by Day 10. PND begins after Day 10, is persistent, and requires treatment. Knowing this distinction prevents both under-treatment and over-diagnosis.'},
      {tone: 'green', bold: 'Sertraline and escitalopram are first-line antidepressants in breastfeeding', body: ' - both have extensive safety data. If PND is diagnosed, do not refuse treatment for fear of medication affecting the baby. Untreated severe PND harms infant development more than these medications. iCall Hyderabad: 9152987821 (free counselling).'},
    ],
  },
  {
    title: 'Government schemes to register for',
    sub: 'Telangana / Central India pregnancy benefits',
    rows: [
      {tone: 'green', bold: 'PMSMA (Pradhan Mantri Surakshit Matritva Abhiyan):', body: ' Free comprehensive antenatal check on the 9th of every month at government hospitals. Includes ultrasound, blood tests, BP, Hb - all free. Even if delivering privately, these free check-ups add value during the pregnancy.'},
      {tone: 'green', bold: 'PMJAY (Ayushman Bharat):', body: ' If registered, covers hospitalisation costs including childbirth up to \u20b95 lakh/year. Check eligibility - even lower-middle-class families may qualify. Application at Common Service Centres.'},
      {tone: 'green', bold: 'Anaemia Mukt Bharat:', body: ' Free IFA supplements and Hb testing through ASHA workers and sub-centres throughout pregnancy and 6 months postpartum. Ask your ASHA worker to enrol you if not already enrolled.'},
      {tone: 'amber', bold: 'Maternity leave (Maternity Benefit Act 2017):', body: ' 26 weeks fully paid maternity leave for organisations with 10+ employees. 12 weeks for third pregnancy onwards. Inform your HR at Week 12 to ensure payroll is processed correctly.'},
    ],
  },
];

const TONE_STYLES = {
  green: {bg: '#E8F5E9', border: '#C8E6C9', text: '#2E7D32', icon: 'leaf-outline'},
  amber: {bg: '#FFF8E1', border: '#FFE0A3', text: '#B8860B', icon: 'alert-circle-outline'},
  blue: {bg: '#E3F2FD', border: '#BBDEFB', text: '#1565C0', icon: 'information-circle-outline'},
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

const BpOption = ({option, active, onToggle}) => (
  <TouchableOpacity
    activeOpacity={0.75}
    onPress={onToggle}
    style={[st.bpOption, active && st.bpOptionActive]}>
    <View style={[st.checkbox, active && st.checkboxActive]}>
      {active && <Icon family="Ionicons" name="checkmark" size={ms(14)} color={Colors.white} />}
    </View>
    <Icon family="Ionicons" name={option.icon} size={ms(18)} color={active ? ROSE : Colors.textSecondary} />
    <View style={{flex: 1}}>
      <AppText variant="bodyBold" color={active ? ROSE : Colors.textPrimary} style={{fontSize: ms(13)}}>
        {option.name}
      </AppText>
      {!!option.detail && (
        <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(14)}}>
          {option.detail}
        </AppText>
      )}
    </View>
  </TouchableOpacity>
);

const InsightRow = ({tone, bold, body}) => {
  const t = TONE_STYLES[tone];
  return (
    <View style={[st.insight, {backgroundColor: t.bg, borderColor: t.border}]}>
      <Icon family="Ionicons" name={t.icon} size={ms(16)} color={t.text} />
      <AppText variant="caption" color={t.text} style={{flex: 1, lineHeight: ms(17)}}>
        <AppText style={{fontWeight: '700'}}>{bold}</AppText>{body}
      </AppText>
    </View>
  );
};

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const BirthPlanScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);

  // Initialize toggle state from defaults
  const initToggles = (sections) => {
    const obj = {};
    sections.forEach((sec) => sec.options.forEach((o) => (obj[o.key] = o.defaultActive)));
    return obj;
  };

  const [bpToggles, setBpToggles] = useState(() => initToggles(BIRTH_PLAN_SECTIONS));
  const [labToggles, setLabToggles] = useState(() => initToggles(LABOUR_SECTIONS));
  const [recoveryDone, setRecoveryDone] = useState({});
  const [selectedLochia, setSelectedLochia] = useState(null);

  const toggleBp = (key) => setBpToggles((p) => ({...p, [key]: !p[key]}));
  const toggleLab = (key) => setLabToggles((p) => ({...p, [key]: !p[key]}));
  const toggleRecovery = (key) => setRecoveryDone((p) => ({...p, [key]: !p[key]}));

  // ─────────── render tabs ───────────

  const renderBirthPlan = () => (
    <>
      <View style={[st.insight, {backgroundColor: '#E3F2FD', borderColor: '#BBDEFB'}]}>
        <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color="#1565C0" />
        <AppText variant="caption" color="#1565C0" style={{flex: 1, lineHeight: ms(17)}}>
          <AppText style={{fontWeight: '700'}}>A birth plan is not a rigid script - it is a communication tool.</AppText>
          {' Share it with Dr. Suma Rao at Week 36. The plan should be flexible - birth rarely follows a script. Having it written out ensures your preferences are heard.'}
        </AppText>
      </View>

      {BIRTH_PLAN_SECTIONS.map((sec) => (
        <View key={sec.title}>
          <Section title={sec.title} />
          {sec.options.map((opt) => (
            <BpOption key={opt.key} option={opt} active={!!bpToggles[opt.key]} onToggle={() => toggleBp(opt.key)} />
          ))}
        </View>
      ))}
    </>
  );

  const renderLabour = () => (
    <>
      {LABOUR_SECTIONS.map((sec) => (
        <View key={sec.title}>
          <Section title={sec.title} />
          {sec.options.map((opt) => (
            <BpOption key={opt.key} option={opt} active={!!labToggles[opt.key]} onToggle={() => toggleLab(opt.key)} />
          ))}
        </View>
      ))}

      <Section title="Hospital bag checklist" />
      <View style={st.card}>
        <View style={st.bagGrid}>
          {HOSPITAL_BAG.map((item, i) => (
            <View key={i} style={st.bagCell}>
              <Icon family="Ionicons" name={item.icon} size={ms(14)} color={ROSE} />
              <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1}}>{item.text}</AppText>
            </View>
          ))}
        </View>
      </View>
    </>
  );

  const renderPostpartum = () => (
    <>
      <View style={st.recoveryRing}>
        <AppText variant="subtext" color="rgba(255,255,255,0.6)" style={{textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '700'}}>
          Postpartum recovery tracker
        </AppText>
        <AppText color={Colors.white} style={{fontSize: ms(40), fontWeight: '300', marginTop: vs(6)}}>Day 0</AppText>
        <AppText variant="caption" color="rgba(255,255,255,0.65)" style={{marginTop: vs(4), marginBottom: vs(12)}}>
          Set your delivery date to begin tracking
        </AppText>
        <TouchableOpacity style={st.recoveryPill} activeOpacity={0.8}>
          <Icon family="Ionicons" name="calendar-outline" size={ms(14)} color={Colors.white} />
          <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Set delivery date</AppText>
        </TouchableOpacity>
      </View>

      <Section title="Physical recovery checklist - 0-6 weeks" />
      <View style={st.recGrid}>
        {RECOVERY_ITEMS.map((item) => {
          const done = !!recoveryDone[item.key];
          return (
            <TouchableOpacity
              key={item.key}
              activeOpacity={0.75}
              onPress={() => toggleRecovery(item.key)}
              style={[st.riCard, done && st.riCardDone]}>
              <Icon family="Ionicons" name={item.icon} size={ms(20)} color={done ? ROSE : Colors.textSecondary} />
              <AppText variant="subtext" color={done ? ROSE : Colors.textPrimary} style={{textAlign: 'center', marginTop: vs(6), fontWeight: '600'}}>
                {item.name}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      <Section title="Lochia (postpartum bleeding) colour tracker" />
      <View style={st.card}>
        <AppText variant="subtext" color={Colors.textSecondary} style={{lineHeight: ms(15), marginBottom: vs(10)}}>
          Log today\u2019s lochia colour - normal progression: red (Days 1-4) {'\u2192'} pink/brown (Days 5-10) {'\u2192'} yellow/white (Days 11-42). Seek medical advice if: bright red after Day 10, large clots, foul smell, fever.
        </AppText>
        <View style={st.lochiaRow}>
          {LOCHIA_DOTS.map((d) => {
            const isSel = selectedLochia === d.key;
            return (
              <TouchableOpacity
                key={d.key}
                activeOpacity={0.75}
                onPress={() => setSelectedLochia(d.key)}
                style={{alignItems: 'center', flex: 1}}>
                <View
                  style={[
                    st.lochiaDot,
                    {backgroundColor: d.color},
                    d.dashed && {borderStyle: 'dashed', borderWidth: 1.5, borderColor: '#C0392B'},
                    isSel && st.lochiaDotSel,
                  ]}>
                  {d.label === '\u26a0' && (
                    <AppText style={{color: Colors.white, fontSize: ms(12), fontWeight: '700'}}>!</AppText>
                  )}
                </View>
                <AppText variant="subtext" color={isSel ? ROSE : Colors.textSecondary} style={{fontSize: ms(8), marginTop: vs(4), fontWeight: isSel ? '700' : '500'}}>
                  {d.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      <Section title="Six-week postnatal check - what to expect" />
      <View style={st.card}>
        {SIX_WEEK_CHECK.map((row, i) => (
          <View key={i} style={[st.swRow, i === SIX_WEEK_CHECK.length - 1 && {borderBottomWidth: 0}]}>
            <Icon family="Ionicons" name={row.icon} size={ms(18)} color={ROSE} />
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(13)}}>{row.name}</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(14)}}>{row.sub}</AppText>
            </View>
          </View>
        ))}
      </View>

      <View style={[st.insight, {backgroundColor: '#FFEBEE', borderColor: '#FFCDD2', marginTop: vs(8)}]}>
        <Icon family="Ionicons" name="warning-outline" size={ms(16)} color="#C62828" />
        <AppText variant="caption" color="#C62828" style={{flex: 1, lineHeight: ms(17)}}>
          <AppText style={{fontWeight: '700'}}>Postpartum emergency signs - call 108:</AppText>
          {' Heavy bleeding (soaking 1 pad/hour \u00d7 2h), fever >38.5\u00b0C, severe headache, difficulty breathing, chest pain, calf pain/swelling (DVT), wound opening/discharge, thoughts of harming yourself or baby. Postpartum haemorrhage and puerperal sepsis are the leading causes of maternal death - act immediately.'}
        </AppText>
      </View>
    </>
  );

  const renderAyu = () => (
    <>
      <View style={st.ayuHeader}>
        <AppText variant="subtext" color="rgba(255,255,255,0.65)" style={{textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '700'}}>
          Ayu Intel - Birth & Postpartum
        </AppText>
        <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(4)}}>Birth intelligence</AppText>
      </View>

      {AYU_CARDS.map((card, i) => (
        <View key={i} style={st.card}>
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(14)}}>{card.title}</AppText>
          <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(2), marginBottom: vs(10)}}>{card.sub}</AppText>
          {card.rows.map((row, j) => (
            <InsightRow key={j} tone={row.tone} bold={row.bold} body={row.body} />
          ))}
        </View>
      ))}
    </>
  );

  const renderTab = () => {
    switch (activeTab) {
      case 0: return renderBirthPlan();
      case 1: return renderLabour();
      case 2: return renderPostpartum();
      case 3: return renderAyu();
      default: return null;
    }
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Header ── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topRow}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
            <TouchableOpacity
              style={st.backBtn}
              onPress={() => navigation.goBack()}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
            </TouchableOpacity>
            <AppText variant="body" color="rgba(255,255,255,0.8)">Birth plan</AppText>
          </View>
          <TouchableOpacity style={st.savePill} activeOpacity={0.8}>
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Save</AppText>
            <Icon family="Ionicons" name="checkmark" size={ms(14)} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(6)}}>
          Birth plan & postpartum
        </AppText>
        <AppText variant="caption" color="rgba(255,255,255,0.6)" style={{marginTop: vs(2)}}>
          Your preferences - labour - postpartum recovery
        </AppText>

        {/* Tab bar */}
        <View style={st.tabBar}>
          {TABS.map((label, i) => {
            const active = activeTab === i;
            return (
              <TouchableOpacity
                key={label}
                activeOpacity={0.8}
                onPress={() => setActiveTab(i)}
                style={[st.tabPill, active && st.tabPillActive]}>
                <AppText
                  variant="caption"
                  color={active ? Colors.primary : 'rgba(255,255,255,0.85)'}
                  style={{fontWeight: '700'}}>
                  {label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Body ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>
        {renderTab()}
        <View style={{height: vs(20)}} />
      </ScrollView>

      {/* ── Sticky save bar ── */}
      <View style={[st.saveBar, {paddingBottom: Math.max(insets.bottom, vs(10))}]}>
        <TouchableOpacity style={st.saveBtn} activeOpacity={0.85}>
          <Icon family="Ionicons" name="save-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(14)}}>Save birth plan</AppText>
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
  savePill: {flexDirection: 'row', alignItems: 'center', gap: s(5), backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(14)},

  // Tab bar
  tabBar: {flexDirection: 'row', gap: s(6), marginTop: vs(12)},
  tabPill: {flex: 1, paddingVertical: vs(7), borderRadius: ms(12), alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.12)'},
  tabPillActive: {backgroundColor: Colors.white},

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(10)},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Card
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12), marginBottom: vs(8)},

  // bp-option
  bpOption: {flexDirection: 'row', alignItems: 'flex-start', gap: s(10), backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 1, borderColor: '#E5DDD3', padding: ms(11), marginBottom: vs(8)},
  bpOptionActive: {backgroundColor: ROSE_BG, borderColor: ROSE_BORDER},
  checkbox: {width: ms(22), height: ms(22), borderRadius: ms(6), borderWidth: 1.5, borderColor: '#D4C9BC', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white},
  checkboxActive: {backgroundColor: ROSE, borderColor: ROSE},

  // Hospital bag grid
  bagGrid: {flexDirection: 'row', flexWrap: 'wrap'},
  bagCell: {width: '50%', flexDirection: 'row', alignItems: 'center', gap: s(7), paddingVertical: vs(6), paddingRight: s(6)},

  // Recovery ring
  recoveryRing: {backgroundColor: Colors.primary, borderRadius: ms(18), padding: ms(18), alignItems: 'center', marginBottom: vs(4)},
  recoveryPill: {flexDirection: 'row', alignItems: 'center', gap: s(6), backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: s(14), paddingVertical: vs(8), borderRadius: ms(20)},

  // Recovery grid (3-col)
  recGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8)},
  riCard: {width: '31.5%', backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 1, borderColor: '#E5DDD3', padding: ms(10), alignItems: 'center', marginBottom: vs(8)},
  riCardDone: {backgroundColor: ROSE_BG, borderColor: ROSE_BORDER},

  // Lochia
  lochiaRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start'},
  lochiaDot: {width: ms(28), height: ms(28), borderRadius: ms(14), alignItems: 'center', justifyContent: 'center'},
  lochiaDotSel: {borderWidth: 2.5, borderColor: ROSE},

  // Six-week rows
  swRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(10), paddingVertical: vs(9), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F0E8DC'},

  // Ayu header
  ayuHeader: {backgroundColor: Colors.primary, marginHorizontal: s(-13), paddingHorizontal: s(16), paddingTop: vs(14), paddingBottom: vs(16), marginTop: vs(-10), marginBottom: vs(12)},

  // Insight (generic)
  insight: {borderRadius: ms(11), borderWidth: 1, padding: ms(10), marginBottom: vs(8), flexDirection: 'row', alignItems: 'flex-start', gap: s(8)},

  // Sticky save bar
  saveBar: {backgroundColor: Colors.white, paddingHorizontal: s(16), paddingTop: vs(10), borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5DDD3'},
  saveBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(8), backgroundColor: Colors.primary, paddingVertical: vs(13), borderRadius: ms(14)},
});

export default BirthPlanScreen;
