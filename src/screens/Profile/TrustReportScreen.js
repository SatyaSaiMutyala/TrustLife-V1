import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, Modal} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../components/shared/AppText';
import Colors from '../../constants/colors';

const GOLD = '#d4a843';

const METRICS = [
  {value: '18,247', label: 'USERS', trend: '+312% YoY'},
  {value: '2.4M', label: 'RECORDS', trend: '8x growth'},
  {value: '0', label: 'BREACHES', trend: 'Zero'},
  {value: '99.98%', label: 'UPTIME', trend: 'SLA exceeded'},
];
const METRICS2 = [
  {value: '100%', label: 'CONSENTED ACCESS', trend: 'Every share approved'},
  {value: '47ms', label: 'ENCRYPTION', trend: 'Avg encrypt time'},
];
const METRIC_BARS = [
  {label: 'Unconsented data shares', value: '0 / 18,247', pct: 0},
  {label: 'Compliance frameworks', value: '3', pct: 100},
  {label: 'Incident containment', value: '11 min avg', pct: 85},
];
const INFRA = [
  {ico: '🏗️', name: 'Data Infrastructure', desc: 'AWS Mumbai region, India-only data residency', status: 'Active'},
  {ico: '🔒', name: 'Encryption', desc: 'AES-256 at rest, TLS 1.3 in transit, AWS KMS', status: 'Active'},
  {ico: '🛡️', name: 'Access Architecture', desc: 'Zero-trust model, dual approval for all access', status: 'Enforced'},
  {ico: '📡', name: 'Monitoring', desc: '24/7 real-time monitoring, sub-second anomaly detection', status: 'Online'},
  {ico: '💾', name: 'Backups', desc: 'RPO 5 minutes, RTO 30 minutes, geo-redundant', status: 'Verified'},
];
const INCIDENTS = [
  {
    id: 'aug', month: 'August 2025', title: 'DDoS Attack Mitigated', severity: 'Medium', color: Colors.amber,
    containment: '8 min', impact: 'No data exposure. Brief latency spike for ~2 min.',
    timeline: [
      {time: '14:32 IST', text: 'Anomalous traffic spike detected', color: Colors.red},
      {time: '14:34 IST', text: 'Auto-scaling and WAF rules activated', color: Colors.amber},
      {time: '14:38 IST', text: 'Traffic normalized, attack mitigated', color: Colors.accent},
      {time: '14:40 IST', text: 'All-clear confirmed, post-mortem initiated', color: Colors.accent},
    ],
  },
  {
    id: 'oct', month: 'October 2025', title: 'API Vulnerability Patched', severity: 'Low', color: Colors.blue,
    containment: '14 min', impact: 'No exploitation detected. Patch deployed proactively.',
    timeline: [
      {time: '09:15 IST', text: 'Vulnerability identified in dependency scan', color: Colors.amber},
      {time: '09:18 IST', text: 'Security team notified, assessment begun', color: Colors.amber},
      {time: '09:25 IST', text: 'Patch developed and tested', color: Colors.blue},
      {time: '09:29 IST', text: 'Patch deployed to production, verified', color: Colors.accent},
    ],
  },
];
const AUDIT_ROWS = [
  {dot: Colors.accent, label: 'Data sold to third parties', value: 'Never'},
  {dot: Colors.accent, label: 'Used for advertising', value: 'Never'},
  {dot: Colors.accent, label: 'Unconsented data sharing', value: '0'},
  {dot: Colors.blue, label: 'Consent requests processed', value: '84,210'},
  {dot: Colors.accent, label: 'Revocations honoured', value: '100%'},
  {dot: Colors.blue, label: 'Deletion requests fulfilled', value: '247'},
  {dot: Colors.amber, label: 'Avg deletion turnaround', value: '6.2 days'},
  {dot: Colors.accent, label: 'Employee access without approval', value: '0'},
];
const COMPLIANCE = [
  {ico: '🇮🇳', name: 'DPDP Act', status: 'Compliant', desc: 'Digital Personal Data Protection Act 2023'},
  {ico: '🏅', name: 'ISO 27001', status: 'Certified', desc: 'Information security management'},
  {ico: '🏥', name: 'HIPAA', status: 'Compliant', desc: 'Health data privacy & security'},
  {ico: '📋', name: 'SOC 2 Type II', status: 'Audited', desc: 'Trust services criteria audit'},
  {ico: '🔗', name: 'ABDM', status: 'Aligned', desc: 'Ayushman Bharat Digital Mission'},
  {ico: '⚖️', name: 'IT Act 2000', status: 'Compliant', desc: 'Information Technology Act'},
  {ico: '🔍', name: 'Pen Testing', status: 'Passed', desc: 'Annual penetration testing'},
];
const PLEDGES = [
  {bold: 'Never sell your data.', desc: 'Your health data will never be sold to advertisers, data brokers, or any third party.'},
  {bold: 'Never share without consent.', desc: 'Every data share requires your explicit, informed approval.'},
  {bold: 'Disclose every incident.', desc: 'We will publicly and promptly disclose every security incident, no matter how small.'},
  {bold: 'Keep publishing this report.', desc: 'This annual trust report will be published every year for full accountability.'},
  {bold: 'Data portable & deletable.', desc: 'You can export or permanently delete all your data at any time.'},
];
const DOWNLOADS = [
  {id: 'trust', ico: '📄', title: 'Trust Report 2025 PDF', desc: 'Full annual transparency report'},
  {id: 'soc2', ico: '🛡️', title: 'SOC 2 Type II Report', desc: 'Independent auditor assessment'},
  {id: 'iso', ico: '🏅', title: 'ISO 27001 Certificate', desc: 'Information security certification'},
  {id: 'hipaa', ico: '🏥', title: 'HIPAA Compliance Report', desc: 'Health data privacy compliance'},
  {id: 'pentest', ico: '🔍', title: 'Pen Test Results 2025', desc: 'Penetration testing summary'},
];

