import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Emoji from '../shared/Emoji';
import {Ionicons} from '../shared/Icons';

const conditions = [
  {label: 'Type 2 Diabetes', dotColor: '#F09595'},
  {label: 'Hypertension', dotColor: '#FAC775'},
  {label: 'Dyslipidaemia', dotColor: '#85B7EB'},
];

const quickTiles = [
  {icon: '📅', label: 'My bookings', badge: '2 active'},
  {icon: '🎁', label: 'Invite friends', route: 'Referral'},
  {icon: '💬', label: 'Support'},
];

const ProfileHeader = ({onBack}) => {
  const navigation = useNavigation();
  return (
  <View style={styles.header}>
    <View style={styles.top}>
      <TouchableOpacity onPress={onBack} style={styles.backBtn}>
        <Ionicons name="chevron-back" size={ms(22)} color={Colors.white} />
      </TouchableOpacity>
      <View style={styles.avatar}>
        <Text style={styles.avatarText}>PR</Text>
      </View>
      <View style={{flex: 1}}>
        <AppText variant="header" color={Colors.white}>{`Priya Reddy`}</AppText>
        <AppText variant="small" color={Colors.heroTextMuted} style={styles.sub}>38 yrs · Female · B+ · Hyderabad</AppText>
      </View>
      <TouchableOpacity style={styles.editBtn} onPress={() => navigation.navigate('EditProfile')}>
        <AppText variant="small" color={Colors.white} style={styles.editText}>Edit ›</AppText>
      </TouchableOpacity>
    </View>

    <View style={styles.condRow}>
      {conditions.map((c, i) => (
        <View key={i} style={styles.condChip}>
          <View style={[styles.condDot, {backgroundColor: c.dotColor}]} />
          <AppText variant="caption" color="#b8e8d6">{c.label}</AppText>
        </View>
      ))}
    </View>

    <View style={styles.quickRow}>
      {quickTiles.map((t, i) => (
        <TouchableOpacity key={i} style={styles.quickTile} activeOpacity={0.7} onPress={() => t.route && navigation.navigate(t.route)}>
          <Emoji icon={t.icon} size={20} />
          <AppText variant="small" color="rgba(255,255,255,0.85)" style={styles.qtLabel}>{t.label}</AppText>
          {t.badge && (
            <View style={styles.qtBadge}>
              <AppText variant="small" color={Colors.white} style={styles.qtBadgeText}>{t.badge}</AppText>
            </View>
          )}
        </TouchableOpacity>
      ))}
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingTop: vs(14), paddingBottom: vs(24)},
  top: {flexDirection: 'row', alignItems: 'center', gap: s(13), marginBottom: vs(14)},
  backBtn: {width: ms(38), height: ms(38), borderRadius: ms(19), backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center'},
  avatar: {width: ms(54), height: ms(54), borderRadius: ms(27), backgroundColor: Colors.lightGreen, alignItems: 'center', justifyContent: 'center', borderWidth: 2.5, borderColor: 'rgba(255,255,255,0.3)'},
  avatarText: {fontSize: ms(20), fontWeight: '500', color: '#04342C'},
  sub: {marginTop: vs(3)},
  editBtn: {backgroundColor: 'rgba(255,255,255,0.15)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)', borderRadius: ms(20), paddingVertical: vs(5), paddingHorizontal: s(12)},
  editText: {fontWeight: '500'},
  condRow: {flexDirection: 'row', gap: s(5), flexWrap: 'wrap', marginBottom: vs(14)},
  condChip: {flexDirection: 'row', alignItems: 'center', gap: s(4), backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.18)', borderRadius: ms(20), paddingVertical: vs(3), paddingHorizontal: s(9)},
  condDot: {width: ms(5), height: ms(5), borderRadius: ms(3)},
  quickRow: {flexDirection: 'row', gap: s(7)},
  quickTile: {flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.18)', borderRadius: ms(14), paddingVertical: vs(11), paddingHorizontal: s(8), alignItems: 'center', gap: vs(5)},
  qtLabel: {fontWeight: '500', textAlign: 'center'},
  qtBadge: {backgroundColor: '#D85A30', borderRadius: ms(20), paddingVertical: vs(1), paddingHorizontal: s(6)},
  qtBadgeText: {fontWeight: '500', fontSize: ms(8)},
});

export default ProfileHeader;
