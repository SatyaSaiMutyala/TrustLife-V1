import React, {useMemo} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  Platform,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {
  LIFESTYLE_ACTIVITIES,
  DEMO_HISTORY,
  USER,
} from '../../../constants/lifestyleData';

/* ─── Helpers ──────────────────────────────────────────────── */

const getAct = (actId) =>
  (LIFESTYLE_ACTIVITIES || []).find((a) => a.id === actId) || {};

const calcKcal = (met, weightKg, durMin) =>
  Math.round(met * weightKg * (durMin / 60));

const stressColor = (val) => {
  if (val < 4) return '#16a34a';
  if (val <= 5) return '#3b82f6';
  if (val <= 7) return '#d97706';
  return '#dc2626';
};

const pad = (n) => String(n).padStart(2, '0');

/* ─── Section Header ───────────────────────────────────────── */

const SectionHeader = ({icon, title, subtitle}) => (
  <View style={sty.sectionHeader}>
    <View style={sty.sectionTitleRow}>
      {icon ? <AppText style={sty.sectionIcon}>{icon}</AppText> : null}
      <AppText variant="bodyBold" style={sty.sectionTitle}>{title}</AppText>
    </View>
    {subtitle ? (
      <AppText variant="caption" color={Colors.textTertiary} style={sty.sectionSub}>
        {subtitle}
      </AppText>
    ) : null}
  </View>
);

/* ─── Main Component ───────────────────────────────────────── */

