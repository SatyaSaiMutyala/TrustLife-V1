const CONSENT_TABS = [
  {key: 'active', label: 'Active (3)'},
  {key: 'history', label: 'History'},
  {key: 'grant', label: '+ Grant'},
  {key: 'partners', label: 'Partners'},
];

const ACTIVE_CONSENTS = [
  {
    id: 'c1', status: 'active', name: 'Dr. Meera Mehta', org: 'Yashoda Hospitals, Secunderabad',
    ico: '\uD83D\uDC69\u200D\u2695\uFE0F', col: '#1D9E75', type: 'Healthcare provider',
    scopes: ['Health summary', 'Diagnostic records', 'Medication list', 'Lab reports'],
    accessLevel: 'Read-only', canWrite: false,
    granted: '15 Jan 2025', expires: 'Never', lastAccess: '26 Mar 2026, 8:42 AM', accessCount: 47,
    purpose: 'Ongoing clinical care and disease management',
    purposeDetail: 'Dr. Mehta reviews your health summary, lab reports, and medication list at each consultation for T2DM, HTN, and Dyslipidaemia.',
    history: [
      {date: '26 Mar 2026, 8:42 AM', action: 'Health summary viewed', by: 'Dr. Mehta'},
      {date: '20 Mar 2026, 4:15 PM', action: 'Lab reports viewed (HbA1c)', by: 'Dr. Mehta'},
      {date: '05 Mar 2026, 3:08 PM', action: 'Medication list viewed', by: 'Dr. Mehta'},
      {date: '15 Jan 2025, 10:08 AM', action: 'Consent granted', by: 'You'},
    ],
  },
  {
    id: 'c2', status: 'active', name: 'Apollo Pharmacy', org: 'Apollo Health and Lifestyle Ltd.',
    ico: '\uD83D\uDC8A', col: '#ef4444', type: 'Pharmacy',
    scopes: ['Prescription data', 'Medication list', 'Refill history'],
    accessLevel: 'Read-only', canWrite: false,
    granted: '15 Jan 2025', expires: 'Never', lastAccess: '25 Mar 2026, 7:15 PM', accessCount: 28,
    purpose: 'Prescription-based medication refill management',
    purposeDetail: 'Apollo Pharmacy reads your active prescription list to facilitate medication refills.',
    history: [
      {date: '25 Mar 2026, 7:15 PM', action: 'Prescription synced for refill', by: 'Apollo Pharmacy'},
      {date: '26 Feb 2026, 2:30 PM', action: 'Refill record written', by: 'Apollo Pharmacy'},
      {date: '15 Jan 2025, 10:12 AM', action: 'Consent granted', by: 'You'},
    ],
  },
  {
    id: 'c3', status: 'active', name: 'Yashoda Hospitals', org: 'Yashoda Health Network, Hyderabad',
    ico: '\uD83C\uDFE5', col: '#3b82f6', type: 'Hospital system',
    scopes: ['Diagnostic records', 'Lab reports', 'Health summary', 'Visit history'],
    accessLevel: 'Read + Write', canWrite: true,
    granted: '15 Jan 2025', expires: '14 Jan 2027', lastAccess: '20 Mar 2026, 10:30 AM', accessCount: 18,
    purpose: 'Inpatient and outpatient care coordination',
    purposeDetail: 'Yashoda Hospitals can view your complete health record and write discharge summaries, lab results, and clinical notes.',
    history: [
      {date: '20 Mar 2026, 10:30 AM', action: 'Lab report written (HbA1c, lipid panel)', by: 'Yashoda Labs'},
      {date: '20 Mar 2026, 10:28 AM', action: 'Diagnostic records viewed', by: 'Yashoda System'},
      {date: '15 Jan 2025, 10:10 AM', action: 'Consent granted', by: 'You'},
    ],
  },
];

