import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

const FILTERS = [
  {key: 'coverage', label: 'Coverage'},
  {key: 'timeline', label: 'Timeline'},
  {key: 'priya', label: 'Priya'},
  {key: 'aarav', label: 'Aarav'},
  {key: 'raj', label: 'Raj'},
  {key: 'aefi', label: 'Reactions'},
];

const Section = ({title}) => (
  <View style={st.sec}><AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{title}</AppText><View style={st.secLine} /></View>
);

const PersonCard = ({name, age, sub, pct, given, overdue, upcoming, overdueText, upcomingText}) => (
  <View style={st.personCard}>
    <View style={{flexDirection: 'row', alignItems: 'center', gap: s(11), marginBottom: vs(10)}}>
      <View style={st.avatar}><Icon family="Ionicons" name="person-outline" size={ms(22)} color={Colors.primary} /></View>
      <View style={{flex: 1}}><AppText variant="bodyBold" color={Colors.textPrimary}>{name} - {age}</AppText><AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{sub}</AppText></View>
      <View style={{alignItems: 'flex-end'}}><AppText variant="header" color={Colors.primary} style={{fontWeight: '800', fontSize: ms(22), lineHeight: ms(22)}}>{pct}%</AppText><AppText variant="subtext" color={Colors.textSecondary}>complete</AppText></View>
    </View>
    <View style={st.progressBar}><View style={[st.progressFill, {width: `${pct}%`}]} /></View>
    <View style={{flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(4), marginBottom: vs(8)}}>
      <AppText variant="subtext" color={Colors.textSecondary}>{given} of recommended vaccines given</AppText>
      {overdue > 0 && <AppText variant="subtext" color={Colors.red} style={{fontWeight: '700'}}>{overdue} overdue</AppText>}
    </View>
    <View style={{flexDirection: 'row', gap: s(5), marginBottom: vs(8)}}>
      <View style={[st.miniStat, {backgroundColor: Colors.tealBg}]}><AppText variant="header" color={Colors.accent} style={{fontWeight: '800', fontSize: ms(14)}}>{given}</AppText><AppText variant="subtext" color={Colors.textSecondary}>Given</AppText></View>
      <View style={[st.miniStat, {backgroundColor: Colors.redBg}]}><AppText variant="header" color={Colors.red} style={{fontWeight: '800', fontSize: ms(14)}}>{overdue}</AppText><AppText variant="subtext" color={Colors.textSecondary}>Overdue</AppText></View>
      <View style={[st.miniStat, {backgroundColor: Colors.amberBg}]}><AppText variant="header" color="#F97316" style={{fontWeight: '800', fontSize: ms(14)}}>{upcoming}</AppText><AppText variant="subtext" color={Colors.textSecondary}>Upcoming</AppText></View>
    </View>
    {overdueText && <AppText variant="subtext" color={Colors.red} style={{fontWeight: '700', marginBottom: vs(4)}}>Overdue: {overdueText}</AppText>}
    {upcomingText && <AppText variant="subtext" color="#F97316" style={{fontWeight: '700'}}>Upcoming: {upcomingText}</AppText>}
  </View>
);

const RecordRow = ({icon, iconBg, name, meta, chips, dateText, statusLabel, statusBg, statusColor}) => (
  <View style={st.rrow}>
    <View style={[st.rrowIcon, {backgroundColor: iconBg}]}><Icon family="Ionicons" name={icon} size={ms(18)} color={statusColor || Colors.tealText} /></View>
    <View style={{flex: 1}}>
      <AppText variant="bodyBold" color={Colors.textPrimary}>{name}</AppText>
      <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(15)}}>{meta}</AppText>
      {chips && chips.length > 0 && (
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(4), marginTop: vs(5)}}>
          {chips.map((c, i) => <View key={i} style={[st.chip, c.bg && {backgroundColor: c.bg}]}><AppText variant="subtext" color={c.color || Colors.tealText} style={{fontWeight: '600'}}>{c.label}</AppText></View>)}
        </View>
      )}
    </View>
    <View style={{alignItems: 'flex-end'}}>
      <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '700'}}>{dateText}</AppText>
      {statusLabel && <View style={[st.badge, {backgroundColor: statusBg}]}><AppText variant="subtext" color={statusColor} style={{fontWeight: '700'}}>{statusLabel}</AppText></View>}
    </View>
  </View>
);

