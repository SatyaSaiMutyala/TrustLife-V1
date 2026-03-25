import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const grid1 = [
  {label: 'EF', value: '62%', ref: '55\u201370%', bg: Colors.tealBg, color: Colors.tealText, icon: 'heart-outline'},
  {label: 'LVIDd', value: '4.6 cm', ref: '3.5\u20135.6', bg: Colors.tealBg, color: Colors.tealText, icon: 'resize-outline'},
  {label: 'IVS', value: '0.95 cm', ref: '0.6\u20131.1', bg: Colors.tealBg, color: Colors.tealText, icon: 'layers-outline'},
  {label: 'PW', value: '0.90 cm', ref: '0.6\u20131.1', bg: Colors.tealBg, color: Colors.tealText, icon: 'shield-outline'},
];

const grid2 = [
  {label: 'FS', value: '35%', ref: '25\u201345%', bg: Colors.tealBg, color: Colors.tealText, icon: 'trending-up-outline'},
  {label: 'E/A ratio', value: '0.8', ref: '> 1.0', bg: Colors.amberBg, color: Colors.amberText, icon: 'pulse-outline'},
  {label: 'Wall motion', value: 'Normal', ref: '\u2014', bg: Colors.tealBg, color: Colors.tealText, icon: 'scan-outline'},
  {label: 'Pericardial effusion', value: 'Nil', ref: '\u2014', bg: Colors.tealBg, color: Colors.tealText, icon: 'water-outline'},
];

const EchoMeasurementsTab = () => {
  const renderGrid = (data, title) => (
    <View style={{marginBottom: vs(6)}}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>{title}</AppText>
      <View style={styles.gridContainer}>
        {data.map((item, i) => (
          <View key={i} style={styles.gridItem}>
            <View style={styles.gridCard}>
              <View style={[styles.iconCircle, {backgroundColor: item.bg}]}>
                <Icon family="Ionicons" name={item.icon} size={16} color={item.color} />
              </View>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(6)}}>
                {item.label}
              </AppText>
              <AppText variant="bodyBold" color={item.color} style={{marginTop: vs(2)}}>
                {item.value}
              </AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
                Ref: {item.ref}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderInsight = () => (
    <View style={[styles.insightBox, {backgroundColor: Colors.amberBg}]}>
      <Icon family="Ionicons" name="alert-circle-outline" size={18} color={Colors.amberText} />
      <View style={{flex: 1}}>
        <AppText variant="bodyBold" color={Colors.amberText}>E/A ratio 0.8</AppText>
        <AppText variant="caption" color={Colors.amberText} style={{marginTop: vs(2)}}>
          An E/A ratio below 1.0 indicates impaired myocardial relaxation (Grade 1 diastolic dysfunction). This is commonly associated with hypertension and age-related changes. BP control is the most effective intervention.
        </AppText>
      </View>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderGrid(grid1, 'Chamber & Wall Measurements')}
      {renderGrid(grid2, 'Function & Flow')}
      {renderInsight()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: s(4),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: s(-4),
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: s(4),
    marginBottom: vs(8),
  },
  gridCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(12),
  },
  iconCircle: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    padding: ms(12),
    borderRadius: ms(11),
    marginBottom: vs(12),
  },
});

export default EchoMeasurementsTab;
