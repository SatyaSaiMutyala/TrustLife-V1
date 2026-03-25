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

const backgroundSecondary = '#F3F4F6';
const borderTertiary = '#d1d5db';

/* ─── data ─── */
const FOOTER_PILLS = [
  {label: 'No cardiac cause', bg: Colors.tealBg},
  {label: 'B12 supplement started', bg: Colors.amberBg},
  {label: 'Sleep primary intervention', bg: Colors.blueBg},
];

const MESSAGES = [
  {
    sender: 'Priya',
    isPatient: true,
    date: '18 Mar 8:42 PM',
    text: 'The fatigue is still quite bad \u2013 mostly mornings. Tried sleeping earlier but keep waking at 3 AM.',
  },
  {
    sender: 'Dr. Kavitha',
    isPatient: false,
    date: '19 Mar 9:15 AM',
    text: 'That\u2019s a really important observation. Early-morning waking with fatigue strongly suggests disrupted sleep architecture rather than just duration. Keep that pattern for 10 more days and note your fasting glucose each morning.',
  },
  {
    sender: 'Priya',
    isPatient: true,
    date: '22 Mar 7:30 AM',
    text: 'Fasting glucose 7.4 after 7h sleep vs 9.1 after 5.1h. The pattern is really clear now.',
  },
  {
    sender: 'Dr. Kavitha',
    isPatient: false,
    date: '22 Mar 10:20 AM',
    text: 'Exactly what we expected. 7.4 vs 9.1 is proof sleep is your most powerful intervention right now. Keep logging \u2013 this data will be essential for our Apr 4 review.',
  },
];

const CONDITIONS = [
  {
    icon: 'water-outline',
    iconBg: Colors.pinkBg,
    title: 'Mild anaemia \u00b7 Hb 11.8',
    desc: 'ICD-10: D64.9 \u00b7 B12 deficiency contributing to fatigue',
    status: 'Active',
    statusColor: Colors.amberText,
  },
  {
    icon: 'flask-outline',
    iconBg: Colors.amberBg,
    title: 'T2DM \u00b7 HbA1c 7.8%',
    desc: 'Chronic hyperglycaemia contributes to fatigue and poor recovery',
    status: 'Linked',
    statusColor: Colors.amberText,
  },
  {
    icon: 'moon-outline',
    iconBg: Colors.blueBg,
    title: 'Sleep impairment \u00b7 avg 5.9h',
    desc: 'Functional sleep deprivation worsening glucose control and energy',
    status: 'Primary',
    statusColor: Colors.redText,
  },
];

