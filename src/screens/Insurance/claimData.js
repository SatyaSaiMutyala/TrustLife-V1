// Insurance claim static data
export const POLICY = {
  insurer: 'Star Health Insurance',
  plan: 'Star Comprehensive \u2013 Family Floater',
  policyNo: 'P/211124/01/2024/001234',
  sumInsured: '\u20B910,00,000',
  balance: '\u20B99,12,400',
  validTill: '31 Mar 2027',
  members: [
    {name: 'Priya Reddy', relation: 'Self', age: '38F', balance: '\u20B99.12L remaining'},
    {name: 'Raj Reddy', relation: 'Spouse', age: '42M', balance: 'No claims this year'},
    {name: 'Aarav Reddy', relation: 'Child', age: '9M', balance: 'No claims this year'},
  ],
};

export const YEAR_SUMMARY = [
  {label: 'Claimed (2026)', value: '\u20B913,600', sub: '3 claims filed'},
  {label: 'Approved (2026)', value: '\u20B98,400', sub: '1 claim paid', valueColor: '#1D9E75'},
  {label: 'Under review', value: '\u20B95,200', sub: '1 claim pending', valueColor: '#F0B429'},
  {label: 'Balance remaining', value: '\u20B99.12L', sub: 'Policy year'},
];

export const CLAIMS = [
  {
    id: 'c1', ref: 'STH-2026-0328-7841', type: 'OPD Reimbursement', claimant: 'Priya Reddy',
    providers: 'Apollo Clinic, TrustLab, Apollo Diagnostics', date: '28 Mar 2026',
    amount: '\u20B96,250', status: 'review', statusLabel: 'Under review',
    statusBg: '#FFF3CD', statusColor: '#856404', stripColor: '#F0B429',
    tags: ['T2DM + HTN review', '4 expenses', '3 docs attached'],
    timeline: [
      {label: 'Claim filed', date: '28 Mar 2026, 11:42 AM', done: true, note: 'All 4 expenses and 3 documents submitted'},
      {label: 'Documents verified', date: '29 Mar 2026, 9:15 AM', done: true, note: 'CBC report, prescription, and ultrasound confirmed'},
      {label: 'Under medical review', date: '30 Mar 2026', done: true, note: 'Assigned to claims assessor Dr. Anand Kumar'},
      {label: 'Approval decision', date: 'Expected by 5 Apr 2026', done: false, note: 'Pending \u2013 within 7 working days'},
      {label: 'Payment to account', date: 'Within 3 days of approval', done: false, note: 'HDFC Bank \u2022\u2022\u2022\u20224821'},
    ],
    treatment: [
      ['Doctor', 'Dr. Kavitha Sharma \u00B7 AP-45821'],
      ['Hospital', 'Apollo Clinic, Banjara Hills'],
      ['Diagnosis', 'T2DM (E11), HTN (I10)'],
      ['Nature', 'Chronic \u00B7 Pre-existing'],
      ['Treatment date', '28 Mar 2026'],
    ],
    expenses: [
      {icon: 'medkit-outline', name: 'Consultation \u00B7 Dr. Kavitha', sub: 'Apollo Clinic', amt: '\u20B9800'},
      {icon: 'flask-outline', name: 'CBC + HbA1c + Lipid panel', sub: 'TrustLab', amt: '\u20B92,400'},
      {icon: 'medical-outline', name: 'Metformin + Olmesartan + Ferrous sulphate', sub: 'Apollo Pharmacy', amt: '\u20B91,250'},
      {icon: 'scan-outline', name: 'Ultrasound \u00B7 Abdomen NAFLD', sub: 'Apollo Diagnostics', amt: '\u20B91,800'},
    ],
    docs: ['CBC + HbA1c + Lipid panel report', 'Prescription \u00B7 Dr. Kavitha', 'Ultrasound report \u00B7 Abdomen'],
    payment: null,
  },
  {
    id: 'c2', ref: 'STH-2026-0228-3341', type: 'OPD Reimbursement', claimant: 'Priya Reddy',
    providers: 'KIMS Hospital, SRL Diagnostics', date: '28 Feb 2026',
    amount: '\u20B95,200', status: 'docs', statusLabel: 'Docs needed',
    statusBg: '#FFF3E5', statusColor: '#92400E', stripColor: '#F97316',
    tags: ['Doctor MCI no. missing', '2 expenses'],
    timeline: [
      {label: 'Claim filed', date: '28 Feb 2026, 3:10 PM', done: true, note: '2 expenses submitted'},
      {label: 'Initial review', date: '1 Mar 2026', done: true, note: 'Documents reviewed'},
      {label: 'Additional information required', date: '3 Mar 2026', done: true, note: 'Doctor MCI number missing'},
      {label: 'Documents resubmitted', date: 'Pending', done: false, note: 'Please upload updated prescription'},
      {label: 'Approval decision', date: 'Pending', done: false, note: ''},
    ],
    treatment: [
      ['Doctor', 'Dr. Meera Rao \u00B7 MCI missing'],
      ['Hospital', 'KIMS Hospital, Hyderabad'],
      ['Diagnosis', 'T2DM (E11), Anaemia (D50)'],
      ['Treatment date', '28 Feb 2026'],
    ],
    expenses: [
      {icon: 'medkit-outline', name: 'Consultation \u00B7 Dr. Meera Rao', sub: 'KIMS Hospital', amt: '\u20B91,800'},
      {icon: 'flask-outline', name: 'CBC + Iron panel \u00B7 Anaemia workup', sub: 'SRL Diagnostics', amt: '\u20B93,400'},
    ],
    docs: ['Consultation notes', 'Iron panel \u00B7 CBC report'],
    payment: null,
    actionNote: 'Please upload an updated prescription from Dr. Meera Rao that includes her MCI registration number.',
  },
  {
    id: 'c3', ref: 'STH-2026-0115-4521', type: 'OPD Reimbursement', claimant: 'Priya Reddy',
    providers: 'Apollo Clinic, Thyrocare', date: '15 Jan 2026',
    amount: '\u20B98,400', status: 'approved', statusLabel: 'Approved',
    statusBg: '#ECFDF5', statusColor: '#065F46', stripColor: '#1D9E75',
    tags: ['Paid 22 Jan 2026', '3 expenses'],
    timeline: [
      {label: 'Claim filed', date: '15 Jan 2026, 10:22 AM', done: true, note: '3 expenses submitted'},
      {label: 'Documents verified', date: '16 Jan 2026', done: true, note: 'All documents accepted'},
      {label: 'Medical review', date: '18 Jan 2026', done: true, note: 'Approved by Dr. Priya Nair'},
      {label: 'Approval issued', date: '20 Jan 2026', done: true, note: 'Full amount approved'},
      {label: 'Payment processed', date: '22 Jan 2026', done: true, note: 'Credited to HDFC \u2022\u2022\u2022\u20224821'},
    ],
    treatment: [
      ['Doctor', 'Dr. Kavitha Sharma \u00B7 AP-45821'],
      ['Hospital', 'Apollo Clinic, Banjara Hills'],
      ['Diagnosis', 'T2DM (E11), Anaemia (D50)'],
      ['Treatment date', '15 Jan 2026'],
    ],
    expenses: [
      {icon: 'medkit-outline', name: 'Consultation \u00B7 Dr. Kavitha', sub: 'Apollo Clinic', amt: '\u20B91,200'},
      {icon: 'flask-outline', name: 'CBC + Iron panel + B12', sub: 'Thyrocare', amt: '\u20B93,800'},
      {icon: 'medical-outline', name: 'Ferrous sulphate + B12 supplements', sub: 'Apollo Pharmacy', amt: '\u20B93,400'},
    ],
    docs: ['Lab report \u00B7 CBC + Iron panel', 'Prescription \u00B7 Dr. Kavitha', 'Pharmacy invoice'],
    payment: {bank: 'HDFC Bank', account: '\u2022\u2022\u2022\u2022 4821', amount: '\u20B98,400', date: '22 Jan 2026', ref: 'PAY-STH-20260122-0041'},
  },
];
