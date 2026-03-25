import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

/* ───────── static data ───────── */

const CONNECTED_DEVICES = [
  {
    id: 'omron',
    icon: 'bluetooth-outline',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    name: 'Omron EVOLV',
    detail: 'Last synced: Today 6:58 AM \u00b7 2 new readings',
    connected: true,
    action: 'Import',
  },
  {
    id: 'withings',
    icon: 'globe-outline',
    iconBg: Colors.blueBg,
    iconColor: Colors.blueText,
    name: 'Withings BPM Connect',
    detail: 'Last synced: 22 Mar \u00b7 Auto-sync enabled',
    connected: true,
    action: 'Sync now',
  },
  {
    id: 'appleHealth',
    icon: 'heart-outline',
    iconBg: Colors.redBg,
    iconColor: Colors.redText,
    name: 'Apple Health',
    detail: '38 historical readings \u00b7 Last import: 20 Mar',
    connected: true,
    action: 'Import all',
  },
  {
    id: 'googleFit',
    icon: 'logo-google',
    iconBg: '#f3f4f6',
    iconColor: Colors.textSecondary,
    name: 'Google Fit',
    detail: 'Not connected',
    connected: false,
    action: 'Connect',
  },
];

const NEW_DEVICES = [
  {
    id: 'omronAdd',
    name: 'Omron upper arm',
    detail: 'M2, M3, M6, M7, EVOLV, Platinum',
    action: '+ Add',
  },
  {
    id: 'withingsAdd',
    name: 'Withings BPM',
    detail: 'BPM Connect, BPM Core, BPM+',
    action: '+ Add',
  },
  {
    id: 'andMedical',
    name: 'A&D Medical',
    detail: 'UA-651BLE, UA-767PBT series',
    action: '+ Add',
  },
  {
    id: 'otherDevice',
    name: 'Other validated device',
    detail: 'Microlife, BEURER, Hartmann, iHealth',
    action: 'Scan BT',
  },
];

const RECENT_SCANS = [
  {
    id: 's1',
    reading: '136 / 84 \u00b7 74 bpm',
    date: 'Scanned 22 Mar',
    badge: 'Saved',
    badgeBg: Colors.tealBg,
    badgeColor: Colors.tealText,
  },
  {
    id: 's2',
    reading: '141 / 88 \u00b7 79 bpm',
    date: 'Scanned 19 Mar',
    badge: 'Saved',
    badgeBg: Colors.amberBg,
    badgeColor: Colors.amberText,
  },
];

/* ───────── component ───────── */

const BPAutoView = ({activeSource}) => {
  const isDeviceSource = activeSource === 'omron' || activeSource === 'withings' || activeSource === 'health';

  /* ── 1. Connected Devices Section ── */
  const renderConnectedDevices = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        CONNECTED DEVICES
      </AppText>
      <View style={st.card}>
        {CONNECTED_DEVICES.map((d, i) => (
          <View
            key={d.id}
            style={[st.deviceRow, i !== 0 && {marginTop: vs(12), borderTopWidth: 0.5, borderTopColor: '#e5e7eb', paddingTop: vs(12)}]}>
            <View style={[st.iconCircle, {backgroundColor: d.iconBg}]}>
              <Icon family="Ionicons" name={d.icon} size={ms(18)} color={d.iconColor} />
            </View>
            <View style={{flex: 1, marginLeft: s(10)}}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>{d.name}</AppText>
              <View style={st.detailRow}>
                <View style={[st.dot, {backgroundColor: d.connected ? '#22c55e' : '#9ca3af'}]} />
                <AppText variant="small" color={Colors.textSecondary} style={{marginLeft: s(5), flex: 1}}>
                  {d.detail}
                </AppText>
              </View>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={st.actionBtn}>
              <AppText variant="small" color={Colors.primary}>{d.action}</AppText>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      <AppText variant="sectionTitle" color={Colors.textPrimary} style={{marginTop: vs(14)}}>
        ADD A NEW DEVICE
      </AppText>
      <View style={st.card}>
        {NEW_DEVICES.map((d, i) => (
          <View
            key={d.id}
            style={[st.deviceRow, i !== 0 && {marginTop: vs(12), borderTopWidth: 0.5, borderTopColor: '#e5e7eb', paddingTop: vs(12)}]}>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>{d.name}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                {d.detail}
              </AppText>
            </View>
            <TouchableOpacity activeOpacity={0.7} style={st.actionBtn}>
              <AppText variant="small" color={Colors.primary}>{d.action}</AppText>
            </TouchableOpacity>
          </View>
        ))}
      </View>

      {/* Blue insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.blueBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(18)} color={Colors.blueText} />
          <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6), flex: 1}}>
            Validated devices only
          </AppText>
        </View>
        <AppText variant="small" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          Only validated cuffed upper-arm devices recommended. AHA/ACC 2025 and ESH 2023 guidelines advise against cuffless devices for clinical decision-making until further validation studies are completed.
        </AppText>
      </View>
    </View>
  );

  /* ── 2. Camera Scan Section ── */
  const renderCameraScan = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        SCAN YOUR BP MONITOR DISPLAY
      </AppText>

      {/* Dark scan card */}
      <View style={st.darkCard}>
        <View style={{alignItems: 'center', paddingVertical: vs(10)}}>
          <Icon family="Ionicons" name="camera-outline" size={ms(36)} color="rgba(255,255,255,0.7)" />
          <AppText variant="bodyBold" color={Colors.white} style={{marginTop: vs(8)}}>
            Point camera at your monitor
          </AppText>
          <AppText
            variant="small"
            color="rgba(255,255,255,0.6)"
            style={{marginTop: vs(4), textAlign: 'center', paddingHorizontal: s(16)}}>
            AI reads numbers automatically from any digital or analogue BP monitor display
          </AppText>
          <TouchableOpacity activeOpacity={0.7} style={[st.primaryBtn, {marginTop: vs(12), alignSelf: 'center'}]}>
            <Icon family="Ionicons" name="camera-outline" size={ms(16)} color={Colors.white} />
            <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
              Open camera
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Green insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.tealBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="checkmark-circle-outline" size={ms(18)} color={Colors.tealText} />
          <AppText variant="bodyBold" color={Colors.tealText} style={{marginLeft: s(6), flex: 1}}>
            After scanning
          </AppText>
        </View>
        <AppText variant="small" color={Colors.tealText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          After scanning: reading will appear pre-filled. You can verify and correct.
        </AppText>
      </View>

      {/* Recent scans card */}
      <View style={st.card}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>Recent scans</AppText>
        {RECENT_SCANS.map((scan, i) => (
          <View
            key={scan.id}
            style={[st.scanRow, i !== 0 && {borderTopWidth: 0.5, borderTopColor: '#e5e7eb'}]}>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>{scan.reading}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                {scan.date}
              </AppText>
            </View>
            <View style={[st.badge, {backgroundColor: scan.badgeBg}]}>
              <AppText variant="small" color={scan.badgeColor}>{scan.badge}</AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  /* ── main render ── */
  return (
    <View style={st.container}>
      {isDeviceSource && renderConnectedDevices()}
      {activeSource === 'scan' && renderCameraScan()}
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

  /* Device rows */
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconCircle: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(2),
  },
  dot: {
    width: ms(7),
    height: ms(7),
    borderRadius: ms(4),
  },
  actionBtn: {
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    borderRadius: ms(8),
    backgroundColor: Colors.tealBg,
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
  },

  /* Scan rows */
  scanRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10),
    paddingTop: vs(10),
  },
  badge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
  },
});

export default BPAutoView;
