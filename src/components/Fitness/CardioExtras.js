import React, {useMemo} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';

const HR_ZONES = [
  {id: 1, label: 'Recovery',      color: '#16a34a', range: '<115 bpm',    pct: '<55%'},
  {id: 2, label: 'Aerobic base',  color: '#2563eb', range: '115–138',     pct: '55–65%'},
  {id: 3, label: 'Aerobic power', color: '#d97706', range: '138–157',     pct: '65–75%'},
  {id: 4, label: 'Lactate thr.',  color: '#dc2626', range: '157–176',     pct: '75–85%'},
  {id: 5, label: 'Max',           color: '#7c3aed', range: '>176 bpm',    pct: '>85%'},
];

const CardioExtras = ({
  distance,
  durationMin,
  durationSec,
  hrZone,
  setHrZone,
  onOpenNumpad,
}) => {
  const pace = useMemo(() => {
    if (!distance || distance <= 0 || (!durationMin && !durationSec)) return null;
    const totalMin = (durationMin || 0) + (durationSec || 0) / 60;
    const paceVal = totalMin / distance;
    const mins = Math.floor(paceVal);
    const secs = Math.round((paceVal - mins) * 60);
    return `${mins}:${String(secs).padStart(2, '0')}`;
  }, [distance, durationMin, durationSec]);

  const speed = useMemo(() => {
    if (!distance || distance <= 0 || (!durationMin && !durationSec)) return null;
    const totalHours = ((durationMin || 0) + (durationSec || 0) / 60) / 60;
    if (totalHours <= 0) return null;
    return (distance / totalHours).toFixed(1);
  }, [distance, durationMin, durationSec]);

  return (
    <View style={styles.wrapper}>
      {/* ── Section 1: Distance & Pace ── */}
      <View style={styles.card}>
        <View style={styles.metricRow}>
          {/* Distance */}
          <TouchableOpacity
            activeOpacity={0.7}
            style={styles.metricCol}
            onPress={() =>
              onOpenNumpad?.('distance', 'Distance (km)', 'e.g. 3.5', 0, 100)
            }>
            <AppText style={styles.metricValue}>
              {distance > 0 ? distance : '0'}
            </AppText>
            <AppText style={styles.metricUnit}>km</AppText>
          </TouchableOpacity>

          {/* Separator */}
          <AppText style={styles.dotSep}>·</AppText>

          {/* Pace */}
          <View style={styles.metricCol}>
            <AppText style={styles.metricValueSm}>
              {pace || '–'}
            </AppText>
            <AppText style={styles.metricUnit}>min/km (auto)</AppText>
          </View>

          {/* Separator */}
          <AppText style={styles.dotSep}>·</AppText>

          {/* Speed */}
          <View style={styles.metricCol}>
            <AppText style={[styles.metricValueSm, styles.speedText]}>
              {speed ? `${speed}` : '–'}
            </AppText>
            <AppText style={styles.metricUnit}>km/h (auto)</AppText>
          </View>
        </View>
      </View>

      {/* ── Section 2: Heart Rate Zone Selector ── */}
      <View style={styles.card}>
        <View style={styles.hrHeader}>
          <AppText style={styles.hrTitle}>HR zone during activity</AppText>
          <AppText style={styles.hrSubtitle}>
            Priya est. max HR: 182 bpm
          </AppText>
        </View>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.zoneStrip}>
          {HR_ZONES.map((zone) => {
            const active = hrZone === zone.id;
            return (
              <TouchableOpacity
                key={zone.id}
                activeOpacity={0.7}
                style={[
                  styles.zoneBox,
                  {borderColor: zone.color},
                  active && {backgroundColor: zone.color},
                ]}
                onPress={() => setHrZone?.(zone.id)}>
                <AppText
                  style={[
                    styles.zoneNum,
                    {color: active ? Colors.white : zone.color},
                  ]}>
                  Z{zone.id}
                </AppText>
                <AppText
                  numberOfLines={1}
                  style={[
                    styles.zoneLabel,
                    {color: active ? Colors.white : zone.color},
                  ]}>
                  {zone.label}
                </AppText>
                <AppText
                  style={[
                    styles.zoneRange,
                    {color: active ? 'rgba(255,255,255,0.85)' : Colors.textTertiary},
                  ]}>
                  {zone.range}
                </AppText>
                <AppText
                  style={[
                    styles.zoneRange,
                    {color: active ? 'rgba(255,255,255,0.85)' : Colors.textTertiary},
                  ]}>
                  {zone.pct}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        <View style={styles.hrFooter}>
          <AppText style={styles.hrFooterText}>
            💡 Zone 2 is the fat-burning, metabolic health zone – especially
            important for T2DM management. Aim for 150+ min/week in Zone 2.
          </AppText>
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
    paddingVertical: vs(16),
    paddingHorizontal: s(12),
  },

  /* ── Distance / Pace / Speed row ── */
  metricRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  metricCol: {
    alignItems: 'center',
    flex: 1,
  },
  metricValue: {
    fontSize: ms(36),
    fontWeight: '700',
    color: Colors.accent,
    lineHeight: ms(42),
  },
  metricValueSm: {
    fontSize: ms(22),
    fontWeight: '700',
    color: Colors.textPrimary,
    lineHeight: ms(28),
  },
  speedText: {
    color: '#1055a0',
  },
  metricUnit: {
    fontSize: ms(9),
    fontWeight: '500',
    color: Colors.textTertiary,
    marginTop: vs(2),
  },
  dotSep: {
    fontSize: ms(20),
    color: Colors.textTertiary,
    marginHorizontal: s(4),
    marginBottom: vs(12),
  },

  /* ── HR Zone selector ── */
  hrHeader: {
    marginBottom: vs(10),
  },
  hrTitle: {
    fontSize: ms(13),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  hrSubtitle: {
    fontSize: ms(10),
    fontWeight: '500',
    color: Colors.textTertiary,
    marginTop: vs(2),
  },
  zoneStrip: {
    flexDirection: 'row',
    gap: s(8),
    paddingVertical: vs(4),
    paddingHorizontal: s(2),
  },
  zoneBox: {
    borderRadius: ms(12),
    borderWidth: 1.5,
    backgroundColor: Colors.background,
    paddingVertical: vs(8),
    paddingHorizontal: s(12),
    alignItems: 'center',
    minWidth: s(80),
  },
  zoneNum: {
    fontSize: ms(15),
    fontWeight: '700',
  },
  zoneLabel: {
    fontSize: ms(8),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginTop: vs(2),
  },
  zoneRange: {
    fontSize: ms(9),
    fontWeight: '500',
    marginTop: vs(1),
  },
  hrFooter: {
    marginTop: vs(10),
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    paddingVertical: vs(8),
    paddingHorizontal: s(10),
  },
  hrFooterText: {
    fontSize: ms(10),
    fontWeight: '500',
    color: Colors.textSecondary,
    lineHeight: ms(15),
  },
});

export default CardioExtras;
