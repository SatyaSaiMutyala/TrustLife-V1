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
  InsightBullet,
  BarChart,
  ProgressRow,
  InsightBox,
  TableRow,
  GanttBar,
  NumberedAction,
} from './components';

const MedicationsSub = () => (
  <View>
    <HeroCard
      bigNumber="₹1.48"
      bigUnit="L"
      bigLabel="Total medication spend · Jan 2021 – Mar 2026"
      kpis={[
        {value: '₹2,274', label: 'Monthly (current)'},
        {value: '₹27.3K', label: '2025 annualised'},
        {value: '6', label: 'Active medications'},
        {value: '78%', label: 'Overall adherence'},
      ]}
      chips={[
        {text: '↑ 4.6× medication spend since 2021 — ₹495/mo to ₹2,274/mo as conditions added', bg: 'rgba(220,38,38,0.22)', color: '#FCA5A5'},
        {text: 'All generic medications — saving ~₹2,400/mo vs branded equivalents', bg: 'rgba(13,148,136,0.22)', color: '#5EEAD4'},
        {text: 'PM Metformin adherence 58% — the most impactful missed-dose pattern', bg: 'rgba(124,58,237,0.22)', color: '#C4B5FD'},
      ]}
    />

    <StatStrip items={[
      {label: '2021 monthly', value: '₹495', sub: 'Metformin only', color: '#0D9488'},
      {label: '2024 monthly', value: '₹1,395', sub: '3 medications', color: '#1D4ED8'},
      {label: '2026 monthly', value: '₹2,274', sub: '6 medications', color: '#DC2626'},
      {label: 'Generic savings', value: '₹2.4K', sub: 'vs branded/mo', color: '#16A34A'},
      {label: 'Lifetime savings', value: '₹48K', sub: 'generic advantage', color: '#7C3AED'},
    ]} />

    <SectionLabel text="Behaviour Analytics" />

    <AnCard title="PM Metformin Miss Pattern" subtitle="Missed doses by day of week · March 2026">
      <BarChart
        maxVal={4}
        bars={[
          {label: 'Mon', topLabel: '3', value: 3, color: '#DC2626'},
          {label: 'Tue', topLabel: '1', value: 1, color: '#D97706'},
          {label: 'Wed', topLabel: '2', value: 2, color: '#DC2626'},
          {label: 'Thu', topLabel: '1', value: 1, color: '#D97706'},
          {label: 'Fri', topLabel: '2', value: 2, color: '#DC2626'},
          {label: 'Sat', topLabel: '2', value: 2, color: '#DC2626'},
          {label: 'Sun', topLabel: '2', value: 2, color: '#DC2626'},
        ]}
      />
      <InsightBox>
        10 of 13 misses on nights with sleep onset after midnight. Set a 9 PM alarm — each dose taken = −12 mg/dL next-morning FBG.
      </InsightBox>
    </AnCard>

    <AnCard title="Medication Streak Analysis" subtitle="Consecutive adherent days · March 2026">
      <ProgressRow label="Amlodipine 5mg" pct={100} value="31 days ✓" color="#0D9488" />
      <ProgressRow label="Metformin AM" pct={94} value="29 days" color="#0D9488" />
      <ProgressRow label="Olmesartan 20mg" pct={87} value="27 days" color="#7C3AED" />
      <ProgressRow label="Atorvastatin 10mg" pct={81} value="25 days" color="#1D4ED8" />
      <ProgressRow label="Methylcobalamin" pct={65} value="20 days" color="#16A34A" />
      <ProgressRow label="Metformin PM" pct={13} value="4 days ⚠" color="#DC2626" />
    </AnCard>

    <AnCard title="Priority Medication Actions" subtitle="Ranked by expected clinical impact">
      <NumberedAction num={1} title="Set 9 PM PM Metformin alarm" desc="13 misses in March. Each miss = +12 mg/dL FBG next morning. This single action has the highest clinical ROI of any behaviour change." due="Tonight" color="#DC2626" />
      <NumberedAction num={2} title="Place medications beside dinner plate" desc="Visual cue removes the need to remember. Laying out evening meds before sitting down achieves near-100% adherence in behaviour studies." due="Today" color="#D97706" />
      <NumberedAction num={3} title="Add Methylcobalamin to evening organiser" desc="5 misses in March delaying B12 repletion and foot tingling improvement. One organiser, one action." due="Today" color="#16A34A" />
    </AnCard>

    <SectionLabel text="Spend Analytics" />

    <AnCard title="Adherence Heatmap · March 2026" subtitle="Last 30 days · 🟢 Taken  🟡 Late/Partial  🔴 Missed">
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{gap: vs(4)}}>
          {[
            {name: 'Metformin AM',   data: 'gggggggggggggggggggggggggggggg'},
            {name: 'Metformin PM',   data: 'gggaggggrgggaggggggrggagggggrgg'},
            {name: 'Amlodipine',     data: 'gggggggggggggggggggggggggggggg'},
            {name: 'Olmesartan',     data: 'ggggaggggggggggggagggggggggggg'},
            {name: 'Atorvastatin',   data: 'gggggggggggggggggggggggggagggg'},
            {name: 'Methylcobalamn', data: 'ggggaggggggggargggggaggggg'},
          ].map((d, i) => (
            <View key={i} style={{flexDirection: 'row', alignItems: 'center', gap: s(4)}}>
              <AppText variant="subtext" color={Colors.textTertiary} style={{minWidth: s(86), fontWeight: '600'}}>{d.name}</AppText>
              <View style={{flexDirection: 'row', gap: s(2)}}>
                {d.data.split('').slice(0, 30).map((c, j) => {
                  const bg = c === 'g' ? '#16A34A' : c === 'a' ? '#D97706' : '#DC2626';
                  return (
                    <View key={j} style={{width: ms(9), height: ms(9), borderRadius: ms(2), backgroundColor: bg + '55', borderWidth: 1, borderColor: bg + '88'}} />
                  );
                })}
              </View>
            </View>
          ))}
        </View>
      </ScrollView>
    </AnCard>

    <AnCard title="Monthly Medication Spend" subtitle="Pharmacy cost trajectory since Jan 2021">
      <BarChart
        scrollable
        barWidth={s(12)}
        maxVal={2400}
        height={85}
        bars={[
          {label: "'21", value: 495, color: '#0D9488', dim: true},
          {label: '', value: 495, color: '#0D9488', dim: true},
          {label: '', value: 495, color: '#0D9488', dim: true},
          {label: '', value: 495, color: '#0D9488', dim: true},
          {label: "'22", value: 495, color: '#0D9488', dim: true},
          {label: '', value: 495, color: '#0D9488', dim: true},
          {label: '', value: 495, color: '#0D9488', dim: true},
          {label: '', value: 495, color: '#0D9488', dim: true},
          {label: "'23", value: 495, color: '#0D9488', dim: true},
          {label: '', value: 495, color: '#0D9488', dim: true},
          {label: '', value: 495, color: '#0D9488', dim: true},
          {label: '', value: 495, color: '#0D9488', dim: true},
          {label: "J'24", value: 735, color: '#1D4ED8'},
          {label: '', value: 735, color: '#1D4ED8'},
          {label: '', value: 735, color: '#1D4ED8'},
          {label: '', value: 735, color: '#1D4ED8'},
          {label: '', value: 735, color: '#1D4ED8'},
          {label: '', value: 735, color: '#1D4ED8'},
          {label: 'J', value: 1395, color: '#7C3AED'},
          {label: '', value: 1395, color: '#7C3AED'},
          {label: '', value: 1395, color: '#7C3AED'},
          {label: '', value: 1395, color: '#7C3AED'},
          {label: '', value: 1395, color: '#7C3AED'},
          {label: '', value: 1395, color: '#7C3AED'},
          {label: "J'25", value: 1779, color: '#D97706'},
          {label: '', value: 1779, color: '#D97706'},
          {label: '', value: 1779, color: '#D97706'},
          {label: "J'26", value: 2274, color: '#DC2626'},
          {label: '', value: 2274, color: '#DC2626'},
          {label: 'M', value: 2274, color: '#DC2626'},
        ]}
      />
    </AnCard>

    <AnCard title="Current Spend by Medication" subtitle="Monthly cost breakdown · ₹2,274 total">
      <ProgressRow label="Metformin 1000mg BD" pct={44} value="₹990" color="#0D9488" />
      <ProgressRow label="Olmesartan 20mg" pct={17} value="₹384" color="#7C3AED" />
      <ProgressRow label="Atorvastatin 10mg" pct={14} value="₹330" color="#1D4ED8" />
      <ProgressRow label="Amlodipine 5mg" pct={11} value="₹240" color="#0891B2" />
      <ProgressRow label="Methylcobalamin" pct={8} value="₹180" color="#16A34A" />
      <ProgressRow label="Cholecalciferol" pct={6} value="₹150" color="#D97706" />
    </AnCard>

    <AnCard title="Medication Timeline" subtitle="When each drug was started and duration">
      <View style={{marginTop: vs(4)}}>
        <GanttBar label="Metformin" startPct={0} widthPct={100} color="#0D9488" duration="63mo" />
        <GanttBar label="Amlodipine" startPct={57} widthPct={43} color="#1D4ED8" duration="27mo" />
        <GanttBar label="Atorvastatin" startPct={67} widthPct={33} color="#7C3AED" duration="21mo" />
        <GanttBar label="Olmesartan" startPct={95} widthPct={5} color="#0891B2" duration="3mo" />
        <GanttBar label="Methylcobal." startPct={98} widthPct={2} color="#16A34A" duration="1mo" />
        <GanttBar label="Cholecalciferol" startPct={95} widthPct={5} color="#D97706" duration="3mo" />
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(6)}}>
          {["Jan '21","Jan '22","Jan '23","Jan '24","Jan '25","Mar '26"].map(l => (
            <AppText key={l} variant="subtext" color={Colors.textTertiary} style={{fontSize: Fonts.sizes.xs}}>{l}</AppText>
          ))}
        </View>
      </View>
    </AnCard>

    <AnCard title="Generic vs Branded Savings" subtitle="What Priya pays vs branded equivalent monthly">
      <TableRow isHeader cells={['Medication', 'Generic', 'Branded', 'Saving']} />
      <TableRow cells={['Metformin 1000mg', '₹16.5/tab', '₹55/tab', '₹1,425']} />
      <TableRow cells={['Amlodipine 5mg', '₹8/tab', '₹24/tab', '₹480']} />
      <TableRow cells={['Atorvastatin 10mg', '₹11/tab', '₹62/tab', '₹1,530']} />
      <TableRow cells={['Olmesartan 20mg', '₹12.8/tab', '₹48/tab', '₹1,056']} />
      <TableRow cells={['Methylcobalamin', '₹6/tab', '₹22/tab', '₹480']} />
      <TableRow cells={['Cholecalciferol', '₹37.5/cap', '₹95/cap', '₹232']} />
      <View style={{borderTopWidth: 1, borderTopColor: '#E2E8F0', marginTop: vs(4), paddingTop: vs(6), flexDirection: 'row', justifyContent: 'space-between'}}>
        <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '700'}}>Monthly total savings</AppText>
        <AppText variant="small" color="#16A34A" style={{fontWeight: '700'}}>₹5,203</AppText>
      </View>
      <InsightBox>
        Choosing generics saves ₹2,406/month (₹28,872/year). All 6 of Priya's current prescriptions are generic — maintain this at every refill. Ask pharmacist to always dispense generic when multiple brands available.
      </InsightBox>
    </AnCard>

    <AnCard title="Per-Dose Cost" subtitle="Unit economics — cost per tablet / capsule">
      <ProgressRow label="Cholecalciferol" pct={100} value="₹37.5" color="#D97706" />
      <ProgressRow label="Olmesartan" pct={34} value="₹12.8" color="#7C3AED" />
      <ProgressRow label="Atorvastatin" pct={29} value="₹11" color="#1D4ED8" />
      <ProgressRow label="Metformin" pct={22} value="₹8.25" color="#0D9488" />
      <ProgressRow label="Amlodipine" pct={21} value="₹8" color="#0891B2" />
      <ProgressRow label="Methylcobalamin" pct={16} value="₹6" color="#16A34A" />
    </AnCard>
  </View>
);

export default MedicationsSub;
