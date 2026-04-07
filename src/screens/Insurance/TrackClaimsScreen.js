import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import {CLAIMS} from './claimData';

const FILTERS = [{key: 'all', label: 'All'}, {key: 'approved', label: 'Approved'}, {key: 'review', label: 'Under review'}, {key: 'docs', label: 'Docs needed'}];

const ClaimCard = ({claim, onPress}) => (
  <TouchableOpacity style={st.claimCard} activeOpacity={0.7} onPress={onPress}>
    <View style={{flexDirection: 'row', alignItems: 'stretch'}}>
      <View style={[st.ccStrip, {backgroundColor: claim.stripColor}]} />
      <View style={st.ccBody}>
        <AppText style={st.ccRef}>{claim.ref}</AppText>
        <AppText style={st.ccName}>{claim.type} {'\u00B7'} {claim.claimant}</AppText>
        <AppText style={st.ccSub}>{claim.providers} {'\u00B7'} {claim.date}</AppText>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(4), marginTop: vs(6)}}>
          {claim.tags.map((tag, i) => (
            <View key={i} style={st.ccTag}><AppText style={{fontSize: ms(9), fontWeight: '600', color: Colors.textSecondary}}>{tag}</AppText></View>
          ))}
        </View>
      </View>
      <View style={st.ccRight}>
        <AppText style={st.ccAmt}>{claim.amount}</AppText>
        <View style={[st.ccBadge, {backgroundColor: claim.statusBg}]}>
          <AppText style={{fontSize: ms(9), fontWeight: '700', color: claim.statusColor}}>{claim.statusLabel}</AppText>
        </View>
        <AppText style={{fontSize: ms(9), color: Colors.textTertiary, marginTop: vs(2)}}>Filed {claim.date.split(' ').slice(0, 2).join(' ')}</AppText>
      </View>
    </View>
  </TouchableOpacity>
);

const TrackClaimsScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('all');
  const filtered = filter === 'all' ? CLAIMS : CLAIMS.filter(c => c.status === filter);

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={[st.header, {paddingTop: insets.top + vs(8)}]}>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(10)}} onPress={() => navigation.goBack()}>
          <Icon family="Ionicons" name="chevron-back" size={16} color="rgba(255,255,255,0.6)" />
          <AppText style={{fontSize: ms(12), color: 'rgba(255,255,255,0.6)'}}>Claims centre</AppText>
        </TouchableOpacity>
        <AppText style={{fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, color: 'rgba(255,255,255,0.38)', marginBottom: vs(3)}}>Insurance {'\u00B7'} Claims history</AppText>
        <AppText style={{fontSize: ms(18), fontWeight: '700', color: Colors.white, marginBottom: vs(12)}}>Track claims</AppText>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: s(6)}}>
          {FILTERS.map(f => {
            const active = filter === f.key;
            return (
              <TouchableOpacity key={f.key} style={[st.tab, active && st.tabOn]} onPress={() => setFilter(f.key)} activeOpacity={0.7}>
                <AppText style={{fontSize: ms(11), fontWeight: '600', color: active ? Colors.primary : 'rgba(255,255,255,0.5)'}}>{f.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: s(13), paddingBottom: vs(80)}} showsVerticalScrollIndicator={false}>
        {filtered.map(claim => (
          <ClaimCard key={claim.id} claim={claim} onPress={() => navigation.navigate('ClaimDetail', {claimId: claim.id})} />
        ))}
        {filtered.length === 0 && (
          <View style={{alignItems: 'center', paddingVertical: vs(40)}}>
            <AppText variant="body" color={Colors.textTertiary}>No claims in this category</AppText>
          </View>
        )}
      </ScrollView>

      <View style={st.bottomBar}>
        <TouchableOpacity style={st.fileBtn} activeOpacity={0.8} onPress={() => navigation.navigate('FileClaim')}>
          <Icon family="Ionicons" name="add" size={ms(18)} color={Colors.white} />
          <AppText style={{fontSize: ms(14), fontWeight: '700', color: Colors.white}}>File a new claim</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(13)},
  tab: {paddingHorizontal: s(12), paddingVertical: vs(7), borderRadius: ms(10), backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)'},
  tabOn: {backgroundColor: Colors.white, borderColor: Colors.white},
  claimCard: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: '#dde8e2', overflow: 'hidden', marginBottom: vs(9)},
  ccStrip: {width: ms(5)},
  ccBody: {flex: 1, padding: ms(12)},
  ccRef: {fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, color: Colors.textSecondary, marginBottom: vs(4)},
  ccName: {fontSize: ms(13), fontWeight: '700', color: Colors.textPrimary, marginBottom: vs(3)},
  ccSub: {fontSize: ms(10), color: Colors.textSecondary},
  ccTag: {backgroundColor: Colors.background, paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(6)},
  ccRight: {padding: ms(12), alignItems: 'flex-end', justifyContent: 'center', gap: vs(5)},
  ccAmt: {fontSize: ms(15), fontWeight: '800', color: Colors.primary},
  ccBadge: {paddingHorizontal: s(9), paddingVertical: vs(3), borderRadius: ms(8)},
  bottomBar: {backgroundColor: Colors.white, borderTopWidth: 0.5, borderTopColor: '#dde8e2', padding: ms(13), paddingBottom: vs(28)},
  fileBtn: {backgroundColor: Colors.primary, borderRadius: ms(13), paddingVertical: vs(14), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(8)},
});

export default TrackClaimsScreen;
