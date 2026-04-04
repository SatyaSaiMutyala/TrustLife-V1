import React from 'react';
import {View} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {
  HeroCard,
  StatStrip,
  SectionLabel,
  AnCard,
  InsightBullet,
  BarChart,
  ProgressRow,
  NumberedAction,
  StatusRow,
  RankRow,
  LoyaltyRow,
} from './components';

const DoctorsSub = () => (
  <View>
    <HeroCard
      bigNumber="₹14.8"
      bigUnit="K"
      bigLabel="Total consultation spend · all time"
      kpis={[
        {value: '24', label: 'Total visits'},
        {value: '₹617', label: 'Avg fee/visit'},
        {value: '5', label: 'Unique doctors'},
        {value: '4', label: 'Specialties'},
      ]}
      chips={[
        {text: 'Dr. Meera Krishnamurthy seen 10× — most-visited doctor and primary anchor', bg: 'rgba(13,148,136,0.22)', color: '#5EEAD4'},
        {text: 'Ophthalmology: 0 visits despite 5-year T2DM — critical gap', bg: 'rgba(220,38,38,0.22)', color: '#FCA5A5'},
        {text: 'Physiotherapy: 3 of 6 planned sessions done — course incomplete', bg: 'rgba(217,119,6,0.22)', color: '#FCD34D'},
      ]}
    />

    <StatStrip items={[
      {label: '2025 YTD', value: '₹4,200', sub: '6 visits · Q1', color: '#0D9488'},
      {label: 'Full Year 2024', value: '₹5,800', sub: '9 visits', color: '#7C3AED'},
      {label: 'Full Year 2023', value: '₹4,800', sub: '9 visits', color: '#1D4ED8'},
      {label: 'Highest Single', value: '₹1,800', sub: 'Echo + consult', color: '#D97706'},
      {label: 'Avg per visit', value: '₹617', sub: 'all-time', color: '#16A34A'},
    ]} />

    <SectionLabel text="Behaviour Analytics" />

    <AnCard title="Follow-up Compliance" subtitle="Did Priya attend recommended appointments?">
      <StatusRow name="Dr. Meera — quarterly T2DM review" done={true} note="Always attended, avg 3 days early" color="#16A34A" />
      <StatusRow name="Cardiologist — post-ECG follow-up" done={true} note="Attended 7 days late — rescheduled once" color="#D97706" />
      <StatusRow name="Ophthalmology — annual eye exam" done={false} note="5 years overdue — never booked" color="#DC2626" />
      <StatusRow name="Physiotherapy — full course (6 of 6)" done={false} note="3 of 6 sessions done — paused at session 3" color="#D97706" />
      <StatusRow name="Dentist — 6-monthly check" done={false} note="Not on record — never attended in T2DM history" color="#DC2626" />
    </AnCard>

    <AnCard title="Priority Doctor Actions" subtitle="Overdue appointments by clinical urgency" style={{backgroundColor: '#F0FDFA', borderColor: 'rgba(13,148,136,0.2)'}}>
      <NumberedAction num={1} title="Book ophthalmology — dilated fundus exam" desc="5 years of T2DM, zero eye screenings. Early retinopathy treatable; advanced is not." due="This week" color="#DC2626" />
      <NumberedAction num={2} title="Complete physiotherapy (3 sessions remain)" desc="Knee pain limits step count. Completing course removes the main exercise barrier." due="This month" color="#D97706" />
      <NumberedAction num={3} title="Book dental check" desc="Active periodontitis raises HbA1c by 0.3-0.4% via systemic inflammation — a free HbA1c improvement." due="This month" color="#7C3AED" />
    </AnCard>

    <SectionLabel text="Spend Analytics" />

    <AnCard title="Doctor Rankings" subtitle="Total fees paid · all-time · sorted by spend">
      <RankRow rank={1} init="MK" bg="#CCFBF1" tx="#0D9488" name="Dr. Meera Krishnamurthy" sp="Endocrinologist" visits={10} total={7000} maxTotal={7000} />
      <RankRow rank={2} init="SR" bg="#EDE9FE" tx="#7C3AED" name="Dr. Suresh Rao" sp="Cardiologist" visits={4} total={3200} maxTotal={7000} />
      <RankRow rank={3} init="AK" bg="#FEF3C7" tx="#D97706" name="Dr. Anitha Kumar" sp="General Physician" visits={6} total={1800} maxTotal={7000} />
      <RankRow rank={4} init="RS" bg="#FFF7ED" tx="#EA580C" name="Dr. Ramya Srinivas" sp="Physiotherapist" visits={3} total={1500} maxTotal={7000} />
    </AnCard>

    <AnCard title="Spend by Specialty" subtitle="Total consultation fees per medical specialty">
      <ProgressRow label="Endocrinology" pct={100} value="₹7,000" color="#0D9488" />
      <ProgressRow label="Cardiology" pct={46} value="₹3,200" color="#7C3AED" />
      <ProgressRow label="General Physician" pct={26} value="₹1,800" color="#D97706" />
      <ProgressRow label="Physiotherapy" pct={21} value="₹1,500" color="#EA580C" />
      <ProgressRow label="Ophthalmology" pct={0} value="₹0 (overdue)" color="#DC2626" />
    </AnCard>

    <AnCard title="Visit Frequency by Quarter" subtitle="How often Priya sees a doctor per quarter">
      <BarChart
        maxVal={7}
        bars={[
          {label: "Q1'24", topLabel: '3', value: 3, color: '#0D9488'},
          {label: "Q2", topLabel: '2', value: 2, color: '#0D9488'},
          {label: "Q3", topLabel: '2', value: 2, color: '#0D9488'},
          {label: "Q4", topLabel: '3', value: 3, color: '#D97706'},
          {label: "Q1'25", topLabel: '4', value: 4, color: '#DC2626'},
          {label: "Q2", topLabel: '3', value: 3, color: '#1D4ED8'},
          {label: "Q3", topLabel: '3', value: 3, color: '#1D4ED8'},
          {label: "Q4", topLabel: '3', value: 3, color: '#1D4ED8'},
          {label: "Q1'26", topLabel: '6', value: 6, color: '#DC2626'},
        ]}
      />
    </AnCard>

    <AnCard title="Doctor Loyalty Analysis" subtitle="Consistency with same doctor per specialty">
      <LoyaltyRow specialty="Endocrinology" doctor="Dr. Meera" pct={100} streak="5 years" color="#0D9488" />
      <LoyaltyRow specialty="Cardiology" doctor="Dr. Suresh Rao" pct={100} streak="1 year" color="#7C3AED" />
      <LoyaltyRow specialty="General Physician" doctor="Dr. Anitha Kumar" pct={100} streak="2 years" color="#D97706" />
      <LoyaltyRow specialty="Physiotherapy" doctor="Dr. Ramya Srinivas" pct={75} streak="Incomplete course" color="#EA580C" />
    </AnCard>

    <AnCard title="Cost per Visit Type" subtitle="Average fee by purpose of visit">
      <BarChart
        maxVal={1400}
        bars={[
          {label: 'Follow-up', topLabel: '₹500', value: 500, color: '#0D9488'},
          {label: 'Consult', topLabel: '₹1,200', value: 1200, color: '#7C3AED'},
          {label: 'Annual Rx', topLabel: '₹900', value: 900, color: '#1D4ED8'},
          {label: 'Acute', topLabel: '₹500', value: 500, color: '#D97706'},
        ]}
      />
    </AnCard>

    <AnCard title="Doctor Analytics Insights" style={{backgroundColor: '#F0FDFA', borderColor: 'rgba(13,148,136,0.2)'}}>
      <InsightBullet color="#0F766E" bg="rgba(13,148,136,0.08)">
        <AppText variant="small" color="#0F766E"><AppText variant="small" color="#0F766E" style={{fontWeight: '700'}}>Dr. Meera Krishnamurthy </AppText>(Endocrinologist, Apollo Hyderabad) has been Priya's primary care anchor for 5 years — all T2DM management, lab ordering, and medication review concentrated here.</AppText>
      </InsightBullet>
      <InsightBullet color="#DC2626" bg="rgba(220,38,38,0.06)">
        <AppText variant="small" color="#DC2626"><AppText variant="small" color="#DC2626" style={{fontWeight: '700'}}>No ophthalmology visit in 5 years of T2DM. </AppText>Standard of care is annual dilated fundus exam from diagnosis. This is the highest-priority unaddressed clinical gap in Priya's visit history.</AppText>
      </InsightBullet>
      <InsightBullet color="#D97706" bg="rgba(217,119,6,0.06)">
        <AppText variant="small" color="#D97706"><AppText variant="small" color="#D97706" style={{fontWeight: '700'}}>Cardiology visits are rising </AppText>— 4 visits in 2025 YTD vs 0 in 2023. HTN diagnosis (Jan 2026) and Amlodipine initiation are driving increased cardiovascular monitoring.</AppText>
      </InsightBullet>
    </AnCard>
  </View>
);

export default DoctorsSub;
