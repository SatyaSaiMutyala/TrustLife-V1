import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../../components/shared/AppText';
import Colors from '../../../constants/colors';

/* ── helpers ────────────────────────────────────────── */

const InfoRow = ({label, value, badge, badgeType, last}) => {
  const badgeStyle =
    badgeType === 'green'
      ? {bg: Colors.tealBg, text: Colors.accent}
      : badgeType === 'amber'
      ? {bg: '#FDF3E7', text: '#B5600E'}
      : null;

  return (
    <View style={[styles.infoRow, last && styles.noBorder]}>
      <AppText variant="small" style={styles.infoLabel}>
        {label.toUpperCase()}
      </AppText>
      <View style={styles.infoValueWrap}>
        <AppText variant="body" style={styles.infoValue}>
          {value}
        </AppText>
        {badge && badgeStyle && (
          <View style={[styles.badge, {backgroundColor: badgeStyle.bg}]}>
            <AppText variant="small" style={{color: badgeStyle.text, fontSize: ms(9)}}>
              {badge}
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
};

const ActionButton = ({label, primary, onPress}) => (
  <TouchableOpacity
    style={[styles.actionBtn, primary && styles.actionBtnPrimary]}
    activeOpacity={0.7}
    onPress={onPress}>
    <AppText
      variant="small"
      color={primary ? '#FFFFFF' : Colors.accent}
      style={styles.actionText}>
      {label}
    </AppText>
  </TouchableOpacity>
);

const StatCard = ({amount, label, color}) => (
  <View style={styles.statCard}>
    <AppText variant="bodyBold" style={[styles.statAmount, {color}]}>
      {amount}
    </AppText>
    <AppText variant="small" style={styles.statLabel}>{label}</AppText>
  </View>
);

const SummaryRow = ({label, value, badge, badgeType, last}) => {
  const badgeStyle =
    badgeType === 'amber'
      ? {bg: '#FDF3E7', text: '#B5600E'}
      : badgeType === 'green'
      ? {bg: Colors.tealBg, text: Colors.accent}
      : null;

  return (
    <View style={[styles.summaryRow, last && styles.noBorder]}>
      <AppText variant="small" style={styles.summaryLabel}>{label}</AppText>
      <View style={styles.summaryValueWrap}>
        <AppText variant="body" style={styles.summaryValue}>{value}</AppText>
        {badge && badgeStyle && (
          <View style={[styles.badge, {backgroundColor: badgeStyle.bg, marginLeft: s(6)}]}>
            <AppText variant="small" style={{color: badgeStyle.text, fontSize: ms(9)}}>
              {badge}
            </AppText>
          </View>
        )}
      </View>
    </View>
  );
};

/* ── Component ──────────────────────────────────────── */

const InsuranceTab = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ── Privacy Banner ──────────────────────────── */}
      <View style={styles.privacyBanner}>
        <AppText style={styles.privacyIcon}>🔒</AppText>
        <AppText variant="caption" style={styles.privacyText}>
          Insurance and financial data is used only for care coordination and is never shared without your explicit consent.
        </AppText>
      </View>

      {/* ── Star Health Insurance ───────────────────── */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconBox, {backgroundColor: Colors.blueBg}]}>
              <AppText style={styles.iconEmoji}>🏥</AppText>
            </View>
            <View style={styles.headerTextCol}>
              <AppText variant="bodyBold" style={styles.sectionTitle}>
                Star Health & Allied Insurance
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                Family Floater
              </AppText>
            </View>
          </View>
          <View style={[styles.statusPill, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="small" style={{color: Colors.accent, fontSize: ms(10), fontWeight: '600'}}>
              Active
            </AppText>
          </View>
        </View>

        <View style={styles.cardBody}>
          {/* 2-column info grid */}
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <InfoRow label="Policy Number" value="SH-2024-HYD-882291" last />
            </View>
            <View style={styles.gridCol}>
              <InfoRow label="Sum Insured" value="₹10,00,000" last />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <InfoRow
                label="Policy Period"
                value="Apr 2025 – Mar 2026"
                badge="Renewal due"
                badgeType="amber"
                last
              />
            </View>
            <View style={styles.gridCol}>
              <InfoRow label="Premium" value="₹22,400/year" last />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <InfoRow
                label="Members Covered"
                value="Arjun, Meera, Karthik, Riya, Lakshmi"
                last
              />
            </View>
            <View style={styles.gridCol}>
              <InfoRow label="Cashless Network" value="5,800+ hospitals" last />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <InfoRow label="Room Rent" value="No sub-limit" last />
            </View>
            <View style={styles.gridCol}>
              <InfoRow
                label="Pre-existing"
                value="Thyroid — waiver complete"
                badge="Covered"
                badgeType="green"
                last
              />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <InfoRow label="No-claim Bonus" value="+₹1L accumulated" last />
            </View>
            <View style={styles.gridCol}>
              <InfoRow label="TPA" value="Medi Assist" last />
            </View>
          </View>
          <View style={styles.gridRow}>
            <View style={styles.gridCol}>
              <InfoRow label="Helpline" value="1800 425 2255" last />
            </View>
            <View style={styles.gridCol}>
              <InfoRow label="Claims Email" value="claims@starhealth.in" last />
            </View>
          </View>

          {/* Coverage utilization bar */}
          <View style={styles.utilizationSection}>
            <View style={styles.utilizationHeader}>
              <AppText variant="small" style={styles.utilizationTitle}>
                Coverage Utilization
              </AppText>
              <AppText variant="small" style={styles.utilizationDetail}>
                18% used · ₹1,82,400 of ₹10L
              </AppText>
            </View>
            <View style={styles.barTrack}>
              <View
                style={[
                  styles.barFill,
                  {width: '18%', backgroundColor: Colors.accent},
                ]}
              />
            </View>
          </View>

          {/* Action buttons */}
          <View style={styles.actionRow}>
            <ActionButton label="Edit" />
            <ActionButton label="View Documents" />
            <ActionButton label="Claim History" />
            <ActionButton label="Renew Policy" primary />
          </View>
        </View>
      </View>

      {/* ── HDFC Life ──────────────────────────────── */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#EEEDFE'}]}>
              <AppText style={styles.iconEmoji}>🛡️</AppText>
            </View>
            <View style={styles.headerTextCol}>
              <AppText variant="bodyBold" style={styles.sectionTitle}>
                HDFC Life
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                Term Life Insurance
              </AppText>
            </View>
          </View>
          <View style={[styles.statusPill, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="small" style={{color: Colors.accent, fontSize: ms(10), fontWeight: '600'}}>
              Active
            </AppText>
          </View>
        </View>

        <View style={styles.cardBody}>
          <InfoRow label="Sum Assured" value="₹1,00,00,000 (₹1 Cr)" />
          <InfoRow label="Policy Period" value="2019 – 2049 (30 years)" />
          <InfoRow label="Premium" value="₹14,200/year" />
          <InfoRow label="Nominees" value="Karthik (son), Riya (daughter)" />
          <InfoRow label="Riders" value="Critical Illness + Accidental Death" last />
        </View>
      </View>

      {/* ── ICICI Lombard Critical Illness ─────────── */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={styles.headerLeft}>
            <View style={[styles.iconBox, {backgroundColor: '#FAEAED'}]}>
              <AppText style={styles.iconEmoji}>💊</AppText>
            </View>
            <View style={styles.headerTextCol}>
              <AppText variant="bodyBold" style={styles.sectionTitle}>
                ICICI Lombard Critical Illness
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                Critical Illness Cover
              </AppText>
            </View>
          </View>
          <View style={[styles.statusPill, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="small" style={{color: Colors.accent, fontSize: ms(10), fontWeight: '600'}}>
              Active
            </AppText>
          </View>
        </View>

        <View style={styles.cardBody}>
          <InfoRow label="Cover Type" value="₹25,00,000 lump sum payout" />
          <InfoRow label="Conditions" value="36 critical conditions covered" />
          <InfoRow label="Renewal" value="August 2026" />
          <InfoRow label="Premium" value="₹8,900/year" last />
        </View>
      </View>

      {/* ── Coverage Summary ───────────────────────── */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>
            Coverage Summary
          </AppText>
        </View>

        <View style={styles.cardBody}>
          {/* 4 stat cards */}
          <View style={styles.statsGrid}>
            <StatCard amount="₹10L" label="Health" color={Colors.accent} />
            <StatCard amount="₹1Cr" label="Life" color={Colors.blue} />
            <StatCard amount="₹25L" label="Critical" color={Colors.purple} />
            <StatCard amount="₹25L" label="Accident" color={Colors.amber} />
          </View>

          {/* Info rows */}
          <View style={styles.summarySection}>
            <SummaryRow label="Total Annual Premium" value="₹45,500/year" />
            <SummaryRow label="Dependents Covered" value="5 family members" />
            <SummaryRow label="Tax Benefit (80D)" value="Up to ₹25,000" />
            <SummaryRow
              label="Next Renewal Alert"
              value="31 March 2026"
              badge="5 days away"
              badgeType="amber"
              last
            />
          </View>
        </View>
      </View>

      <View style={{height: vs(30)}} />
    </ScrollView>
  );
};

/* ── styles ─────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingTop: vs(12),
  },

  /* Privacy banner */
  privacyBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tealBg,
    borderRadius: ms(12),
    padding: s(12),
    marginBottom: vs(12),
    gap: s(8),
  },
  privacyIcon: {fontSize: ms(16)},
  privacyText: {
    flex: 1,
    fontSize: ms(11),
    color: Colors.tealText,
    lineHeight: ms(16),
  },

  /* Card */
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ms(16),
    
    
    marginBottom: vs(12),
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD6',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: s(8),
  },
  headerTextCol: {
    flex: 1,
    marginLeft: s(10),
  },
  sectionTitle: {
    fontSize: ms(14),
    color: '#1A1814',
  },
  iconBox: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconEmoji: {fontSize: ms(16)},
  cardBody: {
    padding: s(16),
  },

  /* Status pill */
  statusPill: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(10),
  },

  /* Info rows */
  infoRow: {
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD6',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    color: '#A09E9A',
    fontSize: ms(10),
    letterSpacing: 0.5,
    marginBottom: vs(3),
  },
  infoValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: s(6),
  },
  infoValue: {
    color: '#1A1814',
    fontSize: ms(13),
  },
  badge: {
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(6),
  },

  /* 2-column grid */
  gridRow: {
    flexDirection: 'row',
    gap: s(12),
  },
  gridCol: {
    flex: 1,
  },

  /* Utilization bar */
  utilizationSection: {
    marginTop: vs(14),
    gap: vs(6),
  },
  utilizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  utilizationTitle: {
    fontSize: ms(11),
    color: '#1A1814',
    fontWeight: '600',
  },
  utilizationDetail: {
    fontSize: ms(11),
    color: '#A09E9A',
  },
  barTrack: {
    height: vs(8),
    backgroundColor: '#F2EFE8',
    borderRadius: 99,
  },
  barFill: {
    height: vs(8),
    borderRadius: 99,
  },

  /* Action buttons */
  actionRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginTop: vs(16),
  },
  actionBtn: {
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
    borderRadius: ms(8),
    backgroundColor: Colors.tealBg,
  },
  actionBtnPrimary: {
    backgroundColor: Colors.primary,
  },
  actionText: {
    fontSize: ms(11),
    fontWeight: '600',
  },

  /* Stats grid */
  statsGrid: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(14),
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9F8F5',
    borderRadius: ms(12),
    paddingVertical: vs(12),
    paddingHorizontal: s(8),
    alignItems: 'center',
    
    
  },
  statAmount: {
    fontSize: ms(16),
    fontWeight: '700',
  },
  statLabel: {
    fontSize: ms(10),
    color: '#A09E9A',
    marginTop: vs(2),
  },

  /* Summary rows */
  summarySection: {
    borderTopWidth: 1,
    borderTopColor: '#E0DDD6',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD6',
  },
  summaryLabel: {
    fontSize: ms(11),
    color: '#A09E9A',
  },
  summaryValueWrap: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryValue: {
    fontSize: ms(13),
    color: '#1A1814',
  },
});

export default InsuranceTab;
