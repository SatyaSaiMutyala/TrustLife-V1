import React, {useState, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity, Modal, Pressable} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Path, Line, Circle, Text as SvgText} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const NP_CONFIG = {
  weight: {label: 'Weight', hint: 'Weight in kg - Ideal range: 49-61 kg - Target: 61.2 kg', range: 'Range: 30-150 kg', min: 30, max: 150},
  height: {label: 'Height', hint: 'Height in cm - Your recorded height: 163 cm', range: 'Range: 100-220 cm', min: 100, max: 220},
  waist: {label: 'Waist circumference', hint: 'Measured at navel - Indian women target: <80 cm', range: 'Range: 50-150 cm', min: 50, max: 150},
};

// BMI classification bar zones (Indian standard)
const BMI_ZONES = [
  {label: 'Under', range: '<18.5', color: Colors.blue, flex: 3.5},
  {label: 'Normal', range: '18.5-23', color: Colors.tealDark, flex: 4.5},
  {label: 'OW', range: '23-27.5', color: Colors.amber, flex: 4.5},
  {label: 'Obese', range: '>27.5', color: Colors.red, flex: 5},
];

// Slider marks
const WEIGHT_MARKS = ['30', '49', '61.2', '80', '100', '150'];
const HEIGHT_MARKS = ['100', '140', '155', '163', '175', '190', '220'];

// Unit conversion helpers
const kgToLb = (kg) => (parseFloat(kg) * 2.20462).toFixed(1);
const lbToKg = (lb) => (parseFloat(lb) / 2.20462).toFixed(1);
const cmToFtIn = (cm) => {
  const totalIn = parseFloat(cm) / 2.54;
  const ft = Math.floor(totalIn / 12);
  const inches = Math.round(totalIn % 12);
  return `${ft}'${inches}"`;
};
const cmToIn = (cm) => (parseFloat(cm) / 2.54).toFixed(1);
const inToCm = (inches) => (parseFloat(inches) * 2.54).toFixed(1);

