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
  REWARDS_TABS,
  CHALLENGES,
  BADGES,
  MILESTONES,
  REDEEMABLE,
  REDEEM_CATEGORIES,
  EARN_HISTORY,
} from '../../constants/healthRewardsData';

const GOLD = '#f0b429';

const STATUS_CFG = {
  active: {label: 'IN PROGRESS', bg: '#3b82f618', col: '#3b82f6'},
  claimable: {label: 'CLAIM NOW', bg: '#f0b42918', col: GOLD},
  done: {label: 'COMPLETED', bg: '#22c55e18', col: '#22c55e'},
  locked: {label: 'LOCKED', bg: '#9ca3af18', col: '#9ca3af'},
};

/* ─── Component ─────────────────────────────────────── */

const HealthRewardsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  /* ── State ──────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState('earn');
  const [coins, setCoins] = useState(1840);
  const [claimedChallenges, setClaimedChallenges] = useState({});
  const [showDetail, setShowDetail] = useState(null);
  const [showRedeem, setShowRedeem] = useState(null);
  const [showHistory, setShowHistory] = useState(false);

  /* ── Helpers ─────────────────────────────────────────── */
  const cStatus = c =>
    (c.status === 'done' || c.status === 'claimable') && claimedChallenges[c.id]
      ? 'done'
      : c.status;

  const activeChallenges = CHALLENGES.filter(c => cStatus(c) === 'active');
  const claimable = [
    ...CHALLENGES.filter(c => cStatus(c) === 'claimable'),
    ...MILESTONES.filter(m => !m.claimed && !claimedChallenges[m.id]),
  ];
  const completedCount = CHALLENGES.filter(c => cStatus(c) === 'done').length;

  const handleClaim = item => {
    setCoins(prev => prev + (item.reward || item.coins));
    setClaimedChallenges(prev => ({...prev, [item.id]: true}));
    setShowDetail(null);
  };

  const handleRedeem = reward => {
    setCoins(prev => prev - reward.cost);
    setShowRedeem(null);
  };

  /* ── Header ──────────────────────────────────────────── */
  const renderHeader = () => (
    <View style={[styles.header, {paddingTop: insets.top}]}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AppText variant="body" style={styles.backText}>
            {'\u2039'} Billing & Rewards
          </AppText>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', gap: s(6)}}>
          <TouchableOpacity style={styles.pillBadge} onPress={() => setActiveTab('redeem')}>
            <AppText variant="small" style={styles.pillBadgeText}>Redeem</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.pillBadge} onPress={() => setShowHistory(true)}>
            <AppText variant="small" style={styles.pillBadgeText}>History</AppText>
          </TouchableOpacity>
        </View>
      </View>
      <AppText variant="screenName" style={styles.headerTitle}>Health Rewards</AppText>
      <AppText variant="caption" style={styles.headerSubtitle}>
        Earn coins for consistency, improvements & loyalty
      </AppText>
    </View>
  );

  /* ── Tab Bar ─────────────────────────────────────────── */
  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {REWARDS_TABS.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            activeOpacity={0.7}
            onPress={() => setActiveTab(tab.key)}>
            <AppText
              variant="small"
              style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  /* ── Progress Bar helper ─────────────────────────────── */
  const ProgressBar = ({pct, color}) => (
    <View style={styles.progressBg}>
      <View style={[styles.progressFill, {width: `${Math.min(pct, 100)}%`, backgroundColor: color}]} />
    </View>
  );

  /* ═══════════════════════════════════════════════════════
     EARN TAB
     ═══════════════════════════════════════════════════════ */
  const renderEarnTab = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Hero balance card */}
      <View style={styles.heroCard}>
        <AppText variant="small" style={{color: 'rgba(255,255,255,0.6)', marginBottom: vs(2)}}>Your balance</AppText>
        <AppText style={styles.heroCoins}>{coins} TrustCoins</AppText>
        <AppText variant="small" style={{color: 'rgba(255,255,255,0.5)', marginBottom: vs(10)}}>
          = {'\u20B9'}{Math.floor(coins / 10)}
        </AppText>
        <View style={styles.statsRow}>
          <View style={styles.heroStatBox}>
            <AppText style={styles.heroStatNum}>{activeChallenges.length}</AppText>
            <AppText variant="small" style={styles.heroStatLabel}>Active</AppText>
          </View>
          <View style={styles.heroStatBox}>
            <AppText style={styles.heroStatNum}>{claimable.length}</AppText>
            <AppText variant="small" style={styles.heroStatLabel}>Claimable</AppText>
          </View>
          <View style={styles.heroStatBox}>
            <AppText style={styles.heroStatNum}>{completedCount}</AppText>
            <AppText variant="small" style={styles.heroStatLabel}>Completed</AppText>
          </View>
        </View>
      </View>

      {/* Claimable section */}
      {claimable.length > 0 && (
        <>
          <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>CLAIMABLE</AppText>
          <View style={styles.claimableCard}>
            {claimable.map(item => (
              <TouchableOpacity key={item.id} style={styles.claimRow} activeOpacity={0.7} onPress={() => setShowDetail(item)}>
                <AppText style={{fontSize: ms(20)}}>{item.ico}</AppText>
                <View style={{flex: 1, marginLeft: s(10)}}>
                  <AppText variant="bodyBold">{item.name}</AppText>
                  <AppText variant="small" color={Colors.textTertiary}>Tap to claim</AppText>
                </View>
                <TouchableOpacity style={styles.claimChip} activeOpacity={0.8} onPress={() => handleClaim(item)}>
                  <AppText variant="small" style={{color: Colors.white, fontWeight: '700', fontSize: ms(11)}}>CLAIM</AppText>
                </TouchableOpacity>
              </TouchableOpacity>
            ))}
          </View>
        </>
      )}

      {/* In progress */}
      {activeChallenges.length > 0 && (
        <>
          <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>IN PROGRESS</AppText>
          {activeChallenges.map(c => (
            <TouchableOpacity key={c.id} style={styles.card} activeOpacity={0.7} onPress={() => setShowDetail(c)}>
              <View style={styles.cardTopRow}>
                <View style={[styles.iconBox, {backgroundColor: c.col + '18'}]}>
                  <AppText style={styles.iconText}>{c.ico}</AppText>
                </View>
                <View style={{flex: 1}}>
                  <AppText variant="bodyBold">{c.name}</AppText>
                  <AppText variant="small" color={Colors.textSecondary}>{c.desc}</AppText>
                </View>
                <AppText variant="small" style={{color: GOLD, fontWeight: '700'}}>+{c.reward}</AppText>
              </View>
              <View style={{marginTop: vs(8)}}>
                <ProgressBar pct={(c.progress / c.total) * 100} color={c.col} />
                <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
                  {Math.round((c.progress / c.total) * 100)}%
                </AppText>
              </View>
            </TouchableOpacity>
          ))}
        </>
      )}

      {/* Milestones */}
      <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>MILESTONES</AppText>
      {MILESTONES.map(m => {
        const isClaimed = m.claimed || claimedChallenges[m.id];
        return (
          <View key={m.id} style={styles.card}>
            <View style={styles.cardTopRow}>
              <AppText style={{fontSize: ms(20)}}>{m.ico}</AppText>
              <View style={{flex: 1, marginLeft: s(6)}}>
                <AppText variant="bodyBold">{m.name}</AppText>
                <AppText variant="small" color={Colors.textSecondary}>{m.desc}</AppText>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <AppText variant="small" style={{color: GOLD, fontWeight: '700'}}>+{m.coins}</AppText>
                <AppText variant="small" color={isClaimed ? '#22c55e' : Colors.textTertiary}>
                  {isClaimed ? 'Claimed' : 'Pending'}
                </AppText>
              </View>
            </View>
          </View>
        );
      })}
      <View style={{height: vs(100)}} />
    </ScrollView>
  );

  /* ═══════════════════════════════════════════════════════
     CHALLENGES TAB
     ═══════════════════════════════════════════════════════ */
  const renderChallengesTab = () => {
    const cats = ['consistency', 'biomarker', 'loyalty', 'promo'];
    const catLabels = {consistency: 'Consistency', biomarker: 'Biomarker', loyalty: 'Loyalty', promo: 'Promo'};
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {cats.map(cat => {
          const items = CHALLENGES.filter(c => c.cat === cat);
          if (!items.length) return null;
          return (
            <View key={cat}>
              <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>
                {catLabels[cat]?.toUpperCase()}
              </AppText>
              {items.map(c => {
                const st = cStatus(c);
                const cfg = STATUS_CFG[st];
                return (
                  <TouchableOpacity key={c.id} style={styles.card} activeOpacity={0.7} onPress={() => setShowDetail(c)}>
                    <View style={styles.cardTopRow}>
                      <View style={[styles.iconBox, {backgroundColor: c.col + '18'}]}>
                        <AppText style={styles.iconText}>{c.ico}</AppText>
                      </View>
                      <View style={{flex: 1}}>
                        <AppText variant="bodyBold">{c.name}</AppText>
                        <AppText variant="small" color={Colors.textSecondary}>{c.desc}</AppText>
                      </View>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center', marginTop: vs(8), gap: s(8)}}>
                      <View style={[styles.statusChip, {backgroundColor: cfg.bg}]}>
                        <AppText variant="small" style={{color: cfg.col, fontWeight: '700', fontSize: ms(10)}}>
                          {cfg.label}
                        </AppText>
                      </View>
                      <AppText variant="small" style={{color: GOLD, fontWeight: '700'}}>+{c.reward}</AppText>
                    </View>
                    {(st === 'active' || st === 'claimable') && (
                      <View style={{marginTop: vs(6)}}>
                        <ProgressBar pct={(c.progress / c.total) * 100} color={c.col} />
                      </View>
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          );
        })}
        <View style={{height: vs(100)}} />
      </ScrollView>
    );
  };

  /* ═══════════════════════════════════════════════════════
     BADGES TAB
     ═══════════════════════════════════════════════════════ */
  const renderBadgesTab = () => {
    const earned = BADGES.filter(b => b.earned).length;
    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Stats card */}
        <View style={styles.card}>
          <AppText variant="bodyBold" style={{marginBottom: vs(6)}}>
            {earned}/{BADGES.length} Badges earned
          </AppText>
          <ProgressBar pct={(earned / BADGES.length) * 100} color={Colors.accent} />
        </View>

        {/* Badge grid */}
        <View style={styles.badgeGrid}>
          {BADGES.map(b => (
            <View key={b.id} style={[styles.badgeCard, !b.earned && {opacity: 0.5}]}>
              <AppText style={{fontSize: ms(28)}}>{b.ico}</AppText>
              <AppText variant="small" style={{fontWeight: '700', textAlign: 'center', marginTop: vs(4)}}>
                {b.name}
              </AppText>
              {b.earned ? (
                <AppText variant="small" color={Colors.accent} style={{fontSize: ms(10), marginTop: vs(2)}}>
                  {b.date}
                </AppText>
              ) : (
                <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(10), marginTop: vs(2)}}>
                  Locked
                </AppText>
              )}
            </View>
          ))}
        </View>

        <View style={[styles.card, {marginTop: vs(10)}]}>
          <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center'}}>
            Badges are permanent and stay on your profile forever.
          </AppText>
        </View>
        <View style={{height: vs(100)}} />
      </ScrollView>
    );
  };

  /* ═══════════════════════════════════════════════════════
     REDEEM TAB
     ═══════════════════════════════════════════════════════ */
  const renderRedeemTab = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Balance banner */}
      <View style={styles.balanceBanner}>
        <AppText variant="small" style={{color: Colors.white}}>Balance</AppText>
        <AppText style={[styles.heroCoins, {fontSize: ms(20)}]}>{coins} TrustCoins</AppText>
      </View>

      {REDEEM_CATEGORIES.map(cat => {
        const items = REDEEMABLE.filter(r => r.cat === cat.key);
        if (!items.length) return null;
        return (
          <View key={cat.key}>
            <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>
              {cat.label.toUpperCase()}
            </AppText>
            {items.map(r => {
              const canAfford = coins >= r.cost;
              return (
                <View key={r.id} style={styles.card}>
                  <View style={styles.cardTopRow}>
                    <View style={[styles.iconBox, {backgroundColor: r.col + '18'}]}>
                      <AppText style={styles.iconText}>{r.ico}</AppText>
                    </View>
                    <View style={{flex: 1}}>
                      <AppText variant="bodyBold">{r.name}</AppText>
                      <AppText variant="small" color={Colors.textSecondary}>{r.desc}</AppText>
                      <AppText variant="small" style={{color: GOLD, fontWeight: '700', marginTop: vs(2)}}>
                        {r.cost} coins
                      </AppText>
                    </View>
                    <TouchableOpacity
                      style={[styles.redeemBtn, !canAfford && {backgroundColor: Colors.borderLight}]}
                      activeOpacity={0.7}
                      onPress={() => canAfford && setShowRedeem(r)}>
                      <AppText variant="small" style={{color: canAfford ? Colors.white : Colors.textTertiary, fontWeight: '700', fontSize: ms(11)}}>
                        {canAfford ? 'Redeem' : `Need ${r.cost - coins} more`}
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              );
            })}
          </View>
        );
      })}
      <View style={{height: vs(100)}} />
    </ScrollView>
  );

  /* ═══════════════════════════════════════════════════════
     TAB CONTENT SWITCH
     ═══════════════════════════════════════════════════════ */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'earn': return renderEarnTab();
      case 'challenges': return renderChallengesTab();
      case 'badges': return renderBadgesTab();
      case 'redeem': return renderRedeemTab();
      default: return null;
    }
  };

  /* ═══════════════════════════════════════════════════════
     CHALLENGE DETAIL MODAL (bottom sheet)
     ═══════════════════════════════════════════════════════ */
  const renderDetailModal = () => {
    if (!showDetail) return null;
    const c = showDetail;
    const st = c.status || (c.claimed || claimedChallenges[c.id] ? 'done' : 'claimable');
    const isClaimable = (st === 'claimable') && !claimedChallenges[c.id];
    const isDone = st === 'done' || claimedChallenges[c.id];
    const pct = c.total ? Math.round((c.progress / c.total) * 100) : (isDone ? 100 : 0);

    return (
      <Modal visible={!!showDetail} animationType="slide" transparent onRequestClose={() => setShowDetail(null)}>
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => setShowDetail(null)} />
          <View style={[styles.sheetContainer, {paddingBottom: Math.max(insets.bottom, vs(20))}]}>
            <View style={styles.dragHandle} />
            <View style={{alignItems: 'center', marginBottom: vs(10)}}>
              <AppText style={{fontSize: ms(36)}}>{c.ico}</AppText>
              <AppText variant="bodyBold" style={{fontSize: ms(17), marginTop: vs(6), textAlign: 'center'}}>
                {c.name}
              </AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center', marginTop: vs(2)}}>
                {c.desc}
              </AppText>
            </View>

            <AppText style={{color: GOLD, fontSize: ms(26), fontWeight: '800', textAlign: 'center', marginBottom: vs(10)}}>
              +{c.reward || c.coins} coins
            </AppText>

            {c.total != null && (
              <View style={{marginBottom: vs(10)}}>
                <ProgressBar pct={pct} color={c.col || Colors.accent} />
                <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(4)}}>
                  {c.progress}/{c.total} ({pct}%)
                </AppText>
              </View>
            )}

            <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center', marginBottom: vs(12)}}>
              {isDone ? 'Challenge completed! Great job.' : isClaimable ? 'Reward is ready to claim!' : 'Keep logging to reach your goal.'}
            </AppText>

            {/* Ayu tip */}
            <View style={styles.ayuTip}>
              <AppText variant="small" style={{color: Colors.primary}}>
                {'\uD83C\uDF3F'} Ayu says: Consistency is the key to long-term health improvement. You're doing great!
              </AppText>
            </View>

            {isClaimable ? (
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8} onPress={() => handleClaim(c)}>
                <AppText variant="bodyBold" style={{color: Colors.white}}>Claim reward</AppText>
              </TouchableOpacity>
            ) : isDone ? (
              <View style={[styles.actionBtn, {backgroundColor: '#22c55e'}]}>
                <AppText variant="bodyBold" style={{color: Colors.white}}>Completed</AppText>
              </View>
            ) : (
              <View style={[styles.actionBtn, {backgroundColor: Colors.borderLight}]}>
                <AppText variant="bodyBold" style={{color: Colors.textSecondary}}>Keep going</AppText>
              </View>
            )}
          </View>
        </View>
      </Modal>
    );
  };

  /* ═══════════════════════════════════════════════════════
     REDEEM CONFIRMATION MODAL (bottom sheet)
     ═══════════════════════════════════════════════════════ */
  const renderRedeemModal = () => {
    if (!showRedeem) return null;
    const r = showRedeem;
    const after = coins - r.cost;

    return (
      <Modal visible={!!showRedeem} animationType="slide" transparent onRequestClose={() => setShowRedeem(null)}>
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => setShowRedeem(null)} />
          <View style={[styles.sheetContainer, {paddingBottom: Math.max(insets.bottom, vs(20))}]}>
            <View style={styles.dragHandle} />
            <View style={{alignItems: 'center', marginBottom: vs(10)}}>
              <AppText style={{fontSize: ms(36)}}>{r.ico}</AppText>
              <AppText variant="bodyBold" style={{fontSize: ms(17), marginTop: vs(6)}}>{r.name}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{r.desc}</AppText>
            </View>

            <View style={styles.costCompare}>
              <View style={{alignItems: 'center'}}>
                <AppText variant="small" color={Colors.textTertiary}>Cost</AppText>
                <AppText style={{color: GOLD, fontSize: ms(20), fontWeight: '800'}}>{r.cost}</AppText>
              </View>
              <AppText variant="body" color={Colors.textTertiary}>vs</AppText>
              <View style={{alignItems: 'center'}}>
                <AppText variant="small" color={Colors.textTertiary}>Balance</AppText>
                <AppText style={{color: Colors.primary, fontSize: ms(20), fontWeight: '800'}}>{coins}</AppText>
              </View>
            </View>

            <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center', marginBottom: vs(14)}}>
              After redemption: {after} TrustCoins
            </AppText>

            <View style={styles.sheetBtnRow}>
              <TouchableOpacity style={styles.cancelBtn} activeOpacity={0.7} onPress={() => setShowRedeem(null)}>
                <AppText variant="bodyBold" style={{color: Colors.textSecondary}}>Cancel</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.8} onPress={() => handleRedeem(r)}>
                <AppText variant="bodyBold" style={{color: Colors.white}}>Redeem</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    );
  };

  /* ═══════════════════════════════════════════════════════
     HISTORY MODAL (bottom sheet)
     ═══════════════════════════════════════════════════════ */
  const renderHistoryModal = () => (
    <Modal visible={showHistory} animationType="slide" transparent onRequestClose={() => setShowHistory(false)}>
      <View style={styles.sheetOverlay}>
        <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => setShowHistory(false)} />
        <View style={[styles.sheetContainer, {paddingBottom: Math.max(insets.bottom, vs(20))}]}>
          <View style={styles.dragHandle} />
          <AppText variant="bodyBold" style={{fontSize: ms(18), marginBottom: vs(12)}}>Coin History</AppText>
          {EARN_HISTORY.map((h, i) => (
            <View key={i} style={styles.historyRow}>
              <View style={[styles.historyDot, {backgroundColor: h.col}]} />
              <View style={{flex: 1, marginLeft: s(10)}}>
                <AppText variant="body" style={{fontSize: ms(13)}}>{h.label}</AppText>
                <AppText variant="small" color={Colors.textTertiary}>{h.date}</AppText>
              </View>
              <AppText variant="bodyBold" style={{color: h.amt.startsWith('+') ? '#22c55e' : '#ef4444'}}>
                {h.amt}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </Modal>
  );

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      {renderHeader()}
      {renderTabBar()}
      <View style={styles.content}>{renderTabContent()}</View>
      {renderDetailModal()}
      {renderRedeemModal()}
      {renderHistoryModal()}
    </View>
  );
};

