import React from 'react';
import {View, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import SectionTitle from '../shared/SectionTitle';
import AppText from '../shared/AppText';

const actions = [
  {image: require('../../assets/img/exercise-track.png'), label: 'Log steps', route: 'MovementTracker'},
  {image: require('../../assets/img/food-track.png'), label: 'Log meal', route: 'FoodTracker'},
  {image: require('../../assets/img/medical-track.png'), label: 'Medication', route: 'MedicationTracker'},
  {image: require('../../assets/img/sleep-track.png'), label: 'Sleep log', route: 'SleepTracker'},
];

const QuickActions = () => {
  const navigation = useNavigation();
  return (
  <View>
    <SectionTitle title="Quick Actions" />
    <View style={styles.grid}>
      {actions.map((a, i) => (
        <TouchableOpacity key={i} style={styles.btn} onPress={() => navigation.navigate(a.route)}>
          <Image source={a.image} style={styles.img} resizeMode="contain" />
          <AppText variant="caption" color={Colors.textSecondary} style={styles.label}>{a.label}</AppText>
        </TouchableOpacity>
      ))}
    </View>
  </View>
  );
};

const styles = StyleSheet.create({
  grid: {flexDirection: 'row', gap: s(7), marginBottom: vs(18)},
  btn: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(13), borderWidth: 0.5, borderColor: Colors.borderLight, paddingVertical: vs(10), paddingHorizontal: s(5), alignItems: 'center', gap: vs(5)},
  iconWrap: {width: ms(33), height: ms(33), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center'},
  img: {width: ms(33), height: ms(33), borderRadius: ms(10)},
  label: {textAlign: 'center'},
});

export default QuickActions;
