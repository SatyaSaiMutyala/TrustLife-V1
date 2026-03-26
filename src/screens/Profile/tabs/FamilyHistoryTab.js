import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../../components/shared/AppText';
import Colors from '../../../constants/colors';

/* ── data ──────────────────────────────────────────── */

const TAG_STYLES = {
  Heart:     {bg: '#FAEAED', color: '#9B3A4A'},
  Metabolic: {bg: '#FDF3E7', color: '#B5600E'},
  Neuro:     {bg: '#EDE8FD', color: '#533BA0'},
  Cancer:    {bg: '#FDE8D0', color: '#7A3B0A'},
};

const tagCategory = condition => {
  const heart = ['Hypertension', 'CAD', 'HTN', 'MI', 'Dyslipidaemia', 'CVD'];
  const metabolic = ['T2D', 'Obesity', 'Osteoporosis', 'Hypothyroidism', 'Glaucoma', 'OA', 'Asthma', 'GDM', 'Anxiety'];
  const neuro = ["Parkinson's", 'Stroke'];
  const cancer = ['Colorectal cancer', 'Breast cancer BRCA'];
  if (heart.includes(condition)) return 'Heart';
  if (metabolic.includes(condition)) return 'Metabolic';
  if (neuro.includes(condition)) return 'Neuro';
  if (cancer.includes(condition)) return 'Cancer';
  return 'Metabolic';
};

const MATERNAL_MEMBERS = [
  {initials: 'MM', relation: 'Mother', status: 'Deceased', age: 71, conditions: ['Hypertension', 'T2D', 'CAD']},
  {initials: 'MF', relation: 'Father', status: 'Deceased', age: 68, conditions: ['Colorectal cancer', 'Obesity', 'Stroke']},
  {initials: 'MA', relation: 'Aunt', status: 'Living', age: 67, conditions: ['T2D', 'Osteoporosis']},
  {initials: 'MU', relation: 'Uncle', status: 'Living', age: 61, conditions: ['Hypertension', "Parkinson's"]},
  {initials: 'MS', relation: 'Sister', status: 'Living', age: 42, conditions: ['Hypothyroidism']},
];

const PATERNAL_MEMBERS = [
  {initials: 'PM', relation: 'Mother', status: 'Living', age: 74, conditions: ['Glaucoma', 'OA', 'HTN']},
  {initials: 'PF', relation: 'Father', status: 'Deceased', age: 64, conditions: ['MI', 'T2D', 'Dyslipidaemia']},
  {initials: 'PA', relation: 'Aunt', status: 'Living', age: 59, conditions: ['Breast cancer BRCA', 'T2D']},
  {initials: 'PU', relation: 'Uncle', status: 'Living', age: 55, conditions: ['Asthma', 'HTN']},
  {initials: 'PB', relation: 'Brother', status: 'Living', age: 35, conditions: ['Anxiety']},
];

const MATERNAL_RISKS = [
  {label: 'CVD', level: 'High'},
  {label: 'T2D', level: 'High'},
  {label: 'Colorectal cancer', level: 'Moderate'},
  {label: 'Thyroid', level: 'Moderate'},
  {label: "Parkinson's", level: 'Low'},
  {label: 'Osteoporosis', level: 'Low'},
];

const PATERNAL_RISKS = [
  {label: 'CVD', level: 'High'},
  {label: 'T2D', level: 'High'},
  {label: 'Breast cancer', level: 'Moderate'},
  {label: 'HTN', level: 'Moderate'},
  {label: 'Asthma', level: 'Low'},
  {label: 'Glaucoma', level: 'Low'},
  {label: 'Anxiety', level: 'Low'},
];

const SCREENINGS = [
  {test: 'CVD panel', freq: 'Annual', start: 'Now', priority: 'High'},
  {test: 'Glucose', freq: 'Annual', start: 'Now', priority: 'High'},
  {test: 'Mammogram', freq: 'Annual', start: '40', priority: 'Moderate'},
  {test: 'BRCA', freq: 'Once', start: 'Now', priority: 'High'},
  {test: 'Colonoscopy', freq: '10 yr', start: '40', priority: 'Moderate'},
  {test: 'Eye', freq: '2 yr', start: '40', priority: 'Routine'},
  {test: 'TSH', freq: 'Annual', start: 'Now', priority: 'Ongoing'},
  {test: 'DEXA', freq: '5 yr', start: '50', priority: 'Future'},
];

const riskColor = level => {
  if (level === 'High') return '#D05A6A';
  if (level === 'Moderate') return '#E9A23A';
  return Colors.accent;
};

const priorityStyle = priority => {
  if (priority === 'High') return {bg: '#FAEAED', color: '#9B3A4A'};
  if (priority === 'Moderate') return {bg: '#FDF3E7', color: '#B5600E'};
  if (priority === 'Ongoing') return {bg: Colors.tealBg, color: Colors.accent};
  if (priority === 'Routine') return {bg: Colors.tealBg, color: Colors.accent};
  return {bg: '#F5F3EF', color: '#A09E9A'};
};

/* ── sub-components ────────────────────────────────── */

const ConditionTag = ({label}) => {
  const cat = tagCategory(label);
  const st = TAG_STYLES[cat];
  return (
    <View style={[styles.tag, {backgroundColor: st.bg}]}>
      <AppText variant="small" color={st.color} style={styles.tagText}>{label}</AppText>
    </View>
  );
};

