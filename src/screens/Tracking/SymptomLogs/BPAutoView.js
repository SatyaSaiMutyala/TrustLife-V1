import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const BPDeviceSync = () => {
  return (
    <View style={st.card}>
      <View style={st.cardTitle}>
        <AppText variant="subtext" color={Colors.textSecondary} style={st.sectionLabel}>
          Connected devices
        </AppText>
      </View>

      {/* Omron row - synced */}
      <View style={st.deviceRow}>
        <View style={[st.deviceIcon, {backgroundColor: '#FBEAF0'}]}>
          <Icon family="Ionicons" name="heart" size={ms(18)} color={Colors.red} />
        </View>
        <View style={{flex: 1, minWidth: 0}}>
          <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>
            Omron HEM-7156
          </AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>
            Bluetooth cuff - Last sync 8:04 AM
          </AppText>
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
            <AppText variant="subtext" color={Colors.primary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5, marginBottom: vs(2)}}>
              Latest auto-synced
            </AppText>
            <AppText variant="caption" color={Colors.textPrimary}>Morning sitting - 8:04 AM today</AppText>
          </View>
          <View style={{alignItems: 'center'}}>
            <View style={{flexDirection: 'row', alignItems: 'baseline', gap: s(2)}}>
              <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.amber, lineHeight: ms(24)}}>136</AppText>
              <AppText style={{fontSize: ms(15), fontWeight: '300', color: '#bbb'}}>/</AppText>
              <AppText style={{fontSize: ms(16), fontWeight: '700', color: Colors.amber}}>86</AppText>
            </View>
            <AppText variant="small" color={Colors.textTertiary}>mmHg - 74 bpm</AppText>
          </View>
          <TouchableOpacity style={st.confirmBtn} activeOpacity={0.7}>
            <AppText variant="small" color={Colors.tealText} style={{fontWeight: '600'}}>Confirm</AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Apple Health */}
      <View style={st.deviceRow}>
        <View style={[st.deviceIcon, {backgroundColor: Colors.redBg}]}>
          <Icon family="Ionicons" name="heart" size={ms(18)} color={Colors.red} />
        </View>
        <View style={{flex: 1, minWidth: 0}}>
          <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>Apple Health</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>Auto-import BP readings - Last sync 8:04 AM</AppText>
        </View>
        <View style={{alignItems: 'flex-end', flexShrink: 0}}>
          <View style={[st.statusBadge, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="subtext" color={Colors.tealText} style={{fontWeight: '700'}}>Active</AppText>
          </View>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(4)}}>Auto</AppText>
        </View>
      </View>
    </View>
  );
};

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

export default BPDeviceSync;
