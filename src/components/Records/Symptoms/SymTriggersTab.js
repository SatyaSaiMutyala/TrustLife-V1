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

/* --- Static data --- */

const PRIMARY_TRIGGERS = [
  {
    label: 'SLEEP DEPRIVATION',
    bg: Colors.pinkBg,
    border: '#F4C0D1',
    items: [
      {text: 'Present on 7/8 high-severity days', pct: '88%', pctColor: Colors.redText},
      {text: 'Sleep <5.5h the night before'},
    ],
  },
  {
    label: 'PM DOSE MISSED',
    bg: Colors.amberBg,
    border: '#FAC775',
    items: [
      {text: 'Present on 5/8 high days', pct: '63%', pctColor: Colors.amberText},
      {text: 'Evening Metformin not taken'},
    ],
  },
  {
    label: 'WORKDAY STRESS',
    bg: backgroundSecondary,
    border: borderTertiary,
    items: [
      {text: 'Weekdays 6/8 high days', pct: '75%', pctColor: Colors.textSecondary},
      {text: 'Mon\u2013Fri predominant'},
    ],
  },
  {
    label: 'LOW HRV MORNING',
    bg: Colors.purpleBg,
    border: '#CECBF6',
    items: [
      {text: 'HRV <35ms precedes 6/8 days', pct: '75%', pctColor: Colors.purpleText},
      {text: 'Predictive value: check on waking'},
    ],
  },
];

const PROTECTIVE_FACTORS = [
  {
    icon: 'moon-outline',
    iconBg: Colors.tealBg,
    title: 'Sleep \u2265 7h',
    desc: 'All 6 clear days had \u22657h. 100% protective',
    stat: '100%',
    statColor: Colors.tealText,
    statLabel: 'Clear day predictor',
  },
  {
    icon: 'happy-outline',
    iconBg: Colors.pinkBg,
    title: 'Weekend rest pattern',
    desc: 'Sat/Sun lower severity',
    stat: '\u22121.8',
    statColor: Colors.tealText,
    statLabel: 'vs weekday avg',
  },
  {
    icon: 'medical-outline',
    iconBg: Colors.tealBg,
    title: 'PM Metformin + sleep \u2265 6.5h',
    desc: 'When both met, avg 2.1/10',
    stat: '2.1',
    statColor: Colors.tealText,
    statLabel: 'Avg when both met',
  },
];

const EARLY_WARNINGS = [
  {
    icon: 'pulse-outline',
    iconBg: Colors.purpleBg,
    title: 'HRV on waking < 35ms',
    desc: '87% accurate predictor',
    stat: '35ms',
    statColor: Colors.amberText,
    statLabel: 'Threshold',
  },
  {
    icon: 'thermometer-outline',
    iconBg: Colors.amberBg,
    title: 'Resting HR > 78 bpm',
    desc: 'Elevated suggests poor recovery',
    stat: '78',
    statColor: Colors.textPrimary,
    statLabel: 'Threshold',
  },
  {
    icon: 'sad-outline',
    iconBg: Colors.pinkBg,
    title: 'Mood at wake: Low/Very low',
    desc: 'Correlates 74%',
    stat: '74%',
    statColor: Colors.textPrimary,
    statLabel: 'With sleep',
  },
];

/* --- Sub-components --- */

const InsightBanner = () => (
  <View style={sty.insightCard}>
    <Icon family="Ionicons" name="flash-outline" size={16} color={Colors.amberText} />
    <AppText variant="small" color={Colors.amberText} style={{flex: 1, marginLeft: s(8)}}>
      Triggers are conditions present on days with severity {'\u2265'}5...
    </AppText>
  </View>
);

