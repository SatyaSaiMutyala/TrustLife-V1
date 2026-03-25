import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Modal, ScrollView, Pressable} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Path, Circle as SvgCircle, Defs, LinearGradient, Stop, Text as SvgText} from 'react-native-svg';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import AppText from '../shared/AppText';
import Emoji from '../shared/Emoji';
import {Ionicons} from '../shared/Icons';
import SectionTitle from '../shared/SectionTitle';

const G = Colors.lightGreen, A = Colors.amber, R = Colors.red, T = Colors.teal;

const contribs = [
  {icon: '🧬', iconBg: Colors.redBg, name: 'Biomarker progress', wt: '50% weight · max 300 pts', score: '58', scoreColor: Colors.redText, pts: '174', ptsMax: 'of 300 pts', barW: '58%', barC: R},
  {icon: '🏃', iconBg: Colors.amberBg, name: 'Lifestyle habits', wt: '30% weight · max 180 pts', score: '50', scoreColor: Colors.amberText, pts: '90', ptsMax: 'of 180 pts', barW: '50%', barC: A},
  {icon: '💊', iconBg: Colors.purpleBg, name: 'Medical engagement', wt: '20% weight · max 120 pts', score: '78', scoreColor: Colors.tealDark, pts: '94', ptsMax: 'of 120 pts', barW: '78%', barC: T},
];

const pulls = [
  {dot: R, text: 'HbA1c 7.8% — 0.8% above target. Biggest single drag.', pts: '−38 pts', ptsColor: Colors.redText},
  {dot: R, text: 'Sleep avg 5.9h — 1.6h below target. Rising HbA1c risk.', pts: '−27 pts', ptsColor: Colors.redText},
  {dot: A, text: 'Hydration 0 days hit target — zero consistency.', pts: '−22 pts', ptsColor: Colors.amberText},
  {dot: A, text: 'Metformin PM dose — missed 5x in 30 days.', pts: '−14 pts', ptsColor: Colors.amberText},
  {dot: T, text: 'LDL improving — down 14 mg/dL since Sep 2025.', pts: '+18 pts', ptsColor: Colors.tealDark},
  {dot: T, text: 'Amlodipine 100% adherence — 30-day streak.', pts: '+14 pts', ptsColor: Colors.tealDark},
];

const summaryRows = [
  {lbl: 'Base score (all patients)', val: '300 pts'},
  {lbl: 'Biomarker progress (58/100 × 300)', val: '174 pts'},
  {lbl: 'Lifestyle habits (50/100 × 180)', val: '90 pts'},
  {lbl: 'Medical engagement (78/100 × 120)', val: '94 pts'},
];

const sparkBars = [
  {h: 10, c: A}, {h: 12, c: A}, {h: 9, c: R}, {h: 13, c: A},
  {h: 14, c: A}, {h: 18, c: T}, {h: 16, c: T}, {h: 20, c: T},
];

