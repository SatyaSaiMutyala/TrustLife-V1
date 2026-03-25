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

const borderTertiary = '#d1d5db';
const greyBg = '#E5E7EB';
const greyText = '#6B7280';

/* ─── link chip ─── */
const LinkChip = ({label, bg}) => (
  <View style={[styles.linkChip, {backgroundColor: bg}]}>
    <AppText variant="small" color={Colors.textSecondary}>
      {label}
    </AppText>
  </View>
);

/* ─── data ─── */
const PRESCRIPTION_SETS = [
  {
    key: 'sep2025',
    date: 'Sep 2025',
    subtitle: null,
    headerBg: Colors.tealBg,
    doctorLine: 'Dr. Kavitha \u00B7 10 Sep 2025',
    detailLine: 'KIMS \u00B7 6-month review',
    statusPill: 'Expired',
    statusPillBg: greyBg,
    statusPillColor: greyText,
    drugs: [
      {
        name: 'Metformin 500mg BD',
        note: 'Continued',
        noteBg: Colors.tealBg,
        noteColor: Colors.tealText,
        details: null,
        links: [],
      },
      {
        name: 'Amlodipine 5mg OD',
        note: 'Continued',
        noteBg: Colors.tealBg,
        noteColor: Colors.tealText,
        details: null,
        links: [],
      },
      {
        name: 'Atorvastatin 10mg OD',
        note: 'Continued',
        noteBg: Colors.tealBg,
        noteColor: Colors.tealText,
        details: null,
        links: [],
      },
    ],
  },
  {
    key: 'jun2022',
    date: 'Jun 2022',
    subtitle: 'New condition',
    headerBg: Colors.pinkBg,
    doctorLine: 'Dr. Kavitha \u00B7 14 Jun 2022',
    detailLine: 'Dyslipidaemia diagnosed \u00B7 LDL 168',
    statusPill: 'New drug added',
    statusPillBg: Colors.redBg,
    statusPillColor: Colors.redText,
    drugs: [
      {
        name: 'Atorvastatin 10mg OD bedtime',
        note: null,
        details: 'LDL 168 at start \u2192 118 today',
        links: [
          {label: 'LDL 168 at start', bg: Colors.amberBg},
          {label: 'LDL 118 today', bg: Colors.tealBg},
        ],
      },
    ],
  },
  {
    key: 'mar2021',
    date: 'Mar 2021',
    subtitle: 'HTN diagnosed',
    headerBg: Colors.pinkBg,
    doctorLine: 'Dr. Kavitha \u00B7 20 Mar 2021',
    detailLine: 'BP 158/98',
    statusPill: 'New drug added',
    statusPillBg: Colors.redBg,
    statusPillColor: Colors.redText,
    drugs: [
      {
        name: 'Amlodipine 5mg OD',
        note: null,
        details: 'BP at diagnosis 158/98, today 138/88',
        links: [
          {label: 'Ankle swelling', bg: Colors.pinkBg},
        ],
      },
    ],
  },
  {
    key: 'sep2019',
    date: 'Sep 2019',
    subtitle: 'Diabetes diagnosis',
    headerBg: Colors.pinkBg,
    doctorLine: 'Dr. Kavitha \u00B7 14 Sep 2019',
    detailLine: 'T2DM \u00B7 HbA1c 8.2%',
    statusPill: 'First prescription',
    statusPillBg: Colors.redBg,
    statusPillColor: Colors.redText,
    drugs: [
      {
        name: 'Metformin 500mg BD',
        note: null,
        details: null,
        links: [
          {label: 'Nausea resolved', bg: Colors.pinkBg},
          {label: 'HbA1c 8.2%', bg: Colors.amberBg},
        ],
      },
    ],
  },
];

/* ─── component ─── */
const RxHistoryTab = () => {
  const renderDrugRow = (drug, index) => (
    <View
      key={index}
      style={[
        styles.drugRow,
        index > 0 && {borderTopWidth: 0.5, borderTopColor: borderTertiary},
      ]}>
      <View style={styles.drugRowHeader}>
        <Icon
          family="Ionicons"
          name="medical-outline"
          size={14}
          color={Colors.primary}
        />
        <AppText variant="bodyBold" style={{marginLeft: s(6), flex: 1}}>
          {drug.name}
        </AppText>
        {drug.note ? (
          <View style={[styles.pillBtn, {backgroundColor: drug.noteBg}]}>
            <AppText variant="small" color={drug.noteColor}>
              {drug.note}
            </AppText>
          </View>
        ) : null}
      </View>
      {drug.details ? (
        <AppText
          variant="caption"
          color={Colors.textSecondary}
          style={{marginTop: vs(4), marginLeft: s(20)}}>
          {drug.details}
        </AppText>
      ) : null}
      {drug.links.length > 0 ? (
        <View style={styles.linkChipRow}>
          {drug.links.map((lnk, i) => (
            <LinkChip key={i} label={lnk.label} bg={lnk.bg} />
          ))}
        </View>
      ) : null}
    </View>
  );

  const renderPrescriptionSet = set => (
    <View key={set.key} style={styles.card}>
      {/* Section header */}
      <View style={[styles.sectionHeader, {backgroundColor: set.headerBg}]}>
        <View style={{flex: 1}}>
          <AppText variant="bodyBold">
            {set.date}
            {set.subtitle ? ` \u2014 ${set.subtitle}` : ''}
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            {set.doctorLine}
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            {set.detailLine}
          </AppText>
        </View>
        <View
          style={[styles.pillBtn, {backgroundColor: set.statusPillBg}]}>
          <AppText variant="small" color={set.statusPillColor}>
            {set.statusPill}
          </AppText>
        </View>
      </View>

      {/* Drug rows */}
      {set.drugs.map(renderDrugRow)}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Insight banner */}
      <View style={[styles.insightCard, {backgroundColor: Colors.purpleBg}]}>
        <Icon
          family="Ionicons"
          name="time-outline"
          size={18}
          color={Colors.purpleText}
        />
        <AppText
          variant="caption"
          color={Colors.purpleText}
          style={{marginLeft: s(8), flex: 1}}>
          Complete medication history since diagnosis Sep 2019. Each
          prescription set shows what was prescribed, why, and how it connects
          to your health timeline.
        </AppText>
      </View>

      {PRESCRIPTION_SETS.map(renderPrescriptionSet)}
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
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: ms(14),
  },
  pillBtn: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(12),
  },
  drugRow: {
    padding: ms(14),
  },
  drugRowHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkChipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginTop: vs(8),
    marginLeft: s(20),
  },
  linkChip: {
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
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

export default RxHistoryTab;
