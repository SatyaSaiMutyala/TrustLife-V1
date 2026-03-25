import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const coreItems = [
  {
    icon: 'hospital-outline',
    bg: Colors.blueBg,
    color: Colors.blueText,
    title: 'In-patient hospitalisation',
    value: '\u20B95,00,000 Full sum',
    status: 'Available',
  },
  {
    icon: 'flask-outline',
    bg: Colors.purpleBg,
    color: Colors.purpleText,
    title: 'Pre & post hospitalisation',
    value: '30+60 days',
    status: 'Available',
  },
  {
    icon: 'cut-outline',
    bg: Colors.tealBg,
    color: Colors.tealText,
    title: 'Daycare procedures',
    value: '586 Procedures',
    status: 'Available',
  },
  {
    icon: 'car-outline',
    bg: Colors.amberBg,
    color: Colors.amberText,
    title: 'Ambulance charges',
    value: '\u20B92,000 Per event',
    status: 'Available',
  },
];

const preExistingConditions = [
  {label: 'T2DM', status: 'Covered'},
  {label: 'HTN', status: 'Covered'},
  {label: 'Dyslipidaemia', status: 'Covered'},
];

const conditionBenefits = [
  {
    icon: 'eye-outline',
    bg: Colors.amberBg,
    color: Colors.amberText,
    title: 'Diabetic eye complications',
    value: 'Covered if hospitalised',
    status: 'Active',
  },
  {
    icon: 'heart-outline',
    bg: Colors.blueBg,
    color: Colors.blueText,
    title: 'Kidney complications',
    value: 'Incl. dialysis',
    status: 'Active',
  },
  {
    icon: 'pulse-outline',
    bg: Colors.pinkBg,
    color: Colors.redText,
    title: 'Cardiac procedures',
    value: 'Full extent',
    status: 'Active',
  },
  {
    icon: 'brain-outline',
    bg: Colors.purpleBg,
    color: Colors.purpleText,
    title: 'Mental health',
    value: 'If hospitalised',
    statusNote: 'OPD: No',
  },
];

const notCoveredItems = [
  {icon: 'close-circle', bg: Colors.redBg, color: Colors.redText, title: 'OPD consultations', note: 'Not covered'},
  {icon: 'close-circle', bg: Colors.redBg, color: Colors.redText, title: 'Routine diagnostics', note: 'Not covered OPD'},
  {icon: 'close-circle', bg: Colors.redBg, color: Colors.redText, title: 'Pharmacy / medicines', note: 'Monthly not covered'},
  {icon: 'close-circle', bg: Colors.redBg, color: Colors.redText, title: 'Cosmetic and dental', note: 'Excluded'},
  {icon: 'warning-outline', bg: Colors.amberBg, color: Colors.amberText, title: 'Weight loss treatment', note: 'Excluded unless complication'},
];

