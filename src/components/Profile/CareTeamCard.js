import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Emoji from '../shared/Emoji';
import SectionTitle from '../shared/SectionTitle';

const doctors = [
  {initials: 'KR', bg: Colors.blueBg, color: Colors.blueText, name: 'Dr. Kavitha Reddy', role: 'Endocrinologist · KIMS Hospital', next: 'Next visit: Apr 4, 2026'},
  {initials: 'SR', bg: Colors.amberBg, color: Colors.amberDark, name: 'Dr. Suresh Rao', role: 'Cardiologist · Apollo Hospitals', next: 'Next visit: Jul 2026'},
  {initials: 'AJ', bg: Colors.tealBg, color: Colors.tealText, name: 'Dr. Anjali Joshi', role: 'General Physician · MediCare Clinic', next: 'Last visit: Dec 2025'},
];

const CareTeamCard = () => (
  <View>
    <SectionTitle title="My Care Team" />
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <AppText variant="bodyBold">3 doctors · 1 hospital</AppText>
        <TouchableOpacity><AppText variant="small" color={Colors.tealDark} style={styles.addText}>+ Add member</AppText></TouchableOpacity>
      </View>
      {doctors.map((d, i) => (
        <View key={i} style={[styles.row, i < doctors.length - 1 && styles.rowBorder]}>
          <View style={[styles.avatar, {backgroundColor: d.bg}]}>
            <AppText variant="bodyBold" color={d.color}>{d.initials}</AppText>
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" style={styles.name}>{d.name}</AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.role}>{d.role}</AppText>
            <AppText variant="caption" color={Colors.textTertiary} style={styles.next}>{d.next}</AppText>
          </View>
          <View style={styles.btns}>
            <TouchableOpacity style={styles.ctBtn}><Emoji icon="📞" size={13} /></TouchableOpacity>
            <TouchableOpacity style={styles.ctBtn}><Emoji icon="💬" size={13} /></TouchableOpacity>
          </View>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: Colors.borderLight, marginBottom: vs(14), overflow: 'hidden'},
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: vs(11), paddingHorizontal: s(14), borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  addText: {fontWeight: '500'},
  row: {flexDirection: 'row', alignItems: 'center', gap: s(11), paddingVertical: vs(10), paddingHorizontal: s(14)},
  rowBorder: {borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  avatar: {width: ms(36), height: ms(36), borderRadius: ms(18), alignItems: 'center', justifyContent: 'center'},
  name: {fontSize: ms(12)},
  role: {marginTop: vs(1)},
  next: {marginTop: vs(1)},
  btns: {flexDirection: 'row', gap: s(5)},
  ctBtn: {width: ms(28), height: ms(28), borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center'},
});

export default CareTeamCard;
