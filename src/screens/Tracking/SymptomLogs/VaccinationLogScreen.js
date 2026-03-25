import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Svg, {Circle as SvgCircle, Text as SvgText} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';
import VaccLogView from './VaccLogView';
import VaccAefiView from './VaccAefiView';
import VaccTravelCertsView from './VaccTravelCertsView';

// ──────────────────────────────────────────────
// Constants & Data
// ──────────────────────────────────────────────

const STATUS = {
  done: {dot: Colors.teal, bg: Colors.tealBg, text: Colors.tealText, label: 'Given'},
  overdue: {dot: Colors.redDark, bg: Colors.redBg, text: Colors.redDark, label: 'OVERDUE'},
  due: {dot: Colors.red, bg: Colors.redBg, text: Colors.redText, label: 'Due now'},
  upcoming: {dot: Colors.amber, bg: Colors.amberBg, text: Colors.amberDark, label: 'Upcoming'},
  recommended: {dot: Colors.blue, bg: Colors.blueBg, text: Colors.blueText, label: 'Recommended'},
  future: {dot: '#aaa', bg: '#f0f0f0', text: '#888', label: 'Future'},
};

const GOI_TAG = {bg: '#E8F4FD', color: Colors.blueText, label: 'GOI'};
const IAP_TAG = {bg: '#F4F3FF', color: '#2D1F70', label: 'IAP'};

const FAMILY_MEMBERS = [
  {id: 'priya', name: 'Priya', badge: null},
  {id: 'aarav', name: 'Aarav', subtitle: '9y', badge: '3'},
  {id: 'raj', name: 'Raj', badge: null},
];

const VIEW_TABS = ['Schedule', 'Log', 'Reactions', 'Travel', 'Certs'];

const ACTION_CARDS = [
  {
    id: 'tdap',
    name: 'Tdap booster',
    status: 'overdue',
    badgeLabel: 'OVERDUE 18m',
    borderColor: Colors.red,
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'typhoid',
    name: 'Typhoid booster',
    status: 'due',
    badgeLabel: 'Due this month',
    borderColor: Colors.amber,
    icon: 'medkit-outline',
  },
  {
    id: 'hpv',
    name: 'HPV-1 Gardasil 9',
    status: 'due',
    badgeLabel: 'Discuss now',
    borderColor: Colors.amber,
    icon: 'shield-outline',
  },
  {
    id: 'influenza',
    name: 'Influenza annual',
    status: 'upcoming',
    badgeLabel: '7 months away',
    borderColor: '#d1d5db',
    icon: 'fitness-outline',
  },
];

