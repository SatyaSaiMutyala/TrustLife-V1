import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, Modal, Pressable} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const TYPE_OPTIONS = [
  {id: 'resting', label: 'Resting', icon: 'bed-outline'},
  {id: 'afterwalk', label: 'After walk', icon: 'walk-outline'},
  {id: 'postworkout', label: 'Post-workout', icon: 'barbell-outline'},
  {id: 'meditation', label: 'Meditation', icon: 'leaf-outline'},
  {id: 'sleep', label: 'During sleep', icon: 'moon-outline'},
  {id: 'random', label: 'Random check', icon: 'shuffle-outline'},
];

const DURATION_OPTIONS = ['15 sec', '30 sec', '1 min', '2 min', '5 min', 'Auto (Watch)'];

const HRManualEntry = ({hrVal, setHrVal, hrvVal, setHrvVal, spo2Val, setSpo2Val, hrIndicator}) => {
  const [numpadVisible, setNumpadVisible] = useState(false);
  const [numpadTarget, setNumpadTarget] = useState('hr');
  const [numpadVal, setNumpadVal] = useState('');
  const [activeType, setActiveType] = useState('resting');
  const [activeDuration, setActiveDuration] = useState('1 min');

  const openNumpad = (target) => {
    setNumpadTarget(target);
    setNumpadVal('');
    setNumpadVisible(true);
  };

  const npPress = (d) => {
    setNumpadVal(prev => {
      if (prev.length >= 3) return prev;
      return prev + d;
    });
  };
  const npDel = () => setNumpadVal(prev => prev.slice(0, -1));
  const npConfirm = () => {
    if (numpadVal) {
      if (numpadTarget === 'hr') setHrVal(numpadVal);
      else if (numpadTarget === 'hrv') setHrvVal(numpadVal);
      else setSpo2Val(numpadVal);
    }
    setNumpadVisible(false);
  };

  const numpadTitle = numpadTarget === 'hr' ? 'Heart Rate' : numpadTarget === 'hrv' ? 'HRV' : 'SpO2';
  const numpadUnit = numpadTarget === 'hr' ? 'bpm' : numpadTarget === 'hrv' ? 'ms' : '%';

  return (
    <View>
      {/* HR INPUT */}
      <View style={st.inputCard}>
        <AppText variant="subtext" color={Colors.textSecondary} style={st.icLabel}>Heart rate</AppText>
        <View style={st.hrInputWrap}>
          <AppText style={{fontSize: ms(42), color: Colors.red, lineHeight: ms(44)}}>
            <Icon family="Ionicons" name="heart" size={ms(36)} color={Colors.red} />
          </AppText>
          <TouchableOpacity style={st.valInputWrap} onPress={() => openNumpad('hr')} activeOpacity={0.6}>
            <AppText style={[st.valInput, !hrVal && {color: '#ddd'}]}>{hrVal || '--'}</AppText>
            <AppText style={{fontSize: ms(16), color: Colors.textTertiary, alignSelf: 'flex-end', marginBottom: vs(14), marginLeft: s(6)}}>bpm</AppText>
          </TouchableOpacity>
        </View>

        {/* Indicator */}
        {hrIndicator ? (
          <View style={[st.hrIndicator, {backgroundColor: hrIndicator.bg}]}>
            <AppText style={{fontSize: ms(12), fontWeight: '700', color: hrIndicator.color, textAlign: 'center'}}>{hrIndicator.text}</AppText>
          </View>
        ) : <View style={{height: vs(32)}} />}

        {/* HRV */}
        <View style={st.hrvRow}>
          <AppText style={{fontSize: ms(11), color: Colors.textSecondary, fontWeight: '600', flexShrink: 0}}>HRV</AppText>
          <TouchableOpacity onPress={() => openNumpad('hrv')} activeOpacity={0.6}>
            <AppText style={[st.hrvInput, !hrvVal && {color: '#ddd'}]}>{hrvVal || '--'}</AppText>
          </TouchableOpacity>
          <AppText style={{fontSize: ms(11), color: Colors.textTertiary}}>ms</AppText>
          <AppText style={{marginLeft: 'auto', fontSize: ms(9), color: Colors.textTertiary}}>optional - Apple Watch auto-fills</AppText>
        </View>

        {/* SpO2 */}
        <View style={[st.hrvRow, {borderTopWidth: 0.5, borderTopColor: Colors.background}]}>
          <AppText style={{fontSize: ms(11), color: Colors.textSecondary, fontWeight: '600', flexShrink: 0}}>SpO2</AppText>
          <TouchableOpacity onPress={() => openNumpad('spo2')} activeOpacity={0.6}>
            <AppText style={[st.hrvInput, !spo2Val && {color: '#ddd'}]}>{spo2Val || '--'}</AppText>
          </TouchableOpacity>
          <AppText style={{fontSize: ms(11), color: Colors.textTertiary}}>%</AppText>
          <AppText style={{marginLeft: 'auto', fontSize: ms(9), color: Colors.textTertiary}}>optional - oximeter</AppText>
        </View>
      </View>

      {/* READING TYPE + DURATION */}
      <View style={st.inputCard}>
        <AppText variant="subtext" color={Colors.textSecondary} style={st.icLabel}>Reading type</AppText>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: ms(6), marginBottom: vs(14)}}>
          {TYPE_OPTIONS.map(opt => {
            const isOn = activeType === opt.id;
            return (
              <TouchableOpacity key={opt.id} style={[st.typeBtn, isOn && st.typeBtnOn]} onPress={() => setActiveType(opt.id)} activeOpacity={0.7}>
                <Icon family="Ionicons" name={opt.icon} size={ms(12)} color={isOn ? Colors.white : Colors.textSecondary} style={{marginRight: s(4)}} />
                <AppText variant="caption" color={isOn ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{opt.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <AppText variant="subtext" color={Colors.textSecondary} style={st.icLabel}>Measurement duration</AppText>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: ms(6)}}>
          {DURATION_OPTIONS.map(opt => {
            const isOn = activeDuration === opt;
            return (
              <TouchableOpacity key={opt} style={[st.typeBtn, isOn && st.typeBtnOn]} onPress={() => setActiveDuration(opt)} activeOpacity={0.7}>
                <AppText variant="caption" color={isOn ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{opt}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
        <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(6), lineHeight: ms(14)}}>
          Longer measurements give more accurate resting HR and HRV. Clinical standard is 1-5 min after sitting quietly.
        </AppText>
      </View>

      {/* Numpad Modal */}
      <Modal visible={numpadVisible} transparent animationType="slide" onRequestClose={() => setNumpadVisible(false)}>
        <Pressable style={st.numpadOverlay} onPress={() => setNumpadVisible(false)}>
          <Pressable style={st.numpadSheet} onPress={e => e.stopPropagation()}>
            <View style={st.numpadHeader}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>{numpadTitle}</AppText>
              <TouchableOpacity onPress={() => setNumpadVisible(false)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Icon family="Ionicons" name="close" size={ms(22)} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={st.numpadDisplay}>
              <AppText style={[st.numpadValue, !numpadVal && {color: Colors.textTertiary}]}>{numpadVal || '--'}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{numpadUnit}</AppText>
            </View>
            <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(4), marginBottom: vs(8)}}>
              {numpadTarget === 'hr' ? 'Normal resting: 60-100 bpm' : numpadTarget === 'hrv' ? 'Target: >40 ms' : 'Normal: 95-100%'}
            </AppText>
            <View style={st.numpadGrid}>
              {['1','2','3','4','5','6','7','8','9'].map(d => (
                <TouchableOpacity key={d} style={st.npBtn} onPress={() => npPress(d)} activeOpacity={0.6}>
                  <AppText style={st.npBtnText}>{d}</AppText>
                </TouchableOpacity>
              ))}
              <TouchableOpacity style={st.npBtnOk} onPress={npConfirm} activeOpacity={0.7}>
                <View style={st.npBtnOkInner}>
                  <Icon family="Ionicons" name="checkmark-circle" size={ms(22)} color={Colors.white} />
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={st.npBtn} onPress={() => npPress('0')} activeOpacity={0.6}>
                <AppText style={st.npBtnText}>0</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={st.npBtn} onPress={npDel} activeOpacity={0.6}>
                <Icon family="Ionicons" name="backspace-outline" size={ms(22)} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const st = StyleSheet.create({
  inputCard: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(16), marginBottom: vs(12)},
  icLabel: {textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginBottom: vs(10)},
  hrInputWrap: {alignItems: 'center', marginBottom: vs(10)},
  valInputWrap: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', marginTop: vs(2)},
  valInput: {fontSize: ms(72), fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', width: s(180), lineHeight: ms(72)},
  hrIndicator: {borderRadius: ms(10), paddingVertical: vs(7), paddingHorizontal: s(12), marginBottom: vs(12)},
  hrvRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(10), borderTopWidth: 0.5, borderTopColor: Colors.background, marginTop: vs(4)},
  hrvInput: {fontSize: ms(22), fontWeight: '800', color: Colors.textPrimary, width: s(70), textAlign: 'center', borderBottomWidth: 1.5, borderBottomColor: '#dde8e2'},
  typeBtn: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8), paddingHorizontal: s(12), borderRadius: ms(10), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.background},
  typeBtnOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  numpadOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.5)', justifyContent: 'flex-end'},
  numpadSheet: {backgroundColor: Colors.white, borderTopLeftRadius: ms(22), borderTopRightRadius: ms(22), paddingBottom: vs(28)},
  numpadHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: s(20), paddingVertical: vs(14), borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb'},
  numpadDisplay: {alignItems: 'center', paddingVertical: vs(10), paddingHorizontal: s(20), borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb'},
  numpadValue: {fontSize: ms(28), fontWeight: '700', color: Colors.primary, letterSpacing: 4, lineHeight: ms(34)},
  numpadGrid: {flexDirection: 'row', flexWrap: 'wrap', paddingHorizontal: s(16), paddingTop: vs(8)},
  npBtn: {width: '33.33%', alignItems: 'center', justifyContent: 'center', paddingVertical: vs(14)},
  npBtnText: {fontSize: ms(20), fontWeight: '500', color: Colors.textPrimary},
  npBtnOk: {width: '33.33%', alignItems: 'center', justifyContent: 'center', paddingVertical: vs(12)},
  npBtnOkInner: {backgroundColor: Colors.primary, borderRadius: ms(12), paddingVertical: vs(10), paddingHorizontal: s(18)},
});

export default HRManualEntry;
