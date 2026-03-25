import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Emoji from '../shared/Emoji';
import SectionTitle from '../shared/SectionTitle';

const G = Colors.teal, A = Colors.amber, R = Colors.red;

const conditions = [
  {
    name: 'Type 2 Diabetes', badge: 'Worsening', badgeBg: Colors.redBg, badgeColor: Colors.redDark,
    bars: [{h:10,c:G},{h:12,c:G},{h:14,c:A},{h:16,c:A},{h:18,c:R},{h:20,c:R}],
    status: ['HbA1c rising — ', '7.8% this month', '. Lifestyle changes critical before Apr 4 test.'],
  },
  {
    name: 'Hypertension', badge: 'Stable', badgeBg: Colors.amberBg, badgeColor: Colors.amberDark,
    bars: [{h:14,c:A},{h:16,c:R},{h:13,c:A},{h:14,c:A},{h:15,c:A},{h:14,c:A}],
    status: ['BP ', '138/88', ' — controlled but above target. Amlodipine helping.'],
  },
  {
    name: 'Dyslipidaemia', badge: 'Improving', badgeBg: Colors.tealBg, badgeColor: Colors.tealText,
    bars: [{h:18,c:R},{h:16,c:A},{h:14,c:A},{h:13,c:G},{h:11,c:G},{h:10,c:G}],
    status: ['LDL dropped to ', '118 mg/dL', '. Atorvastatin working well. Within target range.'],
  },
];

const organs = [
  {icon: '🫀', name: 'Heart', badge: 'Monitor', badgeBg: Colors.amberBg, badgeColor: Colors.amberDark, metric: 'BP:', val: '138/88 mmHg', progW: '72%', progC: A, note: 'Slightly elevated. Stable on Amlodipine.'},
  {icon: '🫘', name: 'Kidneys', badge: 'Monitor', badgeBg: Colors.amberBg, badgeColor: Colors.amberDark, metric: 'eGFR:', val: '74 mL/min', progW: '74%', progC: A, note: 'Mild reduction. Hydration critical.'},
  {icon: '👁️', name: 'Eyes', badge: 'Overdue', badgeBg: Colors.redBg, badgeColor: Colors.redDark, metric: 'Last exam:', val: '14 months ago', progW: '15%', progC: R, note: 'Retinopathy screening due. Book now.', urgent: true},
  {icon: '🫁', name: 'Liver', badge: 'Good', badgeBg: Colors.tealBg, badgeColor: Colors.tealText, metric: 'ALT:', val: '28 U/L', progW: '82%', progC: G, note: 'Normal range. Metformin well tolerated.'},
];

const ConditionsTab = () => {
  const {width} = useWindowDimensions();
  const cardW = (width - s(12) * 2 - s(8)) / 2;

  return (
    <View>
      <View style={styles.ctxBanner}>
        <Emoji icon="ℹ️" size={14} />
        <AppText variant="small" color={Colors.textTertiary} style={styles.ctxText}>
          Condition and organ sections are <Text style={styles.ctxBold}>contextual</Text> — they show your clinical picture but do not contribute to your HPS score.
        </AppText>
      </View>

      <SectionTitle title="Condition Progress" />
      <View style={styles.grid}>
        {conditions.map((c, i) => (
          <View key={i} style={[styles.condCard, {width: cardW}]}>
            <View style={styles.ccTop}>
              <AppText variant="bodyBold" style={styles.ccName}>{c.name}</AppText>
              <View style={[styles.ccBadge, {backgroundColor: c.badgeBg}]}>
                <AppText variant="small" color={c.badgeColor} style={styles.ccBadgeText}>{c.badge}</AppText>
              </View>
            </View>
            <View style={styles.ccTrend}>
              {c.bars.map((b, j) => (
                <View key={j} style={[styles.ccBar, {height: vs(b.h), backgroundColor: b.c}]} />
              ))}
            </View>
            <AppText variant="small" color={Colors.textSecondary} style={styles.ccStatus}>
              {c.status[0]}<Text style={styles.ccBold}>{c.status[1]}</Text>{c.status[2]}
            </AppText>
          </View>
        ))}
        <TouchableOpacity style={[styles.addCard, {width: cardW}]}>
          <AppText variant="header" color={Colors.textSecondary} style={styles.addPlus}>+</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={styles.addLabel}>Add condition</AppText>
          <AppText variant="caption" color={Colors.textTertiary} style={styles.addSub}>Track more health conditions</AppText>
        </TouchableOpacity>
      </View>

      <SectionTitle title="Organ Health Progress" />
      <View style={styles.grid}>
        {organs.map((o, i) => (
          <View key={i} style={[styles.organCard, {width: cardW}, o.urgent && {borderColor: '#F09595', borderWidth: 1.5}]}>
            <View style={styles.ocTop}>
              <Emoji icon={o.icon} size={20} />
              <AppText variant="bodyBold" style={styles.ocName}>{o.name}</AppText>
              <View style={[styles.ocBadge, {backgroundColor: o.badgeBg}]}>
                <AppText variant="small" color={o.badgeColor} style={styles.ocBadgeText}>{o.badge}</AppText>
              </View>
            </View>
            <AppText variant="small" color={Colors.textSecondary} style={styles.ocMetric}>{o.metric} <Text style={styles.ocVal}>{o.val}</Text></AppText>
            <View style={styles.ocBar}><View style={[styles.ocFill, {width: o.progW, backgroundColor: o.progC}]} /></View>
            <AppText variant="caption" color={Colors.textTertiary} style={styles.ocNote}>{o.note}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  ctxBanner: {backgroundColor: Colors.background, borderRadius: ms(10), paddingVertical: vs(8), paddingHorizontal: s(11), flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(10)},
  ctxText: {flex: 1, lineHeight: ms(16)},
  ctxBold: {fontWeight: '600'},
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(10)},
  condCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(13)},
  ccTop: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(8)},
  ccName: {fontSize: ms(12), flex: 1},
  ccBadge: {paddingVertical: vs(2), paddingHorizontal: s(6), borderRadius: ms(20)},
  ccBadgeText: {fontWeight: '500', fontSize: ms(8)},
  ccTrend: {flexDirection: 'row', gap: ms(2), alignItems: 'flex-end', height: vs(24), marginBottom: vs(6)},
  ccBar: {flex: 1, borderTopLeftRadius: ms(1), borderTopRightRadius: ms(1)},
  ccStatus: {lineHeight: ms(16)},
  ccBold: {fontWeight: '500', color: Colors.textPrimary},
  addCard: {backgroundColor: Colors.background, borderRadius: ms(14), borderWidth: 1, borderStyle: 'dashed', borderColor: Colors.borderLight, padding: ms(13), alignItems: 'center', justifyContent: 'center'},
  addPlus: {fontSize: ms(22), marginBottom: vs(6)},
  addLabel: {fontWeight: '500'},
  addSub: {marginTop: vs(2)},
  organCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(12)},
  ocTop: {flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(8)},
  ocName: {fontSize: ms(12), flex: 1},
  ocBadge: {paddingVertical: vs(2), paddingHorizontal: s(6), borderRadius: ms(20)},
  ocBadgeText: {fontWeight: '500', fontSize: ms(8)},
  ocMetric: {marginBottom: vs(4)},
  ocVal: {fontWeight: '500', color: Colors.textPrimary},
  ocBar: {height: vs(4), backgroundColor: Colors.background, borderRadius: ms(2), overflow: 'hidden', marginBottom: vs(5)},
  ocFill: {height: '100%', borderRadius: ms(2)},
  ocNote: {lineHeight: ms(14)},
});

export default ConditionsTab;
