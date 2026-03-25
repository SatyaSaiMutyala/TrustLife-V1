import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Rect, Circle as SvgCircle, Text as SvgText, Line as SvgLine, Path} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

// ─── Constants & Data ───────────────────────────────────────────────────

const ZONE_COLORS = {
  hypothermia: '#3b82f6',
  low: '#60a5fa',
  normal: '#10b981',
  subFebrile: '#f59e0b',
  fever: '#f97316',
  high: '#ef4444',
  danger: '#991b1b',
};

const TEMP_ZONES = [
  {name: 'Hypothermia', color: ZONE_COLORS.hypothermia, range: '<35.0\u00b0C', desc: 'Dangerously low \u00b7 Medical emergency if <32\u00b0C', min: 32, max: 35},
  {name: 'Low', color: ZONE_COLORS.low, range: '35.0\u201336.0\u00b0C', desc: 'Below normal \u00b7 May indicate hypothyroidism, shock, or cold exposure', min: 35, max: 36},
  {name: 'Normal', color: ZONE_COLORS.normal, range: '36.1\u201337.2\u00b0C', desc: 'Healthy range \u00b7 Average 36.6\u00b0C (oral)', min: 36.1, max: 37.2},
  {name: 'Sub-febrile', color: ZONE_COLORS.subFebrile, range: '37.3\u201337.9\u00b0C', desc: 'Low-grade \u00b7 May be normal after exercise or in evening', min: 37.3, max: 37.9},
  {name: 'Fever', color: ZONE_COLORS.fever, range: '38.0\u201339.0\u00b0C', desc: 'Moderate fever \u00b7 Antipyretic recommended if symptomatic', min: 38, max: 39},
  {name: 'High fever', color: ZONE_COLORS.high, range: '39.1\u201341.0\u00b0C', desc: 'High fever \u00b7 Seek medical attention \u00b7 Hydrate aggressively', min: 39.1, max: 41},
  {name: 'Hyperpyrexia', color: ZONE_COLORS.danger, range: '>41.0\u00b0C', desc: 'Life-threatening \u00b7 Emergency department immediately', min: 41, max: 43},
];

const MEASUREMENT_SITES = [
  {id: 'oral', name: 'Oral', icon: 'medical-outline', desc: 'Sublingual \u00b7 \u22120.0\u00b0C', badge: 'Clinical standard', badgeBg: '#fef3c7', badgeColor: '#92400e'},
  {id: 'axillary', name: 'Axillary', icon: 'body-outline', desc: 'Add +0.5\u00b0C for core', badge: 'Most common home', badgeBg: Colors.amberBg, badgeColor: Colors.amberText},
  {id: 'rectal', name: 'Rectal', icon: 'thermometer-outline', desc: '+0.5\u00b0C above oral', badge: 'Most accurate', badgeBg: '#fef3c7', badgeColor: '#92400e'},
  {id: 'tympanic', name: 'Tympanic (ear)', icon: 'ear-outline', desc: '\u2248 Core temp', badge: 'Good \u00b7 Fast', badgeBg: Colors.tealBg, badgeColor: Colors.tealText},
  {id: 'forehead', name: 'Forehead', icon: 'scan-outline', desc: 'May read \u22120.3\u20130.5\u00b0C', badge: 'Convenient', badgeBg: Colors.amberBg, badgeColor: Colors.amberText},
  {id: 'wrist', name: 'Wrist', icon: 'watch-outline', desc: 'Skin temp \u00b7 \u22121 to \u22123\u00b0C', badge: 'Screening only', badgeBg: '#f3f4f6', badgeColor: Colors.textSecondary},
];

const TIME_CHIPS = ['Morning', 'Afternoon', 'Evening', 'Night'];
const ACTIVITY_CHIPS = ['Resting', 'After light activity', 'After exercise', 'Just woken up'];

const CONTEXT_TAGS = [
  'Feeling unwell', 'Took antipyretic', 'Hot drink', 'After bath',
  'Hot environment', 'Cold environment', 'Menstrual', 'Travel',
  'Post-vaccination', 'Post-blood transfusion', 'Routine baseline',
];

