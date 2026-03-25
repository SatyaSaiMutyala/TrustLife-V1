import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

/* ───────── static data ───────── */

const DEVICES = [
  {
    id: 'scale',
    icon: 'scale-outline',
    name: 'Smart scale',
    description: 'Mi Scale \u00b7 Withings Body+ \u00b7 Renpho \u00b7 Eufy',
    status: 'Mi Scale 2 linked',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    id: 'apple',
    icon: 'heart-outline',
    name: 'Apple Health',
    description: 'Sync all weight + body composition readings',
    status: '48 readings',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    id: 'google',
    icon: 'logo-google',
    name: 'Google Fit',
    description: 'Import weight history from Android',
    status: 'Connect',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
  {
    id: 'withings',
    icon: 'globe-outline',
    name: 'Withings Health Mate',
    description: 'Body+ \u00b7 Body Cardio \u00b7 Body Scan',
    status: 'Connect',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
];

const BODY_COMP_METRICS = [
  {label: 'Body fat', value: '32.4%', color: '#f59e0b'},
  {label: 'Muscle', value: '46.2 kg', color: '#10b981'},
  {label: 'Body water', value: '51.8%', color: '#60a5fa'},
  {label: 'Bone mass', value: '2.4 kg', color: 'rgba(255,255,255,0.7)'},
  {label: 'Visceral fat', value: '10', color: '#f59e0b'},
  {label: 'BMR', value: '1,426 kcal', color: '#a78bfa'},
  {label: 'Metabolic age', value: '26', color: '#10b981'},
  {label: 'Protein', value: '39.2%', color: '#10b981'},
];

const BODY_ANALYSIS_ROWS = [
  {
    label: 'Body fat',
    description: 'Percentage of total body weight that is fat tissue',
    value: '32.4%',
    reference: 'Normal 21\u201333% \u00b7 Limit: 33%',
    fill: 0.82,
    barColor: '#f59e0b',
  },
  {
    label: 'Skeletal muscle',
    description: 'Total skeletal muscle mass estimated via BIA',
    value: '46.2 kg',
    reference: 'Normal 42\u201350 kg',
    fill: 0.58,
    barColor: '#10b981',
  },
  {
    label: 'Body water',
    description: 'Total body water as percentage of body weight',
    value: '51.8%',
    reference: 'Normal 45\u201360%',
    fill: 0.64,
    barColor: '#60a5fa',
  },
  {
    label: 'Visceral fat',
    description: 'Fat surrounding internal organs, rated by level',
    value: 'Level 10',
    reference: 'Normal 1\u20139 \u00b7 High: 10\u201314',
    fill: 0.50,
    barColor: '#f59e0b',
  },
  {
    label: 'Bone mass',
    description: 'Estimated weight of bone mineral content',
    value: '2.4 kg',
    reference: 'Normal 2.3\u20132.7 kg',
    fill: 0.53,
    barColor: '#9ca3af',
  },
  {
    label: 'BMR',
    description: 'Basal metabolic rate \u2014 daily calories at rest',
    value: '1,426 kcal',
    reference: 'Normal',
    fill: 0.55,
    barColor: '#9ca3af',
  },
];

const RECENT_READINGS = [
  {date: 'Today', weight: '68.4', fat: '32.4%', muscle: '46.2', visc: '10', highlight: true},
  {date: '20 Mar', weight: '68.6', fat: '32.7%', muscle: '46.0', visc: '10', highlight: false},
  {date: '15 Mar', weight: '68.4', fat: '32.5%', muscle: '46.1', visc: '10', highlight: false},
  {date: '10 Mar', weight: '68.8', fat: '33.0%', muscle: '45.8', visc: '11', highlight: false},
  {date: '3 Mar', weight: '69.1', fat: '33.3%', muscle: '45.6', visc: '11', highlight: false},
];

const CONNECT_SCALES = [
  {
    name: 'Withings Body+',
    description: 'Wi-Fi body composition scale \u00b7 Weight, fat, water, muscle, bone',
  },
  {
    name: 'Renpho Smart Scale',
    description: 'Bluetooth BIA scale \u00b7 13 body composition metrics',
  },
  {
    name: 'Eufy Smart Scale P2 Pro',
    description: 'Wi-Fi + Bluetooth \u00b7 16 measurements including heart rate',
  },
  {
    name: 'Other Bluetooth scale',
    description: 'Generic BLE scale \u00b7 Weight only or BIA if supported',
  },
];

/* ───────── Main Component ───────── */

const WeightAutoView = () => {
  const [activeDevice, setActiveDevice] = useState('scale');

  return (
    <View>
      {/* ── 1. Device Grid ── */}
      <AppText variant="sectionTitle" style={styles.sectionHeading}>
        SELECT SCALE / SOURCE
      </AppText>
      <View style={styles.deviceGrid}>
        {DEVICES.map(device => (
          <TouchableOpacity
            key={device.id}
            activeOpacity={0.7}
            onPress={() => setActiveDevice(device.id)}
            style={[
              styles.deviceCard,
              activeDevice === device.id && styles.deviceCardActive,
            ]}>
            <Icon
              family="Ionicons"
              name={device.icon}
              size={ms(24)}
              color={activeDevice === device.id ? Colors.primary : Colors.textSecondary}
            />
            <AppText
              variant="bodyBold"
              color={activeDevice === device.id ? Colors.primary : Colors.textPrimary}
              style={{marginTop: vs(6)}}>
              {device.name}
            </AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
              {device.description}
            </AppText>
            <View style={[styles.deviceStatus, {backgroundColor: device.statusBg}]}>
              <AppText variant="small" color={device.statusColor} style={{fontWeight: '600'}}>
                {device.status}
              </AppText>
            </View>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── 2. Smart Scale Panel ── */}
      {activeDevice === 'scale' && (
        <View>
          <AppText variant="sectionTitle" style={styles.sectionHeading}>
            MI SCALE 2 {'\u00b7'} LIVE READING
          </AppText>

          {/* Dark hero card */}
          <View style={styles.darkCard}>
            {/* Device row */}
            <View style={styles.liveRow}>
              <View style={styles.liveDot} />
              <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginLeft: s(6)}}>
                Xiaomi Mi Body Composition Scale 2 {'\u00b7'} BT5.0
              </AppText>
            </View>

            {/* 3-column metrics */}
            <View style={styles.heroMetrics}>
              <View style={{alignItems: 'center', flex: 1}}>
                <AppText variant="small" color="rgba(255,255,255,0.5)">Weight</AppText>
                <AppText style={{fontSize: ms(26), fontWeight: '700', color: '#a78bfa', lineHeight: ms(32)}}>
                  68.4
                </AppText>
                <AppText variant="small" color="rgba(255,255,255,0.5)">kg</AppText>
              </View>
              <View style={{alignItems: 'center', flex: 1}}>
                <AppText variant="small" color="rgba(255,255,255,0.5)">BMI</AppText>
                <AppText style={{fontSize: ms(26), fontWeight: '700', color: '#f59e0b', lineHeight: ms(32)}}>
                  24.7
                </AppText>
                <AppText variant="small" color="rgba(255,255,255,0.5)">{' '}</AppText>
              </View>
              <View style={{alignItems: 'center', flex: 1}}>
                <AppText variant="small" color="rgba(255,255,255,0.5)">Height</AppText>
                <AppText style={{fontSize: ms(26), fontWeight: '700', color: '#10b981', lineHeight: ms(32)}}>
                  163
                </AppText>
                <AppText variant="small" color="rgba(255,255,255,0.5)">cm</AppText>
              </View>
            </View>

            {/* Body composition label */}
            <AppText
              variant="caption"
              color="rgba(255,255,255,0.5)"
              style={{textAlign: 'center', marginTop: vs(10), marginBottom: vs(10)}}>
              Body composition {'\u00b7'} BIA measurement
            </AppText>

            {/* 4x2 grid of body comp values */}
            <View style={styles.compGrid}>
              {BODY_COMP_METRICS.map((m, i) => (
                <View key={i} style={styles.compItem}>
                  <AppText variant="small" color="rgba(255,255,255,0.5)">{m.label}</AppText>
                  <AppText style={{fontSize: ms(16), fontWeight: '700', color: m.color, marginTop: vs(2)}}>
                    {m.value}
                  </AppText>
                </View>
              ))}
            </View>
          </View>

          {/* Body Composition Analysis card */}
          <View style={styles.card}>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginBottom: vs(12)}}>
              Body Composition Analysis
            </AppText>
            {BODY_ANALYSIS_ROWS.map((row, i) => (
              <View
                key={i}
                style={[
                  styles.analysisRow,
                  i < BODY_ANALYSIS_ROWS.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb'},
                ]}>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                  <AppText variant="bodyBold" color={Colors.textPrimary}>{row.label}</AppText>
                  <AppText variant="bodyBold" color={Colors.textPrimary}>{row.value}</AppText>
                </View>
                <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                  {row.description}
                </AppText>
                {/* Progress bar */}
                <View style={styles.progressTrack}>
                  <View style={[styles.progressFill, {width: `${row.fill * 100}%`, backgroundColor: row.barColor}]} />
                </View>
                <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
                  {row.reference}
                </AppText>
              </View>
            ))}
          </View>

          {/* Amber insight */}
          <View style={styles.insightAmber}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon family="Ionicons" name="warning-outline" size={ms(16)} color={Colors.amberText} />
              <AppText variant="bodyBold" color={Colors.amberText} style={{marginLeft: s(6)}}>
                Visceral fat finding
              </AppText>
            </View>
            <AppText variant="caption" color={Colors.amberText} style={{marginTop: vs(4), lineHeight: ms(17)}}>
              Visceral fat level 10 is the most important finding in this reading. It sits at the threshold between normal (1{'\u2013'}9) and high (10{'\u2013'}14). Visceral fat surrounds internal organs and is strongly correlated with metabolic syndrome, insulin resistance, and cardiovascular risk. Even a 1{'\u2013'}2 level reduction through diet and exercise significantly lowers risk.
            </AppText>
          </View>

          {/* Purple insight */}
          <View style={styles.insightPurple}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={Colors.purpleText} />
              <AppText variant="bodyBold" color={Colors.purpleText} style={{marginLeft: s(6)}}>
                Note on BIA accuracy
              </AppText>
            </View>
            <AppText variant="caption" color={Colors.purpleText} style={{marginTop: vs(4), lineHeight: ms(17)}}>
              Bioelectrical impedance analysis (BIA) used by consumer smart scales has a margin of error of 3{'\u2013'}5% for body fat percentage. Readings are affected by hydration, recent meals, exercise, and time of day. For best consistency, weigh at the same time each morning before eating or drinking.
            </AppText>
          </View>

          {/* Import button */}
          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
            <AppText variant="bodyBold" color={Colors.white}>
              Import this reading {'\u00b7'} 68.4 kg {'\u00b7'} BMI 24.7 {'\u00b7'} Full body comp
            </AppText>
          </TouchableOpacity>

          {/* Re-weigh button */}
          <TouchableOpacity style={styles.secondaryButton} activeOpacity={0.7}>
            <AppText variant="body" color={Colors.textPrimary}>
              Re-weigh on scale
            </AppText>
          </TouchableOpacity>

          {/* Recent scale readings table */}
          <View style={styles.card}>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginBottom: vs(8)}}>
              Recent scale readings
            </AppText>
            <View style={styles.tableHeaderRow}>
              <AppText variant="small" color={Colors.textTertiary} style={{flex: 1.2}}>Date</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{flex: 1, textAlign: 'center'}}>Weight</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{flex: 1, textAlign: 'center'}}>Fat%</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{flex: 1, textAlign: 'center'}}>Muscle</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{flex: 0.7, textAlign: 'center'}}>Visc.</AppText>
            </View>
            {RECENT_READINGS.map((row, i) => (
              <View
                key={i}
                style={[
                  styles.tableRow,
                  i < RECENT_READINGS.length - 1 && styles.tableRowBorder,
                  row.highlight && {backgroundColor: Colors.tealBg, borderRadius: ms(6), marginHorizontal: s(-4), paddingHorizontal: s(4)},
                ]}>
                <AppText
                  variant="small"
                  color={row.highlight ? Colors.tealText : Colors.textPrimary}
                  style={{flex: 1.2, fontWeight: row.highlight ? '700' : '400'}}>
                  {row.date}
                </AppText>
                <AppText
                  variant="small"
                  color={row.highlight ? Colors.tealText : Colors.textPrimary}
                  style={{flex: 1, textAlign: 'center', fontWeight: '600'}}>
                  {row.weight}
                </AppText>
                <AppText variant="small" color={Colors.textSecondary} style={{flex: 1, textAlign: 'center'}}>
                  {row.fat}
                </AppText>
                <AppText variant="small" color={Colors.textSecondary} style={{flex: 1, textAlign: 'center'}}>
                  {row.muscle}
                </AppText>
                <AppText variant="small" color={Colors.textSecondary} style={{flex: 0.7, textAlign: 'center'}}>
                  {row.visc}
                </AppText>
              </View>
            ))}
          </View>
        </View>
      )}

      {/* ── 3. Apple Health Panel ── */}
      {activeDevice === 'apple' && (
        <View>
          <AppText variant="sectionTitle" style={styles.sectionHeading}>
            APPLE HEALTH {'\u00b7'} WEIGHT DATA
          </AppText>

          <View style={styles.card}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(10)}}>
              <Icon family="Ionicons" name="heart-outline" size={ms(20)} color={Colors.primary} />
              <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginLeft: s(8)}}>
                48 weight readings synced
              </AppText>
            </View>
            <AppText variant="caption" color={Colors.textSecondary} style={{lineHeight: ms(17)}}>
              Apple Health is importing weight and body composition data from all connected sources. Readings are deduplicated and merged automatically.
            </AppText>
          </View>

          <TouchableOpacity style={styles.primaryButton} activeOpacity={0.7}>
            <AppText variant="bodyBold" color={Colors.white}>
              Sync latest readings from Apple Health
            </AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* ── 4. Other Devices Panel (Google / Withings) ── */}
      {(activeDevice === 'google' || activeDevice === 'withings') && (
        <View>
          <AppText variant="sectionTitle" style={styles.sectionHeading}>
            CONNECT A NEW SCALE
          </AppText>

          {/* Blue insight */}
          <View style={styles.insightBlue}>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={Colors.blueText} />
              <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6)}}>
                Supported smart scales
              </AppText>
            </View>
            <AppText variant="caption" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(17)}}>
              TrustLife supports Bluetooth and Wi-Fi smart scales that provide weight and body composition data via BIA. Connect your scale below to automatically import readings including weight, body fat, muscle mass, and more.
            </AppText>
          </View>

          {/* Connect scales card */}
          <View style={styles.card}>
            {CONNECT_SCALES.map((item, i) => (
              <View
                key={i}
                style={[
                  styles.connectRow,
                  i < CONNECT_SCALES.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: '#e5e7eb'},
                ]}>
                <View style={styles.connectIcon}>
                  <Icon family="Ionicons" name="scale-outline" size={ms(18)} color={Colors.textSecondary} />
                </View>
                <View style={{flex: 1, marginLeft: s(10)}}>
                  <AppText variant="bodyBold" color={Colors.textPrimary}>{item.name}</AppText>
                  <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                    {item.description}
                  </AppText>
                </View>
                <TouchableOpacity style={styles.connectAction} activeOpacity={0.7}>
                  <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>
                    Connect
                  </AppText>
                </TouchableOpacity>
              </View>
            ))}
          </View>
        </View>
      )}
    </View>
  );
};

