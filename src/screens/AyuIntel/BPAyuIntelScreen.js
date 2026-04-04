import React, {useState} from 'react';
import {View, StyleSheet, StatusBar, ScrollView, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

// ── Reusable components (same pattern as GlucoseAyuIntelScreen) ──

const Card = ({children, style, padded}) => (
  <View style={[st.card, padded && {padding: ms(13)}, style]}>{children}</View>
);

const CardHeader = ({icon, iconBg, title, subtitle}) => (
  <View style={st.cardHdr}>
    <View style={[st.cardHdrIco, {backgroundColor: iconBg}]}>
      <Icon family="Ionicons" name={icon} size={ms(15)} color={Colors.textPrimary} />
    </View>
    <View style={{flex: 1}}>
      <AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.textPrimary}}>{title}</AppText>
      <AppText style={{fontSize: ms(10), color: Colors.textSecondary, marginTop: vs(1)}}>{subtitle}</AppText>
    </View>
  </View>
);

const InsightRow = ({dotColor, text, isLast}) => (
  <View style={[st.insightRow, isLast && {borderBottomWidth: 0}]}>
    <View style={[st.irDot, {backgroundColor: dotColor}]} />
    <AppText style={{flex: 1, fontSize: ms(11), color: '#333', lineHeight: ms(18)}}>{text}</AppText>
  </View>
);

const BarCol = ({topLabel, topColor, height, barColor, bottomLabel, bottomBold}) => (
  <View style={{flex: 1, alignItems: 'center'}}>
    <AppText style={{fontSize: ms(8), fontWeight: '700', color: topColor, marginBottom: vs(2)}}>{topLabel}</AppText>
    <View style={{flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'center'}}>
      <View style={{width: '100%', borderTopLeftRadius: ms(3), borderTopRightRadius: ms(3), backgroundColor: barColor, height}} />
    </View>
    <AppText style={{fontSize: ms(8), color: bottomBold ? Colors.textSecondary : Colors.textTertiary, fontWeight: bottomBold ? '700' : '400', marginTop: vs(2)}}>{bottomLabel}</AppText>
  </View>
);

const PatternRow = ({label, pct, barColor, value, valueColor, pillText, pillBg, pillColor, isLast}) => (
  <View style={[st.patRow, isLast && {borderBottomWidth: 0}]}>
    <AppText style={{fontSize: ms(11), fontWeight: '600', color: Colors.textPrimary, width: s(80), flexShrink: 0}}>{label}</AppText>
    <View style={{flex: 1}}>
      <View style={st.patBar}><View style={[st.patFill, {width: `${pct}%`, backgroundColor: barColor}]} /></View>
    </View>
    <AppText style={{fontSize: ms(11), fontWeight: '700', color: valueColor, minWidth: s(42), textAlign: 'right'}}>{value}</AppText>
    <View style={[st.pill, {backgroundColor: pillBg, marginLeft: s(4)}]}>
      <AppText style={{fontSize: ms(9), fontWeight: '700', color: pillColor}}>{pillText}</AppText>
    </View>
  </View>
);

// ── Tab 0: Overview ──

