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
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: 'rgba(255,255,255,0.4)', marginBottom: vs(8)}}>Ayu Intel</AppText>
      <AppText style={{fontSize: ms(13), fontWeight: '600', color: Colors.white, lineHeight: ms(22), marginBottom: vs(10)}}>
        Asthma control is <AppText style={{color: '#FCD34D', fontWeight: '700'}}>partially controlled (GINA Step 2)</AppText> - 6 yellow days and 4 rescue puffs this week exceeds the target of {'<'}2/week. The key pattern: <AppText style={{color: '#FAC775', fontWeight: '700'}}>dust and cold air trigger</AppText> most yellow days. Preventer adherence is good at 86%. Increasing to 100% and pre-medicating before cold air would likely close this gap.
      </AppText>
      <View style={{gap: vs(6)}}>
        <View style={{backgroundColor: 'rgba(220,38,38,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}><AppText style={{fontSize: ms(10), color: '#FCA5A5', lineHeight: ms(16)}}>Rescue inhaler {'>'}2x/week = partially controlled. Discuss preventer dose with Dr. Kavitha.</AppText></View>
        <View style={{backgroundColor: 'rgba(13,148,136,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}><AppText style={{fontSize: ms(10), color: Colors.paleGreen, lineHeight: ms(16)}}>No red zone episodes. Personal best maintained at 380 L/min. Preventer 86% adherent.</AppText></View>
        <View style={{backgroundColor: 'rgba(217,119,6,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}><AppText style={{fontSize: ms(10), color: '#FCD34D', lineHeight: ms(16)}}>Pre-medication with 2 puffs Salbutamol 15 min before cold air could prevent 2 of 6 yellow days.</AppText></View>
      </View>
    </View>

    {/* GINA control */}
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="clipboard-outline" iconBg={Colors.tealBg} title="GINA asthma control score - March 2026" subtitle="Global Initiative for Asthma assessment" />
      <View style={st.cardBody}>
        <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(10)}}>
          <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Green days</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.tealDark}}>22/28</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>79%</AppText><View style={{height: ms(5), backgroundColor: '#edf2ef', borderRadius: ms(3), overflow: 'hidden', width: '100%', marginTop: vs(5)}}><View style={{height: '100%', width: '79%', backgroundColor: Colors.accent, borderRadius: ms(3)}} /></View></View>
          <View style={{flex: 1, backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Yellow days</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.amber}}>6/28</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>21%</AppText><View style={{height: ms(5), backgroundColor: '#edf2ef', borderRadius: ms(3), overflow: 'hidden', width: '100%', marginTop: vs(5)}}><View style={{height: '100%', width: '21%', backgroundColor: Colors.amber, borderRadius: ms(3)}} /></View></View>
          <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Red days</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.tealDark}}>0/28</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>None</AppText></View>
        </View>
        <InsightRow dotColor={Colors.amber} text="GINA criteria for well-controlled asthma: daytime symptoms \u22642 days/week, rescue use \u22642 days/week, no activity limitation, no night waking. Current status falls short on rescue use (4/week)." />
        <InsightRow dotColor={Colors.tealDark} text="If 2 cold-air-triggered yellow days are prevented by pre-medication, rescue use drops to ~1.5/week - moving into the well-controlled category without changing preventer dose." isLast />
      </View>
    </Card>

    {/* Priority actions */}
    <Card>
      <CardHeader icon="checkmark-done-outline" iconBg={Colors.tealBg} title="Priority actions" subtitle="Ranked by expected impact on control" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="Pre-medicate before cold air - 2 puffs Salbutamol 15 minutes before going outside in cold weather prevents cold-air-triggered bronchoconstriction." />
        <InsightRow dotColor={Colors.red} text="Dust mitigation at home - damp cloth for surfaces, HEPA vacuum weekly, encase mattress and pillows. These changes reduce dust-trigger episodes by ~60%." />
        <InsightRow dotColor={Colors.amber} text="Preventer adherence to 100% - currently 86% (missing ~4 doses/month). Missing Fluticasone raises airway inflammation baseline." />
        <InsightRow dotColor={Colors.amber} text="Share this report with Dr. Kavitha - 6 yellow days/month is the threshold for considering a preventer dose step-up (GINA Step 3)." isLast />
      </View>
    </Card>
  </View>
);

