const FAQ_CATEGORIES = [
  {
    key: 'getting_started',
    name: 'Getting started',
    ico: '🚀',
    items: [
      {
        q: 'How do I set up my health profile?',
        a: 'Go to Profile → Health Profile → Edit. Add your conditions, medications, allergies, and health goals. The more complete your profile, the better Ayu\'s insights will be.',
      },
      {
        q: 'How do I connect a wearable device?',
        a: 'Go to Profile → Connected Devices → Add Device. TrustLife supports Apple Health, Google Fit, Fitbit, and Garmin. You can revoke access at any time from Consent Manager.',
      },
      {
        q: 'Can I add multiple family members?',
        a: 'The Family plan (₹499/month) supports up to 5 profiles. Each member gets their own health record and privacy. Upgrade from Profile → Subscription → Family plan.',
      },
      {
        q: 'How do I import my lab reports?',
        a: 'Tap Health Records → Add Report → Upload PDF or Image. TrustLife uses OCR to extract values automatically. You can also connect partner labs from Consent Manager → Labs.',
      },
    ],
  },
  {
    key: 'ayu_intelligence',
    name: 'Ayu Intelligence',
    ico: '🌿',
    items: [
      {
        q: 'What is Ayu and how does it work?',
        a: 'Ayu is TrustLife\'s AI health intelligence layer. It analyses your logged data to generate personalised insights, identify trends, and offer wellness guidance. Ayu does not diagnose medical conditions and is not a substitute for professional medical advice.',
      },
      {
        q: 'Why is Ayu not generating insights?',
        a: 'Ayu needs sufficient data. Ensure you have: (1) at least 2 weeks of consistent logging, (2) Ayu consent enabled in Consent Manager, (3) health conditions and medications filled in your profile.',
      },
      {
        q: 'Can I trust Ayu\'s medication alerts?',
        a: 'Ayu\'s medication reminders are based on the schedule you enter. TrustLife does not verify whether medications are appropriate for you. Never start, stop, or alter any medication without consulting your prescribing doctor.',
      },
      {
        q: 'How do I turn off specific Ayu notifications?',
        a: 'Go to Profile → Settings → Notifications → Ayu Alerts. You can individually enable or disable health score updates, biomarker alerts, medication reminders, weekly summaries, and critical safety alerts.',
      },
    ],
  },
  {
    key: 'data_privacy',
    name: 'Data & Privacy',
    ico: '🔒',
    items: [
      {
        q: 'Who can see my health data?',
        a: 'Only you — unless you explicitly grant access. Profile → Consent Manager shows every active access grant. TrustLife employees cannot access your health data without dual-approval logged in your Access Log.',
      },
      {
        q: 'How do I download all my data?',
        a: 'Go to Profile → Transparency → Download Data. Export in FHIR, JSON, CSV, or PDF formats. Processing takes up to 24 hours for large datasets.',
      },
      {
        q: 'How do I delete my account?',
        a: 'Go to Profile → Settings → Delete Account. Deletion takes 30 days to complete. Financial records retained for 8 years per Indian accounting law. Consent logs retained for 7 years per DPDP Act 2023.',
      },
      {
        q: 'Is my data stored in India?',
        a: 'Yes. All data is stored exclusively within India on AWS ap-south-1 (Mumbai) servers. No health data leaves India without your separate explicit consent.',
      },
    ],
  },
  {
    key: 'medication_tracking',
    name: 'Medication tracking',
    ico: '💊',
    items: [
      {
        q: 'How do I add a medication?',
        a: 'Go to Medications → + Add Medication. Enter the name, dosage, frequency, and timing. You can set custom reminder sounds and pre-reminder lead time.',
      },
      {
        q: 'My medication reminder isn\'t working.',
        a: 'Check: (1) TrustLife notifications enabled in phone Settings, (2) medication marked as active, (3) Do Not Disturb is off, (4) app version 2.4.2 or later. If issue persists, report via Help → Report Issue.',
      },
      {
        q: 'Can I log medications for a family member?',
        a: 'With a Family plan, each member manages their own medications independently. As admin, you can set up caregiver access from Family → [Member Name] → Caregiver Access.',
      },
    ],
  },
  {
    key: 'subscription_billing',
    name: 'Subscription & Billing',
    ico: '💳',
    items: [
      {
        q: 'What\'s included in the Pro plan?',
        a: 'Pro plan (₹299/month) includes: unlimited exports, advanced Ayu coaching, lab result analysis, wearable sync, medication tracking with adherence scoring, priority support (<4 hour response).',
      },
      {
        q: 'How do I redeem TrustCoins?',
        a: 'Go to Profile → Rewards → Redeem. Coins can be used for plan discounts, data export PDFs, Ayu deep-dive sessions. 500 coins = 1 month free on your current plan.',
      },
      {
        q: 'My payment failed — what should I do?',
        a: 'Check your card/UPI details in Billing → Payment Methods. Ensure sufficient balance. Try a different payment method. Your account stays active for 7 days after a failed payment. Data is never deleted due to billing failure.',
      },
    ],
  },
  {
    key: 'technical_issues',
    name: 'Technical issues',
    ico: '🔧',
    items: [
      {
        q: 'The app is crashing frequently.',
        a: 'Try: (1) Update to latest version, (2) restart the app, (3) restart your phone, (4) clear app cache (Android), (5) reinstall — your data is cloud-stored and will not be lost. If crashes continue, report the issue.',
      },
      {
        q: 'Data isn\'t syncing from my wearable.',
        a: 'Try: (1) Pull down to refresh, (2) ensure Bluetooth is on, (3) confirm sync in companion app first, (4) go to Connected Devices → Re-sync, (5) revoke and re-grant device access if still failing.',
      },
      {
        q: 'I can\'t log in to my account.',
        a: 'Check: (1) correct email, (2) use Forgot Password to reset, (3) check if account was deactivated, (4) if signed up with Google/Apple, use the same login method. Contact security@trustlife.in if you suspect unauthorised access.',
      },
    ],
  },
];

