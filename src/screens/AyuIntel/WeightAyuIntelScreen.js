import React, {useState} from 'react';
import {View, StyleSheet, StatusBar, ScrollView, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

// Reusable
const Card = ({children, style, padded}) => (<View style={[st.card, padded && {padding: ms(13)}, style]}>{children}</View>);
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
const BarCol = ({topLabel, topColor, height, barColor, bottomLabel, bottomBold}) => (
  <View style={{flex: 1, alignItems: 'center'}}>
    <AppText style={{fontSize: ms(8), fontWeight: '700', color: topColor, marginBottom: vs(2)}}>{topLabel}</AppText>
    <View style={{flex: 1, width: '100%', justifyContent: 'flex-end', alignItems: 'center'}}>
      <View style={{width: '100%', borderTopLeftRadius: ms(3), borderTopRightRadius: ms(3), backgroundColor: barColor, height}} />
    </View>
    <AppText style={{fontSize: ms(8), color: bottomBold ? Colors.textSecondary : Colors.textTertiary, fontWeight: bottomBold ? '700' : '400', marginTop: vs(2)}}>{bottomLabel}</AppText>
  </View>
);
const CompareRow = ({label, value, valueColor, arrow, arrowColor, note, noteColor, isLast}) => (
  <View style={[st.compareRow, isLast && {borderBottomWidth: 0}]}>
    <AppText style={{flex: 1, fontSize: ms(11), color: Colors.textSecondary, fontWeight: '600'}}>{label}</AppText>
    <AppText style={{fontSize: ms(12), fontWeight: '700', color: valueColor}}>{value}</AppText>
    {arrow && <AppText style={{fontSize: ms(13), color: arrowColor, width: s(18), textAlign: 'center'}}>{arrow}</AppText>}
    <AppText style={{fontSize: ms(12), fontWeight: '700', color: noteColor, minWidth: s(52), textAlign: 'right'}}>{note}</AppText>
  </View>
);
const PatternRow = ({label, pct, barColor, value, valueColor, pillText, pillBg, pillColor, isLast}) => (
  <View style={[st.patRow, isLast && {borderBottomWidth: 0}]}>
    <AppText style={{fontSize: ms(11), fontWeight: '600', color: Colors.textPrimary, width: s(90), flexShrink: 0}}>{label}</AppText>
    <View style={{flex: 1}}><View style={st.patBar}><View style={[st.patFill, {width: `${pct}%`, backgroundColor: barColor}]} /></View></View>
    <AppText style={{fontSize: ms(11), fontWeight: '700', color: valueColor, minWidth: s(44), textAlign: 'right'}}>{value}</AppText>
    {pillText && <View style={[st.pill, {backgroundColor: pillBg, marginLeft: s(4)}]}><AppText style={{fontSize: ms(9), fontWeight: '700', color: pillColor}}>{pillText}</AppText></View>}
  </View>
);

// ── BMI Zone Bar ──
const BMIZoneBar = ({currentBMI, markerLabel}) => {
  const zones = [
    {label: 'Under', range: '<18.5', color: Colors.blue, width: '18%'},
    {label: 'Normal', range: '18.5-22.9', color: Colors.tealDark, width: '22%'},
    {label: 'OW', range: '23-24.9', color: Colors.amber, width: '20%'},
    {label: 'Obese I', range: '25-29.9', color: '#E67E22', width: '20%'},
    {label: 'Obese II', range: '>=30', color: Colors.red, width: '20%'},
  ];
  const pct = Math.min(100, Math.max(0, ((currentBMI - 15) / 20) * 100));
  return (
    <View>
      <View style={{flexDirection: 'row', borderRadius: ms(6), overflow: 'hidden', height: ms(10), marginBottom: vs(4)}}>
        {zones.map((z, i) => (
          <View key={i} style={{width: z.width, backgroundColor: z.color, height: '100%'}} />
        ))}
      </View>
      <View style={{position: 'relative', height: ms(16)}}>
        <View style={{position: 'absolute', left: `${pct}%`, marginLeft: -ms(6), top: 0, alignItems: 'center'}}>
          <Icon family="Ionicons" name="caret-up" size={ms(12)} color={Colors.textPrimary} />
        </View>
      </View>
      <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
        {zones.map((z, i) => (
          <View key={i} style={{alignItems: 'center', flex: 1}}>
            <AppText style={{fontSize: ms(8), fontWeight: '600', color: z.color}}>{z.label}</AppText>
            <AppText style={{fontSize: ms(7), color: Colors.textTertiary}}>{z.range}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
};

// ── Percentile Bar ──
const PercentileBar = ({label, pct, color, value, isLast}) => (
  <View style={[{flexDirection: 'row', alignItems: 'center', gap: s(8), paddingVertical: vs(8), borderBottomWidth: isLast ? 0 : 0.5, borderBottomColor: '#f0f4f2'}]}>
    <AppText style={{fontSize: ms(10), fontWeight: '600', color: Colors.textSecondary, width: s(70)}}>{label}</AppText>
    <View style={{flex: 1, height: ms(7), borderRadius: ms(3), backgroundColor: '#edf2ef', overflow: 'hidden'}}>
      <View style={{width: `${pct}%`, height: '100%', backgroundColor: color, borderRadius: ms(3)}} />
    </View>
    <AppText style={{fontSize: ms(10), fontWeight: '700', color, minWidth: s(40), textAlign: 'right'}}>{value}</AppText>
  </View>
);

// ══════════════════════════════════════════════════
// Tab 0: Overview
// ══════════════════════════════════════════════════
const OverviewPanel = () => (
  <View>
    <View style={st.intelBand}>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: 'rgba(255,255,255,0.4)', marginBottom: vs(8)}}>Ayu Intel - Full spectrum</AppText>
      <AppText style={{fontSize: ms(13), fontWeight: '600', color: Colors.white, lineHeight: ms(22), marginBottom: vs(10)}}>
        Priya's weight profile has <AppText style={{color: Colors.paleGreen, fontWeight: '700'}}>four active risk signals</AppText> - BMI 25.7 (overweight), waist 84 cm (above 80 cm), visceral fat level 10 (high), and body fat 32.4%. Of these, <AppText style={{color: '#FCD34D', fontWeight: '700'}}>visceral fat is the highest-priority</AppText> - it drives insulin resistance, HTN, and NAFLD. Good news: 4 kg lost since diagnosis, all 4 signals improving.
      </AppText>
      <View style={{gap: vs(6)}}>
        <View style={{backgroundColor: 'rgba(220,38,38,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
          <AppText style={{fontSize: ms(10), color: '#FCA5A5', lineHeight: ms(16)}}>Visceral fat 10 + Waist 84 cm = metabolic syndrome pattern. Both need to come down together.</AppText>
        </View>
        <View style={{backgroundColor: 'rgba(13,148,136,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
          <AppText style={{fontSize: ms(10), color: Colors.paleGreen, lineHeight: ms(16)}}>Weight -4 kg since diagnosis - Body fat trending down - Muscle mass preserved - Rate sustainable.</AppText>
        </View>
        <View style={{backgroundColor: 'rgba(217,119,6,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
          <AppText style={{fontSize: ms(10), color: '#FCD34D', lineHeight: ms(16)}}>At BMI 23 + waist {'<'}80 cm: HbA1c -0.7%, TG -15 mg/dL, BP -7 mmHg - without any new medication.</AppText>
        </View>
      </View>
    </View>

    {/* All measurements */}
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="clipboard-outline" iconBg={Colors.amberBg} title="All measurements - Status at a glance" subtitle="Indian standards for women 35-40 - March 2026" />
      <View style={{padding: 0}}>
        <CompareRow label="Weight" value="68.4 kg" valueColor={Colors.primary} arrow="!" arrowColor={Colors.amber} note="+7.2 to target" noteColor={Colors.amber} />
        <CompareRow label="BMI" value="25.7" valueColor={Colors.amber} arrow="!" arrowColor={Colors.amber} note={'OW >=23'} noteColor={Colors.amber} />
        <CompareRow label="Waist" value="84 cm" valueColor={Colors.amber} arrow="!" arrowColor={Colors.red} note="+4 above 80" noteColor={Colors.red} />
        <CompareRow label="Body fat" value="32.4%" valueColor={Colors.amber} arrow="!" arrowColor={Colors.amber} note="Near limit 33%" noteColor={Colors.amber} />
        <CompareRow label="Visceral fat" value="Level 10" valueColor={Colors.red} arrow="!" arrowColor={Colors.red} note={'High >=10'} noteColor={Colors.red} />
        <CompareRow label="Muscle mass" value="46.2 kg" valueColor={Colors.tealDark} arrow="" arrowColor={Colors.tealDark} note="Normal" noteColor={Colors.tealDark} />
        <CompareRow label="Height" value="163 cm" valueColor={Colors.tealDark} arrow="" arrowColor={Colors.tealDark} note={'Stable - 5\'4"'} noteColor={Colors.textSecondary} isLast />
      </View>
    </Card>

    {/* Priority actions */}
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="checkmark-done-outline" iconBg={Colors.tealBg} title="Priority actions" subtitle="Ranked by impact across all metrics" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="Post-dinner walk 5 nights/week - directly reduces visceral fat, lowers waist, burns ~90 kcal/session and reduces post-dinner glucose by 30%. Currently 3/7 nights." />
        <InsightRow dotColor={Colors.red} text="Replace white rice at dinner - 0.5 cup reduction = -80 kcal/night = -3.3 kg/year. Also reduces post-dinner glucose by ~25 mg/dL." />
        <InsightRow dotColor={Colors.amber} text="Reduce sodium to <1,500 mg/day - current ~2,100 mg causes water retention, inflates waist and scale by 0.5-1 kg." />
        <InsightRow dotColor={Colors.amber} text="Weigh fasting, same time every morning - current inconsistent conditions create +/-1.5 kg artificial variance." />
        <InsightRow dotColor={Colors.accent} text="Waist check monthly with tape - waist circumference is a better visceral fat proxy than weight. Target: below 80 cm." isLast />
      </View>
    </Card>

    {/* Progress comparison */}
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="trending-down-outline" iconBg={Colors.tealBg} title="How this compares - Personal benchmarks" subtitle="Weight vs key milestones since T2DM diagnosis" />
      <View style={{padding: 0}}>
        <CompareRow label="Last recorded (15 Mar)" value="68.4 kg" valueColor={Colors.textSecondary} note="Same" noteColor={Colors.textSecondary} />
        <CompareRow label="6 months ago (Sep 2025)" value="69.2 kg" valueColor={Colors.textSecondary} arrow="" arrowColor={Colors.primary} note="-0.8 kg" noteColor={Colors.primary} />
        <CompareRow label="At T2DM diagnosis (Sep 2019)" value="72.4 kg" valueColor={Colors.textSecondary} arrow="" arrowColor={Colors.primary} note="-4.0 kg" noteColor={Colors.primary} />
        <CompareRow label="Peak weight (Jun 2022)" value="70.2 kg" valueColor={Colors.textSecondary} arrow="" arrowColor={Colors.primary} note="-1.8 kg" noteColor={Colors.primary} />
        <CompareRow label="Target weight (BMI 23)" value="61.2 kg" valueColor={Colors.textSecondary} arrow="" arrowColor={Colors.red} note="+7.2 kg away" noteColor={Colors.red} isLast />
      </View>
    </Card>

    {/* Milestone badge */}
    <Card padded>
      <View style={{alignItems: 'center', paddingVertical: vs(8)}}>
        <View style={{width: ms(48), height: ms(48), borderRadius: ms(24), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center', marginBottom: vs(8)}}>
          <Icon family="Ionicons" name="ribbon-outline" size={ms(26)} color={Colors.tealDark} />
        </View>
        <AppText style={{fontSize: ms(13), fontWeight: '700', color: Colors.tealDark, marginBottom: vs(4)}}>4 kg Lost Since Diagnosis</AppText>
        <AppText style={{fontSize: ms(10), color: Colors.textSecondary, textAlign: 'center', lineHeight: ms(16)}}>From 72.4 kg to 68.4 kg over 6.5 years. Slow but sustainable. Body fat down 3.8%, muscle mass preserved. Keep going - next milestone: 5 kg at 67.4 kg.</AppText>
      </View>
    </Card>
  </View>
);

// ══════════════════════════════════════════════════
// Tab 1: Measurements
// ══════════════════════════════════════════════════
const MeasurementsPanel = () => (
  <View>
    {/* BMI deep dive */}
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="analytics-outline" iconBg={Colors.amberBg} title="BMI deep dive" subtitle="Indian classification - Asian cut-offs apply" />
      <View style={st.cardBody}>
        <BMIZoneBar currentBMI={25.7} />
        <View style={{flexDirection: 'row', gap: s(8), marginTop: vs(10), marginBottom: vs(8)}}>
          <View style={{flex: 1, backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Current BMI</AppText>
            <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.amber}}>25.7</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.amberText}}>Obese I (Asian)</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Target BMI</AppText>
            <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.tealDark}}>23.0</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.tealText}}>Upper normal</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.background, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Need to lose</AppText>
            <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.primary}}>7.2 kg</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>68.4 to 61.2</AppText>
          </View>
        </View>
        <InsightRow dotColor={Colors.amber} text="Asian BMI cut-offs: Normal <23, Overweight 23-24.9, Obese I 25-29.9. WHO cut-offs (Normal <25) underestimate risk for South Asians." />
        <InsightRow dotColor={Colors.primary} text="Each kg lost reduces BMI by 0.38 points. At current rate (-0.13 kg/week), BMI 23 in ~55 weeks. At 0.25 kg/week, ~29 weeks." isLast />
      </View>
    </Card>

    {/* Waist circumference */}
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="resize-outline" iconBg={Colors.redBg} title="Waist circumference" subtitle="Central adiposity marker - visceral fat proxy" />
      <View style={st.cardBody}>
        <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(10)}}>
          <View style={{flex: 1, backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Current</AppText>
            <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.amber}}>84 cm</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.amberText}}>Above target</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Target</AppText>
            <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.tealDark}}>{'<'}80 cm</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.tealText}}>Asian women</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>High risk</AppText>
            <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.red}}>{'>='}88 cm</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.redText}}>WHO cutoff</AppText>
          </View>
        </View>
        {/* Waist zone bar */}
        <View style={{marginBottom: vs(8)}}>
          <View style={{flexDirection: 'row', borderRadius: ms(4), overflow: 'hidden', height: ms(8)}}>
            <View style={{width: '57%', backgroundColor: Colors.tealDark}} />
            <View style={{width: '11%', backgroundColor: Colors.amber}} />
            <View style={{width: '32%', backgroundColor: Colors.red}} />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(3)}}>
            <AppText style={{fontSize: ms(8), color: Colors.tealDark}}>{'<'}80 Normal</AppText>
            <AppText style={{fontSize: ms(8), color: Colors.amber}}>80-87</AppText>
            <AppText style={{fontSize: ms(8), color: Colors.red}}>{'>='}88 High</AppText>
          </View>
        </View>
        <InsightRow dotColor={Colors.red} text="Waist 84 cm is 4 cm above the 80 cm Asian female target. Each 1 cm waist reduction = ~0.5 mmHg systolic BP + improved insulin sensitivity." />
        <InsightRow dotColor={Colors.amber} text="Waist-to-height ratio: 84/163 = 0.52 (target <0.50). This ratio is the best single predictor of cardiometabolic risk." />
        <InsightRow dotColor={Colors.tealDark} text="At diagnosis (Sep 2019): waist was 90 cm. Current 84 cm = 6 cm lost. Remaining 4 cm to target is achievable with continued visceral fat reduction." isLast />
      </View>
    </Card>

    {/* Body composition (BIA) */}
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="body-outline" iconBg={Colors.purpleBg} title="Body composition (BIA)" subtitle="Mi Scale 2 - Bioelectrical impedance analysis" />
      <View style={st.cardBody}>
        <PatternRow label="Body fat" pct={82} barColor={Colors.amber} value="32.7%" valueColor={Colors.amber} pillText="Near limit" pillBg={Colors.amberBg} pillColor={Colors.amberDark} />
        <PatternRow label="Muscle mass" pct={70} barColor={Colors.tealDark} value="46.2 kg" valueColor={Colors.tealDark} pillText="Normal" pillBg={Colors.tealBg} pillColor={Colors.tealText} />
        <PatternRow label="Visceral fat" pct={90} barColor={Colors.red} value="Level 10" valueColor={Colors.red} pillText="High" pillBg={Colors.redBg} pillColor={Colors.redDark} />
        <PatternRow label="Bone mass" pct={50} barColor={Colors.textSecondary} value="2.5 kg" valueColor={Colors.textSecondary} pillText="Normal" pillBg={Colors.background} pillColor={Colors.textSecondary} />
        <PatternRow label="Body water" pct={55} barColor={Colors.blue} value="50.1%" valueColor={Colors.blue} pillText="Normal" pillBg={Colors.blueBg} pillColor={Colors.blueText} />
        <PatternRow label="Metabolic age" pct={75} barColor={Colors.amber} value="42 yrs" valueColor={Colors.amber} pillText="+4 yrs" pillBg={Colors.amberBg} pillColor={Colors.amberDark} isLast />
      </View>
    </Card>

    {/* Height */}
    <Card>
      <CardHeader icon="resize-outline" iconBg={Colors.tealBg} title="Height" subtitle="Used for all BMI and body surface area calculations" />
      <View style={st.cardBody}>
        <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(8)}}>
          <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Height</AppText>
            <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.tealDark}}>163 cm</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.tealText}}>{'5\'4" - Stable'}</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.background, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Indian avg (F)</AppText>
            <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.textPrimary}}>158 cm</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>+5 cm above</AppText>
          </View>
        </View>
        <InsightRow dotColor={Colors.tealDark} text="Height stable at 163 cm since first measurement in 2019. No age-related loss yet (expected ~1 cm/decade after 40)." />
        <InsightRow dotColor={Colors.textSecondary} text="At 163 cm, ideal weight range for Indian women: 49-61 kg (BMI 18.5-23). Current 68.4 kg is 7.2 kg above upper ideal." isLast />
      </View>
    </Card>
  </View>
);

