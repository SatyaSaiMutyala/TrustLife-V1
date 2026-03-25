import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';
const NAVY = Colors.primary;
const GREEN = Colors.primary;

const summaryItems = [
  {value: '3', label: 'Total claims', color: NAVY},
  {value: '2', label: 'Settled', color: Colors.tealText},
  {value: '1', label: 'Pending', color: Colors.amberText},
  {value: '\u20B914.2k', label: 'Reimbursed', color: NAVY},
];

const InsClaimsTab = () => {
  const renderSummary = () => (
    <View style={styles.summaryRow}>
      {summaryItems.map((item, i) => (
        <View key={i} style={styles.summaryItem}>
          <AppText variant="header" color={item.color}>{item.value}</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
            {item.label}
          </AppText>
        </View>
      ))}
    </View>
  );

  const renderOverdueInsight = () => (
    <View style={[styles.insightBox, {backgroundColor: Colors.amberBg}]}>
      <Icon family="Ionicons" name="alert-circle-outline" size={ms(18)} color={Colors.amberText} />
      <AppText variant="caption" color={Colors.amberText} style={{flex: 1}}>
        1 claim overdue. KIMS cardiology claim has been under review for 42 days, exceeding the 30-day TAT. You are eligible to escalate.
      </AppText>
    </View>
  );

  const renderTimelineDot = (color, label, sublabel, isLast) => (
    <View style={styles.timelineStep}>
      <View style={{alignItems: 'center'}}>
        <View style={[styles.timelineDot, {backgroundColor: color}]} />
        {!isLast && <View style={[styles.timelineLine, {backgroundColor: color}]} />}
      </View>
      <View style={{marginLeft: s(8), flex: 1, paddingBottom: isLast ? 0 : vs(12)}}>
        <AppText variant="small" color={Colors.textPrimary}>{label}</AppText>
        {sublabel && (
          <AppText variant="small" color={Colors.textTertiary}>{sublabel}</AppText>
        )}
      </View>
    </View>
  );

  const renderClaimCard1 = () => (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.claimHeader}>
        <View style={[styles.claimIcon, {backgroundColor: Colors.tealBg}]}>
          <Icon family="Ionicons" name="flask-outline" size={ms(16)} color={Colors.tealText} />
        </View>
        <View style={{flex: 1}}>
          <AppText variant="bodyBold">HbA1c + Lipid + RFT panel</AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(1)}}>
            3 Mar 2026 {'\u00B7'} Apollo Diagnostics
          </AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(1)}}>
            CLM-2026-0003
          </AppText>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <AppText variant="bodyBold" color={Colors.tealText}>{'\u20B9'}749</AppText>
          <AppText variant="small" color={Colors.tealText}>Settled</AppText>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: '100%', backgroundColor: GREEN}]} />
      </View>
      <View style={styles.progressLabel}>
        <AppText variant="small" color={Colors.textSecondary}>Reimbursed 100%</AppText>
        <View style={[styles.pill, {backgroundColor: Colors.tealBg}]}>
          <AppText variant="small" color={Colors.tealText}>Reimbursed 100%</AppText>
        </View>
      </View>

      {/* Timeline */}
      <View style={{marginTop: vs(10)}}>
        {renderTimelineDot(GREEN, 'Submitted', '4 Mar', false)}
        {renderTimelineDot(GREEN, 'Under review', '5 Mar', false)}
        {renderTimelineDot(GREEN, 'Approved', '7 Mar', false)}
        {renderTimelineDot(GREEN, 'Settled', '9 Mar', true)}
      </View>

      <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(6)}}>
        Processed in 5 days
      </AppText>
    </View>
  );

  const renderClaimCard2 = () => (
    <View style={[styles.card, {borderColor: Colors.amberText, borderWidth: 1}]}>
      {/* Header */}
      <View style={styles.claimHeader}>
        <View style={[styles.claimIcon, {backgroundColor: Colors.amberBg}]}>
          <Icon family="Ionicons" name="heart-outline" size={ms(16)} color={Colors.amberText} />
        </View>
        <View style={{flex: 1}}>
          <AppText variant="bodyBold">Cardiology OPD {'\u00B7'} Dr. Suresh Rao</AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(1)}}>
            14 Jan 2026 {'\u00B7'} KIMS Hospital
          </AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(1)}}>
            CLM-2026-0002
          </AppText>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <AppText variant="bodyBold" color={Colors.amberText}>{'\u20B9'}800</AppText>
          <AppText variant="small" color={Colors.amberText}>Pending {'\u00B7'} Day 42</AppText>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: '100%', backgroundColor: Colors.amber}]} />
      </View>
      <View style={styles.progressLabel}>
        <AppText variant="small" color={Colors.textSecondary}>Under review</AppText>
        <View style={[styles.pill, {backgroundColor: Colors.redBg}]}>
          <AppText variant="small" color={Colors.redText}>Overdue</AppText>
        </View>
      </View>

      {/* Timeline */}
      <View style={{marginTop: vs(10)}}>
        {renderTimelineDot(GREEN, 'Submitted', '15 Jan', false)}
        {renderTimelineDot(GREEN, 'Acknowledged', '16 Jan', false)}
        <View style={styles.timelineStep}>
          <View style={{alignItems: 'center'}}>
            <View style={[styles.timelineDot, {backgroundColor: Colors.amber}]} />
            <View style={[styles.timelineLine, {backgroundColor: Colors.textTertiary}]} />
          </View>
          <View style={{marginLeft: s(8), flex: 1, paddingBottom: vs(12)}}>
            <AppText variant="small" color={Colors.amberText}>Under review</AppText>
            <AppText variant="small" color={Colors.amberText}>Still here</AppText>
          </View>
        </View>
        <View style={styles.timelineStep}>
          <View style={{alignItems: 'center'}}>
            <View style={[styles.timelineDot, {backgroundColor: Colors.textTertiary}]} />
          </View>
          <View style={{marginLeft: s(8), flex: 1}}>
            <AppText variant="small" color={Colors.textTertiary}>Settlement</AppText>
            <AppText variant="small" color={Colors.textTertiary}>Pending</AppText>
          </View>
        </View>
      </View>

      {/* Escalation box */}
      <View style={[styles.escalateBox, {backgroundColor: Colors.amberBg}]}>
        <AppText variant="caption" color={Colors.amberText}>
          Eligible to escalate with IRDAI. Claim has exceeded the 30-day turnaround time mandated by regulations.
        </AppText>
      </View>

      {/* Action buttons */}
      <View style={styles.actionRow}>
        <TouchableOpacity style={[styles.actionBtn, {backgroundColor: NAVY, flex: 1}]}>
          <AppText variant="bodyBold" color={Colors.white}>Escalate claim</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={[styles.actionBtn, styles.outlineBtn, {borderColor: Colors.tealText, flex: 1}]}>
          <AppText variant="bodyBold" color={Colors.tealText}>Download docs</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderClaimCard3 = () => (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.claimHeader}>
        <View style={[styles.claimIcon, {backgroundColor: '#EAF3DE'}]}>
          <Icon family="Ionicons" name="shield-checkmark-outline" size={ms(16)} color={Colors.primary} />
        </View>
        <View style={{flex: 1}}>
          <AppText variant="bodyBold">Influenza vaccine {'\u00B7'} Fluarix Tetra</AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(1)}}>
            10 Sep 2025
          </AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(1)}}>
            CLM-2025-0001
          </AppText>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <AppText variant="bodyBold" color={Colors.tealText}>{'\u20B9'}450</AppText>
          <AppText variant="small" color={Colors.tealText}>Settled</AppText>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: '100%', backgroundColor: GREEN}]} />
      </View>
      <View style={styles.progressLabel}>
        <AppText variant="small" color={Colors.textSecondary}>Settled in 8 days</AppText>
        <View style={[styles.pill, {backgroundColor: Colors.tealBg}]}>
          <AppText variant="small" color={Colors.tealText}>Settled</AppText>
        </View>
      </View>
    </View>
  );

  const renderBottomActions = () => (
    <View style={styles.bottomActions}>
      <TouchableOpacity style={[styles.actionBtn, {backgroundColor: NAVY}]}>
        <Icon family="Ionicons" name="add-circle-outline" size={ms(18)} color={Colors.white} />
        <AppText variant="bodyBold" color={Colors.white}>File a new claim</AppText>
      </TouchableOpacity>
      <TouchableOpacity style={[styles.actionBtn, styles.outlineBtn, {borderColor: NAVY}]}>
        <Icon family="Ionicons" name="flash-outline" size={ms(18)} color={NAVY} />
        <AppText variant="bodyBold" color={NAVY}>Emergency cashless authorisation</AppText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderSummary()}
      {renderOverdueInsight()}
      {renderClaimCard1()}
      {renderClaimCard2()}
      {renderClaimCard3()}
      {renderBottomActions()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  summaryRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
    marginBottom: vs(10),
  },
  summaryItem: {
    flex: 1,
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
    marginBottom: vs(10),
  },
  claimHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(10),
    marginBottom: vs(10),
  },
  claimIcon: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    alignItems: 'center',
    justifyContent: 'center',
  },
  progressTrack: {
    height: vs(6),
    backgroundColor: Colors.background,
    borderRadius: ms(3),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: ms(3),
  },
  progressLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: vs(6),
  },
  pill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
  },
  timelineLine: {
    width: 2,
    height: vs(20),
  },
  escalateBox: {
    padding: ms(10),
    borderRadius: ms(10),
    marginTop: vs(10),
    marginBottom: vs(10),
  },
  actionRow: {
    flexDirection: 'row',
    gap: s(8),
    marginTop: vs(4),
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(6),
    paddingVertical: vs(12),
    paddingHorizontal: s(15),
    borderRadius: ms(12),
  },
  outlineBtn: {
    backgroundColor: 'transparent',
    borderWidth: 1.5,
  },
  bottomActions: {
    gap: vs(8),
    marginTop: vs(4),
    marginBottom: vs(8),
  },
});

export default InsClaimsTab;
