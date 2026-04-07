import React from 'react';
import {View, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const InsightRow = ({color, children}) => (
  <View style={st.insightRow}>
    <View style={[st.insightDot, {backgroundColor: color}]} />
    <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(18)}}>{children}</AppText>
  </View>
);

const Card = ({icon, iconBg, title, sub, badge, badgeBg, badgeColor, children}) => (
  <View style={st.card}>
    <View style={st.cardHdr}>
      <View style={[st.cardIcon, {backgroundColor: iconBg}]}><Icon family="Ionicons" name={icon} size={ms(16)} color={Colors.white} /></View>
      <View style={{flex: 1}}><AppText variant="bodyBold" color={Colors.textPrimary}>{title}</AppText><AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(1)}}>{sub}</AppText></View>
      {badge && <View style={[st.badge, {backgroundColor: badgeBg}]}><AppText variant="subtext" color={badgeColor} style={{fontWeight: '700'}}>{badge}</AppText></View>}
    </View>
    <View style={st.cardBody}>{children}</View>
  </View>
);

const ProtectionCell = ({icon, name, status, statusStyle, detail}) => (
  <View style={st.pgCell}>
    <Icon family="Ionicons" name={icon} size={ms(18)} color={Colors.primary} style={{marginBottom: vs(4)}} />
    <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700', marginBottom: vs(2)}}>{name}</AppText>
    <View style={[st.pgStatus, statusStyle]}><AppText variant="subtext" color={statusStyle.color} style={{fontWeight: '700'}}>{status}</AppText></View>
    <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(3), lineHeight: ms(12)}}>{detail}</AppText>
  </View>
);

/* TAB 1: OVERVIEW */
export const VaccOverviewPanel = () => (
  <View>
    <View style={st.alertBox}>
      <Icon family="Ionicons" name="warning-outline" size={ms(16)} color={Colors.redDark} />
      <AppText variant="caption" color={Colors.redDark} style={{flex: 1, lineHeight: ms(18)}}><AppText style={{fontWeight: '700'}}>3 overdue vaccines across your family.</AppText> Aarav's Tdap is 18 months overdue - a school-entry risk. Priya's HepA Dose 2 is 12 months overdue. Raj's Tdap status is unknown.</AppText>
    </View>

    <Card icon="flag-outline" iconBg={Colors.accent} title="Priority actions this month" sub="Ranked by urgency - your family">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Aarav: Tdap booster immediately.</AppText> 18 months overdue. At age 9 in school, Aarav is exposed to pertussis. Unvaccinated contacts can transmit to Priya, whose T2DM makes pertussis complications more dangerous. Book this week.</InsightRow>
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Aarav: Typhoid booster (due Apr 26).</AppText> 3-year cycle. Can be done same visit as Tdap.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Priya: HepA Dose 2 (overdue 12 months).</AppText> Without the booster, Dose 1 provides only 1-2 years of partial protection. HepA severity is significantly higher in T2DM - hospitalisation rates are 3x higher.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Priya: Shingrix Dose 2 (due May 2026).</AppText> Without Dose 2, protection drops from 97% to ~50%. T2DM patients are 2x more likely to develop shingles.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Priya: Hepatitis B titer check.</AppText> HepB status is unknown. T2DM dramatically increases HepB transmission risk. If titer {'<'}10 mIU/mL - 3-dose series required.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Raj: Tdap booster and baseline titer check.</AppText> No records available. Recommend anti-Td titer to assess existing tetanus immunity.</InsightRow>
    </Card>

    <Card icon="shield-checkmark-outline" iconBg={Colors.primary} title="Disease protection status - Priya" sub="What you are and are not currently protected against">
      <View style={st.pgGrid}>
        <ProtectionCell icon="fitness-outline" name="Influenza" status="Protected" statusStyle={st.pgsOk} detail="Vaccinated Mar 2026 - Annual repeat Oct" />
        <ProtectionCell icon="shield-outline" name="COVID-19" status="Protected" statusStyle={st.pgsOk} detail="XBB booster Feb 2025 - 5th dose" />
        <ProtectionCell icon="shield-checkmark-outline" name="Tetanus/Pertussis" status="Protected" statusStyle={st.pgsOk} detail="Tdap Jul 2019 - Next 2029" />
        <ProtectionCell icon="medkit-outline" name="Typhoid" status="Partial" statusStyle={st.pgsPartial} detail="Booster overdue Apr 26" />
        <ProtectionCell icon="water-outline" name="Hepatitis A" status="Partial" statusStyle={st.pgsPartial} detail="Dose 1 only - Dose 2 12m late" />
        <ProtectionCell icon="flask-outline" name="Hepatitis B" status="Unknown" statusStyle={st.pgsNone} detail="No records - Titer test needed" />
        <ProtectionCell icon="flame-outline" name="Shingles" status="Partial" statusStyle={st.pgsPartial} detail="Dose 1 of 2 - Dose 2 due May" />
        <ProtectionCell icon="pulse-outline" name="Pneumococcal" status="Not given" statusStyle={st.pgsNone} detail="Recommended for T2DM any age" />
      </View>
    </Card>
  </View>
);