const InsBenefitsTab = () => {
  const renderBlueInsight = () => (
    <View style={styles.insightBox}>
      <Icon family="Ionicons" name="information-circle-outline" size={ms(18)} color={Colors.blueText} />
      <AppText variant="caption" color={Colors.blueText} style={{flex: 1}}>
        Benefits shown as applicable to Priya's conditions (T2DM, HTN, Dyslipidaemia) under the current policy.
      </AppText>
    </View>
  );

  const renderBenefitRow = (item, i, total) => (
    <View key={i} style={[styles.benefitRow, i < total - 1 && styles.rowBorder]}>
      <View style={[styles.iconCircle, {backgroundColor: item.bg}]}>
        <Icon family="Ionicons" name={item.icon} size={ms(18)} color={item.color} />
      </View>
      <View style={{flex: 1}}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>{item.title}</AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
          {item.value}
        </AppText>
      </View>
      {item.status && (
        <View style={[styles.statusPill, {backgroundColor: Colors.tealBg}]}>
          <AppText variant="small" color={Colors.tealText}>{item.status} </AppText>
          <Icon family="Ionicons" name="checkmark" size={ms(12)} color={Colors.tealText} />
        </View>
      )}
      {item.statusNote && (
        <View style={[styles.statusPill, {backgroundColor: Colors.amberBg}]}>
          <AppText variant="small" color={Colors.amberText}>{item.statusNote}</AppText>
        </View>
      )}
    </View>
  );

  const renderCoreCard = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(4)}}>Core hospitalisation benefits</AppText>
      {coreItems.map((item, i) => renderBenefitRow(item, i, coreItems.length))}
    </View>
  );

  const renderPreExisting = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(6)}}>Pre-existing conditions</AppText>
      <View style={styles.greenHeader}>
        <Icon family="Ionicons" name="checkmark-circle" size={ms(16)} color={Colors.tealText} />
        <AppText variant="caption" color={Colors.tealText} style={{flex: 1}}>
          2-year waiting period completed \u00B7 All 3 covered
        </AppText>
      </View>
      {preExistingConditions.map((cond, i) => (
        <View key={i} style={[styles.progressRow, i < preExistingConditions.length - 1 && styles.rowBorder]}>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.textPrimary}>{cond.label}</AppText>
            <View style={styles.progressTrack}>
              <View style={styles.progressFill} />
            </View>
          </View>
          <View style={[styles.statusPill, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="small" color={Colors.tealText}>{cond.status} </AppText>
            <Icon family="Ionicons" name="checkmark" size={ms(12)} color={Colors.tealText} />
          </View>
        </View>
      ))}
      <View style={styles.greenBand}>
        <AppText variant="small" color={Colors.tealText}>
          All three pre-existing conditions have crossed the 2-year waiting period and are now fully covered under the policy.
        </AppText>
      </View>
    </View>
  );

  const renderConditionBenefits = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(4)}}>Benefits for your conditions</AppText>
      {conditionBenefits.map((item, i) => renderBenefitRow(item, i, conditionBenefits.length))}
    </View>
  );

  const renderNotCovered = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(4)}}>What is NOT covered</AppText>
      {notCoveredItems.map((item, i) => (
        <View key={i} style={[styles.benefitRow, i < notCoveredItems.length - 1 && styles.rowBorder]}>
          <View style={[styles.iconCircle, {backgroundColor: item.bg}]}>
            <Icon family="Ionicons" name={item.icon} size={ms(18)} color={item.color} />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={Colors.textPrimary}>{item.title}</AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
              {item.note}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  const renderAddonInsight = () => (
    <View style={styles.addonBox}>
      <Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.amberText} />
      <AppText variant="caption" color={Colors.amberText} style={{flex: 1}}>
        At renewal: consider OPD rider, Critical illness top-up, Super top-up to cover gaps identified above.
      </AppText>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderBlueInsight()}
      {renderCoreCard()}
      {renderPreExisting()}
      {renderConditionBenefits()}
      {renderNotCovered()}
      {renderAddonInsight()}
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
    borderRadius: ms(11),
    backgroundColor: Colors.blueBg,
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
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    gap: s(10),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  iconCircle: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(8),
    paddingVertical: vs(3),
    borderRadius: ms(10),
  },
  greenHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    backgroundColor: Colors.tealBg,
    padding: ms(10),
    borderRadius: ms(10),
    marginBottom: vs(6),
  },
  progressRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    gap: s(10),
  },
  progressTrack: {
    height: vs(5),
    backgroundColor: Colors.background,
    borderRadius: ms(3),
    overflow: 'hidden',
    marginTop: vs(4),
  },
  progressFill: {
    width: '100%',
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: ms(3),
  },
  greenBand: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(10),
    padding: ms(10),
    marginTop: vs(4),
  },
  addonBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    padding: ms(12),
    borderRadius: ms(11),
    backgroundColor: Colors.amberBg,
    marginBottom: vs(10),
  },
});

export default InsBenefitsTab;
