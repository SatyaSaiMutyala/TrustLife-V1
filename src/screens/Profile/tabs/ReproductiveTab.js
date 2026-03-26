import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../../components/shared/AppText';
import Colors from '../../../constants/colors';

/* ── data ──────────────────────────────────────────── */

const MENSTRUAL_FORM = [
  {label: 'Status', value: 'Regular'},
  {label: 'LMP', value: 'Feb 25, 2026'},
  {label: 'Cycle Length', value: '28 days'},
  {label: 'Duration', value: '4-5 days'},
  {label: 'Flow', value: 'Moderate'},
  {label: 'Dysmenorrhoea', value: 'Mild'},
];

const MENSTRUAL_CHIPS = [
  {label: 'PMS', type: 'warn'},
  {label: 'Bloating', type: 'warn'},
  {label: 'No endo', type: 'on'},
  {label: 'No PCOS', type: 'on'},
  {label: 'Fibroids', type: 'off'},
  {label: 'Spotting', type: 'off'},
];

const OB_STATS = [
  {label: 'Gravida', value: '3'},
  {label: 'Para', value: '3'},
  {label: 'Abortus', value: '0'},
  {label: 'C-sections', value: '2'},
];

const OB_TABLE = [
  {name: 'Riya', year: '2012', mode: 'NVD', weeks: '39 wk', weight: '3.1 kg', complications: 'None'},
  {name: 'Aryan', year: '2017', mode: 'LSCS', weeks: '38 wk', weight: '3.4 kg', complications: 'None'},
  {name: 'Zara', year: '2024', mode: 'LSCS', weeks: '37 wk', weight: '2.9 kg', complications: 'Mild GDM'},
];

const CONTRACEPTION_FORM = [
  {label: 'Method', value: 'Hormonal IUD (Mirena)'},
  {label: 'Since', value: 'Dec 2024'},
  {label: 'Review', value: 'Dec 2029'},
  {label: 'Goal', value: 'No further planned'},
];

const SCREENINGS = [
  {test: 'Pap smear', last: 'Jan 2025', result: 'Normal', next: 'Jan 2028'},
  {test: 'Mammogram', last: 'Not done', result: 'Scheduled', next: 'Age 40'},
  {test: 'Breast exam', last: 'Monthly', result: 'Normal', next: 'Ongoing'},
  {test: 'Pelvic USG', last: 'Nov 2024', result: 'Normal', next: 'As needed'},
  {test: 'GDM followup', last: 'Mar 2025', result: 'Normal', next: 'Annual'},
];

const HORMONAL_FORM = [
  {label: 'Menopausal Status', value: 'Pre-menopausal'},
  {label: 'HRT', value: 'N/A'},
  {label: 'Thyroid Impact', value: 'Monitored, no disruption'},
  {label: 'Breastfeeding', value: 'Partial (Zara)'},
];

const chipStyle = type => {
  if (type === 'warn') return {bg: '#FDF3E7', color: '#B5600E'};
  if (type === 'on') return {bg: Colors.tealBg, color: Colors.accent};
  return {bg: '#F5F3EF', color: '#A09E9A'};
};

/* ── sub-components ────────────────────────────────── */

const FormRow = ({item, last}) => (
  <View style={[styles.formRow, !last && styles.formRowBorder]}>
    <AppText variant="caption" color="#A09E9A" style={styles.formLabel}>{item.label}</AppText>
    <AppText variant="body" style={styles.formValue}>{item.value}</AppText>
  </View>
);

/* ── main component ────────────────────────────────── */

