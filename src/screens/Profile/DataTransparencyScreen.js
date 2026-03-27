import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, Modal} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../components/shared/AppText';
import Colors from '../../constants/colors';

const Toggle = ({on, onToggle}) => (
  <TouchableOpacity onPress={onToggle} style={[st.toggle, on && st.toggleOn]}>
    <View style={[st.thumb, on && st.thumbOn]} />
  </TouchableOpacity>
);

const SECTIONS = [
  {id: 1, title: 'What Data We Process'},
  {id: 2, title: 'How Your Data Is Used'},
  {id: 3, title: 'Consent-Based Sharing'},
  {id: 4, title: 'Security Measures'},
  {id: 5, title: 'Your Rights'},
  {id: 6, title: 'Access Log'},
  {id: 7, title: 'Legal Alignment'},
  {id: 8, title: 'Contact & Grievance'},
];

const DATA_CATS = [
  {ico: '🩺', name: 'Diagnostic records', desc: 'Lab results, prescriptions, imaging', src: 'You upload'},
  {ico: '🏃', name: 'Lifestyle inputs', desc: 'Steps, sleep, nutrition logs', src: 'You enter'},
  {ico: '💊', name: 'Medication data', desc: 'Active medications, refill history', src: 'You enter'},
  {ico: '📊', name: 'Derived analytics', desc: 'Health scores, risk predictions', src: 'System derived'},
  {ico: '📋', name: 'Consent & access logs', desc: 'Who accessed what and when', src: 'Auto-recorded'},
];

const SECURITY = [
  {ico: '🔒', name: 'Encryption in transit', detail: 'TLS 1.3'},
  {ico: '🛡️', name: 'Encryption at rest', detail: 'AES-256'},
  {ico: '👤', name: 'Role-based access', detail: 'RBAC enforced'},
  {ico: '📡', name: 'Infrastructure monitoring', detail: '24/7 alerts'},
  {ico: '🔐', name: 'Biometric auth', detail: 'Face ID / fingerprint'},
  {ico: '📱', name: 'Device binding', detail: 'Trusted devices only'},
];

const ACCESS_EVENTS = [
  {dot: '#22c55e', action: 'You viewed lab results', time: '2 hours ago'},
  {dot: '#3b82f6', action: 'Dr. Meera accessed vitals', time: '1 day ago'},
  {dot: '#f59e0b', action: 'Pharmacy viewed prescription', time: '3 days ago'},
  {dot: '#22c55e', action: 'You updated medications', time: '5 days ago'},
  {dot: '#ef4444', action: 'Failed login attempt blocked', time: '7 days ago'},
];

const LEGAL_PILLS = ['DPDP Act 2023', 'Health data standards', 'IT Act 2000', 'ABDM guidelines'];

const PRIVACY_SECTIONS = [
  {t: 'Identity of the Data Fiduciary', b: 'TrustLife Health Technologies Pvt. Ltd. operates this application. We are the data fiduciary responsible for processing your personal and health data under the DPDP Act 2023.'},
  {t: 'Data Collected', b: '• Personal identifiers (name, email, phone)\n• Health records you upload or enter\n• Device and usage analytics\n• Location data (only with explicit consent)\n• Biometric authentication tokens'},
  {t: 'Legal Basis for Processing', b: '• Consent: Explicit opt-in for each purpose\n• Legitimate interest: Service improvement\n• Legal obligation: Regulatory compliance\n• Vital interest: Emergency health scenarios'},
  {t: 'How We Use Your Data', b: '• Providing personalised health insights\n• Facilitating doctor consultations\n• Generating wellness analytics\n• Sending medication reminders\n• Improving service quality'},
  {t: 'Data Sharing', b: '• Healthcare providers (with consent)\n• Pharmacy partners (for prescriptions)\n• Anonymised research (opt-in only)\n• Legal authorities (when required by law)\n• Never sold to advertisers or data brokers'},
  {t: 'Retention Policy', b: 'Health records: retained for the duration of your account plus 3 years. Analytics data: 12 months. Access logs: 90 days. You can request deletion at any time.'},
  {t: 'International Transfers', b: 'Your data is stored on servers within India. If transfer outside India is needed, we ensure adequate protection as per DPDP Act requirements.'},
  {t: 'Your Rights', b: '• Right to access your data\n• Right to correction of inaccuracies\n• Right to erasure / deletion\n• Right to withdraw consent\n• Right to data portability\n• Right to nominate'},
  {t: 'Cookies & Tracking', b: 'We use essential cookies for authentication and session management. Analytics cookies are used only with consent. No third-party advertising trackers.'},
  {t: 'Minors', b: 'TrustLife is not intended for users under 18. We do not knowingly collect data from minors without verifiable parental consent.'},
  {t: 'Changes to This Policy', b: 'We may update this policy periodically. You will be notified of material changes via in-app notification. Continued use after notice constitutes acceptance.'},
];