const OverviewPanel = () => (
  <View>
    {/* Ayu narrative */}
    <View style={st.intelBand}>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: 'rgba(255,255,255,0.4)', marginBottom: vs(8)}}>Ayu Intel</AppText>
      <AppText style={{fontSize: ms(13), fontWeight: '600', color: Colors.white, lineHeight: ms(22), marginBottom: vs(10)}}>
        Your BP is <AppText style={{color: Colors.paleGreen, fontWeight: '700'}}>declining on Olmesartan</AppText> - 142 to 136 mmHg systolic in 3 months. The medication is working. The remaining gap to 130/80 is driven by two modifiable factors: <AppText style={{color: '#FCD34D', fontWeight: '700'}}>sodium excess (2,100 mg/day)</AppText> and <AppText style={{color: '#FCD34D', fontWeight: '700'}}>low-activity days</AppText>. On days with 6,000+ steps, your BP averages <AppText style={{color: Colors.paleGreen, fontWeight: '700'}}>128/82</AppText> - already at target.
      </AppText>
      <View style={{gap: vs(6)}}>
        <View style={{backgroundColor: 'rgba(220,38,38,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
          <AppText style={{fontSize: ms(10), color: '#FCA5A5', lineHeight: ms(16)}}>Monday readings avg +8 mmHg higher - weekend altered routine raises cortisol by Monday morning.</AppText>
        </View>
        <View style={{backgroundColor: 'rgba(13,148,136,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
          <AppText style={{fontSize: ms(10), color: Colors.paleGreen, lineHeight: ms(16)}}>Evening BP is avg 4 mmHg lower than morning - no nocturnal hypertension pattern detected.</AppText>
        </View>
        <View style={{backgroundColor: 'rgba(217,119,6,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
          <AppText style={{fontSize: ms(10), color: '#FCD34D', lineHeight: ms(16)}}>Sodium at 2,100 mg/day is fighting Olmesartan - each 500 mg reduction = ~2-3 mmHg systolic drop.</AppText>
        </View>
      </View>
    </View>

    {/* % at target */}
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="checkmark-circle-outline" iconBg="#FBEAF0" title="Readings at target - March 2026" subtitle={'Target: Systolic <130 AND Diastolic <80 mmHg'} />
      <View style={st.cardBody}>
        <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(10)}}>
          <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(11), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(4)}}>At target</AppText>
            <AppText style={{fontSize: ms(26), fontWeight: '800', color: Colors.tealDark}}>42%</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>13 readings</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(11), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(4)}}>Above target</AppText>
            <AppText style={{fontSize: ms(26), fontWeight: '800', color: Colors.amber}}>39%</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>12 readings</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), padding: ms(11), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(4)}}>High</AppText>
            <AppText style={{fontSize: ms(26), fontWeight: '800', color: Colors.red}}>19%</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>6 readings</AppText>
          </View>
        </View>
        <View style={{flexDirection: 'row', height: ms(10), borderRadius: ms(5), overflow: 'hidden', gap: 2, marginBottom: vs(6)}}>
          <View style={{flex: 42, backgroundColor: Colors.accent, borderRadius: ms(3)}} />
          <View style={{flex: 39, backgroundColor: Colors.amber, borderRadius: ms(3)}} />
          <View style={{flex: 19, backgroundColor: Colors.red, borderRadius: ms(3)}} />
        </View>
        <View style={{backgroundColor: Colors.amberBg, borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
          <AppText style={{fontSize: ms(10), color: Colors.amberDark, lineHeight: ms(16)}}>At current trajectory, % at target should reach 55-60% by May 2026 if sodium is reduced and activity maintained.</AppText>
        </View>
      </View>
    </Card>

    {/* Medication effect */}
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="medkit-outline" iconBg={Colors.purpleBg} title="Medication effect" subtitle="Olmesartan 20mg + Amlodipine 5mg - since Jan 2026" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.primary} text="Olmesartan 96% adherence - almost perfect. This is the primary reason BP is declining. Sustain this at every refill." />
        <InsightRow dotColor={Colors.primary} text="Amlodipine 100% adherence - exemplary. Side effect: bilateral ankle oedema (noted in symptom log)." />
        <InsightRow dotColor={Colors.amber} text="Combined effect so far: -6 mmHg systolic in 3 months. Full effect expected at 4-6 month mark (May 2026)." isLast />
      </View>
    </Card>

    {/* Priority actions */}
    <Card>
      <CardHeader icon="checkmark-done-outline" iconBg={Colors.tealBg} title="Priority actions" subtitle="Ranked by expected BP impact" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="Cut sodium to <1,500 mg/day - remove pickles, papad, and packaged snacks. These three account for ~800 mg of excess daily. Expected drop: -4 to -6 mmHg systolic." />
        <InsightRow dotColor={Colors.red} text="Reach 8,000 steps/day - you're at 6,240 currently. 6k+ step days already show BP 128/82. 8k would consolidate this as baseline." />
        <InsightRow dotColor={Colors.amber} text="Sleep by 11 PM on weeknights - current avg 11:48 PM. Late sleep raises cortisol and higher Monday morning BP (avg 144/90 on Mondays)." />
        <InsightRow dotColor={Colors.amber} text="Home BP monitoring: both arms weekly - left arm consistently 2-4 mmHg higher. Ayu is flagging this pattern for Dr. Meera to review." isLast />
      </View>
    </Card>
  </View>
);

// ── Tab 1: Trends ──

