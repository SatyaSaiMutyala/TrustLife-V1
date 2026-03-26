import React, {useState, useMemo} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity, useWindowDimensions} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {
  PHASE_DATES,
  CYCLE_STATS,
  PHASE_INSIGHTS,
  WHEEL_LEGEND,
  CURRENT_CYCLE_DAY,
} from '../../../constants/cycleData';

/* ── constants ──────────────────────────────────────── */

const RING_SIZE = ms(260);
const OUTER_R = RING_SIZE / 2;
const INNER_R = OUTER_R * 0.42;
const RING_THICKNESS = OUTER_R - INNER_R;
const N = 28;
const SEG_ANGLE = 360 / N;
const GAP_DEG = 1.2;
// Segment bar dimensions: width = radial span, height = arc tangent span
const SEG_W = RING_THICKNESS + ms(4);
const SEG_H = ms(22);

const PHASE_COLOR = {
  period: '#E24B4A',
  follicular: '#f9a825',
  fertile: '#1D9E75',
  ovulation: '#00c853',
  luteal: '#7b2fbe',
};

const phaseForDay = (d) => {
  if (d >= 1 && d <= 5) return 'period';
  if (d >= 6 && d <= 13) return 'follicular';
  if (d === 14) return 'ovulation';
  if (d >= 15 && d <= 16) return 'fertile';
  return 'luteal';
};

const PHASE_LABELS = [
  {day: 3, label: 'Period'},
  {day: 9, label: 'Follic'},
  {day: 15, label: 'Fertile'},
  {day: 14, label: '\uD83E\uDD5A'},
  {day: 22, label: 'Luteal'},
];

const phaseTitle = (phase) => {
  switch (phase) {
    case 'period': return 'Menstruation';
    case 'follicular': return 'Follicular phase';
    case 'fertile': return 'Fertile window';
    case 'ovulation': return 'Ovulation day';
    case 'luteal': return 'Late luteal (PMS window)';
    default: return '';
  }
};

const phaseDesc = (phase, day) => {
  switch (phase) {
    case 'period': return 'Estrogen and progesterone lowest. Uterine lining shedding. Fatigue, cramps common. Iron-rich foods recommended. Continue all medications.';
    case 'follicular': return 'Estrogen rising. Follicle developing. Energy and mood improving. Good phase for exercise, new tasks. Glucose sensitivity improving.';
    case 'fertile': return 'Peak estrogen. Best fertility window. Sperm survive 5 days. Egg viable 12\u201324h after ovulation. Cervical mucus stretchy and clear.';
    case 'ovulation': return 'LH surge. Egg released. Peak fertility. BBT rises 0.2\u00B0C. Cervical mucus egg-white consistency.';
    case 'luteal': return `Progesterone declining. PMS window. Mood dips, bloating, breast tenderness, food cravings, fatigue. Glucose +0.3\u20130.8 mmol/L from insulin resistance. Migraine risk highest (estrogen withdrawal).`;
    default: return '';
  }
};

const insightBg = (t) => t === 'purple' ? Colors.purpleBg : t === 'amber' ? Colors.amberBg : t === 'red' ? Colors.redBg : Colors.tealBg;
const insightTc = (t) => t === 'purple' ? Colors.purpleText : t === 'amber' ? Colors.amberText : t === 'red' ? Colors.redText : Colors.tealText;

/* ── Segment Ring ───────────────────────────────────── */