const SYMPTOM_TAGS = [
  'Headache', 'Feeling hot', 'Chills', 'Sweating', 'Fatigue',
  'Nausea', 'Body aches', 'Breathlessness', 'Dry mouth',
  'Cold/runny nose', 'Loss of appetite', 'No symptoms',
];

const ILLNESS_CHIPS = ['No routine check', 'New illness', 'Day 2-3', 'Day 4+', 'Recovering'];

const MEDICATIONS = [
  {name: 'Paracetamol', desc: '500mg\u20131g \u00b7 Every 6h \u00b7 Safe with Metformin', action: 'Log dose', actionType: 'primary'},
  {name: 'Ibuprofen', desc: 'Not recommended \u00b7 May raise BP', badge: 'Caution', badgeBg: Colors.redBg, badgeColor: Colors.redText},
  {name: 'Amlodipine 5mg', desc: 'Continue even during fever', badge: 'Logged', badgeBg: Colors.tealBg, badgeColor: Colors.tealText},
  {name: 'Metformin 500mg', desc: 'Consider skipping if not eating', action: 'Note', actionType: 'secondary'},
];

const COMPARISON_ROWS = [
  {label: 'Yesterday', value: '36.4\u00b0C', status: 'Normal'},
  {label: '7-day avg', value: '36.5\u00b0C', status: 'Normal'},
  {label: 'Personal baseline', value: '36.5\u00b0C', status: 'Normal'},
  {label: 'Normal range', value: '36.1\u201337.2\u00b0C', status: '\u2014'},
];

const HISTORY_ROWS = [
  {date: 'Today 7:22 AM', temp: '36.6\u00b0C', site: 'Axillary', zone: 'Normal', source: 'Manual', highlight: true},
  {date: 'Yesterday 7:15 AM', temp: '36.4\u00b0C', site: 'Axillary', zone: 'Normal', source: 'Manual', highlight: false},
  {date: '22 Mar 6:50 PM', temp: '36.8\u00b0C', site: 'Oral', zone: 'Normal', source: 'Digital', highlight: false},
  {date: '21 Mar 7:30 AM', temp: '36.5\u00b0C', site: 'Axillary', zone: 'Normal', source: 'Manual', highlight: false},
  {date: '20 Mar 10:00 PM', temp: '37.1\u00b0C', site: 'Tympanic', zone: 'Normal', source: 'Infrared', highlight: false},
];

const SLIDER_LABELS = [34, 35.5, 36.1, 37.2, 38, 39, 42];

// ─── Thermometer SVG ────────────────────────────────────────────────────

const ThermometerVisual = () => {
  const fillHeight = 55; // proportion for 36.6
  return (
    <Svg width={ms(40)} height={ms(100)} viewBox="0 0 40 100">
      {/* Bulb */}
      <SvgCircle cx="20" cy="85" r="12" fill="#e5e7eb" />
      <SvgCircle cx="20" cy="85" r="9" fill={ZONE_COLORS.normal} />
      {/* Stem */}
      <Rect x="15" y="10" width="10" height="70" rx="5" fill="#e5e7eb" />
      <Rect x="17" y={10 + (70 - fillHeight)} width="6" height={fillHeight} rx="3" fill={ZONE_COLORS.normal} />
      {/* Tick marks */}
      <SvgLine x1="28" y1="20" x2="33" y2="20" stroke="#9ca3af" strokeWidth="0.8" />
      <SvgLine x1="28" y1="35" x2="33" y2="35" stroke="#9ca3af" strokeWidth="0.8" />
      <SvgLine x1="28" y1="50" x2="33" y2="50" stroke="#9ca3af" strokeWidth="0.8" />
      <SvgLine x1="28" y1="65" x2="33" y2="65" stroke="#9ca3af" strokeWidth="0.8" />
    </Svg>
  );
};

// ─── Temperature Range Track Bar ────────────────────────────────────────

