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
            <View style={[styles.stepLine, (isDone || done.includes(step + 1)) ? {backgroundColor: Colors.accent} : null]} />
          )}
        </React.Fragment>
      );
    })}
  </View>
);

const METHOD_LABELS = {
  email: 'email',
  sms: 'phone',
  whatsapp: 'WhatsApp',
};

const ForgotStep2Screen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const {resetType, deliveryMethod} = route.params;

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
    if (resetType === 'pin') {
      navigation.navigate('ForgotNewPin', {resetType});
    } else {
      navigation.navigate('ForgotNewPassword', {resetType});
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
            <AppText variant="screenName" style={styles.headerTitle}>Enter the code</AppText>
            <AppText variant="caption" style={styles.headerSub}>Enter 6-digit verification code</AppText>
          </View>
      </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Step indicator */}
        <StepIndicator current={3} done={[1, 2]} />

        {/* Subtitle */}
        <AppText variant="body" color={Colors.textSecondary} style={styles.subtitle}>
          6-digit code sent to your {METHOD_LABELS[deliveryMethod] || deliveryMethod}
        </AppText>

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
              <AppText variant="caption" color={Colors.accent}>Resend code</AppText>
            </TouchableOpacity>
          )}
        </View>

        {/* Security note */}
        <View style={styles.infoNote}>
          <AppText variant="caption" color={Colors.accent}>
            {'🔒'} This code is encrypted end-to-end and expires in 5 minutes. Never share it with anyone.
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
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: s(20),
    paddingTop: vs(20),
    paddingBottom: vs(20),
  },
  header: {backgroundColor: Colors.primary, paddingBottom: vs(14), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
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
  subtitle: {
    marginBottom: vs(28),
  },
  otpRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
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

export default ForgotStep2Screen;
