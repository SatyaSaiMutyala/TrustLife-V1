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

const TIME_OF_DAY = [
  {label: 'Morning', range: '6\u201310AM', icon: 'sunny-outline', sev: '5.8', sevColor: Colors.redText},
  {label: 'Midday', range: '10AM\u20132PM', icon: 'partly-sunny-outline', sev: '3.2', sevColor: Colors.amberText},
  {label: 'Afternoon', range: '2\u20136PM', icon: 'cloud-outline', sev: '3.8', sevColor: Colors.amberText},
  {label: 'Evening', range: '6PM+', icon: 'moon-outline', sev: '2.4', sevColor: Colors.amberText},
];

const DAY_OF_WEEK = [
  {day: 'Mon', sev: 5.1, pct: 60, color: Colors.red},
  {day: 'Tue', sev: 4.8, pct: 50, color: Colors.red},
  {day: 'Wed', sev: 4.2, pct: 45, color: Colors.amber},
  {day: 'Thu', sev: 5.0, pct: 55, color: Colors.red},
  {day: 'Fri', sev: 5.6, pct: 65, color: Colors.red},
  {day: 'Sat', sev: 2.1, pct: 25, color: Colors.lightGreen},
  {day: 'Sun', sev: 1.8, pct: 20, color: Colors.lightGreen},
];

const WEEK_OVER_WEEK = [
  {label: 'Week 1', avg: '2.0', avgColor: Colors.tealText, pct: 20, barColor: Colors.lightGreen},
  {label: 'Week 2', avg: '4.3', avgColor: Colors.amberText, pct: 48, barColor: Colors.amber},
  {label: 'Week 3', avg: '4.8', avgColor: Colors.redText, pct: 52, barColor: Colors.red},
  {label: 'Week 4', avg: '4.3', avgColor: Colors.amberText, pct: 46, barColor: Colors.amber},
];

const SYMPTOM_CHARACTER = [
  {
    icon: 'body-outline',
    iconBg: Colors.pinkBg,
    title: 'Whole-body heaviness',
    desc: 'Limbs heavy, difficulty rising',
    pct: '78%',
  },
  {
    icon: 'brain-outline',
    iconBg: Colors.blueBg,
    title: 'Mental fog / poor concentration',
    desc: 'Difficulty focusing',
    pct: '56%',
    iconFamily: 'MaterialCommunityIcons',
  },
  {
    icon: 'bed-outline',
    iconBg: Colors.amberBg,
    title: 'Excessive daytime sleepiness',
    desc: 'Only on <5.5h sleep days',
    pct: '33%',
  },
];

/* --- Sub-components --- */

const TimeOfDayCard = () => (
  <View style={sty.card}>
    <AppText variant="bodyBold" color={Colors.textPrimary} style={sty.cardPad}>
      Time of day
    </AppText>
    <View style={sty.todGrid}>
      {TIME_OF_DAY.map((t, i) => (
        <View key={i} style={sty.todCell}>
          <View style={sty.todIconWrap}>
            <Icon family="Ionicons" name={t.icon} size={20} color={Colors.textSecondary} />
          </View>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(4)}}>
            {t.label}
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>{t.range}</AppText>
          <AppText variant="bodyBold" color={t.sevColor} style={{marginTop: vs(4)}}>
            {t.sev}
          </AppText>
        </View>
      ))}
    </View>
    <View style={sty.footerWrap}>
      <AppText variant="small" color={Colors.textSecondary}>
        Morning is worst {'\u2014'} improves through the day. Consider morning-focused interventions.
      </AppText>
    </View>
  </View>
);

const DayOfWeekCard = () => (
  <View style={sty.card}>
    <AppText variant="bodyBold" color={Colors.textPrimary} style={sty.cardPad}>
      Day of week
    </AppText>
    <View style={sty.dowGrid}>
      {DAY_OF_WEEK.map((d, i) => (
        <View key={i} style={sty.dowCol}>
          <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(4)}}>
            {d.sev}
          </AppText>
          <View style={sty.dowBarBg}>
            <View
              style={[
                sty.dowBarFill,
                {height: `${d.pct}%`, backgroundColor: d.color},
              ]}
            />
          </View>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(4)}}>
            {d.day}
          </AppText>
        </View>
      ))}
    </View>
    <View style={sty.footerWrap}>
      <AppText variant="small" color={Colors.textSecondary}>
        Friday worst (5.6), weekend recovery dramatic. Weekday stress and sleep deprivation are key drivers.
      </AppText>
    </View>
  </View>
);

