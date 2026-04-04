import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

// ── Data ──

const FILTERS = [
  {key: 'all', label: 'All (62)', icon: 'grid-outline'},
  {key: 'resting', label: 'Resting (28)', icon: 'bed-outline'},
  {key: 'active', label: 'Active (22)', icon: 'barbell-outline'},
  {key: 'hrv', label: 'HRV', icon: 'pulse-outline'},
  {key: 'flagged', label: 'Flagged (4)', icon: 'warning-outline'},
  {key: 'spo2', label: 'SpO2', icon: 'cloud-outline'},
];

const READINGS = [
  {
    dateGroup: '28 March 2026 - Saturday',
    items: [
      {time: '9:38', ampm: 'AM', type: 'Resting - Sitting', value: '74', unit: 'bpm', color: Colors.tealDark, barColor: Colors.accent, pills: [{t: 'Normal', s: 'pg'}, {t: 'HRV 28ms', s: 'pn'}, {t: 'SpO2 97%', s: 'pb'}], source: 'Apple Watch', cat: 'resting'},
      {time: '8:14', ampm: 'AM', type: 'Post-walk - Standing', value: '118', unit: 'bpm', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Active zone', s: 'pa'}, {t: 'SpO2 96%', s: 'pb'}], source: 'Apple Watch', delta: '-16 vs peak', deltaColor: Colors.tealDark, cat: 'active'},
    ],
  },
  {
    dateGroup: '27 March 2026 - Friday',
    items: [
      {time: '7:04', ampm: 'AM', type: 'Waking resting', value: '68', unit: 'bpm', color: Colors.tealDark, barColor: Colors.accent, pills: [{t: 'Good', s: 'pg'}, {t: 'HRV 33ms', s: 'pg'}, {t: 'SpO2 98%', s: 'pb'}], source: 'Apple Watch', delta: '7.2h sleep', deltaColor: Colors.tealDark, cat: 'resting'},
    ],
  },
  {
    dateGroup: '25 March 2026 - Wednesday',
    items: [
      {time: '10:22', ampm: 'AM', type: 'Resting - High stress day', value: '94', unit: 'bpm', color: Colors.red, barColor: Colors.red, pills: [{t: 'Elevated resting', s: 'pa'}, {t: 'HRV 18ms', s: 'pn'}, {t: 'SpO2 95%', s: 'pb'}], source: 'Apple Watch', delta: 'Flag', deltaColor: Colors.red, flagged: true, cat: 'resting'},
    ],
  },
  {
    dateGroup: '22 March 2026 - Sunday',
    items: [
      {time: '7:58', ampm: 'AM', type: 'Peak - Brisk walk - Auto', value: '142', unit: 'bpm', color: Colors.red, barColor: Colors.red, pills: [{t: 'Peak zone', s: 'pa'}, {t: 'SpO2 95%', s: 'pb'}], source: 'Apple Watch', delta: 'Highest this month', deltaColor: Colors.tealDark, cat: 'active'},
    ],
  },
  {
    dateGroup: '20 March 2026 - Friday',
    items: [
      {time: '6:58', ampm: 'AM', type: 'Waking resting', value: '66', unit: 'bpm', color: Colors.tealDark, barColor: Colors.accent, pills: [{t: 'Excellent', s: 'pg'}, {t: 'HRV 36ms', s: 'pg'}, {t: 'SpO2 98%', s: 'pb'}], source: 'Apple Watch', delta: '7.8h sleep', deltaColor: Colors.tealDark, cat: 'resting'},
    ],
  },
  {
    dateGroup: '14 March 2026 - Saturday',
    items: [
      {time: '7:10', ampm: 'AM', type: 'Waking resting', value: '64', unit: 'bpm', color: Colors.tealDark, barColor: Colors.accent, pills: [{t: 'Excellent', s: 'pg'}, {t: 'HRV 34ms', s: 'pn'}, {t: 'SpO2 97%', s: 'pb'}], source: 'Apple Watch', delta: 'Lowest this month', deltaColor: Colors.tealDark, cat: 'resting'},
    ],
  },
];

const PILL_STYLES = {
  pg: {bg: Colors.tealBg, color: Colors.tealText},
  pa: {bg: Colors.amberBg, color: Colors.amberDark},
  pr: {bg: Colors.redBg, color: Colors.redDark},
  pb: {bg: Colors.blueBg, color: Colors.blueText},
  pn: {bg: '#f0f0f0', color: '#555'},
};

// ── Sub-components ──

const Pill = ({text, style: ps}) => {
  const s2 = PILL_STYLES[ps] || PILL_STYLES.pn;
  return (<View style={[st.pill, {backgroundColor: s2.bg}]}><AppText style={{fontSize: ms(8), fontWeight: '700', color: s2.color}}>{text}</AppText></View>);
};

const ReadingRow = ({item}) => (
  <View style={[st.readingRow, item.flagged && {borderWidth: 0.5, borderColor: '#F7C1C1'}]}>
    <View style={[st.rrLeft, {backgroundColor: item.barColor}]} />
    <View style={st.rrBody}>
      <View style={st.rrTimeCol}>
        <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>{item.time}</AppText>
        <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(1)}}>{item.ampm}</AppText>
      </View>
      <View style={st.rrDiv} />
      <View style={{flex: 1, paddingLeft: s(10)}}>
        <AppText style={{fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(2)}}>{item.type}</AppText>
        <View style={{flexDirection: 'row', alignItems: 'baseline', gap: s(4)}}>
          <AppText style={{fontSize: ms(22), fontWeight: '800', color: item.color, lineHeight: ms(24)}}>{item.value}</AppText>
          <AppText style={{fontSize: ms(10), color: Colors.textTertiary}}>{item.unit}</AppText>
        </View>
        <View style={{flexDirection: 'row', gap: s(5), marginTop: vs(3), flexWrap: 'wrap'}}>
          {item.pills.map((p, i) => <Pill key={i} text={p.t} style={p.s} />)}
        </View>
      </View>
      <View style={{alignItems: 'flex-end', flexShrink: 0}}>
        <AppText style={{fontSize: ms(8), color: '#bbb', marginBottom: vs(4)}}>{item.source}</AppText>
        {item.delta && <AppText style={{fontSize: ms(10), fontWeight: '600', color: item.deltaColor}}>{item.delta}</AppText>}
      </View>
    </View>
  </View>
);