const TERMS_SECTIONS = [
  {t: 'About TrustLife', b: 'TrustLife is a health management platform that helps users track, manage, and understand their health data. These terms govern your use of the application.'},
  {t: 'Eligibility', b: 'You must be 18 years or older to use TrustLife. By registering, you confirm that you meet this requirement and that the information you provide is accurate.'},
  {t: 'Medical Disclaimer', b: 'TrustLife is NOT a substitute for professional medical advice, diagnosis, or treatment. Always consult a qualified healthcare provider. AI-generated insights are informational only.'},
  {t: 'Permitted Use', b: '• Personal health tracking and management\n• Sharing records with chosen providers\n• Accessing wellness insights\n• You must not misuse the platform or attempt unauthorised access'},
  {t: 'Your Account', b: 'You are responsible for maintaining the security of your account credentials. Notify us immediately of any unauthorised access. We may suspend accounts that violate these terms.'},
  {t: 'Ayu AI Assistant', b: 'Ayu provides AI-powered health insights based on your data. Ayu does not replace medical professionals. Recommendations are suggestions, not prescriptions.'},
  {t: 'Subscriptions & Payments', b: 'Premium features require a subscription. Billing occurs through your app store. Refunds are subject to the respective store policies. We may change pricing with 30 days notice.'},
  {t: 'Limitation of Liability', b: 'TrustLife is provided "as is." We are not liable for decisions made based on app-generated insights. Our total liability shall not exceed the amount paid in the last 12 months.'},
  {t: 'Intellectual Property', b: 'All content, design, and technology in TrustLife are owned by TrustLife Health Technologies. You retain ownership of your health data. We claim no IP rights over user-submitted content.'},
  {t: 'Governing Law', b: 'These terms are governed by the laws of India. Disputes shall be subject to the exclusive jurisdiction of courts in Bengaluru, Karnataka.'},
  {t: 'Updates to Terms', b: 'We reserve the right to modify these terms. Material changes will be communicated via the app. Your continued use after changes constitutes acceptance of the revised terms.'},
];