// ── Triggers ──
const TriggersPanel = () => (
  <View>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="flash-outline" iconBg={Colors.amberBg} title="Trigger analysis - March 2026" subtitle="Yellow days mapped to likely triggers" />
      <View style={{padding: 0}}>
        <PatternRow label="Cold air" pct={67} barColor={Colors.red} value="2 episodes" valueColor={Colors.red} />
        <PatternRow label="Dust" pct={67} barColor={Colors.red} value="2 episodes" valueColor={Colors.red} />
        <PatternRow label="Stress" pct={34} barColor={Colors.amber} value="1 episode" valueColor={Colors.amber} />
        <PatternRow label="Unknown" pct={17} barColor={Colors.textSecondary} value="1 episode" valueColor={Colors.textSecondary} isLast />
      </View>
      <View style={{backgroundColor: Colors.amberBg, borderTopWidth: 0.5, borderTopColor: '#edf2ef', padding: ms(10)}}>
        <AppText style={{fontSize: ms(10), color: Colors.amberDark, lineHeight: ms(16)}}>Cold air and dust each account for 33% of yellow days - these are the two most actionable triggers.</AppText>
      </View>
    </Card>

    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="snow-outline" iconBg={Colors.blueBg} title="Cold air - Prevention strategy" subtitle="Bronchoconstriction from cold air exposure" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="Cold air causes rapid water loss from the airway lining and triggers mast cell degranulation - releasing histamine that constricts bronchi within 5-10 minutes of exposure." />
        <InsightRow dotColor={Colors.accent} text="Prevention: 2 puffs Salbutamol 15 min before going out in cold (\u226418\u00B0C) weather. Wearing a scarf over mouth/nose warms and humidifies air. Both together reduce cold-air episodes by ~70%." isLast />
      </View>
    </Card>

    <Card>
      <CardHeader icon="leaf-outline" iconBg={Colors.amberBg} title="Dust - Prevention strategy" subtitle="House dust mite & particulate exposure" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="House dust mites (HDM) are the most common indoor asthma trigger. Dry dusting and sweeping aerosolise HDM allergens - triggering symptoms 15-60 min later." />
        <InsightRow dotColor={Colors.accent} text="Key changes: Use a HEPA-filter vacuum. Damp-mop hard floors. Encase mattress and pillows in allergen-impermeable covers. Wash bedding weekly at \u226560\u00B0C. Use Salbutamol before cleaning sessions." isLast />
      </View>
    </Card>
  </View>
);

// ── Conditions ──
const ConditionsPanel = () => (
  <View>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="flask-outline" iconBg={Colors.amberBg} title="T2DM - Inhaled steroid and glucose" subtitle="Fluticasone 125mcg and blood sugar" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.amber} text="Inhaled corticosteroids (ICS) at standard doses (Fluticasone \u2264500mcg/day) have minimal effect on blood glucose in T2DM. At Priya's dose of 125mcg twice daily, no clinically significant glucose elevation is expected." />
        <InsightRow dotColor={Colors.red} text="If asthma is uncontrolled and a step-up to oral corticosteroids (prednisolone) is needed, blood glucose can rise sharply - up to 60-100 mg/dL. Avoidable with good ICS adherence." />
        <InsightRow dotColor={Colors.tealDark} text="Good asthma control is itself protective - acute asthma attacks trigger adrenaline release, which raises glucose. Preventing yellow days = preventing glucose spikes." isLast />
      </View>
    </Card>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="heart-outline" iconBg={Colors.redBg} title="Hypertension - Beta blocker contraindication" subtitle="Critical medication interaction" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="Beta blockers (propranolol, atenolol, metoprolol) are contraindicated in asthma - they block the beta-2 receptors that Salbutamol acts on. Priya is currently on Olmesartan (an ARB) - this is the correct, asthma-safe antihypertensive." />
        <InsightRow dotColor={Colors.amber} text="If BP control is inadequate: calcium channel blockers (Amlodipine) are safe in asthma. ACE inhibitors can cause chronic dry cough that worsens asthma symptoms." />
        <InsightRow dotColor={Colors.tealDark} text="Always inform any new prescribing doctor that Priya has asthma - especially in emergencies where beta blockers might be reflexively prescribed." isLast />
      </View>
    </Card>
    <Card>
      <CardHeader icon="medkit-outline" iconBg={Colors.background} title="NSAIDs / Aspirin awareness" subtitle="Pain relief safety in asthma" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.amber} text="~10% of adults with asthma are sensitive to aspirin and NSAIDs (ibuprofen, naproxen) - causing bronchospasm within 30-60 minutes. This is called aspirin-exacerbated respiratory disease (AERD)." />
        <InsightRow dotColor={Colors.tealDark} text="Safe alternative: Paracetamol (up to 1g, max 4g/day) is generally safe in asthma. If in doubt, test with a low dose under medical supervision." isLast />
      </View>
    </Card>
  </View>
);

// ── Patterns ──
const PatternsPanel = () => (
  <View>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="time-outline" iconBg={Colors.tealBg} title="PEF by time of day" subtitle="Circadian pattern - March 2026" />
      <View style={{padding: 0}}>
        <PatternRow label="On waking" pct={75} barColor={Colors.amber} value="79% avg" valueColor={Colors.amber} />
        <PatternRow label="Morning" pct={84} barColor={Colors.accent} value="88% avg" valueColor={Colors.tealDark} />
        <PatternRow label="Afternoon" pct={86} barColor={Colors.accent} value="90% avg" valueColor={Colors.tealDark} />
        <PatternRow label="Evening" pct={82} barColor={Colors.accent} value="86% avg" valueColor={Colors.tealDark} isLast />
      </View>
      <View style={{backgroundColor: Colors.amberBg, borderTopWidth: 0.5, borderTopColor: '#edf2ef', padding: ms(10)}}>
        <AppText style={{fontSize: ms(10), color: Colors.amberDark, lineHeight: ms(16)}}>Morning dip (79% on waking) is classic asthma circadian pattern. A morning PEF consistently {'<'}80% is the primary signal that preventer dose needs stepping up.</AppText>
      </View>
    </Card>

    <Card>
      <CardHeader icon="analytics-outline" iconBg={Colors.tealBg} title="PEF variability - Diurnal %" subtitle="Morning vs evening difference - asthma control indicator" />
      <View style={st.cardBody}>
        <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(8)}}>
          <View style={{flex: 1, backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Current variability</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.amber}}>11%</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>morning vs evening</AppText></View>
          <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Well controlled target</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.tealDark}}>{'<'}8%</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>variability</AppText></View>
        </View>
        <InsightRow dotColor={Colors.amber} text="Diurnal PEF variability of 11% indicates airways are not fully stable through the 24-hour cycle. <8% variability = well controlled. Improving preventer adherence to 100% is the primary lever to reduce this." isLast />
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

