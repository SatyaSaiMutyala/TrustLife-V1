import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const certificateRows = [
  {label: 'Patient name', value: 'Priya Reddy'},
  {label: 'DOB', value: '14 Aug 1987 \u00B7 38F'},
  {label: 'ABHA Health ID', value: 'UHI-9823-HYD-2021'},
  {label: 'Vaccine', value: 'Fluarix Tetra (Quadrivalent)'},
  {label: 'Manufacturer', value: 'GlaxoSmithKline Biologicals'},
  {label: 'Batch', value: 'FT25-HYD-441-B2'},
  {label: 'Date administered', value: '10 September 2025'},
  {label: 'Facility', value: 'Kamineni Hospital \u00B7 Hyderabad'},
  {label: 'Administered by', value: 'Dr. Sarita Menon \u00B7 MBBS MD'},
  {label: 'Valid until', value: 'September 2026', valueColor: Colors.tealText},
];

const documentRows = [
  {
    icon: 'document-text-outline',
    iconBg: '#EAF3DE',
    iconColor: '#4A7C23',
    title: 'Vaccination certificate \u00B7 PDF',
    subtitle: 'ABDM verified \u00B7 124 KB',
    pillLabel: 'Available',
    pillBg: Colors.tealBg,
    pillColor: Colors.tealText,
  },
  {
    icon: 'download-outline',
    iconBg: Colors.blueBg,
    iconColor: Colors.blueText,
    title: 'Hospital vaccination record',
    subtitle: 'Kamineni Hospital \u00B7 Scanned',
    pillLabel: 'Available',
    pillBg: Colors.tealBg,
    pillColor: Colors.tealText,
  },
];

const VaxCertificateTab = () => {
  const renderCertificate = () => (
    <View style={styles.certCard}>
      {/* Header */}
      <View style={styles.certHeader}>
        <View style={{flex: 1}}>
          <AppText variant="bodyBold" color={Colors.primary}>TrustLife Health</AppText>
          <AppText variant="small" color={Colors.textSecondary}>ABDM {'\u00B7'} NHA verified</AppText>
        </View>
        <View style={styles.verifiedBadge}>
          <AppText variant="small" color={Colors.white}>ABDM Verified</AppText>
        </View>
      </View>

      {/* Title */}
      <AppText variant="bodyBold" style={styles.certTitle}>
        Vaccination Certificate {'\u2013'} Influenza
      </AppText>

      {/* Data rows */}
      {certificateRows.map((row, i) => (
        <View key={i} style={styles.dataRow}>
          <AppText variant="caption" color={Colors.textTertiary} style={{flex: 1}}>
            {row.label}
          </AppText>
          <AppText
            variant="bodyBold"
            color={row.valueColor || Colors.textPrimary}
            style={styles.dataValue}>
            {row.value}
          </AppText>
        </View>
      ))}

      {/* QR placeholder */}
      <View style={styles.qrBox}>
        <Icon family="Ionicons" name="qr-code-outline" size={ms(36)} color={Colors.lightGreen} />
        <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(6)}}>
          Scan to verify
        </AppText>
      </View>

      {/* Footer */}
      <View style={styles.certFooter}>
        <AppText variant="small" color={Colors.white} style={{flex: 1}}>
          Digitally signed {'\u00B7'} TrustLife v3.2
        </AppText>
        <AppText variant="small" color={Colors.lightGreen}>Authentic</AppText>
      </View>
    </View>
  );

  const renderActions = () => (
    <View style={styles.actionsSection}>
      {/* Download button */}
      <TouchableOpacity style={styles.btnPrimary} activeOpacity={0.7}>
        <AppText variant="bodyBold" color={Colors.white}>Download certificate PDF</AppText>
      </TouchableOpacity>

      {/* Share button */}
      <TouchableOpacity style={styles.btnOutline} activeOpacity={0.7}>
        <AppText variant="bodyBold" color={Colors.primary}>Share via WhatsApp</AppText>
      </TouchableOpacity>

      {/* Sync button */}
      <TouchableOpacity style={styles.btnGhost} activeOpacity={0.7}>
        <Icon family="Ionicons" name="cloud-upload-outline" size={ms(16)} color={Colors.textSecondary} />
        <AppText variant="body" color={Colors.textSecondary} style={{marginLeft: s(6)}}>
          Sync to ABDM Health Account
        </AppText>
      </TouchableOpacity>
    </View>
  );

  const renderInsight = () => (
    <View style={[styles.insightBox, {backgroundColor: Colors.tealBg}]}>
      <Icon family="Ionicons" name="shield-checkmark-outline" size={ms(16)} color={Colors.tealText} />
      <AppText variant="caption" color={Colors.tealText} style={{flex: 1}}>
        Annual influenza vaccination contributes to your Health Performance Score (+8 pts). Maintaining up-to-date vaccinations improves insurance wellness benefits.
      </AppText>
    </View>
  );

  const renderDocuments = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={styles.cardTitle}>Documents</AppText>

      {documentRows.map((doc, i) => (
        <View
          key={i}
          style={[
            styles.docRow,
            i < documentRows.length - 1 && styles.docRowBorder,
          ]}>
          <View style={[styles.docIcon, {backgroundColor: doc.iconBg}]}>
            <Icon family="Ionicons" name={doc.icon} size={ms(16)} color={doc.iconColor} />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold">{doc.title}</AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
              {doc.subtitle}
            </AppText>
          </View>
          <View style={[styles.pill, {backgroundColor: doc.pillBg}]}>
            <AppText variant="small" color={doc.pillColor}>{doc.pillLabel}</AppText>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderCertificate()}
      {renderActions()}
      {renderInsight()}
      {renderDocuments()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  /* Certificate card */
  certCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    borderWidth: 2,
    borderColor: Colors.primary,
    padding: ms(16),
    marginBottom: vs(10),
    overflow: 'hidden',
  },
  certHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  verifiedBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: ms(10),
    paddingVertical: vs(4),
    borderRadius: ms(8),
  },
  certTitle: {
    marginBottom: vs(12),
  },
  dataRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(5),
  },
  dataValue: {
    flex: 1.2,
    textAlign: 'right',
  },
  qrBox: {
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'center',
    width: ms(100),
    height: ms(100),
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.lightGreen,
    borderRadius: ms(12),
    marginTop: vs(14),
    marginBottom: vs(14),
  },
  certFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ms(9),
    paddingHorizontal: ms(12),
    paddingVertical: vs(8),
  },
  /* Action buttons */
  actionsSection: {
    marginBottom: vs(10),
    gap: vs(8),
  },
  btnPrimary: {
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(13),
    alignItems: 'center',
  },
  btnOutline: {
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(13),
    alignItems: 'center',
  },
  btnGhost: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: BORDER,
    borderRadius: ms(12),
    paddingVertical: vs(13),
  },
  /* Insight */
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    padding: ms(12),
    borderRadius: ms(12),
    marginBottom: vs(10),
  },
  /* General card */
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
  /* Documents */
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  docRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  docIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  pill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
});

export default VaxCertificateTab;
