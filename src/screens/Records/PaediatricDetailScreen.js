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

  const hasSymptoms = (rec.symptoms || []).length > 0;
  const statusText = hasSymptoms ? `${rec.symptoms.length} symptom${rec.symptoms.length === 1 ? '' : 's'}` : 'Well';

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
              <AppText variant="small" color="rgba(255,255,255,0.55)">Daily log summary</AppText>
            </View>
            <View style={[st.statusBadge, {backgroundColor: hasSymptoms ? 'rgba(245,158,11,0.3)' : 'rgba(29,158,117,0.3)'}]}>
              <AppText variant="small" color={hasSymptoms ? '#FCD34D' : Colors.paleGreen} style={{fontWeight: '700'}}>{statusText}</AppText>
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

        {/* Dental log card */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Dental log</AppText>
          <View style={st.kpiRow}>
            {[
              {v: rec.brushSessions, l: 'Sessions', icon: 'brush-outline', color: '#378ADD'},
              {v: rec.brushDuration, l: 'Duration', icon: 'time-outline', color: Colors.accent},
              {v: rec.brushQuality, l: 'Quality', icon: 'sparkles-outline', color: '#7C3AED'},
              {v: rec.flossed ? 'Yes' : 'No', l: 'Flossed', icon: 'git-branch-outline', color: rec.flossed ? Colors.accent : Colors.textTertiary},
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
          <View style={st.inlineRow}>
            <AppText variant="small" color={Colors.textSecondary}>Toothpaste: <AppText color={Colors.textPrimary} style={{fontWeight: '600'}}>{rec.toothpaste}</AppText></AppText>
            <AppText variant="small" color={Colors.textSecondary}>Brushed by: <AppText color={Colors.textPrimary} style={{fontWeight: '600'}}>{rec.helper}</AppText></AppText>
          </View>
          <View style={st.inlineRow}>
            <AppText variant="small" color={Colors.textSecondary}>Teeth: <AppText color={Colors.textPrimary} style={{fontWeight: '600'}}>{rec.teethBreakdown}</AppText></AppText>
          </View>
        </View>

        {/* Symptoms card */}
        {(hasSymptoms || rec.feverReading) && (
          <View style={st.card}>
            <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Symptoms logged</AppText>
            {rec.feverReading && (
              <View style={[st.feverBox, {backgroundColor: Colors.redBg, borderColor: '#F6C9C8'}]}>
                <Icon family="Ionicons" name="thermometer-outline" size={ms(16)} color={Colors.red} />
                <AppText variant="caption" color={Colors.red} style={{fontWeight: '700', marginLeft: s(6)}}>Fever reading: {rec.feverReading}</AppText>
              </View>
            )}
            <View style={st.chipWrap}>
              {(rec.symptoms || []).map((sym, i) => (
                <View key={i} style={st.symChip}>
                  <Icon family="Ionicons" name="alert-circle-outline" size={ms(11)} color={Colors.amberDark} />
                  <AppText variant="small" color={Colors.amberDark} style={{fontWeight: '600', marginLeft: s(4)}}>{sym}</AppText>
                </View>
              ))}
            </View>
          </View>
        )}

        {/* Medicines card */}
        {rec.activeMeds > 0 && (
          <View style={st.card}>
            <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Medicines log</AppText>
            <View style={st.medHero}>
              <View style={{flex: 1}}>
                <AppText variant="small" color={Colors.textTertiary} style={{textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '700'}}>Active course</AppText>
                <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(13), marginTop: vs(2)}}>{rec.activeCourse}</AppText>
              </View>
              <View style={[st.dosesBadge, {backgroundColor: Colors.amberBg}]}>
                <AppText variant="bodyBold" color={Colors.amberDark} style={{fontSize: ms(14)}}>{rec.dosesTaken}</AppText>
                <AppText variant="small" color={Colors.amberDark} style={{fontSize: ms(8)}}>doses today</AppText>
              </View>
            </View>
            {rec.lastDose && (
              <View style={st.doseNote}>
                <Icon family="Ionicons" name="flask-outline" size={ms(13)} color={Colors.primary} />
                <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(6), flex: 1}}>{rec.lastDose}</AppText>
              </View>
            )}
          </View>
        )}

        {/* Timeline */}
        <View style={st.card}>
          <AppText variant="sectionTitle" color={Colors.textSecondary} style={st.cardLabel}>Timeline</AppText>
          {(rec.events || []).length === 0 ? (
            <AppText variant="caption" color={Colors.textTertiary} style={{fontStyle: 'italic'}}>No log entries for this day</AppText>
          ) : (
            (rec.events || []).map((item, i) => (
              <View key={i} style={[st.timeRow, i < (rec.events || []).length - 1 && st.timeRowBorder]}>
                <AppText variant="small" color={Colors.textTertiary} style={{width: ms(42), fontSize: ms(10)}}>{item.time}</AppText>
                <View style={[st.timeDot, {backgroundColor: item.color}]} />
                <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, marginLeft: s(8)}}>{item.text}</AppText>
              </View>
            ))
          )}
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

  kpiRow: {flexDirection: 'row', justifyContent: 'space-around', marginBottom: vs(10)},
  kpiCell: {alignItems: 'center'},
  kpiIcon: {width: ms(32), height: ms(32), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center'},

  inlineRow: {flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: s(8), marginTop: vs(6)},

  feverBox: {flexDirection: 'row', alignItems: 'center', padding: ms(10), borderRadius: ms(10), borderWidth: 1, marginBottom: vs(8)},
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6)},
  symChip: {flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.amberBg, paddingHorizontal: s(8), paddingVertical: vs(4), borderRadius: ms(8)},

  medHero: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(8)},
  dosesBadge: {paddingHorizontal: s(10), paddingVertical: vs(6), borderRadius: ms(10), alignItems: 'center'},
  doseNote: {flexDirection: 'row', alignItems: 'flex-start', backgroundColor: Colors.background, padding: ms(8), borderRadius: ms(8)},

  timeRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8)},
  timeRowBorder: {borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'},
  timeDot: {width: ms(8), height: ms(8), borderRadius: ms(4)},
});

export default PaediatricDetailScreen;
