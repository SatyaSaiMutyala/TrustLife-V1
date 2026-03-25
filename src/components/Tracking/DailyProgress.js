import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Circle} from 'react-native-svg';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';

const DailyProgress = () => (
  <View style={styles.card}>
    <View style={styles.ring}>
      <Svg width={ms(44)} height={ms(44)} viewBox="0 0 44 44">
        <Circle cx={22} cy={22} r={18} fill="none" stroke={Colors.background} strokeWidth={4} />
        <Circle cx={22} cy={22} r={18} fill="none" stroke={Colors.teal} strokeWidth={4} strokeDasharray="113" strokeDashoffset="72" strokeLinecap="round" rotation={-90} origin="22,22" />
      </Svg>
      <Text style={styles.pct}>36%</Text>
    </View>
    <View style={{flex: 1}}>
      <AppText variant="bodyBold">Today's log — 36% complete</AppText>
      <AppText variant="small" color={Colors.textSecondary} style={styles.sub}>5 of 14 entries logged · Medication due 8 PM</AppText>
    </View>
    <TouchableOpacity>
      <AppText variant="small" color={Colors.tealDark} style={styles.cta}>Log now ›</AppText>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingVertical: vs(11),
    paddingHorizontal: s(13),
    marginBottom: vs(14),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  ring: {width: ms(44), height: ms(44), alignItems: 'center', justifyContent: 'center'},
  pct: {position: 'absolute', fontSize: ms(12), fontWeight: '500', color: Colors.textPrimary},
  sub: {marginTop: vs(2)},
  cta: {fontWeight: '500'},
});

export default DailyProgress;
