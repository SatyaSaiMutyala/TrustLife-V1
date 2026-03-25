import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Polyline, Rect, Line as SvgLine, Circle as SvgCircle, Text as SvgText, Path} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

/* ───────── static data ───────── */

const DEVICES = [
  {
    id: 'digital',
    icon: 'thermometer-outline',
    name: 'Digital probe',
    description: 'Oral/axillary \u00b7 Bluetooth',
    status: 'Dr Trust BT linked',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    id: 'infrared',
    icon: 'scan-outline',
    name: 'Infrared',
    description: 'Forehead/ear \u00b7 Non-contact',
    status: 'Pair device',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
  {
    id: 'wearable',
    icon: 'watch-outline',
    name: 'Wearable',
    description: 'Apple Watch \u00b7 Continuous',
    status: 'Apple Watch paired',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    id: 'patch',
    icon: 'bandage-outline',
    name: 'Smart patch',
    description: 'TempTraq \u00b7 24h monitoring',
    status: 'Not connected',
    statusBg: '#f3f4f6',
    statusColor: Colors.textSecondary,
  },
];

const RECENT_DIGITAL_READINGS = [
  {time: '7:22 AM', temp: '36.6\u00b0C', site: 'Axillary', zone: 'Normal', zoneColor: Colors.tealText},
  {time: '7:20 AM', temp: '36.5\u00b0C', site: 'Axillary', zone: 'Normal', zoneColor: Colors.tealText},
  {time: '7:18 AM', temp: '36.3\u00b0C', site: 'Axillary', zone: 'Normal', zoneColor: Colors.tealText},
  {time: '6:45 AM', temp: '36.1\u00b0C', site: 'Axillary', zone: 'Normal', zoneColor: Colors.tealText},
  {time: 'Yesterday 10 PM', temp: '36.9\u00b0C', site: 'Oral', zone: 'Normal', zoneColor: Colors.tealText},
];

/* ───────── Live waveform SVG (temperature curve approaching 36.6) ───────── */

const LiveWaveform = () => {
  const points = '0,50 20,52 40,48 60,44 80,38 100,32 120,28 140,24 160,21 180,19 200,18 220,17.5 240,17 260,16.8 280,16.6';
  return (
    <Svg width={ms(290)} height={ms(70)} viewBox="0 0 300 70">
      {/* Grid lines */}
      <SvgLine x1="0" y1="17" x2="300" y2="17" stroke="#d1fae5" strokeWidth="0.5" strokeDasharray="4,4" />
      <SvgLine x1="0" y1="35" x2="300" y2="35" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4,4" />
      <SvgLine x1="0" y1="52" x2="300" y2="52" stroke="#e5e7eb" strokeWidth="0.5" strokeDasharray="4,4" />
      {/* Curve */}
      <Polyline
        points={points}
        fill="none"
        stroke="#10b981"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* End dot */}
      <SvgCircle cx="280" cy="16.6" r="4" fill="#10b981" />
      <SvgCircle cx="280" cy="16.6" r="7" fill="none" stroke="#10b981" strokeWidth="1" opacity="0.3" />
      {/* Labels */}
      <SvgText x="290" y="14" fontSize="8" fill="#10b981" fontWeight="600">36.6</SvgText>
      <SvgText x="2" y="62" fontSize="7" fill="#9ca3af">0s</SvgText>
      <SvgText x="135" y="62" fontSize="7" fill="#9ca3af">30s</SvgText>
      <SvgText x="268" y="62" fontSize="7" fill="#9ca3af">60s</SvgText>
    </Svg>
  );
};

/* ───────── 24h skin temp deviation chart ───────── */

