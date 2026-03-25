import React from 'react';
import {View, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight;

const visits = [
  {
    year: '2026',
    items: [
      {
        key: 'mar2026',
        doctor: 'Dr. Kavitha Reddy',
        specialty: 'Endocrinology',
        purpose: '6-month review \u00B7 T2DM + HTN + Dyslipidaemia',
        date: '15 Mar 2026',
        location: 'KIMS Hospital',
        tags: [
          {label: 'HbA1c \u2192 7.8%', bg: Colors.redBg, color: Colors.redText},
          {label: 'LDL \u2192 118', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'Eye exam ordered', bg: Colors.amberBg, color: Colors.amberText},
        ],
      },
      {
        key: 'jan2026',
        doctor: 'Dr. Kavitha Reddy',
        specialty: 'Endocrinology',
        purpose: 'Quarterly follow-up \u00B7 Medication review',
        date: '10 Jan 2026',
        location: 'KIMS Hospital',
        tags: [
          {label: 'HbA1c \u2192 7.2%', bg: Colors.amberBg, color: Colors.amberText},
          {label: 'BP stable', bg: Colors.tealBg, color: Colors.tealText},
        ],
      },
    ],
  },
  {
    year: '2025',
    items: [
      {
        key: 'sep2025',
        doctor: 'Dr. Kavitha Reddy',
        specialty: 'Endocrinology',
        purpose: 'Annual comprehensive review',
        date: '20 Sep 2025',
        location: 'KIMS Hospital',
        tags: [
          {label: 'Kidney check normal', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'Flu vax given', bg: Colors.blueBg, color: Colors.blueText},
        ],
      },
      {
        key: 'aug2025',
        doctor: 'Dr. Suresh Rao',
        specialty: 'Cardiology',
        purpose: 'Cardiac evaluation \u00B7 Chest pain workup',
        date: '14 Aug 2025',
        location: 'Yashoda Hospitals',
        tags: [
          {label: 'Echo normal', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'ECG: NSR', bg: Colors.tealBg, color: Colors.tealText},
        ],
      },
      {
        key: 'mar2025',
        doctor: 'Dr. Kavitha Reddy',
        specialty: 'Endocrinology',
        purpose: '6-month review \u00B7 Dose adjustment',
        date: '18 Mar 2025',
        location: 'KIMS Hospital',
        tags: [
          {label: 'HbA1c \u2192 7.0%', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'Metformin PM added', bg: Colors.amberBg, color: Colors.amberText},
        ],
      },
    ],
  },
  {
    year: '2022',
    items: [
      {
        key: 'jun2022',
        doctor: 'Dr. Kavitha Reddy',
        specialty: 'Endocrinology',
        purpose: 'Annual review \u00B7 Atorvastatin started',
        date: '22 Jun 2022',
        location: 'KIMS Hospital',
        tags: [
          {label: 'LDL 156 \u2192 Statin started', bg: Colors.redBg, color: Colors.redText},
        ],
      },
    ],
  },
  {
    year: '2021',
    items: [
      {
        key: 'mar2021',
        doctor: 'Dr. Kavitha Reddy',
        specialty: 'Endocrinology',
        purpose: 'Annual review \u00B7 Stable control',
        date: '10 Mar 2021',
        location: 'KIMS Hospital',
        tags: [
          {label: 'HbA1c \u2192 6.8%', bg: Colors.tealBg, color: Colors.tealText},
        ],
      },
    ],
  },
  {
    year: '2019',
    items: [
      {
        key: 'sep2019',
        doctor: 'Dr. Kavitha Reddy',
        specialty: 'Endocrinology',
        purpose: 'Initial diagnosis \u00B7 T2DM + HTN',
        date: '12 Sep 2019',
        location: 'KIMS Hospital',
        tags: [
          {label: 'Diagnosis: T2DM', bg: Colors.redBg, color: Colors.redText},
          {label: 'Metformin started', bg: Colors.amberBg, color: Colors.amberText},
          {label: 'Amlodipine started', bg: Colors.blueBg, color: Colors.blueText},
        ],
      },
    ],
  },
];

/* ─── Year separator ─── */
const YearSeparator = ({label}) => (
  <View style={styles.sepRow}>
    <AppText variant="small" color={Colors.textTertiary} style={styles.sepText}>
      {label}
    </AppText>
    <View style={styles.sepLine} />
  </View>
);

/* ─── Visit card ─── */
const VisitCard = ({visit, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    style={styles.card}
    onPress={() => onPress(visit.key)}>
    <View style={styles.cardTop}>
      <View style={styles.iconCircle}>
        <Icon family="Ionicons" name="medical-outline" size={16} color={Colors.blueText} />
      </View>

      <View style={styles.cardContent}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>
          {visit.doctor} {'\u00B7'} {visit.specialty}
        </AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
          {visit.purpose}
        </AppText>
        <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(3)}}>
          {visit.date} {'\u00B7'} {visit.location}
        </AppText>
      </View>

      <Icon
        family="Ionicons"
        name="chevron-forward"
        size={16}
        color={Colors.textTertiary}
      />
    </View>

    {visit.tags.length > 0 && (
      <View style={styles.tagsRow}>
        {visit.tags.map((tag, ti) => (
          <View key={ti} style={[styles.tag, {backgroundColor: tag.bg}]}>
            <AppText variant="small" color={tag.color}>
              {tag.label}
            </AppText>
          </View>
        ))}
      </View>
    )}
  </TouchableOpacity>
);

const NotesChronologicalTab = ({onVisitPress}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {visits.map((group, gi) => (
        <View key={group.year}>
          <YearSeparator label={group.year} />
          {group.items.map(visit => (
            <VisitCard
              key={visit.key}
              visit={visit}
              onPress={onVisitPress}
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
  },

  /* Year separator */
  sepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10),
    marginBottom: vs(8),
  },
  sepText: {
    marginRight: s(8),
    fontWeight: '600',
  },
  sepLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: BORDER,
  },

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    marginBottom: vs(10),
    paddingVertical: vs(10),
    paddingHorizontal: ms(13),
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  iconCircle: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: Colors.blueBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
    marginTop: vs(2),
  },
  cardContent: {
    flex: 1,
  },

  /* Tags */
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: vs(8),
    marginLeft: ms(42),
  },
  tag: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
    marginRight: s(6),
    marginBottom: vs(4),
  },
});

export default NotesChronologicalTab;
