import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Circle, Text as SvgText} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';
const NAVY = Colors.primary;

const members = [
  {
    initials: 'PR',
    name: 'Priya Reddy',
    role: 'Primary insured',
    detail: '38F \u00B7 T2DM \u00B7 HTN',
    claimed: '\u20B913,400',
    pct: '94%',
    avatarBg: Colors.tealBg,
    avatarColor: Colors.primary,
  },
  {
    initials: 'RR',
    name: 'Raj Reddy',
    role: null,
    detail: '41M \u00B7 No conditions \u00B7 HPS 812',
    claimed: '\u20B9800',
    pct: '6%',
    avatarBg: Colors.blueBg,
    avatarColor: Colors.blueText,
  },
  {
    initials: 'AR',
    name: 'Aarav Reddy',
    role: null,
    detail: '9M \u00B7 Mild asthma',
    claimed: '\u20B90',
    pct: 'No claims',
    avatarBg: Colors.pinkBg,
    avatarColor: Colors.purpleText,
  },
];

const essentials = [
  {label: 'Policy type', value: 'Family Floater', detail: 'All share \u20B95L'},
  {label: 'Policy period', value: '1 Apr 2025', detail: 'to 31 Mar 2026'},
  {label: 'Room rent', value: '\u20B95,000/day', detail: 'Single AC'},
  {label: 'Pre-existing', value: 'Covered', detail: 'After 2-yr \u2713'},
  {label: 'Daycare', value: 'All 586', detail: 'No 24hr needed'},
  {label: 'Network hospitals', value: '14,000+', detail: 'Cashless India'},
];

const hospitals = [
  {name: 'KIMS', distance: '2.1 km', preferred: true},
  {name: 'Yashoda', distance: '4.8 km', preferred: false},
  {name: 'Kamineni', distance: '3.4 km', preferred: false},
  {name: 'Apollo', distance: '7.2 km', preferred: false},
];

