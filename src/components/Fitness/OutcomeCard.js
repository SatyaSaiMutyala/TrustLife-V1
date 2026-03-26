import React from 'react';
import {View, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';

const getBMImpact = (name) => {
  const map = {
    Steps:             {value: '~4,200',        direction: 'accumulated'},
    Glucose:           {value: '↓ ~1.2 mmol/L', direction: 'improved'},
    HRV:               {value: '↑ RMSSD',       direction: 'improved'},
    'Resting HR':      {value: '↓ 2–4 bpm',     direction: 'improved'},
    'Blood pressure':  {value: '↓ 3–5 mmHg',    direction: 'improved'},
    Cortisol:          {value: '↓ 12–18%',       direction: 'reduced'},
    VO2max:            {value: '↑ 0.5–1.0',      direction: 'improved'},
    Insulin:           {value: '↓ sensitivity ↑', direction: 'improved'},
    Cholesterol:       {value: '↓ LDL ~3%',      direction: 'improved'},
    Serotonin:         {value: '↑ release',       direction: 'boosted'},
    BDNF:              {value: '↑ 20–30%',        direction: 'elevated'},
    'Sleep quality':   {value: '↑ deep sleep',    direction: 'enhanced'},
    Testosterone:      {value: '↑ 10–15%',        direction: 'elevated'},
    'Growth hormone':  {value: '↑ pulse',         direction: 'stimulated'},
    Endorphins:        {value: '↑ release',        direction: 'boosted'},
    Lactate:           {value: '↑ threshold',      direction: 'adapted'},
    CRP:               {value: '↓ inflammation',   direction: 'reduced'},
    'Body fat':        {value: '↓ oxidation ↑',    direction: 'improved'},
  };
  return map[name] ?? {value: '↑ improved', direction: 'positive'};
};

const OutcomeCard = ({subcat, durationMin = 0, distance}) => {
  if (!subcat) return null;

  const estKcal = Math.round(subcat.met * 64 * (durationMin / 60));
  const metValue = subcat.met ?? 0;
  const activeMin = durationMin;
  const hpsImpact = Math.round(subcat.met * 0.8 + durationMin * 0.15);
  const biomarkers = (subcat.biomarkers ?? []).slice(0, 4);

  return (
    <View style={styles.card}>
      {/* Title */}
      <AppText style={styles.title}>
        {'🔬 Estimated activity outcomes – intelligence layer'}
      </AppText>

      {/* Metrics grid */}
      <View style={styles.metricsRow}>
        <View style={styles.metricBox}>
          <AppText style={[styles.metricValue, {color: '#5DCAA5'}]}>
            {estKcal.toLocaleString()}
          </AppText>
          <AppText style={styles.metricLabel}>EST. KCAL</AppText>
        </View>
        <View style={styles.metricBox}>
          <AppText style={[styles.metricValue, {color: '#FAC775'}]}>
            {metValue.toFixed(1)}
          </AppText>
          <AppText style={styles.metricLabel}>MET VALUE</AppText>
        </View>
        <View style={styles.metricBox}>
          <AppText style={[styles.metricValue, {color: '#93c5fd'}]}>
            {activeMin}
          </AppText>
          <AppText style={styles.metricLabel}>ACTIVE MIN</AppText>
        </View>
      </View>

      {/* Biomarkers grid */}
      {biomarkers.length > 0 && (
        <View style={styles.bioGrid}>
          {biomarkers.map((bm, idx) => {
            const name = typeof bm === 'string' ? bm : bm.name ?? bm;
            const impact = getBMImpact(name);
            return (
              <View key={idx} style={styles.bioBox}>
                <AppText numberOfLines={1} style={styles.bioName}>
                  {name}
                </AppText>
                <AppText style={styles.bioValue}>{impact.value}</AppText>
                <AppText style={styles.bioDirection}>{impact.direction}</AppText>
              </View>
            );
          })}
        </View>
      )}

      {/* HPS score row */}
      <View style={styles.hpsRow}>
        <AppText style={styles.hpsLabel}>HPS score impact</AppText>
        <AppText style={styles.hpsValue}>+{hpsImpact}</AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#071f12',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: 'rgba(93,202,165,0.15)',
    padding: ms(14),
  },
  title: {
    fontSize: ms(11),
    fontWeight: '600',
    color: 'rgba(255,255,255,0.4)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: vs(12),
  },
  metricsRow: {
    flexDirection: 'row',
    gap: s(6),
    marginBottom: vs(10),
  },
  metricBox: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: ms(10),
    paddingVertical: vs(10),
    paddingHorizontal: s(8),
    alignItems: 'center',
  },
  metricValue: {
    fontSize: ms(20),
    fontWeight: '700',
    marginBottom: vs(2),
  },
  metricLabel: {
    fontSize: ms(7),
    fontWeight: '600',
    color: 'rgba(255,255,255,0.3)',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bioGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginBottom: vs(12),
  },
  bioBox: {
    width: '48%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderRadius: ms(8),
    padding: ms(10),
  },
  bioName: {
    fontSize: ms(9),
    fontWeight: '600',
    color: 'rgba(255,255,255,0.55)',
    marginBottom: vs(3),
  },
  bioValue: {
    fontSize: ms(11),
    fontWeight: '700',
    color: '#5DCAA5',
    marginBottom: vs(1),
  },
  bioDirection: {
    fontSize: ms(8),
    fontWeight: '500',
    color: 'rgba(255,255,255,0.35)',
  },
  hpsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'rgba(0,0,0,0.15)',
    borderRadius: ms(10),
    paddingVertical: vs(10),
    paddingHorizontal: s(14),
  },
  hpsLabel: {
    fontSize: ms(11),
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
  },
  hpsValue: {
    fontSize: ms(22),
    fontWeight: '800',
    color: '#5DCAA5',
  },
});

export default OutcomeCard;
