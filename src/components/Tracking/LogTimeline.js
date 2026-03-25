import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Emoji from '../shared/Emoji';
import SectionTitle from '../shared/SectionTitle';

const timeline = [
  {icon: '💊', bg: Colors.amberBg, name: 'Metformin 500mg · AM', sub: 'Taken with breakfast · on time', val: '✓ Done', valColor: Colors.tealDark, time: '7:52 AM'},
  {icon: '🩸', bg: Colors.redBg, name: 'Blood glucose · fasting', sub: 'Before breakfast reading', val: '8.4 mmol/L', valColor: Colors.redText, time: '7:00 AM'},
  {icon: '🫀', bg: Colors.tealBg, name: 'Blood pressure', sub: 'Morning sitting measurement', val: '138/88', valColor: Colors.amberText, time: '8:30 AM'},
  {icon: '😴', bg: Colors.blueBg, name: 'Sleep logged', sub: '10:48 PM – 4:36 AM', val: '5.8 hrs', valColor: Colors.redText, time: 'Auto'},
  {icon: '💊', bg: Colors.purpleBg, name: 'Metformin 500mg · PM', sub: 'Due with dinner', val: 'Pending', valColor: Colors.amberText, time: '8:00 PM', pending: true},
];

const LogTimeline = () => (
  <View>
    <SectionTitle title="Today's Log Timeline" />
    <View style={styles.card}>
      {timeline.map((t, i) => (
        <TouchableOpacity
          key={i}
          style={[
            styles.row,
            i < timeline.length - 1 && styles.rowBorder,
            t.pending && {opacity: 0.5},
          ]}
          activeOpacity={0.7}>
          <View style={[styles.ico, {backgroundColor: t.bg}]}>
            <Emoji icon={t.icon} size={15} />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" style={styles.name}>{t.name}</AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.sub}>{t.sub}</AppText>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <AppText variant="bodyBold" color={t.valColor}>{t.val}</AppText>
            <AppText variant="caption" color={Colors.textTertiary} style={styles.time}>{t.time}</AppText>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
    marginBottom: vs(18),
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    paddingVertical: vs(10),
    paddingHorizontal: s(13),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  ico: {width: ms(32), height: ms(32), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center'},
  name: {fontSize: ms(12)},
  sub: {marginTop: vs(1)},
  time: {marginTop: vs(1)},
});

export default LogTimeline;
