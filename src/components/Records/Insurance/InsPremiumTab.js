import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';
const NAVY = Colors.primary;

const loadingRows = [
  {label: 'Base rate 38F', pct: 60, color: Colors.blueBg, barColor: Colors.blue, amount: '\u20B99,200', amountColor: Colors.textPrimary},
  {label: 'T2DM +18%', pct: 18, color: Colors.redBg, barColor: Colors.red, amount: '+\u20B91,656', amountColor: Colors.redText},
  {label: 'HTN +10%', pct: 10, color: Colors.amberBg, barColor: Colors.amber, amount: '+\u20B9920', amountColor: Colors.amberText},
  {label: 'Dyslipidaemia +7%', pct: 7, color: Colors.blueBg, barColor: Colors.blue, amount: '+\u20B9644', amountColor: Colors.blueText},
];

const discountRows = [
  {label: 'HPS discount -9%', pct: 9, color: Colors.tealBg, barColor: Colors.primary, amount: '-\u20B91,118', amountColor: Colors.tealText},
  {label: 'NCB -10%', pct: 10, color: Colors.tealBg, barColor: Colors.primary, amount: '-\u20B91,242', amountColor: Colors.tealText},
];

const historyRows = [
  {fy: 'FY 23\u201324', pct: 79, amount: '\u20B99,200', tag: 'Base', tagColor: Colors.textSecondary, tagBg: Colors.background, highlighted: false},
  {fy: 'FY 24\u201325', pct: 88, amount: '\u20B910,800', tag: '+17%', tagColor: Colors.redText, tagBg: Colors.redBg, highlighted: false},
  {fy: 'FY 25\u201326', pct: 86, amount: '\u20B910,060', tag: '-7%', tagColor: Colors.tealText, tagBg: Colors.tealBg, highlighted: false},
  {fy: 'FY 26\u201327', pct: 91, amount: '\u20B910,320', tag: 'Est +3%', tagColor: Colors.amberText, tagBg: Colors.amberBg, highlighted: true},
];

const renewalBullets = [
  'NCB 10% retained with continuous renewal',
  'HPS score 725 qualifies for 14% discount',
  'Pre-existing diseases fully covered (2+ yrs)',
  'All 3 family members included in floater',
];

