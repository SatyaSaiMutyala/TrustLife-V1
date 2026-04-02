import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

const SUB_TABS = ['Overview', 'Biomarkers', 'Lab Reports', 'Doctors', 'Medications'];

/* ════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ════════════════════════════════════════════════════ */

const HeroCard = ({bigNumber, bigUnit, bigLabel, kpis, chips}) => (
  <View style={st.hero}>
    <View style={{alignItems: 'center', marginBottom: vs(14)}}>
      <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
        <AppText variant="screenName" color={Colors.white} style={{fontSize: ms(36), lineHeight: ms(40), fontWeight: '800'}}>
          {bigNumber}
        </AppText>
        {bigUnit ? (
          <AppText variant="body" color="rgba(255,255,255,0.7)" style={{marginBottom: vs(4), marginLeft: s(2), fontWeight: '600'}}>
            {bigUnit}
          </AppText>
        ) : null}
      </View>
      <AppText variant="caption" color="rgba(255,255,255,0.6)" style={{marginTop: vs(2)}}>
        {bigLabel}
      </AppText>
    </View>
    <View style={st.kpiGrid}>
      {kpis.map((k, i) => (
        <View key={i} style={st.kpiBox}>
          <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(15), fontWeight: '700'}}>
            {k.value}
          </AppText>
          <AppText variant="small" color="rgba(255,255,255,0.6)" style={{marginTop: vs(1), textAlign: 'center'}}>
            {k.label}
          </AppText>
        </View>
      ))}
    </View>
    {chips && chips.length > 0 && (
      <View style={{marginTop: vs(12), gap: vs(6)}}>
        {chips.map((c, i) => (
          <View key={i} style={[st.heroChip, {backgroundColor: c.bg}]}>
            <AppText variant="small" color={c.color} style={{fontWeight: '600'}}>
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
        <AppText variant="small" color={Colors.textTertiary} style={{textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.5}}>
          {item.label}
        </AppText>
        <AppText variant="header" color={Colors.textPrimary} style={{fontWeight: '800', fontSize: ms(18), marginTop: vs(2)}}>
          {item.value}
        </AppText>
        {item.sub ? (
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(1)}}>
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
        <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(12), fontWeight: '700'}}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(1)}}>
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
    <AppText variant="small" color={Colors.textPrimary} style={{width: s(40), textAlign: 'right', fontWeight: '600'}}>
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

const HeatCell = ({letter, bg, borderColor}) => (
  <View style={[st.heatCell, {backgroundColor: bg, borderColor: borderColor || Colors.borderLight}]}>
    <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '700', fontSize: ms(10)}}>
      {letter}
    </AppText>
  </View>
);

const BarChart = ({bars, maxVal}) => (
  <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: s(4), height: vs(80), marginTop: vs(6)}}>
    {bars.map((b, i) => {
      const h = maxVal ? (b.value / maxVal) * vs(70) : vs(40);
      return (
        <View key={i} style={{flex: 1, alignItems: 'center'}}>
          <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(8), marginBottom: vs(2)}}>
            {b.topLabel}
          </AppText>
          <View style={{width: '70%', height: h, backgroundColor: b.color || Colors.accent, borderRadius: ms(3)}} />
          <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(8), marginTop: vs(2)}}>
            {b.label}
          </AppText>
        </View>
      );
    })}
  </View>
);

const TableRow = ({cells, isHeader, bg}) => (
  <View style={[st.tableRow, isHeader && {backgroundColor: '#F9FAFB'}, bg && {backgroundColor: bg}]}>
    {cells.map((c, i) => (
      <View key={i} style={[st.tableCell, i === 0 && {flex: 1.5}]}>
        <AppText variant="small" color={isHeader ? Colors.textTertiary : Colors.textPrimary} style={isHeader ? {fontWeight: '700', textTransform: 'uppercase', fontSize: ms(9)} : {fontSize: ms(10)}}>
          {c}
        </AppText>
      </View>
    ))}
  </View>
);

const BenchmarkCell = ({label, value, bg, color}) => (
  <View style={[st.benchCell, {backgroundColor: bg}]}>
    <AppText variant="small" color={color} style={{fontWeight: '700', fontSize: ms(14)}}>
      {value}
    </AppText>
    <AppText variant="small" color={color} style={{marginTop: vs(2), opacity: 0.8}}>
      {label}
    </AppText>
  </View>
);

const GanttBar = ({label, startPct, widthPct, color}) => (
  <View style={{marginBottom: vs(6)}}>
    <AppText variant="small" color={Colors.textPrimary} style={{marginBottom: vs(2), fontSize: ms(10)}}>
      {label}
    </AppText>
    <View style={st.ganttTrack}>
      <View style={[st.ganttFill, {left: `${startPct}%`, width: `${widthPct}%`, backgroundColor: color}]} />
    </View>
  </View>
);

/* ════════════════════════════════════════════════════
   TAB 0: OVERVIEW
   ════════════════════════════════════════════════════ */