const HISTORY_CONSENTS = [
  {id: 'h1', status: 'revoked', name: 'MedPlus Pharmacy', org: 'MedPlus Health Services', ico: '\uD83C\uDFEA', col: '#f97316', type: 'Pharmacy', scopes: ['Prescription data'], granted: '10 Mar 2025', revoked: '15 Aug 2025', reason: 'Switched pharmacy provider'},
  {id: 'h2', status: 'expired', name: 'Manipal Hospitals', org: 'Manipal Health Enterprises', ico: '\uD83C\uDFE5', col: '#8b5cf6', type: 'Hospital system', scopes: ['Diagnostic records', 'Lab reports'], granted: '01 Jun 2025', expires: '30 Jun 2025', note: 'One-time consultation'},
  {id: 'h3', status: 'revoked', name: 'HealthifyMe', org: 'Cure.fit Health Technologies', ico: '\uD83D\uDCF1', col: '#22c55e', type: 'Health app', scopes: ['Activity data', 'Sleep data'], granted: '20 Feb 2025', revoked: '01 Apr 2025', reason: 'App no longer in use'},
];

const PARTNERS = [
  {id: 'p1', name: 'Yashoda Hospitals', ico: '\uD83C\uDFE5', type: 'Hospital system', verified: true, connected: true},
  {id: 'p2', name: 'Apollo Pharmacy', ico: '\uD83D\uDC8A', type: 'Pharmacy chain', verified: true, connected: true},
  {id: 'p3', name: 'Dr. Meera Mehta', ico: '\uD83D\uDC69', type: 'Physician', verified: true, connected: true},
  {id: 'p4', name: 'Thyrocare Technologies', ico: '\uD83E\uDDEA', type: 'Diagnostic lab', verified: true, connected: false, desc: 'NABL-accredited. Integrated lab result sync.'},
  {id: 'p5', name: 'MedPlus', ico: '\uD83C\uDFEA', type: 'Pharmacy chain', verified: true, connected: false},
  {id: 'p6', name: '1mg (Tata Health)', ico: '\u2764\uFE0F', type: 'Health platform', verified: true, connected: false},
  {id: 'p7', name: 'Star Health Insurance', ico: '\u2B50', type: 'Health insurer', verified: true, connected: false},
  {id: 'p8', name: 'PharmEasy', ico: '\uD83D\uDFE2', type: 'Online pharmacy', verified: true, connected: false},
];

const SCOPE_OPTIONS = [
  {id: 'health-summary', label: 'Health summary', ico: '\uD83D\uDCCA', sub: 'Conditions, diagnoses'},
  {id: 'diagnostic', label: 'Diagnostic records', ico: '\uD83E\uDDEA', sub: 'Lab reports, imaging'},
  {id: 'medications', label: 'Medication list', ico: '\uD83D\uDC8A', sub: 'Drugs, dosages, adherence'},
  {id: 'prescriptions', label: 'Prescriptions', ico: '\uD83D\uDCCB', sub: 'Prescriptions issued'},
  {id: 'activity', label: 'Activity data', ico: '\uD83C\uDFC3', sub: 'Movement, workouts'},
  {id: 'sleep', label: 'Sleep data', ico: '\uD83C\uDF19', sub: 'Sleep patterns'},
  {id: 'nutrition', label: 'Nutrition data', ico: '\uD83E\uDD57', sub: 'Food log'},
  {id: 'vitals', label: 'Vitals', ico: '\u2764\uFE0F', sub: 'BP, glucose, HR'},
];

const DURATION_OPTIONS = [
  {key: '1consult', label: 'Single visit'},
  {key: '1month', label: '1 month'},
  {key: '3months', label: '3 months'},
  {key: '6months', label: '6 months'},
  {key: '1year', label: '1 year'},
  {key: '2years', label: '2 years'},
  {key: 'never', label: 'No expiry'},
];

const TYPE_COLORS = {
  'Healthcare provider': '#1D9E75',
  'Pharmacy': '#ef4444',
  'Hospital system': '#3b82f6',
  'Health app': '#22c55e',
  'Health insurer': '#a855f7',
  'Diagnostic lab': '#f59e0b',
  'Pharmacy chain': '#ef4444',
  'Physician': '#1D9E75',
  'Health platform': '#22c55e',
  'Online pharmacy': '#22c55e',
};

module.exports = {
  CONSENT_TABS,
  ACTIVE_CONSENTS,
  HISTORY_CONSENTS,
  PARTNERS,
  SCOPE_OPTIONS,
  DURATION_OPTIONS,
  TYPE_COLORS,
};
