import React, {useState, useMemo} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity, TextInput} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {NUTRITION_GOALS, TREND_HISTORY, calcTotal} from '../../../constants/foodData';

/* ─── Key mapping ─────────────────────────────────── */
const S2L = {
  cal: 'calories', pro: 'protein', carb: 'carbs', fat: 'fat', fib: 'fibre', sug: 'sugar',
  sod: 'sodium', pot: 'potassium', cal_m: 'calcium', mag: 'magnesium', iron: 'iron',
  zinc: 'zinc', selenium: 'selenium', chromium: 'chromium',
  vitC: 'vitC', vitD: 'vitD', vitE: 'vitE', vitK: 'vitK', vitA: 'vitA',
  vitB12: 'b12', vitB6: 'b6', folate: 'folate', omega3: 'omega3',
  phos: 'phosphorus', copper: 'copper', manganese: 'manganese',
};
const mapKeys = (obj) => {
  const r = {};
  Object.entries(obj || {}).forEach(([k, v]) => { r[S2L[k] || k] = v; });
  return r;
};

/* ─── Goals ───────────────────────────────────────── */
const G = NUTRITION_GOALS || {};
const GOALS = {
  calories: G.cal || 1650, protein: G.pro || 65, carbs: G.carb || 185,
  fat: G.fat || 55, fibre: G.fib || 28, sugar: G.sug || 30,
  sodium: G.sod || 1500, potassium: G.pot || 3500, calcium: G.cal_m || 1000,
  magnesium: G.mag || 320, phosphorus: 700, iron: G.iron || 18,
  zinc: G.zinc || 8, selenium: G.selenium || 55, chromium: G.chromium || 25,
  copper: 0.9, manganese: 2.3,
  vitC: G.vitC || 75, vitD: G.vitD || 600, vitE: G.vitE || 15,
  vitK: G.vitK || 90, vitA: G.vitA || 700, b12: G.vitB12 || 2.4,
  b6: G.vitB6 || 1.3, folate: G.folate || 400, omega3: G.omega3 || 1100,
};

/* ─── Section configs ─────────────────────────────── */
const MACROS = [
  {key: 'calories', label: 'Calories', unit: 'kcal', note: 'Calorie control is critical for T2DM management.'},
  {key: 'protein', label: 'Protein', unit: 'g', note: 'Protein at 1.2-1.6 g/kg preserves lean mass.'},
  {key: 'carbs', label: 'Total Carbs', unit: 'g', note: 'Each 10g carb reduction lowers HbA1c by ~0.1%.'},
  {key: 'fat', label: 'Total Fat', unit: 'g', note: 'Limit saturated fat to <10% total energy.'},
  {key: 'fibre', label: 'Fibre', unit: 'g', note: 'Fibre >25g/day reduces post-meal glucose spikes by 20-30%. Slows gastric emptying and improves HbA1c.', clinical: true},
  {key: 'sugar', label: 'Sugars', unit: 'g', upper: true, note: 'WHO recommends <25g added sugar. Excess worsens insulin resistance.'},
];
const ELECTROLYTES = [
  {key: 'sodium', label: 'Sodium', unit: 'mg', upper: true, note: 'HTN limit: <1500 mg/day. Excess sodium raises BP 5-6 mmHg.', clinical: true},
  {key: 'potassium', label: 'Potassium', unit: 'mg'},
  {key: 'calcium', label: 'Calcium', unit: 'mg'},
  {key: 'magnesium', label: 'Magnesium', unit: 'mg'},
  {key: 'phosphorus', label: 'Phosphorus', unit: 'mg'},
  {key: 'zinc', label: 'Zinc', unit: 'mg'},
  {key: 'iron', label: 'Iron', unit: 'mg'},
  {key: 'selenium', label: 'Selenium', unit: 'mcg'},
  {key: 'copper', label: 'Copper', unit: 'mg'},
  {key: 'manganese', label: 'Manganese', unit: 'mg'},
  {key: 'chromium', label: 'Chromium', unit: 'mcg'},
];
const VITAMINS = [
  {key: 'vitC', label: 'Vitamin C', unit: 'mg'},
  {key: 'vitD', label: 'Vitamin D', unit: 'mcg', note: 'CRITICAL: Deficiency affects 70-90% of T2DM. Improves insulin sensitivity.', clinical: true},
  {key: 'vitE', label: 'Vitamin E', unit: 'mg'},
  {key: 'vitK', label: 'Vitamin K', unit: 'mcg'},
  {key: 'vitA', label: 'Vitamin A', unit: 'mcg'},
  {key: 'b12', label: 'Vitamin B12', unit: 'mcg', note: 'Metformin depletes B12 in 30% of users. Check every 6-12 months.', clinical: true},
  {key: 'b6', label: 'Vitamin B6', unit: 'mg'},
  {key: 'folate', label: 'Folate', unit: 'mcg'},
];
const SPECIALTY = [{key: 'omega3', label: 'Omega-3', unit: 'g'}];

