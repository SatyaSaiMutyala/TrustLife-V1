import React, {useState, useMemo} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {SLEEP_HISTORY, SLEEP_USER} from '../../../constants/sleepData';

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const DATE_RANGES = [
  {id: '7d', label: 'This week', days: 7},
  {id: '14d', label: '2 weeks', days: 14},
  {id: '30d', label: '30 days', days: 30},
  {id: 'all', label: 'All time', days: Infinity},
];

const BAR_MAX_HEIGHT = vs(100);

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const formatMins = (m) => {
  const h = Math.floor(m / 60);
  const min = Math.round(m % 60);
  return `${h}h ${min}m`;
};

const avg = (arr) =>
  arr.length ? arr.reduce((a, b) => a + b, 0) / arr.length : 0;

const getScoreColor = (v) => {
  if (v >= 80) return Colors.accent;
  if (v >= 65) return Colors.accent;
  return Colors.red;
};

const getDurColor = (mins) => {
  if (mins >= 420) return Colors.accent;
  if (mins >= 360) return Colors.amber;
  return Colors.red;
};

const getDurColorForAvg = (mins) => {
  if (mins >= 420) return Colors.tealText;
  if (mins >= 360) return Colors.amberText;
  return Colors.redText;
};

const getDurBgForAvg = (mins) => {
  if (mins >= 420) return Colors.tealBg;
  if (mins >= 360) return Colors.amberBg;
  return Colors.redBg;
};

const getScoreAvgColor = (v) => {
  if (v >= 75) return Colors.tealText;
  if (v >= 60) return Colors.amberText;
  return Colors.redText;
};

const getScoreAvgBg = (v) => {
  if (v >= 75) return Colors.tealBg;
  if (v >= 60) return Colors.amberBg;
  return Colors.redBg;
};

const getDeepColor = (mins) => {
  if (mins >= 90) return Colors.tealText;
  if (mins >= 60) return Colors.amberText;
  return Colors.redText;
};

const getDeepBg = (mins) => {
  if (mins >= 90) return Colors.tealBg;
  if (mins >= 60) return Colors.amberBg;
  return Colors.redBg;
};

const getGlucoseBarColor = (v) => {
  if (v <= 120) return Colors.accent;
  if (v <= 140) return Colors.amber;
  return Colors.red;
};

// ──────────────────────────────────────────────
// Date Range Pills
// ──────────────────────────────────────────────

const RangePills = ({active, onSelect}) => (
  <View style={styles.pillRow}>
    {DATE_RANGES.map((r) => {
      const isActive = active === r.id;
      return (
        <TouchableOpacity
          key={r.id}
          activeOpacity={0.7}
          onPress={() => onSelect(r.id)}
          style={[styles.pill, isActive && styles.pillActive]}>
          <AppText
            style={styles.pillText}
            color={isActive ? Colors.white : Colors.textSecondary}>
            {r.label}
          </AppText>
        </TouchableOpacity>
      );
    })}
  </View>
);

// ──────────────────────────────────────────────
// Stat Box
// ──────────────────────────────────────────────

const StatBox = ({label, value, unit, bgColor, textColor}) => (
  <View style={[styles.statBox, {backgroundColor: bgColor || Colors.background}]}>
    <AppText
      style={[styles.statValue, {color: textColor || Colors.textPrimary}]}>
      {value}
    </AppText>
    {unit ? (
      <AppText style={styles.statUnit} color={textColor || Colors.textSecondary}>
        {unit}
      </AppText>
    ) : null}
    <AppText style={styles.statLabel} color={Colors.textSecondary}>
      {label}
    </AppText>
  </View>
);

// ──────────────────────────────────────────────
// Vertical Bar Chart
// ──────────────────────────────────────────────

