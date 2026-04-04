import React, {useState, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity, Modal, Pressable} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

// ── Conversion ──
const cToF = (c) => Math.round((c * 9 / 5 + 32) * 10) / 10;
const fToC = (f) => Math.round((f - 32) * 5 / 9 * 10) / 10;

// ── Zone bar segments ──
const ZONE_SEGS = [
  {label: 'Hypo', color: Colors.blue, flex: 11},
  {label: 'Normal', color: Colors.tealDark, flex: 12},
  {label: 'Low fever', color: Colors.amber, flex: 7},
  {label: 'Fever', color: Colors.red, flex: 10},
  {label: 'High', color: '#922B21', flex: 10},
  {label: 'Crisis', color: '#2d0d0d', flex: 10},
];
const ZONE_TOTAL = ZONE_SEGS.reduce((a, b) => a + b.flex, 0);

// ── Zone logic ──
const getZoneColor = (tempC) => {
  if (tempC < 35) return Colors.blue;
  if (tempC < 37.3) return Colors.tealDark;
  if (tempC < 38) return Colors.amber;
  if (tempC < 39) return Colors.red;
  if (tempC < 40) return '#922B21';
  return '#2d0d0d';
};

const TempManualView = ({tempC, setTempC, unit = 'C'}) => {
  const [numpadVisible, setNumpadVisible] = useState(false);
  const [numpadVal, setNumpadVal] = useState('');

  const isF = unit === 'F';
  const displayTemp = isF ? cToF(tempC).toFixed(1) : tempC.toFixed(1);
  const unitLabel = isF ? '\u00B0F' : '\u00B0C';
  const zoneColor = useMemo(() => getZoneColor(tempC), [tempC]);

  // Bar marker position: map 35-40.5 to 0-100%
  const barPct = useMemo(() => Math.min(100, Math.max(0, (tempC - 35) / 5.5 * 100)), [tempC]);

  // Numpad config
  const npMin = isF ? 89.6 : 33;
  const npMax = isF ? 108 : 42;
  const npHint = isF ? 'Normal oral range: 96.8\u201398.9\u00B0F - Fever: \u226599.1\u00B0F' : 'Normal oral range: 36.1\u201337.2\u00B0C - Fever: \u226537.3\u00B0C';

  const openNumpad = () => { setNumpadVal(''); setNumpadVisible(true); };
  const npPress = (d) => setNumpadVal(prev => {
    if (d === '.' && prev.includes('.')) return prev;
    if (prev.replace('.', '').length >= 5) return prev;
    return prev + d;
  });
  const npDel = () => setNumpadVal(prev => prev.slice(0, -1));
  const npConfirm = () => {
    const val = parseFloat(numpadVal);
    if (!isNaN(val) && val >= npMin && val <= npMax) {
      setTempC(isF ? fToC(val) : Math.round(val * 10) / 10);
    }
    setNumpadVisible(false);
  };

  return (
    <View>
      {/* Best practice card */}
      <View style={st.tipCard}>
        <AppText variant="subtext" color={Colors.primary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginBottom: vs(7)}}>
          Best practice - Accurate reading
        </AppText>
        {[
          {text: 'Oral thermometer \u2013 sit still for 5 minutes before measuring. Place under tongue and keep mouth closed for the full reading time.', ok: true},
          {text: 'Wait 30 minutes after eating, drinking, or exercise before taking an oral reading.', ok: true},
          {text: 'Same method, same time \u2013 this gives the most consistent comparable readings over time.', ok: true},
          {text: 'Ear and forehead readings can vary \u00B10.5\u00B0C by technique. Always note the method used.', ok: false},
        ].map((tip, i) => (
          <View key={i} style={{flexDirection: 'row', alignItems: 'flex-start', gap: s(8), marginBottom: vs(5)}}>
            <View style={[st.tipDot, {backgroundColor: tip.ok ? Colors.tealBg : Colors.amberBg}]}>
              {tip.ok
                ? <Icon family="Ionicons" name="checkmark" size={ms(9)} color={Colors.tealText} />
                : <AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.amberDark}}>!</AppText>
              }
            </View>
            <AppText variant="small" color={tip.ok ? Colors.textPrimary : Colors.textSecondary} style={{flex: 1, lineHeight: ms(16)}}>{tip.text}</AppText>
          </View>
        ))}
      </View>

      {/* Big temperature tap input */}
      <TouchableOpacity style={st.tempBox} onPress={openNumpad} activeOpacity={0.6}>
        <AppText style={st.tempLabel}>BODY TEMPERATURE</AppText>
        <View style={{flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: s(4)}}>
          <AppText style={[st.tempBig, {color: Colors.primary}]}>{displayTemp}</AppText>
          <AppText style={st.tempUnitLbl}>{unitLabel}</AppText>
        </View>
        <AppText style={st.tempTap}>Tap to edit</AppText>
      </TouchableOpacity>

      {/* Zone classification bar */}
      <View style={st.classBarCard}>
        <AppText style={{fontSize: ms(10), fontWeight: '700', color: Colors.textPrimary, marginBottom: vs(6)}}>Temperature classification</AppText>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(3)}}>
          <AppText style={{fontSize: ms(8), color: Colors.textTertiary}}>35</AppText>
          <AppText style={{fontSize: ms(8), color: Colors.textTertiary}}>36.1</AppText>
          <AppText style={{fontSize: ms(8), color: Colors.textTertiary}}>37.3</AppText>
          <AppText style={{fontSize: ms(8), color: Colors.textTertiary}}>38</AppText>
          <AppText style={{fontSize: ms(8), color: Colors.textTertiary}}>39</AppText>
          <AppText style={{fontSize: ms(8), color: Colors.textTertiary}}>40{'\u00B0'}C</AppText>
        </View>
        <View style={{position: 'relative', marginBottom: vs(2)}}>
          <View style={{flexDirection: 'row', borderRadius: ms(6), overflow: 'hidden', height: ms(12)}}>
            {ZONE_SEGS.map((z, i) => (
              <View key={i} style={{flex: z.flex, backgroundColor: z.color, height: '100%'}} />
            ))}
          </View>
          {/* Marker */}
          <View style={{position: 'absolute', top: ms(-3), left: `${barPct}%`, marginLeft: ms(-1), width: ms(2), height: ms(18), backgroundColor: Colors.textPrimary, borderRadius: ms(1)}} />
        </View>
        <View style={{position: 'relative', height: ms(16), marginBottom: vs(4)}}>
          <View style={{position: 'absolute', left: `${Math.max(0, barPct - 5)}%`}}>
            <AppText style={{fontSize: ms(8), fontWeight: '800', color: Colors.primary}}>{displayTemp}</AppText>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <AppText style={{fontSize: ms(8), color: Colors.blueText}}>Hypo</AppText>
          <AppText style={{fontSize: ms(8), color: Colors.tealText}}>Normal</AppText>
          <AppText style={{fontSize: ms(8), color: Colors.amberDark}}>Low fever</AppText>
          <AppText style={{fontSize: ms(8), color: Colors.redDark}}>Fever</AppText>
          <AppText style={{fontSize: ms(8), color: '#6B1515'}}>High</AppText>
          <View style={{backgroundColor: '#2d0d0d', paddingHorizontal: s(4), paddingVertical: vs(1), borderRadius: ms(4)}}>
            <AppText style={{fontSize: ms(8), color: '#fff'}}>Crisis</AppText>
          </View>
        </View>
      </View>

      {/* Numpad Modal */}
      <Modal visible={numpadVisible} transparent animationType="slide" onRequestClose={() => setNumpadVisible(false)}>
        <Pressable style={st.numpadOverlay} onPress={() => setNumpadVisible(false)}>
          <Pressable style={st.numpadSheet} onPress={e => e.stopPropagation()}>
            <View style={st.numpadHeader}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>Body temperature</AppText>
              <TouchableOpacity onPress={() => setNumpadVisible(false)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Icon family="Ionicons" name="close" size={ms(22)} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={st.numpadDisplay}>
              <AppText style={[st.numpadValue, !numpadVal && {color: Colors.textTertiary}]}>{numpadVal || displayTemp}</AppText>
            </View>
            <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center', marginTop: vs(6), marginBottom: vs(8)}}>{npHint}</AppText>
            <View style={st.numpadGrid}>
              {['1','2','3','4','5','6','7','8','9'].map(d => (
                <TouchableOpacity key={d} style={st.npBtn} onPress={() => npPress(d)} activeOpacity={0.6}>
                  <AppText style={st.npBtnText}>{d}</AppText>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={st.npBtn} onPress={() => npPress('.')} activeOpacity={0.6}>
                <AppText style={st.npBtnText}>.</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={st.npBtn} onPress={() => npPress('0')} activeOpacity={0.6}>
                <AppText style={st.npBtnText}>0</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={st.npBtn} onPress={npDel} activeOpacity={0.6}>
                <Icon family="Ionicons" name="backspace-outline" size={ms(22)} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={st.npOkBtn} onPress={npConfirm} activeOpacity={0.7}>
              <AppText variant="bodyBold" color={Colors.white}>Confirm</AppText>
            </TouchableOpacity>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const st = StyleSheet.create({
  tipCard: {backgroundColor: Colors.background, borderRadius: ms(13), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(11), marginBottom: vs(12)},
  tipDot: {width: ms(18), height: ms(18), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center', marginTop: vs(1)},
  tempBox: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(20), alignItems: 'center', marginBottom: vs(10)},
  tempLabel: {fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: Colors.textSecondary, marginBottom: vs(8)},
  tempBig: {fontSize: ms(72), fontWeight: '700', lineHeight: ms(74)},
  tempUnitLbl: {fontSize: ms(20), color: Colors.textTertiary, fontWeight: '500'},
  tempTap: {fontSize: ms(10), color: Colors.textTertiary, marginTop: vs(6)},
  classBarCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(11), marginBottom: vs(10)},
  numpadOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end'},
  numpadSheet: {backgroundColor: Colors.white, borderTopLeftRadius: ms(22), borderTopRightRadius: ms(22), paddingBottom: vs(28)},
  numpadHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: s(20), paddingVertical: vs(14), borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb'},
  numpadDisplay: {alignItems: 'center', paddingVertical: vs(12), borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb'},
  numpadValue: {fontSize: ms(56), fontWeight: '700', color: Colors.primary, letterSpacing: 3, lineHeight: ms(60)},
  numpadGrid: {flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: s(16), paddingTop: vs(8)},
  npBtn: {width: '33.33%', alignItems: 'center', justifyContent: 'center', paddingVertical: vs(14)},
  npBtnText: {fontSize: ms(22), fontWeight: '500', color: Colors.textPrimary},
  npOkBtn: {backgroundColor: Colors.primary, borderRadius: ms(13), paddingVertical: vs(14), marginHorizontal: s(16), marginTop: vs(8), alignItems: 'center'},
});

export default TempManualView;
