import React from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const PaediatricDetailScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const rec = route.params?.record || {};

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={[st.header, {paddingTop: insets.top + vs(10)}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={st.headerTitle}>Paediatric detail</AppText>
            <AppText variant="caption" style={st.headerSub}>{rec.date}</AppText>
          </View>
        </View>
      </View>

      <ScrollView style={{flex: 1}} contentContainerStyle={st.body} showsVerticalScrollIndicator={false}>

        {/* Child info card */}
        <View style={[st.card, {backgroundColor: Colors.primary}]}>
          <View style={st.childRow}>
            <View style={st.childAvatar}>
              <Icon family="Ionicons" name="body-outline" size={ms(24)} color={Colors.white} />
            </View>
            <View style={{flex: 1, marginLeft: s(10)}}>
              <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(15)}}>Aarav - {rec.age}</AppText>
              <AppText variant="small" color="rgba(255,255,255,0.55)">IAP 2024 schedule</AppText>
            </View>
            <View style={[st.statusBadge, {backgroundColor: rec.milestones === 'On track' ? 'rgba(29,158,117,0.3)' : 'rgba(245,158,11,0.3)'}]}>
              <AppText variant="small" color={rec.milestones === 'On track' ? Colors.paleGreen : '#FCD34D'} style={{fontWeight: '700'}}>{rec.milestones}</AppText>
            </View>
          </View>
          <View style={st.growthRow}>
            {[
              {v: rec.height, l: 'Height'},
              {v: rec.weight, l: 'Weight'},
              {v: `BMI ${rec.bmi}`, l: 'Body mass'},
            ].map((g, i) => (
              <View key={i} style={st.growthCell}>
                <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(14)}}>{g.v}</AppText>
                <AppText variant="small" color="rgba(255,255,255,0.45)">{g.l}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* KPI strip */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Daily snapshot</AppText>
          <View style={st.kpiRow}>
            {[
              {v: rec.milestones, l: 'Milestones', icon: 'bulb-outline', color: Colors.accent},
              {v: rec.allergens, l: 'Allergens', icon: 'nutrition-outline', color: '#D85A30'},
              {v: rec.teeth, l: 'Dental', icon: 'happy-outline', color: '#378ADD'},
              {v: `${rec.activeMeds}`, l: 'Active meds', icon: 'medkit-outline', color: '#534AB7'},
            ].map((k, i) => (
              <View key={i} style={st.kpiCell}>
                <View style={[st.kpiIcon, {backgroundColor: k.color + '18'}]}>
                  <Icon family="Ionicons" name={k.icon} size={ms(14)} color={k.color} />
                </View>
                <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(11), marginTop: vs(4)}}>{k.v}</AppText>
                <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(8)}}>{k.l}</AppText>
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

        {/* Growth chart */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Growth snapshot</AppText>
          {[
            {label: 'Height', value: rec.height, pct: 78, color: Colors.blue},
            {label: 'Weight', value: rec.weight, pct: 72, color: Colors.accent},
            {label: 'BMI', value: rec.bmi, pct: 65, color: '#7C3AED'},
          ].map((g, i) => (
            <View key={i} style={st.growthItem}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4)}}>
                <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{g.label}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>{g.value}</AppText>
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

  childRow: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(12)},
  childAvatar: {width: ms(40), height: ms(40), borderRadius: ms(12), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  statusBadge: {paddingHorizontal: s(10), paddingVertical: vs(4), borderRadius: ms(8)},
  growthRow: {flexDirection: 'row', justifyContent: 'space-around', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: ms(10), paddingVertical: vs(10)},
  growthCell: {alignItems: 'center'},

  kpiRow: {flexDirection: 'row', justifyContent: 'space-around'},
  kpiCell: {alignItems: 'center'},
  kpiIcon: {width: ms(32), height: ms(32), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center'},

  timeRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8)},
  timeRowBorder: {borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'},
  timeDot: {width: ms(8), height: ms(8), borderRadius: ms(4)},

  growthItem: {marginBottom: vs(12)},
  progressTrack: {height: vs(6), backgroundColor: Colors.borderLight, borderRadius: ms(3), overflow: 'hidden'},
  progressFill: {height: '100%', borderRadius: ms(3)},
});

export default PaediatricDetailScreen;
