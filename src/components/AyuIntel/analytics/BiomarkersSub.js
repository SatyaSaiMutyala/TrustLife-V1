import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import AppText from '../../shared/AppText';
import {
  HeroCard,
  StatStrip,
  SectionLabel,
  AnCard,
  BarChart,
  ProgressRow,
  InsightBox,
  HeatCell,
} from './components';

const BiomarkersSub = () => (
  <View>
    <HeroCard
      bigNumber="72"
      bigUnit="/100"
      bigLabel="Health Progression Score · Mar 2026"
      kpis={[
        {value: '11', label: 'Tracked biomarkers'},
        {value: '55', label: 'Total readings'},
        {value: '6', label: '⚠ Abnormal'},
        {value: '4', label: '↑ Improving'},
      ]}
      chips={[
        {text: 'HbA1c worsening 3 consecutive tests — 7.2%→7.8% over 12 months', bg: 'rgba(220,38,38,0.22)', color: '#FCA5A5'},
        {text: 'LDL declining on Atorvastatin: 145→118 over 2.5 years', bg: 'rgba(13,148,136,0.22)', color: '#5EEAD4'},
        {text: 'Vit D deficient across all 4 readings — never in normal range', bg: 'rgba(217,119,6,0.22)', color: '#FCD34D'},
      ]}
    />

    <StatStrip items={[
      {label: "HPS Q4 '24", value: '69', sub: 'last quarter', color: '#D97706'},
      {label: "HPS Q1 '25", value: '72', sub: 'current +3', color: '#0D9488'},
      {label: 'Flags raised', value: '7', sub: 'this quarter', color: '#DC2626'},
      {label: 'Normal', value: '5', sub: 'of 11 biomarkers', color: '#16A34A'},
      {label: 'Readings/yr', value: '22', sub: 'avg tests/year', color: '#7C3AED'},
    ]} />

    <SectionLabel text="Behaviour Analytics" />

    <AnCard title="Marker Status Evolution" subtitle="Status change across all 5 readings — trend and latest value">
      <View style={{gap: vs(4)}}>
        {[
          {name: 'HbA1c',      vals: ['h','h','h','h','h'], trend: '↗ Worsening', tc: '#DC2626', latest: '7.8%'},
          {name: 'FBG',         vals: ['h','h','h','h','h'], trend: '→ Flat',      tc: '#D97706', latest: '126'},
          {name: 'LDL',         vals: [null,'h','h','h','h'], trend: '↘ Improving', tc: '#16A34A', latest: '118'},
          {name: 'TG',          vals: [null,'h','h','h','h'], trend: '→ Flat',      tc: '#D97706', latest: '162'},
          {name: 'HDL',         vals: [null,'n','n','n','n'], trend: '→ Stable',    tc: '#16A34A', latest: '52'},
          {name: 'Hb',          vals: ['l','l','l','l','l'], trend: '→ Flat',      tc: '#D97706', latest: '11.8'},
          {name: 'Vit D',       vals: ['l',null,'l','l','l'], trend: '↗ Improving', tc: '#16A34A', latest: '18'},
          {name: 'B12',         vals: [null,null,'n','n','n'], trend: '→ Good',     tc: '#16A34A', latest: '312'},
          {name: 'TSH',         vals: [null,'n','n','n','n'], trend: '→ Stable',    tc: '#16A34A', latest: '2.8'},
          {name: 'eGFR',        vals: [null,null,'n','n','n'], trend: '→ Stable',   tc: '#16A34A', latest: '72'},
          {name: 'Microalb.',   vals: [null,null,'n','n','n'], trend: '→ Stable',   tc: '#16A34A', latest: '18'},
        ].map((m, i) => {
          const evoC = {n: '#16A34A', h: '#DC2626', l: '#D97706'};
          return (
            <View key={i} style={{flexDirection: 'row', alignItems: 'center', gap: s(4), paddingVertical: vs(3), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F8FAFC'}}>
              <AppText variant="small" color="#334155" style={{fontWeight: '700', minWidth: s(60)}}>{m.name}</AppText>
              <View style={{flexDirection: 'row', gap: s(3), flex: 1}}>
                {m.vals.map((v, j) => {
                  const bg = v ? evoC[v] + '22' : '#F1F5F9';
                  const bd = v ? evoC[v] + '88' : '#E2E8F0';
                  const tx = v ? evoC[v] : '#CBD5E1';
                  return (
                    <View key={j} style={{width: ms(26), height: ms(26), borderRadius: ms(5), backgroundColor: bg, borderWidth: 1.5, borderColor: bd, alignItems: 'center', justifyContent: 'center'}}>
                      <AppText variant="subtext" color={tx} style={{fontWeight: '800', fontSize: Fonts.sizes.caption}}>{v ? {n:'N',h:'H',l:'L'}[v] : '·'}</AppText>
                    </View>
                  );
                })}
              </View>
              <AppText variant="subtext" color={m.tc} style={{fontWeight: '700', minWidth: s(72), textAlign: 'right'}}>{m.trend}</AppText>
              <AppText variant="subtext" color="#888" style={{minWidth: s(30), textAlign: 'right', fontFamily: 'monospace'}}>{m.latest}</AppText>
            </View>
          );
        })}
        <View style={{flexDirection: 'row', gap: s(10), marginTop: vs(8), flexWrap: 'wrap'}}>
          {[
            {bg: '#FEE2E2', bd: '#EF4444', label: 'H — High'},
            {bg: '#FEF3C7', bd: '#F59E0B', label: 'L — Low'},
            {bg: '#DCFCE7', bd: '#22C55E', label: 'N — Normal'},
            {bg: '#F8FAFC', bd: '#CBD5E1', label: '· — Not tested', dashed: true},
          ].map((l, i) => (
            <View key={i} style={{flexDirection: 'row', alignItems: 'center', gap: s(5)}}>
              <View style={{width: ms(12), height: ms(12), borderRadius: ms(3), backgroundColor: l.bg, borderWidth: 1.5, borderColor: l.bd, borderStyle: l.dashed ? 'dashed' : 'solid'}} />
              <AppText variant="subtext" color="#334155">{l.label}</AppText>
            </View>
          ))}
        </View>
      </View>
    </AnCard>

    <AnCard title="Test-Seeking Behaviour" subtitle="What triggers a lab session">
      <ProgressRow label="Doctor-ordered (follow-up)" pct={100} value="7 sessions" color="#0D9488" />
      <ProgressRow label="Doctor-ordered (new symptom)" pct={29} value="2 sessions" color="#7C3AED" />
      <ProgressRow label="Self-initiated (annual check)" pct={14} value="1 session" color="#1D4ED8" />
      <ProgressRow label="Self-initiated (concern)" pct={14} value="1 session" color="#94A3B8" />
    </AnCard>

    <SectionLabel text="Spend Analytics" />

    <AnCard title="HPS Trend · Quarterly" subtitle="Health Progression Score over 6 quarters">
      <BarChart
        maxVal={100}
        bars={[
          {label: "Q1'24", topLabel: '65', value: 65, color: '#D97706'},
          {label: "Q2'24", topLabel: '68', value: 68, color: '#D97706'},
          {label: "Q3'24", topLabel: '70', value: 70, color: '#0D9488'},
          {label: "Q4'24", topLabel: '69', value: 69, color: '#0D9488'},
          {label: "Q1'25", topLabel: '72', value: 72, color: '#0D9488'},
        ]}
      />
      <InsightBox>
        HPS improved from 65 (Q1 2024) to 72 (Q1 2025) — a +7 point gain over 12 months, primarily from Velocity improvements (Metformin 1000mg, B12 supplement, Vit D). The Stability dimension remains the weakest at 24/35.
      </InsightBox>
    </AnCard>

    <AnCard title="Biomarker HPS Ranking" subtitle="All 11 biomarkers scored lowest to highest">
      <ProgressRow label="Vit D" pct={48} value="48" color="#DC2626" />
      <ProgressRow label="HbA1c" pct={52} value="52" color="#DC2626" />
      <ProgressRow label="FBG" pct={58} value="58" color="#D97706" />
      <ProgressRow label="TG" pct={60} value="60" color="#D97706" />
      <ProgressRow label="LDL" pct={62} value="62" color="#D97706" />
      <ProgressRow label="Hb" pct={72} value="72" color="#D97706" />
      <ProgressRow label="B12" pct={78} value="78" color="#0D9488" />
      <ProgressRow label="eGFR" pct={80} value="80" color="#0D9488" />
      <ProgressRow label="HDL" pct={90} value="90" color="#16A34A" />
      <ProgressRow label="Microalb." pct={94} value="94" color="#16A34A" />
      <ProgressRow label="TSH" pct={95} value="95" color="#16A34A" />
    </AnCard>

    <AnCard title="Marker Evolution Heat Map" subtitle="Status per reading session — N=Normal H=High L=Low">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(4)}}>
            <View style={{minWidth: s(68)}} />
            {["Oct'23","Apr'24","Sep'24","Jan'25","Mar'26"].map(h => (
              <AppText key={h} variant="subtext" color={Colors.textTertiary} style={{width: ms(32), textAlign: 'center', fontWeight: '600', fontSize: Fonts.sizes.xs}}>{h}</AppText>
            ))}
          </View>
          {[
            {name:'HbA1c',     vals:['h','h','h','h','h']},
            {name:'FBG',       vals:['h','h','h','h','h']},
            {name:'LDL',       vals:[null,'h','h','h','h']},
            {name:'TG',        vals:[null,'h','h','h','h']},
            {name:'HDL',       vals:[null,'n','n','n','n']},
            {name:'Hb',        vals:['l','l','l','l','l']},
            {name:'Vit D',     vals:['l',null,'l','l','l']},
            {name:'B12',       vals:[null,null,'n','n','n']},
            {name:'TSH',       vals:[null,'n','n','n','n']},
            {name:'eGFR',      vals:[null,null,'n','n','n']},
            {name:'Microalb.', vals:[null,null,'n','n','n']},
          ].map((row, i) => (
            <View key={i} style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(4)}}>
              <AppText variant="small" color="#334155" style={{minWidth: s(68), fontWeight: '600'}}>{row.name}</AppText>
              {row.vals.map((v, j) => {
                const cfg = v === 'h' ? {bg:'#FEE2E2',bd:'#EF4444',tx:'#DC2626',l:'H'}
                          : v === 'l' ? {bg:'#FEF3C7',bd:'#F59E0B',tx:'#D97706',l:'L'}
                          : v === 'n' ? {bg:'#DCFCE7',bd:'#22C55E',tx:'#16A34A',l:'N'}
                          : {bg:'#F8FAFC',bd:'#E2E8F0',tx:'#CBD5E1',l:'·'};
                return (
                  <View key={j} style={{width: ms(28), height: ms(28), marginHorizontal: s(2)}}>
                    <HeatCell letter={cfg.l} bg={cfg.bg} borderColor={cfg.bd} textColor={cfg.tx} dashed={!v} />
                  </View>
                );
              })}
            </View>
          ))}
          <View style={{flexDirection: 'row', gap: s(10), marginTop: vs(8), flexWrap: 'wrap'}}>
            {[
              {bg:'#FEE2E2',bd:'#EF4444',label:'H — High'},
              {bg:'#FEF3C7',bd:'#F59E0B',label:'L — Low'},
              {bg:'#DCFCE7',bd:'#22C55E',label:'N — Normal'},
              {bg:'#F8FAFC',bd:'#CBD5E1',label:'· — Not tested'},
            ].map((l,i) => (
              <View key={i} style={{flexDirection:'row',alignItems:'center',gap:s(5)}}>
                <View style={{width:ms(12),height:ms(12),borderRadius:ms(3),backgroundColor:l.bg,borderWidth:1.5,borderColor:l.bd}} />
                <AppText variant="subtext" color="#334155">{l.label}</AppText>
              </View>
            ))}
          </View>
        </View>
      </ScrollView>
    </AnCard>

    <AnCard title="Flag History · Quarterly" subtitle="Number of abnormal readings raised per quarter">
      <BarChart
        maxVal={10}
        bars={[
          {label: "Q1'24", topLabel: '8', value: 8, color: '#DC2626'},
          {label: "Q2'24", topLabel: '7', value: 7, color: '#D97706'},
          {label: "Q3'24", topLabel: '8', value: 8, color: '#DC2626'},
          {label: "Q4'24", topLabel: '9', value: 9, color: '#DC2626'},
          {label: "Q1'25", topLabel: '7', value: 7, color: '#D97706'},
        ]}
      />
    </AnCard>

    <AnCard title="Score Dimensions · Trend" subtitle="Status · Stability · Velocity over 5 quarters">
      <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: s(6), height: vs(90), marginTop: vs(4)}}>
        {[
          {lbl:"Q1'24",st:22,stab:20,vel:23},
          {lbl:"Q2'24",st:23,stab:21,vel:24},
          {lbl:"Q3'24",st:24,stab:22,vel:24},
          {lbl:"Q4'24",st:24,stab:22,vel:23},
          {lbl:"Q1'25",st:26,stab:24,vel:22},
        ].map((d, i) => (
          <View key={i} style={{flex: 1, alignItems: 'center'}}>
            <View style={{flexDirection: 'row', gap: s(1), width: '100%', height: vs(65), alignItems: 'flex-end'}}>
              <View style={{flex: 1, backgroundColor: '#5EEAD488', borderRadius: ms(2), height: Math.round((d.st / 40) * vs(60))}} />
              <View style={{flex: 1, backgroundColor: '#A78BFA88', borderRadius: ms(2), height: Math.round((d.stab / 35) * vs(60))}} />
              <View style={{flex: 1, backgroundColor: '#60A5FA88', borderRadius: ms(2), height: Math.round((d.vel / 25) * vs(60))}} />
            </View>
            <AppText variant="subtext" color={Colors.textTertiary} style={{fontSize: Fonts.sizes.xs, textAlign: 'center', marginTop: vs(3)}}>{d.lbl}</AppText>
          </View>
        ))}
      </View>
      <View style={{flexDirection: 'row', gap: s(12), marginTop: vs(8)}}>
        {[{c:'#5EEAD4',l:'Status /40'},{c:'#A78BFA',l:'Stability /35'},{c:'#60A5FA',l:'Velocity /25'}].map((l,i) => (
          <View key={i} style={{flexDirection:'row',alignItems:'center',gap:s(4)}}>
            <View style={{width:ms(8),height:ms(8),borderRadius:ms(4),backgroundColor:l.c}} />
            <AppText variant="subtext" color={Colors.textTertiary}>{l.l}</AppText>
          </View>
        ))}
      </View>
    </AnCard>
  </View>
);

export default BiomarkersSub;
