import React from 'react';
import {View, StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Emoji from '../shared/Emoji';
import SectionTitle from '../shared/SectionTitle';

const logs = [
  {icon: '🩸', bg: Colors.redBg, name: 'Blood glucose', last: '8.4 · 7AM'},
  {icon: '🫀', bg: Colors.tealBg, name: 'Blood pressure', last: '138/88 · 8AM'},
  {icon: '💓', bg: Colors.pinkBg, name: 'Heart rate', last: '74 bpm · 8AM'},
  {icon: '⚖️', bg: Colors.blueBg, name: 'Weight', last: '68.4 kg · 3d ago'},
  {icon: '🌡️', bg: Colors.amberBg, name: 'Temperature', last: '36.6°C · 2d ago'},
  {icon: '📈', bg: Colors.purpleBg, name: 'ECG', last: 'Normal · 12d ago'},
  {icon: '🌸', bg: Colors.pinkBg, name: 'Menstrual cycle', last: 'Day 14'},
  {icon: '🧠', bg: Colors.amberBg, name: 'Migraine', last: 'No episode · 7d'},
  {icon: '🫁', bg: Colors.blueBg, name: 'Asthma', last: 'No episode · 14d'},
  {icon: '🦴', bg: Colors.tealBg, name: 'Musculoskeletal', last: 'Mild pain · 2d ago'},
  {icon: '💉', bg: '#EAF3DE', name: 'Vaccination', last: 'Flu · Sep 2025'},
  {icon: '🧘', bg: Colors.purpleBg, name: 'Stress & mood', last: 'Neutral · 5/10'},
  {icon: '🩸', bg: '#FEF0F0', name: 'Anemia', last: 'Hb 10.8 · Mild'},
  {icon: '', bg: '', name: 'Coming soon', last: '', soon: true},
  {icon: '', bg: '', name: 'Coming soon', last: '', soon: true},
  {icon: '', bg: '', name: 'Coming soon', last: '', soon: true},
];

const SymptomLogs = () => {
  const {width} = useWindowDimensions();
  const navigation = useNavigation();
  const btnW = (width - s(12) * 2 - s(7) * 3) / 4;

  const handlePress = (log) => {
    if (log.name === 'Vaccination') {
      navigation.navigate('VaccinationLog');
    } else if (log.name === 'ECG') {
      navigation.navigate('ECGLog');
    } else if (log.name === 'Musculoskeletal') {
      navigation.navigate('MSKLog');
    } else if (log.name === 'Temperature') {
      navigation.navigate('TempLog');
    } else if (log.name === 'Migraine') {
      navigation.navigate('MigraineLog');
    } else if (log.name === 'Asthma') {
      navigation.navigate('AsthmaLog');
    } else if (log.name === 'Weight') {
      navigation.navigate('WeightLog');
    } else if (log.name === 'Blood glucose') {
      navigation.navigate('GlucoseLog');
    } else if (log.name === 'Blood pressure') {
      navigation.navigate('BPLog');
    } else if (log.name === 'Menstrual cycle') {
      navigation.navigate('MenstrualLog');
    } else if (log.name === 'Stress & mood') {
      navigation.navigate('MoodLog');
    } else if (log.name === 'Heart rate') {
      navigation.navigate('HeartRateLog');
    } else if (log.name === 'Anemia') {
      navigation.navigate('AnemiaLog');
    }
  };

  return (
    <View>
      <SectionTitle title="All Symptom Logs" />
      <View style={styles.grid}>
        {logs.map((l, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.btn, {width: btnW}, l.soon && {opacity: 0.4}]}
            activeOpacity={l.soon ? 1 : 0.7}
            onPress={() => !l.soon && handlePress(l)}
            disabled={!!l.soon}>
            <View style={[styles.ico, {backgroundColor: l.bg}]}>
              <Emoji icon={l.icon} size={18} />
            </View>
            <AppText variant="caption" color={l.soon ? Colors.textTertiary : Colors.textSecondary} style={styles.name} numberOfLines={2}>{l.name}</AppText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(7), marginBottom: vs(18)},
  btn: {
    backgroundColor: Colors.white,
    borderRadius: ms(13),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingTop: vs(11),
    paddingBottom: vs(10),
    paddingHorizontal: s(6),
    alignItems: 'center',
    gap: vs(5),
  },
  ico: {width: ms(36), height: ms(36), borderRadius: ms(11), alignItems: 'center', justifyContent: 'center'},
  name: {textAlign: 'center', lineHeight: ms(13)},
  last: {textAlign: 'center', marginTop: vs(1)},
});

export default SymptomLogs;
