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

/* --- data --- */
const SYSTEMS = [
  {
    icon: 'heart-outline',
    system: 'Cardiovascular',
    finding: 'S1S2 normal, no murmurs',
    status: 'Normal',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    icon: 'cloud-outline',
    system: 'Respiratory',
    finding: 'Clear bilateral air entry, no wheeze',
    status: 'Normal',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    icon: 'body-outline',
    system: 'Abdomen',
    finding: 'Soft, non-tender, no organomegaly',
    status: 'Normal',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    icon: 'flash-outline',
    system: 'Neurological',
    finding: 'Peripheral sensation intact, reflexes normal',
    status: 'Normal',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    icon: 'footsteps-outline',
    system: 'Feet',
    finding: 'No ulcers, pedal pulses present, monofilament normal',
    status: 'Normal',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    icon: 'eye-outline',
    system: 'Eyes',
    finding: 'Fundoscopy not done -- referral to ophthalmology',
    status: 'Pending',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
];

const OBSERVATIONS = [
  {
    label: 'Injection sites',
    value: 'No lipohypertrophy (not on insulin)',
    bg: Colors.tealBg,
    color: Colors.tealText,
  },
  {
    label: 'Thyroid',
    value: 'Not enlarged, no nodules',
    bg: Colors.tealBg,
    color: Colors.tealText,
  },
  {
    label: 'Skin',
    value: 'No acanthosis nigricans, no skin tags',
    bg: Colors.tealBg,
    color: Colors.tealText,
  },
];

const EXAMS_DUE = [
  {
    exam: 'Dilated eye exam',
    detail: 'Overdue >2 years, Referred to LV Prasad',
    statusBg: Colors.redBg,
    statusColor: Colors.redText,
    statusLabel: 'Overdue',
  },
  {
    exam: 'Dental check',
    detail: 'Last done 2024, Due 2025',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
    statusLabel: 'Due',
  },
  {
    exam: 'Foot monofilament',
    detail: 'Done this visit',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
    statusLabel: 'Done',
  },
];

/* --- component --- */
const VisitFindingsTab = () => {
  const renderSystemsExamined = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        Systems examined
      </AppText>
      {SYSTEMS.map((item, i) => (
        <View
          key={i}
          style={[
            styles.systemRow,
            i < SYSTEMS.length - 1 && {
              borderBottomWidth: 0.5,
              borderBottomColor: borderTertiary,
            },
          ]}>
          <View style={[styles.systemIcon, {backgroundColor: item.statusBg}]}>
            <Icon family="Ionicons" name={item.icon} size={18} color={item.statusColor} />
          </View>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="bodyBold">{item.system}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              {item.finding}
            </AppText>
          </View>
          <View style={[styles.statusPill, {backgroundColor: item.statusBg}]}>
            <AppText variant="small" color={item.statusColor}>
              {item.status}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  const renderKeyObservations = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        Key clinical observations
      </AppText>
      {OBSERVATIONS.map((obs, i) => (
        <View
          key={i}
          style={[
            styles.observationRow,
            i < OBSERVATIONS.length - 1 && {
              borderBottomWidth: 0.5,
              borderBottomColor: borderTertiary,
            },
          ]}>
          <View style={[styles.obsDot, {backgroundColor: obs.color}]} />
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="bodyBold">{obs.label}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              {obs.value}
            </AppText>
          </View>
          <View style={[styles.statusPill, {backgroundColor: obs.bg}]}>
            <AppText variant="small" color={obs.color}>Normal</AppText>
          </View>
        </View>
      ))}
    </View>
  );

  const renderRedFlags = () => (
    <View style={[styles.redFlagBanner, {backgroundColor: Colors.tealBg}]}>
      <View style={styles.redFlagHeader}>
        <Icon family="Ionicons" name="shield-checkmark-outline" size={20} color={Colors.tealText} />
        <AppText variant="bodyBold" color={Colors.tealText} style={{marginLeft: s(8)}}>
          Red flags checked
        </AppText>
      </View>
      <AppText variant="caption" color={Colors.tealText} style={{marginTop: vs(6)}}>
        No chest pain, no breathlessness at rest, no visual changes, no numbness/tingling in
        extremities, no foot ulcers
      </AppText>
    </View>
  );

  const renderExamsDue = () => (
    <View style={[styles.card, {borderColor: Colors.amberBg, borderWidth: 1}]}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        Examinations due
      </AppText>
      {EXAMS_DUE.map((exam, i) => (
        <View
          key={i}
          style={[
            styles.examRow,
            i < EXAMS_DUE.length - 1 && {
              borderBottomWidth: 0.5,
              borderBottomColor: borderTertiary,
            },
          ]}>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold">{exam.exam}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              {exam.detail}
            </AppText>
          </View>
          <View style={[styles.statusPill, {backgroundColor: exam.statusBg}]}>
            <AppText variant="small" color={exam.statusColor}>
              {exam.statusLabel}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {renderSystemsExamined()}
      {renderKeyObservations()}
      {renderRedFlags()}
      {renderExamsDue()}
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
    padding: ms(14),
  },
  systemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  systemIcon: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(8),
  },
  observationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  obsDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  redFlagBanner: {
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    padding: ms(14),
  },
  redFlagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  examRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
});

export default VisitFindingsTab;