const SkinTempChart = () => {
  // deviation points over 24h, baseline at y=35
  const points = '0,38 20,40 40,42 60,40 80,38 100,36 120,34 140,32 160,30 180,28 200,30 220,32 240,34 260,36 280,38 300,36';
  return (
    <Svg width={ms(290)} height={ms(70)} viewBox="0 0 310 70">
      {/* Baseline */}
      <SvgLine x1="0" y1="35" x2="310" y2="35" stroke="#9ca3af" strokeWidth="0.5" strokeDasharray="4,4" />
      <SvgText x="0" y="32" fontSize="7" fill="#9ca3af">0.0</SvgText>
      <SvgText x="0" y="22" fontSize="7" fill="#9ca3af">+0.5</SvgText>
      <SvgText x="0" y="48" fontSize="7" fill="#9ca3af">-0.5</SvgText>
      {/* Fill area */}
      <Path
        d={`M 0,38 L 20,40 40,42 60,40 80,38 100,36 120,34 140,32 160,30 180,28 200,30 220,32 240,34 260,36 280,38 300,36 L 300,35 L 0,35 Z`}
        fill="rgba(96,165,250,0.15)"
      />
      {/* Line */}
      <Polyline
        points={points}
        fill="none"
        stroke="#60a5fa"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {/* Current dot */}
      <SvgCircle cx="300" cy="36" r="3" fill="#60a5fa" />
      {/* Time labels */}
      <SvgText x="15" y="65" fontSize="7" fill="#9ca3af">12 AM</SvgText>
      <SvgText x="75" y="65" fontSize="7" fill="#9ca3af">6 AM</SvgText>
      <SvgText x="145" y="65" fontSize="7" fill="#9ca3af">12 PM</SvgText>
      <SvgText x="215" y="65" fontSize="7" fill="#9ca3af">6 PM</SvgText>
      <SvgText x="275" y="65" fontSize="7" fill="#9ca3af">Now</SvgText>
    </Svg>
  );
};

/* ───────── Main Component ───────── */

