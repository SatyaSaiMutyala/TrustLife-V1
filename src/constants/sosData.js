const MEDICAL_ID = {
  name: 'Priya Reddy',
  age: '38F',
  bloodType: 'B+',
  dob: '14 Jul 1987',
  gender: 'Female',
  weight: '68 kg',
  bmi: '26.2',
  conditions: ['T2DM', 'HTN', 'Dyslipidaemia'],
  medications: ['Metformin 500mg BD', 'Amlodipine 5mg OD', 'Atorvastatin 10mg OD', 'Methylcobalamin 500mcg'],
  allergies: ['Penicillin', 'Sulpha drugs'],
  lastHbA1c: '7.8% · Jan 2026',
  lastBP: '138/88 mmHg · 26 Mar 2026',
  lastGlucose: '148 mg/dL · Fasting · 25 Mar',
  lastHR: '78 bpm · resting · 26 Mar 2026',
  physician: 'Dr. Meera Mehta',
  physicianPhone: '9848012345',
  physicianHospital: 'Yashoda Hospital, Hyderabad',
};

const TRIGGER_METHODS = [
  { ico: '⚫', label: 'Hold 3 sec' },
  { ico: '🔴', label: 'Single tap' },
  { ico: '📶', label: 'Shake 3×' },
];

const SOS_SEQUENCE = [
  { num: '1', ico: '🚨', label: 'Call 112 emergency services', sub: 'Auto-dials · transmits GPS location to dispatch', delay: '0 sec' },
  { num: '2', ico: '📨', label: 'SMS + push to family & care team', sub: 'Ravi, Ananya, Dr. Meera · live location link included', delay: '2 sec' },
  { num: '3', ico: '📍', label: 'Live location streaming starts', sub: 'GPS updates every 30s · shared with all contacts', delay: '2 sec' },
  { num: '4', ico: '🛑', label: 'Full Medical ID transmitted', sub: 'Blood type, conditions, meds, allergies, last vitals', delay: '3 sec' },
  { num: '5', ico: '🏥️', label: '3 nearest hospitals identified', sub: 'Maps navigation ready · sent to care team', delay: '4 sec' },
  { num: '6', ico: '🌿', label: 'Ayu health brief generated + WhatsApp', sub: 'Recent vitals trend sent to Dr. Meera Mehta', delay: '5 sec' },
];

const EMERGENCY_CONTACTS = [
  { name: 'Ravi Reddy', role: 'Husband · Primary', ico: '👨', icoBg: 'rgba(55,138,221,0.1)', action: 'Ping' },
  { name: 'Ananya Reddy', role: 'Daughter · Secondary', ico: '👩', icoBg: 'rgba(168,85,247,0.1)', action: 'Ping' },
  { name: 'Dr. Meera', role: 'Physician', ico: '👩‍⚕️', icoBg: 'rgba(29,158,117,0.1)', action: 'Alert' },
];

const NEAREST_HOSPITALS = [
  { name: 'Yashoda Hospital', dist: '0.8', addr: 'Somajiguda', spec: '24/7 Emergency · ICU · Cardiology' },
  { name: 'Apollo Hospitals', dist: '1.4', addr: 'Jubilee Hills', spec: 'Endocrinology · Cardiology · Emergency' },
  { name: 'KIMS Hospital', dist: '2.1', addr: 'Secunderabad', spec: 'Multispeciality' },
];

