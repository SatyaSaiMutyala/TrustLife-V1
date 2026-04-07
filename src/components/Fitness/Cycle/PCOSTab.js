import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

/* ─── Constants ────────────────────────────────────── */

const SCREENING_QUESTIONS = [
  {id: 1, text: 'Are your menstrual cycles irregular (shorter than 21 days or longer than 35 days)?'},
  {id: 2, text: 'Have you noticed increased facial or body hair growth (hirsutism)?'},
  {id: 3, text: 'Have you experienced scalp hair thinning or hair loss?'},
  {id: 4, text: 'Do you have persistent acne (jawline, chin, or back)?'},
  {id: 5, text: 'Do you have unusually oily skin?'},
  {id: 6, text: 'Do you find it difficult to lose weight, especially around the abdomen?'},
  {id: 7, text: 'Have you experienced irregular or absent ovulation?'},
  {id: 8, text: 'Has an ultrasound shown ovarian cysts or polycystic ovaries?'},
  {id: 9, text: 'Do you have dark, velvety patches of skin (acanthosis nigricans)?'},
];

const HORMONAL_TESTS = [
  {test: 'TSH', purpose: 'Rule out thyroid', lastDone: 'Mar 2026', status: 'Done', statusType: 'done'},
  {test: 'LH / FSH ratio', purpose: 'Ovulation check', lastDone: '--', status: 'Consider', statusType: 'consider'},
  {test: 'Free testosterone', purpose: 'Androgen excess', lastDone: '--', status: 'Consider', statusType: 'consider'},
  {test: 'Prolactin', purpose: 'Rule out other', lastDone: '--', status: 'Optional', statusType: 'optional'},
  {test: 'AMH', purpose: 'Ovarian reserve', lastDone: '--', status: 'Optional', statusType: 'optional'},
  {test: 'Pelvic USG', purpose: 'Cyst check', lastDone: '--', status: 'Consider', statusType: 'consider'},
];

/* ─── Helpers ──────────────────────────────────────── */

const SectionLabel = ({children}) => (
  <AppText variant="sectionTitle" color={Colors.textSecondary} style={styles.sectionLabel}>
    {children}
  </AppText>
);

const Card = ({children, style}) => (
  <View style={[styles.card, style]}>{children}</View>
);

const Divider = () => <View style={styles.divider} />;

const StatusBadge = ({label, type}) => {
  const badgeStyles = {
    done: {bg: Colors.tealBg, text: Colors.tealText},
    consider: {bg: Colors.amberBg, text: Colors.amberText},
    optional: {bg: Colors.blueBg, text: Colors.blueText},
  };
  const c = badgeStyles[type] || badgeStyles.optional;
  return (
    <View style={[styles.badge, {backgroundColor: c.bg}]}>
      <AppText variant="small" color={c.text} style={{fontWeight: '600'}}>{label}</AppText>
    </View>
  );
};

/* ─── Main Component ──────────────────────────────── */

