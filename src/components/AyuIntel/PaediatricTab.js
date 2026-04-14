import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

const PAED_CARDS = [
  {
    id: 'neonatal',
    sectionLabel: 'Baby Health - Neonatal',
    ico: 'happy-outline',
    icoBg: Colors.tealBg,
    icoColor: Colors.accent,
    title: 'Neonatal health - Baby Zara',
    sub: 'Day 44 - 6 weeks - Phase 1',
    badge: 'On track',
    badgeBg: Colors.tealBg,
    badgeColor: Colors.tealText,
    metrics: [
      {label: 'Weight', value: '3.82 kg', ref: '50th percentile', valueColor: Colors.accent, pillLabel: 'On track', pillBg: Colors.tealBg, pillColor: Colors.tealText},
      {label: 'Length', value: '53.1 cm', ref: '50th percentile', valueColor: Colors.accent, pillLabel: 'Normal', pillBg: Colors.tealBg, pillColor: Colors.tealText},
      {label: 'Head circ.', value: '36.5 cm', ref: '50th percentile', valueColor: Colors.accent, pillLabel: 'Normal', pillBg: Colors.tealBg, pillColor: Colors.tealText},
      {label: 'Avg feeds/day', value: '6-7', ref: 'Target 6-8', valueColor: Colors.accent, pillLabel: 'Good', pillBg: Colors.tealBg, pillColor: Colors.tealText},
      {label: 'Avg sleep/24h', value: '14.5h', ref: 'Target 14-17h', valueColor: Colors.accent, pillLabel: 'Age appropriate', pillBg: Colors.tealBg, pillColor: Colors.tealText},
      {label: 'Newborn screens', value: 'All done', ref: 'Hearing, metabolic, pulse ox', valueColor: Colors.accent, pillLabel: 'Complete', pillBg: Colors.tealBg, pillColor: Colors.tealText},
    ],
    corrTitle: 'Growth trend',
    corrBody: 'Weight gain 28g/day (target 25-30g). Tracking along the 50th percentile for WHO girls at 44 days. Excellent overall growth trajectory.',
  },
  {
    id: 'paediatric',
    sectionLabel: 'Child Health - Paediatric',
    ico: 'body-outline',
    icoBg: Colors.blueBg,
    icoColor: Colors.blue,
    title: 'Child health - Aarav',
    sub: '9y 2m - Phase 2 - IAP 2024',
    badge: 'On track',
    badgeBg: Colors.tealBg,
    badgeColor: Colors.tealText,
    metrics: [
      {label: 'Height', value: '132.4 cm', ref: '65th percentile', valueColor: Colors.accent, pillLabel: 'Normal', pillBg: Colors.tealBg, pillColor: Colors.tealText},
      {label: 'Weight', value: '28.6 kg', ref: '55th percentile', valueColor: Colors.accent, pillLabel: 'Normal', pillBg: Colors.tealBg, pillColor: Colors.tealText},
      {label: 'BMI', value: '16.3', ref: 'Normal range', valueColor: Colors.accent, pillLabel: 'Healthy', pillBg: Colors.tealBg, pillColor: Colors.tealText},
      {label: 'Milestones', value: 'On track', ref: 'SDQ assessment', valueColor: Colors.accent, pillLabel: 'Age-appropriate', pillBg: Colors.tealBg, pillColor: Colors.tealText},
      {label: 'Allergens', value: '3 of 8 done', ref: '5 pending', valueColor: '#D97706', pillLabel: 'In progress', pillBg: Colors.amberBg, pillColor: Colors.amberDark},
      {label: 'Dental', value: '20 teeth', ref: 'Mixed dentition', valueColor: Colors.accent, pillLabel: 'On schedule', pillBg: Colors.tealBg, pillColor: Colors.tealText},
    ],
    corrTitle: 'Development insight',
    corrBody: 'Sustained attention 25+ min, peer friendship quality good, reading fluency on track. Orthodontic review recommended at 9y (IAP guideline). Peanut allergen intro completed safely.',
  },
  {
    id: 'pregnancy',
    sectionLabel: 'Pregnancy - Maternal Health',
    ico: 'flower-outline',
    icoBg: '#FDF0F5',
    icoColor: '#BE185D',
    title: 'Pregnancy - Ananya',
    sub: 'Week 16 - 2nd Trimester - Day 113',
    badge: 'Normal',
    badgeBg: Colors.tealBg,
    badgeColor: Colors.tealText,
    metrics: [
      {label: 'Current week', value: 'Week 16', ref: '2nd trimester', valueColor: '#BE185D', pillLabel: '40%', pillBg: '#FDF0F5', pillColor: '#BE185D'},
      {label: 'BP avg', value: '110/72', ref: 'Normal <140/90', valueColor: Colors.accent, pillLabel: 'Normal', pillBg: Colors.tealBg, pillColor: Colors.tealText},
      {label: 'Weight gain', value: '+4.2 kg', ref: 'Target 1-2 kg/month', valueColor: Colors.accent, pillLabel: 'On track', pillBg: Colors.tealBg, pillColor: Colors.tealText},
      {label: 'Supplement adherence', value: '92%', ref: 'IFA + Calcium + DHA', valueColor: Colors.accent, pillLabel: 'Good', pillBg: Colors.tealBg, pillColor: Colors.tealText},
      {label: 'Next scan', value: 'W18 Anomaly', ref: 'Apr 18 - Apollo', valueColor: '#D97706', pillLabel: '13 days', pillBg: Colors.amberBg, pillColor: Colors.amberDark},
      {label: 'Nausea trend', value: 'Reducing', ref: 'Expected T2 improvement', valueColor: Colors.accent, pillLabel: 'Improving', pillBg: Colors.tealBg, pillColor: Colors.tealText},
    ],
    corrTitle: 'Pregnancy insight',
    corrBody: 'Second trimester energy window active. Iron supplementation critical from Week 14. Anomaly scan in 13 days - all booking bloods normal. Baby size: avocado (11.6 cm, ~100g).',
  },
];