const CHAT_MESSAGES = [
  { id: 1, sender: 'system', text: 'Support session started', time: '' },
  {
    id: 2,
    sender: 'agent',
    name: 'Divya',
    text: 'Hi Priya! 👋 I\'m Divya from TrustLife Support. How can I help you today?',
    time: '9:41 AM',
  },
  {
    id: 3,
    sender: 'agent',
    name: 'Divya',
    text: 'To help you quickly, could you tell me which part of TrustLife you need help with?',
    time: '9:41 AM',
  },
  {
    id: 4,
    sender: 'user',
    text: 'My medication reminders stopped working after the last update.',
    time: '9:43 AM',
  },
  {
    id: 5,
    sender: 'agent',
    name: 'Divya',
    text: 'I\'m sorry to hear that, Priya! Let me look into this for you right away. 🔍',
    time: '9:43 AM',
  },
  {
    id: 6,
    sender: 'agent',
    name: 'Divya',
    text: 'Could you check if notifications are enabled for TrustLife in your phone settings? Go to Settings → Apps → TrustLife → Notifications and make sure all toggles are on.',
    time: '9:44 AM',
  },
  {
    id: 7,
    sender: 'user',
    text: 'Yes they are. The notifications come in but the actual reminder alarm isn\'t playing.',
    time: '9:45 AM',
  },
  {
    id: 8,
    sender: 'agent',
    name: 'Divya',
    text: 'Got it — that\'s a known issue with app version 2.4.1 on iOS. Our team pushed a fix in version 2.4.2.',
    time: '9:45 AM',
  },
  {
    id: 9,
    sender: 'agent',
    name: 'Divya',
    text: 'Please update to version 2.4.2 from the App Store. If the issue persists after updating, I\'ll escalate this to our engineering team.',
    time: '9:45 AM',
  },
  {
    id: 10,
    sender: 'user',
    text: 'Updating now. One moment.',
    time: '9:47 AM',
  },
];

const QUICK_REPLIES = [
  'Issue is resolved!',
  'Still having the same problem',
  'Can you escalate this?',
  'Send me the steps again',
  'Thank you for your help!',
];

const AUTO_REPLIES = [
  'Got it! Let me check that for you.',
  'Thanks for the update, Priya.',
  'Understood. I\'ll look into this right away.',
  'I see. Could you share a screenshot if possible?',
  'That\'s helpful. I\'m escalating this to our technical team.',
];

