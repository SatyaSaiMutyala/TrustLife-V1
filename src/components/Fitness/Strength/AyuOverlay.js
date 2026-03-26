import React, {useMemo} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';

/* ─── Constants ─────────────────────────────────────── */

const JUMP_LINKS = [
  {id: 'biomarkers', label: 'Biomarkers', emoji: '🔬', bg: Colors.tealBg, color: Colors.tealText},
  {id: 'conditions', label: 'Conditions', emoji: '📋', bg: Colors.amberBg, color: Colors.amberText},
  {id: 'organs', label: 'Organ Health', emoji: '❤️', bg: Colors.redBg, color: Colors.redText},
  {id: 'medications', label: 'Medications', emoji: '💊', bg: Colors.purpleBg, color: Colors.purpleText},
];

/* ─── Demo Session Fallback ─────────────────────────── */

const DEMO_SESSION = {
  type: 'Push',
  name: 'Push A – Chest Focus',
  date: new Date().toISOString(),
  duration: 52,
  totalVolume: 8450,
  totalSets: 22,
  avgRpe: 7.4,
  kcal: 310,
  prsSet: 2,
  exercises: [
    {name: 'Bench Press', sets: [{weight: 80, reps: 6, rpe: 8}, {weight: 75, reps: 8, rpe: 7}, {weight: 75, reps: 7, rpe: 8}, {weight: 70, reps: 10, rpe: 7}], maxWeight: 80, volume: 2270, est1rm: 96, isPR: true},
    {name: 'Incline DB Press', sets: [{weight: 28, reps: 10, rpe: 7}, {weight: 28, reps: 9, rpe: 7}, {weight: 26, reps: 10, rpe: 7}], maxWeight: 28, volume: 788, est1rm: 37, isPR: false},
    {name: 'Overhead Press', sets: [{weight: 50, reps: 6, rpe: 8}, {weight: 45, reps: 8, rpe: 7}, {weight: 45, reps: 7, rpe: 8}], maxWeight: 50, volume: 915, est1rm: 60, isPR: true},
    {name: 'Cable Flyes', sets: [{weight: 15, reps: 12, rpe: 6}, {weight: 15, reps: 12, rpe: 6}, {weight: 15, reps: 11, rpe: 7}], maxWeight: 15, volume: 525, est1rm: 21, isPR: false},
    {name: 'Lateral Raises', sets: [{weight: 10, reps: 15, rpe: 7}, {weight: 10, reps: 14, rpe: 7}, {weight: 10, reps: 12, rpe: 8}], maxWeight: 10, volume: 410, est1rm: 15, isPR: false},
    {name: 'Tricep Pushdown', sets: [{weight: 30, reps: 12, rpe: 6}, {weight: 30, reps: 11, rpe: 7}, {weight: 28, reps: 12, rpe: 7}], maxWeight: 30, volume: 1026, est1rm: 42, isPR: false},
  ],
  recentVolumes: [7800, 8100, 7600, 8450, 8200],
};

/* ─── Helpers ───────────────────────────────────────── */

const fmtVolume = (v) => {
  if (v >= 1000) return `${(v / 1000).toFixed(1)}k`;
  return `${v}`;
};

const fmtDate = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {day: 'numeric', month: 'short', year: 'numeric'});
};

const fmtDateShort = (iso) => {
  const d = new Date(iso);
  return d.toLocaleDateString('en-IN', {weekday: 'short', day: 'numeric', month: 'short'});
};

/* ─── AI Message Generator ─────────────────────────── */

const generateAyuMessage = (ses) => {
  const parts = [];

  parts.push(
    `Great session, Priya! You completed ${ses.totalSets} sets across ${ses.exercises.length} exercises in ${ses.duration} minutes — total volume of ${fmtVolume(ses.totalVolume)} kg.`,
  );

  if (ses.prsSet > 0) {
    const prExercises = ses.exercises.filter((e) => e.isPR).map((e) => e.name);
    parts.push(
      `Congratulations on ${ses.prsSet} new personal record${ses.prsSet > 1 ? 's' : ''}! ${prExercises.join(' and ')} — your strength gains are showing real progress.`,
    );
  }

  if (ses.avgRpe >= 8) {
    parts.push(
      'Your average RPE was high today. Make sure to get quality sleep tonight and consider a lighter session next time for recovery.',
    );
  } else if (ses.avgRpe >= 7) {
    parts.push(
      `Average RPE of ${ses.avgRpe.toFixed(1)} is right in the productive training zone. You're pushing enough to stimulate adaptation without excessive fatigue.`,
    );
  } else {
    parts.push(
      `Average RPE of ${ses.avgRpe.toFixed(1)} suggests you had room to push harder. Consider increasing weight by 2.5-5% next session.`,
    );
  }

  // T2DM-specific advice
  parts.push(
    'T2DM note: Resistance training improves insulin sensitivity for 24-48 hours post-session. Check your blood glucose within 30 min — you may see a temporary spike from cortisol, which is normal. Have 20-30g of protein within the hour to maximise muscle protein synthesis and support glucose uptake.',
  );

  if (ses.duration > 60) {
    parts.push(
      'Your session was over 60 minutes. Try to keep future sessions under an hour to manage cortisol and maintain training intensity throughout.',
    );
  }

  return parts.join('\n\n');
};

