import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const DETECT_DEVICES = [
  {id: 'apple', icon: 'watch-outline', name: 'Apple Watch', sub: 'HRV - Wrist temp - HR - SpO2 - Sleep', status: 'Detecting - 42 readings', statusBg: Colors.tealBg, statusColor: Colors.tealText},
  {id: 'embrace', icon: 'hand-left-outline', name: 'Empatica Embrace2', sub: 'FDA-cleared - EDA - autonomic detection', status: 'Linked - Monitoring', statusBg: Colors.tealBg, statusColor: Colors.tealText},
  {id: 'withings', icon: 'watch-outline', name: 'Withings ScanWatch', sub: 'ECG - HRV - SpO2 - sleep stages', status: 'Connect', statusBg: Colors.amberBg, statusColor: Colors.amberText},
  {id: 'samsung', icon: 'phone-portrait-outline', name: 'Samsung Galaxy Watch', sub: 'BioActive sensor - HR - HRV - skin temp', status: 'Connect', statusBg: Colors.amberBg, statusColor: Colors.amberText},
];

const TREAT_DEVICES = [
  {id: 'cefaly', icon: 'flash-outline', name: 'Cefaly Dual', sub: 'eTNS neurostimulation - Acute & prevention', status: 'Linked - Session ready', statusBg: Colors.tealBg, statusColor: Colors.tealText},
  {id: 'nerivio', icon: 'radio-outline', name: 'Nerivio', sub: 'Remote electrical neuromodulation - arm', status: '3 sessions remaining', statusBg: Colors.tealBg, statusColor: Colors.tealText},
  {id: 'gammacore', icon: 'pulse-outline', name: 'gammaCore Sapphire', sub: 'Non-invasive vagus nerve stimulation', status: 'Connect', statusBg: Colors.amberBg, statusColor: Colors.amberText},
  {id: 'headspace', icon: 'cloudy-outline', name: 'Headspace', sub: 'Stress data - Mindfulness streak', status: 'Connect', statusBg: Colors.amberBg, statusColor: Colors.amberText},
];

const CEFALY_SESSIONS = [
  {date: '25 Mar', mode: 'Acute', dur: '60 min', relief: 'Good', reliefBg: Colors.tealBg, reliefColor: Colors.tealText, hl: true},
  {date: '24 Mar', mode: 'Prev.', dur: '20 min', relief: 'Routine', reliefBg: '#f0f0f0', reliefColor: '#555', hl: false},
  {date: '23 Mar', mode: 'Prev.', dur: '20 min', relief: 'Routine', reliefBg: '#f0f0f0', reliefColor: '#555', hl: false},
];

