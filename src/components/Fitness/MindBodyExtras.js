import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';

/* ── Data ── */
const CHAKRAS = [
  {id: 'root',        emoji: '🔴', name: 'Root'},
  {id: 'sacral',      emoji: '🟠', name: 'Sacral'},
  {id: 'solar',       emoji: '🟡', name: 'Solar Plexus'},
  {id: 'heart',       emoji: '💚', name: 'Heart'},
  {id: 'throat',      emoji: '🔵', name: 'Throat'},
  {id: 'third_eye',   emoji: '🟣', name: 'Third Eye'},
  {id: 'crown',       emoji: '🤍', name: 'Crown'},
  {id: 'full_body',   emoji: '🧡', name: 'Full body'},
];

const BREATHING = [
  'Nadi Shodhana (alternate nostril)',
  'Kapalbhati',
  'Bhramari (bee breath)',
  'Ujjayi (ocean breath)',
  'Wim Hof',
  'Box breathing (4-4-4-4)',
  '4-7-8 breathing',
  'Bhastrika',
];

const MEDITATION = [
  'Mindfulness',
  'Body scan',
  'Loving-kindness (Metta)',
  'Vipassana',
  'Transcendental',
  'Guided (app)',
  'Mantra / Japa',
  'Open monitoring',
  'Yoga Nidra (NSDR)',
];

const BEFORE_TAGS = [
  {id: 'stressed', emoji: '😰', label: 'Stressed'},
  {id: 'anxious',  emoji: '😤', label: 'Anxious'},
  {id: 'tired',    emoji: '😴', label: 'Tired'},
  {id: 'neutral',  emoji: '😐', label: 'Neutral'},
  {id: 'calm',     emoji: '😌', label: 'Calm'},
  {id: 'good',     emoji: '😊', label: 'Good'},
];

const AFTER_TAGS = [
  {id: 'relaxed',   emoji: '😌', label: 'Relaxed'},
  {id: 'refreshed', emoji: '😊', label: 'Refreshed'},
  {id: 'energised', emoji: '💪', label: 'Energised'},
  {id: 'clear',     emoji: '🧠', label: 'Clear'},
  {id: 'sleepy',    emoji: '😴', label: 'Sleepy'},
  {id: 'same',      emoji: '😐', label: 'Same'},
];

/* ── Helpers ── */
const toggleItem = (arr, item) =>
  arr.includes(item) ? arr.filter((i) => i !== item) : [...arr, item];

