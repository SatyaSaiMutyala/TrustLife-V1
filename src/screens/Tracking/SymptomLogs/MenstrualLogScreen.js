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

const CYCLE_STATUS_CHIPS = [
  {id: 'menstruation', label: 'Menstruation'},
  {id: 'follicular', label: 'Follicular'},
  {id: 'ovulation', label: 'Ovulation'},
  {id: 'luteal', label: 'Luteal'},
];

const FLOW_CHIPS = [
  {id: 'none', label: 'None'},
  {id: 'spotting', label: 'Spotting'},
  {id: 'light', label: 'Light'},
  {id: 'medium', label: 'Medium'},
  {id: 'heavy', label: 'Heavy'},
];

const SYMPTOM_TAGS = [
  'Cramps', 'Bloating', 'Breast tenderness', 'Headache',
  'Mood changes', 'Fatigue', 'Acne', 'Back pain',
  'Nausea', 'Food cravings', 'None',
];

const MOOD_CHIPS = [
  {id: 'great', label: 'Great'},
  {id: 'good', label: 'Good'},
  {id: 'okay', label: 'Okay'},
  {id: 'low', label: 'Low'},
  {id: 'anxious', label: 'Anxious'},
  {id: 'irritable', label: 'Irritable'},
];

const PAIN_LEVELS = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const INTIMATE_CHIPS = [
  {id: 'none', label: 'None'},
  {id: 'protected', label: 'Protected'},
  {id: 'unprotected', label: 'Unprotected'},
];

const MEDICATION_TAGS = [
  'Paracetamol taken',
  'Ibuprofen taken',
  'Iron supplement',
  'None',
];

const CYCLE_HISTORY = [
  {start: '10 Mar 2026', length: '28 days', flow: 'Medium', notes: 'Mild cramps day 1-2', highlight: true},
  {start: '10 Feb 2026', length: '27 days', flow: 'Medium', notes: 'Normal cycle'},
  {start: '14 Jan 2026', length: '29 days', flow: 'Heavy', notes: 'Headache, fatigue'},
  {start: '16 Dec 2025', length: '28 days', flow: 'Light', notes: 'No symptoms'},
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const Chip = ({label, isActive, onPress, activeStyle}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[
      styles.chip,
      isActive && (activeStyle || styles.chipActive),
    ]}>
    <AppText
      variant="small"
      color={isActive ? (activeStyle ? Colors.tealText : Colors.primary) : Colors.textSecondary}
      style={{fontWeight: isActive ? '700' : '500'}}>
      {label}
    </AppText>
  </TouchableOpacity>
);

