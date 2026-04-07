import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../../constants/colors';
import AppText from '../../../../components/shared/AppText';
import Icon from '../../../../components/shared/Icons';
import NumpadModal from '../../../../components/BabyHealth/NumpadModal';

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const TABS = [
  {key: 'dose', label: 'Dose calculator'},
  {key: 'courses', label: 'Active courses'},
  {key: 'allergies', label: 'Allergies'},
  {key: 'ayu', label: 'Ayu'},
];

const DRUGS = {
  para: {
    name: 'Paracetamol',
    mgkg: 15,
    max: 1000,
    freq: '4-6h',
    maxDoses: 5,
    suspConc: 250,
    suspMl: 5,
  },
  ibu: {
    name: 'Ibuprofen',
    mgkg: 7.5,
    max: 400,
    freq: '6-8h',
    maxDoses: 3,
    suspConc: 100,
    suspMl: 5,
  },
  amox: {
    name: 'Amoxicillin',
    mgkg: 45,
    max: 875,
    freq: '8h',
    maxDoses: 3,
    suspConc: 250,
    suspMl: 5,
  },
  cetirizine: {
    name: 'Cetirizine',
    mgkg: null,
    fixed: 5,
    max: 10,
    freq: '24h',
    maxDoses: 1,
    suspConc: 5,
    suspMl: 5,
  },
};

const DRUG_ORDER = ['para', 'ibu', 'amox', 'cetirizine'];

const COMMON_MEDS = [
  {
    name: 'Paracetamol (Calpol, Tylenol)',
    indic: 'Fever \u226538.5\u00b0C \u00b7 pain \u00b7 post-vaccination',
    tagText: '15 mg/kg',
    tagBg: Colors.tealBg,
    tagColor: Colors.tealText,
    detail: 'Every 4-6h \u00b7 max 5 doses/day \u00b7 Suspension: 250mg/5ml \u00b7 Tablet: 500mg',
    highlight: 'For 27.4 kg: 411 mg = ~8ml suspension or \u00be of a 500mg tablet',
    hlBg: Colors.tealBg,
    hlColor: Colors.tealText,
    hlBorder: Colors.paleGreen,
  },
  {
    name: 'Ibuprofen (Brufen, Advil)',
    indic: 'Fever \u226539\u00b0C not responding to paracetamol \u00b7 dental pain \u00b7 MSK pain',
    tagText: '5-10 mg/kg',
    tagBg: Colors.amberBg,
    tagColor: Colors.amberText,
    detail: 'Every 6-8h \u00b7 max 3 doses/day \u00b7 must eat first \u00b7 Suspension: 100mg/5ml',
    highlight: '\u26a0\ufe0f NOT for dengue, chickenpox, dehydration, or under 6 months \u00b7 For 27.4 kg: 137-274 mg = 7-14ml suspension',
    hlBg: Colors.amberBg,
    hlColor: Colors.amberDark,
    hlBorder: '#FDDCB5',
  },
  {
    name: 'Cetirizine (Zyrtec, Alerid)',
    indic: 'Allergic reaction \u00b7 urticaria \u00b7 hay fever',
    tagText: '5 mg once daily',
    tagBg: Colors.blueBg,
    tagColor: Colors.blueText,
    detail: 'Age 6-11: 5mg once daily \u00b7 Age 12+: 10mg once daily \u00b7 Syrup: 5mg/5ml',
    highlight: 'For mild allergic reactions (hives only). For moderate reactions: 10mg and call doctor. For anaphylaxis: do NOT use antihistamine alone - EpiPen + 108.',
    hlBg: Colors.blueBg,
    hlColor: Colors.blueText,
    hlBorder: '#C6DEF6',
  },
  {
    name: 'ORS (Electral, WHO ORS)',
    indic: 'Diarrhoea \u00b7 vomiting \u00b7 dehydration',
    tagText: '50-100 ml/kg',
    tagBg: Colors.tealBg,
    tagColor: Colors.tealText,
    detail: 'Over 3-4 hours for mild dehydration. Zinc 20mg/day \u00d7 10-14 days alongside ORS reduces diarrhoea duration by 25%.',
    highlight: 'For 27.4 kg: 1,370-2,740 ml over 3-4 hours \u00b7 then match ongoing losses',
    hlBg: Colors.tealBg,
    hlColor: Colors.tealText,
    hlBorder: Colors.paleGreen,
  },
  {
    name: 'Amoxicillin (Mox, Novamox)',
    indic: 'Ear infection (AOM) \u00b7 strep throat \u00b7 skin infections',
    tagText: '40-90 mg/kg/day',
    tagBg: Colors.redBg,
    tagColor: Colors.redText,
    detail: 'Divided 2-3 doses/day \u00b7 typically 5-10 day course \u00b7 Suspension: 125mg/5ml or 250mg/5ml',
    highlight: '\u26a0\ufe0f Prescription only \u00b7 Complete full course even if better \u00b7 For 27.4 kg standard dose: 822 mg/day = 3 \u00d7 274mg (16.4ml of 250/5ml)',
    hlBg: Colors.redBg,
    hlColor: Colors.redText,
    hlBorder: '#F6C9C8',
  },
];

