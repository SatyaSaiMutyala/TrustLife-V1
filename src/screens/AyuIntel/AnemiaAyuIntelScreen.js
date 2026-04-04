import React, {useState} from 'react';
import {View, StyleSheet, StatusBar, ScrollView, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const Card = ({children, style}) => (<View style={[st.card, style]}>{children}</View>);
const CardHeader = ({icon, iconBg, title, subtitle}) => (<View style={st.cardHdr}><View style={[st.cardHdrIco, {backgroundColor: iconBg}]}><Icon family="Ionicons" name={icon} size={ms(15)} color={Colors.textPrimary} /></View><View style={{flex: 1}}><AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.textPrimary}}>{title}</AppText><AppText style={{fontSize: ms(10), color: Colors.textSecondary, marginTop: vs(1)}}>{subtitle}</AppText></View></View>);
const InsightRow = ({dotColor, text, isLast}) => (<View style={[st.insightRow, isLast && {borderBottomWidth: 0}]}><View style={[st.irDot, {backgroundColor: dotColor}]} /><AppText style={{flex: 1, fontSize: ms(11), color: '#333', lineHeight: ms(18)}}>{text}</AppText></View>);
const PatternRow = ({label, pct, barColor, value, valueColor, isLast}) => (<View style={[st.patRow, isLast && {borderBottomWidth: 0}]}><AppText style={{fontSize: ms(11), fontWeight: '600', color: Colors.textPrimary, width: s(100), flexShrink: 0}}>{label}</AppText><View style={{flex: 1}}><View style={st.patBar}><View style={[st.patFill, {width: `${pct}%`, backgroundColor: barColor}]} /></View></View><AppText style={{fontSize: ms(11), fontWeight: '700', color: valueColor, minWidth: s(60), textAlign: 'right'}}>{value}</AppText></View>);

