import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const borderTertiary = '#d1d5db';

/* --- data --- */
const CONDITIONS = [
  {
    title: 'Type 2 Diabetes Mellitus',
    since: 'Since Sep 2019',
    status: 'Sub-optimal control',
    statusBg: Colors.redBg,
    statusColor: Colors.redText,
  },
  {
    title: 'Essential Hypertension',
    since: 'Since Sep 2019',
    status: 'Well controlled',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    title: 'Dyslipidaemia',
    since: 'Since Jun 2022',
    status: 'Target achieved',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
];

const HIGHLIGHTS = [
  {
    icon: 'flask-outline',
    title: 'HbA1c rising to 7.8%',
    desc: 'Was 7.2% in Jan -- PM Metformin adherence only 71%',
    bg: Colors.redBg,
    color: Colors.redText,
  },
  {
    icon: 'eye-outline',
    title: 'Eye exam overdue',
    desc: 'Last retinal check >2 years ago -- referral to LV Prasad',
    bg: Colors.amberBg,
    color: Colors.amberText,
  },
  {
    icon: 'medical-outline',
    title: 'Methylcobalamin added',
    desc: 'B12 likely depleted by long-term Metformin use',
    bg: Colors.tealBg,
    color: Colors.tealText,
  },
  {
    icon: 'heart-outline',
    title: 'BP & lipids stable',
    desc: '130/82 mmHg \u00b7 LDL 118 -- both at target',
    bg: Colors.tealBg,
    color: Colors.tealText,
  },
];

/* --- component --- */
const VisitSummaryTab = () => {
  const renderVisitBanner = () => (
    <View style={styles.banner}>
      <AppText variant="bodyBold" color={Colors.white}>
        Dr. Kavitha Reddy {'\u00b7'} Endocrinology
      </AppText>
      <AppText variant="caption" color={Colors.white} style={{marginTop: vs(4)}}>
        6-month review {'\u00b7'} 15 Mar 2026 {'\u00b7'} KIMS Hospital
      </AppText>
      <AppText variant="caption" color={Colors.white} style={{marginTop: vs(2), opacity: 0.85}}>
        Duration: 35 min {'\u00b7'} Follow-up: 15 Apr 2026
      </AppText>
    </View>
  );

  const renderActiveConditions = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        Active conditions
      </AppText>
      {CONDITIONS.map((c, i) => (
        <View
          key={i}
          style={[
            styles.conditionRow,
            i < CONDITIONS.length - 1 && {
              borderBottomWidth: 0.5,
              borderBottomColor: borderTertiary,
            },
          ]}>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold">{c.title}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              {c.since}
            </AppText>
          </View>
          <View style={[styles.statusPill, {backgroundColor: c.statusBg}]}>
            <AppText variant="small" color={c.statusColor}>
              {c.status}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  const renderVisitHighlights = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        Visit highlights
      </AppText>
      {HIGHLIGHTS.map((h, i) => (
        <View
          key={i}
          style={[
            styles.highlightRow,
            i < HIGHLIGHTS.length - 1 && {
              borderBottomWidth: 0.5,
              borderBottomColor: borderTertiary,
            },
          ]}>
          <View style={[styles.highlightIcon, {backgroundColor: h.bg}]}>
            <Icon family="Ionicons" name={h.icon} size={18} color={h.color} />
          </View>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="bodyBold">{h.title}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              {h.desc}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  const renderAyuInsight = () => (
    <View style={[styles.insightCard, {backgroundColor: Colors.amberBg}]}>
      <Icon family="Ionicons" name="robot-outline" size={18} color={Colors.amberText} />
      <View style={{flex: 1, marginLeft: s(8)}}>
        <AppText variant="bodyBold" color={Colors.amberText} style={{marginBottom: vs(4)}}>
          Ayu insight
        </AppText>
        <AppText variant="caption" color={Colors.amberText}>
          This visit shows a mixed picture. Lipid and BP targets are met, but glycaemic control
          is slipping -- driven mainly by missed evening Metformin doses and poor sleep.
          Prioritise the PM alarm and sleep hygiene.
        </AppText>
      </View>
    </View>
  );

  const renderDoctorNote = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
        Doctor's overall note
      </AppText>
      <View style={styles.quoteBlock}>
        <AppText variant="body" color={Colors.textSecondary} style={{fontStyle: 'italic'}}>
          Patient reviewed with recent labs. Overall metabolically stable except rising HbA1c
          driven by PM medication non-adherence and poor sleep. Eye referral initiated. B12
          supplementation started. Continue current regimen with emphasis on lifestyle.
        </AppText>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {renderVisitBanner()}
      {renderActiveConditions()}
      {renderVisitHighlights()}
      {renderAyuInsight()}
      {renderDoctorNote()}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: s(4),
    paddingBottom: vs(32),
    gap: vs(12),
  },
  banner: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    padding: ms(16),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    padding: ms(14),
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    padding: ms(14),
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  statusPill: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(8),
  },
  highlightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  highlightIcon: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteBlock: {
    borderLeftWidth: 2.5,
    borderLeftColor: Colors.lightGreen,
    paddingLeft: s(12),
  },
});

export default VisitSummaryTab;
