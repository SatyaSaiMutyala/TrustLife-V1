import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Circle as SvgCircle, Path, Line, Text as SvgText, G, Polyline, Rect, Defs, LinearGradient, Stop} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const BMI_TREND_DATA = [
  {label: 'Sep 19', value: 27.2},
  {label: 'Jun 22', value: 26.4},
  {label: 'Sep 23', value: 26.2},
  {label: 'Mar 24', value: 25.9},
  {label: 'Sep 24', value: 26.0},
  {label: 'Mar 25', value: 25.9},
  {label: 'Sep 25', value: 26.0},
  {label: 'Mar 26', value: 24.7},
];

/* ─── helpers ─── */
const polarToCartesian = (cx, cy, r, angleDeg) => {
  const rad = ((angleDeg - 180) * Math.PI) / 180;
  return {x: cx + r * Math.cos(rad), y: cy + r * Math.sin(rad)};
};
const describeArc = (cx, cy, r, startAngle, endAngle) => {
  const s0 = polarToCartesian(cx, cy, r, startAngle);
  const e0 = polarToCartesian(cx, cy, r, endAngle);
  const large = endAngle - startAngle > 180 ? 1 : 0;
  return `M ${s0.x} ${s0.y} A ${r} ${r} 0 ${large} 1 ${e0.x} ${e0.y}`;
};
// Map BMI value (15-35) to angle (0-180)
const bmiToAngle = bmi => Math.min(180, Math.max(0, ((bmi - 15) / 20) * 180));

/* ─── static data ─── */
const historyRows = [
  {date: '15 Mar 26', wt: '68.4 kg', bmi: '24.7', cat: 'OW', catColor: Colors.amberText, catBg: Colors.amberBg, change: '\u22120.3', changeColor: Colors.tealText, highlight: true},
  {date: '10 Sep 25', wt: '69.2 kg', bmi: '26.0', cat: null, catColor: null, catBg: null, change: '\u22120.9', changeColor: Colors.tealText, highlight: false},
  {date: '12 Mar 25', wt: '69.0 kg', bmi: '25.9', cat: null, catColor: null, catBg: null, change: '\u22120.2', changeColor: Colors.textSecondary, highlight: false},
  {date: '2 Sep 24', wt: '69.2 kg', bmi: '26.0', cat: null, catColor: null, catBg: null, change: '+0.2', changeColor: Colors.textSecondary, highlight: false},
  {date: 'Jun 2022', wt: '70.2 kg', bmi: '26.4', cat: null, catColor: Colors.redText, catBg: null, change: 'Peak', changeColor: Colors.redText, highlight: false},
  {date: 'Sep 2019', wt: '72.4 kg', bmi: '27.2', cat: null, catColor: Colors.redText, catBg: null, change: 'At Dx', changeColor: Colors.redText, highlight: false},
];

const conditionRows = [
  {
    icon: 'fitness-outline',
    iconBg: Colors.amberBg,
    iconColor: Colors.amberText,
    title: 'T2DM \u00B7 BMI is the primary modifiable driver',
    desc: 'Visceral fat (waist 84 cm) causes insulin resistance that worsens HbA1c. Every 1 kg lost reduces fasting glucose by ~0.6 mmol/L. Losing 7 kg (reaching BMI 23) could reduce HbA1c by 0.5\u20130.8%.',
  },
  {
    icon: 'heart-outline',
    iconBg: Colors.redBg,
    iconColor: Colors.redText,
    title: 'HTN \u00B7 Adipose tissue raises blood pressure',
    desc: 'Visceral fat activates the renin-angiotensin system \u2014 directly raising BP. Each 1 kg weight loss reduces systolic BP by ~1 mmHg. Reaching BMI 23 could reduce systolic BP by ~7 mmHg.',
  },
  {
    icon: 'water-outline',
    iconBg: Colors.blueBg,
    iconColor: Colors.blueText,
    title: 'Dyslipidaemia \u00B7 Weight loss lowers TG and raises HDL',
    desc: 'Your TG 162 and HDL 48 are directly tied to central adiposity. A 7\u201310% body weight reduction reliably raises HDL by 0.1 mmol/L and lowers TG by 10\u201315%.',
  },
  {
    icon: 'medical-outline',
    iconBg: Colors.amberBg,
    iconColor: Colors.amberText,
    title: 'NAFLD \u00B7 Grade 1 fatty liver linked to BMI 24.7',
    desc: 'Weight loss of 7\u201310% of body weight is the most effective NAFLD treatment. Losing 5 kg alone can reduce hepatic fat content by 40%.',
  },
];

