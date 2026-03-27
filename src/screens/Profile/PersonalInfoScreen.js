import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import AppTextField from '../../components/shared/AppTextField';
import AppDropdown from '../../components/shared/AppDropdown';

const PersonalInfoScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Basic Details
  const [firstName, setFirstName] = useState('Priya');
  const [lastName, setLastName] = useState('Raghunathan');
  const [dob, setDob] = useState('14 Mar 1987');
  const [age, setAge] = useState('38 years');
  const [gender, setGender] = useState('Female');
  const [maritalStatus, setMaritalStatus] = useState('Married');
  const [bloodGroup, setBloodGroup] = useState('O+');
  const [nationality, setNationality] = useState('Indian');
  const [idType, setIdType] = useState('Aadhaar');
  const [idNumber, setIdNumber] = useState('XXXX-XXXX-4521');
  const [bio, setBio] = useState(
    'Software engineer. Mother of two. Health-conscious.',
  );

  // Address
  const [street, setStreet] = useState('Plot 14, Jubilee Hills Road 36');
  const [city, setCity] = useState('Hyderabad');
  const [state, setState] = useState('Telangana');
  const [pinCode, setPinCode] = useState('500033');
  const [country, setCountry] = useState('India');

  // Contact Details
  const [primaryEmail, setPrimaryEmail] = useState('priya.r@example.com');
  const [alternateEmail, setAlternateEmail] = useState('');
  const [mobile, setMobile] = useState('+91 98400 55210');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('+91 98400 55210');

  const renderSectionHeader = (title, saveLabel) => (
    <View style={styles.sectionHeaderRow}>
      <AppText variant="sectionTitle">{title}</AppText>
      {saveLabel ? (
        <TouchableOpacity activeOpacity={0.6}>
          <AppText variant="small" color={Colors.accent} style={styles.saveText}>
            {saveLabel}
          </AppText>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={[styles.header, {paddingTop: insets.top + vs(10)}]}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}
            style={styles.backButton}>
            <AppText variant="body" color={Colors.white} style={styles.backText}>
              ‹ Profile
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.savePill}>
            <AppText variant="small" color={Colors.white} style={styles.savePillText}>
              Save
            </AppText>
          </TouchableOpacity>
        </View>

        <AppText variant="screenName" color={Colors.white} style={styles.title}>
          Personal Info
        </AppText>
        <AppText variant="caption" color={Colors.heroTextMuted}>
          Priya Raghunathan
        </AppText>
      </View>

      {/* Body */}
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Section 1: Basic Details */}
        <View style={styles.card}>
          {renderSectionHeader('Basic Details', 'Save Changes')}
          <View style={styles.fieldsRow}>
            <View style={styles.halfField}>
              <AppTextField
                label="First Name"
                value={firstName}
                onChangeText={setFirstName}
              />
            </View>
            <View style={styles.halfField}>
              <AppTextField
                label="Last Name"
                value={lastName}
                onChangeText={setLastName}
              />
            </View>
            <View style={styles.halfField}>
              <AppTextField
                label="Date of Birth"
                value={dob}
                onChangeText={setDob}
              />
            </View>
            <View style={styles.halfField}>
              <AppTextField
                label="Age"
                value={age}
                onChangeText={setAge}
                readOnly
              />
            </View>
            <View style={styles.halfField}>
              <AppDropdown
                label="Gender"
                value={gender}
                onSelect={setGender}
                options={['Female', 'Male', 'Non-binary', 'Prefer not to say']}
              />
            </View>
            <View style={styles.halfField}>
              <AppDropdown
                label="Marital Status"
                value={maritalStatus}
                onSelect={setMaritalStatus}
                options={['Married', 'Single', 'Divorced', 'Widowed']}
              />
            </View>
            <View style={styles.halfField}>
              <AppDropdown
                label="Blood Group"
                value={bloodGroup}
                onSelect={setBloodGroup}
                options={['O+', 'A+', 'B+', 'AB+', 'O-', 'A-', 'B-', 'AB-']}
              />
            </View>
            <View style={styles.halfField}>
              <AppTextField
                label="Nationality"
                value={nationality}
                onChangeText={setNationality}
              />
            </View>
            <View style={styles.halfField}>
              <AppDropdown
                label="ID Type"
                value={idType}
                onSelect={setIdType}
                options={['Aadhaar', 'Passport', 'PAN Card', 'Voter ID']}
              />
            </View>
            <View style={styles.halfField}>
              <AppTextField
                label="ID Number"
                value={idNumber}
                onChangeText={setIdNumber}
              />
            </View>
            <View style={styles.fullField}>
              <AppTextField
                label="Bio / Notes"
                value={bio}
                onChangeText={setBio}
                multiline
              />
            </View>
          </View>
        </View>

        {/* Section 2: Address */}
        <View style={styles.card}>
          {renderSectionHeader('Address', 'Save')}
          <View style={styles.fieldsRow}>
            <View style={styles.fullField}>
              <AppTextField
                label="Street Address"
                value={street}
                onChangeText={setStreet}
              />
            </View>
            <View style={styles.halfField}>
              <AppTextField
                label="City"
                value={city}
                onChangeText={setCity}
              />
            </View>
            <View style={styles.halfField}>
              <AppTextField
                label="State"
                value={state}
                onChangeText={setState}
              />
            </View>
            <View style={styles.halfField}>
              <AppTextField
                label="PIN Code"
                value={pinCode}
                onChangeText={setPinCode}
                keyboardType="numeric"
              />
            </View>
            <View style={styles.halfField}>
              <AppTextField
                label="Country"
                value={country}
                onChangeText={setCountry}
              />
            </View>
          </View>
        </View>

        {/* Section 3: Contact Details */}
        <View style={styles.card}>
          {renderSectionHeader('Contact Information')}
          <View style={styles.fieldsRow}>
            <View style={styles.halfField}>
              <AppTextField
                label="Primary Email"
                value={primaryEmail}
                onChangeText={setPrimaryEmail}
                hint="Used for account notifications"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.halfField}>
              <AppTextField
                label="Alternate Email"
                value={alternateEmail}
                onChangeText={setAlternateEmail}
                placeholder="Optional alternate email"
                keyboardType="email-address"
              />
            </View>
            <View style={styles.halfField}>
              <AppTextField
                label="Mobile Number"
                value={mobile}
                onChangeText={setMobile}
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.halfField}>
              <AppTextField
                label="Alternate Phone"
                value={alternatePhone}
                onChangeText={setAlternatePhone}
                placeholder="Optional alternate number"
                keyboardType="phone-pad"
              />
            </View>
            <View style={styles.halfField}>
              <AppTextField
                label="WhatsApp"
                value={whatsapp}
                onChangeText={setWhatsapp}
                hint="If different from mobile"
              />
            </View>
          </View>
        </View>

        <View style={{height: vs(40)}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(16),
    paddingBottom: vs(16),
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  backButton: {
    paddingVertical: vs(4),
  },
  backText: {
    fontSize: ms(16),
    fontWeight: '600',
  },
  savePill: {
    backgroundColor: Colors.accent,
    borderRadius: ms(20),
    paddingHorizontal: s(18),
    paddingVertical: vs(6),
  },
  savePillText: {
    fontWeight: '600',
  },
  title: {
    marginBottom: vs(2),
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: s(16),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    padding: s(16),
    marginBottom: vs(14),
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  saveText: {
    fontWeight: '600',
  },
  fieldsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  halfField: {
    width: '48%',
  },
  fullField: {
    width: '100%',
  },
});

export default PersonalInfoScreen;
