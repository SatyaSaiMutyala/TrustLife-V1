import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  StatusBar,
  useWindowDimensions,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';

import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import {CATEGORIES} from '../../../constants/fitnessData';

const CAT_KEYS = ['A', 'C', 'E', 'F', 'G', 'H'];

const CAT_NAME_OVERRIDES = {
  A: 'Movement / Cardio',
};

const CAT_COLORS = {
  A: '#16a34a',
  B: '#0284c7',
  C: '#7c3aed',
  D: '#f59e0b',
  E: '#ec4899',
  F: '#ef4444',
  G: '#0891b2',
  H: '#78716c',
};

const CAT_EMOJIS = {
  A: '🚶',
  B: '🏃',
  C: '🏋️',
  D: '🤸',
  E: '🧘',
  F: '⚡',
  G: '⚽',
  H: '🏠',
};

const FitnessTrackerScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const cardW = (width - s(16) * 2 - s(10)) / 2;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── HEADER ─────────────────────────────────────── */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <View style={styles.topBar}>
          <TouchableOpacity
            style={styles.backBtn}
            onPress={() => navigation.goBack()}>
            <AppText variant="body" style={styles.backText}>
              ‹ Tracking
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity style={styles.historyBtn}>
            <AppText variant="small" style={styles.historyText}>
              History
            </AppText>
          </TouchableOpacity>
        </View>

        <AppText variant="screenName" style={styles.headerTitle}>
          Fitness tracker
        </AppText>
        <AppText variant="caption" style={styles.headerSubtitle}>
          Choose an activity category to start logging
        </AppText>
      </View>

      {/* ── CATEGORY CARDS ─────────────────────────────── */}
      <ScrollView
        style={styles.body}
        contentContainerStyle={styles.bodyContent}
        showsVerticalScrollIndicator={false}>
        <View style={styles.grid}>
          {CAT_KEYS.map((id) => {
            const cat = CATEGORIES?.[id];
            const color = CAT_COLORS[id];
            const subcatCount = cat?.subcats?.length || 0;

            return (
              <TouchableOpacity
                key={id}
                style={[styles.card, {width: cardW}]}
                activeOpacity={0.7}
                onPress={() =>
                  id === 'C'
                    ? navigation.navigate('StrengthTraining')
                    : id === 'A'
                    ? navigation.navigate('MovementTracker')
                    : id === 'H'
                    ? navigation.navigate('LifestyleActivity')
                    : navigation.navigate('FitnessCategory', {catId: id})
                }>
                {/* Emoji */}
                <View style={[styles.emojiWrap, {backgroundColor: `${color}15`}]}>
                  <AppText style={styles.cardEmoji}>{CAT_EMOJIS[id]}</AppText>
                </View>

                {/* Name */}
                <AppText
                  variant="bodyBold"
                  style={styles.cardName}
                  numberOfLines={1}>
                  {CAT_NAME_OVERRIDES[id] || cat?.name?.split('/')[0]?.split('·')[0]?.trim() || id}
                </AppText>

                {/* Description */}
                <AppText
                  variant="small"
                  color={Colors.textTertiary}
                  style={styles.cardDesc}
                  numberOfLines={2}>
                  {cat?.desc || ''}
                </AppText>

                {/* Subcat count */}
                <AppText style={[styles.countText, {color}]}>
                  {subcatCount} activities ›
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        <View style={{height: vs(30)}} />
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: vs(16),
    paddingHorizontal: s(16),
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  backBtn: {
    paddingVertical: vs(4),
    paddingRight: s(12),
  },
  backText: {
    color: Colors.white,
    fontSize: ms(15),
  },
  historyBtn: {
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
  },
  historyText: {
    color: 'rgba(255,255,255,0.7)',
    fontSize: ms(12),
    fontWeight: '600',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: ms(24),
    fontWeight: '700',
    marginBottom: vs(4),
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: ms(12),
  },
  body: {
    flex: 1,
  },
  bodyContent: {
    paddingHorizontal: s(16),
    paddingTop: vs(16),
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(10),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(13),
  },
  emojiWrap: {
    width: ms(42),
    height: ms(42),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(8),
  },
  cardEmoji: {
    fontSize: ms(22),
    lineHeight: ms(28),
  },
  cardName: {
    fontSize: ms(13),
    marginBottom: vs(3),
  },
  cardDesc: {
    fontSize: ms(10),
    lineHeight: ms(14),
    marginBottom: vs(8),
    color: Colors.textTertiary,
  },
  countText: {
    fontSize: ms(10),
    fontWeight: '600',
  },
});

export default FitnessTrackerScreen;