const MigraineAutoView = () => {
  const [activeDevice, setActiveDevice] = useState('apple');

  const DeviceGrid = ({devices, title}) => (
    <View>
      <View style={st.secLabel}>
        <AppText variant="small" color={Colors.textSecondary} style={st.secText}>{title}</AppText>
        <View style={st.secLine} />
      </View>
      <View style={st.deviceGrid}>
        {devices.map(dev => {
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
    </View>
  );

  return (
    <View>
      <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(8), lineHeight: ms(16)}}>These devices continuously monitor physiological signals - HRV, skin temp, autonomic activity - and can automatically detect a migraine in progress or predict one 30-60 minutes before onset.</AppText>

      <DeviceGrid devices={DETECT_DEVICES} title="Auto detection - Wearables" />
      <DeviceGrid devices={TREAT_DEVICES} title="Treatment devices" />

      {/* Apple Watch panel */}
      {activeDevice === 'apple' && (
        <View style={st.darkCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(10)}}>
            <View style={st.liveDot} />
            <AppText variant="small" color="rgba(255,255,255,0.4)">Apple Watch - Continuous monitoring - Today</AppText>
          </View>
          <View style={{backgroundColor: 'rgba(220,38,38,0.2)', borderRadius: ms(10), padding: ms(10), marginBottom: vs(10), flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
            <Icon family="Ionicons" name="warning-outline" size={ms(20)} color="#FCA5A5" />
            <View style={{flex: 1}}>
              <AppText style={{fontSize: ms(11), fontWeight: '700', color: '#FCA5A5', marginBottom: vs(2)}}>Pre-migraine signals detected - 9:18 AM</AppText>
              <AppText style={{fontSize: ms(10), color: 'rgba(255,255,255,0.6)', lineHeight: ms(15)}}>HRV dropped to 22ms (baseline 35ms) - HR elevated 88 bpm - 5.1h sleep last night</AppText>
            </View>
          </View>
          <View style={st.metricGrid}>
            <View style={st.metricCell}><AppText style={{fontSize: ms(16), fontWeight: '700', color: '#FCA5A5'}}>88</AppText><AppText style={st.metricLabel}>HR bpm</AppText></View>
            <View style={st.metricCell}><AppText style={{fontSize: ms(16), fontWeight: '700', color: '#FCA5A5'}}>22ms</AppText><AppText style={st.metricLabel}>HRV</AppText></View>
            <View style={st.metricCell}><AppText style={{fontSize: ms(16), fontWeight: '700', color: '#FCA5A5'}}>36.4</AppText><AppText style={st.metricLabel}>Wrist {'\u00B0'}C</AppText></View>
          </View>
          <View style={{flexDirection: 'row', gap: s(8), marginTop: vs(12)}}>
            <View style={{flex: 1, flexDirection: 'row', gap: s(8)}}>
              <View style={st.propCard}><AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', marginBottom: vs(3)}}>SpO2</AppText><AppText style={{fontSize: ms(18), fontWeight: '700', color: '#9FE1CB'}}>97%</AppText></View>
              <View style={st.propCard}><AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', marginBottom: vs(3)}}>Sleep last night</AppText><AppText style={{fontSize: ms(18), fontWeight: '700', color: '#FCA5A5'}}>5.1h</AppText></View>
            </View>
          </View>
          <View style={{flexDirection: 'row', gap: s(8), marginTop: vs(12)}}>
            <TouchableOpacity style={st.importBtn} activeOpacity={0.7}>
              <AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.white}}>Import to log</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={st.rescanBtn} activeOpacity={0.7}>
              <Icon family="Ionicons" name="refresh-outline" size={ms(16)} color="rgba(255,255,255,0.7)" />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Embrace2 panel */}
      {activeDevice === 'embrace' && (
        <View style={st.darkCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(10)}}>
            <View style={st.liveDot} />
            <AppText variant="small" color="rgba(255,255,255,0.4)">Empatica Embrace2 - EDA - Continuous - FDA-cleared</AppText>
          </View>
          <View style={st.metricGrid}>
            <View style={st.metricCell}><AppText style={{fontSize: ms(14), fontWeight: '700', color: '#9FE1CB'}}>Normal</AppText><AppText style={st.metricLabel}>EDA now</AppText></View>
            <View style={st.metricCell}><AppText style={{fontSize: ms(14), fontWeight: '700', color: Colors.paleGreen}}>36.1{'\u00B0'}C</AppText><AppText style={st.metricLabel}>Skin temp</AppText></View>
            <View style={st.metricCell}><AppText style={{fontSize: ms(14), fontWeight: '700', color: '#9FE1CB'}}>76 bpm</AppText><AppText style={st.metricLabel}>HR</AppText></View>
          </View>
          <TouchableOpacity style={[st.importBtn, {marginTop: vs(12)}]} activeOpacity={0.7}>
            <AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.white}}>Sync Embrace2 data</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* Cefaly panel */}
      {activeDevice === 'cefaly' && (
        <View>
          <View style={st.darkCard}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(10)}}>
              <View style={st.liveDot} />
              <AppText variant="small" color="rgba(255,255,255,0.4)">Cefaly Dual - eTNS - Bluetooth connected</AppText>
            </View>
            <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
              <View style={st.propCard}><AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', marginBottom: vs(4)}}>Last acute session</AppText><AppText style={{fontSize: ms(20), fontWeight: '700', color: '#9FE1CB'}}>60 min</AppText><AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', marginTop: vs(2)}}>25 Mar 2026</AppText></View>
              <View style={st.propCard}><AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', marginBottom: vs(4)}}>Prevention streak</AppText><AppText style={{fontSize: ms(20), fontWeight: '700', color: '#9FE1CB'}}>18 days</AppText><AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', marginTop: vs(2)}}>20 min/day</AppText></View>
            </View>
            <View style={{flexDirection: 'row', gap: s(8)}}>
              <TouchableOpacity style={st.importBtn} activeOpacity={0.7}>
                <AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.white}}>Start ACUTE session</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={st.rescanBtn} activeOpacity={0.7}>
                <Icon family="Ionicons" name="refresh-outline" size={ms(16)} color="rgba(255,255,255,0.7)" />
              </TouchableOpacity>
            </View>
          </View>
          {/* Recent Cefaly sessions */}
          <View style={st.card}>
            <AppText style={{fontSize: ms(11), fontWeight: '700', color: Colors.textPrimary, marginBottom: vs(8)}}>Recent Cefaly sessions</AppText>
            <View style={st.tableHdr}>
              <AppText style={[st.tCol, {flex: 2}]}>Date</AppText>
              <AppText style={[st.tCol, {flex: 1, textAlign: 'center'}]}>Mode</AppText>
              <AppText style={[st.tCol, {flex: 1, textAlign: 'center'}]}>Duration</AppText>
              <AppText style={[st.tCol, {flex: 1, textAlign: 'center'}]}>Relief</AppText>
            </View>
            {CEFALY_SESSIONS.map((r, i) => (
              <View key={i} style={[st.tableRow, r.hl && st.tableRowHL, i < CEFALY_SESSIONS.length - 1 && st.tableRowBorder]}>
                <AppText style={{flex: 2, fontSize: ms(10), color: r.hl ? Colors.primary : Colors.textSecondary, fontWeight: r.hl ? '700' : '400'}}>{r.date}</AppText>
                <AppText style={{flex: 1, fontSize: ms(9), textAlign: 'center', color: Colors.textSecondary}}>{r.mode}</AppText>
                <AppText style={{flex: 1, fontSize: ms(10), textAlign: 'center', fontWeight: '600'}}>{r.dur}</AppText>
                <View style={{flex: 1, alignItems: 'center'}}><View style={{backgroundColor: r.reliefBg, paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(10)}}><AppText style={{fontSize: ms(9), fontWeight: '700', color: r.reliefColor}}>{r.relief}</AppText></View></View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Nerivio panel */}
      {activeDevice === 'nerivio' && (
        <View style={st.darkCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(10)}}>
            <View style={st.liveDot} />
            <AppText variant="small" color="rgba(255,255,255,0.4)">Nerivio - REN device - Arm placement</AppText>
          </View>
          <View style={{backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: ms(10), padding: ms(12), marginBottom: vs(12)}}>
            <AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', marginBottom: vs(4)}}>Sessions remaining</AppText>
            <AppText style={{fontSize: ms(28), fontWeight: '700', color: '#9FE1CB', marginBottom: vs(4)}}>3 sessions</AppText>
            <View style={{height: ms(6), backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: ms(3), overflow: 'hidden'}}>
              <View style={{height: '100%', width: '25%', backgroundColor: '#9FE1CB', borderRadius: ms(3)}} />
            </View>
            <AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', marginTop: vs(4)}}>3 of 12 sessions remaining</AppText>
          </View>
          <TouchableOpacity style={st.importBtn} activeOpacity={0.7}>
            <AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.white}}>Start 45-min session</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* Connect panels */}
      {(activeDevice === 'withings' || activeDevice === 'samsung' || activeDevice === 'gammacore' || activeDevice === 'headspace') && (
        <View style={st.card}>
          <AppText style={{fontSize: ms(11), fontWeight: '700', color: Colors.textPrimary, marginBottom: vs(6)}}>
            Connect {activeDevice === 'withings' ? 'Withings ScanWatch' : activeDevice === 'samsung' ? 'Samsung Galaxy Watch' : activeDevice === 'gammacore' ? 'gammaCore Sapphire' : 'Headspace'}
          </AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{lineHeight: ms(16), marginBottom: vs(12)}}>
            {activeDevice === 'gammacore' ? 'gammaCore Sapphire is a non-invasive vagus nerve stimulator (nVNS) applied to the neck. FDA-cleared for acute treatment of migraine and cluster headache.' :
             activeDevice === 'headspace' ? 'Headspace integration allows TrustLife to correlate your stress and mindfulness streak with migraine frequency.' :
             'TrustLife can correlate physiological signals from this device with your migraine diary to identify personal pre-migraine patterns.'}
          </AppText>
          <TouchableOpacity style={[st.importBtn, {backgroundColor: Colors.primary}]} activeOpacity={0.7}>
            <AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.white}}>Connect</AppText>
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const st = StyleSheet.create({
  secLabel: {flexDirection: 'row', alignItems: 'center', marginTop: vs(4), marginBottom: vs(8)},
  secText: {textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'},
  deviceGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8), marginBottom: vs(6)},
  deviceCard: {width: '47%', flexGrow: 1, backgroundColor: Colors.white, borderRadius: ms(13), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(11), alignItems: 'center'},
  deviceCardActive: {borderColor: Colors.primary, borderWidth: 1.5, backgroundColor: '#f4faf8'},
  statusBadge: {paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(10), marginTop: vs(5)},
  darkCard: {backgroundColor: '#0d1220', borderRadius: ms(14), padding: ms(16), marginBottom: vs(10)},
  liveDot: {width: ms(7), height: ms(7), borderRadius: ms(4), backgroundColor: '#9FE1CB'},
  metricGrid: {flexDirection: 'row', gap: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: ms(10), overflow: 'hidden'},
  metricCell: {flex: 1, backgroundColor: 'rgba(0,0,0,0.25)', padding: ms(9), alignItems: 'center'},
  metricLabel: {fontSize: ms(8), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, color: 'rgba(255,255,255,0.35)', marginTop: vs(3)},
  propCard: {flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: ms(10), padding: ms(10), alignItems: 'center'},
  importBtn: {flex: 1, backgroundColor: '#1D9E75', borderRadius: ms(11), paddingVertical: vs(13), alignItems: 'center'},
  rescanBtn: {backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: ms(11), paddingHorizontal: s(13), paddingVertical: vs(13), alignItems: 'center', justifyContent: 'center'},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(13), marginBottom: vs(10), overflow: 'hidden'},
  tableHdr: {flexDirection: 'row', paddingVertical: vs(7), backgroundColor: '#f4faf8', borderRadius: ms(6), paddingHorizontal: s(6), marginBottom: vs(2)},
  tCol: {fontSize: ms(9), fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase'},
  tableRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(9), paddingHorizontal: s(6)},
  tableRowHL: {backgroundColor: '#fafcfb', borderRadius: ms(6)},
  tableRowBorder: {borderBottomWidth: 0.5, borderBottomColor: '#edf2ef'},
});

export default MigraineAutoView;
