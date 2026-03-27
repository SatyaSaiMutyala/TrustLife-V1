import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';

import AppText from '../../components/shared/AppText';
import Colors from '../../constants/colors';
import {
  REFERRAL_TABS,
  REFERRALS,
  REWARDS_LIST,
  REWARD_CATEGORIES,
  TIERS,
  COIN_HISTORY,
  BILLING_PLANS,
  SHARE_OPTIONS,
} from '../../constants/referralData';

const GOLD = '#f0b429';
const STATUS_COL = {active: '#22c55e', pending: '#f59e0b', 'signed-up': '#3b82f6'};

const ReferralScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  const [activeTab, setActiveTab] = useState('ref');
  const [coins] = useState(1840);
  const [showShare, setShowShare] = useState(false);
  const [showRedeem, setShowRedeem] = useState(null);
  const [showRefDetail, setShowRefDetail] = useState(null);

  const currentTier = TIERS[1]; // Silver
  const nextTier = TIERS[2]; // Gold
  const totalJoined = REFERRALS.filter(r => r.status !== 'pending').length;
  const activeRefs = REFERRALS.filter(r => r.status === 'active').length;
  const totalEarned = REFERRALS.reduce((sum, r) => sum + r.earnings, 0);

  /* ── Header ──────────────────────────────────────────── */
  const renderHeader = () => (
    <View style={[st.header, {paddingTop: insets.top}]}>
      <View style={st.topBar}>
        <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()}>
          <AppText variant="body" style={st.backText}>{'\u2039'} Profile</AppText>
        </TouchableOpacity>
        <View style={st.pillBadge}>
          <AppText variant="small" style={st.pillBadgeText}>Share & Earn</AppText>
        </View>
      </View>
      <AppText variant="screenName" style={st.headerTitle}>Rewards</AppText>
      <AppText variant="caption" style={st.headerSubtitle}>
        Referrals {'\u00B7'} TrustCoins {'\u00B7'} Billing
      </AppText>
    </View>
  );

  /* ── Tab Bar ─────────────────────────────────────────── */
  const renderTabBar = () => (
    <View style={st.tabBar}>
      {REFERRAL_TABS.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[st.tab, isActive && st.tabActive]}
            activeOpacity={0.7}
            onPress={() => setActiveTab(tab.key)}>
            <AppText
              variant="small"
              style={[st.tabLabel, isActive && st.tabLabelActive]}>
              {tab.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  /* ═══════════════════════════════════════════════════════
     REFERRALS TAB
     ═══════════════════════════════════════════════════════ */
  const renderReferralsTab = () => (
    <ScrollView style={st.scrollView} contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Hero card */}
      <View style={[st.card, {backgroundColor: Colors.primary}]}>
        <AppText style={{color: GOLD, fontSize: ms(32), fontWeight: '800', textAlign: 'center'}}>
          {coins.toLocaleString()} TrustCoins
        </AppText>
        <AppText variant="small" style={{color: 'rgba(255,255,255,0.6)', textAlign: 'center', marginTop: vs(4)}}>
          Worth approx {'\u20B9'}{(coins * 0.5).toFixed(0)} in rewards
        </AppText>
        <View style={st.heroStats}>
          {[
            {label: 'Active refs', val: activeRefs},
            {label: 'Total joined', val: totalJoined},
            {label: 'Coins earned', val: totalEarned},
          ].map((item, i) => (
            <View key={i} style={st.heroStatBox}>
              <AppText style={{color: Colors.white, fontSize: ms(18), fontWeight: '800'}}>{item.val}</AppText>
              <AppText variant="small" style={{color: 'rgba(255,255,255,0.6)', fontSize: ms(10)}}>{item.label}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Tier card */}
      <View style={st.card}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <AppText variant="bodyBold" style={{fontSize: ms(15)}}>
            Current Tier: <AppText style={{color: currentTier.col, fontWeight: '800'}}>{currentTier.label}</AppText>
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>{totalJoined}/{nextTier.min} to {nextTier.label}</AppText>
        </View>
        <View style={st.progressBar}>
          <View style={[st.progressFill, {width: `${Math.min((totalJoined / nextTier.min) * 100, 100)}%`, backgroundColor: currentTier.col}]} />
        </View>
        <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(8), marginBottom: vs(4)}}>
          Silver perks:
        </AppText>
        {currentTier.perks.map((p, i) => (
          <AppText key={i} variant="small" color={Colors.textSecondary} style={{marginLeft: s(4), marginBottom: vs(2)}}>
            {'\u2022'} {p}
          </AppText>
        ))}
      </View>

      {/* Referral code card */}
      <View style={st.card}>
        <AppText variant="small" color={Colors.textTertiary} style={{marginBottom: vs(6)}}>YOUR REFERRAL CODE</AppText>
        <AppText style={{fontFamily: 'monospace', fontSize: ms(28), fontWeight: '800', textAlign: 'center', letterSpacing: 3, marginBottom: vs(10)}}>
          PRIYA84
        </AppText>
        <TouchableOpacity style={st.copyBtn} activeOpacity={0.7}>
          <AppText variant="bodyBold" style={{color: Colors.white}}>Copy Code</AppText>
        </TouchableOpacity>
        <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(12), marginBottom: vs(6)}}>
          Share via
        </AppText>
        <View style={st.shareRow}>
          {SHARE_OPTIONS.map(opt => (
            <TouchableOpacity key={opt.key} style={st.shareItem} activeOpacity={0.7} onPress={() => setShowShare(true)}>
              <AppText style={{fontSize: ms(22)}}>{opt.ico}</AppText>
              <AppText variant="small" style={{fontSize: ms(9), marginTop: vs(2)}}>{opt.label}</AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* Referral list */}
      <AppText variant="small" color={Colors.textTertiary} style={st.sectionLabel}>REFERRALS</AppText>
      {REFERRALS.map(ref => (
        <TouchableOpacity key={ref.id} style={st.card} activeOpacity={0.7} onPress={() => setShowRefDetail(ref)}>
          <View style={st.cardTopRow}>
            <View style={st.avatar}>
              <AppText style={{fontSize: ms(22)}}>{ref.ico}</AppText>
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold">{ref.name}</AppText>
              <AppText variant="small" color={Colors.textSecondary}>{ref.milestone}</AppText>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <View style={[st.planBadge, {backgroundColor: ref.planColor + '20'}]}>
                <AppText variant="small" style={{color: ref.planColor, fontSize: ms(10), fontWeight: '600'}}>{ref.plan}</AppText>
              </View>
              <AppText variant="small" style={{color: GOLD, fontWeight: '700', marginTop: vs(4)}}>+{ref.earnings} coins</AppText>
            </View>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(6)}}>
            <View style={[st.statusBadge, {backgroundColor: (STATUS_COL[ref.status] || '#999') + '18'}]}>
              <View style={[st.statusDot, {backgroundColor: STATUS_COL[ref.status] || '#999'}]} />
              <AppText variant="small" style={{color: STATUS_COL[ref.status] || '#999', fontSize: ms(10), fontWeight: '600'}}>
                {ref.status}
              </AppText>
            </View>
            <AppText variant="small" color={Colors.textTertiary}>{ref.joined}</AppText>
          </View>
        </TouchableOpacity>
      ))}
      <View style={{height: vs(100)}} />
    </ScrollView>
  );

  /* ═══════════════════════════════════════════════════════
     REDEEM TAB
     ═══════════════════════════════════════════════════════ */
  const renderRedeemTab = () => (
    <ScrollView style={st.scrollView} contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Balance banner */}
      <View style={[st.card, {backgroundColor: Colors.primary, flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}]}>
        <View>
          <AppText variant="small" style={{color: 'rgba(255,255,255,0.6)'}}>Available Balance</AppText>
          <AppText style={{color: GOLD, fontSize: ms(24), fontWeight: '800'}}>{coins.toLocaleString()} coins</AppText>
        </View>
        <AppText style={{fontSize: ms(32)}}>{'🪙'}</AppText>
      </View>

      {REWARD_CATEGORIES.map(cat => {
        const items = REWARDS_LIST.filter(r => r.cat === cat.key);
        if (!items.length) return null;
        return (
          <View key={cat.key}>
            <AppText variant="small" color={Colors.textTertiary} style={st.sectionLabel}>{cat.label.toUpperCase()}</AppText>
            {items.map(rw => (
              <View key={rw.id} style={st.card}>
                <View style={st.cardTopRow}>
                  <View style={[st.rewardIco, {backgroundColor: rw.col + '18'}]}>
                    <AppText style={{fontSize: ms(24)}}>{rw.ico}</AppText>
                  </View>
                  <View style={{flex: 1}}>
                    <AppText variant="bodyBold">{rw.name}</AppText>
                    <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{rw.desc}</AppText>
                  </View>
                </View>
                <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginTop: vs(10)}}>
                  <AppText variant="bodyBold" style={{color: GOLD}}>{rw.cost} coins</AppText>
                  <TouchableOpacity
                    style={[st.redeemBtn, coins < rw.cost && {opacity: 0.4}]}
                    activeOpacity={0.7}
                    onPress={() => setShowRedeem(rw)}>
                    <AppText variant="small" style={{color: Colors.white, fontWeight: '700'}}>Redeem</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            ))}
          </View>
        );
      })}
      <View style={{height: vs(100)}} />
    </ScrollView>
  );

  /* ═══════════════════════════════════════════════════════
     BILLING TAB
     ═══════════════════════════════════════════════════════ */
  const renderBillingTab = () => (
    <ScrollView style={st.scrollView} contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Current plan info */}
      <View style={[st.card, {backgroundColor: Colors.primary}]}>
        <AppText variant="small" style={{color: 'rgba(255,255,255,0.6)'}}>Current Plan</AppText>
        <AppText style={{color: Colors.white, fontSize: ms(22), fontWeight: '800', marginTop: vs(2)}}>Pro Monthly</AppText>
        <AppText variant="small" style={{color: 'rgba(255,255,255,0.6)', marginTop: vs(4)}}>
          Next billing: Apr 1, 2026 {'\u00B7'} {'\u20B9'}299
        </AppText>
      </View>

      {/* Plan cards */}
      <AppText variant="small" color={Colors.textTertiary} style={st.sectionLabel}>PLANS</AppText>
      {BILLING_PLANS.map(plan => (
        <View key={plan.key} style={st.card}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(6)}}>
            <AppText variant="bodyBold" style={{fontSize: ms(16)}}>{plan.name}</AppText>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8)}}>
              {plan.tag && (
                <View style={[st.planTag, plan.tag === 'current' && {backgroundColor: Colors.primary + '18'}, plan.tag === 'best value' && {backgroundColor: GOLD + '18'}, plan.tag === 'new' && {backgroundColor: '#8b5cf6' + '18'}]}>
                  <AppText variant="small" style={{fontSize: ms(10), fontWeight: '700', color: plan.tag === 'current' ? Colors.primary : plan.tag === 'best value' ? GOLD : '#8b5cf6'}}>
                    {plan.tag.toUpperCase()}
                  </AppText>
                </View>
              )}
              <AppText variant="bodyBold" style={{color: Colors.primary}}>{plan.price}</AppText>
            </View>
          </View>
          {plan.features.map((f, i) => (
            <AppText key={i} variant="small" color={Colors.textSecondary} style={{marginBottom: vs(3), marginLeft: s(4)}}>
              {'\u2713'} {f}
            </AppText>
          ))}
          {plan.tag !== 'current' && (
            <TouchableOpacity style={[st.switchBtn, plan.tag === 'best value' && {backgroundColor: GOLD}]} activeOpacity={0.7}>
              <AppText variant="small" style={{color: Colors.white, fontWeight: '700'}}>Switch to {plan.name}</AppText>
            </TouchableOpacity>
          )}
        </View>
      ))}

      {/* Payment method */}
      <View style={st.card}>
        <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>Payment Method</AppText>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
          <View style={[st.rewardIco, {backgroundColor: '#3b82f6' + '18'}]}>
            <AppText style={{fontSize: ms(20)}}>{'💳'}</AppText>
          </View>
          <View style={{flex: 1}}>
            <AppText variant="body">HDFC Visa ending 4291</AppText>
            <AppText variant="small" color={Colors.textTertiary}>Expires 08/2028</AppText>
          </View>
          <TouchableOpacity activeOpacity={0.7}>
            <AppText variant="small" style={{color: Colors.primary, fontWeight: '700'}}>Change</AppText>
          </TouchableOpacity>
        </View>
      </View>
      <View style={{height: vs(100)}} />
    </ScrollView>
  );

  /* ═══════════════════════════════════════════════════════
     HISTORY TAB
     ═══════════════════════════════════════════════════════ */
  const renderHistoryTab = () => {
    const earned = COIN_HISTORY.filter(h => h.amt.startsWith('+')).reduce((s, h) => s + parseInt(h.amt), 0);
    const redeemed = COIN_HISTORY.filter(h => h.amt.startsWith('-')).reduce((s, h) => s + Math.abs(parseInt(h.amt)), 0);

    return (
      <ScrollView style={st.scrollView} contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Summary */}
        <View style={st.statsRow}>
          {[
            {label: 'Balance', val: coins, col: GOLD},
            {label: 'Earned', val: earned, col: '#22c55e'},
            {label: 'Redeemed', val: redeemed, col: '#f43f5e'},
          ].map((item, i) => (
            <View key={i} style={[st.statBox, {backgroundColor: item.col + '12'}]}>
              <AppText style={{color: item.col, fontSize: ms(20), fontWeight: '800'}}>{item.val}</AppText>
              <AppText variant="small" color={Colors.textSecondary}>{item.label}</AppText>
            </View>
          ))}
        </View>

        {/* History list */}
        <AppText variant="small" color={Colors.textTertiary} style={st.sectionLabel}>TRANSACTION HISTORY</AppText>
        {COIN_HISTORY.map((h, i) => (
          <View key={i} style={st.historyItem}>
            <View style={[st.histDot, {backgroundColor: h.col}]} />
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" style={{fontSize: ms(13)}}>{h.ico} {h.label}</AppText>
              <AppText variant="small" color={Colors.textSecondary}>{h.desc}</AppText>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <AppText variant="bodyBold" style={{color: h.amt.startsWith('+') ? '#22c55e' : '#f43f5e', fontSize: ms(14)}}>
                {h.amt}
              </AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(10)}}>{h.date}</AppText>
            </View>
          </View>
        ))}
        <View style={{height: vs(100)}} />
      </ScrollView>
    );
  };

  /* ═══════════════════════════════════════════════════════
     TAB CONTENT SWITCH
     ═══════════════════════════════════════════════════════ */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'ref': return renderReferralsTab();
      case 'rewards': return renderRedeemTab();
      case 'billing': return renderBillingTab();
      case 'history': return renderHistoryTab();
      default: return null;
    }
  };

  /* ═══════════════════════════════════════════════════════
     SHARE MODAL (bottom sheet)
     ═══════════════════════════════════════════════════════ */
  const renderShareModal = () => (
    <Modal visible={showShare} animationType="slide" transparent onRequestClose={() => setShowShare(false)}>
      <View style={st.sheetOverlay}>
        <TouchableOpacity style={st.sheetBackdrop} activeOpacity={1} onPress={() => setShowShare(false)} />
        <View style={[st.sheetContainer, {paddingBottom: Math.max(insets.bottom, vs(20))}]}>
          <View style={st.dragHandle} />
          <AppText variant="bodyBold" style={{fontSize: ms(18), marginBottom: vs(4)}}>Share Your Referral</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(14)}}>
            Invite friends and earn TrustCoins together
          </AppText>

          {/* Code */}
          <View style={st.codeBox}>
            <AppText style={{fontFamily: 'monospace', fontSize: ms(22), fontWeight: '800', letterSpacing: 3}}>PRIYA84</AppText>
          </View>
          <TouchableOpacity style={st.copyBtn} activeOpacity={0.7}>
            <AppText variant="bodyBold" style={{color: Colors.white}}>Copy Code</AppText>
          </TouchableOpacity>

          {/* Share grid */}
          <View style={[st.shareRow, {marginTop: vs(16)}]}>
            {SHARE_OPTIONS.map(opt => (
              <TouchableOpacity key={opt.key} style={st.shareItem} activeOpacity={0.7}>
                <AppText style={{fontSize: ms(26)}}>{opt.ico}</AppText>
                <AppText variant="small" style={{fontSize: ms(10), marginTop: vs(3)}}>{opt.label}</AppText>
              </TouchableOpacity>
            ))}
          </View>

          {/* How it works */}
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(16), marginBottom: vs(6)}}>HOW IT WORKS</AppText>
          {['Share your code with friends', 'They sign up using your code', 'You both earn TrustCoins on milestones'].map((t, i) => (
            <AppText key={i} variant="small" color={Colors.textSecondary} style={{marginBottom: vs(3)}}>
              {i + 1}. {t}
            </AppText>
          ))}
        </View>
      </View>
    </Modal>
  );

  /* ═══════════════════════════════════════════════════════
     REDEEM MODAL (bottom sheet)
     ═══════════════════════════════════════════════════════ */
  const renderRedeemModal = () => {
    if (!showRedeem) return null;
    const rw = showRedeem;
    const canAfford = coins >= rw.cost;
    return (
      <Modal visible={!!showRedeem} animationType="slide" transparent onRequestClose={() => setShowRedeem(null)}>
        <View style={st.sheetOverlay}>
          <TouchableOpacity style={st.sheetBackdrop} activeOpacity={1} onPress={() => setShowRedeem(null)} />
          <View style={[st.sheetContainer, {paddingBottom: Math.max(insets.bottom, vs(20))}]}>
            <View style={st.dragHandle} />
            <View style={{alignItems: 'center', marginBottom: vs(12)}}>
              <View style={[st.rewardIcoBig, {backgroundColor: rw.col + '18'}]}>
                <AppText style={{fontSize: ms(36)}}>{rw.ico}</AppText>
              </View>
              <AppText variant="bodyBold" style={{fontSize: ms(18), marginTop: vs(8)}}>{rw.name}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center', marginTop: vs(4)}}>{rw.desc}</AppText>
            </View>

            <View style={st.costRow}>
              <View style={{flex: 1}}>
                <AppText variant="small" color={Colors.textTertiary}>Cost</AppText>
                <AppText variant="bodyBold" style={{color: GOLD, fontSize: ms(18)}}>{rw.cost} coins</AppText>
              </View>
              <View style={{flex: 1, alignItems: 'flex-end'}}>
                <AppText variant="small" color={Colors.textTertiary}>Your Balance</AppText>
                <AppText variant="bodyBold" style={{color: canAfford ? '#22c55e' : '#f43f5e', fontSize: ms(18)}}>{coins}</AppText>
              </View>
            </View>

            {!canAfford && (
              <AppText variant="small" style={{color: '#f43f5e', textAlign: 'center', marginTop: vs(6)}}>
                You need {rw.cost - coins} more coins to redeem this reward.
              </AppText>
            )}

            <View style={st.sheetBtnRow}>
              <TouchableOpacity style={st.cancelBtn} activeOpacity={0.7} onPress={() => setShowRedeem(null)}>
                <AppText variant="bodyBold" style={{color: Colors.textSecondary}}>Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[st.confirmBtn, !canAfford && {opacity: 0.4}]}
                activeOpacity={0.7}
                disabled={!canAfford}>
                <AppText variant="bodyBold" style={{color: Colors.white}}>Redeem</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  /* ═══════════════════════════════════════════════════════
     REF DETAIL MODAL (bottom sheet)
     ═══════════════════════════════════════════════════════ */
  const renderRefDetailModal = () => {
    if (!showRefDetail) return null;
    const ref = showRefDetail;
    return (
      <Modal visible={!!showRefDetail} animationType="slide" transparent onRequestClose={() => setShowRefDetail(null)}>
        <View style={st.sheetOverlay}>
          <TouchableOpacity style={st.sheetBackdrop} activeOpacity={1} onPress={() => setShowRefDetail(null)} />
          <View style={[st.sheetContainer, {paddingBottom: Math.max(insets.bottom, vs(20))}]}>
            <View style={st.dragHandle} />
            <View style={{alignItems: 'center', marginBottom: vs(12)}}>
              <AppText style={{fontSize: ms(40)}}>{ref.ico}</AppText>
              <AppText variant="bodyBold" style={{fontSize: ms(18), marginTop: vs(6)}}>{ref.name}</AppText>
              <View style={[st.statusBadge, {backgroundColor: (STATUS_COL[ref.status] || '#999') + '18', marginTop: vs(6)}]}>
                <View style={[st.statusDot, {backgroundColor: STATUS_COL[ref.status] || '#999'}]} />
                <AppText variant="small" style={{color: STATUS_COL[ref.status] || '#999', fontSize: ms(11), fontWeight: '600'}}>
                  {ref.status}
                </AppText>
              </View>
            </View>

            {[
              {label: 'Plan', value: ref.plan},
              {label: 'Joined', value: ref.joined},
              {label: 'Milestone', value: ref.milestone},
              {label: 'Earnings', value: `+${ref.earnings} coins`},
            ].map((row, i) => (
              <View key={i} style={st.detailRow}>
                <AppText variant="small" color={Colors.textTertiary} style={{width: s(90)}}>{row.label}</AppText>
                <AppText variant="body" style={{flex: 1}}>{row.value}</AppText>
              </View>
            ))}

            <View style={st.statusMsg}>
              <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center'}}>
                {ref.status === 'active'
                  ? 'This referral is actively using TrustLife. You earn coins on their milestones.'
                  : ref.status === 'pending'
                  ? 'Invite sent. You will earn coins once they sign up.'
                  : 'This user signed up via your link. Upgrade milestones will earn more coins.'}
              </AppText>
            </View>

            <TouchableOpacity style={st.closeBtn} activeOpacity={0.7} onPress={() => setShowRefDetail(null)}>
              <AppText variant="bodyBold" style={{color: Colors.white}}>Close</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      {renderHeader()}
      {renderTabBar()}
      <View style={st.content}>{renderTabContent()}</View>
      {renderShareModal()}
      {renderRedeemModal()}
      {renderRefDetailModal()}
    </View>
  );
};

/* ── STYLES ──────────────────────────────────────────── */
const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  scrollView: {flex: 1},
  scrollContent: {padding: s(14), paddingBottom: vs(40)},

  /* Header */
  header: {backgroundColor: Colors.primary, paddingBottom: vs(16), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(12)},
  backBtn: {paddingVertical: vs(4), paddingRight: s(12)},
  backText: {color: Colors.white, fontSize: ms(15)},
  pillBadge: {paddingHorizontal: s(14), paddingVertical: vs(6), borderRadius: ms(20), backgroundColor: 'rgba(93,202,165,0.18)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)'},
  pillBadgeText: {color: Colors.lightGreen, fontSize: ms(12), fontWeight: '600'},
  headerTitle: {color: Colors.white, fontSize: ms(24), fontWeight: '700', marginBottom: vs(4)},
  headerSubtitle: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},

  /* Tab bar */
  tabBar: {flexDirection: 'row', backgroundColor: Colors.white, borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: Colors.borderLight},
  tab: {flex: 1, alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 2, borderBottomColor: 'transparent'},
  tabActive: {borderBottomColor: Colors.primary},
  tabLabel: {fontSize: ms(11), color: Colors.textTertiary, fontWeight: '500'},
  tabLabelActive: {color: Colors.primary, fontWeight: '700'},

  content: {flex: 1},

  /* Hero */
  heroStats: {flexDirection: 'row', justifyContent: 'space-around', marginTop: vs(14)},
  heroStatBox: {alignItems: 'center'},

  /* Stats */
  statsRow: {flexDirection: 'row', gap: s(8), marginBottom: vs(14)},
  statBox: {flex: 1, borderRadius: ms(12), padding: s(10), alignItems: 'center'},

  /* Section */
  sectionLabel: {fontSize: ms(11), fontWeight: '700', letterSpacing: 0.5, marginBottom: vs(10), marginTop: vs(4)},

  /* Card */
  card: {backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14), marginBottom: vs(12)},
  cardTopRow: {flexDirection: 'row', alignItems: 'center', gap: s(10)},

  /* Avatar */
  avatar: {width: s(42), height: s(42), borderRadius: ms(21), backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center'},

  /* Badges */
  planBadge: {paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(8)},
  planTag: {paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(8)},
  statusBadge: {flexDirection: 'row', alignItems: 'center', gap: s(5), paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(8)},
  statusDot: {width: s(6), height: s(6), borderRadius: ms(3)},

  /* Progress */
  progressBar: {height: vs(6), backgroundColor: Colors.borderLight, borderRadius: ms(3), marginTop: vs(10), overflow: 'hidden'},
  progressFill: {height: '100%', borderRadius: ms(3)},

  /* Buttons */
  copyBtn: {backgroundColor: Colors.primary, borderRadius: ms(10), paddingVertical: vs(10), alignItems: 'center'},
  redeemBtn: {backgroundColor: Colors.primary, borderRadius: ms(8), paddingHorizontal: s(16), paddingVertical: vs(7)},
  switchBtn: {backgroundColor: Colors.primary, borderRadius: ms(10), paddingVertical: vs(9), alignItems: 'center', marginTop: vs(10)},
  closeBtn: {backgroundColor: Colors.primary, borderRadius: ms(10), paddingVertical: vs(12), alignItems: 'center', marginTop: vs(12)},

  /* Share */
  shareRow: {flexDirection: 'row', justifyContent: 'space-around'},
  shareItem: {alignItems: 'center', width: s(56)},

  /* Reward icon */
  rewardIco: {width: s(48), height: s(48), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
  rewardIcoBig: {width: s(64), height: s(64), borderRadius: ms(16), alignItems: 'center', justifyContent: 'center'},

  /* History */
  historyItem: {flexDirection: 'row', alignItems: 'center', gap: s(10), backgroundColor: Colors.white, borderRadius: ms(12), padding: s(12), marginBottom: vs(8)},
  histDot: {width: s(8), height: s(8), borderRadius: ms(4)},

  /* Code box */
  codeBox: {backgroundColor: Colors.background, borderRadius: ms(10), padding: s(14), alignItems: 'center', marginBottom: vs(10)},

  /* Cost row */
  costRow: {flexDirection: 'row', backgroundColor: Colors.background, borderRadius: ms(10), padding: s(14), marginTop: vs(8)},

  /* Detail row */
  detailRow: {flexDirection: 'row', paddingVertical: vs(8), borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},

  /* Status message */
  statusMsg: {backgroundColor: Colors.background, borderRadius: ms(10), padding: s(12), marginTop: vs(12)},

  /* Sheet */
  sheetOverlay: {flex: 1, justifyContent: 'flex-end'},
  sheetBackdrop: {position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.45)'},
  sheetContainer: {backgroundColor: Colors.white, borderTopLeftRadius: ms(20), borderTopRightRadius: ms(20), padding: s(20), maxHeight: '80%'},
  dragHandle: {width: s(36), height: vs(4), backgroundColor: Colors.borderLight, borderRadius: ms(2), alignSelf: 'center', marginBottom: vs(14)},
  sheetBtnRow: {flexDirection: 'row', gap: s(10), marginTop: vs(16)},
  cancelBtn: {flex: 1, paddingVertical: vs(12), borderRadius: ms(10), borderWidth: 1, borderColor: Colors.borderLight, alignItems: 'center'},
  confirmBtn: {flex: 1, paddingVertical: vs(12), borderRadius: ms(10), backgroundColor: Colors.primary, alignItems: 'center'},
});

export default ReferralScreen;
