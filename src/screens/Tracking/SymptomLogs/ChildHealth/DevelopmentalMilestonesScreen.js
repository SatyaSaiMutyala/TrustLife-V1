import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Platform} from 'react-native';
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
  {key: 'log', label: 'Milestones'},
  {key: 'sdq', label: 'SDQ screen'},
  {key: 'flags', label: 'Red flags'},
  {key: 'ayu', label: 'Ayu'},
];

const MILESTONE_GROUPS = [
  {
    title: 'Language & communication',
    progress: '5/5\u2009\u2713',
    progressColor: Colors.tealText,
    monitorTone: 'purple',
    items: [
      {id: 'lang1', name: 'Speaks clearly \u00b7 understood by all adults', sub: 'No articulation errors expected by age 8'},
      {id: 'lang2', name: 'Reads age-appropriate books independently', sub: 'Grade 3-4 reading fluency expected at 9y'},
      {id: 'lang3', name: 'Understands and follows multi-step instructions', sub: '3-4 step sequences without prompting'},
      {id: 'lang4', name: 'Can write short paragraphs with correct sentences', sub: 'Uses punctuation, capital letters appropriately'},
      {id: 'lang5', name: 'Bilingual or multilingual communication', sub: 'Telugu + Hindi + English - expected for Hyderabad child'},
    ],
  },
  {
    title: 'Cognitive & academic',
    progress: '4/5 \u00b7 1 monitoring',
    progressColor: '#6B21A8',
    monitorTone: 'purple',
    items: [
      {id: 'cog1', name: 'Can do addition, subtraction, multiplication', sub: 'Multiplication tables expected by end of Grade 3'},
      {id: 'cog2', name: 'Understands cause and effect \u00b7 logical reasoning', sub: "Can explain 'why' something happens"},
      {id: 'cog3', name: 'Remembers school material \u00b7 homework independent', sub: 'Working memory expected to hold 5-6 items'},
      {id: 'cog4', name: 'Sustained attention \u00b7 20+ minutes without redirection', sub: 'Monitoring - occasional difficulty reported by teacher'},
      {id: 'cog5', name: 'Plans and organises multi-step tasks', sub: 'Executive function: making a list, following a schedule'},
    ],
  },
  {
    title: 'Motor & physical',
    progress: '6/6\u2009\u2713',
    progressColor: Colors.tealText,
    monitorTone: 'purple',
    items: [
      {id: 'motor1', name: 'Rides bicycle confidently', sub: 'Balance, coordination, speed adjustment'},
      {id: 'motor2', name: 'Catches and throws a ball accurately', sub: 'Eye-hand coordination \u00b7 cricket/throw-catch'},
      {id: 'motor3', name: 'Neat handwriting \u00b7 pencil control', sub: 'Fine motor control adequate for school work'},
      {id: 'motor4', name: 'Independent self-care (dressing, grooming, hygiene)', sub: 'Fully independent at 9y \u00b7 no prompting needed'},
      {id: 'motor5', name: 'Participates in team sports or group games', sub: 'Understands rules, takes turns, supports teammates'},
      {id: 'motor6', name: 'Safe on stairs, uneven surfaces, playground equipment', sub: 'Gross motor confidence and safety'},
    ],
  },
  {
    title: 'Social & emotional',
    progress: '4/5 \u00b7 1 monitoring',
    progressColor: Colors.amberDark,
    monitorTone: 'amber',
    items: [
      {id: 'soc1', name: 'Has 2+ stable friendships with peers', sub: 'Friendship quality is the key indicator, not quantity'},
      {id: 'soc2', name: 'Resolves peer conflicts without adult intervention', sub: 'Negotiation, compromise, moving on'},
      {id: 'soc3', name: 'Shows empathy and perspective-taking', sub: "Understands others' feelings, offers comfort"},
      {id: 'soc4', name: 'Manages frustration and disappointment appropriately', sub: 'Age 9 monitoring - occasional outbursts at home'},
      {id: 'soc5', name: 'Demonstrates growing independence and self-confidence', sub: 'Makes decisions, initiates activities, self-advocates'},
    ],
  },
];

