import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import AppDropdown from '../../components/shared/AppDropdown';

const PreferencesScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [emailNotif, setEmailNotif] = useState('All updates');
  const [smsAlerts, setSmsAlerts] = useState('Enabled');
  const [language, setLanguage] = useState('English');
  const [timezone, setTimezone] = useState('Asia/Kolkata (IST +5:30)');
  const [dateFormat, setDateFormat] = useState('DD/MM/YYYY');
  const [currency, setCurrency] = useState('INR (\u20B9)');

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <AppText variant="body" style={st.backText}>{'\u2039'} Profile</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={st.savePill} activeOpacity={0.8}>
            <AppText variant="small" style={st.savePillText}>Save</AppText>
          </TouchableOpacity>
        </View>
        <AppText variant="screenName" style={st.headerTitle}>Notifications & Preferences</AppText>
        <AppText variant="caption" style={st.headerSub}>Priya Raghunathan</AppText>
      </View>

      <ScrollView style={st.scroll} contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Notification Preferences */}
        <AppText variant="sectionTitle" style={st.sectionLabel}>NOTIFICATION PREFERENCES</AppText>
        <View style={[st.card, {zIndex: 20}]}>
          <View style={st.formRow}>
            <View style={st.halfField}>
              <AppDropdown label="Email Notifications" value={emailNotif} options={['All updates', 'Important only', 'None']} onSelect={setEmailNotif} />
            </View>
            <View style={st.halfField}>
              <AppDropdown label="SMS Alerts" value={smsAlerts} options={['Enabled', 'Disabled']} onSelect={setSmsAlerts} />
            </View>
          </View>
        </View>

        {/* Language & Region */}
        <AppText variant="sectionTitle" style={st.sectionLabel}>LANGUAGE & REGION</AppText>
        <View style={[st.card, {zIndex: 5}]}>
          <View style={st.formRow}>
            <View style={st.halfField}>
              <AppDropdown label="Language" value={language} options={['English', 'Hindi', 'Telugu', 'Tamil']} onSelect={setLanguage} />
            </View>
            <View style={st.halfField}>
              <AppDropdown label="Timezone" value={timezone} options={['Asia/Kolkata (IST +5:30)', 'UTC']} onSelect={setTimezone} />
            </View>
            <View style={st.halfField}>
              <AppDropdown label="Date Format" value={dateFormat} options={['DD/MM/YYYY', 'MM/DD/YYYY', 'YYYY-MM-DD']} onSelect={setDateFormat} />
            </View>
            <View style={st.halfField}>
              <AppDropdown label="Currency" value={currency} options={['INR (\u20B9)', 'USD ($)', 'EUR (\u20AC)']} onSelect={setCurrency} />
            </View>
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
  savePill: {paddingHorizontal: s(14), paddingVertical: vs(6), borderRadius: ms(20), backgroundColor: 'rgba(93,202,165,0.18)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)'},
  savePillText: {color: Colors.lightGreen, fontSize: ms(12), fontWeight: '600'},
  headerTitle: {color: Colors.white, fontSize: ms(20), fontWeight: '700', marginBottom: vs(4)},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  scroll: {flex: 1},
  scrollContent: {padding: s(16)},
  sectionLabel: {marginBottom: vs(8)},
  card: {backgroundColor: Colors.white, borderRadius: ms(16), padding: s(16), marginBottom: vs(14), overflow: 'visible', zIndex: 10},
  formRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8), overflow: 'visible'},
  halfField: {width: '48%', zIndex: 10},
});

export default PreferencesScreen;
