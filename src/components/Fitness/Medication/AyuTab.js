import React, {useMemo} from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {
  MEDICATIONS,
  DRUG_INTERACTIONS,
  TIMING_TIPS,
  SIDE_EFFECTS_WATCH,
  BIOMARKER_IMPACT,
} from '../../../constants/medicationData';

/* ─── Constants ─────────────────────────────────────── */

const SEVERITY_COLORS = {
  MODERATE: {bg: Colors.amberBg, text: Colors.amberText, dot: Colors.amber},
  BENEFICIAL: {bg: Colors.tealBg, text: Colors.tealText, dot: Colors.accent},
  MONITOR: {bg: Colors.blueBg, text: Colors.blueText, dot: Colors.blue},
  HIGH: {bg: Colors.redBg, text: Colors.redText, dot: Colors.red},
  LOW: {bg: Colors.tealBg, text: Colors.tealText, dot: Colors.accent},
};

const STATUS_COLORS = {
  good: {bg: Colors.tealBg, text: Colors.tealText, border: Colors.accent},
  warning: {bg: Colors.amberBg, text: Colors.amberText, border: Colors.amber},
  info: {bg: Colors.blueBg, text: Colors.blueText, border: Colors.blue},
  critical: {bg: Colors.redBg, text: Colors.redText, border: Colors.red},
};

const SIDE_EFFECT_SEVERITY = {
  high: {bg: Colors.redBg, text: Colors.redText, border: Colors.red, label: 'HIGH'},
  moderate: {bg: Colors.amberBg, text: Colors.amberText, border: Colors.amber, label: 'MODERATE'},
  low: {bg: Colors.tealBg, text: Colors.tealText, border: Colors.accent, label: 'LOW'},
  info: {bg: Colors.blueBg, text: Colors.blueText, border: Colors.blue, label: 'INFO'},
};

/* ─── Fallback Data ────────────────────────────────── */

const FALLBACK_INTERACTIONS = [
  {id: 'int1', title: 'Metformin + Atorvastatin', severity: 'MODERATE', body: 'Atorvastatin may slightly increase blood glucose levels. Monitor fasting glucose closely when both medications are taken together.'},
  {id: 'int2', title: 'Metformin + Methylcobalamin', severity: 'BENEFICIAL', body: 'Metformin depletes Vitamin B12 over time. Your Methylcobalamin supplementation directly addresses this known depletion pathway.'},
  {id: 'int3', title: 'Amlodipine + Atorvastatin', severity: 'MONITOR', body: 'Co-administration can increase Atorvastatin plasma levels by 15-20%. Your current dose of 20mg is well within safe limits.'},
  {id: 'int4', title: 'Metformin + Amlodipine', severity: 'BENEFICIAL', body: 'Amlodipine has a modest positive effect on insulin sensitivity. This combination supports dual management of T2DM and hypertension.'},
  {id: 'int5', title: 'Atorvastatin + Grapefruit', severity: 'MODERATE', body: 'Grapefruit can significantly increase Atorvastatin levels via CYP3A4 inhibition. Avoid grapefruit within 4 hours of your evening statin dose.'},
];

const FALLBACK_TIMING = [
  {id: 'tip1', emoji: '🌅', title: 'Morning Metformin with breakfast', status: 'good', body: 'Taking Metformin with food reduces GI side effects by 50%. Your 8:00 AM timing with breakfast is optimal for minimising nausea and maximising absorption.'},
  {id: 'tip2', emoji: '🌙', title: 'Evening Atorvastatin at bedtime', status: 'good', body: 'Cholesterol synthesis peaks between midnight and 3 AM. Taking Atorvastatin at 9:30 PM ensures peak drug activity aligns with peak cholesterol production.'},
  {id: 'tip3', emoji: '⏰', title: 'Amlodipine timing consistency', status: 'warning', body: 'Your Amlodipine timing has varied by 2-3 hours this week. For optimal 24-hour BP control, take it within the same 30-minute window each morning.'},
  {id: 'tip4', emoji: '🍽️', title: 'Methylcobalamin absorption', status: 'info', body: 'Methylcobalamin can be taken with or without food. Taking it with your afternoon meal may improve absorption through active transport mechanisms.'},
  {id: 'tip5', emoji: '💊', title: 'Spacing medications apart', status: 'good', body: 'Your current schedule spaces medications well. Morning (Metformin, Amlodipine), afternoon (Methylcobalamin), evening (Atorvastatin) prevents absorption competition.'},
];

