import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import AppText from '../shared/AppText';
import Emoji from '../shared/Emoji';

const G = Colors.teal, A = Colors.amber, R = Colors.red;

const biomarkers = [
  {
    icon: '🧪', iconBg: Colors.redBg, name: 'HbA1c', sub: 'Glycated haemoglobin · 90-day window', score: 42, scoreColor: Colors.redText,
    dims: [
      {icon: '📊', name: 'STATUS', val: '7.8%', valColor: Colors.redText, lbl: 'Target <7.0%', w: '40%', c: R},
      {icon: '📉', name: 'STABILITY', val: 'Low', valColor: Colors.amberText, lbl: 'Rising 3 cycles', w: '35%', c: A},
      {icon: '⚡', name: 'VELOCITY', val: '↑ +0.3%', valColor: Colors.redText, lbl: 'Per 6 months', w: '25%', c: R},
    ],
    trend: [{h:14,c:G},{h:14,c:G},{h:16,c:A},{h:18,c:A},{h:18,c:R}],
    trendLbl: '6.9 → 7.2 → 7.5 → 7.8%',
  },
  {
    icon: '🫀', iconBg: Colors.tealBg, name: 'Blood pressure', sub: '7-day rolling average', score: 61, scoreColor: Colors.amberText,
    dims: [
      {icon: '📊', name: 'STATUS', val: '138/88', valColor: Colors.amberText, lbl: 'Target <130/80', w: '55%', c: A},
      {icon: '📉', name: 'STABILITY', val: 'Moderate', valColor: Colors.amberText, lbl: '±6 mmHg variance', w: '58%', c: A},
      {icon: '⚡', name: 'VELOCITY', val: '→ Flat', valColor: Colors.tealDark, lbl: 'Stable this month', w: '65%', c: G},
    ],
    trend: [{h:14,c:A},{h:16,c:R},{h:12,c:G},{h:14,c:A},{h:15,c:A},{h:16,c:R},{h:14,c:A}],
    trendLbl: 'avg 138/87',
  },
  {
    icon: '🩸', iconBg: Colors.redBg, name: 'Blood glucose', sub: 'Fasting · Post-meal readings', score: 48, scoreColor: Colors.redText,
    dims: [
      {icon: '📊', name: 'STATUS', val: '8.4', valColor: Colors.redText, lbl: 'Target <7.0 mmol/L', w: '38%', c: R},
      {icon: '📉', name: 'STABILITY', val: 'High var.', valColor: Colors.redText, lbl: '6.8–11.2 range', w: '30%', c: R},
      {icon: '⚡', name: 'VELOCITY', val: '↗ Slow rise', valColor: Colors.amberText, lbl: '+0.4 this month', w: '42%', c: A},
    ],
  },
  {
    icon: '🩺', iconBg: Colors.blueBg, name: 'Lipid panel (LDL)', sub: 'Most recent: Mar 2026', score: 78, scoreColor: Colors.tealDark,
    dims: [
      {icon: '📊', name: 'STATUS', val: '118', valColor: Colors.tealDark, lbl: 'Target <130 mg/dL', w: '78%', c: G},
      {icon: '📉', name: 'STABILITY', val: 'Good', valColor: Colors.tealDark, lbl: 'Consistent trend', w: '80%', c: G},
      {icon: '⚡', name: 'VELOCITY', val: '↓ Improving', valColor: Colors.tealDark, lbl: '−14 mg/dL since Sep', w: '82%', c: G},
    ],
  },
];

const BiomarkersTab = () => (
  <View>
    <View style={styles.infoBanner}>
      <Emoji icon="📊" size={14} />
      <AppText variant="small" color={Colors.purpleText} style={styles.infoText}>
        Biomarker score: <Text style={styles.infoBold}>58/100</Text> · Contributes 50% to your HPS. Status, stability and velocity each scored per biomarker.
      </AppText>
    </View>

    {biomarkers.map((bm, i) => (
      <View key={i} style={styles.card}>
        <View style={styles.header}>
          <View style={[styles.ico, {backgroundColor: bm.iconBg}]}><Emoji icon={bm.icon} size={16} /></View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold">{bm.name}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>{bm.sub}</AppText>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <Text style={[styles.score, {color: bm.scoreColor}]}>{bm.score}<Text style={styles.scoreOf}>/100</Text></Text>
            <AppText variant="subtext" color={Colors.textTertiary} style={styles.scoreLbl}>Biomarker score</AppText>
          </View>
        </View>

        <View style={styles.dimsRow}>
          {bm.dims.map((d, j) => (
            <View key={j} style={[styles.dim, j < bm.dims.length - 1 && styles.dimBorder]}>
              <Emoji icon={d.icon} size={13} />
              <AppText variant="subtext" color={Colors.textTertiary} style={styles.dimName}>{d.name}</AppText>
              <AppText variant="bodyBold" color={d.valColor} style={styles.dimVal}>{d.val}</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={styles.dimLbl}>{d.lbl}</AppText>
              <View style={styles.dimBar}><View style={[styles.dimFill, {width: d.w, backgroundColor: d.c}]} /></View>
            </View>
          ))}
        </View>

        {bm.trend && (
          <View style={styles.trendRow}>
            <AppText variant="caption" color={Colors.textTertiary}>Trend:</AppText>
            <View style={styles.trendBars}>
              {bm.trend.map((t, j) => (
                <View key={j} style={[styles.trendBar, {height: vs(t.h), backgroundColor: t.c}]} />
              ))}
            </View>
            <AppText variant="caption" color={Colors.textTertiary}>{bm.trendLbl}</AppText>
          </View>
        )}
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  infoBanner: {backgroundColor: Colors.purpleBg, borderRadius: ms(10), paddingVertical: vs(9), paddingHorizontal: s(12), flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(12)},
  infoText: {flex: 1, lineHeight: ms(16)},
  infoBold: {fontWeight: '600'},
  card: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: Colors.borderLight, marginBottom: vs(10), overflow: 'hidden'},
  header: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(12), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  ico: {width: ms(34), height: ms(34), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center'},
  score: {fontSize: Fonts.sizes.title, fontWeight: '500'},
  scoreOf: {fontSize: Fonts.sizes.caption, fontWeight: '400', color: Colors.textTertiary},
  scoreLbl: {marginTop: vs(1)},
  dimsRow: {flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  dim: {flex: 1, paddingVertical: vs(10), paddingHorizontal: s(8), alignItems: 'center'},
  dimBorder: {borderRightWidth: 0.5, borderRightColor: Colors.borderLight},
  dimName: {fontWeight: '500', letterSpacing: 0.3, marginTop: vs(3)},
  dimVal: {fontSize: ms(14), marginTop: vs(2)},
  dimLbl: {marginTop: vs(2), textAlign: 'center'},
  dimBar: {height: vs(3), borderRadius: ms(2), backgroundColor: Colors.background, overflow: 'hidden', marginTop: vs(5), width: '100%'},
  dimFill: {height: '100%', borderRadius: ms(2)},
  trendRow: {flexDirection: 'row', alignItems: 'center', gap: s(8), paddingVertical: vs(8), paddingHorizontal: s(13)},
  trendBars: {flexDirection: 'row', gap: ms(2), alignItems: 'flex-end', height: vs(18), flex: 1},
  trendBar: {flex: 1, borderTopLeftRadius: ms(1), borderTopRightRadius: ms(1)},
});

export default BiomarkersTab;