const TriggerBox = ({trigger}) => (
  <View style={[sty.triggerBox, {backgroundColor: trigger.bg, borderColor: trigger.border}]}>
    <AppText variant="small" color={Colors.textSecondary} style={sty.triggerLabel}>
      {trigger.label}
    </AppText>
    {trigger.items.map((item, i) => (
      <View key={i} style={sty.triggerItem}>
        <View style={sty.dot} />
        <AppText variant="small" color={Colors.textSecondary} style={{flex: 1}}>
          {item.text}
        </AppText>
        {item.pct && (
          <AppText variant="small" color={item.pctColor} style={{marginLeft: s(4)}}>
            {item.pct}
          </AppText>
        )}
      </View>
    ))}
  </View>
);

const PrimaryTriggersCard = () => (
  <View style={sty.card}>
    <AppText variant="bodyBold" color={Colors.textPrimary} style={sty.cardPad}>
      Primary triggers
    </AppText>
    <View style={sty.triggerGrid}>
      {PRIMARY_TRIGGERS.map((t, i) => (
        <TriggerBox key={i} trigger={t} />
      ))}
    </View>
  </View>
);

const FactorRow = ({item, isLast}) => (
  <View style={[sty.factorRow, !isLast && sty.rowBorder]}>
    <View style={[sty.factorIcon, {backgroundColor: item.iconBg}]}>
      <Icon family="Ionicons" name={item.icon} size={16} color={Colors.textPrimary} />
    </View>
    <View style={{flex: 1, marginLeft: s(10)}}>
      <AppText variant="bodyBold" color={Colors.textPrimary}>{item.title}</AppText>
      <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
        {item.desc}
      </AppText>
    </View>
    <View style={sty.statCol}>
      <AppText variant="bodyBold" color={item.statColor}>{item.stat}</AppText>
      <AppText variant="small" color={Colors.textTertiary}>{item.statLabel}</AppText>
    </View>
  </View>
);

const ProtectiveFactorsCard = () => (
  <View style={sty.card}>
    <AppText variant="bodyBold" color={Colors.textPrimary} style={sty.cardPad}>
      Protective factors
    </AppText>
    {PROTECTIVE_FACTORS.map((f, i) => (
      <FactorRow key={i} item={f} isLast={i === PROTECTIVE_FACTORS.length - 1} />
    ))}
  </View>
);

const EarlyWarningSignsCard = () => (
  <View style={sty.card}>
    <AppText variant="bodyBold" color={Colors.textPrimary} style={sty.cardPad}>
      Early warning signs
    </AppText>
    {EARLY_WARNINGS.map((w, i) => (
      <FactorRow key={i} item={w} isLast={i === EARLY_WARNINGS.length - 1} />
    ))}
  </View>
);

/* --- Main Component --- */

const SymTriggersTab = () => (
  <ScrollView
    style={sty.container}
    contentContainerStyle={sty.content}
    showsVerticalScrollIndicator={false}>
    <InsightBanner />
    <PrimaryTriggersCard />
    <ProtectiveFactorsCard />
    <EarlyWarningSignsCard />
  </ScrollView>
);

/* --- Styles --- */

const sty = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  content: {paddingHorizontal: s(15), paddingBottom: vs(32)},

  /* Insight banner */
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: ms(14),
    borderRadius: ms(14),
    backgroundColor: Colors.amberBg,
    marginBottom: vs(12),
  },

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    marginBottom: vs(12),
    overflow: 'hidden',
  },
  cardPad: {paddingHorizontal: s(14), paddingVertical: vs(10)},

  /* Trigger grid */
  triggerGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: s(10),
    paddingBottom: vs(10),
    gap: ms(8),
  },
  triggerBox: {
    width: '47%',
    borderRadius: ms(12),
    borderWidth: 1,
    padding: ms(10),
  },
  triggerLabel: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginBottom: vs(6),
  },
  triggerItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: vs(4),
  },
  dot: {
    width: ms(5),
    height: ms(5),
    borderRadius: ms(3),
    backgroundColor: Colors.textTertiary,
    marginTop: vs(4),
    marginRight: s(6),
  },

  /* Factor rows */
  factorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
  },
  factorIcon: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statCol: {
    alignItems: 'flex-end',
    marginLeft: s(8),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: borderTertiary,
  },
});

export default SymTriggersTab;
