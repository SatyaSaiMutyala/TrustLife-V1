const PROFILE_SUMMARY = {
  firstName: 'Priya',
  lastName: 'Raghunathan',
  dob: '14 March 1987',
  age: 38,
  gender: 'Female',
  bloodGroup: 'O+',
  nationality: 'Indian',
  email: 'priya.r@example.com',
  phone: '+91 98400 55210',
  maritalStatus: 'Married',
  memberId: 'PRF-40291',
  memberSince: 'January 2020',
  bio: 'Software engineer. Mother of two. Health-conscious.',
  address: {
    street: 'Plot 14, Jubilee Hills Road 36',
    city: 'Hyderabad',
    state: 'Telangana',
    pin: '500033',
    country: 'India',
  },
};

const OVERVIEW_STATS = [
  {value: '3', label: 'Dependents'},
  {value: '4', label: 'Years Active'},
  {value: '98%', label: 'Profile Complete'},
  {value: '2', label: 'Linked Accounts'},
];

const RECENT_ACTIVITY = [
  {text: 'Profile photo updated', time: 'Today, 10:24 AM'},
  {text: 'Dependent Aryan Raghunathan added as Minor', time: '2 days ago'},
  {text: 'Password changed successfully', time: '14 March 2025'},
  {text: 'Two-factor authentication enabled', time: '2 Feb 2025'},
];

const DEPENDENTS = [
  {initials: 'Z', name: 'Zara Raghunathan', relation: 'Daughter', category: 'infant', dob: '12 Sep 2024', age: '6 months', blood: 'O+', id: 'BC-2024-09121', extra: 'PED-40291-01'},
  {initials: 'A', name: 'Aryan Raghunathan', relation: 'Son', category: 'minor', dob: '3 Jul 2017', age: '7 years', blood: 'A+', id: 'BC-2017-07031', school: 'Delhi Public School'},
  {initials: 'R', name: 'Riya Raghunathan', relation: 'Daughter', category: 'minor', dob: '19 Nov 2012', age: '13 years', blood: 'B+', id: 'BC-2012-11191', school: 'Oakridge International'},
];

const SECURITY_ITEMS = [
  {icon: '\uD83D\uDD12', title: 'Password', desc: 'Last changed 14 March 2025', status: 'Change', statusType: 'action', bg: 'green'},
  {icon: '\uD83D\uDCF1', title: 'Two-Factor Authentication', desc: 'Authenticator app — added 2 Feb 2025', status: 'Enabled', statusType: 'enabled', bg: 'green'},
  {icon: '\u2709\uFE0F', title: 'Email Verification', desc: 'priya.r@example.com', status: 'Pending', statusType: 'warning', bg: 'amber'},
  {icon: '\uD83D\uDDA5\uFE0F', title: 'Active Sessions', desc: '2 devices currently signed in', status: 'Manage', statusType: 'action', bg: 'rose'},
  {icon: '\uD83D\uDEE1\uFE0F', title: 'Login Alerts', desc: 'Get notified of new sign-ins', status: 'Enabled', statusType: 'enabled', bg: 'green'},
];

const EMERGENCY_CONTACTS = [
  {
    priority: 1, initials: 'KR', name: 'Karthik Raghunathan', relation: 'Spouse — Lives at same address',
    authority: 'Full medical authority', authorityType: 'full',
    mobile: '+91 98401 77350', whatsapp: '+91 98401 77350', email: 'karthik.r@example.com',
    workPhone: '+91 40 6612 3300', availability: '24 / 7 — reachable anytime', language: 'Telugu, English, Hindi',
    notes: 'Authorised to give consent for all medical procedures including surgery. Has copies of all insurance documents. Blood group A+.',
  },
  {
    priority: 2, initials: 'SR', name: 'Sunita Raghunathan', relation: 'Mother-in-law — Hyderabad',
    authority: 'Medical decisions — children', authorityType: 'med',
    mobile: '+91 98491 23456', altPhone: '+91 40 2342 8800 (landline)',
    address: 'Banjara Hills, Hyderabad — 4.2 km', availability: 'Daytime preferred (7 AM — 9 PM)',
    language: 'Telugu, Hindi', mobility: 'Can travel — has own vehicle',
    notes: 'Secondary guardian for all three children. Can pick up children from school in an emergency.',
  },
  {
    priority: 3, initials: 'AN', name: 'Ananya Nair', relation: 'Close friend — Same apartment complex',
    authority: 'Notify only', authorityType: 'info',
    mobile: '+91 98450 98765', whatsapp: '+91 98450 98765',
    proximity: 'Block B, same building — 2 min walk', availability: 'Evenings and weekends reliable',
    notes: 'Can assist with childcare. Contact if Karthik and Sunita are both unreachable. No medical authority.',
  },
];