const FALLBACK_SIDE_EFFECTS = [
  {id: 'se1', emoji: '🤢', severity: 'moderate', title: 'GI discomfort (Metformin)', description: 'Nausea, diarrhoea, or stomach cramps — especially in the first 2-4 weeks. Taking with food and using extended-release formulation helps.'},
  {id: 'se2', emoji: '🦵', severity: 'low', title: 'Muscle pain (Atorvastatin)', description: 'Statin-associated muscle symptoms affect 5-10% of users. Report unexplained muscle pain, tenderness, or weakness — especially with dark urine.'},
  {id: 'se3', emoji: '🦶', severity: 'moderate', title: 'Ankle swelling (Amlodipine)', description: 'Peripheral oedema affects 5-15% of Amlodipine users. Elevating legs and reducing salt intake can help. Consult your doctor if swelling persists.'},
  {id: 'se4', emoji: '😴', severity: 'low', title: 'Drowsiness (Methylcobalamin)', description: 'Mild drowsiness or headache may occur initially. Generally well-tolerated and resolves within the first week.'},
];

const FALLBACK_BIOMARKER = [
  {medName: 'Metformin 500mg', adherence: 87, biomarker: 'HbA1c', current: '7.2%', projected: '6.8%', color: Colors.accent, note: 'Improving adherence to 95%+ could reduce HbA1c by 0.3-0.5% over 3 months.'},
  {medName: 'Amlodipine 5mg', adherence: 92, biomarker: 'Systolic BP', current: '138 mmHg', projected: '128 mmHg', color: Colors.blue, note: 'Consistent timing could further reduce systolic BP by 5-10 mmHg.'},
  {medName: 'Atorvastatin 20mg', adherence: 78, biomarker: 'LDL Cholesterol', current: '118 mg/dL', projected: '92 mg/dL', color: Colors.purple, note: 'Reaching 95%+ adherence is critical — each missed dose reduces statin efficacy disproportionately.'},
  {medName: 'Methylcobalamin 1500mcg', adherence: 95, biomarker: 'Serum B12', current: '380 pg/mL', projected: '450 pg/mL', color: Colors.amber, note: 'B12 levels improving. Maintain current adherence to reach optimal range (400-600 pg/mL).'},
];

/* ─── Helpers ───────────────────────────────────────── */

const computeAvgAdherence = (meds) => {
  if (!meds || meds.length === 0) return 0;
  return Math.round(meds.reduce((sum, m) => sum + (m.adherence || 0), 0) / meds.length);
};

const getSeverityStyle = (severity) => {
  const upper = (severity || '').toUpperCase();
  return SEVERITY_COLORS[upper] || SEVERITY_COLORS.MONITOR;
};

const getStatusStyle = (status) => {
  return STATUS_COLORS[status] || STATUS_COLORS.info;
};

const getSideEffectStyle = (severity) => {
  return SIDE_EFFECT_SEVERITY[severity] || SIDE_EFFECT_SEVERITY.low;
};

/* ─── Sub-components ────────────────────────────────── */

const AyuAvatar = () => (
  <View style={styles.avatarCircle}>
    <AppText style={{fontSize: ms(22)}}>🤖</AppText>
  </View>
);

