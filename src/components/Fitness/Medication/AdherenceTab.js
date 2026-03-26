import React, {useMemo, useState} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {MEDICATIONS, BIOMARKER_IMPACT} from '../../../constants/medicationData';

/* ─── Constants ─────────────────────────────────────── */

const RING_SIZE = ms(130);
const DOT_COUNT = 20;

const HEATMAP_COLS = 7;
const HEATMAP_ROWS = 5;
const CELL_SIZE = ms(14);
const CELL_GAP = ms(3);

const DAY_LABELS = ['M', 'T', 'W', 'T', 'F', 'S', 'S'];

const NOTIFICATION_DEFAULTS = [
  {id: 'med_reminder', label: 'Medication reminders', desc: 'Get notified when it is time to take your medication', defaultOn: true},
  {id: 'early_reminder', label: 'Early reminder (15 min before)', desc: 'Receive a heads-up 15 minutes before scheduled time', defaultOn: false},
  {id: 'missed_alert', label: 'Missed dose alert', desc: 'Alert if a dose is not marked as taken within 30 minutes', defaultOn: true},
  {id: 'refill_reminder', label: 'Refill reminder (7 days)', desc: 'Remind me 7 days before medication runs out', defaultOn: true},
  {id: 'sound_vibration', label: 'Sound & vibration', desc: 'Play a sound and vibrate for all medication alerts', defaultOn: true},
];

/* ─── Helpers ───────────────────────────────────────── */

const adherenceColor = (pct) => {
  if (pct >= 90) return {bg: Colors.tealBg, bar: Colors.accent, text: Colors.tealText};
  if (pct >= 75) return {bg: Colors.amberBg, bar: Colors.amber, text: Colors.amberText};
  return {bg: Colors.redBg, bar: Colors.red, text: Colors.redText};
};

const severityColor = (level) => {
  switch (level) {
    case 'critical': return {bg: Colors.redBg, text: Colors.redText, border: Colors.red};
    case 'warning': return {bg: Colors.amberBg, text: Colors.amberText, border: Colors.amber};
    case 'info': return {bg: Colors.blueBg, text: Colors.blueText, border: Colors.blue};
    default: return {bg: Colors.tealBg, text: Colors.tealText, border: Colors.accent};
  }
};

const generateHistory = (adherencePct) => {
  const total = HEATMAP_COLS * HEATMAP_ROWS;
  const taken = Math.round((adherencePct / 100) * total);
  const missed = total - taken;
  const history = [];
  for (let i = 0; i < total; i++) {
    if (i < taken) {
      history.push('taken');
    } else if (i < taken + missed) {
      history.push(i < taken + Math.round(missed * 0.7) ? 'missed' : 'na');
    } else {
      history.push('na');
    }
  }
  // Shuffle deterministically based on adherence
  for (let i = history.length - 1; i > 0; i--) {
    const j = Math.floor(((adherencePct * (i + 7)) % (i + 1)));
    [history[i], history[j]] = [history[j], history[i]];
  }
  return history;
};

const computeAvgAdherence = (meds) => {
  if (!meds || meds.length === 0) return 0;
  const total = meds.reduce((sum, m) => sum + (m.adherence || 0), 0);
  return Math.round(total / meds.length);
};

const computeBestStreak = (meds) => {
  if (!meds || meds.length === 0) return 0;
  return Math.max(...meds.map((m) => m.streak || 0));
};

const computeTotalMissed = (meds) => {
  if (!meds || meds.length === 0) return 0;
  return meds.reduce((sum, m) => sum + (m.missedDoses || 0), 0);
};

/* ─── Sub-components ────────────────────────────────── */

const DotRing = ({percentage, color}) => {
  return (
    <View style={styles.ringContainer}>
      {Array.from({length: DOT_COUNT}).map((_, i) => {
        const filled = i < Math.round((percentage / 100) * DOT_COUNT);
        const angle = (i / DOT_COUNT) * 360 - 90;
        const r = RING_SIZE / 2 - ms(5);
        const cx = RING_SIZE / 2 + r * Math.cos((angle * Math.PI) / 180) - ms(4);
        const cy = RING_SIZE / 2 + r * Math.sin((angle * Math.PI) / 180) - ms(4);
        return (
          <View
            key={i}
            style={{
              position: 'absolute',
              left: cx,
              top: cy,
              width: ms(8),
              height: ms(8),
              borderRadius: ms(4),
              backgroundColor: filled ? (color || Colors.accent) : Colors.borderLight,
            }}
          />
        );
      })}
      <View style={styles.ringCenter}>
        <AppText variant="header" color={color} style={{fontSize: ms(28), lineHeight: ms(32)}}>
          {percentage}
        </AppText>
        <AppText variant="small" color={Colors.textTertiary}>% avg</AppText>
      </View>
    </View>
  );
};

