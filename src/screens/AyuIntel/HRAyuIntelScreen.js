import React, {useState} from 'react';
import {View, StyleSheet, StatusBar, ScrollView, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

// Reusable components
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
const PatternRow = ({label, pct, barColor, value, valueColor, isLast}) => (
  <View style={[st.patRow, isLast && {borderBottomWidth: 0}]}>
    <AppText style={{fontSize: ms(11), fontWeight: '600', color: Colors.textPrimary, width: s(90), flexShrink: 0}}>{label}</AppText>
    <View style={{flex: 1}}><View style={st.patBar}><View style={[st.patFill, {width: `${pct}%`, backgroundColor: barColor}]} /></View></View>
    <AppText style={{fontSize: ms(11), fontWeight: '700', color: valueColor, minWidth: s(50), textAlign: 'right'}}>{value}</AppText>
  </View>
);

// ── Tab 0: Overview ──
const OverviewPanel = () => (
  <View>
    {/* Ayu narrative */}
    <View style={st.intelBand}>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: 'rgba(255,255,255,0.4)', marginBottom: vs(8)}}>Ayu Intel</AppText>
      <AppText style={{fontSize: ms(13), fontWeight: '600', color: Colors.white, lineHeight: ms(22), marginBottom: vs(10)}}>
        Resting HR of 74 bpm is <AppText style={{color: Colors.paleGreen, fontWeight: '700'}}>within normal range</AppText> - but your HRV of <AppText style={{color: '#FCA5A5', fontWeight: '700'}}>28 ms is significantly below</AppText> the 40 ms target. HRV reflects <AppText style={{color: '#FCD34D', fontWeight: '700'}}>chronic sleep debt (5.9h avg)</AppText> and <AppText style={{color: '#FCD34D', fontWeight: '700'}}>anaemia compensation</AppText>. On nights with 7h+ sleep, HRV jumps to <AppText style={{color: Colors.paleGreen, fontWeight: '700'}}>33-36 ms</AppText>.
      </AppText>
      <View style={{gap: vs(6)}}>
        <View style={{backgroundColor: 'rgba(220,38,38,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
          <AppText style={{fontSize: ms(10), color: '#FCA5A5', lineHeight: ms(16)}}>HRV 28 ms - below 40 ms target. Reflects sympathetic overdrive from poor sleep, mild anaemia, and chronic stress.</AppText>
        </View>
        <View style={{backgroundColor: 'rgba(13,148,136,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
          <AppText style={{fontSize: ms(10), color: Colors.paleGreen, lineHeight: ms(16)}}>Resting HR declining - 77 bpm (W1) to 72 bpm (W4). Step count improvement is working.</AppText>
        </View>
        <View style={{backgroundColor: 'rgba(217,119,6,0.2)', borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
          <AppText style={{fontSize: ms(10), color: '#FCD34D', lineHeight: ms(16)}}>Hb 11.8 g/dL (mild anaemia) forces cardiac compensation - raising resting HR and blunting HRV recovery.</AppText>
        </View>
      </View>
    </View>

    {/* HRV Status with zone bar */}
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="pulse-outline" iconBg={Colors.redBg} title="HRV Status - 28 ms" subtitle="Heart rate variability - autonomic nervous system health" />
      <View style={st.cardBody}>
        {/* Zone labels */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4)}}>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>{'Low (<20)'}</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Poor (20-35)</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Fair (35-50)</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>{'>50 Good'}</AppText>
        </View>
        {/* Zone bar */}
        <View style={{flexDirection: 'row', height: ms(12), borderRadius: ms(6), overflow: 'hidden', marginBottom: vs(6)}}>
          <View style={{flex: 20, backgroundColor: Colors.red}} />
          <View style={{flex: 15, backgroundColor: Colors.amber}} />
          <View style={{flex: 15, backgroundColor: '#D97706'}} />
          <View style={{flex: 15, backgroundColor: Colors.accent}} />
          <View style={{flex: 35, backgroundColor: Colors.primary}} />
        </View>
        {/* Marker */}
        <View style={{position: 'relative', height: vs(18), marginBottom: vs(8)}}>
          <View style={{position: 'absolute', left: '33%', alignItems: 'center', marginLeft: -ms(12)}}>
            <View style={{width: 2, height: vs(10), backgroundColor: Colors.textPrimary}} />
            <AppText style={{fontSize: ms(9), fontWeight: '800', color: Colors.textPrimary}}>28 ms</AppText>
          </View>
        </View>
        {/* Stats row */}
        <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(10)}}>
          <View style={{flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Current HRV</AppText>
            <AppText style={{fontSize: ms(24), fontWeight: '800', color: Colors.red}}>28</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>ms - Poor zone</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>7h+ sleep nights</AppText>
            <AppText style={{fontSize: ms(24), fontWeight: '800', color: Colors.tealDark}}>34</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>ms - Fair zone</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.background, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Target</AppText>
            <AppText style={{fontSize: ms(24), fontWeight: '800', color: Colors.textTertiary}}>{'>'}40</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>ms - Good zone</AppText>
          </View>
        </View>
        <View style={{backgroundColor: Colors.amberBg, borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
          <AppText style={{fontSize: ms(10), color: Colors.amberDark, lineHeight: ms(16)}}>Each additional hour of sleep raises HRV by 3-5 ms. Reaching 7h consistently would push HRV to 38-42 ms.</AppText>
        </View>
      </View>
    </Card>

    {/* SpO2 Status */}
    <Card style={{marginBottom: vs(10)}}>
      <CardHeader icon="cloud-outline" iconBg={Colors.blueBg} title="SpO2 Status - 97% avg" subtitle="Blood oxygen saturation - March 2026 - 62 readings" />
      <View style={st.cardBody}>
        {/* Zone labels */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4)}}>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>{'Critical (<90%)'}</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>Low (90-94%)</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>{'Normal (>=95%)'}</AppText>
        </View>
        {/* Zone bar */}
        <View style={{flexDirection: 'row', height: ms(12), borderRadius: ms(6), overflow: 'hidden', marginBottom: vs(6)}}>
          <View style={{flex: 10, backgroundColor: Colors.red}} />
          <View style={{flex: 5, backgroundColor: Colors.amber}} />
          <View style={{flex: 85, backgroundColor: Colors.accent}} />
        </View>
        {/* Marker */}
        <View style={{position: 'relative', height: vs(18), marginBottom: vs(10)}}>
          <View style={{position: 'absolute', left: '94%', alignItems: 'center', marginLeft: -ms(10)}}>
            <View style={{width: 2, height: vs(10), backgroundColor: Colors.textPrimary}} />
            <AppText style={{fontSize: ms(9), fontWeight: '800', color: Colors.textPrimary}}>97%</AppText>
          </View>
        </View>
        {/* Stats */}
        <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(10)}}>
          <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Avg SpO2</AppText>
            <AppText style={{fontSize: ms(24), fontWeight: '800', color: Colors.tealDark}}>97%</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>normal range</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.background, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Range</AppText>
            <AppText style={{fontSize: ms(24), fontWeight: '800', color: Colors.tealDark}}>94-99%</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>all readings</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Lowest</AppText>
            <AppText style={{fontSize: ms(24), fontWeight: '800', color: Colors.amber}}>94%</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>25 Mar stress</AppText>
          </View>
        </View>
        {/* Sleep SpO2 */}
        <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(7)}}>SpO2 during sleep - nadir</AppText>
        <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(8)}}>
          <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Sleep nadir avg</AppText>
            <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.tealDark}}>95%</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>lowest during sleep</AppText>
          </View>
          <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
            <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(2)}}>Nocturnal dip</AppText>
            <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.tealDark}}>2%</AppText>
            <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>waking vs sleep avg</AppText>
          </View>
        </View>
        <View style={{backgroundColor: Colors.blueBg, borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10), marginBottom: vs(8)}}>
          <AppText style={{fontSize: ms(10), color: Colors.blueText, lineHeight: ms(16)}}>SpO2 {'>='}95% consistently - no hypoxia pattern detected. Sleep nadir of 95% is within normal range. No evidence of sleep apnoea from SpO2 data.</AppText>
        </View>
        {/* Insight rows */}
        <InsightRow dotColor={Colors.accent} text="SpO2 dipped to 94% on 25 Mar (high-stress day, no walk) - the same day resting HR was elevated at 94 bpm and HRV dropped to 18 ms. All three markers moved together, confirming a systemic stress response." />
        <InsightRow dotColor={Colors.amber} text="Anaemia link: Hb 11.8 g/dL can affect oxygen delivery even when SpO2 reads normal. SpO2 measures saturation of haemoglobin, not total oxygen-carrying capacity - with low Hb, tissues can be relatively oxygen-deprived despite 97%." isLast />
      </View>
    </Card>

    {/* Priority actions */}
    <Card>
      <CardHeader icon="checkmark-done-outline" iconBg={Colors.tealBg} title="Priority actions" subtitle="Ranked by expected HRV and HR impact" />
      <View style={st.cardBody}>
        <InsightRow dotColor={Colors.red} text="Sleep 7h+ consistently - the fastest HRV lever. 7h nights average HRV 34 ms vs 5.9h nights averaging 22 ms. Set a 10:30 PM phone cutoff." />
        <InsightRow dotColor={Colors.red} text="Complete iron / ferritin panel - anaemia (Hb 11.8 g/dL) is forcing cardiac compensation. If iron-deficiency confirmed, treating may reduce resting HR by 4-6 bpm." />
        <InsightRow dotColor={Colors.amber} text="Continue Methylcobalamin 500mcg - B12 affects autonomic nerve function. Improved B12 expected to raise HRV over 8-12 weeks." />
        <InsightRow dotColor={Colors.amber} text="Post-dinner 15 min walk daily - resting HR declines 1-2 bpm for every 1,000 additional daily steps sustained over 4+ weeks." isLast />
      </View>
    </Card>
  </View>
);

