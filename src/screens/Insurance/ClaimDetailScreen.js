import React from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import {CLAIMS, POLICY} from './claimData';

const Section = ({title}) => (
  <View style={{flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)}}>
    <AppText style={{fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, color: Colors.textSecondary, marginRight: s(8)}}>{title}</AppText>
    <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
  </View>
);

const ClaimDetailScreen = ({route, navigation}) => {
  const insets = useSafeAreaInsets();
  const claim = CLAIMS.find(c => c.id === route?.params?.claimId) || CLAIMS[0];

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={[st.header, {paddingTop: insets.top + vs(8)}]}>
        <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(10)}} onPress={() => navigation.goBack()}>
          <Icon family="Ionicons" name="chevron-back" size={16} color="rgba(255,255,255,0.6)" />
          <AppText style={{fontSize: ms(12), color: 'rgba(255,255,255,0.6)'}}>All claims</AppText>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', alignItems: 'flex-start', justifyContent: 'space-between'}}>
          <View style={{flex: 1}}>
            <AppText style={{fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.7, color: 'rgba(255,255,255,0.38)', marginBottom: vs(3)}}>{claim.ref}</AppText>
            <AppText style={{fontSize: ms(18), fontWeight: '700', color: Colors.white}}>{claim.type}</AppText>
            <AppText style={{fontSize: ms(11), color: 'rgba(255,255,255,0.5)', marginTop: vs(2)}}>Filed {claim.date}</AppText>
          </View>
          <View style={[st.badge, {backgroundColor: claim.statusBg}]}>
            <AppText style={{fontSize: ms(10), fontWeight: '700', color: claim.statusColor}}>{claim.statusLabel}</AppText>
          </View>
        </View>
      </View>

      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: s(13), paddingBottom: vs(80)}} showsVerticalScrollIndicator={false}>

        {/* Timeline */}
        <Section title="Status timeline" />
        <View style={st.timelineCard}>
          {claim.timeline.map((step, i) => {
            const isLast = i === claim.timeline.length - 1;
            return (
              <View key={i} style={{flexDirection: 'row', alignItems: 'flex-start', gap: s(12), position: 'relative', paddingBottom: isLast ? 0 : vs(16)}}>
                {!isLast && <View style={[st.tlLine, {backgroundColor: step.done ? claim.stripColor : '#f0f0f0'}]} />}
                <View style={[st.tlDot, {backgroundColor: step.done ? claim.stripColor : '#f0f0f0'}]}>
                  {step.done ? <Icon family="Ionicons" name="checkmark" size={ms(11)} color={Colors.white} /> : <AppText style={{fontSize: ms(10), fontWeight: '700', color: Colors.textTertiary}}>{i + 1}</AppText>}
                </View>
                <View style={{flex: 1}}>
                  <AppText style={{fontSize: ms(12), fontWeight: '700', color: step.done ? Colors.textPrimary : Colors.textTertiary}}>{step.label}</AppText>
                  {step.date ? <AppText style={{fontSize: ms(10), color: step.done ? Colors.textSecondary : Colors.textTertiary, marginTop: vs(2)}}>{step.date}</AppText> : null}
                  {step.note && step.done ? <AppText style={{fontSize: ms(10), color: Colors.textTertiary, marginTop: vs(2)}}>{step.note}</AppText> : null}
                </View>
              </View>
            );
          })}
        </View>

        {/* Policy & claimant */}
        <Section title="Policy & claimant" />
        <View style={st.card}>
          {[
            ['Policy No.', POLICY.policyNo],
            ['Insurer', POLICY.insurer],
            ['Claimant', `${claim.claimant} (Self)`],
          ].map((row, i, arr) => (
            <View key={i} style={[st.detailRow, i < arr.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0'}]}>
              <AppText style={{fontSize: ms(11), color: Colors.textSecondary}}>{row[0]}</AppText>
              <AppText style={{fontSize: ms(11), fontWeight: '600', color: Colors.textPrimary, textAlign: 'right', maxWidth: '60%'}}>{row[1]}</AppText>
            </View>
          ))}
        </View>

        {/* Treatment */}
        <Section title="Treatment" />
        <View style={st.card}>
          {claim.treatment.map((row, i) => (
            <View key={i} style={[st.detailRow, i < claim.treatment.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0'}]}>
              <AppText style={{fontSize: ms(11), color: Colors.textSecondary}}>{row[0]}</AppText>
              <AppText style={{fontSize: ms(11), fontWeight: '600', color: Colors.textPrimary, textAlign: 'right', maxWidth: '60%'}}>{row[1]}</AppText>
            </View>
          ))}
        </View>

        {/* Expenses */}
        <Section title="Expenses claimed" />
        {claim.expenses.map((e, i) => (
          <View key={i} style={st.expenseRow}>
            <Icon family="Ionicons" name={e.icon} size={ms(20)} color={Colors.textSecondary} />
            <View style={{flex: 1, marginLeft: s(10)}}>
              <AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.textPrimary}}>{e.name}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{e.sub}</AppText>
            </View>
            <AppText style={{fontSize: ms(14), fontWeight: '800', color: Colors.primary}}>{e.amt}</AppText>
          </View>
        ))}
        <View style={st.totalBar}>
          <AppText style={{fontSize: ms(12), color: 'rgba(255,255,255,0.6)'}}>Total claimed</AppText>
          <AppText style={{fontSize: ms(16), fontWeight: '800', color: Colors.white}}>{claim.amount}</AppText>
        </View>

        {/* Documents */}
        <Section title="Documents attached" />
        <View style={st.card}>
          {claim.docs.map((doc, i) => (
            <View key={i} style={[st.docRow, i < claim.docs.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: '#f0f0f0'}]}>
              <View style={st.docCheck}><Icon family="Ionicons" name="checkmark" size={ms(10)} color={Colors.white} /></View>
              <AppText style={{flex: 1, fontSize: ms(11), fontWeight: '600', color: Colors.textPrimary}}>{doc}</AppText>
              <Icon family="Ionicons" name="attach-outline" size={ms(18)} color={Colors.textTertiary} />
            </View>
          ))}
        </View>

        {/* Payment */}
        {claim.payment && (
          <View>
            <Section title="Payment" />
            <View style={st.paymentCard}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(10)}}>
                <AppText style={{fontSize: ms(12), fontWeight: '700', color: Colors.primary}}>Payment confirmed</AppText>
                <AppText style={{fontSize: ms(18), fontWeight: '800', color: Colors.primary}}>{claim.payment.amount}</AppText>
              </View>
              <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(8)}}>
                {[['Bank', claim.payment.bank], ['Account', claim.payment.account], ['Date paid', claim.payment.date], ['Payment ref', claim.payment.ref]].map(([lbl, val], i) => (
                  <View key={i} style={st.payBox}>
                    <AppText style={{fontSize: ms(8), color: Colors.textSecondary, textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(2)}}>{lbl}</AppText>
                    <AppText style={{fontSize: ms(11), fontWeight: '600', color: Colors.textPrimary}}>{val}</AppText>
                  </View>
                ))}
              </View>
            </View>
          </View>
        )}

        {/* Action note */}
        {claim.actionNote && (
          <View style={st.actionNote}>
            <AppText style={{fontSize: ms(12), fontWeight: '700', color: '#92400E', marginBottom: vs(6)}}>Action required</AppText>
            <AppText style={{fontSize: ms(11), color: '#92400E', lineHeight: ms(16), marginBottom: vs(10)}}>{claim.actionNote}</AppText>
            <TouchableOpacity style={st.uploadBtn} activeOpacity={0.7}>
              <Icon family="Ionicons" name="camera-outline" size={ms(16)} color={Colors.white} />
              <AppText style={{fontSize: ms(13), fontWeight: '700', color: Colors.white}}>Upload updated prescription</AppText>
            </TouchableOpacity>
          </View>
        )}
      </ScrollView>

      <View style={st.bottomBar}>
        <View style={{flexDirection: 'row', gap: s(8)}}>
          <TouchableOpacity style={st.secBtn} activeOpacity={0.7}>
            <Icon family="Ionicons" name="download-outline" size={ms(16)} color={Colors.primary} />
            <AppText style={{fontSize: ms(13), fontWeight: '700', color: Colors.primary}}>Download PDF</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={st.priBtn} activeOpacity={0.7}>
            <AppText style={{fontSize: ms(13), fontWeight: '700', color: Colors.white}}>
              {claim.status === 'docs' ? 'Upload documents' : claim.status === 'review' ? 'Contact insurer' : 'Download certificate'}
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(14)},
  badge: {paddingHorizontal: s(11), paddingVertical: vs(5), borderRadius: ms(10), marginTop: vs(4)},
  timelineCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(14)},
  tlLine: {position: 'absolute', left: ms(10), top: ms(22), bottom: 0, width: ms(2)},
  tlDot: {width: ms(22), height: ms(22), borderRadius: ms(11), alignItems: 'center', justifyContent: 'center', marginTop: vs(1)},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', overflow: 'hidden'},
  detailRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: ms(9), paddingHorizontal: s(13)},
  expenseRow: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(11), marginBottom: vs(7), flexDirection: 'row', alignItems: 'center'},
  totalBar: {backgroundColor: Colors.primary, borderRadius: ms(14), padding: ms(14), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(4)},
  docRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), padding: ms(10)},
  docCheck: {width: ms(18), height: ms(18), borderRadius: ms(5), backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center'},
  paymentCard: {backgroundColor: Colors.tealBg, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.paleGreen, padding: ms(14)},
  payBox: {width: '47%', flexGrow: 1, backgroundColor: Colors.white, borderRadius: ms(10), padding: ms(9)},
  actionNote: {backgroundColor: '#FFF3E5', borderRadius: ms(14), borderWidth: 1.5, borderColor: '#F97316', padding: ms(14), marginTop: vs(10)},
  uploadBtn: {backgroundColor: '#F97316', borderRadius: ms(11), paddingVertical: vs(12), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(8)},
  bottomBar: {backgroundColor: Colors.white, borderTopWidth: 0.5, borderTopColor: '#dde8e2', padding: ms(13), paddingBottom: vs(28)},
  secBtn: {flex: 1, backgroundColor: Colors.background, borderRadius: ms(13), paddingVertical: vs(14), flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(6), borderWidth: 0.5, borderColor: '#dde8e2'},
  priBtn: {flex: 1, backgroundColor: Colors.primary, borderRadius: ms(13), paddingVertical: vs(14), alignItems: 'center', justifyContent: 'center'},
});

export default ClaimDetailScreen;
