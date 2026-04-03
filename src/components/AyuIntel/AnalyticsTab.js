import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

const SUB_TABS = ['Overview', 'Biomarkers', 'Lab Reports', 'Doctors', 'Medications'];

/* ════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ════════════════════════════════════════════════════ */

const HeroCard = ({bigNumber, bigUnit, bigLabel, kpis, chips}) => (
  <View style={st.hero}>
    {/* Top: Left (number + label) side-by-side with Right (2×2 KPI grid) */}
    <View style={st.heroTopRow}>
      <View style={st.heroLeft}>
        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
          <AppText color={Colors.white} style={{fontSize: ms(28), fontWeight: '700', fontFamily: 'monospace', lineHeight: ms(32)}}>
            {bigNumber}
          </AppText>
          {bigUnit ? (
            <AppText color="rgba(255,255,255,0.55)" style={{fontSize: ms(15), marginBottom: vs(2), marginLeft: s(1)}}>
              {bigUnit}
            </AppText>
          ) : null}
        </View>
        <AppText color="rgba(255,255,255,0.55)" style={{fontSize: ms(9), lineHeight: ms(13), marginTop: vs(3)}}>
          {bigLabel}
        </AppText>
      </View>
      <View style={st.kpiGrid}>
        <View style={st.kpiRow}>
          {kpis.slice(0, 2).map((k, i) => (
            <View key={i} style={st.kpiBox}>
              <AppText color={Colors.white} style={{fontWeight: '700', fontFamily: 'monospace', fontSize: ms(11), lineHeight: ms(13)}}>
                {k.value}
              </AppText>
              <AppText color="rgba(255,255,255,0.45)" style={{marginTop: vs(2), fontSize: ms(6.5), lineHeight: ms(9)}}>
                {k.label}
              </AppText>
            </View>
          ))}
        </View>
        <View style={st.kpiRow}>
          {kpis.slice(2, 4).map((k, i) => (
            <View key={i} style={st.kpiBox}>
              <AppText color={Colors.white} style={{fontWeight: '700', fontFamily: 'monospace', fontSize: ms(11), lineHeight: ms(13)}}>
                {k.value}
              </AppText>
              <AppText color="rgba(255,255,255,0.45)" style={{marginTop: vs(2), fontSize: ms(6.5), lineHeight: ms(9)}}>
                {k.label}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </View>
    {/* Chips */}
    {chips && chips.length > 0 && (
      <View style={{gap: vs(5), marginTop: vs(8), position: 'relative', zIndex: 1}}>
        {chips.map((c, i) => (
          <View key={i} style={[st.heroChip, {backgroundColor: c.bg}]}>
            <AppText variant="small" color={c.color} style={{lineHeight: Fonts.sizes.small * 1.5}}>
              {c.text}
            </AppText>
          </View>
        ))}
      </View>
    )}
  </View>
);

const StatStrip = ({items}) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginVertical: vs(10)}} contentContainerStyle={{paddingHorizontal: s(2), gap: s(8)}}>
    {items.map((item, i) => (
      <View key={i} style={[st.statStripCard, {borderTopColor: item.color}]}>
        <AppText variant="subtext" color={Colors.textTertiary} style={{textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.5}}>
          {item.label}
        </AppText>
        <AppText variant="header" color={item.color || Colors.textPrimary} style={{fontWeight: '700', fontFamily: 'monospace', marginTop: vs(2)}}>
          {item.value}
        </AppText>
        {item.sub ? (
          <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
            {item.sub}
          </AppText>
        ) : null}
      </View>
    ))}
  </ScrollView>
);

const SectionLabel = ({text}) => (
  <View style={st.secLblWrap}>
    <AppText variant="small" color={Colors.textTertiary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 1, marginRight: s(8)}}>
      {text}
    </AppText>
    <View style={st.secLblLine} />
  </View>
);

const AnCard = ({title, subtitle, children, style: extraStyle}) => (
  <View style={[st.anCard, extraStyle]}>
    {title ? (
      <View style={{marginBottom: vs(10)}}>
        <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontWeight: '700'}}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(1), lineHeight: Fonts.sizes.small * 1.5}}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
    ) : null}
    {children}
  </View>
);

