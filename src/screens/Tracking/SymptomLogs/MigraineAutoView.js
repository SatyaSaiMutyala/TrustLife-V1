import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Polyline, Rect, Line as SvgLine, Circle as SvgCircle, Text as SvgText} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

/* ───────── static data ───────── */

const SOURCES = [
  {
    id: 'wear',
    icon: 'watch-outline',
    name: 'Wearable signals',
    description: 'HRV drop \u00b7 Elevated HR \u00b7 Skin temp change \u00b7 SpO\u2082',
    status: 'Apple Watch',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    id: 'glucose',
    icon: 'analytics-outline',
    name: 'Glucose variability',
    description: 'CGM / glucometer \u00b7 Rapid drops \u00b7 Fasting prolonged',
    status: 'Accu-Chek linked',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    id: 'bp',
    icon: 'heart-outline',
    name: 'BP patterns',
    description: 'BP spikes \u00b7 Morning surge \u00b7 Diastolic rise',
    status: 'Withings linked',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    id: 'weather',
    icon: 'cloud-outline',
    name: 'Weather & barometric',
    description: 'Barometric pressure \u00b7 Temperature \u00b7 Humidity changes',
    status: 'Location: Hyderabad',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
];

const SIGNAL_ROWS = [
  {
    icon: 'heart-outline',
    iconBg: Colors.redBg,
    iconColor: Colors.redText,
    label: 'HRV 33ms \u2014 21% below your 42ms avg',
    desc: 'HRV depression reflects hypothalamic hyperexcitability and autonomic dysregulation that precedes cortical spreading depression by 12\u201324 hours.',
    badge: 'Signal',
    badgeBg: Colors.redBg,
    badgeColor: Colors.redText,
  },
  {
    icon: 'thermometer-outline',
    iconBg: Colors.amberBg,
    iconColor: Colors.amberText,
    label: 'Skin temp +0.5\u00b0C above baseline',
    desc: 'Peripheral vasodilation and skin temperature rise are associated with cortical spreading depression and trigeminovascular activation in the prodromal phase.',
    badge: 'Signal',
    badgeBg: Colors.amberBg,
    badgeColor: Colors.amberText,
  },
  {
    icon: 'pulse-outline',
    iconBg: Colors.redBg,
    iconColor: Colors.redText,
    label: 'Resting HR 74 bpm \u2014 sustained elevation',
    desc: 'Persistent sympathetic dominance with elevated resting HR indicates autonomic imbalance consistent with pre-migraine autonomic storm.',
    badge: 'Signal',
    badgeBg: Colors.redBg,
    badgeColor: Colors.redText,
  },
];

const HRV_DATA = [44, 40, 46, 28, 44, 43, 33];
const MIGRAINE_DAYS = [false, false, false, true, false, false, true];
const DAY_LABELS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Today'];

/* ───────── component ───────── */

const MigraineAutoView = () => {
  const [activeSource, setActiveSource] = useState('wear');

  /* ── 1. Source Grid ── */
  const renderSourceGrid = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        AYU WATCHES THESE SIGNALS FOR MIGRAINE PREDICTION
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

  /* ── 2. Wearable Panel ── */
  const renderWearPanel = () => {
    /* SVG chart helpers */
    const hrvMax = 55;
    const hrvMin = 20;
    const chartW = 340;
    const chartH = 100;
    const baselineHRV = 42;
    const baselineY = chartH - ((baselineHRV - hrvMin) / (hrvMax - hrvMin)) * 80 - 10;

    const hrvPoints = HRV_DATA.map((v, i) => {
      const x = (i / (HRV_DATA.length - 1)) * (chartW - 40) + 20;
      const y = chartH - ((v - hrvMin) / (hrvMax - hrvMin)) * 80 - 10;
      return {x, y, v};
    });

    const polylineStr = hrvPoints.map(p => `${p.x.toFixed(1)},${p.y.toFixed(1)}`).join(' ');
    const areaStr = `20,${chartH - 10} ${polylineStr} ${(chartW - 20).toFixed(1)},${chartH - 10}`;

    return (
      <View style={st.section}>
        {/* a. Dark hero card */}
        <View style={[st.darkHero, {backgroundColor: '#1a0505'}]}>
          {/* Device row */}
          <View style={st.heroTopRow}>
            <View style={st.liveDot}>
              <View style={[st.dot, {backgroundColor: '#22c55e'}]} />
              <AppText variant="small" color="#22c55e" style={{marginLeft: s(4)}}>
                Live
              </AppText>
            </View>
            <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginLeft: s(8), flex: 1}}>
              Apple Watch Series 9 {'\u00b7'} Overnight analysis {'\u00b7'} 24 Mar
            </AppText>
          </View>

          {/* 3-column metrics */}
          <View style={[st.metricsRow, {marginTop: vs(10)}]}>
            <View style={st.metricBox}>
              <AppText variant="bodyBold" color="#E24B4A" style={{fontSize: ms(20)}}>
                33
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.6)">HRV ms</AppText>
            </View>
            <View style={st.metricBox}>
              <AppText variant="bodyBold" color="#FAC775" style={{fontSize: ms(20)}}>
                74
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.6)">Resting HR bpm</AppText>
            </View>
            <View style={st.metricBox}>
              <AppText variant="bodyBold" color="#E24B4A" style={{fontSize: ms(20)}}>
                +0.5
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.6)">Skin temp {'\u00b0'}C</AppText>
            </View>
          </View>

          {/* Prediction alert */}
          <View style={st.predictionCard}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)}}>
              <Icon family="Ionicons" name="bulb-outline" size={ms(18)} color="#E24B4A" />
              <AppText variant="bodyBold" color="#E24B4A" style={{marginLeft: s(6), flex: 1}}>
                Ayu detected pre-migraine signals at 5:30 AM
              </AppText>
            </View>
            <AppText variant="small" color="rgba(255,255,255,0.8)" style={{lineHeight: ms(17)}}>
              HRV dropped 28% below baseline, resting HR elevated by 4 bpm, skin temp rose +0.5{'\u00b0'}C...
              matching 7 of 10 previous episodes. Prediction confidence: 74%.
            </AppText>
          </View>
        </View>

        {/* b. Signal analysis card */}
        <View style={st.card}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>
            Pre-migraine signal analysis
          </AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2), marginBottom: vs(10)}}>
            Last 24h vs your baseline
          </AppText>
          {SIGNAL_ROWS.map((row, idx) => (
            <View key={idx} style={st.analysisRow}>
              <View style={[st.iconCircle, {backgroundColor: row.iconBg}]}>
                <Icon family="Ionicons" name={row.icon} size={ms(16)} color={row.iconColor} />
              </View>
              <View style={{flex: 1, marginLeft: s(10)}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <AppText variant="bodyBold" color={Colors.textPrimary} style={{flex: 1}}>
                    {row.label}
                  </AppText>
                  <View style={[st.signalBadge, {backgroundColor: row.badgeBg}]}>
                    <AppText variant="small" color={row.badgeColor}>{row.badge}</AppText>
                  </View>
                </View>
                <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(16)}}>
                  {row.desc}
                </AppText>
              </View>
            </View>
          ))}
        </View>

        {/* c. 7-day SVG chart */}
        <View style={st.card}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>
            7-day signal pattern {'\u00b7'} HRV + migraine episodes
          </AppText>
          <View style={{marginTop: vs(10)}}>
            <Svg width="100%" height={ms(110)} viewBox="0 0 340 100">
              {/* Migraine day columns */}
              {MIGRAINE_DAYS.map((isMigraine, i) => {
                if (!isMigraine) return null;
                const x = hrvPoints[i].x - 15;
                return (
                  <Rect
                    key={`mg-${i}`}
                    x={x}
                    y={0}
                    width={30}
                    height={100}
                    fill="rgba(226,75,74,0.12)"
                  />
                );
              })}

              {/* Dashed baseline */}
              <SvgLine
                x1={20}
                y1={baselineY}
                x2={chartW - 20}
                y2={baselineY}
                stroke="rgba(150,150,150,0.5)"
                strokeWidth={1}
                strokeDasharray="4,3"
              />

              {/* Area fill under HRV line */}
              <Polyline
                points={areaStr}
                fill="rgba(60,52,137,0.12)"
                stroke="none"
              />

              {/* HRV polyline */}
              <Polyline
                points={polylineStr}
                fill="none"
                stroke="#3C3489"
                strokeWidth={2}
              />

              {/* Dots */}
              {hrvPoints.map((p, i) => {
                let dotColor = '#3C3489';
                if (MIGRAINE_DAYS[i]) dotColor = '#E24B4A';
                else if (p.v < 38) dotColor = '#FAC775';
                return (
                  <SvgCircle
                    key={`dot-${i}`}
                    cx={p.x}
                    cy={p.y}
                    r={4}
                    fill={dotColor}
                  />
                );
              })}

              {/* X labels */}
              {DAY_LABELS.map((lbl, i) => {
                const x = hrvPoints[i].x;
                return (
                  <SvgText
                    key={`lbl-${i}`}
                    x={x}
                    y={98}
                    fontSize={9}
                    fill="#6b7280"
                    textAnchor="middle">
                    {lbl}
                  </SvgText>
                );
              })}
            </Svg>
          </View>

          {/* Legend */}
          <View style={st.legendRow}>
            <View style={st.legendItem}>
              <View style={[st.legendDot, {backgroundColor: '#3C3489'}]} />
              <AppText variant="small" color={Colors.textSecondary}>HRV</AppText>
            </View>
            <View style={st.legendItem}>
              <View style={[st.legendDot, {backgroundColor: '#E24B4A'}]} />
              <AppText variant="small" color={Colors.textSecondary}>Migraine day</AppText>
            </View>
            <View style={st.legendItem}>
              <View style={[st.legendDash, {borderColor: 'rgba(150,150,150,0.5)'}]} />
              <AppText variant="small" color={Colors.textSecondary}>HRV baseline</AppText>
            </View>
          </View>
        </View>

        {/* d. Import button */}
        <TouchableOpacity activeOpacity={0.8} style={st.primaryBtn}>
          <Icon family="Ionicons" name="download-outline" size={ms(18)} color="#fff" />
          <AppText variant="bodyBold" color="#fff" style={{marginLeft: s(8)}}>
            Import Ayu's signal data into this episode log
          </AppText>
        </TouchableOpacity>

        {/* e. Purple insight */}
        <View style={[st.insightCard, {backgroundColor: '#EEEDFE'}]}>
          <View style={st.insightHeader}>
            <Icon family="Ionicons" name="sparkles-outline" size={ms(16)} color="#3C3489" />
            <AppText variant="bodyBold" color="#3C3489" style={{marginLeft: s(6)}}>
              How Ayu predicts migraines
            </AppText>
          </View>
          <AppText variant="small" color="#3C3489" style={{marginTop: vs(6), lineHeight: ms(17)}}>
            Personal model trained on 18 episodes. Analyses HRV, HR, skin temp, glucose, sleep quality.
            74% confidence = strong match. Model improves with each logged episode.
          </AppText>
        </View>
      </View>
    );
  };

  /* ── 3. Glucose Panel ── */
  const renderGlucosePanel = () => (
    <View style={st.section}>
      <View style={[st.insightCard, {backgroundColor: Colors.amberBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="analytics-outline" size={ms(16)} color={Colors.amberText} />
          <AppText variant="bodyBold" color={Colors.amberText} style={{marginLeft: s(6)}}>
            Glucose variability and migraine
          </AppText>
        </View>
        <AppText variant="small" color={Colors.amberText} style={{marginTop: vs(6), lineHeight: ms(17)}}>
          CGM data shows glucose dropped from 8.4 to 6.1 mmol/L between 4 AM and 6 AM {'\u2014'} a 2.3 mmol/L
          drop in 2 hours. Rapid decline triggers migraine via vasodilatory sympathoadrenal response.
          Missed PM Metformin Mar 22 may have contributed.
        </AppText>
      </View>
    </View>
  );

  /* ── 4. BP Panel ── */
  const renderBPPanel = () => (
    <View style={st.section}>
      <View style={[st.insightCard, {backgroundColor: Colors.redBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="heart-outline" size={ms(16)} color={Colors.redText} />
          <AppText variant="bodyBold" color={Colors.redText} style={{marginLeft: s(6)}}>
            BP pattern and migraine link
          </AppText>
        </View>
        <AppText variant="small" color={Colors.redText} style={{marginTop: vs(6), lineHeight: ms(17)}}>
          Morning surge +42 mmHg (sleep 114 {'\u2192'} 7 AM 156). Rapid BP elevation triggers migraine.
          Amlodipine morning dose trough at 6 AM creates a converging risk window {'\u2014'} evidence for
          bedtime dosing.
        </AppText>
      </View>
    </View>
  );

  /* ── 5. Weather Panel ── */
  const renderWeatherPanel = () => (
    <View style={st.section}>
      <View style={st.card}>
        <View style={st.metricsRow}>
          <View style={st.metricBoxLight}>
            <AppText variant="bodyBold" color={Colors.blueText} style={{fontSize: ms(18)}}>
              1009
            </AppText>
            <AppText variant="small" color={Colors.textSecondary}>Barometric hPa</AppText>
          </View>
          <View style={st.metricBoxLight}>
            <AppText variant="bodyBold" color={Colors.amberText} style={{fontSize: ms(18)}}>
              -3
            </AppText>
            <AppText variant="small" color={Colors.textSecondary}>Pressure drop</AppText>
          </View>
          <View style={st.metricBoxLight}>
            <AppText variant="bodyBold" color={Colors.textSecondary} style={{fontSize: ms(18)}}>
              32{'\u00b0'}C
            </AppText>
            <AppText variant="small" color={Colors.textSecondary}>Temperature</AppText>
          </View>
        </View>

        <View style={[st.insightCard, {backgroundColor: Colors.amberBg, marginTop: vs(10)}]}>
          <AppText variant="small" color={Colors.amberText} style={{lineHeight: ms(17)}}>
            Barometric drop of 3 hPa in 24h is a documented trigger. Your diary shows r=0.54 correlation
            between drops {'\u2265'}3 hPa and migraine days.
          </AppText>
        </View>
      </View>
    </View>
  );

  /* ── render ── */
  return (
    <View>
      {renderSourceGrid()}
      {activeSource === 'wear' && renderWearPanel()}
      {activeSource === 'glucose' && renderGlucosePanel()}
      {activeSource === 'bp' && renderBPPanel()}
      {activeSource === 'weather' && renderWeatherPanel()}
    </View>
  );
};

/* ───────── styles ───────── */

const st = StyleSheet.create({
  section: {
    marginTop: vs(16),
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
    marginBottom: vs(8),
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: ms(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    marginTop: vs(6),
  },

  /* Dark hero card */
  darkHero: {
    borderRadius: ms(14),
    padding: ms(14),
    marginTop: vs(10),
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: ms(7),
    height: ms(7),
    borderRadius: ms(4),
  },
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
  },
  metricBoxLight: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(6),
  },

  /* Prediction card */
  predictionCard: {
    backgroundColor: 'rgba(226,75,74,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(226,75,74,0.3)',
    borderRadius: ms(10),
    padding: ms(12),
    marginTop: vs(12),
  },

  /* Card */
  card: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(14),
    marginTop: vs(10),
    backgroundColor: '#fff',
  },

  /* Icon circle */
  iconCircle: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Signal badge */
  signalBadge: {
    borderRadius: ms(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
  },

  /* Analysis row */
  analysisRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(10),
  },

  /* Legend */
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: vs(6),
    gap: s(12),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    marginRight: s(4),
  },
  legendDash: {
    width: ms(12),
    height: 0,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    marginRight: s(4),
  },

  /* Primary button */
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    marginTop: vs(10),
  },

  /* Insight cards */
  insightCard: {
    borderRadius: ms(14),
    padding: ms(14),
    marginTop: vs(8),
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default MigraineAutoView;
