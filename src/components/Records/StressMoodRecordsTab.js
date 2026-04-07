import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

const FILTERS = [
  {key: 'all', label: 'All entries'},
  {key: 'low', label: 'Low days'},
  {key: 'anx', label: 'Anxiety'},
  {key: 'good', label: 'Better days'},
];

const MOOD_COLORS = {1: Colors.red, 2: Colors.red, 3: '#F97316', 4: '#F0B429', 5: '#F0B429', 6: '#84CC16', 7: '#84CC16', 8: Colors.accent, 9: Colors.accent, 10: Colors.accent};
const CALENDAR_MOODS = [0,0,3,5,0,6,4,0,2,5,0,3,0,6,5,4,0,2,0,7,5,0,3,0,4,0,3,0,5,0,0];

const ALL_ENTRIES = [
  {date: 'Today \u00B7 28 Mar 2026', mood: 5, color: '#F0B429', meta: '5.5 hrs sleep \u00B7 Energy 3/10 \u00B7 Partially anhedonic', chips: [{l: 'Overwhelmed', c: 'dep'}, {l: 'Anxious', c: 'dep'}, {l: 'Guilty', c: 'dep'}, {l: 'Deep breathing', c: 'pos'}], phq: 11},
  {date: '25 Mar 2026 \u00B7 Tuesday', mood: 3, color: Colors.red, meta: '4 hrs sleep \u00B7 Energy 2/10 \u00B7 Anhedonic', chips: [{l: 'Hopeless', c: 'dep'}, {l: 'Numb', c: 'dep'}, {l: 'Withdrew', c: 'dep'}], phq: 15},
  {date: '23 Mar 2026 \u00B7 Sunday', mood: 4, color: '#F97316', meta: '6 hrs sleep \u00B7 Energy 4/10 \u00B7 Partial joy', chips: [{l: 'Anxious', c: 'dep'}, {l: 'Irritable', c: 'dep'}, {l: 'Time with Aarav', c: 'pos'}], phq: 12},
  {date: '20 Mar 2026 \u00B7 Friday', mood: 7, color: '#84CC16', meta: '7 hrs sleep \u00B7 Energy 6/10 \u00B7 Joy present', chips: [{l: 'Exercised', c: 'pos'}, {l: 'Went outside', c: 'pos'}], phq: 7},
  {date: '18 Mar 2026 \u00B7 Wednesday', mood: 2, color: Colors.red, meta: '4.5 hrs sleep \u00B7 Energy 2/10 \u00B7 No joy', chips: [{l: 'Worthless', c: 'dep'}, {l: 'Brain fog', c: 'dep'}, {l: 'Stayed in bed', c: 'dep'}], phq: 16},
];

const LOW_ENTRIES = ALL_ENTRIES.filter(e => e.mood <= 4);
const ANX_ENTRIES = [ALL_ENTRIES[0], ALL_ENTRIES[2]];
const GOOD_ENTRIES = ALL_ENTRIES.filter(e => e.mood >= 6);

const EntryRow = ({entry}) => (
  <View style={st.rrow}>
    <View style={[st.rrowDot, {backgroundColor: entry.color}]} />
    <View style={{flex: 1}}>
      <AppText variant="bodyBold" color={Colors.textPrimary}>{entry.date}</AppText>
      <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{entry.meta}</AppText>
      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(4), marginTop: vs(6)}}>
        {entry.chips.map((ch, i) => (
          <View key={i} style={[st.rrowChip, ch.c === 'pos' && {backgroundColor: Colors.tealBg}]}>
            <AppText variant="subtext" color={ch.c === 'pos' ? Colors.tealText : Colors.primary} style={{fontWeight: '600'}}>{ch.l}</AppText>
          </View>
        ))}
      </View>
    </View>
    <View style={{alignItems: 'flex-end'}}>
      <AppText variant="header" color={entry.color} style={{fontWeight: '800', fontSize: ms(16)}}>{entry.mood}</AppText>
      <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(2)}}>PHQ {entry.phq}</AppText>
    </View>
  </View>
);

const CAL_GAP = ms(3);