const CycleRing = ({currentDay}) => {
  const segments = useMemo(() => {
    return Array.from({length: N}).map((_, i) => {
      const day = i + 1;
      const phase = phaseForDay(day);
      const color = PHASE_COLOR[phase];
      const isFuture = day > currentDay;
      const isToday = day === currentDay;
      const startAngle = -90 + i * SEG_ANGLE + GAP_DEG / 2;
      const sweepAngle = SEG_ANGLE - GAP_DEG;
      return {day, phase, color, isFuture, isToday, startAngle, sweepAngle};
    });
  }, [currentDay]);

  const todayPhase = phaseForDay(currentDay);
  const todayColor = PHASE_COLOR[todayPhase];

  // Build day labels placed around the ring
  const dayLabels = useMemo(() => {
    const labels = [];
    for (let d = 1; d <= N; d += 4) {
      const angle = -90 + (d - 0.5) * SEG_ANGLE;
      const rad = (angle * Math.PI) / 180;
      const labelR = OUTER_R * 0.72;
      const x = RING_SIZE / 2 + labelR * Math.cos(rad);
      const y = RING_SIZE / 2 + labelR * Math.sin(rad);
      labels.push({day: d, x, y});
    }
    return labels;
  }, []);

  // Phase labels around outside
  const outerLabels = useMemo(() => {
    return PHASE_LABELS.map((p) => {
      const angle = -90 + (p.day - 0.5) * SEG_ANGLE;
      const rad = (angle * Math.PI) / 180;
      const r = OUTER_R + ms(14);
      const x = RING_SIZE / 2 + r * Math.cos(rad);
      const y = RING_SIZE / 2 + r * Math.sin(rad);
      return {...p, x, y};
    });
  }, []);

  // Ovulation dot position
  const ovAngle = -90 + (14 - 0.5) * SEG_ANGLE;
  const ovRad = (ovAngle * Math.PI) / 180;
  const ovR = OUTER_R - RING_THICKNESS / 2;
  const ovX = RING_SIZE / 2 + ovR * Math.cos(ovRad) - ms(7);
  const ovY = RING_SIZE / 2 + ovR * Math.sin(ovRad) - ms(7);

  // Today indicator arc position
  const todayAngle = -90 + (currentDay - 0.5) * SEG_ANGLE;
  const todayRad = (todayAngle * Math.PI) / 180;
  const todayMarkR = OUTER_R + ms(3);
  const todayX = RING_SIZE / 2 + todayMarkR * Math.cos(todayRad) - ms(3);
  const todayY = RING_SIZE / 2 + todayMarkR * Math.sin(todayRad) - ms(12);

  return (
    <View style={[segStyles.wrap, {width: RING_SIZE + ms(32), height: RING_SIZE + ms(32)}]}>
      <View style={[segStyles.ringArea, {width: RING_SIZE, height: RING_SIZE}]}>

        {/* Segments */}
        {segments.map((seg) => {
          const midAngle = seg.startAngle + seg.sweepAngle / 2;
          const midRad = (midAngle * Math.PI) / 180;
          const segR = OUTER_R - RING_THICKNESS / 2;
          const cx = RING_SIZE / 2 + segR * Math.cos(midRad);
          const cy = RING_SIZE / 2 + segR * Math.sin(midRad);

          return (
            <View
              key={seg.day}
              style={{
                position: 'absolute',
                left: cx - SEG_W / 2,
                top: cy - SEG_H / 2,
                width: SEG_W,
                height: SEG_H,
                borderRadius: ms(4),
                backgroundColor: seg.color,
                opacity: seg.isFuture ? 0.22 : 0.9,
                transform: [{rotate: `${midAngle}deg`}],
              }}
            />
          );
        })}

        {/* Inner circle (hole) */}
        <View style={[segStyles.innerCircle, {
          width: INNER_R * 2,
          height: INNER_R * 2,
          borderRadius: INNER_R,
        }]} />

        {/* Day number labels */}
        {dayLabels.map((l) => (
          <View key={l.day} style={{position: 'absolute', left: l.x - ms(8), top: l.y - ms(6)}}>
            <AppText variant="small" color="rgba(255,255,255,0.55)" style={{fontSize: ms(9), fontWeight: '600'}}>
              {l.day}
            </AppText>
          </View>
        ))}

        {/* Ovulation dot */}
        <View style={{
          position: 'absolute', left: ovX, top: ovY,
          width: ms(14), height: ms(14), borderRadius: ms(7),
          backgroundColor: '#00c853',
          borderWidth: 2, borderColor: Colors.white,
        }} />

        {/* Today marker (white arc indicator) */}
        <View style={{
          position: 'absolute', left: todayX, top: todayY,
          width: ms(6), height: ms(24), borderRadius: ms(3),
          backgroundColor: Colors.white,
          transform: [{rotate: `${todayAngle}deg`}],
        }} />

        {/* Center text */}
        <View style={segStyles.centerText}>
          <AppText variant="caption" color="rgba(255,255,255,0.5)" style={{fontWeight: '600'}}>
            Day
          </AppText>
          <AppText style={{fontSize: ms(34), fontWeight: '800', color: todayColor, lineHeight: ms(38)}}>
            {currentDay}
          </AppText>
          <AppText variant="small" color="rgba(255,255,255,0.4)">
            of {N}
          </AppText>
        </View>
      </View>

      {/* Outer phase labels */}
      {outerLabels.map((l) => (
        <View key={l.label} style={{
          position: 'absolute',
          left: l.x - ms(16) + ms(16),
          top: l.y - ms(6) + ms(16),
        }}>
          <AppText variant="small" color="rgba(255,255,255,0.4)" style={{fontSize: ms(8), fontWeight: '600'}}>
            {l.label}
          </AppText>
        </View>
      ))}
    </View>
  );
};

