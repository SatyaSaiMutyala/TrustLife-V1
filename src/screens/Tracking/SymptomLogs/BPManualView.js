import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, TextInput, Modal, Pressable} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const WHEN_OPTIONS = [
  {id: 'morning', label: 'Morning', icon: 'sunny-outline'},
  {id: 'evening', label: 'Evening', icon: 'moon-outline'},
  {id: 'clinic', label: 'At clinic', icon: 'medkit-outline'},
  {id: 'random', label: 'Random', icon: 'shuffle-outline'},
];

const POSITION_OPTIONS = ['Sitting', 'Standing', 'Lying down'];
const ARM_OPTIONS = ['Left arm', 'Right arm', 'Wrist cuff'];

const BPManualEntry = ({sysVal, setSysVal, diaVal, setDiaVal, pulseVal, setPulseVal, bpIndicator}) => {
  const [numpadVisible, setNumpadVisible] = useState(false);
  const [numpadTarget, setNumpadTarget] = useState('sys'); // 'sys' | 'dia' | 'pulse'
  const [numpadVal, setNumpadVal] = useState('');
  const [activeWhen, setActiveWhen] = useState('morning');
  const [activePos, setActivePos] = useState('Sitting');
  const [activeArm, setActiveArm] = useState('Left arm');

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
      if (numpadTarget === 'sys') setSysVal(numpadVal);
      else if (numpadTarget === 'dia') setDiaVal(numpadVal);
      else setPulseVal(numpadVal);
    }
    setNumpadVisible(false);
  };

  const numpadTitle = numpadTarget === 'sys' ? 'Systolic' : numpadTarget === 'dia' ? 'Diastolic' : 'Pulse rate';
  const numpadUnit = numpadTarget === 'pulse' ? 'bpm' : 'mmHg';

  return (
    <View>
      {/* BP INPUT CARD */}
      <View style={st.inputCard}>
        <AppText variant="subtext" color={Colors.textSecondary} style={st.icLabel}>
          Blood pressure reading
        </AppText>

        {/* Dual input */}
        <View style={st.bpInputWrap}>
          <TouchableOpacity style={st.bpValBlock} onPress={() => openNumpad('sys')} activeOpacity={0.6}>
            <AppText style={st.bpSubLabel}>SYSTOLIC</AppText>
            <AppText style={[st.bpInput, !sysVal && {color: '#ddd'}]}>
              {sysVal || '---'}
            </AppText>
          </TouchableOpacity>
          <AppText style={st.bpSep}>/</AppText>
          <TouchableOpacity style={st.bpValBlock} onPress={() => openNumpad('dia')} activeOpacity={0.6}>
            <AppText style={st.bpSubLabel}>DIASTOLIC</AppText>
            <AppText style={[st.bpInput, !diaVal && {color: '#ddd'}]}>
              {diaVal || '--'}
            </AppText>
          </TouchableOpacity>
        </View>
        <AppText style={st.bpUnit}>mmHg</AppText>

        {/* Range indicator */}
        {bpIndicator ? (
          <View style={[st.bpIndicator, {backgroundColor: bpIndicator.bg}]}>
            <AppText style={{fontSize: ms(12), fontWeight: '700', color: bpIndicator.color, textAlign: 'center'}}>
              {bpIndicator.text}
            </AppText>
          </View>
        ) : <View style={{height: vs(18)}} />}

        {/* Pulse row */}
        <View style={st.pulseRow}>
          <AppText style={{fontSize: ms(11), color: Colors.textSecondary, fontWeight: '600', flexShrink: 0}}>
            Pulse rate
          </AppText>
          <TouchableOpacity onPress={() => openNumpad('pulse')} activeOpacity={0.6}>
            <AppText style={[st.pulseInput, !pulseVal && {color: '#ddd'}]}>
              {pulseVal || '---'}
            </AppText>
          </TouchableOpacity>
          <AppText style={{fontSize: ms(11), color: Colors.textTertiary}}>bpm</AppText>
          <AppText style={{marginLeft: 'auto', fontSize: ms(9), color: Colors.textTertiary}}>optional</AppText>
        </View>
      </View>

      {/* READING CONTEXT */}
      <View style={st.inputCard}>
        <AppText variant="subtext" color={Colors.textSecondary} style={st.icLabel}>
          Reading context
        </AppText>

        {/* When */}
        <AppText style={{fontSize: ms(11), fontWeight: '600', color: Colors.textSecondary, marginBottom: vs(7)}}>
          When
        </AppText>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: ms(6), marginBottom: vs(12)}}>
          {WHEN_OPTIONS.map(opt => {
            const isOn = activeWhen === opt.id;
            return (
              <TouchableOpacity
                key={opt.id}
                style={[st.typeBtn, isOn && st.typeBtnOn]}
                onPress={() => setActiveWhen(opt.id)}
                activeOpacity={0.7}>
                <Icon family="Ionicons" name={opt.icon} size={ms(12)} color={isOn ? Colors.white : Colors.textSecondary} style={{marginRight: s(4)}} />
                <AppText variant="caption" color={isOn ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>
                  {opt.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Position & Arm */}
        <View style={{flexDirection: 'row', gap: s(12)}}>
          <View style={{flex: 1}}>
            <AppText style={{fontSize: ms(11), fontWeight: '600', color: Colors.textSecondary, marginBottom: vs(7)}}>
              Position
            </AppText>
            {POSITION_OPTIONS.map(opt => {
              const isOn = activePos === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[st.optionBtn, isOn && st.optionBtnOn]}
                  onPress={() => setActivePos(opt)}
                  activeOpacity={0.7}>
                  <AppText variant="caption" color={isOn ? Colors.white : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>
                    {opt}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{flex: 1}}>
            <AppText style={{fontSize: ms(11), fontWeight: '600', color: Colors.textSecondary, marginBottom: vs(7)}}>
              Arm used
            </AppText>
            {ARM_OPTIONS.map(opt => {
              const isOn = activeArm === opt;
              return (
                <TouchableOpacity
                  key={opt}
                  style={[st.optionBtn, isOn && st.optionBtnOn]}
                  onPress={() => setActiveArm(opt)}
                  activeOpacity={0.7}>
                  <AppText variant="caption" color={isOn ? Colors.white : Colors.textSecondary} style={{fontWeight: isOn ? '700' : '500'}}>
                    {opt}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
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
              <AppText style={[st.numpadValue, !numpadVal && {color: Colors.textTertiary}]}>
                {numpadVal || '---'}
              </AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                {numpadUnit}
              </AppText>
            </View>

            <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(4), marginBottom: vs(8)}}>
              {numpadTarget === 'sys' ? 'Normal range: 90-120 mmHg' : numpadTarget === 'dia' ? 'Normal range: 60-80 mmHg' : 'Normal range: 60-100 bpm'}
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

  // BP dual input
  bpInputWrap: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(4), marginBottom: vs(6)},
  bpValBlock: {alignItems: 'center'},
  bpSubLabel: {fontSize: ms(9), color: Colors.textTertiary, fontWeight: '600', letterSpacing: 0.4, textTransform: 'uppercase', marginBottom: vs(2)},
  bpInput: {fontSize: ms(52), fontWeight: '800', color: Colors.textPrimary, textAlign: 'center', width: s(110)},
  bpSep: {fontSize: ms(40), fontWeight: '300', color: '#dde8e2', paddingBottom: vs(10)},
  bpUnit: {fontSize: ms(12), color: Colors.textTertiary, textAlign: 'center', marginBottom: vs(10)},
  bpIndicator: {borderRadius: ms(8), paddingVertical: vs(6), marginBottom: vs(12)},

  // Pulse
  pulseRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingTop: vs(10), borderTopWidth: 0.5, borderTopColor: Colors.background, marginTop: vs(4)},
  pulseInput: {fontSize: ms(22), fontWeight: '800', color: Colors.textPrimary, width: s(70), textAlign: 'center', borderBottomWidth: 1.5, borderBottomColor: '#dde8e2'},

  // Type buttons
  typeBtn: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8), paddingHorizontal: s(12), borderRadius: ms(10), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.background},
  typeBtnOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},

  // Option buttons
  optionBtn: {paddingVertical: vs(7), paddingHorizontal: s(10), borderRadius: ms(10), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.background, marginBottom: vs(5)},
  optionBtnOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},

  // Numpad
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

export default BPManualEntry;
