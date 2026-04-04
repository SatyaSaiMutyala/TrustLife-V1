import React from 'react';
import {View} from 'react-native';
import {scale as s, verticalScale as vs} from 'react-native-size-matters';
import {
  HeroCard,
  StatStrip,
  SectionLabel,
  AnCard,
  BarChart,
  ProgressRow,
  InsightBox,
} from './components';

const LabReportsSub = () => (
  <View>
    <HeroCard
      bigNumber="₹18.0"
      bigUnit="K"
      bigLabel="Total lab spend · 5 sessions · Oct 2023–Mar 2026"
      kpis={[
        {value: '5', label: 'Lab sessions'},
        {value: '₹3,600', label: 'Avg per session'},
        {value: '55', label: 'Total tests run'},
        {value: '₹327', label: 'Avg per test'},
      ]}
      chips={[
        {text: 'Session cost 2× since Oct 2023 — ₹2,400 to ₹4,800 as panel expanded', bg: 'rgba(220,38,38,0.22)', color: '#FCA5A5'},
        {text: 'Echo (₹1,800) added in Jan 2026 — single most expensive line item', bg: 'rgba(124,58,237,0.22)', color: '#C4B5FD'},
        {text: 'TrustLab is most cost-efficient provider at ₹285/test avg', bg: 'rgba(13,148,136,0.22)', color: '#5EEAD4'},
      ]}
    />

    <StatStrip items={[
      {label: 'Oct 2023', value: '₹2,400', sub: '6 tests · baseline', color: '#7C3AED'},
      {label: 'Apr 2024', value: '₹2,800', sub: '8 tests · lipids', color: '#1D4ED8'},
      {label: 'Sep 2024', value: '₹3,200', sub: '10 tests · kidney', color: '#D97706'},
      {label: 'Jan 2026', value: '₹4,800', sub: '13 tests + Echo', color: '#DC2626'},
      {label: 'Mar 2026', value: '₹4,800', sub: '13 tests · current', color: '#0D9488'},
    ]} />

    <SectionLabel text="Behaviour Analytics" />

    <AnCard title="Test Compliance" subtitle="Doctor-ordered tests — completed vs skipped">
      <ProgressRow label="Glycaemic panel" pct={100} value="5/5 ✓" color="#16A34A" />
      <ProgressRow label="Lipid profile" pct={80} value="4/5" color="#0D9488" />
      <ProgressRow label="Renal panel" pct={75} value="3/4" color="#D97706" />
      <ProgressRow label="Micronutrients" pct={67} value="4/6" color="#D97706" />
      <ProgressRow label="Eye screening" pct={0} value="0/5 ⚠" color="#DC2626" />
      <ProgressRow label="Iron panel" pct={0} value="Not done" color="#DC2626" />
      <InsightBox>
        Pattern: Glycaemic tests have 100% completion — perceived urgency is high. Eye and iron screening have 0% — both are asymptomatic with no daily symptom driving action.
      </InsightBox>
    </AnCard>

    <AnCard title="Order-to-Sample Lag" subtitle="Days between doctor order and sample collection">
      <BarChart
        maxVal={14}
        bars={[
          {label: 'HbA1c', topLabel: '1d', value: 1, color: '#16A34A'},
          {label: 'FBG', topLabel: '1d', value: 1, color: '#16A34A'},
          {label: 'CBC', topLabel: '2d', value: 2, color: '#16A34A'},
          {label: 'Lipid', topLabel: '7d', value: 7, color: '#D97706'},
          {label: 'Kidney', topLabel: '5d', value: 5, color: '#D97706'},
          {label: 'TSH', topLabel: '3d', value: 3, color: '#0D9488'},
          {label: 'Vit D', topLabel: '12d', value: 12, color: '#DC2626'},
          {label: 'B12', topLabel: '10d', value: 10, color: '#DC2626'},
          {label: 'MAlb', topLabel: '6d', value: 6, color: '#D97706'},
        ]}
      />
      <InsightBox>
        HbA1c done same or next day. Vitamin tests average 12 days lag. Target: all ordered tests within 3 days of doctor visit.
      </InsightBox>
    </AnCard>

    <SectionLabel text="Spend Analytics" />

    <AnCard title="Session Cost Growth" subtitle="Cost per lab session as panel expanded">
      <BarChart
        maxVal={5000}
        bars={[
          {label: "Oct'23", topLabel: '₹2.4K', value: 2400, color: '#7C3AED'},
          {label: "Apr'24", topLabel: '₹2.8K', value: 2800, color: '#1D4ED8'},
          {label: "Sep'24", topLabel: '₹3.2K', value: 3200, color: '#D97706'},
          {label: "Jan'26", topLabel: '₹4.8K', value: 4800, color: '#DC2626'},
          {label: "Mar'26", topLabel: '₹4.8K', value: 4800, color: '#0D9488'},
        ]}
      />
    </AnCard>

    <AnCard title="Provider Comparison" subtitle="Cost-efficiency per lab provider">
      <ProgressRow label="TrustLab" pct={100} value="₹285/test" color="#0D9488" />
      <ProgressRow label="Apollo Diagnostics" pct={73} value="₹525/test" color="#DC2626" />
      <ProgressRow label="Thyrocare" pct={61} value="₹175/test" color="#16A34A" />
    </AnCard>

    <AnCard title="Most Expensive Tests" subtitle="Cost per individual biomarker test">
      <ProgressRow label="Echocardiogram" pct={100} value="₹1,800" color="#7C3AED" />
      <ProgressRow label="Vitamin D3" pct={56} value="₹1,000" color="#D97706" />
      <ProgressRow label="HbA1c" pct={42} value="₹750" color="#DC2626" />
      <ProgressRow label="Microalbumin" pct={35} value="₹635" color="#0D9488" />
      <ProgressRow label="Lipid Profile" pct={31} value="₹550" color="#1D4ED8" />
      <ProgressRow label="eGFR" pct={25} value="₹450" color="#0891B2" />
      <ProgressRow label="TSH" pct={21} value="₹380" color="#16A34A" />
      <ProgressRow label="CBC" pct={18} value="₹320" color="#94A3B8" />
    </AnCard>

    <AnCard title="Tests per Session" subtitle="How the panel has grown over time">
      <BarChart
        maxVal={14}
        bars={[
          {label: "Oct'23", topLabel: '6', value: 6, color: '#7C3AED'},
          {label: "Apr'24", topLabel: '8', value: 8, color: '#1D4ED8'},
          {label: "Sep'24", topLabel: '10', value: 10, color: '#D97706'},
          {label: "Jan'26", topLabel: '13', value: 13, color: '#DC2626'},
          {label: "Mar'26", topLabel: '13', value: 13, color: '#0D9488'},
        ]}
      />
    </AnCard>

    <AnCard title="Compliance Analysis" subtitle="Ordered vs completed tests">
      <ProgressRow label="Glycaemic panel" pct={100} value="5/5 ✓" color="#16A34A" />
      <ProgressRow label="Lipid profile" pct={80} value="4/5" color="#0D9488" />
      <ProgressRow label="Renal panel" pct={75} value="3/4" color="#D97706" />
      <ProgressRow label="Micronutrients" pct={67} value="4/6" color="#D97706" />
      <ProgressRow label="Eye screening" pct={0} value="0/5 ⚠" color="#DC2626" />
      <ProgressRow label="Iron panel" pct={0} value="Not done" color="#DC2626" />
      <InsightBox>
        Eyes screening is overdue — dilated fundus exam ordered but not completed in 5 years. Iron panel not yet done despite being flagged by Ayu as highest-priority gap. TrustLab can run both in the next session.
      </InsightBox>
    </AnCard>
  </View>
);

export default LabReportsSub;