const MetricCard = ({label, value, unit, valueColor, sub, pct, barColor}) => (
  <View style={st.metricCard}>
    <AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(4)}}>{label}</AppText>
    <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
      <AppText style={{fontSize: ms(22), fontWeight: '700', color: valueColor}}>{value}</AppText>
      <AppText style={{fontSize: ms(11), fontWeight: '400', color: Colors.textTertiary}}>{unit}</AppText>
    </View>
    <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginTop: vs(3)}}>{sub}</AppText>
    {pct !== undefined && (
      <View style={[st.habitBar, {marginTop: vs(6)}]}>
        <View style={{height: '100%', width: `${pct}%`, backgroundColor: barColor, borderRadius: ms(3)}} />
      </View>
    )}
  </View>
);

const BarCol = ({topLabel, topColor, height, barColor, bottomLabel, bottomBold}) => (
  <View style={{flex: 1, alignItems: 'center'}}>
    <AppText style={{fontSize: ms(8), fontWeight: '700', color: topColor, marginBottom: vs(2)}}>{topLabel}</AppText>
    <View style={{flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'center'}}>
      <View style={{width: '100%', borderTopLeftRadius: ms(3), borderTopRightRadius: ms(3), backgroundColor: barColor, height}} />
    </View>
    <AppText style={{fontSize: ms(8), color: bottomBold ? Colors.textSecondary : Colors.textTertiary, fontWeight: bottomBold ? '700' : '400', marginTop: vs(2)}}>{bottomLabel}</AppText>
  </View>
);

// ── Main Component ──

