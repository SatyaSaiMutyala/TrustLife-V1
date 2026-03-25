import React from 'react';
import {View, StyleSheet, useWindowDimensions} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import SectionTitle from '../shared/SectionTitle';
import Emoji from '../shared/Emoji';
import AppText from '../shared/AppText';

const organs = [
  {icon: '🫀', name: 'Heart', status: 'Monitor', ss: 'watch', metric: 'BP:', mv: '138 / 88 mmHg', bw: '72%', bc: Colors.amber, note: 'Slightly elevated. Dyslipidaemia adds cardiovascular risk.'},
  {icon: '🫘', name: 'Kidneys', status: 'Monitor', ss: 'watch', metric: 'eGFR:', mv: '74 mL/min', bw: '74%', bc: Colors.amber, note: 'Mild reduction. Hydration critical. Next check in 3 months.'},
  {icon: '👁️', name: 'Eyes', status: 'At risk', ss: 'risk', metric: 'Last eye exam:', mv: '14 months ago', bw: '35%', bc: Colors.red, note: 'Overdue for diabetic retinopathy screening. Book now.'},
  {icon: '🫁', name: 'Liver', status: 'Good', ss: 'good', metric: 'ALT:', mv: '28 U/L', bw: '82%', bc: Colors.teal, note: 'Within normal range. Metformin well tolerated.'},
];

const sm = {good: {bg: Colors.tealBg, c: Colors.tealText}, watch: {bg: Colors.amberBg, c: Colors.amberDark}, risk: {bg: Colors.redBg, c: Colors.redDark}};

const OrganHealthGrid = () => {
  const {width} = useWindowDimensions();
  const cardW = (width - s(12) * 2 - s(8)) / 2;

  return (
    <View>
      <SectionTitle title="Organ Health Snapshot" linkText="Details ›" />
      <View style={styles.grid}>
        {organs.map((o, i) => (
          <View key={i} style={[styles.card, {width: cardW}]}>
            <View style={styles.top}>
              <Emoji icon={o.icon} size={20} />
              <AppText variant="bodyBold" color={Colors.textPrimary} style={styles.name}>{o.name}</AppText>
              <View style={[styles.statusBadge, {backgroundColor: sm[o.ss].bg}]}>
                <AppText variant="small" color={sm[o.ss].c} style={styles.statusText}>{o.status}</AppText>
              </View>
            </View>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.metric}>
              {o.metric} <AppText variant="caption" color={Colors.textPrimary} style={styles.metricVal}>{o.mv}</AppText>
            </AppText>
            <View style={styles.barBg}><View style={[styles.barFill, {width: o.bw, backgroundColor: o.bc}]} /></View>
            <AppText variant="caption" color={Colors.textTertiary}>{o.note}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(18)},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(12)},
  top: {flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(8)},
  name: {flex: 1},
  statusBadge: {paddingVertical: vs(2), paddingHorizontal: s(7), borderRadius: ms(20)},
  statusText: {fontWeight: '500'},
  metric: {marginBottom: vs(3)},
  metricVal: {fontWeight: '500'},
  barBg: {height: vs(4), backgroundColor: Colors.background, borderRadius: ms(2), overflow: 'hidden', marginBottom: vs(5)},
  barFill: {height: '100%', borderRadius: ms(2)},
});

export default OrganHealthGrid;