const OverviewSub = () => (
  <View>
    <HeroCard
      bigNumber="₹3.6L"
      bigLabel="Total Health Spend · Jan 2021 – Mar 2026"
      kpis={[
        {value: '₹6,100', label: 'Monthly avg'},
        {value: '₹19.2K', label: '2025 YTD'},
        {value: '3', label: 'Conditions'},
        {value: '6', label: 'Medications'},
      ]}
      chips={[
        {text: '↑ 3.2× spend increase since 2021 — ₹2,800/mo → ₹8,900/mo', bg: 'rgba(220,38,38,0.22)', color: '#FCA5A5'},
        {text: 'Pharmacy = 41% of all spend (₹1.48L) — largest category', bg: 'rgba(217,119,6,0.22)', color: '#FCD34D'},
        {text: '₹0 insurance utilised — 100% out-of-pocket exposure', bg: 'rgba(99,102,241,0.22)', color: '#A5B4FC'},
      ]}
    />

    <StatStrip items={[
      {label: '2025 YTD', value: '₹19.2K', sub: 'Jan–Mar', color: '#DC2626'},
      {label: '2024', value: '₹68.4K', sub: 'Full year', color: '#0D9488'},
      {label: '2023', value: '₹38.2K', sub: 'Full year', color: '#7C3AED'},
      {label: 'Highest', value: '₹8,400', sub: 'Oct 2024', color: '#D97706'},
      {label: 'Lowest', value: '₹1,200', sub: 'Feb 2022', color: '#16A34A'},
    ]} />

    <SectionLabel text="Behaviour Analytics" />

    <AnCard title="Cross-Domain Behaviour Patterns" subtitle="Patterns spanning medications, labs & lifestyle">
      <View style={[st.anCardInnerBg, {backgroundColor: '#F0FDF4'}]}>
        <InsightBullet color="#DC2626" bg="rgba(220,38,38,0.08)" icon="alert-circle">
          <AppText variant="small" color="#DC2626" style={{fontWeight: '700'}}>PM Metformin miss cascade: </AppText>
          <AppText variant="small" color="#DC2626">58% adherence drags HbA1c — skips cluster on weekends + late dinners</AppText>
        </InsightBullet>
        <InsightBullet color="#0D9488" bg="rgba(13,148,136,0.08)" icon="eye-off">
          <AppText variant="small" color="#0D9488" style={{fontWeight: '700'}}>Symptom-invisible screening gap: </AppText>
          <AppText variant="small" color="#0D9488">No retinal or foot exam since 2023 despite diabetic profile</AppText>
        </InsightBullet>
        <InsightBullet color="#D97706" bg="rgba(217,119,6,0.08)" icon="walk">
          <AppText variant="small" color="#D97706" style={{fontWeight: '700'}}>Evening walk window: </AppText>
          <AppText variant="small" color="#D97706">Post-dinner walks on Mon/Wed correlate with 12% lower next-day FBG</AppText>
        </InsightBullet>
        <InsightBullet color="#7C3AED" bg="rgba(124,58,237,0.08)" icon="moon">
          <AppText variant="small" color="#7C3AED" style={{fontWeight: '700'}}>Social jet lag: </AppText>
          <AppText variant="small" color="#7C3AED">Weekend wake-time shifts 1.5 hrs — med timing displaced → Monday FBG spike</AppText>
        </InsightBullet>
      </View>
    </AnCard>

    <SectionLabel text="Spend Analytics" />

    <AnCard title="Monthly Health Spend" subtitle="₹/month over last 12 months">
      <BarChart
        maxVal={9000}
        bars={[
          {label: 'Apr', topLabel: '4.2K', value: 4200, color: Colors.accent},
          {label: 'May', topLabel: '3.8K', value: 3800, color: Colors.accent},
          {label: 'Jun', topLabel: '5.1K', value: 5100, color: Colors.accent},
          {label: 'Jul', topLabel: '4.6K', value: 4600, color: Colors.accent},
          {label: 'Aug', topLabel: '3.9K', value: 3900, color: Colors.accent},
          {label: 'Sep', topLabel: '6.2K', value: 6200, color: Colors.accent},
          {label: 'Oct', topLabel: '8.4K', value: 8400, color: '#DC2626'},
          {label: 'Nov', topLabel: '5.8K', value: 5800, color: Colors.accent},
          {label: 'Dec', topLabel: '7.1K', value: 7100, color: Colors.accent},
          {label: 'Jan', topLabel: '6.8K', value: 6800, color: Colors.accent},
          {label: 'Feb', topLabel: '5.6K', value: 5600, color: Colors.accent},
          {label: 'Mar', topLabel: '6.8K', value: 6800, color: Colors.accent},
        ]}
      />
    </AnCard>

    <AnCard title="Spend by Category" subtitle="Lifetime breakdown" style={{marginTop: vs(10)}}>
      <ProgressRow label="Pharmacy" pct={41} value="₹1.48L" color="#DC2626" />
      <ProgressRow label="Doctors" pct={27} value="₹97K" color="#0D9488" />
      <ProgressRow label="Lab Tests" pct={18} value="₹65K" color="#D97706" />
      <ProgressRow label="Imaging" pct={9} value="₹32K" color="#7C3AED" />
      <ProgressRow label="Other" pct={5} value="₹18K" color="#6B7280" />
    </AnCard>

    <AnCard title="Year-on-Year Comparison" subtitle="Annual spend trend" style={{marginTop: vs(10)}}>
      <BarChart
        maxVal={80000}
        bars={[
          {label: '2021', topLabel: '₹33.6K', value: 33600, color: '#6B7280'},
          {label: '2022', topLabel: '₹36.0K', value: 36000, color: '#6B7280'},
          {label: '2023', topLabel: '₹38.2K', value: 38200, color: '#D97706'},
          {label: '2024', topLabel: '₹68.4K', value: 68400, color: '#DC2626'},
          {label: '2025', topLabel: '₹19.2K', value: 19200, color: Colors.accent},
        ]}
      />
      <InsightBox>
        2024 saw a 79% spike driven by new cardiac meds + increased lab panels. 2025 is tracking 12% above 2024 pace.
      </InsightBox>
    </AnCard>

    <AnCard title="Financial Burden" subtitle="Out-of-pocket analysis" style={{marginTop: vs(10)}}>
      <View style={{gap: vs(6)}}>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Insurance coverage</AppText>
          <AppText variant="bodyBold" color="#DC2626">₹0 (0%)</AppText>
        </View>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Out-of-pocket</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary}>₹3.6L (100%)</AppText>
        </View>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Spend as % income</AppText>
          <AppText variant="bodyBold" color="#D97706">~8.5%</AppText>
        </View>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Catastrophic threshold</AppText>
          <AppText variant="bodyBold" color="#DC2626">Approaching (10%)</AppText>
        </View>
      </View>
    </AnCard>

    <AnCard title="Benchmarking" subtitle="vs. similar demographic" style={{marginTop: vs(10)}}>
      <View style={st.benchGrid}>
        <BenchmarkCell label="Your monthly" value="₹6,100" bg="#FEF2F2" color="#DC2626" />
        <BenchmarkCell label="Peer average" value="₹4,200" bg="#F0FDF4" color="#16A34A" />
        <BenchmarkCell label="Your pharmacy" value="41%" bg="#FEF3C7" color="#D97706" />
        <BenchmarkCell label="Peer pharmacy" value="28%" bg="#F0FDF4" color="#16A34A" />
      </View>
      <InsightBox>
        You spend 45% more than peers. Pharmacy share is 13 percentage points above benchmark — driven by branded cardiac meds.
      </InsightBox>
    </AnCard>

    <AnCard title="Spend Insights" subtitle="AI-generated observations" style={{marginTop: vs(10)}}>
      <InsightBullet color="#DC2626" bg="rgba(220,38,38,0.08)" icon="trending-up">
        <AppText variant="small" color="#DC2626" style={{fontWeight: '700'}}>Pharmacy costs grown 5× </AppText>
        <AppText variant="small" color="#DC2626">since 2021 — ₹495/mo to ₹2,274/mo after cardiac diagnosis</AppText>
      </InsightBullet>
      <InsightBullet color="#D97706" bg="rgba(217,119,6,0.08)" icon="alert-circle">
        <AppText variant="small" color="#D97706" style={{fontWeight: '700'}}>No insurance claims filed ever </AppText>
        <AppText variant="small" color="#D97706">— 100% out-of-pocket. ₹3.6L could have been partially covered</AppText>
      </InsightBullet>
      <InsightBullet color="#0D9488" bg="rgba(13,148,136,0.08)" icon="arrow-up">
        <AppText variant="small" color="#0D9488" style={{fontWeight: '700'}}>Lab spend rising 28% YoY </AppText>
        <AppText variant="small" color="#0D9488">as panel expands — consider bundled packages to save ₹3K/yr</AppText>
      </InsightBullet>
      <InsightBullet color="#7C3AED" bg="rgba(124,58,237,0.08)" icon="calculator">
        <AppText variant="small" color="#7C3AED" style={{fontWeight: '700'}}>Projected 2025: ₹76,800 </AppText>
        <AppText variant="small" color="#7C3AED">if current trajectory continues — 12% above 2024</AppText>
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
      bigLabel="Health Performance Score (HPS)"
      kpis={[
        {value: '11', label: 'Tracked'},
        {value: '55', label: 'Readings'},
        {value: '6', label: 'Abnormal'},
        {value: '4', label: 'Improving'},
      ]}
      chips={[
        {text: 'HbA1c worsening — 6.2% → 7.8% over 18 months', bg: 'rgba(220,38,38,0.22)', color: '#FCA5A5'},
        {text: 'LDL declining — 142 → 118 mg/dL with statin therapy', bg: 'rgba(13,148,136,0.22)', color: '#5EEAD4'},
        {text: 'Vit D deficient — 18 ng/mL, below 30 threshold', bg: 'rgba(217,119,6,0.22)', color: '#FCD34D'},
      ]}
    />

    <StatStrip items={[
      {label: 'HPS Q4\'24', value: '69', sub: 'Oct–Dec', color: '#D97706'},
      {label: 'HPS Q1\'25', value: '72', sub: 'Jan–Mar', color: '#16A34A'},
      {label: 'Flags', value: '7', sub: 'Out of range', color: '#DC2626'},
      {label: 'Normal', value: '5', sub: 'In range', color: '#0D9488'},
      {label: 'Readings/yr', value: '22', sub: 'Avg frequency', color: '#7C3AED'},
    ]} />

    <SectionLabel text="Behaviour Analytics" />

    <AnCard title="Marker Status Evolution" subtitle="Last 4 quarters — H=High, L=Low, N=Normal">
      <View style={{gap: vs(4)}}>
        {/* Header row */}
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(4)}}>
          <AppText variant="small" color={Colors.textTertiary} style={{width: s(60), fontSize: ms(9)}}>Marker</AppText>
          {['Q2\'24','Q3\'24','Q4\'24','Q1\'25'].map(q => (
            <AppText key={q} variant="small" color={Colors.textTertiary} style={{flex: 1, textAlign: 'center', fontSize: ms(9)}}>{q}</AppText>
          ))}
        </View>
        {[
          {name: 'HbA1c', cells: [{l:'H',c:'#DC2626'},{l:'H',c:'#DC2626'},{l:'H',c:'#DC2626'},{l:'H',c:'#DC2626'}]},
          {name: 'FBG', cells: [{l:'H',c:'#DC2626'},{l:'H',c:'#DC2626'},{l:'H',c:'#DC2626'},{l:'H',c:'#D97706'}]},
          {name: 'LDL', cells: [{l:'H',c:'#DC2626'},{l:'H',c:'#DC2626'},{l:'H',c:'#D97706'},{l:'N',c:'#16A34A'}]},
          {name: 'HDL', cells: [{l:'N',c:'#16A34A'},{l:'N',c:'#16A34A'},{l:'N',c:'#16A34A'},{l:'N',c:'#16A34A'}]},
          {name: 'TG', cells: [{l:'H',c:'#D97706'},{l:'H',c:'#D97706'},{l:'H',c:'#D97706'},{l:'H',c:'#D97706'}]},
          {name: 'Vit D', cells: [{l:'L',c:'#DC2626'},{l:'L',c:'#DC2626'},{l:'L',c:'#DC2626'},{l:'L',c:'#DC2626'}]},
          {name: 'B12', cells: [{l:'N',c:'#16A34A'},{l:'N',c:'#16A34A'},{l:'L',c:'#D97706'},{l:'N',c:'#16A34A'}]},
          {name: 'TSH', cells: [{l:'N',c:'#16A34A'},{l:'N',c:'#16A34A'},{l:'N',c:'#16A34A'},{l:'N',c:'#16A34A'}]},
          {name: 'eGFR', cells: [{l:'N',c:'#16A34A'},{l:'N',c:'#16A34A'},{l:'N',c:'#16A34A'},{l:'N',c:'#16A34A'}]},
          {name: 'Hb', cells: [{l:'N',c:'#16A34A'},{l:'L',c:'#D97706'},{l:'N',c:'#16A34A'},{l:'N',c:'#16A34A'}]},
          {name: 'Microalb.', cells: [{l:'N',c:'#16A34A'},{l:'N',c:'#16A34A'},{l:'N',c:'#16A34A'},{l:'N',c:'#16A34A'}]},
        ].map((row, i) => (
          <View key={i} style={{flexDirection: 'row', alignItems: 'center'}}>
            <AppText variant="small" color={Colors.textPrimary} style={{width: s(60), fontSize: ms(10)}}>{row.name}</AppText>
            {row.cells.map((cell, j) => (
              <View key={j} style={{flex: 1, alignItems: 'center'}}>
                <HeatCell letter={cell.l} bg={cell.c + '18'} borderColor={cell.c} />
              </View>
            ))}
          </View>
        ))}
      </View>
    </AnCard>

    <AnCard title="Test-Seeking Behaviour" subtitle="Frequency of biomarker testing" style={{marginTop: vs(10)}}>
      <ProgressRow label="HbA1c" pct={90} value="4×/yr" color="#DC2626" />
      <ProgressRow label="FBG" pct={85} value="4×/yr" color="#D97706" />
      <ProgressRow label="Lipid Panel" pct={75} value="3×/yr" color="#0D9488" />
      <ProgressRow label="Vit D" pct={50} value="2×/yr" color="#D97706" />
      <ProgressRow label="B12" pct={50} value="2×/yr" color="#7C3AED" />
      <ProgressRow label="TSH" pct={50} value="2×/yr" color="#16A34A" />
      <ProgressRow label="Kidney Panel" pct={50} value="2×/yr" color="#16A34A" />
      <InsightBox>
        HbA1c and FBG tested most frequently — appropriate given diabetic profile. Consider adding retinal screening and urine ACR.
      </InsightBox>
    </AnCard>

    <SectionLabel text="Spend Analytics" />

    <AnCard title="HPS Trend" subtitle="Quarterly Health Performance Score">
      <BarChart
        maxVal={100}
        bars={[
          {label: 'Q2\'24', topLabel: '65', value: 65, color: '#DC2626'},
          {label: 'Q3\'24', topLabel: '67', value: 67, color: '#D97706'},
          {label: 'Q4\'24', topLabel: '69', value: 69, color: '#D97706'},
          {label: 'Q1\'25', topLabel: '72', value: 72, color: Colors.accent},
        ]}
      />
      <InsightBox>
        HPS improving steadily (+7 points over 4 quarters) driven by LDL normalisation and eGFR stability.
      </InsightBox>
    </AnCard>

    <AnCard title="Biomarker Ranking" subtitle="Health Performance Score by marker" style={{marginTop: vs(10)}}>
      <ProgressRow label="TSH" pct={95} value="95" color="#16A34A" />
      <ProgressRow label="Microalb." pct={94} value="94" color="#16A34A" />
      <ProgressRow label="HDL" pct={90} value="90" color="#16A34A" />
      <ProgressRow label="eGFR" pct={80} value="80" color="#16A34A" />
      <ProgressRow label="B12" pct={78} value="78" color="#0D9488" />
      <ProgressRow label="Hb" pct={72} value="72" color="#D97706" />
      <ProgressRow label="LDL" pct={62} value="62" color="#D97706" />
      <ProgressRow label="TG" pct={60} value="60" color="#D97706" />
      <ProgressRow label="FBG" pct={58} value="58" color="#D97706" />
      <ProgressRow label="HbA1c" pct={52} value="52" color="#DC2626" />
      <ProgressRow label="Vit D" pct={48} value="48" color="#DC2626" />
    </AnCard>

    <AnCard title="Biomarker Heatmap" subtitle="Current values vs. reference ranges" style={{marginTop: vs(10)}}>
      <View style={{gap: vs(6)}}>
        {[
          {name: 'HbA1c', val: '7.8%', ref: '<6.5%', status: 'High', sc: '#DC2626'},
          {name: 'FBG', val: '126', ref: '<100', status: 'High', sc: '#D97706'},
          {name: 'LDL', val: '118', ref: '<100', status: 'Borderline', sc: '#D97706'},
          {name: 'HDL', val: '52', ref: '>40', status: 'Normal', sc: '#16A34A'},
          {name: 'TG', val: '178', ref: '<150', status: 'High', sc: '#D97706'},
          {name: 'Vit D', val: '18', ref: '30–100', status: 'Low', sc: '#DC2626'},
          {name: 'B12', val: '310', ref: '200–900', status: 'Normal', sc: '#16A34A'},
          {name: 'TSH', val: '2.8', ref: '0.4–4.0', status: 'Normal', sc: '#16A34A'},
          {name: 'eGFR', val: '88', ref: '>60', status: 'Normal', sc: '#16A34A'},
          {name: 'Hb', val: '13.2', ref: '13–17', status: 'Normal', sc: '#16A34A'},
          {name: 'Microalb.', val: '18', ref: '<30', status: 'Normal', sc: '#16A34A'},
        ].map((r, i) => (
          <View key={i} style={{flexDirection: 'row', alignItems: 'center', paddingVertical: vs(3)}}>
            <AppText variant="small" color={Colors.textPrimary} style={{width: s(58), fontSize: ms(10)}}>{r.name}</AppText>
            <AppText variant="small" color={Colors.textPrimary} style={{width: s(40), fontWeight: '600', fontSize: ms(10)}}>{r.val}</AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{width: s(48), fontSize: ms(9)}}>{r.ref}</AppText>
            <View style={[st.statusBadge, {backgroundColor: r.sc + '18', borderColor: r.sc}]}>
              <AppText variant="small" color={r.sc} style={{fontWeight: '600', fontSize: ms(9)}}>{r.status}</AppText>
            </View>
          </View>
        ))}
      </View>
    </AnCard>

    <AnCard title="Flag History" subtitle="Number of out-of-range markers per quarter" style={{marginTop: vs(10)}}>
      <BarChart
        maxVal={8}
        bars={[
          {label: 'Q2\'24', topLabel: '6', value: 6, color: '#DC2626'},
          {label: 'Q3\'24', topLabel: '6', value: 6, color: '#DC2626'},
          {label: 'Q4\'24', topLabel: '7', value: 7, color: '#DC2626'},
          {label: 'Q1\'25', topLabel: '5', value: 5, color: '#D97706'},
        ]}
      />
    </AnCard>

    <AnCard title="Score Dimensions" subtitle="HPS breakdown by category" style={{marginTop: vs(10)}}>
      <ProgressRow label="Metabolic" pct={55} value="55" color="#DC2626" />
      <ProgressRow label="Cardiac" pct={68} value="68" color="#D97706" />
      <ProgressRow label="Renal" pct={90} value="90" color="#16A34A" />
      <ProgressRow label="Thyroid" pct={95} value="95" color="#16A34A" />
      <ProgressRow label="Nutritional" pct={62} value="62" color="#D97706" />
      <InsightBox>
        Metabolic dimension is the weakest — driven by HbA1c and FBG. Renal and thyroid remain strong.
      </InsightBox>
    </AnCard>
  </View>
);