const segStyles = StyleSheet.create({
  wrap: {alignSelf: 'center'},
  ringArea: {position: 'absolute', left: ms(16), top: ms(16)},
  innerCircle: {
    position: 'absolute',
    alignSelf: 'center',
    top: OUTER_R - INNER_R,
    left: OUTER_R - INNER_R,
    backgroundColor: Colors.primary,
  },
  centerText: {
    position: 'absolute',
    top: 0, left: 0, right: 0, bottom: 0,
    justifyContent: 'center',
    alignItems: 'center',
  },
});

/* ── Sub-components ─────────────────────────────────── */

const LegendRow = ({items}) => (
  <View style={st.legendRow}>
    {items.map((l) => (
      <View key={l.label} style={st.legendItem}>
        <View style={[st.legendDot, {backgroundColor: l.color}]} />
        <AppText variant="small" color="rgba(255,255,255,0.7)">{l.label}</AppText>
      </View>
    ))}
  </View>
);

/* ── Hormone Chart ──────────────────────────────────── */

const CHART_H = vs(120);
const CHART_PAD_T = vs(10);
const CHART_PAD_B = vs(20);
const CHART_INNER_H = CHART_H - CHART_PAD_T - CHART_PAD_B;

// Normalized hormone curves (0-1, 28 points)
const EST = [.1,.1,.12,.14,.16,.2,.26,.33,.4,.48,.56,.65,.75,.85,.92,.98,1,.9,.5,.3,.25,.25,.28,.3,.3,.3,.2,.12];
const PRO = [.04,.04,.04,.04,.04,.04,.05,.05,.06,.06,.07,.08,.08,.08,.1,.12,.15,.3,.5,.7,.85,.88,.82,.7,.5,.3,.15,.06];
const LH  = [0,0,0,0,0,0,0,0,0,0,0,0,0,.1,.4,1,.6,.2,.05,0,0,0,0,0,0,0,0,0];

const BANDS = [
  {from: 0, to: 5, color: 'rgba(226,75,74,0.08)'},
  {from: 5, to: 13, color: 'rgba(249,168,37,0.05)'},
  {from: 13, to: 17, color: 'rgba(29,158,117,0.1)'},
  {from: 17, to: 28, color: 'rgba(123,47,190,0.07)'},
];

const buildLine = (data, chartW) => {
  const step = chartW / 27;
  return data.map((v, i) => ({
    x: i * step,
    y: CHART_PAD_T + CHART_INNER_H * (1 - v),
  }));
};

