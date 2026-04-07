import React from 'react';
import {View, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const InsightRow = ({color, children}) => (
  <View style={st.insightRow}>
    <View style={[st.insightDot, {backgroundColor: color}]} />
    <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(18)}}>{children}</AppText>
  </View>
);

const ScoreBar = ({pct, label}) => (
  <View style={{marginBottom: vs(10)}}>
    <View style={st.scoreBarWrap}><View style={[st.scoreBarFill, {width: `${pct}%`}]} /></View>
    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(2)}}>
      {label.map((l, i) => <AppText key={i} variant="subtext" color={Colors.textTertiary}>{l}</AppText>)}
    </View>
  </View>
);

const Card = ({icon, iconBg, title, sub, badge, badgeBg, badgeColor, children}) => (
  <View style={st.card}>
    <View style={st.cardHdr}>
      <View style={[st.cardIcon, {backgroundColor: iconBg}]}><Icon family="Ionicons" name={icon} size={ms(16)} color={Colors.white} /></View>
      <View style={{flex: 1}}><AppText variant="bodyBold" color={Colors.textPrimary}>{title}</AppText><AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(1)}}>{sub}</AppText></View>
      {badge && <View style={[st.badge, {backgroundColor: badgeBg}]}><AppText variant="subtext" color={badgeColor} style={{fontWeight: '700'}}>{badge}</AppText></View>}
    </View>
    <View style={st.cardBody}>{children}</View>
  </View>
);

const BarItem = ({label, pct, color, value}) => (
  <View style={{marginBottom: vs(8)}}>
    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(3)}}>
      <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{label}</AppText>
      <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{value || `${pct}%`}</AppText>
    </View>
    <View style={st.scoreBarWrap}><View style={[st.scoreBarFill, {width: `${pct}%`, backgroundColor: color}]} /></View>
  </View>
);

/* ─── TAB 1: OVERVIEW ─── */
export const OverviewPanel = () => (
  <View>
    <Card icon="clipboard-outline" iconBg="#F0B429" title="PHQ-9 Depression severity" sub="Score 11 of 27 - Moderate depression" badge="Moderate" badgeBg="#FFF3CD" badgeColor="#856404">
      <ScoreBar pct={41} label={['0 None', '5 Mild', '10 Mod', '15 Mod-Sev', '27 Severe']} />
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Moderate depression</AppText>  - scores of 10-14 warrant active monitoring and typically a treatment plan with your doctor or psychologist.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Key drivers:</AppText> Sleep disruption (most days), fatigue (most days), difficulty concentrating, and low interest in activities are your top-scoring items.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Positive signal:</AppText> PHQ-9 item 9 (suicidal ideation) scored 0. Safety baseline is intact.</InsightRow>
    </Card>

    <Card icon="alert-circle-outline" iconBg="#F97316" title="GAD-7 Anxiety severity" sub="Score 10 of 21 - Moderate anxiety" badge="Moderate" badgeBg="#FFF3E5" badgeColor="#92400E">
      <ScoreBar pct={48} label={['0', '5 Mild', '10 Mod', '15 Sev', '21']} />
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Health anxiety</AppText> is a primary driver  - uncontrollable worry most days, particularly linked to your HbA1c and chronic condition management.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Comorbid pattern:</AppText> Depression + Anxiety co-occurring at moderate severity is common in chronic illness. Each amplifies the other  - treating one improves both.</InsightRow>
    </Card>

    <Card icon="flag-outline" iconBg={Colors.accent} title="Priority actions" sub="Based on your current scores">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Talk to your doctor this week.</AppText> A PHQ-9 of 11 combined with GAD-7 of 10 warrants clinical review. This could be depression secondary to your T2DM  - a very common and treatable condition.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Sleep is the highest-yield lever.</AppText> Averaging 5.8 hrs with poor quality. Even one hour more significantly reduces PHQ-9 scores within 2 weeks.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>10-minute daily walks</AppText> reduce depression severity comparably to mild antidepressants. This also directly improves your blood glucose control.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Deep breathing</AppText> (you are already doing this) activates the vagus nerve and reduces cortisol within 4 minutes. Aim for 10 minutes twice daily.</InsightRow>
    </Card>
  </View>
);