/* TAB 2: PROTECTION GAPS */
export const VaccGapsPanel = () => (
  <View>
    <Card icon="alert-circle-outline" iconBg={Colors.red} title="Pneumococcal vaccine - critical gap" sub="Recommended for all T2DM adults - not yet given" badge="Missing" badgeBg={Colors.redBg} badgeColor={Colors.redDark}>
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Pneumococcal disease is 4-6x more likely to be severe in T2DM patients.</AppText> The Indian Academy of Physicians and the ADA both recommend pneumococcal vaccination for all adults with diabetes regardless of age.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Which vaccine:</AppText> PCV15 (Vaxneuvance) or PCV20 (Prevnar 20) - a single dose, no booster required. Available at Apollo, KIMS (Rs 3,000-5,000).</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Influenza + pneumococcal given together</AppText> reduces hospitalisation from respiratory illness in T2DM by up to 55%. Prioritise giving both at October 2026 visit.</InsightRow>
    </Card>

    <Card icon="flask-outline" iconBg={Colors.red} title="Hepatitis B - unknown status + T2DM risk" sub="High-risk gap given diabetes management">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>T2DM patients are 2x more likely to be HBsAg positive</AppText> than the general population. Glucose meter sharing and frequent blood draws are transmission pathways.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Step 1: Anti-HBs titer test.</AppText> If {'>'}10 mIU/mL - already immune. If {'<'}10 mIU/mL - begin 3-dose series. Can be added to your TrustLab panel for Rs 800-1,200.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Do not re-vaccinate blindly.</AppText> If vaccinated as a child, immunity may still be present - titer test is cheaper and more accurate.</InsightRow>
    </Card>

    <Card icon="shield-outline" iconBg="#7C3AED" title="HPV vaccine - Priya's eligibility window" sub="Age 27-45 catch-up - discuss with Dr. Kavitha">
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>Gardasil-9 is now approved for adults aged 27-45</AppText> in India (CDSCO 2023). At 38, Priya is within the eligibility window. HPV causes 99% of cervical cancers.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>T2DM does not contraindicate HPV vaccination</AppText> but may affect immune response slightly. Discuss with Dr. Kavitha.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Aarav's HPV Dose 2 should also be confirmed.</AppText> Dose 1 was given Aug 2024 - Dose 2 was due Feb 2025. If not given, interval can be extended but should not exceed 2 years.</InsightRow>
    </Card>

    <Card icon="airplane-outline" iconBg={Colors.blueText} title="Travel immunity gaps" sub="If travelling outside Hyderabad / internationally">
      <InsightRow color={Colors.blueText}><AppText style={{fontWeight: '700'}}>Cholera vaccine (Dukoral):</AppText> Not given. If travelling to rural India or flood-affected areas. 2 doses, 1 week apart. No contraindication with T2DM.</InsightRow>
      <InsightRow color={Colors.blueText}><AppText style={{fontWeight: '700'}}>Japanese Encephalitis (JE):</AppText> Not given. Recommended for rural travel ({'>'}1 month) in endemic areas.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Meningococcal (MCV4):</AppText> Required for Hajj/Umrah. Also recommended for residential school.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Yellow Fever:</AppText> Required certificate for entry to many African and South American countries. Single dose, valid for life.</InsightRow>
    </Card>
  </View>
);

