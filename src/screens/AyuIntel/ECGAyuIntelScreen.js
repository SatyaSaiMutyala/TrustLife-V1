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

/* TAB 1: OVERVIEW */
export const ECGOverviewPanel = () => (
  <View>
    <Card icon="checkmark-circle-outline" iconBg={Colors.accent} title="Current ECG - Normal sinus rhythm" sub="28 Mar 2026 - HR 72 - QTc 418ms - No ST changes" badge="Normal" badgeBg={Colors.tealBg} badgeColor={Colors.tealText}>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>All key intervals are within normal limits.</AppText> PR 158ms (normal 120-200), QRS 88ms (normal {'<'}120), QTc 418ms (normal {'<'}460ms for women), axis +42 (normal range). Consistent with baseline from Jan 14, 2026.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>HRV of 28ms (from Feb Holter) is below the optimal 40-60ms range.</AppText> Low HRV in T2DM is an early marker of cardiac autonomic neuropathy (CAN) - a complication affecting ~30% of T2DM patients within 10 years.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>PVC burden of 1.2% (Feb Holter) requires repeat monitoring.</AppText> Scheduled for Aug 2026. PVCs {'>'}2% or if symptomatic, an echocardiogram is warranted.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>No atrial fibrillation detected</AppText> across all 9 ECGs including 24-hour Holter. AF is the highest-risk arrhythmia for T2DM + HTN patients (3-4x higher risk).</InsightRow>
    </Card>
    <Card icon="flag-outline" iconBg={Colors.blueText} title="Priority actions" sub="Based on your ECG history + health profile">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Annual 12-lead ECG is due.</AppText> Last clinical 12-lead was Jan 2026. Apple Watch and KardiaMobile do not replace a diagnostic 12-lead for detecting LVH, ischaemia, or bundle branch blocks.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>HRV improvement plan.</AppText> Your 28ms rMSSD improves with consistent sleep ({'>'}7 hours) and stress reduction. Even a 10ms improvement meaningfully reduces cardiac autonomic neuropathy risk.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Log your next palpitation episode immediately.</AppText> The Dec 2025 episode was captured on Apple Watch - this was the right action. If palpitations recur with dizziness, chest pain, or syncope, call 108 immediately.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>HbA1c improvement directly improves ECG parameters.</AppText> Every 1% reduction in HbA1c reduces QTc by approximately 4ms and reduces PVC burden.</InsightRow>
    </Card>
  </View>
);

