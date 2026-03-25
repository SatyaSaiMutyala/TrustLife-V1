import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Polyline, Rect, Line as SvgLine} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

/* ───────── static data ───────── */

const SOURCES = [
  {
    id: 'oximeter',
    icon: 'fitness-outline',
    name: 'Pulse oximeter',
    description: 'Fingertip clip \u00b7 SpO\u2082 + HR \u00b7 Bluetooth',
    status: 'iHealth linked',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    id: 'smartinhaler',
    icon: 'cloud-outline',
    name: 'Smart inhaler sensor',
    description: 'Adherence sensor \u00b7 Auto-logs puffs + time',
    status: 'Pair Propeller',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
  {
    id: 'air',
    icon: 'leaf-outline',
    name: 'Air quality',
    description: 'Pollen \u00b7 PM2.5 \u00b7 AQI \u00b7 Indoor CO\u2082 \u00b7 Hyderabad live',
    status: 'Live feed',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    id: 'wearable',
    icon: 'watch-outline',
    name: 'Wearable',
    description: 'Respiratory rate \u00b7 Nocturnal wheeze \u00b7 SpO\u2082 overnight',
    status: 'Apple Watch Series 9',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
];

const SPO2_REF = [
  {
    range: '95\u2013100%',
    label: 'Normal',
    icon: 'checkmark-circle-outline',
    color: Colors.tealText,
    bg: Colors.tealBg,
    desc: 'No hypoxia \u00b7 Continue standard treatment',
  },
  {
    range: '92\u201394%',
    label: 'Borderline',
    icon: 'warning-outline',
    color: Colors.amberText,
    bg: Colors.amberBg,
    desc: 'Give bronchodilator \u00b7 Monitor every 15 min',
  },
  {
    range: '<92%',
    label: 'Emergency',
    icon: 'alert-circle-outline',
    color: Colors.redText,
    bg: Colors.redBg,
    desc: 'Give high-flow oxygen \u00b7 Call 108 immediately',
  },
];

/* ───────── component ───────── */

const AsthmaAutoView = () => {
  const [activeSource, setActiveSource] = useState('oximeter');

  /* ── 1. Source Grid ── */
  const renderSourceGrid = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        AUTO MONITORING SOURCES
      </AppText>
      <View style={st.deviceGrid}>
        {SOURCES.map(src => {
          const active = activeSource === src.id;
          return (
            <TouchableOpacity
              key={src.id}
              activeOpacity={0.7}
              onPress={() => setActiveSource(src.id)}
              style={[
                st.deviceCard,
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

  /* ── 2. Oximeter Panel ── */
  const renderOximeterPanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        IHEALTH PULSE OXIMETER {'\u00b7'} LIVE READING
      </AppText>

      {/* Dark hero card */}
      <View style={st.darkHero}>
        <View style={st.heroTopRow}>
          <AppText variant="small" color="rgba(255,255,255,0.7)" style={{flex: 1}}>
            iHealth PO3 {'\u00b7'} Fingertip {'\u00b7'} BT4.0 {'\u00b7'} Continuous
          </AppText>
          <View style={st.liveDot}>
            <View style={[st.dot, {backgroundColor: '#22c55e'}]} />
            <AppText variant="small" color="#22c55e" style={{marginLeft: s(4)}}>
              Live
            </AppText>
          </View>
        </View>

        {/* 2-column metrics */}
        <View style={st.metricsRow}>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color="#22c55e" style={{fontSize: ms(26)}}>
              97%
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">SpO{'\u2082'}</AppText>
          </View>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color={Colors.amber} style={{fontSize: ms(26)}}>
              92
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">bpm</AppText>
          </View>
        </View>

        {/* 3-column status row */}
        <View style={[st.metricsRow, {marginTop: vs(6)}]}>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color="#22c55e" style={{fontSize: ms(14)}}>
              Normal
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">SpO{'\u2082'} status</AppText>
          </View>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color={Colors.amber} style={{fontSize: ms(14)}}>
              Slightly {'\u2191'}
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">HR vs rest</AppText>
          </View>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color="#22c55e" style={{fontSize: ms(14)}}>
              Strong
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">Perfusion</AppText>
          </View>
        </View>
      </View>

      {/* Waveform card */}
      <View style={st.card}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>
          Plethysmography waveform {'\u00b7'} Live
        </AppText>
        <View style={{marginTop: vs(8), borderRadius: ms(8), overflow: 'hidden'}}>
          <Svg width="100%" height={vs(60)} viewBox="0 0 340 60">
            <Rect x="0" y="0" width="340" height="60" fill="#f0f7f4" />
            <SvgLine x1="0" y1="30" x2="340" y2="30" stroke="rgba(10,92,71,0.12)" strokeWidth="0.5" />
            <SvgLine x1="0" y1="15" x2="340" y2="15" stroke="rgba(10,92,71,0.06)" strokeWidth="0.5" />
            <SvgLine x1="0" y1="45" x2="340" y2="45" stroke="rgba(10,92,71,0.06)" strokeWidth="0.5" />
            <Polyline
              points="0,45 8,44 16,42 22,38 26,30 30,18 33,10 36,14 39,28 42,38 46,44 54,46 62,46 70,45 78,44 84,42 88,38 92,30 96,18 99,10 102,14 105,28 108,38 112,44 120,46 128,46 136,45 144,44 150,42 154,38 158,30 162,18 165,10 168,14 171,28 174,38 178,44 186,46 194,46 202,45 210,44 216,42 220,38 224,30 228,18 231,10 234,14 237,28 240,38 244,44 252,46 260,46 268,45 276,44 282,42 286,38 290,30 294,18 297,10 300,14 303,28 306,38 310,44 318,46 326,46 334,45 340,45"
              fill="none"
              stroke={Colors.blue}
              strokeWidth="1.5"
            />
          </Svg>
        </View>
      </View>

      {/* SpO2 reference card */}
      <View style={st.card}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>
          SpO{'\u2082'} reference ranges
        </AppText>
        {SPO2_REF.map((ref, idx) => (
          <View
            key={idx}
            style={[st.refRow, {backgroundColor: ref.bg, marginTop: vs(8)}]}>
            <Icon family="Ionicons" name={ref.icon} size={ms(20)} color={ref.color} />
            <View style={{marginLeft: s(8), flex: 1}}>
              <AppText variant="bodyBold" color={ref.color}>
                {ref.range} {ref.label}
              </AppText>
              <AppText variant="small" color={ref.color} style={{marginTop: vs(2)}}>
                {ref.desc}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      {/* Import button */}
      <TouchableOpacity activeOpacity={0.7} style={st.primaryBtn}>
        <Icon family="Ionicons" name="download-outline" size={ms(18)} color={Colors.white} />
        <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
          Import oximeter reading {'\u00b7'} SpO{'\u2082'} 97% {'\u00b7'} HR 92 bpm
        </AppText>
      </TouchableOpacity>
    </View>
  );

  /* ── 3. Air Quality Panel ── */
  const renderAirPanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        AIR QUALITY {'\u00b7'} HYDERABAD {'\u00b7'} 24 MAR 2026
      </AppText>

      {/* Row 1: AQI, PM2.5, Pollen */}
      <View style={[st.metricsRowLight, {marginTop: vs(8)}]}>
        <View style={st.statBox}>
          <AppText variant="bodyBold" color={Colors.amber} style={{fontSize: ms(20)}}>
            142
          </AppText>
          <AppText variant="small" color={Colors.textSecondary}>AQI</AppText>
          <AppText variant="small" color={Colors.amberText}>Unhealthy</AppText>
        </View>
        <View style={st.statBox}>
          <AppText variant="bodyBold" color={Colors.amber} style={{fontSize: ms(20)}}>
            68
          </AppText>
          <AppText variant="small" color={Colors.textSecondary}>{'\u00b5'}g/m{'\u00b3'}</AppText>
          <AppText variant="small" color={Colors.amberText}>Elevated</AppText>
        </View>
        <View style={st.statBox}>
          <AppText variant="bodyBold" color={Colors.red} style={{fontSize: ms(20)}}>
            High
          </AppText>
          <AppText variant="small" color={Colors.textSecondary}>Pollen</AppText>
          <AppText variant="small" color={Colors.redText}>Grass</AppText>
        </View>
      </View>

      {/* Row 2: NO2, Humidity, Temp */}
      <View style={[st.metricsRowLight, {marginTop: vs(6)}]}>
        <View style={st.statBox}>
          <AppText variant="bodyBold" color={Colors.textSecondary} style={{fontSize: ms(20)}}>
            38
          </AppText>
          <AppText variant="small" color={Colors.textSecondary}>{'\u00b5'}g/m{'\u00b3'}</AppText>
          <AppText variant="small" color={Colors.textSecondary}>Moderate</AppText>
        </View>
        <View style={st.statBox}>
          <AppText variant="bodyBold" color={Colors.blue} style={{fontSize: ms(20)}}>
            62%
          </AppText>
          <AppText variant="small" color={Colors.textSecondary}>Humidity</AppText>
          <AppText variant="small" color={Colors.blueText}>Moderate</AppText>
        </View>
        <View style={st.statBox}>
          <AppText variant="bodyBold" color={Colors.textSecondary} style={{fontSize: ms(20)}}>
            32{'\u00b0'}C
          </AppText>
          <AppText variant="small" color={Colors.textSecondary}>Temp</AppText>
          <AppText variant="small" color={Colors.textSecondary}>Warm</AppText>
        </View>
      </View>

      {/* Red insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.redBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="alert-circle-outline" size={ms(18)} color={Colors.redText} />
          <AppText variant="bodyBold" color={Colors.redText} style={{marginLeft: s(6), flex: 1}}>
            High AQI + elevated pollen today
          </AppText>
        </View>
        <AppText variant="small" color={Colors.redText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          High AQI 142 + elevated pollen today in Hyderabad. Keep windows closed and avoid outdoor play during peak hours (10 AM{'\u2013'}4 PM). Consider giving a prophylactic bronchodilator puff before any unavoidable outdoor exposure. Run indoor air purifier on high setting. Monitor for increased cough, wheeze, or chest tightness throughout the day.
        </AppText>
      </View>

      {/* Sky insight */}
      <View style={[st.insightCard, {backgroundColor: '#e0f2fe'}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="cloudy-outline" size={ms(18)} color={Colors.blueText} />
          <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6), flex: 1}}>
            7-day AQI forecast for Hyderabad
          </AppText>
        </View>
        <AppText variant="small" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          AQI is expected to remain in the 130{'\u2013'}150 range through Thursday due to stagnant air and ongoing construction activity in the area. The next good air window is forecast for Friday (AQI 60{'\u2013'}80) after a brief rain spell clears particulate matter. Plan outdoor activities for Friday or the weekend if possible.
        </AppText>
      </View>
    </View>
  );

  /* ── 4. Smart Inhaler Panel ── */
  const renderSmartInhalerPanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        SMART INHALER SENSOR
      </AppText>

      {/* Blue insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.blueBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(18)} color={Colors.blueText} />
          <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6), flex: 1}}>
            Smart inhaler sensor (Propeller Health)
          </AppText>
        </View>
        <AppText variant="small" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          The Propeller Health sensor clips onto your existing inhaler (MDI or Respimat) and uses Bluetooth to automatically log every puff with date, time, and location. It tracks controller adherence, rescue inhaler usage patterns, and can identify trends that indicate worsening asthma control. Data syncs to TrustLife automatically. No change to your inhaler technique is needed {'\u2014'} simply attach the sensor and use your inhaler as usual.
        </AppText>
      </View>

      {/* Dark pairing card */}
      <View style={st.darkHero}>
        <View style={{alignItems: 'center', paddingVertical: vs(10)}}>
          <Icon family="Ionicons" name="cloud-outline" size={ms(36)} color="rgba(255,255,255,0.7)" />
          <AppText variant="bodyBold" color={Colors.white} style={{marginTop: vs(8)}}>
            Pair smart inhaler sensor
          </AppText>
          <AppText
            variant="small"
            color="rgba(255,255,255,0.6)"
            style={{marginTop: vs(4), textAlign: 'center', paddingHorizontal: s(20)}}>
            Attach the Propeller sensor to your inhaler mouthpiece, then tap below to scan for the device via Bluetooth. Ensure Bluetooth is enabled on your phone.
          </AppText>
          <TouchableOpacity activeOpacity={0.7} style={[st.primaryBtn, {marginTop: vs(12), alignSelf: 'center'}]}>
            <Icon family="Ionicons" name="bluetooth-outline" size={ms(16)} color={Colors.white} />
            <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
              Pair via Bluetooth
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );

  /* ── 5. Wearable Panel ── */
  const renderWearablePanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        WEARABLE {'\u00b7'} APPLE WATCH SERIES 9
      </AppText>

      {/* Sky insight */}
      <View style={[st.insightCard, {backgroundColor: '#e0f2fe'}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="watch-outline" size={ms(18)} color={Colors.blueText} />
          <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6), flex: 1}}>
            Apple Watch Series 9 respiratory monitoring
          </AppText>
        </View>
        <AppText variant="small" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          The Apple Watch Series 9 tracks respiratory rate during sleep using the built-in accelerometer and can measure overnight SpO{'\u2082'} trends via the blood oxygen sensor. It detects nocturnal wheeze patterns and SpO{'\u2082'} dips that may indicate poorly controlled asthma or nocturnal bronchoconstriction. Data is synced each morning after the watch is charged.
        </AppText>
      </View>

      {/* Dark card with overnight data */}
      <View style={st.darkHero}>
        <View style={st.heroTopRow}>
          <AppText variant="small" color="rgba(255,255,255,0.7)" style={{flex: 1}}>
            Last night {'\u00b7'} Overnight data
          </AppText>
        </View>

        {/* 3-column metrics */}
        <View style={[st.metricsRow, {marginTop: vs(10)}]}>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color="#22c55e" style={{fontSize: ms(20)}}>
              17
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">Resp rate</AppText>
          </View>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color="#22c55e" style={{fontSize: ms(20)}}>
              97%
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">Avg SpO{'\u2082'}</AppText>
          </View>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color={Colors.amber} style={{fontSize: ms(20)}}>
              6.2h
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">Sleep</AppText>
          </View>
        </View>

        {/* Description */}
        <View style={[st.resultCard, {marginTop: vs(10)}]}>
          <Icon family="Ionicons" name="checkmark-circle" size={ms(20)} color={Colors.tealText} />
          <View style={{marginLeft: s(8), flex: 1}}>
            <AppText variant="small" color={Colors.tealText}>
              No SpO{'\u2082'} dips below 94% detected overnight. Respiratory rate remained stable at 15{'\u2013'}19 breaths/min. No nocturnal wheeze episodes flagged. Sleep duration slightly below the recommended 7{'\u2013'}8 hours.
            </AppText>
          </View>
        </View>
      </View>

      {/* Import button */}
      <TouchableOpacity activeOpacity={0.7} style={st.primaryBtn}>
        <Icon family="Ionicons" name="download-outline" size={ms(18)} color={Colors.white} />
        <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
          Import last night's wearable data
        </AppText>
      </TouchableOpacity>
    </View>
  );

  /* ── main render ── */
  return (
    <View style={st.container}>
      {renderSourceGrid()}
      {activeSource === 'oximeter' && renderOximeterPanel()}
      {activeSource === 'air' && renderAirPanel()}
      {activeSource === 'smartinhaler' && renderSmartInhalerPanel()}
      {activeSource === 'wearable' && renderWearablePanel()}
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

  /* Device grid */
  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: vs(8),
  },
  deviceCard: {
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
    marginTop: vs(10),
  },
  metricsRowLight: {
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

  /* Ref row */
  refRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: ms(10),
    padding: ms(10),
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

export default AsthmaAutoView;
