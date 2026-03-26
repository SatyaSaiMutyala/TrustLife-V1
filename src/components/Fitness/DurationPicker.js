import React, {useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';

const PRESETS = [10, 15, 20, 30, 45, 60, 90];

const DurationPicker = ({
  durationMin = 0,
  durationSec = 0,
  onChangeMin,
  onChangeSec,
  onOpenNumpad,
}) => {
  const pad = (n) => String(n).padStart(2, '0');

  const incrementMin = useCallback(() => {
    const next = Math.min((durationMin ?? 0) + 5, 999);
    onChangeMin?.(next);
  }, [durationMin, onChangeMin]);

  const decrementMin = useCallback(() => {
    const next = Math.max((durationMin ?? 0) - 5, 0);
    onChangeMin?.(next);
  }, [durationMin, onChangeMin]);

  const isPresetActive = (p) =>
    durationMin === p && durationSec === 0;

  return (
    <View style={styles.card}>
      {/* Large display */}
      <View style={styles.displayRow}>
        {/* Up / Down for minutes */}
        <View style={styles.arrowCol}>
          <TouchableOpacity
            onPress={incrementMin}
            style={styles.arrowBtn}
            activeOpacity={0.6}>
            <AppText style={styles.arrowText}>▲</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            onPress={decrementMin}
            style={styles.arrowBtn}
            activeOpacity={0.6}>
            <AppText style={styles.arrowText}>▼</AppText>
          </TouchableOpacity>
        </View>

        {/* Minutes */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            onOpenNumpad?.('durationMin', 'Duration – minutes', '0–999 min', 0, 999)
          }
          style={styles.digitBox}>
          <AppText style={styles.digitText}>{pad(durationMin)}</AppText>
          <AppText style={styles.unitLabel}>MIN</AppText>
        </TouchableOpacity>

        {/* Separator */}
        <AppText style={styles.separator}>:</AppText>

        {/* Seconds */}
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() =>
            onOpenNumpad?.('durationSec', 'Duration – seconds', '0–59', 0, 59)
          }
          style={styles.digitBox}>
          <AppText style={styles.digitText}>{pad(durationSec)}</AppText>
          <AppText style={styles.unitLabel}>SEC</AppText>
        </TouchableOpacity>

        {/* Placeholder arrows right side for balance */}
        <View style={styles.arrowCol}>
          <View style={[styles.arrowBtn, styles.arrowBtnHidden]} />
          <View style={[styles.arrowBtn, styles.arrowBtnHidden]} />
        </View>
      </View>

      {/* Preset strip */}
      <View style={styles.presetRow}>
        {PRESETS.map((p) => {
          const active = isPresetActive(p);
          return (
            <TouchableOpacity
              key={p}
              activeOpacity={0.7}
              style={[styles.presetChip, active && styles.presetChipActive]}
              onPress={() => {
                onChangeMin?.(p);
                onChangeSec?.(0);
              }}>
              <AppText
                style={[
                  styles.presetText,
                  active && styles.presetTextActive,
                ]}>
                {p}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingVertical: vs(16),
    paddingHorizontal: s(12),
  },
  displayRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(14),
  },
  arrowCol: {
    alignItems: 'center',
    justifyContent: 'center',
    gap: vs(6),
    marginHorizontal: s(6),
  },
  arrowBtn: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(8),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  arrowBtnHidden: {
    opacity: 0,
  },
  arrowText: {
    fontSize: ms(12),
    color: Colors.textSecondary,
  },
  digitBox: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(8),
  },
  digitText: {
    fontSize: ms(42),
    fontWeight: '700',
    color: Colors.primary,
    lineHeight: ms(48),
  },
  unitLabel: {
    fontSize: ms(9),
    fontWeight: '600',
    color: Colors.textTertiary,
    letterSpacing: 1,
    textTransform: 'uppercase',
    marginTop: vs(2),
  },
  separator: {
    fontSize: ms(36),
    fontWeight: '700',
    color: Colors.primary,
    marginHorizontal: s(2),
    marginBottom: vs(14),
  },
  presetRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    flexWrap: 'wrap',
    gap: s(5),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    paddingTop: vs(12),
  },
  presetChip: {
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    backgroundColor: Colors.background,
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  presetChipActive: {
    backgroundColor: '#e0f5ec',
    borderColor: Colors.accent,
  },
  presetText: {
    fontSize: ms(12),
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  presetTextActive: {
    color: Colors.primary,
  },
});

export default DurationPicker;
