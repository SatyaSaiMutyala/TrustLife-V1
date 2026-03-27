import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Emoji from '../shared/Emoji';
import SectionTitle from '../shared/SectionTitle';

const pills = ['256-bit encryption', 'HIPAA compliant', 'ISO 27001', 'Zero data selling'];

const TrustReportCard = () => {
  const navigation = useNavigation();
  return (
  <View>
    <SectionTitle title="Trust" />
    <TouchableOpacity style={styles.card} activeOpacity={0.7} onPress={() => navigation.navigate('TrustReport')}>
      <View style={styles.top}>
        <View style={styles.icon}><Emoji icon="🛡️" size={20} /></View>
        <View style={{flex: 1}}>
          <AppText variant="bodyBold" style={styles.title}>TrustLife Trust Report</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={styles.sub}>Last audited: March 2026 · By TrustArc</AppText>
        </View>
        <AppText variant="body" color={Colors.textTertiary} style={styles.arrow}>›</AppText>
      </View>
      <View style={styles.pillsRow}>
        {pills.map((p, i) => (
          <View key={i} style={styles.pill}><AppText variant="caption" color={Colors.tealText} style={styles.pillText}>{p}</AppText></View>
        ))}
      </View>
    </TouchableOpacity>
  </View>
  );
};

const styles = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(16), borderWidth: 0.5, borderColor: Colors.borderLight, padding: ms(14), marginBottom: vs(10)},
  top: {flexDirection: 'row', alignItems: 'center', gap: s(12), marginBottom: vs(12)},
  icon: {width: ms(44), height: ms(44), borderRadius: ms(13), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center'},
  title: {fontSize: ms(14)},
  sub: {marginTop: vs(2)},
  arrow: {fontSize: ms(18)},
  pillsRow: {flexDirection: 'row', gap: s(6), flexWrap: 'wrap'},
  pill: {backgroundColor: Colors.tealBg, borderRadius: ms(20), paddingVertical: vs(3), paddingHorizontal: s(8)},
  pillText: {fontWeight: '500'},
});

export default TrustReportCard;
