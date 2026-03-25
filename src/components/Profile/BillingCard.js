import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Emoji from '../shared/Emoji';
import SectionTitle from '../shared/SectionTitle';

const rewards = [
  {val: '₹340', lbl: 'Reward credits'},
  {val: '3', lbl: 'Friends invited'},
  {val: '₹150', lbl: 'Referral earned'},
];

const subMenus = [
  {icon: '🎁', bg: Colors.tealBg, name: 'Referral incentives', sub: 'Earn ₹100 per friend who joins'},
  {icon: '🏆', bg: Colors.amberBg, name: 'Rewards & redemption', sub: 'Use credits on services & medicines'},
  {icon: '📄', bg: Colors.blueBg, name: 'Subscription history', sub: 'Past invoices and payment methods'},
];

const BillingCard = () => (
  <View>
    <SectionTitle title="Billing & Rewards" />
    <View style={styles.card}>
      <View style={styles.top}>
        <View>
          <AppText variant="bodyBold" style={styles.plan}>TrustLife Pro</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={styles.price}>₹499 / month · Renews Apr 21, 2026</AppText>
        </View>
        <View style={styles.proBadge}><AppText variant="caption" color={Colors.white} style={styles.proText}>Pro</AppText></View>
      </View>
      <View style={styles.rewardsRow}>
        {rewards.map((r, i) => (
          <View key={i} style={styles.rewardBox}>
            <AppText variant="header" color={Colors.primary} style={styles.rwVal}>{r.val}</AppText>
            <AppText variant="subtext" color={Colors.textTertiary} style={styles.rwLbl}>{r.lbl}</AppText>
          </View>
        ))}
      </View>
      <View style={styles.divider} />
      {subMenus.map((m, i) => (
        <TouchableOpacity key={i} style={[styles.menuRow, i > 0 && {marginTop: vs(4)}]} activeOpacity={0.6}>
          <View style={[styles.menuIco, {backgroundColor: m.bg}]}>
            <Emoji icon={m.icon} size={14} />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold">{m.name}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={styles.menuSub}>{m.sub}</AppText>
          </View>
          <AppText variant="body" color={Colors.textTertiary} style={styles.arrow}>›</AppText>
        </TouchableOpacity>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(14), marginBottom: vs(10)},
  top: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(12)},
  plan: {fontSize: ms(14)},
  price: {marginTop: vs(2)},
  proBadge: {backgroundColor: Colors.primary, borderRadius: ms(20), paddingVertical: vs(3), paddingHorizontal: s(9)},
  proText: {fontWeight: '500'},
  rewardsRow: {flexDirection: 'row', gap: s(7), marginBottom: vs(12)},
  rewardBox: {flex: 1, backgroundColor: Colors.background, borderRadius: ms(10), paddingVertical: vs(10), paddingHorizontal: s(8), alignItems: 'center'},
  rwVal: {fontSize: ms(18)},
  rwLbl: {marginTop: vs(2)},
  divider: {height: 0.5, backgroundColor: Colors.borderLight, marginBottom: vs(10)},
  menuRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(6)},
  menuIco: {width: ms(30), height: ms(30), borderRadius: ms(8), alignItems: 'center', justifyContent: 'center'},
  menuSub: {marginTop: vs(1)},
  arrow: {fontSize: ms(15)},
});

export default BillingCard;