const TimelineNode = ({date, name, detail, color, isLast}) => (
  <View style={{flexDirection: 'row', alignItems: 'flex-start', gap: s(12), position: 'relative', paddingBottom: isLast ? 0 : vs(10), marginLeft: s(6)}}>
    {!isLast && <View style={[st.tlLine, {backgroundColor: color === Colors.red ? '#f0c0c0' : '#c8dfc0'}]} />}
    <View style={[st.tlDot, {backgroundColor: color}]} />
    <View style={st.tlContent}>
      <AppText variant="subtext" color={Colors.textSecondary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(3)}}>{date}</AppText>
      <AppText variant="bodyBold" color={Colors.textPrimary}>{name}</AppText>
      <AppText variant="small" color={detail.includes('overdue') || detail.includes('MISSED') ? Colors.red : Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(15)}}>{detail}</AppText>
    </View>
  </View>
);

const CoveragePanel = () => (
  <View>
    <Section title="Family coverage" />
    <PersonCard name="Priya Reddy" age="38F" sub="T2DM + HTN - Adult schedule - High-risk profile" pct={72} given={14} overdue={2} upcoming={3} overdueText="HepB series (unknown status) - HepA booster due 2025" upcomingText="Typhoid booster (Apr 26) - Shingrix dose 2 (May) - Flu (Oct)" />
    <PersonCard name="Aarav Reddy" age="9y 2m" sub="IAP 2024 schedule - Paediatric" pct={84} given={18} overdue={1} upcoming={3} overdueText="Tdap booster (due Sep 2023 - 18 months late)" upcomingText="Typhoid booster (Apr 26) - Flu Oct 26 - HPV series (age 11-12)" />
    <PersonCard name="Raj Reddy" age="41M" sub="Adult schedule - Unknown baseline" pct={65} given={0} overdue={2} upcoming={2} overdueText="Tdap booster - HepB (status unknown)" upcomingText="Flu Oct 26 - Pneumococcal recommended (40+)" />
  </View>
);

const TimelinePanel = () => (
  <View>
    <Section title="Recent vaccinations - family" />
    {[
      {date: '15 Mar 2026', name: 'Influenza (Quadrivalent) - Priya', detail: 'Apollo Clinic, Banjara Hills - Deltoid L - No AEFI - Lot: FLU26-0391', color: Colors.accent},
      {date: '10 Jan 2026', name: 'Shingrix (Dose 1 of 2) - Priya', detail: 'Dr. Kavitha Sharma - Deltoid R - Mild arm soreness 24h', color: Colors.accent},
      {date: '20 Oct 2025', name: 'Influenza - Aarav', detail: 'KIMS Hospital - Deltoid L - No AEFI - Annual paediatric dose', color: Colors.accent},
      {date: '15 Oct 2025', name: 'Influenza - Raj', detail: 'Apollo Pharmacy clinic - Deltoid R - No AEFI', color: Colors.accent},
      {date: 'Mar 2025 - MISSED', name: 'HepA Dose 2 (booster) - Priya', detail: 'Due 12 months after Dose 1 (Mar 2024) - not received. Now 12 months overdue.', color: Colors.red},
      {date: '5 Feb 2025', name: 'COVID-19 booster (XBB.1.5) - Priya', detail: 'GHMC camp, Banjara Hills - Deltoid L - Mild fever 24h - 5th COVID dose', color: Colors.accent},
      {date: '22 Nov 2024', name: 'Varicella (Dose 2) - Aarav', detail: 'Dr. Preethi Rao - KIMS Hospital - Subcutaneous - No AEFI', color: Colors.accent},
      {date: 'Aug 2024 - catch-up', name: 'HPV (Gardasil-9, Dose 1) - Aarav', detail: 'IAP 2024 catch-up - age 9 - KIMS Hospital - Deltoid R', color: Colors.accent},
    ].map((node, i, arr) => <TimelineNode key={i} {...node} isLast={i === arr.length - 1} />)}
    <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(8)}}>Showing last 8 entries - 47 total doses across family</AppText>
  </View>
);

