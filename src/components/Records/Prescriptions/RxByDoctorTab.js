import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const PINK_TEXT = '#8B2252';

const doctors = [
  {
    name: 'Dr. Kavitha Reddy',
    specialty: 'Endocrinologist',
    hospital: 'KIMS Hospital',
    summary: '5 prescriptions',
    extra: 'All active drugs',
    headerBg: Colors.tealBg,
    headerColor: Colors.tealText,
    drugs: [
      {
        name: 'Metformin',
        dose: '500mg BD',
        detail: 'Sep 2019 \u00B7 6.5 years \u00B7 16 renewals',
        iconBg: Colors.purpleBg,
        iconColor: Colors.purpleText,
        icon: 'medical-outline',
        status: 'Active',
        statusBg: Colors.tealBg,
        statusColor: Colors.tealText,
      },
      {
        name: 'Amlodipine',
        dose: '5mg OD',
        detail: 'Mar 2021 \u00B7 5 years',
        iconBg: Colors.tealBg,
        iconColor: Colors.tealText,
        icon: 'medical-outline',
        status: 'Active',
        statusBg: Colors.tealBg,
        statusColor: Colors.tealText,
      },
      {
        name: 'Atorvastatin',
        dose: '10mg OD',
        detail: 'Jun 2022 \u00B7 4 years',
        iconBg: Colors.blueBg,
        iconColor: Colors.blueText,
        icon: 'medical-outline',
        status: 'Active',
        statusBg: Colors.tealBg,
        statusColor: Colors.tealText,
      },
      {
        name: 'Methylcobalamin',
        dose: '500mcg OD',
        detail: '15 Mar 2026 \u00B7 9 days \u00B7 New',
        iconBg: '#EAF3DE',
        iconColor: '#4A7C23',
        icon: 'leaf-outline',
        status: 'Active \u00B7 New',
        statusBg: Colors.tealBg,
        statusColor: Colors.tealText,
      },
    ],
  },
  {
    name: 'Dr. Suresh Rao',
    specialty: 'Cardiologist',
    hospital: 'Yashoda Hospitals',
    summary: '1 prescription',
    extra: null,
    headerBg: Colors.blueBg,
    headerColor: Colors.blueText,
    drugs: [
      {
        name: 'Aspirin 75mg OD (PRN)',
        dose: null,
        detail: 'Low-dose per Dr. Suresh Jan 2026 \u00B7 Not started \u2013 Dr. Kavitha review pending',
        iconBg: Colors.blueBg,
        iconColor: Colors.blueText,
        icon: 'medical-outline',
        status: 'Deferred',
        statusBg: Colors.background,
        statusColor: Colors.textSecondary,
      },
    ],
  },
  {
    name: 'Dr. Sarita Menon',
    specialty: 'General Physician',
    hospital: 'Kamineni Hospital',
    summary: '1 past prescription',
    extra: null,
    headerBg: Colors.pinkBg,
    headerColor: PINK_TEXT,
    drugs: [
      {
        name: 'Azithromycin 500mg OD \u00D75 days',
        dose: null,
        detail: 'Sep 2024 \u00B7 URTI \u00B7 Completed course',
        iconBg: Colors.pinkBg,
        iconColor: PINK_TEXT,
        icon: 'medical-outline',
        status: 'Completed',
        statusBg: Colors.background,
        statusColor: Colors.textSecondary,
      },
    ],
  },
];

const RxByDoctorTab = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {doctors.map((doc, di) => (
        <View key={di} style={styles.card}>
          {/* Doctor header */}
          <View style={[styles.doctorHeader, {backgroundColor: doc.headerBg}]}>
            <AppText variant="bodyBold" color={doc.headerColor}>
              {doc.name} {'\u00B7'} {doc.specialty}
            </AppText>
            <AppText variant="caption" color={doc.headerColor} style={{marginTop: vs(2), opacity: 0.8}}>
              {doc.hospital} {'\u00B7'} {doc.summary}
              {doc.extra ? ` \u00B7 ${doc.extra}` : ''}
            </AppText>
          </View>

          {/* Drug rows */}
          {doc.drugs.map((drug, ri) => (
            <View
              key={ri}
              style={[
                styles.drugRow,
                ri < doc.drugs.length - 1 && styles.drugRowBorder,
              ]}>
              <View style={[styles.drugIcon, {backgroundColor: drug.iconBg}]}>
                <Icon family="Ionicons" name={drug.icon} size={16} color={drug.iconColor} />
              </View>

              <View style={styles.drugContent}>
                <View style={styles.drugHeader}>
                  <View style={{flex: 1}}>
                    <AppText variant="bodyBold">
                      {drug.name}
                      {drug.dose ? ` \u00B7 ${drug.dose}` : ''}
                    </AppText>
                  </View>
                  <View style={[styles.pill, {backgroundColor: drug.statusBg}]}>
                    <AppText variant="small" color={drug.statusColor}>
                      {drug.status}
                    </AppText>
                  </View>
                </View>

                <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                  {drug.detail}
                </AppText>
              </View>
            </View>
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    marginBottom: vs(10),
    overflow: 'hidden',
  },
  doctorHeader: {
    paddingHorizontal: ms(13),
    paddingVertical: vs(10),
  },
  drugRow: {
    flexDirection: 'row',
    paddingVertical: vs(10),
    paddingHorizontal: ms(13),
    alignItems: 'flex-start',
  },
  drugRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  drugIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
    marginTop: vs(2),
  },
  drugContent: {
    flex: 1,
  },
  drugHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
});

export default RxByDoctorTab;
