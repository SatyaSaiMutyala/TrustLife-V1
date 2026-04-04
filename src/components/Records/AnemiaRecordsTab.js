import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

const FILTERS = [{key: 'all', label: 'All readings'}, {key: 'lab', label: 'Lab results'}, {key: 'eye', label: 'Eye scans'}];
const PILL_STYLES = {pg: {bg: Colors.tealBg, color: Colors.tealText}, pa: {bg: Colors.amberBg, color: Colors.amberDark}, pr: {bg: Colors.redBg, color: Colors.redDark}, pm: {bg: Colors.redBg, color: Colors.redDark}, pn: {bg: '#f0f0f0', color: '#555'}};
const Pill = ({text, style: ps}) => { const s2 = PILL_STYLES[ps] || PILL_STYLES.pn; return (<View style={[st.pill, {backgroundColor: s2.bg}]}><AppText style={{fontSize: ms(8), fontWeight: '700', color: s2.color}}>{text}</AppText></View>); };

const ReadingRow = ({item}) => (
  <View style={st.readingRow}>
    <View style={[st.rrLeft, {backgroundColor: item.barColor}]} />
    <View style={st.rrBody}>
      <View style={[st.rrTimeCol, {minWidth: s(44)}]}>
        <AppText style={{fontSize: ms(10), fontWeight: '700', color: Colors.textPrimary}}>{item.date}</AppText>
        <AppText style={{fontSize: ms(9), color: Colors.textTertiary, marginTop: vs(1)}}>{item.tag}</AppText>
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

const BarCol = ({topLabel, topColor, height, barColor, bottomLabel}) => (
  <View style={{flex: 1, alignItems: 'center'}}>
    <AppText style={{fontSize: ms(8), fontWeight: '700', color: topColor, marginBottom: vs(2)}}>{topLabel}</AppText>
    <View style={{flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'center'}}>
      <View style={{width: '100%', borderTopLeftRadius: ms(3), borderTopRightRadius: ms(3), backgroundColor: barColor, height}} />
    </View>
    <AppText style={{fontSize: ms(7), color: Colors.textTertiary, marginTop: vs(2)}}>{bottomLabel}</AppText>
  </View>
);

const ALL_READINGS = [
  {dateGroup: '2026 - All sources', items: [
    {date: '10 Jan', tag: 'Lab', type: 'CBC + Iron panel - Thyrocare', value: '11.8', unit: 'g/dL Hb', color: Colors.red, barColor: Colors.red, pills: [{t: 'Mild anaemia', s: 'pm'}, {t: 'Ferritin 8', s: 'pr'}, {t: 'MCV 74', s: 'pa'}], source: 'Thyrocare', delta: 'Lab', deltaColor: Colors.red},
    {date: '15 Mar', tag: 'Eye', type: 'Eyenaemia scan - Conjunctival pallor', value: '11.4', unit: 'g/dL est.', color: Colors.red, barColor: Colors.red, pills: [{t: 'Mild pallor', s: 'pm'}, {t: '82% confidence', s: 'pn'}], source: 'Eyenaemia', delta: 'Scan', deltaColor: Colors.textTertiary},
    {date: '28 Mar', tag: 'Sym.', type: 'Symptom log - Today', value: '6', unit: '/10 fatigue', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Fatigue - Breathless', s: 'pa'}, {t: 'Iron taken', s: 'pg'}], source: 'Manual', delta: 'Today', deltaColor: Colors.textTertiary},
  ]},
  {dateGroup: '2025 - Lab results', items: [
    {date: '10 Sep', tag: 'Lab', type: 'CBC - Clinic annual review', value: '11.2', unit: 'g/dL Hb', color: Colors.red, barColor: Colors.red, pills: [{t: 'Mild anaemia', s: 'pm'}, {t: 'Ferritin 6', s: 'pr'}], source: 'Clinic', delta: '+0.6 from start', deltaColor: Colors.tealDark},
    {date: '12 Mar', tag: 'Lab', type: 'CBC - Annual review', value: '11.0', unit: 'g/dL Hb', color: Colors.red, barColor: Colors.red, pills: [{t: 'Mild anaemia', s: 'pm'}, {t: 'Iron supplement started', s: 'pr'}], source: 'Clinic'},
  ]},
  {dateGroup: '2024 - First diagnosis', items: [
    {date: '10 Sep', tag: 'Lab', type: 'CBC - T2DM annual panel - Baseline', value: '10.6', unit: 'g/dL Hb', color: Colors.red, barColor: Colors.red, pills: [{t: 'Anaemia first detected', s: 'pr'}, {t: 'Ferritin 4', s: 'pr'}], source: 'TrustLab', delta: 'Baseline', deltaColor: Colors.red},
  ]},
];

const LAB_READINGS = [
  {dateGroup: 'Lab results only', items: [
    {date: '10 Jan 26', tag: 'Lab', type: 'Thyrocare - CBC + Iron', value: '11.8', unit: 'g/dL', color: Colors.red, barColor: Colors.red, pills: [{t: 'Ferritin 8', s: 'pr'}, {t: 'MCV 74', s: 'pa'}], source: 'Thyrocare', delta: 'Latest', deltaColor: Colors.red},
    {date: '10 Sep 25', tag: 'Lab', type: 'Clinic CBC', value: '11.2', unit: 'g/dL', color: Colors.red, barColor: Colors.red, pills: [{t: 'Ferritin 6', s: 'pr'}], source: 'Clinic'},
    {date: '12 Mar 25', tag: 'Lab', type: 'Clinic CBC', value: '11.0', unit: 'g/dL', color: Colors.red, barColor: Colors.red, pills: [{t: 'Iron started', s: 'pr'}], source: 'Clinic'},
    {date: '10 Sep 24', tag: 'Lab', type: 'TrustLab Baseline', value: '10.6', unit: 'g/dL', color: Colors.red, barColor: Colors.red, pills: [{t: 'Ferritin 4', s: 'pr'}], source: 'TrustLab', delta: 'Baseline', deltaColor: Colors.red},
  ]},
];

const EYE_READINGS = [
  {dateGroup: 'March 2026', items: [
    {date: '15 Mar', tag: 'Eye', type: 'Eyenaemia - Conjunctival pallor', value: '11.4', unit: 'g/dL est.', color: Colors.red, barColor: Colors.red, pills: [{t: 'Mild pallor', s: 'pm'}, {t: '82% confidence', s: 'pn'}], source: 'Eyenaemia', delta: '\u00B10.4 vs lab', deltaColor: Colors.tealDark},
  ]},
  {dateGroup: 'February 2026', items: [
    {date: '10 Feb', tag: 'Eye', type: 'Eyenaemia - Morning scan', value: '11.6', unit: 'g/dL est.', color: Colors.red, barColor: Colors.red, pills: [{t: 'Mild pallor', s: 'pm'}, {t: '79% confidence', s: 'pn'}], source: 'Eyenaemia'},
  ]},
  {dateGroup: 'January 2026', items: [
    {date: '14 Jan', tag: 'Eye', type: 'Eyenaemia - 4 days post lab', value: '12.2', unit: 'g/dL est.', color: Colors.amber, barColor: Colors.amber, pills: [{t: 'Slight over-estimate', s: 'pa'}, {t: '77% confidence', s: 'pn'}], source: 'Eyenaemia', delta: '\u00B10.4 vs 11.8', deltaColor: Colors.textTertiary},
  ]},
];

const AnemiaRecordsTab = ({navigation}) => {
  const [activeFilter, setActiveFilter] = useState('all');
  const readings = activeFilter === 'lab' ? LAB_READINGS : activeFilter === 'eye' ? EYE_READINGS : ALL_READINGS;

  return (
    <View>
      <View style={st.statsBanner}>
        <View style={{paddingHorizontal: s(16), paddingTop: vs(10), paddingBottom: vs(6)}}>
          <AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.38)', textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.8, marginBottom: vs(2)}}>Records - Anaemia</AppText>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8)}}>
            <Icon family="Ionicons" name="water-outline" size={ms(18)} color={Colors.white} />
            <AppText style={{fontSize: ms(19), fontWeight: '700', color: Colors.white}}>Haemoglobin log</AppText>
            <View style={[st.pill, {backgroundColor: Colors.redBg}]}><AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.redDark}}>Mild anaemia</AppText></View>
          </View>
          <AppText style={{fontSize: ms(11), color: 'rgba(255,255,255,0.4)', marginTop: vs(1)}}>Priya Reddy - 38F - Normal {'\u2265'}12.0 g/dL - Since Sep 2024</AppText>
        </View>
        <View style={st.statsRow}>
          <View style={st.statBox}><AppText style={st.statLabel}>Latest Hb</AppText><AppText style={st.statValue}>11.8 g/dL</AppText><AppText style={st.statSub}>10 Jan - Lab</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>Ferritin</AppText><AppText style={st.statValue}>8 {'\u03BC'}g/L</AppText><AppText style={st.statSub}>Low</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>B12</AppText><AppText style={st.statValue}>312</AppText><AppText style={st.statSub}>pg/mL border.</AppText></View>
          <View style={[st.statBox, {borderRightWidth: 0}]}><AppText style={st.statLabel}>Iron supp.</AppText><AppText style={st.statValue}>78%</AppText><AppText style={st.statSub}>adherence</AppText></View>
        </View>
      </View>

      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: s(6), gap: s(6), paddingBottom: vs(10), paddingTop: vs(10)}}>
        {FILTERS.map(f => {
          const active = activeFilter === f.key;
          return (<TouchableOpacity key={f.key} style={[st.filterPill, active && st.filterPillActive]} onPress={() => setActiveFilter(f.key)} activeOpacity={0.7}><AppText style={{fontSize: ms(11), fontWeight: '600', color: active ? Colors.white : Colors.textSecondary}}>{f.label}</AppText></TouchableOpacity>);
        })}
      </ScrollView>

      <View style={{paddingHorizontal: s(6), marginBottom: vs(12)}}>
        <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'anemia', initialTab: 'anemiaIntel'})}>
          <View style={st.ayuIconWrap}><Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.white} /></View>
          <View style={{flex: 1}}><AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Anaemia</AppText><AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginTop: vs(1)}}>Iron deficiency - B12 - Condition impact</AppText></View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color="rgba(255,255,255,0.6)" />
        </TouchableOpacity>
      </View>

      <View style={{paddingHorizontal: s(6)}}>
        {activeFilter === 'all' && (
          <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
            <View style={[st.summaryCard, {flex: 1, backgroundColor: Colors.redBg, borderColor: '#FBBCBC'}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Latest Hb</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.red}}>11.8</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>g/dL - Mild</AppText></View>
            <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Target Hb</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.primary}}>{'\u2265'}12.0</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>g/dL normal</AppText></View>
            <View style={[st.summaryCard, {flex: 1, backgroundColor: Colors.redBg, borderColor: '#FBBCBC'}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Ferritin</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.red}}>8 {'\u03BC'}g/L</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Low ({'<'}15)</AppText></View>
          </View>
        )}
        {activeFilter === 'eye' && (
          <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
            <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Eye scans</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.primary}}>3</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>last 90 days</AppText></View>
            <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Avg accuracy</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.primary}}>{'\u00B1'}0.4</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>vs lab Hb</AppText></View>
          </View>
        )}

        {/* Lab results - special layout with CBC table */}
        {activeFilter === 'lab' && (
          <View>
            <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
              <View style={[st.summaryCard, {flex: 1, backgroundColor: Colors.redBg, borderColor: '#FBBCBC'}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Latest Hb (lab)</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.red}}>11.8 g/dL</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>10 Jan 2026</AppText></View>
              <View style={[st.summaryCard, {flex: 1}]}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Labs on record</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.primary}}>4</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Sep 2024 - Jan 2026</AppText></View>
            </View>

            {/* Full CBC table */}
            <View style={[st.summaryCard, {padding: 0, alignItems: 'stretch', marginBottom: vs(10), overflow: 'hidden'}]}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: s(13), paddingVertical: vs(10), borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'}}>
                <AppText style={{fontSize: ms(11), fontWeight: '700', color: Colors.textPrimary}}>CBC + Iron panel - 10 Jan 2026</AppText>
                <Pill text="Thyrocare" style="pm" />
              </View>
              {/* Table header */}
              <View style={{flexDirection: 'row', backgroundColor: Colors.background, paddingVertical: vs(7), paddingHorizontal: s(10)}}>
                <AppText style={{flex: 1, fontSize: ms(9), fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase'}}>Parameter</AppText>
                <AppText style={{flex: 0.8, fontSize: ms(9), fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', textAlign: 'center'}}>Value</AppText>
                <AppText style={{flex: 0.8, fontSize: ms(9), fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', textAlign: 'center'}}>Normal</AppText>
                <AppText style={{flex: 0.8, fontSize: ms(9), fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', textAlign: 'right'}}>Status</AppText>
              </View>
              {[
                {param: 'Haemoglobin', val: '11.8 g/dL', valColor: Colors.red, norm: '12.0-15.5', status: 'Low', statusStyle: 'pr'},
                {param: 'Haematocrit', val: '35.4%', valColor: Colors.red, norm: '36-46%', status: 'Low', statusStyle: 'pr'},
                {param: 'MCV', val: '74 fL', valColor: Colors.red, norm: '80-100', status: 'Micro', statusStyle: 'pr'},
                {param: 'Ferritin', val: '8 \u03BCg/L', valColor: Colors.red, norm: '15-200', status: 'Low', statusStyle: 'pr'},
                {param: 'Serum iron', val: '38 \u03BCg/dL', valColor: Colors.red, norm: '60-170', status: 'Low', statusStyle: 'pr'},
                {param: 'TIBC', val: '420 \u03BCg/dL', valColor: Colors.amber, norm: '250-370', status: 'High', statusStyle: 'pa'},
                {param: 'Vitamin B12', val: '312 pg/mL', valColor: Colors.amber, norm: '300-900', status: 'Borderline', statusStyle: 'pa'},
                {param: 'Folate', val: '10.2 ng/mL', valColor: Colors.primary, norm: '>4.0', status: 'Normal', statusStyle: 'pg'},
              ].map((row, i) => (
                <View key={i} style={{flexDirection: 'row', paddingVertical: vs(9), paddingHorizontal: s(10), borderBottomWidth: i < 7 ? 0.5 : 0, borderBottomColor: '#f0f4f2'}}>
                  <AppText style={{flex: 1, fontSize: ms(11), fontWeight: '600', color: Colors.textPrimary}}>{row.param}</AppText>
                  <AppText style={{flex: 0.8, fontSize: ms(11), fontWeight: '700', color: row.valColor, textAlign: 'center'}}>{row.val}</AppText>
                  <AppText style={{flex: 0.8, fontSize: ms(10), color: Colors.textSecondary, textAlign: 'center'}}>{row.norm}</AppText>
                  <View style={{flex: 0.8, alignItems: 'flex-end'}}><Pill text={row.status} style={row.statusStyle} /></View>
                </View>
              ))}
            </View>

            {/* Hb history table */}
            <View style={[st.summaryCard, {padding: 0, alignItems: 'stretch', overflow: 'hidden'}]}>
              <View style={{paddingHorizontal: s(13), paddingVertical: vs(10), borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'}}>
                <AppText style={{fontSize: ms(11), fontWeight: '700', color: Colors.textPrimary}}>Haemoglobin history - Lab readings only</AppText>
              </View>
              <View style={{flexDirection: 'row', backgroundColor: Colors.background, paddingVertical: vs(7), paddingHorizontal: s(13)}}>
                <AppText style={{flex: 2, fontSize: ms(9), fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase'}}>Date</AppText>
                <AppText style={{flex: 1, fontSize: ms(9), fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', textAlign: 'center'}}>Hb</AppText>
                <AppText style={{flex: 1, fontSize: ms(9), fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', textAlign: 'center'}}>Ferritin</AppText>
                <AppText style={{flex: 1, fontSize: ms(9), fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase', textAlign: 'center'}}>Source</AppText>
              </View>
              {[
                {date: '10 Jan 2026', hb: '11.8', ferritin: '8', ferritinColor: Colors.red, source: 'Thyrocare', highlight: true},
                {date: '10 Sep 2025', hb: '11.2', ferritin: '6', ferritinColor: Colors.red, source: 'Clinic', highlight: false},
                {date: '12 Mar 2025', hb: '11.0', ferritin: '\u2014', ferritinColor: Colors.textTertiary, source: 'Clinic', highlight: false},
                {date: '10 Sep 2024', hb: '10.6', ferritin: '4', ferritinColor: Colors.red, source: 'TrustLab', highlight: false},
              ].map((row, i) => (
                <View key={i} style={{flexDirection: 'row', paddingVertical: vs(9), paddingHorizontal: s(13), borderBottomWidth: i < 3 ? 0.5 : 0, borderBottomColor: '#f0f4f2', backgroundColor: row.highlight ? '#fafcfb' : 'transparent'}}>
                  <AppText style={{flex: 2, fontSize: ms(10), fontWeight: row.highlight ? '700' : '400', color: row.highlight ? Colors.primary : Colors.textSecondary}}>{row.date}</AppText>
                  <AppText style={{flex: 1, fontSize: ms(11), fontWeight: row.highlight ? '700' : '600', color: Colors.red, textAlign: 'center'}}>{row.hb}</AppText>
                  <AppText style={{flex: 1, fontSize: ms(10), color: row.ferritinColor, textAlign: 'center'}}>{row.ferritin}</AppText>
                  <AppText style={{flex: 1, fontSize: ms(9), color: Colors.textTertiary, textAlign: 'center'}}>{row.source}</AppText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* All and Eye reading rows */}
        {activeFilter !== 'lab' && readings.map((group, gi) => (
          <View key={gi}>
            <View style={st.dateGroup}><AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginRight: s(8)}}>{group.dateGroup}</AppText><View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} /></View>
            {group.items.map((item, ri) => <ReadingRow key={ri} item={item} />)}
          </View>
        ))}

        {activeFilter === 'eye' && (
          <View style={{backgroundColor: Colors.background, borderRadius: ms(12), padding: ms(11), marginTop: vs(4)}}>
            <AppText style={{fontSize: ms(10), color: Colors.textSecondary, lineHeight: ms(16)}}>Eye scans are a screening tool between lab tests. Accuracy depends on lighting, eyelid pull technique, and camera quality. Always confirm with a CBC if reading suggests worsening.</AppText>
          </View>
        )}

        {activeFilter === 'all' && (
          <View>
            <View style={st.secLabel}><AppText style={{fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: Colors.textSecondary, marginRight: s(8)}}>Hb trend - Sep 2024 to Mar 2026</AppText><View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} /></View>
            <View style={[st.summaryCard, {padding: ms(13), alignItems: 'stretch'}]}>
              <View style={{flexDirection: 'row', gap: s(5), height: vs(70), position: 'relative'}}>
                <View style={{position: 'absolute', bottom: '57%', left: 0, right: 0, borderTopWidth: 1.5, borderStyle: 'dashed', borderTopColor: 'rgba(127,29,29,0.4)'}} />
                <BarCol topLabel="10.6" topColor={Colors.red} height={vs(30)} barColor={Colors.red} bottomLabel="Sep'24" />
                <BarCol topLabel="11.0" topColor={Colors.amber} height={vs(42)} barColor={Colors.amber} bottomLabel="Mar'25" />
                <BarCol topLabel="11.2" topColor={Colors.amber} height={vs(48)} barColor={Colors.amber} bottomLabel="Sep'25" />
                <BarCol topLabel="11.8" topColor={Colors.amber} height={vs(58)} barColor={Colors.amber} bottomLabel="Jan'26" />
                <BarCol topLabel="11.4" topColor={Colors.amber} height={vs(50)} barColor={Colors.amber} bottomLabel="Mar'26" />
              </View>
              <AppText style={{fontSize: ms(9), color: Colors.textTertiary, textAlign: 'center', marginTop: vs(6)}}>Dashed = 12.0 g/dL normal threshold - Last = eye scan estimate</AppText>
              <View style={{backgroundColor: Colors.tealBg, borderRadius: ms(8), padding: ms(7), marginTop: vs(8)}}>
                <AppText style={{fontSize: ms(10), color: Colors.tealText, lineHeight: ms(16)}}>Improving - Hb rose from 10.6 to 11.8 with iron supplementation. Target: 12.0 g/dL in ~3-4 months.</AppText>
              </View>
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
  ayuBtn: {flexDirection: 'row', alignItems: 'center', gap: s(8), backgroundColor: Colors.accent, borderRadius: ms(12), padding: ms(12)},
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

export default AnemiaRecordsTab;
