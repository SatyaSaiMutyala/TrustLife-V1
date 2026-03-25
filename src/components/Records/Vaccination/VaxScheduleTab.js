import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const timelineItems = [
  {
    dotColor: Colors.primary,
    date: '10 Sep 2025',
    statusLabel: 'Done',
    statusColor: Colors.tealText,
    name: 'Fluarix Tetra \u00B7 2025\u201326 season',
    detail: '0.5ml \u00B7 Left deltoid \u00B7 Kamineni Hospital \u00B7 Batch FT25-HYD-441-B2',
  },
  {
    dotColor: Colors.lightGreen,
    date: '15 Oct 2024',
    statusLabel: 'Done',
    statusColor: Colors.tealText,
    name: 'Fluarix Tetra \u00B7 2024\u201325 season',
    detail: '0.5ml \u00B7 KIMS Hospital',
  },
  {
    dotColor: Colors.lightGreen,
    date: '2 Sep 2023',
    statusLabel: 'Done',
    statusColor: Colors.tealText,
    name: 'Influvac Tetra \u00B7 2023\u201324 season',
    detail: '0.5ml \u00B7 Kamineni Hospital',
  },
  {
    dotColor: Colors.amber,
    date: '2021\u201322 season',
    statusLabel: 'Missed',
    statusColor: Colors.amberText,
    name: 'No vaccination on record',
    nameColor: Colors.textTertiary,
    detail: 'Gap year. Consider importing.',
  },
  {
    dotColor: BORDER,
    date: 'Before 2021',
    statusLabel: 'Pre-TrustLife',
    statusColor: Colors.textTertiary,
    name: 'Record not available',
    detail: 'Not yet imported. Tap to request.',
  },
];

const recommendedVaccines = [
  {
    icon: 'shield-outline',
    iconBg: Colors.purpleBg,
    iconColor: Colors.purpleText,
    title: 'Pneumococcal vaccine (PPSV23)',
    subtitle: 'Not yet received \u00B7 High priority',
    pillLabel: 'Not done',
    pillBg: Colors.redBg,
    pillColor: Colors.redText,
    footerBg: Colors.tealBg,
    footerColor: Colors.tealText,
    footerText: 'ICMR and ADA recommend PPSV23 for adults with diabetes. One-time dose provides long-term protection against pneumococcal disease.',
  },
  {
    icon: 'shield-checkmark-outline',
    iconBg: Colors.blueBg,
    iconColor: Colors.blueText,
    title: 'COVID-19 booster',
    subtitle: 'Last dose: Oct 2022',
    pillLabel: 'Consider',
    pillBg: Colors.amberBg,
    pillColor: Colors.amberText,
    footerBg: Colors.amberBg,
    footerColor: Colors.amberText,
    footerText: 'Updated bivalent boosters available. Consult your physician about timing given your last dose was over 3 years ago.',
  },
  {
    icon: 'shield-checkmark-outline',
    iconBg: '#EAF3DE',
    iconColor: '#4A7C23',
    title: 'Hepatitis B \u00B7 Series complete',
    subtitle: '3-dose series Mar 2022',
    pillLabel: 'Complete',
    pillBg: Colors.tealBg,
    pillColor: Colors.tealText,
    footerBg: Colors.tealBg,
    footerColor: Colors.tealText,
    footerText: 'Full 3-dose series completed. No further action required. Antibody titres confirmed protective.',
  },
];

