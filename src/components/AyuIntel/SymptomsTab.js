import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import AppText from '../shared/AppText';

// ─── Symptom cards data (matching HTML Tab 4 exactly) ───
const SYMPTOM_CARDS = [
  {
    sectionLabel: 'Blood Glucose \u00b7 Blood Pressure \u00b7 Heart Rate',
    cards: [
      {
        id: 'glucose', ico: '\uD83E\uDE78', icoBg: '#FEF3C7',
        title: 'Blood Glucose \u00b7 CGM + Home monitoring',
        badge: 'Above target', badgeBg: '#FCEBEB', badgeColor: '#791F1F',
        metrics: [
          {label: 'Avg fasting (March)', value: '126 mg/dL', ref: 'Target 70\u2013100', valueColor: '#E24B4A', pillLabel: '\u26a0 High', pillBg: '#FCEBEB', pillColor: '#791F1F'},
          {label: 'Post-meal avg', value: '~180 mg/dL', ref: 'Target <140', valueColor: '#E24B4A', pillLabel: 'High', pillBg: '#FCEBEB', pillColor: '#791F1F'},
          {label: 'Time in range (<180)', value: '58%', ref: 'Target >70%', valueColor: '#BA7517', pillLabel: 'Below', pillBg: '#FAEEDA', pillColor: '#633806'},
          {label: 'High events (>180/day)', value: '~6', ref: '', valueColor: '#E24B4A', pillLabel: 'Frequent', pillBg: '#FCEBEB', pillColor: '#791F1F'},
          {label: 'Low events (<70/month)', value: '0', ref: '', valueColor: '#0F6E56', pillLabel: '\u2713 None', pillBg: '#E1F5EE', pillColor: '#085041'},
        ],
        corrTitle: '\uD83D\uDD17 March trend',
        corrBody: 'FBG declining \u2014 W1 avg 131 \u2192 W4 avg 121. Metformin 1000mg (5 Mar) producing a measurable response. Post-dinner walk on only 9 of 31 evenings.',
      },
      {
        id: 'bp', ico: '\u2764\uFE0F', icoBg: '#FBEAF0',
        title: 'Blood Pressure \u00b7 Home cuff + clinic readings',
        badge: 'Above target', badgeBg: '#FAEEDA', badgeColor: '#633806',
        metrics: [
          {label: 'Avg reading (March)', value: '136/86 mmHg', ref: 'Target <130/80', valueColor: '#BA7517', pillLabel: 'Above', pillBg: '#FAEEDA', pillColor: '#633806'},
          {label: 'Morning avg', value: '138/88 mmHg', ref: '', valueColor: '#E24B4A', pillLabel: 'High', pillBg: '#FCEBEB', pillColor: '#791F1F'},
          {label: 'Evening avg', value: '134/84 mmHg', ref: '', valueColor: '#BA7517', pillLabel: 'Borderline', pillBg: '#FAEEDA', pillColor: '#633806'},
          {label: 'Highest (March)', value: '148/92 mmHg', ref: 'High-stress day', valueColor: '#E24B4A', pillLabel: '\u26a0', pillBg: '#FCEBEB', pillColor: '#791F1F'},
          {label: 'Lowest (March)', value: '124/78 mmHg', ref: '6k+ step day', valueColor: '#0F6E56', pillLabel: 'At target', pillBg: '#E1F5EE', pillColor: '#085041'},
          {label: 'Medication', value: 'Olmesartan + Amlodipine', ref: '', valueColor: '#0F6E56', pillLabel: 'Active', pillBg: '#E1F5EE', pillColor: '#085041'},
        ],
        corrTitle: '\uD83D\uDD17 Activity \u2192 BP range',
        corrBody: '6,000+ step days: BP avg 128/82. Low-activity days: 138/90. 10 mmHg systolic difference from walking alone.',
      },
      {
        id: 'heartRate', ico: '\uD83D\uDC93', icoBg: '#FCEBEB',
        title: 'Heart Rate \u00b7 Apple Watch continuous',
        badge: 'HRV low', badgeBg: '#FAEEDA', badgeColor: '#633806',
        metrics: [
          {label: 'Resting HR (avg)', value: '74 bpm', ref: 'Normal 60\u2013100', valueColor: '#0F6E56', pillLabel: '\u2713 Normal', pillBg: '#E1F5EE', pillColor: '#085041'},
          {label: 'HRV (avg)', value: '28 ms', ref: 'Target >40 ms', valueColor: '#E24B4A', pillLabel: '\u2193 Low', pillBg: '#FCEBEB', pillColor: '#791F1F'},
          {label: 'Nocturnal resting (sleep)', value: '62 bpm', ref: 'Normal', valueColor: '#0F6E56', pillLabel: '\u2713', pillBg: '#E1F5EE', pillColor: '#085041'},
          {label: 'Active avg (walking)', value: '118 bpm', ref: '', valueColor: '#0F6E56', pillLabel: 'Normal', pillBg: '#E1F5EE', pillColor: '#085041'},
          {label: 'Max recorded (March)', value: '142 bpm', ref: 'Brisk walk', valueColor: '#0F6E56', pillLabel: 'Normal', pillBg: '#E1F5EE', pillColor: '#085041'},
        ],
        corrTitle: '\uD83D\uDD17 HRV \u2192 sleep quality',
        corrBody: 'HRV of 28ms reflects chronic sleep debt and anaemia compensation. Each additional hour of sleep raises HRV by ~3\u20135ms. Target: >40ms with consistent 7h sleep.',
      },
    ],
  },
  {
    sectionLabel: 'Weight & body composition',
    cards: [
      {
        id: 'weight', ico: '\u2696\uFE0F', icoBg: '#E1F5EE',
        title: 'Weight \u00b7 Body composition',
        badge: '\u2191 Improving', badgeBg: '#E1F5EE', badgeColor: '#085041',
        metrics: [
          {label: 'Current weight', value: '68 kg', ref: '\u22121.2kg since Jan', valueColor: '#0F6E56', pillLabel: 'Trending \u2193', pillBg: '#E1F5EE', pillColor: '#085041'},
          {label: 'BMI', value: '25.0', ref: 'Normal <24.9', valueColor: '#BA7517', pillLabel: 'Borderline', pillBg: '#FAEEDA', pillColor: '#633806'},
          {label: 'Body fat %', value: '32%', ref: 'Target <28% (F)', valueColor: '#BA7517', pillLabel: '\u2191', pillBg: '#FAEEDA', pillColor: '#633806'},
          {label: 'Waist circumference', value: '86 cm', ref: 'Target <80 cm (F)', valueColor: '#BA7517', pillLabel: '\u2191', pillBg: '#FAEEDA', pillColor: '#633806'},
          {label: 'Waist-hip ratio', value: '0.84', ref: 'Target <0.80', valueColor: '#BA7517', pillLabel: '\u2191 Risk', pillBg: '#FAEEDA', pillColor: '#633806'},
        ],
        corrTitle: '\uD83D\uDD17 Weight \u2192 Insulin resistance',
        corrBody: 'Losing 3.5kg to 64.5kg (~5% BW) would improve insulin sensitivity by ~20\u201330% and reduce HbA1c by estimated 0.3\u20130.5%.',
      },
    ],
  },
  {
    sectionLabel: 'Temperature \u00b7 ECG \u00b7 Menstrual cycle \u00b7 Migraine',
    cards: [
      {
        id: 'temperature', ico: '\uD83C\uDF21\uFE0F', icoBg: '#FAEEDA',
        title: 'Temperature',
        badge: 'Normal baseline', badgeBg: '#E1F5EE', badgeColor: '#085041',
        metrics: [
          {label: 'Baseline', value: '36.8\u00b0C', ref: '', valueColor: '#0F6E56', pillLabel: '\u2713', pillBg: '#E1F5EE', pillColor: '#085041'},
          {label: 'Fever episodes (90d)', value: '1 \u00b7 Dec 2025', ref: 'URTI \u00b7 resolved', valueColor: '#0F6E56', pillLabel: 'Resolved', pillBg: '#E1F5EE', pillColor: '#085041'},
        ],
        corrTitle: '',
        corrBody: '',
      },
      {
        id: 'ecg', ico: '\uD83D\uDCC8', icoBg: '#E6F1FB',
        title: 'ECG \u00b7 Electrocardiogram',
        badge: 'Normal', badgeBg: '#E1F5EE', badgeColor: '#085041',
        metrics: [
          {label: 'Last ECG', value: 'January 2026', ref: '', valueColor: '#0F6E56', pillLabel: 'Recent', pillBg: '#E1F5EE', pillColor: '#085041'},
          {label: 'Rhythm', value: 'Normal Sinus Rhythm', ref: '', valueColor: '#0F6E56', pillLabel: 'NSR \u2713', pillBg: '#E1F5EE', pillColor: '#085041'},
          {label: 'Heart rate (ECG)', value: '74 bpm', ref: '', valueColor: '#0F6E56', pillLabel: '\u2713', pillBg: '#E1F5EE', pillColor: '#085041'},
          {label: 'QTc interval', value: '412 ms', ref: 'Normal <450ms (F)', valueColor: '#0F6E56', pillLabel: 'Normal', pillBg: '#E1F5EE', pillColor: '#085041'},
          {label: 'ST changes', value: 'None', ref: '', valueColor: '#0F6E56', pillLabel: '\u2713 Clear', pillBg: '#E1F5EE', pillColor: '#085041'},
          {label: 'LVH (left vent. hypertrophy)', value: 'Not present', ref: '', valueColor: '#0F6E56', pillLabel: '\u2713', pillBg: '#E1F5EE', pillColor: '#085041'},
          {label: 'Axis & conduction', value: 'Normal axis \u00b7 No block', ref: '', valueColor: '#0F6E56', pillLabel: '\u2713', pillBg: '#E1F5EE', pillColor: '#085041'},
        ],
        corrTitle: '',
        corrBody: '',
      },
      {
        id: 'menstrual', ico: '\uD83C\uDF38', icoBg: '#FBEAF0',
        title: 'Menstrual cycle',
        badge: 'Irregular', badgeBg: '#FAEEDA', badgeColor: '#633806',
        metrics: [
          {label: 'Avg cycle length', value: '31 days', ref: '', valueColor: '#BA7517', pillLabel: 'Slightly long', pillBg: '#FAEEDA', pillColor: '#633806'},
          {label: 'Variability', value: '\u00b16 days', ref: '', valueColor: '#BA7517', pillLabel: 'Variable', pillBg: '#FAEEDA', pillColor: '#633806'},
          {label: 'Glucose during period', value: '\u2191 Days 1\u20133', ref: '', valueColor: '#BA7517', pillLabel: 'Pattern noted', pillBg: '#FAEEDA', pillColor: '#633806'},
        ],
        corrTitle: '',
        corrBody: '',
      },
      {
        id: 'migraine', ico: '\uD83E\uDD15', icoBg: '#EEEDFE',
        title: 'Migraine',
        badge: '3 episodes', badgeBg: '#FAEEDA', badgeColor: '#633806',
        metrics: [
          {label: 'Episodes (quarter)', value: '3', ref: '', valueColor: '#BA7517', pillLabel: 'Track', pillBg: '#FAEEDA', pillColor: '#633806'},
          {label: 'Triggers', value: 'Dehydration \u00b7 Stress', ref: '', valueColor: '#BA7517', pillLabel: 'Actionable', pillBg: '#FAEEDA', pillColor: '#633806'},
        ],
        corrTitle: '',
        corrBody: '',
        footer: 'Improving hydration to 2.5L/day may significantly reduce migraine frequency.',
        footerBg: '#FAEEDA',
        footerColor: '#633806',
      },
    ],
  },
  {
    sectionLabel: 'Musculoskeletal \u00b7 Stress & mood \u00b7 Anaemia',
    cards: [
      {
        id: 'msk', ico: '\uD83E\uDDB4', icoBg: '#E1F5EE',
        title: 'Musculoskeletal',
        badge: '2 concerns', badgeBg: '#FAEEDA', badgeColor: '#633806',
        metrics: [
          {label: 'Foot tingling', value: '5 episodes', ref: 'Bilateral \u00b7 neuropathy risk', valueColor: '#E24B4A', pillLabel: '\u26a0 Flag', pillBg: '#FCEBEB', pillColor: '#791F1F'},
          {label: 'Knee pain', value: '4\u00d7/month \u00b7 mild', ref: '', valueColor: '#BA7517', pillLabel: 'Track', pillBg: '#FAEEDA', pillColor: '#633806'},
          {label: 'Ankle oedema', value: 'Bilateral \u00b7 mild', ref: 'Amlodipine side effect', valueColor: '#BA7517', pillLabel: 'Expected', pillBg: '#FAEEDA', pillColor: '#633806'},
          {label: 'Physiotherapy', value: '3 sessions done', ref: '', valueColor: '#0F6E56', pillLabel: 'Active', pillBg: '#E1F5EE', pillColor: '#085041'},
        ],
        corrTitle: '',
        corrBody: '',
      },
      {
        id: 'stress', ico: '\uD83E\uDDE0', icoBg: '#EEEDFE',
        title: 'Stress & mood',
        badge: 'Moderate stress', badgeBg: '#FAEEDA', badgeColor: '#633806',
        metrics: [
          {label: 'Avg mood score', value: '6.4/10', ref: '', valueColor: '#BA7517', pillLabel: 'Below 7.5', pillBg: '#FAEEDA', pillColor: '#633806'},
          {label: 'PHQ-9', value: '8 (mild)', ref: '', valueColor: '#BA7517', pillLabel: 'Mild depression', pillBg: '#FAEEDA', pillColor: '#633806'},
          {label: 'GAD-7', value: '6 (mild)', ref: '', valueColor: '#BA7517', pillLabel: 'Mild anxiety', pillBg: '#FAEEDA', pillColor: '#633806'},
        ],
        corrTitle: '\uD83D\uDD17 Stress \u2192 Glucose',
        corrBody: 'High-stress Mondays \u2192 Tuesday FBG avg +12 mg/dL above weekly average. Cortisol driving directly.',
      },
      {
        id: 'anaemia', ico: '\uD83E\uDE78', icoBg: '#FBEAF0',
        title: 'Anaemia markers',
        badge: 'Mild anaemia', badgeBg: '#FAEEDA', badgeColor: '#633806',
        metrics: [
          {label: 'Haemoglobin', value: '11.8 g/dL', ref: 'Normal 12\u201316 (F)', valueColor: '#BA7517', pillLabel: '\u2193 Mild', pillBg: '#FAEEDA', pillColor: '#633806'},
          {label: 'Methylcobalamin', value: 'Started 5 Mar', ref: '', valueColor: '#0F6E56', pillLabel: 'Active', pillBg: '#E1F5EE', pillColor: '#085041'},
          {label: 'Iron / ferritin', value: 'Not tested', ref: '', valueColor: '#888', pillLabel: 'Order test', pillBg: '#f0f0f0', pillColor: '#555'},
          {label: 'Asthma', value: 'No condition', ref: 'Breathlessness = deconditioning', valueColor: '#0F6E56', pillLabel: '\u2713 None', pillBg: '#E1F5EE', pillColor: '#085041'},
        ],
        corrTitle: '',
        corrBody: '',
      },
    ],
  },
  {
    sectionLabel: 'Vaccination',
    cards: [
      {
        id: 'vaccination', ico: '\uD83D\uDC89', icoBg: '#EAF3DE',
        title: 'Vaccination \u00b7 ABDM linked',
        badge: 'Mostly current', badgeBg: '#E1F5EE', badgeColor: '#085041',
        metrics: [
          {label: 'Influenza (annual)', value: '\u2713 Sep 2025', ref: '', valueColor: '#0F6E56', pillLabel: 'Current', pillBg: '#E1F5EE', pillColor: '#085041'},
          {label: 'Hepatitis B', value: '\u2713 3-dose', ref: '', valueColor: '#0F6E56', pillLabel: 'Lifelong', pillBg: '#E1F5EE', pillColor: '#085041'},
          {label: 'COVID-19', value: '\u2713 3 doses', ref: '', valueColor: '#0F6E56', pillLabel: '\u2713', pillBg: '#E1F5EE', pillColor: '#085041'},
          {label: 'Pneumococcal', value: 'Not on record', ref: '', valueColor: '#888', pillLabel: 'Consider (T2DM)', pillBg: '#f0f0f0', pillColor: '#555'},
          {label: 'HPV', value: 'Not on record', ref: '', valueColor: '#888', pillLabel: 'Discuss at visit', pillBg: '#f0f0f0', pillColor: '#555'},
          {label: 'Tetanus (dT)', value: 'Not on record', ref: '', valueColor: '#888', pillLabel: 'Check (10yr)', pillBg: '#f0f0f0', pillColor: '#555'},
        ],
        corrTitle: '',
        corrBody: '',
      },
    ],
  },
];

