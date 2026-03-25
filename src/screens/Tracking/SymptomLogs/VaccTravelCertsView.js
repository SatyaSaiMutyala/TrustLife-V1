import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const DESTINATIONS = [
  'Sub-Saharan Africa',
  'Southeast Asia',
  'South Asia (domestic)',
  'Middle East (Hajj/Umra)',
  'South America',
  'East Africa',
  'China/Japan',
  'USA/Europe',
];

const TRAVEL_VACCINES = [
  {id: 'typhoid', name: 'Typhoid', icon: 'shield-checkmark-outline', desc: 'India domestic \u00B7 Booster every 3 years', active: true},
  {id: 'hepa', name: 'Hepatitis A', icon: 'medkit-outline', desc: 'All travel \u00B7 2-dose series', active: true},
  {id: 'yellowfever', name: 'Yellow Fever', icon: 'sunny-outline', desc: 'Required for Africa/South America \u00B7 Certificate needed', active: false},
  {id: 'je', name: 'Japanese Encephalitis', icon: 'bug-outline', desc: 'SE Asia rural \u00B7 2-dose IXIARO', active: false},
  {id: 'malaria', name: 'Malaria prophylaxis', icon: 'medical-outline', desc: 'Africa/South Asia', active: false},
  {id: 'rabies', name: 'Rabies (PrEP)', icon: 'paw-outline', desc: 'Wildlife areas \u00B7 3-dose', active: false},
  {id: 'meningo', name: 'Meningococcal ACWY', icon: 'people-outline', desc: 'Required for Hajj/Umra', active: false},
  {id: 'cholera', name: 'Cholera oral', icon: 'water-outline', desc: 'Humanitarian/flood zones \u00B7 2-dose oral', active: false},
];

const IHR_ITEMS = [
  {id: 'icv', title: 'ICV / Carte Jaune', icon: 'document-text-outline', desc: 'Yellow Fever vaccination certificate recognised under International Health Regulations. Required for entry to several African and South American countries.', action: 'Find centre \u2192'},
  {id: 'hajj', title: 'Hajj / Umra requirements', icon: 'airplane-outline', desc: 'Meningococcal ACWY vaccination mandatory. Certificate must be issued within 3 years and at least 10 days before arrival.', action: 'View \u2192'},
];

const CERT_ITEMS = [
  {id: 'cowin', title: 'CoWIN', icon: 'shield-checkmark-outline', desc: 'COVID-19 vaccination certificate linked to Aadhaar. Internationally recognised via WHO DDCC.', action: 'Download'},
  {id: 'evin', title: 'eVIN', icon: 'phone-portrait-outline', desc: 'Electronic Vaccine Intelligence Network \u2014 Government digital immunisation records.', action: 'Link ABHA'},
  {id: 'yf', title: 'Yellow Fever Certificate', icon: 'document-outline', desc: 'Not yet issued', action: 'Get \u2192'},
  {id: 'aarav', title: "Aarav's immunization card", icon: 'card-outline', desc: 'Paper card from GMCH \u2014 scan to digitise and link to ABHA.', action: 'Scan \u2192'},
  {id: 'school', title: 'School admission certificate', icon: 'school-outline', desc: 'Telangana state requirements for school entry immunisation proof.', action: 'Generate'},
];

const Chip = ({label, active, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[
      styles.chip,
      active && {backgroundColor: Colors.tealBg, borderColor: Colors.tealText},
    ]}>
    <AppText
      variant="small"
      color={active ? Colors.tealText : Colors.textSecondary}
      style={active ? {fontWeight: '600'} : undefined}>
      {label}
    </AppText>
  </TouchableOpacity>
);

const VaccineCard = ({item}) => (
  <View style={[styles.vaccCard, item.active && {borderColor: Colors.primary}]}>
    <View style={[styles.vaccIcon, {backgroundColor: item.active ? Colors.tealBg : Colors.blueBg}]}>
      <Icon family="Ionicons" name={item.icon} size={20} color={item.active ? Colors.tealText : Colors.blueText} />
    </View>
    <AppText variant="bodyBold" style={{marginTop: vs(6)}}>{item.name}</AppText>
    <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{item.desc}</AppText>
    {item.active && (
      <View style={styles.activeBadge}>
        <Icon family="Ionicons" name="checkmark-circle" size={12} color={Colors.tealText} />
        <AppText variant="small" color={Colors.tealText} style={{marginLeft: s(3), fontWeight: '600'}}>Recommended</AppText>
      </View>
    )}
  </View>
);

const CertRow = ({item, isLast}) => (
  <View style={[styles.certRow, !isLast && styles.certDivider]}>
    <View style={styles.certIcon}>
      <Icon family="Ionicons" name={item.icon} size={18} color={Colors.primary} />
    </View>
    <View style={{flex: 1}}>
      <AppText variant="bodyBold">{item.title}</AppText>
      <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{item.desc}</AppText>
    </View>
    <TouchableOpacity activeOpacity={0.7} style={styles.certAction}>
      <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>{item.action}</AppText>
    </TouchableOpacity>
  </View>
);