// ══════════════════════════════════════════════════
// Tab 2: Peer Group
// ══════════════════════════════════════════════════
const PeerGroupPanel = () => (
  <View>
    {/* Priya vs peer group */}
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="people-outline" iconBg={Colors.purpleBg} title="Priya vs peer group" subtitle="Indian women, age 35-42, urban, T2DM" />
      <View style={{padding: 0}}>
        <CompareRow label="Weight" value="68.4 kg" valueColor={Colors.textPrimary} note="Avg 66.2 kg" noteColor={Colors.textSecondary} />
        <CompareRow label="BMI" value="25.7" valueColor={Colors.amber} note="Avg 25.1" noteColor={Colors.textSecondary} />
        <CompareRow label="Waist" value="84 cm" valueColor={Colors.amber} note="Avg 82 cm" noteColor={Colors.textSecondary} />
        <CompareRow label="Body fat" value="32.7%" valueColor={Colors.amber} note="Avg 31.5%" noteColor={Colors.textSecondary} />
        <CompareRow label="Visceral fat" value="Lvl 10" valueColor={Colors.red} note="Avg Lvl 8" noteColor={Colors.textSecondary} />
        <CompareRow label="Muscle mass" value="46.2 kg" valueColor={Colors.tealDark} note="Avg 44.8 kg" noteColor={Colors.textSecondary} />
        <CompareRow label="Height" value="163 cm" valueColor={Colors.tealDark} note="Avg 158 cm" noteColor={Colors.textSecondary} isLast />
      </View>
    </Card>

    {/* Percentile bars */}
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="bar-chart-outline" iconBg={Colors.blueBg} title="Where Priya stands - Percentile ranking" subtitle="Among Indian women 35-42 with T2DM" />
      <View style={st.cardBody}>
        <PercentileBar label="Weight" pct={62} color={Colors.amber} value="62nd" />
        <PercentileBar label="BMI" pct={58} color={Colors.amber} value="58th" />
        <PercentileBar label="Waist" pct={65} color={Colors.amber} value="65th" />
        <PercentileBar label="Body fat" pct={60} color={Colors.amber} value="60th" />
        <PercentileBar label="Visceral fat" pct={78} color={Colors.red} value="78th" />
        <PercentileBar label="Muscle mass" pct={72} color={Colors.tealDark} value="72nd" />
        <PercentileBar label="Height" pct={82} color={Colors.tealDark} value="82nd" isLast />
      </View>
    </Card>

    {/* Peer insight */}
    <Card style={{marginBottom: vs(10)}} padded>
      <View style={{backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(12), marginBottom: vs(8)}}>
        <AppText style={{fontSize: ms(11), fontWeight: '700', color: Colors.amberDark, marginBottom: vs(4)}}>Key insight</AppText>
        <AppText style={{fontSize: ms(10), color: Colors.amberText, lineHeight: ms(16)}}>Priya is above peer average on all adiposity markers (weight, BMI, waist, body fat, visceral fat) but has better-than-average muscle mass. This suggests her weight composition is partially protective - the focus should be on reducing visceral fat specifically, not just total weight.</AppText>
      </View>
    </Card>

    {/* Aarav child growth */}
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="happy-outline" iconBg={Colors.blueBg} title="Aarav - Child growth assessment" subtitle="Age 8 - WHO growth charts for boys" />
      <View style={st.cardBody}>
        <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(10)}}>
          <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Weight</AppText>
            <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.tealDark}}>26.5 kg</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.tealText}}>50th percentile</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Height</AppText>
            <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.tealDark}}>128 cm</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.tealText}}>55th percentile</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>BMI</AppText>
            <AppText style={{fontSize: ms(20), fontWeight: '800', color: Colors.tealDark}}>16.2</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.tealText}}>Normal</AppText>
          </View>
        </View>

        {/* WHO growth percentiles */}
        <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(8)}}>WHO growth chart position</AppText>
        <PercentileBar label="Weight-for-age" pct={50} color={Colors.tealDark} value="50th" />
        <PercentileBar label="Height-for-age" pct={55} color={Colors.tealDark} value="55th" />
        <PercentileBar label="BMI-for-age" pct={48} color={Colors.tealDark} value="48th" isLast />
      </View>
    </Card>

    {/* Aarav growth insight */}
    <Card padded>
      <View style={{backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(12), marginBottom: vs(6)}}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(4)}}>
          <Icon family="Ionicons" name="checkmark-circle-outline" size={ms(16)} color={Colors.tealDark} />
          <AppText style={{fontSize: ms(11), fontWeight: '700', color: Colors.tealDark}}>Aarav - Growing well</AppText>
        </View>
        <AppText style={{fontSize: ms(10), color: Colors.tealText, lineHeight: ms(16)}}>All growth parameters tracking along 50th-55th percentile corridors - consistent and healthy. BMI 16.2 is normal for age 8. No crossing of centile lines. Continue balanced nutrition and physical activity.</AppText>
      </View>
      <View style={{backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(12)}}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(4)}}>
          <Icon family="Ionicons" name="alert-circle-outline" size={ms(16)} color={Colors.amberDark} />
          <AppText style={{fontSize: ms(11), fontWeight: '700', color: Colors.amberDark}}>Family risk note</AppText>
        </View>
        <AppText style={{fontSize: ms(10), color: Colors.amberText, lineHeight: ms(16)}}>With both parents having T2DM risk factors, Aarav has elevated genetic risk. Monitor BMI-for-age annually. Avoid sugary drinks and excessive screen time. Target 60+ min physical activity daily.</AppText>
      </View>
    </Card>
  </View>
);

