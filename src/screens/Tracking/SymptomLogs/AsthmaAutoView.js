import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const DEVICES = [
  {id: 'smart', icon: 'fitness-outline', name: 'Smart Peak Flow', sub: 'Nuvoair - Bluetooth - Digital spirometer', status: 'Linked - Last: 335 L/min', statusBg: Colors.tealBg, statusColor: Colors.tealText},
  {id: 'propeller', icon: 'medkit-outline', name: 'Propeller Health', sub: 'Inhaler sensor - Tracks rescue & preventer use', status: 'Synced - 28 Mar', statusBg: Colors.tealBg, statusColor: Colors.tealText},
  {id: 'airnext', icon: 'flask-outline', name: 'Air Next (Filt\'Air)', sub: 'Bluetooth spirometer - FEV1 + PEF + FVC', status: 'Connect', statusBg: Colors.amberBg, statusColor: Colors.amberText},
  {id: 'apple', icon: 'heart-outline', name: 'Apple Health', sub: 'Respiratory rate - Heart rate - HRV sync', status: '48 readings', statusBg: Colors.tealBg, statusColor: Colors.tealText},
];

const NUVOAIR_READINGS = [
  {date: 'Today 9:38', pef: '335', zone: 'G', fev1: '2.1L', hl: true},
  {date: '26 Mar eve', pef: '328', zone: 'G', fev1: '2.0L', hl: false},
  {date: '24 Mar morn', pef: '310', zone: 'Y', fev1: '1.9L', hl: false},
  {date: '22 Mar morn', pef: '340', zone: 'G', fev1: '2.1L', hl: false},
];