const EMERGENCY_NUMBERS = [
  {number: '108', label: 'Ambulance', color: '#9B3A4A'},
  {number: '100', label: 'Police', color: '#1A5276'},
  {number: '104', label: 'Health Helpline', color: '#B5600E'},
  {number: '102', label: 'Women Helpline', color: '#9B3A4A'},
  {number: '1098', label: 'Child Helpline', color: '#2D6A4F'},
  {number: '112', label: 'National Emergency', color: '#B5600E'},
];

const DOCTORS = [
  {initials: 'RM', name: 'Dr. Rekha Menon', spec: 'General Practitioner — MBBS, MD', hospital: 'Apollo Hospitals, Jubilee Hills', tag: 'Primary / Family Doctor', color: 'green', phone: '+91 40 6682 1234', lastVisit: '14 Jan 2026', nextVisit: '14 Jul 2026'},
  {initials: 'SI', name: 'Dr. Suresh Iyer', spec: 'Endocrinologist — MBBS, DM', hospital: 'KIMS Hospitals, Secunderabad', tag: 'Specialist', color: 'purple', phone: '+91 40 2724 3000', lastVisit: 'Sep 2025', nextVisit: 'Mar 2026'},
  {initials: 'PK', name: 'Dr. Preethi Krishnan', spec: 'Paediatrician — MBBS, DCH, MD', hospital: 'Rainbow Children\'s Hospital', tag: 'Specialist — children', color: 'blue', phone: '+91 40 6677 7777', lastVisit: 'Feb 2026', nextVisit: 'Apr 2026'},
  {initials: 'LS', name: 'Dr. Lakshmi Srinivas', spec: 'OB/GYN — MS (OBG)', hospital: 'Apollo Hospitals, Jubilee Hills', tag: 'Specialist', color: 'rose', phone: '+91 40 6682 1500', lastVisit: 'Dec 2025', nextVisit: 'Annual'},
  {initials: 'VN', name: 'Venkat Narasimha, MPT', spec: 'Senior Physiotherapist — MPT', hospital: 'PhysioFirst Clinic, Film Nagar', tag: 'Therapist', color: 'amber', phone: '+91 40 2345 7890', lastVisit: '4 Mar 2026', nextVisit: '18 Mar 2026'},
];

const PREFERRED_FACILITIES = [
  {label: 'Preferred Hospital', name: 'Apollo Hospitals, Jubilee Hills', sub: '2.1 km — ER available 24/7', phone: '+91 40 6682 1000'},
  {label: 'Preferred Pharmacy', name: 'Apollo Pharmacy, Jubilee Hills', sub: '0.6 km — Open 7 AM — 11 PM', phone: '+91 40 6682 2500'},
  {label: 'Diagnostic Lab', name: 'Dr. Lal PathLabs', sub: '1.4 km — Home collection available', phone: '+91 40 4040 1111'},
  {label: 'Health Insurance', name: 'Star Health — Family Floater', sub: 'Policy #SH-2024-HYD-882291 — Cover \u20B910L', phone: '1800 425 2255 (toll-free)'},
];

const VITALS = [
  {value: '163', unit: 'cm', label: 'Height', status: null},
  {value: '61', unit: 'kg', label: 'Weight', status: 'Normal'},
  {value: '23.0', unit: 'kg/m\u00B2', label: 'BMI', status: 'Normal'},
  {value: '118/78', unit: 'mmHg', label: 'Blood Pressure', status: 'Normal'},
  {value: '72', unit: 'bpm', label: 'Resting HR', status: 'Normal'},
  {value: '97', unit: '% SpO\u2082', label: 'Oxygen Saturation', status: 'Normal'},
  {value: '5.4', unit: '%', label: 'HbA1c', status: 'Normal'},
  {value: '185', unit: 'mg/dL', label: 'Total Cholesterol', status: 'Borderline', statusWarn: true},
];