const CHILD_CHIPS = [
  {key: 'zara', label: 'Baby Zara', active: false},
  {key: 'aarav', label: 'Aarav', active: true},
];

const MED_CHIPS = [
  {key: 'amox', label: 'Amoxicillin'},
  {key: 'azi', label: 'Azithromycin'},
  {key: 'cet', label: 'Cetirizine'},
  {key: 'pred', label: 'Prednisolone'},
  {key: 'sal', label: 'Salbutamol'},
  {key: 'other', label: 'Other'},
];

const COURSE_CHIPS = [
  {key: '3', label: '3 days', active: false},
  {key: '5', label: '5 days', active: false},
  {key: '7', label: '7 days', active: true},
  {key: '10', label: '10 days', active: false},
  {key: '14', label: '14 days', active: false},
];

const ALLERGY_ROWS = [
  {
    icon: 'woman-outline',
    name: 'Priya \u00b7 38F',
    sub: 'NSAIDs: NSAID-related GI sensitivity - not allergy',
    badge: 'Intolerance',
    badgeBg: Colors.amberBg,
    badgeColor: Colors.amberDark,
  },
  {
    icon: 'man-outline',
    name: 'Aarav \u00b7 9y',
    sub: 'No known allergies \u00b7 Penicillin tolerated (Amoxicillin \u00d72)',
    badge: 'None known',
    badgeBg: Colors.tealBg,
    badgeColor: Colors.tealText,
  },
  {
    icon: 'happy-outline',
    name: 'Baby Zara \u00b7 44d',
    sub: 'No medications given yet. G6PD normal - sulfonamides safe if needed.',
    badge: 'None known',
    badgeBg: Colors.tealBg,
    badgeColor: Colors.tealText,
  },
];

const STORAGE_FLAGS = [
  {
    icon: 'lock-closed-outline',
    title: 'Child-resistant caps do not mean child-proof',
    sub: 'Store all medicines above 1.5m height, locked if possible. Accidental ingestion is the leading cause of child poisoning - India Poisons Helpline: 1800-116-117',
  },
  {
    icon: 'snow-outline',
    title: 'Antibiotic suspensions require refrigeration after reconstitution',
    sub: 'Amoxicillin suspension: refrigerate, use within 7 days. Azithromycin: can store at room temperature. Check label always.',
  },
  {
    icon: 'alert-circle-outline',
    title: 'Never use expired medications for children',
    sub: 'Paracetamol and ibuprofen suspensions degrade after expiry. Antibiotics may become less effective or potentially toxic. TrustLife tracks expiry dates - enable reminders.',
  },
];

