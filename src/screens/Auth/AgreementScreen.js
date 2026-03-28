import React, {useState, useContext} from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar, ScrollView, TextInput, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import {AuthContext} from '../../../App';

const AgreementScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {setIsLoggedIn} = useContext(AuthContext);

  const [tosRead, setTosRead] = useState(false);
  const [consentRead, setConsentRead] = useState(false);
  const [signName, setSignName] = useState('');

  const allAgreed = tosRead && consentRead;
  const nameOk = signName.trim().length >= 3 && signName.trim().includes(' ');
  const canActivate = allAgreed && nameOk;

  const signDate = new Date().toLocaleDateString('en-IN', {day: '2-digit', month: 'long', year: 'numeric'});

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Green header */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex:1,marginLeft:s(10)}}>
            <AppText variant="screenName" style={st.headerTitle}>Review & agree</AppText>
            <AppText variant="caption" style={st.headerSub}>Read our Terms of Service and Consent Agreement before activating your account.</AppText>
          </View>
          <AppText variant="small" color="rgba(255,255,255,0.5)">Step 7 of 7</AppText>
        </View>
      </View>

      {/* Progress */}
      <View style={st.progressTrack}>
        <View style={[st.progressFill, {width: '92%'}]} />
      </View>

      <ScrollView style={st.scroll} contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Terms of Service */}
        <View style={st.card}>
          <View style={st.cardTop}>
            <View style={[st.iconBox, {backgroundColor: Colors.redBg}]}>
              <AppText style={{fontSize: ms(20), lineHeight: ms(26)}}>{'📃'}</AppText>
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold">Terms of Service</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>Platform usage, medical disclaimer & user rights</AppText>
            </View>
          </View>
          <TouchableOpacity
            style={st.viewBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Terms')}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(4)}}>
              <AppText variant="bodyBold" color={Colors.accent} style={{lineHeight: ms(16)}}>Read Terms of Service</AppText>
              <Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.accent} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={st.checkRow}
            activeOpacity={0.7}
            onPress={() => setTosRead(!tosRead)}>
            <View style={[st.checkbox, tosRead && st.checkboxChecked]}>
              {tosRead && <Icon family="Ionicons" name="checkmark" size={14} color={Colors.white} />}
            </View>
            <AppText variant="body" style={{flex: 1}}>
              I have read and agree to the Terms of Service
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Consent Agreement */}
        <View style={st.card}>
          <View style={st.cardTop}>
            <View style={[st.iconBox, {backgroundColor: Colors.tealBg}]}>
              <AppText style={{fontSize: ms(20), lineHeight: ms(26)}}>{'✏️'}</AppText>
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold">User Consent Agreement</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>Data processing, Ayu Intelligence & health consents</AppText>
            </View>
          </View>
          <TouchableOpacity
            style={st.viewBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('Consent')}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(4)}}>
              <AppText variant="bodyBold" color={Colors.accent} style={{lineHeight: ms(16)}}>Read Consent Agreement</AppText>
              <Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.accent} />
            </View>
          </TouchableOpacity>
          <TouchableOpacity
            style={st.checkRow}
            activeOpacity={0.7}
            onPress={() => setConsentRead(!consentRead)}>
            <View style={[st.checkbox, consentRead && st.checkboxChecked]}>
              {consentRead && <Icon family="Ionicons" name="checkmark" size={14} color={Colors.white} />}
            </View>
            <AppText variant="body" style={{flex: 1}}>
              I have read and agree to the Consent Agreement
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Privacy Policy link */}
        <View style={st.card}>
          <View style={st.cardTop}>
            <View style={[st.iconBox, {backgroundColor: Colors.blueBg}]}>
              <AppText style={{fontSize: ms(20), lineHeight: ms(26)}}>{'📄'}</AppText>
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold">Privacy Policy</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>How we protect your health data</AppText>
            </View>
          </View>
          <TouchableOpacity
            style={st.viewBtn}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PrivacyPolicy')}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(4)}}>
              <AppText variant="body" color={Colors.accent} style={{lineHeight: ms(16)}}>View Privacy Policy</AppText>
              <Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.accent} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Info note */}
        <View style={st.infoBox}>
          <AppText variant="caption" color={Colors.accent}>
            {'\uD83C\uDF3F'} You can review and update your consents at any time from Profile {'\u203A'} Consent Manager after signing up.
          </AppText>
        </View>

        {/* Signature block - shown when both are checked */}
        {allAgreed && (
          <View style={st.signBlock}>
            <AppText variant="sectionTitle" style={{color: Colors.accent, marginBottom: vs(10)}}>{'\u270D\uFE0F'} YOUR SIGNATURE</AppText>
            <AppText variant="body" color={Colors.textSecondary} style={st.signStmt}>
              {'\u201C'}I, <AppText variant="bodyBold" color={Colors.accent}>{signName.trim() || '______________'}</AppText>, hereby give my informed consent to the Terms of Service and Consent Agreement described above. I understand that <AppText variant="bodyBold">TrustLife is a health intelligence platform and not a medical service provider.</AppText>{'\u201D'}
            </AppText>
            <AppText variant="small" color={Colors.textTertiary} style={st.nameLbl}>TYPE YOUR FULL NAME TO SIGN</AppText>
            <TextInput
              style={st.nameInput}
              placeholder="Type your full name here..."
              placeholderTextColor={Colors.textTertiary}
              value={signName}
              onChangeText={setSignName}
              autoCapitalize="words"
            />
            <View style={{marginTop: vs(5)}}>
              <AppText variant="small" color={nameOk ? Colors.accent : Colors.textTertiary} style={{fontWeight: '600'}}>
                {nameOk ? '\u2713' : '\u25CF'}{' '}
                {nameOk ? `Signed as "${signName.trim()}"` : signName.length > 0 ? 'Enter first and last name' : 'Enter your name to sign'}
              </AppText>
            </View>
            <View style={st.dateRow}>
              <AppText variant="small" color={Colors.textTertiary}>{'\uD83D\uDCC5'} Signed on: {signDate}</AppText>
              <AppText variant="small" color={Colors.textTertiary}>Location: Hyderabad, India</AppText>
            </View>
          </View>
        )}

        <View style={{height: vs(90)}} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[st.bottomBar, {paddingBottom: insets.bottom + vs(12)}]}>
        <TouchableOpacity
          style={[st.ctaBtn, canActivate && st.ctaBtnReady]}
          activeOpacity={canActivate ? 0.7 : 1}
          disabled={!canActivate}
          onPress={() => setIsLoggedIn(true)}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(4)}}>
            <AppText variant="bodyBold" color={canActivate ? Colors.white : Colors.textTertiary} style={{lineHeight: ms(16)}}>
              {!allAgreed ? 'Agree to both to continue' : !nameOk ? 'Sign with your name' : 'Activate TrustLife'}
            </AppText>
            {canActivate && <Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} />}
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{alignItems: 'center', marginTop: vs(8)}}>
          <AppText variant="caption" color={Colors.textTertiary}>Go back</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingBottom: vs(14), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  backText: {color: Colors.white, fontSize: ms(15)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  progressTrack: {height: 3, backgroundColor: Colors.borderLight},
  progressFill: {height: 3, backgroundColor: Colors.accent},
  scroll: {flex: 1},
  scrollContent: {padding: s(20)},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14), marginBottom: vs(10)},
  cardTop: {flexDirection: 'row', alignItems: 'center', gap: s(12), marginBottom: vs(10)},
  iconBox: {width: ms(40), height: ms(40), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
  viewBtn: {backgroundColor: Colors.tealBg, borderRadius: ms(10), paddingVertical: vs(10), alignItems: 'center', marginBottom: vs(10)},
  checkRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingTop: vs(8), borderTopWidth: 0.5, borderTopColor: Colors.borderLight},
  checkbox: {width: ms(22), height: ms(22), borderRadius: ms(6), borderWidth: 1.5, borderColor: Colors.borderLight, backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center'},
  checkboxChecked: {backgroundColor: Colors.accent, borderColor: Colors.accent},
  checkmark: {fontSize: ms(13), fontWeight: '700', color: Colors.white},
  infoBox: {backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: s(12), marginBottom: vs(10)},
  signBlock: {backgroundColor: Colors.tealBg, borderWidth: 0.5, borderColor: 'rgba(29,158,117,0.25)', borderRadius: ms(14), padding: s(14), marginBottom: vs(10)},
  signStmt: {fontStyle: 'italic', lineHeight: ms(22), marginBottom: vs(12)},
  nameLbl: {fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textTertiary, marginBottom: vs(5)},
  nameInput: {backgroundColor: Colors.white, borderWidth: 0.5, borderColor: Colors.borderLight, borderRadius: ms(10), paddingHorizontal: s(12), paddingVertical: vs(10), fontSize: ms(15), fontWeight: '700', color: Colors.textPrimary, fontFamily: Platform.select({ios: 'System', android: 'Roboto'})},
  dateRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(8)},
  bottomBar: {paddingHorizontal: s(20), paddingTop: vs(10), borderTopWidth: 0.5, borderTopColor: Colors.borderLight, backgroundColor: Colors.background},
  ctaBtn: {backgroundColor: Colors.borderLight, borderRadius: ms(14), paddingVertical: vs(15), alignItems: 'center'},
  ctaBtnReady: {backgroundColor: Colors.primary},
});

export default AgreementScreen;
