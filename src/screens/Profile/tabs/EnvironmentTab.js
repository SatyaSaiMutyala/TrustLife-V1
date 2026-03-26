import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../../components/shared/AppText';
import Colors from '../../../constants/colors';

/* ── data ──────────────────────────────────────────── */

const RESIDENTIAL = [
  {label: 'Area Type', value: 'Urban'},
  {label: 'Housing', value: 'Apartment 3BHK'},
  {label: 'Climate', value: 'Hot semi-arid'},
  {label: 'Green Space', value: 'Moderate, KBR Park 1.2 km'},
  {label: 'Water', value: 'Municipal + RO'},
  {label: 'Noise', value: 'Moderate ~55 dB'},
];

const AIR_QUALITY_FORM = [
  {label: 'Indoor AQ', value: 'Good + purifier'},
  {label: 'Ventilation', value: 'Cross-vent + AC'},
  {label: 'Cooking Fuel', value: 'LPG'},
  {label: 'Smoke Exposure', value: 'None'},
];

const AQI_CHIPS = [
  {label: 'PM2.5 elevated', type: 'warn'},
  {label: 'Ozone seasonal', type: 'warn'},
  {label: 'SO\u2082 acceptable', type: 'on'},
  {label: 'CO acceptable', type: 'on'},
];

const SANITATION = [
  {label: 'Sanitation', value: 'Piped sewage'},
  {label: 'Electricity', value: 'Reliable + UPS'},
  {label: 'Healthcare', value: 'Excellent, Apollo 2.1 km'},
  {label: 'Food Access', value: 'Good'},
  {label: 'Safety', value: 'Good, gated'},
  {label: 'Sun Exposure', value: 'Moderate'},
];

const ENV_RISKS = [
  {label: 'Respiratory', level: 'Moderate'},
  {label: 'Waterborne', level: 'Low'},
  {label: 'MSK', level: 'Moderate'},
  {label: 'Noise', level: 'Low'},
  {label: 'Heat', level: 'Low'},
  {label: 'Eye strain', level: 'High'},
  {label: 'Food safety', level: 'Low'},
];

const riskColor = level => {
  if (level === 'High') return '#D05A6A';
  if (level === 'Moderate') return '#E9A23A';
  return Colors.accent;
};

const chipStyle = type => {
  if (type === 'warn') return {bg: '#FDF3E7', color: '#B5600E'};
  return {bg: Colors.tealBg, color: Colors.accent};
};

/* ── sub-components ────────────────────────────────── */

const EnvCard = ({item}) => (
  <View style={styles.envCard}>
    <AppText variant="small" color="#A09E9A" style={styles.envLabel}>
      {item.label.toUpperCase()}
    </AppText>
    <AppText variant="caption" style={styles.envValue}>{item.value}</AppText>
  </View>
);

const FormRow = ({item, last}) => (
  <View style={[styles.formRow, !last && styles.formRowBorder]}>
    <AppText variant="caption" color="#A09E9A" style={styles.formLabel}>{item.label}</AppText>
    <AppText variant="body" style={styles.formValue}>{item.value}</AppText>
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

const EnvironmentTab = () => {
  const aqiPercent = 94 / 500; // AQI 94 out of max 500

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Info Banner */}
      <View style={styles.infoBanner}>
        <AppText variant="caption" color={Colors.tealText}>
          Environmental factors including air quality, water sources, sanitation and housing conditions significantly influence long-term health outcomes.
        </AppText>
      </View>

      {/* Residential Environment */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>Residential Environment</AppText>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.envGrid}>
            {RESIDENTIAL.map((item, i) => (
              <EnvCard key={i} item={item} />
            ))}
          </View>
        </View>
      </View>

      {/* Air Quality */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>Air Quality</AppText>
        </View>
        <View style={styles.cardBody}>
          {AIR_QUALITY_FORM.map((item, i) => (
            <FormRow key={i} item={item} last={i === AIR_QUALITY_FORM.length - 1} />
          ))}

          {/* AQI indicator */}
          <View style={styles.aqiWrap}>
            <View style={styles.aqiHeader}>
              <AppText variant="bodyBold">AQI</AppText>
              <View style={styles.aqiValueBadge}>
                <AppText variant="bodyBold" color="#B5600E">94</AppText>
                <AppText variant="caption" color="#B5600E"> Moderate</AppText>
              </View>
            </View>
            <View style={styles.aqiBarTrack}>
              <View style={[styles.aqiBarFill, {width: `${aqiPercent * 100}%`}]} />
            </View>
            <View style={styles.aqiLegend}>
              <AppText variant="small" color={Colors.accent}>Good</AppText>
              <AppText variant="small" color="#E9A23A">Moderate</AppText>
              <AppText variant="small" color="#D05A6A">Poor</AppText>
            </View>
          </View>

          {/* Chips */}
          <View style={styles.chipsWrap}>
            {AQI_CHIPS.map((chip, i) => {
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

      {/* Sanitation & Safety */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>Sanitation & Safety</AppText>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.envGrid}>
            {SANITATION.map((item, i) => (
              <EnvCard key={i} item={item} />
            ))}
          </View>
        </View>
      </View>

      {/* Environmental Risk Assessment */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>Environmental Risk Assessment</AppText>
        </View>
        <View style={styles.cardBody}>
          {ENV_RISKS.map((r, i) => (
            <RiskRow key={i} item={r} last={i === ENV_RISKS.length - 1} />
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

  /* Env grid (2x3) */
  envGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
  },
  envCard: {
    width: '47%',
    backgroundColor: '#F9F8F5',
    borderRadius: ms(10),
    padding: s(12),
  },
  envLabel: {
    fontSize: ms(9),
    letterSpacing: 0.5,
    marginBottom: vs(4),
  },
  envValue: {
    fontSize: ms(12),
    color: '#1A1814',
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
  },

  /* AQI */
  aqiWrap: {
    marginTop: vs(14),
    backgroundColor: '#F9F8F5',
    borderRadius: ms(12),
    padding: s(14),
  },
  aqiHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  aqiValueBadge: {
    flexDirection: 'row',
    alignItems: 'baseline',
    backgroundColor: '#FDF3E7',
    borderRadius: ms(20),
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
  },
  aqiBarTrack: {
    height: vs(8),
    borderRadius: ms(4),
    overflow: 'hidden',
    flexDirection: 'row',
  },
  aqiBarFill: {
    height: '100%',
    borderRadius: ms(4),
    backgroundColor: '#E9A23A',
  },
  aqiLegend: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(6),
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
});

export default EnvironmentTab;
