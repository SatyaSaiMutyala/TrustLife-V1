import React from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import Svg, {Circle as SvgCircle} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const RING_SIZE = ms(90);

const epdsTone = (score) => {
  if (score <= 8) return {label: 'Low risk', color: Colors.tealText, bg: Colors.tealBg};
  if (score <= 12) return {label: 'Borderline', color: Colors.amberDark, bg: Colors.amberBg};
  return {label: 'Clinical range', color: Colors.redText, bg: Colors.redBg};
};

const PregnancyDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const rec = route.params?.record || {};

  const weekPct = Math.min((rec.week || 0) / 40, 1);
  const ringThickness = ms(7);
  const radius = (RING_SIZE - ringThickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - weekPct);
  const epds = epdsTone(rec.epdsScore || 0);
  const hasSymptoms = (rec.symptoms || []).length > 0;

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={[st.header, {paddingTop: insets.top + vs(10)}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={st.headerTitle}>Pregnancy detail</AppText>
            <AppText variant="caption" style={st.headerSub}>{rec.date}</AppText>
          </View>
        </View>
      </View>

      <ScrollView style={{flex: 1}} contentContainerStyle={st.body} showsVerticalScrollIndicator={false}>

        {/* Week ring card */}
        <View style={[st.card, {backgroundColor: Colors.primary}]}>
          <View style={st.ringRow}>
            <View style={{width: RING_SIZE, height: RING_SIZE, alignItems: 'center', justifyContent: 'center'}}>
              <Svg width={RING_SIZE} height={RING_SIZE} style={{position: 'absolute'}}>
                <SvgCircle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={radius} stroke="rgba(255,255,255,0.12)" strokeWidth={ringThickness} fill="none" />
                <SvgCircle cx={RING_SIZE / 2} cy={RING_SIZE / 2} r={radius} stroke="rgba(255,255,255,0.6)" strokeWidth={ringThickness} fill="none"
                  strokeLinecap="round" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={offset}
                  transform={`rotate(-90 ${RING_SIZE / 2} ${RING_SIZE / 2})`} />
              </Svg>
              <AppText style={{fontSize: ms(20), fontWeight: '700', color: Colors.white}}>{rec.week}</AppText>
              <AppText variant="small" color="rgba(255,255,255,0.5)">weeks</AppText>
            </View>

            <View style={{flex: 1, marginLeft: s(14)}}>
              <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(14)}}>{rec.trimester} Trimester · Day {rec.day}</AppText>
              <AppText variant="small" color="rgba(255,255,255,0.55)" style={{marginTop: vs(2)}}>Mood {rec.mood}/10 · Energy {rec.energy}/10</AppText>
              <View style={st.mumStats}>
                <View style={st.mumStat}>
                  <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(12)}}>{rec.weight}</AppText>
                  <AppText variant="small" color="rgba(255,255,255,0.4)">Weight</AppText>
                </View>
                <View style={st.mumStat}>
                  <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(12)}}>{rec.bp}</AppText>
                  <AppText variant="small" color="rgba(255,255,255,0.4)">BP</AppText>
                </View>
                <View style={st.mumStat}>
                  <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(12)}}>{rec.sleepH}h</AppText>
                  <AppText variant="small" color="rgba(255,255,255,0.4)">Sleep</AppText>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Vitals grid */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Daily vitals</AppText>
          <View style={st.vitalsGrid}>
            {[
              {l: 'Mood', v: `${rec.mood}/10`, icon: 'happy-outline', color: '#BE185D'},
              {l: 'Energy', v: `${rec.energy}/10`, icon: 'flash-outline', color: '#D97316'},
              {l: 'BP', v: rec.bp, icon: 'pulse-outline', color: Colors.blue},
              {l: 'Weight', v: rec.weight, icon: 'scale-outline', color: '#7C3AED'},
              {l: 'Water', v: `${rec.waterGlasses}`, icon: 'water-outline', color: '#2A5FA0'},
              {l: 'Kicks', v: `${rec.kicks}`, icon: 'footsteps-outline', color: Colors.primary},
            ].map((vt, i) => (
              <View key={i} style={st.vitalCell}>
                <View style={[st.vitalIcon, {backgroundColor: vt.color + '18'}]}>
                  <Icon family="Ionicons" name={vt.icon} size={ms(14)} color={vt.color} />
                </View>
                <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(11), marginTop: vs(3)}}>{vt.v}</AppText>
                <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(8)}}>{vt.l}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Supplements */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Supplements</AppText>
          <View style={st.rowBetween}>
            <AppText variant="caption" color={Colors.textPrimary}>Taken today</AppText>
            <AppText variant="bodyBold" color={rec.supplementsTaken === rec.supplementsTotal ? Colors.accent : Colors.amber}>
              {rec.supplementsTaken}/{rec.supplementsTotal}
            </AppText>
          </View>
        </View>

        {/* Sleep */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Sleep log</AppText>
          <View style={st.vitalsGrid}>
            {[
              {l: 'Hours', v: `${rec.sleepH}h`, icon: 'bed-outline', color: '#7C3AED'},
              {l: 'Wakeups', v: `${rec.wakeups}`, icon: 'alarm-outline', color: Colors.amber},
              {l: 'Quality', v: rec.sleepQuality, icon: 'sparkles-outline', color: Colors.accent},
              {l: 'Position', v: rec.sleepPosition, icon: 'body-outline', color: Colors.blue},
            ].map((vt, i) => (
              <View key={i} style={[st.vitalCell, {width: '47%'}]}>
                <View style={[st.vitalIcon, {backgroundColor: vt.color + '18'}]}>
                  <Icon family="Ionicons" name={vt.icon} size={ms(14)} color={vt.color} />
                </View>
                <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(11), marginTop: vs(3)}}>{vt.v}</AppText>
                <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(8)}}>{vt.l}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Symptoms */}
        {hasSymptoms && (
          <View style={st.card}>
            <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Symptoms logged</AppText>
            <View style={st.chipWrap}>
              {rec.symptoms.map((sym, i) => (
                <View key={i} style={st.symChip}>
                  <Icon family="Ionicons" name="alert-circle-outline" size={ms(11)} color={Colors.amberDark} />
                  <AppText variant="small" color={Colors.amberDark} style={{fontWeight: '600', marginLeft: s(4)}}>{sym}</AppText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* EPDS */}
        {rec.epdsAnswered === 10 && (
          <View style={st.card}>
            <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>EPDS mental health screen</AppText>
            <View style={[st.epdsBox, {backgroundColor: epds.bg}]}>
              <View>
                <AppText variant="bodyBold" color={epds.color} style={{fontSize: ms(22)}}>{rec.epdsScore}/30</AppText>
                <AppText variant="small" color={epds.color} style={{fontWeight: '700'}}>{epds.label}</AppText>
              </View>
              <AppText variant="small" color={epds.color} style={{flex: 1, textAlign: 'right'}}>{rec.epdsAnswered}/10 answered</AppText>
            </View>
          </View>
        )}

        {/* Antenatal visit */}
        {rec.visit && (
          <View style={st.card}>
            <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Antenatal visit</AppText>
            <View style={st.visitRow}>
              <AppText variant="small" color={Colors.textSecondary}>Type</AppText>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{rec.visit.type}</AppText>
            </View>
            <View style={st.visitRow}>
              <AppText variant="small" color={Colors.textSecondary}>Provider</AppText>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{rec.visit.provider}</AppText>
            </View>
            <View style={st.visitRow}>
              <AppText variant="small" color={Colors.textSecondary}>Fundal height</AppText>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{rec.visit.fundalHeight} cm</AppText>
            </View>
            <View style={st.visitRow}>
              <AppText variant="small" color={Colors.textSecondary}>Foetal HR</AppText>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{rec.visit.fhr} bpm</AppText>
            </View>
            {(rec.visit.tests || []).length > 0 && (
              <View style={[st.visitRow, {alignItems: 'flex-start'}]}>
                <AppText variant="small" color={Colors.textSecondary}>Tests</AppText>
                <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', flex: 1, textAlign: 'right'}}>{rec.visit.tests.join(' · ')}</AppText>
              </View>
            )}
          </View>
        )}

        {/* Timeline */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Timeline</AppText>
          {(rec.events || []).map((item, i) => (
            <View key={i} style={[st.timeRow, i < (rec.events || []).length - 1 && st.timeRowBorder]}>
              <AppText variant="small" color={Colors.textTertiary} style={{width: ms(42), fontSize: ms(10)}}>{item.time}</AppText>
              <View style={[st.timeDot, {backgroundColor: item.color}]} />
              <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, marginLeft: s(8)}}>{item.text}</AppText>
            </View>
          ))}
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
  cardLabel: {marginBottom: vs(8)},

  ringRow: {flexDirection: 'row', alignItems: 'center'},
  mumStats: {flexDirection: 'row', gap: s(12), marginTop: vs(8)},
  mumStat: {alignItems: 'center'},

  vitalsGrid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: vs(12)},
  vitalCell: {width: '31%', alignItems: 'center'},
  vitalIcon: {width: ms(30), height: ms(30), borderRadius: ms(8), alignItems: 'center', justifyContent: 'center'},

  rowBetween: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},

  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6)},
  symChip: {flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.amberBg, paddingHorizontal: s(8), paddingVertical: vs(4), borderRadius: ms(8)},

  epdsBox: {flexDirection: 'row', alignItems: 'center', padding: ms(12), borderRadius: ms(10)},

  visitRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: vs(6), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F0EAE0'},

  timeRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8)},
  timeRowBorder: {borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'},
  timeDot: {width: ms(8), height: ms(8), borderRadius: ms(4)},
});

export default PregnancyDetailScreen;
