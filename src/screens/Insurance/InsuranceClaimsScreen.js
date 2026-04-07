import React from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import {POLICY, YEAR_SUMMARY} from './claimData';

const InsuranceClaimsScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={[st.header, {paddingTop: insets.top + vs(8)}]}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(16)}}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText style={{fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, color: 'rgba(255,255,255,0.38)'}}>Insurance</AppText>
            <AppText style={{fontSize: ms(20), fontWeight: '700', color: Colors.white}}>Claims centre</AppText>
          </View>
        </View>

        {/* Insurance card */}
        <View style={st.insCard}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(12)}}>
            <View style={{width: ms(36), height: ms(36), borderRadius: ms(10), backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center'}}>
              <Icon family="Ionicons" name="star" size={ms(18)} color={Colors.amber} />
            </View>
            <View style={{flex: 1}}>
              <AppText style={{fontSize: ms(13), fontWeight: '700', color: Colors.white}}>{POLICY.insurer}</AppText>
              <AppText style={{fontSize: ms(9), color: 'rgba(255,255,255,0.5)', marginTop: vs(1)}}>{POLICY.plan}</AppText>
            </View>
            <View style={{backgroundColor: 'rgba(29,158,117,0.3)', paddingHorizontal: s(9), paddingVertical: vs(4), borderRadius: ms(8)}}>
              <AppText style={{fontSize: ms(9), fontWeight: '700', color: Colors.paleGreen}}>Active</AppText>
            </View>
          </View>
          <View style={st.insGrid}>
            <View style={st.insCell}><AppText style={st.insCellLabel}>Sum insured</AppText><AppText style={st.insCellValue}>{'\u20B9'}10L</AppText></View>
            <View style={st.insCell}><AppText style={st.insCellLabel}>Balance</AppText><AppText style={[st.insCellValue, {color: Colors.paleGreen}]}>{'\u20B9'}9.1L</AppText></View>
            <View style={st.insCell}><AppText style={st.insCellLabel}>Valid till</AppText><AppText style={st.insCellValue}>Mar 27</AppText></View>
          </View>
        </View>
      </View>

      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: s(13), paddingBottom: vs(80)}} showsVerticalScrollIndicator={false}>

        {/* Action buttons */}
        <View style={st.secLabel}><AppText style={st.secText}>What do you want to do?</AppText><View style={st.secLine} /></View>

        <TouchableOpacity style={st.actionBtn} activeOpacity={0.7} onPress={() => navigation.navigate('FileClaim')}>
          <View style={[st.actionIcon, {backgroundColor: Colors.primary}]}>
            <Icon family="Ionicons" name="document-text-outline" size={ms(24)} color={Colors.white} />
          </View>
          <View style={{flex: 1}}>
            <AppText style={{fontSize: ms(14), fontWeight: '700', color: Colors.textPrimary, marginBottom: vs(3)}}>File a new claim</AppText>
            <AppText style={{fontSize: ms(11), color: Colors.textSecondary, lineHeight: ms(16)}}>Submit a reimbursement, cashless, OPD, or day-care claim for medical expenses</AppText>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color={Colors.textTertiary} />
        </TouchableOpacity>

        <TouchableOpacity style={st.actionBtn} activeOpacity={0.7} onPress={() => navigation.navigate('TrackClaims')}>
          <View style={[st.actionIcon, {backgroundColor: Colors.blue}]}>
            <Icon family="Ionicons" name="search-outline" size={ms(24)} color={Colors.white} />
          </View>
          <View style={{flex: 1}}>
            <AppText style={{fontSize: ms(14), fontWeight: '700', color: Colors.textPrimary, marginBottom: vs(3)}}>Track existing claims</AppText>
            <AppText style={{fontSize: ms(11), color: Colors.textSecondary, lineHeight: ms(16)}}>View status, documents required, and reimbursement progress for past claims</AppText>
          </View>
          <Icon family="Ionicons" name="chevron-forward" size={ms(18)} color={Colors.textTertiary} />
        </TouchableOpacity>

        {/* Year summary */}
        <View style={st.secLabel}><AppText style={st.secText}>2026 at a glance</AppText><View style={st.secLine} /></View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(8)}}>
          {YEAR_SUMMARY.map((item, i) => (
            <View key={i} style={st.summaryCard}>
              <AppText style={{fontSize: ms(9), color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(4)}}>{item.label}</AppText>
              <AppText style={{fontSize: ms(20), fontWeight: '800', color: item.valueColor || Colors.primary}}>{item.value}</AppText>
              <AppText style={{fontSize: ms(9), color: Colors.textTertiary, marginTop: vs(2)}}>{item.sub}</AppText>
            </View>
          ))}
        </View>

        {/* Covered members */}
        <View style={st.secLabel}><AppText style={st.secText}>Covered members</AppText><View style={st.secLine} /></View>
        <View style={st.membersCard}>
          {POLICY.members.map((m, i) => (
            <View key={i} style={[st.memberRow, i < POLICY.members.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0'}]}>
              <Icon family="Ionicons" name="person-outline" size={ms(18)} color={Colors.textSecondary} />
              <View style={{flex: 1, marginLeft: s(10)}}>
                <AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.textPrimary}}>{m.name}</AppText>
                <AppText variant="small" color={Colors.textSecondary}>{m.relation} {'\u00B7'} {m.age}</AppText>
              </View>
              <AppText variant="small" color={Colors.tealDark} style={{fontWeight: '600'}}>{m.balance}</AppText>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(20)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  insCard: {backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: ms(16), padding: ms(14), borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)'},
  insGrid: {flexDirection: 'row', gap: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: ms(10), overflow: 'hidden'},
  insCell: {flex: 1, backgroundColor: 'rgba(0,0,0,0.2)', padding: ms(9)},
  insCellLabel: {fontSize: ms(7), textTransform: 'uppercase', letterSpacing: 0.4, color: 'rgba(255,255,255,0.38)', marginBottom: vs(2)},
  insCellValue: {fontSize: ms(12), fontWeight: '800', color: Colors.white},
  secLabel: {flexDirection: 'row', alignItems: 'center', marginTop: vs(18), marginBottom: vs(12)},
  secText: {fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: Colors.textSecondary, marginRight: s(8)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'},
  actionBtn: {backgroundColor: Colors.white, borderRadius: ms(18), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(16), flexDirection: 'row', alignItems: 'center', gap: s(14), marginBottom: vs(10)},
  actionIcon: {width: ms(50), height: ms(50), borderRadius: ms(14), alignItems: 'center', justifyContent: 'center'},
  summaryCard: {width: '47%', flexGrow: 1, backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(13)},
  membersCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', overflow: 'hidden'},
  memberRow: {flexDirection: 'row', alignItems: 'center', padding: ms(11)},
});

export default InsuranceClaimsScreen;