const HPSScoreTab = () => {
  const [sheetVisible, setSheetVisible] = useState(false);

  return (
    <View>
      {/* Main HPS Card */}
      <View style={styles.card}>
        <View style={styles.topRow}>
          <View>
            <AppText variant="bodyBold" color={Colors.textSecondary} style={styles.label}>Health Progress Score</AppText>
            <AppText variant="caption" color={Colors.textTertiary}>Range 300–900 · Biomarkers 50% · Lifestyle 30% · Medication 20%</AppText>
          </View>
        </View>

        {/* Gauge */}
        <View style={styles.gaugeWrap}>
          <Svg width={ms(260)} height={ms(155)} viewBox="0 0 260 155">
            <Defs>
              <LinearGradient id="gaugeGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <Stop offset="0%" stopColor="#E24B4A" />
                <Stop offset="25%" stopColor="#BA7517" />
                <Stop offset="50%" stopColor="#EF9F27" />
                <Stop offset="75%" stopColor="#1D9E75" />
                <Stop offset="100%" stopColor="#085041" />
              </LinearGradient>
            </Defs>
            <Path d="M 30 125 A 100 100 0 0 1 230 125" fill="none" stroke={Colors.background} strokeWidth={16} strokeLinecap="round" />
            <Path d="M 30 125 A 100 100 0 0 1 230 125" fill="none" stroke="url(#gaugeGrad)" strokeWidth={16} strokeLinecap="round" strokeDasharray="314" strokeDashoffset="75" />
            <SvgCircle cx={178} cy={35} r={7} fill="#BA7517" stroke="white" strokeWidth={2.5} />
            <SvgText x={130} y={100} textAnchor="middle" fontSize={42} fontWeight="500" fill={Colors.primary}>658</SvgText>
            <SvgText x={130} y={118} textAnchor="middle" fontSize={11} fill="#888780">of 900  ·  ↑ +22 this month</SvgText>
            <SvgText x={30} y={145} textAnchor="middle" fontSize={10} fill="#E24B4A">300</SvgText>
            <SvgText x={230} y={145} textAnchor="middle" fontSize={10} fill="#085041">900</SvgText>
          </Svg>
        </View>

        {/* Score range labels */}
        <View style={styles.rangeRow}>
          <AppText variant="caption" color={R}>Poor · 300</AppText>
          <AppText variant="caption" color={A}>Fair · 550</AppText>
          <AppText variant="caption" color="#EF9F27">Good · 700</AppText>
          <AppText variant="caption" color={T}>Great · 800</AppText>
          <AppText variant="caption" color={Colors.tealText}>Optimal · 900</AppText>
        </View>

        {/* Status Badge */}
        <View style={styles.statusRow}>
          <View style={styles.statusBadge}>
            <AppText variant="bodyBold" color={Colors.amberDark}>Fair</AppText>
          </View>
          <AppText variant="caption" color={Colors.textSecondary}>Your current HPS grade</AppText>
        </View>

        {/* Check Progression Score Button */}
        <TouchableOpacity style={styles.checkBtn} activeOpacity={0.8} onPress={() => setSheetVisible(true)}>
          <AppText variant="bodyBold" color={Colors.white}>HPS Breakdown</AppText>
        </TouchableOpacity>

        {/* What's pulling your score */}
        <View style={styles.pullsSection}>
          <SectionTitle title="What's Pulling Your Score" />
          <View style={styles.pullsCard}>
            {pulls.map((p, i) => (
              <View key={i} style={[styles.pullRow, i < pulls.length - 1 && styles.pullBorder]}>
                <View style={[styles.pullDot, {backgroundColor: p.dot}]} />
                <AppText variant="body" style={styles.pullText}>{p.text}</AppText>
                <AppText variant="small" color={p.ptsColor} style={styles.pullPts}>{p.pts}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Trend */}
        <View style={styles.trendRow}>
          <View>
            <AppText variant="small" color={Colors.textSecondary}>30-day HPS trend</AppText>
            <AppText variant="small" color={Colors.tealDark} style={styles.trendVal}>↑ Rising · Best: 741 (Mar 12)</AppText>
          </View>
          <View style={styles.spark}>
            {sparkBars.map((b, i) => (
              <View key={i} style={[styles.sparkBar, {height: vs(b.h), backgroundColor: b.c}]} />
            ))}
          </View>
        </View>
      </View>

      {/* Bottom Sheet Modal */}
      <Modal visible={sheetVisible} transparent animationType="slide" onRequestClose={() => setSheetVisible(false)}>
        <View style={styles.overlay}>
          <Pressable style={styles.overlayTop} onPress={() => setSheetVisible(false)} />
          <View style={styles.sheet}>
            <View style={styles.sheetTopRow}>
              <View style={styles.sheetHandle} />
              <TouchableOpacity style={styles.closeBtn} onPress={() => setSheetVisible(false)}>
                <Ionicons name="close" size={ms(20)} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <ScrollView showsVerticalScrollIndicator={false} bounces={false} nestedScrollEnabled>
              {/* Score Contributors */}
              <SectionTitle title="Score Contributors" />
              {contribs.map((cb, i) => (
                <View key={i} style={styles.contribRow}>
                  <View style={[styles.contribIco, {backgroundColor: cb.iconBg}]}>
                    <Emoji icon={cb.icon} size={13} />
                  </View>
                  <View style={{flex: 1}}>
                    <AppText variant="bodyBold">{cb.name}</AppText>
                    <AppText variant="subtext" color={Colors.textTertiary}>{cb.wt}</AppText>
                  </View>
                  <View style={styles.contribBarWrap}>
                    <View style={styles.contribBarBg}>
                      <View style={[styles.contribBarFill, {width: cb.barW, backgroundColor: cb.barC}]} />
                    </View>
                    <AppText variant="subtext" color={Colors.textTertiary}>{cb.score} / 100</AppText>
                  </View>
                  <View style={{alignItems: 'flex-end', minWidth: s(55)}}>
                    <Text style={[styles.contribPts, {color: cb.scoreColor}]}>{cb.pts}</Text>
                    <AppText variant="subtext" color={Colors.textTertiary}>{cb.ptsMax}</AppText>
                  </View>
                </View>
              ))}

              {/* Summary Box */}
              <View style={styles.sumBox}>
                {summaryRows.map((row, i) => (
                  <View key={i} style={styles.sumRow}>
                    <AppText variant="caption" color={Colors.textSecondary}>{row.lbl}</AppText>
                    <AppText variant="bodyBold">{row.val}</AppText>
                  </View>
                ))}
                <View style={styles.sumTotal}>
                  <AppText variant="bodyBold" color="rgba(255,255,255,0.85)">HPS Total</AppText>
                  <Text style={styles.sumTotalVal}>300 + 174 + 90 + 94 = 658</Text>
                </View>
              </View>

              {/* What's Moving */}
              <View style={{marginTop: vs(16)}}>
                <SectionTitle title="What's Moving Your Score" />
              </View>
              <View style={styles.pullsCard}>
                {pulls.map((p, i) => (
                  <View key={i} style={[styles.pullRow, i < pulls.length - 1 && styles.pullBorder]}>
                    <View style={[styles.pullDot, {backgroundColor: p.dot}]} />
                    <AppText variant="body" style={styles.pullText}>{p.text}</AppText>
                    <AppText variant="small" color={p.ptsColor} style={styles.pullPts}>{p.pts}</AppText>
                  </View>
                ))}
              </View>

              <View style={{height: vs(30)}} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(18), borderWidth: 0.5, borderColor: Colors.borderLight, paddingVertical: vs(18), paddingHorizontal: s(16), marginBottom: vs(12)},
  topRow: {marginBottom: vs(6)},
  label: {fontSize: ms(13)},
  gaugeWrap: {alignItems: 'center', marginBottom: vs(6)},
  rangeRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(14)},

  // Status badge
  statusRow: {alignItems: 'center', gap: vs(6), marginBottom: vs(14)},
  statusBadge: {backgroundColor: Colors.amberBg, paddingVertical: vs(5), paddingHorizontal: s(14), borderRadius: ms(20)},
  pullsSection: {marginBottom: vs(14)},

  // Check button
  checkBtn: {backgroundColor: Colors.primary, borderRadius: ms(12), paddingVertical: vs(13), alignItems: 'center', marginBottom: vs(14)},

  // Trend
  trendRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingTop: vs(10), borderTopWidth: 0.5, borderTopColor: Colors.borderLight},
  trendVal: {fontWeight: '500', marginTop: vs(2)},
  spark: {flexDirection: 'row', gap: ms(3), alignItems: 'flex-end', height: vs(22)},
  sparkBar: {width: ms(8), borderTopLeftRadius: ms(2), borderTopRightRadius: ms(2)},

  // Bottom Sheet
  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.45)'},
  overlayTop: {flex: 1},
  sheet: {backgroundColor: Colors.white, borderTopLeftRadius: ms(20), borderTopRightRadius: ms(20), paddingHorizontal: s(16), paddingTop: vs(10), paddingBottom: vs(20), maxHeight: '85%'},
  sheetTopRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginBottom: vs(12), position: 'relative'},
  sheetHandle: {width: s(36), height: vs(4), backgroundColor: Colors.borderLight, borderRadius: ms(2)},
  closeBtn: {position: 'absolute', right: 0, top: ms(-4), width: ms(32), height: ms(32), borderRadius: ms(16), backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center'},

  // Contributors
  contribRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(10)},
  contribIco: {width: ms(28), height: ms(28), borderRadius: ms(8), alignItems: 'center', justifyContent: 'center'},
  contribBarWrap: {width: s(70)},
  contribBarBg: {height: vs(5), backgroundColor: Colors.background, borderRadius: ms(3), overflow: 'hidden', marginBottom: vs(2)},
  contribBarFill: {height: '100%', borderRadius: ms(3)},
  contribPts: {fontSize: ms(14), fontWeight: '500'},

  // Summary box
  sumBox: {backgroundColor: Colors.background, borderRadius: ms(12), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(14), marginTop: vs(14)},
  sumRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: vs(5), borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  sumTotal: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.primary, borderRadius: ms(10), paddingVertical: vs(10), paddingHorizontal: s(14), marginTop: vs(10)},
  sumTotalVal: {fontSize: ms(16), fontWeight: '500', color: Colors.white},

  // Pulls
  pullsCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, overflow: 'hidden', marginBottom: vs(12)},
  pullRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(11), paddingHorizontal: s(13)},
  pullBorder: {borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  pullDot: {width: ms(8), height: ms(8), borderRadius: ms(4)},
  pullText: {flex: 1, fontSize: ms(12), lineHeight: ms(17)},
  pullPts: {fontWeight: '500'},
});

export default HPSScoreTab;
