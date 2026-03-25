import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import AppText from '../shared/AppText';
import Emoji from '../shared/Emoji';
import SectionTitle from '../shared/SectionTitle';

const overview = [
  {val: '71%', lbl: 'Overall adherence', color: Colors.amberText},
  {val: '17', lbl: 'Perfect days', color: Colors.tealDark},
  {val: '5', lbl: 'PM doses missed', color: Colors.redText},
  {val: '7', lbl: 'Day streak', color: Colors.textPrimary},
];

const meds = [
  {icon: '💊', name: 'Metformin 500mg', dose: 'AM + PM · PM missed 5x this month', pct: '71%', pctColor: Colors.amberText, streak: 'PM is risk', progW: '71%', progC: Colors.amber},
  {icon: '💊', name: 'Amlodipine 5mg', dose: 'Morning · 100% this month', pct: '100%', pctColor: Colors.tealDark, streak: '30-day streak', progW: '100%', progC: Colors.teal},
  {icon: '💊', name: 'Atorvastatin 10mg', dose: 'Bedtime · 97% this month', pct: '97%', pctColor: Colors.tealDark, streak: '1 miss', progW: '97%', progC: Colors.teal},
];

const insights = [
  {dot: Colors.red, text: 'PM Metformin missed 5 times — directly impacts fasting glucose', pts: '−12 pts', ptsColor: Colors.redText},
  {dot: Colors.teal, text: 'Amlodipine 100% adherence — BP staying controlled', pts: '+8 pts', ptsColor: Colors.tealDark},
  {dot: Colors.teal, text: 'Atorvastatin consistency — LDL improvement sustained', pts: '+6 pts', ptsColor: Colors.tealDark},
  {dot: Colors.amber, text: 'Setting PM alarm could add +15 pts to your HPS', pts: 'Action', ptsColor: Colors.amberText},
];

const MedicationTab = () => (
  <View>
    <View style={styles.headerRow}>
      <SectionTitle title="Medical Engagement" />
      <AppText variant="bodyBold" color={Colors.amberText} style={styles.totalScore}>71 / 100</AppText>
    </View>

    {/* Overview */}
    <View style={styles.overviewRow}>
      {overview.map((o, i) => (
        <View key={i} style={styles.ovBox}>
          <Text style={[styles.ovVal, {color: o.color}]}>{o.val}</Text>
          <AppText variant="subtext" color={Colors.textTertiary} style={styles.ovLbl}>{o.lbl}</AppText>
        </View>
      ))}
    </View>

    {/* Medications */}
    <View style={styles.card}>
      {meds.map((m, i) => (
        <View key={i} style={[styles.medItem, i < meds.length - 1 && styles.medBorder]}>
          <View style={styles.medIco}><Emoji icon={m.icon} size={14} /></View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" style={styles.medName}>{m.name}</AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.medDose}>{m.dose}</AppText>
            <View style={styles.medProgBg}><View style={[styles.medProgFill, {width: m.progW, backgroundColor: m.progC}]} /></View>
          </View>
          <View style={{alignItems: 'flex-end', marginLeft: s(12)}}>
            <Text style={[styles.medPct, {color: m.pctColor}]}>{m.pct}</Text>
            <AppText variant="subtext" color={Colors.textTertiary}>{m.streak}</AppText>
          </View>
        </View>
      ))}
    </View>

    {/* Insights */}
    <SectionTitle title="Medical Insights" />
    <View style={styles.card}>
      {insights.map((ins, i) => (
        <View key={i} style={[styles.insRow, i < insights.length - 1 && styles.medBorder]}>
          <View style={[styles.insDot, {backgroundColor: ins.dot}]} />
          <AppText variant="body" style={styles.insText}>{ins.text}</AppText>
          <AppText variant="small" color={ins.ptsColor} style={styles.insPts}>{ins.pts}</AppText>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  totalScore: {marginBottom: vs(8)},
  overviewRow: {flexDirection: 'row', gap: s(7), marginBottom: vs(12)},
  ovBox: {flex: 1, borderRadius: ms(12), borderWidth: 0.5, borderColor: Colors.borderLight, paddingVertical: vs(10), paddingHorizontal: s(6), alignItems: 'center', backgroundColor: Colors.background},
  ovVal: {fontSize: Fonts.sizes.title, fontWeight: '500'},
  ovLbl: {marginTop: vs(2), textAlign: 'center'},
  card: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: Colors.borderLight, marginBottom: vs(12), overflow: 'hidden'},
  medItem: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(10), paddingHorizontal: s(13)},
  medBorder: {borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  medIco: {width: ms(30), height: ms(30), borderRadius: ms(8), backgroundColor: Colors.purpleBg, alignItems: 'center', justifyContent: 'center'},
  medName: {fontSize: ms(12)},
  medDose: {marginTop: vs(1)},
  medProgBg: {height: vs(3), backgroundColor: Colors.background, borderRadius: ms(2), overflow: 'hidden', marginTop: vs(6)},
  medProgFill: {height: '100%', borderRadius: ms(2)},
  medPct: {fontSize: Fonts.sizes.title, fontWeight: '500'},
  insRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(11), paddingHorizontal: s(13)},
  insDot: {width: ms(6), height: ms(6), borderRadius: ms(3)},
  insText: {flex: 1, fontSize: ms(12)},
  insPts: {fontWeight: '500'},
});

export default MedicationTab;
