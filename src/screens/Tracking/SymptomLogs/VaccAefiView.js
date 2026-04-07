import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, ScrollView} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const BORDER = '#c8dfc0';
const BG_LIGHT = '#f4f9f2';

const LOCAL_REACTIONS = [
  {id: 'pain', name: 'Pain / soreness at site', sub: 'Most common local reaction - expected, not reportable unless severe', icon: 'pulse-outline', iconBg: '#FFF7EE', opts: ['Mild', 'Mod', 'Sev', 'None'], def: 'Mild'},
  {id: 'redness', name: 'Redness (erythema) at site', sub: 'Expected up to 48h - Report if >2.5cm or persisting beyond 72h', icon: 'ellipse-outline', iconBg: '#FEF0F6', opts: ['Mild', 'Mod', 'Sev', 'None'], def: 'None'},
  {id: 'swelling', name: 'Swelling at site', sub: 'Expected up to 48-72h - Report if >2.5cm or extending to joint', icon: 'water-outline', iconBg: '#E8F4FD', opts: ['Mild', 'Mod', 'Sev', 'None'], def: 'None'},
  {id: 'abscess', name: 'Abscess at injection site', sub: 'Requires medical review - suggests contamination or poor injection technique. Report to NVBDCP.', icon: 'flame-outline', iconBg: '#FFF7EE', opts: ['Present', 'None'], def: 'None'},
];

const SYSTEMIC_REACTIONS = [
  {id: 'fever', name: 'Fever', sub: 'Low-grade <=38.5C expected (1-3 days). Report if >40C or persisting >3 days', icon: 'thermometer-outline', iconBg: '#FFF7EE', opts: ['Mild', 'Mod', 'Sev', 'None'], def: 'Mild'},
  {id: 'irritability', name: 'Irritability / crying (infants)', sub: 'Persistent inconsolable crying >3h - report as AEFI grade 2', icon: 'moon-outline', iconBg: '#f5f5f5', opts: ['Mild', 'Mod', 'Sev', 'None'], def: 'None'},
  {id: 'nausea', name: 'Nausea / vomiting', sub: 'Mild nausea common with oral vaccines. Persistent vomiting: assess for hypersensitivity', icon: 'medical-outline', iconBg: '#FFF7EE', opts: ['Mild', 'Mod', 'Sev', 'None'], def: 'None'},
  {id: 'convulsion', name: 'Febrile convulsion', sub: 'GRADE 3 - REPORT IMMEDIATELY to NVBDCP - Seek emergency care - Do not readminister without specialist clearance', icon: 'flash-outline', iconBg: '#FCEBEB', opts: ['Present', 'None'], def: 'None'},
];

const SERIOUS_REACTIONS = [
  {id: 'anaphylaxis', name: 'Anaphylaxis', sub: 'Within minutes: urticaria + hypotension + bronchospasm - EMERGENCY - Adrenaline 0.01mg/kg IM immediately - Call 108', icon: 'alert-circle-outline', iconBg: '#FEF0F0', opts: ['Present', 'None'], def: 'None'},
  {id: 'encephalitis', name: 'Encephalitis / encephalopathy', sub: 'GRADE 4 - Altered consciousness, seizures within 7 days - Report to NVBDCP + seek emergency care', icon: 'body-outline', iconBg: '#FEF0F0', opts: ['Present', 'None'], def: 'None'},
  {id: 'lymphadenitis', name: 'Lymphadenitis (BCG-specific)', sub: 'Enlarged lymph nodes in axilla ipsilateral to BCG site - AEFI specific to BCG. Report if suppurative.', icon: 'fitness-outline', iconBg: '#FEF0F0', opts: ['Present', 'None'], def: 'None'},
];

const TIMING_OPTIONS = ['Within 15 min', '15 min - 2 hours', 'Same day (2-24h)', 'Day 1-3', 'Day 4-7', 'Day 8-14', '>14 days'];
const RESOLUTION_OPTIONS = ['Resolved on its own', 'Treated with paracetamol', 'Doctor visit needed', 'Emergency treatment', 'Hospitalised', 'Ongoing'];

const VACCINE_OPTIONS = ['Tdap booster (Aarav) - today', 'Influenza 2025 (Aarav) - Oct 2025', 'Varicella-2 (Aarav) - Mar 2022', 'COVID Booster (Priya) - Jan 2024', 'Other / specify'];

const Section = ({title, sub}) => (
  <View style={{flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)}}>
    <AppText variant="subtext" color="#888" style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginRight: s(4)}}>{title}</AppText>
    {sub && <AppText variant="subtext" color="#aaa" style={{fontWeight: '400', marginRight: s(4)}}>{sub}</AppText>}
    <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: BORDER}} />
  </View>
);

