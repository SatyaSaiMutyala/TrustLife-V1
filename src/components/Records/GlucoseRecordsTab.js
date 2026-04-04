import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const FILTERS = [
  {key: 'all', label: 'All (46)', icon: 'grid-outline'},
  {key: 'fasting', label: 'Fasting (28)', icon: 'moon-outline'},
  {key: 'postmeal', label: 'Post-meal (14)', icon: 'restaurant-outline'},
  {key: 'flagged', label: 'Flagged (8)', icon: 'warning-outline'},
];

const READINGS = [
  {
    dateGroup: '28 March 2026 - Saturday',
    items: [
      {time: '7:12', ampm: 'AM', type: 'Fasting - Before breakfast', value: '121', unit: 'mg/dL', color: Colors.tealDark, barColor: Colors.accent, pill: 'In range', pillStyle: 'pg', source: 'Glucometer', delta: '-4 vs yesterday', deltaColor: Colors.tealDark, cat: 'fasting'},
      {time: '9:45', ampm: 'AM', type: 'Post-breakfast - 2h after', value: '155', unit: 'mg/dL', color: Colors.amber, barColor: Colors.amber, pill: 'Slightly high', pillStyle: 'pa', source: 'Glucometer', delta: '-8 vs last wk', deltaColor: Colors.tealDark, cat: 'postmeal'},
    ],
  },
  {
    dateGroup: '23 March 2026 - Monday',
    items: [
      {time: '7:15', ampm: 'AM', type: 'Fasting - Before breakfast', value: '118', unit: 'mg/dL', color: Colors.tealDark, barColor: Colors.accent, pill: 'Best FBG this month', pillStyle: 'pg', source: 'Glucometer', delta: 'Personal best', deltaColor: Colors.tealDark, cat: 'fasting'},
      {time: '12:54', ampm: 'PM', type: 'Pre-lunch - Random', value: '96', unit: 'mg/dL', color: Colors.tealDark, barColor: Colors.accent, pill: 'Lowest this month', pillStyle: 'pg', source: 'Glucometer', delta: 'Lowest reading', deltaColor: Colors.tealDark, cat: 'fasting'},
    ],
  },
  {
    dateGroup: '12 March 2026 - Thursday - Lab day',
    items: [
      {time: '6:45', ampm: 'AM', type: 'Fasting - Lab draw (12h fast)', value: '126', unit: 'mg/dL', color: Colors.amber, barColor: Colors.amber, pill: 'Elevated', pillStyle: 'pa', pill2: 'Lab confirmed', pill2Style: 'pb', source: 'Apollo Lab', cat: 'fasting'},
      {time: '9:15', ampm: 'AM', type: 'Post-glucose load (OGTT)', value: '164', unit: 'mg/dL', color: Colors.amber, barColor: Colors.amber, pill: 'Post-prandial elevated', pillStyle: 'pa', source: 'Apollo Lab', cat: 'postmeal'},
    ],
  },
  {
    dateGroup: '8 March 2026 - Sunday',
    items: [
      {time: '9:40', ampm: 'PM', type: 'Post-dinner - 2h after', value: '218', unit: 'mg/dL', color: Colors.red, barColor: Colors.red, pill: 'Very high - Highest this month', pillStyle: 'pr', source: 'Glucometer', delta: 'Large dinner', deltaColor: Colors.red, flagged: true, cat: 'postmeal'},
    ],
  },
  {
    dateGroup: '1 March 2026 - Sunday - Month start',
    items: [
      {time: '7:05', ampm: 'AM', type: 'Fasting - Before breakfast', value: '131', unit: 'mg/dL', color: Colors.amber, barColor: Colors.amber, pill: 'Elevated - Month start', pillStyle: 'pa', source: 'Glucometer', cat: 'fasting'},
      {time: '9:50', ampm: 'AM', type: 'Post-breakfast - 2h after', value: '172', unit: 'mg/dL', color: Colors.amber, barColor: Colors.amber, pill: 'Elevated', pillStyle: 'pa', source: 'Glucometer', delta: '-17 vs last mo.', deltaColor: Colors.tealDark, cat: 'postmeal'},
    ],
  },
];

