import React from 'react';
import {View, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import Emoji from '../shared/Emoji';
import AppText from '../shared/AppText';

const TestReadinessCard = () => (
  <View style={styles.card}>
    <View style={styles.row}>
      <View style={styles.icon}><Emoji icon="🧪" size={17} /></View>
      <View style={styles.info}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>HbA1c test in 14 days</AppText>
        <AppText variant="small" color={Colors.textSecondary} style={styles.sub}>4 Apr · Apollo Diagnostics · Dr. Kavitha</AppText>
      </View>
      <View style={styles.badge}><AppText variant="small" color={Colors.redText} style={styles.badgeText}>At risk</AppText></View>
    </View>
    <View style={styles.readRow}>
      <AppText variant="caption" color={Colors.textSecondary}>Test readiness</AppText>
      <AppText variant="caption" color={Colors.amberText} style={styles.readVal}>54 / 100 · needs attention</AppText>
    </View>
    <View style={styles.progBg}>
      <View style={[styles.progFill, {width: '54%', backgroundColor: Colors.amber}]} />
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(13)},
  row: {flexDirection: 'row', alignItems: 'center', gap: s(10)},
  icon: {width: ms(38), height: ms(38), borderRadius: ms(11), backgroundColor: Colors.redBg, alignItems: 'center', justifyContent: 'center'},
  info: {flex: 1},
  sub: {marginTop: vs(2)},
  badge: {backgroundColor: Colors.redBg, paddingVertical: vs(3), paddingHorizontal: s(8), borderRadius: ms(20)},
  badgeText: {fontWeight: '500'},
  readRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(8), marginBottom: vs(3)},
  readVal: {fontWeight: '500'},
  progBg: {height: vs(5), backgroundColor: Colors.background, borderRadius: ms(3), overflow: 'hidden'},
  progFill: {height: '100%', borderRadius: ms(3)},
});

export default TestReadinessCard;
