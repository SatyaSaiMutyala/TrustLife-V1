import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

// ──────────────────────────────────────────────
// Reusable sub-components
// ──────────────────────────────────────────────

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

const InsightRow = ({dotColor, text, badge, badgeBg, badgeColor, isLast}) => (
  <View style={[st.insightRow, isLast && {borderBottomWidth: 0}]}>
    <View style={[st.irDot, {backgroundColor: dotColor}]} />
    <AppText style={{flex: 1, fontSize: ms(11), color: '#333', lineHeight: ms(18)}}>
      {text}
    </AppText>
    {badge && (
      <View style={[st.irBadge, {backgroundColor: badgeBg}]}>
        <AppText style={{fontSize: ms(9), fontWeight: '700', color: badgeColor}}>{badge}</AppText>
      </View>
    )}
  </View>
);

const RiskBar = ({label, level, levelColor, pct, barColor, desc}) => (
  <View style={{marginBottom: vs(10)}}>
    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(3)}}>
      <AppText style={{fontSize: ms(11), fontWeight: '600', color: Colors.textPrimary}}>{label}</AppText>
      <AppText style={{fontSize: ms(11), fontWeight: '700', color: levelColor}}>{level}</AppText>
    </View>
    <View style={st.riskBar}>
      <View style={[st.riskFill, {width: `${pct}%`, backgroundColor: barColor}]} />
    </View>
    <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginTop: vs(3)}}>{desc}</AppText>
  </View>
);

const MetricMini = ({label, value, sub, valueColor}) => (
  <View style={st.metricMini}>
    <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.4, marginBottom: vs(3)}}>{label}</AppText>
    <AppText style={{fontSize: ms(16), fontWeight: '800', color: valueColor || Colors.textPrimary, lineHeight: ms(18)}}>{value}</AppText>
    <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(3)}}>{sub}</AppText>
  </View>
);

const ActionBtn = ({label, bg, color, onPress}) => (
  <TouchableOpacity style={[st.actionBtn, {backgroundColor: bg}]} activeOpacity={0.7} onPress={onPress}>
    <AppText variant="caption" color={color} style={{fontWeight: '600', textAlign: 'center'}}>{label}</AppText>
  </TouchableOpacity>
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
    <AppText style={{fontSize: ms(11), fontWeight: '600', color: Colors.textPrimary, width: s(88), flexShrink: 0}}>{label}</AppText>
    <View style={{flex: 1, position: 'relative'}}>
      <View style={st.patBar}>
        <View style={[st.patFill, {width: `${pct}%`, backgroundColor: barColor}]} />
      </View>
    </View>
    <AppText style={{fontSize: ms(11), fontWeight: '700', color: valueColor, minWidth: s(48), textAlign: 'right'}}>{value}</AppText>
    <View style={[st.pill, {backgroundColor: pillBg}]}>
      <AppText style={{fontSize: ms(9), fontWeight: '700', color: pillColor}}>{pillText}</AppText>
    </View>
  </View>
);

// ──────────────────────────────────────────────
// Tab 0: Ayu Intel
// ──────────────────────────────────────────────

