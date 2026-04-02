import React from 'react';
import {View, TouchableOpacity, StyleSheet, Alert} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import {OVERVIEW_DATA} from '../../constants/ayuIntelData';

const CardHeader = ({icon, iconBg, title, subtitle, badge, badgeBg, badgeColor}) => (
  <View style={styles.cardHdr}>
    <View style={[styles.chIco, {backgroundColor: iconBg}]}>
      <AppText style={{fontSize: ms(14), lineHeight: ms(18)}}>{icon}</AppText>
    </View>
    <View style={{flex: 1}}>
      <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontWeight: '700', fontSize: ms(12)}}>{title}</AppText>
      {subtitle ? <AppText variant="small" color={Colors.textTertiary}>{subtitle}</AppText> : null}
    </View>
    {badge ? (
      <View style={[styles.chBadge, {backgroundColor: badgeBg}]}>
        <AppText variant="small" color={badgeColor} style={{fontWeight: '700', fontSize: ms(9)}}>{badge}</AppText>
      </View>
    ) : null}
  </View>
);

const FlagRow = ({text, severity, dotColor, isLast}) => {
  const getBadgeStyle = () => {
    switch (severity) {
      case 'urgent': return {bg: Colors.redBg, color: Colors.redDark};
      case 'watch': return {bg: Colors.amberBg, color: Colors.amberDark};
      case 'monitor': return {bg: Colors.amberBg, color: Colors.amberDark};
      case 'improve': return {bg: Colors.blueBg, color: Colors.blueText};
      default: return {bg: Colors.tealBg, color: Colors.tealText};
    }
  };
  const badge = getBadgeStyle();
  const label = severity.charAt(0).toUpperCase() + severity.slice(1);

  return (
    <View style={[styles.iRow, isLast && {borderBottomWidth: 0}]}>
      <View style={[styles.iDot, {backgroundColor: dotColor}]} />
      <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(18)}}>
        {text}
      </AppText>
      <View style={[styles.iBadge, {backgroundColor: badge.bg}]}>
        <AppText style={{fontSize: ms(8), fontWeight: '700', color: badge.color}}>{label}</AppText>
      </View>
    </View>
  );
};

const AIOverviewTab = () => {
  const data = OVERVIEW_DATA;

  return (
    <View>
      {/* Narrative Card */}
      <View style={styles.card}>
        <CardHeader
          icon={'\ud83e\udde0'}
          iconBg={Colors.purpleBg}
          title={data.narrativeTitle}
          subtitle={data.narrativeSubtitle}
        />
        <View style={styles.cardBody}>
          <AppText variant="body" color={Colors.textPrimary} style={{lineHeight: ms(22), fontSize: ms(12)}}>
            {data.narrative}
          </AppText>
          <View style={styles.corrBox}>
            <AppText variant="caption" color={Colors.primary} style={{fontWeight: '700'}}>
              {data.correlation.title}
            </AppText>
            <AppText variant="caption" color="#1b5e20" style={{marginTop: vs(4), lineHeight: ms(18)}}>
              {data.correlation.body}
            </AppText>
          </View>
        </View>
      </View>

      {/* Priority Flags Card */}
      <View style={[styles.card, {marginTop: vs(10)}]}>
        <CardHeader
          icon={'\u26a0\ufe0f'}
          iconBg={Colors.redBg}
          title="Priority flags"
          badge="7 flags"
          badgeBg={Colors.redBg}
          badgeColor={Colors.redDark}
        />
        <View style={[styles.cardBody, {paddingTop: vs(4)}]}>
          {data.flags.map((flag, idx) => (
            <FlagRow
              key={idx}
              text={flag.text}
              severity={flag.severity}
              dotColor={flag.dotColor}
              isLast={idx === data.flags.length - 1}
            />
          ))}
        </View>
      </View>

      {/* What's Improving Card */}
      <View style={[styles.card, {marginTop: vs(10)}]}>
        <CardHeader
          icon={'\ud83d\udcc8'}
          iconBg={Colors.tealBg}
          title="What's improving"
          badge="4 params"
          badgeBg={Colors.tealBg}
          badgeColor={Colors.tealText}
        />
        <View style={[styles.cardBody, {paddingTop: vs(4)}]}>
          {data.improving.map((item, idx) => (
            <View key={idx} style={[styles.iRow, idx === data.improving.length - 1 && {borderBottomWidth: 0}]}>
              <View style={[styles.iDot, {backgroundColor: Colors.accent}]} />
              <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(18)}}>
                {item.text}
              </AppText>
              <View style={[styles.iBadge, {backgroundColor: Colors.tealBg}]}>
                <AppText style={{fontSize: ms(8), fontWeight: '700', color: Colors.tealText}}>{'\u2191'}</AppText>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Top 3 Actions Card */}
      <View style={[styles.card, {marginTop: vs(10)}]}>
        <CardHeader
          icon={'\ud83d\udca1'}
          iconBg={Colors.tealBg}
          title="Ayu's top 3 actions this week"
        />
        <View style={[styles.cardBody, {paddingTop: vs(4)}]}>
          {data.actions.map((action, idx) => (
            <View key={idx} style={[styles.iRow, idx === data.actions.length - 1 && {borderBottomWidth: 0}]}>
              <View style={styles.actionRank}>
                <AppText style={{fontSize: ms(11), fontWeight: '800', color: Colors.white}}>{action.rank}</AppText>
              </View>
              <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(18)}}>
                <AppText variant="caption" style={{fontWeight: '700', color: Colors.textPrimary}}>{action.title}</AppText>
                {' '}{action.detail}
              </AppText>
            </View>
          ))}
        </View>
        <View style={styles.actStrip}>
          <TouchableOpacity
            style={[styles.actBtn, {backgroundColor: Colors.primary}]}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Setting reminders...')}>
            <AppText variant="small" color={Colors.white} style={{fontWeight: '700'}}>{'\u23f0'} Set reminders</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.actBtn, {backgroundColor: Colors.tealBg}]}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Sharing with Dr. Meera...')}>
            <AppText variant="small" color={Colors.tealText} style={{fontWeight: '700'}}>{'\ud83d\udc69\u200d\u2695\ufe0f'} Share</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    overflow: 'hidden',
    borderWidth: 0.5,
    borderColor: '#dde8e2',
    borderRadius: ms(14)
  },
  cardHdr: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(9),
    paddingVertical: vs(11),
    paddingHorizontal: s(13),
    borderBottomWidth: 0.5,
    borderBottomColor: '#edf2ef',
  },
  chIco: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
  chBadge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  cardBody: {
    paddingHorizontal: s(13),
    paddingVertical: vs(10),
  },
  corrBox: {
    backgroundColor: '#e8f5e9',
    borderRadius: ms(11),
    padding: ms(12),
    marginTop: vs(10),
    borderWidth: 0.5,
    borderColor: '#a5d6a7',
  },
  iRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(9),
    paddingVertical: vs(7),
    borderBottomWidth: 0.5,
    borderBottomColor: '#f4f4f4',
  },
  iDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    marginTop: vs(4),
  },
  iBadge: {
    paddingHorizontal: s(7),
    paddingVertical: vs(2),
    borderRadius: ms(8),
    marginTop: vs(2),
  },
  actionRank: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(7),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  actStrip: {
    flexDirection: 'row',
    gap: s(7),
    paddingHorizontal: s(13),
    paddingVertical: vs(10),
    borderTopWidth: 0.5,
    borderTopColor: '#f0f4f2',
  },
  actBtn: {
    flex: 1,
    paddingVertical: vs(9),
    borderRadius: ms(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AIOverviewTab;
