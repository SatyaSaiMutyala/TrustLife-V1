import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Emoji from '../shared/Emoji';
import SectionTitle from '../shared/SectionTitle';

const badgeStyles = {
  r: {bg: Colors.redBg, color: Colors.redText},
  a: {bg: Colors.amberBg, color: Colors.amberText},
  g: {bg: Colors.tealBg, color: Colors.tealText},
  b: {bg: Colors.blueBg, color: '#185FA5'},
  p: {bg: Colors.purpleBg, color: Colors.purpleText},
};

const MenuSection = ({title, items}) => (
  <View>
    <SectionTitle title={title} />
    <View style={styles.card}>
      {items.map((item, i) => (
        <TouchableOpacity key={i} style={[styles.row, i < items.length - 1 && styles.rowBorder]} activeOpacity={0.6}>
          <View style={[styles.ico, {backgroundColor: item.iconBg}]}>
            <Emoji icon={item.icon} size={16} />
          </View>
          <View style={styles.label}>
            <AppText variant="bodyBold">{item.name}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={styles.sub}>{item.sub}</AppText>
          </View>
          <View style={styles.right}>
            {item.badge && (
              <View style={[styles.badge, {backgroundColor: badgeStyles[item.badgeStyle].bg}]}>
                <AppText variant="small" color={badgeStyles[item.badgeStyle].color} style={styles.badgeText}>{item.badge}</AppText>
              </View>
            )}
            <AppText variant="body" color={Colors.textTertiary} style={styles.arrow}>›</AppText>
          </View>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: Colors.borderLight, marginBottom: vs(10), overflow: 'hidden'},
  row: {flexDirection: 'row', alignItems: 'center', gap: s(12), paddingVertical: vs(12), paddingHorizontal: s(14)},
  rowBorder: {borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  ico: {width: ms(34), height: ms(34), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center'},
  label: {flex: 1},
  sub: {marginTop: vs(1)},
  right: {flexDirection: 'row', alignItems: 'center', gap: s(5)},
  badge: {paddingVertical: vs(2), paddingHorizontal: s(6), borderRadius: ms(20)},
  badgeText: {fontWeight: '500', fontSize: ms(8)},
  arrow: {fontSize: ms(15)},
});

export default MenuSection;
