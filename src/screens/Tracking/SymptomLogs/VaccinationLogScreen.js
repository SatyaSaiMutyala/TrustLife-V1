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
  {id: 'aarav', name: 'Aarav', subtitle: '9y', badge: '1'},
  {id: 'raj', name: 'Raj', badge: null},
];

const VIEW_TABS = [
  {key: 'Schedule', icon: 'calendar-outline', label: 'Schedule'},
  {key: 'Log', icon: 'create-outline', label: 'Log vaccine'},
  {key: 'Reactions', icon: 'bandage-outline', label: 'Reactions'},
  {key: 'Travel', icon: 'airplane-outline', label: 'Travel'},
  {key: 'Certs', icon: 'document-outline', label: 'Certs'},
];

const ACTION_CARDS = [
  {
    id: 'tdap',
    name: 'Tdap booster',
    date: 'Due Sep 2023',
    status: 'overdue',
    badgeLabel: 'OVERDUE 18 mo',
    borderColor: Colors.red,
    icon: 'shield-checkmark-outline',
  },
  {
    id: 'typhoid',
    name: 'Typhoid booster',
    date: 'Due Apr 2026',
    status: 'due',
    badgeLabel: 'Due this month',
    borderColor: Colors.amber,
    icon: 'medkit-outline',
  },
  {
    id: 'influenza',
    name: 'Influenza (annual)',
    date: 'Due Oct 2026',
    status: 'upcoming',
    badgeLabel: 'In 7 months',
    borderColor: '#d1d5db',
    icon: 'fitness-outline',
  },
  {
    id: 'hepA',
    name: 'Hepatitis A',
    date: 'Due Jan 2027',
    status: 'future',
    badgeLabel: 'Upcoming',
    borderColor: '#d1d5db',
    icon: 'water-outline',
  },
];

