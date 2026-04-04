import React, {useState} from 'react';
import {View, StyleSheet, StatusBar, ScrollView, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const Card = ({children, style}) => (<View style={[st.card, style]}>{children}</View>);
const CardHeader = ({icon, iconBg, title, subtitle}) => (
  <View style={st.cardHdr}><View style={[st.cardHdrIco, {backgroundColor: iconBg}]}><Icon family="Ionicons" name={icon} size={ms(15)} color={Colors.textPrimary} /></View><View style={{flex: 1}}><AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.textPrimary}}>{title}</AppText><AppText style={{fontSize: ms(10), color: Colors.textSecondary, marginTop: vs(1)}}>{subtitle}</AppText></View></View>
);
const InsightRow = ({dotColor, text, isLast}) => (
  <View style={[st.insightRow, isLast && {borderBottomWidth: 0}]}><View style={[st.irDot, {backgroundColor: dotColor}]} /><AppText style={{flex: 1, fontSize: ms(11), color: '#333', lineHeight: ms(18)}}>{text}</AppText></View>
);
const PatternRow = ({label, pct, barColor, value, valueColor, isLast}) => (
  <View style={[st.patRow, isLast && {borderBottomWidth: 0}]}><AppText style={{fontSize: ms(11), fontWeight: '600', color: Colors.textPrimary, width: s(100), flexShrink: 0}}>{label}</AppText><View style={{flex: 1}}><View style={st.patBar}><View style={[st.patFill, {width: `${pct}%`, backgroundColor: barColor}]} /></View></View><AppText style={{fontSize: ms(11), fontWeight: '700', color: valueColor, minWidth: s(50), textAlign: 'right'}}>{value}</AppText></View>
);