const TrendsPanel = () => (
  <View>
    <Card padded style={{marginBottom: vs(10)}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(14)}}>
        <View style={{flex: 1}}>
          <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary}}>Systolic BP - 6-month trend</AppText>
          <AppText style={{fontSize: ms(10), color: Colors.textTertiary, marginTop: vs(1)}}>Monthly avg - mmHg</AppText>
        </View>
        <View style={[st.pill, {backgroundColor: Colors.tealBg}]}>
          <AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.tealText}}>Improving</AppText>
        </View>
      </View>
      <View style={{flexDirection: 'row', gap: s(5), height: vs(100)}}>
        <BarCol topLabel="142" topColor={Colors.red} height={vs(76)} barColor={Colors.red} bottomLabel="Oct" />
        <BarCol topLabel="141" topColor={Colors.red} height={vs(72)} barColor={Colors.red} bottomLabel="Nov" />
        <BarCol topLabel="140" topColor={Colors.red} height={vs(68)} barColor={Colors.red} bottomLabel="Dec" />
        <BarCol topLabel="138" topColor={Colors.amber} height={vs(58)} barColor={Colors.amber} bottomLabel="Jan" />
        <BarCol topLabel="137" topColor={Colors.amber} height={vs(52)} barColor={Colors.amber} bottomLabel="Feb" />
        <BarCol topLabel="136" topColor={Colors.amber} height={vs(46)} barColor={Colors.amber} bottomLabel="Mar" bottomBold />
      </View>
      <AppText style={{fontSize: ms(9), color: Colors.textTertiary, textAlign: 'center', marginTop: vs(6)}}>Target: {'<'}130 mmHg</AppText>
    </Card>

    <Card padded style={{marginBottom: vs(10)}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(14)}}>
        <View style={{flex: 1}}>
          <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary}}>Diastolic BP - 6-month trend</AppText>
        </View>
        <View style={[st.pill, {backgroundColor: Colors.tealBg}]}>
          <AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.tealText}}>Improving</AppText>
        </View>
      </View>
      <View style={{flexDirection: 'row', gap: s(5), height: vs(100)}}>
        <BarCol topLabel="93" topColor={Colors.red} height={vs(76)} barColor={Colors.red} bottomLabel="Oct" />
        <BarCol topLabel="92" topColor={Colors.red} height={vs(68)} barColor={Colors.red} bottomLabel="Nov" />
        <BarCol topLabel="91" topColor={Colors.amber} height={vs(60)} barColor={Colors.amber} bottomLabel="Dec" />
        <BarCol topLabel="89" topColor={Colors.amber} height={vs(48)} barColor={Colors.amber} bottomLabel="Jan" />
        <BarCol topLabel="87" topColor={Colors.amber} height={vs(38)} barColor={Colors.amber} bottomLabel="Feb" />
        <BarCol topLabel="86" topColor={Colors.amber} height={vs(30)} barColor={Colors.amber} bottomLabel="Mar" bottomBold />
      </View>
      <AppText style={{fontSize: ms(9), color: Colors.textTertiary, textAlign: 'center', marginTop: vs(6)}}>Target: {'<'}80 mmHg</AppText>
    </Card>

    <Card padded>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(14)}}>Monitoring adherence - readings/month</AppText>
      <View style={{flexDirection: 'row', gap: s(5), height: vs(80)}}>
        <BarCol topLabel="8" topColor={Colors.textTertiary} height={vs(12)} barColor="#dde8e2" bottomLabel="Oct" />
        <BarCol topLabel="12" topColor={Colors.textTertiary} height={vs(18)} barColor="#dde8e2" bottomLabel="Nov" />
        <BarCol topLabel="18" topColor={Colors.textTertiary} height={vs(28)} barColor={Colors.paleGreen} bottomLabel="Dec" />
        <BarCol topLabel="22" topColor={Colors.textTertiary} height={vs(36)} barColor={Colors.paleGreen} bottomLabel="Jan" />
        <BarCol topLabel="28" topColor={Colors.textTertiary} height={vs(46)} barColor={Colors.accent} bottomLabel="Feb" />
        <BarCol topLabel="31" topColor={Colors.primary} height={vs(56)} barColor={Colors.primary} bottomLabel="Mar" bottomBold />
      </View>
      <AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.primary, textAlign: 'center', marginTop: vs(8)}}>Monitoring improving month-on-month</AppText>
    </Card>
  </View>
);

// ── Tab 2: Patterns ──