// ══════════════════════════════════════════════════
// Tab 3: Conditions
// ══════════════════════════════════════════════════
const ConditionsPanel = () => (
  <View>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="flask-outline" iconBg={Colors.amberBg} title="T2DM - Weight is the primary driver" subtitle="Every kg lost improves insulin sensitivity" />
      <View style={st.cardBody}>
        <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(8)}}>
          <View style={{flex: 1, backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>HbA1c per kg</AppText>
            <AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.amber}}>-0.1%</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>FBG per kg</AppText>
            <AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.amber}}>-0.6 mmol</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>At BMI 23</AppText>
            <AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.tealDark}}>-0.7% HbA1c</AppText>
          </View>
        </View>
        <InsightRow dotColor={Colors.primary} text="4 kg loss since diagnosis contributed ~0.4% to HbA1c improvement. Remaining 7.2 kg could bring HbA1c to ~7.1% - within striking distance of <7% target." />
        <InsightRow dotColor={Colors.amber} text="Visceral fat level 10 drives hepatic insulin resistance and elevated FBG. Reducing to level 9 (~2.5 kg loss) expected to reduce FBG by 8-12 mg/dL." isLast />
      </View>
    </Card>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="heart-outline" iconBg={Colors.redBg} title="Hypertension - ~1 mmHg per kg lost" subtitle="Adipose tissue activates renin-angiotensin system" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="4 kg loss contributed ~-4 mmHg systolic alongside Olmesartan. Losing remaining 7 kg would add ~-7 mmHg - potentially enabling dose reduction." />
        <InsightRow dotColor={Colors.amber} text="Waist 84 cm (target <80 cm) signals central adiposity - the dominant HTN driver. Each 1 cm waist reduction = ~0.5 mmHg systolic." isLast />
      </View>
    </Card>
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="water-outline" iconBg={Colors.amberBg} title="Dyslipidaemia - Visceral fat drives TG" subtitle="TG 162 mg/dL - LDL 118 mg/dL" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.amber} text="Visceral fat level 10 drives elevated triglycerides (162 mg/dL). Each level reduction in visceral fat lowers TG by ~10-15 mg/dL." />
        <InsightRow dotColor={Colors.primary} text="5% weight loss (3.4 kg) typically reduces TG by 15-20%. Combined with dietary changes, target TG <150 achievable." isLast />
      </View>
    </Card>
    <Card>
      <CardHeader icon="medical-outline" iconBg={Colors.amberBg} title="NAFLD - Weight loss is the primary treatment" subtitle="Grade 1 fatty liver - USG Mar 2023 - 3 years ago" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="7-10% weight loss (4.8-6.8 kg) is more effective than any drug for NAFLD. Losing 5 kg reduces hepatic fat by ~40%. With current 4 kg lost, Grade 1 may have reduced." />
        <InsightRow dotColor={Colors.amber} text="USG March 2023 - 3 years ago. Repeat liver scan now due. Ayu has flagged this for Dr. Meera." isLast />
      </View>
    </Card>
  </View>
);

