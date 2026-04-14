import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const PREGNANCY_RECORDS = [
  {
    date: 'Today - 5 Apr 2026', week: 16, trimester: '2nd', day: 113,
    mood: 'Happy', kicks: 0, bp: '110/72', supplements: 'Taken', nausea: 'None', weight: '58.2 kg',
    babySize: 'Avocado', babyLength: '11.6 cm', babyWeight: '100g',
    events: [
      {time: '08:00', color: Colors.accent, text: 'Supplement - IFA + Calcium + DHA taken'},
      {time: '09:30', color: '#BE185D', text: 'Mood - Happy, good energy (2nd trimester window)'},
      {time: '11:00', color: Colors.blue, text: 'BP check - 110/72 mmHg - Normal'},
      {time: '14:00', color: '#D97316', text: 'Nausea - None today'},
      {time: '16:00', color: Colors.accent, text: 'Walk - 20 min prenatal walk'},
    ],
  },
  {
    date: 'Yesterday - 4 Apr 2026', week: 16, trimester: '2nd', day: 112,
    mood: 'Calm', kicks: 0, bp: '112/74', supplements: 'Taken', nausea: 'Mild', weight: '58.1 kg',
    babySize: 'Avocado', babyLength: '11.5 cm', babyWeight: '98g',
    events: [
      {time: '08:15', color: Colors.accent, text: 'Supplement - IFA + Calcium taken (missed DHA)'},
      {time: '10:00', color: '#D97316', text: 'Nausea - Mild morning nausea, resolved by 11 AM'},
      {time: '11:30', color: Colors.blue, text: 'BP check - 112/74 mmHg - Normal'},
      {time: '15:00', color: '#BE185D', text: 'Mood - Calm, slight fatigue after lunch'},
      {time: '17:00', color: Colors.accent, text: 'Yoga - 30 min prenatal yoga class'},
    ],
  },
  {
    date: '3 Apr 2026 - Thursday', week: 16, trimester: '2nd', day: 111,
    mood: 'Anxious', kicks: 0, bp: '114/76', supplements: 'Taken', nausea: 'None', weight: '58.1 kg',
    babySize: 'Avocado', babyLength: '11.4 cm', babyWeight: '96g',
    events: [
      {time: '08:00', color: Colors.accent, text: 'Supplement - All 3 taken on time'},
      {time: '10:30', color: '#BE185D', text: 'Mood - Anxious about upcoming anomaly scan'},
      {time: '14:00', color: Colors.blue, text: 'BP check - 114/76 mmHg - Normal'},
      {time: '16:30', color: Colors.accent, text: 'Walk - 15 min evening walk'},
    ],
  },
  {
    date: '2 Apr 2026 - Wednesday', week: 15, trimester: '2nd', day: 110,
    mood: 'Happy', kicks: 0, bp: '108/70', supplements: 'Missed', nausea: 'None', weight: '58.0 kg',
    babySize: 'Apple', babyLength: '10.1 cm', babyWeight: '70g',
    events: [
      {time: '08:30', color: '#E24B4A', text: 'Supplement - Missed morning dose (ran out of IFA)'},
      {time: '09:00', color: '#BE185D', text: 'Mood - Happy, energetic morning'},
      {time: '12:00', color: Colors.blue, text: 'BP check - 108/70 mmHg - Normal'},
      {time: '15:00', color: Colors.accent, text: 'Swimming - 25 min gentle laps'},
    ],
  },
  {
    date: '1 Apr 2026 - Tuesday', week: 15, trimester: '2nd', day: 109,
    mood: 'Tired', kicks: 0, bp: '116/78', supplements: 'Taken', nausea: 'Moderate', weight: '57.9 kg',
    babySize: 'Apple', babyLength: '10.0 cm', babyWeight: '68g',
    events: [
      {time: '07:00', color: '#D97316', text: 'Nausea - Moderate, vomited once'},
      {time: '08:30', color: Colors.accent, text: 'Supplement - Taken after nausea settled'},
      {time: '10:00', color: '#BE185D', text: 'Mood - Tired, low energy all morning'},
      {time: '13:00', color: Colors.blue, text: 'BP check - 116/78 mmHg - Slightly elevated'},
      {time: '14:00', color: Colors.accent, text: 'Rest - Nap 1.5h'},
    ],
  },
  {
    date: '31 Mar 2026 - Monday', week: 15, trimester: '2nd', day: 108,
    mood: 'Happy', kicks: 0, bp: '110/72', supplements: 'Taken', nausea: 'None', weight: '57.8 kg',
    babySize: 'Apple', babyLength: '9.8 cm', babyWeight: '65g',
    events: [
      {time: '08:00', color: Colors.accent, text: 'Supplement - All taken with breakfast'},
      {time: '09:00', color: '#BE185D', text: 'Mood - Happy, good sleep last night'},
      {time: '11:00', color: Colors.blue, text: 'Antenatal visit - Dr. Suma Rao - all normal'},
      {time: '11:30', color: '#534AB7', text: 'Blood test - Quadruple screen sent'},
      {time: '15:00', color: Colors.accent, text: 'Walk - 25 min brisk walk'},
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

const PregnancyRow = ({record, onPress}) => {
  const suppColor = record.supplements === 'Taken' ? Colors.accent : Colors.red;
  const nauseaColor = record.nausea === 'None' ? Colors.accent : record.nausea === 'Mild' ? Colors.amber : Colors.red;

  return (
    <TouchableOpacity style={st.card} activeOpacity={0.7} onPress={onPress}>
      <View style={[st.leftBar, {backgroundColor: '#BE185D'}]} />
      <View style={st.cardBody}>
        <View style={st.topRow}>
          <View style={[st.iconWrap, {backgroundColor: '#FDF0F5'}]}>
            <Icon family="Ionicons" name="flower-outline" size={ms(16)} color="#BE185D" />
          </View>
          <View style={{flex: 1, marginLeft: s(8)}}>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(13)}}>Week {record.week} - Day {record.day}</AppText>
            <AppText variant="small" color={Colors.textTertiary}>{record.trimester} trimester - {record.babySize} - {record.babyLength}</AppText>
          </View>
          <View style={{alignItems: 'flex-end', marginRight: s(6)}}>
            <AppText variant="bodyBold" color="#BE185D" style={{fontSize: ms(12)}}>{record.weight}</AppText>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color={Colors.textPrimary} />
        </View>

        <View style={st.chipRow}>
          <View style={st.chip}>
            <Icon family="Ionicons" name="happy-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>{record.mood}</AppText>
          </View>
          <View style={st.chip}>
            <Icon family="Ionicons" name="pulse-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>BP {record.bp}</AppText>
          </View>
          <View style={[st.chip, {backgroundColor: suppColor + '15'}]}>
            <Icon family="Ionicons" name="medkit-outline" size={ms(10)} color={suppColor} />
            <AppText variant="small" color={suppColor}>{record.supplements}</AppText>
          </View>
          {record.nausea !== 'None' && (
            <View style={[st.chip, {backgroundColor: nauseaColor + '15'}]}>
              <Icon family="Ionicons" name="sad-outline" size={ms(10)} color={nauseaColor} />
              <AppText variant="small" color={nauseaColor}>{record.nausea}</AppText>
            </View>
          )}
        </View>
      </View>
    </TouchableOpacity>
  );
};

const PregnancyRecordsTab = () => {
  const navigation = useNavigation();

  return (
    <View>
      <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8}>
        <View style={st.ayuIconWrap}><Icon family="Ionicons" name="bulb-outline" size={ms(16)} color={Colors.white} /></View>
        <View style={{flex: 1}}>
          <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Pregnancy</AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.7)">Week insights - Risk flags - Nutrition guidance</AppText>
        </View>
        <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      {PREGNANCY_RECORDS.map((rec, i) => (
        <View key={i}>
          <DateGroup label={rec.date} />
          <PregnancyRow record={rec} onPress={() => navigation.navigate('PregnancyDetail', {record: rec})} />
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
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6), marginTop: vs(8), paddingLeft: ms(40)},
  chip: {flexDirection: 'row', alignItems: 'center', gap: s(4), backgroundColor: Colors.background, paddingHorizontal: s(7), paddingVertical: vs(3), borderRadius: ms(6)},
});

export default PregnancyRecordsTab;
