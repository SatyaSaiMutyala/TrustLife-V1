import React, {useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
  Alert,
} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';
import {
  STATS_SUMMARY,
  SERVICE_TABS,
  PENDING_CLAIM,
  SERVICE_INVOICES,
  ADD_OPTIONS,
  VISIT_META,
  POLICY_INFO,
  INELIGIBLE_CATS,
} from '../../constants/serviceRecordsData';

/* ─── Category meta (emoji + section title) ─── */
const CAT_META = {
  lab: {emoji: '🧪', section: 'Diagnostic Labs'},
  doc: {emoji: '👩\u200D⚕️', section: 'Doctor Consultations'},
  med: {emoji: '💊', section: 'Medicines & Pharmacy'},
  tele: {emoji: '📷', section: 'Telemedicine'},
  coach: {emoji: '🏋', section: 'Health Coaching'},
  couns: {emoji: '🤝', section: 'Counselling'},
  nurse: {emoji: '👨\u200D⚕️', section: 'Nursing Care'},
  physio: {emoji: '🦿', section: 'Physiotherapy'},
  hosp: {emoji: '🏥', section: 'Hospital'},
  well: {emoji: '🌿', section: 'Wellness'},
  ins: {emoji: '🛡️', section: 'Insurance'},
};

const CAT_ICON_BG = {
  lab: Colors.amberBg,
  doc: Colors.blueBg,
  med: Colors.purpleBg,
  tele: Colors.tealBg,
  coach: Colors.tealBg,
  couns: '#FFF3E0',
  nurse: Colors.pinkBg,
  physio: Colors.blueBg,
  hosp: Colors.redBg,
  well: Colors.tealBg,
  ins: '#F3F4F6',
};

/* ─── Claim timeline steps (static demo) ─── */
const CLAIM_STEPS = [
  {label: 'Invoice uploaded', date: '12 Mar 2026', done: true},
  {label: 'Claim submitted to insurer', date: '18 Mar 2026', done: true},
  {label: 'Under review', date: 'In progress', done: false},
  {label: 'Approved / Settled', date: '', done: false},
];

const SETTLED_STEPS = [
  {label: 'Invoice uploaded', date: '', done: true},
  {label: 'Claim submitted', date: '', done: true},
  {label: 'Approved', date: '', done: true},
  {label: 'Settled & reimbursed', date: '', done: true},
];

