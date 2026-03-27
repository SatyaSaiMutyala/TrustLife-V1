import React from 'react';
import {View, Text, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import ProfileHeader from '../../components/Profile/ProfileHeader';
import AyuCard from '../../components/Profile/AyuCard';
import HealthSummary from '../../components/Profile/HealthSummary';
import CareTeamCard from '../../components/Profile/CareTeamCard';
import MenuSection from '../../components/Profile/MenuSection';
import BillingCard from '../../components/Profile/BillingCard';
import TrustReportCard from '../../components/Profile/TrustReportCard';
import SOSCard from '../../components/Profile/SOSCard';

const getAccountItems = (navigation) => [
  {icon: '👤', iconBg: Colors.blueBg, name: 'Personal profile', sub: 'Name, age, blood group, photo', onPress: () => navigation.navigate('PersonalInfo')},
  {icon: '📋', iconBg: Colors.pinkBg, name: 'Personal details', sub: 'Address, emergency contacts, lifestyle', onPress: () => navigation.navigate('ContactDetails')},
  {icon: '🏥', iconBg: Colors.redBg, name: 'Conditions & medications', sub: '3 conditions · 3 active medications', badge: '1 review due', badgeStyle: 'r', onPress: () => navigation.navigate('HealthProfile')},
  {icon: '👨‍👩‍👧', iconBg: Colors.pinkBg, name: 'Family members', sub: 'Manage health profiles for your family', badge: 'Add member', badgeStyle: 'b', onPress: () => navigation.navigate('FamilyMembers')},
  {icon: '⌚', iconBg: Colors.blueBg, name: 'Connected devices', sub: 'Apple Health · Fitbit · Omron BP', badge: '3 active', badgeStyle: 'g', onPress: () => navigation.navigate('ConnectedDevices')},
  {icon: '🔔', iconBg: Colors.amberBg, name: 'Notifications & reminders', sub: 'Medication · Tests · Ayu nudges', onPress: () => navigation.navigate('Preferences')},
];

const getDataItems = (navigation) => [
  {icon: '✅', iconBg: Colors.tealBg, name: 'Consent manager', sub: 'Control what data is shared and with whom', badge: '3 active consents', badgeStyle: 'p', onPress: () => navigation.navigate('ConsentManager')},
  {icon: '📊', iconBg: Colors.blueBg, name: 'Data access log', sub: 'See who accessed your data and when', onPress: () => navigation.navigate('AccessLog')},
  {icon: '🔍', iconBg: Colors.purpleBg, name: 'Data transparency centre', sub: 'What we collect, why we collect it', onPress: () => navigation.navigate('DataTransparency')},
];

const serviceItems = [
  {icon: '🧪', iconBg: Colors.tealBg, name: 'Home lab test', sub: 'Book collection at home · Results in 24h', badge: 'HbA1c due Apr 4', badgeStyle: 'r'},
  {icon: '💊', iconBg: Colors.purpleBg, name: 'Order medicines', sub: 'Metformin · Amlodipine · Atorvastatin', badge: 'Refill due', badgeStyle: 'a'},
  {icon: '📱', iconBg: Colors.amberBg, name: 'All health services', sub: 'Doctor · Nurse · Physio · Wellness · Insurance'},
];

const getAboutItems = (navigation) => [
  {icon: '🔐', iconBg: Colors.tealBg, name: 'Security centre', sub: 'Login activity · 2FA · Change password', onPress: () => navigation.navigate('Security')},
  {icon: '📄', iconBg: Colors.blueBg, name: 'Privacy policy', sub: 'How we protect your health data', onPress: () => navigation.navigate('PrivacyPolicy')},
  {icon: '📃', iconBg: Colors.purpleBg, name: 'Terms of service', sub: 'Platform usage and user rights', onPress: () => navigation.navigate('TermsOfService')},
  {icon: '✏️', iconBg: Colors.amberBg, name: 'User consent agreement', sub: 'Review and update your consents', badge: 'Signed Mar 2026', badgeStyle: 'p', onPress: () => navigation.navigate('ConsentAgreement')},
  {icon: '⭐', iconBg: Colors.tealBg, name: 'Rate us on the store', sub: 'Help us grow · Takes 30 seconds'},
  {icon: '❓', iconBg: Colors.background, name: 'Help & support', sub: 'FAQs · Chat support · Report an issue', onPress: () => navigation.navigate('HelpSupport')},
];

const ProfileScreen = ({navigation}) => {
  const accountItems = getAccountItems(navigation);
  const dataItems = getDataItems(navigation);
  const aboutItems = getAboutItems(navigation);
  return (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
    <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
      <ProfileHeader onBack={() => navigation.goBack()} />
      <View style={styles.body}>
        <AyuCard />
        <HealthSummary />
        <CareTeamCard />
        <MenuSection title="Account" items={accountItems} />
        <MenuSection title="Data & Transparency" items={dataItems} />
        <TrustReportCard />
        <BillingCard />
        <MenuSection title="Health Services" items={serviceItems} />
        <SOSCard />
        <MenuSection title="About" items={aboutItems} />
        <TouchableOpacity style={styles.logoutBtn} activeOpacity={0.7}>
          <AppText variant="body" color={Colors.redText} style={{fontWeight: '500'}}>Log out</AppText>
        </TouchableOpacity>
        <AppText variant="caption" color={Colors.textTertiary} style={styles.version}>TrustLife v2.4.1 · Made with care in Hyderabad, India</AppText>
        <View style={{height: vs(20)}} />
      </View>
    </ScrollView>
  </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  body: {padding: s(12)},
  logoutBtn: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, paddingVertical: vs(14), alignItems: 'center', marginBottom: vs(10)},
  version: {textAlign: 'center', paddingVertical: vs(4)},
});

export default ProfileScreen;