const AnalyticsTab = () => {
  /* ── Computed analytics ────────────────────────────── */

  const stats = useMemo(() => {
    const history = DEMO_HISTORY || [];
    const totalLogged = history.length;
    const totalMin = history.reduce((sum, h) => sum + (h.dur || 0), 0);
    const totalHrs = Math.floor(totalMin / 60);
    const remainMin = totalMin % 60;
    const totalKcal = history.reduce((sum, h) => sum + (h.kcal || 0), 0);
    const stresses = history.filter((h) => h.stress != null).map((h) => h.stress);
    const avgStress = stresses.length
      ? Math.round((stresses.reduce((a, b) => a + b, 0) / stresses.length) * 10) / 10
      : 0;

    return {totalLogged, totalMin, totalHrs, remainMin, totalKcal, avgStress};
  }, []);

  const sedentaryStats = useMemo(() => {
    const history = DEMO_HISTORY || [];
    const total = history.reduce((s, h) => s + (h.dur || 0), 0);
    if (total === 0) return {activePct: 0, sedPct: 0, sedMin: 0, activeMin: 0};
    const sedIds = new Set(['desk', 'screen']);
    const sedMin = history.filter((h) => sedIds.has(h.actId)).reduce((s, h) => s + (h.dur || 0), 0);
    const activeMin = total - sedMin;
    const sedPct = Math.round((sedMin / total) * 100);
    const activePct = 100 - sedPct;
    return {activePct, sedPct, sedMin, activeMin};
  }, []);

  const activityBreakdown = useMemo(() => {
    const history = DEMO_HISTORY || [];
    const map = {};
    history.forEach((h) => {
      if (!map[h.actId]) map[h.actId] = {min: 0, sessions: 0};
      map[h.actId].min += h.dur || 0;
      map[h.actId].sessions += 1;
    });
    const maxMin = Math.max(...Object.values(map).map((v) => v.min), 1);
    return Object.entries(map)
      .map(([actId, val]) => ({
        actId,
        ...getAct(actId),
        ...val,
        pct: val.min / maxMin,
      }))
      .sort((a, b) => b.min - a.min);
  }, []);

  const healthFlags = useMemo(() => {
    const flags = [];
    const history = DEMO_HISTORY || [];

    // High sedentary
    if (sedentaryStats.sedPct > 40) {
      flags.push({
        type: 'amber',
        icon: '\u26A0\uFE0F',
        title: 'High sedentary ratio',
        msg: `${sedentaryStats.sedPct}% of logged time is sedentary (desk + screen). WHO recommends limiting prolonged sitting to reduce CVD and metabolic risk.`,
      });
    }

    // High stress
    const highStress = history.filter((h) => h.stress >= 7);
    if (highStress.length > 0) {
      flags.push({
        type: 'amber',
        icon: '\uD83E\uDDE0',
        title: 'Elevated stress detected',
        msg: `${highStress.length} session(s) with stress >= 7/10. Chronic stress elevates cortisol and raises BP. Consider adding mindfulness or gardening breaks.`,
      });
    }

    // Screen time
    const screenSessions = history.filter((h) => h.actId === 'screen');
    const totalScreenMin = screenSessions.reduce((s, h) => s + (h.dur || 0), 0);
    if (totalScreenMin > 120) {
      flags.push({
        type: 'amber',
        icon: '\uD83D\uDCF1',
        title: 'Excessive screen time',
        msg: `${Math.round(totalScreenMin / 60)}+ hours of leisure screen time. Late-evening use disrupts melatonin and sleep quality. Use blue-light filter after sunset.`,
      });
    }

    // Gardening positive
    const gardenSessions = history.filter((h) => h.actId === 'gardening');
    if (gardenSessions.length > 0) {
      flags.push({
        type: 'green',
        icon: '\uD83C\uDF3F',
        title: 'Gardening benefit',
        msg: 'Gardening lowers cortisol measurably and boosts mood. Your logged sessions show positive wellbeing impact. Keep it up!',
      });
    }

    // Cooking positive
    const cookSessions = history.filter((h) => h.actId === 'cooking');
    if (cookSessions.length > 0) {
      flags.push({
        type: 'green',
        icon: '\uD83C\uDF73',
        title: 'Home cooking logged',
        msg: 'Cooking at home is linked to better nutrient intake, lower sodium, and healthier portion sizes vs. eating out.',
      });
    }

    // No mindfulness
    const hasMindfulness = history.some((h) => h.actId === 'gardening' || h.actId === 'cleaning');
    if (!hasMindfulness) {
      flags.push({
        type: 'blue',
        icon: '\uD83E\uDDD8',
        title: 'Missing active recovery',
        msg: 'No mindful or active recovery sessions logged. Adding gardening, cleaning, or light movement can lower resting HR and improve recovery.',
      });
    }

    // Manual work
    const manualSessions = history.filter((h) => h.actId === 'manual');
    if (manualSessions.length > 0) {
      const totalManualMin = manualSessions.reduce((s, h) => s + (h.dur || 0), 0);
      if (totalManualMin > 300) {
        flags.push({
          type: 'blue',
          icon: '\uD83D\uDD27',
          title: 'Significant manual work',
          msg: `${Math.round(totalManualMin / 60)}+ hours of manual/field work logged. Ensure adequate hydration and joint recovery. Watch for repetitive strain.`,
        });
      }
    }

    return flags;
  }, [sedentaryStats]);

  const neatChart = useMemo(() => {
    const history = (DEMO_HISTORY || []).slice(0, 8);
    const maxKcal = Math.max(...history.map((h) => h.kcal || 0), 1);
    return history.map((h) => ({
      ...h,
      act: getAct(h.actId),
      pct: (h.kcal || 0) / maxKcal,
    }));
  }, []);

  const stressChart = useMemo(() => {
    const history = (DEMO_HISTORY || []).slice(0, 8);
    return history.map((h) => ({
      ...h,
      act: getAct(h.actId),
      pct: (h.stress || 0) / 10,
      color: stressColor(h.stress || 0),
    }));
  }, []);

  /* ── Render: Headline Stats ────────────────────────── */

  const renderHeadlineStats = () => (
    <View style={sty.section}>
      <View style={sty.statsGrid}>
        <View style={sty.statCard}>
          <AppText variant="small" color={Colors.textTertiary} style={sty.statLabel}>
            Activities logged
          </AppText>
          <AppText variant="bodyBold" style={sty.statValue}>{stats.totalLogged}</AppText>
          <AppText variant="small" color={Colors.textTertiary}>sessions</AppText>
        </View>
        <View style={sty.statCard}>
          <AppText variant="small" color={Colors.textTertiary} style={sty.statLabel}>
            Total time
          </AppText>
          <AppText variant="bodyBold" style={sty.statValue}>
            {stats.totalHrs}h {pad(stats.remainMin)}m
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>logged</AppText>
        </View>
        <View style={sty.statCard}>
          <AppText variant="small" color={Colors.textTertiary} style={sty.statLabel}>
            NEAT calories
          </AppText>
          <AppText variant="bodyBold" style={[sty.statValue, {color: Colors.accent}]}>
            {stats.totalKcal}
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>kcal</AppText>
        </View>
        <View style={sty.statCard}>
          <AppText variant="small" color={Colors.textTertiary} style={sty.statLabel}>
            Avg stress
          </AppText>
          <AppText variant="bodyBold" style={[sty.statValue, {color: stressColor(stats.avgStress)}]}>
            {stats.avgStress}
          </AppText>
          <AppText variant="small" color={Colors.textTertiary}>/ 10</AppText>
        </View>
      </View>
    </View>
  );

  /* ── Render: Active vs Sedentary ───────────────────── */

  const renderSedentaryBar = () => {
    const isSedHigh = sedentaryStats.sedPct > 50;
    return (
      <View style={sty.section}>
        <SectionHeader
          icon="\uD83E\uDDCD"
          title="Active vs Sedentary"
          subtitle="Time distribution by movement level"
        />
        <View style={sty.sedCard}>
          {/* Stacked bar */}
          <View style={sty.stackedBarWrap}>
            <View style={[sty.stackedBarActive, {flex: sedentaryStats.activePct || 1}]}>
              <AppText variant="small" style={sty.stackedBarLabel}>{sedentaryStats.activePct}%</AppText>
            </View>
            <View style={[sty.stackedBarSed, {flex: sedentaryStats.sedPct || 1}]}>
              <AppText variant="small" style={sty.stackedBarLabel}>{sedentaryStats.sedPct}%</AppText>
            </View>
          </View>
          <View style={sty.sedLegendRow}>
            <View style={sty.sedLegendItem}>
              <View style={[sty.legendDot, {backgroundColor: Colors.accent}]} />
              <AppText variant="small" color={Colors.textSecondary}>
                Active ({sedentaryStats.activeMin} min)
              </AppText>
            </View>
            <View style={sty.sedLegendItem}>
              <View style={[sty.legendDot, {backgroundColor: Colors.red}]} />
              <AppText variant="small" color={Colors.textSecondary}>
                Sedentary ({sedentaryStats.sedMin} min)
              </AppText>
            </View>
          </View>
          <View style={[sty.sedMessage, {backgroundColor: isSedHigh ? Colors.amberBg : Colors.tealBg}]}>
            <AppText
              variant="small"
              color={isSedHigh ? Colors.amberText : Colors.tealText}
              style={sty.sedMessageText}>
              {isSedHigh
                ? '\u26A0\uFE0F Sedentary time exceeds 50% — aim to reduce prolonged sitting with micro-breaks.'
                : '\u2705 Good balance — active time outweighs sedentary. Keep moving!'}
            </AppText>
          </View>
        </View>
      </View>
    );
  };

  /* ── Render: Activity Breakdown ────────────────────── */

  const renderBreakdown = () => (
    <View style={sty.section}>
      <SectionHeader
        icon="\u23F1\uFE0F"
        title="Activity Time Breakdown"
        subtitle="Duration per activity type"
      />
      <View style={sty.breakdownCard}>
        {activityBreakdown.map((item, idx) => (
          <View key={item.actId || idx} style={sty.breakdownRow}>
            <AppText style={sty.breakdownIcon}>{item.ico || '\uD83D\uDCCB'}</AppText>
            <AppText variant="small" style={sty.breakdownName} numberOfLines={1}>
              {item.name || item.actId}
            </AppText>
            <View style={sty.breakdownBarWrap}>
              <View
                style={[
                  sty.breakdownBarFill,
                  {width: `${Math.max(item.pct * 100, 4)}%`, backgroundColor: item.col || Colors.accent},
                ]}
              />
            </View>
            <AppText variant="small" color={Colors.textSecondary} style={sty.breakdownMin}>
              {item.min}m
            </AppText>
            <View style={sty.sessionBadge}>
              <AppText variant="small" style={sty.sessionBadgeText}>
                {item.sessions}x
              </AppText>
            </View>
          </View>
        ))}
      </View>
    </View>
  );

  /* ── Render: Health Risk Flags ──────────────────────── */

  const renderHealthFlags = () => {
    if (healthFlags.length === 0) return null;
    const bgMap = {amber: Colors.amberBg, green: Colors.tealBg, blue: Colors.blueBg};
    const textMap = {amber: Colors.amberText, green: Colors.tealText, blue: Colors.blueText};
    const borderMap = {amber: Colors.amber, green: Colors.accent, blue: Colors.blue};

    return (
      <View style={sty.section}>
        <SectionHeader
          icon="\uD83D\uDEA9"
          title="Health Risk Flags"
          subtitle="Insights from your activity patterns"
        />
        {healthFlags.map((flag, idx) => (
          <View
            key={idx}
            style={[
              sty.flagCard,
              {backgroundColor: bgMap[flag.type] || Colors.tealBg, borderLeftColor: borderMap[flag.type] || Colors.accent},
            ]}>
            <View style={sty.flagHeader}>
              <AppText style={sty.flagIcon}>{flag.icon}</AppText>
              <AppText
                variant="bodyBold"
                style={[sty.flagTitle, {color: textMap[flag.type] || Colors.tealText}]}>
                {flag.title}
              </AppText>
            </View>
            <AppText
              variant="small"
              style={[sty.flagMsg, {color: textMap[flag.type] || Colors.tealText}]}>
              {flag.msg}
            </AppText>
          </View>
        ))}
      </View>
    );
  };

  /* ── Render: NEAT Calorie Chart ────────────────────── */

  const renderNeatChart = () => (
    <View style={sty.section}>
      <SectionHeader
        icon="\uD83D\uDD25"
        title="NEAT Calorie Burn"
        subtitle="Last 8 sessions"
      />
      <View style={sty.chartCard}>
        <View style={sty.vertBarRow}>
          {neatChart.map((item, idx) => (
            <View key={item.id || idx} style={sty.vertBarCol}>
              <AppText variant="small" color={Colors.textTertiary} style={sty.vertBarVal}>
                {item.kcal}
              </AppText>
              <View style={sty.vertBarTrack}>
                <View
                  style={[
                    sty.vertBarFill,
                    {
                      height: `${Math.max(item.pct * 100, 5)}%`,
                      backgroundColor: item.act.col || Colors.accent,
                    },
                  ]}
                />
              </View>
              <AppText style={sty.vertBarEmoji}>{item.act.ico || '\uD83D\uDCCB'}</AppText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );

  /* ── Render: Stress Chart ──────────────────────────── */

  const renderStressChart = () => (
    <View style={sty.section}>
      <SectionHeader
        icon="\uD83E\uDDE0"
        title="Stress Level"
        subtitle="Per session"
      />
      <View style={sty.chartCard}>
        <View style={sty.vertBarRow}>
          {stressChart.map((item, idx) => (
            <View key={item.id || idx} style={sty.vertBarCol}>
              <AppText variant="small" style={[sty.vertBarVal, {color: item.color}]}>
                {item.stress}
              </AppText>
              <View style={sty.vertBarTrack}>
                <View
                  style={[
                    sty.vertBarFill,
                    {
                      height: `${Math.max(item.pct * 100, 5)}%`,
                      backgroundColor: item.color,
                    },
                  ]}
                />
              </View>
              <AppText style={sty.vertBarEmoji}>{item.act.ico || '\uD83D\uDCCB'}</AppText>
            </View>
          ))}
        </View>
        {/* Legend */}
        <View style={sty.stressLegend}>
          <View style={sty.stressLegendItem}>
            <View style={[sty.legendDot, {backgroundColor: '#16a34a'}]} />
            <AppText variant="small" color={Colors.textTertiary}>{'<4 Low'}</AppText>
          </View>
          <View style={sty.stressLegendItem}>
            <View style={[sty.legendDot, {backgroundColor: '#3b82f6'}]} />
            <AppText variant="small" color={Colors.textTertiary}>4-5 Mod</AppText>
          </View>
          <View style={sty.stressLegendItem}>
            <View style={[sty.legendDot, {backgroundColor: '#d97706'}]} />
            <AppText variant="small" color={Colors.textTertiary}>6-7 High</AppText>
          </View>
          <View style={sty.stressLegendItem}>
            <View style={[sty.legendDot, {backgroundColor: '#dc2626'}]} />
            <AppText variant="small" color={Colors.textTertiary}>8+ Severe</AppText>
          </View>
        </View>
      </View>
    </View>
  );

  /* ── Render: Session Log ───────────────────────────── */

  const renderSessionLog = () => (
    <View style={sty.section}>
      <SectionHeader
        icon="\uD83D\uDCD3"
        title="Session Log"
        subtitle="Recent activity history"
      />
      {(DEMO_HISTORY || []).map((h) => {
        const act = getAct(h.actId);
        const durH = Math.floor(h.dur / 60);
        const durM = h.dur % 60;
        const durStr = durH > 0 ? `${durH}h ${pad(durM)}m` : `${durM}m`;
        return (
          <View key={h.id} style={sty.logItem}>
            <AppText style={sty.logIcon}>{act.ico || '\uD83D\uDCCB'}</AppText>
            <View style={sty.logInfo}>
              <AppText variant="bodyBold" style={sty.logName}>{act.name || h.actId}</AppText>
              <View style={sty.logMetaRow}>
                <AppText variant="small" color={Colors.textTertiary}>{h.date}</AppText>
                <AppText variant="small" color={Colors.textTertiary}>{'\u00B7'}</AppText>
                <AppText variant="small" color={Colors.textSecondary}>{durStr}</AppText>
                <AppText variant="small" color={Colors.textTertiary}>{'\u00B7'}</AppText>
                <AppText variant="small" color={Colors.accent}>{h.kcal} kcal</AppText>
              </View>
              {/* Flags */}
              {(h.flags || []).length > 0 && (
                <View style={sty.logFlagRow}>
                  {h.flags.map((f, i) => (
                    <View key={i} style={sty.logFlagBadge}>
                      <AppText variant="small" style={sty.logFlagText}>{f}</AppText>
                    </View>
                  ))}
                </View>
              )}
            </View>
            <View style={sty.logStress}>
              <AppText
                variant="bodyBold"
                style={[sty.logStressVal, {color: stressColor(h.stress)}]}>
                {h.stress}
              </AppText>
              <AppText variant="small" color={Colors.textTertiary} style={sty.logStressLabel}>
                stress
              </AppText>
            </View>
          </View>
        );
      })}
    </View>
  );

  /* ── Render: Ayu Insight ───────────────────────────── */

  const renderAyuInsight = () => (
    <View style={sty.section}>
      <View style={sty.ayuCard}>
        <View style={sty.ayuHeader}>
          <AppText style={sty.ayuAvatar}>{'\uD83E\uDDD1\u200D\u2695\uFE0F'}</AppText>
          <View style={sty.ayuHeaderText}>
            <AppText variant="bodyBold" style={sty.ayuTitle}>Ayu Insight</AppText>
            <AppText variant="caption" style={sty.ayuSubtitle}>
              Personalized analysis for {USER.name || 'you'}
            </AppText>
          </View>
        </View>

        <View style={sty.ayuBody}>
          <AppText variant="small" style={sty.ayuBodyText}>
            {'\uD83D\uDCBB '}{USER.name}, your desk work sessions average 8 hours with extended unbroken sitting periods.
            This pattern raises risk for insulin resistance and postural strain. Breaking every 30 minutes would reduce glucose spikes by up to 25%.
          </AppText>
          <AppText variant="small" style={[sty.ayuBodyText, {marginTop: vs(8)}]}>
            {'\uD83D\uDCC9 '}Sedentary time accounts for {sedentaryStats.sedPct}% of your logged lifestyle activity.
            WHO guidelines recommend limiting continuous sitting to under 60 minutes and accumulating 150 min/week of moderate activity through daily tasks.
          </AppText>
          <AppText variant="small" style={[sty.ayuBodyText, {marginTop: vs(8)}]}>
            {'\uD83C\uDF3F '}Your gardening sessions are a strong positive — they contribute to NEAT calorie burn, lower cortisol, and improved mood.
            Consider extending these sessions or adding morning gardening as a stress buffer before desk work.
          </AppText>
          <AppText variant="small" style={[sty.ayuBodyText, {marginTop: vs(8)}]}>
            {'\uD83C\uDF19 '}Evening screen time (3 hrs) with social media use may be affecting sleep quality.
            Try shifting to non-screen activities like reading or light stretching in the last hour before bed. Enable blue-light filter after sunset.
          </AppText>
        </View>
      </View>
    </View>
  );

  /* ── Main render ───────────────────────────────────── */

  return (
    <ScrollView
      style={sty.scroll}
      contentContainerStyle={sty.scrollContent}
      showsVerticalScrollIndicator={false}>
      {renderHeadlineStats()}
      {renderSedentaryBar()}
      {renderBreakdown()}
      {renderHealthFlags()}
      {renderNeatChart()}
      {renderStressChart()}
      {renderSessionLog()}
      {renderAyuInsight()}
      <View style={sty.bottomSpacer} />
    </ScrollView>
  );
};

/* ── STYLES ──────────────────────────────────────────── */

const sty = StyleSheet.create({
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: s(16),
    paddingTop: vs(14),
    paddingBottom: vs(20),
  },

  /* Section */
  section: {
    marginBottom: vs(16),
  },
  sectionHeader: {
    marginBottom: vs(10),
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  sectionIcon: {
    fontSize: ms(16),
  },
  sectionTitle: {
    fontSize: ms(14),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  sectionSub: {
    fontSize: ms(10),
    marginTop: vs(2),
    marginLeft: s(22),
  },

  /* Headline Stats */
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  statCard: {
    width: (s(335) - s(16) * 2 - s(8)) / 2,
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(14),
    alignItems: 'center',
  },
  statLabel: {
    fontSize: ms(9),
    fontWeight: '600',
    marginBottom: vs(4),
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  statValue: {
    fontSize: ms(22),
    fontWeight: '800',
    color: Colors.textPrimary,
    marginBottom: vs(2),
  },

  /* Active vs Sedentary */
  sedCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(14),
  },
  stackedBarWrap: {
    flexDirection: 'row',
    height: vs(28),
    borderRadius: ms(14),
    overflow: 'hidden',
    marginBottom: vs(10),
  },
  stackedBarActive: {
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackedBarSed: {
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stackedBarLabel: {
    fontSize: ms(10),
    fontWeight: '700',
    color: Colors.white,
  },
  sedLegendRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: vs(10),
  },
  sedLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  legendDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  sedMessage: {
    borderRadius: ms(10),
    padding: ms(10),
  },
  sedMessageText: {
    fontSize: ms(10),
    lineHeight: ms(16),
  },

  /* Activity Breakdown */
  breakdownCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(14),
    gap: vs(10),
  },
  breakdownRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
  },
  breakdownIcon: {
    fontSize: ms(16),
    width: ms(22),
    textAlign: 'center',
  },
  breakdownName: {
    fontSize: ms(10),
    fontWeight: '600',
    color: Colors.textPrimary,
    width: s(65),
  },
  breakdownBarWrap: {
    flex: 1,
    height: vs(10),
    backgroundColor: Colors.background,
    borderRadius: ms(5),
    overflow: 'hidden',
  },
  breakdownBarFill: {
    height: '100%',
    borderRadius: ms(5),
  },
  breakdownMin: {
    fontSize: ms(10),
    fontWeight: '600',
    width: s(38),
    textAlign: 'right',
  },
  sessionBadge: {
    backgroundColor: Colors.background,
    borderRadius: ms(8),
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
  },
  sessionBadgeText: {
    fontSize: ms(9),
    fontWeight: '600',
    color: Colors.textTertiary,
  },

  /* Health Flags */
  flagCard: {
    borderRadius: ms(12),
    padding: ms(12),
    marginBottom: vs(8),
    borderLeftWidth: 3,
  },
  flagHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    marginBottom: vs(4),
  },
  flagIcon: {
    fontSize: ms(14),
  },
  flagTitle: {
    fontSize: ms(12),
    fontWeight: '700',
  },
  flagMsg: {
    fontSize: ms(10),
    lineHeight: ms(16),
  },

  /* Vertical Bar Chart (shared for NEAT + Stress) */
  chartCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(14),
  },
  vertBarRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'flex-end',
    height: vs(140),
    gap: s(2),
  },
  vertBarCol: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'flex-end',
    height: '100%',
  },
  vertBarVal: {
    fontSize: ms(8),
    fontWeight: '600',
    marginBottom: vs(4),
  },
  vertBarTrack: {
    width: '65%',
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: ms(4),
    overflow: 'hidden',
    justifyContent: 'flex-end',
  },
  vertBarFill: {
    width: '100%',
    borderRadius: ms(4),
  },
  vertBarEmoji: {
    fontSize: ms(12),
    marginTop: vs(4),
  },

  /* Stress Legend */
  stressLegend: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginTop: vs(10),
    paddingTop: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  stressLegendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },

  /* Session Log */
  logItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(12),
    marginBottom: vs(8),
    gap: s(10),
  },
  logIcon: {
    fontSize: ms(22),
    marginTop: vs(2),
  },
  logInfo: {
    flex: 1,
  },
  logName: {
    fontSize: ms(13),
    fontWeight: '700',
    color: Colors.textPrimary,
    marginBottom: vs(2),
  },
  logMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    marginBottom: vs(4),
  },
  logFlagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(4),
    marginTop: vs(2),
  },
  logFlagBadge: {
    backgroundColor: Colors.background,
    borderRadius: ms(8),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
  },
  logFlagText: {
    fontSize: ms(8),
    fontWeight: '600',
    color: Colors.textSecondary,
  },
  logStress: {
    alignItems: 'center',
    minWidth: s(36),
  },
  logStressVal: {
    fontSize: ms(18),
    fontWeight: '800',
  },
  logStressLabel: {
    fontSize: ms(8),
  },

  /* Ayu Insight */
  ayuCard: {
    backgroundColor: '#071f12',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: 'rgba(93,202,165,0.15)',
    padding: ms(14),
  },
  ayuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
    gap: s(8),
  },
  ayuAvatar: {
    fontSize: ms(22),
  },
  ayuHeaderText: {
    flex: 1,
  },
  ayuTitle: {
    fontSize: ms(13),
    fontWeight: '700',
    color: Colors.lightGreen,
  },
  ayuSubtitle: {
    fontSize: ms(10),
    color: 'rgba(255,255,255,0.5)',
  },
  ayuBody: {
    backgroundColor: 'rgba(93,202,165,0.08)',
    borderRadius: ms(10),
    padding: ms(12),
  },
  ayuBodyText: {
    fontSize: ms(10),
    color: Colors.lightGreen,
    lineHeight: ms(16),
  },

  /* Bottom spacer */
  bottomSpacer: {
    height: vs(60),
  },
});

export default AnalyticsTab;
