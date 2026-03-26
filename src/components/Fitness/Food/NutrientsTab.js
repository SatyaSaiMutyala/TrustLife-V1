import React, {useMemo} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {NUTRITION_GOALS, FOOD_DB, TREND_HISTORY, calcTotal} from '../../../constants/foodData';

/* ─── Constants ─────────────────────────────────────── */

// Map short keys from foodData to long keys used in this component
const SHORT_TO_LONG = {
  cal: 'calories', pro: 'protein', carb: 'carbs', fat: 'fat', fib: 'fibre', sug: 'sugar',
  sod: 'sodium', pot: 'potassium', cal_m: 'calcium', mag: 'magnesium', iron: 'iron',
  zinc: 'zinc', selenium: 'selenium', chromium: 'chromium',
  vitC: 'vitC', vitD: 'vitD', vitE: 'vitE', vitK: 'vitK', vitA: 'vitA',
  vitB12: 'b12', vitB6: 'b6', folate: 'folate', omega3: 'omega3',
};

const mapKeys = (obj) => {
  const result = {};
  Object.entries(obj || {}).forEach(([k, v]) => {
    result[SHORT_TO_LONG[k] || k] = v;
  });
  return result;
};

const RAW_GOALS = NUTRITION_GOALS || {};
const GOALS = {
  calories: RAW_GOALS.cal || 1650, protein: RAW_GOALS.pro || 75, carbs: RAW_GOALS.carb || 180,
  fat: RAW_GOALS.fat || 50, fibre: RAW_GOALS.fib || 28, sugar: RAW_GOALS.sug || 25,
  sodium: RAW_GOALS.sod || 1500, potassium: RAW_GOALS.pot || 3500, calcium: RAW_GOALS.cal_m || 1000,
  magnesium: RAW_GOALS.mag || 400, iron: RAW_GOALS.iron || 18, zinc: RAW_GOALS.zinc || 11,
  selenium: RAW_GOALS.selenium || 55, chromium: RAW_GOALS.chromium || 35,
  vitC: RAW_GOALS.vitC || 90, vitD: RAW_GOALS.vitD || 600, vitE: RAW_GOALS.vitE || 15,
  vitK: RAW_GOALS.vitK || 90, vitA: RAW_GOALS.vitA || 900, b12: RAW_GOALS.vitB12 || 2.4,
  b6: RAW_GOALS.vitB6 || 1.7, folate: RAW_GOALS.folate || 400, omega3: RAW_GOALS.omega3 || 1100,
};

const MACROS = [
  {key: 'calories', label: 'Calories', unit: 'kcal', note: 'Calorie control is critical for T2DM management. A 500 kcal/day deficit targets ~0.5 kg/week loss.'},
  {key: 'protein', label: 'Protein', unit: 'g', note: 'Protein at 1.2-1.6 g/kg preserves lean mass and improves satiety. Essential for glucose-lowering muscle.'},
  {key: 'carbs', label: 'Carbs', unit: 'g', note: 'Each 10g carb reduction lowers HbA1c by ~0.1%. Prioritise low-GI sources.'},
  {key: 'fat', label: 'Fat', unit: 'g', note: 'Focus on unsaturated fats (olive oil, nuts, avocado). Limit saturated fat to <10% total energy.'},
  {key: 'fibre', label: 'Fibre', unit: 'g', note: 'Fibre >25g/day reduces post-meal glucose spikes by 20-30%. Slows gastric emptying.'},
  {key: 'sugar', label: 'Sugar', unit: 'g', upper: true, note: 'WHO recommends <25g added sugar. Excess sugar directly worsens insulin resistance.'},
];

const ELECTROLYTES = [
  {key: 'sodium', label: 'Sodium', unit: 'mg', upper: true, note: 'HTN limit: <1500 mg/day. Excess sodium raises BP 5-6 mmHg in salt-sensitive individuals.'},
  {key: 'potassium', label: 'Potassium', unit: 'mg', note: 'Potassium blunts sodium\'s BP effect. 3500 mg/day target. Bananas, spinach, sweet potatoes.'},
  {key: 'calcium', label: 'Calcium', unit: 'mg', note: 'Supports bone density and cardiac rhythm. Metformin may impair absorption over time.'},
  {key: 'magnesium', label: 'Magnesium', unit: 'mg', note: 'Mg deficiency is common in T2DM (38%). Supplementation improves insulin sensitivity by ~10%.'},
  {key: 'iron', label: 'Iron', unit: 'mg', note: 'Iron is essential for oxygen transport. Low iron causes fatigue, compounding diabetes fatigue.'},
  {key: 'zinc', label: 'Zinc', unit: 'mg', note: 'Zinc supports insulin storage and secretion. Deficiency is 2× more common in T2DM.'},
  {key: 'selenium', label: 'Selenium', unit: 'mcg', note: 'Antioxidant protection. 55 mcg/day supports thyroid function and reduces oxidative stress.'},
  {key: 'chromium', label: 'Chromium', unit: 'mcg', note: 'Chromium picolinate enhances insulin receptor signalling. May lower HbA1c by 0.6%.'},
];