const SectionHeader = ({num, title, bg}) => (
  <View style={st.sectionHeader}>
    <View style={[st.sectionNum, {backgroundColor: bg || Colors.primary}]}>
      <AppText variant="small" style={{color: Colors.white, fontWeight: '700'}}>{num}</AppText>
    </View>
    <AppText variant="bodyBold" style={{flex: 1}}>{title}</AppText>
    <View style={st.sectionLine} />
  </View>
);

const DocTable = ({headers, rows}) => (
  <View style={st.docTable}>
    <View style={st.docTableHeaderRow}>
      {headers.map((h, i) => (
        <View key={i} style={[st.docTableCell, {flex: i === 0 ? 2 : 1}]}>
          <AppText variant="small" style={{color: Colors.white, fontWeight: '700', fontSize: ms(9)}}>{h}</AppText>
        </View>
      ))}
    </View>
    {rows.map((row, ri) => (
      <View key={ri} style={[st.docTableRow, ri % 2 === 1 && {backgroundColor: Colors.background}]}>
        {row.map((cell, ci) => (
          <View key={ci} style={[st.docTableCell, {flex: ci === 0 ? 2 : 1}]}>
            {typeof cell === 'object' ? (
              <View style={[st.statusPill, {backgroundColor: cell.bg}]}>
                <AppText variant="small" style={{color: cell.color, fontSize: ms(8), fontWeight: '600'}}>{cell.text}</AppText>
              </View>
            ) : (
              <AppText variant="small" style={{fontSize: ms(9)}}>{cell}</AppText>
            )}
          </View>
        ))}
      </View>
    ))}
  </View>
);

const PASS = {text: 'PASS', bg: Colors.tealBg, color: Colors.accent};
const COMPLIANT = {text: 'Compliant', bg: Colors.tealBg, color: Colors.accent};
const REMEDIATED = {text: 'Remediated', bg: Colors.amberBg, color: Colors.amber};

