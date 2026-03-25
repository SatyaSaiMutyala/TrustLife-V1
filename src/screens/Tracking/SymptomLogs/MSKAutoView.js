import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Polyline, Rect, Line as SvgLine, Text as SvgText} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

/* ───────── static data ───────── */

const SOURCES = [
  {
    id: 'wear',
    icon: 'watch-outline',
    name: 'Wearable / Gait',
    description: 'Step count \u00b7 Gait speed \u00b7 Asymmetry \u00b7 Active minutes',
    status: 'Apple Watch',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    id: 'weather',
    icon: 'cloud-outline',
    name: 'Weather / Barometric',
    description: 'Pressure drops \u00b7 Humidity \u00b7 Temperature changes',
    status: 'Hyderabad live',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    id: 'accel',
    icon: 'phone-portrait-outline',
    name: 'Accelerometer',
    description: 'Fall detection \u00b7 Limping pattern \u00b7 Activity quality',
    status: 'iPhone/Watch',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
  {
    id: 'sleep',
    icon: 'moon-outline',
    name: 'Sleep Position',
    description: 'Position changes \u00b7 Night restlessness \u00b7 Pain-related waking',
    status: 'Apple Watch',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
];

const GAIT_ANALYSIS = [
  {
    icon: 'walk-outline',
    label: 'Gait speed 0.94 m/s',
    desc: 'Slightly below normal range (1.0\u20131.3 m/s). 21% below age-matched average of 1.19 m/s. Suggests guarded gait pattern consistent with joint pain or stiffness.',
    badge: 'Reduced',
    badgeBg: Colors.amberBg,
    badgeColor: Colors.amberText,
  },
  {
    icon: 'swap-horizontal-outline',
    label: '7.8% asymmetry',
    desc: 'Mild antalgic gait pattern detected. Right stance phase shortened by 7.8% relative to left, suggesting pain-related unloading of the right knee or hip.',
    badge: 'Antalgic',
    badgeBg: Colors.amberBg,
    badgeColor: Colors.amberText,
  },
  {
    icon: 'trending-up-outline',
    label: 'Step count trend',
    desc: '3,200 \u2192 4,280 steps over the past 14 days. 33% increase in daily step count, indicating improved mobility and activity tolerance.',
    badge: 'Improving',
    badgeBg: Colors.tealBg,
    badgeColor: Colors.tealText,
  },
];

const STEPS_DATA = [3200, 2800, 3500, 3100, 3600, 3400, 3800, 3600, 4000, 3900, 4100, 4200, 4280, 4280];
const STEPS_TARGET = 8000;

const PRESSURE_DATA = [1015, 1013, 1011, 1014, 1016, 1012, 1009, 1011, 1014, 1013, 1010, 1011, 1009, 1009];
const PAIN_DATA = [2, 2, 3, 2, 2, 3, 4, 3, 2, 2, 3, 3, 3, 3];

/* ───────── component ───────── */

const MSKAutoView = () => {
  const [activeSource, setActiveSource] = useState('wear');

  /* ── 1. Source Grid ── */
  const renderSourceGrid = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        AUTO MONITORING SOURCES
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

  /* ── 2. Wearable / Gait Panel ── */
  const renderWearPanel = () => {
    /* gait cadence polyline helpers */
    const rightStepPoints = Array.from({length: 35}, (_, i) => {
      const x = (i / 34) * 340;
      const y = 40 - Math.sin(i * 0.55) * 18 - Math.cos(i * 0.3) * 4;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const leftStepPoints = Array.from({length: 35}, (_, i) => {
      const x = (i / 34) * 340;
      const y = 40 + Math.sin(i * 0.55) * 14 + Math.cos(i * 0.3) * 3;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    /* steps chart helpers */
    const stepsMax = STEPS_TARGET;
    const stepsPoints = STEPS_DATA.map((v, i) => {
      const x = (i / (STEPS_DATA.length - 1)) * 320 + 10;
      const y = 70 - (v / stepsMax) * 60;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const stepsAreaPoints =
      `10,70 ${STEPS_DATA.map((v, i) => {
        const x = (i / (STEPS_DATA.length - 1)) * 320 + 10;
        const y = 70 - (v / stepsMax) * 60;
        return `${x.toFixed(1)},${y.toFixed(1)}`;
      }).join(' ')} 330,70`;

    const targetY = 70 - (STEPS_TARGET / stepsMax) * 60;

    return (
      <View style={st.section}>
        <AppText variant="sectionTitle" color={Colors.textPrimary}>
          APPLE WATCH {'\u00b7'} GAIT & MOBILITY DATA {'\u00b7'} TODAY
        </AppText>

        {/* Dark hero card */}
        <View style={[st.darkHero, {backgroundColor: '#1a0f05'}]}>
          {/* Device row */}
          <View style={st.heroTopRow}>
            <View style={st.liveDot}>
              <View style={[st.dot, {backgroundColor: '#22c55e'}]} />
              <AppText variant="small" color="#22c55e" style={{marginLeft: s(4)}}>
                Live
              </AppText>
            </View>
            <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginLeft: s(8), flex: 1}}>
              Apple Watch Series 9 {'\u00b7'} Real-time sync {'\u00b7'} 24 Mar 2026
            </AppText>
          </View>

          {/* 2-column metrics */}
          <View style={[st.metricsRow, {marginTop: vs(10)}]}>
            <View style={st.metricBox}>
              <AppText variant="bodyBold" color={Colors.amberText} style={{fontSize: ms(20)}}>
                4,280
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.6)">Steps</AppText>
            </View>
            <View style={st.metricBox}>
              <AppText variant="bodyBold" color="#22c55e" style={{fontSize: ms(20)}}>
                0.94
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.6)">Gait speed (m/s)</AppText>
            </View>
          </View>

          {/* 3-column metrics */}
          <View style={[st.metricsRow, {marginTop: vs(6)}]}>
            <View style={st.metricBox}>
              <AppText variant="bodyBold" color={Colors.amberText} style={{fontSize: ms(18)}}>
                7.8%
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.6)">Gait asymmetry</AppText>
            </View>
            <View style={st.metricBox}>
              <AppText variant="bodyBold" color="#22c55e" style={{fontSize: ms(18)}}>
                38 min
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.6)">Active minutes</AppText>
            </View>
            <View style={st.metricBox}>
              <AppText variant="bodyBold" color={Colors.amberText} style={{fontSize: ms(18)}}>
                Slight
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.6)">Detected limp</AppText>
            </View>
          </View>
        </View>

        {/* Gait pattern SVG chart */}
        <View style={st.card}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>
            Step cadence & symmetry {'\u00b7'} Today
          </AppText>
          <View style={{marginTop: vs(8), borderRadius: ms(8), overflow: 'hidden'}}>
            <Svg width="100%" height={vs(80)} viewBox="0 0 340 80">
              <Rect x="0" y="0" width="340" height="80" fill="#fafafa" />
              {/* Dashed center baseline */}
              <SvgLine
                x1="0" y1="40" x2="340" y2="40"
                stroke="#9ca3af"
                strokeWidth="0.8"
                strokeDasharray="4,3"
              />
              {/* Right step (orange) */}
              <Polyline
                points={rightStepPoints}
                fill="none"
                stroke="#e67e22"
                strokeWidth="1.5"
              />
              {/* Left step (purple) — slightly less amplitude = antalgic */}
              <Polyline
                points={leftStepPoints}
                fill="none"
                stroke="#8b5cf6"
                strokeWidth="1.5"
              />
            </Svg>
          </View>
          {/* Legend */}
          <View style={st.legendRow}>
            <View style={st.legendItem}>
              <View style={[st.legendDot, {backgroundColor: '#e67e22'}]} />
              <AppText variant="small" color={Colors.textSecondary}>Right step</AppText>
            </View>
            <View style={st.legendItem}>
              <View style={[st.legendDot, {backgroundColor: '#8b5cf6'}]} />
              <AppText variant="small" color={Colors.textSecondary}>Left step</AppText>
            </View>
            <View style={st.legendItem}>
              <View style={[st.legendDash, {borderColor: '#9ca3af'}]} />
              <AppText variant="small" color={Colors.textSecondary}>Symmetric baseline</AppText>
            </View>
          </View>
        </View>

        {/* Gait analysis card */}
        <View style={st.card}>
          {GAIT_ANALYSIS.map((item, idx) => (
            <View
              key={idx}
              style={[
                st.analysisRow,
                idx > 0 && {borderTopWidth: 0.5, borderTopColor: '#e5e7eb', paddingTop: vs(10)},
              ]}>
              <Icon
                family="Ionicons"
                name={item.icon}
                size={ms(22)}
                color={Colors.textSecondary}
              />
              <View style={{marginLeft: s(10), flex: 1}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <AppText variant="bodyBold" color={Colors.textPrimary}>
                    {item.label}
                  </AppText>
                  <View style={[st.statusBadge, {backgroundColor: item.badgeBg, marginTop: 0}]}>
                    <AppText variant="small" color={item.badgeColor}>{item.badge}</AppText>
                  </View>
                </View>
                <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(15)}}>
                  {item.desc}
                </AppText>
              </View>
            </View>
          ))}
        </View>

        {/* Steps chart SVG */}
        <View style={st.card}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>
            Daily steps {'\u00b7'} 14-day trend
          </AppText>
          <View style={{marginTop: vs(8), borderRadius: ms(8), overflow: 'hidden'}}>
            <Svg width="100%" height={vs(80)} viewBox="0 0 340 80">
              <Rect x="0" y="0" width="340" height="80" fill="#fafafa" />
              {/* Target line (dashed) */}
              <SvgLine
                x1="10" y1={targetY} x2="330" y2={targetY}
                stroke="#9ca3af"
                strokeWidth="0.7"
                strokeDasharray="4,3"
              />
              <SvgText x="332" y={targetY + 3} fontSize="7" fill="#9ca3af">8k</SvgText>
              {/* Area fill */}
              <Polyline
                points={stepsAreaPoints}
                fill="rgba(186,117,23,0.15)"
                stroke="none"
              />
              {/* Line */}
              <Polyline
                points={stepsPoints}
                fill="none"
                stroke={Colors.amber}
                strokeWidth="1.5"
              />
              {/* Dots */}
              {STEPS_DATA.map((v, i) => {
                const cx = (i / (STEPS_DATA.length - 1)) * 320 + 10;
                const cy = 70 - (v / stepsMax) * 60;
                return (
                  <Rect
                    key={i}
                    x={cx - 2}
                    y={cy - 2}
                    width="4"
                    height="4"
                    rx="2"
                    fill={Colors.amber}
                  />
                );
              })}
              {/* X labels */}
              <SvgText x="10" y="78" fontSize="7" fill="#9ca3af">Mar 11</SvgText>
              <SvgText x="160" y="78" fontSize="7" fill="#9ca3af" textAnchor="middle">23</SvgText>
              <SvgText x="330" y="78" fontSize="7" fill="#9ca3af" textAnchor="end">Today</SvgText>
            </Svg>
          </View>
        </View>

        {/* Import button */}
        <TouchableOpacity activeOpacity={0.7} style={st.primaryBtn}>
          <Icon family="Ionicons" name="download-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
            Import gait & step data into today's MSK log
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  /* ── 3. Weather Panel ── */
  const renderWeatherPanel = () => {
    /* Pressure vs pain chart helpers */
    const pMin = 1005;
    const pMax = 1020;
    const pressurePoints = PRESSURE_DATA.map((v, i) => {
      const x = (i / (PRESSURE_DATA.length - 1)) * 320 + 10;
      const y = 70 - ((v - pMin) / (pMax - pMin)) * 60;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    const painPoints = PAIN_DATA.map((v, i) => {
      const x = (i / (PAIN_DATA.length - 1)) * 320 + 10;
      const y = 70 - ((v - 0) / 5) * 60;
      return `${x.toFixed(1)},${y.toFixed(1)}`;
    }).join(' ');

    return (
      <View style={st.section}>
        <AppText variant="sectionTitle" color={Colors.textPrimary}>
          WEATHER {'\u00b7'} HYDERABAD {'\u00b7'} 24 MAR 2026
        </AppText>

        {/* 3-column stat boxes */}
        <View style={[st.metricsRow, {marginTop: vs(8)}]}>
          <View style={st.statBox}>
            <AppText variant="bodyBold" color={Colors.blueText} style={{fontSize: ms(20)}}>
              1009
            </AppText>
            <AppText variant="small" color={Colors.textSecondary}>hPa</AppText>
            <AppText variant="small" color={Colors.blueText} style={{marginTop: vs(2)}}>Low-normal</AppText>
          </View>
          <View style={st.statBox}>
            <AppText variant="bodyBold" color={Colors.amberText} style={{fontSize: ms(20)}}>
              -4
            </AppText>
            <AppText variant="small" color={Colors.textSecondary}>Pressure drop</AppText>
            <AppText variant="small" color={Colors.amberText} style={{marginTop: vs(2)}}>
              {'\u2193'} vs 48h
            </AppText>
          </View>
          <View style={st.statBox}>
            <AppText variant="bodyBold" color={Colors.textSecondary} style={{fontSize: ms(20)}}>
              68%
            </AppText>
            <AppText variant="small" color={Colors.textSecondary}>Humidity</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>Moderate</AppText>
          </View>
        </View>

        {/* Amber insight */}
        <View style={[st.insightCard, {backgroundColor: Colors.amberBg}]}>
          <View style={st.insightHeader}>
            <Icon family="Ionicons" name="warning-outline" size={ms(18)} color={Colors.amberText} />
            <AppText variant="bodyBold" color={Colors.amberText} style={{marginLeft: s(6), flex: 1}}>
              Barometric pressure & joint pain
            </AppText>
          </View>
          <AppText variant="small" color={Colors.amberText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
            Barometric pressure drop of -4 hPa in 48 hours detected. Research suggests that rapid pressure drops can cause expansion of joint tissues and fluid, increasing stiffness and pain in arthritic or injured joints. Patients with osteoarthritis, rheumatoid arthritis, and chronic back pain frequently report flare-ups during low-pressure weather fronts. Consider pre-emptive use of anti-inflammatory medication, gentle stretching, and heat therapy when pressure drops are forecast.
          </AppText>
        </View>

        {/* Pressure vs Pain SVG chart */}
        <View style={st.card}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>
            Barometric pressure vs pain score {'\u00b7'} 14 days
          </AppText>
          <View style={{marginTop: vs(8), borderRadius: ms(8), overflow: 'hidden'}}>
            <Svg width="100%" height={vs(80)} viewBox="0 0 340 80">
              <Rect x="0" y="0" width="340" height="80" fill="#fafafa" />
              {/* Pressure line (blue) */}
              <Polyline
                points={pressurePoints}
                fill="none"
                stroke={Colors.blue}
                strokeWidth="1.5"
              />
              {/* Pain line (orange) */}
              <Polyline
                points={painPoints}
                fill="none"
                stroke="#e67e22"
                strokeWidth="1.5"
              />
            </Svg>
          </View>
          {/* Legend */}
          <View style={st.legendRow}>
            <View style={st.legendItem}>
              <View style={[st.legendDot, {backgroundColor: Colors.blue}]} />
              <AppText variant="small" color={Colors.textSecondary}>Barometric (hPa)</AppText>
            </View>
            <View style={st.legendItem}>
              <View style={[st.legendDot, {backgroundColor: '#e67e22'}]} />
              <AppText variant="small" color={Colors.textSecondary}>Pain score</AppText>
            </View>
          </View>
        </View>
      </View>
    );
  };

  /* ── 4. Accelerometer Panel ── */
  const renderAccelPanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        ACCELEROMETER {'\u00b7'} MOVEMENT ANALYSIS
      </AppText>

      {/* Blue insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.blueBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(18)} color={Colors.blueText} />
          <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6), flex: 1}}>
            Accelerometer-based movement analysis
          </AppText>
        </View>
        <AppText variant="small" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          Your iPhone and Apple Watch contain high-precision accelerometers and gyroscopes that can detect subtle changes in movement quality. When enabled, this feature analyses walking patterns to detect limping, guarded movement, fall risk, and activity quality decline. The data is processed on-device and can help identify early signs of musculoskeletal deterioration before symptoms become severe.
        </AppText>
      </View>

      {/* Dark card */}
      <View style={st.darkHero}>
        <View style={{alignItems: 'center', paddingVertical: vs(10)}}>
          <Icon family="Ionicons" name="phone-portrait-outline" size={ms(36)} color="rgba(255,255,255,0.7)" />
          <AppText variant="bodyBold" color={Colors.white} style={{marginTop: vs(8)}}>
            Movement quality analysis
          </AppText>
          <AppText
            variant="small"
            color="rgba(255,255,255,0.6)"
            style={{marginTop: vs(4), textAlign: 'center', paddingHorizontal: s(20)}}>
            To enable accelerometer-based movement analysis, grant motion and fitness access in your device settings. This allows continuous background monitoring of gait quality, fall detection, and activity patterns.
          </AppText>
          <TouchableOpacity activeOpacity={0.7} style={[st.primaryBtn, {marginTop: vs(12), alignSelf: 'center'}]}>
            <Icon family="Ionicons" name="settings-outline" size={ms(16)} color={Colors.white} />
            <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
              Enable motion access
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  /* ── 5. Sleep Panel ── */
  const renderSleepPanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        SLEEP POSITION {'\u00b7'} APPLE WATCH {'\u00b7'} LAST NIGHT
      </AppText>

      {/* Dark hero card */}
      <View style={[st.darkHero, {backgroundColor: '#1a0f05'}]}>
        {/* Device row */}
        <View style={st.heroTopRow}>
          <View style={st.liveDot}>
            <View style={[st.dot, {backgroundColor: '#22c55e'}]} />
            <AppText variant="small" color="#22c55e" style={{marginLeft: s(4)}}>
              Synced
            </AppText>
          </View>
          <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginLeft: s(8), flex: 1}}>
            Apple Watch Series 9 {'\u00b7'} Sleep tracking {'\u00b7'} Last night
          </AppText>
        </View>

        {/* 3-column stats */}
        <View style={[st.metricsRow, {marginTop: vs(10)}]}>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color={Colors.redText} style={{fontSize: ms(20)}}>
              5.9h
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">Total sleep</AppText>
          </View>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color={Colors.amberText} style={{fontSize: ms(20)}}>
              14
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">Position changes</AppText>
          </View>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color="#22c55e" style={{fontSize: ms(20)}}>
              2x
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">Restless episodes</AppText>
          </View>
        </View>

        {/* Description */}
        <View style={[st.resultCard, {backgroundColor: 'rgba(255,255,255,0.08)', marginTop: vs(10)}]}>
          <AppText variant="small" color="rgba(255,255,255,0.7)" style={{lineHeight: ms(16)}}>
            14 position changes (normal: 8-12) suggests MSK discomfort is disrupting sleep. Frequent repositioning is often associated with joint stiffness, pressure point pain, or inability to find a comfortable sleeping position. This pattern correlates with morning stiffness and fatigue reported by patients with chronic musculoskeletal conditions.
          </AppText>
        </View>
      </View>

      {/* Amber insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.amberBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="warning-outline" size={ms(18)} color={Colors.amberText} />
          <AppText variant="bodyBold" color={Colors.amberText} style={{marginLeft: s(6), flex: 1}}>
            Sleep position & joint pain
          </AppText>
        </View>
        <AppText variant="small" color={Colors.amberText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          Elevated position changes and restless sleep are common in MSK conditions. Consider using a supportive pillow between the knees (side sleepers) or under the knees (back sleepers) to reduce joint stress. A medium-firm mattress with pressure-relief zones can decrease nighttime repositioning by up to 40%. If pain consistently disrupts sleep, discuss nighttime pain management options with your healthcare provider, as poor sleep quality worsens pain perception and delays recovery.
        </AppText>
      </View>
    </View>
  );

  /* ── main render ── */
  return (
    <View style={st.container}>
      {renderSourceGrid()}
      {activeSource === 'wear' && renderWearPanel()}
      {activeSource === 'weather' && renderWeatherPanel()}
      {activeSource === 'accel' && renderAccelPanel()}
      {activeSource === 'sleep' && renderSleepPanel()}
    </View>
  );
};

/* ───────── styles ───────── */

const st = StyleSheet.create({
  container: {
    paddingBottom: vs(10),
  },
  section: {
    marginTop: vs(14),
  },

  /* Source grid */
  sourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: vs(8),
  },
  sourceCard: {
    width: '48.5%',
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(12),
    marginBottom: vs(8),
    backgroundColor: Colors.white,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
    marginTop: vs(6),
  },

  /* Cards */
  card: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(14),
    backgroundColor: Colors.white,
    marginTop: vs(8),
  },
  darkHero: {
    backgroundColor: '#040d18',
    borderRadius: ms(14),
    padding: ms(14),
    marginTop: vs(8),
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

  /* Metrics */
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(6),
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: ms(10),
    marginHorizontal: s(3),
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(8),
    backgroundColor: '#f9fafb',
    borderRadius: ms(10),
    marginHorizontal: s(3),
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },

  /* Result card */
  resultCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(29,158,117,0.12)',
    borderRadius: ms(10),
    padding: ms(10),
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
});

export default MSKAutoView;
