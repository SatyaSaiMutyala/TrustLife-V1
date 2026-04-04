import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

const FILTERS = [
  {key: 'weight', label: 'Weight', icon: 'scale-outline'},
  {key: 'bmi', label: 'BMI', icon: 'analytics-outline'},
  {key: 'bodycomp', label: 'Body comp', icon: 'body-outline'},
  {key: 'height', label: 'Height', icon: 'resize-outline'},
];

// ── Weight readings ──
const WEIGHT_READINGS = [
  {dateGroup: 'March 2026', items: [
    {day: '24', mon: 'Mar', type: 'Fasting - Manual', value: '68.4', unit: 'kg', color: Colors.primary, barColor: Colors.primary, pills: [{t: 'BMI 25.7', s: 'pa'}, {t: 'Waist 84 cm', s: 'pn'}], source: 'Manual'},
    {day: '20', mon: 'Mar', type: 'Smart scale - Morning', value: '68.6', unit: 'kg', color: Colors.textPrimary, barColor: Colors.accent, pills: [{t: 'BMI 25.8', s: 'pa'}, {t: 'Fat 32.7%', s: 'pn'}], source: 'Mi Scale', delta: '+0.2', deltaColor: Colors.red},
    {day: '15', mon: 'Mar', type: 'Clinic - Dr. Meera', value: '68.4', unit: 'kg', color: Colors.textPrimary, barColor: Colors.accent, pills: [{t: 'BMI 25.7', s: 'pa'}, {t: 'Stable', s: 'pg'}], source: 'Clinic'},
    {day: '10', mon: 'Mar', type: 'Smart scale - Morning', value: '68.8', unit: 'kg', color: Colors.textPrimary, barColor: Colors.accent, pills: [{t: 'BMI 25.9', s: 'pa'}, {t: 'Fat 33.0%', s: 'pn'}], source: 'Mi Scale', delta: '+0.4', deltaColor: Colors.red},
    {day: '3', mon: 'Mar', type: 'Smart scale - Morning', value: '69.1', unit: 'kg', color: Colors.textPrimary, barColor: Colors.accent, pills: [{t: 'BMI 26.0', s: 'pa'}, {t: 'Fat 33.3%', s: 'pn'}], source: 'Mi Scale', delta: '+0.7', deltaColor: Colors.red},
  ]},
  {dateGroup: '2025', items: [
    {day: '10 Sep', mon: '2025', type: 'Clinic - 6-month review', value: '69.2', unit: 'kg', color: Colors.textPrimary, barColor: Colors.accent, pills: [{t: 'BMI 26.0', s: 'pa'}, {t: '-0.8 kg from Mar', s: 'pg'}], source: 'Clinic', delta: '-0.8', deltaColor: Colors.tealDark},
    {day: '12 Mar', mon: '2025', type: 'Clinic - Annual review', value: '69.0', unit: 'kg', color: Colors.textPrimary, barColor: Colors.accent, pills: [{t: 'BMI 25.9', s: 'pa'}, {t: '-0.2 kg', s: 'pg'}], source: 'Clinic', delta: '-0.2', deltaColor: Colors.tealDark},
  ]},
  {dateGroup: 'Historical', items: [
    {day: 'Jun', mon: '2022', type: 'Peak weight ever recorded', value: '70.2', unit: 'kg', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'BMI 26.4', s: 'pa'}, {t: 'Peak', s: 'pa'}], source: 'Clinic', delta: 'Peak', deltaColor: Colors.red},
    {day: 'Sep', mon: '2019', type: 'T2DM diagnosis', value: '72.4', unit: 'kg', color: Colors.red, barColor: Colors.red, pills: [{t: 'BMI 27.2', s: 'pr'}, {t: 'At diagnosis', s: 'pa'}], source: 'Lab', delta: 'Baseline', deltaColor: Colors.red},
  ]},
];