/* ─── Sub-components ────────────────────────────────── */

const StatCell = ({label, value, unit, emoji}) => (
  <View style={styles.statCell}>
    {emoji ? <AppText style={{fontSize: ms(16), marginBottom: vs(2)}}>{emoji}</AppText> : null}
    <AppText variant="bodyBold" color={Colors.textPrimary}>
      {value}
      {unit ? <AppText variant="small" color={Colors.textTertiary}> {unit}</AppText> : null}
    </AppText>
    <AppText variant="small" color={Colors.textTertiary}>{label}</AppText>
  </View>
);

const VolumeBar = ({value, maxVal, isCurrent, label}) => {
  const pct = maxVal > 0 ? Math.min(value / maxVal, 1) : 0;
  return (
    <View style={styles.volBarRow}>
      <AppText variant="small" color={Colors.textTertiary} style={styles.volBarLabel}>
        {label}
      </AppText>
      <View style={styles.volBarTrack}>
        <View
          style={[
            styles.volBarFill,
            {
              width: `${pct * 100}%`,
              backgroundColor: isCurrent ? Colors.accent : Colors.lightGreen,
            },
          ]}
        />
      </View>
      <AppText variant="small" color={isCurrent ? Colors.accent : Colors.textSecondary} style={[styles.volBarValue, isCurrent && {fontWeight: '700'}]}>
        {fmtVolume(value)}
      </AppText>
    </View>
  );
};

const ExerciseHighlight = ({exercise}) => (
  <View style={styles.exRow}>
    <View style={styles.exInfo}>
      <View style={styles.exNameRow}>
        <AppText variant="bodyBold" color={Colors.textPrimary} style={{flex: 1}}>
          {exercise.name}
        </AppText>
        {exercise.isPR && (
          <View style={styles.prBadge}>
            <AppText variant="small" color={Colors.accent} style={{fontWeight: '700'}}>
              🏆 PR
            </AppText>
          </View>
        )}
      </View>
      <View style={styles.exMetaRow}>
        <View style={styles.exMeta}>
          <AppText variant="small" color={Colors.textTertiary}>Max</AppText>
          <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>
            {exercise.maxWeight} kg
          </AppText>
        </View>
        <View style={styles.exMeta}>
          <AppText variant="small" color={Colors.textTertiary}>Volume</AppText>
          <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>
            {fmtVolume(exercise.volume)} kg
          </AppText>
        </View>
        <View style={styles.exMeta}>
          <AppText variant="small" color={Colors.textTertiary}>Est 1RM</AppText>
          <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>
            {exercise.est1rm} kg
          </AppText>
        </View>
        <View style={styles.exMeta}>
          <AppText variant="small" color={Colors.textTertiary}>Sets</AppText>
          <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>
            {exercise.sets.length}
          </AppText>
        </View>
      </View>
    </View>
  </View>
);

const JumpCard = ({item, onPress}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.jumpCard, {backgroundColor: item.bg}]}
    activeOpacity={0.7}>
    <AppText style={{fontSize: ms(20)}}>{item.emoji}</AppText>
    <AppText variant="caption" color={item.color} style={{fontWeight: '600', marginTop: vs(4)}}>
      {item.label}
    </AppText>
  </TouchableOpacity>
);

/* ─── Main Component ───────────────────────────────── */

