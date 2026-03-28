import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import Images from '../../constants/images';
import AppText from '../shared/AppText';

const AyuBanner = () => {
  const navigation = useNavigation();
  return (
  <TouchableOpacity style={styles.banner} activeOpacity={0.7} onPress={() => navigation.navigate('AyuChat')}>
    <View style={styles.avatar}>
      <Image source={Images.ayuLogo} style={styles.ayuImg} resizeMode="cover" />
      <View style={styles.onlineDot} />
    </View>
    <View style={styles.body}>
      <AppText variant="bodyBold" color={Colors.textPrimary}>Ask Ayu · AI health coach</AppText>
      <AppText variant="small" color={Colors.textSecondary} style={styles.msg}>"Priya, your sleep is your highest HbA1c risk right now. Want a plan for tonight?"</AppText>
    </View>
    <Text style={styles.arrow}>›</Text>
  </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  banner: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(13), flexDirection: 'row', alignItems: 'center', gap: s(12), marginBottom: vs(18)},
  avatar: {width: ms(44), height: ms(44), borderRadius: ms(22), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  ayuImg: {width: ms(40), height: ms(40), borderRadius: ms(20)},
  onlineDot: {position: 'absolute', bottom: ms(1), right: ms(1), width: ms(10), height: ms(10), backgroundColor: Colors.teal, borderRadius: ms(5), borderWidth: 1.5, borderColor: Colors.white},
  body: {flex: 1},
  msg: {marginTop: vs(2), lineHeight: ms(16)},
  arrow: {fontSize: ms(18), color: Colors.textTertiary},
});

export default AyuBanner;