const DataTransparencyScreen = () => {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const [expandedId, setExpandedId] = useState(1);
  const [activeLayer, setActiveLayer] = useState(null);
  const [layerExpanded, setLayerExpanded] = useState(null);
  const [consents, setConsents] = useState({meera: true, research: false, pharmacy: true, insurance: false});

  const toggleConsent = k => setConsents(p => ({...p, [k]: !p[k]}));
  const toggleSection = id => setExpandedId(expandedId === id ? null : id);

  const renderHeader = () => (
    <View style={[st.header, {paddingTop: insets.top}]}>
      <View style={st.topBar}>
        <TouchableOpacity style={st.backBtn} onPress={() => nav.goBack()}>
          <AppText variant="body" style={st.backText}>{'\u2039'} Profile</AppText>
        </TouchableOpacity>
        <View style={st.versionBadge}>
          <AppText variant="small" style={{color: Colors.accent, fontSize: ms(10)}}>v2.1 · Updated Mar 2026</AppText>
        </View>
      </View>
      <AppText variant="screenName" style={st.headerTitle}>Data Transparency</AppText>
      <AppText variant="caption" style={st.headerSub}>Your data. Your control. Full accountability.</AppText>
    </View>
  );

  const renderHero = () => (
    <View style={st.heroCard}>
      <AppText style={{fontSize: ms(36), textAlign: 'center', marginBottom: vs(8)}}>🛡️</AppText>
      <AppText variant="header" style={{textAlign: 'center', marginBottom: vs(4)}}>Health Continuity with Accountability</AppText>
      <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center'}}>
        Your health data is sensitive. We treat it with the highest level of care, transparency, and security.
      </AppText>
    </View>
  );

  const renderSummary = () => {
    const items = [
      {ico: '🔒', title: 'Data encrypted', sub: 'In transit & at rest'},
      {ico: '✅', title: 'Consent active', sub: '3 purposes approved'},
      {ico: '📄', title: 'Access logged', sub: '12 events, 30 days'},
      {ico: '⚖️', title: 'DPDP Act 2023', sub: 'Compliant'},
    ];
    return (
      <View style={st.summaryGrid}>
        {items.map((it, i) => (
          <View key={i} style={st.summaryCard}>
            <AppText style={{fontSize: ms(20), marginBottom: vs(4)}}>{it.ico}</AppText>
            <AppText variant="bodyBold" style={{fontSize: ms(11), textAlign: 'center'}}>{it.title}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{fontSize: ms(9), textAlign: 'center'}}>{it.sub}</AppText>
          </View>
        ))}
      </View>
    );
  };

  const Accordion = ({id, title, children}) => {
    const open = expandedId === id;
    return (
      <View style={st.accWrap}>
        <TouchableOpacity style={st.accHeader} onPress={() => toggleSection(id)} activeOpacity={0.7}>
          <View style={st.accNum}><AppText variant="small" style={{color: Colors.white, fontWeight: '700'}}>{id}</AppText></View>
          <AppText variant="bodyBold" style={{flex: 1}}>{title}</AppText>
          <AppText style={{fontSize: ms(16), color: Colors.textTertiary}}>{open ? '▲' : '▼'}</AppText>
        </TouchableOpacity>
        {open && <View style={st.accBody}>{children}</View>}
      </View>
    );
  };

  const renderSection1 = () => (
    <Accordion id={1} title="What Data We Process">
      <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(10)}}>
        We process only the data necessary to deliver personalised health insights and maintain continuity of care.
      </AppText>
      {DATA_CATS.map((c, i) => (
        <View key={i} style={st.dataCatCard}>
          <AppText style={{fontSize: ms(20)}}>{c.ico}</AppText>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="bodyBold">{c.name}</AppText>
            <AppText variant="small" color={Colors.textSecondary}>{c.desc}</AppText>
          </View>
          <View style={st.srcTag}><AppText variant="small" style={{color: Colors.accent, fontSize: ms(9)}}>{c.src}</AppText></View>
        </View>
      ))}
      <View style={st.warnBanner}>
        <AppText variant="small" style={{color: Colors.amberText}}>{'⚠️'} Derived insights are informational only and should not replace professional medical advice.</AppText>
      </View>
    </Accordion>
  );

  const renderSection2 = () => {
    const purposes = [
      'Personalised health tracking and continuity',
      'AI-powered wellness insights via Ayu',
      'Facilitating consultations with healthcare providers',
      'Medication reminders and adherence tracking',
    ];
    const bars = [
      {label: 'Health continuity', status: 'Active', pct: 100}, {label: 'Analytics', status: 'Active', pct: 100},
      {label: 'Research', status: 'Off', pct: 0}, {label: 'Third-party', status: 'Off', pct: 0},
    ];
    return (
      <Accordion id={2} title="How Your Data Is Used">
        {purposes.map((p, i) => (
          <AppText key={i} variant="small" color={Colors.textSecondary} style={{marginBottom: vs(4)}}>• {p}</AppText>
        ))}
        <View style={[st.infoBox, {backgroundColor: Colors.tealBg, marginTop: vs(10)}]}>
          <AppText variant="small" style={{color: Colors.tealText}}>{'✅'} Data is never used beyond defined purposes.</AppText>
        </View>
        <AppText variant="bodyBold" style={{marginTop: vs(12), marginBottom: vs(8)}}>Usage Breakdown</AppText>
        {bars.map((b, i) => (
          <View key={i} style={{marginBottom: vs(8)}}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(2)}}>
              <AppText variant="small">{b.label}</AppText>
              <AppText variant="small" color={b.pct ? Colors.accent : Colors.textTertiary}>{b.status} {b.pct}%</AppText>
            </View>
            <View style={st.barBg}><View style={[st.barFill, {width: `${b.pct}%`}]} /></View>
          </View>
        ))}
      </Accordion>
    );
  };

  const renderSection3 = () => {
    const rows = [
      {key: 'meera', label: 'Dr. Meera Mehta', desc: 'Access to vitals and lab results'},
      {key: 'research', label: 'Anonymised research', desc: 'Contribute to health studies'},
      {key: 'pharmacy', label: 'Pharmacy integrations', desc: 'Prescription fulfilment'},
      {key: 'insurance', label: 'Insurance', desc: 'Claims and policy verification'},
    ];
    return (
      <Accordion id={3} title="Consent-Based Sharing">
        <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(10)}}>
          Your data is shared only when: (1) you give explicit consent, (2) it is necessary for care, (3) required by law.
        </AppText>
        {rows.map(r => (
          <View key={r.key} style={st.consentRow}>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold">{r.label}</AppText>
              <AppText variant="small" color={Colors.textSecondary}>{r.desc}</AppText>
            </View>
            <Toggle on={consents[r.key]} onToggle={() => toggleConsent(r.key)} />
          </View>
        ))}
        <View style={st.infoBox}>
          <AppText variant="small" color={Colors.textSecondary}>{'ℹ️'} Revoking access takes effect immediately. Previously shared data may be retained by the recipient per their policy.</AppText>
        </View>
      </Accordion>
    );
  };

  const renderSection4 = () => (
    <Accordion id={4} title="Security Measures">
      <View style={st.secGrid}>
        {SECURITY.map((s_, i) => (
          <View key={i} style={st.secBadge}>
            <AppText style={{fontSize: ms(22), marginBottom: vs(4)}}>{s_.ico}</AppText>
            <AppText variant="bodyBold" style={{fontSize: ms(11), textAlign: 'center'}}>{s_.name}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{fontSize: ms(9), textAlign: 'center'}}>{s_.detail}</AppText>
          </View>
        ))}
      </View>
      <View style={st.warnBanner}>
        <AppText variant="small" style={{color: Colors.amberText}}>{'🔐'} No security incidents have been recorded. We conduct regular audits and penetration testing.</AppText>
      </View>
    </Accordion>
  );

  const renderSection5 = () => {
    const rights = [
      {ico: '📂', label: 'Access my data'}, {ico: '✏️', label: 'Correct inaccuracies'},
      {ico: '📥', label: 'Download records'}, {ico: '🚫', label: 'Withdraw consent'},
    ];
    return (
      <Accordion id={5} title="Your Rights">
        <View style={st.rightsGrid}>
          {rights.map((r, i) => (
            <TouchableOpacity key={i} style={st.rightBtn}>
              <AppText style={{fontSize: ms(18), marginBottom: vs(4)}}>{r.ico}</AppText>
              <AppText variant="bodyBold" style={{fontSize: ms(11), textAlign: 'center'}}>{r.label}</AppText>
            </TouchableOpacity>
          ))}
        </View>
        <TouchableOpacity style={st.dangerBtn}>
          <AppText variant="small" style={{fontSize: ms(14)}}>{'🗑️'}</AppText>
          <AppText variant="bodyBold" style={{color: Colors.white, marginLeft: s(8)}}>Request account deletion</AppText>
        </TouchableOpacity>
        <View style={st.infoBox}>
          <AppText variant="small" color={Colors.textSecondary}>{'ℹ️'} Requests are processed within 72 hours. Some data may be retained for legal compliance.</AppText>
        </View>
      </Accordion>
    );
  };

  const renderSection6 = () => (
    <Accordion id={6} title="Access Log">
      {ACCESS_EVENTS.map((e, i) => (
        <View key={i} style={st.logRow}>
          <View style={[st.logDot, {backgroundColor: e.dot}]} />
          <AppText variant="small" style={{flex: 1}}>{e.action}</AppText>
          <AppText variant="small" color={Colors.textTertiary}>{e.time}</AppText>
        </View>
      ))}
      <TouchableOpacity style={{marginTop: vs(8)}} onPress={() => nav.navigate('AccessLog')}>
        <AppText variant="bodyBold" color={Colors.accent}>View all 12 events →</AppText>
      </TouchableOpacity>
    </Accordion>
  );

  const renderSection7 = () => (
    <Accordion id={7} title="Legal Alignment">
      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(8), marginBottom: vs(10)}}>
        {LEGAL_PILLS.map((p, i) => (
          <View key={i} style={st.legalPill}><AppText variant="small" style={{color: Colors.accent}}>{p}</AppText></View>
        ))}
      </View>
      <View style={[st.warnBanner, {backgroundColor: 'rgba(239,68,68,0.08)'}]}>
        <AppText variant="small" style={{color: '#ef4444'}}>{'⚠️'} TrustLife does not provide medical diagnosis, treatment, or emergency services. Always consult a qualified healthcare professional.</AppText>
      </View>
      <TouchableOpacity style={st.linkRow} onPress={() => setActiveLayer('privacy')}>
        <AppText variant="bodyBold">Privacy Policy</AppText>
        <AppText style={{color: Colors.textTertiary}}>›</AppText>
      </TouchableOpacity>
      <TouchableOpacity style={st.linkRow} onPress={() => setActiveLayer('terms')}>
        <AppText variant="bodyBold">Terms of Use</AppText>
        <AppText style={{color: Colors.textTertiary}}>›</AppText>
      </TouchableOpacity>
    </Accordion>
  );

  const renderSection8 = () => (
    <Accordion id={8} title="Contact & Grievance">
      <View style={st.grievanceCard}>
        <AppText variant="bodyBold" style={{color: Colors.white}}>Grievance Officer</AppText>
        <AppText variant="small" style={{color: 'rgba(255,255,255,0.8)', marginTop: vs(4)}}>Rahul Sharma</AppText>
        <AppText variant="small" style={{color: 'rgba(255,255,255,0.8)'}}>TrustLife Health Technologies Pvt. Ltd.</AppText>
        <AppText variant="small" style={{color: 'rgba(255,255,255,0.8)'}}>grievance@trustlife.in</AppText>
      </View>
      <View style={{flexDirection: 'row', gap: s(10), marginTop: vs(10)}}>
        <TouchableOpacity style={[st.actionBtn, {flex: 1}]}>
          <AppText variant="bodyBold" color={Colors.primary}>File a grievance</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={[st.actionBtn, {flex: 1, backgroundColor: Colors.primary}]}>
          <AppText variant="bodyBold" color={Colors.white}>In-app support</AppText>
        </TouchableOpacity>
      </View>
    </Accordion>
  );

  const renderLayerModal = () => {
    if (!activeLayer) return null;
    const isPrivacy = activeLayer === 'privacy';
    const sections = isPrivacy ? PRIVACY_SECTIONS : TERMS_SECTIONS;
    const title = isPrivacy ? 'Privacy Policy' : 'Terms of Use';
    return (
      <Modal visible animationType="slide">
        <View style={[st.layerContainer, {paddingTop: insets.top}]}>
          <View style={st.layerHeader}>
            <TouchableOpacity onPress={() => { setActiveLayer(null); setLayerExpanded(null); }}>
              <AppText variant="body" color={Colors.accent}>{'\u2039'} Back</AppText>
            </TouchableOpacity>
            <AppText variant="bodyBold" style={{flex: 1, textAlign: 'center'}}>{title}</AppText>
            <View style={{width: s(40)}} />
          </View>
          <ScrollView style={{flex: 1}} contentContainerStyle={{padding: s(16), paddingBottom: vs(40)}} showsVerticalScrollIndicator={false}>
            <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(12)}}>
              Last updated: March 2026 · Version 2.1
            </AppText>
            {sections.map((sec, i) => {
              const open = layerExpanded === i;
              return (
                <View key={i} style={st.layerAcc}>
                  <TouchableOpacity style={st.layerAccHead} onPress={() => setLayerExpanded(open ? null : i)}>
                    <View style={st.layerNum}><AppText variant="small" style={{color: Colors.white, fontWeight: '700', fontSize: ms(10)}}>{i + 1}</AppText></View>
                    <AppText variant="bodyBold" style={{flex: 1}}>{sec.t}</AppText>
                    <AppText style={{color: Colors.textTertiary}}>{open ? '▲' : '▼'}</AppText>
                  </TouchableOpacity>
                  {open && (
                    <View style={{paddingHorizontal: s(12), paddingBottom: vs(12)}}>
                      <AppText variant="small" color={Colors.textSecondary} style={{lineHeight: ms(18)}}>{sec.b}</AppText>
                    </View>
                  )}
                </View>
              );
            })}
          </ScrollView>
        </View>
      </Modal>
    );
  };

  const renderFooter = () => (
    <View style={st.footer}>
      <AppText variant="bodyBold" color={Colors.textSecondary} style={{textAlign: 'center'}}>TrustLife Data Transparency Centre</AppText>
      <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(4)}}>Last updated: March 2026 · Version 2.1</AppText>
    </View>
  );

  return (
    <View style={st.container}>
      {renderHeader()}
      <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: vs(40)}} showsVerticalScrollIndicator={false}>
        {renderHero()}
        {renderSummary()}
        {renderSection1()}
        {renderSection2()}
        {renderSection3()}
        {renderSection4()}
        {renderSection5()}
        {renderSection6()}
        {renderSection7()}
        {renderSection8()}
        {renderFooter()}
      </ScrollView>
      {renderLayerModal()}
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingBottom: vs(16), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(12)},
  backBtn: {paddingVertical: vs(4), paddingRight: s(12)},
  backText: {color: Colors.white, fontSize: ms(15)},
  versionBadge: {backgroundColor: Colors.tealBg, paddingHorizontal: s(10), paddingVertical: vs(3), borderRadius: ms(12)},
  headerTitle: {color: Colors.white, fontSize: ms(24), fontWeight: '700', marginBottom: vs(4)},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  heroCard: {backgroundColor: Colors.tealBg, borderRadius: ms(14), marginHorizontal: s(16), marginTop: vs(16), padding: s(20), alignItems: 'center'},
  summaryGrid: {flexDirection: 'row', flexWrap: 'wrap', marginHorizontal: s(16), marginTop: vs(14), gap: s(8)},
  summaryCard: {width: '47%', backgroundColor: Colors.white, borderRadius: ms(14), padding: s(12), alignItems: 'center'},
  accWrap: {backgroundColor: Colors.white, borderRadius: ms(14), marginHorizontal: s(16), marginTop: vs(10), overflow: 'hidden'},
  accHeader: {flexDirection: 'row', alignItems: 'center', padding: s(14), gap: s(10)},
  accNum: {width: s(26), height: s(26), borderRadius: s(13), backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center'},
  accBody: {paddingHorizontal: s(14), paddingBottom: vs(14)},
  dataCatCard: {flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.background, borderRadius: ms(10), padding: s(10), marginBottom: vs(6)},
  srcTag: {backgroundColor: Colors.tealBg, paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(6)},
  warnBanner: {backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: s(10), marginTop: vs(8)},
  infoBox: {backgroundColor: Colors.background, borderRadius: ms(10), padding: s(10), marginTop: vs(10)},
  barBg: {height: vs(6), backgroundColor: Colors.borderLight, borderRadius: ms(3), overflow: 'hidden'},
  barFill: {height: '100%', backgroundColor: Colors.accent, borderRadius: ms(3)},
  consentRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderColor: Colors.borderLight},
  toggle: {width: s(44), height: s(24), borderRadius: s(12), backgroundColor: Colors.borderLight, justifyContent: 'center', paddingHorizontal: s(2)},
  toggleOn: {backgroundColor: Colors.accent},
  thumb: {width: s(20), height: s(20), borderRadius: s(10), backgroundColor: Colors.white},
  thumbOn: {alignSelf: 'flex-end'},
  secGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8)},
  secBadge: {width: '47%', backgroundColor: Colors.background, borderRadius: ms(10), padding: s(10), alignItems: 'center'},
  rightsGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8)},
  rightBtn: {width: '47%', backgroundColor: Colors.background, borderRadius: ms(10), padding: s(12), alignItems: 'center'},
  dangerBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', backgroundColor: '#ef4444', borderRadius: ms(14), paddingVertical: vs(12), marginTop: vs(8)},
  logRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8), gap: s(8), borderBottomWidth: 1, borderColor: Colors.borderLight},
  logDot: {width: s(8), height: s(8), borderRadius: s(4)},
  legalPill: {backgroundColor: Colors.tealBg, paddingHorizontal: s(12), paddingVertical: vs(4), borderRadius: ms(12)},
  linkRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: vs(12), borderBottomWidth: 1, borderColor: Colors.borderLight},
  grievanceCard: {backgroundColor: Colors.primary, borderRadius: ms(14), padding: s(14)},
  actionBtn: {alignItems: 'center', paddingVertical: vs(12), borderRadius: ms(14), borderWidth: 1, borderColor: Colors.primary},
  footer: {marginTop: vs(24), paddingHorizontal: s(16)},
  layerContainer: {flex: 1, backgroundColor: Colors.white},
  layerHeader: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(16), paddingVertical: vs(12), borderBottomWidth: 1, borderColor: Colors.borderLight},
  layerAcc: {backgroundColor: Colors.background, borderRadius: ms(10), marginBottom: vs(8), overflow: 'hidden'},
  layerAccHead: {flexDirection: 'row', alignItems: 'center', padding: s(12), gap: s(8)},
  layerNum: {width: s(22), height: s(22), borderRadius: s(11), backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center'},
});

export default DataTransparencyScreen;
