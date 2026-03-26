import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../../components/shared/AppText';
import Colors from '../../../constants/colors';
import {
  EMERGENCY_CONTACTS,
  EMERGENCY_NUMBERS,
  DOCTORS,
  PREFERRED_FACILITIES,
} from '../../../constants/profileData';

const PC = {
  1: {bg: '#FFF1F2', border: '#FECDD3', text: '#9B3A4A'},
  2: {bg: '#FFFBEB', border: '#FDE68A', text: '#92400E'},
  3: {bg: '#EFF6FF', border: '#BFDBFE', text: '#1E40AF'},
};
const DC = {
  green: {bg: Colors.tealBg, text: Colors.tealText},
  purple: {bg: Colors.purpleBg, text: Colors.purpleText},
  blue: {bg: Colors.blueBg, text: Colors.blueText},
  rose: {bg: '#FBEAF0', text: '#9B3A4A'},
  amber: {bg: Colors.amberBg, text: Colors.amberText},
};
const AUTH = {
  full: {label: 'Full medical authority', bg: '#DCFCE7', color: '#166534'},
  med: {label: 'Medical decisions', bg: '#FEF3C7', color: '#92400E'},
  info: {label: 'Notify only', bg: '#DBEAFE', color: '#1E40AF'},
};

const ContactTab = () => {
  const [contact, setContact] = useState({
    primaryEmail: 'priya.r@example.com',
    altEmail: '',
    mobile: '+91 98400 55210',
    altPhone: '',
    workPhone: '',
    whatsapp: '+91 98400 55210',
  });

  const updateField = (key, val) => setContact(prev => ({...prev, [key]: val}));

  const contactFields = [
    {key: 'primaryEmail', label: 'Primary Email', hint: 'Used for login and notifications', width: '48%'},
    {key: 'altEmail', label: 'Alternate Email', width: '48%'},
    {key: 'mobile', label: 'Mobile Number', hint: 'Primary contact number', width: '48%'},
    {key: 'altPhone', label: 'Alternate Phone', width: '48%'},
    {key: 'workPhone', label: 'Work Phone', width: '48%'},
    {key: 'whatsapp', label: 'WhatsApp', hint: 'For appointment reminders', width: '48%'},
  ];

  const renderContactField = (field) => (
    <View key={field.key} style={[styles.fieldWrap, {width: field.width}]}>
      <AppText variant="small" style={styles.fieldLabel}>
        {field.label.toUpperCase()}
      </AppText>
      <TextInput
        style={styles.input}
        value={contact[field.key]}
        onChangeText={val => updateField(field.key, val)}
        placeholder={field.label}
        placeholderTextColor="#C5C2BC"
      />
      {field.hint && (
        <AppText variant="small" color="#A09E9A" style={styles.fieldHint}>
          {field.hint}
        </AppText>
      )}
    </View>
  );

  const renderEmergencyContact = (ec) => {
    const pc = PC[ec.priority] || PC[3];
    const auth = AUTH[ec.authorityType] || AUTH.info;

    const infoFields = [
      {label: 'Mobile', value: ec.mobile},
      {label: ec.whatsapp ? 'WhatsApp' : 'Alt Phone', value: ec.whatsapp || ec.altPhone},
      ec.email && {label: 'Email', value: ec.email},
      ec.workPhone && {label: 'Work Phone', value: ec.workPhone},
      {label: 'Availability', value: ec.availability},
      {label: 'Language', value: ec.language},
    ].filter(Boolean);

    return (
      <View key={ec.priority} style={[styles.emergencyCard, {borderColor: pc.border}]}>
        {/* Header */}
        <View style={[styles.emergencyHeader, {backgroundColor: pc.bg}]}>
          <View style={styles.emergencyHeaderLeft}>
            <View style={[styles.priorityCircle, {backgroundColor: pc.text}]}>
              <AppText variant="small" color="#FFFFFF" style={styles.priorityNum}>
                {ec.priority}
              </AppText>
            </View>
            <View style={[styles.avatarCircle, {backgroundColor: pc.border}]}>
              <AppText variant="bodyBold" color={pc.text}>
                {ec.initials}
              </AppText>
            </View>
            <View>
              <AppText variant="bodyBold" color={pc.text}>
                {ec.name}
              </AppText>
              <AppText variant="caption" color={pc.text} style={{opacity: 0.8}}>
                {ec.relation}
              </AppText>
            </View>
          </View>
          <View style={[styles.authorityBadge, {backgroundColor: auth.bg}]}>
            <AppText variant="small" color={auth.color} style={{fontSize: ms(9)}}>
              {auth.label}
            </AppText>
          </View>
        </View>

        {/* Info grid */}
        <View style={styles.emergencyBody}>
          <View style={styles.infoGrid}>
            {infoFields.map((f, i) => (
              <View key={i} style={styles.infoGridItem}>
                <AppText variant="small" style={styles.infoGridLabel}>
                  {f.label.toUpperCase()}
                </AppText>
                <AppText variant="body" style={styles.infoGridValue}>
                  {f.value}
                </AppText>
              </View>
            ))}
          </View>
          {ec.notes && (
            <View style={styles.notesBox}>
              <AppText variant="small" style={styles.notesLabel}>NOTES</AppText>
              <AppText variant="caption" color="#6B6860">
                {ec.notes}
              </AppText>
            </View>
          )}
        </View>
      </View>
    );
  };

  const renderDoctor = (doc) => {
    const dc = DC[doc.color] || DC.green;
    return (
      <View key={doc.name} style={styles.doctorCard}>
        <View style={styles.doctorHeader}>
          <View style={[styles.docAvatar, {backgroundColor: dc.bg}]}>
            <AppText variant="bodyBold" color={dc.text}>
              {doc.initials}
            </AppText>
          </View>
          <View style={styles.docInfo}>
            <AppText variant="bodyBold" style={{color: '#1A1814'}}>
              {doc.name}
            </AppText>
            <AppText variant="caption" color="#6B6860">
              {doc.spec}
            </AppText>
            <View style={[styles.hospitalTag, {backgroundColor: dc.bg}]}>
              <AppText variant="small" color={dc.text} style={{fontSize: ms(9)}}>
                {doc.tag}
              </AppText>
            </View>
          </View>
        </View>
        <View style={styles.docDetails}>
          <View style={styles.docDetailRow}>
            <AppText variant="small" style={styles.docDetailLabel}>PHONE</AppText>
            <AppText variant="body" color={Colors.primary} style={{fontSize: ms(12)}}>
              {doc.phone}
            </AppText>
          </View>
          <View style={styles.docDetailRow}>
            <AppText variant="small" style={styles.docDetailLabel}>LAST VISIT</AppText>
            <AppText variant="body" style={{fontSize: ms(12), color: '#1A1814'}}>
              {doc.lastVisit}
            </AppText>
          </View>
          <View style={styles.docDetailRow}>
            <AppText variant="small" style={styles.docDetailLabel}>NEXT VISIT</AppText>
            <AppText variant="body" style={{fontSize: ms(12), color: '#1A1814'}}>
              {doc.nextVisit}
            </AppText>
          </View>
        </View>
        <View style={styles.docActions}>
          <TouchableOpacity style={styles.ghostButton}>
            <AppText variant="small" color={Colors.primary}>Edit</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.ghostButton}>
            <AppText variant="small" color={Colors.primary}>View Notes</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.primaryButton}>
            <AppText variant="small" color="#FFFFFF">Book Appointment</AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Contact Details */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>
            Contact Details
          </AppText>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.formGrid}>
            {contactFields.map(renderContactField)}
          </View>
        </View>
      </View>

      {/* Emergency Contacts */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>
            Emergency Contacts
          </AppText>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.warningBanner}>
            <AppText variant="caption" color="#9B3A4A">
              Contacts are listed in priority order. In an emergency, they will be contacted in the order shown below.
            </AppText>
          </View>
          {EMERGENCY_CONTACTS.map(renderEmergencyContact)}
        </View>
      </View>

      {/* Emergency Numbers */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>
            Emergency Numbers
          </AppText>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.numbersGrid}>
            {EMERGENCY_NUMBERS.map((en, i) => (
              <View key={i} style={styles.numberCard}>
                <AppText
                  variant="header"
                  style={[styles.numberValue, {color: en.color}]}>
                  {en.number}
                </AppText>
                <AppText variant="small" style={styles.numberLabel}>
                  {en.label}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* Care Team */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>
            Care Team
          </AppText>
        </View>
        <View style={styles.cardBody}>
          {DOCTORS.map(renderDoctor)}
        </View>
      </View>

      {/* Preferred Facilities */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>
            Preferred Facilities
          </AppText>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.facilitiesGrid}>
            {PREFERRED_FACILITIES.map((fac, i) => (
              <View key={i} style={styles.facilityCard}>
                <AppText variant="small" style={styles.facilityLabel}>
                  {fac.label.toUpperCase()}
                </AppText>
                <AppText variant="bodyBold" style={styles.facilityName}>
                  {fac.name}
                </AppText>
                <AppText variant="caption" color="#6B6860" style={{marginBottom: vs(4)}}>
                  {fac.sub}
                </AppText>
                <AppText variant="small" color={Colors.primary}>
                  {fac.phone}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      </View>

      <View style={{height: vs(30)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingTop: vs(12),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ms(16),
    
    
    marginBottom: vs(12),
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD6',
  },
  sectionTitle: {
    fontSize: ms(14),
    color: '#1A1814',
  },
  cardBody: {
    padding: s(16),
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
  },
  fieldWrap: {
    marginBottom: vs(4),
  },
  fieldLabel: {
    fontSize: ms(10),
    color: '#A09E9A',
    marginBottom: vs(4),
    letterSpacing: 0.5,
  },
  input: {
    
    
    borderRadius: ms(6),
    padding: s(10),
    fontSize: ms(14),
    color: '#1A1814',
  },
  fieldHint: {
    fontSize: ms(9),
    marginTop: vs(2),
  },

  /* Emergency Contacts */
  warningBanner: {
    backgroundColor: '#FFF1F2',
    borderRadius: ms(8),
    padding: s(12),
    marginBottom: vs(12),
    
    borderColor: '#FECDD3',
  },
  emergencyCard: {
    borderRadius: ms(12),
    
    marginBottom: vs(12),
    overflow: 'hidden',
  },
  emergencyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(12),
    flexWrap: 'wrap',
    gap: vs(6),
  },
  emergencyHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  priorityCircle: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(11),
    alignItems: 'center',
    justifyContent: 'center',
  },
  priorityNum: {
    fontSize: ms(11),
    fontWeight: '700',
  },
  avatarCircle: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  authorityBadge: {
    borderRadius: ms(20),
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
  },
  emergencyBody: {
    padding: s(12),
  },
  infoGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
  },
  infoGridItem: {
    width: '47%',
    marginBottom: vs(6),
  },
  infoGridLabel: {fontSize: ms(9), color: '#A09E9A', letterSpacing: 0.5, marginBottom: vs(2)},
  infoGridValue: {fontSize: ms(12), color: '#1A1814'},
  notesBox: {backgroundColor: '#F5F3EF', borderRadius: ms(8), padding: s(10), marginTop: vs(8)},
  notesLabel: {fontSize: ms(9), color: '#A09E9A', letterSpacing: 0.5, marginBottom: vs(4)},
  /* Emergency Numbers */
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
  },
  numberCard: {
    width: '30%',
    backgroundColor: '#FAFAF8',
    borderRadius: ms(10),
    
    
    padding: s(12),
    alignItems: 'center',
  },
  numberValue: {fontSize: ms(20), fontWeight: '700', marginBottom: vs(4)},
  numberLabel: {fontSize: ms(9), color: '#6B6860', textAlign: 'center'},
  doctorCard: {borderRadius: ms(10),   marginBottom: vs(10), overflow: 'hidden'},
  doctorHeader: {flexDirection: 'row', padding: s(12), gap: s(10), alignItems: 'flex-start'},
  docAvatar: {width: ms(42), height: ms(42), borderRadius: ms(21), alignItems: 'center', justifyContent: 'center'},
  docInfo: {flex: 1},
  hospitalTag: {borderRadius: ms(20), paddingHorizontal: s(10), paddingVertical: vs(3), alignSelf: 'flex-start', marginTop: vs(4)},
  docDetails: {paddingHorizontal: s(12), paddingBottom: vs(8), gap: vs(4)},
  docDetailRow: {flexDirection: 'row', alignItems: 'center', gap: s(8)},
  docDetailLabel: {fontSize: ms(9), color: '#A09E9A', width: s(70), letterSpacing: 0.5},
  docActions: {flexDirection: 'row', gap: s(8), padding: s(12), borderTopWidth: 1, borderTopColor: '#E0DDD6'},
  ghostButton: {backgroundColor: 'transparent',   borderRadius: ms(6), paddingHorizontal: s(12), paddingVertical: vs(5)},
  primaryButton: {backgroundColor: Colors.primary, borderRadius: ms(6), paddingHorizontal: s(12), paddingVertical: vs(5)},
  facilitiesGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(10)},
  facilityCard: {width: '47%', backgroundColor: '#FAFAF8', borderRadius: ms(10),   padding: s(12)},
  facilityLabel: {fontSize: ms(9), color: '#A09E9A', letterSpacing: 0.5, marginBottom: vs(4)},
  facilityName: {fontSize: ms(13), color: '#1A1814', marginBottom: vs(2)},
});

export default ContactTab;
