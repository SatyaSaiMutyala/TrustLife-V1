import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity, Alert} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

const visitData = [
  {
    year: '2026',
    cards: [
      {
        specialty: 'Endocrinology',
        specialtyIcon: 'medical-outline',
        specialtyBg: Colors.tealBg,
        specialtyColor: Colors.tealText,
        doctor: 'Dr. Kavitha Reddy',
        hospital: 'KIMS Hospital',
        date: '15 Mar 2026',
        duration: '22 min',
        outcomeBg: Colors.amberBg,
        outcome:
          'HbA1c 7.8% \u2014 above target. Eye exam referral issued. B12 supplement added. Sleep identified as primary driver.',
        chips: [
          {label: 'HbA1c \u2191', bg: Colors.redBg, color: Colors.redText},
          {label: 'LDL \u2193', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'Eye referral', bg: Colors.amberBg, color: Colors.amberText},
          {label: 'B12 new', bg: Colors.purpleBg, color: Colors.purpleText},
        ],
      },
      {
        specialty: 'Cardiology',
        specialtyIcon: 'heart-outline',
        specialtyBg: Colors.blueBg,
        specialtyColor: Colors.blueText,
        doctor: 'Dr. Suresh Rao',
        hospital: 'Yashoda Hospitals',
        date: '14 Jan 2026',
        duration: '18 min',
        outcomeBg: Colors.tealBg,
        outcome:
          'ECG normal. Continue Amlodipine. Annual review satisfactory. BP trending down.',
        chips: [
          {label: 'ECG normal', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'BP 138/88', bg: Colors.amberBg, color: Colors.amberText},
        ],
      },
    ],
  },
  {
    year: '2025',
    cards: [
      {
        specialty: 'Endocrinology',
        specialtyIcon: 'medical-outline',
        specialtyBg: Colors.tealBg,
        specialtyColor: Colors.tealText,
        doctor: 'Dr. Kavitha Reddy',
        hospital: 'KIMS Hospital',
        date: '10 Sep 2025',
        duration: '20 min',
        outcomeBg: Colors.amberBg,
        outcome:
          'HbA1c 7.5% \u2014 borderline. Adherence intervention. Sleep discussed. No medication change.',
        chips: [
          {label: 'HbA1c 7.5%', bg: Colors.amberBg, color: Colors.amberText},
          {label: 'LDL improving', bg: Colors.tealBg, color: Colors.tealText},
        ],
      },
    ],
  },
];

const VisitSummaryTab = () => (
  <ScrollView showsVerticalScrollIndicator={false}>
    {visitData.map((section, si) => (
      <View key={si}>
        {/* Year separator */}
        <View style={styles.yearRow}>
          <AppText variant="small" color={Colors.textTertiary} style={styles.yearLabel}>
            {section.year}
          </AppText>
          <View style={styles.yearLine} />
        </View>

        {/* Cards */}
        {section.cards.map((card, ci) => (
          <TouchableOpacity
            key={ci}
            style={styles.card}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Visit Detail', 'Coming soon')}>
            {/* Top section */}
            <View style={styles.cardTop}>
              <View style={styles.cardContent}>
                {/* Specialty badge */}
                <View style={[styles.specialtyBadge, {backgroundColor: card.specialtyBg}]}>
                  <Icon
                    family="Ionicons"
                    name={card.specialtyIcon}
                    size={ms(13)}
                    color={card.specialtyColor}
                  />
                  <AppText variant="small" color={card.specialtyColor}>
                    {card.specialty}
                  </AppText>
                </View>

                {/* Doctor name */}
                <AppText variant="bodyBold" style={styles.doctorName}>
                  {card.doctor}
                </AppText>

                {/* Hospital line */}
                <AppText variant="caption" color={Colors.textSecondary}>
                  {card.hospital} \u00B7 {card.date} \u00B7 {card.duration}
                </AppText>

                {/* Outcome box */}
                <View style={[styles.outcomeBox, {backgroundColor: card.outcomeBg}]}>
                  <AppText variant="small" color={Colors.textPrimary}>
                    {card.outcome}
                  </AppText>
                </View>

                {/* Chips row */}
                <View style={styles.chipsRow}>
                  {card.chips.map((chip, ki) => (
                    <View
                      key={ki}
                      style={[styles.chip, {backgroundColor: chip.bg}]}>
                      <AppText variant="small" color={chip.color}>
                        {chip.label}
                      </AppText>
                    </View>
                  ))}
                </View>
              </View>

              {/* Arrow */}
              <View style={styles.arrowContainer}>
                <Icon
                  family="Ionicons"
                  name="chevron-forward"
                  size={ms(18)}
                  color={Colors.textTertiary}
                />
              </View>
            </View>
          </TouchableOpacity>
        ))}
      </View>
    ))}
  </ScrollView>
);

const styles = StyleSheet.create({
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(14),
    marginBottom: vs(10),
  },
  yearLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: s(8),
  },
  yearLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: Colors.borderLight,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    marginBottom: vs(9),
    overflow: 'hidden',
  },
  cardTop: {
    padding: ms(13),
    flexDirection: 'row',
  },
  cardContent: {
    flex: 1,
  },
  arrowContainer: {
    justifyContent: 'center',
    paddingLeft: s(8),
  },
  specialtyBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    gap: s(4),
    paddingHorizontal: ms(8),
    paddingVertical: vs(3),
    borderRadius: ms(10),
    marginBottom: vs(6),
  },
  doctorName: {
    marginBottom: vs(2),
  },
  outcomeBox: {
    marginTop: vs(8),
    borderRadius: ms(9),
    padding: ms(9),
  },
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(5),
    marginTop: vs(7),
  },
  chip: {
    paddingHorizontal: ms(7),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
});

export default VisitSummaryTab;
