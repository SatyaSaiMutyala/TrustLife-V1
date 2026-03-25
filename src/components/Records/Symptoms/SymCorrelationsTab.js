import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const backgroundSecondary = '#F3F4F6';
const borderTertiary = '#d1d5db';

/* ─── data ─── */
const CORRELATIONS = [
  {
    icon: 'moon-outline',
    iconBg: Colors.blueBg,
    name: 'Sleep hours',
    desc: 'Very strong · r = \u22120.81 · p < 0.001',
    bars: 5,
    stat: 'Dominant driver',
    value: 'r = 0.81',
    valueColor: Colors.red,
    label: 'Very strong',
  },
  {
    icon: 'water-outline',
    iconBg: Colors.pinkBg,
    name: 'Haemoglobin (Hb 11.8)',
    desc: 'Moderate · Baseline contributor',
    bars: 3,
    stat: 'Baseline load',
    value: 'Hb 11.8',
    valueColor: Colors.amber,
    label: 'Moderate',
  },
  {
    icon: 'flask-outline',
    iconBg: Colors.amberBg,
    name: 'Fasting glucose',
    desc: 'Moderate · r = 0.52',
    bars: 3,
    stat: 'Bidirectional',
    value: 'r = 0.52',
    valueColor: Colors.amber,
    label: 'Moderate',
  },
  {
    icon: 'medical-outline',
    iconBg: Colors.purpleBg,
    name: 'Metformin PM dose',
    desc: 'Weak-moderate · +1.3/10 on missed days',
    bars: 2,
    stat: 'Missed dose',
    value: '+1.3',
    valueColor: Colors.textSecondary,
    label: 'Weak-moderate',
  },
  {
    icon: 'walk-outline',
    iconBg: Colors.tealBg,
    name: 'Daily step count',
    desc: 'Weak · Likely effect not cause',
    bars: 1,
    stat: 'Effect not cause',
    value: 'Weak',
    valueColor: Colors.textSecondary,
    label: 'Weak',
  },
  {
    icon: 'pulse-outline',
    iconBg: Colors.tealBg,
    name: 'Heart rate variability',
    desc: 'Moderate · HRV <35ms = predictor',
    bars: 3,
    stat: 'Threshold',
    value: '35ms',
    valueColor: Colors.amber,
    label: 'Moderate',
  },
];

const CHAIN_ROW_1 = [
  {label: 'Poor sleep (<6h)', bg: Colors.blueBg, color: Colors.blueText},
  {label: 'Cortisol', bg: Colors.amberBg, color: Colors.amberText, arrow: true},
  {label: 'Glucose', bg: Colors.amberBg, color: Colors.amberText, arrow: true},
  {label: 'Fatigue', bg: Colors.pinkBg, color: Colors.redText, arrow: true},
];

const CHAIN_ROW_2_SOURCES = [
  {label: 'Hb 11.8 (low)', bg: Colors.purpleBg, color: Colors.purpleText},
  {label: 'B12 deficiency', bg: Colors.purpleBg, color: Colors.purpleText},
];

const CHAIN_ROW_2_TARGET = {
  label: 'Baseline load',
  bg: Colors.pinkBg,
  color: Colors.redText,
};

/* ─── sub-components ─── */
const StrengthBars = ({filled, total = 5}) => (
  <View style={styles.barsRow}>
    {Array.from({length: total}).map((_, i) => (
      <View
        key={i}
        style={[
          styles.strengthBar,
          {backgroundColor: i < filled ? Colors.primary : backgroundSecondary},
        ]}
      />
    ))}
  </View>
);