const Tag = ({label, isActive, onPress, isGreen}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[
      styles.chip,
      isActive && !isGreen && styles.chipActive,
      isActive && isGreen && styles.chipActiveGreen,
    ]}>
    <AppText
      variant="small"
      color={isActive ? (isGreen ? Colors.tealText : Colors.primary) : Colors.textSecondary}
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
          name="information-circle"
          size={ms(20)}
          color={Colors.purpleText}
        />
        <AppText
          variant="bodyBold"
          color={Colors.purpleText}
          style={{marginLeft: s(8)}}>
          Cycle Day 14 {'\u00b7'} Ovulation phase
        </AppText>
      </View>
      <View style={styles.zoneBadge}>
        <AppText variant="small" color={Colors.purpleText} style={{fontWeight: '700'}}>
          Day 14
        </AppText>
      </View>
    </View>
    <AppText
      variant="caption"
      color={Colors.purpleText}
      style={{marginTop: vs(6), lineHeight: ms(17)}}>
      Last period: 10 Mar {'\u00b7'} Cycle length: 28 days {'\u00b7'} Next period expected: 7 Apr
    </AppText>
  </View>
);

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const MenstrualLogScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [activeStatus, setActiveStatus] = useState('ovulation');
  const [activeFlow, setActiveFlow] = useState('none');
  const [selectedSymptoms, setSelectedSymptoms] = useState(['None']);
  const [activeMood, setActiveMood] = useState('good');
  const [activePain, setActivePain] = useState(0);
  const [activeIntimate, setActiveIntimate] = useState(null);
  const [selectedMeds, setSelectedMeds] = useState([]);
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
          Menstrual cycle
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
            Tuesday, 24 Mar 2026
          </AppText>
          <ZoneBanner />
        </View>

        {/* ── 1. Cycle Status ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>CYCLE STATUS</AppText>
        <View style={styles.card}>
          <View style={styles.chipRow}>
            {CYCLE_STATUS_CHIPS.map(chip => (
              <Chip
                key={chip.id}
                label={chip.label}
                isActive={activeStatus === chip.id}
                onPress={() => setActiveStatus(chip.id)}
              />
            ))}
          </View>
        </View>

        {/* ── 2. Flow ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>FLOW</AppText>
        <View style={styles.card}>
          <View style={styles.chipRow}>
            {FLOW_CHIPS.map(chip => (
              <Chip
                key={chip.id}
                label={chip.label}
                isActive={activeFlow === chip.id}
                onPress={() => setActiveFlow(chip.id)}
              />
            ))}
          </View>
        </View>

        {/* ── 3. Symptoms ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>SYMPTOMS</AppText>
        <View style={styles.card}>
          <View style={styles.chipRow}>
            {SYMPTOM_TAGS.map(tag => {
              const isNone = tag === 'None';
              const isActive = selectedSymptoms.includes(tag);
              return (
                <Tag
                  key={tag}
                  label={tag}
                  isActive={isActive}
                  isGreen={isNone && isActive}
                  onPress={() => toggleTag(tag, selectedSymptoms, setSelectedSymptoms)}
                />
              );
            })}
          </View>
        </View>

        {/* ── 4. Mood ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>MOOD</AppText>
        <View style={styles.card}>
          <View style={styles.chipRow}>
            {MOOD_CHIPS.map(chip => (
              <Chip
                key={chip.id}
                label={chip.label}
                isActive={activeMood === chip.id}
                onPress={() => setActiveMood(chip.id)}
              />
            ))}
          </View>
        </View>

        {/* ── 5. Pain Level ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>PAIN LEVEL</AppText>
        <View style={styles.card}>
          <View style={styles.chipRow}>
            {PAIN_LEVELS.map(level => (
              <TouchableOpacity
                key={level}
                activeOpacity={0.7}
                onPress={() => setActivePain(level)}
                style={[
                  styles.painChip,
                  activePain === level && styles.chipActive,
                ]}>
                <AppText
                  variant="small"
                  color={activePain === level ? Colors.primary : Colors.textSecondary}
                  style={{fontWeight: activePain === level ? '700' : '500'}}>
                  {level}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* ── 6. Intimate Activity ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>INTIMATE ACTIVITY</AppText>
        <View style={styles.card}>
          <View style={styles.chipRow}>
            {INTIMATE_CHIPS.map(chip => (
              <Chip
                key={chip.id}
                label={chip.label}
                isActive={activeIntimate === chip.id}
                onPress={() => setActiveIntimate(chip.id)}
              />
            ))}
          </View>
        </View>

        {/* ── 7. Medication ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>MEDICATION</AppText>
        <View style={styles.card}>
          <View style={styles.chipRow}>
            {MEDICATION_TAGS.map(tag => (
              <Tag
                key={tag}
                label={tag}
                isActive={selectedMeds.includes(tag)}
                onPress={() => toggleTag(tag, selectedMeds, setSelectedMeds)}
              />
            ))}
          </View>
          <View style={styles.insightAmber}>
            <Icon family="Ionicons" name="information-circle-outline" size={ms(14)} color={Colors.amberText} />
            <AppText variant="small" color={Colors.amberText} style={{marginLeft: s(6), flex: 1, lineHeight: ms(16)}}>
              Ibuprofen: note possible BP interaction. Check with your doctor if taking regularly.
            </AppText>
          </View>
        </View>

        {/* ── 8. Amber Insight ── */}
        <View style={styles.insightCard}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Icon family="Ionicons" name="alert-circle-outline" size={ms(16)} color={Colors.amberText} />
            <AppText variant="bodyBold" color={Colors.amberText} style={{marginLeft: s(6)}}>
              Cycle tracking and T2DM
            </AppText>
          </View>
          <AppText variant="caption" color={Colors.amberText} style={{marginTop: vs(4), lineHeight: ms(17)}}>
            Hormonal fluctuations during the menstrual cycle can affect blood glucose by 1{'\u2013'}2 mmol/L. Many women report higher readings in the luteal phase (days 15{'\u2013'}28).
          </AppText>
        </View>

        {/* ── 9. Cycle History ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>CYCLE HISTORY</AppText>
        <View style={styles.card}>
          <View style={styles.tableHeaderRow}>
            <AppText variant="small" color={Colors.textTertiary} style={{flex: 1.5}}>Start date</AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{flex: 1, textAlign: 'center'}}>Length</AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{flex: 0.8, textAlign: 'center'}}>Flow</AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{flex: 1.5, textAlign: 'right'}}>Notes</AppText>
          </View>
          {CYCLE_HISTORY.map((row, i) => (
            <View
              key={i}
              style={[
                styles.tableRow,
                row.highlight && styles.tableRowHighlight,
                i < CYCLE_HISTORY.length - 1 && styles.tableRowBorder,
              ]}>
              <AppText variant="small" color={row.highlight ? Colors.primary : Colors.textPrimary} style={{flex: 1.5, fontWeight: row.highlight ? '700' : '400'}}>{row.start}</AppText>
              <AppText variant="small" color={Colors.textPrimary} style={{flex: 1, textAlign: 'center', fontWeight: '600'}}>{row.length}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{flex: 0.8, textAlign: 'center'}}>{row.flow}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{flex: 1.5, textAlign: 'right'}}>{row.notes}</AppText>
            </View>
          ))}
        </View>

        {/* ── 10. Note ── */}
        <AppText variant="sectionTitle" style={styles.sectionHeading}>NOTE</AppText>
        <View style={styles.card}>
          <TextInput
            style={styles.textInput}
            placeholder="Add notes about this cycle day..."
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
            Save {'\u00b7'} Day 14 {'\u00b7'} Ovulation {'\u00b7'} No symptoms
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
              Share
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

  // Zone banner (purple)
  zoneBanner: {
    backgroundColor: Colors.purpleBg,
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
    backgroundColor: Colors.purpleBg,
    borderWidth: 1,
    borderColor: Colors.purpleText,
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
  chipActiveGreen: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.tealText,
  },
  painChip: {
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    backgroundColor: Colors.white,
    minWidth: ms(36),
    alignItems: 'center',
  },

  // Insight inline (amber, inside card)
  insightAmber: {
    flexDirection: 'row',
    backgroundColor: Colors.amberBg,
    borderRadius: ms(10),
    padding: ms(10),
    marginTop: vs(12),
    alignItems: 'flex-start',
  },

  // Insight card (amber, standalone)
  insightCard: {
    backgroundColor: Colors.amberBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginBottom: vs(10),
  },

  // History table
  tableHeaderRow: {
    flexDirection: 'row',
    paddingBottom: vs(6),
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  tableRowHighlight: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(8),
    marginHorizontal: s(-6),
    paddingHorizontal: s(6),
  },
  tableRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
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

export default MenstrualLogScreen;
