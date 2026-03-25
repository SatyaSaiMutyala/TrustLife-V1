import React, {useState} from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';
const BG_SECONDARY = Colors.backgroundSecondary || '#f5f5f5';

const calendarDays = [
  {day: 'M', date: 17},
  {day: 'T', date: 18},
  {day: 'W', date: 19},
  {day: 'T', date: 20},
  {day: 'F', date: 21},
  {day: 'S', date: 22},
  {day: 'S', date: 23},
  {day: 'M', date: 24, active: true},
  {day: 'T', date: 25},
  {day: 'W', date: 26},
];

const months = ['Jan', 'Feb', 'Mar'];

const heroMetrics = [
  {label: 'Steps', value: '8,240', target: '/ 10,000', pct: 82, barColor: Colors.teal},
  {label: 'Active min', value: '42', target: null, pct: 70, barColor: Colors.teal},
  {label: 'km walked', value: '5.8', target: null, pct: 72, barColor: Colors.amber},
];

const hrZones = [
  {label: 'Rest', color: Colors.blue, flex: 8},
  {label: 'Fat burn', color: Colors.lightGreen, flex: 5},
  {label: 'Cardio', color: Colors.teal, flex: 3},
  {label: 'Peak', color: Colors.primary, flex: 1},
];

const hrDetails = [
  {label: 'Resting', time: '9h 12m'},
  {label: 'Fat burn', time: '28m'},
  {label: 'Cardio', time: '12m'},
  {label: 'Peak', time: '2m'},
];

const activityBreakdown = [
  {
    title: 'Morning walk',
    time: '7:50 AM',
    icon: 'walk-outline',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    detail: '22 min \u00B7 2,400 steps \u00B7 1.7 km',
    status: 'Done',
    statusColor: Colors.tealText,
    statusBg: Colors.tealBg,
  },
  {
    title: 'Office steps',
    time: null,
    icon: 'business-outline',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    detail: '4,800 steps \u00B7 Stairs x6 flights',
    status: 'Active',
    statusColor: Colors.tealText,
    statusBg: Colors.tealBg,
  },
  {
    title: 'Post-dinner walk',
    time: null,
    icon: 'restaurant-outline',
    iconBg: BG_SECONDARY,
    iconColor: Colors.textTertiary,
    detail: 'Target: 20 min after dinner',
    status: 'Pending',
    statusColor: Colors.tealText,
    statusBg: Colors.tealBg,
  },
];

const hydrationBars = [
  {height: 0.6, color: Colors.teal},
  {height: 0.8, color: Colors.teal},
  {height: 0.45, color: Colors.blue},
  {height: 0.7, color: Colors.teal},
  {height: 0.35, color: Colors.blue},
];

// Monthly data
const monthlyStats = [
  {label: 'Avg steps', value: '8,240', bg: Colors.tealBg, color: Colors.tealText},
  {label: 'Avg active min', value: '38m', bg: Colors.tealBg, color: Colors.tealText},
  {label: 'Hydration', value: '56%', bg: Colors.amberBg, color: Colors.amberText},
  {label: 'Dinner walks', value: '8', bg: Colors.tealBg, color: Colors.tealText},
];

// Steps heatmap: March 2026 calendar grid (matches HTML)
const heatmapData = [
  // Row 1 (6 empty + day 1)
  {day: null}, {day: null}, {day: null}, {day: null}, {day: null}, {day: null}, {day: 1, steps: '8.2k', c: 'amber'},
  // Row 2
  {day: 2, steps: '10.1k', c: 'green'}, {day: 3, steps: '11.2k', c: 'green'}, {day: 4, steps: '9.1k', c: 'amber'}, {day: 5, steps: '8.8k', c: 'amber'}, {day: 6, steps: '5.2k', c: 'red'}, {day: 7, steps: '7.4k', c: 'amber'},
  // Row 3
  {day: 8, steps: '6.1k', c: 'red'}, {day: 9, steps: '8.0k', c: 'amber'}, {day: 10, steps: '7.9k', c: 'amber'}, {day: 11, steps: '8.4k', c: 'amber'}, {day: 12, steps: '10.2k', c: 'green'}, {day: 13, steps: '12.1k', c: 'green'}, {day: 14, steps: '13.4k', c: 'green'},
  // Row 4
  {day: 15, steps: '7.8k', c: 'amber'}, {day: 16, steps: '8.1k', c: 'amber'}, {day: 17, steps: '8.6k', c: 'amber'}, {day: 18, steps: '10.0k', c: 'green'}, {day: 19, steps: '11.8k', c: 'green'}, {day: 20, steps: '6.4k', c: 'red'}, {day: 21, steps: '14.2k', c: 'green'},
  // Row 5
  {day: 22, steps: '9.2k', c: 'amber'}, {day: 23, steps: '8.8k', c: 'amber'}, {day: 24, steps: '8.2k', c: 'amber'},
];

