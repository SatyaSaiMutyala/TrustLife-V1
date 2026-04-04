import React, {useState} from 'react';
import {View, StyleSheet, StatusBar, ScrollView, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

// Reusable
const Card = ({children, style}) => (<View style={[st.card, style]}>{children}</View>);
const CardHeader = ({icon, iconBg, title, subtitle}) => (
  <View style={st.cardHdr}>
    <View style={[st.cardHdrIco, {backgroundColor: iconBg}]}><Icon family="Ionicons" name={icon} size={ms(15)} color={Colors.textPrimary} /></View>
    <View style={{flex: 1}}><AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.textPrimary}}>{title}</AppText><AppText style={{fontSize: ms(10), color: Colors.textSecondary, marginTop: vs(1)}}>{subtitle}</AppText></View>
  </View>
);
const InsightRow = ({dotColor, text, isLast}) => (
  <View style={[st.insightRow, isLast && {borderBottomWidth: 0}]}>
    <View style={[st.irDot, {backgroundColor: dotColor}]} />
    <AppText style={{flex: 1, fontSize: ms(11), color: '#333', lineHeight: ms(18)}}>{text}</AppText>
  </View>
);
const PatternRow = ({label, pct, barColor, value, valueColor, isLast}) => (
  <View style={[st.patRow, isLast && {borderBottomWidth: 0}]}>
    <AppText style={{fontSize: ms(11), fontWeight: '600', color: Colors.textPrimary, width: s(90), flexShrink: 0}}>{label}</AppText>
    <View style={{flex: 1}}><View style={st.patBar}><View style={[st.patFill, {width: `${pct}%`, backgroundColor: barColor}]} /></View></View>
    <AppText style={{fontSize: ms(11), fontWeight: '700', color: valueColor, minWidth: s(50), textAlign: 'right'}}>{value}</AppText>
  </View>
);
const BarCol = ({topLabel, topColor, height, barColor, bottomLabel}) => (
  <View style={{flex: 1, alignItems: 'center'}}>
    <AppText style={{fontSize: ms(8), fontWeight: '700', color: topColor, marginBottom: vs(2)}}>{topLabel}</AppText>
    <View style={{flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'center'}}>
      <View style={{width: '100%', borderTopLeftRadius: ms(3), borderTopRightRadius: ms(3), backgroundColor: barColor, height}} />
    </View>
    <AppText style={{fontSize: ms(8), color: Colors.textTertiary, marginTop: vs(2)}}>{bottomLabel}</AppText>
  </View>
);

// ── Zone segments ──
const ZONE_SEGS = [
  {flex: 11, color: Colors.blue},
  {flex: 12, color: Colors.accent},
  {flex: 7, color: Colors.amber},
  {flex: 10, color: Colors.red},
  {flex: 10, color: '#922B21'},
  {flex: 10, color: '#2d0d0d'},
];