// ══════════════════════════════════════════════════
// Tab 4: Patterns
// ══════════════════════════════════════════════════
const PatternsPanel = () => (
  <View>
    <Card style={{marginBottom: vs(10)}}>
      <View style={{paddingVertical: vs(10), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'}}>
        <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary}}>Weight by day of week - March 2026</AppText>
      </View>
      <View style={{paddingVertical: vs(10), paddingHorizontal: s(13)}}>
        <View style={{flexDirection: 'row', gap: s(5), height: vs(75)}}>
          <BarCol topLabel="68.2" topColor={Colors.accent} height={vs(22)} barColor={Colors.accent} bottomLabel="M" />
          <BarCol topLabel="68.3" topColor={Colors.accent} height={vs(24)} barColor={Colors.accent} bottomLabel="T" />
          <BarCol topLabel="68.3" topColor={Colors.accent} height={vs(24)} barColor={Colors.accent} bottomLabel="W" />
          <BarCol topLabel="68.4" topColor={Colors.accent} height={vs(26)} barColor={Colors.accent} bottomLabel="Th" />
          <BarCol topLabel="68.3" topColor={Colors.accent} height={vs(24)} barColor={Colors.accent} bottomLabel="F" />
          <BarCol topLabel="68.8" topColor={Colors.amber} height={vs(40)} barColor={Colors.amber} bottomLabel="S" />
          <BarCol topLabel="69.0" topColor={Colors.amber} height={vs(46)} barColor={Colors.amber} bottomLabel="Su" />
        </View>
      </View>
      <View style={{backgroundColor: '#f4faf8', borderTopWidth: 0.5, borderTopColor: '#edf2ef', paddingVertical: vs(8), paddingHorizontal: s(13)}}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary}}>Weekends avg <AppText style={{fontWeight: '700', color: Colors.amber}}>+0.6 kg higher</AppText> - water retention from high-sodium weekend foods, not actual fat gain.</AppText>
      </View>
    </Card>

    <Card padded style={{marginBottom: vs(10)}}>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(8)}}>Morning vs evening reading variance</AppText>
      <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(6)}}>
        <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(10), color: Colors.textSecondary, marginBottom: vs(3)}}>Morning fasting</AppText>
          <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.tealDark}}>68.1</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>kg avg</AppText>
        </View>
        <View style={{flex: 1, backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(10), color: Colors.textSecondary, marginBottom: vs(3)}}>Evening</AppText>
          <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.amber}}>69.2</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>kg avg</AppText>
        </View>
      </View>
      <View style={{backgroundColor: Colors.amberBg, borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
        <AppText style={{fontSize: ms(10), color: Colors.amberDark, lineHeight: ms(16)}}>Natural variance of ~1.1 kg through the day. Always weigh fasting in the morning for accurate trend tracking.</AppText>
      </View>
    </Card>

    <Card padded style={{marginBottom: vs(10)}}>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(8)}}>Sleep impact on weight</AppText>
      <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(6)}}>
        <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(10), color: Colors.textSecondary, marginBottom: vs(3)}}>Sleep {'>='} 7h</AppText>
          <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.tealDark}}>68.1</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>kg avg next morning</AppText>
        </View>
        <View style={{flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(10), color: Colors.textSecondary, marginBottom: vs(3)}}>Sleep {'<'} 6h</AppText>
          <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.red}}>68.7</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>kg avg next morning</AppText>
        </View>
      </View>
      <View style={{backgroundColor: Colors.amberBg, borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
        <AppText style={{fontSize: ms(10), color: Colors.amberDark, lineHeight: ms(16)}}>Poor sleep raises cortisol - promotes visceral fat storage and increases appetite for high-GI foods by ~15%.</AppText>
      </View>
    </Card>

    <Card padded>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(8)}}>Weight loss rate - actual vs target</AppText>
      <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(8)}}>
        <View style={{flex: 1, backgroundColor: Colors.background, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Current rate</AppText>
          <AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.primary}}>-0.13</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>kg/week</AppText>
        </View>
        <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Safe maximum</AppText>
          <AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.tealDark}}>0.5</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>kg/week</AppText>
        </View>
        <View style={{flex: 1, backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Realistic target</AppText>
          <AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.amber}}>0.25</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>kg/week</AppText>
        </View>
      </View>
      <View style={{backgroundColor: Colors.tealBg, borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
        <AppText style={{fontSize: ms(10), color: Colors.tealText, lineHeight: ms(16)}}>At 0.25 kg/week: BMI 23 in 29 weeks. No crash dieting - just two habit changes: 5 post-dinner walks/week + replace white rice at dinner.</AppText>
      </View>
    </Card>
  </View>
);

// Tabs
const TABS = [
  {key: 'overview', label: 'Overview', icon: 'grid-outline'},
  {key: 'measurements', label: 'Measurements', icon: 'fitness-outline'},
  {key: 'peergroup', label: 'Peer Group', icon: 'people-outline'},
  {key: 'conditions', label: 'Conditions', icon: 'medical-outline'},
  {key: 'patterns', label: 'Patterns', icon: 'stats-chart-outline'},
];

// Main Screen
const WeightAyuIntelScreen = () => {
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
            <AppText style={st.headerTitle}>Weight Analysis</AppText>
            <AppText style={st.headerSub}>Full-spectrum intelligence - BMI - Composition</AppText>
          </View>
          <TouchableOpacity style={st.shareBtn}><Icon family="Ionicons" name="share-outline" size={ms(16)} color={Colors.white} /></TouchableOpacity>
        </View>
        <View style={st.statsRowH}>
          <View style={st.statBoxH}><AppText style={st.statLabelH}>BMI</AppText><AppText style={st.statValueH}>25.7</AppText><AppText style={st.statSubH}>Overweight</AppText></View>
          <View style={st.statBoxH}><AppText style={st.statLabelH}>Rate</AppText><AppText style={st.statValueH}>-0.13</AppText><AppText style={st.statSubH}>kg/week</AppText></View>
          <View style={st.statBoxH}><AppText style={st.statLabelH}>To target</AppText><AppText style={st.statValueH}>7.2 kg</AppText><AppText style={st.statSubH}>BMI 23</AppText></View>
          <View style={[st.statBoxH, {borderRightWidth: 0}]}><AppText style={st.statLabelH}>Visc. fat</AppText><AppText style={st.statValueH}>Lvl 10</AppText><AppText style={st.statSubH}>High</AppText></View>
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
        {activeTab === 'measurements' && <MeasurementsPanel />}
        {activeTab === 'peergroup' && <PeerGroupPanel />}
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
  pill: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(8)},
  compareRow: {flexDirection: 'row', alignItems: 'center', gap: s(8), paddingVertical: vs(9), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#f0eaf8'},
  patRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(9), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'},
  patBar: {height: ms(7), borderRadius: ms(3), backgroundColor: Colors.background, overflow: 'hidden'},
  patFill: {height: '100%', borderRadius: ms(3)},
});

export {OverviewPanel as WeightOverviewPanel, MeasurementsPanel as WeightMeasurementsPanel, PeerGroupPanel as WeightPeerGroupPanel, ConditionsPanel as WeightConditionsPanel, PatternsPanel as WeightPatternsPanel};
export default WeightAyuIntelScreen;