const PatternsPanel = () => (
  <View>
    {/* By time of day */}
    <Card style={{marginBottom: vs(10)}}>
      <View style={{paddingVertical: vs(10), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'}}>
        <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary}}>Average BP by time of day</AppText>
      </View>
      <PatternRow label="Morning" pct={66} barColor={Colors.amber} value="138/88" valueColor={Colors.amber} pillText="Above" pillBg={Colors.amberBg} pillColor={Colors.amberDark} />
      <PatternRow label="Afternoon" pct={60} barColor={Colors.amber} value="136/85" valueColor={Colors.amber} pillText="Above" pillBg={Colors.amberBg} pillColor={Colors.amberDark} />
      <PatternRow label="Evening" pct={54} barColor={Colors.accent} value="134/83" valueColor={Colors.tealDark} pillText="Better" pillBg={Colors.tealBg} pillColor={Colors.tealText} isLast />
      <View style={{backgroundColor: '#f4faf8', borderTopWidth: 0.5, borderTopColor: '#edf2ef', paddingVertical: vs(8), paddingHorizontal: s(13)}}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary}}>Morning BP is consistently 4 mmHg higher - normal diurnal pattern. No nocturnal hypertension flag.</AppText>
      </View>
    </Card>

    {/* By day of week */}
    <Card padded style={{marginBottom: vs(10)}}>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(10)}}>Systolic by day of week</AppText>
      <View style={{flexDirection: 'row', gap: s(5), height: vs(75)}}>
        <BarCol topLabel="144" topColor={Colors.red} height={vs(54)} barColor={Colors.red} bottomLabel="M" />
        <BarCol topLabel="136" topColor={Colors.amber} height={vs(38)} barColor={Colors.amber} bottomLabel="T" />
        <BarCol topLabel="132" topColor={Colors.accent} height={vs(28)} barColor={Colors.accent} bottomLabel="W" />
        <BarCol topLabel="135" topColor={Colors.amber} height={vs(34)} barColor={Colors.amber} bottomLabel="Th" />
        <BarCol topLabel="128" topColor={Colors.accent} height={vs(18)} barColor={Colors.accent} bottomLabel="F" bottomBold />
        <BarCol topLabel="136" topColor={Colors.amber} height={vs(38)} barColor={Colors.amber} bottomLabel="S" />
        <BarCol topLabel="140" topColor={Colors.red} height={vs(48)} barColor={Colors.red} bottomLabel="Su" />
      </View>
      <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginTop: vs(8)}}>
        Mondays avg <AppText style={{fontSize: ms(9), color: Colors.red, fontWeight: '700'}}>+8 mmHg</AppText> higher - weekend cortisol spike carrying into Monday morning.
      </AppText>
    </Card>

    {/* Activity impact */}
    <Card padded style={{marginBottom: vs(10)}}>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(8)}}>Activity impact on BP</AppText>
      <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(8)}}>
        <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(11), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(4)}}>6,000+ steps days</AppText>
          <View style={{flexDirection: 'row', alignItems: 'baseline', gap: s(2)}}>
            <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.tealDark}}>128</AppText>
            <AppText style={{fontSize: ms(13), fontWeight: '300', color: Colors.paleGreen}}>/</AppText>
            <AppText style={{fontSize: ms(14), fontWeight: '700', color: Colors.tealDark}}>82</AppText>
          </View>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary, marginTop: vs(2)}}>avg mmHg</AppText>
        </View>
        <View style={{flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), padding: ms(11), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(4)}}>Low-activity days</AppText>
          <View style={{flexDirection: 'row', alignItems: 'baseline', gap: s(2)}}>
            <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.red}}>138</AppText>
            <AppText style={{fontSize: ms(13), fontWeight: '300', color: '#F7C1C1'}}>/</AppText>
            <AppText style={{fontSize: ms(14), fontWeight: '700', color: Colors.red}}>90</AppText>
          </View>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary, marginTop: vs(2)}}>avg mmHg</AppText>
        </View>
      </View>
      <View style={{backgroundColor: Colors.amberBg, borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
        <AppText style={{fontSize: ms(10), color: Colors.amberDark, lineHeight: ms(16)}}>Physical activity is your strongest non-medication BP lever - a 10 mmHg systolic difference from walking alone. On active days you are already at target.</AppText>
      </View>
    </Card>

    {/* Sleep impact */}
    <Card padded>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(8)}}>Sleep impact on morning BP</AppText>
      <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(6)}}>
        <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(10), color: Colors.textSecondary, marginBottom: vs(3)}}>Sleep {'>='} 7h</AppText>
          <View style={{flexDirection: 'row', alignItems: 'baseline', gap: s(2)}}>
            <AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.tealDark}}>130</AppText>
            <AppText style={{fontSize: ms(11), fontWeight: '300', color: Colors.paleGreen}}>/</AppText>
            <AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.tealDark}}>82</AppText>
          </View>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary, marginTop: vs(2)}}>avg morning BP</AppText>
        </View>
        <View style={{flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(10), color: Colors.textSecondary, marginBottom: vs(3)}}>Sleep {'<'} 6h</AppText>
          <View style={{flexDirection: 'row', alignItems: 'baseline', gap: s(2)}}>
            <AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.red}}>140</AppText>
            <AppText style={{fontSize: ms(11), fontWeight: '300', color: '#F7C1C1'}}>/</AppText>
            <AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.red}}>90</AppText>
          </View>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary, marginTop: vs(2)}}>avg morning BP</AppText>
        </View>
      </View>
      <View style={{backgroundColor: Colors.amberBg, borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
        <AppText style={{fontSize: ms(10), color: Colors.amberDark, lineHeight: ms(16)}}>Poor sleep raises nocturnal sympathetic tone and cortisol. Sleeping by 11 PM consistently would improve morning BP by an estimated 8-10 mmHg systolic.</AppText>
      </View>
    </Card>
  </View>
);

// ── Tabs ──

const TABS = [
  {key: 'overview', label: 'Overview', icon: 'grid-outline'},
  {key: 'trends', label: 'Trends', icon: 'trending-up-outline'},
  {key: 'patterns', label: 'Patterns', icon: 'stats-chart-outline'},
];

// ── Main Screen ──

const BPAyuIntelScreen = () => {
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
            <AppText style={st.headerTitle}>BP Analysis</AppText>
            <AppText style={st.headerSub}>Patterns - Drivers - Recommendations</AppText>
          </View>
          <TouchableOpacity style={st.shareBtn}>
            <Icon family="Ionicons" name="share-outline" size={ms(16)} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Stats row */}
        <View style={st.statsRow}>
          <View style={st.statBox}><AppText style={st.statLabel}>Avg SYS</AppText><AppText style={st.statValue}>136</AppText><AppText style={st.statSub}>mmHg</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>% At target</AppText><AppText style={st.statValue}>42%</AppText><AppText style={st.statSub}>{'<'}130/80</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>Improving</AppText><AppText style={st.statValue}>-6</AppText><AppText style={st.statSub}>since Jan</AppText></View>
          <View style={[st.statBox, {borderRightWidth: 0}]}><AppText style={st.statLabel}>Readings</AppText><AppText style={st.statValue}>31</AppText><AppText style={st.statSub}>March</AppText></View>
        </View>
      </View>

      {/* Tabs */}
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
        {activeTab === 'patterns' && <PatternsPanel />}
      </ScrollView>
    </View>
  );
};