const AGE_GROUPS = [
  {
    label: 'Birth (0-4 weeks)',
    tag: 'GOI UIP',
    completion: '3/3',
    allDone: true,
    vaccines: [
      {name: 'BCG', tags: ['GOI'], detail: 'Tuberculosis \u00b7 ID left arm', date: '14 Jan 2017', status: 'done'},
      {name: 'OPV birth dose (bOPV-0)', tags: ['GOI'], detail: 'Polio \u00b7 Oral', date: '14 Jan 2017', status: 'done'},
      {name: 'Hepatitis B birth dose', tags: ['GOI'], detail: 'IM thigh \u00b7 Within 24h', date: '14 Jan 2017', status: 'done'},
    ],
  },
  {
    label: '6 weeks',
    tag: 'GOI UIP',
    completion: '5/5',
    allDone: true,
    vaccines: [
      {name: 'Pentavalent-1 (DTwP+Hib+HepB)', tags: ['GOI'], detail: 'IM left thigh', date: '28 Feb 2017', status: 'done'},
      {name: 'OPV-1 + fIPV-1', tags: ['GOI'], detail: 'Oral + Fractional IPV', date: '28 Feb 2017', status: 'done'},
      {name: 'Rotavirus-1 (ROTAVAC)', tags: ['GOI'], detail: 'Oral \u00b7 Must start before 15 weeks', date: '28 Feb 2017', status: 'done'},
      {name: 'PCV-1 (PCV13)', tags: ['GOI', 'IAP'], detail: 'Pneumonia \u00b7 IM right thigh', date: '28 Feb 2017', status: 'done'},
      {name: 'Influenza (first dose)', tags: ['IAP'], detail: 'Under 9y: 2 doses first season', date: 'Mar 2017', status: 'done'},
    ],
  },
  {
    label: '10 weeks',
    tag: 'GOI UIP',
    completion: '3/3',
    allDone: true,
    vaccines: [
      {name: 'Pentavalent-2', tags: ['GOI'], detail: 'Second dose', date: '11 Apr 2017', status: 'done'},
      {name: 'OPV-2', tags: ['GOI'], detail: 'Oral', date: '11 Apr 2017', status: 'done'},
      {name: 'Rotavirus-2', tags: ['GOI'], detail: 'Oral', date: '11 Apr 2017', status: 'done'},
    ],
  },
  {
    label: '14 weeks',
    tag: 'GOI UIP',
    completion: '4/4',
    allDone: true,
    vaccines: [
      {name: 'Pentavalent-3', tags: ['GOI'], detail: 'Third final primary', date: '9 May 2017', status: 'done'},
      {name: 'OPV-3 + fIPV-2', tags: ['GOI'], detail: 'Polio series complete', date: '9 May 2017', status: 'done'},
      {name: 'Rotavirus-3', tags: ['GOI'], detail: 'ROTAVAC third dose', date: '9 May 2017', status: 'done'},
      {name: 'PCV-3', tags: ['GOI', 'IAP'], detail: 'Third primary \u00b7 Booster still due', date: '9 May 2017', status: 'done'},
    ],
  },
  {
    label: '6 months',
    tag: 'IAP',
    completion: '2/2',
    allDone: true,
    vaccines: [
      {name: 'Influenza second first-season dose', tags: ['IAP'], detail: 'Second dose first season', date: 'Apr 2017', status: 'done'},
      {name: 'Vitamin A 1st supplementation', tags: ['GOI'], detail: '1 lakh IU oral', date: 'Oct 2017', status: 'done'},
    ],
  },
  {
    label: '9-12 months',
    tag: 'GOI+IAP',
    completion: '6/6',
    allDone: true,
    vaccines: [
      {name: 'MR-1/MMR-1', tags: ['GOI', 'IAP'], detail: 'SC upper arm', date: '15 Oct 2017', status: 'done'},
      {name: 'Japanese Encephalitis JE-1', tags: ['GOI'], detail: 'Endemic districts', date: 'Oct 2017', status: 'done'},
      {name: 'PCV Booster', tags: ['GOI', 'IAP'], detail: 'After 3-dose primary', date: 'Oct 2017', status: 'done'},
      {name: 'Typhoid Conjugate TCV-1', tags: ['GOI', 'IAP'], detail: 'Primary dose', date: 'Oct 2017', status: 'done'},
      {name: 'Hepatitis A dose 1', tags: ['IAP'], detail: '12 months \u00b7 IM', date: '14 Jan 2018', status: 'done'},
      {name: 'Varicella dose 1', tags: ['IAP'], detail: '12-15 months \u00b7 SC', date: '14 Jan 2018', status: 'done'},
    ],
  },
  {
    label: '15-18 months',
    tag: 'GOI+IAP',
    completion: '4/4',
    allDone: true,
    vaccines: [
      {name: 'DTwP Booster-1', tags: ['GOI', 'IAP'], detail: '16-18 months', date: 'Apr 2018', status: 'done'},
      {name: 'OPV Booster-1', tags: ['GOI'], detail: 'Oral', date: 'Apr 2018', status: 'done'},
      {name: 'MR-2/MMR-2', tags: ['GOI', 'IAP'], detail: 'SC', date: 'Aug 2018', status: 'done'},
      {name: 'Hepatitis A dose 2', tags: ['IAP'], detail: '6 months after dose 1', date: 'Jul 2018', status: 'done'},
    ],
  },
  {
    label: '2 years',
    tag: '',
    completion: '2/2',
    allDone: true,
    vaccines: [
      {name: 'Typhoid booster', tags: ['IAP'], detail: '3-yearly', date: 'Oct 2020', status: 'done'},
      {name: 'JE-2 (JENVAC)', tags: ['GOI'], detail: 'Endemic', date: 'Nov 2018', status: 'done'},
    ],
  },
  {
    label: '4-6 years',
    tag: 'GOI UIP',
    completion: '4/4',
    allDone: true,
    vaccines: [
      {name: 'DT Booster-2', tags: ['GOI'], detail: '5 years mandatory', date: 'Mar 2022', status: 'done'},
      {name: 'OPV Booster-2', tags: ['GOI'], detail: 'Final OPV', date: 'Mar 2022', status: 'done'},
      {name: 'Varicella dose 2', tags: ['IAP'], detail: '4-6 years', date: 'Mar 2022', status: 'done'},
      {name: 'Typhoid booster', tags: ['IAP'], detail: '3-yearly', date: 'Oct 2023', status: 'done'},
    ],
  },
  {
    label: '6-7 years',
    tag: '',
    completion: '2/2',
    allDone: true,
    vaccines: [
      {name: 'Influenza annual', tags: ['IAP'], detail: 'Annual dose', date: 'Last Oct 2025', status: 'done'},
      {name: 'COVID-19 vaccine', tags: ['GOI'], detail: 'Primary + booster', date: 'Aug 2023', status: 'done'},
    ],
  },
  {
    label: '9-10 years',
    tag: 'AARAV NOW',
    completion: '1/3 done, 2 due',
    allDone: false,
    isCurrentAge: true,
    vaccines: [
      {name: 'Tdap booster', tags: ['GOI', 'IAP'], detail: 'OVERDUE 18 months', date: null, status: 'overdue', badgeLabel: 'Log now \u2192'},
      {name: 'Typhoid booster', tags: ['IAP'], detail: 'DUE NOW Apr 2026', date: null, status: 'due', pulsing: true},
      {name: 'HPV Gardasil 9', tags: ['GOI', 'IAP'], detail: '9-14yr window', date: null, status: 'recommended', badgeLabel: 'IAP Priority'},
      {name: 'Influenza annual', tags: ['IAP'], detail: 'Oct 2026', date: null, status: 'upcoming'},
    ],
  },
  {
    label: '11-12 years',
    tag: '',
    completion: 'Future',
    allDone: false,
    isFuture: true,
    vaccines: [
      {name: 'HPV dose 2', tags: ['IAP'], detail: '~2027', date: null, status: 'future'},
      {name: 'Meningococcal ACWY', tags: ['IAP'], detail: 'Hostel/boarding school', date: null, status: 'future'},
      {name: 'Typhoid booster', tags: ['IAP'], detail: 'Oct 2029', date: null, status: 'future'},
      {name: 'Influenza annual', tags: ['IAP'], detail: 'Annual', date: null, status: 'future'},
    ],
  },
  {
    label: '13-14 years',
    tag: '',
    completion: 'Future',
    allDone: false,
    isFuture: true,
    vaccines: [
      {name: 'HPV catch-up', tags: ['IAP'], detail: 'Last 2-dose window before 15', date: null, status: 'future'},
      {name: 'Typhoid booster', tags: ['IAP'], detail: '3-yearly', date: null, status: 'future'},
    ],
  },
  {
    label: '15-16 years',
    tag: 'GOI',
    completion: 'Future',
    allDone: false,
    isFuture: true,
    vaccines: [
      {name: 'Td/Tdap booster', tags: ['GOI', 'IAP'], detail: '16 years mandatory', date: null, status: 'future'},
      {name: 'Meningococcal ACWY booster', tags: ['IAP'], detail: 'Booster dose', date: null, status: 'future'},
      {name: 'Influenza annual', tags: ['IAP'], detail: 'Annual', date: null, status: 'future'},
    ],
  },
  {
    label: '17-18 years',
    tag: '',
    completion: 'Future',
    allDone: false,
    isFuture: true,
    vaccines: [
      {name: 'HPV catch-up', tags: ['GOI', 'IAP'], detail: '3-dose if not done', date: null, status: 'future'},
      {name: 'Hepatitis B check', tags: ['IAP'], detail: 'Check immunity status', date: null, status: 'future'},
      {name: 'Typhoid booster', tags: ['IAP'], detail: '3-yearly', date: null, status: 'future'},
    ],
  },
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const CoverageRing = () => {
  const size = ms(80);
  const strokeWidth = ms(8);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = 0.79;
  const strokeDashoffset = circumference * (1 - progress);

  return (
    <View style={styles.coverageBanner}>
      <View style={styles.coverageRingWrap}>
        <Svg width={size} height={size}>
          <SvgCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="rgba(255,255,255,0.2)"
            strokeWidth={strokeWidth}
            fill="none"
          />
          <SvgCircle
            cx={size / 2}
            cy={size / 2}
            r={radius}
            stroke="#5DCAA5"
            strokeWidth={strokeWidth}
            fill="none"
            strokeDasharray={circumference}
            strokeDashoffset={strokeDashoffset}
            strokeLinecap="round"
            rotation="-90"
            origin={`${size / 2}, ${size / 2}`}
          />
          <SvgText
            x={size / 2}
            y={size / 2 + ms(6)}
            textAnchor="middle"
            fontSize={ms(18)}
            fontWeight="700"
            fill="#FFFFFF"
          >
            79%
          </SvgText>
        </Svg>
      </View>
      <View style={styles.coverageTextWrap}>
        <AppText variant="bodyBold" color={Colors.white}>
          23 of 29 vaccines
        </AppText>
        <AppText variant="caption" color="rgba(255,255,255,0.8)" style={{marginTop: vs(3)}}>
          1 overdue {'\u00b7'} 2 due now {'\u00b7'} 3 upcoming
        </AppText>
        <AppText variant="small" color="rgba(255,255,255,0.65)" style={{marginTop: vs(2)}}>
          UIP + IAP 2024
        </AppText>
      </View>
    </View>
  );
};

const TagBadge = ({tag}) => {
  const data = tag === 'GOI' ? GOI_TAG : IAP_TAG;
  return (
    <View style={[styles.tagBadge, {backgroundColor: data.bg}]}>
      <AppText variant="small" color={data.color} style={{fontWeight: '700', fontSize: ms(8)}}>
        {data.label}
      </AppText>
    </View>
  );
};

const StatusBadge = ({status, label}) => {
  const sData = STATUS[status] || STATUS.future;
  return (
    <View style={[styles.statusBadge, {backgroundColor: sData.bg}]}>
      <AppText variant="small" color={sData.text} style={{fontWeight: '600'}}>
        {label || sData.label}
      </AppText>
    </View>
  );
};

const StatusDot = ({status, pulsing}) => {
  const color = STATUS[status]?.dot || '#aaa';
  return (
    <View style={[styles.statusDot, {backgroundColor: color}, pulsing && styles.pulsingDot]} />
  );
};

const ActionCard = ({item}) => {
  const sData = STATUS[item.status] || STATUS.upcoming;
  return (
    <View style={[styles.actionCard, {borderColor: item.borderColor}]}>
      <Icon family="Ionicons" name={item.icon} size={ms(22)} color={sData.dot} />
      <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginTop: vs(6)}} numberOfLines={2}>
        {item.name}
      </AppText>
      <View style={{marginTop: vs(8)}}>
        <StatusBadge status={item.status} label={item.badgeLabel} />
      </View>
    </View>
  );
};

