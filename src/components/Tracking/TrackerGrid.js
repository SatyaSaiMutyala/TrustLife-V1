import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, useWindowDimensions, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import SectionTitle from '../shared/SectionTitle';

const G = Colors.lightGreen, A = Colors.amber, R = Colors.red;

const trackers = [
  {
    image: require('../../assets/img/exercise-track.png'), iconBg: Colors.tealBg, name: 'Fitness', statusText: 'In progress', statusStyle: 'part',
    val: '8,240', unit: 'steps today · 1,760 to go', progW: '82%', progC: Colors.teal,
    bars: [{h:14,c:G},{h:16,c:G},{h:10,c:A},{h:9,c:A},{h:7,c:R},{h:9,c:A},{h:8,c:R}],
  },
  {
    image: require('../../assets/img/sleep-track.png'), iconBg: Colors.blueBg, name: 'Sleep', statusText: 'Below target', statusStyle: 'miss',
    val: '5.8', valSuffix: ' hrs', unit: 'last night · 7.5 target', progW: '77%', progC: Colors.red,
    bars: [{h:16,c:G},{h:7,c:R},{h:8,c:R},{h:6,c:R},{h:9,c:A},{h:7,c:R},{h:7,c:R}],
  },
  {
    image: require('../../assets/img/food-track.png'), iconBg: Colors.pinkBg, name: 'Food', statusText: '2 of 3', statusStyle: 'part',
    val: '1,420', valSuffix: ' kcal', unit: 'logged · dinner pending', progW: '67%', progC: Colors.amber,
    addBtn: '+ Log dinner',
  },
  {
    image: require('../../assets/img/medical-track.png'), iconBg: Colors.purpleBg, name: 'Medication', statusText: '1 of 2', statusStyle: 'part',
    val: 'AM ✓ · PM pending', valSmall: true, unit: 'Metformin · due 8:00 PM', progW: '50%', progC: Colors.amber,
    addBtn: '+ Log PM dose',
  },
];

const statusMap = {
  done: {bg: Colors.tealBg, color: Colors.tealText},
  part: {bg: Colors.amberBg, color: Colors.amberDark},
  miss: {bg: Colors.redBg, color: Colors.redDark},
};

const ROUTE_MAP = {
  Fitness: 'FitnessTracker',
  Sleep: 'SleepTracker',
  Food: 'FoodTracker',
  Medication: 'MedicationTracker',
};

const TrackerGrid = () => {
  const {width} = useWindowDimensions();
  const navigation = useNavigation();
  const cardW = (width - s(12) * 2 - s(8)) / 2;

  return (
    <View>
      <SectionTitle title="Daily Trackers" />
      <View style={styles.grid}>
        {trackers.map((t, i) => (
          <TouchableOpacity key={i} style={[styles.card, {width: cardW}]} activeOpacity={0.7} onPress={() => ROUTE_MAP[t.name] && navigation.navigate(ROUTE_MAP[t.name])}>
            <View style={styles.cardTop}>
              <Image source={t.image} style={styles.img} resizeMode="contain" />
              <View style={[styles.status, {backgroundColor: statusMap[t.statusStyle].bg}]}>
                <AppText variant="caption" color={statusMap[t.statusStyle].color} style={styles.statusText}>{t.statusText}</AppText>
              </View>
            </View>
            <AppText variant="bodyBold" style={styles.name}>{t.name}</AppText>
            <Text style={t.valSmall ? styles.valSmall : styles.val}>
              {t.val}
              {t.valSuffix && <Text style={styles.valSuffix}>{t.valSuffix}</Text>}
            </Text>
            <AppText variant="small" color={Colors.textSecondary} style={styles.unit}>{t.unit}</AppText>
            <View style={styles.progBg}>
              <View style={[styles.progFill, {width: t.progW, backgroundColor: t.progC}]} />
            </View>
            {t.bars && (
              <View style={styles.miniBars}>
                {t.bars.map((b, j) => (
                  <View key={j} style={[styles.miniBar, {height: vs(b.h), backgroundColor: b.c}]} />
                ))}
              </View>
            )}
            {t.addBtn && (
              <TouchableOpacity style={styles.addBtn}>
                <AppText variant="small" color={Colors.tealDark} style={styles.addBtnText}>{t.addBtn}</AppText>
              </TouchableOpacity>
            )}
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(8), marginBottom: vs(18)},
  card: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(13)},
  cardTop: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(10)},
  icon: {width: ms(36), height: ms(36), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center'},
  img: {width: ms(36), height: ms(36), borderRadius: ms(10)},
  status: {paddingVertical: vs(2), paddingHorizontal: s(7), borderRadius: ms(20)},
  statusText: {fontWeight: '500'},
  name: {fontSize: ms(12), marginBottom: vs(4)},
  val: {fontSize: ms(20), fontWeight: '500', color: Colors.textPrimary, lineHeight: ms(22)},
  valSmall: {fontSize: ms(13), fontWeight: '500', color: Colors.textPrimary, marginTop: vs(2)},
  valSuffix: {fontSize: ms(13), color: Colors.textSecondary, fontWeight: '400'},
  unit: {marginTop: vs(2)},
  progBg: {height: vs(4), backgroundColor: Colors.background, borderRadius: ms(2), overflow: 'hidden', marginTop: vs(9)},
  progFill: {height: '100%', borderRadius: ms(2)},
  miniBars: {flexDirection: 'row', gap: ms(2), alignItems: 'flex-end', height: vs(20), marginTop: vs(8)},
  miniBar: {flex: 1, borderTopLeftRadius: ms(1), borderTopRightRadius: ms(1)},
  addBtn: {backgroundColor: Colors.background, borderRadius: ms(8), paddingVertical: vs(6), alignItems: 'center', marginTop: vs(9)},
  addBtnText: {fontWeight: '500'},
});

export default TrackerGrid;
