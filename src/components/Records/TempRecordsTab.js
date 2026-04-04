import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

const FILTERS = [
  {key: 'all', label: 'All (42)'},
  {key: 'fever', label: 'Fever (4)'},
  {key: 'flagged', label: 'Flagged (2)'},
];

const PILL_STYLES = {
  pg: {bg: Colors.tealBg, color: Colors.tealText},
  pa: {bg: Colors.amberBg, color: Colors.amberDark},
  pr: {bg: Colors.redBg, color: Colors.redDark},
  pb: {bg: Colors.blueBg, color: Colors.blueText},
  pn: {bg: '#f0f0f0', color: '#555'},
};

const Pill = ({text, style: ps}) => {
  const s2 = PILL_STYLES[ps] || PILL_STYLES.pn;
  return (<View style={[st.pill, {backgroundColor: s2.bg}]}><AppText style={{fontSize: ms(8), fontWeight: '700', color: s2.color}}>{text}</AppText></View>);
};

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
          <AppText style={{fontSize: ms(10), color: Colors.textTertiary}}>{'\u00B0'}C</AppText>
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

// ── All readings data ──
const ALL_READINGS = [
  {dateGroup: 'March 2026', items: [
    {time: '9:41', ampm: 'AM', type: 'Oral - Nothing unusual', value: '36.9', color: Colors.primary, barColor: Colors.accent, pills: [{t: 'Normal', s: 'pg'}], source: 'Manual', delta: 'Today', deltaColor: Colors.textTertiary},
    {time: '8:10', ampm: 'AM', type: 'Oral - 22 Mar', value: '37.0', color: Colors.primary, barColor: Colors.accent, pills: [{t: 'Normal', s: 'pg'}], source: 'Manual', delta: '+0.1', deltaColor: Colors.textTertiary},
    {time: '8:25', ampm: 'AM', type: 'Oral - 15 Mar - Clinic', value: '36.8', color: Colors.primary, barColor: Colors.accent, pills: [{t: 'Normal', s: 'pg'}, {t: 'Dr. Meera', s: 'pn'}], source: 'Clinic'},
    {time: '7:50', ampm: 'AM', type: 'Oral - 8 Mar', value: '36.7', color: Colors.primary, barColor: Colors.accent, pills: [{t: 'Normal', s: 'pg'}], source: 'Manual'},
    {time: '8:05', ampm: 'AM', type: 'Oral - 1 Mar', value: '36.9', color: Colors.primary, barColor: Colors.accent, pills: [{t: 'Normal', s: 'pg'}], source: 'Manual'},
  ]},
  {dateGroup: 'February 2026', items: [
    {time: '8:20', ampm: 'AM', type: 'Oral - 20 Feb', value: '36.8', color: Colors.primary, barColor: Colors.accent, pills: [{t: 'Normal', s: 'pg'}], source: 'Manual'},
    {time: '9:10', ampm: 'AM', type: 'Oral - 6 Feb', value: '37.0', color: Colors.primary, barColor: Colors.accent, pills: [{t: 'Normal', s: 'pg'}], source: 'Manual', delta: '+0.2', deltaColor: Colors.textTertiary},
  ]},
  {dateGroup: 'January 2026', items: [
    {time: '8:00', ampm: 'AM', type: 'Oral - 18 Jan', value: '36.6', color: Colors.primary, barColor: Colors.accent, pills: [{t: 'Normal', s: 'pg'}], source: 'Manual'},
    {time: '8:30', ampm: 'AM', type: 'Oral - 4 Jan - Post-URTI recovery', value: '36.9', color: Colors.primary, barColor: Colors.accent, pills: [{t: 'Back to normal', s: 'pg'}, {t: 'Recovered', s: 'pg'}], source: 'Manual', delta: 'Resolved', deltaColor: Colors.tealDark},
  ]},
  {dateGroup: 'December 2025 - URTI episode', items: [
    {time: '8:10', ampm: 'PM', type: 'Oral - 12 Dec - Resolving', value: '37.8', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Low-grade fever', s: 'pa'}], source: 'Manual', delta: 'Dropping', deltaColor: Colors.tealDark},
    {time: '6:45', ampm: 'PM', type: 'Oral - 9 Dec - URTI day 4', value: '38.1', color: Colors.red, barColor: Colors.red, pills: [{t: 'Fever', s: 'pr'}, {t: 'Took paracetamol', s: 'pn'}], source: 'Manual', delta: 'Fever', deltaColor: Colors.red},
    {time: '8:00', ampm: 'AM', type: 'Oral - 7 Dec - URTI day 2', value: '38.2', color: Colors.red, barColor: Colors.red, pills: [{t: 'Fever', s: 'pr'}, {t: 'Chills - Fatigue', s: 'pn'}], source: 'Manual', delta: '+0.2', deltaColor: Colors.red},
    {time: '7:15', ampm: 'PM', type: 'Oral - 5 Dec - URTI onset - Peak', value: '38.4', color: Colors.red, barColor: Colors.red, pills: [{t: 'Peak fever', s: 'pr'}, {t: 'Body ache - Sore throat', s: 'pn'}], source: 'Manual', delta: 'Peak', deltaColor: Colors.red},
  ]},
  {dateGroup: 'November 2025', items: [
    {time: '8:15', ampm: 'AM', type: 'Oral - 18 Nov', value: '36.8', color: Colors.primary, barColor: Colors.accent, pills: [{t: 'Normal', s: 'pg'}], source: 'Manual'},
    {time: '9:00', ampm: 'AM', type: 'Oral - 2 Nov', value: '36.9', color: Colors.primary, barColor: Colors.accent, pills: [{t: 'Normal', s: 'pg'}], source: 'Manual'},
  ]},
  {dateGroup: 'October 2025', items: [
    {time: '8:30', ampm: 'AM', type: 'Oral - 15 Oct - First reading', value: '36.8', color: Colors.primary, barColor: Colors.accent, pills: [{t: 'Normal', s: 'pg'}, {t: 'Baseline', s: 'pb'}], source: 'Manual', delta: 'Baseline', deltaColor: Colors.textTertiary},
  ]},
];

// ── Fever readings ──
const FEVER_READINGS = [
  {dateGroup: 'December 2025 - URTI - 4 readings above 37.3\u00B0C', items: [
    {time: '7:15', ampm: 'PM', type: '5 Dec - URTI onset - Peak', value: '38.4', color: Colors.red, barColor: Colors.red, pills: [{t: 'Peak fever', s: 'pr'}, {t: 'Body ache - Sore throat', s: 'pn'}], source: 'Oral', delta: 'Peak', deltaColor: Colors.red},
    {time: '8:00', ampm: 'AM', type: '7 Dec - URTI day 2', value: '38.2', color: Colors.red, barColor: Colors.red, pills: [{t: 'Fever', s: 'pr'}, {t: 'Chills - Fatigue', s: 'pn'}], source: 'Oral', delta: '-0.2', deltaColor: Colors.tealDark},
    {time: '6:45', ampm: 'PM', type: '9 Dec - URTI day 4', value: '38.1', color: Colors.red, barColor: Colors.red, pills: [{t: 'Fever', s: 'pr'}, {t: 'Took paracetamol', s: 'pn'}], source: 'Oral', delta: '-0.1', deltaColor: Colors.tealDark},
    {time: '8:10', ampm: 'PM', type: '12 Dec - Resolving', value: '37.8', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Low-grade - dropping', s: 'pa'}], source: 'Oral', delta: 'Resolving', deltaColor: Colors.tealDark},
  ]},
];

// ── Flagged readings ──
const FLAGGED_READINGS = [
  {dateGroup: '5 December 2025 - Peak fever', items: [
    {time: '7:15', ampm: 'PM', type: 'Oral - URTI onset', value: '38.4', color: Colors.red, barColor: Colors.red, pills: [{t: 'Highest recorded', s: 'pr'}], source: 'Oral', delta: 'Flag', deltaColor: Colors.red},
  ]},
  {dateGroup: '6 February 2026 - Borderline', items: [
    {time: '9:10', ampm: 'AM', type: 'Oral - High-normal', value: '37.0', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'High-normal - monitor', s: 'pa'}], source: 'Oral', delta: 'Monitor', deltaColor: Colors.amber},
  ]},
];