/* ─── Helpers ─────────────────────────────────────── */
const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));
const fmtVal = (v) => {
  if (v == null || isNaN(v)) return '0';
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  if (v % 1 !== 0) return v.toFixed(1);
  return `${v}`;
};
const getFlag = (value, goal, isUpper) => {
  const pct = goal > 0 ? (value / goal) * 100 : 0;
  if (isUpper) {
    if (pct > 100) return {label: 'OVER', bg: Colors.redBg, text: Colors.redText};
    if (pct >= 80) return {label: 'NEAR LIMIT', bg: Colors.amberBg, text: Colors.amberText};
    return {label: 'MET', bg: Colors.tealBg, text: Colors.tealText};
  }
  if (pct >= 90 && pct <= 110) return {label: 'MET', bg: Colors.tealBg, text: Colors.tealText};
  if (pct >= 70) return {label: 'OK', bg: Colors.tealBg, text: Colors.tealText};
  if (pct >= 40) return {label: 'LOW', bg: Colors.amberBg, text: Colors.amberText};
  return {label: 'VERY LOW', bg: Colors.redBg, text: Colors.redText};
};
const diffStr = (v, g, isUpper) => {
  const d = v - g;
  if (isUpper) return d > 0 ? `+${fmtVal(d)} over` : `${fmtVal(Math.abs(d))} under`;
  return d >= 0 ? `+${fmtVal(d)}` : `${fmtVal(d)}`;
};
const trendAvg = (days) => {
  const hist = TREND_HISTORY || [];
  const slice = hist.slice(-days);
  if (!slice.length) return {};
  const keys = Object.keys(slice[0]).filter((k) => k !== 'date');
  const avg = {};
  keys.forEach((k) => {
    avg[k] = Math.round((slice.reduce((s2, r) => s2 + (r[k] || 0), 0) / slice.length) * 10) / 10;
  });
  return mapKeys(avg);
};

/* ─── Sub-components ──────────────────────────────── */
const ScoreCard = ({label, value, unit, pct, goal, color}) => (
  <View style={sty.scoreCard}>
    <AppText variant="small" color={Colors.textTertiary}>{label}</AppText>
    <AppText variant="bodyBold" color={color || Colors.textPrimary} style={{marginTop: vs(2)}}>
      {fmtVal(value)}
      <AppText variant="small" color={Colors.textTertiary}> {unit}</AppText>
    </AppText>
    <View style={sty.scoreBarTrack}>
      <View style={[sty.scoreBarFill, {width: `${clamp(pct, 0, 100)}%`, backgroundColor: color || Colors.accent}]} />
    </View>
    <AppText variant="small" color={pct > 100 ? Colors.redText : Colors.textTertiary} style={{marginTop: vs(2)}}>
      {Math.round(pct)}% of {fmtVal(goal)}
    </AppText>
  </View>
);

