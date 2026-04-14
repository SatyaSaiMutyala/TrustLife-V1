import React from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../../constants/colors';
import AppText from '../../../../components/shared/AppText';
import Icon from '../../../../components/shared/Icons';

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const TILES = [
  {
    key: 'dev', name: 'Developmental milestones', icon: 'bulb-outline',
    status: 'ASQ-3 built-in\n9 years - IAP schedule',
    badge: 'On track', badgeBg: Colors.tealBg, badgeColor: Colors.tealText,
    barColor: Colors.primary, route: 'DevelopmentalMilestones',
  },
  {
    key: 'all', name: 'Allergen intro log', icon: 'nutrition-outline',
    status: '3 of 8 introduced\nNo reactions logged',
    badge: '5 pending', badgeBg: Colors.amberBg, badgeColor: Colors.amberDark,
    barColor: '#D85A30', route: 'AllergenIntro',
  },
  {
    key: 'sym', name: 'Symptom checker', icon: 'thermometer-outline',
    status: 'Age-stratified - Red flags\nFever - Cough - Rash',
    badge: 'Ready to use', badgeBg: '#E8F5F2', badgeColor: '#0B3A30',
    barColor: '#E24B4A', route: 'SymptomChecker',
  },
  {
    key: 'den', name: 'Dental tracker', icon: 'happy-outline',
    status: '4 teeth erupted\nFirst dentist: 12m',
    badge: 'On schedule', badgeBg: Colors.tealBg, badgeColor: Colors.tealText,
    barColor: '#378ADD', route: 'DentalTracker',
  },
];

const MEDS_TILE = {
  key: 'med', name: 'Paediatric medicines tracker', icon: 'medkit-outline',
  status: 'mg/kg dose calculator - Antibiotic course tracker - Allergy cross-reference - 0 active medications',
  badge: 'No active courses', badgeBg: '#E8F5F2', badgeColor: '#0B3A30',
  barColor: '#534AB7', route: 'MedicinesTracker',
};