const TrustReportScreen = () => {
  const insets = useSafeAreaInsets();
  const nav = useNavigation();
  const [expandedIncident, setExpandedIncident] = useState(null);
  const [activeDoc, setActiveDoc] = useState(null);

  const renderCover = () => (
    <View style={st.cover}>
      <View style={[st.topBar, {paddingTop: insets.top}]}>
        <TouchableOpacity style={st.backBtn} onPress={() => nav.goBack()}>
          <AppText variant="body" style={st.backText}>{'\u2039'} Transparency</AppText>
        </TouchableOpacity>
        <View style={st.yearBadge}>
          <AppText variant="small" style={{color: GOLD, fontSize: ms(10), fontWeight: '700'}}>ANNUAL REPORT 2025</AppText>
        </View>
      </View>
      <View style={st.shieldWrap}>
        <AppText style={{fontSize: ms(64)}}>🛡️</AppText>
      </View>
      <AppText variant="small" style={st.coverTag}>TRUSTLIFE TRUST REPORT</AppText>
      <AppText variant="header" style={st.coverTitle}>Your data. Protected.{'\n'}Verifiable. Always yours.</AppText>
      <AppText variant="small" style={st.coverSub}>
        Our annual commitment to transparency, accountability, and the highest standards of data protection.
      </AppText>
      <View style={st.founderChip}>
        <View style={st.founderAvatar}>
          <AppText style={{fontSize: ms(14)}}>👤</AppText>
        </View>
        <View>
          <AppText variant="bodyBold" style={{color: Colors.white, fontSize: ms(12)}}>Venkata Cherukuri</AppText>
          <AppText variant="small" style={{color: 'rgba(255,255,255,0.6)', fontSize: ms(10)}}>Founder & CEO</AppText>
        </View>
      </View>
    </View>
  );

  const renderFounderLetter = () => (
    <View style={st.section}>
      <SectionHeader num={1} title="Founder's Letter" />
      <View style={st.card}>
        <AppText variant="small" color={Colors.textSecondary} style={st.letterP}>
          Dear TrustLife community,
        </AppText>
        <AppText variant="small" color={Colors.textSecondary} style={st.letterP}>
          When we started TrustLife, we made a promise: your health data would always be yours. Not ours to monetise. Not ours to share without your knowledge. Not ours to lock away.
        </AppText>
        <AppText variant="small" color={Colors.textSecondary} style={st.letterP}>
          2025 was a transformative year. We grew from a small pilot to serving over 18,000 users who trusted us with their most sensitive information. That trust is not something we take lightly.
        </AppText>
        <AppText variant="small" color={Colors.textSecondary} style={st.letterP}>
          This report is our way of proving that trust is earned, not assumed. Every metric, every incident, every practice is disclosed here for your review.
        </AppText>
        <AppText variant="small" color={Colors.textSecondary} style={st.letterP}>
          We maintained zero data breaches, achieved 99.98% uptime, and ensured that every single data share was consented. But numbers alone are not enough. We are publishing this report so you can verify our commitments yourself.
        </AppText>
        <View style={st.sigBlock}>
          <View style={st.sigAvatar}>
            <AppText style={{fontSize: ms(16)}}>👤</AppText>
          </View>
          <View>
            <AppText variant="bodyBold">Venkata Cherukuri</AppText>
            <AppText variant="small" color={Colors.textSecondary}>Founder & CEO, TrustLife</AppText>
            <AppText variant="small" color={Colors.textTertiary}>January 2026</AppText>
          </View>
        </View>
      </View>
    </View>
  );

  const renderNumbers = () => (
    <View style={st.section}>
      <SectionHeader num={2} title="2025 in Numbers" bg={Colors.accent} />
      <View style={st.metricGrid}>
        {METRICS.map((m, i) => (
          <View key={i} style={st.metricCard}>
            <AppText style={st.metricValue}>{m.value}</AppText>
            <AppText variant="small" style={st.metricLabel}>{m.label}</AppText>
            <AppText variant="small" color={Colors.accent} style={{fontSize: ms(10)}}>{m.trend}</AppText>
          </View>
        ))}
      </View>
      <View style={[st.metricGrid, {marginTop: vs(8)}]}>
        {METRICS2.map((m, i) => (
          <View key={i} style={st.metricCard}>
            <AppText style={st.metricValue}>{m.value}</AppText>
            <AppText variant="small" style={st.metricLabel}>{m.label}</AppText>
            <AppText variant="small" color={Colors.accent} style={{fontSize: ms(10)}}>{m.trend}</AppText>
          </View>
        ))}
      </View>
      {METRIC_BARS.map((b, i) => (
        <View key={i} style={st.metricBarWrap}>
          <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
            <AppText variant="small" color={Colors.textSecondary}>{b.label}</AppText>
            <AppText variant="bodyBold" style={{fontSize: ms(14)}}>{b.value}</AppText>
          </View>
          <View style={st.barBg}>
            <View style={[st.barFill, {width: b.pct === 0 ? '100%' : `${b.pct}%`, backgroundColor: b.pct === 0 ? Colors.accent : Colors.accent}]} />
          </View>
        </View>
      ))}
    </View>
  );

  const renderInfra = () => (
    <View style={st.section}>
      <SectionHeader num={3} title="Infrastructure & Security" bg={GOLD} />
      {INFRA.map((item, i) => (
        <View key={i} style={st.infraCard}>
          <View style={st.infraIcon}>
            <AppText style={{fontSize: ms(20)}}>{item.ico}</AppText>
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold">{item.name}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{item.desc}</AppText>
          </View>
          <View style={st.statusBadge}>
            <AppText variant="small" style={{color: Colors.accent, fontSize: ms(9), fontWeight: '600'}}>{item.status}</AppText>
          </View>
        </View>
      ))}
    </View>
  );

  const renderIncidents = () => (
    <View style={st.section}>
      <SectionHeader num={4} title="Incident Disclosure" bg={Colors.accent} />
      <View style={st.successBanner}>
        <AppText variant="small" style={{color: Colors.tealText}}>{'✅'} Zero data breaches in 2025</AppText>
      </View>
      {INCIDENTS.map(inc => {
        const open = expandedIncident === inc.id;
        return (
          <TouchableOpacity key={inc.id} style={st.incidentCard} onPress={() => setExpandedIncident(open ? null : inc.id)} activeOpacity={0.7}>
            <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between'}}>
              <View style={{flex: 1}}>
                <AppText variant="small" color={Colors.textTertiary}>{inc.month}</AppText>
                <AppText variant="bodyBold" style={{marginTop: vs(2)}}>{inc.title}</AppText>
              </View>
              <View style={[st.sevBadge, {backgroundColor: inc.color + '20'}]}>
                <AppText variant="small" style={{color: inc.color, fontSize: ms(9), fontWeight: '600'}}>{inc.severity}</AppText>
              </View>
            </View>
            <View style={{flexDirection: 'row', marginTop: vs(6), gap: s(12)}}>
              <AppText variant="small" color={Colors.textSecondary}>Containment: <AppText variant="small" style={{fontWeight: '600'}}>{inc.containment}</AppText></AppText>
            </View>
            {open && (
              <View style={{marginTop: vs(10)}}>
                <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(8)}}>{inc.impact}</AppText>
                <View style={{paddingLeft: s(4)}}>
                  {inc.timeline.map((step, si) => (
                    <View key={si} style={{flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(10)}}>
                      <View style={{alignItems: 'center', marginRight: s(10)}}>
                        <View style={[st.timelineDot, {backgroundColor: step.color}]} />
                        {si < inc.timeline.length - 1 && <View style={st.timelineLine} />}
                      </View>
                      <View style={{flex: 1}}>
                        <AppText variant="small" style={{fontWeight: '600', fontSize: ms(10)}}>{step.time}</AppText>
                        <AppText variant="small" color={Colors.textSecondary}>{step.text}</AppText>
                      </View>
                    </View>
                  ))}
                </View>
              </View>
            )}
            <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'right', marginTop: vs(4)}}>{open ? '▲' : '▼'}</AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  const renderPractices = () => (
    <View style={st.section}>
      <SectionHeader num={5} title="Data Practices" bg={Colors.primary} />
      <View style={st.card}>
        {AUDIT_ROWS.map((row, i) => (
          <View key={i} style={[st.auditRow, i === AUDIT_ROWS.length - 1 && {borderBottomWidth: 0}]}>
            <View style={[st.auditDot, {backgroundColor: row.dot}]} />
            <AppText variant="small" style={{flex: 1}}>{row.label}</AppText>
            <AppText variant="bodyBold" style={{fontSize: ms(12)}}>{row.value}</AppText>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCompliance = () => (
    <View style={st.section}>
      <SectionHeader num={6} title="Compliance & Certifications" bg={Colors.blue} />
      <View style={st.complianceGrid}>
        {COMPLIANCE.map((c, i) => (
          <View key={i} style={st.complianceCard}>
            <AppText style={{fontSize: ms(22), marginBottom: vs(4)}}>{c.ico}</AppText>
            <AppText variant="bodyBold" style={{fontSize: ms(11), textAlign: 'center'}}>{c.name}</AppText>
            <View style={[st.compBadge, {backgroundColor: Colors.tealBg}]}>
              <AppText variant="small" style={{color: Colors.accent, fontSize: ms(8), fontWeight: '600'}}>{c.status}</AppText>
            </View>
            <AppText variant="small" color={Colors.textSecondary} style={{fontSize: ms(9), textAlign: 'center', marginTop: vs(2)}}>{c.desc}</AppText>
          </View>
        ))}
      </View>
    </View>
  );

  const renderCommitments = () => (
    <View style={st.section}>
      <SectionHeader num={7} title="Our Commitments" bg={Colors.accent} />
      <View style={st.pledgeCard}>
        {PLEDGES.map((p, i) => (
          <View key={i} style={st.pledgeItem}>
            <View style={st.pledgeCheck}>
              <AppText style={{fontSize: ms(10), color: Colors.accent}}>{'✓'}</AppText>
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" style={{color: Colors.primary}}>{p.bold}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{p.desc}</AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  const renderDownloads = () => (
    <View style={st.section}>
      <SectionHeader num={8} title="Download & Verify" bg={Colors.primary} />
      {DOWNLOADS.map(d => (
        <TouchableOpacity key={d.id} style={st.downloadCard} onPress={() => setActiveDoc(d.id)} activeOpacity={0.7}>
          <View style={st.downloadIcon}>
            <AppText style={{fontSize: ms(18)}}>{d.ico}</AppText>
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold">{d.title}</AppText>
            <AppText variant="small" color={Colors.textSecondary}>{d.desc}</AppText>
          </View>
          <AppText style={{fontSize: ms(16), color: Colors.textTertiary}}>{'↓'}</AppText>
        </TouchableOpacity>
      ))}
      <View style={st.hashCard}>
        <AppText variant="small" style={{fontWeight: '600', marginBottom: vs(4)}}>Verify Authenticity</AppText>
        <AppText variant="small" color={Colors.textSecondary} style={{fontSize: ms(9), fontFamily: 'monospace'}}>
          SHA-256: a4f8e2c1d9b3f7e6a0c5d8b2e4f1a3c7d9e6b8f0a2c4d6e8f0b1d3e5a7c9f1
        </AppText>
      </View>
    </View>
  );

  const renderCTA = () => (
    <View style={[st.card, {marginHorizontal: s(16), marginTop: vs(10)}]}>
      <AppText variant="bodyBold" style={{textAlign: 'center', marginBottom: vs(4)}}>Questions or concerns?</AppText>
      <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'center', marginBottom: vs(12)}}>
        Reach out to our Grievance Officer or use in-app support.
      </AppText>
      <View style={{flexDirection: 'row', gap: s(10)}}>
        <TouchableOpacity style={[st.ctaBtn, {backgroundColor: Colors.primary, flex: 1}]}>
          <AppText variant="bodyBold" style={{color: Colors.white, fontSize: ms(11)}}>Contact Grievance Officer</AppText>
        </TouchableOpacity>
        <TouchableOpacity style={[st.ctaBtn, {borderWidth: 1, borderColor: Colors.primary, flex: 1}]}>
          <AppText variant="bodyBold" style={{color: Colors.primary, fontSize: ms(11)}}>In-app Support</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderFooter = () => (
    <View style={st.footer}>
      <AppText variant="bodyBold" color={Colors.textSecondary} style={{textAlign: 'center'}}>TrustLife Health Technologies Pvt. Ltd.</AppText>
      <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(4)}}>Report published: January 2026</AppText>
      <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(2)}}>CIN: U74999KA2024PTC184521</AppText>
      <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(2), fontSize: ms(8), fontFamily: 'monospace'}}>
        Hash: a4f8e2c1d9b3...c9f1
      </AppText>
    </View>
  );

  const renderDocTrust = () => (
    <ScrollView contentContainerStyle={st.docContent} showsVerticalScrollIndicator={false}>
      <AppText style={{fontSize: ms(28), textAlign: 'center'}}>🛡️</AppText>
      <AppText variant="header" style={st.docTitle}>TrustLife Annual Trust Report 2025</AppText>
      <View style={st.docInfo}>
        <AppText variant="small" color={Colors.textSecondary}>Executive Summary: This report provides a comprehensive overview of TrustLife's data protection practices, security posture, and transparency commitments for the year 2025.</AppText>
      </View>
      <AppText variant="bodyBold" style={{marginTop: vs(14), marginBottom: vs(8)}}>Key Metrics</AppText>
      <DocTable
        headers={['Metric', 'Value', 'Status']}
        rows={[
          ['Total Users', '18,247', PASS],
          ['Records Protected', '2.4 Million', PASS],
          ['Data Breaches', '0', PASS],
          ['Platform Uptime', '99.98%', PASS],
          ['Consented Access Rate', '100%', PASS],
          ['Avg Encryption Time', '47ms', PASS],
          ['Deletion Requests', '247 fulfilled', PASS],
          ['Compliance Frameworks', '3 active', PASS],
        ]}
      />
      <View style={st.docSig}>
        <AppText variant="small" style={{fontWeight: '600'}}>Venkata Cherukuri</AppText>
        <AppText variant="small" color={Colors.textSecondary}>Founder & CEO</AppText>
      </View>
      <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(12)}}>Page 1 of 1</AppText>
    </ScrollView>
  );

  const renderDocSOC2 = () => (
    <ScrollView contentContainerStyle={st.docContent} showsVerticalScrollIndicator={false}>
      <AppText style={{fontSize: ms(28), textAlign: 'center'}}>🛡️</AppText>
      <AppText variant="header" style={st.docTitle}>SOC 2 Type II Report</AppText>
      <View style={st.docInfo}>
        <AppText variant="small" color={Colors.textSecondary}>Independent Auditor's Opinion: In our opinion, TrustLife Health Technologies maintained effective controls over its systems relevant to security, availability, and confidentiality throughout the period January 1 to December 31, 2025.</AppText>
      </View>
      <AppText variant="bodyBold" style={{marginTop: vs(14), marginBottom: vs(8)}}>Trust Services Criteria Results</AppText>
      <DocTable
        headers={['Criteria', 'Description', 'Result']}
        rows={[
          ['CC1.1', 'Control environment integrity', PASS],
          ['CC2.1', 'Information & communication', PASS],
          ['CC3.1', 'Risk assessment process', PASS],
          ['CC4.1', 'Monitoring activities', PASS],
          ['CC5.1', 'Control activities', PASS],
          ['CC6.1', 'Logical & physical access', PASS],
          ['CC7.1', 'System operations', PASS],
          ['CC8.1', 'Change management', PASS],
          ['CC9.1', 'Risk mitigation', PASS],
          ['A1.1', 'Availability commitments', PASS],
          ['C1.1', 'Confidentiality commitments', PASS],
        ]}
      />
      <View style={st.docSig}>
        <AppText variant="small" style={{fontWeight: '600'}}>Deloitte India LLP</AppText>
        <AppText variant="small" color={Colors.textSecondary}>Independent Auditor</AppText>
      </View>
      <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(12)}}>Page 1 of 1</AppText>
    </ScrollView>
  );

  const renderDocISO = () => (
    <ScrollView contentContainerStyle={st.docContent} showsVerticalScrollIndicator={false}>
      <AppText style={{fontSize: ms(28), textAlign: 'center'}}>🏅</AppText>
      <AppText variant="header" style={st.docTitle}>ISO 27001 Certificate</AppText>
      <View style={st.docInfo}>
        <AppText variant="small" color={Colors.textSecondary}>This is to certify that the Information Security Management System of TrustLife Health Technologies Pvt. Ltd. has been assessed and found to conform to the requirements of ISO/IEC 27001:2022.</AppText>
      </View>
      <AppText variant="bodyBold" style={{marginTop: vs(14), marginBottom: vs(8)}}>Certificate Details</AppText>
      <View style={st.detailsGrid}>
        {[
          ['Certificate No.', 'IS 789456'],
          ['Initial Certification', '15 March 2025'],
          ['Valid Until', '14 March 2028'],
          ['Scope', 'Health data management platform'],
          ['Standard', 'ISO/IEC 27001:2022'],
          ['Certifying Body', 'BSI Group India'],
        ].map((row, i) => (
          <View key={i} style={st.detailRow}>
            <AppText variant="small" color={Colors.textSecondary} style={{width: s(120)}}>{row[0]}</AppText>
            <AppText variant="small" style={{flex: 1, fontWeight: '600'}}>{row[1]}</AppText>
          </View>
        ))}
      </View>
      <View style={st.docSig}>
        <AppText variant="small" style={{fontWeight: '600'}}>BSI Group India Pvt. Ltd.</AppText>
        <AppText variant="small" color={Colors.textSecondary}>Certification Body</AppText>
      </View>
      <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(12)}}>Page 1 of 1</AppText>
    </ScrollView>
  );

  const renderDocHIPAA = () => (
    <ScrollView contentContainerStyle={st.docContent} showsVerticalScrollIndicator={false}>
      <AppText style={{fontSize: ms(28), textAlign: 'center'}}>🏥</AppText>
      <AppText variant="header" style={st.docTitle}>HIPAA Compliance Report</AppText>
      <View style={st.docInfo}>
        <AppText variant="small" color={Colors.textSecondary}>Assessment of TrustLife Health Technologies' compliance with the Health Insurance Portability and Accountability Act (HIPAA) Privacy Rule and Security Rule.</AppText>
      </View>
      <AppText variant="bodyBold" style={{marginTop: vs(14), marginBottom: vs(8)}}>Privacy Rule Compliance</AppText>
      <DocTable
        headers={['Requirement', 'Status']}
        rows={[
          ['Notice of Privacy Practices', COMPLIANT],
          ['Minimum Necessary Standard', COMPLIANT],
          ['Patient Rights (Access/Amend)', COMPLIANT],
          ['Business Associate Agreements', COMPLIANT],
          ['Breach Notification Procedures', COMPLIANT],
        ]}
      />
      <AppText variant="bodyBold" style={{marginTop: vs(14), marginBottom: vs(8)}}>Security Rule Compliance</AppText>
      <DocTable
        headers={['Safeguard', 'Status']}
        rows={[
          ['Administrative Safeguards', COMPLIANT],
          ['Physical Safeguards', COMPLIANT],
          ['Technical Safeguards', COMPLIANT],
          ['Encryption (AES-256)', COMPLIANT],
          ['Access Controls (RBAC)', COMPLIANT],
        ]}
      />
      <View style={st.docSig}>
        <AppText variant="small" style={{fontWeight: '600'}}>Coalfire Systems Inc.</AppText>
        <AppText variant="small" color={Colors.textSecondary}>HIPAA Assessor</AppText>
      </View>
      <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(12)}}>Page 1 of 1</AppText>
    </ScrollView>
  );

  const renderDocPenTest = () => (
    <ScrollView contentContainerStyle={st.docContent} showsVerticalScrollIndicator={false}>
      <AppText style={{fontSize: ms(28), textAlign: 'center'}}>🔍</AppText>
      <AppText variant="header" style={st.docTitle}>Penetration Test Results 2025</AppText>
      <View style={st.docInfo}>
        <AppText variant="small" color={Colors.textSecondary}>Annual penetration testing conducted by CyberArk India. Testing period: November 1-15, 2025. Scope: Web application, mobile APIs, and cloud infrastructure.</AppText>
      </View>
      <AppText variant="bodyBold" style={{marginTop: vs(14), marginBottom: vs(8)}}>Risk Summary</AppText>
      <DocTable
        headers={['Severity', 'Found', 'Remediated', 'Status']}
        rows={[
          ['Critical', '0', '0', PASS],
          ['High', '0', '0', PASS],
          ['Medium', '3', '3', REMEDIATED],
          ['Low', '5', '5', REMEDIATED],
          ['Informational', '8', 'N/A', PASS],
        ]}
      />
      <AppText variant="bodyBold" style={{marginTop: vs(14), marginBottom: vs(8)}}>Medium Findings (All Remediated)</AppText>
      {[
        {id: 'PT-2025-001', title: 'Session token rotation interval', fix: 'Reduced to 15 min'},
        {id: 'PT-2025-002', title: 'API rate limiting on auth endpoint', fix: 'Added 10 req/min limit'},
        {id: 'PT-2025-003', title: 'CORS header misconfiguration', fix: 'Restricted to trusted origins'},
      ].map((f, i) => (
        <View key={i} style={[st.card, {marginBottom: vs(6), marginHorizontal: 0}]}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between'}}>
            <AppText variant="small" style={{fontWeight: '600'}}>{f.id}</AppText>
            <View style={[st.statusPill, {backgroundColor: Colors.amberBg}]}>
              <AppText variant="small" style={{color: Colors.amber, fontSize: ms(8), fontWeight: '600'}}>Remediated</AppText>
            </View>
          </View>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{f.title}</AppText>
          <AppText variant="small" color={Colors.accent} style={{marginTop: vs(2)}}>Fix: {f.fix}</AppText>
        </View>
      ))}
      <View style={st.docSig}>
        <AppText variant="small" style={{fontWeight: '600'}}>CyberArk India</AppText>
        <AppText variant="small" color={Colors.textSecondary}>Penetration Testing Team</AppText>
      </View>
      <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(12)}}>Page 1 of 1</AppText>
    </ScrollView>
  );

  const docRenderers = {trust: renderDocTrust, soc2: renderDocSOC2, iso: renderDocISO, hipaa: renderDocHIPAA, pentest: renderDocPenTest};
  const docTitles = {trust: 'Trust Report 2025', soc2: 'SOC 2 Type II', iso: 'ISO 27001', hipaa: 'HIPAA Compliance', pentest: 'Pen Test Results'};

  const renderDocModal = () => {
    if (!activeDoc) return null;
    return (
      <Modal visible animationType="slide">
        <View style={[st.modalContainer, {paddingTop: insets.top}]}>
          <View style={st.modalHeader}>
            <TouchableOpacity onPress={() => setActiveDoc(null)}>
              <AppText variant="body" color={Colors.accent}>{'\u2039'} Close</AppText>
            </TouchableOpacity>
            <AppText variant="bodyBold" style={{flex: 1, textAlign: 'center'}}>{docTitles[activeDoc]}</AppText>
            <TouchableOpacity>
              <AppText variant="small" style={{color: Colors.accent, fontWeight: '600'}}>PDF</AppText>
            </TouchableOpacity>
          </View>
          {docRenderers[activeDoc]?.()}
        </View>
      </Modal>
    );
  };

  return (
    <View style={st.container}>
      <ScrollView style={{flex: 1}} contentContainerStyle={{paddingBottom: vs(40)}} showsVerticalScrollIndicator={false}>
        {renderCover()}
        {renderFounderLetter()}
        {renderNumbers()}
        {renderInfra()}
        {renderIncidents()}
        {renderPractices()}
        {renderCompliance()}
        {renderCommitments()}
        {renderDownloads()}
        {renderCTA()}
        {renderFooter()}
      </ScrollView>
      {renderDocModal()}
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  cover: {backgroundColor: Colors.primary, paddingBottom: vs(24), paddingHorizontal: s(16), alignItems: 'center'},
  topBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', width: '100%', marginBottom: vs(20)},
  backBtn: {paddingVertical: vs(4), paddingRight: s(12)},
  backText: {color: Colors.white, fontSize: ms(15)},
  yearBadge: {backgroundColor: 'rgba(212,168,67,0.15)', paddingHorizontal: s(10), paddingVertical: vs(3), borderRadius: ms(12)},
  shieldWrap: {width: ms(100), height: ms(100), borderRadius: ms(50), backgroundColor: 'rgba(29,158,117,0.2)', alignItems: 'center', justifyContent: 'center', marginBottom: vs(12)},
  coverTag: {color: Colors.accent, fontSize: ms(10), letterSpacing: 2, textTransform: 'uppercase', marginBottom: vs(8)},
  coverTitle: {color: Colors.white, fontSize: ms(22), fontWeight: '700', textAlign: 'center', marginBottom: vs(8)},
  coverSub: {color: 'rgba(255,255,255,0.6)', fontSize: ms(12), textAlign: 'center', marginBottom: vs(16), paddingHorizontal: s(10)},
  founderChip: {flexDirection: 'row', alignItems: 'center', backgroundColor: 'rgba(255,255,255,0.1)', paddingHorizontal: s(12), paddingVertical: vs(8), borderRadius: ms(20), gap: s(8)},
  founderAvatar: {width: ms(32), height: ms(32), borderRadius: ms(16), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  section: {marginTop: vs(16), paddingHorizontal: s(16)},
  sectionHeader: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(10), gap: s(10)},
  sectionNum: {width: ms(26), height: ms(26), borderRadius: ms(13), alignItems: 'center', justifyContent: 'center'},
  sectionLine: {flex: 0.3, height: 1, backgroundColor: Colors.borderLight},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14)},
  letterP: {lineHeight: ms(20), marginBottom: vs(10)},
  sigBlock: {flexDirection: 'row', alignItems: 'center', marginTop: vs(10), paddingTop: vs(10), borderTopWidth: 1, borderColor: Colors.borderLight, gap: s(10)},
  sigAvatar: {width: ms(36), height: ms(36), borderRadius: ms(18), backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center'},
  metricGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8)},
  metricCard: {width: '47%', backgroundColor: Colors.white, borderRadius: ms(14), padding: s(12), alignItems: 'center'},
  metricValue: {fontSize: ms(24), fontWeight: '700', color: Colors.textPrimary},
  metricLabel: {fontSize: ms(9), letterSpacing: 1, textTransform: 'uppercase', color: Colors.textTertiary, marginTop: vs(2), marginBottom: vs(4)},
  metricBarWrap: {backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14), marginTop: vs(8)},
  barBg: {height: vs(6), backgroundColor: Colors.borderLight, borderRadius: ms(3), overflow: 'hidden', marginTop: vs(6)},
  barFill: {height: '100%', borderRadius: ms(3)},
  infraCard: {flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: ms(14), padding: s(12), marginBottom: vs(8), gap: s(10)},
  infraIcon: {width: ms(38), height: ms(38), borderRadius: ms(10), backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center'},
  statusBadge: {backgroundColor: Colors.tealBg, paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(6)},
  successBanner: {backgroundColor: Colors.tealBg, borderRadius: ms(14), padding: s(14), marginBottom: vs(10)},
  incidentCard: {backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14), marginBottom: vs(8)},
  sevBadge: {paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(6)},
  timelineDot: {width: ms(10), height: ms(10), borderRadius: ms(5)},
  timelineLine: {width: 1, height: vs(28), backgroundColor: Colors.borderLight, position: 'absolute', top: ms(10)},
  auditRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderColor: Colors.borderLight, gap: s(8)},
  auditDot: {width: ms(8), height: ms(8), borderRadius: ms(4)},
  complianceGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8)},
  complianceCard: {width: '47%', backgroundColor: Colors.white, borderRadius: ms(14), padding: s(10), alignItems: 'center'},
  compBadge: {paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(6), marginTop: vs(4)},
  pledgeCard: {backgroundColor: Colors.tealBg, borderRadius: ms(14), padding: s(14)},
  pledgeItem: {flexDirection: 'row', alignItems: 'flex-start', marginBottom: vs(12), gap: s(10)},
  pledgeCheck: {width: ms(20), height: ms(20), borderRadius: ms(10), backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center'},
  downloadCard: {flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14), marginBottom: vs(8), gap: s(10)},
  downloadIcon: {width: ms(38), height: ms(38), borderRadius: ms(10), backgroundColor: Colors.background, alignItems: 'center', justifyContent: 'center'},
  hashCard: {backgroundColor: Colors.white, borderRadius: ms(14), padding: s(14), marginTop: vs(4)},
  ctaBtn: {alignItems: 'center', justifyContent: 'center', paddingVertical: vs(12), borderRadius: ms(14)},
  footer: {marginTop: vs(24), paddingHorizontal: s(16), paddingBottom: vs(10)},
  modalContainer: {flex: 1, backgroundColor: Colors.white},
  modalHeader: {flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(16), paddingVertical: vs(12), borderBottomWidth: 1, borderColor: Colors.borderLight},
  docContent: {padding: s(16), paddingBottom: vs(40)},
  docTitle: {textAlign: 'center', marginTop: vs(8), marginBottom: vs(12)},
  docInfo: {backgroundColor: Colors.background, borderRadius: ms(10), padding: s(12)},
  docTable: {borderRadius: ms(8), overflow: 'hidden', marginBottom: vs(8)},
  docTableHeaderRow: {flexDirection: 'row', backgroundColor: Colors.primary, padding: s(8)},
  docTableRow: {flexDirection: 'row', padding: s(8), backgroundColor: Colors.white},
  docTableCell: {flex: 1, justifyContent: 'center'},
  statusPill: {paddingHorizontal: s(6), paddingVertical: vs(1), borderRadius: ms(4), alignSelf: 'flex-start'},
  docSig: {alignItems: 'center', marginTop: vs(16), paddingTop: vs(12), borderTopWidth: 1, borderColor: Colors.borderLight},
  detailsGrid: {backgroundColor: Colors.white, borderRadius: ms(8), overflow: 'hidden'},
  detailRow: {flexDirection: 'row', padding: s(10), borderBottomWidth: 1, borderColor: Colors.borderLight},
});

export default TrustReportScreen;