/* TAB 2: CONDITIONS */
export const ECGConditionsPanel = () => (
  <View>
    <Card icon="heart-outline" iconBg="#F97316" title="Atrial fibrillation (AF) - elevated risk" sub="T2DM + HTN = 3-4x population risk" badge="Moderate risk" badgeBg={Colors.amberBg} badgeColor="#92400E">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Risk factors present:</AppText> T2DM (insulin resistance causes atrial fibrosis), hypertension (atrial pressure overload), female sex after age 35, and documented palpitation episode. No AF has been detected yet.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>AF detection strategy:</AppText> Apple Watch performs background rhythm monitoring - AF episodes lasting {'>'}30 seconds will trigger an alert. KardiaMobile records Lead I - sufficient to detect AF.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Your QTc of 418ms and absence of AF across 9 ECGs are strongly reassuring.</AppText> AF is not inevitable - it is a risk you are managing.</InsightRow>
    </Card>
    <Card icon="pulse-outline" iconBg={Colors.blueText} title="QTc prolongation - monitoring" sub="Drug-induced QTc is the highest risk in your profile">
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>QTc prolongation ({'>'}460ms in women) causes Torsades de Pointes (TdP)</AppText> - a potentially fatal ventricular arrhythmia. Your baseline QTc of 418ms has a 42ms safety margin.</InsightRow>
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Topiramate (migraine medication) has mild QTc-prolonging potential.</AppText> At your current dose and baseline, the risk is low - but combining with other QTc-prolonging drugs requires caution.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Hypokalaemia dramatically lengthens QTc.</AppText> Diuretics, vomiting, and poor diet can lower potassium. Monitor serum potassium alongside ECG QTc.</InsightRow>
    </Card>
    <Card icon="fitness-outline" iconBg={Colors.red} title="Left ventricular hypertrophy (LVH)" sub="HTN + T2DM = cumulative risk">
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Chronic hypertension causes the left ventricle to thicken.</AppText> Your SV1 + RV5 = 26mm - borderline for Sokolow-Lyon criteria ({'>'}35mm). LVH doubles stroke risk and increases AF risk 3-fold.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Echocardiogram</AppText> is far more sensitive than ECG for detecting LVH. A baseline echo at age 38-40 with T2DM + HTN is standard of care.</InsightRow>
    </Card>
    <Card icon="flash-outline" iconBg="#7C3AED" title="Cardiac autonomic neuropathy (CAN)" sub="T2DM complication - your HRV signals early risk">
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>CAN affects 20-30% of T2DM patients</AppText> and damages autonomic nerves controlling heart rate. Your HRV of 28ms is an early CAN signal. CAN is associated with 2-3x higher mortality in T2DM.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>HRV improvement:</AppText> Tight glycaemic control (HbA1c {'<'}7%), aerobic exercise, sleep improvement, and stress reduction all demonstrably improve HRV and slow CAN progression.</InsightRow>
    </Card>
    <Card icon="alert-outline" iconBg="#F0B429" title="PVCs and ectopic beats" sub="1.2% burden - borderline monitoring range">
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>PVC burden 1.2%</AppText> - above the 1% threshold for monitoring but below the 5% threshold for treatment. T2DM autonomic neuropathy is the most likely cause.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Aug 2026 Holter will be the key decision point.</AppText> If burden remains {'<'}2% and asymptomatic, continued monitoring is appropriate.</InsightRow>
    </Card>
  </View>
);

/* TAB 3: CORRELATIONS */
export const ECGCorrelationsPanel = () => (
  <View>
    <Card icon="water-outline" iconBg="#F0B429" title="T2DM - Cardiac rhythm" sub="Strongest driver in your cardiac profile">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>HbA1c directly correlates with QTc length.</AppText> Each 1% rise adds 4-6ms to QTc. Improving to HbA1c 6.5% could reduce your QTc by ~8ms.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Blood glucose fluctuations affect heart rate acutely.</AppText> Hypoglycaemia triggers catecholamine release, causing tachycardia and QTc prolongation.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Metformin is cardioprotective beyond glucose control.</AppText> Reduces cardiovascular events by 33% through AMPK activation, protecting cardiomyocytes from ischaemic injury.</InsightRow>
    </Card>
    <Card icon="medical-outline" iconBg={Colors.blueText} title="Medications - ECG correlations" sub="All your current medications assessed">
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Olmesartan (ARB):</AppText> Excellent cardiac profile. Reduces left atrial pressure, regresses LVH, no QTc or HR effect. The right antihypertensive class for your profile.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Topiramate (migraine):</AppText> Weak sodium channel blockade - minimal QTc effect at standard doses. Key caution: avoid combining with QTc-prolonging antibiotics.</InsightRow>
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Sumatriptan (acute migraine):</AppText> Causes transient coronary vasoconstriction. Your ECGs show no ischaemic changes - Sumatriptan is appropriate. Report chest tightness after a dose immediately.</InsightRow>
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>NSAIDs (Ibuprofen):</AppText> Sodium retention raises BP and can acutely increase HR. Your Dec 2025 tachycardia occurred 40 min after Ibuprofen - plausible contributing factor.</InsightRow>
    </Card>
    <Card icon="heart-outline" iconBg={Colors.red} title="Hypertension - ECG correlations" sub="BP directly shapes your ECG findings">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Your SV1 + RV5 = 26mm approaches the LVH threshold (35mm).</AppText> At BP 136/86, your left ventricle is under continuous pressure overload. Target BP {'<'}130/80 to halt progression.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Blood pressure and ECG should be checked together.</AppText> An ECG taken during uncontrolled BP may show transient ST changes from demand ischaemia.</InsightRow>
    </Card>
    <Card icon="bandage-outline" iconBg="#F97316" title="Anaemia - ECG" sub="Hb 11.8 g/dL - compensatory cardiac effects">
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Anaemia causes compensatory tachycardia.</AppText> At Hb 11.8, cardiac output is elevated by 15-20%. Iron repletion will improve cardiac efficiency - expect resting HR decrease by 4-8 bpm.</InsightRow>
    </Card>
    <Card icon="happy-outline" iconBg="#7C3AED" title="Stress, mood and sleep - ECG" sub="Autonomic nervous system is the link">
      <InsightRow color="#7C3AED"><AppText style={{fontWeight: '700'}}>Lowest HRV entries correlate with highest-stress days.</AppText> PHQ-9 of 11 and chronic stress directly reduce cardiac autonomic resilience.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Deep breathing activates the vagus nerve</AppText> - increasing HRV, reducing HR, and suppressing inflammatory cytokines. 10 minutes raises HRV for up to 6 hours. This is cardioprotective physiology.</InsightRow>
    </Card>
  </View>
);

