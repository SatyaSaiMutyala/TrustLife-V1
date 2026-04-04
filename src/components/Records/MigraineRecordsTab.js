import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

const FILTERS = [{key: 'all', label: 'All'}, {key: 'severe', label: 'Severe (7+)'}, {key: 'meds', label: 'Medications'}];
const PILL_STYLES = {pg: {bg: Colors.tealBg, color: Colors.tealText}, pa: {bg: Colors.amberBg, color: Colors.amberDark}, pr: {bg: Colors.redBg, color: Colors.redDark}, pp: {bg: Colors.tealBg, color: Colors.primaryText}, pn: {bg: '#f0f0f0', color: '#555'}};
const Pill = ({text, style: ps}) => { const s2 = PILL_STYLES[ps] || PILL_STYLES.pn; return (<View style={[st.pill, {backgroundColor: s2.bg}]}><AppText style={{fontSize: ms(8), fontWeight: '700', color: s2.color}}>{text}</AppText></View>); };

const ReadingRow = ({item}) => (
  <View style={st.readingRow}>
    <View style={[st.rrLeft, {backgroundColor: item.barColor}]} />
    <View style={st.rrBody}>
      <View style={[st.rrTimeCol, {minWidth: s(44)}]}>
        <AppText style={{fontSize: ms(10), fontWeight: '700', color: Colors.textPrimary}}>{item.date}</AppText>
      </View>
      <View style={st.rrDiv} />
      <View style={{flex: 1, paddingLeft: s(10)}}>
        <AppText style={{fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(2)}}>{item.type}</AppText>
        <View style={{flexDirection: 'row', alignItems: 'baseline', gap: s(4)}}>
          <AppText style={{fontSize: ms(22), fontWeight: '800', color: item.color, lineHeight: ms(24)}}>{item.value}</AppText>
          <AppText style={{fontSize: ms(10), color: Colors.textTertiary}}>{item.unit}</AppText>
        </View>
        {item.duration && <AppText style={{fontSize: ms(10), color: Colors.textSecondary, fontWeight: '600', marginTop: vs(4)}}>{item.duration}</AppText>}
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
    {date: '28 Mar', type: 'Left side - Stress - poor sleep', value: '7', unit: '/10', color: '#c0392b', barColor: '#c0392b', duration: '9:41 AM \u2013 Ongoing', pills: [{t: 'Stress - poor sleep', s: 'pr'}, {t: 'Sumatriptan', s: 'pa'}, {t: 'Bed rest', s: 'pr'}], source: 'Manual', delta: 'Today', deltaColor: Colors.red},
    {date: '25 Mar', type: 'Right side - Visual aura - Nausea', value: '8', unit: '/10', color: '#c0392b', barColor: '#c0392b', duration: '2:15 PM \u2013 5:50 PM - 3h 35m', pills: [{t: 'Visual aura - Nausea', s: 'pr'}, {t: 'Sumatriptan', s: 'pa'}], source: 'Cefaly', delta: 'Severe', deltaColor: Colors.red},
    {date: '18 Mar', type: 'Both sides - Menstrual', value: '7', unit: '/10', color: Colors.amber, barColor: Colors.amber, duration: '6:20 AM \u2013 7:10 PM - 12h 50m', pills: [{t: 'Hormonal trigger', s: 'pa'}, {t: 'Paracetamol', s: 'pn'}], source: 'Manual'},
    {date: '6 Mar', type: 'Left side - Skipped meal', value: '6', unit: '/10', color: Colors.amber, barColor: Colors.amber, duration: '11:45 AM \u2013 4:30 PM - 4h 45m', pills: [{t: 'Dehydration - Hunger', s: 'pa'}, {t: 'Ibuprofen', s: 'pn'}, {t: 'Limited work', s: 'pg'}], source: 'Manual', delta: 'Mild', deltaColor: Colors.textTertiary},
  ]},
  {dateGroup: 'February 2026', items: [
    {date: '22 Feb', type: 'Right side - Stress - Aura', value: '9', unit: '/10', color: '#c0392b', barColor: '#c0392b', duration: '5:30 AM \u2013 3:00 PM - 9h 30m', pills: [{t: 'Visual aura - Vomiting', s: 'pr'}, {t: 'Sumatriptan', s: 'pa'}, {t: 'Bed rest', s: 'pr'}], source: 'Manual', delta: 'Worst Feb', deltaColor: Colors.red},
    {date: '10 Feb', type: 'Both sides - Menstrual', value: '7', unit: '/10', color: Colors.amber, barColor: Colors.amber, duration: '7:00 AM \u2013 8:15 PM - 13h 15m', pills: [{t: 'Hormonal - 13h duration', s: 'pa'}, {t: 'Paracetamol', s: 'pn'}], source: 'Manual'},
    {date: '2 Feb', type: 'Left side - Screen glare', value: '5', unit: '/10', color: Colors.amber, barColor: Colors.amber, duration: '2:00 PM \u2013 6:45 PM - 4h 45m', pills: [{t: 'Light trigger', s: 'pa'}, {t: 'Ibuprofen', s: 'pn'}, {t: 'Able to work', s: 'pg'}], source: 'Manual', delta: 'Mild', deltaColor: Colors.textTertiary},
  ]},
  {dateGroup: 'January 2026', items: [
    {date: '20 Jan', type: 'Menstrual - Both sides', value: '7', unit: '/10', color: Colors.amber, barColor: Colors.amber, duration: '3:00 AM \u2013 5:30 AM - 26h 30m', pills: [{t: 'Hormonal', s: 'pa'}, {t: 'Sumatriptan + Paracetamol', s: 'pn'}], source: 'Manual'},
    {date: '5 Jan', type: 'Left - Stress - Back to work', value: '6', unit: '/10', color: Colors.amber, barColor: Colors.amber, duration: '8:30 AM \u2013 2:00 PM - 5h 30m', pills: [{t: 'Stress', s: 'pa'}, {t: 'Ibuprofen', s: 'pn'}], source: 'Manual'},
  ]},
];

