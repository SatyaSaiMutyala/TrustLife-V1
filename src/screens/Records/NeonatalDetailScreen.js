import React from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const NeonatalDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const rec = route.params?.record || {};

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
            <AppText variant="screenName" style={st.headerTitle}>Neonatal detail</AppText>
            <AppText variant="caption" style={st.headerSub}>{rec.date} - {rec.day}</AppText>
          </View>
        </View>
      </View>

      <ScrollView style={{flex: 1}} contentContainerStyle={st.body} showsVerticalScrollIndicator={false}>

        {/* Baby info card */}
        <View style={[st.card, {backgroundColor: Colors.primary}]}>
          <View style={st.babyRow}>
            <View style={st.babyAvatar}>
              <Icon family="Ionicons" name="happy-outline" size={ms(24)} color={Colors.white} />
            </View>
            <View style={{flex: 1, marginLeft: s(10)}}>
              <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(15)}}>Baby Zara</AppText>
              <AppText variant="small" color="rgba(255,255,255,0.55)">{rec.day} - {rec.percentile || '50th'} percentile</AppText>
            </View>
            <View style={[st.statusBadge, {backgroundColor: rec.status === 'On track' ? 'rgba(29,158,117,0.3)' : 'rgba(245,158,11,0.3)'}]}>
              <AppText variant="small" color={rec.status === 'On track' ? Colors.paleGreen : '#FCD34D'} style={{fontWeight: '700'}}>{rec.status}</AppText>
            </View>
          </View>
          <View style={st.growthRow}>
            {[
              {v: rec.weight, l: 'Weight'},
              {v: rec.length, l: 'Length'},
              {v: rec.hc, l: 'Head circ.'},
            ].map((g, i) => (
              <View key={i} style={st.growthCell}>
                <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(14)}}>{g.v}</AppText>
                <AppText variant="small" color="rgba(255,255,255,0.45)">{g.l}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Daily stats strip */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Daily summary</AppText>
          <View style={st.statsRow}>
            {[
              {v: `${rec.feeds}`, l: 'Feeds', icon: 'restaurant-outline', color: '#D97316'},
              {v: rec.sleepH, l: 'Sleep', icon: 'moon-outline', color: '#2A5FA0'},
              {v: `${rec.nappies}`, l: 'Nappies', icon: 'water-outline', color: '#A16207'},
              {v: `${rec.stools}`, l: 'Stools', icon: 'ellipse-outline', color: Colors.accent},
            ].map((s2, i) => (
              <View key={i} style={st.statCell}>
                <View style={[st.statIcon, {backgroundColor: s2.color + '18'}]}>
                  <Icon family="Ionicons" name={s2.icon} size={ms(14)} color={s2.color} />
                </View>
                <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(15), marginTop: vs(4)}}>{s2.v}</AppText>
                <AppText variant="small" color={Colors.textTertiary}>{s2.l}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Timeline */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Timeline</AppText>
          {(rec.timeline || []).map((item, i) => (
            <View key={i} style={[st.timeRow, i < (rec.timeline || []).length - 1 && st.timeRowBorder]}>
              <AppText variant="small" color={Colors.textTertiary} style={{width: ms(42), fontSize: ms(10)}}>{item.time}</AppText>
              <View style={[st.timeDot, {backgroundColor: item.color}]} />
              <View style={{flex: 1, marginLeft: s(8)}}>
                <AppText variant="caption" color={Colors.textPrimary}>{item.text}</AppText>
              </View>
            </View>
          ))}
        </View>

        {/* Growth snapshot */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Growth snapshot</AppText>
          {[
            {label: 'Weight', value: rec.weight, pct: 82, color: Colors.accent},
            {label: 'Length', value: rec.length, pct: 75, color: Colors.blue},
            {label: 'Head circumference', value: rec.hc, pct: 70, color: '#7C3AED'},
          ].map((g, i) => (
            <View key={i} style={st.growthItem}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4)}}>
                <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{g.label}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>{g.value} - {rec.percentile || '50th'} pctl</AppText>
              </View>
              <View style={st.progressTrack}>
                <View style={[st.progressFill, {width: `${g.pct}%`, backgroundColor: g.color}]} />
              </View>
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

  /* Baby info */
  babyRow: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(12)},
  babyAvatar: {width: ms(40), height: ms(40), borderRadius: ms(12), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  statusBadge: {paddingHorizontal: s(10), paddingVertical: vs(4), borderRadius: ms(8)},
  growthRow: {flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: ms(10), paddingVertical: vs(10)},
  growthCell: {alignItems: 'center'},

  /* Stats */
  statsRow: {flexDirection: 'row', justifyContent: 'space-around'},
  statCell: {alignItems: 'center'},
  statIcon: {width: ms(32), height: ms(32), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center'},

  /* Timeline */
  timeRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8)},
  timeRowBorder: {borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'},
  timeDot: {width: ms(8), height: ms(8), borderRadius: ms(4)},

  /* Growth */
  growthItem: {marginBottom: vs(12)},
  progressTrack: {height: vs(6), backgroundColor: Colors.borderLight, borderRadius: ms(3), overflow: 'hidden'},
  progressFill: {height: '100%', borderRadius: ms(3)},
});

export default NeonatalDetailScreen;
