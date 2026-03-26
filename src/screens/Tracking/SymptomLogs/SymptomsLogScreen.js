import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

// ──────────────────────────────────────────────
// Constants & Data
// ──────────────────────────────────────────────

const MEMBERS = [
  {id: 'priya', label: 'Priya'},
  {id: 'raj', label: 'Raj'},
  {id: 'aarav', label: 'Aarav'},
  {id: 'add', label: '+ Add'},
];

const SYMPTOM_TAGS = [
  'Headache', 'Fatigue', 'Nausea', 'Dizziness', 'Chest pain',
  'Breathlessness', 'Cough', 'Sore throat', 'Fever', 'Chills',
  'Body aches', 'Joint pain', 'Back pain', 'Abdominal pain',
  'Diarrhea', 'Constipation', 'Skin rash', 'Itching', 'Swelling',
  'Vision changes', 'Hearing changes', 'Numbness/tingling',
  'Palpitations', 'Anxiety', 'Insomnia', 'Loss of appetite',
  'Weight change', 'Excessive thirst', 'Frequent urination', 'Other',
];

const SEVERITY_CHIPS = [
  {id: 'mild', label: 'Mild'},
  {id: 'moderate', label: 'Moderate'},
  {id: 'severe', label: 'Severe'},
  {id: 'very_severe', label: 'Very severe'},
];

const DURATION_CHIPS = [
  {id: 'just_started', label: 'Just started'},
  {id: 'hours', label: 'Hours'},
  {id: '1day', label: '1 day'},
  {id: '2_3days', label: '2-3 days'},
  {id: '4_7days', label: '4-7 days'},
  {id: '1_2weeks', label: '1-2 weeks'},
  {id: 'gt2weeks', label: '>2 weeks'},
];

const PATTERN_CHIPS = [
  {id: 'constant', label: 'Constant'},
  {id: 'comes_goes', label: 'Comes and goes'},
  {id: 'getting_worse', label: 'Getting worse'},
  {id: 'getting_better', label: 'Getting better'},
  {id: 'triggered', label: 'Triggered by activity'},
];

const WORSE_TAGS = [
  'Movement', 'Rest', 'Eating', 'Stress', 'Heat',
  'Cold', 'Standing', 'Lying down', 'Nothing specific',
];

const HELPS_TAGS = [
  'Rest', 'Medication', 'Heat pack', 'Cold pack',
  'Sleep', 'Walking', 'Nothing',
];

