const REWARDS_TABS = [
  {key: 'earn', label: 'Earn'},
  {key: 'challenges', label: 'Challenges'},
  {key: 'badges', label: 'Badges'},
  {key: 'redeem', label: 'Redeem'},
];

const CHALLENGES = [
  {id:'c01', cat:'consistency', ico:'\uD83D\uDD25', col:'#ef4444', name:'90-Day Tracking Streak', desc:'Log health data every day for 90 days', reward:1500, progress:62, total:90, status:'active'},
  {id:'c02', cat:'consistency', ico:'\uD83D\uDC8A', col:'#a855f7', name:'Perfect Medication Adherence', desc:'Take every medication on time for 30 days', reward:800, progress:22, total:30, status:'active'},
  {id:'c03', cat:'consistency', ico:'\uD83D\uDE34', col:'#6366f1', name:'Sleep Consistency Month', desc:'Hit sleep target 21 of 30 days', reward:600, progress:21, total:21, status:'claimable'},
  {id:'c04', cat:'consistency', ico:'\uD83E\uDD57', col:'#22c55e', name:'Nutritional Logging 60 Days', desc:'Log every meal for 60 consecutive days', reward:1000, progress:14, total:60, status:'active'},
  {id:'c05', cat:'biomarker', ico:'\uD83E\uDE78', col:'#f43f5e', name:'HbA1c Improvement', desc:'HbA1c drops 0.5%+ across two reports', reward:2000, progress:100, total:100, status:'done'},
  {id:'c06', cat:'biomarker', ico:'\u2764\uFE0F', col:'#f43f5e', name:'BP Under Control 8 Weeks', desc:'Average BP below 130/85 for 8 weeks', reward:1200, progress:4, total:8, status:'active'},
  {id:'c07', cat:'biomarker', ico:'\u2696\uFE0F', col:'#3b82f6', name:'Steady Weight 60 Days', desc:'Weight within 1kg of goal for 60 days', reward:900, progress:0, total:60, status:'locked'},
  {id:'c08', cat:'loyalty', ico:'\u2B50', col:'#f0b429', name:'6-Month Member', desc:'Active paid member for 6 months', reward:1000, progress:100, total:100, status:'done'},
  {id:'c09', cat:'loyalty', ico:'\uD83C\uDFC6', col:'#f0b429', name:'1-Year Anniversary', desc:'One year as a TrustLife member', reward:3000, progress:73, total:100, status:'active'},
  {id:'c10', cat:'promo', ico:'\uD83C\uDFAF', col:'#1D9E75', name:'Ayu Onboarding Complete', desc:'Complete full health profile and first check-in', reward:300, progress:100, total:100, status:'done'},
];

const BADGES = [
  {id:'b01', ico:'\uD83D\uDD25', name:'Streak Keeper', col:'#ef4444', earned:true, date:'Feb 2026', desc:'30-day logging streak'},
  {id:'b02', ico:'\uD83D\uDC8A', name:'Med Champion', col:'#a855f7', earned:true, date:'Mar 2026', desc:'Perfect medication adherence 14 days'},
  {id:'b03', ico:'\uD83E\uDE78', name:'Glucose Guardian', col:'#f43f5e', earned:true, date:'Jan 2026', desc:'HbA1c improved 0.5%+'},
  {id:'b04', ico:'\u2764\uFE0F', name:'BP Warrior', col:'#ef4444', earned:false, date:null, desc:'BP under 130/85 for 8 weeks'},
  {id:'b05', ico:'\uD83D\uDE34', name:'Sleep Scholar', col:'#6366f1', earned:true, date:'Mar 2026', desc:'Sleep target 21/30 days'},
  {id:'b06', ico:'\uD83E\uDD57', name:'Nutrition Ninja', col:'#22c55e', earned:false, date:null, desc:'All meals logged 60 days'},
  {id:'b07', ico:'\u2B50', name:'Loyal Member', col:'#f0b429', earned:true, date:'Jul 2025', desc:'6-month paid member'},
  {id:'b08', ico:'\uD83D\uDEB6', name:'Movement Master', col:'#3b82f6', earned:false, date:null, desc:'10K steps/day avg over 30 days'},
  {id:'b09', ico:'\uD83C\uDF3F', name:'Ayu Disciple', col:'#1D9E75', earned:true, date:'Jan 2026', desc:'Completed Ayu onboarding'},
  {id:'b10', ico:'\uD83C\uDFC6', name:'Anniversary', col:'#f0b429', earned:false, date:null, desc:'1-year member'},
];