const SevBtn = ({label, active, onPress, isSerious}) => (
  <TouchableOpacity
    activeOpacity={0.7} onPress={onPress}
    style={[st.sevBtn, active && (isSerious ? st.sevBtnSev : st.sevBtnOn)]}>
    <AppText variant="subtext" color={active ? Colors.white : '#888'} style={{fontWeight: active ? '700' : '600'}}>{label}</AppText>
  </TouchableOpacity>
);

const ReactionRow = ({item, severity, onSelect, isSerious, isLast}) => (
  <View style={[st.aefiRow, !isLast && {borderBottomWidth: 0.5, borderBottomColor: '#e8f3e4'}]}>
    <View style={[st.aefiIcon, {backgroundColor: item.iconBg}]}>
      <Icon family="Ionicons" name={item.icon} size={ms(14)} color={isSerious ? Colors.redDark : Colors.textSecondary} />
    </View>
    <View style={{flex: 1}}>
      <AppText variant="bodyBold" color={Colors.textPrimary}>{item.name}</AppText>
      <AppText variant="subtext" color="#888" style={{marginTop: vs(1), lineHeight: ms(13)}}>{item.sub}</AppText>
    </View>
    <View style={{flexDirection: 'row', gap: s(4)}}>
      {item.opts.map(opt => (
        <SevBtn key={opt} label={opt} active={severity === opt} onPress={() => onSelect(item.id, opt)} isSerious={isSerious} />
      ))}
    </View>
  </View>
);

