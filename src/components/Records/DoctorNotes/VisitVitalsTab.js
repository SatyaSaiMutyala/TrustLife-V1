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
const VITALS = [
  {
    icon: 'heart-outline',
    label: 'BP',
    value: '130/82 mmHg',
    ref: 'Target <130/80',
    bg: Colors.amberBg,
    color: Colors.amberText,
  },
  {
    icon: 'pulse-outline',
    label: 'Heart Rate',
    value: '78 bpm',
    ref: 'Normal 60-100',
    bg: Colors.tealBg,
    color: Colors.tealText,
  },
  {
    icon: 'water-outline',
    label: 'SpO2',
    value: '98%',
    ref: 'Normal >95%',
    bg: Colors.tealBg,
    color: Colors.tealText,
  },
  {
    icon: 'thermometer-outline',
    label: 'Temperature',
    value: '98.4\u00b0F',
    ref: 'Normal 97-99',
    bg: Colors.tealBg,
    color: Colors.tealText,
  },
  {
    icon: 'scale-outline',
    label: 'Weight',
    value: '68 kg',
    ref: 'BMI 26.2',
    bg: Colors.amberBg,
    color: Colors.amberText,
  },
  {
    icon: 'resize-outline',
    label: 'Height',
    value: '161 cm',
    ref: 'Recorded',
    bg: Colors.tealBg,
    color: Colors.tealText,
  },
];

const TREND_ROWS = [
  {
    param: 'BP sys',
    sep: '128',
    jan: '132',
    mar: '130',
    arrow: '\u2192',
    arrowColor: Colors.tealText,
  },
  {
    param: 'Weight',
    sep: '67',
    jan: '68',
    mar: '68',
    arrow: '\u2192',
    arrowColor: Colors.tealText,
  },
  {
    param: 'Heart rate',
    sep: '76',
    jan: '74',
    mar: '78',
    arrow: '\u2191',
    arrowColor: Colors.amberText,
  },
  {
    param: 'BMI',
    sep: '25.8',
    jan: '26.2',
    mar: '26.2',
    arrow: '\u2192',
    arrowColor: Colors.tealText,
  },
];

/* --- component --- */
const VisitVitalsTab = () => {
  const renderVitalsGrid = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        Current vitals
      </AppText>
      <View style={styles.grid}>
        {VITALS.map((v, i) => (
          <View key={i} style={[styles.vitalCell, {backgroundColor: v.bg}]}>
            <Icon family="Ionicons" name={v.icon} size={20} color={v.color} />
            <AppText variant="caption" color={v.color} style={{marginTop: vs(6)}}>
              {v.label}
            </AppText>
            <AppText variant="bodyBold" color={v.color} style={{marginTop: vs(2)}}>
              {v.value}
            </AppText>
            <AppText variant="small" color={v.color} style={{marginTop: vs(2), opacity: 0.8}}>
              {v.ref}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );

  const renderTrendsTable = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        Vital trends
      </AppText>

      {/* Table header */}
      <View style={styles.tableRow}>
        <View style={styles.tableColParam}>
          <AppText variant="small" color={Colors.textTertiary}>Parameter</AppText>
        </View>
        <View style={styles.tableCol}>
          <AppText variant="small" color={Colors.textTertiary}>Sep 2025</AppText>
        </View>
        <View style={styles.tableCol}>
          <AppText variant="small" color={Colors.textTertiary}>Jan 2026</AppText>
        </View>
        <View style={styles.tableCol}>
          <AppText variant="small" color={Colors.textTertiary}>Mar 2026</AppText>
        </View>
        <View style={styles.tableColTrend}>
          <AppText variant="small" color={Colors.textTertiary}>Trend</AppText>
        </View>
      </View>

      {/* Table rows */}
      {TREND_ROWS.map((row, i) => (
        <View
          key={i}
          style={[
            styles.tableRow,
            {backgroundColor: i % 2 === 0 ? Colors.background : Colors.white},
            i < TREND_ROWS.length - 1 && {
              borderBottomWidth: 0.5,
              borderBottomColor: borderTertiary,
            },
          ]}>
          <View style={styles.tableColParam}>
            <AppText variant="caption" color={Colors.textPrimary}>{row.param}</AppText>
          </View>
          <View style={styles.tableCol}>
            <AppText variant="caption" color={Colors.textSecondary}>{row.sep}</AppText>
          </View>
          <View style={styles.tableCol}>
            <AppText variant="caption" color={Colors.textSecondary}>{row.jan}</AppText>
          </View>
          <View style={styles.tableCol}>
            <AppText variant="bodyBold" style={{fontSize: ms(12)}}>{row.mar}</AppText>
          </View>
          <View style={styles.tableColTrend}>
            <AppText variant="bodyBold" color={row.arrowColor} style={{fontSize: ms(16)}}>
              {row.arrow}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  const renderAyuNote = () => (
    <View style={[styles.insightCard, {backgroundColor: Colors.amberBg}]}>
      <Icon family="Ionicons" name="robot-outline" size={18} color={Colors.amberText} />
      <View style={{flex: 1, marginLeft: s(8)}}>
        <AppText variant="bodyBold" color={Colors.amberText} style={{marginBottom: vs(4)}}>
          Ayu note
        </AppText>
        <AppText variant="caption" color={Colors.amberText}>
          BP borderline at 130/82 -- just at target. Weight stable at 68 kg. No red flags in
          vitals this visit.
        </AppText>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {renderVitalsGrid()}
      {renderTrendsTable()}
      {renderAyuNote()}
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
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  vitalCell: {
    width: '48%',
    borderRadius: ms(12),
    padding: ms(12),
    alignItems: 'flex-start',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: s(4),
  },
  tableColParam: {
    flex: 2,
  },
  tableCol: {
    flex: 1.5,
    alignItems: 'center',
  },
  tableColTrend: {
    flex: 1,
    alignItems: 'center',
  },
});

export default VisitVitalsTab;
