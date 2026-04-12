import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import Svg, {Circle} from 'react-native-svg';
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
const heroBg = '#3d1f40';
const salmonBar = '#F09595';

/* ─── Static data ─── */
const CALENDAR_DAYS = [
  {day: 'Mon', date: 20, active: false},
  {day: 'Tue', date: 21, active: false},
  {day: 'Wed', date: 22, active: false},
  {day: 'Thu', date: 23, active: false},
  {day: 'Fri', date: 24, active: true},
];

const MONTHS = [
  {label: 'Jan', active: false},
  {label: 'Feb', active: false},
  {label: 'Mar', active: true},
];

const SLEEP_STAGES = [
  {label: 'Awake', color: Colors.purple, hours: '0.3h'},
  {label: 'Light', color: '#7F77DD', hours: '2.4h'},
  {label: 'Deep', color: '#3C3489', hours: '1.2h'},
  {label: 'REM', color: '#9F94ED', hours: '1.3h'},
];

const RECOVERY_METRICS = [
  {
    label: 'HRV',
    value: '42ms',
    status: 'Low',
    statusBg: Colors.redBg,
    statusColor: Colors.redText,
    cardBg: Colors.redBg,
  },
  {
    label: 'Resting HR',
    value: '68',
    status: 'Elevated',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
    cardBg: Colors.amberBg,
  },
  {
    label: 'Sleep score',
    value: '71%',
    status: 'Below avg',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
    cardBg: Colors.amberBg,
  },
];

const SLEEP_FACTORS = [
  {
    label: 'Screen time before bed',
    iconName: 'phone-portrait-outline',
    iconBg: Colors.pinkBg,
    pill: 'Risk',
    pillBg: Colors.redBg,
    pillColor: Colors.redText,
  },
  {
    label: 'No caffeine after 4 PM',
    iconName: 'cafe-outline',
    iconBg: Colors.amberBg,
    pill: 'Good',
    pillBg: Colors.tealBg,
    pillColor: Colors.tealText,
  },
  {
    label: 'Work stress reported',
    iconName: 'sad-outline',
    iconBg: Colors.pinkBg,
    pill: 'Factor',
    pillBg: Colors.amberBg,
    pillColor: Colors.amberText,
  },
];

const MONTHLY_STATS = [
  {label: 'Avg sleep', value: '5.9h', bg: Colors.amberBg, color: Colors.amberText},
  {label: '<6h nights', value: '11', bg: Colors.redBg, color: Colors.redText},
  {label: '\u22657h nights', value: '6', bg: Colors.tealBg, color: Colors.tealText},
  {label: 'Avg HRV', value: '44ms', bg: Colors.amberBg, color: Colors.amberText},
];

// Heatmap: March 2026 calendar grid (matches HTML exactly)
// Mar 1 = Sunday, so 6 empty slots before day 1
const SLEEP_HEATMAP = [
  // Row 1 (week starting Sun)
  {day: null}, {day: null}, {day: null}, {day: null}, {day: null}, {day: null}, {day: 1, h: '7.0', c: 'green'},
  // Row 2
  {day: 2, h: '7.1', c: 'green'}, {day: 3, h: '6.8', c: 'amber'}, {day: 4, h: '7.4', c: 'green'}, {day: 5, h: '7.2', c: 'green'}, {day: 6, h: '6.1', c: 'amber'}, {day: 7, h: '7.8', c: 'green'},
  // Row 3
  {day: 8, h: '5.1', c: 'red'}, {day: 9, h: '5.8', c: 'red'}, {day: 10, h: '5.0', c: 'red'}, {day: 11, h: '5.7', c: 'red'}, {day: 12, h: '6.0', c: 'amber'}, {day: 13, h: '7.3', c: 'green'}, {day: 14, h: '7.9', c: 'green'},
  // Row 4
  {day: 15, h: '5.2', c: 'red'}, {day: 16, h: '5.6', c: 'red'}, {day: 17, h: '5.9', c: 'red'}, {day: 18, h: '6.7', c: 'amber'}, {day: 19, h: '7.1', c: 'green'}, {day: 20, h: '4.9', c: 'red'}, {day: 21, h: '8.1', c: 'green'},
  // Row 5
  {day: 22, h: '6.3', c: 'amber'}, {day: 23, h: '6.8', c: 'amber'}, {day: 24, h: '5.2', c: 'red'},
];

