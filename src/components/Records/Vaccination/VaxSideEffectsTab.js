import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const commonSideEffects = [
  {
    icon: 'bandage-outline',
    bg: Colors.amberBg,
    color: Colors.amberText,
    name: 'Injection site soreness',
    description: 'Localised pain, redness or swelling at the deltoid injection site.',
    pct: '60\u201370%',
    pctColor: Colors.amberText,
    timing: '24\u201348h',
  },
  {
    icon: 'bed-outline',
    bg: Colors.blueBg,
    color: Colors.blueText,
    name: 'Fatigue / headache',
    description: 'Generalised tiredness or mild headache as immune system activates.',
    pct: '20\u201330%',
    pctColor: Colors.blueText,
    timing: '12\u201324h',
  },
  {
    icon: 'thermometer-outline',
    bg: Colors.tealBg,
    color: Colors.tealText,
    name: 'Low-grade fever',
    description: 'Mild temperature elevation indicating immune response.',
    pct: '5\u201310%',
    pctColor: Colors.tealText,
    timing: '24h',
  },
];

const rareReactions = [
  {
    icon: 'warning-outline',
    bg: Colors.amberBg,
    color: Colors.amberText,
    name: 'Guillain-Barr\u00e9 syndrome',
    pct: '<0.001%',
    pctColor: Colors.amberText,
    timing: 'Rare \u00B7 Serious',
  },
  {
    icon: 'alert-circle',
    bg: Colors.redBg,
    color: Colors.redText,
    name: 'Anaphylaxis',
    pct: '<0.0001%',
    pctColor: Colors.redText,
    timing: 'Within 15 min',
  },
];

const painReliefRows = [
  {
    icon: 'checkmark-circle',
    bg: Colors.tealBg,
    color: Colors.tealText,
    label: 'Paracetamol (Crocin) \u00B7 Safe',
    description: null,
  },
  {
    icon: 'close-circle',
    bg: Colors.redBg,
    color: Colors.redText,
    label: 'Ibuprofen / NSAIDs \u00B7 Avoid',
    description: 'NSAIDs interact with Metformin and may reduce renal clearance.',
  },
  {
    icon: 'warning-outline',
    bg: Colors.amberBg,
    color: Colors.amberText,
    label: 'Aspirin \u00B7 Not recommended',
    description: null,
  },
];

const VaxSideEffectsTab = () => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Your experience */}
      <AppText variant="bodyBold" style={styles.sectionTitle}>
        Your experience
      </AppText>
      <View style={[styles.experienceCard, {backgroundColor: Colors.tealBg}]}>
        <View style={styles.experienceHeader}>
          <Icon family="Ionicons" name="happy-outline" size={ms(18)} color={Colors.tealText} />
          <AppText variant="bodyBold" color={Colors.tealText} style={{marginLeft: s(6)}}>
            Self-logged reactions {'\u00B7'} Priya
          </AppText>
        </View>
        <AppText variant="caption" color={Colors.tealText} style={{marginTop: vs(6)}}>
          Mild soreness at injection site for 24h, slight fatigue on Day 1, both resolved completely
          by Day 2. No fever, no disruption to daily routine.
        </AppText>
      </View>

      {/* Common side effects */}
      <AppText variant="bodyBold" style={styles.sectionTitle}>
        Common side effects
      </AppText>
      <View style={styles.card}>
        {commonSideEffects.map((item, i) => (
          <View
            key={i}
            style={[
              styles.sideEffectRow,
              i < commonSideEffects.length - 1 && styles.rowBorder,
            ]}>
            <View style={[styles.iconCircle, {backgroundColor: item.bg}]}>
              <Icon family="Ionicons" name={item.icon} size={ms(16)} color={item.color} />
            </View>
            <View style={styles.sideEffectContent}>
              <AppText variant="bodyBold">{item.name}</AppText>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                {item.description}
              </AppText>
            </View>
            <View style={styles.sideEffectRight}>
              <AppText variant="bodyBold" color={item.pctColor}>
                {item.pct}
              </AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
                {item.timing}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      {/* Rare reactions */}
      <AppText variant="bodyBold" style={styles.sectionTitle}>
        Rare reactions
      </AppText>
      <View style={styles.card}>
        {rareReactions.map((item, i) => (
          <View
            key={i}
            style={[
              styles.sideEffectRow,
              i < rareReactions.length - 1 && styles.rowBorder,
            ]}>
            <View style={[styles.iconCircle, {backgroundColor: item.bg}]}>
              <Icon family="Ionicons" name={item.icon} size={ms(16)} color={item.color} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold">{item.name}</AppText>
            </View>
            <View style={styles.sideEffectRight}>
              <AppText variant="bodyBold" color={item.pctColor}>
                {item.pct}
              </AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
                {item.timing}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      {/* Specific to your conditions */}
      <AppText variant="bodyBold" style={styles.sectionTitle}>
        Specific to your conditions
      </AppText>

      {/* Amber insight */}
      <View style={[styles.insightBox, {backgroundColor: Colors.amberBg}]}>
        <Icon family="Ionicons" name="flask-outline" size={ms(16)} color={Colors.amberText} />
        <AppText variant="caption" color={Colors.amberText} style={{flex: 1}}>
          Monitor blood glucose closely for 48 hours after vaccination. Immune activation can
          temporarily raise insulin resistance and fasting glucose levels in T2DM patients.
        </AppText>
      </View>

      {/* Blue insight */}
      <View style={[styles.insightBox, {backgroundColor: Colors.blueBg}]}>
        <Icon family="Ionicons" name="medical-outline" size={ms(16)} color={Colors.blueText} />
        <AppText variant="caption" color={Colors.blueText} style={{flex: 1}}>
          Metformin &amp; Amlodipine {'\u2013'} no known interactions with Fluarix Tetra. Continue
          all medications as prescribed.
        </AppText>
      </View>

      {/* Pain relief */}
      <AppText variant="bodyBold" style={styles.sectionTitle}>
        Pain relief guidance
      </AppText>
      <View style={styles.card}>
        {painReliefRows.map((item, i) => (
          <View
            key={i}
            style={[
              styles.painRow,
              i < painReliefRows.length - 1 && styles.rowBorder,
            ]}>
            <View style={[styles.iconCircle, {backgroundColor: item.bg}]}>
              <Icon family="Ionicons" name={item.icon} size={ms(16)} color={item.color} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold">{item.label}</AppText>
              {item.description && (
                <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                  {item.description}
                </AppText>
              )}
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
  sectionTitle: {
    marginBottom: vs(8),
  },
  experienceCard: {
    padding: ms(12),
    borderRadius: ms(12),
    marginBottom: vs(14),
  },
  experienceHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
    marginBottom: vs(14),
  },
  sideEffectRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(10),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  iconCircle: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
    marginTop: vs(2),
  },
  sideEffectContent: {
    flex: 1,
  },
  sideEffectRight: {
    alignItems: 'flex-end',
    marginLeft: s(8),
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    padding: ms(12),
    borderRadius: ms(12),
    marginBottom: vs(10),
  },
  painRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(10),
  },
});

export default VaxSideEffectsTab;