const BarChart = ({data, getColor, maxValue, targetLine, targetLabel}) => {
  const max = maxValue || Math.max(...data.map((d) => d.value), 1);

  return (
    <View style={styles.chartWrap}>
      <View style={styles.chartBars}>
        {targetLine != null && (
          <View
            style={[
              styles.targetLine,
              {bottom: (targetLine / max) * BAR_MAX_HEIGHT},
            ]}>
            <View style={styles.targetDash} />
            {targetLabel && (
              <AppText style={styles.targetLabel}>{targetLabel}</AppText>
            )}
          </View>
        )}
        {data.map((d, i) => {
          const h = Math.max((d.value / max) * BAR_MAX_HEIGHT, vs(4));
          const color = getColor(d.value);
          return (
            <View key={i} style={styles.barCol}>
              <View style={styles.barValueWrap}>
                <AppText style={styles.barValueText}>
                  {d.display || Math.round(d.value)}
                </AppText>
              </View>
              <View
                style={[
                  styles.bar,
                  {height: h, backgroundColor: color},
                ]}
              />
              <AppText style={styles.barLabel}>{d.label}</AppText>
            </View>
          );
        })}
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Section Card
// ──────────────────────────────────────────────

const SectionCard = ({title, emoji, children, noPad}) => (
  <View style={styles.sectionCard}>
    {title && (
      <View style={styles.sectionHeader}>
        {emoji && <AppText style={styles.sectionEmoji}>{emoji}</AppText>}
        <AppText variant="bodyBold" style={styles.sectionTitle}>
          {title}
        </AppText>
      </View>
    )}
    <View style={noPad ? undefined : styles.sectionBody}>{children}</View>
  </View>
);

// ──────────────────────────────────────────────
// Nightly Log Row
// ──────────────────────────────────────────────

const NightRow = ({night, isLast}) => (
  <View style={[styles.nightRow, !isLast && styles.nightRowBorder]}>
    <View style={styles.nightLeft}>
      <AppText variant="bodyBold" style={styles.nightDate}>
        {night.date}
      </AppText>
      <AppText variant="caption" color={Colors.textSecondary}>
        {formatMins(night.dur)} &middot; Bed {night.bedtime}
      </AppText>
    </View>
    <View style={styles.nightRight}>
      <View style={styles.nightMetric}>
        <AppText
          style={[styles.nightMetricVal, {color: getScoreColor(night.score)}]}>
          {night.score}
        </AppText>
        <AppText style={styles.nightMetricLbl}>Score</AppText>
      </View>
      <View style={styles.nightMetric}>
        <AppText style={styles.nightMetricVal}>
          {Math.floor(night.deep / 60)}h{night.deep % 60}m
        </AppText>
        <AppText style={styles.nightMetricLbl}>Deep</AppText>
      </View>
      <View style={styles.nightMetric}>
        <AppText style={styles.nightMetricVal}>
          {Math.floor(night.rem / 60)}h{night.rem % 60}m
        </AppText>
        <AppText style={styles.nightMetricLbl}>REM</AppText>
      </View>
      <View style={styles.nightMetric}>
        <AppText style={[styles.nightMetricVal, {color: getGlucoseBarColor(night.bg)}]}>
          {night.bg}
        </AppText>
        <AppText style={styles.nightMetricLbl}>BG</AppText>
      </View>
      <View style={styles.nightMetric}>
        <AppText style={styles.nightMetricVal}>{night.hrv}</AppText>
        <AppText style={styles.nightMetricLbl}>HRV</AppText>
      </View>
    </View>
  </View>
);

// ──────────────────────────────────────────────
// Trends Tab Component
// ──────────────────────────────────────────────

const TrendsTab = () => {
  const [range, setRange] = useState('7d');

  // Filter data by range
  const filtered = useMemo(() => {
    const days = DATE_RANGES.find((r) => r.id === range)?.days ?? 7;
    return days === Infinity
      ? SLEEP_HISTORY
      : SLEEP_HISTORY.slice(0, Math.min(days, SLEEP_HISTORY.length));
  }, [range]);

  // Headline stats
  const avgDur = avg(filtered.map((n) => n.dur));
  const avgScore = avg(filtered.map((n) => n.score));
  const avgDeep = avg(filtered.map((n) => n.deep));
  const avgHRV = avg(filtered.map((n) => n.hrv));
  const avgBG = avg(filtered.map((n) => n.bg));
  const avgBP = avg(filtered.map((n) => n.bp));

  // Glucose vs sleep correlation
  const goodNights = filtered.filter((n) => n.score >= 75);
  const poorNights = filtered.filter((n) => n.score < 65);
  const avgBGGood = goodNights.length ? avg(goodNights.map((n) => n.bg)) : 0;
  const avgBGPoor = poorNights.length ? avg(poorNights.map((n) => n.bg)) : 0;
  const bgDiff = avgBGPoor - avgBGGood;

  // Sleep consistency
  const parseBedtime = (t) => {
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m;
  };
  const bedtimeMins = filtered.map((n) => {
    let m = parseBedtime(n.bedtime);
    if (m < 720) m += 1440; // past-midnight times
    return m;
  });
  const avgBedtimeRaw = avg(bedtimeMins);
  const bedtimeVariance =
    bedtimeMins.length > 1
      ? Math.round(
          Math.sqrt(
            avg(bedtimeMins.map((b) => Math.pow(b - avgBedtimeRaw, 2))),
          ),
        )
      : 0;
  const avgBedtimeNorm = Math.round(avgBedtimeRaw) % 1440;
  const avgBedtimeStr = `${String(Math.floor(avgBedtimeNorm / 60)).padStart(2, '0')}:${String(avgBedtimeNorm % 60).padStart(2, '0')}`;
  const goodNightRate =
    filtered.length > 0
      ? Math.round((goodNights.length / filtered.length) * 100)
      : 0;

  // Chart data (last 7 from filtered)
  const chartSlice = filtered.slice(0, 7).reverse();

  const scoreChartData = chartSlice.map((n) => ({
    label: n.date.replace(' Mar', ''),
    value: n.score,
  }));

  const durChartData = chartSlice.map((n) => ({
    label: n.date.replace(' Mar', ''),
    value: n.dur,
    display: formatMins(n.dur),
  }));

  const glucoseChartData = chartSlice.map((n) => ({
    label: n.date.replace(' Mar', ''),
    value: n.bg,
  }));

  // Ayu trend insight
  const ayuTrendInsight = `${SLEEP_USER.name}, over the last ${filtered.length} nights your average sleep score is ${Math.round(avgScore)} with ${formatMins(Math.round(avgDeep))} deep sleep. ${bgDiff > 5 ? `Fasting glucose is ${Math.round(bgDiff)} mg/dL higher on poor-sleep nights vs good-sleep nights — this confirms a strong sleep-glucose link for you.` : 'Your glucose levels remain relatively stable regardless of sleep quality.'} ${bedtimeVariance > 60 ? `Your bedtime variance of \u00b1${bedtimeVariance} min is high — aim for a consistent window within \u00b130 min to optimise circadian rhythm.` : `Bedtime consistency is good (\u00b1${bedtimeVariance} min) — this supports your circadian health.`} ${avgHRV >= 35 ? `HRV averaging ${Math.round(avgHRV)} ms shows adequate autonomic recovery.` : `HRV averaging ${Math.round(avgHRV)} ms is below optimal — focus on stress management and sleep hygiene.`}`;

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* ── Date Range Pills ── */}
      <RangePills active={range} onSelect={setRange} />

      {/* ── Headline Stats ── */}
      <SectionCard title="Sleep Overview" emoji="📊">
        <View style={styles.statsGrid}>
          <StatBox
            label="Avg duration"
            value={formatMins(Math.round(avgDur))}
            bgColor={getDurBgForAvg(avgDur)}
            textColor={getDurColorForAvg(avgDur)}
          />
          <StatBox
            label="Avg score"
            value={Math.round(avgScore)}
            unit="/100"
            bgColor={getScoreAvgBg(avgScore)}
            textColor={getScoreAvgColor(avgScore)}
          />
          <StatBox
            label="Avg deep sleep"
            value={formatMins(Math.round(avgDeep))}
            bgColor={getDeepBg(avgDeep)}
            textColor={getDeepColor(avgDeep)}
          />
          <StatBox
            label="Avg HRV"
            value={Math.round(avgHRV)}
            unit="ms"
            bgColor={Colors.blueBg}
            textColor={Colors.blueText}
          />
        </View>
      </SectionCard>

      {/* ── Sleep Score Chart ── */}
      <SectionCard title="Sleep Score" emoji="🏆" noPad>
        <BarChart
          data={scoreChartData}
          getColor={getScoreColor}
          maxValue={100}
        />
      </SectionCard>

      {/* ── Duration Chart ── */}
      <SectionCard title="Sleep Duration" emoji="⏱️" noPad>
        <BarChart
          data={durChartData}
          getColor={getDurColor}
          maxValue={540}
          targetLine={420}
          targetLabel="7h target"
        />
      </SectionCard>

      {/* ── Glucose vs Sleep ── */}
      <SectionCard title="Glucose vs Sleep" emoji="🩸" noPad>
        <BarChart
          data={glucoseChartData}
          getColor={getGlucoseBarColor}
          maxValue={200}
        />
        <View style={styles.correlationBox}>
          <AppText variant="caption" color={Colors.textSecondary}>
            Good-sleep nights (score {'\u2265'}75): avg fasting BG{' '}
            <AppText variant="bodyBold" color={Colors.tealText}>
              {Math.round(avgBGGood)} mg/dL
            </AppText>
          </AppText>
          <AppText
            variant="caption"
            color={Colors.textSecondary}
            style={styles.correlationLine}>
            Poor-sleep nights (score {'<'}65): avg fasting BG{' '}
            <AppText variant="bodyBold" color={Colors.redText}>
              {Math.round(avgBGPoor)} mg/dL
            </AppText>
          </AppText>
          {bgDiff > 0 && (
            <AppText
              variant="caption"
              color={Colors.amberText}
              style={styles.correlationNote}>
              {'\u0394'} {Math.round(bgDiff)} mg/dL difference — sleep quality
              directly impacts your glucose
            </AppText>
          )}
        </View>
      </SectionCard>

      {/* ── BP & HRV Clinical Trend ── */}
      <SectionCard title="BP & HRV Clinical Trend" emoji="💓">
        <View style={styles.statsGrid}>
          <StatBox
            label="Avg BP"
            value={Math.round(avgBP)}
            unit="mmHg"
            bgColor={avgBP <= 130 ? Colors.tealBg : avgBP <= 140 ? Colors.amberBg : Colors.redBg}
            textColor={avgBP <= 130 ? Colors.tealText : avgBP <= 140 ? Colors.amberText : Colors.redText}
          />
          <StatBox
            label="Avg HRV"
            value={Math.round(avgHRV)}
            unit="ms"
            bgColor={avgHRV >= 35 ? Colors.tealBg : Colors.amberBg}
            textColor={avgHRV >= 35 ? Colors.tealText : Colors.amberText}
          />
          <StatBox
            label="Avg fasting BG"
            value={Math.round(avgBG)}
            unit="mg/dL"
            bgColor={avgBG <= 120 ? Colors.tealBg : avgBG <= 140 ? Colors.amberBg : Colors.redBg}
            textColor={avgBG <= 120 ? Colors.tealText : avgBG <= 140 ? Colors.amberText : Colors.redText}
          />
          <StatBox
            label="Good night rate"
            value={`${goodNightRate}%`}
            bgColor={goodNightRate >= 60 ? Colors.tealBg : Colors.amberBg}
            textColor={goodNightRate >= 60 ? Colors.tealText : Colors.amberText}
          />
        </View>
      </SectionCard>

      {/* ── Sleep Consistency ── */}
      <SectionCard title="Sleep Consistency" emoji="🔄">
        <View style={styles.consistencyGrid}>
          <View style={styles.consistencyItem}>
            <AppText style={styles.consistencyValue}>
              {'\u00b1'}{bedtimeVariance} min
            </AppText>
            <AppText style={styles.consistencyLabel}>Bedtime variance</AppText>
          </View>
          <View style={styles.consistencyItem}>
            <AppText style={styles.consistencyValue}>{avgBedtimeStr}</AppText>
            <AppText style={styles.consistencyLabel}>Avg bedtime</AppText>
          </View>
          <View style={styles.consistencyItem}>
            <AppText style={styles.consistencyValue}>{goodNightRate}%</AppText>
            <AppText style={styles.consistencyLabel}>Good night rate</AppText>
          </View>
        </View>
        {bedtimeVariance > 60 && (
          <View style={styles.warningBanner}>
            <AppText style={styles.warningEmoji}>{'⚠️'}</AppText>
            <AppText
              variant="caption"
              color={Colors.amberText}
              style={styles.warningText}>
              Bedtime variance exceeds {'\u00b1'}60 min. Irregular sleep
              schedules disrupt circadian rhythm and impair glucose regulation.
              Aim for {'\u00b1'}30 min consistency.
            </AppText>
          </View>
        )}
      </SectionCard>

      {/* ── Nightly Log ── */}
      <SectionCard title="Nightly Log" emoji="📋">
        {chartSlice.map((night, idx) => (
          <NightRow
            key={night.date}
            night={night}
            isLast={idx === chartSlice.length - 1}
          />
        ))}
      </SectionCard>

      {/* ── Ayu Trend Insight ── */}
      <View style={styles.ayuCard}>
        <View style={styles.ayuHeader}>
          <AppText style={styles.ayuEmoji}>{'🤖'}</AppText>
          <AppText variant="bodyBold" color={Colors.primary} style={styles.ayuTitle}>
            Ayu Trend Insight
          </AppText>
        </View>
        <AppText
          variant="body"
          color={Colors.textSecondary}
          style={styles.ayuBody}>
          {ayuTrendInsight}
        </AppText>
      </View>

      <View style={styles.bottomSpacer} />
    </ScrollView>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    paddingHorizontal: s(16),
    paddingTop: vs(16),
    paddingBottom: vs(40),
  },

  /* Pills */
  pillRow: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(16),
  },
  pill: {
    flex: 1,
    paddingVertical: vs(8),
    paddingHorizontal: s(6),
    borderRadius: ms(10),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    alignItems: 'center',
  },
  pillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  pillText: {
    fontSize: ms(11),
    fontWeight: '600',
  },

  /* Section Card */
  sectionCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    padding: ms(16),
    marginBottom: vs(16),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  sectionEmoji: {
    fontSize: ms(18),
    marginRight: s(8),
  },
  sectionTitle: {
    fontSize: ms(15),
  },
  sectionBody: {},

  /* Stats Grid */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  statBox: {
    width: '47.5%',
    borderRadius: ms(12),
    padding: ms(14),
    alignItems: 'center',
  },
  statValue: {
    fontSize: ms(18),
    fontWeight: '800',
    marginBottom: vs(2),
  },
  statUnit: {
    fontSize: ms(10),
    fontWeight: '500',
    marginBottom: vs(4),
  },
  statLabel: {
    fontSize: ms(10),
    fontWeight: '600',
    textAlign: 'center',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  /* Chart */
  chartWrap: {
    paddingTop: vs(8),
    paddingBottom: vs(4),
  },
  chartBars: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    justifyContent: 'space-around',
    height: BAR_MAX_HEIGHT + vs(30),
    paddingBottom: vs(18),
    position: 'relative',
  },
  barCol: {
    alignItems: 'center',
    flex: 1,
  },
  barValueWrap: {
    marginBottom: vs(4),
  },
  barValueText: {
    fontSize: ms(8),
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  bar: {
    width: s(22),
    borderRadius: ms(6),
    minHeight: vs(4),
  },
  barLabel: {
    fontSize: ms(8),
    fontWeight: '500',
    color: Colors.textTertiary,
    marginTop: vs(5),
  },
  targetLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    flexDirection: 'row',
    alignItems: 'center',
    zIndex: 10,
  },
  targetDash: {
    flex: 1,
    height: 1,
    borderStyle: 'dashed',
    borderWidth: 0.8,
    borderColor: Colors.textTertiary,
  },
  targetLabel: {
    fontSize: ms(8),
    fontWeight: '600',
    color: Colors.textTertiary,
    marginLeft: s(4),
  },

  /* Correlation */
  correlationBox: {
    padding: ms(14),
    paddingTop: vs(4),
  },
  correlationLine: {
    marginTop: vs(4),
  },
  correlationNote: {
    marginTop: vs(8),
    fontWeight: '600',
  },

  /* Consistency */
  consistencyGrid: {
    flexDirection: 'row',
    gap: s(8),
  },
  consistencyItem: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: ms(12),
    padding: ms(12),
    alignItems: 'center',
  },
  consistencyValue: {
    fontSize: ms(16),
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: vs(4),
  },
  consistencyLabel: {
    fontSize: ms(9),
    fontWeight: '600',
    color: Colors.textSecondary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    textAlign: 'center',
  },
  warningBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.amberBg,
    borderRadius: ms(10),
    padding: ms(12),
    marginTop: vs(12),
  },
  warningEmoji: {
    fontSize: ms(16),
    marginRight: s(8),
    marginTop: vs(1),
  },
  warningText: {
    flex: 1,
    fontSize: ms(11),
    lineHeight: ms(16),
    fontWeight: '500',
  },

  /* Nightly Log */
  nightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  nightRowBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  nightLeft: {
    width: s(80),
  },
  nightDate: {
    fontSize: ms(12),
    marginBottom: vs(2),
  },
  nightRight: {
    flex: 1,
    flexDirection: 'row',
    justifyContent: 'space-around',
  },
  nightMetric: {
    alignItems: 'center',
  },
  nightMetricVal: {
    fontSize: ms(12),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: vs(1),
  },
  nightMetricLbl: {
    fontSize: ms(7),
    fontWeight: '600',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.3,
  },

  /* Ayu Card */
  ayuCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(16),
    padding: ms(18),
    marginBottom: vs(16),
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  ayuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  ayuEmoji: {
    fontSize: ms(22),
    marginRight: s(8),
  },
  ayuTitle: {
    fontSize: ms(15),
  },
  ayuBody: {
    fontSize: ms(12.5),
    lineHeight: ms(19),
  },

  /* Bottom */
  bottomSpacer: {
    height: vs(30),
  },
});

export default TrendsTab;