const HeatmapGrid = ({history, medColor}) => {
  const cells = history || [];
  return (
    <View style={styles.heatmapWrapper}>
      <View style={styles.heatmapDayLabels}>
        {DAY_LABELS.map((d, i) => (
          <AppText key={i} variant="small" color={Colors.textTertiary} style={styles.heatmapDayLabel}>{d}</AppText>
        ))}
      </View>
      <View style={styles.heatmapGrid}>
        {cells.map((status, idx) => {
          let bg = '#e8e8e8';
          if (status === 'taken') bg = medColor || Colors.accent;
          else if (status === 'missed') bg = Colors.red;
          return (
            <View key={idx} style={[styles.heatmapCell, {backgroundColor: bg}]} />
          );
        })}
      </View>
    </View>
  );
};

const HeatmapLegend = ({medColor}) => (
  <View style={styles.legendRow}>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, {backgroundColor: medColor || Colors.accent}]} />
      <AppText variant="small" color={Colors.textTertiary}>Taken</AppText>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, {backgroundColor: Colors.red}]} />
      <AppText variant="small" color={Colors.textTertiary}>Missed</AppText>
    </View>
    <View style={styles.legendItem}>
      <View style={[styles.legendDot, {backgroundColor: '#e8e8e8'}]} />
      <AppText variant="small" color={Colors.textTertiary}>N/A</AppText>
    </View>
  </View>
);

const ProgressBar = ({pct, color, height}) => (
  <View style={[styles.progressTrack, {height: height || vs(8)}]}>
    <View
      style={[
        styles.progressFill,
        {
          width: `${Math.min(pct, 100)}%`,
          backgroundColor: color || Colors.accent,
          height: '100%',
        },
      ]}
    />
  </View>
);

const Toggle = ({value, onToggle}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onToggle}
    style={[styles.toggleTrack, value && styles.toggleTrackOn]}>
    <View style={[styles.toggleThumb, value && styles.toggleThumbOn]} />
  </TouchableOpacity>
);

const NotificationToggle = ({item, value, onToggle}) => (
  <View style={styles.notifRow}>
    <View style={styles.notifInfo}>
      <AppText variant="body" color={Colors.textPrimary}>{item.label}</AppText>
      <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
        {item.desc}
      </AppText>
    </View>
    <Toggle value={value} onToggle={onToggle} />
  </View>
);

/* ─── Main Component ───────────────────────────────── */

