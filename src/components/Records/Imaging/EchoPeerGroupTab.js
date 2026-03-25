import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const diastolicDist = [
  {label: 'Normal', pct: 31, bar: 31, bg: Colors.tealBg, color: Colors.tealText},
  {label: 'Grade 1', pct: 52, bar: 52, bg: Colors.amberBg, color: Colors.amberText, you: true},
  {label: 'Grade 2+', pct: 17, bar: 17, bg: Colors.redBg, color: Colors.redText},
];

const EchoPeerGroupTab = () => {
  const renderPeerHeader = () => (
    <View style={styles.peerHeader}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8)}}>
        <Icon family="Ionicons" name="people-outline" size={22} color={Colors.white} />
        <View>
          <AppText variant="bodyBold" color={Colors.white}>Peer Comparison</AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.7)">
            Similar age, gender, conditions
          </AppText>
        </View>
      </View>
      <View style={styles.peerBadge}>
        <AppText variant="small" color={Colors.white} style={{fontWeight: '700'}}>
          n = 2,140
        </AppText>
      </View>
    </View>
  );

  const renderEFComparison = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>Ejection Fraction</AppText>
      <View style={styles.compareRow}>
        <View style={styles.compareCol}>
          <AppText variant="caption" color={Colors.textSecondary}>You</AppText>
          <AppText variant="header" color={Colors.tealText}>62%</AppText>
        </View>
        <View style={styles.divider} />
        <View style={styles.compareCol}>
          <AppText variant="caption" color={Colors.textSecondary}>Peer avg</AppText>
          <AppText variant="header" color={Colors.textPrimary}>59%</AppText>
        </View>
      </View>
      <View style={[styles.pill, {backgroundColor: Colors.tealBg, alignSelf: 'center', marginTop: vs(8)}]}>
        <Icon family="Ionicons" name="arrow-up-outline" size={14} color={Colors.tealText} />
        <AppText variant="small" color={Colors.tealText} style={{fontWeight: '600'}}>Better</AppText>
      </View>
    </View>
  );

  const renderLVH = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(6)}}>LVH Prevalence</AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(10)}}>
        38% of peers have LV hypertrophy
      </AppText>
      <View style={styles.barTrack}>
        <View style={[styles.barFill, {width: '38%', backgroundColor: Colors.amberBg}]} />
      </View>
      <View style={styles.barLabels}>
        <AppText variant="small" color={Colors.amberText}>38% have LVH</AppText>
        <AppText variant="small" color={Colors.tealText}>62% no LVH</AppText>
      </View>
      <View style={[styles.insightBox, {backgroundColor: Colors.tealBg, marginTop: vs(10)}]}>
        <Icon family="Ionicons" name="checkmark-circle-outline" size={16} color={Colors.tealText} />
        <AppText variant="caption" color={Colors.tealText} style={{flex: 1}}>
          You do not have LVH. Your wall thickness is within the normal range.
        </AppText>
      </View>
    </View>
  );

  const renderDiastolicDist = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(6)}}>Diastolic Dysfunction</AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(10)}}>
        Distribution among peers
      </AppText>
      {diastolicDist.map((item, i) => (
        <View key={i} style={{marginBottom: vs(10)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4)}}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
              <AppText variant="caption" color={item.color}>{item.label}</AppText>
              {item.you && (
                <View style={[styles.youPill, {backgroundColor: item.bg}]}>
                  <AppText variant="small" color={item.color} style={{fontWeight: '700'}}>You</AppText>
                </View>
              )}
            </View>
            <AppText variant="bodyBold" color={item.color}>{item.pct}%</AppText>
          </View>
          <View style={styles.barTrack}>
            <View style={[styles.barFill, {width: `${item.bar}%`, backgroundColor: item.bg}]} />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderPeerHeader()}
      {renderEFComparison()}
      {renderLVH()}
      {renderDiastolicDist()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: s(4),
  },
  peerHeader: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    padding: ms(14),
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  peerBadge: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: ms(10),
    paddingVertical: vs(4),
    borderRadius: ms(10),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
    marginBottom: vs(10),
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  compareCol: {
    flex: 1,
    alignItems: 'center',
  },
  divider: {
    width: 1,
    height: vs(40),
    backgroundColor: BORDER,
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    paddingHorizontal: ms(10),
    paddingVertical: vs(4),
    borderRadius: ms(10),
  },
  barTrack: {
    height: vs(8),
    backgroundColor: Colors.background,
    borderRadius: ms(4),
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    borderRadius: ms(4),
  },
  barLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(4),
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    padding: ms(10),
    borderRadius: ms(10),
  },
  youPill: {
    paddingHorizontal: ms(7),
    paddingVertical: vs(1),
    borderRadius: ms(8),
  },
});

export default EchoPeerGroupTab;
