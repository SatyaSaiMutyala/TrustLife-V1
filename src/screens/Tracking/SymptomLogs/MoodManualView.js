import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

// ─── Constants & Data ───────────────────────────────────────────────────

const MOOD_OPTIONS = [
  {icon: 'sad-outline', label: 'Very distressed', size: ms(26)},
  {icon: 'sad-outline', label: 'Low / depressed', size: ms(22)},
  {icon: 'alert-circle-outline', label: 'Anxious / worried', size: ms(24)},
  {icon: 'help-circle-outline', label: 'Neutral / okay', size: ms(24)},
  {icon: 'happy-outline', label: 'Good / content', size: ms(24)},
  {icon: 'happy-outline', label: 'Happy / positive', size: ms(26)},
  {icon: 'star-outline', label: 'Excellent / thriving', size: ms(24)},
];

const MOOD_BAR_COLORS = ['#e8657a', '#e8657a', '#d4a03a', Colors.purpleText, '#3dae6e', '#3dae6e', '#1e7a44'];

const EMOTION_TAGS = [
  'Frustrated', 'Sad', 'Overwhelmed', 'Irritable', 'Fearful', 'Hopeless',
  'Fatigued', 'Racing thoughts', 'Tense/tight', 'Calm', 'Content',
  'Grateful', 'Motivated', 'Joyful', 'Disconnected', 'Numb/flat',
];

const MOOD_AFFECT_TAGS = [
  'Work pressure', 'Home/family', 'Health worry', 'Financial stress',
  'Medication side effect', 'Poor sleep', 'Blood sugar off', 'No exercise',
  'Worry about Aarav', 'Upcoming tests', 'Relationship tension',
  'Doctor appointment', 'No particular reason', 'Something good happened',
];

const PHQ2_QUESTIONS = [
  'Little interest or pleasure in doing things?',
  'Feeling down, depressed, or hopeless?',
];

const GAD2_QUESTIONS = [
  'Feeling nervous, anxious, or on edge?',
  'Not being able to stop or control worrying?',
];

const DISTRESS_QUESTIONS = [
  'Feeling overwhelmed by demands of living with diabetes?',
  'Feeling diabetes is taking too much energy?',
  'Worried about whether doing enough to manage diabetes?',
];

const SCREEN_OPTIONS = [
  {score: 0, label: 'Not at all'},
  {score: 1, label: 'Several days'},
  {score: 2, label: 'More than half'},
  {score: 3, label: 'Nearly every day'},
];

const DISTRESS_OPTIONS = [1, 2, 3, 4, 5];

const PHYSICAL_TAGS = [
  'Headache', 'Muscle tension', 'Tight chest', 'Racing heart',
  'Shallow breathing', 'Stomach upset', 'Difficulty sleeping',
  'Appetite change', 'Sweating/flushing', 'Restlessness', 'No physical symptoms',
];

const SLEEP_QUALITY = ['Excellent', 'Good', 'Fair (5-6h)', 'Poor', 'Terrible'];
const SLEEP_TAGS = [
  'Woke multiple times', 'Difficulty falling asleep', 'Nightmares',
  'Night sweats', 'Woke feeling tired',
];

const COMPARISON_ROWS = [
  {label: 'Yesterday morning', prev: 'Neutral', curr: 'Same', deltaColor: Colors.textSecondary},
  {label: '7-day mood avg', prev: '3.2/6', curr: '3/6', deltaColor: Colors.textSecondary},
  {label: 'Stress this week vs last', prev: '6.2 avg', curr: '5 today', delta: '\u2193', deltaColor: Colors.tealText},
  {label: 'Last distress flag', prev: 'Aug 4, 2025', curr: '7 months ago', deltaColor: Colors.textSecondary},
];

const GRATITUDE_CHIPS = [
  'Morning walk', 'Quiet chai', 'Took meds', 'Family time', 'Slept better', 'Glucose better',
];

