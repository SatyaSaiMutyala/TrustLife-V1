import React from 'react';
import {View, StyleSheet, ScrollView, Image} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import MiniBars from '../shared/MiniBars';
import SectionTitle from '../shared/SectionTitle';
import AppText from '../shared/AppText';

const G = Colors.lightGreen;
const A = Colors.amber;
const R = Colors.red;

const cards = [
  {
    image: require('../../assets/img/exercise-track.png'), iconBg: Colors.tealBg, name: 'Steps yesterday', val: '8,240', target: '/ 10k',
    pillText: 'Short', pillStyle: 'warn',
    bars: [{height:20,color:G,day:'S'},{height:22,color:G,day:'S'},{height:15,color:A,day:'M'},{height:14,color:A,day:'T'},{height:11,color:R,day:'W'},{height:15,color:A,day:'T'},{height:12,color:R,day:'F'}],
    avg: '7,820 steps', avgColor: Colors.amberText, tag: 'HbA1c at risk', tagStyle: 'red',
    rec: ['Aim for ', '10,500 today', '. Evening walk adds ~2,000.'],
  },
  {
    image: require('../../assets/img/sleep-track.png'), iconBg: Colors.blueBg, name: 'Sleep last night', val: '5.8 hrs', target: '/ 7.5',
    pillText: 'Low', pillStyle: 'danger',
    bars: [{height:20,color:G,day:'S'},{height:10,color:R,day:'S'},{height:11,color:R,day:'M'},{height:9,color:R,day:'T'},{height:13,color:A,day:'W'},{height:10,color:R,day:'T'},{height:10,color:R,day:'F'}],
    avg: '5.9 hrs', avgColor: Colors.redText, tag: 'Highest HbA1c risk', tagStyle: 'red',
    rec: ['Target ', '7.5 hrs tonight.', ' Wind-down 9:30 PM.'],
  },
  {
    image: require('../../assets/img/food-track.png'), iconBg: Colors.amberBg, name: 'Water yesterday', val: '1.2 L', target: '/ 2.5 L',
    pillText: 'Very low', pillStyle: 'danger',
    bars: [{height:16,color:A,day:'S'},{height:14,color:A,day:'S'},{height:10,color:R,day:'M'},{height:15,color:A,day:'T'},{height:12,color:R,day:'W'},{height:15,color:A,day:'T'},{height:9,color:R,day:'F'}],
    avg: '1.4 L', avgColor: Colors.amberText, tag: 'Glucose clearance affected', tagStyle: 'amber',
    rec: ['Drink ', '2.5 L today.', ' Start now.'],
  },
  {
    image: require('../../assets/img/food-track.png'), iconBg: Colors.pinkBg, name: 'Meals yesterday', val: '2 of 3', target: 'missed dinner',
    pillText: 'Incomplete', pillStyle: 'warn',
    bars: [{height:22,color:G,day:'S'},{height:22,color:G,day:'S'},{height:15,color:A,day:'M'},{height:15,color:A,day:'T'},{height:15,color:A,day:'W'},{height:15,color:A,day:'T'},{height:15,color:A,day:'F'}],
    avg: '2.3 of 3', avgColor: Colors.amberText, tag: 'Fasting glucose unreliable', tagStyle: 'amber',
    rec: ['Log all ', '3 meals today', ' including dinner.'],
  },
  {
    image: require('../../assets/img/medical-track.png'), iconBg: Colors.purpleBg, name: 'Medication yesterday', val: '1 of 2', target: 'doses',
    pillText: 'Missed', pillStyle: 'danger',
    medChips: [{label: 'AM ✓', ok: true}, {label: 'PM ✗', ok: false}],
    bars: [{height:22,color:G,day:'S'},{height:22,color:G,day:'S'},{height:11,color:R,day:'M'},{height:22,color:G,day:'T'},{height:11,color:R,day:'W'},{height:22,color:G,day:'T'},{height:11,color:R,day:'F'}],
    avg: '71% adherence', avgColor: Colors.amberText, tag: 'Raises fasting glucose', tagStyle: 'purple',
    rec: ['Take ', 'both doses today.', ' Set 8 PM alarm.'],
  },
];

