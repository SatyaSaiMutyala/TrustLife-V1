import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Polyline, Rect, Line as SvgLine, Text as SvgText, Circle as SvgCircle} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

/* ───────── static data ───────── */

const SOURCES = [
  {
    id: 'cgm',
    icon: 'bandage-outline',
    name: 'CGM sensor',
    description: 'Libre \u00b7 Dexcom \u00b7 Eversense \u00b7 Scan or auto-sync',
    status: 'Scan to connect',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
  {
    id: 'glucometer',
    icon: 'analytics-outline',
    name: 'Glucometer',
    description: 'Accu-Chek \u00b7 OneTouch \u00b7 Dr Morepen \u00b7 Bluetooth',
    status: 'Accu-Chek linked',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    id: 'libre',
    icon: 'phone-portrait-outline',
    name: 'Libre NFC scan',
    description: 'Tap phone to FreeStyle Libre sensor on arm',
    status: 'NFC scan',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
  {
    id: 'apple',
    icon: 'heart-outline',
    name: 'Apple Health',
    description: 'Import all historical readings automatically',
    status: '142 readings',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
];

const RECENT_READINGS = [
  {date: 'Today', time: '7:18 AM', glucose: '8.6', color: Colors.amberText, type: 'Fasting', badge: 'New', badgeBg: Colors.amberBg, badgeColor: Colors.amberText},
  {date: '23 Mar', time: '9:22 PM', glucose: '9.2', color: Colors.amberText, type: 'Post-meal', badge: 'Saved', badgeBg: '#f3f4f6', badgeColor: Colors.textSecondary},
  {date: '23 Mar', time: '7:15 AM', glucose: '8.8', color: Colors.amberText, type: 'Fasting', badge: 'Saved', badgeBg: '#f3f4f6', badgeColor: Colors.textSecondary},
  {date: '22 Mar', time: '8:55 PM', glucose: '7.8', color: Colors.tealText, type: 'Post-meal', badge: 'Saved', badgeBg: '#f3f4f6', badgeColor: Colors.textSecondary},
];

const CGM_DATA = [9.2,9.0,8.8,8.6,8.7,9.0,9.4,9.8,9.6,9.3,9.0,8.8,8.6,8.5,8.4,8.3,8.3,8.4,8.3,8.3,8.2,8.1,8.2,8.3,8.4,8.3,8.2,8.2,8.1,8.2,8.2,8.1,8.2,8.2,8.1,8.2];

/* ───────── component ───────── */

const GlucoseAutoView = () => {
  const [activeSource, setActiveSource] = useState('glucometer');

  /* ── 1. Source Grid ── */
  const renderSourceGrid = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        SELECT MEASUREMENT SOURCE
      </AppText>
      <View style={st.sourceGrid}>
        {SOURCES.map(src => {
          const active = activeSource === src.id;
          return (
            <TouchableOpacity
              key={src.id}
              activeOpacity={0.7}
              onPress={() => setActiveSource(src.id)}
              style={[
                st.sourceCard,
                active && {borderColor: Colors.primary, backgroundColor: '#f0f7f4'},
              ]}>
              <Icon
                family="Ionicons"
                name={src.icon}
                size={ms(22)}
                color={active ? Colors.primary : Colors.textSecondary}
              />
              <AppText
                variant="bodyBold"
                color={active ? Colors.primary : Colors.textPrimary}
                style={{marginTop: vs(4)}}>
                {src.name}
              </AppText>
              <AppText
                variant="small"
                color={Colors.textSecondary}
                style={{marginTop: vs(2), lineHeight: ms(15)}}>
                {src.description}
              </AppText>
              <View style={[st.statusBadge, {backgroundColor: src.statusBg}]}>
                <AppText variant="small" color={src.statusColor}>
                  {src.status}
                </AppText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  /* ── 2. Glucometer Panel ── */
  const renderGlucometerPanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        ACCU-CHEK INSTANT S {'\u00b7'} BLUETOOTH
      </AppText>

      {/* Latest reading card */}
      <View style={st.card}>
        <AppText variant="body" color={Colors.textSecondary} style={{textAlign: 'center'}}>
          Latest reading from device
        </AppText>
        <View style={{alignItems: 'center', marginTop: vs(8)}}>
          <AppText
            variant="bodyBold"
            color={Colors.amberText}
            numberOfLines={1}
            adjustsFontSizeToFit
            style={{fontSize: ms(28), lineHeight: ms(34)}}>
            8.6
          </AppText>
          <View style={{flexDirection: 'row', alignItems: 'center', marginTop: vs(4)}}>
            <AppText variant="body" color={Colors.textSecondary}>mmol/L</AppText>
            <Icon family="Ionicons" name="remove-outline" size={ms(16)} color={Colors.amberText} style={{marginLeft: s(6)}} />
            <AppText variant="small" color={Colors.amberText} style={{marginLeft: s(2)}}>Stable</AppText>
          </View>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: vs(8), flexWrap: 'wrap', gap: s(6)}}>
          <View style={[st.statusBadge, {backgroundColor: Colors.amberBg}]}>
            <AppText variant="small" color={Colors.amberText}>Above fasting target</AppText>
          </View>
          <View style={[st.statusBadge, {backgroundColor: '#f3f4f6'}]}>
            <AppText variant="small" color={Colors.textSecondary}>Fasting 9h</AppText>
          </View>
        </View>
      </View>

      {/* Action buttons */}
      <View style={{flexDirection: 'row', gap: s(10), marginTop: vs(10)}}>
        <TouchableOpacity activeOpacity={0.7} style={[st.primaryBtn, {flex: 1}]}>
          <Icon family="Ionicons" name="checkmark-outline" size={ms(16)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
            Use this reading {'\u00b7'} 8.6 mmol/L
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity activeOpacity={0.7} style={[st.outlineBtn]}>
          <Icon family="Ionicons" name="refresh-outline" size={ms(16)} color={Colors.primary} />
          <AppText variant="bodyBold" color={Colors.primary} style={{marginLeft: s(6)}}>
            Refresh
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Recent readings table */}
      <View style={[st.card, {marginTop: vs(14)}]}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>
          Recent readings
        </AppText>

        {/* Table header */}
        <View style={[st.tableRow, {marginTop: vs(10), borderBottomWidth: 0.5, borderBottomColor: '#d1d5db', paddingBottom: vs(6)}]}>
          <AppText variant="small" color={Colors.textSecondary} style={{flex: 2}}>Date {'\u00b7'} Time</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{flex: 1, textAlign: 'center'}}>Glucose</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{flex: 1, textAlign: 'center'}}>Type</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{flex: 1, textAlign: 'right'}}>Status</AppText>
        </View>

        {/* Table rows */}
        {RECENT_READINGS.map((r, i) => (
          <View key={i} style={[st.tableRow, {paddingVertical: vs(7), borderBottomWidth: i < RECENT_READINGS.length - 1 ? 0.5 : 0, borderBottomColor: '#e5e7eb'}]}>
            <View style={{flex: 2}}>
              <AppText variant="small" color={Colors.textPrimary}>{r.date}</AppText>
              <AppText variant="small" color={Colors.textSecondary}>{r.time}</AppText>
            </View>
            <AppText variant="bodyBold" color={r.color} style={{flex: 1, textAlign: 'center'}}>{r.glucose}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{flex: 1, textAlign: 'center'}}>{r.type}</AppText>
            <View style={{flex: 1, alignItems: 'flex-end'}}>
              <View style={[st.statusBadge, {backgroundColor: r.badgeBg}]}>
                <AppText variant="small" color={r.badgeColor}>{r.badge}</AppText>
              </View>
            </View>
          </View>
        ))}

        {/* Footer */}
        <TouchableOpacity activeOpacity={0.7} style={{marginTop: vs(10), alignItems: 'center'}}>
          <AppText variant="bodyBold" color={Colors.primary}>
            Import all unsynced readings {'\u2192'}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ── 3. CGM Panel ── */
  const renderCgmPanel = () => {
    /* SVG chart helpers */
    const yMin = 3.0;
    const yMax = 12.0;
    const chartW = 340;
    const chartH = 100;
    const toY = v => chartH - ((v - yMin) / (yMax - yMin)) * chartH;
    const stepX = chartW / (CGM_DATA.length - 1);
    const polyPoints = CGM_DATA.map((v, i) => `${(i * stepX).toFixed(1)},${toY(v).toFixed(1)}`).join(' ');
    const fillPoints = `0,${toY(CGM_DATA[0]).toFixed(1)} ${polyPoints} ${((CGM_DATA.length - 1) * stepX).toFixed(1)},${chartH} 0,${chartH}`;
    const lastX = (CGM_DATA.length - 1) * stepX;
    const lastY = toY(CGM_DATA[CGM_DATA.length - 1]);

    /* TIR bar segments */
    const tirSegments = [
      {pct: 10, color: Colors.red, label: 'Below range'},
      {pct: 62, color: Colors.primary, label: 'In range'},
      {pct: 23, color: Colors.amber, label: 'Above range'},
      {pct: 5, color: Colors.redDark, label: 'Very high'},
    ];

    return (
      <View style={st.section}>
        <AppText variant="sectionTitle" color={Colors.textPrimary}>
          CGM LIVE READINGS {'\u00b7'} FREESTYLE LIBRE 3
        </AppText>

        {/* Dark hero card */}
        <View style={st.darkHero}>
          <View style={{alignItems: 'center'}}>
            <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
              <AppText
                variant="bodyBold"
                color={Colors.amberText}
                numberOfLines={1}
                adjustsFontSizeToFit
                style={{fontSize: ms(28), lineHeight: ms(34)}}>
                8.2
              </AppText>
              <Icon family="Ionicons" name="trending-up" size={ms(22)} color={Colors.amberText} style={{marginLeft: s(6), marginBottom: vs(3)}} />
            </View>
            <AppText variant="body" color="rgba(255,255,255,0.7)" style={{marginTop: vs(4)}}>
              mmol/L {'\u00b7'} Live CGM reading
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginTop: vs(4)}}>
              Updated 3 minutes ago {'\u00b7'} Sensor worn 5 days
            </AppText>
          </View>

          {/* Sensor chips */}
          <View style={{flexDirection: 'row', justifyContent: 'center', marginTop: vs(10), flexWrap: 'wrap', gap: s(6)}}>
            <View style={[st.heroChip]}>
              <AppText variant="small" color="rgba(255,255,255,0.8)">Sensor: 9 days left</AppText>
            </View>
            <View style={[st.heroChip]}>
              <AppText variant="small" color="rgba(255,255,255,0.8)">Signal: Strong</AppText>
            </View>
            <View style={[st.heroChip]}>
              <AppText variant="small" color="rgba(255,255,255,0.8)">Calibrated {'\u2713'}</AppText>
            </View>
          </View>
        </View>

        {/* 3h Glucose SVG chart */}
        <View style={[st.card, {marginTop: vs(14)}]}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>
            3-hour glucose trend
          </AppText>
          <View style={{marginTop: vs(8)}}>
            <Svg width="100%" height={vs(120)} viewBox="0 0 340 100" preserveAspectRatio="none">
              {/* Target zone fill 3.9–10.0 */}
              <Rect
                x="0"
                y={toY(10.0).toFixed(1)}
                width="340"
                height={(toY(3.9) - toY(10.0)).toFixed(1)}
                fill="rgba(10,92,71,0.06)"
              />
              {/* Dashed reference lines */}
              <SvgLine x1="0" y1={toY(3.9).toFixed(1)} x2="340" y2={toY(3.9).toFixed(1)} stroke={Colors.red} strokeWidth="0.8" strokeDasharray="4,3" />
              <SvgLine x1="0" y1={toY(7.0).toFixed(1)} x2="340" y2={toY(7.0).toFixed(1)} stroke={Colors.primary} strokeWidth="0.8" strokeDasharray="4,3" />
              <SvgLine x1="0" y1={toY(10.0).toFixed(1)} x2="340" y2={toY(10.0).toFixed(1)} stroke={Colors.amber} strokeWidth="0.8" strokeDasharray="4,3" />
              {/* Y labels */}
              <SvgText x="2" y={toY(3.9) + 3} fontSize="8" fill={Colors.red}>3.9</SvgText>
              <SvgText x="2" y={toY(7.0) - 2} fontSize="8" fill={Colors.primary}>7.0</SvgText>
              <SvgText x="2" y={toY(10.0) - 2} fontSize="8" fill={Colors.amber}>10.0</SvgText>
              {/* Green area fill */}
              <Polyline
                points={fillPoints}
                fill="rgba(10,92,71,0.12)"
                stroke="none"
              />
              {/* Green polyline */}
              <Polyline
                points={polyPoints}
                fill="none"
                stroke={Colors.primary}
                strokeWidth="1.8"
              />
              {/* Red live dot at end */}
              <SvgCircle cx={lastX.toFixed(1)} cy={lastY.toFixed(1)} r="4" fill={Colors.red} />
              <SvgCircle cx={lastX.toFixed(1)} cy={lastY.toFixed(1)} r="2" fill={Colors.white} />
              {/* X labels */}
              <SvgText x="5" y="98" fontSize="7" fill={Colors.textSecondary}>3h ago</SvgText>
              <SvgText x="80" y="98" fontSize="7" fill={Colors.textSecondary}>2h ago</SvgText>
              <SvgText x="160" y="98" fontSize="7" fill={Colors.textSecondary}>1h ago</SvgText>
              <SvgText x="245" y="98" fontSize="7" fill={Colors.textSecondary}>30min</SvgText>
              <SvgText x="318" y="98" fontSize="7" fill={Colors.textSecondary}>Now</SvgText>
            </Svg>
          </View>

          {/* Legend */}
          <View style={{flexDirection: 'row', flexWrap: 'wrap', marginTop: vs(8), gap: s(12)}}>
            <View style={st.legendItem}>
              <View style={[st.legendDot, {backgroundColor: Colors.primary}]} />
              <AppText variant="small" color={Colors.textSecondary}>Glucose</AppText>
            </View>
            <View style={st.legendItem}>
              <View style={[st.legendDash, {borderColor: Colors.primary}]} />
              <AppText variant="small" color={Colors.textSecondary}>7.0 target</AppText>
            </View>
            <View style={st.legendItem}>
              <View style={[st.legendDash, {borderColor: Colors.red}]} />
              <AppText variant="small" color={Colors.textSecondary}>3.9 hypo</AppText>
            </View>
          </View>
        </View>

        {/* Time in Range (TIR) card */}
        <View style={[st.card, {marginTop: vs(14)}]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
            <AppText variant="bodyBold" color={Colors.textPrimary}>
              Time in range {'\u00b7'} Today
            </AppText>
            <AppText variant="bodyBold" color={Colors.primary}>62% TIR</AppText>
          </View>

          {/* TIR bar */}
          <View style={st.tirBar}>
            {tirSegments.map((seg, i) => (
              <View
                key={i}
                style={{
                  flex: seg.pct,
                  backgroundColor: seg.color,
                  borderTopLeftRadius: i === 0 ? ms(4) : 0,
                  borderBottomLeftRadius: i === 0 ? ms(4) : 0,
                  borderTopRightRadius: i === tirSegments.length - 1 ? ms(4) : 0,
                  borderBottomRightRadius: i === tirSegments.length - 1 ? ms(4) : 0,
                }}
              />
            ))}
          </View>

          {/* TIR legend */}
          <View style={{marginTop: vs(8), gap: vs(4)}}>
            {tirSegments.map((seg, i) => (
              <View key={i} style={{flexDirection: 'row', alignItems: 'center'}}>
                <View style={[st.legendDot, {backgroundColor: seg.color}]} />
                <AppText
                  variant={seg.label === 'In range' ? 'bodyBold' : 'small'}
                  color={seg.label === 'In range' ? Colors.primary : Colors.textSecondary}
                  style={{marginLeft: s(4)}}>
                  {seg.label} {seg.pct}%
                </AppText>
              </View>
            ))}
          </View>

          {/* Footer */}
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(8), lineHeight: ms(16)}}>
            TIR target for T2DM: {'>'}70%. Your 62% is improving (was 54% last month).
          </AppText>
        </View>

        {/* Amber insight */}
        <View style={[st.insightCard, {backgroundColor: Colors.amberBg}]}>
          <View style={st.insightHeader}>
            <Icon family="Ionicons" name="alert-circle-outline" size={ms(18)} color={Colors.amberText} />
            <AppText variant="bodyBold" color={Colors.amberText} style={{marginLeft: s(6), flex: 1}}>
              CGM insight
            </AppText>
          </View>
          <AppText variant="small" color={Colors.amberText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
            TIR 62% — below the 70% target. Most above-range time is occurring overnight, suggesting basal insulin or late-evening carbohydrate intake may need review. Consider discussing overnight glucose patterns with your diabetes team.
          </AppText>
        </View>

        {/* Log CGM reading button */}
        <TouchableOpacity activeOpacity={0.7} style={st.primaryBtn}>
          <Icon family="Ionicons" name="checkmark-outline" size={ms(16)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
            Log current CGM reading {'\u00b7'} 8.2 mmol/L
          </AppText>
        </TouchableOpacity>
      </View>
    );
  };

  /* ── 4. Libre NFC Panel ── */
  const renderLibrePanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        FREESTYLE LIBRE {'\u00b7'} NFC SCAN
      </AppText>

      {/* Dark scan card */}
      <View style={st.darkHero}>
        <View style={{alignItems: 'center', paddingVertical: vs(10)}}>
          <Icon family="Ionicons" name="phone-portrait-outline" size={ms(36)} color="rgba(255,255,255,0.7)" />
          <AppText variant="bodyBold" color={Colors.white} style={{marginTop: vs(8)}}>
            Tap your phone to the sensor
          </AppText>
          <AppText
            variant="small"
            color="rgba(255,255,255,0.6)"
            style={{marginTop: vs(4), textAlign: 'center', paddingHorizontal: s(20)}}>
            Hold the top-back of your phone against the FreeStyle Libre sensor on the back of your upper arm. Keep it still for 1-2 seconds until the scan completes.
          </AppText>
          <TouchableOpacity activeOpacity={0.7} style={[st.primaryBtn, {marginTop: vs(12), alignSelf: 'center'}]}>
            <Icon family="Ionicons" name="scan-outline" size={ms(16)} color={Colors.white} />
            <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
              Enable NFC scan
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Green insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.tealBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(18)} color={Colors.tealText} />
          <AppText variant="bodyBold" color={Colors.tealText} style={{marginLeft: s(6), flex: 1}}>
            What Libre scan captures
          </AppText>
        </View>
        <AppText variant="small" color={Colors.tealText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          Libre scan captures: current glucose, trend arrow, 8-hour history graph, and daily patterns. Each scan retrieves up to 8 hours of stored readings from the sensor, so scanning at least once every 8 hours ensures no data gaps. The sensor continuously measures interstitial glucose every minute and stores a reading every 15 minutes.
        </AppText>
      </View>
    </View>
  );

  /* ── 5. Apple Health Panel ── */
  const renderApplePanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        APPLE HEALTH {'\u00b7'} GLUCOSE IMPORT
      </AppText>

      {/* Info card */}
      <View style={st.card}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <Icon family="Ionicons" name="heart-outline" size={ms(22)} color={Colors.primary} />
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginLeft: s(8), flex: 1}}>
            142 readings available
          </AppText>
          <View style={[st.statusBadge, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="small" color={Colors.tealText}>Connected</AppText>
          </View>
        </View>
        <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(8), lineHeight: ms(16)}}>
          Apple Health contains 142 glucose readings from connected devices and apps. Importing will bring in all historical blood glucose data including readings from your glucometer, CGM, and any other apps that write glucose values to HealthKit.
        </AppText>
        <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(6), lineHeight: ms(16)}}>
          Data range: 22 Feb 2026 - 25 Mar 2026 {'\u00b7'} Sources: Accu-Chek, Health app
        </AppText>
      </View>

      {/* Summary card */}
      <View style={[st.card, {marginTop: vs(10)}]}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>Import summary</AppText>
        <View style={{marginTop: vs(8), gap: vs(6)}}>
          <View style={st.summaryRow}>
            <AppText variant="small" color={Colors.textSecondary}>Total readings</AppText>
            <AppText variant="bodyBold" color={Colors.textPrimary}>142</AppText>
          </View>
          <View style={st.summaryRow}>
            <AppText variant="small" color={Colors.textSecondary}>Already imported</AppText>
            <AppText variant="bodyBold" color={Colors.textPrimary}>98</AppText>
          </View>
          <View style={st.summaryRow}>
            <AppText variant="small" color={Colors.textSecondary}>New readings to import</AppText>
            <AppText variant="bodyBold" color={Colors.primary}>44</AppText>
          </View>
          <View style={st.summaryRow}>
            <AppText variant="small" color={Colors.textSecondary}>Average glucose</AppText>
            <AppText variant="bodyBold" color={Colors.amberText}>8.4 mmol/L</AppText>
          </View>
        </View>
      </View>

      {/* Import button */}
      <TouchableOpacity activeOpacity={0.7} style={st.primaryBtn}>
        <Icon family="Ionicons" name="download-outline" size={ms(16)} color={Colors.white} />
        <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
          Import 44 new readings from Apple Health
        </AppText>
      </TouchableOpacity>

      {/* Blue insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.blueBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(18)} color={Colors.blueText} />
          <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6), flex: 1}}>
            About Apple Health import
          </AppText>
        </View>
        <AppText variant="small" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          Importing from Apple Health pulls glucose readings written by any connected device or app. Duplicate readings are automatically detected and skipped. You can re-import at any time to capture new readings.
        </AppText>
      </View>
    </View>
  );

  /* ── Render ── */
  return (
    <View style={st.container}>
      {renderSourceGrid()}
      {activeSource === 'glucometer' && renderGlucometerPanel()}
      {activeSource === 'cgm' && renderCgmPanel()}
      {activeSource === 'libre' && renderLibrePanel()}
      {activeSource === 'apple' && renderApplePanel()}
    </View>
  );
};

/* ───────── styles ───────── */

const st = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: vs(18),
  },
  sourceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: vs(10),
    gap: vs(10),
  },
  sourceCard: {
    width: '48%',
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(12),
  },
  card: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(14),
    marginTop: vs(10),
  },
  darkHero: {
    backgroundColor: '#0a1628',
    borderRadius: ms(14),
    padding: ms(16),
    marginTop: vs(10),
  },
  heroChip: {
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
  },
  statusBadge: {
    alignSelf: 'flex-start',
    borderRadius: ms(8),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    marginTop: vs(6),
  },
  primaryBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(10),
  },
  outlineBtn: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  insightCard: {
    borderRadius: ms(14),
    padding: ms(14),
    marginTop: vs(10),
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tirBar: {
    flexDirection: 'row',
    height: vs(10),
    borderRadius: ms(4),
    overflow: 'hidden',
    marginTop: vs(10),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  legendDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    marginRight: s(4),
  },
  legendDash: {
    width: ms(12),
    height: 0,
    borderTopWidth: 1.5,
    borderStyle: 'dashed',
    marginRight: s(4),
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
});

export default GlucoseAutoView;
