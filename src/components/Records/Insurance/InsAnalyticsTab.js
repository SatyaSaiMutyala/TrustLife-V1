import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';
const NAVY = Colors.primary;
const NAVY_LIGHT = Colors.primary;
const BAR_BLUE = Colors.tealBg;

const heroStats = [
  {label: 'Total spent', value: '\u20B938.4k'},
  {label: 'Insured', value: '\u20B914.2k'},
  {label: 'Out of pocket', value: '\u20B924.2k'},
  {label: 'Coverage %', value: '37%', valueColor: Colors.lightGreen},
];

const annualData = [
  {label: 'FY 23-24', value: '\u20B931k', height: 50, insuredPct: 0.3, current: false},
  {label: 'FY 24-25', value: '\u20B934k', height: 60, insuredPct: 0.35, current: false},
  {label: 'FY 25-26', value: '\u20B938.4k', height: 75, insuredPct: 0.37, current: true},
  {label: 'FY 26-27 est', value: '~\u20B941k', height: 50, insuredPct: 0.4, current: false, estimated: true},
];

const categoryRows = [
  {label: 'Medicines', color: NAVY, pct: 100, amount: '\u20B914,400', pctLabel: '37%'},
  {label: 'Consultations', color: Colors.lightGreen, pct: 61, amount: '\u20B98,800', pctLabel: '23%'},
  {label: 'Lab tests', color: '#0F6E56', pct: 43, amount: '\u20B96,200', pctLabel: '16%'},
  {label: 'Insurance premium', color: '#7F77DD', pct: 62, amount: '\u20B99,000', pctLabel: '23%'},
  {label: 'Wellness', color: Colors.lightGreen, pct: 0, amount: '\u20B90', pctLabel: '0%'},
];

const conditionRows = [
  {label: 'T2DM', color: Colors.redText, pct: 55, amount: '\u20B918,200', pctLabel: '47%'},
  {label: 'HTN', color: Colors.amberText, pct: 28, amount: '\u20B97,400', pctLabel: '19%'},
  {label: 'Dyslipidaemia', color: '#185FA5', pct: 20, amount: '\u20B95,200', pctLabel: '14%'},
  {label: 'Preventive', color: Colors.textSecondary, pct: 12, amount: '\u20B93,600', pctLabel: '9%'},
  {label: 'Other', color: Colors.textTertiary, pct: 9, amount: '\u20B94,000', pctLabel: '11%'},
];