/* ── Travel Section ── */
const TravelSection = () => {
  const [destination, setDestination] = useState('South Asia (domestic)');

  return (
    <>
      {/* Destination chips */}
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={{marginBottom: vs(8)}}>Travel destination</AppText>
      <View style={styles.chipWrap}>
        {DESTINATIONS.map(d => (
          <Chip key={d} label={d} active={destination === d} onPress={() => setDestination(d)} />
        ))}
      </View>

      {/* Vaccine grid */}
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={{marginTop: vs(16), marginBottom: vs(8)}}>
        Travel vaccines recommended
      </AppText>
      <View style={styles.vaccGrid}>
        {TRAVEL_VACCINES.map(v => (
          <VaccineCard key={v.id} item={v} />
        ))}
      </View>

      {/* Planning timeline insight */}
      <View style={[styles.card, {backgroundColor: Colors.amberBg, borderColor: Colors.amber}]}>
        <View style={styles.insightRow}>
          <Icon family="Ionicons" name="time-outline" size={18} color={Colors.amberText} />
          <AppText variant="bodyBold" color={Colors.amberText} style={{marginLeft: s(6)}}>Planning timeline</AppText>
        </View>
        <AppText variant="small" color={Colors.amberText} style={{marginTop: vs(4), lineHeight: ms(18)}}>
          Start planning 4-6 weeks before travel. Some vaccines like Japanese Encephalitis and Rabies require multiple doses spaced weeks apart. Yellow Fever centres may have limited slots during peak travel season.
        </AppText>
      </View>

      {/* International health regulations */}
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={{marginTop: vs(14), marginBottom: vs(8)}}>
        International health regulations
      </AppText>
      <View style={styles.card}>
        {IHR_ITEMS.map((item, idx) => (
          <View key={item.id} style={[styles.ihrRow, idx > 0 && {borderTopWidth: 0.5, borderTopColor: '#e5e7eb', paddingTop: vs(12)}]}>
            <View style={[styles.ihrIcon, {backgroundColor: Colors.blueBg}]}>
              <Icon family="Ionicons" name={item.icon} size={18} color={Colors.blueText} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold">{item.title}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{item.desc}</AppText>
              <TouchableOpacity activeOpacity={0.7} style={{marginTop: vs(6)}}>
                <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>{item.action}</AppText>
              </TouchableOpacity>
            </View>
          </View>
        ))}
      </View>
    </>
  );
};

/* ── Certificates Section ── */
const CertsSection = () => (
  <>
    {/* Certificates & documents */}
    <AppText variant="sectionTitle" color={Colors.textPrimary} style={{marginBottom: vs(8)}}>Certificates & documents</AppText>
    <View style={styles.card}>
      {CERT_ITEMS.map((item, idx) => (
        <CertRow key={item.id} item={item} isLast={idx === CERT_ITEMS.length - 1} />
      ))}
    </View>

    {/* ABHA integration insight */}
    <View style={[styles.card, {backgroundColor: Colors.tealBg, borderColor: Colors.teal}]}>
      <View style={styles.insightRow}>
        <Icon family="Ionicons" name="link-outline" size={18} color={Colors.tealText} />
        <AppText variant="bodyBold" color={Colors.tealText} style={{marginLeft: s(6)}}>ABHA Integration</AppText>
      </View>
      <AppText variant="small" color={Colors.tealText} style={{marginTop: vs(4), lineHeight: ms(18)}}>
        Link your ABHA Health ID to automatically pull vaccination records from CoWIN, eVIN, and participating hospitals. All records are stored securely under India's ABDM framework.
      </AppText>
    </View>

    {/* Export buttons */}
    <View style={styles.exportRow}>
      <TouchableOpacity activeOpacity={0.7} style={styles.exportPrimary}>
        <Icon family="Ionicons" name="download-outline" size={16} color={Colors.white} />
        <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>Export family PDF</AppText>
      </TouchableOpacity>
      <TouchableOpacity activeOpacity={0.7} style={styles.exportOutline}>
        <Icon family="Ionicons" name="share-outline" size={16} color={Colors.primary} />
        <AppText variant="bodyBold" color={Colors.primary} style={{marginLeft: s(6)}}>Share with school</AppText>
      </TouchableOpacity>
    </View>
  </>
);

/* ── Main Component ── */
const VaccTravelCertsView = ({activeView}) => (
  <View style={styles.container}>
    {activeView === 'travel' && <TravelSection />}
    {activeView === 'certs' && <CertsSection />}
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1},
  card: {
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: vs(10),
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  chip: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(20),
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
  },
  vaccGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
  },
  vaccCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(12),
    marginBottom: vs(2),
  },
  vaccIcon: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(6),
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ihrRow: {
    flexDirection: 'row',
    paddingBottom: vs(12),
  },
  ihrIcon: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  certRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  certDivider: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  certIcon: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(10),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  certAction: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    marginLeft: s(8),
  },
  exportRow: {
    flexDirection: 'row',
    gap: s(10),
    marginTop: vs(6),
  },
  exportPrimary: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(14),
  },
  exportOutline: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(14),
  },
});

export default VaccTravelCertsView;