const SymptomsTab = () => {
  const navigation = useNavigation();

  return (
    <View>
      {SYMPTOM_CARDS.map((section, sIdx) => (
        <View key={sIdx}>
          {/* ── Section divider ── */}
          <View style={styles.sectionDivider}>
            <AppText style={styles.sectionLabel}>
              {section.sectionLabel.toUpperCase()}
            </AppText>
            <View style={styles.sectionLine} />
          </View>

          {/* ── Cards ── */}
          {section.cards.map(card => (
            <TouchableOpacity
              key={card.id}
              activeOpacity={0.7}
              style={styles.card}
              onPress={() =>
                navigation.navigate('SymptomsDetail', {symptomId: card.id})
              }>
              {/* Card header */}
              <View style={styles.cardHeader}>
                <View style={[styles.icoCircle, {backgroundColor: card.icoBg}]}>
                  <AppText style={styles.icoText}>{card.ico}</AppText>
                </View>
                <AppText style={styles.headerTitle} numberOfLines={1}>
                  {card.title}
                </AppText>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
                  <View style={[styles.badgePill, {backgroundColor: card.badgeBg}]}>
                    <AppText style={[styles.badgeText, {color: card.badgeColor}]}>
                      {card.badge}
                    </AppText>
                  </View>
                  <AppText style={styles.chevron}>{'\u203A'}</AppText>
                </View>
              </View>

              {/* Metric rows */}
              {card.metrics.map((m, idx) => (
                <View
                  key={idx}
                  style={[
                    styles.metricRow,
                    idx < card.metrics.length - 1 && styles.metricRowBorder,
                  ]}>
                  <AppText style={styles.metricLabel}>{m.label}</AppText>
                  <View style={styles.metricValueCol}>
                    <AppText
                      style={[styles.metricValue, {color: m.valueColor}]}>
                      {m.value}
                    </AppText>
                    {m.ref ? (
                      <AppText style={styles.metricRef}>{m.ref}</AppText>
                    ) : null}
                  </View>
                  <View style={[styles.metricPill, {backgroundColor: m.pillBg}]}>
                    <AppText style={[styles.metricPillText, {color: m.pillColor}]}>
                      {m.pillLabel}
                    </AppText>
                  </View>
                </View>
              ))}

              {/* Correlation box */}
              {card.corrTitle ? (
                <View style={styles.corrBox}>
                  <AppText style={styles.corrTitle}>{card.corrTitle}</AppText>
                  <AppText style={styles.corrBody}>{card.corrBody}</AppText>
                </View>
              ) : null}

              {/* Footer (for migraine) */}
              {card.footer ? (
                <View style={[styles.footerBox, {backgroundColor: card.footerBg}]}>
                  <AppText style={[styles.footerText, {color: card.footerColor}]}>
                    {card.footer}
                  </AppText>
                </View>
              ) : null}
            </TouchableOpacity>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  /* Section divider */
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
    marginTop: vs(10),
    gap: s(8),
  },
  sectionLabel: {
    fontSize: ms(9),
    fontWeight: '700',
    letterSpacing: ms(9) * 0.09,
    color: '#888',
  },
  sectionLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#dde8e2',
  },

  /* Card */
  card: {
    backgroundColor: '#fff',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#dde8e2',
    overflow: 'hidden',
    marginBottom: vs(10),
  },

  /* Card header */
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: '#edf2ef',
    gap: s(8),
  },
  icoCircle: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
  icoText: {
    fontSize: ms(15),
  },
  headerTitle: {
    flex: 1,
    fontSize: ms(12),
    fontWeight: '700',
    color: '#1a1a1a',
  },
  badgePill: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
  badgeText: {
    fontSize: ms(9),
    fontWeight: '700',
  },
  chevron: {
    fontSize: ms(16),
    color: '#aaa',
  },

  /* Metric rows */
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    gap: s(8),
  },
  metricRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#f4f4f4',
  },
  metricLabel: {
    flex: 1,
    fontSize: ms(11),
    color: '#1a1a1a',
  },
  metricValueCol: {
    alignItems: 'flex-end',
    marginRight: s(8),
  },
  metricValue: {
    fontSize: ms(13),
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  metricRef: {
    fontSize: ms(9),
    color: '#aaa',
    marginTop: vs(1),
  },
  metricPill: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
    minWidth: s(32),
    alignItems: 'center',
  },
  metricPillText: {
    fontSize: ms(9),
    fontWeight: '700',
  },

  /* Correlation box */
  corrBox: {
    marginHorizontal: s(12),
    marginVertical: vs(10),
    backgroundColor: '#e8f5e9',
    borderWidth: 0.5,
    borderColor: '#a5d6a7',
    borderRadius: ms(11),
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
  },
  corrTitle: {
    fontSize: ms(10),
    fontWeight: '700',
    color: '#0a5c47',
    marginBottom: vs(4),
  },
  corrBody: {
    fontSize: ms(11),
    color: '#1b5e20',
    lineHeight: ms(11) * 1.65,
  },

  /* Footer box (migraine) */
  footerBox: {
    paddingHorizontal: s(13),
    paddingVertical: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: '#edf2ef',
  },
  footerText: {
    fontSize: ms(10),
  },
});

export default SymptomsTab;