const VaccineRow = ({vaccine, isLast}) => (
  <TouchableOpacity
    style={[styles.vaccineRow, !isLast && styles.vaccineRowBorder]}
    activeOpacity={0.6}
  >
    <StatusDot status={vaccine.status} pulsing={vaccine.pulsing} />
    <View style={styles.vaccineInfo}>
      <View style={styles.vaccineNameRow}>
        <AppText variant="bodyBold" color={Colors.textPrimary} style={{flexShrink: 1}} numberOfLines={2}>
          {vaccine.name}
        </AppText>
        {vaccine.tags && vaccine.tags.map((tag) => (
          <TagBadge key={tag} tag={tag} />
        ))}
      </View>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(1)}}>
        {vaccine.detail}
      </AppText>
    </View>
    <View style={styles.vaccineRight}>
      {vaccine.date ? (
        <AppText variant="small" color={Colors.textSecondary} style={{textAlign: 'right', marginBottom: vs(3)}}>
          {vaccine.date}
        </AppText>
      ) : null}
      <StatusBadge
        status={vaccine.status}
        label={vaccine.badgeLabel || (vaccine.status === 'done' ? 'Given' : undefined)}
      />
    </View>
  </TouchableOpacity>
);

const AgeGroupCard = ({group}) => (
  <View style={styles.ageGroupCard}>
    <View style={[styles.ageGroupHeader, group.allDone ? styles.ageGroupHeaderDone : styles.ageGroupHeaderPending]}>
      <View style={styles.ageGroupLabelRow}>
        <AppText variant="bodyBold" color={group.allDone ? Colors.tealText : Colors.textPrimary}>
          {group.label}
        </AppText>
        {group.tag ? (
          <View style={[
            styles.ageGroupTagBadge,
            group.isCurrentAge ? {backgroundColor: Colors.red} : {backgroundColor: 'rgba(0,0,0,0.06)'},
          ]}>
            <AppText
              variant="small"
              color={group.isCurrentAge ? Colors.white : Colors.textSecondary}
              style={{fontWeight: '700', fontSize: ms(9)}}
            >
              {group.tag}
            </AppText>
          </View>
        ) : null}
      </View>
      <AppText variant="caption" color={group.allDone ? Colors.tealText : Colors.textSecondary}>
        {group.completion}
        {group.allDone ? ' \u2713' : ''}
      </AppText>
    </View>
    <View style={styles.ageGroupBody}>
      {group.vaccines.map((v, i) => (
        <VaccineRow key={`${group.label}-${i}`} vaccine={v} isLast={i === group.vaccines.length - 1} />
      ))}
    </View>
  </View>
);