const TempAutoView = () => {
  const [activeDevice, setActiveDevice] = useState('digital');

  return (
    <View>
      {/* ── 1. Device Grid ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>SELECT THERMOMETER</AppText>
      <View style={styles.deviceGrid}>
        {DEVICES.map(device => (
          <TouchableOpacity
            key={device.id}
            activeOpacity={0.7}
            onPress={() => setActiveDevice(device.id)}
            style={[
              styles.deviceCard,
              activeDevice === device.id && styles.deviceCardActive,
            ]}>
            <Icon
              family="Ionicons"
              name={device.icon}
              size={ms(24)}
              color={activeDevice === device.id ? Colors.primary : Colors.textSecondary}
            />
            <AppText
              variant="bodyBold"
              color={activeDevice === device.id ? Colors.primary : Colors.textPrimary}
              style={{marginTop: vs(6)}}>
              {device.name}
            </AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
              {device.description}
            </AppText>
            <View style={[styles.deviceStatus, {backgroundColor: device.statusBg}]}>
              <AppText variant="small" color={device.statusColor} style={{fontWeight: '600'}}>
                {device.status}
              </AppText>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── 2. Digital Probe Panel ── */}
      {activeDevice === 'digital' && (
        <View>
          {/* Dark hero card */}
          <View style={styles.darkCard}>
            <View style={styles.liveRow}>
              <View style={styles.liveDot} />
              <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginLeft: s(6)}}>
                Live reading
              </AppText>
            </View>
            <AppText style={styles.heroTemp}>36.6</AppText>
            <View style={styles.heroMetrics}>
              <View style={styles.heroMetric}>
                <AppText variant="small" color="rgba(255,255,255,0.5)">Zone</AppText>
                <AppText variant="bodyBold" color="#10b981">Normal</AppText>
              </View>
              <View style={styles.heroMetric}>
                <AppText variant="small" color="rgba(255,255,255,0.5)">{'\u00b0'}F</AppText>
                <AppText variant="bodyBold" color={Colors.white}>97.9</AppText>
              </View>
              <View style={styles.heroMetric}>
                <AppText variant="small" color="rgba(255,255,255,0.5)">Site</AppText>
                <AppText variant="bodyBold" color={Colors.white}>Axillary</AppText>
              </View>
            </View>
            <View style={styles.heroButtons}>
              <TouchableOpacity style={styles.heroPrimary} activeOpacity={0.7}>
                <AppText variant="bodyBold" color={Colors.white}>Use this reading</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.heroSecondary} activeOpacity={0.7}>
                <AppText variant="body" color={Colors.white}>Re-measure</AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Live waveform card */}
          <View style={styles.card}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(10)}}>
              <View style={styles.liveDotSmall} />
              <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginLeft: s(6)}}>
                Temperature curve
              </AppText>
            </View>
            <View style={{alignItems: 'center'}}>
              <LiveWaveform />
            </View>
            <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(6), textAlign: 'center'}}>
              Approaching stable reading of 36.6{'\u00b0'}C
            </AppText>
          </View>

          {/* Recent device readings */}
          <View style={styles.card}>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginBottom: vs(8)}}>
              Recent device readings
            </AppText>
            <View style={styles.tableHeaderRow}>
              <AppText variant="small" color={Colors.textTertiary} style={{flex: 2}}>Time</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{flex: 1, textAlign: 'center'}}>Temp</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{flex: 1, textAlign: 'center'}}>Site</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{flex: 1, textAlign: 'center'}}>Zone</AppText>
            </View>
            {RECENT_DIGITAL_READINGS.map((row, i) => (
              <View
                key={i}
                style={[styles.tableRow, i < RECENT_DIGITAL_READINGS.length - 1 && styles.tableRowBorder]}>
                <AppText variant="small" color={Colors.textPrimary} style={{flex: 2}}>{row.time}</AppText>
                <AppText variant="small" color={Colors.textPrimary} style={{flex: 1, textAlign: 'center', fontWeight: '600'}}>{row.temp}</AppText>
                <AppText variant="small" color={Colors.textSecondary} style={{flex: 1, textAlign: 'center'}}>{row.site}</AppText>
                <AppText variant="small" color={row.zoneColor} style={{flex: 1, textAlign: 'center'}}>{row.zone}</AppText>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ── 3. Wearable Panel ── */}
      {activeDevice === 'wearable' && (
        <View>
          {/* Dark card */}
          <View style={styles.darkCard}>
            <AppText variant="bodyBold" color={Colors.white}>Current wrist (skin) temperature</AppText>
            <AppText style={[styles.heroTemp, {fontSize: ms(34)}]}>35.2{'\u00b0'}C</AppText>
            <View style={styles.warningRow}>
              <Icon family="Ionicons" name="warning-outline" size={ms(14)} color="#f59e0b" />
              <AppText variant="small" color="#f59e0b" style={{marginLeft: s(6)}}>
                Skin temperature is 1{'\u2013'}3{'\u00b0'}C lower than core temperature
              </AppText>
            </View>
            <AppText variant="caption" color="rgba(255,255,255,0.6)" style={{marginTop: vs(8), lineHeight: ms(17)}}>
              Apple Watch measures wrist skin temperature relative to your baseline. Current deviation: +0.1{'\u00b0'}C from your 5-night baseline. This is within normal nightly variation.
            </AppText>
          </View>

          {/* 24h skin temp deviation chart */}
          <View style={styles.card}>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginBottom: vs(10)}}>
              24h skin temperature deviation
            </AppText>
            <View style={{alignItems: 'center'}}>
              <SkinTempChart />
            </View>
          </View>

          {/* Amber insight */}
          <View style={styles.insightAmber}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={Colors.amberText} />
              <AppText variant="bodyBold" color={Colors.amberText} style={{marginLeft: s(6)}}>
                Skin vs core temperature
              </AppText>
            </View>
            <AppText variant="caption" color={Colors.amberText} style={{marginTop: vs(4), lineHeight: ms(17)}}>
              Apple Watch measures wrist skin temperature, not core body temperature. Skin temp is typically 1{'\u2013'}3{'\u00b0'}C lower and is best used for tracking relative changes and trends rather than absolute fever detection.
            </AppText>
          </View>

          {/* Use data button */}
          <TouchableOpacity style={styles.useDataButton} activeOpacity={0.7}>
            <Icon family="Ionicons" name="watch-outline" size={ms(18)} color={Colors.white} />
            <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(8)}}>
              Use Apple Watch data as context
            </AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* ── 4. Infrared Panel ── */}
      {activeDevice === 'infrared' && (
        <View>
          {/* Dark scan zone card */}
          <View style={styles.darkCard}>
            <View style={{alignItems: 'center', paddingVertical: vs(10)}}>
              <Icon family="Ionicons" name="scan-outline" size={ms(48)} color="rgba(255,255,255,0.5)" />
              <AppText variant="bodyBold" color={Colors.white} style={{marginTop: vs(12)}}>
                Infrared thermometer
              </AppText>
              <AppText variant="caption" color="rgba(255,255,255,0.6)" style={{marginTop: vs(6), textAlign: 'center', lineHeight: ms(17)}}>
                Hold the infrared thermometer 3{'\u2013'}5 cm from the center of the forehead. Ensure the area is dry and free of hair. Wait for the beep to confirm the reading.
              </AppText>
              <TouchableOpacity style={styles.scanButton} activeOpacity={0.7}>
                <Icon family="Ionicons" name="scan-outline" size={ms(16)} color={Colors.white} />
                <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(8)}}>
                  Start scan
                </AppText>
              </TouchableOpacity>
            </View>
          </View>

          {/* Amber insight */}
          <View style={styles.insightAmber}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={Colors.amberText} />
              <AppText variant="bodyBold" color={Colors.amberText} style={{marginLeft: s(6)}}>
                Infrared accuracy
              </AppText>
            </View>
            <AppText variant="caption" color={Colors.amberText} style={{marginTop: vs(4), lineHeight: ms(17)}}>
              Infrared thermometers can be affected by ambient temperature, sweat, and distance. They may read 0.3{'\u2013'}0.5{'\u00b0'}C lower than oral temperature. For best results, take 2{'\u2013'}3 readings and use the highest value. Avoid measuring immediately after being outdoors.
            </AppText>
          </View>
        </View>
      )}

      {/* ── 5. Smart Patch Panel ── */}
      {activeDevice === 'patch' && (
        <View>
          {/* Blue insight */}
          <View style={styles.insightBlue}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={Colors.blueText} />
              <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6)}}>
                TempTraq continuous monitoring
              </AppText>
            </View>
            <AppText variant="caption" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(17)}}>
              TempTraq is a Bluetooth-enabled wearable patch that continuously monitors axillary temperature for up to 24 hours. Ideal for post-surgical monitoring, overnight fever watch, or paediatric use. Data syncs automatically to TrustLife.
            </AppText>
          </View>

          {/* Dark pairing card */}
          <View style={styles.darkCard}>
            <View style={{alignItems: 'center', paddingVertical: vs(10)}}>
              <Icon family="Ionicons" name="bandage-outline" size={ms(48)} color="rgba(255,255,255,0.5)" />
              <AppText variant="bodyBold" color={Colors.white} style={{marginTop: vs(12)}}>
                Smart temperature patch
              </AppText>
              <AppText variant="caption" color="rgba(255,255,255,0.6)" style={{marginTop: vs(6), textAlign: 'center', lineHeight: ms(17)}}>
                Apply the TempTraq patch under the arm (axillary). Ensure skin is clean and dry. The patch will begin transmitting temperature data via Bluetooth within 60 seconds.
              </AppText>
              <TouchableOpacity style={styles.scanButton} activeOpacity={0.7}>
                <Icon family="Ionicons" name="bluetooth-outline" size={ms(16)} color={Colors.white} />
                <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(8)}}>
                  Scan for patch
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}
    </View>
  );
};

