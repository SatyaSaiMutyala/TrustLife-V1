import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const LABS = [
  {id: 'thyrocare', icon: 'business-outline', name: 'Thyrocare / TrustLab', sub: 'CBC - iron studies - B12 - auto-import', status: 'Last: 10 Jan 2026', statusBg: Colors.tealBg, statusColor: Colors.tealText},
  {id: 'lalpathlab', icon: 'flask-outline', name: 'Dr. Lal PathLabs', sub: 'API-linked - auto CBC sync', status: 'Connect', statusBg: Colors.amberBg, statusColor: Colors.amberText},
  {id: 'apollo', icon: 'medkit-outline', name: 'Apollo Diagnostics', sub: 'Full CBC + iron + B12 panel', status: 'Connect', statusBg: Colors.amberBg, statusColor: Colors.amberText},
  {id: 'abha', icon: 'shield-checkmark-outline', name: 'ABHA / NDHM', sub: 'National health records - all labs auto-linked', status: 'ABHA linked', statusBg: Colors.tealBg, statusColor: Colors.tealText},
];

const AnemiaAutoView = () => {
  const [activeLab, setActiveLab] = useState('thyrocare');

  return (
    <View>
      <View style={st.secLabel}><AppText variant="small" color={Colors.textSecondary} style={st.secText}>Connected lab & devices</AppText><View style={st.secLine} /></View>

      <View style={st.tipCard}>
        <AppText variant="subtext" color={Colors.primary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginBottom: vs(7)}}>About lab import</AppText>
        <AppText variant="small" color={Colors.textSecondary} style={{lineHeight: ms(16)}}>When a Complete Blood Count (CBC) is ordered, TrustLife automatically imports your haemoglobin, haematocrit, MCV, ferritin, B12, and other anaemia markers directly from your lab.</AppText>
      </View>

      <View style={st.deviceGrid}>
        {LABS.map(lab => {
          const active = activeLab === lab.id;
          return (
            <TouchableOpacity key={lab.id} style={[st.deviceCard, active && st.deviceCardActive]} onPress={() => setActiveLab(lab.id)} activeOpacity={0.7}>
              <Icon family="Ionicons" name={lab.icon} size={ms(24)} color={active ? Colors.primary : Colors.textSecondary} />
              <AppText style={{fontSize: ms(11), fontWeight: '700', color: active ? Colors.primary : Colors.textPrimary, marginTop: vs(4)}}>{lab.name}</AppText>
              <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginTop: vs(2), lineHeight: ms(13), textAlign: 'center'}}>{lab.sub}</AppText>
              <View style={[st.statusBadge, {backgroundColor: lab.statusBg}]}>
                <AppText style={{fontSize: ms(9), fontWeight: '600', color: lab.statusColor}}>{lab.status}</AppText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Thyrocare panel */}
      {activeLab === 'thyrocare' && (
        <View style={st.darkCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(10)}}>
            <View style={st.liveDot} />
            <AppText variant="small" color="rgba(255,255,255,0.4)">Thyrocare - CBC + Iron Panel - 10 Jan 2026</AppText>
          </View>
          <View style={{alignItems: 'center', marginBottom: vs(12)}}>
            <AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(4)}}>Haemoglobin</AppText>
            <AppText style={{fontSize: ms(52), fontWeight: '800', color: '#FCA5A5', lineHeight: ms(54)}}>11.8</AppText>
            <AppText style={{fontSize: ms(13), color: 'rgba(255,255,255,0.5)'}}>g/dL - Mild anaemia - Normal {'\u2265'}12.0</AppText>
          </View>
          <View style={st.metricGrid}>
            <View style={st.metricCell}><AppText style={{fontSize: ms(14), fontWeight: '700', color: '#FCA5A5'}}>11.8</AppText><AppText style={st.metricLabel}>Hb g/dL</AppText></View>
            <View style={st.metricCell}><AppText style={{fontSize: ms(14), fontWeight: '700', color: '#FCA5A5'}}>35.4%</AppText><AppText style={st.metricLabel}>Haematocrit</AppText></View>
            <View style={st.metricCell}><AppText style={{fontSize: ms(14), fontWeight: '700', color: '#FCA5A5'}}>74 fL</AppText><AppText style={st.metricLabel}>MCV (Iron)</AppText></View>
            <View style={st.metricCell}><AppText style={{fontSize: ms(14), fontWeight: '700', color: '#FCA5A5'}}>8 {'\u03BC'}g/L</AppText><AppText style={st.metricLabel}>Ferritin</AppText></View>
            <View style={st.metricCell}><AppText style={{fontSize: ms(14), fontWeight: '700', color: '#FCA5A5'}}>312</AppText><AppText style={st.metricLabel}>B12 pg/mL</AppText></View>
            <View style={st.metricCell}><AppText style={{fontSize: ms(14), fontWeight: '700', color: Colors.paleGreen}}>2.1 mIU</AppText><AppText style={st.metricLabel}>Folate</AppText></View>
          </View>
          <View style={{backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: ms(10), padding: ms(10), marginVertical: vs(12)}}>
            <AppText style={{fontSize: ms(10), color: 'rgba(255,255,255,0.7)', lineHeight: ms(16)}}>Microcytic anaemia pattern (low MCV 74 fL + ferritin 8) confirms iron deficiency as primary cause. B12 312 pg/mL is borderline - monitor given Metformin use.</AppText>
          </View>
          <TouchableOpacity style={st.importBtn} activeOpacity={0.7}>
            <AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.white}}>Import to Anaemia Records</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* ABHA panel */}
      {activeLab === 'abha' && (
        <View style={st.darkCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(10)}}>
            <View style={st.liveDot} />
            <AppText variant="small" color="rgba(255,255,255,0.4)">ABHA - National Digital Health Mission - Linked</AppText>
          </View>
          <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
            <View style={st.propCard}><AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', marginBottom: vs(3)}}>Reports linked</AppText><AppText style={{fontSize: ms(20), fontWeight: '700', color: '#FCA5A5'}}>14</AppText></View>
            <View style={st.propCard}><AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.4)', marginBottom: vs(3)}}>Last CBC</AppText><AppText style={{fontSize: ms(14), fontWeight: '700', color: '#FCA5A5'}}>10 Jan 26</AppText></View>
          </View>
          <TouchableOpacity style={st.importBtn} activeOpacity={0.7}>
            <AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.white}}>Sync ABHA records now</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* Connect panels */}
      {(activeLab === 'lalpathlab' || activeLab === 'apollo') && (
        <View style={st.card}>
          <AppText style={{fontSize: ms(11), fontWeight: '700', color: Colors.textPrimary, marginBottom: vs(6)}}>
            Connect {activeLab === 'lalpathlab' ? 'Dr. Lal PathLabs' : 'Apollo Diagnostics'}
          </AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{lineHeight: ms(16), marginBottom: vs(12)}}>
            Link your account to automatically import CBC, iron studies, and anaemia markers whenever a new report is available.
          </AppText>
          <TouchableOpacity style={st.importBtn} activeOpacity={0.7}>
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
  tipCard: {backgroundColor: Colors.background, borderRadius: ms(13), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(11), marginBottom: vs(12)},
  deviceGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8), marginBottom: vs(10)},
  deviceCard: {width: '47%', flexGrow: 1, backgroundColor: Colors.white, borderRadius: ms(13), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(10), alignItems: 'center'},
  deviceCardActive: {borderColor: Colors.primary, borderWidth: 1.5, backgroundColor: Colors.tealBg},
  statusBadge: {paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(10), marginTop: vs(5)},
  darkCard: {backgroundColor: '#0d1220', borderRadius: ms(14), padding: ms(16), marginBottom: vs(10)},
  liveDot: {width: ms(7), height: ms(7), borderRadius: ms(4), backgroundColor: Colors.accent},
  metricGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: ms(10), overflow: 'hidden'},
  metricCell: {width: '33%', flexGrow: 1, backgroundColor: 'rgba(0,0,0,0.25)', padding: ms(8), alignItems: 'center'},
  metricLabel: {fontSize: ms(7), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, color: 'rgba(255,255,255,0.35)', marginTop: vs(2)},
  propCard: {flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: ms(10), padding: ms(10), alignItems: 'center'},
  importBtn: {backgroundColor: Colors.accent, borderRadius: ms(11), paddingVertical: vs(13), alignItems: 'center'},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(13), marginBottom: vs(10)},
});

export default AnemiaAutoView;
