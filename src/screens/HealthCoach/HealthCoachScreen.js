import React from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Image} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const C = {
  blueBg: '#E6F1FB', greenBg: '#E1F5EE', amberBg: '#FAEEDA',
  redBg: '#FCEBEB', pinkBg: '#FBEAF0', purpleBg: '#EEEDFE',
};

const pillColors = {
  New: {bg: '#E6F1FB', color: '#185FA5'},
  Tomorrow: {bg: '#FAEEDA', color: '#633806'},
  Critical: {bg: '#FCEBEB', color: '#791F1F'},
  Safety: {bg: '#EEEDFE', color: '#3C3489'},
  'Always on': {bg: '#E1F5EE', color: '#085041'},
  Ecosystem: {bg: '#E1F5EE', color: '#085041'},
};

const capabilities = [
  {
    section: 'Core companion',
    items: [
      {key: 'passport', icon: 'card-outline', family: 'Ionicons', bg: C.blueBg, name: 'Health Passport', desc: 'Portable lifetime record · Share in one tap', pill: 'New'},
      {key: 'timeline', icon: 'time-outline', family: 'Ionicons', bg: C.greenBg, name: 'Health Timeline', desc: 'Your complete health story from 2019 to today', pill: 'New'},
      {key: 'preappt', icon: 'clipboard-outline', family: 'Ionicons', bg: C.amberBg, name: 'Pre-appointment prep', desc: 'Ayu briefs you before every doctor visit', pill: 'Tomorrow'},
      {key: 'emergency', icon: 'warning-outline', family: 'Ionicons', bg: C.redBg, name: 'Emergency health card', desc: 'Lock screen accessible · No login needed', pill: 'Critical'},
    ],
  },
  {
    section: 'Intelligence layers',
    items: [
      {key: 'nutrition', icon: 'nutrition-outline', family: 'Ionicons', bg: C.pinkBg, name: 'Nutrition intelligence', desc: 'GI scoring · Food as medicine for T2DM', pill: 'New'},
      {key: 'medintel', icon: 'medkit-outline', family: 'Ionicons', bg: C.purpleBg, name: 'Medication intelligence', desc: 'Interactions · Side effects · Drug education', pill: 'Safety'},
      {key: 'mental', icon: 'happy-outline', family: 'Ionicons', bg: C.pinkBg, name: 'Mental health & wellbeing', desc: 'Mood · Stress · Wellbeing score', pill: 'New'},
      {key: 'ayupro', icon: 'sparkles-outline', family: 'Ionicons', bg: C.greenBg, name: 'Ayu proactive intelligence', desc: 'Weekly brief · Pattern alerts · Celebrations', pill: 'Always on'},
    ],
  },
  {
    section: 'Life management',
    items: [
      {key: 'family', icon: 'people-outline', family: 'Ionicons', bg: C.pinkBg, name: 'Family health', desc: 'Manage the whole family under one account', pill: 'New'},
      {key: 'goals', icon: 'flag-outline', family: 'Ionicons', bg: C.greenBg, name: 'Goals & milestones', desc: 'Set targets · Track · Celebrate achievements', pill: 'New'},
      {key: 'preventive', icon: 'map-outline', family: 'Ionicons', bg: C.blueBg, name: 'Preventive roadmap', desc: '5-year projection · CV risk · Screening calendar', pill: 'New'},
      {key: 'spending', icon: 'wallet-outline', family: 'Ionicons', bg: C.amberBg, name: 'Health spending', desc: 'Claims · 80D tax · Annual spend summary', pill: 'New'},
      {key: 'devices', icon: 'watch-outline', family: 'Ionicons', bg: C.blueBg, name: 'Connected devices', desc: 'Wearables · Sync status · Data quality', pill: 'New'},
      {key: 'doctorportal', icon: 'business-outline', family: 'Ionicons', bg: C.blueBg, name: 'Doctor companion portal', desc: 'What Dr. Kavitha sees between your visits', pill: 'Ecosystem'},
    ],
  },
];

const HealthCoachScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.header}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
          <Image
            source={require('../../assets/img/ayu-nb.gif')}
            style={{width: ms(40), height: ms(40)}}
            resizeMode="contain"
          />
          <View>
            <AppText variant="screenName" color={Colors.white}>Ayu Companion</AppText>
            <AppText variant="subtitle" color="rgba(255,255,255,0.6)" style={{marginTop: vs(2)}}>
              14 features · Tap each to explore
            </AppText>
          </View>
        </View>
      </View>

      <ScrollView
        style={{flex: 1}}
        contentContainerStyle={styles.body}
        showsVerticalScrollIndicator={false}>

        {capabilities.map((section, si) => (
          <View key={si}>
            <AppText variant="sectionTitle" color={Colors.black} style={styles.sectionLabel}>
              {section.section}
            </AppText>
            {section.items.map((item, ii) => {
              const pill = pillColors[item.pill] || pillColors.New;
              return (
                <TouchableOpacity
                  key={ii}
                  style={styles.hubCard}
                  activeOpacity={0.7}
                  onPress={() => navigation.navigate('CapabilityDetail', {key: item.key, name: item.name})}>
                  <View style={[styles.hubIcon, {backgroundColor: item.bg}]}>
                    <Icon family={item.family} name={item.icon} size={20} color={Colors.primary} />
                  </View>
                  <View style={{flex: 1}}>
                    <AppText variant="bodyBold">{item.name}</AppText>
                    <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{item.desc}</AppText>
                  </View>
                  <View style={[styles.pill, {backgroundColor: pill.bg}]}>
                    <AppText variant="small" color={pill.color} style={{fontWeight: '500'}}>{item.pill}</AppText>
                  </View>
                  <Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.black} />
                </TouchableOpacity>
              );
            })}
          </View>
        ))}

        <View style={{height: vs(80)}} />
      </ScrollView>

      {/* Floating Chat Button */}
      <TouchableOpacity
        style={styles.fab}
        activeOpacity={0.85}
        onPress={() => navigation.navigate('AyuChat')}>
        <Icon family="Ionicons" name="chatbubble-ellipses" size={24} color={Colors.white} />
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingTop: vs(14), paddingBottom: vs(20)},
  body: {padding: s(12)},
  sectionLabel: {textTransform: 'uppercase', letterSpacing: 0.7, marginTop: vs(14), marginBottom: vs(8)},
  hubCard: {
    backgroundColor: Colors.white, borderRadius: ms(14),
    marginBottom: vs(8), flexDirection: 'row', alignItems: 'center', gap: s(12), padding: ms(13),
  },
  hubIcon: {width: ms(42), height: ms(42), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
  pill: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(20)},
  fab: {
    position: 'absolute', bottom: vs(20), right: s(16),
    width: ms(56), height: ms(56), borderRadius: ms(28),
    backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center',
    elevation: 6, shadowColor: '#000', shadowOffset: {width: 0, height: 3}, shadowOpacity: 0.3, shadowRadius: 4,
  },
});

export default HealthCoachScreen;