const ReproductiveTab = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Menstrual & Cycle Health */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>Menstrual & Cycle Health</AppText>
        </View>
        <View style={styles.cardBody}>
          {MENSTRUAL_FORM.map((item, i) => (
            <FormRow key={i} item={item} last={i === MENSTRUAL_FORM.length - 1} />
          ))}
          <View style={styles.chipsWrap}>
            {MENSTRUAL_CHIPS.map((chip, i) => {
              const cs = chipStyle(chip.type);
              return (
                <View key={i} style={[styles.chip, {backgroundColor: cs.bg}]}>
                  <AppText variant="small" color={cs.color} style={styles.chipText}>{chip.label}</AppText>
                </View>
              );
            })}
          </View>
        </View>
      </View>

      {/* Obstetric History */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>Obstetric History</AppText>
        </View>
        <View style={styles.cardBody}>
          {/* Stat cards */}
          <View style={styles.statGrid}>
            {OB_STATS.map((stat, i) => (
              <View key={i} style={styles.statCard}>
                <AppText variant="header" style={styles.statValue}>{stat.value}</AppText>
                <AppText variant="small" color="#A09E9A" style={styles.statLabel}>
                  {stat.label.toUpperCase()}
                </AppText>
              </View>
            ))}
          </View>

          {/* Table header */}
          <View style={styles.tableHeader}>
            <AppText variant="small" color="#A09E9A" style={[styles.thCell, {flex: 1.2}]}>NAME</AppText>
            <AppText variant="small" color="#A09E9A" style={styles.thCell}>YEAR</AppText>
            <AppText variant="small" color="#A09E9A" style={styles.thCell}>MODE</AppText>
            <AppText variant="small" color="#A09E9A" style={styles.thCell}>WKS</AppText>
            <AppText variant="small" color="#A09E9A" style={styles.thCell}>WT</AppText>
            <AppText variant="small" color="#A09E9A" style={[styles.thCell, {flex: 1.3}]}>COMP</AppText>
          </View>
          {OB_TABLE.map((row, i) => (
            <View key={i} style={[styles.tableRow, i === OB_TABLE.length - 1 && styles.noBorder]}>
              <AppText variant="caption" style={[styles.tdCell, {flex: 1.2}]}>{row.name}</AppText>
              <AppText variant="caption" style={styles.tdCell}>{row.year}</AppText>
              <AppText variant="caption" style={styles.tdCell}>{row.mode}</AppText>
              <AppText variant="caption" style={styles.tdCell}>{row.weeks}</AppText>
              <AppText variant="caption" style={styles.tdCell}>{row.weight}</AppText>
              <AppText variant="caption" style={[styles.tdCell, {flex: 1.3}]}>{row.complications}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Contraception */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>Contraception</AppText>
        </View>
        <View style={styles.cardBody}>
          {CONTRACEPTION_FORM.map((item, i) => (
            <FormRow key={i} item={item} last={i === CONTRACEPTION_FORM.length - 1} />
          ))}
        </View>
      </View>

      {/* Gynaecological Screenings */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>Gynaecological Screenings</AppText>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.tableHeader}>
            <AppText variant="small" color="#A09E9A" style={[styles.thCell, {flex: 1.5}]}>TEST</AppText>
            <AppText variant="small" color="#A09E9A" style={styles.thCell}>LAST</AppText>
            <AppText variant="small" color="#A09E9A" style={styles.thCell}>RESULT</AppText>
            <AppText variant="small" color="#A09E9A" style={styles.thCell}>NEXT</AppText>
          </View>
          {SCREENINGS.map((row, i) => (
            <View key={i} style={[styles.tableRow, i === SCREENINGS.length - 1 && styles.noBorder]}>
              <AppText variant="caption" style={[styles.tdCell, {flex: 1.5}]}>{row.test}</AppText>
              <AppText variant="caption" style={styles.tdCell}>{row.last}</AppText>
              <AppText variant="caption" style={styles.tdCell}>{row.result}</AppText>
              <AppText variant="caption" style={styles.tdCell}>{row.next}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Hormonal Health */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>Hormonal Health</AppText>
        </View>
        <View style={styles.cardBody}>
          {HORMONAL_FORM.map((item, i) => (
            <FormRow key={i} item={item} last={i === HORMONAL_FORM.length - 1} />
          ))}
        </View>
      </View>

      <View style={{height: vs(30)}} />
    </ScrollView>
  );
};

/* ── styles ────────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingTop: vs(12),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ms(16),
    
    
    marginBottom: vs(12),
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD6',
  },
  sectionTitle: {
    fontSize: ms(14),
    color: '#1A1814',
  },
  cardBody: {
    padding: s(16),
  },

  /* Form rows */
  formRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(9),
  },
  formRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEEA',
  },
  formLabel: {
    fontSize: ms(11),
    flex: 1,
  },
  formValue: {
    fontSize: ms(13),
    color: '#1A1814',
    textAlign: 'right',
    flex: 1,
  },

  /* Chips */
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginTop: vs(14),
  },
  chip: {
    borderRadius: ms(20),
    paddingVertical: vs(3),
    paddingHorizontal: s(9),
  },
  chipText: {
    fontSize: ms(10),
    fontWeight: '500',
  },

  /* Stat cards */
  statGrid: {
    flexDirection: 'row',
    gap: s(10),
    marginBottom: vs(14),
  },
  statCard: {
    flex: 1,
    backgroundColor: '#F9F8F5',
    borderRadius: ms(12),
    padding: s(12),
    alignItems: 'center',
  },
  statValue: {
    fontSize: ms(20),
    color: Colors.primary,
    marginBottom: vs(2),
  },
  statLabel: {
    fontSize: ms(8),
    letterSpacing: 0.5,
  },

  /* Table */
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: vs(8),
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD6',
  },
  thCell: {
    flex: 1,
    fontSize: ms(9),
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(9),
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEEA',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  tdCell: {
    flex: 1,
  },
});

export default ReproductiveTab;
