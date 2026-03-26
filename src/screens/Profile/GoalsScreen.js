import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';

import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import {
  GOALS_TABS,
  CURRENT_VALUES,
  OVERVIEW_SUMMARY,
  MILESTONES,
  CLINICAL_GOALS,
  NUTRITION_GOALS,
  FITNESS_GOALS,
  SLEEP_GOALS,
  LIFESTYLE_GOALS,
} from '../../constants/goalsData';

/* ─── Shared sub-components ──────────────────────────── */

const AyuRec = ({text}) => (
  <View style={st.ayuCard}>
    <View style={st.ayuAvatar}>
      <AppText style={{fontSize: ms(18)}}>🌿</AppText>
    </View>
    <View style={{flex: 1}}>
      <AppText variant="small" style={st.ayuLabel}>
        Ayu recommendation
      </AppText>
      <AppText variant="caption" style={st.ayuText}>
        {text}
      </AppText>
    </View>
  </View>
);

const ToggleRow = ({label, desc, value, onToggle}) => (
  <View style={st.toggleRow}>
    <View style={{flex: 1, marginRight: s(12)}}>
      <AppText variant="body" style={st.toggleLabel}>
        {label}
      </AppText>
      {desc ? (
        <AppText variant="caption" color={Colors.textSecondary}>
          {desc}
        </AppText>
      ) : null}
    </View>
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onToggle}
      style={[st.toggle, value ? st.toggleOn : st.toggleOff]}>
      <View
        style={[
          st.toggleThumb,
          value ? st.toggleThumbOn : st.toggleThumbOff,
        ]}
      />
    </TouchableOpacity>
  </View>
);

const statusColor = (status) => {
  if (status === 'MET') return Colors.accent;
  if (status === 'CLOSE') return Colors.amber;
  if (status === 'WORKING TOWARDS') return Colors.red;
  return Colors.textTertiary;
};

const GoalRow = ({goal, currentVal, targetVals, onChangeTarget}) => {
  const cur = currentVal !== undefined ? currentVal : null;
  const tgt = targetVals[goal.key] !== undefined ? targetVals[goal.key] : goal.value;
  const status = goal.status || (cur !== null && cur <= tgt ? 'MET' : 'WORKING TOWARDS');

  return (
    <View style={st.goalRow}>
      {/* Top row: label + current value */}
      <View style={st.goalTopRow}>
        <View style={{flex: 1}}>
          <AppText variant="body" style={st.goalLabel}>
            {goal.label}
          </AppText>
          {goal.desc ? (
            <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(16)}}>
              {goal.desc}
            </AppText>
          ) : null}
        </View>
        {cur !== null && (
          <View style={st.currentBox}>
            <AppText variant="small" color={Colors.textTertiary}>Current</AppText>
            <AppText variant="bodyBold" color={Colors.textSecondary}>{cur} {goal.unit}</AppText>
          </View>
        )}
      </View>

      {/* Stepper controls */}
      {/* Stepper for numeric goals */}
      {goal.type !== 'time' && goal.step ? (
        <View style={st.stepperWrap}>
          <TouchableOpacity
            style={st.stepperBtn}
            activeOpacity={0.6}
            onPress={() => onChangeTarget(goal.key, tgt - goal.step)}>
            <AppText variant="body" style={st.stepperBtnText}>−</AppText>
          </TouchableOpacity>

          <TextInput
            style={st.stepperInput}
            value={String(
              typeof tgt === 'number'
                ? Number.isInteger(tgt) ? tgt : tgt.toFixed(1)
                : tgt,
            )}
            keyboardType="numeric"
            onChangeText={(v) => onChangeTarget(goal.key, parseFloat(v) || 0)}
          />

          <TouchableOpacity
            style={st.stepperBtn}
            activeOpacity={0.6}
            onPress={() => onChangeTarget(goal.key, tgt + goal.step)}>
            <AppText variant="body" style={st.stepperBtnText}>+</AppText>
          </TouchableOpacity>

          <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(6)}}>
            {goal.unit}
          </AppText>
        </View>
      ) : null}

      {/* Time input for bedtime/wake goals */}
      {goal.type === 'time' ? (
        <View style={st.stepperWrap}>
          <TextInput
            style={[st.stepperInput, {width: s(90), textAlign: 'left', paddingHorizontal: s(10)}]}
            value={String(tgt)}
            onChangeText={(v) => onChangeTarget(goal.key, v)}
          />
          {goal.unit ? (
            <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(6)}}>
              {goal.unit}
            </AppText>
          ) : null}
        </View>
      ) : null}

      {/* Status badge */}
      {cur !== null && (
        <View style={[st.statusBadge, {backgroundColor: statusColor(status) + '15', marginTop: vs(6)}]}>
          <AppText
            variant="small"
            style={{fontSize: ms(9), color: statusColor(status), fontWeight: '700'}}>
            {status}
          </AppText>
        </View>
      )}
    </View>
  );
};