const AGE_GROUPS = [
  {
    label: 'At birth',
    tag: '',
    completion: '3/3 complete',
    allDone: true,
    vaccines: [
      {name: 'BCG', tags: ['GOI'], detail: 'Tuberculosis - ID left arm - Single dose - GMCH, Hyd', date: '14 Jan 2017', status: 'done'},
      {name: 'OPV-0 (bOPV)', tags: ['GOI'], detail: 'Polio - Oral - Birth dose - GMCH, Hyd', date: '14 Jan 2017', status: 'done'},
      {name: 'Hepatitis B (birth dose)', tags: ['GOI'], detail: 'Hep B - IM thigh - Within 24h of birth - GMCH, Hyd', date: '14 Jan 2017', status: 'done'},
    ],
  },
  {
    label: '6 weeks',
    tag: '',
    completion: '5/5 complete',
    allDone: true,
    vaccines: [
      {name: 'DTwP-1 + Hib-1 + HepB-1', tags: ['GOI'], detail: 'Diphtheria, Tetanus, Pertussis, Hib, Hep B - IM thigh - Pentavalent', date: '28 Feb 2017', status: 'done'},
      {name: 'OPV-1 + IPV-1', tags: ['GOI'], detail: 'Polio - Oral bOPV + IM IPV fractional dose', date: '28 Feb 2017', status: 'done'},
      {name: 'Rotavirus-1 (ROTAVAC)', tags: ['GOI'], detail: 'Rotavirus gastroenteritis - Oral drops', date: '28 Feb 2017', status: 'done'},
      {name: 'PCV-1 (PCV13/Prevnar)', tags: ['GOI', 'IAP'], detail: 'Pneumococcal disease, pneumonia, meningitis - IM thigh', date: '28 Feb 2017', status: 'done'},
    ],
  },
  {
    label: '9 - 12 months',
    tag: '',
    completion: '4/4 complete',
    allDone: true,
    vaccines: [
      {name: 'MMR-1 (Measles-Mumps-Rubella)', tags: ['GOI', 'IAP'], detail: 'MMR - SC upper arm - First dose', date: '15 Oct 2017', status: 'done'},
      {name: 'Typhoid conjugate (TCV-1)', tags: ['GOI', 'IAP'], detail: 'Typhoid fever - IM - Primary dose 9 months', date: '15 Oct 2017', status: 'done'},
      {name: 'Hepatitis A-1 (Havrix/Twinrix)', tags: ['IAP'], detail: 'Hepatitis A - IM - First dose at 12 months', date: '14 Jan 2018', status: 'done'},
      {name: 'Varicella-1 (Chickenpox)', tags: ['IAP'], detail: 'Varicella - SC arm - First dose', date: '14 Jan 2018', status: 'done'},
    ],
  },
  {
    label: '4 - 6 years',
    tag: '',
    completion: '3/3 complete',
    allDone: true,
    vaccines: [
      {name: 'MMR-2 (Booster)', tags: ['GOI', 'IAP'], detail: 'Second MMR dose - SC upper arm', date: '10 Mar 2022', status: 'done'},
      {name: 'Varicella-2 (Booster)', tags: ['IAP'], detail: 'Second varicella dose - SC arm', date: '10 Mar 2022', status: 'done'},
      {name: 'DT booster (5 years)', tags: ['GOI'], detail: 'Diphtheria-Tetanus - IM arm', date: '10 Mar 2022', status: 'done'},
    ],
  },
  {
    label: '9 - 10 years',
    tag: 'Aarav now',
    completion: '1/2 done - 1 overdue',
    allDone: false,
    isCurrentAge: true,
    vaccines: [
      {name: 'Tdap booster', tags: [], detail: 'Diphtheria, Tetanus, acellular Pertussis booster - IM upper arm - Due Sep 2023 - OVERDUE 18 months', date: 'Sep 2023', status: 'overdue', badgeLabel: 'Log now'},
      {name: 'Typhoid booster (TCV / Vi-PS)', tags: [], detail: '3-year booster from TCV-1 given Jan 2018 - Due Apr 2026 - this month', date: 'Apr 2026', status: 'due', pulsing: true, badgeLabel: 'Due now'},
      {name: 'HPV (Gardasil 9)', tags: ['IAP'], detail: 'HPV-related cancer prevention - IAP recommended 9-14 years - 2-dose - Discuss with paediatrician', date: 'Discuss', status: 'recommended', badgeLabel: 'IAP rec.'},
    ],
  },
  {
    label: 'Annual / Recurrent',
    tag: '',
    completion: '2/4 up to date',
    allDone: false,
    vaccines: [
      {name: 'Influenza (flu) - Annual', tags: ['IAP'], detail: 'Annual seasonal flu shot - IM deltoid - Oct 2025 given - Due again Oct 2026', date: 'Oct 2025', status: 'done'},
      {name: 'COVID-19 - Booster', tags: ['GOI'], detail: 'Covaxin/Covishield primary series + booster - Discuss updated booster', date: 'Aug 2023', status: 'done'},
      {name: 'Hepatitis A booster (2nd dose)', tags: ['IAP'], detail: '6 months after first dose - 1st dose Jan 2018 - Long overdue', date: '2018 (missed)', status: 'overdue', badgeLabel: 'Check needed'},
      {name: 'Meningococcal ACWY (MCV4)', tags: ['IAP'], detail: 'Bacterial meningitis - Optional - IAP recommends for endemic areas, hostel-bound, hajj travel', date: 'Not given', status: 'recommended', badgeLabel: 'Optional'},
    ],
  },
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const CoverageRing = ({pct = 84, title = 'Aarav - 84% complete', sub = '18 of 22 schedule vaccines given - 1 overdue - 1 due now - 2 upcoming - IAP 2024 schedule'}) => {
  const size = ms(56);
  const strokeWidth = ms(5);
  const radius = (size - strokeWidth) / 2;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference * (1 - pct / 100);

  return (
    <View style={styles.coverageBanner}>
      <View style={styles.coverageRingWrap}>
        <Svg width={size} height={size}>
          <SvgCircle cx={size / 2} cy={size / 2} r={radius} stroke="rgba(255,255,255,0.15)" strokeWidth={strokeWidth} fill="none" />
          <SvgCircle cx={size / 2} cy={size / 2} r={radius} stroke="#9FE1CB" strokeWidth={strokeWidth} fill="none"
            strokeDasharray={circumference} strokeDashoffset={strokeDashoffset} strokeLinecap="round" rotation="-90" origin={`${size / 2}, ${size / 2}`} />
          <SvgText x={size / 2} y={size / 2 - ms(1)} textAnchor="middle" fontSize={ms(11)} fontWeight="700" fill="#FFFFFF" fontFamily="System">{pct}%</SvgText>
          <SvgText x={size / 2} y={size / 2 + ms(8)} textAnchor="middle" fontSize={ms(7)} fill="rgba(255,255,255,0.4)" fontFamily="System">covered</SvgText>
        </Svg>
      </View>
      <View style={styles.coverageTextWrap}>
        <AppText variant="bodyBold" color={Colors.white}>{title}</AppText>
        <AppText variant="small" color="rgba(255,255,255,0.65)" style={{marginTop: vs(3), lineHeight: ms(15)}}>{sub}</AppText>
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
    <View style={[styles.actionCard, {borderColor: item.borderColor, borderWidth: item.status === 'overdue' ? 1.5 : 0.5}]}>
      <Icon family="Ionicons" name={item.icon} size={ms(22)} color={sData.dot} />
      <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700', marginTop: vs(5)}} numberOfLines={2}>
        {item.name}
      </AppText>
      {item.date && <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{item.date}</AppText>}
      <View style={{marginTop: vs(4)}}>
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
      <AppText variant="caption" color={vaccine.status === 'overdue' ? Colors.redDark : vaccine.status === 'due' ? Colors.amberDark : Colors.textSecondary} style={{marginTop: vs(1), lineHeight: ms(15)}}>
        {vaccine.detail}
      </AppText>
    </View>
    <View style={styles.vaccineRight}>
      {vaccine.date ? (
        <AppText variant="small" color={vaccine.status === 'overdue' ? Colors.redDark : vaccine.status === 'due' ? Colors.amberDark : Colors.textSecondary} style={{textAlign: 'right', fontWeight: '600', marginBottom: vs(3)}}>
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
        <AppText variant="small" color={Colors.primary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4}}>
          {group.label}
        </AppText>
        {group.tag ? (
          <View style={[
            styles.ageGroupTagBadge,
            group.isCurrentAge ? {backgroundColor: 'rgba(226,75,74,0.15)'} : {backgroundColor: 'rgba(0,0,0,0.06)'},
          ]}>
            <AppText
              variant="small"
              color={group.isCurrentAge ? Colors.redDark : Colors.textSecondary}
              style={{fontWeight: '700', fontSize: ms(9)}}
            >
              {group.tag}
            </AppText>
          </View>
        ) : null}
      </View>
      <AppText variant="caption" color={group.allDone ? Colors.tealText : group.isCurrentAge ? Colors.redDark : Colors.textSecondary} style={{fontWeight: '600'}}>
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


const Section = ({title, sub}) => (
  <View style={{flexDirection: 'row', alignItems: 'center', marginTop: vs(16), marginBottom: vs(8)}}>
    <AppText variant="subtext" color={Colors.textSecondary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.6, marginRight: s(4)}}>{title}</AppText>
    {sub && <AppText variant="subtext" color={Colors.textTertiary} style={{marginRight: s(4)}}>{sub}</AppText>}
    <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#c8dfc0'}} />
  </View>
);

const ScheduleView = () => (
  <View>
    {/* Action Required */}
    <Section title="Action required" />
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.actionScroll}
    >
      {ACTION_CARDS.map((card) => (
        <ActionCard key={card.id} item={card} />
      ))}
    </ScrollView>

    {/* IAP Schedule */}
    <Section title="IAP 2024 immunization schedule" sub="- Aarav - 9 years 2 months" />

    {/* Age Group Cards */}
    {AGE_GROUPS.map((group, idx) => (
      <AgeGroupCard key={idx} group={group} />
    ))}

    {/* Info Insight Card */}
    <View style={styles.insightCard}>
      <Icon family="Ionicons" name="book-outline" size={ms(16)} color={Colors.blueText} />
      <AppText variant="caption" color={Colors.blueText} style={{flex: 1, lineHeight: ms(17)}}>
        <AppText style={{fontWeight: '700'}}>Schedule source: IAP 2024 National Immunization Schedule.</AppText> This schedule follows the Indian Academy of Pediatrics 2024 revised guidelines. Vaccines marked "IAP rec." are strongly recommended by IAP but not yet in the Government of India Universal Immunization Programme (UIP). Always confirm with your paediatrician before each vaccine appointment.
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

      {/* ── Header (fixed) ── */}
      <View style={styles.header}>
        <View style={styles.headerTopRow}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
            <Icon family="Ionicons" name="chevron-back" size={ms(18)} color="rgba(255,255,255,0.55)" />
            <AppText variant="small" color="rgba(255,255,255,0.55)">Health Vault</AppText>
          </TouchableOpacity>
          <View style={styles.headerRight}>
            <TouchableOpacity style={styles.duePill}>
              <Icon family="Ionicons" name="warning-outline" size={ms(12)} color={Colors.white} />
              <AppText variant="small" color={Colors.white} style={{fontWeight: '700'}}>2 due</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.logPill} onPress={() => setActiveView('Log')}>
              <AppText variant="small" color={Colors.white} style={{fontWeight: '600'}}>+ Log vaccine</AppText>
            </TouchableOpacity>
          </View>
        </View>
        <View style={{paddingHorizontal: s(16), paddingTop: vs(8)}}>
          <AppText variant="screenName" color={Colors.white} style={{fontSize: ms(20)}}>Vaccination record</AppText>
          <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginTop: vs(2)}}>Family - National Immunization Schedule + Lifetime tracker</AppText>
        </View>
      </View>

      {/* ── View Tabs (sticky) ── */}
      <View style={styles.viewTabsContainer}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.viewTabsScroll}>
          {VIEW_TABS.map((tab) => {
            const isActive = activeView === tab.key;
            return (
              <TouchableOpacity
                key={tab.key}
                style={[styles.viewTab, isActive && styles.viewTabActive]}
                onPress={() => setActiveView(tab.key)}
                activeOpacity={0.7}
              >
                <Icon family="Ionicons" name={tab.icon} size={ms(13)} color={isActive ? Colors.primary : Colors.textTertiary} />
                <AppText
                  variant="caption"
                  color={isActive ? Colors.primary : Colors.textSecondary}
                  style={{fontWeight: isActive ? '700' : '500', marginLeft: s(4)}}
                >
                  {tab.label}
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
          <Icon family="Ionicons" name="save-outline" size={ms(20)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
            Save {'\u00b7'} Aarav vaccination log
          </AppText>
        </TouchableOpacity>
        <View style={styles.secondaryRow}>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7} onPress={() => navigation.navigate('Records', {tab: 'healthlogs', logFilter: 'vaccination'})}>
            <Icon family="Ionicons" name="document-text-outline" size={ms(14)} color={Colors.textSecondary} />
            <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(5), fontWeight: '600'}}>
              Records
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.secondaryBtn} activeOpacity={0.7} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'vaccine', initialTab: 'vaccineIntel'})}>
            <Icon family="Ionicons" name="bulb-outline" size={ms(14)} color={Colors.textSecondary} />
            <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(5), fontWeight: '600'}}>
              Ayu Intel
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

  // ── Header ──
  header: {
    backgroundColor: Colors.primary,
    paddingTop: vs(10),
    paddingBottom: vs(8),
  },
  scrollableHeader: {
    backgroundColor: Colors.primary,
    marginHorizontal: s(-13),
    paddingHorizontal: s(16),
    paddingTop: vs(4),
    paddingBottom: vs(13),
    marginBottom: vs(10),
  },
  headerTopRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingVertical: vs(6),
  },
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(7),
  },
  duePill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    backgroundColor: Colors.red,
    paddingHorizontal: s(13),
    paddingVertical: vs(6),
    borderRadius: ms(20),
  },
  logPill: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: s(13),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.18)',
  },

  // ── Who tabs ──
  whoTabsRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10),
    backgroundColor: 'rgba(255,255,255,0.1)',
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    overflow: 'hidden',
  },
  whoTab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(8),
  },
  whoTabActive: {
    backgroundColor: 'rgba(255,255,255,0.18)',
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
    marginTop: vs(10),
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
    padding: ms(11),
    gap: s(12),
  },
  coverageRingWrap: {},
  coverageTextWrap: {
    flex: 1,
  },

  // ── View tabs ──
  viewTabsContainer: {
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: '#c8dfc0',
  },
  viewTabsScroll: {
    paddingHorizontal: s(13),
  },
  viewTab: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    paddingHorizontal: s(4),
    marginRight: s(10),
    borderBottomWidth: 2.5,
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
    borderRadius: ms(13),
    borderWidth: 0.5,
    borderColor: '#c8dfc0',
    padding: ms(11),
    marginRight: s(8),
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
    borderColor: '#c8dfc0',
    marginBottom: vs(8),
    overflow: 'hidden',
  },
  ageGroupHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(13),
    paddingVertical: vs(8),
    borderBottomWidth: 0.5,
    borderBottomColor: '#e8f3e4',
  },
  ageGroupHeaderDone: {
    backgroundColor: '#f0f8ee',
  },
  ageGroupHeaderPending: {
    backgroundColor: '#f0f8ee',
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
    borderBottomColor: '#e8f3e4',
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
    borderRadius: ms(11),
    padding: ms(10),
    marginTop: vs(6),
    marginBottom: vs(10),
    gap: s(8),
  },

  // ── Bottom bar ──
  bottomBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: '#c8dfc0',
    paddingHorizontal: s(13),
    paddingTop: vs(12),
    paddingBottom: Platform.OS === 'ios' ? vs(28) : vs(12),
  },
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ms(13),
    paddingVertical: vs(14),
    gap: s(10),
    marginBottom: vs(8),
  },
  secondaryRow: {
    flexDirection: 'row',
    gap: s(8),
  },
  secondaryBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(10),
    borderRadius: ms(11),
    backgroundColor: Colors.background,
    borderWidth: 0.5,
    borderColor: '#c8dfc0',
  },
});

export default VaccinationLogScreen;
