import React, {useState, useRef, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Alert,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const OTPScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [countdown, setCountdown] = useState(30);
  const refs = useRef([]);

  useEffect(() => {
    if (countdown <= 0) return;
    const timer = setInterval(() => {
      setCountdown(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [countdown]);

  const handleChange = (text, index) => {
    const newOtp = [...otp];
    newOtp[index] = text;
    setOtp(newOtp);
    if (text && index < 5) {
      refs.current[index + 1]?.focus();
    }
  };

  const handleKeyPress = (e, index) => {
    if (e.nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      refs.current[index - 1]?.focus();
    }
  };

  const allFilled = otp.every(d => d !== '');

  const handleVerify = () => {
    if (otp.join('') === '000000') {
      Alert.alert('Invalid OTP', 'The code you entered is incorrect. Please try again.');
    } else {
      navigation.navigate('Personal');
    }
  };

  const handleResend = () => {
    setCountdown(30);
    setOtp(['', '', '', '', '', '']);
    refs.current[0]?.focus();
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
            <AppText variant="screenName" style={styles.headerTitle}>Enter the OTP</AppText>
            <AppText variant="caption" style={styles.headerSub}>6-digit code sent to +91 98480 12345</AppText>
          </View>
          <AppText variant="small" color="rgba(255,255,255,0.5)">Step 2 of 7</AppText>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: '28%'}]} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* OTP boxes */}
        <View style={styles.otpRow}>
          {otp.map((digit, i) => (
            <TextInput
              key={i}
              ref={el => (refs.current[i] = el)}
              style={[styles.otpBox, digit ? styles.otpBoxFilled : null]}
              value={digit}
              onChangeText={text => handleChange(text, i)}
              onKeyPress={e => handleKeyPress(e, i)}
              keyboardType="numeric"
              maxLength={1}
              selectTextOnFocus
            />
          ))}
        </View>

        {/* Countdown / Resend */}
        <View style={styles.resendRow}>
          {countdown > 0 ? (
            <AppText variant="caption" color={Colors.textTertiary}>
              Resend in {countdown}s
            </AppText>
          ) : (
            <TouchableOpacity onPress={handleResend}>
              <AppText variant="caption" color={Colors.accent}>Resend OTP</AppText>
            </TouchableOpacity>
          )}
        </View>

        {/* Info note */}
        <View style={styles.infoNote}>
          <AppText variant="caption" color={Colors.accent}>
            {'\uD83D\uDD12'} OTP is encrypted end-to-end and expires in 5 minutes. Never share it with anyone.
          </AppText>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + vs(12)}]}>
        <TouchableOpacity
          style={[styles.ctaBtn, !allFilled && styles.ctaDisabled]}
          onPress={handleVerify}
          activeOpacity={0.7}
          disabled={!allFilled}>
          <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>Verify</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
        </TouchableOpacity>
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
  backText: {color: Colors.white, fontSize: ms(15)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  progressTrack: {height: 3, backgroundColor: Colors.borderLight},
  progressFill: {height: 3, backgroundColor: Colors.accent},
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: s(20),
    paddingBottom: vs(20),
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(16),
    marginBottom: vs(20),
  },
  otpBox: {
    width: ms(48),
    height: ms(56),
    borderRadius: ms(12),
    backgroundColor: Colors.white,
    textAlign: 'center',
    fontSize: ms(22),
    fontWeight: '800',
    color: Colors.textPrimary,
  },
  otpBoxFilled: {
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  resendRow: {
    alignItems: 'center',
    marginBottom: vs(24),
  },
  infoNote: {
    backgroundColor: Colors.tealBg,
    borderLeftWidth: 2,
    borderLeftColor: Colors.accent,
    borderRadius: ms(10),
    padding: s(12),
  },
  bottomBar: {
    paddingHorizontal: s(20),
    paddingTop: vs(12),
    backgroundColor: Colors.background,
  },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(16),
    alignItems: 'center',
  },
  ctaDisabled: {
    opacity: 0.4,
  },
});

export default OTPScreen;
