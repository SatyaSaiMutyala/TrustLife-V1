import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

const FILTERS = [
  {key: 'all', label: 'All'},
  {key: 'yellow', label: 'Yellow days'},
  {key: 'rescue', label: 'Rescue use'},
];

const PILL_STYLES = {pg: {bg: Colors.tealBg, color: Colors.tealText}, pa: {bg: Colors.amberBg, color: Colors.amberDark}, pr: {bg: Colors.redBg, color: Colors.redDark}, pn: {bg: '#f0f0f0', color: '#555'}};
const Pill = ({text, style: ps}) => { const s2 = PILL_STYLES[ps] || PILL_STYLES.pn; return (<View style={[st.pill, {backgroundColor: s2.bg}]}><AppText style={{fontSize: ms(8), fontWeight: '700', color: s2.color}}>{text}</AppText></View>); };

const ReadingRow = ({item}) => (
  <View style={st.readingRow}>
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

const BarCol = ({topLabel, topColor, height, barColor, bottomLabel, bold}) => (
  <View style={{flex: 1, alignItems: 'center'}}>
    <AppText style={{fontSize: ms(8), fontWeight: '700', color: topColor, marginBottom: vs(2)}}>{topLabel}</AppText>
    <View style={{flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'center'}}>
      <View style={{width: '100%', borderTopLeftRadius: ms(3), borderTopRightRadius: ms(3), backgroundColor: barColor, height}} />
    </View>
    <AppText style={{fontSize: ms(8), color: bold ? Colors.textSecondary : Colors.textTertiary, fontWeight: bold ? '700' : '400', marginTop: vs(2)}}>{bottomLabel}</AppText>
  </View>
);

const ALL_READINGS = [
  {dateGroup: 'March 2026', items: [
    {time: '9:41', ampm: 'AM', type: 'Morning - No symptoms - 28 Mar', value: '335', unit: 'L/min', color: Colors.primary, barColor: Colors.accent, pills: [{t: '88% - Green', s: 'pg'}, {t: 'No rescue', s: 'pn'}], source: 'Nuvoair', delta: 'Today', deltaColor: Colors.tealDark},
    {time: '8:15', ampm: 'PM', type: 'Evening - 26 Mar', value: '328', unit: 'L/min', color: Colors.primary, barColor: Colors.accent, pills: [{t: '86% - Green', s: 'pg'}, {t: 'No rescue', s: 'pn'}], source: 'Nuvoair', delta: '-7', deltaColor: Colors.textTertiary},
    {time: '7:50', ampm: 'AM', type: 'Morning - Dust trigger - 24 Mar', value: '295', unit: 'L/min', color: Colors.amber, barColor: Colors.amber, pills: [{t: '78% - Yellow', s: 'pa'}, {t: 'Wheeze - 2 puffs', s: 'pa'}], source: 'Manual', delta: '-33', deltaColor: Colors.red},
    {time: '8:00', ampm: 'AM', type: 'Morning - 22 Mar', value: '340', unit: 'L/min', color: Colors.primary, barColor: Colors.accent, pills: [{t: '89% - Green', s: 'pg'}, {t: 'No rescue', s: 'pn'}], source: 'Nuvoair'},
    {time: '6:45', ampm: 'AM', type: 'On waking - 19 Mar - Cold air prev eve', value: '288', unit: 'L/min', color: Colors.amber, barColor: Colors.amber, pills: [{t: '76% - Yellow', s: 'pa'}, {t: 'Chest tight - 2 puffs', s: 'pa'}], source: 'Manual', delta: 'Yellow', deltaColor: Colors.red},
    {time: '8:10', ampm: 'AM', type: 'Morning - 15 Mar - Clinic', value: '342', unit: 'L/min', color: Colors.primary, barColor: Colors.accent, pills: [{t: '90% - Green', s: 'pg'}, {t: 'Dr. Kavitha', s: 'pn'}], source: 'Clinic'},
    {time: '7:55', ampm: 'AM', type: 'Morning - 8 Mar', value: '330', unit: 'L/min', color: Colors.primary, barColor: Colors.accent, pills: [{t: '87% - Green', s: 'pg'}, {t: 'No rescue', s: 'pn'}], source: 'Nuvoair'},
  ]},
  {dateGroup: 'February 2026', items: [
    {time: '8:00', ampm: 'AM', type: 'Morning - 22 Feb', value: '320', unit: 'L/min', color: Colors.primary, barColor: Colors.accent, pills: [{t: '84% - Green', s: 'pg'}, {t: 'No rescue', s: 'pn'}], source: 'Nuvoair'},
    {time: '7:30', ampm: 'AM', type: 'Morning - 10 Feb - Stress week', value: '275', unit: 'L/min', color: Colors.amber, barColor: Colors.amber, pills: [{t: '72% - Yellow', s: 'pa'}, {t: 'Wheeze - 2 puffs', s: 'pa'}], source: 'Manual', delta: 'Yellow', deltaColor: Colors.red},
  ]},
  {dateGroup: 'January 2026 - Establishing personal best', items: [
    {time: '8:00', ampm: 'AM', type: 'Personal best established - 18 Jan', value: '380', unit: 'L/min', color: Colors.primary, barColor: Colors.accent, pills: [{t: '100% - Personal best', s: 'pg'}], source: 'Clinic', delta: 'Best', deltaColor: Colors.tealDark},
  ]},
];

const YELLOW_READINGS = [
  {dateGroup: 'March 2026', items: [
    {time: '7:50', ampm: 'AM', type: '24 Mar - Dust trigger', value: '295', unit: 'L/min - 78%', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Wheeze', s: 'pa'}, {t: '2 puffs Salbutamol', s: 'pa'}], source: 'Manual', delta: 'Yellow', deltaColor: Colors.red},
    {time: '6:45', ampm: 'AM', type: '19 Mar - Cold air', value: '288', unit: 'L/min - 76%', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Chest tight', s: 'pa'}, {t: '2 puffs Salbutamol', s: 'pa'}], source: 'Manual', delta: 'Yellow', deltaColor: Colors.red},
  ]},
  {dateGroup: 'February 2026', items: [
    {time: '7:30', ampm: 'AM', type: '10 Feb - Stress week', value: '275', unit: 'L/min - 72%', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Wheeze', s: 'pa'}, {t: '2 puffs Salbutamol', s: 'pa'}], source: 'Manual', delta: 'Yellow', deltaColor: Colors.red},
  ]},
];

const RESCUE_READINGS = [
  {dateGroup: 'Rescue use history - March 2026', items: [
    {time: '24', ampm: 'Mar', type: 'Dust trigger - 7:50 AM', value: '2', unit: 'puffs', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'PEF 295 (78%)', s: 'pa'}, {t: 'Wheeze resolved in 20 min', s: 'pn'}], source: 'Propeller', delta: 'Rapid relief', deltaColor: Colors.textTertiary},
    {time: '19', ampm: 'Mar', type: 'Cold air exposure - 6:45 AM', value: '2', unit: 'puffs', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'PEF 288 (76%)', s: 'pa'}, {t: 'Chest tight - Resolved 25 min', s: 'pn'}], source: 'Propeller', delta: 'Rapid relief', deltaColor: Colors.textTertiary},
  ]},
];

