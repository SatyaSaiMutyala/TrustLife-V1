import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar, ScrollView, TextInput, Alert, Animated, Easing} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const PaymentProcessingScreen = ({route}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {method, plan, billMode} = route.params;

  const [processingDone, setProcessingDone] = useState(false);
  const spinAnim = useRef(new Animated.Value(0)).current;
  const txnId = useRef(`TXN${Date.now().toString(36).toUpperCase()}${Math.random().toString(36).slice(2, 6).toUpperCase()}`).current;

  useEffect(() => {
    // Start spinning
    const spin = Animated.loop(
      Animated.timing(spinAnim, {
        toValue: 1,
        duration: 1200,
        easing: Easing.linear,
        useNativeDriver: true,
      }),
    );
    spin.start();

    const timer = setTimeout(() => {
      spin.stop();
      setProcessingDone(true);
    }, 2500);

    return () => {
      clearTimeout(timer);
      spin.stop();
    };
  }, [spinAnim]);

  const spinInterpolate = spinAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0deg', '360deg'],
  });

  const today = new Date();
  const dateStr = `${today.getDate()} ${today.toLocaleString('en-IN', {month: 'short'})} ${today.getFullYear()}`;

  if (!processingDone) {
    return (
      <View style={styles.container}>
        <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
        <View style={[styles.header, {paddingTop: insets.top}]}>
          <AppText variant="screenName" style={styles.headerTitle}>Processing</AppText>
          <AppText variant="caption" style={styles.headerSub}>Verifying your payment</AppText>
        </View>
        <View style={styles.centerContent}>
        <Animated.View style={[styles.spinEmoji, {transform: [{rotate: spinInterpolate}]}]}>
          <Icon family="Ionicons" name="sync" size={36} color={Colors.accent} />
        </Animated.View>
        <AppText variant="screenName" style={styles.processingTitle}>Processing payment</AppText>
        <AppText variant="body" color={Colors.textSecondary} style={styles.processingSubtext}>
          Please don{'\u2019'}t close this screen
        </AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={styles.methodLabel}>{method}</AppText>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <AppText variant="screenName" style={styles.headerTitle}>Payment successful!</AppText>
        <AppText variant="caption" style={styles.headerSub}>Your plan is now active</AppText>
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={[styles.scrollContent, styles.center]}
        showsVerticalScrollIndicator={false}>

        {/* Success icon */}
        <View style={styles.successCircle}>
          <Icon family="Ionicons" name="checkmark" size={36} color={Colors.white} />
        </View>

        <AppText variant="screenName" style={styles.successTitle}>Payment successful!</AppText>

        {/* Receipt card */}
        <View style={styles.receiptCard}>
          <View style={styles.receiptRow}>
            <AppText variant="caption" color={Colors.textSecondary}>Plan</AppText>
            <AppText variant="bodyBold">{plan.charAt(0).toUpperCase() + plan.slice(1)}</AppText>
          </View>
          <View style={styles.receiptRow}>
            <AppText variant="caption" color={Colors.textSecondary}>Trial period</AppText>
            <AppText variant="body">14 days free</AppText>
          </View>
          <View style={styles.receiptRow}>
            <AppText variant="caption" color={Colors.textSecondary}>Payment method</AppText>
            <AppText variant="body">{method}</AppText>
          </View>
          <View style={styles.receiptRow}>
            <AppText variant="caption" color={Colors.textSecondary}>Transaction ID</AppText>
            <AppText variant="body">{txnId}</AppText>
          </View>
          <View style={styles.receiptRow}>
            <AppText variant="caption" color={Colors.textSecondary}>Date</AppText>
            <AppText variant="body">{dateStr}</AppText>
          </View>
          <View style={styles.receiptDivider} />
          <View style={styles.receiptRow}>
            <AppText variant="caption" color={Colors.textSecondary}>Amount</AppText>
            <AppText variant="bodyBold" color={Colors.accent}>{'\u20B9'}0 (trial)</AppText>
          </View>
          <View style={styles.receiptRow}>
            <AppText variant="caption" color={Colors.textSecondary}>Status</AppText>
            <AppText variant="bodyBold" color={Colors.accent}>{'\u2713'} Authorised</AppText>
          </View>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + vs(12)}]}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('Agreement')}
          activeOpacity={0.7}>
          <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>Continue setup</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingBottom: vs(14), paddingHorizontal: s(16)},
  headerTitle: {color: Colors.white, fontSize: ms(20), fontWeight: '700', marginBottom: vs(3)},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  center: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: s(20),
    paddingBottom: vs(20),
    flexGrow: 1,
  },
  spinEmoji: {
    fontSize: ms(48),
  },
  processingTitle: {
    fontSize: ms(20),
    fontWeight: '800',
    marginTop: vs(16),
    marginBottom: vs(6),
  },
  processingSubtext: {
    marginBottom: vs(8),
  },
  methodLabel: {
    marginTop: vs(4),
  },
  successCircle: {
    width: ms(64),
    height: ms(64),
    borderRadius: ms(32),
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(16),
    marginTop: vs(32),
  },
  successCheck: {
    fontSize: ms(28),
    color: Colors.white,
    fontWeight: '800',
  },
  successTitle: {
    fontSize: ms(22),
    fontWeight: '800',
    marginBottom: vs(20),
  },
  receiptCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    width: '100%',
  },
  receiptRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(6),
  },
  receiptDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: vs(6),
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
});

export default PaymentProcessingScreen;
