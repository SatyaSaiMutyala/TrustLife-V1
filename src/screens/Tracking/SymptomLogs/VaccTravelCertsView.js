import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const BORDER = '#c8dfc0';
const BG_LIGHT = '#f4f9f2';

const DESTINATIONS = [
  'Sub-Saharan Africa', 'Southeast Asia', 'South Asia (domestic)', 'Middle East (Hajj/Umra)',
  'South America', 'East Africa', 'China / Japan', 'USA / Europe',
];

const TRAVEL_VACCINES = [
  {id: 'typhoid', name: 'Typhoid', icon: 'shield-checkmark-outline', desc: 'India domestic - High risk areas - Booster every 3 years', active: true},
  {id: 'hepa', name: 'Hepatitis A', icon: 'medkit-outline', desc: 'All travel - 2-dose series - Highly effective', active: true},
  {id: 'yellowfever', name: 'Yellow Fever', icon: 'sunny-outline', desc: 'Required for Africa / South America - Live vaccine - Certificate needed - 1 dose = lifetime immunity', active: false},
  {id: 'je', name: 'Japanese Encephalitis', icon: 'bug-outline', desc: 'SE Asia / South Asia rural - Pig farming areas - 2-dose IXIARO', active: false},
  {id: 'malaria', name: 'Malaria prophylaxis', icon: 'medical-outline', desc: 'Africa / South Asia - Chloroquine / Atovaquone-Proguanil - Begin 1-2 days before', active: false},
  {id: 'rabies', name: 'Rabies (PrEP)', icon: 'paw-outline', desc: 'Wildlife areas - Veterinary workers - 3-dose pre-exposure prophylaxis', active: false},
  {id: 'meningo', name: 'Meningococcal ACWY', icon: 'people-outline', desc: 'Required for Hajj / Umra - Saudi Arabia mandatory. Also recommended for Africa meningitis belt.', active: false},
  {id: 'cholera', name: 'Cholera oral (Dukoral)', icon: 'water-outline', desc: 'Humanitarian / flood zones - Pilgrim areas - 2-dose oral vaccine', active: false},
];

const IHR_ITEMS = [
  {title: 'International Certificate of Vaccination (ICV)', icon: 'document-text-outline', desc: 'Required for Yellow Fever for travel to/from endemic countries. WHO-approved yellow card (Carte Jaune). Available at authorised vaccination centres. Must be stamped by an authorised vaccinator. Valid lifelong (since 2016 - no longer requires 10-year renewal).', action: 'Find centre'},
  {title: 'Hajj / Umra - Saudi Arabia requirements', icon: 'airplane-outline', desc: 'Meningococcal vaccine within 3-5 years (MenACWY) mandatory for all pilgrims. Proof of influenza vaccination recommended. Yellow fever if coming from endemic country. Meningococcal certificate required at entry.', action: 'View'},
];

const CERT_ITEMS = [
  {title: 'COWIN / Aarogya Setu - COVID certificate', icon: 'shield-checkmark-outline', desc: 'Covaxin / Covishield primary series: 2025 - Precaution dose: Jan 2024 - Digital certificate linked to Aadhaar. Download from cowin.gov.in or Aarogya Setu app.', action: 'Download'},
  {title: 'eVIN - Electronic Vaccine Intelligence Network', icon: 'phone-portrait-outline', desc: 'India government vaccination record system. Your children\'s vaccinations from government health centres may be on eVIN. Access via ABHA Health ID (Ayushman Bharat Health Account).', action: 'Link ABHA'},
  {title: 'Yellow Fever Certificate (ICV / Carte Jaune)', icon: 'document-outline', desc: 'Not yet issued - Required for travel to endemic countries in Africa and South America - Must be stamped at an authorised WHO centre', action: 'Get'},
  {title: "Aarav's immunization card", icon: 'card-outline', desc: 'Paper immunization card from GMCH (birth hospital). Scan and upload to keep a digital backup. Used for school admission verification in Telangana.', action: 'Scan'},
  {title: 'School admission certificate', icon: 'school-outline', desc: 'Telangana: BCG, OPV, DPT, MMR, Hepatitis B scar proof required for school admission. Certificate available from vaccinating doctor or government health centre.', action: 'Generate'},
];

const Section = ({title}) => (
  <View style={{flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)}}>
    <AppText variant="subtext" color="#888" style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginRight: s(7)}}>{title}</AppText>
    <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: BORDER}} />
  </View>
);