const SLEEP_QUALITY_ROWS = [
  {label: 'Total sleep', value: '5.9h avg', trend: 'down', pct: 59, color: Colors.red},
  {label: 'Deep sleep', value: '1.1h avg', trend: 'down', pct: 44, color: Colors.red},
  {label: 'REM', value: '1.2h avg', trend: 'stable', pct: 48, color: Colors.amber},
  {label: 'Efficiency', value: '78%', trend: 'up', pct: 78, color: Colors.amber},
  {label: 'HRV', value: '44ms avg', trend: 'down', pct: 55, color: Colors.amber},
];

/* ─── Shared sub-components ─── */

const ToggleBar = ({view, setView, dateLabel, monthLabel}) => (
  <View style={sty.toggleWrap}>
    <View style={sty.toggleRow}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[sty.toggleBtn, view === 'daily' && sty.toggleActive]}
        onPress={() => setView('daily')}>
        <AppText
          variant="caption"
          color={view === 'daily' ? Colors.white : Colors.textSecondary}>
          Daily
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[sty.toggleBtn, view === 'monthly' && sty.toggleActive]}
        onPress={() => setView('monthly')}>
        <AppText
          variant="caption"
          color={view === 'monthly' ? Colors.white : Colors.textSecondary}>
          Monthly
        </AppText>
      </TouchableOpacity>
    </View>
    <View style={sty.dateNav}>
      <TouchableOpacity activeOpacity={0.6} style={sty.arrowBtn}>
        <Icon family="Ionicons" name="chevron-back" size={ms(16)} color={Colors.textSecondary} />
      </TouchableOpacity>
      <AppText variant="bodyBold" color={Colors.textPrimary}>
        {view === 'daily' ? dateLabel : monthLabel}
      </AppText>
      <TouchableOpacity activeOpacity={0.6} style={sty.arrowBtn}>
        <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  </View>
);

const CalendarStrip = () => (
  <View style={sty.calStrip}>
    {CALENDAR_DAYS.map((d, i) => (
      <TouchableOpacity
        key={i}
        activeOpacity={0.7}
        style={[sty.calDay, d.active && sty.calDayActive]}>
        <AppText variant="small" color={d.active ? Colors.white : Colors.textTertiary}>
          {d.day}
        </AppText>
        <AppText
          variant="bodyBold"
          color={d.active ? Colors.white : Colors.textPrimary}
          style={{marginTop: vs(2)}}>
          {d.date}
        </AppText>
      </TouchableOpacity>
    ))}
  </View>
);

const StatsRow = ({stats}) => (
  <View style={sty.statsRow}>
    {stats.map((st, i) => (
      <View key={i} style={[sty.statCell, {backgroundColor: st.bg}]}>
        <AppText variant="bodyBold" color={st.color}>{st.value}</AppText>
        <AppText variant="small" color={st.color} style={{marginTop: vs(1)}}>{st.label}</AppText>
      </View>
    ))}
  </View>
);

const MonthStrip = () => (
  <View style={sty.monthStrip}>
    {MONTHS.map((m, i) => (
      <TouchableOpacity
        key={i}
        activeOpacity={0.7}
        style={[sty.monthBtn, m.active && sty.monthBtnActive]}>
        <AppText
          variant="caption"
          color={m.active ? Colors.white : Colors.textSecondary}>
          {m.label}
        </AppText>
      </TouchableOpacity>
    ))}
    <AppText variant="small" color={Colors.textTertiary} style={{marginLeft: s(8)}}>
      2026
    </AppText>
  </View>
);

const InsightCard = ({text, bg, color, iconColor}) => (
  <View style={[sty.insightCard, {backgroundColor: bg}]}>
    <Icon family="Ionicons" name="bulb-outline" size={ms(16)} color={iconColor} />
    <AppText variant="small" color={color} style={{flex: 1, marginLeft: s(8)}}>
      {text}
    </AppText>
  </View>
);

