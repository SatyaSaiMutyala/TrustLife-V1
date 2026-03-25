import React from 'react';
import {View, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import SectionTitle from '../shared/SectionTitle';

const stats = [
  {val: '78', lbl: 'Wellness score', delta: '↑ +4', deltaColor: Colors.tealDark, valColor: Colors.primary},
  {val: '7.8%', lbl: 'HbA1c', delta: '↑ from 7.5', deltaColor: Colors.redText, valColor: Colors.amberText},
  {val: '7', lbl: 'Day streak', delta: 'Best: 14', deltaColor: Colors.tealDark, valColor: Colors.textPrimary},
  {val: '54%', lbl: 'Test ready', delta: 'Apr 4', deltaColor: Colors.redText, valColor: Colors.redText},
];

const HealthSummary = () => (
  <View>
    <SectionTitle title="Health Summary" />
    <View style={styles.grid}>
      {stats.map((st, i) => (
        <View key={i} style={styles.box}>
          <AppText variant="header" color={st.valColor} style={styles.val}>{st.val}</AppText>
          <AppText variant="subtext" color={Colors.textTertiary} style={styles.lbl}>{st.lbl}</AppText>
          <AppText variant="subtext" color={st.deltaColor} style={styles.delta}>{st.delta}</AppText>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  grid: {flexDirection: 'row', gap: s(7), marginBottom: vs(14)},
  box: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: Colors.borderLight, paddingVertical: vs(10), paddingHorizontal: s(8), alignItems: 'center'},
  val: {fontSize: ms(17)},
  lbl: {marginTop: vs(3)},
  delta: {marginTop: vs(2)},
});

export default HealthSummary;
