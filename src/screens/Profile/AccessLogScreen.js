import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, Modal, TextInput} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../components/shared/AppText';
import Colors from '../../constants/colors';
import {FILTER_PILLS, CAT_COLORS, RISK_COLORS, ACCESS_LOG, EXPORT_FORMATS, DATE_PRESETS} from '../../constants/accessLogData';

const TODAY = '26 Mar 2026';
const YESTERDAY = '25 Mar 2026';
const groupByDate = entries => {
  const map = {};
  entries.forEach(e => { if (!map[e.date]) map[e.date] = []; map[e.date].push(e); });
  return Object.keys(map).map(d => ({date: d, items: map[d]}));
};
const dayLabel = d => (d === TODAY ? 'Today' : d === YESTERDAY ? 'Yesterday' : d);

const AccessLogScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activePill, setActivePill] = useState('all');
  const [search, setSearch] = useState('');
  const [datePreset, setDatePreset] = useState('all');
  const [expandedId, setExpandedId] = useState(null);
  const [filterModal, setFilterModal] = useState(false);
  const [exportModal, setExportModal] = useState(false);
  const [fDateFrom, setFDateFrom] = useState('');
  const [fDateTo, setFDateTo] = useState('');
  const [fRisk, setFRisk] = useState('all');
  const [fQuickRange, setFQuickRange] = useState('all');

  const filtered = ACCESS_LOG.filter(e => {
    if (activePill !== 'all' && e.cat !== activePill) return false;
    if (search) {
      const q = search.toLowerCase();
      if (!(e.action + e.actor + e.org + e.data.join(' ')).toLowerCase().includes(q)) return false;
    }
    if (fRisk !== 'all' && e.risk !== fRisk) return false;
    return true;
  });
  const groups = groupByDate(filtered);
  const totalEvents = filtered.length;
  const byYou = filtered.filter(e => e.cat === 'you').length;
  const thirdParty = filtered.filter(e => ['doctor','pharmacy','lab','insurance'].includes(e.cat)).length;
  const securityCount = filtered.filter(e => e.cat === 'security').length;

  const renderHeader = () => (
    <View style={[st.header, {paddingTop: insets.top}]}>
      <View style={st.topBar}>
        <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()}>
          <AppText variant="body" style={st.backText}>{'\u2039'} Transparency</AppText>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', gap: s(8)}}>
          <TouchableOpacity onPress={() => setFilterModal(true)}>
            <AppText style={{fontSize: ms(18)}}>{'⚙️'}</AppText>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => setExportModal(true)}>
            <AppText style={{fontSize: ms(18)}}>{'📤'}</AppText>
          </TouchableOpacity>
        </View>
      </View>
      <AppText variant="screenName" style={st.headerTitle}>Access Log</AppText>
      <AppText variant="caption" style={st.headerSub}>
        Every access to your health data - recorded & verifiable
      </AppText>
    </View>
  );

  const renderPills = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.pillRow}>
      {FILTER_PILLS.map(p => {
        const on = activePill === p.key;
        return (
          <TouchableOpacity key={p.key} style={[st.pill, on && st.pillOn]} onPress={() => setActivePill(p.key)}>
            <AppText variant="small" color={on ? Colors.accent : Colors.textSecondary} style={on ? {fontWeight: '700'} : {}}>
              {p.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderSearch = () => (
    <View style={st.searchWrap}>
      <AppText style={{fontSize: ms(14), marginRight: s(6)}}>{'🔍'}</AppText>
      <TextInput style={st.searchInput} placeholder="Search actions, actors, data..."
        placeholderTextColor={Colors.textTertiary} value={search} onChangeText={setSearch} />
    </View>
  );

  const renderDatePresets = () => (
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={st.dateRow}>
      {DATE_PRESETS.map(d => {
        const on = datePreset === d.key;
        return (
          <TouchableOpacity key={d.key} style={[st.datePill, on && st.datePillOn]} onPress={() => setDatePreset(d.key)}>
            <AppText variant="small" color={on ? Colors.white : Colors.textSecondary}>{d.label}</AppText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );

  const renderSummary = () => {
    const tiles = [
      {n: totalEvents, l: 'Total events', c: '#22c55e'}, {n: byYou, l: 'By you', c: '#3b82f6'},
      {n: thirdParty, l: '3rd party', c: '#f59e0b'}, {n: securityCount, l: 'Security', c: '#ef4444'},
    ];
    return (
      <View style={st.summaryRow}>
        {tiles.map((t, i) => (
          <View key={i} style={st.summaryTile}>
            <AppText variant="header" style={{color: t.c, fontSize: ms(18)}}>{t.n}</AppText>
            <AppText variant="small" color={Colors.textSecondary}>{t.l}</AppText>
          </View>
        ))}
      </View>
    );
  };

  const renderEntry = e => {
    const open = expandedId === e.id;
    const catCol = CAT_COLORS[e.cat] || '#6b7280';
    const riskStyle = RISK_COLORS[e.risk] || RISK_COLORS.low;
    return (
      <TouchableOpacity key={e.id} activeOpacity={0.7} style={st.entryCard}
        onPress={() => setExpandedId(open ? null : e.id)}>
        <View style={{flexDirection: 'row'}}>
          <View style={[st.strip, {backgroundColor: catCol}]} />
          <View style={{flex: 1, paddingLeft: s(10)}}>
            <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(4)}}>
              <View style={[st.icoBox, {backgroundColor: catCol + '18'}]}>
                <AppText style={{fontSize: ms(16)}}>{e.ico}</AppText>
              </View>
              <View style={{flex: 1, marginLeft: s(8)}}>
                <AppText variant="bodyBold" numberOfLines={1}>{e.action}</AppText>
                <AppText variant="small" color={Colors.textSecondary}>{e.actor} · {e.org}</AppText>
              </View>
            </View>
            <View style={st.metaRow}>
              <View style={[st.riskBadge, {backgroundColor: riskStyle.bg}]}>
                <AppText variant="small" style={{color: riskStyle.color, fontWeight: '700'}}>{e.risk.toUpperCase()}</AppText>
              </View>
              {e.data.slice(0, 2).map((d, i) => (
                <View key={i} style={[st.dataChip, {backgroundColor: catCol + '14'}]}>
                  <AppText variant="small" style={{color: catCol, fontSize: ms(10)}}>{d}</AppText>
                </View>
              ))}
              {e.data.length > 2 && <AppText variant="small" color={Colors.textTertiary}>+{e.data.length - 2}</AppText>}
              <AppText variant="small" color={Colors.textTertiary} style={{marginLeft: 'auto'}}>{e.time}</AppText>
            </View>
            {open && (
              <View style={st.detail}>
                {e.risk === 'high' && (
                  <View style={st.warnBox}>
                    <AppText variant="small" style={{color: '#ef4444'}}>{'⚠️'} High-risk security event - review recommended</AppText>
                  </View>
                )}
                {[['PURPOSE', e.purpose], ['METHOD', e.method], ['CONSENT', e.consent],
                  ['DURATION', e.duration], ['RECORDS', String(e.records)], ['DEVICE', e.device],
                ].map(([label, val]) => (
                  <View key={label} style={st.detailRow}>
                    <AppText variant="small" color={Colors.textTertiary} style={st.detailLabel}>{label}</AppText>
                    <AppText variant="body" style={st.detailVal}>{val}</AppText>
                  </View>
                ))}
              </View>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );
  };

  const renderLog = () => (
    <>
      <View style={st.integrityBanner}>
        <AppText style={{fontSize: ms(14)}}>{'🛡️'}</AppText>
        <View style={{marginLeft: s(8), flex: 1}}>
          <AppText variant="bodyBold" color={Colors.primary}>Tamper-proof log</AppText>
          <AppText variant="small" color={Colors.textTertiary} numberOfLines={1}>SHA-256 · 0xae3f...b712</AppText>
        </View>
      </View>
      {groups.map(g => (
        <View key={g.date}>
          <View style={st.dayHeader}>
            <AppText variant="sectionTitle">{dayLabel(g.date)}</AppText>
            <View style={st.dayLine} />
            <AppText variant="small" color={Colors.textTertiary}>{g.items.length} events</AppText>
          </View>
          {g.items.map(renderEntry)}
        </View>
      ))}
    </>
  );

  const renderFilterModal = () => (
    <Modal visible={filterModal} transparent animationType="slide">
      <View style={st.modalOverlay}>
        <View style={st.modalSheet}>
          <AppText variant="header" style={{marginBottom: vs(16)}}>Filter & Date Range</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(6)}}>DATE RANGE</AppText>
          <View style={{flexDirection: 'row', gap: s(10), marginBottom: vs(12)}}>
            <TextInput style={[st.modalInput, {flex: 1}]} placeholder="From (e.g. 1 Mar 2026)"
              placeholderTextColor={Colors.textTertiary} value={fDateFrom} onChangeText={setFDateFrom} />
            <TextInput style={[st.modalInput, {flex: 1}]} placeholder="To (e.g. 26 Mar 2026)"
              placeholderTextColor={Colors.textTertiary} value={fDateTo} onChangeText={setFDateTo} />
          </View>
          <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(6)}}>QUICK RANGE</AppText>
          <View style={st.modalPillRow}>
            {['all', 'today', '7d', '30d', '90d', 'year'].map(k => {
              const on = fQuickRange === k;
              return (
                <TouchableOpacity key={k} style={[st.pill, on && st.pillOn, {marginBottom: vs(6)}]}
                  onPress={() => setFQuickRange(k)}>
                  <AppText variant="small" color={on ? Colors.accent : Colors.textSecondary}>
                    {k === 'year' ? 'This year' : k === 'all' ? 'All' : k === 'today' ? 'Today' : k}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(10), marginBottom: vs(6)}}>RISK LEVEL</AppText>
          <View style={st.modalPillRow}>
            {['all', 'low', 'medium', 'high'].map(k => {
              const on = fRisk === k;
              return (
                <TouchableOpacity key={k} style={[st.pill, on && st.pillOn, {marginBottom: vs(6)}]}
                  onPress={() => setFRisk(k)}>
                  <AppText variant="small" color={on ? Colors.accent : Colors.textSecondary}>
                    {k.charAt(0).toUpperCase() + k.slice(1)}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
          <View style={{flexDirection: 'row', gap: s(10), marginTop: vs(20)}}>
            <TouchableOpacity style={[st.modalBtn, {backgroundColor: Colors.borderLight, flex: 1}]}
              onPress={() => { setFRisk('all'); setFQuickRange('all'); setFDateFrom(''); setFDateTo(''); }}>
              <AppText variant="bodyBold" color={Colors.textSecondary}>Clear</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={[st.modalBtn, {backgroundColor: Colors.primary, flex: 1}]}
              onPress={() => setFilterModal(false)}>
              <AppText variant="bodyBold" color={Colors.white}>Apply</AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  const renderExportModal = () => (
    <Modal visible={exportModal} transparent animationType="slide">
      <View style={st.modalOverlay}>
        <View style={st.modalSheet}>
          <AppText variant="header" style={{marginBottom: vs(16)}}>Export Access Log</AppText>
          {EXPORT_FORMATS.map((f, i) => (
            <TouchableOpacity key={i} style={st.exportRow} activeOpacity={0.7}>
              <View style={[st.exportIco, {backgroundColor: f.col + '18'}]}>
                <AppText style={{fontSize: ms(18)}}>{f.ico}</AppText>
              </View>
              <View style={{flex: 1, marginLeft: s(10)}}>
                <AppText variant="bodyBold">{f.fmt}</AppText>
                <AppText variant="small" color={Colors.textSecondary}>{f.desc}</AppText>
              </View>
              <AppText variant="body" color={Colors.textTertiary}>{'\u203A'}</AppText>
            </TouchableOpacity>
          ))}
          <View style={st.exportNote}>
            <AppText variant="small" color={Colors.textTertiary}>
              {'🔐'} Each export includes a cryptographic hash for tamper verification.
            </AppText>
          </View>
          <TouchableOpacity style={[st.modalBtn, {backgroundColor: Colors.borderLight, marginTop: vs(10)}]}
            onPress={() => setExportModal(false)}>
            <AppText variant="bodyBold" color={Colors.textSecondary}>Cancel</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  const renderBottomBar = () => (
    <View style={[st.bottomBar, {paddingBottom: insets.bottom + vs(10)}]}>
      <TouchableOpacity style={st.bottomBtnSec} onPress={() => setFilterModal(true)}>
        <AppText variant="bodyBold" color={Colors.primary}>Filter & date</AppText>
      </TouchableOpacity>
      <TouchableOpacity style={st.bottomBtnPri} onPress={() => setExportModal(true)}>
        <AppText variant="bodyBold" color={Colors.white}>Export log</AppText>
      </TouchableOpacity>
    </View>
  );

  return (
    <View style={st.container}>
      {renderHeader()}
      <ScrollView style={st.scroll} contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>
        {renderPills()}
        {renderSearch()}
        {renderDatePresets()}
        {renderSummary()}
        {renderLog()}
        <View style={{height: vs(100)}} />
      </ScrollView>
      {renderBottomBar()}
      {renderFilterModal()}
      {renderExportModal()}
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  scroll: {flex: 1},
  scrollContent: {paddingBottom: vs(40)},
  header: {backgroundColor: Colors.primary, paddingBottom: vs(16), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(12)},
  backBtn: {paddingVertical: vs(4), paddingRight: s(12)},
  backText: {color: Colors.white, fontSize: ms(15)},
  headerTitle: {color: Colors.white, fontSize: ms(24), fontWeight: '700', marginBottom: vs(4)},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  pillRow: {paddingHorizontal: s(16), paddingVertical: vs(12), gap: s(8)},
  pill: {paddingHorizontal: s(14), paddingVertical: vs(6), borderRadius: ms(20), backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderLight},
  pillOn: {backgroundColor: Colors.tealBg, borderColor: Colors.accent},
  searchWrap: {flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, marginHorizontal: s(16), borderRadius: ms(14), paddingHorizontal: s(12), paddingVertical: vs(8), marginBottom: vs(10)},
  searchInput: {flex: 1, fontSize: ms(13), color: Colors.textPrimary, padding: 0},
  dateRow: {paddingHorizontal: s(16), paddingBottom: vs(12), gap: s(8)},
  datePill: {paddingHorizontal: s(12), paddingVertical: vs(5), borderRadius: ms(14), backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderLight},
  datePillOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  summaryRow: {flexDirection: 'row', marginHorizontal: s(16), marginBottom: vs(14), gap: s(8)},
  summaryTile: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(14), paddingVertical: vs(10), alignItems: 'center'},
  integrityBanner: {flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.tealBg, marginHorizontal: s(16), borderRadius: ms(14), padding: s(12), marginBottom: vs(12)},
  dayHeader: {flexDirection: 'row', alignItems: 'center', marginHorizontal: s(16), marginTop: vs(10), marginBottom: vs(8)},
  dayLine: {flex: 1, height: 1, backgroundColor: Colors.borderLight, marginHorizontal: s(8)},
  entryCard: {backgroundColor: Colors.white, borderRadius: ms(14), marginHorizontal: s(16), marginBottom: vs(8), padding: s(12), overflow: 'hidden'},
  strip: {width: s(3), borderRadius: ms(2), alignSelf: 'stretch'},
  icoBox: {width: s(34), height: s(34), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center'},
  metaRow: {flexDirection: 'row', alignItems: 'center', flexWrap: 'wrap', gap: s(6)},
  riskBadge: {paddingHorizontal: s(6), paddingVertical: vs(2), borderRadius: ms(5)},
  dataChip: {paddingHorizontal: s(6), paddingVertical: vs(1), borderRadius: ms(4)},
  detail: {marginTop: vs(10), borderTopWidth: 1, borderColor: Colors.borderLight, paddingTop: vs(8)},
  warnBox: {backgroundColor: 'rgba(239,68,68,0.08)', borderRadius: ms(8), padding: s(10), marginBottom: vs(8)},
  detailRow: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: vs(4)},
  detailLabel: {textTransform: 'uppercase', fontSize: ms(10), fontWeight: '600'},
  detailVal: {textAlign: 'right', flex: 1, marginLeft: s(12)},
  modalOverlay: {flex: 1, backgroundColor: 'rgba(0,0,0,0.45)', justifyContent: 'flex-end'},
  modalSheet: {backgroundColor: Colors.white, borderTopLeftRadius: ms(20), borderTopRightRadius: ms(20), padding: s(20), paddingBottom: vs(30)},
  modalInput: {borderWidth: 1, borderColor: Colors.borderLight, borderRadius: ms(10), paddingHorizontal: s(12), paddingVertical: vs(8), fontSize: ms(13), color: Colors.textPrimary},
  modalPillRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8)},
  modalBtn: {alignItems: 'center', paddingVertical: vs(12), borderRadius: ms(14)},
  exportRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(12), borderBottomWidth: 1, borderColor: Colors.borderLight},
  exportIco: {width: s(40), height: s(40), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center'},
  exportNote: {backgroundColor: Colors.background, borderRadius: ms(10), padding: s(12), marginTop: vs(14)},
  bottomBar: {flexDirection: 'row', backgroundColor: Colors.white, paddingTop: vs(10), paddingHorizontal: s(16), gap: s(10), borderTopWidth: 1, borderColor: Colors.borderLight},
  bottomBtnSec: {flex: 1, alignItems: 'center', paddingVertical: vs(12), borderRadius: ms(14), borderWidth: 1, borderColor: Colors.primary},
  bottomBtnPri: {flex: 1, alignItems: 'center', paddingVertical: vs(12), borderRadius: ms(14), backgroundColor: Colors.primary},
});

export default AccessLogScreen;