const keyStats = [
  {label: 'HEIGHT', value: '163', unit: 'cm', sub: 'Stable since 2019', color: Colors.textPrimary},
  {label: 'WEIGHT', value: '68.4', unit: 'kg', sub: '\u22120.8 kg since Sep 2025', color: Colors.textPrimary},
  {label: 'WAIST', value: '84', unit: 'cm', sub: 'Target <80 cm \u00B7 \u2191 Risk', color: Colors.redText},
  {label: 'WAIST / HEIGHT', value: '0.52', unit: '', sub: 'Target <0.50 \u00B7 Borderline', color: Colors.amberText},
  {label: 'IDEAL WEIGHT', value: '61.2', unit: 'kg', sub: 'For BMI 23.0 at 163 cm', color: Colors.tealText},
  {label: 'WEIGHT TO LOSE', value: '\u22127.2', unit: 'kg', sub: 'To reach BMI 23 target', color: Colors.amberText},
];

const peerDistribution = [
  {label: 'Normal BMI (<23)', pct: 18, color: Colors.tealText, bg: Colors.tealBg},
  {label: 'Overweight (23\u201327.5) \u00B7 like you', pct: 34, color: Colors.amberText, bg: Colors.amberBg},
  {label: 'Obese (>27.5)', pct: 48, color: Colors.redText, bg: Colors.redBg},
];

