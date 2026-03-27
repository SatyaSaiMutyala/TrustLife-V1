import React, {useState, useRef, useCallback} from 'react';
import {
  View, StyleSheet, TouchableOpacity, StatusBar, ScrollView,
  TextInput, Modal, Alert, Share,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import {
  CONSENT_CATEGORIES, CONSENT_ITEMS, CONSENT_LABELS, SIGN_STATEMENT,
} from '../../constants/consentAgreementData';

/* ── Helpers ──────────────────────────────────────────── */

const initToggles = () => {
  const map = {};
  CONSENT_ITEMS.forEach(c => { map[c.id] = c.defaultOn; });
  return map;
};

const formatDate = () => {
  const d = new Date();
  return d.toLocaleDateString('en-IN', {day: '2-digit', month: 'long', year: 'numeric'});
};

const formatTimestamp = () => {
  const d = new Date();
  return d.toLocaleDateString('en-IN', {day: '2-digit', month: 'long', year: 'numeric'})
    + ' at ' + d.toLocaleTimeString('en-IN', {hour: '2-digit', minute: '2-digit'});
};

/* ── Consent Item Component ──────────────────────────── */

const ConsentItemCard = ({item, isOn, onToggle, expanded, onExpand}) => {
  const isLocked = item.required;
  return (
    <View style={[st.consentCard, isOn && st.consentCardOn, isLocked && isOn && st.consentCardReq]}>
      <View style={st.ciTop}>
        <View style={[st.ciIcon, {backgroundColor: item.icoBg}]}>
          <AppText style={{fontSize: ms(18)}}>{item.ico}</AppText>
        </View>
        <View style={{flex: 1}}>
          <AppText variant="bodyBold" style={st.ciTitle}>{item.title}</AppText>
          <AppText variant="caption" color={Colors.textTertiary} style={st.ciDesc}>{item.desc}</AppText>
        </View>
        <View style={st.ciRight}>
          <View style={[st.badge, item.required ? st.reqBadge : st.optBadge]}>
            <AppText variant="small" style={{color: item.required ? Colors.accent : Colors.textTertiary, fontWeight: '700', fontSize: ms(8)}}>
              {item.required ? 'Required' : 'Optional'}
            </AppText>
          </View>
          <TouchableOpacity
            style={[st.toggle, isOn && st.toggleOn, isLocked && st.toggleLocked]}
            activeOpacity={isLocked ? 1 : 0.7}
            onPress={() => !isLocked && onToggle(item.id)}>
            <View style={[st.toggleKnob, isOn && st.toggleKnobOn, isLocked && st.toggleKnobLocked]} />
          </TouchableOpacity>
        </View>
      </View>

      {expanded && (
        <View style={st.ciExpand}>
          <AppText variant="caption" color={Colors.textSecondary} style={{lineHeight: ms(18)}}>
            {item.details}
          </AppText>
        </View>
      )}

      <TouchableOpacity onPress={() => onExpand(item.id)} style={st.readMoreBtn}>
        <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '700'}}>
          {expanded ? '\u203A Close' : '\u203A Read more'}
        </AppText>
      </TouchableOpacity>
    </View>
  );
};

/* ── Main Screen ─────────────────────────────────────── */

const ConsentAgreementScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollRef = useRef(null);

  const [toggles, setToggles] = useState(initToggles);
  const [expandedItems, setExpandedItems] = useState(new Set());
  const [signName, setSignName] = useState('');
  const [scrollPct, setScrollPct] = useState(0);
  const [readAll, setReadAll] = useState(false);
  const [showSuccess, setShowSuccess] = useState(false);
  const [showDecline, setShowDecline] = useState(false);
  const [showDeclined, setShowDeclined] = useState(false);
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2400);
  }, []);

  /* ── Toggle logic ──────────────────────────────────── */
  const handleToggle = (id) => {
    setToggles(prev => ({...prev, [id]: !prev[id]}));
  };

  const handleExpand = (id) => {
    setExpandedItems(prev => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  const acceptAll = () => {
    const next = {...toggles};
    CONSENT_ITEMS.forEach(c => { next[c.id] = true; });
    setToggles(next);
    showToast('All optional consents enabled');
  };

  /* ── Scroll progress ───────────────────────────────── */
  const handleScroll = (e) => {
    const {contentOffset, contentSize, layoutMeasurement} = e.nativeEvent;
    const max = contentSize.height - layoutMeasurement.height;
    const pct = max > 0 ? Math.min(100, Math.round((contentOffset.y / max) * 100)) : 100;
    setScrollPct(pct);
    if (pct >= 85 && !readAll) setReadAll(true);
  };

  /* ── Computed values ───────────────────────────────── */
  const requiredItems = CONSENT_ITEMS.filter(c => c.required);
  const optionalItems = CONSENT_ITEMS.filter(c => !c.required);
  const optOnCount = optionalItems.filter(c => toggles[c.id]).length;
  const allReqOn = requiredItems.every(c => toggles[c.id]);
  const nameOk = signName.trim().length >= 3;
  const canSign = nameOk && allReqOn;

  /* ── Sign ───────────────────────────────────────────── */
  const handleSign = () => {
    if (!nameOk) { showToast('Please type your full name to sign'); return; }
    if (!readAll) { showToast('Please scroll to review all consents first'); return; }
    setShowSuccess(true);
  };

  /* ── Categories & items by category ────────────────── */
  const medicalItems = CONSENT_ITEMS.filter(c => c.category === 'medical');
  const dataItems = CONSENT_ITEMS.filter(c => c.category === 'data');

  const signText = SIGN_STATEMENT.replace('{NAME}', signName.trim() || '______________');

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Header ───────────────────────────────────── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <AppText variant="body" style={st.backText}>{'\u2039'} Profile</AppText>
          </TouchableOpacity>
        </View>
        <AppText variant="screenName" style={st.headerTitle}>Consent Agreement</AppText>
        <AppText variant="caption" style={st.headerSub}>Review and manage your data consents</AppText>
      </View>

      {/* ── Progress bar ─────────────────────────────── */}
      <View style={st.progWrap}>
        <View style={st.progBar}>
          <View style={[st.progFill, {width: scrollPct + '%'}]} />
        </View>
        <View style={st.progLabels}>
          <AppText variant="small" color={readAll ? Colors.accent : Colors.textTertiary}>
            {readAll ? 'All consents reviewed \u2713' : 'Scroll to read all'}
          </AppText>
          <AppText variant="small" style={{fontWeight: '700', color: Colors.accent}}>{scrollPct}%</AppText>
        </View>
      </View>

      {/* ── Main scroll ──────────────────────────────── */}
      <ScrollView
        ref={scrollRef}
        style={st.scroll}
        contentContainerStyle={st.scrollContent}
        showsVerticalScrollIndicator={false}
        onScroll={handleScroll}
        scrollEventThrottle={16}>

        {/* ── Medical Consents ─────────────────────────── */}
        {CONSENT_CATEGORIES.map((cat, ci) => {
          const items = ci === 0 ? medicalItems : dataItems;
          return (
            <View key={cat.key}>
              {ci > 0 && <View style={{height: vs(8)}} />}
              <View style={st.catHeader}>
                <View style={[st.catIco, {backgroundColor: cat.icoBg}]}>
                  <AppText style={{fontSize: ms(18)}}>{cat.ico}</AppText>
                </View>
                <View style={{flex: 1}}>
                  <AppText variant="bodyBold">{cat.title}</AppText>
                  <View style={[st.catBadge, {backgroundColor: cat.badgeBg, borderColor: cat.badgeBorder}]}>
                    <AppText variant="small" style={{color: cat.badgeColor, fontWeight: '700', fontSize: ms(9)}}>{cat.badge}</AppText>
                  </View>
                </View>
              </View>
              <AppText variant="caption" color={Colors.textTertiary} style={st.catDesc}>{cat.desc}</AppText>
              <View style={st.catDivider} />

              {items.map(item => (
                <ConsentItemCard
                  key={item.id}
                  item={item}
                  isOn={toggles[item.id]}
                  onToggle={handleToggle}
                  expanded={expandedItems.has(item.id)}
                  onExpand={handleExpand}
                />
              ))}
            </View>
          );
        })}

        {/* ── Consent Summary ──────────────────────────── */}
        <View style={st.divider} />
        <AppText variant="sectionTitle" style={{marginBottom: vs(8)}}>CONSENT SUMMARY</AppText>
        <View style={st.summaryPanel}>
          {requiredItems.map(c => (
            <View key={c.id} style={st.sumRow}>
              <AppText variant="caption" color={Colors.textTertiary}>{CONSENT_LABELS[c.id]}</AppText>
              <AppText variant="caption" style={{fontWeight: '700', color: Colors.accent}}>{'\u2713'} Required</AppText>
            </View>
          ))}
          {optionalItems.map(c => (
            <View key={c.id} style={st.sumRow}>
              <AppText variant="caption" color={Colors.textTertiary}>{CONSENT_LABELS[c.id]}</AppText>
              <AppText variant="caption" style={{fontWeight: '700', color: toggles[c.id] ? Colors.accent : Colors.textTertiary}}>
                {toggles[c.id] ? '\u2713 Granted' : '\u2717 Declined'}
              </AppText>
            </View>
          ))}
        </View>

        {/* ── Signature Block ──────────────────────────── */}
        <View style={st.signBlock}>
          <AppText variant="sectionTitle" style={{color: Colors.accent, marginBottom: vs(10)}}>{'\u270D\uFE0F'} YOUR SIGNATURE</AppText>
          <AppText variant="body" color={Colors.textSecondary} style={st.signStmt}>
            {'\u201C'}{signText}{'\u201D'}
          </AppText>

          <AppText variant="small" style={st.nameLbl}>TYPE YOUR FULL NAME TO SIGN</AppText>
          <TextInput
            style={st.nameInput}
            placeholder="Type your full name here..."
            placeholderTextColor={Colors.textTertiary}
            value={signName}
            onChangeText={setSignName}
            autoCapitalize="words"
          />
          <View style={st.nameMatch}>
            <AppText variant="small" color={nameOk ? Colors.accent : Colors.textTertiary} style={{fontWeight: '600'}}>
              {nameOk ? '\u2713' : '\u25CF'}{' '}
              {nameOk ? `Signed as "${signName.trim()}"` : signName.length > 0 ? 'Name too short \u2014 enter your full name' : 'Enter your name to sign this consent agreement'}
            </AppText>
          </View>

          <View style={st.dateRow}>
            <AppText variant="small" color={Colors.textTertiary}>{'\uD83D\uDCC5'} Signed on: {formatDate()}</AppText>
            <AppText variant="small" color={Colors.textTertiary}>Location: Hyderabad, India</AppText>
          </View>
        </View>

        <View style={{height: vs(10)}} />
      </ScrollView>

      {/* ── Download strip ────────────────────────────── */}
      <View style={st.dlStrip}>
        <TouchableOpacity style={st.dlBtn} activeOpacity={0.7} onPress={() => showToast('Opening Consent Agreement PDF...')}>
          <AppText style={{fontSize: ms(16)}}>{'\uD83D\uDCC4'}</AppText>
          <View style={{flex: 1}}>
            <AppText variant="small" color={Colors.accent} style={{fontWeight: '700'}}>Download Consent PDF</AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(8)}}>Blank form {'\u00B7'} Print & sign manually</AppText>
          </View>
          <AppText variant="caption" color={Colors.accent}>{'\u2193'}</AppText>
        </TouchableOpacity>
      </View>

      {/* ── Bottom action bar ─────────────────────────── */}
      <View style={[st.acceptZone, {paddingBottom: Math.max(insets.bottom, vs(16))}]}>
        <View style={st.reqStatus}>
          <AppText variant="small" color={Colors.textTertiary}>Required consents: all enabled</AppText>
          <AppText variant="small" style={{fontWeight: '700', color: Colors.accent}}>{optOnCount}/{optionalItems.length} optional</AppText>
        </View>
        <View style={st.btnRow}>
          <TouchableOpacity style={st.btnAll} activeOpacity={0.7} onPress={acceptAll}>
            <AppText variant="caption" color={Colors.accent} style={{fontWeight: '700'}}>All {'\u2713'}</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[st.btnAccept, canSign && st.btnAcceptReady]}
            activeOpacity={canSign ? 0.8 : 1}
            onPress={canSign ? handleSign : () => showToast(nameOk ? 'Scroll to review all consents' : 'Type your name to sign')}>
            <AppText variant="bodyBold" color={canSign ? Colors.white : Colors.textTertiary}>Sign & Activate</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={st.btnDecline} activeOpacity={0.7} onPress={() => setShowDecline(true)}>
            <AppText variant="caption" color={Colors.red} style={{fontWeight: '700'}}>Decline</AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* ── Success Modal ─────────────────────────────── */}
      <Modal visible={showSuccess} animationType="fade" transparent={false}>
        <View style={[st.successScreen, {paddingTop: insets.top + vs(40)}]}>
          <ScrollView contentContainerStyle={{alignItems: 'center', padding: s(22)}} showsVerticalScrollIndicator={false}>
            <AppText style={{fontSize: ms(60), marginBottom: vs(14)}}>{'\uD83C\uDF0D\uFE0F'}</AppText>
            <AppText variant="header" style={{fontSize: ms(22), fontWeight: '800', textAlign: 'center', marginBottom: vs(5)}}>Consent Recorded</AppText>
            <AppText variant="caption" color={Colors.textTertiary} style={{textAlign: 'center', lineHeight: ms(18), marginBottom: vs(20), maxWidth: s(280)}}>
              Your informed consent agreement has been signed, timestamped, and securely stored. You are in control.
            </AppText>

            <View style={st.accCard}>
              <AppText variant="sectionTitle" style={{marginBottom: vs(8)}}>CONSENT RECORD</AppText>
              {[
                ['Signed by', signName.trim()],
                ['Timestamp', formatTimestamp()],
                ['Required consents', '4 of 4 \u2014 all granted'],
                ['Optional consents', `${optOnCount} of ${optionalItems.length} granted`],
                ['Consent version', 'TrustLife UCA v1.0'],
                ['DPDP compliance', 'DPDP Act 2023 \u00B7 Section 6'],
                ['Revocable via', 'Profile \u203A Consent Manager'],
              ].map(([k, v], i) => (
                <View key={i} style={st.accRow}>
                  <AppText variant="small" color={Colors.textTertiary}>{k}</AppText>
                  <AppText variant="small" style={{fontWeight: '700', textAlign: 'right', maxWidth: '60%'}}>{v}</AppText>
                </View>
              ))}
            </View>

            <View style={st.accInfo}>
              <AppText variant="caption" color={Colors.accent} style={{lineHeight: ms(18)}}>
                {'\uD83C\uDF3F'} You may review, update, or withdraw any consent at any time from Profile {'\u203A'} Consent Manager. Required consents can be reviewed with our Grievance Officer.
              </AppText>
            </View>

            <TouchableOpacity style={st.accDlBtn} activeOpacity={0.7} onPress={() => showToast('Preparing signed copy...')}>
              <AppText variant="bodyBold" color={Colors.accent}>{'\u2193'} Download signed copy</AppText>
            </TouchableOpacity>

            <TouchableOpacity style={st.accContinueBtn} activeOpacity={0.8} onPress={() => { setShowSuccess(false); navigation.goBack(); showToast(`Welcome to TrustLife, ${signName.trim().split(' ')[0]}! \u2728`); }}>
              <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(14)}}>Enter TrustLife {'\u2192'}</AppText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </Modal>

      {/* ── Decline Modal ─────────────────────────────── */}
      <Modal visible={showDecline} animationType="slide" transparent onRequestClose={() => setShowDecline(false)}>
        <View style={st.modalOverlay}>
          <TouchableOpacity style={st.modalBackdrop} activeOpacity={1} onPress={() => setShowDecline(false)} />
          <View style={st.modalSheet}>
            <View style={st.dragHandle} />
            <View style={{alignItems: 'center', marginBottom: vs(12)}}>
              <AppText style={{fontSize: ms(28), marginBottom: vs(6)}}>{'\u26A0\uFE0F'}</AppText>
              <AppText variant="header" style={{fontSize: ms(16), fontWeight: '800', marginBottom: vs(4)}}>Decline Consent?</AppText>
              <AppText variant="caption" color={Colors.textTertiary} style={{textAlign: 'center', lineHeight: ms(18)}}>
                The 4 required consents are necessary for TrustLife to operate. Declining them will cancel account setup. Optional consents can be individually declined.
              </AppText>
            </View>

            <View style={st.declineInfo}>
              <AppText variant="caption" color={Colors.red} style={{fontWeight: '700', marginBottom: vs(4)}}>If you decline required consents:</AppText>
              {['Account creation is cancelled', 'No personal data is retained', 'Subscription will be refunded within 5\u20137 business days', 'You may re-register and consent later'].map((t, i) => (
                <AppText key={i} variant="caption" color={Colors.red} style={{lineHeight: ms(18)}}>{'\u2022'} {t}</AppText>
              ))}
            </View>

            <TouchableOpacity
              style={st.declineConfirmBtn}
              activeOpacity={0.8}
              onPress={() => { setShowDecline(false); setShowDeclined(true); }}>
              <AppText variant="bodyBold" color={Colors.white}>Decline required consents & cancel</AppText>
            </TouchableOpacity>

            <TouchableOpacity style={st.declineBackBtn} activeOpacity={0.7} onPress={() => setShowDecline(false)}>
              <AppText variant="bodyBold" color={Colors.accent}>Go back & review</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>

      {/* ── Declined Confirmed Modal ──────────────────── */}
      <Modal visible={showDeclined} animationType="fade" transparent onRequestClose={() => {}}>
        <View style={st.modalOverlay}>
          <View style={st.modalSheet}>
            <View style={st.dragHandle} />
            <View style={{alignItems: 'center', paddingVertical: vs(10)}}>
              <AppText style={{fontSize: ms(44), marginBottom: vs(10)}}>{'\uD83D\uDEAB'}</AppText>
              <AppText variant="header" style={{fontSize: ms(16), fontWeight: '800', marginBottom: vs(6)}}>Consent Declined</AppText>
              <AppText variant="caption" color={Colors.textTertiary} style={{textAlign: 'center', lineHeight: ms(18), marginBottom: vs(14)}}>
                Account setup cancelled. No data retained. Your subscription will be refunded within 5{'\u2013'}7 business days.
              </AppText>
              <TouchableOpacity
                style={[st.declineBackBtn, {width: '100%'}]}
                activeOpacity={0.7}
                onPress={() => { setShowDeclined(false); navigation.goBack(); }}>
                <AppText variant="bodyBold" color={Colors.textSecondary}>Close</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── Toast ─────────────────────────────────────── */}
      {toast !== '' && (
        <View style={st.toast}>
          <AppText variant="body" color={Colors.white} style={{fontWeight: '600'}}>{toast}</AppText>
        </View>
      )}
    </View>
  );
};

