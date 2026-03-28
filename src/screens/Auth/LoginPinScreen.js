import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import {NUMPAD_KEYS} from '../../constants/authData';

const LoginPinScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [pin, setPin] = useState('');
  const [error, setError] = useState(false);
  const timerRef = useRef(null);

  useEffect(() => {
    if (pin.length === 6) {
      timerRef.current = setTimeout(() => {
        if (pin === '000000') {
          setError(true);
          Alert.alert('Incorrect PIN', 'The PIN you entered is incorrect. Please try again.');
          setTimeout(() => {
            setError(false);
            setPin('');
          }, 800);
        } else {
          navigation.navigate('LoginSuccess', {method: '6-digit PIN'});
        }
      }, 300);
    }
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, [pin, navigation]);

  const handleKeyPress = useCallback((key) => {
    if (key.type === 'action') {
      navigation.navigate('ForgotStep0');
      return;
    }
    if (key.type === 'delete') {
      setPin(prev => prev.slice(0, -1));
      return;
    }
    setPin(prev => (prev.length < 6 ? prev + key.val : prev));
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Green Header */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex:1,marginLeft:s(10)}}>
            <AppText variant="screenName" style={styles.headerTitle}>Enter your PIN</AppText>
            <AppText variant="caption" style={styles.headerSub}>6-digit health access PIN</AppText>
          </View>
      </View>
      </View>

      <View style={styles.content}>
        {/* PIN Dots */}
        <View style={styles.dotsRow}>
          {[0, 1, 2, 3, 4, 5].map(i => (
            <View
              key={i}
              style={[
                styles.dot,
                pin.length > i && styles.dotFilled,
                error && styles.dotError,
              ]}
            />
          ))}
        </View>

        {/* Numpad */}
        <View style={styles.numpad}>
          {NUMPAD_KEYS.map((key, idx) => (
            <TouchableOpacity
              key={idx}
              style={styles.numKey}
              activeOpacity={0.6}
              onPress={() => handleKeyPress(key)}
            >
              {key.type === 'action' ? (
                <AppText variant="caption" color={Colors.accent}>Forgot?</AppText>
              ) : key.type === 'delete' ? (
                <Icon family="Ionicons" name="backspace-outline" size={22} color={Colors.textPrimary} />
              ) : (
                <View style={{alignItems: 'center'}}>
                  <AppText style={styles.numText}>{key.val}</AppText>
                  {key.sub && (
                    <AppText variant="small" color={Colors.textTertiary} style={{marginTop: -vs(2)}}>
                      {key.sub}
                    </AppText>
                  )}
                </View>
              )}
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {backgroundColor: Colors.primary, paddingBottom: vs(14), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  content: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingTop: vs(20),
  },
  dotsRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginBottom: vs(28),
  },
  dot: {
    width: 16,
    height: 16,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: Colors.borderLight,
    marginHorizontal: s(6),
  },
  dotFilled: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
    shadowColor: Colors.accent,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.3,
    shadowRadius: 4,
    elevation: 3,
  },
  dotError: {
    backgroundColor: Colors.red,
    borderColor: Colors.red,
  },
  numpad: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    width: '100%',
    maxWidth: s(280),
  },
  numKey: {
    width: '30%',
    height: ms(60),
    borderRadius: ms(14),
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    margin: s(4),
  },
  numText: {
    fontSize: ms(22),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
});

export default LoginPinScreen;
