import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const PAED_RECORDS = [
  {
    date: 'Today - 5 Apr 2026', age: '9y 2m',
    height: '132.4 cm', weight: '28.6 kg', bmi: '16.3',
    brushSessions: '2/2', brushDuration: '4 min', brushQuality: 'Thorough', toothpaste: 'Pea-size', helper: 'Supervised', flossed: true,
    teethBreakdown: '20 erupted / 0 erupting / 4 pending',
    symptoms: [],
    feverReading: null,
    dosesTaken: '0/0', activeMeds: 0, activeCourse: null,
    lastDose: null,
    events: [
      {time: '08:00', color: '#378ADD', text: 'Brushing - Morning - 2 min - pea-size paste - thorough - supervised'},
      {time: '08:05', color: '#378ADD', text: 'Flossed - yes'},
      {time: '20:00', color: '#378ADD', text: 'Brushing - Evening - 2 min - pea-size paste - thorough'},
    ],
  },
  {
    date: 'Yesterday - 4 Apr 2026', age: '9y 2m',
    height: '132.4 cm', weight: '28.6 kg', bmi: '16.3',
    brushSessions: '1/2', brushDuration: '2 min', brushQuality: 'Good', toothpaste: 'Pea-size', helper: 'Self', flossed: false,
    teethBreakdown: '20 erupted / 0 erupting / 4 pending',
    symptoms: ['Cough'],
    feverReading: null,
    dosesTaken: '0/0', activeMeds: 0, activeCourse: null,
    lastDose: null,
    events: [
      {time: '07:45', color: '#E24B4A', text: 'Symptom logged - Mild cough noted, no fever'},
      {time: '08:00', color: '#378ADD', text: 'Brushing - Morning - 2 min - pea-size paste - good - self'},
      {time: '21:00', color: '#D97316', text: 'Brushing - Evening MISSED'},
    ],
  },
  {
    date: '3 Apr 2026 - Thursday', age: '9y 2m',
    height: '132.3 cm', weight: '28.5 kg', bmi: '16.3',
    brushSessions: '2/2', brushDuration: '3 min', brushQuality: 'Good', toothpaste: 'Pea-size', helper: 'Self', flossed: true,
    teethBreakdown: '20 erupted / 0 erupting / 4 pending',
    symptoms: [],
    feverReading: null,
    dosesTaken: '0/0', activeMeds: 0, activeCourse: null,
    lastDose: null,
    events: [
      {time: '08:00', color: '#378ADD', text: 'Brushing - Morning - 3 min - pea-size paste - good'},
      {time: '19:30', color: '#378ADD', text: 'Brushing - Evening - 3 min - good - flossed'},
    ],
  },
  {
    date: '2 Apr 2026 - Wednesday', age: '9y 2m',
    height: '132.3 cm', weight: '28.5 kg', bmi: '16.2',
    brushSessions: '2/2', brushDuration: '3 min', brushQuality: 'Good', toothpaste: 'Pea-size', helper: 'Self', flossed: false,
    teethBreakdown: '20 erupted / 0 erupting / 4 pending',
    symptoms: ['Stomach pain'],
    feverReading: null,
    dosesTaken: '0/0', activeMeds: 0, activeCourse: null,
    lastDose: null,
    events: [
      {time: '08:00', color: '#378ADD', text: 'Brushing - Morning - 3 min - good'},
      {time: '14:00', color: '#E24B4A', text: 'Symptom logged - Mild stomach ache after lunch'},
      {time: '19:30', color: '#378ADD', text: 'Brushing - Evening - 3 min - good'},
    ],
  },
  {
    date: '1 Apr 2026 - Tuesday', age: '9y 2m',
    height: '132.2 cm', weight: '28.4 kg', bmi: '16.2',
    brushSessions: '2/2', brushDuration: '2 min', brushQuality: 'Quick', toothpaste: 'Pea-size', helper: 'Self', flossed: true,
    teethBreakdown: '20 erupted / 0 erupting / 4 pending',
    symptoms: [],
    feverReading: null,
    dosesTaken: '0/0', activeMeds: 0, activeCourse: null,
    lastDose: null,
    events: [
      {time: '08:00', color: '#378ADD', text: 'Brushing - Morning - 2 min - quick'},
      {time: '19:30', color: '#378ADD', text: 'Brushing - Evening - 2 min - quick - flossed'},
    ],
  },
  {
    date: '31 Mar 2026 - Monday', age: '9y 2m',
    height: '132.2 cm', weight: '28.4 kg', bmi: '16.2',
    brushSessions: '2/2', brushDuration: '2 min', brushQuality: 'Good', toothpaste: 'Pea-size', helper: 'Parent', flossed: false,
    teethBreakdown: '20 erupted / 0 erupting / 4 pending',
    symptoms: ['Fever'],
    feverReading: '37.5°C (Low-grade)',
    dosesTaken: '1/5', activeMeds: 1, activeCourse: 'Paracetamol · PRN',
    lastDose: 'Paracetamol 411 mg (15 mg/kg x 27.4 kg) = 8ml susp',
    events: [
      {time: '08:00', color: '#E24B4A', text: 'Symptom logged - Fever 37.5°C + Low-grade'},
      {time: '09:00', color: '#534AB7', text: 'Medicine - Paracetamol 411mg = 8ml (dose 1/5)'},
      {time: '11:00', color: '#E24B4A', text: 'Fever rechecked - 36.9°C - resolved'},
      {time: '19:30', color: '#378ADD', text: 'Brushing - Evening - 2 min - parent'},
    ],
  },
];