/* TAB 4: CARE PLAN */
export const ECGCarePlanPanel = () => (
  <View>
    <View style={st.alertBox}>
      <Icon family="Ionicons" name="warning-outline" size={ms(16)} color={Colors.redDark} />
      <AppText variant="caption" color={Colors.redDark} style={{flex: 1, lineHeight: ms(18)}}><AppText style={{fontWeight: '700'}}>Call 108 immediately if:</AppText> Chest pain + ECG changes - Syncope (fainting) - Palpitations + dizziness + cannot stand - Heart rate {'>'}150 bpm at rest - QTc {'>'}500ms with symptoms.</AppText>
    </View>
    <Card icon="warning-outline" iconBg="#F0B429" title="When to seek urgent care" sub="Red flags requiring same-day or emergency assessment">
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Emergency (108):</AppText> Chest pain or pressure lasting {'>'}5 minutes. In T2DM, silent ischaemia occurs in up to 40% of cases without symptoms.</InsightRow>
      <InsightRow color={Colors.red}><AppText style={{fontWeight: '700'}}>Emergency (108):</AppText> Sudden-onset palpitations + fainting or near-fainting. Classic presentation of haemodynamically significant arrhythmia.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Same-day clinic call:</AppText> Palpitations lasting {'>'}30 minutes, new irregular rhythm on Apple Watch, resting HR consistently {'>'}120 or {'<'}45 bpm.</InsightRow>
    </Card>
    <Card icon="calendar-outline" iconBg={Colors.accent} title="ECG monitoring schedule" sub="Recommended for your T2DM + HTN profile">
      <View style={st.tableCard}>
        <View style={st.tableHdr}>
          <AppText variant="subtext" color={Colors.blueText} style={{flex: 1, fontWeight: '700', textTransform: 'uppercase'}}>Monitoring</AppText>
          <AppText variant="subtext" color={Colors.blueText} style={{flex: 1, fontWeight: '700', textTransform: 'uppercase'}}>Frequency</AppText>
          <AppText variant="subtext" color={Colors.blueText} style={{flex: 1, fontWeight: '700', textTransform: 'uppercase'}}>Next due</AppText>
        </View>
        {[
          ['Apple Watch daily', 'Daily / PRN', 'Ongoing', Colors.accent],
          ['KardiaMobile', 'Weekly resting', '4 Apr 2026', '#F0B429'],
          ['Clinical 12-lead', 'Annual', 'Jan 2027', '#F0B429'],
          ['24h Holter', '6-monthly', 'Aug 2026', Colors.red],
          ['Echocardiogram', 'Baseline', 'Not yet done', Colors.red],
        ].map(([name, freq, due, dueColor], i) => (
          <View key={i} style={st.tableRow}>
            <AppText variant="small" color={Colors.textPrimary} style={{flex: 1, fontWeight: '600'}}>{name}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{flex: 1}}>{freq}</AppText>
            <AppText variant="small" color={dueColor} style={{flex: 1, fontWeight: '600'}}>{due}</AppText>
          </View>
        ))}
      </View>
    </Card>
    <Card icon="fitness-outline" iconBg={Colors.accent} title="Exercise and cardiac safety" sub="Guidance for T2DM + HTN + ECG findings">
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Aerobic exercise is your most powerful cardiac medicine.</AppText> 150 minutes/week raises HRV by 12-18ms, reduces resting HR by 4-7 bpm, reduces AF risk by 25-30%. Your ECG does not restrict exercise.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Target HR:</AppText> 50-70% of max (91-129 bpm at age 38). Do not exceed 150 bpm without exercise stress test clearance.</InsightRow>
      <InsightRow color="#F97316"><AppText style={{fontWeight: '700'}}>Stop exercise and take ECG if:</AppText> chest tightness, jaw/arm discomfort, extreme shortness of breath, dizziness, or palpitations not resolving within 5 minutes.</InsightRow>
    </Card>
    <Card icon="analytics-outline" iconBg="#7C3AED" title="HRV improvement plan" sub="From 28ms - target 40ms within 6 months">
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Sleep (highest impact):</AppText> Each 30-min improvement adds 3-5ms to rMSSD. Reaching 7 hours could add 7-14ms. Same-time wake schedule is the most evidence-based intervention.</InsightRow>
      <InsightRow color={Colors.accent}><AppText style={{fontWeight: '700'}}>Deep breathing (vagal activation):</AppText> 10 minutes of resonance breathing (6 breaths/min) raises HRV acutely by 8-15ms. With daily practice this becomes baseline.</InsightRow>
      <InsightRow color="#F0B429"><AppText style={{fontWeight: '700'}}>Glycaemic control:</AppText> HbA1c reduction from 7.8% to 6.5% improves HRV by approximately 5-8ms through reduced autonomic neuropathy progression.</InsightRow>
      <InsightRow color={Colors.blueText}><AppText style={{fontWeight: '700'}}>Omega-3 fatty acids (2g EPA+DHA daily)</AppText> raise HRV by 3-7ms in controlled trials through anti-inflammatory and membrane-stabilising effects.</InsightRow>
    </Card>
  </View>
);

