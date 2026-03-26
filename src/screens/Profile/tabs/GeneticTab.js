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

const testData = [
  {test: 'Thalassaemia Carrier', marker: 'HbA2', result: 'Not carrier', type: 'managed'},
  {test: 'GDM Pharmacogenomics', marker: 'CYP2C9', result: 'Normal metaboliser', type: 'managed'},
  {test: 'BRCA 1 & 2', marker: 'BRCA1/2', result: 'Pending', type: 'active'},
  {test: 'Thyroid TPO Ab', marker: 'TPO', result: 'Elevated', type: 'monitor'},
];

const variants = [
  {name: 'Hashimoto\'s Thyroiditis', gene: 'HLA-DR3', status: 'Confirmed', type: 'monitor'},
  {name: 'BRCA Screening', gene: 'BRCA1/2', status: 'Pending', type: 'active'},
];

const GeneticTab = () => (
  <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    {/* Privacy Banner */}
    <View style={styles.banner}>
      <AppText variant="small" style={styles.bannerText}>
        Genetic data is encrypted and stored separately. Access requires explicit consent.
      </AppText>
    </View>

    {/* Genetic Testing */}
    <SectionCard title="Genetic Testing">
      <View style={styles.tableHeader}>
        <AppText variant="small" style={[styles.thCell, {flex: 2}]}>TEST</AppText>
        <AppText variant="small" style={[styles.thCell, {flex: 1}]}>MARKER</AppText>
        <AppText variant="small" style={[styles.thCell, {flex: 1.5, textAlign: 'right'}]}>RESULT</AppText>
      </View>
      {testData.map((row, i) => (
        <View key={i} style={[styles.tableRow, i === testData.length - 1 && styles.noBorder]}>
          <AppText variant="small" style={[styles.tdCell, {flex: 2}]}>{row.test}</AppText>
          <AppText variant="small" style={[styles.tdCell, {flex: 1}]}>{row.marker}</AppText>
          <View style={{flex: 1.5, alignItems: 'flex-end'}}>
            <StagePill label={row.result} type={row.type} />
          </View>
        </View>
      ))}
    </SectionCard>

    {/* Known Variants */}
    <SectionCard title="Known Variants">
      {variants.map((v, i) => (
        <View key={i} style={[styles.variantRow, i === variants.length - 1 && styles.noBorder]}>
          <View style={{flex: 1}}>
            <AppText variant="body" style={styles.variantName}>{v.name}</AppText>
            <AppText variant="small" style={styles.variantGene}>{v.gene}</AppText>
          </View>
          <StagePill label={v.status} type={v.type} />
        </View>
      ))}
    </SectionCard>

    {/* Genetic Counselling */}
    <SectionCard title="Genetic Counselling">
      <FormRow label="Counsellor" value="Dr. Anitha Reddy" />
      <FormRow label="Hospital" value="CARE Hospitals" />
      <FormRow label="Next Session" value="Apr 2026" last />
    </SectionCard>

    {/* Consent */}
    <SectionCard title="Consent & Sharing">
      <FormRow label="Data Sharing" value="Restricted to treating team" />
      <FormRow label="Research" value="Opted out" />
      <FormRow label="Family Access" value="Spouse only" />
      <FormRow label="Last Updated" value="Mar 2026" last />
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
  banner: {
    backgroundColor: '#EAF2FB', borderRadius: ms(12), padding: s(14),
    marginBottom: vs(12),  borderColor: '#C5D9ED',
  },
  bannerText: {color: '#1A5276', fontSize: ms(11), lineHeight: ms(16)},
  tableHeader: {flexDirection: 'row', paddingBottom: vs(8), borderBottomWidth: 1, borderBottomColor: '#E0DDD6'},
  thCell: {color: '#A09E9A', fontSize: ms(10)},
  tableRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#E0DDD6'},
  tdCell: {color: '#1A1814', fontSize: ms(12)},
  variantRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#E0DDD6'},
  variantName: {color: '#1A1814', fontSize: ms(13)},
  variantGene: {color: '#A09E9A', fontSize: ms(11), marginTop: vs(2)},
});

export default GeneticTab;
