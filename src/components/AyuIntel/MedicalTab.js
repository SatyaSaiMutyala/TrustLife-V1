import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';
import {MEDICAL_CONDITIONS, ORGANS} from '../../constants/ayuIntelData';

/* ─── Section divider (matches HTML .sec) ─── */
const SectionDivider = ({label}) => (
  <View style={styles.sectionRow}>
    <AppText variant="small" color="#888" style={styles.sectionLabel}>
      {label}
    </AppText>
    <View style={styles.sectionLine} />
  </View>
);

/* ─── Risk bar row (matches HTML .risk-row) ─── */
const RiskRow = ({risk}) => (
  <View style={styles.riskRow}>
    <View style={styles.riskLR}>
      <AppText variant="caption" style={{fontWeight: '600'}} color={Colors.textPrimary}>
        {risk.label}
      </AppText>
      <AppText variant="caption" style={{fontWeight: '700'}} color={risk.valueColor}>
        {risk.value}
      </AppText>
    </View>
    <View style={styles.riskBarTrack}>
      <View
        style={[
          styles.riskBarFill,
          {width: `${risk.barWidth}%`, backgroundColor: risk.barColor},
        ]}
      />
    </View>
    <AppText
      variant="small"
      color="#888"
      style={{marginTop: vs(4), lineHeight: ms(15)}}>
      {risk.detail}
    </AppText>
  </View>
);

/* ─── Metric row (matches HTML .mrow) ─── */
const MetricRow = ({metric, isLast}) => (
  <View style={[styles.metricRow, !isLast && styles.metricRowBorder]}>
    <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, fontWeight: '500'}}>
      {metric.label}
    </AppText>
    <View style={{alignItems: 'flex-end'}}>
      <AppText variant="body" style={{fontWeight: '800', fontFamily: 'monospace'}} color={metric.valueColor}>
        {metric.value}
      </AppText>
      {metric.ref ? (
        <AppText variant="small" color="#aaa" style={{marginTop: vs(1)}}>
          {metric.ref}
        </AppText>
      ) : null}
    </View>
    <View style={[styles.pill, {backgroundColor: metric.pillStyle.bg, marginLeft: s(8)}]}>
      <AppText variant="small" color={metric.pillStyle.color} style={{fontWeight: '600'}}>
        {metric.pillLabel}
      </AppText>
    </View>
  </View>
);

/* ─── Condition Card ─── */
const ConditionCard = ({cond}) => {
  const navigation = useNavigation();
  const hasRisks = cond.risks && cond.risks.length > 0;
  const hasMetrics = cond.metrics && cond.metrics.length > 0;

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('BiomarkerDetail', {medicalId: cond.id})}
      style={styles.card}>
      {/* Card header */}
      <View style={styles.cardHeader}>
        <View style={[styles.cardIcon, {backgroundColor: cond.icoBg}]}>
          <Icon family="Ionicons" name={cond.ico} size={ms(16)} color={cond.badgeStyle.color} />
        </View>
        <View style={{flex: 1}}>
          <AppText variant="body" style={{fontWeight: '700'}} color={Colors.textPrimary}>
            {cond.title}
          </AppText>
          <AppText variant="small" color="#888" style={{marginTop: vs(1)}}>
            {cond.sub}
          </AppText>
        </View>
        <View style={[styles.badge, {backgroundColor: cond.badgeStyle.bg}]}>
          <AppText variant="small" color={cond.badgeStyle.color} style={{fontWeight: '700'}}>
            {cond.badge}
          </AppText>
        </View>
      </View>

      {/* Risk rows */}
      {hasRisks && (
        <View style={styles.cardBody}>
          {cond.risks.map((risk, idx) => (
            <RiskRow key={idx} risk={risk} />
          ))}
        </View>
      )}

      {/* Metric rows (for Dyslipidaemia) */}
      {hasMetrics && (
        <View style={styles.cardBody}>
          {cond.metrics.map((metric, idx) => (
            <MetricRow
              key={idx}
              metric={metric}
              isLast={idx === cond.metrics.length - 1}
            />
          ))}
        </View>
      )}
    </TouchableOpacity>
  );
};

/* ─── Organ Row ─── */
const OrganRow = ({organ, isLast}) => {
  const navigation = useNavigation();
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={() => navigation.navigate('BiomarkerDetail', {medicalId: organ.id})}
      style={[styles.organRow, !isLast && styles.organRowBorder]}>
      <View style={[styles.organIcon, {backgroundColor: organ.icoBg}]}>
        <AppText style={{fontSize: ms(18)}}>{organ.ico}</AppText>
      </View>
      <View style={{flex: 1, minWidth: 0}}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AppText variant="body" style={{fontWeight: '700'}} color={Colors.textPrimary}>
            {organ.name}
          </AppText>
          <AppText style={{fontSize: ms(13), color: '#aaa', marginLeft: s(4)}}>
            ›
          </AppText>
        </View>
        <AppText variant="small" color="#666" style={{lineHeight: ms(15), marginTop: vs(2)}}>
          {organ.detail}
        </AppText>
      </View>
      <View style={[styles.pill, {backgroundColor: organ.pillStyle.bg}]}>
        <AppText variant="small" color={organ.pillStyle.color} style={{fontWeight: '600'}}>
          {organ.pillLabel}
        </AppText>
      </View>
    </TouchableOpacity>
  );
};

/* ─── Main MedicalTab ─── */
const MedicalTab = () => {
  return (
    <View>
      {/* Conditions intel section */}
      <SectionDivider label="Conditions intel" />

      {MEDICAL_CONDITIONS.map(cond => (
        <ConditionCard key={cond.id} cond={cond} />
      ))}

      {/* Organs intel section */}
      <SectionDivider label="Organs intel" />

      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <View style={[styles.cardIcon, {backgroundColor: '#E1F5EE'}]}>
            <AppText style={{fontSize: ms(14)}}>🫁</AppText>
          </View>
          <AppText variant="body" style={{fontWeight: '700'}} color={Colors.textPrimary}>
            Organ status · all available data
          </AppText>
        </View>
        {ORGANS.map((organ, idx) => (
          <OrganRow key={organ.id} organ={organ} isLast={idx === ORGANS.length - 1} />
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  /* Section divider */
  sectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginTop: vs(16),
    marginBottom: vs(8),
  },
  sectionLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.9,
    fontSize: ms(9),
  },
  sectionLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#dde8e2',
  },

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#dde8e2',
    overflow: 'hidden',
    marginBottom: vs(10),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(9),
    paddingHorizontal: s(13),
    paddingVertical: vs(11),
    borderBottomWidth: 0.5,
    borderBottomColor: '#edf2ef',
  },
  cardIcon: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    paddingHorizontal: s(13),
    paddingVertical: vs(10),
  },
  badge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(8),
  },

  /* Risk rows */
  riskRow: {
    paddingVertical: vs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: '#f4f4f4',
  },
  riskLR: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(5),
  },
  riskBarTrack: {
    height: ms(7),
    backgroundColor: '#edf2ef',
    borderRadius: ms(4),
    overflow: 'hidden',
  },
  riskBarFill: {
    height: '100%',
    borderRadius: ms(4),
  },

  /* Metric rows */
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    paddingVertical: vs(8),
    paddingHorizontal: s(13),
  },
  metricRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#f4f4f4',
  },
  pill: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },

  /* Organ rows */
  organRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(11),
    paddingVertical: vs(9),
    paddingHorizontal: s(13),
  },
  organRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f4f2',
  },
  organIcon: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MedicalTab;