/* ─── component ─── */
const SymCorrelationsTab = () => {
  const renderCorrelationRow = (item, idx) => (
    <View
      key={idx}
      style={[
        styles.corrRow,
        idx < CORRELATIONS.length - 1 && styles.corrRowBorder,
      ]}>
      {/* Icon */}
      <View style={[styles.corrIcon, {backgroundColor: item.iconBg}]}>
        <Icon family="Ionicons" name={item.icon} size={ms(18)} color={Colors.textPrimary} />
      </View>

      {/* Middle content */}
      <View style={styles.corrMiddle}>
        <AppText variant="bodyBold">{item.name}</AppText>
        <StrengthBars filled={item.bars} />
        <AppText variant="small" color={Colors.textTertiary}>{item.stat}</AppText>
        <AppText variant="caption" color={Colors.textSecondary} numberOfLines={2}>
          {item.desc}
        </AppText>
      </View>

      {/* Right value */}
      <View style={styles.corrRight}>
        <AppText variant="bodyBold" color={item.valueColor}>{item.value}</AppText>
        <AppText variant="small" color={Colors.textTertiary}>{item.label}</AppText>
      </View>
    </View>
  );

  const renderChainPill = (item, idx) => (
    <View key={idx} style={styles.chainStep}>
      {item.arrow && (
        <AppText variant="small" color={Colors.textTertiary} style={{marginRight: s(4)}}>
          {'\u2192'}
        </AppText>
      )}
      <View style={[styles.chainPill, {backgroundColor: item.bg}]}>
        <AppText variant="small" color={item.color}>{item.label}</AppText>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Red insight */}
      <View style={[styles.insightCard, {backgroundColor: Colors.redBg}]}>
        <Icon family="Ionicons" name="analytics-outline" size={ms(18)} color={Colors.redText} />
        <AppText variant="caption" color={Colors.redText} style={{marginLeft: s(8), flex: 1}}>
          Ayu has analysed fatigue against 7 health variables across 24 days of data to find what matters most.
        </AppText>
      </View>

      {/* Correlation card */}
      <View style={styles.card}>
        {CORRELATIONS.map(renderCorrelationRow)}
      </View>

      {/* Chain reaction card */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(12)}}>
          The chain driving your fatigue
        </AppText>

        {/* Row 1 */}
        <View style={styles.chainRow}>
          {CHAIN_ROW_1.map(renderChainPill)}
        </View>

        {/* Row 2 */}
        <View style={[styles.chainRow, {marginTop: vs(8)}]}>
          {CHAIN_ROW_2_SOURCES.map((item, idx) => (
            <View key={idx} style={styles.chainStep}>
              {idx > 0 && (
                <AppText variant="small" color={Colors.textTertiary} style={{marginRight: s(4)}}>
                  +
                </AppText>
              )}
              <View style={[styles.chainPill, {backgroundColor: item.bg}]}>
                <AppText variant="small" color={item.color}>{item.label}</AppText>
              </View>
            </View>
          ))}
          <View style={styles.chainStep}>
            <AppText variant="small" color={Colors.textTertiary} style={{marginRight: s(4)}}>
              {'\u2192'}
            </AppText>
            <View style={[styles.chainPill, {backgroundColor: CHAIN_ROW_2_TARGET.bg}]}>
              <AppText variant="small" color={CHAIN_ROW_2_TARGET.color}>
                {CHAIN_ROW_2_TARGET.label}
              </AppText>
            </View>
          </View>
        </View>

        {/* Note */}
        <View style={styles.chainNote}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(14)} color={Colors.textTertiary} />
          <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(6), flex: 1}}>
            The anaemia acts as a baseline amplifier -- even on good-sleep days, fatigue sits 1-2 points higher than expected.
          </AppText>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: s(4),
    paddingBottom: vs(32),
    gap: vs(12),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    padding: ms(14),
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    padding: ms(14),
  },
  corrRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(10),
  },
  corrRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: borderTertiary,
  },
  corrIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  corrMiddle: {
    flex: 1,
    gap: vs(2),
  },
  corrRight: {
    alignItems: 'flex-end',
    marginLeft: s(8),
    minWidth: s(60),
  },
  barsRow: {
    flexDirection: 'row',
    gap: s(3),
    marginVertical: vs(2),
  },
  strengthBar: {
    width: s(16),
    height: vs(4),
    borderRadius: ms(2),
  },
  chainRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    gap: vs(4),
  },
  chainStep: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chainPill: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(12),
  },
  chainNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: vs(12),
    paddingTop: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: borderTertiary,
  },
});

export default SymCorrelationsTab;
