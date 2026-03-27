import React from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import {SECURITY_ITEMS} from '../../constants/profileData';

const ICON_BG = {
  green: Colors.tealBg,
  amber: '#FDF3E7',
  rose: '#FAEAED',
};

const STATUS_STYLE = {
  enabled: {bg: Colors.tealBg, text: Colors.accent},
  warning: {bg: '#FDF3E7', text: '#B5600E'},
  disabled: {bg: '#FAEAED', text: '#9B3A4A'},
  action: null,
};

const SecurityScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <AppText variant="body" style={st.backText}>{'\u2039'} Profile</AppText>
          </TouchableOpacity>
        </View>
        <AppText variant="screenName" style={st.headerTitle}>Security Centre</AppText>
        <AppText variant="caption" style={st.headerSub}>Login activity · 2FA · Change password</AppText>
      </View>

      <ScrollView style={st.scroll} contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Account Security */}
        <AppText variant="sectionTitle" style={st.sectionLabel}>ACCOUNT SECURITY</AppText>
        <View style={st.card}>
          {SECURITY_ITEMS.map((item, idx) => {
            const iconBg = ICON_BG[item.bg] || Colors.tealBg;
            const sts = STATUS_STYLE[item.statusType];

            return (
              <View key={idx} style={[st.secRow, idx < SECURITY_ITEMS.length - 1 && st.secRowBorder]}>
                <View style={[st.iconBox, {backgroundColor: iconBg}]}>
                  <AppText style={{fontSize: ms(16)}}>{item.icon}</AppText>
                </View>
                <View style={st.secTextCol}>
                  <AppText variant="bodyBold">{item.title}</AppText>
                  <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>{item.desc}</AppText>
                </View>
                {item.statusType === 'action' ? (
                  <TouchableOpacity style={st.actionBtn} activeOpacity={0.7}>
                    <AppText variant="small" color={Colors.accent} style={st.actionText}>{item.status}</AppText>
                  </TouchableOpacity>
                ) : (
                  <View style={[st.statusPill, {backgroundColor: sts.bg}]}>
                    <AppText variant="small" color={sts.text} style={st.statusText}>{item.status}</AppText>
                  </View>
                )}
              </View>
            );
          })}
        </View>

        {/* Privacy */}
        <AppText variant="sectionTitle" style={st.sectionLabel}>PRIVACY</AppText>
        <View style={st.card}>
          <View style={[st.privRow, st.privRowBorder]}>
            <View style={{flex: 1}}>
              <AppText variant="small" color={Colors.textTertiary} style={st.privLabel}>Profile Visibility</AppText>
              <AppText variant="body">Private</AppText>
            </View>
          </View>
          <View style={[st.privRow, st.privRowBorder]}>
            <View style={{flex: 1}}>
              <AppText variant="small" color={Colors.textTertiary} style={st.privLabel}>Data Export</AppText>
              <AppText variant="body">Download your data</AppText>
            </View>
            <TouchableOpacity style={st.actionBtn} activeOpacity={0.7}>
              <AppText variant="small" color={Colors.accent} style={st.actionText}>Download</AppText>
            </TouchableOpacity>
          </View>
          <View style={st.privRow}>
            <View style={{flex: 1}}>
              <AppText variant="small" color={Colors.textTertiary} style={st.privLabel}>Account Deletion</AppText>
              <AppText variant="body">Permanently delete your account</AppText>
            </View>
            <TouchableOpacity style={st.deleteBtn} activeOpacity={0.7}>
              <AppText variant="small" color="#9B3A4A" style={st.actionText}>Delete</AppText>
            </TouchableOpacity>
          </View>
        </View>

        <View style={{height: vs(40)}} />
      </ScrollView>
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingBottom: vs(16), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(12)},
  backBtn: {paddingVertical: vs(4), paddingRight: s(12)},
  backText: {color: Colors.white, fontSize: ms(15)},
  headerTitle: {color: Colors.white, fontSize: ms(20), fontWeight: '700', marginBottom: vs(4)},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  scroll: {flex: 1},
  scrollContent: {padding: s(16)},
  sectionLabel: {marginBottom: vs(8), marginTop: vs(6)},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14), marginBottom: vs(12)},

  secRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(12)},
  secRowBorder: {borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  iconBox: {width: ms(36), height: ms(36), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center', marginRight: s(12)},
  secTextCol: {flex: 1, marginRight: s(8)},

  statusPill: {paddingHorizontal: s(10), paddingVertical: vs(4), borderRadius: ms(10)},
  statusText: {fontSize: ms(10), fontWeight: '600'},
  actionBtn: {paddingHorizontal: s(14), paddingVertical: vs(6), borderRadius: ms(8), backgroundColor: Colors.tealBg},
  actionText: {fontSize: ms(11), fontWeight: '600'},
  deleteBtn: {paddingHorizontal: s(14), paddingVertical: vs(6), borderRadius: ms(8), backgroundColor: '#FAEAED'},

  privRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10)},
  privRowBorder: {borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  privLabel: {fontSize: ms(11), marginBottom: vs(2), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4},
});

export default SecurityScreen;