const CONDITIONS = [
  {icon: '\uD83E\uDDA0', name: 'Hypothyroidism', meta: 'Diagnosed 2019 — Dr. Suresh Iyer', stage: 'Managed — medication', stageType: 'managed', bg: '#FDF3E7'},
  {icon: '\uD83C\uDF3F', name: 'Seasonal Allergic Rhinitis', meta: 'Diagnosed 2015 — dust mites, pollen', stage: 'Active — seasonal', stageType: 'active', bg: '#EAF2FB'},
  {icon: '\u2764\uFE0F', name: 'Mild Dyslipidaemia', meta: 'Identified Jan 2026 — cholesterol 185', stage: 'Under observation', stageType: 'monitor', bg: '#FAEAED'},
  {icon: '\uD83E\uDDB4', name: 'Lower Back Pain (non-specific)', meta: 'Onset 2022 — occupational', stage: 'Managed — physio', stageType: 'managed', bg: '#F2EFE8'},
];

const MEDICATIONS_LIST = [
  {name: 'Levothyroxine', dose: '50 mcg', freq: 'Daily — morning, fasting', forCondition: 'Hypothyroidism', since: '2019'},
  {name: 'Cetirizine HCl', dose: '10 mg', freq: 'PRN (as needed)', forCondition: 'Allergic rhinitis', since: '2015'},
  {name: 'Vitamin D3', dose: '2000 IU', freq: 'Daily', forCondition: 'Deficiency prevention', since: '2023'},
];

const ALLERGIES = [
  {allergen: 'Penicillin', type: 'Drug', reaction: 'Skin rash, urticaria', severity: 'Moderate', sevType: 'active'},
  {allergen: 'Dust Mites', type: 'Environmental', reaction: 'Rhinitis, sneezing', severity: 'Mild', sevType: 'monitor'},
  {allergen: 'Pollen (seasonal)', type: 'Environmental', reaction: 'Rhinitis, watery eyes', severity: 'Mild', sevType: 'monitor'},
];

const SURGICAL_HISTORY = [
  {year: '2024', desc: 'Caesarean section (LSCS) — Zara\'s birth — Apollo Hospitals'},
  {year: '2021', desc: 'Appendectomy (laparoscopic) — KIMS Hospital, Hyderabad'},
  {year: '2015', desc: 'Tonsillitis (recurrent) — conservative management, no surgery'},
];

const IMMUNISATIONS = [
  {vaccine: 'COVID-19 (Covishield)', lastDose: 'Oct 2023 (booster)', status: 'Up to date', statusType: 'managed'},
  {vaccine: 'Influenza', lastDose: 'Dec 2024', status: 'Up to date', statusType: 'managed'},
  {vaccine: 'Hepatitis B', lastDose: 'Full series — 2005', status: 'Complete', statusType: 'resolved'},
  {vaccine: 'Tdap (tetanus)', lastDose: '2018', status: 'Due 2028', statusType: 'monitor'},
  {vaccine: 'HPV', lastDose: 'Full series — 2010', status: 'Complete', statusType: 'resolved'},
];

const PROFILE_TABS = [
  {key: 'overview', label: 'Overview'},
  {key: 'personal', label: 'Personal Info'},
  {key: 'contact', label: 'Contact'},
  {key: 'dependents', label: 'Dependents'},
  {key: 'security', label: 'Security'},
  {key: 'preferences', label: 'Preferences'},
  {key: 'lifestyle', label: 'Lifestyle'},
  {key: 'health', label: 'Health'},
  {key: 'family', label: 'Family History'},
  {key: 'environment', label: 'Environment'},
  {key: 'reproductive', label: 'Reproductive'},
  {key: 'dental', label: 'Dental'},
  {key: 'vision', label: 'Vision & Hearing'},
  {key: 'genetic', label: 'Genetics'},
  {key: 'digital', label: 'Digital Health'},
  {key: 'bodycomp', label: 'Body Composition'},
  {key: 'supplements', label: 'Supplements'},
  {key: 'insurance', label: 'Insurance'},
  {key: 'goals', label: 'Goals'},
];

module.exports = {
  PROFILE_SUMMARY,
  OVERVIEW_STATS,
  RECENT_ACTIVITY,
  DEPENDENTS,
  SECURITY_ITEMS,
  EMERGENCY_CONTACTS,
  EMERGENCY_NUMBERS,
  DOCTORS,
  PREFERRED_FACILITIES,
  VITALS,
  CONDITIONS,
  MEDICATIONS_LIST,
  ALLERGIES,
  SURGICAL_HISTORY,
  IMMUNISATIONS,
  PROFILE_TABS,
};
