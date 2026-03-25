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

/* ── Severity dots ── */
const SeverityDots = ({level, max = 5}) => (
  <View style={styles.severityRow}>
    {Array.from({length: max}).map((_, i) => (
      <View
        key={i}
        style={[
          styles.severityDot,
          {
            backgroundColor:
              i < level
                ? level >= 4
                  ? Colors.red
                  : Colors.amber
                : backgroundSecondary,
          },
        ]}
      />
    ))}
    <AppText variant="small" color={Colors.textTertiary} style={{marginLeft: s(4)}}>
      {level}/{max}
    </AppText>
  </View>
);

/* ── Timeline entry ── */
const TimelineEntry = ({dotColor, title, subtitle, detail, severity, pills, isLast}) => (
  <View style={styles.timelineEntry}>
    {/* Spine */}
    <View style={styles.spineCol}>
      <View style={[styles.spineDot, {backgroundColor: dotColor}]} />
      {!isLast && <View style={styles.spineLine} />}
    </View>

    {/* Content */}
    <View style={styles.timelineContent}>
      <AppText variant="bodyBold">{title}</AppText>
      {subtitle ? (
        <AppText
          variant="caption"
          color={Colors.textSecondary}
          style={{marginTop: vs(2)}}>
          {subtitle}
        </AppText>
      ) : null}
      {detail ? (
        <AppText
          variant="caption"
          color={Colors.textSecondary}
          style={{marginTop: vs(2)}}>
          {detail}
        </AppText>
      ) : null}
      {severity != null && (
        <View style={{marginTop: vs(4)}}>
          <SeverityDots level={severity} />
        </View>
      )}
      {pills && pills.length > 0 && (
        <View style={styles.pillRow}>
          {pills.map((p, i) => (
            <View key={i} style={[styles.pill, {backgroundColor: p.bg}]}>
              <AppText variant="small" color={p.color}>
                {p.label}
              </AppText>
            </View>
          ))}
        </View>
      )}
    </View>
  </View>
);

/* ── Insight banner ── */
const InsightBanner = ({bg, iconColor, textColor, text}) => (
  <View style={[styles.insightCard, {backgroundColor: bg}]}>
    <Icon
      family="Ionicons"
      name="information-circle-outline"
      size={18}
      color={iconColor}
    />
    <AppText
      variant="caption"
      color={textColor}
      style={{marginLeft: s(8), flex: 1}}>
      {text}
    </AppText>
  </View>
);

/* ── Main component ── */
const MetSymptomsTab = () => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}>
    {/* Purple insight */}
    <InsightBanner
      bg={Colors.purpleBg}
      iconColor={Colors.purpleText}
      textColor={Colors.purpleText}
      text="2 active symptoms are linked to Metformin usage. One is related to non-adherence, and one is a known long-term side effect."
    />

    {/* Active symptoms */}
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        Active symptoms
      </AppText>

      <TimelineEntry
        dotColor={Colors.red}
        title="Elevated fasting glucose \u00B7 8.4 mmol/L"
        subtitle="Linked to PM dose non-adherence"
        severity={4}
        pills={[
          {label: 'PM adherence 71%', bg: Colors.redBg, color: Colors.redText},
        ]}
      />
      <TimelineEntry
        dotColor={Colors.amber}
        title="Mild anaemia \u00B7 B12 depletion"
        subtitle="Hb 11.8 g/dL \u00B7 B12 supplement started 15 Mar 2026"
        severity={2}
        pills={[
          {
            label: 'Methylcobalamin added',
            bg: Colors.tealBg,
            color: Colors.tealText,
          },
        ]}
        isLast
      />
    </View>

    {/* Resolved symptoms */}
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        Resolved symptoms
      </AppText>

      <TimelineEntry
        dotColor={Colors.textTertiary}
        title="GI nausea"
        subtitle="Sep - Oct 2019 \u00B7 Resolved in 2 weeks"
        detail="Common initial side effect when starting Metformin"
        isLast
      />
    </View>

    {/* Blue emergency insight */}
    <InsightBanner
      bg={Colors.blueBg}
      iconColor={Colors.blueText}
      textColor={Colors.blueText}
      text="Seek emergency care if you experience rapid breathing, muscle pain, unusual fatigue, or stomach pain. These may be signs of lactic acidosis, a rare but serious side effect."
    />
  </ScrollView>
);

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
  timelineEntry: {
    flexDirection: 'row',
    marginBottom: vs(4),
  },
  spineCol: {
    alignItems: 'center',
    width: ms(20),
  },
  spineDot: {
    width: ms(12),
    height: ms(12),
    borderRadius: ms(6),
    marginTop: vs(4),
  },
  spineLine: {
    width: 1.5,
    flex: 1,
    backgroundColor: borderTertiary,
    marginVertical: vs(4),
  },
  timelineContent: {
    flex: 1,
    marginLeft: s(8),
    paddingBottom: vs(14),
  },
  severityRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    marginRight: s(3),
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginTop: vs(6),
  },
  pill: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(12),
  },
});

export default MetSymptomsTab;
