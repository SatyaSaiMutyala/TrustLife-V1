import React from 'react';
import {View, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import SectionTitle from '../shared/SectionTitle';
import AppText from '../shared/AppText';

const conditions = [
  {label: 'Type 2 Diabetes', sub: 'Monitoring', color: Colors.red, bg: Colors.redBg, text: Colors.redDark},
  {label: 'Hypertension', sub: 'Controlled', color: Colors.amber, bg: Colors.amberBg, text: Colors.amberDark},
  {label: 'Dyslipidaemia', sub: 'On meds', color: Colors.blue, bg: Colors.blueBg, text: Colors.blueText},
];

const ActiveConditionsCard = () => (
  <View style={styles.card}>
    <SectionTitle title="Active Conditions" linkText="Manage ›" />
    <View style={styles.conditionsRow}>
      {conditions.map((c, i) => (
        <View key={i} style={[styles.pill, {backgroundColor: c.bg}]}>
          <View style={[styles.dot, {backgroundColor: c.color}]} />
          <AppText variant="small" color={c.text} style={styles.pillText}>
            {c.label}<AppText variant="small" color={c.text} style={styles.pillSub}> · {c.sub}</AppText>
          </AppText>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(13)},
  conditionsRow: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(7)},
  pill: {flexDirection: 'row', alignItems: 'center', gap: s(5), borderRadius: ms(20), paddingVertical: vs(5), paddingHorizontal: s(10)},
  dot: {width: ms(6), height: ms(6), borderRadius: ms(3)},
  pillText: {fontWeight: '500'},
  pillSub: {fontWeight: '400', opacity: 0.8},
});

export default ActiveConditionsCard;