const GoalCard = ({section, targetVals, onChangeTarget}) => {
  const [expanded, setExpanded] = useState(false);
  const pct = section.pct || 0;

  return (
    <View style={st.card}>
      {/* Header */}
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={() => setExpanded(!expanded)}
        style={st.cardHeader}>
        <View style={[st.cardIcon, {backgroundColor: section.color + '18'}]}>
          <AppText style={{fontSize: ms(16)}}>{section.icon}</AppText>
        </View>
        <View style={{flex: 1, marginLeft: s(10)}}>
          <AppText variant="bodyBold">{section.title}</AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            {section.sub}
          </AppText>
        </View>
        {pct > 0 && (
          <AppText
            variant="small"
            color={section.color}
            style={{marginRight: s(8), fontWeight: '700'}}>
            {pct}%
          </AppText>
        )}
        <AppText
          variant="body"
          color={Colors.textTertiary}
          style={{fontSize: ms(16)}}>
          {expanded ? '⌃' : '⌄'}
        </AppText>
      </TouchableOpacity>

      {/* Progress bar */}
      {pct > 0 && (
        <View style={st.progressBar}>
          <View
            style={[
              st.progressFill,
              {width: `${pct}%`, backgroundColor: section.color},
            ]}
          />
        </View>
      )}

      {/* Expanded body */}
      {expanded && (
        <View style={st.cardBody}>
          {section.goals &&
            section.goals.map((g) => (
              <GoalRow
                key={g.key}
                goal={g}
                currentVal={CURRENT_VALUES[g.key]}
                targetVals={targetVals}
                onChangeTarget={onChangeTarget}
              />
            ))}

          {section.toggles &&
            section.toggles.map((t, i) => (
              <ToggleRow key={i} label={t} value={false} onToggle={() => {}} />
            ))}

          {section.ayu && <AyuRec text={section.ayu} />}
          {section.warning && (
            <View style={st.warningCard}>
              <AppText variant="caption" style={{color: Colors.red}}>
                ⚠️ {section.warning}
              </AppText>
            </View>
          )}
        </View>
      )}
    </View>
  );
};

/* ─── Tab content components ─────────────────────────── */

const SectionList = ({data, targetVals, onChangeTarget, intro}) => (
  <ScrollView
    style={{flex: 1}}
    contentContainerStyle={{padding: s(16), paddingBottom: vs(100)}}
    showsVerticalScrollIndicator={false}>
    {intro && <AyuRec text={intro} />}
    {Object.keys(data).map((k) => (
      <GoalCard
        key={k}
        section={data[k]}
        targetVals={targetVals}
        onChangeTarget={onChangeTarget}
      />
    ))}
  </ScrollView>
);

