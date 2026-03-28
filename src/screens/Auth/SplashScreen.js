import React from 'react';
import {View, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const SplashScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={[styles.container, {paddingTop: insets.top, paddingBottom: insets.bottom}]}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.center}>
        <AppText style={styles.emoji}>{'\uD83C\uDF3F'}</AppText>
        <AppText variant="screenName" style={styles.brand} color={Colors.textPrimary}>TrustLife</AppText>
        <AppText style={styles.tagline} color={Colors.accent}>
          Your Health. Connected. For Life.
        </AppText>
        <AppText style={styles.subtitle} color={Colors.textSecondary}>
          Health intelligence you can trust
        </AppText>

        <View style={styles.buttonRow}>
          <TouchableOpacity
            style={styles.outlineBtn}
            onPress={() => navigation.navigate('LoginHub')}
            activeOpacity={0.7}>
            <AppText variant="bodyBold" color={Colors.textPrimary}>Sign in</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.filledBtn}
            onPress={() => navigation.navigate('Welcome')}
            activeOpacity={0.7}>
            <AppText variant="bodyBold" color={Colors.white}>Get started</AppText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.footer}>
        <AppText variant="caption" color={Colors.textTertiary} style={styles.terms}>
          By continuing, you agree to our Terms & Privacy Policy
        </AppText>
        <AppText variant="small" color={Colors.textTertiary} style={styles.version}>
          v2.4.2 {'\u00B7'} TrustLife Health Technologies Pvt Ltd {'\u00B7'} DPDP Act 2023
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(24),
  },
  emoji: {
    fontSize: ms(60),
  },
  brand: {
    fontSize: ms(40),
    fontWeight: '800',
    marginTop: vs(8),
  },
  tagline: {
    fontSize: ms(10),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 1,
    textAlign: 'center',
    marginTop: vs(6),
  },
  subtitle: {
    fontSize: ms(13),
    fontStyle: 'italic',
    marginTop: vs(6),
    marginBottom: vs(40),
  },
  buttonRow: {
    flexDirection: 'row',
    gap: s(12),
  },
  outlineBtn: {
    flex: 1,
    paddingVertical: vs(14),
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
    alignItems: 'center',
  },
  filledBtn: {
    flex: 1,
    paddingVertical: vs(14),
    borderRadius: ms(14),
    backgroundColor: Colors.primary,
    alignItems: 'center',
  },
  footer: {
    alignItems: 'center',
    paddingBottom: vs(12),
    paddingHorizontal: s(24),
  },
  terms: {
    textAlign: 'center',
    marginBottom: vs(6),
  },
  version: {
    textAlign: 'center',
  },
});

export default SplashScreen;
