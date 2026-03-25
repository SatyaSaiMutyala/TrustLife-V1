import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const drugDrugInteractions = [
  {
    pair: 'Metformin \u2194 Amlodipine',
    description: 'No interaction. Safe to take together.',
    icon: 'checkmark-circle',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    status: 'Safe',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    pair: 'Metformin \u2194 Atorvastatin',
    description: 'No significant interaction. Mild glucose-lowering additive.',
    icon: 'checkmark-circle',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    status: 'Safe',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    pair: 'Amlodipine \u2194 Atorvastatin',
    description:
      'Minor: Amlodipine slightly increases Atorvastatin levels (+40%). At 10mg not significant.',
    icon: 'checkmark-circle',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    status: 'Minor \u00B7 Safe',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
  {
    pair: 'Methylcobalamin \u2194 All others',
    description: 'No known interactions. B12 replacement safe across all.',
    icon: 'checkmark-circle',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    status: 'Safe',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
];

const drugFoodInteractions = [
  {
    pair: 'Grapefruit + Amlodipine',
    description:
      'Inhibits CYP3A4 \u2192 excessive BP drop. Avoid grapefruit and grapefruit juice entirely.',
    icon: 'close-circle',
    iconBg: Colors.redBg,
    iconColor: Colors.redText,
    status: 'Avoid',
    statusBg: Colors.redBg,
    statusColor: Colors.redText,
  },
  {
    pair: 'Alcohol + Metformin',
    description: 'Lactic acidosis risk. Avoid entirely.',
    icon: 'close-circle',
    iconBg: Colors.redBg,
    iconColor: Colors.redText,
    status: 'Avoid',
    statusBg: Colors.redBg,
    statusColor: Colors.redText,
  },
  {
    pair: 'Ibuprofen/NSAIDs + Metformin',
    description: 'Reduces renal clearance. Use Paracetamol.',
    icon: 'warning-outline',
    iconBg: Colors.amberBg,
    iconColor: Colors.amberText,
    status: 'Caution',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
];

const renderInteractionRow = (item, index, total) => (
  <View
    key={index}
    style={[
      styles.interactionRow,
      index < total - 1 && styles.interactionRowBorder,
    ]}>
    <View style={[styles.interactionIcon, {backgroundColor: item.iconBg}]}>
      <Icon family="Ionicons" name={item.icon} size={16} color={item.iconColor} />
    </View>

    <View style={styles.interactionContent}>
      <View style={styles.interactionHeader}>
        <View style={{flex: 1}}>
          <AppText variant="bodyBold">{item.pair}</AppText>
        </View>
        <View style={[styles.pill, {backgroundColor: item.statusBg}]}>
          <AppText variant="small" color={item.statusColor}>
            {item.status}
          </AppText>
        </View>
      </View>

      <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
        {item.description}
      </AppText>
    </View>
  </View>
);

const RxInteractionsTab = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Green insight */}
      <View style={[styles.insightBox, {backgroundColor: Colors.tealBg}]}>
        <Icon family="Ionicons" name="checkmark-circle" size={18} color={Colors.tealText} />
        <AppText variant="caption" color={Colors.tealText} style={{flex: 1}}>
          No dangerous interactions between your 4 current medications. All combinations
          are safe at prescribed doses.
        </AppText>
      </View>

      {/* Drug-drug interactions */}
      <AppText variant="bodyBold" style={styles.sectionTitle}>
        Drug-drug interactions
      </AppText>
      <View style={styles.card}>
        {drugDrugInteractions.map((item, i) =>
          renderInteractionRow(item, i, drugDrugInteractions.length),
        )}
      </View>

      {/* Drug-food interactions */}
      <AppText variant="bodyBold" style={styles.sectionTitle}>
        Drug-food interactions
      </AppText>
      <View style={styles.card}>
        {drugFoodInteractions.map((item, i) =>
          renderInteractionRow(item, i, drugFoodInteractions.length),
        )}
      </View>

      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    padding: ms(12),
    borderRadius: ms(12),
    marginBottom: vs(12),
  },
  sectionTitle: {
    marginBottom: vs(8),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
    marginBottom: vs(12),
  },
  interactionRow: {
    flexDirection: 'row',
    paddingVertical: vs(10),
    alignItems: 'flex-start',
  },
  interactionRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  interactionIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
    marginTop: vs(2),
  },
  interactionContent: {
    flex: 1,
  },
  interactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
});

export default RxInteractionsTab;