const AdherenceTab = ({meds}) => {
  const medications = meds || MEDICATIONS;

  /* Notification state */
  const [notifications, setNotifications] = useState(() => {
    const initial = {};
    NOTIFICATION_DEFAULTS.forEach((n) => {
      initial[n.id] = n.defaultOn;
    });
    return initial;
  });

  const toggleNotif = (id) => {
    setNotifications((prev) => ({...prev, [id]: !prev[id]}));
  };

  /* Computed values */
  const avgAdherence = useMemo(() => computeAvgAdherence(medications), [medications]);
  const bestStreak = useMemo(() => computeBestStreak(medications), [medications]);
  const totalMissed = useMemo(() => computeTotalMissed(medications), [medications]);
  const ac = useMemo(() => adherenceColor(avgAdherence), [avgAdherence]);

  /* Per-med histories */
  const medHistories = useMemo(() => {
    return medications.map((med) => ({
      ...med,
      history: generateHistory(med.adherence || 0),
    }));
  }, [medications]);

  /* Biomarker impact cards */
  const biomarkerCards = useMemo(() => {
    return (BIOMARKER_IMPACT || []).filter(Boolean);
  }, []);

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>

      {/* ─── Section 1: Overall Adherence Ring ──── */}
      <View style={styles.overviewCard}>
        <View style={styles.overviewContent}>
          {/* Ring */}
          <View style={styles.ringOuter}>
            <DotRing percentage={avgAdherence} color={ac.bar} />
          </View>

          {/* Stats */}
          <View style={styles.overviewStats}>
            <AppText variant="sectionTitle" color={Colors.textSecondary}>
              Overall Adherence
            </AppText>
            <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(4)}}>
              Past 30 days across all medications
            </AppText>

            <View style={styles.statRow}>
              <View style={styles.statItem}>
                <AppText variant="bodyBold" color={Colors.accent}>
                  {bestStreak} days
                </AppText>
                <AppText variant="small" color={Colors.textTertiary}>Best streak</AppText>
              </View>
              <View style={styles.statDivider} />
              <View style={styles.statItem}>
                <AppText variant="bodyBold" color={Colors.red}>
                  {totalMissed}
                </AppText>
                <AppText variant="small" color={Colors.textTertiary}>Missed doses</AppText>
              </View>
            </View>
          </View>
        </View>
      </View>

      {/* ─── Section 2: Per-medication Adherence ─ */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          Per-Medication Adherence
        </AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          30-day breakdown for each medication
        </AppText>

        {medHistories.map((med, idx) => {
          const mac = adherenceColor(med.adherence || 0);
          const medColor = med.color || Colors.accent;

          return (
            <View key={med.id || idx} style={styles.medCard}>
              {/* Header row */}
              <View style={styles.medHeader}>
                <View style={styles.medTitleRow}>
                  <AppText style={{fontSize: ms(20)}}>{med.emoji || '💊'}</AppText>
                  <View style={styles.medTitleInfo}>
                    <AppText variant="bodyBold" color={Colors.textPrimary}>
                      {med.name}
                    </AppText>
                    <AppText variant="small" color={Colors.textTertiary}>
                      {med.dose} · {med.frequency}
                    </AppText>
                  </View>
                </View>
                <View style={styles.medStats}>
                  <View style={[styles.adherenceBadge, {backgroundColor: mac.bg}]}>
                    <AppText variant="small" color={mac.text} style={{fontWeight: '700'}}>
                      {med.adherence}%
                    </AppText>
                  </View>
                  <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
                    {med.streak || 0}d streak
                  </AppText>
                </View>
              </View>

              {/* Progress bar */}
              <ProgressBar pct={med.adherence || 0} color={medColor} />

              {/* 30-day heatmap */}
              <View style={styles.heatmapSection}>
                <AppText variant="small" color={Colors.textTertiary} style={{marginBottom: vs(6)}}>
                  30-Day History
                </AppText>
                <HeatmapGrid history={med.history} medColor={medColor} />
                <HeatmapLegend medColor={medColor} />
              </View>
            </View>
          );
        })}
      </View>

      {/* ─── Section 3: Biomarker Impact ─────── */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          Biomarker Impact of Missed Doses
        </AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          What happens when you miss your medications
        </AppText>

        {biomarkerCards.map((card, idx) => {
          const cardColor = card.col || Colors.accent;
          const adhPct = card.adh || 0;
          const ac2 = adherenceColor(adhPct);
          return (
            <View
              key={card.medId || idx}
              style={[styles.biomarkerCard, {backgroundColor: Colors.white, borderLeftColor: cardColor}]}>
              <View style={styles.biomarkerHeader}>
                <View style={{flex: 1}}>
                  <AppText variant="bodyBold" color={Colors.textPrimary}>
                    {card.med || 'Unknown'}
                  </AppText>
                  <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
                    Biomarker: {card.bio || 'N/A'}
                  </AppText>
                </View>
                <View style={[styles.adherenceBadge, {backgroundColor: ac2.bg}]}>
                  <AppText variant="small" color={ac2.text} style={{fontWeight: '700'}}>
                    {adhPct}%
                  </AppText>
                </View>
              </View>
              <View style={styles.biomarkerValues}>
                <View style={styles.biomarkerValItem}>
                  <AppText variant="small" color={Colors.textTertiary}>Current</AppText>
                  <AppText variant="bodyBold" color={Colors.textPrimary}>{card.current || '--'}</AppText>
                </View>
                <AppText color={Colors.textTertiary} style={{marginHorizontal: s(8)}}>{'>'}</AppText>
                <View style={styles.biomarkerValItem}>
                  <AppText variant="small" color={Colors.textTertiary}>Projected</AppText>
                  <AppText variant="bodyBold" color={cardColor}>{card.projected || '--'}</AppText>
                </View>
              </View>
            </View>
          );
        })}
      </View>

      {/* ─── Section 4: Notification Settings ── */}
      <View style={styles.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          Notification Settings
        </AppText>
        <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          Configure your medication reminders
        </AppText>

        <View style={styles.notifCard}>
          {NOTIFICATION_DEFAULTS.map((item, idx) => (
            <React.Fragment key={item.id}>
              <NotificationToggle
                item={item}
                value={notifications[item.id]}
                onToggle={() => toggleNotif(item.id)}
              />
              {idx < NOTIFICATION_DEFAULTS.length - 1 && (
                <View style={styles.notifDivider} />
              )}
            </React.Fragment>
          ))}
        </View>

        {/* Quick summary */}
        <View style={styles.notifSummary}>
          <AppText variant="small" color={Colors.textTertiary}>
            {Object.values(notifications).filter(Boolean).length} of{' '}
            {NOTIFICATION_DEFAULTS.length} notifications enabled
          </AppText>
        </View>
      </View>

      <View style={{height: vs(40)}} />
    </ScrollView>
  );
};

/* ─── Styles ───────────────────────────────────────── */

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingTop: vs(8),
  },

  /* Overview card */
  overviewCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    padding: s(16),
    marginTop: vs(4),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  overviewContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ringOuter: {
    width: RING_SIZE,
    height: RING_SIZE,
    marginRight: s(16),
  },
  overviewStats: {
    flex: 1,
  },
  statRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(12),
  },
  statItem: {
    flex: 1,
    alignItems: 'center',
  },
  statDivider: {
    width: 1,
    height: vs(28),
    backgroundColor: Colors.borderLight,
  },

  /* Ring */
  ringContainer: {
    width: RING_SIZE,
    height: RING_SIZE,
    justifyContent: 'center',
    alignItems: 'center',
  },
  /* (ringSegment removed — using dot ring) */
  ringCenter: {
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Section */
  section: {
    marginTop: vs(22),
  },

  /* Per-medication card */
  medCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  medHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: vs(10),
  },
  medTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  medTitleInfo: {
    marginLeft: s(10),
    flex: 1,
  },
  medStats: {
    alignItems: 'flex-end',
  },
  adherenceBadge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(10),
  },

  /* Progress bar */
  progressTrack: {
    backgroundColor: Colors.background,
    borderRadius: ms(4),
    overflow: 'hidden',
    marginBottom: vs(10),
  },
  progressFill: {
    borderRadius: ms(4),
  },

  /* Heatmap */
  heatmapSection: {
    marginTop: vs(4),
  },
  heatmapWrapper: {
    alignItems: 'center',
  },
  heatmapDayLabels: {
    flexDirection: 'row',
    marginBottom: vs(4),
    width: HEATMAP_COLS * (CELL_SIZE + CELL_GAP) - CELL_GAP,
  },
  heatmapDayLabel: {
    width: CELL_SIZE,
    textAlign: 'center',
    marginRight: CELL_GAP,
    fontSize: ms(9),
  },
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    width: HEATMAP_COLS * (CELL_SIZE + CELL_GAP) - CELL_GAP,
  },
  heatmapCell: {
    width: CELL_SIZE,
    height: CELL_SIZE,
    borderRadius: ms(3),
    marginRight: CELL_GAP,
    marginBottom: CELL_GAP,
  },

  /* Legend */
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    marginTop: vs(8),
    gap: s(16),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  legendDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(3),
  },

  /* Biomarker impact cards */
  biomarkerCard: {
    borderRadius: ms(12),
    padding: s(14),
    marginTop: vs(10),
    borderLeftWidth: s(4),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  biomarkerHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  biomarkerValues: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10),
  },
  biomarkerValItem: {
    alignItems: 'center',
  },

  /* Toggle */
  toggleTrack: {
    width: s(46),
    height: vs(26),
    borderRadius: ms(13),
    backgroundColor: Colors.borderLight,
    justifyContent: 'center',
    paddingHorizontal: s(3),
  },
  toggleTrackOn: {
    backgroundColor: Colors.accent,
  },
  toggleThumb: {
    width: s(20),
    height: s(20),
    borderRadius: s(10),
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },

  /* Notification settings */
  notifCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  notifRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  notifInfo: {
    flex: 1,
    marginRight: s(12),
  },
  notifDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
  },
  notifSummary: {
    alignItems: 'center',
    marginTop: vs(8),
  },
});

export default AdherenceTab;