const StatusLegend = () => (
  <View style={styles.legendRow}>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, {backgroundColor: Colors.teal}]} />
      <AppText variant="small" color={Colors.textSecondary}>Given</AppText>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, {backgroundColor: Colors.redDark}]} />
      <AppText variant="small" color={Colors.textSecondary}>Overdue</AppText>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, {backgroundColor: Colors.red}]} />
      <AppText variant="small" color={Colors.textSecondary}>Due now</AppText>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, {backgroundColor: Colors.amber}]} />
      <AppText variant="small" color={Colors.textSecondary}>Upcoming</AppText>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, {backgroundColor: Colors.blue}]} />
      <AppText variant="small" color={Colors.textSecondary}>Recommended</AppText>
    </View>
    <View style={[styles.tagBadge, {backgroundColor: GOI_TAG.bg, marginLeft: s(4)}]}>
      <AppText variant="small" color={GOI_TAG.color} style={{fontWeight: '700', fontSize: ms(8)}}>GOI</AppText>
    </View>
    <View style={[styles.tagBadge, {backgroundColor: IAP_TAG.bg, marginLeft: s(4)}]}>
      <AppText variant="small" color={IAP_TAG.color} style={{fontWeight: '700', fontSize: ms(8)}}>IAP</AppText>
    </View>
  </View>
);