/* ── Sub-components ── */
const TagChip = ({label, active, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    style={[styles.tag, active && styles.tagActive]}
    onPress={onPress}>
    <AppText style={[styles.tagText, active && styles.tagTextActive]}>
      {label}
    </AppText>
  </TouchableOpacity>
);

/* ── Main Component ── */
const MindBodyExtras = ({subcatId}) => {
  const [selectedChakras, setSelectedChakras] = useState([]);
  const [selectedBreathing, setSelectedBreathing] = useState([]);
  const [selectedMeditation, setSelectedMeditation] = useState([]);
  const [beforeState, setBeforeState] = useState([]);
  const [afterState, setAfterState] = useState([]);

  const showChakras =
    subcatId !== 'pranayama' &&
    subcatId !== 'meditation' &&
    subcatId !== 'savasana';
  const showBreathing = subcatId === 'pranayama';
  const showMeditation =
    subcatId === 'meditation' || subcatId === 'savasana';

  return (
    <View style={styles.wrapper}>
      {/* ── Section 1: Chakra / Focus Areas ── */}
      {showChakras && (
        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Chakra / body region focus</AppText>
          <View style={styles.chakraGrid}>
            {CHAKRAS.map((c) => {
              const active = selectedChakras.includes(c.id);
              return (
                <TouchableOpacity
                  key={c.id}
                  activeOpacity={0.7}
                  style={[styles.chakraBox, active && styles.chakraBoxActive]}
                  onPress={() =>
                    setSelectedChakras((prev) => toggleItem(prev, c.id))
                  }>
                  <AppText style={styles.chakraEmoji}>{c.emoji}</AppText>
                  <AppText
                    numberOfLines={1}
                    style={[
                      styles.chakraName,
                      active && styles.chakraNameActive,
                    ]}>
                    {c.name}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>
      )}

      {/* ── Section 2: Breathing Techniques ── */}
      {showBreathing && (
        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Breathing technique</AppText>
          <View style={styles.chipWrap}>
            {BREATHING.map((b) => (
              <TagChip
                key={b}
                label={b}
                active={selectedBreathing.includes(b)}
                onPress={() =>
                  setSelectedBreathing((prev) => toggleItem(prev, b))
                }
              />
            ))}
          </View>
        </View>
      )}

      {/* ── Section 3: Meditation Types ── */}
      {showMeditation && (
        <View style={styles.card}>
          <AppText style={styles.cardTitle}>Meditation type</AppText>
          <View style={styles.chipWrap}>
            {MEDITATION.map((m) => (
              <TagChip
                key={m}
                label={m}
                active={selectedMeditation.includes(m)}
                onPress={() =>
                  setSelectedMeditation((prev) => toggleItem(prev, m))
                }
              />
            ))}
          </View>
        </View>
      )}

      {/* ── Section 4: State Before & After ── */}
      <View style={styles.card}>
        <AppText style={styles.cardTitle}>How do you feel?</AppText>
        <View style={styles.baRow}>
          {/* Before */}
          <View style={styles.baCol}>
            <AppText style={styles.baLabel}>BEFORE</AppText>
            <View style={styles.baChips}>
              {BEFORE_TAGS.map((t) => {
                const active = beforeState.includes(t.id);
                return (
                  <TagChip
                    key={t.id}
                    label={`${t.emoji} ${t.label}`}
                    active={active}
                    onPress={() =>
                      setBeforeState((prev) => toggleItem(prev, t.id))
                    }
                  />
                );
              })}
            </View>
          </View>

          {/* Divider */}
          <View style={styles.baDivider} />

          {/* After */}
          <View style={styles.baCol}>
            <AppText style={styles.baLabel}>AFTER</AppText>
            <View style={styles.baChips}>
              {AFTER_TAGS.map((t) => {
                const active = afterState.includes(t.id);
                return (
                  <TagChip
                    key={t.id}
                    label={`${t.emoji} ${t.label}`}
                    active={active}
                    onPress={() =>
                      setAfterState((prev) => toggleItem(prev, t.id))
                    }
                  />
                );
              })}
            </View>
          </View>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    gap: vs(12),
  },

  /* ── Card ── */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingVertical: vs(14),
    paddingHorizontal: s(12),
  },
  cardTitle: {
    fontSize: ms(13),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: vs(10),
  },

  /* ── Chakra grid ── */
  chakraGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  chakraBox: {
    width: '22%',
    flexGrow: 1,
    flexBasis: '22%',
    maxWidth: '24%',
    alignItems: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: s(4),
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
  chakraBoxActive: {
    borderColor: '#be185d',
    backgroundColor: '#fdf2f8',
  },
  chakraEmoji: {
    fontSize: ms(14),
    lineHeight: ms(18),
    textAlign: 'center',
    marginBottom: vs(3),
  },
  chakraName: {
    fontSize: ms(8),
    fontWeight: '700',
    color: Colors.textSecondary,
    textAlign: 'center',
  },
  chakraNameActive: {
    color: '#be185d',
  },

  /* ── Tag chips (shared) ── */
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
  },
  tag: {
    paddingVertical: vs(6),
    paddingHorizontal: s(11),
    borderRadius: ms(22),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    backgroundColor: Colors.background,
  },
  tagActive: {
    backgroundColor: '#e0f5ec',
    borderColor: Colors.accent,
  },
  tagText: {
    fontSize: ms(10),
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  tagTextActive: {
    color: Colors.primary,
  },

  /* ── Before / After ── */
  baRow: {
    flexDirection: 'row',
  },
  baCol: {
    flex: 1,
  },
  baDivider: {
    width: 0.5,
    backgroundColor: Colors.borderLight,
    marginHorizontal: s(8),
  },
  baLabel: {
    fontSize: ms(10),
    fontWeight: '700',
    color: Colors.textTertiary,
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: vs(8),
  },
  baChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
  },
});

export default MindBodyExtras;