/* ─── TAB 2: PATTERNS ─── */
export const PatternsPanel = () => (
  <View>
    <Card icon="analytics-outline" iconBg={Colors.primary} title="Mood trajectory  30 days" sub="Average 5.2  below optimal (7+)">
      <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: ms(3), height: vs(50), marginBottom: vs(8)}}>
        {[20,30,40,50,20,50,70,40,20,50,35,10,25,65,50].map((h, i) => {
          const c = h <= 20 ? Colors.red : h <= 35 ? '#F97316' : h <= 50 ? '#F0B429' : '#84CC16';
          return <View key={i} style={{flex: 1, height: `${h}%`, backgroundColor: c, borderRadius: ms(3)}} />;
        })}
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(10)}}>
        <AppText variant="subtext" color={Colors.textTertiary}>1 Mar</AppText>
        <AppText variant="subtext" color={Colors.textTertiary}>15 Mar</AppText>
        <AppText variant="subtext" color={Colors.textTertiary}>28 Mar</AppText>
      </View>
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Crash pattern:</AppText> Mood drops sharply on Tuesdays and Wednesdays  - aligning with post-weekend fatigue and work week buildup. Your lowest entries (2 and 3) are both mid-week.</InsightRow>
      <InsightRow color="#84CC16"><AppText style={{fontWeight: '700'}}>Exercise days = better days:</AppText> On all 3 days you exercised this month, mood rated &gt;=6. The correlation is 94% consistent in your data.</InsightRow>
    </Card>

    <Card icon="trending-up-outline" iconBg="#F97316" title="Top triggers identified" sub="From 18 logged entries">
      <BarItem label="Health concerns" pct={89} color={Colors.red} />
      <BarItem label="Family responsibilities" pct={72} color="#F97316" />
      <BarItem label="Sleep disruption" pct={67} color="#F0B429" />
      <BarItem label="Isolation / withdrawal" pct={44} color={Colors.primary} />
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Best coping used:</AppText> Time with Aarav, deep breathing, and going outside each improved mood by an average of +1.8 points on days they were logged.</InsightRow>
    </Card>

    <Card icon="moon-outline" iconBg="#185FA5" title="Sleep&mood correlation" sub="Strong bidirectional link in your data">
      <InsightRow color={Colors.primary}>On nights you slept <AppText style={{fontWeight: '700'}}>under 5 hours</AppText>, next-day mood averaged <AppText style={{fontWeight: '700'}}>3.1 / 10</AppText>. On nights over 6.5 hours, mood averaged <AppText style={{fontWeight: '700'}}>6.4 / 10</AppText>.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Nightmares logged 3 times</AppText> this month  - associated with anxiety processing. Reducing stimulation 90 minutes before bed (screens, news) may reduce this.</InsightRow>
      <InsightRow color={Colors.accent}>Sleep improvement is the single most evidence-backed intervention for your pattern. Even +45 minutes of sleep improves PHQ-9 by an average of 2-3 points.</InsightRow>
    </Card>
  </View>
);

