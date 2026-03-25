import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
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

/* ─── helpers ─── */
const sevColor = v => {
  if (v === 0) return Colors.textTertiary;
  if (v <= 2) return Colors.primary;
  if (v <= 4) return Colors.amber;
  return Colors.red;
};

const sevBarColor = v => {
  if (v <= 2) return Colors.lightGreen;
  if (v <= 4) return Colors.amber;
  return Colors.red;
};

const sleepColor = h => {
  if (h >= 7) return Colors.primary;
  if (h >= 6) return Colors.amber;
  return Colors.red;
};

/* ─── data ─── */
const DAYS = [
  // Week 1
  {day: 1, name: 'Sat', sev: 0, sleep: null, tags: [], note: 'Not logged'},
  {day: 2, name: 'Sun', sev: 2, sleep: 7.1, tags: []},
  {day: 3, name: 'Mon', sev: 3, sleep: 6.8, tags: [{label: 'AM', bg: Colors.blueBg, color: Colors.blueText}]},
  {day: 4, name: 'Tue', sev: 1, sleep: 7.4, tags: []},
  {day: 5, name: 'Wed', sev: 1, sleep: 7.2, tags: []},
  {day: 6, name: 'Thu', sev: 3, sleep: 6.1, tags: [{label: 'End of week', bg: Colors.amberBg, color: Colors.amberText}]},
  {day: 7, name: 'Fri', sev: 2, sleep: 7.8, tags: []},
  // Week 2
  {day: 8, name: 'Sat', sev: 5, sleep: 5.1, tags: [{label: 'High', bg: Colors.redBg, color: Colors.redText}]},
  {day: 9, name: 'Sun', sev: 4, sleep: 5.8, tags: []},
  {day: 10, name: 'Mon', sev: 5, sleep: 5.0, tags: [{label: 'Onset', bg: Colors.amberBg, color: Colors.amberText}], highlight: Colors.amberBg},
  {day: 11, name: 'Tue', sev: 5, sleep: 5.7, tags: []},
  {day: 12, name: 'Wed', sev: 4, sleep: 6.0, tags: []},
  {day: 13, name: 'Thu', sev: 1, sleep: 7.3, tags: []},
  {day: 14, name: 'Fri', sev: 0, sleep: 7.9, tags: [], note: 'Not logged'},
  // Week 3
  {day: 15, name: 'Sat', sev: 6, sleep: 5.2, tags: [{label: 'Dr. visit', bg: Colors.purpleBg, color: Colors.purpleText}], highlight: Colors.pinkBg},
  {day: 16, name: 'Sun', sev: 5, sleep: 5.6, tags: []},
  {day: 17, name: 'Mon', sev: 5, sleep: 5.9, tags: []},
  {day: 18, name: 'Tue', sev: 3, sleep: 6.7, tags: []},
  {day: 19, name: 'Wed', sev: 0, sleep: 7.1, tags: [], note: 'Clear day'},
  {day: 20, name: 'Thu', sev: 7, sleep: 4.9, tags: [{label: 'Worst day', bg: Colors.redBg, color: Colors.redText}], highlight: Colors.amberBg},
  {day: 21, name: 'Fri', sev: 0, sleep: 8.1, tags: [], note: 'Not logged'},
  // Week 4
  {day: 22, name: 'Sat', sev: 3, sleep: 6.3, tags: []},
  {day: 23, name: 'Sun', sev: 4, sleep: 6.8, tags: []},
  {day: 24, name: 'Mon', sev: 6, sleep: 5.2, tags: [{label: 'Today', bg: Colors.pinkBg, color: Colors.redText}], highlight: Colors.pinkBg},
];

const WEEKS = [
  {label: 'Week 1', range: 'Mar 1\u20137', start: 1, end: 7},
  {label: 'Week 2', range: 'Mar 8\u201314', start: 8, end: 14},
  {label: 'Week 3', range: 'Mar 15\u201321', start: 15, end: 21},
  {label: 'Week 4', range: 'Mar 22\u201324', start: 22, end: 24},
];

const CHART_LABELS = [1, 7, 14, 21, 24];