const NutrientRow = ({label, value, goal, unit, pct, isUpper, note, clinical}) => {
  const flag = getFlag(value, goal, isUpper);
  const barPct = clamp(isUpper ? (value / goal) * 100 : pct, 0, 130);
  const barColor = isUpper
    ? (value > goal ? Colors.red : value > goal * 0.8 ? Colors.amber : Colors.accent)
    : (pct >= 70 ? Colors.accent : pct >= 40 ? Colors.amber : Colors.red);

  return (
    <View style={sty.nutrientRow}>
      <View style={sty.nrGrid}>
        <AppText variant="caption" color={Colors.textPrimary} style={sty.nrName}>{label}</AppText>
        <View style={sty.nrBarWrap}>
          <View style={sty.nrBarTrack}>
            <View style={[sty.nrBarFill, {width: `${clamp(barPct, 0, 100)}%`, backgroundColor: barColor}]} />
          </View>
        </View>
        <AppText variant="small" color={Colors.textPrimary} style={sty.nrVal}>{fmtVal(value)} {unit}</AppText>
        <AppText variant="small" color={Colors.textTertiary} style={sty.nrGoal}>{fmtVal(goal)}</AppText>
        <AppText variant="small" color={value > goal && isUpper ? Colors.redText : Colors.textTertiary} style={sty.nrDiff}>
          {diffStr(value, goal, isUpper)}
        </AppText>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'center', marginTop: vs(3), gap: s(6)}}>
        <View style={[sty.flagChip, {backgroundColor: flag.bg}]}>
          <AppText variant="small" color={flag.text} style={{fontWeight: '700', fontSize: ms(9)}}>{flag.label}</AppText>
        </View>
        <AppText variant="small" color={Colors.textTertiary}>{Math.round(pct)}%</AppText>
      </View>
      {clinical && note ? (
        <View style={sty.clinicalNote}>
          <AppText variant="small" color={Colors.textSecondary} style={{lineHeight: ms(15)}}>{note}</AppText>
        </View>
      ) : null}
    </View>
  );
};

const InsightCard = ({icon, title, text, type}) => {
  const cm = {
    critical: {bg: Colors.redBg, border: Colors.red, text: Colors.redText},
    warning: {bg: Colors.amberBg, border: Colors.amber, text: Colors.amberText},
    good: {bg: Colors.tealBg, border: Colors.accent, text: Colors.tealText},
    info: {bg: Colors.blueBg, border: Colors.blue, text: Colors.blueText},
  };
  const c = cm[type] || cm.info;
  return (
    <View style={[sty.insightCard, {backgroundColor: c.bg, borderLeftColor: c.border}]}>
      <View style={{flexDirection: 'row', alignItems: 'center'}}>
        <AppText style={{fontSize: ms(14)}}>{icon}</AppText>
        <AppText variant="bodyBold" color={c.text} style={{marginLeft: s(6), flex: 1}}>{title}</AppText>
      </View>
      <AppText variant="caption" color={c.text} style={{marginTop: vs(4), lineHeight: ms(16)}}>{text}</AppText>
    </View>
  );
};