/* ───────── Styles ───────── */

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

  // Device grid
  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginBottom: vs(10),
  },
  deviceCard: {
    width: '48%',
    flexGrow: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(12),
  },
  deviceCardActive: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    backgroundColor: Colors.tealBg,
  },
  deviceStatus: {
    alignSelf: 'flex-start',
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
    marginTop: vs(6),
  },

  // Dark card
  darkCard: {
    backgroundColor: '#0d1220',
    borderRadius: ms(14),
    padding: ms(16),
    marginBottom: vs(10),
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: '#10b981',
  },
  heroMetrics: {
    flexDirection: 'row',
    marginTop: vs(14),
  },

  // Body comp 4x2 grid
  compGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(0),
  },
  compItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: vs(8),
  },

  // Body analysis
  analysisRow: {
    paddingVertical: vs(10),
  },
  progressTrack: {
    height: ms(6),
    backgroundColor: '#e5e7eb',
    borderRadius: ms(3),
    marginTop: vs(6),
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    borderRadius: ms(3),
  },

  // Table
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
  tableRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#e5e7eb',
  },

  // Insights
  insightAmber: {
    backgroundColor: Colors.amberBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginBottom: vs(10),
  },
  insightPurple: {
    backgroundColor: Colors.purpleBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginBottom: vs(10),
  },
  insightBlue: {
    backgroundColor: Colors.blueBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    padding: ms(14),
    marginBottom: vs(10),
  },

  // Buttons
  primaryButton: {
    backgroundColor: Colors.primary,
    paddingVertical: vs(12),
    borderRadius: ms(12),
    alignItems: 'center',
    marginBottom: vs(10),
  },
  secondaryButton: {
    backgroundColor: Colors.white,
    paddingVertical: vs(12),
    borderRadius: ms(12),
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    marginBottom: vs(10),
  },

  // Connect scales
  connectRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
  },
  connectIcon: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    backgroundColor: '#f3f4f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  connectAction: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
  },
});

export default WeightAutoView;
