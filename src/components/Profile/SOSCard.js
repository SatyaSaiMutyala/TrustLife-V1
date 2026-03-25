import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Emoji from '../shared/Emoji';
import SectionTitle from '../shared/SectionTitle';

const SOSCard = () => (
  <View>
    <SectionTitle title="Emergency" />
    <TouchableOpacity style={styles.card} activeOpacity={0.7}>
      <View style={styles.ico}><Emoji icon="🚨" size={18} /></View>
      <View style={{flex: 1}}>
        <AppText variant="bodyBold" color={Colors.redDark} style={styles.title}>Emergency SOS</AppText>
        <AppText variant="small" color={Colors.redText} style={styles.sub}>Alerts care team · Shares live location</AppText>
      </View>
      <AppText variant="body" color={Colors.redText} style={styles.arrow}>›</AppText>
    </TouchableOpacity>
  </View>
);

const styles = StyleSheet.create({
  card: {backgroundColor: Colors.redBg, borderRadius: ms(16), borderWidth: 1.5, borderColor: '#F09595', paddingVertical: vs(13), paddingHorizontal: s(14), flexDirection: 'row', alignItems: 'center', gap: s(12), marginBottom: vs(10)},
  ico: {width: ms(42), height: ms(42), borderRadius: ms(21), backgroundColor: Colors.red, alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: ms(14)},
  sub: {marginTop: vs(2)},
  arrow: {fontSize: ms(18)},
});

export default SOSCard;