const SEVERE_READINGS = [
  {dateGroup: 'Severe attacks - Pain \u22657/10', items: [
    {date: '25 Mar', type: 'Visual aura - Nausea - Right side', value: '8', unit: '/10', color: '#c0392b', barColor: '#c0392b', duration: '2:15 PM \u2013 5:50 PM - 3h 35m', pills: [{t: 'Worst this month', s: 'pr'}, {t: 'Sumatriptan 50mg', s: 'pa'}], source: 'Cefaly', delta: 'Severe', deltaColor: Colors.red},
    {date: '28 Mar', type: 'Stress - Left - Today', value: '7', unit: '/10', color: '#c0392b', barColor: '#c0392b', duration: '9:41 AM \u2013 Ongoing', pills: [{t: 'Active', s: 'pr'}, {t: 'Sumatriptan', s: 'pa'}], source: 'Manual', delta: 'Now', deltaColor: Colors.red},
    {date: '18 Mar', type: 'Menstrual - Both sides', value: '7', unit: '/10', color: Colors.amber, barColor: Colors.amber, duration: '6:20 AM \u2013 7:10 PM - 12h 50m', pills: [{t: 'Hormonal', s: 'pa'}, {t: 'Paracetamol', s: 'pn'}], source: 'Manual'},
  ]},
];