const PriyaPanel = () => (
  <View>
    <Section title="Priya - 38F - Adult schedule" />
    <RecordRow icon="checkmark-circle-outline" iconBg={Colors.tealBg} name="Influenza 2026 (Quadrivalent)" meta="15 Mar 2026 - Apollo Clinic, Banjara Hills - Deltoid L" chips={[{label: 'Annual'}, {label: 'No AEFI'}]} dateText="15 Mar 26" statusLabel="Done" statusBg={Colors.tealBg} statusColor={Colors.tealText} />
    <RecordRow icon="time-outline" iconBg={Colors.amberBg} name="Shingrix (Zoster vaccine, Dose 1 of 2)" meta="10 Jan 2026 - Dr. Kavitha Sharma - Dose 2 due May 2026" chips={[{label: 'Dose 2 due May', bg: Colors.amberBg, color: Colors.amberDark}, {label: 'Mild soreness'}]} dateText="10 Jan 26" statusLabel="Partial" statusBg={Colors.amberBg} statusColor={Colors.amberDark} />
    <RecordRow icon="checkmark-circle-outline" iconBg={Colors.tealBg} name="COVID-19 booster (XBB.1.5 bivalent)" meta="5 Feb 2025 - GHMC camp - 5th dose - Mild fever 24h" chips={[{label: '5th dose'}, {label: 'Low-grade fever'}]} dateText="5 Feb 25" statusLabel="Done" statusBg={Colors.tealBg} statusColor={Colors.tealText} />
    <RecordRow icon="alert-circle-outline" iconBg={Colors.redBg} name="Hepatitis A (Dose 2 - OVERDUE)" meta="Dose 1: Mar 2024 - Dose 2 was due: Mar 2025 - Now 12+ months overdue" chips={[{label: '12 months overdue', bg: Colors.redBg, color: Colors.redDark}]} dateText="Overdue" statusLabel="Act now" statusBg={Colors.redBg} statusColor={Colors.redDark} />
    <RecordRow icon="checkmark-circle-outline" iconBg={Colors.tealBg} name="Influenza 2025" meta="Oct 2025 - Apollo Pharmacy clinic - Deltoid R" dateText="Oct 25" statusLabel="Done" statusBg={Colors.tealBg} statusColor={Colors.tealText} />
    <RecordRow icon="checkmark-circle-outline" iconBg={Colors.tealBg} name="Tdap booster" meta="Jul 2019 - Dr. Kavitha - Next due 2029" dateText="Jul 19" statusLabel="Done" statusBg={Colors.tealBg} statusColor={Colors.tealText} />
    <RecordRow icon="help-circle-outline" iconBg={Colors.blueBg} name="Hepatitis B series" meta="Status unknown - no records found - Titer test recommended" chips={[{label: 'Check titer', bg: Colors.blueBg, color: Colors.blueText}]} dateText="Unknown" statusLabel="Verify" statusBg={Colors.blueBg} statusColor={Colors.blueText} />
  </View>
);

const AaravPanel = () => (
  <View>
    <Section title="Aarav - 9y 2m - IAP 2024" />
    <RecordRow icon="alert-circle-outline" iconBg={Colors.redBg} name="Tdap booster - OVERDUE" meta="Due Sep 2023 - Now 18 months overdue - Last Tdap: Sep 2018" chips={[{label: '18 months late', bg: Colors.redBg, color: Colors.redDark}, {label: 'School entry risk', bg: Colors.redBg, color: Colors.redDark}]} dateText="Overdue" statusLabel="" statusBg="" statusColor={Colors.red} />
    <RecordRow icon="time-outline" iconBg={Colors.amberBg} name="Typhoid Vi polysaccharide booster" meta="Due: Apr 26, 2026 - Last given Apr 2023" chips={[{label: 'Due this month', bg: Colors.amberBg, color: Colors.amberDark}]} dateText="Apr 26" statusLabel="" statusBg="" statusColor="#F97316" />
    <RecordRow icon="checkmark-circle-outline" iconBg={Colors.tealBg} name="Varicella (Chickenpox) Dose 2" meta="22 Nov 2024 - KIMS Hospital - No AEFI" dateText="Nov 24" statusLabel="Done" statusBg={Colors.tealBg} statusColor={Colors.tealText} />
    <RecordRow icon="time-outline" iconBg={Colors.amberBg} name="HPV Gardasil-9 (Dose 1 of 2)" meta="Aug 2024 - Dose 2 due Feb 2025 - Status unconfirmed" chips={[{label: 'Dose 2 status unclear', bg: Colors.amberBg, color: Colors.amberDark}]} dateText="Aug 24" statusLabel="" statusBg="" statusColor="" />
    <RecordRow icon="checkmark-circle-outline" iconBg={Colors.tealBg} name="MMR (Measles, Mumps, Rubella) Dose 2" meta="Apr 2019 - Dose 1: Apr 2017 - Complete series" dateText="Apr 19" statusLabel="Done" statusBg={Colors.tealBg} statusColor={Colors.tealText} />
    <AppText variant="small" color={Colors.textTertiary} style={{textAlign: 'center', marginTop: vs(6)}}>+13 more childhood doses - All given per IAP schedule</AppText>
  </View>
);

