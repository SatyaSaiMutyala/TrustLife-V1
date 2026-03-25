import React, {useState} from 'react';
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
const BG_SECONDARY = Colors.backgroundSecondary || '#F3F4F6';

const insights = [
  {
    icon: 'heart-outline',
    title: 'Heart size normal',
    detail: 'CTR 0.47 -- well within the healthy range (<0.5)',
  },
  {
    icon: 'leaf-outline',
    title: 'Lungs clear bilaterally',
    detail: 'No infiltrates, masses, or effusion detected',
  },
  {
    icon: 'body-outline',
    title: 'Normal mediastinum',
    detail: 'Trachea central, mediastinal contours unremarkable',
  },
];

const actions = [
  {
    status: 'Done',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
    label: 'Baseline established',
    icon: 'checkmark-circle-outline',
  },
  {
    status: 'Done',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
    label: 'Cardiac cause excluded',
    icon: 'checkmark-circle-outline',
  },
  {
    status: 'Watch',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
    label: 'Repeat annually',
    icon: 'time-outline',
  },
];

const technicalRows = [
  {label: 'Projection', value: 'PA erect'},
  {label: 'Exposure', value: 'Adequate (thoracic vertebrae visible)'},
  {label: 'Rotation', value: 'None (spinous processes midline)'},
  {label: 'Inspiration', value: '10 posterior ribs visible'},
];

const findingsRows = [
  {label: 'Heart size', value: 'Normal'},
  {label: 'Cardiac silhouette', value: 'Normal'},
  {label: 'Aortic knuckle', value: 'Normal'},
  {label: 'Lung fields (R)', value: 'Normal'},
  {label: 'Lung fields (L)', value: 'Normal'},
  {label: 'Hila', value: 'Normal'},
  {label: 'Costophrenic angles', value: 'Normal'},
  {label: 'Diaphragm', value: 'Normal'},
  {label: 'Bony thorax', value: 'Normal'},
];