const COPING_TAGS = [
  'Walk/exercise', 'Deep breathing', 'Music', 'Talked to someone',
  'Phone-free time', 'Tea/calm break', 'Bath/self-care', 'Reading',
  'Prayer/spirituality', 'Rest/nap', 'Journaling', 'Nothing yet',
];

// ─── Helpers ────────────────────────────────────────────────────────────

const SliderBar = ({colors, value, max}) => {
  const segWidth = 100 / colors.length;
  const fillPercent = (value / max) * 100;
  return (
    <View style={styles.sliderBarOuter}>
      {colors.map((c, i) => {
        const segStart = i * segWidth;
        const segEnd = segStart + segWidth;
        const filled = fillPercent >= segEnd ? 1 : fillPercent > segStart ? (fillPercent - segStart) / segWidth : 0;
        return (
          <View
            key={i}
            style={{
              flex: 1,
              height: ms(6),
              backgroundColor: '#e5e7eb',
              borderTopLeftRadius: i === 0 ? ms(3) : 0,
              borderBottomLeftRadius: i === 0 ? ms(3) : 0,
              borderTopRightRadius: i === colors.length - 1 ? ms(3) : 0,
              borderBottomRightRadius: i === colors.length - 1 ? ms(3) : 0,
              overflow: 'hidden',
            }}>
            <View style={{width: `${filled * 100}%`, height: '100%', backgroundColor: c}} />
          </View>
        );
      })}
    </View>
  );
};

// ─── Component ──────────────────────────────────────────────────────────