const AyuIntelPanel = () => (
  <View>
    {/* Overall assessment band */}
    <View style={st.intelBand}>
      <AppText variant="subtext" color="rgba(255,255,255,0.5)" style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.8, marginBottom: vs(6)}}>
        Overall glucose control
      </AppText>
      <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.white, marginBottom: vs(4)}}>
        Improving - on track
      </AppText>
      <AppText variant="caption" color="rgba(255,255,255,0.65)" style={{lineHeight: ms(18)}}>
        FBG dropped 10 mg/dL since Metformin dose increase on 5 Mar. If current trend holds, HbA1c target of 7.0% by June 2026 is achievable. Two key gaps remain: post-dinner spikes and weekend control.
      </AppText>
    </View>

    {/* Key insights */}
    <Card>
      <CardHeader icon="search-outline" iconBg={Colors.amberBg} title="What Ayu found" subtitle="Patterns from 46 readings - March 2026" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.accent} text="Fasting glucose is trending down by 10 mg/dL over March - from 131 (1 Mar) to 121 (28 Mar). This directly correlates with Metformin 1000mg started 5 Mar." badge="Positive" badgeBg={Colors.tealBg} badgeColor={Colors.tealText} />
        <InsightRow dotColor={Colors.red} text="Post-dinner glucose consistently exceeds 180 mg/dL. Average post-dinner reading is 180 mg/dL - 34 mg/dL higher than post-lunch. Dinner is your highest-risk meal." badge="Action needed" badgeBg={Colors.redBg} badgeColor={Colors.redDark} />
        <InsightRow dotColor={Colors.amber} text="Weekends (Sat/Sun) average 9 mg/dL higher than weekdays in fasting readings. Likely driven by later wake times, delayed breakfast, and weekend dinner patterns." badge="Watch" badgeBg={Colors.amberBg} badgeColor={Colors.amberDark} />
        <InsightRow dotColor={Colors.blue} text="2 readings dipped below 70 mg/dL (2% of month). Both occurred mid-afternoon after skipped meals. Not clinically significant but monitor closely with Metformin dose increase." badge="Monitor" badgeBg={Colors.blueBg} badgeColor={Colors.blueText} />
        <InsightRow dotColor={Colors.accent} text="Time in Range improved to 68% this month vs 58% in October. You are 2 percentage points away from the 70% clinical target." badge="Progress" badgeBg={Colors.tealBg} badgeColor={Colors.tealText} isLast />
      </View>
    </Card>

    {/* Risk assessment */}
    <Card style={{marginTop: vs(10)}}>
      <CardHeader icon="warning-outline" iconBg={Colors.redBg} title="Risk assessment" subtitle="Based on glucose patterns + T2DM profile" />
      <View style={st.cardBody}>
        <RiskBar label="Peripheral neuropathy risk" level="Moderate" levelColor={Colors.amber} pct={55} barColor={Colors.amber} desc="HbA1c persistently >7.5% for 6+ months. Foot tingling already reported. Physiotherapy started - continue." />
        <RiskBar label="Hypoglycaemia risk" level="Low" levelColor={Colors.tealDark} pct={18} barColor={Colors.accent} desc="2 readings below 70 in March - both after skipped meals. Carry glucose tablets when skipping meals." />
        <RiskBar label="Postprandial hyperglycaemia" level="Elevated" levelColor={Colors.red} pct={72} barColor={Colors.red} desc="30% of readings are above range, primarily post-dinner. Evening carb load is the main driver." />
      </View>
    </Card>

    {/* Correlations */}
    <Card style={{marginTop: vs(10)}}>
      <CardHeader icon="link-outline" iconBg={Colors.purpleBg} title="Correlations Ayu found" subtitle="Cross-referenced with your other health data" />
      <View style={st.cardBody}>
        <InsightRow dotColor="#854F0B" text="Sleep - Glucose: On nights with <6h sleep, your next-morning FBG averages 134 mg/dL vs 119 mg/dL on nights with 7h+ sleep. Poor sleep raises your cortisol, which raises glucose." />
        <InsightRow dotColor={Colors.primary} text="Steps - PP glucose: On days with 6,000+ steps, post-meal glucose averages 148 mg/dL vs 171 mg/dL on low-activity days. Evening walks have the strongest effect on dinner readings." />
        <InsightRow dotColor={Colors.blueText} text="Medication adherence - FBG: On days when you miss your PM Metformin dose, next-morning FBG is on average 12 mg/dL higher. Adherence is your most controllable lever." isLast />
      </View>
    </Card>

    {/* Recommendations */}
    <Card style={{marginTop: vs(10)}}>
      <CardHeader icon="bulb-outline" iconBg={Colors.tealBg} title="Ayu's recommendations" subtitle="Personalised for Priya - T2DM - Mar 2026" />
      <View style={st.cardBody}>
        {[
          {num: '1', text: '15-min after-dinner walk. This single habit can reduce your post-dinner glucose by 20-30 mg/dL, which would bring your TIR from 68% to above 70% target.', bg: Colors.primary},
          {num: '2', text: 'Reduce dinner carb portion by 25%. Replace one roti or a smaller rice serving with a salad or sabzi. This is the highest-impact dietary change for your pattern.', bg: Colors.primary},
          {num: '3', text: 'Set a Metformin PM reminder. You missed 5 evening doses in March - each costs you approximately 12 mg/dL the next morning. Tap to set a reminder now.', bg: Colors.primary},
          {num: '4', text: 'Weekend morning protocol. Set a consistent weekend wake time (within 30 min of weekdays) and eat breakfast by 8:30 AM to avoid the Sat/Sun fasting spike.', bg: Colors.accent},
        ].map((r, i, arr) => (
          <View key={i} style={[st.insightRow, i === arr.length - 1 && {borderBottomWidth: 0}]}>
            <View style={[st.numCircle, {backgroundColor: r.bg}]}>
              <AppText style={{fontSize: ms(11), fontWeight: '700', color: Colors.white}}>{r.num}</AppText>
            </View>
            <AppText style={{flex: 1, fontSize: ms(11), color: '#333', lineHeight: ms(18)}}>
              {r.text}
            </AppText>
          </View>
        ))}
      </View>
      <View style={st.actionRow}>
        <ActionBtn label="Meal plan" bg={Colors.primary} color={Colors.white} />
        <ActionBtn label="Set reminder" bg={Colors.tealBg} color={Colors.tealText} />
        <ActionBtn label="Share" bg={Colors.blueBg} color={Colors.blueText} />
      </View>
    </Card>

    {/* Send to doctor */}
    <TouchableOpacity style={st.doctorCard} activeOpacity={0.7}>
      <View style={st.doctorIco}>
        <Icon family="Ionicons" name="person-outline" size={ms(22)} color={Colors.primary} />
      </View>
      <View style={{flex: 1}}>
        <AppText style={{fontSize: ms(13), fontWeight: '700', color: Colors.textPrimary, marginBottom: vs(2)}}>Send to Dr. Meera Mehta</AppText>
        <AppText style={{fontSize: ms(10), color: Colors.textSecondary}}>Glucose summary + Ayu insights PDF - Next visit Jun 2026</AppText>
      </View>
      <Icon family="Ionicons" name="chevron-forward" size={ms(20)} color={Colors.primary} />
    </TouchableOpacity>
  </View>
);

