import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const NEONATAL_RECORDS = [
  {
    date: 'Today - 5 Apr 2026', day: 'Day 44',
    feeds: 6, sleepH: '14.5h', nappies: 8, stools: 2,
    weight: '3.82 kg', length: '53.1 cm', hc: '36.5 cm',
    percentile: '50th', status: 'On track',
    timeline: [
      {time: '09:00', color: '#D97316', text: 'Feed - Breastfeed L 18min, R 14min'},
      {time: '09:35', color: '#A16207', text: 'Nappy - Wet + stool (yellow, seedy)'},
      {time: '10:00', color: '#2A5FA0', text: 'Nap - Morning nap 1h 45m'},
      {time: '11:50', color: '#D97316', text: 'Feed - Breastfeed L 20min, R 12min'},
      {time: '13:00', color: '#A16207', text: 'Nappy - Wet only'},
      {time: '13:30', color: '#2A5FA0', text: 'Nap - Afternoon nap 2h 10m'},
    ],
  },
  {
    date: 'Yesterday - 4 Apr 2026', day: 'Day 43',
    feeds: 7, sleepH: '15.2h', nappies: 9, stools: 3,
    weight: '3.80 kg', length: '53.0 cm', hc: '36.4 cm',
    percentile: '50th', status: 'On track',
    timeline: [
      {time: '08:30', color: '#D97316', text: 'Feed - Breastfeed L 20min, R 15min'},
      {time: '09:10', color: '#A16207', text: 'Nappy - Wet + stool (yellow)'},
      {time: '09:30', color: '#2A5FA0', text: 'Nap - Morning nap 2h'},
      {time: '11:45', color: '#D97316', text: 'Feed - Breastfeed L 18min, R 16min'},
      {time: '12:20', color: '#A16207', text: 'Nappy - Wet + stool'},
      {time: '14:00', color: '#2A5FA0', text: 'Nap - Afternoon nap 1h 50m'},
      {time: '16:00', color: '#D97316', text: 'Feed - Breastfeed L 15min, R 18min'},
    ],
  },
  {
    date: '3 Apr 2026 - Thursday', day: 'Day 42',
    feeds: 6, sleepH: '14.8h', nappies: 7, stools: 2,
    weight: '3.78 kg', length: '52.9 cm', hc: '36.4 cm',
    percentile: '49th', status: 'On track',
    timeline: [
      {time: '08:45', color: '#D97316', text: 'Feed - Breastfeed L 22min, R 12min'},
      {time: '09:30', color: '#A16207', text: 'Nappy - Wet only'},
      {time: '10:00', color: '#2A5FA0', text: 'Nap - Morning nap 1h 30m'},
      {time: '12:00', color: '#D97316', text: 'Feed - Breastfeed L 18min, R 14min'},
      {time: '12:40', color: '#A16207', text: 'Nappy - Wet + stool (yellow, seedy)'},
    ],
  },
  {
    date: '2 Apr 2026 - Wednesday', day: 'Day 41',
    feeds: 8, sleepH: '15.5h', nappies: 10, stools: 3,
    weight: '3.76 kg', length: '52.8 cm', hc: '36.3 cm',
    percentile: '49th', status: 'On track',
    timeline: [
      {time: '07:30', color: '#D97316', text: 'Feed - Breastfeed L 20min, R 18min'},
      {time: '08:15', color: '#A16207', text: 'Nappy - Wet + stool'},
      {time: '08:45', color: '#2A5FA0', text: 'Nap - Morning nap 2h 15m'},
      {time: '11:00', color: '#D97316', text: 'Feed - Breastfeed L 16min, R 14min'},
      {time: '13:30', color: '#2A5FA0', text: 'Nap - Afternoon nap 1h 40m'},
      {time: '15:15', color: '#D97316', text: 'Feed - Breastfeed L 18min, R 12min'},
    ],
  },
  {
    date: '1 Apr 2026 - Tuesday', day: 'Day 40',
    feeds: 7, sleepH: '14.2h', nappies: 8, stools: 2,
    weight: '3.74 kg', length: '52.7 cm', hc: '36.2 cm',
    percentile: '48th', status: 'On track',
    timeline: [
      {time: '09:00', color: '#D97316', text: 'Feed - Breastfeed L 15min, R 18min'},
      {time: '09:40', color: '#A16207', text: 'Nappy - Wet + stool (yellow)'},
      {time: '10:15', color: '#2A5FA0', text: 'Nap - Morning nap 1h 55m'},
      {time: '12:30', color: '#D97316', text: 'Feed - Breastfeed L 20min, R 15min'},
    ],
  },
  {
    date: '31 Mar 2026 - Monday', day: 'Day 39',
    feeds: 6, sleepH: '13.8h', nappies: 7, stools: 1,
    weight: '3.72 kg', length: '52.6 cm', hc: '36.2 cm',
    percentile: '48th', status: 'Monitor',
    timeline: [
      {time: '08:00', color: '#D97316', text: 'Feed - Breastfeed L 18min, R 14min'},
      {time: '08:45', color: '#A16207', text: 'Nappy - Wet only'},
      {time: '09:15', color: '#2A5FA0', text: 'Nap - Morning nap 1h 20m'},
      {time: '11:00', color: '#D97316', text: 'Feed - Formula 90ml'},
      {time: '14:00', color: '#2A5FA0', text: 'Nap - Afternoon nap 2h'},
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

const NeonatalRow = ({record, onPress}) => {
  const statusColor = record.status === 'On track' ? Colors.accent : Colors.amber;
  return (
    <TouchableOpacity style={st.card} activeOpacity={0.7} onPress={onPress}>
      <View style={[st.leftBar, {backgroundColor: statusColor}]} />
      <View style={st.cardBody}>
        {/* Top row: stats */}
        <View style={st.topRow}>
          <View style={[st.iconWrap, {backgroundColor: Colors.tealBg}]}>
            <Icon family="Ionicons" name="happy-outline" size={ms(16)} color={Colors.accent} />
          </View>
          <View style={{flex: 1, marginLeft: s(8)}}>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(13)}}>Baby Zara - {record.day}</AppText>
            <AppText variant="small" color={Colors.textTertiary}>{record.weight} - {record.length} - HC {record.hc}</AppText>
          </View>
          <View style={{alignItems: 'flex-end', marginRight: s(6)}}>
            <View style={[st.statusPill, {backgroundColor: statusColor + '18'}]}>
              <AppText variant="small" color={statusColor} style={{fontWeight: '600'}}>{record.status}</AppText>
            </View>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color={Colors.textPrimary} />
        </View>

        {/* Stats chips */}
        <View style={st.chipRow}>
          <View style={st.chip}>
            <Icon family="Ionicons" name="restaurant-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>{record.feeds} feeds</AppText>
          </View>
          <View style={st.chip}>
            <Icon family="Ionicons" name="moon-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>{record.sleepH} sleep</AppText>
          </View>
          <View style={st.chip}>
            <Icon family="Ionicons" name="water-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>{record.nappies} nappies</AppText>
          </View>
          <View style={st.chip}>
            <Icon family="Ionicons" name="ellipse-outline" size={ms(10)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary}>{record.stools} stools</AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const NeonatalRecordsTab = () => {
  const navigation = useNavigation();

  return (
    <View>
      {/* Ayu Intel banner */}
      <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8}>
        <View style={st.ayuIconWrap}><Icon family="Ionicons" name="bulb-outline" size={ms(16)} color={Colors.white} /></View>
        <View style={{flex: 1}}>
          <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Baby Health</AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.7)">Growth patterns - Feed analysis - Sleep insights</AppText>
        </View>
        <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      {NEONATAL_RECORDS.map((rec, i) => (
        <View key={i}>
          <DateGroup label={rec.date} />
          <NeonatalRow record={rec} onPress={() => navigation.navigate('NeonatalDetail', {record: rec})} />
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

export default NeonatalRecordsTab;