const VaccAefiView = () => {
  const [severities, setSeverities] = useState(() => {
    const init = {};
    [...LOCAL_REACTIONS, ...SYSTEMIC_REACTIONS, ...SERIOUS_REACTIONS].forEach(r => { init[r.id] = r.def; });
    return init;
  });
  const [timing, setTiming] = useState('Same day (2-24h)');
  const [resolution, setResolution] = useState('Resolved on its own');
  const [selVacc, setSelVacc] = useState(0);
  const [showVaccDrop, setShowVaccDrop] = useState(false);

  const handleSelect = (id, val) => setSeverities(prev => ({...prev, [id]: val}));

  return (
    <View style={{flex: 1}}>

      <Section title="AEFI log" sub="- Adverse Events Following Immunization" />

      {/* Info card */}
      <View style={[st.insightCard, {backgroundColor: Colors.blueBg}]}>
        <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={Colors.blueText} />
        <AppText variant="caption" color={Colors.blueText} style={{flex: 1, lineHeight: ms(17)}}>
          <AppText style={{fontWeight: '700'}}>What is AEFI?</AppText> Any untoward medical occurrence following vaccination, whether or not causally related to the vaccine. WHO grades: Grade 1 (mild - no treatment), Grade 2 (moderate - outpatient treatment), Grade 3 (severe - hospitalisation), Grade 4 (life-threatening). Serious AEFI must be reported to India's NVBDCP / CDSCO within 24-48 hours.
        </AppText>
      </View>

      {/* Vaccine selector */}
      <Section title="Log reactions for last vaccine" />
      <View style={st.card}>
        {/* Header */}
        <View style={st.cardHdr}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>After which vaccine?</AppText>
        </View>
        {/* Dropdown */}
        <View style={{paddingHorizontal: s(13), paddingVertical: vs(10), borderBottomWidth: 0.5, borderBottomColor: '#e8f3e4'}}>
          <TouchableOpacity style={st.selectBox} onPress={() => setShowVaccDrop(!showVaccDrop)} activeOpacity={0.7}>
            <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1}}>{VACCINE_OPTIONS[selVacc]}</AppText>
            <Icon family="Ionicons" name={showVaccDrop ? 'chevron-up' : 'chevron-down'} size={ms(16)} color={Colors.textTertiary} />
          </TouchableOpacity>
          {showVaccDrop && (
            <View style={{marginTop: vs(4)}}>
              {VACCINE_OPTIONS.map((v, i) => (
                <TouchableOpacity key={i} style={[st.dropItem, selVacc === i && {backgroundColor: Colors.tealBg}]} onPress={() => { setSelVacc(i); setShowVaccDrop(false); }} activeOpacity={0.7}>
                  <AppText variant="caption" color={selVacc === i ? Colors.primary : Colors.textPrimary}>{v}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Local reactions header */}
        <View style={[st.sectionBanner, {backgroundColor: BG_LIGHT}]}>
          <AppText variant="subtext" color={Colors.primary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4}}>Local reactions (at injection site) - Rate severity</AppText>
        </View>
        {LOCAL_REACTIONS.map((item, i) => (
          <ReactionRow key={item.id} item={item} severity={severities[item.id]} onSelect={handleSelect} isLast={i === LOCAL_REACTIONS.length - 1} />
        ))}

        {/* Systemic reactions header */}
        <View style={[st.sectionBanner, {backgroundColor: BG_LIGHT, borderTopWidth: 0.5, borderTopColor: '#e8f3e4'}]}>
          <AppText variant="subtext" color={Colors.primary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4}}>Systemic reactions - Rate severity</AppText>
        </View>
        {SYSTEMIC_REACTIONS.map((item, i) => (
          <ReactionRow key={item.id} item={item} severity={severities[item.id]} onSelect={handleSelect} isLast={i === SYSTEMIC_REACTIONS.length - 1} />
        ))}

        {/* Serious AEFI header */}
        <View style={[st.sectionBanner, {backgroundColor: Colors.redBg, borderTopWidth: 0.5, borderTopColor: '#e8f3e4'}]}>
          <AppText variant="subtext" color={Colors.redDark} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4}}>Serious AEFI - Report immediately to NVBDCP + seek emergency care</AppText>
        </View>
        {SERIOUS_REACTIONS.map((item, i) => (
          <ReactionRow key={item.id} item={item} severity={severities[item.id]} onSelect={handleSelect} isSerious isLast={i === SERIOUS_REACTIONS.length - 1} />
        ))}
      </View>

      {/* Timing */}
      <View style={{marginTop: vs(12)}}>
        <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700', marginBottom: vs(5)}}>When did reactions start?</AppText>
        <View style={st.chipWrap}>
          {TIMING_OPTIONS.map(opt => (
            <TouchableOpacity key={opt} style={[st.chip, timing === opt && st.chipOn]} onPress={() => setTiming(opt)} activeOpacity={0.7}>
              <AppText variant="caption" color={timing === opt ? Colors.white : Colors.textSecondary} style={{fontWeight: timing === opt ? '700' : '500'}}>{opt}</AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Resolution */}
      <View style={{marginTop: vs(12)}}>
        <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700', marginBottom: vs(5)}}>Resolution</AppText>
        <View style={st.chipWrap}>
          {RESOLUTION_OPTIONS.map(opt => (
            <TouchableOpacity key={opt} style={[st.chip, resolution === opt && st.chipOn]} onPress={() => setResolution(opt)} activeOpacity={0.7}>
              <AppText variant="caption" color={resolution === opt ? Colors.white : Colors.textSecondary} style={{fontWeight: resolution === opt ? '700' : '500'}}>{opt}</AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Report button */}
      <TouchableOpacity activeOpacity={0.7} style={st.reportBtn}>
        <Icon family="Ionicons" name="warning-outline" size={ms(18)} color={Colors.white} />
        <AppText variant="bodyBold" color={Colors.white}>Report Serious AEFI to NVBDCP</AppText>
      </TouchableOpacity>

      {/* Helpline */}
      <AppText variant="small" color="#888" style={{textAlign: 'center', marginBottom: vs(10), lineHeight: ms(16)}}>
        National AEFI Reporting Hotline: 1800-11-6666 - Online: nhsrc.nic.in - State Immunization Officer, Telangana: 040-23450022
      </AppText>
    </View>
  );
};

const st = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: BORDER, overflow: 'hidden', marginBottom: vs(10)},
  cardHdr: {paddingHorizontal: s(13), paddingVertical: vs(10), borderBottomWidth: 0.5, borderBottomColor: '#e8f3e4'},
  selectBox: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', backgroundColor: Colors.white, borderWidth: 0.5, borderColor: BORDER, borderRadius: ms(10), paddingHorizontal: s(12), paddingVertical: vs(10)},
  dropItem: {paddingHorizontal: s(12), paddingVertical: vs(9), borderBottomWidth: 0.5, borderBottomColor: '#e8f3e4'},
  sectionBanner: {paddingHorizontal: s(13), paddingVertical: vs(8), borderBottomWidth: 0.5, borderBottomColor: '#e8f3e4'},
  aefiRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(8), paddingHorizontal: s(13), paddingVertical: vs(9)},
  aefiIcon: {width: ms(28), height: ms(28), borderRadius: ms(8), alignItems: 'center', justifyContent: 'center'},
  sevBtn: {width: ms(28), height: ms(28), borderRadius: ms(8), borderWidth: 0.5, borderColor: BORDER, backgroundColor: BG_LIGHT, alignItems: 'center', justifyContent: 'center'},
  sevBtnOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  sevBtnSev: {backgroundColor: Colors.red, borderColor: Colors.red},
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(6)},
  chip: {paddingHorizontal: s(12), paddingVertical: vs(7), borderRadius: ms(22), borderWidth: 0.5, borderColor: BORDER, backgroundColor: Colors.white},
  chipOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  reportBtn: {backgroundColor: Colors.red, borderRadius: ms(13), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', paddingVertical: vs(13), marginTop: vs(20), marginBottom: vs(10), gap: s(8)},
  insightCard: {borderRadius: ms(11), padding: ms(10), flexDirection: 'row', gap: s(8), marginBottom: vs(10)},
});

export default VaccAefiView;
