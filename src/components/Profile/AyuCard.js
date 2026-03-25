import React from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Emoji from '../shared/Emoji';

const AyuCard = () => (
  <TouchableOpacity style={styles.card} activeOpacity={0.7}>
    <View style={styles.inner}>
      <View style={styles.avatar}>
        <Emoji icon="🤖" size={22} />
        <View style={styles.live} />
      </View>
      <View style={{flex: 1}}>
        <AppText variant="bodyBold" style={styles.name}>Ayu · Your AI health coach</AppText>
        <View style={styles.tag}><AppText variant="caption" color={Colors.tealText} style={styles.tagText}>Condition-aware · Always on</AppText></View>
      </View>
      <AppText variant="body" color={Colors.textTertiary} style={styles.arrow}>›</AppText>
    </View>
    <AppText variant="body" color={Colors.textSecondary} style={styles.msg}>
      "Priya, your <Text style={styles.bold}>sleep averaged 5.9h this week</Text> — the biggest risk for your HbA1c on Apr 4. Want a personalised wind-down plan for tonight?"
    </AppText>
    <View style={styles.footer}>
      <TouchableOpacity style={styles.btn}><AppText variant="bodyBold" color={Colors.white} style={styles.btnText}>Chat with Ayu ›</AppText></TouchableOpacity>
      <AppText variant="small" color={Colors.textTertiary}>23 sessions · 14-day streak</AppText>
    </View>
  </TouchableOpacity>
);

const styles = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(14), marginBottom: vs(14)},
  inner: {flexDirection: 'row', alignItems: 'center', gap: s(12)},
  avatar: {width: ms(48), height: ms(48), borderRadius: ms(24), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center'},
  live: {position: 'absolute', bottom: ms(1), right: ms(1), width: ms(11), height: ms(11), backgroundColor: Colors.teal, borderRadius: ms(6), borderWidth: 2, borderColor: Colors.white},
  name: {fontSize: ms(14)},
  tag: {backgroundColor: Colors.tealBg, alignSelf: 'flex-start', borderRadius: ms(20), paddingVertical: vs(2), paddingHorizontal: s(7), marginTop: vs(3)},
  tagText: {fontWeight: '500'},
  arrow: {fontSize: ms(18)},
  msg: {fontSize: ms(12), lineHeight: ms(17), marginTop: vs(10), paddingTop: vs(10), borderTopWidth: 0.5, borderTopColor: Colors.borderLight},
  bold: {fontWeight: '500', color: Colors.textPrimary},
  footer: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginTop: vs(10)},
  btn: {backgroundColor: Colors.primary, borderRadius: ms(10), paddingVertical: vs(8), paddingHorizontal: s(16)},
  btnText: {fontSize: ms(12)},
});

export default AyuCard;
