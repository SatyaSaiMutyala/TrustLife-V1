import React, {useState, useCallback, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  Animated,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';

const BUTTONS = [
  '1', '2', '3',
  '4', '5', '6',
  '7', '8', '9',
  '.', '0', '⌫',
];

const NumpadSheet = ({visible, label, hint, onConfirm, onClose}) => {
  const [val, setVal] = useState('');
  const [hasDecimal, setHasDecimal] = useState(false);
  const flashAnim = useRef(new Animated.Value(0)).current;

  /* Reset state when sheet opens */
  useEffect(() => {
    if (visible) {
      setVal('');
      setHasDecimal(false);
    }
  }, [visible]);

  const flashRed = useCallback(() => {
    flashAnim.setValue(1);
    Animated.timing(flashAnim, {
      toValue: 0,
      duration: 400,
      useNativeDriver: false,
    }).start();
  }, [flashAnim]);

  const npPress = useCallback(
    (key) => {
      if (key === '⌫') {
        setVal((prev) => {
          const next = prev.slice(0, -1);
          if (prev.endsWith('.')) setHasDecimal(false);
          return next;
        });
        return;
      }

      if (key === '.') {
        if (hasDecimal) return;
        setHasDecimal(true);
        setVal((prev) => (prev === '' ? '0.' : prev + '.'));
        return;
      }

      /* Max 5 digits (excluding the dot) */
      setVal((prev) => {
        const digitsOnly = prev.replace('.', '');
        if (digitsOnly.length >= 5) return prev;
        return prev + key;
      });
    },
    [hasDecimal],
  );

  const npConfirm = useCallback(() => {
    const parsed = parseFloat(val);
    if (isNaN(parsed) || val === '') {
      flashRed();
      return;
    }
    onConfirm?.(parsed);
    onClose?.();
  }, [val, onConfirm, onClose, flashRed]);

  const displayColor = flashAnim.interpolate({
    inputRange: [0, 1],
    outputRange: [Colors.accent, Colors.red],
  });

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              {/* Handle */}
              <View style={styles.handleRow}>
                <View style={styles.handle} />
              </View>

              {/* Label */}
              <AppText style={styles.label}>{label}</AppText>

              {/* Display */}
              <View style={styles.displayBox}>
                <Animated.Text
                  style={[styles.displayText, {color: displayColor}]}>
                  {val || '0'}
                </Animated.Text>
              </View>

              {/* Hint */}
              <AppText style={styles.hint}>{hint}</AppText>

              {/* Numpad grid */}
              <View style={styles.grid}>
                {BUTTONS.map((btn) => {
                  const isBackspace = btn === '⌫';
                  return (
                    <TouchableOpacity
                      key={btn}
                      activeOpacity={0.6}
                      style={styles.gridBtn}
                      onPress={() => npPress(btn)}>
                      <AppText
                        style={[
                          styles.gridBtnText,
                          isBackspace && styles.gridBtnBackspace,
                        ]}>
                        {btn}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>

              {/* OK button */}
              <TouchableOpacity
                activeOpacity={0.8}
                style={styles.okBtn}
                onPress={npConfirm}>
                <AppText style={styles.okBtnText}>OK ✓</AppText>
              </TouchableOpacity>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: ms(22),
    borderTopRightRadius: ms(22),
    paddingBottom: vs(24),
    paddingHorizontal: s(20),
  },

  /* ── Handle ── */
  handleRow: {
    alignItems: 'center',
    paddingTop: vs(10),
    paddingBottom: vs(6),
  },
  handle: {
    width: s(36),
    height: vs(4),
    borderRadius: ms(2),
    backgroundColor: Colors.borderLight,
  },

  /* ── Label ── */
  label: {
    fontSize: ms(13),
    fontWeight: '700',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginTop: vs(4),
  },

  /* ── Display ── */
  displayBox: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: vs(70),
    paddingVertical: vs(8),
  },
  displayText: {
    fontSize: ms(52),
    fontWeight: '700',
    color: Colors.accent,
  },

  /* ── Hint ── */
  hint: {
    fontSize: ms(10),
    fontWeight: '500',
    color: Colors.textTertiary,
    textAlign: 'center',
    marginBottom: vs(12),
  },

  /* ── Grid ── */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: s(8),
  },
  gridBtn: {
    width: '30%',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(13),
    borderRadius: ms(12),
    backgroundColor: Colors.background,
  },
  gridBtnText: {
    fontSize: ms(22),
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  gridBtnBackspace: {
    fontSize: ms(18),
    color: Colors.textTertiary,
  },

  /* ── OK ── */
  okBtn: {
    marginTop: vs(12),
    backgroundColor: Colors.accent,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
  },
  okBtnText: {
    fontSize: ms(16),
    fontWeight: '700',
    color: Colors.white,
  },
});

export default NumpadSheet;