/* ─── Small SVG ring ─── */
const SleepRing = ({pct}) => {
  const size = ms(56);
  const strokeWidth = ms(5);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - pct / 100);

  return (
    <View style={{width: size, height: size, alignItems: 'center', justifyContent: 'center'}}>
      <Svg width={size} height={size}>
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke="rgba(255,255,255,0.2)"
          strokeWidth={strokeWidth}
          fill="none"
        />
        <Circle
          cx={size / 2}
          cy={size / 2}
          r={radius}
          stroke={salmonBar}
          strokeWidth={strokeWidth}
          fill="none"
          strokeDasharray={circumference}
          strokeDashoffset={strokeDashoffset}
          strokeLinecap="round"
          rotation="-90"
          origin={`${size / 2}, ${size / 2}`}
        />
      </Svg>
      <View style={{position: 'absolute'}}>
        <AppText variant="caption" color={Colors.white}>{pct}%</AppText>
      </View>
    </View>
  );
};

/* ─── Daily View ─── */

const HeroCard = () => (
  <View style={sty.heroCard}>
    <View style={sty.heroTop}>
      <View style={{flex: 1}}>
        <AppText variant="screenName" color={Colors.white} style={{fontSize: ms(36)}}>
          5.2
        </AppText>
        <AppText variant="body" color="rgba(255,255,255,0.7)">
          hours
        </AppText>
        <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginTop: vs(4)}}>
          Last night \u00B7 Mon 23\u2013Tue 24 Mar
        </AppText>
      </View>
      <SleepRing pct={52} />
    </View>

    <View style={sty.bedWakeRow}>
      <View style={sty.bedWakeItem}>
        <Icon family="Ionicons" name="moon-outline" size={ms(14)} color="rgba(255,255,255,0.7)" />
        <AppText variant="caption" color="rgba(255,255,255,0.7)" style={{marginLeft: s(4)}}>
          Bed 11:48 PM
        </AppText>
      </View>
      <Icon family="Ionicons" name="arrow-forward" size={ms(12)} color="rgba(255,255,255,0.4)" />
      <View style={sty.bedWakeItem}>
        <Icon family="Ionicons" name="sunny-outline" size={ms(14)} color="rgba(255,255,255,0.7)" />
        <AppText variant="caption" color="rgba(255,255,255,0.7)" style={{marginLeft: s(4)}}>
          Wake 5:02 AM
        </AppText>
      </View>
    </View>

    <View style={sty.heroBarBg}>
      <View style={[sty.heroBarFill, {width: '52%'}]} />
    </View>
    <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginTop: vs(6)}}>
      Target 7h \u00B7 1h 48m short
    </AppText>
  </View>
);

const SleepArchitectureCard = () => (
  <View style={sty.card}>
    <AppText variant="bodyBold" color={Colors.textPrimary} style={sty.cardPad}>
      Sleep architecture
    </AppText>

    {/* Timeline bar */}
    <View style={[sty.timelineBar, sty.cardPadH]}>
      {SLEEP_STAGES.map((stage, i) => {
        const widths = [6, 46, 23, 25]; // approximate pct
        return (
          <View
            key={i}
            style={{
              flex: widths[i],
              height: vs(14),
              backgroundColor: stage.color,
              borderTopLeftRadius: i === 0 ? ms(4) : 0,
              borderBottomLeftRadius: i === 0 ? ms(4) : 0,
              borderTopRightRadius: i === SLEEP_STAGES.length - 1 ? ms(4) : 0,
              borderBottomRightRadius: i === SLEEP_STAGES.length - 1 ? ms(4) : 0,
            }}
          />
        );
      })}
    </View>

    {/* Time labels */}
    <View style={[sty.timeLabelRow, sty.cardPadH]}>
      <AppText variant="small" color={Colors.textTertiary}>11:48 PM</AppText>
      <AppText variant="small" color={Colors.textTertiary}>1 AM</AppText>
      <AppText variant="small" color={Colors.textTertiary}>3 AM</AppText>
      <AppText variant="small" color={Colors.textTertiary}>5:02 AM</AppText>
    </View>

    {/* Stage stats */}
    <View style={sty.stageGrid}>
      {SLEEP_STAGES.map((stage, i) => (
        <View key={i} style={sty.stageCell}>
          <View style={[sty.stageDot, {backgroundColor: stage.color}]} />
          <AppText variant="small" color={Colors.textSecondary}>{stage.label}</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginTop: vs(2)}}>
            {stage.hours}
          </AppText>
        </View>
      ))}
    </View>
  </View>
);

