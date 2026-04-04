import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

const FILTERS = [
  {key: 'all', label: 'All (31)', icon: 'grid-outline'},
  {key: 'morning', label: 'Morning (18)', icon: 'sunny-outline'},
  {key: 'evening', label: 'Evening (13)', icon: 'moon-outline'},
  {key: 'flagged', label: 'Flagged (6)', icon: 'warning-outline'},
];

const READINGS = [
  {
    dateGroup: '28 March 2026 - Saturday',
    items: [
      {time: '8:04', ampm: 'AM', type: 'Morning - Sitting - Left arm', sys: '128', dia: '80', color: Colors.tealDark, barColor: Colors.accent, pill: 'At target', pillStyle: 'pg', source: 'Omron sync', pulse: '72 bpm', cat: 'morning'},
      {time: '8:32', ampm: 'PM', type: 'Evening - Sitting - Left arm', sys: '134', dia: '84', color: Colors.amber, barColor: Colors.amber, pill: 'Slightly above', pillStyle: 'pa', source: 'Manual', pulse: '76 bpm', cat: 'evening'},
    ],
  },
  {
    dateGroup: '27 March 2026 - Friday',
    items: [
      {time: '7:58', ampm: 'AM', type: 'Morning - Sitting - Left arm', sys: '126', dia: '79', color: Colors.tealDark, barColor: Colors.accent, pill: 'At target', pillStyle: 'pg', source: 'Omron sync', pulse: '70 bpm', cat: 'morning'},
    ],
  },
  {
    dateGroup: '25 March 2026 - Wednesday',
    items: [
      {time: '9:12', ampm: 'AM', type: 'Morning - Sitting - Left arm', sys: '148', dia: '92', color: Colors.red, barColor: Colors.red, pill: 'High', pillStyle: 'pr', pill2: 'Stressed - No walk', pill2Style: 'pn', source: 'Manual', pulse: '82 bpm', flagged: true, cat: 'morning'},
    ],
  },
  {
    dateGroup: '20 March 2026 - Friday',
    items: [
      {time: '8:01', ampm: 'AM', type: 'Morning - Sitting - Left arm', sys: '124', dia: '78', color: Colors.tealDark, barColor: Colors.accent, pill: 'At target', pillStyle: 'pg', source: 'Omron sync', pulse: '68 bpm', cat: 'morning'},
    ],
  },
  {
    dateGroup: '15 March 2026 - Sunday',
    items: [
      {time: '9:44', ampm: 'AM', type: 'Morning - Sitting - Left arm', sys: '138', dia: '88', color: Colors.amber, barColor: Colors.amber, pill: 'Above target', pillStyle: 'pa', source: 'Manual', pulse: '78 bpm', cat: 'morning'},
    ],
  },
];

const PILL_STYLES = {
  pg: {bg: Colors.tealBg, color: Colors.tealText},
  pa: {bg: Colors.amberBg, color: Colors.amberDark},
  pr: {bg: Colors.redBg, color: Colors.redDark},
  pn: {bg: '#f0f0f0', color: '#555'},
};

const Pill = ({text, style: pillStyle}) => {
  const ps = PILL_STYLES[pillStyle] || PILL_STYLES.pa;
  return (
    <View style={[st.pill, {backgroundColor: ps.bg}]}>
      <AppText style={{fontSize: ms(9), fontWeight: '700', color: ps.color}}>{text}</AppText>
    </View>
  );
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
        <AppText style={{fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(3)}}>{item.type}</AppText>
        <View style={{flexDirection: 'row', alignItems: 'baseline', gap: s(2)}}>
          <AppText style={{fontSize: ms(22), fontWeight: '800', color: item.color, lineHeight: ms(24)}}>{item.sys}</AppText>
          <AppText style={{fontSize: ms(16), fontWeight: '300', color: '#bbb'}}>/</AppText>
          <AppText style={{fontSize: ms(16), fontWeight: '700', color: item.color}}>{item.dia}</AppText>
          <AppText style={{fontSize: ms(10), color: Colors.textTertiary, marginLeft: s(3)}}>mmHg</AppText>
        </View>
        <View style={{flexDirection: 'row', gap: s(5), marginTop: vs(3), flexWrap: 'wrap'}}>
          <Pill text={item.pill} style={item.pillStyle} />
          {item.pill2 && <Pill text={item.pill2} style={item.pill2Style} />}
        </View>
      </View>
      <View style={{alignItems: 'flex-end', flexShrink: 0}}>
        <AppText style={{fontSize: ms(8), color: '#bbb', marginBottom: vs(4)}}>{item.source}</AppText>
        <AppText style={{fontSize: ms(10), fontWeight: '600', color: Colors.textSecondary}}>{item.pulse}</AppText>
      </View>
    </View>
  </View>
);

