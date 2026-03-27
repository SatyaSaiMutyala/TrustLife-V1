const TOS_BADGES = [
  {label: 'Medical Disclaimer', bg: 'rgba(226,75,74,0.12)', color: '#E24B4A', border: 'rgba(226,75,74,0.25)'},
  {label: 'DPDP Act 2023', bg: 'rgba(29,158,117,0.12)', color: '#1D9E75', border: 'rgba(29,158,117,0.25)'},
  {label: 'Governing Law: India', bg: 'rgba(233,162,58,0.1)', color: '#E9A23A', border: 'rgba(233,162,58,0.25)'},
  {label: '18 Sections', bg: 'rgba(55,138,221,0.1)', color: '#378ADD', border: 'rgba(55,138,221,0.25)'},
];

const CONTEXTUAL_DISCLAIMERS = [
  {ico: '🩺', tag: 'Health Score / HPS', tagColor: '#E24B4A', bgColor: 'rgba(226,75,74,0.08)', borderColor: 'rgba(226,75,74,0.18)', text: 'Your Health Performance Score is a computed metric based on data you log. It is not a medical diagnosis or clinical health assessment.'},
  {ico: '⚠️', tag: 'Abnormal Results / Alerts', tagColor: '#E9A23A', bgColor: 'rgba(233,162,58,0.08)', borderColor: 'rgba(233,162,58,0.18)', text: 'Alerts for abnormal values are informational flags, not clinical diagnoses. Consult a healthcare professional for evaluation.'},
  {ico: '🍎', tag: 'Lifestyle Recommendations', tagColor: '#1D9E75', bgColor: 'rgba(29,158,117,0.08)', borderColor: 'rgba(29,158,117,0.18)', text: 'Lifestyle suggestions are general wellness information. They are not personalised medical or dietary prescriptions.'},
  {ico: '📋', tag: 'Symptom Tracking', tagColor: '#6C63FF', bgColor: 'rgba(108,99,255,0.08)', borderColor: 'rgba(108,99,255,0.18)', text: 'Symptom logs help you track patterns over time. They do not constitute a symptom assessment or diagnosis.'},
  {ico: '💊', tag: 'Medication Tracking', tagColor: '#A855F7', bgColor: 'rgba(168,85,247,0.08)', borderColor: 'rgba(168,85,247,0.18)', text: 'Medication reminders are based on what you enter. TrustLife does not verify drug interactions, dosages, or contraindications.'},
  {ico: '🔬', tag: 'Lab Result Analysis', tagColor: '#378ADD', bgColor: 'rgba(55,138,221,0.08)', borderColor: 'rgba(55,138,221,0.18)', text: 'Lab result interpretations are informational summaries. They are not clinical pathology reports or diagnostic conclusions.'},
  {ico: '🦴', tag: 'TrustMD / Doctor View', tagColor: '#1D9E75', bgColor: 'rgba(29,158,117,0.08)', borderColor: 'rgba(29,158,117,0.18)', text: 'Data shown to clinicians via TrustMD is patient-reported. It must not be the sole basis for clinical decisions.'},
];

const CRITICAL_THRESHOLDS = [
  {parameter: 'Blood glucose (fasting)', threshold: '< 70 mg/dL or > 400 mg/dL'},
  {parameter: 'Blood pressure', threshold: 'Systolic > 180 mmHg or < 80 mmHg'},
  {parameter: 'Heart rate', threshold: '< 40 bpm or > 150 bpm (resting)'},
  {parameter: 'SpO₂', threshold: '< 90%'},
  {parameter: 'Symptom combinations', threshold: 'Chest pain + breathlessness, sudden severe headache'},
];