const TempRecordsTab = ({navigation}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const readings = activeFilter === 'fever' ? FEVER_READINGS : activeFilter === 'flagged' ? FLAGGED_READINGS : ALL_READINGS;

  return (
    <View>
      {/* Stats banner */}
      <View style={st.statsBanner}>
        <View style={{paddingHorizontal: s(16), paddingTop: vs(10), paddingBottom: vs(6)}}>
          <AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.8, marginBottom: vs(2)}}>Records - Temperature</AppText>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8)}}>
            <Icon family="Ionicons" name="thermometer-outline" size={ms(18)} color={Colors.white} />
            <AppText style={{fontSize: ms(19), fontWeight: '700', color: Colors.white}}>Temperature log</AppText>
          </View>
          <AppText style={{fontSize: ms(11), color: 'rgba(255,255,255,0.45)', marginTop: vs(1)}}>Priya Reddy - 38F - Since Oct 2025</AppText>
        </View>
        <View style={st.statsRow}>
          <View style={st.statBox}><AppText style={st.statLabel}>Latest</AppText><AppText style={st.statValue}>36.9{'\u00B0'}C</AppText><AppText style={st.statSub}>Today - Normal</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>Avg (30d)</AppText><AppText style={st.statValue}>36.8{'\u00B0'}C</AppText><AppText style={st.statSub}>Normal range</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>Fever days</AppText><AppText style={st.statValue}>4</AppText><AppText style={st.statSub}>Dec URTI</AppText></View>
          <View style={[st.statBox, {borderRightWidth: 0}]}><AppText style={st.statLabel}>Readings</AppText><AppText style={st.statValue}>42</AppText><AppText style={st.statSub}>Since Oct</AppText></View>
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
        <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'temperature', initialTab: 'tempIntel'})}>
          <View style={st.ayuIconWrap}><Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.white} /></View>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Temperature</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginTop: vs(1)}}>Fever history - Condition risk - Patterns</AppText>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>

      <View style={{paddingHorizontal: s(6)}}>
        {/* Summary cards */}
        {activeFilter === 'all' && (
          <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
            <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Latest</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.primary}}>36.9{'\u00B0'}C</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Normal</AppText></View>
            <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>30-day avg</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.primary}}>36.8{'\u00B0'}C</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Normal</AppText></View>
            <View style={[st.summaryCard, {flex: 1, backgroundColor: Colors.amberBg, borderColor: '#F5C88A'}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Peak fever</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.amber}}>38.4{'\u00B0'}C</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>5 Dec 2025</AppText></View>
          </View>
        )}

        {activeFilter === 'fever' && (
          <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
            <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Fever episodes</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.red}}>1</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Dec 2025 - URTI</AppText></View>
            <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Highest reading</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.red}}>38.4{'\u00B0'}C</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>5 Dec 2025</AppText></View>
          </View>
        )}

        {activeFilter === 'flagged' && (
          <View style={{backgroundColor: Colors.amberBg, borderRadius: ms(12), padding: ms(11), marginBottom: vs(10)}}>
            <AppText style={{fontSize: ms(10), color: Colors.amberDark, lineHeight: ms(16)}}>2 readings flagged for follow-up. No emergency readings on record.</AppText>
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

        {/* Fever resolution note */}
        {activeFilter === 'fever' && (
          <View style={{backgroundColor: Colors.tealBg, borderRadius: ms(12), padding: ms(11), marginTop: vs(4)}}>
            <AppText style={{fontSize: ms(10), color: Colors.tealText, lineHeight: ms(16)}}>Fever resolved in 7 days - consistent with URTI. FBG spiked to 148 mg/dL during this episode (fever raises glucose in T2DM - expected). Blood glucose returned to 112 mg/dL by 4 Jan.</AppText>
          </View>
        )}

        {/* 6-month trend chart (all tab only) */}
        {activeFilter === 'all' && (
          <View>
            <View style={st.secLabel}>
              <AppText style={{fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: Colors.textSecondary, marginRight: s(8)}}>6-month avg trend</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            <View style={[st.summaryCard, {padding: ms(13), alignItems: 'stretch'}]}>
              <View style={{flexDirection: 'row', gap: s(5), height: vs(70), position: 'relative'}}>
                <View style={{position: 'absolute', bottom: '46%', left: 0, right: 0, borderTopWidth: 1.5, borderStyle: 'dashed', borderTopColor: 'rgba(29,158,117,0.4)'}} />
                <BarCol topLabel="36.8" topColor={Colors.accent} height={vs(32)} barColor={Colors.accent} bottomLabel="Oct" />
                <BarCol topLabel="36.9" topColor={Colors.accent} height={vs(36)} barColor={Colors.accent} bottomLabel="Nov" />
                <BarCol topLabel="37.5" topColor={Colors.red} height={vs(64)} barColor={Colors.red} bottomLabel="Dec" />
                <BarCol topLabel="36.8" topColor={Colors.accent} height={vs(32)} barColor={Colors.accent} bottomLabel="Jan" />
                <BarCol topLabel="36.9" topColor={Colors.accent} height={vs(36)} barColor={Colors.accent} bottomLabel="Feb" />
                <BarCol topLabel="36.8" topColor={Colors.accent} height={vs(32)} barColor={Colors.accent} bottomLabel="Mar" bold />
              </View>
              <AppText style={{fontSize: ms(9), color: Colors.textTertiary, textAlign: 'center', marginTop: vs(6)}}>Dec spike = URTI episode - Normal range {'\u2265'}36.1 - Dashed line</AppText>
            </View>
          </View>
        )}

        <TouchableOpacity style={{alignItems: 'center', paddingVertical: vs(12)}}>
          <AppText variant="caption" color={Colors.textSecondary}>Load all readings</AppText>
        </TouchableOpacity>
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
  filterPill: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(18), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.white},
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

export default TempRecordsTab;
