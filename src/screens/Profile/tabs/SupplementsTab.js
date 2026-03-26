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

const FormRow = ({label, value, last}) => (
  <View style={[styles.infoRow, last && styles.noBorder]}>
    <AppText variant="small" style={styles.infoLabel}>{label.toUpperCase()}</AppText>
    <AppText variant="body" style={styles.infoValue}>{value}</AppText>
  </View>
);

const StagePill = ({label, type}) => {
  const map = {
    managed: {bg: Colors.tealBg, fg: Colors.accent},
    active: {bg: '#FDF3E7', fg: '#B5600E'},
    monitor: {bg: '#EAF2FB', fg: '#1A5276'},
    resolved: {bg: '#F2EFE8', fg: '#A09E9A'},
  };
  const c = map[type] || map.resolved;
  return (
    <View style={[styles.pill, {backgroundColor: c.bg}]}>
      <AppText variant="small" style={{color: c.fg, fontSize: ms(11)}}>{label}</AppText>
    </View>
  );
};

const ProgressBar = ({label, detail, pct, color}) => (
  <View style={styles.barWrap}>
    <View style={styles.barHeader}>
      <AppText variant="small" style={styles.barLabel}>{label}</AppText>
      <AppText variant="small" style={styles.barDetail}>{detail}</AppText>
    </View>
    <View style={styles.barTrack}>
      <View style={[styles.barFill, {width: `${pct}%`, backgroundColor: color}]} />
    </View>
  </View>
);

const supplements = [
  {name: 'Vitamin D3', dose: '2000 IU', freq: 'Daily', type: 'managed'},
  {name: 'Omega-3 Fish Oil', dose: '1000 mg', freq: 'Daily', type: 'managed'},
  {name: 'Iron + Folic Acid', dose: 'As prescribed', freq: 'Daily', type: 'managed'},
  {name: 'Probiotic', dose: '10B CFU', freq: 'Daily', type: 'managed'},
  {name: 'Magnesium Glycinate', dose: '300 mg', freq: 'Nightly', type: 'managed'},
  {name: 'Biotin', dose: '5000 mcg', freq: 'Daily', type: 'managed'},
];

const herbals = [
  {name: 'Ashwagandha KSM-66', dose: '600 mg', note: 'Paused', type: 'active'},
  {name: 'Turmeric / Curcumin', dose: 'Dietary', note: 'Daily cooking', type: 'managed'},
  {name: 'Chyawanprash', dose: '1 tsp', note: 'Winter months', type: 'resolved'},
];

const micronutrients = [
  {name: 'Vitamin D', value: '34 ng/mL', status: 'Sufficient', type: 'managed'},
  {name: 'Iron', value: '68 ug/dL', status: 'Normal', type: 'managed'},
  {name: 'Ferritin', value: '18 ng/mL', status: 'Low-normal', type: 'active'},
  {name: 'Vitamin B12', value: '412 pg/mL', status: 'Normal', type: 'managed'},
  {name: 'Folate', value: '9.8 ng/mL', status: 'Normal', type: 'managed'},
  {name: 'Calcium', value: '9.1 mg/dL', status: 'Normal', type: 'managed'},
  {name: 'Magnesium', value: '1.9 mg/dL', status: 'Normal', type: 'managed'},
  {name: 'Zinc', value: '—', status: 'Not tested', type: 'resolved'},
];

const SupplementsTab = () => (
  <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    {/* Current Supplements */}
    <SectionCard title="Current Supplements">
      {supplements.map((item, i) => (
        <View key={i} style={[styles.suppRow, i === supplements.length - 1 && styles.noBorder]}>
          <View style={{flex: 1}}>
            <AppText variant="body" style={styles.suppName}>{item.name}</AppText>
            <AppText variant="small" style={styles.suppMeta}>{item.dose}  ·  {item.freq}</AppText>
          </View>
          <StagePill label="Active" type={item.type} />
        </View>
      ))}
    </SectionCard>

    {/* Herbal Remedies */}
    <SectionCard title="Herbal & Traditional Remedies">
      {herbals.map((item, i) => (
        <View key={i} style={[styles.suppRow, i === herbals.length - 1 && styles.noBorder]}>
          <View style={{flex: 1}}>
            <AppText variant="body" style={styles.suppName}>{item.name}</AppText>
            <AppText variant="small" style={styles.suppMeta}>{item.dose}  ·  {item.note}</AppText>
          </View>
          <StagePill label={item.note} type={item.type} />
        </View>
      ))}
    </SectionCard>

    {/* Micronutrient Table */}
    <SectionCard title="Micronutrient Levels">
      <View style={styles.tableHeader}>
        <AppText variant="small" style={[styles.thCell, {flex: 1.2}]}>NUTRIENT</AppText>
        <AppText variant="small" style={[styles.thCell, {flex: 1}]}>VALUE</AppText>
        <AppText variant="small" style={[styles.thCell, {flex: 1, textAlign: 'right'}]}>STATUS</AppText>
      </View>
      {micronutrients.map((row, i) => (
        <View key={i} style={[styles.tableRow, i === micronutrients.length - 1 && styles.noBorder]}>
          <AppText variant="small" style={[styles.tdCell, {flex: 1.2}]}>{row.name}</AppText>
          <AppText variant="small" style={[styles.tdCell, {flex: 1}]}>{row.value}</AppText>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <StagePill label={row.status} type={row.type} />
          </View>
        </View>
      ))}
    </SectionCard>

    {/* Nutritional Goals */}
    <SectionCard title="Nutritional Goals">
      <FormRow label="Primary" value="Optimise ferritin & Vitamin D" />
      <FormRow label="Diet Focus" value="Iron-rich foods, anti-inflammatory" />
      <FormRow label="Review" value="Next blood work - Jun 2026" last />

      <View style={styles.barsSection}>
        <ProgressBar label="Vitamin D target (40+)" detail="34/40 (85%)" pct={85} color={Colors.accent} />
        <ProgressBar label="Ferritin target (30+)" detail="18/30 (60%)" pct={60} color="#E9A23A" />
        <ProgressBar label="Supplement adherence" detail="92%" pct={92} color={Colors.accent} />
      </View>
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
  infoRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#E0DDD6'},
  noBorder: {borderBottomWidth: 0},
  infoLabel: {width: s(110), color: '#A09E9A', fontSize: ms(11)},
  infoValue: {flex: 1, color: '#1A1814', fontSize: ms(13)},
  pill: {borderRadius: ms(20), paddingVertical: vs(3), paddingHorizontal: s(10)},
  suppRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#E0DDD6'},
  suppName: {color: '#1A1814', fontSize: ms(13)},
  suppMeta: {color: '#A09E9A', fontSize: ms(11), marginTop: vs(2)},
  tableHeader: {flexDirection: 'row', paddingBottom: vs(8), borderBottomWidth: 1, borderBottomColor: '#E0DDD6'},
  thCell: {color: '#A09E9A', fontSize: ms(10)},
  tableRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#E0DDD6'},
  tdCell: {color: '#1A1814', fontSize: ms(12)},
  barsSection: {marginTop: vs(14), gap: vs(10)},
  barWrap: {gap: vs(4)},
  barHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  barLabel: {fontSize: ms(11), color: '#1A1814'},
  barDetail: {fontSize: ms(11), color: '#A09E9A'},
  barTrack: {height: vs(6), backgroundColor: '#F2EFE8', borderRadius: 99},
  barFill: {height: vs(6), borderRadius: 99},
});

export default SupplementsTab;
