import React, {useState, useEffect} from 'react';
import {View, Modal, TouchableOpacity, StyleSheet, TouchableWithoutFeedback} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

const KEYS = ['1', '2', '3', '4', '5', '6', '7', '8', '9', '.', '0', 'del'];

const NumpadModal = ({visible, title, hint, initialValue, onClose, onConfirm}) => {
  const [value, setValue] = useState(initialValue || '');

  useEffect(() => {
    if (visible) setValue(initialValue || '');
  }, [visible, initialValue]);

  const press = (k) => {
    if (k === 'del') {
      setValue(prev => prev.slice(0, -1));
      return;
    }
    if (k === '.' && value.includes('.')) return;
    if (value.replace('.', '').length >= 5) return;
    setValue(prev => prev + k);
  };

  const confirm = () => {
    const v = parseFloat(value);
    if (!isNaN(v)) onConfirm(v);
    onClose();
  };

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={st.overlay}>
          <TouchableWithoutFeedback>
            <View style={st.sheet}>
              <View style={st.handle} />
              <View style={st.header}>
                <AppText variant="bodyBold" color={Colors.textPrimary}>{title || 'Enter value'}</AppText>
                <TouchableOpacity onPress={onClose} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
                  <Icon family="Ionicons" name="close" size={ms(22)} color={Colors.textSecondary} />
                </TouchableOpacity>
              </View>
              <AppText variant="screenName" color={Colors.primary} style={st.display}>{value || '\u2014'}</AppText>
              {hint ? <AppText variant="subtext" color={Colors.textTertiary} style={{textAlign: 'center', paddingBottom: vs(8), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f5f5f5'}}>{hint}</AppText> : null}
              <View style={st.grid}>
                {KEYS.map((k) => (
                  <TouchableOpacity key={k} style={st.key} activeOpacity={0.6} onPress={() => press(k)}>
                    {k === 'del' ? (
                      <Icon family="Ionicons" name="backspace-outline" size={ms(20)} color={Colors.textSecondary} />
                    ) : (
                      <AppText variant="header" color={Colors.textPrimary} style={{fontSize: ms(22), fontWeight: '500'}}>{k}</AppText>
                    )}
                  </TouchableOpacity>
                ))}
                <TouchableOpacity style={st.confirmBtn} activeOpacity={0.85} onPress={confirm}>
                  <Icon family="Ionicons" name="checkmark" size={ms(18)} color={Colors.white} />
                  <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>Confirm</AppText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const st = StyleSheet.create({
  overlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.55)', justifyContent: 'flex-end'},
  sheet: {backgroundColor: Colors.white, borderTopLeftRadius: ms(22), borderTopRightRadius: ms(22), paddingBottom: vs(28)},
  handle: {alignSelf: 'center', width: ms(40), height: ms(4), borderRadius: ms(2), backgroundColor: '#E5DDD3', marginTop: vs(8)},
  header: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: s(20), paddingVertical: vs(12), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#f0f0f0'},
  display: {textAlign: 'center', fontSize: ms(40), fontWeight: '700', paddingVertical: vs(12), letterSpacing: 2},
  grid: {flexDirection: 'row', flexWrap: 'wrap', padding: s(10)},
  key: {width: '33.33%', paddingVertical: vs(13), alignItems: 'center', justifyContent: 'center'},
  confirmBtn: {width: '100%', flexDirection: 'row', backgroundColor: Colors.primary, borderRadius: ms(13), paddingVertical: vs(13), alignItems: 'center', justifyContent: 'center', marginTop: vs(6), marginHorizontal: s(3)},
});

export default NumpadModal;
