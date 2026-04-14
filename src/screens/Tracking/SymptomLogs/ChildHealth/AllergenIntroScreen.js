import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../../constants/colors';
import AppText from '../../../../components/shared/AppText';
import Icon from '../../../../components/shared/Icons';

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const TABS = [
  {key: 'top8', label: 'Top 8 allergens'},
];

const SUMMARY_CELLS = [
  {
    value: '3',
    label: 'Introduced safely',
    bg: Colors.tealBg,
    border: Colors.paleGreen,
    color: Colors.tealText,
  },
  {
    value: '5',
    label: 'Pending introduction',
    bg: Colors.amberBg,
    border: '#FDDCB5',
    color: Colors.amberDark,
  },
  {
    value: '0',
    label: 'Reactions logged',
    bg: '#FEE2E2',
    border: '#FCA5A5',
    color: '#B91C1C',
  },
];

const ALLERGENS = [
  {
    key: 'peanut',
    name: 'Peanut',
    icon: 'nutrition-outline',
    status: 'Introduced \u00b7 Safe',
    sub: 'Oct 2024 \u00b7 3 exposures',
    state: 'safe',
  },
  {
    key: 'egg',
    name: 'Egg',
    icon: 'egg-outline',
    status: 'Introduced \u00b7 Safe',
    sub: 'Sep 2024 \u00b7 Well-cooked',
    state: 'safe',
  },
  {
    key: 'milk',
    name: 'Cow milk',
    icon: 'water-outline',
    status: 'Introduced \u00b7 Safe',
    sub: 'Oct 2024 \u00b7 Paneer form',
    state: 'safe',
  },
  {
    key: 'wheat',
    name: 'Wheat / gluten',
    icon: 'leaf-outline',
    status: 'Next to introduce',
    sub: 'Roti / chapati form',
    state: 'progress',
  },
  {
    key: 'fish',
    name: 'Fish',
    icon: 'fish-outline',
    status: 'Not yet introduced',
    sub: 'Pending',
    state: 'pending',
  },
  {
    key: 'treenuts',
    name: 'Tree nuts',
    icon: 'nutrition-outline',
    status: 'Not yet introduced',
    sub: 'Pending \u00b7 one at a time',
    state: 'pending',
  },
  {
    key: 'sesame',
    name: 'Sesame / til',
    icon: 'flower-outline',
    status: 'Not yet introduced',
    sub: 'High-risk Indian food',
    state: 'pending',
  },
  {
    key: 'soy',
    name: 'Soy',
    icon: 'leaf-outline',
    status: 'Not yet introduced',
    sub: 'Pending',
    state: 'pending',
  },
];

const ALLERGEN_CHIPS = [
  {id: 'wheat', label: 'Wheat'},
  {id: 'fish', label: 'Fish'},
  {id: 'treenuts', label: 'Tree nuts'},
  {id: 'sesame', label: 'Sesame'},
  {id: 'soy', label: 'Soy'},
];
const AMOUNT_CHIPS = [
  {id: 'tiny', label: 'Tiny taste'},
  {id: 'small', label: 'Small amount'},
  {id: 'moderate', label: 'Moderate'},
  {id: 'normal', label: 'Normal serving'},
];
const OBSERVATION_CHIPS = [
  {id: 'noreaction', label: 'No reaction', icon: 'checkmark'},
  {id: 'hives', label: 'Skin redness / hives'},
  {id: 'swelling', label: 'Facial swelling'},
  {id: 'vomiting', label: 'Vomiting'},
  {id: 'runnynose', label: 'Runny nose / sneezing'},
  {id: 'breathing', label: 'Difficulty breathing'},
  {id: 'crying', label: 'Crying / irritability'},
];