// ── Tab 1: Trends ──
const TrendsPanel = () => (
  <View>
    <Card padded style={{marginBottom: vs(10)}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(14)}}>
        <View style={{flex: 1}}><AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary}}>Resting HR - 6-month trend</AppText><AppText style={{fontSize: ms(10), color: Colors.textTertiary, marginTop: vs(1)}}>Monthly avg - bpm</AppText></View>
        <View style={[st.pill, {backgroundColor: Colors.tealBg}]}><AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.tealText}}>Improving</AppText></View>
      </View>
      <View style={{flexDirection: 'row', gap: s(5), height: vs(100)}}>
        <BarCol topLabel="80" topColor={Colors.amber} height={vs(72)} barColor={Colors.amber} bottomLabel="Oct" />
        <BarCol topLabel="79" topColor={Colors.amber} height={vs(66)} barColor={Colors.amber} bottomLabel="Nov" />
        <BarCol topLabel="78" topColor={Colors.amber} height={vs(60)} barColor={Colors.amber} bottomLabel="Dec" />
        <BarCol topLabel="77" topColor={Colors.accent} height={vs(54)} barColor={Colors.accent} bottomLabel="Jan" />
        <BarCol topLabel="75" topColor={Colors.accent} height={vs(44)} barColor={Colors.accent} bottomLabel="Feb" />
        <BarCol topLabel="74" topColor={Colors.accent} height={vs(36)} barColor={Colors.accent} bottomLabel="Mar" bottomBold />
      </View>
      <AppText style={{fontSize: ms(9), color: Colors.textTertiary, textAlign: 'center', marginTop: vs(6)}}>Target: 60-75 bpm resting</AppText>
    </Card>

    <Card padded style={{marginBottom: vs(10)}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(14)}}>
        <View style={{flex: 1}}><AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary}}>HRV - 6-month trend</AppText><AppText style={{fontSize: ms(10), color: Colors.textTertiary, marginTop: vs(1)}}>Monthly avg - ms</AppText></View>
        <View style={[st.pill, {backgroundColor: Colors.amberBg}]}><AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.amberDark}}>Slow recovery</AppText></View>
      </View>
      <View style={{flexDirection: 'row', gap: s(5), height: vs(100)}}>
        <BarCol topLabel="22" topColor={Colors.red} height={vs(22)} barColor={Colors.red} bottomLabel="Oct" />
        <BarCol topLabel="23" topColor={Colors.red} height={vs(26)} barColor={Colors.red} bottomLabel="Nov" />
        <BarCol topLabel="24" topColor={Colors.red} height={vs(30)} barColor={Colors.red} bottomLabel="Dec" />
        <BarCol topLabel="26" topColor={Colors.amber} height={vs(36)} barColor={Colors.amber} bottomLabel="Jan" />
        <BarCol topLabel="27" topColor={Colors.amber} height={vs(40)} barColor={Colors.amber} bottomLabel="Feb" />
        <BarCol topLabel="28" topColor={Colors.amber} height={vs(44)} barColor={Colors.amber} bottomLabel="Mar" bottomBold />
      </View>
      <AppText style={{fontSize: ms(9), color: Colors.textTertiary, textAlign: 'center', marginTop: vs(6)}}>Target: {'>'}40 ms</AppText>
    </Card>

    <Card padded>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(14)}}>Monitoring adherence - readings/month</AppText>
      <View style={{flexDirection: 'row', gap: s(5), height: vs(80)}}>
        <BarCol topLabel="24" topColor={Colors.textTertiary} height={vs(22)} barColor="#dde8e2" bottomLabel="Oct" />
        <BarCol topLabel="30" topColor={Colors.textTertiary} height={vs(28)} barColor="#dde8e2" bottomLabel="Nov" />
        <BarCol topLabel="38" topColor={Colors.textTertiary} height={vs(38)} barColor={Colors.paleGreen} bottomLabel="Dec" />
        <BarCol topLabel="48" topColor={Colors.textTertiary} height={vs(46)} barColor={Colors.paleGreen} bottomLabel="Jan" />
        <BarCol topLabel="56" topColor={Colors.textTertiary} height={vs(54)} barColor={Colors.accent} bottomLabel="Feb" />
        <BarCol topLabel="62" topColor={Colors.primary} height={vs(60)} barColor={Colors.primary} bottomLabel="Mar" bottomBold />
      </View>
      <AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.primary, textAlign: 'center', marginTop: vs(8)}}>Apple Watch enabling consistent passive monitoring</AppText>
    </Card>

    {/* SpO2 6-month trend */}
    <Card padded style={{marginTop: vs(10)}}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(14)}}>
        <View style={{flex: 1}}>
          <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary}}>SpO2 - 6-month trend</AppText>
          <AppText style={{fontSize: ms(10), color: Colors.textTertiary, marginTop: vs(1)}}>Monthly avg - % - normal {'>='}95%</AppText>
        </View>
        <View style={[st.pill, {backgroundColor: Colors.tealBg}]}><AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.tealText}}>Stable</AppText></View>
      </View>
      <View style={{flexDirection: 'row', gap: s(5), height: vs(90)}}>
        <BarCol topLabel="97" topColor={Colors.accent} height={vs(58)} barColor={Colors.accent} bottomLabel="Oct" />
        <BarCol topLabel="97" topColor={Colors.accent} height={vs(58)} barColor={Colors.accent} bottomLabel="Nov" />
        <BarCol topLabel="96" topColor={Colors.accent} height={vs(52)} barColor={Colors.accent} bottomLabel="Dec" />
        <BarCol topLabel="97" topColor={Colors.accent} height={vs(58)} barColor={Colors.accent} bottomLabel="Jan" />
        <BarCol topLabel="97" topColor={Colors.accent} height={vs(58)} barColor={Colors.accent} bottomLabel="Feb" />
        <BarCol topLabel="97" topColor={Colors.accent} height={vs(58)} barColor={Colors.accent} bottomLabel="Mar" bottomBold />
      </View>
      <AppText style={{fontSize: ms(9), color: Colors.textTertiary, textAlign: 'center', marginTop: vs(6)}}>Target: {'>='}95% - Dec dip = URTI episode (resolved)</AppText>
      <View style={{backgroundColor: Colors.tealBg, borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10), marginTop: vs(8)}}>
        <AppText style={{fontSize: ms(10), color: Colors.tealText, lineHeight: ms(16)}}>SpO2 consistently 96-97% across 6 months - no downward drift or hypoxia episodes. December dip coincided with URTI (resolved).</AppText>
      </View>
    </Card>
  </View>
);

