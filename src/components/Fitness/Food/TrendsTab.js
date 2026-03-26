import React, {useState, useMemo} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {NUTRITION_GOALS, FOOD_DB, TREND_HISTORY, calcTotal} from '../../../constants/foodData';

/* ─── Constants ─────────────────────────────────────── */

const RANGE_OPTIONS = [
  {label: '7 days', days: 7},
  {label: '14 days', days: 14},
  {label: '30 days', days: 30},
];

const G = NUTRITION_GOALS || {};
const GOALS = {
  calories: G.cal || 1650, protein: G.pro || 75, carbs: G.carb || 180,
  fat: G.fat || 50, fibre: G.fib || 28, sugar: G.sug || 25,
  sodium: G.sod || 1500, potassium: G.pot || 3500, calcium: G.cal_m || 1000,
  magnesium: G.mag || 400, vitD: G.vitD || 600, b12: G.vitB12 || 2.4, omega3: G.omega3 || 1100,
};

const SODIUM_LIMIT = GOALS.sodium;
const FIBRE_TARGET = GOALS.fibre;
const CALORIE_TARGET = GOALS.calories;

/* ─── Helpers ───────────────────────────────────────── */

const fmtNum = (n) => {
  if (n >= 1000) return `${(n / 1000).toFixed(1)}k`;
  if (n % 1 !== 0) return n.toFixed(1);
  return `${n}`;
};

const avg = (arr) => arr.length > 0 ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const clamp = (v, lo, hi) => Math.max(lo, Math.min(hi, v));

const dayLabel = (idx, total) => {
  if (total <= 7) return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'][idx % 7] || '';
  if (total <= 14) return (idx % 2 === 0) ? `D${idx + 1}` : '';
  return (idx % 5 === 0) ? `D${idx + 1}` : '';
};

/* ─── Sub-components ────────────────────────────────── */

const RangePill = ({label, active, onPress}) => (
  <TouchableOpacity
    style={[sty.rangePill, active && sty.rangePillActive]}
    onPress={onPress}
    activeOpacity={0.7}>
    <AppText
      variant="caption"
      color={active ? Colors.white : Colors.textSecondary}
      style={{fontWeight: active ? '700' : '400'}}>
      {label}
    </AppText>
  </TouchableOpacity>
);

const HeadlineStat = ({label, value, unit, sub, color}) => (
  <View style={sty.headlineStat}>
    <AppText variant="small" color={Colors.textTertiary}>{label}</AppText>
    <View style={{flexDirection: 'row', alignItems: 'baseline', marginTop: vs(2)}}>
      <AppText variant="bodyBold" color={color || Colors.textPrimary}>
        {value}
      </AppText>
      {unit ? (
        <AppText variant="small" color={Colors.textTertiary}> {unit}</AppText>
      ) : null}
    </View>
    {sub ? (
      <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
        {sub}
      </AppText>
    ) : null}
  </View>
);

const TrendChart = ({title, subtitle, data, target, targetLabel, maxVal, getBarColor, height}) => {
  const chartHeight = height || vs(110);
  const safeMax = maxVal || Math.max(...data.map((d) => d.value), target || 1, 1);
  const targetPct = target ? clamp((target / safeMax) * 100, 0, 100) : null;

  return (
    <View style={sty.chartCard}>
      <AppText variant="bodyBold" color={Colors.textPrimary}>{title}</AppText>
      {subtitle ? (
        <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          {subtitle}
        </AppText>
      ) : null}

      <View style={[sty.chartArea, {height: chartHeight}]}>
        {/* Target line */}
        {targetPct !== null && (
          <View style={[sty.targetLine, {bottom: `${targetPct}%`}]}>
            <View style={sty.targetLineDash} />
            <AppText variant="small" color={Colors.red} style={{marginLeft: s(4), fontSize: ms(9)}}>
              {targetLabel || fmtNum(target)}
            </AppText>
          </View>
        )}

        {/* Bars */}
        <View style={sty.barsRow}>
          {data.map((d, idx) => {
            const pct = safeMax > 0 ? clamp((d.value / safeMax) * 100, 0, 100) : 0;
            const barColor = getBarColor ? getBarColor(d.value, target) : Colors.accent;
            return (
              <View key={idx} style={sty.barCol}>
                <View style={[sty.barTrack, {height: chartHeight - vs(20)}]}>
                  <View
                    style={[
                      sty.barFill,
                      {height: `${pct}%`, backgroundColor: barColor},
                    ]}
                  />
                </View>
                {d.label ? (
                  <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(3), fontSize: ms(8)}}>
                    {d.label}
                  </AppText>
                ) : null}
              </View>
            );
          })}
        </View>
      </View>
    </View>
  );
};

