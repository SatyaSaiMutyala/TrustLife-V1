const VALUE_PROPS = [
  {ico: '\uD83C\uDF3F', title: 'Ayu Intelligence', desc: 'AI-powered insights from your health data. Trends, scores, nudges \u2014 always informational, never diagnostic.', bg: '#E1F5EE'},
  {ico: '\uD83D\uDCC1', title: 'Lifetime health record', desc: 'Labs, prescriptions, vitals \u2014 all in one place, forever. Export in FHIR, PDF, or CSV any time.', bg: '#E6F1FB'},
  {ico: '\uD83D\uDC8A', title: 'Medication tracking', desc: 'Reminders, adherence streaks, interaction awareness. Your medication history, always complete.', bg: '#EEEDFE'},
  {ico: '\uD83D\uDD12', title: 'Full data ownership', desc: 'Your data lives in India. You control every share, every consent. Delete everything, any time.', bg: '#FCEBEB'},
];

const LOGIN_METHODS = [
  {id: 'bio', ico: '\uD83E\uDD1E', title: 'Biometric', sub: 'Face ID or Touch ID \u00B7 Fastest and most secure', badge: 'Recommended', badgeBg: '#E1F5EE', badgeColor: '#1D9E75', bg: '#E1F5EE'},
  {id: 'pin', ico: '\uD83D\uDD22', title: '6-digit PIN', sub: 'Your personal health access PIN', bg: '#E6F1FB'},
  {id: 'password', ico: '\uD83D\uDD11', title: 'Password', sub: 'Your account password', bg: '#EEEDFE'},
];

const GENDER_OPTIONS = ['Female', 'Male', 'Non-binary', 'Prefer not to say'];

const BLOOD_TYPES = ['A+', 'A-', 'B+', 'B-', 'O+', 'O-', 'AB+', 'AB-', "Don't know"];

const HEALTH_CONDITIONS = [
  {ico: '\uD83E\uDE7A', label: 'Type 2 Diabetes'},
  {ico: '\u2764\uFE0F', label: 'Hypertension'},
  {ico: '\uD83E\uDEC0', label: 'Heart disease'},
  {ico: '\uD83E\uDEC1', label: 'Asthma/COPD'},
  {ico: '\uD83E\uDDE0', label: 'Thyroid'},
  {ico: '\uD83E\uDDB4', label: 'Arthritis'},
  {ico: '\uD83C\uDF0A', label: 'Cholesterol'},
  {ico: '\uD83D\uDD2C', label: 'Kidney disease'},
  {ico: '\u26A1', label: 'Anxiety/Depression'},
  {ico: '\u2795', label: 'Other/None'},
];

const DEFAULT_MEDICATIONS = [
  {id: 'metformin', name: 'Metformin 500mg', dose: 'Twice daily \u00B7 After meals'},
  {id: 'amlodipine', name: 'Amlodipine 5mg', dose: 'Once daily \u00B7 Morning'},
  {id: 'atorvastatin', name: 'Atorvastatin 10mg', dose: 'Once daily \u00B7 Night'},
];

const MEDICATION_DATABASE = [
  'Metformin 500mg', 'Metformin 1000mg', 'Amlodipine 5mg', 'Amlodipine 10mg',
  'Atorvastatin 10mg', 'Atorvastatin 20mg', 'Methylcobalamin 500mcg', 'Losartan 50mg',
  'Ramipril 5mg', 'Aspirin 75mg', 'Pantoprazole 40mg', 'Levothyroxine 50mcg',
  'Insulin Glargine', 'Metoprolol 25mg',
];

const PLANS = [
  {id: 'free', name: 'Free', price: 0, freq: '/month', color: '#378ADD', features: ['Basic health record storage', 'Medication reminders (5 meds)', 'Emergency SOS'], limited: ['Ayu insights (limited)']},
  {id: 'basic', name: 'Basic', priceM: 149, priceA: 99, freq: '/month', color: '#1D9E75', features: ['Everything in Free', 'Full Ayu health insights', 'Lab report analysis']},
  {id: 'pro', name: 'Pro', priceM: 299, priceA: 199, freq: '/month', color: '#F0B429', popular: true, features: ['Everything in Basic', 'Wearable & lab sync', 'TrustMD doctor sharing', 'Priority support <4hrs']},
  {id: 'fam', name: 'Family', priceM: 499, priceA: 329, freq: '/month \u00B7 up to 5', color: '#A855F7', features: ['Pro for all 5 members', 'Separate private profiles']},
];