const PILL_STYLES = {
  pg: {bg: Colors.tealBg, color: Colors.tealText},
  pa: {bg: Colors.amberBg, color: Colors.amberDark},
  pr: {bg: Colors.redBg, color: Colors.redDark},
  pb: {bg: Colors.blueBg, color: Colors.blueText},
};

// ──────────────────────────────────────────────
// Sub-components
// ──────────────────────────────────────────────

const StatBox = ({label, value, sub}) => (
  <View style={st.statBox}>
    <AppText variant="subtext" color="rgba(255,255,255,0.38)" style={{textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.5, marginBottom: vs(2)}}>
      {label}
    </AppText>
    <AppText style={{fontSize: ms(15), fontWeight: '700', color: Colors.white}}>
      {value}
    </AppText>
    <AppText variant="subtext" color="rgba(255,255,255,0.38)" style={{marginTop: vs(1)}}>
      {sub}
    </AppText>
  </View>
);

const Pill = ({text, style: pillStyle}) => {
  const ps = PILL_STYLES[pillStyle] || PILL_STYLES.pa;
  return (
    <View style={[st.pill, {backgroundColor: ps.bg}]}>
      <AppText variant="subtext" color={ps.color} style={{fontWeight: '700'}}>
        {text}
      </AppText>
    </View>
  );
};

const ReadingRow = ({item}) => (
  <View style={[st.readingRow, item.flagged && {borderWidth: 0.5, borderColor: '#F7C1C1'}]}>
    <View style={[st.rrLeft, {backgroundColor: item.barColor}]} />
    <View style={st.rrBody}>
      {/* Time */}
      <View style={st.rrTimeCol}>
        <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>
          {item.time}
        </AppText>
        <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(1)}}>
          {item.ampm}
        </AppText>
      </View>
      {/* Divider */}
      <View style={st.rrDiv} />
      {/* Content */}
      <View style={{flex: 1, paddingLeft: s(10)}}>
        <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5, marginBottom: vs(2)}}>
          {item.type}
        </AppText>
        <View style={{flexDirection: 'row', alignItems: 'baseline', gap: s(4)}}>
          <AppText style={{fontSize: ms(20), fontWeight: '800', color: item.color, lineHeight: ms(22)}}>
            {item.value}
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>{item.unit}</AppText>
        </View>
        <View style={{flexDirection: 'row', gap: s(4), marginTop: vs(3), flexWrap: 'wrap'}}>
          <Pill text={item.pill} style={item.pillStyle} />
          {item.pill2 && <Pill text={item.pill2} style={item.pill2Style} />}
        </View>
      </View>
      {/* Right */}
      <View style={{alignItems: 'flex-end', flexShrink: 0}}>
        <AppText variant="subtext" color="#bbb" style={{marginBottom: vs(4)}}>
          {item.source}
        </AppText>
        {item.delta && (
          <AppText variant="small" color={item.deltaColor} style={{fontWeight: '600'}}>
            {item.delta}
          </AppText>
        )}
      </View>
    </View>
  </View>
);

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