const VITAMINS = [
  {key: 'vitC', label: 'Vitamin C', unit: 'mg', note: 'Antioxidant that may lower fasting glucose. 500 mg/day shown to reduce HbA1c by 0.54%.'},
  {key: 'vitD', label: 'Vitamin D', unit: 'mcg', note: 'CRITICAL: Vitamin D deficiency affects 70-90% of T2DM patients. Improves insulin sensitivity and beta-cell function.', critical: true},
  {key: 'vitE', label: 'Vitamin E', unit: 'mg', note: 'Protects against oxidative damage in diabetic vascular disease. 15 mg/day from diet.'},
  {key: 'vitK', label: 'Vitamin K', unit: 'mcg', note: 'Supports arterial calcification prevention and bone health. Found in leafy greens.'},
  {key: 'vitA', label: 'Vitamin A', unit: 'mcg', note: 'Supports immune function and eye health. Important for diabetic retinopathy prevention.'},
  {key: 'b12', label: 'Vitamin B12', unit: 'mcg', note: 'CRITICAL: Metformin depletes B12 in 30% of users. Check levels every 6-12 months. Supplement if <400 pg/mL.', critical: true},
  {key: 'b6', label: 'Vitamin B6', unit: 'mg', note: 'Supports nerve health. Deficiency worsens diabetic neuropathy symptoms.'},
  {key: 'folate', label: 'Folate', unit: 'mcg', note: 'Essential for homocysteine metabolism. Low folate + low B12 = increased cardiovascular risk.'},
];

const SPECIALTY = [
  {key: 'omega3', label: 'Omega-3', unit: 'g', note: 'Reduces triglycerides 15-30%. Critical for dyslipidaemia management in T2DM. Target: 1-2g EPA+DHA daily.'},
];

/* ─── Helpers ───────────────────────────────────────── */

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const getFlag = (value, goal, isUpper) => {
  const pct = goal > 0 ? (value / goal) * 100 : 0;
  if (isUpper) {
    if (pct > 100) return {label: 'OVER', bg: Colors.redBg, text: Colors.redText};
    if (pct >= 80) return {label: 'NEAR LIMIT', bg: Colors.amberBg, text: Colors.amberText};
    return {label: 'OK', bg: Colors.tealBg, text: Colors.tealText};
  }
  if (pct >= 90 && pct <= 110) return {label: 'MET', bg: Colors.tealBg, text: Colors.tealText};
  if (pct >= 70) return {label: 'OK', bg: Colors.tealBg, text: Colors.tealText};
  if (pct >= 40) return {label: 'LOW', bg: Colors.amberBg, text: Colors.amberText};
  return {label: 'VERY LOW', bg: Colors.redBg, text: Colors.redText};
};

const fmtVal = (v) => {
  if (v == null || isNaN(v)) return '0';
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  if (v % 1 !== 0) return v.toFixed(1);
  return `${v}`;
};

const diffStr = (value, goal, isUpper) => {
  const diff = value - goal;
  if (isUpper) {
    return diff > 0 ? `+${fmtVal(diff)} over` : `${fmtVal(Math.abs(diff))} under`;
  }
  return diff >= 0 ? `+${fmtVal(diff)}` : `${fmtVal(diff)}`;
};

/* ─── Sub-components ────────────────────────────────── */