const AYU_ALERTS = [
  {
    icon: 'alert-circle-outline', iconColor: Colors.amberDark,
    bg: Colors.amberBg, textColor: Colors.amberDark, borderColor: '#FDDCB5',
    title: 'Allergen introduction: peanut is next.',
    body: ' LEAP protocol recommends peanut introduction at 6 months in high-risk infants. Aarav is 9, meaning LEAP does not apply - but peanut should still be introduced in a supervised home setting. See Allergen Intro log for the step protocol.',
  },
  {
    icon: 'bulb-outline', iconColor: '#0B3A30',
    bg: '#E8F5F2', textColor: '#0B3A30', borderColor: '#9FD4C0',
    title: 'School-age milestone check at 9 years.',
    body: ' Key milestones: reading fluency, complex problem-solving, sustained attention 20+ minutes, peer friendship quality. The ASQ-3 is not validated above 5.5 years - use the SDQ (Strengths and Difficulties Questionnaire) for age 9. Tap Developmental Milestones to complete it.',
  },
  {
    icon: 'happy-outline', iconColor: Colors.tealText,
    bg: Colors.tealBg, textColor: Colors.tealText, borderColor: Colors.paleGreen,
    title: 'Orthodontic assessment due.',
    body: ' IAP recommends a first orthodontic review between ages 7-9 when the permanent dentition is establishing. With 20 teeth now and mixed dentition phase complete, crowding, crossbite, or spacing can be identified early. Book with a paediatric dentist.',
  },
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const Section = ({title}) => (
  <View style={st.sec}>
    <AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{title}</AppText>
    <View style={st.secLine} />
  </View>
);

const AppTile = ({tile, fullWidth, onPress}) => (
  <TouchableOpacity
    style={[st.tile, fullWidth && {width: '100%'}]}
    activeOpacity={0.7}
    onPress={onPress}>
    <View style={[st.tileBar, {backgroundColor: tile.barColor}]} />
    <View style={st.tileIconWrap}>
      <Icon family="Ionicons" name={tile.icon} size={ms(22)} color={tile.barColor} />
    </View>
    <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginBottom: vs(3)}}>{tile.name}</AppText>
    <AppText variant="small" color={Colors.textSecondary} style={{lineHeight: ms(14)}}>{tile.status}</AppText>
    <View style={[st.tileBadge, {backgroundColor: tile.badgeBg}]}>
      <AppText variant="subtext" color={tile.badgeColor} style={{fontWeight: '700'}}>{tile.badge}</AppText>
    </View>
  </TouchableOpacity>
);

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const PaediatricLogScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const goTile = (route) => {
    if (route) navigation.navigate(route);
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Fixed Header (back arrow only) ── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topRow}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
            <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
            </TouchableOpacity>
            <View style={{flex: 1}}>
              <AppText variant="screenName" style={{color: Colors.white, fontSize: ms(18), fontWeight: '700'}}>Child health</AppText>
              <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', fontSize: ms(11)}}>9y 2m</AppText>
            </View>
          </View>
        </View>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Hero header section (green bg) */}
        <View style={st.heroBg}>

          {/* Child card hero */}
          <View style={st.babyCard}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(12)}}>
              <View style={st.babyAvatar}>
                <Icon family="Ionicons" name="happy-outline" size={ms(26)} color={Colors.white} />
              </View>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(17)}}>Child health {'-'} Phase 2</AppText>
                <AppText variant="subtext" color="rgba(255,255,255,0.55)">Aarav {'-'} 9y 2m {'-'} IAP 2024 {'-'} Development & screening</AppText>
              </View>
            </View>

            {/* KPI strip */}
            <View style={st.kpiStrip}>
              {[
                {v: 'On track', l: 'Milestones', c: Colors.white},
                {v: '3', l: 'Allergens done', c: '#F0B429'},
                {v: '4', l: 'Teeth erupted', c: Colors.white},
                {v: '0', l: 'Active meds', c: Colors.paleGreen},
              ].map((cell, i) => (
                <View key={i} style={st.kpiCell}>
                  <AppText variant="bodyBold" color={cell.c} style={{fontWeight: '800', fontSize: ms(13), lineHeight: ms(16)}}>{cell.v}</AppText>
                  <AppText variant="subtext" color="rgba(255,255,255,0.4)" style={{fontSize: ms(7), textTransform: 'uppercase', letterSpacing: 0.4, marginTop: vs(2), textAlign: 'center'}}>{cell.l}</AppText>
                </View>
              ))}
            </View>
          </View>
        </View>

        {/* App grid */}
        <Section title="Phase 2 child health apps" />
        <View style={st.appGrid}>
          {TILES.map((tile) => (
            <AppTile key={tile.key} tile={tile} onPress={() => goTile(tile.route)} />
          ))}
          <AppTile tile={MEDS_TILE} fullWidth onPress={() => goTile(MEDS_TILE.route)} />
        </View>

        {/* Ayu alerts */}
        <Section title="Ayu alerts - child health" />
        {AYU_ALERTS.map((alert, i) => (
          <View key={i} style={[st.insight, {backgroundColor: alert.bg, borderColor: alert.borderColor}]}>
            <Icon family="Ionicons" name={alert.icon} size={ms(16)} color={alert.iconColor} />
            <AppText variant="caption" color={alert.textColor} style={{flex: 1, lineHeight: ms(17)}}>
              <AppText style={{fontWeight: '700'}}>{alert.title}</AppText>{alert.body}
            </AppText>
          </View>
        ))}

        <View style={{height: vs(40)}} />
      </ScrollView>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  // Header
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(8)},
  topRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(8)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13)},

  // Hero
  heroBg: {backgroundColor: Colors.primary, marginHorizontal: s(-13), paddingHorizontal: s(16), paddingTop: vs(4), paddingBottom: vs(20), marginBottom: vs(10)},

  babyCard: {backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.18)', borderRadius: ms(18), padding: ms(14)},
  babyAvatar: {width: ms(48), height: ms(48), borderRadius: ms(14), backgroundColor: 'rgba(255,255,255,0.18)', alignItems: 'center', justifyContent: 'center'},

  kpiStrip: {flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: ms(10), overflow: 'hidden', gap: 1, marginTop: vs(12)},
  kpiCell: {flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', paddingVertical: vs(9), paddingHorizontal: s(8), alignItems: 'center'},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(12), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#D4E8DF'},

  // App grid
  appGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(9)},
  tile: {width: '48%', backgroundColor: Colors.white, borderRadius: ms(17), borderWidth: 0.5, borderColor: '#D4E8DF', padding: ms(13), paddingTop: ms(16), overflow: 'hidden'},
  tileBar: {position: 'absolute', top: 0, left: 0, right: 0, height: 3},
  tileIconWrap: {marginBottom: vs(8)},
  tileBadge: {alignSelf: 'flex-start', paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(8), marginTop: vs(5)},

  // Insight
  insight: {borderRadius: ms(11), borderWidth: 1, padding: ms(10), marginBottom: vs(8), flexDirection: 'row', alignItems: 'flex-start', gap: s(8)},
});

export default PaediatricLogScreen;