// ── BMI readings ──
const BMI_READINGS = [
  {dateGroup: 'March 2026', items: [
    {day: '24', mon: 'Mar', type: 'Fasting - Manual', value: '25.7', unit: 'kg/m\u00B2', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Overweight', s: 'pa'}, {t: '68.4 kg', s: 'pn'}], source: 'Manual'},
    {day: '20', mon: 'Mar', type: 'Smart scale - Morning', value: '25.8', unit: 'kg/m\u00B2', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Overweight', s: 'pa'}, {t: '68.6 kg', s: 'pn'}], source: 'Mi Scale', delta: '+0.1', deltaColor: Colors.red},
    {day: '15', mon: 'Mar', type: 'Clinic - Dr. Meera', value: '25.7', unit: 'kg/m\u00B2', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Overweight', s: 'pa'}, {t: 'Same', s: 'pg'}], source: 'Clinic'},
    {day: '10', mon: 'Mar', type: 'Smart scale - Morning', value: '25.9', unit: 'kg/m\u00B2', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Overweight', s: 'pa'}, {t: '68.8 kg', s: 'pn'}], source: 'Mi Scale', delta: '+0.2', deltaColor: Colors.red},
    {day: '3', mon: 'Mar', type: 'Smart scale - Morning', value: '26.0', unit: 'kg/m\u00B2', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Overweight', s: 'pa'}, {t: '69.1 kg', s: 'pn'}], source: 'Mi Scale', delta: '+0.3', deltaColor: Colors.red},
  ]},
  {dateGroup: '2025', items: [
    {day: '10 Sep', mon: '2025', type: 'Clinic - 6-month review', value: '26.0', unit: 'kg/m\u00B2', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Overweight', s: 'pa'}, {t: '69.2 kg', s: 'pn'}], source: 'Clinic', delta: '-0.1', deltaColor: Colors.tealDark},
    {day: '12 Mar', mon: '2025', type: 'Clinic - Annual review', value: '25.9', unit: 'kg/m\u00B2', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Overweight', s: 'pa'}, {t: '69.0 kg', s: 'pn'}], source: 'Clinic', delta: '-0.1', deltaColor: Colors.tealDark},
  ]},
  {dateGroup: 'Historical', items: [
    {day: 'Jun', mon: '2022', type: 'Peak BMI ever recorded', value: '26.4', unit: 'kg/m\u00B2', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Overweight', s: 'pa'}, {t: '70.2 kg', s: 'pn'}], source: 'Clinic', delta: 'Peak', deltaColor: Colors.red},
    {day: 'Sep', mon: '2019', type: 'T2DM diagnosis', value: '27.2', unit: 'kg/m\u00B2', color: Colors.red, barColor: Colors.red, pills: [{t: 'Obese (Asian)', s: 'pr'}, {t: '72.4 kg', s: 'pn'}], source: 'Lab', delta: 'Baseline', deltaColor: Colors.red},
  ]},
];

// ── Body comp readings ──
const BODYCOMP_READINGS = [
  {dateGroup: 'March 2026', items: [
    {day: '20', mon: 'Mar', type: 'Mi Scale - BIA full scan', value: '32.7%', unit: 'body fat', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Muscle 46.2 kg', s: 'pg'}, {t: 'Visc. 10', s: 'pr'}], source: 'Mi Scale'},
    {day: '10', mon: 'Mar', type: 'Mi Scale - BIA full scan', value: '33.0%', unit: 'body fat', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Muscle 46.0 kg', s: 'pg'}, {t: 'Visc. 10', s: 'pr'}], source: 'Mi Scale', delta: '+0.3%', deltaColor: Colors.red},
    {day: '3', mon: 'Mar', type: 'Mi Scale - BIA full scan', value: '33.3%', unit: 'body fat', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Muscle 45.8 kg', s: 'pn'}, {t: 'Visc. 10', s: 'pr'}], source: 'Mi Scale', delta: '+0.6%', deltaColor: Colors.red},
  ]},
  {dateGroup: '2025', items: [
    {day: '10 Sep', mon: '2025', type: 'Clinic - DEXA scan', value: '33.8%', unit: 'body fat', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Muscle 45.5 kg', s: 'pn'}, {t: 'Visc. 11', s: 'pr'}], source: 'Clinic', delta: '-1.1%', deltaColor: Colors.tealDark},
    {day: '12 Mar', mon: '2025', type: 'Mi Scale - BIA', value: '34.2%', unit: 'body fat', color: Colors.red, barColor: Colors.red, pills: [{t: 'Muscle 45.2 kg', s: 'pn'}, {t: 'Visc. 11', s: 'pr'}], source: 'Mi Scale', delta: '-1.5%', deltaColor: Colors.tealDark},
  ]},
  {dateGroup: 'Historical', items: [
    {day: 'Jun', mon: '2022', type: 'Peak body fat', value: '35.8%', unit: 'body fat', color: Colors.red, barColor: Colors.red, pills: [{t: 'Muscle 44.0 kg', s: 'pn'}, {t: 'Visc. 12', s: 'pr'}], source: 'Clinic', delta: 'Peak', deltaColor: Colors.red},
    {day: 'Sep', mon: '2019', type: 'T2DM diagnosis', value: '36.5%', unit: 'body fat', color: Colors.red, barColor: Colors.red, pills: [{t: 'Muscle 43.5 kg', s: 'pn'}, {t: 'Visc. 13', s: 'pr'}], source: 'Lab', delta: 'Baseline', deltaColor: Colors.red},
  ]},
];

// ── Height readings ──
const HEIGHT_READINGS = [
  {dateGroup: 'March 2026', items: [
    {day: '15', mon: 'Mar', type: 'Clinic - Dr. Meera', value: '163.0', unit: 'cm', color: Colors.tealDark, barColor: Colors.tealDark, pills: [{t: '5\'4"', s: 'pg'}, {t: 'Stable', s: 'pg'}], source: 'Clinic'},
  ]},
  {dateGroup: '2025', items: [
    {day: '12 Mar', mon: '2025', type: 'Clinic - Annual review', value: '163.0', unit: 'cm', color: Colors.tealDark, barColor: Colors.tealDark, pills: [{t: '5\'4"', s: 'pg'}, {t: 'No change', s: 'pg'}], source: 'Clinic'},
  ]},
  {dateGroup: 'Historical', items: [
    {day: 'Jun', mon: '2022', type: 'Clinic visit', value: '163.0', unit: 'cm', color: Colors.tealDark, barColor: Colors.tealDark, pills: [{t: '5\'4"', s: 'pg'}, {t: 'Stable', s: 'pg'}], source: 'Clinic'},
    {day: 'Sep', mon: '2019', type: 'T2DM diagnosis - baseline', value: '163.0', unit: 'cm', color: Colors.tealDark, barColor: Colors.tealDark, pills: [{t: '5\'4"', s: 'pg'}, {t: 'Baseline', s: 'pn'}], source: 'Lab'},
  ]},
];

const PILL_STYLES = {
  pg: {bg: Colors.tealBg, color: Colors.tealText},
  pa: {bg: Colors.amberBg, color: Colors.amberDark},
  pr: {bg: Colors.redBg, color: Colors.redDark},
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
        <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>{item.day}</AppText>
        <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(1)}}>{item.mon}</AppText>
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

const ReadingList = ({readings}) => (
  <View>
    {readings.map((group, gi) => (
      <View key={gi}>
        <View style={st.dateGroup}>
          <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginRight: s(8)}}>{group.dateGroup}</AppText>
          <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
        </View>
        {group.items.map((item, ri) => <ReadingRow key={ri} item={item} />)}
      </View>
    ))}
  </View>
);

// ── BMI Zone Bar ──
const BMIZoneBar = ({currentBMI}) => {
  const zones = [
    {label: 'Under', range: '<18.5', color: Colors.blue, width: '18%'},
    {label: 'Normal', range: '18.5-22.9', color: Colors.tealDark, width: '22%'},
    {label: 'Overweight', range: '23-24.9', color: Colors.amber, width: '20%'},
    {label: 'Obese I', range: '25-29.9', color: '#E67E22', width: '20%'},
    {label: 'Obese II', range: '>=30', color: Colors.red, width: '20%'},
  ];
  // Marker position: BMI 25.7 is in Obese I zone (25-29.9)
  // Map 15-35 range to 0-100%
  const pct = Math.min(100, Math.max(0, ((currentBMI - 15) / 20) * 100));
  return (
    <View style={{marginBottom: vs(10)}}>
      <View style={{flexDirection: 'row', borderRadius: ms(6), overflow: 'hidden', height: ms(10), marginBottom: vs(4)}}>
        {zones.map((z, i) => (
          <View key={i} style={{width: z.width, backgroundColor: z.color, height: '100%'}} />
        ))}
      </View>
      <View style={{position: 'relative', height: ms(14)}}>
        <View style={{position: 'absolute', left: `${pct}%`, marginLeft: -ms(4), top: 0}}>
          <Icon family="Ionicons" name="caret-up" size={ms(12)} color={Colors.textPrimary} />
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(2)}}>
        {zones.map((z, i) => (
          <View key={i} style={{alignItems: 'center', flex: 1}}>
            <AppText style={{fontSize: ms(8), fontWeight: '600', color: z.color}}>{z.label}</AppText>
            <AppText style={{fontSize: ms(7), color: Colors.textTertiary}}>{z.range}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
};

// ── Weight Panel ──
const WeightPanel = ({navigation}) => (
  <View style={{paddingHorizontal: s(6)}}>
    {/* BMI summary cards */}
    <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
      <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Current BMI</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.amber}}>25.7</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Overweight</AppText></View>
      <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>BMI at Dx</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.red}}>27.2</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Sep 2019</AppText></View>
      <View style={[st.summaryCard, {flex: 1, backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Target BMI</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.tealDark}}>23.0</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>61.2 kg</AppText></View>
    </View>

    <ReadingList readings={WEIGHT_READINGS} />

    {/* March summary */}
    <View style={st.secLabel}>
      <AppText style={{fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: Colors.textSecondary, marginRight: s(8)}}>March summary</AppText>
      <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
    </View>
    <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: vs(10)}}>
      <MetricCard label="Current weight" value="68.4" unit=" kg" valueColor={Colors.primary} sub="BMI 25.7 - Overweight" pct={65} barColor={Colors.amber} />
      <MetricCard label="To target (BMI 23)" value="-7.2" unit=" kg" valueColor={Colors.amber} sub="61.2 kg target" pct={36} barColor={Colors.primary} />
      <MetricCard label="Since diagnosis" value="-4.0" unit=" kg" valueColor={Colors.tealDark} sub="72.4 to 68.4 kg" />
      <MetricCard label="Rate of loss" value="-0.13" unit=" kg/wk" valueColor={Colors.tealDark} sub="Healthy, sustainable pace" />
    </View>

    <TouchableOpacity style={{alignItems: 'center', paddingVertical: vs(12)}}>
      <AppText variant="caption" color={Colors.textSecondary}>Load all readings</AppText>
    </TouchableOpacity>
  </View>
);

// ── BMI Panel ──
const BMIPanel = () => (
  <View style={{paddingHorizontal: s(6)}}>
    {/* BMI zone bar */}
    <View style={[st.summaryCard, {marginBottom: vs(12), padding: ms(14)}]}>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(10)}}>BMI classification - Indian standard</AppText>
      <BMIZoneBar currentBMI={25.7} />
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(8)}}>
        <View style={{alignItems: 'center'}}>
          <AppText style={{fontSize: ms(9), color: Colors.textSecondary}}>Current</AppText>
          <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.amber}}>25.7</AppText>
        </View>
        <View style={{alignItems: 'center'}}>
          <AppText style={{fontSize: ms(9), color: Colors.textSecondary}}>At Diagnosis</AppText>
          <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.red}}>27.2</AppText>
        </View>
        <View style={{alignItems: 'center'}}>
          <AppText style={{fontSize: ms(9), color: Colors.textSecondary}}>Target</AppText>
          <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.tealDark}}>23.0</AppText>
        </View>
      </View>
    </View>

    {/* BMI impact cards */}
    <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
      <View style={[st.summaryCard, {flex: 1}]}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>BMI change</AppText>
        <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.tealDark}}>-1.5</AppText>
        <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>since Dx</AppText>
      </View>
      <View style={[st.summaryCard, {flex: 1}]}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>To normal</AppText>
        <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.amber}}>-2.7</AppText>
        <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>BMI points</AppText>
      </View>
      <View style={[st.summaryCard, {flex: 1}]}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Per kg lost</AppText>
        <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.primary}}>-0.38</AppText>
        <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>BMI points</AppText>
      </View>
    </View>

    <ReadingList readings={BMI_READINGS} />

    <TouchableOpacity style={{alignItems: 'center', paddingVertical: vs(12)}}>
      <AppText variant="caption" color={Colors.textSecondary}>Load all BMI readings</AppText>
    </TouchableOpacity>
  </View>
);

