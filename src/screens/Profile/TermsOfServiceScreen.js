import React, {useState, useRef, useCallback} from 'react';
import {
  View, StyleSheet, TouchableOpacity, StatusBar, ScrollView,
  TextInput, Alert, Share,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import {
  TOS_BADGES, CONTEXTUAL_DISCLAIMERS, CRITICAL_THRESHOLDS, TOS_SECTIONS,
} from '../../constants/termsData';

/* ── Rich-text parser (reused from PrivacyPolicyScreen) ── */

const parseRich = (text) => {
  const parts = [];
  const regex = /(\*\*[^*]+?\*\*|\*[^*]+?\*)/g;
  let last = 0;
  let match;
  while ((match = regex.exec(text)) !== null) {
    if (match.index > last) parts.push({t: text.slice(last, match.index)});
    const m = match[0];
    if (m.startsWith('**')) parts.push({t: m.slice(2, -2), b: true});
    else parts.push({t: m.slice(1, -1), em: true});
    last = regex.lastIndex;
  }
  if (last < text.length) parts.push({t: text.slice(last)});
  return parts;
};

const RichText = ({text, style, color, variant = 'body'}) => {
  const parts = parseRich(text);
  return (
    <AppText variant={variant} color={color || Colors.textSecondary} style={[{lineHeight: ms(20)}, style]}>
      {parts.map((p, i) =>
        p.b ? <AppText key={i} variant={variant} style={{fontWeight: '700', color: Colors.textPrimary}}>{p.t}</AppText> :
        p.em ? <AppText key={i} variant={variant} style={{fontWeight: '600', color: Colors.accent}}>{p.t}</AppText> :
        p.t
      )}
    </AppText>
  );
};

/* ── Content block renderer ──────────────────────────── */

const ContentBlock = ({block}) => {
  switch (block.type) {
    case 'p':
      return <RichText text={block.text} style={st.bodyP} />;
    case 'sh':
      return <AppText variant="bodyBold" style={st.subHeading}>{block.text}</AppText>;
    case 'list': {
      const dots = block.dots || [];
      return (
        <View style={st.listWrap}>
          {block.items.map((item, i) => (
            <View key={i} style={st.listItem}>
              <View style={[st.listDot, {backgroundColor: dots[i] || block.dot || Colors.accent}]} />
              <RichText text={item} style={{flex: 1}} />
            </View>
          ))}
        </View>
      );
    }
    case 'table':
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.tableScroll}>
          <View style={st.table}>
            <View style={st.tableHeaderRow}>
              {block.headers.map((h, i) => (
                <View key={i} style={[st.tableCell, {flex: 1, minWidth: s(90)}]}>
                  <AppText variant="caption" color={Colors.textTertiary} style={st.thText}>{h}</AppText>
                </View>
              ))}
            </View>
            {block.rows.map((row, ri) => (
              <View key={ri} style={[st.tableRow, ri < block.rows.length - 1 && st.tableRowBorder]}>
                {row.map((cell, ci) => (
                  <View key={ci} style={[st.tableCell, {flex: 1, minWidth: s(90)}]}>
                    <RichText text={cell} variant="caption" />
                  </View>
                ))}
              </View>
            ))}
          </View>
        </ScrollView>
      );
    case 'info':
      return (
        <View style={st.infoBox}>
          <RichText text={block.text} variant="caption" color={Colors.accent} />
        </View>
      );
    case 'warn':
      return (
        <View style={st.warnBox}>
          <RichText text={block.text} variant="caption" color="#B5600E" />
        </View>
      );
    case 'err':
      return (
        <View style={st.errBox}>
          <RichText text={block.text} variant="caption" color="#9B3A4A" />
        </View>
      );
    case 'critical':
      return (
        <View style={st.critAlert}>
          <AppText style={{fontSize: ms(32), textAlign: 'center', marginBottom: vs(8)}}>{'\uD83D\uDEA8'}</AppText>
          <AppText variant="bodyBold" style={st.critTitle}>Important Health Alert</AppText>
          <AppText variant="caption" color={Colors.red} style={st.critBody}>
            Your inputs may indicate a potentially serious health condition. Please seek immediate medical consultation or visit the nearest healthcare facility without delay.
            {'\n\n'}Do not rely on TrustLife in this situation. Call 112 if required.
          </AppText>
        </View>
      );
    case 'thresholds':
      return (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={st.tableScroll}>
          <View style={st.table}>
            <View style={st.tableHeaderRow}>
              <View style={[st.tableCell, {flex: 1, minWidth: s(130)}]}>
                <AppText variant="caption" color={Colors.textTertiary} style={st.thText}>Parameter</AppText>
              </View>
              <View style={[st.tableCell, {flex: 1, minWidth: s(160)}]}>
                <AppText variant="caption" color={Colors.textTertiary} style={st.thText}>Critical threshold</AppText>
              </View>
            </View>
            {CRITICAL_THRESHOLDS.map((t, i) => (
              <View key={i} style={[st.tableRow, i < CRITICAL_THRESHOLDS.length - 1 && st.tableRowBorder]}>
                <View style={[st.tableCell, {flex: 1, minWidth: s(130)}]}>
                  <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{t.parameter}</AppText>
                </View>
                <View style={[st.tableCell, {flex: 1, minWidth: s(160)}]}>
                  <AppText variant="caption" color={Colors.textSecondary}>{t.threshold}</AppText>
                </View>
              </View>
            ))}
          </View>
        </ScrollView>
      );
    case 'disclaimers':
      return (
        <View style={st.microGrid}>
          {CONTEXTUAL_DISCLAIMERS.map((d, i) => (
            <View key={i} style={[st.microCard, {backgroundColor: d.bgColor, borderColor: d.borderColor}]}>
              <AppText style={{fontSize: ms(20), marginRight: s(10)}}>{d.ico}</AppText>
              <View style={{flex: 1}}>
                <AppText variant="small" style={[st.microTag, {color: d.tagColor}]}>{d.tag}</AppText>
                <AppText variant="caption" color={Colors.textSecondary} style={{lineHeight: ms(17)}}>{d.text}</AppText>
              </View>
            </View>
          ))}
        </View>
      );
    case 'consent':
      return (
        <View style={st.consentBlock}>
          <AppText variant="caption" style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, color: Colors.accent, marginBottom: vs(8)}}>I agree and understand:</AppText>
          <AppText variant="body" color={Colors.textSecondary} style={{fontStyle: 'italic', lineHeight: ms(22)}}>
            {'\u201C'}{block.text}{'\u201D'}
          </AppText>
        </View>
      );
    default:
      return null;
  }
};