const LEAP_STEPS = [
  {
    n: 1,
    title: 'Confirm no eczema flare or illness today',
    body: 'Eczema flares increase intestinal permeability and sensitisation risk. Wait for clear skin. Do not introduce during fever or viral illness.',
  },
  {
    n: 2,
    title: 'Choose a morning introduction - never at bedtime',
    body: 'Morning allows 4+ hours of supervised observation during daytime. Reactions peak 15-120 minutes after exposure. You need to be awake and alert.',
  },
  {
    n: 3,
    title: 'Start with a tiny amount - tip of a teaspoon',
    body: 'First exposure: smallest possible quantity. For peanut: \u00bc teaspoon of smooth peanut butter or 1 crushed peanut. For egg: \u00bd teaspoon of well-cooked scrambled egg. Wait 15 minutes before any more.',
  },
  {
    n: 4,
    title: 'Observe for 2 hours \u00b7 do not leave the room',
    body: 'Watch: skin (flushing, hives), face (swelling, lip puffiness), breathing (wheeze, cough), gut (vomiting), behaviour (sudden crying, pale, floppy). Take photos of any skin changes.',
  },
  {
    n: 5,
    title: 'If no reaction: increase amount at next 3 exposures',
    body: 'Week 1: tiny taste \u2192 Week 2: 1 tsp \u2192 Week 3: 1 tbsp \u2192 Week 4: normal portion. Once safely introduced, continue regular weekly exposure to maintain tolerance. Stopping causes re-sensitisation.',
  },
  {
    n: 6,
    title: 'If mild reaction: stop, antihistamine, call doctor',
    body: 'Mild reaction (local hives only, no breathing/swelling): give cetirizine 5mg (age 6-11), observe for 2 hours, call Dr. Preethi Rao. Do not re-introduce without allergy specialist guidance. Do not administer steroid without advice.',
  },
];

const SEVERITY_ROWS = [
  {
    dot: '#16A34A',
    label: 'Mild',
    body: 'local hives/redness at contact site only \u00b7 no spread \u00b7 no systemic symptoms',
  },
  {
    dot: Colors.amberDark,
    label: 'Moderate',
    body: 'spreading hives \u00b7 vomiting \u00b7 runny nose \u00b7 mild swelling',
  },
  {
    dot: '#B91C1C',
    label: 'Severe (anaphylaxis)',
    body: 'throat swelling \u00b7 wheeze \u00b7 collapse \u00b7 call 108 immediately',
  },
];

const REACTION_LOGS = [
  {
    name: 'Peanut',
    exposures: '3 exposures',
    period: 'Oct 2024 - Mar 2025',
    body: 'Oct 14: \u00bc tsp peanut butter in dal - no reaction. Nov 3: 1 tsp peanut chutney - no reaction. Mar 18: Full serving groundnut chikki - no reaction. Tolerance established.',
  },
  {
    name: 'Egg',
    exposures: '2 exposures',
    period: 'Sep - Oct 2024',
    body: 'Sep 22: \u00bd tsp well-cooked scrambled egg - no reaction. Oct 5: Whole egg in upma - no reaction. Regular consumption established.',
  },
  {
    name: 'Cow milk',
    exposures: '1 exposure',
    period: 'Oct 2024',
    body: 'Oct 20: 1 tbsp paneer (cooked) - no reaction. Subsequent regular exposure (curd, milk in food) - tolerating well.',
  },
];