const BPRecordsTab = ({navigation}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const getFiltered = () => {
    if (activeFilter === 'all') return READINGS;
    return READINGS.map(group => ({
      ...group,
      items: group.items.filter(item => {
        if (activeFilter === 'flagged') return item.flagged;
        return item.cat === activeFilter;
      }),
    })).filter(group => group.items.length > 0);
  };

  const filtered = getFiltered();

  return (
    <View>
      {/* Stats banner */}
      <View style={st.statsBanner}>
        <View style={{paddingHorizontal: s(16), paddingTop: vs(10), paddingBottom: vs(6)}}>
          <AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.8, marginBottom: vs(2)}}>Records - Blood pressure</AppText>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8)}}>
            <Icon family="Ionicons" name="heart" size={ms(18)} color={Colors.white} />
            <AppText style={{fontSize: ms(19), fontWeight: '700', color: Colors.white}}>Blood Pressure</AppText>
            <View style={[st.pill, {backgroundColor: Colors.amberBg}]}>
              <AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.amberDark}}>Above target</AppText>
            </View>
          </View>
          <AppText style={{fontSize: ms(11), color: 'rgba(255,255,255,0.45)', marginTop: vs(1)}}>Priya Reddy - HTN + T2DM - 31 readings - March 2026</AppText>
        </View>
        <View style={st.statsRow}>
          <View style={st.statBox}><AppText style={st.statLabel}>Avg Systolic</AppText><AppText style={st.statValue}>136</AppText><AppText style={st.statSub}>mmHg</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>Avg Diastolic</AppText><AppText style={st.statValue}>86</AppText><AppText style={st.statSub}>mmHg</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>Avg Pulse</AppText><AppText style={st.statValue}>74</AppText><AppText style={st.statSub}>bpm</AppText></View>
          <View style={[st.statBox, {borderRightWidth: 0}]}><AppText style={st.statLabel}>Readings</AppText><AppText style={st.statValue}>31</AppText><AppText style={st.statSub}>this month</AppText></View>
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
        <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'bp', initialTab: 'bpIntel'})}>
          <View style={st.ayuIconWrap}>
            <Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.white} />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Blood Pressure</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginTop: vs(1)}}>Patterns - Activity impact - Recommendations</AppText>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>

      {/* Reading groups */}
      <View style={{paddingHorizontal: s(6)}}>
        {filtered.map((group, gi) => (
          <View key={gi}>
            <View style={st.dateGroup}>
              <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginRight: s(8)}}>{group.dateGroup}</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            {group.items.map((item, ri) => (
              <ReadingRow key={ri} item={item} />
            ))}
          </View>
        ))}
        <TouchableOpacity style={{alignItems: 'center', paddingVertical: vs(12)}}>
          <AppText variant="caption" color={Colors.textSecondary}>Load all 31 readings</AppText>
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
  dateGroup: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)},
  pill: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(10)},
  readingRow: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#dde8e2', marginBottom: vs(7), overflow: 'hidden', flexDirection: 'row', alignItems: 'stretch'},
  rrLeft: {width: ms(4)},
  rrBody: {flex: 1, flexDirection: 'row', alignItems: 'center', padding: ms(9), gap: s(10)},
  rrTimeCol: {alignItems: 'center', minWidth: s(38)},
  rrDiv: {width: 0.5, backgroundColor: '#f0f4f2', alignSelf: 'stretch'},
});

export default BPRecordsTab;