/* ─── component ─── */
const BmiTrackerTab = () => {

  /* ── 1. BMI Hero Banner ── */
  const renderHeroBanner = () => {
    const svgW = ms(120);
    const svgH = ms(72);
    const cx = svgW / 2;
    const cy = svgH - ms(4);
    const r = ms(48);
    const needleAngle = bmiToAngle(24.7);
    const normalStart = bmiToAngle(18.5);
    const normalEnd = bmiToAngle(23);
    const needlePt = polarToCartesian(cx, cy, r - ms(6), needleAngle);

    return (
      <View style={styles.heroBanner}>
        {/* Left: SVG gauge */}
        <View style={{alignItems: 'center', justifyContent: 'center'}}>
          <Svg width={svgW} height={svgH}>
            {/* Track arc */}
            <Path d={describeArc(cx, cy, r, 0, 180)} stroke="rgba(255,255,255,0.12)" strokeWidth={ms(8)} fill="none" strokeLinecap="round" />
            {/* Normal zone arc */}
            <Path d={describeArc(cx, cy, r, normalStart, normalEnd)} stroke={Colors.lightGreen} strokeWidth={ms(8)} fill="none" strokeLinecap="round" />
            {/* Needle */}
            <Line x1={cx} y1={cy} x2={needlePt.x} y2={needlePt.y} stroke={Colors.white} strokeWidth={ms(2.5)} strokeLinecap="round" />
            <SvgCircle cx={cx} cy={cy} r={ms(4)} fill={Colors.white} />
            {/* Center value */}
            <SvgText x={cx} y={cy - ms(14)} textAnchor="middle" fill={Colors.white} fontSize={ms(18)} fontWeight="700">24.7</SvgText>
          </Svg>
        </View>

        {/* Right: info */}
        <View style={{flex: 1, marginLeft: s(12)}}>
          <AppText variant="caption" color="rgba(255,255,255,0.7)">Current BMI {'\u00B7'} 24 Mar 2026</AppText>
          <AppText variant="screenName" color={Colors.white} style={{fontSize: ms(28), lineHeight: ms(32)}}>24.7</AppText>
          <View style={[styles.pill, {backgroundColor: Colors.amberBg, alignSelf: 'flex-start', marginTop: vs(2), marginBottom: vs(4)}]}>
            <AppText variant="small" color={Colors.amberText} style={{fontWeight: '700'}}>Overweight</AppText>
          </View>
          <AppText variant="small" color="rgba(255,255,255,0.6)" style={{marginBottom: vs(6)}}>
            Height 163 cm {'\u00B7'} Weight 68.4 kg {'\u00B7'} Last updated 15 Mar 2026
          </AppText>

          {/* Target progress */}
          <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(2)}}>
            <AppText variant="small" color="rgba(255,255,255,0.7)">Target: 23.0</AppText>
          </View>
          <View style={styles.progressTrack}>
            <View style={[styles.progressFill, {width: '66%'}]} />
          </View>
          <AppText variant="small" color={Colors.lightGreen} style={{marginTop: vs(2)}}>{'\u22121.7 to go'}</AppText>
        </View>
      </View>
    );
  };

  /* ── 2. BMI Classification Card ── */
  const renderClassificationCard = () => {
    const zones = [
      {label: 'Underweight', range: '<18.5', flex: 18.5, bg: Colors.blueBg, color: Colors.blueText},
      {label: 'Normal', range: '18.5\u201323', flex: 4.5, bg: Colors.tealBg, color: Colors.tealText},
      {label: 'Overweight', range: '23\u201327.5', flex: 4.5, bg: Colors.amberBg, color: Colors.amberText},
      {label: 'Obese', range: '>27.5', flex: 7.5, bg: Colors.redBg, color: Colors.redText},
    ];

    const gridItems = [
      {val: '18.5', label: 'Global lower', bg: Colors.blueBg, color: Colors.blueText},
      {val: '23.0', label: 'Indian upper \u2013 target', bg: Colors.tealBg, color: Colors.tealText},
      {val: '24.7', label: 'You \u2013 now', bg: Colors.amberBg, color: Colors.amberText},
      {val: '27.5', label: 'Indian obese', bg: Colors.redBg, color: Colors.redText},
    ];

    return (
      <View style={styles.card}>
        <AppText variant="bodyBold">BMI classification {'\u00B7'} Indian standards</AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(10)}}>WHO Asia-Pacific cut-offs 2004</AppText>

        {/* Zone bar */}
        <View style={styles.zoneBarContainer}>
          <View style={styles.zoneBar}>
            {zones.map((z, i) => (
              <View key={i} style={[styles.zoneSegment, {flex: z.flex, backgroundColor: z.bg, borderTopLeftRadius: i === 0 ? ms(4) : 0, borderBottomLeftRadius: i === 0 ? ms(4) : 0, borderTopRightRadius: i === zones.length - 1 ? ms(4) : 0, borderBottomRightRadius: i === zones.length - 1 ? ms(4) : 0}]} />
            ))}
          </View>
          {/* Marker at 38.8% */}
          <View style={[styles.zoneMarker, {left: '38.8%'}]}>
            <View style={styles.zoneMarkerDot} />
          </View>
        </View>

        {/* Labels */}
        <View style={{flexDirection: 'row', marginTop: vs(6), marginBottom: vs(10)}}>
          {zones.map((z, i) => (
            <View key={i} style={{flex: z.flex, alignItems: 'center'}}>
              <AppText variant="small" color={z.color} style={{fontWeight: '600', textAlign: 'center'}}>{z.label}</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center'}}>{z.range}</AppText>
            </View>
          ))}
        </View>

        {/* Amber insight */}
        <View style={styles.amberInsight}>
          <Icon family="Ionicons" name="information-circle-outline" size={18} color={Colors.amberText} />
          <AppText variant="caption" color={Colors.amberText} style={{flex: 1, marginLeft: s(6)}}>
            Your BMI 24.7 = Overweight (Indian cut-off 23{'\u2013'}27.5). Indian population BMI thresholds are lower than the global standard (25) because South Asians carry metabolically harmful visceral fat at lower BMI values. Your waist circumference of 84 cm also exceeds the 80 cm risk threshold for South Asian women.
          </AppText>
        </View>

        {/* 4-column grid */}
        <View style={styles.classGrid}>
          {gridItems.map((g, i) => (
            <View key={i} style={[styles.classGridItem, {backgroundColor: g.bg}]}>
              <AppText variant="bodyBold" color={g.color}>{g.val}</AppText>
              <AppText variant="small" color={g.color} style={{textAlign: 'center'}}>{g.label}</AppText>
            </View>
          ))}
        </View>
      </View>
    );
  };

  /* ── 3. Key Stats Grid ── */
  const renderKeyStats = () => (
    <View style={styles.statsGrid}>
      {keyStats.map((st, i) => (
        <View key={i} style={styles.statCell}>
          <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '600', letterSpacing: 0.5}}>{st.label}</AppText>
          <View style={{flexDirection: 'row', alignItems: 'baseline', marginTop: vs(2)}}>
            <AppText variant="header" color={st.color}>{st.value}</AppText>
            {st.unit ? <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(3)}}>{st.unit}</AppText> : null}
          </View>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{st.sub}</AppText>
        </View>
      ))}
    </View>
  );

  /* ── 4. BMI Trend ── */
  const renderBmiTrend = () => (
    <View>
      <AppText variant="bodyBold" style={{marginBottom: vs(8), marginTop: vs(16)}}>BMI trend {'\u00B7'} 2019{'\u2013'}2026</AppText>
      <View style={styles.card}>
        {/* BMI trend SVG chart */}
        {(() => {
          const CHART_W = 340;
          const CHART_H = 180;
          const PAD = {l: 30, r: 12, t: 16, b: 30};
          const CW = CHART_W - PAD.l - PAD.r;
          const CH = CHART_H - PAD.t - PAD.b;
          const MIN_V = 22;
          const MAX_V = 28.5;
          const px = (i) => PAD.l + (i / (BMI_TREND_DATA.length - 1)) * CW;
          const py = (v) => PAD.t + CH - ((v - MIN_V) / (MAX_V - MIN_V)) * CH;

          const points = BMI_TREND_DATA.map((d, i) => `${px(i)},${py(d.value)}`).join(' ');
          const areaPath = BMI_TREND_DATA.map((d, i) => `${i === 0 ? 'M' : 'L'}${px(i)},${py(d.value)}`).join(' ')
            + ` L${px(BMI_TREND_DATA.length - 1)},${py(MIN_V)} L${px(0)},${py(MIN_V)} Z`;

          const gridYs = [23, 24, 25, 26, 27, 27.5];

          return (
            <View style={{width: '100%', aspectRatio: 340 / 180, marginBottom: vs(10)}}>
              <Svg width="100%" height="100%" viewBox="0 0 340 180">
                {/* Shaded zones */}
                <Rect x={PAD.l} y={py(23)} width={CW} height={py(MIN_V) - py(23)} fill="rgba(52,199,89,0.08)" />
                <Rect x={PAD.l} y={py(27.5)} width={CW} height={py(23) - py(27.5)} fill="rgba(186,117,23,0.08)" />

                {/* Horizontal grid lines */}
                {gridYs.map((v) => (
                  <Line key={v} x1={PAD.l} y1={py(v)} x2={PAD.l + CW} y2={py(v)} stroke="rgba(0,0,0,0.06)" strokeWidth={0.5} />
                ))}

                {/* Reference dashed lines */}
                <Line x1={PAD.l} y1={py(23)} x2={PAD.l + CW} y2={py(23)} stroke={Colors.primary} strokeOpacity={0.5} strokeWidth={1} strokeDasharray="4,3" />
                <Line x1={PAD.l} y1={py(27.5)} x2={PAD.l + CW} y2={py(27.5)} stroke="#E24B4A" strokeOpacity={0.4} strokeWidth={1} strokeDasharray="4,3" />

                {/* Area fill gradient */}
                <Defs>
                  <LinearGradient id="bmiAreaGrad" x1="0" y1="0" x2="0" y2="1">
                    <Stop offset="0%" stopColor="rgba(186,117,23,0.15)" />
                    <Stop offset="100%" stopColor="rgba(186,117,23,0.02)" />
                  </LinearGradient>
                </Defs>
                <Path d={areaPath} fill="url(#bmiAreaGrad)" />

                {/* Line */}
                <Polyline points={points} stroke="#BA7517" strokeWidth={2} fill="none" />

                {/* Dots */}
                {BMI_TREND_DATA.map((d, i) => (
                  <SvgCircle
                    key={i}
                    cx={px(i)}
                    cy={py(d.value)}
                    r={3.5}
                    fill={d.value > 27.5 ? '#E24B4A' : d.value > 23 ? '#BA7517' : Colors.primary}
                    stroke="white"
                    strokeWidth={1.5}
                  />
                ))}

                {/* Y-axis labels */}
                <SvgText x={PAD.l - 4} y={py(23) + 3} textAnchor="end" fontSize={8} fill="#aaa">23</SvgText>
                <SvgText x={PAD.l - 4} y={py(27.5) + 3} textAnchor="end" fontSize={8} fill="#aaa">27.5</SvgText>

                {/* X-axis labels */}
                {BMI_TREND_DATA.map((d, i) => (
                  <SvgText key={i} x={px(i)} y={CHART_H - PAD.b + 14} textAnchor="middle" fontSize={8} fill="#aaa">{d.label}</SvgText>
                ))}
              </Svg>
            </View>
          );
        })()}
        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: Colors.amber}]} />
            <AppText variant="small" color={Colors.textSecondary}>BMI</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, {borderColor: Colors.tealText}]} />
            <AppText variant="small" color={Colors.textSecondary}>Target 23.0</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendLine, {borderColor: Colors.redText}]} />
            <AppText variant="small" color={Colors.textSecondary}>Obese (Indian) 27.5</AppText>
          </View>
        </View>
      </View>
    </View>
  );

  /* ── 5. Measurement History ── */
  const renderHistory = () => (
    <View>
      <AppText variant="bodyBold" style={{marginBottom: vs(8), marginTop: vs(16)}}>Measurement history</AppText>
      <View style={styles.card}>
        {/* Header row */}
        <View style={[styles.tableRow, styles.tableHeader]}>
          <AppText variant="small" color={Colors.textSecondary} style={[styles.tableCol1, {fontWeight: '700'}]}>Date</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={[styles.tableCol2, {fontWeight: '700'}]}>Weight</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={[styles.tableCol3, {fontWeight: '700'}]}>BMI</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={[styles.tableCol4, {fontWeight: '700'}]}>Change</AppText>
        </View>

        {historyRows.map((row, i) => (
          <View key={i} style={[styles.tableRow, row.highlight && {backgroundColor: Colors.amberBg}]}>
            <AppText variant="small" color={row.highlight ? Colors.amberText : Colors.textPrimary} style={[styles.tableCol1, row.highlight && {fontWeight: '700'}]}>{row.date}</AppText>
            <AppText variant="small" color={Colors.textPrimary} style={styles.tableCol2}>{row.wt}</AppText>
            <View style={[styles.tableCol3, {flexDirection: 'row', alignItems: 'center'}]}>
              <AppText variant="small" color={row.catColor || Colors.textPrimary}>{row.bmi}</AppText>
              {row.cat ? (
                <View style={[styles.miniPill, {backgroundColor: row.catBg, marginLeft: s(4)}]}>
                  <AppText variant="small" color={row.catColor} style={{fontSize: ms(9), fontWeight: '700'}}>{row.cat}</AppText>
                </View>
              ) : null}
            </View>
            <AppText variant="small" color={row.changeColor} style={styles.tableCol4}>{row.change}</AppText>
          </View>
        ))}
      </View>
    </View>
  );

  /* ── 6. Why BMI Matters ── */
  const renderWhyMatters = () => (
    <View>
      <AppText variant="bodyBold" style={{marginBottom: vs(8), marginTop: vs(16)}}>Why BMI matters for your conditions</AppText>
      <View style={styles.card}>
        {conditionRows.map((c, i) => (
          <View key={i} style={[styles.conditionRow, i < conditionRows.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: BORDER, paddingBottom: vs(10), marginBottom: vs(10)}]}>
            <View style={[styles.conditionIcon, {backgroundColor: c.iconBg}]}>
              <Icon family="Ionicons" name={c.icon} size={18} color={c.iconColor} />
            </View>
            <View style={{flex: 1, marginLeft: s(10)}}>
              <AppText variant="bodyBold">{c.title}</AppText>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{c.desc}</AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  /* ── 7. Peer Group Comparison ── */
  const renderPeerGroup = () => (
    <View style={{marginTop: vs(16)}}>
      {/* Dark header */}
      <View style={styles.peerHeader}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8)}}>
          <Icon family="Ionicons" name="people-outline" size={22} color={Colors.white} />
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={Colors.white}>Peer group {'\u00B7'} n = 6,240</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.7)">Women 35{'\u2013'}42 {'\u00B7'} T2DM + HTN {'\u00B7'} Urban Hyderabad {'\u00B7'} Middle-income</AppText>
          </View>
        </View>
        <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginTop: vs(4)}}>ICMR NCD registry 2024 {'\u00B7'} Apollo health cohort</AppText>
      </View>

      {/* BMI comparison */}
      <View style={[styles.card, {borderTopLeftRadius: 0, borderTopRightRadius: 0}]}>
        {/* Header row */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(8)}}>
          <AppText variant="bodyBold">BMI</AppText>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
            <AppText variant="small" color={Colors.textSecondary}>Peer avg: <AppText variant="small" style={{fontWeight: '700'}}>27.4</AppText></AppText>
            <AppText variant="small" color={Colors.textSecondary}>You: <AppText variant="small" style={{fontWeight: '700'}}>24.7</AppText></AppText>
            <View style={[styles.pill, {backgroundColor: Colors.tealBg}]}>
              <AppText variant="small" color={Colors.tealText} style={{fontWeight: '700'}}>Better</AppText>
            </View>
          </View>
        </View>

        {/* Distribution bar */}
        <View style={styles.peerBarContainer}>
          <View style={styles.peerBarGradient}>
            <View style={{flex: 1, backgroundColor: Colors.tealBg}} />
            <View style={{flex: 1, backgroundColor: Colors.amberBg}} />
            <View style={{flex: 1, backgroundColor: Colors.redBg}} />
          </View>
          {/* Peer marker at 69% */}
          <View style={[styles.peerMarkerWrap, {left: '69%'}]}>
            <View style={styles.peerMarkerLine} />
            <AppText variant="small" color={Colors.textSecondary} style={{fontSize: ms(8), marginTop: vs(1)}}>Peer</AppText>
          </View>
          {/* You marker at 49% */}
          <View style={[styles.peerMarkerWrap, {left: '49%'}]}>
            <View style={[styles.peerMarkerLine, {backgroundColor: Colors.primary}]} />
            <AppText variant="small" color={Colors.primary} style={{fontSize: ms(8), fontWeight: '700', marginTop: vs(1)}}>You</AppText>
          </View>
        </View>
        {/* Scale labels */}
        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(2)}}>
          <AppText variant="small" color={Colors.textTertiary}>18</AppText>
          <AppText variant="small" color={Colors.textTertiary}>23 Indian normal</AppText>
          <AppText variant="small" color={Colors.textTertiary}>35</AppText>
        </View>
        {/* Green insight */}
        <View style={[styles.insightBox, {backgroundColor: Colors.tealBg, marginTop: vs(8)}]}>
          <Icon family="Ionicons" name="checkmark-circle-outline" size={16} color={Colors.tealText} />
          <AppText variant="caption" color={Colors.tealText} style={{flex: 1, marginLeft: s(6)}}>
            Your BMI is lower than 72% of your peer group. You are in better metabolic standing than most women with similar demographics and conditions.
          </AppText>
        </View>

        {/* Distribution section */}
        <AppText variant="bodyBold" style={{marginTop: vs(14), marginBottom: vs(8)}}>BMI distribution in peer group</AppText>
        {peerDistribution.map((d, i) => (
          <View key={i} style={{marginBottom: vs(6)}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(2)}}>
              <AppText variant="small" color={Colors.textPrimary}>{d.label}</AppText>
              <AppText variant="small" color={d.color} style={{fontWeight: '700'}}>{d.pct}%</AppText>
            </View>
            <View style={styles.distBarTrack}>
              <View style={[styles.distBarFill, {width: `${d.pct}%`, backgroundColor: d.bg}]} />
            </View>
          </View>
        ))}

        {/* Waist circumference */}
        <View style={{borderTopWidth: 0.5, borderTopColor: BORDER, marginTop: vs(10), paddingTop: vs(10)}}>
          <AppText variant="bodyBold" style={{marginBottom: vs(4)}}>Waist circumference {'\u00B7'} Women (Indian cut-off {'<'}80 cm)</AppText>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(6)}}>
            <AppText variant="small" color={Colors.textSecondary}>Peer avg: <AppText variant="small" style={{fontWeight: '700'}}>91 cm</AppText></AppText>
            <AppText variant="small" color={Colors.textSecondary}>You: <AppText variant="small" style={{fontWeight: '700'}}>84 cm</AppText></AppText>
            <View style={[styles.pill, {backgroundColor: Colors.tealBg}]}>
              <AppText variant="small" color={Colors.tealText} style={{fontWeight: '700'}}>Better</AppText>
            </View>
          </View>
          <View style={[styles.insightBox, {backgroundColor: Colors.tealBg}]}>
            <Icon family="Ionicons" name="checkmark-circle-outline" size={16} color={Colors.tealText} />
            <AppText variant="caption" color={Colors.tealText} style={{flex: 1, marginLeft: s(6)}}>
              Your 84 cm waist is better than 68% of peers. However, it still exceeds the 80 cm Indian risk threshold for women.
            </AppText>
          </View>
        </View>
      </View>
    </View>
  );

  /* ── 8. Action Insight ── */
  const renderActionInsight = () => (
    <View style={styles.actionBox}>
      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
        <Icon family="Ionicons" name="bulb-outline" size={20} color={Colors.amberText} />
        <AppText variant="caption" color={Colors.amberText} style={{flex: 1, marginLeft: s(8)}}>
          <AppText variant="caption" color={Colors.amberText} style={{fontWeight: '700'}}>Next steps: </AppText>
          Post-dinner walks (already 8 this month) reduce visceral fat specifically. Each 0.5 kg lost = approx {'\u22120.19'} BMI unit. At current trajectory ({'\u22120.8'} kg per 6 months), you reach BMI 23 in approximately 2.5 years. Doubling walk frequency could halve this.
        </AppText>
      </View>
    </View>
  );

  /* ── 9. Log Weight Button ── */
  const renderLogButton = () => (
    <TouchableOpacity style={styles.logButton} activeOpacity={0.8}>
      <Icon family="Ionicons" name="add-outline" size={20} color={Colors.white} />
      <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>Log weight today</AppText>
    </TouchableOpacity>
  );

  /* ── Render ── */
  return (
    <View style={styles.container}>
      {renderHeroBanner()}
      {renderClassificationCard()}
      {renderKeyStats()}
      {renderBmiTrend()}
      {renderHistory()}
      {renderWhyMatters()}
      {renderPeerGroup()}
      {renderActionInsight()}
      {renderLogButton()}
    </View>
  );
};

