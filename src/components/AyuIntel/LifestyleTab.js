import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../shared/AppText';
import {LIFESTYLE_SECTIONS} from '../../constants/ayuIntelData';

const LifestyleTab = () => {
  const navigation = useNavigation();

  return (
    <View>
      {LIFESTYLE_SECTIONS.map(section => (
        <View key={section.id}>
          {/* ── Section divider ── */}
          <View style={styles.sectionDivider}>
            <AppText style={styles.sectionLabel}>
              {section.sectionLabel.toUpperCase()}
            </AppText>
            <View style={styles.sectionLine} />
          </View>

          {/* ── Card ── */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.card}
            onPress={() =>
              navigation.navigate('LifestyleDetail', {
                lifestyleId: section.id,
              })
            }>
            {/* Card header */}
            <View style={styles.cardHeader}>
              <View style={[styles.icoCircle, {backgroundColor: section.icoBg}]}>
                <AppText style={styles.icoText}>{section.ico}</AppText>
              </View>
              <AppText style={styles.headerTitle} numberOfLines={1}>
                {section.title}
              </AppText>
              <View
                style={[
                  styles.badgePill,
                  {backgroundColor: section.badgeBg},
                ]}>
                <AppText
                  style={[styles.badgeText, {color: section.badgeColor}]}>
                  {section.badge}
                </AppText>
              </View>
              <AppText style={styles.chevron}>{'\u203A'}</AppText>
            </View>

            {/* Metric rows */}
            {section.metrics.map((m, idx) => (
              <View
                key={idx}
                style={[
                  styles.metricRow,
                  idx < section.metrics.length - 1 && styles.metricRowBorder,
                ]}>
                <AppText style={styles.metricLabel}>{m.label}</AppText>
                <View style={styles.metricValueCol}>
                  <AppText
                    style={[styles.metricValue, {color: m.valueColor}]}>
                    {m.value}
                  </AppText>
                  {m.ref ? (
                    <AppText style={styles.metricRef}>{m.ref}</AppText>
                  ) : null}
                </View>
                <View
                  style={[styles.metricPill, {backgroundColor: m.pillBg}]}>
                  <AppText
                    style={[styles.metricPillText, {color: m.pillColor}]}>
                    {m.pillLabel}
                  </AppText>
                </View>
              </View>
            ))}

            {/* Correlation box */}
            <View style={styles.corrBox}>
              <AppText style={styles.corrTitle}>{section.corrTitle}</AppText>
              <AppText style={styles.corrBody}>{section.corrBody}</AppText>
            </View>
          </TouchableOpacity>
        </View>
      ))}
    </View>
  );
};

const styles = StyleSheet.create({
  /* Section divider */
  sectionDivider: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
    marginTop: vs(10),
    gap: s(8),
  },
  sectionLabel: {
    fontSize: ms(9),
    fontWeight: '700',
    letterSpacing: ms(9) * 0.09,
    color: '#888',
  },
  sectionLine: {
    flex: 1,
    height: 0.5,
    backgroundColor: '#dde8e2',
  },

  /* Card */
  card: {
    backgroundColor: '#fff',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#dde8e2',
    overflow: 'hidden',
    marginBottom: vs(10),
  },

  /* Card header */
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: '#edf2ef',
    gap: s(8),
  },
  icoCircle: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(9),
    alignItems: 'center',
    justifyContent: 'center',
  },
  icoText: {
    fontSize: ms(15),
  },
  headerTitle: {
    flex: 1,
    fontSize: ms(12),
    fontWeight: '700',
    color: '#1a1a1a',
  },
  badgePill: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
  badgeText: {
    fontSize: ms(9),
    fontWeight: '700',
  },
  chevron: {
    fontSize: ms(16),
    color: '#aaa',
  },

  /* Metric rows */
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    gap: s(8),
  },
  metricRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: '#f4f4f4',
  },
  metricLabel: {
    flex: 1,
    fontSize: ms(11),
    color: '#1a1a1a',
  },
  metricValueCol: {
    alignItems: 'flex-end',
    marginRight: s(8),
  },
  metricValue: {
    fontSize: ms(13),
    fontWeight: '800',
    fontFamily: 'monospace',
  },
  metricRef: {
    fontSize: ms(9),
    color: '#aaa',
    marginTop: vs(1),
  },
  metricPill: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
    minWidth: s(32),
    alignItems: 'center',
  },
  metricPillText: {
    fontSize: ms(9),
    fontWeight: '700',
  },

  /* Correlation box */
  corrBox: {
    marginHorizontal: s(12),
    marginVertical: vs(10),
    backgroundColor: '#e8f5e9',
    borderWidth: 0.5,
    borderColor: '#a5d6a7',
    borderRadius: ms(11),
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
  },
  corrTitle: {
    fontSize: ms(10),
    fontWeight: '700',
    color: '#0a5c47',
    marginBottom: vs(4),
  },
  corrBody: {
    fontSize: ms(11),
    color: '#1b5e20',
    lineHeight: ms(11) * 1.65,
  },
});

export default LifestyleTab;
