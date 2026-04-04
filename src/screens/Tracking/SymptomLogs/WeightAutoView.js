import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const WeightDeviceSync = () => (
  <View style={st.card}>
    <View style={st.cardTitle}>
      <AppText variant="subtext" color={Colors.textSecondary} style={st.sectionLabel}>Connected devices</AppText>
    </View>

    {/* Mi Scale */}
    <View style={st.deviceRow}>
      <View style={[st.deviceIcon, {backgroundColor: Colors.background}]}>
        <Icon family="Ionicons" name="scale-outline" size={ms(18)} color={Colors.textPrimary} />
      </View>
      <View style={{flex: 1, minWidth: 0}}>
        <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>Mi Scale 2</AppText>
        <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>BT5.0 - Weight + body comp - Last sync 7:22 AM</AppText>
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
          <AppText variant="caption" color={Colors.textPrimary}>Morning fasting - 7:22 AM today</AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(1)}}>Fat 32.4% - Muscle 46.2 kg - Visc. 10</AppText>
        </View>
        <View style={{alignItems: 'center'}}>
          <View style={{flexDirection: 'row', alignItems: 'baseline', gap: s(2)}}>
            <AppText style={{fontSize: ms(24), fontWeight: '800', color: Colors.primary, lineHeight: ms(26)}}>68.4</AppText>
            <AppText style={{fontSize: ms(10), color: Colors.textTertiary}}>kg</AppText>
          </View>
          <AppText variant="small" color={Colors.textTertiary}>BMI 25.7</AppText>
        </View>
        <TouchableOpacity style={st.confirmBtn} activeOpacity={0.7}>
          <AppText variant="small" color={Colors.tealText} style={{fontWeight: '600'}}>Import</AppText>
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
        <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>Auto-import weight readings - 48 readings</AppText>
      </View>
      <View style={{alignItems: 'flex-end', flexShrink: 0}}>
        <View style={[st.statusBadge, {backgroundColor: Colors.tealBg}]}>
          <AppText variant="subtext" color={Colors.tealText} style={{fontWeight: '700'}}>Active</AppText>
        </View>
        <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(4)}}>Auto</AppText>
      </View>
    </View>

    {/* Google Fit */}
    <View style={[st.deviceRow, {opacity: 0.7}]}>
      <View style={[st.deviceIcon, {backgroundColor: Colors.background}]}>
        <Icon family="Ionicons" name="logo-google" size={ms(18)} color={Colors.blue} />
      </View>
      <View style={{flex: 1, minWidth: 0}}>
        <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>Google Fit</AppText>
        <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>Import weight history from Android</AppText>
      </View>
      <TouchableOpacity style={st.connectBtn} activeOpacity={0.7}>
        <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>Connect</AppText>
      </TouchableOpacity>
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
  connectBtn: {backgroundColor: Colors.background, paddingHorizontal: s(9), paddingVertical: vs(4), borderRadius: ms(8), borderWidth: 0.5, borderColor: '#d4e2db', flexShrink: 0},
});

export default WeightDeviceSync;