// ──────────────────────────────────────────────
// Tab 1: Overview
// ──────────────────────────────────────────────

const OverviewPanel = () => (
  <View>
    {/* TIR */}
    <Card padded style={{marginBottom: vs(10)}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(4)}}>
        <View>
          <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary}}>Time in range - March 2026</AppText>
          <View style={{flexDirection: 'row', alignItems: 'baseline', marginTop: vs(2)}}>
            <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.primary}}>68%</AppText>
            <AppText style={{fontSize: ms(12), fontWeight: '400', color: Colors.textTertiary, marginLeft: s(4)}}>in range</AppText>
          </View>
        </View>
        <View style={[st.pill, {backgroundColor: Colors.amberBg}]}>
          <AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.amberDark}}>Target: {'>'}70%</AppText>
        </View>
      </View>
      <View style={st.tirBar}>
        <View style={[st.tirSeg, {width: '2%', backgroundColor: Colors.blueBg}]} />
        <View style={[st.tirSeg, {width: '68%', backgroundColor: Colors.accent}]} />
        <View style={[st.tirSeg, {width: '30%', backgroundColor: Colors.amber}]} />
      </View>
      <View style={{flexDirection: 'row', gap: s(12), marginTop: vs(6)}}>
        {[
          {c: Colors.blueBg, v: '2%', vc: Colors.blueText, l: 'Low <70'},
          {c: Colors.accent, v: '68%', vc: Colors.primary, l: 'In range'},
          {c: Colors.amber, v: '30%', vc: Colors.amberDark, l: 'High >180'},
        ].map((t, i) => (
          <View key={i} style={{flexDirection: 'row', alignItems: 'center', gap: s(5)}}>
            <View style={{width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: t.c}} />
            <View>
              <AppText style={{fontSize: ms(9), fontWeight: '700', color: t.vc}}>{t.v}</AppText>
              <AppText style={{fontSize: ms(9), color: '#666'}}>{t.l}</AppText>
            </View>
          </View>
        ))}
      </View>
    </Card>

    {/* Metrics grid */}
    <View style={{flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: vs(10)}}>
      {[
        {l: 'Avg fasting (FBG)', v: '125', u: ' mg/dL', vc: Colors.amber, sub: 'Target: <130', pct: 78},
        {l: 'Avg post-meal (PP)', v: '158', u: ' mg/dL', vc: Colors.amber, sub: 'Target: <180', pct: 66},
        {l: 'Lowest reading', v: '96', u: ' mg/dL', vc: Colors.tealDark, sub: '23 Mar - Pre-lunch'},
        {l: 'Highest reading', v: '218', u: ' mg/dL', vc: Colors.red, sub: '8 Mar - Post-dinner'},
      ].map((m, i) => (
        <View key={i} style={st.metricGridCard}>
          <AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(4)}}>{m.l}</AppText>
          <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
            <AppText style={{fontSize: ms(22), fontWeight: '700', color: m.vc}}>{m.v}</AppText>
            <AppText style={{fontSize: ms(11), fontWeight: '400', color: Colors.textTertiary}}>{m.u}</AppText>
          </View>
          <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginTop: vs(3)}}>{m.sub}</AppText>
          {m.pct !== undefined && (
            <View style={[st.habitBar, {marginTop: vs(6)}]}>
              <View style={{height: '100%', width: `${m.pct}%`, backgroundColor: m.vc, borderRadius: ms(3)}} />
            </View>
          )}
        </View>
      ))}
    </View>

    {/* Weekly trend bars - Fasting */}
    <Card padded style={{marginBottom: vs(10)}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(14)}}>
        <View style={{flex: 1}}>
          <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary}}>Weekly averages - March 2026</AppText>
          <AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.textSecondary, marginTop: vs(2)}}>Fasting (FBG)</AppText>
        </View>
      </View>
      <View style={{flexDirection: 'row', gap: s(6), height: vs(100)}}>
        <BarCol topLabel="130" topColor={Colors.amber} height={vs(38)} barColor={Colors.amber} bottomLabel="W1" />
        <BarCol topLabel="128" topColor={Colors.amber} height={vs(33)} barColor={Colors.amber} bottomLabel="W2" />
        <BarCol topLabel="123" topColor={Colors.amber} height={vs(26)} barColor={Colors.amber} bottomLabel="W3" />
        <BarCol topLabel="120" topColor={Colors.accent} height={vs(20)} barColor={Colors.accent} bottomLabel="W4" />
      </View>
    </Card>

    {/* Weekly trend bars - Post-meal */}
    <Card padded style={{marginBottom: vs(10)}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(14)}}>
        <View style={{flex: 1}}>
          <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary}}>Weekly averages - March 2026</AppText>
          <AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.textSecondary, marginTop: vs(2)}}>Post-meal (PP)</AppText>
        </View>
      </View>
      <View style={{flexDirection: 'row', gap: s(6), height: vs(100)}}>
        <BarCol topLabel="172" topColor={Colors.red} height={vs(46)} barColor={Colors.red} bottomLabel="W1" />
        <BarCol topLabel="165" topColor={Colors.red} height={vs(42)} barColor={Colors.red} bottomLabel="W2" />
        <BarCol topLabel="153" topColor={Colors.amber} height={vs(34)} barColor={Colors.amber} bottomLabel="W3" />
        <BarCol topLabel="148" topColor={Colors.amber} height={vs(28)} barColor={Colors.amber} bottomLabel="W4" />
      </View>
      <AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.primary, textAlign: 'center', marginTop: vs(8)}}>
        Improving - Metformin 1000mg started 5 Mar
      </AppText>
    </Card>

    {/* HbA1c correlation */}
    <Card padded>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(4)}}>HbA1c correlation</AppText>
      <AppText style={{fontSize: ms(10), color: Colors.textTertiary, marginBottom: vs(12)}}>3-month average glucose reflected in HbA1c</AppText>

      {/* Timeline row: each point is value + dot + date stacked vertically, lines connect between dots */}
      <View style={{flexDirection: 'row', alignItems: 'flex-start', paddingHorizontal: s(4)}}>
        {/* Point 1: 7.2% */}
        <View style={{alignItems: 'center'}}>
          <AppText style={{fontSize: ms(11), fontWeight: '800', color: Colors.primary, marginBottom: vs(3)}}>7.2%</AppText>
          <View style={{width: ms(12), height: ms(12), borderRadius: ms(6), backgroundColor: Colors.primary, borderWidth: 2, borderColor: Colors.white}} />
          <AppText style={{fontSize: ms(8), color: Colors.textTertiary, marginTop: vs(3)}}>Mar 25</AppText>
        </View>
        {/* Line 1-2 */}
        <View style={{flex: 1, justifyContent: 'center', paddingTop: vs(12)}}>
          <View style={{height: 2, backgroundColor: Colors.amber}} />
        </View>
        {/* Point 2: 7.5% */}
        <View style={{alignItems: 'center'}}>
          <AppText style={{fontSize: ms(11), fontWeight: '800', color: Colors.amber, marginBottom: vs(3)}}>7.5%</AppText>
          <View style={{width: ms(12), height: ms(12), borderRadius: ms(6), backgroundColor: Colors.amber, borderWidth: 2, borderColor: Colors.white}} />
          <AppText style={{fontSize: ms(8), color: Colors.textTertiary, marginTop: vs(3)}}>Sep 25</AppText>
        </View>
        {/* Line 2-3 */}
        <View style={{flex: 1, justifyContent: 'center', paddingTop: vs(12)}}>
          <View style={{height: 2, backgroundColor: Colors.red}} />
        </View>
        {/* Point 3: 7.8% */}
        <View style={{alignItems: 'center'}}>
          <AppText style={{fontSize: ms(11), fontWeight: '800', color: Colors.red, marginBottom: vs(3)}}>7.8%</AppText>
          <View style={{width: ms(12), height: ms(12), borderRadius: ms(6), backgroundColor: Colors.red, borderWidth: 2, borderColor: Colors.white}} />
          <AppText style={{fontSize: ms(8), color: Colors.textTertiary, marginTop: vs(3)}}>Mar 26</AppText>
        </View>
        {/* Line 3-4 (dashed) */}
        <View style={{flex: 1, justifyContent: 'center', paddingTop: vs(12)}}>
          <View style={{height: 0, borderTopWidth: 2, borderStyle: 'dashed', borderColor: '#dde8e2'}} />
        </View>
        {/* Point 4: 7.0% target */}
        <View style={{alignItems: 'center'}}>
          <AppText style={{fontSize: ms(11), fontWeight: '800', color: Colors.textTertiary, marginBottom: vs(3)}}>7.0%</AppText>
          <View style={{width: ms(12), height: ms(12), borderRadius: ms(6), backgroundColor: Colors.white, borderWidth: 2, borderStyle: 'dashed', borderColor: Colors.textTertiary}} />
          <AppText style={{fontSize: ms(8), color: Colors.textTertiary, marginTop: vs(3)}}>Jun 26</AppText>
        </View>
      </View>

      <View style={{backgroundColor: Colors.tealBg, borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10), marginTop: vs(10)}}>
        <AppText style={{fontSize: ms(10), color: Colors.tealText, lineHeight: ms(16)}}>
          Target 7.0% by Jun 2026 - achievable at current improvement rate.
        </AppText>
      </View>
    </Card>
  </View>
);

