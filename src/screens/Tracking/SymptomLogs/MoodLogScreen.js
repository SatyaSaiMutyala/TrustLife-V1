import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, TextInput, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const MOOD_DATA = [
  {emoji: 'sad-outline', label: 'Very low', color: Colors.red},
  {emoji: 'sad-outline', label: 'Very low', color: Colors.red},
  {emoji: 'sad-outline', label: 'Low', color: '#F97316'},
  {emoji: 'sad-outline', label: 'Low', color: '#F97316'},
  {emoji: 'happy-outline', label: 'Neutral', color: Colors.amber},
  {emoji: 'happy-outline', label: 'Neutral', color: Colors.amber},
  {emoji: 'happy-outline', label: 'Good', color: '#84CC16'},
  {emoji: 'happy-outline', label: 'Good', color: '#84CC16'},
  {emoji: 'happy-outline', label: 'Great', color: Colors.accent},
  {emoji: 'happy-outline', label: 'Great', color: Colors.accent},
];

const DEP_CHIPS = ['Sad', 'Hopeless', 'Numb', 'Empty', 'Overwhelmed', 'Exhausted', 'Worthless', 'Guilty', 'Helpless', 'Lonely'];
const ANX_CHIPS = ['Anxious', 'Worried', 'Panicky', 'On edge', 'Fearful', 'Dread'];
const AGI_CHIPS = ['Irritable', 'Angry', 'Frustrated', 'Restless', 'Tense'];
const POS_CHIPS = ['Calm', 'Content', 'Hopeful', 'Connected', 'Grateful', 'Motivated'];
const SLEEP_CHIPS = ['Restless', 'Restful', 'Nightmares', 'Could not fall asleep', 'Woke early', 'Slept too much'];
const APPETITE_CHIPS = ['Poor appetite', 'Normal', 'Overeating / comfort eating', 'Skipped meals', 'Erratic / variable'];
const PHYSICAL_CHIPS = ['Headache', 'Muscle tension', 'Heart racing', 'Chest tightness', 'Fatigue / heaviness', 'Nausea', 'Body aches', 'Breathlessness', 'Dizziness', 'No symptoms'];
const COGNITION_CHIPS = ['Ruminating', 'Brain fog', 'Racing thoughts', 'Scattered / unfocused', 'Indecisive', 'Negative self-talk', 'Intrusive thoughts', 'Forgetful', 'Slow thinking', 'Clear-headed'];
const SOCIAL_CHIPS = ['Withdrew / isolated', 'Avoided calls / texts', 'Felt disconnected', 'Reached out to someone', 'Time with family', 'Felt supported'];
const ACTIVITY_CHIPS = ['Exercised', 'Went outside', 'Work / study', 'Creative activity', 'Cooked / ate well', 'Read / learned', 'On screens a lot', 'Stayed in bed', "Couldn't do much"];
const STRESSOR_CHIPS = ['Health concerns', 'Family responsibilities', 'Work / career', 'Finances', 'Relationship conflict', 'News / world events', 'Social media', 'Uncertainty / future', 'Grief / loss', 'Home environment', 'Nothing specific today'];
const COPING_CHIPS = ['Talked to someone', 'Journaled', 'Deep breathing', 'Meditated', 'Exercised', 'Rested', 'Distraction / scrolled', 'Suppressed feelings', 'Alcohol / substance', 'Nothing yet'];

const PHQ9_ITEMS = [
  'Little interest or pleasure in doing things',
  'Feeling down, depressed, or hopeless',
  'Trouble falling asleep, staying asleep, or sleeping too much',
  'Feeling tired or having little energy',
  'Poor appetite or overeating',
  'Feeling bad about yourself \u2014 or that you are a failure or have let yourself or your family down',
  'Trouble concentrating on things such as reading, work, or watching TV',
  'Moving or speaking so slowly that others could notice \u2014 or being fidgety and restless',
  'Thoughts that you would be better off dead, or of hurting yourself in some way',
];
const PHQ9_DEFAULTS = [1, 1, 2, 2, 1, 1, 2, 0, 0];