const AYU_ROWS = [
  {
    dot: Colors.amberDark,
    bold: 'Wheat next (this week). ',
    body: 'Aarav already eats wheat in other forms - roti chapati introduction is low risk. Introduce as small piece of plain chapati, not biscuit (added ingredients complicate reaction attribution). Observe 2 hours.',
  },
  {
    dot: Colors.amberDark,
    bold: 'Fish: introduce as rohu or katla ',
    body: '- mild white fish common in Telugu cuisine. Avoid shellfish (separate allergen) initially. Steam or boil for first introduction; avoid fried (harder to assess if reaction is to fish or to frying oil).',
  },
  {
    dot: Colors.amberDark,
    bold: 'Sesame is the highest-risk pending allergen ',
    body: "for this profile. Introduce deliberately as plain til paste (tahini-equivalent) in a controlled setting before regular sesame exposure via laddoos or chikki. Do not assume tolerance because it is a 'traditional Indian food.'",
  },
  {
    dot: '#16A34A',
    bold: '3 allergens introduced safely without reaction ',
    body: 'is excellent. The more allergens confirmed safe, the narrower any future avoidance needs to be. Continue with regular exposure to peanut, egg, and milk to maintain established tolerance.',
  },
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const Section = ({title}) => (
  <View style={st.sec}>
    <AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{title}</AppText>
    <View style={st.secLine} />
  </View>
);

const Chip = ({label, active, icon}) => (
  <View style={[st.chip, active && st.chipActive]}>
    {icon && active && (
      <Icon family="Ionicons" name={icon} size={ms(12)} color={Colors.white} style={{marginRight: s(4)}} />
    )}
    <AppText variant="subtext" color={active ? Colors.white : Colors.textPrimary} style={{fontWeight: active ? '700' : '500'}}>
      {label}
    </AppText>
  </View>
);

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const AllergenIntroScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('top8');
  const [selectedAllergen, setSelectedAllergen] = useState(null);
  const [selectedAmount, setSelectedAmount] = useState(null);
  const [selectedObservations, setSelectedObservations] = useState(['noreaction']);

  // Dynamic allergen states
  const [allergenStates, setAllergenStates] = useState(() => {
    const map = {};
    ALLERGENS.forEach(a => { map[a.key] = a.state; });
    return map;
  });

  const cycleAllergenState = (key) => {
    setAllergenStates(prev => {
      const current = prev[key];
      const next = current === 'pending' ? 'progress' : current === 'progress' ? 'safe' : 'pending';
      return {...prev, [key]: next};
    });
  };

  const STATE_LABELS = {
    safe: 'Introduced - Safe',
    progress: 'In progress',
    pending: 'Not yet introduced',
  };

  const toggleObservation = (id) => {
    setSelectedObservations((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id],
    );
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Fixed Header ── */}
      <View style={[st.header, {paddingTop: insets.top + vs(10)}]}>
        <View style={st.topRow}>
          <TouchableOpacity
            style={st.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={{color: Colors.white, fontSize: ms(18), fontWeight: '700'}}>Allergen introduction</AppText>
            <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', fontSize: ms(11)}}>Aarav - Top 8 allergens</AppText>
          </View>
        </View>
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'top8' && (
          <>
            {/* Allergen grid */}
            <View style={st.allergenGrid}>
              {ALLERGENS.map((a) => {
                const state = allergenStates[a.key] || 'pending';
                const borderColor =
                  state === 'safe' ? Colors.paleGreen :
                  state === 'progress' ? '#FDDCB5' :
                  '#E5DDD3';
                const iconColor =
                  state === 'safe' ? Colors.tealText :
                  state === 'progress' ? Colors.amberDark :
                  Colors.textSecondary;
                return (
                  <TouchableOpacity
                    key={a.key}
                    style={[st.allergenCard, {borderColor}]}
                    activeOpacity={0.7}
                    onPress={() => cycleAllergenState(a.key)}>
                    {state === 'safe' && (
                      <View style={[st.cornerBadge, {backgroundColor: Colors.tealBg}]}>
                        <Icon family="Ionicons" name="checkmark" size={ms(11)} color={Colors.tealText} />
                      </View>
                    )}
                    {state === 'progress' && (
                      <View style={[st.cornerBadge, {backgroundColor: Colors.amberBg}]}>
                        <Icon family="Ionicons" name="time-outline" size={ms(11)} color={Colors.amberDark} />
                      </View>
                    )}
                    <Icon family="Ionicons" name={a.icon} size={ms(22)} color={iconColor} />
                    <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginTop: vs(6)}}>
                      {a.name}
                    </AppText>
                    <AppText variant="subtext" color={iconColor} style={{marginTop: vs(2), fontWeight: '600'}}>
                      {STATE_LABELS[state]}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Section title="Log today's introduction" />
            <View style={st.card}>
              <AppText variant="subtext" color={Colors.textSecondary} style={st.subLabel}>
                Allergen being introduced today
              </AppText>
              <View style={st.chipRow}>
                {ALLERGEN_CHIPS.map((c) => {
                  const active = selectedAllergen === c.id;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      activeOpacity={0.7}
                      onPress={() =>
                        setSelectedAllergen(active ? null : c.id)
                      }
                      style={[st.chip, active && st.chipActive]}>
                      <AppText
                        variant="subtext"
                        color={active ? Colors.white : Colors.textPrimary}
                        style={{fontWeight: active ? '700' : '500'}}>
                        {c.label}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <AppText variant="subtext" color={Colors.textSecondary} style={[st.subLabel, {marginTop: vs(12)}]}>
                Amount given
              </AppText>
              <View style={st.chipRow}>
                {AMOUNT_CHIPS.map((c) => {
                  const active = selectedAmount === c.id;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      activeOpacity={0.7}
                      onPress={() =>
                        setSelectedAmount(active ? null : c.id)
                      }
                      style={[st.chip, active && st.chipActive]}>
                      <AppText
                        variant="subtext"
                        color={active ? Colors.white : Colors.textPrimary}
                        style={{fontWeight: active ? '700' : '500'}}>
                        {c.label}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <AppText variant="subtext" color={Colors.textSecondary} style={[st.subLabel, {marginTop: vs(12)}]}>
                Observation period \u00b7 2 hours after
              </AppText>
              <View style={st.chipRow}>
                {OBSERVATION_CHIPS.map((c) => {
                  const active = selectedObservations.includes(c.id);
                  return (
                    <TouchableOpacity
                      key={c.id}
                      activeOpacity={0.7}
                      onPress={() => toggleObservation(c.id)}
                      style={[st.chip, active && st.chipActive]}>
                      {c.icon && active && (
                        <Icon
                          family="Ionicons"
                          name={c.icon}
                          size={ms(12)}
                          color={Colors.white}
                          style={{marginRight: s(4)}}
                        />
                      )}
                      <AppText
                        variant="subtext"
                        color={active ? Colors.white : Colors.textPrimary}
                        style={{fontWeight: active ? '700' : '500'}}>
                        {c.label}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>

          </>
        )}

        {false && (
          <>
            {/* Blue insight */}
            <View style={[st.insight, {backgroundColor: '#DBEAFE', borderColor: '#BFDBFE'}]}>
              <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={'#1D4ED8'} />
              <AppText variant="caption" color={'#1E3A8A'} style={{flex: 1, lineHeight: ms(17)}}>
                <AppText style={{fontWeight: '700'}}>LEAP (Learning Early About Peanut Allergy) protocol. </AppText>
                The LEAP trial showed that early peanut introduction (before 12 months) reduces peanut allergy by 81% in high-risk infants. The same principle now applies to all top-8 allergens. Even at age 9, structured introduction remains the safest approach.
              </AppText>
            </View>

            <Section title="Standard introduction protocol \u00b7 any allergen" />
            {LEAP_STEPS.map((step) => (
              <View key={step.n} style={st.stepCard}>
                <View style={st.stepNumCircle}>
                  <AppText variant="bodyBold" color={Colors.tealText} style={{fontWeight: '800'}}>
                    {step.n}
                  </AppText>
                </View>
                <View style={{flex: 1}}>
                  <AppText variant="bodyBold" color={Colors.textPrimary}>
                    {step.title}
                  </AppText>
                  <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(3), lineHeight: ms(15)}}>
                    {step.body}
                  </AppText>
                </View>
              </View>
            ))}

            <Section title="Indian-specific high-risk allergens" />
            <View style={[st.insight, {backgroundColor: Colors.amberBg, borderColor: '#FDDCB5'}]}>
              <Icon family="Ionicons" name="alert-circle-outline" size={ms(16)} color={Colors.amberDark} />
              <AppText variant="caption" color={Colors.amberDark} style={{flex: 1, lineHeight: ms(17)}}>
                <AppText style={{fontWeight: '700'}}>Sesame / til is a high-risk food in Indian diets </AppText>
                - present in laddoos, chikki, til rice, and cooking oils. India has one of the highest sesame allergy rates in Asia. Introduce deliberately before regular exposure begins (around weaning or school canteen age). Shellfish (jhinga, crab) are also common in South Indian coastal cuisine - introduce separately with 3-day gaps.
              </AppText>
            </View>
          </>
        )}

        {false && (
          <>
            <View style={[st.insight, {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen}]}>
              <Icon family="Ionicons" name="checkmark-circle-outline" size={ms(16)} color={Colors.tealText} />
              <AppText variant="caption" color={Colors.tealText} style={{flex: 1, lineHeight: ms(17), fontWeight: '600'}}>
                No adverse reactions recorded. 3 allergens introduced safely across 6 total exposures.
              </AppText>
            </View>

            <Section title="Reaction severity scale" />
            <View style={st.card}>
              {SEVERITY_ROWS.map((r, i) => (
                <View
                  key={i}
                  style={[st.sevRow, i === SEVERITY_ROWS.length - 1 && {borderBottomWidth: 0}]}>
                  <View style={[st.sevDot, {backgroundColor: r.dot}]} />
                  <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(17)}}>
                    <AppText style={{fontWeight: '700'}}>{r.label}: </AppText>
                    {r.body}
                  </AppText>
                </View>
              ))}
            </View>

            <Section title="Previous exposure log \u00b7 all allergens" />
            {REACTION_LOGS.map((log, i) => (
              <View key={i} style={st.card}>
                <View style={st.logHeader}>
                  <View style={{flex: 1}}>
                    <AppText variant="bodyBold" color={Colors.textPrimary}>
                      {log.name} \u00b7 {log.exposures}
                    </AppText>
                    <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(1)}}>
                      {log.period}
                    </AppText>
                  </View>
                  <View style={st.safeBadge}>
                    <AppText variant="subtext" color={Colors.tealText} style={{fontWeight: '700'}}>
                      Safe
                    </AppText>
                  </View>
                </View>
                <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(6), lineHeight: ms(15)}}>
                  {log.body}
                </AppText>
              </View>
            ))}
          </>
        )}

        {false && (
          <>
            <View style={st.ayuHeader}>
              <AppText variant="subtext" color="rgba(255,255,255,0.6)" style={{textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '700'}}>
                Ayu Intel \u00b7 Allergen
              </AppText>
              <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(2)}}>
                Allergen intelligence
              </AppText>
            </View>

            <View style={st.card}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>
                Introduction priority order
              </AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(2), marginBottom: vs(10)}}>
                Evidence-based sequencing for Aarav's profile
              </AppText>
              {AYU_ROWS.map((row, i) => (
                <View
                  key={i}
                  style={[st.ayuRow, i === AYU_ROWS.length - 1 && {borderBottomWidth: 0}]}>
                  <View style={[st.ayuDot, {backgroundColor: row.dot}]} />
                  <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(17)}}>
                    <AppText style={{fontWeight: '700'}}>{row.bold}</AppText>
                    {row.body}
                  </AppText>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{height: vs(20)}} />
      </ScrollView>

      {/* ── Sticky bottom save bar ── */}
      <View style={[st.bottomBar, {paddingBottom: insets.bottom > 0 ? insets.bottom : vs(12)}]}>
        <TouchableOpacity style={st.saveBtn} activeOpacity={0.85}>
          <Icon family="Ionicons" name="save-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(8)}}>
            Save allergen log
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  // Header
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(16),
    paddingBottom: vs(12),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(8),
  },
  backBtn: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(15),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  savePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(14),
  },
  headerEyebrow: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '700',
    marginTop: vs(6),
    marginBottom: vs(4),
  },

  // Tab pills
  tabPill: {
    paddingHorizontal: s(12),
    paddingVertical: vs(7),
    borderRadius: ms(14),
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tabPillActive: {
    backgroundColor: Colors.white,
    borderColor: Colors.white,
  },

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(12)},

  // Section
  sec: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(14),
    marginBottom: vs(8),
  },
  secTxt: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: s(7),
  },
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Summary row
  summaryRow: {flexDirection: 'row', gap: s(8), marginBottom: vs(12)},
  sumCell: {
    flex: 1,
    borderWidth: 1,
    borderRadius: ms(14),
    paddingVertical: vs(12),
    paddingHorizontal: s(8),
    alignItems: 'center',
  },

  // Allergen grid
  allergenGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(9)},
  allergenCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 1,
    padding: ms(12),
  },
  cornerBadge: {
    position: 'absolute',
    top: s(8),
    right: s(8),
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Card
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    padding: ms(12),
    marginBottom: vs(8),
  },
  subLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontWeight: '700',
    marginBottom: vs(7),
  },

  // Chips
  chipRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6)},
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: ms(12),
    backgroundColor: '#F5F0FF',
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // Insight
  insight: {
    borderRadius: ms(11),
    borderWidth: 1,
    padding: ms(10),
    marginBottom: vs(8),
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
  },

  // LEAP steps
  stepCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    padding: ms(12),
    marginBottom: vs(8),
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(10),
  },
  stepNumCircle: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(14),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Severity rows
  sevRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(8),
    gap: s(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F5F0FF',
  },
  sevDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    marginTop: vs(4),
  },

  // Reaction log header
  logHeader: {flexDirection: 'row', alignItems: 'center'},
  safeBadge: {
    backgroundColor: Colors.tealBg,
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
  },

  // Ayu header
  ayuHeader: {
    backgroundColor: Colors.primary,
    marginHorizontal: s(-13),
    paddingHorizontal: s(16),
    paddingTop: vs(14),
    paddingBottom: vs(14),
    marginBottom: vs(10),
  },
  ayuRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(8),
    gap: s(10),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#F5F0FF',
  },
  ayuDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    marginTop: vs(5),
  },

  // Bottom bar
  bottomBar: {
    backgroundColor: Colors.white,
    paddingHorizontal: s(16),
    paddingTop: vs(10),
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: '#E5DDD3',
  },
  saveBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: vs(13),
    borderRadius: ms(14),
  },
});

export default AllergenIntroScreen;