// ── Tab 2: Patterns ──
const PatternsPanel = () => (
  <View>
    {/* By time of day */}
    <Card style={{marginBottom: vs(10)}}>
      <View style={{paddingVertical: vs(10), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'}}>
        <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary}}>Resting HR by time of day</AppText>
      </View>
      <PatternRow label="Wake (5-8 AM)" pct={58} barColor={Colors.accent} value="68 bpm" valueColor={Colors.tealDark} />
      <PatternRow label="Morning" pct={64} barColor={Colors.amber} value="74 bpm" valueColor={Colors.amber} />
      <PatternRow label="Afternoon" pct={66} barColor={Colors.amber} value="76 bpm" valueColor={Colors.amber} />
      <PatternRow label="Evening" pct={60} barColor={Colors.accent} value="72 bpm" valueColor={Colors.tealDark} />
      <PatternRow label="Night / Sleep" pct={45} barColor={Colors.accent} value="62 bpm" valueColor={Colors.tealDark} isLast />
      <View style={{backgroundColor: '#f4faf8', borderTopWidth: 0.5, borderTopColor: '#edf2ef', paddingVertical: vs(8), paddingHorizontal: s(13)}}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary}}>Normal diurnal pattern. Afternoon elevation is slight - likely desk posture and caffeine effect.</AppText>
      </View>
    </Card>

    {/* Sleep vs HRV */}
    <Card padded style={{marginBottom: vs(10)}}>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(8)}}>Sleep duration - HRV next morning</AppText>
      <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(8)}}>
        <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Sleep {'>='} 7h</AppText>
          <AppText style={{fontSize: ms(24), fontWeight: '800', color: Colors.tealDark}}>34</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>ms HRV avg</AppText>
        </View>
        <View style={{flex: 1, backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Sleep 6-7h</AppText>
          <AppText style={{fontSize: ms(24), fontWeight: '800', color: Colors.amber}}>27</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>ms HRV avg</AppText>
        </View>
        <View style={{flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Sleep {'<'} 6h</AppText>
          <AppText style={{fontSize: ms(24), fontWeight: '800', color: Colors.red}}>21</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>ms HRV avg</AppText>
        </View>
      </View>
      <View style={{backgroundColor: Colors.amberBg, borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
        <AppText style={{fontSize: ms(10), color: Colors.amberDark, lineHeight: ms(16)}}>HRV drops 13 ms between 7h and {'<'}6h sleep nights. Sleep is the primary HRV recovery mechanism.</AppText>
      </View>
    </Card>

    {/* Stress impact */}
    <Card padded style={{marginBottom: vs(10)}}>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(8)}}>Stress impact on resting HR</AppText>
      <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(6)}}>
        <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(10), color: Colors.textSecondary, marginBottom: vs(3)}}>Low-stress days</AppText>
          <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.tealDark}}>70</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>bpm avg resting HR</AppText>
        </View>
        <View style={{flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(10), color: Colors.textSecondary, marginBottom: vs(3)}}>High-stress days</AppText>
          <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.red}}>82</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>bpm avg resting HR</AppText>
        </View>
      </View>
      <View style={{backgroundColor: Colors.amberBg, borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
        <AppText style={{fontSize: ms(10), color: Colors.amberDark, lineHeight: ms(16)}}>+12 bpm resting HR on high-stress days. Stress elevates cortisol - direct sympathetic activation - raised HR and suppressed HRV.</AppText>
      </View>
    </Card>

    {/* Activity recovery */}
    <Card padded>
      <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary, marginBottom: vs(8)}}>Activity and HR recovery</AppText>
      <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(8)}}>
        <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Peak active HR</AppText>
          <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.amber}}>142</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>bpm (brisk walk)</AppText>
        </View>
        <View style={{flex: 1, backgroundColor: Colors.background, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>HR at 2 min post</AppText>
          <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.accent}}>98</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>bpm (-44 bpm)</AppText>
        </View>
        <View style={{flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), padding: ms(10), alignItems: 'center'}}>
          <AppText style={{fontSize: ms(9), color: Colors.textSecondary, marginBottom: vs(3)}}>Full recovery</AppText>
          <AppText style={{fontSize: ms(22), fontWeight: '800', color: Colors.tealDark}}>5 min</AppText>
          <AppText style={{fontSize: ms(9), color: Colors.textTertiary}}>to resting HR</AppText>
        </View>
      </View>
      <View style={{backgroundColor: Colors.tealBg, borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(10)}}>
        <AppText style={{fontSize: ms(10), color: Colors.tealText, lineHeight: ms(16)}}>HR recovery of 44 bpm in 2 minutes is within normal range. As fitness improves, expect 60+ bpm recovery at 2 minutes.</AppText>
      </View>
    </Card>

    {/* SpO2 by activity context */}
    <Card style={{marginTop: vs(10)}}>
      <View style={{paddingVertical: vs(10), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'}}>
        <AppText style={{fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textSecondary}}>SpO2 by activity context</AppText>
      </View>
      <PatternRow label="Resting" pct={97} barColor={Colors.accent} value="97-98%" valueColor={Colors.tealDark} />
      <PatternRow label="After walk" pct={96} barColor={Colors.accent} value="96-97%" valueColor={Colors.tealDark} />
      <PatternRow label="Post-workout" pct={95} barColor={Colors.accent} value="95-96%" valueColor={Colors.tealDark} />
      <PatternRow label="During sleep" pct={95} barColor={Colors.accent} value="95% nadir" valueColor={Colors.tealDark} />
      <PatternRow label="High stress" pct={94} barColor={Colors.amber} value="94-95%" valueColor={Colors.amber} isLast />
      <View style={{backgroundColor: '#f4faf8', borderTopWidth: 0.5, borderTopColor: '#edf2ef', paddingVertical: vs(8), paddingHorizontal: s(13)}}>
        <AppText style={{fontSize: ms(9), color: Colors.textSecondary}}>SpO2 drops 2-3% during intense activity - normal physiology. Post-workout returns to 97%+ within 3-5 minutes.</AppText>
      </View>
    </Card>
  </View>
);

// Tabs
const TABS = [
  {key: 'overview', label: 'Overview', icon: 'grid-outline'},
  {key: 'trends', label: 'Trends', icon: 'trending-up-outline'},
  {key: 'patterns', label: 'Patterns', icon: 'stats-chart-outline'},
];

// Main Screen
const HRAyuIntelScreen = () => {
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
            <AppText style={st.headerTitle}>HR Analysis</AppText>
            <AppText style={st.headerSub}>HRV - Resting HR - Recovery - Sleep</AppText>
          </View>
          <TouchableOpacity style={st.shareBtn}><Icon family="Ionicons" name="share-outline" size={ms(16)} color={Colors.white} /></TouchableOpacity>
        </View>
        <View style={st.statsRow}>
          <View style={st.statBox}><AppText style={st.statLabel}>Resting HR</AppText><AppText style={st.statValue}>74</AppText><AppText style={st.statSub}>bpm - normal</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>HRV</AppText><AppText style={st.statValue}>28 ms</AppText><AppText style={st.statSub}>below target</AppText></View>
          <View style={st.statBox}><AppText style={st.statLabel}>Avg SpO2</AppText><AppText style={st.statValue}>97%</AppText><AppText style={st.statSub}>normal</AppText></View>
          <View style={[st.statBox, {borderRightWidth: 0}]}><AppText style={st.statLabel}>VO2 est.</AppText><AppText style={st.statValue}>28</AppText><AppText style={st.statSub}>mL/kg/min</AppText></View>
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

export {OverviewPanel as HROverviewPanel, TrendsPanel as HRTrendsPanel, PatternsPanel as HRPatternsPanel};
export default HRAyuIntelScreen;
