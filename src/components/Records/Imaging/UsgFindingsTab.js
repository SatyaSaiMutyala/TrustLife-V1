import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const liverFindings = [
  {label: 'Liver size', value: '14.2 cm (borderline)', bg: Colors.amberBg, color: Colors.amberText, icon: 'resize-outline'},
  {label: 'Echogenicity', value: 'Grade 1 increased', bg: Colors.amberBg, color: Colors.amberText, icon: 'contrast-outline'},
  {label: 'Texture', value: 'Homogeneous', bg: Colors.tealBg, color: Colors.tealText, icon: 'grid-outline'},
  {label: 'Portal vein', value: '11 mm - Normal', bg: Colors.tealBg, color: Colors.tealText, icon: 'git-branch-outline'},
];

const kidneyFindings = [
  {label: 'Right kidney', value: '10.2 cm - Normal', bg: Colors.tealBg, color: Colors.tealText, icon: 'ellipse-outline'},
  {label: 'Left kidney', value: '10.5 cm - Normal', bg: Colors.tealBg, color: Colors.tealText, icon: 'ellipse-outline'},
  {label: 'Cortical echogenicity', value: 'Normal', bg: Colors.tealBg, color: Colors.tealText, icon: 'layers-outline'},
];

const otherFindings = [
  {label: 'Gallbladder', value: 'Normal, no calculi', bg: Colors.tealBg, color: Colors.tealText, icon: 'water-outline'},
  {label: 'Biliary tree', value: 'Not dilated', bg: Colors.tealBg, color: Colors.tealText, icon: 'git-merge-outline'},
  {label: 'Pancreas', value: 'Normal', bg: Colors.tealBg, color: Colors.tealText, icon: 'square-outline'},
];

const UsgFindingsTab = () => {
  const renderFindingBlock = (title, findings, iconName, headerBg, headerColor) => (
    <View style={{marginBottom: vs(10)}}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(8)}}>
        <View style={[styles.iconCircle, {backgroundColor: headerBg}]}>
          <Icon family="Ionicons" name={iconName} size={16} color={headerColor} />
        </View>
        <AppText variant="bodyBold">{title}</AppText>
      </View>
      <View style={styles.card}>
        {findings.map((item, i) => (
          <View
            key={i}
            style={[
              styles.findingRow,
              i < findings.length - 1 && styles.rowBorder,
            ]}>
            <View style={[styles.statusDot, {backgroundColor: item.bg}]}>
              <Icon family="Ionicons" name={item.icon} size={14} color={item.color} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="caption" color={Colors.textSecondary}>{item.label}</AppText>
              <AppText variant="bodyBold" color={item.color} style={{marginTop: vs(2)}}>
                {item.value}
              </AppText>
            </View>
            <View style={[styles.pill, {backgroundColor: item.bg}]}>
              <AppText variant="small" color={item.color}>
                {item.bg === Colors.tealBg ? 'Normal' : 'Watch'}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderFindingBlock('Liver', liverFindings, 'fitness-outline', Colors.amberBg, Colors.amberText)}
      {renderFindingBlock('Kidneys', kidneyFindings, 'medkit-outline', Colors.tealBg, Colors.tealText)}
      {renderFindingBlock('Gallbladder / Biliary / Pancreas', otherFindings, 'shield-checkmark-outline', Colors.tealBg, Colors.tealText)}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: s(4),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
  },
  iconCircle: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  findingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    paddingVertical: vs(10),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  statusDot: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
});

export default UsgFindingsTab;
