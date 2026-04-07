import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput, Platform} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import DateTimePicker from '@react-native-community/datetimepicker';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const BORDER = '#c8dfc0';
const BG_LIGHT = '#f4f9f2';

const VACCINE_GROUPS = [
  {label: 'Due / Overdue for Aarav', items: ['Tdap booster (Diphtheria-Tetanus-acellular Pertussis)', 'Typhoid booster (TCV / Vi-PS)', 'Hepatitis A dose 2', 'HPV-9 (Gardasil 9) dose 1']},
  {label: 'Annual vaccines', items: ['Influenza (annual flu shot)', 'COVID-19 booster']},
  {label: 'Infant - Birth (0-4 weeks)', items: ['BCG (Tuberculosis)', 'OPV-0 (Oral Polio - birth dose)', 'Hepatitis B - birth dose']},
  {label: '9-18 months', items: ['MMR-1 (Measles-Mumps-Rubella)', 'Typhoid conjugate (TCV) primary', 'Hepatitis A dose 1', 'Varicella (Chickenpox) dose 1']},
  {label: 'Adult / lifetime vaccines', items: ['Tdap adult', 'Td booster (every 10 years)', 'Hepatitis B adult', 'HPV (Gardasil 9) adult female 27-45', 'Zoster (Shingrix)', 'Pneumococcal PPSV23 / PCV15', 'Meningococcal ACWY', 'Other / custom']},
];

const DOSE_PILLS = [
  {label: '1', status: 'done'}, {label: '2', status: 'done'}, {label: '3', status: 'active'},
  {label: '4', status: 'inactive'}, {label: 'B1', status: 'inactive'}, {label: 'B2', status: 'inactive'},
  {label: 'Annual', status: 'inactive', wide: true},
];

const ROUTES = [
  {label: 'IM (intramuscular)', icon: 'fitness-outline'},
  {label: 'SC (subcutaneous)', icon: 'ellipse-outline'},
  {label: 'ID (intradermal)', icon: 'water-outline'},
  {label: 'Oral', icon: 'water-outline'},
  {label: 'Intranasal', icon: 'cloud-outline'},
];

const SITES = [
  {name: 'R. deltoid\n(upper arm)', icon: 'body-outline'},
  {name: 'L. deltoid\n(upper arm)', icon: 'body-outline'},
  {name: 'R. anterolateral\nthigh', icon: 'body-outline'},
  {name: 'L. anterolateral\nthigh', icon: 'body-outline'},
  {name: 'R. upper arm\n(SC/ID)', icon: 'body-outline'},
  {name: 'L. upper arm\n(SC/ID)', icon: 'body-outline'},
  {name: 'Oral\ndrops', icon: 'water-outline'},
  {name: 'Intranasal\nspray', icon: 'cloud-outline'},
];

const BATCH_FIELDS = [
  {label: 'Vaccine lot / batch number', value: 'BN2024-A882K'},
  {label: 'Manufacturer', value: 'Serum Inst. India'},
  {label: 'Expiry date', value: 'Dec 2026'},
  {label: 'VVM status (cold chain indicator)', value: 'Stage 1 - OK'},
  {label: 'Storage temp (C) at time of use', value: '4C'},
  {label: 'Vaccine vial open time', value: 'New vial'},
];

const CHECKLIST = [
  {text: 'No severe allergic reaction to this vaccine or its components in the past', sub: 'Anaphylaxis to previous dose = absolute contraindication. Allergy to egg proteins: check with provider for influenza vaccines.', ok: true},
  {text: 'Not currently immunocompromised (for live vaccines: MMR, Varicella, OPV, BCG, Yellow Fever)', sub: 'HIV with CD4 <200, active chemotherapy, high-dose steroids = contraindication for live vaccines.', ok: true},
  {text: 'Not currently unwell with moderate-to-severe febrile illness', sub: 'Minor illness (cold, mild fever <38C) = NOT a contraindication. Defer if temperature >38.5C.', ok: true},
  {text: 'Not pregnant (for live vaccines: Varicella, MMR, Yellow Fever, LAIV)', sub: 'Inactivated vaccines (flu, Tdap, COVID) are safe and recommended in pregnancy.', ok: true},
  {text: 'No prior AEFI grade 3-4 (severe adverse event) with this vaccine', sub: 'Encephalitis, convulsions, anaphylaxis, abscess. Do not re-administer without specialist review.', ok: true},
  {text: 'Correct minimum interval maintained from previous dose', sub: 'Most vaccines require minimum 4-week intervals between doses of the same antigen.', ok: true},
  {text: 'Check: recent blood products / immunoglobulin (affects live vaccine timing)', sub: 'Blood products / IVIG can suppress immune response to live vaccines. Defer 3-11 months after IVIG.', ok: false},
  {text: 'Anticoagulants / bleeding disorder check (for IM vaccines)', sub: 'Warfarin, heparin, or bleeding disorders: IM injections carry haematoma risk. Use fine gauge needle.', ok: true},
];