// ── Overview ──
const OverviewPanel = () => (
  <View>
    <View style={st.intelBand}>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: 'rgba(255,255,255,0.38)', marginBottom: vs(8)}}>Ayu Intel</AppText>
      <AppText style={{fontSize: ms(13), fontWeight: '600', color: Colors.white, lineHeight: ms(22), marginBottom: vs(10)}}>
        4 migraines in March - at the <AppText style={{color: '#FCD34D', fontWeight: '700'}}>threshold of episodic migraine</AppText> (4/month). Top triggers are <AppText style={{color: '#FCA5A5', fontWeight: '700'}}>stress (60%)</AppText> and <AppText style={{color: '#FCA5A5', fontWeight: '700'}}>hormonal/menstrual (40%)</AppText>. Rescue medication use of 8 days is approaching the <AppText style={{color: '#FCD34D', fontWeight: '700'}}>10-day MOH limit</AppText>. Topiramate adherence at 78% may be contributing.
      </AppText>
      <View style={{gap: vs(6)}}>
        <View style={{backgroundColor: 'rgba(220,38,38,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}><AppText style={{fontSize: ms(10), color: '#FCA5A5', lineHeight: ms(16)}}>8 rescue medication days this month - 2 days from MOH threshold. Discuss with Dr. Kavitha.</AppText></View>
        <View style={{backgroundColor: 'rgba(217,119,6,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}><AppText style={{fontSize: ms(10), color: '#FCD34D', lineHeight: ms(16)}}>Topiramate 78% adherence - missing ~6 doses/month reduces migraine protection. Target: {'>'}90%.</AppText></View>
        <View style={{backgroundColor: 'rgba(13,148,136,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}><AppText style={{fontSize: ms(10), color: '#5EEAD4', lineHeight: ms(16)}}>Menstrual migraine: taking frovatriptan 2 days before period onset for 5 days is a proven prevention strategy.</AppText></View>
      </View>
    </View>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="clipboard-outline" iconBg={Colors.primaryBg} title="MIDAS disability score - March 2026" subtitle="Migraine Disability Assessment - 3-month impact" />
      <View style={st.cardBody}>
        <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(10)}}>
          <View style={{flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Work days lost</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.red}}>6</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>this month</AppText></View>
          <View style={{flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>MIDAS grade</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.red}}>III-IV</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Severe</AppText></View>
          <View style={{flex: 1, backgroundColor: Colors.primaryBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Frequency goal</AppText><AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.primary}}>{'<'}4/mo</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>episodic</AppText></View>
        </View>
        <InsightRow dotColor={Colors.red} text="MIDAS Grade III-IV (severe) means migraines are significantly impacting work and daily life. This level justifies a neurologist review and possible preventive therapy step-up." />
        <InsightRow dotColor={Colors.primary} text="If frequency reaches \u22655/month for 3 consecutive months, this crosses into chronic migraine territory where Botox or CGRP antibodies (Aimovig, Ajovy) become indicated." isLast />
      </View>
    </Card>
    <Card>
      <CardHeader icon="checkmark-done-outline" iconBg={Colors.primaryBg} title="Priority actions" subtitle="Ranked by expected impact on frequency" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="Topiramate adherence to >90% - currently 78% (6 missed doses/month). Each missed dose leaves a 2-3 day protection gap. Set a phone alarm for 8 PM daily." />
        <InsightRow dotColor={Colors.red} text="Frovatriptan mini-prophylaxis for menstrual migraine - take 2.5mg twice daily starting 2 days before expected period onset for 5 days. 65% reduction in menstrual migraine." />
        <InsightRow dotColor={Colors.amber} text="Strict sleep schedule - going to bed and waking at the same time (\u00B130 min) even on weekends eliminates the weekend migraine pattern." />
        <InsightRow dotColor={Colors.amber} text="Never skip meals - especially important for T2DM (hypoglycaemia triggers both glucose crashes and migraines)." />
        <InsightRow dotColor={Colors.primary} text="Cefaly Prevention mode nightly - 20-min eTNS session before sleep. Current 18-day streak is excellent. 50% reduction after 3 months of consistent use." isLast />
      </View>
    </Card>
  </View>
);

// ── Triggers ──
const TriggersPanel = () => (
  <View>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="flash-outline" iconBg={Colors.primaryBg} title="Trigger analysis - Jan-Mar 2026" subtitle="10 migraines logged - top triggers identified" />
      <View style={{padding: 0}}>
        <PatternRow label="Stress" pct={60} barColor={Colors.red} value="6 attacks" valueColor={Colors.red} />
        <PatternRow label="Hormonal" pct={40} barColor="#c0392b" value="4 attacks" valueColor="#c0392b" />
        <PatternRow label="Poor sleep" pct={40} barColor={Colors.amber} value="4 attacks" valueColor={Colors.amber} />
        <PatternRow label="Skipped meal" pct={20} barColor={Colors.amber} value="2 attacks" valueColor={Colors.amber} />
        <PatternRow label="Bright light" pct={10} barColor={Colors.textSecondary} value="1 attack" valueColor={Colors.textSecondary} isLast />
      </View>
      <View style={{backgroundColor: Colors.primaryBg, borderTopWidth: 0.5, borderTopColor: '#edf2ef', padding: ms(10)}}>
        <AppText style={{fontSize: ms(10), color: Colors.primaryText, lineHeight: ms(16)}}>Migraine is typically multi-trigger - stress + poor sleep together cause 40% of attacks. Addressing stress alone without improving sleep will have limited impact.</AppText>
      </View>
    </Card>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="calendar-outline" iconBg={Colors.amberBg} title="Menstrual migraine pattern" subtitle="Oestrogen drop at menstruation triggers attacks" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="4 of 10 migraines (40%) occurred within 3 days of menstruation onset - a pattern called menstrual migraine. Oestrogen drops sharply at day -2 to +3 of the cycle." />
        <InsightRow dotColor={Colors.tealDark} text="Prevention strategy: Frovatriptan 2.5mg twice daily from day -2 to +3 (5 days) of expected period. Evidence-based and reduces hormonal migraine frequency by 65%." />
        <InsightRow dotColor={Colors.primary} text="Tracking your cycle in TrustLife will allow Ayu to predict your migraine risk window 5 days in advance and send an alert." isLast />
      </View>
    </Card>
    <Card>
      <CardHeader icon="moon-outline" iconBg={Colors.primaryBg} title="Sleep as migraine trigger" subtitle="40% of attacks preceded by <6h sleep" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="Sleep deprivation lowers the cortical spreading depression threshold. Even one night <6h doubles next-day migraine risk. Sleeping past your usual wake time (weekend lie-ins) is equally problematic." />
        <InsightRow dotColor={Colors.tealDark} text="The migraine brain prefers consistency over quantity. A fixed bedtime of 10:30 PM and wake time of 6:30 AM - even Saturday and Sunday - eliminates the weekend migraine pattern." isLast />
      </View>
    </Card>
  </View>
);

// ── Conditions ──
const ConditionsPanel = () => (
  <View>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="flask-outline" iconBg={Colors.amberBg} title="T2DM - Hypoglycaemia and migraine" subtitle="Blood glucose instability is a migraine trigger" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="Hypoglycaemia (blood glucose <70 mg/dL) is a potent migraine trigger in T2DM - glucose drops cause cerebral vasodilation that lowers the migraine threshold. Priya's 2 meal-skipping attacks are directly linked." />
        <InsightRow dotColor={Colors.amber} text="Metformin itself does not cause hypoglycaemia - but combined with meal skipping, it can lower glucose enough to trigger an attack. Never skip meals while on Metformin." />
        <InsightRow dotColor={Colors.tealDark} text="Checking blood glucose at migraine onset can help identify glucose-triggered attacks - FBG <80 mg/dL at onset + headache = treat glucose first before migraine medication." isLast />
      </View>
    </Card>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="heart-outline" iconBg={Colors.redBg} title="Hypertension - Migraine medication safety" subtitle="Important drug interaction awareness" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="Triptans (Sumatriptan) cause vasoconstriction and are generally safe in well-controlled HTN - but should be avoided if BP is uncontrolled (>150/95). Always take Olmesartan as scheduled." />
        <InsightRow dotColor={Colors.amber} text="Ergotamine is contraindicated in HTN - do not use if prescribed by another doctor without disclosing HTN. Causes severe peripheral vasoconstriction dangerous at elevated BP." />
        <InsightRow dotColor={Colors.tealDark} text="Beta-blockers (propranolol) are both excellent BP medications AND proven migraine preventers - however, they interact with Salbutamol if asthma is also present." isLast />
      </View>
    </Card>
    <Card>
      <CardHeader icon="medical-outline" iconBg={Colors.primaryBg} title="Topiramate - T2DM interaction note" subtitle="Preventer medication effect on metabolism" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.primary} text="Topiramate (migraine preventer) is associated with modest weight loss (2-4 kg) and can improve insulin sensitivity - a beneficial side effect for Priya's T2DM and weight goals." />
        <InsightRow dotColor={Colors.amber} text="Topiramate causes cognitive dulling ('Dopamax' effect) in some patients - reduced word-finding, slowed thinking. If affecting work, discuss dose adjustment with Dr. Kavitha." isLast />
      </View>
    </Card>
  </View>
);

// ── Patterns ──
const PatternsPanel = () => (
  <View>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="time-outline" iconBg={Colors.primaryBg} title="Attack onset - Time of day" subtitle="When migraines start - Jan-Mar 2026" />
      <View style={{padding: 0}}>
        <PatternRow label="Night (0-6 AM)" pct={30} barColor={Colors.primary} value="3 attacks" valueColor={Colors.primary} />
        <PatternRow label="Morning (6-12)" pct={50} barColor={Colors.red} value="5 attacks" valueColor={Colors.red} />
        <PatternRow label="Afternoon (12-6)" pct={10} barColor={Colors.textSecondary} value="1 attack" valueColor={Colors.textSecondary} />
        <PatternRow label="Evening (6-12)" pct={10} barColor={Colors.textSecondary} value="1 attack" valueColor={Colors.textSecondary} isLast />
      </View>
      <View style={{backgroundColor: Colors.primaryBg, borderTopWidth: 0.5, borderTopColor: '#edf2ef', padding: ms(10)}}>
        <AppText style={{fontSize: ms(10), color: Colors.primaryText, lineHeight: ms(16)}}>80% of attacks start between midnight and noon - peak during sleep or early morning. Taking Topiramate in the evening maximises its effect during this high-risk window.</AppText>
      </View>
    </Card>
    <Card>
      <CardHeader icon="calendar-outline" iconBg={Colors.primaryBg} title="Day of week pattern" subtitle="Weekend migraine is a recognised phenomenon" />
      <View style={{padding: 0}}>
        <PatternRow label="Mon-Fri" pct={30} barColor={Colors.primary} value="3 attacks" valueColor={Colors.primary} />
        <PatternRow label="Saturday" pct={50} barColor={Colors.red} value="5 attacks" valueColor={Colors.red} />
        <PatternRow label="Sunday" pct={20} barColor={Colors.amber} value="2 attacks" valueColor={Colors.amber} isLast />
      </View>
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="Saturday is the highest-risk day - 50% of attacks. 'Weekend migraine' is caused by: stress let-down (cortisol drop), sleeping late (altered rhythm), delayed breakfast (glucose drop), and caffeine reduction. Maintaining weekday habits on Saturday morning is the single most effective prevention." isLast />
      </View>
    </Card>
  </View>
);

const TABS = [
  {key: 'overview', label: 'Overview', icon: 'grid-outline'},
  {key: 'triggers', label: 'Triggers', icon: 'flash-outline'},
  {key: 'conditions', label: 'Conditions', icon: 'medical-outline'},
  {key: 'patterns', label: 'Patterns', icon: 'stats-chart-outline'},
];

const MigraineAyuIntelScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText style={st.headerTitle}>Migraine Analysis</AppText>
            <AppText style={st.headerSub}>Trigger patterns - Control - Condition impact</AppText>
          </View>
          <TouchableOpacity style={st.shareBtn}><Icon family="Ionicons" name="share-outline" size={ms(16)} color={Colors.white} /></TouchableOpacity>
        </View>
        <View style={st.statsRowH}>
          <View style={st.statBoxH}><AppText style={st.statLabelH}>Frequency</AppText><AppText style={st.statValueH}>4/month</AppText><AppText style={st.statSubH}>episodic</AppText></View>
          <View style={st.statBoxH}><AppText style={st.statLabelH}>Control</AppText><AppText style={st.statValueH}>Partial</AppText><AppText style={st.statSubH}>MIDAS: severe</AppText></View>
          <View style={[st.statBoxH, {borderRightWidth: 0}]}><AppText style={st.statLabelH}>Top trigger</AppText><AppText style={st.statValueH}>Stress</AppText><AppText style={st.statSubH}>60% of attacks</AppText></View>
        </View>
      </View>
      <View style={st.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: s(13), gap: s(5)}}>
          {TABS.map(tab => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity key={tab.key} style={[st.tab, active && st.tabActive]} onPress={() => setActiveTab(tab.key)} activeOpacity={0.7}>
                <Icon family="Ionicons" name={tab.icon} size={ms(12)} color={active ? Colors.primary : 'rgba(255,255,255,0.45)'} style={{marginRight: s(4)}} />
                <AppText style={{fontSize: ms(11), fontWeight: '600', color: active ? Colors.primary : 'rgba(255,255,255,0.45)'}}>{tab.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>
      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: s(12), paddingBottom: vs(40)}} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && <OverviewPanel />}
        {activeTab === 'triggers' && <TriggersPanel />}
        {activeTab === 'conditions' && <ConditionsPanel />}
        {activeTab === 'patterns' && <PatternsPanel />}
      </ScrollView>
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingTop: vs(10), paddingBottom: vs(8), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.4)', fontSize: ms(11)},
  shareBtn: {width: ms(30), height: ms(30), borderRadius: ms(9), backgroundColor: 'rgba(255,255,255,0.1)', alignItems: 'center', justifyContent: 'center'},
  statsRowH: {flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.1)', marginTop: vs(8)},
  statBoxH: {flex: 1, paddingVertical: vs(8), paddingHorizontal: s(10), borderRightWidth: 0.5, borderRightColor: 'rgba(255,255,255,0.1)'},
  statLabelH: {fontSize: ms(8), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, color: 'rgba(255,255,255,0.35)', marginBottom: vs(2)},
  statValueH: {fontSize: ms(15), fontWeight: '700', color: Colors.white},
  statSubH: {fontSize: ms(8), color: 'rgba(255,255,255,0.35)', marginTop: vs(1)},
  tabContainer: {backgroundColor: Colors.primary, paddingBottom: vs(10)},
  tab: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(10), backgroundColor: 'rgba(255,255,255,0.08)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.12)'},
  tabActive: {backgroundColor: Colors.white, borderColor: Colors.white},
  intelBand: {backgroundColor: Colors.primary, padding: ms(14), borderRadius: ms(14), marginBottom: vs(10)},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', overflow: 'hidden'},
  cardHdr: {flexDirection: 'row', alignItems: 'center', gap: s(8), paddingVertical: vs(12), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#edf2ef'},
  cardHdrIco: {width: ms(32), height: ms(32), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center', flexShrink: 0},
  cardBody: {paddingVertical: vs(11), paddingHorizontal: s(13)},
  insightRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(9), paddingVertical: vs(8), borderBottomWidth: 0.5, borderBottomColor: '#f4f4f4'},
  irDot: {width: ms(8), height: ms(8), borderRadius: ms(4), marginTop: vs(4)},
  patRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(9), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#edf2ef'},
  patBar: {height: ms(7), borderRadius: ms(3), backgroundColor: '#edf2ef', overflow: 'hidden'},
  patFill: {height: '100%', borderRadius: ms(3)},
});

export {OverviewPanel as MigraineOverviewPanel, TriggersPanel as MigraineTriggersPanel, ConditionsPanel as MigraineConditionsPanel, PatternsPanel as MigrainePatternsPanel};
export default MigraineAyuIntelScreen;
