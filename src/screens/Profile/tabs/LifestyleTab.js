import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../../components/shared/AppText';
import Colors from '../../../constants/colors';

const FormRow = ({label, value, last}) => (
  <View style={[styles.infoRow, last && styles.noBorder]}>
    <AppText variant="small" style={styles.infoLabel}>
      {label.toUpperCase()}
    </AppText>
    <AppText variant="body" style={styles.infoValue}>
      {value}
    </AppText>
  </View>
);

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

const Chip = ({label, type}) => {
  const chipStyle =
    type === 'on'
      ? {backgroundColor: Colors.tealBg, color: Colors.accent}
      : type === 'warn'
      ? {backgroundColor: '#FDF3E7', color: '#B5600E'}
      : {backgroundColor: '#F2EFE8', color: '#A09E9A'};

  return (
    <View style={[styles.chip, {backgroundColor: chipStyle.backgroundColor}]}>
      <AppText variant="small" style={{color: chipStyle.color, fontSize: ms(11)}}>
        {label}
      </AppText>
    </View>
  );
};

const SectionCard = ({title, children}) => (
  <View style={styles.card}>
    <View style={styles.sectionHeader}>
      <AppText variant="bodyBold" style={styles.sectionTitle}>{title}</AppText>
    </View>
    <View style={styles.cardBody}>{children}</View>
  </View>
);

const LifestyleTab = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Physical Activity */}
      <SectionCard title="Physical Activity">
        <FormRow label="Activity Level" value="Moderately Active" />
        <FormRow label="Exercise Type" value="Mixed" />
        <FormRow label="Frequency" value="4 days/week" />
        <FormRow label="Duration" value="30-45 min" last />

        <View style={styles.barsSection}>
          <ProgressBar label="Weekly active minutes" detail="150/150 (100%)" pct={100} color={Colors.accent} />
          <ProgressBar label="Steps" detail="7400 (74%)" pct={74} color="#E9A23A" />
          <ProgressBar label="Sedentary" detail="6hrs (50%)" pct={50} color="#E9A23A" />
        </View>
      </SectionCard>

      {/* Diet & Nutrition */}
      <SectionCard title="Diet & Nutrition">
        <FormRow label="Dietary Pattern" value="Omnivore" />
        <FormRow label="Meals/Day" value="3" />
        <FormRow label="Water" value="2-3L" />
        <FormRow label="Caffeine" value="1-2 cups" last />

        <View style={styles.chipWrap}>
          <Chip label="No red meat" type="on" />
          <Chip label="Low sodium" type="on" />
          <Chip label="Lactose tolerant" type="on" />
          <Chip label="Nut allergy" type="off" />
          <Chip label="Gluten tolerant" type="on" />
          <Chip label="Low sugar" type="warn" />
          <Chip label="Shellfish allergy" type="off" />
        </View>

        <View style={styles.barsSection}>
          <ProgressBar label="Fruit" detail="4 servings (80%)" pct={80} color={Colors.accent} />
          <ProgressBar label="Processed food" detail="Occasional (30%)" pct={30} color="#E9A23A" />
        </View>
      </SectionCard>

      {/* Sleep */}
      <SectionCard title="Sleep">
        <FormRow label="Avg Duration" value="7-8 hrs" />
        <FormRow label="Quality" value="Good" />
        <FormRow label="Bedtime" value="23:00" />
        <FormRow label="Wake" value="06:30" last />

        <View style={styles.chipWrap}>
          <Chip label="Occasional insomnia" type="warn" />
          <Chip label="Sleep apnea" type="off" />
          <Chip label="Snoring" type="off" />
          <Chip label="No restless legs" type="on" />
          <Chip label="Night sweats" type="off" />
        </View>

        <View style={styles.barsSection}>
          <ProgressBar label="Sleep consistency" detail="72/100 (72%)" pct={72} color="#E9A23A" />
        </View>
      </SectionCard>

      {/* Substance Use */}
      <SectionCard title="Substance Use">
        <FormRow label="Tobacco" value="Never" />
        <FormRow label="Alcohol" value="Occasional" />
        <FormRow label="Recreational" value="None" />
        <FormRow label="Stress" value="Moderate" />
        <FormRow label="Screen Time" value="4-6 hrs" />
        <FormRow label="Mindfulness" value="Occasionally" last />
      </SectionCard>

      {/* Occupation */}
      <SectionCard title="Occupation">
        <FormRow label="Occupation" value="Software Engineer" />
        <FormRow label="Industry" value="Technology" />
        <FormRow label="Work Type" value="Hybrid" />
        <FormRow label="Hours" value="8-9" />
        <FormRow label="Seated" value="Yes - desk" />
        <FormRow label="Hazards" value="None significant" last />
      </SectionCard>

      <View style={{height: vs(30)}} />
    </ScrollView>
  );
};

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
  infoRow: {
    flexDirection: 'row',
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD6',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    width: s(110),
    color: '#A09E9A',
    fontSize: ms(11),
  },
  infoValue: {
    flex: 1,
    color: '#1A1814',
    fontSize: ms(13),
  },
  barsSection: {
    marginTop: vs(14),
    gap: vs(10),
  },
  barWrap: {
    gap: vs(4),
  },
  barHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  barLabel: {
    fontSize: ms(11),
    color: '#1A1814',
  },
  barDetail: {
    fontSize: ms(11),
    color: '#A09E9A',
  },
  barTrack: {
    height: vs(6),
    backgroundColor: '#F2EFE8',
    borderRadius: 99,
  },
  barFill: {
    height: vs(6),
    borderRadius: 99,
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginTop: vs(14),
  },
  chip: {
    borderRadius: ms(20),
    paddingVertical: vs(3),
    paddingHorizontal: s(10),
  },
});

export default LifestyleTab;