/* ─── TAB 3: CORRELATIONS ─── */
export const CorrelationsPanel = () => (
  <View>
    <Card icon="git-compare-outline" iconBg={Colors.primary} title="Lifestyle Mood correlations" sub="From 18 logged entries - your personal data">
      <BarItem label="Exercise days" pct={94} color={Colors.accent} value="+2.1 mood lift" />
      <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(-6), marginBottom: vs(8)}}>94% of exercise days had mood &gt;=6 vs. 31% on non-exercise days</AppText>
      <BarItem label="Sleep >6.5 hrs" pct={88} color="#84CC16" value="+3.3 mood lift" />
      <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(-6), marginBottom: vs(8)}}>Avg mood 6.4 on nights {'>'}6.5h vs. 3.1 on nights {'<'}5h</AppText>
      <BarItem label="Social engagement" pct={72} color="#84CC16" value="+1.8 mood lift" />
      <BarItem label="Heavy screen time / news" pct={65} color={Colors.red} value="-1.6 mood drop" />
      <InsightRow color={Colors.primary}><AppText style={{fontWeight: '700'}}>Strongest lever:</AppText> Exercise followed by sleep. Even 10 minutes of walking on low-mood days reliably raises your mood score by 1.5-2 points within 30 minutes.</InsightRow>
    </Card>

    <Card icon="body-outline" iconBg="#F97316" title="Symptoms - Mood correlations" sub="Somatic symptoms as mood indicators">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Headache days predict low mood:</AppText> 68% of your headache entries coincide with mood &lt;=4. Headaches in depression are frequently tension-type, driven by muscle bracing from chronic stress.</InsightRow>
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Fatigue is bidirectional:</AppText> On days you logged fatigue, PHQ-9 daily scores averaged 14.2 vs. 8.6 on non-fatigue days. This is a clinically documented loop in T2DM + depression.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Brain fog is your top anhedonia predictor:</AppText> On all 5 days you logged brain fog this month, anhedonia was also present.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Each additional physical symptom</AppText> you log adds an average of 1.4 points to that day's PHQ-9 score.</InsightRow>
      <InsightRow color={Colors.primary}><AppText style={{fontWeight: '700'}}>Appetite suppression as an early signal:</AppText> Poor appetite appeared in your logs 1-2 days before mood crashed to &lt;=3 in 4 of 5 episodes.</InsightRow>
    </Card>

    <Card icon="medical-outline" iconBg={Colors.accent} title="Medication - Mood correlations" sub="Your current medications and mood effects">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Metformin  &gt; B12 depletion  &gt; mood:</AppText> Long-term Metformin use (7 years) reduces B12 absorption by up to 30%. B12 is essential for serotonin and dopamine synthesis. Request methylmalonic acid (MMA) test for functional B12 status.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Ferrous sulphate (iron supplementation)</AppText> is directly mood-positive. As your ferritin (currently 8 ng/mL) rises toward 50+ ng/mL, expect meaningful improvement in energy, cognitive clarity, and mood within 6-10 weeks.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Olmesartan (ARB antihypertensive)</AppText> is generally mood-neutral to mildly positive compared to older antihypertensives. Your current ARB is a better choice from a mental health standpoint.</InsightRow>
      <InsightRow color={Colors.primary}><AppText style={{fontWeight: '700'}}>Medication adherence tracking:</AppText> Days when you skipped or delayed any medication correlate with next-day mood scores averaging 1.1 points lower.</InsightRow>
      <View style={[st.noteBox, {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen}]}>
        <AppText variant="small" color={Colors.tealText} style={{fontWeight: '700', marginBottom: vs(3)}}>Important note</AppText>
        <AppText variant="small" color={Colors.tealText} style={{lineHeight: ms(16)}}>If your doctor considers antidepressant therapy, SSRIs such as sertraline or escitalopram have established safety in T2DM and do not significantly affect glycaemic control.</AppText>
      </View>
    </Card>

    <Card icon="person-outline" iconBg="#BE185D" title="Life stage - Depression" sub="Age 38 - perimenopause transition window">
      <InsightRow color="#BE185D"><AppText style={{fontWeight: '700'}}>Perimenopause risk window (age 35-50):</AppText> Oestrogen fluctuation directly reduces serotonin receptor sensitivity. Women are 2-4x more likely to develop depression during perimenopause.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Premenstrual mood pattern:</AppText> Check whether your lowest-mood entries fall in the luteal phase. If yes, this may indicate PMDD which is highly treatable.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Parenting a school-age child (Aarav, 9y)</AppText> with chronic illness management creates a dual cognitive load clinically associated with elevated cortisol.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Identity and role transitions:</AppText> Creative activity and cooking for pleasure significantly lift your mood. Protect those.</InsightRow>
    </Card>

    <Card icon="git-branch-outline" iconBg={Colors.primary} title="Family history - Depression" sub="Genetic and environmental inheritance patterns">
      <InsightRow color={Colors.primary}><AppText style={{fontWeight: '700'}}>Heritability of depression is 40-50%.</AppText> If a first-degree relative has experienced depression, your lifetime risk is approximately 3x the general population.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>T2DM itself has genetic overlap with depression:</AppText> Shared genetic architecture has been identified. Both conditions share inflammatory pathways and HPA axis dysregulation.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Epigenetic factors:</AppText> Childhood adversity, chronic stress, and nutritional deficiencies can activate genes related to stress resilience. These effects are partially reversible through positive lifestyle intervention.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Action:</AppText> Share your family mental health history with Dr. Kavitha. Knowing the genetic context guides medication choice.</InsightRow>
      <View style={[st.noteBox, {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen}]}>
        <AppText variant="small" color={Colors.tealText} style={{lineHeight: ms(16)}}>Family history does not guarantee depression. Many people with high genetic risk never develop it  - particularly those with strong social support, regular exercise, and effective stress management.</AppText>
      </View>
    </Card>
  </View>
);

