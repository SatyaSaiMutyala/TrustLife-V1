import React from 'react';
import {View, ScrollView, StyleSheet, Text} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const keyFacts = [
  {
    label: 'Vaccine type',
    value: 'Quadrivalent',
    detail: '4 influenza strains covered',
    iconName: 'flask-outline',
    iconBg: Colors.blueBg,
    iconColor: Colors.blueText,
  },
  {
    label: 'Protection duration',
    value: '~12 months',
    detail: 'Annual renewal required',
    iconName: 'time-outline',
    iconBg: Colors.purpleBg,
    iconColor: Colors.purpleText,
  },
  {
    label: 'Efficacy',
    value: '40\u201360%',
    detail: 'Reduces severity even if infected',
    iconName: 'analytics-outline',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
  },
  {
    label: 'Risk category',
    value: 'High risk',
    detail: 'T2DM + HTN = priority',
    iconName: 'alert-circle-outline',
    iconBg: Colors.redBg,
    iconColor: Colors.redText,
    valueColor: Colors.redText,
  },
];

const zoneCards = [
  {label: 'Weeks 1\u20132', detail: 'Building immunity', bg: Colors.background, color: Colors.textSecondary},
  {label: 'Weeks 3\u201340', detail: 'Peak protection', bg: Colors.tealBg, color: Colors.tealText, active: true},
  {label: 'Weeks 40\u201352', detail: 'Waning \u00B7 Plan renewal', bg: Colors.amberBg, color: Colors.amberText},
];

const whyItMatters = [
  {
    icon: 'heart-outline',
    bg: Colors.redBg,
    color: Colors.redText,
    title: 'Heart risk reduction',
    detail: 'Flu increases heart attack risk 6\u00D7 in first week. Vaccination cuts cardiac events by up to 34% in diabetics.',
  },
  {
    icon: 'pulse-outline',
    bg: Colors.amberBg,
    color: Colors.amberText,
    title: 'Blood pressure stability',
    detail: 'Influenza triggers inflammation that can spike BP 15\u201320 mmHg. Your HTN makes this especially dangerous.',
  },
  {
    icon: 'medkit-outline',
    bg: Colors.blueBg,
    color: Colors.blueText,
    title: 'WHO recommendation',
    detail: 'Annual influenza vaccination is recommended for all patients with diabetes and cardiovascular risk factors.',
  },
];

const strains = [
  {name: 'A/H1N1', description: 'A/Victoria/4897/2022-like virus'},
  {name: 'A/H3N2', description: 'A/Darwin/9/2021-like virus'},
  {name: 'B/Victoria', description: 'B/Austria/1359417/2021-like virus'},
  {name: 'B/Yamagata', description: 'B/Phuket/3073/2013-like virus'},
];

