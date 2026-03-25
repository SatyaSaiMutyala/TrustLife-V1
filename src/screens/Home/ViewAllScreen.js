import React from 'react';
import {View, Text, ScrollView, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import AppText from '../../components/shared/AppText';
import MiniBars from '../../components/shared/MiniBars';
import Emoji from '../../components/shared/Emoji';
import {Ionicons} from '../../components/shared/Icons';

const G = Colors.lightGreen, A = Colors.amber, R = Colors.red;

const fullCards = [
  {
    icon: '🏃', iconBg: Colors.tealBg, name: 'Steps walked yesterday', val: '8,240', target: '/ 10,000',
    pillText: '1,760 short', pillBg: Colors.amberBg, pillColor: Colors.amberText,
    bars: [{height:20,color:G,day:'S'},{height:22,color:G,day:'S'},{height:14,color:A,day:'M'},{height:13,color:A,day:'T'},{height:10,color:R,day:'W'},{height:14,color:A,day:'T'},{height:11,color:R,day:'F'}],
    avg: 'Avg 7,820 steps', avgColor: Colors.amberText,
    progLabel: 'Yesterday', progWidth: '82%', progColor: Colors.teal, progVal: '8,240 / 10k', progValColor: Colors.tealDark,
    narr: ['Below the ','10,000 daily target',' for Type 2 diabetes. Consistently low steps reduce insulin sensitivity and directly raise your ','HbA1c',' over the 90-day window.'],
    tag: 'HbA1c test at risk · 14 days left', tagBg: Colors.redBg, tagColor: Colors.redDark,
    rec: ['Aim for ','10,500 steps today','. A 20-min evening walk adds ~2,000 steps.'],
    recBg: Colors.tealBg, recColor: Colors.tealText, ctaText: 'Start a walk ›', ctaBg: Colors.paleGreen, ctaColor: '#04342C',
  },
  {
    icon: '😴', iconBg: Colors.blueBg, name: 'Sleep last night', val: '5.8 hrs', target: '/ 7.5',
    pillText: 'Too low', pillBg: Colors.redBg, pillColor: Colors.redText,
    bars: [{height:20,color:G,day:'S'},{height:10,color:R,day:'S'},{height:11,color:R,day:'M'},{height:9,color:R,day:'T'},{height:13,color:A,day:'W'},{height:10,color:R,day:'T'},{height:9,color:R,day:'F'}],
    avg: 'Avg 5.9 hrs', avgColor: Colors.redText,
    progLabel: 'Last night', progWidth: '77%', progColor: Colors.red, progVal: '5.8 / 7.5 hrs', progValColor: Colors.redText,
    narr: ['6 nights under 6.5 hrs. Poor sleep raises cortisol, spiking morning glucose — can ','add 0.3–0.5% to HbA1c',' independently.'],
    tag: 'Highest risk factor for HbA1c', tagBg: Colors.redBg, tagColor: Colors.redDark,
    rec: ['Target ','7.5 hrs tonight','. Wind-down 9:30 PM, no screens 30 mins before bed.'],
    recBg: Colors.redBg, recColor: Colors.redText, ctaText: 'Set reminder ›', ctaBg: '#F7C1C1', ctaColor: '#501313',
  },
  {
    icon: '🧊', iconBg: Colors.amberBg, name: 'Water intake yesterday', val: '1.2 L', target: '/ 2.5 L',
    pillText: 'Very low', pillBg: Colors.redBg, pillColor: Colors.redText,
    bars: [{height:16,color:A,day:'S'},{height:14,color:A,day:'S'},{height:10,color:R,day:'M'},{height:15,color:A,day:'T'},{height:12,color:R,day:'W'},{height:15,color:A,day:'T'},{height:9,color:R,day:'F'}],
    avg: 'Avg 1.4 L / day', avgColor: Colors.amberText,
    progLabel: 'Yesterday', progWidth: '48%', progColor: Colors.amber, progVal: '1.2 / 2.5 L', progValColor: Colors.amberText,
    narr: ['Dehydration concentrates blood, which can ','artificially inflate HbA1c by 0.1–0.2%',' and strains kidneys already under monitoring.'],
    tag: 'Kidney health & glucose clearance affected', tagBg: Colors.amberBg, tagColor: Colors.amberDark,
    rec: ['Drink ','2.5 L today','. Start with a glass now — water permitted on fasting test day too.'],
    recBg: Colors.amberBg, recColor: Colors.amberText, ctaText: 'Log water ›', ctaBg: '#FAC775', ctaColor: '#412402',
  },
  {
    icon: '🍽️', iconBg: Colors.pinkBg, name: 'Meals logged yesterday', val: '2 of 3', target: 'dinner missed',
    pillText: 'Incomplete', pillBg: Colors.amberBg, pillColor: Colors.amberText,
    bars: [{height:22,color:G,day:'S'},{height:22,color:G,day:'S'},{height:15,color:A,day:'M'},{height:15,color:A,day:'T'},{height:15,color:A,day:'W'},{height:15,color:A,day:'T'},{height:15,color:A,day:'F'}],
    avg: 'Avg 2.3 of 3 meals', avgColor: Colors.amberText,
    progLabel: 'Yesterday', progWidth: '67%', progColor: Colors.amber, progVal: '2 of 3', progValColor: Colors.amberText,
    narr: ['Dinner missed 5 of 7 days. Skipping evening meals causes ','overnight glucose fluctuation',' and unreliable fasting readings the next morning.'],
    tag: 'Fasting glucose readings unreliable', tagBg: Colors.amberBg, tagColor: Colors.amberDark,
    rec: ['Log all ','3 meals today','. Your care team needs this data alongside HbA1c.'],
    recBg: Colors.amberBg, recColor: Colors.amberText, ctaText: 'Log breakfast ›', ctaBg: '#FAC775', ctaColor: '#412402',
  },
  {
    icon: '💊', iconBg: Colors.purpleBg, name: 'Medication yesterday', val: '1 of 2', target: 'taken',
    pillText: 'Missed dose', pillBg: Colors.redBg, pillColor: Colors.redText,
    medChips: [{label: 'Metformin 500mg · AM ✓', ok: true},{label: 'Metformin 500mg · PM ✗', ok: false}],
    bars: [{height:22,color:G,day:'S'},{height:22,color:G,day:'S'},{height:11,color:R,day:'M'},{height:22,color:G,day:'T'},{height:11,color:R,day:'W'},{height:22,color:G,day:'T'},{height:11,color:R,day:'F'}],
    avg: 'Avg 71%', avgColor: Colors.amberText,
    progLabel: 'Yesterday', progWidth: '50%', progColor: Colors.red, progVal: '1 of 2 doses', progValColor: Colors.redText,
    narr: ['PM Metformin missed 3 times this week. Evening dose suppresses ','overnight liver glucose production',' — skipping it directly worsens your ','HbA1c outlook','.'],
    tag: 'Directly raises fasting glucose & HbA1c', tagBg: Colors.purpleBg, tagColor: Colors.purpleText,
    rec: ['Take ','both doses today','. Set an 8 PM repeating alarm for the next 14 days.'],
    recBg: Colors.purpleBg, recColor: Colors.purpleText, ctaText: 'Set medication alarm ›', ctaBg: '#CECBF6', ctaColor: Colors.purpleDark,
  },
];

const ViewAllScreen = ({navigation}) => (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
    <View style={styles.header}>
      <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}><Ionicons name="chevron-back" size={ms(22)} color={Colors.white} /></TouchableOpacity>
      <View>
        <AppText variant="screenName" color={Colors.white}>For you today</AppText>
        <AppText variant="subtitle" color={Colors.heroTextMuted}>Fri, 21 Mar · 3 risks active</AppText>
      </View>
    </View>
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContent}>
      {fullCards.map((card, i) => (
        <View key={i} style={styles.card}>
          <View style={styles.cardTop}>
            <View style={[styles.cardIcon, {backgroundColor: card.iconBg}]}><Emoji icon={card.icon} size={15} /></View>
            <View style={{flex: 1}}>
              <AppText variant="caption" color={Colors.textSecondary}>{card.name}</AppText>
              <Text style={styles.cardVal}>{card.val} <AppText variant="caption" color={Colors.textTertiary}>{card.target}</AppText></Text>
            </View>
            <View style={[styles.pill, {backgroundColor: card.pillBg}]}><AppText variant="caption" color={card.pillColor} style={{fontWeight: '500'}}>{card.pillText}</AppText></View>
          </View>
          <View style={styles.cardBody}>
            {card.medChips && (
              <View style={styles.medChipsRow}>
                {card.medChips.map((mc, j) => (
                  <View key={j} style={[styles.medChip, mc.ok ? {backgroundColor: Colors.tealBg, borderColor: Colors.lightGreen} : {backgroundColor: Colors.redBg, borderColor: '#F09595'}]}>
                    <AppText variant="caption" color={mc.ok ? Colors.tealDark : Colors.redText}>{mc.label}</AppText>
                  </View>
                ))}
              </View>
            )}
            <View style={styles.trendHeader}>
              <AppText variant="caption" color={Colors.textTertiary}>Last 7 days</AppText>
              <AppText variant="caption" color={card.avgColor} style={{fontWeight: '500'}}>{card.avg}</AppText>
            </View>
            <MiniBars data={card.bars} />
            <View style={styles.progRow}>
              <AppText variant="caption" color={Colors.textTertiary}>{card.progLabel}</AppText>
              <View style={styles.progBg}><View style={[styles.progFill, {width: card.progWidth, backgroundColor: card.progColor}]} /></View>
              <AppText variant="caption" color={card.progValColor} style={{fontWeight: '500'}}>{card.progVal}</AppText>
            </View>
            <Text style={styles.narr}>
              {card.narr.map((part, j) => j % 2 === 0 ? <Text key={j}>{part}</Text> : <Text key={j} style={styles.narrBold}>{part}</Text>)}
            </Text>
            <View style={[styles.tag, {backgroundColor: card.tagBg}]}><AppText variant="caption" color={card.tagColor}>{card.tag}</AppText></View>
            <View style={styles.divider} />
            <View style={[styles.rec, {backgroundColor: card.recBg}]}>
              <Text style={[styles.recText, {color: card.recColor}]}>
                {card.rec[0]}<Text style={styles.recBold}>{card.rec[1]}</Text>{card.rec[2]}
              </Text>
              <TouchableOpacity style={[styles.cta, {backgroundColor: card.ctaBg}]}>
                <AppText variant="caption" color={card.ctaColor} style={{fontWeight: '500'}}>{card.ctaText}</AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      ))}
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingVertical: vs(12), paddingHorizontal: s(16), flexDirection: 'row', alignItems: 'center', gap: s(12)},
  backBtn: {width: ms(38), height: ms(38), borderRadius: ms(19), backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center'},
  scroll: {flex: 1},
  scrollContent: {padding: ms(12), gap: vs(9), paddingBottom: vs(28)},
  card: {backgroundColor: Colors.white, borderRadius: ms(15), borderWidth: 0.5, borderColor: Colors.borderLight, overflow: 'hidden'},
  cardTop: {flexDirection: 'row', alignItems: 'center', gap: s(9), paddingVertical: vs(11), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
  cardIcon: {width: ms(32), height: ms(32), borderRadius: ms(9), alignItems: 'center', justifyContent: 'center'},
  cardVal: {fontSize: Fonts.sizes.title, fontWeight: '500', color: Colors.textPrimary, fontFamily: Fonts.medium},
  pill: {paddingVertical: vs(2), paddingHorizontal: s(7), borderRadius: ms(20)},
  cardBody: {padding: ms(13)},
  medChipsRow: {flexDirection: 'row', gap: s(4), flexWrap: 'wrap', marginBottom: vs(7)},
  medChip: {paddingVertical: vs(2), paddingHorizontal: s(7), borderRadius: ms(20), borderWidth: 0.5},
  trendHeader: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(5)},
  progRow: {flexDirection: 'row', alignItems: 'center', gap: s(7), marginBottom: vs(8)},
  progBg: {flex: 1, height: vs(4), backgroundColor: Colors.background, borderRadius: ms(3), overflow: 'hidden'},
  progFill: {height: '100%', borderRadius: ms(3)},
  narr: {fontSize: ms(11), color: Colors.textPrimary, lineHeight: ms(18), marginBottom: vs(7), fontFamily: Fonts.regular},
  narrBold: {fontWeight: '500', fontFamily: Fonts.medium},
  tag: {alignSelf: 'flex-start', paddingVertical: vs(2), paddingHorizontal: s(7), borderRadius: ms(20), marginBottom: vs(7)},
  divider: {height: 0.5, backgroundColor: Colors.borderLight, marginVertical: vs(7)},
  rec: {borderRadius: ms(9), paddingVertical: vs(8), paddingHorizontal: s(10)},
  recText: {fontSize: Fonts.sizes.small, lineHeight: ms(17), fontFamily: Fonts.regular},
  recBold: {fontWeight: '500', fontFamily: Fonts.medium},
  cta: {alignSelf: 'flex-start', marginTop: vs(5), paddingVertical: vs(3), paddingHorizontal: s(9), borderRadius: ms(20)},
});

export default ViewAllScreen;