const DISPATCH_ITEMS = [
  {
    ico: '📞',
    name: '112 Emergency Services',
    sub: 'Auto-dialling · GPS coordinates transmitted to dispatch\nIncident number: HYD-2026-031847',
    status: 'CONNECTING',
    statusColor: '#22C55E',
    statusBg: 'rgba(34,197,94,0.15)',
    statusBorder: 'rgba(34,197,94,0.3)',
    time: 'Now',
    icoBg: 'rgba(239,68,68,0.15)',
    cardBg: 'rgba(34,197,94,0.1)',
    cardBorder: 'rgba(34,197,94,0.3)',
  },
  {
    ico: '👨',
    name: 'Ravi Reddy — Husband',
    sub: 'Primary contact · Call + SMS + push',
    detail: 'SMS: "EMERGENCY: Priya needs help. Location: bit.ly/PriyaLive"',
    status: 'DELIVERED',
    statusColor: '#22C55E',
    statusBg: 'rgba(34,197,94,0.15)',
    statusBorder: 'rgba(34,197,94,0.3)',
    time: '3s ago',
    icoBg: 'rgba(55,138,221,0.1)',
    cardBg: 'rgba(34,197,94,0.1)',
    cardBorder: 'rgba(34,197,94,0.3)',
  },
  {
    ico: '👩',
    name: 'Ananya Reddy — Daughter',
    sub: 'Secondary contact · SMS + push alert',
    detail: 'SMS sent · TrustLife push sent · location link included',
    status: 'PENDING',
    statusColor: '#F59E0B',
    statusBg: 'rgba(245,158,11,0.12)',
    statusBorder: 'rgba(245,158,11,0.3)',
    time: '3s ago',
    icoBg: 'rgba(168,85,247,0.1)',
    cardBg: 'rgba(34,197,94,0.1)',
    cardBorder: 'rgba(34,197,94,0.3)',
  },
  {
    ico: '👩‍⚕️',
    name: 'Dr. Meera Mehta — Physician',
    sub: 'Care team · Medical summary + location',
    detail: 'Ayu health brief · Full Medical ID · Recent vitals',
    status: 'READ ✓',
    statusColor: '#1D9E75',
    statusBg: 'rgba(29,158,117,0.1)',
    statusBorder: 'rgba(29,158,117,0.28)',
    time: '8s ago',
    icoBg: 'rgba(29,158,117,0.1)',
    cardBg: 'rgba(29,158,117,0.1)',
    cardBorder: 'rgba(29,158,117,0.28)',
  },
  {
    ico: '🏥️',
    name: 'Nearest hospitals located',
    sub: 'Yashoda (0.8km) · Apollo (1.4km) · KIMS (2.1km)',
    detail: "Navigation ready · Sent to Dr. Meera's app",
    status: 'READY',
    statusColor: '#1D9E75',
    statusBg: 'rgba(29,158,117,0.1)',
    statusBorder: 'rgba(29,158,117,0.28)',
    time: '4s ago',
    icoBg: 'rgba(55,138,221,0.1)',
    cardBg: 'rgba(29,158,117,0.1)',
    cardBorder: 'rgba(29,158,117,0.28)',
  },
];

const SOS_SETTINGS = [
  { ico: '⚫', title: 'Hold 3 seconds', desc: 'Press and hold SOS button for 3 seconds to activate', on: true, locked: true },
  { ico: '🔴', title: 'Single tap', desc: 'Tap once to activate SOS immediately', on: true, locked: false },
  { ico: '📶', title: 'Shake 3x', desc: 'Shake your phone 3 times to trigger SOS', on: true, locked: false },
  { ico: '📞', title: 'Auto-call 112', desc: 'Automatically dial 112 emergency services', on: true, locked: true },
  { ico: '📨', title: 'Auto-SMS to contacts', desc: 'Send SMS alerts to all emergency contacts', on: true, locked: true },
  { ico: '📍', title: 'Live location streaming', desc: 'Stream live GPS location to contacts and services', on: true, locked: true },
  { ico: '🛑', title: 'Share full Medical ID', desc: 'Transmit complete Medical ID to emergency responders', on: true, locked: false },
  { ico: '🌿', title: 'Ayu health brief to doctor', desc: 'Send AI-generated health summary to your physician', on: true, locked: false },
  { ico: '🔊', title: 'Loud siren alarm', desc: 'Play a loud siren sound when SOS is activated', on: false, locked: false },
  { ico: '🎙️', title: 'Auto audio recording', desc: 'Automatically record audio during an emergency', on: false, locked: false },
];

const MEDICAL_ID_GRID = [
  { label: 'Blood type', value: 'B+ (B Positive)' },
  { label: 'Conditions', value: 'T2DM · HTN\nDyslipidaemia' },
  { label: 'Medications', value: 'Metformin 500mg\nAmlodipine 5mg\nAtorvastatin 10mg\nMethylcobalamin 500mcg' },
  { label: 'Allergies', value: '⚠ Penicillin\n⚠ Sulpha drugs' },
  { label: 'Last HbA1c', value: '7.8% · Jan 2026' },
  { label: 'Last BP', value: '138/88 mmHg\n26 Mar 2026' },
  { label: 'Last glucose', value: '148 mg/dL\nFasting · 25 Mar' },
  { label: 'Last HR', value: '78 bpm · resting\n26 Mar 2026' },
];

module.exports = {
  MEDICAL_ID,
  TRIGGER_METHODS,
  SOS_SEQUENCE,
  EMERGENCY_CONTACTS,
  NEAREST_HOSPITALS,
  DISPATCH_ITEMS,
  SOS_SETTINGS,
  MEDICAL_ID_GRID,
};
