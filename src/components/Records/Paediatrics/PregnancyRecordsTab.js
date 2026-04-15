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
    mood: 7, moodLabel: 'Good', energy: 6, energyLabel: 'Moderate',
    bp: '110/72', weight: '58.2 kg', sleepH: 7.5, wakeups: 2, sleepQuality: 'OK', sleepPosition: 'Left side',
    waterGlasses: 6, kicks: 0,
    supplementsTaken: 4, supplementsTotal: 5,
    symptoms: ['Fatigue'],
    epdsScore: 4, epdsAnswered: 10,
    visit: null,
    events: [
      {time: '08:00', color: Colors.accent, text: 'Supplements - IFA + Calcium + Folic acid + DHA taken (4/5)'},
      {time: '09:30', color: '#BE185D', text: 'Mood logged - 7/10 Good'},
      {time: '11:00', color: Colors.blue, text: 'BP 110/72 mmHg - Weight 58.2 kg'},
      {time: '14:00', color: Colors.amberDark, text: 'Symptom - Fatigue'},
      {time: '22:00', color: '#7C3AED', text: 'Sleep log - 7.5h · 2 wakeups · Left side'},
    ],
  },
  {
    date: 'Yesterday - 4 Apr 2026', week: 16, trimester: '2nd', day: 112,
    mood: 6, moodLabel: 'Moderate', energy: 5, energyLabel: 'OK',
    bp: '112/74', weight: '58.1 kg', sleepH: 6.5, wakeups: 3, sleepQuality: 'Interrupted', sleepPosition: 'Mixed',
    waterGlasses: 5, kicks: 0,
    supplementsTaken: 3, supplementsTotal: 5,
    symptoms: ['Nausea', 'Fatigue'],
    epdsScore: 5, epdsAnswered: 10,
    visit: null,
    events: [
      {time: '08:15', color: Colors.accent, text: 'Supplements - IFA + Calcium + Folic acid (3/5)'},
      {time: '10:00', color: Colors.amberDark, text: 'Symptom - Nausea mild, resolved by 11 AM'},
      {time: '11:30', color: Colors.blue, text: 'BP 112/74 mmHg - Weight 58.1 kg'},
      {time: '15:00', color: '#BE185D', text: 'Mood 6/10 - Slight fatigue after lunch'},
    ],
  },
  {
    date: '3 Apr 2026 - Thursday', week: 16, trimester: '2nd', day: 111,
    mood: 5, moodLabel: 'OK', energy: 5, energyLabel: 'OK',
    bp: '114/76', weight: '58.1 kg', sleepH: 7, wakeups: 2, sleepQuality: 'OK', sleepPosition: 'Left side',
    waterGlasses: 6, kicks: 0,
    supplementsTaken: 5, supplementsTotal: 5,
    symptoms: ['Anxiety / worry'],
    epdsScore: 7, epdsAnswered: 10,
    visit: null,
    events: [
      {time: '08:00', color: Colors.accent, text: 'Supplements - All 5 taken on time'},
      {time: '10:30', color: '#BE185D', text: 'Mood 5/10 - Anxious about upcoming scan'},
      {time: '14:00', color: Colors.blue, text: 'BP 114/76 mmHg'},
    ],
  },
  {
    date: '2 Apr 2026 - Wednesday', week: 15, trimester: '2nd', day: 110,
    mood: 8, moodLabel: 'Very good', energy: 7, energyLabel: 'Good',
    bp: '108/70', weight: '58.0 kg', sleepH: 8, wakeups: 1, sleepQuality: 'Restful', sleepPosition: 'Left side',
    waterGlasses: 7, kicks: 0,
    supplementsTaken: 3, supplementsTotal: 5,
    symptoms: [],
    epdsScore: 2, epdsAnswered: 10,
    visit: null,
    events: [
      {time: '08:30', color: Colors.red, text: 'Supplements - IFA missed (ran out)'},
      {time: '09:00', color: '#BE185D', text: 'Mood 8/10 - Happy, energetic'},
      {time: '12:00', color: Colors.blue, text: 'BP 108/70 mmHg - Weight 58.0 kg'},
    ],
  },
  {
    date: '1 Apr 2026 - Tuesday', week: 15, trimester: '2nd', day: 109,
    mood: 4, moodLabel: 'Below average', energy: 3, energyLabel: 'Low',
    bp: '116/78', weight: '57.9 kg', sleepH: 6, wakeups: 4, sleepQuality: 'Poor', sleepPosition: 'Mixed',
    waterGlasses: 4, kicks: 0,
    supplementsTaken: 4, supplementsTotal: 5,
    symptoms: ['Nausea', 'Vomiting', 'Fatigue'],
    epdsScore: 9, epdsAnswered: 10,
    visit: null,
    events: [
      {time: '07:00', color: Colors.amberDark, text: 'Symptom - Nausea + vomited once'},
      {time: '08:30', color: Colors.accent, text: 'Supplements - 4/5 taken after nausea'},
      {time: '10:00', color: '#BE185D', text: 'Mood 4/10 - Low energy all morning'},
      {time: '13:00', color: Colors.blue, text: 'BP 116/78 mmHg - Slightly elevated'},
    ],
  },
  {
    date: '31 Mar 2026 - Monday', week: 15, trimester: '2nd', day: 108,
    mood: 7, moodLabel: 'Good', energy: 7, energyLabel: 'Good',
    bp: '110/72', weight: '57.8 kg', sleepH: 8, wakeups: 1, sleepQuality: 'Restful', sleepPosition: 'Left side',
    waterGlasses: 7, kicks: 0,
    supplementsTaken: 5, supplementsTotal: 5,
    symptoms: [],
    epdsScore: 3, epdsAnswered: 10,
    visit: {type: 'Routine ANC', provider: 'Apollo - Dr. Suma Rao', fundalHeight: 15, fhr: 148, tests: ['Hb', 'Urine R/E'], scans: [], vaccines: []},
    events: [
      {time: '08:00', color: Colors.accent, text: 'Supplements - All 5 taken with breakfast'},
      {time: '11:00', color: Colors.blue, text: 'Antenatal visit - Apollo - Dr. Suma Rao'},
      {time: '11:15', color: '#534AB7', text: 'Vitals - BP 110/72 · Weight 57.8 kg · FH 15 cm · FHR 148 bpm'},
      {time: '11:30', color: '#534AB7', text: 'Tests done - Hb + Urine R/E'},
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
  const suppColor = record.supplementsTaken === record.supplementsTotal ? Colors.accent : record.supplementsTaken >= 3 ? Colors.amber : Colors.red;
  const hasSymptoms = record.symptoms.length > 0;

  return (
    <TouchableOpacity style={st.card} activeOpacity={0.7} onPress={onPress}>
      <View style={[st.leftBar, {backgroundColor: '#BE185D'}]} />
      <View style={st.cardBody}>
        <View style={st.topRow}>
          <View style={[st.iconWrap, {backgroundColor: '#FDF0F5'}]}>
            <Icon family="Ionicons" name="flower-outline" size={ms(16)} color="#BE185D" />
          </View>
          <View style={{flex: 1, marginLeft: s(8)}}>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(13)}}>Week {record.week} · Day {record.day}</AppText>
            <AppText variant="small" color={Colors.textTertiary}>{record.trimester} trimester</AppText>
          </View>
          <View style={{alignItems: 'flex-end', marginRight: s(6)}}>
            <AppText variant="bodyBold" color="#BE185D" style={{fontSize: ms(12)}}>{record.weight}</AppText>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color={Colors.textPrimary} />
        </View>

        <View style={st.chipRow}>
          <View style={st.chip}>
            <Icon family="Ionicons" name="happy-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>Mood {record.mood}/10</AppText>
          </View>
          <View style={st.chip}>
            <Icon family="Ionicons" name="pulse-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>BP {record.bp}</AppText>
          </View>
          <View style={[st.chip, {backgroundColor: suppColor + '15'}]}>
            <Icon family="Ionicons" name="medkit-outline" size={ms(10)} color={suppColor} />
            <AppText variant="small" color={suppColor}>Supp {record.supplementsTaken}/{record.supplementsTotal}</AppText>
          </View>
          <View style={st.chip}>
            <Icon family="Ionicons" name="moon-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>Sleep {record.sleepH}h</AppText>
          </View>
          {hasSymptoms && (
            <View style={[st.chip, {backgroundColor: Colors.amberBg}]}>
              <Icon family="Ionicons" name="sad-outline" size={ms(10)} color={Colors.amberDark} />
              <AppText variant="small" color={Colors.amberDark}>{record.symptoms.length} symptom</AppText>
            </View>
          )}
          {record.visit && (
            <View style={[st.chip, {backgroundColor: Colors.blueBg}]}>
              <Icon family="Ionicons" name="medical-outline" size={ms(10)} color={Colors.blueText} />
              <AppText variant="small" color={Colors.blueText}>Visit</AppText>
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
          <AppText variant="subtext" color="rgba(255,255,255,0.7)">Wellbeing · Antenatal · EPDS trends</AppText>
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
