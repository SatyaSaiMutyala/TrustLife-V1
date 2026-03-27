import React, {useState, useMemo} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {NUTRITION_GOALS, TREND_HISTORY} from '../../../constants/foodData';

/* ─── Constants ─────────────────────────────────────── */

const RANGE_OPTIONS = ['7', '14', '30'];

const G = NUTRITION_GOALS || {};
const GOALS = {
  cal: G.cal || 1650, pro: G.pro || 65, carb: G.carb || 185,
  fat: G.fat || 55, fib: G.fib || 28, sug: G.sug || 30,
  sod: G.sod || 1500,
};

/* ─── Helpers ───────────────────────────────────────── */

const avg = (arr) => arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;
const fmtN = (n) => (n >= 1000 ? `${(n / 1000).toFixed(1)}k` : n % 1 ? n.toFixed(1) : `${n}`);

const barColor = (val, goal, isUpper) => {
  if (isUpper) return val > goal ? Colors.red : val > goal * 0.85 ? Colors.amber : Colors.accent;
  return val >= goal ? Colors.accent : val >= goal * 0.7 ? Colors.amber : Colors.red;
};

/* ─── Sub-components ────────────────────────────────── */

const RangePill = ({label, active, onPress}) => (
  <TouchableOpacity
    style={[sty.pill, active && sty.pillActive]}
    onPress={onPress}
    activeOpacity={0.7}>
    <AppText variant="caption" color={active ? Colors.white : Colors.textSecondary}
      style={{fontWeight: active ? '700' : '400'}}>
      {label} days
    </AppText>
  </TouchableOpacity>
);

const StatCell = ({label, value, unit, goal, trend, color}) => (
  <View style={sty.statCell}>
    <AppText variant="bodyBold" color={color} style={{fontSize: ms(18)}}>{value}</AppText>
    <AppText variant="small" color={Colors.textTertiary}>{unit}</AppText>
    <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{label}</AppText>
    <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(1)}}>Goal: {goal}</AppText>
    {trend ? <AppText variant="small" color={Colors.textTertiary}>{trend}</AppText> : null}
  </View>
);

const BarChart = ({title, subtitle, data, goal, goalLabel, isUpper}) => {
  const maxVal = Math.max(...data.map(d => d.v), goal * 1.25, 1);
  const targetH = Math.round((goal / maxVal) * vs(56));

  return (
    <View style={sty.chartCard}>
      <AppText variant="bodyBold" color={Colors.textPrimary}>{title}</AppText>
      {subtitle ? (
        <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          {subtitle}
        </AppText>
      ) : null}
      <View style={sty.chartWrap}>
        {/* Target line */}
        <View style={[sty.targetLine, {bottom: targetH}]}>
          <View style={sty.targetDash} />
          <AppText variant="small" color={Colors.red} style={{marginLeft: s(4), fontSize: ms(8)}}>
            {goalLabel || fmtN(goal)}
          </AppText>
        </View>
        {/* Bars */}
        <View style={sty.barsRow}>
          {data.map((d, i) => (
            <View key={i} style={{flex: 1, alignItems: 'center'}}>
              <View style={{
                flex: 1,
                height: Math.max(3, Math.round((d.v / maxVal) * vs(56))),
                backgroundColor: barColor(d.v, goal, isUpper),
                borderTopLeftRadius: ms(2),
                borderTopRightRadius: ms(2),
                width: '100%',
              }} />
            </View>
          ))}
        </View>
        {/* Date labels */}
        <View style={sty.dateRow}>
          <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(8)}}>
            {data[0]?.d || ''}
          </AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(8)}}>
            {data[data.length - 1]?.d || ''}
          </AppText>
        </View>
      </View>
    </View>
  );
};

const FlagRow = ({emoji, title, note, type}) => {
  const bg = type === 'good' ? Colors.tealBg : type === 'warning' ? Colors.amberBg : Colors.redBg;
  const tc = type === 'good' ? Colors.tealText : type === 'warning' ? Colors.amberText : Colors.redText;
  return (
    <View style={[sty.flagRow, {backgroundColor: bg}]}>
      <AppText style={{fontSize: ms(14)}}>{emoji}</AppText>
      <View style={{flex: 1, marginLeft: s(8)}}>
        <AppText variant="caption" color={tc} style={{fontWeight: '600'}}>{title}</AppText>
        <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>{note}</AppText>
      </View>
    </View>
  );
};

/* ─── Main Component ───────────────────────────────── */

