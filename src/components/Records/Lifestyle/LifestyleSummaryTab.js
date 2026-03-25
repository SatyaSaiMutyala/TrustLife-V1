import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Circle as SvgCircle, Text as SvgText} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const SCORE = 60;
const RING_SIZE = 72;
const STROKE_WIDTH = 7;
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2;
const CIRCUMFERENCE = 2 * Math.PI * RADIUS;
const SCORE_OFFSET = CIRCUMFERENCE * (1 - SCORE / 100);

const scoreRows = [
  {label: 'Food', value: 55, color: Colors.amber},
  {label: 'Sleep', value: 59, color: '#7F77DD'},
  {label: 'Medication', value: 71, color: Colors.lightGreen},
  {label: 'Activity', value: 57, color: Colors.lightGreen},
];

const categoryCards = [
  {
    key: 'food',
    tab: 'food',
    name: 'Food',
    icon: 'restaurant-outline',
    iconBg: Colors.amberBg,
    iconColor: Colors.amberText,
    status: '61% meals logged',
    statusColor: Colors.amberText,
    value: 'GI 58',
    valueColor: Colors.amber,
    ref: 'Target <55',
    barPercent: 0.6,
    barColor: Colors.amber,
    footer: '3 high-GI meals this week \u00B7 Switch dinner rice',
  },
  {
    key: 'sleep',
    tab: 'sleep',
    name: 'Sleep',
    icon: 'moon-outline',
    iconBg: Colors.purpleBg,
    iconColor: Colors.purpleText,
    status: '16% below target',
    statusColor: Colors.purpleText,
    value: '5.9h',
    valueColor: '#7F77DD',
    ref: 'Target 7h',
    barPercent: 0.59,
    barColor: '#7F77DD',
    footer: '5 nights <6h \u00B7 HbA1c linked',
  },
  {
    key: 'medication',
    tab: 'medication',
    name: 'Medication',
    icon: 'medical-outline',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    status: 'PM dose risk',
    statusColor: Colors.amberText,
    value: '71%',
    valueColor: Colors.teal,
    ref: 'Target 90%',
    barPercent: 0.71,
    barColor: Colors.lightGreen,
    footer: 'Amlodipine 100% \u00B7 Metformin PM \u2193',
  },
  {
    key: 'activity',
    tab: 'activity',
    name: 'Activity',
    icon: 'walk-outline',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    status: '82% of target',
    statusColor: Colors.tealText,
    value: '8,240',
    valueColor: Colors.teal,
    ref: 'Target 10k',
    barPercent: 0.82,
    barColor: Colors.lightGreen,
    footer: 'Best category \u00B7 5-day active streak',
  },
];

const trendRows = [
  {label: 'Overall lifestyle score', prev: '65', curr: '60', up: false},
  {label: 'Meals logged', prev: '68%', curr: '61%', up: false},
  {label: 'Sleep avg', prev: '6.1h', curr: '5.9h', up: false},
  {label: 'Medication adherence', prev: '78%', curr: '71%', up: false},
  {label: 'Steps average', prev: '7,880', curr: '8,240', up: true},
];

