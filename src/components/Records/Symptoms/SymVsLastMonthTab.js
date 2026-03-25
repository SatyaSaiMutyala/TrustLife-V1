import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
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
const COMPARISON_ROWS = [
  {label: 'Days with fatigue', prev: '12/28', curr: '18/24', worse: true},
  {label: 'Average severity', prev: '2.8', curr: '4.2', worse: true},
  {label: 'Peak severity', prev: '5/10', curr: '7/10', worse: true},
  {label: 'Sleep average', prev: '6.1h', curr: '5.9h', worse: true},
  {label: 'Nights <6h', prev: '6', curr: '11', worse: true},
  {label: 'PM Metformin adherence', prev: '78%', curr: '71%', worse: true},
  {label: 'Avg fasting glucose', prev: '7.8', curr: '8.4', worse: true},
];

const BARS = [
  {month: 'Nov', value: 0, height: vs(3), color: backgroundSecondary, highlighted: false},
  {month: 'Dec', value: 3.2, height: vs(36), color: Colors.red, highlighted: false},
  {month: 'Jan', value: 0, height: vs(3), color: backgroundSecondary, highlighted: false},
  {month: 'Feb', value: 2.8, height: vs(28), color: Colors.amber, highlighted: false},
  {month: 'Mar', value: 4.2, height: vs(52), color: Colors.red, highlighted: true},
];

const CHANGES = [
  {
    icon: 'moon-outline',
    iconBg: Colors.blueBg,
    title: 'Sleep declined (6.1h \u2192 5.9h)',
    desc: 'Nights <6h doubled from 6 to 11. Disrupted sleep is the strongest fatigue driver identified.',
  },
  {
    icon: 'medical-outline',
    iconBg: Colors.purpleBg,
    title: 'Metformin PM dropped (78% \u2192 71%)',
    desc: 'Missed doses cluster on late-night weekdays. Evening adherence directly affects morning glucose and energy.',
  },
  {
    icon: 'water-outline',
    iconBg: Colors.pinkBg,
    title: 'Hb 11.8 confirmed (new finding Mar)',
    desc: 'B12-related anaemia now confirmed and treated. Methylcobalamin started 15 Mar.',
  },
];

/* ─── component ─── */
const SymVsLastMonthTab = () => {
  const renderComparison = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        Feb vs Mar comparison
      </AppText>
      {COMPARISON_ROWS.map((r, i) => (
        <View
          key={i}
          style={[
            styles.compRow,
            i < COMPARISON_ROWS.length - 1 && {
              borderBottomWidth: 0.5,
              borderBottomColor: borderTertiary,
            },
          ]}>
          <AppText variant="body" color={Colors.textSecondary} style={{flex: 1}}>
            {r.label}
          </AppText>
          <AppText variant="caption" color={Colors.textTertiary} style={{width: s(48), textAlign: 'right'}}>
            {r.prev}
          </AppText>
          <View style={{width: s(28), alignItems: 'center'}}>
            <AppText variant="small" color={r.worse ? Colors.redText : Colors.tealText}>
              {r.worse ? '\u2191' : '\u2193'}
            </AppText>
          </View>
          <AppText
            variant="bodyBold"
            color={r.worse ? Colors.redText : Colors.tealText}
            style={{width: s(48), textAlign: 'right'}}>
            {r.curr}
          </AppText>
        </View>
      ))}
    </View>
  );

  const renderHistory = () => (
    <View style={styles.card}>
      <View style={{marginBottom: vs(14)}}>
        <AppText variant="bodyBold">5-month fatigue history</AppText>
        <AppText variant="caption" color={Colors.textSecondary}>
          Avg severity per month
        </AppText>
      </View>

      {/* Bar chart */}
      <View style={styles.barChart}>
        {BARS.map((b, i) => (
          <View key={i} style={styles.barCol}>
            <View style={{flex: 1, justifyContent: 'flex-end', alignItems: 'center'}}>
              {b.value > 0 && (
                <AppText
                  variant="small"
                  color={b.highlighted ? Colors.redText : Colors.textSecondary}
                  style={{marginBottom: vs(4)}}>
                  {b.value}
                </AppText>
              )}
              <View
                style={[
                  styles.bar,
                  {
                    height: b.height,
                    backgroundColor: b.color,
                  },
                  b.highlighted && {
                    borderWidth: 1.5,
                    borderColor: Colors.red,
                  },
                ]}
              />
            </View>
            <AppText
              variant="small"
              color={b.highlighted ? Colors.redText : Colors.textTertiary}
              style={{marginTop: vs(6)}}>
              {b.month}
            </AppText>
          </View>
        ))}
      </View>

      {/* Footer */}
      <View style={styles.footerNote}>
        <Icon family="Ionicons" name="information-circle-outline" size={ms(14)} color={Colors.textTertiary} />
        <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(6), flex: 1}}>
          Jan was symptom-free — best month. March worst since starting TrustLife.
        </AppText>
      </View>
    </View>
  );

  const renderChanges = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        What changed
      </AppText>
      {CHANGES.map((c, i) => (
        <View
          key={i}
          style={[
            styles.changeRow,
            i < CHANGES.length - 1 && {
              borderBottomWidth: 0.5,
              borderBottomColor: borderTertiary,
            },
          ]}>
          <View style={[styles.changeIcon, {backgroundColor: c.iconBg}]}>
            <Icon family="Ionicons" name={c.icon} size={ms(18)} color={Colors.primary} />
          </View>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="bodyBold">{c.title}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>{c.desc}</AppText>
          </View>
        </View>
      ))}
    </View>
  );

  const renderActions = () => (
    <View style={{gap: vs(10)}}>
      <TouchableOpacity style={styles.primaryButton} activeOpacity={0.8}>
        <Icon family="Ionicons" name="share-outline" size={ms(18)} color={Colors.white} />
        <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(8)}}>
          Share this analysis with Dr. Kavitha
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity style={styles.outlineButton} activeOpacity={0.8}>
        <Icon family="Ionicons" name="document-outline" size={ms(18)} color={Colors.primary} />
        <AppText variant="bodyBold" color={Colors.primary} style={{marginLeft: s(8)}}>
          Export as PDF {'\u00b7'} Apr 4 preparation
        </AppText>
      </TouchableOpacity>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {/* Red insight */}
      <View style={[styles.insightCard, {backgroundColor: Colors.redBg}]}>
        <Icon family="Ionicons" name="analytics-outline" size={ms(18)} color={Colors.redText} />
        <AppText variant="caption" color={Colors.redText} style={{marginLeft: s(8), flex: 1}}>
          Fatigue worsened significantly Feb{'\u2192'}Mar. New symptom — not present in Jan.
        </AppText>
      </View>

      {renderComparison()}
      {renderHistory()}
      {renderChanges()}
      {renderActions()}
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
  compRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  barChart: {
    flexDirection: 'row',
    height: vs(110),
    alignItems: 'flex-end',
  },
  barCol: {
    flex: 1,
    alignItems: 'center',
  },
  bar: {
    width: s(28),
    borderRadius: ms(6),
  },
  footerNote: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: vs(12),
    paddingTop: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: borderTertiary,
  },
  changeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  changeIcon: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(14),
  },
  outlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 1.5,
    borderColor: Colors.primary,
    paddingVertical: vs(14),
  },
});

export default SymVsLastMonthTab;
