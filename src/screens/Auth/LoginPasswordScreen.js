import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
  TextInput,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const LoginPasswordScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);

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
            <AppText variant="screenName" style={styles.headerTitle}>Sign in with password</AppText>
            <AppText variant="caption" style={styles.headerSub}>priya@example.com</AppText>
          </View>
      </View>
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>

        {/* Password Field */}
        <View style={styles.inputRow}>
          <TextInput
            style={styles.input}
            placeholder="Enter your password"
            placeholderTextColor={Colors.textTertiary}
            value={password}
            onChangeText={setPassword}
            secureTextEntry={!showPassword}
            autoCapitalize="none"
          />
          <TouchableOpacity
            onPress={() => setShowPassword(prev => !prev)}
            style={styles.eyeBtn}
          >
            <Icon family="Ionicons" name={showPassword ? 'eye-off-outline' : 'eye-outline'} size={20} color={Colors.textTertiary} />
          </TouchableOpacity>
        </View>

        {/* Forgot Password */}
        <TouchableOpacity
          onPress={() => navigation.navigate('ForgotStep0')}
          style={{marginTop: vs(8), marginBottom: vs(16)}}
        >
          <AppText variant="caption" color={Colors.accent}>Forgot password?</AppText>
        </TouchableOpacity>

        {/* Security Note */}
        <View style={[styles.card, {backgroundColor: Colors.tealBg}]}>
          <AppText variant="body">
            {'🔒 Your password is never stored in plain text.'}
          </AppText>
        </View>

        {/* CTA */}
        <TouchableOpacity
          style={[styles.ctaButton, {opacity: password.length >= 4 ? 1 : 0.5}]}
          disabled={password.length < 4}
          onPress={() => navigation.navigate('LoginSuccess', {method: 'Password'})}
        >
          <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>Sign in</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
        </TouchableOpacity>

        {/* Try another method */}
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={{alignItems: 'center', marginTop: vs(20)}}
        >
          <AppText variant="caption" color={Colors.textSecondary}>Try another method</AppText>
        </TouchableOpacity>
      </ScrollView>
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
  scroll: {
    paddingHorizontal: s(16),
    paddingTop: vs(20),
  },
  inputRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(12),
  },
  input: {
    flex: 1,
    paddingVertical: vs(12),
    fontSize: ms(13),
    color: Colors.textPrimary,
  },
  eyeBtn: {
    paddingLeft: s(8),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(8),
  },
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
    marginTop: vs(8),
  },
});

export default LoginPasswordScreen;
