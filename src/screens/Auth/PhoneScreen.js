import React, {useState} from 'react';
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

const PhoneScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [phone, setPhone] = useState('');

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
            <AppText variant="screenName" style={styles.headerTitle}>Your mobile number</AppText>
            <AppText variant="caption" style={styles.headerSub}>We'll send a 6-digit OTP to verify. No spam {'\u2014'} ever.</AppText>
          </View>
          <AppText variant="small" color="rgba(255,255,255,0.5)">Step 1 of 7</AppText>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: '14%'}]} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Phone input row */}
        <View style={styles.inputRow}>
          <View style={styles.countryBox}>
            <AppText style={styles.countryText}>{'\uD83C\uDDEE\uD83C\uDDF3'} +91</AppText>
          </View>
          <TextInput
            style={styles.phoneInput}
            placeholder="98480 12345"
            placeholderTextColor={Colors.textTertiary}
            keyboardType="numeric"
            maxLength={10}
            value={phone}
            onChangeText={setPhone}
          />
        </View>

        {/* Info note */}
        <View style={styles.infoNote}>
          <AppText variant="caption" color={Colors.accent}>
            {'\uD83D\uDCF1'} Your number is used only for account security and critical health alerts.
          </AppText>
        </View>

        {/* Divider */}
        <View style={styles.dividerRow}>
          <View style={styles.dividerLine} />
          <AppText variant="caption" color={Colors.textTertiary} style={styles.dividerText}>
            or sign up with
          </AppText>
          <View style={styles.dividerLine} />
        </View>

        {/* Social buttons */}
        <View style={styles.socialRow}>
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() => Alert.alert('Google', 'Google sign-up coming soon')}>
            <Icon family="AntDesign" name="google" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.socialBtn}
            onPress={() => Alert.alert('Apple', 'Apple sign-up coming soon')}>
            <Icon family="AntDesign" name="apple1" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + vs(12)}]}>
        <TouchableOpacity
          style={[styles.ctaBtn, phone.length !== 10 && styles.ctaDisabled]}
          onPress={() => navigation.navigate('OTP')}
          activeOpacity={0.7}
          disabled={phone.length !== 10}>
          <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>Send OTP</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
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
  inputRow: {
    flexDirection: 'row',
    gap: s(10),
    marginTop: vs(16),
    marginBottom: vs(16),
  },
  countryBox: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    paddingHorizontal: s(14),
    justifyContent: 'center',
  },
  countryText: {
    fontSize: ms(14),
    fontWeight: '600',
  },
  phoneInput: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    paddingHorizontal: s(14),
    paddingVertical: vs(14),
    fontSize: ms(16),
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  infoNote: {
    backgroundColor: Colors.tealBg,
    borderLeftWidth: 2,
    borderLeftColor: Colors.accent,
    borderRadius: ms(10),
    padding: s(12),
    marginBottom: vs(24),
  },
  dividerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  dividerText: {
    marginHorizontal: s(12),
  },
  socialRow: {
    flexDirection: 'row',
    gap: s(12),
  },
  socialBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    gap: s(4),
  },
  socialIcon: {
    fontSize: ms(18),
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

export default PhoneScreen;
