import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

const FILTERS = [
  {key: 'all', label: 'All'},
  {key: 'knee', label: 'Knee'},
  {key: 'back', label: 'Back'},
  {key: 'severe', label: 'Severe (7+)'},
  {key: 'free', label: 'Pain-free'},
];

const ALL_ENTRIES = [
  {region: 'Left knee', date: '28 Mar 2026', meta: 'Swelling + clicking \u00b7 Woke with pain \u00b7 Gradual onset 1 week', chips: ['Sharp + stiff', 'On movement', 'Night pain', {l: 'Red flag', warn: true}], pain: 5, color: '#F97316'},
  {region: 'Lower back', date: '25 Mar 2026', meta: 'Desk work trigger \u00b7 Prolonged sitting \u00b7 Tight and stiff', chips: ['Dull aching', 'Stiffness', 'After sitting'], pain: 4, color: '#F97316'},
  {region: 'Left knee', date: '20 Mar 2026', meta: 'Walk on uneven ground trigger \u00b7 Swelling increased by evening', chips: ['Sharp', 'Weight-bearing', 'Swelling', 'Clicking'], pain: 7, color: '#E24B4A'},
  {region: 'Left knee', date: '15 Mar 2026', meta: 'After morning walk \u00b7 Stiffness eased after 30 mins', chips: ['Stiffness', 'Morning onset', {l: 'Ice helped', good: true}], pain: 4, color: '#F0B429'},
  {region: 'Right shoulder', date: '8 Mar 2026', meta: 'After overhead work \u00b7 Mild ache \u00b7 Resolved same day', chips: ['Dull aching', {l: 'Rest resolved it', good: true}], pain: 3, color: '#84CC16'},
];

const KNEE_ENTRIES = [
  {title: '28 Mar \u00b7 Day 1 this week', meta: 'Swelling + clicking + night pain', pain: 5, color: '#F97316'},
  {title: '20 Mar \u00b7 Walk trigger', meta: 'Swelling worse by evening \u00b7 clicking', pain: 7, color: '#E24B4A'},
  {title: '15 Mar \u00b7 Morning walk', meta: 'Stiffness, eased with movement', pain: 4, color: '#F0B429'},
];

const BACK_ENTRIES = [
  {title: '25 Mar \u00b7 Desk work', meta: 'Prolonged sitting trigger \u00b7 Dull aching + stiffness', pain: 4, color: '#F97316'},
  {title: '12 Mar \u00b7 After cooking', meta: 'Prolonged standing trigger', pain: 3, color: '#F0B429'},
];

const SEVERE_ENTRIES = [
  {title: '20 Mar \u00b7 Left knee \u00b7 Uneven ground walk', meta: 'Swelling + clicking + night pain', chips: [{l: 'Highest entry this month', warn: true}], pain: 7, color: '#E24B4A'},
];

// Heatmap data (deterministic, matching HTML exactly)
const KNEE_HEAT = [null, null, '#84CC16', '#F0B429', null, null, '#F0B429', '#F97316', '#E24B4A', '#E24B4A', '#F97316', '#F97316', null, null, '#F0B429', null, null, null, '#F0B429', '#F97316', null, null, null, '#F0B429', null, null, '#F0B429', '#F97316'];
const BACK_HEAT = [null, '#84CC16', null, '#F0B429', null, null, null, '#F0B429', '#F0B429', null, null, '#F97316', '#F97316', null, null, null, '#84CC16', null, null, '#F0B429', null, null, null, '#F0B429', '#F0B429', null, null, '#F97316'];
const OTHER_HEAT = [null, null, null, null, '#84CC16', null, null, null, null, '#F0B429', null, null, null, null, null, null, null, null, null, null, '#84CC16', null, null, null, null, null, null, null];

const Section = ({title}) => (
  <View style={st.sec}><AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{title}</AppText><View style={st.secLine} /></View>
);

const EntryRow = ({entry}) => (
  <View style={st.rrow}>
    <View style={{alignItems: 'center', gap: vs(3)}}>
      <Icon family="Ionicons" name="body-outline" size={ms(20)} color={Colors.textSecondary} />
      <View style={{width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: entry.color}} />
    </View>
    <View style={{flex: 1}}>
      <AppText variant="bodyBold" color={Colors.textPrimary}>{entry.region} {'\u00b7'} {entry.date}</AppText>
      <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{entry.meta}</AppText>
      {entry.chips && (
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(4), marginTop: vs(6)}}>
          {entry.chips.map((ch, i) => {
            const isObj = typeof ch === 'object';
            const label = isObj ? ch.l : ch;
            const bg = isObj && ch.warn ? '#FEF0F0' : isObj && ch.good ? '#F0FDF4' : '#F0EDE8';
            const c = isObj && ch.warn ? '#7F1D1D' : isObj && ch.good ? '#14532D' : '#444';
            return <View key={i} style={[st.chip, {backgroundColor: bg}]}><AppText variant="subtext" color={c} style={{fontWeight: '600'}}>{label}</AppText></View>;
          })}
        </View>
      )}
    </View>
    <View style={{alignItems: 'flex-end'}}>
      <AppText variant="header" color={entry.color} style={{fontWeight: '800', fontSize: ms(20)}}>{entry.pain}</AppText>
      <AppText variant="subtext" color={Colors.textSecondary}>/10</AppText>
    </View>
  </View>
);