const InsightBullet = ({color, bg, icon, children}) => (
  <View style={[st.insightBullet, {backgroundColor: bg, borderLeftColor: color}]}>
    {icon ? (
      <Icon family="Ionicons" name={icon} size={13} color={color} />
    ) : null}
    <AppText variant="small" color={color} style={{flex: 1, lineHeight: ms(16)}}>
      {children}
    </AppText>
  </View>
);

const ProgressRow = ({label, pct, value, color}) => (
  <View style={st.progressRow}>
    <View style={[st.progressDot, {backgroundColor: color}]} />
    <AppText variant="small" color={Colors.textPrimary} style={{width: s(80)}} numberOfLines={1}>
      {label}
    </AppText>
    <View style={st.progressTrack}>
      <View style={[st.progressFill, {width: `${pct}%`, backgroundColor: color}]} />
    </View>
    <AppText variant="small" color={color} style={{width: s(50), textAlign: 'right', fontWeight: '700', fontFamily: 'monospace'}}>
      {value}
    </AppText>
  </View>
);

const InsightBox = ({children}) => (
  <View style={st.insightBox}>
    <AppText variant="small" color="#4338CA" style={{lineHeight: ms(16)}}>
      {children}
    </AppText>
  </View>
);

const HeatCell = ({letter, bg, borderColor, textColor, dashed}) => (
  <View style={[st.heatCell, {backgroundColor: bg, borderColor: borderColor || Colors.borderLight}, dashed && {borderStyle: 'dashed'}]}>
    <AppText variant="small" color={textColor || Colors.textPrimary} style={{fontWeight: '800'}}>
      {letter}
    </AppText>
  </View>
);

const BarChart = ({bars, maxVal, height: barHeight, barWidth, scrollable}) => {
  const bh = barHeight || 80;
  const bw = barWidth || (scrollable ? s(14) : undefined);
  const content = bars.map((b, i) => {
    const h = maxVal ? (b.value / maxVal) * vs(bh - 14) : vs(40);
    return (
      <View key={i} style={[{alignItems: 'center'}, bw ? {width: bw} : {flex: 1}]}>
        {b.topLabel ? (
          <AppText variant="subtext" color={b.color || Colors.accent} style={{fontSize: Fonts.sizes.xs, marginBottom: vs(2), fontFamily: 'monospace'}}>
            {b.topLabel}
          </AppText>
        ) : <View style={{height: vs(12)}} />}
        <View style={{flex: 1, justifyContent: 'flex-end', width: '100%', alignItems: 'center'}}>
          <View style={{width: bw ? bw - s(3) : '70%', height: Math.max(4, h), backgroundColor: (b.color || Colors.accent) + (b.dim ? '88' : ''), borderRadius: ms(3)}} />
        </View>
        <AppText variant="subtext" color={Colors.textTertiary} style={{fontSize: Fonts.sizes.xs, marginTop: vs(2)}} numberOfLines={1}>
          {b.label}
        </AppText>
      </View>
    );
  });
  return (
    <View style={{height: vs(bh), marginTop: vs(6)}}>
      {scrollable ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{flexDirection: 'row', alignItems: 'flex-end', gap: s(2), paddingRight: s(4)}}>
          {content}
        </ScrollView>
      ) : (
        <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: s(4), flex: 1}}>
          {content}
        </View>
      )}
    </View>
  );
};

const TableRow = ({cells, isHeader, bg}) => (
  <View style={[st.tableRow, isHeader && {backgroundColor: '#F9FAFB'}, bg && {backgroundColor: bg}]}>
    {cells.map((c, i) => (
      <View key={i} style={[st.tableCell, i === 0 && {flex: 1.5}]}>
        <AppText variant={isHeader ? 'subtext' : 'small'} color={isHeader ? Colors.textTertiary : Colors.textPrimary} style={isHeader ? {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5} : {fontFamily: 'monospace'}}>
          {c}
        </AppText>
      </View>
    ))}
  </View>
);

const BenchmarkCell = ({label, value, sub, bg, color}) => (
  <View style={[st.benchCell, {backgroundColor: bg}]}>
    <AppText variant="subtext" color={color} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5}}>
      {label}
    </AppText>
    <AppText variant="header" color={color} style={{fontWeight: '700', fontFamily: 'monospace', marginTop: vs(3)}}>
      {value}
    </AppText>
    {sub ? (
      <AppText variant="subtext" color={color} style={{marginTop: vs(2), opacity: 0.8}}>
        {sub}
      </AppText>
    ) : null}
  </View>
);

