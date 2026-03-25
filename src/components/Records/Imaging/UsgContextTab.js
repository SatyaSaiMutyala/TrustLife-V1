import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const contextRows = [
  {
    icon: 'fast-food-outline',
    bg: Colors.amberBg,
    color: Colors.amberText,
    title: 'High-GI diet',
    detail: 'Triggers hepatic lipogenesis and worsens steatosis',
  },
  {
    icon: 'medkit-outline',
    bg: Colors.tealBg,
    color: Colors.tealText,
    title: 'Metformin',
    detail: 'Protective effect - reduces hepatic fat accumulation',
  },
  {
    icon: 'time-outline',
    bg: Colors.redBg,
    color: Colors.redText,
    title: 'Repeat USG overdue',
    detail: 'Last scan > 12 months ago, follow-up recommended',
  },
];

const UsgContextTab = () => {
  const renderInsight = () => (
    <View style={[styles.insightBox, {backgroundColor: Colors.amberBg}]}>
      <Icon family="Ionicons" name="information-circle-outline" size={18} color={Colors.amberText} />
      <View style={{flex: 1}}>
        <AppText variant="bodyBold" color={Colors.amberText}>
          Why you have fatty liver
        </AppText>
        <AppText variant="caption" color={Colors.amberText} style={{marginTop: vs(4)}}>
          Your Type 2 diabetes (T2DM) and dyslipidaemia are the two strongest drivers of non-alcoholic fatty liver disease (NAFLD). Insulin resistance promotes hepatic fat deposition, while elevated triglycerides compound the effect. Up to 70% of T2DM patients have some degree of NAFLD.
        </AppText>
      </View>
    </View>
  );

  const renderContextCard = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>Contributing Factors</AppText>
      {contextRows.map((item, i) => (
        <View
          key={i}
          style={[
            styles.contextRow,
            i < contextRows.length - 1 && styles.rowBorder,
          ]}>
          <View style={[styles.iconCircle, {backgroundColor: item.bg}]}>
            <Icon family="Ionicons" name={item.icon} size={16} color={item.color} />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={item.color}>{item.title}</AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
              {item.detail}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>Clinical Insight</AppText>
      {renderInsight()}
      {renderContextCard()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: s(4),
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    padding: ms(12),
    borderRadius: ms(11),
    marginBottom: vs(12),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
    marginBottom: vs(10),
  },
  contextRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    paddingVertical: vs(10),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  iconCircle: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default UsgContextTab;