const pillMap = {warn: {bg: Colors.amberBg, color: Colors.amberText}, danger: {bg: Colors.redBg, color: Colors.redText}};
const tagMap = {red: {bg: Colors.redBg, color: Colors.redDark}, amber: {bg: Colors.amberBg, color: Colors.amberDark}, purple: {bg: Colors.purpleBg, color: Colors.purpleText}};

const ForYouCarousel = ({navigation}) => (
  <View>
    <View style={{paddingHorizontal: s(12)}}>
      <SectionTitle title="For You Today" linkText="View all ›" onLinkPress={() => navigation.navigate('ViewAll')} />
    </View>
    <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {cards.map((card, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.cardTop}>
            <Image source={card.image} style={styles.cardImg} resizeMode="contain" />
            <View style={{flex: 1}}>
              <AppText variant="caption" color={Colors.textSecondary}>{card.name}</AppText>
              <AppText variant="bodyBold" color={Colors.textPrimary}>
                {card.val} <AppText variant="small" color={Colors.textTertiary}>{card.target}</AppText>
              </AppText>
            </View>
            <View style={[styles.pill, {backgroundColor: pillMap[card.pillStyle].bg}]}>
              <AppText variant="small" color={pillMap[card.pillStyle].color} style={styles.pillText}>{card.pillText}</AppText>
            </View>
          </View>
          <View style={styles.cardBody}>
            {card.medChips && (
              <View style={styles.medChips}>
                {card.medChips.map((mc, j) => (
                  <View key={j} style={[styles.medChip, mc.ok ? {backgroundColor: Colors.tealBg, borderColor: Colors.lightGreen} : {backgroundColor: Colors.redBg, borderColor: '#F09595'}]}>
                    <AppText variant="small" color={mc.ok ? Colors.tealDark : Colors.redText}>{mc.label}</AppText>
                  </View>
                ))}
              </View>
            )}
            {/* Bars left + Stats right */}
            <View style={styles.chartRow}>
              <View style={styles.chartLeft}>
                <MiniBars data={card.bars} />
              </View>
              <View style={styles.chartRight}>
                <AppText variant="small" color={Colors.textTertiary}>7-day avg</AppText>
                <AppText variant="bodyBold" color={card.avgColor} style={styles.avgVal}>{card.avg}</AppText>
                <View style={[styles.tag, {backgroundColor: tagMap[card.tagStyle].bg}]}>
                  <AppText variant="small" color={tagMap[card.tagStyle].color} style={{fontWeight: '600'}}>{card.tag}</AppText>
                </View>
              </View>
            </View>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.rec}>
              {card.rec[0]}<AppText variant="caption" color={Colors.textPrimary} style={styles.recBold}>{card.rec[1]}</AppText>{card.rec[2]}
            </AppText>
          </View>
        </View>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  scrollContent: {paddingHorizontal: s(12), paddingBottom: vs(3), gap: s(8)},
  card: {width: s(195), backgroundColor: Colors.white, borderRadius: ms(15), borderWidth: 0.5, borderColor: Colors.borderLight, overflow: 'hidden'},
  cardTop: {flexDirection: 'row', alignItems: 'center', gap: s(8), paddingVertical: vs(10), paddingHorizontal: s(11), borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  cardImg: {width: ms(30), height: ms(30), borderRadius: ms(10)},
  pill: {paddingVertical: vs(2), paddingHorizontal: s(6), borderRadius: ms(20)},
  pillText: {fontWeight: '500'},
  cardBody: {padding: ms(11)},
  medChips: {flexDirection: 'row', gap: s(4), marginBottom: vs(6)},
  medChip: {paddingVertical: vs(2), paddingHorizontal: s(6), borderRadius: ms(20), borderWidth: 0.5},
  chartRow: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)},
  chartLeft: {flex: 2, marginRight: s(8)},
  chartRight: {flex: 3, alignItems: 'flex-end'},
  avgVal: {fontWeight: '700', fontSize: ms(12), marginTop: vs(1), marginBottom: vs(4)},
  tag: {paddingVertical: vs(2), paddingHorizontal: s(6), borderRadius: ms(20)},
  rec: {borderTopWidth: 0.5, borderTopColor: Colors.borderLight, paddingTop: vs(6)},
  recBold: {fontWeight: '500'},
});

export default ForYouCarousel;
