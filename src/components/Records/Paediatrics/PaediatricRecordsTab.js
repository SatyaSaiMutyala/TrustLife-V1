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
    milestones: 'On track', milestoneBg: Colors.tealBg, milestoneColor: Colors.tealText,
    allergens: '3 of 8', teeth: '20 erupted', activeMeds: 0,
    height: '132.4 cm', weight: '28.6 kg', bmi: '16.3',
    events: [
      {time: '08:30', color: Colors.primary, text: 'School day - PE class (45 min football)'},
      {time: '10:00', color: '#D97316', text: 'Snack - Apple + peanut butter (allergen exposure)'},
      {time: '14:00', color: '#378ADD', text: 'Dental check - No cavities, brushing good'},
      {time: '16:30', color: Colors.accent, text: 'Homework - Sustained attention 25 min (milestone passed)'},
    ],
  },
  {
    date: 'Yesterday - 4 Apr 2026', age: '9y 2m',
    milestones: 'On track', milestoneBg: Colors.tealBg, milestoneColor: Colors.tealText,
    allergens: '3 of 8', teeth: '20 erupted', activeMeds: 0,
    height: '132.4 cm', weight: '28.6 kg', bmi: '16.3',
    events: [
      {time: '07:45', color: '#E24B4A', text: 'Symptom - Mild cough noted, no fever'},
      {time: '09:00', color: Colors.primary, text: 'School day - Art class + reading'},
      {time: '12:30', color: '#D97316', text: 'Lunch - School meal logged'},
      {time: '17:00', color: Colors.accent, text: 'Play - Outdoor cycling 30 min'},
    ],
  },
  {
    date: '3 Apr 2026 - Thursday', age: '9y 2m',
    milestones: 'On track', milestoneBg: Colors.tealBg, milestoneColor: Colors.tealText,
    allergens: '3 of 8', teeth: '20 erupted', activeMeds: 0,
    height: '132.3 cm', weight: '28.5 kg', bmi: '16.3',
    events: [
      {time: '08:00', color: Colors.primary, text: 'School day - Maths test (complex problem solving)'},
      {time: '13:00', color: '#D97316', text: 'New food trial - Cashew nut (allergen #4) - No reaction'},
      {time: '15:30', color: Colors.accent, text: 'Swimming class - 40 min'},
      {time: '18:00', color: '#378ADD', text: 'Reading - 30 min sustained (milestone check)'},
    ],
  },
  {
    date: '2 Apr 2026 - Wednesday', age: '9y 2m',
    milestones: 'On track', milestoneBg: Colors.tealBg, milestoneColor: Colors.tealText,
    allergens: '2 of 8', teeth: '20 erupted', activeMeds: 0,
    height: '132.3 cm', weight: '28.5 kg', bmi: '16.2',
    events: [
      {time: '09:00', color: Colors.primary, text: 'School day - Science project (peer collaboration)'},
      {time: '14:00', color: '#E24B4A', text: 'Mild stomach ache after lunch - resolved in 30 min'},
      {time: '16:00', color: Colors.accent, text: 'Karate class - 45 min'},
    ],
  },
  {
    date: '1 Apr 2026 - Tuesday', age: '9y 2m',
    milestones: 'On track', milestoneBg: Colors.tealBg, milestoneColor: Colors.tealText,
    allergens: '2 of 8', teeth: '20 erupted', activeMeds: 0,
    height: '132.2 cm', weight: '28.4 kg', bmi: '16.2',
    events: [
      {time: '08:30', color: Colors.primary, text: 'School day - English + Hindi classes'},
      {time: '12:00', color: '#D97316', text: 'Lunch - Home packed (dal rice + salad)'},
      {time: '17:00', color: Colors.accent, text: 'Playground - Cricket 45 min with friends'},
      {time: '19:30', color: '#378ADD', text: 'Brushing + flossing logged'},
    ],
  },
  {
    date: '31 Mar 2026 - Monday', age: '9y 2m',
    milestones: 'Review', milestoneBg: Colors.amberBg, milestoneColor: Colors.amberDark,
    allergens: '2 of 8', teeth: '19 erupted', activeMeds: 1,
    height: '132.2 cm', weight: '28.4 kg', bmi: '16.2',
    events: [
      {time: '08:00', color: '#E24B4A', text: 'Symptom - Fever 99.2F - Paracetamol given'},
      {time: '09:00', color: '#534AB7', text: 'Medicine - Paracetamol 250mg (mg/kg dose OK)'},
      {time: '11:00', color: '#E24B4A', text: 'Fever rechecked - 98.6F - resolved'},
      {time: '14:00', color: Colors.primary, text: 'Rest day - No school attended'},
      {time: '16:00', color: Colors.accent, text: 'Light play at home - board games'},
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
  return (
    <TouchableOpacity style={st.card} activeOpacity={0.7} onPress={onPress}>
      <View style={[st.leftBar, {backgroundColor: record.milestoneColor}]} />
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
            <View style={[st.statusPill, {backgroundColor: record.milestoneBg}]}>
              <AppText variant="small" color={record.milestoneColor} style={{fontWeight: '600'}}>{record.milestones}</AppText>
            </View>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color={Colors.textPrimary} />
        </View>

        <View style={st.chipRow}>
          <View style={st.chip}>
            <Icon family="Ionicons" name="bulb-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>Milestones: {record.milestones}</AppText>
          </View>
          <View style={st.chip}>
            <Icon family="Ionicons" name="nutrition-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>Allergens: {record.allergens}</AppText>
          </View>
          <View style={st.chip}>
            <Icon family="Ionicons" name="happy-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>{record.teeth}</AppText>
          </View>
          {record.activeMeds > 0 && (
            <View style={[st.chip, {backgroundColor: Colors.amberBg}]}>
              <Icon family="Ionicons" name="medkit-outline" size={ms(10)} color={Colors.amberDark} />
              <AppText variant="small" color={Colors.amberDark}>{record.activeMeds} med</AppText>
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
          <AppText variant="subtext" color="rgba(255,255,255,0.7)">Development - Allergens - Growth trends</AppText>
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