/* ── STYLES ──────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  scrollView: {flex: 1},
  scrollContent: {padding: s(14), paddingBottom: vs(40)},

  /* Header */
  header: {backgroundColor: Colors.primary, paddingBottom: vs(16), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(12)},
  backBtn: {paddingVertical: vs(4), paddingRight: s(12)},
  backText: {color: Colors.white, fontSize: ms(15)},
  pillBadge: {
    paddingHorizontal: s(14), paddingVertical: vs(6), borderRadius: ms(20),
    backgroundColor: 'rgba(93,202,165,0.18)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)',
  },
  pillBadgeText: {color: Colors.lightGreen, fontSize: ms(12), fontWeight: '600'},
  headerTitle: {color: Colors.white, fontSize: ms(24), fontWeight: '700', marginBottom: vs(4)},
  headerSubtitle: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},

  /* Tab bar */
  tabBar: {
    flexDirection: 'row', backgroundColor: Colors.white,
    borderTopWidth: 0.5, borderBottomWidth: 0.5, borderColor: Colors.borderLight,
  },
  tab: {flex: 1, alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 2, borderBottomColor: 'transparent'},
  tabActive: {borderBottomColor: Colors.primary},
  tabLabel: {fontSize: ms(11), color: Colors.textTertiary, fontWeight: '500'},
  tabLabelActive: {color: Colors.primary, fontWeight: '700'},

  content: {flex: 1},

  /* Hero card */
  heroCard: {
    backgroundColor: Colors.primary, borderRadius: ms(14), padding: s(16),
    marginBottom: vs(14), alignItems: 'center',
  },
  heroCoins: {color: GOLD, fontSize: ms(28), fontWeight: '800'},
  statsRow: {flexDirection: 'row', gap: s(8), width: '100%'},
  heroStatBox: {flex: 1, backgroundColor: 'rgba(255,255,255,0.12)', borderRadius: ms(10), padding: s(8), alignItems: 'center'},
  heroStatNum: {color: Colors.white, fontSize: ms(18), fontWeight: '800'},
  heroStatLabel: {color: 'rgba(255,255,255,0.6)', fontSize: ms(10)},

  /* Section label */
  sectionLabel: {fontSize: ms(11), fontWeight: '700', letterSpacing: 0.5, marginBottom: vs(10), marginTop: vs(4)},

  /* Card */
  card: {backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14), marginBottom: vs(12)},
  cardTopRow: {flexDirection: 'row', alignItems: 'center', gap: s(10)},
  iconBox: {width: ms(40), height: ms(40), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
  iconText: {fontSize: ms(20)},

  /* Claimable */
  claimableCard: {
    backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14),
    marginBottom: vs(12), borderWidth: 1.5, borderColor: GOLD + '50',
  },
  claimRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8)},
  claimChip: {
    backgroundColor: GOLD, borderRadius: ms(5), paddingHorizontal: s(12), paddingVertical: vs(5),
  },

  /* Progress bar */
  progressBg: {height: vs(6), backgroundColor: Colors.borderLight, borderRadius: ms(3), overflow: 'hidden'},
  progressFill: {height: '100%', borderRadius: ms(3)},

  /* Status chip */
  statusChip: {borderRadius: ms(5), paddingHorizontal: s(8), paddingVertical: vs(3)},

  /* Badge grid */
  badgeGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8)},
  badgeCard: {
    width: '47%', backgroundColor: Colors.white, borderRadius: ms(14),
    padding: s(12), alignItems: 'center', marginBottom: vs(4),
  },

  /* Balance banner */
  balanceBanner: {
    backgroundColor: Colors.primary, borderRadius: ms(14), padding: s(14),
    marginBottom: vs(14), alignItems: 'center',
  },

  /* Redeem button */
  redeemBtn: {
    backgroundColor: Colors.accent, borderRadius: ms(5),
    paddingHorizontal: s(12), paddingVertical: vs(5),
  },

  /* Bottom sheet */
  sheetOverlay: {flex: 1, justifyContent: 'flex-end'},
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheetContainer: {
    backgroundColor: Colors.white, borderTopLeftRadius: ms(20), borderTopRightRadius: ms(20),
    padding: s(20), maxHeight: '80%',
  },
  dragHandle: {
    width: s(36), height: vs(4), borderRadius: ms(2),
    backgroundColor: Colors.borderLight, alignSelf: 'center', marginBottom: vs(14),
  },

  /* Ayu tip */
  ayuTip: {
    backgroundColor: '#e6f7f1', borderRadius: ms(12), padding: s(12), marginBottom: vs(14),
  },

  /* Action button */
  actionBtn: {
    backgroundColor: Colors.primary, borderRadius: ms(12),
    paddingVertical: vs(13), alignItems: 'center', flex: 1,
  },

  /* Sheet buttons */
  sheetBtnRow: {flexDirection: 'row', gap: s(10)},
  cancelBtn: {
    flex: 1, borderRadius: ms(12), paddingVertical: vs(13),
    alignItems: 'center', backgroundColor: Colors.background,
  },

  /* Cost compare */
  costCompare: {
    flexDirection: 'row', justifyContent: 'space-around', alignItems: 'center',
    marginBottom: vs(10), paddingVertical: vs(10),
  },

  /* History */
  historyRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8)},
  historyDot: {width: ms(10), height: ms(10), borderRadius: ms(5)},
});

export default HealthRewardsScreen;