const StressMoodRecordsTab = ({navigation}) => {
  const {width: screenW} = useWindowDimensions();
  const calCardPad = ms(13) * 2 + s(13) * 2; // card padding + parent padding
  const cellSize = (screenW - calCardPad - CAL_GAP * 6) / 7;
  const [filter, setFilter] = useState('all');

  const entries = filter === 'all' ? ALL_ENTRIES : filter === 'low' ? LOW_ENTRIES : filter === 'anx' ? ANX_ENTRIES : GOOD_ENTRIES;

  return (
    <View>
      {/* Stats banner */}
      <View style={st.statsBanner}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(10)}}>
          <View style={st.statsIcon}><Icon family="Ionicons" name="happy-outline" size={ms(22)} color={Colors.white} /></View>
          <View>
            <AppText variant="bodyBold" color={Colors.white}>Stress & Mood log</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">Priya Reddy {'\u00B7'} 38F {'\u00B7'} Since Oct 2025</AppText>
          </View>
        </View>
        <View style={st.statsGrid}>
          {[{l: 'PHQ-9', v: '11', s2: 'Moderate', c: '#F0B429'}, {l: 'GAD-7', v: '10', s2: 'Moderate', c: '#F97316'}, {l: 'Avg mood', v: '5.2', s2: 'Last 30d', c: Colors.white}, {l: 'Sleep avg', v: '5.8', s2: 'hrs / night', c: Colors.white}].map((item, i) => (
            <View key={i} style={st.statCell}>
              <AppText variant="subtext" color="rgba(255,255,255,0.4)" style={{textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(3)}}>{item.l}</AppText>
              <AppText variant="header" color={item.c} style={{fontWeight: '800', fontSize: ms(16)}}>{item.v}</AppText>
              <AppText variant="subtext" color="rgba(255,255,255,0.5)" style={{marginTop: vs(1)}}>{item.s2}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Filter pills */}
      <View style={{marginBottom: vs(10)}}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: s(6)}}>
          {FILTERS.map(f => {
            const on = filter === f.key;
            return (
              <TouchableOpacity key={f.key} style={[st.pill, on && st.pillOn]} onPress={() => setFilter(f.key)} activeOpacity={0.7}>
                <AppText variant="small" color={on ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{f.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Ayu Intel button */}
      <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'stressMood', initialTab: 'stressMoodIntel'})}>
        <View style={st.ayuIcon}><Icon family="Ionicons" name="bulb-outline" size={ms(16)} color={Colors.white} /></View>
        <View style={{flex: 1}}>
          <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel {'\u00B7'} Stress & Mood</AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.7)">PHQ-9 analysis {'\u00B7'} Patterns {'\u00B7'} Care plan</AppText>
        </View>
        <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      {/* Mood calendar */}
      <View style={st.sec}><AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>Mood calendar {'\u00B7'} March 2026</AppText><View style={st.secLine} /></View>
      <View style={st.calCard}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(6)}}>
          {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
            <AppText key={d} variant="subtext" color={Colors.textTertiary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, width: '14%', textAlign: 'center'}}>{d}</AppText>
          ))}
        </View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: CAL_GAP}}>
          {/* March 2026 starts on Sunday = 6 blank days (Mon-Sat) */}
          {Array(6).fill(0).map((_, i) => <View key={`b${i}`} style={{width: cellSize, height: cellSize}} />)}
          {CALENDAR_MOODS.map((m, i) => (
            <View key={i} style={{width: cellSize, height: cellSize, borderRadius: ms(5), backgroundColor: m === 0 ? '#E5E7EB' : MOOD_COLORS[m] || '#E5E7EB', alignItems: 'center', justifyContent: 'center'}}>
              <AppText variant="subtext" color={m > 0 ? 'rgba(255,255,255,0.8)' : Colors.textTertiary} style={{fontSize: ms(7), fontWeight: '700'}}>{i + 1}</AppText>
            </View>
          ))}
        </View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(6), marginTop: vs(8)}}>
          <AppText variant="subtext" color={Colors.textTertiary}>Mood:</AppText>
          {[{c: Colors.red, l: 'Very low'}, {c: '#F97316', l: 'Low'}, {c: '#F0B429', l: 'Neutral'}, {c: '#84CC16', l: 'Good'}, {c: '#E5E7EB', l: 'No entry'}].map(item => (
            <View key={item.l} style={{flexDirection: 'row', alignItems: 'center', gap: s(4)}}>
              <View style={{width: ms(10), height: ms(10), borderRadius: ms(3), backgroundColor: item.c}} />
              <AppText variant="subtext" color={Colors.textSecondary}>{item.l}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Entries */}
      <View style={st.sec}><AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{filter === 'all' ? 'All entries' : filter === 'low' ? 'Low mood days (mood \u2264 4)' : filter === 'anx' ? 'Anxiety spike days (GAD-7 \u2265 10)' : 'Better days (mood \u2265 6)'}</AppText><View style={st.secLine} /></View>
      {entries.map((e, i) => <EntryRow key={i} entry={e} />)}
      {entries.length === 0 && (
        <View style={{alignItems: 'center', paddingVertical: vs(30)}}>
          <AppText variant="body" color={Colors.textTertiary}>No entries in this category</AppText>
        </View>
      )}
    </View>
  );
};

const st = StyleSheet.create({
  statsBanner: {backgroundColor: Colors.primary, borderRadius: ms(16), padding: ms(14), marginBottom: vs(10)},
  statsIcon: {width: ms(44), height: ms(44), borderRadius: ms(12), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  statsGrid: {flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: ms(12), overflow: 'hidden'},
  statCell: {flex: 1, padding: ms(9), backgroundColor: 'rgba(0,0,0,0.2)'},
  pill: {paddingHorizontal: s(13), paddingVertical: vs(7), borderRadius: ms(22), backgroundColor: Colors.white, borderWidth: 1, borderColor: '#dde8e2'},
  pillOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  ayuBtn: {flexDirection: 'row', alignItems: 'center', gap: s(8), backgroundColor: Colors.accent, borderRadius: ms(12), padding: ms(12), marginBottom: vs(10)},
  ayuIcon: {width: ms(34), height: ms(34), borderRadius: ms(9), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(12), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'},
  calCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 1, borderColor: '#dde8e2', padding: ms(13), marginBottom: vs(8)},
  rrow: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 1, borderColor: '#dde8e2', padding: ms(12), marginBottom: vs(7), flexDirection: 'row', alignItems: 'flex-start', gap: s(11)},
  rrowDot: {width: ms(10), height: ms(10), borderRadius: ms(5), marginTop: vs(4)},
  rrowChip: {backgroundColor: Colors.tealBg, paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(8)},
});

export default StressMoodRecordsTab;
