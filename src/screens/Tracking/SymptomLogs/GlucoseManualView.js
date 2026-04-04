import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Modal,
  Pressable,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

// ──────────────────────────────────────────────
// GlucoseManualEntry
// Props: unit, setUnit, glucoseVal, setGlucoseVal,
//        activeType, setActiveType, readingTypes, rangeInfo
// ──────────────────────────────────────────────

const GlucoseManualEntry = ({
  unit,
  setUnit,
  glucoseVal,
  setGlucoseVal,
  activeType,
  setActiveType,
  readingTypes,
  rangeInfo,
}) => {
  // Numpad modal
  const [numpadVisible, setNumpadVisible] = useState(false);
  const [numpadVal, setNumpadVal] = useState('');

  const openNumpad = () => {
    setNumpadVal('');
    setNumpadVisible(true);
  };

  const npPress = (d) => {
    setNumpadVal(prev => {
      if (d === '.' && prev.includes('.')) return prev;
      if (prev.includes('.') && prev.split('.')[1].length >= 1) return prev;
      if (!prev.includes('.') && prev.replace('.', '').length >= 3 && d !== '.') return prev;
      return prev + d;
    });
  };

  const npDel = () => setNumpadVal(prev => prev.slice(0, -1));

  const npConfirm = () => {
    const raw = numpadVal;
    if (raw) {
      setGlucoseVal(raw);
    }
    setNumpadVisible(false);
  };

  const handleUnitSwitch = (newUnit) => {
    if (newUnit === unit) return;
    // Convert existing value
    const raw = parseFloat(glucoseVal);
    if (!isNaN(raw)) {
      if (newUnit === 'mmol') {
        setGlucoseVal((raw / 18.0182).toFixed(1));
      } else {
        setGlucoseVal(String(Math.round(raw * 18.0182)));
      }
    }
    setUnit(newUnit);
  };

  const unitLabel = unit === 'mmol' ? 'mmol/L' : 'mg/dL';

  return (
    <View style={st.inputCard}>
      <AppText variant="subtext" color={Colors.textSecondary} style={st.icLabel}>
        Reading value
      </AppText>

      {/* Unit toggle */}
      <View style={st.unitToggleWrap}>
        <View style={st.unitToggleContainer}>
          <TouchableOpacity
            style={[st.unitBtn, unit === 'mgdl' && st.unitBtnOn]}
            onPress={() => handleUnitSwitch('mgdl')}
            activeOpacity={0.7}>
            <AppText
              variant="caption"
              color={unit === 'mgdl' ? Colors.primary : Colors.textSecondary}
              style={{fontWeight: '700'}}>
              mg/dL
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[st.unitBtn, unit === 'mmol' && st.unitBtnOn]}
            onPress={() => handleUnitSwitch('mmol')}
            activeOpacity={0.7}>
            <AppText
              variant="caption"
              color={unit === 'mmol' ? Colors.primary : Colors.textSecondary}
              style={{fontWeight: '700'}}>
              mmol/L
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Big value input */}
      <TouchableOpacity style={st.valInputWrap} onPress={openNumpad} activeOpacity={0.6}>
        <AppText
          style={[
            st.valInput,
            !glucoseVal && {color: '#ddd'},
          ]}
          numberOfLines={1}
          adjustsFontSizeToFit>
          {glucoseVal || '---'}
        </AppText>
        <AppText variant="body" color={Colors.textTertiary} style={{alignSelf: 'flex-end', marginBottom: vs(10), marginLeft: s(6)}}>
          {unitLabel}
        </AppText>
      </TouchableOpacity>

      {/* Range indicator */}
      {rangeInfo ? (
        <View style={{alignItems: 'center', marginBottom: vs(14)}}>
          <AppText variant="caption" color={rangeInfo.color} style={{fontWeight: '700'}}>
            {rangeInfo.text}
          </AppText>
        </View>
      ) : (
        <View style={{height: vs(18)}} />
      )}

      {/* Reading type */}
      <AppText variant="subtext" color={Colors.textSecondary} style={st.icLabel}>
        Reading type
      </AppText>
      <View style={st.typeGrid}>
        {readingTypes.map(item => {
          const isOn = activeType === item.id;
          return (
            <TouchableOpacity
              key={item.id}
              style={[st.typeBtn, isOn && st.typeBtnOn]}
              onPress={() => setActiveType(item.id)}
              activeOpacity={0.7}>
              <AppText
                variant="caption"
                color={isOn ? Colors.white : Colors.textSecondary}
                style={{fontWeight: '600', textAlign: 'center'}}>
                {item.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── Numpad Bottom Modal ── */}
      <Modal
        visible={numpadVisible}
        transparent
        animationType="slide"
        onRequestClose={() => setNumpadVisible(false)}>
        <Pressable style={st.numpadOverlay} onPress={() => setNumpadVisible(false)}>
          <Pressable style={st.numpadSheet} onPress={e => e.stopPropagation()}>
            <View style={st.numpadHeader}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>Blood glucose</AppText>
              <TouchableOpacity
                onPress={() => setNumpadVisible(false)}
                hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Icon family="Ionicons" name="close" size={ms(22)} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>

            <View style={st.numpadDisplay}>
              <AppText style={[st.numpadValue, !numpadVal && {color: Colors.textTertiary}]}>
                {numpadVal || glucoseVal || '---'}
              </AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                {unitLabel}
              </AppText>
            </View>

            <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center', marginTop: vs(4)}}>
              {unit === 'mmol'
                ? 'Fasting target: <7.0 · Range: 1.0–30.0 mmol/L'
                : 'Fasting target: <130 · Range: 20–600 mg/dL'}
            </AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(2), marginBottom: vs(8)}}>
              Use decimal point for 0.1 precision
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
              <TouchableOpacity style={st.npBtn} onPress={() => npPress('.')} activeOpacity={0.6}>
                <AppText style={st.npBtnText}>·</AppText>
              </TouchableOpacity>
            </View>
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  inputCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    borderWidth: 0.5,
    borderColor: '#dde8e2',
    padding: ms(16),
    marginBottom: vs(12),
  },
  icLabel: {
    textTransform: 'uppercase',
    fontWeight: '700',
    letterSpacing: 0.6,
    marginBottom: vs(10),
  },

  // Unit toggle
  unitToggleWrap: {
    alignItems: 'center',
    marginBottom: vs(10),
  },
  unitToggleContainer: {
    flexDirection: 'row',
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    padding: ms(2),
    gap: ms(2),
    borderWidth: 0.5,
    borderColor: '#dde8e2',
  },
  unitBtn: {
    paddingHorizontal: s(14),
    paddingVertical: vs(5),
    borderRadius: ms(8),
  },
  unitBtnOn: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
    elevation: 2,
  },

  // Big value
  valInputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(14),
  },
  valInput: {
    fontSize: ms(52),
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
  },

  // Type grid
  typeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(6),
    justifyContent: 'space-between',
  },
  typeBtn: {
    width: '31.5%',
    paddingVertical: vs(8),
    paddingHorizontal: s(6),
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: '#dde8e2',
    backgroundColor: Colors.background,
    alignItems: 'center',
  },
  typeBtnOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // Numpad
  numpadOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  numpadSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: ms(22),
    borderTopRightRadius: ms(22),
    paddingBottom: vs(28),
  },
  numpadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingVertical: vs(14),
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  numpadDisplay: {
    alignItems: 'center',
    paddingVertical: vs(10),
    paddingHorizontal: s(20),
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  numpadValue: {
    fontSize: ms(28),
    fontWeight: '700',
    color: Colors.primary,
    letterSpacing: 4,
    lineHeight: ms(34),
  },
  numpadGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: s(16),
    paddingTop: vs(8),
  },
  npBtn: {
    width: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(14),
  },
  npBtnText: {
    fontSize: ms(20),
    fontWeight: '500',
    color: Colors.textPrimary,
  },
  npBtnOk: {
    width: '33.33%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(12),
  },
  npBtnOkInner: {
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(10),
    paddingHorizontal: s(18),
  },
});

export default GlucoseManualEntry;