/* ─── styles ─── */
const styles = StyleSheet.create({
  container: {
    padding: s(4),
  },

  /* Hero Banner */
  heroBanner: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    padding: s(14),
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  progressTrack: {
    height: vs(5),
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: ms(3),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: Colors.lightGreen,
    borderRadius: ms(3),
  },

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: s(14),
    marginBottom: vs(12),
  },

  /* Pill */
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
    gap: s(3),
  },
  miniPill: {
    paddingHorizontal: s(5),
    paddingVertical: vs(1),
    borderRadius: ms(6),
  },

  /* Classification */
  zoneBarContainer: {
    position: 'relative',
    marginBottom: vs(4),
  },
  zoneBar: {
    flexDirection: 'row',
    height: vs(12),
    borderRadius: ms(4),
    overflow: 'hidden',
  },
  zoneSegment: {
    height: '100%',
  },
  zoneMarker: {
    position: 'absolute',
    top: -vs(3),
    transform: [{translateX: -ms(5)}],
  },
  zoneMarkerDot: {
    width: ms(10),
    height: vs(18),
    backgroundColor: Colors.black,
    borderRadius: ms(2),
    borderWidth: 1.5,
    borderColor: Colors.white,
  },
  amberInsight: {
    backgroundColor: Colors.amberBg,
    borderRadius: ms(10),
    padding: s(10),
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(12),
  },
  classGrid: {
    flexDirection: 'row',
    gap: s(6),
  },
  classGridItem: {
    flex: 1,
    borderRadius: ms(10),
    padding: s(8),
    alignItems: 'center',
  },

  /* Key Stats */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  statCell: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: s(12),
  },

  /* Trend */
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(14),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  legendDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  legendLine: {
    width: ms(14),
    height: 0,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
  },

  /* Table */
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(7),
    paddingHorizontal: s(6),
  },
  tableHeader: {
    backgroundColor: Colors.background,
    borderRadius: ms(6),
    marginBottom: vs(2),
  },
  tableCol1: {flex: 2.2},
  tableCol2: {flex: 1.8},
  tableCol3: {flex: 1.8},
  tableCol4: {flex: 1.2, textAlign: 'right'},

  /* Conditions */
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  conditionIcon: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    justifyContent: 'center',
    alignItems: 'center',
  },

  /* Peer */
  peerHeader: {
    backgroundColor: Colors.primary,
    borderTopLeftRadius: ms(14),
    borderTopRightRadius: ms(14),
    padding: s(14),
  },
  peerBarContainer: {
    position: 'relative',
    height: vs(28),
    marginBottom: vs(12),
  },
  peerBarGradient: {
    flexDirection: 'row',
    height: vs(10),
    borderRadius: ms(5),
    overflow: 'hidden',
  },
  peerMarkerWrap: {
    position: 'absolute',
    top: 0,
    alignItems: 'center',
    transform: [{translateX: -ms(6)}],
  },
  peerMarkerLine: {
    width: ms(2),
    height: vs(14),
    backgroundColor: Colors.textSecondary,
    borderRadius: ms(1),
  },
  distBarTrack: {
    height: vs(8),
    backgroundColor: Colors.background,
    borderRadius: ms(4),
    overflow: 'hidden',
  },
  distBarFill: {
    height: '100%',
    borderRadius: ms(4),
  },
  insightBox: {
    borderRadius: ms(10),
    padding: s(10),
    flexDirection: 'row',
    alignItems: 'flex-start',
  },

  /* Action */
  actionBox: {
    backgroundColor: Colors.amberBg,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(12),
    marginTop: vs(4),
  },

  /* Log Button */
  logButton: {
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(12),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: vs(16),
  },
});

export default BmiTrackerTab;