const XraySummaryTab = () => {
  const [viewMode, setViewMode] = useState('smart');

  const renderToggle = () => (
    <View style={styles.toggleRow}>
      <TouchableOpacity
        style={[
          styles.toggleBtn,
          viewMode === 'smart' && styles.toggleBtnActive,
        ]}
        onPress={() => setViewMode('smart')}>
        <AppText
          variant="caption"
          color={viewMode === 'smart' ? Colors.white : Colors.textSecondary}
          style={{fontWeight: viewMode === 'smart' ? '700' : '500'}}>
          Smart
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity
        style={[
          styles.toggleBtn,
          viewMode === 'traditional' && styles.toggleBtnActive,
        ]}
        onPress={() => setViewMode('traditional')}>
        <AppText
          variant="caption"
          color={
            viewMode === 'traditional' ? Colors.white : Colors.textSecondary
          }
          style={{fontWeight: viewMode === 'traditional' ? '700' : '500'}}>
          Traditional
        </AppText>
      </TouchableOpacity>
    </View>
  );

  /* ─── Smart view ─── */

  const renderImagePreview = () => (
    <View style={styles.imageCard}>
      <View style={styles.imageCenter}>
        <Icon
          family="Ionicons"
          name="scan-outline"
          size={ms(48)}
          color="rgba(255,255,255,0.5)"
        />
        <AppText
          variant="caption"
          color="rgba(255,255,255,0.7)"
          style={{marginTop: vs(8)}}>
          Chest X-ray PA view
        </AppText>
        <AppText variant="small" color="rgba(255,255,255,0.5)">
          18 Sep 2025
        </AppText>
      </View>
      <View style={styles.imageMeta}>
        <AppText variant="small" color="rgba(255,255,255,0.6)">
          PA erect
        </AppText>
        <AppText variant="small" color="rgba(255,255,255,0.6)">
          100 kVp
        </AppText>
        <AppText variant="small" color="rgba(255,255,255,0.6)">
          Yashoda Hospitals
        </AppText>
      </View>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionBtnRow}>
      <TouchableOpacity style={styles.primaryBtn}>
        <Icon
          family="Ionicons"
          name="expand-outline"
          size={ms(14)}
          color={Colors.white}
        />
        <AppText variant="caption" color={Colors.white} style={{fontWeight: '600'}}>
          View full DICOM
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.outlineBtn}>
        <Icon
          family="Ionicons"
          name="git-compare-outline"
          size={ms(14)}
          color={Colors.primary}
        />
        <AppText
          variant="caption"
          color={Colors.primary}
          style={{fontWeight: '600'}}>
          Compare
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.outlineBtn}>
        <Icon
          family="Ionicons"
          name="pencil-outline"
          size={ms(14)}
          color={Colors.primary}
        />
        <AppText
          variant="caption"
          color={Colors.primary}
          style={{fontWeight: '600'}}>
          Annotate
        </AppText>
      </TouchableOpacity>
    </View>
  );

  const renderNarrative = () => (
    <View style={styles.narrativeBanner}>
      <AppText variant="bodyBold" color={Colors.white}>
        Chest X-ray -- 18 Sep 2025
      </AppText>
      <AppText
        variant="caption"
        color="rgba(255,255,255,0.85)"
        style={{marginTop: vs(4)}}>
        All findings normal. Heart size, lung fields, mediastinum, pleura, and
        bony thorax are unremarkable. No active cardiopulmonary disease.
      </AppText>
    </View>
  );

  const renderInsights = () => (
    <View style={{gap: vs(8)}}>
      {insights.map((item, i) => (
        <View key={i} style={styles.insightCard}>
          <View style={styles.insightIcon}>
            <Icon
              family="Ionicons"
              name={item.icon}
              size={ms(18)}
              color={Colors.tealText}
            />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={Colors.tealText}>
              {item.title}
            </AppText>
            <AppText
              variant="caption"
              color={Colors.tealText}
              style={{marginTop: vs(2), opacity: 0.85}}>
              {item.detail}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  const renderActions = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
        Actions
      </AppText>
      {actions.map((item, i) => (
        <View
          key={i}
          style={[
            styles.actionRow,
            i < actions.length - 1 && styles.rowBorder,
          ]}>
          <View style={[styles.statusPill, {backgroundColor: item.statusBg}]}>
            <AppText variant="small" color={item.statusColor}>
              {item.status}
            </AppText>
          </View>
          <AppText variant="caption" style={{flex: 1, marginLeft: s(8)}}>
            {item.label}
          </AppText>
          <Icon
            family="Ionicons"
            name={item.icon}
            size={ms(16)}
            color={item.statusColor}
          />
        </View>
      ))}
    </View>
  );

  const renderSmartView = () => (
    <>
      {renderImagePreview()}
      {renderActionButtons()}
      {renderNarrative()}
      {renderInsights()}
      {renderActions()}
    </>
  );

  /* ─── Traditional view ─── */

  const renderTraditionalView = () => (
    <View style={styles.card}>
      {/* Header */}
      <View style={styles.reportHeader}>
        <AppText variant="bodyBold">Yashoda Hospitals</AppText>
        <AppText variant="caption" color={Colors.textSecondary}>
          Somajiguda, Hyderabad
        </AppText>
      </View>

      {/* Patient info grid */}
      <View style={[styles.infoGrid, {marginTop: vs(10)}]}>
        <View style={styles.infoRow}>
          <AppText variant="caption" color={Colors.textSecondary}>
            Patient
          </AppText>
          <AppText variant="caption">Mrs. Kavitha Reddy</AppText>
        </View>
        <View style={styles.infoRow}>
          <AppText variant="caption" color={Colors.textSecondary}>
            Date
          </AppText>
          <AppText variant="caption">18 Sep 2025</AppText>
        </View>
        <View style={styles.infoRow}>
          <AppText variant="caption" color={Colors.textSecondary}>
            Ref. physician
          </AppText>
          <AppText variant="caption">Dr. Suresh Rao</AppText>
        </View>
      </View>

      {/* Technical section */}
      <View style={styles.sectionDivider}>
        <AppText variant="bodyBold" style={{marginBottom: vs(6)}}>
          Technical adequacy
        </AppText>
        {technicalRows.map((row, i) => (
          <View
            key={i}
            style={[
              styles.tableRow,
              i < technicalRows.length - 1 && styles.rowBorder,
            ]}>
            <AppText
              variant="caption"
              color={Colors.textSecondary}
              style={{width: s(90)}}>
              {row.label}
            </AppText>
            <AppText variant="caption" style={{flex: 1}}>
              {row.value}
            </AppText>
          </View>
        ))}
      </View>

      {/* Systematic findings */}
      <View style={styles.sectionDivider}>
        <AppText variant="bodyBold" style={{marginBottom: vs(6)}}>
          Systematic findings
        </AppText>
        <View style={[styles.tableRow, styles.tableHeader]}>
          <AppText
            variant="small"
            color={Colors.textSecondary}
            style={{flex: 1}}>
            Structure
          </AppText>
          <AppText
            variant="small"
            color={Colors.textSecondary}
            style={{width: s(70), textAlign: 'right'}}>
            Finding
          </AppText>
        </View>
        {findingsRows.map((row, i) => (
          <View
            key={i}
            style={[
              styles.tableRow,
              i < findingsRows.length - 1 && styles.rowBorder,
            ]}>
            <AppText variant="caption" style={{flex: 1}}>
              {row.label}
            </AppText>
            <AppText
              variant="caption"
              color={Colors.tealText}
              style={{width: s(70), textAlign: 'right'}}>
              Normal
            </AppText>
          </View>
        ))}
      </View>

      {/* Impression */}
      <View style={styles.sectionDivider}>
        <AppText variant="bodyBold" style={{marginBottom: vs(4)}}>
          Impression
        </AppText>
        <AppText variant="caption">
          Normal chest radiograph. No active cardiopulmonary disease.
        </AppText>
      </View>

      {/* Radiologist footer */}
      <View
        style={[
          styles.sectionDivider,
          {borderTopWidth: 1, borderTopColor: BORDER},
        ]}>
        <AppText variant="caption" color={Colors.textSecondary}>
          Dr. Lakshmi Narasimhan, MD Radiology
        </AppText>
        <AppText variant="small" color={Colors.textTertiary}>
          Yashoda Hospitals, Hyderabad
        </AppText>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {renderToggle()}
      {viewMode === 'smart' ? renderSmartView() : renderTraditionalView()}
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
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: BG_SECONDARY,
    borderRadius: ms(10),
    padding: ms(3),
  },
  toggleBtn: {
    flex: 1,
    paddingVertical: vs(6),
    alignItems: 'center',
    borderRadius: ms(8),
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  imageCard: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    padding: ms(16),
    alignItems: 'center',
  },
  imageCenter: {
    alignItems: 'center',
    paddingVertical: vs(20),
  },
  imageMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.2)',
    paddingTop: vs(8),
  },
  actionBtnRow: {
    flexDirection: 'row',
    gap: s(6),
  },
  primaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(4),
    backgroundColor: Colors.primary,
    paddingVertical: vs(10),
    borderRadius: ms(10),
  },
  outlineBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(4),
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingVertical: vs(10),
    borderRadius: ms(10),
  },
  narrativeBanner: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    padding: ms(14),
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(10),
    backgroundColor: Colors.tealBg,
    borderWidth: 0.5,
    borderColor: Colors.tealText,
    borderRadius: ms(12),
    padding: ms(12),
  },
  insightIcon: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  statusPill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  reportHeader: {
    alignItems: 'center',
    paddingBottom: vs(8),
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  infoGrid: {
    gap: vs(4),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  sectionDivider: {
    marginTop: vs(12),
    paddingTop: vs(8),
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(7),
  },
  tableHeader: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
});

export default XraySummaryTab;
