import React, {useState} from 'react';
import {View, ScrollView, TouchableOpacity, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight;

const doctors = [
  {
    id: 'kavitha',
    name: 'Dr. Kavitha Reddy',
    specialty: 'Endocrinology',
    hospital: 'KIMS Hospital',
    visitCount: 7,
    headerBg: Colors.tealBg,
    headerColor: Colors.tealText,
    visits: [
      {
        key: 'mar2026',
        date: '15 Mar 2026',
        purpose: '6-month review \u00B7 T2DM + HTN + Dyslipidaemia',
        tag: {label: 'HbA1c \u2192 7.8%', bg: Colors.redBg, color: Colors.redText},
      },
      {
        key: 'jan2026',
        date: '10 Jan 2026',
        purpose: 'Quarterly follow-up \u00B7 Medication review',
        tag: {label: 'HbA1c \u2192 7.2%', bg: Colors.amberBg, color: Colors.amberText},
      },
      {
        key: 'sep2025',
        date: '20 Sep 2025',
        purpose: 'Annual comprehensive review',
        tag: {label: 'Kidney check normal', bg: Colors.tealBg, color: Colors.tealText},
      },
      {
        key: 'mar2025',
        date: '18 Mar 2025',
        purpose: '6-month review \u00B7 Dose adjustment',
        tag: {label: 'HbA1c \u2192 7.0%', bg: Colors.tealBg, color: Colors.tealText},
      },
      {
        key: 'jun2022',
        date: '22 Jun 2022',
        purpose: 'Annual review \u00B7 Atorvastatin started',
        tag: {label: 'LDL 156 \u2192 Statin started', bg: Colors.redBg, color: Colors.redText},
      },
      {
        key: 'mar2021',
        date: '10 Mar 2021',
        purpose: 'Annual review \u00B7 Stable control',
        tag: {label: 'HbA1c \u2192 6.8%', bg: Colors.tealBg, color: Colors.tealText},
      },
      {
        key: 'sep2019',
        date: '12 Sep 2019',
        purpose: 'Initial diagnosis \u00B7 T2DM + HTN',
        tag: {label: 'Diagnosis: T2DM', bg: Colors.redBg, color: Colors.redText},
      },
    ],
  },
  {
    id: 'suresh',
    name: 'Dr. Suresh Rao',
    specialty: 'Cardiology',
    hospital: 'Yashoda Hospitals',
    visitCount: 1,
    headerBg: Colors.blueBg,
    headerColor: Colors.blueText,
    visits: [
      {
        key: 'aug2025',
        date: '14 Aug 2025',
        purpose: 'Cardiac evaluation \u00B7 Chest pain workup',
        tag: {label: 'Echo normal', bg: Colors.tealBg, color: Colors.tealText},
      },
    ],
  },
  {
    id: 'anand',
    name: 'Dr. Anand Murthy',
    specialty: 'Ophthalmology',
    hospital: 'LV Prasad Eye Institute',
    visitCount: 1,
    headerBg: Colors.amberBg,
    headerColor: Colors.amberText,
    visits: [
      {
        key: 'apr2026',
        date: 'Apr 2026',
        purpose: 'Diabetic eye screening',
        tag: {label: 'Scheduled', bg: Colors.amberBg, color: Colors.amberText},
      },
    ],
  },
  {
    id: 'meera',
    name: 'Dr. Meera Nair',
    specialty: 'General Physician',
    hospital: 'Apollo Clinic',
    visitCount: 1,
    headerBg: Colors.purpleBg,
    headerColor: Colors.purpleText,
    visits: [
      {
        key: 'nov2024',
        date: 'Nov 2024',
        purpose: 'Fever + viral illness',
        tag: {label: 'Resolved', bg: Colors.tealBg, color: Colors.tealText},
      },
    ],
  },
];

/* ─── Doctor section ─── */
const DoctorSection = ({doc, onVisitPress}) => {
  const [expanded, setExpanded] = useState(true);

  return (
    <View style={styles.card}>
      {/* Doctor header */}
      <TouchableOpacity
        activeOpacity={0.7}
        style={[styles.doctorHeader, {backgroundColor: doc.headerBg}]}
        onPress={() => setExpanded(prev => !prev)}>
        <View style={styles.doctorHeaderLeft}>
          <View style={[styles.iconCircle, {backgroundColor: Colors.white}]}>
            <Icon family="Ionicons" name="person-outline" size={16} color={doc.headerColor} />
          </View>
          <View style={styles.doctorInfo}>
            <AppText variant="bodyBold" color={doc.headerColor}>
              {doc.name}
            </AppText>
            <AppText variant="caption" color={doc.headerColor} style={{marginTop: vs(2), opacity: 0.8}}>
              {doc.specialty} {'\u00B7'} {doc.hospital}
            </AppText>
            <AppText variant="small" color={doc.headerColor} style={{marginTop: vs(2), opacity: 0.7}}>
              {doc.visitCount} {doc.visitCount === 1 ? 'visit' : 'visits'}
            </AppText>
          </View>
        </View>
        <Icon
          family="Ionicons"
          name={expanded ? 'chevron-up' : 'chevron-down'}
          size={16}
          color={doc.headerColor}
        />
      </TouchableOpacity>

      {/* Visit rows */}
      {expanded &&
        doc.visits.map((visit, vi) => (
          <TouchableOpacity
            key={visit.key}
            activeOpacity={0.7}
            style={[
              styles.visitRow,
              vi < doc.visits.length - 1 && styles.visitRowBorder,
            ]}
            onPress={() => onVisitPress(visit.key)}>
            <View style={styles.visitContent}>
              <View style={styles.visitTop}>
                <AppText variant="caption" color={Colors.textTertiary} style={styles.visitDate}>
                  {visit.date}
                </AppText>
                <View style={[styles.tag, {backgroundColor: visit.tag.bg}]}>
                  <AppText variant="small" color={visit.tag.color}>
                    {visit.tag.label}
                  </AppText>
                </View>
              </View>
              <AppText variant="body" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                {visit.purpose}
              </AppText>
            </View>
            <Icon
              family="Ionicons"
              name="chevron-forward"
              size={14}
              color={Colors.textTertiary}
            />
          </TouchableOpacity>
        ))}
    </View>
  );
};

const NotesByDoctorTab = ({onVisitPress}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {doctors.map(doc => (
        <DoctorSection key={doc.id} doc={doc} onVisitPress={onVisitPress} />
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

  /* Doctor header */
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(13),
    paddingVertical: vs(10),
  },
  doctorHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconCircle: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  doctorInfo: {
    flex: 1,
  },

  /* Visit rows */
  visitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    paddingHorizontal: ms(13),
  },
  visitRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  visitContent: {
    flex: 1,
  },
  visitTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  visitDate: {
    flex: 1,
  },

  /* Tag */
  tag: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
    marginLeft: s(6),
  },
});

export default NotesByDoctorTab;
