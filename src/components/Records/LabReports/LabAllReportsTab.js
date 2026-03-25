import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

/* ─── year header ─── */
const YearHeader = ({year, count}) => (
  <View style={styles.yearRow}>
    <View style={styles.yearPill}>
      <AppText variant="small" color={Colors.white}>{year}</AppText>
    </View>
    <View style={styles.yearLine} />
    <AppText variant="small" color={Colors.textTertiary}>{count}</AppText>
  </View>
);

/* ─── chip ─── */
const Chip = ({label, bg, color}) => (
  <View style={[styles.chip, {backgroundColor: bg}]}>
    <AppText variant="small" color={color}>{label}</AppText>
  </View>
);

/* ─── data ─── */
const SECTIONS = [
  {
    year: '2026',
    count: '2 reports',
    cards: [
      {
        key: 'mar2026-comprehensive',
        borderColor: Colors.red,
        iconName: 'flask-outline',
        iconBg: Colors.amberBg,
        iconColor: Colors.amberText,
        title: 'HbA1c \u00B7 Lipid panel \u00B7 RFT \u00B7 CBC \u00B7 Urine ACR',
        subtitle: 'Apollo Diagnostics \u00B7 Banjara Hills',
        badges: [{label: 'NABL', bg: Colors.blueBg, color: Colors.blueText}],
        date: '3 Mar 2026',
        flagLabel: '4 flagged',
        chips: [
          {label: 'HbA1c 7.8% \u2191', bg: Colors.redBg, color: Colors.redText},
          {label: 'FPG 8.4 \u2191', bg: Colors.redBg, color: Colors.redText},
          {label: 'TG 162', bg: Colors.amberBg, color: Colors.amberText},
          {label: 'LDL 118 \u2193', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'Hb 11.8 \u2193', bg: Colors.amberBg, color: Colors.amberText},
          {label: 'eGFR 72', bg: Colors.tealBg, color: Colors.tealText},
        ],
        footer: {label: 'Reviewed 15 Mar \u00B7 Dr. Kavitha', bg: Colors.tealBg, color: Colors.tealText},
      },
      {
        key: 'mar2026-thyroid',
        borderColor: Colors.lightGreen,
        iconName: 'flask-outline',
        iconBg: Colors.purpleBg,
        iconColor: Colors.purpleText,
        title: 'Thyroid function test (TSH \u00B7 T3 \u00B7 T4)',
        subtitle: 'Apollo Diagnostics',
        badges: [],
        date: null,
        flagLabel: null,
        allClear: true,
        chips: [
          {label: 'TSH 2.4 \u2713', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'T3 3.2 \u2713', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'T4 14.2 \u2713', bg: Colors.tealBg, color: Colors.tealText},
        ],
        footer: null,
      },
    ],
  },
  {
    year: '2025',
    count: '2 reports',
    cards: [
      {
        key: 'sep2025',
        borderColor: Colors.amber,
        iconName: 'flask-outline',
        iconBg: Colors.amberBg,
        iconColor: Colors.amberText,
        title: 'HbA1c \u00B7 Lipid panel',
        subtitle: 'Apollo Diagnostics \u00B7 Banjara Hills',
        badges: [{label: 'NABL', bg: Colors.blueBg, color: Colors.blueText}],
        date: '12 Sep 2025',
        flagLabel: '2 warnings',
        chips: [
          {label: 'HbA1c 7.5%', bg: Colors.amberBg, color: Colors.amberText},
          {label: 'LDL 132', bg: Colors.amberBg, color: Colors.amberText},
        ],
        footer: null,
      },
      {
        key: 'mar2025',
        borderColor: Colors.lightGreen,
        iconName: 'flask-outline',
        iconBg: Colors.tealBg,
        iconColor: Colors.tealText,
        title: 'HbA1c \u00B7 Lipid panel',
        subtitle: 'Apollo Diagnostics \u00B7 Banjara Hills',
        badges: [],
        date: '8 Mar 2025',
        flagLabel: null,
        chips: [
          {label: 'HbA1c 7.2% best', bg: Colors.tealBg, color: Colors.tealText},
        ],
        footer: null,
      },
    ],
  },
  {
    year: '2024',
    count: '1 report',
    cards: [
      {
        key: 'sep2024',
        borderColor: Colors.lightGreen,
        iconName: 'flask-outline',
        iconBg: Colors.tealBg,
        iconColor: Colors.tealText,
        title: 'HbA1c \u00B7 Vitamin B12',
        subtitle: 'Kamineni Diagnostics \u00B7 Ameerpet',
        badges: [{label: 'NABL', bg: Colors.blueBg, color: Colors.blueText}],
        date: '20 Sep 2024',
        flagLabel: null,
        chips: [
          {label: 'HbA1c 6.9% best ever', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'B12 198 low', bg: Colors.amberBg, color: Colors.amberText},
        ],
        footer: null,
      },
    ],
  },
  {
    year: '2019',
    count: '1 report',
    cards: [
      {
        key: 'origin2019',
        borderColor: Colors.red,
        iconName: 'flask-outline',
        iconBg: Colors.redBg,
        iconColor: Colors.redText,
        title: 'HbA1c \u00B7 Fasting plasma glucose',
        subtitle: 'Apollo Diagnostics \u00B7 Banjara Hills',
        badges: [],
        date: null,
        flagLabel: null,
        originLabel: 'Origin',
        chips: [
          {label: 'HbA1c 8.2%', bg: Colors.redBg, color: Colors.redText},
          {label: 'FPG 14.2', bg: Colors.redBg, color: Colors.redText},
        ],
        footer: null,
      },
    ],
  },
];