const ScoreCard = ({label, value, unit, pct, goal, color}) => (
  <View style={sty.scoreCard}>
    <AppText variant="small" color={Colors.textTertiary}>{label}</AppText>
    <AppText variant="bodyBold" color={color || Colors.textPrimary} style={{marginTop: vs(2)}}>
      {fmtVal(value)}
      <AppText variant="small" color={Colors.textTertiary}> {unit}</AppText>
    </AppText>
    <View style={sty.scoreBarTrack}>
      <View
        style={[
          sty.scoreBarFill,
          {width: `${clamp(pct, 0, 100)}%`, backgroundColor: color || Colors.accent},
        ]}
      />
    </View>
    <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
      {Math.round(pct)}% of {fmtVal(goal)}
    </AppText>
  </View>
);

const NutrientRow = ({label, value, goal, unit, pct, isUpper, note, critical}) => {
  const flag = getFlag(value, goal, isUpper);
  const barPct = clamp(isUpper ? (value / goal) * 100 : pct, 0, 130);
  const barColor = isUpper
    ? (value > goal ? Colors.red : value > goal * 0.8 ? Colors.amber : Colors.accent)
    : (pct >= 70 ? Colors.accent : pct >= 40 ? Colors.amber : Colors.red);

  return (
    <View style={sty.nutrientRow}>
      <View style={sty.nutrientHeader}>
        <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, fontWeight: '600'}}>
          {label}
          {isUpper ? (
            <AppText variant="small" color={Colors.textTertiary}> (upper limit)</AppText>
          ) : null}
        </AppText>
        <View style={[sty.flagChip, {backgroundColor: flag.bg}]}>
          <AppText variant="small" color={flag.text} style={{fontWeight: '700'}}>
            {flag.label}
          </AppText>
        </View>
      </View>

      {/* Progress bar */}
      <View style={sty.nutrientBarTrack}>
        <View
          style={[
            sty.nutrientBarFill,
            {width: `${clamp(barPct, 0, 100)}%`, backgroundColor: barColor},
          ]}
        />
        {isUpper && (
          <View style={sty.nutrientLimitLine} />
        )}
      </View>

      {/* Stats row */}
      <View style={sty.nutrientStats}>
        <AppText variant="small" color={Colors.textSecondary}>
          {fmtVal(value)} / {fmtVal(goal)} {unit}
        </AppText>
        <AppText variant="small" color={value > goal && isUpper ? Colors.redText : Colors.textTertiary}>
          {diffStr(value, goal, isUpper)}
        </AppText>
        <AppText variant="small" color={Colors.textTertiary}>
          {Math.round(pct)}%
        </AppText>
      </View>

      {/* Clinical note */}
      {note ? (
        <View style={[sty.clinicalNote, critical && sty.clinicalNoteCritical]}>
          <AppText variant="small" color={critical ? Colors.redText : Colors.textSecondary} style={{lineHeight: ms(15)}}>
            {critical ? '!! ' : ''}{note}
          </AppText>
        </View>
      ) : null}
    </View>
  );
};

const MealBreakdown = ({meal, idx}) => {
  const entries = meal.entries || meal.items || [];
  const mealCals = entries.reduce((sum, e) => sum + (e.calories || 0), 0);
  const mealProt = entries.reduce((sum, e) => sum + (e.protein || 0), 0);
  const mealCarbs = entries.reduce((sum, e) => sum + (e.carbs || 0), 0);
  const mealFat = entries.reduce((sum, e) => sum + (e.fat || 0), 0);
  const total = mealProt + mealCarbs + mealFat || 1;

  return (
    <View style={sty.mealCard}>
      <View style={sty.mealHeader}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>
          {meal.name || meal.label || `Meal ${idx + 1}`}
        </AppText>
        <AppText variant="caption" color={Colors.textSecondary}>
          {Math.round(mealCals)} kcal
        </AppText>
      </View>

      {/* Macro split bar */}
      <View style={sty.mealSplitBar}>
        <View style={[sty.mealSplitSeg, {flex: mealProt, backgroundColor: Colors.blue, borderTopLeftRadius: ms(4), borderBottomLeftRadius: ms(4)}]} />
        <View style={[sty.mealSplitSeg, {flex: mealCarbs, backgroundColor: Colors.amber}]} />
        <View style={[sty.mealSplitSeg, {flex: mealFat, backgroundColor: Colors.purple, borderTopRightRadius: ms(4), borderBottomRightRadius: ms(4)}]} />
      </View>

      <View style={sty.mealMacroRow}>
        <View style={sty.mealMacroItem}>
          <View style={[sty.mealMacroDot, {backgroundColor: Colors.blue}]} />
          <AppText variant="small" color={Colors.textSecondary}>
            P: {Math.round(mealProt)}g ({Math.round((mealProt / total) * 100)}%)
          </AppText>
        </View>
        <View style={sty.mealMacroItem}>
          <View style={[sty.mealMacroDot, {backgroundColor: Colors.amber}]} />
          <AppText variant="small" color={Colors.textSecondary}>
            C: {Math.round(mealCarbs)}g ({Math.round((mealCarbs / total) * 100)}%)
          </AppText>
        </View>
        <View style={sty.mealMacroItem}>
          <View style={[sty.mealMacroDot, {backgroundColor: Colors.purple}]} />
          <AppText variant="small" color={Colors.textSecondary}>
            F: {Math.round(mealFat)}g ({Math.round((mealFat / total) * 100)}%)
          </AppText>
        </View>
      </View>

      {/* Individual items */}
      {entries.map((entry, eIdx) => (
        <View key={eIdx} style={sty.mealEntryRow}>
          <AppText variant="small" color={Colors.textPrimary} style={{flex: 1}}>
            {entry.name || entry.food}
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>
            {entry.qty || entry.serving || ''} · {Math.round(entry.calories || 0)} kcal
          </AppText>
        </View>
      ))}
    </View>
  );
};

