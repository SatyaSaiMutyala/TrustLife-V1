import React, {useMemo} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, useWindowDimensions} from 'react-native';
import Svg, {Circle as SvgCircle} from 'react-native-svg';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const ZONE_COLORS = {
  Cardio: {bg: Colors.tealBg, color: Colors.tealText},
  Aerobic: {bg: Colors.tealBg, color: Colors.tealText},
  'Fat burn': {bg: '#EAF3DE', color: '#4A7C23'},
  Light: {bg: Colors.blueBg, color: Colors.blueText},
  Easy: {bg: '#EAF3DE', color: '#4A7C23'},
  Threshold: {bg: Colors.amberBg, color: Colors.amberText},
  Rest: {bg: Colors.amberBg, color: Colors.amberText},
};

const ActivityDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const {width: screenWidth} = useWindowDimensions();
  const rec = route.params?.record || {};

  const activities = rec.activities || [];

  // Parse totals from summary string
  const totalSteps = useMemo(() => {
    const m = (rec.total || '').match(/([\d,]+)\s*steps/);
    return m ? m[1] : '0';
  }, [rec.total]);

  const totalKm = useMemo(() => {
    const m = (rec.total || '').match(/([\d.]+)\s*km/);
    return m ? m[1] : '0';
  }, [rec.total]);

  const totalMin = useMemo(() => {
    const m = (rec.total || '').match(/(\d+)\s*active/);
    return m ? m[1] : '0';
  }, [rec.total]);

  const totalKcal = useMemo(() => {
    return activities.reduce((sum, a) => sum + (a.kcal || 0), 0);
  }, [activities]);

  // Ring
  const stepsNum = parseInt(totalSteps.replace(/,/g, ''), 10) || 0;
  const stepGoal = 10000;
  const stepPct = Math.min(stepsNum / stepGoal, 1);
  const ringSize = Math.min(Math.max(screenWidth * 0.25, ms(90)), ms(130));
  const ringThickness = Math.max(ringSize * 0.085, 6);
  const radius = (ringSize - ringThickness) / 2;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - stepPct);
  const ringColor = rec.level === 'high' ? Colors.accent : rec.level === 'medium' ? Colors.amber : Colors.red;

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={[st.header, {paddingTop: insets.top + vs(10)}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={st.headerTitle}>Activity detail</AppText>
            <AppText variant="caption" style={st.headerSub}>{rec.date}</AppText>
          </View>
        </View>
      </View>

      <ScrollView style={{flex: 1}} contentContainerStyle={st.body} showsVerticalScrollIndicator={false}>

        {/* Steps ring + summary */}
        <View style={st.card}>
          <View style={st.ringRow}>
            <View style={{width: ringSize, height: ringSize, alignItems: 'center', justifyContent: 'center'}}>
              <Svg width={ringSize} height={ringSize} style={{position: 'absolute'}}>
                <SvgCircle cx={ringSize / 2} cy={ringSize / 2} r={radius} stroke={Colors.borderLight} strokeWidth={ringThickness} fill="none" />
                <SvgCircle cx={ringSize / 2} cy={ringSize / 2} r={radius} stroke={ringColor} strokeWidth={ringThickness} fill="none"
                  strokeLinecap="round" strokeDasharray={`${circumference} ${circumference}`} strokeDashoffset={offset}
                  transform={`rotate(-90 ${ringSize / 2} ${ringSize / 2})`} />
              </Svg>
              <AppText variant="bodyBold" color={ringColor} style={{fontSize: ringSize * 0.18}}>{totalSteps}</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ringSize * 0.1}}>steps</AppText>
            </View>

            <View style={st.summaryGrid}>
              {[
                {label: 'Distance', value: `${totalKm} km`, icon: 'navigate-outline', color: Colors.blue},
                {label: 'Active min', value: `${totalMin} min`, icon: 'time-outline', color: Colors.accent},
                {label: 'Calories', value: `${totalKcal} kcal`, icon: 'flame-outline', color: Colors.amber},
              ].map((m, i) => (
                <View key={i} style={st.summaryItem}>
                  <View style={[st.summaryIcon, {backgroundColor: m.color + '18'}]}>
                    <Icon family="Ionicons" name={m.icon} size={ms(12)} color={m.color} />
                  </View>
                  <View>
                    <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(12)}}>{m.value}</AppText>
                    <AppText variant="small" color={Colors.textTertiary}>{m.label}</AppText>
                  </View>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* Activity breakdown */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Activities - {activities.length} logged</AppText>
          {activities.map((act, i) => {
            const zc = ZONE_COLORS[act.zone] || ZONE_COLORS.Light;
            return (
              <View key={i} style={[st.actRow, i < activities.length - 1 && st.actRowBorder]}>
                <View style={[st.actIcon, {backgroundColor: act.iconBg}]}>
                  <Icon family="Ionicons" name={act.icon} size={ms(14)} color={act.iconColor} />
                </View>
                <View style={{flex: 1}}>
                  <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
                    <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(12)}}>{act.type}</AppText>
                    <View style={[st.zonePill, {backgroundColor: zc.bg}]}>
                      <AppText variant="small" color={zc.color} style={{fontWeight: '600'}}>{act.zone}</AppText>
                    </View>
                  </View>
                  <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
                    {act.time}{act.duration ? ` - ${act.duration}` : ''}
                  </AppText>
                  <View style={st.actStats}>
                    {act.steps && act.steps !== '—' ? (
                      <View style={st.actChip}>
                        <Icon family="Ionicons" name="footsteps-outline" size={ms(10)} color={Colors.textTertiary} />
                        <AppText variant="small" color={Colors.textSecondary}>{act.steps}</AppText>
                      </View>
                    ) : null}
                    {act.distance && act.distance !== '—' ? (
                      <View style={st.actChip}>
                        <Icon family="Ionicons" name="navigate-outline" size={ms(10)} color={Colors.textTertiary} />
                        <AppText variant="small" color={Colors.textSecondary}>{act.distance}</AppText>
                      </View>
                    ) : null}
                    <View style={st.actChip}>
                      <Icon family="Ionicons" name="flame-outline" size={ms(10)} color={Colors.textTertiary} />
                      <AppText variant="small" color={Colors.textSecondary}>{act.kcal} kcal</AppText>
                    </View>
                  </View>
                  {act.note ? (
                    <View style={st.noteChip}>
                      <Icon family="Ionicons" name="information-circle-outline" size={ms(11)} color={Colors.tealText} />
                      <AppText variant="small" color={Colors.tealText}>{act.note}</AppText>
                    </View>
                  ) : null}
                </View>
              </View>
            );
          })}
        </View>

        {/* HR Zone distribution (static demo) */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Heart rate zones</AppText>
          <View style={st.hrBar}>
            <View style={{flex: 8, backgroundColor: Colors.blue, height: vs(10)}} />
            <View style={{flex: 5, backgroundColor: '#4A7C23', height: vs(10)}} />
            <View style={{flex: 3, backgroundColor: Colors.teal, height: vs(10)}} />
            <View style={{flex: 1, backgroundColor: Colors.amber, height: vs(10)}} />
          </View>
          <View style={st.hrLabels}>
            <View style={st.hrItem}><View style={[st.hrDot, {backgroundColor: Colors.blue}]} /><AppText variant="small" color={Colors.textSecondary}>Rest</AppText></View>
            <View style={st.hrItem}><View style={[st.hrDot, {backgroundColor: '#4A7C23'}]} /><AppText variant="small" color={Colors.textSecondary}>Fat burn</AppText></View>
            <View style={st.hrItem}><View style={[st.hrDot, {backgroundColor: Colors.teal}]} /><AppText variant="small" color={Colors.textSecondary}>Cardio</AppText></View>
            <View style={st.hrItem}><View style={[st.hrDot, {backgroundColor: Colors.amber}]} /><AppText variant="small" color={Colors.textSecondary}>Peak</AppText></View>
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
  cardLabel: {marginBottom: vs(8)},

  /* Ring row */
  ringRow: {flexDirection: 'row', alignItems: 'center'},
  summaryGrid: {flex: 1, marginLeft: s(14), gap: vs(8)},
  summaryItem: {flexDirection: 'row', alignItems: 'center', gap: s(8)},
  summaryIcon: {width: ms(28), height: ms(28), borderRadius: ms(8), alignItems: 'center', justifyContent: 'center'},

  /* Activity rows */
  actRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(10), paddingVertical: vs(10)},
  actRowBorder: {borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'},
  actIcon: {width: ms(30), height: ms(30), borderRadius: ms(8), alignItems: 'center', justifyContent: 'center', marginTop: vs(2)},
  zonePill: {paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(6)},
  actStats: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8), marginTop: vs(4)},
  actChip: {flexDirection: 'row', alignItems: 'center', gap: s(4), backgroundColor: Colors.background, paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(6)},
  noteChip: {flexDirection: 'row', alignItems: 'center', gap: s(4), backgroundColor: Colors.tealBg, paddingHorizontal: s(7), paddingVertical: vs(3), borderRadius: ms(6), marginTop: vs(4), alignSelf: 'flex-start'},

  /* HR zones */
  hrBar: {flexDirection: 'row', height: vs(10), borderRadius: ms(4), overflow: 'hidden', marginBottom: vs(8)},
  hrLabels: {flexDirection: 'row', justifyContent: 'space-around'},
  hrItem: {flexDirection: 'row', alignItems: 'center', gap: s(4)},
  hrDot: {width: ms(8), height: ms(8), borderRadius: ms(4)},
});

export default ActivityDetailScreen;
