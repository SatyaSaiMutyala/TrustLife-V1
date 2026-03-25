import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const relationships = ['Spouse', 'Child', 'Parent', 'Sibling', 'Other'];

const InsuranceNomineeDetailsScreen = () => {
  const navigation = useNavigation();
  const [fullName, setFullName] = useState('');
  const [relationship, setRelationship] = useState('');
  const [showRelationshipPicker, setShowRelationshipPicker] = useState(false);
  const [dob, setDob] = useState('');
  const [mobile, setMobile] = useState('');

  const isFormValid = fullName.trim() && relationship && dob.trim() && mobile.trim().length === 10;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}>
          <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={{flex: 1, marginLeft: s(12)}}>
          <AppText variant="screenName" color={Colors.white}>Nominee Details</AppText>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Info Text */}
        <View style={styles.infoCard}>
          <Icon family="Ionicons" name="information-circle-outline" size={20} color={Colors.primary} />
          <AppText variant="caption" color={Colors.textSecondary} style={{flex: 1, marginLeft: s(8)}}>
            Please provide the nominee details for your insurance policy. The nominee will receive the benefits in case of any eventuality.
          </AppText>
        </View>

        {/* Nominee Full Name */}
        <AppText variant="body" style={styles.label}>Nominee Full Name</AppText>
        <View style={styles.inputWrap}>
          <Icon family="Ionicons" name="person-outline" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.input}
            placeholder="Enter full name"
            placeholderTextColor={Colors.textTertiary}
            value={fullName}
            onChangeText={setFullName}
          />
        </View>

        {/* Relationship */}
        <AppText variant="body" style={styles.label}>Relationship</AppText>
        <TouchableOpacity
          style={styles.inputWrap}
          activeOpacity={0.7}
          onPress={() => setShowRelationshipPicker(!showRelationshipPicker)}>
          <Icon family="Ionicons" name="people-outline" size={18} color={Colors.textTertiary} />
          <AppText
            variant="body"
            color={relationship ? Colors.textPrimary : Colors.textTertiary}
            style={{flex: 1, marginLeft: s(10)}}>
            {relationship || 'Select relationship'}
          </AppText>
          <Icon
            family="Ionicons"
            name={showRelationshipPicker ? 'chevron-up' : 'chevron-down'}
            size={18}
            color={Colors.textTertiary}
          />
        </TouchableOpacity>

        {showRelationshipPicker && (
          <View style={styles.pickerDropdown}>
            {relationships.map((rel) => (
              <TouchableOpacity
                key={rel}
                style={[
                  styles.pickerOption,
                  relationship === rel && styles.pickerOptionSelected,
                ]}
                activeOpacity={0.7}
                onPress={() => {
                  setRelationship(rel);
                  setShowRelationshipPicker(false);
                }}>
                <AppText
                  variant="body"
                  color={relationship === rel ? Colors.primary : Colors.textPrimary}>
                  {rel}
                </AppText>
                {relationship === rel && (
                  <Icon family="Ionicons" name="checkmark" size={18} color={Colors.primary} />
                )}
              </TouchableOpacity>
            ))}
          </View>
        )}

        {/* Date of Birth */}
        <AppText variant="body" style={styles.label}>Date of Birth</AppText>
        <View style={styles.inputWrap}>
          <Icon family="Ionicons" name="calendar-outline" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.input}
            placeholder="DD/MM/YYYY"
            placeholderTextColor={Colors.textTertiary}
            value={dob}
            onChangeText={setDob}
          />
        </View>

        {/* Mobile Number */}
        <AppText variant="body" style={styles.label}>Mobile Number</AppText>
        <View style={styles.inputWrap}>
          <Icon family="Ionicons" name="call-outline" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.input}
            placeholder="Enter 10-digit mobile number"
            placeholderTextColor={Colors.textTertiary}
            value={mobile}
            onChangeText={setMobile}
            keyboardType="phone-pad"
            maxLength={10}
          />
        </View>

        <View style={{height: vs(100)}} />
      </ScrollView>

      {/* Bottom Sticky */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.confirmBtn, !isFormValid && styles.confirmBtnDisabled]}
          activeOpacity={0.8}
          disabled={!isFormValid}
          onPress={() => navigation.navigate('InsuranceDocumentVerification')}>
          <AppText variant="bodyBold" color={Colors.white}>Confirm</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingTop: vs(14),
    paddingBottom: vs(14),
  },
  backBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: s(16),
    paddingTop: vs(16),
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.tealBg,
    borderRadius: ms(12),
    padding: ms(14),
    marginBottom: vs(20),
  },
  label: {
    fontWeight: '500',
    marginBottom: vs(6),
    marginTop: vs(14),
  },
  inputWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    paddingHorizontal: s(12),
    paddingVertical: vs(12),
  },
  input: {
    flex: 1,
    marginLeft: s(10),
    fontSize: ms(14),
    color: Colors.textPrimary,
    padding: 0,
  },
  pickerDropdown: {
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    marginTop: vs(4),
    overflow: 'hidden',
  },
  pickerOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(14),
    paddingVertical: vs(12),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  pickerOptionSelected: {
    backgroundColor: Colors.tealBg,
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
  confirmBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: {
    opacity: 0.5,
  },
});

export default InsuranceNomineeDetailsScreen;
