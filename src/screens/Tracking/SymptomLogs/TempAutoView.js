import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

// ── Device data ──
const DEVICES = [
  {id: 'withings', icon: 'thermometer-outline', name: 'Withings Thermo', sub: 'Temporal artery - Wi-Fi - 4s reading', status: 'Linked - Last: 36.9\u00B0C', statusBg: Colors.tealBg, statusColor: Colors.tealText},
  {id: 'apple', icon: 'watch-outline', name: 'Apple Watch', sub: 'Wrist skin temp - continuous overnight', status: '36 readings synced', statusBg: Colors.tealBg, statusColor: Colors.tealText},
  {id: 'omron', icon: 'ear-outline', name: 'Omron MC-720', sub: 'Ear (tympanic) - Bluetooth - 1s reading', status: 'Connect', statusBg: Colors.amberBg, statusColor: Colors.amberText},
  {id: 'ihealth', icon: 'scan-outline', name: 'iHealth No-Touch', sub: 'Forehead infrared - Bluetooth - instant', status: 'Not connected', statusBg: '#f0f0f0', statusColor: Colors.textSecondary},
];

const WITHINGS_READINGS = [
  {date: 'Today 9:38', temp: '36.9\u00B0C', zone: 'Normal', method: 'Temporal', highlight: true},
  {date: '22 Mar 8:10', temp: '37.0\u00B0C', zone: 'Normal', method: 'Temporal', highlight: false},
  {date: '15 Mar 8:25', temp: '36.8\u00B0C', zone: 'Normal', method: 'Temporal', highlight: false},
  {date: '8 Mar 7:50', temp: '36.7\u00B0C', zone: 'Normal', method: 'Temporal', highlight: false},
];