const WeekOverWeekCard = () => (
  <View style={sty.card}>
    <AppText variant="bodyBold" color={Colors.textPrimary} style={sty.cardPad}>
      Week-over-week
    </AppText>
    {WEEK_OVER_WEEK.map((w, i) => (
      <View
        key={i}
        style={[sty.weekRow, i < WEEK_OVER_WEEK.length - 1 && sty.rowBorder]}>
        <AppText variant="body" color={Colors.textPrimary} style={sty.weekLabel}>
          {w.label}
        </AppText>
        <View style={sty.weekBarBg}>
          <View
            style={[sty.weekBarFill, {width: `${w.pct}%`, backgroundColor: w.barColor}]}
          />
        </View>
        <AppText variant="bodyBold" color={w.avgColor} style={sty.weekValue}>
          {w.avg}
        </AppText>
      </View>
    ))}
    <View style={sty.footerWrap}>
      <AppText variant="small" color={Colors.textSecondary}>
        Worsened Week 1{'\u2192'}3, slight plateau Week 4. Monitor if plateau holds or reverses.
      </AppText>
    </View>
  </View>
);

const SymptomCharacterCard = () => (
  <View style={sty.card}>
    <AppText variant="bodyBold" color={Colors.textPrimary} style={sty.cardPad}>
      Symptom character
    </AppText>
    {SYMPTOM_CHARACTER.map((sc, i) => (
      <View
        key={i}
        style={[sty.charRow, i < SYMPTOM_CHARACTER.length - 1 && sty.rowBorder]}>
        <View style={[sty.charIcon, {backgroundColor: sc.iconBg}]}>
          <Icon
            family={sc.iconFamily || 'Ionicons'}
            name={sc.icon}
            size={16}
            color={Colors.textPrimary}
          />
        </View>
        <View style={{flex: 1, marginLeft: s(10)}}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>{sc.title}</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
            {sc.desc}
          </AppText>
        </View>
        <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginLeft: s(8)}}>
          {sc.pct}
        </AppText>
      </View>
    ))}
  </View>
);

/* --- Main Component --- */

const SymPatternsTab = () => (
  <ScrollView
    style={sty.container}
    contentContainerStyle={sty.content}
    showsVerticalScrollIndicator={false}>
    <TimeOfDayCard />
    <DayOfWeekCard />
    <WeekOverWeekCard />
    <SymptomCharacterCard />
  </ScrollView>
);

/* --- Styles --- */

const sty = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  content: {paddingHorizontal: s(15), paddingBottom: vs(32)},

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

  /* Footer */
  footerWrap: {
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    borderTopWidth: 0.5,
    borderTopColor: borderTertiary,
  },

  /* Time of day grid */
  todGrid: {
    flexDirection: 'row',
    paddingHorizontal: s(10),
    paddingBottom: vs(10),
  },
  todCell: {
    flex: 1,
    alignItems: 'center',
    paddingHorizontal: s(4),
  },
  todIconWrap: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: backgroundSecondary,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Day of week bars */
  dowGrid: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: s(14),
    paddingBottom: vs(10),
    height: vs(160),
  },
  dowCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  dowBarBg: {
    width: ms(20),
    flex: 1,
    backgroundColor: backgroundSecondary,
    borderRadius: ms(6),
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  dowBarFill: {
    width: '100%',
    borderRadius: ms(6),
  },

  /* Week-over-week rows */
  weekRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
  },
  weekLabel: {
    width: s(58),
  },
  weekBarBg: {
    flex: 1,
    height: vs(8),
    backgroundColor: backgroundSecondary,
    borderRadius: ms(4),
    overflow: 'hidden',
    marginHorizontal: s(10),
  },
  weekBarFill: {
    height: '100%',
    borderRadius: ms(4),
  },
  weekValue: {
    width: s(32),
    textAlign: 'right',
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: borderTertiary,
  },

  /* Symptom character rows */
  charRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
  },
  charIcon: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default SymPatternsTab;