const DateGroup = ({label}) => (
  <View style={st.dateGroup}>
    <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5, marginRight: s(8)}}>
      {label}
    </AppText>
    <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
  </View>
);

const PaedRow = ({record, onPress}) => {
  const hasSymptoms = record.symptoms.length > 0;
  const statusColor = hasSymptoms ? Colors.amber : Colors.accent;
  const statusText = hasSymptoms ? `${record.symptoms.length} symptom${record.symptoms.length === 1 ? '' : 's'}` : 'Well';

  return (
    <TouchableOpacity style={st.card} activeOpacity={0.7} onPress={onPress}>
      <View style={[st.leftBar, {backgroundColor: statusColor}]} />
      <View style={st.cardBody}>
        <View style={st.topRow}>
          <View style={[st.iconWrap, {backgroundColor: Colors.blueBg}]}>
            <Icon family="Ionicons" name="body-outline" size={ms(16)} color={Colors.blue} />
          </View>
          <View style={{flex: 1, marginLeft: s(8)}}>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(13)}}>Aarav - {record.age}</AppText>
            <AppText variant="small" color={Colors.textTertiary}>{record.height} - {record.weight} - BMI {record.bmi}</AppText>
          </View>
          <View style={{alignItems: 'flex-end', marginRight: s(6)}}>
            <View style={[st.statusPill, {backgroundColor: statusColor + '18'}]}>
              <AppText variant="small" color={statusColor} style={{fontWeight: '600'}}>{statusText}</AppText>
            </View>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color={Colors.textPrimary} />
        </View>

        <View style={st.chipRow}>
          <View style={st.chip}>
            <Icon family="Ionicons" name="brush-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>Brushing {record.brushSessions}</AppText>
          </View>
          {record.flossed && (
            <View style={st.chip}>
              <Icon family="Ionicons" name="git-branch-outline" size={ms(10)} color={Colors.textTertiary} />
              <AppText variant="small" color={Colors.textSecondary}>Flossed</AppText>
            </View>
          )}
          <View style={st.chip}>
            <Icon family="Ionicons" name="happy-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>{record.teethBreakdown.split('/')[0].trim()}</AppText>
          </View>
          {record.activeMeds > 0 && (
            <View style={[st.chip, {backgroundColor: Colors.amberBg}]}>
              <Icon family="Ionicons" name="medkit-outline" size={ms(10)} color={Colors.amberDark} />
              <AppText variant="small" color={Colors.amberDark}>{record.dosesTaken} dose</AppText>
            </View>
          )}
          {record.feverReading && (
            <View style={[st.chip, {backgroundColor: Colors.redBg}]}>
              <Icon family="Ionicons" name="thermometer-outline" size={ms(10)} color={Colors.red} />
              <AppText variant="small" color={Colors.red}>{record.feverReading}</AppText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PaediatricRecordsTab = () => {
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8}>
        <View style={st.ayuIconWrap}><Icon family="Ionicons" name="bulb-outline" size={ms(16)} color={Colors.white} /></View>
        <View style={{flex: 1}}>
          <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Child Health</AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.7)">Dental - Symptoms - Medication adherence</AppText>
        </View>
        <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      {PAED_RECORDS.map((rec, i) => (
        <View key={i}>
          <DateGroup label={rec.date} />
          <PaedRow record={rec} onPress={() => navigation.navigate('PaediatricDetail', {record: rec})} />
        </View>
      ))}
    </View>
  );
};

const st = StyleSheet.create({
  ayuBtn: {flexDirection: 'row', alignItems: 'center', gap: s(8), backgroundColor: Colors.accent, borderRadius: ms(12), padding: ms(12), marginBottom: vs(12)},
  ayuIconWrap: {width: ms(32), height: ms(32), borderRadius: ms(9), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  dateGroup: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(10)},
  card: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#dde8e2', marginBottom: vs(7), overflow: 'hidden', flexDirection: 'row', alignItems: 'stretch'},
  leftBar: {width: ms(4)},
  cardBody: {flex: 1, padding: ms(10)},
  topRow: {flexDirection: 'row', alignItems: 'center', gap: s(4)},
  iconWrap: {width: ms(32), height: ms(32), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center'},
  statusPill: {paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(6)},
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6), marginTop: vs(8), paddingLeft: ms(40)},
  chip: {flexDirection: 'row', alignItems: 'center', gap: s(4), backgroundColor: Colors.background, paddingHorizontal: s(7), paddingVertical: vs(3), borderRadius: ms(6)},
});

export default PaediatricRecordsTab;