/* ── Collapsible Section ─────────────────────────────── */

const SectionAccordion = ({section, expanded, onToggle}) => {
  const numBg = section.color + '18';
  return (
    <View style={st.accordion}>
      <TouchableOpacity style={st.accHeader} activeOpacity={0.7} onPress={onToggle}>
        <View style={[st.secNum, {backgroundColor: numBg}]}>
          <AppText variant="caption" style={[st.secNumText, {color: section.color}]}>{section.num}</AppText>
        </View>
        <AppText variant="bodyBold" style={st.secTitle}>{section.title}</AppText>
        <AppText variant="caption" color={Colors.textTertiary}>
          {expanded ? '\u25BE' : '\u25B8'}
        </AppText>
      </TouchableOpacity>
      {expanded && (
        <View style={st.accBody}>
          {section.body.map((block, i) => <ContentBlock key={i} block={block} />)}
        </View>
      )}
    </View>
  );
};

/* ── Main Screen ─────────────────────────────────────── */

const TermsOfServiceScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const scrollRef = useRef(null);
  const sectionRefs = useRef({});

  const [search, setSearch] = useState('');
  const [expanded, setExpanded] = useState(new Set());
  const [toast, setToast] = useState('');

  const showToast = useCallback((msg) => {
    setToast(msg);
    setTimeout(() => setToast(''), 2200);
  }, []);

  const toggleSection = (num) => {
    setExpanded(prev => {
      const next = new Set(prev);
      if (next.has(num)) next.delete(num);
      else next.add(num);
      return next;
    });
  };

  const scrollToSection = (num) => {
    setExpanded(prev => new Set(prev).add(num));
    const ref = sectionRefs.current[num];
    if (ref && scrollRef.current) {
      ref.measureLayout(
        scrollRef.current.getInnerViewRef ? scrollRef.current.getInnerViewRef() : scrollRef.current,
        (_x, y) => scrollRef.current.scrollTo({y: y - vs(10), animated: true}),
        () => {},
      );
    }
  };

  const filtered = search.trim()
    ? TOS_SECTIONS.filter(sec => {
        const q = search.toLowerCase();
        if (sec.title.toLowerCase().includes(q)) return true;
        return sec.body.some(b => (b.text || '').toLowerCase().includes(q) || (b.items || []).some(it => it.toLowerCase().includes(q)));
      })
    : TOS_SECTIONS;

  const handleDownload = () => {
    Alert.alert('Download PDF', 'Terms of Service v1.2 (PDF) will be saved to your device.', [
      {text: 'Cancel', style: 'cancel'},
      {text: 'Download', onPress: () => showToast('PDF downloaded successfully')},
    ]);
  };

  const handleShare = async () => {
    try {
      await Share.share({message: 'TrustLife Terms of Service v1.2\nhttps://trustlife.in/terms', title: 'Terms of Service'});
    } catch (_) {}
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Header ───────────────────────────────────── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <AppText variant="body" style={st.backText}>{'\u2039'} Transparency</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={st.pdfPill} activeOpacity={0.7} onPress={handleDownload}>
            <AppText variant="small" style={st.pdfPillText}>{'\u2193'} PDF</AppText>
          </TouchableOpacity>
        </View>
        <AppText variant="screenName" style={st.headerTitle}>Terms of Service</AppText>
        <AppText variant="caption" style={st.headerSub}>v1.2 {'\u00B7'} Effective 1 March 2026</AppText>
      </View>

      {/* ── Search ───────────────────────────────────── */}
      <View style={st.searchWrap}>
        <AppText variant="small" style={st.searchIco}>{'\uD83D\uDD0D'}</AppText>
        <TextInput
          style={st.searchInput}
          placeholder="Search these terms..."
          placeholderTextColor={Colors.textTertiary}
          value={search}
          onChangeText={setSearch}
        />
        {search.length > 0 && (
          <TouchableOpacity onPress={() => setSearch('')} style={{padding: s(4)}}>
            <AppText variant="small" color={Colors.textTertiary}>{'\u2715'}</AppText>
          </TouchableOpacity>
        )}
      </View>

      <ScrollView ref={scrollRef} style={st.scroll} contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>

        {/* ── Hero Card ────────────────────────────────── */}
        <View style={st.heroCard}>
          <AppText variant="small" style={st.heroCompany}>TrustLife Health Technologies Pvt Ltd</AppText>
          <AppText variant="header" style={st.heroTitle}>Terms of Service</AppText>
          <AppText variant="caption" color={Colors.textTertiary} style={{marginBottom: vs(12)}}>
            Including Medical Disclaimer & Advisory Framework
          </AppText>
          <View style={st.badgeRow}>
            {TOS_BADGES.map((b, i) => (
              <View key={i} style={[st.badge, {backgroundColor: b.bg, borderColor: b.border}]}>
                <AppText variant="small" style={{color: b.color, fontSize: ms(10), fontWeight: '700'}}>{b.label}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* ── Primary Medical Disclaimer ───────────────── */}
        <View style={st.disclaimerCard}>
          <View style={st.disclaimerBanner}>
            <AppText style={{fontSize: ms(18)}}>{'\u2695\uFE0F'}</AppText>
            <View style={{flex: 1}}>
              <AppText variant="small" color={Colors.white} style={{fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5}}>Primary Medical Disclaimer</AppText>
              <AppText variant="small" color="rgba(255,255,255,0.65)" style={{marginTop: vs(1)}}>Mandatory {'\u2014'} applies to all use of TrustLife and Ayu</AppText>
            </View>
          </View>
          <AppText variant="body" color={Colors.textSecondary} style={st.disclaimerText}>
            TrustLife provides health insights based on available data and user inputs. It does <AppText variant="body" style={{fontWeight: '700', color: Colors.textPrimary}}>not</AppText> provide medical diagnosis, treatment, or clinical advice.
          </AppText>
          <AppText variant="body" color={Colors.textSecondary} style={st.disclaimerText}>
            All users are <AppText variant="body" style={{fontWeight: '700', color: Colors.textPrimary}}>strongly advised to consult a qualified medical practitioner</AppText> before making any health-related decisions.
          </AppText>
          <AppText variant="body" color={Colors.textSecondary} style={st.disclaimerText}>
            Ayu{'\u2019'}s insights, scores, trends, and recommendations are for <AppText variant="body" style={{fontWeight: '700', color: Colors.textPrimary}}>informational awareness only</AppText>. They do not constitute medical advice and must not replace professional medical consultation.
          </AppText>
          <AppText variant="body" color={Colors.red} style={st.disclaimerTagline}>
            {'\u201C'}Guidance, not diagnosis. Insights, not prescriptions.{'\u201D'}
          </AppText>
        </View>

        {/* ── Table of Contents ────────────────────────── */}
        <AppText variant="sectionTitle" style={st.sectionLabel}>CONTENTS</AppText>
        <View style={st.card}>
          {TOS_SECTIONS.map((sec, i) => (
            <TouchableOpacity
              key={sec.num}
              style={[st.tocItem, i < TOS_SECTIONS.length - 1 && st.tocBorder]}
              activeOpacity={0.6}
              onPress={() => scrollToSection(sec.num)}>
              <AppText variant="caption" style={[st.tocNum, {color: sec.color}]}>{sec.num}.</AppText>
              <AppText variant="body" color={Colors.textSecondary} style={st.tocTitle}>{sec.title}</AppText>
              <AppText variant="caption" color={Colors.textTertiary}>{'\u25B8'}</AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Sections ─────────────────────────────────── */}
        {filtered.map(sec => (
          <View
            key={sec.num}
            ref={ref => { sectionRefs.current[sec.num] = ref; }}
            onLayout={() => {}}>
            <SectionAccordion
              section={sec}
              expanded={expanded.has(sec.num)}
              onToggle={() => toggleSection(sec.num)}
            />
          </View>
        ))}

        {filtered.length === 0 && (
          <View style={[st.card, {alignItems: 'center', paddingVertical: vs(30)}]}>
            <AppText variant="body" color={Colors.textTertiary}>No sections match "{search}"</AppText>
          </View>
        )}

        {/* ── Download Section ─────────────────────────── */}
        <AppText variant="sectionTitle" style={st.sectionLabel}>DOWNLOAD</AppText>

        <View style={st.downloadHero}>
          <AppText variant="caption" style={st.dlVersion}>OFFICIAL DOCUMENT</AppText>
          <AppText variant="header" style={st.dlTitle}>Terms of Service v1.2</AppText>
          <AppText variant="caption" color={Colors.textTertiary} style={{marginBottom: vs(12)}}>
            18 sections {'\u00B7'} Medical Disclaimer & Advisory Framework
          </AppText>
          <View style={{flexDirection: 'row', gap: s(8)}}>
            <TouchableOpacity style={st.dlBtn} activeOpacity={0.8} onPress={handleDownload}>
              <AppText variant="bodyBold" color={Colors.white}>{'\u2193'} Download PDF</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={st.shareBtn} activeOpacity={0.7} onPress={handleShare}>
              <AppText variant="bodyBold" color={Colors.red}>Share</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Format cards */}
        <View style={st.formatGrid}>
          <TouchableOpacity style={st.formatCard} activeOpacity={0.7} onPress={handleDownload}>
            <AppText style={{fontSize: ms(24), marginBottom: vs(6)}}>{'\uD83D\uDCC4'}</AppText>
            <AppText variant="bodyBold">PDF</AppText>
            <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>Formatted {'\u00B7'} ~32 KB</AppText>
            <AppText variant="caption" style={{marginTop: vs(8), fontWeight: '700', color: Colors.red}}>{'\u2193'} Download</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={st.formatCard} activeOpacity={0.7} onPress={() => showToast('Opening plain text version...')}>
            <AppText style={{fontSize: ms(24), marginBottom: vs(6)}}>{'\uD83D\uDCDD'}</AppText>
            <AppText variant="bodyBold">Plain text</AppText>
            <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>Accessible format</AppText>
            <AppText variant="caption" style={{marginTop: vs(8), fontWeight: '700', color: Colors.blue}}>{'\u2193'} Download</AppText>
          </TouchableOpacity>
        </View>

        {/* ── Contact Card ─────────────────────────────── */}
        <View style={st.contactCard}>
          <AppText variant="sectionTitle" style={st.contactTitle}>LEGAL & GRIEVANCE CONTACT</AppText>
          <AppText variant="bodyBold" style={{marginBottom: vs(2)}}>Venkata Cherukuri</AppText>
          <AppText variant="caption" color={Colors.textTertiary} style={{marginBottom: vs(5)}}>Founder & CEO {'\u00B7'} Grievance Officer</AppText>
          <TouchableOpacity activeOpacity={0.6}>
            <AppText variant="bodyBold" color={Colors.accent} style={{marginBottom: vs(2)}}>{'\uD83D\uDCE7'} legal@trustlife.in</AppText>
          </TouchableOpacity>
          <AppText variant="caption" color={Colors.textTertiary}>CIN: U85110TG2024PTC000001 {'\u00B7'} Hyderabad, Telangana</AppText>
        </View>

        {/* ── Footer ───────────────────────────────────── */}
        <View style={st.footer}>
          <AppText variant="caption" color={Colors.textTertiary} style={st.footerText}>{'\u00A9'} 2026 TrustLife Health Technologies Pvt Ltd. All rights reserved.</AppText>
        </View>

        <View style={{height: vs(40)}} />
      </ScrollView>

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
  pdfPill: {paddingHorizontal: s(12), paddingVertical: vs(5), borderRadius: ms(20), backgroundColor: 'rgba(226,75,74,0.12)', borderWidth: 0.5, borderColor: 'rgba(226,75,74,0.3)'},
  pdfPillText: {color: '#E24B4A', fontSize: ms(12), fontWeight: '700'},
  headerTitle: {color: Colors.white, fontSize: ms(22), fontWeight: '700', marginBottom: vs(3)},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},

  /* Search */
  searchWrap: {flexDirection: 'row', alignItems: 'center', marginHorizontal: s(14), marginVertical: vs(8), backgroundColor: Colors.white, borderRadius: ms(10), paddingHorizontal: s(10), paddingVertical: vs(6), borderWidth: 0.5, borderColor: Colors.borderLight},
  searchIco: {fontSize: ms(13), marginRight: s(6), opacity: 0.45},
  searchInput: {flex: 1, fontSize: ms(13), color: Colors.textPrimary, padding: 0, fontWeight: '500'},

  /* Scroll */
  scroll: {flex: 1},
  scrollContent: {padding: s(14)},
  sectionLabel: {marginBottom: vs(8), marginTop: vs(10)},

  /* Hero */
  heroCard: {backgroundColor: Colors.white, borderRadius: ms(16), padding: s(16), marginBottom: vs(10)},
  heroCompany: {fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, color: Colors.textTertiary, marginBottom: vs(5)},
  heroTitle: {fontSize: ms(20), fontWeight: '800', color: Colors.textPrimary, marginBottom: vs(3)},
  badgeRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(5)},
  badge: {paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(4), borderWidth: 0.5},

  /* Primary Disclaimer */
  disclaimerCard: {backgroundColor: Colors.redBg, borderWidth: 0.5, borderColor: 'rgba(226,75,74,0.25)', borderRadius: ms(14), padding: s(14), marginBottom: vs(10)},
  disclaimerBanner: {backgroundColor: Colors.red, borderRadius: ms(9), padding: s(10), marginBottom: vs(10), flexDirection: 'row', alignItems: 'center', gap: s(8)},
  disclaimerText: {lineHeight: ms(22), marginBottom: vs(8)},
  disclaimerTagline: {fontWeight: '800', fontStyle: 'italic', textAlign: 'center', marginTop: vs(4)},

  /* Info / Warn / Err boxes */
  infoBox: {backgroundColor: Colors.tealBg, borderWidth: 0.5, borderColor: 'rgba(29,158,117,0.25)', borderRadius: ms(10), padding: s(11), marginVertical: vs(6)},
  warnBox: {backgroundColor: Colors.amberBg, borderWidth: 0.5, borderColor: 'rgba(245,158,11,0.25)', borderRadius: ms(10), padding: s(11), marginVertical: vs(6)},
  errBox: {backgroundColor: Colors.redBg, borderWidth: 0.5, borderColor: 'rgba(226,75,74,0.25)', borderRadius: ms(10), padding: s(11), marginVertical: vs(6)},

  /* Critical Alert */
  critAlert: {backgroundColor: Colors.redBg, borderWidth: 0.5, borderColor: 'rgba(226,75,74,0.3)', borderRadius: ms(14), padding: s(14), marginVertical: vs(8), alignItems: 'center'},
  critTitle: {fontSize: ms(13), color: Colors.red, marginBottom: vs(6), textAlign: 'center'},
  critBody: {textAlign: 'center', lineHeight: ms(18)},

  /* Contextual Disclaimers Grid */
  microGrid: {marginVertical: vs(8)},
  microCard: {flexDirection: 'row', alignItems: 'flex-start', padding: s(11), borderRadius: ms(10), borderWidth: 0.5, marginBottom: vs(5)},
  microTag: {fontSize: ms(9), fontWeight: '800', textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(2)},

  /* Consent Block */
  consentBlock: {backgroundColor: Colors.tealBg, borderWidth: 0.5, borderColor: 'rgba(29,158,117,0.25)', borderRadius: ms(14), padding: s(14), marginVertical: vs(8)},

  /* Card */
  card: {backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14), marginBottom: vs(10)},

  /* TOC */
  tocItem: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8), gap: s(8)},
  tocBorder: {borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  tocNum: {fontSize: ms(12), fontWeight: '700', minWidth: s(24)},
  tocTitle: {flex: 1, fontSize: ms(13)},

  /* Accordion */
  accordion: {backgroundColor: Colors.white, borderRadius: ms(14), overflow: 'hidden', marginBottom: vs(7)},
  accHeader: {flexDirection: 'row', alignItems: 'center', padding: s(12), gap: s(10)},
  secNum: {width: ms(32), height: ms(32), borderRadius: ms(8), alignItems: 'center', justifyContent: 'center'},
  secNumText: {fontSize: ms(12), fontWeight: '800'},
  secTitle: {flex: 1, fontSize: ms(13)},
  accBody: {paddingHorizontal: s(14), paddingBottom: s(14)},

  /* Body content */
  bodyP: {fontSize: ms(13), marginBottom: vs(8)},
  subHeading: {fontSize: ms(13), marginTop: vs(10), marginBottom: vs(5)},
  listWrap: {marginBottom: vs(8)},
  listItem: {flexDirection: 'row', gap: s(8), marginBottom: vs(5)},
  listDot: {width: ms(6), height: ms(6), borderRadius: ms(3), marginTop: vs(7), flexShrink: 0},

  /* Table */
  tableScroll: {marginVertical: vs(6)},
  table: {minWidth: '100%'},
  tableHeaderRow: {flexDirection: 'row', backgroundColor: Colors.background, paddingVertical: vs(6), paddingHorizontal: s(8), borderRadius: ms(6)},
  tableCell: {paddingHorizontal: s(6), paddingVertical: vs(2)},
  thText: {fontSize: ms(11), fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.4},
  tableRow: {flexDirection: 'row', paddingVertical: vs(7), paddingHorizontal: s(8)},
  tableRowBorder: {borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},

  /* Download hero */
  downloadHero: {backgroundColor: Colors.white, borderRadius: ms(16), padding: s(16), marginBottom: vs(8)},
  dlVersion: {fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, color: Colors.red, marginBottom: vs(4)},
  dlTitle: {fontSize: ms(16), fontWeight: '800', color: Colors.textPrimary, marginBottom: vs(3)},
  dlBtn: {flex: 2, backgroundColor: Colors.red, borderRadius: ms(10), paddingVertical: vs(10), alignItems: 'center'},
  shareBtn: {flex: 1, backgroundColor: Colors.redBg, borderRadius: ms(10), paddingVertical: vs(10), alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(226,75,74,0.25)'},

  /* Format grid */
  formatGrid: {flexDirection: 'row', gap: s(6), marginBottom: vs(10)},
  formatCard: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(12), padding: s(12)},

  /* Contact */
  contactCard: {backgroundColor: Colors.tealBg, borderWidth: 0.5, borderColor: 'rgba(29,158,117,0.25)', borderRadius: ms(14), padding: s(14), marginTop: vs(10)},
  contactTitle: {color: Colors.accent, marginBottom: vs(10)},

  /* Footer */
  footer: {alignItems: 'center', paddingVertical: vs(16)},
  footerText: {textAlign: 'center', marginBottom: vs(2)},

  /* Toast */
  toast: {position: 'absolute', bottom: vs(40), alignSelf: 'center', backgroundColor: Colors.accent, borderRadius: ms(20), paddingHorizontal: s(18), paddingVertical: vs(9)},
});

export default TermsOfServiceScreen;