// ── Body Comp Panel ──
const BodyCompPanel = () => (
  <View style={{paddingHorizontal: s(6)}}>
    {/* Composition summary cards */}
    <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(8)}}>
      <View style={[st.summaryCard, {flex: 1}]}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Body fat</AppText>
        <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.amber}}>32.7%</AppText>
        <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Near limit 33%</AppText>
      </View>
      <View style={[st.summaryCard, {flex: 1}]}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Muscle mass</AppText>
        <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.tealDark}}>46.2 kg</AppText>
        <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Normal</AppText>
      </View>
    </View>
    <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
      <View style={[st.summaryCard, {flex: 1, backgroundColor: Colors.redBg, borderColor: '#f5c6c6'}]}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Visceral fat</AppText>
        <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.red}}>Level 10</AppText>
        <AppText style={{fontSize: ms(9), color: Colors.redText}}>High (target {'<'}10)</AppText>
      </View>
      <View style={[st.summaryCard, {flex: 1}]}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Bone mass</AppText>
        <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.textPrimary}}>2.5 kg</AppText>
        <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Normal</AppText>
      </View>
    </View>

    {/* Body water & metabolic age */}
    <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
      <View style={[st.summaryCard, {flex: 1}]}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Body water</AppText>
        <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.blue}}>50.1%</AppText>
        <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Normal range</AppText>
      </View>
      <View style={[st.summaryCard, {flex: 1}]}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Metabolic age</AppText>
        <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.amber}}>42</AppText>
        <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Actual age 38</AppText>
      </View>
    </View>

    {/* Trend insight */}
    <View style={[st.summaryCard, {marginBottom: vs(12), padding: ms(12), backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen}]}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(6)}}>
        <Icon family="Ionicons" name="trending-down-outline" size={ms(16)} color={Colors.tealDark} />
        <AppText style={{fontSize: ms(11), fontWeight: '700', color: Colors.tealDark}}>Composition improving</AppText>
      </View>
      <AppText style={{fontSize: ms(10), color: Colors.tealText, lineHeight: ms(16)}}>Body fat down 3.8% since diagnosis while muscle mass preserved (+2.7 kg). Visceral fat dropped from level 13 to 10. Key: continue resistance training to maintain muscle during weight loss.</AppText>
    </View>

    <ReadingList readings={BODYCOMP_READINGS} />

    <TouchableOpacity style={{alignItems: 'center', paddingVertical: vs(12)}}>
      <AppText variant="caption" color={Colors.textSecondary}>Load all body comp readings</AppText>
    </TouchableOpacity>
  </View>
);