const CONSENT_TOGGLES = [
  {id: 'c_health', ico: '\uD83E\uDE7A', title: 'Health data processing', sub: 'Store and process your health records', required: true, defaultOn: true, category: 'medical'},
  {id: 'c_ayu', ico: '\uD83C\uDF3F', title: 'Ayu Intelligence', sub: 'AI analysis of your health data', required: true, defaultOn: true, category: 'medical'},
  {id: 'c_safety', ico: '\uD83D\uDEA8', title: 'Critical safety alerts', sub: 'Alerts for dangerous health values', required: true, defaultOn: true, category: 'medical'},
  {id: 'c_med', ico: '\uD83D\uDC8A', title: 'Medication tracking', sub: 'Track adherence and send reminders', required: false, defaultOn: true, category: 'medical'},
  {id: 'c_symptom', ico: '\uD83D\uDCCB', title: 'Symptom tracking', sub: 'Log symptoms for Ayu pattern analysis', required: false, defaultOn: true, category: 'medical'},
  {id: 'c_doctor', ico: '\uD83E\uDDD1\u200D\u2695\uFE0F', title: 'Doctor sharing (TrustMD)', sub: 'Share records with authorised doctors', required: false, defaultOn: false, category: 'medical'},
  {id: 'c_personal', ico: '\uD83D\uDC65', title: 'Personal data processing', sub: 'Name, contact details, device info', required: true, defaultOn: true, category: 'data'},
  {id: 'c_storage', ico: '\uD83C\uDFD7\uFE0F', title: 'Secure storage (India)', sub: 'AWS Mumbai \u00B7 AES-256 encrypted', required: true, defaultOn: true, category: 'data'},
  {id: 'c_comms', ico: '\uD83D\uDCE7', title: 'Transactional communications', sub: 'Account emails, billing, security alerts', required: true, defaultOn: true, category: 'data'},
  {id: 'c_push', ico: '\uD83D\uDD14', title: 'Push notifications', sub: 'Reminders, Ayu insights, wellness tips', required: false, defaultOn: true, category: 'data'},
  {id: 'c_wearable', ico: '\u23F2\uFE0F', title: 'Wearable sync', sub: 'Apple Health, Fitbit, Garmin', required: false, defaultOn: false, category: 'data'},
  {id: 'c_analytics', ico: '\uD83D\uDCCA', title: 'Anonymised analytics', sub: 'Helps improve TrustLife', required: false, defaultOn: false, category: 'data'},
];

const PASSWORD_REQUIREMENTS = [
  {label: 'At least 8 characters', regex: '.{8,}'},
  {label: 'One uppercase letter', regex: '[A-Z]'},
  {label: 'One lowercase letter', regex: '[a-z]'},
  {label: 'One number', regex: '[0-9]'},
  {label: 'One special character', regex: '[!@#$%^&*]'},
];

const RECOVERY_OPTIONS = [
  {id: 'pw', ico: '\uD83D\uDD11', title: 'Password only', sub: 'Reset your account password', bg: '#EEEDFE'},
  {id: 'pin', ico: '\uD83D\uDD22', title: '6-digit PIN only', sub: 'Reset your health access PIN', bg: '#E6F1FB'},
  {id: 'both', ico: '\uD83D\uDD12', title: 'Reset both', sub: 'Set a new password and a new PIN', bg: '#E1F5EE'},
];

const DELIVERY_METHODS = [
  {id: 'email', ico: '\uD83D\uDCE7', title: 'Email', sub: 'Send code to priya@\u00B7\u00B7\u00B7\u00B7.com', bg: '#E6F1FB'},
  {id: 'sms', ico: '\uD83D\uDCF1', title: 'SMS', sub: 'Send code to +91 984\u00B7\u00B7 \u00B72345', bg: '#E1F5EE'},
  {id: 'whatsapp', ico: '\uD83D\uDCAC', title: 'WhatsApp', sub: 'Send code via WhatsApp', bg: 'rgba(37,211,102,0.08)'},
];

const NUMPAD_KEYS = [
  {val: '1'}, {val: '2', sub: 'ABC'}, {val: '3', sub: 'DEF'},
  {val: '4', sub: 'GHI'}, {val: '5', sub: 'JKL'}, {val: '6', sub: 'MNO'},
  {val: '7', sub: 'PQRS'}, {val: '8', sub: 'TUV'}, {val: '9', sub: 'WXYZ'},
  {val: 'forgot', type: 'action'}, {val: '0'}, {val: 'delete', type: 'delete'},
];

const UPI_APPS = [
  {id: 'gpay', label: 'Google Pay', ico: '\uD83D\uDFE2'},
  {id: 'phonepe', label: 'PhonePe', ico: '\uD83D\uDCB1'},
  {id: 'paytm', label: 'Paytm', ico: '\uD83D\uDCC4'},
  {id: 'upi', label: 'Any UPI ID', ico: '\uD83D\uDCB8'},
];

const BANKS = ['HDFC Bank', 'SBI', 'ICICI Bank', 'Axis Bank', 'Kotak Mahindra', 'Yes Bank', 'PNB', 'IndusInd'];

module.exports = {
  VALUE_PROPS,
  LOGIN_METHODS,
  GENDER_OPTIONS,
  BLOOD_TYPES,
  HEALTH_CONDITIONS,
  DEFAULT_MEDICATIONS,
  MEDICATION_DATABASE,
  PLANS,
  CONSENT_TOGGLES,
  PASSWORD_REQUIREMENTS,
  RECOVERY_OPTIONS,
  DELIVERY_METHODS,
  NUMPAD_KEYS,
  UPI_APPS,
  BANKS,
};
