import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const borderTertiary = '#d1d5db';

/* ── status pill ── */
const StatusPill = ({label, bg, color}) => (
  <View style={[styles.pill, {backgroundColor: bg}]}>
    <AppText variant="small" color={color}>
      {label}
    </AppText>
  </View>
);

/* ── action item ── */
const ActionItem = ({icon, description, owner, statusLabel, statusBg, statusColor}) => (
  <View style={styles.actionRow}>
    <View style={styles.actionLeft}>
      <Icon family="Ionicons" name={icon} size={18} color={Colors.primary} />
      <View style={{marginLeft: s(8), flex: 1}}>
        <AppText variant="body">{description}</AppText>
        <AppText variant="small" color={Colors.textTertiary}>
          {owner}
        </AppText>
      </View>
    </View>
    <StatusPill label={statusLabel} bg={statusBg} color={statusColor} />
  </View>
);

/* ── monitoring row ── */
const MonitoringRow = ({parameter, current, target, note, bg, textColor}) => (
  <View style={styles.monitorRow}>
    <View style={styles.monitorTop}>
      <AppText variant="bodyBold" style={{flex: 1}}>
        {parameter}
      </AppText>
      <StatusPill label={current} bg={bg} color={textColor} />
    </View>
    <View style={styles.monitorMeta}>
      <AppText variant="caption" color={Colors.textSecondary}>
        Target: {target}
      </AppText>
    </View>
    <AppText variant="small" color={textColor} style={{marginTop: vs(2)}}>
      {note}
    </AppText>
  </View>
);

/* ── urgent item ── */
const UrgentItem = ({text}) => (
  <View style={styles.urgentRow}>
    <Icon family="Ionicons" name="warning-outline" size={16} color={Colors.redText} />
    <AppText variant="body" color={Colors.redText} style={{marginLeft: s(8), flex: 1}}>
      {text}
    </AppText>
  </View>
);