const LifestyleSummaryTab = ({onTabChange}) => {
  return (
    <View>
      {/* Composite score card */}
      <View style={styles.scoreCard}>
        <View style={styles.scoreRow}>
          <View style={styles.ringWrap}>
            <Svg width={RING_SIZE} height={RING_SIZE}>
              <SvgCircle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke="rgba(255,255,255,0.15)"
                strokeWidth={STROKE_WIDTH}
              />
              <SvgCircle
                cx={RING_SIZE / 2}
                cy={RING_SIZE / 2}
                r={RADIUS}
                fill="none"
                stroke={Colors.lightGreen}
                strokeWidth={STROKE_WIDTH}
                strokeLinecap="round"
                strokeDasharray={CIRCUMFERENCE}
                strokeDashoffset={SCORE_OFFSET}
                rotation="-90"
                origin={`${RING_SIZE / 2}, ${RING_SIZE / 2}`}
              />
              <SvgText
                x={RING_SIZE / 2}
                y={RING_SIZE / 2 + 1}
                textAnchor="middle"
                alignmentBaseline="central"
                fontSize={18}
                fontWeight="700"
                fill="#fff">
                {SCORE}
              </SvgText>
            </Svg>
          </View>

          <View style={styles.scoreDetails}>
            <AppText variant="caption" color="rgba(255,255,255,0.6)" style={{marginBottom: vs(6)}}>
              Lifestyle score · Mar 2026
            </AppText>
            {scoreRows.map(row => (
              <View key={row.label} style={styles.scoreBarRow}>
                <AppText variant="small" color="rgba(255,255,255,0.6)" style={styles.scoreBarLabel}>
                  {row.label}
                </AppText>
                <View style={styles.scoreBarTrack}>
                  <View style={[styles.scoreBarFill, {width: `${row.value}%`, backgroundColor: row.color}]} />
                </View>
                <AppText variant="small" color={Colors.white} style={styles.scoreBarValue}>
                  {row.value}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 4-category cards grid */}
      <View style={styles.cardGrid}>
        {categoryCards.map(card => (
          <TouchableOpacity
            key={card.key}
            style={styles.categoryCard}
            activeOpacity={0.7}
            onPress={() => onTabChange && onTabChange(card.tab)}>
            <View style={styles.cardHeader}>
              <View style={[styles.cardIconWrap, {backgroundColor: card.iconBg}]}>
                <Icon family="Ionicons" name={card.icon} size={18} color={card.iconColor} />
              </View>
              <View style={styles.cardHeaderText}>
                <AppText variant="bodyBold" style={{fontSize: ms(13)}}>{card.name}</AppText>
                <AppText variant="caption" color={card.statusColor} numberOfLines={1}>{card.status}</AppText>
              </View>
            </View>

            <View style={styles.cardMetric}>
              <AppText style={{fontSize: ms(18), fontWeight: '700', color: card.valueColor, lineHeight: ms(22)}}>
                {card.value}
              </AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(1)}}>
                Avg {'\u00B7'} {card.ref}
              </AppText>
              <View style={styles.cardBarTrack}>
                <View style={[styles.cardBarFill, {width: `${card.barPercent * 100}%`, backgroundColor: card.barColor}]} />
              </View>
            </View>

            <View style={styles.cardFooter}>
              <AppText variant="small" color={Colors.textSecondary} numberOfLines={2}>
                {card.footer}
              </AppText>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ayu insight */}
      <View style={styles.ayuCard}>
        <View style={styles.ayuIconWrap}>
          <Icon family="Ionicons" name="robot-outline" size={18} color={Colors.amberText} />
        </View>
        <View style={{flex: 1, marginLeft: s(10)}}>
          <AppText variant="bodyBold" color={Colors.amberText} style={{marginBottom: vs(2)}}>
            Ayu's monthly summary
          </AppText>
          <AppText variant="caption" color={Colors.amberText}>
            Sleep is the critical lever this month. Improving bedtime consistency could lift your overall lifestyle score by 8-10 points and support better glucose control.
          </AppText>
        </View>
      </View>

      {/* Month comparison card */}
      <View style={styles.comparisonCard}>
        <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>Month-over-month</AppText>
        {trendRows.map((row, idx) => (
          <View key={row.label} style={[styles.trendRow, idx < trendRows.length - 1 && styles.trendRowBorder]}>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.trendLabel} numberOfLines={1}>
              {row.label}
            </AppText>
            <View style={styles.trendRight}>
              <AppText variant="small" color={Colors.textTertiary}>{row.prev}</AppText>
              <Icon
                family="Ionicons"
                name={row.up ? 'arrow-up' : 'arrow-down'}
                size={12}
                color={row.up ? Colors.teal : Colors.red}
              />
              <AppText variant="caption" color={row.up ? Colors.teal : Colors.red} style={{fontWeight: '600'}}>
                {row.curr}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      {/* Doctor shared insight */}
      <View style={styles.doctorCard}>
        <Icon family="Ionicons" name="stethoscope" size={18} color={Colors.tealText} />
        <AppText variant="caption" color={Colors.tealText} style={{flex: 1, marginLeft: s(10)}}>
          This lifestyle summary was shared with Dr. Kavitha on 20 Mar 2026. Next review scheduled for 15 Apr.
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  /* Composite score card */
  scoreCard: {
    backgroundColor: Colors.primary,
    borderRadius: ms(16),
    padding: ms(16),
    marginBottom: vs(12),
  },
  scoreRow: {flexDirection: 'row', alignItems: 'center'},
  ringWrap: {marginRight: s(14)},
  scoreDetails: {flex: 1},
  scoreBarRow: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(5)},
  scoreBarLabel: {width: s(65)},
  scoreBarTrack: {
    flex: 1,
    height: vs(5),
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: ms(3),
    overflow: 'hidden',
    marginHorizontal: s(6),
  },
  scoreBarFill: {height: '100%', borderRadius: ms(3)},
  scoreBarValue: {width: s(22), textAlign: 'right'},

  /* 4-category grid */
  cardGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  categoryCard: {
    width: '48.5%',
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    marginBottom: vs(10),
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(10),
    paddingBottom: 0,
  },
  cardIconWrap: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardHeaderText: {marginLeft: s(8), flex: 1},
  cardMetric: {paddingHorizontal: ms(10), paddingTop: vs(6), paddingBottom: vs(4)},
  cardBarTrack: {
    height: vs(4),
    backgroundColor: Colors.background,
    borderRadius: ms(2),
    overflow: 'hidden',
    marginTop: vs(6),
  },
  cardBarFill: {height: '100%', borderRadius: ms(2)},
  cardFooter: {
    backgroundColor: Colors.background,
    paddingHorizontal: ms(10),
    paddingVertical: vs(8),
    marginTop: vs(8),
  },

  /* Ayu insight */
  ayuCard: {
    backgroundColor: Colors.amberBg,
    borderRadius: ms(14),
    padding: ms(14),
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(12),
  },
  ayuIconWrap: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: 'rgba(186,117,23,0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Month comparison */
  comparisonCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(14),
    marginBottom: vs(12),
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(8),
  },
  trendRowBorder: {borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  trendLabel: {flex: 1, marginRight: s(8)},
  trendRight: {flexDirection: 'row', alignItems: 'center', gap: s(6)},

  /* Doctor shared */
  doctorCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(14),
    padding: ms(14),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
});

export default LifestyleSummaryTab;
