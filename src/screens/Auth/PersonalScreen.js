import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import AppTextField from '../../components/shared/AppTextField';
import Icon from '../../components/shared/Icons';
import {GENDER_OPTIONS} from '../../constants/authData';

const PersonalScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [dobDay, setDobDay] = useState('');
  const [dobMonth, setDobMonth] = useState('');
  const [dobYear, setDobYear] = useState('');
  const [selectedGender, setSelectedGender] = useState('');
  const [city, setCity] = useState('');
  const [email, setEmail] = useState('');

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Green header */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex:1,marginLeft:s(10)}}>
            <AppText variant="screenName" style={styles.headerTitle}>Tell us about yourself</AppText>
            <AppText variant="caption" style={styles.headerSub}>This helps Ayu personalise your health insights and recommendations.</AppText>
          </View>
          <AppText variant="small" color="rgba(255,255,255,0.5)">Step 3 of 7</AppText>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: '42%'}]} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Full name */}
        <AppText variant="bodyBold" style={styles.fieldLabel}>Full name</AppText>
        <AppTextField
          value={fullName}
          onChangeText={setFullName}
          placeholder="Priya Reddy"
        />

        {/* DOB */}
        <AppText variant="bodyBold" style={styles.fieldLabel}>Date of birth</AppText>
        <View style={styles.dobRow}>
          <View style={{flex: 1}}>
            <AppTextField
              value={dobDay}
              onChangeText={setDobDay}
              placeholder="DD"
              keyboardType="numeric"
            />
          </View>
          <View style={{flex: 1}}>
            <AppTextField
              value={dobMonth}
              onChangeText={setDobMonth}
              placeholder="MM"
              keyboardType="numeric"
            />
          </View>
          <View style={{flex: 1.5}}>
            <AppTextField
              value={dobYear}
              onChangeText={setDobYear}
              placeholder="YYYY"
              keyboardType="numeric"
            />
          </View>
        </View>

        {/* Gender */}
        <AppText variant="bodyBold" style={styles.fieldLabel}>Gender</AppText>
        <View style={styles.pillRow}>
          {GENDER_OPTIONS.map(g => (
            <TouchableOpacity
              key={g}
              style={[
                styles.pill,
                selectedGender === g && styles.pillSelected,
              ]}
              onPress={() => setSelectedGender(g)}
              activeOpacity={0.7}>
              <AppText
                variant="body"
                color={selectedGender === g ? Colors.accent : Colors.textPrimary}>
                {g}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* City */}
        <AppText variant="bodyBold" style={styles.fieldLabel}>City</AppText>
        <AppTextField
          value={city}
          onChangeText={setCity}
          placeholder="Hyderabad"
        />

        {/* Email */}
        <AppText variant="bodyBold" style={styles.fieldLabel}>Email</AppText>
        <AppTextField
          value={email}
          onChangeText={setEmail}
          placeholder="priya@example.com"
          keyboardType="email-address"
        />

        <View style={{height: vs(80)}} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + vs(12)}]}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('Health')}
          activeOpacity={0.7}>
          <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>Continue</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
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
  progressFill: {height: 3, backgroundColor: Colors.accent},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: s(20), paddingTop: vs(20), paddingBottom: vs(20)},
  fieldLabel: {color: Colors.textPrimary, marginBottom: vs(6), marginTop: vs(4)},
  dobRow: {flexDirection: 'row', gap: s(10)},
  pillRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(4), marginBottom: vs(14)},
  pill: {backgroundColor: Colors.white, borderRadius: ms(20), paddingHorizontal: s(14), paddingVertical: vs(8)},
  pillSelected: {backgroundColor: Colors.tealBg, borderWidth: 1, borderColor: Colors.accent},
  bottomBar: {paddingHorizontal: s(20), paddingTop: vs(12), backgroundColor: Colors.background, borderTopWidth: 0.5, borderTopColor: Colors.borderLight},
  ctaBtn: {backgroundColor: Colors.primary, borderRadius: ms(14), paddingVertical: vs(16), alignItems: 'center'},
});

export default PersonalScreen;