const SDQ_SECTIONS = [
  {
    title: 'Emotional symptoms subscale',
    questions: [
      {id: 'emo1', q: 'Complains of headaches, stomach-aches, or sickness'},
      {id: 'emo2', q: 'Many worries, often seems worried'},
      {id: 'emo3', q: 'Often unhappy, downhearted, or tearful'},
    ],
  },
  {
    title: 'Conduct problems subscale',
    questions: [
      {id: 'con1', q: 'Often has temper tantrums or hot tempers'},
      {id: 'con2', q: 'Generally obedient, usually does what adults request'},
    ],
  },
  {
    title: 'Hyperactivity / inattention subscale',
    questions: [
      {id: 'hyp1', q: 'Restless, overactive, cannot stay still for long'},
      {id: 'hyp2', q: 'Constantly fidgeting or squirming'},
      {id: 'hyp3', q: 'Easily distracted, concentration wanders'},
      {id: 'hyp4', q: 'Thinks things out before acting'},
    ],
  },
  {
    title: 'Peer problems subscale',
    questions: [
      {id: 'peer1', q: 'Has at least one good friend'},
      {id: 'peer2', q: 'Picked on or bullied by other children'},
    ],
  },
  {
    title: 'Prosocial subscale',
    questions: [
      {id: 'pro1', q: 'Kind to younger children'},
      {id: 'pro2', q: 'Helpful if someone is hurt, upset, or feeling ill'},
    ],
  },
];

const SDQ_OPTIONS = [
  {key: 'nottrue', label: 'Not true'},
  {key: 'somewhat', label: 'Somewhat'},
  {key: 'certainly', label: 'Certainly true'},
];

const GLOBAL_RED_FLAGS = [
  'Regression in language skills - stops using words or sentences they previously used',
  'No eye contact or minimal response to name - at any age beyond 12 months',
  'No interest in peers or imaginative play by age 3',
  'Loss of previously acquired motor skills - e.g., stops walking independently',
  'Cannot read single words by age 7 - dyslexia screening warranted',
  'Persistent sadness, withdrawal, or self-harm in a school-age child',
  'Staring episodes, jerking movements, or brief lapses in consciousness - rule out absence seizures',
];

const AGE_RED_FLAGS = [
  {main: 'Reading significantly below grade level with no identified cause', sub: 'Rule out dyslexia (visual tracking), hearing loss, vision problems before assuming cognitive delay'},
  {main: 'Cannot perform basic multiplication or addition at age 9', sub: 'Dyscalculia or specific learning disorder - refer to educational psychologist'},
  {main: 'Explosive anger episodes several times per week that interrupt family or school', sub: 'DMDD (Disruptive Mood Dysregulation Disorder) - distinguish from ADHD and ODD'},
  {main: 'Chronic school avoidance - refusing to attend more than 2 days per week', sub: 'Rule out bullying, anxiety disorder, undiagnosed learning difficulty'},
  {main: 'Frequent unexplained headaches or abdominal pain with no medical cause', sub: 'Somatic anxiety is common in school-age children; also rule out vision problems causing headaches'},
];

const KPI_CELLS = [
  {label: 'Motor', status: 'Normal', detail: '6/6 \u2713', color: Colors.tealText},
  {label: 'Language', status: 'Normal', detail: '5/5 \u2713', color: Colors.tealText},
  {label: 'Attention', status: 'Monitor', detail: 'SDQ borderline', color: Colors.amberDark},
  {label: 'Social', status: 'Normal', detail: '4/5 \u2713', color: Colors.tealText},
];

