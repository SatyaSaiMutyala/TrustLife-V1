import React from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Emoji from '../shared/Emoji';
import SectionTitle from '../shared/SectionTitle';

const readings = [
  {icon: '🩸', name: 'Blood glucose', last: 'Last: 7:00 AM', val: '8.4', unit: 'mmol/L', valColor: Colors.redText, badgeText: 'Log again', badgeBg: Colors.redBg, badgeColor: Colors.redDark, urgent: true},
  {icon: '🫀', name: 'Blood pressure', last: 'Last: 8:30 AM', val: '138/88', unit: 'mmHg', valColor: Colors.amberText, badgeText: 'Elevated', badgeBg: Colors.amberBg, badgeColor: Colors.amberDark, urgent: true},
  {icon: '⚖️', name: 'Weight', last: 'Last: 3 days ago', val: '68.4', unit: 'kg', valColor: Colors.textPrimary, badgeText: 'On track', badgeBg: Colors.tealBg, badgeColor: Colors.tealText},
  {icon: '💓', name: 'Heart rate', last: 'Last: 8:30 AM', val: '74', unit: 'bpm', valColor: Colors.tealDark, badgeText: 'Normal', badgeBg: Colors.tealBg, badgeColor: Colors.tealText},
];

const PriorityReadings = () => (
  <View>
    <SectionTitle title="Priority Readings · Today" />
    <AppText variant="small" color={Colors.textTertiary} style={styles.sub}>Recommended for your conditions — Type 2 Diabetes · Hypertension</AppText>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
      {readings.map((r, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.card, r.urgent && styles.cardUrgent]}
          activeOpacity={0.7}>
          <Emoji icon={r.icon} size={20} />
          <AppText variant="bodyBold" style={styles.name}>{r.name}</AppText>
          <AppText variant="caption" color={Colors.textSecondary}>{r.last}</AppText>
          <Text style={[styles.val, {color: r.valColor}]}>
            {r.val} <Text style={styles.unit}>{r.unit}</Text>
          </Text>
          <View style={[styles.badge, {backgroundColor: r.badgeBg}]}>
            <AppText variant="small" color={r.badgeColor} style={styles.badgeText}>{r.badgeText}</AppText>
          </View>
        </TouchableOpacity>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  sub: {marginBottom: vs(9)},
  strip: {gap: s(7), paddingBottom: vs(4), marginBottom: vs(10)},
  card: {
    width: s(130),
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingVertical: vs(11),
    paddingHorizontal: s(12),
  },
  cardUrgent: {borderColor: '#F09595', borderWidth: 1.5},
  name: {fontSize: ms(12), marginTop: vs(6), marginBottom: vs(2)},
  val: {fontSize: ms(16), fontWeight: '500', marginTop: vs(5)},
  unit: {fontSize: ms(10), fontWeight: '400', color: Colors.textSecondary},
  badge: {alignSelf: 'flex-start', paddingVertical: vs(2), paddingHorizontal: s(6), borderRadius: ms(20), marginTop: vs(4)},
  badgeText: {fontWeight: '500', fontSize: ms(8)},
});

export default PriorityReadings;
