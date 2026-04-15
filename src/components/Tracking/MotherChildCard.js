import React from 'react';
import {View, StyleSheet, TouchableOpacity, useWindowDimensions, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';
import SectionTitle from '../shared/SectionTitle';

const items = [
  {image: require('../../assets/img/neonatal.png'), bg: '', name: 'Neonatal Log', last: '', soon: false, icon: 'happy-outline', route: 'NeonatalLog'},
  {image: require('../../assets/img/paediatric.png'), bg: '', name: 'Paediatric Log', last: '', soon: false, icon: 'people-outline', route: 'PaediatricLog'},
  {image: require('../../assets/img/pregancy.png'), bg: '', name: 'Pregnancy Log', last: '', soon: false, icon: 'flower-outline', route: 'PregnancyLog'},
  {image: null, bg: '', name: 'Coming soon', last: '', soon: true},
];

const MotherChildCard = () => {
  const {width} = useWindowDimensions();
  const navigation = useNavigation();
  const btnW = (width - s(12) * 2 - s(7) * 3) / 4;

  const handlePress = (item) => {
    if (item.route) navigation.navigate(item.route);
  };

  return (
    <View>
      <SectionTitle title="Mother & Child" />
      <View style={styles.grid}>
        {items.map((l, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.btn, {width: btnW}, l.soon && {opacity: 0.4}]}
            activeOpacity={l.soon ? 1 : 0.7}
            onPress={() => !l.soon && handlePress(l)}
            disabled={!!l.soon}>
            <View style={styles.ico}>
              {l.image && <Image source={l.image} style={styles.img} resizeMode="contain" />}
              {!l.image && l.icon && <Icon family="Ionicons" name={l.icon} size={ms(20)} color={Colors.primary} />}
            </View>
            <AppText variant="caption" color={l.soon ? Colors.textTertiary : Colors.textSecondary} style={styles.name} numberOfLines={2}>{l.name}</AppText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(7), marginBottom: vs(18)},
  btn: {
    backgroundColor: Colors.white,
    borderRadius: ms(13),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingTop: vs(11),
    paddingBottom: vs(10),
    paddingHorizontal: s(6),
    alignItems: 'center',
    gap: vs(5),
  },
  ico: {width: ms(36), height: ms(36), borderRadius: ms(18), alignItems: 'center', justifyContent: 'center', backgroundColor: '#F0F0F0'},
  img: {width: ms(22), height: ms(22), borderRadius: ms(6)},
  name: {textAlign: 'center', lineHeight: ms(13)},
});

export default MotherChildCard;