const RecoveryMetrics = () => (
  <View style={sty.recoveryRow}>
    {RECOVERY_METRICS.map((m, i) => (
      <View key={i} style={sty.recoveryCard}>
        <AppText variant="small" color={Colors.textSecondary}>{m.label}</AppText>
        <AppText variant="header" color={Colors.textPrimary} style={{marginTop: vs(4)}}>
          {m.value}
        </AppText>
        <View style={[sty.statusPill, {backgroundColor: m.statusBg}]}>
          <AppText variant="small" color={m.statusColor}>{m.status}</AppText>
        </View>
      </View>
    ))}
  </View>
);

const SleepFactorsCard = () => (
  <View style={sty.card}>
    <AppText variant="bodyBold" color={Colors.textPrimary} style={sty.cardPad}>
      What affected last night's sleep
    </AppText>
    {SLEEP_FACTORS.map((f, i) => (
      <View
        key={i}
        style={[sty.factorRow, i < SLEEP_FACTORS.length - 1 && sty.rowBorder]}>
        <View style={[sty.factorIcon, {backgroundColor: f.iconBg}]}>
          <Icon family="Ionicons" name={f.iconName} size={ms(16)} color={Colors.textPrimary} />
        </View>
        <AppText variant="body" color={Colors.textPrimary} style={{flex: 1, marginLeft: s(10)}}>
          {f.label}
        </AppText>
        <View style={[sty.pill, {backgroundColor: f.pillBg}]}>
          <AppText variant="small" color={f.pillColor}>{f.pill}</AppText>
        </View>
      </View>
    ))}
  </View>
);

const DailyView = () => (
  <View>
    <HeroCard />
    <SleepArchitectureCard />
    <RecoveryMetrics />
    <SleepFactorsCard />

    <InsightCard
      text="5.2h sleep led to HRV 42ms, which is associated with an estimated fasting glucose increase of +1.8 mg/dL. Prioritise 7h+ sleep to stabilise glucose levels."
      bg={Colors.redBg}
      color={Colors.redText}
      iconColor={Colors.red}
    />
  </View>
);

/* ─── Monthly View ─── */

const SleepHeatmap = () => {
  const colorMap = {
    green: Colors.teal,
    amber: Colors.amber,
    red: Colors.red,
  };
  return (
    <View style={sty.card}>
      <View style={sty.cardHeader}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>
          Nightly duration {'\u00B7'} March 2026
        </AppText>
        <AppText variant="small" color={Colors.textTertiary}>
          Colour = hours vs 7h target
        </AppText>
      </View>
      <View style={[sty.heatmapGrid, sty.cardPadH, {paddingTop: vs(10), paddingBottom: vs(8)}]}>
        {SLEEP_HEATMAP.map((d, i) => {
          if (!d.day) return <View key={i} style={sty.heatCellEmpty} />;
          const bg = colorMap[d.c];
          return (
            <View key={i} style={[sty.heatCell, {backgroundColor: bg}]}>
              <Text style={[sty.heatCellText, {color: '#fff'}]}>
                {d.h}
              </Text>
            </View>
          );
        })}
      </View>
      <View style={[sty.heatLegend, sty.cardPadH]}>
        {[
          {label: '\u22657h', color: Colors.teal},
          {label: '6\u20137h', color: Colors.amber},
          {label: '<6h', color: Colors.red},
        ].map((l, i) => (
          <View key={i} style={sty.legendItem}>
            <View style={[sty.legendDot, {backgroundColor: l.color}]} />
            <AppText variant="small" color={Colors.textSecondary}>{l.label}</AppText>
          </View>
        ))}
      </View>
      <AppText
        variant="small"
        color={Colors.textSecondary}
        style={[sty.cardPadH, {paddingBottom: vs(10)}]}>
        11 nights below 6 hours. Deep sleep tends to drop when total sleep falls under 6h.
      </AppText>
    </View>
  );
};

const SleepQualityCard = () => (
  <View style={sty.card}>
    <AppText variant="bodyBold" color={Colors.textPrimary} style={sty.cardPad}>
      Sleep quality breakdown
    </AppText>
    {SLEEP_QUALITY_ROWS.map((r, i) => (
      <View
        key={i}
        style={[sty.qualityRow, i < SLEEP_QUALITY_ROWS.length - 1 && sty.rowBorder]}>
        <View style={sty.qualityLabel}>
          <AppText variant="body" color={Colors.textPrimary}>{r.label}</AppText>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
            <AppText variant="small" color={Colors.textSecondary}>{r.value}</AppText>
            <Icon
              family="Ionicons"
              name={
                r.trend === 'up'
                  ? 'arrow-up'
                  : r.trend === 'down'
                  ? 'arrow-down'
                  : 'remove'
              }
              size={ms(12)}
              color={
                r.trend === 'up'
                  ? Colors.teal
                  : r.trend === 'down'
                  ? Colors.red
                  : Colors.amber
              }
            />
          </View>
        </View>
        <View style={sty.qualityBarBg}>
          <View
            style={[sty.qualityBarFill, {width: `${r.pct}%`, backgroundColor: r.color}]}
          />
        </View>
      </View>
    ))}
  </View>
);

