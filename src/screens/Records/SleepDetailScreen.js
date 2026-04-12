import React, {useMemo} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import Svg, {Circle as SvgCircle} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const RING_SIZE = ms(100);

const STAGE_COLORS = {
  deep: '#3C3489',
  rem: '#9F94ED',
  light: '#7F77DD',
  awake: Colors.amber || '#F59E0B',
};

const IDEAL_RANGES = {
  deep: '1.5-2h (20-25%)',
  rem: '1.5-2h (20-25%)',
  light: '2.5-3.5h (45-55%)',
  awake: '<30 min (<5%)',
};

const fmtMin = m => {
  const h = Math.floor(m / 60);
  const min = m % 60;
  return h > 0 ? `${h}h ${min}m` : `${min}m`;
};

const SleepDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const rec = route.params?.record || {};

  const scoreColor = rec.score >= 80 ? Colors.teal : rec.score >= 60 ? Colors.amber : Colors.red;
  const scorePct = Math.min((rec.score || 0) / 100, 1);

  const totalStages = (rec.deepMins || 0) + (rec.remMins || 0) + (rec.lightMins || 0) + (rec.awakeMins || 0);
  const stagePcts = useMemo(() => {
    if (!totalStages) return {deep: 0, rem: 0, light: 0, awake: 0};
    return {
      deep: Math.round(((rec.deepMins || 0) / totalStages) * 100),
      rem: Math.round(((rec.remMins || 0) / totalStages) * 100),
      light: Math.round(((rec.lightMins || 0) / totalStages) * 100),
      awake: Math.round(((rec.awakeMins || 0) / totalStages) * 100),
    };
  }, [totalStages, rec]);

  const ringThickness = ms(8);
  const radius = (RING_SIZE - ringThickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - scorePct);

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={[st.header, {paddingTop: insets.top + vs(10)}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={st.headerTitle}>Sleep detail</AppText>
            <AppText variant="caption" style={st.headerSub}>{rec.date}</AppText>
          </View>
        </View>
      </View>

      <ScrollView style={{flex: 1}} contentContainerStyle={st.body} showsVerticalScrollIndicator={false}>

        {/* Score ring + key metrics */}
        <View style={st.card}>
          <View style={st.scoreSection}>
            <View style={st.scoreRingOuter}>
              <Svg width={RING_SIZE} height={RING_SIZE} style={{position: 'absolute', top: 0, left: 0}}>
                <SvgCircle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={radius} stroke={Colors.borderLight} strokeWidth={ringThickness} fill="none" />
                <SvgCircle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={radius} stroke={scoreColor} strokeWidth={ringThickness} fill="none" strokeLinecap="round"
                  strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={offset} transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`} />
              </Svg>
              <AppText style={[st.scoreNumber, {color: scoreColor}]}>{rec.score}</AppText>
              <AppText variant="caption" style={st.scoreLabel}>Score</AppText>
            </View>

            <View style={st.keyMetrics}>
              {[
                {label: 'Total sleep', value: rec.hours},
                {label: 'Sleep latency', value: `${rec.sleepLatency || 0} min`},
                {label: 'Awakenings', value: `${rec.awakenings || 0}`},
                {label: 'Sleep window', value: `${rec.bed} - ${rec.wake}`},
              ].map((m, i) => (
                <View key={i} style={st.keyMetricRow}>
                  <AppText variant="caption" color={Colors.textSecondary}>{m.label}</AppText>
                  <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(12)}}>{m.value}</AppText>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Hypnogram */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Hypnogram</AppText>
          <AppText variant="caption" color={Colors.textTertiary} style={{marginBottom: vs(8)}}>Sleep stage progression through the night</AppText>
          <View style={st.hypnogramBar}>
            {(rec.hypnogram || []).map((stage, i) => {
              const colorKey = ['awake', 'rem', 'light', 'deep'][stage];
              return <View key={i} style={[st.hypnogramSeg, {backgroundColor: STAGE_COLORS[colorKey]}]} />;
            })}
          </View>
          <View style={st.hypnogramLegend}>
            {['deep', 'rem', 'light', 'awake'].map(key => (
              <View key={key} style={st.legendItem}>
                <View style={[st.legendDot, {backgroundColor: STAGE_COLORS[key]}]} />
                <AppText variant="small" color={Colors.textSecondary}>{key.charAt(0).toUpperCase() + key.slice(1)}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Stage breakdown */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Stage breakdown</AppText>
          {['deep', 'rem', 'light', 'awake'].map(key => {
            const mins = rec[`${key}Mins`] || 0;
            const pct = stagePcts[key];
            return (
              <View key={key} style={st.stageRow}>
                <View style={st.stageHeader}>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
                    <View style={[st.stageDot, {backgroundColor: STAGE_COLORS[key]}]} />
                    <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(12)}}>
                      {key.charAt(0).toUpperCase() + key.slice(1)}
                    </AppText>
                  </View>
                  <AppText variant="caption" color={Colors.textSecondary}>{fmtMin(mins)} ({pct}%)</AppText>
                </View>
                <View style={st.progressTrack}>
                  <View style={[st.progressFill, {width: `${pct}%`, backgroundColor: STAGE_COLORS[key]}]} />
                </View>
                <AppText variant="small" color={Colors.textTertiary}>Ideal: {IDEAL_RANGES[key]}</AppText>
              </View>
            );
          })}
        </View>

        {/* Biometric signals */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Biometric signals</AppText>
          <View style={st.bioGrid}>
            {[
              {label: 'HR avg', value: `${rec.hrAvg || '--'} bpm`, icon: 'heart-outline', color: Colors.red},
              {label: 'HR min', value: `${rec.hrMin || '--'} bpm`, icon: 'heart-half-outline', color: Colors.red},
              {label: 'HRV', value: `${rec.hrv || '--'} ms`, icon: 'pulse-outline', color: Colors.blue},
              {label: 'SpO2 avg', value: `${rec.spo2 || '--'}%`, icon: 'water-outline', color: Colors.accent},
              {label: 'Breathing', value: `${rec.breathRate || '--'}/min`, icon: 'cloud-outline', color: Colors.teal},
              {label: 'Temp dev', value: `${rec.tempDev || '--'}C`, icon: 'thermometer-outline', color: Colors.amber},
            ].map((m, i) => (
              <View key={i} style={st.bioCell}>
                <View style={[st.bioIconWrap, {backgroundColor: m.color + '18'}]}>
                  <Icon family="Ionicons" name={m.icon} size={ms(14)} color={m.color} />
                </View>
                <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(13), marginTop: vs(4)}}>{m.value}</AppText>
                <AppText variant="small" color={Colors.textTertiary}>{m.label}</AppText>
              </View>
            ))}
          </View>

          {/* Restlessness */}
          <View style={st.restRow}>
            <AppText variant="caption" color={Colors.textSecondary}>Restlessness index</AppText>
            <View style={st.restTrack}>
              <View style={[st.restFill, {width: `${Math.min(rec.restlessness || 0, 100)}%`}]} />
            </View>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(12), width: s(30), textAlign: 'right'}}>{rec.restlessness || 0}</AppText>
          </View>
        </View>

        <View style={{height: vs(40)}} />
      </ScrollView>
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingBottom: vs(10), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(2)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(11)},
  body: {padding: s(14)},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(14), marginBottom: vs(12)},
  cardLabel: {marginBottom: vs(6)},

  /* Score */
  scoreSection: {flexDirection: 'row', alignItems: 'center'},
  scoreRingOuter: {width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center', marginRight: s(14)},
  scoreNumber: {fontSize: ms(26), fontWeight: '800'},
  scoreLabel: {fontSize: ms(10), color: Colors.textTertiary, marginTop: vs(-2)},
  keyMetrics: {flex: 1},
  keyMetricRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: vs(4), borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'},

  /* Hypnogram */
  hypnogramBar: {flexDirection: 'row', height: vs(14), borderRadius: ms(4), overflow: 'hidden', marginBottom: vs(8)},
  hypnogramSeg: {flex: 1},
  hypnogramLegend: {flexDirection: 'row', justifyContent: 'space-around'},
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: s(4)},
  legendDot: {width: ms(8), height: ms(8), borderRadius: ms(4)},

  /* Stage breakdown */
  stageRow: {marginBottom: vs(12)},
  stageHeader: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(4)},
  stageDot: {width: ms(10), height: ms(10), borderRadius: ms(5)},
  progressTrack: {height: vs(6), backgroundColor: Colors.borderLight, borderRadius: ms(3), overflow: 'hidden', marginBottom: vs(3)},
  progressFill: {height: '100%', borderRadius: ms(3)},

  /* Biometrics */
  bioGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8)},
  bioCell: {width: '31%', backgroundColor: Colors.background, borderRadius: ms(10), padding: ms(10), alignItems: 'center'},
  bioIconWrap: {width: ms(28), height: ms(28), borderRadius: ms(8), alignItems: 'center', justifyContent: 'center'},

  /* Restlessness */
  restRow: {flexDirection: 'row', alignItems: 'center', gap: s(8), marginTop: vs(12), paddingTop: vs(10), borderTopWidth: 0.5, borderTopColor: '#f0f4f2'},
  restTrack: {flex: 1, height: vs(6), backgroundColor: Colors.borderLight, borderRadius: ms(3), overflow: 'hidden'},
  restFill: {height: '100%', borderRadius: ms(3), backgroundColor: Colors.amber},
});

export default SleepDetailScreen;
