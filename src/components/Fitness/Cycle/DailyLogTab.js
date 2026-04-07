import React, {useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, TextInput} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const PERIOD_STATUS = [
  {id: 'started', label: 'Period started today', icon: 'ellipse'},
  {id: 'spotting', label: 'Spotting only', icon: 'water-outline'},
  {id: 'noperiod', label: 'No period today', icon: 'checkmark-circle-outline'},
  {id: 'ended', label: 'Period ended today', icon: 'flag-outline'},
];

const FLOW_OPTIONS = ['Spotting', 'Light', 'Moderate', 'Heavy', 'Very heavy'];
const CLOT_OPTIONS = [
  {id: 'none', label: 'No clots'},
  {id: 'small', label: 'Small clots (<2cm)'},
  {id: 'large', label: 'Large clots (>2cm)'},
];

const SYMPTOMS = [
  {id: 'cramps', name: 'Cramps', icon: 'pulse-outline'},
  {id: 'bloating', name: 'Bloating', icon: 'resize-outline'},
  {id: 'fatigue', name: 'Fatigue', icon: 'battery-dead-outline'},
  {id: 'headache', name: 'Headache', icon: 'flash-outline'},
  {id: 'breast', name: 'Breast tender', icon: 'heart-dislike-outline'},
  {id: 'nausea', name: 'Nausea', icon: 'medical-outline'},
  {id: 'backpain', name: 'Back pain', icon: 'body-outline'},
  {id: 'acne', name: 'Acne / oily skin', icon: 'water-outline'},
  {id: 'sleep', name: 'Poor sleep', icon: 'moon-outline'},
  {id: 'cravings', name: 'Food cravings', icon: 'restaurant-outline'},
  {id: 'hotflash', name: 'Hot flashes', icon: 'thermometer-outline'},
  {id: 'dizzy', name: 'Dizziness', icon: 'sync-outline'},
];

const PAIN_LOCATIONS = [
  {id: 'abdomen', name: 'Lower abdomen', icon: 'ellipse-outline'},
  {id: 'back', name: 'Lower back', icon: 'body-outline'},
  {id: 'legs', name: 'Thighs / legs', icon: 'walk-outline'},
  {id: 'head', name: 'Head / migraine', icon: 'headset-outline'},
  {id: 'chest', name: 'Chest / breast', icon: 'heart-outline'},
  {id: 'none', name: 'No pain', icon: 'checkmark-circle-outline'},
];

const CRAMP_OPTIONS = ['0 None', '1 Mild', '2 Moderate', '3 Severe', '4 Debilitating'];

const MOOD_ICONS = [
  {icon: 'sad-outline', label: 'Very sad'},
  {icon: 'sad-outline', label: 'Sad'},
  {icon: 'happy-outline', label: 'Neutral'},
  {icon: 'happy-outline', label: 'Good'},
  {icon: 'happy-outline', label: 'Great'},
];

const MOOD_TAGS = [
  {id: 'irritable', label: 'Irritable', icon: 'alert-circle-outline'},
  {id: 'tearful', label: 'Tearful', icon: 'water-outline'},
  {id: 'anxious', label: 'Anxious', icon: 'warning-outline'},
  {id: 'unmotivated', label: 'Unmotivated', icon: 'remove-circle-outline'},
  {id: 'calm', label: 'Calm', icon: 'leaf-outline'},
  {id: 'energetic', label: 'Energetic', icon: 'flash-outline'},
  {id: 'grateful', label: 'Grateful', icon: 'heart-outline'},
];

const CM_OPTIONS = ['Dry', 'Sticky', 'Creamy', 'Egg-white', 'Watery'];

const SEX_OPTIONS = [
  {id: 'protected', label: 'Protected', icon: 'shield-checkmark-outline'},
  {id: 'unprotected', label: 'Unprotected', icon: 'warning-outline'},
  {id: 'none', label: 'No activity', icon: 'close-circle-outline'},
  {id: 'private', label: 'Private', icon: 'lock-closed-outline'},
];

const CONTRA_OPTIONS = [
  {id: 'none', label: 'None', icon: 'close-circle-outline'},
  {id: 'ocp', label: 'OCP', icon: 'medkit-outline'},
  {id: 'iud', label: 'IUD', icon: 'ellipse-outline'},
  {id: 'inject', label: 'Injectable', icon: 'bandage-outline'},
  {id: 'natural', label: 'Natural', icon: 'leaf-outline'},
];

