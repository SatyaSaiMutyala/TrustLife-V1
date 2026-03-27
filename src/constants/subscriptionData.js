const CURRENT_PLAN = {
  name: 'Pro',
  price: 299,
  freq: 'month',
  startDate: '15 Jan 2025',
  renewDate: '15 Apr 2026',
  status: 'active',
  autoRenew: true,
  features: ['Unlimited exports', 'Advanced Ayu', 'Lab analysis', 'Wearable sync', 'Priority support'],
};

const INVOICES = [
  {id: 'INV-2026-003', date: '15 Mar 2026', period: '15 Mar \u2013 14 Apr 2026', plan: 'Pro', amt: 299, status: 'paid', method: 'HDFC Visa \u00B7\u00B7\u00B7\u00B7 4291', coins: 0, gst: 53.82},
  {id: 'INV-2026-002', date: '15 Feb 2026', period: '15 Feb \u2013 14 Mar 2026', plan: 'Pro', amt: 299, status: 'paid', method: 'HDFC Visa \u00B7\u00B7\u00B7\u00B7 4291', coins: 0, gst: 53.82},
  {id: 'INV-2026-001', date: '15 Jan 2026', period: '15 Jan \u2013 14 Feb 2026', plan: 'Pro', amt: 299, status: 'paid', method: 'HDFC Visa \u00B7\u00B7\u00B7\u00B7 4291', coins: 0, gst: 53.82},
  {id: 'INV-2025-012', date: '15 Dec 2025', period: '15 Dec \u2013 14 Jan 2026', plan: 'Pro', amt: 299, status: 'paid', method: 'HDFC Visa \u00B7\u00B7\u00B7\u00B7 4291', coins: 0, gst: 53.82},
  {id: 'INV-2025-011', date: '15 Nov 2025', period: '15 Nov \u2013 14 Dec 2025', plan: 'Pro', amt: 299, status: 'paid', method: 'HDFC Visa \u00B7\u00B7\u00B7\u00B7 4291', coins: 0, gst: 53.82},
  {id: 'INV-2025-010', date: '15 Oct 2025', period: '15 Oct \u2013 14 Nov 2025', plan: 'Pro', amt: 249, status: 'paid', method: 'HDFC Visa \u00B7\u00B7\u00B7\u00B7 4291', coins: 500, gst: 44.82, coinNote: '500 coins applied (1 month discount)'},
  {id: 'INV-2025-009', date: '15 Sep 2025', period: '15 Sep \u2013 14 Oct 2025', plan: 'Pro', amt: 299, status: 'paid', method: 'GPay UPI', coins: 0, gst: 53.82},
  {id: 'INV-2025-008', date: '15 Aug 2025', period: '15 Aug \u2013 14 Sep 2025', plan: 'Pro', amt: 299, status: 'paid', method: 'GPay UPI', coins: 0, gst: 53.82},
  {id: 'INV-2025-007', date: '15 Jul 2025', period: '15 Jul \u2013 14 Aug 2025', plan: 'Pro', amt: 299, status: 'paid', method: 'GPay UPI', coins: 0, gst: 53.82},
  {id: 'INV-2025-006', date: '15 Jun 2025', period: '15 Jun \u2013 14 Jul 2025', plan: 'Basic', amt: 0, status: 'free', method: '\u2014', coins: 0, gst: 0, note: 'Free trial \u2013 upgrade month'},
  {id: 'INV-2025-005', date: '15 May 2025', period: '15 May \u2013 14 Jun 2025', plan: 'Basic', amt: 0, status: 'free', method: '\u2014', coins: 0, gst: 0},
  {id: 'INV-2025-004', date: '15 Apr 2025', period: '15 Apr \u2013 14 May 2025', plan: 'Basic', amt: 0, status: 'free', method: '\u2014', coins: 0, gst: 0},
  {id: 'INV-2025-003', date: '15 Mar 2025', period: '15 Mar \u2013 14 Apr 2025', plan: 'Basic', amt: 0, status: 'free', method: '\u2014', coins: 0, gst: 0},
  {id: 'INV-2025-002', date: '15 Feb 2025', period: '15 Feb \u2013 14 Mar 2025', plan: 'Basic', amt: 0, status: 'free', method: '\u2014', coins: 0, gst: 0},
  {id: 'INV-2025-001', date: '15 Jan 2025', period: '15 Jan \u2013 14 Feb 2025', plan: 'Basic', amt: 0, status: 'free', method: '\u2014', coins: 0, gst: 0, note: 'Welcome \u2013 account created'},
];

