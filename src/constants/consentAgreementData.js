const CONSENT_CATEGORIES = [
  {
    key: 'medical',
    title: 'Medical Consents',
    badge: 'Health data & AI',
    badgeBg: 'rgba(226,75,74,0.1)',
    badgeColor: '#E24B4A',
    badgeBorder: 'rgba(226,75,74,0.28)',
    ico: '\u2695\uFE0F',
    icoBg: 'rgba(226,75,74,0.12)',
    desc: 'These consents govern how TrustLife processes your health information and how Ayu Intelligence works with your data.',
  },
  {
    key: 'data',
    title: 'Data & Technology Consents',
    badge: 'DPDP Act 2023 aligned',
    badgeBg: 'rgba(55,138,221,0.1)',
    badgeColor: '#378ADD',
    badgeBorder: 'rgba(55,138,221,0.28)',
    ico: '\uD83D\uDD12',
    icoBg: 'rgba(55,138,221,0.1)',
    desc: 'These consents govern how TrustLife processes your personal data for platform operation, communications, and service improvement.',
  },
];

const CONSENT_ITEMS = [
  {
    id: 'm1',
    category: 'medical',
    ico: '\uD83E\uDE7A',
    icoBg: 'rgba(226,75,74,0.1)',
    title: 'Health data processing',
    desc: 'Allow TrustLife to store and process your health records, diagnostic reports, medication history, and biometric data.',
    required: true,
    defaultOn: true,
    details:
      'TrustLife stores your health data on AWS Mumbai servers (India-only). All data is encrypted with AES-256 at rest and TLS 1.3 in transit. This consent is required \u2014 without it, TrustLife cannot function as a health continuity platform. You may delete your data at any time from Settings.\n\nData stored: Lab reports, prescriptions, glucose readings, BP, medications, sleep data, food logs, activity data.\n\nLegal basis: Consent \u00B7 DPDP Act 2023 Section 6 \u00B7 HIPAA-aligned',
  },
  {
    id: 'm2',
    category: 'medical',
    ico: '\uD83C\uDF3F',
    icoBg: 'rgba(168,85,247,0.1)',
    title: 'Ayu Intelligence processing',
    desc: 'Allow Ayu to analyse your health data and generate personalised insights, trends, scores, and health recommendations.',
    required: true,
    defaultOn: true,
    details:
      'Ayu processes your logged health data to identify patterns and generate informational insights. Ayu outputs are not medical diagnoses and do not constitute clinical advice. Ayu models are trained on anonymised datasets \u2014 not on your data.\n\nWhat Ayu generates: Health trends, biomarker patterns, lifestyle suggestions, medication reminders, health scores.\n\nWhat Ayu does NOT generate: Medical diagnosis, treatment prescriptions, clinical advice.',
  },
  {
    id: 'm3',
    category: 'medical',
    ico: '\uD83D\uDEA8',
    icoBg: 'rgba(226,75,74,0.1)',
    title: 'Critical safety alerts',
    desc: 'Allow TrustLife to send urgent safety alerts when your logged values may indicate a potentially serious health condition.',
    required: true,
    defaultOn: true,
    details:
      'When TrustLife detects critical biomarker values (e.g., glucose <70 or >400 mg/dL, BP systolic >180 mmHg, SpO\u2082 <90%), it displays an urgent prompt to seek medical attention. These alerts are informational safety prompts \u2014 they are not medical diagnoses.',
  },
  {
    id: 'm4',
    category: 'medical',
    ico: '\uD83D\uDC8A',
    icoBg: 'rgba(168,85,247,0.1)',
    title: 'Medication tracking & reminders',
    desc: 'Allow TrustLife to store your medication schedules, track adherence, and send medication reminders.',
    required: false,
    defaultOn: true,
    details:
      'Disclaimer: Do not start, stop, or alter any medication based on TrustLife reminders or outputs without consulting your prescribing doctor. Reminders are based solely on the schedule you enter \u2014 TrustLife does not verify whether medications are appropriate for you.',
  },
  {
    id: 'm5',
    category: 'medical',
    ico: '\uD83D\uDCCB',
    icoBg: 'rgba(99,102,241,0.1)',
    title: 'Symptom tracking & logging',
    desc: "Allow TrustLife to record symptom logs you enter and use them in Ayu's health pattern analysis.",
    required: false,
    defaultOn: true,
    details:
      "Disclaimer: Symptom logs do not constitute a medical diagnosis. Seek medical attention for persistent, severe, or worsening symptoms. Do not use TrustLife's symptom log as a substitute for clinical evaluation.",
  },
  {
    id: 'm6',
    category: 'medical',
    ico: '\uD83E\uDDB6',
    icoBg: 'rgba(29,158,117,0.1)',
    title: 'Clinical data sharing (TrustMD)',
    desc: 'Allow TrustLife to share your health records with healthcare providers you explicitly authorise through TrustMD.',
    required: false,
    defaultOn: false,
    details:
      'Each sharing grant requires separate, explicit consent per doctor. Data shared with healthcare providers is patient-reported \u2014 clinicians must base all clinical decisions on independent professional evaluation. You may revoke any sharing grant at any time from the Consent Manager.',
  },
  {
    id: 'd1',
    category: 'data',
    ico: '\uD83D\uDC65',
    icoBg: 'rgba(55,138,221,0.1)',
    title: 'Personal data processing',
    desc: 'Allow TrustLife to collect and process your name, contact details, device information, and account data for platform operation.',
    required: true,
    defaultOn: true,
    details:
      'Processed under DPDP Act 2023 Section 6 (Consent) and Section 7 (Legitimate use). Data collected: name, date of birth, email, phone number, device identifiers.\n\nPurpose: Account authentication, billing, customer support, security monitoring.\n\nData Fiduciary: TrustLife Health Technologies Pvt Ltd \u00B7 Grievance Officer: Venkata Cherukuri (privacy@trustlife.in)',
  },
  {
    id: 'd2',
    category: 'data',
    ico: '\uD83C\uDFD7\uFE0F',
    icoBg: 'rgba(34,197,94,0.1)',
    title: 'Secure data storage (India)',
    desc: 'Allow TrustLife to store your data on AWS Mumbai (ap-south-1) servers within India, encrypted at AES-256 standard.',
    required: true,
    defaultOn: true,
    details:
      'All data stored exclusively in India (AWS ap-south-1, Mumbai). No data leaves India without separate explicit consent. AES-256 encryption at rest, TLS 1.3 in transit. Encryption keys managed via AWS KMS with 90-day automatic rotation. Backups retained with 5-minute RPO.',
  },
  {
    id: 'd3',
    category: 'data',
    ico: '\uD83D\uDCE7',
    icoBg: 'rgba(99,102,241,0.1)',
    title: 'Transactional communications',
    desc: 'Allow TrustLife to send account emails, billing invoices, security alerts, and critical health safety notifications.',
    required: true,
    defaultOn: true,
    details:
      'Transactional communications include: account creation & verification, billing receipts & invoices, password reset & security alerts, data breach notifications (within 72 hours), critical health safety alerts. These cannot be disabled as they are essential for account and safety management.',
  },
  {
    id: 'd4',
    category: 'data',
    ico: '\uD83D\uDCC4',
    icoBg: 'rgba(240,180,41,0.1)',
    title: 'Consent & access audit log',
    desc: 'Allow TrustLife to maintain an immutable record of all consent decisions and data access events for your protection.',
    required: true,
    defaultOn: true,
    details:
      'TrustLife maintains a tamper-proof audit log of all consent decisions, data access events, and system interactions. This log is your protection \u2014 it ensures we can prove compliance and you can see exactly who accessed your data and when. Retained for 7 years per legal obligation. Viewable at any time from Profile > Transparency > Access Log.',
  },
  {
    id: 'd5',
    category: 'data',
    ico: '\u231A\uFE0F',
    icoBg: 'rgba(29,158,117,0.1)',
    title: 'Wearable & health device sync',
    desc: 'Allow TrustLife to import data from Apple Health, Google Fit, Fitbit, Garmin, or other connected health devices.',
    required: false,
    defaultOn: false,
    details:
      'Only data categories you explicitly enable per device will be synced. You can revoke device access at any time from Consent Manager. TrustLife does not share your data with wearable manufacturers. Data accuracy from wearables depends on device calibration \u2014 TrustLife is not responsible for sensor inaccuracies.',
  },
  {
    id: 'd6',
    category: 'data',
    ico: '\uD83D\uDD2C',
    icoBg: 'rgba(244,63,94,0.1)',
    title: 'Lab & diagnostic result import',
    desc: 'Allow TrustLife to receive lab results directly from partner diagnostic centres when you authorise a specific test.',
    required: false,
    defaultOn: false,
    details:
      'Each lab import requires a one-time or standing consent per laboratory. Labs are authorised to transmit results to TrustLife \u2014 they receive no data from TrustLife in return. You may revoke any lab consent from Consent Manager.',
  },
  {
    id: 'd7',
    category: 'data',
    ico: '\uD83D\uDD14',
    icoBg: 'rgba(99,102,241,0.1)',
    title: 'Health reminders & push notifications',
    desc: 'Allow TrustLife to send medication reminders, health logging nudges, Ayu insights, and wellness tips.',
    required: false,
    defaultOn: true,
    details:
      'Push notifications help you stay consistent with health tracking. You can customise notification frequency and content from Settings at any time. Disabling this consent will not affect critical safety alerts, which remain enabled regardless.',
  },
  {
    id: 'd8',
    category: 'data',
    ico: '\uD83D\uDCCA',
    icoBg: 'rgba(240,180,41,0.1)',
    title: 'Anonymised product analytics',
    desc: "Allow TrustLife to use anonymised, de-identified usage patterns to improve the app and Ayu's capabilities.",
    required: false,
    defaultOn: false,
    details:
      "Only fully de-identified, aggregated usage patterns are used \u2014 never individual health records or personal data. This helps TrustLife understand which features are most useful and improve Ayu's insight quality. You may withdraw this consent at any time without any impact on your account or features.",
  },
];

const CONSENT_LABELS = {
  m1: 'Health data processing',
  m2: 'Ayu Intelligence',
  m3: 'Critical safety alerts',
  m4: 'Medication tracking',
  m5: 'Symptom tracking',
  m6: 'Clinical sharing (TrustMD)',
  d1: 'Personal data processing',
  d2: 'Secure storage',
  d3: 'Transactional comms',
  d4: 'Audit log',
  d5: 'Wearable sync',
  d6: 'Lab result import',
  d7: 'Push notifications',
  d8: 'Anonymised analytics',
};

const SIGN_STATEMENT =
  'I, {NAME}, hereby give my informed consent to the data processing, health intelligence, and service terms described above. I understand that TrustLife is a health intelligence platform and not a medical service provider. I will consult qualified medical professionals for all diagnosis and treatment decisions.';

module.exports = {
  CONSENT_CATEGORIES,
  CONSENT_ITEMS,
  CONSENT_LABELS,
  SIGN_STATEMENT,
};