// ── Overview ──
const OverviewPanel = () => (
  <View>
    <View style={st.intelBand}>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: 'rgba(255,255,255,0.38)', marginBottom: vs(8)}}>Ayu Intel</AppText>
      <AppText style={{fontSize: ms(13), fontWeight: '600', color: Colors.white, lineHeight: ms(22), marginBottom: vs(10)}}>
        Priya has <AppText style={{color: '#FCA5A5', fontWeight: '700'}}>mild iron-deficiency anaemia (Hb 11.8 g/dL)</AppText> - improving from 10.6 since Sep 2024. Primary cause is <AppText style={{color: '#FCD34D', fontWeight: '700'}}>low ferritin (8 {'\u03BC'}g/L)</AppText> with microcytic pattern. Additionally, <AppText style={{color: '#FCD34D', fontWeight: '700'}}>B12 at 312 pg/mL is borderline</AppText> - Metformin reduces B12 absorption.
      </AppText>
      <View style={{gap: vs(6)}}>
        <View style={{backgroundColor: 'rgba(220,38,38,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}><AppText style={{fontSize: ms(10), color: '#FCA5A5', lineHeight: ms(16)}}>Ferritin 8 {'\u03BC'}g/L - iron stores critically low. Target {'\u2265'}30 for symptom resolution.</AppText></View>
        <View style={{backgroundColor: 'rgba(13,148,136,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}><AppText style={{fontSize: ms(10), color: Colors.paleGreen, lineHeight: ms(16)}}>Hb improving - +1.2 g/dL since Sep 2024. Iron supplement working. Target 12.0 in ~3 months.</AppText></View>
        <View style={{backgroundColor: 'rgba(217,119,6,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}><AppText style={{fontSize: ms(10), color: '#FCD34D', lineHeight: ms(16)}}>B12 312 pg/mL - borderline. Metformin blocks B12 absorption. Annual B12 test essential.</AppText></View>
      </View>
    </View>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="water-outline" iconBg={Colors.redBg} title="Haemoglobin status - 11.8 g/dL" subtitle="WHO classification for women" />
      <View style={st.cardBody}>
        <View style={{flexDirection: 'row', borderRadius: ms(6), overflow: 'hidden', height: ms(12), marginBottom: vs(4)}}>
          <View style={{flex: 10, backgroundColor: '#2d0d0d'}} />
          <View style={{flex: 10, backgroundColor: '#c0392b'}} />
          <View style={{flex: 10, backgroundColor: Colors.red}} />
          <View style={{flex: 10, backgroundColor: Colors.amber}} />
          <View style={{flex: 60, backgroundColor: Colors.accent}} />
        </View>
        <View style={{flexDirection: 'row', gap: s(8), marginTop: vs(8)}}>
          <View style={{flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Current Hb</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.red}}>11.8</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>g/dL Mild</AppText></View>
          <View style={{flex: 1, backgroundColor: Colors.background, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Baseline</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: '#c0392b'}}>10.6</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Sep 2024</AppText></View>
          <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Target</AppText><AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.tealDark}}>{'\u2265'}12.0</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>g/dL</AppText></View>
        </View>
      </View>
    </Card>
    <Card>
      <CardHeader icon="checkmark-done-outline" iconBg={Colors.tealBg} title="Priority actions" subtitle="Ranked by impact on Hb recovery" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="Take ferrous sulphate every morning on empty stomach with Vitamin C (lemon juice) - current 78% adherence means ~6 missed doses/month. Vitamin C doubles iron absorption." />
        <InsightRow dotColor={Colors.red} text="Never take iron with tea, coffee, or dairy - tannins and calcium block up to 60% of iron absorption. Wait 2 hours between iron supplement and any of these." />
        <InsightRow dotColor={Colors.amber} text="Request B12 test at next CBC - at 312 pg/mL, B12 is at the lower edge. Metformin is a known cause of B12 depletion. If below 300, supplementation needed." />
        <InsightRow dotColor={Colors.amber} text="Add iron-rich foods to two meals daily - lentils (dal), spinach, sesame seeds (til), jaggery (gudh), and pomegranate. Aim for 18 mg dietary iron/day." isLast />
      </View>
    </Card>
  </View>
);

// ── Iron & B12 ──
const IronB12Panel = () => (
  <View>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="fitness-outline" iconBg={Colors.redBg} title="Iron deficiency - Microcytic anaemia" subtitle="Ferritin 8 - MCV 74 - Serum iron 38 - TIBC 420" />
      <View style={st.cardBody}>
        <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(8)}}>
          <View style={{flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Ferritin</AppText><AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.red}}>8 {'\u03BC'}g/L</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>target {'\u2265'}30</AppText></View>
          <View style={{flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>MCV</AppText><AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.red}}>74 fL</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>target 80-100</AppText></View>
          <View style={{flex: 1, backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>TIBC</AppText><AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.amber}}>420</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>elevated</AppText></View>
        </View>
        <InsightRow dotColor={Colors.red} text="The pattern - low ferritin (8) + low MCV (74) + elevated TIBC (420) - is classic iron deficiency anaemia. Ferritin must reach 30+ before red cell size normalises." />
        <InsightRow dotColor={Colors.amber} text="Ferritin 8 means iron stores are almost empty. Hb typically lags ferritin recovery by 4-6 weeks - expect Hb to improve to 12.0 in ~3 months with consistent supplementation." isLast />
      </View>
    </Card>
    <Card>
      <CardHeader icon="medical-outline" iconBg={Colors.amberBg} title="Vitamin B12 - Metformin risk" subtitle="B12 312 pg/mL - borderline - Metformin 500mg" />
      <View style={st.cardBody}>
        <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(8)}}>
          <View style={{flex: 1, backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Current B12</AppText><AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.amber}}>312 pg/mL</AppText><AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>normal {'\u2265'}300</AppText></View>
          <View style={{flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}><AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Deficiency risk</AppText><AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.red}}>High</AppText><View style={{height: ms(5), backgroundColor: '#edf2ef', borderRadius: ms(3), overflow: 'hidden', width: '100%', marginTop: vs(4)}}><View style={{height: '100%', width: '80%', backgroundColor: Colors.red, borderRadius: ms(3)}} /></View></View>
        </View>
        <InsightRow dotColor={Colors.red} text="Metformin blocks calcium-dependent B12 absorption in the terminal ileum. After 4+ years of use, 30% of patients develop B12 deficiency. Priya is on Metformin since 2019 (7 years) - high-risk." />
        <InsightRow dotColor={Colors.amber} text="B12 deficiency causes megaloblastic anaemia which can mask iron deficiency. If B12 falls below 200, neurological symptoms (tingling, numbness) can appear." />
        <InsightRow dotColor={Colors.tealDark} text="Action: Discuss with Dr. Kavitha - options include B12 supplement (1000 mcg daily oral), quarterly B12 injections, or calcium supplements. Annual B12 monitoring is mandatory." isLast />
      </View>
    </Card>
  </View>
);