// ── Styles ──

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingTop: vs(10), paddingBottom: vs(8), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(11)},
  shareBtn: {width: ms(30), height: ms(30), borderRadius: ms(9), backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center'},
  statsRow: {flexDirection: 'row', borderTopWidth: 0.5, borderTopColor: 'rgba(255,255,255,0.1)', marginTop: vs(8)},
  statBox: {flex: 1, paddingVertical: vs(8), paddingHorizontal: s(10), borderRightWidth: 0.5, borderRightColor: 'rgba(255,255,255,0.1)'},
  statLabel: {fontSize: ms(8), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.5, color: 'rgba(255,255,255,0.38)', marginBottom: vs(2)},
  statValue: {fontSize: ms(15), fontWeight: '700', color: Colors.white},
  statSub: {fontSize: ms(8), color: 'rgba(255,255,255,0.38)', marginTop: vs(1)},
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
  pill: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(8)},
  patRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(9), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'},
  patBar: {height: ms(7), borderRadius: ms(3), backgroundColor: Colors.background, overflow: 'hidden'},
  patFill: {height: '100%', borderRadius: ms(3)},
});

export {OverviewPanel as BPOverviewPanel, TrendsPanel as BPTrendsPanel, PatternsPanel as BPPatternsPanel};
export default BPAyuIntelScreen;