const st = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(15), borderWidth: 0.5, borderColor: '#ccdaeb', marginBottom: vs(9), overflow: 'hidden'},
  cardHdr: {flexDirection: 'row', alignItems: 'center', gap: s(9), padding: ms(12), borderBottomWidth: 0.5, borderBottomColor: '#EEF3FE'},
  cardIcon: {width: ms(34), height: ms(34), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center'},
  cardBody: {padding: ms(12)},
  badge: {paddingHorizontal: s(9), paddingVertical: vs(2), borderRadius: ms(8)},
  insightRow: {flexDirection: 'row', alignItems: 'flex-start', gap: s(9), paddingVertical: vs(8), borderBottomWidth: 0.5, borderBottomColor: '#f2f6fb'},
  insightDot: {width: ms(7), height: ms(7), borderRadius: ms(4), marginTop: vs(5)},
  alertBox: {backgroundColor: Colors.redBg, borderRadius: ms(12), borderWidth: 1, borderColor: '#FDA4A4', padding: ms(11), marginBottom: vs(9), flexDirection: 'row', alignItems: 'flex-start', gap: s(9)},
  tableCard: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#ccdaeb', overflow: 'hidden'},
  tableHdr: {flexDirection: 'row', backgroundColor: '#EEF3FE', padding: ms(7), paddingHorizontal: s(12), gap: s(4), borderBottomWidth: 0.5, borderBottomColor: '#ccdaeb'},
  tableRow: {flexDirection: 'row', padding: ms(8), paddingHorizontal: s(12), borderBottomWidth: 0.5, borderBottomColor: '#e8f0f8', gap: s(4)},
});