/* ─── component ─── */
const SymDoctorNotesTab = () => {
  const renderInsight = (bg, iconColor, iconName, text) => (
    <View style={[styles.insightCard, {backgroundColor: bg}]}>
      <Icon family="Ionicons" name={iconName} size={ms(18)} color={iconColor} />
      <AppText variant="caption" color={iconColor} style={{marginLeft: s(8), flex: 1}}>
        {text}
      </AppText>
    </View>
  );

  const renderVisitNote = () => (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.visitHeader}>
        <View style={styles.avatar}>
          <AppText variant="bodyBold" color={Colors.primary}>KR</AppText>
        </View>
        <View style={{flex: 1, marginLeft: s(10)}}>
          <AppText variant="bodyBold">Dr. Kavitha Reddy {'\u00b7'} Endocrinology</AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            KIMS Hospital {'\u00b7'} 15 Mar 2026 {'\u00b7'} In-person
          </AppText>
        </View>
      </View>

      {/* Quote block */}
      <View style={styles.quoteBlock}>
        <AppText variant="body" color={Colors.textSecondary} style={{fontStyle: 'italic'}}>
          Patient reports persistent fatigue over 2{'\u2013'}3 weeks. Examination reveals mild
          pallor. Methylcobalamin initiated. Sleep quality is primary modifiable factor and
          should be addressed before adjusting diabetes regimen.
        </AppText>
      </View>

      {/* Footer pills */}
      <View style={styles.pillRow}>
        {FOOTER_PILLS.map((p, i) => (
          <View key={i} style={[styles.pill, {backgroundColor: p.bg}]}>
            <AppText variant="small" color={Colors.textPrimary}>{p.label}</AppText>
          </View>
        ))}
      </View>
    </View>
  );

  const renderMessageBubble = (msg, idx) => {
    const isPatient = msg.isPatient;
    return (
      <View
        key={idx}
        style={[
          styles.bubbleWrapper,
          {alignItems: isPatient ? 'flex-end' : 'flex-start'},
        ]}>
        <AppText variant="small" color={Colors.textTertiary} style={{marginBottom: vs(2)}}>
          {isPatient ? 'Priya' : 'Dr. Kavitha'} {'\u00b7'} {msg.date}
        </AppText>
        <View
          style={[
            styles.bubble,
            isPatient
              ? {
                  backgroundColor: Colors.primary,
                  borderBottomRightRadius: ms(4),
                }
              : {
                  backgroundColor: Colors.white,
                  borderWidth: 0.5,
                  borderColor: borderTertiary,
                  borderBottomLeftRadius: ms(4),
                },
          ]}>
          <AppText
            variant="body"
            color={isPatient ? Colors.white : Colors.textPrimary}>
            {msg.text}
          </AppText>
        </View>
      </View>
    );
  };

  const renderMessageThread = () => (
    <View style={styles.card}>
      <View style={styles.threadHeader}>
        <AppText variant="bodyBold">Follow-up messages</AppText>
        <AppText variant="caption" color={Colors.textSecondary}>
          Via TrustLife {'\u00b7'} Secure
        </AppText>
      </View>
      <View style={{gap: vs(12)}}>
        {MESSAGES.map((m, i) => renderMessageBubble(m, i))}
      </View>
    </View>
  );

  const renderConditions = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        Associated conditions
      </AppText>
      {CONDITIONS.map((c, i) => (
        <View
          key={i}
          style={[
            styles.conditionRow,
            i < CONDITIONS.length - 1 && {
              borderBottomWidth: 0.5,
              borderBottomColor: borderTertiary,
            },
          ]}>
          <View style={[styles.conditionIcon, {backgroundColor: c.iconBg}]}>
            <Icon family="Ionicons" name={c.icon} size={ms(18)} color={Colors.primary} />
          </View>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="bodyBold">{c.title}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>{c.desc}</AppText>
          </View>
          <AppText variant="small" color={c.statusColor}>{c.status}</AppText>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {renderInsight(
        Colors.blueBg,
        Colors.blueText,
        'medkit-outline',
        'Fatigue discussed at 1 visit and 2 message exchanges. Dr. Kavitha identified sleep as the primary driver and initiated B12 supplementation.',
      )}
      {renderVisitNote()}
      {renderMessageThread()}
      {renderConditions()}
      {renderInsight(
        Colors.tealBg,
        Colors.tealText,
        'clipboard-outline',
        'Review plan: Dr. Kavitha will reassess fatigue, sleep data and B12 levels at the Apr 4 follow-up appointment.',
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  content: {
    padding: s(4),
    paddingBottom: vs(32),
    gap: vs(12),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    padding: ms(14),
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    padding: ms(14),
  },
  visitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  avatar: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteBlock: {
    borderLeftWidth: 2.5,
    borderLeftColor: Colors.lightGreen,
    paddingLeft: s(12),
    marginBottom: vs(12),
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  pill: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(8),
  },
  threadHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(14),
  },
  bubbleWrapper: {
    width: '100%',
  },
  bubble: {
    maxWidth: '85%',
    padding: ms(12),
    borderRadius: ms(14),
  },
  conditionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  conditionIcon: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SymDoctorNotesTab;