/* ────────────────────────────────────────────── */
/*  ServiceRecordsTab                             */
/* ────────────────────────────────────────────── */
const ServiceRecordsTab = ({navigation, onAddRef, activeFilter = 'all'}) => {
  const [search, setSearch] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showAdd, setShowAdd] = useState(false);
  const [showVisit, setShowVisit] = useState(false);
  const [selectedVisitId, setSelectedVisitId] = useState(null);
  const [showClaim, setShowClaim] = useState(false);
  const [claimInv, setClaimInv] = useState(null);
  const [claimStep, setClaimStep] = useState(1);
  const [sigName, setSigName] = useState('');
  const [showClaimDone, setShowClaimDone] = useState(false);
  const [claimResult, setClaimResult] = useState(null);

  // Expose setShowAdd to parent via ref
  if (onAddRef) onAddRef.current = () => setShowAdd(true);

  /* ─── Filtering logic ─── */
  const filtered = SERVICE_INVOICES.filter(inv => {
    const matchCat = activeFilter === 'all' || inv.cat === activeFilter;
    if (!matchCat) return false;
    if (!search.trim()) return true;
    const q = search.toLowerCase();
    return (
      inv.name.toLowerCase().includes(q) ||
      inv.provider.toLowerCase().includes(q) ||
      inv.ref.toLowerCase().includes(q) ||
      String(inv.amount).includes(q)
    );
  });

  /* Group by category */
  const grouped = {};
  filtered.forEach(inv => {
    if (!grouped[inv.cat]) grouped[inv.cat] = [];
    grouped[inv.cat].push(inv);
  });
  const catOrder = SERVICE_TABS.filter(t => t.key !== 'all').map(t => t.key);

  /* ─── Open detail ─── */
  const openDetail = inv => {
    setSelectedInvoice(inv);
    setShowDetail(true);
  };

  /* ─── Visit Viewer ─── */
  const openVisitViewer = (visitId) => {
    setSelectedVisitId(visitId);
    setShowVisit(true);
  };

  /* ─── Claim Form ─── */
  const openClaimForm = (inv) => {
    setClaimInv(inv);
    setClaimStep(1);
    setSigName('');
    setShowClaim(true);
  };

  /* ─── Format currency ─── */
  const fmt = n => '₹' + Number(n).toLocaleString('en-IN');

  /* ══════════════════════════════════════════════ */
  /*  RENDER                                       */
  /* ══════════════════════════════════════════════ */
  return (
    <View style={{flex: 1}}>
      {/* ── 1. Stats Strip ── */}
      <View style={sty.statsCard}>
        <View style={sty.statCol}>
          <AppText style={sty.statValue}>{fmt(STATS_SUMMARY.totalSpent)}</AppText>
          <AppText style={sty.statLabel}>Total spent</AppText>
          <AppText style={sty.statSub}>{STATS_SUMMARY.totalInvoices} invoices</AppText>
        </View>
        <View style={sty.statDivider} />
        <View style={sty.statCol}>
          <AppText style={sty.statValue}>{fmt(STATS_SUMMARY.claimsAmount)}</AppText>
          <AppText style={sty.statLabel}>Insurance claims</AppText>
          <AppText style={sty.statSub}>{STATS_SUMMARY.claimsFiled} filed</AppText>
        </View>
        <View style={sty.statDivider} />
        <View style={sty.statCol}>
          <AppText style={sty.statValue}>{fmt(STATS_SUMMARY.thisMonth)}</AppText>
          <AppText style={sty.statLabel}>This month</AppText>
          <AppText style={sty.statSub}>{STATS_SUMMARY.thisMonthCount} services</AppText>
        </View>
      </View>

      {/* ── Search bar ── */}
      <View style={sty.searchWrap}>
        <Icon family="Ionicons" name="search-outline" size={16} color={Colors.textTertiary} />
        <TextInput
          style={sty.searchInput}
          placeholder="Search invoices, providers, amounts..."
          placeholderTextColor={Colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')}>
            <Icon family="Ionicons" name="close-circle" size={16} color={Colors.textTertiary} />
          </TouchableOpacity>
        )}
      </View>

      {/* ── 4. Pending Claim Banner ── */}
      {(activeFilter === 'all' || activeFilter === 'lab') && (
        <View style={sty.claimBanner}>
          <View style={sty.claimBannerRow}>
            <Icon family="Ionicons" name="shield-checkmark-outline" size={18} color={Colors.tealText} />
            <View style={{flex: 1, marginLeft: s(10)}}>
              <AppText variant="bodyBold" color={Colors.tealText}>
                {PENDING_CLAIM.title} {'\u00B7'} {fmt(PENDING_CLAIM.amount)} pending
              </AppText>
              <AppText variant="caption" color={Colors.tealText} style={{marginTop: vs(3), opacity: 0.85}}>
                {PENDING_CLAIM.desc}
              </AppText>
              <TouchableOpacity
                style={{marginTop: vs(4)}}
                onPress={() => Alert.alert('Track claim', 'Claim tracking coming soon')}>
                <AppText variant="small" color={Colors.tealDark} style={{fontWeight: '700'}}>
                  Track claim {'\u203A'}
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      )}

      {/* ── 5. Invoice Cards ── */}
      {filtered.length === 0 ? (
        <View style={sty.emptyWrap}>
          <AppText style={{fontSize: ms(36)}}>📋</AppText>
          <AppText variant="bodyBold" color={Colors.textSecondary} style={{marginTop: vs(10)}}>
            No records yet
          </AppText>
          <TouchableOpacity
            style={sty.emptyBtn}
            onPress={() => setShowAdd(true)}
            activeOpacity={0.7}>
            <AppText variant="small" color={Colors.white} style={{fontWeight: '600'}}>
              Add your first invoice
            </AppText>
          </TouchableOpacity>
        </View>
      ) : (
        catOrder.map(cat => {
          if (!grouped[cat]) return null;
          const meta = CAT_META[cat] || {emoji: '📄', section: cat};
          return (
            <View key={cat}>
              {/* Section header */}
              <AppText variant="sectionTitle" style={sty.sectionHeader}>
                {meta.emoji} {meta.section}
              </AppText>
              {grouped[cat].map(inv => (
                <TouchableOpacity
                  key={inv.id}
                  style={sty.card}
                  activeOpacity={0.7}
                  onPress={() => openDetail(inv)}>
                  {/* Main row */}
                  <View style={sty.invRow}>
                    <View style={[sty.invIcon, {backgroundColor: CAT_ICON_BG[inv.cat] || Colors.tealBg}]}>
                      <AppText style={{fontSize: ms(20)}}>{meta.emoji}</AppText>
                    </View>
                    <View style={sty.invBody}>
                      <AppText style={sty.invType}>{inv.type.toUpperCase()}</AppText>
                      <AppText style={sty.invName} numberOfLines={1}>{inv.name}</AppText>
                      <AppText variant="caption" color={Colors.textSecondary}>{inv.provider}</AppText>
                      {inv.tags && inv.tags.length > 0 && (
                        <View style={sty.tagRow}>
                          {inv.tags.map((t, i) => (
                            <View key={i} style={[sty.tag, {backgroundColor: t.bg}]}>
                              <AppText style={[sty.tagText, {color: t.color}]}>{t.label}</AppText>
                            </View>
                          ))}
                        </View>
                      )}
                    </View>
                    <View style={sty.invRight}>
                      <AppText style={sty.invAmount}>{fmt(inv.amount)}</AppText>
                      <AppText variant="caption" color={Colors.textTertiary}>{inv.date}</AppText>
                    </View>
                  </View>
                  {/* Footer row */}
                  <View style={sty.invFooter}>
                    <View style={{flexDirection: 'row', alignItems: 'center', flex: 1, gap: s(6)}}>
                      {inv.visitId && (
                        <TouchableOpacity
                          style={[sty.visitChip, inv.linked?.length > 0 && sty.visitChipLinked]}
                          onPress={() => inv.linked?.length > 0 && openVisitViewer(inv.visitId)}>
                          <AppText variant="small" color={inv.linked?.length > 0 ? Colors.accent : Colors.textTertiary}
                            style={{fontFamily: 'monospace', fontSize: ms(9)}}>
                            {inv.visitId}
                            {inv.linked?.length > 0 && ` · ${inv.linked.length + 1} records`}
                          </AppText>
                        </TouchableOpacity>
                      )}
                      <AppText style={sty.invRef}>{inv.ref}</AppText>
                    </View>
                    <View style={{flexDirection: 'row', alignItems: 'center'}}>
                      <TouchableOpacity
                        style={{marginRight: s(12)}}
                        onPress={() => Alert.alert('Download', `${inv.ref}.pdf`)}>
                        <AppText style={sty.footerAction}>{'\u2193'} PDF</AppText>
                      </TouchableOpacity>
                      {inv.claimStatus !== 'settled' && inv.claimStatus !== 'filed' && (
                        <TouchableOpacity
                          onPress={() => Alert.alert('Claim', 'File claim for ' + inv.name)}>
                          <AppText style={sty.footerAction}>{'\uD83D\uDEE1\uFE0F'} Claim</AppText>
                        </TouchableOpacity>
                      )}
                    </View>
                  </View>
                  {/* Claim status strip */}
                  {inv.claimStatus === 'filed' && (
                    <View style={sty.claimStrip}>
                      <AppText style={{fontSize: ms(16)}}>🛡️</AppText>
                      <View style={{flex: 1}}>
                        <AppText variant="small" color={Colors.blueText} style={{fontWeight: '700'}}>Claim filed — pending approval</AppText>
                      </View>
                      <View style={[sty.claimPill, {backgroundColor: Colors.blueBg}]}>
                        <AppText variant="small" color={Colors.blueText} style={{fontWeight: '700'}}>In review</AppText>
                      </View>
                    </View>
                  )}
                  {inv.claimStatus === 'settled' && (
                    <View style={sty.claimStrip}>
                      <AppText style={{fontSize: ms(16)}}>🛡️</AppText>
                      <View style={{flex: 1}}>
                        <AppText variant="small" color={Colors.accent} style={{fontWeight: '700'}}>Claim settled</AppText>
                        {inv.claimNote && <AppText variant="small" color={Colors.textTertiary}>{inv.claimNote}</AppText>}
                      </View>
                      <View style={[sty.claimPill, {backgroundColor: Colors.tealBg}]}>
                        <AppText variant="small" color={Colors.accent} style={{fontWeight: '700'}}>Settled</AppText>
                      </View>
                    </View>
                  )}
                  {inv.claimStatus === 'none' && !INELIGIBLE_CATS.includes(inv.cat) && (
                    <TouchableOpacity style={sty.claimStrip} onPress={() => openClaimForm(inv)}>
                      <AppText style={{fontSize: ms(16)}}>🛡️</AppText>
                      <View style={{flex: 1}}>
                        <AppText variant="small" color={Colors.accent} style={{fontWeight: '600'}}>File insurance claim</AppText>
                        <AppText variant="small" color={Colors.textTertiary}>Covered under Star Health policy</AppText>
                      </View>
                      <View style={sty.claimBtn}>
                        <AppText variant="small" color={Colors.white} style={{fontWeight: '700'}}>File claim</AppText>
                      </View>
                    </TouchableOpacity>
                  )}
                </TouchableOpacity>
              ))}
            </View>
          );
        })
      )}

      {/* ── 6. Invoice Detail Modal ── */}
      <Modal
        visible={showDetail}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetail(false)}>
        <View style={sty.modalOverlay}>
          <View style={sty.modalSheet}>
            {selectedInvoice && (
              <>
                {/* Sheet header */}
                <View style={sty.sheetHeader}>
                  <View style={sty.dragHandle} />
                  <AppText variant="small" style={{color: 'rgba(255,255,255,0.5)', marginTop: vs(8)}}>
                    {selectedInvoice.type}
                  </AppText>
                  <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(4)}}>
                    {selectedInvoice.name}
                  </AppText>
                  <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', marginTop: vs(2)}}>
                    {selectedInvoice.provider}
                  </AppText>
                  <TouchableOpacity style={sty.sheetClose} onPress={() => setShowDetail(false)}>
                    <Icon family="Ionicons" name="close" size={20} color={Colors.white} />
                  </TouchableOpacity>
                </View>

                {/* Sheet body */}
                <ScrollView style={sty.sheetBody} showsVerticalScrollIndicator={false}>
                  {/* Ayu note */}
                  {selectedInvoice.ayuNote ? (
                    <View style={sty.ayuCard}>
                      <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                        <AppText style={{fontSize: ms(16), marginRight: s(8)}}>🌿</AppText>
                        <View style={{flex: 1}}>
                          <AppText variant="small" color={Colors.tealText} style={{fontWeight: '700', marginBottom: vs(3)}}>
                            Ayu insight
                          </AppText>
                          <AppText variant="caption" color={Colors.tealText}>
                            {selectedInvoice.ayuNote}
                          </AppText>
                        </View>
                      </View>
                    </View>
                  ) : null}

                  {/* Summary grid */}
                  <View style={sty.summaryGrid}>
                    <View style={sty.summaryCell}>
                      <AppText style={sty.statLabel}>Amount paid</AppText>
                      <AppText style={[sty.statValue, {fontSize: ms(20)}]}>{fmt(selectedInvoice.amount)}</AppText>
                    </View>
                    <View style={sty.summaryCell}>
                      <AppText style={sty.statLabel}>Date</AppText>
                      <AppText variant="bodyBold">{selectedInvoice.date}</AppText>
                    </View>
                  </View>

                  {/* Invoice details card */}
                  <View style={sty.detailCard}>
                    <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>Invoice details</AppText>
                    <DetailRow icon="document-text-outline" label="Ref" value={selectedInvoice.ref} mono />
                    <DetailRow icon="business-outline" label="Provider" value={selectedInvoice.provider} />
                    <DetailRow icon="card-outline" label="Payment" value={selectedInvoice.paymentMethod} />
                    <DetailRow icon="person-outline" label="Paid by" value="Self" />
                  </View>

                  {/* Visit ID row */}
                  {selectedInvoice.visitId && (
                    <TouchableOpacity
                      style={sty.detailCard}
                      activeOpacity={0.7}
                      onPress={() => {
                        if (selectedInvoice.linked?.length > 0) {
                          setShowDetail(false);
                          setTimeout(() => openVisitViewer(selectedInvoice.visitId), 350);
                        }
                      }}>
                      <View style={{flexDirection: 'row', alignItems: 'center'}}>
                        <Icon family="Ionicons" name="git-network-outline" size={16} color={Colors.accent} />
                        <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, marginLeft: s(8), fontFamily: 'monospace'}}>
                          {selectedInvoice.visitId}
                        </AppText>
                        {selectedInvoice.linked?.length > 0 && (
                          <View style={[sty.visitChip, sty.visitChipLinked]}>
                            <AppText variant="small" color={Colors.accent} style={{fontWeight: '600'}}>
                              {selectedInvoice.linked.length + 1} linked records
                            </AppText>
                          </View>
                        )}
                      </View>
                    </TouchableOpacity>
                  )}

                  {/* Medical details */}
                  {selectedInvoice.icdCode && (
                    <View style={sty.detailCard}>
                      <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>Medical details</AppText>
                      <DetailRow icon="medkit-outline" label="ICD code" value={selectedInvoice.icdCode} mono />
                      {selectedInvoice.diagnosis && (
                        <DetailRow icon="fitness-outline" label="Diagnosis" value={selectedInvoice.diagnosis} />
                      )}
                      {selectedInvoice.doctor && (
                        <DetailRow icon="person-outline" label="Doctor" value={selectedInvoice.doctor} />
                      )}
                      {selectedInvoice.prescriptionRef && (
                        <DetailRow icon="document-outline" label="Rx ref" value={selectedInvoice.prescriptionRef} mono />
                      )}
                    </View>
                  )}

                  {/* Line items card */}
                  <View style={sty.detailCard}>
                    <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>Line items</AppText>
                    {selectedInvoice.items.map((item, i) => (
                      <View key={i} style={sty.lineItemRow}>
                        <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1}}>{item[0]}</AppText>
                        <AppText variant="caption" color={Colors.textSecondary}>{item[1]}</AppText>
                      </View>
                    ))}
                    {selectedInvoice.gst > 0 && (
                      <View style={[sty.lineItemRow, {borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: Colors.borderLight, paddingTop: vs(6)}]}>
                        <AppText variant="caption" color={Colors.textSecondary}>GST</AppText>
                        <AppText variant="caption" color={Colors.textSecondary}>{fmt(selectedInvoice.gst)}</AppText>
                      </View>
                    )}
                    <View style={sty.totalRow}>
                      <AppText variant="bodyBold" color={Colors.white}>Total</AppText>
                      <AppText variant="bodyBold" color={Colors.white}>
                        {fmt(selectedInvoice.amount + (selectedInvoice.gst || 0))}
                      </AppText>
                    </View>
                  </View>

                  {/* Insurance claim section */}
                  {selectedInvoice.claimStatus !== 'none' && (
                    <View style={sty.detailCard}>
                      <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>Insurance claim</AppText>
                      <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(8)}}>
                        <View
                          style={[
                            sty.claimBadge,
                            {
                              backgroundColor:
                                selectedInvoice.claimStatus === 'settled'
                                  ? Colors.tealBg
                                  : Colors.blueBg,
                            },
                          ]}>
                          <AppText
                            variant="small"
                            color={
                              selectedInvoice.claimStatus === 'settled'
                                ? Colors.tealText
                                : Colors.blueText
                            }
                            style={{fontWeight: '700'}}>
                            {selectedInvoice.claimStatus === 'settled' ? 'Settled' : 'In progress'}
                          </AppText>
                        </View>
                      </View>
                      {selectedInvoice.claimNote && (
                        <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(8)}}>
                          {selectedInvoice.claimNote}
                        </AppText>
                      )}
                      <DetailRow icon="shield-checkmark-outline" label="Insurer" value={selectedInvoice.insurer} />
                      <DetailRow icon="cash-outline" label="Claim amount" value={fmt(selectedInvoice.claimAmount)} />

                      {/* Timeline */}
                      <View style={{marginTop: vs(12)}}>
                        {(selectedInvoice.claimStatus === 'settled' ? SETTLED_STEPS : CLAIM_STEPS).map((step, i, arr) => (
                          <View key={i} style={sty.timelineStep}>
                            <View style={sty.timelineLeft}>
                              <View
                                style={[
                                  sty.timelineDot,
                                  {backgroundColor: step.done ? Colors.accent : Colors.borderLight},
                                ]}
                              />
                              {i < arr.length - 1 && (
                                <View
                                  style={[
                                    sty.timelineLine,
                                    {backgroundColor: step.done ? Colors.accent : Colors.borderLight},
                                  ]}
                                />
                              )}
                            </View>
                            <View style={{flex: 1, paddingBottom: vs(12)}}>
                              <AppText
                                variant="caption"
                                color={step.done ? Colors.textPrimary : Colors.textTertiary}>
                                {step.label}
                              </AppText>
                              {step.date ? (
                                <AppText variant="small" color={Colors.textTertiary}>
                                  {step.date}
                                </AppText>
                              ) : null}
                            </View>
                          </View>
                        ))}
                      </View>
                    </View>
                  )}

                  {/* Documents card */}
                  {selectedInvoice.docs && selectedInvoice.docs.length > 0 && (
                    <View style={sty.detailCard}>
                      <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>Documents</AppText>
                      {selectedInvoice.docs.map((doc, i) => (
                        <TouchableOpacity
                          key={i}
                          style={sty.docRow}
                          onPress={() => Alert.alert('Download', doc)}>
                          <Icon family="Ionicons" name="document-outline" size={16} color={Colors.accent} />
                          <AppText variant="caption" color={Colors.accent} style={{flex: 1, marginLeft: s(8)}}>
                            {doc}
                          </AppText>
                          <Icon family="Ionicons" name="download-outline" size={16} color={Colors.accent} />
                        </TouchableOpacity>
                      ))}
                    </View>
                  )}

                  {/* Action buttons */}
                  <View style={sty.actionRow}>
                    <TouchableOpacity
                      style={sty.actionBtnFilled}
                      onPress={() => Alert.alert('Download', 'PDF download coming soon')}
                      activeOpacity={0.7}>
                      <Icon family="Ionicons" name="download-outline" size={16} color={Colors.white} />
                      <AppText variant="small" color={Colors.white} style={{fontWeight: '600', marginLeft: s(6)}}>
                        Download PDF
                      </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={sty.actionBtnOutline}
                      onPress={() => {
                        if (selectedInvoice.claimStatus === 'none') {
                          Alert.alert('File claim', 'Claim filing coming soon');
                        } else {
                          Alert.alert('Share', 'Share coming soon');
                        }
                      }}
                      activeOpacity={0.7}>
                      <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>
                        {selectedInvoice.claimStatus === 'none' ? 'File claim' : 'Share'}
                      </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={sty.actionBtnIcon}
                      onPress={() => Alert.alert('Share', 'Share coming soon')}
                      activeOpacity={0.7}>
                      <Icon family="Ionicons" name="share-outline" size={18} color={Colors.primary} />
                    </TouchableOpacity>
                  </View>

                  <View style={{height: vs(30)}} />
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ── 7. Add Record Modal ── */}
      <Modal
        visible={showAdd}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAdd(false)}>
        <View style={sty.modalOverlay}>
          <View style={sty.addSheet}>
            <View style={sty.dragHandle} />
            <TouchableOpacity style={sty.sheetCloseAdd} onPress={() => setShowAdd(false)}>
              <Icon family="Ionicons" name="close" size={20} color={Colors.textSecondary} />
            </TouchableOpacity>
            <AppText variant="header" style={{marginTop: vs(6)}}>Add service invoice</AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(4)}}>
              Upload or enter a health service receipt
            </AppText>

            <View style={{marginTop: vs(16)}}>
              {ADD_OPTIONS.map((opt, i) => (
                <TouchableOpacity
                  key={i}
                  style={sty.addOptionCard}
                  activeOpacity={0.7}
                  onPress={() => {
                    setShowAdd(false);
                    Alert.alert(opt.title, opt.sub);
                  }}>
                  <View style={[sty.addOptionIcon, {backgroundColor: opt.bg}]}>
                    <AppText style={{fontSize: ms(20)}}>{opt.ico}</AppText>
                  </View>
                  <View style={{flex: 1, marginLeft: s(12)}}>
                    <AppText variant="bodyBold">{opt.title}</AppText>
                    <AppText variant="caption" color={Colors.textSecondary}>{opt.sub}</AppText>
                  </View>
                  <Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.textTertiary} />
                </TouchableOpacity>
              ))}
            </View>

            <View style={sty.ayuCard}>
              <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                <AppText style={{fontSize: ms(16), marginRight: s(8)}}>🌿</AppText>
                <AppText variant="caption" color={Colors.tealText} style={{flex: 1}}>
                  Ayu can extract provider name, service type, amount, GST, date and line items automatically from photos and PDFs.
                </AppText>
              </View>
            </View>
          </View>
        </View>
      </Modal>

      {/* ── 8. Visit Viewer Modal ── */}
      <Modal
        visible={showVisit}
        transparent
        animationType="slide"
        onRequestClose={() => setShowVisit(false)}>
        <View style={sty.modalOverlay}>
          <View style={sty.modalSheet}>
            {selectedVisitId && (() => {
              const vm = VISIT_META[selectedVisitId] || {};
              const visitInvoices = SERVICE_INVOICES.filter(
                i => i.visitId === selectedVisitId,
              );
              const totalAmt = visitInvoices.reduce((s, i) => s + i.amount, 0);
              return (
                <>
                  <View style={sty.sheetHeader}>
                    <View style={sty.dragHandle} />
                    <AppText variant="small" style={{color: 'rgba(255,255,255,0.5)', marginTop: vs(8), fontFamily: 'monospace'}}>
                      {selectedVisitId}
                    </AppText>
                    <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(4)}}>
                      {vm.title || 'Visit details'}
                    </AppText>
                    {vm.date && (
                      <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', marginTop: vs(2)}}>
                        {vm.date}
                      </AppText>
                    )}
                    <TouchableOpacity style={sty.sheetClose} onPress={() => setShowVisit(false)}>
                      <Icon family="Ionicons" name="close" size={20} color={Colors.white} />
                    </TouchableOpacity>
                  </View>
                  <ScrollView style={sty.sheetBody} showsVerticalScrollIndicator={false}>
                    {vm.note && (
                      <View style={sty.ayuCard}>
                        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                          <AppText style={{fontSize: ms(16), marginRight: s(8)}}>🌿</AppText>
                          <AppText variant="caption" color={Colors.tealText} style={{flex: 1}}>
                            {vm.note}
                          </AppText>
                        </View>
                      </View>
                    )}

                    {/* Stats row */}
                    <View style={sty.summaryGrid}>
                      <View style={sty.summaryCell}>
                        <AppText style={sty.statLabel}>Visit ID</AppText>
                        <AppText variant="bodyBold" style={{fontFamily: 'monospace', fontSize: ms(11)}}>{selectedVisitId}</AppText>
                      </View>
                      <View style={sty.summaryCell}>
                        <AppText style={sty.statLabel}>Records</AppText>
                        <AppText variant="bodyBold">{visitInvoices.length}</AppText>
                      </View>
                      <View style={sty.summaryCell}>
                        <AppText style={sty.statLabel}>Total</AppText>
                        <AppText variant="bodyBold" color={Colors.accent}>{fmt(totalAmt)}</AppText>
                      </View>
                    </View>

                    {visitInvoices.length > 1 && (
                      <View style={sty.ayuCard}>
                        <AppText variant="caption" color={Colors.tealText}>
                          This visit has {visitInvoices.length} linked records. You can file a combined insurance claim for all records in this visit.
                        </AppText>
                      </View>
                    )}

                    {/* Linked invoices */}
                    <AppText variant="sectionTitle" style={{marginBottom: vs(8)}}>Records in this visit</AppText>
                    {visitInvoices.map(inv => {
                      const meta = CAT_META[inv.cat] || {emoji: '📄'};
                      return (
                        <TouchableOpacity
                          key={inv.id}
                          style={sty.detailCard}
                          activeOpacity={0.7}
                          onPress={() => {
                            setShowVisit(false);
                            setTimeout(() => openDetail(inv), 350);
                          }}>
                          <View style={{flexDirection: 'row', alignItems: 'center'}}>
                            <View style={[sty.invIcon, {backgroundColor: CAT_ICON_BG[inv.cat] || Colors.tealBg, width: ms(36), height: ms(36)}]}>
                              <AppText style={{fontSize: ms(16)}}>{meta.emoji}</AppText>
                            </View>
                            <View style={{flex: 1, marginLeft: s(10)}}>
                              <AppText variant="bodyBold" numberOfLines={1}>{inv.name}</AppText>
                              <AppText variant="caption" color={Colors.textSecondary}>{inv.provider}</AppText>
                            </View>
                            <View style={{alignItems: 'flex-end'}}>
                              <AppText variant="bodyBold" color={Colors.primary}>{fmt(inv.amount)}</AppText>
                              <AppText variant="small" color={Colors.textTertiary}>{inv.date}</AppText>
                            </View>
                          </View>
                        </TouchableOpacity>
                      );
                    })}

                    {/* Actions */}
                    <View style={sty.actionRow}>
                      <TouchableOpacity
                        style={sty.actionBtnOutline}
                        onPress={() => {
                          Alert.alert('Copied', `Visit ID ${selectedVisitId} copied`);
                        }}
                        activeOpacity={0.7}>
                        <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>Copy Visit ID</AppText>
                      </TouchableOpacity>
                      <TouchableOpacity
                        style={sty.actionBtnFilled}
                        onPress={() => {
                          setShowVisit(false);
                          const firstClaimable = visitInvoices.find(i => i.claimStatus === 'none' && !INELIGIBLE_CATS.includes(i.cat));
                          if (firstClaimable) {
                            setTimeout(() => openClaimForm(firstClaimable), 350);
                          } else {
                            Alert.alert('No claimable records', 'All records in this visit are already claimed or ineligible.');
                          }
                        }}
                        activeOpacity={0.7}>
                        <AppText variant="small" color={Colors.white} style={{fontWeight: '600'}}>Combined claim</AppText>
                      </TouchableOpacity>
                    </View>

                    <View style={{height: vs(30)}} />
                  </ScrollView>
                </>
              );
            })()}
          </View>
        </View>
      </Modal>

      {/* ── 9. Claim Form Modal ── */}
      <Modal
        visible={showClaim}
        transparent
        animationType="slide"
        onRequestClose={() => setShowClaim(false)}>
        <View style={sty.modalOverlay}>
          <View style={sty.modalSheet}>
            {claimInv && (
              <>
                <View style={sty.sheetHeader}>
                  <View style={sty.dragHandle} />
                  <AppText variant="small" style={{color: 'rgba(255,255,255,0.5)', marginTop: vs(8)}}>
                    Step {claimStep} of 4
                  </AppText>
                  <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(4)}}>
                    File insurance claim
                  </AppText>
                  <TouchableOpacity style={sty.sheetClose} onPress={() => setShowClaim(false)}>
                    <Icon family="Ionicons" name="close" size={20} color={Colors.white} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={sty.sheetBody} showsVerticalScrollIndicator={false}>
                  {/* Step indicator */}
                  <View style={sty.stepRow}>
                    {[1, 2, 3, 4].map((step, i) => (
                      <React.Fragment key={step}>
                        {i > 0 && (
                          <View style={[sty.stepLine, claimStep > step - 1 && sty.stepLineDone]} />
                        )}
                        <View style={[sty.stepDot, claimStep === step && sty.stepDotOn, claimStep > step && sty.stepDotDone]}>
                          {claimStep > step ? (
                            <Icon family="Ionicons" name="checkmark" size={14} color={Colors.primary} />
                          ) : (
                            <AppText variant="small" color={claimStep === step ? Colors.white : Colors.textTertiary} style={{fontWeight: '700'}}>
                              {step}
                            </AppText>
                          )}
                        </View>
                      </React.Fragment>
                    ))}
                  </View>

                  {/* Step 1: Patient & Policy */}
                  {claimStep === 1 && (
                    <View>
                      <AppText variant="sectionTitle" style={{marginBottom: vs(12)}}>Patient & policy details</AppText>
                      <View style={sty.detailCard}>
                        <AppText style={sty.formLabel}>Patient name</AppText>
                        <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600'}}>{POLICY_INFO.patientName}</AppText></View>
                        <AppText style={[sty.formLabel, {marginTop: vs(10)}]}>Date of birth</AppText>
                        <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600'}}>{POLICY_INFO.dob}</AppText></View>
                        <AppText style={[sty.formLabel, {marginTop: vs(10)}]}>Policy number</AppText>
                        <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600', fontFamily: 'monospace'}}>{POLICY_INFO.policyNumber}</AppText></View>
                        <AppText style={[sty.formLabel, {marginTop: vs(10)}]}>Insurer</AppText>
                        <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600'}}>{POLICY_INFO.insurer}</AppText></View>
                        <AppText style={[sty.formLabel, {marginTop: vs(10)}]}>Plan</AppText>
                        <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600'}}>{POLICY_INFO.plan}</AppText></View>
                        <AppText style={[sty.formLabel, {marginTop: vs(10)}]}>Member ID</AppText>
                        <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600', fontFamily: 'monospace'}}>{POLICY_INFO.memberId}</AppText></View>
                      </View>
                      <View style={sty.ayuCard}>
                        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                          <AppText style={{fontSize: ms(16), marginRight: s(8)}}>🌿</AppText>
                          <AppText variant="caption" color={Colors.tealText} style={{flex: 1}}>
                            These details are pre-filled from your policy. Verify before continuing.
                          </AppText>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Step 2: Service Details */}
                  {claimStep === 2 && (
                    <View>
                      <AppText variant="sectionTitle" style={{marginBottom: vs(12)}}>Service details</AppText>
                      <View style={sty.detailCard}>
                        <AppText style={sty.formLabel}>Service type</AppText>
                        <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600'}}>{claimInv.type}</AppText></View>
                        <AppText style={[sty.formLabel, {marginTop: vs(10)}]}>Provider</AppText>
                        <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600'}}>{claimInv.provider}</AppText></View>
                        {claimInv.visitId && (
                          <>
                            <AppText style={[sty.formLabel, {marginTop: vs(10)}]}>Visit ID</AppText>
                            <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600', fontFamily: 'monospace'}}>{claimInv.visitId}</AppText></View>
                          </>
                        )}
                        <AppText style={[sty.formLabel, {marginTop: vs(10)}]}>Date of service</AppText>
                        <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600'}}>{claimInv.date}</AppText></View>
                        <AppText style={[sty.formLabel, {marginTop: vs(10)}]}>Invoice ref</AppText>
                        <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600', fontFamily: 'monospace'}}>{claimInv.ref}</AppText></View>
                        {claimInv.icdCode && (
                          <>
                            <AppText style={[sty.formLabel, {marginTop: vs(10)}]}>ICD code</AppText>
                            <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600', fontFamily: 'monospace'}}>{claimInv.icdCode}</AppText></View>
                          </>
                        )}
                        {claimInv.diagnosis && (
                          <>
                            <AppText style={[sty.formLabel, {marginTop: vs(10)}]}>Diagnosis</AppText>
                            <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600'}}>{claimInv.diagnosis}</AppText></View>
                          </>
                        )}
                        {claimInv.doctor && (
                          <>
                            <AppText style={[sty.formLabel, {marginTop: vs(10)}]}>Doctor</AppText>
                            <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600'}}>{claimInv.doctor}</AppText></View>
                          </>
                        )}
                        {claimInv.prescriptionRef && (
                          <>
                            <AppText style={[sty.formLabel, {marginTop: vs(10)}]}>Prescription ref</AppText>
                            <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600', fontFamily: 'monospace'}}>{claimInv.prescriptionRef}</AppText></View>
                          </>
                        )}
                        <AppText style={[sty.formLabel, {marginTop: vs(10)}]}>Claim amount</AppText>
                        <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '700'}}>{fmt(claimInv.amount)}</AppText></View>
                        {claimInv.gst > 0 && (
                          <>
                            <AppText style={[sty.formLabel, {marginTop: vs(10)}]}>GST</AppText>
                            <View style={sty.formInput}><AppText variant="caption" color={Colors.tealText} style={{fontWeight: '600'}}>{fmt(claimInv.gst)}</AppText></View>
                          </>
                        )}
                      </View>
                    </View>
                  )}

                  {/* Step 3: Documents */}
                  {claimStep === 3 && (
                    <View>
                      <AppText variant="sectionTitle" style={{marginBottom: vs(12)}}>Documents</AppText>
                      <View style={sty.detailCard}>
                        {/* Auto-attached docs */}
                        {(claimInv.docs || []).map((doc, i) => (
                          <View key={i} style={[sty.docRow, {justifyContent: 'space-between'}]}>
                            <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                              <Icon family="Ionicons" name="document-outline" size={16} color={Colors.accent} />
                              <AppText variant="caption" color={Colors.textPrimary} style={{marginLeft: s(8), flex: 1}}>{doc}</AppText>
                            </View>
                            <View style={{flexDirection: 'row', alignItems: 'center'}}>
                              <Icon family="Ionicons" name="checkmark-circle" size={18} color={Colors.accent} />
                              <AppText variant="small" color={Colors.accent} style={{marginLeft: s(4), fontWeight: '600'}}>Attached</AppText>
                            </View>
                          </View>
                        ))}
                        {/* Upload missing */}
                        <TouchableOpacity
                          style={[sty.docRow, {justifyContent: 'space-between'}]}
                          onPress={() => Alert.alert('Upload', 'Document upload coming soon')}>
                          <View style={{flexDirection: 'row', alignItems: 'center', flex: 1}}>
                            <Icon family="Ionicons" name="cloud-upload-outline" size={16} color={Colors.primary} />
                            <AppText variant="caption" color={Colors.primary} style={{marginLeft: s(8), fontWeight: '600'}}>Upload additional document</AppText>
                          </View>
                          <Icon family="Ionicons" name="add-circle-outline" size={18} color={Colors.primary} />
                        </TouchableOpacity>
                      </View>
                      <View style={sty.ayuCard}>
                        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                          <AppText style={{fontSize: ms(16), marginRight: s(8)}}>🌿</AppText>
                          <AppText variant="caption" color={Colors.tealText} style={{flex: 1}}>
                            Ayu has auto-attached all available documents for this invoice. Upload any additional supporting documents if needed.
                          </AppText>
                        </View>
                      </View>
                    </View>
                  )}

                  {/* Step 4: Sign & Submit */}
                  {claimStep === 4 && (
                    <View>
                      <AppText variant="sectionTitle" style={{marginBottom: vs(12)}}>Sign & submit</AppText>
                      <View style={sty.detailCard}>
                        <AppText style={sty.formLabel}>Type your full name to sign</AppText>
                        <TextInput
                          style={sty.sigInput}
                          placeholder="Full name as on policy"
                          placeholderTextColor={Colors.textTertiary}
                          value={sigName}
                          onChangeText={setSigName}
                        />
                        {sigName.length > 0 && (
                          <AppText style={sty.sigPreview}>{sigName}</AppText>
                        )}
                      </View>
                      <View style={sty.actionRow}>
                        <TouchableOpacity
                          style={[sty.actionBtnFilled, {opacity: sigName.trim().length > 0 ? 1 : 0.5}]}
                          disabled={sigName.trim().length === 0}
                          onPress={() => {
                            const ref = 'CLM-' + Date.now().toString(36).toUpperCase();
                            setClaimResult({
                              mode: 'digital',
                              ref,
                              inv: claimInv,
                              name: sigName,
                            });
                            setShowClaim(false);
                            setShowClaimDone(true);
                          }}
                          activeOpacity={0.7}>
                          <Icon family="Ionicons" name="send-outline" size={16} color={Colors.white} />
                          <AppText variant="small" color={Colors.white} style={{fontWeight: '600', marginLeft: s(6)}}>
                            Submit digitally
                          </AppText>
                        </TouchableOpacity>
                        <TouchableOpacity
                          style={sty.actionBtnOutline}
                          onPress={() => {
                            const ref = 'CLM-' + Date.now().toString(36).toUpperCase();
                            setClaimResult({
                              mode: 'download',
                              ref,
                              inv: claimInv,
                              name: sigName || 'Unsigned',
                            });
                            setShowClaim(false);
                            setShowClaimDone(true);
                          }}
                          activeOpacity={0.7}>
                          <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>
                            Download form
                          </AppText>
                        </TouchableOpacity>
                      </View>
                    </View>
                  )}

                  {/* Back / Continue */}
                  <View style={[sty.actionRow, {marginTop: vs(16)}]}>
                    {claimStep > 1 && (
                      <TouchableOpacity
                        style={sty.actionBtnOutline}
                        onPress={() => setClaimStep(prev => prev - 1)}
                        activeOpacity={0.7}>
                        <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>Back</AppText>
                      </TouchableOpacity>
                    )}
                    {claimStep < 4 && (
                      <TouchableOpacity
                        style={sty.actionBtnFilled}
                        onPress={() => setClaimStep(prev => prev + 1)}
                        activeOpacity={0.7}>
                        <AppText variant="small" color={Colors.white} style={{fontWeight: '600'}}>Continue</AppText>
                      </TouchableOpacity>
                    )}
                  </View>

                  <View style={{height: vs(30)}} />
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

      {/* ── 10. Claim Success Modal ── */}
      <Modal
        visible={showClaimDone}
        transparent
        animationType="slide"
        onRequestClose={() => setShowClaimDone(false)}>
        <View style={sty.modalOverlay}>
          <View style={sty.modalSheet}>
            {claimResult && (
              <>
                <View style={[sty.sheetHeader, {alignItems: 'center', paddingBottom: vs(24)}]}>
                  <View style={sty.dragHandle} />
                  <View style={{
                    width: ms(56), height: ms(56), borderRadius: ms(28),
                    backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center',
                    justifyContent: 'center', marginTop: vs(16),
                  }}>
                    <Icon family="Ionicons" name="checkmark-circle" size={36} color={Colors.white} />
                  </View>
                  <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(10)}}>
                    {claimResult.mode === 'digital' ? 'Submitted to insurer' : 'Ready to download'}
                  </AppText>
                  <AppText variant="caption" style={{color: 'rgba(255,255,255,0.6)', marginTop: vs(4), fontFamily: 'monospace'}}>
                    {claimResult.ref}
                  </AppText>
                  <TouchableOpacity style={sty.sheetClose} onPress={() => setShowClaimDone(false)}>
                    <Icon family="Ionicons" name="close" size={20} color={Colors.white} />
                  </TouchableOpacity>
                </View>
                <ScrollView style={sty.sheetBody} showsVerticalScrollIndicator={false}>
                  <View style={sty.detailCard}>
                    <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>Claim details</AppText>
                    <DetailRow icon="document-text-outline" label="Claim for" value={claimResult.inv.name} />
                    {claimResult.inv.visitId && (
                      <DetailRow icon="git-network-outline" label="Visit ID" value={claimResult.inv.visitId} mono />
                    )}
                    <DetailRow icon="cash-outline" label="Amount" value={fmt(claimResult.inv.amount)} />
                    <DetailRow icon="shield-checkmark-outline" label="Policy" value={POLICY_INFO.policyNumber} mono />
                    <DetailRow icon="calendar-outline" label="Submitted" value={new Date().toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'})} />
                    <DetailRow icon="barcode-outline" label="Reference" value={claimResult.ref} mono />
                    <DetailRow icon="cloud-outline" label="Mode" value={claimResult.mode === 'digital' ? 'Digital submission' : 'Manual download'} />
                  </View>

                  <View style={sty.ayuCard}>
                    <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                      <AppText style={{fontSize: ms(16), marginRight: s(8)}}>🌿</AppText>
                      <AppText variant="caption" color={Colors.tealText} style={{flex: 1}}>
                        Ayu will track this claim and notify you of any status updates from the insurer. You can view claim progress anytime from the invoice detail screen.
                      </AppText>
                    </View>
                  </View>

                  <View style={sty.actionRow}>
                    <TouchableOpacity
                      style={sty.actionBtnOutline}
                      onPress={() => Alert.alert('Track', 'Claim tracking coming soon')}
                      activeOpacity={0.7}>
                      <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>Track claim</AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={sty.actionBtnFilled}
                      onPress={() => setShowClaimDone(false)}
                      activeOpacity={0.7}>
                      <AppText variant="small" color={Colors.white} style={{fontWeight: '600'}}>Done</AppText>
                    </TouchableOpacity>
                  </View>

                  <View style={{height: vs(30)}} />
                </ScrollView>
              </>
            )}
          </View>
        </View>
      </Modal>

    </View>
  );
};