const TrendsTab = () => {
  const [range, setRange] = useState('14');
  const days = parseInt(range, 10);

  const history = useMemo(() => {
    const full = (TREND_HISTORY || []).map(d => ({
      date: d.date, cal: d.cal || 0, pro: d.pro || 0, carb: d.carb || 0,
      fat: d.fat || 0, fib: d.fib || 0, sug: d.sug || 0, sod: d.sod || 0,
    }));
    return full.slice(-days);
  }, [days]);

  const n = history.length || 1;
  const shortDate = (d) => d ? d.slice(5) : '';

  /* ── Averages ── */
  const avgs = useMemo(() => ({
    cal: Math.round(avg(history.map(d => d.cal))),
    pro: Math.round(avg(history.map(d => d.pro))),
    carb: Math.round(avg(history.map(d => d.carb))),
    fat: Math.round(avg(history.map(d => d.fat))),
    fib: Math.round(avg(history.map(d => d.fib))),
    sod: Math.round(avg(history.map(d => d.sod))),
  }), [history]);

  /* ── Trend notes ── */
  const trendNote = (val, goal, upper) => {
    const diff = val - goal;
    if (Math.abs(diff) <= goal * 0.05) return 'On target';
    return upper
      ? (diff > 0 ? `+${Math.abs(Math.round(diff))} over` : `${Math.abs(Math.round(diff))} under`)
      : (diff >= 0 ? 'Met' : `${Math.abs(Math.round(diff))} short`);
  };

  /* ── Chart data builders ── */
  const chartData = (key) => history.map(d => ({v: d[key], d: shortDate(d.date)}));

  /* ── Macro split ── */
  const macro = useMemo(() => {
    const totalG = (avgs.pro + avgs.carb + avgs.fat) || 1;
    return {
      proPct: Math.round((avgs.pro / totalG) * 100),
      carbPct: Math.round((avgs.carb / totalG) * 100),
      fatPct: Math.round((avgs.fat / totalG) * 100),
    };
  }, [avgs]);

  /* ── Clinical flags ── */
  const sodOver = history.filter(d => d.sod > GOALS.sod).length;
  const sugOver = history.filter(d => d.sug > GOALS.sug).length;
  const fibMet = history.filter(d => d.fib >= GOALS.fib).length;
  const proMet = history.filter(d => d.pro >= GOALS.pro * 0.9).length;

  /* ── Ayu insight ── */
  const ayuInsight = useMemo(() => {
    if (history.length < 3) return null;
    const parts = [];
    const calDiff = avgs.cal - GOALS.cal;
    if (Math.abs(calDiff) <= GOALS.cal * 0.05) {
      parts.push(`Average intake (${fmtN(avgs.cal)} kcal) aligns well with your ${fmtN(GOALS.cal)} kcal target.`);
    } else if (calDiff > 0) {
      parts.push(`Averaging ${fmtN(avgs.cal)} kcal/day — ${Math.round(calDiff)} kcal over target.`);
    } else {
      parts.push(`Averaging ${fmtN(avgs.cal)} kcal/day — ${Math.abs(Math.round(calDiff))} kcal below target.`);
    }
    if (sodOver > n * 0.5) parts.push(`Sodium exceeded limit on ${sodOver}/${n} days — prioritise reducing processed food and cooking salt.`);
    if (sugOver > n * 0.5) parts.push(`Sugar over limit on ${sugOver}/${n} days — reduce sweetened beverages and snacks.`);
    parts.push('Consider Vitamin D supplementation — dietary sources alone rarely meet the 600 IU daily requirement.');
    return parts.join(' ');
  }, [history, avgs, sodOver, sugOver, n]);

  /* ── Charts config ── */
  const charts = [
    {title: 'Calories', key: 'cal', goal: GOALS.cal, unit: 'kcal', upper: true},
    {title: 'Protein', key: 'pro', goal: GOALS.pro, unit: 'g', upper: false},
    {title: 'Carbs', key: 'carb', goal: GOALS.carb, unit: 'g', upper: true},
    {title: 'Fat', key: 'fat', goal: GOALS.fat, unit: 'g', upper: true},
    {title: 'Fibre', key: 'fib', goal: GOALS.fib, unit: 'g', upper: false},
    {title: 'Sugar', key: 'sug', goal: GOALS.sug, unit: 'g', upper: true},
    {title: 'Sodium', key: 'sod', goal: GOALS.sod, unit: 'mg', upper: true},
  ];

  return (
    <ScrollView style={sty.container} showsVerticalScrollIndicator={false}>
      {/* 1. Date Range Pills */}
      <View style={sty.pillRow}>
        {RANGE_OPTIONS.map(r => (
          <RangePill key={r} label={r} active={range === r} onPress={() => setRange(r)} />
        ))}
      </View>

      {/* 2. Headline Stats */}
      <View style={sty.headGrid}>
        <StatCell label="Avg Calories" value={fmtN(avgs.cal)} unit="kcal"
          goal={`${fmtN(GOALS.cal)} kcal`} color={Math.abs(avgs.cal - GOALS.cal) <= GOALS.cal * 0.1 ? Colors.accent : Colors.amber}
          trend={trendNote(avgs.cal, GOALS.cal, true)} />
        <StatCell label="Avg Protein" value={avgs.pro} unit="g"
          goal={`${GOALS.pro}g`} color={avgs.pro >= GOALS.pro * 0.9 ? Colors.accent : Colors.amber}
          trend={trendNote(avgs.pro, GOALS.pro, false)} />
        <StatCell label="Avg Carbs" value={avgs.carb} unit="g"
          goal={`${GOALS.carb}g`} color={avgs.carb <= GOALS.carb * 1.1 ? Colors.accent : Colors.amber}
          trend={trendNote(avgs.carb, GOALS.carb, true)} />
        <StatCell label="Avg Fat" value={avgs.fat} unit="g"
          goal={`${GOALS.fat}g`} color={avgs.fat <= GOALS.fat * 1.1 ? Colors.accent : Colors.amber}
          trend={trendNote(avgs.fat, GOALS.fat, true)} />
        <StatCell label="Avg Fibre" value={avgs.fib} unit="g"
          goal={`${GOALS.fib}g`} color={avgs.fib >= GOALS.fib * 0.9 ? Colors.accent : Colors.red}
          trend={trendNote(avgs.fib, GOALS.fib, false)} />
        <StatCell label="Avg Sodium" value={fmtN(avgs.sod)} unit="mg"
          goal={`${fmtN(GOALS.sod)} mg`} color={avgs.sod <= GOALS.sod ? Colors.accent : Colors.red}
          trend={sodOver > 0 ? `Over ${sodOver}/${n} days` : 'Under limit'} />
      </View>

      {/* 3. Trend Charts */}
      {charts.map(c => (
        <BarChart key={c.key} title={`${c.title} Trend`}
          subtitle={`Target: ${fmtN(c.goal)} ${c.unit}/day`}
          data={chartData(c.key)} goal={c.goal}
          goalLabel={`${fmtN(c.goal)} ${c.unit}`} isUpper={c.upper} />
      ))}

      {/* 4. Macro Split Card */}
      <View style={sty.chartCard}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>Macro Split</AppText>
        <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          Average over {days} days
        </AppText>
        <View style={sty.macroBar}>
          <View style={[sty.macroSeg, {flex: macro.proPct, backgroundColor: Colors.blue,
            borderTopLeftRadius: ms(6), borderBottomLeftRadius: ms(6)}]} />
          <View style={[sty.macroSeg, {flex: macro.carbPct, backgroundColor: Colors.amber}]} />
          <View style={[sty.macroSeg, {flex: macro.fatPct, backgroundColor: Colors.purple,
            borderTopRightRadius: ms(6), borderBottomRightRadius: ms(6)}]} />
        </View>
        <View style={sty.macroCols}>
          {[
            {label: 'Protein', pct: macro.proPct, g: avgs.pro, range: '20–30%', c: Colors.blue},
            {label: 'Carbs', pct: macro.carbPct, g: avgs.carb, range: '40–50%', c: Colors.amber},
            {label: 'Fat', pct: macro.fatPct, g: avgs.fat, range: '25–35%', c: Colors.purple},
          ].map(m => (
            <View key={m.label} style={sty.macroCol}>
              <View style={[sty.dot, {backgroundColor: m.c}]} />
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{m.label}</AppText>
              <AppText variant="bodyBold" color={m.c}>{m.pct}%</AppText>
              <AppText variant="small" color={Colors.textTertiary}>{m.g}g avg</AppText>
              <AppText variant="small" color={Colors.textTertiary}>Target: {m.range}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* 5. Clinical Nutrition Flags */}
      <View style={sty.section}>
        <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginBottom: vs(6)}}>
          Clinical Nutrition Flags
        </AppText>
        <FlagRow emoji="🧂" title={`Sodium over limit: ${sodOver}/${n} days`}
          note="HTN patients should stay under 1500 mg daily."
          type={sodOver > n * 0.5 ? 'bad' : sodOver > 0 ? 'warning' : 'good'} />
        <FlagRow emoji="🍬" title={`Sugar over limit: ${sugOver}/${n} days`}
          note="Excess sugar drives insulin resistance and weight gain."
          type={sugOver > n * 0.5 ? 'bad' : sugOver > 0 ? 'warning' : 'good'} />
        <FlagRow emoji="🥬" title={`Fibre adequacy: ${fibMet}/${n} days met`}
          note="Each 7g/day increase reduces T2DM risk by 6%."
          type={fibMet >= n * 0.7 ? 'good' : fibMet >= n * 0.4 ? 'warning' : 'bad'} />
        <FlagRow emoji="💪" title={`Protein adequacy: ${proMet}/${n} days met`}
          note="Aim for 1.2–1.6 g/kg/day to preserve lean mass."
          type={proMet >= n * 0.7 ? 'good' : proMet >= n * 0.4 ? 'warning' : 'bad'} />
        <FlagRow emoji="☀️" title="Vitamin D gap: Likely <30% most days"
          note="Dietary sources rarely meet 600 IU — consider supplementation."
          type="bad" />
      </View>

      {/* 6. Ayu Trend Insight */}
      {ayuInsight ? (
        <View style={[sty.chartCard, {backgroundColor: Colors.tealBg, borderColor: Colors.accent}]}>
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)}}>
            <AppText style={{fontSize: ms(16)}}>🌿</AppText>
            <AppText variant="bodyBold" color={Colors.tealText} style={{marginLeft: s(6)}}>
              Ayu Trend Insight
            </AppText>
          </View>
          <AppText variant="caption" color={Colors.textSecondary} style={{lineHeight: ms(18)}}>
            {ayuInsight}
          </AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(8)}}>
            Based on {n} days of tracked data
          </AppText>
        </View>
      ) : null}

      <View style={{height: vs(100)}} />
    </ScrollView>
  );
};

