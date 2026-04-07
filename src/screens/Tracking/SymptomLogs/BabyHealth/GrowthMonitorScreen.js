import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Svg, {
  Rect as SvgRect,
  Line as SvgLine,
  Circle as SvgCircle,
  Path as SvgPath,
  Text as SvgText,
} from 'react-native-svg';
import Colors from '../../../../constants/colors';
import AppText from '../../../../components/shared/AppText';
import Icon from '../../../../components/shared/Icons';

// ──────────────────────────────────────────────
// Shared subcomponents
// ──────────────────────────────────────────────

const Section = ({title}) => (
  <View style={st.sec}>
    <AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>
      {title}
    </AppText>
    <View style={st.secLine} />
  </View>
);

const InsightRow = ({color, children}) => (
  <View style={st.insightRow}>
    <View style={[st.insightDot, {backgroundColor: color}]} />
    <AppText
      variant="caption"
      color={Colors.textPrimary}
      style={{flex: 1, lineHeight: ms(18)}}>
      {children}
    </AppText>
  </View>
);

const Card = ({icon, iconBg, title, sub, children}) => (
  <View style={st.card}>
    <View style={st.cardHdr}>
      <View style={[st.cardIcon, {backgroundColor: iconBg}]}>
        <Icon family="Ionicons" name={icon} size={ms(16)} color={Colors.white} />
      </View>
      <View style={{flex: 1}}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>
          {title}
        </AppText>
        {sub ? (
          <AppText
            variant="subtext"
            color={Colors.textSecondary}
            style={{marginTop: vs(1)}}>
            {sub}
          </AppText>
        ) : null}
      </View>
    </View>
    <View style={st.cardBody}>{children}</View>
  </View>
);

// ──────────────────────────────────────────────
// LOG TAB
// ──────────────────────────────────────────────