const HRRecordsTab = ({navigation}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const getFiltered = () => {
    if (activeFilter === 'all') return READINGS;
    if (activeFilter === 'hrv' || activeFilter === 'spo2') return READINGS; // show all with different context
    return READINGS.map(g => ({
      ...g,
      items: g.items.filter(item => {
        if (activeFilter === 'flagged') return item.flagged;
        return item.cat === activeFilter;
      }),
    })).filter(g => g.items.length > 0);
  };

  return (
    <View>
      {/* Stats banner */}
      <View style={st.statsBanner}>
        <View style={{paddingHorizontal: s(16), paddingTop: vs(10), paddingBottom: vs(6)}}>
          <AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.8, marginBottom: vs(2)}}>Records - Heart rate</AppText>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8)}}>
            <Icon family="Ionicons" name="pulse" size={ms(18)} color={Colors.white} />
            <AppText style={{fontSize: ms(19), fontWeight: '700', color: Colors.white}}>Heart Rate</AppText>
            <View style={[st.pill, {backgroundColor: Colors.tealBg}]}><AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.tealText}}>Normal range</AppText></View>
          </View>
          <AppText style={{fontSize: ms(11), color: 'rgba(255,255,255,0.45)', marginTop: vs(1)}}>Priya Reddy - Apple Watch - 62 readings - March 2026</AppText>
        </View>
        <View style={st.statsRow}>
          <View style={st.statBox}><AppText style={st.statLabel}>Avg Resting</AppText><AppText style={st.statValue}>74</AppText><AppText style={st.statSub}>bpm</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>HRV avg</AppText><AppText style={st.statValue}>28</AppText><AppText style={st.statSub}>ms - low</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>Avg SpO2</AppText><AppText style={st.statValue}>97%</AppText><AppText style={st.statSub}>normal</AppText></View>
          <View style={[st.statBox, {borderRightWidth: 0}]}><AppText style={st.statLabel}>Readings</AppText><AppText style={st.statValue}>62</AppText><AppText style={st.statSub}>this month</AppText></View>
        </View>
      </View>

      {/* Filter pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: s(6), gap: s(6), paddingBottom: vs(10), paddingTop: vs(10)}}>
        {FILTERS.map(f => {
          const active = activeFilter === f.key;
          return (
            <TouchableOpacity key={f.key} style={[st.filterPill, active && st.filterPillActive]} onPress={() => setActiveFilter(f.key)} activeOpacity={0.7}>
              <Icon family="Ionicons" name={f.icon} size={ms(12)} color={active ? Colors.white : Colors.textSecondary} />
              <AppText style={{fontSize: ms(11), fontWeight: '600', color: active ? Colors.white : Colors.textSecondary, marginLeft: s(6)}}>{f.label}</AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Ayu Intel button */}
      <View style={{paddingHorizontal: s(6), marginBottom: vs(12)}}>
        <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'heartRate', initialTab: 'hrIntel'})}>
          <View style={st.ayuIconWrap}><Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.white} /></View>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Heart Rate</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginTop: vs(1)}}>HRV analysis - Sleep quality - Recovery patterns</AppText>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>

      {/* Readings */}
      <View style={{paddingHorizontal: s(6)}}>
        {getFiltered().map((group, gi) => (
          <View key={gi}>
            <View style={st.dateGroup}>
              <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginRight: s(8)}}>{group.dateGroup}</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            {group.items.map((item, ri) => <ReadingRow key={ri} item={item} />)}
          </View>
        ))}

        {/* March summary */}
        <View style={st.secLabel}>
          <AppText style={{fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: Colors.textSecondary, marginRight: s(8)}}>March summary</AppText>
          <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
        </View>

        <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: vs(10)}}>
          <MetricCard label="Avg resting HR" value="74" unit=" bpm" valueColor={Colors.tealDark} sub="Normal: 60-100" pct={60} barColor={Colors.accent} />
          <MetricCard label="Avg HRV" value="28" unit=" ms" valueColor={Colors.red} sub={'Target: >40 ms'} pct={35} barColor={Colors.red} />
          <MetricCard label="Avg SpO2" value="97" unit="%" valueColor={Colors.tealDark} sub="Normal >=95% - range 94-99%" pct={97} barColor={Colors.accent} />
          <MetricCard label="Highest (active)" value="142" unit=" bpm" valueColor={Colors.amber} sub="22 Mar - brisk walk" />
        </View>

        {/* Weekly resting HR */}
        <View style={st.trendCard}>
          <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(10)}}>Weekly resting HR - March 2026</AppText>
          <View style={{flexDirection: 'row', gap: s(6), height: vs(75), marginBottom: vs(8)}}>
            <BarCol topLabel="77" topColor={Colors.amber} height={vs(44)} barColor={Colors.amber} bottomLabel="W1" />
            <BarCol topLabel="75" topColor={Colors.amber} height={vs(38)} barColor={Colors.amber} bottomLabel="W2" />
            <BarCol topLabel="73" topColor={Colors.accent} height={vs(32)} barColor={Colors.accent} bottomLabel="W3" />
            <BarCol topLabel="72" topColor={Colors.accent} height={vs(28)} barColor={Colors.accent} bottomLabel="W4" bottomBold />
          </View>
          <AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.primary, textAlign: 'center'}}>Resting HR declining - improving cardiovascular fitness</AppText>
        </View>

        {/* Weekly HRV */}
        <View style={st.trendCard}>
          <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(10)}}>Weekly HRV avg - March 2026</AppText>
          <View style={{flexDirection: 'row', gap: s(6), height: vs(75)}}>
            <BarCol topLabel="24" topColor={Colors.red} height={vs(20)} barColor={Colors.red} bottomLabel="W1" />
            <BarCol topLabel="26" topColor={Colors.red} height={vs(24)} barColor={Colors.red} bottomLabel="W2" />
            <BarCol topLabel="30" topColor={Colors.amber} height={vs(32)} barColor={Colors.amber} bottomLabel="W3" />
            <BarCol topLabel="32" topColor={Colors.amber} height={vs(36)} barColor={Colors.amber} bottomLabel="W4" bottomBold />
          </View>
          <AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.amberDark, textAlign: 'center', marginTop: vs(6)}}>HRV improving but still below 40 ms target</AppText>
        </View>

        <TouchableOpacity style={{alignItems: 'center', paddingVertical: vs(12)}}>
          <AppText variant="caption" color={Colors.textSecondary}>Load all 62 readings</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ── Styles ──