/* ════════════════════════════════════════════════════
   TAB 2: LAB REPORTS
   ════════════════════════════════════════════════════ */
const LabReportsSub = () => (
  <View>
    <HeroCard
      bigNumber="₹18.0K"
      bigLabel="Total Lab Spend · Jan 2021 – Mar 2026"
      kpis={[
        {value: '5', label: 'Sessions'},
        {value: '₹3,600', label: 'Avg/session'},
        {value: '55', label: 'Tests'},
        {value: '₹327', label: 'Per test'},
      ]}
      chips={[
        {text: 'Session cost rising — ₹2,800 → ₹4,200 over 2 years', bg: 'rgba(220,38,38,0.22)', color: '#FCA5A5'},
        {text: '28% YoY increase in lab spend as panel expands', bg: 'rgba(217,119,6,0.22)', color: '#FCD34D'},
        {text: 'All tests at single provider — no price comparison done', bg: 'rgba(99,102,241,0.22)', color: '#A5B4FC'},
      ]}
    />

    <StatStrip items={[
      {label: 'Session 1', value: '₹2,800', sub: 'Jun 2023', color: '#16A34A'},
      {label: 'Session 2', value: '₹3,200', sub: 'Dec 2023', color: '#0D9488'},
      {label: 'Session 3', value: '₹3,400', sub: 'Jun 2024', color: '#D97706'},
      {label: 'Session 4', value: '₹4,400', sub: 'Dec 2024', color: '#DC2626'},
      {label: 'Session 5', value: '₹4,200', sub: 'Mar 2025', color: '#DC2626'},
    ]} />

    <SectionLabel text="Behaviour Analytics" />

    <AnCard title="Test Compliance" subtitle="Recommended vs. actual testing frequency">
      <ProgressRow label="HbA1c" pct={100} value="4/4" color="#16A34A" />
      <ProgressRow label="Lipid Panel" pct={75} value="3/4" color="#D97706" />
      <ProgressRow label="Kidney Panel" pct={50} value="2/4" color="#D97706" />
      <ProgressRow label="Vit D" pct={50} value="2/4" color="#D97706" />
      <ProgressRow label="Retinal Scan" pct={0} value="0/2" color="#DC2626" />
      <ProgressRow label="Urine ACR" pct={0} value="0/2" color="#DC2626" />
      <InsightBox>
        Retinal screening and urine ACR are overdue — both recommended annually for diabetic patients. Schedule before Jun 2025.
      </InsightBox>
    </AnCard>

    <AnCard title="Order-to-Sample Lag" subtitle="Days between doctor order and lab visit" style={{marginTop: vs(10)}}>
      <BarChart
        maxVal={18}
        bars={[
          {label: 'S1', topLabel: '3d', value: 3, color: '#16A34A'},
          {label: 'S2', topLabel: '7d', value: 7, color: '#D97706'},
          {label: 'S3', topLabel: '5d', value: 5, color: '#16A34A'},
          {label: 'S4', topLabel: '14d', value: 14, color: '#DC2626'},
          {label: 'S5', topLabel: '4d', value: 4, color: '#16A34A'},
        ]}
      />
      <InsightBox>
        Session 4 had a 14-day lag — coincided with holiday travel. Average lag is 6.6 days; target is under 5.
      </InsightBox>
    </AnCard>

    <SectionLabel text="Spend Analytics" />

    <AnCard title="Session Cost Growth" subtitle="Cost per lab session over time">
      <BarChart
        maxVal={5000}
        bars={[
          {label: 'Jun\'23', topLabel: '₹2.8K', value: 2800, color: '#16A34A'},
          {label: 'Dec\'23', topLabel: '₹3.2K', value: 3200, color: '#0D9488'},
          {label: 'Jun\'24', topLabel: '₹3.4K', value: 3400, color: '#D97706'},
          {label: 'Dec\'24', topLabel: '₹4.4K', value: 4400, color: '#DC2626'},
          {label: 'Mar\'25', topLabel: '₹4.2K', value: 4200, color: '#DC2626'},
        ]}
      />
      <InsightBox>
        50% cost increase over 5 sessions — driven by added cardiac markers and Vit D testing.
      </InsightBox>
    </AnCard>

    <AnCard title="Provider Comparison" subtitle="You use a single provider" style={{marginTop: vs(10)}}>
      <View style={{gap: vs(4)}}>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Current provider</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary}>MedLab Diagnostics</AppText>
        </View>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Avg cost/test</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary}>₹327</AppText>
        </View>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Market avg</AppText>
          <AppText variant="bodyBold" color="#16A34A">₹280</AppText>
        </View>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Potential saving</AppText>
          <AppText variant="bodyBold" color="#16A34A">₹2,585/yr</AppText>
        </View>
      </View>
      <InsightBox>
        Switching to a competitive provider or using bundled packages could save ₹2,500+ annually with same test quality.
      </InsightBox>
    </AnCard>

    <AnCard title="Most Expensive Tests" subtitle="Top 5 by cost per test" style={{marginTop: vs(10)}}>
      <TableRow isHeader cells={['Test', 'Cost', 'Freq', 'Total']} />
      <TableRow cells={['HbA1c', '₹450', '4×', '₹1,800']} />
      <TableRow cells={['Lipid Panel', '₹650', '3×', '₹1,950']} />
      <TableRow cells={['Vit D', '₹800', '2×', '₹1,600']} />
      <TableRow cells={['Kidney Panel', '₹520', '2×', '₹1,040']} />
      <TableRow cells={['TSH', '₹350', '2×', '₹700']} />
    </AnCard>

    <AnCard title="Tests per Session" subtitle="Number of tests ordered each visit" style={{marginTop: vs(10)}}>
      <BarChart
        maxVal={16}
        bars={[
          {label: 'S1', topLabel: '8', value: 8, color: Colors.accent},
          {label: 'S2', topLabel: '9', value: 9, color: Colors.accent},
          {label: 'S3', topLabel: '11', value: 11, color: '#D97706'},
          {label: 'S4', topLabel: '14', value: 14, color: '#DC2626'},
          {label: 'S5', topLabel: '13', value: 13, color: '#DC2626'},
        ]}
      />
    </AnCard>

    <AnCard title="Compliance Analysis" subtitle="Coverage vs. recommended panel" style={{marginTop: vs(10)}}>
      <View style={{gap: vs(4)}}>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Recommended tests</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary}>18</AppText>
        </View>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Tests completed</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary}>14</AppText>
        </View>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Compliance rate</AppText>
          <AppText variant="bodyBold" color="#D97706">78%</AppText>
        </View>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Missing</AppText>
          <AppText variant="bodyBold" color="#DC2626">Retinal, Urine ACR, Foot Exam, ECG</AppText>
        </View>
      </View>
    </AnCard>
  </View>
);

