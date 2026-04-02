import React, {useState} from 'react';
import {
  View,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  StyleSheet,
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
  MAIN_TABS,
  RIBBON_FILTERS,
  STATS_HEADER,
  MEDICAL_RECORDS,
  HEALTH_LOGS,
  GADGETS,
  INSURANCE_RECORDS,
} from '../../constants/recordsFinalData';

const borderTertiary = '#d1d5db';
const backgroundSecondary = '#F3F4F6';

/* ─── Pill style map (pg, pr, pa, pb, pp, pn) ─── */
const PILL_STYLES = {
  pg: {bg: Colors.tealBg, color: Colors.tealText},
  pr: {bg: Colors.redBg, color: Colors.redText},
  pa: {bg: Colors.amberBg, color: Colors.amberText},
  pb: {bg: Colors.blueBg, color: Colors.blueText},
  pp: {bg: Colors.purpleBg, color: Colors.purpleText},
  pn: {bg: Colors.pinkBg, color: '#72243E'},
};

const getPillStyle = key => PILL_STYLES[key] || PILL_STYLES.pg;

/* ─── Value chip variant map ─── */
const VALUE_STYLES = {
  pg: {bg: Colors.tealBg, color: Colors.tealText, border: Colors.accent},
  pr: {bg: Colors.redBg, color: Colors.redText, border: Colors.red},
  pa: {bg: Colors.amberBg, color: Colors.amberText, border: Colors.amber},
  pb: {bg: Colors.blueBg, color: Colors.blueText, border: Colors.blue},
  pp: {bg: Colors.purpleBg, color: Colors.purpleText, border: Colors.purple},
};

const getValueStyle = key => VALUE_STYLES[key] || VALUE_STYLES.pg;

/* ─── Progress bar helper ─── */
const ProgressBar = ({pct, color, height = ms(6)}) => (
  <View style={[sty.barTrack, {height}]}>
    <View
      style={[
        sty.barFill,
        {width: `${Math.min(pct, 100)}%`, backgroundColor: color, height},
      ]}
    />
  </View>
);

/* ─── Date group separator ─── */
const DateSeparator = ({label}) => (
  <View style={sty.sepRow}>
    <AppText variant="small" color={Colors.textTertiary} style={sty.sepText}>
      {label.toUpperCase()}
    </AppText>
    <View style={sty.sepLine} />
  </View>
);

/* ─── Warranty color helper ─── */
const warrantyColor = days => {
  if (days <= 0) return Colors.red;
  if (days < 30) return Colors.red;
  if (days <= 180) return Colors.amber;
  return Colors.teal;
};