const CONTEXT_TAGS = [
  {id: 'workstress', label: 'Work stress', icon: 'briefcase-outline'},
  {id: 'healthanx', label: 'Health anxiety', icon: 'medical-outline'},
  {id: 'poorsleep', label: 'Poor sleep last night', icon: 'moon-outline'},
  {id: 'bsugar', label: 'Blood sugar off', icon: 'analytics-outline'},
  {id: 'medeffect', label: 'Medication effect', icon: 'medkit-outline'},
  {id: 'skipexercise', label: 'Skipped exercise', icon: 'fitness-outline'},
  {id: 'feelwell', label: 'Feeling well today', icon: 'happy-outline'},
  {id: 'tests', label: 'Upcoming tests', icon: 'flask-outline'},
  {id: 'cyclemood', label: 'Cycle-related mood', icon: 'flower-outline'},
];

const SKIN_TAGS = [
  {id: 'oily', label: 'Oily skin', icon: 'water-outline'},
  {id: 'acne', label: 'Acne (face/back)', icon: 'alert-circle-outline'},
  {id: 'facialhair', label: 'Increased facial hair', icon: 'trending-up-outline'},
  {id: 'thinning', label: 'Thinning scalp hair', icon: 'trending-down-outline'},
  {id: 'weightgain', label: 'Weight gain this cycle', icon: 'scale-outline'},
  {id: 'nosigns', label: 'No unusual signs', icon: 'checkmark-circle-outline'},
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

const InsightCard = ({bgColor, borderColor, iconName, iconColor, textColor, children}) => (
  <View style={[st.insight, {backgroundColor: bgColor, borderColor}]}>
    <Icon family="Ionicons" name={iconName} size={ms(14)} color={iconColor} />
    <AppText variant="caption" color={textColor} style={{flex: 1, lineHeight: ms(18)}}>{children}</AppText>
  </View>
);

const ChipSelect = ({items, selected, onSelect}) => (
  <View style={st.chipWrap}>
    {items.map(item => {
      const on = selected === item.id;
      return (
        <TouchableOpacity key={item.id} style={[st.chip, on && st.chipOn]} onPress={() => onSelect(item.id)} activeOpacity={0.7}>
          <AppText variant="caption" color={on ? Colors.white : '#555'} style={{fontWeight: on ? '700' : '500'}}>{item.label}</AppText>
        </TouchableOpacity>
      );
    })}
  </View>
);

const SymBox = ({item, active, onPress}) => (
  <TouchableOpacity style={[st.symBox, active && st.symBoxOn]} onPress={onPress} activeOpacity={0.7}>
    <Icon family="Ionicons" name={item.icon} size={ms(20)} color={active ? Colors.primary : Colors.textSecondary} />
    <AppText variant="subtext" color={active ? Colors.primary : Colors.textPrimary} style={{fontWeight: '600', marginTop: vs(4)}}>{item.name}</AppText>
  </TouchableOpacity>
);

const TagChip = ({label, active, green, onPress}) => (
  <TouchableOpacity style={[st.tag, active && (green ? st.tagOnGreen : st.tagOn)]} onPress={onPress} activeOpacity={0.7}>
    <AppText variant="subtext" color={active ? (green ? Colors.tealText : Colors.primary) : '#555'} style={{fontWeight: active ? '700' : '500'}}>{label}</AppText>
  </TouchableOpacity>
);

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

const DailyLogTab = () => {
  const [periodStatus, setPeriodStatus] = useState('noperiod');
  const [flowLevel, setFlowLevel] = useState(null);
  const [clots, setClots] = useState('none');
  const [activeSymptoms, setActiveSymptoms] = useState(['fatigue']);
  const [activePains, setActivePains] = useState(['none']);
  const [crampLevel, setCrampLevel] = useState(0);
  const [moodIdx, setMoodIdx] = useState(2);
  const [activeMoodTags, setActiveMoodTags] = useState(['irritable']);
  const [cmType, setCmType] = useState('Watery');
  const [sexActivity, setSexActivity] = useState('none');
  const [contraception, setContraception] = useState('none');
  const [contextActive, setContextActive] = useState(['workstress']);
  const [skinActive, setSkinActive] = useState(['nosigns']);
  const [notes, setNotes] = useState('');

  const toggleArr = (arr, setArr, id) => setArr(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  const showFlow = periodStatus === 'started' || periodStatus === 'spotting';

  return (
    <ScrollView style={st.container} showsVerticalScrollIndicator={false}>

      {/* Today header */}
      <Section title="Today \u00b7 Day 24 \u00b7 24 Mar 2026" />
      <InsightCard bgColor={Colors.purpleBg} borderColor="#A5B4FC" iconName="calendar-outline" iconColor={Colors.purpleText} textColor={Colors.purpleText}>
        <AppText style={{fontWeight: '700'}}>Late luteal phase.</AppText> Days 20-28. Progesterone falling. Period expected Apr 3 (10 days). Common: PMS, mood changes, bloating, breast tenderness, food cravings, fatigue.
      </InsightCard>

      {/* Period status */}
      <Section title="Period status today" />
      <ChipSelect items={PERIOD_STATUS} selected={periodStatus} onSelect={setPeriodStatus} />

      {/* Flow (if period) */}
      {showFlow && (
        <>
          <Section title="Flow intensity" />
          <View style={st.intRow}>
            {FLOW_OPTIONS.map((f, i) => (
              <TouchableOpacity key={f} style={[st.intOpt, flowLevel === i && st.intOptOn]} onPress={() => setFlowLevel(i)} activeOpacity={0.7}>
                <AppText variant="subtext" color={flowLevel === i ? Colors.white : Colors.textSecondary} style={{fontWeight: '700'}}>{f}</AppText>
              </TouchableOpacity>
            ))}
          </View>
          <Section title="Clots" />
          <View style={st.chipWrap}>
            {CLOT_OPTIONS.map(c => (
              <TouchableOpacity key={c.id} style={[st.chip, clots === c.id && st.chipOn]} onPress={() => setClots(c.id)} activeOpacity={0.7}>
                <AppText variant="caption" color={clots === c.id ? Colors.white : '#555'} style={{fontWeight: clots === c.id ? '700' : '500'}}>{c.label}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* Physical symptoms */}
      <Section title="Physical symptoms" />
      <View style={st.symGrid}>
        {SYMPTOMS.map(s => (
          <SymBox key={s.id} item={s} active={activeSymptoms.includes(s.id)} onPress={() => toggleArr(activeSymptoms, setActiveSymptoms, s.id)} />
        ))}
      </View>

      {/* Pain location */}
      <Section title="Pain location" />
      <View style={st.painGrid}>
        {PAIN_LOCATIONS.map(p => (
          <SymBox key={p.id} item={p} active={activePains.includes(p.id)} onPress={() => toggleArr(activePains, setActivePains, p.id)} />
        ))}
      </View>

      {/* Cramp intensity */}
      <Section title="Cramp intensity \u00b7 Rate 0-4" />
      <View style={st.intRow}>
        {CRAMP_OPTIONS.map((c, i) => (
          <TouchableOpacity key={c} style={[st.intOpt, crampLevel === i && st.intOptOn]} onPress={() => setCrampLevel(i)} activeOpacity={0.7}>
            <AppText variant="subtext" color={crampLevel === i ? Colors.white : Colors.textSecondary} style={{fontWeight: '700'}}>{c}</AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Mood today */}
      <Section title="Mood today" />
      <View style={st.moodRow}>
        {MOOD_ICONS.map((m, i) => (
          <TouchableOpacity key={i} style={[st.moodOpt, moodIdx === i && st.moodOptOn]} onPress={() => setMoodIdx(i)} activeOpacity={0.7}>
            <Icon family="Ionicons" name={m.icon} size={ms(24)} color={moodIdx === i ? Colors.purpleText : Colors.textSecondary} />
          </TouchableOpacity>
        ))}
      </View>
      <View style={st.tagWrap}>
        {MOOD_TAGS.map(t => (
          <TagChip key={t.id} label={t.label} active={activeMoodTags.includes(t.id)} onPress={() => toggleArr(activeMoodTags, setActiveMoodTags, t.id)} />
        ))}
      </View>

      {/* BBT + Cervical mucus */}
      <Section title="Basal body temperature & discharge" />
      <View style={st.twoCol}>
        <View style={st.tcBox}>
          <AppText variant="subtext" color={Colors.textSecondary} style={st.tcLabel}>BBT (before rising)</AppText>
          <AppText variant="header" color={Colors.primary} style={{fontWeight: '700', fontSize: ms(18)}}>36.7{'\u00b0'}C</AppText>
          <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(14)}}>Elevated post-ovulation. BBT drops before period. Tap to update.</AppText>
        </View>
        <View style={st.tcBox}>
          <AppText variant="subtext" color={Colors.textSecondary} style={st.tcLabel}>Cervical mucus</AppText>
          <AppText variant="bodyBold" color={Colors.primary} style={{marginTop: vs(2)}}>Watery</AppText>
          <View style={[st.chipWrap, {marginTop: vs(4)}]}>
            {CM_OPTIONS.map(c => (
              <TouchableOpacity key={c} style={[st.miniChip, cmType === c && st.miniChipOn]} onPress={() => setCmType(c)} activeOpacity={0.7}>
                <AppText variant="subtext" color={cmType === c ? Colors.white : '#555'} style={{fontWeight: cmType === c ? '700' : '500'}}>{c}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* Sexual activity */}
      <Section title="Sexual activity \u00b7 Private \u00b7 Never shared outside your account" />
      <ChipSelect items={SEX_OPTIONS} selected={sexActivity} onSelect={setSexActivity} />

      {/* Contraception */}
      <Section title="Contraception" />
      <ChipSelect items={CONTRA_OPTIONS} selected={contraception} onSelect={setContraception} />

      {/* Context tags */}
      <Section title="What's affecting you today?" />
      <View style={st.tagWrap}>
        {CONTEXT_TAGS.map(t => (
          <TagChip key={t.id} label={t.label} active={contextActive.includes(t.id)} onPress={() => toggleArr(contextActive, setContextActive, t.id)} />
        ))}
      </View>

      {/* Skin & hair */}
      <Section title="Skin, hair & hormonal signs" />
      <View style={st.tagWrap}>
        {SKIN_TAGS.map(t => (
          <TagChip key={t.id} label={t.label} active={skinActive.includes(t.id)} green={t.id === 'nosigns' && skinActive.includes(t.id)} onPress={() => toggleArr(skinActive, setSkinActive, t.id)} />
        ))}
      </View>

      {/* Medication insight */}
      <InsightCard bgColor={Colors.amberBg} borderColor="#FDDCB5" iconName="medkit-outline" iconColor={Colors.amberText} textColor={Colors.amberText}>
        <AppText style={{fontWeight: '700'}}>Medications & this cycle phase:</AppText> Progesterone in days 20-28 mildly reduces Metformin's effectiveness - check fasting glucose this week. Amlodipine may feel less effective - BP slightly higher than usual is expected. Methylcobalamin (B12) supports nerve function; fatigue in PMS is partly B12-mediated for some women - you started Day 9 Mar 15.
      </InsightCard>

      {/* Note */}
      <Section title="Note" />
      <TextInput
        style={st.noteInput}
        value={notes}
        onChangeText={setNotes}
        placeholder="e.g. 'More tired than usual today', 'Mild cramps since afternoon', 'Noticed glucose was 9.1 mmol/L - wondering if cycle-related'"
        placeholderTextColor={Colors.textTertiary}
        multiline
        textAlignVertical="top"
      />

      <View style={{height: vs(80)}} />
    </ScrollView>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: s(13), paddingTop: vs(4)},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Insight
  insight: {borderRadius: ms(11), borderWidth: 1, padding: ms(10), marginBottom: vs(10), flexDirection: 'row', alignItems: 'flex-start', gap: s(8)},

  // Chips
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6), marginBottom: vs(10)},
  chip: {paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(22), borderWidth: 0.5, borderColor: '#E5DDD3', backgroundColor: Colors.white},
  chipOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},

  // Symptom grid
  symGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(7), marginBottom: vs(10)},
  symBox: {width: '31%', backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(10), alignItems: 'center'},
  symBoxOn: {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen},

  // Pain grid
  painGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6), marginBottom: vs(10)},

  // Intensity row
  intRow: {flexDirection: 'row', gap: s(5), marginBottom: vs(8)},
  intOpt: {flex: 1, height: ms(28), borderRadius: ms(8), borderWidth: 0.5, borderColor: '#E5DDD3', backgroundColor: '#f4f7f5', alignItems: 'center', justifyContent: 'center'},
  intOptOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},

  // Mood row
  moodRow: {flexDirection: 'row', gap: s(5), justifyContent: 'space-between', marginBottom: vs(10)},
  moodOpt: {flex: 1, alignItems: 'center', paddingVertical: vs(8), borderRadius: ms(12), borderWidth: 0.5, borderColor: 'transparent'},
  moodOptOn: {backgroundColor: Colors.purpleBg, borderColor: '#c4a8e8'},

  // Tags
  tagWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6), marginBottom: vs(10)},
  tag: {paddingHorizontal: s(11), paddingVertical: vs(6), borderRadius: ms(22), borderWidth: 0.5, borderColor: '#E5DDD3', backgroundColor: Colors.white},
  tagOn: {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen},
  tagOnGreen: {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen},

  // Two column
  twoCol: {flexDirection: 'row', gap: s(8), marginBottom: vs(10)},
  tcBox: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(11)},
  tcLabel: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(4)},

  // Mini chip (CM)
  miniChip: {paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(20), borderWidth: 0.5, borderColor: '#E5DDD3', backgroundColor: Colors.white},
  miniChipOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},

  // Note
  noteInput: {backgroundColor: Colors.white, borderRadius: ms(11), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(10), fontSize: ms(12), color: Colors.textPrimary, minHeight: vs(56), lineHeight: ms(19), textAlignVertical: 'top'},
});

export default DailyLogTab;
