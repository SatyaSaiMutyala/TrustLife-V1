import React, {useState, useEffect, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  Animated,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const LoginBioScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [scanning, setScanning] = useState(false);
  const [verified, setVerified] = useState(false);

  const pulse1 = useRef(new Animated.Value(0.3)).current;
  const pulse2 = useRef(new Animated.Value(0.2)).current;
  const pulse3 = useRef(new Animated.Value(0.15)).current;

  useEffect(() => {
    const createPulse = (anim, minVal, maxVal) =>
      Animated.loop(
        Animated.sequence([
          Animated.timing(anim, {toValue: maxVal, duration: 1200, useNativeDriver: true}),
          Animated.timing(anim, {toValue: minVal, duration: 1200, useNativeDriver: true}),
        ]),
      );

    const a1 = createPulse(pulse1, 0.2, 0.4);
    const a2 = createPulse(pulse2, 0.1, 0.3);
    const a3 = createPulse(pulse3, 0.05, 0.2);
    a1.start();
    a2.start();
    a3.start();

    return () => {
      a1.stop();
      a2.stop();
      a3.stop();
    };
  }, [pulse1, pulse2, pulse3]);

  const handleAuth = useCallback(() => {
    setScanning(true);
    setTimeout(() => {
      setVerified(true);
      setTimeout(() => {
        navigation.navigate('LoginSuccess', {method: 'Biometric'});
      }, 700);
    }, 1500);
  }, [navigation]);

  const bioIconName = verified ? 'checkmark-circle' : scanning ? 'scan' : 'finger-print';
  const title = verified ? 'Verified!' : scanning ? 'Scanning...' : 'Face ID / Touch ID';
  const subtitle = verified
    ? 'Biometric authentication successful'
    : scanning
    ? 'Hold still or look at camera'
    : 'Tap to authenticate with your biometric';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Green Header */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex:1,marginLeft:s(10)}}>
            <AppText variant="screenName" style={styles.headerTitle}>Biometric Login</AppText>
            <AppText variant="caption" style={styles.headerSub}>Authenticate with Face ID or Touch ID</AppText>
          </View>
      </View>
      </View>

      <View style={styles.centerContent}>
        {/* Pulsing Rings */}
        <View style={styles.ringsContainer}>
          <Animated.View style={[styles.ring, styles.ring3, {opacity: pulse3}]} />
          <Animated.View style={[styles.ring, styles.ring2, {opacity: pulse2}]} />
          <Animated.View style={[styles.ring, styles.ring1, {opacity: pulse1}]} />
          <View style={styles.bioCircle}>
            <Icon family="Ionicons" name={bioIconName} size={44} color={Colors.accent} />
          </View>
        </View>

        <AppText variant="screenName" style={styles.title}>{title}</AppText>
        <AppText variant="subtitle" color={Colors.textSecondary} style={{textAlign: 'center', marginBottom: vs(32)}}>
          {subtitle}
        </AppText>

        {/* Auth Button */}
        {!scanning && !verified && (
          <TouchableOpacity style={styles.ctaButton} onPress={handleAuth}>
            <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>Authenticate</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
          </TouchableOpacity>
        )}

        {/* Fallback Link */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={{marginTop: vs(24)}}>
          <AppText variant="caption" color={Colors.textSecondary} style={{textAlign: 'center'}}>
            Can't use biometrics? Try another method
          </AppText>
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
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(16),
    paddingTop: vs(20),
  },
  ringsContainer: {
    width: 182,
    height: 182,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(24),
  },
  ring: {
    position: 'absolute',
    borderWidth: 2,
    borderColor: Colors.tealBg,
    borderRadius: 999,
  },
  ring1: {
    width: 130,
    height: 130,
    borderRadius: 65,
  },
  ring2: {
    width: 156,
    height: 156,
    borderRadius: 78,
  },
  ring3: {
    width: 182,
    height: 182,
    borderRadius: 91,
  },
  bioCircle: {
    width: 110,
    height: 110,
    borderRadius: 55,
    backgroundColor: Colors.tealBg,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  title: {
    fontSize: ms(22),
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: vs(8),
  },
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    paddingHorizontal: s(40),
    alignItems: 'center',
  },
});

export default LoginBioScreen;