const RELATED_TAGS = [
  'Related to T2DM', 'Related to HTN', 'Related to medication',
  'New/unrelated', 'Unsure',
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const MemberChip = ({item, isActive, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[
      styles.memberChip,
      isActive && styles.memberChipActive,
    ]}>
    <AppText
      variant="small"
      color={isActive ? Colors.white : 'rgba(255,255,255,0.7)'}
      style={{fontWeight: isActive ? '700' : '500'}}>
      {item.label}
    </AppText>
  </TouchableOpacity>
);

const Chip = ({label, isActive, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[styles.chip, isActive && styles.chipActive]}>
    <AppText
      variant="small"
      color={isActive ? Colors.primary : Colors.textSecondary}
      style={{fontWeight: isActive ? '700' : '500'}}>
      {label}
    </AppText>
  </TouchableOpacity>
);

const Tag = ({label, isActive, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[styles.chip, isActive && styles.chipActive]}>
    <AppText
      variant="small"
      color={isActive ? Colors.primary : Colors.textSecondary}
      style={{fontWeight: isActive ? '700' : '500'}}>
      {label}
    </AppText>
  </TouchableOpacity>
);

const ZoneBanner = () => (
  <View style={styles.zoneBanner}>
    <View style={styles.zoneBannerTop}>
      <View style={styles.zoneIconRow}>
        <Icon
          family="Ionicons"
          name="checkmark-circle"
          size={ms(20)}
          color={Colors.primary}
        />
        <AppText
          variant="bodyBold"
          color={Colors.tealText}
          style={{marginLeft: s(8)}}>
          No active symptoms
        </AppText>
      </View>
      <View style={styles.zoneBadge}>
        <AppText variant="small" color={Colors.primary} style={{fontWeight: '700'}}>
          Clear
        </AppText>
      </View>
    </View>
    <AppText
      variant="caption"
      color={Colors.tealText}
      style={{marginTop: vs(6), lineHeight: ms(17)}}>
      Last logged: mild fatigue 3 days ago
    </AppText>
  </View>
);

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const SymptomsLogScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [activeMember, setActiveMember] = useState('priya');
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [activeSeverity, setActiveSeverity] = useState('mild');
  const [activeDuration, setActiveDuration] = useState(null);
  const [activePattern, setActivePattern] = useState('comes_goes');
  const [selectedWorse, setSelectedWorse] = useState([]);
  const [selectedHelps, setSelectedHelps] = useState([]);
  const [selectedRelated, setSelectedRelated] = useState([]);
  const [notes, setNotes] = useState('');

  const toggleTag = (tag, list, setter) => {
    setter(list.includes(tag) ? list.filter(t => t !== tag) : [...list, tag]);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Compact Header (fixed) ── */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <View style={styles.topRow}>
          <View style={styles.topRowLeft}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon
                family="Ionicons"
                name="chevron-back"
                size={ms(22)}
                color={Colors.white}
              />
            </TouchableOpacity>
            <AppText
              variant="body"
              color="rgba(255,255,255,0.8)"
              style={{marginLeft: s(10)}}>
              Tracking
            </AppText>
          </View>
          <TouchableOpacity style={styles.savePill} activeOpacity={0.7}>
            <AppText variant="small" color={Colors.primary} style={{fontWeight: '700'}}>
              Save
            </AppText>
          </TouchableOpacity>
        </View>
        <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(6)}}>
          Symptom log
        </AppText>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>

        {/* Scrollable header content (green bg) */}
        <View style={styles.scrollableHeader}>
          <AppText
            variant="caption"
            color="rgba(255,255,255,0.7)">
            Tuesday, 24 Mar 2026 {'\u00b7'} 7:22 AM
          </AppText>

          {/* Who tabs */}
          <ScrollView
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.memberChipsContainer}
            style={{marginTop: vs(10)}}>
            {MEMBERS.map(item => (
              <MemberChip
                key={item.id}
                item={item}
                isActive={activeMember === item.id}
                onPress={() => setActiveMember(item.id)}
              />
            ))}
          </ScrollView>

          <ZoneBanner />
        </View>

        {/* ── 1. What Are You Experiencing? ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>WHAT ARE YOU EXPERIENCING?</AppText>
        <View style={styles.card}>
          <View style={styles.chipRow}>
            {SYMPTOM_TAGS.map(tag => (
              <Tag
                key={tag}
                label={tag}
                isActive={selectedSymptoms.includes(tag)}
                onPress={() => toggleTag(tag, selectedSymptoms, setSelectedSymptoms)}
              />
            ))}
          </View>
        </View>

        {/* ── 2. Severity ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>SEVERITY</AppText>
        <View style={styles.card}>
          <View style={styles.chipRow}>
            {SEVERITY_CHIPS.map(chip => (
              <Chip
                key={chip.id}
                label={chip.label}
                isActive={activeSeverity === chip.id}
                onPress={() => setActiveSeverity(chip.id)}
              />
            ))}
          </View>
        </View>

        {/* ── 3. Duration ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>DURATION</AppText>
        <View style={styles.card}>
          <View style={styles.chipRow}>
            {DURATION_CHIPS.map(chip => (
              <Chip
                key={chip.id}
                label={chip.label}
                isActive={activeDuration === chip.id}
                onPress={() => setActiveDuration(chip.id)}
              />
            ))}
          </View>
        </View>

        {/* ── 4. Pattern ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>PATTERN</AppText>
        <View style={styles.card}>
          <View style={styles.chipRow}>
            {PATTERN_CHIPS.map(chip => (
              <Chip
                key={chip.id}
                label={chip.label}
                isActive={activePattern === chip.id}
                onPress={() => setActivePattern(chip.id)}
              />
            ))}
          </View>
        </View>

        {/* ── 5. What Makes It Worse? ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>WHAT MAKES IT WORSE?</AppText>
        <View style={styles.card}>
          <View style={styles.chipRow}>
            {WORSE_TAGS.map(tag => (
              <Tag
                key={tag}
                label={tag}
                isActive={selectedWorse.includes(tag)}
                onPress={() => toggleTag(tag, selectedWorse, setSelectedWorse)}
              />
            ))}
          </View>
        </View>

        {/* ── 6. What Helps? ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>WHAT HELPS?</AppText>
        <View style={styles.card}>
          <View style={styles.chipRow}>
            {HELPS_TAGS.map(tag => (
              <Tag
                key={tag}
                label={tag}
                isActive={selectedHelps.includes(tag)}
                onPress={() => toggleTag(tag, selectedHelps, setSelectedHelps)}
              />
            ))}
          </View>
        </View>

        {/* ── 7. Related Conditions ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>RELATED CONDITIONS</AppText>
        <View style={styles.card}>
          <View style={styles.chipRow}>
            {RELATED_TAGS.map(tag => (
              <Tag
                key={tag}
                label={tag}
                isActive={selectedRelated.includes(tag)}
                onPress={() => toggleTag(tag, selectedRelated, setSelectedRelated)}
              />
            ))}
          </View>
        </View>

        {/* ── 8. Blue Insight ── */}
        <View style={styles.insightBlueCard}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={Colors.blueText} />
            <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6)}}>
              Symptom tracking tip
            </AppText>
          </View>
          <AppText variant="caption" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(17)}}>
            Log symptoms consistently to help Dr. Kavitha identify patterns. Symptoms that persist {'>'}7 days or worsen should be discussed at your next visit (Apr 4).
          </AppText>
        </View>

        {/* ── 9. Note ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>NOTE</AppText>
        <View style={styles.card}>
          <TextInput
            style={styles.textInput}
            placeholder="Add notes about your symptoms..."
            placeholderTextColor={Colors.textTertiary}
            multiline
            value={notes}
            onChangeText={setNotes}
            textAlignVertical="top"
          />
        </View>

        <View style={{height: vs(90)}} />
      </ScrollView>

      {/* ── BOTTOM BAR ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
          <AppText
            variant="bodyBold"
            color={Colors.white}
            style={{textAlign: 'center'}}>
            Save {'\u00b7'} No active symptoms
          </AppText>
        </TouchableOpacity>
        <View style={styles.secondaryButtonRow}>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
            <Icon
              family="Ionicons"
              name="share-outline"
              size={ms(16)}
              color={Colors.primary}
            />
            <AppText
              variant="body"
              color={Colors.primary}
              style={{marginLeft: s(6), fontWeight: '600'}}>
              Share with doctor
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
            <Icon
              family="Ionicons"
              name="trash-outline"
              size={ms(16)}
              color={Colors.primary}
            />
            <AppText
              variant="body"
              color={Colors.primary}
              style={{marginLeft: s(6), fontWeight: '600'}}>
              Discard
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // Header (compact)
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(13),
    paddingBottom: vs(8),
  },
  scrollableHeader: {
    backgroundColor: Colors.primary,
    marginHorizontal: s(-13),
    paddingHorizontal: s(13),
    paddingTop: vs(4),
    paddingBottom: vs(12),
    marginBottom: vs(10),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  topRowLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  savePill: {
    backgroundColor: Colors.white,
    paddingHorizontal: s(14),
    paddingVertical: vs(5),
    borderRadius: ms(20),
  },

  // Member chips
  memberChipsContainer: {
    paddingRight: s(16),
    gap: s(8),
  },
  memberChip: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  memberChipActive: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    borderColor: 'rgba(255,255,255,0.4)',
  },

  // Zone banner
  zoneBanner: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginTop: vs(14),
  },
  zoneBannerTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  zoneIconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  zoneBadge: {
    backgroundColor: Colors.tealBg,
    borderWidth: 1,
    borderColor: Colors.primary,
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(12),
  },

  // Sections
  sectionHeading: {
    marginTop: vs(18),
    marginBottom: vs(8),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginBottom: vs(10),
  },

  // Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  chip: {
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    backgroundColor: Colors.white,
  },
  chipActive: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.primary,
  },

  // Insight card (blue, standalone)
  insightBlueCard: {
    backgroundColor: Colors.blueBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginBottom: vs(10),
  },

  // Notes
  textInput: {
    minHeight: vs(80),
    fontSize: ms(14),
    color: Colors.textPrimary,
    padding: 0,
  },

  // Body
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: s(13),
  },

  // Bottom bar
  bottomBar: {
    backgroundColor: Colors.white,
    paddingHorizontal: s(13),
    paddingTop: vs(8),
    paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10),
    borderTopWidth: 0.5,
    borderTopColor: '#d1d5db',
  },
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: vs(11),
    borderRadius: ms(12),
    alignItems: 'center',
  },
  secondaryButtonRow: {
    flexDirection: 'row',
    marginTop: vs(6),
    gap: s(8),
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(7),
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    backgroundColor: Colors.white,
  },
});

export default SymptomsLogScreen;
