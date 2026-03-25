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

const backgroundSecondary = '#F3F4F6';
const borderTertiary = '#d1d5db';

/* ── Prescribed-for card ── */
const PrescribedForCard = () => (
  <View style={styles.card}>
    <View style={styles.row}>
      <View style={[styles.iconCircle, {backgroundColor: Colors.amberBg}]}>
        <Icon
          family="Ionicons"
          name="target-outline"
          size={18}
          color={Colors.amberText}
        />
      </View>
      <View style={{flex: 1, marginLeft: s(10)}}>
        <AppText variant="bodyBold">Type 2 Diabetes Mellitus (T2DM)</AppText>
        <AppText variant="caption" color={Colors.textSecondary}>
          ICD-10: E11.9 {'\u00B7'} Primary glucose control {'\u00B7'} Biguanide
        </AppText>
      </View>
    </View>
  </View>
);

/* ── Dosage & timing card ── */
const TimingCell = ({label, bg, time, detail, detailColor, borderColor}) => (
  <View
    style={[
      styles.timingCell,
      {backgroundColor: bg, borderColor: borderColor || bg},
      borderColor ? {borderWidth: 1} : null,
    ]}>
    <AppText variant="bodyBold" style={{fontSize: ms(13)}}>
      {label}
    </AppText>
    <AppText
      variant="caption"
      color={Colors.textSecondary}
      style={{marginTop: vs(2)}}>
      {time}
    </AppText>
    <AppText
      variant="small"
      color={detailColor || Colors.textSecondary}
      style={{marginTop: vs(4)}}>
      {detail}
    </AppText>
  </View>
);

const DosageTimingCard = () => (
  <View style={styles.card}>
    <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
      Dosage & timing
    </AppText>
    <View style={styles.timingGrid}>
      <TimingCell
        label="AM"
        bg={Colors.tealBg}
        time="7:30 - 8:30 AM"
        detail="92% adherence"
        detailColor={Colors.tealText}
      />
      <TimingCell
        label="PM"
        bg={Colors.amberBg}
        time="8:00 PM"
        detail="Critical \u00B7 71%"
        detailColor={Colors.amberText}
        borderColor={Colors.amber}
      />
      <TimingCell
        label="With food"
        bg={backgroundSecondary}
        time="Always"
        detail=""
      />
    </View>
  </View>
);

/* ── How it works card ── */
const HOW_IT_WORKS = [
  {
    icon: 'flask-outline',
    text: 'Reduces glucose production in the liver',
  },
  {
    icon: 'body-outline',
    text: 'Improves insulin sensitivity in muscles',
  },
  {
    icon: 'warning-outline',
    text: 'May deplete Vitamin B12 over time',
  },
];

const HowItWorksCard = () => (
  <View style={styles.card}>
    <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
      How it works
    </AppText>
    {HOW_IT_WORKS.map((item, i) => (
      <View
        key={i}
        style={[
          styles.row,
          i > 0 && {
            marginTop: vs(10),
            paddingTop: vs(10),
            borderTopWidth: 0.5,
            borderTopColor: borderTertiary,
          },
        ]}>
        <View style={[styles.iconCircle, {backgroundColor: Colors.blueBg}]}>
          <Icon
            family="Ionicons"
            name={item.icon}
            size={16}
            color={Colors.blueText}
          />
        </View>
        <AppText
          variant="body"
          color={Colors.textSecondary}
          style={{flex: 1, marginLeft: s(10)}}>
          {item.text}
        </AppText>
      </View>
    ))}
  </View>
);

/* ── Things to avoid card ── */
const AVOID_ITEMS = [
  {label: 'Alcohol', detail: 'Never', bg: Colors.redBg, color: Colors.redText},
  {
    label: 'CT contrast dye',
    detail: '48h hold',
    bg: Colors.redBg,
    color: Colors.redText,
  },
  {
    label: 'Ibuprofen',
    detail: 'Avoid',
    bg: Colors.amberBg,
    color: Colors.amberText,
  },
  {
    label: 'Surgery',
    detail: 'Inform doctor',
    bg: Colors.amberBg,
    color: Colors.amberText,
  },
];

