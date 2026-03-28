import React, {useState, useEffect, useRef, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar, ScrollView, TextInput, Alert} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import {UPI_APPS, BANKS} from '../../constants/authData';

const PaymentMethodScreen = ({route}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {plan, billMode} = route.params;

  const [selectedMethod, setSelectedMethod] = useState(null);
  const [upiId, setUpiId] = useState('');
  const [cardNumber, setCardNumber] = useState('');
  const [cardExpiry, setCardExpiry] = useState('');
  const [cardCvv, setCardCvv] = useState('');
  const [cardName, setCardName] = useState('');
  const [selectedBank, setSelectedBank] = useState(null);

  const formatCardNumber = useCallback((text) => {
    const cleaned = text.replace(/\s/g, '').replace(/\D/g, '');
    const groups = cleaned.match(/.{1,4}/g);
    return groups ? groups.join(' ') : '';
  }, []);

  const formatExpiry = useCallback((text) => {
    const cleaned = text.replace(/\D/g, '');
    if (cleaned.length >= 3) {
      return cleaned.slice(0, 2) + '/' + cleaned.slice(2, 4);
    }
    return cleaned;
  }, []);

  const isPayEnabled = () => {
    if (!selectedMethod) return false;
    if (selectedMethod.startsWith('upi_') && selectedMethod !== 'upi_upi') return true;
    if (selectedMethod === 'upi_upi' && upiId.includes('@')) return true;
    if (selectedMethod === 'card' && cardNumber.replace(/\s/g, '').length >= 16 && cardExpiry.length === 5 && cardCvv.length >= 3 && cardName.length > 0) return true;
    if (selectedMethod === 'netbanking' && selectedBank) return true;
    return false;
  };

  const getMethodLabel = () => {
    if (!selectedMethod) return '';
    if (selectedMethod.startsWith('upi_')) {
      const app = UPI_APPS.find(a => `upi_${a.id}` === selectedMethod);
      return app ? app.label : 'UPI';
    }
    if (selectedMethod === 'card') return 'Credit/Debit Card';
    if (selectedMethod === 'netbanking') return selectedBank || 'Net Banking';
    return '';
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
            <AppText variant="screenName" style={styles.headerTitle}>Payment method</AppText>
            <AppText variant="caption" style={styles.headerSub}>Choose how you'd like to pay.</AppText>
          </View>
          <AppText variant="small" color="rgba(255,255,255,0.5)">Payment {'\u00B7'} Step 2 of 3</AppText>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: '84%'}]} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* UPI Apps */}
        <AppText variant="bodyBold" style={styles.sectionTitle}>UPI</AppText>
        <View style={styles.grid}>
          {UPI_APPS.map((app) => {
            const key = `upi_${app.id}`;
            const isSelected = selectedMethod === key;
            return (
              <TouchableOpacity
                key={app.id}
                style={[styles.gridItem, isSelected && styles.gridItemSelected]}
                onPress={() => setSelectedMethod(key)}
                activeOpacity={0.7}>
                <AppText style={styles.gridIcon}>{app.ico}</AppText>
                <AppText variant="caption" color={isSelected ? Colors.accent : Colors.textPrimary} style={{fontWeight: '600', textAlign: 'center'}}>
                  {app.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* UPI ID input */}
        {selectedMethod === 'upi_upi' && (
          <View style={styles.upiInputRow}>
            <TextInput
              style={styles.upiInput}
              placeholder="yourname@upi"
              placeholderTextColor={Colors.textTertiary}
              value={upiId}
              onChangeText={setUpiId}
              autoCapitalize="none"
              keyboardType="email-address"
            />
            <TouchableOpacity style={styles.verifyBtn}>
              <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Verify</AppText>
            </TouchableOpacity>
          </View>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Credit / Debit Card */}
        <TouchableOpacity
          style={[styles.methodCard, selectedMethod === 'card' && styles.methodCardSelected]}
          onPress={() => setSelectedMethod('card')}
          activeOpacity={0.7}>
          <View style={styles.methodHeader}>
            <AppText style={styles.methodIcon}>{'\uD83D\uDCB3'}</AppText>
            <AppText variant="bodyBold">Credit / Debit Card</AppText>
          </View>
        </TouchableOpacity>

        {selectedMethod === 'card' && (
          <View style={styles.cardForm}>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.fieldLabel}>Card number</AppText>
            <TextInput
              style={styles.formInput}
              placeholder="1234 5678 9012 3456"
              placeholderTextColor={Colors.textTertiary}
              value={cardNumber}
              onChangeText={(t) => setCardNumber(formatCardNumber(t))}
              keyboardType="number-pad"
              maxLength={19}
            />
            <View style={styles.cardRow}>
              <View style={styles.cardHalf}>
                <AppText variant="caption" color={Colors.textSecondary} style={styles.fieldLabel}>Expiry</AppText>
                <TextInput
                  style={styles.formInput}
                  placeholder="MM/YY"
                  placeholderTextColor={Colors.textTertiary}
                  value={cardExpiry}
                  onChangeText={(t) => setCardExpiry(formatExpiry(t))}
                  keyboardType="number-pad"
                  maxLength={5}
                />
              </View>
              <View style={styles.cardHalf}>
                <AppText variant="caption" color={Colors.textSecondary} style={styles.fieldLabel}>CVV</AppText>
                <TextInput
                  style={styles.formInput}
                  placeholder="\u2022\u2022\u2022"
                  placeholderTextColor={Colors.textTertiary}
                  value={cardCvv}
                  onChangeText={setCardCvv}
                  keyboardType="number-pad"
                  maxLength={4}
                  secureTextEntry
                />
              </View>
            </View>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.fieldLabel}>Name on card</AppText>
            <TextInput
              style={styles.formInput}
              placeholder="Full name"
              placeholderTextColor={Colors.textTertiary}
              value={cardName}
              onChangeText={setCardName}
              autoCapitalize="words"
            />
          </View>
        )}

        {/* Divider */}
        <View style={styles.divider} />

        {/* Net Banking */}
        <TouchableOpacity
          style={[styles.methodCard, selectedMethod === 'netbanking' && styles.methodCardSelected]}
          onPress={() => setSelectedMethod('netbanking')}
          activeOpacity={0.7}>
          <View style={styles.methodHeader}>
            <AppText style={styles.methodIcon}>{'\uD83C\uDFE6'}</AppText>
            <AppText variant="bodyBold">Net Banking</AppText>
          </View>
        </TouchableOpacity>

        {selectedMethod === 'netbanking' && (
          <View style={styles.bankGrid}>
            {BANKS.map((bank, i) => {
              const isSel = selectedBank === bank;
              return (
                <TouchableOpacity
                  key={i}
                  style={[styles.bankItem, isSel && styles.bankItemSelected]}
                  onPress={() => setSelectedBank(bank)}
                  activeOpacity={0.7}>
                  <AppText variant="caption" color={isSel ? Colors.accent : Colors.textPrimary} style={{fontWeight: '600', textAlign: 'center'}}>
                    {bank}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        )}
      </ScrollView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + vs(12)}]}>
        <TouchableOpacity
          style={[styles.ctaBtn, !isPayEnabled() && styles.ctaBtnDisabled]}
          onPress={() => {
            if (isPayEnabled()) {
              navigation.navigate('PaymentProcessing', {
                method: getMethodLabel(),
                plan,
                billMode,
              });
            }
          }}
          activeOpacity={isPayEnabled() ? 0.7 : 1}>
          <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>Pay now</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
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
  sectionTitle: {
    marginTop: vs(16),
    marginBottom: vs(10),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  gridItem: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(8),
    alignItems: 'center',
  },
  gridItemSelected: {
    backgroundColor: Colors.tealBg,
    borderWidth: 1.5,
    borderColor: Colors.accent,
  },
  gridIcon: {
    fontSize: ms(24),
    marginBottom: vs(4),
  },
  upiInputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  upiInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    fontSize: ms(14),
    color: Colors.textPrimary,
    marginRight: s(8),
  },
  verifyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingHorizontal: s(16),
    paddingVertical: vs(14),
  },
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: vs(12),
  },
  methodCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(8),
  },
  methodCardSelected: {
    backgroundColor: Colors.tealBg,
  },
  methodHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  methodIcon: {
    fontSize: ms(20),
    marginRight: s(10),
  },
  cardForm: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(8),
  },
  fieldLabel: {
    marginBottom: vs(4),
    marginTop: vs(8),
  },
  formInput: {
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    padding: s(12),
    fontSize: ms(14),
    color: Colors.textPrimary,
  },
  cardRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  cardHalf: {
    width: '48%',
  },
  bankGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  bankItem: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(8),
    alignItems: 'center',
  },
  bankItemSelected: {
    backgroundColor: Colors.tealBg,
    borderWidth: 1.5,
    borderColor: Colors.accent,
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
  ctaBtnDisabled: {
    opacity: 0.5,
  },
});

export default PaymentMethodScreen;