const AYU_INSIGHTS = [
  {dot: Colors.amberDark, title: '3 SDQ hyperactivity items scoring \u2018somewhat true\u2019', body: " places Aarav at the borderline threshold. This is not diagnostic of ADHD - it is a signal to monitor. ADHD diagnosis requires symptoms in at least 2 settings (home AND school), onset before age 12, and functional impairment - none of these thresholds have been met."},
  {dot: '#2A5FA0', title: 'Contextual factors to rule out first:', body: " sleep deficiency (most common cause of inattention in children, especially if sleeping <9 hours), screen time pattern, vision problems (uncorrected hyperopia causes attention difficulties in class), anxiety, and family stress. Aarav's household stress is elevated - consider whether this is a contributing factor."},
  {dot: Colors.tealText, title: 'Strengths profile is excellent.', body: ' Strong language, motor, social, and academic functioning across all domains means any attention difficulties are circumscribed and not causing significant functional impairment. This is an important protective factor.'},
  {dot: Colors.tealText, title: 'Next step:', body: " Request teacher-completed SDQ (Aarav's class teacher at school). Cross-setting comparison is the key differentiator between situational inattention and ADHD. TrustLife can generate a teacher report form to share via the school nurse."},
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const MilestoneGroup = ({group, milestoneStates, onToggle}) => (
  <View style={{marginBottom: vs(14)}}>
    <View style={st.groupHeader}>
      <AppText variant="bodyBold" color={Colors.white}>{group.title}</AppText>
      <View style={st.groupProgress}>
        <AppText variant="subtext" color={Colors.white} style={{fontWeight: '700'}}>{group.progress}</AppText>
      </View>
    </View>
    {group.items.map((item, i) => {
      const isLast = i === group.items.length - 1;
      const state = milestoneStates[item.id];
      const isMonitoring = state === 'monitoring';
      const monitorAmber = isMonitoring && group.monitorTone === 'amber';
      const monitorPurple = isMonitoring && group.monitorTone !== 'amber';
      const monitor = monitorAmber || monitorPurple;
      const bgColor = monitorAmber ? Colors.amberBg : monitorPurple ? '#F5F0FF' : Colors.white;
      return (
        <TouchableOpacity
          key={item.id}
          activeOpacity={0.7}
          onPress={() => onToggle(item.id)}
          style={[
            st.milestoneRow,
            {backgroundColor: bgColor},
            isLast && {borderBottomLeftRadius: ms(12), borderBottomRightRadius: ms(12)},
          ]}>
          <View
            style={[
              st.milestoneIcon,
              {
                backgroundColor: monitorAmber
                  ? '#FDDCB5'
                  : monitorPurple
                  ? '#E9D5FF'
                  : Colors.tealBg,
              },
            ]}>
            <Icon
              family="Ionicons"
              name={monitor ? 'help' : 'checkmark'}
              size={ms(14)}
              color={monitorAmber ? Colors.amberDark : monitorPurple ? '#6B21A8' : Colors.tealText}
            />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', marginBottom: vs(2)}}>{item.name}</AppText>
            <AppText variant="subtext" color={Colors.textSecondary} style={{lineHeight: ms(13)}}>{item.sub}</AppText>
          </View>
          <View
            style={[
              st.statusPill,
              {
                backgroundColor: monitorAmber
                  ? '#FDDCB5'
                  : monitorPurple
                  ? '#E9D5FF'
                  : Colors.tealBg,
              },
            ]}>
            <AppText
              variant="small"
              color={monitorAmber ? Colors.amberDark : monitorPurple ? '#6B21A8' : Colors.tealText}
              style={{fontWeight: '700'}}>
              {monitor ? 'Monitoring' : 'Done'}
            </AppText>
          </View>
        </TouchableOpacity>
      );
    })}
  </View>
);

const SDQQuestion = ({id, q, selected, onSelect}) => (
  <View style={st.sdqCard}>
    <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', marginBottom: vs(8)}}>{q}</AppText>
    <View style={{flexDirection: 'row', gap: s(6)}}>
      {SDQ_OPTIONS.map((opt) => {
        const isSelected = opt.key === selected;
        return (
          <TouchableOpacity
            key={opt.key}
            activeOpacity={0.7}
            onPress={() => onSelect(id, opt.key)}
            style={[
              st.sdqBtn,
              isSelected && {
                backgroundColor: Colors.tealBg,
                borderColor: Colors.paleGreen,
              },
            ]}>
            <AppText
              variant="small"
              color={isSelected ? Colors.tealText : Colors.textSecondary}
              style={{fontWeight: isSelected ? '700' : '500'}}>
              {opt.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const DevelopmentalMilestonesScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('log');
  const [milestoneStates, setMilestoneStates] = useState({
    lang1: 'done', lang2: 'done', lang3: 'done', lang4: 'done', lang5: 'done',
    cog1: 'done', cog2: 'done', cog3: 'done', cog4: 'monitoring', cog5: 'done',
    motor1: 'done', motor2: 'done', motor3: 'done', motor4: 'done', motor5: 'done', motor6: 'done',
    soc1: 'done', soc2: 'done', soc3: 'done', soc4: 'monitoring', soc5: 'done',
  });

  const toggleMilestone = (id) => {
    setMilestoneStates(prev => ({
      ...prev,
      [id]: prev[id] === 'done' ? 'monitoring' : 'done',
    }));
  };

  const [sdqAnswers, setSdqAnswers] = useState({
    emo1: null,
    emo2: 'somewhat',
    emo3: null,
    con1: 'somewhat',
    con2: 'certainly',
    hyp1: 'somewhat',
    hyp2: 'somewhat',
    hyp3: 'somewhat',
    hyp4: 'certainly',
    peer1: 'certainly',
    peer2: 'nottrue',
    pro1: 'certainly',
    pro2: 'certainly',
  });

  const selectSdqAnswer = (id, key) => {
    setSdqAnswers(prev => ({
      ...prev,
      [id]: prev[id] === key ? null : key,
    }));
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Fixed Header ── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topRow}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
            <TouchableOpacity
              style={st.backBtn}
              onPress={() => navigation.goBack()}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
            </TouchableOpacity>
            <AppText variant="body" color="rgba(255,255,255,0.85)">Developmental milestones</AppText>
          </View>
          <View style={st.savePill}>
            <AppText variant="subtext" color={Colors.white} style={{fontWeight: '700'}}>Save \u2713</AppText>
          </View>
        </View>

        <AppText
          variant="small"
          color="rgba(255,255,255,0.55)"
          style={{textTransform: 'uppercase', letterSpacing: 0.6, marginTop: vs(6), marginBottom: vs(2)}}>
          Aarav \u00b7 9y 2m \u00b7 Milestones
        </AppText>
        <AppText variant="screenName" color={Colors.white} style={{marginBottom: vs(2)}}>
          Developmental milestones
        </AppText>
        <AppText variant="subtext" color="rgba(255,255,255,0.55)" style={{marginBottom: vs(12)}}>
          ASQ-3 (0-5.5y) \u00b7 SDQ (6-17y) \u00b7 IAP guidelines
        </AppText>

        {/* Tab bar */}
        <View style={st.tabBar}>
          {TABS.map((tab) => {
            const isActive = tab.key === activeTab;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[st.tabPill, isActive && st.tabPillActive]}
                activeOpacity={0.7}
                onPress={() => setActiveTab(tab.key)}>
                <AppText
                  variant="subtext"
                  color={isActive ? Colors.primary : 'rgba(255,255,255,0.8)'}
                  style={{fontWeight: '700'}}>
                  {tab.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>
        {activeTab === 'log' && (
          <>
            <View style={st.greenInfoBox}>
              <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={Colors.tealText} />
              <AppText variant="caption" color={Colors.tealText} style={{flex: 1, lineHeight: ms(17)}}>
                Aarav is 9 years 2 months. At this age, assessment moves from reflex-based milestones to cognitive, social, and academic function. Tap each item to record your observation.
              </AppText>
            </View>

            {MILESTONE_GROUPS.map((group, i) => (
              <MilestoneGroup
                key={i}
                group={group}
                milestoneStates={milestoneStates}
                onToggle={toggleMilestone}
              />
            ))}
          </>
        )}

        {activeTab === 'sdq' && (
          <>
            <View style={st.blueInfoBox}>
              <Icon family="Ionicons" name="clipboard-outline" size={ms(16)} color="#2A5FA0" />
              <AppText variant="caption" color="#2A5FA0" style={{flex: 1, lineHeight: ms(17)}}>
                Strengths and Difficulties Questionnaire (SDQ). The SDQ is validated for ages 4-17 and is the gold-standard school-age screening tool used by IAP. 25 questions across 5 subscales. Takes 5 minutes. Tap each question to answer.
              </AppText>
            </View>

            {SDQ_SECTIONS.map((section, i) => (
              <View key={i} style={{marginBottom: vs(14)}}>
                <AppText
                  variant="subtext"
                  color={Colors.textSecondary}
                  style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(8)}}>
                  {section.title}
                </AppText>
                {section.questions.map((q, j) => (
                  <SDQQuestion
                    key={q.id}
                    id={q.id}
                    q={q.q}
                    selected={sdqAnswers[q.id]}
                    onSelect={selectSdqAnswer}
                  />
                ))}
              </View>
            ))}

            <View style={st.scoreBox}>
              <AppText variant="bodyBold" color={Colors.tealText} style={{marginBottom: vs(6)}}>
                SDQ Preliminary score \u00b7 Borderline attention
              </AppText>
              <AppText variant="caption" color={Colors.tealText} style={{lineHeight: ms(17)}}>
                3 hyperactivity items scored 'Somewhat true' - borderline hyperactivity subscale (score 5/10). Emotional and peer subscales are normal.{' '}
                <AppText style={{fontWeight: '700'}}>Recommendation:</AppText> Observe for 4 weeks and re-screen. If score unchanged, discuss with a paediatric psychologist - not ADHD medication at this stage.
              </AppText>
            </View>
          </>
        )}

        {activeTab === 'flags' && (
          <>
            <View style={st.redAlert}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(10)}}>
                <Icon family="Ionicons" name="warning-outline" size={ms(18)} color="#B91C1C" />
                <AppText variant="bodyBold" color="#B91C1C" style={{flex: 1}}>
                  Developmental red flags \u00b7 seek paediatric assessment
                </AppText>
              </View>
              {GLOBAL_RED_FLAGS.map((flag, i) => (
                <View key={i} style={st.redRow}>
                  <Icon family="Ionicons" name="alert-circle" size={ms(14)} color="#B91C1C" />
                  <AppText variant="caption" color="#7F1D1D" style={{flex: 1, lineHeight: ms(17)}}>{flag}</AppText>
                </View>
              ))}
            </View>

            <AppText
              variant="subtext"
              color={Colors.textSecondary}
              style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: vs(6), marginBottom: vs(8)}}>
              Age-specific red flags \u00b7 9 years
            </AppText>

            <View style={st.card}>
              {AGE_RED_FLAGS.map((flag, i) => (
                <View
                  key={i}
                  style={[st.ageFlagRow, i === AGE_RED_FLAGS.length - 1 && {borderBottomWidth: 0}]}>
                  <Icon family="Ionicons" name="flag-outline" size={ms(16)} color={Colors.amberDark} />
                  <View style={{flex: 1}}>
                    <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', marginBottom: vs(2)}}>{flag.main}</AppText>
                    <AppText variant="subtext" color={Colors.textSecondary} style={{lineHeight: ms(13)}}>{flag.sub}</AppText>
                  </View>
                </View>
              ))}
            </View>

            <AppText
              variant="subtext"
              color={Colors.textSecondary}
              style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginTop: vs(10), marginBottom: vs(8)}}>
              Hyderabad referral pathways
            </AppText>

            <View style={st.tealInsight}>
              <Icon family="Ionicons" name="medkit-outline" size={ms(16)} color={Colors.tealText} />
              <View style={{flex: 1}}>
                <AppText variant="caption" color={Colors.tealText} style={{lineHeight: ms(17)}}>
                  <AppText style={{fontWeight: '700'}}>NIMHANS Hyderabad</AppText> - Child & Adolescent Psychiatry. Developmental assessments for autism, ADHD, specific learning disorders. Government rates. Long wait - book early.
                </AppText>
                <AppText variant="caption" color={Colors.tealText} style={{lineHeight: ms(17), marginTop: vs(6)}}>
                  <AppText style={{fontWeight: '700'}}>KIMS Hospital</AppText> - Dr. Preethi Rao (paediatrics) can do SDQ scoring and refer directly to developmental paediatrician.
                </AppText>
                <AppText variant="caption" color={Colors.tealText} style={{lineHeight: ms(17), marginTop: vs(6)}}>
                  <AppText style={{fontWeight: '700'}}>Apollo Children's Hospital</AppText> - Child development unit with multidisciplinary team (paediatrician + psychologist + speech therapist).
                </AppText>
              </View>
            </View>
          </>
        )}

        {activeTab === 'ayu' && (
          <>
            <View style={st.ayuHeader}>
              <AppText
                variant="small"
                color="rgba(255,255,255,0.55)"
                style={{textTransform: 'uppercase', letterSpacing: 0.6, marginBottom: vs(2)}}>
                Ayu Intel \u00b7 Development
              </AppText>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(12)}}>
                <AppText variant="screenName" color={Colors.white}>Developmental intelligence</AppText>
                <Icon family="Ionicons" name="sparkles" size={ms(18)} color={Colors.accent} />
              </View>

              <View style={st.kpiStrip}>
                {KPI_CELLS.map((cell, i) => (
                  <View key={i} style={st.kpiCell}>
                    <AppText
                      variant="small"
                      color="rgba(255,255,255,0.5)"
                      style={{textTransform: 'uppercase', letterSpacing: 0.4, fontSize: ms(7.5)}}>
                      {cell.label}
                    </AppText>
                    <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(13), marginTop: vs(2)}}>
                      {cell.status}
                    </AppText>
                    <AppText
                      variant="small"
                      color={cell.color === Colors.tealText ? Colors.paleGreen : '#FDDCB5'}
                      style={{fontSize: ms(8), marginTop: vs(1)}}>
                      {cell.detail}
                    </AppText>
                  </View>
                ))}
              </View>
            </View>

            <View style={st.card}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>Attention monitoring \u00b7 clinical context</AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{marginBottom: vs(10), marginTop: vs(2)}}>
                SDQ hyperactivity subscale borderline
              </AppText>
              {AYU_INSIGHTS.map((ins, i) => (
                <View key={i} style={st.ayuInsightRow}>
                  <View style={[st.ayuDot, {backgroundColor: ins.dot}]} />
                  <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(17)}}>
                    <AppText style={{fontWeight: '700'}}>{ins.title}</AppText>{ins.body}
                  </AppText>
                </View>
              ))}
            </View>
          </>
        )}

        <View style={{height: vs(20)}} />
      </ScrollView>

      {/* ── Sticky Save Bar ── */}
      <View style={[st.saveBar, {paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10)}]}>
        <TouchableOpacity style={st.saveBtn} activeOpacity={0.85}>
          <Icon family="Ionicons" name="save-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white}>
            Save milestone assessment \u00b7 Apr 5
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
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(10)},
  topRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(8)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  savePill: {paddingHorizontal: s(12), paddingVertical: vs(5), borderRadius: ms(14), backgroundColor: 'rgba(255,255,255,0.18)', opacity: 0.85},

  tabBar: {flexDirection: 'row', gap: s(6), marginTop: vs(4)},
  tabPill: {paddingHorizontal: s(12), paddingVertical: vs(7), borderRadius: ms(14), backgroundColor: 'transparent', borderWidth: 1, borderColor: 'rgba(255,255,255,0.25)'},
  tabPillActive: {backgroundColor: Colors.white, borderColor: Colors.white},

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(12)},

  // Info boxes
  greenInfoBox: {backgroundColor: Colors.tealBg, borderRadius: ms(11), borderWidth: 1, borderColor: Colors.paleGreen, padding: ms(10), flexDirection: 'row', alignItems: 'flex-start', gap: s(8), marginBottom: vs(14)},
  blueInfoBox: {backgroundColor: '#E3EEFA', borderRadius: ms(11), borderWidth: 1, borderColor: '#B9D3ED', padding: ms(10), flexDirection: 'row', alignItems: 'flex-start', gap: s(8), marginBottom: vs(14)},

  // Milestone group
  groupHeader: {backgroundColor: Colors.primary, paddingHorizontal: s(12), paddingVertical: vs(9), borderTopLeftRadius: ms(12), borderTopRightRadius: ms(12), flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'},
  groupProgress: {backgroundColor: 'rgba(255,255,255,0.18)', paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(10)},
  milestoneRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(10), paddingHorizontal: s(12), paddingVertical: vs(10), borderWidth: 0.5, borderTopWidth: 0, borderColor: '#E5DDD3'},
  milestoneIcon: {width: ms(24), height: ms(24), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center', marginTop: vs(1)},
  statusPill: {paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(10), alignSelf: 'flex-start'},

  // SDQ
  sdqCard: {backgroundColor: Colors.white, borderWidth: 0.5, borderColor: '#E5DDD3', borderRadius: ms(12), padding: ms(11), marginBottom: vs(8)},
  sdqBtn: {flex: 1, paddingVertical: vs(7), paddingHorizontal: s(6), borderRadius: ms(10), borderWidth: 1, borderColor: '#E5DDD3', backgroundColor: Colors.white, alignItems: 'center'},
  scoreBox: {backgroundColor: Colors.tealBg, borderWidth: 1, borderColor: Colors.paleGreen, borderRadius: ms(12), padding: ms(12), marginTop: vs(6), marginBottom: vs(6)},

  // Red flags
  redAlert: {backgroundColor: '#FEF2F2', borderWidth: 1, borderColor: '#FCA5A5', borderRadius: ms(12), padding: ms(12), marginBottom: vs(10)},
  redRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(8), paddingVertical: vs(5)},
  ageFlagRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(10), paddingVertical: vs(9), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F0E8DA'},
  tealInsight: {backgroundColor: Colors.tealBg, borderWidth: 1, borderColor: Colors.paleGreen, borderRadius: ms(12), padding: ms(12), flexDirection: 'row', alignItems: 'flex-start', gap: s(8)},

  // Card
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(12), marginBottom: vs(8)},

  // Ayu tab
  ayuHeader: {backgroundColor: Colors.primary, marginHorizontal: s(-13), paddingHorizontal: s(16), paddingVertical: vs(14), marginTop: vs(-12), marginBottom: vs(12)},
  kpiStrip: {flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: ms(12), overflow: 'hidden', gap: 1},
  kpiCell: {flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', paddingVertical: vs(10), paddingHorizontal: s(6), alignItems: 'center'},
  ayuInsightRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(9), paddingVertical: vs(7), borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#F0E8DA'},
  ayuDot: {width: ms(8), height: ms(8), borderRadius: ms(4), marginTop: vs(5)},

  // Save bar
  saveBar: {backgroundColor: Colors.white, borderTopWidth: 0.5, borderTopColor: '#E5DDD3', paddingHorizontal: s(16), paddingTop: vs(10)},
  saveBtn: {backgroundColor: Colors.primary, borderRadius: ms(14), paddingVertical: vs(12), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(8)},
});

export default DevelopmentalMilestonesScreen;