const Section = ({title, sub}) => (
  <View style={{flexDirection: 'row', alignItems: 'center', marginTop: vs(16), marginBottom: vs(8)}}>
    <AppText variant="subtext" color="#888" style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginRight: s(7)}}>{title}</AppText>
    {sub && <AppText variant="subtext" color="#aaa" style={{fontWeight: '400', marginRight: s(7)}}>{sub}</AppText>}
    <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: BORDER}} />
  </View>
);

const FieldLabel = ({label, required}) => (
  <View style={{flexDirection: 'row', alignItems: 'center', gap: s(5), marginBottom: vs(5)}}>
    <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>{label}</AppText>
    {required && <AppText variant="small" color={Colors.red}>*</AppText>}
  </View>
);

const VaccLogView = () => {
  const [member, setMember] = useState('Aarav');
  const [vaccine, setVaccine] = useState('');
  const [showVaccList, setShowVaccList] = useState(false);
  const [activeDose, setActiveDose] = useState(2);
  const [activeRoute, setActiveRoute] = useState(0);
  const [activeSite, setActiveSite] = useState(0);
  const [activeObs, setActiveObs] = useState(0);
  const [activeConsent, setActiveConsent] = useState(0);
  const [notes, setNotes] = useState('');
  const [date, setDate] = useState(new Date(2026, 2, 24, 10, 30));
  const [showDate, setShowDate] = useState(false);
  const [showTime, setShowTime] = useState(false);

  const fmtDate = (d) => {
    const months = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
    return `${d.getDate()} ${months[d.getMonth()]} ${d.getFullYear()}`;
  };
  const fmtTime = (d) => {
    let h = d.getHours(); const m = d.getMinutes().toString().padStart(2, '0');
    const ap = h >= 12 ? 'PM' : 'AM'; h = h % 12 || 12;
    return `${h}:${m} ${ap}`;
  };

  return (
    <View style={{paddingVertical: vs(6)}}>

      <Section title="Log a vaccine dose" />

      {/* FOR WHOM */}
      <View style={st.field}>
        <FieldLabel label="For whom" required />
        <View style={st.chipRow}>
          {['Priya', 'Aarav', 'Raj'].map(n => (
            <TouchableOpacity key={n} style={[st.chip, member === n && st.chipOn]} onPress={() => setMember(n)} activeOpacity={0.7}>
              <Icon family="Ionicons" name="person-outline" size={ms(12)} color={member === n ? Colors.white : Colors.textSecondary} />
              <AppText variant="caption" color={member === n ? Colors.white : Colors.textSecondary} style={{fontWeight: member === n ? '700' : '500'}}>{n}</AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* VACCINE NAME - Dropdown */}
      <View style={st.field}>
        <FieldLabel label="Vaccine name" required />
        <TouchableOpacity style={st.selectBox} onPress={() => setShowVaccList(!showVaccList)} activeOpacity={0.7}>
          <AppText variant="caption" color={vaccine ? Colors.textPrimary : '#bbb'} style={{flex: 1, fontWeight: vaccine ? '500' : '400'}}>
            {vaccine || 'Select vaccine...'}
          </AppText>
          <Icon family="Ionicons" name={showVaccList ? 'chevron-up' : 'chevron-down'} size={ms(16)} color={Colors.textTertiary} />
        </TouchableOpacity>
        {showVaccList && (
          <View style={st.dropdownCard}>
            {VACCINE_GROUPS.map((group, gi) => (
              <View key={gi}>
                <View style={st.dropGroupHdr}>
                  <AppText variant="subtext" color={Colors.primary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4}}>{group.label}</AppText>
                </View>
                {group.items.map((item, ii) => (
                  <TouchableOpacity key={ii} style={[st.dropItem, vaccine === item && {backgroundColor: Colors.tealBg}]} onPress={() => { setVaccine(item); setShowVaccList(false); }} activeOpacity={0.7}>
                    <AppText variant="caption" color={vaccine === item ? Colors.primary : Colors.textPrimary}>{item}</AppText>
                  </TouchableOpacity>
                ))}
              </View>
            ))}
          </View>
        )}
      </View>

      {/* DATE & TIME */}
      <View style={st.field}>
        <View style={{flexDirection: 'row', gap: s(8)}}>
          <View style={{flex: 1}}>
            <FieldLabel label="Date given" required />
            <TouchableOpacity style={st.inputField} onPress={() => setShowDate(true)} activeOpacity={0.7}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{fmtDate(date)}</AppText>
              <Icon family="Ionicons" name="chevron-forward" size={ms(14)} color="#bbb" />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            <FieldLabel label="Time given" />
            <TouchableOpacity style={st.inputField} onPress={() => setShowTime(true)} activeOpacity={0.7}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{fmtTime(date)}</AppText>
              <Icon family="Ionicons" name="chevron-forward" size={ms(14)} color="#bbb" />
            </TouchableOpacity>
          </View>
        </View>
        {showDate && <DateTimePicker value={date} mode="date" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(e, d) => { setShowDate(false); if (d) setDate(prev => { const n = new Date(prev); n.setFullYear(d.getFullYear(), d.getMonth(), d.getDate()); return n; }); }} />}
        {showTime && <DateTimePicker value={date} mode="time" display={Platform.OS === 'ios' ? 'spinner' : 'default'} onChange={(e, d) => { setShowTime(false); if (d) setDate(prev => { const n = new Date(prev); n.setHours(d.getHours(), d.getMinutes()); return n; }); }} />}
      </View>

      {/* DOSE NUMBER */}
      <View style={st.field}>
        <FieldLabel label="Dose number" required />
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: ms(6)}}>
          {DOSE_PILLS.map((d, i) => {
            const done = d.status === 'done';
            const active = i === activeDose;
            return (
              <TouchableOpacity key={i} style={[st.dosePill, done && st.doseDone, active && st.doseActive, d.wide && {width: ms(42), borderRadius: ms(8)}]} onPress={() => !done && setActiveDose(i)} activeOpacity={0.7}>
                <AppText variant="caption" color={done || active ? Colors.white : '#888'} style={{fontWeight: '700', fontSize: d.wide ? ms(9) : ms(11)}}>{d.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ROUTE */}
      <View style={st.field}>
        <FieldLabel label="Route of administration" required />
        <View style={st.chipRow}>
          {ROUTES.map((r, i) => (
            <TouchableOpacity key={i} style={[st.routeChip, activeRoute === i && st.routeChipOn]} onPress={() => setActiveRoute(i)} activeOpacity={0.7}>
              <AppText variant="caption" color={activeRoute === i ? Colors.white : Colors.textSecondary} style={{fontWeight: activeRoute === i ? '700' : '500'}}>{r.label}</AppText>
            </TouchableOpacity>
          ))}
        </View>
        <AppText variant="subtext" color="#888" style={{marginTop: vs(5), lineHeight: ms(14)}}>
          IM: most inactivated vaccines - SC: live vaccines (MMR, Varicella, Yellow Fever) - ID: BCG - Oral: OPV, Rotavirus - Intranasal: LAIV
        </AppText>
      </View>

      {/* INJECTION SITE */}
      <View style={st.field}>
        <FieldLabel label="Injection site" />
        <View style={st.siteGrid}>
          {SITES.map((site, i) => (
            <TouchableOpacity key={i} style={[st.siteOpt, activeSite === i && st.siteOptOn]} onPress={() => setActiveSite(i)} activeOpacity={0.7}>
              <Icon family="Ionicons" name={site.icon} size={ms(16)} color={activeSite === i ? Colors.primary : Colors.textTertiary} style={{marginBottom: vs(3)}} />
              <AppText variant="subtext" color={activeSite === i ? Colors.primary : Colors.textPrimary} style={{fontWeight: '600', textAlign: 'center', lineHeight: ms(12)}}>{site.name}</AppText>
            </TouchableOpacity>
          ))}
        </View>
        <AppText variant="subtext" color="#888" style={{marginTop: vs(5), lineHeight: ms(14)}}>
          Anterolateral thigh preferred for infants 12 months or less - Deltoid preferred for children over 12 months and adults - Never inject into buttock
        </AppText>
      </View>

      {/* DOSE AMOUNT */}
      <View style={st.field}>
        <FieldLabel label="Dose amount" />
        <View style={{flexDirection: 'row', gap: s(6)}}>
          <View style={{flex: 1}}>
            <AppText variant="subtext" color="#888" style={{marginBottom: vs(4)}}>Volume (mL)</AppText>
            <TextInput style={st.inputField} value="0.5" keyboardType="numeric" />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="subtext" color="#888" style={{marginBottom: vs(4)}}>Standard dose</AppText>
            <View style={[st.inputField, {backgroundColor: BG_LIGHT}]}>
              <AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600'}}>0.5 mL</AppText>
            </View>
          </View>
          <View style={{flex: 1}}>
            <AppText variant="subtext" color="#888" style={{marginBottom: vs(4)}}>Fractional?</AppText>
            <View style={st.inputField}>
              <AppText variant="caption" color={Colors.textPrimary}>Full dose</AppText>
            </View>
          </View>
        </View>
      </View>

      {/* COLD CHAIN & BATCH */}
      <View style={st.ccCard}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(6)}}>
          <Icon family="Ionicons" name="snow-outline" size={ms(14)} color={Colors.tealText} />
          <AppText variant="caption" color={Colors.tealText} style={{fontWeight: '700', flex: 1}}>Cold chain & batch details</AppText>
          <AppText variant="subtext" color={Colors.tealText}>Important for AEFI reporting</AppText>
        </View>
        <View style={st.ccGrid}>
          {BATCH_FIELDS.map((f, i) => (
            <View key={i} style={st.ccField}>
              <AppText variant="subtext" color={Colors.tealText} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(3), fontSize: ms(8)}}>{f.label}</AppText>
              <AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600'}}>{f.value}</AppText>
            </View>
          ))}
        </View>
        <AppText variant="subtext" color={Colors.tealText} style={{marginTop: vs(7), lineHeight: ms(14)}}>
          VVM = Vaccine Vial Monitor - A heat-sensitive indicator on the vaccine vial. Discard if inner square is as dark as or darker than the outer ring.
        </AppText>
      </View>

      {/* PROVIDER */}
      <View style={st.field}>
        <View style={{flexDirection: 'row', gap: s(8)}}>
          <View style={{flex: 1}}>
            <FieldLabel label="Healthcare provider / vaccinator" />
            <TextInput style={st.inputField} value="Dr. Srinivas Kumar" />
          </View>
          <View style={{flex: 1}}>
            <FieldLabel label="Facility / location" />
            <TextInput style={st.inputField} value="Ankura Hospital, Hyd" />
          </View>
        </View>
      </View>

      {/* OBSERVATION */}
      <View style={st.field}>
        <FieldLabel label="Post-vaccination observation period" />
        <View style={st.chipRow}>
          {['15 min observed', '30 min observed', 'Left early', 'At home vaccination'].map((o, i) => (
            <TouchableOpacity key={i} style={[st.chip, activeObs === i && st.chipOn]} onPress={() => setActiveObs(i)} activeOpacity={0.7}>
              <AppText variant="caption" color={activeObs === i ? Colors.white : Colors.textSecondary} style={{fontWeight: activeObs === i ? '700' : '500'}}>{o}</AppText>
            </TouchableOpacity>
          ))}
        </View>
        <AppText variant="subtext" color="#888" style={{marginTop: vs(5), lineHeight: ms(14)}}>
          A minimum 15-min observation period after vaccination is mandatory to detect immediate AEFI. High-risk individuals: 30 minutes.
        </AppText>
      </View>

      {/* CONTRAINDICATION SCREENING */}
      <Section title="Contraindication screening" sub="- Complete before giving any vaccine - Check all" />
      <View style={st.card}>
        <View style={{backgroundColor: BG_LIGHT, padding: ms(8), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#e8f3e4'}}>
          <AppText variant="small" color={Colors.primary} style={{lineHeight: ms(15)}}>Confirm all items are clear before administration. Flag any concern with the vaccinating provider.</AppText>
        </View>
        {CHECKLIST.map((item, i) => (
          <View key={i} style={[st.contraRow, i < CHECKLIST.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: '#e8f3e4'}]}>
            <View style={[st.crCheck, item.ok ? {backgroundColor: Colors.tealBg, borderColor: Colors.accent} : {backgroundColor: Colors.redBg, borderColor: Colors.red}]}>
              <Icon family="Ionicons" name={item.ok ? 'checkmark' : 'warning-outline'} size={ms(12)} color={item.ok ? Colors.tealText : Colors.red} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="caption" color={item.ok ? Colors.textPrimary : Colors.red} style={{fontWeight: '600', lineHeight: ms(16)}}>{item.text}</AppText>
              <AppText variant="subtext" color="#888" style={{marginTop: vs(2), lineHeight: ms(13)}}>{item.sub}</AppText>
            </View>
          </View>
        ))}
      </View>

      {/* CO-ADMINISTRATION */}
      <View style={[st.field, {marginTop: vs(12)}]}>
        <FieldLabel label="Co-administration with other vaccines today" />
        <View style={st.chipRow}>
          {['No other vaccines today', 'Influenza', 'COVID-19', 'Pneumococcal', 'Typhoid'].map((c, i) => (
            <TouchableOpacity key={i} style={[st.tagChip, i === 0 && st.tagChipOn]} activeOpacity={0.7}>
              <AppText variant="small" color={i === 0 ? Colors.tealText : Colors.textSecondary} style={{fontWeight: i === 0 ? '700' : '500'}}>{c}</AppText>
            </TouchableOpacity>
          ))}
        </View>
        <AppText variant="subtext" color="#888" style={{marginTop: vs(5), lineHeight: ms(14)}}>
          Most vaccines can be given simultaneously at different sites. Live viral vaccines: give simultaneously OR at least 4 weeks apart.
        </AppText>
      </View>

      {/* CONSENT */}
      <View style={st.field}>
        <FieldLabel label="Consent" />
        <View style={st.chipRow}>
          {['Verbal consent given', 'Written consent signed', 'Parent/guardian consent (minor)'].map((c, i) => (
            <TouchableOpacity key={i} style={[st.chip, activeConsent === i && st.chipOn]} onPress={() => setActiveConsent(i)} activeOpacity={0.7}>
              <AppText variant="caption" color={activeConsent === i ? Colors.white : Colors.textSecondary} style={{fontWeight: activeConsent === i ? '700' : '500'}}>{c}</AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* NEXT DOSE */}
      <View style={st.field}>
        <FieldLabel label="Next dose / booster due" />
        <View style={{flexDirection: 'row', gap: s(8)}}>
          <View style={{flex: 1}}>
            <AppText variant="subtext" color="#888" style={{marginBottom: vs(4)}}>Due date</AppText>
            <TouchableOpacity style={st.inputField} activeOpacity={0.7}>
              <AppText variant="caption" color="#bbb">Select date</AppText>
              <Icon family="Ionicons" name="chevron-forward" size={ms(14)} color="#bbb" />
            </TouchableOpacity>
          </View>
          <View style={{flex: 1}}>
            <AppText variant="subtext" color="#888" style={{marginBottom: vs(4)}}>Interval</AppText>
            <TouchableOpacity style={st.inputField} activeOpacity={0.7}>
              <AppText variant="caption" color="#bbb">Select...</AppText>
              <Icon family="Ionicons" name="chevron-forward" size={ms(14)} color="#bbb" />
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* NOTES */}
      <View style={st.field}>
        <FieldLabel label="Notes" />
        <TextInput style={st.noteArea} placeholder="e.g. 'Child was cooperative, slight redness at site', 'Waited 15 min - no immediate reaction'..." placeholderTextColor="#bbb" multiline textAlignVertical="top" value={notes} onChangeText={setNotes} />
      </View>

      {/* COLD CHAIN REMINDER */}
      <View style={[st.insightCard, {backgroundColor: Colors.amberBg}]}>
        <Icon family="Ionicons" name="snow-outline" size={ms(14)} color={Colors.amberDark} />
        <AppText variant="caption" color={Colors.amberDark} style={{flex: 1, lineHeight: ms(17)}}>
          <AppText style={{fontWeight: '700'}}>Cold chain reminder.</AppText> Vaccines must be stored at 2-8C. Check the VVM indicator before use. If exposed to freezing (DPT, HepB, IPV): do NOT use - shaking test required. Always check expiry date AND VVM before administration.
        </AppText>
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  field: {marginBottom: vs(12)},
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(6)},
  chip: {paddingHorizontal: s(12), paddingVertical: vs(7), borderRadius: ms(22), borderWidth: 0.5, borderColor: BORDER, backgroundColor: Colors.white, flexDirection: 'row', alignItems: 'center', gap: s(5)},
  chipOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  routeChip: {paddingHorizontal: s(12), paddingVertical: vs(7), borderRadius: ms(22), borderWidth: 0.5, borderColor: BORDER, backgroundColor: BG_LIGHT},
  routeChipOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  tagChip: {paddingHorizontal: s(11), paddingVertical: vs(6), borderRadius: ms(22), borderWidth: 0.5, borderColor: BORDER, backgroundColor: Colors.white},
  tagChipOn: {backgroundColor: Colors.tealBg, borderColor: '#78c264'},
  selectBox: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, borderWidth: 0.5, borderColor: BORDER, borderRadius: ms(10), paddingHorizontal: s(12), paddingVertical: vs(10)},
  dropdownCard: {backgroundColor: Colors.white, borderWidth: 0.5, borderColor: BORDER, borderRadius: ms(10), marginTop: vs(4), overflow: 'hidden'},
  dropGroupHdr: {backgroundColor: BG_LIGHT, paddingHorizontal: s(12), paddingVertical: vs(6), borderBottomWidth: 0.5, borderBottomColor: '#e8f3e4'},
  dropItem: {paddingHorizontal: s(12), paddingVertical: vs(9), borderBottomWidth: 0.5, borderBottomColor: '#e8f3e4'},
  inputField: {backgroundColor: Colors.white, borderWidth: 0.5, borderColor: BORDER, borderRadius: ms(10), paddingHorizontal: s(12), paddingVertical: vs(10), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', fontSize: ms(12), color: Colors.textPrimary, fontFamily: undefined},
  dosePill: {width: ms(36), height: ms(36), borderRadius: ms(18), borderWidth: 0.5, borderColor: BORDER, backgroundColor: BG_LIGHT, alignItems: 'center', justifyContent: 'center'},
  doseDone: {backgroundColor: Colors.accent, borderColor: Colors.accent},
  doseActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  siteGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(6)},
  siteOpt: {width: '23.5%', borderRadius: ms(10), paddingVertical: vs(9), paddingHorizontal: s(4), borderWidth: 0.5, borderColor: BORDER, backgroundColor: BG_LIGHT, alignItems: 'center'},
  siteOptOn: {backgroundColor: Colors.tealBg, borderColor: Colors.primary},
  ccCard: {backgroundColor: Colors.tealBg, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#9FE1CB', padding: ms(11), marginBottom: vs(12)},
  ccGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(6)},
  ccField: {width: '48.5%', backgroundColor: Colors.white, borderRadius: ms(8), padding: ms(8), borderWidth: 0.5, borderColor: '#9FE1CB'},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: BORDER, overflow: 'hidden', marginBottom: vs(10)},
  contraRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(10), paddingVertical: vs(9), paddingHorizontal: s(13)},
  crCheck: {width: ms(22), height: ms(22), borderRadius: ms(6), borderWidth: 0.5, alignItems: 'center', justifyContent: 'center', marginTop: vs(1)},
  noteArea: {backgroundColor: Colors.white, borderWidth: 0.5, borderColor: BORDER, borderRadius: ms(11), padding: ms(10), minHeight: vs(60), fontSize: ms(12), color: Colors.textPrimary, lineHeight: ms(18)},
  insightCard: {borderRadius: ms(11), padding: ms(10), flexDirection: 'row', gap: s(8), marginBottom: vs(10)},
});

export default VaccLogView;
