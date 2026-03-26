import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, TextInput, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../../components/shared/AppText';
import Colors from '../../../constants/colors';
import {PROFILE_SUMMARY} from '../../../constants/profileData';

const PersonalTab = () => {
  const p = PROFILE_SUMMARY;

  const [form, setForm] = useState({
    firstName: p.firstName,
    lastName: p.lastName,
    dob: p.dob,
    age: `${p.age} years`,
    gender: p.gender,
    maritalStatus: p.maritalStatus,
    bloodGroup: p.bloodGroup,
    nationality: p.nationality,
    idType: 'Aadhaar',
    idNumber: 'XXXX-XXXX-4521',
    bio: p.bio,
    street: p.address.street,
    city: p.address.city,
    state: p.address.state,
    pin: p.address.pin,
    country: p.address.country,
  });

  const updateField = (key, val) => setForm(prev => ({...prev, [key]: val}));

  const basicFields = [
    {key: 'firstName', label: 'First Name', width: '48%'},
    {key: 'lastName', label: 'Last Name', width: '48%'},
    {key: 'dob', label: 'Date of Birth', width: '48%'},
    {key: 'age', label: 'Age', width: '48%', readonly: true},
    {key: 'gender', label: 'Gender', width: '48%'},
    {key: 'maritalStatus', label: 'Marital Status', width: '48%'},
    {key: 'bloodGroup', label: 'Blood Group', width: '48%'},
    {key: 'nationality', label: 'Nationality', width: '48%'},
    {key: 'idType', label: 'ID Type', width: '48%'},
    {key: 'idNumber', label: 'ID Number', width: '48%'},
  ];

  const addressFields = [
    {key: 'street', label: 'Street Address', width: '100%'},
    {key: 'city', label: 'City', width: '48%'},
    {key: 'state', label: 'State', width: '48%'},
    {key: 'pin', label: 'PIN Code', width: '48%'},
    {key: 'country', label: 'Country', width: '48%'},
  ];

  const renderField = (field) => (
    <View key={field.key} style={[styles.fieldWrap, {width: field.width}]}>
      <AppText variant="small" style={styles.fieldLabel}>
        {field.label.toUpperCase()}
      </AppText>
      <TextInput
        style={[styles.input, field.readonly && styles.inputReadonly]}
        value={form[field.key]}
        onChangeText={val => updateField(field.key, val)}
        editable={!field.readonly}
      />
    </View>
  );

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Basic Details */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>
            Basic Details
          </AppText>
          <TouchableOpacity style={styles.primaryButton}>
            <AppText variant="small" color="#FFFFFF">
              Save Changes
            </AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.formGrid}>
            {basicFields.map(renderField)}
          </View>
          {/* Bio - full width */}
          <View style={[styles.fieldWrap, {width: '100%', marginTop: vs(4)}]}>
            <AppText variant="small" style={styles.fieldLabel}>
              BIO
            </AppText>
            <TextInput
              style={[styles.input, styles.textarea]}
              value={form.bio}
              onChangeText={val => updateField('bio', val)}
              multiline
              numberOfLines={3}
              textAlignVertical="top"
            />
          </View>
        </View>
      </View>

      {/* Address */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>
            Address
          </AppText>
          <TouchableOpacity style={styles.primaryButton}>
            <AppText variant="small" color="#FFFFFF">
              Save
            </AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          <View style={styles.formGrid}>
            {addressFields.map(renderField)}
          </View>
        </View>
      </View>

      <View style={{height: vs(30)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingTop: vs(12),
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ms(16),
    
    
    marginBottom: vs(12),
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD6',
  },
  sectionTitle: {
    fontSize: ms(14),
    color: '#1A1814',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: ms(6),
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
  },
  cardBody: {
    padding: s(16),
  },
  formGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
  },
  fieldWrap: {
    marginBottom: vs(4),
  },
  fieldLabel: {
    fontSize: ms(10),
    color: '#A09E9A',
    marginBottom: vs(4),
    letterSpacing: 0.5,
  },
  input: {
    
    
    borderRadius: ms(6),
    padding: s(10),
    fontSize: ms(14),
    color: '#1A1814',
  },
  inputReadonly: {
    backgroundColor: '#F5F3EF',
    color: '#A09E9A',
  },
  textarea: {
    minHeight: vs(70),
    textAlignVertical: 'top',
  },
});

export default PersonalTab;
