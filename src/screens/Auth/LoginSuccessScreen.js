import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import {AuthContext} from '../../../App';

const LoginSuccessScreen = () => {
  const insets = useSafeAreaInsets();
  const route = useRoute();
  const {setIsLoggedIn} = useContext(AuthContext);

  const method = route.params?.method || 'Password';

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Green Header */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <AppText variant="screenName" style={styles.headerTitle}>Welcome back!</AppText>
        <AppText variant="caption" style={styles.headerSub}>Signed in successfully</AppText>
      </View>

      <View style={styles.centerContent}>
        {/* Checkmark */}
        <View style={styles.checkCircle}>
          <AppText style={{fontSize: ms(36)}}>{'🌿'}</AppText>
        </View>

        <AppText variant="screenName" style={styles.title}>You're in, Priya</AppText>
        <AppText variant="subtitle" color={Colors.textSecondary} style={{textAlign: 'center', marginBottom: vs(32)}}>
          Signed in · <AppText variant="subtitle" color={Colors.accent}>{method}</AppText>
        </AppText>

        {/* CTA */}
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => setIsLoggedIn(true)}
        >
          <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>Go to TrustLife</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
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
  headerTitle: {color: Colors.white, fontSize: ms(20), fontWeight: '700', marginBottom: vs(3)},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  centerContent: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(16),
    paddingTop: vs(20),
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(20),
  },
  title: {
    fontSize: ms(24),
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

export default LoginSuccessScreen;