const GanttBar = ({label, startPct, widthPct, color, duration}) => (
  <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(6)}}>
    <AppText variant="subtext" color={Colors.textTertiary} style={{fontWeight: '600', minWidth: s(70)}}>
      {label}
    </AppText>
    <View style={[st.ganttTrack, {flex: 1}]}>
      <View style={[st.ganttFill, {left: `${startPct}%`, width: `${Math.max(2, widthPct)}%`, backgroundColor: color + 'CC'}]} />
    </View>
    {duration ? (
      <AppText variant="subtext" color={Colors.textTertiary} style={{minWidth: s(24), textAlign: 'right'}}>
        {duration}
      </AppText>
    ) : null}
  </View>
);

const NumberedAction = ({num, title, desc, due, color}) => (
  <View style={{paddingVertical: vs(9), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F8FAFC', flexDirection: 'row', alignItems: 'flex-start', gap: s(9)}}>
    <AppText variant="bodyBold" color={color} style={{fontWeight: '700', minWidth: s(18), marginTop: vs(1)}}>
      {num}.
    </AppText>
    <View style={{flex: 1}}>
      <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '700', marginBottom: vs(3)}}>
        {title}
      </AppText>
      <AppText variant="subtext" color={Colors.textTertiary} style={{lineHeight: ms(14)}}>
        {desc}
      </AppText>
    </View>
    <View style={{backgroundColor: color + '18', paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(5)}}>
      <AppText variant="subtext" color={color} style={{fontWeight: '700'}}>{due}</AppText>
    </View>
  </View>
);

const StatusRow = ({name, done, note, color}) => (
  <View style={{paddingVertical: vs(9), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F1F5F9', flexDirection: 'row', alignItems: 'flex-start', gap: s(10)}}>
    <View style={{width: ms(10), height: ms(10), borderRadius: ms(3), backgroundColor: color, marginTop: vs(2)}} />
    <View style={{flex: 1}}>
      <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '700', marginBottom: vs(2)}}>{name}</AppText>
      <AppText variant="subtext" color={color}>{note}</AppText>
    </View>
    <View style={{backgroundColor: color + '18', paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(5)}}>
      <AppText variant="subtext" color={color} style={{fontWeight: '700'}}>{done ? '✓ Done' : '⚠ Pending'}</AppText>
    </View>
  </View>
);

const RankRow = ({rank, init, bg, tx, name, sp, visits, total, maxTotal}) => {
  const pct = maxTotal ? Math.round((total / maxTotal) * 100) : 50;
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', gap: s(9), paddingVertical: vs(8), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.background}}>
      <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '700', minWidth: s(16)}}>#{rank}</AppText>
      <View style={{width: ms(34), height: ms(34), borderRadius: ms(10), backgroundColor: bg, alignItems: 'center', justifyContent: 'center'}}>
        <AppText variant="small" color={tx} style={{fontWeight: '700'}}>{init}</AppText>
      </View>
      <View style={{flex: 1, minWidth: 0}}>
        <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '700'}}>{name}</AppText>
        <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(1), marginBottom: vs(4)}}>{sp} · {visits} visits</AppText>
        <View style={{height: ms(3), backgroundColor: Colors.background, borderRadius: ms(2), overflow: 'hidden'}}>
          <View style={{height: '100%', width: `${pct}%`, backgroundColor: tx, borderRadius: ms(2)}} />
        </View>
      </View>
      <AppText variant="bodyBold" color={tx} style={{fontWeight: '700', fontFamily: 'monospace'}}>₹{total.toLocaleString()}</AppText>
    </View>
  );
};

const LoyaltyRow = ({specialty, doctor, pct, streak, color}) => (
  <View style={{paddingVertical: vs(8), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F1F5F9'}}>
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(5)}}>
      <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '700'}}>{specialty}</AppText>
      <View style={{backgroundColor: color + '18', paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(5)}}>
        <AppText variant="subtext" color={color} style={{fontWeight: '700'}}>{pct}% loyalty</AppText>
      </View>
    </View>
    <AppText variant="subtext" color={Colors.textTertiary} style={{marginBottom: vs(4)}}>{doctor} · {streak}</AppText>
    <View style={{height: ms(4), backgroundColor: Colors.background, borderRadius: ms(2), overflow: 'hidden'}}>
      <View style={{height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: ms(2)}} />
    </View>
  </View>
);