/* ───────── Styles ───────── */

const styles = StyleSheet.create({
  sectionHeading: {
    marginTop: vs(18),
    marginBottom: vs(8),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginBottom: vs(10),
  },

  // Device grid
  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginBottom: vs(10),
  },
  deviceCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(12),
  },
  deviceCardActive: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    backgroundColor: Colors.tealBg,
  },
  deviceStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
    marginTop: vs(6),
  },

  // Dark card
  darkCard: {
    backgroundColor: '#111827',
    borderRadius: ms(14),
    padding: ms(16),
    marginBottom: vs(10),
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: '#10b981',
  },
  liveDotSmall: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: '#10b981',
  },
  heroTemp: {
    fontSize: ms(38),
    fontWeight: '700',
    color: '#10b981',
    lineHeight: ms(44),
    marginTop: vs(4),
  },
  heroMetrics: {
    flexDirection: 'row',
    gap: s(20),
    marginTop: vs(10),
  },
  heroMetric: {
    alignItems: 'center',
  },
  heroButtons: {
    flexDirection: 'row',
    gap: s(10),
    marginTop: vs(14),
  },
  heroPrimary: {
    flex: 1,
    backgroundColor: Colors.primary,
    paddingVertical: vs(10),
    borderRadius: ms(10),
    alignItems: 'center',
  },
  heroSecondary: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingVertical: vs(10),
    borderRadius: ms(10),
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(8),
    backgroundColor: 'rgba(245,158,11,0.15)',
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: ms(8),
  },

  // Table
  tableHeaderRow: {
    flexDirection: 'row',
    paddingBottom: vs(6),
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  tableRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },

  // Insights
  insightAmber: {
    backgroundColor: Colors.amberBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginBottom: vs(10),
  },
  insightBlue: {
    backgroundColor: Colors.blueBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginBottom: vs(10),
  },

  // Buttons
  scanButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingHorizontal: s(20),
    paddingVertical: vs(10),
    borderRadius: ms(10),
    marginTop: vs(16),
  },
  useDataButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: vs(12),
    borderRadius: ms(12),
    marginBottom: vs(10),
  },
});

export default TempAutoView;
