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

        {/* Week ring + baby info */}
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
              <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(14)}}>Ananya - {rec.trimester} Trimester</AppText>
              <AppText variant="small" color="rgba(255,255,255,0.55)" style={{marginTop: vs(2)}}>Day {rec.day} - {rec.babySize}</AppText>
              <View style={st.babyStats}>
                <View style={st.babyStat}>
                  <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(12)}}>{rec.babyLength}</AppText>
                  <AppText variant="small" color="rgba(255,255,255,0.4)">Length</AppText>
                </View>
                <View style={st.babyStat}>
                  <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(12)}}>{rec.babyWeight}</AppText>
                  <AppText variant="small" color="rgba(255,255,255,0.4)">Weight</AppText>
                </View>
                <View style={st.babyStat}>
                  <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(12)}}>{rec.weight}</AppText>
                  <AppText variant="small" color="rgba(255,255,255,0.4)">Mum</AppText>
                </View>
              </View>
            </View>
          </View>
        </View>

        {/* Vitals snapshot */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Daily vitals</AppText>
          <View style={st.vitalsGrid}>
            {[
              {l: 'Mood', v: rec.mood, icon: 'happy-outline', color: '#BE185D'},
              {l: 'BP', v: rec.bp, icon: 'pulse-outline', color: Colors.blue},
              {l: 'Supplements', v: rec.supplements, icon: 'medkit-outline', color: rec.supplements === 'Taken' ? Colors.accent : Colors.red},
              {l: 'Nausea', v: rec.nausea, icon: 'sad-outline', color: rec.nausea === 'None' ? Colors.accent : Colors.amber},
              {l: 'Kicks', v: `${rec.kicks}`, icon: 'footsteps-outline', color: Colors.primary},
              {l: 'Weight', v: rec.weight, icon: 'scale-outline', color: '#7C3AED'},
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

  /* Ring row */
  ringRow: {flexDirection: 'row', alignItems: 'center'},
  babyStats: {flexDirection: 'row', gap: s(12), marginTop: vs(8)},
  babyStat: {alignItems: 'center'},

  /* Vitals */
  vitalsGrid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', rowGap: vs(12)},
  vitalCell: {width: '31%', alignItems: 'center'},
  vitalIcon: {width: ms(30), height: ms(30), borderRadius: ms(8), alignItems: 'center', justifyContent: 'center'},

  /* Timeline */
  timeRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8)},
  timeRowBorder: {borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'},
  timeDot: {width: ms(8), height: ms(8), borderRadius: ms(4)},
});

export default PregnancyDetailScreen;
