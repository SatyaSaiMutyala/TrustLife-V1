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

const StepIndicator = ({done = []}) => (
  <View style={styles.stepsRow}>
    {STEPS.map((step, i) => {
      const isDone = done.includes(step);
      return (
        <React.Fragment key={step}>
          <View style={[styles.stepCircle, isDone && styles.stepDone]}>
            {isDone && (
              <Icon family="Ionicons" name="checkmark" size={12} color={Colors.white} />
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

const RESET_TITLES = {
  pw: 'Password reset!',
  pin: 'PIN reset!',
  both: 'All done!',
};

const RESET_TYPE_LABELS = {
  pw: 'Password',
  pin: 'PIN',
  both: 'Password & PIN',
};

const ForgotDoneScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const {resetType} = route.params;

  const now = new Date();
  const timestamp = now.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });

  const details = [
    {label: 'Reset type', value: RESET_TYPE_LABELS[resetType]},
    {label: 'Verified via', value: 'OTP verification'},
    {label: 'Changed at', value: timestamp},
    {label: 'Sessions', value: 'All invalidated'},
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Green header */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <AppText variant="screenName" style={styles.headerTitleCenter}>All done!</AppText>
        <AppText variant="caption" style={styles.headerSub}>Your credentials have been updated</AppText>
      </View>

      <ScrollView contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Step indicator - all done */}
        <StepIndicator done={[1, 2, 3, 4, 5]} />

        {/* Checkmark circle */}
        <View style={styles.centerContent}>
          <View style={styles.checkCircle}>
            <Icon family="Ionicons" name="lock-open" size={36} color={Colors.accent} />
          </View>

          {/* Title */}
          <AppText variant="screenName" style={styles.title}>
            {RESET_TITLES[resetType]}
          </AppText>

          {/* Subtitle */}
          <AppText variant="subtitle" color={Colors.textSecondary} style={styles.subtitle}>
            Your credentials have been updated successfully. All other sessions have been signed out for security.
          </AppText>
        </View>

        {/* Details card */}
        <View style={styles.card}>
          {details.map((item, idx) => (
            <View key={idx} style={[styles.detailRow, idx < details.length - 1 && styles.detailBorder]}>
              <AppText variant="caption" color={Colors.textSecondary}>{item.label}</AppText>
              <AppText variant="bodyBold" style={{textAlign: 'right', flex: 1, marginLeft: s(8)}}>
                {item.value}
              </AppText>
            </View>
          ))}
        </View>

        <View style={{height: vs(80)}} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + vs(12)}]}>
        <TouchableOpacity
          style={styles.ctaBtn}
          activeOpacity={0.7}
          onPress={() =>
            navigation.reset({
              index: 0,
              routes: [{name: 'LoginHub'}],
            })
          }>
          <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>Sign in</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
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
  headerTitleCenter: {color: Colors.white, fontSize: ms(18), fontWeight: '700', textAlign: 'center', marginBottom: vs(4)},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12), textAlign: 'center'},
  scrollContent: {
    paddingHorizontal: s(20),
    paddingTop: vs(20),
  },
  stepsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(28),
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
  stepLine: {
    flex: 1,
    height: 2,
    backgroundColor: Colors.borderLight,
    marginHorizontal: s(4),
  },
  centerContent: {
    alignItems: 'center',
    marginBottom: vs(20),
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.tealBg,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(16),
  },
  title: {
    fontSize: ms(28),
    fontWeight: '800',
    textAlign: 'center',
    marginBottom: vs(8),
  },
  subtitle: {
    textAlign: 'center',
    marginBottom: vs(8),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(8),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  detailBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: s(16),
    paddingTop: vs(12),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  ctaBtn: {
    backgroundColor: Colors.accent,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
  },
});

export default ForgotDoneScreen;