const LogTab = () => {
  const [contextFeed, setContextFeed] = useState(0); // Before / After
  const [contextClothing, setContextClothing] = useState(0); // Undressed / Nappy / Clothed
  const [contextScale, setContextScale] = useState(0); // Home / Clinic / Pharmacy

  const feedOpts = ['Before feed', 'After feed'];
  const clothingOpts = ['Undressed', 'Nappy only', 'Clothed'];
  const scaleOpts = ['Home scale', 'Clinic', 'Pharmacy'];

  const renderChipRow = (items, selected, onSelect) => (
    <View style={st.chipWrap}>
      {items.map((item, i) => {
        const isOn = selected === i;
        return (
          <TouchableOpacity
            key={i}
            style={[
              st.mchip,
              isOn && {
                backgroundColor: Colors.tealBg,
                borderColor: Colors.accent,
              },
            ]}
            onPress={() => onSelect(i)}
            activeOpacity={0.7}>
            <AppText
              variant="caption"
              color={isOn ? Colors.tealText : '#555'}
              style={{fontWeight: isOn ? '700' : '500'}}>
              {item}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  return (
    <View>
      {/* Percentile strip */}
      <View style={st.percentileStrip}>
        <View style={st.percentileCell}>
          <AppText
            variant="bodyBold"
            color={Colors.primary}
            style={{fontSize: ms(18)}}>
            50th
          </AppText>
          <AppText variant="subtext" color={Colors.textSecondary}>
            Weight
          </AppText>
          <AppText
            variant="caption"
            color={Colors.textPrimary}
            style={{fontWeight: '700'}}>
            3.82 kg
          </AppText>
        </View>
        <View style={st.percentileDivider} />
        <View style={st.percentileCell}>
          <AppText
            variant="bodyBold"
            color={Colors.primary}
            style={{fontSize: ms(18)}}>
            55th
          </AppText>
          <AppText variant="subtext" color={Colors.textSecondary}>
            Length
          </AppText>
          <AppText
            variant="caption"
            color={Colors.textPrimary}
            style={{fontWeight: '700'}}>
            53.1 cm
          </AppText>
        </View>
        <View style={st.percentileDivider} />
        <View style={st.percentileCell}>
          <AppText
            variant="bodyBold"
            color={Colors.primary}
            style={{fontSize: ms(18)}}>
            45th
          </AppText>
          <AppText variant="subtext" color={Colors.textSecondary}>
            Head circ.
          </AppText>
          <AppText
            variant="caption"
            color={Colors.textPrimary}
            style={{fontWeight: '700'}}>
            36.5 cm
          </AppText>
        </View>
      </View>

      {/* Body measurements */}
      <Section title="Body measurements · tap to enter" />
      <View style={st.grid2}>
        <TouchableOpacity style={[st.measureBox, {marginRight: s(6)}]} activeOpacity={0.8}>
          <View style={st.measureHeaderRow}>
            <Icon family="Ionicons" name="scale-outline" size={ms(14)} color={Colors.textSecondary} />
            <AppText variant="subtext" color={Colors.textSecondary} style={{marginLeft: s(5), fontWeight: '700'}}>
              Weight
            </AppText>
          </View>
          <AppText variant="screenName" color={Colors.primary} style={{marginTop: vs(4)}}>
            3.82 kg
          </AppText>
          <View style={[st.statusPill, {backgroundColor: Colors.tealBg, marginTop: vs(6)}]}>
            <AppText variant="subtext" color={Colors.tealText} style={{fontWeight: '700'}}>
              50th %ile · Healthy
            </AppText>
          </View>
          <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(6)}}>
            Undressed · before feed
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity style={[st.measureBox, {marginLeft: s(6)}]} activeOpacity={0.8}>
          <View style={st.measureHeaderRow}>
            <Icon family="Ionicons" name="resize-outline" size={ms(14)} color={Colors.textSecondary} />
            <AppText variant="subtext" color={Colors.textSecondary} style={{marginLeft: s(5), fontWeight: '700'}}>
              Length
            </AppText>
          </View>
          <AppText variant="screenName" color={Colors.primary} style={{marginTop: vs(4)}}>
            53.1 cm
          </AppText>
          <View style={[st.statusPill, {backgroundColor: Colors.tealBg, marginTop: vs(6)}]}>
            <AppText variant="subtext" color={Colors.tealText} style={{fontWeight: '700'}}>
              55th %ile · Normal
            </AppText>
          </View>
          <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(6)}}>
            Supine (lying flat)
          </AppText>
        </TouchableOpacity>
      </View>

      <TouchableOpacity style={st.measureBoxFull} activeOpacity={0.8}>
        <View style={st.measureHeaderRow}>
          <Icon family="Ionicons" name="ellipse-outline" size={ms(14)} color={Colors.textSecondary} />
          <AppText variant="subtext" color={Colors.textSecondary} style={{marginLeft: s(5), fontWeight: '700'}}>
            Head circumference
          </AppText>
        </View>
        <AppText variant="screenName" color={Colors.primary} style={{marginTop: vs(4)}}>
          36.5 cm
        </AppText>
        <View style={[st.statusPill, {backgroundColor: Colors.tealBg, marginTop: vs(6), alignSelf: 'flex-start'}]}>
          <AppText variant="subtext" color={Colors.tealText} style={{fontWeight: '700'}}>
            45th %ile · Normal
          </AppText>
        </View>
        <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(6)}}>
          Measured at widest point · OFC
        </AppText>
      </TouchableOpacity>

      {/* Measurement context */}
      <Section title="Measurement context" />
      <View style={st.wcard}>
        <AppText variant="subtext" color={Colors.textSecondary} style={{fontWeight: '700', marginBottom: vs(6)}}>
          Feed timing
        </AppText>
        {renderChipRow(feedOpts, contextFeed, setContextFeed)}
        <AppText variant="subtext" color={Colors.textSecondary} style={{fontWeight: '700', marginTop: vs(10), marginBottom: vs(6)}}>
          Clothing
        </AppText>
        {renderChipRow(clothingOpts, contextClothing, setContextClothing)}
        <AppText variant="subtext" color={Colors.textSecondary} style={{fontWeight: '700', marginTop: vs(10), marginBottom: vs(6)}}>
          Measurement source
        </AppText>
        {renderChipRow(scaleOpts, contextScale, setContextScale)}
      </View>

      {/* Weight gain velocity */}
      <Section title="Weight gain velocity" />
      <View style={st.wcard}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <AppText variant="caption" color={Colors.textSecondary}>
            Gain since birth
          </AppText>
          <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>
            3.1kg  →  3.82kg
          </AppText>
        </View>
        <AppText
          variant="screenName"
          color={Colors.accent}
          style={{marginTop: vs(6), fontSize: ms(28)}}>
          +720g
        </AppText>
        <AppText variant="subtext" color={Colors.textSecondary}>
          in 44 days
        </AppText>

        <View style={st.gainBarWrap}>
          <View style={st.gainBarFill} />
        </View>

        <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(6)}}>
          <AppText variant="subtext" color={Colors.textSecondary}>
            Min: 150g/wk
          </AppText>
          <AppText variant="subtext" color={Colors.amberDark} style={{fontWeight: '700'}}>
            Your gain: ~115g/wk
          </AppText>
          <AppText variant="subtext" color={Colors.tealText}>
            Regained birthweight
          </AppText>
        </View>

        <View style={st.infoBox}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={Colors.tealText} />
          <AppText variant="caption" color={Colors.tealText} style={{flex: 1, lineHeight: ms(17), marginLeft: s(8)}}>
            Zara has regained her birthweight (expected by Day 10-14) and is gaining steadily. Her rate of ~115g/week is at the low-normal end of WHO expected ranges (150-200g/week for breastfed infants 0-3 months). Continue monitoring and discuss at the 6-week review.
          </AppText>
        </View>
      </View>

      {/* WHO milestones */}
      <Section title="WHO milestones · 6 weeks" />
      <View style={st.wcard}>
        {[
          {
            title: 'Back to birthweight',
            sub: 'Day 8 (expected by Day 10-14)',
            status: 'Day 8',
            statusBg: Colors.tealBg,
            statusColor: Colors.tealText,
          },
          {
            title: 'Steady weekly gain',
            sub: '~115g/wk · target 150-200g/wk',
            status: 'Low-normal',
            statusBg: '#FAEEDA',
            statusColor: Colors.amberDark,
          },
          {
            title: 'Length within 2SD',
            sub: '55th percentile · tracking well',
            status: 'Normal',
            statusBg: Colors.tealBg,
            statusColor: Colors.tealText,
          },
        ].map((item, i) => (
          <View key={i} style={[st.milestoneRow, i === 2 && {borderBottomWidth: 0}]}>
            <Icon
              family="Ionicons"
              name="checkmark-circle-outline"
              size={ms(20)}
              color={Colors.accent}
            />
            <View style={{flex: 1, marginLeft: s(10)}}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>
                {item.title}
              </AppText>
              <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(1)}}>
                {item.sub}
              </AppText>
            </View>
            <View style={[st.statusPill, {backgroundColor: item.statusBg}]}>
              <AppText variant="subtext" color={item.statusColor} style={{fontWeight: '700'}}>
                {item.status}
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// CHART TAB
// ──────────────────────────────────────────────

const ChartTab = () => {
  // Chart dimensions
  const W = ms(300);
  const H = ms(210);
  const PAD_L = ms(32);
  const PAD_R = ms(10);
  const PAD_T = ms(12);
  const PAD_B = ms(26);
  const plotW = W - PAD_L - PAD_R;
  const plotH = H - PAD_T - PAD_B;

  const minX = 0;
  const maxX = 90;
  const minY = 2.0;
  const maxY = 8.5;

  const xPos = (day) => PAD_L + ((day - minX) / (maxX - minX)) * plotW;
  const yPos = (kg) => PAD_T + (1 - (kg - minY) / (maxY - minY)) * plotH;

  const dataPoints = [
    {day: 0, kg: 3.1},
    {day: 8, kg: 3.08},
    {day: 18, kg: 3.24},
    {day: 29, kg: 3.51},
    {day: 44, kg: 3.82},
  ];

  // Simple pseudo-percentile bands (approximated curves)
  const bandPath = (factor) => {
    // Curve from approx 3.3 (d0) scaling up
    const pts = [0, 15, 30, 45, 60, 75, 90].map(d => {
      const baseline = 3.3 + d * 0.048; // rough WHO girls 50th
      return {d, kg: baseline * factor};
    });
    let p = `M ${xPos(pts[0].d)} ${yPos(pts[0].kg)}`;
    pts.slice(1).forEach(pt => (p += ` L ${xPos(pt.d)} ${yPos(pt.kg)}`));
    return p;
  };

  const bandTop = bandPath(1.35); // ~97th
  const bandBottom = bandPath(0.75); // ~3rd
  const bandFill = `${bandTop} L ${xPos(90)} ${yPos(0.75 * (3.3 + 90 * 0.048))} ${bandBottom.replace('M', 'L').split('').reverse().join('')}`;

  // Build a shaded band as a polygon
  const bandSteps = [0, 15, 30, 45, 60, 75, 90];
  let bandD = '';
  bandSteps.forEach((d, i) => {
    const kg = (3.3 + d * 0.048) * 1.35;
    bandD += (i === 0 ? 'M ' : ' L ') + xPos(d) + ' ' + yPos(kg);
  });
  [...bandSteps].reverse().forEach(d => {
    const kg = (3.3 + d * 0.048) * 0.75;
    bandD += ' L ' + xPos(d) + ' ' + yPos(kg);
  });
  bandD += ' Z';

  // 50th percentile path
  let medianD = '';
  bandSteps.forEach((d, i) => {
    const kg = 3.3 + d * 0.048;
    medianD += (i === 0 ? 'M ' : ' L ') + xPos(d) + ' ' + yPos(kg);
  });

  // Zara path
  let zaraD = '';
  dataPoints.forEach((pt, i) => {
    zaraD += (i === 0 ? 'M ' : ' L ') + xPos(pt.day) + ' ' + yPos(pt.kg);
  });

  const yTicks = [2, 3, 4, 5, 6, 7, 8];
  const xTicks = [0, 15, 30, 45, 60, 75, 90];

  const history = [
    {date: 'Today', weight: '3.82', length: '53.1', hc: '36.5', highlight: true},
    {date: '21 Mar', weight: '3.51', length: '52.0', hc: '36.0'},
    {date: '10 Mar', weight: '3.24', length: '51.0', hc: '35.8'},
    {date: '28 Feb', weight: '3.08', length: '50.0', hc: '35.2'},
    {date: 'Birth', weight: '3.10', length: '50.0', hc: '35.0'},
  ];

  return (
    <View>
      <Section title="Weight-for-age · WHO Girls · 0-3 months" />
      <View style={st.wcard}>
        <View style={{alignItems: 'center'}}>
          <Svg width={W} height={H}>
            {/* Plot background */}
            <SvgRect
              x={PAD_L}
              y={PAD_T}
              width={plotW}
              height={plotH}
              fill="#FAFBFD"
              stroke="#E5DDD3"
              strokeWidth={0.5}
            />

            {/* Shaded percentile band */}
            <SvgPath d={bandD} fill="rgba(108,99,255,0.12)" stroke="none" />

            {/* Gridlines - y */}
            {yTicks.map(t => (
              <SvgLine
                key={`yg-${t}`}
                x1={PAD_L}
                x2={PAD_L + plotW}
                y1={yPos(t)}
                y2={yPos(t)}
                stroke="#EEE8DC"
                strokeWidth={0.5}
              />
            ))}

            {/* Gridlines - x */}
            {xTicks.map(t => (
              <SvgLine
                key={`xg-${t}`}
                x1={xPos(t)}
                x2={xPos(t)}
                y1={PAD_T}
                y2={PAD_T + plotH}
                stroke="#EEE8DC"
                strokeWidth={0.5}
              />
            ))}

            {/* 50th percentile dashed line */}
            <SvgPath
              d={medianD}
              fill="none"
              stroke={Colors.accent}
              strokeWidth={1.5}
              strokeDasharray="4,3"
            />

            {/* Zara's line */}
            <SvgPath d={zaraD} fill="none" stroke={Colors.primary} strokeWidth={2} />

            {/* Zara's points */}
            {dataPoints.map((pt, i) => (
              <SvgCircle
                key={`dp-${i}`}
                cx={xPos(pt.day)}
                cy={yPos(pt.kg)}
                r={ms(3.5)}
                fill={Colors.primary}
                stroke={Colors.white}
                strokeWidth={1.5}
              />
            ))}

            {/* Y-axis labels */}
            {yTicks.map(t => (
              <SvgText
                key={`yl-${t}`}
                x={PAD_L - ms(4)}
                y={yPos(t) + ms(3)}
                fontSize={ms(9)}
                fill="#6b7280"
                textAnchor="end">
                {t}
              </SvgText>
            ))}

            {/* X-axis labels */}
            {xTicks.map(t => (
              <SvgText
                key={`xl-${t}`}
                x={xPos(t)}
                y={PAD_T + plotH + ms(14)}
                fontSize={ms(9)}
                fill="#6b7280"
                textAnchor="middle">
                {t}d
              </SvgText>
            ))}

            <SvgText
              x={PAD_L - ms(22)}
              y={PAD_T + plotH / 2}
              fontSize={ms(9)}
              fill="#6b7280"
              textAnchor="middle"
              transform={`rotate(-90 ${PAD_L - ms(22)} ${PAD_T + plotH / 2})`}>
              kg
            </SvgText>
          </Svg>
        </View>

        {/* Legend */}
        <View style={st.legendRow}>
          <View style={st.legendItem}>
            <View style={[st.legendSwatch, {backgroundColor: 'rgba(108,99,255,0.25)'}]} />
            <AppText variant="subtext" color={Colors.textSecondary}>
              3rd-97th bands
            </AppText>
          </View>
          <View style={st.legendItem}>
            <View style={[st.legendDash, {backgroundColor: Colors.accent}]} />
            <AppText variant="subtext" color={Colors.textSecondary}>
              50th percentile
            </AppText>
          </View>
          <View style={st.legendItem}>
            <View style={[st.legendDot, {backgroundColor: Colors.primary}]} />
            <AppText variant="subtext" color={Colors.textSecondary}>
              Zara
            </AppText>
          </View>
        </View>
      </View>

      <Section title="Growth history · all measurements" />
      <View style={st.tableCard}>
        <View style={st.tableHeader}>
          <AppText variant="subtext" color={Colors.textSecondary} style={[st.tableHeaderTxt, {flex: 1.2}]}>
            Date
          </AppText>
          <AppText variant="subtext" color={Colors.textSecondary} style={[st.tableHeaderTxt, {flex: 1}]}>
            Weight
          </AppText>
          <AppText variant="subtext" color={Colors.textSecondary} style={[st.tableHeaderTxt, {flex: 1}]}>
            Length
          </AppText>
          <AppText variant="subtext" color={Colors.textSecondary} style={[st.tableHeaderTxt, {flex: 0.9}]}>
            HC
          </AppText>
        </View>
        {history.map((row, i) => (
          <View
            key={i}
            style={[st.tableRow, row.highlight && {backgroundColor: Colors.tealBg}]}>
            <AppText
              variant="caption"
              color={Colors.textPrimary}
              style={{flex: 1.2, fontWeight: row.highlight ? '700' : '600'}}>
              {row.date}
            </AppText>
            <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1}}>
              {row.weight} kg
            </AppText>
            <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1}}>
              {row.length} cm
            </AppText>
            <AppText variant="caption" color={Colors.textPrimary} style={{flex: 0.9}}>
              {row.hc} cm
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// AYU TAB
// ──────────────────────────────────────────────

const AyuTab = () => (
  <View>
    {/* Mini Ayu header */}
    <View style={st.ayuHeader}>
      <AppText
        variant="subtext"
        color="rgba(255,255,255,0.7)"
        style={{textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '700'}}>
        Ayu Intel · Growth
      </AppText>
      <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(4)}}>
        Growth intelligence
      </AppText>
      <View style={st.kpiStrip}>
        <View style={st.kpiCell}>
          <AppText variant="subtext" color="rgba(255,255,255,0.6)">
            Trajectory
          </AppText>
          <AppText variant="bodyBold" color={Colors.white} style={{marginTop: vs(2)}}>
            Normal
          </AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.7)">
            50th %ile
          </AppText>
        </View>
        <View style={st.kpiDivider} />
        <View style={st.kpiCell}>
          <AppText variant="subtext" color="rgba(255,255,255,0.6)">
            Gain rate
          </AppText>
          <AppText variant="bodyBold" color={Colors.white} style={{marginTop: vs(2)}}>
            115g/wk
          </AppText>
          <AppText variant="subtext" color="#FAEEDA">
            Low-normal
          </AppText>
        </View>
        <View style={st.kpiDivider} />
        <View style={st.kpiCell}>
          <AppText variant="subtext" color="rgba(255,255,255,0.6)">
            Next check
          </AppText>
          <AppText variant="bodyBold" color={Colors.white} style={{marginTop: vs(2)}}>
            6-week
          </AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.7)">
            Dr. Preethi
          </AppText>
        </View>
      </View>
    </View>

    <Card
      icon="trending-up-outline"
      iconBg={Colors.accent}
      title="Growth trajectory assessment"
      sub="WHO 0-24 month standards · Girls">
      <InsightRow color={Colors.accent}>
        <AppText style={{fontWeight: '700'}}>Tracking along the 50th percentile</AppText> - Zara's weight (3.82 kg), length (53.1 cm), and head circumference (36.5 cm) are all within 1 SD of the WHO median for girls at 44 days, indicating excellent overall growth.
      </InsightRow>
      <InsightRow color="#BA7517">
        <AppText style={{fontWeight: '700'}}>Weight gain ~115g/week is at the low end</AppText> of the target range (150-200g/week). This is not abnormal, but worth monitoring over the next 2-3 weeks to ensure it does not drop below 100g/week.
      </InsightRow>
      <InsightRow color={Colors.accent}>
        <AppText style={{fontWeight: '700'}}>Head circumference at 45th percentile</AppText> reflects healthy brain growth. HC is the most reliable single indicator of neurological development in the first 6 months.
      </InsightRow>
      <InsightRow color="#378ADD">
        <AppText style={{fontWeight: '700'}}>At the 6-week mark</AppText>, expect weight between 3.9-4.2 kg if the current trajectory continues. If {'<'}3.9 kg at 6 weeks, a feeding review with a lactation consultant is advisable.
      </InsightRow>
    </Card>

    <Card
      icon="nutrition-outline"
      iconBg={Colors.primary}
      title="Nutrition adequacy indicators"
      sub="Breastfed infant · 44 days">
      <InsightRow color={Colors.accent}>
        <AppText style={{fontWeight: '700'}}>8+ wet diapers/day</AppText> is the single best marker of adequate breastmilk intake in exclusively breastfed infants. Combined with steady weight gain, this strongly supports adequate hydration and caloric intake.
      </InsightRow>
      <InsightRow color="#BA7517">
        <AppText style={{fontWeight: '700'}}>Vitamin D supplementation (400 IU/day)</AppText> is recommended for all exclusively breastfed infants from birth. Breastmilk is low in vitamin D regardless of maternal levels. Confirm Zara is receiving this.
      </InsightRow>
      <InsightRow color={Colors.accent}>
        <AppText style={{fontWeight: '700'}}>No solids until 6 months</AppText> - WHO recommends exclusive breastfeeding for the first 6 months. Introducing solids earlier does not improve growth and can increase allergy and infection risk.
      </InsightRow>
    </Card>

    <Card
      icon="warning-outline"
      iconBg="#E24B4A"
      title="When to seek paediatric review"
      sub="Growth red flags for Zara's age">
      <InsightRow color="#E24B4A">
        <AppText style={{fontWeight: '700'}}>Immediate review triggers:</AppText> No weight gain or weight loss over 2 weeks, fewer than 6 wet diapers/day, persistent vomiting, extreme lethargy, or a drop of more than 2 percentile lines on the WHO chart.
      </InsightRow>
      <InsightRow color="#BA7517">
        <AppText style={{fontWeight: '700'}}>Discuss at next appointment:</AppText> Slower-than-expected gain rate (115g/wk), feeding duration and frequency, and any concerns about latch or milk supply. Dr. Preethi will review trends at the 6-week visit.
      </InsightRow>
    </Card>
  </View>
);

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const GrowthMonitorScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('log'); // log | chart | ayu

  const tabs = [
    {id: 'log', label: 'Log today'},
    {id: 'chart', label: 'Chart'},
    {id: 'ayu', label: 'Ayu'},
  ];

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── HEADER ── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topRow}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
            <TouchableOpacity
              style={st.backBtn}
              onPress={() => navigation.goBack()}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon
                family="Ionicons"
                name="chevron-back"
                size={18}
                color={Colors.white}
              />
            </TouchableOpacity>
            <AppText
              variant="body"
              color="rgba(255,255,255,0.85)">
              Growth monitor
            </AppText>
          </View>
          <TouchableOpacity style={st.savePill} activeOpacity={0.8}>
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>
              Save
            </AppText>
            <Icon
              family="Ionicons"
              name="checkmark"
              size={ms(14)}
              color={Colors.white}
              style={{marginLeft: s(4)}}
            />
          </TouchableOpacity>
        </View>

        <AppText
          variant="subtext"
          color="rgba(255,255,255,0.7)"
          style={{textTransform: 'uppercase', letterSpacing: 0.6, fontWeight: '700', marginTop: vs(8)}}>
          Baby Zara · Growth
        </AppText>
        <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(2)}}>
          Growth monitor
        </AppText>
        <AppText
          variant="subtext"
          color="rgba(255,255,255,0.75)"
          style={{marginTop: vs(2)}}>
          44 days old · WHO growth charts · 0-24 months
        </AppText>

        {/* Tab bar */}
        <View style={st.tabBar}>
          {tabs.map(t => {
            const isOn = activeTab === t.id;
            return (
              <TouchableOpacity
                key={t.id}
                style={[st.tabPill, isOn && st.tabPillOn]}
                onPress={() => setActiveTab(t.id)}
                activeOpacity={0.8}>
                <AppText
                  variant="subtext"
                  color={isOn ? Colors.primary : Colors.white}
                  style={{fontWeight: '700'}}>
                  {t.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── BODY ── */}
      <ScrollView
        style={st.body}
        contentContainerStyle={st.bodyContent}
        showsVerticalScrollIndicator={false}>
        {activeTab === 'log' && <LogTab />}
        {activeTab === 'chart' && <ChartTab />}
        {activeTab === 'ayu' && <AyuTab />}
        <View style={{height: vs(20)}} />
      </ScrollView>

      {/* ── Save Button ── */}
      <View style={st.bottomBar}>
        <TouchableOpacity style={st.primaryButton} activeOpacity={0.85}>
          <Icon family="Ionicons" name="save-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
            Save growth {'\u00b7'} 3.82 kg {'\u00b7'} 53.1 cm
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  // Header
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(16),
    paddingBottom: vs(12),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(8),
  },
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  savePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
    paddingHorizontal: s(12),
    paddingVertical: vs(5),
    borderRadius: ms(20),
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
    borderRadius: ms(24),
    padding: ms(4),
    marginTop: vs(12),
    gap: s(4),
  },
  tabPill: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(7),
    borderRadius: ms(20),
  },
  tabPillOn: {backgroundColor: Colors.white},

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(8)},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(16), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Percentile strip
  percentileStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    paddingVertical: vs(12),
    marginTop: vs(10),
  },
  percentileCell: {flex: 1, alignItems: 'center'},
  percentileDivider: {width: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Measurement boxes
  grid2: {flexDirection: 'row', marginBottom: vs(8)},
  measureBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    padding: ms(12),
  },
  measureBoxFull: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    padding: ms(12),
  },
  measureHeaderRow: {flexDirection: 'row', alignItems: 'center'},
  statusPill: {
    alignSelf: 'flex-start',
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(10),
  },

  // Chips
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(5)},
  mchip: {
    paddingHorizontal: s(11),
    paddingVertical: vs(7),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    backgroundColor: '#fff',
  },

  // White card
  wcard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    padding: ms(12),
    marginBottom: vs(8),
  },

  // Weight gain velocity
  gainBarWrap: {
    height: ms(10),
    backgroundColor: '#F0EDE8',
    borderRadius: ms(6),
    overflow: 'hidden',
    marginTop: vs(10),
  },
  gainBarFill: {
    width: '72%',
    height: '100%',
    backgroundColor: Colors.accent,
    borderRadius: ms(6),
  },
  infoBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.tealBg,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.accent,
    padding: ms(10),
    marginTop: vs(10),
  },

  // Milestones
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(9),
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F1ED',
  },

  // Ayu card (reused InsightRow/Card)
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(15),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    marginBottom: vs(9),
    overflow: 'hidden',
  },
  cardHdr: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(9),
    padding: ms(12),
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F1ED',
  },
  cardIcon: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {padding: ms(12)},
  insightRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(9),
    paddingVertical: vs(8),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.background,
  },
  insightDot: {width: ms(7), height: ms(7), borderRadius: ms(4), marginTop: vs(5)},

  // Ayu mini header
  ayuHeader: {
    backgroundColor: Colors.primary,
    borderRadius: ms(16),
    padding: ms(14),
    marginTop: vs(6),
    marginBottom: vs(10),
  },
  kpiStrip: {
    flexDirection: 'row',
    marginTop: vs(12),
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
    paddingVertical: vs(10),
  },
  kpiCell: {flex: 1, alignItems: 'center'},
  kpiDivider: {width: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.2)'},

  // Chart legend
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: vs(10),
    flexWrap: 'wrap',
    gap: s(8),
  },
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: s(5)},
  legendSwatch: {width: ms(14), height: ms(10), borderRadius: ms(2)},
  legendDash: {width: ms(14), height: ms(2), borderRadius: ms(1)},
  legendDot: {width: ms(8), height: ms(8), borderRadius: ms(4)},

  // Table (history)
  tableCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    overflow: 'hidden',
    marginBottom: vs(8),
  },
  tableHeader: {
    flexDirection: 'row',
    backgroundColor: '#F3F1ED',
    paddingVertical: vs(8),
    paddingHorizontal: s(12),
    borderBottomWidth: 0.5,
    borderBottomColor: '#E5DDD3',
  },
  tableHeaderTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3},
  tableRow: {
    flexDirection: 'row',
    paddingVertical: vs(9),
    paddingHorizontal: s(12),
    borderBottomWidth: 0.5,
    borderBottomColor: '#F3F1ED',
  },

  bottomBar: {backgroundColor: Colors.white, paddingHorizontal: s(13), paddingTop: vs(8), paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10), borderTopWidth: 0.5, borderTopColor: '#d1d5db'},
  primaryButton: {flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: vs(13), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
});

export default GrowthMonitorScreen;
