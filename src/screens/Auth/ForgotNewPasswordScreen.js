import React, {useState} from 'react';
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
import {PASSWORD_REQUIREMENTS} from '../../constants/authData';

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

const getStrength = (metCount) => {
  if (metCount <= 1) return {width: '20%', color: Colors.red, label: 'Very weak'};
  if (metCount === 2) return {width: '40%', color: '#F97316', label: 'Weak'};
  if (metCount === 3) return {width: '60%', color: Colors.amber, label: 'Fair'};
  if (metCount === 4) return {width: '80%', color: Colors.accent, label: 'Strong'};
  return {width: '100%', color: Colors.accent, label: 'Very strong'};
};

const ForgotNewPasswordScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const {resetType} = route.params;

  const [newPw, setNewPw] = useState('');
  const [showPw, setShowPw] = useState(false);
  const [confirmPw, setConfirmPw] = useState('');
  const [showConfirm, setShowConfirm] = useState(false);

  const reqResults = PASSWORD_REQUIREMENTS.map(req => new RegExp(req.regex).test(newPw));
  const metCount = reqResults.filter(Boolean).length;
  const allMet = reqResults.every(Boolean);
  const passwordsMatch = newPw === confirmPw && confirmPw.length > 0;
  const canSubmit = allMet && passwordsMatch;
  const strength = getStrength(metCount);

  const handleSubmit = () => {
    if (resetType === 'both') {
      navigation.navigate('ForgotNewPin', {resetType});
    } else {
      navigation.navigate('ForgotDone', {resetType});
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
            <AppText variant="screenName" style={styles.headerTitle}>New password</AppText>
            <AppText variant="caption" style={styles.headerSub}>Create a strong new password</AppText>
          </View>
      </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Step indicator */}
        <StepIndicator current={4} done={[1, 2, 3]} />

        {/* New password input */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="New password"
            placeholderTextColor={Colors.textTertiary}
            secureTextEntry={!showPw}
            value={newPw}
            onChangeText={setNewPw}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowPw(!showPw)} style={styles.eyeBtn}>
            <Icon family="Ionicons" name={showPw ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Strength meter */}
        {newPw.length > 0 && (
          <View style={styles.strengthWrap}>
            <View style={styles.strengthTrack}>
              <View style={[styles.strengthFill, {width: strength.width, backgroundColor: strength.color}]} />
            </View>
            <AppText variant="caption" color={strength.color} style={{marginTop: vs(4)}}>
              {strength.label}
            </AppText>
          </View>
        )}

        {/* Confirm password input */}
        <View style={[styles.inputRow, {marginTop: vs(12)}]}>
          <TextInput
            style={styles.input}
            placeholder="Confirm password"
            placeholderTextColor={Colors.textTertiary}
            secureTextEntry={!showConfirm}
            value={confirmPw}
            onChangeText={setConfirmPw}
            autoCapitalize="none"
          />
          <TouchableOpacity onPress={() => setShowConfirm(!showConfirm)} style={styles.eyeBtn}>
            <Icon family="Ionicons" name={showConfirm ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Match indicator */}
        {confirmPw.length > 0 && (
          <View style={styles.matchRow}>
            {passwordsMatch ? (
              <AppText variant="caption" color={Colors.accent}><Icon family="Ionicons" name="checkmark" size={10} color="#22c55e" /> Passwords match</AppText>
            ) : (
              <AppText variant="caption" color={Colors.red}><Icon family="Ionicons" name="close" size={10} color={Colors.red} /> Passwords do not match</AppText>
            )}
          </View>
        )}

        {/* Requirements card */}
        <View style={styles.card}>
          {PASSWORD_REQUIREMENTS.map((req, idx) => {
            const passes = reqResults[idx];
            return (
              <View key={idx} style={styles.reqRow}>
                <View style={[styles.reqIcon, passes ? styles.reqPass : styles.reqFail]}>
                  <Icon family="Ionicons" name={passes ? 'checkmark' : 'close'} size={10} color={Colors.white} />
                </View>
                <AppText variant="caption" color={passes ? Colors.textPrimary : Colors.textSecondary}>
                  {req.label}
                </AppText>
              </View>
            );
          })}
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + vs(12)}]}>
        <TouchableOpacity
          style={[styles.ctaBtn, !canSubmit && styles.ctaDisabled]}
          onPress={handleSubmit}
          activeOpacity={0.7}
          disabled={!canSubmit}>
          <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>Set password</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
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
    marginBottom: vs(16),
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
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    paddingHorizontal: s(14),
  },
  input: {
    flex: 1,
    paddingVertical: vs(14),
    fontSize: ms(13),
    color: Colors.textPrimary,
  },
  eyeBtn: {
    paddingLeft: s(8),
  },
  strengthWrap: {
    marginTop: vs(8),
    marginBottom: vs(4),
  },
  strengthTrack: {
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  strengthFill: {
    height: 4,
    borderRadius: 2,
  },
  matchRow: {
    marginTop: vs(6),
    marginBottom: vs(4),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginTop: vs(16),
  },
  reqRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  reqIcon: {
    width: 16,
    height: 16,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(8),
  },
  reqPass: {
    backgroundColor: Colors.accent,
  },
  reqFail: {
    backgroundColor: Colors.redBg,
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

export default ForgotNewPasswordScreen;