const WeightManualEntry = ({weightVal, setWeightVal, heightVal, setHeightVal, waistVal, setWaistVal, unit = 'metric'}) => {
  const isImp = unit === 'imperial';
  const [numpadVisible, setNumpadVisible] = useState(false);
  const [numpadTarget, setNumpadTarget] = useState('weight');
  const [numpadVal, setNumpadVal] = useState('');

  const bmi = useMemo(() => {
    const w = parseFloat(weightVal);
    const h = parseFloat(heightVal);
    if (isNaN(w) || isNaN(h) || h === 0) return null;
    return Math.round((w / ((h / 100) * (h / 100))) * 10) / 10;
  }, [weightVal, heightVal]);

  const idealWeight = useMemo(() => {
    const h = parseFloat(heightVal);
    if (isNaN(h) || h === 0) return null;
    return Math.round(23.0 * (h / 100) * (h / 100) * 10) / 10;
  }, [heightVal]);

  const toLose = useMemo(() => {
    const w = parseFloat(weightVal);
    if (isNaN(w) || !idealWeight) return null;
    return Math.round((w - idealWeight) * 10) / 10;
  }, [weightVal, idealWeight]);

  const whr = useMemo(() => {
    const w2 = parseFloat(waistVal);
    const h = parseFloat(heightVal);
    if (isNaN(w2) || isNaN(h) || h === 0) return null;
    return Math.round((w2 / h) * 100) / 100;
  }, [waistVal, heightVal]);

  const getBMICategory = () => {
    if (!bmi) return {label: '', color: Colors.textTertiary, bg: Colors.background};
    if (bmi < 18.5) return {label: 'Underweight', color: Colors.blueText, bg: Colors.blueBg};
    if (bmi < 23) return {label: 'Normal - Indian standard', color: Colors.tealText, bg: Colors.tealBg};
    if (bmi < 27.5) return {label: 'Overweight - Indian standard', color: Colors.amberDark, bg: Colors.amberBg};
    return {label: 'Obese - Indian standard', color: Colors.redDark, bg: Colors.redBg};
  };

  const bmiCat = getBMICategory();
  const bmiColor = bmi ? (bmi < 18.5 ? '#92c4ff' : bmi < 23 ? Colors.paleGreen : bmi < 27.5 ? '#FAC775' : '#F09595') : '#FAC775';

  // SVG dial calculations
  const dialAngle = useMemo(() => {
    if (!bmi) return 0;
    // Map BMI 15-35 to -90 to +90 degrees
    const clamped = Math.min(35, Math.max(15, bmi));
    return ((clamped - 15) / 20) * 180 - 90;
  }, [bmi]);

  // BMI bar marker position (15-40 range mapped to 0-100%)
  const bmiBarPct = useMemo(() => {
    if (!bmi) return 0;
    return Math.min(100, Math.max(0, (bmi - 15) / 25 * 100));
  }, [bmi]);

  // Display values based on unit
  const displayWeight = isImp ? kgToLb(weightVal) : weightVal;
  const displayHeight = isImp ? cmToIn(heightVal) : heightVal;
  const displayWaist = isImp ? cmToIn(waistVal) : waistVal;
  const wUnit = isImp ? 'lb' : 'kg';
  const hUnit = isImp ? 'in' : 'cm';
  const displayIdealWeight = idealWeight ? (isImp ? kgToLb(idealWeight) : String(idealWeight)) : null;
  const displayToLose = toLose ? (isImp ? (parseFloat(kgToLb(weightVal)) - parseFloat(kgToLb(idealWeight))).toFixed(1) : String(toLose)) : null;
  const displayHeightFtIn = isImp ? cmToFtIn(heightVal) : null;

  // Numpad config (dynamic based on unit)
  const getNpConfig = () => {
    if (isImp) {
      return {
        weight: {label: 'Weight', hint: `Weight in lb - Ideal range: ${kgToLb(49)}-${kgToLb(61)} lb`, range: 'Range: 66-330 lb', min: 66, max: 330},
        height: {label: 'Height', hint: `Height in inches - Your recorded: ${cmToIn(heightVal)} in`, range: 'Range: 39-87 in', min: 39, max: 87},
        waist: {label: 'Waist circumference', hint: 'Measured at navel - Target: <31.5 in', range: 'Range: 20-59 in', min: 20, max: 59},
      };
    }
    return NP_CONFIG;
  };

  const openNumpad = (target) => {
    setNumpadTarget(target);
    setNumpadVal('');
    setNumpadVisible(true);
  };
  const npPress = (d) => setNumpadVal(prev => {
    if (d === '.' && prev.includes('.')) return prev;
    if (prev.replace('.', '').length >= 5) return prev;
    return prev + d;
  });
  const npDel = () => setNumpadVal(prev => prev.slice(0, -1));
  const npConfirm = () => {
    const val = parseFloat(numpadVal);
    const npCfg = getNpConfig()[numpadTarget];
    if (!isNaN(val) && val >= npCfg.min && val <= npCfg.max) {
      if (numpadTarget === 'weight') {
        setWeightVal(isImp ? lbToKg(val) : val.toFixed(1));
      } else if (numpadTarget === 'height') {
        setHeightVal(isImp ? inToCm(val) : String(val));
      } else {
        setWaistVal(isImp ? inToCm(val) : String(val));
      }
    }
    setNumpadVisible(false);
  };

  const cfg = getNpConfig()[numpadTarget];

  return (
    <View>
      {/* Best practice card */}
      <View style={st.tipCard}>
        <AppText variant="subtext" color={Colors.primary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginBottom: vs(7)}}>
          Best practice - Accurate weigh-in
        </AppText>
        {[
          {text: 'Morning, fasting - weigh first thing before eating/drinking', ok: true},
          {text: 'Minimal clothing - light or no clothing for consistency', ok: true},
          {text: 'Same time daily - gives most consistent, comparable reading', ok: true},
          {text: isImp ? 'Evening readings are 1.8-3.3 lb heavier than morning due to food and water. Don\'t compare them.' : 'Evening readings are 0.8-1.5 kg heavier than morning due to food and water. Don\'t compare them.', ok: false},
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

      {/* Weight + Height dual input */}
      <View style={st.secLabel}>
        <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>Weight & height</AppText>
        <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
      </View>
      <View style={st.dualRow}>
        <TouchableOpacity style={st.dimBox} onPress={() => openNumpad('weight')} activeOpacity={0.6}>
          <AppText style={st.dimLabel}>WEIGHT</AppText>
          <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
            <AppText style={[st.dimVal, {color: Colors.primary}]}>{displayWeight ? displayWeight.split('.')[0] : '---'}</AppText>
            {displayWeight && displayWeight.includes('.') && (
              <AppText style={[st.dimDec, {color: Colors.primary}]}>.{displayWeight.split('.')[1]}</AppText>
            )}
          </View>
          <AppText style={st.dimUnit}>{wUnit}</AppText>
          <AppText style={st.dimTap}>Tap to edit</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={st.dimBox} onPress={() => openNumpad('height')} activeOpacity={0.6}>
          <AppText style={st.dimLabel}>HEIGHT</AppText>
          <AppText style={[st.dimVal, {color: Colors.textSecondary, fontSize: isImp ? ms(36) : ms(52)}]}>{isImp ? displayHeightFtIn : (heightVal || '---')}</AppText>
          <AppText style={st.dimUnit}>{isImp ? 'ft / in' : 'cm'}</AppText>
          <AppText style={st.dimTap}>Tap to edit</AppText>
        </TouchableOpacity>
      </View>

      {/* Height carried forward note */}
      <View style={st.noteRow}>
        <Icon family="Ionicons" name="lock-closed-outline" size={ms(14)} color={Colors.textTertiary} />
        <AppText variant="small" color={Colors.textSecondary} style={{flex: 1}}>Height carried forward from last record ({isImp ? cmToFtIn('163') : '163 cm'} - Sep 2025). Tap to update.</AppText>
      </View>

      {/* BMI live card with SVG dial */}
      {bmi && (
        <View style={st.bmiCard}>
          <View style={{flexShrink: 0}}>
            <Svg viewBox="0 0 80 80" width={ms(80)} height={ms(80)}>
              <Path d="M14 62 A34 34 0 0 1 66 62" fill="none" stroke="rgba(255,255,255,0.12)" strokeWidth="7" strokeLinecap="round" />
              <Path
                d="M14 62 A34 34 0 0 1 66 62"
                fill="none"
                stroke={Colors.paleGreen}
                strokeWidth="7"
                strokeLinecap="round"
                strokeDasharray="106.8"
                strokeDashoffset={106.8 - (106.8 * Math.min(1, Math.max(0, (bmi - 15) / 20)))}
              />
              <Line
                x1="40" y1="40" x2="40" y2="14"
                stroke="#fff" strokeWidth="2.5" strokeLinecap="round"
                transform={`rotate(${dialAngle} 40 40)`}
              />
              <Circle cx="40" cy="40" r="4" fill="#fff" />
              <SvgText x="40" y="55" textAnchor="middle" fontSize="13" fontWeight="700" fill="#fff">{bmi}</SvgText>
            </Svg>
          </View>
          <View style={{flex: 1}}>
            <AppText variant="subtext" color="rgba(255,255,255,0.45)" style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5, marginBottom: vs(4)}}>BMI - Indian standard</AppText>
            <View style={{flexDirection: 'row', alignItems: 'baseline', gap: s(6)}}>
              <AppText style={{fontSize: ms(38), fontWeight: '700', color: bmiColor, lineHeight: ms(40)}}>{bmi}</AppText>
              <AppText style={{fontSize: ms(13), fontWeight: '600', color: bmiColor}}>{bmiCat.label.split(' - ')[0]}</AppText>
            </View>
            {toLose > 0 && idealWeight && (
              <View style={{marginTop: vs(8)}}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8)}}>
                  <AppText variant="small" color="rgba(255,255,255,0.5)">To BMI 23:</AppText>
                  <View style={{flex: 1, height: ms(4), backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: ms(2), overflow: 'hidden'}}>
                    <View style={{height: '100%', width: `${Math.min(100, Math.max(0, Math.round((72.4 - parseFloat(weightVal)) / (72.4 - idealWeight) * 100)))}%`, backgroundColor: Colors.paleGreen, borderRadius: ms(2)}} />
                  </View>
                  <AppText variant="small" color="rgba(255,255,255,0.5)">-{displayToLose} {wUnit}</AppText>
                </View>
                <AppText variant="small" color="rgba(255,255,255,0.45)" style={{marginTop: vs(4)}}>Ideal weight: {displayIdealWeight} {wUnit} - Height: {isImp ? displayHeightFtIn : `${heightVal} cm`}</AppText>
              </View>
            )}
          </View>
        </View>
      )}

      {/* BMI classification bar */}
      {bmi && (
        <View style={st.classBarCard}>
          <AppText style={{fontSize: ms(11), fontWeight: '600', color: Colors.textPrimary, marginBottom: vs(6)}}>BMI classification - Indian/WHO Asia-Pacific 2004</AppText>
          <View style={{position: 'relative', marginBottom: vs(2)}}>
            <View style={{flexDirection: 'row', borderRadius: ms(5), overflow: 'hidden', height: ms(10)}}>
              {BMI_ZONES.map((z, i) => (
                <View key={i} style={{flex: z.flex, backgroundColor: z.color, height: '100%'}} />
              ))}
            </View>
            {/* Marker */}
            <View style={{position: 'absolute', top: ms(-4), left: `${bmiBarPct}%`, marginLeft: ms(-2), width: ms(4), height: ms(18), backgroundColor: Colors.textPrimary, borderRadius: ms(2)}} />
          </View>
          <View style={{position: 'relative', height: ms(16), marginBottom: vs(4)}}>
            <View style={{position: 'absolute', left: `${Math.max(0, bmiBarPct - 5)}%`}}>
              <AppText style={{fontSize: ms(8), fontWeight: '700', color: Colors.primary}}>You {bmi}</AppText>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <AppText style={{fontSize: ms(8), color: Colors.blueText}}>Under{'<'}18.5</AppText>
            <AppText style={{fontSize: ms(8), color: Colors.tealText}}>Normal 18.5-23</AppText>
            <AppText style={{fontSize: ms(8), color: Colors.amberDark}}>OW 23-27.5</AppText>
            <AppText style={{fontSize: ms(8), color: Colors.redDark}}>Obese {'>'}27.5</AppText>
          </View>
        </View>
      )}

      {/* Derived values grid */}
      <View style={st.derivedGrid}>
        <View style={st.derivedBox}>
          <AppText style={st.dgLabel}>Ideal weight range</AppText>
          <AppText style={[st.dgVal, {fontSize: ms(14), color: Colors.primary}]}>{isImp ? `${kgToLb(49)}-${kgToLb(61)} lb` : '49-61 kg'}</AppText>
          <AppText style={st.dgSub}>BMI 18.5-23 at {isImp ? displayHeightFtIn : `${heightVal}cm`}</AppText>
        </View>
        <View style={st.derivedBox}>
          <AppText style={st.dgLabel}>To reach BMI 23</AppText>
          <AppText style={[st.dgVal, {color: Colors.amber}]}>{toLose > 0 ? `-${displayToLose} ${wUnit}` : 'At target'}</AppText>
          <AppText style={st.dgSub}>{displayWeight} to {displayIdealWeight} {wUnit}</AppText>
        </View>
        <TouchableOpacity style={st.derivedBox} onPress={() => openNumpad('waist')} activeOpacity={0.7}>
          <AppText style={st.dgLabel}>Waist circumference</AppText>
          <AppText style={[st.dgVal, {color: Colors.red}]}>{displayWaist} {isImp ? 'in' : 'cm'}</AppText>
          <AppText style={st.dgSub}>Target {'<'}{isImp ? '31.5 in' : '80 cm'} - Tap to update</AppText>
        </TouchableOpacity>
        <View style={st.derivedBox}>
          <AppText style={st.dgLabel}>Waist / height ratio</AppText>
          <AppText style={[st.dgVal, {color: whr && whr > 0.5 ? Colors.amber : Colors.primary}]}>{whr || '--'}</AppText>
          <AppText style={st.dgSub}>Target {'<'}0.50</AppText>
        </View>
        <View style={st.derivedBox}>
          <AppText style={st.dgLabel}>vs Last recorded</AppText>
          <AppText style={[st.dgVal, {color: Colors.primary}]}>{isImp ? '-1.8 lb' : '-0.8 kg'}</AppText>
          <AppText style={st.dgSub}>vs {isImp ? `${kgToLb('69.2')} lb` : '69.2 kg'} (Sep 2025)</AppText>
        </View>
        <View style={st.derivedBox}>
          <AppText style={st.dgLabel}>Loss rate (6 months)</AppText>
          <AppText style={[st.dgVal, {color: Colors.primary}]}>{isImp ? '-0.29' : '-0.13'}</AppText>
          <AppText style={st.dgSub}>{isImp ? 'lb' : 'kg'}/week - Healthy pace</AppText>
        </View>
      </View>

      {/* ── "or use sliders" section ── */}
      <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginBottom: vs(6)}}>-- or use sliders --</AppText>
      <View style={st.sliderSection}>
        {/* Weight slider */}
        <View style={{marginBottom: vs(14)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(8)}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
              <Icon family="Ionicons" name="scale-outline" size={ms(16)} color={Colors.textPrimary} />
              <AppText style={{fontSize: ms(12), fontWeight: '600', color: Colors.textPrimary}}>Weight</AppText>
            </View>
            <View style={[st.sliderBadge, {backgroundColor: Colors.purpleBg}]}>
              <AppText style={{fontSize: ms(13), fontWeight: '700', color: Colors.purpleText}}>{displayWeight} {wUnit}</AppText>
            </View>
          </View>
          {/* Track */}
          <View style={st.sliderTrack}>
            <View style={[st.sliderFill, {width: `${((parseFloat(weightVal) - 30) / 120) * 100}%`}]}>
              <View style={{flex: 1, flexDirection: 'row', borderRadius: ms(4), overflow: 'hidden'}}>
                <View style={{flex: 1, backgroundColor: Colors.blue}} />
                <View style={{flex: 1, backgroundColor: Colors.tealDark}} />
                <View style={{flex: 1, backgroundColor: Colors.amber}} />
                <View style={{flex: 1, backgroundColor: Colors.red}} />
              </View>
            </View>
          </View>
          {/* Thumb - touchable area to adjust */}
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(6)}}>
            {WEIGHT_MARKS.map((m, i) => (
              <TouchableOpacity key={i} onPress={() => setWeightVal(m)} activeOpacity={0.7}>
                <AppText style={{fontSize: ms(8), color: m === '61.2' ? Colors.primary : Colors.textTertiary, fontWeight: m === '61.2' ? '700' : '400'}}>{m === '61.2' ? '61.2 target' : m}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Height slider */}
        <View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(8)}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
              <Icon family="Ionicons" name="resize-outline" size={ms(16)} color={Colors.textPrimary} />
              <AppText style={{fontSize: ms(12), fontWeight: '600', color: Colors.textPrimary}}>Height</AppText>
            </View>
            <View style={[st.sliderBadge, {backgroundColor: '#f0f0f0'}]}>
              <AppText style={{fontSize: ms(13), fontWeight: '700', color: Colors.textSecondary}}>{isImp ? displayHeightFtIn : `${heightVal} cm`}</AppText>
            </View>
          </View>
          <View style={st.sliderTrack}>
            <View style={[st.sliderFill, {width: `${((parseFloat(heightVal) - 100) / 120) * 100}%`}]}>
              <View style={{flex: 1, backgroundColor: Colors.textSecondary, borderRadius: ms(4)}} />
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(6)}}>
            {HEIGHT_MARKS.map((m, i) => (
              <TouchableOpacity key={i} onPress={() => setHeightVal(m)} activeOpacity={0.7}>
                <AppText style={{fontSize: ms(8), color: m === '163' ? Colors.primary : Colors.textTertiary, fontWeight: m === '163' ? '700' : '400'}}>{m}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Numpad Modal */}
      <Modal visible={numpadVisible} transparent animationType="slide" onRequestClose={() => setNumpadVisible(false)}>
        <Pressable style={st.numpadOverlay} onPress={() => setNumpadVisible(false)}>
          <Pressable style={st.numpadSheet} onPress={e => e.stopPropagation()}>
            <View style={st.numpadHeader}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>{cfg.label}</AppText>
              <TouchableOpacity onPress={() => setNumpadVisible(false)} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                <Icon family="Ionicons" name="close" size={ms(22)} color={Colors.textSecondary} />
              </TouchableOpacity>
            </View>
            <View style={st.numpadDisplay}>
              <AppText style={[st.numpadValue, !numpadVal && {color: Colors.textTertiary}]}>{numpadVal || '---'}</AppText>
            </View>
            <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center', marginTop: vs(4)}}>{cfg.hint}</AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(2), marginBottom: vs(8)}}>{cfg.range}</AppText>
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
  secLabel: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(8)},
  dualRow: {flexDirection: 'row', gap: s(10), marginBottom: vs(10)},
  dimBox: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(14), alignItems: 'center'},
  dimLabel: {fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(5)},
  dimVal: {fontSize: ms(52), fontWeight: '700', lineHeight: ms(54)},
  dimDec: {fontSize: ms(28), fontWeight: '700'},
  dimUnit: {fontSize: ms(12), color: Colors.textTertiary, marginTop: vs(4)},
  dimTap: {fontSize: ms(9), color: Colors.textTertiary, marginTop: vs(5)},
  noteRow: {flexDirection: 'row', alignItems: 'center', gap: s(7), backgroundColor: Colors.background, borderRadius: ms(10), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(9), marginBottom: vs(10)},
  bmiCard: {backgroundColor: Colors.primary, borderRadius: ms(14), padding: ms(14), marginBottom: vs(10), flexDirection: 'row', alignItems: 'center', gap: s(12)},
  classBarCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(13), marginBottom: vs(10)},
  derivedGrid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: vs(10)},
  derivedBox: {width: '48%', backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(10), marginBottom: vs(8)},
  dgLabel: {fontSize: ms(8), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, color: Colors.textTertiary, marginBottom: vs(4)},
  dgVal: {fontSize: ms(18), fontWeight: '700', lineHeight: ms(20)},
  dgSub: {fontSize: ms(9), color: Colors.textSecondary, marginTop: vs(3)},
  sliderSection: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(14), marginBottom: vs(10)},
  sliderTrack: {height: ms(8), backgroundColor: '#edf2ef', borderRadius: ms(4), overflow: 'hidden'},
  sliderFill: {height: '100%', borderRadius: ms(4), overflow: 'hidden'},
  sliderBadge: {paddingHorizontal: s(10), paddingVertical: vs(3), borderRadius: ms(20)},
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

export default WeightManualEntry;