const PAYMENT_METHODS = [
  {id: 'pm1', type: 'visa', last4: '4291', bank: 'HDFC Bank', expiry: '09/26', isDefault: true},
  {id: 'pm2', type: 'upi', upiId: 'priya@ybl', bank: 'Yes Bank', isDefault: false},
];

const USAGE_DATA = [
  {label: 'Health records stored', used: 47, max: null, unit: 'records', color: '#1D9E75'},
  {label: 'Data exports this month', used: 3, max: null, unit: 'exports', color: '#378ADD'},
  {label: 'Ayu sessions this month', used: 28, max: null, unit: 'sessions', color: '#6C63FF'},
  {label: 'Active consent grants', used: 3, max: 10, unit: 'grants', color: '#F59E0B'},
  {label: 'Connected devices', used: 1, max: 5, unit: 'devices', color: '#A855F7'},
  {label: 'Wearable syncs (30 days)', used: 180, max: null, unit: 'syncs', color: '#22C55E'},
];

const STORAGE_BREAKDOWN = [
  {label: 'Lab reports & diagnostics', count: 18, color: '#f43f5e'},
  {label: 'Medication history', count: 12, color: '#A855F7'},
  {label: 'Sleep & activity logs', count: 8, color: '#6C63FF'},
  {label: 'Nutrition entries', count: 5, color: '#22C55E'},
  {label: 'Blood glucose readings', count: 4, color: '#F0B429'},
];

const ACCESS_STATS = [
  {label: 'Dr. Mehta views', count: 34, color: '#378ADD'},
  {label: 'Pharmacy syncs', count: 18, color: '#E24B4A'},
  {label: 'Ayu analyses', count: 842, color: '#6C63FF'},
];

const HISTORY_EVENTS = [
  {color: '#1D9E75', head: 'Upgraded to Pro', sub: 'Monthly plan at \u20B9299/month', date: '15 Jul 2025'},
  {color: '#378ADD', head: 'Payment method changed', sub: 'Added HDFC Visa \u00B7\u00B7\u00B7\u00B7 4291', date: '10 Sep 2025'},
  {color: '#E9A23A', head: '500 coins redeemed', sub: 'Applied \u20B950 discount to Oct invoice', date: '15 Oct 2025'},
  {color: '#6C63FF', head: 'Auto-renew confirmed', sub: 'Pro plan continuing \u2013 no action needed', date: '15 Jan 2026'},
  {color: '#22C55E', head: 'Anniversary milestone', sub: '1 year \u2013 3000 coins awarded', date: '15 Jan 2026'},
  {color: '#378ADD', head: 'Billing cycle maintained', sub: 'Pro plan renewed at \u20B9299', date: '15 Mar 2026'},
];

const PLANS = [
  {
    name: 'Basic', price: 0, freq: 'Free forever', color: '#378ADD', bg: '#E6F1FB', border: 'rgba(55,138,221,0.2)', current: false,
    features: ['Health timeline', 'Medication tracking', '5 exports/year', 'Basic Ayu insights'],
    missing: ['Unlimited exports', 'Advanced Ayu', 'Lab analysis', 'Wearable sync', 'Priority support'],
  },
  {
    name: 'Pro', price: 299, freq: '/month', color: '#1D9E75', bg: '#E1F5EE', border: 'rgba(29,158,117,0.3)', current: true,
    features: ['Everything in Basic', 'Unlimited exports', 'Advanced Ayu coaching', 'Lab result analysis', 'Wearable sync', 'Priority support'],
    missing: [],
  },
  {
    name: 'Pro Annual', price: 2390, freq: '/year', color: '#E9A23A', bg: '#FAEEDA', border: 'rgba(233,162,58,0.25)', current: false, badge: 'Save \u20B91198',
    features: ['Everything in Pro', '2 months free', 'Annual health PDF', 'Dedicated Ayu persona'],
    missing: [],
  },
  {
    name: 'Family', price: 499, freq: '/month', color: '#A855F7', bg: '#EEEDFE', border: 'rgba(168,85,247,0.2)', current: false, badge: 'Up to 5 members',
    features: ['Up to 5 profiles', 'Family health dashboard', 'Caregiver access', 'Shared insights'],
    missing: [],
  },
];

const CANCEL_REASONS = [
  'Too expensive',
  'Not using it enough',
  'Missing a specific feature',
  'Switching to another app',
  'Taking a health break',
  'Other reason',
];

module.exports = {
  CURRENT_PLAN,
  INVOICES,
  PAYMENT_METHODS,
  USAGE_DATA,
  STORAGE_BREAKDOWN,
  ACCESS_STATS,
  HISTORY_EVENTS,
  PLANS,
  CANCEL_REASONS,
};