// ── Height Panel ──
const HeightPanel = () => (
  <View style={{paddingHorizontal: s(6)}}>
    {/* Height summary */}
    <View style={[st.summaryCard, {marginBottom: vs(12), padding: ms(14)}]}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
        <View style={{width: ms(50), height: ms(50), borderRadius: ms(14), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center'}}>
          <Icon family="Ionicons" name="resize-outline" size={ms(24)} color={Colors.tealDark} />
        </View>
        <View style={{flex: 1}}>
          <AppText style={{fontSize: ms(9), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary}}>Current height</AppText>
          <View style={{flexDirection: 'row', alignItems: 'baseline', gap: s(4)}}>
            <AppText style={{fontSize: ms(28), fontWeight: '800', color: Colors.tealDark}}>163</AppText>
            <AppText style={{fontSize: ms(13), color: Colors.textTertiary}}>cm</AppText>
          </View>
          <AppText style={{fontSize: ms(10), color: Colors.textSecondary}}>{'5\'4" - Stable since 2019'}</AppText>
        </View>
      </View>
    </View>

    {/* Height context cards */}
    <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
      <View style={[st.summaryCard, {flex: 1}]}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Used for BMI</AppText>
        <AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.primary}}>163 cm</AppText>
        <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>All calculations</AppText>
      </View>
      <View style={[st.summaryCard, {flex: 1}]}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Indian avg (F)</AppText>
        <AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.textPrimary}}>158 cm</AppText>
        <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>+5 cm above</AppText>
      </View>
      <View style={[st.summaryCard, {flex: 1}]}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Ideal weight</AppText>
        <AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.tealDark}}>56-61 kg</AppText>
        <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>BMI 21-23</AppText>
      </View>
    </View>

    {/* Height note */}
    <View style={[st.summaryCard, {marginBottom: vs(12), padding: ms(12), backgroundColor: Colors.amberBg, borderColor: '#e8d5a8'}]}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(4)}}>
        <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={Colors.amberDark} />
        <AppText style={{fontSize: ms(11), fontWeight: '700', color: Colors.amberDark}}>Age-related monitoring</AppText>
      </View>
      <AppText style={{fontSize: ms(10), color: Colors.amberText, lineHeight: ms(16)}}>After age 40, height can decrease ~1 cm per decade due to spinal disc compression. Annual clinic measurement recommended. Any loss {'>'} 2 cm warrants bone density screening.</AppText>
    </View>

    <ReadingList readings={HEIGHT_READINGS} />

    <TouchableOpacity style={{alignItems: 'center', paddingVertical: vs(12)}}>
      <AppText variant="caption" color={Colors.textSecondary}>Load all height readings</AppText>
    </TouchableOpacity>
  </View>
);

