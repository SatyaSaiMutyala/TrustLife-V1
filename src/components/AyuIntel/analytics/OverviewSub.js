import React from 'react';
import {View} from 'react-native';
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
  BenchmarkCell,
  st,
} from './components';

const OverviewSub = () => (
  <View>
    <HeroCard
      bigNumber="₹3.6"
      bigUnit="L"
      bigLabel="Total health investment · Jan 2021 – Mar 2026"
      kpis={[
        {value: '₹6,100', label: 'Monthly avg'},
        {value: '₹19.2K', label: '2025 YTD (Q1)'},
        {value: '3', label: 'Active conditions'},
        {value: '6', label: 'Active meds'},
      ]}
      chips={[
        {text: '↑ 3.2× spend increase since 2021 — HTN and dyslipidaemia added in 2024–26', bg: 'rgba(220,38,38,0.22)', color: '#FCA5A5'},
        {text: 'Pharmacy = 41% of total spend · ₹1.48L all-time', bg: 'rgba(13,148,136,0.22)', color: '#5EEAD4'},
        {text: '₹0 insurance coverage — 100% out-of-pocket', bg: 'rgba(29,78,216,0.22)', color: '#93C5FD'},
      ]}
    />

    <StatStrip items={[
      {label: '2025 YTD', value: '₹19.2K', sub: 'Q1 · 3 months', color: '#DC2626'},
      {label: 'Full Year 2024', value: '₹68.4K', sub: 'New meds added', color: '#0D9488'},
      {label: 'Full Year 2023', value: '₹38.2K', sub: 'T2DM + labs peak', color: '#7C3AED'},
      {label: 'Highest Month', value: '₹8,400', sub: 'Jan 2025 (Echo)', color: '#D97706'},
      {label: 'Lowest Month', value: '₹1,200', sub: 'Early 2021', color: '#16A34A'},
    ]} />

    <SectionLabel text="Behavioural Insights" />

    <AnCard title="Cross-Domain Behaviour Patterns" subtitle="Ayu-detected patterns across medication, sleep, activity and labs" style={{backgroundColor: '#F0FDFA', borderColor: 'rgba(13,148,136,0.2)'}}>
      <View style={{gap: vs(6)}}>
        <InsightBullet color="#DC2626" bg="rgba(220,38,38,0.07)">
          <AppText variant="small" color="#DC2626" style={{fontWeight: '700'}}>PM Metformin miss cascade: </AppText>
          <AppText variant="small" color="#DC2626">Late bedtime after midnight predicts a PM miss with 77% accuracy. Miss drives +12 mg/dL FBG the next morning, which raises cortisol, disrupts sleep, and increases the chance of another miss — a 3-step loop.</AppText>
        </InsightBullet>
        <InsightBullet color="#0D9488" bg="rgba(13,148,136,0.07)">
          <AppText variant="small" color="#0D9488" style={{fontWeight: '700'}}>Symptom-invisible screening gap: </AppText>
          <AppText variant="small" color="#0D9488">Priya completes 100% of tests tied to daily symptoms (glucose, HbA1c) and 0% of tests for asymptomatic conditions (eyes, teeth, iron). Perceived urgency, not clinical priority, drives compliance.</AppText>
        </InsightBullet>
        <InsightBullet color="#D97706" bg="rgba(217,119,6,0.07)">
          <AppText variant="small" color="#D97706" style={{fontWeight: '700'}}>Evening walk window: </AppText>
          <AppText variant="small" color="#D97706">Post-dinner walk done 9 of 31 March evenings. All 9 had below-average post-dinner glucose. The 22 evenings without a walk averaged 38 mg/dL higher — the single easiest high-ROI daily habit.</AppText>
        </InsightBullet>
        <InsightBullet color="#7C3AED" bg="rgba(124,58,237,0.07)">
          <AppText variant="small" color="#7C3AED" style={{fontWeight: '700'}}>Social jet lag: </AppText>
          <AppText variant="small" color="#7C3AED">Weekday bedtime avg 11:48 PM vs weekend 1:12 AM — a 1h 24min circadian shift every week. This disrupts cortisol rhythm, contributing to systematically higher FBG on Tuesdays.</AppText>
        </InsightBullet>
      </View>
    </AnCard>

    <SectionLabel text="Spend Analytics" />

    <AnCard title="Monthly Health Spend" subtitle="24-month rolling total across all categories">
      <BarChart
        scrollable
        barWidth={s(18)}
        maxVal={9000}
        height={85}
        bars={[
          {label: "J'24", value: 4800, color: '#0D9488', dim: true},
          {label: 'F', value: 5200, color: '#0D9488', dim: true},
          {label: 'M', value: 5200, color: '#0D9488', dim: true},
          {label: 'A', topLabel: '8K', value: 8000, color: '#D97706', dim: true},
          {label: 'M', value: 5200, color: '#0D9488', dim: true},
          {label: 'J', value: 5200, color: '#0D9488', dim: true},
          {label: 'J', value: 5200, color: '#0D9488', dim: true},
          {label: 'A', topLabel: '7.6K', value: 7600, color: '#D97706', dim: true},
          {label: 'S', value: 5200, color: '#0D9488', dim: true},
          {label: 'O', value: 5200, color: '#0D9488', dim: true},
          {label: 'N', value: 5200, color: '#0D9488', dim: true},
          {label: 'D', value: 5200, color: '#0D9488', dim: true},
          {label: "J'25", topLabel: '8.4K', value: 8400, color: '#DC2626'},
          {label: 'F', value: 6200, color: '#DC2626'},
          {label: 'M', value: 4600, color: '#DC2626'},
        ]}
      />
    </AnCard>

    <AnCard title="Spend by Category" subtitle="All-time allocation · ₹3.6L total">
      <ProgressRow label="Pharmacy" pct={41} value="₹1.48L" color="#0D9488" />
      <ProgressRow label="Consultations" pct={22} value="₹79.2K" color="#7C3AED" />
      <ProgressRow label="Lab Tests" pct={20} value="₹72K" color="#1D4ED8" />
      <ProgressRow label="Health Services" pct={10} value="₹36K" color="#D97706" />
      <ProgressRow label="Insurance" pct={7} value="₹25.2K" color="#EA580C" />
    </AnCard>

    <AnCard title="Year-over-Year Comparison" subtitle="Annual health investment trend">
      <BarChart
        maxVal={70000}
        bars={[
          {label: '2021', topLabel: '₹14.4K', value: 14400, color: '#94A3B8'},
          {label: '2022', topLabel: '₹22.8K', value: 22800, color: '#0D948888'},
          {label: '2023', topLabel: '₹38.4K', value: 38400, color: '#7C3AED'},
          {label: '2024', topLabel: '₹68.4K', value: 68400, color: '#0D9488'},
          {label: '2025', topLabel: '₹19.2K', value: 19200, color: '#DC2626'},
        ]}
      />
    </AnCard>

    <AnCard title="Financial Burden Analysis" subtitle="How costs are distributed and covered">
      <ProgressRow label="Out-of-pocket" pct={100} value="100%" color="#DC2626" />
      <ProgressRow label="Insurance covered" pct={0} value="₹0" color="#1D4ED8" />
      <ProgressRow label="Employer benefit" pct={0} value="None" color="#94A3B8" />
      <ProgressRow label="Tax savings (80D)" pct={7} value="₹7,800" color="#16A34A" />
      <InsightBox>
        {'100% out-of-pocket. No OPD consultation, medication, or lab bills have been covered by insurance. Priya\u2019s current policy likely covers only IPD admissions. Adding an OPD rider (₹3,000–5,000/yr) could offset ₹25,000–30,000 of annual health spend.'}
      </InsightBox>
    </AnCard>

    <AnCard title="Benchmarking" subtitle="Priya vs similar profiles (T2DM, female, 35–40, urban India)">
      <View style={st.benchGrid}>
        <BenchmarkCell label="Annual spend" value="₹76.8K" sub="2025 annualised" bg="rgba(13,148,136,0.1)" color="#0F766E" />
        <BenchmarkCell label="Peer median" value="₹62K" sub="Similar conditions" bg="#F1F5F9" color="#334155" />
        <BenchmarkCell label="Above median" value="+24%" sub="3 conditions vs avg 2" bg="rgba(217,119,6,0.1)" color="#D97706" />
        <BenchmarkCell label="Cost per dx" value="₹1.2L" sub="Per chronic condition" bg="rgba(29,78,216,0.1)" color="#1D4ED8" />
      </View>
    </AnCard>

    <AnCard title="Spend Insights" style={{backgroundColor: '#F0FDFA', borderColor: 'rgba(13,148,136,0.2)'}}>
      <InsightBullet color="#0F766E" bg="rgba(13,148,136,0.08)">
        <AppText variant="small" color="#0F766E"><AppText variant="small" color="#0F766E" style={{fontWeight: '700'}}>Pharmacy costs have grown 5× </AppText>since 2021 — from ₹495/mo (Metformin only) to ₹2,274/mo (6 medications). Each new condition diagnosis adds ~₹500–700/month of ongoing medication cost.</AppText>
      </InsightBullet>
      <InsightBullet color="#DC2626" bg="rgba(220,38,38,0.06)">
        <AppText variant="small" color="#DC2626"><AppText variant="small" color="#DC2626" style={{fontWeight: '700'}}>No health insurance claims filed ever. </AppText>With 3 chronic conditions, T2DM complications risk is rising. IPD cover for a diabetes-related hospitalisation in Hyderabad averages ₹80,000–1.5L.</AppText>
      </InsightBullet>
      <InsightBullet color="#1D4ED8" bg="rgba(29,78,216,0.06)">
        <AppText variant="small" color="#1D4ED8"><AppText variant="small" color="#1D4ED8" style={{fontWeight: '700'}}>Lab spend rising 28% year-on-year </AppText>— more biomarkers being tracked per session as conditions are added. Panel cost now ₹4,800/session vs ₹2,400 at baseline (Oct 2023).</AppText>
      </InsightBullet>
      <InsightBullet color="#D97706" bg="rgba(217,119,6,0.06)">
        <AppText variant="small" color="#D97706"><AppText variant="small" color="#D97706" style={{fontWeight: '700'}}>Projected 2025 spend: ₹76,800 </AppText>if current trajectory continues. A physiotherapy course completion (₹6,000) and retinal screening (₹1,200) will add ~₹7,200 to this.</AppText>
      </InsightBullet>
    </AnCard>
  </View>
);

export default OverviewSub;