/* ─── Detail row helper ─── */
const DetailRow = ({icon, label, value, mono}) => (
  <View style={sty.detailRow}>
    <View style={sty.detailRowIcon}>
      <Icon family="Ionicons" name={icon} size={14} color={Colors.textTertiary} />
    </View>
    <AppText variant="caption" color={Colors.textTertiary} style={{width: s(70)}}>{label}</AppText>
    <AppText
      variant="caption"
      color={Colors.textPrimary}
      style={[{flex: 1}, mono && {fontFamily: 'monospace'}]}>
      {value}
    </AppText>
  </View>
);

/* ══════════════════════════════════════════════ */
/*  STYLES                                        */
/* ══════════════════════════════════════════════ */
const sty = StyleSheet.create({
  /* Stats strip */
  statsCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    flexDirection: 'row',
    paddingVertical: vs(14),
    marginBottom: vs(8),
    overflow: 'hidden',
  },
  statCol: {flex: 1, alignItems: 'center'},
  statDivider: {width: 1, backgroundColor: Colors.borderLight, marginVertical: vs(4)},
  statValue: {fontSize: ms(16), fontWeight: '700', color: Colors.accent},
  statLabel: {
    fontSize: ms(8),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.6,
    color: Colors.textTertiary,
    marginTop: vs(2),
  },
  statSub: {fontSize: ms(9), color: Colors.textTertiary, marginTop: vs(1)},

  /* Filter pills */
  pillScroll: {paddingBottom: vs(8), paddingTop: vs(2)},
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(13),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    marginRight: s(8),
  },
  pillActive: {backgroundColor: Colors.primary},
  pillInactive: {backgroundColor: Colors.white},

  /* Search */
  searchWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    marginBottom: vs(8),
  },
  searchInput: {
    flex: 1,
    marginLeft: s(8),
    fontSize: ms(12),
    color: Colors.textPrimary,
    padding: 0,
  },

  /* Pending claim banner */
  claimBanner: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: vs(8),
  },
  claimBannerRow: {flexDirection: 'row', alignItems: 'flex-start'},

  /* Cards */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    overflow: 'hidden',
    marginBottom: vs(8),
  },

  /* Invoice row */
  invRow: {flexDirection: 'row', padding: ms(12), alignItems: 'flex-start'},
  invIcon: {
    width: ms(46),
    height: ms(46),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  invBody: {flex: 1, marginLeft: s(10)},
  invType: {
    fontSize: ms(8),
    fontWeight: '700',
    color: Colors.textTertiary,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  invName: {fontSize: ms(13), fontWeight: '700', color: Colors.textPrimary, marginTop: vs(1)},
  invRight: {alignItems: 'flex-end', marginLeft: s(8)},
  invAmount: {fontSize: ms(14), fontWeight: '700', color: Colors.primary},

  /* Tags */
  tagRow: {flexDirection: 'row', flexWrap: 'wrap', marginTop: vs(5)},
  tag: {
    paddingHorizontal: s(7),
    paddingVertical: vs(2),
    borderRadius: ms(6),
    marginRight: s(5),
    marginBottom: vs(2),
  },
  tagText: {fontSize: ms(8), fontWeight: '700'},

  /* Invoice footer */
  invFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: ms(12),
    paddingVertical: vs(8),
  },
  invRef: {fontFamily: 'monospace', fontSize: ms(9), color: Colors.textTertiary},
  footerAction: {fontSize: ms(10), fontWeight: '600', color: Colors.accent},

  /* Section header */
  sectionHeader: {marginTop: vs(8), marginBottom: vs(6)},

  /* Empty state */
  emptyWrap: {alignItems: 'center', paddingVertical: vs(40)},
  emptyBtn: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(20),
    paddingVertical: vs(10),
    borderRadius: ms(20),
    marginTop: vs(14),
  },

  /* Modal overlay */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },

  /* Detail modal sheet */
  modalSheet: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: ms(22),
    borderTopRightRadius: ms(22),
    maxHeight: '92%',
    overflow: 'hidden',
  },
  sheetHeader: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(20),
    paddingBottom: vs(18),
    paddingTop: vs(10),
    alignItems: 'flex-start',
  },
  dragHandle: {
    width: ms(36),
    height: ms(4),
    borderRadius: ms(2),
    backgroundColor: 'rgba(255,255,255,0.3)',
    alignSelf: 'center',
  },
  sheetClose: {position: 'absolute', top: vs(12), right: s(16)},
  sheetBody: {paddingHorizontal: s(16), paddingTop: vs(14)},

  /* Ayu note */
  ayuCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(12),
    padding: ms(12),
    marginBottom: vs(10),
    marginTop: vs(4),
  },

  /* Summary grid */
  summaryGrid: {
    flexDirection: 'row',
    marginBottom: vs(10),
  },
  summaryCell: {flex: 1, marginRight: s(8)},

  /* Detail card */
  detailCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: vs(10),
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  detailRowIcon: {
    width: ms(26),
    height: ms(26),
    borderRadius: ms(13),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(8),
  },

  /* Line items */
  lineItemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(5),
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: Colors.accent,
    borderRadius: ms(8),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    marginTop: vs(8),
  },

  /* Claim badge */
  claimBadge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(8),
  },

  /* Timeline */
  timelineStep: {flexDirection: 'row'},
  timelineLeft: {alignItems: 'center', width: ms(20), marginRight: s(8)},
  timelineDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
  },
  timelineLine: {
    width: ms(2),
    flex: 1,
    marginVertical: vs(2),
  },

  /* Documents */
  docRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },

  /* Action buttons */
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(6),
  },
  actionBtnFilled: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(12),
    marginRight: s(8),
  },
  actionBtnOutline: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(12),
    marginRight: s(8),
  },
  actionBtnIcon: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(12),
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Add modal */
  addSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: ms(22),
    borderTopRightRadius: ms(22),
    paddingHorizontal: s(20),
    paddingTop: vs(10),
    paddingBottom: vs(30),
  },
  sheetCloseAdd: {position: 'absolute', top: vs(12), right: s(16)},
  addOptionCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },
  addOptionIcon: {
    width: ms(46),
    height: ms(46),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Visit chip */
  visitChip: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(6), backgroundColor: Colors.background, borderWidth: 0.5, borderColor: Colors.borderLight},
  visitChipLinked: {backgroundColor: Colors.tealBg, borderColor: Colors.accent},

  /* Claim strip */
  claimStrip: {flexDirection: 'row', alignItems: 'center', gap: s(8), paddingHorizontal: s(13), paddingVertical: vs(7), borderTopWidth: 0.5, borderTopColor: Colors.borderLight, backgroundColor: Colors.white},
  claimPill: {paddingHorizontal: s(9), paddingVertical: vs(3), borderRadius: ms(8)},
  claimBtn: {paddingHorizontal: s(12), paddingVertical: vs(5), borderRadius: ms(7), backgroundColor: Colors.primary},

  /* Claim form steps */
  stepRow: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(18)},
  stepDot: {width: ms(26), height: ms(26), borderRadius: ms(13), alignItems: 'center', justifyContent: 'center', borderWidth: 1.5, borderColor: Colors.borderLight, backgroundColor: Colors.background},
  stepDotOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  stepDotDone: {backgroundColor: Colors.tealBg, borderColor: Colors.primary},
  stepLine: {flex: 1, height: 1.5, backgroundColor: Colors.borderLight},
  stepLineDone: {backgroundColor: Colors.primary},
  formLabel: {fontSize: ms(10), fontWeight: '600', color: Colors.textSecondary, marginBottom: vs(4)},
  formInput: {backgroundColor: Colors.tealBg, borderWidth: 0.5, borderColor: Colors.accent, borderRadius: ms(10), paddingHorizontal: s(12), paddingVertical: vs(10), fontSize: ms(12), fontWeight: '600', color: Colors.tealText},
  sigInput: {backgroundColor: Colors.white, borderWidth: 0.5, borderColor: Colors.borderLight, borderRadius: ms(10), paddingHorizontal: s(12), paddingVertical: vs(11), fontSize: ms(13), fontWeight: '700', color: Colors.textPrimary},
  sigPreview: {fontSize: ms(22), fontWeight: '800', color: Colors.accent, fontStyle: 'italic', marginTop: vs(8), minHeight: vs(32), borderBottomWidth: 1, borderBottomColor: Colors.borderLight, paddingBottom: vs(4)},

  /* FAB */
  fab: {
    position: 'absolute',
    bottom: vs(20),
    right: s(16),
    width: ms(52),
    height: ms(52),
    borderRadius: ms(26),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 6,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 3},
    shadowOpacity: 0.25,
    shadowRadius: 4,
  },
});

export default ServiceRecordsTab;