const MED_READINGS = [
  {dateGroup: 'Medication use - March 2026', items: [
    {date: '28 Mar', type: 'Pain 7/10 - Left - Stress', value: 'Sumatriptan', unit: '', color: Colors.primary, barColor: Colors.primary, pills: [{t: '50 mg triptan', s: 'pp'}, {t: 'Taken at onset', s: 'pn'}], source: 'Rescue', delta: 'Day 8', deltaColor: Colors.textTertiary},
    {date: '25 Mar', type: 'Pain 8/10 - Right - Aura', value: 'Sumatriptan', unit: '', color: Colors.primary, barColor: Colors.primary, pills: [{t: '50 mg triptan', s: 'pp'}, {t: 'Cefaly also used', s: 'pg'}], source: 'Rescue', delta: 'Day 7', deltaColor: Colors.textTertiary},
    {date: '18 Mar', type: 'Pain 7/10 - Hormonal', value: 'Paracetamol', unit: '', color: Colors.amber, barColor: Colors.amber, pills: [{t: '1000 mg OTC', s: 'pa'}], source: 'OTC', delta: 'Day 5', deltaColor: Colors.textTertiary},
    {date: '6 Mar', type: 'Pain 6/10 - Meal skip', value: 'Ibuprofen', unit: '', color: Colors.textSecondary, barColor: Colors.textSecondary, pills: [{t: '400 mg OTC', s: 'pn'}], source: 'OTC', delta: 'Day 2', deltaColor: Colors.textTertiary},
  ]},
];

