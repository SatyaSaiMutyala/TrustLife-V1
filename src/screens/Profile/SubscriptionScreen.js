import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Alert,
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
  CURRENT_PLAN,
  INVOICES,
  PAYMENT_METHODS,
  USAGE_DATA,
  STORAGE_BREAKDOWN,
  ACCESS_STATS,
  HISTORY_EVENTS,
  PLANS,
  CANCEL_REASONS,
} from '../../constants/subscriptionData';

const TABS = [
  {key: 'overview', label: 'Overview'},
  {key: 'invoices', label: 'Invoices'},
  {key: 'usage', label: 'Usage'},
  {key: 'plans', label: 'Plans'},
];

const YEAR_FILTERS = ['All time', '2026', '2025'];

/* ─── Component ─────────────────────────────────────── */

const SubscriptionScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  /* ── State ──────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState('overview');
  const [yearFilter, setYearFilter] = useState('All time');

  // Invoice detail modal
  const [showInvoiceModal, setShowInvoiceModal] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  // Manage plan modal
  const [showManageModal, setShowManageModal] = useState(false);
  const [managePlanStep, setManagePlanStep] = useState(1);
  const [selectedPlan, setSelectedPlan] = useState(null);

  // Cancel modal
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelStep, setCancelStep] = useState(1);
  const [cancelReason, setCancelReason] = useState(null);

  // Payment method modal
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [paymentMethods, setPaymentMethods] = useState(PAYMENT_METHODS);

  /* ── Helpers ─────────────────────────────────────────── */
  const defaultMethod = paymentMethods.find(m => m.default) || paymentMethods[0];

  const filteredInvoices =
    yearFilter === 'All time'
      ? INVOICES
      : INVOICES.filter(inv => inv.date.includes(yearFilter));

  const invoicesByYear = filteredInvoices.reduce((acc, inv) => {
    const y = inv.date.split(' ').pop();
    if (!acc[y]) acc[y] = [];
    acc[y].push(inv);
    return acc;
  }, {});

  const totalPaid = INVOICES.filter(i => i.status === 'paid').reduce((sum, i) => {
    const num = parseFloat(String(i.amt).replace(/[^\d.]/g, ''));
    return sum + (isNaN(num) ? 0 : num);
  }, 0);

  const paidCount = INVOICES.filter(i => i.status === 'paid').length;

  const openInvoice = inv => {
    setSelectedInvoice(inv);
    setShowInvoiceModal(true);
  };

  const openManage = () => {
    setManagePlanStep(1);
    setSelectedPlan(null);
    setShowManageModal(true);
  };

  const openCancel = () => {
    setCancelStep(1);
    setCancelReason(null);
    setShowCancelModal(true);
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
        <TouchableOpacity style={styles.pillBadge} onPress={openManage}>
          <AppText variant="small" style={styles.pillBadgeText}>Manage plan</AppText>
        </TouchableOpacity>
      </View>
      <AppText variant="screenName" style={styles.headerTitle}>Subscription</AppText>
      <AppText variant="caption" style={styles.headerSubtitle}>
        Billing history, usage & plan management
      </AppText>
    </View>
  );

  /* ── Tab Bar ─────────────────────────────────────────── */
  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {TABS.map(tab => {
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

  /* ── Progress Bar ────────────────────────────────────── */
  const ProgressBar = ({pct, color, unlimited}) => (
    <View style={styles.progressBg}>
      <View
        style={[
          styles.progressFill,
          {
            width: unlimited ? '100%' : `${Math.min(pct, 100)}%`,
            backgroundColor: color,
            opacity: unlimited ? 0.6 : 1,
          },
        ]}
      />
    </View>
  );

  /* ═══════════════════════════════════════════════════════
     OVERVIEW TAB
     ═══════════════════════════════════════════════════════ */
  const renderOverviewTab = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Current Plan Banner */}
      <View style={[styles.card, {backgroundColor: Colors.tealBg}]}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(6)}}>
          <AppText variant="bodyBold" style={{fontSize: ms(17), color: Colors.tealText}}>
            {CURRENT_PLAN.name} Plan
          </AppText>
          <View style={[styles.statusChip, {backgroundColor: Colors.accent + '20'}]}>
            <AppText variant="small" style={{color: Colors.accent, fontWeight: '700', fontSize: ms(10)}}>
              ACTIVE
            </AppText>
          </View>
        </View>
        <AppText variant="body" style={{color: Colors.tealText, marginBottom: vs(2)}}>
          {'\u20B9'}{CURRENT_PLAN.price}/{CURRENT_PLAN.freq}
        </AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(4)}}>
          Renews {CURRENT_PLAN.renewDate} ({CURRENT_PLAN.daysRemaining || 19} days remaining)
        </AppText>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(6), marginTop: vs(6)}}>
          {CURRENT_PLAN.features.map((f, i) => (
            <View key={i} style={styles.featurePill}>
              <AppText variant="small" style={{color: Colors.tealText, fontSize: ms(10)}}>{f}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Next Billing Card */}
      <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>NEXT BILLING</AppText>
      <View style={styles.card}>
        <View style={styles.billingRow}>
          <AppText variant="body" color={Colors.textSecondary}>Next billing date</AppText>
          <AppText variant="bodyBold">15 Apr 2026</AppText>
        </View>
        <View style={styles.billingRow}>
          <AppText variant="body" color={Colors.textSecondary}>Amount due</AppText>
          <AppText variant="bodyBold" style={{color: Colors.accent}}>{'\u20B9'}299.00</AppText>
        </View>
        <View style={styles.billingRow}>
          <AppText variant="body" color={Colors.textSecondary}>GST 18%</AppText>
          <AppText variant="body" color={Colors.textSecondary}>{'\u20B9'}53.82</AppText>
        </View>
        <View style={styles.divider} />
        <View style={styles.billingRow}>
          <AppText variant="bodyBold">Total</AppText>
          <AppText variant="bodyBold" style={{fontSize: ms(15)}}>{'\u20B9'}352.82</AppText>
        </View>
        <View style={{flexDirection: 'row', gap: s(10), marginTop: vs(10)}}>
          <TouchableOpacity
            style={[styles.smallBtn, {backgroundColor: Colors.tealBg}]}
            activeOpacity={0.7}
            onPress={() => setActiveTab('invoices')}>
            <AppText variant="small" style={{color: Colors.tealText, fontWeight: '600'}}>View invoices</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.smallBtn, {backgroundColor: Colors.blueBg}]}
            activeOpacity={0.7}
            onPress={() => setShowPaymentModal(true)}>
            <AppText variant="small" style={{color: Colors.blueText, fontWeight: '600'}}>Payment method</AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Payment Method */}
      <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>PAYMENT METHOD</AppText>
      <View style={styles.card}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
          <View style={{flex: 1}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
              <AppText variant="bodyBold">{defaultMethod.label}</AppText>
              <View style={[styles.statusChip, {backgroundColor: Colors.tealBg}]}>
                <AppText variant="small" style={{color: Colors.accent, fontWeight: '700', fontSize: ms(9)}}>DEFAULT</AppText>
              </View>
            </View>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
              {defaultMethod.type === 'card'
                ? `**** ${defaultMethod.last4}  \u00B7  Exp ${defaultMethod.expires}`
                : `${defaultMethod.handle}  \u00B7  ${defaultMethod.bank}`}
            </AppText>
          </View>
          <TouchableOpacity activeOpacity={0.7} onPress={() => setShowPaymentModal(true)}>
            <AppText variant="body" style={{color: Colors.accent, fontWeight: '600'}}>Edit {'\u203A'}</AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Lifetime Summary */}
      <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>LIFETIME SUMMARY</AppText>
      <View style={styles.gridRow}>
        <View style={[styles.card, styles.gridItem]}>
          <AppText variant="caption" color={Colors.textSecondary}>Total spent</AppText>
          <AppText variant="bodyBold" style={{fontSize: ms(17), marginTop: vs(2)}}>
            {'\u20B9'}{totalPaid.toLocaleString('en-IN', {minimumFractionDigits: 0, maximumFractionDigits: 0})}
          </AppText>
        </View>
        <View style={[styles.card, styles.gridItem]}>
          <AppText variant="caption" color={Colors.textSecondary}>Paid invoices</AppText>
          <AppText variant="bodyBold" style={{fontSize: ms(17), marginTop: vs(2)}}>{paidCount}</AppText>
        </View>
      </View>
      <View style={styles.gridRow}>
        <View style={[styles.card, styles.gridItem]}>
          <AppText variant="caption" color={Colors.textSecondary}>Member since</AppText>
          <AppText variant="bodyBold" style={{fontSize: ms(17), marginTop: vs(2)}}>15 months</AppText>
        </View>
        <View style={[styles.card, styles.gridItem]}>
          <AppText variant="caption" color={Colors.textSecondary}>Plan upgrades</AppText>
          <AppText variant="bodyBold" style={{fontSize: ms(17), marginTop: vs(2)}}>3x</AppText>
        </View>
      </View>

      {/* Account History Timeline */}
      <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>ACCOUNT HISTORY</AppText>
      <View style={styles.card}>
        {HISTORY_EVENTS.map((evt, i) => (
          <View key={i} style={styles.timelineRow}>
            {/* Vertical line */}
            {i < HISTORY_EVENTS.length - 1 && (
              <View style={styles.timelineLine} />
            )}
            {/* Dot */}
            <View style={[styles.timelineDot, {backgroundColor: evt.color}]} />
            {/* Content */}
            <View style={{flex: 1, marginLeft: s(12), paddingBottom: i < HISTORY_EVENTS.length - 1 ? vs(14) : 0}}>
              <AppText variant="bodyBold" style={{fontSize: ms(13)}}>{evt.head}</AppText>
              <AppText variant="small" color={Colors.textSecondary}>{evt.sub}</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>{evt.date}</AppText>
            </View>
          </View>
        ))}
      </View>

      {/* Manage section */}
      <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>MANAGE</AppText>
      <View style={{flexDirection: 'row', gap: s(10), marginBottom: vs(10)}}>
        <TouchableOpacity
          style={[styles.actionBtn, {backgroundColor: Colors.accent}]}
          activeOpacity={0.8}
          onPress={openManage}>
          <AppText variant="bodyBold" style={{color: Colors.white}}>Change plan</AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, {backgroundColor: Colors.red}]}
          activeOpacity={0.8}
          onPress={openCancel}>
          <AppText variant="bodyBold" style={{color: Colors.white}}>Cancel plan</AppText>
        </TouchableOpacity>
      </View>

      <View style={{height: vs(100)}} />
    </ScrollView>
  );

  /* ═══════════════════════════════════════════════════════
     INVOICES TAB
     ═══════════════════════════════════════════════════════ */
  const renderInvoicesTab = () => {
    const totalFiltered = filteredInvoices.length;
    const totalPaidFiltered = filteredInvoices
      .filter(i => i.status === 'paid')
      .reduce((sum, i) => {
        const num = parseFloat(String(i.amt).replace(/[^\d.]/g, ''));
        return sum + (isNaN(num) ? 0 : num);
      }, 0);
    const successCount = filteredInvoices.filter(i => i.status === 'paid').length;

    return (
      <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
        {/* Year filter pills */}
        <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
          {YEAR_FILTERS.map(yr => {
            const isActive = yearFilter === yr;
            return (
              <TouchableOpacity
                key={yr}
                style={[
                  styles.filterPill,
                  isActive && {backgroundColor: Colors.primary},
                ]}
                activeOpacity={0.7}
                onPress={() => setYearFilter(yr)}>
                <AppText
                  variant="small"
                  style={{
                    color: isActive ? Colors.white : Colors.textSecondary,
                    fontWeight: isActive ? '700' : '500',
                  }}>
                  {yr}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Summary strip */}
        <View style={[styles.card, {flexDirection: 'row'}]}>
          <View style={{flex: 1, alignItems: 'center'}}>
            <AppText variant="bodyBold" style={{fontSize: ms(17)}}>{totalFiltered}</AppText>
            <AppText variant="small" color={Colors.textTertiary}>Total invoices</AppText>
          </View>
          <View style={{width: 1, backgroundColor: Colors.borderLight}} />
          <View style={{flex: 1, alignItems: 'center'}}>
            <AppText variant="bodyBold" style={{fontSize: ms(17)}}>{'\u20B9'}{totalPaidFiltered.toLocaleString('en-IN')}</AppText>
            <AppText variant="small" color={Colors.textTertiary}>Total paid</AppText>
          </View>
          <View style={{width: 1, backgroundColor: Colors.borderLight}} />
          <View style={{flex: 1, alignItems: 'center'}}>
            <AppText variant="bodyBold" style={{fontSize: ms(17), color: Colors.accent}}>{successCount}</AppText>
            <AppText variant="small" color={Colors.textTertiary}>Successful</AppText>
          </View>
        </View>

        {/* Invoices grouped by year */}
        {Object.keys(invoicesByYear)
          .sort((a, b) => b - a)
          .map(year => (
            <View key={year}>
              <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>
                {year}
              </AppText>
              {invoicesByYear[year].map(inv => (
                <TouchableOpacity
                  key={inv.id}
                  style={styles.card}
                  activeOpacity={0.7}
                  onPress={() => openInvoice(inv)}>
                  <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <AppText style={{fontSize: ms(20), marginRight: s(10)}}>
                      {inv.status === 'paid' ? '\uD83E\uDDFE' : '\uD83C\uDF81'}
                    </AppText>
                    <View style={{flex: 1}}>
                      <AppText variant="bodyBold">{inv.plan} Plan</AppText>
                      <AppText variant="small" color={Colors.textSecondary}>{inv.period}</AppText>
                    </View>
                    <View style={{alignItems: 'flex-end'}}>
                      <AppText variant="bodyBold">{inv.amt}</AppText>
                      <AppText variant="small" color={Colors.textTertiary}>{inv.date}</AppText>
                    </View>
                  </View>
                  <View style={{flexDirection: 'row', justifyContent: 'flex-end', marginTop: vs(6)}}>
                    <View
                      style={[
                        styles.statusChip,
                        {
                          backgroundColor: inv.status === 'paid' ? Colors.tealBg : Colors.blueBg,
                        },
                      ]}>
                      <AppText
                        variant="small"
                        style={{
                          color: inv.status === 'paid' ? Colors.accent : Colors.blue,
                          fontWeight: '700',
                          fontSize: ms(10),
                        }}>
                        {inv.status === 'paid' ? 'PAID' : 'FREE'}
                      </AppText>
                    </View>
                  </View>
                </TouchableOpacity>
              ))}
            </View>
          ))}

        <View style={{height: vs(100)}} />
      </ScrollView>
    );
  };

  /* ═══════════════════════════════════════════════════════
     USAGE TAB
     ═══════════════════════════════════════════════════════ */
  const renderUsageTab = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Pro plan info box */}
      <View style={[styles.card, {backgroundColor: Colors.tealBg}]}>
        <AppText variant="bodyBold" style={{color: Colors.tealText, marginBottom: vs(2)}}>
          Pro Plan \u2013 Unlimited Access
        </AppText>
        <AppText variant="small" color={Colors.textSecondary}>
          Most features on the Pro plan are unlimited. Usage metrics below are for informational purposes.
        </AppText>
      </View>

      {/* Usage bars */}
      <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>USAGE THIS CYCLE</AppText>
      {USAGE_DATA.map((item, i) => {
        const isUnlimited = item.max === null;
        const pct = isUnlimited ? 100 : (item.used / item.max) * 100;
        return (
          <View key={i} style={styles.card}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(6)}}>
              <AppText variant="body">{item.label}</AppText>
              <AppText variant="bodyBold" style={{color: item.color}}>
                {isUnlimited ? `${item.used} ${item.unit}` : `${item.used} / ${item.max} ${item.unit}`}
              </AppText>
            </View>
            <ProgressBar pct={pct} color={item.color} unlimited={isUnlimited} />
            {isUnlimited && (
              <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(3)}}>
                Unlimited on Pro
              </AppText>
            )}
          </View>
        );
      })}

      {/* Storage Breakdown */}
      <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>STORAGE BREAKDOWN</AppText>
      <View style={styles.card}>
        {STORAGE_BREAKDOWN.map((item, i) => {
          const maxCount = Math.max(...STORAGE_BREAKDOWN.map(s => s.count));
          const pct = (item.count / maxCount) * 100;
          return (
            <View key={i} style={{marginBottom: i < STORAGE_BREAKDOWN.length - 1 ? vs(10) : 0}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4)}}>
                <AppText variant="body">{item.label}</AppText>
                <AppText variant="bodyBold">{item.count} records</AppText>
              </View>
              <ProgressBar pct={pct} color={item.color} />
            </View>
          );
        })}
      </View>

      {/* Access This Cycle */}
      <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>ACCESS THIS CYCLE</AppText>
      <View style={[styles.card, {flexDirection: 'row'}]}>
        {ACCESS_STATS.map((stat, i) => (
          <React.Fragment key={i}>
            {i > 0 && <View style={{width: 1, backgroundColor: Colors.borderLight}} />}
            <View style={{flex: 1, alignItems: 'center'}}>
              <AppText variant="bodyBold" style={{fontSize: ms(17), color: stat.color}}>{stat.count}</AppText>
              <AppText variant="small" color={Colors.textTertiary}>{stat.label}</AppText>
            </View>
          </React.Fragment>
        ))}
      </View>

      <View style={{height: vs(100)}} />
    </ScrollView>
  );

  /* ═══════════════════════════════════════════════════════
     PLANS TAB
     ═══════════════════════════════════════════════════════ */
  const renderPlansTab = () => (
    <ScrollView style={styles.scrollView} contentContainerStyle={styles.scrollContent} showsVerticalScrollIndicator={false}>
      {/* Info box */}
      <View style={[styles.card, {backgroundColor: Colors.blueBg}]}>
        <AppText variant="bodyBold" style={{color: Colors.blueText, marginBottom: vs(2)}}>
          You're on the Pro plan
        </AppText>
        <AppText variant="small" color={Colors.textSecondary}>
          Switch plans anytime. Pro-rata adjustments will be applied automatically.
        </AppText>
      </View>

      {/* Plan cards */}
      {PLANS.map((plan, i) => (
        <View
          key={i}
          style={[
            styles.card,
            {borderWidth: plan.current ? 1.5 : 0, borderColor: plan.current ? plan.color : 'transparent'},
          ]}>
          {/* Badge */}
          {plan.badge && (
            <View style={[styles.planBadge, {backgroundColor: plan.color + '18'}]}>
              <AppText variant="small" style={{color: plan.color, fontWeight: '700', fontSize: ms(10)}}>
                {plan.badge}
              </AppText>
            </View>
          )}
          {plan.current && !plan.badge && (
            <View style={[styles.planBadge, {backgroundColor: plan.color + '18'}]}>
              <AppText variant="small" style={{color: plan.color, fontWeight: '700', fontSize: ms(10)}}>
                CURRENT
              </AppText>
            </View>
          )}

          <AppText variant="bodyBold" style={{fontSize: ms(17), marginTop: plan.badge || plan.current ? vs(4) : 0}}>
            {plan.name}
          </AppText>
          <View style={{flexDirection: 'row', alignItems: 'baseline', marginTop: vs(2)}}>
            <AppText variant="bodyBold" style={{fontSize: ms(22), color: plan.color}}>
              {plan.price === 0 ? 'Free' : `\u20B9${plan.price}`}
            </AppText>
            {plan.price > 0 && (
              <AppText variant="caption" color={Colors.textSecondary}>/{plan.freq}</AppText>
            )}
          </View>

          {/* Features */}
          <View style={{marginTop: vs(10)}}>
            {plan.features.map((f, j) => (
              <View key={j} style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(4)}}>
                <AppText style={{color: Colors.accent, fontSize: ms(14), marginRight: s(6)}}>
                  {'\u2713'}
                </AppText>
                <AppText variant="body" style={{flex: 1}}>{f}</AppText>
              </View>
            ))}
            {plan.missing.map((f, j) => (
              <View key={`m${j}`} style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(4)}}>
                <AppText style={{color: Colors.red, fontSize: ms(14), marginRight: s(6)}}>
                  {'\u2717'}
                </AppText>
                <AppText variant="body" color={Colors.textTertiary} style={{flex: 1}}>{f}</AppText>
              </View>
            ))}
          </View>

          {/* Button */}
          {plan.current ? (
            <View style={[styles.planBtn, {backgroundColor: Colors.background}]}>
              <AppText variant="bodyBold" color={Colors.textSecondary}>Your current plan</AppText>
            </View>
          ) : (
            <TouchableOpacity
              style={[styles.planBtn, {backgroundColor: plan.bg}]}
              activeOpacity={0.7}
              onPress={() => {
                setSelectedPlan(plan);
                setManagePlanStep(2);
                setShowManageModal(true);
              }}>
              <AppText variant="bodyBold" style={{color: plan.color}}>
                Switch to {plan.name}
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      ))}

      <View style={{height: vs(100)}} />
    </ScrollView>
  );

  /* ── Tab Content Switch ──────────────────────────────── */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview': return renderOverviewTab();
      case 'invoices': return renderInvoicesTab();
      case 'usage': return renderUsageTab();
      case 'plans': return renderPlansTab();
      default: return null;
    }
  };

  /* ═══════════════════════════════════════════════════════
     MODAL 1 \u2013 Invoice Detail
     ═══════════════════════════════════════════════════════ */
  const renderInvoiceModal = () => {
    if (!selectedInvoice) return null;
    const inv = selectedInvoice;
    const baseAmt = parseFloat(String(inv.amt).replace(/[^\d.]/g, ''));
    const gstAmt = parseFloat(String(inv.gst).replace(/[^\d.]/g, ''));
    const totalAmt = baseAmt + gstAmt;

    return (
      <Modal visible={showInvoiceModal} animationType="slide" transparent onRequestClose={() => setShowInvoiceModal(false)}>
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => setShowInvoiceModal(false)} />
          <View style={[styles.sheetContainer, {paddingBottom: Math.max(insets.bottom, vs(20))}]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.dragHandle} />

              {/* Title row */}
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(14)}}>
                <AppText variant="bodyBold" style={{fontSize: ms(18)}}>Invoice</AppText>
                <TouchableOpacity activeOpacity={0.7} onPress={() => Alert.alert('Download', 'PDF download will be available soon.')}>
                  <AppText variant="body" style={{color: Colors.accent, fontWeight: '600'}}>
                    {'\u2193'} Download PDF
                  </AppText>
                </TouchableOpacity>
              </View>

              {/* Receipt card */}
              <View style={[styles.card, {backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderLight}]}>
                <AppText variant="bodyBold" style={{fontSize: ms(14), marginBottom: vs(2)}}>
                  TrustLife Health Technologies Pvt Ltd
                </AppText>
                <AppText variant="small" color={Colors.textTertiary}>CIN: U74999KA2024PTC123456</AppText>
                <AppText variant="small" color={Colors.textTertiary}>GSTIN: 29AABCT1234F1Z5</AppText>
                <AppText variant="small" color={Colors.textTertiary} style={{marginBottom: vs(10)}}>
                  #42, 3rd Floor, HSR Layout, Bengaluru 560102
                </AppText>

                <View style={styles.divider} />

                <View style={styles.billingRow}>
                  <AppText variant="caption" color={Colors.textSecondary}>Invoice ID</AppText>
                  <AppText variant="body">{inv.id}</AppText>
                </View>
                <View style={styles.billingRow}>
                  <AppText variant="caption" color={Colors.textSecondary}>Date</AppText>
                  <AppText variant="body">{inv.date}</AppText>
                </View>
                <View style={styles.billingRow}>
                  <AppText variant="caption" color={Colors.textSecondary}>Period</AppText>
                  <AppText variant="body">{inv.period}</AppText>
                </View>
                <View style={styles.billingRow}>
                  <AppText variant="caption" color={Colors.textSecondary}>Customer</AppText>
                  <AppText variant="body">Priya Sharma</AppText>
                </View>

                <View style={styles.divider} />

                <View style={styles.billingRow}>
                  <AppText variant="body">{inv.plan} Plan (base)</AppText>
                  <AppText variant="body">{inv.amt}</AppText>
                </View>
                <View style={styles.billingRow}>
                  <AppText variant="body" color={Colors.textSecondary}>GST @18%</AppText>
                  <AppText variant="body" color={Colors.textSecondary}>{inv.gst}</AppText>
                </View>
                {inv.coinNote && (
                  <View style={styles.billingRow}>
                    <AppText variant="small" color={Colors.accent} style={{flex: 1}}>{inv.coinNote}</AppText>
                  </View>
                )}
                <View style={styles.divider} />
                <View style={styles.billingRow}>
                  <AppText variant="bodyBold">Total</AppText>
                  <AppText variant="bodyBold" style={{fontSize: ms(15)}}>
                    {'\u20B9'}{isNaN(totalAmt) ? '0.00' : totalAmt.toFixed(2)}
                  </AppText>
                </View>

                <View style={styles.divider} />

                <View style={styles.billingRow}>
                  <AppText variant="caption" color={Colors.textSecondary}>Payment method</AppText>
                  <AppText variant="body">{inv.method}</AppText>
                </View>
                <View style={styles.billingRow}>
                  <AppText variant="caption" color={Colors.textSecondary}>Status</AppText>
                  <View style={[styles.statusChip, {backgroundColor: inv.status === 'paid' ? Colors.tealBg : Colors.blueBg}]}>
                    <AppText variant="small" style={{color: inv.status === 'paid' ? Colors.accent : Colors.blue, fontWeight: '700', fontSize: ms(10)}}>
                      {inv.status === 'paid' ? 'PAID' : 'FREE'}
                    </AppText>
                  </View>
                </View>
              </View>

              {/* Buttons */}
              <View style={{flexDirection: 'row', gap: s(10), marginTop: vs(14)}}>
                <TouchableOpacity
                  style={[styles.actionBtn, {backgroundColor: Colors.background}]}
                  activeOpacity={0.7}
                  onPress={() => Alert.alert('Share', 'Invoice sharing will be available soon.')}>
                  <AppText variant="bodyBold" color={Colors.textSecondary}>Share</AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[styles.actionBtn, {backgroundColor: Colors.primary}]}
                  activeOpacity={0.8}
                  onPress={() => setShowInvoiceModal(false)}>
                  <AppText variant="bodyBold" style={{color: Colors.white}}>Close</AppText>
                </TouchableOpacity>
              </View>
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  /* ═══════════════════════════════════════════════════════
     MODAL 2 \u2013 Manage Plan (multi-step)
     ═══════════════════════════════════════════════════════ */
  const renderManageModal = () => {
    const currentPlan = PLANS.find(p => p.current);

    const renderStep1 = () => (
      <>
        <AppText variant="bodyBold" style={{fontSize: ms(18), marginBottom: vs(12)}}>Choose a plan</AppText>
        {PLANS.map((plan, i) => (
          <View key={i} style={[styles.card, {borderWidth: plan.current ? 1 : 0, borderColor: plan.color}]}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold">{plan.name}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  {plan.price === 0 ? 'Free' : `\u20B9${plan.price}/${plan.freq}`}
                </AppText>
              </View>
              {plan.current ? (
                <View style={[styles.statusChip, {backgroundColor: plan.color + '18'}]}>
                  <AppText variant="small" style={{color: plan.color, fontWeight: '700', fontSize: ms(10)}}>CURRENT</AppText>
                </View>
              ) : (
                <TouchableOpacity
                  style={[styles.smallBtn, {backgroundColor: plan.bg}]}
                  activeOpacity={0.7}
                  onPress={() => {
                    setSelectedPlan(plan);
                    setManagePlanStep(2);
                  }}>
                  <AppText variant="small" style={{color: plan.color, fontWeight: '600'}}>Switch</AppText>
                </TouchableOpacity>
              )}
            </View>
          </View>
        ))}
      </>
    );

    const renderStep2 = () => {
      if (!selectedPlan || !currentPlan) return null;
      const isUpgrade = selectedPlan.price > currentPlan.price;
      const diff = Math.abs(selectedPlan.price - currentPlan.price);
      const proRataCredit = Math.round((currentPlan.price / 30) * (CURRENT_PLAN.daysRemaining || 19));
      const dueNow = isUpgrade ? Math.max(0, diff - proRataCredit) : 0;
      const gst = Math.round(dueNow * 0.18);

      return (
        <>
          <AppText variant="bodyBold" style={{fontSize: ms(18), marginBottom: vs(12)}}>Review change</AppText>

          {/* From → To */}
          <View style={[styles.card, {flexDirection: 'row', alignItems: 'center'}]}>
            <View style={{flex: 1, alignItems: 'center'}}>
              <AppText variant="small" color={Colors.textTertiary}>From</AppText>
              <AppText variant="bodyBold" style={{fontSize: ms(15)}}>{currentPlan.name}</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                {'\u20B9'}{currentPlan.price}/{currentPlan.freq}
              </AppText>
            </View>
            <AppText variant="body" style={{fontSize: ms(20), color: Colors.textTertiary}}>{'\u2192'}</AppText>
            <View style={{flex: 1, alignItems: 'center'}}>
              <AppText variant="small" color={Colors.textTertiary}>To</AppText>
              <AppText variant="bodyBold" style={{fontSize: ms(15), color: selectedPlan.color}}>{selectedPlan.name}</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                {selectedPlan.price === 0 ? 'Free' : `\u20B9${selectedPlan.price}/${selectedPlan.freq}`}
              </AppText>
            </View>
          </View>

          {/* Cost breakdown */}
          <View style={styles.card}>
            <View style={styles.billingRow}>
              <AppText variant="body" color={Colors.textSecondary}>Pro-rata credit</AppText>
              <AppText variant="body" style={{color: Colors.accent}}>-{'\u20B9'}{proRataCredit}</AppText>
            </View>
            {isUpgrade && (
              <>
                <View style={styles.billingRow}>
                  <AppText variant="body" color={Colors.textSecondary}>Price difference</AppText>
                  <AppText variant="body">{'\u20B9'}{diff}</AppText>
                </View>
                <View style={styles.billingRow}>
                  <AppText variant="body" color={Colors.textSecondary}>GST 18%</AppText>
                  <AppText variant="body" color={Colors.textSecondary}>{'\u20B9'}{gst}</AppText>
                </View>
                <View style={styles.divider} />
                <View style={styles.billingRow}>
                  <AppText variant="bodyBold">Due now</AppText>
                  <AppText variant="bodyBold" style={{fontSize: ms(15)}}>{'\u20B9'}{dueNow + gst}</AppText>
                </View>
              </>
            )}
            {!isUpgrade && (
              <>
                <View style={styles.divider} />
                <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center', marginTop: vs(6)}}>
                  Your credit will be applied to future billing cycles.
                </AppText>
              </>
            )}
          </View>

          <View style={{flexDirection: 'row', gap: s(10)}}>
            <TouchableOpacity
              style={[styles.actionBtn, {backgroundColor: Colors.background}]}
              activeOpacity={0.7}
              onPress={() => setManagePlanStep(1)}>
              <AppText variant="bodyBold" color={Colors.textSecondary}>Back</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, {backgroundColor: Colors.primary}]}
              activeOpacity={0.8}
              onPress={() => setManagePlanStep(3)}>
              <AppText variant="bodyBold" style={{color: Colors.white}}>Continue</AppText>
            </TouchableOpacity>
          </View>
        </>
      );
    };

    const renderStep3 = () => {
      if (!selectedPlan || !currentPlan) return null;
      const isUpgrade = selectedPlan.price > currentPlan.price;
      const diff = Math.abs(selectedPlan.price - currentPlan.price);
      const proRataCredit = Math.round((currentPlan.price / 30) * (CURRENT_PLAN.daysRemaining || 19));
      const dueNow = isUpgrade ? Math.max(0, diff - proRataCredit) : 0;
      const gst = Math.round(dueNow * 0.18);

      return (
        <>
          <AppText variant="bodyBold" style={{fontSize: ms(18), marginBottom: vs(12)}}>Confirm switch</AppText>

          {/* Order summary */}
          <View style={styles.card}>
            <AppText variant="small" color={Colors.textTertiary} style={{marginBottom: vs(8)}}>ORDER SUMMARY</AppText>
            <View style={styles.billingRow}>
              <AppText variant="body">New plan</AppText>
              <AppText variant="bodyBold">{selectedPlan.name}</AppText>
            </View>
            <View style={styles.billingRow}>
              <AppText variant="body">Pricing</AppText>
              <AppText variant="body">
                {selectedPlan.price === 0 ? 'Free' : `\u20B9${selectedPlan.price}/${selectedPlan.freq}`}
              </AppText>
            </View>
            {isUpgrade && (
              <>
                <View style={styles.billingRow}>
                  <AppText variant="body">Due now (incl. GST)</AppText>
                  <AppText variant="bodyBold" style={{color: Colors.accent}}>{'\u20B9'}{dueNow + gst}</AppText>
                </View>
              </>
            )}
            <View style={styles.billingRow}>
              <AppText variant="body">Effective from</AppText>
              <AppText variant="body">Today</AppText>
            </View>
            <View style={styles.billingRow}>
              <AppText variant="body">Payment</AppText>
              <AppText variant="body">{defaultMethod.label} *{defaultMethod.last4 || defaultMethod.handle}</AppText>
            </View>
          </View>

          <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginBottom: vs(12)}}>
            By confirming, you agree to TrustLife's Terms of Service. Your plan will switch immediately and billing adjustments will be applied.
          </AppText>

          <View style={{flexDirection: 'row', gap: s(10)}}>
            <TouchableOpacity
              style={[styles.actionBtn, {backgroundColor: Colors.background}]}
              activeOpacity={0.7}
              onPress={() => setManagePlanStep(2)}>
              <AppText variant="bodyBold" color={Colors.textSecondary}>Back</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.actionBtn, {backgroundColor: Colors.primary}]}
              activeOpacity={0.8}
              onPress={() => setManagePlanStep(4)}>
              <AppText variant="bodyBold" style={{color: Colors.white}}>Confirm & pay</AppText>
            </TouchableOpacity>
          </View>
        </>
      );
    };

    const renderSuccess = () => (
      <View style={{alignItems: 'center', paddingVertical: vs(20)}}>
        <View style={styles.successCircle}>
          <AppText style={{fontSize: ms(32), color: Colors.white}}>{'\u2713'}</AppText>
        </View>
        <AppText variant="bodyBold" style={{fontSize: ms(20), marginTop: vs(14)}}>Plan switched!</AppText>
        <AppText variant="body" color={Colors.textSecondary} style={{textAlign: 'center', marginTop: vs(6)}}>
          You're now on the {selectedPlan?.name} plan. Enjoy your new features!
        </AppText>
        <TouchableOpacity
          style={[styles.actionBtn, {marginTop: vs(20), width: '100%'}]}
          activeOpacity={0.8}
          onPress={() => {
            setShowManageModal(false);
            setManagePlanStep(1);
          }}>
          <AppText variant="bodyBold" style={{color: Colors.white}}>Done</AppText>
        </TouchableOpacity>
      </View>
    );

    return (
      <Modal visible={showManageModal} animationType="slide" transparent onRequestClose={() => setShowManageModal(false)}>
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => setShowManageModal(false)} />
          <View style={[styles.sheetContainer, {paddingBottom: Math.max(insets.bottom, vs(20))}]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.dragHandle} />
              {managePlanStep === 1 && renderStep1()}
              {managePlanStep === 2 && renderStep2()}
              {managePlanStep === 3 && renderStep3()}
              {managePlanStep === 4 && renderSuccess()}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  /* ═══════════════════════════════════════════════════════
     MODAL 3 \u2013 Cancel Flow
     ═══════════════════════════════════════════════════════ */
  const renderCancelModal = () => {
    const renderCancelStep1 = () => (
      <>
        <AppText variant="bodyBold" style={{fontSize: ms(18), marginBottom: vs(4)}}>Cancel subscription</AppText>
        <AppText variant="body" color={Colors.textSecondary} style={{marginBottom: vs(14)}}>
          We're sorry to see you go. Please let us know why you're cancelling.
        </AppText>

        {CANCEL_REASONS.map((reason, i) => {
          const isSelected = cancelReason === reason;
          return (
            <TouchableOpacity
              key={i}
              style={[styles.radioRow, isSelected && {backgroundColor: Colors.tealBg}]}
              activeOpacity={0.7}
              onPress={() => setCancelReason(reason)}>
              <View style={[styles.radioOuter, isSelected && {borderColor: Colors.accent}]}>
                {isSelected && <View style={styles.radioInner} />}
              </View>
              <AppText variant="body" style={{flex: 1, marginLeft: s(10)}}>{reason}</AppText>
            </TouchableOpacity>
          );
        })}

        <TouchableOpacity
          style={[
            styles.actionBtn,
            {backgroundColor: cancelReason ? Colors.red : Colors.borderLight, marginTop: vs(14)},
          ]}
          activeOpacity={cancelReason ? 0.8 : 1}
          onPress={() => cancelReason && setCancelStep(2)}>
          <AppText variant="bodyBold" style={{color: cancelReason ? Colors.white : Colors.textTertiary}}>
            Continue
          </AppText>
        </TouchableOpacity>
      </>
    );

    const renderCancelStep2 = () => (
      <>
        <AppText variant="bodyBold" style={{fontSize: ms(18), marginBottom: vs(4)}}>Wait! We have an offer</AppText>
        <AppText variant="body" color={Colors.textSecondary} style={{marginBottom: vs(14)}}>
          We value you as a member. Here's a special offer before you go:
        </AppText>

        {/* Retention offer */}
        <View style={[styles.card, {backgroundColor: Colors.tealBg, borderWidth: 1.5, borderColor: Colors.accent}]}>
          <AppText variant="bodyBold" style={{fontSize: ms(16), color: Colors.tealText, marginBottom: vs(4)}}>
            2 months free!
          </AppText>
          <AppText variant="body" color={Colors.textSecondary}>
            Stay on the Pro plan and get your next 2 months completely free. That's a saving of {'\u20B9'}598.
          </AppText>
          <TouchableOpacity
            style={[styles.actionBtn, {backgroundColor: Colors.accent, marginTop: vs(12)}]}
            activeOpacity={0.8}
            onPress={() => {
              setShowCancelModal(false);
              setCancelStep(1);
              Alert.alert('Offer applied!', 'Your next 2 months are on us. Thank you for staying!');
            }}>
            <AppText variant="bodyBold" style={{color: Colors.white}}>Accept offer</AppText>
          </TouchableOpacity>
        </View>

        {/* Alternatives */}
        <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>ALTERNATIVES</AppText>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => {
            setShowCancelModal(false);
            setCancelStep(1);
            const basicPlan = PLANS.find(p => p.name === 'Basic');
            if (basicPlan) {
              setSelectedPlan(basicPlan);
              setManagePlanStep(2);
              setShowManageModal(true);
            }
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[styles.iconBox, {backgroundColor: Colors.blueBg}]}>
              <AppText style={styles.iconText}>{'\u2193'}</AppText>
            </View>
            <View style={{flex: 1, marginLeft: s(10)}}>
              <AppText variant="bodyBold">Switch to Basic</AppText>
              <AppText variant="small" color={Colors.textSecondary}>Keep free access to basic features</AppText>
            </View>
            <AppText variant="body" style={{color: Colors.accent}}>{'\u203A'}</AppText>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => {
            setShowCancelModal(false);
            setCancelStep(1);
            Alert.alert('Plan paused', 'Your plan has been paused for 1 month. It will resume automatically.');
          }}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={[styles.iconBox, {backgroundColor: Colors.amberBg}]}>
              <AppText style={styles.iconText}>{'\u23F8'}</AppText>
            </View>
            <View style={{flex: 1, marginLeft: s(10)}}>
              <AppText variant="bodyBold">Pause for 1 month</AppText>
              <AppText variant="small" color={Colors.textSecondary}>Take a break, resume anytime</AppText>
            </View>
            <AppText variant="body" style={{color: Colors.accent}}>{'\u203A'}</AppText>
          </View>
        </TouchableOpacity>

        {/* Cancel anyway */}
        <TouchableOpacity
          style={[styles.actionBtn, {backgroundColor: Colors.redBg, marginTop: vs(10)}]}
          activeOpacity={0.8}
          onPress={() => {
            setShowCancelModal(false);
            setCancelStep(1);
            Alert.alert(
              'Plan cancelled',
              'Your Pro plan will remain active until 15 Apr 2026. After that, you will be moved to the Basic plan.',
            );
          }}>
          <AppText variant="bodyBold" style={{color: Colors.red}}>Cancel anyway</AppText>
        </TouchableOpacity>
      </>
    );

    return (
      <Modal visible={showCancelModal} animationType="slide" transparent onRequestClose={() => setShowCancelModal(false)}>
        <View style={styles.sheetOverlay}>
          <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => setShowCancelModal(false)} />
          <View style={[styles.sheetContainer, {paddingBottom: Math.max(insets.bottom, vs(20))}]}>
            <ScrollView showsVerticalScrollIndicator={false}>
              <View style={styles.dragHandle} />
              {cancelStep === 1 && renderCancelStep1()}
              {cancelStep === 2 && renderCancelStep2()}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  /* ═══════════════════════════════════════════════════════
     MODAL 4 \u2013 Payment Method
     ═══════════════════════════════════════════════════════ */
  const renderPaymentModal = () => (
    <Modal visible={showPaymentModal} animationType="slide" transparent onRequestClose={() => setShowPaymentModal(false)}>
      <View style={styles.sheetOverlay}>
        <TouchableOpacity style={styles.sheetBackdrop} activeOpacity={1} onPress={() => setShowPaymentModal(false)} />
        <View style={[styles.sheetContainer, {paddingBottom: Math.max(insets.bottom, vs(20))}]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.dragHandle} />
            <AppText variant="bodyBold" style={{fontSize: ms(18), marginBottom: vs(14)}}>Payment methods</AppText>

            {paymentMethods.map((pm, i) => (
              <View key={i} style={[styles.card, pm.default && {borderWidth: 1, borderColor: Colors.accent}]}>
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                  <View style={[styles.iconBox, {backgroundColor: pm.type === 'card' ? Colors.blueBg : Colors.purpleBg}]}>
                    <AppText style={styles.iconText}>
                      {pm.type === 'card' ? '\uD83D\uDCB3' : '\uD83D\uDD17'}
                    </AppText>
                  </View>
                  <View style={{flex: 1, marginLeft: s(10)}}>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
                      <AppText variant="bodyBold">{pm.label}</AppText>
                      {pm.default && (
                        <View style={[styles.statusChip, {backgroundColor: Colors.tealBg}]}>
                          <AppText variant="small" style={{color: Colors.accent, fontWeight: '700', fontSize: ms(9)}}>
                            DEFAULT
                          </AppText>
                        </View>
                      )}
                    </View>
                    <AppText variant="small" color={Colors.textSecondary}>
                      {pm.type === 'card'
                        ? `**** ${pm.last4}  \u00B7  Exp ${pm.expires}`
                        : `${pm.handle}  \u00B7  ${pm.bank}`}
                    </AppText>
                  </View>
                </View>

                <View style={{flexDirection: 'row', gap: s(10), marginTop: vs(10)}}>
                  {!pm.default && (
                    <TouchableOpacity
                      style={[styles.smallBtn, {backgroundColor: Colors.tealBg}]}
                      activeOpacity={0.7}
                      onPress={() => {
                        setPaymentMethods(prev =>
                          prev.map(m => ({...m, default: m === pm})),
                        );
                      }}>
                      <AppText variant="small" style={{color: Colors.tealText, fontWeight: '600'}}>Set default</AppText>
                    </TouchableOpacity>
                  )}
                  <TouchableOpacity
                    style={[styles.smallBtn, {backgroundColor: Colors.redBg}]}
                    activeOpacity={0.7}
                    onPress={() => {
                      if (pm.default) {
                        Alert.alert('Cannot remove', 'You cannot remove the default payment method. Set another as default first.');
                      } else {
                        setPaymentMethods(prev => prev.filter(m => m !== pm));
                      }
                    }}>
                    <AppText variant="small" style={{color: Colors.red, fontWeight: '600'}}>Remove</AppText>
                  </TouchableOpacity>
                </View>
              </View>
            ))}

            {/* Add new */}
            <TouchableOpacity
              style={[styles.card, {alignItems: 'center', borderWidth: 1, borderColor: Colors.borderLight, borderStyle: 'dashed'}]}
              activeOpacity={0.7}
              onPress={() => Alert.alert('Add payment method', 'This feature will be available in a future update.')}>
              <AppText variant="body" style={{color: Colors.accent, fontWeight: '600'}}>
                + Add new payment method
              </AppText>
            </TouchableOpacity>
          </ScrollView>
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
      {renderInvoiceModal()}
      {renderManageModal()}
      {renderCancelModal()}
      {renderPaymentModal()}
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

  /* Section label */
  sectionLabel: {fontSize: ms(11), fontWeight: '700', letterSpacing: 0.5, marginBottom: vs(10), marginTop: vs(4)},

  /* Card */
  card: {backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14), marginBottom: vs(10)},

  /* Billing rows */
  billingRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: vs(4)},
  divider: {height: 1, backgroundColor: Colors.borderLight, marginVertical: vs(8)},

  /* Feature pill */
  featurePill: {
    backgroundColor: Colors.accent + '15',
    borderRadius: ms(20), paddingHorizontal: s(10), paddingVertical: vs(3),
  },

  /* Small button */
  smallBtn: {
    borderRadius: ms(8), paddingHorizontal: s(12), paddingVertical: vs(7),
  },

  /* Status chip */
  statusChip: {borderRadius: ms(5), paddingHorizontal: s(8), paddingVertical: vs(3)},

  /* Grid */
  gridRow: {flexDirection: 'row', gap: s(10)},
  gridItem: {flex: 1},

  /* Timeline */
  timelineRow: {flexDirection: 'row', position: 'relative'},
  timelineDot: {
    width: ms(10), height: ms(10), borderRadius: ms(5),
    marginTop: vs(4), zIndex: 1,
  },
  timelineLine: {
    position: 'absolute', left: ms(4), top: vs(16),
    width: 2, bottom: 0, backgroundColor: Colors.borderLight,
  },

  /* Filter pill */
  filterPill: {
    paddingHorizontal: s(14), paddingVertical: vs(6), borderRadius: ms(20),
    backgroundColor: Colors.white,
  },

  /* Icon box */
  iconBox: {width: ms(40), height: ms(40), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
  iconText: {fontSize: ms(20)},

  /* Progress bar */
  progressBg: {height: vs(6), backgroundColor: Colors.borderLight, borderRadius: ms(3), overflow: 'hidden'},
  progressFill: {height: '100%', borderRadius: ms(3)},

  /* Plan badge */
  planBadge: {
    alignSelf: 'flex-start', borderRadius: ms(5),
    paddingHorizontal: s(8), paddingVertical: vs(3),
  },

  /* Plan button */
  planBtn: {
    borderRadius: ms(12), paddingVertical: vs(12), alignItems: 'center', marginTop: vs(12),
  },

  /* Action button */
  actionBtn: {
    backgroundColor: Colors.primary, borderRadius: ms(12),
    paddingVertical: vs(13), alignItems: 'center', flex: 1,
  },

  /* Radio */
  radioRow: {
    flexDirection: 'row', alignItems: 'center',
    paddingVertical: vs(10), paddingHorizontal: s(12),
    borderRadius: ms(10), marginBottom: vs(6),
  },
  radioOuter: {
    width: ms(20), height: ms(20), borderRadius: ms(10),
    borderWidth: 2, borderColor: Colors.borderLight,
    alignItems: 'center', justifyContent: 'center',
  },
  radioInner: {
    width: ms(10), height: ms(10), borderRadius: ms(5),
    backgroundColor: Colors.accent,
  },

  /* Success circle */
  successCircle: {
    width: ms(64), height: ms(64), borderRadius: ms(32),
    backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center',
  },

  /* Bottom sheet */
  sheetOverlay: {flex: 1, justifyContent: 'flex-end'},
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheetContainer: {
    backgroundColor: Colors.white, borderTopLeftRadius: ms(20), borderTopRightRadius: ms(20),
    padding: s(20), maxHeight: '85%',
  },
  dragHandle: {
    width: s(36), height: vs(4), borderRadius: ms(2),
    backgroundColor: Colors.borderLight, alignSelf: 'center', marginBottom: vs(14),
  },
});

export default SubscriptionScreen;