const MonthlyView = () => (
  <View>
    <MonthStrip />
    <StatsRow stats={MONTHLY_STATS} />
    <SleepHeatmap />
    <SleepQualityCard />

    <InsightCard
      text="Sleep and HbA1c connection: your average sleep of 5.9h this month is below the 7h threshold linked to improved insulin sensitivity. Even 30 minutes more sleep could help."
      bg={Colors.purpleBg}
      color={Colors.purpleText}
      iconColor={Colors.purple}
    />
  </View>
);

/* ─── Main Component ─── */

const SLEEP_BAR_COLORS = {
  good: Colors.accent,
  fair: Colors.amber,
  poor: Colors.red,
};

const SLEEP_RECORDS = [
  {date: 'Today - 24 Mar 2026', bed: '11:45 PM', wake: '5:10 AM', hours: '5h 25m', totalMins: 325, score: 71, quality: 'poor', deep: '1.2h', rem: '1.3h', light: '2.4h', deepMins: 72, remMins: 78, lightMins: 144, awakeMins: 31, sleepLatency: 18, awakenings: 4, hrAvg: 62, hrMin: 54, hrv: 34, spo2: 95.8, breathRate: 16.2, tempDev: -0.2, restlessness: 24, hypnogram: [2,2,3,3,2,2,1,1,2,3,3,2,2,1,1,2,2,0,0,2,2,1,2,2,3,2,2,1,2,2]},
  {date: 'Yesterday - 23 Mar 2026', bed: '11:20 PM', wake: '6:10 AM', hours: '6h 50m', totalMins: 410, score: 78, quality: 'fair', deep: '1.5h', rem: '1.4h', light: '3.2h', deepMins: 90, remMins: 84, lightMins: 192, awakeMins: 44, sleepLatency: 12, awakenings: 3, hrAvg: 59, hrMin: 51, hrv: 40, spo2: 96.4, breathRate: 15.6, tempDev: -0.3, restlessness: 16, hypnogram: [2,2,3,3,3,2,1,1,2,3,3,2,2,1,1,2,2,0,2,2,1,1,2,2,3,2,2,1,2,2]},
  {date: '22 Mar 2026 - Saturday', bed: '11:00 PM', wake: '7:20 AM', hours: '8h 20m', totalMins: 500, score: 89, quality: 'good', deep: '2.0h', rem: '1.8h', light: '3.5h', deepMins: 120, remMins: 108, lightMins: 210, awakeMins: 62, sleepLatency: 8, awakenings: 2, hrAvg: 56, hrMin: 50, hrv: 48, spo2: 97.2, breathRate: 14.8, tempDev: -0.4, restlessness: 10, hypnogram: [2,2,3,3,3,2,2,1,1,2,3,3,3,2,1,1,2,2,0,2,2,1,1,2,2,3,3,2,1,2]},
  {date: '21 Mar 2026 - Friday', bed: '12:15 AM', wake: '5:30 AM', hours: '5h 15m', totalMins: 315, score: 65, quality: 'poor', deep: '0.9h', rem: '1.1h', light: '2.6h', deepMins: 54, remMins: 66, lightMins: 156, awakeMins: 39, sleepLatency: 22, awakenings: 5, hrAvg: 64, hrMin: 56, hrv: 28, spo2: 95.1, breathRate: 16.8, tempDev: -0.1, restlessness: 32, hypnogram: [2,2,3,2,2,1,0,0,2,3,2,2,1,1,2,2,0,2,2,1,2,2,3,2,2,1,2,2,0,2]},
  {date: '20 Mar 2026 - Thursday', bed: '10:50 PM', wake: '6:00 AM', hours: '7h 10m', totalMins: 430, score: 82, quality: 'good', deep: '1.7h', rem: '1.5h', light: '3.1h', deepMins: 102, remMins: 90, lightMins: 186, awakeMins: 52, sleepLatency: 10, awakenings: 2, hrAvg: 57, hrMin: 51, hrv: 44, spo2: 96.9, breathRate: 15.2, tempDev: -0.3, restlessness: 12, hypnogram: [2,2,3,3,3,2,2,1,1,2,3,3,2,2,1,1,2,2,0,2,2,1,1,2,3,3,2,1,2,2]},
  {date: '19 Mar 2026 - Wednesday', bed: '11:30 PM', wake: '5:45 AM', hours: '6h 15m', totalMins: 375, score: 74, quality: 'fair', deep: '1.3h', rem: '1.2h', light: '2.9h', deepMins: 78, remMins: 72, lightMins: 174, awakeMins: 51, sleepLatency: 15, awakenings: 3, hrAvg: 60, hrMin: 53, hrv: 36, spo2: 96.2, breathRate: 15.8, tempDev: -0.2, restlessness: 20, hypnogram: [2,2,3,3,2,2,1,1,2,3,3,2,2,1,1,2,2,0,0,2,2,1,2,2,3,2,2,1,2,2]},
];