/* ════════════════════════════════════════════════════
   TAB 0: OVERVIEW
   ════════════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════════════
   TAB 1: BIOMARKERS
   ════════════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════════════
   TAB 2: LAB REPORTS
   ════════════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════════════
   TAB 3: DOCTORS
   ════════════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════════════
   TAB 4: MEDICATIONS
   ════════════════════════════════════════════════════ */
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

/* ════════════════════════════════════════════════════
   MAIN COMPONENT
   ════════════════════════════════════════════════════ */
const AnalyticsTab = () => {
  const [subTab, setSubTab] = useState('Overview');

  return (
    <View>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: vs(12)}} contentContainerStyle={{gap: s(6)}}>
        {SUB_TABS.map(t => (
          <TouchableOpacity
            key={t}
            style={[st.subPill, subTab === t && st.subPillActive]}
            onPress={() => setSubTab(t)}>
            <AppText
              variant="small"
              color={subTab === t ? Colors.white : Colors.textSecondary}
              style={{fontWeight: subTab === t ? '600' : '400'}}>
              {t}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {subTab === 'Overview' && <OverviewSub />}
      {subTab === 'Biomarkers' && <BiomarkersSub />}
      {subTab === 'Lab Reports' && <LabReportsSub />}
      {subTab === 'Doctors' && <DoctorsSub />}
      {subTab === 'Medications' && <MedicationsSub />}
    </View>
  );
};

/* ════════════════════════════════════════════════════
   STYLES
   ════════════════════════════════════════════════════ */
const st = StyleSheet.create({
  subPill: {paddingVertical: vs(5), paddingHorizontal: s(12), borderRadius: ms(16), backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderLight},
  subPillActive: {backgroundColor: Colors.accent, borderColor: Colors.accent},

  hero: {backgroundColor: Colors.primary, borderRadius: ms(16), padding: ms(14), marginBottom: vs(4), position: 'relative', overflow: 'hidden'},
  heroTopRow: {flexDirection: 'row', alignItems: 'flex-start', position: 'relative', zIndex: 1},
  heroLeft: {width: '58%', paddingRight: s(8)},
  kpiGrid: {width: '42%', gap: vs(4)},
  kpiRow: {flexDirection: 'row', gap: s(4)},
  kpiBox: {flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: ms(8), paddingVertical: vs(5), paddingHorizontal: s(6)},
  heroChip: {borderRadius: ms(8), paddingVertical: vs(5), paddingHorizontal: s(10)},

  statStripCard: {backgroundColor: Colors.white, borderRadius: ms(12), padding: ms(12), minWidth: s(110), borderWidth: 0.5, borderColor: Colors.borderLight, borderTopWidth: 2.5},

  secLblWrap: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(10)},
  secLblLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.borderLight},

  anCard: {backgroundColor: Colors.white, borderRadius: ms(14), padding: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, marginBottom: vs(10)},

  insightBullet: {flexDirection: 'row', alignItems: 'flex-start', gap: s(8), borderLeftWidth: 3, borderRadius: ms(6), paddingVertical: vs(6), paddingHorizontal: s(10), marginBottom: vs(4)},

  progressRow: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(6), gap: s(6)},
  progressDot: {width: ms(6), height: ms(6), borderRadius: ms(3)},
  progressTrack: {flex: 1, height: ms(6), backgroundColor: Colors.background, borderRadius: ms(3), overflow: 'hidden'},
  progressFill: {height: '100%', borderRadius: ms(3)},

  insightBox: {backgroundColor: '#EEF2FF', borderRadius: ms(8), padding: ms(10), marginTop: vs(8), borderWidth: 0.5, borderColor: '#C7D2FE'},

  heatCell: {width: ms(28), height: ms(28), borderRadius: ms(6), borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginVertical: vs(1)},

  tableRow: {flexDirection: 'row', paddingVertical: vs(6), paddingHorizontal: s(4), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.borderLight},
  tableCell: {flex: 1, justifyContent: 'center'},

  benchGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8), justifyContent: 'space-between'},
  benchCell: {width: '47%', borderRadius: ms(10), padding: ms(10), marginBottom: vs(2)},

  ganttTrack: {height: ms(14), backgroundColor: Colors.background, borderRadius: ms(4), overflow: 'hidden', position: 'relative'},
  ganttFill: {position: 'absolute', top: 0, height: '100%', borderRadius: ms(4)},
});

export default AnalyticsTab;