const VaxScheduleTab = () => {
  const renderTimeline = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={styles.cardTitle}>
        Influenza vaccination history
      </AppText>

      {timelineItems.map((item, i) => {
        const isLast = i === timelineItems.length - 1;
        return (
          <View key={i} style={styles.timelineRow}>
            {/* Spine */}
            <View style={styles.spineColumn}>
              <View style={[styles.timelineDot, {backgroundColor: item.dotColor}]} />
              {!isLast && <View style={styles.timelineLine} />}
            </View>

            {/* Content */}
            <View style={styles.timelineContent}>
              <View style={styles.timelineDateRow}>
                <AppText variant="caption" color={Colors.textSecondary}>
                  {item.date}
                </AppText>
                <AppText variant="small" color={item.statusColor} style={{marginLeft: s(6)}}>
                  {'\u00B7'} {item.statusLabel}
                </AppText>
              </View>
              <AppText
                variant="bodyBold"
                color={item.nameColor || Colors.textPrimary}
                style={{marginTop: vs(2)}}>
                {item.name}
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                {item.detail}
              </AppText>
            </View>
          </View>
        );
      })}
    </View>
  );

  const renderUpcoming = () => (
    <View>
      <AppText variant="bodyBold" style={styles.sectionTitle}>
        Upcoming {'\u00B7'} Renewal due
      </AppText>

      <View style={styles.card}>
        <View style={styles.dueRow}>
          <View style={[styles.dueIcon, {backgroundColor: Colors.amberBg}]}>
            <Icon family="Ionicons" name="calendar-outline" size={ms(18)} color={Colors.amberText} />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold">Influenza vaccine {'\u00B7'} Annual renewal</AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
              Due: Sep 2026 {'\u00B7'} 6 months away
            </AppText>
            <View style={[styles.pill, {backgroundColor: Colors.amberBg, alignSelf: 'flex-start', marginTop: vs(6)}]}>
              <AppText variant="small" color={Colors.amberText}>Plan ahead</AppText>
            </View>
          </View>
        </View>

        <View style={[styles.footerBand, {backgroundColor: Colors.amberBg}]}>
          <AppText variant="small" color={Colors.amberText}>
            The 2026{'\u2013'}27 season formulation will be released by WHO in late 2026. Book early for best availability.
          </AppText>
        </View>
      </View>
    </View>
  );

  const renderRecommended = () => (
    <View>
      <AppText variant="bodyBold" style={styles.sectionTitle}>
        Other recommended vaccines
      </AppText>

      {recommendedVaccines.map((vax, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.dueRow}>
            <View style={[styles.dueIcon, {backgroundColor: vax.iconBg}]}>
              <Icon family="Ionicons" name={vax.icon} size={ms(18)} color={vax.iconColor} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold">{vax.title}</AppText>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                {vax.subtitle}
              </AppText>
              <View style={[styles.pill, {backgroundColor: vax.pillBg, alignSelf: 'flex-start', marginTop: vs(6)}]}>
                <AppText variant="small" color={vax.pillColor}>{vax.pillLabel}</AppText>
              </View>
            </View>
          </View>

          <View style={[styles.footerBand, {backgroundColor: vax.footerBg}]}>
            <AppText variant="small" color={vax.footerColor}>
              {vax.footerText}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderTimeline()}
      {renderUpcoming()}
      {renderRecommended()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
    marginBottom: vs(10),
    overflow: 'hidden',
  },
  cardTitle: {
    marginBottom: vs(10),
  },
  sectionTitle: {
    marginBottom: vs(8),
    marginTop: vs(6),
  },
  /* Timeline */
  timelineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  spineColumn: {
    width: ms(20),
    alignItems: 'center',
    marginRight: s(8),
  },
  timelineDot: {
    width: ms(12),
    height: ms(12),
    borderRadius: ms(6),
    marginTop: vs(3),
  },
  timelineLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: BORDER,
    marginVertical: vs(2),
  },
  timelineContent: {
    flex: 1,
    paddingBottom: vs(14),
  },
  timelineDateRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  /* Due cards */
  dueRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  dueIcon: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
    marginTop: vs(2),
  },
  pill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
  footerBand: {
    marginTop: vs(10),
    marginHorizontal: ms(-13),
    marginBottom: ms(-13),
    paddingHorizontal: ms(13),
    paddingVertical: vs(8),
  },
});

export default VaxScheduleTab;
