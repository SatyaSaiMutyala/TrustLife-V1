import React from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import {
  VITALS,
  CONDITIONS,
  MEDICATIONS_LIST,
  ALLERGIES,
  SURGICAL_HISTORY,
  IMMUNISATIONS,
} from '../../constants/profileData';

const STAGE_COLORS = {
  managed: {bg: Colors.tealBg, color: Colors.accent},
  active: {bg: '#FDF3E7', color: '#B5600E'},
  monitor: {bg: '#EAF2FB', color: '#1A5276'},
  resolved: {bg: '#F2EFE8', color: '#A09E9A'},
};

const StagePill = ({label, type}) => {
  const c = STAGE_COLORS[type] || STAGE_COLORS.resolved;
  return (
    <View style={[st.pill, {backgroundColor: c.bg}]}>
      <AppText variant="small" style={{color: c.color, fontSize: ms(10), fontWeight: '600'}}>{label}</AppText>
    </View>
  );
};

const HealthScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <AppText variant="body" style={st.backText}>{'\u2039'} Profile</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={st.savePill} activeOpacity={0.8}>
            <AppText variant="small" style={st.savePillText}>Save</AppText>
          </TouchableOpacity>
        </View>
        <AppText variant="screenName" style={st.headerTitle}>Conditions & Medications</AppText>
        <AppText variant="caption" style={st.headerSub}>Priya Raghunathan</AppText>
      </View>

      <ScrollView style={st.scroll} contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>

        {/* 1. Current Vitals */}
        <AppText variant="sectionTitle" style={st.sectionLabel}>CURRENT VITALS</AppText>
        <View style={st.vitalsGrid}>
          {VITALS.map((v, i) => (
            <View key={i} style={st.vitalCard}>
              <AppText style={st.vitalNum}>{v.value}</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={st.vitalUnit}>{v.unit}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={st.vitalLabel}>{v.label}</AppText>
              {v.status && (
                <AppText variant="small" style={{marginTop: vs(3), fontWeight: '600', color: v.statusWarn ? '#B5600E' : Colors.accent}}>
                  {v.status}
                </AppText>
              )}
            </View>
          ))}
        </View>
        <View style={st.card}>
          <View style={st.infoRow}>
            <AppText variant="small" color={Colors.textTertiary} style={st.infoLabel}>LAST CHECKUP</AppText>
            <AppText variant="body" style={{flex: 1}}>14 Jan 2026 {'\u2014'} Dr. Rekha Menon, Apollo Hospitals</AppText>
          </View>
        </View>

        {/* 2. Current Conditions */}
        <AppText variant="sectionTitle" style={st.sectionLabel}>CURRENT CONDITIONS</AppText>
        <View style={st.card}>
          {CONDITIONS.map((c, i) => (
            <View key={i} style={[st.condRow, i < CONDITIONS.length - 1 && st.condBorder]}>
              <View style={[st.condIcon, {backgroundColor: c.bg}]}>
                <AppText style={{fontSize: ms(16)}}>{c.icon}</AppText>
              </View>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold">{c.name}</AppText>
                <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{c.meta}</AppText>
                <View style={{marginTop: vs(4)}}>
                  <StagePill label={c.stage} type={c.stageType} />
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* 3. Current Medications */}
        <AppText variant="sectionTitle" style={st.sectionLabel}>CURRENT MEDICATIONS</AppText>
        <View style={st.card}>
          <View style={st.tableHeader}>
            <AppText variant="small" style={[st.thText, {flex: 1.2}]}>Medication</AppText>
            <AppText variant="small" style={[st.thText, {flex: 0.6}]}>Dose</AppText>
            <AppText variant="small" style={[st.thText, {flex: 1}]}>Frequency</AppText>
            <AppText variant="small" style={[st.thText, {flex: 0.8}]}>For</AppText>
          </View>
          {MEDICATIONS_LIST.map((m, i) => (
            <View key={i} style={[st.tableRow, i < MEDICATIONS_LIST.length - 1 && st.rowBorder]}>
              <AppText variant="body" style={[st.tdText, {flex: 1.2, fontWeight: '600'}]}>{m.name}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{flex: 0.6}}>{m.dose}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{flex: 1}}>{m.freq}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{flex: 0.8}}>{m.forCondition}</AppText>
            </View>
          ))}
        </View>

        {/* 4. Allergies */}
        <AppText variant="sectionTitle" style={st.sectionLabel}>ALLERGIES & ADVERSE REACTIONS</AppText>
        <View style={st.card}>
          <View style={st.tableHeader}>
            <AppText variant="small" style={[st.thText, {flex: 1}]}>Allergen</AppText>
            <AppText variant="small" style={[st.thText, {flex: 0.7}]}>Type</AppText>
            <AppText variant="small" style={[st.thText, {flex: 1}]}>Reaction</AppText>
            <AppText variant="small" style={[st.thText, {flex: 0.6}]}>Severity</AppText>
          </View>
          {ALLERGIES.map((a, i) => (
            <View key={i} style={[st.tableRow, i < ALLERGIES.length - 1 && st.rowBorder]}>
              <AppText variant="body" style={{flex: 1, fontWeight: '600'}}>{a.allergen}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{flex: 0.7}}>{a.type}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{flex: 1}}>{a.reaction}</AppText>
              <View style={{flex: 0.6}}>
                <StagePill label={a.severity} type={a.sevType} />
              </View>
            </View>
          ))}
        </View>

        {/* 5. Surgical History */}
        <AppText variant="sectionTitle" style={st.sectionLabel}>PAST SURGICAL & MEDICAL HISTORY</AppText>
        <View style={st.card}>
          {SURGICAL_HISTORY.map((s, i) => (
            <View key={i} style={[st.infoRow, i < SURGICAL_HISTORY.length - 1 && st.rowBorder]}>
              <AppText variant="small" color={Colors.textTertiary} style={st.infoLabel}>{s.year}</AppText>
              <AppText variant="body" style={{flex: 1}}>{s.desc}</AppText>
            </View>
          ))}
        </View>

        {/* 6. Immunisations */}
        <AppText variant="sectionTitle" style={st.sectionLabel}>IMMUNISATIONS</AppText>
        <View style={st.card}>
          <View style={st.tableHeader}>
            <AppText variant="small" style={[st.thText, {flex: 1.2}]}>Vaccine</AppText>
            <AppText variant="small" style={[st.thText, {flex: 1}]}>Last Dose</AppText>
            <AppText variant="small" style={[st.thText, {flex: 0.7}]}>Status</AppText>
          </View>
          {IMMUNISATIONS.map((im, i) => (
            <View key={i} style={[st.tableRow, i < IMMUNISATIONS.length - 1 && st.rowBorder]}>
              <AppText variant="body" style={{flex: 1.2, fontWeight: '600'}}>{im.vaccine}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{flex: 1}}>{im.lastDose}</AppText>
              <View style={{flex: 0.7}}>
                <StagePill label={im.status} type={im.statusType} />
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
  header: {backgroundColor: Colors.primary, paddingBottom: vs(16), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(12)},
  backBtn: {paddingVertical: vs(4), paddingRight: s(12)},
  backText: {color: Colors.white, fontSize: ms(15)},
  savePill: {paddingHorizontal: s(14), paddingVertical: vs(6), borderRadius: ms(20), backgroundColor: 'rgba(93,202,165,0.18)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)'},
  savePillText: {color: Colors.lightGreen, fontSize: ms(12), fontWeight: '600'},
  headerTitle: {color: Colors.white, fontSize: ms(20), fontWeight: '700', marginBottom: vs(4)},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  scroll: {flex: 1},
  scrollContent: {padding: s(16)},
  sectionLabel: {marginBottom: vs(8), marginTop: vs(6)},
  card: {backgroundColor: Colors.white, borderRadius: ms(16), padding: s(14), marginBottom: vs(12)},
  pill: {paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(20), alignSelf: 'flex-start'},

  /* Vitals */
  vitalsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8), marginBottom: vs(10)},
  vitalCard: {width: '23%', backgroundColor: Colors.white, borderRadius: ms(12), padding: s(10), alignItems: 'center'},
  vitalNum: {fontSize: ms(18), fontWeight: '700', color: Colors.textPrimary},
  vitalUnit: {fontSize: ms(9), textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '500'},
  vitalLabel: {fontSize: ms(10), marginTop: vs(2), fontWeight: '500', textAlign: 'center'},

  /* Conditions */
  condRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(12), paddingVertical: vs(10)},
  condBorder: {borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  condIcon: {width: ms(36), height: ms(36), borderRadius: ms(8), alignItems: 'center', justifyContent: 'center'},

  /* Tables */
  tableHeader: {flexDirection: 'row', paddingBottom: vs(8), borderBottomWidth: 1, borderBottomColor: Colors.borderLight},
  thText: {fontSize: ms(10), fontWeight: '600', color: Colors.textTertiary, textTransform: 'uppercase', letterSpacing: 0.4},
  tableRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10)},
  tdText: {fontSize: ms(13)},
  rowBorder: {borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},

  /* Info rows */
  infoRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8), gap: s(10)},
  infoLabel: {width: s(80), fontSize: ms(10), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4},
});

export default HealthScreen;