/* ─── Main Component ──────────────────────────────── */
const NutrientsTab = ({meals}) => {
  const mealList = meals || [];
  const [mode, setMode] = useState('today');
  const [fromDate, setFromDate] = useState('');
  const [toDate, setToDate] = useState('');

  const MODES = ['today', '7 days', '30 days', 'custom'];

  /* Compute totals based on active mode */
  const totals = useMemo(() => {
    if (mode === 'today') {
      if (typeof calcTotal === 'function') return mapKeys(calcTotal(mealList));
      return {};
    }
    if (mode === '7 days') return trendAvg(7);
    if (mode === '30 days') return trendAvg(30);
    return trendAvg(14); // custom fallback
  }, [mealList, mode]);

  const pctOf = (key) => GOALS[key] > 0 ? ((totals[key] || 0) / GOALS[key]) * 100 : 0;

  const rangeLabel = mode === 'today' ? 'Live intake today'
    : mode === '7 days' ? 'Average over past 7 days'
    : mode === '30 days' ? 'Average over past 30 days'
    : fromDate && toDate ? `${fromDate} to ${toDate}` : 'Select dates';

  /* Build nutrient row data */
  const buildRows = (cfg) => cfg.map((m) => ({
    ...m, value: totals[m.key] || 0, goal: GOALS[m.key] || 0, pct: pctOf(m.key),
  }));

  /* Ayu Intelligence insights */
  const ayuInsights = useMemo(() => {
    const ins = [];
    const calP = pctOf('calories'), proP = pctOf('protein'), fibP = pctOf('fibre');
    const sodP = pctOf('sodium'), sugP = pctOf('sugar'), vitDP = pctOf('vitD');
    const b12P = pctOf('b12'), mgP = pctOf('magnesium'), potP = pctOf('potassium');
    const o3P = pctOf('omega3'), ironP = pctOf('iron'), folP = pctOf('folate');

    if (calP > 110) {
      const surplus = Math.round((totals.calories || 0) - GOALS.calories);
      ins.push({icon: '🔴', type: 'critical', title: `Calorie surplus: +${surplus} kcal`,
        text: `You're ${Math.round(calP - 100)}% over target. At this rate, ~${(surplus * 7 / 7700).toFixed(1)} kg/week gain. Consider lighter dinner.`});
    } else if (calP < 70) {
      ins.push({icon: '⚠️', type: 'warning', title: 'Calorie deficit too aggressive',
        text: `Only ${Math.round(calP)}% of target. Severe restriction slows metabolism and worsens insulin resistance.`});
    }
    if (fibP < 80) {
      const gap = Math.round(GOALS.fibre - (totals.fibre || 0));
      ins.push({icon: '🥦', type: 'warning', title: `Fibre gap: ${gap}g short`,
        text: `Fibre at ${Math.round(fibP)}% of 28g target. Add lentils (+15g) or 2 cups vegetables (+8g).`});
    }
    if (sugP > 100) ins.push({icon: '🍬', type: 'critical', title: `Sugar over limit: ${Math.round(totals.sugar || 0)}g / ${GOALS.sugar}g`,
      text: 'Excess sugar worsens insulin resistance. Swap sweetened drinks for water.'});
    if (sodP > 100) ins.push({icon: '🧂', type: 'critical', title: `Sodium over HTN limit: ${Math.round(totals.sodium || 0)}mg`,
      text: 'Exceeded 1500mg HTN limit. Can raise BP 5-6 mmHg. Avoid processed foods.'});
    if (proP < 80) ins.push({icon: '🥩', type: 'warning', title: `Protein gap: ${Math.round(GOALS.protein - (totals.protein || 0))}g short`,
      text: `Protein at ${Math.round(proP)}%. Inadequate protein accelerates muscle loss.`});
    if (vitDP < 60) ins.push({icon: '☀️', type: 'critical', title: 'Vitamin D critically low',
      text: `Only ${Math.round(vitDP)}% of target. Consider supplementation 1000-2000 IU/day.`});
    if (b12P < 60) ins.push({icon: '💊', type: 'critical', title: 'B12 low — Metformin risk',
      text: `B12 at ${Math.round(b12P)}%. Metformin depletes B12 in 30% of users. Supplement 1000 mcg/day.`});
    if (mgP < 70) ins.push({icon: '🔋', type: 'warning', title: `Magnesium low: ${Math.round(totals.magnesium || 0)}mg`,
      text: 'Mg deficiency in 38% of T2DM. Worsens insulin resistance. Add almonds, spinach.'});
    if (potP < 70) ins.push({icon: '🍌', type: 'warning', title: `Potassium low: ${Math.round(totals.potassium || 0)}mg`,
      text: 'Low potassium amplifies sodium\'s BP-raising effect. Add bananas, sweet potatoes.'});
    if (o3P < 50) ins.push({icon: '🐟', type: 'warning', title: 'Omega-3 insufficient',
      text: `Only ${o3P.toFixed(0)}% of target. Reduces triglycerides 15-30%. Eat fatty fish 2-3x/week.`});
    if (ironP < 60) ins.push({icon: '🩸', type: 'warning', title: `Iron low: ${Math.round(totals.iron || 0)}mg`,
      text: 'Low iron compounds diabetes fatigue. Include lentils with Vitamin C.'});
    if (folP < 60) ins.push({icon: '🧬', type: 'info', title: `Folate low: ${Math.round(totals.folate || 0)}mcg`,
      text: 'Low folate + low B12 increases cardiovascular risk. Add leafy greens.'});
    return ins;
  }, [totals]);

  const positives = useMemo(() => {
    const c = [];
    if (pctOf('calories') >= 90 && pctOf('calories') <= 110) c.push({label: 'Calories on target', icon: '🎯'});
    if (pctOf('protein') >= 90) c.push({label: 'Protein met', icon: '💪'});
    if (pctOf('fibre') >= 90) c.push({label: 'Fibre goal met', icon: '🥬'});
    if (pctOf('sodium') <= 100) c.push({label: 'Sodium under HTN limit', icon: '✅'});
    if (pctOf('sugar') <= 100) c.push({label: 'Sugar within limit', icon: '🍃'});
    if (pctOf('vitD') >= 80) c.push({label: 'Vitamin D adequate', icon: '☀️'});
    if (pctOf('b12') >= 80) c.push({label: 'B12 adequate', icon: '💊'});
    if (pctOf('omega3') >= 80) c.push({label: 'Omega-3 on track', icon: '🐟'});
    if (pctOf('magnesium') >= 80) c.push({label: 'Magnesium adequate', icon: '🔋'});
    if (pctOf('potassium') >= 80) c.push({label: 'Potassium adequate', icon: '🍌'});
    return c;
  }, [totals]);

  const dinnerRec = useMemo(() => {
    if (mode !== 'today') return null;
    const gaps = [];
    if (pctOf('protein') < 90) gaps.push('protein');
    if (pctOf('fibre') < 90) gaps.push('fibre');
    if (pctOf('omega3') < 80) gaps.push('omega-3');
    if (pctOf('vitD') < 60) gaps.push('vitamin D');
    if (!gaps.length) return null;
    const recs = [];
    if (gaps.includes('protein') && gaps.includes('omega-3'))
      recs.push('Grilled salmon (200g) with steamed broccoli — covers protein, omega-3, fibre gaps');
    else if (gaps.includes('protein'))
      recs.push('Grilled chicken breast (150g) with mixed salad and lentils');
    if (gaps.includes('fibre') && !recs.length)
      recs.push('Vegetable stir-fry with chickpeas and brown rice');
    if (gaps.includes('vitamin D'))
      recs.push('Include egg yolks or fortified dairy for vitamin D boost');
    return {text: recs.join('. '), calBudget: Math.max(0, Math.round(GOALS.calories - (totals.calories || 0))), gaps};
  }, [totals, mode]);

  const scoreStrip = useMemo(() => [
    {label: 'Calories', pct: Math.round(pctOf('calories')), color: pctOf('calories') > 110 ? Colors.red : Colors.accent},
    {label: 'Protein', pct: Math.round(pctOf('protein')), color: pctOf('protein') >= 90 ? Colors.accent : Colors.amber},
    {label: 'Sodium', pct: Math.round(pctOf('sodium')), color: pctOf('sodium') > 100 ? Colors.red : Colors.accent},
    {label: 'Fibre', pct: Math.round(pctOf('fibre')), color: pctOf('fibre') >= 90 ? Colors.accent : Colors.red},
  ], [totals]);

  /* Score cards (3x2) */
  const scoreCards = useMemo(() => [
    {label: 'Calories', key: 'calories', unit: 'kcal'},
    {label: 'Protein', key: 'protein', unit: 'g'},
    {label: 'Carbs', key: 'carbs', unit: 'g'},
    {label: 'Fat', key: 'fat', unit: 'g'},
    {label: 'Sugar', key: 'sugar', unit: 'g', upper: true},
    {label: 'Sodium', key: 'sodium', unit: 'mg', upper: true},
  ], []);

  return (
    <ScrollView style={sty.container} showsVerticalScrollIndicator={false}>
      {/* ─── 1. Date Range Picker ────────────── */}
      <View style={sty.card}>
        <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '600', marginBottom: vs(8)}}>
          Date Range
        </AppText>
        <View style={sty.pillRow}>
          {MODES.map((m) => (
            <TouchableOpacity key={m} onPress={() => setMode(m)}
              style={[sty.pill, mode === m && sty.pillActive]}>
              <AppText variant="small" color={mode === m ? Colors.white : Colors.textSecondary}
                style={{fontWeight: mode === m ? '700' : '500', textTransform: 'capitalize'}}>
                {m === 'today' ? 'Today' : m === '7 days' ? '7 Days' : m === '30 days' ? '30 Days' : 'Custom'}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
        <View style={sty.dateRow}>
          <View style={sty.dateInput}>
            <AppText variant="small" color={Colors.textTertiary}>From</AppText>
            <TextInput style={sty.dateField} placeholder="YYYY-MM-DD" placeholderTextColor={Colors.textTertiary}
              value={fromDate} onChangeText={setFromDate} editable={mode === 'custom'} />
          </View>
          <View style={sty.dateInput}>
            <AppText variant="small" color={Colors.textTertiary}>To</AppText>
            <TextInput style={sty.dateField} placeholder="YYYY-MM-DD" placeholderTextColor={Colors.textTertiary}
              value={toDate} onChangeText={setToDate} editable={mode === 'custom'} />
          </View>
        </View>
        <View style={sty.rangeStrip}>
          <AppText variant="small" color={Colors.accent} style={{fontWeight: '600'}}>{rangeLabel}</AppText>
        </View>
      </View>

      {/* ─── 2. Score Cards (3x2) ────────────── */}
      <View style={sty.scoreGrid}>
        {scoreCards.map((sc) => {
          const val = totals[sc.key] || 0;
          const goal = GOALS[sc.key] || 0;
          const pct = goal > 0 ? (val / goal) * 100 : 0;
          const over = sc.upper ? pct > 100 : pct > 110;
          const col = over ? Colors.red : pct >= 70 ? Colors.accent : Colors.amber;
          return (
            <ScoreCard key={sc.key} label={sc.label} value={Math.round(val)}
              unit={sc.unit} pct={pct} goal={goal} color={col} />
          );
        })}
      </View>

      {/* ─── 3. Nutrient Sections ────────────── */}
      {[
        {title: 'Macronutrients', sub: 'Daily macronutrient breakdown with clinical context', data: MACROS},
        {title: 'Electrolytes & Minerals', sub: 'Key minerals for metabolic and cardiovascular health', data: ELECTROLYTES},
        {title: 'Vitamins', sub: 'Essential vitamins — watch B12 and D for Metformin/T2DM', data: VITAMINS},
        {title: 'Specialty', sub: null, data: SPECIALTY},
      ].map((sec) => (
        <View key={sec.title} style={sty.section}>
          <AppText variant="sectionTitle" color={Colors.textSecondary}>{sec.title}</AppText>
          {sec.sub ? (
            <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>{sec.sub}</AppText>
          ) : null}
          <View style={sty.nutrientCard}>
            {/* Column headers */}
            <View style={[sty.nrGrid, {marginBottom: vs(4)}]}>
              <AppText variant="small" color={Colors.textTertiary} style={sty.nrName}>Name</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{flex: 2, textAlign: 'center'}}>Progress</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={sty.nrVal}>Today</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={sty.nrGoal}>Goal</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={sty.nrDiff}>Diff</AppText>
            </View>
            {buildRows(sec.data).map((row) => (
              <NutrientRow key={row.key} label={row.label} value={row.value} goal={row.goal}
                unit={row.unit} pct={row.pct} isUpper={row.upper} note={row.note} clinical={row.clinical} />
            ))}
          </View>
        </View>
      ))}

      {/* ─── 4. Per-Meal Breakdown (today only) ── */}
      {mode === 'today' && mealList.filter((m) => (m.entries || []).length > 0).length > 0 && (
        <View style={sty.section}>
          <AppText variant="sectionTitle" color={Colors.textSecondary}>Per-meal Breakdown</AppText>
          {mealList.filter((m) => (m.entries || []).length > 0).map((meal, idx) => {
            const ents = meal.entries || [];
            const mc = ents.reduce((a, e) => a + ((e.cal || e.calories || 0)), 0);
            const mp = ents.reduce((a, e) => a + ((e.pro || e.protein || 0)), 0);
            const mcb = ents.reduce((a, e) => a + ((e.carb || e.carbs || 0)), 0);
            const mf = ents.reduce((a, e) => a + ((e.fat || 0)), 0);
            const mfb = ents.reduce((a, e) => a + ((e.fib || e.fibre || 0)), 0);
            const ms2 = ents.reduce((a, e) => a + ((e.sod || e.sodium || 0)), 0);
            return (
              <View key={idx} style={sty.mealCard}>
                <View style={sty.mealHeader}>
                  <AppText variant="bodyBold" color={Colors.textPrimary}>
                    {meal.ico || ''} {meal.name || meal.label || `Meal ${idx + 1}`}
                  </AppText>
                  <AppText variant="caption" color={Colors.textSecondary}>{Math.round(mc)} kcal</AppText>
                </View>
                <View style={sty.mealMacroGrid}>
                  {[
                    {l: 'Prot', v: mp, u: 'g', c: Colors.blue},
                    {l: 'Carb', v: mcb, u: 'g', c: Colors.amber},
                    {l: 'Fat', v: mf, u: 'g', c: Colors.purple},
                    {l: 'Fibre', v: mfb, u: 'g', c: Colors.accent},
                    {l: 'Sodium', v: ms2, u: 'mg', c: Colors.red},
                  ].map((col) => (
                    <View key={col.l} style={sty.mealMacroCell}>
                      <AppText variant="small" color={Colors.textTertiary}>{col.l}</AppText>
                      <AppText variant="caption" color={col.c} style={{fontWeight: '700'}}>
                        {Math.round(col.v)}{col.u}
                      </AppText>
                    </View>
                  ))}
                </View>
              </View>
            );
          })}
        </View>
      )}

      {/* ─── 5. Ayu Intelligence ─────────────── */}
      <View style={sty.section}>
        <View style={sty.ayuCard}>
          <View style={sty.ayuHeader}>
            <View style={sty.ayuAvatar}>
              <AppText style={{fontSize: ms(18)}}>{'🌿'}</AppText>
            </View>
            <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(8), fontSize: ms(16)}}>
              Ayu Intelligence
            </AppText>
          </View>

          {/* Summary tiles */}
          <View style={sty.ayuTileRow}>
            {scoreStrip.map((t) => (
              <View key={t.label} style={sty.ayuTile}>
                <AppText variant="small" color={Colors.heroTextMuted}>{t.label}</AppText>
                <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(16)}}>{t.pct}%</AppText>
              </View>
            ))}
          </View>

          {/* Priority insights */}
          {ayuInsights.length > 0 && (
            <View style={{marginTop: vs(12)}}>
              <AppText variant="caption" color={Colors.heroTextMuted} style={{fontWeight: '600', marginBottom: vs(6)}}>
                Priority insights
              </AppText>
              {ayuInsights.map((ins, idx) => (
                <InsightCard key={idx} icon={ins.icon} title={ins.title} text={ins.text} type={ins.type} />
              ))}
            </View>
          )}

          {/* What's going well */}
          {positives.length > 0 && (
            <View style={{marginTop: vs(14)}}>
              <AppText variant="caption" color={Colors.paleGreen} style={{fontWeight: '600', marginBottom: vs(6)}}>
                What's going well
              </AppText>
              <View style={sty.positiveChips}>
                {positives.map((chip, idx) => (
                  <View key={idx} style={sty.positiveChip}>
                    <AppText style={{fontSize: ms(12)}}>{chip.icon}</AppText>
                    <AppText variant="small" color={Colors.tealText} style={{marginLeft: s(4)}}>{chip.label}</AppText>
                  </View>
                ))}
              </View>
            </View>
          )}

          {/* Dinner recommendation */}
          {dinnerRec && (
            <View style={sty.dinnerRec}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <AppText style={{fontSize: ms(16)}}>{'🍽️'}</AppText>
                <AppText variant="bodyBold" color={Colors.purpleText} style={{marginLeft: s(6)}}>
                  Dinner recommendation
                </AppText>
              </View>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(4)}}>
                Remaining calorie budget: {dinnerRec.calBudget} kcal
              </AppText>
              <AppText variant="caption" color={Colors.purpleText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
                {dinnerRec.text}
              </AppText>
              <View style={sty.gapChips}>
                {dinnerRec.gaps.map((gap, idx) => (
                  <View key={idx} style={sty.gapChip}>
                    <AppText variant="small" color={Colors.amberText}>fills {gap}</AppText>
                  </View>
                ))}
              </View>
            </View>
          )}
        </View>
      </View>

      <View style={{height: vs(100)}} />
    </ScrollView>
  );
};

