import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

/* ─── Data ─── */

const sections = [
  {
    title: 'Glucose / Diabetes',
    rows: [
      {test: 'HbA1c', result: '7.8%', resultColor: Colors.redText, ref: '< 6.5%', status: 'High \u2191', statusBg: Colors.redBg, statusColor: Colors.redText},
      {test: 'Fasting Plasma Glucose', result: '8.4 mmol/L', resultColor: Colors.redText, ref: '3.9 -- 5.6', status: 'High \u2191', statusBg: Colors.redBg, statusColor: Colors.redText},
      {test: 'Estimated Avg Glucose', result: '11.0 mmol/L', resultColor: Colors.redText, ref: '< 7.8', status: 'High', statusBg: Colors.redBg, statusColor: Colors.redText},
    ],
  },
  {
    title: 'Lipid Profile',
    rows: [
      {test: 'Total Cholesterol', result: '194 mg/dL', resultColor: Colors.tealText, ref: '< 200', status: 'Normal', statusBg: Colors.tealBg, statusColor: Colors.tealText},
      {test: 'LDL Cholesterol', result: '118 mg/dL', resultColor: Colors.tealText, ref: '< 130', status: 'Normal \u2713', statusBg: Colors.tealBg, statusColor: Colors.tealText},
      {test: 'HDL Cholesterol', result: '48 mg/dL', resultColor: Colors.amberText, ref: '> 50', status: 'Low border', statusBg: Colors.amberBg, statusColor: Colors.amberText},
      {test: 'Triglycerides', result: '162 mg/dL', resultColor: Colors.amberText, ref: '< 150', status: 'Mild \u2191', statusBg: Colors.amberBg, statusColor: Colors.amberText},
      {test: 'Non-HDL Cholesterol', result: '146 mg/dL', resultColor: Colors.tealText, ref: '< 160', status: 'Normal', statusBg: Colors.tealBg, statusColor: Colors.tealText},
    ],
  },
  {
    title: 'Renal Function',
    rows: [
      {test: 'eGFR', result: '72 mL/min', resultColor: Colors.tealText, ref: '> 60', status: 'G2 stable', statusBg: Colors.tealBg, statusColor: Colors.tealText},
      {test: 'Creatinine', result: '0.84 mg/dL', resultColor: Colors.tealText, ref: '0.6 -- 1.2', status: 'Normal', statusBg: Colors.tealBg, statusColor: Colors.tealText},
      {test: 'BUN', result: '14 mg/dL', resultColor: Colors.tealText, ref: '7 -- 20', status: 'Normal', statusBg: Colors.tealBg, statusColor: Colors.tealText},
      {test: 'ACR', result: '18 mg/g', resultColor: Colors.tealText, ref: '< 30', status: 'Normal', statusBg: Colors.tealBg, statusColor: Colors.tealText},
    ],
  },
  {
    title: 'CBC',
    rows: [
      {test: 'Haemoglobin', result: '11.8 g/dL', resultColor: Colors.amberText, ref: '12.0 -- 15.5', status: 'Low \u2193', statusBg: Colors.amberBg, statusColor: Colors.amberText},
      {test: 'WBC', result: '6.2 x10\u00B3', resultColor: Colors.tealText, ref: '4.0 -- 11.0', status: 'Normal', statusBg: Colors.tealBg, statusColor: Colors.tealText},
      {test: 'Platelets', result: '224 x10\u00B3', resultColor: Colors.tealText, ref: '150 -- 400', status: 'Normal', statusBg: Colors.tealBg, statusColor: Colors.tealText},
      {test: 'MCV', result: '88 fL', resultColor: Colors.tealText, ref: '80 -- 100', status: 'Normal', statusBg: Colors.tealBg, statusColor: Colors.tealText},
    ],
  },
];

/* ─── Component ─── */

