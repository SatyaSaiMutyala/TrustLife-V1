import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';

const days = [
  {name: 'Mon', num: '16', status: 'miss'},
  {name: 'Tue', num: '17', status: 'miss'},
  {name: 'Wed', num: '18', status: 'done'},
  {name: 'Thu', num: '19', status: 'done'},
  {name: 'Fri', num: '20', status: 'done'},
  {name: 'Today', num: '21', status: 'active'},
];

const dotColors = {
  miss: '#F09595',
  done: Colors.lightGreen,
  partial: '#FAC775',
  active: Colors.teal,
};

const DayStrip = () => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.strip}>
    {days.map((d, i) => {
      const isActive = d.status === 'active';
      return (
        <TouchableOpacity
          key={i}
          style={[styles.pill, isActive && styles.pillActive]}
          activeOpacity={0.7}>
          <AppText variant="subtext" color={isActive ? Colors.primary : 'rgba(255,255,255,0.6)'}>{d.name}</AppText>
          <AppText variant="bodyBold" color={isActive ? Colors.primary : 'rgba(255,255,255,0.9)'} style={styles.dayNum}>{d.num}</AppText>
          <View style={[styles.dot, {backgroundColor: dotColors[d.status]}]} />
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const styles = StyleSheet.create({
  strip: {gap: s(4)},
  pill: {
    alignItems: 'center',
    gap: vs(3),
    paddingVertical: vs(7),
    paddingHorizontal: s(10),
    borderRadius: ms(12),
    backgroundColor: 'rgba(255,255,255,0.1)',
    minWidth: s(44),
  },
  pillActive: {backgroundColor: Colors.white},
  dayNum: {fontSize: ms(14)},
  dot: {width: ms(5), height: ms(5), borderRadius: ms(3)},
});

export default DayStrip;