const RajPanel = () => (
  <View>
    <Section title="Raj - 41M - Adult schedule" />
    <View style={st.infoBox}><AppText variant="small" color={Colors.blueText} style={{lineHeight: ms(16)}}><AppText style={{fontWeight: '700'}}>Baseline vaccination history incomplete.</AppText> Raj's pre-2022 records are unavailable. Coverage estimate of 65% is based on what has been logged. A titer test is recommended.</AppText></View>
    <RecordRow icon="checkmark-circle-outline" iconBg={Colors.tealBg} name="Influenza 2025" meta="Oct 2025 - Apollo Pharmacy - Deltoid R - No AEFI" dateText="Oct 25" />
    <RecordRow icon="checkmark-circle-outline" iconBg={Colors.tealBg} name="COVID-19 Dose 4 (bivalent)" meta="Apr 2024 - GHMC camp - 4th dose" dateText="Apr 24" />
    <RecordRow icon="alert-circle-outline" iconBg={Colors.redBg} name="Tdap booster - OVERDUE" meta="Last given: unknown - 10-year booster due - At risk without records" chips={[{label: 'Overdue', bg: Colors.redBg, color: Colors.redDark}]} dateText="Overdue" statusLabel="" statusBg="" statusColor={Colors.red} />
    <RecordRow icon="information-circle-outline" iconBg={Colors.blueBg} name="Pneumococcal vaccine" meta="Not yet given - Recommended: adults 40+ by IAP - One-time" chips={[{label: 'Discuss with doctor', bg: Colors.blueBg, color: Colors.blueText}]} dateText="Discuss" statusLabel="" statusBg="" statusColor={Colors.blueText} />
  </View>
);

const AefiPanel = () => (
  <View>
    <Section title="Adverse events following immunisation" />
    <View style={[st.infoBox, {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen}]}>
      <AppText variant="small" color={Colors.tealText} style={{lineHeight: ms(16)}}><AppText style={{fontWeight: '700'}}>3 AEFIs recorded in 47 total doses (6.4% rate).</AppText> All were minor - no serious adverse events. Well within expected normal range.</AppText>
    </View>
    <RecordRow icon="bandage-outline" iconBg={Colors.amberBg} name="Arm soreness - Shingrix Dose 1" meta="Priya - 10 Jan 2026 - Deltoid R - Onset: same day - Duration: 24 hours" chips={[{label: 'Mild - Local', bg: Colors.amberBg, color: Colors.amberDark}, {label: 'Expected for Shingrix'}]} dateText="Jan 26" statusLabel="Mild" statusBg={Colors.amberBg} statusColor={Colors.amberDark} />
    <RecordRow icon="thermometer-outline" iconBg={Colors.amberBg} name="Low-grade fever (38.1C) - COVID-19 booster" meta="Priya - 5 Feb 2025 - Onset: 8 hours post-vaccination - Duration: 18 hours - Paracetamol given" chips={[{label: 'Mild - Systemic', bg: Colors.amberBg, color: Colors.amberDark}, {label: 'Paracetamol resolved'}]} dateText="Feb 25" statusLabel="Mild" statusBg={Colors.amberBg} statusColor={Colors.amberDark} />
    <RecordRow icon="color-palette-outline" iconBg={Colors.amberBg} name="Mild injection-site rash - MMR Dose 2" meta="Aarav - Apr 2019 - Local rash at injection site Day 3 - Self-resolved Day 5" chips={[{label: 'Mild - Local', bg: Colors.amberBg, color: Colors.amberDark}]} dateText="Apr 19" statusLabel="Mild" statusBg={Colors.amberBg} statusColor={Colors.amberDark} />
    <View style={[st.infoBox, {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen, marginTop: vs(4)}]}>
      <AppText variant="small" color={Colors.tealText} style={{lineHeight: ms(16)}}>No anaphylaxis, no serious AEFIs, no hospitalisations from vaccination in this family. All future vaccinations can proceed per schedule without pre-medication.</AppText>
    </View>
  </View>
);