const MoodManualView = () => {
  const [activeMood, setActiveMood] = useState(3);
  const [stress, setStress] = useState(5);
  const [energy, setEnergy] = useState(5);
  const [anxiety, setAnxiety] = useState(4);
  const [selectedEmotions, setSelectedEmotions] = useState(['Frustrated']);
  const [selectedAffects, setSelectedAffects] = useState(['Work pressure']);
  const [phq2, setPhq2] = useState([0, 0]);
  const [gad2, setGad2] = useState([0, 0]);
  const [distress, setDistress] = useState([1, 1, 1]);
  const [selectedPhysical, setSelectedPhysical] = useState(['No physical symptoms']);
  const [sleepQuality, setSleepQuality] = useState('Fair (5-6h)');
  const [selectedSleepTags, setSelectedSleepTags] = useState(['Night sweats']);
  const [gratitudeText, setGratitudeText] = useState('');
  const [selectedGratitude, setSelectedGratitude] = useState([]);
  const [journalText, setJournalText] = useState('');
  const [selectedCoping, setSelectedCoping] = useState([]);

  const toggleTag = (tag, list, setter) => {
    setter(list.includes(tag) ? list.filter(t => t !== tag) : [...list, tag]);
  };

  const phq2Score = phq2[0] + phq2[1];
  const gad2Score = gad2[0] + gad2[1];
  const distressScore = (distress.reduce((a, b) => a + b, 0) / distress.length).toFixed(1);

  const getScoreStatus = (score, max) => {
    if (score <= max * 0.25) return {label: 'Minimal', color: Colors.tealText, bg: Colors.tealBg};
    if (score <= max * 0.5) return {label: 'Mild', color: Colors.amberText, bg: Colors.amberBg};
    if (score <= max * 0.75) return {label: 'Moderate', color: Colors.amberText, bg: Colors.amberBg};
    return {label: 'Severe', color: Colors.redText, bg: Colors.redBg};
  };

  const getDistressStatus = (score) => {
    if (score < 2) return {label: 'Minimal distress', color: Colors.tealText, bg: Colors.tealBg};
    if (score < 3) return {label: 'Mild distress', color: Colors.amberText, bg: Colors.amberBg};
    return {label: 'Significant distress', color: Colors.redText, bg: Colors.redBg};
  };

  return (
    <View style={{paddingVertical: vs(6)}}>

      {/* ── 1. Mood Selector ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>HOW ARE YOU FEELING RIGHT NOW?</AppText>
      <View style={styles.card}>
        <AppText variant="body" color={Colors.textSecondary} style={{marginBottom: vs(10)}}>
          Tap the face that matches your mood
        </AppText>
        <View style={styles.moodRow}>
          {MOOD_OPTIONS.map((m, i) => {
            const isActive = activeMood === i;
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.moodItem,
                  isActive && {backgroundColor: Colors.purpleBg, borderColor: Colors.purpleText, borderWidth: 1.5},
                ]}
                activeOpacity={0.6}
                onPress={() => setActiveMood(i)}>
                <Icon family="Ionicons" name={m.icon} size={m.size} color={isActive ? Colors.purpleText : Colors.textSecondary} />
                <AppText variant="small" color={isActive ? Colors.purpleText : Colors.textSecondary} style={{textAlign: 'center', marginTop: vs(2)}}>
                  {m.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Mood scale bar */}
        <View style={styles.moodBarRow}>
          {MOOD_BAR_COLORS.map((c, i) => (
            <View
              key={i}
              style={[
                styles.moodBarSeg,
                {backgroundColor: c},
                i === 0 && {borderTopLeftRadius: ms(4), borderBottomLeftRadius: ms(4)},
                i === 6 && {borderTopRightRadius: ms(4), borderBottomRightRadius: ms(4)},
                i === activeMood && {borderWidth: 2, borderColor: Colors.black},
              ]}
            />
          ))}
        </View>
        <View style={styles.moodBarLabels}>
          <AppText variant="small" color={Colors.textSecondary}>Distressed</AppText>
          <AppText variant="small" color={Colors.textSecondary}>Neutral</AppText>
          <AppText variant="small" color={Colors.textSecondary}>Thriving</AppText>
        </View>
      </View>

      {/* ── 2. Stress + Energy + Anxiety Sliders ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>STRESS LEVEL & ENERGY</AppText>
      <View style={styles.card}>
        {/* Stress */}
        <View style={styles.sliderSection}>
          <View style={styles.sliderHeader}>
            <Icon family="Ionicons" name="alert-circle-outline" size={ms(18)} color={Colors.amberText} />
            <AppText variant="bodyBold" style={{marginLeft: s(6)}}>Stress</AppText>
            <View style={[styles.sliderBadge, {backgroundColor: Colors.amberBg}]}>
              <AppText variant="small" color={Colors.amberText}>{stress}/10</AppText>
            </View>
          </View>
          <SliderBar colors={['#10b981','#10b981','#10b981','#f59e0b','#f59e0b','#f59e0b','#ef4444','#ef4444','#ef4444','#ef4444']} value={stress} max={10} />
          <View style={styles.sliderLabels}>
            <AppText variant="small" color={Colors.textTertiary}>None</AppText>
            <AppText variant="small" color={Colors.textTertiary}>Mild</AppText>
            <AppText variant="small" color={Colors.textTertiary}>5</AppText>
            <AppText variant="small" color={Colors.textTertiary}>High</AppText>
            <AppText variant="small" color={Colors.textTertiary}>Extreme</AppText>
          </View>
        </View>

        {/* Energy */}
        <View style={[styles.sliderSection, {marginTop: vs(14)}]}>
          <View style={styles.sliderHeader}>
            <Icon family="Ionicons" name="flash-outline" size={ms(18)} color={Colors.purpleText} />
            <AppText variant="bodyBold" style={{marginLeft: s(6)}}>Energy</AppText>
            <View style={[styles.sliderBadge, {backgroundColor: Colors.purpleBg}]}>
              <AppText variant="small" color={Colors.purpleText}>{energy}/10</AppText>
            </View>
          </View>
          <SliderBar colors={['#ef4444','#ef4444','#ef4444','#f59e0b','#f59e0b','#f59e0b','#10b981','#10b981','#10b981','#10b981']} value={energy} max={10} />
          <View style={styles.sliderLabels}>
            <AppText variant="small" color={Colors.textTertiary}>Exhausted</AppText>
            <AppText variant="small" color={Colors.textTertiary}>3</AppText>
            <AppText variant="small" color={Colors.textTertiary}>5</AppText>
            <AppText variant="small" color={Colors.textTertiary}>7</AppText>
            <AppText variant="small" color={Colors.textTertiary}>Full energy</AppText>
          </View>
        </View>

        {/* Anxiety */}
        <View style={[styles.sliderSection, {marginTop: vs(14)}]}>
          <View style={styles.sliderHeader}>
            <Icon family="Ionicons" name="warning-outline" size={ms(18)} color={Colors.amberText} />
            <AppText variant="bodyBold" style={{marginLeft: s(6)}}>Anxiety</AppText>
            <View style={[styles.sliderBadge, {backgroundColor: Colors.amberBg}]}>
              <AppText variant="small" color={Colors.amberText}>{anxiety}/10</AppText>
            </View>
          </View>
          <SliderBar colors={['#10b981','#10b981','#10b981','#f59e0b','#f59e0b','#f59e0b','#ef4444','#ef4444','#ef4444','#ef4444']} value={anxiety} max={10} />
          <View style={styles.sliderLabels}>
            <AppText variant="small" color={Colors.textTertiary}>Calm</AppText>
            <AppText variant="small" color={Colors.textTertiary}>3</AppText>
            <AppText variant="small" color={Colors.textTertiary}>5</AppText>
            <AppText variant="small" color={Colors.textTertiary}>7</AppText>
            <AppText variant="small" color={Colors.textTertiary}>Severe</AppText>
          </View>
        </View>
      </View>

      {/* ── 3. Emotion Tags ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>EMOTIONS PRESENT</AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(6)}}>Select all that apply</AppText>
      <View style={styles.tagWrap}>
        {EMOTION_TAGS.map(tag => {
          const active = selectedEmotions.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, active && styles.tagActive]}
              activeOpacity={0.6}
              onPress={() => toggleTag(tag, selectedEmotions, setSelectedEmotions)}>
              <AppText variant="small" color={active ? Colors.purpleText : Colors.textSecondary}>{tag}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── 4. What's Affecting Mood ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>WHAT'S AFFECTING YOUR MOOD?</AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(6)}}>Context</AppText>
      <View style={styles.tagWrap}>
        {MOOD_AFFECT_TAGS.map(tag => {
          const active = selectedAffects.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, active && styles.tagActive]}
              activeOpacity={0.6}
              onPress={() => toggleTag(tag, selectedAffects, setSelectedAffects)}>
              <AppText variant="small" color={active ? Colors.purpleText : Colors.textSecondary}>{tag}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── 5. PHQ-2 Depression Screen ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>DEPRESSION QUICK SCREEN</AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(6)}}>PHQ-2 {'\u00B7'} Over the past 2 weeks</AppText>
      <View style={styles.card}>
        <View style={[styles.screenHeader, {backgroundColor: Colors.amberBg}]}>
          <AppText variant="small" color={Colors.amberText}>
            Last PHQ-9 was 8 (mild-moderate, Aug 2025)
          </AppText>
        </View>
        {PHQ2_QUESTIONS.map((q, qi) => (
          <View key={qi} style={styles.screenQuestion}>
            <AppText variant="body" style={{marginBottom: vs(6)}}>{q}</AppText>
            <View style={styles.screenOptionsRow}>
              {SCREEN_OPTIONS.map(opt => {
                const active = phq2[qi] === opt.score;
                return (
                  <TouchableOpacity
                    key={opt.score}
                    style={[styles.screenOption, active && styles.screenOptionActive]}
                    activeOpacity={0.6}
                    onPress={() => {
                      const next = [...phq2];
                      next[qi] = opt.score;
                      setPhq2(next);
                    }}>
                    <AppText variant="small" color={active ? Colors.purpleText : Colors.textSecondary} style={{fontWeight: active ? '700' : '400'}}>
                      {opt.score}
                    </AppText>
                    <AppText variant="small" color={active ? Colors.purpleText : Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(1)}}>
                      {opt.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
        <View style={styles.screenFooter}>
          <AppText variant="bodyBold">PHQ-2 score: <AppText variant="bodyBold" color={Colors.tealText}>{phq2Score}</AppText></AppText>
          <View style={[styles.statusBadge, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="small" color={Colors.tealText}>Minimal</AppText>
          </View>
        </View>
      </View>

      {/* ── 6. GAD-2 Anxiety Screen ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>ANXIETY QUICK SCREEN</AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(6)}}>GAD-2 {'\u00B7'} Over the past 2 weeks</AppText>
      <View style={styles.card}>
        <View style={[styles.screenHeader, {backgroundColor: Colors.amberBg}]}>
          <AppText variant="small" color={Colors.amberText}>
            Last GAD-7: 6 (mild-moderate, Aug 2025)
          </AppText>
        </View>
        {GAD2_QUESTIONS.map((q, qi) => (
          <View key={qi} style={styles.screenQuestion}>
            <AppText variant="body" style={{marginBottom: vs(6)}}>{q}</AppText>
            <View style={styles.screenOptionsRow}>
              {SCREEN_OPTIONS.map(opt => {
                const active = gad2[qi] === opt.score;
                return (
                  <TouchableOpacity
                    key={opt.score}
                    style={[styles.screenOption, active && styles.screenOptionActive]}
                    activeOpacity={0.6}
                    onPress={() => {
                      const next = [...gad2];
                      next[qi] = opt.score;
                      setGad2(next);
                    }}>
                    <AppText variant="small" color={active ? Colors.purpleText : Colors.textSecondary} style={{fontWeight: active ? '700' : '400'}}>
                      {opt.score}
                    </AppText>
                    <AppText variant="small" color={active ? Colors.purpleText : Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(1)}}>
                      {opt.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
        <View style={styles.screenFooter}>
          <AppText variant="bodyBold">GAD-2 score: <AppText variant="bodyBold" color={Colors.tealText}>{gad2Score}</AppText></AppText>
          <View style={[styles.statusBadge, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="small" color={Colors.tealText}>Minimal</AppText>
          </View>
        </View>
      </View>

      {/* ── 7. Diabetes Distress ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>DIABETES DISTRESS</AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(6)}}>3 quick items from PAID-5</AppText>
      <View style={styles.card}>
        <View style={[styles.screenHeader, {backgroundColor: Colors.amberBg}]}>
          <AppText variant="small" color={Colors.amberText}>
            Diabetes distress is different from depression — it's the emotional burden of managing diabetes daily. Rate each 1-5.
          </AppText>
        </View>
        {DISTRESS_QUESTIONS.map((q, qi) => (
          <View key={qi} style={styles.screenQuestion}>
            <AppText variant="body" style={{marginBottom: vs(6)}}>{q}</AppText>
            <View style={styles.screenOptionsRow}>
              {DISTRESS_OPTIONS.map(val => {
                const active = distress[qi] === val;
                return (
                  <TouchableOpacity
                    key={val}
                    style={[styles.screenOption, active && styles.screenOptionActive, {minWidth: ms(44)}]}
                    activeOpacity={0.6}
                    onPress={() => {
                      const next = [...distress];
                      next[qi] = val;
                      setDistress(next);
                    }}>
                    <AppText variant="small" color={active ? Colors.purpleText : Colors.textSecondary} style={{fontWeight: active ? '700' : '400'}}>
                      {val}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
        <View style={styles.screenFooter}>
          <AppText variant="bodyBold">Distress score: <AppText variant="bodyBold" color={Colors.tealText}>{distressScore}</AppText></AppText>
          <View style={[styles.statusBadge, {backgroundColor: getDistressStatus(parseFloat(distressScore)).bg}]}>
            <AppText variant="small" color={getDistressStatus(parseFloat(distressScore)).color}>
              {getDistressStatus(parseFloat(distressScore)).label}
            </AppText>
          </View>
        </View>
      </View>

      {/* ── 8. Physical Symptoms ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>PHYSICAL SYMPTOMS</AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(6)}}>Stress often shows in body</AppText>
      <View style={styles.tagWrap}>
        {PHYSICAL_TAGS.map(tag => {
          const active = selectedPhysical.includes(tag);
          const isGreen = tag === 'No physical symptoms' && active;
          return (
            <TouchableOpacity
              key={tag}
              style={[
                styles.tag,
                active && !isGreen && styles.tagActive,
                isGreen && {backgroundColor: Colors.tealBg, borderColor: Colors.tealText},
              ]}
              activeOpacity={0.6}
              onPress={() => toggleTag(tag, selectedPhysical, setSelectedPhysical)}>
              <AppText variant="small" color={isGreen ? Colors.tealText : active ? Colors.purpleText : Colors.textSecondary}>
                {tag}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── 9. Sleep Last Night ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>SLEEP LAST NIGHT</AppText>
      <View style={styles.chipRow}>
        {SLEEP_QUALITY.map(chip => {
          const active = sleepQuality === chip;
          return (
            <TouchableOpacity
              key={chip}
              style={[styles.chip, active && styles.chipActive]}
              activeOpacity={0.6}
              onPress={() => setSleepQuality(chip)}>
              <AppText variant="small" color={active ? Colors.purpleText : Colors.textSecondary}>{chip}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>
      <View style={styles.tagWrap}>
        {SLEEP_TAGS.map(tag => {
          const active = selectedSleepTags.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, active && styles.tagActive]}
              activeOpacity={0.6}
              onPress={() => toggleTag(tag, selectedSleepTags, setSelectedSleepTags)}>
              <AppText variant="small" color={active ? Colors.purpleText : Colors.textSecondary}>{tag}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── 10. Health Connections ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>TODAY'S HEALTH CONNECTIONS</AppText>

      {/* Glucose connection */}
      <View style={[styles.connectionCard, {backgroundColor: Colors.tealBg, borderColor: Colors.tealText}]}>
        <View style={styles.connectionHeader}>
          <Icon family="Ionicons" name="analytics-outline" size={ms(20)} color={Colors.tealText} />
          <AppText variant="bodyBold" color={Colors.tealText} style={{marginLeft: s(6), flex: 1}}>
            Stress {'\u2192'} Blood glucose {'\u2191'}
          </AppText>
        </View>
        <AppText variant="small" color={Colors.tealText} style={{marginTop: vs(4)}}>
          Cortisol from stress raises blood glucose. Your current glucose is 8.4 mmol/L. Stress management could reduce HbA1c by 0.5-1.0%.
        </AppText>
      </View>

      {/* BP connection */}
      <View style={[styles.connectionCard, {backgroundColor: Colors.redBg, borderColor: Colors.redText}]}>
        <View style={styles.connectionHeader}>
          <Icon family="Ionicons" name="heart-outline" size={ms(20)} color={Colors.redText} />
          <AppText variant="bodyBold" color={Colors.redText} style={{marginLeft: s(6), flex: 1}}>
            Stress {'\u2192'} Blood pressure {'\u2191'}
          </AppText>
        </View>
        <AppText variant="small" color={Colors.redText} style={{marginTop: vs(4)}}>
          Sympathetic activation raises BP. Your current reading is 140/90. Chronic stress worsens hypertension.
        </AppText>
      </View>

      {/* Sleep connection */}
      <View style={[styles.connectionCard, {backgroundColor: Colors.purpleBg, borderColor: Colors.purpleText}]}>
        <View style={styles.connectionHeader}>
          <Icon family="Ionicons" name="moon-outline" size={ms(20)} color={Colors.purpleText} />
          <AppText variant="bodyBold" color={Colors.purpleText} style={{marginLeft: s(6), flex: 1}}>
            Poor sleep {'\u2192'} Non-dipping BP + high fasting glucose
          </AppText>
        </View>
        <AppText variant="small" color={Colors.purpleText} style={{marginTop: vs(4)}}>
          5-6h sleep linked to non-dipper pattern (2.8%). Each extra hour of sleep = approx -4 mmHg systolic.
        </AppText>
      </View>

      {/* ── 11. Comparison ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>HOW THIS COMPARES</AppText>
      <View style={styles.card}>
        {COMPARISON_ROWS.map((row, i) => (
          <View key={i} style={[styles.comparisonRow, i < COMPARISON_ROWS.length - 1 && styles.comparisonBorder]}>
            <AppText variant="small" color={Colors.textSecondary} style={{flex: 1}}>{row.label}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{width: s(60), textAlign: 'center'}}>{row.prev}</AppText>
            <AppText variant="small" color={row.deltaColor} style={{width: s(80), textAlign: 'right', fontWeight: '600'}}>
              {row.delta ? row.delta + ' ' : ''}{row.curr}
            </AppText>
          </View>
        ))}
      </View>

      {/* ── 12. Gratitude ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>WHAT WENT WELL TODAY?</AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(6)}}>Gratitude practice</AppText>
      <View style={styles.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(2)}}>One good thing right now</AppText>
        <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(8)}}>
          Research shows daily gratitude improves mood and resilience
        </AppText>
        <TextInput
          style={styles.textInput}
          placeholder="Write something you're grateful for..."
          placeholderTextColor={Colors.textTertiary}
          value={gratitudeText}
          onChangeText={setGratitudeText}
        />
        <View style={[styles.chipRow, {marginTop: vs(8)}]}>
          {GRATITUDE_CHIPS.map(chip => {
            const active = selectedGratitude.includes(chip);
            return (
              <TouchableOpacity
                key={chip}
                style={[styles.chip, active && styles.chipActive]}
                activeOpacity={0.6}
                onPress={() => toggleTag(chip, selectedGratitude, setSelectedGratitude)}>
                <AppText variant="small" color={active ? Colors.purpleText : Colors.textSecondary}>{chip}</AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── 13. Main Journal ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>WHAT'S ON YOUR MIND?</AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(6)}}>Free write {'\u00B7'} Ayu reads this</AppText>
      <TextInput
        style={[styles.textInput, {minHeight: vs(80)}]}
        placeholder="Write anything..."
        placeholderTextColor={Colors.textTertiary}
        multiline
        textAlignVertical="top"
        value={journalText}
        onChangeText={setJournalText}
      />

      {/* ── 14. Ayu Pattern Insight ── */}
      <View style={[styles.insightCard, {backgroundColor: Colors.purpleBg, borderColor: Colors.purpleText}]}>
        <View style={styles.connectionHeader}>
          <Icon family="Ionicons" name="bulb-outline" size={ms(18)} color={Colors.purpleText} />
          <AppText variant="bodyBold" color={Colors.purpleText} style={{marginLeft: s(6)}}>Ayu Pattern Insight</AppText>
        </View>
        <AppText variant="small" color={Colors.purpleText} style={{marginTop: vs(4)}}>
          Over past 4 weeks stress peaks Mon-Tue. Same days show glucose +0.9 mmol/L and BP +8 mmHg. B12 started Mar 15, takes 4-6 weeks for full effect.
        </AppText>
      </View>

      {/* ── 15. Coping Strategies ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>WHAT HELPED TODAY?</AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(6)}}>Coping strategies</AppText>
      <View style={styles.tagWrap}>
        {COPING_TAGS.map(tag => {
          const active = selectedCoping.includes(tag);
          return (
            <TouchableOpacity
              key={tag}
              style={[styles.tag, active && styles.tagActive]}
              activeOpacity={0.6}
              onPress={() => toggleTag(tag, selectedCoping, setSelectedCoping)}>
              <AppText variant="small" color={active ? Colors.purpleText : Colors.textSecondary}>{tag}</AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ── 16. Professional Support ── */}
      <View style={[styles.insightCard, {backgroundColor: Colors.pinkBg, borderColor: '#d4849a'}]}>
        <AppText variant="small" color="#8b2252">
          Last mental health review Aug 2025 (7 months ago) — PHQ-9: 8, GAD-7: 6, diabetes distress noted. Add mental health review to Apr 4 agenda?
        </AppText>
        <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
          <AppText variant="small" color={Colors.white} style={{fontWeight: '600'}}>Add to Apr 4 agenda</AppText>
        </TouchableOpacity>
      </View>

    </View>
  );
};

