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
import {
  EMERGENCY_CONTACTS,
  EMERGENCY_NUMBERS,
  DOCTORS,
  PREFERRED_FACILITIES,
} from '../../constants/profileData';

const PRIORITY_COLORS = {
  1: {bg: '#FAEAED', color: '#9B3A4A'},
  2: {bg: '#FDF3E7', color: '#B5600E'},
  3: {bg: '#EAF2FB', color: '#1A5276'},
};

const AUTHORITY_COLORS = {
  full: {bg: '#FAEAED', color: '#9B3A4A'},
  med: {bg: '#FDF3E7', color: '#B5600E'},
  info: {bg: '#EAF2FB', color: '#1A5276'},
};

const DOCTOR_COLORS = {
  green: {bg: '#E1F5EE', color: '#0a5c47'},
  purple: {bg: '#EEEDFE', color: '#3C3489'},
  blue: {bg: '#E6F1FB', color: '#0C447C'},
  rose: {bg: '#FAEAED', color: '#9B3A4A'},
  amber: {bg: '#FDF3E7', color: '#B5600E'},
};

const LifestyleBar = ({label, detail, pct, color}) => (
  <View style={{marginBottom: vs(10)}}>
    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4)}}>
      <AppText variant="small" color={Colors.textSecondary} style={{fontWeight: '500'}}>{label}</AppText>
      <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '600'}}>{detail}</AppText>
    </View>
    <View style={{height: vs(5), backgroundColor: Colors.borderLight, borderRadius: ms(99), overflow: 'hidden'}}>
      <View style={{height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: ms(99)}} />
    </View>
  </View>
);

const ContactScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  // Contact Details
  const [primaryEmail, setPrimaryEmail] = useState('priya.r@example.com');
  const [alternateEmail, setAlternateEmail] = useState('');
  const [mobile, setMobile] = useState('+91 98400 55210');
  const [alternatePhone, setAlternatePhone] = useState('');
  const [workPhone, setWorkPhone] = useState('');
  const [whatsapp, setWhatsapp] = useState('+91 98400 55210');

  // Lifestyle state
  const [activityLevel, setActivityLevel] = useState('Moderately Active');
  const [exerciseType, setExerciseType] = useState('Mixed (cardio + strength)');
  const [exerciseFreq, setExerciseFreq] = useState('4');
  const [exerciseDuration, setExerciseDuration] = useState('30-45 min');
  const [dietPattern, setDietPattern] = useState('Omnivore');
  const [mealsPerDay, setMealsPerDay] = useState('3 meals');
  const [waterIntake, setWaterIntake] = useState('2-3 litres');
  const [caffeine, setCaffeine] = useState('1-2 cups/day');
  const [sleepDuration, setSleepDuration] = useState('7-8 hours');
  const [sleepQuality, setSleepQuality] = useState('Good');
  const [bedtime, setBedtime] = useState('23:00');
  const [wakeTime, setWakeTime] = useState('06:30');
  const [tobacco, setTobacco] = useState('Never smoked');
  const [alcohol, setAlcohol] = useState('Occasional (social)');
  const [stressLevel, setStressLevel] = useState('Moderate');
  const [screenTime, setScreenTime] = useState('4-6 hours');
  const [occupation, setOccupation] = useState('Software Engineer');
  const [workType, setWorkType] = useState('Hybrid (3 days office)');

  const renderSectionHeader = (title, actionLabel) => (
    <View style={styles.sectionHeaderRow}>
      <AppText variant="sectionTitle">{title}</AppText>
      {actionLabel ? (
        <TouchableOpacity activeOpacity={0.6}>
          <AppText variant="small" color={Colors.accent} style={styles.actionText}>
            {actionLabel}
          </AppText>
        </TouchableOpacity>
      ) : null}
    </View>
  );

  const renderInfoRow = (label, value) => (
    <View style={styles.infoRow}>
      <AppText variant="small" color={Colors.textTertiary}>
        {label}
      </AppText>
      <AppText variant="body" style={styles.infoValue}>
        {value}
      </AppText>
    </View>
  );

  const renderEmergencyContact = (contact) => {
    const pColor = PRIORITY_COLORS[contact.priority];
    const aColor = AUTHORITY_COLORS[contact.authorityType];

    return (
      <View key={contact.priority} style={styles.contactCard}>
        {/* Header row */}
        <View style={styles.contactHeader}>
          <View style={[styles.priorityCircle, {backgroundColor: pColor.bg}]}>
            <AppText
              variant="small"
              color={pColor.color}
              style={styles.priorityText}>
              {contact.priority}
            </AppText>
          </View>
          <View style={[styles.avatarCircle, {backgroundColor: pColor.bg}]}>
            <AppText
              variant="body"
              color={pColor.color}
              style={styles.avatarText}>
              {contact.initials}
            </AppText>
          </View>
          <View style={styles.contactNameBlock}>
            <AppText variant="bodyBold">{contact.name}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              {contact.relation}
            </AppText>
          </View>
        </View>

        {/* Authority badge */}
        <View style={[styles.authorityBadge, {backgroundColor: aColor.bg}]}>
          <AppText variant="small" color={aColor.color} style={styles.authorityLabel}>
            {contact.authority}
          </AppText>
        </View>

        {/* Info fields */}
        <View style={styles.contactFields}>
          {contact.mobile ? renderInfoRow('Mobile', contact.mobile) : null}
          {contact.whatsapp ? renderInfoRow('WhatsApp', contact.whatsapp) : null}
          {contact.email ? renderInfoRow('Email', contact.email) : null}
          {contact.workPhone ? renderInfoRow('Work Phone', contact.workPhone) : null}
          {contact.altPhone ? renderInfoRow('Alt Phone', contact.altPhone) : null}
          {contact.address ? renderInfoRow('Address', contact.address) : null}
          {contact.proximity ? renderInfoRow('Proximity', contact.proximity) : null}
          {contact.availability ? renderInfoRow('Availability', contact.availability) : null}
          {contact.language ? renderInfoRow('Language', contact.language) : null}
          {contact.mobility ? renderInfoRow('Mobility', contact.mobility) : null}
        </View>

        {/* Notes */}
        {contact.notes ? (
          <View style={styles.notesBox}>
            <AppText variant="small" color={Colors.textSecondary}>
              {contact.notes}
            </AppText>
          </View>
        ) : null}
      </View>
    );
  };

  const renderDoctor = (doctor) => {
    const dColor = DOCTOR_COLORS[doctor.color] || DOCTOR_COLORS.green;

    return (
      <View key={doctor.name} style={styles.doctorCard}>
        <View style={styles.doctorHeader}>
          <View style={[styles.doctorAvatar, {backgroundColor: dColor.bg}]}>
            <AppText variant="body" color={dColor.color} style={styles.avatarText}>
              {doctor.initials}
            </AppText>
          </View>
          <View style={styles.doctorInfo}>
            <AppText variant="bodyBold">{doctor.name}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              {doctor.spec}
            </AppText>
          </View>
        </View>

        <View style={[styles.hospitalTag, {backgroundColor: dColor.bg}]}>
          <AppText variant="small" color={dColor.color}>
            {doctor.tag}
          </AppText>
        </View>

        <AppText variant="small" color={Colors.textSecondary} style={styles.doctorMeta}>
          {doctor.hospital}
        </AppText>
        <AppText variant="small" color={Colors.accent} style={styles.doctorMeta}>
          {doctor.phone}
        </AppText>

        <View style={styles.visitRow}>
          <AppText variant="small" color={Colors.textTertiary}>
            Last visit: {doctor.lastVisit}
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>
            Next: {doctor.nextVisit}
          </AppText>
        </View>

        {/* Action buttons */}
        <View style={styles.doctorActions}>
          <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn}>
            <AppText variant="small" color={Colors.textSecondary} style={styles.actionBtnText}>
              Edit
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={styles.actionBtn}>
            <AppText variant="small" color={Colors.textSecondary} style={styles.actionBtnText}>
              View Notes
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity activeOpacity={0.7} style={styles.actionBtnPrimary}>
            <AppText variant="small" color={Colors.white} style={styles.actionBtnText}>
              Book Appointment
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

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
              {'\u2039'} Profile
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity activeOpacity={0.7} style={styles.savePill}>
            <AppText variant="small" color={Colors.white} style={styles.savePillText}>
              Save
            </AppText>
          </TouchableOpacity>
        </View>

        <AppText variant="screenName" color={Colors.white} style={styles.title}>
          Contact & Care Team
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
        {/* Section 1: Contact Details */}
        <View style={styles.card}>
          {renderSectionHeader('CONTACT DETAILS')}
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
                label="Work Phone"
                value={workPhone}
                onChangeText={setWorkPhone}
                placeholder="Work number"
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

        {/* Section 2: Emergency Contacts */}
        <View style={styles.card}>
          {renderSectionHeader('EMERGENCY CONTACTS', 'Add Contact')}
          <View style={styles.warningBanner}>
            <AppText variant="small" color="#9B3A4A">
              Contacts are listed in priority order. Person #1 will be called first in an emergency.
            </AppText>
          </View>
          {EMERGENCY_CONTACTS.map(renderEmergencyContact)}
        </View>

        {/* Section 3: Emergency Numbers */}
        {renderSectionHeader('QUICK EMERGENCY NUMBERS')}
        <View style={styles.numbersGrid}>
          {EMERGENCY_NUMBERS.map((item) => (
            <View key={item.number} style={styles.numberCard}>
              <AppText
                style={[styles.numberValue, {color: item.color}]}>
                {item.number}
              </AppText>
              <AppText variant="small" color={Colors.textSecondary}>
                {item.label}
              </AppText>
            </View>
          ))}
        </View>

        {/* Section 4: Care Team */}
        <View style={styles.card}>
          {renderSectionHeader('CARE TEAM', 'Add Doctor')}
          {DOCTORS.map(renderDoctor)}
        </View>

        {/* Section 5: Preferred Facilities */}
        {renderSectionHeader('PREFERRED FACILITIES')}
        <View style={styles.facilitiesGrid}>
          {PREFERRED_FACILITIES.map((facility) => (
            <View key={facility.label} style={styles.facilityCard}>
              <AppText
                variant="small"
                color={Colors.textTertiary}
                style={styles.facilityLabel}>
                {facility.label}
              </AppText>
              <AppText variant="bodyBold">{facility.name}</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                {facility.sub}
              </AppText>
              <AppText variant="small" color={Colors.accent} style={styles.facilityPhone}>
                {facility.phone}
              </AppText>
            </View>
          ))}
        </View>

        {/* ── Section 6: Physical Activity ── */}
        {renderSectionHeader('PHYSICAL ACTIVITY')}
        <View style={styles.card}>
          <View style={styles.formRow}>
            <View style={styles.halfField}>
              <AppDropdown label="Activity Level" value={activityLevel} options={['Sedentary', 'Lightly Active', 'Moderately Active', 'Very Active', 'Athlete']} onSelect={setActivityLevel} />
            </View>
            <View style={styles.halfField}>
              <AppDropdown label="Exercise Type" value={exerciseType} options={['Mixed (cardio + strength)', 'Running/Walking', 'Yoga/Pilates', 'Swimming', 'Cycling', 'Gym/Weights']} onSelect={setExerciseType} />
            </View>
            <View style={styles.halfField}>
              <AppTextField label="Frequency (days/week)" value={exerciseFreq} onChangeText={setExerciseFreq} keyboardType="numeric" />
            </View>
            <View style={styles.halfField}>
              <AppDropdown label="Avg Duration" value={exerciseDuration} options={['Under 20 min', '20-30 min', '30-45 min', '45-60 min', '60+ min']} onSelect={setExerciseDuration} />
            </View>
          </View>
          <LifestyleBar label="Weekly active minutes" detail="150 / 150 min goal" pct={100} color={Colors.accent} />
          <LifestyleBar label="Daily step count (avg)" detail="7,400 steps" pct={74} color="#E9A23A" />
          <LifestyleBar label="Sedentary hours/day" detail="6 hrs" pct={50} color="#E9A23A" />
        </View>

        {/* ── Section 7: Diet & Nutrition ── */}
        {renderSectionHeader('DIET & NUTRITION')}
        <View style={styles.card}>
          <View style={styles.formRow}>
            <View style={styles.halfField}>
              <AppDropdown label="Dietary Pattern" value={dietPattern} options={['Omnivore', 'Vegetarian', 'Vegan', 'Pescatarian', 'Keto', 'Gluten-free']} onSelect={setDietPattern} />
            </View>
            <View style={styles.halfField}>
              <AppDropdown label="Meals per Day" value={mealsPerDay} options={['2 meals', '3 meals', '4+ meals', 'Intermittent fasting']} onSelect={setMealsPerDay} />
            </View>
            <View style={styles.halfField}>
              <AppDropdown label="Daily Water" value={waterIntake} options={['Under 1 litre', '1-2 litres', '2-3 litres', '3+ litres']} onSelect={setWaterIntake} />
            </View>
            <View style={styles.halfField}>
              <AppDropdown label="Caffeine" value={caffeine} options={['None', '1-2 cups/day', '3-4 cups/day', '5+ cups/day']} onSelect={setCaffeine} />
            </View>
          </View>
          <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(6), fontWeight: '600'}}>Food preferences</AppText>
          <View style={styles.chipRow}>
            {[{l:'No red meat',t:'on'},{l:'Low sodium',t:'on'},{l:'Lactose tolerant',t:'on'},{l:'Nut allergy',t:'off'},{l:'Gluten tolerant',t:'on'},{l:'Low sugar (medical)',t:'warn'},{l:'Shellfish allergy',t:'off'}].map(c => (
              <View key={c.l} style={[styles.lChip, c.t === 'on' ? styles.lChipOn : c.t === 'warn' ? styles.lChipWarn : styles.lChipOff]}>
                <AppText variant="small" style={{color: c.t === 'on' ? Colors.accent : c.t === 'warn' ? '#B5600E' : '#A09E9A', fontWeight: '500'}}>{c.l}</AppText>
              </View>
            ))}
          </View>
          <LifestyleBar label="Fruit & veg servings/day" detail="4 servings" pct={80} color={Colors.accent} />
          <LifestyleBar label="Processed food frequency" detail="Occasional" pct={30} color="#E9A23A" />
        </View>

        {/* ── Section 8: Sleep ── */}
        {renderSectionHeader('SLEEP')}
        <View style={styles.card}>
          <View style={styles.formRow}>
            <View style={styles.halfField}>
              <AppDropdown label="Avg Duration" value={sleepDuration} options={['Under 5 hrs', '5-6 hrs', '6-7 hrs', '7-8 hours', '8+ hrs']} onSelect={setSleepDuration} />
            </View>
            <View style={styles.halfField}>
              <AppDropdown label="Sleep Quality" value={sleepQuality} options={['Poor', 'Fair', 'Good', 'Excellent']} onSelect={setSleepQuality} />
            </View>
            <View style={styles.halfField}>
              <AppTextField label="Usual Bedtime" value={bedtime} onChangeText={setBedtime} />
            </View>
            <View style={styles.halfField}>
              <AppTextField label="Usual Wake Time" value={wakeTime} onChangeText={setWakeTime} />
            </View>
          </View>
          <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(6), fontWeight: '600'}}>Sleep issues</AppText>
          <View style={styles.chipRow}>
            {[{l:'Occasional insomnia',t:'warn'},{l:'Sleep apnea',t:'off'},{l:'Snoring',t:'off'},{l:'No restless legs',t:'on'},{l:'Night sweats',t:'off'}].map(c => (
              <View key={c.l} style={[styles.lChip, c.t === 'on' ? styles.lChipOn : c.t === 'warn' ? styles.lChipWarn : styles.lChipOff]}>
                <AppText variant="small" style={{color: c.t === 'on' ? Colors.accent : c.t === 'warn' ? '#B5600E' : '#A09E9A', fontWeight: '500'}}>{c.l}</AppText>
              </View>
            ))}
          </View>
          <LifestyleBar label="Sleep consistency score" detail="72 / 100" pct={72} color="#E9A23A" />
        </View>

        {/* ── Section 9: Substance Use ── */}
        {renderSectionHeader('SUBSTANCE USE & HABITS')}
        <View style={styles.card}>
          <View style={styles.formRow}>
            <View style={styles.halfField}>
              <AppDropdown label="Tobacco / Smoking" value={tobacco} options={['Never smoked', 'Current smoker', 'Former smoker']} onSelect={setTobacco} />
            </View>
            <View style={styles.halfField}>
              <AppDropdown label="Alcohol" value={alcohol} options={['None', 'Occasional (social)', 'Moderate (weekly)', 'Frequent']} onSelect={setAlcohol} />
            </View>
            <View style={styles.halfField}>
              <AppDropdown label="Stress Level" value={stressLevel} options={['Low', 'Moderate', 'High', 'Very high']} onSelect={setStressLevel} />
            </View>
            <View style={styles.halfField}>
              <AppDropdown label="Screen Time" value={screenTime} options={['Under 2 hrs', '2-4 hrs', '4-6 hours', '6-8 hrs', '8+ hrs']} onSelect={setScreenTime} />
            </View>
          </View>
        </View>

        {/* ── Section 10: Occupation ── */}
        {renderSectionHeader('OCCUPATION & WORK')}
        <View style={styles.card}>
          <View style={styles.formRow}>
            <View style={styles.halfField}>
              <AppTextField label="Occupation" value={occupation} onChangeText={setOccupation} />
            </View>
            <View style={styles.halfField}>
              <AppDropdown label="Work Type" value={workType} options={['Remote', 'Hybrid (3 days office)', 'Full in-office', 'Field work']} onSelect={setWorkType} />
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
  actionText: {
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

  // Emergency Contacts
  warningBanner: {
    backgroundColor: '#FAEAED',
    borderRadius: ms(10),
    padding: s(12),
    marginBottom: vs(12),
  },
  contactCard: {
    backgroundColor: Colors.background,
    borderRadius: ms(12),
    padding: s(14),
    marginBottom: vs(10),
  },
  contactHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  priorityCircle: {
    width: ms(26),
    height: ms(26),
    borderRadius: ms(13),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(8),
  },
  priorityText: {
    fontWeight: '700',
    fontSize: ms(12),
  },
  avatarCircle: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(10),
  },
  avatarText: {
    fontWeight: '700',
    fontSize: ms(13),
  },
  contactNameBlock: {
    flex: 1,
  },
  authorityBadge: {
    alignSelf: 'flex-start',
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    marginBottom: vs(10),
  },
  authorityLabel: {
    fontWeight: '600',
  },
  contactFields: {
    marginBottom: vs(6),
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(4),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  infoValue: {
    flex: 1,
    textAlign: 'right',
    fontWeight: '500',
  },
  notesBox: {
    backgroundColor: '#f3f4f6',
    borderRadius: ms(8),
    padding: s(10),
    marginTop: vs(4),
  },

  // Emergency Numbers
  numbersGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
    marginBottom: vs(14),
  },
  numberCard: {
    width: '30%',
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    padding: s(12),
    alignItems: 'center',
  },
  numberValue: {
    fontSize: ms(20),
    fontWeight: '700',
    marginBottom: vs(4),
  },

  // Care Team
  doctorCard: {
    backgroundColor: Colors.background,
    borderRadius: ms(12),
    padding: s(14),
    marginBottom: vs(10),
  },
  doctorHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  doctorAvatar: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: s(10),
  },
  doctorInfo: {
    flex: 1,
  },
  hospitalTag: {
    alignSelf: 'flex-start',
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    marginBottom: vs(6),
  },
  doctorMeta: {
    marginBottom: vs(3),
  },
  visitRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(4),
    marginBottom: vs(10),
  },
  doctorActions: {
    flexDirection: 'row',
    gap: s(8),
  },
  actionBtn: {
    borderWidth: 1,
    borderColor: Colors.borderLight,
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
  },
  actionBtnPrimary: {
    backgroundColor: Colors.accent,
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
  },
  actionBtnText: {
    fontWeight: '600',
  },

  // Preferred Facilities
  facilitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
    marginBottom: vs(14),
  },
  facilityCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    padding: s(16),
  },
  facilityLabel: {
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: vs(4),
  },
  facilityPhone: {
    marginTop: vs(6),
    fontWeight: '500',
  },

  /* Lifestyle */
  formRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  halfField: {
    width: '48%',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginBottom: vs(12),
  },
  lChip: {
    paddingVertical: vs(3),
    paddingHorizontal: s(10),
    borderRadius: ms(20),
    borderWidth: 0.5,
  },
  lChipOn: {
    backgroundColor: Colors.tealBg,
    borderColor: '#B7DFC9',
  },
  lChipWarn: {
    backgroundColor: '#FDF3E7',
    borderColor: '#F0C98A',
  },
  lChipOff: {
    backgroundColor: Colors.background,
    borderColor: Colors.borderLight,
  },
});

export default ContactScreen;