/* ─── Styles ───────────────────────────────────────── */

const sty = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: s(16), paddingTop: vs(8)},
  section: {marginTop: vs(16)},

  /* 1. Pills */
  pillRow: {flexDirection: 'row', gap: s(8), marginTop: vs(4)},
  pill: {
    flex: 1, alignItems: 'center', paddingVertical: vs(8), borderRadius: ms(20),
    backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderLight,
  },
  pillActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},

  /* 2. Headline grid */
  headGrid: {
    flexDirection: 'row', flexWrap: 'wrap', gap: s(8), marginTop: vs(14),
  },
  statCell: {
    width: '47%', backgroundColor: Colors.white, borderRadius: ms(14),
    padding: s(12), borderWidth: 1, borderColor: Colors.borderLight, alignItems: 'center',
  },

  /* 3. Chart card */
  chartCard: {
    backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14),
    marginTop: vs(12), borderWidth: 1, borderColor: Colors.borderLight,
  },
  chartWrap: {marginTop: vs(10), height: vs(80), position: 'relative'},
  targetLine: {
    position: 'absolute', left: 0, right: 0, flexDirection: 'row',
    alignItems: 'center', zIndex: 1,
  },
  targetDash: {flex: 1, height: 1.5, backgroundColor: Colors.red, opacity: 0.5},
  barsRow: {
    flexDirection: 'row', alignItems: 'flex-end', flex: 1, gap: ms(2),
    position: 'absolute', bottom: vs(14), left: 0, right: 0, height: vs(56),
  },
  dateRow: {
    flexDirection: 'row', justifyContent: 'space-between',
    position: 'absolute', bottom: 0, left: 0, right: 0,
  },

  /* 4. Macro */
  macroBar: {
    flexDirection: 'row', height: vs(14), borderRadius: ms(6),
    overflow: 'hidden', marginTop: vs(10),
  },
  macroSeg: {height: '100%'},
  macroCols: {flexDirection: 'row', justifyContent: 'space-around', marginTop: vs(14)},
  macroCol: {alignItems: 'center', gap: vs(2)},
  dot: {width: s(10), height: s(10), borderRadius: s(5), marginBottom: vs(2)},

  /* 5. Flags */
  flagRow: {
    flexDirection: 'row', alignItems: 'center', borderRadius: ms(10),
    padding: s(10), marginTop: vs(6),
  },
});

export default TrendsTab;