// ── Main Tab ──
const WeightRecordsTab = ({navigation}) => {
  const [activeFilter, setActiveFilter] = useState('weight');

  return (
    <View>
      {/* Stats banner */}
      <View style={st.statsBanner}>
        <View style={{paddingHorizontal: s(16), paddingTop: vs(10), paddingBottom: vs(6)}}>
          <AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.8, marginBottom: vs(2)}}>Records - Weight & BMI</AppText>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8)}}>
            <Icon family="Ionicons" name="scale-outline" size={ms(18)} color={Colors.white} />
            <AppText style={{fontSize: ms(19), fontWeight: '700', color: Colors.white}}>Weight & BMI</AppText>
            <View style={[st.pill, {backgroundColor: Colors.amberBg}]}><AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.amberDark}}>Overweight</AppText></View>
          </View>
          <AppText style={{fontSize: ms(11), color: 'rgba(255,255,255,0.45)', marginTop: vs(1)}}>Priya Reddy - 163 cm - Indian BMI standard</AppText>
        </View>
        <View style={st.statsRow}>
          <View style={st.statBox}><AppText style={st.statLabel}>Weight</AppText><AppText style={st.statValue}>68.4 kg</AppText><AppText style={st.statSub}>Mar 2026</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>BMI</AppText><AppText style={st.statValue}>25.7</AppText><AppText style={st.statSub}>{'OW >=23'}</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>Change</AppText><AppText style={st.statValue}>-4.0 kg</AppText><AppText style={st.statSub}>since Dx</AppText></View>
          <View style={[st.statBox, {borderRightWidth: 0}]}><AppText style={st.statLabel}>Target</AppText><AppText style={st.statValue}>61.2 kg</AppText><AppText style={st.statSub}>BMI 23</AppText></View>
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

      {/* Ayu Intel */}
      <View style={{paddingHorizontal: s(6), marginBottom: vs(12)}}>
        <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'weight', initialTab: 'weightIntel'})}>
          <View style={st.ayuIconWrap}><Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.white} /></View>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Weight & BMI</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginTop: vs(1)}}>Condition impact - Target timeline - Patterns</AppText>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>

      {/* Tab content */}
      {activeFilter === 'weight' && <WeightPanel navigation={navigation} />}
      {activeFilter === 'bmi' && <BMIPanel />}
      {activeFilter === 'bodycomp' && <BodyCompPanel />}
      {activeFilter === 'height' && <HeightPanel />}
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
  metricCard: {width: '48%', backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(11), marginBottom: vs(8)},
  habitBar: {height: ms(5), backgroundColor: '#edf2ef', borderRadius: ms(3), overflow: 'hidden'},
});

export default WeightRecordsTab;
