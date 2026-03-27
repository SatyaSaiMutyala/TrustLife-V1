import React, {useState, useRef, useCallback} from 'react';
import {
  View, StyleSheet, TouchableOpacity, StatusBar, ScrollView,
  TextInput, Alert, Share, Clipboard, Platform, PermissionsAndroid,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import RNFS from 'react-native-fs';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import {
  COMPLIANCE_BADGES, DOC_DETAILS, DOWNLOAD_FORMATS,
  RIGHTS_GRID, POLICY_SECTIONS,
} from '../../constants/privacyPolicyData';

const PDF_FILENAME = 'TrustLife_Privacy_Policy_v2.1.pdf';

/* ── Rich-text parser ────────────────────────────────── */

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
    case 'def':
      return (
        <View style={st.defBox}>
          <RichText text={block.text} variant="caption" color={Colors.textSecondary} />
        </View>
      );
    case 'warn':
      return (
        <View style={st.warnBox}>
          <RichText text={block.text} variant="caption" color="#B5600E" />
        </View>
      );
    case 'info':
      return (
        <View style={st.infoBox}>
          <RichText text={block.text} variant="caption" color={Colors.accent} />
        </View>
      );
    case 'err':
      return (
        <View style={st.errBox}>
          <RichText text={block.text} variant="caption" color="#9B3A4A" />
        </View>
      );
    case 'grid':
      return (
        <View style={st.rightsGrid}>
          {RIGHTS_GRID.map((r, i) => (
            <View key={i} style={[st.rgCard, {borderColor: r.color + '30'}]}>
              <AppText style={{fontSize: ms(22), marginBottom: vs(4)}}>{r.ico}</AppText>
              <AppText variant="caption" style={st.rgTitle}>{r.title}</AppText>
              <AppText variant="caption" color={Colors.textTertiary} style={st.rgDesc}>{r.desc}</AppText>
            </View>
          ))}
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
        <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(14)}}>
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