const TempRangeBar = () => {
  const barWidth = 280;
  const segments = [
    {color: ZONE_COLORS.hypothermia, flex: 3},
    {color: ZONE_COLORS.low, flex: 1},
    {color: ZONE_COLORS.normal, flex: 1.1},
    {color: ZONE_COLORS.subFebrile, flex: 0.7},
    {color: ZONE_COLORS.fever, flex: 1},
    {color: ZONE_COLORS.high, flex: 2},
    {color: ZONE_COLORS.danger, flex: 2},
  ];
  const totalFlex = segments.reduce((a, b) => a + b.flex, 0);
  // 36.6 position: roughly in the middle of normal zone
  const markerPos = ((35 - 32 + 1 + (36.6 - 36.1) / (37.2 - 36.1) * 1.1) / totalFlex) * barWidth;

  return (
    <Svg width={ms(barWidth)} height={ms(24)} viewBox={`0 0 ${barWidth} 24`}>
      {segments.reduce((acc, seg, i) => {
        const prevWidth = acc.offset;
        const w = (seg.flex / totalFlex) * barWidth;
        acc.elements.push(
          <Rect key={i} x={prevWidth} y={8} width={w} height={8} rx={i === 0 ? 4 : 0} ry={i === segments.length - 1 ? 4 : 0} fill={seg.color} />,
        );
        acc.offset += w;
        return acc;
      }, {elements: [], offset: 0}).elements}
      <SvgCircle cx={markerPos} cy={12} r={5} fill={Colors.white} stroke={ZONE_COLORS.normal} strokeWidth={2} />
    </Svg>
  );
};

// ─── Slider Visual ──────────────────────────────────────────────────────