const VaxOverviewTab = () => {
  const renderProtectionInsight = () => (
    <View style={[styles.insightBox, {backgroundColor: Colors.tealBg}]}>
      <Icon family="Ionicons" name="shield-checkmark-outline" size={ms(18)} color={Colors.tealText} />
      <AppText variant="caption" color={Colors.tealText} style={{flex: 1}}>
        You are protected. This vaccine was administered on 10 Sep 2025 and provides coverage through Sep 2026. You are currently in the peak protection window.
      </AppText>
    </View>
  );

  const renderKeyFacts = () => (
    <View style={styles.gridContainer}>
      {keyFacts.map((fact, i) => (
        <View key={i} style={styles.gridItem}>
          <View style={styles.gridCard}>
            <View style={[styles.factIcon, {backgroundColor: fact.iconBg}]}>
              <Icon family="Ionicons" name={fact.iconName} size={ms(16)} color={fact.iconColor} />
            </View>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(6)}}>
              {fact.label}
            </AppText>
            <AppText
              variant="bodyBold"
              color={fact.valueColor || Colors.textPrimary}
              style={{marginTop: vs(2)}}>
              {fact.value}
            </AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
              {fact.detail}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  const renderTimeline = () => (
    <View style={styles.card}>
      <View style={styles.timelineHeader}>
        <AppText variant="bodyBold">Protection validity timeline</AppText>
        <AppText variant="caption" color={Colors.textSecondary}>Sep 2025 \u2013 Sep 2026</AppText>
      </View>

      {/* Timeline bar */}
      <View style={styles.timelineBarContainer}>
        <View style={styles.timelineTrack}>
          {/* Green gradient fill — 50% */}
          <View style={styles.timelineFill} />
          {/* Amber warning zone 84-100% */}
          <View style={styles.timelineAmber} />
        </View>
        {/* TODAY marker */}
        <View style={styles.todayMarker}>
          <View style={[styles.todayPill, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="small" color={Colors.tealText} style={{fontWeight: '700'}}>
              TODAY
            </AppText>
          </View>
          <View style={styles.todayLine} />
        </View>
      </View>

      {/* Labels */}
      <View style={styles.timelineLabels}>
        <AppText variant="small" color={Colors.textTertiary}>Sep 10{'\n'}Vaccinated</AppText>
        <AppText variant="small" color={Colors.tealText} style={{textAlign: 'center'}}>
          Mar 24{'\n'}Today
        </AppText>
        <AppText variant="small" color={Colors.amberText} style={{textAlign: 'right'}}>
          Sep 2026{'\n'}Renew
        </AppText>
      </View>

      {/* Zone cards */}
      <View style={styles.zoneRow}>
        {zoneCards.map((zone, i) => (
          <View
            key={i}
            style={[
              styles.zoneCard,
              {backgroundColor: zone.bg},
              zone.active && styles.zoneCardActive,
            ]}>
            <AppText
              variant="caption"
              color={zone.color}
              style={{fontWeight: zone.active ? '700' : '500'}}>
              {zone.label}
            </AppText>
            <AppText variant="small" color={zone.color} style={{marginTop: vs(2)}}>
              {zone.detail}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );

  const renderWhyItMatters = () => (
    <View>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
        Why this vaccine matters
      </AppText>
      {whyItMatters.map((item, i) => (
        <View key={i} style={[styles.insightCard, {backgroundColor: item.bg}]}>
          <View style={[styles.insightIcon, {backgroundColor: item.bg}]}>
            <Icon family="Ionicons" name={item.icon} size={ms(18)} color={item.color} />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={item.color}>{item.title}</AppText>
            <AppText variant="caption" color={item.color} style={{marginTop: vs(2), opacity: 0.85}}>
              {item.detail}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  const renderStrains = () => (
    <View>
      <AppText variant="bodyBold" style={{marginBottom: vs(8), marginTop: vs(4)}}>
        Strains covered
      </AppText>
      <View style={styles.card}>
        {strains.map((strain, i) => (
          <View
            key={i}
            style={[
              styles.strainRow,
              i < strains.length - 1 && styles.rowBorder,
            ]}>
            <View style={[styles.strainIcon, {backgroundColor: Colors.blueBg}]}>
              <Icon family="Ionicons" name="bug-outline" size={ms(16)} color={Colors.blueText} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold">{strain.name}</AppText>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(1)}}>
                {strain.description}
              </AppText>
            </View>
            <View style={[styles.pill, {backgroundColor: Colors.tealBg}]}>
              <AppText variant="small" color={Colors.tealText}>Covered</AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderProtectionInsight()}
      {renderKeyFacts()}
      {renderTimeline()}
      {renderWhyItMatters()}
      {renderStrains()}
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
    borderRadius: ms(11),
    marginBottom: vs(12),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: s(-4),
    marginBottom: vs(10),
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: s(4),
    marginBottom: vs(8),
  },
  gridCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(12),
  },
  factIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
    marginBottom: vs(10),
  },
  timelineHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(14),
  },
  timelineBarContainer: {
    marginBottom: vs(8),
    position: 'relative',
  },
  timelineTrack: {
    height: vs(10),
    backgroundColor: Colors.background,
    borderRadius: ms(5),
    overflow: 'hidden',
    flexDirection: 'row',
  },
  timelineFill: {
    width: '50%',
    height: '100%',
    backgroundColor: Colors.primary,
    borderTopLeftRadius: ms(5),
    borderBottomLeftRadius: ms(5),
  },
  timelineAmber: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: '16%',
    backgroundColor: Colors.amberBg,
    borderTopRightRadius: ms(5),
    borderBottomRightRadius: ms(5),
  },
  todayMarker: {
    position: 'absolute',
    left: '50%',
    top: -vs(4),
    alignItems: 'center',
    transform: [{translateX: -ms(22)}],
  },
  todayPill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
    marginBottom: vs(2),
  },
  todayLine: {
    width: 1.5,
    height: vs(14),
    backgroundColor: Colors.tealText,
  },
  timelineLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(4),
    marginBottom: vs(12),
  },
  zoneRow: {
    flexDirection: 'row',
    gap: s(6),
  },
  zoneCard: {
    flex: 1,
    padding: ms(10),
    borderRadius: ms(10),
    alignItems: 'center',
  },
  zoneCardActive: {
    borderWidth: 1,
    borderColor: Colors.tealText,
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(10),
    padding: ms(12),
    borderRadius: ms(12),
    marginBottom: vs(8),
  },
  insightIcon: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    alignItems: 'center',
    justifyContent: 'center',
  },
  strainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    gap: s(10),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  strainIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
});

export default VaxOverviewTab;