/* ── Travel Section ── */
const TravelSection = () => {
  const [destination, setDestination] = useState('South Asia (domestic)');
  const [activeVaccs, setActiveVaccs] = useState({typhoid: true, hepa: true});

  const toggleVacc = (id) => setActiveVaccs(prev => ({...prev, [id]: !prev[id]}));

  return (
    <>
      <Section title="Travel destination" />
      <View style={st.chipWrap}>
        {DESTINATIONS.map(d => {
          const on = destination === d;
          return (
            <TouchableOpacity key={d} style={[st.chip, on && st.chipOn]} onPress={() => setDestination(d)} activeOpacity={0.7}>
              <AppText variant="caption" color={on ? Colors.white : Colors.textSecondary} style={{fontWeight: on ? '700' : '500'}}>{d}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      <Section title="Travel vaccines recommended" />
      <View style={st.vaccGrid}>
        {TRAVEL_VACCINES.map(v => {
          const on = activeVaccs[v.id] || v.active;
          return (
            <TouchableOpacity key={v.id} style={[st.vaccCard, on && {borderColor: Colors.primary, backgroundColor: Colors.tealBg}]} onPress={() => toggleVacc(v.id)} activeOpacity={0.7}>
              <Icon family="Ionicons" name={v.icon} size={ms(20)} color={on ? Colors.tealText : Colors.textTertiary} style={{marginBottom: vs(4)}} />
              <AppText variant="small" color={on ? Colors.tealText : Colors.textPrimary} style={{fontWeight: '700'}}>{v.name}</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(13)}}>{v.desc}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Planning timeline insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.amberBg}]}>
        <Icon family="Ionicons" name="airplane-outline" size={ms(14)} color={Colors.amberDark} />
        <AppText variant="caption" color={Colors.amberDark} style={{flex: 1, lineHeight: ms(17)}}>
          <AppText style={{fontWeight: '700'}}>Travel vaccine planning timeline.</AppText> Start planning at least 4-6 weeks before travel. Yellow Fever: certificate valid from 10 days after vaccination - allow time. Japanese Encephalitis: 2 doses 28 days apart. Rabies PrEP: 3 doses over 21-28 days. Some vaccines require specific intervals between doses. Consult a travel medicine specialist or visit a designated travel health clinic.
        </AppText>
      </View>

      {/* International health regulations */}
      <Section title="International health regulations" />
      <View style={st.card}>
        {IHR_ITEMS.map((item, idx) => (
          <View key={idx} style={[st.certRow, idx < IHR_ITEMS.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: '#e8f3e4'}]}>
            <Icon family="Ionicons" name={item.icon} size={ms(18)} color={Colors.primary} style={{marginTop: vs(2)}} />
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>{item.title}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(15)}}>{item.desc}</AppText>
            </View>
            <TouchableOpacity activeOpacity={0.7}>
              <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>{item.action}</AppText>
            </TouchableOpacity>
          </View>
        ))}
      </View>
    </>
  );
};

/* ── Certificates Section ── */
const CertsSection = () => (
  <>
    <Section title="Vaccination certificates & documents" />
    <View style={st.card}>
      {CERT_ITEMS.map((item, idx) => (
        <View key={idx} style={[st.certRow, idx < CERT_ITEMS.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: '#e8f3e4'}]}>
          <Icon family="Ionicons" name={item.icon} size={ms(18)} color={Colors.primary} style={{marginTop: vs(2)}} />
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={Colors.textPrimary}>{item.title}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(15)}}>{item.desc}</AppText>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>{item.action}</AppText>
          </TouchableOpacity>
        </View>
      ))}
    </View>

    {/* ABHA integration insight */}
    <View style={[st.insightCard, {backgroundColor: Colors.tealBg}]}>
      <Icon family="Ionicons" name="flag-outline" size={ms(14)} color={Colors.tealText} />
      <AppText variant="caption" color={Colors.tealText} style={{flex: 1, lineHeight: ms(17)}}>
        <AppText style={{fontWeight: '700'}}>Link your ABHA Health ID.</AppText> Your Ayushman Bharat Health Account (ABHA / Health ID) integrates all government vaccination records - Pulse Polio, UIP vaccines - into a single digital record. This is particularly important for Aarav's government-administered vaccines (BCG, OPV, DPT, Measles) which may not yet be in TrustLife. Link via Aarogya Setu or abdm.gov.in.
      </AppText>
    </View>

    {/* Export buttons */}
    <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(10)}}>
      <TouchableOpacity activeOpacity={0.7} style={st.exportPrimary}>
        <Icon family="Ionicons" name="download-outline" size={ms(16)} color={Colors.white} />
        <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>Export family PDF</AppText>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.7} style={st.exportOutline}>
        <Icon family="Ionicons" name="share-outline" size={ms(16)} color={Colors.primary} />
        <AppText variant="bodyBold" color={Colors.primary} style={{marginLeft: s(6)}}>Share with school</AppText>
      </TouchableOpacity>
    </View>
  </>
);

/* ── Main Component ── */
const VaccTravelCertsView = ({activeView}) => (
  <View style={{flex: 1}}>
    {activeView === 'travel' && <TravelSection />}
    {activeView === 'certs' && <CertsSection />}
  </View>
);

const st = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: BORDER, overflow: 'hidden', marginBottom: vs(10)},
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(6), marginBottom: vs(10)},
  chip: {paddingHorizontal: s(12), paddingVertical: vs(7), borderRadius: ms(22), borderWidth: 0.5, borderColor: BORDER, backgroundColor: Colors.white},
  chipOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  vaccGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(7), marginBottom: vs(10)},
  vaccCard: {width: '48%', borderRadius: ms(12), borderWidth: 0.5, borderColor: BORDER, backgroundColor: Colors.white, padding: ms(10), alignItems: 'center'},
  certRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(10), paddingVertical: vs(9), paddingHorizontal: s(13)},
  insightCard: {borderRadius: ms(11), padding: ms(10), flexDirection: 'row', gap: s(8), marginBottom: vs(10)},
  exportPrimary: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.primary, borderRadius: ms(12), paddingVertical: vs(12)},
  exportOutline: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: BORDER, backgroundColor: BG_LIGHT, borderRadius: ms(12), paddingVertical: vs(12)},
});

export default VaccTravelCertsView;
