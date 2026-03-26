import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';

const TAG_COLORS = {
  High:     {bg: Colors.redBg,   text: Colors.redDark},
  Max:      {bg: Colors.redBg,   text: Colors.redDark},
  Mod:      {bg: Colors.amberBg, text: Colors.amberDark},
  Low:      {bg: Colors.tealBg,  text: Colors.tealText},
  Recovery: {bg: Colors.pinkBg,  text: '#9b2c5e'},
};

const getTagColor = (tag) => {
  const key = Object.keys(TAG_COLORS).find(
    (k) => tag.toLowerCase().includes(k.toLowerCase()),
  );
  return key ? TAG_COLORS[key] : {bg: Colors.tealBg, text: Colors.tealText};
};

const SubcatGrid = ({subcats = [], selectedId, onSelect, durationMin = 0}) => {
  return (
    <View style={styles.grid}>
      {subcats.map((item, idx) => {
        const active = item.id === selectedId;
        const estKcal = item.kcal_per_min
          ? Math.round(item.kcal_per_min * durationMin)
          : 0;

        return (
          <TouchableOpacity
            key={item.id ?? idx}
            activeOpacity={0.7}
            style={[styles.card, active && styles.cardActive]}
            onPress={() => onSelect?.(item)}>
            {/* Checkmark – active */}
            {active && (
              <View style={styles.checkBadge}>
                <AppText
                  variant="small"
                  color={Colors.white}
                  style={styles.checkIcon}>
                  ✓
                </AppText>
              </View>
            )}

            {/* Emoji icon */}
            <View style={styles.emojiWrap}>
              <AppText style={styles.emoji}>{item.ico ?? '🏋️'}</AppText>
            </View>

            {/* Name */}
            <AppText
              variant="bodyBold"
              numberOfLines={1}
              style={styles.name}
              color={active ? Colors.primary : Colors.textPrimary}>
              {item.name}
            </AppText>

            {/* Description */}
            {!!item.sub && (
              <AppText
                variant="small"
                numberOfLines={2}
                color={Colors.textTertiary}
                style={styles.description}>
                {item.sub}
              </AppText>
            )}

            {/* Tags */}
            {item.tags && item.tags.length > 0 && (
              <View style={styles.tagsRow}>
                {item.tags.map((tag, tIdx) => {
                  const tc = getTagColor(tag);
                  return (
                    <View
                      key={tIdx}
                      style={[styles.tagPill, {backgroundColor: tc.bg}]}>
                      <AppText style={[styles.tagText, {color: tc.text}]}>
                        {tag}
                      </AppText>
                    </View>
                  );
                })}
              </View>
            )}

            {/* Kcal badge */}
            {estKcal > 0 && (
              <View style={styles.kcalBadge}>
                <AppText style={styles.kcalText}>~{estKcal} kcal</AppText>
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: vs(7),
  },
  card: {
    width: '48.5%',
    backgroundColor: Colors.white,
    borderRadius: ms(13),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(11),
    paddingBottom: ms(28),
    position: 'relative',
  },
  cardActive: {
    borderWidth: 1.5,
    borderColor: Colors.accent,
    backgroundColor: '#f0faf5',
  },
  checkBadge: {
    position: 'absolute',
    top: ms(6),
    right: ms(6),
    width: ms(18),
    height: ms(18),
    borderRadius: ms(9),
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkIcon: {
    fontSize: ms(10),
    lineHeight: ms(14),
  },
  emojiWrap: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(6),
  },
  emoji: {
    fontSize: ms(18),
    lineHeight: ms(22),
    textAlign: 'center',
  },
  name: {
    fontSize: ms(12),
    marginBottom: vs(2),
  },
  description: {
    fontSize: ms(9),
    lineHeight: ms(12),
    marginBottom: vs(4),
  },
  tagsRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(3),
    marginBottom: vs(6),
  },
  tagPill: {
    paddingHorizontal: s(5),
    paddingVertical: vs(1.5),
    borderRadius: ms(6),
  },
  tagText: {
    fontSize: ms(8),
    fontWeight: '600',
  },
  kcalBadge: {
    position: 'absolute',
    bottom: ms(8),
    right: ms(8),
    backgroundColor: Colors.tealBg,
    paddingHorizontal: s(5),
    paddingVertical: vs(2),
    borderRadius: ms(6),
  },
  kcalText: {
    fontSize: ms(8),
    fontWeight: '700',
    color: Colors.tealText,
  },
});

export default SubcatGrid;