const InsightCard = ({icon, title, text, type}) => {
  const colorMap = {
    critical: {bg: Colors.redBg, border: Colors.red, text: Colors.redText},
    warning: {bg: Colors.amberBg, border: Colors.amber, text: Colors.amberText},
    good: {bg: Colors.tealBg, border: Colors.accent, text: Colors.tealText},
    info: {bg: Colors.blueBg, border: Colors.blue, text: Colors.blueText},
  };
  const c = colorMap[type] || colorMap.info;

  return (
    <View style={[sty.insightCard, {backgroundColor: c.bg, borderLeftColor: c.border}]}>
      <View style={sty.insightHeader}>
        <AppText style={{fontSize: ms(14)}}>{icon}</AppText>
        <AppText variant="bodyBold" color={c.text} style={{marginLeft: s(6), flex: 1}}>
          {title}
        </AppText>
      </View>
      <AppText variant="caption" color={c.text} style={{marginTop: vs(4), lineHeight: ms(16)}}>
        {text}
      </AppText>
    </View>
  );
};

/* ─── Main Component ───────────────────────────────── */

const NutrientsTab = ({meals}) => {
  const mealList = meals || [];

  /* Compute totals from all meal entries, mapping short keys to long */
  const totals = useMemo(() => {
    if (typeof calcTotal === 'function') {
      const raw = calcTotal(mealList);
      return mapKeys(raw);
    }
    const allEntries = mealList.flatMap((m) => m.entries || m.items || []);
    const result = {};
    const keys = [
      'calories', 'protein', 'carbs', 'fat', 'fibre', 'sugar',
      'sodium', 'potassium', 'calcium', 'magnesium', 'iron', 'zinc', 'selenium', 'chromium',
      'vitC', 'vitD', 'vitE', 'vitK', 'vitA', 'b12', 'b6', 'folate', 'omega3',
    ];
    keys.forEach((k) => {
      result[k] = allEntries.reduce((sum, e) => sum + (e[k] || 0), 0);
    });
    return result;
  }, [mealList]);

  const pctOf = (key) => GOALS[key] > 0 ? (totals[key] / GOALS[key]) * 100 : 0;

  /* Build nutrient rows data */
  const macroRows = useMemo(() => MACROS.map((m) => ({
    ...m, value: totals[m.key] || 0, goal: GOALS[m.key] || 0, pct: pctOf(m.key),
  })), [totals]);

  const electrolyteRows = useMemo(() => ELECTROLYTES.map((e) => ({
    ...e, value: totals[e.key] || 0, goal: GOALS[e.key] || 0, pct: pctOf(e.key),
  })), [totals]);

  const vitaminRows = useMemo(() => VITAMINS.map((v) => ({
    ...v, value: totals[v.key] || 0, goal: GOALS[v.key] || 0, pct: pctOf(v.key),
  })), [totals]);

  const specialtyRows = useMemo(() => SPECIALTY.map((sp) => ({
    ...sp, value: totals[sp.key] || 0, goal: GOALS[sp.key] || 0, pct: pctOf(sp.key),
  })), [totals]);

  /* Ayu Intelligence insights */
  const ayuInsights = useMemo(() => {
    const insights = [];
    const calPct = pctOf('calories');
    const protPct = pctOf('protein');
    const fibrePct = pctOf('fibre');
    const sodiumPct = pctOf('sodium');
    const sugarPct = pctOf('sugar');
    const vitDPct = pctOf('vitD');
    const b12Pct = pctOf('b12');
    const mgPct = pctOf('magnesium');
    const potPct = pctOf('potassium');
    const omega3Pct = pctOf('omega3');
    const ironPct = pctOf('iron');
    const folatePct = pctOf('folate');

    // Calorie surplus/deficit
    if (calPct > 110) {
      const surplus = Math.round(totals.calories - GOALS.calories);
      insights.push({
        icon: '🔴', type: 'critical', title: `Calorie surplus: +${surplus} kcal`,
        text: `You're ${Math.round(calPct - 100)}% over your target. At this rate, you'd gain ~${(surplus * 7 / 7700).toFixed(1)} kg/week. Consider lighter dinner options.`,
      });
    } else if (calPct < 70) {
      insights.push({
        icon: '⚠️', type: 'warning', title: 'Calorie deficit too aggressive',
        text: `Only ${Math.round(calPct)}% of target consumed. Severe restriction slows metabolism and worsens insulin resistance long-term.`,
      });
    }

    // Fibre gap
    if (fibrePct < 80) {
      const gap = Math.round(GOALS.fibre - totals.fibre);
      insights.push({
        icon: '🥦', type: 'warning', title: `Fibre gap: ${gap}g short`,
        text: `Fibre at ${Math.round(fibrePct)}% of 28g target. Add a cup of lentils (+15g) or 2 cups of vegetables (+8g) to meet your goal.`,
      });
    }

    // Sugar over
    if (sugarPct > 100) {
      insights.push({
        icon: '🍬', type: 'critical', title: `Sugar over limit: ${Math.round(totals.sugar)}g / ${GOALS.sugar}g`,
        text: `Excess sugar is directly worsening insulin resistance. Swap sweetened drinks for water, and fruit juice for whole fruit.`,
      });
    }

    // Sodium over HTN limit
    if (sodiumPct > 100) {
      insights.push({
        icon: '🧂', type: 'critical', title: `Sodium over HTN limit: ${Math.round(totals.sodium)}mg`,
        text: `You've exceeded the 1500mg HTN limit. This can raise blood pressure 5-6 mmHg. Avoid processed foods and check labels for hidden sodium.`,
      });
    }

    // Protein gap
    if (protPct < 80) {
      const gap = Math.round(GOALS.protein - totals.protein);
      insights.push({
        icon: '🥩', type: 'warning', title: `Protein gap: ${gap}g short`,
        text: `Protein at ${Math.round(protPct)}% of target. Inadequate protein accelerates muscle loss. Add chicken breast (31g/100g) or Greek yogurt (10g/100g).`,
      });
    }

    // Vitamin D low
    if (vitDPct < 60) {
      insights.push({
        icon: '☀️', type: 'critical', title: 'Vitamin D critically low',
        text: `Only ${Math.round(vitDPct)}% of daily target. 70-90% of T2DM patients are Vitamin D deficient. Consider supplementation (1000-2000 IU/day) and sun exposure.`,
      });
    }

    // B12 low
    if (b12Pct < 60) {
      insights.push({
        icon: '💊', type: 'critical', title: 'B12 low — Metformin risk',
        text: `B12 at ${Math.round(b12Pct)}% of target. Metformin depletes B12 in 30% of users, causing neuropathy that mimics diabetic neuropathy. Supplement 1000 mcg/day.`,
      });
    }

    // Magnesium low
    if (mgPct < 70) {
      insights.push({
        icon: '🔋', type: 'warning', title: `Magnesium low: ${Math.round(totals.magnesium)}mg / ${GOALS.magnesium}mg`,
        text: `Mg deficiency is present in 38% of T2DM patients. Low Mg worsens insulin resistance. Add dark chocolate, almonds, or spinach.`,
      });
    }

    // Potassium low
    if (potPct < 70) {
      insights.push({
        icon: '🍌', type: 'warning', title: `Potassium low: ${Math.round(totals.potassium)}mg`,
        text: `Low potassium amplifies sodium's BP-raising effect. Add bananas, sweet potatoes, or coconut water.`,
      });
    }

    // Omega-3 low
    if (omega3Pct < 50) {
      insights.push({
        icon: '🐟', type: 'warning', title: 'Omega-3 insufficient for dyslipidaemia',
        text: `Only ${omega3Pct.toFixed(0)}% of target. Omega-3 reduces triglycerides 15-30%. Eat fatty fish 2-3×/week or supplement 1-2g EPA+DHA.`,
      });
    }

    // Iron low
    if (ironPct < 60) {
      insights.push({
        icon: '🩸', type: 'warning', title: `Iron low: ${Math.round(totals.iron)}mg / ${GOALS.iron}mg`,
        text: `Low iron compounds diabetes fatigue. Include red meat, lentils, or fortified cereals with Vitamin C for absorption.`,
      });
    }

    // Folate low
    if (folatePct < 60) {
      insights.push({
        icon: '🧬', type: 'info', title: `Folate low: ${Math.round(totals.folate)}mcg / ${GOALS.folate}mcg`,
        text: `Low folate + low B12 increases cardiovascular risk. Leafy greens, legumes, and fortified grains are good sources.`,
      });
    }

    return insights;
  }, [totals]);

  /* "What's going well" positive chips */
  const positives = useMemo(() => {
    const chips = [];
    if (pctOf('calories') >= 90 && pctOf('calories') <= 110) chips.push({label: 'Calories on target', icon: '🎯'});
    if (pctOf('protein') >= 90) chips.push({label: 'Protein met', icon: '💪'});
    if (pctOf('fibre') >= 90) chips.push({label: 'Fibre goal met', icon: '🥬'});
    if (pctOf('sodium') <= 100) chips.push({label: 'Sodium under HTN limit', icon: '✅'});
    if (pctOf('sugar') <= 100) chips.push({label: 'Sugar within limit', icon: '🍃'});
    if (pctOf('vitD') >= 80) chips.push({label: 'Vitamin D adequate', icon: '☀️'});
    if (pctOf('b12') >= 80) chips.push({label: 'B12 adequate', icon: '💊'});
    if (pctOf('omega3') >= 80) chips.push({label: 'Omega-3 on track', icon: '🐟'});
    if (pctOf('magnesium') >= 80) chips.push({label: 'Magnesium adequate', icon: '🔋'});
    if (pctOf('potassium') >= 80) chips.push({label: 'Potassium adequate', icon: '🍌'});
    return chips;
  }, [totals]);

  /* Dinner recommendation */
  const dinnerRec = useMemo(() => {
    const gaps = [];
    if (pctOf('protein') < 90) gaps.push('protein');
    if (pctOf('fibre') < 90) gaps.push('fibre');
    if (pctOf('omega3') < 80) gaps.push('omega-3');
    if (pctOf('vitD') < 60) gaps.push('vitamin D');

    if (gaps.length === 0) return null;

    const recs = [];
    if (gaps.includes('protein') && gaps.includes('omega-3')) {
      recs.push('Grilled salmon (200g) with steamed broccoli — covers protein, omega-3, and fibre gaps');
    } else if (gaps.includes('protein')) {
      recs.push('Grilled chicken breast (150g) with mixed salad and lentils — high protein and fibre');
    }
    if (gaps.includes('fibre') && !recs.length) {
      recs.push('Vegetable stir-fry with chickpeas and brown rice — fibre-rich with balanced macros');
    }
    if (gaps.includes('vitamin D')) {
      recs.push('Include egg yolks or fortified dairy for vitamin D boost');
    }

    const calRemaining = Math.max(0, GOALS.calories - (totals.calories || 0));
    return {
      text: recs.join('. '),
      calBudget: Math.round(calRemaining),
      gaps,
    };
  }, [totals]);

  /* Score strip values */
  const scoreStrip = useMemo(() => [
    {label: 'Calories', pct: Math.round(pctOf('calories')), color: pctOf('calories') > 110 ? Colors.red : pctOf('calories') >= 70 ? Colors.accent : Colors.amber},
    {label: 'Protein', pct: Math.round(pctOf('protein')), color: pctOf('protein') >= 90 ? Colors.accent : pctOf('protein') >= 70 ? Colors.amber : Colors.red},
    {label: 'Sodium', pct: Math.round(pctOf('sodium')), color: pctOf('sodium') > 100 ? Colors.red : pctOf('sodium') >= 80 ? Colors.amber : Colors.accent},
    {label: 'Fibre', pct: Math.round(pctOf('fibre')), color: pctOf('fibre') >= 90 ? Colors.accent : pctOf('fibre') >= 60 ? Colors.amber : Colors.red},
  ], [totals]);

  return (
    <ScrollView style={sty.container} showsVerticalScrollIndicator={false}>
      {/* ─── 1. Score Cards ─────────────────────── */}
      <View style={sty.scoreRow}>
        <ScoreCard
          label="Calories"
          value={Math.round(totals.calories || 0)}
          unit="kcal"
          pct={pctOf('calories')}
          goal={GOALS.calories}
          color={pctOf('calories') > 110 ? Colors.red : Colors.accent}
        />
        <ScoreCard
          label="Protein"
          value={Math.round(totals.protein || 0)}
          unit="g"
          pct={pctOf('protein')}
          goal={GOALS.protein}
          color={Colors.blue}
        />
        <ScoreCard
          label="Sodium"
          value={Math.round(totals.sodium || 0)}
          unit="mg"
          pct={pctOf('sodium')}
          goal={GOALS.sodium}
          color={pctOf('sodium') > 100 ? Colors.red : Colors.accent}
        />
      </View>

      {/* ─── 2. Macronutrients ─────────────────── */}
      <View style={sty.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>Macronutrients</AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          Daily macronutrient breakdown with clinical context
        </AppText>
        <View style={sty.nutrientCard}>
          {macroRows.map((row) => (
            <NutrientRow
              key={row.key}
              label={row.label}
              value={row.value}
              goal={row.goal}
              unit={row.unit}
              pct={row.pct}
              isUpper={row.upper}
              note={row.note}
            />
          ))}
        </View>
      </View>

      {/* ─── 3. Electrolytes & Minerals ────────── */}
      <View style={sty.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>Electrolytes & Minerals</AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          Key minerals for metabolic and cardiovascular health
        </AppText>
        <View style={sty.nutrientCard}>
          {electrolyteRows.map((row) => (
            <NutrientRow
              key={row.key}
              label={row.label}
              value={row.value}
              goal={row.goal}
              unit={row.unit}
              pct={row.pct}
              isUpper={row.upper}
              note={row.note}
            />
          ))}
        </View>
      </View>

      {/* ─── 4. Vitamins ──────────────────────── */}
      <View style={sty.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>Vitamins</AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          Essential vitamins — watch B12 and D for Metformin/T2DM
        </AppText>
        <View style={sty.nutrientCard}>
          {vitaminRows.map((row) => (
            <NutrientRow
              key={row.key}
              label={row.label}
              value={row.value}
              goal={row.goal}
              unit={row.unit}
              pct={row.pct}
              isUpper={false}
              note={row.note}
              critical={row.critical}
            />
          ))}
        </View>
      </View>

      {/* ─── 5. Specialty Nutrients ────────────── */}
      <View style={sty.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>Specialty Nutrients</AppText>
        <View style={sty.nutrientCard}>
          {specialtyRows.map((row) => (
            <NutrientRow
              key={row.key}
              label={row.label}
              value={row.value}
              goal={row.goal}
              unit={row.unit}
              pct={row.pct}
              isUpper={false}
              note={row.note}
            />
          ))}
        </View>
      </View>

      {/* ─── 6. Per-meal Breakdown ────────────── */}
      {mealList.length > 0 && (
        <View style={sty.section}>
          <AppText variant="sectionTitle" color={Colors.textSecondary}>Per-meal Breakdown</AppText>
          <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
            Macro split for each logged meal
          </AppText>
          {mealList.map((meal, idx) => (
            <MealBreakdown key={idx} meal={meal} idx={idx} />
          ))}
        </View>
      )}

      {/* ─── 7. Ayu Intelligence ─────────────── */}
      <View style={sty.section}>
        <View style={sty.ayuHeader}>
          <AppText variant="sectionTitle" color={Colors.textSecondary}>Ayu Intelligence</AppText>
          <View style={sty.ayuBadge}>
            <AppText variant="small" color={Colors.purpleText} style={{fontWeight: '700'}}>AI</AppText>
          </View>
        </View>

        {/* Score strip */}
        <View style={sty.scoreStripRow}>
          {scoreStrip.map((item) => (
            <View key={item.label} style={sty.scoreStripItem}>
              <AppText variant="small" color={Colors.textTertiary}>{item.label}</AppText>
              <AppText variant="bodyBold" color={item.color} style={{fontSize: ms(16)}}>
                {item.pct}%
              </AppText>
            </View>
          ))}
        </View>

        {/* Priority-ranked insights */}
        {ayuInsights.length > 0 && (
          <View style={{marginTop: vs(10)}}>
            <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '600', marginBottom: vs(4)}}>
              Priority insights
            </AppText>
            {ayuInsights.map((ins, idx) => (
              <InsightCard
                key={idx}
                icon={ins.icon}
                title={ins.title}
                text={ins.text}
                type={ins.type}
              />
            ))}
          </View>
        )}

        {/* What's going well */}
        {positives.length > 0 && (
          <View style={{marginTop: vs(14)}}>
            <AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600', marginBottom: vs(6)}}>
              What's going well
            </AppText>
            <View style={sty.positiveChips}>
              {positives.map((chip, idx) => (
                <View key={idx} style={sty.positiveChip}>
                  <AppText style={{fontSize: ms(12)}}>{chip.icon}</AppText>
                  <AppText variant="small" color={Colors.tealText} style={{marginLeft: s(4)}}>
                    {chip.label}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Dinner recommendation */}
        {dinnerRec && (
          <View style={sty.dinnerRec}>
            <View style={sty.dinnerRecHeader}>
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

      <View style={{height: vs(40)}} />
    </ScrollView>
  );
};

/* ─── Styles ───────────────────────────────────────── */

const sty = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingTop: vs(8),
  },

  /* Section */
  section: {
    marginTop: vs(22),
  },

  /* ── 1. Score Cards ── */
  scoreRow: {
    flexDirection: 'row',
    gap: s(8),
    marginTop: vs(4),
  },
  scoreCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  scoreBarTrack: {
    height: vs(5),
    backgroundColor: Colors.background,
    borderRadius: ms(3),
    overflow: 'hidden',
    marginTop: vs(4),
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: ms(3),
    minWidth: s(2),
  },

  /* ── 2-5. Nutrient Rows ── */
  nutrientCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(14),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  nutrientRow: {
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  nutrientHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  flagChip: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  nutrientBarTrack: {
    height: vs(8),
    backgroundColor: Colors.background,
    borderRadius: ms(4),
    overflow: 'hidden',
    position: 'relative',
  },
  nutrientBarFill: {
    height: '100%',
    borderRadius: ms(4),
    minWidth: s(3),
  },
  nutrientLimitLine: {
    position: 'absolute',
    right: 0,
    top: 0,
    bottom: 0,
    width: 2,
    backgroundColor: Colors.red,
  },
  nutrientStats: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(4),
  },
  clinicalNote: {
    marginTop: vs(6),
    backgroundColor: Colors.background,
    borderRadius: ms(6),
    padding: s(8),
  },
  clinicalNoteCritical: {
    backgroundColor: Colors.redBg,
    borderWidth: 1,
    borderColor: Colors.red,
  },

  /* ── 6. Per-meal Breakdown ── */
  mealCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(12),
    marginTop: vs(8),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  mealHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  mealSplitBar: {
    flexDirection: 'row',
    height: vs(10),
    borderRadius: ms(4),
    overflow: 'hidden',
    marginBottom: vs(8),
  },
  mealSplitSeg: {
    height: '100%',
  },
  mealMacroRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(8),
  },
  mealMacroItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  mealMacroDot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
  },
  mealEntryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(5),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },

  /* ── 7. Ayu Intelligence ── */
  ayuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  ayuBadge: {
    backgroundColor: Colors.purpleBg,
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  scoreStripRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(12),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  scoreStripItem: {
    alignItems: 'center',
    flex: 1,
  },
  insightCard: {
    borderRadius: ms(10),
    padding: s(12),
    marginTop: vs(6),
    borderLeftWidth: s(4),
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  positiveChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
  },
  positiveChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tealBg,
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    borderRadius: ms(16),
  },
  dinnerRec: {
    marginTop: vs(14),
    backgroundColor: Colors.purpleBg,
    borderRadius: ms(12),
    padding: s(14),
    borderWidth: 1,
    borderColor: Colors.purple,
  },
  dinnerRecHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  gapChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginTop: vs(8),
  },
  gapChip: {
    backgroundColor: Colors.amberBg,
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(10),
  },
});

export default NutrientsTab;
