import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';
const NAVY = Colors.primary;
const DARK_BG = Colors.primary;

const policyDocs = [
  {
    icon: 'document-text-outline',
    iconBg: Colors.tealBg,
    iconColor: NAVY,
    title: 'Policy document \u00B7 FY 2025\u201326',
    subtitle: 'Complete policy wording',
    meta: 'PDF \u00B7 2.8 MB \u00B7 Apr 2025',
  },
  {
    icon: 'list-outline',
    iconBg: Colors.tealBg,
    iconColor: NAVY,
    title: 'Schedule of benefits',
    subtitle: 'All procedures, sub-limits, exclusions',
    meta: 'PDF \u00B7 840 KB',
  },
  {
    icon: 'card-outline',
    iconBg: Colors.tealBg,
    iconColor: NAVY,
    title: 'E-card \u00B7 Health insurance card',
    subtitle: 'Show at hospital',
    meta: 'PDF \u00B7 180 KB \u00B7 Always valid',
  },
];

const claimDocs = [
  {
    icon: 'checkmark-circle',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    title: 'Claim settlement \u00B7 Apollo labs',
    subtitle: '\u20B9749 settled \u00B7 9 Mar 2026 \u00B7 #SH-2026-03-4412',
    meta: 'PDF \u00B7 124 KB',
  },
  {
    icon: 'time-outline',
    iconBg: Colors.amberBg,
    iconColor: Colors.amberText,
    title: 'Pending claim \u00B7 KIMS cardiology',
    subtitle: '\u20B9800 \u00B7 Day 42 \u00B7 #SH-2026-01-4821',
    meta: 'PDF \u00B7 96 KB',
  },
  {
    icon: 'checkmark-circle',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    title: 'Claim settlement \u00B7 Flu vaccine',
    subtitle: '\u20B9450 settled \u00B7 18 Sep 2025',
    meta: 'PDF \u00B7 88 KB',
  },
];

const taxDocs = [
  {
    icon: 'receipt-outline',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    title: 'Section 80D certificate',
    subtitle: '\u20B913,000 deduction \u00B7 \u20B93,900 saving',
    meta: 'PDF \u00B7 212 KB \u00B7 Ready',
    metaHighlight: true,
  },
  {
    icon: 'card-outline',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    title: 'Premium payment receipt',
    subtitle: '\u20B910,060 paid \u00B7 1 Apr 2025 \u00B7 UPI',
    meta: 'PDF \u00B7 76 KB',
  },
];

const InsDocumentsTab = () => {
  const renderDocRow = (doc, i, isLast) => (
    <TouchableOpacity
      key={i}
      style={[styles.docRow, !isLast && styles.rowBorder]}
      activeOpacity={0.7}>
      <View style={[styles.docIcon, {backgroundColor: doc.iconBg}]}>
        <Icon family="Ionicons" name={doc.icon} size={18} color={doc.iconColor} />
      </View>
      <View style={{flex: 1}}>
        <AppText variant="bodyBold">{doc.title}</AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
          {doc.subtitle}
        </AppText>
        <AppText
          variant="small"
          color={doc.metaHighlight ? Colors.tealText : Colors.textTertiary}
          style={{marginTop: vs(2)}}>
          {doc.meta}
        </AppText>
      </View>
      <Icon family="Ionicons" name="chevron-forward" size={18} color={Colors.textTertiary} />
    </TouchableOpacity>
  );

  const renderSection = (title, docs) => (
    <View>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
        {title}
      </AppText>
      <View style={styles.card}>
        {docs.map((doc, i) => renderDocRow(doc, i, i === docs.length - 1))}
      </View>
    </View>
  );

  const renderEmergencyCard = () => (
    <View style={styles.emergencyCard}>
      <AppText variant="small" color="rgba(255,255,255,0.4)">
        Insurance quick access card
      </AppText>
      <AppText variant="bodyBold" color={Colors.white} style={{marginTop: vs(6)}}>
        Star Health & Allied Insurance
      </AppText>
      <AppText variant="caption" color="rgba(255,255,255,0.7)" style={{marginTop: vs(4)}}>
        Policy: SH-FL-2024-HYD-38271 {'\u00B7'} Family Floater {'\u00B7'} {'\u20B9'}5L
      </AppText>

      <View style={styles.phoneRow}>
        <View style={{flex: 1}}>
          <AppText variant="small" color="rgba(255,255,255,0.5)">Cashless</AppText>
          <AppText variant="bodyBold" color={Colors.lightGreen} style={{marginTop: vs(2)}}>
            1800-425-2255
          </AppText>
        </View>
        <View style={{flex: 1}}>
          <AppText variant="small" color="rgba(255,255,255,0.5)">Claims</AppText>
          <AppText variant="bodyBold" color={Colors.lightGreen} style={{marginTop: vs(2)}}>
            044-28288800
          </AppText>
        </View>
      </View>

      <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginTop: vs(8)}}>
        Active till 31 Mar 2026
      </AppText>
    </View>
  );

  const renderActions = () => (
    <View style={{marginBottom: vs(12)}}>
      <TouchableOpacity style={styles.navyButton} activeOpacity={0.8}>
        <AppText variant="bodyBold" color={Colors.white}>
          Download all documents (zip)
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.outlineButton} activeOpacity={0.8}>
        <AppText variant="bodyBold" color={NAVY}>
          Share e-card via WhatsApp
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.ghostButton} activeOpacity={0.8}>
        <Icon family="Ionicons" name="cloud-upload-outline" size={18} color={NAVY} />
        <AppText variant="bodyBold" color={NAVY}>
          Link to ABDM health account
        </AppText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderSection('Policy documents', policyDocs)}
      {renderSection('Claim documents', claimDocs)}
      {renderSection('Tax documents', taxDocs)}
      {renderEmergencyCard()}
      {renderActions()}
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
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    gap: s(10),
  },
  docIcon: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  emergencyCard: {
    backgroundColor: DARK_BG,
    borderRadius: ms(14),
    padding: ms(16),
    marginBottom: vs(12),
  },
  phoneRow: {
    flexDirection: 'row',
    marginTop: vs(12),
    gap: s(12),
  },
  navyButton: {
    backgroundColor: NAVY,
    borderRadius: ms(10),
    paddingVertical: vs(12),
    alignItems: 'center',
    marginBottom: vs(8),
  },
  outlineButton: {
    borderWidth: 1.5,
    borderColor: NAVY,
    borderRadius: ms(10),
    paddingVertical: vs(12),
    alignItems: 'center',
    marginBottom: vs(8),
  },
  ghostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(6),
    paddingVertical: vs(12),
  },
});

export default InsDocumentsTab;