const ISSUE_TYPES = [
  { key: 'bug', ico: '🐛', label: 'Bug / Crash', sub: 'App not working correctly' },
  { key: 'data', ico: '🔄', label: 'Data / Sync', sub: 'Missing or wrong data' },
  { key: 'billing', ico: '💳', label: 'Account / Billing', sub: 'Subscription or payment' },
  { key: 'privacy', ico: '🔒', label: 'Privacy / Data', sub: 'Data concern or request' },
  { key: 'ayu', ico: '🌿', label: 'Ayu / Insights', sub: 'Wrong or missing insights' },
  { key: 'other', ico: '⋮', label: 'Other', sub: 'Something else' },
];

const SEVERITY_LEVELS = [
  { key: 'low', ico: '🟢', label: 'Low' },
  { key: 'medium', ico: '🟡', label: 'Medium' },
  { key: 'high', ico: '🔴', label: 'High' },
  { key: 'critical', ico: '🚨', label: 'Critical' },
];

const TICKETS = [
  {
    ref: 'TL-2026-1847',
    title: 'Ayu not showing glucose trend for March',
    type: 'Ayu / Insights',
    severity: 'Medium',
    status: 'open',
    created: '24 Mar 2026',
    lastReply: '6h ago',
    lastReplyBy: 'Divya (Support)',
    ico: '🌿',
    icoBg: 'rgba(245,158,11,0.1)',
    statusColor: '#E9A23A',
    statusBg: 'rgba(245,158,11,0.1)',
    statusBorder: 'rgba(245,158,11,0.25)',
    statusLabel: 'IN PROGRESS',
    note: '',
    updates: [
      {
        by: 'Divya (Support)',
        time: '24 Mar 2026, 10:30 AM',
        msg: 'Thank you for reporting this. I\'ve replicated the issue on our test environment. Our data team is investigating.',
        isUser: false,
      },
      {
        by: 'Priya (You)',
        time: '24 Mar 2026, 2:15 PM',
        msg: 'All my glucose entries for March are showing in Health Records but Ayu only shows February in the trend.',
        isUser: true,
      },
      {
        by: 'Arjun (Engineering)',
        time: '26 Mar 2026, 9:00 AM',
        msg: 'We\'ve identified a caching bug that affects trend data for the current month. A fix will be deployed in version 2.4.3 today. Your data is safe.',
        isUser: false,
      },
    ],
  },
  {
    ref: 'TL-2026-1621',
    title: 'Medication reminder alarm not playing',
    type: 'Bug / Crash',
    severity: 'High',
    status: 'resolved',
    created: '21 Mar 2026',
    ico: '🐛',
    icoBg: 'rgba(55,138,221,0.1)',
    statusColor: '#22C55E',
    statusBg: 'rgba(34,197,94,0.1)',
    statusBorder: 'rgba(34,197,94,0.25)',
    statusLabel: 'RESOLVED',
    note: 'Fixed in app version 2.4.2 · closed by Priya',
    updates: [
      {
        by: 'Divya (Support)',
        time: '21 Mar 2026, 11:00 AM',
        msg: 'This is a known bug in version 2.4.1. Please update to 2.4.2 from App Store.',
        isUser: false,
      },
      {
        by: 'Priya (You)',
        time: '21 Mar 2026, 2:30 PM',
        msg: 'Updated. Reminders are working now. Thank you!',
        isUser: true,
      },
    ],
  },
  {
    ref: 'TL-2026-1388',
    title: 'Data export not including lab reports',
    type: 'Data / Sync',
    severity: 'Medium',
    status: 'resolved',
    created: '3 Mar 2026',
    ico: '🔒',
    icoBg: 'rgba(226,75,74,0.1)',
    statusColor: '#22C55E',
    statusBg: 'rgba(34,197,94,0.1)',
    statusBorder: 'rgba(34,197,94,0.25)',
    statusLabel: 'RESOLVED',
    note: 'Resolved · export now includes all document types',
    updates: [
      {
        by: 'Divya (Support)',
        time: '3 Mar 2026, 3:00 PM',
        msg: 'This was a bug in our PDF export pipeline that excluded files larger than 5MB. We\'ve fixed this. Please retry your export.',
        isUser: false,
      },
    ],
  },
];

module.exports = {
  FAQ_CATEGORIES,
  CHAT_MESSAGES,
  QUICK_REPLIES,
  AUTO_REPLIES,
  ISSUE_TYPES,
  SEVERITY_LEVELS,
  TICKETS,
};
