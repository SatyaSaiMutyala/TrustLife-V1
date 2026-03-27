const FILTER_PILLS = [
  {key: 'all', label: 'All events'},
  {key: 'you', label: 'You'},
  {key: 'doctor', label: 'Doctors'},
  {key: 'pharmacy', label: 'Pharmacy'},
  {key: 'lab', label: 'Labs'},
  {key: 'system', label: 'Ayu'},
  {key: 'security', label: 'Security'},
];

const CAT_COLORS = {
  you: '#1D9E75',
  doctor: '#3b82f6',
  pharmacy: '#ef4444',
  lab: '#f59e0b',
  system: '#6366f1',
  security: '#f43f5e',
  insurance: '#a855f7',
};

const RISK_COLORS = {
  low: {color: '#22c55e', bg: 'rgba(34,197,94,0.1)'},
  medium: {color: '#f59e0b', bg: 'rgba(245,158,11,0.1)'},
  high: {color: '#ef4444', bg: 'rgba(239,68,68,0.1)'},
};

const ACCESS_LOG = [
  {id:'e001', date:'26 Mar 2026', time:'09:41 AM', cat:'system', actor:'TrustLife Ayu', org:'Internal analytics', ico:'\uD83C\uDF3F', action:'Daily health analysis run', data:['Health summary','Glucose trends','Sleep','Medications'], purpose:'Personalised insight generation', method:'Automated', consent:'Ayu consent', duration:'0.3s', records:14, risk:'low', device:'TrustLife Server'},
  {id:'e002', date:'26 Mar 2026', time:'09:05 AM', cat:'you', actor:'Priya Reddy (you)', org:'Account holder', ico:'\uD83D\uDC64', action:'App login', data:[], purpose:'Account access', method:'Face ID', consent:'Your own access', duration:'-', records:0, risk:'low', device:'iPhone 15 Pro'},
  {id:'e003', date:'26 Mar 2026', time:'08:42 AM', cat:'doctor', actor:'Dr. Meera Mehta', org:'Yashoda Hospitals', ico:'\uD83D\uDC69\u200D\u2695\uFE0F', action:'Health summary viewed', data:['Health summary','Lab reports','Medications'], purpose:'Pre-appointment review', method:'Clinician Portal', consent:'Consent C-001', duration:'4m 12s', records:8, risk:'low', device:'Yashoda Network'},
  {id:'e004', date:'26 Mar 2026', time:'07:58 AM', cat:'system', actor:'TrustLife Ayu', org:'Internal', ico:'\uD83C\uDF3F', action:'Medication timing alert', data:['Medications'], purpose:'Metformin 8AM reminder', method:'Automated', consent:'Ayu consent', duration:'0.1s', records:1, risk:'low', device:'TrustLife Server'},
  {id:'e005', date:'25 Mar 2026', time:'07:15 PM', cat:'pharmacy', actor:'Apollo Pharmacy', org:'Secunderabad Branch', ico:'\uD83C\uDFE5', action:'Prescription synced', data:['Medications','Prescriptions'], purpose:'Refill management', method:'Pharmacy API', consent:'Consent C-002', duration:'1.2s', records:3, risk:'low', device:'Apollo POS'},
  {id:'e006', date:'25 Mar 2026', time:'08:10 AM', cat:'system', actor:'TrustLife Ayu', org:'Internal', ico:'\uD83C\uDF3F', action:'Sleep-glucose correlation', data:['Sleep','Glucose trends'], purpose:'Weekly pattern insight', method:'Automated', consent:'Ayu consent', duration:'0.8s', records:28, risk:'low', device:'TrustLife Server'},
  {id:'e007', date:'25 Mar 2026', time:'07:30 AM', cat:'you', actor:'Priya Reddy (you)', org:'Account holder', ico:'\uD83D\uDC64', action:'Fasting glucose logged', data:['Glucose trends'], purpose:'Daily self-monitoring', method:'Manual entry', consent:'Your own access', duration:'-', records:1, risk:'low', device:'iPhone 15 Pro'},
  {id:'e008', date:'24 Mar 2026', time:'03:45 PM', cat:'doctor', actor:'Dr. Ravi Krishnan', org:'KIMS Hospitals', ico:'\u2764\uFE0F', action:'Access request sent', data:['Health summary','Lab reports','BP trends'], purpose:'Cardiac risk assessment', method:'Access Request', consent:'Pending approval', duration:'-', records:0, risk:'medium', device:'KIMS Portal'},
  {id:'e009', date:'24 Mar 2026', time:'09:22 AM', cat:'you', actor:'Priya Reddy (you)', org:'Account holder', ico:'\uD83D\uDC64', action:'Lab report uploaded', data:['Diagnostic records','Lab reports'], purpose:'HbA1c result', method:'Camera scan', consent:'Your own access', duration:'-', records:1, risk:'low', device:'iPhone 15 Pro'},
  {id:'e010', date:'20 Mar 2026', time:'02:18 PM', cat:'you', actor:'Priya Reddy (you)', org:'Account holder', ico:'\uD83D\uDC64', action:'Full health record exported', data:['Health summary','Diagnostics','Lab reports','Medications'], purpose:'Second opinion', method:'PDF export', consent:'Your own access', duration:'3.1s', records:47, risk:'low', device:'iPhone 15 Pro'},
  {id:'e011', date:'15 Mar 2026', time:'11:45 AM', cat:'lab', actor:'Metropolis Labs', org:'Lab #MTR-8821', ico:'\uD83E\uDDEA', action:'Lab results imported', data:['Lab reports','Diagnostics'], purpose:'HbA1c, lipid panel', method:'Lab Integration', consent:'One-time import', duration:'2.4s', records:18, risk:'low', device:'Metropolis System'},
  {id:'e012', date:'8 Mar 2026', time:'02:12 AM', cat:'security', actor:'Security system', org:'TrustLife Platform', ico:'\uD83D\uDD12', action:'Unusual login blocked', data:[], purpose:'Security alert', method:'Automated security', consent:'N/A', duration:'-', records:0, risk:'high', device:'Unknown - Singapore'},
  {id:'e013', date:'8 Mar 2026', time:'02:13 AM', cat:'security', actor:'TrustLife Security', org:'Automated alert', ico:'\uD83D\uDD12', action:'Security alert sent', data:[], purpose:'Anomalous login notification', method:'Push + Email', consent:'N/A', duration:'-', records:0, risk:'high', device:'TrustLife Security'},
];

const EXPORT_FORMATS = [
  {ico: '\uD83D\uDCC4', fmt: 'PDF Report', desc: 'Formatted report with signatures', col: '#ef4444'},
  {ico: '\uD83D\uDCCA', fmt: 'CSV / Excel', desc: 'Raw data table for analysis', col: '#22c55e'},
  {ico: '\uD83D\uDCBB', fmt: 'JSON', desc: 'Structured data for developers', col: '#3b82f6'},
  {ico: '\uD83C\uDFE5', fmt: 'FHIR / ABDM', desc: 'Healthcare standard format', col: '#a855f7'},
];

const DATE_PRESETS = [
  {key: 'all', label: 'All time'},
  {key: 'today', label: 'Today'},
  {key: '7d', label: '7 days'},
  {key: '30d', label: '30 days'},
  {key: '90d', label: '90 days'},
];

module.exports = {
  FILTER_PILLS,
  CAT_COLORS,
  RISK_COLORS,
  ACCESS_LOG,
  EXPORT_FORMATS,
  DATE_PRESETS,
};