/* ─── Styles ──────────────────────────────────────── */
const sty = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: s(16), paddingTop: vs(8)},

  /* Card */
  card: {backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14), borderWidth: 1, borderColor: Colors.borderLight},

  /* Date Range Picker */
  pillRow: {flexDirection: 'row', gap: s(6), marginBottom: vs(10)},
  pill: {paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(16), backgroundColor: Colors.background},
  pillActive: {backgroundColor: Colors.accent},
  dateRow: {flexDirection: 'row', gap: s(10), marginBottom: vs(8)},
  dateInput: {flex: 1},
  dateField: {borderWidth: 1, borderColor: Colors.borderLight, borderRadius: ms(8), paddingHorizontal: s(8), paddingVertical: vs(4), marginTop: vs(2), fontSize: ms(12), color: Colors.textPrimary},
  rangeStrip: {backgroundColor: Colors.tealBg, borderRadius: ms(8), paddingHorizontal: s(10), paddingVertical: vs(4), alignSelf: 'flex-start'},
  /* Score Cards */
  scoreGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8), marginTop: vs(12)},
  scoreCard: {width: '31%', flexGrow: 1, backgroundColor: Colors.white, borderRadius: ms(14), padding: s(10), borderWidth: 1, borderColor: Colors.borderLight},
  scoreBarTrack: {height: vs(5), backgroundColor: Colors.borderLight, borderRadius: ms(3), overflow: 'hidden', marginTop: vs(4)},
  scoreBarFill: {height: '100%', borderRadius: ms(3), minWidth: s(2)},

  /* Section */
  section: {marginTop: vs(22)},

  /* Nutrient Card / Rows */
  nutrientCard: {backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14), marginTop: vs(10), borderWidth: 1, borderColor: Colors.borderLight},
  nutrientRow: {paddingVertical: vs(8), borderBottomWidth: 1, borderBottomColor: Colors.borderLight},
  nrGrid: {flexDirection: 'row', alignItems: 'center', gap: s(4)},
  nrName: {flex: 2, fontWeight: '600'},
  nrBarWrap: {flex: 2},
  nrBarTrack: {height: vs(5), backgroundColor: Colors.borderLight, borderRadius: ms(3), overflow: 'hidden'},
  nrBarFill: {height: '100%', borderRadius: ms(3), minWidth: s(2)},
  nrVal: {flex: 1.5, textAlign: 'right'},
  nrGoal: {flex: 1, textAlign: 'right'},
  nrDiff: {flex: 1.2, textAlign: 'right'},

  flagChip: {paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(10)},
  clinicalNote: {
    marginTop: vs(6), backgroundColor: Colors.background, borderRadius: ms(6), padding: s(8),
  },

  /* Per-meal */
  mealCard: {
    backgroundColor: Colors.white, borderRadius: ms(14), padding: s(12),
    marginTop: vs(8), borderWidth: 1, borderColor: Colors.borderLight,
  },
  mealHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(8)},
  mealMacroGrid: {flexDirection: 'row', justifyContent: 'space-between'},
  mealMacroCell: {alignItems: 'center', flex: 1},

  /* Ayu Intelligence */
  ayuCard: {
    backgroundColor: Colors.primary, borderRadius: ms(14), padding: s(16),
  },
  ayuHeader: {flexDirection: 'row', alignItems: 'center'},
  ayuAvatar: {
    width: s(36), height: s(36), borderRadius: s(18),
    backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center',
  },
  ayuTileRow: {flexDirection: 'row', gap: s(6), marginTop: vs(12)},
  ayuTile: {
    flex: 1, alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: ms(10), paddingVertical: vs(8),
  },
  insightCard: {borderRadius: ms(10), padding: s(12), marginTop: vs(6), borderLeftWidth: s(4)},
  positiveChips: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6)},
  positiveChip: {
    flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.tealBg,
    paddingHorizontal: s(10), paddingVertical: vs(5), borderRadius: ms(16),
  },
  dinnerRec: {
    marginTop: vs(14), backgroundColor: Colors.purpleBg, borderRadius: ms(12),
    padding: s(14), borderWidth: 1, borderColor: Colors.purple,
  },
  gapChips: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6), marginTop: vs(8)},
  gapChip: {backgroundColor: Colors.amberBg, paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(10)},
});

export default NutrientsTab;
