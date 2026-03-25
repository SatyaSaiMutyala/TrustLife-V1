import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Svg, {Circle, Text as SvgText} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const backgroundSecondary = '#F3F4F6';
const borderTertiary = '#d1d5db';
const pinkText = '#9B2C5E';

/* ─── adherence ring ─── */
const AdherenceRing = ({percent, size = 36, strokeWidth = 4}) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const filled = (percent / 100) * circumference;
  const ringColor =
    percent >= 90 ? Colors.teal : percent >= 70 ? Colors.amber : Colors.red;

  return (
    <Svg width={size} height={size}>
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={backgroundSecondary}
        strokeWidth={strokeWidth}
        fill="none"
      />
      <Circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        stroke={ringColor}
        strokeWidth={strokeWidth}
        fill="none"
        strokeDasharray={`${filled} ${circumference - filled}`}
        strokeDashoffset={circumference * 0.25}
        strokeLinecap="round"
      />
      <SvgText
        x={size / 2}
        y={size / 2 + 4}
        textAnchor="middle"
        fontSize={10}
        fontWeight="700"
        fill={ringColor}>
        {percent}
      </SvgText>
    </Svg>
  );
};

/* ─── dot streak ─── */
const DotStreak = ({pattern}) => (
  <View style={styles.dotRow}>
    {pattern.map((taken, i) => (
      <View
        key={i}
        style={[
          styles.dot,
          {backgroundColor: taken ? Colors.teal : Colors.red},
        ]}
      />
    ))}
  </View>
);

/* ─── link chip ─── */
const LinkChip = ({label, bg}) => (
  <View style={[styles.linkChip, {backgroundColor: bg}]}>
    <AppText variant="small" color={Colors.textSecondary}>
      {label}
    </AppText>
  </View>
);

/* ─── drug data ─── */
const DRUGS = [
  {
    key: 'metformin',
    name: 'Metformin',
    generic: 'Metformin hydrochloride',
    brand: 'Glyciphage 500',
    dose: '500mg',
    freq: 'Twice daily',
    timing: 'With food',
    status: 'Active',
    since: 'Since Sep 2019',
    borderColor: Colors.primary,
    adherence: 71,
    adherenceLabel: '71% adherence',
    adherenceDetail: 'PM dose at risk',
    adherenceCaption: '7 PM doses missed',
    adherencePill: 'Below target',
    adherencePillBg: Colors.amberBg,
    adherencePillColor: Colors.amberText,
    adherenceTextColor: Colors.amberText,
    dots: [
      1,1,0,1,1,0,1,1,0,1,1,1,0,1,1,0,1,1,1,0,1,1,0,1,
    ],
    links: [
      {label: '15 Mar visit', bg: Colors.blueBg},
      {label: 'GI nausea (2024)', bg: Colors.pinkBg},
      {label: 'HbA1c 7.8%', bg: Colors.amberBg},
    ],
    doctor: 'Dr. Kavitha',
    hospital: 'KIMS',
  },
  {
    key: 'amlodipine',
    name: 'Amlodipine',
    generic: 'Amlodipine besylate',
    brand: 'Amlong 5',
    dose: '5mg',
    freq: 'Once daily',
    timing: 'Morning',
    status: 'Active',
    since: 'Since Mar 2021',
    borderColor: Colors.primary,
    adherence: 100,
    adherenceLabel: '100%',
    adherenceDetail: '30-day streak',
    adherenceCaption: null,
    adherencePill: 'Excellent',
    adherencePillBg: Colors.tealBg,
    adherencePillColor: Colors.tealText,
    adherenceTextColor: Colors.tealText,
    dots: [
      1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    ],
    links: [
      {label: '15 Mar visit', bg: Colors.blueBg},
      {label: 'Ankle swelling', bg: Colors.pinkBg},
      {label: 'BP 138/88', bg: Colors.amberBg},
    ],
    doctor: 'Dr. Kavitha',
    hospital: 'KIMS',
  },
  {
    key: 'atorvastatin',
    name: 'Atorvastatin',
    generic: 'Atorvastatin calcium',
    brand: 'Atorva 10',
    dose: '10mg',
    freq: 'Once daily',
    timing: 'Bedtime',
    status: 'Active',
    since: 'Since Jun 2022',
    borderColor: Colors.primary,
    adherence: 97,
    adherenceLabel: '97%',
    adherenceDetail: '1 dose missed',
    adherenceCaption: null,
    adherencePill: 'Good',
    adherencePillBg: Colors.tealBg,
    adherencePillColor: Colors.tealText,
    adherenceTextColor: Colors.tealText,
    dots: [
      1,1,1,1,1,1,1,1,1,0,1,1,1,1,1,1,1,1,1,1,1,1,1,1,
    ],
    links: [
      {label: '15 Mar visit', bg: Colors.blueBg},
      {label: 'LDL 118 \u2193', bg: Colors.amberBg},
    ],
    doctor: 'Dr. Kavitha',
    hospital: 'KIMS',
  },
  {
    key: 'methylcobalamin',
    name: 'Methylcobalamin',
    generic: 'Methylcobalamin',
    brand: 'Meconerv 1500',
    dose: '1500mcg',
    freq: 'Once daily',
    timing: 'After breakfast',
    status: 'Active',
    since: 'Since 15 Mar 2026',
    borderColor: Colors.lightGreen,
    adherence: 100,
    adherenceLabel: '100%',
    adherenceDetail: 'Day 9 of treatment',
    adherenceCaption: '100% so far',
    adherencePill: 'On track',
    adherencePillBg: Colors.tealBg,
    adherencePillColor: Colors.tealText,
    adherenceTextColor: Colors.tealText,
    dots: [
      1,1,1,1,1,1,1,1,1,
    ],
    links: [
      {label: '15 Mar visit', bg: Colors.blueBg},
      {label: 'Fatigue (active)', bg: Colors.pinkBg},
      {label: 'Hb 11.8 low', bg: Colors.amberBg},
    ],
    doctor: 'Dr. Kavitha',
    hospital: 'KIMS',
  },
];