/* ─── report card ─── */
const ReportCard = ({card, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() => onPress && onPress(card.key)}
    style={[styles.card, {borderLeftWidth: 3, borderLeftColor: card.borderColor}]}>
    {/* Info row */}
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, {backgroundColor: card.iconBg}]}>
        <Icon family="Ionicons" name={card.iconName} size={ms(16)} color={card.iconColor} />
      </View>
      <View style={styles.infoContent}>
        <AppText variant="bodyBold">{card.title}</AppText>
        <View style={styles.subtitleRow}>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
            {card.subtitle}
          </AppText>
          {card.badges.map((b, i) => (
            <View key={i} style={[styles.badgeInline, {backgroundColor: b.bg, marginTop: vs(2)}]}>
              <AppText variant="small" color={b.color}>{b.label}</AppText>
            </View>
          ))}
        </View>
      </View>
      <View style={styles.rightInfo}>
        {card.date ? (
          <AppText variant="small" color={Colors.textSecondary}>{card.date}</AppText>
        ) : null}
        {card.flagLabel ? (
          <AppText variant="small" color={Colors.redText} style={{marginTop: vs(2)}}>
            {card.flagLabel}
          </AppText>
        ) : null}
        {card.allClear ? (
          <AppText variant="small" color={Colors.tealText}>All clear</AppText>
        ) : null}
        {card.originLabel ? (
          <View style={[styles.chip, {backgroundColor: Colors.redBg}]}>
            <AppText variant="small" color={Colors.redText}>{card.originLabel}</AppText>
          </View>
        ) : null}
      </View>
    </View>

    {/* Value chips */}
    <View style={styles.chipRow}>
      {card.chips.map((c, i) => (
        <Chip key={i} label={c.label} bg={c.bg} color={c.color} />
      ))}
    </View>

    {/* Footer */}
    {card.footer ? (
      <View style={styles.footer}>
        <View style={[styles.chip, {backgroundColor: card.footer.bg}]}>
          <AppText variant="small" color={card.footer.color}>{card.footer.label}</AppText>
        </View>
        <Icon family="Ionicons" name="chevron-forward" size={ms(14)} color={Colors.textTertiary} />
      </View>
    ) : null}
  </TouchableOpacity>
);

/* ─── main component ─── */
const LabAllReportsTab = ({onReportPress}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {SECTIONS.map((section, si) => (
        <View key={si}>
          <YearHeader year={section.year} count={section.count} />
          {section.cards.map((card) => (
            <ReportCard key={card.key} card={card} onPress={onReportPress} />
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
  /* year header */
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
    marginTop: vs(6),
  },
  yearPill: {
    backgroundColor: Colors.primary,
    paddingHorizontal: ms(10),
    paddingVertical: vs(3),
    borderRadius: ms(10),
  },
  yearLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
    marginHorizontal: s(8),
  },
  /* card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    marginBottom: vs(10),
    overflow: 'hidden',
  },
  /* info */
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: ms(13),
    paddingVertical: vs(10),
  },
  infoIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
    marginTop: vs(2),
  },
  infoContent: {
    flex: 1,
  },
  subtitleRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: ms(6),
  },
  badgeInline: {
    paddingHorizontal: ms(6),
    paddingVertical: vs(1),
    borderRadius: ms(6),
  },
  rightInfo: {
    alignItems: 'flex-end',
    marginLeft: s(8),
  },
  /* chips */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: ms(13),
    paddingBottom: vs(8),
    gap: ms(6),
  },
  chip: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
  },
  /* footer */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(13),
    paddingVertical: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
  },
});

export default LabAllReportsTab;