const AyuOverlay = ({visible, session, onClose}) => {
  const ses = session || DEMO_SESSION;

  const ayuMessage = useMemo(() => generateAyuMessage(ses), [ses]);

  const volumeHistory = useMemo(() => {
    const vols = ses.recentVolumes || [ses.totalVolume];
    const maxVol = Math.max(...vols, 1);
    return vols.map((v, i) => ({
      value: v,
      isCurrent: i === vols.length - 1,
      label: i === vols.length - 1 ? 'Today' : `S-${vols.length - 1 - i}`,
    }));
  }, [ses]);

  const maxVol = useMemo(() => Math.max(...(ses.recentVolumes || [ses.totalVolume]), 1), [ses]);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
            {/* Handle */}
            <View style={styles.handle} />

            {/* Hero Section */}
            <View style={styles.heroSection}>
              <View style={styles.ayuAvatar}>
                <AppText style={{fontSize: ms(24)}}>🌿</AppText>
              </View>
              <AppText variant="header" color={Colors.textPrimary} style={{marginTop: vs(10)}}>
                Session complete, Priya! ✨
              </AppText>
              <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(4)}}>
                {ses.name} · {fmtDateShort(ses.date)}
              </AppText>
            </View>

            {/* Stats Grid */}
            <View style={styles.statsGrid}>
              <StatCell label="Total volume" value={fmtVolume(ses.totalVolume)} unit="kg" emoji="🏋️" />
              <StatCell label="Sets logged" value={ses.totalSets} emoji="📊" />
              <StatCell label="Duration" value={ses.duration} unit="min" emoji="⏱️" />
              <StatCell label="kcal burned" value={ses.kcal || Math.round(ses.duration * 5.8)} emoji="🔥" />
              <StatCell label="Avg RPE" value={ses.avgRpe ? ses.avgRpe.toFixed(1) : '—'} emoji="💪" />
              <StatCell label="New PRs" value={ses.prsSet || 0} emoji="🏆" />
            </View>

            {/* Volume Comparison */}
            <View style={styles.section}>
              <AppText variant="sectionTitle" color={Colors.textSecondary}>Volume Trend</AppText>
              <View style={styles.volCard}>
                {volumeHistory.map((bar, idx) => (
                  <VolumeBar
                    key={idx}
                    value={bar.value}
                    maxVal={maxVol}
                    isCurrent={bar.isCurrent}
                    label={bar.label}
                  />
                ))}
              </View>
            </View>

            {/* AI Message Bubble */}
            <View style={styles.section}>
              <View style={styles.ayuBubbleHeader}>
                <View style={styles.ayuAvatarSmall}>
                  <AppText style={{fontSize: ms(12)}}>🌿</AppText>
                </View>
                <AppText variant="bodyBold" color={Colors.accent}>Ayu's Analysis</AppText>
              </View>
              <View style={styles.ayuBubble}>
                <AppText variant="body" color={Colors.tealText} style={{lineHeight: ms(20)}}>
                  {ayuMessage}
                </AppText>
              </View>
            </View>

            {/* Exercise Highlights */}
            <View style={styles.section}>
              <AppText variant="sectionTitle" color={Colors.textSecondary}>Exercise Highlights</AppText>
              {ses.exercises.map((ex, idx) => (
                <ExerciseHighlight key={idx} exercise={ex} />
              ))}
            </View>

            {/* Jump-to Links */}
            <View style={styles.section}>
              <AppText variant="sectionTitle" color={Colors.textSecondary}>Track Your Health</AppText>
              <AppText variant="caption" color={Colors.textTertiary} style={{marginTop: vs(2), marginBottom: vs(8)}}>
                See how training affects your health markers
              </AppText>
              <View style={styles.jumpGrid}>
                {JUMP_LINKS.map((item) => (
                  <JumpCard key={item.id} item={item} onPress={() => {}} />
                ))}
              </View>
            </View>

            {/* CTA Button */}
            <TouchableOpacity onPress={onClose} style={styles.ctaButton} activeOpacity={0.8}>
              <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(15)}}>
                Continue →
              </AppText>
            </TouchableOpacity>

            <View style={{height: vs(24)}} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

/* ─── Styles ───────────────────────────────────────── */

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
    paddingHorizontal: s(20),
    paddingBottom: vs(16),
    maxHeight: '92%',
  },
  handle: {
    width: s(40),
    height: vs(4),
    backgroundColor: Colors.borderLight,
    borderRadius: ms(2),
    alignSelf: 'center',
    marginTop: vs(10),
    marginBottom: vs(8),
  },

  /* Hero */
  heroSection: {
    alignItems: 'center',
    paddingVertical: vs(12),
  },
  ayuAvatar: {
    width: s(56),
    height: s(56),
    borderRadius: s(28),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 2,
    borderColor: Colors.accent,
  },

  /* Stats grid */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: vs(8),
    gap: s(8),
  },
  statCell: {
    width: '30%',
    backgroundColor: Colors.background,
    borderRadius: ms(12),
    padding: s(10),
    alignItems: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },

  /* Section */
  section: {
    marginTop: vs(20),
  },

  /* Volume bars */
  volCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(12),
    marginTop: vs(8),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  volBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  volBarLabel: {
    width: s(40),
  },
  volBarTrack: {
    flex: 1,
    height: vs(12),
    backgroundColor: Colors.background,
    borderRadius: ms(6),
    overflow: 'hidden',
    marginHorizontal: s(8),
  },
  volBarFill: {
    height: '100%',
    borderRadius: ms(6),
  },
  volBarValue: {
    width: s(42),
    textAlign: 'right',
  },

  /* Ayu bubble */
  ayuBubbleHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginBottom: vs(8),
  },
  ayuAvatarSmall: {
    width: s(28),
    height: s(28),
    borderRadius: s(14),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ayuBubble: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(16),
    borderTopLeftRadius: ms(4),
    padding: s(14),
    borderWidth: 1,
    borderColor: 'rgba(29,158,117,0.15)',
  },

  /* Exercise highlights */
  exRow: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(12),
    marginTop: vs(6),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  exInfo: {
    flex: 1,
  },
  exNameRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  prBadge: {
    backgroundColor: Colors.tealBg,
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
    marginLeft: s(6),
  },
  exMetaRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  exMeta: {
    alignItems: 'center',
  },

  /* Jump links */
  jumpGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
  },
  jumpCard: {
    width: '47%',
    borderRadius: ms(14),
    padding: s(14),
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: vs(70),
  },

  /* CTA */
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: ms(14),
    paddingVertical: vs(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(24),
    shadowColor: Colors.primary,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
});

export default AyuOverlay;
