import React from 'react';
import {View, StyleSheet} from 'react-native';
import {verticalScale as vs, moderateScale as ms, scale as s} from 'react-native-size-matters';
import Fonts from '../../constants/fonts';
import AppText from './AppText';
import Colors from '../../constants/colors';

const MiniBars = ({data}) => (
  <View style={st.wrapper}>
    <View style={st.barsRow}>
      {data.map((bar, i) => (
        <View key={i} style={st.barCol}>
          <View style={st.barTrack}>
            <View
              style={[
                st.bar,
                {height: vs(bar.height), backgroundColor: bar.color},
              ]}
            />
          </View>
          <AppText variant="small" color={Colors.textTertiary} style={st.dayLbl}>
            {bar.day}
          </AppText>
        </View>
      ))}
    </View>
  </View>
);

const st = StyleSheet.create({
  wrapper: {
    marginBottom: vs(6),
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: vs(32),
    gap: s(3),
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    flex: 1,
    justifyContent: 'flex-end',
    alignItems: 'center',
    width: '100%',
  },
  bar: {
    width: ms(6),
    borderRadius: ms(3),
    minHeight: vs(2),
  },
  dayLbl: {
    fontSize: Fonts.sizes.xs,
    marginTop: vs(2),
  },
});

export default MiniBars;