/* ─── TAB 4: BODY-MIND ─── */
export const BodyMindPanel = () => (
  <View>
    <Card icon="water-outline" iconBg="#F0B429" title="T2DM and depression" sub="Bidirectional, high-impact relationship">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Depression doubles HbA1c rise</AppText>  - stress hormones directly raise blood glucose. Your HbA1c of 7.8% may partly reflect your mood state, not just diet.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>HbA1c triggers anxiety</AppText>  - your logs show health concern as the #1 stressor. This creates a self-reinforcing loop: worry  &gt; poor sleep  &gt; raised glucose  &gt; more worry.</InsightRow>
      <InsightRow color={Colors.accent}>Treating depression in T2DM patients improves HbA1c by <AppText style={{fontWeight: '700'}}>0.5-1.0%</AppText> on average. Emotional wellbeing is metabolic care.</InsightRow>
    </Card>

    <Card icon="heart-outline" iconBg="#185FA5" title="Hypertension and stress" sub="Your BP 136/86 is directly affected by mood">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Chronic stress raises systolic BP by 8-12 mmHg</AppText> through sustained sympathetic nervous system activation. Your target is {'<'}130/80  - stress reduction is a clinical intervention.</InsightRow>
      <InsightRow color={Colors.primary}><AppText style={{fontWeight: '700'}}>Vagal tone matters:</AppText> HRV drops significantly with anxiety. 4-7-8 breathing can lower systolic by 5-8 mmHg acutely.</InsightRow>
    </Card>

    <Card icon="bandage-outline" iconBg={Colors.accent} title="Anaemia and mood" sub="Hb 11.8 g/dL contributes to fatigue and low mood">
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Iron deficiency anaemia mimics depression</AppText>  - fatigue, brain fog, low motivation. Your ferritin of 8 ng/mL is severely depleted. Correcting this alone may improve your energy score by 2-3 points.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Metformin depletes B12</AppText> over time (7 years). B12 deficiency causes low mood, anxiety, and cognitive fog. Request a methylmalonic acid test.</InsightRow>
    </Card>

    <Card icon="fitness-outline" iconBg="#F97316" title="Cortisol and chronic stress" sub="Physiological stress markers">
      <InsightRow color={Colors.primary}><AppText style={{fontWeight: '700'}}>HPA axis dysregulation</AppText>  - chronic stress keeps cortisol elevated. Symptoms: difficulty falling asleep despite tiredness, morning grogginess, midday energy crashes, sugar cravings.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Cortisol raises blood glucose</AppText> 10-20 mg/dL even without food intake. A morning FBG higher than bedtime may reflect nocturnal cortisol elevation.</InsightRow>
    </Card>
  </View>
);