const MemberRow = ({member, last}) => (
  <View style={[styles.memberRow, !last && styles.memberBorder]}>
    <View style={styles.avatarCircle}>
      <AppText variant="small" color="#FFFFFF" style={styles.avatarText}>{member.initials}</AppText>
    </View>
    <View style={{flex: 1}}>
      <View style={styles.memberTopLine}>
        <AppText variant="bodyBold">{member.relation}</AppText>
        <AppText variant="caption" color="#A09E9A">
          {member.status} {'\u00B7'} {member.age}
        </AppText>
      </View>
      <View style={styles.tagsWrap}>
        {member.conditions.map((c, i) => (
          <ConditionTag key={i} label={c} />
        ))}
      </View>
    </View>
  </View>
);

const RiskRow = ({item, last}) => (
  <View style={[styles.riskRow, !last && styles.riskRowBorder]}>
    <View style={[styles.riskDot, {backgroundColor: riskColor(item.level)}]} />
    <AppText variant="body" style={{flex: 1}}>{item.label}</AppText>
    <AppText variant="small" color={riskColor(item.level)} style={styles.riskLevel}>
      {item.level}
    </AppText>
  </View>
);

/* ── main component ────────────────────────────────── */

const FamilyHistoryTab = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <AppText variant="caption" color={Colors.tealText}>
          Family medical history is a significant predictor of individual disease risk and guides proactive screening strategies.
        </AppText>
      </View>

      {/* Maternal Side */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>Maternal Side</AppText>
        </View>
        <View style={styles.cardBody}>
          {MATERNAL_MEMBERS.map((m, i) => (
            <MemberRow key={i} member={m} last={i === MATERNAL_MEMBERS.length - 1} />
          ))}
        </View>
      </View>

      {/* Maternal Risk Summary */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>Maternal Risk Summary</AppText>
        </View>
        <View style={styles.cardBody}>
          {MATERNAL_RISKS.map((r, i) => (
            <RiskRow key={i} item={r} last={i === MATERNAL_RISKS.length - 1} />
          ))}
        </View>
      </View>

      {/* Paternal Side */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>Paternal Side</AppText>
        </View>
        <View style={styles.cardBody}>
          {PATERNAL_MEMBERS.map((m, i) => (
            <MemberRow key={i} member={m} last={i === PATERNAL_MEMBERS.length - 1} />
          ))}
        </View>
      </View>

      {/* Paternal Risk Summary */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>Paternal Risk Summary</AppText>
        </View>
        <View style={styles.cardBody}>
          {PATERNAL_RISKS.map((r, i) => (
            <RiskRow key={i} item={r} last={i === PATERNAL_RISKS.length - 1} />
          ))}
        </View>
      </View>

      {/* Recommended Screenings */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>Recommended Screenings</AppText>
        </View>
        <View style={styles.cardBody}>
          {/* Table header */}
          <View style={styles.tableHeader}>
            <AppText variant="small" style={[styles.thCell, {flex: 2}]} color="#A09E9A">TEST</AppText>
            <AppText variant="small" style={styles.thCell} color="#A09E9A">FREQ</AppText>
            <AppText variant="small" style={styles.thCell} color="#A09E9A">START</AppText>
            <AppText variant="small" style={[styles.thCell, {alignItems: 'flex-end'}]} color="#A09E9A">PRIORITY</AppText>
          </View>
          {SCREENINGS.map((row, i) => {
            const ps = priorityStyle(row.priority);
            return (
              <View key={i} style={[styles.tableRow, i === SCREENINGS.length - 1 && styles.noBorder]}>
                <AppText variant="caption" style={[styles.tdCell, {flex: 2}]}>{row.test}</AppText>
                <AppText variant="caption" style={styles.tdCell}>{row.freq}</AppText>
                <AppText variant="caption" style={styles.tdCell}>{row.start}</AppText>
                <View style={[styles.tdCell, {alignItems: 'flex-end'}]}>
                  <View style={[styles.priorityBadge, {backgroundColor: ps.bg}]}>
                    <AppText variant="small" color={ps.color}>{row.priority}</AppText>
                  </View>
                </View>
              </View>
            );
          })}
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
  infoBanner: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(12),
    padding: s(14),
    marginBottom: vs(12),
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

  /* Member rows */
  memberRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(10),
    gap: s(12),
  },
  memberBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEEA',
  },
  avatarCircle: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: Colors.purple,
    alignItems: 'center',
    justifyContent: 'center',
  },
  avatarText: {
    fontSize: ms(12),
    fontWeight: '600',
  },
  memberTopLine: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(6),
  },
  tagsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
  },
  tag: {
    borderRadius: ms(20),
    paddingVertical: vs(3),
    paddingHorizontal: s(9),
  },
  tagText: {
    fontSize: ms(10),
    fontWeight: '500',
  },

  /* Risk rows */
  riskRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(9),
  },
  riskRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: '#F0EEEA',
  },
  riskDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    marginRight: s(10),
  },
  riskLevel: {
    fontWeight: '600',
    fontSize: ms(11),
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
  priorityBadge: {
    borderRadius: ms(20),
    paddingHorizontal: s(9),
    paddingVertical: vs(2),
  },
});

export default FamilyHistoryTab;