// ══ Tab 0: Overview ══
const OverviewPanel = () => (
  <View>
    <View style={st.intelBand}>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: 'rgba(255,255,255,0.4)', marginBottom: vs(8)}}>Ayu Intel</AppText>
      <AppText style={{fontSize: ms(13), fontWeight: '600', color: Colors.white, lineHeight: ms(22), marginBottom: vs(10)}}>
        Priya's temperature has been <AppText style={{color: Colors.paleGreen, fontWeight: '700'}}>consistently normal at 36.7-37.0{'\u00B0'}C</AppText> across 42 readings since October 2025. The only exception was a <AppText style={{color: '#FCA5A5', fontWeight: '700'}}>December URTI episode (38.4{'\u00B0'}C peak)</AppText> which resolved in 7 days. For T2DM patients, fever is a metabolic stressor - blood glucose spiked to 148 mg/dL during that episode.
      </AppText>
      <View style={{gap: vs(6)}}>
        <View style={{backgroundColor: 'rgba(13,148,136,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
          <AppText style={{fontSize: ms(10), color: Colors.paleGreen, lineHeight: ms(16)}}>No current fever. Baseline temperature 36.8{'\u00B0'}C is healthy and stable.</AppText>
        </View>
        <View style={{backgroundColor: 'rgba(217,119,6,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
          <AppText style={{fontSize: ms(10), color: '#FCD34D', lineHeight: ms(16)}}>In T2DM: any temp {'\u2265'}38{'\u00B0'}C triggers higher glucose. Check blood sugar during fever.</AppText>
        </View>
        <View style={{backgroundColor: 'rgba(220,38,38,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
          <AppText style={{fontSize: ms(10), color: '#FCA5A5', lineHeight: ms(16)}}>Seek care if temperature reaches {'\u2265'}39{'\u00B0'}C - risk of DKA is elevated in T2DM at high fever.</AppText>
        </View>
      </View>
    </View>

    {/* Temperature zones */}
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="thermometer-outline" iconBg={Colors.tealBg} title="Temperature classification" subtitle="Standard clinical thresholds (oral measurement)" />
      <View style={st.cardBody}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(3)}}>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Hypo {'<'}35</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Normal</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Low-grade</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Fever</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>High</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Crisis</AppText>
        </View>
        <View style={{flexDirection: 'row', borderRadius: ms(6), overflow: 'hidden', height: ms(12), marginBottom: vs(4)}}>
          {ZONE_SEGS.map((z, i) => <View key={i} style={{flex: z.flex, backgroundColor: z.color, height: '100%'}} />)}
        </View>
        <View style={{position: 'relative', height: ms(18), marginBottom: vs(8)}}>
          <View style={{position: 'absolute', left: '39%'}}>
            <View style={{width: ms(2), height: ms(10), backgroundColor: Colors.textPrimary, alignSelf: 'center'}} />
            <AppText style={{fontSize: ms(9), fontWeight: '800', color: Colors.textPrimary}}>You 36.8{'\u00B0'}C</AppText>
          </View>
        </View>
        {[
          {color: Colors.accent, label: 'Normal', range: '36.1-37.2\u00B0C - no action needed'},
          {color: Colors.amber, label: 'Low-grade fever', range: '37.3-37.9\u00B0C - monitor, rest, hydrate'},
          {color: Colors.red, label: 'Fever', range: '38.0-38.9\u00B0C - check glucose, antipyretic if needed'},
          {color: '#922B21', label: 'High fever', range: '39.0-39.9\u00B0C - seek medical attention'},
          {color: '#2d0d0d', label: 'Crisis', range: '\u226540\u00B0C - emergency care immediately'},
        ].map((z, i) => (
          <View key={i} style={{flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(5)}}>
            <View style={{width: ms(10), height: ms(10), borderRadius: ms(5), backgroundColor: z.color}} />
            <AppText style={{fontSize: ms(10), color: '#333', flex: 1}}><AppText style={{fontWeight: '700'}}>{z.label}</AppText> {z.range}</AppText>
          </View>
        ))}
      </View>
    </Card>

    {/* When to act */}
    <Card>
      <CardHeader icon="alert-circle-outline" iconBg={Colors.redBg} title="When to act - T2DM guidance" subtitle="Fever management specific to Priya's conditions" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.accent} text="36.1-37.2\u00B0C (Normal) - continue regular monitoring. Check glucose as usual." />
        <InsightRow dotColor={Colors.amber} text="37.3-37.9\u00B0C (Low-grade) - rest, hydrate, monitor temp every 4-6h. Check blood glucose - may rise 20-40 mg/dL. No medication change needed unless glucose persistently elevated." />
        <InsightRow dotColor={Colors.red} text="38.0-38.9\u00B0C (Fever) - take paracetamol (500-1000 mg). Check glucose every 2-4h. Contact Dr. Kavitha if fever persists >48h. BP may rise - take Olmesartan as scheduled." />
        <InsightRow dotColor="#922B21" text="\u226539\u00B0C (High fever) - seek medical attention same day. Risk of DKA increases sharply. Bring your TrustLife temperature log." isLast />
      </View>
    </Card>
  </View>
);

// ══ Tab 1: Trends ══
const TrendsPanel = () => (
  <View>
    {/* Time of day */}
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="time-outline" iconBg={Colors.tealBg} title="Temperature by time of day" subtitle="Average reading by time - normal diurnal variation" />
      <View style={{padding: 0}}>
        <PatternRow label="Early morning" pct={62} barColor={Colors.accent} value="36.6\u00B0C" valueColor={Colors.primary} />
        <PatternRow label="Morning" pct={66} barColor={Colors.accent} value="36.8\u00B0C" valueColor={Colors.primary} />
        <PatternRow label="Afternoon" pct={70} barColor={Colors.accent} value="37.0\u00B0C" valueColor={Colors.primary} />
        <PatternRow label="Evening" pct={72} barColor={Colors.accent} value="37.1\u00B0C" valueColor={Colors.primary} />
        <PatternRow label="Night" pct={65} barColor={Colors.accent} value="36.7\u00B0C" valueColor={Colors.primary} isLast />
      </View>
      <View style={{backgroundColor: Colors.background, borderTopWidth: 0.5, borderTopColor: '#edf2ef', padding: ms(10)}}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary, lineHeight: ms(15)}}>Body temperature rises 0.3-0.5{'\u00B0'}C naturally through the day. Early morning readings are the most reliable baseline.</AppText>
      </View>
    </Card>

    {/* URTI timeline */}
    <Card>
      <CardHeader icon="calendar-outline" iconBg={Colors.redBg} title="Dec 2025 URTI episode - timeline" subtitle="Temperature trajectory over 7-day illness" />
      <View style={st.cardBody}>
        <View style={{flexDirection: 'row', gap: s(5), height: vs(70), position: 'relative', marginBottom: vs(6)}}>
          <View style={{position: 'absolute', bottom: '26%', left: 0, right: 0, borderTopWidth: 1.5, borderStyle: 'dashed', borderTopColor: 'rgba(29,158,117,0.4)'}} />
          <BarCol topLabel="36.9" topColor={Colors.accent} height={vs(18)} barColor={Colors.accent} bottomLabel="4D" />
          <BarCol topLabel="38.4" topColor={Colors.red} height={vs(68)} barColor={Colors.red} bottomLabel="5D" />
          <BarCol topLabel="38.3" topColor={Colors.red} height={vs(62)} barColor={Colors.red} bottomLabel="6D" />
          <BarCol topLabel="38.2" topColor={Colors.red} height={vs(58)} barColor={Colors.red} bottomLabel="7D" />
          <BarCol topLabel="38.1" topColor={Colors.red} height={vs(54)} barColor={Colors.red} bottomLabel="9D" />
          <BarCol topLabel="37.8" topColor={Colors.amber} height={vs(40)} barColor={Colors.amber} bottomLabel="12D" />
          <BarCol topLabel="36.9" topColor={Colors.accent} height={vs(18)} barColor={Colors.accent} bottomLabel="4J" />
        </View>
        <AppText style={{fontSize: ms(9), color: Colors.textTertiary, textAlign: 'center', marginBottom: vs(8)}}>Dec dates: 4/5/6/7/9/12 - 4 Jan resolved - dashed = 37.3{'\u00B0'}C threshold</AppText>
        <View style={{backgroundColor: Colors.tealBg, borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
          <AppText style={{fontSize: ms(10), color: Colors.tealText, lineHeight: ms(16)}}>Total duration: 7 days to below threshold, full resolution by 4 Jan. Typical URTI course. FBG rose from 112 to 148 mg/dL during peak fever - expected glucose stress response in T2DM.</AppText>
        </View>
      </View>
    </Card>
  </View>
);

// ══ Tab 2: Conditions ══
const ConditionsPanel = () => (
  <View>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="flask-outline" iconBg={Colors.amberBg} title="T2DM - Fever raises blood glucose" subtitle="Stress hormones trigger glucose release during fever" />
      <View style={st.cardBody}>
        <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(8)}}>
          <View style={{flex: 1, backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>FBG at 36.9{'\u00B0'}C</AppText>
            <AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.tealDark}}>112</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>mg/dL baseline</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>FBG at 38.4{'\u00B0'}C</AppText>
            <AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.red}}>148</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>mg/dL peak fever</AppText>
          </View>
        </View>
        <InsightRow dotColor={Colors.red} text="Fever triggers cortisol and adrenaline release, which cause the liver to release glucose - raising FBG even without eating. Each 1\u00B0C fever raise can increase FBG by 15-30 mg/dL." />
        <InsightRow dotColor={Colors.amber} text="During any fever, check blood glucose every 2-4 hours. If FBG exceeds 200 mg/dL during illness, contact Dr. Kavitha - Metformin dose may need temporary adjustment." />
        <InsightRow dotColor={Colors.red} text="At fever \u226539\u00B0C: risk of DKA (diabetic ketoacidosis) rises significantly. Symptoms - deep rapid breathing, fruity breath, confusion - require emergency care." isLast />
      </View>
    </Card>

    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="heart-outline" iconBg={Colors.redBg} title="Hypertension - Fever elevates BP" subtitle="Fever-driven cardiac output increase raises systolic BP" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="Fever increases heart rate and cardiac output, temporarily raising systolic BP by 10-20 mmHg. Even paracetamol use can raise BP by 5-10 mmHg through prostaglandin pathways." />
        <InsightRow dotColor={Colors.tealDark} text="During fever: continue Olmesartan as scheduled. If BP reading exceeds 150/95 during illness, call Dr. Kavitha. Avoid NSAIDs (ibuprofen) if possible - paracetamol is the safer antipyretic for HTN." isLast />
      </View>
    </Card>

    <Card>
      <CardHeader icon="clipboard-outline" iconBg={Colors.blueBg} title="Sick day rules - Priya's medication plan" subtitle="What to do when temperature \u226538\u00B0C" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.accent} text="Continue: Olmesartan, Metformin (unless vomiting or unable to eat - then pause Metformin and call Dr. Kavitha)." />
        <InsightRow dotColor={Colors.accent} text="Antipyretic: Paracetamol 500-1000 mg every 6h (preferred over ibuprofen for HTN patients). Do not exceed 4g/24h." />
        <InsightRow dotColor={Colors.accent} text="Hydration: 2-3L water/day during fever. Dehydration worsens blood glucose control and can precipitate kidney stress (given Priya's borderline eGFR 72)." />
        <InsightRow dotColor={Colors.red} text="Call Dr. Kavitha if: fever persists >48h, temperature \u226539\u00B0C, glucose >200 mg/dL, unable to take medications, or any chest pain / breathing difficulty." isLast />
      </View>
    </Card>
  </View>
);