/* ═══════════════════════════════════════════════ */
/*  RecordsFinalTab                                */
/* ═══════════════════════════════════════════════ */
const RecordsFinalTab = ({navigation}) => {
  const [activeMainTab, setActiveMainTab] = useState('medical');
  const [activeSubTab, setActiveSubTab] = useState('all');
  const [search, setSearch] = useState('');
  const [showDetail, setShowDetail] = useState(false);
  const [selectedRecord, setSelectedRecord] = useState(null);
  /* ─── Switch main tab ─── */
  const switchMainTab = key => {
    setActiveMainTab(key);
    setActiveSubTab('all');
    setSearch('');
  };

  /* ─── Open detail modal (or navigate to detail screen for notes/labs/imaging/rx) ─── */
  const openDetail = (record) => {
    const DETAIL_CATS = ['notes', 'labs', 'imaging', 'rx'];
    if (DETAIL_CATS.includes(record.cat)) {
      navigation.navigate('RecordDetail', {cat: record.cat, record});
      return;
    }
    // For other cats, keep opening the modal
    setSelectedRecord(record);
    setShowDetail(true);
  };

  /* ─── Filtering helpers ─── */
  const filterBySearch = list => {
    if (!search.trim()) return list;
    const q = search.toLowerCase();
    return list.filter(
      r =>
        (r.title && r.title.toLowerCase().includes(q)) ||
        (r.sub && r.sub.toLowerCase().includes(q)),
    );
  };

  const getFilteredMedical = () => {
    let list = MEDICAL_RECORDS;
    if (activeSubTab !== 'all') {
      list = list.filter(r => r.cat === activeSubTab);
    }
    return filterBySearch(list);
  };

  const getFilteredLogs = () => {
    let list = HEALTH_LOGS;
    if (activeSubTab !== 'all') {
      list = list.filter(r => r.cat === activeSubTab);
    }
    return filterBySearch(list);
  };

  const getFilteredGadgets = () => {
    return filterBySearch(GADGETS);
  };

  /* ─── Group records by dateGroup ─── */
  const groupByDate = records => {
    const grouped = {};
    const order = [];
    records.forEach(r => {
      const key = r.dateGroup || 'Other';
      if (!grouped[key]) {
        grouped[key] = [];
        order.push(key);
      }
      grouped[key].push(r);
    });
    return {grouped, order};
  };

  /* ═══════════════════════════════════════════════ */
  /*  1. STATS STRIP                                 */
  /* ═══════════════════════════════════════════════ */
  const renderStats = () => (
    <View style={sty.statsCard}>
      <View style={sty.statCol}>
        <AppText style={sty.statValue}>{STATS_HEADER.medical}</AppText>
        <AppText style={sty.statLabel}>Medical</AppText>
        <AppText style={sty.statSub}>{STATS_HEADER.medicalLabel}</AppText>
      </View>
      <View style={sty.statDivider} />
      <View style={sty.statCol}>
        <AppText style={sty.statValue}>{STATS_HEADER.logs}</AppText>
        <AppText style={sty.statLabel}>Health logs</AppText>
        <AppText style={sty.statSub}>{STATS_HEADER.logsLabel}</AppText>
      </View>
      <View style={sty.statDivider} />
      <View style={sty.statCol}>
        <AppText style={sty.statValue}>{STATS_HEADER.bills}</AppText>
        <AppText style={sty.statLabel}>Bills</AppText>
        <AppText style={sty.statSub}>{STATS_HEADER.billsAmount}</AppText>
      </View>
      <View style={sty.statDivider} />
      <View style={sty.statCol}>
        <AppText style={sty.statValue}>{STATS_HEADER.claims}</AppText>
        <AppText style={sty.statLabel}>Claims</AppText>
        <AppText style={sty.statSub}>{STATS_HEADER.claimsAmount}</AppText>
      </View>
    </View>
  );

  /* ═══════════════════════════════════════════════ */
  /*  2. MAIN TABS (pill style)                      */
  /* ═══════════════════════════════════════════════ */
  const renderMainTabs = () => (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={sty.mainTabScroll}>
      {MAIN_TABS.map(tab => {
        const active = activeMainTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[sty.mainPill, active ? sty.mainPillActive : sty.mainPillInactive]}
            onPress={() => switchMainTab(tab.key)}
            activeOpacity={0.7}>
            <Icon
              family="Ionicons"
              name={tab.ico}
              size={14}
              color={active ? Colors.white : Colors.textSecondary}
            />
            <AppText
              variant="small"
              color={active ? Colors.white : Colors.textSecondary}
              style={active ? {fontWeight: '600'} : undefined}>
              {tab.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  /* ═══════════════════════════════════════════════ */
  /*  3. SUB-TAB RIBBON                              */
  /* ═══════════════════════════════════════════════ */
  const renderRibbon = () => {
    const ribbons = RIBBON_FILTERS[activeMainTab];
    if (!ribbons) return null;
    return (
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={sty.ribbonScroll}>
        {ribbons.map(item => {
          const active = activeSubTab === item.key;
          return (
            <TouchableOpacity
              key={item.key}
              style={[sty.ribbonItem, active && sty.ribbonItemActive]}
              onPress={() => setActiveSubTab(item.key)}
              activeOpacity={0.7}>
              <View
                style={[
                  sty.ribbonIconWrap,
                  {backgroundColor: active ? Colors.primary : item.bg},
                ]}>
                <Icon
                  family="Ionicons"
                  name={item.ico}
                  size={16}
                  color={active ? Colors.white : Colors.textSecondary}
                />
              </View>
              <AppText
                variant="small"
                color={active ? Colors.primary : Colors.textSecondary}
                style={[sty.ribbonLabel, active && {fontWeight: '600'}]}
                numberOfLines={1}>
                {item.label}
              </AppText>
              <View style={[sty.countBadge, active && sty.countBadgeActive]}>
                <AppText
                  variant="small"
                  color={active ? Colors.white : Colors.textTertiary}
                  style={{fontSize: ms(8), fontWeight: '600'}}>
                  {item.count}
                </AppText>
              </View>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    );
  };

  /* ═══════════════════════════════════════════════ */
  /*  4. SEARCH + SORT ROW                           */
  /* ═══════════════════════════════════════════════ */
  const renderSearchRow = () => (
    <View style={sty.searchRow}>
      <View style={sty.searchInput}>
        <Icon family="Ionicons" name="search-outline" size={16} color={Colors.textTertiary} />
        <TextInput
          style={sty.searchField}
          placeholder="Search records..."
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
      <TouchableOpacity style={sty.searchBtn} activeOpacity={0.7}>
        <Icon family="Ionicons" name="swap-vertical-outline" size={18} color={Colors.textSecondary} />
      </TouchableOpacity>
      <TouchableOpacity style={sty.searchBtn} activeOpacity={0.7}>
        <Icon family="Ionicons" name="filter-outline" size={18} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  );

  /* ═══════════════════════════════════════════════ */
  /*  5A. MEDICAL CARDS                              */
  /* ═══════════════════════════════════════════════ */
  const renderMedicalCard = rec => {
    const ps = getPillStyle(rec.pillStyle);
    return (
      <TouchableOpacity
        key={rec.id}
        style={sty.card}
        activeOpacity={0.7}
        onPress={() => openDetail(rec)}>
        {/* Top row */}
        <View style={sty.recTop}>
          <View style={[sty.recIcon, {backgroundColor: rec.icoBg}]}>
            <AppText style={{fontSize: ms(18)}}>{rec.ico}</AppText>
          </View>
          <View style={sty.recMain}>
            <AppText style={sty.cardTitle} numberOfLines={1}>
              {rec.title}
            </AppText>
            <AppText style={sty.cardSub} numberOfLines={2}>
              {rec.sub}
            </AppText>
            <View style={sty.metaRow}>
              <View style={[sty.pill, {backgroundColor: ps.bg}]}>
                <AppText style={[sty.pillText, {color: ps.color}]}>{rec.pillLabel}</AppText>
              </View>
              <AppText variant="caption" color={Colors.textTertiary} numberOfLines={1} style={{flex: 1}}>
                {rec.meta}
              </AppText>
            </View>
          </View>
        </View>

        {/* Value chips (labs, some rx) */}
        {rec.values && rec.values.length > 0 && (
          <View style={sty.chipsRow}>
            {rec.values.map((v, i) => {
              const vs2 = getValueStyle(v.style);
              return (
                <View key={i} style={[sty.valueChip, {backgroundColor: vs2.bg, borderColor: vs2.border}]}>
                  <AppText style={[sty.valueChipText, {color: vs2.color}]}>{v.label}</AppText>
                </View>
              );
            })}
          </View>
        )}

        {/* Footer */}
        {rec.footerTags && rec.footerTags.length > 0 && (
          <View style={sty.recFooter}>
            <View style={sty.footerTagsWrap}>
              {rec.footerTags.map((t, i) => {
                const ts = getPillStyle(t.style);
                return (
                  <View key={i} style={[sty.footerTag, {backgroundColor: ts.bg}]}>
                    <AppText style={[sty.footerTagText, {color: ts.color}]}>{t.label}</AppText>
                  </View>
                );
              })}
              {rec.visitId && (
                <View style={[sty.visitChip, sty.visitChipLinked]}>
                  <AppText style={sty.visitChipText}>
                    {rec.visitId}
                    {rec.linkedCount > 0 ? ` \u00B7 ${rec.linkedCount} linked` : ''}
                  </AppText>
                </View>
              )}
            </View>
            <Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.textTertiary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderMedicalCards = () => {
    const filtered = getFilteredMedical();
    if (filtered.length === 0) return renderEmpty('No medical records found');
    const {grouped, order} = groupByDate(filtered);
    return order.map(dateKey => (
      <View key={dateKey}>
        <DateSeparator label={dateKey} />
        {grouped[dateKey].map(rec => renderMedicalCard(rec))}
      </View>
    ));
  };

  /* ═══════════════════════════════════════════════ */
  /*  5B. HEALTH LOG CARDS                           */
  /* ═══════════════════════════════════════════════ */
  const renderHealthLogCard = rec => {
    const ps = getPillStyle(rec.pillStyle);
    return (
      <TouchableOpacity
        key={rec.id}
        style={sty.card}
        activeOpacity={0.7}
        onPress={() => openDetail(rec)}>
        {/* Top row */}
        <View style={sty.recTop}>
          <View style={[sty.recIcon, {backgroundColor: rec.icoBg}]}>
            <AppText style={{fontSize: ms(18)}}>{rec.ico}</AppText>
          </View>
          <View style={sty.recMain}>
            <AppText style={sty.cardTitle} numberOfLines={1}>
              {rec.title}
            </AppText>
            <AppText style={sty.cardSub} numberOfLines={2}>
              {rec.sub}
            </AppText>
            <View style={sty.metaRow}>
              <View style={[sty.pill, {backgroundColor: ps.bg}]}>
                <AppText style={[sty.pillText, {color: ps.color}]}>{rec.pillLabel}</AppText>
              </View>
              <AppText variant="caption" color={Colors.textTertiary} numberOfLines={1} style={{flex: 1}}>
                {rec.meta}
              </AppText>
            </View>
          </View>
        </View>

        {/* Habit grid (lifestyle snapshots) */}
        {rec.habitGrid && (
          <View style={sty.habitGridWrap}>
            <View style={sty.habitRow}>
              {['sleep', 'steps'].map(k => {
                const g = rec.habitGrid[k];
                if (!g) return null;
                return (
                  <View key={k} style={sty.habitCell}>
                    <View style={sty.habitCellHeader}>
                      <AppText variant="caption" color={Colors.textSecondary}>
                        {k.charAt(0).toUpperCase() + k.slice(1)}
                      </AppText>
                      <AppText variant="bodyBold" color={g.color}>{g.avg}</AppText>
                    </View>
                    <AppText variant="small" color={Colors.textTertiary} style={{marginBottom: vs(3)}}>
                      Target: {g.target}
                    </AppText>
                    <ProgressBar pct={g.pct} color={g.color} />
                  </View>
                );
              })}
            </View>
            <View style={sty.habitRow}>
              {['medication', 'food'].map(k => {
                const g = rec.habitGrid[k];
                if (!g) return null;
                return (
                  <View key={k} style={sty.habitCell}>
                    <View style={sty.habitCellHeader}>
                      <AppText variant="caption" color={Colors.textSecondary}>
                        {k.charAt(0).toUpperCase() + k.slice(1)}
                      </AppText>
                      <AppText variant="bodyBold" color={g.color}>{g.avg}</AppText>
                    </View>
                    <AppText variant="small" color={Colors.textTertiary} style={{marginBottom: vs(3)}}>
                      Target: {g.target}
                    </AppText>
                    <ProgressBar pct={g.pct} color={g.color} />
                  </View>
                );
              })}
            </View>
          </View>
        )}

        {/* Value chips (glucose, BP, weight, mood) */}
        {rec.values && rec.values.length > 0 && (
          <View style={sty.chipsRow}>
            {rec.values.map((v, i) => {
              const vs2 = getValueStyle(v.style);
              return (
                <View key={i} style={[sty.valueChip, {backgroundColor: vs2.bg, borderColor: vs2.border}]}>
                  <AppText style={[sty.valueChipText, {color: vs2.color}]}>{v.label}</AppText>
                </View>
              );
            })}
          </View>
        )}

        {/* Symptom day-tracker */}
        {rec.symptomTrack && (
          <View style={sty.symptomWrap}>
            <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(4)}}>
              {rec.symptomTrack.length}-day pattern
            </AppText>
            <View style={sty.symptomRow}>
              {rec.symptomTrack.map((clr, i) => (
                <View key={i} style={[sty.symptomSquare, {backgroundColor: clr}]} />
              ))}
            </View>
          </View>
        )}

        {/* Footer */}
        {rec.footerTags && rec.footerTags.length > 0 && (
          <View style={sty.recFooter}>
            <View style={sty.footerTagsWrap}>
              {rec.footerTags.map((t, i) => {
                const ts = getPillStyle(t.style);
                return (
                  <View key={i} style={[sty.footerTag, {backgroundColor: ts.bg}]}>
                    <AppText style={[sty.footerTagText, {color: ts.color}]}>{t.label}</AppText>
                  </View>
                );
              })}
            </View>
            <Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.textTertiary} />
          </View>
        )}
      </TouchableOpacity>
    );
  };

  const renderHealthLogCards = () => {
    const filtered = getFilteredLogs();
    if (filtered.length === 0) return renderEmpty('No health logs found');
    const {grouped, order} = groupByDate(filtered);
    return order.map(dateKey => (
      <View key={dateKey}>
        <DateSeparator label={dateKey} />
        {grouped[dateKey].map(rec => renderHealthLogCard(rec))}
      </View>
    ));
  };

  /* ═══════════════════════════════════════════════ */
  /*  5C. GADGET CARDS                               */
  /* ═══════════════════════════════════════════════ */
  const renderGadgetCard = gad => {
    const wColor = warrantyColor(gad.warrantyDays);
    const wPct = gad.warrantyTotal > 0
      ? Math.round(((gad.warrantyTotal - gad.warrantyDays) / gad.warrantyTotal) * 100)
      : 100;
    const expired = gad.warrantyDays <= 0;
    return (
      <TouchableOpacity
        key={gad.id}
        style={sty.card}
        activeOpacity={0.7}
        onPress={() => openDetail({...gad, _tab: 'gadgets'})}>
        {/* Top row */}
        <View style={sty.recTop}>
          <View style={[sty.recIcon, {backgroundColor: backgroundSecondary}]}>
            <Icon family="Ionicons" name="phone-portrait-outline" size={18} color={Colors.textPrimary} />
          </View>
          <View style={sty.recMain}>
            <AppText style={sty.cardTitle} numberOfLines={1}>{gad.title}</AppText>
            <AppText style={sty.cardSub}>{gad.brand} {'\u00B7'} {gad.serial}</AppText>
            <View style={sty.metaRow}>
              <View style={[sty.pill, {backgroundColor: expired ? Colors.redBg : Colors.tealBg}]}>
                <AppText style={[sty.pillText, {color: expired ? Colors.redText : Colors.tealText}]}>
                  {expired ? 'Warranty expired' : gad.status === 'expiring' ? 'Expiring soon' : 'Active'}
                </AppText>
              </View>
              <AppText variant="caption" color={Colors.textTertiary}>
                {gad.price}
              </AppText>
            </View>
          </View>
        </View>

        {/* Warranty bar */}
        <View style={sty.warrantyWrap}>
          <View style={sty.warrantyHeader}>
            <AppText variant="small" color={Colors.textSecondary}>
              Warranty
            </AppText>
            <AppText variant="small" color={wColor} style={{fontWeight: '600'}}>
              {expired ? 'Expired' : `${gad.warrantyDays} days left`}
            </AppText>
          </View>
          <View style={sty.warrantyTrack}>
            <View
              style={[sty.warrantyFill, {width: `${Math.min(wPct, 100)}%`, backgroundColor: wColor}]}
            />
          </View>
          <View style={sty.warrantyDates}>
            <AppText variant="small" color={Colors.textTertiary}>
              {gad.purchaseDate}
            </AppText>
            <AppText variant="small" color={Colors.textTertiary}>
              {gad.warrantyExpiry}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderGadgetCards = () => {
    const filtered = getFilteredGadgets();
    if (filtered.length === 0) return renderEmpty('No gadgets found');
    return filtered.map(gad => renderGadgetCard(gad));
  };

  /* ═══════════════════════════════════════════════ */
  /*  5D. INSURANCE CARDS                            */
  /* ═══════════════════════════════════════════════ */
  const renderInsuranceTab = () => {
    const ins = INSURANCE_RECORDS;

    /* ── Policy card ── */
    const renderPolicy = () => (
      <TouchableOpacity
        style={sty.card}
        activeOpacity={0.7}
        onPress={() => openDetail({...ins.policy, _tab: 'insurance', _type: 'policy'})}>
        <View style={sty.recTop}>
          <View style={[sty.recIcon, {backgroundColor: Colors.tealBg}]}>
            <Icon family="Ionicons" name="shield-checkmark-outline" size={18} color={Colors.tealText} />
          </View>
          <View style={sty.recMain}>
            <AppText style={sty.cardTitle}>{ins.policy.planName}</AppText>
            <AppText style={sty.cardSub}>
              {ins.policy.provider} {'\u00B7'} {ins.policy.type}
            </AppText>
            <View style={sty.metaRow}>
              <View style={[sty.pill, {backgroundColor: Colors.tealBg}]}>
                <AppText style={[sty.pillText, {color: Colors.tealText}]}>Active</AppText>
              </View>
              <AppText variant="caption" color={Colors.textTertiary}>
                {ins.policy.policyNumber}
              </AppText>
            </View>
          </View>
        </View>

        {/* Utilization bar */}
        <View style={sty.utilizationWrap}>
          <View style={sty.utilizationHeader}>
            <AppText variant="small" color={Colors.textSecondary}>
              Utilised {ins.policy.utilisedFormatted}
            </AppText>
            <AppText variant="small" color={Colors.textSecondary}>
              of {ins.policy.sumInsured}
            </AppText>
          </View>
          <View style={sty.utilizationTrack}>
            <View
              style={[
                sty.utilizationFill,
                {
                  width: `${Math.round(
                    (ins.policy.utilised / ins.policy.sumInsuredRaw) * 100,
                  )}%`,
                },
              ]}
            />
          </View>
          <View style={sty.utilizationFooter}>
            <AppText variant="small" color={Colors.textTertiary}>
              {ins.policy.members} members
            </AppText>
            <AppText variant="small" color={Colors.tealText} style={{fontWeight: '600'}}>
              Remaining: {ins.policy.remainingCover}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );

    /* ── E-Health card ── */
    const renderECard = () => (
      <TouchableOpacity
        style={sty.eHealthCard}
        activeOpacity={0.7}
        onPress={() => openDetail({...ins.policy, _tab: 'insurance', _type: 'ecard'})}>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
          <AppText variant="small" style={{color: 'rgba(255,255,255,0.6)', fontWeight: '600'}}>
            E-HEALTH CARD
          </AppText>
          <Icon family="Ionicons" name="card-outline" size={20} color="rgba(255,255,255,0.5)" />
        </View>
        <AppText
          variant="header"
          color={Colors.white}
          style={{marginTop: vs(10), letterSpacing: 1}}>
          {ins.policy.planName}
        </AppText>
        <AppText variant="caption" style={{color: 'rgba(255,255,255,0.6)', marginTop: vs(4)}}>
          {ins.policy.provider}
        </AppText>
        <View style={sty.eHealthRow}>
          <View>
            <AppText variant="small" style={{color: 'rgba(255,255,255,0.5)'}}>Member</AppText>
            <AppText variant="bodyBold" color={Colors.white}>{ins.policy.memberNames[0]}</AppText>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <AppText variant="small" style={{color: 'rgba(255,255,255,0.5)'}}>Policy no.</AppText>
            <AppText variant="small" color={Colors.white} style={{fontFamily: 'monospace'}}>
              {ins.policy.policyNumber}
            </AppText>
          </View>
        </View>
        <View style={sty.eHealthRow}>
          <View>
            <AppText variant="small" style={{color: 'rgba(255,255,255,0.5)'}}>Sum insured</AppText>
            <AppText variant="bodyBold" color={Colors.white}>{ins.policy.sumInsured}</AppText>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <AppText variant="small" style={{color: 'rgba(255,255,255,0.5)'}}>Valid</AppText>
            <AppText variant="small" color={Colors.white}>
              {ins.policy.validFrom} to {ins.policy.validTo}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );

    /* ── Claims ── */
    const renderClaims = () =>
      ins.claims.map(claim => {
        const isSettled = claim.status === 'settled';
        return (
          <TouchableOpacity
            key={claim.id}
            style={sty.card}
            activeOpacity={0.7}
            onPress={() => openDetail({...claim, _tab: 'insurance', _type: 'claim'})}>
            <View style={sty.recTop}>
              <View style={[sty.recIcon, {backgroundColor: isSettled ? Colors.tealBg : Colors.blueBg}]}>
                <Icon
                  family="Ionicons"
                  name="receipt-outline"
                  size={18}
                  color={isSettled ? Colors.tealText : Colors.blueText}
                />
              </View>
              <View style={sty.recMain}>
                <AppText style={sty.cardTitle} numberOfLines={1}>{claim.description}</AppText>
                <AppText style={sty.cardSub}>{claim.hospital} {'\u00B7'} {claim.type}</AppText>
                <View style={sty.metaRow}>
                  <View
                    style={[
                      sty.pill,
                      {backgroundColor: isSettled ? Colors.tealBg : Colors.blueBg},
                    ]}>
                    <AppText
                      style={[
                        sty.pillText,
                        {color: isSettled ? Colors.tealText : Colors.blueText},
                      ]}>
                      {claim.statusLabel}
                    </AppText>
                  </View>
                  <AppText variant="caption" color={Colors.textTertiary}>
                    {claim.claimNumber}
                  </AppText>
                </View>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <AppText style={sty.statValue}>{claim.amountFormatted}</AppText>
                <AppText variant="small" color={Colors.textTertiary}>{claim.date}</AppText>
              </View>
            </View>
          </TouchableOpacity>
        );
      });

    /* ── Premiums ── */
    const renderPremiums = () =>
      ins.premiums.map(prm => (
        <TouchableOpacity
          key={prm.id}
          style={sty.card}
          activeOpacity={0.7}
          onPress={() => openDetail({...prm, _tab: 'insurance', _type: 'premium'})}>
          <View style={sty.recTop}>
            <View style={[sty.recIcon, {backgroundColor: Colors.amberBg}]}>
              <Icon family="Ionicons" name="cash-outline" size={18} color={Colors.amberText} />
            </View>
            <View style={sty.recMain}>
              <AppText style={sty.cardTitle}>Premium payment {'\u00B7'} {prm.period}</AppText>
              <AppText style={sty.cardSub}>{prm.mode} {'\u00B7'} {prm.method}</AppText>
              <View style={sty.metaRow}>
                <View style={[sty.pill, {backgroundColor: Colors.tealBg}]}>
                  <AppText style={[sty.pillText, {color: Colors.tealText}]}>Paid</AppText>
                </View>
                <AppText variant="caption" color={Colors.textTertiary}>
                  {prm.receiptNo}
                </AppText>
              </View>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <AppText style={sty.statValue}>{prm.totalPaidFormatted}</AppText>
              <AppText variant="small" color={Colors.textTertiary}>{prm.paidDate}</AppText>
            </View>
          </View>
        </TouchableOpacity>
      ));

    /* ── 80D Tax Deduction card ── */
    const renderTax = () => (
      <TouchableOpacity
        style={sty.card}
        activeOpacity={0.7}
        onPress={() => openDetail({...ins.taxDeduction, _tab: 'insurance', _type: 'tax'})}>
        <View style={sty.recTop}>
          <View style={[sty.recIcon, {backgroundColor: Colors.purpleBg}]}>
            <Icon family="Ionicons" name="calculator-outline" size={18} color={Colors.purpleText} />
          </View>
          <View style={sty.recMain}>
            <AppText style={sty.cardTitle}>Section 80D {'\u00B7'} FY {ins.taxDeduction.fy}</AppText>
            <AppText style={sty.cardSub}>
              Tax deduction on health insurance premiums
            </AppText>
            <View style={sty.metaRow}>
              <View style={[sty.pill, {backgroundColor: Colors.purpleBg}]}>
                <AppText style={[sty.pillText, {color: Colors.purpleText}]}>Tax saving</AppText>
              </View>
            </View>
          </View>
        </View>
        <View style={sty.taxGrid}>
          <View style={sty.taxCell}>
            <AppText variant="small" color={Colors.textTertiary}>Premium paid</AppText>
            <AppText variant="bodyBold" color={Colors.textPrimary}>
              {ins.taxDeduction.eligibleFormatted}
            </AppText>
          </View>
          <View style={sty.taxDivider} />
          <View style={sty.taxCell}>
            <AppText variant="small" color={Colors.textTertiary}>Max deduction</AppText>
            <AppText variant="bodyBold" color={Colors.textPrimary}>
              {ins.taxDeduction.maxLimitFormatted}
            </AppText>
          </View>
          <View style={sty.taxDivider} />
          <View style={sty.taxCell}>
            <AppText variant="small" color={Colors.textTertiary}>Tax saved ({ins.taxDeduction.slab})</AppText>
            <AppText variant="bodyBold" color={Colors.accent}>
              {ins.taxDeduction.savingFormatted}
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    );

    /* ── Render based on activeSubTab ── */
    if (activeSubTab === 'all' || activeSubTab === 'policy') {
      return (
        <>
          {(activeSubTab === 'all' || activeSubTab === 'policy') && (
            <>
              <DateSeparator label="Policy" />
              {renderPolicy()}
            </>
          )}
          {activeSubTab === 'all' && (
            <>
              <DateSeparator label="E-Health Card" />
              {renderECard()}
              <DateSeparator label="Claims" />
              {renderClaims()}
              <DateSeparator label="Premiums" />
              {renderPremiums()}
              <DateSeparator label="Tax Deduction" />
              {renderTax()}
            </>
          )}
        </>
      );
    }
    if (activeSubTab === 'ecard') {
      return (
        <>
          <DateSeparator label="E-Health Card" />
          {renderECard()}
        </>
      );
    }
    if (activeSubTab === 'claims') {
      return (
        <>
          <DateSeparator label="Claims" />
          {renderClaims()}
        </>
      );
    }
    if (activeSubTab === 'premium') {
      return (
        <>
          <DateSeparator label="Premiums" />
          {renderPremiums()}
        </>
      );
    }
    if (activeSubTab === 'tax') {
      return (
        <>
          <DateSeparator label="Tax Deduction" />
          {renderTax()}
        </>
      );
    }
    return null;
  };

  /* ═══════════════════════════════════════════════ */
  /*  5E. DOCUMENTS TAB (bills / service bills)      */
  /* ═══════════════════════════════════════════════ */
  const renderDocumentsTab = () => {
    // Documents tab is a simplified placeholder for now
    return renderEmpty('Document records will appear here');
  };

  /* ═══════════════════════════════════════════════ */
  /*  EMPTY STATE                                    */
  /* ═══════════════════════════════════════════════ */
  const renderEmpty = msg => (
    <View style={sty.emptyWrap}>
      <Icon family="Ionicons" name="document-text-outline" size={48} color={Colors.textTertiary} />
      <AppText variant="bodyBold" color={Colors.textSecondary} style={{marginTop: vs(10)}}>
        {msg}
      </AppText>
      <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(4)}}>
        Try adjusting your filters or search
      </AppText>
    </View>
  );

  /* ═══════════════════════════════════════════════ */
  /*  5. RENDER ACTIVE TAB CONTENT                   */
  /* ═══════════════════════════════════════════════ */
  const renderTabContent = () => {
    switch (activeMainTab) {
      case 'medical':
        return renderMedicalCards();
      case 'logs':
        return renderHealthLogCards();
      case 'gadgets':
        return renderGadgetCards();
      case 'insurance':
        return renderInsuranceTab();
      case 'bills':
        return renderDocumentsTab();
      default:
        return renderMedicalCards();
    }
  };

  /* ═══════════════════════════════════════════════ */
  /*  6. RECORD DETAIL MODAL                         */
  /* ═══════════════════════════════════════════════ */
  const renderDetailModal = () => {
    if (!selectedRecord) return null;
    const rec = selectedRecord;
    const isInsurance = rec._tab === 'insurance';
    const isGadget = rec._tab === 'gadgets';

    return (
      <Modal
        visible={showDetail}
        transparent
        animationType="slide"
        onRequestClose={() => setShowDetail(false)}>
        <View style={sty.modalOverlay}>
          <View style={sty.modalSheet}>
            {/* ── Green header ── */}
            <View style={sty.sheetHeader}>
              <View style={sty.dragHandle} />
              <AppText variant="small" style={{color: 'rgba(255,255,255,0.5)', marginTop: vs(8)}}>
                {isInsurance
                  ? (rec._type || 'Insurance').toUpperCase()
                  : isGadget
                  ? 'GADGET'
                  : (rec.cat || '').toUpperCase()}
              </AppText>
              <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(4)}}>
                {rec.title || rec.planName || rec.description || ''}
              </AppText>
              <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', marginTop: vs(2)}}>
                {rec.sub || rec.provider || rec.hospital || rec.brand || ''}
              </AppText>
              <TouchableOpacity style={sty.sheetClose} onPress={() => setShowDetail(false)}>
                <Icon family="Ionicons" name="close" size={20} color={Colors.white} />
              </TouchableOpacity>
            </View>

            {/* ── Sheet body ── */}
            <ScrollView style={sty.sheetBody} showsVerticalScrollIndicator={false}>
              {/* Ayu insight card */}
              {rec.ayuInsight && (
                <View style={sty.ayuCard}>
                  <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
                    <Icon family="Ionicons" name="leaf-outline" size={18} color={Colors.tealText} style={{marginRight: s(8)}} />
                    <View style={{flex: 1}}>
                      <AppText variant="small" color={Colors.tealText} style={{fontWeight: '700', marginBottom: vs(3)}}>
                        Ayu insight
                      </AppText>
                      <AppText variant="caption" color={Colors.tealText}>
                        {rec.ayuInsight}
                      </AppText>
                    </View>
                  </View>
                </View>
              )}

              {/* Values / results section (medical & health logs) */}
              {rec.values && rec.values.length > 0 && (
                <View style={sty.detailCard}>
                  <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>
                    Results
                  </AppText>
                  {rec.values.map((v, i) => {
                    const vs2 = getValueStyle(v.style);
                    return (
                      <View key={i} style={sty.resultRow}>
                        <View style={[sty.resultDot, {backgroundColor: vs2.color}]} />
                        <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1}}>
                          {v.label}
                        </AppText>
                      </View>
                    );
                  })}
                </View>
              )}

              {/* Lab results (detailed) */}
              {rec.labResults && rec.labResults.length > 0 && (
                <View style={sty.detailCard}>
                  <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>
                    Lab results
                  </AppText>
                  {rec.labResults.map((lr, i) => (
                    <View key={i} style={sty.labResultRow}>
                      <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1}}>
                        {lr.name}
                      </AppText>
                      <AppText
                        variant="bodyBold"
                        color={
                          lr.status === 'high'
                            ? Colors.redText
                            : lr.status === 'borderline'
                            ? Colors.amberText
                            : Colors.tealText
                        }>
                        {lr.value}
                      </AppText>
                      <AppText variant="small" color={Colors.textTertiary} style={{marginLeft: s(8), minWidth: s(60)}}>
                        Ref: {lr.ref}
                      </AppText>
                    </View>
                  ))}
                </View>
              )}

              {/* Clinical notes (doctor notes) */}
              {rec.clinicalNotes && rec.clinicalNotes.length > 0 && (
                <View style={sty.detailCard}>
                  <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>
                    Clinical notes
                  </AppText>
                  {rec.clinicalNotes.map((note, i) => (
                    <View key={i} style={sty.noteRow}>
                      <AppText variant="caption" color={Colors.accent} style={{fontWeight: '700', marginRight: s(8)}}>
                        {i + 1}.
                      </AppText>
                      <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1}}>
                        {note}
                      </AppText>
                    </View>
                  ))}
                </View>
              )}

              {/* Habit grid detail */}
              {rec.habitGrid && (
                <View style={sty.detailCard}>
                  <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>
                    Lifestyle metrics
                  </AppText>
                  {Object.entries(rec.habitGrid).map(([k, g]) => (
                    <View key={k} style={sty.detailMetricRow}>
                      <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1}}>
                        {k.charAt(0).toUpperCase() + k.slice(1)}
                      </AppText>
                      <AppText variant="bodyBold" color={g.color} style={{marginRight: s(8)}}>
                        {g.avg}
                      </AppText>
                      <View style={{width: s(80)}}>
                        <ProgressBar pct={g.pct} color={g.color} />
                      </View>
                    </View>
                  ))}
                </View>
              )}

              {/* Insurance policy detail */}
              {isInsurance && rec._type === 'policy' && (
                <View style={sty.detailCard}>
                  <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>
                    Policy details
                  </AppText>
                  <DetailRow label="Sum insured" value={rec.sumInsured} />
                  <DetailRow label="Premium" value={rec.annualPremiumFormatted} />
                  <DetailRow label="Room rent" value={rec.roomRentLimit} />
                  <DetailRow label="Co-payment" value={rec.coPayment} />
                  <DetailRow label="TPA" value={rec.tpa} />
                  <DetailRow label="Network hospitals" value={String(rec.networkHospitals)} />
                  <DetailRow label="Valid" value={`${rec.validFrom} to ${rec.validTo}`} />
                </View>
              )}

              {/* Insurance claim detail */}
              {isInsurance && rec._type === 'claim' && (
                <View style={sty.detailCard}>
                  <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>
                    Claim details
                  </AppText>
                  <DetailRow label="Claim no." value={rec.claimNumber} mono />
                  <DetailRow label="Amount" value={rec.amountFormatted} />
                  <DetailRow label="Type" value={rec.type} />
                  <DetailRow label="Date" value={rec.date} />
                  {rec.status === 'settled' && (
                    <DetailRow label="Settled" value={`${rec.settledAmount ? '\u20B9' + Number(rec.settledAmount).toLocaleString('en-IN') : ''} on ${rec.settledDate}`} />
                  )}

                  {/* Timeline */}
                  {rec.timeline && (
                    <View style={{marginTop: vs(12)}}>
                      {rec.timeline.map((step, i, arr) => (
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
                  )}
                </View>
              )}

              {/* Insurance premium detail */}
              {isInsurance && rec._type === 'premium' && (
                <View style={sty.detailCard}>
                  <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>
                    Payment details
                  </AppText>
                  <DetailRow label="Period" value={rec.period} />
                  <DetailRow label="Premium" value={rec.amountFormatted} />
                  <DetailRow label="GST" value={rec.gstFormatted} />
                  <DetailRow label="Total paid" value={rec.totalPaidFormatted} />
                  <DetailRow label="Mode" value={rec.mode} />
                  <DetailRow label="Method" value={rec.method} />
                  <DetailRow label="Receipt" value={rec.receiptNo} mono />
                </View>
              )}

              {/* Insurance tax detail */}
              {isInsurance && rec._type === 'tax' && (
                <View style={sty.detailCard}>
                  <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>
                    80D deduction details
                  </AppText>
                  <DetailRow label="Section" value={rec.section} />
                  <DetailRow label="Financial year" value={rec.fy} />
                  <DetailRow label="Eligible premium" value={rec.eligibleFormatted} />
                  <DetailRow label="Max limit" value={rec.maxLimitFormatted} />
                  <DetailRow label="Tax slab" value={rec.slab} />
                  <DetailRow label="Tax saved" value={rec.savingFormatted} />
                </View>
              )}

              {/* Gadget detail */}
              {isGadget && (
                <View style={sty.detailCard}>
                  <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>
                    Device details
                  </AppText>
                  <DetailRow label="Brand" value={rec.brand} />
                  <DetailRow label="Serial" value={rec.serial} mono />
                  <DetailRow label="Price" value={rec.price} />
                  <DetailRow label="Purchased" value={rec.purchaseDate} />
                  <DetailRow label="Warranty expires" value={rec.warrantyExpiry} />
                  <DetailRow
                    label="Status"
                    value={rec.warrantyDays <= 0 ? 'Expired' : `${rec.warrantyDays} days remaining`}
                  />
                </View>
              )}

              {/* Tags row */}
              {rec.footerTags && rec.footerTags.length > 0 && (
                <View style={sty.detailCard}>
                  <AppText variant="sectionTitle" style={{marginBottom: vs(10)}}>
                    Tags
                  </AppText>
                  <View style={sty.chipsRow}>
                    {rec.footerTags.map((t, i) => {
                      const ts = getPillStyle(t.style);
                      return (
                        <View key={i} style={[sty.footerTag, {backgroundColor: ts.bg}]}>
                          <AppText style={[sty.footerTagText, {color: ts.color}]}>{t.label}</AppText>
                        </View>
                      );
                    })}
                  </View>
                </View>
              )}

              {/* Actions */}
              <View style={sty.actionRow}>
                <TouchableOpacity style={sty.actionBtn} activeOpacity={0.7}>
                  <Icon family="Ionicons" name="download-outline" size={18} color={Colors.white} />
                  <AppText variant="small" color={Colors.white} style={{fontWeight: '600', marginLeft: s(6)}}>
                    Download PDF
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity style={[sty.actionBtn, sty.actionBtnOutline]} activeOpacity={0.7}>
                  <Icon family="Ionicons" name="share-outline" size={18} color={Colors.primary} />
                  <AppText variant="small" color={Colors.primary} style={{fontWeight: '600', marginLeft: s(6)}}>
                    Share
                  </AppText>
                </TouchableOpacity>
              </View>

              <View style={{height: vs(30)}} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  /* ═══════════════════════════════════════════════ */
  /*  MAIN RENDER                                    */
  /* ═══════════════════════════════════════════════ */
  return (
    <View style={sty.container}>
      {/* 1. Stats strip */}
      {renderStats()}

      {/* 2. Main tabs */}
      {renderMainTabs()}

      {/* 3. Sub-tab ribbon */}
      {renderRibbon()}

      {/* 4. Search + sort */}
      {renderSearchRow()}

      {/* 5. Record cards */}
      {renderTabContent()}

      {/* 6. Detail modal */}
      {renderDetailModal()}
    </View>
  );
};

/* ─── Detail Row helper for modal ─── */
const DetailRow = ({label, value, mono}) => (
  <View style={sty.detailRowItem}>
    <AppText variant="caption" color={Colors.textSecondary} style={{width: s(110)}}>
      {label}
    </AppText>
    <AppText
      variant="caption"
      color={Colors.textPrimary}
      style={[{flex: 1}, mono && {fontFamily: 'monospace'}]}>
      {value}
    </AppText>
  </View>
);

/* ═══════════════════════════════════════════════ */
/*  STYLES                                         */
/* ═══════════════════════════════════════════════ */
const sty = StyleSheet.create({
  container: {
    paddingBottom: vs(20),
  },

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

  /* Main tabs (pills) */
  mainTabScroll: {
    paddingHorizontal: s(4),
    paddingBottom: vs(10),
    gap: s(8),
  },
  mainPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
    borderRadius: ms(20),
    borderWidth: 0.5,
  },
  mainPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  mainPillInactive: {
    backgroundColor: Colors.white,
    borderColor: borderTertiary,
  },

  /* Sub-tab ribbon */
  ribbonScroll: {
    paddingHorizontal: s(4),
    paddingBottom: vs(12),
    gap: s(12),
  },
  ribbonItem: {
    alignItems: 'center',
    width: ms(60),
    paddingBottom: vs(4),
  },
  ribbonItemActive: {
    borderBottomWidth: 2.5,
    borderBottomColor: Colors.accent,
  },
  ribbonIconWrap: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ribbonLabel: {
    marginTop: vs(4),
    textAlign: 'center',
    fontSize: ms(9),
  },
  countBadge: {
    marginTop: vs(2),
    paddingHorizontal: s(6),
    paddingVertical: vs(1),
    borderRadius: ms(10),
    backgroundColor: backgroundSecondary,
  },
  countBadgeActive: {
    backgroundColor: Colors.primary,
  },

  /* Search row */
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginBottom: vs(12),
  },
  searchInput: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    paddingHorizontal: s(10),
    height: vs(36),
    gap: s(6),
  },
  searchField: {
    flex: 1,
    fontSize: ms(13),
    color: Colors.textPrimary,
    padding: 0,
  },
  searchBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Date separator */
  sepRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10),
    marginBottom: vs(8),
  },
  sepText: {
    marginRight: s(8),
    fontWeight: '700',
    fontSize: ms(10),
    letterSpacing: 0.8,
  },
  sepLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: borderTertiary,
  },

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    marginBottom: vs(9),
    overflow: 'hidden',
  },

  /* Record top row */
  recTop: {
    flexDirection: 'row',
    padding: s(12),
    gap: s(10),
  },
  recIcon: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(11),
    alignItems: 'center',
    justifyContent: 'center',
  },
  recMain: {
    flex: 1,
  },

  /* Card typography */
  cardTitle: {
    fontSize: ms(13),
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  cardSub: {
    fontSize: ms(11),
    color: Colors.textSecondary,
    marginTop: vs(2),
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    marginTop: vs(4),
    flexWrap: 'wrap',
  },

  /* Pills */
  pill: {
    paddingHorizontal: s(7),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
  pillText: {
    fontSize: ms(9),
    fontWeight: '600',
  },

  /* Value chips */
  chipsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    paddingHorizontal: s(12),
    paddingBottom: vs(8),
  },
  valueChip: {
    borderRadius: ms(8),
    paddingHorizontal: s(9),
    paddingVertical: vs(3),
    borderWidth: 0.5,
  },
  valueChipText: {
    fontSize: ms(10),
    fontWeight: '600',
  },

  /* Footer */
  recFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    borderTopWidth: StyleSheet.hairlineWidth,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
  },
  footerTagsWrap: {
    flex: 1,
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(5),
    alignItems: 'center',
  },
  footerTag: {
    paddingHorizontal: s(7),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  footerTagText: {
    fontSize: ms(9),
    fontWeight: '600',
  },
  visitChip: {
    paddingHorizontal: s(7),
    paddingVertical: vs(2),
    borderRadius: ms(8),
    backgroundColor: backgroundSecondary,
  },
  visitChipLinked: {
    backgroundColor: Colors.tealBg,
  },
  visitChipText: {
    fontFamily: 'monospace',
    fontSize: ms(9),
    color: Colors.accent,
  },

  /* Habit grid (lifestyle) */
  habitGridWrap: {
    paddingHorizontal: s(12),
    paddingBottom: vs(8),
  },
  habitRow: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(6),
  },
  habitCell: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    padding: s(10),
  },
  habitCellHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(3),
  },

  /* Symptom tracker */
  symptomWrap: {
    paddingHorizontal: s(12),
    paddingBottom: vs(8),
  },
  symptomRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 3,
  },
  symptomSquare: {
    width: ms(14),
    height: ms(14),
    borderRadius: ms(3),
  },

  /* Progress bar */
  barTrack: {
    width: '100%',
    borderRadius: ms(3),
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  barFill: {
    borderRadius: ms(3),
  },

  /* Warranty bar (gadgets) */
  warrantyWrap: {
    paddingHorizontal: s(12),
    paddingBottom: vs(12),
  },
  warrantyHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(4),
  },
  warrantyTrack: {
    height: ms(5),
    borderRadius: ms(3),
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  warrantyFill: {
    height: ms(5),
    borderRadius: ms(3),
  },
  warrantyDates: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(4),
  },

  /* Insurance utilization bar */
  utilizationWrap: {
    paddingHorizontal: s(12),
    paddingBottom: vs(12),
  },
  utilizationHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(4),
  },
  utilizationTrack: {
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: Colors.borderLight,
    overflow: 'hidden',
  },
  utilizationFill: {
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: Colors.accent,
  },
  utilizationFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(4),
  },

  /* E-Health card */
  eHealthCard: {
    borderRadius: ms(14),
    padding: s(16),
    marginBottom: vs(9),
    overflow: 'hidden',
    backgroundColor: Colors.primary,
  },
  eHealthRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(12),
  },

  /* Tax grid */
  taxGrid: {
    flexDirection: 'row',
    paddingHorizontal: s(12),
    paddingBottom: vs(12),
    alignItems: 'center',
  },
  taxCell: {
    flex: 1,
    alignItems: 'center',
  },
  taxDivider: {
    width: 1,
    height: vs(30),
    backgroundColor: Colors.borderLight,
  },

  /* Empty state */
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: vs(40),
  },

  /* Modal */
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
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
  sheetClose: {
    position: 'absolute',
    top: vs(12),
    right: s(16),
  },
  sheetBody: {
    paddingHorizontal: s(16),
    paddingTop: vs(14),
  },

  /* Ayu insight card */
  ayuCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(12),
    padding: ms(12),
    marginBottom: vs(10),
    marginTop: vs(4),
  },

  /* Detail card */
  detailCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: vs(10),
  },
  detailRowItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(8),
  },

  /* Result rows */
  resultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  resultDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    marginRight: s(8),
  },

  /* Lab result rows */
  labResultRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
    paddingBottom: vs(8),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: Colors.borderLight,
  },

  /* Note rows */
  noteRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(8),
  },

  /* Detail metric row */
  detailMetricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },

  /* Timeline */
  timelineStep: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timelineLeft: {
    width: s(24),
    alignItems: 'center',
  },
  timelineDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    marginTop: vs(2),
  },
  timelineLine: {
    width: 2,
    flex: 1,
    marginTop: vs(2),
  },

  /* Actions */
  actionRow: {
    flexDirection: 'row',
    gap: s(10),
    marginTop: vs(6),
  },
  actionBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    paddingVertical: vs(12),
    borderRadius: ms(12),
  },
  actionBtnOutline: {
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.primary,
  },

});

export default RecordsFinalTab;