/* ── Styles ───────────────────────────────────────────── */

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  /* Header */
  header: {backgroundColor: Colors.primary, paddingBottom: vs(14), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(10)},
  backBtn: {paddingVertical: vs(4), paddingRight: s(12)},
  backText: {color: Colors.white, fontSize: ms(15)},
  headerTitle: {color: Colors.white, fontSize: ms(22), fontWeight: '700', marginBottom: vs(3)},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},

  /* Progress */
  progWrap: {paddingHorizontal: s(16), paddingVertical: vs(6), backgroundColor: Colors.white, borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  progBar: {height: vs(3), backgroundColor: Colors.background, borderRadius: ms(2), overflow: 'hidden'},
  progFill: {height: '100%', borderRadius: ms(2), backgroundColor: Colors.accent},
  progLabels: {flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(4)},

  /* Scroll */
  scroll: {flex: 1},
  scrollContent: {padding: s(14)},

  /* Category */
  catHeader: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(10)},
  catIco: {width: ms(34), height: ms(34), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center'},
  catBadge: {paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(20), borderWidth: 0.5, alignSelf: 'flex-start', marginTop: vs(4)},
  catDesc: {lineHeight: ms(17), marginBottom: vs(8), paddingLeft: s(44)},
  catDivider: {height: 0.5, backgroundColor: Colors.borderLight, marginBottom: vs(8)},

  /* Consent card */
  consentCard: {backgroundColor: Colors.white, borderRadius: ms(14), padding: s(13), marginBottom: vs(7), borderWidth: 0.5, borderColor: Colors.borderLight},
  consentCardOn: {borderColor: 'rgba(29,158,117,0.28)'},
  consentCardReq: {borderColor: 'rgba(93,202,165,0.35)'},
  ciTop: {flexDirection: 'row', alignItems: 'flex-start', gap: s(11)},
  ciIcon: {width: ms(36), height: ms(36), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center'},
  ciTitle: {fontSize: ms(12), marginBottom: vs(2)},
  ciDesc: {lineHeight: ms(16)},
  ciRight: {alignItems: 'flex-end', gap: vs(5)},

  /* Badge */
  badge: {paddingHorizontal: s(6), paddingVertical: vs(2), borderRadius: ms(4), borderWidth: 0.5},
  reqBadge: {backgroundColor: Colors.tealBg, borderColor: 'rgba(29,158,117,0.28)'},
  optBadge: {backgroundColor: Colors.background, borderColor: Colors.borderLight},

  /* Toggle */
  toggle: {width: ms(44), height: ms(24), borderRadius: ms(12), backgroundColor: Colors.background, borderWidth: 0.5, borderColor: Colors.borderLight, justifyContent: 'center', paddingHorizontal: ms(2)},
  toggleOn: {backgroundColor: Colors.accent, borderColor: Colors.accent},
  toggleLocked: {backgroundColor: Colors.tealBg, borderColor: 'rgba(29,158,117,0.28)'},
  toggleKnob: {width: ms(18), height: ms(18), borderRadius: ms(9), backgroundColor: Colors.white, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.2, shadowRadius: 2},
  toggleKnobOn: {alignSelf: 'flex-end'},
  toggleKnobLocked: {alignSelf: 'flex-end', backgroundColor: Colors.accent},

  /* Expand */
  ciExpand: {marginTop: vs(10), paddingTop: vs(10), borderTopWidth: 0.5, borderTopColor: Colors.borderLight},
  readMoreBtn: {marginTop: vs(5)},

  /* Divider */
  divider: {height: 0.5, backgroundColor: Colors.borderLight, marginVertical: vs(14)},

  /* Summary */
  summaryPanel: {backgroundColor: Colors.white, borderRadius: ms(12), padding: s(12), marginBottom: vs(10)},
  sumRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: vs(5), borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},

  /* Sign block */
  signBlock: {backgroundColor: Colors.tealBg, borderWidth: 0.5, borderColor: 'rgba(29,158,117,0.25)', borderRadius: ms(14), padding: s(14), marginVertical: vs(8)},
  signStmt: {fontStyle: 'italic', lineHeight: ms(22), marginBottom: vs(12)},
  nameLbl: {fontSize: ms(9), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: Colors.textTertiary, marginBottom: vs(5)},
  nameInput: {backgroundColor: Colors.white, borderWidth: 0.5, borderColor: Colors.borderLight, borderRadius: ms(10), padding: s(12), fontSize: ms(15), fontWeight: '700', color: Colors.textPrimary},
  nameMatch: {marginTop: vs(5)},
  dateRow: {flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(8)},

  /* Download strip */
  dlStrip: {paddingHorizontal: s(14), paddingVertical: vs(6), borderTopWidth: 0.5, borderTopColor: Colors.borderLight, backgroundColor: Colors.white},
  dlBtn: {flexDirection: 'row', alignItems: 'center', gap: s(8), paddingVertical: vs(6), paddingHorizontal: s(10), borderRadius: ms(10), backgroundColor: Colors.tealBg, borderWidth: 0.5, borderColor: 'rgba(29,158,117,0.28)'},

  /* Accept zone */
  acceptZone: {paddingHorizontal: s(14), paddingTop: vs(8), borderTopWidth: 0.5, borderTopColor: Colors.borderLight, backgroundColor: Colors.white},
  reqStatus: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(8)},
  btnRow: {flexDirection: 'row', gap: s(7)},
  btnAll: {paddingHorizontal: s(12), paddingVertical: vs(13), borderRadius: ms(11), backgroundColor: Colors.tealBg, borderWidth: 0.5, borderColor: 'rgba(29,158,117,0.28)', justifyContent: 'center'},
  btnAccept: {flex: 2, paddingVertical: vs(13), borderRadius: ms(12), backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center'},
  btnAcceptReady: {backgroundColor: Colors.primary},
  btnDecline: {flex: 1, paddingVertical: vs(13), borderRadius: ms(12), backgroundColor: Colors.redBg, borderWidth: 0.5, borderColor: 'rgba(226,75,74,0.28)', alignItems: 'center', justifyContent: 'center'},

  /* Success */
  successScreen: {flex: 1, backgroundColor: Colors.background},
  accCard: {backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14), width: '100%', marginBottom: vs(14)},
  accRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: vs(5), borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  accInfo: {backgroundColor: Colors.tealBg, borderWidth: 0.5, borderColor: 'rgba(29,158,117,0.25)', borderRadius: ms(11), padding: s(12), marginBottom: vs(16), width: '100%'},
  accDlBtn: {width: '100%', paddingVertical: vs(11), borderRadius: ms(11), backgroundColor: Colors.white, borderWidth: 0.5, borderColor: Colors.borderLight, alignItems: 'center', marginBottom: vs(8)},
  accContinueBtn: {width: '100%', paddingVertical: vs(14), borderRadius: ms(13), backgroundColor: Colors.primary, alignItems: 'center'},

  /* Modals */
  modalOverlay: {flex: 1, justifyContent: 'flex-end'},
  modalBackdrop: {...StyleSheet.absoluteFillObject, backgroundColor: 'rgba(0,0,0,0.45)'},
  modalSheet: {backgroundColor: Colors.white, borderTopLeftRadius: ms(22), borderTopRightRadius: ms(22), padding: s(18), paddingBottom: vs(30)},
  dragHandle: {width: s(36), height: vs(4), borderRadius: ms(2), backgroundColor: Colors.borderLight, alignSelf: 'center', marginBottom: vs(14)},
  declineInfo: {backgroundColor: Colors.redBg, borderWidth: 0.5, borderColor: 'rgba(226,75,74,0.28)', borderRadius: ms(11), padding: s(11), marginBottom: vs(14)},
  declineConfirmBtn: {width: '100%', paddingVertical: vs(13), borderRadius: ms(12), backgroundColor: Colors.red, alignItems: 'center', marginBottom: vs(7)},
  declineBackBtn: {width: '100%', paddingVertical: vs(12), borderRadius: ms(12), backgroundColor: Colors.tealBg, borderWidth: 0.5, borderColor: 'rgba(29,158,117,0.25)', alignItems: 'center'},

  /* Toast */
  toast: {position: 'absolute', bottom: vs(100), alignSelf: 'center', backgroundColor: Colors.accent, borderRadius: ms(20), paddingHorizontal: s(18), paddingVertical: vs(9)},
});

export default ConsentAgreementScreen;
