import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import {RECOVERY_OPTIONS} from '../../constants/authData';

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

const ForgotStep0Screen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedOption, setSelectedOption] = useState(null);

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
            <AppText variant="screenName" style={styles.headerTitle}>Account recovery</AppText>
            <AppText variant="caption" style={styles.headerSub}>Choose what to reset</AppText>
          </View>
      </View>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Step indicator */}
        <StepIndicator current={1} done={[]} />

        {/* Recovery option cards */}
        {RECOVERY_OPTIONS.map(option => {
          const isSelected = selectedOption === option.id;
          return (
            <TouchableOpacity
              key={option.id}
              style={[styles.card, isSelected && styles.cardSelected]}
              activeOpacity={0.7}
              onPress={() => setSelectedOption(option.id)}>
              <View style={[styles.optionIcon, {backgroundColor: option.bg}]}>
                <AppText style={{fontSize: ms(18)}}>{option.ico}</AppText>
              </View>
              <View style={styles.optionText}>
                <AppText variant="bodyBold">{option.title}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>{option.sub}</AppText>
              </View>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + vs(12)}]}>
        <TouchableOpacity
          style={[styles.ctaBtn, !selectedOption && styles.ctaDisabled]}
          onPress={() => navigation.navigate('ForgotStep1', {resetType: selectedOption})}
          activeOpacity={0.7}
          disabled={!selectedOption}>
          <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>Continue</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
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
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  cardSelected: {
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(12),
  },
  optionText: {
    flex: 1,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: s(8),
  },
  radioSelected: {
    borderColor: Colors.accent,
  },
  radioDot: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: Colors.accent,
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

export default ForgotStep0Screen;