// ──────────────────────────────────────────────
// Tab 2: Trends
// ──────────────────────────────────────────────

const TrendsPanel = () => (
  <View>
    {/* Fasting glucose 6-month */}
    <Card padded style={{marginBottom: vs(10)}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(14)}}>
        <View style={{flex: 1}}>
          <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary}}>Fasting glucose - 6-month trend</AppText>
          <AppText style={{fontSize: ms(10), color: Colors.textTertiary, marginTop: vs(1)}}>Monthly avg - mg/dL</AppText>
        </View>
        <View style={[st.pill, {backgroundColor: Colors.tealBg}]}>
          <AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.tealText}}>Improving</AppText>
        </View>
      </View>
      <View style={{flexDirection: 'row', gap: s(5), height: vs(100)}}>
        <BarCol topLabel="138" topColor={Colors.red} height={vs(64)} barColor={Colors.red} bottomLabel="Oct" />
        <BarCol topLabel="136" topColor={Colors.red} height={vs(60)} barColor={Colors.red} bottomLabel="Nov" />
        <BarCol topLabel="138" topColor={Colors.red} height={vs(64)} barColor={Colors.red} bottomLabel="Dec" />
        <BarCol topLabel="134" topColor={Colors.amber} height={vs(52)} barColor={Colors.amber} bottomLabel="Jan" />
        <BarCol topLabel="130" topColor={Colors.amber} height={vs(40)} barColor={Colors.amber} bottomLabel="Feb" />
        <BarCol topLabel="125" topColor={Colors.amber} height={vs(28)} barColor={Colors.amber} bottomLabel="Mar" />
      </View>
      <AppText style={{fontSize: ms(9), color: Colors.textTertiary, textAlign: 'center', marginTop: vs(6)}}>Target: {'<'}130 mg/dL - Dashed line</AppText>
    </Card>

    {/* Post-meal glucose 6-month */}
    <Card padded style={{marginBottom: vs(10)}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(14)}}>
        <View style={{flex: 1}}>
          <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary}}>Post-meal glucose - 6-month trend</AppText>
        </View>
        <View style={[st.pill, {backgroundColor: Colors.tealBg}]}>
          <AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.tealText}}>Improving</AppText>
        </View>
      </View>
      <View style={{flexDirection: 'row', gap: s(5), height: vs(100)}}>
        <BarCol topLabel="195" topColor={Colors.red} height={vs(78)} barColor={Colors.red} bottomLabel="Oct" />
        <BarCol topLabel="190" topColor={Colors.red} height={vs(72)} barColor={Colors.red} bottomLabel="Nov" />
        <BarCol topLabel="188" topColor={Colors.red} height={vs(70)} barColor={Colors.red} bottomLabel="Dec" />
        <BarCol topLabel="178" topColor={Colors.amber} height={vs(56)} barColor={Colors.amber} bottomLabel="Jan" />
        <BarCol topLabel="168" topColor={Colors.amber} height={vs(42)} barColor={Colors.amber} bottomLabel="Feb" />
        <BarCol topLabel="158" topColor={Colors.amber} height={vs(28)} barColor={Colors.amber} bottomLabel="Mar" />
      </View>
      <AppText style={{fontSize: ms(9), color: Colors.textTertiary, textAlign: 'center', marginTop: vs(6)}}>Target: {'<'}180 mg/dL - Dashed line</AppText>
    </Card>

    {/* Monitoring adherence */}
    <Card padded>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(14)}}>Monitoring adherence - readings logged/month</AppText>
      <View style={{flexDirection: 'row', gap: s(5), height: vs(80)}}>
        <BarCol topLabel="18" topColor={Colors.textTertiary} height={vs(22)} barColor="#dde8e2" bottomLabel="Oct" />
        <BarCol topLabel="22" topColor={Colors.textTertiary} height={vs(28)} barColor="#dde8e2" bottomLabel="Nov" />
        <BarCol topLabel="26" topColor={Colors.textTertiary} height={vs(34)} barColor={Colors.paleGreen} bottomLabel="Dec" />
        <BarCol topLabel="32" topColor={Colors.textTertiary} height={vs(42)} barColor={Colors.paleGreen} bottomLabel="Jan" />
        <BarCol topLabel="38" topColor={Colors.textTertiary} height={vs(50)} barColor={Colors.accent} bottomLabel="Feb" />
        <BarCol topLabel="46" topColor={Colors.primary} height={vs(58)} barColor={Colors.primary} bottomLabel="Mar" bottomBold />
      </View>
      <AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.primary, textAlign: 'center', marginTop: vs(8)}}>
        Monitoring adherence improving month-on-month
      </AppText>
    </Card>
  </View>
);

