import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Modal, Pressable} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const AnemiaManualView = ({mode, fatigue, setFatigue, fatigueColors, fatigueLabels}) => {
  const [numpadVisible, setNumpadVisible] = useState(false);
  const [numpadVal, setNumpadVal] = useState('');
  const [hbValue, setHbValue] = useState(null);

  const fatBg = fatigue > 6 ? Colors.redBg : fatigue > 3 ? Colors.amberBg : Colors.tealBg;
  const fatColor = fatigue > 6 ? Colors.redDark : fatigue > 3 ? Colors.amberDark : Colors.tealText;

  const getHbStatus = (v) => {
    if (v >= 12) return {color: Colors.primary, text: 'Normal (\u226512.0 g/dL)'};
    if (v >= 10) return {color: Colors.red, text: 'Mild anaemia (10.0-11.9 g/dL)'};
    if (v >= 8) return {color: '#c0392b', text: 'Moderate anaemia (8.0-9.9 g/dL)'};
    return {color: Colors.redDark, text: 'Severe anaemia (<8.0 g/dL) - Seek care'};
  };

  const npPress = (d) => setNumpadVal(prev => { if (d === '.' && prev.includes('.')) return prev; if (prev.length >= 5) return prev; return prev + d; });
  const npDel = () => setNumpadVal(prev => prev.slice(0, -1));
  const npConfirm = () => {
    const val = parseFloat(numpadVal);
    if (!isNaN(val) && val > 0 && val <= 20) setHbValue(val);
    setNumpadVisible(false);
  };

  return (
    <View>
      {mode === 'manual' && (
        <View>
          {/* Best practice card */}
          <View style={st.tipCard}>
            <AppText variant="subtext" color={Colors.primary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginBottom: vs(7)}}>About this log</AppText>
            {[
              {text: 'Track symptoms daily \u2013 fatigue, pallor, and breathlessness are the earliest signs of worsening anaemia, often before Hb falls measurably.', ok: true},
              {text: 'Check inner eyelid colour \u2013 gently pull down lower eyelid. Pale pink or white = likely anaemia. Use the Eye scan tab for an AI reading.', ok: true},
              {text: 'Metformin reduces B12 absorption \u2013 Priya\'s T2DM medication is a common cause of B12-deficiency anaemia. Annual B12 test is essential.', ok: false},
            ].map((tip, i) => (
              <View key={i} style={{flexDirection: 'row', alignItems: 'flex-start', gap: s(8), marginBottom: vs(5)}}>
                <View style={[st.tipDot, {backgroundColor: tip.ok ? Colors.tealBg : Colors.amberBg}]}>
                  {tip.ok ? <Icon family="Ionicons" name="checkmark" size={ms(9)} color={Colors.tealText} /> : <AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.amberDark}}>!</AppText>}
                </View>
                <AppText variant="small" color={tip.ok ? Colors.textPrimary : Colors.textSecondary} style={{flex: 1, lineHeight: ms(16)}}>{tip.text}</AppText>
              </View>
            ))}
          </View>

          {/* Fatigue scale */}
          <View style={st.secLabel}><AppText variant="small" color={Colors.textSecondary} style={st.secText}>Fatigue level today</AppText><View style={st.secLine} /></View>
          <View style={{flexDirection: 'row', gap: ms(3), marginBottom: vs(6)}}>
            {Array.from({length: 11}, (_, i) => {
              const isOn = i <= fatigue;
              return (
                <TouchableOpacity key={i} style={[st.fatBtn, isOn && {backgroundColor: fatigueColors[fatigue], borderColor: fatigueColors[fatigue]}]} onPress={() => setFatigue(i)} activeOpacity={0.7}>
                  <AppText style={{fontSize: ms(11), fontWeight: '800', color: isOn ? '#fff' : Colors.textSecondary}}>{i}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={[st.fatDesc, {backgroundColor: fatBg}]}>
            <AppText style={{fontSize: ms(11), color: fatColor, textAlign: 'center'}}>{fatigue}/10 - {fatigueLabels[fatigue]}</AppText>
          </View>

          {/* Hb entry */}
          <View style={st.secLabel}><AppText variant="small" color={Colors.textSecondary} style={st.secText}>Haemoglobin reading</AppText><View style={st.secLine} /></View>
          <TouchableOpacity style={st.hbBox} onPress={() => { setNumpadVal(''); setNumpadVisible(true); }} activeOpacity={0.6}>
            <AppText style={{fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: Colors.textSecondary, marginBottom: vs(6)}}>Haemoglobin - g/dL</AppText>
            <View style={{flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: s(4)}}>
              <AppText style={{fontSize: ms(72), fontWeight: '700', color: hbValue ? getHbStatus(hbValue).color : Colors.textTertiary, lineHeight: ms(74)}}>{hbValue ? hbValue.toFixed(1) : '\u2014'}</AppText>
              <AppText style={{fontSize: ms(16), color: Colors.textTertiary, fontWeight: '500'}}>g/dL</AppText>
            </View>
            <AppText style={{fontSize: ms(13), fontWeight: '700', color: hbValue ? getHbStatus(hbValue).color : Colors.textTertiary, marginTop: vs(6)}}>{hbValue ? getHbStatus(hbValue).text : 'Tap to enter haemoglobin value'}</AppText>
          </TouchableOpacity>

          {/* Lab name + date */}
          <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(10)}}>
            <View style={st.labField}><AppText style={st.labFieldLabel}>Lab / hospital name</AppText><View style={st.labFieldBox}><AppText variant="small" color={Colors.textSecondary}>e.g. Apollo, SRL, local lab</AppText></View></View>
            <View style={st.labField}><AppText style={st.labFieldLabel}>Test date</AppText><View style={st.labFieldBox}><AppText variant="small" color={Colors.textSecondary}>28 Mar 2026</AppText></View></View>
          </View>

          <View style={st.noteRow}>
            <Icon family="Ionicons" name="information-circle-outline" size={ms(13)} color={Colors.textTertiary} />
            <AppText variant="small" color={Colors.textSecondary} style={{flex: 1}}>This reading will be saved in Anaemia Records alongside your lab-imported and eye scan results, clearly marked as manually entered.</AppText>
          </View>
        </View>
      )}

      {mode === 'eye' && (
        <View>
          {/* Eye scan instructions */}
          <View style={st.secLabel}><AppText variant="small" color={Colors.textSecondary} style={st.secText}>Conjunctival pallor - AI scan</AppText><View style={st.secLine} /></View>
          <View style={st.tipCard}>
            <AppText variant="subtext" color={Colors.primary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginBottom: vs(7)}}>How to get an accurate scan</AppText>
            {[
              'Go to bright, natural light or a well-lit room',
              'Gently pull down lower eyelid to expose the red inner lining',
              'Hold phone 20-30 cm from eye, look up, take photo',
            ].map((step, i) => (
              <View key={i} style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(4)}}>
                <View style={{width: ms(18), height: ms(18), borderRadius: ms(9), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center'}}>
                  <AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.tealText}}>{i + 1}</AppText>
                </View>
                <AppText variant="small" color={Colors.textPrimary} style={{flex: 1}}>{step}</AppText>
              </View>
            ))}
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginTop: vs(2)}}>
              <View style={{width: ms(18), height: ms(18), borderRadius: ms(9), backgroundColor: Colors.amberBg, alignItems: 'center', justifyContent: 'center'}}>
                <AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.amberDark}}>!</AppText>
              </View>
              <AppText variant="small" color={Colors.textSecondary} style={{flex: 1}}>AI estimate is a screening tool only - confirm with lab Hb test</AppText>
            </View>
          </View>

          {/* Camera zone */}
          <TouchableOpacity style={st.cameraZone} activeOpacity={0.8}>
            <View style={st.viewfinder}>
              <View style={st.viewfinderOverlay}>
                <View style={st.ovalGuide}>
                  <View style={st.crosshair} />
                </View>
              </View>
              <AppText style={{position: 'absolute', bottom: vs(8), fontSize: ms(10), color: 'rgba(255,255,255,0.5)'}}>Align lower eyelid with oval guide</AppText>
            </View>
            <AppText style={{fontSize: ms(13), fontWeight: '700', color: Colors.white, marginTop: vs(8)}}>Tap to open camera</AppText>
            <AppText style={{fontSize: ms(10), color: 'rgba(255,255,255,0.6)', marginTop: vs(4)}}>Ensure good lighting - pull lower eyelid down</AppText>
          </TouchableOpacity>

          {/* Last scan result */}
          <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(8)}}>Last eye scan result - 15 Mar 2026</AppText>
          <View style={st.darkCard}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(10)}}>
              <View style={st.liveDot} />
              <AppText variant="small" color="rgba(255,255,255,0.45)">Eyenaemia AI - Conjunctival pallor analysis</AppText>
            </View>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(16), marginBottom: vs(12)}}>
              <View style={{alignItems: 'center'}}>
                <AppText style={{fontSize: ms(48), fontWeight: '700', color: '#FCA5A5', lineHeight: ms(50)}}>11.4</AppText>
                <AppText style={{fontSize: ms(12), color: 'rgba(255,255,255,0.5)', marginTop: vs(2)}}>g/dL est. Hb</AppText>
              </View>
              <View style={{flex: 1}}>
                <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginBottom: vs(3)}}>Confidence: <AppText style={{color: '#FCA5A5', fontWeight: '700'}}>82%</AppText></AppText>
                <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginBottom: vs(3)}}>Pallor grade: <AppText style={{color: '#FCA5A5', fontWeight: '700'}}>Mild</AppText></AppText>
                <AppText variant="small" color="rgba(255,255,255,0.5)">Lab Hb: 11.8 g/dL (10 Jan)</AppText>
              </View>
            </View>
            <View style={{backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: ms(10), padding: ms(10), marginBottom: vs(12)}}>
              <AppText style={{fontSize: ms(10), color: 'rgba(255,255,255,0.7)', lineHeight: ms(16)}}>Eye scan estimate (11.4 g/dL) is within 3.4% of the lab value (11.8 g/dL) - consistent with mild anaemia.</AppText>
            </View>
            <TouchableOpacity style={st.importBtn} activeOpacity={0.7}>
              <AppText style={{fontSize: ms(13), fontWeight: '700', color: Colors.white}}>Import this result</AppText>
            </TouchableOpacity>
          </View>

          {/* Eye scan apps */}
          <View style={st.secLabel}><AppText variant="small" color={Colors.textSecondary} style={st.secText}>Eye scan apps</AppText><View style={st.secLine} /></View>
          <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(8), marginBottom: vs(10)}}>
            {[
              {icon: 'eye-outline', name: 'Eyenaemia', sub: 'Conjunctival pallor - AI - \u00B11.2 g/dL', status: 'Linked', statusBg: Colors.tealBg, statusColor: Colors.tealText, active: true},
              {icon: 'flask-outline', name: 'AnemoCheck', sub: 'Conjunctival AI - validated', status: 'Connect', statusBg: Colors.amberBg, statusColor: Colors.amberText, active: false},
              {icon: 'radio-outline', name: 'HemaApp', sub: 'Phone flash + finger - non-invasive', status: 'Connect', statusBg: Colors.amberBg, statusColor: Colors.amberText, active: false},
              {icon: 'finger-print-outline', name: 'Flashback Health', sub: 'Fingernail bed colour - Hb est.', status: 'Connect', statusBg: Colors.amberBg, statusColor: Colors.amberText, active: false},
            ].map((app, i) => (
              <View key={i} style={[st.appCard, app.active && st.appCardActive]}>
                <Icon family="Ionicons" name={app.icon} size={ms(24)} color={app.active ? Colors.primary : Colors.textSecondary} />
                <AppText style={{fontSize: ms(11), fontWeight: '700', color: Colors.textPrimary, marginTop: vs(4)}}>{app.name}</AppText>
                <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginTop: vs(2), lineHeight: ms(13), textAlign: 'center'}}>{app.sub}</AppText>
                <View style={[st.statusBadge, {backgroundColor: app.statusBg}]}>
                  <AppText style={{fontSize: ms(9), fontWeight: '600', color: app.statusColor}}>{app.status}</AppText>
                </View>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* Numpad */}
      <Modal visible={numpadVisible} transparent animationType="slide" onRequestClose={() => setNumpadVisible(false)}>
        <Pressable style={st.numpadOverlay} onPress={() => setNumpadVisible(false)}>
          <Pressable style={st.numpadSheet} onPress={e => e.stopPropagation()}>
            <View style={st.numpadHeader}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>Haemoglobin - g/dL</AppText>
              <TouchableOpacity onPress={() => setNumpadVisible(false)}><Icon family="Ionicons" name="close" size={ms(22)} color={Colors.textSecondary} /></TouchableOpacity>
            </View>
            <View style={st.numpadDisplay}><AppText style={[st.numpadValue, !numpadVal && {color: Colors.textTertiary}]}>{numpadVal || '\u2014'}</AppText></View>
            <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center', marginTop: vs(6), marginBottom: vs(8)}}>Normal women: {'\u2265'}12.0 g/dL - Mild: 10-11.9 - Moderate: 8-9.9</AppText>
            <View style={st.numpadGrid}>
              {['1','2','3','4','5','6','7','8','9','.','0'].map(d => (
                <TouchableOpacity key={d} style={st.npBtn} onPress={() => npPress(d)} activeOpacity={0.6}><AppText style={st.npBtnText}>{d}</AppText></TouchableOpacity>
              ))}
              <TouchableOpacity style={st.npBtn} onPress={npDel} activeOpacity={0.6}><Icon family="Ionicons" name="backspace-outline" size={ms(22)} color={Colors.textSecondary} /></TouchableOpacity>
            </View>
            <TouchableOpacity style={st.npOkBtn} onPress={npConfirm} activeOpacity={0.7}><AppText variant="bodyBold" color={Colors.white}>Confirm</AppText></TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const st = StyleSheet.create({
  tipCard: {backgroundColor: Colors.background, borderRadius: ms(13), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(11), marginBottom: vs(12)},
  tipDot: {width: ms(18), height: ms(18), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center', marginTop: vs(1)},
  secLabel: {flexDirection: 'row', alignItems: 'center', marginTop: vs(4), marginBottom: vs(8)},
  secText: {textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'},
  fatBtn: {flex: 1, paddingVertical: vs(10), borderRadius: ms(10), alignItems: 'center', borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.white},
  fatDesc: {borderRadius: ms(10), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(9), marginBottom: vs(10)},
  hbBox: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(18), alignItems: 'center', marginBottom: vs(10)},
  labField: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(12)},
  labFieldLabel: {fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, color: Colors.textSecondary, marginBottom: vs(6)},
  labFieldBox: {backgroundColor: Colors.background, borderRadius: ms(8), padding: ms(8)},
  noteRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(7), backgroundColor: Colors.background, borderRadius: ms(10), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(9), marginBottom: vs(10)},
  cameraZone: {backgroundColor: Colors.primary, borderRadius: ms(16), padding: ms(18), marginBottom: vs(10), alignItems: 'center'},
  viewfinder: {width: '100%', aspectRatio: 16 / 9, backgroundColor: 'rgba(0,0,0,0.4)', borderRadius: ms(12), alignItems: 'center', justifyContent: 'center', overflow: 'hidden'},
  viewfinderOverlay: {alignItems: 'center', justifyContent: 'center'},
  ovalGuide: {width: ms(140), height: ms(60), borderRadius: ms(30), borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.4)', alignItems: 'center', justifyContent: 'center'},
  crosshair: {width: ms(20), height: ms(20), borderRadius: ms(10), borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.6)'},
  darkCard: {backgroundColor: '#0d1220', borderRadius: ms(14), padding: ms(16), marginBottom: vs(10)},
  liveDot: {width: ms(7), height: ms(7), borderRadius: ms(4), backgroundColor: Colors.accent},
  importBtn: {backgroundColor: Colors.accent, borderRadius: ms(11), paddingVertical: vs(13), alignItems: 'center'},
  appCard: {width: '47%', flexGrow: 1, backgroundColor: Colors.white, borderRadius: ms(13), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(11), alignItems: 'center'},
  appCardActive: {borderColor: Colors.primary, backgroundColor: Colors.tealBg},
  statusBadge: {paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(10), marginTop: vs(5)},
  numpadOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end'},
  numpadSheet: {backgroundColor: Colors.white, borderTopLeftRadius: ms(22), borderTopRightRadius: ms(22), paddingBottom: vs(28)},
  numpadHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: s(20), paddingVertical: vs(14), borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb'},
  numpadDisplay: {alignItems: 'center', paddingVertical: vs(12), borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb'},
  numpadValue: {fontSize: ms(52), fontWeight: '700', color: Colors.primary, letterSpacing: 3, lineHeight: ms(56)},
  numpadGrid: {flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: s(16), paddingTop: vs(8)},
  npBtn: {width: '33.33%', alignItems: 'center', justifyContent: 'center', paddingVertical: vs(14)},
  npBtnText: {fontSize: ms(22), fontWeight: '500', color: Colors.textPrimary},
  npOkBtn: {backgroundColor: Colors.primary, borderRadius: ms(13), paddingVertical: vs(14), marginHorizontal: s(16), marginTop: vs(8), alignItems: 'center'},
});

export default AnemiaManualView;