/* ════════════════════════════════════════════════════
   TAB 3: DOCTORS
   ════════════════════════════════════════════════════ */
const DoctorsSub = () => (
  <View>
    <HeroCard
      bigNumber="₹14.8K"
      bigLabel="Total Doctor Spend · Jan 2021 – Mar 2026"
      kpis={[
        {value: '24', label: 'Visits'},
        {value: '₹617', label: 'Avg/visit'},
        {value: '5', label: 'Doctors'},
        {value: '4', label: 'Specialties'},
      ]}
      chips={[
        {text: 'Endocrinologist is primary — 10 visits, 42% of total', bg: 'rgba(13,148,136,0.22)', color: '#5EEAD4'},
        {text: 'Follow-up compliance 71% — 5 of 7 recommended done', bg: 'rgba(217,119,6,0.22)', color: '#FCD34D'},
        {text: 'No dentist or ophthalmologist visits in records', bg: 'rgba(220,38,38,0.22)', color: '#FCA5A5'},
      ]}
    />

    <StatStrip items={[
      {label: 'Endocrinology', value: '10', sub: '₹6,500', color: '#0D9488'},
      {label: 'Cardiology', value: '6', sub: '₹4,200', color: '#DC2626'},
      {label: 'GP', value: '4', sub: '₹1,600', color: '#16A34A'},
      {label: 'Physiotherapy', value: '3', sub: '₹2,100', color: '#7C3AED'},
      {label: 'Dermatology', value: '1', sub: '₹400', color: '#D97706'},
    ]} />

    <SectionLabel text="Behaviour Analytics" />

    <AnCard title="Follow-up Compliance" subtitle="Recommended vs. completed follow-ups">
      <ProgressRow label="Endocrinology" pct={83} value="5/6" color="#16A34A" />
      <ProgressRow label="Cardiology" pct={67} value="2/3" color="#D97706" />
      <ProgressRow label="GP" pct={75} value="3/4" color="#D97706" />
      <ProgressRow label="Physiotherapy" pct={50} value="1/2" color="#DC2626" />
      <InsightBox>
        Overall follow-up compliance is 71%. Missed cardiology follow-up in Nov 2024 — reschedule as priority.
      </InsightBox>
    </AnCard>

    <AnCard title="Priority Doctor Actions" subtitle="AI-recommended next steps" style={{marginTop: vs(10)}}>
      <InsightBullet color="#DC2626" bg="rgba(220,38,38,0.08)" icon="alert-circle">
        <AppText variant="small" color="#DC2626" style={{fontWeight: '700'}}>Ophthalmologist visit overdue: </AppText>
        <AppText variant="small" color="#DC2626">No retinal screening since diagnosis — schedule within 4 weeks</AppText>
      </InsightBullet>
      <InsightBullet color="#D97706" bg="rgba(217,119,6,0.08)" icon="calendar">
        <AppText variant="small" color="#D97706" style={{fontWeight: '700'}}>Cardiology follow-up missed: </AppText>
        <AppText variant="small" color="#D97706">Was due Nov 2024 — book within 2 weeks to review lipid progress</AppText>
      </InsightBullet>
      <InsightBullet color="#0D9488" bg="rgba(13,148,136,0.08)" icon="checkmark-circle">
        <AppText variant="small" color="#0D9488" style={{fontWeight: '700'}}>Endocrinology on track: </AppText>
        <AppText variant="small" color="#0D9488">Next visit scheduled Apr 2025 — bring updated HbA1c results</AppText>
      </InsightBullet>
      <InsightBullet color="#7C3AED" bg="rgba(124,58,237,0.08)" icon="fitness">
        <AppText variant="small" color="#7C3AED" style={{fontWeight: '700'}}>Physio discontinued early: </AppText>
        <AppText variant="small" color="#7C3AED">Only 3 of 8 recommended sessions completed — consider resuming</AppText>
      </InsightBullet>
    </AnCard>

    <SectionLabel text="Spend Analytics" />

    <AnCard title="Doctor Rankings" subtitle="By total spend">
      <TableRow isHeader cells={['Doctor', 'Visits', 'Spend', 'Avg']} />
      <TableRow cells={['Dr. Meera K.', '10', '₹6,500', '₹650']} />
      <TableRow cells={['Dr. Suresh R.', '6', '₹4,200', '₹700']} />
      <TableRow cells={['Dr. Anitha K.', '4', '₹1,600', '₹400']} />
      <TableRow cells={['Dr. Ramya S.', '3', '₹2,100', '₹700']} />
      <TableRow cells={['Dr. Priya M.', '1', '₹400', '₹400']} />
    </AnCard>

    <AnCard title="Spend by Specialty" subtitle="Category breakdown" style={{marginTop: vs(10)}}>
      <ProgressRow label="Endocrinology" pct={44} value="₹6.5K" color="#0D9488" />
      <ProgressRow label="Cardiology" pct={28} value="₹4.2K" color="#DC2626" />
      <ProgressRow label="Physiotherapy" pct={14} value="₹2.1K" color="#7C3AED" />
      <ProgressRow label="GP" pct={11} value="₹1.6K" color="#16A34A" />
      <ProgressRow label="Dermatology" pct={3} value="₹0.4K" color="#D97706" />
    </AnCard>

    <AnCard title="Visit Frequency" subtitle="Visits per quarter" style={{marginTop: vs(10)}}>
      <BarChart
        maxVal={8}
        bars={[
          {label: 'Q2\'24', topLabel: '5', value: 5, color: Colors.accent},
          {label: 'Q3\'24', topLabel: '6', value: 6, color: Colors.accent},
          {label: 'Q4\'24', topLabel: '7', value: 7, color: '#D97706'},
          {label: 'Q1\'25', topLabel: '6', value: 6, color: Colors.accent},
        ]}
      />
    </AnCard>

    <AnCard title="Doctor Loyalty" subtitle="Repeat visit patterns" style={{marginTop: vs(10)}}>
      <View style={{gap: vs(4)}}>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Primary doctor</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary}>Dr. Meera K.</AppText>
        </View>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Loyalty rate</AppText>
          <AppText variant="bodyBold" color="#16A34A">42%</AppText>
        </View>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Avg doctors/year</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary}>3.2</AppText>
        </View>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Doctor switching</AppText>
          <AppText variant="bodyBold" color="#16A34A">Low</AppText>
        </View>
      </View>
    </AnCard>

    <AnCard title="Cost per Visit Type" subtitle="Consultation vs. follow-up" style={{marginTop: vs(10)}}>
      <View style={{gap: vs(4)}}>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>New consultation</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary}>₹750 avg</AppText>
        </View>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Follow-up</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary}>₹500 avg</AppText>
        </View>
        <View style={st.burdenRow}>
          <AppText variant="small" color={Colors.textSecondary}>Teleconsult</AppText>
          <AppText variant="bodyBold" color="#16A34A">₹300 avg</AppText>
        </View>
      </View>
      <InsightBox>
        Teleconsults save 60% over in-person. Consider teleconsult for routine follow-ups to save ₹2K/year.
      </InsightBox>
    </AnCard>

    <AnCard title="Doctor Insights" subtitle="AI-generated observations" style={{marginTop: vs(10)}}>
      <InsightBullet color="#0D9488" bg="rgba(13,148,136,0.08)" icon="shield-checkmark">
        <AppText variant="small" color="#0D9488" style={{fontWeight: '700'}}>Strong endo relationship: </AppText>
        <AppText variant="small" color="#0D9488">10 visits with Dr. Meera — continuity supports better outcomes</AppText>
      </InsightBullet>
      <InsightBullet color="#DC2626" bg="rgba(220,38,38,0.08)" icon="eye-off">
        <AppText variant="small" color="#DC2626" style={{fontWeight: '700'}}>Missing specialists: </AppText>
        <AppText variant="small" color="#DC2626">No ophthalmologist or dentist — both recommended annually for diabetics</AppText>
      </InsightBullet>
      <InsightBullet color="#D97706" bg="rgba(217,119,6,0.08)" icon="time">
        <AppText variant="small" color="#D97706" style={{fontWeight: '700'}}>Visit clustering: </AppText>
        <AppText variant="small" color="#D97706">60% of visits in Q3–Q4 — suggests reactive pattern vs. scheduled preventive</AppText>
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
      bigNumber="₹1.48L"
      bigLabel="Total Medication Spend · Jan 2021 – Mar 2026"
      kpis={[
        {value: '₹2,274', label: 'Monthly avg'},
        {value: '₹27.3K', label: 'Annualised'},
        {value: '6', label: 'Active meds'},
        {value: '78%', label: 'Adherence'},
      ]}
      chips={[
        {text: 'PM Metformin 58% adherence — worst performer, drags HbA1c', bg: 'rgba(220,38,38,0.22)', color: '#FCA5A5'},
        {text: 'Pharmacy spend grown 5× since 2021 after cardiac meds added', bg: 'rgba(217,119,6,0.22)', color: '#FCD34D'},
        {text: 'All branded — generic switch could save ₹8K/yr', bg: 'rgba(99,102,241,0.22)', color: '#A5B4FC'},
      ]}
    />

    <StatStrip items={[
      {label: 'Amlodipine', value: '100%', sub: '₹380/mo', color: '#16A34A'},
      {label: 'Metformin AM', value: '97%', sub: '₹220/mo', color: '#16A34A'},
      {label: 'Atorvastatin', value: '97%', sub: '₹520/mo', color: '#16A34A'},
      {label: 'Olmesartan', value: '96%', sub: '₹440/mo', color: '#16A34A'},
      {label: 'Methylcobal.', value: '84%', sub: '₹280/mo', color: '#D97706'},
      {label: 'Metformin PM', value: '58%', sub: '₹220/mo', color: '#DC2626'},
    ]} />

    <SectionLabel text="Behaviour Analytics" />

    <AnCard title="PM Metformin Miss Pattern" subtitle="Misses by day of week">
      <BarChart
        maxVal={10}
        bars={[
          {label: 'Mon', topLabel: '3', value: 3, color: '#D97706'},
          {label: 'Tue', topLabel: '2', value: 2, color: '#16A34A'},
          {label: 'Wed', topLabel: '2', value: 2, color: '#16A34A'},
          {label: 'Thu', topLabel: '2', value: 2, color: '#16A34A'},
          {label: 'Fri', topLabel: '4', value: 4, color: '#D97706'},
          {label: 'Sat', topLabel: '8', value: 8, color: '#DC2626'},
          {label: 'Sun', topLabel: '9', value: 9, color: '#DC2626'},
        ]}
      />
      <InsightBox>
        Weekend misses account for 65% of PM Metformin skips. Late dinners + social activities disrupt routine.
      </InsightBox>
    </AnCard>

    <AnCard title="Medication Streak" subtitle="Current consecutive days taken" style={{marginTop: vs(10)}}>
      <ProgressRow label="Amlodipine" pct={100} value="92 days" color="#16A34A" />
      <ProgressRow label="Metformin AM" pct={95} value="88 days" color="#16A34A" />
      <ProgressRow label="Atorvastatin" pct={92} value="85 days" color="#16A34A" />
      <ProgressRow label="Olmesartan" pct={90} value="83 days" color="#16A34A" />
      <ProgressRow label="Methylcobal." pct={60} value="12 days" color="#D97706" />
      <ProgressRow label="Metformin PM" pct={15} value="2 days" color="#DC2626" />
    </AnCard>

    <AnCard title="Priority Actions" subtitle="AI-recommended medication actions" style={{marginTop: vs(10)}}>
      <InsightBullet color="#DC2626" bg="rgba(220,38,38,0.08)" icon="alert-circle">
        <AppText variant="small" color="#DC2626" style={{fontWeight: '700'}}>Fix PM Metformin: </AppText>
        <AppText variant="small" color="#DC2626">Set weekend dinner alarm, pair with Atorvastatin as anchor habit</AppText>
      </InsightBullet>
      <InsightBullet color="#D97706" bg="rgba(217,119,6,0.08)" icon="notifications">
        <AppText variant="small" color="#D97706" style={{fontWeight: '700'}}>Methylcobalamin gaps: </AppText>
        <AppText variant="small" color="#D97706">84% adherence — add to morning pill box with Metformin AM</AppText>
      </InsightBullet>
      <InsightBullet color="#0D9488" bg="rgba(13,148,136,0.08)" icon="swap-horizontal">
        <AppText variant="small" color="#0D9488" style={{fontWeight: '700'}}>Generic switch opportunity: </AppText>
        <AppText variant="small" color="#0D9488">Atorvastatin + Olmesartan have generic equivalents — save ₹8K/yr</AppText>
      </InsightBullet>
    </AnCard>

    <SectionLabel text="Spend Analytics" />

    <AnCard title="Adherence Heatmap" subtitle="Weekly adherence pattern (last 8 weeks)">
      <View style={{gap: vs(4)}}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(2)}}>
          <AppText variant="small" color={Colors.textTertiary} style={{width: s(60), fontSize: ms(9)}}>Med</AppText>
          {['W1','W2','W3','W4','W5','W6','W7','W8'].map(w => (
            <AppText key={w} variant="small" color={Colors.textTertiary} style={{flex: 1, textAlign: 'center', fontSize: ms(8)}}>{w}</AppText>
          ))}
        </View>
        {[
          {name: 'Amlo.', cells: ['N','N','N','N','N','N','N','N']},
          {name: 'Met AM', cells: ['N','N','N','N','N','N','H','N']},
          {name: 'Atorva.', cells: ['N','N','N','H','N','N','N','N']},
          {name: 'Olmes.', cells: ['N','N','N','N','H','N','N','N']},
          {name: 'MeCobl.', cells: ['N','N','H','N','H','N','H','N']},
          {name: 'Met PM', cells: ['H','N','H','H','N','H','H','N']},
        ].map((row, i) => (
          <View key={i} style={{flexDirection: 'row', alignItems: 'center'}}>
            <AppText variant="small" color={Colors.textPrimary} style={{width: s(60), fontSize: ms(9)}}>{row.name}</AppText>
            {row.cells.map((c, j) => (
              <View key={j} style={{flex: 1, alignItems: 'center'}}>
                <HeatCell
                  letter={c === 'N' ? '✓' : '✗'}
                  bg={c === 'N' ? '#16A34A18' : '#DC262618'}
                  borderColor={c === 'N' ? '#16A34A' : '#DC2626'}
                />
              </View>
            ))}
          </View>
        ))}
      </View>
    </AnCard>

    <AnCard title="Monthly Medication Spend" subtitle="₹/month trend" style={{marginTop: vs(10)}}>
      <BarChart
        maxVal={3000}
        bars={[
          {label: 'Oct', topLabel: '2.1K', value: 2100, color: Colors.accent},
          {label: 'Nov', topLabel: '2.3K', value: 2300, color: Colors.accent},
          {label: 'Dec', topLabel: '2.3K', value: 2300, color: Colors.accent},
          {label: 'Jan', topLabel: '2.3K', value: 2300, color: Colors.accent},
          {label: 'Feb', topLabel: '2.2K', value: 2200, color: Colors.accent},
          {label: 'Mar', topLabel: '2.3K', value: 2300, color: Colors.accent},
        ]}
      />
    </AnCard>

    <AnCard title="Current Spend by Medication" subtitle="Monthly cost breakdown" style={{marginTop: vs(10)}}>
      <ProgressRow label="Atorvastatin" pct={23} value="₹520" color="#DC2626" />
      <ProgressRow label="Olmesartan" pct={19} value="₹440" color="#D97706" />
      <ProgressRow label="Amlodipine" pct={17} value="₹380" color="#0D9488" />
      <ProgressRow label="Methylcobal." pct={12} value="₹280" color="#7C3AED" />
      <ProgressRow label="Metformin AM" pct={10} value="₹220" color="#16A34A" />
      <ProgressRow label="Metformin PM" pct={10} value="₹220" color="#16A34A" />
    </AnCard>

    <AnCard title="Medication Timeline" subtitle="When each medication was started" style={{marginTop: vs(10)}}>
      <View style={{marginTop: vs(4)}}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(6)}}>
          <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(8)}}>2021</AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(8)}}>2022</AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(8)}}>2023</AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(8)}}>2024</AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(8)}}>2025</AppText>
        </View>
        <GanttBar label="Metformin AM" startPct={0} widthPct={100} color="#16A34A" />
        <GanttBar label="Metformin PM" startPct={0} widthPct={100} color="#DC2626" />
        <GanttBar label="Amlodipine" startPct={20} widthPct={80} color="#0D9488" />
        <GanttBar label="Atorvastatin" startPct={50} widthPct={50} color="#D97706" />
        <GanttBar label="Olmesartan" startPct={50} widthPct={50} color="#7C3AED" />
        <GanttBar label="Methylcobal." startPct={60} widthPct={40} color="#6366F1" />
      </View>
    </AnCard>

    <AnCard title="Generic vs Branded" subtitle="Cost comparison" style={{marginTop: vs(10)}}>
      <TableRow isHeader cells={['Medication', 'Current', 'Generic', 'Save']} />
      <TableRow cells={['Atorvastatin', '₹520', '₹180', '₹340']} />
      <TableRow cells={['Olmesartan', '₹440', '₹160', '₹280']} />
      <TableRow cells={['Amlodipine', '₹380', '₹120', '₹260']} />
      <TableRow cells={['Methylcobal.', '₹280', '₹90', '₹190']} />
      <TableRow cells={['Metformin', '₹440', '₹200', '₹240']} />
      <InsightBox>
        Total potential saving: ₹8,160/year by switching to generic equivalents. Discuss with your doctor.
      </InsightBox>
    </AnCard>

    <AnCard title="Per-Dose Cost" subtitle="Cost efficiency per dose" style={{marginTop: vs(10)}}>
      <View style={{gap: vs(4)}}>
        {[
          {name: 'Atorvastatin 10mg', cost: '₹17.3', freq: '1×/day'},
          {name: 'Olmesartan 20mg', cost: '₹14.7', freq: '1×/day'},
          {name: 'Amlodipine 5mg', cost: '₹12.7', freq: '1×/day'},
          {name: 'Methylcobalamin', cost: '₹9.3', freq: '1×/day'},
          {name: 'Metformin 500mg AM', cost: '₹7.3', freq: '1×/day'},
          {name: 'Metformin 500mg PM', cost: '₹7.3', freq: '1×/day'},
        ].map((d, i) => (
          <View key={i} style={st.burdenRow}>
            <View style={{flex: 1}}>
              <AppText variant="small" color={Colors.textPrimary}>{d.name}</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(9)}}>{d.freq}</AppText>
            </View>
            <AppText variant="bodyBold" color={Colors.textPrimary}>{d.cost}</AppText>
          </View>
        ))}
      </View>
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
      {/* Sub-tab pills */}
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
  /* Sub-tab pills */
  subPill: {paddingVertical: vs(5), paddingHorizontal: s(12), borderRadius: ms(16), backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderLight},
  subPillActive: {backgroundColor: Colors.accent, borderColor: Colors.accent},

  /* Hero card */
  hero: {backgroundColor: Colors.primary, borderRadius: ms(16), padding: ms(18), marginBottom: vs(4)},
  kpiGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8)},
  kpiBox: {flex: 1, minWidth: '40%', backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: ms(10), paddingVertical: vs(8), paddingHorizontal: s(10), alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.12)'},
  heroChip: {borderRadius: ms(8), paddingVertical: vs(5), paddingHorizontal: s(10)},

  /* Stat strip */
  statStripCard: {backgroundColor: Colors.white, borderRadius: ms(12), padding: ms(12), minWidth: s(110), borderWidth: 0.5, borderColor: Colors.borderLight, borderTopWidth: 2.5, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1},

  /* Section label */
  secLblWrap: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(10)},
  secLblLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.borderLight},

  /* AnCard */
  anCard: {backgroundColor: Colors.white, borderRadius: ms(14), padding: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, marginBottom: vs(10), shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.04, shadowRadius: 2, elevation: 1},
  anCardInnerBg: {borderRadius: ms(10), padding: ms(10), gap: vs(6)},

  /* Insight bullet */
  insightBullet: {flexDirection: 'row', alignItems: 'flex-start', gap: s(8), borderLeftWidth: 3, borderRadius: ms(6), paddingVertical: vs(6), paddingHorizontal: s(10), marginBottom: vs(4)},

  /* Progress row */
  progressRow: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(6), gap: s(6)},
  progressDot: {width: ms(6), height: ms(6), borderRadius: ms(3)},
  progressTrack: {flex: 1, height: ms(6), backgroundColor: Colors.background, borderRadius: ms(3), overflow: 'hidden'},
  progressFill: {height: '100%', borderRadius: ms(3)},

  /* Insight box */
  insightBox: {backgroundColor: '#EEF2FF', borderRadius: ms(8), padding: ms(10), marginTop: vs(8), borderWidth: 0.5, borderColor: '#C7D2FE'},

  /* Heat cell */
  heatCell: {width: ms(28), height: ms(28), borderRadius: ms(4), borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginVertical: vs(1)},

  /* Table */
  tableRow: {flexDirection: 'row', paddingVertical: vs(6), paddingHorizontal: s(4), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.borderLight},
  tableCell: {flex: 1, justifyContent: 'center'},

  /* Benchmark grid */
  benchGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8)},
  benchCell: {flex: 1, minWidth: '42%', borderRadius: ms(10), padding: ms(12), alignItems: 'center'},

  /* Burden / key-value row */
  burdenRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: vs(4), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.borderLight},

  /* Status badge */
  statusBadge: {paddingHorizontal: s(6), paddingVertical: vs(1), borderRadius: ms(6), borderWidth: 1, marginLeft: 'auto'},

  /* Gantt */
  ganttTrack: {height: ms(10), backgroundColor: Colors.background, borderRadius: ms(5), overflow: 'hidden', position: 'relative'},
  ganttFill: {position: 'absolute', top: 0, height: '100%', borderRadius: ms(5)},
});

export default AnalyticsTab;