// ── Conditions ──
const ConditionsPanel = () => (
  <View>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="flask-outline" iconBg={Colors.amberBg} title="T2DM - Anaemia affects HbA1c accuracy" subtitle="Low Hb falsely elevates HbA1c readings" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="Critical: Priya's HbA1c of 7.8% may be falsely elevated by anaemia. When total Hb is low, red blood cells live longer, accumulating more glucose attachment. This can artificially raise HbA1c by 0.5-1.0%." />
        <InsightRow dotColor={Colors.amber} text="True glycaemic control may be better than 7.8% suggests. As Hb improves toward 12.0, HbA1c readings will become more accurate and may fall without any change in diabetes management." />
        <InsightRow dotColor={Colors.tealDark} text="Ayu will flag this on every HbA1c reading until Hb normalises. When Hb reaches 12.0, request a repeat HbA1c to get the true glycaemic picture." isLast />
      </View>
    </Card>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="heart-outline" iconBg={Colors.redBg} title="Hypertension - Anaemia increases cardiac load" subtitle="Heart works harder when Hb is low" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="When Hb is low, the heart must pump faster to deliver adequate oxygen. This increases cardiac output by 10-20% in mild anaemia - directly raising systolic BP and heart rate. Priya's resting HR of 74-88 bpm partly reflects this." />
        <InsightRow dotColor={Colors.tealDark} text="Correcting anaemia is expected to lower resting HR by 5-10 bpm and reduce cardiac workload that worsens BP control." isLast />
      </View>
    </Card>
    <Card>
      <CardHeader icon="pulse-outline" iconBg={Colors.blueBg} title="SpO2 97% does not mean full oxygen delivery" subtitle="Saturation vs. oxygen-carrying capacity" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.amber} text="SpO2 97% means 97% of haemoglobin is saturated with oxygen - but with Hb only 11.8, there are fewer molecules to saturate. Total oxygen delivery is ~15% lower than normal despite a 'good' SpO2. This explains breathlessness on exertion despite normal pulse oximeter." isLast />
      </View>
    </Card>
  </View>
);

// ── Diet & Absorption ──
const DietPanel = () => (
  <View>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="leaf-outline" iconBg={Colors.tealBg} title="Iron-rich foods - Indian diet" subtitle="Dietary iron to support supplementation" />
      <View style={{padding: 0}}>
        <PatternRow label="Masoor dal" pct={80} barColor={Colors.primary} value="7.6mg/cup" valueColor={Colors.primary} />
        <PatternRow label="Spinach (palak)" pct={65} barColor={Colors.accent} value="6.4mg/cup" valueColor={Colors.primary} />
        <PatternRow label="Til (sesame)" pct={55} barColor={Colors.primary} value="5.1mg/tbsp" valueColor={Colors.primary} />
        <PatternRow label="Jaggery (gudh)" pct={48} barColor={Colors.amber} value="4.7mg/100g" valueColor={Colors.amber} />
        <PatternRow label="Pomegranate" pct={30} barColor={Colors.amber} value="0.3mg + C" valueColor={Colors.amber} />
        <PatternRow label="Chicken (dark)" pct={45} barColor={Colors.primary} value="1.3mg/100g" valueColor={Colors.primary} isLast />
      </View>
      <View style={{backgroundColor: Colors.redBg, borderTopWidth: 0.5, borderTopColor: '#edf2ef', padding: ms(10)}}>
        <AppText style={{fontSize: ms(10), color: Colors.redDark, lineHeight: ms(16)}}>Non-haem iron (dal, spinach) absorbs better with Vitamin C. Adding lemon juice to dal and spinach dishes increases iron bioavailability by 2-3x.</AppText>
      </View>
    </Card>
    <Card>
      <CardHeader icon="close-circle-outline" iconBg={Colors.amberBg} title="Iron absorption blockers" subtitle="Foods and drinks to avoid within 2 hours of iron supplement" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="Tea and coffee - tannins bind iron and reduce absorption by up to 60%. The morning chai is the single biggest iron absorption blocker in the Indian diet. Wait 2h after iron tablet." />
        <InsightRow dotColor={Colors.red} text="Dairy / milk - calcium strongly competes with iron for absorption. Never take iron supplement with milk, curd, or paneer. Loses ~50% effectiveness." />
        <InsightRow dotColor={Colors.amber} text="Antacids and PPIs - if prescribed omeprazole or pantoprazole, take iron at least 4 hours apart. Acid is needed to convert iron to absorbable form." />
        <InsightRow dotColor={Colors.amber} text="Phytates in whole grains - roti from whole wheat can reduce iron absorption when eaten at the same time as supplement. Take iron on empty stomach." isLast />
      </View>
    </Card>
  </View>
);

