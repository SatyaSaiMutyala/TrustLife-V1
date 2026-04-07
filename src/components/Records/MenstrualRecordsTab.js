import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

// ──────────────────────────────────────────────
// Data matching HTML exactly
// ──────────────────────────────────────────────

const CYCLE_LENGTHS = [27, 28, 29, 28, 27, 28, 29, 28, 28];
const CYCLE_LABELS = ['C1', 'C2', 'C3', 'C4', 'C5', 'C6', 'C7', 'C8', 'C9'];

const CYCLES = [
  {
    month: 'February 2026', badge: '28d \u00b7 Cycle 2',
    date: 'Feb 3 \u2013 Mar 2, 2026',
    detail: '28-day cycle \u00b7 Period 4 days \u00b7 Moderate flow',
    status: 'Regular', statusBg: Colors.tealBg, statusColor: Colors.tealText,
    tags: [
      {icon: 'ellipse', color: '#E24B4A', text: 'Feb 3\u20136'},
      {icon: 'egg-outline', color: Colors.accent, text: 'Feb 16'},
      {icon: 'leaf-outline', color: Colors.accent, text: 'Feb 13\u201318'},
      {icon: 'flash-outline', color: '#E24B4A', text: 'Migraine Feb 22'},
      {icon: 'sad-outline', color: '#7b2fbe', text: 'PMS Feb 25\u201328'},
    ],
  },
  {
    month: 'January 2026', badge: '27d \u00b7 Cycle 1',
    date: 'Jan 7 \u2013 Feb 2, 2026',
    detail: '27-day cycle \u00b7 Period 5 days \u00b7 Moderate',
    status: 'Slightly short', statusBg: Colors.tealBg, statusColor: Colors.tealText,
    tags: [
      {icon: 'ellipse', color: '#E24B4A', text: 'Jan 7\u201311'},
      {icon: 'egg-outline', color: Colors.accent, text: 'Jan 20'},
      {icon: 'leaf-outline', color: Colors.accent, text: 'Jan 17\u201322'},
      {icon: 'battery-dead-outline', color: '#7b2fbe', text: 'Fatigue Jan 25\u201327'},
    ],
  },
  {
    month: 'December 2025', badge: '29d \u00b7 Cycle 12',
    date: 'Dec 9 \u2013 Jan 6, 2026',
    detail: '29-day cycle \u00b7 Period 6 days \u00b7 Heavy first 2 days',
    status: 'Slightly long', statusBg: Colors.amberBg, statusColor: Colors.amberDark,
    tags: [
      {icon: 'ellipse', color: '#E24B4A', text: 'Dec 9\u201314'},
      {icon: 'egg-outline', color: Colors.accent, text: 'Dec 23'},
      {icon: 'leaf-outline', color: Colors.accent, text: 'Dec 20\u201325'},
      {icon: 'pulse-outline', color: '#E24B4A', text: 'Cramps Dec 9\u201310'},
    ],
  },
  {
    month: 'November 2025', badge: '28d \u00b7 Cycle 11',
    date: 'Nov 11 \u2013 Dec 8, 2025',
    detail: '28-day cycle \u00b7 Period 5 days',
    status: 'Regular', statusBg: Colors.tealBg, statusColor: Colors.tealText,
    tags: [
      {icon: 'ellipse', color: '#E24B4A', text: 'Nov 11\u201315'},
      {icon: 'egg-outline', color: Colors.accent, text: 'Nov 25'},
      {icon: 'leaf-outline', color: Colors.accent, text: 'Nov 22\u201327'},
      {icon: 'flash-outline', color: '#E24B4A', text: 'Migraine Nov 8 (pre-period)'},
    ],
  },
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const Section = ({title}) => (
  <View style={st.sec}>
    <AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{title}</AppText>
    <View style={st.secLine} />
  </View>
);

const MonthSep = ({month, badge}) => (
  <View style={st.monthSep}>
    <View style={st.monthLine} />
    <AppText variant="bodyBold" color={Colors.textPrimary}>{month}</AppText>
    <View style={st.monthBadge}>
      <AppText variant="subtext" color={Colors.primary} style={{fontWeight: '600'}}>{badge}</AppText>
    </View>
    <View style={st.monthLine} />
  </View>
);

const CycleEntry = ({item}) => (
  <View style={st.entry}>
    <View style={st.entryHdr}>
      <View style={{flex: 1}}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>{item.date}</AppText>
        <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{item.detail}</AppText>
      </View>
      <View style={[st.statusBadge, {backgroundColor: item.statusBg}]}>
        <AppText variant="subtext" color={item.statusColor} style={{fontWeight: '600'}}>{item.status}</AppText>
      </View>
    </View>
    <View style={st.tagRow}>
      {item.tags.map((tag, i) => (
        <View key={i} style={st.tag}>
          <Icon family="Ionicons" name={tag.icon} size={ms(10)} color={tag.color} />
          <AppText variant="small" color="#555">{tag.text}</AppText>
        </View>
      ))}
    </View>
  </View>
);

const getBarColor = (val) => val === 28 ? Colors.primary : val < 28 ? Colors.amber : Colors.accent;

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

const MenstrualRecordsTab = ({navigation}) => {
  return (
    <View>
      {/* Stats banner */}
      <View style={st.statsBanner}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(10)}}>
          <View style={st.statsIcon}><Icon family="Ionicons" name="flower-outline" size={ms(22)} color={Colors.white} /></View>
          <View>
            <AppText variant="bodyBold" color={Colors.white}>Cycle & hormonal health</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">Priya {'\u00b7'} 9 cycles tracked</AppText>
          </View>
        </View>
        <View style={st.statsGrid}>
          {[
            {l: 'Avg length', v: '28d', s2: '27-29 range'},
            {l: 'Period avg', v: '5.1d', s2: '4-6 range'},
            {l: 'Cycles', v: '9', s2: 'Since Jan 24'},
            {l: 'Std dev', v: '0.9', s2: 'Very regular'},
          ].map((item, i) => (
            <View key={i} style={st.statCell}>
              <AppText variant="subtext" color="rgba(255,255,255,0.4)" style={{textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(2), fontSize: ms(7)}}>{item.l}</AppText>
              <AppText variant="bodyBold" color={Colors.white} style={{fontWeight: '800', fontSize: ms(16), lineHeight: ms(18)}}>{item.v}</AppText>
              <AppText variant="subtext" color="rgba(255,255,255,0.45)" style={{marginTop: vs(1)}}>{item.s2}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Ayu Intel button */}
      <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'cycle', initialTab: 'cycleIntel'})}>
        <View style={st.ayuIcon}><Icon family="Ionicons" name="bulb-outline" size={ms(16)} color={Colors.white} /></View>
        <View style={{flex: 1}}>
          <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel {'\u00b7'} Women's health</AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.7)">PCOS {'\u00b7'} Hormones {'\u00b7'} Fertility</AppText>
        </View>
        <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      {/* Green insight */}
      <View style={st.insightGreen}>
        <Icon family="Ionicons" name="checkmark-circle" size={ms(14)} color={Colors.tealText} />
        <AppText variant="caption" color={Colors.tealText} style={{flex: 1, lineHeight: ms(17)}}>
          <AppText style={{fontWeight: '700'}}>Excellent cycle regularity.</AppText> Standard deviation 0.9 days across 9 cycles indicates consistent ovulation despite T2DM. Anovulatory cycles (common with poor glucose control) do not appear in your data. Your Metformin adherence is likely contributing to this regularity.
        </AppText>
      </View>

      {/* Cycle length trend */}
      <Section title="Cycle length trend \u00b7 9 cycles" />
      <View style={st.chartCard}>
        {/* Legend */}
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'flex-end', gap: s(10), marginBottom: vs(8)}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(3)}}>
            <View style={{width: ms(8), height: ms(8), borderRadius: ms(2), backgroundColor: Colors.primary}} />
            <AppText variant="subtext" color={Colors.textTertiary}>28d</AppText>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(3)}}>
            <View style={{width: ms(8), height: ms(8), borderRadius: ms(2), backgroundColor: Colors.amber}} />
            <AppText variant="subtext" color={Colors.textTertiary}>{'<28d'}</AppText>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(3)}}>
            <View style={{width: ms(8), height: ms(8), borderRadius: ms(2), backgroundColor: Colors.accent}} />
            <AppText variant="subtext" color={Colors.textTertiary}>{'>28d'}</AppText>
          </View>
        </View>
        {/* Bars */}
        <View style={st.barsRow}>
          {CYCLE_LENGTHS.map((val, i) => {
            const color = getBarColor(val);
            const barH = ((val - 24) / 6) * vs(70);
            return (
              <View key={i} style={{flex: 1, alignItems: 'center'}}>
                <AppText variant="subtext" color={color} style={{fontWeight: '700', marginBottom: vs(2)}}>{val}d</AppText>
                <View style={{width: '60%', height: barH, borderTopLeftRadius: ms(3), borderTopRightRadius: ms(3), backgroundColor: color, opacity: i === CYCLE_LENGTHS.length - 1 ? 1 : 0.7}} />
                <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(2), fontSize: ms(7)}}>{CYCLE_LABELS[i]}</AppText>
              </View>
            );
          })}
        </View>
        {/* Dashed 28d reference */}
        <View style={{position: 'absolute', left: s(12), right: s(12), top: vs(38), flexDirection: 'row', alignItems: 'center'}}>
          <AppText variant="subtext" color={Colors.textTertiary} style={{fontSize: ms(7), marginRight: s(4)}}>28d</AppText>
          <View style={{flex: 1, height: 0, borderTopWidth: 1, borderStyle: 'dashed', borderColor: 'rgba(10,92,71,0.25)'}} />
        </View>
      </View>

      {/* Previous cycles */}
      {CYCLES.map((cycle, i) => (
        <View key={i}>
          <MonthSep month={cycle.month} badge={cycle.badge} />
          <CycleEntry item={cycle} />
        </View>
      ))}

      {/* Pink insight */}
      <View style={st.insightPink}>
        <Icon family="Ionicons" name="alert-circle" size={ms(14)} color="#6B0032" />
        <AppText variant="caption" color="#6B0032" style={{flex: 1, lineHeight: ms(17)}}>
          <AppText style={{fontWeight: '700'}}>Perimenstrual migraine - confirmed pattern.</AppText> Days 25-28 migraine in Nov 2025, Feb 2026, and today is Day 24. Classic estrogen-withdrawal migraine. Discuss at Apr 4: short-course frovatriptan (2.5mg BD, Day 23-27), or transdermal estrogen patch to buffer the estrogen drop.
        </AppText>
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  // Stats banner
  statsBanner: {backgroundColor: Colors.primary, borderRadius: ms(16), padding: ms(14), marginBottom: vs(10)},
  statsIcon: {width: ms(44), height: ms(44), borderRadius: ms(12), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  statsGrid: {flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: ms(12), overflow: 'hidden', gap: 1},
  statCell: {flex: 1, padding: ms(9), backgroundColor: 'rgba(0,0,0,0.2)'},

  // Ayu Intel
  ayuBtn: {flexDirection: 'row', alignItems: 'center', gap: s(8), backgroundColor: Colors.accent, borderRadius: ms(12), padding: ms(12), marginBottom: vs(10)},
  ayuIcon: {width: ms(34), height: ms(34), borderRadius: ms(9), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(12), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Insights
  insightGreen: {backgroundColor: Colors.tealBg, borderRadius: ms(11), padding: ms(10), marginBottom: vs(10), flexDirection: 'row', alignItems: 'flex-start', gap: s(8)},
  insightPink: {backgroundColor: '#FEF0F6', borderRadius: ms(11), padding: ms(10), marginTop: vs(4), marginBottom: vs(10), flexDirection: 'row', alignItems: 'flex-start', gap: s(8)},

  // Chart
  chartCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12), marginBottom: vs(10), position: 'relative'},
  barsRow: {flexDirection: 'row', alignItems: 'flex-end', height: vs(100), gap: s(2)},

  // Month separator
  monthSep: {flexDirection: 'row', alignItems: 'center', gap: s(8), paddingVertical: vs(10)},
  monthLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},
  monthBadge: {backgroundColor: Colors.tealBg, paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(10)},

  // Cycle entry
  entry: {backgroundColor: Colors.white, borderRadius: ms(13), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12), marginBottom: vs(8)},
  entryHdr: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(8)},
  statusBadge: {paddingHorizontal: s(9), paddingVertical: vs(3), borderRadius: ms(20)},
  tagRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6)},
  tag: {flexDirection: 'row', alignItems: 'center', gap: s(3), backgroundColor: '#f4f7f5', paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(20)},
});

export default MenstrualRecordsTab;