const MILESTONES = [
  {id:'m01', ico:'\uD83C\uDF31', name:'First week complete', desc:'7 days of health logging', coins:50, claimed:true},
  {id:'m02', ico:'\uD83D\uDCC5', name:'30-day member', desc:'Active for 30 days', coins:150, claimed:true},
  {id:'m03', ico:'\uD83C\uDFDE\uFE0F', name:'90-day member', desc:'Real habit formed', coins:400, claimed:true},
  {id:'m04', ico:'\u2B50', name:'6-month milestone', desc:'Half a year of health continuity', coins:1000, claimed:true},
  {id:'m05', ico:'\uD83C\uDFC6', name:'1-year anniversary', desc:'Full year health journey', coins:3000, claimed:false},
  {id:'m06', ico:'\uD83E\uDDEA', name:'First lab report uploaded', desc:'First diagnostic record', coins:100, claimed:true},
  {id:'m07', ico:'\uD83E\uDD1D', name:'First referral joined', desc:'First friend joined', coins:200, claimed:true},
];

const REDEEMABLE = [
  {id:'w01', ico:'\uD83C\uDFAB', col:'#1D9E75', cat:'Plan', name:'1 Month Free', desc:'Extend your current plan by 30 days', cost:500},
  {id:'w02', ico:'\uD83C\uDFAB', col:'#1D9E75', cat:'Plan', name:'3 Months Free', desc:'Extend plan by 90 days', cost:1400},
  {id:'w03', ico:'\u2B50', col:'#f0b429', cat:'Plan', name:'Upgrade to Pro', desc:'Pro features free for 30 days', cost:600},
  {id:'w04', ico:'\uD83D\uDCC4', col:'#3b82f6', cat:'Report', name:'Annual Health Report', desc:'Year-in-review PDF digitally signed', cost:200},
  {id:'w05', ico:'\uD83C\uDF3F', col:'#6366f1', cat:'Ayu', name:'Ayu Deep Dive', desc:'Extended AI health session', cost:300},
  {id:'w06', ico:'\uD83C\uDF81', col:'#f59e0b', cat:'Gift', name:'Gift 1 month', desc:'Send a free month to a friend', cost:450},
  {id:'w07', ico:'\uD83D\uDCB3', col:'#22c55e', cat:'Cashout', name:'Cash back UPI', desc:'Transfer coins to your UPI', cost:1000},
];

const REDEEM_CATEGORIES = [
  {key: 'Plan', label: 'Plan discounts'},
  {key: 'Report', label: 'Health reports'},
  {key: 'Ayu', label: 'Ayu features'},
  {key: 'Gift', label: 'Gift a friend'},
  {key: 'Cashout', label: 'Cash out'},
];

const EARN_HISTORY = [
  {ico:'\uD83D\uDE34', col:'#6366f1', label:'Sleep Consistency March', amt:'+600', date:'31 Mar 2026'},
  {ico:'\uD83E\uDE78', col:'#f43f5e', label:'HbA1c Improvement Q1', amt:'+2000', date:'15 Jan 2026'},
  {ico:'\u2B50', col:'#f0b429', label:'6-Month Milestone', amt:'+1000', date:'15 Jul 2025'},
  {ico:'\uD83C\uDF3F', col:'#1D9E75', label:'Ayu Onboarding Complete', amt:'+300', date:'16 Jan 2025'},
  {ico:'\uD83C\uDF81', col:'#3b82f6', label:'Redeemed 1 Month Free', amt:'-500', date:'10 Mar 2025'},
  {ico:'\uD83D\uDD25', col:'#ef4444', label:'30-Day Streak badge', amt:'+150', date:'28 Feb 2026'},
];

module.exports = {
  REWARDS_TABS,
  CHALLENGES,
  BADGES,
  MILESTONES,
  REDEEMABLE,
  REDEEM_CATEGORIES,
  EARN_HISTORY,
};