const ScheduleView = () => (
  <View>
    {/* Action Required */}
    <View style={styles.sectionHeader}>
      <Icon family="Ionicons" name="alert-circle-outline" size={ms(18)} color={Colors.red} />
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={{marginLeft: s(6)}}>
        Action required
      </AppText>
    </View>
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.actionScroll}
    >
      {ACTION_CARDS.map((card) => (
        <ActionCard key={card.id} item={card} />
      ))}
    </ScrollView>

    {/* Status Legend */}
    <StatusLegend />

    {/* Age Group Cards */}
    {AGE_GROUPS.map((group, idx) => (
      <AgeGroupCard key={idx} group={group} />
    ))}

    {/* Info Insight Card */}
    <View style={styles.insightCard}>
      <Icon family="Ionicons" name="information-circle-outline" size={ms(18)} color={Colors.blueText} />
      <AppText variant="caption" color={Colors.blueText} style={{flex: 1, marginLeft: s(8)}}>
        Schedule sources: GOI UIP 2024 + IAP 2024. [GOI] = Government UIP - free, mandatory. [IAP] = IAP recommended privately.
      </AppText>
    </View>
  </View>
);

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const VaccinationLogScreen = ({navigation}) => {
  const [activeMember, setActiveMember] = useState('aarav');
  const [activeView, setActiveView] = useState('Schedule');

  const renderContent = () => {
    switch (activeView) {
      case 'Schedule':
        return <ScheduleView />;
      case 'Log':
        return <VaccLogView />;
      case 'Reactions':
        return <VaccAefiView />;
      case 'Travel':
        return <VaccTravelCertsView activeView="travel" />;
      case 'Certs':
        return <VaccTravelCertsView activeView="certs" />;
      default:
        return <ScheduleView />;
    }
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Compact Header (fixed) ── */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <View style={styles.headerLeft}>
            <TouchableOpacity
              onPress={() => navigation.goBack()}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}
              style={{padding: s(13)}}
            >
              <Icon family="Ionicons" name="chevron-back" size={ms(22)} color={Colors.white} />
            </TouchableOpacity>
            <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(4)}}>
              Health Vault
            </AppText>
          </View>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.duePill}>
              <AppText variant="small" color={Colors.white} style={{fontWeight: '700'}}>
                3 due
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logPill}>
              <AppText variant="small" color={Colors.white} style={{fontWeight: '600'}}>
                + Log vaccine
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
        <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(6), marginLeft: s(13)}}>
          Vaccination record
        </AppText>
      </View>

      {/* ── View Tabs (sticky) ── */}
      <View style={styles.viewTabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.viewTabsScroll}>
          {VIEW_TABS.map((tab) => {
            const isActive = activeView === tab;
            return (
              <TouchableOpacity
                key={tab}
                style={[styles.viewTab, isActive && styles.viewTabActive]}
                onPress={() => setActiveView(tab)}
                activeOpacity={0.7}
              >
                <AppText
                  variant="caption"
                  color={isActive ? Colors.primary : Colors.textSecondary}
                  style={{fontWeight: isActive ? '700' : '500'}}
                >
                  {tab}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Scrollable header content */}
        <View style={styles.scrollableHeader}>
          <AppText variant="caption" color="rgba(255,255,255,0.7)">
            Family {'\u00b7'} India UIP + IAP 2024 {'\u00b7'} Birth to 18 years & adult lifetime
          </AppText>
          <View style={styles.whoTabsRow}>
            {FAMILY_MEMBERS.map((m) => {
              const isActive = activeMember === m.id;
              return (
                <TouchableOpacity
                  key={m.id}
                  style={[styles.whoTab, isActive && styles.whoTabActive]}
                  onPress={() => setActiveMember(m.id)}
                  activeOpacity={0.7}
                >
                  <AppText
                    variant="small"
                    color={isActive ? Colors.primary : 'rgba(255,255,255,0.8)'}
                    style={{fontWeight: isActive ? '700' : '500'}}
                  >
                    {m.name}
                    {m.subtitle ? ` \u00b7 ${m.subtitle}` : ''}
                  </AppText>
                  {m.badge && (
                    <View style={styles.whoBadge}>
                      <AppText variant="small" color={Colors.white} style={{fontWeight: '700', fontSize: ms(9)}}>
                        {m.badge}
                      </AppText>
                    </View>
                  )}
                </TouchableOpacity>
              );
            })}
            <TouchableOpacity style={styles.whoTab} activeOpacity={0.7}>
              <AppText variant="small" color="rgba(255,255,255,0.7)" style={{fontWeight: '500'}}>
                + Add
              </AppText>
            </TouchableOpacity>
          </View>
          <CoverageRing />
        </View>

        {/* Tab content */}
        {renderContent()}
        <View style={{height: vs(90)}} />
      </ScrollView>

      {/* ── Bottom Bar ── */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.primaryBtn} activeOpacity={0.8}>
          <Icon family="Ionicons" name="checkmark-circle-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
            Save {'\u00b7'} Aarav vaccination log
          </AppText>
        </TouchableOpacity>
        <View style={styles.secondaryRow}>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7}>
            <Icon family="Ionicons" name="share-outline" size={ms(16)} color={Colors.primary} />
            <AppText variant="small" color={Colors.primary} style={{marginLeft: s(5), fontWeight: '600'}}>
              Share with doctor
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7}>
            <Icon family="Ionicons" name="notifications-outline" size={ms(16)} color={Colors.primary} />
            <AppText variant="small" color={Colors.primary} style={{marginLeft: s(5), fontWeight: '600'}}>
              Set reminders
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const BORDER_COLOR = '#d1d5db';

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  // ── Header (compact) ──
  header: {
    backgroundColor: Colors.primary,
    paddingTop: vs(10),
    paddingBottom: vs(8),
  },
  scrollableHeader: {
    backgroundColor: Colors.primary,
    marginHorizontal: s(-13),
    paddingHorizontal: s(13),
    paddingTop: vs(4),
    paddingBottom: vs(12),
    marginBottom: vs(10),
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingRight: s(13),
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  duePill: {
    backgroundColor: Colors.red,
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(20),
  },
  logPill: {
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.25)',
  },

  // ── Who tabs ──
  whoTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(14),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: ms(10),
    padding: s(3),
  },
  whoTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(8),
  },
  whoTabActive: {
    backgroundColor: Colors.white,
  },
  whoBadge: {
    backgroundColor: Colors.red,
    width: ms(16),
    height: ms(16),
    borderRadius: ms(8),
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: s(4),
  },

  // ── Coverage Ring ──
  coverageBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(14),
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: ms(12),
    padding: s(12),
  },
  coverageRingWrap: {
    marginRight: s(14),
  },
  coverageTextWrap: {
    flex: 1,
  },

  // ── View tabs ──
  viewTabsContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_COLOR,
  },
  viewTabsScroll: {
    paddingHorizontal: s(13),
  },
  viewTab: {
    paddingVertical: vs(8),
    marginRight: s(18),
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  viewTabActive: {
    borderBottomColor: Colors.primary,
  },

  // ── Body ──
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: s(13),
  },

  // ── Action cards ──
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  actionScroll: {
    paddingRight: s(13),
    paddingBottom: vs(4),
  },
  actionCard: {
    width: ms(130),
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    padding: s(12),
    marginRight: s(10),
  },

  // ── Status Legend ──
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    alignItems: 'center',
    marginTop: vs(14),
    marginBottom: vs(14),
    gap: s(6),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(3),
  },
  legendDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },

  // ── Tag badges ──
  tagBadge: {
    paddingHorizontal: s(5),
    paddingVertical: vs(1),
    borderRadius: ms(4),
    marginLeft: s(4),
  },

  // ── Age group card ──
  ageGroupCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER_COLOR,
    marginBottom: vs(12),
    overflow: 'hidden',
  },
  ageGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
  },
  ageGroupHeaderDone: {
    backgroundColor: Colors.tealBg,
  },
  ageGroupHeaderPending: {
    backgroundColor: '#f9fafb',
  },
  ageGroupLabelRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexShrink: 1,
  },
  ageGroupTagBadge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
    marginLeft: s(8),
  },
  ageGroupBody: {
    paddingHorizontal: s(12),
  },

  // ── Vaccine row ──
  vaccineRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(10),
  },
  vaccineRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER_COLOR,
  },
  vaccineNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  vaccineInfo: {
    flex: 1,
    marginLeft: s(8),
    marginRight: s(8),
  },
  vaccineRight: {
    alignItems: 'flex-end',
    flexShrink: 0,
  },

  // ── Status ──
  statusBadge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
    alignSelf: 'flex-start',
  },
  statusDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    marginTop: vs(4),
  },
  pulsingDot: {
    borderWidth: 2,
    borderColor: 'rgba(226,75,74,0.35)',
  },

  // ── Insight ──
  insightCard: {
    flexDirection: 'row',
    backgroundColor: Colors.blueBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER_COLOR,
    padding: s(12),
    marginTop: vs(6),
    marginBottom: vs(10),
  },

  // ── Bottom bar ──
  bottomBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: BORDER_COLOR,
    paddingHorizontal: s(13),
    paddingTop: vs(8),
    paddingBottom: Platform.OS === 'ios' ? vs(22) : vs(10),
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(11),
  },
  secondaryRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: vs(6),
    gap: s(12),
  },
  secondaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(6),
    paddingHorizontal: s(10),
  },
});

export default VaccinationLogScreen;