const DateGroup = ({label}) => (
  <View style={sty.dateGroup}>
    <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5, marginRight: s(8)}}>
      {label}
    </AppText>
    <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
  </View>
);

const SleepRow = ({record, onPress}) => {
  const barColor = SLEEP_BAR_COLORS[record.quality] || Colors.accent;

  return (
    <TouchableOpacity style={sty.sleepRow} activeOpacity={0.7} onPress={onPress}>
      <View style={[sty.sleepLeftBar, {backgroundColor: barColor}]} />
      <View style={sty.sleepBody}>
        <View style={sty.sleepSummary}>
          <View style={[sty.sleepIcon, {backgroundColor: barColor + '18'}]}>
            <Icon family="Ionicons" name="moon-outline" size={ms(14)} color={barColor} />
          </View>
          <View style={{flex: 1, marginLeft: s(8)}}>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(13)}}>{record.hours}</AppText>
            <AppText variant="small" color={Colors.textTertiary}>{record.bed} - {record.wake}</AppText>
          </View>
          <View style={{alignItems: 'flex-end', marginRight: s(6)}}>
            <AppText variant="bodyBold" color={barColor} style={{fontSize: ms(13)}}>{record.score}</AppText>
            <AppText variant="small" color={Colors.textTertiary}>score</AppText>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color={Colors.textPrimary} />
        </View>
        <View style={sty.sleepStagesRow}>
          <View style={sty.sleepStageItem}>
            <View style={[sty.sleepStageDot, {backgroundColor: '#3C3489'}]} />
            <AppText variant="small" color={Colors.textSecondary}>Deep {record.deep}</AppText>
          </View>
          <View style={sty.sleepStageItem}>
            <View style={[sty.sleepStageDot, {backgroundColor: '#9F94ED'}]} />
            <AppText variant="small" color={Colors.textSecondary}>REM {record.rem}</AppText>
          </View>
          <View style={sty.sleepStageItem}>
            <View style={[sty.sleepStageDot, {backgroundColor: '#7F77DD'}]} />
            <AppText variant="small" color={Colors.textSecondary}>Light {record.light}</AppText>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
};

const LifestyleSleepTab = () => {
  const navigation = useNavigation();
  return (
    <View style={sty.container}>
      {/* Ayu Intel banner */}
      <TouchableOpacity style={sty.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('LifestyleDetail', {lifestyleId: 'sleep'})}>
        <View style={sty.ayuIconWrap}><Icon family="Ionicons" name="bulb-outline" size={ms(16)} color={Colors.white} /></View>
        <View style={{flex: 1}}>
          <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Sleep</AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.7)">Sleep patterns - Recovery - HRV trends</AppText>
        </View>
        <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      {SLEEP_RECORDS.map((rec, i) => (
        <View key={i}>
          <DateGroup label={rec.date} />
          <SleepRow record={rec} onPress={() => navigation.navigate('SleepDetail', {record: rec})} />
        </View>
      ))}
    </View>
  );
};

/* ─── Styles ─── */