const InsAnalyticsTab = () => {
  const renderHeroStrip = () => (
    <View style={styles.heroStrip}>
      <AppText variant="caption" color="rgba(255,255,255,0.7)" style={{marginBottom: vs(10)}}>
        3-Year analytics \u00B7 FY 2023\u201326
      </AppText>
      <View style={styles.heroRow}>
        {heroStats.map((stat, i) => (
          <View key={i} style={styles.heroStat}>
            <AppText variant="bodyBold" color={stat.valueColor || Colors.white}>
              {stat.value}
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)" style={{marginTop: vs(2)}}>
              {stat.label}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );

  const renderAnnualChart = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(4)}}>
        Annual health spend \u00B7 3-year trend
      </AppText>
      <View style={styles.chartRow}>
        {annualData.map((item, i) => (
          <View key={i} style={styles.chartCol}>
            <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(4)}}>
              {item.value}
            </AppText>
            <View
              style={[
                styles.chartBar,
                {height: vs(item.height)},
                item.estimated && styles.chartBarEstimated,
                item.current && styles.chartBarCurrent,
              ]}>
              <View
                style={[
                  styles.chartBarInsured,
                  {height: `${item.insuredPct * 100}%`},
                  item.estimated && {opacity: 0.5},
                ]}
              />
            </View>
            <AppText
              variant="small"
              color={item.current ? NAVY : Colors.textTertiary}
              style={{marginTop: vs(4), textAlign: 'center', fontWeight: item.current ? '700' : '400'}}>
              {item.label}
            </AppText>
          </View>
        ))}
      </View>
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: NAVY}]} />
          <AppText variant="small" color={Colors.textSecondary}>Insured</AppText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: BAR_BLUE}]} />
          <AppText variant="small" color={Colors.textSecondary}>Out of pocket</AppText>
        </View>
      </View>
    </View>
  );

  const renderBarRow = (item, i, total) => (
    <View
      key={i}
      style={[styles.barRow, i < total - 1 && styles.rowBorder]}>
      <View style={styles.barRowLeft}>
        <View style={[styles.dot, {backgroundColor: item.color}]} />
        <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1}}>
          {item.label}
        </AppText>
      </View>
      <View style={styles.barTrackContainer}>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, {width: `${item.pct}%`, backgroundColor: item.color}]} />
        </View>
      </View>
      <View style={styles.barRowRight}>
        <AppText variant="caption" color={Colors.textPrimary}>{item.amount}</AppText>
        <AppText variant="small" color={Colors.textTertiary}>{item.pctLabel}</AppText>
      </View>
    </View>
  );

  const renderCategoryCard = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>Spend by category</AppText>
      {categoryRows.map((item, i) => renderBarRow(item, i, categoryRows.length))}
    </View>
  );

  const renderConditionCard = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>Spend by condition</AppText>
      {conditionRows.map((item, i) => renderBarRow(item, i, conditionRows.length))}
    </View>
  );

  const renderHpsInsight = () => (
    <View style={styles.hpsBox}>
      <Icon family="Ionicons" name="analytics-outline" size={ms(18)} color={NAVY_LIGHT} />
      <AppText variant="caption" color={NAVY_LIGHT} style={{flex: 1}}>
        HPS 658 — estimated savings at renewal if coverage is upgraded to match actual spend pattern.
      </AppText>
    </View>
  );

  const renderTaxCard = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>80D Tax benefit</AppText>
      <View style={[styles.taxRow, styles.rowBorder]}>
        <AppText variant="caption" color={Colors.textSecondary}>Premium</AppText>
        <AppText variant="caption" color={Colors.textPrimary}>{'\u20B9'}9,000</AppText>
      </View>
      <View style={[styles.taxRow, styles.rowBorder]}>
        <AppText variant="caption" color={Colors.textSecondary}>Checkups</AppText>
        <AppText variant="caption" color={Colors.textPrimary}>{'\u20B9'}4,000</AppText>
      </View>
      <View style={styles.taxRow}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>Total</AppText>
        <AppText variant="bodyBold" color={Colors.textPrimary}>{'\u20B9'}13,000</AppText>
      </View>
      <View style={styles.taxBand}>
        <AppText variant="caption" color={Colors.tealText}>Tax saving at 30% slab</AppText>
        <AppText variant="bodyBold" color={Colors.tealText}>{'\u20B9'}3,900 saved</AppText>
      </View>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderHeroStrip()}
      {renderAnnualChart()}
      {renderCategoryCard()}
      {renderConditionCard()}
      {renderHpsInsight()}
      {renderTaxCard()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  heroStrip: {
    backgroundColor: NAVY,
    borderRadius: ms(16),
    padding: ms(16),
    marginBottom: vs(12),
  },
  heroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  heroStat: {
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
    marginBottom: vs(10),
  },
  chartRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    marginTop: vs(12),
    marginBottom: vs(8),
    paddingHorizontal: s(4),
  },
  chartCol: {
    flex: 1,
    alignItems: 'center',
  },
  chartBar: {
    width: s(36),
    backgroundColor: BAR_BLUE,
    borderRadius: ms(6),
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  chartBarCurrent: {
    borderWidth: 1.5,
    borderColor: NAVY,
  },
  chartBarEstimated: {
    borderWidth: 1.5,
    borderColor: NAVY,
    borderStyle: 'dashed',
    opacity: 0.5,
  },
  chartBarInsured: {
    backgroundColor: NAVY,
    borderBottomLeftRadius: ms(4),
    borderBottomRightRadius: ms(4),
    width: '100%',
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(16),
    marginTop: vs(4),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  legendDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  barRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    gap: s(8),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  barRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    width: s(110),
    gap: s(6),
  },
  dot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  barTrackContainer: {
    flex: 1,
  },
  barTrack: {
    height: vs(6),
    backgroundColor: Colors.background,
    borderRadius: ms(3),
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: ms(3),
  },
  barRowRight: {
    alignItems: 'flex-end',
    width: s(60),
  },
  hpsBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    padding: ms(12),
    borderRadius: ms(11),
    backgroundColor: BAR_BLUE,
    marginBottom: vs(10),
  },
  taxRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: vs(8),
  },
  taxBand: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.tealBg,
    borderRadius: ms(10),
    padding: ms(10),
    marginTop: vs(4),
  },
});

export default InsAnalyticsTab;
