import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const adminDetails = [
  {
    label: 'Date',
    value: '10 Sep 2025',
    detail: 'Wednesday \u00B7 10:42 AM',
    icon: 'calendar-outline',
  },
  {
    label: 'Facility',
    value: 'Kamineni Hospital',
    detail: 'Hyderabad \u00B7 Ameerpet',
    icon: 'business-outline',
  },
  {
    label: 'Administered by',
    value: 'Dr. Sarita Menon',
    detail: 'General Physician \u00B7 MBBS, MD',
    icon: 'person-outline',
  },
  {
    label: 'Vaccine',
    value: 'Fluarix Tetra',
    detail: 'GlaxoSmithKline \u00B7 Quadrivalent inactivated',
    icon: 'medkit-outline',
  },
  {
    label: 'Dose',
    value: '0.5 mL',
    detail: 'Single dose \u00B7 Standard adult',
    icon: 'eyedrop-outline',
  },
  {
    label: 'Route',
    value: 'Intramuscular (IM)',
    detail: 'Deltoid muscle \u00B7 Left arm',
    icon: 'fitness-outline',
  },
  {
    label: 'Patient',
    value: '37 years \u00B7 Female',
    detail: 'Standard adult dosing',
    icon: 'people-outline',
  },
];

const coldChainRows = [
  {label: 'Batch number', value: 'FT25-HYD-441-B2'},
  {label: 'Manufacture date', value: 'Jun 2025'},
  {label: 'Expiry', value: 'Jun 2026'},
  {label: 'Storage', value: '+2\u00B0C to +8\u00B0C'},
  {label: 'Cold chain', value: 'Verified', isGreen: true},
];

const checklistItems = [
  'No fever or acute illness at time of vaccination',
  'No egg allergy reported',
  'Penicillin allergy declared and noted',
  'Current medications reviewed by physician',
  '15-minute post-vaccination observation completed',
];

const VaxAdministrationTab = () => {
  const renderAdminDetails = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={styles.cardTitle}>
        Administration details
      </AppText>
      {adminDetails.map((row, i) => (
        <View
          key={i}
          style={[
            styles.detailRow,
            i < adminDetails.length - 1 && styles.rowBorder,
          ]}>
          <View style={styles.detailLeft}>
            <View style={[styles.detailIcon, {backgroundColor: Colors.background}]}>
              <Icon family="Ionicons" name={row.icon} size={ms(15)} color={Colors.primary} />
            </View>
            <AppText variant="caption" color={Colors.textSecondary}>{row.label}</AppText>
          </View>
          <View style={styles.detailRight}>
            <AppText variant="bodyBold" style={{textAlign: 'right'}}>{row.value}</AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'right', marginTop: vs(1)}}>
              {row.detail}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  const renderInjectionSite = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={styles.cardTitle}>
        Injection site
      </AppText>
      <View style={styles.siteRow}>
        <View style={styles.siteIconWrap}>
          <Icon family="Ionicons" name="location-outline" size={ms(20)} color={Colors.white} />
        </View>
        <View style={{flex: 1}}>
          <AppText variant="bodyBold" color={Colors.primary}>Left deltoid muscle</AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(3)}}>
            Upper outer arm, approximately 2\u20133 fingerbreadths below the acromion process. Standard intramuscular injection site for adult vaccinations.
          </AppText>
          <View style={[styles.noteBox, {backgroundColor: Colors.amberBg, marginTop: vs(8)}]}>
            <Icon family="Ionicons" name="information-circle-outline" size={ms(14)} color={Colors.amberText} />
            <AppText variant="small" color={Colors.amberText} style={{flex: 1}}>
              Soreness normal 24\u201348h
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );

  const renderBatchDetails = () => {
    // Generate decorative barcode lines
    const barcodeWidths = [2, 1, 3, 1, 2, 1, 1, 3, 2, 1, 1, 2, 3, 1, 2, 1, 3, 1, 1, 2, 1, 3, 2, 1, 1, 2, 1, 3, 1, 2];
    return (
      <View style={styles.batchCard}>
        {/* Barcode visual */}
        <View style={styles.barcodeRow}>
          {barcodeWidths.map((w, i) => (
            <View
              key={i}
              style={{
                width: s(w),
                height: vs(40),
                backgroundColor: i % 3 === 0 ? 'rgba(255,255,255,0.8)' : 'rgba(255,255,255,0.3)',
                marginRight: s(1.5),
                borderRadius: 0.5,
              }}
            />
          ))}
        </View>
        {/* Batch number */}
        <AppText
          variant="bodyBold"
          color={Colors.lightGreen}
          style={{fontFamily: 'monospace', fontSize: ms(16), marginTop: vs(10), letterSpacing: s(2)}}>
          FT25-HYD-441-B2
        </AppText>
        <AppText variant="caption" color="rgba(255,255,255,0.5)" style={{marginTop: vs(4)}}>
          Batch number {'\u00B7'} Fluarix Tetra 2025\u201326
        </AppText>
      </View>
    );
  };

  const renderColdChain = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={styles.cardTitle}>
        Cold chain verification
      </AppText>
      {coldChainRows.map((row, i) => (
        <View
          key={i}
          style={[
            styles.coldRow,
            i < coldChainRows.length - 1 && styles.rowBorder,
          ]}>
          <AppText variant="caption" color={Colors.textSecondary}>{row.label}</AppText>
          {row.isGreen ? (
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(4)}}>
              <Icon family="Ionicons" name="checkmark-circle" size={ms(14)} color={Colors.tealText} />
              <AppText variant="bodyBold" color={Colors.tealText}>{row.value}</AppText>
            </View>
          ) : (
            <AppText variant="bodyBold">{row.value}</AppText>
          )}
        </View>
      ))}
    </View>
  );

  const renderChecklist = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={styles.cardTitle}>
        Pre-vaccination checklist
      </AppText>
      {checklistItems.map((item, i) => (
        <View
          key={i}
          style={[
            styles.checkRow,
            i < checklistItems.length - 1 && styles.rowBorder,
          ]}>
          <View style={[styles.checkIcon, {backgroundColor: Colors.tealBg}]}>
            <Icon family="Ionicons" name="checkmark-circle" size={ms(18)} color={Colors.tealText} />
          </View>
          <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1}}>
            {item}
          </AppText>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderAdminDetails()}
      {renderInjectionSite()}
      {renderBatchDetails()}
      {renderColdChain()}
      {renderChecklist()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
    marginBottom: vs(10),
  },
  cardTitle: {
    marginBottom: vs(10),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  detailLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  detailIcon: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailRight: {
    flex: 1,
    alignItems: 'flex-end',
    marginLeft: s(12),
  },
  siteRow: {
    flexDirection: 'row',
    gap: s(12),
    alignItems: 'flex-start',
  },
  siteIconWrap: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  noteBox: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    paddingHorizontal: ms(10),
    paddingVertical: vs(6),
    borderRadius: ms(8),
  },
  batchCard: {
    backgroundColor: '#1a1a1a',
    borderRadius: ms(14),
    padding: ms(16),
    marginBottom: vs(10),
    alignItems: 'center',
  },
  barcodeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  coldRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    paddingVertical: vs(10),
  },
  checkIcon: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default VaxAdministrationTab;