const weeklyTrend = [
  {label: 'Week 1', value: '8,960', color: Colors.tealText, barColor: Colors.teal, pct: 90},
  {label: 'Week 2', value: '9,100', color: Colors.tealText, barColor: Colors.teal, pct: 91},
  {label: 'Week 3', value: '8,810', color: Colors.tealText, barColor: Colors.teal, pct: 88},
  {label: 'Week 4', value: '8,730', color: Colors.amberText, barColor: Colors.amber, pct: 87},
];

const clinicalImpact = [
  {label: 'Fasting glucose walk days', pct: 54, color: Colors.tealText, barColor: Colors.teal, value: '7.4 mmol'},
  {label: 'Fasting glucose no walk', pct: 75, color: Colors.redText, barColor: Colors.red, value: '8.9 mmol'},
  {label: 'HRV walk days', pct: 58, color: Colors.tealText, barColor: Colors.teal, value: '52ms'},
  {label: 'Sleep quality walk days', pct: 72, color: Colors.tealText, barColor: Colors.teal, value: '78 score'},
];


const LifestyleActivityTab = () => {
  const [view, setView] = useState('daily');

  const renderToggle = () => (
    <View style={styles.toggleRow}>
      {['daily', 'monthly'].map(v => (
        <TouchableOpacity
          key={v}
          style={[styles.toggleBtn, view === v && styles.toggleBtnActive]}
          onPress={() => setView(v)}
          activeOpacity={0.7}>
          <AppText
            variant="caption"
            color={view === v ? Colors.white : Colors.textSecondary}
            style={{fontWeight: view === v ? '600' : '400'}}>
            {v.charAt(0).toUpperCase() + v.slice(1)}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDateNav = () => (
    <View style={styles.dateNav}>
      <TouchableOpacity activeOpacity={0.7}>
        <Icon family="Ionicons" name="chevron-back" size={ms(18)} color={Colors.textSecondary} />
      </TouchableOpacity>
      <AppText variant="bodyBold">Tue, 24 Mar 2026</AppText>
      <TouchableOpacity activeOpacity={0.7}>
        <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  const renderCalendarStrip = () => (
    <View style={styles.calendarStrip}>
      {calendarDays.map((d, i) => (
        <TouchableOpacity
          key={i}
          style={[styles.calDay, d.active && styles.calDayActive]}
          activeOpacity={0.7}>
          <AppText variant="small" color={d.active ? Colors.white : Colors.textTertiary}>
            {d.day}
          </AppText>
          <AppText
            variant="caption"
            color={d.active ? Colors.white : Colors.textPrimary}
            style={{fontWeight: d.active ? '700' : '500', marginTop: vs(2)}}>
            {d.date}
          </AppText>
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderDailyView = () => (
    <View>
      {/* Hero card */}
      <View style={[styles.card, {borderRadius: ms(16)}]}>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(10)}}>
          Today's activity {'\u00B7'} Tue 24 Mar
        </AppText>

        <View style={styles.heroRow}>
          {heroMetrics.map((m, i) => (
            <View key={i} style={styles.heroMetric}>
              <AppText variant="small" color={Colors.textSecondary}>{m.label}</AppText>
              <View style={{flexDirection: 'row', alignItems: 'baseline', marginTop: vs(2)}}>
                <AppText variant="header" color={Colors.primary}>{m.value}</AppText>
                {m.target && (
                  <AppText variant="small" color={Colors.textTertiary}> {m.target}</AppText>
                )}
              </View>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, {width: `${m.pct}%`, backgroundColor: m.barColor}]} />
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Heart rate zones card */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.cardTitle}>
          Heart rate zones {'\u00B7'} Today
        </AppText>

        {/* Colored bar */}
        <View style={styles.hrBar}>
          {hrZones.map((z, i) => (
            <View key={i} style={{flex: z.flex, backgroundColor: z.color, height: vs(10)}} />
          ))}
        </View>

        {/* Zone labels */}
        <View style={styles.hrLabels}>
          {hrZones.map((z, i) => (
            <View key={i} style={{flex: z.flex, alignItems: 'center'}}>
              <AppText variant="small" color={Colors.textTertiary}>{z.label}</AppText>
            </View>
          ))}
        </View>

        {/* Time grid */}
        <View style={styles.hrGrid}>
          {hrDetails.map((h, i) => (
            <View key={i} style={styles.hrGridItem}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>{h.time}</AppText>
              <AppText variant="small" color={Colors.textSecondary}>{h.label}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Activity breakdown card */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.cardTitle}>Activity breakdown</AppText>

        {activityBreakdown.map((a, i) => (
          <View key={i} style={[styles.actRow, i < activityBreakdown.length - 1 && styles.rowBorder]}>
            <View style={[styles.actIcon, {backgroundColor: a.iconBg}]}>
              <Icon family="Ionicons" name={a.icon} size={ms(16)} color={a.iconColor} />
            </View>
            <View style={{flex: 1}}>
              <View style={styles.actHeader}>
                <AppText variant="bodyBold" style={{flex: 1}}>
                  {a.title}{a.time ? ` ${a.time}` : ''}
                </AppText>
                <View style={[styles.pill, {backgroundColor: a.statusBg}]}>
                  <AppText variant="small" color={a.statusColor}>{a.status}</AppText>
                </View>
              </View>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                {a.detail}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      {/* Green insight */}
      <View style={[styles.insightBox, {backgroundColor: Colors.tealBg}]}>
        <Icon family="Ionicons" name="analytics-outline" size={ms(16)} color={Colors.tealText} />
        <AppText variant="caption" color={Colors.tealText} style={{flex: 1}}>
          On days you do a post-dinner walk (8 this month), fasting glucose averages 7.4 vs 8.9 on skip days. That single habit is your biggest glucose lever.
        </AppText>
      </View>

      {/* Hydration card */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.cardTitle}>Hydration</AppText>
        <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(8)}}>
          Target 2.5L for T2DM + HTN
        </AppText>

        <View style={styles.hydrationRow}>
          {/* Left */}
          <View style={{flex: 1}}>
            <AppText variant="screenName" color="#185FA5">1.4L</AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
              of 2.5L target {'\u00B7'} 56%
            </AppText>
            <View style={[styles.barTrack, {marginTop: vs(6)}]}>
              <View style={[styles.barFill, {width: '56%', backgroundColor: '#185FA5'}]} />
            </View>
          </View>

          {/* Right mini bars */}
          <View style={styles.miniBars}>
            {hydrationBars.map((b, i) => (
              <View key={i} style={styles.miniBarCol}>
                <View style={{flex: 1 - b.height}} />
                <View
                  style={{
                    flex: b.height,
                    backgroundColor: b.color,
                    borderRadius: ms(3),
                    width: s(12),
                  }}
                />
              </View>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  const renderMonthlyView = () => (
    <View>
      {/* Month strip */}
      <View style={styles.monthStrip}>
        {months.map((m, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.monthBtn, m === 'Mar' && styles.monthBtnActive]}
            activeOpacity={0.7}>
            <AppText
              variant="caption"
              color={m === 'Mar' ? Colors.white : Colors.textSecondary}
              style={{fontWeight: m === 'Mar' ? '600' : '400'}}>
              {m}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Monthly stats row */}
      <View style={styles.statsRow}>
        {monthlyStats.map((stat, i) => (
          <View key={i} style={[styles.statCard, {backgroundColor: stat.bg}]}>
            <AppText variant="bodyBold" color={stat.color}>{stat.value}</AppText>
            <AppText variant="small" color={stat.color}>{stat.label}</AppText>
          </View>
        ))}
      </View>

      {/* Daily steps heatmap */}
      <View style={styles.card}>
        <View style={styles.cardHeader}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>
            Daily steps {'\u00B7'} March 2026
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>
            Green {'\u2265'}10k {'\u00B7'} Amber 7-10k {'\u00B7'} Red {'<'}7k
          </AppText>
        </View>
        <View style={[styles.heatmapGrid, {paddingHorizontal: s(13), paddingTop: vs(10)}]}>
          {heatmapData.map((d, i) => {
            if (!d.day) return <View key={i} style={styles.heatCellEmpty} />;
            const colorMap = {green: '#1D9E75', amber: '#BA7517', red: '#E24B4A'};
            return (
              <View key={i} style={[styles.heatSquare, {backgroundColor: colorMap[d.c]}]}>
                <Text style={[styles.heatCellText, {color: '#fff'}]}>
                  {d.steps}
                </Text>
              </View>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: Colors.red}]} />
            <AppText variant="small" color={Colors.textTertiary}>{'<7k'}</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: Colors.amber}]} />
            <AppText variant="small" color={Colors.textTertiary}>7-10k</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: Colors.teal}]} />
            <AppText variant="small" color={Colors.textTertiary}>10k+</AppText>
          </View>
        </View>
      </View>

      {/* Week-by-week steps trend */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.cardTitle}>Week-by-week steps trend</AppText>
        {weeklyTrend.map((w, i) => (
          <View key={i} style={styles.trendRow}>
            <AppText variant="caption" color={Colors.textPrimary} style={{width: s(55)}}>
              {w.label}
            </AppText>
            <View style={{flex: 1, marginHorizontal: s(8)}}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, {width: `${w.pct}%`, backgroundColor: w.barColor}]} />
              </View>
            </View>
            <AppText variant="caption" color={w.color} style={{width: s(45), textAlign: 'right'}}>
              {w.value}
            </AppText>
          </View>
        ))}
      </View>

      {/* Post-dinner walk clinical impact */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.cardTitle}>
          Post-dinner walk {'\u00B7'} Clinical impact
        </AppText>
        {clinicalImpact.map((c, i) => (
          <View key={i} style={styles.trendRow}>
            <AppText variant="small" color={Colors.textPrimary} style={{width: s(100)}}>
              {c.label}
            </AppText>
            <View style={{flex: 1, marginHorizontal: s(8)}}>
              <View style={styles.barTrack}>
                <View style={[styles.barFill, {width: `${c.pct}%`, backgroundColor: c.barColor}]} />
              </View>
            </View>
            <AppText variant="small" color={c.color} style={{width: s(55), textAlign: 'right'}}>
              {c.value}
            </AppText>
          </View>
        ))}
      </View>

      {/* Green insight */}
      <View style={[styles.insightBox, {backgroundColor: Colors.tealBg}]}>
        <Icon family="Ionicons" name="trophy-outline" size={ms(16)} color={Colors.tealText} />
        <AppText variant="caption" color={Colors.tealText} style={{flex: 1}}>
          Activity is your best-performing lifestyle category. Consistent morning walks and office movement keep your daily average above 8k steps. The post-dinner walk remains your highest-impact habit for glucose control.
        </AppText>
      </View>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderToggle()}
      {view === 'daily' && renderDateNav()}
      {view === 'daily' && renderCalendarStrip()}
      {view === 'daily' ? renderDailyView() : renderMonthlyView()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    padding: ms(3),
    marginBottom: vs(10),
  },
  toggleBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(6),
    borderRadius: ms(8),
  },
  toggleBtnActive: {
    backgroundColor: Colors.primary,
  },
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(8),
    paddingHorizontal: s(4),
  },
  calendarStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  calDay: {
    alignItems: 'center',
    paddingVertical: vs(6),
    paddingHorizontal: s(8),
    borderRadius: ms(10),
  },
  calDayActive: {
    backgroundColor: Colors.primary,
  },
  statsRow: {
    flexDirection: 'row',
    gap: s(6),
    marginBottom: vs(12),
  },
  statCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(8),
    borderRadius: ms(10),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
    marginBottom: vs(10),
  },
  cardTitle: {
    marginBottom: vs(10),
  },
  heroRow: {
    flexDirection: 'row',
    gap: s(10),
  },
  heroMetric: {
    flex: 1,
  },
  barTrack: {
    height: vs(6),
    backgroundColor: Colors.background,
    borderRadius: ms(3),
    marginTop: vs(6),
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: ms(3),
  },
  hrBar: {
    flexDirection: 'row',
    borderRadius: ms(5),
    overflow: 'hidden',
  },
  hrLabels: {
    flexDirection: 'row',
    marginTop: vs(4),
  },
  hrGrid: {
    flexDirection: 'row',
    marginTop: vs(10),
    gap: s(6),
  },
  hrGridItem: {
    flex: 1,
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: ms(8),
    paddingVertical: vs(6),
  },
  actRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(10),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  actIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
    marginTop: vs(2),
  },
  actHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  pill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    padding: ms(12),
    borderRadius: ms(12),
    marginBottom: vs(10),
  },
  hydrationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(16),
  },
  miniBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    gap: s(6),
    height: vs(50),
    width: s(90),
  },
  miniBarCol: {
    flex: 1,
    height: '100%',
  },
  monthStrip: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(12),
  },
  monthBtn: {
    paddingHorizontal: ms(14),
    paddingVertical: vs(6),
    borderRadius: ms(10),
    backgroundColor: Colors.background,
  },
  monthBtnActive: {
    backgroundColor: Colors.primary,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(13),
    paddingVertical: vs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderTertiary,
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(4),
    marginBottom: vs(8),
  },
  heatSquare: {
    width: '13%',
    aspectRatio: 1,
    borderRadius: ms(6),
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  heatCellEmpty: {
    width: '13%',
    aspectRatio: 1,
  },
  heatCellText: {
    fontSize: ms(8),
    fontWeight: '700',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: ms(10),
  },
  legendRow: {
    flexDirection: 'row',
    gap: s(14),
    marginTop: vs(8),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  legendDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  trendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
});

export default LifestyleActivityTab;
