import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import Svg, {Circle} from 'react-native-svg';
import Emoji from '../shared/Emoji';
import AppText from '../shared/AppText';

const RING = ms(68);
const RING_R = ms(28);
const RING_SW = ms(6);

const HeroSection = ({navigation}) => {
  return (
    <View style={styles.hero}>
      <View style={styles.heroTop}>
        <View style={styles.heroLeft}>
          <AppText variant="subtitle" color="rgba(255,255,255,0.65)">Good morning,</AppText>
          <AppText variant="screenName" color={Colors.white} style={styles.heroName}>Priya</AppText>
        </View>
        <View style={styles.iconRow}>
          <TouchableOpacity style={styles.iconBtn}>
            <Emoji icon="🔔" size={ms(16)} />
            <View style={styles.badge}>
              <AppText variant="small" color={Colors.white} style={styles.badgeText}>3</AppText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={styles.iconBtn}>
            <Emoji icon="📋" size={ms(16)} />
            <View style={styles.badge}>
              <AppText variant="small" color={Colors.white} style={styles.badgeText}>2</AppText>
            </View>
          </TouchableOpacity>
          <TouchableOpacity style={[styles.iconBtn, styles.profileBtn]} onPress={() => navigation?.navigate('Profile')}>
            <AppText variant="bodyBold" color="#04342C">PR</AppText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={styles.scoreRow}>
        <View style={styles.scoreRing}>
          <Svg width={RING} height={RING} viewBox="0 0 68 68">
            <Circle cx={34} cy={34} r={RING_R} fill="none" stroke="rgba(255,255,255,0.15)" strokeWidth={RING_SW} />
            <Circle cx={34} cy={34} r={RING_R} fill="none" stroke={Colors.lightGreen} strokeWidth={RING_SW} strokeDasharray="176" strokeDashoffset="39" strokeLinecap="round" rotation={-90} origin="34,34" />
          </Svg>
          <Text style={styles.scoreNum}>78</Text>
        </View>
        <View style={styles.scoreMeta}>
          <AppText variant="bodyBold" color={Colors.white}>Wellness score</AppText>
          <AppText variant="caption" color={Colors.heroTextMuted} style={styles.scoreSub}>↑ 4 pts this week · 3 risks active</AppText>
          <View style={styles.scoreBarWrap}>
            <View style={styles.scoreBarBg}>
              <View style={[styles.scoreBarFill, {width: '78%'}]} />
            </View>
            <AppText variant="caption" color={Colors.heroTextSubtle}>78/100</AppText>
          </View>
        </View>
      </View>

      <View style={styles.statsRow}>
        {[
          {val: '7', lbl: 'Day streak'},
          {val: '5.9h', lbl: 'Avg sleep'},
          {val: '7.8k', lbl: 'Avg steps'},
          {val: '71%', lbl: 'Meds'},
        ].map((stat, i) => (
          <View key={i} style={styles.statChip}>
            <AppText variant="bodyBold" color={Colors.white}>{stat.val}</AppText>
            <AppText variant="subtext" color={Colors.heroTextSubtle} style={styles.statLbl}>{stat.lbl}</AppText>
          </View>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  hero: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(16),
    paddingTop: vs(12),
    paddingBottom: vs(30),
  },
  heroTop: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(14),
  },
  heroLeft: {
    flex: 1,
    marginRight: s(12),
  },
  heroName: {
    marginTop: vs(1),
  },
  iconRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    flexShrink: 0,
  },
  iconBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: Colors.heroOverlay,
    borderWidth: 0.5,
    borderColor: Colors.heroBorder,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badge: {
    position: 'absolute',
    top: ms(-2),
    right: ms(-2),
    width: ms(15),
    height: ms(15),
    borderRadius: ms(8),
    backgroundColor: '#D85A30',
    borderWidth: 1.5,
    borderColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  badgeText: {
    fontSize: ms(7),
  },
  profileBtn: {
    backgroundColor: Colors.lightGreen,
    borderWidth: 1.5,
    borderColor: 'rgba(255,255,255,0.35)',
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(14),
    marginBottom: vs(13),
  },
  scoreRing: {
    width: RING,
    height: RING,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreNum: {
    position: 'absolute',
    fontSize: ms(18),
    fontWeight: '500',
    color: Colors.white,
    fontFamily: 'System',
  },
  scoreMeta: {flex: 1},
  scoreSub: {
    marginTop: vs(2),
  },
  scoreBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    marginTop: vs(6),
  },
  scoreBarBg: {
    flex: 1,
    height: vs(4),
    backgroundColor: Colors.heroBorder,
    borderRadius: ms(2),
    overflow: 'hidden',
  },
  scoreBarFill: {
    height: '100%',
    borderRadius: ms(2),
    backgroundColor: Colors.lightGreen,
  },
  statsRow: {
    flexDirection: 'row',
    gap: s(2),
  },
  statChip: {
    flex: 1,
    backgroundColor: Colors.statBg,
    borderRadius: ms(10),
    paddingVertical: vs(7),
    paddingHorizontal: s(3),
    alignItems: 'center',
  },
  statLbl: {
    marginTop: vs(1),
  },
});

export default HeroSection;