const AYU_ABX = {
  title: 'Antibiotic stewardship \u00b7 family pattern',
  subtitle: '2 antibiotic courses in past 12 months (Aarav)',
  rows: [
    {
      color: Colors.amber,
      bold: '2 antibiotic courses in 12 months',
      text: ' is at the upper limit of what is expected for a healthy 9-year-old. Children typically experience 6-8 upper respiratory infections per year, but most do not require antibiotics. The 2 courses (ear infection \u00d7 2) are clinically justified, but recurrent ear infections in a school-age child warrant investigation for chronic otitis media.',
    },
    {
      color: Colors.blue,
      bold: 'Recurrent ear infections in children 6+',
      text: ' are less common than in toddlers and suggest: allergic rhinitis (treated with antihistamine + nasal steroid, not antibiotics), adenoid hypertrophy (assess by ENT), or eustachian tube dysfunction. Recommend ENT review if a third episode occurs within 12 months.',
    },
    {
      color: Colors.accent,
      bold: 'Both courses were completed in full.',
      text: ' Excellent adherence - course completion is critical for eliminating bacteria fully and preventing the emergence of resistant strains within the individual.',
    },
  ],
};

const AYU_INFANT = {
  title: 'Infant medicine safety \u00b7 Baby Zara',
  subtitle: '44 days \u00b7 medications require special caution',
  rows: [
    {
      color: Colors.red,
      bold: 'No OTC medicines for infants under 3 months without paediatric advice.',
      text: " This includes infant 'gripe water' and teething gels - most contain alcohol, sodium bicarbonate, or lidocaine which are not appropriate for neonates. For colic: simeticone drops (Infacol) are the safest option. For pain after vaccination: paracetamol only, from 2 months.",
    },
    {
      color: Colors.amber,
      bold: 'G6PD normal status means sulfonamide antibiotics are safe if ever needed',
      text: ' - this was confirmed on newborn screen. However, this does not mean Zara is immune to all drug-related blood problems. Unusual bruising or pallor after any new medication warrants immediate paediatric review.',
    },
    {
      color: Colors.accent,
      bold: 'Vitamin D drops (400 IU daily) are the only recommended supplement',
      text: ' for exclusively breastfed infants. All other supplements (probiotics, multivitamins, iron) should be discussed with Dr. Preethi Rao before starting. Probiotics are not harmful but have limited evidence of benefit in well-nourished infants.',
    },
  ],
};

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const calcDose = (weight, medKey) => {
  const drug = DRUGS[medKey];
  const dose = drug.mgkg ? Math.round(Math.min(drug.mgkg * weight, drug.max)) : drug.fixed;
  const ml = Math.round((dose / drug.suspConc) * drug.suspMl * 10) / 10;
  return {dose, ml, drug};
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

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const MedicinesTrackerScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState('dose');
  const [currentWeight, setCurrentWeight] = useState(27.4);
  const [currentMedKey, setCurrentMedKey] = useState('para');
  const [numpadVisible, setNumpadVisible] = useState(false);
  const [courseDays, setCourseDays] = useState([true, true, true, true, true, true, true]);
  const [selectedChild, setSelectedChild] = useState('aarav');
  const [selectedMed, setSelectedMed] = useState(null);
  const [selectedCourseLength, setSelectedCourseLength] = useState('7');

  const {dose, ml, drug} = calcDose(currentWeight, currentMedKey);

  const cycleMed = () => {
    const idx = DRUG_ORDER.indexOf(currentMedKey);
    setCurrentMedKey(DRUG_ORDER[(idx + 1) % DRUG_ORDER.length]);
  };

  const toggleCourseDay = (idx) => {
    setCourseDays(prev => prev.map((d, i) => i === idx ? !d : d));
  };

  const renderDoseTab = () => (
    <>
      {/* Big calculator card */}
      <View style={st.calcCard}>
        <AppText variant="subtext" color="rgba(255,255,255,0.55)" style={st.calcLabel}>Weight-based dose calculator</AppText>
        <View style={st.calcGrid}>
          <TouchableOpacity style={st.calcBox} activeOpacity={0.85} onPress={() => setNumpadVisible(true)}>
            <AppText variant="subtext" color="rgba(255,255,255,0.55)" style={st.calcBoxLbl}>Weight (kg)</AppText>
            <AppText variant="screenName" color={Colors.white} style={st.calcBoxVal}>{currentWeight}</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={st.calcBox} activeOpacity={0.85} onPress={cycleMed}>
            <AppText variant="subtext" color="rgba(255,255,255,0.55)" style={st.calcBoxLbl}>Medication</AppText>
            <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(16), marginTop: vs(6)}}>{drug.name}</AppText>
          </TouchableOpacity>
        </View>
        <View style={st.resultCard}>
          <AppText variant="screenName" color={Colors.white} style={st.resultBig}>{dose} mg</AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.7)" style={{textAlign: 'center', marginTop: vs(4)}}>
            = {ml} ml of {drug.suspConc}mg/{drug.suspMl}ml suspension
          </AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.5)" style={{textAlign: 'center', marginTop: vs(6), fontSize: ms(9), lineHeight: ms(13)}}>
            Range: {drug.mgkg ? `${drug.mgkg} mg/kg = ${dose} mg` : `${drug.fixed} mg fixed`} every {drug.freq} \u00b7 max {drug.maxDoses} doses/day \u00b7 max {drug.max === 1000 ? '1g' : `${drug.max}mg`} single dose
          </AppText>
        </View>
      </View>

      {/* Common meds */}
      <Section title="Common paediatric medications" />
      {COMMON_MEDS.map((m, i) => (
        <View key={i} style={st.card}>
          <View style={st.medHeader}>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{flex: 1}}>{m.name}</AppText>
            <View style={[st.doseTag, {backgroundColor: m.tagBg}]}>
              <AppText variant="subtext" color={m.tagColor} style={{fontWeight: '700', fontSize: ms(9)}}>{m.tagText}</AppText>
            </View>
          </View>
          <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(3)}}>{m.indic}</AppText>
          <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(6), lineHeight: ms(14)}}>{m.detail}</AppText>
          <View style={[st.medHighlight, {backgroundColor: m.hlBg, borderColor: m.hlBorder}]}>
            <AppText variant="subtext" color={m.hlColor} style={{lineHeight: ms(14)}}>{m.highlight}</AppText>
          </View>
        </View>
      ))}

      {/* Red insight */}
      <View style={[st.insight, {backgroundColor: Colors.redBg, borderColor: '#F6C9C8'}]}>
        <Icon family="Ionicons" name="warning-outline" size={ms(16)} color={Colors.redText} />
        <AppText variant="caption" color={Colors.redText} style={{flex: 1, lineHeight: ms(17)}}>
          <AppText style={{fontWeight: '700'}}>Never give aspirin to a child under 16 years.</AppText> Aspirin in children with viral illness causes Reye's syndrome - a rare but potentially fatal liver and brain condition. Paracetamol and ibuprofen are the only safe OTC fever medicines for children.
        </AppText>
      </View>
    </>
  );

  const renderCoursesTab = () => (
    <>
      {/* Green status */}
      <View style={[st.insight, {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen}]}>
        <Icon family="Ionicons" name="checkmark-circle-outline" size={ms(16)} color={Colors.tealText} />
        <AppText variant="caption" color={Colors.tealText} style={{flex: 1, lineHeight: ms(17)}}>
          No active medication courses. Both Aarav and Zara are off all prescribed medications. Last completed course: Amoxicillin 7-day course (Aarav, ear infection, Mar 2026).
        </AppText>
      </View>

      <Section title="Last completed course" />
      <View style={[st.card, {padding: 0, overflow: 'hidden'}]}>
        <View style={st.abxHeader}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>Amoxicillin 250mg suspension \u00b7 Aarav</AppText>
          <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(2)}}>Acute otitis media (ear infection) \u00b7 Dr. Preethi Rao \u00b7 Prescribed: 20 Mar 2026</AppText>
        </View>
        <View style={{padding: ms(12)}}>
          <AppText variant="subtext" color={Colors.textSecondary} style={{marginBottom: vs(8)}}>7-day course completion \u00b7 tap each day</AppText>
          <View style={st.dayRow}>
            {[1, 2, 3, 4, 5, 6, 7].map((d, i) => {
              const done = courseDays[i];
              return (
                <TouchableOpacity
                  key={d}
                  style={[st.dayBox, !done && st.dayBoxInactive]}
                  activeOpacity={0.7}
                  onPress={() => toggleCourseDay(i)}>
                  <AppText variant="subtext" color={done ? Colors.white : Colors.textSecondary} style={{fontWeight: '700'}}>{d}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={[st.inlineNote, {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen}]}>
            <AppText variant="subtext" color={Colors.tealText} style={{lineHeight: ms(14)}}>
              <AppText style={{fontWeight: '700'}}>\u2713 </AppText>Full 7-day course completed 26 Mar. Ear infection resolved. No side effects. Course completion prevents antibiotic resistance and treatment failure.
            </AppText>
          </View>
        </View>
      </View>

      <Section title="Add new prescription" />
      <View style={st.card}>
        <AppText variant="subtext" color={Colors.textSecondary} style={{marginBottom: vs(6)}}>For which child?</AppText>
        <View style={st.chipRow}>
          {CHILD_CHIPS.map((c) => {
            const active = selectedChild === c.key;
            return (
              <TouchableOpacity key={c.key} style={[st.chip, active && st.chipActive]} activeOpacity={0.7} onPress={() => setSelectedChild(c.key)}>
                <AppText variant="subtext" color={active ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{c.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(10), marginBottom: vs(6)}}>Medication</AppText>
        <View style={st.chipRow}>
          {MED_CHIPS.map((c) => {
            const active = selectedMed === c.key;
            return (
              <TouchableOpacity key={c.key} style={[st.chip, active && st.chipActive]} activeOpacity={0.7} onPress={() => setSelectedMed(c.key)}>
                <AppText variant="subtext" color={active ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{c.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(10), marginBottom: vs(6)}}>Course length</AppText>
        <View style={st.chipRow}>
          {COURSE_CHIPS.map((c) => {
            const active = selectedCourseLength === c.key;
            return (
              <TouchableOpacity key={c.key} style={[st.chip, active && st.chipActive]} activeOpacity={0.7} onPress={() => setSelectedCourseLength(c.key)}>
                <AppText variant="subtext" color={active ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{c.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Teal insight */}
      <View style={[st.insight, {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen}]}>
        <Icon family="Ionicons" name="shield-checkmark-outline" size={ms(16)} color={Colors.tealText} />
        <AppText variant="caption" color={Colors.tealText} style={{flex: 1, lineHeight: ms(17)}}>
          <AppText style={{fontWeight: '700'}}>Antibiotic resistance is a public health emergency in India.</AppText> India has one of the highest rates of antibiotic-resistant bacteria globally. Never give leftover antibiotics without a prescription, never stop a course early because the child 'seems better,' and never demand antibiotics for viral illnesses (cold, flu, most sore throats). TrustLife tracks courses to help identify over-prescribing patterns.
        </AppText>
      </View>
    </>
  );

  const renderAllergiesTab = () => (
    <>
      <View style={[st.insight, {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen}]}>
        <Icon family="Ionicons" name="checkmark-circle-outline" size={ms(16)} color={Colors.tealText} />
        <AppText variant="caption" color={Colors.tealText} style={{flex: 1, lineHeight: ms(17)}}>
          <AppText style={{fontWeight: '700'}}>\u2713 No medication allergies documented</AppText> for Aarav or Baby Zara. Update this section immediately if any reaction to a medicine is observed - this information is critical for safe prescribing in future.
        </AppText>
      </View>

      <Section title="Known medication allergies \u00b7 family" />
      <View style={st.card}>
        {ALLERGY_ROWS.map((a, i) => (
          <View key={i} style={[st.allergyRow, i === ALLERGY_ROWS.length - 1 && {borderBottomWidth: 0}]}>
            <View style={st.allergyAvatar}>
              <Icon family="Ionicons" name={a.icon} size={ms(18)} color={Colors.primary} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>{a.name}</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(14)}}>{a.sub}</AppText>
            </View>
            <View style={[st.badge, {backgroundColor: a.badgeBg}]}>
              <AppText variant="subtext" color={a.badgeColor} style={{fontWeight: '700', fontSize: ms(9)}}>{a.badge}</AppText>
            </View>
          </View>
        ))}
      </View>

      <Section title="Drug interactions \u00b7 Priya's medications" />
      <View style={[st.insight, {backgroundColor: Colors.amberBg, borderColor: '#FDDCB5'}]}>
        <Icon family="Ionicons" name="alert-circle-outline" size={ms(16)} color={Colors.amberDark} />
        <AppText variant="caption" color={Colors.amberDark} style={{flex: 1, lineHeight: ms(17)}}>
          <AppText style={{fontWeight: '700'}}>If prescribing antibiotics for Aarav:</AppText> Azithromycin prolongs QTc - relevant for Priya as she may be breastfeeding. This is low risk at paediatric doses. <AppText style={{fontWeight: '700'}}>Clarithromycin</AppText> is a CYP3A4 inhibitor that significantly interacts with Metformin and Olmesartan - prefer Azithromycin or Amoxicillin in this household and inform the prescriber of Priya's medications.
        </AppText>
      </View>

      <Section title="Safe medicine storage" />
      <View style={st.card}>
        {STORAGE_FLAGS.map((f, i) => (
          <View key={i} style={[st.flagRow, i === STORAGE_FLAGS.length - 1 && {borderBottomWidth: 0}]}>
            <Icon family="Ionicons" name={f.icon} size={ms(18)} color={Colors.primary} style={{marginTop: vs(2)}} />
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(12)}}>{f.title}</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(3), lineHeight: ms(14)}}>{f.sub}</AppText>
            </View>
          </View>
        ))}
      </View>
    </>
  );

  const renderAyuTab = () => (
    <>
      {/* Mini ayu header */}
      <View style={st.ayuHeader}>
        <AppText variant="subtext" color="rgba(255,255,255,0.55)" style={{textTransform: 'uppercase', letterSpacing: 0.5, fontSize: ms(9)}}>Ayu Intel \u00b7 Medicines</AppText>
        <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(4)}}>Medicines intelligence</AppText>
      </View>

      {[AYU_ABX, AYU_INFANT].map((card, ci) => (
        <View key={ci} style={[st.card, {marginTop: ci === 0 ? vs(10) : vs(8)}]}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>{card.title}</AppText>
          <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(2), marginBottom: vs(8)}}>{card.subtitle}</AppText>
          {card.rows.map((r, i) => (
            <View key={i} style={st.ayuRow}>
              <View style={[st.ayuDot, {backgroundColor: r.color}]} />
              <AppText variant="subtext" color={Colors.textSecondary} style={{flex: 1, lineHeight: ms(15)}}>
                <AppText style={{fontWeight: '700', color: Colors.textPrimary}}>{r.bold}</AppText>{r.text}
              </AppText>
            </View>
          ))}
        </View>
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
            <AppText variant="body" color="rgba(255,255,255,0.8)">Medicines tracker</AppText>
          </View>
          <View style={st.savePill}>
            <AppText variant="subtext" color={Colors.white} style={{fontWeight: '700'}}>Save</AppText>
            <Icon family="Ionicons" name="checkmark" size={ms(13)} color={Colors.white} style={{marginLeft: s(4)}} />
          </View>
        </View>

        <AppText variant="subtext" color="rgba(255,255,255,0.55)" style={{textTransform: 'uppercase', letterSpacing: 0.5, fontSize: ms(9), marginTop: vs(6)}}>Paediatric Medicines Tracker</AppText>
        <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(2)}}>Medicines tracker</AppText>
        <AppText variant="subtext" color="rgba(255,255,255,0.55)" style={{marginTop: vs(3), marginBottom: vs(10)}}>mg/kg calculator \u00b7 antibiotic course \u00b7 allergy check</AppText>

        {/* Tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.tabRow}>
          {TABS.map((t) => {
            const active = activeTab === t.key;
            return (
              <TouchableOpacity key={t.key} style={[st.tabPill, active && st.tabPillActive]} activeOpacity={0.8} onPress={() => setActiveTab(t.key)}>
                <AppText variant="subtext" color={active ? Colors.primary : Colors.white} style={{fontWeight: '700'}}>{t.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'dose' && renderDoseTab()}
        {activeTab === 'courses' && renderCoursesTab()}
        {activeTab === 'allergies' && renderAllergiesTab()}
        {activeTab === 'ayu' && renderAyuTab()}
        <View style={{height: vs(20)}} />
      </ScrollView>

      {/* ── Sticky bottom save ── */}
      <View style={[st.bottomBar, {paddingBottom: insets.bottom || vs(12)}]}>
        <TouchableOpacity style={st.saveBtn} activeOpacity={0.85}>
          <Icon family="Ionicons" name="save-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(8)}}>Save medicines log</AppText>
        </TouchableOpacity>
      </View>

      <NumpadModal
        visible={numpadVisible}
        title="Child weight (kg)"
        hint="Enter weight in kilograms"
        initialValue={String(currentWeight)}
        onClose={() => setNumpadVisible(false)}
        onConfirm={(v) => setCurrentWeight(v)}
      />
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  // Header
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(8)},
  topRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(8)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  savePill: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(14), backgroundColor: 'rgba(255,255,255,0.15)'},

  tabRow: {gap: s(8), paddingRight: s(8)},
  tabPill: {paddingHorizontal: s(12), paddingVertical: vs(7), borderRadius: ms(14), backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)'},
  tabPillActive: {backgroundColor: Colors.white, borderColor: Colors.white},

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(10)},

  // Calc card
  calcCard: {backgroundColor: Colors.primary, borderRadius: ms(18), padding: ms(14), marginBottom: vs(10)},
  calcLabel: {textTransform: 'uppercase', letterSpacing: 0.5, fontSize: ms(9), marginBottom: vs(10)},
  calcGrid: {flexDirection: 'row', gap: s(9), marginBottom: vs(10)},
  calcBox: {flex: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.18)', borderRadius: ms(12), padding: ms(12)},
  calcBoxLbl: {textTransform: 'uppercase', letterSpacing: 0.5, fontSize: ms(9)},
  calcBoxVal: {fontSize: ms(26), fontWeight: '800', marginTop: vs(4)},

  resultCard: {backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.18)', borderRadius: ms(12), padding: ms(14)},
  resultBig: {fontSize: ms(40), fontWeight: '800', textAlign: 'center'},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(12), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Card
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12), marginBottom: vs(8)},

  // Med row
  medHeader: {flexDirection: 'row', alignItems: 'flex-start', gap: s(8)},
  doseTag: {paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(8)},
  medHighlight: {marginTop: vs(8), borderRadius: ms(10), borderWidth: 1, padding: ms(9)},

  // Insight
  insight: {borderRadius: ms(11), borderWidth: 1, padding: ms(10), marginBottom: vs(8), flexDirection: 'row', alignItems: 'flex-start', gap: s(8)},

  // Courses
  abxHeader: {backgroundColor: '#F5FBFF', padding: ms(12), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5DDD3'},
  dayRow: {flexDirection: 'row', gap: s(6), marginBottom: vs(10)},
  dayBox: {width: ms(28), height: ms(28), borderRadius: ms(8), backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center'},
  dayBoxInactive: {backgroundColor: '#F5F5F5', borderWidth: 0.5, borderColor: '#E5DDD3'},
  inlineNote: {borderRadius: ms(10), borderWidth: 1, padding: ms(9)},

  // Chips
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6)},
  chip: {paddingHorizontal: s(11), paddingVertical: vs(6), borderRadius: ms(14), backgroundColor: '#F5F5F5', borderWidth: 0.5, borderColor: '#E5DDD3'},
  chipActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},

  // Allergies
  allergyRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(10), paddingVertical: vs(9), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F0F0F0'},
  allergyAvatar: {width: ms(36), height: ms(36), borderRadius: ms(12), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center'},
  badge: {paddingHorizontal: s(7), paddingVertical: vs(3), borderRadius: ms(8)},

  flagRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(10), paddingVertical: vs(9), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F0F0F0'},

  // Ayu
  ayuHeader: {backgroundColor: Colors.primary, marginHorizontal: s(-13), paddingHorizontal: s(16), paddingTop: vs(12), paddingBottom: vs(14), marginTop: vs(-10)},
  ayuRow: {flexDirection: 'row', gap: s(10), paddingVertical: vs(7)},
  ayuDot: {width: ms(8), height: ms(8), borderRadius: ms(4), marginTop: vs(5)},

  // Bottom save
  bottomBar: {backgroundColor: Colors.white, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5DDD3', paddingHorizontal: s(13), paddingTop: vs(10)},
  saveBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: ms(14), paddingVertical: vs(13)},
});

export default MedicinesTrackerScreen;