const AsthmaRecordsTab = ({navigation}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const readings = activeFilter === 'yellow' ? YELLOW_READINGS : activeFilter === 'rescue' ? RESCUE_READINGS : ALL_READINGS;

  return (
    <View>
      {/* Stats banner */}
      <View style={st.statsBanner}>
        <View style={{paddingHorizontal: s(16), paddingTop: vs(10), paddingBottom: vs(6)}}>
          <AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.8, marginBottom: vs(2)}}>Records - Asthma</AppText>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8)}}>
            <Icon family="Ionicons" name="cloud-outline" size={ms(18)} color={Colors.white} />
            <AppText style={{fontSize: ms(19), fontWeight: '700', color: Colors.white}}>Peak Flow Log</AppText>
            <View style={[st.pill, {backgroundColor: Colors.tealBg}]}><AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.tealText}}>Mostly Green</AppText></View>
          </View>
          <AppText style={{fontSize: ms(11), color: 'rgba(255,255,255,0.45)', marginTop: vs(1)}}>Personal best: 380 L/min - Since Jan 2026</AppText>
        </View>
        <View style={st.statsRow}>
          <View style={st.statBox}><AppText style={st.statLabel}>Latest PEF</AppText><AppText style={st.statValue}>335 L/min</AppText><AppText style={st.statSub}>88% - Green</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>30-day avg</AppText><AppText style={st.statValue}>81%</AppText><AppText style={st.statSub}>of personal best</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>Green days</AppText><AppText style={st.statValue}>22/28</AppText><AppText style={st.statSub}>this month</AppText></View>
          <View style={[st.statBox, {borderRightWidth: 0}]}><AppText style={st.statLabel}>Rescue</AppText><AppText style={st.statValue}>4 puffs</AppText><AppText style={st.statSub}>this week</AppText></View>
        </View>
      </View>

      {/* Filter pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: s(6), gap: s(6), paddingBottom: vs(10), paddingTop: vs(10)}}>
        {FILTERS.map(f => {
          const active = activeFilter === f.key;
          return (
            <TouchableOpacity key={f.key} style={[st.filterPill, active && st.filterPillActive]} onPress={() => setActiveFilter(f.key)} activeOpacity={0.7}>
              <AppText style={{fontSize: ms(11), fontWeight: '600', color: active ? Colors.white : Colors.textSecondary}}>{f.label}</AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Ayu Intel */}
      <View style={{paddingHorizontal: s(6), marginBottom: vs(12)}}>
        <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'asthma', initialTab: 'asthmaIntel'})}>
          <View style={st.ayuIconWrap}><Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.white} /></View>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Asthma</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginTop: vs(1)}}>Trigger analysis - Control score - Condition impact</AppText>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>

      <View style={{paddingHorizontal: s(6)}}>
        {/* Summary cards */}
        {activeFilter === 'all' && (
          <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
            <View style={[st.summaryCard, {flex: 1, backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Latest PEF</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.primary}}>335</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>L/min - 88%</AppText></View>
            <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Avg % best</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.primary}}>81%</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>30-day avg</AppText></View>
            <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Personal best</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.primary}}>380</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>L/min</AppText></View>
          </View>
        )}
        {activeFilter === 'yellow' && (
          <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
            <View style={[st.summaryCard, {flex: 1, backgroundColor: Colors.amberBg, borderColor: '#F5C88A'}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Yellow days (30d)</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.amber}}>6</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>of 28 days</AppText></View>
            <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Rescue on yellow</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.amber}}>6 puffs</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>avg 1 puff/day</AppText></View>
          </View>
        )}
        {activeFilter === 'rescue' && (
          <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
            <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>This week</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.amber}}>4 puffs</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Salbutamol</AppText></View>
            <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>This month</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.amber}}>10 puffs</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>6 events</AppText></View>
            <View style={[st.summaryCard, {flex: 1, backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Control target</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.tealDark}}>{'<'}2/wk</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>GINA guideline</AppText></View>
          </View>
        )}

        {/* Reading rows */}
        {readings.map((group, gi) => (
          <View key={gi}>
            <View style={st.dateGroup}>
              <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginRight: s(8)}}>{group.dateGroup}</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            {group.items.map((item, ri) => <ReadingRow key={ri} item={item} />)}
          </View>
        ))}

        {/* Footnotes */}
        {activeFilter === 'yellow' && (
          <View style={{backgroundColor: Colors.amberBg, borderRadius: ms(12), padding: ms(11), marginTop: vs(4)}}>
            <AppText style={{fontSize: ms(10), color: Colors.amberDark, lineHeight: ms(16)}}>6 yellow days in 28 - equivalent to GINA Step 2 partially controlled asthma. If yellow days exceed 2/week for 4+ weeks, preventer dose review with Dr. Kavitha may be needed.</AppText>
          </View>
        )}

        {/* 30-day PEF trend */}
        {activeFilter === 'all' && (
          <View>
            <View style={st.secLabel}>
              <AppText style={{fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: Colors.textSecondary, marginRight: s(8)}}>30-day PEF trend</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            <View style={[st.summaryCard, {padding: ms(13), alignItems: 'stretch'}]}>
              <View style={{flexDirection: 'row', gap: s(5), height: vs(70), position: 'relative'}}>
                <View style={{position: 'absolute', bottom: '51%', left: 0, right: 0, borderTopWidth: 1.5, borderStyle: 'dashed', borderTopColor: 'rgba(29,158,117,0.4)'}} />
                <View style={{position: 'absolute', bottom: '22%', left: 0, right: 0, borderTopWidth: 1, borderStyle: 'dotted', borderTopColor: 'rgba(186,117,23,0.4)'}} />
                <BarCol topLabel="275" topColor={Colors.amber} height={vs(30)} barColor={Colors.amber} bottomLabel="10F" />
                <BarCol topLabel="320" topColor={Colors.accent} height={vs(48)} barColor={Colors.accent} bottomLabel="22F" />
                <BarCol topLabel="340" topColor={Colors.accent} height={vs(56)} barColor={Colors.accent} bottomLabel="8M" />
                <BarCol topLabel="288" topColor={Colors.amber} height={vs(34)} barColor={Colors.amber} bottomLabel="19M" />
                <BarCol topLabel="342" topColor={Colors.accent} height={vs(58)} barColor={Colors.accent} bottomLabel="22M" />
                <BarCol topLabel="295" topColor={Colors.amber} height={vs(38)} barColor={Colors.amber} bottomLabel="24M" />
                <BarCol topLabel="335" topColor={Colors.accent} height={vs(54)} barColor={Colors.accent} bottomLabel="28M" bold />
              </View>
              <AppText style={{fontSize: ms(9), color: Colors.textTertiary, textAlign: 'center', marginTop: vs(6)}}>Green dashed = 80% threshold - Yellow dotted = 50% line</AppText>
            </View>
          </View>
        )}
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  statsBanner: {backgroundColor: Colors.primary, borderRadius: ms(14), marginHorizontal: s(4), overflow: 'hidden', marginBottom: vs(4)},
  statsRow: {flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.1)'},
  statBox: {flex: 1, paddingVertical: vs(8), paddingHorizontal: s(10), borderRightWidth: 0.5, borderRightColor: 'rgba(255,255,255,0.1)'},
  statLabel: {fontSize: ms(8), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, color: 'rgba(255,255,255,0.38)', marginBottom: vs(2)},
  statValue: {fontSize: ms(15), fontWeight: '700', color: Colors.white},
  statSub: {fontSize: ms(8), color: 'rgba(255,255,255,0.38)', marginTop: vs(1)},
  filterPill: {paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(18), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.white},
  filterPillActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  ayuBtn: {flexDirection: 'row', alignItems: 'center', gap: s(8), backgroundColor: Colors.accent, borderRadius: ms(12), padding: ms(12)},
  ayuIconWrap: {width: ms(36), height: ms(36), borderRadius: ms(10), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  summaryCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(10), alignItems: 'center'},
  dateGroup: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)},
  secLabel: {flexDirection: 'row', alignItems: 'center', marginTop: vs(16), marginBottom: vs(8)},
  pill: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(10)},
  readingRow: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#dde8e2', marginBottom: vs(7), overflow: 'hidden', flexDirection: 'row', alignItems: 'stretch'},
  rrLeft: {width: ms(4)},
  rrBody: {flex: 1, flexDirection: 'row', alignItems: 'center', padding: ms(9), gap: s(10)},
  rrTimeCol: {alignItems: 'center', minWidth: s(38)},
  rrDiv: {width: 0.5, backgroundColor: '#f0f4f2', alignSelf: 'stretch'},
});

export default AsthmaRecordsTab;
