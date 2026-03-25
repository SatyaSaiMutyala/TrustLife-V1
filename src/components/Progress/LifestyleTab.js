import React from 'react';
import {View, Text, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import AppText from '../shared/AppText';
import Emoji from '../shared/Emoji';
import SectionTitle from '../shared/SectionTitle';

const habits = [
  {icon: '🏃', bg: Colors.tealBg, name: 'Steps', avg: 'Avg 7,820 · Target 10,000 · 4/30 days hit', score: 38, scoreColor: Colors.redText, progW: '13%', progC: Colors.red},
  {icon: '😴', bg: Colors.blueBg, name: 'Sleep', avg: 'Avg 5.9h · Target 7.5h · 3/30 nights hit', score: 32, scoreColor: Colors.redText, progW: '10%', progC: Colors.red},
  {icon: '🧊', bg: Colors.amberBg, name: 'Hydration', avg: 'Avg 1.4L · Target 2.5L · 0/30 days hit', score: 28, scoreColor: Colors.redText, progW: '0%', progC: Colors.red},
  {icon: '🍽️', bg: Colors.pinkBg, name: 'Meal consistency', avg: 'Avg 2.3/3 meals · 8/30 days full log', score: 52, scoreColor: Colors.amberText, progW: '27%', progC: Colors.amber},
];

const LifestyleTab = () => (
  <View>
    <View style={styles.headerRow}>
      <SectionTitle title="Lifestyle Habits" />
      <AppText variant="bodyBold" color={Colors.amberText} style={styles.totalScore}>62 / 100</AppText>
    </View>

    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <AppText variant="small" color={Colors.textSecondary} style={styles.colLabel}>HABIT</AppText>
        <AppText variant="small" color={Colors.textSecondary} style={styles.colLabel}>SCORE · 30-DAY AVG</AppText>
      </View>
      {habits.map((h, i) => (
        <View key={i} style={[styles.item, i < habits.length - 1 && styles.itemBorder]}>
          <View style={[styles.ico, {backgroundColor: h.bg}]}><Emoji icon={h.icon} size={14} /></View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" style={styles.name}>{h.name}</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={styles.avg}>{h.avg}</AppText>
            <View style={styles.progBg}><View style={[styles.progFill, {width: h.progW, backgroundColor: h.progC}]} /></View>
          </View>
          <View style={styles.scoreWrap}>
            <Text style={[styles.score, {color: h.scoreColor}]}>{h.score}</Text>
            <AppText variant="subtext" color={Colors.textTertiary}>/100</AppText>
          </View>
        </View>
      ))}
    </View>
  </View>
);

const styles = StyleSheet.create({
  headerRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'},
  totalScore: {marginBottom: vs(8)},
  card: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: Colors.borderLight, marginBottom: vs(10), overflow: 'hidden'},
  cardHeader: {flexDirection: 'row', justifyContent: 'space-between', paddingVertical: vs(12), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  colLabel: {fontWeight: '500', letterSpacing: 0.4},
  item: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(10), paddingHorizontal: s(13)},
  itemBorder: {borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  ico: {width: ms(30), height: ms(30), borderRadius: ms(8), alignItems: 'center', justifyContent: 'center'},
  name: {fontSize: ms(12)},
  avg: {marginTop: vs(1)},
  progBg: {height: vs(4), backgroundColor: Colors.background, borderRadius: ms(2), overflow: 'hidden', marginTop: vs(5)},
  progFill: {height: '100%', borderRadius: ms(2)},
  scoreWrap: {alignItems: 'flex-end', marginLeft: s(12)},
  score: {fontSize: Fonts.sizes.title, fontWeight: '500'},
});

export default LifestyleTab;
