import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const HRDeviceSync = () => (
  <View style={st.card}>
    <View style={st.cardTitle}>
      <AppText variant="subtext" color={Colors.textSecondary} style={st.sectionLabel}>Connected devices</AppText>
    </View>

    {/* Apple Watch */}
    <View style={st.deviceRow}>
      <View style={[st.deviceIcon, {backgroundColor: '#f0f0f0'}]}>
        <Icon family="Ionicons" name="watch-outline" size={ms(18)} color={Colors.textPrimary} />
      </View>
      <View style={{flex: 1, minWidth: 0}}>
        <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>Apple Watch Series 9</AppText>
        <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>Continuous HR + HRV - Last sync 9:38 AM</AppText>
      </View>
      <View style={{alignItems: 'flex-end', flexShrink: 0}}>
        <View style={[st.statusBadge, {backgroundColor: Colors.tealBg}]}>
          <AppText variant="subtext" color={Colors.tealText} style={{fontWeight: '700'}}>Connected</AppText>
        </View>
        <TouchableOpacity activeOpacity={0.7} style={{marginTop: vs(4)}}>
          <AppText variant="small" color={Colors.primary} style={{fontWeight: '700'}}>Sync now</AppText>
        </TouchableOpacity>
      </View>
    </View>

    {/* Latest auto-synced */}
    <View style={st.syncedWrap}>
      <View style={st.syncedCard}>
        <View style={{flex: 1}}>
          <AppText variant="subtext" color={Colors.primary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5, marginBottom: vs(2)}}>Latest reading</AppText>
          <AppText variant="caption" color={Colors.textPrimary}>Resting - 9:38 AM today</AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(1)}}>HRV: 28 ms - SpO2: 97%</AppText>
        </View>
        <View style={{alignItems: 'flex-end'}}>
          <AppText style={{fontSize: ms(34), fontWeight: '800', color: Colors.tealDark, lineHeight: ms(36)}}>74</AppText>
          <AppText variant="small" color={Colors.textTertiary}>bpm</AppText>
        </View>
        <TouchableOpacity style={st.confirmBtn} activeOpacity={0.7}>
          <AppText variant="small" color={Colors.tealText} style={{fontWeight: '600'}}>Confirm</AppText>
        </TouchableOpacity>
      </View>
    </View>

    {/* Finger oximeter */}
    <View style={[st.deviceRow, {opacity: 0.75}]}>
      <View style={[st.deviceIcon, {backgroundColor: '#FBEAF0'}]}>
        <Icon family="Ionicons" name="finger-print-outline" size={ms(18)} color={Colors.red} />
      </View>
      <View style={{flex: 1, minWidth: 0}}>
        <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>Finger Pulse Oximeter</AppText>
        <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>Manual Bluetooth - Not connected</AppText>
      </View>
      <View style={[st.statusBadge, {backgroundColor: Colors.redBg}]}>
        <AppText variant="subtext" color={Colors.redDark} style={{fontWeight: '700'}}>Offline</AppText>
      </View>
    </View>
  </View>
);

const st = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: '#dde8e2', overflow: 'hidden', marginBottom: vs(12)},
  cardTitle: {paddingHorizontal: s(13), paddingTop: vs(11), paddingBottom: vs(8)},
  sectionLabel: {textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6},
  deviceRow: {flexDirection: 'row', alignItems: 'center', gap: s(11), paddingVertical: vs(9), paddingHorizontal: s(13), borderTopWidth: 0.5, borderTopColor: '#f0f4f2'},
  deviceIcon: {width: ms(40), height: ms(40), borderRadius: ms(11), alignItems: 'center', justifyContent: 'center'},
  statusBadge: {paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(8)},
  syncedWrap: {paddingHorizontal: s(13), paddingBottom: vs(10)},
  syncedCard: {backgroundColor: '#f0faf5', borderWidth: 0.5, borderColor: '#a5d6a7', borderRadius: ms(10), padding: ms(9), flexDirection: 'row', alignItems: 'center', gap: s(10)},
  confirmBtn: {backgroundColor: Colors.tealBg, paddingHorizontal: s(9), paddingVertical: vs(4), borderRadius: ms(8), flexShrink: 0},
});

export default HRDeviceSync;
