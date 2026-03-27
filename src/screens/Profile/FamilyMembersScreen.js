import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import AppTextField from '../../components/shared/AppTextField';
import AppDropdown from '../../components/shared/AppDropdown';
import {DEPENDENTS} from '../../constants/profileData';

/* ── Category config ──────────────────────────────── */

const CAT_THEME = {
  infant: {bg: '#FDE8D0', color: '#7A3B0A', label: 'Infant', border: '#F5C090'},
  minor: {bg: '#EAF2FB', color: '#1A5276', label: 'Minor', border: '#AECFEE'},
  adult: {bg: Colors.tealBg, color: Colors.accent, label: 'Adult', border: '#B7DFC9'},
};

/* ── Component ────────────────────────────────────── */

const FamilyMembersScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [showAddForm, setShowAddForm] = useState(false);

  // Add form state
  const [newFirst, setNewFirst] = useState('');
  const [newLast, setNewLast] = useState('');
  const [newDob, setNewDob] = useState('');
  const [newRelation, setNewRelation] = useState('');
  const [newGender, setNewGender] = useState('');
  const [newBlood, setNewBlood] = useState('');
  const [newIdType, setNewIdType] = useState('');
  const [newIdNumber, setNewIdNumber] = useState('');

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Header ─────────────────────────────────── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <AppText variant="body" style={st.backText}>{'\u2039'} Profile</AppText>
          </TouchableOpacity>
          <View style={st.headerBadge}>
            <AppText variant="small" style={st.headerBadgeText}>{DEPENDENTS.length} members</AppText>
          </View>
        </View>
        <AppText variant="screenName" style={st.headerTitle}>Family Members</AppText>
        <AppText variant="caption" style={st.headerSub}>Manage health profiles for your family</AppText>
      </View>

      <ScrollView style={st.scroll} contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Member Cards ─────────────────────────── */}
        {DEPENDENTS.map((dep, idx) => {
          const theme = CAT_THEME[dep.category] || CAT_THEME.adult;
          return (
            <View key={idx} style={st.memberCard}>
              {/* Category badge */}
              <View style={[st.catBadge, {backgroundColor: theme.bg, borderColor: theme.border}]}>
                <AppText variant="small" style={{color: theme.color, fontWeight: '600', fontSize: ms(9)}}>{theme.label}</AppText>
              </View>

              {/* Header row */}
              <View style={st.memberHeader}>
                <View style={[st.avatar, {backgroundColor: theme.bg}]}>
                  <AppText style={{fontSize: ms(16), fontWeight: '600', color: theme.color}}>{dep.initials}</AppText>
                </View>
                <View style={{flex: 1}}>
                  <AppText variant="bodyBold">{dep.name}</AppText>
                  <AppText variant="small" color={Colors.textSecondary}>{dep.relation}</AppText>
                </View>
              </View>

              {/* Details */}
              <View style={st.detailsWrap}>
                <DetailRow label="DOB" value={dep.dob} />
                <DetailRow label="Age" value={dep.age} />
                <DetailRow label="Blood Group" value={dep.blood} />
                {dep.school && <DetailRow label="School" value={dep.school} />}
                <DetailRow label="ID / Birth Cert" value={dep.id} />
                {dep.extra && <DetailRow label="Paediatric ID" value={dep.extra} />}
              </View>

              {/* Actions */}
              <View style={st.actionRow}>
                <TouchableOpacity style={st.actionBtn} activeOpacity={0.7}>
                  <AppText variant="small" color={Colors.textSecondary} style={st.actionBtnText}>Edit</AppText>
                </TouchableOpacity>
                <TouchableOpacity style={st.actionBtn} activeOpacity={0.7}>
                  <AppText variant="small" color={Colors.textSecondary} style={st.actionBtnText}>View Health</AppText>
                </TouchableOpacity>
                <TouchableOpacity style={[st.actionBtn, st.actionBtnDanger]} activeOpacity={0.7}>
                  <AppText variant="small" color={Colors.red} style={st.actionBtnText}>Remove</AppText>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}

        {/* ── Add Member Toggle ────────────────────── */}
        {!showAddForm && (
          <TouchableOpacity style={st.addToggle} activeOpacity={0.7} onPress={() => setShowAddForm(true)}>
            <AppText variant="body" color={Colors.accent} style={{fontWeight: '600'}}>+ Add a Family Member</AppText>
          </TouchableOpacity>
        )}

        {/* ── Add Member Form ──────────────────────── */}
        {showAddForm && (
          <View style={st.addFormCard}>
            <View style={st.addFormHeader}>
              <AppText variant="sectionTitle">NEW FAMILY MEMBER</AppText>
              <TouchableOpacity onPress={() => setShowAddForm(false)}>
                <AppText variant="body" color={Colors.textTertiary}>{'\u2715'}</AppText>
              </TouchableOpacity>
            </View>

            <View style={st.formRow}>
              <View style={st.halfField}>
                <AppTextField label="First Name" value={newFirst} onChangeText={setNewFirst} placeholder="First name" />
              </View>
              <View style={st.halfField}>
                <AppTextField label="Last Name" value={newLast} onChangeText={setNewLast} placeholder="Last name" />
              </View>
              <View style={st.halfField}>
                <AppTextField label="Date of Birth" value={newDob} onChangeText={setNewDob} placeholder="DD/MM/YYYY" />
              </View>
              <View style={[st.halfField, {zIndex: 50}]}>
                <AppDropdown label="Relationship" value={newRelation} placeholder="Select" options={['Son', 'Daughter', 'Spouse', 'Parent', 'Sibling', 'Other']} onSelect={setNewRelation} />
              </View>
              <View style={[st.halfField, {zIndex: 40}]}>
                <AppDropdown label="Gender" value={newGender} placeholder="Select" options={['Male', 'Female', 'Non-binary', 'Prefer not to say']} onSelect={setNewGender} />
              </View>
              <View style={[st.halfField, {zIndex: 30}]}>
                <AppDropdown label="Blood Group" value={newBlood} placeholder="Select" options={['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-']} onSelect={setNewBlood} />
              </View>
              <View style={[st.halfField, {zIndex: 20}]}>
                <AppDropdown label="ID Type" value={newIdType} placeholder="Select" options={['Birth Certificate', 'Aadhaar', 'Passport', 'School ID']} onSelect={setNewIdType} />
              </View>
              <View style={st.halfField}>
                <AppTextField label="ID Number" value={newIdNumber} onChangeText={setNewIdNumber} placeholder="ID number" />
              </View>
            </View>

            <View style={st.addFormActions}>
              <TouchableOpacity style={st.cancelBtn} activeOpacity={0.7} onPress={() => setShowAddForm(false)}>
                <AppText variant="body" color={Colors.textSecondary}>Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={st.submitBtn} activeOpacity={0.8}>
                <AppText variant="bodyBold" color={Colors.white}>Add Member</AppText>
              </TouchableOpacity>
            </View>
          </View>
        )}

        {/* ── Guardian Settings ────────────────────── */}
        <AppText variant="sectionTitle" style={st.sectionLabel}>GUARDIAN & CONSENT</AppText>
        <View style={st.card}>
          <InfoRow label="Guardian Role" value="Primary Guardian for all minors" />
          <InfoRow label="Consent Auth." value="Priya Raghunathan is authorised to give medical & legal consent" />
          <InfoRow label="Secondary Guardian" value="Karthik Raghunathan" action="Edit" />
          <InfoRow label="Data Privacy" value="Minors' data protected under Child Privacy Policy" last />
        </View>

        <View style={{height: vs(40)}} />
      </ScrollView>
    </View>
  );
};

/* ── Sub-components ───────────────────────────────── */

const DetailRow = ({label, value}) => (
  <View style={st.detailRow}>
    <AppText variant="small" color={Colors.textTertiary} style={st.detailLabel}>{label}</AppText>
    <AppText variant="small" color={Colors.textPrimary} style={st.detailValue}>{value}</AppText>
  </View>
);

const InfoRow = ({label, value, action, last}) => (
  <View style={[st.infoRow, !last && st.infoRowBorder]}>
    <AppText variant="small" color={Colors.textTertiary} style={st.infoLabel}>{label}</AppText>
    <AppText variant="body" style={{flex: 1}}>{value}</AppText>
    {action && (
      <TouchableOpacity activeOpacity={0.6}>
        <AppText variant="small" color={Colors.accent} style={{fontWeight: '600'}}>{action}</AppText>
      </TouchableOpacity>
    )}
  </View>
);

/* ── Styles ───────────────────────────────────────── */

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  /* Header */
  header: {backgroundColor: Colors.primary, paddingBottom: vs(16), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(12)},
  backBtn: {paddingVertical: vs(4), paddingRight: s(12)},
  backText: {color: Colors.white, fontSize: ms(15)},
  headerBadge: {backgroundColor: 'rgba(93,202,165,0.18)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)', borderRadius: ms(20), paddingHorizontal: s(12), paddingVertical: vs(4)},
  headerBadgeText: {color: Colors.lightGreen, fontSize: ms(11), fontWeight: '600'},
  headerTitle: {color: Colors.white, fontSize: ms(20), fontWeight: '700', marginBottom: vs(4)},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},

  /* Scroll */
  scroll: {flex: 1},
  scrollContent: {padding: s(16)},
  sectionLabel: {marginBottom: vs(8), marginTop: vs(8)},

  /* Member card */
  memberCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    padding: s(16),
    marginBottom: vs(12),
    position: 'relative',
  },
  catBadge: {
    position: 'absolute',
    top: s(12),
    right: s(12),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(20),
    borderWidth: 1,
  },
  memberHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    marginBottom: vs(12),
  },
  avatar: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Details */
  detailsWrap: {
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    padding: s(12),
    marginBottom: vs(12),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: vs(3),
  },
  detailLabel: {fontWeight: '500'},
  detailValue: {fontWeight: '500'},

  /* Actions */
  actionRow: {
    flexDirection: 'row',
    gap: s(8),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    paddingTop: vs(10),
  },
  actionBtn: {
    flex: 1,
    paddingVertical: vs(7),
    borderRadius: ms(8),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  actionBtnDanger: {
    borderColor: 'rgba(226,75,74,0.3)',
    backgroundColor: 'rgba(226,75,74,0.04)',
  },
  actionBtnText: {fontWeight: '600'},

  /* Add toggle */
  addToggle: {
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.accent,
    borderRadius: ms(16),
    paddingVertical: vs(18),
    alignItems: 'center',
    marginBottom: vs(14),
    backgroundColor: 'rgba(29,158,117,0.04)',
  },

  /* Add form */
  addFormCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    padding: s(16),
    marginBottom: vs(14),
  },
  addFormHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(14),
  },
  formRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    overflow: 'visible',
  },
  halfField: {width: '48%', zIndex: 10},
  addFormActions: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    gap: s(10),
    marginTop: vs(8),
  },
  cancelBtn: {
    paddingVertical: vs(10),
    paddingHorizontal: s(18),
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  submitBtn: {
    paddingVertical: vs(10),
    paddingHorizontal: s(22),
    borderRadius: ms(10),
    backgroundColor: Colors.primary,
  },

  /* Info card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    padding: s(14),
    marginBottom: vs(12),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    gap: s(10),
  },
  infoRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  infoLabel: {
    width: s(90),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontSize: ms(10),
  },
});

export default FamilyMembersScreen;