const MigraineRecordsTab = ({navigation}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const readings = activeFilter === 'severe' ? SEVERE_READINGS : activeFilter === 'meds' ? MED_READINGS : ALL_READINGS;

  return (
    <View>
      <View style={st.statsBanner}>
        <View style={{paddingHorizontal: s(16), paddingTop: vs(10), paddingBottom: vs(6)}}>
          <AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.8, marginBottom: vs(2)}}>Records - Migraine</AppText>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8)}}>
            <Icon family="Ionicons" name="flash-outline" size={ms(18)} color={Colors.white} />
            <AppText style={{fontSize: ms(19), fontWeight: '700', color: Colors.white}}>Migraine diary</AppText>
            <View style={[st.pill, {backgroundColor: Colors.amberBg}]}><AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.amberDark}}>4 this month</AppText></View>
          </View>
          <AppText style={{fontSize: ms(11), color: 'rgba(255,255,255,0.4)', marginTop: vs(1)}}>Priya Reddy - Since Jan 2026 - Episodic migraine</AppText>
        </View>
        <View style={st.statsRow}>
          <View style={st.statBox}><AppText style={st.statLabel}>This month</AppText><AppText style={st.statValue}>4</AppText><AppText style={st.statSub}>migraines</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>Avg pain</AppText><AppText style={st.statValue}>7.2/10</AppText><AppText style={st.statSub}>severity</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>Days lost</AppText><AppText style={st.statValue}>6</AppText><AppText style={st.statSub}>Mar 2026</AppText></View>
          <View style={[st.statBox, {borderRightWidth: 0}]}><AppText style={st.statLabel}>Rescue</AppText><AppText style={st.statValue}>8 days</AppText><AppText style={st.statSub}>this month</AppText></View>
        </View>
      </View>

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

      <View style={{paddingHorizontal: s(6), marginBottom: vs(12)}}>
        <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'migraine', initialTab: 'migraineIntel'})}>
          <View style={st.ayuIconWrap}><Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.white} /></View>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Migraine</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginTop: vs(1)}}>Trigger patterns - Control - Condition impact</AppText>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>

      <View style={{paddingHorizontal: s(6)}}>
        {activeFilter === 'all' && (
          <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
            <View style={[st.summaryCard, {flex: 1, backgroundColor: Colors.redBg, borderColor: '#FBBCBC'}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>This month</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.red}}>4</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>migraines</AppText></View>
            <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Avg pain</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.amber}}>7.2</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>/10</AppText></View>
            <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Goal</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.primary}}>{'<'}4/mo</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>episodic</AppText></View>
          </View>
        )}
        {activeFilter === 'severe' && (
          <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
            <View style={[st.summaryCard, {flex: 1, backgroundColor: Colors.redBg, borderColor: '#FBBCBC'}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Severe migraines</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.red}}>3</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>pain {'\u2265'}7 - this month</AppText></View>
            <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Days bed rest</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.red}}>4</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>this month</AppText></View>
          </View>
        )}
        {activeFilter === 'meds' && (
          <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
            <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Rescue days</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.amber}}>8</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>this month</AppText></View>
            <View style={[st.summaryCard, {flex: 1, backgroundColor: Colors.redBg, borderColor: '#FBBCBC'}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>MOH risk</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.red}}>8</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>limit: {'\u2264'}10/mo</AppText></View>
            <View style={[st.summaryCard, {flex: 1, backgroundColor: Colors.tealBg, borderColor: '#9FE1CB'}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Preventer</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.primary}}>78%</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Topiramate</AppText></View>
          </View>
        )}

        {readings.map((group, gi) => (
          <View key={gi}>
            <View style={st.dateGroup}>
              <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginRight: s(8)}}>{group.dateGroup}</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            {group.items.map((item, ri) => <ReadingRow key={ri} item={item} />)}
          </View>
        ))}

        {activeFilter === 'meds' && (
          <View style={{backgroundColor: Colors.amberBg, borderRadius: ms(12), padding: ms(11), marginTop: vs(4)}}>
            <AppText style={{fontSize: ms(10), color: Colors.amberDark, lineHeight: ms(16)}}>8 rescue medication days this month - approaching the 10-day limit for medication overuse headache (MOH) risk. Ayu has flagged this for Dr. Kavitha.</AppText>
          </View>
        )}

        {activeFilter === 'all' && (
          <View>
            <View style={st.secLabel}>
              <AppText style={{fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: Colors.textSecondary, marginRight: s(8)}}>Monthly frequency</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            <View style={[st.summaryCard, {padding: ms(13), alignItems: 'stretch'}]}>
              <View style={{flexDirection: 'row', gap: s(5), height: vs(70), position: 'relative'}}>
                <View style={{position: 'absolute', bottom: '57%', left: 0, right: 0, borderTopWidth: 1.5, borderStyle: 'dashed', borderTopColor: 'rgba(91,33,182,0.4)'}} />
                <BarCol topLabel="3" topColor={Colors.amber} height={vs(30)} barColor={Colors.amber} bottomLabel="Jan" />
                <BarCol topLabel="3" topColor={Colors.amber} height={vs(30)} barColor={Colors.amber} bottomLabel="Feb" />
                <BarCol topLabel="4" topColor={Colors.red} height={vs(40)} barColor={Colors.red} bottomLabel="Mar" bold />
              </View>
              <AppText style={{fontSize: ms(9), color: Colors.textTertiary, textAlign: 'center', marginTop: vs(6)}}>Dashed = episodic threshold (4/month) - Chronic = {'\u2265'}15/month</AppText>
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
  statLabel: {fontSize: ms(8), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, color: 'rgba(255,255,255,0.35)', marginBottom: vs(2)},
  statValue: {fontSize: ms(15), fontWeight: '700', color: Colors.white},
  statSub: {fontSize: ms(8), color: 'rgba(255,255,255,0.35)', marginTop: vs(1)},
  filterPill: {paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(18), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.white},
  filterPillActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  ayuBtn: {flexDirection: 'row', alignItems: 'center', gap: s(8), backgroundColor: '#1D9E75', borderRadius: ms(12), padding: ms(12)},
  ayuIconWrap: {width: ms(36), height: ms(36), borderRadius: ms(10), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  summaryCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(10), alignItems: 'center'},
  dateGroup: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)},
  secLabel: {flexDirection: 'row', alignItems: 'center', marginTop: vs(16), marginBottom: vs(8)},
  pill: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(10)},
  readingRow: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#dde8e2', marginBottom: vs(7), overflow: 'hidden', flexDirection: 'row', alignItems: 'stretch'},
  rrLeft: {width: ms(4)},
  rrBody: {flex: 1, flexDirection: 'row', alignItems: 'center', padding: ms(9), gap: s(10)},
  rrTimeCol: {alignItems: 'center'},
  rrDiv: {width: 0.5, backgroundColor: '#f0f4f2', alignSelf: 'stretch'},
});

export default MigraineRecordsTab;