const st = StyleSheet.create({
  statsBanner: {backgroundColor: Colors.primary, borderRadius: ms(14), marginHorizontal: s(4), overflow: 'hidden', marginBottom: vs(4)},
  statsRow: {flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.1)'},
  statBox: {flex: 1, paddingVertical: vs(8), paddingHorizontal: s(10), borderRightWidth: 0.5, borderRightColor: 'rgba(255,255,255,0.1)'},
  statLabel: {fontSize: ms(8), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, color: 'rgba(255,255,255,0.38)', marginBottom: vs(2)},
  statValue: {fontSize: ms(15), fontWeight: '700', color: Colors.white},
  statSub: {fontSize: ms(8), color: 'rgba(255,255,255,0.38)', marginTop: vs(1)},
  filterPill: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(18), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.white},
  filterPillActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  ayuBtn: {flexDirection: 'row', alignItems: 'center', gap: s(8), backgroundColor: Colors.accent, borderRadius: ms(12), padding: ms(12)},
  ayuIconWrap: {width: ms(36), height: ms(36), borderRadius: ms(10), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  dateGroup: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)},
  secLabel: {flexDirection: 'row', alignItems: 'center', marginTop: vs(16), marginBottom: vs(8)},
  pill: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(10)},
  readingRow: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#dde8e2', marginBottom: vs(7), overflow: 'hidden', flexDirection: 'row', alignItems: 'stretch'},
  rrLeft: {width: ms(4)},
  rrBody: {flex: 1, flexDirection: 'row', alignItems: 'center', padding: ms(9), gap: s(10)},
  rrTimeCol: {alignItems: 'center', minWidth: s(38)},
  rrDiv: {width: 0.5, backgroundColor: '#f0f4f2', alignSelf: 'stretch'},
  metricCard: {width: '48%', backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(11), marginBottom: vs(8)},
  habitBar: {height: ms(5), backgroundColor: '#edf2ef', borderRadius: ms(3), overflow: 'hidden'},
  trendCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(13), marginBottom: vs(10)},
});

export default HRRecordsTab;