const PCOSTab = () => {
  // Question 6 (index 5) pre-selected as Yes
  const [answers, setAnswers] = useState(() => {
    const initial = {};
    SCREENING_QUESTIONS.forEach(q => {
      initial[q.id] = q.id === 6 ? 'yes' : 'no';
    });
    return initial;
  });

  const toggleAnswer = (id, val) => {
    setAnswers(prev => ({...prev, [id]: val}));
  };

  const yesCount = Object.values(answers).filter(v => v === 'yes').length;
  const riskLevel = yesCount <= 2 ? 'Low' : yesCount <= 5 ? 'Moderate' : 'High';
  const riskColor = yesCount <= 2 ? Colors.tealText : yesCount <= 5 ? Colors.amberText : Colors.redText;
  const riskBg = yesCount <= 2 ? Colors.tealBg : yesCount <= 5 ? Colors.amberBg : Colors.redBg;

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ─── 1. PCOS/PCOD Overview ──────────────── */}
      <SectionLabel>PCOS / PCOD OVERVIEW</SectionLabel>
      <View style={styles.insightBlue}>
        <View style={styles.insightRow}>
          <Icon family="Ionicons" name="information-circle" size={20} color={Colors.blueText} />
          <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(8), flex: 1}}>
            What is PCOS?
          </AppText>
        </View>
        <AppText variant="body" color={Colors.blueText} style={styles.insightBody}>
          Polycystic Ovary Syndrome (PCOS) affects approximately 10% of women of reproductive age. It is one of the leading causes of irregular periods, hormonal imbalance, and infertility. Women with PCOS are at significantly higher risk for developing Type 2 Diabetes Mellitus (T2DM) due to underlying insulin resistance.
        </AppText>
      </View>

      {/* ─── 2. PCOS Symptom Screen ─────────────── */}
      <SectionLabel>PCOS SYMPTOM SCREEN</SectionLabel>
      <Card>
        {/* Header */}
        <View style={styles.cardHeaderBlue}>
          <View style={styles.insightRow}>
            <Icon family="Ionicons" name="clipboard-outline" size={18} color={Colors.blueText} />
            <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(8)}}>
              Rotterdam Criteria Screening
            </AppText>
          </View>
          <AppText variant="caption" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(18)}}>
            PCOS diagnosis typically requires at least 2 of 3 Rotterdam criteria: irregular periods, signs of androgen excess, or polycystic ovaries on ultrasound.
          </AppText>
        </View>

        {/* Questions */}
        {SCREENING_QUESTIONS.map((q, idx) => {
          const isNotSure = q.id === 8;
          return (
            <View key={q.id}>
              <View style={styles.questionRow}>
                <View style={styles.questionNumCircle}>
                  <AppText variant="small" color={Colors.white} style={{fontWeight: '700'}}>
                    {q.id}
                  </AppText>
                </View>
                <View style={{flex: 1}}>
                  <AppText variant="body" color={Colors.textPrimary} style={{lineHeight: ms(20)}}>
                    {q.text}
                  </AppText>
                  <View style={styles.answerRow}>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.answerBtn,
                        answers[q.id] === 'yes' && styles.answerBtnActiveYes,
                      ]}
                      onPress={() => toggleAnswer(q.id, 'yes')}>
                      <AppText
                        variant="small"
                        color={answers[q.id] === 'yes' ? Colors.white : Colors.textSecondary}
                        style={{fontWeight: '600'}}>
                        Yes
                      </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={[
                        styles.answerBtn,
                        answers[q.id] === 'no' && styles.answerBtnActiveNo,
                      ]}
                      onPress={() => toggleAnswer(q.id, 'no')}>
                      <AppText
                        variant="small"
                        color={answers[q.id] === 'no' ? Colors.white : Colors.textSecondary}
                        style={{fontWeight: '600'}}>
                        No
                      </AppText>
                    </TouchableOpacity>
                    {isNotSure && (
                      <TouchableOpacity
                        activeOpacity={0.7}
                        style={[
                          styles.answerBtn,
                          answers[q.id] === 'notsure' && styles.answerBtnActiveNotSure,
                        ]}
                        onPress={() => toggleAnswer(q.id, 'notsure')}>
                        <AppText
                          variant="small"
                          color={answers[q.id] === 'notsure' ? Colors.white : Colors.textSecondary}
                          style={{fontWeight: '600'}}>
                          Not sure
                        </AppText>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>
              </View>
              {idx < SCREENING_QUESTIONS.length - 1 && <Divider />}
            </View>
          );
        })}

        {/* Score */}
        <View style={[styles.scoreBar, {backgroundColor: riskBg}]}>
          <View style={styles.scoreLeft}>
            <Icon family="Ionicons" name="shield-checkmark-outline" size={18} color={riskColor} />
            <AppText variant="bodyBold" color={riskColor} style={{marginLeft: s(6)}}>
              {riskLevel} PCOS risk
            </AppText>
            <AppText variant="caption" color={riskColor} style={{marginLeft: s(4)}}>
              {' '}{yesCount}/9 indicators
            </AppText>
          </View>
          <View style={[styles.scoreCircle, {borderColor: riskColor}]}>
            <AppText variant="bodyBold" color={riskColor}>{yesCount}</AppText>
          </View>
        </View>
      </Card>

      {/* ─── 3. PCOS & T2DM Connection ──────────── */}
      <SectionLabel>PCOS & T2DM CONNECTION</SectionLabel>
      <Card>
        {/* Row 1 - Insulin Resistance */}
        <View style={styles.connectionRow}>
          <View style={styles.connectionIcon}>
            <Icon family="Ionicons" name="link-outline" size={22} color={Colors.primary} />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={Colors.textPrimary}>
              Insulin resistance: shared root cause
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(18)}}>
              Up to 70% of women with PCOS have insulin resistance, the same mechanism driving your T2DM. Elevated insulin stimulates ovarian androgen production, worsening PCOS symptoms.
            </AppText>
          </View>
        </View>
        <Divider />

        {/* Row 2 - Metformin */}
        <View style={styles.connectionRow}>
          <View style={styles.connectionIcon}>
            <Icon family="Ionicons" name="medkit-outline" size={22} color={Colors.primary} />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={Colors.textPrimary}>
              Metformin dual benefit
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(18)}}>
              Your current Metformin 500 mg prescription helps manage blood sugar and may also improve menstrual regularity and reduce androgen levels if PCOS is present.
            </AppText>
          </View>
        </View>
        <Divider />

        {/* Row 3 - Screening */}
        <View style={styles.connectionRow}>
          <View style={styles.connectionIcon}>
            <Icon family="Ionicons" name="calendar-outline" size={22} color={Colors.primary} />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={Colors.textPrimary}>
              Recommended screening
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(18)}}>
              Discuss PCOS screening at your Apr 4 visit. Given your T2DM diagnosis, hormonal panel and pelvic ultrasound can rule out or confirm PCOS early.
            </AppText>
          </View>
        </View>
      </Card>

      {/* ─── 4. PCOD vs PCOS ───────────────────── */}
      <SectionLabel>PCOD VS PCOS</SectionLabel>
      <Card>
        {/* Column headers */}
        <View style={styles.comparisonHeader}>
          <View style={styles.comparisonCol}>
            <AppText variant="bodyBold" color={Colors.textPrimary}>PCOD</AppText>
          </View>
          <View style={styles.comparisonDivider} />
          <View style={styles.comparisonCol}>
            <AppText variant="bodyBold" color={Colors.textPrimary}>PCOS</AppText>
          </View>
        </View>
        <Divider />

        {/* Comparison rows */}
        <View style={styles.comparisonRow}>
          <View style={styles.comparisonCol}>
            <AppText variant="caption" color={Colors.textSecondary}>
              Common condition
            </AppText>
          </View>
          <View style={styles.comparisonDivider} />
          <View style={styles.comparisonCol}>
            <AppText variant="caption" color={Colors.textSecondary}>
              Endocrine disorder
            </AppText>
          </View>
        </View>
        <Divider />

        <View style={styles.comparisonRow}>
          <View style={styles.comparisonCol}>
            <AppText variant="caption" color={Colors.textSecondary}>
              Immature eggs released
            </AppText>
          </View>
          <View style={styles.comparisonDivider} />
          <View style={styles.comparisonCol}>
            <AppText variant="caption" color={Colors.textSecondary}>
              Eggs may not be released
            </AppText>
          </View>
        </View>
        <Divider />

        <View style={styles.comparisonRow}>
          <View style={styles.comparisonCol}>
            <AppText variant="caption" color={Colors.textSecondary}>
              Mild hormonal imbalance
            </AppText>
          </View>
          <View style={styles.comparisonDivider} />
          <View style={styles.comparisonCol}>
            <AppText variant="caption" color={Colors.textSecondary}>
              Significant hormonal imbalance
            </AppText>
          </View>
        </View>
        <Divider />

        <View style={styles.comparisonRow}>
          <View style={styles.comparisonCol}>
            <AppText variant="caption" color={Colors.textSecondary}>
              Usually no serious complications
            </AppText>
          </View>
          <View style={styles.comparisonDivider} />
          <View style={styles.comparisonCol}>
            <AppText variant="caption" color={Colors.textSecondary}>
              Risk of T2DM, infertility, heart disease
            </AppText>
          </View>
        </View>
        <Divider />

        <View style={styles.comparisonRow}>
          <View style={styles.comparisonCol}>
            <AppText variant="caption" color={Colors.textSecondary}>
              Manageable with diet & exercise
            </AppText>
          </View>
          <View style={styles.comparisonDivider} />
          <View style={styles.comparisonCol}>
            <AppText variant="caption" color={Colors.textSecondary}>
              Requires medical treatment
            </AppText>
          </View>
        </View>

        {/* Footer note */}
        <View style={styles.comparisonFooter}>
          <Icon family="Ionicons" name="information-circle-outline" size={16} color={Colors.blueText} />
          <AppText variant="caption" color={Colors.blueText} style={{marginLeft: s(6), flex: 1, lineHeight: ms(18)}}>
            PCOD is more common and less severe. PCOS is a metabolic disorder with stronger links to insulin resistance and T2DM. Your doctor can differentiate with blood tests and ultrasound.
          </AppText>
        </View>
      </Card>

      {/* ─── 5. Hormonal Health Tests ──────────── */}
      <SectionLabel>HORMONAL HEALTH TESTS</SectionLabel>
      <Card>
        {/* Table header */}
        <View style={styles.tableHeader}>
          <AppText variant="small" color={Colors.textTertiary} style={[styles.tableColTest, {fontWeight: '700'}]}>
            Test
          </AppText>
          <AppText variant="small" color={Colors.textTertiary} style={[styles.tableColPurpose, {fontWeight: '700'}]}>
            Purpose
          </AppText>
          <AppText variant="small" color={Colors.textTertiary} style={[styles.tableColLast, {fontWeight: '700'}]}>
            Last done
          </AppText>
          <AppText variant="small" color={Colors.textTertiary} style={[styles.tableColStatus, {fontWeight: '700'}]}>
            Status
          </AppText>
        </View>
        <Divider />

        {/* Table rows */}
        {HORMONAL_TESTS.map((row, idx) => (
          <View key={idx}>
            <View style={styles.tableRow}>
              <AppText variant="caption" color={Colors.textPrimary} style={[styles.tableColTest, {fontWeight: '600'}]}>
                {row.test}
              </AppText>
              <AppText variant="small" color={Colors.textSecondary} style={styles.tableColPurpose}>
                {row.purpose}
              </AppText>
              <AppText variant="small" color={Colors.textTertiary} style={styles.tableColLast}>
                {row.lastDone}
              </AppText>
              <View style={styles.tableColStatus}>
                <StatusBadge label={row.status} type={row.statusType} />
              </View>
            </View>
            {idx < HORMONAL_TESTS.length - 1 && <Divider />}
          </View>
        ))}
      </Card>

      {/* ─── 6. Add to Agenda Button ───────────── */}
      <TouchableOpacity activeOpacity={0.7} style={styles.agendaButton}>
        <Icon family="Ionicons" name="add-circle-outline" size={20} color={Colors.white} />
        <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(8)}}>
          Add to Apr 4 agenda
        </AppText>
      </TouchableOpacity>

      <View style={{height: vs(80)}} />
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
  sectionLabel: {
    marginTop: vs(20),
    marginBottom: vs(8),
  },

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  divider: {
    height: 0.5,
    backgroundColor: Colors.borderLight,
  },

  /* Insight cards */
  insightBlue: {
    backgroundColor: '#EFF6FF',
    borderRadius: ms(14),
    padding: s(14),
  },
  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  insightBody: {
    marginTop: vs(8),
    lineHeight: ms(20),
  },

  /* Card header blue */
  cardHeaderBlue: {
    backgroundColor: '#EFF6FF',
    padding: s(14),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },

  /* Question rows */
  questionRow: {
    flexDirection: 'row',
    padding: s(14),
    alignItems: 'flex-start',
  },
  questionNumCircle: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
    marginTop: vs(1),
  },
  answerRow: {
    flexDirection: 'row',
    marginTop: vs(8),
    gap: s(8),
  },
  answerBtn: {
    paddingHorizontal: s(16),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.white,
  },
  answerBtnActiveYes: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  answerBtnActiveNo: {
    backgroundColor: Colors.textSecondary,
    borderColor: Colors.textSecondary,
  },
  answerBtnActiveNotSure: {
    backgroundColor: Colors.amber,
    borderColor: Colors.amber,
  },

  /* Score bar */
  scoreBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: s(14),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  scoreLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  scoreCircle: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    borderWidth: 2,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Connection rows */
  connectionRow: {
    flexDirection: 'row',
    padding: s(14),
    alignItems: 'flex-start',
  },
  connectionIcon: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(12),
  },

  /* Comparison table */
  comparisonHeader: {
    flexDirection: 'row',
    padding: s(14),
    paddingBottom: vs(10),
  },
  comparisonRow: {
    flexDirection: 'row',
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
  },
  comparisonCol: {
    flex: 1,
  },
  comparisonDivider: {
    width: 0.5,
    backgroundColor: Colors.borderLight,
    marginHorizontal: s(10),
  },
  comparisonFooter: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#EFF6FF',
    padding: s(12),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },

  /* Hormonal tests table */
  tableHeader: {
    flexDirection: 'row',
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    alignItems: 'center',
  },
  tableColTest: {
    width: s(72),
  },
  tableColPurpose: {
    flex: 1,
  },
  tableColLast: {
    width: s(64),
    textAlign: 'center',
  },
  tableColStatus: {
    width: s(68),
    alignItems: 'flex-end',
  },

  /* Badge */
  badge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },

  /* Agenda button */
  agendaButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    marginTop: vs(24),
  },
});

export default PCOSTab;
