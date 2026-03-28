import React, {useState, useEffect, useRef, useCallback} from 'react';
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
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import {CONSENT_TOGGLES} from '../../constants/authData';

const ConsentScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const initialState = {};
  CONSENT_TOGGLES.forEach(t => {
    initialState[t.id] = t.defaultOn;
  });
  const [consentState, setConsentState] = useState(initialState);
  const [fullName, setFullName] = useState('');

  const nameValid = fullName.trim().length >= 3 && fullName.trim().includes(' ');

  const medicalToggles = CONSENT_TOGGLES.filter(t => t.category === 'medical');
  const dataToggles = CONSENT_TOGGLES.filter(t => t.category === 'data');

  const toggleConsent = useCallback((id, required) => {
    if (required) {
      Alert.alert('Required consent', 'This consent is required to use TrustLife and cannot be turned off.');
      return;
    }
    setConsentState(prev => ({...prev, [id]: !prev[id]}));
  }, []);

  const renderToggle = useCallback((item) => {
    const isOn = consentState[item.id];
    return (
      <View key={item.id} style={styles.card}>
        <View style={styles.toggleRow}>
          <AppText style={{fontSize: ms(22), lineHeight: ms(28), marginRight: s(10)}}>{item.ico}</AppText>
          <View style={{flex: 1, marginRight: s(10)}}>
            <AppText variant="bodyBold">{item.title}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>{item.sub}</AppText>
          </View>
          <TouchableOpacity
            activeOpacity={item.required ? 1 : 0.7}
            onPress={() => toggleConsent(item.id, item.required)}
            style={item.required ? {cursor: 'not-allowed'} : {}}
          >
            <View style={[styles.toggleTrack, {backgroundColor: isOn ? Colors.accent : Colors.borderLight}]}>
              <View style={[styles.toggleKnob, {transform: [{translateX: isOn ? 19 : 2}]}]} />
            </View>
          </TouchableOpacity>
        </View>
      </View>
    );
  }, [consentState, toggleConsent]);

  const handleDecline = useCallback(() => {
    Alert.alert(
      'Decline all consents?',
      'Without consent, TrustLife cannot store or process your health data. You will not be able to use the app.',
      [
        {text: 'Cancel', style: 'cancel'},
        {text: 'Decline', style: 'destructive', onPress: () => navigation.goBack()},
      ],
    );
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Green header */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={styles.headerTitle}>Your consent choices</AppText>
            <AppText variant="caption" style={styles.headerSub}>Required consents enable TrustLife</AppText>
          </View>
          <AppText variant="small" color="rgba(255,255,255,0.5)">Step 7 {'\u00B7'} Part 2</AppText>
        </View>
      </View>

      {/* Progress */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill2, {width: '96%'}]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Medical Consents */}
        <AppText variant="sectionTitle" color={Colors.redText} style={{marginBottom: vs(8)}}>
          {'⚕️ MEDICAL CONSENTS'}
        </AppText>
        {medicalToggles.map(renderToggle)}

        {/* Data & Technology Consents */}
        <AppText variant="sectionTitle" color={Colors.accent} style={{marginTop: vs(8), marginBottom: vs(8)}}>
          {'🔒 DATA & TECHNOLOGY CONSENTS'}
        </AppText>
        {dataToggles.map(renderToggle)}

        {/* Signature Block */}
        <View style={[styles.card, {backgroundColor: Colors.tealBg, borderWidth: 1, borderColor: Colors.accent, marginTop: vs(12)}]}>
          <AppText variant="body" style={{marginBottom: vs(8)}}>
            I, <AppText variant="bodyBold">{fullName.trim() || '[NAME]'}</AppText>, give my informed consent to TrustLife to process my health data as described above, in compliance with the Digital Personal Data Protection Act, 2023.
          </AppText>
          <TextInput
            style={styles.nameInput}
            placeholder="Enter your full name"
            placeholderTextColor={Colors.textTertiary}
            value={fullName}
            onChangeText={setFullName}
            autoCapitalize="words"
          />
          {fullName.length > 0 && !nameValid && (
            <AppText variant="caption" color={Colors.red} style={{marginTop: vs(4)}}>
              Please enter your full name (first and last name)
            </AppText>
          )}
        </View>

        {/* Download PDF */}
        <TouchableOpacity style={{marginTop: vs(8), marginBottom: vs(12)}}>
          <AppText variant="caption" color={Colors.accent} style={{textDecorationLine: 'underline'}}>
            Download consent PDF
          </AppText>
        </TouchableOpacity>

        {/* Decline Link */}
        <TouchableOpacity onPress={handleDecline} style={{alignItems: 'center', marginBottom: vs(16)}}>
          <AppText variant="caption" color={Colors.red}>Decline all</AppText>
        </TouchableOpacity>

        <View style={{height: vs(80)}} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + vs(12)}]}>
        <TouchableOpacity
          style={[styles.ctaButton, {opacity: nameValid ? 1 : 0.5}]}
          disabled={!nameValid}
          onPress={() => navigation.navigate('Done')}
        >
          <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>Activate TrustLife</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingBottom: vs(14), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  progressTrack: {height: 3, backgroundColor: Colors.borderLight},
  progressFill2: {height: 3, backgroundColor: Colors.accent},
  scroll: {
    paddingHorizontal: s(16),
    paddingTop: vs(20),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(8),
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  toggleTrack: {
    width: 44,
    height: 25,
    borderRadius: 13,
    justifyContent: 'center',
  },
  toggleKnob: {
    position: 'absolute',
    width: 18,
    height: 18,
    borderRadius: 9,
    backgroundColor: Colors.white,
  },
  nameInput: {
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
    fontSize: ms(13),
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
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
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
  },
});

export default ConsentScreen;