const VaccineRecordsTab = ({navigation}) => {
  const [filter, setFilter] = useState('coverage');

  return (
    <View>
      {/* Stats banner */}
      <View style={st.statsBanner}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(10)}}>
          <View style={st.statsIcon}><Icon family="Ionicons" name="shield-checkmark-outline" size={ms(22)} color={Colors.white} /></View>
          <View><AppText variant="bodyBold" color={Colors.white}>Immunisation history</AppText><AppText variant="small" color="rgba(255,255,255,0.6)">Family - All records</AppText></View>
        </View>
        <View style={st.statsGrid}>
          {[{l: 'Total doses', v: '47', s2: 'family - all time'}, {l: 'Overdue', v: '3', s2: 'across family', c: '#F97316'}, {l: 'Last given', v: '15 Mar', s2: 'Flu - Priya'}, {l: 'Next due', v: 'Apr 26', s2: 'Typhoid - Aarav'}].map((item, i) => (
            <View key={i} style={st.statCell}>
              <AppText variant="subtext" color="rgba(255,255,255,0.4)" style={{textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(3)}}>{item.l}</AppText>
              <AppText variant="header" color={item.c || Colors.white} style={{fontWeight: '800', fontSize: ms(14)}}>{item.v}</AppText>
              <AppText variant="subtext" color="rgba(255,255,255,0.5)" style={{marginTop: vs(1)}}>{item.s2}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Filter pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: vs(10)}} contentContainerStyle={{gap: s(5)}}>
        {FILTERS.map(f => {
          const on = filter === f.key;
          return (
            <TouchableOpacity key={f.key} style={[st.pill, on && st.pillOn]} onPress={() => setFilter(f.key)} activeOpacity={0.7}>
              <AppText variant="small" color={on ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{f.label}</AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Ayu Intel button */}
      <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'vaccine', initialTab: 'vaccineIntel'})}>
        <View style={st.ayuIcon}><Icon family="Ionicons" name="bulb-outline" size={ms(16)} color={Colors.white} /></View>
        <View style={{flex: 1}}>
          <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - Immunisation</AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.7)">Protection gaps - T2DM risks - Family plan</AppText>
        </View>
        <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      {/* Panels */}
      {filter === 'coverage' && <CoveragePanel />}
      {filter === 'timeline' && <TimelinePanel />}
      {filter === 'priya' && <PriyaPanel />}
      {filter === 'aarav' && <AaravPanel />}
      {filter === 'raj' && <RajPanel />}
      {filter === 'aefi' && <AefiPanel />}
    </View>
  );
};

const st = StyleSheet.create({
  statsBanner: {backgroundColor: Colors.primary, borderRadius: ms(16), padding: ms(14), marginBottom: vs(10)},
  statsIcon: {width: ms(44), height: ms(44), borderRadius: ms(12), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  statsGrid: {flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: ms(12), overflow: 'hidden'},
  statCell: {flex: 1, padding: ms(9), backgroundColor: 'rgba(0,0,0,0.2)'},
  pill: {paddingHorizontal: s(13), paddingVertical: vs(7), borderRadius: ms(20), backgroundColor: Colors.white, borderWidth: 1, borderColor: '#dde8e2'},
  pillOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  ayuBtn: {flexDirection: 'row', alignItems: 'center', gap: s(8), backgroundColor: Colors.accent, borderRadius: ms(12), padding: ms(12), marginBottom: vs(10)},
  ayuIcon: {width: ms(34), height: ms(34), borderRadius: ms(9), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(12), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'},
  personCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(13), marginBottom: vs(9)},
  avatar: {width: ms(40), height: ms(40), borderRadius: ms(12), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center'},
  progressBar: {height: ms(8), backgroundColor: '#e5e7eb', borderRadius: ms(4), overflow: 'hidden', marginBottom: vs(6)},
  progressFill: {height: '100%', borderRadius: ms(4), backgroundColor: Colors.accent},
  miniStat: {flex: 1, borderRadius: ms(8), padding: ms(7), alignItems: 'center'},
  rrow: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(11), marginBottom: vs(7), flexDirection: 'row', alignItems: 'flex-start', gap: s(10)},
  rrowIcon: {width: ms(36), height: ms(36), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center'},
  chip: {backgroundColor: Colors.tealBg, paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(8)},
  badge: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(8), marginTop: vs(3)},
  infoBox: {backgroundColor: Colors.blueBg, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#93C5FD', padding: ms(11), marginBottom: vs(10)},
  tlLine: {position: 'absolute', left: ms(6), top: ms(14), bottom: 0, width: ms(2)},
  tlDot: {width: ms(14), height: ms(14), borderRadius: ms(7), borderWidth: 2, borderColor: Colors.white, elevation: 2, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.15, shadowRadius: 2},
  tlContent: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(10)},
});

export default VaccineRecordsTab;