const HormoneChart = () => {
  const {width: screenW} = useWindowDimensions();
  const chartW = screenW - s(14) * 2 - s(12) * 2; // container pad + card pad

  const estPts = useMemo(() => buildLine(EST, chartW), [chartW]);
  const proPts = useMemo(() => buildLine(PRO, chartW), [chartW]);
  const lhPts  = useMemo(() => buildLine(LH, chartW), [chartW]);
  const step = chartW / 27;
  const baseY = CHART_PAD_T + CHART_INNER_H;

  return (
    <View style={hc.card}>
      <View style={[hc.chartArea, {height: CHART_H, width: chartW}]}>

        {/* Phase bg bands */}
        {BANDS.map((b, i) => (
          <View key={i} style={{
            position: 'absolute',
            left: (b.from / 28) * chartW,
            width: ((b.to - b.from) / 28) * chartW,
            top: CHART_PAD_T,
            height: CHART_INNER_H,
            backgroundColor: b.color,
          }} />
        ))}

        {/* Today D24 vertical marker */}
        <View style={{
          position: 'absolute',
          left: (23.5 / 27) * chartW,
          top: CHART_PAD_T,
          width: 2,
          height: CHART_INNER_H,
          backgroundColor: 'rgba(176,40,120,0.18)',
          borderRadius: 1,
        }} />

        {/* LH surge filled area */}
        {lhPts.map((pt, i) => {
          if (LH[i] < 0.03) return null;
          const colH = pt.y < baseY ? baseY - pt.y : 0;
          return (
            <View key={`lf${i}`} style={{
              position: 'absolute',
              left: pt.x - step / 2,
              top: pt.y,
              width: step,
              height: colH,
              backgroundColor: 'rgba(29,158,117,0.12)',
            }} />
          );
        })}

        {/* LH surge dashed line */}
        {lhPts.map((pt, i) => {
          if (i === 0) return null;
          const prev = lhPts[i - 1];
          if (LH[i] < 0.02 && LH[i - 1] < 0.02) return null;
          const dx = pt.x - prev.x;
          const dy = pt.y - prev.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View key={`ll${i}`} style={{
              position: 'absolute',
              left: prev.x,
              top: prev.y - 1,
              width: len,
              height: 2,
              backgroundColor: Colors.accent,
              opacity: 0.6,
              transform: [{rotate: `${angle}deg`}],
              transformOrigin: 'left center',
            }} />
          );
        })}

        {/* Estrogen line (red, thick) */}
        {estPts.map((pt, i) => {
          if (i === 0) return null;
          const prev = estPts[i - 1];
          const dx = pt.x - prev.x;
          const dy = pt.y - prev.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View key={`el${i}`} style={{
              position: 'absolute',
              left: prev.x,
              top: prev.y - 1,
              width: len,
              height: 2.5,
              backgroundColor: '#E24B4A',
              transform: [{rotate: `${angle}deg`}],
              transformOrigin: 'left center',
            }} />
          );
        })}

        {/* Progesterone line (purple, thick) */}
        {proPts.map((pt, i) => {
          if (i === 0) return null;
          const prev = proPts[i - 1];
          const dx = pt.x - prev.x;
          const dy = pt.y - prev.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View key={`pl${i}`} style={{
              position: 'absolute',
              left: prev.x,
              top: prev.y - 1,
              width: len,
              height: 2.5,
              backgroundColor: '#7b2fbe',
              transform: [{rotate: `${angle}deg`}],
              transformOrigin: 'left center',
            }} />
          );
        })}

        {/* X-axis labels */}
        {[1, 7, 14, 21, 28].map((d) => (
          <View key={d} style={{position: 'absolute', left: ((d - 1) / 27) * chartW - ms(6), bottom: vs(2)}}>
            <Text style={hc.xLabel}>D{d}</Text>
          </View>
        ))}
      </View>

      {/* Legend */}
      <View style={hc.legendRow}>
        <View style={hc.legendItem}>
          <View style={{width: ms(14), height: 2.5, borderRadius: 1, backgroundColor: '#E24B4A'}} />
          <Text style={hc.legendText}>Estrogen (E2)</Text>
        </View>
        <View style={hc.legendItem}>
          <View style={{width: ms(14), height: 2.5, borderRadius: 1, backgroundColor: '#7b2fbe'}} />
          <Text style={hc.legendText}>Progesterone</Text>
        </View>
        <View style={hc.legendItem}>
          <View style={{width: ms(14), height: 0, borderTopWidth: 2, borderStyle: 'dashed', borderColor: Colors.accent}} />
          <Text style={hc.legendText}>LH surge</Text>
        </View>
        <View style={hc.legendItem}>
          <View style={{width: ms(3), height: ms(12), borderRadius: 1, backgroundColor: 'rgba(176,40,120,0.2)'}} />
          <Text style={[hc.legendText, {color: Colors.textTertiary}]}>Today D24</Text>
        </View>
      </View>
    </View>
  );
};

const hc = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: s(12),
    marginTop: vs(8),
  },
  chartArea: {
    overflow: 'hidden',
  },
  xLabel: {
    fontSize: ms(8),
    color: '#bbb',
    fontWeight: '500',
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(12),
    marginTop: vs(10),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
  },
  legendText: {
    fontSize: ms(9),
    color: '#666',
  },
});

/* ── Sub-components ─────────────────────────────────── */

const InsightCard = ({item}) => (
  <View style={[st.insightCard, {backgroundColor: insightBg(item.type)}]}>
    <AppText style={{fontSize: ms(18), marginRight: s(8)}}>{item.ico}</AppText>
    <AppText variant="caption" color={insightTc(item.type)} style={{flex: 1, lineHeight: ms(18)}}>
      {item.text}
    </AppText>
  </View>
);

/* ── Main ───────────────────────────────────────────── */