/* ─── TAB 5: CARE PLAN ─── */
export const CarePlanPanel = () => (
  <View>
    <Card icon="warning-outline" iconBg="#F0B429" title="When to seek professional help" sub="Your current scores meet the threshold">
      <View style={[st.noteBox, {backgroundColor: '#FFF3E5', borderColor: '#FDDCB5'}]}>
        <AppText variant="small" color="#92400E" style={{lineHeight: ms(16)}}>With PHQ-9 = 11 and GAD-7 = 10 for 3+ weeks, clinical guidelines (NICE, APA) recommend assessment by a psychiatrist or clinical psychologist. This is not a crisis  - it is the right time to get support.</AppText>
      </View>
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Tell Dr. Kavitha</AppText> at your next visit. Depression in T2DM is a medical complication  - not a character issue.</InsightRow>
      <InsightRow color={Colors.primary}><AppText style={{fontWeight: '700'}}>CBT (Cognitive Behavioural Therapy)</AppText> is the gold-standard treatment for your pattern. Effective in 8-12 sessions.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>iCall  - TISS Mumbai</AppText> offers sliding-scale therapy. 9152987821.</InsightRow>
    </Card>

    <Card icon="leaf-outline" iconBg={Colors.accent} title="Evidence-based self-care" sub="What the research says will help your specific pattern">
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Behavioural activation:</AppText> Schedule one small pleasurable activity daily  - even 15 minutes cooking with Aarav. Depression makes us withdraw from the things that help.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Sleep hygiene:</AppText> Same wake time daily (even weekends) is the single most powerful regulator of circadian rhythm and mood. Set 6:30 AM as your anchor.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Rumination interrupt:</AppText> When health worry spirals, write the worry in one sentence and set a 10-minute "worry window"  - this reduces amygdala activation.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Social prescribing:</AppText> Isolation worsens your scores most. Even one 15-minute call with a friend replaces withdrawal patterns that feed depression.</InsightRow>
      <InsightRow color={Colors.primary}><AppText style={{fontWeight: '700'}}>Mindfulness-Based Cognitive Therapy (MBCT)</AppText>  - apps: Insight Timer (free), Headspace. The 8-week MBCT programme reduces depression relapse by 43%.</InsightRow>
    </Card>

    <Card icon="call-outline" iconBg={Colors.primary} title="Support resources - India" sub="Free and low-cost options">
      {[
        {icon: 'call-outline', name: 'iCall - TISS Mumbai', sub: '9152987821 - Mon-Sat - English, Hindi, Telugu'},
        {icon: 'call-outline', name: 'Vandrevala Foundation', sub: '1860-2662-345 - 24x7 - Free'},
        {icon: 'chatbubble-outline', name: 'The MINDS Foundation', sub: 'Hyderabad-based - therapy referrals'},
        {icon: 'medkit-outline', name: 'NIMHANS - Bangalore', sub: 'National Institute of Mental Health - Referrals'},
      ].map((r, i) => (
        <View key={i} style={st.resourceRow}>
          <Icon family="Ionicons" name={r.icon} size={ms(20)} color={Colors.primary} />
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={Colors.textPrimary}>{r.name}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>{r.sub}</AppText>
          </View>
        </View>
      ))}
    </Card>
  </View>
);

const st = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(15), borderWidth: 1, borderColor: '#dde8e2', marginBottom: vs(9), overflow: 'hidden'},
  cardHdr: {flexDirection: 'row', alignItems: 'center', gap: s(9), padding: ms(12), borderBottomWidth: 1, borderBottomColor: '#f0f4f2'},
  cardIcon: {width: ms(34), height: ms(34), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center'},
  cardBody: {padding: ms(12)},
  badge: {paddingHorizontal: s(9), paddingVertical: vs(2), borderRadius: ms(8)},
  insightRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(9), paddingVertical: vs(8), borderBottomWidth: 0.5, borderBottomColor: '#f5f3fb'},
  insightDot: {width: ms(7), height: ms(7), borderRadius: ms(4), marginTop: vs(5)},
  scoreBarWrap: {height: ms(10), backgroundColor: '#e5e7eb', borderRadius: ms(5), overflow: 'hidden', marginVertical: vs(4)},
  scoreBarFill: {height: '100%', borderRadius: ms(5), backgroundColor: Colors.accent},
  noteBox: {borderRadius: ms(10), padding: ms(9), marginTop: vs(6), borderWidth: 1},
  resourceRow: {backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), marginBottom: vs(6), flexDirection: 'row', alignItems: 'center', gap: s(10)},
});