const sty = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  content: {paddingBottom: vs(32)},

  /* Ayu Intel */
  ayuBtn: {flexDirection: 'row', alignItems: 'center', gap: s(8), backgroundColor: Colors.accent, borderRadius: ms(12), padding: ms(12), marginBottom: vs(12)},
  ayuIconWrap: {width: ms(32), height: ms(32), borderRadius: ms(9), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},

  /* Date group */
  dateGroup: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(10)},

  /* Sleep row */
  sleepRow: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#dde8e2', marginBottom: vs(7), overflow: 'hidden', flexDirection: 'row', alignItems: 'stretch'},
  sleepLeftBar: {width: ms(4)},
  sleepBody: {flex: 1},
  sleepSummary: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: ms(10), paddingTop: ms(10), paddingBottom: ms(6), gap: s(4)},
  sleepIcon: {width: ms(30), height: ms(30), borderRadius: ms(8), alignItems: 'center', justifyContent: 'center'},
  sleepStagesRow: {flexDirection: 'row', paddingHorizontal: ms(10), paddingBottom: ms(10), gap: s(12)},
  sleepStageItem: {flexDirection: 'row', alignItems: 'center', gap: s(4)},
  sleepStageDot: {width: ms(6), height: ms(6), borderRadius: ms(3)},

  /* Toggle */
  toggleWrap: {marginBottom: vs(12)},
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: backgroundSecondary,
    borderRadius: ms(10),
    padding: ms(3),
    marginBottom: vs(10),
  },
  toggleBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(7),
    borderRadius: ms(8),
  },
  toggleActive: {backgroundColor: Colors.primary},
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(12),
  },
  arrowBtn: {padding: ms(4)},

  /* Calendar strip */
  calStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(14),
  },
  calDay: {
    alignItems: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: s(12),
    borderRadius: ms(12),
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: borderTertiary,
  },
  calDayActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},

  /* Month strip */
  monthStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  monthBtn: {
    paddingVertical: vs(6),
    paddingHorizontal: s(14),
    borderRadius: ms(8),
    backgroundColor: backgroundSecondary,
    marginRight: s(6),
  },
  monthBtnActive: {backgroundColor: Colors.primary},

  /* Stats row */
  statsRow: {
    flexDirection: 'row',
    gap: 1,
    marginBottom: vs(12),
    borderRadius: ms(14),
    overflow: 'hidden',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(10),
  },

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    marginBottom: vs(12),
    overflow: 'hidden',
  },
  cardPad: {paddingHorizontal: s(14), paddingVertical: vs(10)},
  cardPadH: {paddingHorizontal: s(14)},

  /* Hero card */
  heroCard: {
    backgroundColor: heroBg,
    borderRadius: ms(16),
    padding: ms(18),
    marginBottom: vs(12),
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  bedWakeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    marginTop: vs(14),
  },
  bedWakeItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  heroBarBg: {
    height: vs(6),
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: ms(3),
    overflow: 'hidden',
    marginTop: vs(12),
  },
  heroBarFill: {
    height: '100%',
    backgroundColor: salmonBar,
    borderRadius: ms(3),
  },

  /* Sleep architecture */
  timelineBar: {
    flexDirection: 'row',
    marginBottom: vs(6),
    gap: 1,
  },
  timeLabelRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(10),
  },
  stageGrid: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: borderTertiary,
  },
  stageCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  stageDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    marginBottom: vs(4),
  },

  /* Recovery */
  recoveryRow: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(12),
  },
  recoveryCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    padding: ms(12),
    alignItems: 'center',
  },
  statusPill: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(6),
    marginTop: vs(6),
  },

  /* Factors */
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
  },
  factorIcon: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  pill: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(6),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: borderTertiary,
  },

  /* Insight */
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: ms(14),
    borderRadius: ms(14),
    marginBottom: vs(12),
  },

  /* Card header */
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(13),
    paddingVertical: vs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderTertiary,
  },

  /* Heatmap */
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(4),
  },
  heatCell: {
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
    fontSize: ms(10),
    fontWeight: '700',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: ms(12),
  },
  heatLegend: {
    flexDirection: 'row',
    gap: s(12),
    paddingVertical: vs(8),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  legendDot: {width: ms(8), height: ms(8), borderRadius: ms(4)},

  /* Quality breakdown */
  qualityRow: {
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
  },
  qualityLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(6),
  },
  qualityBarBg: {
    height: vs(6),
    backgroundColor: backgroundSecondary,
    borderRadius: ms(3),
    overflow: 'hidden',
  },
  qualityBarFill: {
    height: '100%',
    borderRadius: ms(3),
  },
});

export default LifestyleSleepTab;