const WheelTab = () => {
  const currentDay = CURRENT_CYCLE_DAY;
  const todayPhase = phaseForDay(currentDay);

  return (
    <ScrollView style={st.container} showsVerticalScrollIndicator={false}>

      {/* 1. Cycle Wheel */}
      <View style={st.wheelCard}>
        <View style={st.wheelTitleRow}>
          <AppText variant="bodyBold" color={Colors.white}>
            Cycle wheel {'\u00B7'} Mar 2026
          </AppText>
          <View style={st.cycleNav}>
            <TouchableOpacity style={st.navArrow} activeOpacity={0.6}>
              <AppText color="rgba(255,255,255,0.5)" style={{fontSize: ms(16)}}>{'\u2039'}</AppText>
            </TouchableOpacity>
            <AppText variant="small" color={Colors.white} style={{fontWeight: '700'}}>Cycle 3</AppText>
            <TouchableOpacity style={st.navArrow} activeOpacity={0.6}>
              <AppText color="rgba(255,255,255,0.5)" style={{fontSize: ms(16)}}>{'\u203A'}</AppText>
            </TouchableOpacity>
          </View>
        </View>

        <CycleRing currentDay={currentDay} />

        {/* Day info */}
        <View style={st.dayInfoBox}>
          <AppText variant="bodyBold" color={Colors.white}>
            Day {currentDay} {'\u00B7'} {phaseTitle(todayPhase)}
          </AppText>
          <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginTop: vs(4), lineHeight: ms(17)}}>
            {phaseDesc(todayPhase, currentDay)}
          </AppText>
        </View>

        <LegendRow items={WHEEL_LEGEND} />
      </View>

      {/* 2. Phase Summary Strip */}
      <View style={st.phaseStrip}>
        {[
          {ico: '\uD83D\uDD34', label: 'Next period', value: PHASE_DATES.nextPeriod.date, sub: `In ${PHASE_DATES.nextPeriod.daysAway} days`, color: '#b02878'},
          {ico: '\uD83E\uDD5A', label: 'Ovulation', value: PHASE_DATES.ovulation.date, sub: `${PHASE_DATES.ovulation.daysAgo} days ago`, color: Colors.accent},
          {ico: '\uD83D\uDD25', label: 'Fertile window', value: `${PHASE_DATES.fertileWindow.start}\u201322`, sub: PHASE_DATES.fertileWindow.status, color: Colors.accent},
        ].map((p, i) => (
          <View key={i} style={st.phaseBox}>
            <AppText style={{fontSize: ms(20)}}>{p.ico}</AppText>
            <AppText variant="bodyBold" style={{color: p.color, marginTop: vs(4)}}>{p.value}</AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2), textTransform: 'uppercase', fontSize: ms(8), fontWeight: '700', letterSpacing: 0.5}}>
              {p.label}
            </AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>
              {p.sub}
            </AppText>
          </View>
        ))}
      </View>

      {/* 3. Stats Row */}
      <View style={st.statsRow}>
        {[
          {v: '24', l: 'Day of', s: '28-day cycle'},
          {v: '5d', l: 'Period', s: 'Avg duration'},
          {v: '28d', l: 'Cycle', s: 'Avg length'},
          {v: '9', l: 'Tracked', s: 'Since Jan 24'},
        ].map((stat, i) => (
          <View key={i} style={st.statBox}>
            <AppText style={{fontSize: ms(19), fontWeight: '700', color: Colors.textPrimary}}>{stat.v}</AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2), textTransform: 'uppercase', fontSize: ms(8), fontWeight: '700', letterSpacing: 0.5}}>
              {stat.l}
            </AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>
              {stat.s}
            </AppText>
          </View>
        ))}
      </View>

      {/* 4. Hormone Levels Chart */}
      <AppText variant="sectionTitle" color={Colors.textSecondary} style={{marginTop: vs(18), marginBottom: vs(4)}}>
        Hormone levels this cycle
      </AppText>
      <HormoneChart />

      {/* 5. Phase Health Insights */}
      <AppText variant="sectionTitle" color={Colors.textSecondary} style={{marginTop: vs(18), marginBottom: vs(4)}}>
        Phase health connections
      </AppText>
      {PHASE_INSIGHTS.wheel.map((ins, idx) => (
        <InsightCard key={idx} item={ins} />
      ))}

      <View style={{height: vs(80)}} />
    </ScrollView>
  );
};

/* ── Styles ─────────────────────────────────────────── */

const st = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: s(14), paddingTop: vs(6)},

  /* Wheel card */
  wheelCard: {
    backgroundColor: Colors.primary,
    borderRadius: ms(16),
    padding: s(16),
    marginTop: vs(4),
  },
  wheelTitleRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  cycleNav: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  navArrow: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
  },
  dayInfoBox: {
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    borderRadius: ms(12),
    padding: s(12),
    marginTop: vs(6),
  },
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    marginTop: vs(12),
    gap: s(10),
  },
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: s(4)},
  legendDot: {width: ms(8), height: ms(8), borderRadius: ms(4)},

  /* Phase strip */
  phaseStrip: {
    flexDirection: 'row',
    gap: s(8),
    marginTop: vs(12),
  },
  phaseBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: s(10),
    alignItems: 'center',
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    gap: s(8),
    marginTop: vs(10),
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: s(10),
    alignItems: 'center',
  },

  /* Insights */
  insightCard: {
    flexDirection: 'row',
    borderRadius: ms(12),
    padding: s(12),
    marginTop: vs(8),
    alignItems: 'flex-start',
  },
});

export default WheelTab;