const TempAutoView = ({unit = 'C'}) => {
  const [activeDevice, setActiveDevice] = useState('withings');

  return (
    <View>
      {/* Device source grid */}
      <View style={st.secLabel}>
        <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>Select device / source</AppText>
        <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
      </View>
      <View style={st.deviceGrid}>
        {DEVICES.map(dev => {
          const active = activeDevice === dev.id;
          return (
            <TouchableOpacity key={dev.id} style={[st.deviceCard, active && st.deviceCardActive]} onPress={() => setActiveDevice(dev.id)} activeOpacity={0.7}>
              <Icon family="Ionicons" name={dev.icon} size={ms(26)} color={active ? Colors.primary : Colors.textSecondary} />
              <AppText style={{fontSize: ms(12), fontWeight: '700', color: active ? Colors.primary : Colors.textPrimary, marginTop: vs(5)}}>{dev.name}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(14)}}>{dev.sub}</AppText>
              <View style={[st.statusBadge, {backgroundColor: dev.statusBg}]}>
                <AppText variant="subtext" color={dev.statusColor} style={{fontWeight: '600'}}>{dev.status}</AppText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Withings Panel ── */}
      {activeDevice === 'withings' && (
        <View>
          <View style={st.darkCard}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(8)}}>
              <View style={st.liveDot} />
              <AppText variant="small" color="rgba(255,255,255,0.4)">Withings Thermo - Temporal - Connected</AppText>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(16), marginBottom: vs(12)}}>
              <View style={{alignItems: 'center'}}>
                <AppText style={{fontSize: ms(52), fontWeight: '700', color: Colors.paleGreen, lineHeight: ms(54)}}>36.9</AppText>
                <AppText style={{fontSize: ms(13), color: 'rgba(255,255,255,0.5)', marginTop: vs(2)}}>{'\u00B0'}C</AppText>
              </View>
              <View style={{flex: 1}}>
                <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginBottom: vs(4)}}>Method: Temporal artery</AppText>
                <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginBottom: vs(4)}}>Scanned: 9:38 AM today</AppText>
                <AppText variant="small" color="rgba(255,255,255,0.5)">Accuracy: {'\u00B1'}0.1{'\u00B0'}C (FDA cleared)</AppText>
              </View>
            </View>
            {/* 3-metric grid */}
            <View style={st.metricGrid}>
              <View style={st.metricCell}><AppText style={{fontSize: ms(16), fontWeight: '700', color: Colors.paleGreen}}>36.9</AppText><AppText style={st.metricLabel}>Current {'\u00B0'}C</AppText></View>
              <View style={st.metricCell}><AppText style={{fontSize: ms(16), fontWeight: '700', color: Colors.paleGreen}}>36.8</AppText><AppText style={st.metricLabel}>7-day avg</AppText></View>
              <View style={st.metricCell}><AppText style={{fontSize: ms(16), fontWeight: '700', color: Colors.paleGreen}}>Normal</AppText><AppText style={st.metricLabel}>Zone</AppText></View>
            </View>
            <View style={{flexDirection: 'row', gap: s(8), marginTop: vs(12)}}>
              <TouchableOpacity style={st.importBtn} activeOpacity={0.7}>
                <AppText style={{fontSize: ms(13), fontWeight: '700', color: Colors.white}}>Import this reading</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={st.rescanBtn} activeOpacity={0.7}>
                <Icon family="Ionicons" name="refresh-outline" size={ms(16)} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Recent Withings readings */}
          <View style={st.card}>
            <AppText style={{fontSize: ms(11), fontWeight: '700', color: Colors.textPrimary, marginBottom: vs(8)}}>Recent Withings readings</AppText>
            <View style={st.tableHdr}>
              <AppText style={[st.tCol, {flex: 2}]}>Date/time</AppText>
              <AppText style={[st.tCol, {flex: 1, textAlign: 'center'}]}>Temp</AppText>
              <AppText style={[st.tCol, {flex: 1, textAlign: 'center'}]}>Zone</AppText>
              <AppText style={[st.tCol, {flex: 1, textAlign: 'center'}]}>Method</AppText>
            </View>
            {WITHINGS_READINGS.map((r, i) => (
              <View key={i} style={[st.tableRow, r.highlight && st.tableRowHL, i < WITHINGS_READINGS.length - 1 && st.tableRowBorder]}>
                <AppText style={{flex: 2, fontSize: ms(10), color: r.highlight ? Colors.primary : Colors.textSecondary, fontWeight: r.highlight ? '700' : '400'}}>{r.date}</AppText>
                <AppText style={{flex: 1, fontSize: ms(11), fontWeight: '600', textAlign: 'center', color: Colors.textPrimary}}>{r.temp}</AppText>
                <AppText style={{flex: 1, fontSize: ms(9), textAlign: 'center', color: Colors.tealText}}>{r.zone}</AppText>
                <AppText style={{flex: 1, fontSize: ms(9), textAlign: 'center', color: Colors.textTertiary}}>{r.method}</AppText>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ── Apple Watch Panel ── */}
      {activeDevice === 'apple' && (
        <View>
          <View style={st.darkCard}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(8)}}>
              <View style={st.liveDot} />
              <AppText variant="small" color="rgba(255,255,255,0.4)">Apple Watch - Wrist skin temp - Syncing</AppText>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(16), marginBottom: vs(12)}}>
              <View style={{alignItems: 'center'}}>
                <AppText style={{fontSize: ms(52), fontWeight: '700', color: Colors.paleGreen, lineHeight: ms(54)}}>36.1</AppText>
                <AppText style={{fontSize: ms(13), color: 'rgba(255,255,255,0.5)', marginTop: vs(2)}}>{'\u00B0'}C - Wrist</AppText>
              </View>
              <View style={{flex: 1}}>
                <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginBottom: vs(4)}}>Method: Wrist skin temp</AppText>
                <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginBottom: vs(4)}}>Best for: overnight baseline trend</AppText>
                <AppText variant="small" color="rgba(255,255,255,0.5)">Note: Add +0.8{'\u00B0'}C for oral equivalent</AppText>
              </View>
            </View>
            <View style={{backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: ms(10), padding: ms(9), marginBottom: vs(12)}}>
              <AppText variant="small" color="rgba(255,255,255,0.7)" style={{lineHeight: ms(16)}}>
                Wrist temp (36.1{'\u00B0'}C) is ~0.8{'\u00B0'}C lower than oral equivalent (36.9{'\u00B0'}C). Apple Watch skin temperature is best used for tracking relative changes over time, not absolute fever detection.
              </AppText>
            </View>
            <TouchableOpacity style={st.importBtn} activeOpacity={0.7}>
              <AppText style={{fontSize: ms(13), fontWeight: '700', color: Colors.white}}>Import this reading</AppText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── Other devices (connect) ── */}
      {(activeDevice === 'omron' || activeDevice === 'ihealth') && (
        <View>
          <View style={st.card}>
            <AppText style={{fontSize: ms(11), fontWeight: '700', color: Colors.textPrimary, marginBottom: vs(6)}}>Connect a thermometer</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{lineHeight: ms(16), marginBottom: vs(10)}}>
              TrustLife supports any Bluetooth thermometer that exports to Apple Health or Google Fit. Once connected, readings sync automatically after each measurement.
            </AppText>
            {[
              {icon: 'ear-outline', name: 'Omron MC-720', sub: 'Ear thermometer - Bluetooth - 1s'},
              {icon: 'scan-outline', name: 'iHealth No-Touch PT3', sub: 'Forehead IR - Bluetooth - instant'},
              {icon: 'thermometer-outline', name: 'Qardio Temp', sub: 'Smart oral/axillary - Bluetooth'},
            ].map((d, i) => (
              <View key={i} style={[st.connectRow, i < 2 && {borderBottomWidth: 0.5, borderBottomColor: '#edf2ef'}]}>
                <Icon family="Ionicons" name={d.icon} size={ms(20)} color={Colors.textSecondary} />
                <View style={{flex: 1, marginLeft: s(10)}}>
                  <AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.textPrimary}}>{d.name}</AppText>
                  <AppText variant="small" color={Colors.textSecondary}>{d.sub}</AppText>
                </View>
                <AppText style={{fontSize: ms(11), fontWeight: '600', color: Colors.primary}}>Connect</AppText>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

const st = StyleSheet.create({
  secLabel: {flexDirection: 'row', alignItems: 'center', marginTop: vs(4), marginBottom: vs(8)},
  deviceGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8), marginBottom: vs(10)},
  deviceCard: {width: '47%', flexGrow: 1, backgroundColor: Colors.white, borderRadius: ms(13), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(11), alignItems: 'center'},
  deviceCardActive: {borderColor: Colors.primary, borderWidth: 1.5, backgroundColor: Colors.tealBg},
  statusBadge: {paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(10), marginTop: vs(5)},
  darkCard: {backgroundColor: '#0d1220', borderRadius: ms(14), padding: ms(16), marginBottom: vs(10)},
  liveDot: {width: ms(7), height: ms(7), borderRadius: ms(4), backgroundColor: Colors.accent},
  metricGrid: {flexDirection: 'row', gap: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: ms(10), overflow: 'hidden'},
  metricCell: {flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', padding: ms(9), alignItems: 'center'},
  metricLabel: {fontSize: ms(8), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, color: 'rgba(255,255,255,0.35)', marginTop: vs(3)},
  importBtn: {flex: 1, backgroundColor: Colors.accent, borderRadius: ms(11), paddingVertical: vs(13), alignItems: 'center'},
  rescanBtn: {backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: ms(11), paddingHorizontal: s(13), paddingVertical: vs(13), alignItems: 'center', justifyContent: 'center'},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(13), marginBottom: vs(10), overflow: 'hidden'},
  tableHdr: {flexDirection: 'row', paddingVertical: vs(7), backgroundColor: Colors.background, borderRadius: ms(6), paddingHorizontal: s(6), marginBottom: vs(2)},
  tCol: {fontSize: ms(9), fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase'},
  tableRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(9), paddingHorizontal: s(6)},
  tableRowHL: {backgroundColor: '#fafcfb', borderRadius: ms(6)},
  tableRowBorder: {borderBottomWidth: 0.5, borderBottomColor: '#edf2ef'},
  connectRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(12)},
});

export default TempAutoView;