const SeverityBadge = ({severity}) => {
  const sc = getSeverityStyle(severity);
  return (
    <View style={[styles.severityBadge, {backgroundColor: sc.bg}]}>
      <AppText variant="small" color={sc.text} style={{fontWeight: '700'}}>
        {(severity || '').toUpperCase()}
      </AppText>
    </View>
  );
};

const StatusBadge = ({status, label}) => {
  const sc = getStatusStyle(status);
  return (
    <View style={[styles.statusBadge, {backgroundColor: sc.bg, borderColor: sc.border}]}>
      <AppText variant="small" color={sc.text} style={{fontWeight: '600'}}>
        {label || status}
      </AppText>
    </View>
  );
};

const ProgressBar = ({pct, color, height}) => (
  <View style={[styles.progressTrack, {height: height || vs(8)}]}>
    <View
      style={[
        styles.progressFill,
        {
          width: `${Math.min(pct, 100)}%`,
          backgroundColor: color || Colors.accent,
          height: '100%',
        },
      ]}
    />
  </View>
);

const BiomarkerProjectionRow = ({item}) => (
  <View style={styles.projectionCard}>
    <View style={styles.projectionHeader}>
      <AppText variant="bodyBold" color={Colors.textPrimary} style={{flex: 1}}>
        {item.medName}
      </AppText>
      <View style={[styles.adherenceBadge, {backgroundColor: item.adherence >= 90 ? Colors.tealBg : item.adherence >= 75 ? Colors.amberBg : Colors.redBg}]}>
        <AppText
          variant="small"
          color={item.adherence >= 90 ? Colors.tealText : item.adherence >= 75 ? Colors.amberText : Colors.redText}
          style={{fontWeight: '700'}}>
          {item.adherence}%
        </AppText>
      </View>
    </View>

    <ProgressBar pct={item.adherence} color={item.color} height={vs(6)} />

    <View style={styles.projectionValues}>
      <View style={styles.projectionVal}>
        <AppText variant="small" color={Colors.textTertiary}>Biomarker</AppText>
        <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', marginTop: vs(2)}}>
          {item.biomarker}
        </AppText>
      </View>
      <View style={styles.projectionVal}>
        <AppText variant="small" color={Colors.textTertiary}>Current</AppText>
        <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', marginTop: vs(2)}}>
          {item.current}
        </AppText>
      </View>
      <View style={styles.projectionArrow}>
        <AppText variant="body" color={Colors.accent}>→</AppText>
      </View>
      <View style={styles.projectionVal}>
        <AppText variant="small" color={Colors.textTertiary}>Projected</AppText>
        <AppText variant="caption" color={Colors.accent} style={{fontWeight: '700', marginTop: vs(2)}}>
          {item.projected}
        </AppText>
      </View>
    </View>

    <View style={styles.projectionNote}>
      <AppText variant="small" color={Colors.textTertiary} style={{lineHeight: ms(15), fontStyle: 'italic'}}>
        {item.note}
      </AppText>
    </View>
  </View>
);

/* ─── Main Component ───────────────────────────────── */