const TABS = [
  {key: 'overview', label: 'Overview', icon: 'grid-outline'},
  {key: 'iron', label: 'Iron & B12', icon: 'fitness-outline'},
  {key: 'conditions', label: 'Conditions', icon: 'medical-outline'},
  {key: 'diet', label: 'Diet & absorption', icon: 'leaf-outline'},
];

const AnemiaAyuIntelScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('overview');

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()}><Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} /></TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}><AppText style={st.headerTitle}>Anaemia Analysis</AppText><AppText style={st.headerSub}>Iron deficiency - B12 risk - Condition impact</AppText></View>
          <TouchableOpacity style={st.shareBtn}><Icon family="Ionicons" name="share-outline" size={ms(16)} color={Colors.white} /></TouchableOpacity>
        </View>
        <View style={st.statsRowH}>
          <View style={st.statBoxH}><AppText style={st.statLabelH}>Hb</AppText><AppText style={st.statValueH}>11.8 g/dL</AppText><AppText style={st.statSubH}>Improving</AppText></View>
          <View style={st.statBoxH}><AppText style={st.statLabelH}>Type</AppText><AppText style={st.statValueH}>Iron def.</AppText><AppText style={st.statSubH}>microcytic</AppText></View>
          <View style={[st.statBoxH, {borderRightWidth: 0}]}><AppText style={st.statLabelH}>B12 risk</AppText><AppText style={st.statValueH}>Watch</AppText><AppText style={st.statSubH}>Metformin</AppText></View>
        </View>
      </View>
      <View style={st.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: s(13), gap: s(5)}}>
          {TABS.map(tab => {
            const active = activeTab === tab.key;
            return (<TouchableOpacity key={tab.key} style={[st.tab, active && st.tabActive]} onPress={() => setActiveTab(tab.key)} activeOpacity={0.7}><Icon family="Ionicons" name={tab.icon} size={ms(12)} color={active ? Colors.primary : 'rgba(255,255,255,0.5)'} style={{marginRight: s(4)}} /><AppText style={{fontSize: ms(11), fontWeight: '600', color: active ? Colors.primary : 'rgba(255,255,255,0.5)'}}>{tab.label}</AppText></TouchableOpacity>);
          })}
        </ScrollView>
      </View>
      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: s(12), paddingBottom: vs(40)}} showsVerticalScrollIndicator={false}>
        {activeTab === 'overview' && <OverviewPanel />}
        {activeTab === 'iron' && <IronB12Panel />}
        {activeTab === 'conditions' && <ConditionsPanel />}
        {activeTab === 'diet' && <DietPanel />}
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
  statLabelH: {fontSize: ms(8), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, color: 'rgba(255,255,255,0.35)', marginBottom: vs(2)},
  statValueH: {fontSize: ms(15), fontWeight: '700', color: Colors.white},
  statSubH: {fontSize: ms(8), color: 'rgba(255,255,255,0.35)', marginTop: vs(1)},
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

export {OverviewPanel as AnemiaOverviewPanel, IronB12Panel as AnemiaIronB12Panel, ConditionsPanel as AnemiaConditionsPanel, DietPanel as AnemiaDietPanel};
export default AnemiaAyuIntelScreen;