const TOS_SECTIONS = [
  {
    num: '1', color: '#378ADD',
    title: 'Acceptance of Terms',
    body: [
      {type: 'p', text: 'By downloading, installing, accessing, or using TrustLife, you agree to be bound by these Terms. If you do not agree, discontinue use immediately.'},
      {type: 'p', text: 'These Terms are a legally binding agreement between you and **TrustLife Health Technologies Pvt Ltd**. You must be at least 18 years of age.'},
      {type: 'info', text: 'Read alongside the TrustLife Privacy Policy (v2.1) and the Consent Manager framework.'},
    ],
  },
  {
    num: '2', color: '#6C63FF',
    title: 'The TrustLife Platform',
    body: [
      {type: 'sh', text: 'What TrustLife is'},
      {type: 'p', text: 'TrustLife is a **health continuity and intelligence platform** for tracking, understanding, and managing your personal health data over time.'},
      {type: 'sh', text: 'What TrustLife is NOT'},
      {type: 'list', dot: '#E24B4A', items: [
        'A healthcare provider, hospital, or clinic',
        'A licensed medical practitioner or physician',
        'A telemedicine or remote diagnostic platform',
        'A prescription service or pharmacy',
        'An emergency medical service',
        'A replacement for professional medical advice, diagnosis, or treatment',
      ]},
      {type: 'p', text: 'TrustLife does not establish a doctor-patient relationship. No communication from TrustLife or Ayu constitutes medical advice or diagnosis.'},
      {type: 'err', text: 'In a medical emergency, call **112** immediately or go to the nearest hospital. Do not consult TrustLife in an emergency.'},
    ],
  },
  {
    num: '3', color: '#E24B4A',
    title: 'Medical Disclaimer — Core Statement',
    body: [
      {type: 'p', text: 'This is the primary medical disclaimer governing all use of TrustLife. By using TrustLife, you acknowledge each of the following:'},
      {type: 'table', headers: ['Statement', 'Your acknowledgement'], rows: [
        ['TrustLife does not diagnose', 'Does not diagnose medical conditions'],
        ['Does not prescribe treatment', 'Does not prescribe or recommend treatments'],
        ['Ayu insights are informational only', 'For awareness not clinical reliance'],
        ['I will consult a doctor', 'Will consult qualified practitioner before any health decision'],
        ['I bear responsibility', 'Any health decision I make is my own'],
      ]},
      {type: 'err', text: '**MANDATORY ADVISORY:** Consult a qualified, registered medical practitioner before initiating, modifying, or discontinuing any medication, treatment, therapy, dietary plan, exercise regimen, or lifestyle intervention.'},
    ],
  },
  {
    num: '4', color: '#E24B4A',
    title: 'Extended Legal Disclaimer',
    body: [
      {type: 'p', text: 'The information, insights, scores, and recommendations generated by TrustLife are intended **solely for informational and awareness purposes**. They are not, and must not be construed as, medical advice, clinical guidance, or a substitute for professional healthcare.'},
      {type: 'sh', text: 'No clinical relationship'},
      {type: 'p', text: 'Use of TrustLife does not create a doctor-patient relationship, therapist-client relationship, or any professional healthcare relationship.'},
      {type: 'sh', text: 'Dependence on user-provided data'},
      {type: 'p', text: 'All outputs are based entirely on data you provide. **If you provide inaccurate, incomplete, or misleading information, TrustLife cannot be held responsible for insights derived from such data.**'},
      {type: 'sh', text: 'User discretion and risk'},
      {type: 'p', text: 'Reliance on any TrustLife information is *solely at the User\'s discretion and risk*. TrustLife expressly disclaims liability for decisions made without independent medical verification.'},
      {type: 'warn', text: 'Symptoms, abnormal values, or concerning trends identified through TrustLife must be evaluated by a qualified healthcare professional.'},
    ],
  },
  {
    num: '5', color: '#A855F7',
    title: 'Ayu Intelligence — Scope and Limitations',
    body: [
      {type: 'p', text: '**Ayu** is TrustLife\'s AI-powered health intelligence layer. Ayu processes your logged data to generate personalised insights, identify trends, issue reminders, and provide contextual health information.'},
      {type: 'sh', text: 'Scope of Ayu outputs'},
      {type: 'table', headers: ['Ayu capability', 'What it IS', 'What it is NOT'], rows: [
        ['Trend analysis', 'How your metrics change over time', 'Clinical diagnosis'],
        ['Pattern recognition', 'Patterns across your logged data', 'Disease screening'],
        ['Lifestyle suggestions', 'General wellness information', 'Medical prescriptions'],
        ['Medication reminders', 'Reminders based on what you enter', 'Verification of medication safety'],
        ['Health scores', 'Scores computed from tracked data', 'A medically validated health status'],
      ]},
      {type: 'sh', text: 'Misinformation liability'},
      {type: 'p', text: 'Ayu generates insights **exclusively from information you provide**. TrustLife and Ayu **cannot be held responsible for insights derived from inaccurate, incomplete, or misleading data.**'},
      {type: 'err', text: 'Ayu\'s intelligence is only as good as the data you provide. TrustLife is not liable for outputs generated from data that is inaccurate, falsified, misrepresented, or incorrectly entered by the User.'},
      {type: 'sh', text: 'AI limitations'},
      {type: 'list', dot: '#1D9E75', items: [
        'Ayu does not have access to your complete medical history unless you provide it.',
        'Ayu cannot replicate a clinical physical examination.',
        'Ayu cannot account for drug interactions or comorbidities not in your inputs.',
        'AI systems can make errors. All Ayu outputs should be reviewed with a healthcare professional for any clinical relevance.',
      ]},
    ],
  },
  {
    num: '6', color: '#1D9E75',
    title: 'User Responsibilities and Accurate Information',
    body: [
      {type: 'sh', text: 'Your obligations'},
      {type: 'list', dot: '#1D9E75', items: [
        '**Accuracy:** Provide accurate, current, complete health information. Update your profile when material changes occur.',
        '**Medical supervision:** Consult a medical professional before any health decision based on TrustLife outputs.',
        '**Emergency awareness:** Do not rely on TrustLife in a medical emergency.',
        '**Medication safety:** Never start, stop, or alter any medication without consulting your prescribing doctor.',
        '**Honest reporting:** Do not enter fabricated or third-party health data as your own.',
      ]},
      {type: 'sh', text: 'Prohibited uses'},
      {type: 'list', dot: '#E24B4A', items: [
        'Using TrustLife to diagnose or treat another person without their consent.',
        'Using TrustLife outputs as evidence in legal or insurance proceedings without independent medical verification.',
        'Uploading fabricated diagnostic documents or false health records.',
        'Attempting to reverse-engineer TrustLife\'s AI models or algorithms.',
      ]},
    ],
  },
  {
    num: '7', color: '#F59E0B',
    title: 'Limitation of Liability',
    body: [
      {type: 'sh', text: 'No warranty'},
      {type: 'p', text: 'TrustLife is provided "as is". TrustLife expressly disclaims all warranties including fitness for a particular purpose, accuracy of health insights, and uninterrupted service.'},
      {type: 'sh', text: 'Liability cap'},
      {type: 'p', text: 'TrustLife\'s total aggregate liability shall not exceed the amount paid by you in the three calendar months immediately preceding the event giving rise to the claim.'},
      {type: 'sh', text: 'Excluded damages'},
      {type: 'list', dot: '#E24B4A', items: [
        'Physical harm or death arising from reliance on TrustLife outputs without medical verification.',
        'Health deterioration from delayed medical consultation due to TrustLife reliance.',
        'Financial loss arising from health decisions based on TrustLife outputs.',
      ]},
      {type: 'warn', text: '**Medical reliance warning:** TrustLife expressly disclaims liability for any physical harm or adverse outcome arising from reliance on TrustLife outputs without independent medical consultation.'},
      {type: 'sh', text: 'Indemnification'},
      {type: 'p', text: 'You agree to indemnify TrustLife from claims arising from: inaccurate information you provide; health decisions you make based on TrustLife outputs; or violation of applicable law.'},
    ],
  },
  {
    num: '8', color: '#E24B4A',
    title: 'High-Risk Health Events — Critical Safety Protocol',
    body: [
      {type: 'p', text: 'When TrustLife detects inputs that may indicate a potentially serious health condition, a **Critical Safety Alert** is triggered.'},
      {type: 'critical'},
      {type: 'sh', text: 'Conditions triggering a Critical Safety Alert'},
      {type: 'thresholds'},
      {type: 'err', text: 'Critical Safety Alerts are NOT medical diagnoses. Only emergency medical services and qualified professionals can evaluate a medical emergency.'},
    ],
  },
  {
    num: '9', color: '#6C63FF',
    title: 'Contextual Disclaimers by Module',
    body: [
      {type: 'p', text: 'These micro-disclaimers appear dynamically within the relevant app sections:'},
      {type: 'disclaimers'},
    ],
  },
  {
    num: '10', color: '#1D9E75',
    title: 'TrustMD — Clinical Data Disclaimer',
    body: [
      {type: 'p', text: 'TrustMD is TrustLife\'s healthcare provider interface allowing consented clinicians to view a patient\'s health data record.'},
      {type: 'sh', text: 'Nature of data presented'},
      {type: 'p', text: 'All TrustMD data is **patient-reported and system-aggregated**. It represents what the user has logged or uploaded — TrustLife does not independently verify its accuracy.'},
      {type: 'sh', text: 'Clinical decision responsibility'},
      {type: 'p', text: 'Healthcare professionals must base all clinical decisions on their own professional judgment and independent evaluation. TrustLife does not represent the completeness, accuracy, or clinical sufficiency of data presented.'},
      {type: 'err', text: '**For healthcare professionals:** TrustLife data is a supplementary reference only. It must not be the sole basis for diagnosis, treatment, prescription, or clinical decision-making.'},
    ],
  },
  {
    num: '11', color: '#378ADD',
    title: 'Consent — DPDP-Aligned Framework',
    body: [
      {type: 'sh', text: 'First-use consent'},
      {type: 'p', text: 'Before first use, you must accept the following consent statement:'},
      {type: 'consent', text: 'I understand that TrustLife is a health intelligence platform and not a medical service provider. I agree to use this platform for informational purposes and will consult qualified medical professionals for any diagnosis and treatment decisions. I understand that insights and recommendations provided by Ayu are not medical advice.'},
      {type: 'sh', text: 'DPDP Act 2023 alignment'},
      {type: 'p', text: 'All consents are governed by the Digital Personal Data Protection Act, 2023. Consent is freely given, specific, informed, and revocable at any time through the Consent Manager.'},
    ],
  },
  {
    num: '12', color: '#F59E0B',
    title: 'Data Accuracy and Informational Integrity',
    body: [
      {type: 'p', text: 'The integrity of all TrustLife outputs depends entirely on the accuracy of User-provided data. TrustLife does not independently verify health conditions, medications, diagnostic results, or biometric readings you enter.'},
      {type: 'sh', text: 'TrustLife is not liable for outputs derived from data that is:'},
      {type: 'list', dot: '#E24B4A', items: [
        'Inaccurate or incorrect at the time of entry',
        'Outdated or not kept current by the User',
        'Entered for a person other than the account holder',
        'Fabricated, falsified, or entered in bad faith',
        'Incomplete or missing critical contextual information',
      ]},
      {type: 'warn', text: '**Important:** Ayu\'s intelligence is only as good as the data you provide. TrustLife cannot detect deliberate misrepresentation and is not liable for insights derived from such inputs.'},
    ],
  },
  {
    num: '13', color: '#6C63FF',
    title: 'Intellectual Property',
    body: [
      {type: 'p', text: 'TrustLife, Ayu, and all associated algorithms, models, interfaces, and brand elements are the exclusive intellectual property of TrustLife Health Technologies Pvt Ltd.'},
      {type: 'p', text: 'TrustLife grants you a limited, non-exclusive, non-transferable, revocable licence for personal, non-commercial health management purposes. **Your personal health records belong to you — TrustLife claims no ownership over your personal health data.**'},
    ],
  },
  {
    num: '14', color: '#22C55E',
    title: 'Account and Access',
    body: [
      {type: 'list', dot: '#1D9E75', items: [
        'Access requires an account with accurate personal information.',
        'You are responsible for maintaining the confidentiality of your credentials.',
        'Notify TrustLife immediately at security@trustlife.in if you suspect unauthorised access.',
        'Accounts may not be shared. Each account is for individual use only.',
      ]},
    ],
  },
  {
    num: '15', color: '#E24B4A',
    title: 'Termination',
    body: [
      {type: 'p', text: 'You may delete your TrustLife account at any time through app settings. Upon deletion, your health data will be processed as described in the Privacy Policy (Section 8).'},
      {type: 'p', text: 'TrustLife may suspend or terminate access if you breach these Terms or use TrustLife for unlawful purposes. Termination does not affect the medical disclaimer obligations — they apply regardless of account status.'},
    ],
  },
  {
    num: '16', color: '#378ADD',
    title: 'Governing Law and Dispute Resolution',
    body: [
      {type: 'p', text: 'These Terms are governed by the laws of India. The courts of Hyderabad, Telangana have exclusive jurisdiction.'},
      {type: 'sh', text: 'Dispute resolution process'},
      {type: 'list', dot: '#1D9E75', items: [
        '**1.** Contact TrustLife at legal@trustlife.in — informal resolution within 30 days.',
        '**2.** If unresolved, disputes referred to mediation under the Mediation Act, 2023.',
        '**3.** Remaining disputes proceed to arbitration under the Arbitration and Conciliation Act, 1996.',
      ]},
    ],
  },
  {
    num: '17', color: '#E9A23A',
    title: 'Amendments and Notification',
    body: [
      {type: 'p', text: 'Material changes will be notified via in-app notice at least 30 days before taking effect, along with an email to your registered address. For changes affecting the medical disclaimer or liability provisions, fresh explicit consent is required.'},
    ],
  },
  {
    num: '18', color: '#1D9E75',
    title: 'Contact and Grievance',
    body: [
      {type: 'sh', text: 'Legal queries'},
      {type: 'p', text: '**legal@trustlife.in**'},
      {type: 'sh', text: 'Grievance Officer (DPDP Act 2023)'},
      {type: 'p', text: '**Venkata Cherukuri**, Founder & CEO\nprivacy@trustlife.in · Hyderabad, Telangana 500032'},
      {type: 'sh', text: 'Medical safety'},
      {type: 'err', text: 'In any medical emergency, call **112** or visit the nearest hospital immediately. Do not use TrustLife as an emergency resource.'},
    ],
  },
];

module.exports = {TOS_BADGES, CONTEXTUAL_DISCLAIMERS, CRITICAL_THRESHOLDS, TOS_SECTIONS};