const GlucoseRecordsTab = ({navigation}) => {
  const [activeFilter, setActiveFilter] = useState('all');

  const getFilteredReadings = () => {
    if (activeFilter === 'all') return READINGS;
    return READINGS.map(group => ({
      ...group,
      items: group.items.filter(item => {
        if (activeFilter === 'flagged') return item.flagged;
        return item.cat === activeFilter;
      }),
    })).filter(group => group.items.length > 0);
  };

  const filtered = getFilteredReadings();

  return (
    <View>
      {/* Stats banner */}
      <View style={st.statsBanner}>
        <View style={{paddingHorizontal: s(16), paddingTop: vs(10), paddingBottom: vs(6)}}>
          <AppText variant="subtext" color="rgba(255,255,255,0.4)" style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.8, marginBottom: vs(2)}}>
            Records - Blood glucose
          </AppText>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8)}}>
            <Icon family="Ionicons" name="water" size={ms(18)} color={Colors.white} />
            <AppText style={{fontSize: ms(19), fontWeight: '700', color: Colors.white}}>
              Blood Glucose
            </AppText>
            <View style={[st.pill, {backgroundColor: Colors.amberBg}]}>
              <AppText variant="subtext" color={Colors.amberDark} style={{fontWeight: '700'}}>Above target</AppText>
            </View>
          </View>
          <AppText variant="caption" color="rgba(255,255,255,0.45)" style={{marginTop: vs(1)}}>
            Priya Reddy - T2DM - 46 readings - March 2026
          </AppText>
        </View>
        <View style={st.statsRow}>
          <StatBox label="Avg FBG" value="125" sub="mg/dL" />
          <StatBox label="Avg PP" value="158" sub="mg/dL" />
          <StatBox label="TIR" value="68%" sub="70-180 range" />
          <StatBox label="Readings" value="46" sub="this month" />
        </View>
      </View>

      {/* Filter pills */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: s(6), gap: s(6), paddingBottom: vs(10), paddingTop: vs(10)}}>
        {FILTERS.map(f => {
          const active = activeFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[st.filterPill, active && st.filterPillActive]}
              onPress={() => setActiveFilter(f.key)}
              activeOpacity={0.7}>
              <Icon family="Ionicons" name={f.icon} size={ms(12)} color={active ? Colors.white : Colors.textSecondary} />
              <AppText
                variant="caption"
                color={active ? Colors.white : Colors.textSecondary}
                style={{fontWeight: '600', marginLeft: s(6)}}>
                {f.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Ayu Intel button */}
      <View style={{paddingHorizontal: s(6), marginBottom: vs(12)}}>
        <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'glucose', initialTab: 'glucoseIntel'})}>
          <View style={st.ayuIconWrap}>
            <Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.white} />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>
              Ayu Intel - Blood Glucose
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginTop: vs(1)}}>
              Patterns - Risk flags - Recommendations
            </AppText>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>

      {/* Reading groups */}
      <View style={{paddingHorizontal: s(6)}}>
        {filtered.map((group, gi) => (
          <View key={gi}>
            {/* Date group label */}
            <View style={st.dateGroup}>
              <AppText
                variant="small"
                color={Colors.textSecondary}
                style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5, marginRight: s(8)}}>
                {group.dateGroup}
              </AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            {/* Reading rows */}
            {group.items.map((item, ri) => (
              <ReadingRow key={ri} item={item} />
            ))}
          </View>
        ))}

        {/* Load all */}
        <TouchableOpacity style={{alignItems: 'center', paddingVertical: vs(12)}}>
          <AppText variant="caption" color={Colors.textSecondary}>
            Load all 46 readings
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  // Stats banner
  statsBanner: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    marginHorizontal: s(4),
    overflow: 'hidden',
    marginBottom: vs(4),
  },
  statsRow: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: 'rgba(255,255,255,0.1)',
  },
  statBox: {
    flex: 1,
    paddingVertical: vs(8),
    paddingHorizontal: s(10),
    borderRightWidth: 0.5,
    borderRightColor: 'rgba(255,255,255,0.1)',
  },

  // Filter pills
  filterPill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(18),
    borderWidth: 0.5,
    borderColor: '#dde8e2',
    backgroundColor: Colors.white,
  },
  filterPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // Ayu button
  ayuBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    backgroundColor: Colors.accent,
    borderRadius: ms(12),
    padding: ms(12),
  },
  ayuIconWrap: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Date group
  dateGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(14),
    marginBottom: vs(8),
  },

  // Pill
  pill: {
    paddingHorizontal: s(7),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },

  // Reading row
  readingRow: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: '#dde8e2',
    marginBottom: vs(7),
    overflow: 'hidden',
    flexDirection: 'row',
    alignItems: 'stretch',
  },
  rrLeft: {
    width: ms(4),
  },
  rrBody: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(9),
    gap: s(10),
  },
  rrTimeCol: {
    alignItems: 'center',
    minWidth: s(38),
  },
  rrDiv: {
    width: 0.5,
    backgroundColor: '#f0f4f2',
    alignSelf: 'stretch',
  },
});

export default GlucoseRecordsTab;