const OverviewTab = () => {
  const overallPct = 47;
  const totalDots = 20;
  const filledDots = Math.round((overallPct / 100) * totalDots);

  return (
    <ScrollView
      style={{flex: 1}}
      contentContainerStyle={{padding: s(16), paddingBottom: vs(100)}}
      showsVerticalScrollIndicator={false}>
      {/* Progress ring */}
      <View style={st.ringWrap}>
        <View style={st.ringContainer}>
          {Array.from({length: totalDots}).map((_, i) => {
            const angle = (i / totalDots) * 2 * Math.PI - Math.PI / 2;
            const radius = ms(52);
            const cx = radius * Math.cos(angle);
            const cy = radius * Math.sin(angle);
            const filled = i < filledDots;
            return (
              <View
                key={i}
                style={[
                  st.ringDot,
                  {
                    transform: [{translateX: cx}, {translateY: cy}],
                    backgroundColor: filled ? Colors.primary : Colors.borderLight,
                  },
                ]}
              />
            );
          })}
          <AppText variant="header" style={st.ringPct}>
            {overallPct}%
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary}>
            overall
          </AppText>
        </View>
      </View>

      {/* Summary tiles */}
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        Goal summary
      </AppText>
      <View style={st.tileGrid}>
        {OVERVIEW_SUMMARY.map((item, idx) => (
          <View key={idx} style={st.tile}>
            <View style={[st.tileDot, {backgroundColor: item.color}]} />
            <AppText variant="small" style={{fontWeight: '600'}}>
              {item.label}
            </AppText>
            <AppText variant="caption" color={item.color} style={{fontWeight: '700'}}>
              {item.current}
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              Target: {item.target}
            </AppText>
            <AppText
              variant="small"
              color={Colors.textTertiary}
              style={{fontSize: ms(9), marginTop: vs(2)}}>
              {item.trend}
            </AppText>
          </View>
        ))}
      </View>

      {/* Milestone timeline */}
      <AppText variant="bodyBold" style={{marginTop: vs(18), marginBottom: vs(10)}}>
        Milestones
      </AppText>
      {MILESTONES.map((m, i) => (
        <View key={i} style={st.milestoneRow}>
          <View style={st.milestoneTrack}>
            <View
              style={[
                st.milestoneDot,
                {
                  backgroundColor: m.done ? m.color : Colors.borderLight,
                  borderColor: m.color,
                },
              ]}
            />
            {i < MILESTONES.length - 1 && <View style={st.milestoneLine} />}
          </View>
          <View style={{flex: 1, paddingBottom: vs(14)}}>
            <AppText variant="small" color={Colors.textSecondary}>
              {m.date}
            </AppText>
            <AppText variant="body" style={{fontWeight: '600'}}>
              {m.text}
            </AppText>
            {m.sub ? (
              <AppText variant="caption" color={Colors.textTertiary}>
                {m.sub}
              </AppText>
            ) : null}
          </View>
        </View>
      ))}

      {/* Ayu rec */}
      <AyuRec text="You're making steady progress, Priya. Focus on consistency rather than perfection -- small daily wins compound over months." />
    </ScrollView>
  );
};

/* ─── Main screen ────────────────────────────────────── */

const GoalsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('overview');
  const [targetVals, setTargetVals] = useState({});

  const onChangeTarget = (key, val) => {
    setTargetVals((prev) => ({...prev, [key]: val}));
  };

  const onReset = () => setTargetVals({});

  const renderTabContent = () => {
    switch (activeTab) {
      case 'overview':
        return <OverviewTab />;
      case 'clinical':
        return (
          <SectionList
            data={CLINICAL_GOALS}
            targetVals={targetVals}
            onChangeTarget={onChangeTarget}
            intro="Ayu has set evidence-based clinical targets for Priya based on T2DM, HTN and Dyslipidaemia guidelines."
          />
        );
      case 'nutrition':
        return (
          <SectionList
            data={NUTRITION_GOALS}
            targetVals={targetVals}
            onChangeTarget={onChangeTarget}
            intro="Nutrition targets are calibrated for a 38F with T2DM, HTN and Dyslipidaemia on Metformin + Amlodipine + Atorvastatin."
          />
        );
      case 'fitness':
        return (
          <SectionList
            data={FITNESS_GOALS}
            targetVals={targetVals}
            onChangeTarget={onChangeTarget}
            intro="Fitness goals follow ADA + WHO guidelines adapted for Priya's conditions and current fitness level."
          />
        );
      case 'sleep':
        return (
          <SectionList
            data={SLEEP_GOALS}
            targetVals={targetVals}
            onChangeTarget={onChangeTarget}
            intro="Sleep targets are critical -- poor sleep raises fasting glucose by 15-25 mg/dL and increases cortisol."
          />
        );
      case 'lifestyle':
        return (
          <SectionList
            data={LIFESTYLE_GOALS}
            targetVals={targetVals}
            onChangeTarget={onChangeTarget}
            intro="Lifestyle habits are the foundation that makes clinical, nutrition, fitness and sleep goals achievable."
          />
        );
      default:
        return null;
    }
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── HEADER ─────────────────────────────────────── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity
            style={st.backBtn}
            onPress={() => navigation.goBack()}>
            <AppText variant="body" style={st.backText}>
              {'\u2039'} Profile
            </AppText>
          </TouchableOpacity>

          <View style={{flexDirection: 'row', gap: s(8)}}>
            <TouchableOpacity style={st.pillBtn} activeOpacity={0.7} onPress={onReset}>
              <AppText variant="small" style={st.pillBtnText}>
                Reset
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity style={st.pillBtn} activeOpacity={0.7}>
              <AppText variant="small" style={st.pillBtnText}>
                Save
              </AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Profile banner */}
        <View style={st.profileBanner}>
          <View style={st.avatarCircle}>
            <AppText style={{fontSize: ms(22)}}>🌿</AppText>
          </View>
          <View style={{flex: 1, marginLeft: s(12)}}>
            <AppText variant="bodyBold" style={{color: Colors.white, fontSize: ms(17)}}>
              Priya Reddy
            </AppText>
            <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)'}}>
              38F · 64 kg · 162 cm · Hyderabad
            </AppText>
          </View>
        </View>

        {/* Condition chips */}
        <View style={st.chipRow}>
          <View style={[st.chip, {backgroundColor: 'rgba(226,75,74,0.2)'}]}>
            <AppText variant="small" style={{color: '#f87171', fontSize: ms(10), fontWeight: '700'}}>
              T2DM
            </AppText>
          </View>
          <View style={[st.chip, {backgroundColor: 'rgba(186,117,23,0.2)'}]}>
            <AppText variant="small" style={{color: '#fbbf24', fontSize: ms(10), fontWeight: '700'}}>
              HTN
            </AppText>
          </View>
          <View style={[st.chip, {backgroundColor: 'rgba(108,99,255,0.2)'}]}>
            <AppText variant="small" style={{color: '#a78bfa', fontSize: ms(10), fontWeight: '700'}}>
              Dyslipidaemia
            </AppText>
          </View>
          <View style={[st.chip, {backgroundColor: 'rgba(29,158,117,0.2)'}]}>
            <AppText variant="small" style={{color: Colors.lightGreen, fontSize: ms(10), fontWeight: '700'}}>
              Ayu-managed
            </AppText>
          </View>
        </View>
      </View>

      {/* ── TAB BAR ────────────────────────────────────── */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={st.tabBarScroll}
        contentContainerStyle={st.tabBarContent}>
        {GOALS_TABS.map((tab) => {
          const isActive = activeTab === tab.key;
          return (
            <TouchableOpacity
              key={tab.key}
              style={[st.tab, isActive && st.tabActive]}
              activeOpacity={0.7}
              onPress={() => setActiveTab(tab.key)}>
              <AppText
                variant="small"
                style={[st.tabLabel, isActive && st.tabLabelActive]}>
                {tab.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* ── TAB CONTENT ────────────────────────────────── */}
      <View style={st.content}>{renderTabContent()}</View>

      {/* ── BOTTOM BAR ─────────────────────────────────── */}
      <View style={[st.bottomBar, {paddingBottom: Math.max(insets.bottom, vs(12))}]}>
        <TouchableOpacity style={st.saveAllBtn} activeOpacity={0.8}>
          <AppText variant="bodyBold" style={st.saveAllBtnText}>
            Save all goals
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

/* ── STYLES ──────────────────────────────────────────── */
const st = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  /* Header */
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: vs(14),
    paddingHorizontal: s(16),
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(10),
  },
  backBtn: {
    paddingVertical: vs(4),
    paddingRight: s(12),
  },
  backText: {
    color: Colors.white,
    fontSize: ms(15),
  },
  pillBtn: {
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    backgroundColor: 'rgba(93,202,165,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(93,202,165,0.3)',
  },
  pillBtnText: {
    color: Colors.lightGreen,
    fontSize: ms(12),
    fontWeight: '600',
  },

  /* Profile banner */
  profileBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  avatarCircle: {
    width: s(46),
    height: s(46),
    borderRadius: s(23),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Condition chips */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
  },
  chip: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(10),
  },

  /* Tab bar */
  tabBarScroll: {
    flexGrow: 0,
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  tabBarContent: {
    paddingHorizontal: s(4),
  },
  tab: {
    alignItems: 'center',
    paddingVertical: vs(10),
    paddingHorizontal: s(14),
    borderTopWidth: 2,
    borderTopColor: 'transparent',
  },
  tabActive: {
    borderTopColor: Colors.primary,
  },
  tabLabel: {
    fontSize: ms(11),
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },

  /* Content */
  content: {
    flex: 1,
  },

  /* Cards */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    marginBottom: vs(10),
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: s(14),
  },
  cardIcon: {
    width: s(36),
    height: s(36),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  cardBody: {
    paddingHorizontal: s(14),
    paddingBottom: vs(14),
  },

  /* Progress bar */
  progressBar: {
    height: vs(5),
    backgroundColor: Colors.borderLight,
    marginHorizontal: s(14),
    borderRadius: ms(3),
    marginBottom: vs(6),
  },
  progressFill: {
    height: '100%',
    borderRadius: ms(3),
  },

  /* Goal row */
  goalRow: {
    paddingVertical: vs(10),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  goalTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: vs(6),
  },
  goalLabel: {
    fontWeight: '600',
  },
  currentBox: {
    alignItems: 'flex-end',
    marginLeft: s(10),
    minWidth: s(60),
  },

  /* Stepper */
  stepperWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(2),
  },
  stepperBtn: {
    width: s(30),
    height: vs(28),
    borderRadius: ms(8),
    backgroundColor: Colors.background,
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  stepperBtnText: {
    fontSize: ms(16),
    fontWeight: '600',
    color: Colors.textPrimary,
  },
  stepperInput: {
    width: s(52),
    height: vs(28),
    borderRadius: ms(8),
    backgroundColor: Colors.background,
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    textAlign: 'center',
    fontSize: ms(12),
    fontWeight: '600',
    color: Colors.textPrimary,
    marginHorizontal: s(4),
    paddingVertical: 0,
  },

  /* Status badge */
  statusBadge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(6),
    marginLeft: s(6),
    marginTop: vs(4),
  },

  /* Toggle */
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  toggleLabel: {
    fontWeight: '600',
  },
  toggle: {
    width: s(44),
    height: vs(24),
    borderRadius: ms(12),
    justifyContent: 'center',
    paddingHorizontal: s(2),
  },
  toggleOn: {
    backgroundColor: Colors.accent,
  },
  toggleOff: {
    backgroundColor: Colors.borderLight,
  },
  toggleThumb: {
    width: s(20),
    height: s(20),
    borderRadius: s(10),
    backgroundColor: Colors.white,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },
  toggleThumbOff: {
    alignSelf: 'flex-start',
  },

  /* Ayu card */
  ayuCard: {
    flexDirection: 'row',
    backgroundColor: 'rgba(29,158,117,0.08)',
    borderRadius: ms(12),
    padding: s(12),
    marginTop: vs(10),
    alignItems: 'flex-start',
  },
  ayuAvatar: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: 'rgba(29,158,117,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  ayuLabel: {
    color: Colors.accent,
    fontWeight: '700',
    marginBottom: vs(2),
    fontSize: ms(10),
  },
  ayuText: {
    color: Colors.textPrimary,
    lineHeight: ms(18),
  },

  /* Warning card */
  warningCard: {
    backgroundColor: Colors.redBg,
    borderRadius: ms(10),
    padding: s(10),
    marginTop: vs(8),
  },

  /* Overview - Progress ring */
  ringWrap: {
    alignItems: 'center',
    marginBottom: vs(20),
  },
  ringContainer: {
    width: ms(130),
    height: ms(130),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringDot: {
    position: 'absolute',
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
  },
  ringPct: {
    fontSize: ms(28),
    fontWeight: '800',
    color: Colors.primary,
  },

  /* Overview - Tiles */
  tileGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
    marginBottom: vs(10),
  },
  tile: {
    width: '47%',
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(12),
  },
  tileDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    marginBottom: vs(6),
  },

  /* Overview - Milestones */
  milestoneRow: {
    flexDirection: 'row',
  },
  milestoneTrack: {
    width: s(24),
    alignItems: 'center',
  },
  milestoneDot: {
    width: ms(12),
    height: ms(12),
    borderRadius: ms(6),
    borderWidth: 2,
  },
  milestoneLine: {
    flex: 1,
    width: 1,
    backgroundColor: Colors.borderLight,
  },

  /* Bottom bar */
  bottomBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: s(16),
    paddingTop: vs(12),
  },
  saveAllBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(13),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  saveAllBtnText: {
    color: Colors.white,
    fontSize: ms(15),
  },
});

export default GoalsScreen;