const LabReportTraditionalView = () => {
  const renderHeader = () => (
    <View style={styles.card}>
      <View style={styles.reportHeader}>
        <AppText variant="bodyBold">Apollo Diagnostics</AppText>
        <AppText variant="small" color={Colors.textSecondary}>
          NABL Accredited  {'\u00B7'}  CAP Certified
        </AppText>
      </View>

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
          <AppText variant="caption">3 Mar 2026</AppText>
        </View>
        <View style={styles.infoRow}>
          <AppText variant="caption" color={Colors.textSecondary}>
            Ref No.
          </AppText>
          <AppText variant="caption">APL-2026-03-4821</AppText>
        </View>
        <View style={styles.infoRow}>
          <AppText variant="caption" color={Colors.textSecondary}>
            Fasting
          </AppText>
          <AppText variant="caption">12 h</AppText>
        </View>
        <View style={styles.infoRow}>
          <AppText variant="caption" color={Colors.textSecondary}>
            Referred by
          </AppText>
          <AppText variant="caption">Dr. Suresh Rao</AppText>
        </View>
        <View style={styles.infoRow}>
          <AppText variant="caption" color={Colors.textSecondary}>
            Lab
          </AppText>
          <AppText variant="caption">Apollo Diagnostics, Jubilee Hills</AppText>
        </View>
      </View>
    </View>
  );

  const renderTableHeader = () => (
    <View style={[styles.tableRow, styles.tableHeaderRow]}>
      <AppText
        variant="small"
        color={Colors.textSecondary}
        style={{flex: 1}}>
        Test
      </AppText>
      <AppText
        variant="small"
        color={Colors.textSecondary}
        style={{width: s(70), textAlign: 'center'}}>
        Result
      </AppText>
      <AppText
        variant="small"
        color={Colors.textSecondary}
        style={{width: s(60), textAlign: 'center'}}>
        Ref.
      </AppText>
      <AppText
        variant="small"
        color={Colors.textSecondary}
        style={{width: s(68), textAlign: 'right'}}>
        Status
      </AppText>
    </View>
  );

  const renderSections = () =>
    sections.map((section, si) => (
      <View key={si} style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(6)}}>
          {section.title}
        </AppText>
        {renderTableHeader()}
        {section.rows.map((row, ri) => (
          <View
            key={ri}
            style={[
              styles.tableRow,
              ri < section.rows.length - 1 && styles.rowBorder,
            ]}>
            <AppText variant="caption" style={{flex: 1}} numberOfLines={1}>
              {row.test}
            </AppText>
            <AppText
              variant="bodyBold"
              color={row.resultColor}
              style={{width: s(70), textAlign: 'center', fontSize: ms(11)}}>
              {row.result}
            </AppText>
            <AppText
              variant="small"
              color={Colors.textTertiary}
              style={{width: s(60), textAlign: 'center'}}>
              {row.ref}
            </AppText>
            <View style={{width: s(68), alignItems: 'flex-end'}}>
              <View
                style={[
                  styles.statusPill,
                  {backgroundColor: row.statusBg},
                ]}>
                <AppText variant="small" color={row.statusColor}>
                  {row.status}
                </AppText>
              </View>
            </View>
          </View>
        ))}
      </View>
    ));

  const renderFooter = () => (
    <View style={styles.card}>
      <View style={styles.footerContent}>
        <AppText variant="caption" color={Colors.textSecondary}>
          Report generated: 3 Mar 2026, 14:32 IST
        </AppText>
        <AppText
          variant="caption"
          color={Colors.textSecondary}
          style={{marginTop: vs(4)}}>
          Dr. Anjali Mehta, MD Pathology
        </AppText>
        <AppText variant="small" color={Colors.textTertiary}>
          NABL No. MC-4291
        </AppText>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {renderHeader()}
      {renderSections()}
      {renderFooter()}
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
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(7),
  },
  tableHeaderRow: {
    borderBottomWidth: 1,
    borderBottomColor: BORDER,
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  statusPill: {
    paddingHorizontal: ms(6),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  footerContent: {
    alignItems: 'center',
  },
});

export default LabReportTraditionalView;