const AsthmaAutoView = () => {
  const [activeDevice, setActiveDevice] = useState('smart');

  return (
    <View>
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

      {/* Smart Peak Flow panel */}
      {activeDevice === 'smart' && (
        <View>
          <View style={st.darkCard}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(10)}}>
              <View style={st.liveDot} />
              <AppText variant="small" color="rgba(255,255,255,0.4)">Nuvoair Smart Peak Flow - BT - Awaiting measurement</AppText>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(16), marginBottom: vs(12)}}>
              <View style={{alignItems: 'center'}}>
                <AppText style={{fontSize: ms(52), fontWeight: '700', color: Colors.paleGreen, lineHeight: ms(54)}}>335</AppText>
                <AppText style={{fontSize: ms(12), color: 'rgba(255,255,255,0.5)', marginTop: vs(2)}}>L/min - PEF</AppText>
              </View>
              <View style={{flex: 1}}>
                <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginBottom: vs(3)}}>Personal best: 380 L/min</AppText>
                <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginBottom: vs(3)}}>Zone: <AppText style={{color: Colors.paleGreen, fontWeight: '700'}}>Green (88%)</AppText></AppText>
                <AppText variant="small" color="rgba(255,255,255,0.5)">Last scan: 28 Mar - 9:38 AM</AppText>
              </View>
            </View>
            <View style={st.metricGrid}>
              <View style={st.metricCell}><AppText style={{fontSize: ms(16), fontWeight: '700', color: Colors.paleGreen}}>335</AppText><AppText style={st.metricLabel}>PEF L/min</AppText></View>
              <View style={st.metricCell}><AppText style={{fontSize: ms(16), fontWeight: '700', color: Colors.paleGreen}}>88%</AppText><AppText style={st.metricLabel}>Personal best</AppText></View>
              <View style={st.metricCell}><AppText style={{fontSize: ms(16), fontWeight: '700', color: Colors.paleGreen}}>2.1L</AppText><AppText style={st.metricLabel}>FEV1 est.</AppText></View>
            </View>
            <View style={{flexDirection: 'row', gap: s(8), marginTop: vs(12)}}>
              <TouchableOpacity style={st.importBtn} activeOpacity={0.7}>
                <AppText style={{fontSize: ms(13), fontWeight: '700', color: Colors.white}}>Import reading</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={st.rescanBtn} activeOpacity={0.7}>
                <AppText style={{fontSize: ms(13), color: 'rgba(255,255,255,0.7)'}}>Blow</AppText>
              </TouchableOpacity>
            </View>
          </View>
          {/* Recent Nuvoair readings */}
          <View style={st.card}>
            <AppText style={{fontSize: ms(11), fontWeight: '700', color: Colors.textPrimary, marginBottom: vs(8)}}>Recent Nuvoair readings</AppText>
            <View style={st.tableHdr}>
              <AppText style={[st.tCol, {flex: 2}]}>Date/time</AppText>
              <AppText style={[st.tCol, {flex: 1, textAlign: 'center'}]}>PEF</AppText>
              <AppText style={[st.tCol, {flex: 1, textAlign: 'center'}]}>Zone</AppText>
              <AppText style={[st.tCol, {flex: 1, textAlign: 'center'}]}>FEV1</AppText>
            </View>
            {NUVOAIR_READINGS.map((r, i) => (
              <View key={i} style={[st.tableRow, r.hl && st.tableRowHL, i < NUVOAIR_READINGS.length - 1 && st.tableRowBorder]}>
                <AppText style={{flex: 2, fontSize: ms(10), color: r.hl ? Colors.primary : Colors.textSecondary, fontWeight: r.hl ? '700' : '400'}}>{r.date}</AppText>
                <AppText style={{flex: 1, fontSize: ms(11), fontWeight: '600', textAlign: 'center', color: Colors.textPrimary}}>{r.pef}</AppText>
                <AppText style={{flex: 1, fontSize: ms(9), textAlign: 'center', color: r.zone === 'G' ? Colors.tealText : Colors.amberDark}}>{r.zone === 'G' ? 'Green' : 'Yellow'}</AppText>
                <AppText style={{flex: 1, fontSize: ms(9), textAlign: 'center', color: Colors.textTertiary}}>{r.fev1}</AppText>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Propeller panel */}
      {activeDevice === 'propeller' && (
        <View style={st.darkCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(10)}}>
            <View style={st.liveDot} />
            <AppText variant="small" color="rgba(255,255,255,0.4)">Propeller Health - Inhaler sensor - Synced</AppText>
          </View>
          <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
            <View style={st.propCard}><AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', marginBottom: vs(4)}}>Rescue uses today</AppText><AppText style={{fontSize: ms(28), fontWeight: '700', color: '#FAC775'}}>0</AppText><AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', marginTop: vs(2)}}>puffs</AppText></View>
            <View style={st.propCard}><AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', marginBottom: vs(4)}}>This week</AppText><AppText style={{fontSize: ms(28), fontWeight: '700', color: '#FAC775'}}>4</AppText><AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', marginTop: vs(2)}}>puffs total</AppText></View>
          </View>
          <View style={{backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: ms(10), padding: ms(10), marginBottom: vs(12)}}>
            <AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(6)}}>Preventer adherence - Fluticasone 125mcg</AppText>
            <View style={{height: ms(6), backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: ms(3), overflow: 'hidden'}}>
              <View style={{height: '100%', width: '86%', backgroundColor: Colors.paleGreen, borderRadius: ms(3)}} />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(4)}}>
              <AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)'}}>86% adherence - last 30 days</AppText>
              <AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)'}}>Target: {'\u2265'}80%</AppText>
            </View>
          </View>
          <TouchableOpacity style={st.importBtn} activeOpacity={0.7}>
            <AppText style={{fontSize: ms(13), fontWeight: '700', color: Colors.white}}>Sync inhaler data</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* Connect panel */}
      {(activeDevice === 'airnext' || activeDevice === 'apple') && (
        <View style={st.card}>
          <AppText style={{fontSize: ms(11), fontWeight: '700', color: Colors.textPrimary, marginBottom: vs(6)}}>Connect a spirometer</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{lineHeight: ms(16), marginBottom: vs(10)}}>
            TrustLife supports any Bluetooth spirometer or inhaler sensor that exports to Apple Health or Google Fit.
          </AppText>
          {[
            {icon: 'flask-outline', name: 'Air Next - Filt\'Air', sub: 'Bluetooth - FEV1 + PEF + FVC - Clinical grade'},
            {icon: 'heart-outline', name: 'Apple Health', sub: 'Respiratory rate - SpO2 - HRV import'},
            {icon: 'logo-google', name: 'Google Fit', sub: 'Android - respiratory metrics'},
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
  rescanBtn: {backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: ms(11), paddingHorizontal: s(16), paddingVertical: vs(13), alignItems: 'center', justifyContent: 'center'},
  propCard: {flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: ms(10), padding: ms(12), alignItems: 'center'},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(13), marginBottom: vs(10), overflow: 'hidden'},
  tableHdr: {flexDirection: 'row', paddingVertical: vs(7), backgroundColor: Colors.background, borderRadius: ms(6), paddingHorizontal: s(6), marginBottom: vs(2)},
  tCol: {fontSize: ms(9), fontWeight: '700', color: Colors.textSecondary, textTransform: 'uppercase'},
  tableRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(9), paddingHorizontal: s(6)},
  tableRowHL: {backgroundColor: '#fafcfb', borderRadius: ms(6)},
  tableRowBorder: {borderBottomWidth: 0.5, borderBottomColor: '#edf2ef'},
  connectRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(12)},
});

export default AsthmaAutoView;