/* TAB 3: CONDITIONS */
export const VaccConditionsPanel = () => (
  <View>
    <Card icon="water-outline" iconBg="#F0B429" title="T2DM - Vaccine correlations" sub="Why Priya's vaccination priority is higher than average">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Influenza hospitalisation risk is 3x higher in T2DM.</AppText> A 2022 meta-analysis found that influenza vaccination reduces hospitalisation in T2DM patients by 45%. Your annual flu vaccine is the single most impactful vaccine.</InsightRow>
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Vaccine-preventable infections raise blood glucose.</AppText> Any febrile illness causes a stress hormone surge that raises glucose by 3-5 mmol/L for days. In T2DM, this can trigger DKA or HHS.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Immune response to vaccines is blunted in T2DM.</AppText> Hyperglycaemia reduces post-vaccination antibody titres by 15-25%. HbA1c improvement makes vaccines more effective.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>COVID-19 mortality was 7.5% in T2DM vs 1.4% in non-diabetic adults.</AppText> Your 5-dose COVID schedule is one of your most protective decisions.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Shingles recurrence rate is 2x higher in T2DM.</AppText> At 38, T2DM advances the risk window by ~10 years. Shingrix Dose 2 in May is essential to reach 97% efficacy.</InsightRow>
    </Card>

    <Card icon="heart-outline" iconBg={Colors.blueText} title="Hypertension + NAFLD - Vaccines" sub="Additional risk stratification">
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>NAFLD Grade 1 + Hepatitis A:</AppText> In patients with any hepatic dysfunction, HepA infection can precipitate acute-on-chronic liver failure. Your HepA Dose 2 being overdue is particularly concerning.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Hepatitis B + NAFLD:</AppText> Co-infection with HBV in a patient with existing NAFLD dramatically accelerates liver fibrosis. Ensuring HepB immunity is protective.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Hypertension and influenza:</AppText> Severe influenza can trigger a hypertensive crisis through the cytokine storm. Your annual flu vaccine is doubly protective.</InsightRow>
    </Card>

    <Card icon="git-branch-outline" iconBg={Colors.primary} title="Immunity waning - schedule review" sub="When protection expires for your given vaccines">
      <View style={st.tableCard}>
        <View style={st.tableHdr}>
          <AppText variant="subtext" color={Colors.tealText} style={{flex: 1.5, fontWeight: '700', textTransform: 'uppercase'}}>Vaccine</AppText>
          <AppText variant="subtext" color={Colors.tealText} style={{flex: 1, fontWeight: '700', textTransform: 'uppercase'}}>Duration</AppText>
          <AppText variant="subtext" color={Colors.tealText} style={{flex: 1, fontWeight: '700', textTransform: 'uppercase'}}>Priya next due</AppText>
        </View>
        {[
          ['Influenza', 'Annual', 'Oct 2026', Colors.accent],
          ['COVID booster', 'Annual', 'Due Feb 2026', '#F0B429'],
          ['Typhoid (Vi)', '3 years', 'Apr 2026 !', Colors.red],
          ['Tdap booster', '10 years', '2029', Colors.accent],
          ['Shingrix (2-dose)', 'Lifelong', 'Dose 2: May', '#F0B429'],
          ['HepA (complete)', '25+ years', 'Dose 2 overdue', Colors.red],
          ['Pneumococcal', 'Lifelong', 'Not given', Colors.red],
        ].map(([name, dur, due, dueColor], i) => (
          <View key={i} style={st.tableRow}>
            <AppText variant="small" color={Colors.textPrimary} style={{flex: 1.5, fontWeight: '600'}}>{name}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{flex: 1}}>{dur}</AppText>
            <AppText variant="small" color={dueColor} style={{flex: 1, fontWeight: '600'}}>{due}</AppText>
          </View>
        ))}
      </View>
    </Card>

    <Card icon="happy-outline" iconBg="#7C3AED" title="Vaccination and mental health" sub="Depression, anxiety and vaccine efficacy">
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>Depression reduces vaccine immune response.</AppText> Chronic stress suppresses NK cell activity - reducing post-vaccination antibody titres by up to 20%. Your PHQ-9 of 11 means recent vaccines may have generated slightly lower titres.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Treating depression improves vaccine response.</AppText> SSRI therapy and CBT both improve antibody responses to influenza vaccination in depressed patients.</InsightRow>
    </Card>
  </View>
);