// ─── Styles ─────────────────────────────────────────────────────────────

const styles = StyleSheet.create({
  sectionHeading: {
    marginTop: vs(16),
    marginBottom: vs(6),
  },
  card: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(14),
    backgroundColor: Colors.white,
    marginBottom: vs(6),
  },

  // Mood selector
  moodRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  moodItem: {
    alignItems: 'center',
    width: s(44),
    paddingVertical: vs(6),
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: 'transparent',
  },
  moodBarRow: {
    flexDirection: 'row',
    marginTop: vs(12),
    height: ms(10),
  },
  moodBarSeg: {
    flex: 1,
    marginHorizontal: 0.5,
  },
  moodBarLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(4),
  },

  // Sliders
  sliderSection: {},
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  sliderBadge: {
    marginLeft: 'auto',
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  sliderBarOuter: {
    flexDirection: 'row',
    height: ms(6),
    borderRadius: ms(3),
    overflow: 'hidden',
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(4),
  },

  // Tags
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: vs(6),
  },
  tag: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(20),
    paddingHorizontal: s(12),
    paddingVertical: vs(5),
    marginRight: s(6),
    marginBottom: vs(6),
    backgroundColor: Colors.white,
  },
  tagActive: {
    backgroundColor: Colors.purpleBg,
    borderColor: Colors.purpleText,
  },

  // Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: vs(6),
  },
  chip: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(20),
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    marginRight: s(6),
    marginBottom: vs(6),
    backgroundColor: Colors.white,
  },
  chipActive: {
    backgroundColor: Colors.purpleBg,
    borderColor: Colors.purpleText,
  },

  // Screen questions (PHQ-2, GAD-2, Distress)
  screenHeader: {
    padding: ms(10),
    borderRadius: ms(10),
    marginBottom: vs(10),
  },
  screenQuestion: {
    marginBottom: vs(12),
  },
  screenOptionsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  screenOption: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(6),
    paddingHorizontal: s(4),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(10),
    marginHorizontal: s(2),
    backgroundColor: Colors.white,
  },
  screenOptionActive: {
    backgroundColor: Colors.purpleBg,
    borderColor: Colors.purpleText,
  },
  screenFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(8),
    paddingTop: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: '#d1d5db',
  },
  statusBadge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(8),
  },

  // Connection cards
  connectionCard: {
    borderWidth: 1,
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: vs(6),
  },
  connectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  // Comparison
  comparisonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  comparisonBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#d1d5db',
  },

  // Text input
  textInput: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(10),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    fontSize: ms(14),
    color: Colors.textPrimary,
    backgroundColor: Colors.white,
  },

  // Insight cards
  insightCard: {
    borderWidth: 1,
    borderRadius: ms(14),
    padding: ms(14),
    marginTop: vs(10),
    marginBottom: vs(6),
  },

  // Primary button
  primaryButton: {
    backgroundColor: Colors.primary,
    borderRadius: ms(10),
    paddingVertical: vs(10),
    alignItems: 'center',
    marginTop: vs(10),
  },
});

export default MoodManualView;