const InsOverviewTab = () => {
  const renderCoverUtilisation = () => {
    const radius = 24;
    const stroke = 5;
    const circumference = 2 * Math.PI * radius;
    const progress = 0.97;
    const strokeDashoffset = circumference * (1 - progress);

    return (
      <View style={[styles.card, {borderRadius: ms(16)}]}>
        {/* Top row */}
        <View style={styles.rowBetween}>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.textSecondary}>
              Available cover {'\u00B7'} FY 2025\u201326
            </AppText>
            <AppText variant="header" color={Colors.tealText} style={{marginTop: vs(2)}}>
              {'\u20B9'}4,85,800
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
              of {'\u20B9'}5,00,000 total {'\u00B7'} {'\u20B9'}14,200 claimed
            </AppText>
          </View>
          <View>
            <Svg width={ms(60)} height={ms(60)}>
              <Circle
                cx={ms(30)}
                cy={ms(30)}
                r={radius}
                stroke={Colors.background}
                strokeWidth={stroke}
                fill="none"
              />
              <Circle
                cx={ms(30)}
                cy={ms(30)}
                r={radius}
                stroke={NAVY}
                strokeWidth={stroke}
                fill="none"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                strokeLinecap="round"
                transform={`rotate(-90 ${ms(30)} ${ms(30)})`}
              />
              <SvgText
                x={ms(30)}
                y={ms(30)}
                textAnchor="middle"
                alignmentBaseline="central"
                fontSize={ms(12)}
                fontWeight="700"
                fill={NAVY}>
                97%
              </SvgText>
            </Svg>
          </View>
        </View>

        {/* Segmented bar */}
        <View style={styles.segmentBar}>
          <View style={[styles.segmentClaimed, {flex: 14.2}]} />
          <View style={[styles.segmentAvailable, {flex: 85.8}]} />
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: NAVY}]} />
            <AppText variant="small" color={Colors.textSecondary}>Claimed (14.2%)</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: Colors.backgroundSecondary || Colors.background}]} />
            <AppText variant="small" color={Colors.textSecondary}>Available (85.8%)</AppText>
          </View>
        </View>
      </View>
    );
  };

  const renderMembers = () => (
    <View>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
        Members covered
      </AppText>
      <View style={styles.card}>
        {members.map((m, i) => (
          <View
            key={i}
            style={[
              styles.memberRow,
              i < members.length - 1 && styles.rowBorder,
            ]}>
            <View style={[styles.avatar, {backgroundColor: m.avatarBg}]}>
              <AppText variant="bodyBold" color={m.avatarColor}>{m.initials}</AppText>
            </View>
            <View style={{flex: 1}}>
              <View style={styles.memberNameRow}>
                <AppText variant="bodyBold">{m.name}</AppText>
                {m.role && (
                  <View style={[styles.pill, {backgroundColor: Colors.tealBg}]}>
                    <AppText variant="small" color={Colors.tealText}>{m.role}</AppText>
                  </View>
                )}
              </View>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                {m.detail}
              </AppText>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <AppText variant="bodyBold">{m.claimed}</AppText>
              <AppText variant="small" color={Colors.textTertiary}>{m.pct}</AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderEssentials = () => (
    <View>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
        Policy essentials
      </AppText>
      <View style={styles.gridContainer}>
        {essentials.map((item, i) => (
          <View key={i} style={styles.gridItem}>
            <View style={styles.gridCard}>
              <AppText variant="caption" color={Colors.textSecondary}>{item.label}</AppText>
              <AppText variant="bodyBold" style={{marginTop: vs(2)}}>{item.value}</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
                {item.detail}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderHospitals = () => (
    <View>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
        Network hospitals
      </AppText>
      <View style={styles.card}>
        {hospitals.map((h, i) => (
          <View
            key={i}
            style={[
              styles.hospitalRow,
              i < hospitals.length - 1 && styles.rowBorder,
            ]}>
            <View style={[styles.hospitalIcon, {backgroundColor: Colors.blueBg}]}>
              <Icon family="Ionicons" name="business-outline" size={ms(16)} color={Colors.blueText} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold">{h.name}</AppText>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(1)}}>
                {h.distance} {'\u00B7'} Cashless
              </AppText>
            </View>
            {h.preferred ? (
              <View style={[styles.pill, {backgroundColor: Colors.tealBg}]}>
                <AppText variant="small" color={Colors.tealText}>Preferred</AppText>
              </View>
            ) : (
              <View style={[styles.pill, {backgroundColor: Colors.background}]}>
                <AppText variant="small" color={Colors.textSecondary}>Network</AppText>
              </View>
            )}
          </View>
        ))}
      </View>
    </View>
  );

  const renderRenewalInsight = () => (
    <View style={[styles.insightBox, {backgroundColor: Colors.amberBg}]}>
      <Icon family="Ionicons" name="alert-circle-outline" size={ms(18)} color={Colors.amberText} />
      <AppText variant="caption" color={Colors.amberText} style={{flex: 1}}>
        Renewal in 8 days. Premium {'\u20B9'}12,800 due by 31 Mar 2026. Contact insurer or renew online to avoid a coverage gap.
      </AppText>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderCoverUtilisation()}
      {renderMembers()}
      {renderEssentials()}
      {renderHospitals()}
      {renderRenewalInsight()}
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
  rowBetween: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  segmentBar: {
    flexDirection: 'row',
    height: vs(8),
    borderRadius: ms(4),
    overflow: 'hidden',
    marginTop: vs(12),
  },
  segmentClaimed: {
    backgroundColor: NAVY,
    borderTopLeftRadius: ms(4),
    borderBottomLeftRadius: ms(4),
  },
  segmentAvailable: {
    backgroundColor: Colors.backgroundSecondary || Colors.background,
    borderTopRightRadius: ms(4),
    borderBottomRightRadius: ms(4),
  },
  legendRow: {
    flexDirection: 'row',
    gap: s(16),
    marginTop: vs(8),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  legendDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  memberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    gap: s(10),
  },
  memberNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  avatar: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  pill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: s(-4),
    marginBottom: vs(10),
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: s(4),
    marginBottom: vs(8),
  },
  gridCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(12),
  },
  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    gap: s(10),
  },
  hospitalIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    padding: ms(12),
    borderRadius: ms(11),
    marginBottom: vs(12),
  },
});

export default InsOverviewTab;