const GAD7_ITEMS = [
  'Feeling nervous, anxious, or on edge',
  'Not being able to stop or control worrying',
  'Worrying too much about different things',
  'Trouble relaxing',
  'Being so restless it is hard to sit still',
  'Becoming easily annoyed or irritable',
  'Feeling afraid as if something awful might happen',
];
const GAD7_DEFAULTS = [2, 1, 2, 2, 0, 1, 1];

const PSS4_ITEMS = [
  'In the last month \u2014 how often have you felt unable to control important things in your life?',
  'How often have you felt confident about your ability to handle your personal problems?',
  'How often have you felt that things were going your way?',
  'How often have you felt difficulties were piling up so high you could not overcome them?',
];
const PSS4_DEFAULTS = [2, 2, 1, 2];
const PSS_OPTS = ['Never', 'Almost never', 'Sometimes', 'Often', 'Very often'];
const PHQ_OPTS = ['Not at all', 'Several days', 'Most days', 'Nearly every day'];

const Section = ({title}) => (
  <View style={st.sec}>
    <AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{title}</AppText>
    <View style={st.secLine} />
  </View>
);

const ChipGroup = ({chips, selected, onToggle, multiSelect = true}) => (
  <View style={st.chipWrap}>
    {chips.map(c => {
      const on = selected.includes(c);
      return (
        <TouchableOpacity key={c} style={[st.chip, on && st.chipOn]} onPress={() => onToggle(c)} activeOpacity={0.7}>
          <AppText variant="small" color={on ? Colors.white : Colors.textSecondary} style={{fontWeight: on ? '700' : '500'}}>{c}</AppText>
        </TouchableOpacity>
      );
    })}
  </View>
);

