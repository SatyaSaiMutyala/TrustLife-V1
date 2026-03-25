import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const scanInfo = [
  {label: 'Facility', value: 'Yashoda Hospitals, Somajiguda', icon: 'business-outline'},
  {label: 'Report ref', value: 'YH-RAD-2025-09-4821', icon: 'document-text-outline'},
  {label: 'Scan date', value: '18 Sep 2025, 10:34 AM', icon: 'calendar-outline'},
  {label: 'Equipment', value: 'Siemens Ysio Max (DR)', icon: 'hardware-chip-outline'},
  {label: 'Radiologist', value: 'Dr. Lakshmi Narasimhan, MD', icon: 'person-outline'},
  {label: 'Files available', value: 'DICOM, PDF report', icon: 'folder-outline'},
];

const actionButtons = [
  {
    label: 'View DICOM',
    icon: 'expand-outline',
    variant: 'primary',
  },
  {
    label: 'Download PDF',
    icon: 'download-outline',
    variant: 'outline',
  },
  {
    label: 'Share with Dr. Suresh',
    icon: 'share-outline',
    variant: 'ghost',
  },
  {
    label: 'Sync ABDM',
    icon: 'sync-outline',
    variant: 'ghost',
  },
];

const XrayDetailsTab = () => {
  const renderScanInfo = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(6)}}>
        Scan information
      </AppText>
      {scanInfo.map((item, i) => (
        <View
          key={i}
          style={[
            styles.infoRow,
            i < scanInfo.length - 1 && styles.rowBorder,
          ]}>
          <View style={styles.infoIcon}>
            <Icon
              family="Ionicons"
              name={item.icon}
              size={ms(16)}
              color={Colors.primary}
            />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="small" color={Colors.textSecondary}>
              {item.label}
            </AppText>
            <AppText variant="caption" style={{marginTop: vs(1)}}>
              {item.value}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  const renderActions = () => (
    <View style={{gap: vs(8)}}>
      {actionButtons.map((btn, i) => {
        const isPrimary = btn.variant === 'primary';
        const isOutline = btn.variant === 'outline';
        const isGhost = btn.variant === 'ghost';

        return (
          <TouchableOpacity
            key={i}
            style={[
              styles.actionBtn,
              isPrimary && styles.actionBtnPrimary,
              isOutline && styles.actionBtnOutline,
              isGhost && styles.actionBtnGhost,
            ]}>
            <Icon
              family="Ionicons"
              name={btn.icon}
              size={ms(18)}
              color={isPrimary ? Colors.white : Colors.primary}
            />
            <AppText
              variant="bodyBold"
              color={isPrimary ? Colors.white : Colors.primary}
              style={{marginLeft: s(8)}}>
              {btn.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {renderScanInfo()}
      {renderActions()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: s(4),
    gap: vs(10),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    gap: s(10),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  infoIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(12),
    borderRadius: ms(12),
  },
  actionBtnPrimary: {
    backgroundColor: Colors.primary,
  },
  actionBtnOutline: {
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  actionBtnGhost: {
    backgroundColor: Colors.background,
  },
});

export default XrayDetailsTab;
