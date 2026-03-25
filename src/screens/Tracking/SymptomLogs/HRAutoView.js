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
    id: 'wearable',
    icon: 'watch-outline',
    name: 'Wearable device',
    description: 'Apple Watch \u00B7 Galaxy Watch \u00B7 Fitbit \u00B7 Garmin',
    status: 'Connected',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    id: 'camera',
    icon: 'camera-outline',
    name: 'Camera PPG',
    description: 'Place fingertip on rear camera \u00B7 30-second',
    status: 'Available',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
  {
    id: 'oximeter',
    icon: 'fitness-outline',
    name: 'Pulse oximeter',
    description: 'Fingertip clip \u00B7 Bluetooth or manual',
    status: 'Pair device',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
  {
    id: 'bp-device',
    icon: 'heart-circle-outline',
    name: 'From BP device',
    description: 'Omron \u00B7 Withings \u00B7 HR recorded with last BP',
    status: 'HR 78 available',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
];

const LIVE_STATS = [
  {label: 'Avg (30s)', value: '71', unit: 'bpm', bg: '#f9fafb', color: Colors.textPrimary},
  {label: 'Range', value: '68\u201376', unit: 'bpm', bg: '#f9fafb', color: Colors.textPrimary},
  {label: 'RMSSD live', value: '33', unit: 'ms', bg: Colors.amberBg, color: Colors.amberText},
  {label: 'SpO\u2082', value: '98%', unit: '', bg: Colors.blueBg, color: Colors.blueText},
];

/* ───────── component ───────── */

const HRAutoView = () => {
  const [activeSource, setActiveSource] = useState('wearable');

  /* ── 1. Source Grid ── */
  const renderSourceGrid = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        SELECT MEASUREMENT SOURCE
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

  /* ── 2. Wearable / BP Device Panel ── */
  const renderWearablePanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        LIVE READING — APPLE WATCH
      </AppText>

      {/* PPG Waveform card */}
      <View style={st.card}>
        <View style={st.waveformHeader}>
          <AppText variant="body" color={Colors.textPrimary} style={{flex: 1}}>
            PPG waveform \u00B7 Live
          </AppText>
          <View style={st.liveDot}>
            <View style={[st.dot, {backgroundColor: Colors.red}]} />
            <AppText variant="small" color={Colors.red} style={{marginLeft: s(4)}}>
              Live
            </AppText>
          </View>
        </View>
        <View style={{marginTop: vs(8), borderRadius: ms(8), overflow: 'hidden'}}>
          <Svg width="100%" height={vs(60)} viewBox="0 0 340 60">
            <Rect x="0" y="0" width="340" height="60" fill={Colors.white} />
            {/* Subtle grid lines */}
            <SvgLine x1="0" y1="15" x2="340" y2="15" stroke="#e5e7eb" strokeWidth="0.5" />
            <SvgLine x1="0" y1="30" x2="340" y2="30" stroke="#e5e7eb" strokeWidth="0.5" />
            <SvgLine x1="0" y1="45" x2="340" y2="45" stroke="#e5e7eb" strokeWidth="0.5" />
            <SvgLine x1="68" y1="0" x2="68" y2="60" stroke="#e5e7eb" strokeWidth="0.5" />
            <SvgLine x1="136" y1="0" x2="136" y2="60" stroke="#e5e7eb" strokeWidth="0.5" />
            <SvgLine x1="204" y1="0" x2="204" y2="60" stroke="#e5e7eb" strokeWidth="0.5" />
            <SvgLine x1="272" y1="0" x2="272" y2="60" stroke="#e5e7eb" strokeWidth="0.5" />
            {/* Cardiac PPG waveform — systolic upstroke, dicrotic notch, diastolic runoff */}
            <Polyline
              points="0,45 8,45 12,44 16,40 20,30 24,15 28,10 32,14 34,20 36,25 38,28 40,26 42,30 46,38 52,43 60,45 68,45 76,44 80,40 84,30 88,15 92,10 96,14 98,20 100,25 102,28 104,26 106,30 110,38 116,43 124,45 132,45 140,44 144,40 148,30 152,15 156,10 160,14 162,20 164,25 166,28 168,26 170,30 174,38 180,43 188,45 196,45 204,44 208,40 212,30 216,15 220,10 224,14 226,20 228,25 230,28 232,26 234,30 238,38 244,43 252,45 260,45 268,44 272,40 276,30 280,15 284,10 288,14 290,20 292,25 294,28 296,26 298,30 302,38 308,43 316,45 324,45 332,45 340,45"
              fill="none"
              stroke={Colors.primary}
              strokeWidth="1.8"
            />
          </Svg>
        </View>
      </View>

      {/* Pulse Circle Display */}
      <View style={{alignItems: 'center', marginTop: vs(14)}}>
        <View style={st.pulseCircle}>
          <AppText variant="bodyBold" color={Colors.primary} style={{fontSize: ms(42), lineHeight: ms(48)}}>
            72
          </AppText>
          <AppText variant="caption" color={Colors.tealText}>
            bpm \u00B7 Live
          </AppText>
        </View>
        <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(8)}}>
          Tap to pause \u00B7 Measuring for 30s
        </AppText>
      </View>

      {/* Live Stats — 4-column */}
      <View style={st.statsRow}>
        {LIVE_STATS.map((stat, idx) => (
          <View key={idx} style={[st.statBox, {backgroundColor: stat.bg}]}>
            <AppText variant="small" color={Colors.textSecondary}>
              {stat.label}
            </AppText>
            <AppText variant="bodyBold" color={stat.color} style={{marginTop: vs(2)}}>
              {stat.value}
            </AppText>
            {stat.unit ? (
              <AppText variant="small" color={Colors.textSecondary}>
                {stat.unit}
              </AppText>
            ) : null}
          </View>
        ))}
      </View>

      {/* Rhythm Detection card */}
      <View style={[st.card, {borderColor: Colors.teal}]}>
        <View style={st.rhythmHeader}>
          <Icon family="Ionicons" name="checkmark-circle" size={ms(22)} color={Colors.tealText} />
          <AppText variant="bodyBold" color={Colors.tealText} style={{marginLeft: s(8), flex: 1}}>
            Sinus rhythm detected
          </AppText>
        </View>
        <AppText
          variant="small"
          color={Colors.textSecondary}
          style={{marginTop: vs(4), lineHeight: ms(16)}}>
          Heartbeat is regular with normal P-wave morphology. No ectopic beats detected.
        </AppText>
        <View style={[st.statusBadge, {backgroundColor: Colors.tealBg, marginTop: vs(8)}]}>
          <AppText variant="small" color={Colors.tealText}>
            Normal sinus rhythm
          </AppText>
        </View>
      </View>

      {/* Purple insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.purpleBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(18)} color={Colors.purpleText} />
          <AppText variant="bodyBold" color={Colors.purpleText} style={{marginLeft: s(6), flex: 1}}>
            No AF signal
          </AppText>
        </View>
        <AppText variant="small" color={Colors.purpleText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          Apple Watch uses single-lead ECG + PPG to screen for AFib. The optical heart sensor continuously monitors pulse rhythm in the background. If an irregular rhythm is detected during passive monitoring, you will receive a notification. Current reading shows consistent R-R intervals with no evidence of atrial fibrillation. This does not rule out paroxysmal AFib that may occur outside of measurement windows.
        </AppText>
      </View>

      {/* Use this reading button */}
      <TouchableOpacity activeOpacity={0.7} style={st.primaryBtn}>
        <Icon family="Ionicons" name="checkmark-outline" size={ms(18)} color={Colors.white} />
        <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
          Use this reading \u00B7 72 bpm
        </AppText>
      </TouchableOpacity>

      {/* Stop and discard button */}
      <TouchableOpacity activeOpacity={0.7} style={st.secondaryBtn}>
        <Icon family="Ionicons" name="close-outline" size={ms(18)} color={Colors.textSecondary} />
        <AppText variant="bodyBold" color={Colors.textSecondary} style={{marginLeft: s(6)}}>
          Stop and discard
        </AppText>
      </TouchableOpacity>
    </View>
  );

  /* ── 3. Camera PPG Panel ── */
  const renderCameraPanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        CAMERA PPG MEASUREMENT
      </AppText>

      {/* Dark instruction card */}
      <View style={st.darkCard}>
        <View style={{alignItems: 'center', paddingVertical: vs(10)}}>
          <Icon family="Ionicons" name="camera-outline" size={ms(36)} color="rgba(255,255,255,0.7)" />
          <AppText variant="bodyBold" color={Colors.white} style={{marginTop: vs(8)}}>
            Cover rear camera with fingertip
          </AppText>
          <AppText
            variant="small"
            color="rgba(255,255,255,0.6)"
            style={{marginTop: vs(6), textAlign: 'center', paddingHorizontal: s(16), lineHeight: ms(16)}}>
            Press gently so the camera lens is fully covered by the pad of your index finger. The flash will illuminate your fingertip to detect blood flow changes. Hold completely still for 30 seconds. Movement will reduce accuracy.
          </AppText>
          <TouchableOpacity activeOpacity={0.7} style={[st.primaryBtn, {marginTop: vs(14), alignSelf: 'center'}]}>
            <Icon family="Ionicons" name="play-outline" size={ms(18)} color={Colors.white} />
            <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
              Start camera measurement
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Amber insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.amberBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="warning-outline" size={ms(18)} color={Colors.amberText} />
          <AppText variant="bodyBold" color={Colors.amberText} style={{marginLeft: s(6), flex: 1}}>
            Camera PPG accuracy note
          </AppText>
        </View>
        <AppText variant="small" color={Colors.amberText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          Camera-based photoplethysmography has an approximate margin of error of \u00B15 bpm compared to medical-grade devices. Results can be affected by ambient lighting, skin pigmentation, finger pressure, and motion artifacts. For clinical accuracy, use a validated wearable device or pulse oximeter. Camera PPG is suitable for general wellness tracking but should not be relied upon for medical decision-making.
        </AppText>
      </View>
    </View>
  );

  /* ── 4. Oximeter Panel ── */
  const renderOximeterPanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        PULSE OXIMETER PAIRING
      </AppText>

      {/* Dark pairing card */}
      <View style={st.darkCard}>
        <View style={{alignItems: 'center', paddingVertical: vs(10)}}>
          <Icon family="Ionicons" name="fitness-outline" size={ms(36)} color="rgba(255,255,255,0.7)" />
          <AppText variant="bodyBold" color={Colors.white} style={{marginTop: vs(8)}}>
            Pair fingertip pulse oximeter
          </AppText>
          <AppText
            variant="small"
            color="rgba(255,255,255,0.6)"
            style={{marginTop: vs(6), textAlign: 'center', paddingHorizontal: s(16), lineHeight: ms(16)}}>
            Turn on your Bluetooth pulse oximeter and clip it to your index finger. Make sure Bluetooth is enabled on your phone, then tap below to scan for nearby devices. Supported devices include iHealth PO3, Masimo MightySat, and Wellue FS20F.
          </AppText>
          <TouchableOpacity activeOpacity={0.7} style={[st.primaryBtn, {marginTop: vs(14), alignSelf: 'center'}]}>
            <Icon family="Ionicons" name="bluetooth-outline" size={ms(18)} color={Colors.white} />
            <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
              Scan for pulse oximeter
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Blue insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.blueBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(18)} color={Colors.blueText} />
          <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6), flex: 1}}>
            Manual entry option
          </AppText>
        </View>
        <AppText variant="small" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          If your pulse oximeter does not support Bluetooth, you can manually enter the heart rate and SpO2 values displayed on the device screen. Tap the manual entry tab at the top of the screen to switch to manual input mode.
        </AppText>
      </View>
    </View>
  );

  /* ── main render ── */
  return (
    <View style={st.container}>
      {renderSourceGrid()}
      {(activeSource === 'wearable' || activeSource === 'bp-device') && renderWearablePanel()}
      {activeSource === 'camera' && renderCameraPanel()}
      {activeSource === 'oximeter' && renderOximeterPanel()}
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
  darkCard: {
    backgroundColor: '#040d18',
    borderRadius: ms(14),
    padding: ms(14),
    marginTop: vs(8),
  },

  /* Waveform header */
  waveformHeader: {
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

  /* Pulse circle */
  pulseCircle: {
    width: ms(140),
    height: ms(140),
    borderRadius: ms(70),
    backgroundColor: Colors.tealBg,
    borderWidth: 2,
    borderColor: Colors.teal,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Stats row */
  statsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(12),
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(8),
    borderRadius: ms(10),
    marginHorizontal: s(3),
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },

  /* Rhythm */
  rhythmHeader: {
    flexDirection: 'row',
    alignItems: 'center',
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

  /* Buttons */
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
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#f3f4f6',
    borderRadius: ms(12),
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    marginTop: vs(8),
  },
});

export default HRAutoView;