const CompactRow = ({entry}) => (
  <View style={st.rrow}>
    <View style={{alignItems: 'center', gap: vs(3)}}>
      <Icon family="Ionicons" name="body-outline" size={ms(20)} color={Colors.textSecondary} />
      <View style={{width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: entry.color}} />
    </View>
    <View style={{flex: 1}}>
      <AppText variant="bodyBold" color={Colors.textPrimary}>{entry.title}</AppText>
      <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{entry.meta}</AppText>
      {entry.chips && (
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(4), marginTop: vs(6)}}>
          {entry.chips.map((ch, i) => {
            const isObj = typeof ch === 'object';
            const label = isObj ? ch.l : ch;
            const bg = isObj && ch.warn ? '#FEF0F0' : isObj && ch.good ? '#F0FDF4' : '#F0EDE8';
            const c = isObj && ch.warn ? '#7F1D1D' : isObj && ch.good ? '#14532D' : '#444';
            return <View key={i} style={[st.chip, {backgroundColor: bg}]}><AppText variant="subtext" color={c} style={{fontWeight: '600'}}>{label}</AppText></View>;
          })}
        </View>
      )}
    </View>
    <View style={{alignItems: 'flex-end'}}>
      <AppText variant="header" color={entry.color} style={{fontWeight: '800', fontSize: ms(20)}}>{entry.pain}</AppText>
      <AppText variant="subtext" color={Colors.textSecondary}>/10</AppText>
    </View>
  </View>
);

const HeatmapRow = ({label, data}) => (
  <View style={{flexDirection: 'row', alignItems: 'center', gap: s(3), marginBottom: vs(3)}}>
    <AppText variant="subtext" color={Colors.textSecondary} style={{width: ms(30), textAlign: 'right', fontWeight: '600', fontSize: ms(8)}}>{label}</AppText>
    <View style={{flexDirection: 'row', gap: ms(3), flex: 1}}>
      {data.map((c, i) => (
        <View key={i} style={{width: ms(11), height: ms(11), borderRadius: ms(3), backgroundColor: c || '#E5DDD3'}} />
      ))}
    </View>
  </View>
);

