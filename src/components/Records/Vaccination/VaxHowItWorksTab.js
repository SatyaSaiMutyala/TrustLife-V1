import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const immuneSteps = [
  {
    number: 1,
    title: 'Injection \u2013 fragments introduced',
    description:
      'Inactivated viral antigens from four influenza strains are injected intramuscularly into the deltoid.',
  },
  {
    number: 2,
    title: 'Antigen presenting cells activate',
    description:
      'Dendritic cells engulf the viral fragments and present them to helper T-cells in nearby lymph nodes.',
  },
  {
    number: 3,
    title: 'B-cells create antibodies (Days 7\u201314)',
    description:
      'Lymph nodes produce B-lymphocytes that secrete strain-specific IgG antibodies into the bloodstream.',
  },
  {
    number: 4,
    title: 'Memory cells created (Weeks 2\u20134)',
    description:
      'Memory B-cells and T-cells are formed, allowing the immune system to remember the viral antigens long-term.',
  },
  {
    number: 5,
    title: 'Peak protection (Weeks 3\u201340)',
    description:
      'Antibody titres are at their highest, providing maximum defence against matched influenza strains.',
  },
  {
    number: 6,
    title: 'Waning immunity (after ~10 months)',
    description:
      'Antibody titres gradually decline, which is why annual revaccination is recommended.',
  },
];

const efficacyData = [
  {label: 'Prevention of influenza', pct: '40\u201360%', bar: 50},
  {label: 'Reduction in hospitalisation (T2DM)', pct: '60\u201380%', bar: 70},
  {label: 'Reduction in severe illness', pct: '70\u201385%', bar: 77},
  {label: 'Reduction in HbA1c destabilisation', pct: '~50%', bar: 50},
];

const t2dmRows = [
  {
    icon: 'flask-outline',
    bg: Colors.amberBg,
    color: Colors.amberText,
    title: 'Flu raises blood glucose',
    description:
      'Infection triggers cortisol and pro-inflammatory cytokines, both of which increase insulin resistance and raise blood glucose levels.',
  },
  {
    icon: 'thermometer-outline',
    bg: Colors.redBg,
    color: Colors.redText,
    title: 'Immune system less effective in T2DM',
    description:
      'Chronic hyperglycaemia impairs neutrophil function and reduces the adaptive immune response, making infections harder to fight.',
  },
  {
    icon: 'checkmark-circle',
    bg: Colors.tealBg,
    color: Colors.tealText,
    title: 'Vaccine compensates',
    description:
      'Pre-loads the immune system with strain-specific antibodies so it can respond faster, even with impaired baseline immunity.',
  },
];

const VaxHowItWorksTab = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Blue insight */}
      <View style={[styles.insightBox, {backgroundColor: Colors.blueBg}]}>
        <Icon family="Ionicons" name="flask-outline" size={ms(16)} color={Colors.blueText} />
        <AppText variant="caption" color={Colors.blueText} style={{flex: 1}}>
          Fluarix Tetra is an inactivated (killed-virus) quadrivalent vaccine that trains your immune
          system to recognise four influenza strains without causing infection.
        </AppText>
      </View>

      {/* How your immune system responds */}
      <AppText variant="bodyBold" style={styles.sectionTitle}>
        How your immune system responds
      </AppText>
      <View style={styles.card}>
        {immuneSteps.map((step, i) => (
          <View
            key={step.number}
            style={[
              styles.stepRow,
              i < immuneSteps.length - 1 && styles.stepRowBorder,
            ]}>
            <View style={styles.stepNumber}>
              <AppText variant="bodyBold" color={Colors.white}>
                {step.number}
              </AppText>
            </View>
            <View style={styles.stepContent}>
              <AppText variant="bodyBold">{step.title}</AppText>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                {step.description}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      {/* Efficacy section */}
      <AppText variant="bodyBold" style={styles.sectionTitle}>
        Efficacy
      </AppText>
      <View style={styles.card}>
        {efficacyData.map((item, i) => (
          <View key={i} style={[styles.efficacyRow, i < efficacyData.length - 1 && {marginBottom: vs(12)}]}>
            <View style={styles.efficacyLabelRow}>
              <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1}}>
                {item.label}
              </AppText>
              <AppText variant="bodyBold" color={Colors.primary}>
                {item.pct}
              </AppText>
            </View>
            <View style={styles.barTrack}>
              <View style={[styles.barFill, {width: `${item.bar}%`}]} />
            </View>
          </View>
        ))}
        <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(8)}}>
          Source: Cochrane Review 2018, WHO Position Paper 2022, ADA Standards of Care 2025
        </AppText>
      </View>

      {/* T2DM relevance section */}
      <AppText variant="bodyBold" style={styles.sectionTitle}>
        Why this matters for Type 2 Diabetes
      </AppText>
      <View style={styles.card}>
        {t2dmRows.map((row, i) => (
          <View
            key={i}
            style={[
              styles.t2dmRow,
              i < t2dmRows.length - 1 && styles.stepRowBorder,
            ]}>
            <View style={[styles.t2dmIcon, {backgroundColor: row.bg}]}>
              <Icon family="Ionicons" name={row.icon} size={ms(16)} color={row.color} />
            </View>
            <View style={styles.stepContent}>
              <AppText variant="bodyBold">{row.title}</AppText>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                {row.description}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    padding: ms(12),
    borderRadius: ms(12),
    marginBottom: vs(14),
  },
  sectionTitle: {
    marginBottom: vs(8),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
    marginBottom: vs(14),
  },
  stepRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(10),
  },
  stepRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  stepNumber: {
    width: ms(26),
    height: ms(26),
    borderRadius: ms(13),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
    marginTop: vs(2),
  },
  stepContent: {
    flex: 1,
  },
  efficacyRow: {},
  efficacyLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  barTrack: {
    height: vs(6),
    backgroundColor: Colors.background,
    borderRadius: ms(3),
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: ms(3),
    backgroundColor: Colors.teal,
  },
  t2dmRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(10),
  },
  t2dmIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
    marginTop: vs(2),
  },
});

export default VaxHowItWorksTab;
