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

const PrescriptionCard = ({eye, sphere, cylinder, axis}) => (
  <View style={styles.rxCard}>
    <AppText variant="bodyBold" style={styles.rxEye}>{eye} Eye</AppText>
    <View style={styles.rxGrid}>
      <View style={styles.rxCell}>
        <AppText variant="small" style={styles.rxLabel}>SPHERE</AppText>
        <AppText variant="body" style={styles.rxVal}>{sphere}</AppText>
      </View>
      <View style={styles.rxCell}>
        <AppText variant="small" style={styles.rxLabel}>CYLINDER</AppText>
        <AppText variant="body" style={styles.rxVal}>{cylinder}</AppText>
      </View>
      <View style={styles.rxCell}>
        <AppText variant="small" style={styles.rxLabel}>AXIS</AppText>
        <AppText variant="body" style={styles.rxVal}>{axis}</AppText>
      </View>
    </View>
  </View>
);

const VisionTab = () => (
  <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    {/* Prescription */}
    <SectionCard title="Vision Prescription">
      <PrescriptionCard eye="Right" sphere="-1.75" cylinder="-0.50" axis="180" />
      <PrescriptionCard eye="Left" sphere="-2.00" cylinder="-0.75" axis="175" />
    </SectionCard>

    {/* Vision Details */}
    <SectionCard title="Vision Details">
      <FormRow label="Condition" value="Myopia with astigmatism" />
      <FormRow label="Correction" value="Glasses / Contact lenses" />
      <FormRow label="Frame" value="Anti-glare progressive" />
      <FormRow label="Rx Date" value="Nov 2025" last />
    </SectionCard>

    {/* Ophthalmology */}
    <SectionCard title="Ophthalmology">
      <FormRow label="Doctor" value="Dr. Meera Krishnan, MS Ophth" />
      <FormRow label="IOP" value="14 / 15 mmHg" />
      <View style={[styles.infoRow, styles.noBorder]}>
        <AppText variant="small" style={styles.infoLabel}>GLAUCOMA RISK</AppText>
        <StagePill label="Monitoring" type="monitor" />
      </View>
      <FormRow label="Retinal" value="Normal" last />
    </SectionCard>

    {/* Hearing */}
    <SectionCard title="Hearing Assessment">
      <FormRow label="Last Test" value="2022" />
      <FormRow label="Result" value="Normal" />
      <FormRow label="Tinnitus" value="None" />
      <FormRow label="Hearing Aid" value="Not required" last />
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
  rxCard: {
    backgroundColor: '#FAFAF8', borderRadius: ms(12), padding: s(14),
    marginBottom: vs(10),  
  },
  rxEye: {fontSize: ms(13), color: '#1A1814', marginBottom: vs(10)},
  rxGrid: {flexDirection: 'row', justifyContent: 'space-between'},
  rxCell: {flex: 1, alignItems: 'center'},
  rxLabel: {color: '#A09E9A', fontSize: ms(10), marginBottom: vs(4)},
  rxVal: {color: '#1A1814', fontSize: ms(14), fontWeight: '600'},
});

export default VisionTab;