const ThingsToAvoidCard = () => (
  <View style={styles.card}>
    <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
      Things to avoid
    </AppText>
    {AVOID_ITEMS.map((item, i) => (
      <View
        key={i}
        style={[
          styles.avoidRow,
          i > 0 && {
            marginTop: vs(8),
            paddingTop: vs(8),
            borderTopWidth: 0.5,
            borderTopColor: borderTertiary,
          },
        ]}>
        <AppText variant="body" style={{flex: 1}}>
          {item.label}
        </AppText>
        <View style={[styles.pill, {backgroundColor: item.bg}]}>
          <AppText variant="small" color={item.color}>
            {item.detail}
          </AppText>
        </View>
      </View>
    ))}
  </View>
);

/* ── Monitoring card ── */
const MONITORING = [
  {
    label: 'HbA1c',
    detail: 'Apr 4 due',
    bg: Colors.amberBg,
    color: Colors.amberText,
  },
  {
    label: 'Kidney eGFR',
    detail: '72 \u00B7 Safe',
    bg: Colors.tealBg,
    color: Colors.tealText,
  },
  {
    label: 'Vitamin B12',
    detail: 'Pending',
    bg: Colors.amberBg,
    color: Colors.amberText,
  },
];

const MonitoringCard = () => (
  <View style={styles.card}>
    <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
      Monitoring
    </AppText>
    {MONITORING.map((item, i) => (
      <View
        key={i}
        style={[
          styles.avoidRow,
          i > 0 && {
            marginTop: vs(8),
            paddingTop: vs(8),
            borderTopWidth: 0.5,
            borderTopColor: borderTertiary,
          },
        ]}>
        <AppText variant="body" style={{flex: 1}}>
          {item.label}
        </AppText>
        <View style={[styles.pill, {backgroundColor: item.bg}]}>
          <AppText variant="small" color={item.color}>
            {item.detail}
          </AppText>
        </View>
      </View>
    ))}
  </View>
);

/* ── Supply & refill card ── */
const SupplyRefillCard = () => (
  <View style={styles.card}>
    <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
      Supply & refill
    </AppText>

    {/* Progress bar */}
    <View style={styles.progressTrack}>
      <View style={[styles.progressFill, {width: '40%'}]} />
    </View>
    <View style={styles.supplyMeta}>
      <AppText variant="caption" color={Colors.amberText}>
        ~18 days remaining
      </AppText>
      <AppText variant="caption" color={Colors.textSecondary}>
        40% left
      </AppText>
    </View>

    <View
      style={{
        marginTop: vs(10),
        paddingTop: vs(10),
        borderTopWidth: 0.5,
        borderTopColor: borderTertiary,
      }}>
      <AppText variant="caption" color={Colors.textSecondary}>
        Glyciphage 500 {'\u00B7'} 60 tablets/pack {'\u00B7'} Approx. cost
        Rs. 85
      </AppText>
    </View>
  </View>
);

/* ── Main component ── */
const MetDrugDetailsTab = () => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}>
    <PrescribedForCard />
    <DosageTimingCard />
    <HowItWorksCard />
    <ThingsToAvoidCard />
    <MonitoringCard />
    <SupplyRefillCard />
  </ScrollView>
);

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
  row: {
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
  timingGrid: {
    flexDirection: 'row',
    gap: s(8),
  },
  timingCell: {
    flex: 1,
    borderRadius: ms(10),
    padding: ms(10),
    alignItems: 'center',
  },
  avoidRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(12),
  },
  progressTrack: {
    height: vs(8),
    backgroundColor: backgroundSecondary,
    borderRadius: ms(4),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.amber,
    borderRadius: ms(4),
  },
  supplyMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(6),
  },
});

export default MetDrugDetailsTab;
