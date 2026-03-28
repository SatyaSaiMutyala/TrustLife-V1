import React from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import {VALUE_PROPS} from '../../constants/authData';

const WelcomeScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Green header */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={st.headerTitle}>Get started</AppText>
            <AppText variant="caption" style={st.headerSub}>One place for your whole health</AppText>
          </View>
        </View>
      </View>

      <ScrollView
        style={st.scroll}
        contentContainerStyle={st.scrollContent}
        showsVerticalScrollIndicator={false}>

        {VALUE_PROPS.map((item, i) => (
          <View key={i} style={st.card}>
            <AppText style={st.cardIcon}>{item.ico}</AppText>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold">{item.title}</AppText>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                {item.desc}
              </AppText>
            </View>
          </View>
        ))}
      </ScrollView>

      <View style={[st.bottomBar, {paddingBottom: insets.bottom + vs(12)}]}>
        <TouchableOpacity
          style={st.ctaBtn}
          onPress={() => navigation.navigate('Phone')}
          activeOpacity={0.7}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(4)}}>
            <AppText variant="bodyBold" color={Colors.white} style={{lineHeight: ms(16)}}>Create account</AppText>
            <Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} />
          </View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('LoginHub')} style={{alignItems: 'center', marginTop: vs(12)}}>
          <AppText variant="caption" color={Colors.textSecondary}>
            Already have an account?{' '}
            <AppText variant="caption" color={Colors.accent}>Sign in</AppText>
          </AppText>
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
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: s(20), paddingTop: vs(20), paddingBottom: vs(20)},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14), flexDirection: 'row', marginBottom: vs(10)},
  cardIcon: {fontSize: ms(22), lineHeight: ms(28), marginRight: s(12)},
  bottomBar: {paddingHorizontal: s(20), paddingTop: vs(12), backgroundColor: Colors.background, borderTopWidth: 0.5, borderTopColor: Colors.borderLight},
  ctaBtn: {backgroundColor: Colors.primary, borderRadius: ms(14), paddingVertical: vs(16), alignItems: 'center'},
});

export default WelcomeScreen;
