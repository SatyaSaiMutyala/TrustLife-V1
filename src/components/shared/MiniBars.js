import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Fonts from '../../constants/fonts';
import Colors from '../../constants/colors';

const MiniBars = ({data}) => (
  <View style={styles.container}>
    {data.map((bar, i) => (
      <View key={i} style={styles.barCol}>
        <View style={styles.barArea}>
          <View style={[styles.bar, {height: vs(bar.height), backgroundColor: bar.color}]} />
        </View>
        <Text style={styles.dayLabel}>{bar.day}</Text>
      </View>
    ))}
  </View>
);

const styles = StyleSheet.create({
  container: {flexDirection: 'row', gap: ms(3), height: vs(35), alignItems: 'flex-end', marginBottom: vs(6)},
  barCol: {flex: 1, alignItems: 'center'},
  barArea: {flex: 1, justifyContent: 'flex-end', alignItems: 'center', width: '100%'},
  bar: {width: '100%', borderTopLeftRadius: ms(2), borderTopRightRadius: ms(2)},
  dayLabel: {fontSize: Fonts.sizes.xs, color: Colors.textTertiary, marginTop: vs(2)},
});

export default MiniBars;