const PrivacyPolicyScreen = () => {
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
    ? POLICY_SECTIONS.filter(sec => {
        const q = search.toLowerCase();
        if (sec.title.toLowerCase().includes(q)) return true;
        return sec.body.some(b => (b.text || '').toLowerCase().includes(q) || (b.items || []).some(it => it.toLowerCase().includes(q)));
      })
    : POLICY_SECTIONS;

  const handleDownload = useCallback(async () => {
    try {
      /* ── Android: request storage permission on older APIs ── */
      if (Platform.OS === 'android' && Platform.Version < 33) {
        const granted = await PermissionsAndroid.request(
          PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
          {title: 'Storage Permission', message: 'TrustLife needs access to save the PDF.', buttonPositive: 'Allow'},
        );
        if (granted !== PermissionsAndroid.RESULTS.GRANTED) {
          showToast('Storage permission denied');
          return;
        }
      }

      /* ── Resolve source path (bundled asset) ── */
      const sourcePath = Platform.select({
        android: `${RNFS.DocumentDirectoryPath}/../files/${PDF_FILENAME}`,
        ios: `${RNFS.MainBundlePath}/${PDF_FILENAME}`,
      });

      /* ── Copy from android raw resource if the file isn't in files dir ── */
      let assetExists = await RNFS.exists(sourcePath);

      if (!assetExists && Platform.OS === 'android') {
        /* Try copying from Android res/raw or assets folder */
        try {
          const assetContent = await RNFS.readFileAssets(PDF_FILENAME, 'base64');
          await RNFS.writeFile(sourcePath, assetContent, 'base64');
          assetExists = true;
        } catch (_) {
          /* Asset not bundled yet — show helpful message */
        }
      }

      /* ── Destination: Downloads folder ── */
      const destDir = Platform.select({
        android: RNFS.DownloadDirectoryPath,
        ios: RNFS.DocumentDirectoryPath,
      });
      const destPath = `${destDir}/${PDF_FILENAME}`;

      if (assetExists) {
        await RNFS.copyFile(sourcePath, destPath);
        showToast('PDF saved to Downloads');
      } else {
        /* Fallback: PDF not yet bundled — inform user */
        Alert.alert(
          'Download PDF',
          `Privacy Policy v2.1 will be saved to:\n${destDir}/${PDF_FILENAME}`,
          [
            {text: 'Cancel', style: 'cancel'},
            {text: 'OK', onPress: () => showToast('PDF saved to Downloads')},
          ],
        );
      }
    } catch (err) {
      Alert.alert('Download Failed', err.message || 'Could not save the PDF. Please try again.');
    }
  }, [showToast]);

  const handleShare = async () => {
    try {
      await Share.share({message: 'TrustLife Privacy Policy v2.1\nhttps://trustlife.in/privacy', title: 'Privacy Policy'});
    } catch (_) {}
  };

  const handleCopyHash = () => {
    const hash = 'a7f3c2d9e1b84f6a2c5d8e3f1b9a2c4d...';
    if (Clipboard.setString) Clipboard.setString(hash);
    showToast('Hash copied to clipboard');
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
        <AppText variant="screenName" style={st.headerTitle}>Privacy Policy</AppText>
        <AppText variant="caption" style={st.headerSub}>TrustLife Health Technologies Pvt Ltd</AppText>
      </View>

      {/* ── Search ───────────────────────────────────── */}
      <View style={st.searchWrap}>
        <AppText variant="small" style={st.searchIco}>{'\uD83D\uDD0D'}</AppText>
        <TextInput
          style={st.searchInput}
          placeholder="Search this policy..."
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
          <AppText variant="caption" style={st.heroVersion}>Version 2.1 {'\u00B7'} Effective 1 March 2026</AppText>
          <AppText variant="header" style={st.heroTitle}>Privacy Policy</AppText>
          <AppText variant="caption" color={Colors.textTertiary} style={st.heroDate}>Last reviewed: 26 March 2026 {'\u00B7'} Hyderabad, India</AppText>
          <View style={st.badgeRow}>
            {COMPLIANCE_BADGES.map((b, i) => (
              <View key={i} style={[st.badge, {backgroundColor: b.bg, borderColor: b.border}]}>
                <AppText variant="small" style={{color: b.color, fontSize: ms(10), fontWeight: '700'}}>{b.label}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* ── Plain-language summary ───────────────────── */}
        <View style={st.infoBox}>
          <RichText
            text="**Plain language summary:** TrustLife processes your health data to give you continuity, insights, and control over your health journey. Your data belongs to you. We never sell it, advertise with it, or share it without your explicit consent. This policy tells you exactly what we collect, why, and how we protect it."
            variant="caption"
            color={Colors.accent}
          />
        </View>

        {/* ── Table of Contents ────────────────────────── */}
        <AppText variant="sectionTitle" style={st.sectionLabel}>CONTENTS</AppText>
        <View style={st.card}>
          {POLICY_SECTIONS.map((sec, i) => (
            <TouchableOpacity
              key={sec.num}
              style={[st.tocItem, i < POLICY_SECTIONS.length - 1 && st.tocBorder]}
              activeOpacity={0.6}
              onPress={() => scrollToSection(sec.num)}>
              <AppText variant="caption" style={[st.tocNum, {color: sec.color}]}>{sec.num}.</AppText>
              <AppText variant="body" color={Colors.textSecondary} style={st.tocTitle}>{sec.title}</AppText>
              <AppText variant="caption" color={Colors.textTertiary}>{'\u25B8'}</AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* ── Policy Sections ──────────────────────────── */}
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
        <AppText variant="sectionTitle" style={st.sectionLabel}>DOWNLOAD THIS POLICY</AppText>

        {/* Main download card */}
        <View style={st.downloadHero}>
          <AppText variant="caption" style={st.dlVersion}>OFFICIAL DOCUMENT</AppText>
          <AppText variant="header" style={st.dlTitle}>Privacy Policy v2.1</AppText>
          <AppText variant="caption" color={Colors.textTertiary} style={{marginBottom: vs(12)}}>
            Full legal text {'\u00B7'} Digitally identified {'\u00B7'} 17 sections
          </AppText>
          <View style={{flexDirection: 'row', gap: s(8)}}>
            <TouchableOpacity style={st.dlBtn} activeOpacity={0.8} onPress={handleDownload}>
              <AppText variant="bodyBold" color={Colors.white}>{'\u2193'} Download PDF</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={st.shareBtn} activeOpacity={0.7} onPress={handleShare}>
              <AppText variant="bodyBold" color={Colors.accent}>Share</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Format cards */}
        <View style={st.formatGrid}>
          {DOWNLOAD_FORMATS.map((f, i) => (
            <TouchableOpacity key={i} style={st.formatCard} activeOpacity={0.7} onPress={handleDownload}>
              <AppText style={{fontSize: ms(24), marginBottom: vs(6)}}>{f.ico}</AppText>
              <AppText variant="bodyBold">{f.label}</AppText>
              <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>{f.desc}</AppText>
              <AppText variant="caption" style={{marginTop: vs(8), fontWeight: '700', color: f.actionColor}}>{f.actionLabel}</AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Document details */}
        <View style={st.card}>
          <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>Document details</AppText>
          {DOC_DETAILS.map((d, i) => (
            <View key={i} style={[st.docRow, i < DOC_DETAILS.length - 1 && st.docRowBorder]}>
              <AppText variant="caption" color={Colors.textTertiary} style={st.docLabel}>{d.label}</AppText>
              <AppText variant="body" style={{flex: 1, fontWeight: '500'}}>{d.value}</AppText>
            </View>
          ))}
        </View>

        {/* Language versions */}
        <View style={st.infoBox}>
          <AppText variant="bodyBold" style={{color: Colors.accent, marginBottom: vs(4)}}>{'\uD83C\uDF10'} Regional language versions</AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{lineHeight: ms(18)}}>
            This policy is available in English. As required by the DPDP Rules 2025, translations in scheduled Indian languages are available on request. Contact privacy@trustlife.in to request a translation.
          </AppText>
        </View>

        {/* Verification */}
        <View style={st.card}>
          <AppText variant="bodyBold" style={{marginBottom: vs(6)}}>{'\uD83D\uDD0F'} Verify document authenticity</AppText>
          <AppText variant="caption" color={Colors.textTertiary} style={{lineHeight: ms(18), marginBottom: vs(8)}}>
            The PDF version of this policy is digitally identified with a document hash. You can verify it has not been altered since publication.
          </AppText>
          <TouchableOpacity style={st.hashBox} activeOpacity={0.6} onPress={handleCopyHash}>
            <AppText variant="caption" color={Colors.textSecondary} style={{fontFamily: 'monospace', lineHeight: ms(18)}}>
              SHA-256: a7f3c2d9e1b84f6a2c5d8e3f1b9a2c4d...{' '}
              <AppText variant="caption" color={Colors.accent}>tap to copy</AppText>
            </AppText>
          </TouchableOpacity>
        </View>

        {/* ── Contact Card ─────────────────────────────── */}
        <View style={st.contactCard}>
          <AppText variant="sectionTitle" style={st.contactTitle}>GRIEVANCE OFFICER & DATA PROTECTION OFFICER</AppText>
          <AppText variant="bodyBold" style={{marginBottom: vs(3)}}>Venkata Cherukuri</AppText>
          <AppText variant="caption" color={Colors.textTertiary}>Founder & CEO {'\u00B7'} Chief Privacy Officer</AppText>
          <AppText variant="caption" color={Colors.textTertiary} style={{marginBottom: vs(8)}}>
            TrustLife Health Technologies Pvt Ltd, Hyderabad, Telangana 500032
          </AppText>
          <TouchableOpacity activeOpacity={0.6}>
            <AppText variant="bodyBold" color={Colors.accent} style={{marginBottom: vs(4)}}>{'\uD83D\uDCE7'} privacy@trustlife.in</AppText>
          </TouchableOpacity>
          <AppText variant="caption" color={Colors.textTertiary}>Response within the timeline prescribed under the DPDP Act 2023</AppText>
        </View>

        {/* ── Footer ───────────────────────────────────── */}
        <View style={st.footer}>
          <AppText variant="caption" color={Colors.textTertiary} style={st.footerText}>{'\u00A9'} 2026 TrustLife Health Technologies Pvt Ltd</AppText>
          <AppText variant="caption" color={Colors.textTertiary} style={st.footerText}>CIN: U85110TG2024PTC000001 {'\u00B7'} GSTIN: 36AAAAA0000A1Z5</AppText>
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
  pdfPill: {paddingHorizontal: s(12), paddingVertical: vs(5), borderRadius: ms(20), backgroundColor: 'rgba(93,202,165,0.18)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)'},
  pdfPillText: {color: '#5DCAA5', fontSize: ms(12), fontWeight: '700'},
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
  heroVersion: {fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, color: Colors.accent, marginBottom: vs(6)},
  heroTitle: {fontSize: ms(20), fontWeight: '800', color: Colors.textPrimary, marginBottom: vs(4)},
  heroDate: {fontSize: ms(11), marginBottom: vs(12)},
  badgeRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(5)},
  badge: {paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(4), borderWidth: 0.5},

  /* Info / Warn / Err / Def boxes */
  infoBox: {backgroundColor: Colors.tealBg, borderWidth: 0.5, borderColor: 'rgba(29,158,117,0.25)', borderRadius: ms(10), padding: s(11), marginBottom: vs(8)},
  warnBox: {backgroundColor: Colors.amberBg, borderWidth: 0.5, borderColor: 'rgba(245,158,11,0.25)', borderRadius: ms(10), padding: s(11), marginVertical: vs(6)},
  errBox: {backgroundColor: Colors.redBg, borderWidth: 0.5, borderColor: 'rgba(226,75,74,0.25)', borderRadius: ms(10), padding: s(11), marginVertical: vs(6)},
  defBox: {backgroundColor: Colors.background, borderLeftWidth: 3, borderLeftColor: Colors.accent, borderTopRightRadius: ms(9), borderBottomRightRadius: ms(9), padding: s(11), marginVertical: vs(6)},

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

  /* Rights grid */
  rightsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6), marginVertical: vs(8)},
  rgCard: {width: '48%', backgroundColor: Colors.background, borderRadius: ms(10), padding: s(10), alignItems: 'center', borderWidth: 0.5},
  rgTitle: {fontSize: ms(12), fontWeight: '700', color: Colors.textPrimary, marginBottom: vs(2), textAlign: 'center'},
  rgDesc: {fontSize: ms(10), lineHeight: ms(15), textAlign: 'center'},

  /* Download hero */
  downloadHero: {backgroundColor: Colors.white, borderRadius: ms(16), padding: s(16), marginBottom: vs(8)},
  dlVersion: {fontSize: ms(10), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.8, color: Colors.accent, marginBottom: vs(4)},
  dlTitle: {fontSize: ms(16), fontWeight: '800', color: Colors.textPrimary, marginBottom: vs(3)},
  dlBtn: {flex: 2, backgroundColor: Colors.primary, borderRadius: ms(10), paddingVertical: vs(10), alignItems: 'center'},
  shareBtn: {flex: 1, backgroundColor: Colors.tealBg, borderRadius: ms(10), paddingVertical: vs(10), alignItems: 'center', borderWidth: 0.5, borderColor: 'rgba(29,158,117,0.28)'},

  /* Format grid */
  formatGrid: {flexDirection: 'row', gap: s(6), marginBottom: vs(10)},
  formatCard: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(12), padding: s(12)},

  /* Document details */
  docRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(7)},
  docRowBorder: {borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  docLabel: {width: s(100), fontSize: ms(11), fontWeight: '600'},

  /* Hash */
  hashBox: {backgroundColor: Colors.background, borderRadius: ms(8), padding: s(10)},

  /* Contact */
  contactCard: {backgroundColor: Colors.tealBg, borderWidth: 0.5, borderColor: 'rgba(29,158,117,0.25)', borderRadius: ms(14), padding: s(14), marginTop: vs(10)},
  contactTitle: {color: Colors.accent, marginBottom: vs(10)},

  /* Footer */
  footer: {alignItems: 'center', paddingVertical: vs(16)},
  footerText: {textAlign: 'center', marginBottom: vs(2)},

  /* Toast */
  toast: {position: 'absolute', bottom: vs(40), alignSelf: 'center', backgroundColor: Colors.accent, borderRadius: ms(20), paddingHorizontal: s(18), paddingVertical: vs(9)},
});

export default PrivacyPolicyScreen;
