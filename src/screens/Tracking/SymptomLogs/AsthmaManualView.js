import React, {useState, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity, Modal, Pressable} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const AsthmaManualView = ({pef, setPef, personalBest = 380}) => {
  const [numpadVisible, setNumpadVisible] = useState(false);
  const [numpadVal, setNumpadVal] = useState('');
  const [b3, setB3] = useState([pef, null, null]);
  const [activeB3, setActiveB3] = useState(0);

  const pct = useMemo(() => Math.round(pef / personalBest * 100), [pef, personalBest]);
  const barPct = useMemo(() => Math.min(100, Math.max(0, pct)), [pct]);
  const zoneColor = pct >= 80 ? Colors.primary : pct >= 50 ? Colors.amber : Colors.red;

  const selectB3 = (idx) => {
    setActiveB3(idx);
    setNumpadVal('');
    setNumpadVisible(true);
  };

  const openNumpad = () => { setNumpadVal(''); setNumpadVisible(true); };
  const npPress = (d) => setNumpadVal(prev => prev.length >= 3 ? prev : prev + d);
  const npDel = () => setNumpadVal(prev => prev.slice(0, -1));
  const npConfirm = () => {
    const val = parseInt(numpadVal, 10);
    if (!isNaN(val) && val > 0 && val <= 800) {
      const newB3 = [...b3];
      newB3[activeB3] = val;
      setB3(newB3);
      const best = Math.max(...newB3.filter(v => v !== null));
      setPef(best);
    }
    setNumpadVisible(false);
  };

  return (
    <View>
      {/* Best practice card */}
      <View style={st.tipCard}>
        <AppText variant="subtext" color={Colors.primary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginBottom: vs(7)}}>
          Best practice - Accurate peak flow
        </AppText>
        {[
          {text: 'Stand or sit upright \u2013 take 3 readings each session. Record the highest of the 3.', ok: true},
          {text: 'Before rescue inhaler \u2013 take reading before using Salbutamol for a true baseline.', ok: true},
          {text: 'Same time daily \u2013 morning on waking and evening before bed gives the most consistent monitoring.', ok: true},
          {text: 'If PEF drops below 50% personal best \u2013 use rescue inhaler immediately and seek medical care.', ok: false},
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

      {/* Best of 3 readings */}
      <View style={st.secLabel}>
        <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>Best of 3 readings - L/min</AppText>
        <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
      </View>
      <View style={{flexDirection: 'row', gap: s(6), marginBottom: vs(10)}}>
        {b3.map((val, i) => {
          const active = activeB3 === i;
          return (
            <TouchableOpacity key={i} style={[st.b3Box, active && st.b3BoxActive]} onPress={() => selectB3(i)} activeOpacity={0.7}>
              <AppText style={{fontSize: ms(18), fontWeight: '800', color: val !== null ? zoneColor : Colors.textTertiary, lineHeight: ms(20)}}>{val !== null ? val : '\u2014'}</AppText>
              <AppText style={{fontSize: ms(9), color: Colors.textTertiary, marginTop: vs(3), textTransform: 'uppercase', letterSpacing: 0.4}}>Reading {i + 1}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Big PEF display */}
      <TouchableOpacity style={st.pefBox} onPress={openNumpad} activeOpacity={0.6}>
        <AppText style={st.pefLabel}>Best reading - Personal best: {personalBest} L/min</AppText>
        <View style={{flexDirection: 'row', alignItems: 'baseline', justifyContent: 'center', gap: s(4)}}>
          <AppText style={[st.pefBig, {color: Colors.primary}]}>{pef}</AppText>
          <AppText style={st.pefUnit}>L/min</AppText>
        </View>
        <AppText style={{fontSize: ms(13), fontWeight: '700', color: zoneColor, marginTop: vs(6)}}>{pct}% of personal best</AppText>
        <AppText style={st.pefTap}>Tap to edit</AppText>
      </TouchableOpacity>

      {/* Zone classification bar */}
      <View style={st.classBarCard}>
        <AppText style={{fontSize: ms(10), fontWeight: '700', color: Colors.textPrimary, marginBottom: vs(6)}}>Asthma action zones - Based on personal best {personalBest} L/min</AppText>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(3)}}>
          <AppText style={{fontSize: ms(8), color: Colors.textTertiary}}>0%</AppText>
          <AppText style={{fontSize: ms(8), color: Colors.textTertiary}}>50%</AppText>
          <AppText style={{fontSize: ms(8), color: Colors.textTertiary}}>80%</AppText>
          <AppText style={{fontSize: ms(8), color: Colors.textTertiary}}>100%+</AppText>
        </View>
        <View style={{position: 'relative', marginBottom: vs(2)}}>
          <View style={{flexDirection: 'row', borderRadius: ms(6), overflow: 'hidden', height: ms(12)}}>
            <View style={{flex: 50, backgroundColor: Colors.red, height: '100%'}} />
            <View style={{flex: 30, backgroundColor: Colors.amber, height: '100%'}} />
            <View style={{flex: 20, backgroundColor: Colors.accent, height: '100%'}} />
          </View>
          <View style={{position: 'absolute', top: ms(-3), left: `${barPct}%`, marginLeft: ms(-1), width: ms(2), height: ms(18), backgroundColor: Colors.textPrimary, borderRadius: ms(1)}} />
        </View>
        <View style={{position: 'relative', height: ms(16), marginBottom: vs(4)}}>
          <View style={{position: 'absolute', left: `${Math.max(0, barPct - 5)}%`}}>
            <AppText style={{fontSize: ms(8), fontWeight: '800', color: Colors.primary}}>{pef}</AppText>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
          <AppText style={{fontSize: ms(8), color: Colors.redDark}}>Red {'<'}50%</AppText>
          <AppText style={{fontSize: ms(8), color: Colors.amberDark}}>Yellow 50-79%</AppText>
          <AppText style={{fontSize: ms(8), color: Colors.tealText}}>Green {'\u2265'}80%</AppText>
        </View>
      </View>

      {/* Numpad */}
      <Modal visible={numpadVisible} transparent animationType="slide" onRequestClose={() => setNumpadVisible(false)}>
        <Pressable style={st.numpadOverlay} onPress={() => setNumpadVisible(false)}>
          <Pressable style={st.numpadSheet} onPress={e => e.stopPropagation()}>
            <View style={st.numpadHeader}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>Peak Flow - L/min</AppText>
              <TouchableOpacity onPress={() => setNumpadVisible(false)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Icon family="Ionicons" name="close" size={ms(22)} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={st.numpadDisplay}>
              <AppText style={[st.numpadValue, !numpadVal && {color: Colors.textTertiary}]}>{numpadVal || pef}</AppText>
            </View>
            <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center', marginTop: vs(6), marginBottom: vs(8)}}>Personal best: {personalBest} L/min - Green {'\u2265'}{Math.round(personalBest * 0.8)} - Yellow {'\u2265'}{Math.round(personalBest * 0.5)} - Red {'<'}{Math.round(personalBest * 0.5)}</AppText>
            <View style={st.numpadGrid}>
              {['1','2','3','4','5','6','7','8','9','0'].map(d => (
                <TouchableOpacity key={d} style={st.npBtn} onPress={() => npPress(d)} activeOpacity={0.6}>
                  <AppText style={st.npBtnText}>{d}</AppText>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={st.npBtn} onPress={npDel} activeOpacity={0.6}>
                <Icon family="Ionicons" name="backspace-outline" size={ms(22)} color={Colors.textSecondary} />
              </TouchableOpacity>
              <TouchableOpacity style={st.npBtn} activeOpacity={0.6} onPress={() => npPress('0')}>
                <AppText style={st.npBtnText}>00</AppText>
              </TouchableOpacity>
            </View>
            <TouchableOpacity style={st.npOkBtn} onPress={npConfirm} activeOpacity={0.7}>
              <AppText variant="bodyBold" color={Colors.white}>Set reading</AppText>
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
  secLabel: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(8)},
  b3Box: {flex: 1, backgroundColor: Colors.white, borderWidth: 0.5, borderColor: '#dde8e2', borderRadius: ms(12), padding: ms(10), alignItems: 'center'},
  b3BoxActive: {borderColor: Colors.accent, backgroundColor: '#f4faf8'},
  pefBox: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(18), alignItems: 'center', marginBottom: vs(10)},
  pefLabel: {fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: Colors.textSecondary, marginBottom: vs(6)},
  pefBig: {fontSize: ms(72), fontWeight: '700', lineHeight: ms(74)},
  pefUnit: {fontSize: ms(16), color: Colors.textTertiary, fontWeight: '500'},
  pefTap: {fontSize: ms(10), color: Colors.textTertiary, marginTop: vs(4)},
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

export default AsthmaManualView;
