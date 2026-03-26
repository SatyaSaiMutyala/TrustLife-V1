import React from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';

const ZONES = [
  {id: 1, label: 'Zone 1 · Very easy', sub: '<50% HR max',    color: '#16a34a'},
  {id: 2, label: 'Zone 2 · Easy',      sub: '50–60% HR max',  color: '#2563eb'},
  {id: 3, label: 'Zone 3 · Moderate',   sub: '60–70% HR max',  color: '#d97706'},
  {id: 4, label: 'Zone 4 · Hard',       sub: '70–80% HR max',  color: '#dc2626'},
  {id: 5, label: 'Zone 5 · Max',        sub: '80–95% HR max',  color: '#7c3aed'},
];

const IntensityPicker = ({selectedId, onSelect}) => {
  return (
    <ScrollView
      horizontal
      showsHorizontalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}>
      {ZONES.map((zone) => {
        const active = zone.id === selectedId;

        return (
          <TouchableOpacity
            key={zone.id}
            activeOpacity={0.7}
            style={[
              styles.pill,
              {borderColor: active ? zone.color : Colors.borderLight},
              active && {backgroundColor: zone.color},
            ]}
            onPress={() => onSelect?.(zone.id)}>
            <AppText
              numberOfLines={1}
              style={[
                styles.pillLabel,
                {color: active ? Colors.white : Colors.textPrimary},
              ]}>
              {zone.label}
            </AppText>
            <AppText
              numberOfLines={1}
              style={[
                styles.pillSub,
                {color: active ? 'rgba(255,255,255,0.8)' : Colors.textTertiary},
              ]}>
              {zone.sub}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollContent: {
    flexDirection: 'row',
    gap: s(5),
    paddingHorizontal: s(2),
    paddingVertical: vs(4),
  },
  pill: {
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    borderRadius: ms(24),
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: s(110),
  },
  pillLabel: {
    fontSize: ms(11),
    fontWeight: '700',
    marginBottom: vs(2),
  },
  pillSub: {
    fontSize: ms(9),
    fontWeight: '500',
  },
});

export default IntensityPicker;
