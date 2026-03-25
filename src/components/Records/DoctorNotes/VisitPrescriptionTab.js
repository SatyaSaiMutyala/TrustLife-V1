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

/* ── status pill ── */
const StatusPill = ({label, bg, color}) => (
  <View style={[styles.pill, {backgroundColor: bg}]}>
    <AppText variant="small" color={color}>
      {label}
    </AppText>
  </View>
);

/* ── drug row ── */
const DrugRow = ({name, dose, frequency, status, statusBg, statusColor, note}) => (
  <View style={styles.drugRow}>
    <View style={styles.drugHeader}>
      <View style={styles.drugLeft}>
        <Icon family="Ionicons" name="medical-outline" size={18} color={Colors.primary} />
        <View style={{marginLeft: s(8), flex: 1}}>
          <AppText variant="bodyBold">{name}</AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            {dose}
          </AppText>
        </View>
      </View>
      <StatusPill label={status} bg={statusBg} color={statusColor} />
    </View>
    <View style={styles.drugMeta}>
      <Icon family="Ionicons" name="time-outline" size={14} color={Colors.textTertiary} />
      <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(4)}}>
        {frequency}
      </AppText>
    </View>
    {note ? (
      <View style={styles.drugNote}>
        <Icon family="Ionicons" name="information-circle-outline" size={14} color={Colors.amberText} />
        <AppText variant="small" color={Colors.amberText} style={{marginLeft: s(4), flex: 1}}>
          {note}
        </AppText>
      </View>
    ) : null}
  </View>
);

/* ── change row ── */
const ChangeRow = ({icon, text, color}) => (
  <View style={styles.changeRow}>
    <Icon family="Ionicons" name={icon} size={18} color={color} />
    <AppText variant="body" color={Colors.textPrimary} style={{marginLeft: s(8), flex: 1}}>
      {text}
    </AppText>
  </View>
);

/* ── data ── */
const DRUGS = [
  {
    name: 'Metformin 500mg',
    dose: '500mg',
    frequency: '1-0-1 (BD with meals)',
    status: 'Continued',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
    note: 'PM dose adherence only 71% -- set alarm',
  },
  {
    name: 'Amlodipine 5mg',
    dose: '5mg',
    frequency: '1-0-0 (OD morning)',
    status: 'Continued',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
    note: 'BP at target 130/82',
  },
  {
    name: 'Atorvastatin 20mg',
    dose: '20mg',
    frequency: '0-0-1 (OD night)',
    status: 'Continued',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
    note: 'LDL 118 -- excellent response, 97% adherence',
  },
  {
    name: 'Methylcobalamin 1500mcg',
    dose: '1500mcg',
    frequency: '1-0-0 (OD morning)',
    status: 'New',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
    note: 'Started for suspected B12 depletion from long-term Metformin',
  },
];

const CHANGES = [
  {
    icon: 'add-circle-outline',
    text: 'Added: Methylcobalamin 1500mcg OD',
    color: Colors.tealText,
  },
  {
    icon: 'checkmark-circle-outline',
    text: 'Continued: Metformin, Amlodipine, Atorvastatin -- no dose changes',
    color: Colors.tealText,
  },
  {
    icon: 'alert-circle-outline',
    text: 'Note: PM Metformin alarm recommended',
    color: Colors.amberText,
  },
];

/* ── component ── */
const VisitPrescriptionTab = () => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}>
    {/* ── Current prescription ── */}
    <View style={styles.card}>
      <View style={styles.cardTitleRow}>
        <Icon family="Ionicons" name="document-text-outline" size={18} color={Colors.primary} />
        <AppText variant="bodyBold" style={{marginLeft: s(6)}}>
          Current Prescription
        </AppText>
      </View>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(8)}}>
        Dr. Kavitha Reddy -- 15 Mar 2026 -- KIMS Hospital
      </AppText>
      {DRUGS.map((d, i) => (
        <React.Fragment key={d.name}>
          {i > 0 && <View style={styles.separator} />}
          <DrugRow {...d} />
        </React.Fragment>
      ))}
    </View>

    {/* ── Changes this visit ── */}
    <View style={styles.card}>
      <View style={styles.cardTitleRow}>
        <Icon family="Ionicons" name="swap-vertical-outline" size={18} color={Colors.primary} />
        <AppText variant="bodyBold" style={{marginLeft: s(6)}}>
          Changes This Visit
        </AppText>
      </View>
      {CHANGES.map((c, i) => (
        <ChangeRow key={i} {...c} />
      ))}
    </View>

    {/* ── Prescription validity ── */}
    <View style={[styles.card, {backgroundColor: Colors.blueBg}]}>
      <View style={styles.cardTitleRow}>
        <Icon family="Ionicons" name="calendar-outline" size={18} color={Colors.blueText} />
        <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6)}}>
          Prescription Validity
        </AppText>
      </View>
      <AppText variant="body" color={Colors.blueText}>
        Valid for 90 days  --  Expires 13 Jun 2026  --  Next review 15 Apr 2026
      </AppText>
    </View>

    {/* ── Drug interaction check ── */}
    <View style={[styles.card, {borderColor: Colors.teal}]}>
      <View style={styles.cardTitleRow}>
        <Icon family="Ionicons" name="shield-checkmark-outline" size={18} color={Colors.tealText} />
        <AppText variant="bodyBold" color={Colors.tealText} style={{marginLeft: s(6)}}>
          Drug Interaction Check
        </AppText>
      </View>
      <AppText variant="body" color={Colors.textPrimary}>
        No significant interactions between current medications. Metformin + B12 depletion is a
        known long-term effect -- supplementation addresses this.
      </AppText>
    </View>
  </ScrollView>
);

/* ── styles ── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: s(4),
    paddingBottom: vs(32),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    padding: s(14),
    marginBottom: vs(14),
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  separator: {
    height: 0.5,
    backgroundColor: Colors.borderLight,
    marginVertical: vs(10),
  },
  /* drug row */
  drugRow: {
    marginBottom: vs(2),
  },
  drugHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  drugLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: s(8),
  },
  drugMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(4),
    marginLeft: s(26),
  },
  drugNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: vs(4),
    marginLeft: s(26),
    backgroundColor: Colors.amberBg,
    borderRadius: ms(8),
    padding: s(6),
  },
  /* pill */
  pill: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
  /* change row */
  changeRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(8),
  },
});

export default VisitPrescriptionTab;
