import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';
import SectionTitle from '../shared/SectionTitle';

const InsuranceCard = () => {
  const navigation = useNavigation();

  return (
    <View>
      <SectionTitle title="Health Insurance Claim & Track" />
      <TouchableOpacity
        style={st.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('InsuranceClaims')}>
        <View style={st.iconWrap}>
          <Icon family="Ionicons" name="shield-checkmark-outline" size={ms(24)} color={Colors.white} />
        </View>
        <View style={{flex: 1}}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>Claims Centre</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>File a claim, track status, view history</AppText>
          <View style={{flexDirection: 'row', gap: s(8), marginTop: vs(6)}}>
            <View style={st.tag}>
              <AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.tealText}}>Balance: {'\u20B9'}9.12L</AppText>
            </View>
            <View style={st.tag}>
              <AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.amberDark}}>1 under review</AppText>
            </View>
          </View>
        </View>
        <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color={Colors.black} />
      </TouchableOpacity>
    </View>
  );
};

const st = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(14),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    marginBottom: vs(18),
  },
  iconWrap: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(14),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  tag: {
    backgroundColor: Colors.tealBg,
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
});

export default InsuranceCard;
