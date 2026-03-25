import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Polyline, Rect, Circle as SvgCircle, Text as SvgText, Line as SvgLine} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

/* ───────── static data ───────── */

const SOURCES = [
  {
    id: 'hrv',
    icon: 'watch-outline',
    name: 'HRV stress score',
    description: 'Apple Watch · Resting HR · Overnight HRV',
    status: 'Syncing',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    id: 'sleep',
    icon: 'moon-outline',
    name: 'Sleep quality',
    description: 'Sleep stages · Duration · Consistency',
    status: 'Last night synced',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    id: 'patterns',
    icon: 'phone-portrait-outline',
    name: 'Behaviour patterns',
    description: 'Screen time · App usage · Steps · Routine',
    status: 'Screen time access',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
  {
    id: 'voice',
    icon: 'mic-outline',
    name: 'Voice check-in',
    description: 'Say sentences · Ayu analyses vocal tone, pace, energy',
    status: 'Enable microphone',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
];

const STRESS_DATA = [55, 62, 48, 70, 45, 42, 47];
const HRV_LINE = [30, 28, 36, 26, 40, 44, 33];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];
const STRESS_BASELINE = 42;

const SIGNAL_ROWS = [
  {
    icon: 'pulse-outline',
    iconBg: Colors.amberBg,
    iconColor: Colors.amberText,
    label: 'HRV 33ms — below baseline',
    detail: '21% below',
    badge: 'Elevated',
    badgeBg: Colors.amberBg,
    badgeColor: Colors.amberText,
  },
  {
    icon: 'heart-outline',
    iconBg: Colors.amberBg,
    iconColor: Colors.amberText,
    label: 'Resting HR 74 — 3 above avg',
    detail: '3 nights elevated',
    badge: 'Mildly \u2191',
    badgeBg: Colors.amberBg,
    badgeColor: Colors.amberText,
  },
  {
    icon: 'moon-outline',
    iconBg: Colors.redBg,
    iconColor: Colors.redText,
    label: 'Sleep 5.9h — 1h below target',
    detail: '4 of 7 nights <7h',
    badge: 'Deficit',
    badgeBg: Colors.redBg,
    badgeColor: Colors.redText,
  },
  {
    icon: 'fitness-outline',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    label: 'Recovery score 48/100',
    detail: 'Below 60-80 optimal',
    badge: 'Moderate',
    badgeBg: Colors.amberBg,
    badgeColor: Colors.amberText,
  },
];

/* ───────── component ───────── */

const MoodAutoView = () => {
  const [activeSource, setActiveSource] = useState('hrv');

  /* ── 1. Source Grid ── */
  const renderSourceGrid = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        AYU READS THESE SIGNALS AUTOMATICALLY
      </AppText>
      <View style={st.sourceGrid}>
        {SOURCES.map(src => {
          const active = activeSource === src.id;
          return (
            <TouchableOpacity
              key={src.id}
              activeOpacity={0.7}
              onPress={() => setActiveSource(src.id)}
              style={[
                st.sourceCard,
                active && {borderColor: Colors.primary, backgroundColor: '#f0f7f4'},
              ]}>
              <Icon
                family="Ionicons"
                name={src.icon}
                size={ms(22)}
                color={active ? Colors.primary : Colors.textSecondary}
              />
              <AppText
                variant="bodyBold"
                color={active ? Colors.primary : Colors.textPrimary}
                style={{marginTop: vs(4)}}>
                {src.name}
              </AppText>
              <AppText
                variant="small"
                color={Colors.textSecondary}
                style={{marginTop: vs(2), lineHeight: ms(15)}}>
                {src.description}
              </AppText>
              <View style={[st.statusBadge, {backgroundColor: src.statusBg}]}>
                <AppText variant="small" color={src.statusColor}>
                  {src.status}
                </AppText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  /* ── 2. HRV Stress Panel ── */
  const renderHRVPanel = () => {
    const chartW = 340;
    const chartH = 100;
    const barW = 28;
    const maxStress = 80;
    const hrvMax = 50;
    const hrvMin = 20;

    /* stress bar color */
    const stressBarColor = v => {
      if (v > 60) return Colors.red;
      if (v > 50) return Colors.amber;
      return Colors.purple;
    };

    /* hrv polyline points */
    const hrvPoints = HRV_LINE.map((v, i) => {
      const x = (i / (HRV_LINE.length - 1)) * (chartW - 60) + 30;
      const y = chartH - ((v - hrvMin) / (hrvMax - hrvMin)) * 70 - 15;
      return {x, y, v};
    });
    const hrvPolyline = hrvPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');

    /* stress ring arc for 47/100 */
    const ringR = 32;
    const ringCx = 40;
    const ringCy = 40;
    const pct = 47 / 100;
    const startAngle = -Math.PI / 2;
    const endAngle = startAngle + pct * 2 * Math.PI;
    const largeArc = pct > 0.5 ? 1 : 0;
    const arcX1 = ringCx + ringR * Math.cos(startAngle);
    const arcY1 = ringCy + ringR * Math.sin(startAngle);
    const arcX2 = ringCx + ringR * Math.cos(endAngle);
    const arcY2 = ringCy + ringR * Math.sin(endAngle);

    /* baseline Y in chart */
    const baselineY = chartH - (STRESS_BASELINE / maxStress) * 70 - 15;

    return (
      <View style={st.section}>
        <AppText variant="sectionTitle" color={Colors.textPrimary}>
          APPLE WATCH {'\u00b7'} HRV-BASED STRESS SCORE
        </AppText>

        {/* Dark hero card */}
        <View style={[st.darkHero, {backgroundColor: '#1c0a2e'}]}>
          {/* Device row */}
          <View style={st.heroTopRow}>
            <View style={[st.dot, {backgroundColor: '#22c55e'}]} />
            <AppText
              variant="small"
              color="rgba(255,255,255,0.7)"
              style={{marginLeft: s(6), flex: 1}}>
              Apple Watch Series 9 {'\u00b7'} Last sync: 7:18 AM
            </AppText>
          </View>

          {/* Main row: ring + score info */}
          <View style={st.heroMainRow}>
            <Svg width={ms(80)} height={ms(80)} viewBox="0 0 80 80">
              <SvgCircle
                cx={ringCx}
                cy={ringCy}
                r={ringR}
                stroke="rgba(255,255,255,0.15)"
                strokeWidth="6"
                fill="none"
              />
              <SvgCircle
                cx={ringCx}
                cy={ringCy}
                r={ringR}
                stroke={Colors.amber}
                strokeWidth="6"
                fill="none"
                strokeDasharray={`${pct * 2 * Math.PI * ringR} ${2 * Math.PI * ringR}`}
                strokeLinecap="round"
                transform={`rotate(-90 ${ringCx} ${ringCy})`}
              />
              <SvgText
                x={ringCx}
                y={ringCy + 2}
                textAnchor="middle"
                fill="#FFFFFF"
                fontSize="18"
                fontWeight="bold">
                47
              </SvgText>
            </Svg>
            <View style={{marginLeft: s(12), flex: 1}}>
              <AppText variant="small" color="rgba(255,255,255,0.4)" style={{letterSpacing: 0.5, textTransform: 'uppercase', fontWeight: '700', fontSize: ms(9)}}>
                Stress score
              </AppText>
              <View style={{flexDirection: 'row', alignItems: 'baseline', gap: s(6), marginTop: vs(2)}}>
                <AppText variant="bodyBold" color={Colors.amber} style={{fontSize: ms(18)}} numberOfLines={1}>
                  47
                </AppText>
                <AppText variant="body" color={Colors.amber} style={{fontSize: ms(13)}}>
                  Moderate
                </AppText>
              </View>
              <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginTop: vs(3)}}>
                Higher than 7-day avg of 42
              </AppText>
            </View>
          </View>

          {/* 3-column metrics */}
          <View style={[st.metricsRow, {marginTop: vs(12)}]}>
            <View style={st.metricBox}>
              <AppText variant="bodyBold" color={Colors.amber} style={{fontSize: ms(15)}} numberOfLines={1}>
                33 ms
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginTop: vs(2)}}>
                Overnight HRV
              </AppText>
            </View>
            <View style={st.metricBox}>
              <AppText variant="bodyBold" color={Colors.amber} style={{fontSize: ms(15)}} numberOfLines={1}>
                74 bpm
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginTop: vs(2)}}>
                Resting HR
              </AppText>
            </View>
            <View style={st.metricBox}>
              <AppText variant="bodyBold" color={Colors.red} style={{fontSize: ms(15)}} numberOfLines={1}>
                5.9h
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginTop: vs(2)}}>
                Total sleep
              </AppText>
            </View>
          </View>
        </View>

        {/* 7-day Stress SVG chart */}
        <View style={st.card}>
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginBottom: vs(8)}}>
            7-day stress trend
          </AppText>
          <Svg width="100%" height={ms(120)} viewBox={`0 0 ${chartW} ${chartH}`}>
            {/* Stress bars */}
            {STRESS_DATA.map((v, i) => {
              const x = (i / (STRESS_DATA.length - 1)) * (chartW - 60) + 30 - barW / 2;
              const barH = (v / maxStress) * 70;
              const y = chartH - barH - 15;
              return (
                <Rect
                  key={`bar-${i}`}
                  x={x}
                  y={y}
                  width={barW}
                  height={barH}
                  rx={4}
                  fill={stressBarColor(v)}
                  opacity={0.35}
                />
              );
            })}

            {/* Dashed baseline */}
            <SvgLine
              x1={20}
              y1={baselineY}
              x2={chartW - 20}
              y2={baselineY}
              stroke="rgba(0,0,0,0.3)"
              strokeWidth="1"
              strokeDasharray="4,4"
            />

            {/* HRV polyline */}
            <Polyline
              points={hrvPolyline}
              fill="none"
              stroke={Colors.purple}
              strokeWidth="2"
            />
            {hrvPoints.map((p, i) => (
              <SvgCircle
                key={`dot-${i}`}
                cx={p.x}
                cy={p.y}
                r={3}
                fill={Colors.purple}
              />
            ))}

            {/* X labels */}
            {DAY_LABELS.map((lbl, i) => {
              const x = (i / (DAY_LABELS.length - 1)) * (chartW - 60) + 30;
              return (
                <SvgText
                  key={`lbl-${i}`}
                  x={x}
                  y={chartH - 2}
                  textAnchor="middle"
                  fill={Colors.textSecondary}
                  fontSize="10">
                  {lbl}
                </SvgText>
              );
            })}
          </Svg>

          {/* Legend */}
          <View style={st.legendRow}>
            <View style={st.legendItem}>
              <View style={[st.legendDot, {backgroundColor: Colors.amber}]} />
              <AppText variant="small" color={Colors.textSecondary}>Stress score</AppText>
            </View>
            <View style={st.legendItem}>
              <View style={[st.legendDot, {backgroundColor: Colors.purple}]} />
              <AppText variant="small" color={Colors.textSecondary}>HRV</AppText>
            </View>
            <View style={st.legendItem}>
              <View style={[st.legendDash, {borderColor: 'rgba(0,0,0,0.3)'}]} />
              <AppText variant="small" color={Colors.textSecondary}>Baseline</AppText>
            </View>
          </View>
        </View>

        {/* Signal analysis card */}
        <View style={st.card}>
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginBottom: vs(8)}}>
            Signal analysis
          </AppText>
          {SIGNAL_ROWS.map((row, i) => (
            <View key={i} style={st.signalRow}>
              <View style={[st.signalIcon, {backgroundColor: row.iconBg}]}>
                <Icon family="Ionicons" name={row.icon} size={ms(16)} color={row.iconColor} />
              </View>
              <View style={{flex: 1, marginLeft: s(10)}}>
                <AppText variant="bodyBold" color={Colors.textPrimary}>
                  {row.label}
                </AppText>
                <AppText variant="small" color={Colors.textSecondary}>
                  {row.detail}
                </AppText>
              </View>
              <View style={[st.badge, {backgroundColor: row.badgeBg}]}>
                <AppText variant="small" color={row.badgeColor}>
                  {row.badge}
                </AppText>
              </View>
            </View>
          ))}
        </View>

        {/* Purple insight */}
        <View style={[st.insightCard, {backgroundColor: Colors.purpleBg}]}>
          <Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.purpleText} />
          <AppText
            variant="caption"
            color={Colors.purpleText}
            style={{marginLeft: s(8), flex: 1, lineHeight: ms(18)}}>
            HRV reflects sympathetic vs parasympathetic balance. Higher HRV = more resilience. Your
            90-day avg 42ms {'\u2014'} lower than 55ms matched average.
          </AppText>
        </View>

        {/* CTA button */}
        <TouchableOpacity activeOpacity={0.8} style={st.ctaButton}>
          <AppText variant="bodyBold" color={Colors.white}>
            Use Ayu{'\u2019'}s auto-detected stress data {'\u00b7'} Stress 47 {'\u00b7'} Recovery 48
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  /* ── 3. Sleep Panel ── */
  const renderSleepPanel = () => {
    const chartW = 340;
    const chartH = 70;

    /* Hypnogram segments: type, startHr (from 11PM=0), durationHr */
    const stages = [
      {type: 'awake', start: 0, dur: 0.2},
      {type: 'light', start: 0.2, dur: 0.8},
      {type: 'deep', start: 1.0, dur: 0.5},
      {type: 'light', start: 1.5, dur: 0.5},
      {type: 'rem', start: 2.0, dur: 0.7},
      {type: 'light', start: 2.7, dur: 0.6},
      {type: 'deep', start: 3.3, dur: 0.3},
      {type: 'light', start: 3.6, dur: 0.8},
      {type: 'awake', start: 4.4, dur: 0.15},
      {type: 'light', start: 4.55, dur: 0.45},
      {type: 'rem', start: 5.0, dur: 0.7},
      {type: 'light', start: 5.7, dur: 0.5},
      {type: 'deep', start: 6.2, dur: 0.3},
      {type: 'light', start: 6.5, dur: 0.6},
      {type: 'rem', start: 7.1, dur: 0.5},
      {type: 'awake', start: 7.6, dur: 0.4},
    ];

    const stageY = {awake: 5, rem: 20, light: 38, deep: 52};
    const stageColor = {awake: Colors.red, rem: Colors.purple, light: '#C4B5FD', deep: Colors.primary};
    const totalHrs = 8;
    const timeLabels = ['11PM', '1AM', '3AM', '5AM', '7AM'];
    const timeLabelHrs = [0, 2, 4, 6, 8];

    return (
      <View style={st.section}>
        <AppText variant="sectionTitle" color={Colors.textPrimary}>
          LAST NIGHT{'\u2019'}S SLEEP {'\u00b7'} APPLE WATCH
        </AppText>

        {/* Dark card: 4-column metrics */}
        <View style={[st.darkHero, {backgroundColor: '#1c0a2e'}]}>
          <View style={st.metricsRow}>
            <View style={st.metricBox}>
              <AppText variant="bodyBold" color={Colors.red} style={{fontSize: ms(14)}} numberOfLines={1}>
                5.9h
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.5)">Total sleep</AppText>
            </View>
            <View style={st.metricBox}>
              <AppText variant="bodyBold" color={Colors.blue} style={{fontSize: ms(14)}} numberOfLines={1}>
                0.8h
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.5)">Deep</AppText>
            </View>
            <View style={st.metricBox}>
              <AppText variant="bodyBold" color={Colors.purple} style={{fontSize: ms(14)}} numberOfLines={1}>
                1.4h
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.5)">REM</AppText>
            </View>
            <View style={st.metricBox}>
              <AppText variant="bodyBold" color={Colors.amber} style={{fontSize: ms(14)}} numberOfLines={1}>
                58
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.5)">Sleep score</AppText>
            </View>
          </View>
        </View>

        {/* SVG sleep stages hypnogram */}
        <View style={st.card}>
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginBottom: vs(6)}}>
            Sleep stages
          </AppText>
          <Svg width="100%" height={ms(90)} viewBox={`0 0 ${chartW} ${chartH}`}>
            {stages.map((seg, i) => {
              const x = (seg.start / totalHrs) * (chartW - 40) + 20;
              const w = (seg.dur / totalHrs) * (chartW - 40);
              const y = stageY[seg.type];
              const h = 12;
              return (
                <Rect
                  key={i}
                  x={x}
                  y={y}
                  width={w}
                  height={h}
                  rx={2}
                  fill={stageColor[seg.type]}
                />
              );
            })}
            {/* Y labels */}
            <SvgText x={2} y={13} fontSize="8" fill={Colors.textSecondary}>Awake</SvgText>
            <SvgText x={2} y={28} fontSize="8" fill={Colors.textSecondary}>REM</SvgText>
            <SvgText x={2} y={46} fontSize="8" fill={Colors.textSecondary}>Light</SvgText>
            <SvgText x={2} y={60} fontSize="8" fill={Colors.textSecondary}>Deep</SvgText>
            {/* X time labels */}
            {timeLabels.map((lbl, i) => {
              const x = (timeLabelHrs[i] / totalHrs) * (chartW - 40) + 20;
              return (
                <SvgText
                  key={`t-${i}`}
                  x={x}
                  y={chartH - 1}
                  textAnchor="middle"
                  fontSize="9"
                  fill={Colors.textSecondary}>
                  {lbl}
                </SvgText>
              );
            })}
          </Svg>
        </View>

        {/* Purple insight */}
        <View style={[st.insightCard, {backgroundColor: Colors.purpleBg}]}>
          <Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.purpleText} />
          <AppText
            variant="caption"
            color={Colors.purpleText}
            style={{marginLeft: s(8), flex: 1, lineHeight: ms(18)}}>
            Deep sleep processes emotional memories. Your 0.8h below 1.5-2h target. Low REM linked
            to anxiety.
          </AppText>
        </View>

        {/* CTA button */}
        <TouchableOpacity activeOpacity={0.8} style={st.ctaButton}>
          <AppText variant="bodyBold" color={Colors.white}>
            Use last night{'\u2019'}s sleep data
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  /* ── 4. Behaviour Panel ── */
  const renderPatternsPanel = () => (
    <View style={st.section}>
      {/* Blue insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.blueBg}]}>
        <Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.blueText} />
        <AppText
          variant="caption"
          color={Colors.blueText}
          style={{marginLeft: s(8), flex: 1, lineHeight: ms(18)}}>
          Screen time, steps, and routine patterns help Ayu detect behavioural shifts linked to mood
          changes. All data stays on-device.
        </AppText>
      </View>

      {/* Dark card */}
      <View style={[st.darkHero, {backgroundColor: '#1c0a2e', alignItems: 'center'}]}>
        <Icon family="Ionicons" name="phone-portrait-outline" size={ms(36)} color="rgba(255,255,255,0.6)" />
        <AppText
          variant="bodyBold"
          color={Colors.white}
          style={{marginTop: vs(10), textAlign: 'center'}}>
          Enable behaviour pattern tracking
        </AppText>
        <AppText
          variant="small"
          color="rgba(255,255,255,0.5)"
          style={{marginTop: vs(4), textAlign: 'center'}}>
          Screen time {'\u00b7'} Steps {'\u00b7'} Routine {'\u00b7'} All on-device
        </AppText>
        <TouchableOpacity activeOpacity={0.8} style={[st.ctaButton, {marginTop: vs(14)}]}>
          <AppText variant="bodyBold" color={Colors.white}>
            Enable access {'\u2192'}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ── 5. Voice Panel ── */
  const renderVoicePanel = () => (
    <View style={st.section}>
      {/* Purple insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.purpleBg}]}>
        <Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.purpleText} />
        <AppText
          variant="caption"
          color={Colors.purpleText}
          style={{marginLeft: s(8), flex: 1, lineHeight: ms(18)}}>
          Voice check-in {'\u2014'} Ayu analyses vocal tone, pace. 70-80% accuracy. On-device, not
          stored.
        </AppText>
      </View>

      {/* Dark card */}
      <View style={[st.darkHero, {backgroundColor: '#1c0a2e', alignItems: 'center'}]}>
        <Icon family="Ionicons" name="mic-outline" size={ms(36)} color="rgba(255,255,255,0.6)" />
        <AppText
          variant="bodyBold"
          color={Colors.white}
          style={{marginTop: vs(10), textAlign: 'center'}}>
          Speak naturally for 30 seconds
        </AppText>
        <AppText
          variant="small"
          color="rgba(255,255,255,0.5)"
          style={{marginTop: vs(4), textAlign: 'center', lineHeight: ms(16)}}>
          {'"'}Tell me about your day so far, how you slept, and how you{'\u2019'}re feeling right
          now.{'"'}
        </AppText>
        <TouchableOpacity activeOpacity={0.8} style={[st.ctaButton, {marginTop: vs(14)}]}>
          <AppText variant="bodyBold" color={Colors.white}>
            Start voice check-in
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ── Render ── */
  return (
    <View style={st.container}>
      {renderSourceGrid()}
      {activeSource === 'hrv' && renderHRVPanel()}
      {activeSource === 'sleep' && renderSleepPanel()}
      {activeSource === 'patterns' && renderPatternsPanel()}
      {activeSource === 'voice' && renderVoicePanel()}
    </View>
  );
};

/* ───────── styles ───────── */

const st = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: vs(18),
  },

  /* Source grid */
  sourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: vs(10),
  },
  sourceCard: {
    width: '48.5%',
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(12),
    marginBottom: vs(10),
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
    marginTop: vs(8),
  },

  /* Dark hero card */
  darkHero: {
    borderRadius: ms(14),
    padding: ms(16),
    marginTop: vs(10),
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  heroMainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(12),
  },

  /* Metrics */
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricBox: {
    alignItems: 'center',
    flex: 1,
  },

  /* Card */
  card: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(14),
    marginTop: vs(10),
  },

  /* Legend */
  legendRow: {
    flexDirection: 'row',
    marginTop: vs(8),
    justifyContent: 'center',
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: s(8),
  },
  legendDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    marginRight: s(4),
  },
  legendDash: {
    width: ms(14),
    height: 0,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    marginRight: s(4),
  },

  /* Signal rows */
  signalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  signalIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
    marginLeft: s(6),
  },

  /* Insight card */
  insightCard: {
    flexDirection: 'row',
    borderRadius: ms(14),
    padding: ms(14),
    marginTop: vs(10),
    alignItems: 'flex-start',
  },

  /* CTA button */
  ctaButton: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
    marginTop: vs(12),
  },
});

export default MoodAutoView;
