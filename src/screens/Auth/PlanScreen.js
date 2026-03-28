import React, {useState, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import {PLANS} from '../../constants/authData';

const PlanScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [billMode, setBillMode] = useState('m');
  const [selectedPlan, setSelectedPlan] = useState('free');

  const getPrice = useCallback((plan) => {
    if (plan.id === 'free') return 0;
    return billMode === 'm' ? plan.priceM : plan.priceA;
  }, [billMode]);

  const getCtaText = useCallback(() => {
    const plan = PLANS.find(p => p.id === selectedPlan);
    if (selectedPlan === 'free') return 'Start with Free';
    return `Start ${plan.name}`;
  }, [selectedPlan]);

  const handleContinue = useCallback(() => {
    if (selectedPlan === 'free') {
      navigation.navigate('Agreement');
    } else {
      navigation.navigate('Payment', {plan: selectedPlan, billMode});
    }
  }, [selectedPlan, billMode, navigation]);

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
            <AppText variant="screenName" style={styles.headerTitle}>Choose your plan</AppText>
            <AppText variant="caption" style={styles.headerSub}>Start free, upgrade anytime. All paid plans include a 14-day free trial.</AppText>
          </View>
          <AppText variant="small" color="rgba(255,255,255,0.5)">Step 6 of 7</AppText>
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

        {/* Segment control */}
        <View style={styles.segmentRow}>
          <TouchableOpacity
            style={[styles.segmentBtn, billMode === 'm' && styles.segmentActive]}
            onPress={() => setBillMode('m')}>
            <AppText
              variant="caption"
              color={billMode === 'm' ? Colors.white : Colors.textSecondary}
              style={{fontWeight: '700'}}>
              Monthly
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.segmentBtn, billMode === 'a' && styles.segmentActive]}
            onPress={() => setBillMode('a')}>
            <AppText
              variant="caption"
              color={billMode === 'a' ? Colors.white : Colors.textSecondary}
              style={{fontWeight: '700'}}>
              Annual
            </AppText>
            <View style={styles.saveBadge}>
              <AppText variant="small" color={Colors.primary} style={{fontWeight: '800'}}>
                Save 33%
              </AppText>
            </View>
          </TouchableOpacity>
        </View>

        {/* Plan cards */}
        {PLANS.map((plan) => {
          const isSelected = selectedPlan === plan.id;
          const price = getPrice(plan);

          return (
            <TouchableOpacity
              key={plan.id}
              style={[styles.planCard, isSelected && styles.planCardSelected]}
              onPress={() => setSelectedPlan(plan.id)}
              activeOpacity={0.7}>

              {plan.popular && (
                <View style={styles.popularBadge}>
                  <AppText variant="small" color={Colors.black} style={{fontWeight: '800'}}>
                    Most popular
                  </AppText>
                </View>
              )}

              <View style={styles.planHeader}>
                {/* Radio dot */}
                <View style={[styles.radio, isSelected && styles.radioSelected]}>
                  {isSelected && <View style={styles.radioDot} />}
                </View>

                <View style={styles.planTitleBlock}>
                  <AppText style={[styles.planName, {color: plan.color}]}>
                    {plan.name}
                  </AppText>
                  <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                    <AppText style={[styles.planPrice, {color: plan.color}]}>
                      {plan.id === 'free' ? '\u20B90' : `\u20B9${price}`}
                    </AppText>
                    <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(3)}}>
                      {plan.freq}
                    </AppText>
                  </View>
                </View>
              </View>

              {/* Features */}
              {plan.features && plan.features.map((f, i) => (
                <View key={i} style={styles.featureRow}>
                  <View style={styles.checkMark}><Icon family="Ionicons" name="checkmark" size={14} color={plan.color || Colors.accent} /></View>
                  <AppText variant="caption" color={Colors.textPrimary} style={styles.featureText}>{f}</AppText>
                </View>
              ))}
              {plan.limited && plan.limited.map((f, i) => (
                <View key={`lim-${i}`} style={styles.featureRow}>
                  <View style={styles.checkMark}><Icon family="Ionicons" name="remove" size={14} color={Colors.textTertiary} /></View>
                  <AppText variant="caption" color={Colors.textTertiary} style={styles.featureText}>{f}</AppText>
                </View>
              ))}
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + vs(12)}]}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={handleContinue}
          activeOpacity={0.7}>
          <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>{getCtaText()}</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
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
  segmentRow: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(4),
    marginTop: vs(16),
    marginBottom: vs(16),
  },
  segmentBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(10),
    borderRadius: ms(10),
  },
  segmentActive: {
    backgroundColor: Colors.primary,
  },
  saveBadge: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(6),
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    marginLeft: s(6),
  },
  planCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(8),
    position: 'relative',
    overflow: 'visible',
  },
  planCardSelected: {
    backgroundColor: Colors.tealBg,
  },
  popularBadge: {
    position: 'absolute',
    top: -vs(8),
    right: s(12),
    backgroundColor: '#F0B429',
    borderRadius: ms(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    zIndex: 1,
  },
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  radio: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    borderWidth: 2,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  radioSelected: {
    borderColor: Colors.accent,
  },
  radioDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    backgroundColor: Colors.accent,
  },
  planTitleBlock: {
    flex: 1,
  },
  planName: {
    fontSize: ms(16),
    fontWeight: '800',
    lineHeight: ms(20),
    marginBottom: vs(2),
  },
  planPrice: {
    fontSize: ms(24),
    fontWeight: '800',
    lineHeight: ms(28),
  },
  featureRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(3),
    paddingLeft: ms(30),
  },
  checkMark: {
    fontSize: ms(13),
    fontWeight: '700',
    marginRight: s(6),
    width: ms(16),
  },
  featureText: {
    flex: 1,
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

export default PlanScreen;
