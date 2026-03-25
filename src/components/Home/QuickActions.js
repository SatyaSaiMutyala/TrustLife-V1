import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import SectionTitle from '../shared/SectionTitle';
import Emoji from '../shared/Emoji';
import AppText from '../shared/AppText';

const actions = [
  {icon: '🏃', label: 'Log steps', bg: Colors.tealBg},
  {icon: '🍽️', label: 'Log meal', bg: Colors.amberBg},
  {icon: '💊', label: 'Medication', bg: Colors.purpleBg},
  {icon: '😴', label: 'Sleep log', bg: Colors.blueBg},
];

const QuickActions = () => (
  <View>
    <SectionTitle title="Quick Actions" />
    <View style={styles.grid}>
      {actions.map((a, i) => (
        <TouchableOpacity key={i} style={styles.btn}>
          <View style={[styles.iconWrap, {backgroundColor: a.bg}]}>
            <Emoji icon={a.icon} size={15} />
          </View>
          <AppText variant="caption" color={Colors.textSecondary} style={styles.label}>{a.label}</AppText>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  grid: {flexDirection: 'row', gap: s(7), marginBottom: vs(18)},
  btn: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(13), borderWidth: 0.5, borderColor: Colors.borderLight, paddingVertical: vs(10), paddingHorizontal: s(5), alignItems: 'center', gap: vs(5)},
  iconWrap: {width: ms(33), height: ms(33), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center'},
  label: {textAlign: 'center'},
});

export default QuickActions;