/* ─── component ─── */
const SymDayByDayTab = () => {
  const maxSev = 10;
  const chartHeight = vs(120);

  const renderSeverityChart = () => (
    <View style={styles.card}>
      <View style={styles.chartHeader}>
        <AppText variant="bodyBold">Severity by day · March 2026</AppText>
        <TouchableOpacity style={styles.sleepLink}>
          <Icon family="Ionicons" name="moon-outline" size={ms(14)} color={Colors.primary} />
          <AppText variant="small" color={Colors.primary} style={{marginLeft: s(4)}}>
            Sleep overlay
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Bar chart */}
      <View style={[styles.chartArea, {height: chartHeight}]}>
        {DAYS.map(d => {
          const barH = d.sev > 0 ? (d.sev / maxSev) * chartHeight * 0.85 : vs(2);
          return (
            <View key={d.day} style={styles.barCol}>
              <View style={{flex: 1, justifyContent: 'flex-end'}}>
                <View
                  style={{
                    width: s(8),
                    height: barH,
                    borderRadius: ms(3),
                    backgroundColor: d.sev > 0 ? sevBarColor(d.sev) : backgroundSecondary,
                  }}
                />
              </View>
            </View>
          );
        })}
      </View>

      {/* X-axis labels */}
      <View style={styles.xAxisRow}>
        {DAYS.map(d => (
          <View key={d.day} style={styles.barCol}>
            {CHART_LABELS.includes(d.day) ? (
              <AppText variant="small" color={Colors.textTertiary}>
                {d.day}
              </AppText>
            ) : null}
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={styles.legendRow}>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: Colors.red}]} />
          <AppText variant="small" color={Colors.textSecondary}>High</AppText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: Colors.amber}]} />
          <AppText variant="small" color={Colors.textSecondary}>Moderate</AppText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendDot, {backgroundColor: Colors.lightGreen}]} />
          <AppText variant="small" color={Colors.textSecondary}>Low</AppText>
        </View>
        <View style={styles.legendItem}>
          <View style={[styles.legendLine, {backgroundColor: Colors.primary}]} />
          <AppText variant="small" color={Colors.textSecondary}>Sleep</AppText>
        </View>
      </View>

      {/* Footer note */}
      <View style={styles.footerNote}>
        <Icon family="Ionicons" name="information-circle-outline" size={ms(14)} color={Colors.textTertiary} />
        <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(6), flex: 1}}>
          Key observation: Severity peaks align with sleep below 5.5h on the preceding night.
        </AppText>
      </View>
    </View>
  );

  const renderDayRow = d => {
    const isLogged = d.sev > 0;
    const rowBg = d.highlight ? d.highlight : Colors.white;

    return (
      <View key={d.day} style={[styles.dayRow, {backgroundColor: rowBg}]}>
        {/* Date + name */}
        <View style={styles.dayLabel}>
          <AppText variant="bodyBold" style={{width: s(22)}}>{d.day}</AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{width: s(30)}}>
            {d.name}
          </AppText>
        </View>

        {/* Severity bar + value */}
        {isLogged ? (
          <View style={styles.sevSection}>
            <View style={styles.sevBarTrack}>
              <View
                style={[
                  styles.sevBarFill,
                  {
                    width: `${(d.sev / maxSev) * 100}%`,
                    backgroundColor: sevBarColor(d.sev),
                  },
                ]}
              />
            </View>
            <AppText
              variant="bodyBold"
              color={sevColor(d.sev)}
              style={{width: s(22), textAlign: 'right'}}>
              {d.sev}
            </AppText>
          </View>
        ) : (
          <View style={styles.sevSection}>
            <AppText variant="caption" color={Colors.textTertiary} style={{flex: 1}}>
              {d.note || 'Not logged'}
            </AppText>
          </View>
        )}

        {/* Tags */}
        <View style={styles.tagSection}>
          {d.tags.map((t, i) => (
            <View key={i} style={[styles.tagPill, {backgroundColor: t.bg}]}>
              <AppText variant="small" color={t.color}>{t.label}</AppText>
            </View>
          ))}
        </View>

        {/* Sleep */}
        <View style={styles.sleepSection}>
          {d.sleep != null ? (
            <AppText variant="caption" color={sleepColor(d.sleep)}>
              {d.sleep.toFixed(1)}h
            </AppText>
          ) : (
            <AppText variant="caption" color={Colors.textTertiary}>--</AppText>
          )}
        </View>
      </View>
    );
  };

  const renderDayByDay = () => (
    <View style={styles.card}>
      <View style={{marginBottom: vs(8)}}>
        <AppText variant="bodyBold">Every day in March</AppText>
        <AppText variant="caption" color={Colors.textSecondary}>
          Tap a row for detail
        </AppText>
      </View>

      {WEEKS.map(w => (
        <View key={w.label}>
          {/* Week separator */}
          <View style={styles.weekSep}>
            <AppText variant="small" color={Colors.textTertiary}>
              {w.label} · {w.range}
            </AppText>
          </View>
          {DAYS.filter(d => d.day >= w.start && d.day <= w.end).map(renderDayRow)}
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {renderSeverityChart()}
      {renderDayByDay()}

      {/* Insight */}
      <View style={[styles.insightCard, {backgroundColor: Colors.purpleBg}]}>
        <Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.purpleText} />
        <AppText variant="caption" color={Colors.purpleText} style={{marginLeft: s(8), flex: 1}}>
          The 6 days with no fatigue all had sleep of 7h or above. Sleep is the single strongest lever you can control.
        </AppText>
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
  chartHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  sleepLink: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  chartArea: {
    flexDirection: 'row',
    alignItems: 'flex-end',
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  xAxisRow: {
    flexDirection: 'row',
    marginTop: vs(4),
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(12),
    marginTop: vs(12),
    paddingTop: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: borderTertiary,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  legendDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(3),
  },
  legendLine: {
    width: ms(14),
    height: ms(3),
    borderRadius: ms(2),
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: vs(10),
    paddingTop: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: borderTertiary,
  },
  weekSep: {
    paddingVertical: vs(6),
    paddingHorizontal: s(4),
    backgroundColor: Colors.background,
    borderRadius: ms(6),
    marginVertical: vs(2),
  },
  dayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: s(4),
    borderBottomWidth: 0.5,
    borderBottomColor: borderTertiary,
  },
  dayLabel: {
    flexDirection: 'row',
    alignItems: 'center',
    width: s(58),
  },
  sevSection: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  sevBarTrack: {
    flex: 1,
    height: vs(6),
    backgroundColor: backgroundSecondary,
    borderRadius: ms(3),
    overflow: 'hidden',
  },
  sevBarFill: {
    height: '100%',
    borderRadius: ms(3),
  },
  tagSection: {
    flexDirection: 'row',
    gap: s(4),
    marginHorizontal: s(6),
    flexShrink: 1,
  },
  tagPill: {
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  sleepSection: {
    width: s(40),
    alignItems: 'flex-end',
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    padding: ms(14),
  },
});

export default SymDayByDayTab;