const MSKRecordsTab = ({navigation}) => {
  const [filter, setFilter] = useState('all');

  return (
    <View>
      {/* Stats banner */}
      <View style={st.statsBanner}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(10)}}>
          <View style={st.statsIcon}><Icon family="Ionicons" name="body-outline" size={ms(22)} color={Colors.white} /></View>
          <View>
            <AppText variant="bodyBold" color={Colors.white}>Pain history</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">Priya {'\u00b7'} March 2026</AppText>
          </View>
        </View>
        <View style={st.statsGrid}>
          {[
            {l: 'Most affected', v: 'Left knee', s2: '8 entries'},
            {l: 'Avg pain', v: '5.2', s2: '/ 10 \u00b7 30 days', c: '#F0B429'},
            {l: 'Pain-free days', v: '12', s2: 'this month', c: Colors.paleGreen},
            {l: 'Trend', v: '\u2191', s2: 'Worsening', c: '#F97316'},
          ].map((item, i) => (
            <View key={i} style={st.statCell}>
              <AppText variant="subtext" color="rgba(255,255,255,0.4)" style={{textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(2), fontSize: ms(7)}}>{item.l}</AppText>
              <AppText variant="bodyBold" color={item.c || Colors.white} style={{fontWeight: '800', fontSize: ms(13), lineHeight: ms(16)}}>{item.v}</AppText>
              <AppText variant="subtext" color="rgba(255,255,255,0.45)" style={{marginTop: vs(1)}}>{item.s2}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Ayu Intel button */}
      <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'msk', initialTab: 'mskIntel'})}>
        <View style={st.ayuIcon}><Icon family="Ionicons" name="bulb-outline" size={ms(16)} color={Colors.white} /></View>
        <View style={{flex: 1}}>
          <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel {'\u00b7'} Joint & Muscle</AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.7)">OA risk {'\u00b7'} Pain patterns {'\u00b7'} Care plan</AppText>
        </View>
        <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      {/* Filter pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: vs(10)}} contentContainerStyle={{gap: s(5)}}>
        {FILTERS.map(f => {
          const on = filter === f.key;
          return (
            <TouchableOpacity key={f.key} style={[st.pill, on && st.pillOn]} onPress={() => setFilter(f.key)} activeOpacity={0.7}>
              <AppText variant="small" color={on ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{f.label}</AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Pain heatmap */}
      <Section title="Pain heatmap \u00b7 March 2026" />
      <View style={st.heatCard}>
        <HeatmapRow label="Knee" data={KNEE_HEAT} />
        <HeatmapRow label="Back" data={BACK_HEAT} />
        <HeatmapRow label="Other" data={OTHER_HEAT} />
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginTop: vs(8)}}>
          <AppText variant="subtext" color={Colors.textTertiary}>No pain</AppText>
          <View style={{flex: 1, height: ms(7), borderRadius: ms(3), overflow: 'hidden', flexDirection: 'row'}}>
            <View style={{flex: 1, backgroundColor: '#E5DDD3'}} />
            <View style={{flex: 1, backgroundColor: '#84CC16'}} />
            <View style={{flex: 1, backgroundColor: '#F0B429'}} />
            <View style={{flex: 1, backgroundColor: '#F97316'}} />
            <View style={{flex: 1, backgroundColor: '#E24B4A'}} />
          </View>
          <AppText variant="subtext" color={Colors.textTertiary}>Severe</AppText>
        </View>
      </View>

      {/* Entries based on filter */}
      {filter === 'all' && (
        <>
          <Section title="All entries \u00b7 March 2026" />
          {ALL_ENTRIES.map((e, i) => <EntryRow key={i} entry={e} />)}
        </>
      )}

      {filter === 'knee' && (
        <>
          <Section title="Left knee entries" />
          <View style={[st.alertBox, {backgroundColor: '#EFF6FF', borderColor: '#93C5FD'}]}>
            <AppText variant="small" color="#1E3A5F" style={{lineHeight: ms(17)}}>
              <AppText style={{fontWeight: '700'}}>Pattern:</AppText> Left knee pain worsening over 3 weeks. Triggered by uneven ground and prolonged standing. Swelling + clicking = clinical red flag warranting assessment.
            </AppText>
          </View>
          {KNEE_ENTRIES.map((e, i) => <CompactRow key={i} entry={e} />)}
        </>
      )}

      {filter === 'back' && (
        <>
          <Section title="Lower back entries" />
          {BACK_ENTRIES.map((e, i) => <CompactRow key={i} entry={e} />)}
        </>
      )}

      {filter === 'severe' && (
        <>
          <Section title="Severe pain entries (7-10)" />
          {SEVERE_ENTRIES.map((e, i) => <CompactRow key={i} entry={e} />)}
        </>
      )}

      {filter === 'free' && (
        <>
          <Section title="Pain-free days this month \u00b7 12" />
          <View style={[st.alertBox, {backgroundColor: '#ECFDF5', borderColor: '#6EE7B7'}]}>
            <AppText variant="small" color="#064E3B" style={{lineHeight: ms(17)}}>
              Pain-free days occur on days without prolonged standing or uneven terrain. Rest days after activity consistently prevent the next-day flare. This pattern supports a mechanical (non-inflammatory) cause.
            </AppText>
          </View>
        </>
      )}
    </View>
  );
};

const st = StyleSheet.create({
  statsBanner: {backgroundColor: Colors.primary, borderRadius: ms(16), padding: ms(14), marginBottom: vs(10)},
  statsIcon: {width: ms(44), height: ms(44), borderRadius: ms(12), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  statsGrid: {flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: ms(12), overflow: 'hidden', gap: 1},
  statCell: {flex: 1, padding: ms(9), backgroundColor: 'rgba(0,0,0,0.2)'},
  ayuBtn: {flexDirection: 'row', alignItems: 'center', gap: s(8), backgroundColor: Colors.accent, borderRadius: ms(12), padding: ms(12), marginBottom: vs(10)},
  ayuIcon: {width: ms(34), height: ms(34), borderRadius: ms(9), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  pill: {paddingHorizontal: s(12), paddingVertical: vs(7), borderRadius: ms(20), backgroundColor: Colors.white, borderWidth: 1, borderColor: '#dde8e2'},
  pillOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(12), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},
  heatCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12), marginBottom: vs(10)},
  rrow: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12), marginBottom: vs(7), flexDirection: 'row', alignItems: 'flex-start', gap: s(11)},
  chip: {paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(8)},
  alertBox: {borderRadius: ms(12), borderWidth: 0.5, padding: ms(11), marginBottom: vs(10)},
});

export default MSKRecordsTab;