const AsthmaAyuIntelScreen = () => {
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
            <AppText style={st.headerTitle}>Asthma Analysis</AppText>
            <AppText style={st.headerSub}>Control - Triggers - Condition impact</AppText>
          </View>
          <TouchableOpacity style={st.shareBtn}><Icon family="Ionicons" name="share-outline" size={ms(16)} color={Colors.white} /></TouchableOpacity>
        </View>
        <View style={st.statsRowH}>
          <View style={st.statBoxH}><AppText style={st.statLabelH}>Control</AppText><AppText style={st.statValueH}>Partial</AppText><AppText style={st.statSubH}>GINA Step 2</AppText></View>
          <View style={st.statBoxH}><AppText style={st.statLabelH}>Avg PEF%</AppText><AppText style={st.statValueH}>81%</AppText><AppText style={st.statSubH}>30-day avg</AppText></View>
          <View style={st.statBoxH}><AppText style={st.statLabelH}>Adherence</AppText><AppText style={st.statValueH}>86%</AppText><AppText style={st.statSubH}>Fluticasone</AppText></View>
          <View style={[st.statBoxH, {borderRightWidth: 0}]}><AppText style={st.statLabelH}>Rescue</AppText><AppText style={st.statValueH}>4/wk</AppText><AppText style={st.statSubH}>target {'<'}2/wk</AppText></View>
        </View>
      </View>
      <View style={st.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: s(13), gap: s(5)}}>
          {TABS.map(tab => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity key={tab.key} style={[st.tab, active && st.tabActive]} onPress={() => setActiveTab(tab.key)} activeOpacity={0.7}>
                <Icon family="Ionicons" name={tab.icon} size={ms(12)} color={active ? Colors.primary : 'rgba(255,255,255,0.5)'} style={{marginRight: s(4)}} />
                <AppText style={{fontSize: ms(11), fontWeight: '600', color: active ? Colors.primary : 'rgba(255,255,255,0.5)'}}>{tab.label}</AppText>
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
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(11)},
  shareBtn: {width: ms(30), height: ms(30), borderRadius: ms(9), backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center'},
  statsRowH: {flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.1)', marginTop: vs(8)},
  statBoxH: {flex: 1, paddingVertical: vs(8), paddingHorizontal: s(10), borderRightWidth: 0.5, borderRightColor: 'rgba(255,255,255,0.1)'},
  statLabelH: {fontSize: ms(8), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, color: 'rgba(255,255,255,0.38)', marginBottom: vs(2)},
  statValueH: {fontSize: ms(15), fontWeight: '700', color: Colors.white},
  statSubH: {fontSize: ms(8), color: 'rgba(255,255,255,0.38)', marginTop: vs(1)},
  tabContainer: {backgroundColor: Colors.primary, paddingBottom: vs(10)},
  tab: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(10), backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)'},
  tabActive: {backgroundColor: Colors.white, borderColor: Colors.white},
  intelBand: {backgroundColor: Colors.primary, padding: ms(14), borderRadius: ms(14), marginBottom: vs(10)},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, overflow: 'hidden'},
  cardHdr: {flexDirection: 'row', alignItems: 'center', gap: s(8), paddingVertical: vs(12), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#edf2ef'},
  cardHdrIco: {width: ms(32), height: ms(32), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center', flexShrink: 0},
  cardBody: {paddingVertical: vs(11), paddingHorizontal: s(13)},
  insightRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(9), paddingVertical: vs(8), borderBottomWidth: 0.5, borderBottomColor: '#f4f4f4'},
  irDot: {width: ms(8), height: ms(8), borderRadius: ms(4), marginTop: vs(4)},
  patRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(9), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'},
  patBar: {height: ms(7), borderRadius: ms(3), backgroundColor: Colors.background, overflow: 'hidden'},
  patFill: {height: '100%', borderRadius: ms(3)},
});

export {OverviewPanel as AsthmaOverviewPanel, TriggersPanel as AsthmaTriggersPanel, ConditionsPanel as AsthmaConditionsPanel, PatternsPanel as AsthmaPatternsPanel};
export default AsthmaAyuIntelScreen;