// Tabs
const TABS = [
  {key: 'overview', label: 'Overview', icon: 'grid-outline'},
  {key: 'trends', label: 'Trends', icon: 'trending-up-outline'},
  {key: 'conditions', label: 'Conditions', icon: 'medical-outline'},
];

// Main Screen
const TempAyuIntelScreen = () => {
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
            <AppText style={st.headerTitle}>Temperature Analysis</AppText>
            <AppText style={st.headerSub}>Fever history - Condition risk - Patterns</AppText>
          </View>
          <TouchableOpacity style={st.shareBtn}><Icon family="Ionicons" name="share-outline" size={ms(16)} color={Colors.white} /></TouchableOpacity>
        </View>
        <View style={st.statsRowH}>
          <View style={st.statBoxH}><AppText style={st.statLabelH}>Baseline</AppText><AppText style={st.statValueH}>36.8{'\u00B0'}C</AppText><AppText style={st.statSubH}>personal avg</AppText></View>
          <View style={st.statBoxH}><AppText style={st.statLabelH}>Last fever</AppText><AppText style={st.statValueH}>Dec 25</AppText><AppText style={st.statSubH}>URTI - 38.4{'\u00B0'}C</AppText></View>
          <View style={[st.statBoxH, {borderRightWidth: 0}]}><AppText style={st.statLabelH}>Readings</AppText><AppText style={st.statValueH}>42</AppText><AppText style={st.statSubH}>since Oct 25</AppText></View>
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
        {activeTab === 'trends' && <TrendsPanel />}
        {activeTab === 'conditions' && <ConditionsPanel />}
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

export {OverviewPanel as TempOverviewPanel, TrendsPanel as TempTrendsPanel, ConditionsPanel as TempConditionsPanel};
export default TempAyuIntelScreen;
