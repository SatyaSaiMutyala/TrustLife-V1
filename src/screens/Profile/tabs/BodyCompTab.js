import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../../components/shared/AppText';
import Colors from '../../../constants/colors';

const SectionCard = ({title, children}) => (
  <View style={styles.card}>
    <View style={styles.sectionHeader}>
      <AppText variant="bodyBold" style={styles.sectionTitle}>{title}</AppText>
    </View>
    <View style={styles.cardBody}>{children}</View>
  </View>
);

const MetricCell = ({label, value, tag, tagType}) => {
  const tagColors = {
    normal: {bg: Colors.tealBg, fg: Colors.accent},
    warning: {bg: '#FDF3E7', fg: '#B5600E'},
    info: {bg: '#EAF2FB', fg: '#1A5276'},
    muted: {bg: '#F2EFE8', fg: '#A09E9A'},
  };
  const c = tagColors[tagType];
  return (
    <View style={styles.metricCell}>
      <AppText variant="small" style={styles.metricLabel}>{label}</AppText>
      <AppText variant="bodyBold" style={styles.metricValue}>{value}</AppText>
      {tag && c && (
        <View style={[styles.tag, {backgroundColor: c.bg}]}>
          <AppText variant="small" style={{color: c.fg, fontSize: ms(9)}}>{tag}</AppText>
        </View>
      )}
    </View>
  );
};

const BMIBar = ({value}) => {
  const pct = Math.min(Math.max(((value - 15) / 25) * 100, 0), 100);
  return (
    <View style={styles.bmiWrap}>
      <View style={styles.bmiTrack}>
        <View style={[styles.bmiSegment, {flex: 3, backgroundColor: '#42A5F5'}]} />
        <View style={[styles.bmiSegment, {flex: 6.5, backgroundColor: '#4CAF50'}]} />
        <View style={[styles.bmiSegment, {flex: 5, backgroundColor: '#E9A23A'}]} />
        <View style={[styles.bmiSegment, {flex: 10.5, backgroundColor: '#E57373'}]} />
      </View>
      <View style={[styles.bmiMarker, {left: `${pct}%`}]} />
      <View style={styles.bmiLabels}>
        <AppText variant="small" style={styles.bmiLabel}>15</AppText>
        <AppText variant="small" style={styles.bmiLabel}>18.5</AppText>
        <AppText variant="small" style={styles.bmiLabel}>25</AppText>
        <AppText variant="small" style={styles.bmiLabel}>30</AppText>
        <AppText variant="small" style={styles.bmiLabel}>40</AppText>
      </View>
    </View>
  );
};

const anthro = [
  {label: 'Height', value: '163 cm'},
  {label: 'Weight', value: '61 kg', tag: 'Normal', tagType: 'normal'},
  {label: 'Waist', value: '74 cm', tag: 'Healthy', tagType: 'normal'},
  {label: 'Hip', value: '97 cm'},
  {label: 'WHR', value: '0.76', tag: 'Normal', tagType: 'normal'},
  {label: 'Mid-arm', value: '45.4 cm'},
  {label: 'Chest', value: '54 cm'},
  {label: 'BMI', value: '23.0', tag: 'Normal', tagType: 'normal'},
];

const bodyFat = [
  {label: 'Body Fat', value: '27.2%', tag: 'Acceptable', tagType: 'normal'},
  {label: 'Lean Mass', value: '44.4 kg', tag: 'Good', tagType: 'normal'},
  {label: 'Fat Mass', value: '16.6 kg'},
  {label: 'Muscle', value: '28.1 kg', tag: 'Normal', tagType: 'normal'},
  {label: 'Water', value: '31.1 L', tag: 'Normal', tagType: 'normal'},
  {label: 'BMR', value: '1420 kcal'},
  {label: 'Visceral', value: 'Low', tag: 'Healthy', tagType: 'normal'},
  {label: 'Metab. Age', value: '35 yrs', tag: 'Younger', tagType: 'normal'},
];

const weightHistory = [
  {date: 'Mar 2026', weight: '61.0 kg', note: 'Stable'},
  {date: 'Dec 2025', weight: '62.3 kg', note: 'Post-holiday'},
  {date: 'Sep 2025', weight: '60.5 kg', note: 'Target reached'},
  {date: 'Jun 2025', weight: '63.8 kg', note: 'Started plan'},
];

