import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

/* ─── chip ─── */
const Chip = ({label, bg, color}) => (
  <View style={[styles.chip, {backgroundColor: bg}]}>
    <AppText variant="small" color={color}>{label}</AppText>
  </View>
);

/* ─── data ─── */
const FACILITIES = [
  {
    name: 'Yashoda Hospitals',
    location: 'Somajiguda \u00B7 Hyderabad \u00B7 NABH',
    iconName: 'hospital-outline',
    iconBg: Colors.blueBg,
    iconColor: Colors.blueText,
    badges: [
      {label: 'NABH', bg: Colors.blueBg, color: Colors.blueText},
      {label: 'Cardiac imaging', bg: Colors.purpleBg, color: Colors.purpleText},
    ],
    count: '2',
    countLabel: 'scans',
    opacity: 1,
    scans: [
      {
        key: 'xray',
        date: '18 Sep 2025',
        name: 'Chest X-ray \u00B7 PA view',
        sub: 'Dr. Priya Nair \u00B7 Referral Dr. Suresh Rao',
        chips: [
          {label: 'Normal', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'No cardiomegaly', bg: Colors.tealBg, color: Colors.tealText},
        ],
      },
      {
        key: 'echo',
        date: '18 Sep 2025',
        name: 'Echocardiogram \u00B7 2D + Doppler',
        sub: 'Cardiac imaging \u00B7 EF 62%',
        chips: [
          {label: 'Normal', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'EF 62%', bg: Colors.tealBg, color: Colors.tealText},
        ],
      },
    ],
  },
  {
    name: 'Kamineni Hospital',
    location: 'LB Nagar \u00B7 Hyderabad \u00B7 NABH',
    iconName: 'hospital-outline',
    iconBg: Colors.amberBg,
    iconColor: Colors.amberText,
    badges: [
      {label: 'NABH', bg: Colors.blueBg, color: Colors.blueText},
    ],
    count: '1',
    countLabel: 'scan',
    opacity: 1,
    scans: [
      {
        key: 'usg',
        date: '12 Jul 2023',
        name: 'Ultrasound abdomen \u00B7 Complete',
        sub: 'Fatty liver screening \u00B7 Dr. Sarita Menon',
        chips: [
          {label: 'Grade 1 fatty liver', bg: Colors.amberBg, color: Colors.amberText},
          {label: 'Kidneys normal', bg: Colors.tealBg, color: Colors.tealText},
        ],
      },
    ],
  },
  {
    name: 'Sankara Eye Hospital',
    location: 'Hyderabad',
    iconName: 'eye-outline',
    iconBg: Colors.amberBg,
    iconColor: Colors.amberText,
    badges: [
      {label: 'Not yet visited', bg: Colors.redBg, color: Colors.redText},
    ],
    count: '0',
    countLabel: 'scans',
    opacity: 0.7,
    scans: [],
    insight: {
      text: 'Fundus exam 14 months overdue \u2014 referral issued 15 Mar 2026. HbA1c 7.8% increases retinopathy risk. Book urgently.',
      bg: Colors.redBg,
      color: Colors.redText,
    },
  },
];

/* ─── facility header card ─── */
const FacilityHeader = ({facility}) => (
  <View style={styles.headerCard}>
    <View style={styles.headerRow}>
      <View style={[styles.headerIcon, {backgroundColor: facility.iconBg}]}>
        <Icon family="Ionicons" name={facility.iconName} size={ms(22)} color={facility.iconColor} />
      </View>
      <View style={styles.headerContent}>
        <AppText variant="bodyBold">{facility.name}</AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
          {facility.location}
        </AppText>
        <View style={[styles.chipRow, {marginTop: vs(6)}]}>
          {facility.badges.map((b, i) => (
            <Chip key={i} label={b.label} bg={b.bg} color={b.color} />
          ))}
        </View>
      </View>
      <View style={styles.countBox}>
        <AppText variant="header" color={Colors.primary}>{facility.count}</AppText>
        <AppText variant="small" color={Colors.textSecondary}>{facility.countLabel}</AppText>
      </View>
    </View>
  </View>
);

/* ─── scan row ─── */
const ScanRow = ({scan, onPress, isLast}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() => onPress && onPress(scan.key)}
    style={[styles.scanRow, !isLast && styles.scanRowBorder]}>
    <View style={styles.scanDate}>
      <AppText variant="small" color={Colors.primary}>{scan.date}</AppText>
    </View>
    <View style={styles.scanContent}>
      <AppText variant="bodyBold">{scan.name}</AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
        {scan.sub}
      </AppText>
      <View style={[styles.chipRow, {marginTop: vs(6)}]}>
        {scan.chips.map((c, i) => (
          <Chip key={i} label={c.label} bg={c.bg} color={c.color} />
        ))}
      </View>
    </View>
    <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color={Colors.textTertiary} />
  </TouchableOpacity>
);

/* ─── main component ─── */
const ImgByFacilityTab = ({onImagePress}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {FACILITIES.map((facility, fi) => (
        <View key={fi} style={[styles.facilityCard, {opacity: facility.opacity}]}>
          <FacilityHeader facility={facility} />

          {facility.scans.map((scan, si) => (
            <ScanRow
              key={scan.key}
              scan={scan}
              onPress={onImagePress}
              isLast={si === facility.scans.length - 1 && !facility.insight}
            />
          ))}

          {facility.insight ? (
            <View style={[styles.insightRow, {backgroundColor: facility.insight.bg}]}>
              <Icon family="Ionicons" name="alert-circle-outline" size={ms(16)} color={facility.insight.color} />
              <AppText variant="caption" color={facility.insight.color} style={{flex: 1, marginLeft: s(8)}}>
                {facility.insight.text}
              </AppText>
            </View>
          ) : null}
        </View>
      ))}

      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: s(4),
  },
  /* facility card */
  facilityCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    marginBottom: vs(10),
    overflow: 'hidden',
  },
  /* header */
  headerCard: {
    paddingHorizontal: ms(13),
    paddingVertical: vs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  headerIcon: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  headerContent: {
    flex: 1,
  },
  countBox: {
    alignItems: 'center',
    marginLeft: s(8),
  },
  /* chip */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(6),
  },
  chip: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
  },
  /* scan row */
  scanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(13),
    paddingVertical: vs(10),
  },
  scanRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  scanDate: {
    width: ms(70),
    marginRight: s(8),
  },
  scanContent: {
    flex: 1,
  },
  /* insight */
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: ms(13),
    paddingVertical: vs(10),
  },
});

export default ImgByFacilityTab;
