import React from 'react';
import {View, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import {SYMPTOMS_SECTIONS} from '../../constants/ayuIntelData';

// Convert object to array
const SYMPTOMS_LIST = Object.values(SYMPTOMS_SECTIONS);

const SymptomsTab = () => {
  return (
    <View>
      {SYMPTOMS_LIST.map((group, gIdx) => (
        <View key={gIdx} style={styles.card}>
          {/* Category Header */}
          <View style={styles.catHeader}>
            <AppText style={{fontSize: ms(18), lineHeight: ms(22)}}>{group.ico || '\ud83d\udcca'}</AppText>
            <AppText variant="header" style={{flex: 1}}>{group.title}</AppText>
            <AppText variant="small" color={Colors.textTertiary}>{(group.metrics || []).length} metrics</AppText>
          </View>

          {/* Metrics */}
          {(group.metrics || []).map((item, idx) => (
            <View key={idx} style={[styles.itemRow, idx < group.metrics.length - 1 && styles.itemBorder]}>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold" color={Colors.textPrimary}>{item.label}</AppText>
                <AppText variant="small" color={Colors.textTertiary}>{item.ref}</AppText>
              </View>
              <View style={styles.valCol}>
                <AppText variant="bodyBold" color={item.color || Colors.textPrimary}>{item.value}</AppText>
                <View style={[styles.trendBadge, {backgroundColor: (item.pillStyle || {}).bg || Colors.tealBg}]}>
                  <AppText variant="small" color={(item.pillStyle || {}).color || Colors.tealText} style={{fontWeight: '700'}}>
                    {item.pillLabel}
                  </AppText>
                </View>
              </View>
            </View>
          ))}
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  card: {backgroundColor: Colors.white, borderRadius: ms(14), padding: ms(14), marginBottom: vs(10), shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.06, shadowRadius: 4, elevation: 2},
  catHeader: {flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(8)},
  itemRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(8)},
  itemBorder: {borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.borderLight},
  valCol: {alignItems: 'flex-end', gap: vs(3)},
  trendBadge: {paddingHorizontal: s(8), paddingVertical: vs(1), borderRadius: ms(6)},
});

export default SymptomsTab;
