import React, {useState, useEffect, useRef} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import {NUMPAD_KEYS} from '../../constants/authData';

const STEPS = [1, 2, 3, 4, 5];

const StepIndicator = ({current, done = []}) => (
  <View style={styles.stepsRow}>
    {STEPS.map((step, i) => {
      const isDone = done.includes(step);
      const isCurrent = step === current;
      return (
        <React.Fragment key={step}>
          <View
            style={[
              styles.stepCircle,
              isDone && styles.stepDone,
              isCurrent && styles.stepCurrent,
              !isDone && !isCurrent && styles.stepFuture,
            ]}>
            {isDone ? (
              <Icon family="Ionicons" name="checkmark" size={12} color={Colors.white} />
            ) : (
              <AppText variant="caption" color={isCurrent ? Colors.white : Colors.textTertiary}>
                {step}
              </AppText>
            )}
          </View>
          {i < STEPS.length - 1 && (
            <View style={[styles.stepLine, isDone && {backgroundColor: Colors.accent}]} />
          )}
        </React.Fragment>
      );
    })}
  </View>
);

const ForgotNewPinScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const {resetType} = route.params;

  const [stage, setStage] = useState('first'); // 'first' | 'confirm'
  const [pinVal, setPinVal] = useState('');
  const [firstPin, setFirstPin] = useState('');
  const [error, setError] = useState(false);

  const isPinOnly = resetType === 'pin';
  const activeStep = isPinOnly ? 4 : 5;
  const doneSteps = isPinOnly ? [1, 2, 3] : [1, 2, 3, 4];

  useEffect(() => {
    if (pinVal.length === 6) {
      if (stage === 'first') {
        setFirstPin(pinVal);
        setPinVal('');
        setStage('confirm');
      } else {
        if (pinVal === firstPin) {
          navigation.navigate('ForgotDone', {resetType});
        } else {
          setError(true);
          Alert.alert('PINs do not match', 'Please try again.');
          setTimeout(() => {
            setError(false);
            setPinVal('');
            setFirstPin('');
            setStage('first');
          }, 800);
        }
      }
    }
  }, [pinVal]);

  const handleKeyPress = (key) => {
    if (key.type === 'action') {
      // Clear
      setPinVal('');
      return;
    }
    if (key.type === 'delete') {
      setPinVal(prev => prev.slice(0, -1));
      return;
    }
    if (pinVal.length < 6) {
      setPinVal(prev => prev + key.val);
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Green header */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex:1,marginLeft:s(10)}}>
            <AppText variant="screenName" style={styles.headerTitle}>Set new PIN</AppText>
            <AppText variant="caption" style={styles.headerSub}>Choose a new 6-digit PIN</AppText>
          </View>
      </View>
      </View>

      <View style={styles.content}>
        {/* Step indicator */}
        <StepIndicator current={activeStep} done={doneSteps} />

        {/* Title */}
        <AppText variant="screenName" style={styles.title}>
          {stage === 'first' ? 'Set new PIN' : 'Confirm PIN'}
        </AppText>

        {/* PIN dots */}
        <View style={styles.dotsRow}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <View
              key={i}
              style={[
                styles.dot,
                pinVal.length > i && (error ? styles.dotError : styles.dotFilled),
              ]}
            />
          ))}
        </View>

        {/* Hint text */}
        <AppText variant="caption" color={Colors.textTertiary} style={styles.hint}>
          {stage === 'first'
            ? 'Enter a 6-digit PIN you will remember'
            : 'Re-enter your PIN to confirm'}
        </AppText>
      </View>

      {/* Numpad */}
      <View style={[styles.numpad, {paddingBottom: insets.bottom + vs(8)}]}>
        {[0, 1, 2, 3].map(row => (
          <View key={row} style={styles.numpadRow}>
            {NUMPAD_KEYS.slice(row * 3, row * 3 + 3).map((key, idx) => (
              <TouchableOpacity
                key={idx}
                style={styles.numpadKey}
                activeOpacity={0.6}
                onPress={() => handleKeyPress(key)}>
                {key.type === 'action' ? (
                  <AppText variant="caption" color={Colors.textSecondary}>Clear</AppText>
                ) : key.type === 'delete' ? (
                  <Icon family="Ionicons" name="backspace-outline" size={22} color={Colors.textPrimary} />
                ) : (
                  <View style={styles.numpadKeyContent}>
                    <AppText style={styles.numpadDigit}>{key.val}</AppText>
                    {key.sub ? (
                      <AppText variant="small" color={Colors.textTertiary}>{key.sub}</AppText>
                    ) : null}
                  </View>
                )}
              </TouchableOpacity>
            ))}
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    flex: 1,
    paddingHorizontal: s(20),
    paddingTop: vs(20),
    alignItems: 'center',
  },
  header: {backgroundColor: Colors.primary, paddingBottom: vs(14), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'stretch',
    marginBottom: vs(20),
  },
  stepCircle: {
    width: 28,
    height: 28,
    borderRadius: 14,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepDone: {
    backgroundColor: Colors.accent,
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  stepCurrent: {
    backgroundColor: Colors.accent,
  },
  stepFuture: {
    backgroundColor: Colors.white,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
  },
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.borderLight,
    marginHorizontal: s(4),
  },
  title: {
    fontSize: ms(22),
    fontWeight: '800',
    marginBottom: vs(24),
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(14),
    marginBottom: vs(12),
  },
  dot: {
    width: ms(14),
    height: ms(14),
    borderRadius: ms(7),
    backgroundColor: Colors.borderLight,
  },
  dotFilled: {
    backgroundColor: Colors.accent,
  },
  dotError: {
    backgroundColor: Colors.red,
  },
  hint: {
    textAlign: 'center',
    marginBottom: vs(16),
  },
  numpad: {
    paddingHorizontal: s(20),
    paddingTop: vs(8),
    backgroundColor: Colors.background,
  },
  numpadRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: vs(8),
  },
  numpadKey: {
    width: ms(72),
    height: ms(56),
    borderRadius: ms(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  numpadKeyContent: {
    alignItems: 'center',
  },
  numpadDigit: {
    fontSize: ms(24),
    fontWeight: '600',
    color: Colors.textPrimary,
  },
});

export default ForgotNewPinScreen;