const InsPremiumTab = () => {
  const renderPremiumHero = () => (
    <View style={styles.card}>
      <AppText variant="caption" color={Colors.textSecondary}>
        Annual premium {'\u00B7'} FY 2025{'\u2013'}26
      </AppText>
      <AppText variant="header" color={NAVY} style={{fontSize: ms(22), lineHeight: ms(28), marginTop: vs(4)}}>
        {'\u20B9'}12,400
      </AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(4)}}>
        Paid 1 Apr 2025 {'\u00B7'} Star Health Family Optima Gold
      </AppText>

      {/* 3-col breakdown */}
      <View style={styles.breakdownGrid}>
        <View style={styles.breakdownCell}>
          <AppText variant="small" color={Colors.textSecondary}>Base</AppText>
          <AppText variant="bodyBold" color={NAVY} style={{marginTop: vs(2)}}>
            {'\u20B9'}15,300
          </AppText>
        </View>
        <View style={[styles.breakdownCell, styles.breakdownCellBorder]}>
          <AppText variant="small" color={Colors.textSecondary}>NCB</AppText>
          <AppText variant="bodyBold" color={Colors.tealText} style={{marginTop: vs(2)}}>
            -{'\u20B9'}1,530
          </AppText>
        </View>
        <View style={styles.breakdownCell}>
          <AppText variant="small" color={Colors.textSecondary}>HPS</AppText>
          <AppText variant="bodyBold" color={Colors.tealText} style={{marginTop: vs(2)}}>
            -{'\u20B9'}1,370
          </AppText>
        </View>
      </View>
    </View>
  );

  const renderLoadingBreakdown = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(12)}}>
        Loading components {'\u00B7'} FY 2025{'\u2013'}26
      </AppText>

      {loadingRows.map((row, i) => (
        <View key={i} style={styles.loadingRow}>
          <View style={styles.loadingLabelRow}>
            <AppText variant="caption" color={Colors.textPrimary}>{row.label}</AppText>
            <AppText variant="caption" color={row.amountColor}>{row.amount}</AppText>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, {width: `${row.pct}%`, backgroundColor: row.barColor}]} />
          </View>
        </View>
      ))}

      {/* Gross total */}
      <View style={[styles.loadingLabelRow, styles.grossTotalRow]}>
        <AppText variant="bodyBold">Gross total</AppText>
        <AppText variant="bodyBold">{'\u20B9'}12,420</AppText>
      </View>

      {discountRows.map((row, i) => (
        <View key={i} style={styles.loadingRow}>
          <View style={styles.loadingLabelRow}>
            <AppText variant="caption" color={Colors.textPrimary}>{row.label}</AppText>
            <AppText variant="caption" color={row.amountColor}>{row.amount}</AppText>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressBar, {width: `${row.pct}%`, backgroundColor: row.barColor}]} />
          </View>
        </View>
      ))}

      {/* Green band footer */}
      <View style={styles.finalPremiumBand}>
        <AppText variant="caption" color={Colors.primary}>Final premium paid</AppText>
        <AppText variant="header" color={Colors.primary} style={{fontSize: ms(18), lineHeight: ms(24)}}>
          {'\u20B9'}10,060
        </AppText>
      </View>
    </View>
  );

  const renderHpsInsight = () => (
    <View style={[styles.insightBox, {backgroundColor: Colors.tealBg}]}>
      <Icon family="Ionicons" name="trending-up-outline" size={18} color={Colors.tealText} />
      <AppText variant="caption" color={Colors.tealText} style={{flex: 1}}>
        Improving HPS saves money. 658{'\u2192'}725 qualifies for 5% more discount on next renewal premium.
      </AppText>
    </View>
  );

  const renderPremiumHistory = () => (
    <View>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
        Premium history
      </AppText>
      <View style={styles.card}>
        {historyRows.map((row, i) => (
          <View
            key={i}
            style={[
              styles.historyRow,
              row.highlighted && {backgroundColor: Colors.background, borderRadius: ms(8), marginHorizontal: -ms(6), paddingHorizontal: ms(6)},
            ]}>
            <AppText variant="caption" color={Colors.textSecondary} style={{width: s(58)}}>
              {row.fy}
            </AppText>
            <View style={{flex: 1, marginHorizontal: s(8)}}>
              <View style={styles.progressTrack}>
                <View style={[styles.progressBar, {width: `${row.pct}%`, backgroundColor: NAVY}]} />
              </View>
            </View>
            <AppText variant="bodyBold" color={NAVY} style={{width: s(52), textAlign: 'right'}}>
              {row.amount}
            </AppText>
            <View style={[styles.pill, {backgroundColor: row.tagBg, marginLeft: s(6)}]}>
              <AppText variant="small" color={row.tagColor}>{row.tag}</AppText>
            </View>
          </View>
        ))}
        <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(8)}}>
          Premium trend reflects NCB, HPS improvements, and medical inflation adjustments.
        </AppText>
      </View>
    </View>
  );

  const renderRenewalCard = () => (
    <View style={[styles.card, {borderWidth: 1.5, borderColor: NAVY}]}>
      <AppText variant="caption" color={Colors.textSecondary}>
        Estimated renewal {'\u00B7'} FY 2026{'\u2013'}27
      </AppText>
      <AppText variant="header" color={NAVY} style={{fontSize: ms(22), lineHeight: ms(28), marginTop: vs(4)}}>
        {'\u20B9'}10,320
      </AppText>
      <View style={[styles.pill, {backgroundColor: Colors.amberBg, alignSelf: 'flex-start', marginTop: vs(6)}]}>
        <AppText variant="small" color={Colors.amberText}>+{'\u20B9'}260 vs last year</AppText>
      </View>

      {/* Bullet points */}
      <View style={{marginTop: vs(12)}}>
        {renewalBullets.map((text, i) => (
          <View key={i} style={styles.bulletRow}>
            <Icon family="Ionicons" name="checkmark-circle" size={16} color={Colors.primary} />
            <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1}}>
              {text}
            </AppText>
          </View>
        ))}
      </View>

      {/* Amber warning */}
      <View style={[styles.insightBox, {backgroundColor: Colors.amberBg, marginTop: vs(12), marginBottom: vs(12)}]}>
        <Icon family="Ionicons" name="alert-circle-outline" size={16} color={Colors.amberText} />
        <AppText variant="small" color={Colors.amberText} style={{flex: 1}}>
          If policy lapses, 2-year PED waiting restarts and NCB discount resets to 0%.
        </AppText>
      </View>

      {/* Buttons */}
      <TouchableOpacity style={styles.navyButton} activeOpacity={0.8}>
        <AppText variant="bodyBold" color={Colors.white}>
          Renew now {'\u00B7'} {'\u20B9'}10,320
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.outlineButton} activeOpacity={0.8}>
        <AppText variant="bodyBold" color={NAVY}>Compare plans</AppText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderPremiumHero()}
      {renderLoadingBreakdown()}
      {renderHpsInsight()}
      {renderPremiumHistory()}
      {renderRenewalCard()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
    marginBottom: vs(10),
  },
  breakdownGrid: {
    flexDirection: 'row',
    marginTop: vs(12),
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    overflow: 'hidden',
  },
  breakdownCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  breakdownCellBorder: {
    borderLeftWidth: 1,
    borderRightWidth: 1,
    borderColor: BORDER,
  },
  loadingRow: {
    marginBottom: vs(10),
  },
  loadingLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  progressTrack: {
    height: vs(6),
    backgroundColor: Colors.background,
    borderRadius: ms(3),
    overflow: 'hidden',
  },
  progressBar: {
    height: '100%',
    borderRadius: ms(3),
  },
  grossTotalRow: {
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
    paddingTop: vs(10),
    marginTop: vs(4),
    marginBottom: vs(10),
  },
  finalPremiumBand: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(10),
    padding: ms(12),
    marginTop: vs(8),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    padding: ms(12),
    borderRadius: ms(11),
    marginBottom: vs(12),
  },
  historyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  pill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    marginBottom: vs(6),
  },
  navyButton: {
    backgroundColor: NAVY,
    borderRadius: ms(10),
    paddingVertical: vs(12),
    alignItems: 'center',
    marginBottom: vs(8),
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: NAVY,
    borderRadius: ms(10),
    paddingVertical: vs(12),
    alignItems: 'center',
  },
});

export default InsPremiumTab;