// ──────────────────────────────────────────────
// Tab 3: Patterns
// ──────────────────────────────────────────────

const PatternsPanel = () => (
  <View>
    {/* Average by meal type */}
    <Card style={{marginBottom: vs(10)}}>
      <View style={{paddingVertical: vs(10), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'}}>
        <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary}}>Average by meal type - March 2026</AppText>
      </View>
      <PatternRow label="Fasting" pct={52} barColor={Colors.amber} value="125" valueColor={Colors.amber} pillText="Above" pillBg={Colors.amberBg} pillColor={Colors.amberDark} />
      <PatternRow label="Post-breakfast" pct={58} barColor={Colors.amber} value="152" valueColor={Colors.amber} pillText="Above" pillBg={Colors.amberBg} pillColor={Colors.amberDark} />
      <PatternRow label="Pre-lunch" pct={38} barColor={Colors.accent} value="104" valueColor={Colors.tealDark} pillText="OK" pillBg={Colors.tealBg} pillColor={Colors.tealText} />
      <PatternRow label="Post-lunch" pct={55} barColor={Colors.accent} value="146" valueColor={Colors.tealDark} pillText="OK" pillBg={Colors.tealBg} pillColor={Colors.tealText} />
      <PatternRow label="Post-dinner" pct={76} barColor={Colors.red} value="180" valueColor={Colors.red} pillText="High" pillBg={Colors.redBg} pillColor={Colors.redDark} />
      <PatternRow label="Bedtime" pct={52} barColor={Colors.accent} value="141" valueColor={Colors.tealDark} pillText="OK" pillBg={Colors.tealBg} pillColor={Colors.tealText} isLast />
      <View style={{backgroundColor: '#f4faf8', borderTopWidth: 0.5, borderTopColor: '#edf2ef', paddingVertical: vs(8), paddingHorizontal: s(13)}}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary}}>Post-dinner is your highest-risk meal - avg 34 mg/dL higher than post-lunch.</AppText>
      </View>
    </Card>

    {/* FBG by day of week */}
    <Card padded style={{marginBottom: vs(10)}}>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(10)}}>FBG by day of week</AppText>
      <View style={{flexDirection: 'row', gap: s(5), height: vs(75)}}>
        <BarCol topLabel="122" topColor={Colors.accent} height={vs(28)} barColor={Colors.accent} bottomLabel="M" />
        <BarCol topLabel="126" topColor={Colors.amber} height={vs(34)} barColor={Colors.amber} bottomLabel="T" />
        <BarCol topLabel="124" topColor={Colors.accent} height={vs(30)} barColor={Colors.accent} bottomLabel="W" />
        <BarCol topLabel="130" topColor={Colors.amber} height={vs(40)} barColor={Colors.amber} bottomLabel="Th" />
        <BarCol topLabel="119" topColor={Colors.accent} height={vs(24)} barColor={Colors.accent} bottomLabel="F" bottomBold />
        <BarCol topLabel="128" topColor={Colors.amber} height={vs(38)} barColor={Colors.amber} bottomLabel="S" />
        <BarCol topLabel="132" topColor={Colors.red} height={vs(44)} barColor={Colors.red} bottomLabel="Su" />
      </View>
      <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginTop: vs(8)}}>
        Weekends avg <AppText style={{fontSize: ms(9), color: Colors.red, fontWeight: '700'}}>+9 mg/dL</AppText> higher - altered meal timings and sleep patterns.
      </AppText>
    </Card>

    {/* Sleep impact */}
    <Card padded>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(8)}}>Sleep impact on next-morning FBG</AppText>
      <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(6)}}>
        <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(10), color: Colors.textSecondary, marginBottom: vs(3)}}>Sleep {'>='} 7h</AppText>
          <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.tealDark}}>119</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>mg/dL avg FBG</AppText>
        </View>
        <View style={{flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(10), color: Colors.textSecondary, marginBottom: vs(3)}}>Sleep {'<'} 6h</AppText>
          <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.red}}>134</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>mg/dL avg FBG</AppText>
        </View>
      </View>
      <View style={{backgroundColor: Colors.amberBg, borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
        <AppText style={{fontSize: ms(10), color: Colors.amberDark, lineHeight: ms(16)}}>
          Poor sleep raises cortisol, which raises your fasting glucose by an average of 15 mg/dL. Sleep is your second biggest lever after medication.
        </AppText>
      </View>
    </Card>
  </View>
);

// ──────────────────────────────────────────────
// Tab definitions
// ──────────────────────────────────────────────

const TABS = [
  {key: 'intel', label: 'Ayu Intel', icon: 'bulb-outline'},
  {key: 'overview', label: 'Overview', icon: 'grid-outline'},
  {key: 'trends', label: 'Trends', icon: 'trending-up-outline'},
  {key: 'patterns', label: 'Patterns', icon: 'stats-chart-outline'},
];

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const GlucoseAyuIntelScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('intel');

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={st.headerTitle}>Ayu Intelligence</AppText>
            <AppText variant="caption" style={st.headerSub}>Updated 28 Mar 2026 - Based on 46 readings</AppText>
          </View>
          <TouchableOpacity style={st.shareBtn}>
            <Icon family="Ionicons" name="share-outline" size={ms(16)} color={Colors.white} />
          </TouchableOpacity>
        </View>
      </View>

      {/* Tabs */}
      <View style={st.tabContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{paddingHorizontal: s(13), gap: s(5)}}>
          {TABS.map(tab => {
            const active = activeTab === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[st.tab, active && st.tabActive]}
                onPress={() => setActiveTab(tab.key)}
                activeOpacity={0.7}>
                <Icon family="Ionicons" name={tab.icon} size={ms(12)} color={active ? Colors.primary : 'rgba(255,255,255,0.5)'} style={{marginRight: s(4)}} />
                <AppText variant="small" color={active ? Colors.primary : 'rgba(255,255,255,0.5)'} style={{fontWeight: '600'}}>
                  {tab.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Content */}
      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: s(12), paddingBottom: vs(40)}} showsVerticalScrollIndicator={false}>
        {activeTab === 'intel' && <AyuIntelPanel />}
        {activeTab === 'overview' && <OverviewPanel />}
        {activeTab === 'trends' && <TrendsPanel />}
        {activeTab === 'patterns' && <PatternsPanel />}
      </ScrollView>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  // Header
  header: {backgroundColor: Colors.primary, paddingTop: vs(10), paddingBottom: vs(10), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(2)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(11)},
  shareBtn: {width: ms(30), height: ms(30), borderRadius: ms(9), backgroundColor: 'rgba(255,255,255,0.12)', alignItems: 'center', justifyContent: 'center'},

  // Tabs
  tabContainer: {backgroundColor: Colors.primary, paddingBottom: vs(10)},
  tab: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(10), backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)'},
  tabActive: {backgroundColor: Colors.white, borderColor: Colors.white},

  // Intel band
  intelBand: {backgroundColor: Colors.primary, padding: ms(16), borderRadius: ms(14), marginBottom: vs(10)},

  // Cards
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, overflow: 'hidden'},
  cardHdr: {flexDirection: 'row', alignItems: 'center', gap: s(8), paddingVertical: vs(12), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#edf2ef'},
  cardHdrIco: {width: ms(32), height: ms(32), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center', flexShrink: 0},
  cardBody: {paddingVertical: vs(11), paddingHorizontal: s(13)},

  // Insight rows
  insightRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(9), paddingVertical: vs(8), borderBottomWidth: 0.5, borderBottomColor: '#f4f4f4'},
  irDot: {width: ms(8), height: ms(8), borderRadius: ms(4), marginTop: vs(4)},
  irBadge: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(8), flexShrink: 0, marginTop: vs(2)},
  numCircle: {width: ms(22), height: ms(22), borderRadius: ms(7), backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center', flexShrink: 0},

  // Risk bar
  riskBar: {height: ms(8), borderRadius: ms(4), backgroundColor: '#edf2ef', overflow: 'hidden'},
  riskFill: {height: '100%', borderRadius: ms(4)},

  // Metric mini
  metricMini: {backgroundColor: Colors.background, borderRadius: ms(10), padding: ms(9)},

  // Action row
  actionRow: {flexDirection: 'row', gap: s(8), paddingVertical: vs(10), paddingHorizontal: s(13), borderTopWidth: 0.5, borderTopColor: '#f0f4f2'},
  actionBtn: {flex: 1, paddingVertical: vs(9), borderRadius: ms(9), alignItems: 'center'},

  // Doctor card
  doctorCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(13), flexDirection: 'row', alignItems: 'center', gap: s(12), marginTop: vs(10)},
  doctorIco: {width: ms(44), height: ms(44), borderRadius: ms(12), backgroundColor: '#EAF3DE', alignItems: 'center', justifyContent: 'center'},

  // Pill
  pill: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(8)},

  // TIR bar
  tirBar: {flexDirection: 'row', height: ms(10), borderRadius: ms(5), overflow: 'hidden', gap: 1, marginVertical: vs(6)},
  tirSeg: {height: '100%', borderRadius: ms(3)},

  // Metric grid card
  metricGridCard: {width: '48%', backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(11), marginBottom: vs(8)},

  // Habit bar
  habitBar: {height: ms(5), backgroundColor: '#edf2ef', borderRadius: ms(3), overflow: 'hidden'},

  // Pattern row
  patRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(9), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'},
  patBar: {height: ms(7), borderRadius: ms(3), backgroundColor: Colors.background, overflow: 'hidden'},
  patFill: {height: '100%', borderRadius: ms(3)},
});

export {AyuIntelPanel, OverviewPanel, TrendsPanel, PatternsPanel, TABS as GLUCOSE_INTEL_TABS};
export default GlucoseAyuIntelScreen;