/* TAB 4: FAMILY */
export const VaccFamilyPanel = () => (
  <View>
    <Card icon="people-outline" iconBg={Colors.accent} title="Herd protection - your household" sub="How each member protects the others">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Aarav's Tdap gap puts Priya at risk.</AppText> Children in school are the primary transmission vector for pertussis in Indian households. Aarav's 18-month overdue status is a direct risk to Priya.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Raj's unknown Tdap status compounds this.</AppText> All three family members should be Tdap-vaccinated within the same 2-week window for complete household protection.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Annual flu vaccination of all family members</AppText> reduces Priya's flu risk by 72% (household transmission model). October 2026 should be a family appointment.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>COVID household protection:</AppText> All three being vaccinated reduces household transmission chains. Ensure Aarav receives age-appropriate COVID updates.</InsightRow>
    </Card>

    <Card icon="person-outline" iconBg="#F97316" title="Aarav: next 3 years plan" sub="Age 9-12 - IAP 2024 paediatric schedule">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Immediate (now):</AppText> Tdap booster (overdue) + Typhoid Vi booster (Apr 26). Can be given same visit. KIMS paediatrics or Apollo children's.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Confirm HPV Dose 2 status.</AppText> If missed (due Feb 2025), it can still be given up to 24 months after Dose 1. If more than 24 months pass (Aug 2026), series must restart.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Age 11-12:</AppText> HPV complete series, Tdap booster again if first given late, Meningococcal MCV4 if planning residential schooling. Annual flu every October.</InsightRow>
      <InsightRow color={Colors.blueText}><AppText style={{fontWeight: '700'}}>School entry documentation:</AppText> Tdap being overdue may create issues at the next school medical review. Get Tdap done and update the school nurse immediately.</InsightRow>
    </Card>

    <Card icon="person-outline" iconBg={Colors.blueText} title="Raj: recommended catch-up" sub="Age 41 - incomplete baseline records">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Priority 1 - Tdap.</AppText> Book immediately without waiting for titer results. Risk of vaccinating someone already immune is minimal.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Priority 2 - Titer panel.</AppText> HBsAg + anti-HBs + anti-HBc, anti-HAV IgG, MMR IgG. Approximately Rs 2,000-3,000 at TrustLab.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Priority 3 - Pneumococcal.</AppText> At 41, approaching the age where PCV20 is broadly recommended. Single dose, can be given same visit as Tdap.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Annual influenza from October.</AppText> Raj was vaccinated Oct 2025. Ensure October 2026 is a family appointment. Employer may offer workplace flu camps.</InsightRow>
    </Card>

    <Card icon="location-outline" iconBg={Colors.accent} title="Where to vaccinate in Hyderabad" sub="Trusted centres with cold chain certification">
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Apollo Clinic, Banjara Hills</AppText> - Dr. Kavitha's clinic. All adult vaccines including Shingrix, PCV20, and travel vaccines. Cold chain certified. Best for Priya's Shingrix Dose 2 + HepA Dose 2 + Pneumococcal.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>KIMS Hospital, Secunderabad</AppText> - Aarav's paediatrician (Dr. Preethi Rao). All IAP schedule vaccines. Best for Aarav's Tdap + Typhoid catch-up.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Apollo Pharmacy vaccination booths</AppText> (Banjara Hills, Jubilee Hills, Madhapur) - Walk-in for flu, COVID, Tdap. Convenient for Raj's catch-up. Cost: flu Rs 400-700, Tdap Rs 800-1,200.</InsightRow>
      <InsightRow color={Colors.blueText}><AppText style={{fontWeight: '700'}}>GHMC vaccination camps</AppText> - Free COVID and government schedule vaccines. Annual flu camps in October. Good for COVID annual updates at no cost.</InsightRow>
    </Card>
  </View>
);

const st = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(15), borderWidth: 0.5, borderColor: '#dde8e2', marginBottom: vs(9), overflow: 'hidden'},
  cardHdr: {flexDirection: 'row', alignItems: 'center', gap: s(9), padding: ms(12), borderBottomWidth: 0.5, borderBottomColor: '#e8f3e4'},
  cardIcon: {width: ms(34), height: ms(34), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center'},
  cardBody: {padding: ms(12)},
  badge: {paddingHorizontal: s(9), paddingVertical: vs(2), borderRadius: ms(8)},
  insightRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(9), paddingVertical: vs(8), borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'},
  insightDot: {width: ms(7), height: ms(7), borderRadius: ms(4), marginTop: vs(5)},
  alertBox: {backgroundColor: Colors.redBg, borderRadius: ms(12), borderWidth: 1, borderColor: '#FDA4A4', padding: ms(11), marginBottom: vs(9), flexDirection: 'row', alignItems: 'flex-start', gap: s(9)},
  pgGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(7)},
  pgCell: {width: '47%', flexGrow: 1, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(10), backgroundColor: Colors.white},
  pgStatus: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(8), alignSelf: 'flex-start'},
  pgsOk: {backgroundColor: Colors.tealBg, color: Colors.tealText},
  pgsPartial: {backgroundColor: Colors.amberBg, color: Colors.amberDark},
  pgsNone: {backgroundColor: Colors.redBg, color: Colors.redDark},
  tableCard: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#dde8e2', overflow: 'hidden'},
  tableHdr: {flexDirection: 'row', backgroundColor: '#e8f3e4', padding: ms(7), paddingHorizontal: s(12), gap: s(4), borderBottomWidth: 0.5, borderBottomColor: '#dde8e2'},
  tableRow: {flexDirection: 'row', padding: ms(8), paddingHorizontal: s(12), borderBottomWidth: 0.5, borderBottomColor: '#e8f3e4', gap: s(4)},
});
