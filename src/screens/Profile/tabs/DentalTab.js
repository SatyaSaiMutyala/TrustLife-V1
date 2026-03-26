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

const InfoRow = ({label, value, last}) => (
  <View style={[styles.infoRow, last && styles.noBorder]}>
    <AppText variant="small" style={styles.infoLabel}>{label.toUpperCase()}</AppText>
    <AppText variant="body" style={styles.infoValue}>{value}</AppText>
  </View>
);

const TOOTH_COLORS = {
  ok: '#4CAF50',
  filling: '#E9A23A',
  missing: '#E57373',
  crown: '#42A5F5',
};

const upperTeeth = [
  {id: 18, s: 'ok'}, {id: 17, s: 'ok'}, {id: 16, s: 'filling'}, {id: 15, s: 'ok'},
  {id: 14, s: 'ok'}, {id: 13, s: 'ok'}, {id: 12, s: 'ok'}, {id: 11, s: 'ok'},
  {id: 21, s: 'ok'}, {id: 22, s: 'ok'}, {id: 23, s: 'ok'}, {id: 24, s: 'crown'},
  {id: 25, s: 'ok'}, {id: 26, s: 'filling'}, {id: 27, s: 'ok'}, {id: 28, s: 'missing'},
];

const lowerTeeth = [
  {id: 48, s: 'missing'}, {id: 47, s: 'ok'}, {id: 46, s: 'filling'}, {id: 45, s: 'ok'},
  {id: 44, s: 'ok'}, {id: 43, s: 'ok'}, {id: 42, s: 'ok'}, {id: 41, s: 'ok'},
  {id: 31, s: 'ok'}, {id: 32, s: 'ok'}, {id: 33, s: 'ok'}, {id: 34, s: 'ok'},
  {id: 35, s: 'ok'}, {id: 36, s: 'crown'}, {id: 37, s: 'ok'}, {id: 38, s: 'ok'},
];

const ToothBox = ({tooth}) => (
  <View style={[styles.toothBox, {backgroundColor: TOOTH_COLORS[tooth.s]}]}>
    <AppText variant="small" style={styles.toothText}>{tooth.id}</AppText>
  </View>
);

const DentalTab = () => (
  <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    {/* Provider */}
    <SectionCard title="Dental Care Provider">
      <FormRow label="Dentist" value="Dr. Varsha Desai" />
      <FormRow label="Qualification" value="MDS" />
      <FormRow label="Clinic" value="Apollo White Dental" last />
    </SectionCard>

    {/* Dental Chart */}
    <SectionCard title="Dental Chart">
      <AppText variant="small" style={styles.jawLabel}>UPPER JAW</AppText>
      <View style={styles.teethRow}>
        {upperTeeth.map(t => <ToothBox key={t.id} tooth={t} />)}
      </View>
      <AppText variant="small" style={[styles.jawLabel, {marginTop: vs(10)}]}>LOWER JAW</AppText>
      <View style={styles.teethRow}>
        {lowerTeeth.map(t => <ToothBox key={t.id} tooth={t} />)}
      </View>
      <View style={styles.legendRow}>
        {Object.entries(TOOTH_COLORS).map(([k, c]) => (
          <View key={k} style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: c}]} />
            <AppText variant="small" style={styles.legendText}>
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </AppText>
          </View>
        ))}
      </View>
    </SectionCard>

    {/* Oral Health */}
    <SectionCard title="Oral Health">
      <FormRow label="Gum Status" value="Mild gingivitis" />
      <FormRow label="Hygiene" value="Good" />
      <FormRow label="Appliances" value="None" />
      <FormRow label="Orthodontic" value="Completed (retainer)" />
      <FormRow label="Sensitivity" value="Cold sensitive - molars" />
      <FormRow label="Last X-ray" value="Jan 2026" last />
    </SectionCard>

    {/* Additional Info */}
    <SectionCard title="Additional Info">
      <InfoRow label="Fluoride" value="Fluoride toothpaste daily" />
      <InfoRow label="Bruxism" value="Occasional night grinding" />
      <InfoRow label="TMJ" value="No dysfunction" last />
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
  infoRow: {flexDirection: 'row', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#E0DDD6'},
  noBorder: {borderBottomWidth: 0},
  infoLabel: {width: s(110), color: '#A09E9A', fontSize: ms(11)},
  infoValue: {flex: 1, color: '#1A1814', fontSize: ms(13)},
  jawLabel: {color: '#A09E9A', fontSize: ms(10), marginBottom: vs(6)},
  teethRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(4)},
  toothBox: {
    width: s(18), height: s(18), borderRadius: ms(3),
    justifyContent: 'center', alignItems: 'center',
  },
  toothText: {color: '#FFF', fontSize: ms(8), fontWeight: '700'},
  legendRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(12), marginTop: vs(12)},
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: s(4)},
  legendDot: {width: s(8), height: s(8), borderRadius: 99},
  legendText: {color: '#A09E9A', fontSize: ms(10)},
});

export default DentalTab;
