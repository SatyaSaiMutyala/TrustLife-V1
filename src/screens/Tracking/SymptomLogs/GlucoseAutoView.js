import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import AppText from '../../../components/shared/AppText';

// ──────────────────────────────────────────────
// GlucoseDeviceSync
// The "Connected devices" card from the log screen.
// Shows glucometer (synced), latest auto-synced reading,
// CGM (not connected), and Apple Health (active).
// ──────────────────────────────────────────────

const GlucoseDeviceSync = ({unit}) => {
  return (
    <View style={st.card}>
      {/* Card title */}
      <View style={st.cardTitle}>
        <AppText
          variant="subtext"
          color={Colors.textSecondary}
          style={st.sectionLabel}>
          Connected devices
        </AppText>
      </View>

      {/* ── ROW 1: Glucometer — synced ── */}
      <View style={st.deviceRow}>
        <View style={[st.deviceIcon, {backgroundColor: '#fce4ec'}]}>
          <AppText style={{fontSize: ms(20)}}>🩸</AppText>
        </View>
        <View style={{flex: 1, minWidth: 0}}>
          <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>
            Accu-Chek Guide
          </AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>
            Glucometer · Bluetooth · Last sync 7:12 AM
          </AppText>
        </View>
        <View style={{alignItems: 'flex-end', flexShrink: 0}}>
          <View style={[st.statusBadge, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="subtext" color={Colors.tealText} style={{fontWeight: '700'}}>
              ✓ Connected
            </AppText>
          </View>
          <TouchableOpacity activeOpacity={0.7} style={{marginTop: vs(4)}}>
            <AppText variant="small" color={Colors.primary} style={{fontWeight: '700'}}>
              Sync now ›
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Latest auto-synced reading ── */}
      <View style={st.syncedReadingWrap}>
        <View style={st.syncedReading}>
          <View style={{flex: 1}}>
            <AppText
              variant="subtext"
              color={Colors.primary}
              style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5, marginBottom: vs(2)}}>
              Latest auto-synced
            </AppText>
            <AppText variant="caption" color={Colors.textPrimary}>
              Fasting · 7:12 AM today
            </AppText>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <AppText
              style={{fontSize: ms(24), fontWeight: '800', color: Colors.tealDark, lineHeight: ms(28)}}>
              121
            </AppText>
            <AppText variant="small" color={Colors.textTertiary}>mg/dL</AppText>
          </View>
          <TouchableOpacity style={st.confirmBtn} activeOpacity={0.7}>
            <AppText variant="small" color={Colors.tealText} style={{fontWeight: '600'}}>
              ✓ Confirm & log
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── ROW 2: CGM — not connected ── */}
      <View style={[st.deviceRow, {opacity: 0.7}]}>
        <View style={[st.deviceIcon, {backgroundColor: Colors.background}]}>
          <AppText style={{fontSize: ms(20)}}>📡</AppText>
        </View>
        <View style={{flex: 1, minWidth: 0}}>
          <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>
            CGM{' '}
            <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '400'}}>
              (Dexcom / Libre)
            </AppText>
          </AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>
            Continuous glucose monitor · Not connected
          </AppText>
        </View>
        <TouchableOpacity
          style={st.connectBtn}
          activeOpacity={0.7}>
          <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>
            Connect ›
          </AppText>
        </TouchableOpacity>
      </View>

      {/* ── ROW 3: Apple Health ── */}
      <View style={st.deviceRow}>
        <View style={[st.deviceIcon, {backgroundColor: Colors.redBg}]}>
          <AppText style={{fontSize: ms(20)}}>❤️</AppText>
        </View>
        <View style={{flex: 1, minWidth: 0}}>
          <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>
            Apple Health
          </AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>
            Auto-import glucose readings · Last sync 7:12 AM
          </AppText>
        </View>
        <View style={{alignItems: 'flex-end', flexShrink: 0}}>
          <View style={[st.statusBadge, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="subtext" color={Colors.tealText} style={{fontWeight: '700'}}>
              ✓ Active
            </AppText>
          </View>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(4)}}>
            Auto
          </AppText>
        </View>
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    borderWidth: 0.5,
    borderColor: '#dde8e2',
    overflow: 'hidden',
    marginBottom: vs(12),
  },
  cardTitle: {
    paddingHorizontal: s(13),
    paddingTop: vs(11),
    paddingBottom: vs(8),
  },
  sectionLabel: {
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.6,
  },

  // Device rows
  deviceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(11),
    paddingVertical: vs(9),
    paddingHorizontal: s(13),
    borderTopWidth: 0.5,
    borderTopColor: '#f0f4f2',
  },
  deviceIcon: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(11),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Status badge
  statusBadge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },

  // Synced reading
  syncedReadingWrap: {
    paddingHorizontal: s(13),
    paddingBottom: vs(10),
  },
  syncedReading: {
    backgroundColor: '#f0faf5',
    borderWidth: 0.5,
    borderColor: '#a5d6a7',
    borderRadius: ms(10),
    padding: ms(9),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  confirmBtn: {
    backgroundColor: Colors.tealBg,
    paddingHorizontal: s(9),
    paddingVertical: vs(4),
    borderRadius: ms(8),
    flexShrink: 0,
  },

  // Connect button
  connectBtn: {
    backgroundColor: Colors.background,
    paddingHorizontal: s(9),
    paddingVertical: vs(4),
    borderRadius: ms(8),
    borderWidth: 0.5,
    borderColor: '#d4e2db',
    flexShrink: 0,
  },
});

export default GlucoseDeviceSync;