const FlagCard = ({icon, title, text, type}) => {
  const colorMap = {
    critical: {bg: Colors.redBg, border: Colors.red, text: Colors.redText},
    warning: {bg: Colors.amberBg, border: Colors.amber, text: Colors.amberText},
    good: {bg: Colors.tealBg, border: Colors.accent, text: Colors.tealText},
    info: {bg: Colors.blueBg, border: Colors.blue, text: Colors.blueText},
  };
  const c = colorMap[type] || colorMap.info;

  return (
    <View style={[sty.flagCard, {backgroundColor: c.bg, borderLeftColor: c.border}]}>
      <View style={sty.flagHeader}>
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

const TrendsTab = () => {
  const [rangeIdx, setRangeIdx] = useState(0);
  const rangeDays = RANGE_OPTIONS[rangeIdx].days;

  /* Slice trend history to selected range, mapping short keys to long */
  const history = useMemo(() => {
    const full = (TREND_HISTORY || []).map((d) => ({
      ...d,
      calories: d.calories || d.cal || 0,
      protein: d.protein || d.pro || 0,
      carbs: d.carbs || d.carb || 0,
      fat: d.fat || 0,
      fibre: d.fibre || d.fib || 0,
      sugar: d.sugar || d.sug || 0,
      sodium: d.sodium || d.sod || 0,
      potassium: d.potassium || d.pot || 0,
      magnesium: d.magnesium || d.mag || 0,
      vitD: d.vitD || 0,
    }));
    if (full.length === 0) return [];
    return full.slice(-rangeDays);
  }, [rangeDays]);

  /* ── Headline Stats ── */
  const headlines = useMemo(() => {
    if (history.length === 0) return {avgCal: 0, avgProt: 0, avgFibre: 0, avgSodium: 0, sodiumOverDays: 0};
    const cals = history.map((d) => d.calories || 0);
    const prots = history.map((d) => d.protein || 0);
    const fibres = history.map((d) => d.fibre || 0);
    const sodiums = history.map((d) => d.sodium || 0);
    const sodiumOverDays = sodiums.filter((v) => v > SODIUM_LIMIT).length;

    return {
      avgCal: Math.round(avg(cals)),
      avgProt: Math.round(avg(prots)),
      avgFibre: Math.round(avg(fibres)),
      avgSodium: Math.round(avg(sodiums)),
      sodiumOverDays,
    };
  }, [history]);

  /* ── Calorie Trend Data ── */
  const calorieTrend = useMemo(() => {
    return history.map((d, idx) => ({
      value: d.calories || 0,
      label: dayLabel(idx, history.length),
    }));
  }, [history]);

  const calMax = useMemo(
    () => Math.max(...calorieTrend.map((d) => d.value), CALORIE_TARGET * 1.3, 1),
    [calorieTrend],
  );

  /* ── Sodium Trend Data ── */
  const sodiumTrend = useMemo(() => {
    return history.map((d, idx) => ({
      value: d.sodium || 0,
      label: dayLabel(idx, history.length),
    }));
  }, [history]);

  const sodiumMax = useMemo(
    () => Math.max(...sodiumTrend.map((d) => d.value), SODIUM_LIMIT * 1.3, 1),
    [sodiumTrend],
  );

  /* ── Fibre Trend Data ── */
  const fibreTrend = useMemo(() => {
    return history.map((d, idx) => ({
      value: d.fibre || 0,
      label: dayLabel(idx, history.length),
    }));
  }, [history]);

  const fibreMax = useMemo(
    () => Math.max(...fibreTrend.map((d) => d.value), FIBRE_TARGET * 1.5, 1),
    [fibreTrend],
  );

  /* ── Average Macro Split ── */
  const macroSplit = useMemo(() => {
    if (history.length === 0) return {protPct: 0, carbsPct: 0, fatPct: 0, protAvg: 0, carbsAvg: 0, fatAvg: 0};
    const protAvg = avg(history.map((d) => d.protein || 0));
    const carbsAvg = avg(history.map((d) => d.carbs || 0));
    const fatAvg = avg(history.map((d) => d.fat || 0));
    const totalG = protAvg + carbsAvg + fatAvg || 1;
    return {
      protPct: Math.round((protAvg / totalG) * 100),
      carbsPct: Math.round((carbsAvg / totalG) * 100),
      fatPct: Math.round((fatAvg / totalG) * 100),
      protAvg: Math.round(protAvg),
      carbsAvg: Math.round(carbsAvg),
      fatAvg: Math.round(fatAvg),
    };
  }, [history]);

  /* ── Clinical Nutrition Flags ── */
  const clinicalFlags = useMemo(() => {
    const flags = [];
    if (history.length === 0) return flags;

    // Sodium over limit days
    const sodiumOverDays = history.filter((d) => (d.sodium || 0) > SODIUM_LIMIT).length;
    const sodiumOverPct = Math.round((sodiumOverDays / history.length) * 100);
    if (sodiumOverDays > 0) {
      flags.push({
        icon: '🧂',
        type: sodiumOverPct > 50 ? 'critical' : 'warning',
        title: `Sodium over limit ${sodiumOverDays}/${history.length} days (${sodiumOverPct}%)`,
        text: `HTN patients should stay under ${SODIUM_LIMIT}mg daily. Consistent excess raises systolic BP 5-10 mmHg over weeks. Review processed food intake and cooking salt usage.`,
      });
    } else {
      flags.push({
        icon: '✅',
        type: 'good',
        title: 'Sodium consistently under HTN limit',
        text: `Excellent sodium control over ${history.length} days. This supports blood pressure management alongside medication.`,
      });
    }

    // Fibre adequacy
    const fibreMetDays = history.filter((d) => (d.fibre || 0) >= FIBRE_TARGET).length;
    const fibreMetPct = Math.round((fibreMetDays / history.length) * 100);
    if (fibreMetPct >= 70) {
      flags.push({
        icon: '🥬',
        type: 'good',
        title: `Fibre goal met ${fibreMetDays}/${history.length} days`,
        text: `Strong fibre intake supports glucose control. Each 7g/day increase in fibre reduces T2DM risk by 6%.`,
      });
    } else {
      flags.push({
        icon: '🥦',
        type: fibreMetPct < 30 ? 'critical' : 'warning',
        title: `Fibre target met only ${fibreMetDays}/${history.length} days (${fibreMetPct}%)`,
        text: `Low fibre worsens post-meal glucose spikes. Add legumes (lentils, chickpeas), vegetables, and whole grains consistently.`,
      });
    }

    // Protein adequacy
    const protTarget = GOALS.protein || 75;
    const protMetDays = history.filter((d) => (d.protein || 0) >= protTarget * 0.9).length;
    const protMetPct = Math.round((protMetDays / history.length) * 100);
    if (protMetPct >= 70) {
      flags.push({
        icon: '💪',
        type: 'good',
        title: `Protein adequate ${protMetDays}/${history.length} days`,
        text: `Consistent protein intake preserves lean muscle mass and improves glycaemic control. Keep it up.`,
      });
    } else {
      flags.push({
        icon: '🥩',
        type: 'warning',
        title: `Protein below target ${history.length - protMetDays}/${history.length} days`,
        text: `Inadequate protein accelerates sarcopenia (muscle loss), reducing glucose disposal capacity. Aim for 1.2-1.6 g/kg/day.`,
      });
    }

    // Vitamin D gap (if tracked)
    const vitDTracked = history.some((d) => d.vitD !== undefined);
    if (vitDTracked) {
      const vitDTarget = GOALS.vitD || 20;
      const avgVitD = avg(history.map((d) => d.vitD || 0));
      const vitDPct = Math.round((avgVitD / vitDTarget) * 100);
      if (vitDPct < 60) {
        flags.push({
          icon: '☀️',
          type: 'critical',
          title: `Vitamin D avg: ${avgVitD.toFixed(1)} mcg/day (${vitDPct}% of target)`,
          text: `Persistent Vitamin D deficiency worsens insulin resistance and increases CVD risk. Dietary sources alone are rarely sufficient — consider supplementation.`,
        });
      } else if (vitDPct < 90) {
        flags.push({
          icon: '☀️',
          type: 'warning',
          title: `Vitamin D slightly low: avg ${avgVitD.toFixed(1)} mcg/day`,
          text: `Aim for 20 mcg/day from fortified foods, fatty fish, and sun exposure.`,
        });
      }
    }

    return flags;
  }, [history]);

  /* ── Ayu Trend Insight ── */
  const ayuTrendInsight = useMemo(() => {
    if (history.length < 3) return null;

    const parts = [];
    const avgCal = headlines.avgCal;
    const calDiff = avgCal - CALORIE_TARGET;

    if (Math.abs(calDiff) <= CALORIE_TARGET * 0.05) {
      parts.push(`Your average calorie intake (${fmtNum(avgCal)} kcal) is well-aligned with your ${fmtNum(CALORIE_TARGET)} kcal target over the past ${history.length} days.`);
    } else if (calDiff > 0) {
      const weeklyExcess = Math.round(calDiff * 7);
      parts.push(`You're averaging ${fmtNum(avgCal)} kcal/day, which is +${Math.round(calDiff)} kcal over target. That's ~${fmtNum(weeklyExcess)} kcal/week excess, potentially adding ${(weeklyExcess / 7700).toFixed(1)} kg/week.`);
    } else {
      parts.push(`You're averaging ${fmtNum(avgCal)} kcal/day, ${Math.round(Math.abs(calDiff))} kcal below target. Moderate deficit supports weight loss, but ensure you're getting adequate nutrients.`);
    }

    // Sodium pattern
    if (headlines.sodiumOverDays > history.length * 0.5) {
      parts.push(`Sodium exceeded the HTN limit on ${headlines.sodiumOverDays} of ${history.length} days. This is the highest-priority dietary change for your blood pressure.`);
    }

    // Fibre pattern
    const fibreMetDays = history.filter((d) => (d.fibre || 0) >= FIBRE_TARGET).length;
    if (fibreMetDays < history.length * 0.5) {
      parts.push(`Fibre intake is consistently below target. Consider adding a serving of legumes or psyllium husk daily — this alone can lower HbA1c by 0.3%.`);
    }

    // Protein pattern
    const protTarget = GOALS.protein || 75;
    const protAdequate = history.filter((d) => (d.protein || 0) >= protTarget * 0.9).length;
    if (protAdequate >= history.length * 0.7) {
      parts.push(`Protein intake has been consistent — this is excellent for maintaining muscle mass and insulin sensitivity.`);
    }

    return parts.join(' ');
  }, [history, headlines]);

  return (
    <ScrollView style={sty.container} showsVerticalScrollIndicator={false}>
      {/* ─── 1. Date Range Pills ───────────────── */}
      <View style={sty.rangeRow}>
        {RANGE_OPTIONS.map((opt, idx) => (
          <RangePill
            key={opt.days}
            label={opt.label}
            active={rangeIdx === idx}
            onPress={() => setRangeIdx(idx)}
          />
        ))}
      </View>

      {/* ─── 2. Headline Stats ─────────────────── */}
      <View style={sty.headlineGrid}>
        <HeadlineStat
          label="Avg Calories"
          value={fmtNum(headlines.avgCal)}
          unit="kcal"
          sub={`Target: ${fmtNum(CALORIE_TARGET)}`}
          color={Math.abs(headlines.avgCal - CALORIE_TARGET) <= CALORIE_TARGET * 0.1 ? Colors.accent : Colors.amber}
        />
        <HeadlineStat
          label="Avg Protein"
          value={`${headlines.avgProt}g`}
          sub={`Target: ${GOALS.protein || 75}g`}
          color={headlines.avgProt >= (GOALS.protein || 75) * 0.9 ? Colors.accent : Colors.amber}
        />
        <HeadlineStat
          label="Avg Fibre"
          value={`${headlines.avgFibre}g`}
          sub={`Target: ${FIBRE_TARGET}g`}
          color={headlines.avgFibre >= FIBRE_TARGET * 0.9 ? Colors.accent : Colors.amber}
        />
        <HeadlineStat
          label="Avg Sodium"
          value={fmtNum(headlines.avgSodium)}
          unit="mg"
          sub={headlines.sodiumOverDays > 0 ? `Over limit ${headlines.sodiumOverDays} days` : 'Under limit all days'}
          color={headlines.sodiumOverDays > 0 ? Colors.red : Colors.accent}
        />
      </View>

      {/* ─── 3. Calorie Trend Chart ────────────── */}
      <View style={sty.section}>
        <TrendChart
          title="Calorie Trend"
          subtitle={`Daily intake vs ${fmtNum(CALORIE_TARGET)} kcal target`}
          data={calorieTrend}
          target={CALORIE_TARGET}
          targetLabel={`${fmtNum(CALORIE_TARGET)}`}
          maxVal={calMax}
          getBarColor={(val) => {
            if (val > CALORIE_TARGET * 1.1) return Colors.red;
            if (val < CALORIE_TARGET * 0.7) return Colors.amber;
            return Colors.accent;
          }}
        />
      </View>

      {/* ─── 4. Sodium Trend Chart ─────────────── */}
      <View style={sty.section}>
        <TrendChart
          title="Sodium Trend"
          subtitle={`HTN limit: ${fmtNum(SODIUM_LIMIT)} mg/day — critical for BP control`}
          data={sodiumTrend}
          target={SODIUM_LIMIT}
          targetLabel={`${fmtNum(SODIUM_LIMIT)}mg`}
          maxVal={sodiumMax}
          getBarColor={(val) => val > SODIUM_LIMIT ? Colors.red : Colors.accent}
        />
      </View>

      {/* ─── 5. Fibre Trend Chart ──────────────── */}
      <View style={sty.section}>
        <TrendChart
          title="Fibre Trend"
          subtitle={`Target: ${FIBRE_TARGET}g/day — essential for glucose control`}
          data={fibreTrend}
          target={FIBRE_TARGET}
          targetLabel={`${FIBRE_TARGET}g`}
          maxVal={fibreMax}
          getBarColor={(val) => val >= FIBRE_TARGET ? Colors.accent : Colors.amber}
        />
      </View>

      {/* ─── 6. Average Macro Split ────────────── */}
      <View style={sty.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>Average Macro Split</AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          Protein / Carbs / Fat ratio over {rangeDays} days
        </AppText>

        <View style={sty.macroCard}>
          {/* Stacked horizontal bar */}
          <View style={sty.macroBar}>
            <View style={[sty.macroSeg, {flex: macroSplit.protPct, backgroundColor: Colors.blue, borderTopLeftRadius: ms(6), borderBottomLeftRadius: ms(6)}]} />
            <View style={[sty.macroSeg, {flex: macroSplit.carbsPct, backgroundColor: Colors.amber}]} />
            <View style={[sty.macroSeg, {flex: macroSplit.fatPct, backgroundColor: Colors.purple, borderTopRightRadius: ms(6), borderBottomRightRadius: ms(6)}]} />
          </View>

          {/* 3-column breakdown */}
          <View style={sty.macroColumns}>
            <View style={sty.macroColItem}>
              <View style={[sty.macroDot, {backgroundColor: Colors.blue}]} />
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>Protein</AppText>
              <AppText variant="bodyBold" color={Colors.blue}>{macroSplit.protPct}%</AppText>
              <AppText variant="small" color={Colors.textTertiary}>{macroSplit.protAvg}g avg</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
                Target: 20-30%
              </AppText>
            </View>
            <View style={sty.macroColItem}>
              <View style={[sty.macroDot, {backgroundColor: Colors.amber}]} />
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>Carbs</AppText>
              <AppText variant="bodyBold" color={Colors.amber}>{macroSplit.carbsPct}%</AppText>
              <AppText variant="small" color={Colors.textTertiary}>{macroSplit.carbsAvg}g avg</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
                Target: 40-50%
              </AppText>
            </View>
            <View style={sty.macroColItem}>
              <View style={[sty.macroDot, {backgroundColor: Colors.purple}]} />
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>Fat</AppText>
              <AppText variant="bodyBold" color={Colors.purple}>{macroSplit.fatPct}%</AppText>
              <AppText variant="small" color={Colors.textTertiary}>{macroSplit.fatAvg}g avg</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
                Target: 25-35%
              </AppText>
            </View>
          </View>
        </View>
      </View>

      {/* ─── 7. Clinical Nutrition Flags ────────── */}
      <View style={sty.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>Clinical Nutrition Flags</AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          Pattern analysis over {rangeDays} days
        </AppText>
        {clinicalFlags.map((flag, idx) => (
          <FlagCard
            key={idx}
            icon={flag.icon}
            title={flag.title}
            text={flag.text}
            type={flag.type}
          />
        ))}
      </View>

      {/* ─── 8. Ayu Trend Insight ──────────────── */}
      {ayuTrendInsight && (
        <View style={sty.section}>
          <View style={sty.ayuHeader}>
            <AppText variant="sectionTitle" color={Colors.textSecondary}>Ayu Trend Insight</AppText>
            <View style={sty.ayuBadge}>
              <AppText variant="small" color={Colors.purpleText} style={{fontWeight: '700'}}>AI</AppText>
            </View>
          </View>
          <View style={sty.ayuCard}>
            <View style={sty.ayuCardHeader}>
              <AppText style={{fontSize: ms(18)}}>{'🔮'}</AppText>
              <AppText variant="bodyBold" color={Colors.purpleText} style={{marginLeft: s(8)}}>
                {rangeDays}-day analysis
              </AppText>
            </View>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(8), lineHeight: ms(18)}}>
              {ayuTrendInsight}
            </AppText>
            <View style={sty.ayuFooter}>
              <AppText variant="small" color={Colors.textTertiary}>
                Based on {history.length} days of tracked data
              </AppText>
            </View>
          </View>
        </View>
      )}

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

  /* ── 1. Range Pills ── */
  rangeRow: {
    flexDirection: 'row',
    gap: s(8),
    marginTop: vs(4),
  },
  rangePill: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(8),
    borderRadius: ms(20),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  rangePillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  /* ── 2. Headline Stats ── */
  headlineGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginTop: vs(14),
  },
  headlineStat: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(12),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },

  /* ── 3-5. Trend Charts ── */
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(14),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chartArea: {
    marginTop: vs(10),
    position: 'relative',
    overflow: 'hidden',
  },
  targetLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 1,
  },
  targetLineDash: {
    flex: 1,
    height: 1.5,
    backgroundColor: Colors.red,
    opacity: 0.5,
  },
  barsRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    flex: 1,
    gap: s(1),
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  barTrack: {
    width: '100%',
    justifyContent: 'flex-end',
    borderRadius: ms(2),
  },
  barFill: {
    width: '100%',
    borderRadius: ms(2),
    minHeight: vs(2),
  },

  /* ── 6. Macro Split ── */
  macroCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(14),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  macroBar: {
    flexDirection: 'row',
    height: vs(14),
    borderRadius: ms(6),
    overflow: 'hidden',
  },
  macroSeg: {
    height: '100%',
  },
  macroColumns: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: vs(14),
  },
  macroColItem: {
    alignItems: 'center',
    gap: vs(2),
  },
  macroDot: {
    width: s(10),
    height: s(10),
    borderRadius: s(5),
    marginBottom: vs(2),
  },

  /* ── 7. Clinical Flags ── */
  flagCard: {
    borderRadius: ms(10),
    padding: s(12),
    marginTop: vs(8),
    borderLeftWidth: s(4),
  },
  flagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* ── 8. Ayu Trend Insight ── */
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
  ayuCard: {
    backgroundColor: Colors.purpleBg,
    borderRadius: ms(12),
    padding: s(14),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.purple,
  },
  ayuCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ayuFooter: {
    marginTop: vs(10),
    paddingTop: vs(8),
    borderTopWidth: 1,
    borderTopColor: 'rgba(108, 99, 255, 0.15)',
  },
});

export default TrendsTab;