const PaediatricTab = () => {
  const navigation = useNavigation();

  return (
    <View>
      {PAED_CARDS.map((card, ci) => (
        <View key={ci}>
          {/* Section label */}
          <View style={st.secRow}>
            <AppText variant="sectionTitle" color={Colors.textSecondary}>{card.sectionLabel}</AppText>
            <View style={st.secLine} />
          </View>

          {/* Card */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={st.card}
            onPress={() => navigation.navigate('PaediatricAyuDetail', {cardId: card.id, card})}>
            {/* Card header */}
            <View style={st.cardHeader}>
              <View style={[st.icoCircle, {backgroundColor: card.icoBg}]}>
                <Icon family="Ionicons" name={card.ico} size={ms(18)} color={card.icoColor} />
              </View>
              <View style={{flex: 1, marginLeft: s(10)}}>
                <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(13)}}>{card.title}</AppText>
                <AppText variant="small" color={Colors.textTertiary}>{card.sub}</AppText>
              </View>
              <View style={[st.badge, {backgroundColor: card.badgeBg}]}>
                <AppText variant="small" color={card.badgeColor} style={{fontWeight: '700'}}>{card.badge}</AppText>
              </View>
            </View>

            {/* Metrics */}
            {card.metrics.map((m, mi) => (
              <View key={mi} style={[st.metricRow, mi < card.metrics.length - 1 && st.metricBorder]}>
                <View style={{flex: 1}}>
                  <AppText variant="caption" color={Colors.textSecondary}>{m.label}</AppText>
                  {m.ref ? <AppText variant="small" color={Colors.textTertiary}>{m.ref}</AppText> : null}
                </View>
                <AppText variant="bodyBold" color={m.valueColor} style={{fontSize: ms(12), marginRight: s(8)}}>{m.value}</AppText>
                <View style={[st.pill, {backgroundColor: m.pillBg}]}>
                  <AppText variant="small" color={m.pillColor} style={{fontWeight: '600'}}>{m.pillLabel}</AppText>
                </View>
              </View>
            ))}

            {/* Correlation */}
            {card.corrTitle ? (
              <View style={st.corrBox}>
                <AppText variant="caption" color={Colors.tealText}>
                  <AppText style={{fontWeight: '700'}}>{card.corrTitle}: </AppText>
                  {card.corrBody}
                </AppText>
              </View>
            ) : null}

          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const st = StyleSheet.create({
  secRow: {flexDirection: 'row', alignItems: 'center', marginTop: vs(6), marginBottom: vs(8)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2', marginLeft: s(8)},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', marginBottom: vs(14), overflow: 'hidden'},
  cardHeader: {flexDirection: 'row', alignItems: 'center', padding: ms(12), borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'},
  icoCircle: {width: ms(36), height: ms(36), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center'},
  badge: {paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(8)},
  metricRow: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: ms(12), paddingVertical: vs(8)},
  metricBorder: {borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'},
  pill: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(6)},
  corrBox: {backgroundColor: Colors.tealBg, margin: ms(12), marginTop: 0, padding: ms(10), borderRadius: ms(8)},
  chevronRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(4), paddingVertical: vs(10), borderTopWidth: 0.5, borderTopColor: '#f0f4f2'},
});

export default PaediatricTab;
