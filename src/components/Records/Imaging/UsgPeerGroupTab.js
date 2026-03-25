import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const nafldDist = [
  {label: 'None', pct: 28, bg: Colors.tealBg, color: Colors.tealText},
  {label: 'Grade 1', pct: 44, bg: Colors.amberBg, color: Colors.amberText, you: true},
  {label: 'Grade 2', pct: 21, bg: Colors.redBg, color: Colors.redText},
  {label: 'Grade 3 / NASH', pct: 7, bg: Colors.redBg, color: Colors.redText},
];

const kidneyDist = [
  {label: 'Normal', pct: 71, bg: Colors.tealBg, color: Colors.tealText, you: true},
  {label: 'Cortical changes', pct: 18, bg: Colors.amberBg, color: Colors.amberText},
  {label: 'Cysts', pct: 11, bg: Colors.blueBg, color: Colors.blueText},
];

const UsgPeerGroupTab = () => {
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
          n = 5,120
        </AppText>
      </View>
    </View>
  );

  const renderDistribution = (title, subtitle, data) => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(4)}}>{title}</AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(10)}}>
        {subtitle}
      </AppText>
      {data.map((item, i) => (
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
            <View style={[styles.barFill, {width: `${item.pct}%`, backgroundColor: item.bg}]} />
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {renderPeerHeader()}
      {renderDistribution('NAFLD Distribution', 'Fatty liver grading among peers', nafldDist)}
      {renderDistribution('Kidney Findings', 'Renal status among peers', kidneyDist)}
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
  youPill: {
    paddingHorizontal: ms(7),
    paddingVertical: vs(1),
    borderRadius: ms(8),
  },
});

export default UsgPeerGroupTab;