/* ── data ── */
const ACTIONS = [
  {
    icon: 'alarm-outline',
    description: 'Set PM Metformin alarm on phone',
    owner: 'Patient',
    statusLabel: 'Urgent',
    statusBg: Colors.redBg,
    statusColor: Colors.redText,
  },
  {
    icon: 'medkit-outline',
    description: 'Methylcobalamin daily -- morning with breakfast',
    owner: 'Patient',
    statusLabel: 'Started',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    icon: 'flask-outline',
    description: 'Get B12 level tested',
    owner: 'Patient',
    statusLabel: 'Ordered',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
  {
    icon: 'eye-outline',
    description: 'Book eye exam at LV Prasad',
    owner: 'Patient',
    statusLabel: 'Referred',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
  {
    icon: 'nutrition-outline',
    description: 'Switch dinner from white rice to brown rice',
    owner: 'Patient',
    statusLabel: 'Advised',
    statusBg: Colors.blueBg,
    statusColor: Colors.blueText,
  },
];

const MONITORING = [
  {
    parameter: 'HbA1c',
    current: '7.8%',
    target: '<7.0%',
    note: 'Recheck Apr 2026',
    bg: Colors.redBg,
    textColor: Colors.redText,
  },
  {
    parameter: 'BP',
    current: '130/82',
    target: '<130/80',
    note: 'Borderline -- monitor',
    bg: Colors.amberBg,
    textColor: Colors.amberText,
  },
  {
    parameter: 'LDL',
    current: '118',
    target: '<120',
    note: 'Achieved -- maintain',
    bg: Colors.tealBg,
    textColor: Colors.tealText,
  },
  {
    parameter: 'B12',
    current: 'Pending',
    target: '>300 pg/mL',
    note: 'Awaiting result',
    bg: Colors.amberBg,
    textColor: Colors.amberText,
  },
];

const URGENT_SIGNS = [
  'Persistent vomiting or inability to eat',
  'Blood glucose >300 or <70 mg/dL',
  'Sudden vision changes',
  'Chest pain or severe breathlessness',
  'Numbness or weakness in limbs',
];

/* ── component ── */
const VisitFollowUpTab = () => (
  <ScrollView
    style={styles.container}
    contentContainerStyle={styles.content}
    showsVerticalScrollIndicator={false}>
    {/* ── Next appointment ── */}
    <View style={[styles.card, styles.appointmentCard]}>
      <View style={styles.cardTitleRow}>
        <Icon family="Ionicons" name="calendar-outline" size={18} color={Colors.white} />
        <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
          Next Appointment
        </AppText>
      </View>
      <AppText variant="header" color={Colors.white} style={{marginTop: vs(4)}}>
        Follow-up: 15 April 2026
      </AppText>
      <AppText variant="body" color={Colors.white} style={{marginTop: vs(4), opacity: 0.9}}>
        Dr. Kavitha Reddy -- Endocrinology -- KIMS Hospital
      </AppText>
      <AppText variant="caption" color={Colors.white} style={{marginTop: vs(4), opacity: 0.8}}>
        Review: HbA1c response, B12 levels, eye exam results
      </AppText>
    </View>

    {/* ── Action items ── */}
    <View style={styles.card}>
      <View style={styles.cardTitleRow}>
        <Icon family="Ionicons" name="checkbox-outline" size={18} color={Colors.primary} />
        <AppText variant="bodyBold" style={{marginLeft: s(6)}}>
          Action Items
        </AppText>
      </View>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(8)}}>
        Tasks from 15 Mar 2026 visit
      </AppText>
      {ACTIONS.map((item, i) => (
        <React.Fragment key={item.description}>
          {i > 0 && <View style={styles.separator} />}
          <ActionItem {...item} />
        </React.Fragment>
      ))}
    </View>

    {/* ── Monitoring targets ── */}
    <View style={styles.card}>
      <View style={styles.cardTitleRow}>
        <Icon family="Ionicons" name="trending-up-outline" size={18} color={Colors.primary} />
        <AppText variant="bodyBold" style={{marginLeft: s(6)}}>
          Monitoring Targets
        </AppText>
      </View>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(8)}}>
        Priya Reddy -- 42F -- Type 2 Diabetes, Hypertension, Dyslipidaemia
      </AppText>
      {MONITORING.map((item, i) => (
        <React.Fragment key={item.parameter}>
          {i > 0 && <View style={styles.separator} />}
          <MonitoringRow {...item} />
        </React.Fragment>
      ))}
    </View>

    {/* ── When to seek urgent care ── */}
    <View style={[styles.card, {backgroundColor: Colors.redBg}]}>
      <View style={styles.cardTitleRow}>
        <Icon family="Ionicons" name="alert-circle-outline" size={18} color={Colors.redText} />
        <AppText variant="bodyBold" color={Colors.redText} style={{marginLeft: s(6)}}>
          When to Seek Urgent Care
        </AppText>
      </View>
      {URGENT_SIGNS.map((text) => (
        <UrgentItem key={text} text={text} />
      ))}
    </View>

    {/* ── Shared with ── */}
    <View style={[styles.card, {backgroundColor: Colors.tealBg}]}>
      <View style={styles.cardTitleRow}>
        <Icon family="Ionicons" name="share-social-outline" size={18} color={Colors.tealText} />
        <AppText variant="bodyBold" color={Colors.tealText} style={{marginLeft: s(6)}}>
          Shared With
        </AppText>
      </View>
      <AppText variant="body" color={Colors.tealText}>
        This visit note has been shared with Priya Reddy via the TrustLife app. Patient
        acknowledged on 15 Mar 2026.
      </AppText>
    </View>
  </ScrollView>
);

/* ── styles ── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: s(4),
    paddingBottom: vs(32),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    padding: s(14),
    marginBottom: vs(14),
  },
  appointmentCard: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  separator: {
    height: 0.5,
    backgroundColor: Colors.borderLight,
    marginVertical: vs(10),
  },
  /* pill */
  pill: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
  /* action row */
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(4),
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
    marginRight: s(8),
  },
  /* monitoring row */
  monitorRow: {
    paddingVertical: vs(4),
  },
  monitorTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  monitorMeta: {
    marginTop: vs(2),
  },
  /* urgent */
  urgentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(6),
  },
});

export default VisitFollowUpTab;