const ScreeningItem = ({question, value, onChange, options, isLast}) => (
  <View style={[st.phqItem, isLast && {borderWidth: 1.5, borderColor: '#dde8e2'}]}>
    <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', lineHeight: ms(17), marginBottom: vs(8)}}>{question}</AppText>
    <View style={{flexDirection: 'row', gap: s(4)}}>
      {options.map((opt, i) => (
        <TouchableOpacity key={i} style={[st.phqOpt, value === i && st.phqOptOn]} onPress={() => onChange(i)} activeOpacity={0.7}>
          <AppText variant="subtext" color={value === i ? Colors.white : Colors.textTertiary} style={{fontWeight: '600', textAlign: 'center', lineHeight: ms(12)}}>{opt}</AppText>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const MoodLogScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [mood, setMood] = useState(5);
  const [energy, setEnergy] = useState(3);
  const [sleep, setSleep] = useState(5.5);
  const [joy, setJoy] = useState('partly');
  const [safety, setSafety] = useState('safe');
  const [notes, setNotes] = useState('Worried about my HbA1c results. Feel like I am not managing my health well despite trying. Aarav cooking with me this evening helped a bit.');

  const [depChips, setDepChips] = useState(['Overwhelmed', 'Guilty']);
  const [anxChips, setAnxChips] = useState(['Anxious', 'Worried']);
  const [agiChips, setAgiChips] = useState([]);
  const [posChips, setPosChips] = useState([]);
  const [sleepChips, setSleepChips] = useState(['Restless']);
  const [appetite, setAppetite] = useState(['Poor appetite']);
  const [physical, setPhysical] = useState(['Headache', 'Fatigue / heaviness']);
  const [cognition, setCognition] = useState(['Ruminating', 'Brain fog']);
  const [social, setSocial] = useState(['Withdrew / isolated']);
  const [activities, setActivities] = useState([]);
  const [stressors, setStressors] = useState(['Health concerns', 'Family responsibilities']);
  const [coping, setCoping] = useState(['Deep breathing']);

  const [phq9, setPhq9] = useState([...PHQ9_DEFAULTS]);
  const [gad7, setGad7] = useState([...GAD7_DEFAULTS]);
  const [pss4, setPss4] = useState([...PSS4_DEFAULTS]);

  const toggleChip = (list, setList) => (chip) => {
    setList(prev => prev.includes(chip) ? prev.filter(c => c !== chip) : [...prev, chip]);
  };
  const toggleSingle = (setList) => (chip) => setList([chip]);

  const phq9Total = phq9.reduce((a, b) => a + b, 0);
  const gad7Total = gad7.reduce((a, b) => a + b, 0);
  const moodInfo = MOOD_DATA[mood - 1] || MOOD_DATA[4];

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* HEADER */}
      <View style={[st.header, {paddingTop: insets.top + vs(6)}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={st.headerTitle}>Stress & Mood</AppText>
            <AppText variant="caption" style={st.headerSub}>Thu, 28 Mar - Daily check-in</AppText>
          </View>
        </View>
        <AppText variant="header" color={Colors.white} style={{fontSize: ms(20), marginTop: vs(10), marginBottom: vs(2)}}>How are you</AppText>
        <AppText variant="header" color={Colors.paleGreen} style={{fontSize: ms(20), fontStyle: 'italic', marginBottom: vs(4)}}>feeling today?</AppText>
        <AppText variant="small" color="rgba(255,255,255,0.45)" style={{marginBottom: vs(16)}}>This is a safe space. Everything you share stays private.</AppText>

        {/* Mood slider */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(8)}}>
          <AppText variant="small" color="rgba(255,255,255,0.5)" style={{fontWeight: '600'}}>Mood right now</AppText>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
            <Icon family="Ionicons" name={moodInfo.emoji} size={ms(18)} color={moodInfo.color} />
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>{moodInfo.label} ({mood}/10)</AppText>
          </View>
        </View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
          <TouchableOpacity style={st.moodAdjBtn} onPress={() => setMood(prev => Math.max(1, prev - 1))} activeOpacity={0.7}>
            <Icon family="Ionicons" name="remove" size={ms(16)} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <View style={st.moodTrack}>
              <View style={[st.moodFill, {width: `${((mood - 1) / 9) * 100}%`}]} />
              <View style={[st.moodThumb, {left: `${((mood - 1) / 9) * 100}%`}]} />
            </View>
          </View>
          <TouchableOpacity style={st.moodAdjBtn} onPress={() => setMood(prev => Math.min(10, prev + 1))} activeOpacity={0.7}>
            <Icon family="Ionicons" name="add" size={ms(16)} color={Colors.white} />
          </TouchableOpacity>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(6), paddingHorizontal: s(36)}}>
          {['Very low', 'Low', 'Neutral', 'Good', 'Great'].map(l => (
            <AppText key={l} variant="subtext" color="rgba(255,255,255,0.4)" style={{fontSize: ms(8)}}>{l}</AppText>
          ))}
        </View>
      </View>

      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: s(13), paddingBottom: vs(120)}} showsVerticalScrollIndicator={false}>

        {/* EMOTIONS */}
        <Section title="Emotions present \u00B7 select all that apply" />
        <AppText variant="subtext" color={Colors.textSecondary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(5)}}>Depressive feelings</AppText>
        <ChipGroup chips={DEP_CHIPS} selected={depChips} onToggle={toggleChip(depChips, setDepChips)} />
        <View style={{height: vs(10)}} />
        <AppText variant="subtext" color={Colors.amberDark} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(5)}}>Anxiety & worry</AppText>
        <ChipGroup chips={ANX_CHIPS} selected={anxChips} onToggle={toggleChip(anxChips, setAnxChips)} />
        <View style={{height: vs(10)}} />
        <AppText variant="subtext" color={Colors.redDark} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(5)}}>Agitation</AppText>
        <ChipGroup chips={AGI_CHIPS} selected={agiChips} onToggle={toggleChip(agiChips, setAgiChips)} />
        <View style={{height: vs(10)}} />
        <AppText variant="subtext" color={Colors.tealText} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(5)}}>Positive states</AppText>
        <ChipGroup chips={POS_CHIPS} selected={posChips} onToggle={toggleChip(posChips, setPosChips)} />

        {/* ENERGY & MOTIVATION */}
        <Section title="Energy & motivation" />
        <View style={st.wcard}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(10)}}>
            <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '600'}}>Energy level</AppText>
            <AppText variant="bodyBold" color={Colors.primary} style={{fontSize: ms(13)}}>{energy} / 10</AppText>
          </View>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
            <TouchableOpacity style={st.ctrlBtn} onPress={() => setEnergy(prev => Math.max(0, prev - 1))} activeOpacity={0.7}>
              <Icon family="Ionicons" name="remove" size={ms(16)} color={Colors.primary} />
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <View style={st.energyTrack}>
                <View style={[st.energyFill, {width: `${energy * 10}%`}]} />
              </View>
            </View>
            <TouchableOpacity style={st.ctrlBtn} onPress={() => setEnergy(prev => Math.min(10, prev + 1))} activeOpacity={0.7}>
              <Icon family="Ionicons" name="add" size={ms(16)} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(4), paddingHorizontal: s(36)}}>
            <AppText variant="subtext" color={Colors.textTertiary}>Drained</AppText>
            <AppText variant="subtext" color={Colors.textTertiary}>Full energy</AppText>
          </View>
        </View>

        <View style={st.wcard}>
          <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '600', marginBottom: vs(4)}}>Did anything bring you joy or pleasure today?</AppText>
          <AppText variant="subtext" color={Colors.textTertiary} style={{fontStyle: 'italic', marginBottom: vs(8)}}>Anhedonia is an early and key indicator of depression.</AppText>
          <View style={{flexDirection: 'row', gap: s(7)}}>
            {[{k: 'yes', icon: 'happy-outline', label: 'Yes'}, {k: 'partly', icon: 'help-circle-outline', label: 'Partially'}, {k: 'no', icon: 'sad-outline', label: 'No'}].map(j => (
              <TouchableOpacity key={j.k} style={[st.joyBtn, joy === j.k && st.joyBtnOn]} onPress={() => setJoy(j.k)} activeOpacity={0.7}>
                <Icon family="Ionicons" name={j.icon} size={ms(22)} color={joy === j.k ? Colors.primary : Colors.textTertiary} />
                <AppText variant="caption" color={joy === j.k ? Colors.primary : Colors.textSecondary} style={{fontWeight: '700', marginTop: vs(4)}}>{j.label}</AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* SLEEP */}
        <Section title="Sleep last night" />
        <View style={st.wcard}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(10)}}>
            <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '600'}}>Hours slept</AppText>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
              <TouchableOpacity style={st.ctrlBtn} onPress={() => setSleep(prev => Math.max(0, Math.round((prev - 0.5) * 2) / 2))} activeOpacity={0.7}>
                <Icon family="Ionicons" name="remove" size={ms(16)} color={Colors.primary} />
              </TouchableOpacity>
              <View style={{alignItems: 'center', minWidth: ms(50)}}>
                <AppText variant="header" color={Colors.textPrimary} style={{fontWeight: '800', fontSize: ms(20)}}>{sleep}</AppText>
                <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(-2)}}>hrs</AppText>
              </View>
              <TouchableOpacity style={st.ctrlBtn} onPress={() => setSleep(prev => Math.min(14, Math.round((prev + 0.5) * 2) / 2))} activeOpacity={0.7}>
                <Icon family="Ionicons" name="add" size={ms(16)} color={Colors.primary} />
              </TouchableOpacity>
            </View>
          </View>
          <AppText variant="small" color={Colors.textSecondary} style={{fontWeight: '700', marginBottom: vs(6)}}>Sleep quality</AppText>
          <ChipGroup chips={SLEEP_CHIPS} selected={sleepChips} onToggle={toggleChip(sleepChips, setSleepChips)} />
        </View>

        {/* APPETITE */}
        <Section title="Appetite & eating" />
        <ChipGroup chips={APPETITE_CHIPS} selected={appetite} onToggle={toggleSingle(setAppetite)} />

        {/* PHYSICAL SYMPTOMS */}
        <Section title="Physical symptoms today" />
        <AppText variant="subtext" color={Colors.textTertiary} style={{fontStyle: 'italic', marginBottom: vs(8)}}>Depression and stress frequently manifest as physical complaints.</AppText>
        <ChipGroup chips={PHYSICAL_CHIPS} selected={physical} onToggle={toggleChip(physical, setPhysical)} />

        {/* COGNITION */}
        <Section title="Mind & thinking" />
        <AppText variant="subtext" color={Colors.textTertiary} style={{fontStyle: 'italic', marginBottom: vs(8)}}>Cognitive symptoms are core diagnostic criteria for depression and anxiety.</AppText>
        <ChipGroup chips={COGNITION_CHIPS} selected={cognition} onToggle={toggleChip(cognition, setCognition)} />

        {/* SOCIAL & ACTIVITY */}
        <Section title="Social & daily functioning" />
        <View style={st.wcard}>
          <AppText variant="small" color={Colors.textSecondary} style={{fontWeight: '700', marginBottom: vs(6)}}>Social connection today</AppText>
          <ChipGroup chips={SOCIAL_CHIPS} selected={social} onToggle={toggleChip(social, setSocial)} />
        </View>
        <View style={st.wcard}>
          <AppText variant="small" color={Colors.textSecondary} style={{fontWeight: '700', marginBottom: vs(6)}}>Activities today</AppText>
          <ChipGroup chips={ACTIVITY_CHIPS} selected={activities} onToggle={toggleChip(activities, setActivities)} />
        </View>

        {/* STRESSORS */}
        <Section title="Today's stressors & triggers" />
        <ChipGroup chips={STRESSOR_CHIPS} selected={stressors} onToggle={toggleChip(stressors, setStressors)} />

        {/* COPING */}
        <Section title="Coping & self-care used" />
        <ChipGroup chips={COPING_CHIPS} selected={coping} onToggle={toggleChip(coping, setCoping)} />

        {/* PHQ-9 */}
        <Section title="Clinical screening \u00B7 PHQ-9" />
        <View style={st.infoBox}>
          <Icon family="Ionicons" name="clipboard-outline" size={ms(16)} color={Colors.tealText} />
          <AppText variant="small" color={Colors.tealText} style={{flex: 1, lineHeight: ms(16)}}>Over the <AppText variant="small" color={Colors.tealText} style={{fontWeight: '700'}}>last 2 weeks</AppText>, how often have you been bothered by the following? (PHQ-9 {'\u00B7'} Standard depression screening tool)</AppText>
        </View>
        {PHQ9_ITEMS.map((q, i) => (
          <ScreeningItem key={i} question={q} value={phq9[i]} options={PHQ_OPTS} isLast={i === 8}
            onChange={(v) => setPhq9(prev => { const n = [...prev]; n[i] = v; return n; })} />
        ))}

        {/* GAD-7 */}
        <Section title="Anxiety screening \u00B7 GAD-7" />
        {GAD7_ITEMS.map((q, i) => (
          <ScreeningItem key={i} question={q} value={gad7[i]} options={PHQ_OPTS}
            onChange={(v) => setGad7(prev => { const n = [...prev]; n[i] = v; return n; })} />
        ))}

        {/* SAFETY CHECK */}
        <Section title="Safety check" />
        <View style={st.safetyCard}>
          <AppText variant="bodyBold" color={Colors.white} style={{marginBottom: vs(4)}}>How are you feeling about your safety right now?</AppText>
          <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginBottom: vs(12), lineHeight: ms(16)}}>This is asked in care, not to alarm. Your response stays private.</AppText>
          {[
            {k: 'safe', icon: 'checkmark-circle-outline', label: 'I am safe', color: Colors.accent},
            {k: 'struggle', icon: 'alert-circle-outline', label: 'I am struggling with dark thoughts', color: '#F97316'},
            {k: 'crisis', icon: 'call-outline', label: 'I need support right now', color: Colors.red},
          ].map(s2 => (
            <TouchableOpacity key={s2.k} style={[st.safetyBtn, safety === s2.k && {backgroundColor: s2.color, borderColor: s2.color}]} onPress={() => setSafety(s2.k)} activeOpacity={0.7}>
              <Icon family="Ionicons" name={s2.icon} size={ms(16)} color={safety === s2.k ? Colors.white : 'rgba(255,255,255,0.7)'} />
              <AppText variant="caption" color={safety === s2.k ? Colors.white : 'rgba(255,255,255,0.7)'} style={{fontWeight: '700', marginLeft: s(8)}}>{s2.label}</AppText>
            </TouchableOpacity>
          ))}
          {(safety === 'struggle' || safety === 'crisis') && (
            <View style={{marginTop: vs(10), backgroundColor: Colors.red, borderRadius: ms(12), padding: ms(12)}}>
              <AppText variant="bodyBold" color={Colors.white} style={{marginBottom: vs(8)}}>You are not alone. Please reach out now.</AppText>
              {[{name: 'iCall \u00B7 TISS Mumbai', num: '9152987821 \u00B7 Free, confidential'}, {name: 'Vandrevala Foundation', num: '1860-2662-345 \u00B7 24\u00D77'}].map((r, i) => (
                <View key={i} style={{backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: ms(10), padding: ms(10), marginBottom: vs(6), flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
                  <Icon family="Ionicons" name="call-outline" size={ms(18)} color={Colors.white} />
                  <View><AppText variant="bodyBold" color={Colors.white}>{r.name}</AppText><AppText variant="small" color="rgba(255,255,255,0.7)">{r.num}</AppText></View>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* NOTES */}
        <Section title="Your thoughts \u00B7 optional" />
        <TextInput style={st.noteInput} placeholder="Anything on your mind today? No rules here \u2014 write freely." placeholderTextColor={Colors.textTertiary} multiline value={notes} onChangeText={setNotes} />

        {/* PSS-4 */}
        <Section title="Perceived stress \u00B7 PSS-4" />
        <View style={[st.infoBox, {backgroundColor: Colors.amberBg, borderColor: '#FDDCB5'}]}>
          <AppText variant="small" color={Colors.amberDark} style={{lineHeight: ms(16)}}>Perceived Stress Scale (Cohen et al.) {'\u2014'} measures how much situations in your life are appraised as stressful. Scored 0{'\u2013'}16.</AppText>
        </View>
        {PSS4_ITEMS.map((q, i) => (
          <ScreeningItem key={i} question={q} value={pss4[i]} options={PSS_OPTS}
            onChange={(v) => setPss4(prev => { const n = [...prev]; n[i] = v; return n; })} />
        ))}

      </ScrollView>

      {/* BOTTOM BAR */}
      <View style={st.bottomBar}>
        <TouchableOpacity style={st.savePrimary} activeOpacity={0.8}>
          <Icon family="Ionicons" name="save-outline" size={ms(20)} color={Colors.white} />
          <AppText variant="body" color={Colors.white} style={{fontWeight: '700', fontSize: ms(15)}}>Save log</AppText>
        </TouchableOpacity>
        <View style={st.saveSecRow}>
          <TouchableOpacity style={st.saveSecBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Records', {tab: 'healthlogs', logFilter: 'mood'})}>
            <Icon family="Ionicons" name="document-text-outline" size={ms(14)} color={Colors.white} />
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '600'}}>Records</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={st.saveSecBtn} activeOpacity={0.7} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'stressMood', initialTab: 'stressMoodIntel'})}>
            <Icon family="Ionicons" name="bulb-outline" size={ms(14)} color={Colors.white} />
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '600'}}>Ayu Intel</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(14)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(2)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(11)},
  moodTrack: {height: ms(8), borderRadius: ms(4), backgroundColor: 'rgba(255,255,255,0.15)', position: 'relative', overflow: 'visible'},
  moodFill: {height: '100%', borderRadius: ms(4), backgroundColor: Colors.accent},
  moodThumb: {position: 'absolute', top: -ms(8), width: ms(24), height: ms(24), borderRadius: ms(12), backgroundColor: Colors.white, borderWidth: 3, borderColor: Colors.accent, marginLeft: -ms(12), elevation: 4, shadowColor: '#000', shadowOffset: {width: 0, height: 2}, shadowOpacity: 0.3, shadowRadius: 5},
  moodAdjBtn: {width: ms(32), height: ms(32), borderRadius: ms(16), backgroundColor: 'rgba(255,255,255,0.18)', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)', alignItems: 'center', justifyContent: 'center'},
  ctrlBtn: {width: ms(34), height: ms(34), borderRadius: ms(17), backgroundColor: Colors.tealBg, borderWidth: 1, borderColor: '#dde8e2', alignItems: 'center', justifyContent: 'center'},
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(18), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'},
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(6), marginBottom: vs(4)},
  chip: {paddingHorizontal: s(12), paddingVertical: vs(7), borderRadius: ms(20), borderWidth: 1, borderColor: '#dde8e2', backgroundColor: Colors.white},
  chipOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  wcard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 1, borderColor: '#dde8e2', padding: ms(13), marginBottom: vs(8)},
  energyTrack: {height: ms(12), borderRadius: ms(6), backgroundColor: '#e5e7eb', overflow: 'hidden', marginBottom: vs(4)},
  energyFill: {height: '100%', borderRadius: ms(6), backgroundColor: Colors.accent},
  joyBtn: {flex: 1, borderRadius: ms(12), borderWidth: 1, borderColor: '#dde8e2', paddingVertical: vs(11), alignItems: 'center', backgroundColor: Colors.white},
  joyBtnOn: {borderColor: Colors.primary, backgroundColor: Colors.tealBg},
  phqItem: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 1, borderColor: '#dde8e2', padding: ms(11), marginBottom: vs(6)},
  phqOpt: {flex: 1, borderRadius: ms(8), borderWidth: 1, borderColor: '#dde8e2', paddingVertical: vs(7), paddingHorizontal: s(4), alignItems: 'center', backgroundColor: Colors.background},
  phqOptOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  infoBox: {backgroundColor: Colors.tealBg, borderRadius: ms(12), borderWidth: 1, borderColor: Colors.paleGreen, padding: ms(10), marginBottom: vs(10), flexDirection: 'row', alignItems: 'flex-start', gap: s(9)},
  safetyCard: {backgroundColor: Colors.primary, borderRadius: ms(16), padding: ms(16), marginBottom: vs(8)},
  safetyBtn: {borderRadius: ms(11), paddingVertical: vs(12), paddingHorizontal: s(14), borderWidth: 1.5, borderColor: 'rgba(255,255,255,0.2)', flexDirection: 'row', alignItems: 'center', marginBottom: vs(7)},
  noteInput: {width: '100%', borderWidth: 1, borderColor: '#dde8e2', borderRadius: ms(12), padding: ms(12), backgroundColor: Colors.white, minHeight: vs(80), fontSize: ms(12), color: Colors.textPrimary, textAlignVertical: 'top', lineHeight: ms(18)},
  bottomBar: {position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, borderTopWidth: 0.5, borderTopColor: '#dde8e2', paddingHorizontal: s(13), paddingTop: vs(10), paddingBottom: Platform.OS === 'ios' ? vs(28) : vs(12)},
  savePrimary: {backgroundColor: Colors.primary, borderRadius: ms(14), paddingVertical: vs(14), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(8)},
  saveSecRow: {flexDirection: 'row', gap: s(8), marginTop: vs(8)},
  saveSecBtn: {flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(6), backgroundColor: Colors.accent, borderRadius: ms(11), paddingVertical: vs(10), borderWidth: 0.5, borderColor: Colors.accent},
});

export default MoodLogScreen;
