import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../../components/shared/AppText';
import Colors from '../../../constants/colors';
import {DEPENDENTS} from '../../../constants/profileData';

/* ── helpers ────────────────────────────────────────── */

const CAT_COLORS = {
  infant: {bg: '#FDE8D0', text: '#7A3B0A'},
  minor:  {bg: '#EAF2FB', text: '#1A5276'},
  adult:  {bg: Colors.tealBg, text: Colors.accent},
};

const avatarBg = category =>
  category === 'infant' ? '#FDE8D0' : category === 'minor' ? '#EAF2FB' : Colors.tealBg;

/* ── Component ──────────────────────────────────────── */

const DependentsTab = () => {
  const [showAddForm, setShowAddForm] = useState(false);

  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>

      {/* ── Registered Dependents ─────────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="bodyBold" style={styles.cardTitle}>Registered Dependents</AppText>
          <View style={styles.totalBadge}>
            <AppText variant="small" color={Colors.accent}>{DEPENDENTS.length} total</AppText>
          </View>
        </View>

        {DEPENDENTS.map((dep, idx) => {
          const cat = CAT_COLORS[dep.category] || CAT_COLORS.adult;
          return (
            <View key={idx} style={[styles.depCard, idx < DEPENDENTS.length - 1 && styles.depCardBorder]}>
              {/* Category badge */}
              <View style={[styles.catBadge, {backgroundColor: cat.bg}]}>
                <AppText variant="small" color={cat.text} style={styles.catBadgeText}>
                  {dep.category === 'infant' ? 'Infant' : dep.category === 'minor' ? 'Minor' : 'Adult'}
                </AppText>
              </View>

              {/* Avatar + name */}
              <View style={styles.depTopRow}>
                <View style={[styles.avatar, {backgroundColor: avatarBg(dep.category)}]}>
                  <AppText variant="bodyBold" color={cat.text} style={styles.avatarText}>
                    {dep.initials}
                  </AppText>
                </View>
                <View style={{flex: 1}}>
                  <AppText variant="bodyBold">{dep.name}</AppText>
                  <AppText variant="caption" color={Colors.textSecondary}>{dep.relation}</AppText>
                </View>
              </View>

              {/* Detail rows */}
              <View style={styles.detailGrid}>
                <DetailRow label="DOB" value={dep.dob} />
                <DetailRow label="Age" value={dep.age} />
                <DetailRow label="Blood Group" value={dep.blood} />
                {dep.school ? (
                  <DetailRow label="School" value={dep.school} />
                ) : (
                  <DetailRow label="ID" value={dep.id} />
                )}
              </View>

              {/* Action buttons */}
              <View style={styles.actionRow}>
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                  <AppText variant="small" color={Colors.accent} style={styles.actionText}>Edit</AppText>
                </TouchableOpacity>
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                  <AppText variant="small" color={Colors.accent} style={styles.actionText}>View</AppText>
                </TouchableOpacity>
                <TouchableOpacity style={[styles.actionBtn, styles.dangerBtn]} activeOpacity={0.7}>
                  <AppText variant="small" color="#9B3A4A" style={styles.actionText}>Remove</AppText>
                </TouchableOpacity>
              </View>
            </View>
          );
        })}
      </View>

      {/* ── Add Dependent toggle ─────────────────────── */}
      <TouchableOpacity
        style={styles.addBtn}
        activeOpacity={0.7}
        onPress={() => setShowAddForm(!showAddForm)}>
        <AppText variant="bodyBold" color={Colors.accent}>+ Add a Dependent</AppText>
      </TouchableOpacity>

      {/* ── Guardian / Consent Settings ──────────────── */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.cardTitle}>Guardian / Consent Settings</AppText>

        <InfoRow label="Guardian Role" value="Primary Guardian" />
        <InfoRow label="Consent Auth." value="Full medical & educational" />
        <View style={styles.infoRow}>
          <AppText variant="caption" color={Colors.textSecondary} style={styles.infoLabel}>Secondary Guardian</AppText>
          <View style={styles.infoValueRow}>
            <AppText variant="body" style={{flex: 1}}>Karthik Raghunathan</AppText>
            <TouchableOpacity activeOpacity={0.7}>
              <AppText variant="small" color={Colors.accent} style={styles.actionText}>Edit</AppText>
            </TouchableOpacity>
          </View>
        </View>
        <InfoRow label="Data Privacy" value="HIPAA-compliant, restricted sharing" last />
      </View>

      <View style={{height: vs(32)}} />
    </ScrollView>
  );
};

/* ── sub-components ─────────────────────────────────── */

const DetailRow = ({label, value}) => (
  <View style={styles.detailRow}>
    <AppText variant="caption" color={Colors.textSecondary} style={styles.detailLabel}>{label}</AppText>
    <AppText variant="caption">{value}</AppText>
  </View>
);

const InfoRow = ({label, value, last}) => (
  <View style={[styles.infoRow, !last && styles.infoRowBorder]}>
    <AppText variant="caption" color={Colors.textSecondary} style={styles.infoLabel}>{label}</AppText>
    <AppText variant="body">{value}</AppText>
  </View>
);

/* ── styles ─────────────────────────────────────────── */

const styles = StyleSheet.create({
  root: {flex: 1, padding: s(16)},

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    
    
    padding: s(16),
    marginBottom: vs(16),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  cardTitle: {fontSize: ms(15)},
  totalBadge: {
    backgroundColor: Colors.tealBg,
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(12),
  },

  /* Dependent card */
  depCard: {paddingVertical: vs(14)},
  depCardBorder: {borderBottomWidth: 1, borderBottomColor: '#F0EEEA'},
  catBadge: {
    alignSelf: 'flex-end',
    paddingHorizontal: s(10),
    paddingVertical: vs(2),
    borderRadius: ms(10),
    marginBottom: vs(6),
  },
  catBadgeText: {fontSize: ms(10), fontWeight: '600'},
  depTopRow: {flexDirection: 'row', alignItems: 'center', gap: s(12), marginBottom: vs(10)},
  avatar: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {fontSize: ms(16)},

  /* Detail grid */
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginBottom: vs(10),
  },
  detailRow: {
    backgroundColor: '#F9F8F5',
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
  },
  detailLabel: {fontSize: ms(9), marginBottom: vs(1)},

  /* Actions */
  actionRow: {flexDirection: 'row', gap: s(10)},
  actionBtn: {
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: ms(8),
    backgroundColor: Colors.tealBg,
  },
  dangerBtn: {backgroundColor: '#FAEAED'},
  actionText: {fontSize: ms(11), fontWeight: '600'},

  /* Add button */
  addBtn: {
    borderWidth: 1.5,
    borderColor: Colors.accent,
    borderStyle: 'dashed',
    borderRadius: ms(16),
    paddingVertical: vs(14),
    alignItems: 'center',
    marginBottom: vs(16),
  },

  /* Info rows */
  infoRow: {paddingVertical: vs(10)},
  infoRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F0EEEA'},
  infoLabel: {fontSize: ms(11), marginBottom: vs(2)},
  infoValueRow: {flexDirection: 'row', alignItems: 'center'},
});

export default DependentsTab;
