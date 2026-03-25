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
    name: 'Apollo Diagnostics',
    location: 'Banjara Hills \u00B7 Hyderabad',
    iconName: 'flask-outline',
    iconBg: Colors.amberBg,
    iconColor: Colors.amberText,
    badges: [
      {label: 'NABL', bg: Colors.blueBg, color: Colors.blueText},
      {label: 'CAP', bg: Colors.tealBg, color: Colors.tealText},
    ],
    count: '9',
    scans: [
      {
        key: 'apollo-mar2026-comp',
        date: '3 Mar 2026',
        name: 'HbA1c \u00B7 Lipid panel \u00B7 RFT',
        sub: 'Comprehensive metabolic panel',
        chips: [
          {label: 'HbA1c 7.8% \u2191', bg: Colors.redBg, color: Colors.redText},
          {label: '4 flagged', bg: Colors.redBg, color: Colors.redText},
        ],
      },
      {
        key: 'apollo-mar2026-thyroid',
        date: '3 Mar 2026',
        name: 'Thyroid function test (TSH \u00B7 T3 \u00B7 T4)',
        sub: 'All values normal',
        chips: [
          {label: 'All normal', bg: Colors.tealBg, color: Colors.tealText},
        ],
      },
      {
        key: 'apollo-sep2025',
        date: '12 Sep 2025',
        name: 'HbA1c \u00B7 Lipid panel',
        sub: '2 warnings',
        chips: [
          {label: 'HbA1c 7.5%', bg: Colors.amberBg, color: Colors.amberText},
        ],
      },
      {
        key: 'apollo-mar2025',
        date: '8 Mar 2025',
        name: 'HbA1c \u00B7 Lipid panel',
        sub: 'Personal best',
        chips: [
          {label: 'HbA1c 7.2% best', bg: Colors.tealBg, color: Colors.tealText},
        ],
      },
    ],
  },
  {
    name: 'Kamineni Diagnostics',
    location: 'Ameerpet',
    iconName: 'flask-outline',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    badges: [
      {label: 'NABL', bg: Colors.blueBg, color: Colors.blueText},
    ],
    count: '3',
    scans: [
      {
        key: 'kamineni-sep2024',
        date: '20 Sep 2024',
        name: 'HbA1c \u00B7 Vitamin B12',
        sub: 'B12 borderline low',
        chips: [
          {label: 'HbA1c 6.9% best', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'B12 198 low', bg: Colors.amberBg, color: Colors.amberText},
        ],
      },
      {
        key: 'kamineni-sep2023',
        date: '15 Sep 2023',
        name: 'HbA1c',
        sub: 'Routine check',
        chips: [
          {label: 'HbA1c 7.7%', bg: Colors.amberBg, color: Colors.amberText},
        ],
      },
      {
        key: 'kamineni-mar2023',
        date: '10 Mar 2023',
        name: 'USG abdomen \u00B7 Fatty liver',
        sub: 'Screening',
        chips: [
          {label: 'Fatty liver', bg: Colors.amberBg, color: Colors.amberText},
        ],
      },
    ],
  },
];

/* ─── facility header ─── */
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
        <AppText variant="small" color={Colors.textSecondary}>reports</AppText>
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
const LabByLabTab = ({onReportPress}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {FACILITIES.map((facility, fi) => (
        <View key={fi} style={styles.facilityCard}>
          <FacilityHeader facility={facility} />

          {facility.scans.map((scan, si) => (
            <ScanRow
              key={scan.key}
              scan={scan}
              onPress={onReportPress}
              isLast={si === facility.scans.length - 1}
            />
          ))}
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
});

export default LabByLabTab;
