import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const genderOptions = ['Male', 'Female', 'Other'];

const PatientDetailsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {appointment} = route.params || {};

  const [fullName, setFullName] = useState('');
  const [gender, setGender] = useState('');
  const [showGenderPicker, setShowGenderPicker] = useState(false);
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');
  const [emergency, setEmergency] = useState('');

  const handleSave = () => {
    const patient = {
      fullName,
      gender,
      dob,
      mobile,
      emergency,
    };
    navigation.navigate('ReviewAppointment', {appointment, patient});
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtnDark}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}>
          <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <AppText variant="header" color={Colors.white} style={{marginLeft: s(12)}}>Patient Details</AppText>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Info Banner */}
        <View style={styles.infoBanner}>
          <Icon family="Ionicons" name="information-circle-outline" size={18} color={Colors.primary} />
          <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(8), flex: 1}}>
            Please provide accurate patient details for the consultation. This information will be shared with the doctor.
          </AppText>
        </View>

        {/* Full Name */}
        <View style={styles.fieldGroup}>
          <AppText variant="caption" color={Colors.textSecondary} style={styles.label}>Full Name</AppText>
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            placeholderTextColor={Colors.textTertiary}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Gender */}
        <View style={styles.fieldGroup}>
          <AppText variant="caption" color={Colors.textSecondary} style={styles.label}>Gender</AppText>
          <TouchableOpacity
            style={styles.input}
            activeOpacity={0.7}
            onPress={() => setShowGenderPicker(!showGenderPicker)}>
            <AppText
              variant="body"
              color={gender ? Colors.textPrimary : Colors.textTertiary}>
              {gender || 'Select gender'}
            </AppText>
            <Icon
              family="Ionicons"
              name={showGenderPicker ? 'chevron-up-outline' : 'chevron-down-outline'}
              size={18}
              color={Colors.textSecondary}
            />
          </TouchableOpacity>
          {showGenderPicker && (
            <View style={styles.dropdownCard}>
              {genderOptions.map(option => (
                <TouchableOpacity
                  key={option}
                  style={styles.dropdownOption}
                  activeOpacity={0.7}
                  onPress={() => {
                    setGender(option);
                    setShowGenderPicker(false);
                  }}>
                  <AppText
                    variant="body"
                    color={gender === option ? Colors.primary : Colors.textPrimary}
                    style={gender === option ? {fontWeight: '600'} : {}}>
                    {option}
                  </AppText>
                  {gender === option && (
                    <Icon family="Ionicons" name="checkmark" size={18} color={Colors.primary} />
                  )}
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Date of Birth */}
        <View style={styles.fieldGroup}>
          <AppText variant="caption" color={Colors.textSecondary} style={styles.label}>Date of Birth</AppText>
          <View style={styles.inputRow}>
            <TextInput
              style={[styles.input, {flex: 1}]}
              placeholder="DD/MM/YYYY"
              placeholderTextColor={Colors.textTertiary}
              value={dob}
              onChangeText={setDob}
            />
            <View style={styles.inputIcon}>
              <Icon family="Ionicons" name="calendar-outline" size={20} color={Colors.textSecondary} />
            </View>
          </View>
        </View>

        {/* Mobile Number */}
        <View style={styles.fieldGroup}>
          <AppText variant="caption" color={Colors.textSecondary} style={styles.label}>Mobile Number</AppText>
          <TextInput
            style={styles.input}
            placeholder="Enter mobile number"
            placeholderTextColor={Colors.textTertiary}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
          />
        </View>

        {/* Emergency Number */}
        <View style={styles.fieldGroup}>
          <AppText variant="caption" color={Colors.textSecondary} style={styles.label}>Emergency Number</AppText>
          <TextInput
            style={styles.input}
            placeholder="Enter emergency number"
            placeholderTextColor={Colors.textTertiary}
            value={emergency}
            onChangeText={setEmergency}
            keyboardType="phone-pad"
          />
        </View>

        <View style={{height: vs(100)}} />
      </ScrollView>

      {/* Bottom Save Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.saveBtn, (!fullName || !gender || !dob || !mobile) && styles.saveBtnDisabled]}
          activeOpacity={0.8}
          disabled={!fullName || !gender || !dob || !mobile}
          onPress={handleSave}>
          <AppText variant="bodyBold" color={Colors.white}>Save Details</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingTop: vs(14),
    paddingBottom: vs(14),
  },
  backBtnDark: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: s(16),
  },
  infoBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.tealBg,
    borderRadius: ms(12),
    padding: ms(14),
    marginBottom: vs(20),
  },
  fieldGroup: {
    marginBottom: vs(16),
  },
  label: {
    marginBottom: vs(6),
    fontWeight: '500',
  },
  input: {
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    paddingHorizontal: s(14),
    paddingVertical: vs(12),
    fontSize: ms(14),
    color: Colors.textPrimary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  inputRow: {
    position: 'relative',
  },
  inputIcon: {
    position: 'absolute',
    right: s(14),
    top: 0,
    bottom: 0,
    justifyContent: 'center',
  },
  dropdownCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary,
    marginTop: vs(4),
    overflow: 'hidden',
  },
  dropdownOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(14),
    paddingVertical: vs(12),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    paddingBottom: vs(24),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  saveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveBtnDisabled: {
    opacity: 0.5,
  },
});

export default PatientDetailsScreen;
