import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar, ScrollView, TextInput, Alert} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import {PLANS} from '../../constants/authData';

const PaymentScreen = ({route}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {plan: planId, billMode} = route.params;

  const plan = PLANS.find(p => p.id === planId);
  const price = billMode === 'm' ? plan.priceM : plan.priceA;
  const period = billMode === 'm' ? '/month' : '/year';
  const gst = Math.round(price * 0.18);
  const total = price + gst;

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
            <AppText variant="screenName" style={styles.headerTitle}>Order summary</AppText>
            <AppText variant="caption" style={styles.headerSub}>Review your plan details before payment.</AppText>
          </View>
          <AppText variant="small" color="rgba(255,255,255,0.5)">Payment {'\u00B7'} Step 1 of 3</AppText>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: '84%'}]} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Order summary */}
        <View style={styles.summaryCard}>
          <AppText style={styles.summaryIcon}>{plan.id === 'pro' ? '\u2B50' : plan.id === 'fam' ? '\uD83D\uDC68\u200D\uD83D\uDC69\u200D\uD83D\uDC67' : '\uD83D\uDCE6'}</AppText>
          <AppText style={styles.summaryName} color={Colors.tealText}>{plan.name} Plan</AppText>
          <AppText style={styles.summaryPrice} color={Colors.accent}>
            {'\u20B9'}{price}
            <AppText variant="caption" color={Colors.textSecondary}>{period}</AppText>
          </AppText>
          <View style={styles.summaryDivider} />
          {plan.features && plan.features.map((f, i) => (
            <View key={i} style={styles.featureRow}>
              <View style={styles.checkMark}><Icon family="Ionicons" name="checkmark" size={14} color={Colors.accent} /></View>
              <AppText variant="caption" color={Colors.tealText}>{f}</AppText>
            </View>
          ))}
        </View>

        {/* Trial banner */}
        <View style={styles.trialBanner}>
          <AppText style={styles.trialIcon}>{'\uD83C\uDF81'}</AppText>
          <AppText variant="bodyBold" color={Colors.amberText}>14-day free trial included</AppText>
        </View>

        {/* Price breakdown */}
        <View style={styles.card}>
          <AppText variant="bodyBold" style={styles.breakdownTitle}>Price breakdown</AppText>
          <View style={styles.breakdownRow}>
            <AppText variant="body" color={Colors.textSecondary}>Plan price</AppText>
            <AppText variant="body" color={Colors.textPrimary}>{'\u20B9'}{price}</AppText>
          </View>
          <View style={styles.breakdownRow}>
            <AppText variant="body" color={Colors.textSecondary}>GST (18%)</AppText>
            <AppText variant="body" color={Colors.textPrimary}>{'\u20B9'}{gst}</AppText>
          </View>
          <View style={styles.breakdownDivider} />
          <View style={styles.breakdownRow}>
            <AppText variant="bodyBold">Total due today</AppText>
            <AppText variant="bodyBold" color={Colors.accent}>{'\u20B9'}0</AppText>
          </View>
          <AppText variant="caption" color={Colors.textTertiary} style={styles.trialNote}>
            Free during 14-day trial. Cancel anytime before trial ends.
          </AppText>
        </View>

        {/* Security note */}
        <View style={styles.securityRow}>
          <AppText variant="caption" color={Colors.textSecondary}>
            {'\uD83D\uDD12'} Secured by Razorpay
          </AppText>
        </View>
      </ScrollView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + vs(12)}]}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('PaymentMethod', {plan: planId, billMode})}
          activeOpacity={0.7}>
          <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>Choose payment method</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
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
  summaryCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(14),
    padding: s(14),
    marginTop: vs(16),
    marginBottom: vs(8),
    alignItems: 'center',
  },
  summaryIcon: {
    fontSize: ms(32),
    marginBottom: vs(6),
  },
  summaryName: {
    fontSize: ms(18),
    fontWeight: '800',
    marginBottom: vs(4),
  },
  summaryPrice: {
    fontSize: ms(28),
    fontWeight: '800',
    marginBottom: vs(8),
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.accent,
    opacity: 0.2,
    alignSelf: 'stretch',
    marginBottom: vs(8),
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(3),
    alignSelf: 'flex-start',
  },
  checkMark: {
    fontSize: ms(13),
    fontWeight: '700',
    marginRight: s(6),
  },
  trialBanner: {
    backgroundColor: Colors.amberBg,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  trialIcon: {
    fontSize: ms(20),
    marginRight: s(8),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(8),
  },
  breakdownTitle: {
    marginBottom: vs(10),
  },
  breakdownRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  breakdownDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: vs(8),
  },
  trialNote: {
    marginTop: vs(4),
  },
  securityRow: {
    alignItems: 'center',
    marginTop: vs(8),
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

export default PaymentScreen;
