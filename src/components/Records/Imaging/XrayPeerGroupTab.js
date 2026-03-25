import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const lungRows = [
  {label: 'Normal (clear)', pct: 74, color: Colors.tealText, barColor: Colors.lightGreen},
  {label: 'Vascular prominence', pct: 14, color: Colors.amberText, barColor: Colors.amber},
  {label: 'Pleural effusion', pct: 8, color: Colors.redText, barColor: Colors.red},
  {label: 'Incidental nodule', pct: 4, color: Colors.textTertiary, barColor: Colors.textTertiary},
];

const XrayPeerGroupTab = () => {
  const renderPeerHeader = () => (
    <View style={styles.peerHeader}>
      <View style={styles.peerHeaderTop}>
        <Icon
          family="Ionicons"
          name="people-outline"
          size={ms(20)}
          color={Colors.white}
        />
        <View style={styles.peerCount}>
          <AppText variant="bodyBold" color={Colors.white}>
            n = 3,840
          </AppText>
        </View>
      </View>
      <AppText
        variant="caption"
        color="rgba(255,255,255,0.8)"
        style={{marginTop: vs(4)}}>
        Women 35--42 -- T2DM + HTN >=5yr -- Hyderabad
      </AppText>
    </View>
  );

  const renderCTRComparison = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
        Cardiothoracic ratio (CTR)
      </AppText>

      {/* Values row */}
      <View style={styles.compareRow}>
        <View style={styles.compareItem}>
          <AppText variant="caption" color={Colors.textSecondary}>
            Your CTR
          </AppText>
          <AppText variant="header" color={Colors.primary}>
            0.47
          </AppText>
        </View>
        <View style={styles.compareItem}>
          <AppText variant="caption" color={Colors.textSecondary}>
            Peer avg
          </AppText>
          <AppText variant="header" color={Colors.textPrimary}>
            0.49
          </AppText>
        </View>
        <View style={[styles.pill, {backgroundColor: Colors.tealBg}]}>
          <Icon
            family="Ionicons"
            name="checkmark-circle-outline"
            size={ms(12)}
            color={Colors.tealText}
          />
          <AppText variant="small" color={Colors.tealText} style={{marginLeft: s(3)}}>
            Better
          </AppText>
        </View>
      </View>

      {/* Visual bar */}
      <View style={styles.barContainer}>
        <View style={styles.barTrack}>
          <View style={[styles.barFill, {width: '61%'}]} />
        </View>
        <View style={[styles.marker, {left: '47%'}]}>
          <View style={styles.markerLine} />
          <AppText variant="small" color={Colors.primary} style={{fontWeight: '700'}}>
            You
          </AppText>
        </View>
        <View style={[styles.marker, {left: '61%'}]}>
          <View style={[styles.markerLine, {backgroundColor: Colors.textTertiary}]} />
          <AppText variant="small" color={Colors.textTertiary}>
            Avg
          </AppText>
        </View>
      </View>

      {/* Insight */}
      <View style={[styles.insightBox, {backgroundColor: Colors.tealBg}]}>
        <Icon
          family="Ionicons"
          name="trending-up-outline"
          size={ms(16)}
          color={Colors.tealText}
        />
        <AppText
          variant="caption"
          color={Colors.tealText}
          style={{flex: 1, marginLeft: s(6)}}>
          Better than 61% of peers in your cohort
        </AppText>
      </View>
    </View>
  );

  const renderCardiomegaly = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
        Cardiomegaly prevalence
      </AppText>

      <View style={styles.barContainer}>
        <View style={styles.barTrackTall}>
          <View
            style={[
              styles.barFillColored,
              {width: '28%', backgroundColor: Colors.red},
            ]}
          />
        </View>
        <AppText
          variant="bodyBold"
          color={Colors.redText}
          style={{marginTop: vs(4)}}>
          28%
        </AppText>
      </View>

      <AppText
        variant="caption"
        color={Colors.textSecondary}
        style={{marginTop: vs(6)}}>
        28% of women in your peer group with T2DM + HTN have cardiomegaly on
        chest X-ray. Your heart size is within normal limits.
      </AppText>
    </View>
  );

  const renderLungFindings = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        Lung findings comparison
      </AppText>
      {lungRows.map((row, i) => (
        <View
          key={i}
          style={[
            styles.lungRow,
            i < lungRows.length - 1 && styles.rowBorder,
          ]}>
          <View style={{flex: 1}}>
            <AppText variant="caption">{row.label}</AppText>
          </View>
          <View style={styles.lungBar}>
            <View style={styles.lungBarTrack}>
              <View
                style={[
                  styles.lungBarFill,
                  {width: `${row.pct}%`, backgroundColor: row.barColor},
                ]}
              />
            </View>
          </View>
          <AppText
            variant="caption"
            color={row.color}
            style={{width: s(34), textAlign: 'right', fontWeight: '600'}}>
            {row.pct}%
          </AppText>
        </View>
      ))}
    </View>
  );

  const renderBMI = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(6)}}>
        BMI-adjusted cardiac risk
      </AppText>
      <View style={styles.compareRow}>
        <View style={styles.compareItem}>
          <AppText variant="caption" color={Colors.textSecondary}>
            Your risk
          </AppText>
          <AppText variant="header" color={Colors.tealText}>
            14%
          </AppText>
        </View>
        <View style={styles.compareItem}>
          <AppText variant="caption" color={Colors.textSecondary}>
            Peer average
          </AppText>
          <AppText variant="header" color={Colors.textPrimary}>
            22%
          </AppText>
        </View>
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {renderPeerHeader()}
      {renderCTRComparison()}
      {renderCardiomegaly()}
      {renderLungFindings()}
      {renderBMI()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: s(4),
    gap: vs(10),
  },
  peerHeader: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    padding: ms(14),
  },
  peerHeaderTop: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  peerCount: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    paddingHorizontal: ms(10),
    paddingVertical: vs(3),
    borderRadius: ms(8),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
  },
  compareRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
    marginBottom: vs(8),
  },
  compareItem: {
    alignItems: 'center',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(8),
    paddingVertical: vs(3),
    borderRadius: ms(10),
    marginLeft: 'auto',
  },
  barContainer: {
    position: 'relative',
    marginBottom: vs(8),
  },
  barTrack: {
    height: vs(8),
    backgroundColor: Colors.background,
    borderRadius: ms(4),
    overflow: 'hidden',
  },
  barFill: {
    height: '100%',
    backgroundColor: Colors.primary,
    borderRadius: ms(4),
  },
  barTrackTall: {
    height: vs(12),
    backgroundColor: Colors.background,
    borderRadius: ms(6),
    overflow: 'hidden',
  },
  barFillColored: {
    height: '100%',
    borderRadius: ms(6),
  },
  marker: {
    position: 'absolute',
    top: -vs(2),
    alignItems: 'center',
  },
  markerLine: {
    width: 2,
    height: vs(12),
    backgroundColor: Colors.primary,
    borderRadius: 1,
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(10),
    borderRadius: ms(10),
  },
  lungRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    gap: s(8),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  lungBar: {
    width: s(80),
  },
  lungBarTrack: {
    height: vs(6),
    backgroundColor: Colors.background,
    borderRadius: ms(3),
    overflow: 'hidden',
  },
  lungBarFill: {
    height: '100%',
    borderRadius: ms(3),
  },
});

export default XrayPeerGroupTab;