const SliderBar = () => {
  const barWidth = 280;
  const segments = [
    {color: ZONE_COLORS.hypothermia, flex: 2},
    {color: ZONE_COLORS.low, flex: 1.5},
    {color: ZONE_COLORS.normal, flex: 1.1},
    {color: ZONE_COLORS.subFebrile, flex: 0.8},
    {color: ZONE_COLORS.fever, flex: 1},
    {color: ZONE_COLORS.high, flex: 3},
    {color: ZONE_COLORS.danger, flex: 1},
  ];
  const totalFlex = segments.reduce((a, b) => a + b.flex, 0);
  const fillFraction = (36.6 - 34) / (42 - 34);
  const fillWidth = fillFraction * barWidth;

  return (
    <View>
      <Svg width={ms(barWidth)} height={ms(14)} viewBox={`0 0 ${barWidth} 14`}>
        <Rect x={0} y={3} width={barWidth} height={8} rx={4} fill="#e5e7eb" />
        {segments.reduce((acc, seg, i) => {
          const prevWidth = acc.offset;
          const w = (seg.flex / totalFlex) * barWidth;
          const clippedW = Math.min(w, Math.max(0, fillWidth - prevWidth));
          if (clippedW > 0) {
            acc.elements.push(
              <Rect key={i} x={prevWidth} y={3} width={clippedW} height={8} rx={i === 0 ? 4 : 0} fill={seg.color} />,
            );
          }
          acc.offset += w;
          return acc;
        }, {elements: [], offset: 0}).elements}
        <SvgCircle cx={fillWidth} cy={7} r={6} fill={Colors.white} stroke={ZONE_COLORS.normal} strokeWidth={2} />
      </Svg>
      <View style={styles.sliderLabels}>
        {SLIDER_LABELS.map((l, i) => (
          <AppText key={i} variant="small" color={Colors.textTertiary}>{l}</AppText>
        ))}
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Main Component
// ──────────────────────────────────────────────

const TempManualView = () => {
  const [activeSite, setActiveSite] = useState('axillary');
  const [activeTime, setActiveTime] = useState('Morning');
  const [activeActivity, setActiveActivity] = useState('Resting');
  const [selectedContexts, setSelectedContexts] = useState(['Routine baseline']);
  const [selectedSymptoms, setSelectedSymptoms] = useState([]);
  const [activeIllness, setActiveIllness] = useState('No routine check');
  const [notes, setNotes] = useState('');

  const toggleTag = (tag, list, setter) => {
    setter(list.includes(tag) ? list.filter(t => t !== tag) : [...list, tag]);
  };

  return (
    <View>
      {/* ── 1. Temperature Display ── */}
      <View style={styles.card}>
        <View style={styles.tempDisplayRow}>
          <View style={{flex: 1}}>
            <AppText variant="small" color={Colors.textSecondary}>Current reading</AppText>
            <AppText style={styles.tempBigNumber}>36.6</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>{'\u00b0'}C</AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(4)}}>
              Tap to adjust
            </AppText>
          </View>
          <ThermometerVisual />
        </View>
        <View style={styles.tempZoneRow}>
          <View style={[styles.tempZoneDot, {backgroundColor: ZONE_COLORS.normal}]} />
          <AppText variant="bodyBold" color={Colors.tealText} style={{marginLeft: s(6)}}>
            Normal
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(8)}}>
            Healthy range 36.1{'\u2013'}37.2{'\u00b0'}C
          </AppText>
        </View>
        <View style={{marginTop: vs(10), alignItems: 'center'}}>
          <TempRangeBar />
        </View>
      </View>

      {/* ── 2. Slider Section ── */}
      <View style={styles.card}>
        <View style={styles.sliderHeader}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>Temperature</AppText>
          <View style={styles.sliderValueBadge}>
            <AppText variant="caption" color={Colors.primary} style={{fontWeight: '700'}}>
              36.6 {'\u00b0'}C
            </AppText>
          </View>
        </View>
        <View style={{marginTop: vs(12), alignItems: 'center'}}>
          <SliderBar />
        </View>
      </View>

      {/* ── 3. Derived Values ── */}
      <View style={styles.derivedRow}>
        <View style={styles.derivedBox}>
          <AppText variant="small" color={Colors.textSecondary}>{'\u00b0'}F equiv.</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary}>97.9{'\u00b0'}F</AppText>
        </View>
        <View style={styles.derivedBox}>
          <AppText variant="small" color={Colors.textSecondary}>Zone</AppText>
          <AppText variant="bodyBold" color={Colors.tealText}>Normal</AppText>
        </View>
        <View style={styles.derivedBox}>
          <AppText variant="small" color={Colors.textSecondary}>vs Baseline</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary}>+0.0</AppText>
        </View>
        <View style={styles.derivedBox}>
          <AppText variant="small" color={Colors.textSecondary}>vs Yesterday</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary}>{'\u2014'}</AppText>
        </View>
      </View>

      {/* ── 4. Measurement Site ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>MEASUREMENT SITE</AppText>
      <View style={styles.siteGrid}>
        {MEASUREMENT_SITES.map(site => (
          <TouchableOpacity
            key={site.id}
            activeOpacity={0.7}
            onPress={() => setActiveSite(site.id)}
            style={[
              styles.siteCard,
              activeSite === site.id && styles.siteCardActive,
            ]}>
            <Icon
              family="Ionicons"
              name={site.icon}
              size={ms(20)}
              color={activeSite === site.id ? Colors.primary : Colors.textSecondary}
            />
            <AppText
              variant="bodyBold"
              color={activeSite === site.id ? Colors.primary : Colors.textPrimary}
              style={{marginTop: vs(6)}}>
              {site.name}
            </AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
              {site.desc}
            </AppText>
            <View style={[styles.siteBadge, {backgroundColor: site.badgeBg}]}>
              <AppText variant="small" color={site.badgeColor} style={{fontWeight: '600'}}>
                {site.badge}
              </AppText>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── 5. Correction Note ── */}
      <View style={styles.correctionCard}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={Colors.amberText} />
          <AppText variant="bodyBold" color={Colors.amberText} style={{marginLeft: s(6)}}>
            Axillary correction
          </AppText>
        </View>
        <AppText variant="caption" color={Colors.amberText} style={{marginTop: vs(4), lineHeight: ms(17)}}>
          Add 0.5{'\u00b0'}C to get estimated core temperature. Axillary reading of 36.6{'\u00b0'}C corresponds to approximately 37.1{'\u00b0'}C core temperature, which is still within the normal range.
        </AppText>
      </View>

      {/* ── 6. Time & Activity Context ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>TIME & ACTIVITY CONTEXT</AppText>
      <View style={styles.card}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>Time of day</AppText>
        <View style={styles.chipRow}>
          {TIME_CHIPS.map(chip => (
            <TouchableOpacity
              key={chip}
              activeOpacity={0.7}
              onPress={() => setActiveTime(chip)}
              style={[styles.chip, activeTime === chip && styles.chipActive]}>
              <AppText
                variant="small"
                color={activeTime === chip ? Colors.primary : Colors.textSecondary}
                style={{fontWeight: activeTime === chip ? '700' : '500'}}>
                {chip}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
        <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginTop: vs(12)}}>Activity</AppText>
        <View style={styles.chipRow}>
          {ACTIVITY_CHIPS.map(chip => (
            <TouchableOpacity
              key={chip}
              activeOpacity={0.7}
              onPress={() => setActiveActivity(chip)}
              style={[styles.chip, activeActivity === chip && styles.chipActive]}>
              <AppText
                variant="small"
                color={activeActivity === chip ? Colors.primary : Colors.textSecondary}
                style={{fontWeight: activeActivity === chip ? '700' : '500'}}>
                {chip}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
        <View style={styles.insightBlue}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(14)} color={Colors.blueText} />
          <AppText variant="small" color={Colors.blueText} style={{marginLeft: s(6), flex: 1, lineHeight: ms(16)}}>
            Body temperature follows a circadian rhythm {'\u2014'} lowest in early morning (~36.2{'\u00b0'}C) and highest in late afternoon/evening (~37.0{'\u00b0'}C). Comparing readings at the same time each day gives the most meaningful trend.
          </AppText>
        </View>
      </View>

      {/* ── 7. Context Tags ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>CONTEXT</AppText>
      <View style={styles.card}>
        <View style={styles.chipRow}>
          {CONTEXT_TAGS.map(tag => (
            <TouchableOpacity
              key={tag}
              activeOpacity={0.7}
              onPress={() => toggleTag(tag, selectedContexts, setSelectedContexts)}
              style={[styles.chip, selectedContexts.includes(tag) && styles.chipActive]}>
              <AppText
                variant="small"
                color={selectedContexts.includes(tag) ? Colors.primary : Colors.textSecondary}
                style={{fontWeight: selectedContexts.includes(tag) ? '700' : '500'}}>
                {tag}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── 8. Symptoms ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>SYMPTOMS RIGHT NOW</AppText>
      <View style={styles.card}>
        <View style={styles.chipRow}>
          {SYMPTOM_TAGS.map(tag => {
            const isNoSymptoms = tag === 'No symptoms';
            const isActive = selectedSymptoms.includes(tag);
            return (
              <TouchableOpacity
                key={tag}
                activeOpacity={0.7}
                onPress={() => toggleTag(tag, selectedSymptoms, setSelectedSymptoms)}
                style={[
                  styles.chip,
                  isActive && !isNoSymptoms && styles.chipActive,
                  isActive && isNoSymptoms && styles.chipActiveGreen,
                ]}>
                <AppText
                  variant="small"
                  color={isActive ? (isNoSymptoms ? Colors.tealText : Colors.primary) : Colors.textSecondary}
                  style={{fontWeight: isActive ? '700' : '500'}}>
                  {tag}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── 9. Illness Episode ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>IS THIS PART OF AN ILLNESS EPISODE?</AppText>
      <View style={styles.card}>
        <View style={styles.chipRow}>
          {ILLNESS_CHIPS.map(chip => (
            <TouchableOpacity
              key={chip}
              activeOpacity={0.7}
              onPress={() => setActiveIllness(chip)}
              style={[styles.chip, activeIllness === chip && styles.chipActive]}>
              <AppText
                variant="small"
                color={activeIllness === chip ? Colors.primary : Colors.textSecondary}
                style={{fontWeight: activeIllness === chip ? '700' : '500'}}>
                {chip}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── 10. Fever Medication ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>FEVER MEDICATION</AppText>
      <View style={styles.card}>
        {MEDICATIONS.map((med, i) => (
          <View
            key={i}
            style={[styles.medRow, i < MEDICATIONS.length - 1 && styles.medRowBorder]}>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>{med.name}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                {med.desc}
              </AppText>
            </View>
            {med.badge ? (
              <View style={[styles.medBadge, {backgroundColor: med.badgeBg}]}>
                <AppText variant="small" color={med.badgeColor} style={{fontWeight: '600'}}>
                  {med.badge}
                </AppText>
              </View>
            ) : (
              <TouchableOpacity
                activeOpacity={0.7}
                style={[
                  styles.medAction,
                  med.actionType === 'primary' && styles.medActionPrimary,
                ]}>
                <AppText
                  variant="small"
                  color={med.actionType === 'primary' ? Colors.white : Colors.primary}
                  style={{fontWeight: '600'}}>
                  {med.action}
                </AppText>
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>

      {/* ── 11. Fever & T2DM Insight ── */}
      <View style={styles.insightOrange}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon family="Ionicons" name="alert-circle-outline" size={ms(16)} color="#c2410c" />
          <AppText variant="bodyBold" color="#c2410c" style={{marginLeft: s(6)}}>
            Fever & T2DM
          </AppText>
        </View>
        <AppText variant="caption" color="#c2410c" style={{marginTop: vs(4), lineHeight: ms(17)}}>
          Fever triggers stress hormone response (cortisol, adrenaline) which can raise blood glucose significantly. Monitor BG every 4{'\u2013'}6 hours during fever. Stay hydrated. Consider adjusting Metformin if unable to eat. Never skip Amlodipine.
        </AppText>
      </View>

      {/* ── 12. Comparison ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>HOW THIS COMPARES</AppText>
      <View style={styles.card}>
        {COMPARISON_ROWS.map((row, i) => (
          <View
            key={i}
            style={[styles.compareRow, i < COMPARISON_ROWS.length - 1 && styles.compareRowBorder]}>
            <AppText variant="body" color={Colors.textSecondary} style={{flex: 1}}>{row.label}</AppText>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{width: s(80), textAlign: 'right'}}>{row.value}</AppText>
            <AppText variant="small" color={Colors.tealText} style={{width: s(55), textAlign: 'right'}}>{row.status}</AppText>
          </View>
        ))}
      </View>

      {/* ── 13. History ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>RECENT HISTORY</AppText>
      <View style={styles.card}>
        {/* Table header */}
        <View style={styles.tableHeaderRow}>
          <AppText variant="small" color={Colors.textTertiary} style={{flex: 2}}>Date{'\u00b7'}Time</AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{flex: 1, textAlign: 'center'}}>Temp</AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{flex: 1, textAlign: 'center'}}>Site</AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{flex: 1, textAlign: 'center'}}>Zone</AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{flex: 1, textAlign: 'center'}}>Source</AppText>
        </View>
        {HISTORY_ROWS.map((row, i) => (
          <View
            key={i}
            style={[
              styles.tableRow,
              row.highlight && styles.tableRowHighlight,
              i < HISTORY_ROWS.length - 1 && styles.tableRowBorder,
            ]}>
            <AppText variant="small" color={row.highlight ? Colors.primary : Colors.textPrimary} style={{flex: 2, fontWeight: row.highlight ? '700' : '400'}}>{row.date}</AppText>
            <AppText variant="small" color={Colors.textPrimary} style={{flex: 1, textAlign: 'center', fontWeight: '600'}}>{row.temp}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{flex: 1, textAlign: 'center'}}>{row.site}</AppText>
            <AppText variant="small" color={Colors.tealText} style={{flex: 1, textAlign: 'center'}}>{row.zone}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{flex: 1, textAlign: 'center'}}>{row.source}</AppText>
          </View>
        ))}
      </View>

      {/* ── 14. Zone Reference ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>TEMPERATURE ZONES REFERENCE</AppText>
      <View style={styles.card}>
        {TEMP_ZONES.map((zone, i) => {
          const isNormal = zone.name === 'Normal';
          return (
            <View
              key={i}
              style={[
                styles.zoneRefRow,
                isNormal && styles.zoneRefRowHighlight,
                i < TEMP_ZONES.length - 1 && styles.zoneRefRowBorder,
              ]}>
              <View style={[styles.zoneRefBar, {backgroundColor: zone.color}]} />
              <View style={{flex: 1, marginLeft: s(10)}}>
                <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                  <AppText variant="bodyBold" color={isNormal ? Colors.tealText : Colors.textPrimary}>
                    {zone.name}
                  </AppText>
                  <AppText variant="small" color={Colors.textSecondary}>{zone.range}</AppText>
                </View>
                <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(15)}}>
                  {zone.desc}
                </AppText>
              </View>
            </View>
          );
        })}
      </View>

      {/* ── 15. Notes ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>NOTE</AppText>
      <View style={styles.card}>
        <TextInput
          style={styles.textInput}
          placeholder="Add notes about this reading..."
          placeholderTextColor={Colors.textTertiary}
          multiline
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const styles = StyleSheet.create({
  sectionHeading: {
    marginTop: vs(18),
    marginBottom: vs(8),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginBottom: vs(10),
  },

  // 1. Temp display
  tempDisplayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tempBigNumber: {
    fontSize: ms(38),
    fontWeight: '700',
    color: ZONE_COLORS.normal,
    lineHeight: ms(44),
  },
  tempZoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(8),
  },
  tempZoneDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
  },

  // 2. Slider
  sliderHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  sliderValueBadge: {
    backgroundColor: Colors.tealBg,
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  sliderLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(4),
    paddingHorizontal: s(2),
  },

  // 3. Derived values
  derivedRow: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(10),
  },
  derivedBox: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(10),
    alignItems: 'center',
  },

  // 4. Measurement site grid
  siteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginBottom: vs(10),
  },
  siteCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(12),
  },
  siteCardActive: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    backgroundColor: Colors.tealBg,
  },
  siteBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
    marginTop: vs(6),
  },

  // 5. Correction card
  correctionCard: {
    backgroundColor: Colors.amberBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginBottom: vs(10),
  },

  // 6. Chips
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginTop: vs(8),
  },
  chip: {
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    backgroundColor: Colors.white,
  },
  chipActive: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.primary,
  },
  chipActiveGreen: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.tealText,
  },

  // Insights
  insightBlue: {
    flexDirection: 'row',
    backgroundColor: Colors.blueBg,
    borderRadius: ms(10),
    padding: ms(10),
    marginTop: vs(12),
    alignItems: 'flex-start',
  },
  insightOrange: {
    backgroundColor: '#fff7ed',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginTop: vs(4),
    marginBottom: vs(10),
  },

  // 10. Medication
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  medRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  medBadge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(10),
    marginLeft: s(8),
  },
  medAction: {
    paddingHorizontal: s(12),
    paddingVertical: vs(5),
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.primary,
    marginLeft: s(8),
  },
  medActionPrimary: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  // 12. Comparison
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  compareRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },

  // 13. History table
  tableHeaderRow: {
    flexDirection: 'row',
    paddingBottom: vs(6),
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  tableRowHighlight: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(8),
    marginHorizontal: s(-6),
    paddingHorizontal: s(6),
  },
  tableRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },

  // 14. Zone reference
  zoneRefRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(8),
  },
  zoneRefRowHighlight: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(8),
    borderWidth: 1,
    borderColor: Colors.primary,
    marginHorizontal: s(-6),
    paddingHorizontal: s(6),
  },
  zoneRefRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },
  zoneRefBar: {
    width: ms(4),
    height: ms(32),
    borderRadius: ms(2),
    marginTop: vs(2),
  },

  // 15. Notes
  textInput: {
    minHeight: vs(80),
    fontSize: ms(14),
    color: Colors.textPrimary,
    padding: 0,
  },
});

export default TempManualView;