const AyuTab = ({meds}) => {
  const medications = meds || MEDICATIONS;
  const interactions = DRUG_INTERACTIONS || FALLBACK_INTERACTIONS;
  const timingTips = TIMING_TIPS || FALLBACK_TIMING;
  const sideEffects = SIDE_EFFECTS_WATCH || FALLBACK_SIDE_EFFECTS;
  const biomarkerData = BIOMARKER_IMPACT || FALLBACK_BIOMARKER;

  /* Computed */
  const avgAdherence = useMemo(() => computeAvgAdherence(medications), [medications]);

  const medCount = medications.length;
  const supplementCount = medications.filter((m) => m.type === 'supplement').length;
  const prescriptionCount = medCount - supplementCount;

  /* Build biomarker projection list */
  const projections = useMemo(() => {
    if (Array.isArray(biomarkerData) && biomarkerData.length > 0 && biomarkerData[0].medName) {
      return biomarkerData;
    }
    return FALLBACK_BIOMARKER;
  }, [biomarkerData]);

  /* Ayu summary text */
  const ayuSummary = useMemo(() => {
    const parts = [];

    parts.push(
      `Based on my analysis of your medication regimen, I have identified several key areas to focus on for optimal health outcomes.`,
    );

    parts.push(
      `Your overall adherence of ${avgAdherence}% is ${avgAdherence >= 90 ? 'excellent' : avgAdherence >= 80 ? 'good but could be improved' : 'below the recommended threshold of 90%'}. ` +
      `${avgAdherence < 90 ? 'Even small improvements in adherence can have significant clinical impact — a 10% improvement in statin adherence, for example, can reduce cardiovascular events by 15-20%.' : 'Maintaining this level of consistency is key to achieving your biomarker targets.'}`,
    );

    parts.push(
      'Your medication timing is generally well-optimised, with morning medications taken with breakfast and your statin appropriately scheduled for the evening. ' +
      'I recommend maintaining a consistent 30-minute window for Amlodipine to ensure stable 24-hour blood pressure control.',
    );

    parts.push(
      'No dangerous drug interactions have been identified in your current regimen. The Metformin-Methylcobalamin combination is clinically recommended and addresses a known depletion pathway. ' +
      'Continue to avoid grapefruit with your evening Atorvastatin dose.',
    );

    parts.push(
      'Looking at your biomarker trajectory, consistent 95%+ adherence over the next 3 months could bring your HbA1c below 7%, reduce LDL cholesterol to under 100 mg/dL, and stabilise your blood pressure within the target range of 120-130/80 mmHg.',
    );

    return parts;
  }, [avgAdherence]);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ─── Section 1: Ayu Overview Card ──────── */}
      <View style={styles.ayuCard}>
        <View style={styles.ayuHeader}>
          <AyuAvatar />
          <View style={styles.ayuHeaderText}>
            <AppText variant="header" color={Colors.white}>
              Ayu Medication Intelligence
            </AppText>
            <AppText variant="caption" color="rgba(255,255,255,0.6)" style={{marginTop: vs(2)}}>
              AI-powered medication analysis and insights
            </AppText>
          </View>
        </View>

        <View style={styles.ayuDivider} />

        <AppText variant="body" color="rgba(255,255,255,0.85)" style={{lineHeight: ms(20)}}>
          Analysing {prescriptionCount} prescription medication{prescriptionCount !== 1 ? 's' : ''} and{' '}
          {supplementCount} supplement{supplementCount !== 1 ? 's' : ''} for interactions, timing optimisations, and adherence impact on your biomarkers.
        </AppText>

        <View style={styles.ayuStatsRow}>
          <View style={styles.ayuStatBox}>
            <AppText variant="bodyBold" color={Colors.white}>
              {avgAdherence}%
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.5)">
              Avg adherence
            </AppText>
          </View>
          <View style={styles.ayuStatBox}>
            <AppText variant="bodyBold" color={Colors.white}>
              {timingTips.filter((t) => t.status === 'good').length}/{timingTips.length}
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.5)">
              Timing optimal
            </AppText>
          </View>
          <View style={styles.ayuStatBox}>
            <AppText variant="bodyBold" color={Colors.white}>
              {interactions.filter((i) => i.severity === 'MODERATE' || i.severity === 'HIGH').length}
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.5)">
              Interactions
            </AppText>
          </View>
        </View>
      </View>

      {/* ─── Section 2: Drug Interactions ──────── */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          Drug Interactions
        </AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          {interactions.length} interactions analysed in your medication regimen
        </AppText>

        {interactions.slice(0, 5).map((item, idx) => {
          const sc = getSeverityStyle(item.severity);
          return (
            <View
              key={item.id || idx}
              style={[styles.interactionCard, {backgroundColor: sc.bg}]}>
              <View style={styles.interactionHeader}>
                <View style={[styles.severityDot, {backgroundColor: sc.dot}]} />
                <AppText variant="bodyBold" color={sc.text} style={{flex: 1, marginLeft: s(8)}}>
                  {item.title}
                </AppText>
                <SeverityBadge severity={item.severity} />
              </View>
              <AppText
                variant="caption"
                color={sc.text}
                style={{marginTop: vs(8), lineHeight: ms(17), marginLeft: s(20)}}>
                {item.body}
              </AppText>
            </View>
          );
        })}
      </View>

      {/* ─── Section 3: Timing Optimisations ──── */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          Timing Optimisations
        </AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          When you take your medication matters
        </AppText>

        {timingTips.slice(0, 5).map((tip, idx) => {
          const sc = getStatusStyle(tip.status);
          return (
            <View
              key={tip.id || idx}
              style={styles.timingCard}>
              <View style={styles.timingHeader}>
                <AppText style={{fontSize: ms(20)}}>{tip.emoji}</AppText>
                <View style={{flex: 1, marginLeft: s(10)}}>
                  <View style={styles.timingTitleRow}>
                    <AppText variant="bodyBold" color={Colors.textPrimary} style={{flex: 1}}>
                      {tip.title}
                    </AppText>
                    <StatusBadge
                      status={tip.status}
                      label={tip.status === 'good' ? 'Optimal' : tip.status === 'warning' ? 'Adjust' : 'Info'}
                    />
                  </View>
                  <AppText
                    variant="caption"
                    color={Colors.textSecondary}
                    style={{marginTop: vs(6), lineHeight: ms(17)}}>
                    {tip.body}
                  </AppText>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* ─── Section 4: Adherence vs Biomarker ── */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          Adherence vs Biomarker Impact Model
        </AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          Projected biomarker improvements at 95%+ adherence
        </AppText>

        {projections.map((item, idx) => (
          <BiomarkerProjectionRow key={idx} item={item} />
        ))}

        <View style={styles.projectionDisclaimer}>
          <AppText variant="small" color={Colors.textTertiary} style={{fontStyle: 'italic', lineHeight: ms(15)}}>
            Projections are based on published clinical studies and your individual health profile. Actual results may vary. Always consult your doctor before making medication changes.
          </AppText>
        </View>
      </View>

      {/* ─── Section 5: Side Effects to Monitor ─ */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          Side Effects to Monitor
        </AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          What to watch for with your current medications
        </AppText>

        {(sideEffects || FALLBACK_SIDE_EFFECTS).slice(0, 4).map((se, idx) => {
          const sc = getSideEffectStyle(se.severity);
          return (
            <View key={se.id || idx} style={styles.sideEffectCard}>
              <View style={styles.sideEffectHeader}>
                <AppText style={{fontSize: ms(20)}}>{se.emoji}</AppText>
                <View style={{flex: 1, marginLeft: s(10)}}>
                  <View style={styles.sideEffectTitleRow}>
                    <AppText variant="bodyBold" color={Colors.textPrimary} style={{flex: 1}}>
                      {se.title}
                    </AppText>
                    <View style={[styles.seSeverityBadge, {backgroundColor: sc.bg, borderColor: sc.border}]}>
                      <AppText variant="small" color={sc.text} style={{fontWeight: '700'}}>
                        {sc.label}
                      </AppText>
                    </View>
                  </View>
                  <AppText
                    variant="caption"
                    color={Colors.textSecondary}
                    style={{marginTop: vs(4), lineHeight: ms(17)}}>
                    {se.description}
                  </AppText>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* ─── Section 6: Ayu Summary ─────────── */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          Ayu Summary
        </AppText>

        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <AyuAvatar />
            <View style={{marginLeft: s(10), flex: 1}}>
              <AppText variant="bodyBold" color={Colors.tealText}>
                Personalised Medication Analysis
              </AppText>
              <AppText variant="small" color={Colors.textTertiary}>
                Last updated: Today
              </AppText>
            </View>
          </View>

          <View style={styles.summaryDivider} />

          {ayuSummary.map((paragraph, idx) => (
            <AppText
              key={idx}
              variant="caption"
              color={Colors.textPrimary}
              style={styles.summaryParagraph}>
              {paragraph}
            </AppText>
          ))}

          <View style={styles.summaryFooter}>
            <View style={styles.summaryFooterBadge}>
              <AppText variant="small" color={Colors.tealText} style={{fontWeight: '600'}}>
                Powered by Ayu Health Intelligence
              </AppText>
            </View>
            <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(6), fontStyle: 'italic'}}>
              This analysis is for informational purposes only. Always consult your healthcare provider before making changes to your medication regimen.
            </AppText>
          </View>
        </View>
      </View>

      <View style={{height: vs(40)}} />
    </ScrollView>
  );
};

/* ─── Styles ───────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingTop: vs(8),
  },

  /* Ayu overview card */
  ayuCard: {
    backgroundColor: Colors.primary,
    borderRadius: ms(16),
    padding: s(16),
    marginTop: vs(4),
  },
  ayuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ayuHeaderText: {
    flex: 1,
    marginLeft: s(12),
  },
  avatarCircle: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    backgroundColor: 'rgba(255,255,255,0.15)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  ayuDivider: {
    height: 1,
    backgroundColor: 'rgba(255,255,255,0.12)',
    marginVertical: vs(12),
  },
  ayuStatsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(14),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.1)',
    paddingTop: vs(12),
  },
  ayuStatBox: {
    alignItems: 'center',
    flex: 1,
  },

  /* Section */
  section: {
    marginTop: vs(22),
  },

  /* Drug interactions */
  interactionCard: {
    borderRadius: ms(12),
    padding: s(14),
    marginTop: vs(10),
  },
  interactionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  severityDot: {
    width: ms(12),
    height: ms(12),
    borderRadius: ms(6),
  },
  severityBadge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
    marginLeft: s(8),
  },

  /* Timing */
  timingCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(14),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  timingHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  timingTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  statusBadge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
    borderWidth: 1,
    marginLeft: s(6),
  },

  /* Progress bar */
  progressTrack: {
    backgroundColor: Colors.background,
    borderRadius: ms(4),
    overflow: 'hidden',
    marginVertical: vs(6),
  },
  progressFill: {
    borderRadius: ms(4),
  },

  /* Adherence badge */
  adherenceBadge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(10),
  },

  /* Biomarker projections */
  projectionCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(14),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  projectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  projectionValues: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(8),
    paddingTop: vs(8),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  projectionVal: {
    flex: 1,
  },
  projectionArrow: {
    paddingHorizontal: s(6),
    alignItems: 'center',
  },
  projectionNote: {
    backgroundColor: Colors.background,
    borderRadius: ms(8),
    padding: s(10),
    marginTop: vs(8),
  },
  projectionDisclaimer: {
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    padding: s(12),
    marginTop: vs(12),
  },

  /* Side effects */
  sideEffectCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(14),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  sideEffectHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  sideEffectTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  seSeverityBadge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
    borderWidth: 1,
    marginLeft: s(6),
  },

  /* Summary card */
  summaryCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    padding: s(16),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.accent,
    borderLeftWidth: s(4),
    borderLeftColor: Colors.accent,
  },
  summaryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  summaryDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: vs(12),
  },
  summaryParagraph: {
    lineHeight: ms(18),
    marginBottom: vs(10),
  },
  summaryFooter: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: vs(12),
    marginTop: vs(4),
    alignItems: 'center',
  },
  summaryFooterBadge: {
    backgroundColor: Colors.tealBg,
    paddingHorizontal: s(12),
    paddingVertical: vs(4),
    borderRadius: ms(10),
  },
});

export default AyuTab;
