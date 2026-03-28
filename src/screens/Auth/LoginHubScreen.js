import React from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import {LOGIN_METHODS} from '../../constants/authData';

const LoginHubScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const routeMap = {bio: 'LoginBio', pin: 'LoginPin', password: 'LoginPassword'};

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
            <AppText variant="screenName" style={st.headerTitle}>Welcome back, Priya</AppText>
            <AppText variant="caption" style={st.headerSub}>priya@example.com {'\u00B7'} +91 98480 12345</AppText>
          </View>
      </View>
      </View>

      <ScrollView contentContainerStyle={st.scroll} showsVerticalScrollIndicator={false}>

        {/* Section Label */}
        <AppText variant="sectionTitle" style={st.sectionLabel}>Choose how to sign in</AppText>

        {/* Login Methods */}
        {LOGIN_METHODS.map(method => (
          <TouchableOpacity
            key={method.id}
            style={st.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate(routeMap[method.id])}>
            <View style={st.methodRow}>
              <View style={[st.iconCircle, {backgroundColor: method.bg}]}>
                <AppText style={{fontSize: ms(20), lineHeight: ms(26)}}>{method.ico}</AppText>
              </View>
              <View style={{flex: 1, marginLeft: s(12)}}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <AppText variant="bodyBold">{method.title}</AppText>
                  {method.badge && (
                    <View style={[st.badge, {backgroundColor: method.badgeBg}]}>
                      <AppText variant="small" color={method.badgeColor}>{method.badge}</AppText>
                    </View>
                  )}
                </View>
                <AppText variant="caption" color={Colors.textSecondary}>{method.sub}</AppText>
              </View>
              <Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.textTertiary} />
            </View>
          </TouchableOpacity>
        ))}

        {/* Forgot Password */}
        <TouchableOpacity onPress={() => navigation.navigate('ForgotStep0')} style={{alignItems: 'center', marginTop: vs(12)}}>
          <AppText variant="caption" color={Colors.accent}>Forgot password or PIN?</AppText>
        </TouchableOpacity>

        {/* Divider */}
        <View style={st.divider}>
          <View style={st.dividerLine} />
          <AppText variant="caption" color={Colors.textTertiary} style={{marginHorizontal: s(12)}}>or</AppText>
          <View style={st.dividerLine} />
        </View>

        {/* Social Login */}
        <View style={st.socialRow}>
          <TouchableOpacity style={st.socialBtn}>
            <Icon family="AntDesign" name="google" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <TouchableOpacity style={[st.socialBtn, {marginLeft: s(12)}]}>
            <Icon family="AntDesign" name="apple1" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Switch Account */}
        <TouchableOpacity onPress={() => navigation.goBack()} style={{alignItems: 'center', marginTop: vs(20), marginBottom: vs(24)}}>
          <AppText variant="caption" color={Colors.textSecondary}>Not you? Switch account</AppText>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingBottom: vs(16), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(11)},
  scroll: {paddingHorizontal: s(16), paddingTop: vs(16)},
  sectionLabel: {marginBottom: vs(10)},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14), marginBottom: vs(8)},
  methodRow: {flexDirection: 'row', alignItems: 'center'},
  iconCircle: {width: ms(40), height: ms(40), borderRadius: ms(20), alignItems: 'center', justifyContent: 'center'},
  badge: {marginLeft: s(8), paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(10)},
  divider: {flexDirection: 'row', alignItems: 'center', marginVertical: vs(20)},
  dividerLine: {flex: 1, height: 0.5, backgroundColor: Colors.borderLight},
  socialRow: {flexDirection: 'row'},
  socialBtn: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(14), paddingVertical: vs(12), alignItems: 'center'},
});

export default LoginHubScreen;