/* ─── component ─── */
const RxCurrentTab = ({onDrugPress}) => {
  const renderBanner = () => (
    <View style={styles.card}>
      <View style={styles.bannerRow}>
        <View style={[styles.iconCircle, {backgroundColor: Colors.purpleBg}]}>
          <Icon
            family="Ionicons"
            name="medical-outline"
            size={18}
            color={Colors.purpleText}
          />
        </View>
        <View style={{flex: 1, marginLeft: s(10)}}>
          <AppText variant="bodyBold">
            Current prescription set {'\u00B7'} 15 Mar 2026
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            Dr. Kavitha Reddy {'\u00B7'} KIMS {'\u00B7'} Valid till 13 Jun 2026
          </AppText>
        </View>
        <TouchableOpacity
          style={[styles.pillBtn, {backgroundColor: Colors.purpleBg}]}>
          <AppText variant="small" color={Colors.purpleText}>
            View Rx
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderDrugCard = drug => (
    <TouchableOpacity
      key={drug.key}
      activeOpacity={0.7}
      onPress={() => onDrugPress && onDrugPress(drug.key)}
      style={[styles.card, {borderLeftWidth: 3, borderLeftColor: drug.borderColor}]}>
      {/* Header */}
      <View style={styles.drugHeader}>
        <View style={[styles.iconCircle, {backgroundColor: Colors.purpleBg}]}>
          <Icon
            family="Ionicons"
            name="medical-outline"
            size={16}
            color={Colors.purpleText}
          />
        </View>
        <View style={{flex: 1, marginLeft: s(10)}}>
          <AppText variant="bodyBold" style={{fontSize: ms(15)}}>
            {drug.name}
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            {drug.generic} {'\u00B7'} {drug.brand}
          </AppText>
          <AppText variant="caption" color={Colors.primary}>
            {drug.dose} {'\u00B7'} {drug.freq} {'\u00B7'} {drug.timing}
          </AppText>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <View style={[styles.pillBtn, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="small" color={Colors.tealText}>
              {drug.status}
            </AppText>
          </View>
          <AppText
            variant="small"
            color={Colors.textTertiary}
            style={{marginTop: vs(4)}}>
            {drug.since}
          </AppText>
        </View>
      </View>

      {/* Adherence row */}
      <View style={styles.adherenceRow}>
        <AdherenceRing percent={drug.adherence} size={ms(36)} strokeWidth={ms(4)} />
        <View style={{flex: 1, marginLeft: s(10)}}>
          <AppText variant="bodyBold" color={drug.adherenceTextColor}>
            {drug.adherenceLabel} {'\u00B7'} {drug.adherenceDetail}
          </AppText>
          {drug.adherenceCaption ? (
            <AppText variant="caption" color={Colors.textSecondary}>
              {drug.adherenceCaption}
            </AppText>
          ) : null}
        </View>
        <View
          style={[
            styles.pillBtn,
            {backgroundColor: drug.adherencePillBg},
          ]}>
          <AppText variant="small" color={drug.adherencePillColor}>
            {drug.adherencePill}
          </AppText>
        </View>
      </View>

      {/* Dot streak */}
      <DotStreak pattern={drug.dots} />

      {/* Link chips */}
      <View style={styles.linkChipRow}>
        {drug.links.map((lnk, i) => (
          <LinkChip key={i} label={lnk.label} bg={lnk.bg} />
        ))}
      </View>

      {/* Footer */}
      <View style={styles.drugFooter}>
        <AppText variant="caption" color={Colors.textSecondary}>
          Prescribed by {drug.doctor} {'\u00B7'} {drug.hospital}
        </AppText>
        <Icon
          family="Ionicons"
          name="chevron-forward"
          size={16}
          color={Colors.textTertiary}
        />
      </View>
    </TouchableOpacity>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {renderBanner()}
      {DRUGS.map(renderDrugCard)}

      {/* Refill insight */}
      <View style={[styles.insightCard, {backgroundColor: Colors.amberBg}]}>
        <Icon
          family="Ionicons"
          name="alert-circle-outline"
          size={18}
          color={Colors.amberText}
        />
        <AppText
          variant="caption"
          color={Colors.amberText}
          style={{marginLeft: s(8), flex: 1}}>
          Refill due in ~18 days. You will need to visit KIMS or contact Dr.
          Kavitha Reddy before your current prescription expires on 13 Jun 2026.
        </AppText>
      </View>
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
  bannerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillBtn: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(12),
  },
  drugHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  adherenceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(12),
    paddingTop: vs(10),
    borderTopWidth: 0.5,
    borderTopColor: borderTertiary,
  },
  dotRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(4),
    marginTop: vs(10),
  },
  dot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  linkChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginTop: vs(10),
  },
  linkChip: {
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
  },
  drugFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(10),
    paddingTop: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: borderTertiary,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    padding: ms(14),
  },
});

export default RxCurrentTab;