const BodyCompTab = () => (
  <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    {/* Anthropometric */}
    <SectionCard title="Anthropometric Measurements">
      <View style={styles.grid}>
        {anthro.map((m, i) => <MetricCell key={i} {...m} />)}
      </View>
      <BMIBar value={23.0} />
    </SectionCard>

    {/* Body Fat */}
    <SectionCard title="Body Fat Analysis">
      <View style={styles.grid}>
        {bodyFat.map((m, i) => <MetricCell key={i} {...m} />)}
      </View>
    </SectionCard>

    {/* DEXA Banner */}
    <View style={styles.banner}>
      <AppText variant="small" style={styles.bannerText}>
        Last DEXA scan: Jan 2026 at Apollo Diagnostics. Bone density T-score: -0.5 (normal range).
      </AppText>
    </View>

    {/* Weight History */}
    <SectionCard title="Weight History">
      <View style={styles.tableHeader}>
        <AppText variant="small" style={[styles.thCell, {flex: 1}]}>DATE</AppText>
        <AppText variant="small" style={[styles.thCell, {flex: 1}]}>WEIGHT</AppText>
        <AppText variant="small" style={[styles.thCell, {flex: 1, textAlign: 'right'}]}>NOTE</AppText>
      </View>
      {weightHistory.map((r, i) => (
        <View key={i} style={[styles.tableRow, i === weightHistory.length - 1 && styles.noBorder]}>
          <AppText variant="small" style={[styles.tdCell, {flex: 1}]}>{r.date}</AppText>
          <AppText variant="body" style={[styles.tdCell, {flex: 1, fontWeight: '600'}]}>{r.weight}</AppText>
          <AppText variant="small" style={[styles.tdCell, {flex: 1, textAlign: 'right', color: '#A09E9A'}]}>{r.note}</AppText>
        </View>
      ))}
    </SectionCard>

    <View style={{height: vs(30)}} />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: s(16), paddingTop: vs(12)},
  card: {
    backgroundColor: '#FFFFFF', borderRadius: ms(16), 
     marginBottom: vs(12), overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: s(16), borderBottomWidth: 1, borderBottomColor: '#E0DDD6',
  },
  sectionTitle: {fontSize: ms(14), color: '#1A1814'},
  cardBody: {padding: s(16)},
  noBorder: {borderBottomWidth: 0},
  grid: {flexDirection: 'row', flexWrap: 'wrap'},
  metricCell: {
    width: '50%', paddingVertical: vs(10), paddingRight: s(8),
    borderBottomWidth: 1, borderBottomColor: '#E0DDD6',
  },
  metricLabel: {color: '#A09E9A', fontSize: ms(10), marginBottom: vs(2)},
  metricValue: {color: '#1A1814', fontSize: ms(14)},
  tag: {borderRadius: ms(10), paddingVertical: vs(1), paddingHorizontal: s(6), alignSelf: 'flex-start', marginTop: vs(3)},
  bmiWrap: {marginTop: vs(14), paddingHorizontal: s(2)},
  bmiTrack: {flexDirection: 'row', height: vs(8), borderRadius: 99, overflow: 'hidden'},
  bmiSegment: {height: '100%'},
  bmiMarker: {
    position: 'absolute', top: 0, width: s(3), height: vs(8),
    backgroundColor: '#1A1814', borderRadius: 99, marginLeft: -1,
  },
  bmiLabels: {flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(4)},
  bmiLabel: {color: '#A09E9A', fontSize: ms(9)},
  banner: {
    backgroundColor: '#EAF2FB', borderRadius: ms(12), padding: s(14),
    marginBottom: vs(12),  borderColor: '#C5D9ED',
  },
  bannerText: {color: '#1A5276', fontSize: ms(11), lineHeight: ms(16)},
  tableHeader: {flexDirection: 'row', paddingBottom: vs(8), borderBottomWidth: 1, borderBottomColor: '#E0DDD6'},
  thCell: {color: '#A09E9A', fontSize: ms(10)},
  tableRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#E0DDD6'},
  tdCell: {color: '#1A1814', fontSize: ms(12)},
});

export default BodyCompTab;
