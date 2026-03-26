import React, {useState, useRef, useEffect, useCallback, useMemo} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {
  LIFESTYLE_ACTIVITIES,
  LIFESTYLE_FORMS,
  USER,
} from '../../../constants/lifestyleData';

/* ─── Helpers ──────────────────────────────────────────────── */

const pad = (n) => String(n).padStart(2, '0');

const formatElapsed = (ms_) => {
  const totalSec = Math.floor(ms_ / 1000);
  const h = Math.floor(totalSec / 3600);
  const m = Math.floor((totalSec % 3600) / 60);
  const sec = totalSec % 60;
  if (h > 0) return `${h}h ${pad(m)}m ${pad(sec)}s`;
  return `${pad(m)}m ${pad(sec)}s`;
};

const calcCalories = (met, weightKg, durationMin) =>
  Math.round(met * weightKg * (durationMin / 60));

const nowTimeStr = () => {
  const d = new Date();
  return `${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

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

/* ─── Field Input ──────────────────────────────────────────── */

const FieldInput = ({field, value, onChange}) => {
  if (!field) return null;

  if (field.type === 'sel') {
    return (
      <View style={sty.fieldWrap}>
        <AppText variant="caption" color={Colors.textSecondary} style={sty.fieldLabel}>
          {field.lbl}
        </AppText>
        <View style={sty.chipRow}>
          {(field.opts || []).map((opt, i) => {
            const isActive = value === opt;
            return (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                style={[sty.chip, isActive && sty.chipActive]}
                onPress={() => onChange(opt)}>
                <AppText
                  variant="small"
                  style={[sty.chipText, isActive && sty.chipTextActive]}>
                  {opt}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>
    );
  }

  return (
    <View style={sty.fieldWrap}>
      <AppText variant="caption" color={Colors.textSecondary} style={sty.fieldLabel}>
        {field.lbl}
      </AppText>
      <TextInput
        style={sty.fieldInput}
        value={value != null ? String(value) : ''}
        onChangeText={onChange}
        placeholder={field.ph || (field.val != null ? String(field.val) : '')}
        placeholderTextColor={Colors.textTertiary}
        keyboardType={field.type === 'number' ? 'numeric' : 'default'}
      />
    </View>
  );
};

/* ─── Main Component ───────────────────────────────────────── */

const LogTab = ({onSave}) => {
  /* ── State ─────────────────────────────────────────── */
  const [selectedActivity, setSelectedActivity] = useState(null);
  const [formValues, setFormValues] = useState({});

  // Session timer
  const [timerRunning, setTimerRunning] = useState(false);
  const [timerStart, setTimerStart] = useState(null);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  // Time display
  const [startTimeStr, setStartTimeStr] = useState('--:--');
  const [endTimeStr, setEndTimeStr] = useState('--:--');

  // Manual time
  const [showManualTime, setShowManualTime] = useState(false);
  const [manualMin, setManualMin] = useState('');

  // Notes
  const [notes, setNotes] = useState('');

  const scrollRef = useRef(null);

  /* ── Derived ───────────────────────────────────────── */
  const activityObj = useMemo(
    () => (LIFESTYLE_ACTIVITIES || []).find((a) => a.id === selectedActivity) || null,
    [selectedActivity],
  );

  const formDef = useMemo(
    () => (selectedActivity ? (LIFESTYLE_FORMS || {})[selectedActivity] : null),
    [selectedActivity],
  );

  const durationMin = useMemo(() => {
    if (showManualTime && manualMin) return parseInt(manualMin, 10) || 0;
    return Math.floor(elapsed / 60000);
  }, [showManualTime, manualMin, elapsed]);

  const estCalories = useMemo(
    () =>
      activityObj
        ? calcCalories(activityObj.met, USER.weightKg || 64, durationMin)
        : 0,
    [activityObj, durationMin],
  );

  /* ── Key functions ─────────────────────────────────── */

  const selectActivity = useCallback((id) => {
    setSelectedActivity(id);
    setFormValues({});
  }, []);

  const updateFormField = useCallback((fieldId, value) => {
    setFormValues((prev) => ({...prev, [fieldId]: value}));
  }, []);

  // Timer controls
  const startTimer = useCallback(() => {
    const now = Date.now();
    setTimerStart(now);
    setTimerRunning(true);
    setStartTimeStr(nowTimeStr());
    setEndTimeStr('--:--');
  }, []);

  const stopTimer = useCallback(() => {
    setTimerRunning(false);
    setEndTimeStr(nowTimeStr());
    if (timerRef.current) clearInterval(timerRef.current);
  }, []);

  useEffect(() => {
    if (timerRunning && timerStart) {
      timerRef.current = setInterval(() => {
        setElapsed(Date.now() - timerStart);
      }, 1000);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [timerRunning, timerStart]);

  /* ── Save handler ──────────────────────────────────── */
  const handleSave = useCallback(() => {
    if (!activityObj) return;
    const payload = {
      activityId: selectedActivity,
      activityName: activityObj.name,
      met: activityObj.met,
      durationMin,
      formValues,
      estCalories,
      notes,
      timestamp: new Date().toISOString(),
    };
    onSave?.(payload);
  }, [activityObj, selectedActivity, durationMin, formValues, estCalories, notes, onSave]);

  /* ── Render: Activity Grid ─────────────────────────── */

  const renderActivityGrid = () => (
    <View style={sty.section}>
      <SectionHeader
        title="Select Activity"
      />
      <View style={sty.actGrid}>
        {(LIFESTYLE_ACTIVITIES || []).map((act) => {
          const isActive = selectedActivity === act.id;
          return (
            <TouchableOpacity
              key={act.id}
              activeOpacity={0.7}
              style={[
                sty.actCard,
                isActive && {borderColor: act.col, backgroundColor: act.col + '10'},
              ]}
              onPress={() => selectActivity(act.id)}>
              <AppText style={sty.actIcon}>{act.ico}</AppText>
              <AppText
                variant="small"
                numberOfLines={1}
                style={[sty.actName, isActive && {color: act.col, fontWeight: '700'}]}>
                {act.name}
              </AppText>
              <AppText
                variant="small"
                color={isActive ? act.col : Colors.textTertiary}
                style={sty.actCat}>
                {act.cat}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  /* ── Render: Dynamic Form ──────────────────────────── */

  const renderDynamicForm = () => {
    if (!activityObj || !formDef) return null;

    return (
      <View style={sty.section}>
        {/* Activity badge */}
        <View style={sty.actBadge}>
          <AppText style={sty.actBadgeIcon}>{activityObj.ico}</AppText>
          <View style={sty.actBadgeInfo}>
            <AppText variant="bodyBold" style={sty.actBadgeName}>
              {activityObj.name}
            </AppText>
            <View style={sty.actBadgeMeta}>
              <AppText variant="small" color={Colors.textTertiary}>
                {activityObj.cat}
              </AppText>
              <View style={sty.metBadge}>
                <AppText variant="small" style={sty.metBadgeText}>
                  {activityObj.met} MET
                </AppText>
              </View>
            </View>
          </View>
          {durationMin > 0 && (
            <View style={sty.calPreview}>
              <AppText variant="bodyBold" color={Colors.accent} style={sty.calNumber}>
                {estCalories}
              </AppText>
              <AppText variant="small" color={Colors.textTertiary}>kcal</AppText>
            </View>
          )}
        </View>

        {/* Layers */}
        {(formDef.layers || []).map((layer, layerIdx) => (
          <View key={layerIdx} style={sty.layerCard}>
            {/* Layer header */}
            <View style={sty.layerHeader}>
              <AppText style={sty.layerIcon}>{layer.ico}</AppText>
              <View style={sty.layerHeaderText}>
                <AppText variant="bodyBold" style={sty.layerTitle}>{layer.t}</AppText>
                <AppText variant="caption" color={Colors.textTertiary}>{layer.s}</AppText>
              </View>
            </View>

            {/* Session timer in first layer */}
            {layerIdx === 0 && (
              <View style={sty.timerCard}>
                <AppText variant="caption" color={Colors.textSecondary} style={sty.timerLabel}>
                  SESSION TIMER
                </AppText>
                <AppText style={sty.timerDisplay}>{formatElapsed(elapsed)}</AppText>

                {/* Time display grid */}
                <View style={sty.timeGrid}>
                  <View style={sty.timeGridItem}>
                    <AppText variant="small" color={Colors.textTertiary}>Start</AppText>
                    <AppText variant="bodyBold" color={Colors.textPrimary}>{startTimeStr}</AppText>
                  </View>
                  <View style={sty.timeGridItem}>
                    <AppText variant="small" color={Colors.textTertiary}>End</AppText>
                    <AppText variant="bodyBold" color={Colors.textPrimary}>{endTimeStr}</AppText>
                  </View>
                  <View style={sty.timeGridItem}>
                    <AppText variant="small" color={Colors.textTertiary}>Duration</AppText>
                    <AppText variant="bodyBold" color={Colors.accent}>{durationMin} min</AppText>
                  </View>
                  <View style={sty.timeGridItem}>
                    <AppText variant="small" color={Colors.textTertiary}>kcal</AppText>
                    <AppText variant="bodyBold" color={Colors.accent}>{estCalories}</AppText>
                  </View>
                </View>

                {/* Timer buttons */}
                <View style={sty.timerBtnRow}>
                  {!timerRunning ? (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={sty.timerBtnStart}
                      onPress={startTimer}>
                      <AppText variant="bodyBold" color={Colors.white}>Start</AppText>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      activeOpacity={0.7}
                      style={sty.timerBtnStop}
                      onPress={stopTimer}>
                      <AppText variant="bodyBold" color={Colors.white}>End</AppText>
                    </TouchableOpacity>
                  )}
                </View>

                {/* Manual time toggle */}
                <TouchableOpacity
                  activeOpacity={0.7}
                  style={sty.manualToggle}
                  onPress={() => setShowManualTime(!showManualTime)}>
                  <AppText variant="caption" color={Colors.accent}>
                    {showManualTime ? 'Hide manual entry' : 'Enter time manually'}
                  </AppText>
                </TouchableOpacity>

                {showManualTime && (
                  <View style={sty.manualTimeRow}>
                    <View style={sty.manualTimeField}>
                      <AppText variant="small" color={Colors.textTertiary}>Total min</AppText>
                      <TextInput
                        style={sty.manualInput}
                        value={manualMin}
                        onChangeText={setManualMin}
                        placeholder="0"
                        placeholderTextColor={Colors.textTertiary}
                        keyboardType="numeric"
                      />
                    </View>
                  </View>
                )}
              </View>
            )}

            {/* Form fields — layer.f is array of arrays */}
            {(layer.f || []).map((row, rIdx) => (
              <View key={rIdx} style={sty.formRow}>
                {(Array.isArray(row) ? row : [row]).map((field, fIdx) => (
                  <FieldInput
                    key={field?.id || fIdx}
                    field={field}
                    value={formValues[field?.id] != null ? formValues[field?.id] : ''}
                    onChange={(val) => field?.id && updateFormField(field.id, val)}
                  />
                ))}
              </View>
            ))}
          </View>
        ))}

        {/* Ayu Intelligence section */}
        <View style={sty.ayuCard}>
          <View style={sty.ayuHeader}>
            <AppText style={sty.ayuAvatar}>{'\uD83E\uDDD1\u200D\u2695\uFE0F'}</AppText>
            <View style={sty.ayuHeaderText}>
              <AppText variant="bodyBold" style={sty.ayuTitle}>Ayu Intelligence</AppText>
              <AppText variant="caption" style={sty.ayuSubtitle}>Clinical insight</AppText>
            </View>
          </View>

          {formDef.tip && (
            <View style={sty.ayuTipCard}>
              <AppText variant="small" style={sty.ayuTipText}>
                {'\uD83D\uDCA1 '}{formDef.tip}
              </AppText>
            </View>
          )}

          <AppText variant="caption" style={sty.ayuNotesLabel}>Session notes</AppText>
          <TextInput
            style={sty.notesInput}
            value={notes}
            onChangeText={setNotes}
            placeholder="Add any observations, symptoms, or notes..."
            placeholderTextColor={Colors.textTertiary}
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>
      </View>
    );
  };

  /* ── Main render ───────────────────────────────────── */

  return (
    <ScrollView
      ref={scrollRef}
      style={sty.scroll}
      contentContainerStyle={sty.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">
      {renderActivityGrid()}
      {renderDynamicForm()}
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

  /* Activity Grid */
  actGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  actCard: {
    width: (s(335) - s(16) * 2 - s(8) * 2) / 3,
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    paddingVertical: vs(10),
    paddingHorizontal: s(4),
  },
  actIcon: {
    fontSize: ms(24),
    marginBottom: vs(4),
  },
  actName: {
    fontSize: ms(9),
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
  },
  actCat: {
    fontSize: ms(7),
    marginTop: vs(2),
    textAlign: 'center',
  },

  /* Activity Badge */
  actBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(12),
    marginBottom: vs(12),
  },
  actBadgeIcon: {
    fontSize: ms(28),
    marginRight: s(10),
  },
  actBadgeInfo: {
    flex: 1,
  },
  actBadgeName: {
    fontSize: ms(14),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  actBadgeMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginTop: vs(2),
  },
  metBadge: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(8),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
  },
  metBadgeText: {
    fontSize: ms(9),
    fontWeight: '700',
    color: Colors.tealText,
  },
  calPreview: {
    alignItems: 'center',
  },
  calNumber: {
    fontSize: ms(20),
    fontWeight: '800',
  },

  /* Layer card */
  layerCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(14),
    marginBottom: vs(10),
  },
  layerHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
    gap: s(8),
  },
  layerIcon: {
    fontSize: ms(20),
  },
  layerHeaderText: {
    flex: 1,
  },
  layerTitle: {
    fontSize: ms(13),
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  /* Timer */
  timerCard: {
    backgroundColor: Colors.background,
    borderRadius: ms(12),
    padding: ms(12),
    marginBottom: vs(12),
    alignItems: 'center',
  },
  timerLabel: {
    fontSize: ms(9),
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: vs(6),
  },
  timerDisplay: {
    fontSize: ms(32),
    fontWeight: '800',
    color: Colors.primary,
    marginBottom: vs(8),
  },
  timeGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    width: '100%',
    marginBottom: vs(10),
    gap: s(4),
  },
  timeGridItem: {
    alignItems: 'center',
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(8),
    paddingVertical: vs(6),
    paddingHorizontal: s(4),
  },
  timerBtnRow: {
    flexDirection: 'row',
    gap: s(10),
    marginBottom: vs(8),
  },
  timerBtnStart: {
    backgroundColor: Colors.accent,
    borderRadius: ms(20),
    paddingVertical: vs(10),
    paddingHorizontal: s(36),
    alignItems: 'center',
  },
  timerBtnStop: {
    backgroundColor: Colors.red,
    borderRadius: ms(20),
    paddingVertical: vs(10),
    paddingHorizontal: s(36),
    alignItems: 'center',
  },
  manualToggle: {
    paddingVertical: vs(4),
  },
  manualTimeRow: {
    flexDirection: 'row',
    gap: s(10),
    marginTop: vs(8),
    width: '100%',
    justifyContent: 'center',
  },
  manualTimeField: {
    alignItems: 'center',
    width: s(100),
  },
  manualInput: {
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(10),
    paddingVertical: Platform.OS === 'ios' ? vs(10) : vs(6),
    fontSize: ms(14),
    fontWeight: '600',
    color: Colors.textPrimary,
    textAlign: 'center',
    width: '100%',
    marginTop: vs(4),
  },

  /* Form fields */
  formRow: {
    flexDirection: 'row',
    gap: s(10),
    marginBottom: vs(10),
  },
  fieldWrap: {
    flex: 1,
  },
  fieldLabel: {
    fontSize: ms(10),
    fontWeight: '600',
    marginBottom: vs(4),
  },
  fieldInput: {
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(10),
    paddingVertical: Platform.OS === 'ios' ? vs(10) : vs(6),
    fontSize: ms(13),
    color: Colors.textPrimary,
  },

  /* Chip select */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
  },
  chip: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
  },
  chipActive: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.accent,
  },
  chipText: {
    fontSize: ms(10),
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  chipTextActive: {
    color: Colors.primary,
    fontWeight: '700',
  },

  /* Ayu Intelligence */
  ayuCard: {
    backgroundColor: '#071f12',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: 'rgba(93,202,165,0.15)',
    padding: ms(14),
    marginBottom: vs(10),
  },
  ayuHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
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
  ayuTipCard: {
    backgroundColor: 'rgba(93,202,165,0.08)',
    borderRadius: ms(10),
    padding: ms(12),
    marginBottom: vs(10),
    borderLeftWidth: 3,
    borderLeftColor: Colors.accent,
  },
  ayuTipText: {
    fontSize: ms(10),
    color: Colors.lightGreen,
    lineHeight: ms(16),
  },
  ayuNotesLabel: {
    fontSize: ms(10),
    fontWeight: '600',
    color: 'rgba(255,255,255,0.5)',
    marginBottom: vs(6),
  },
  notesInput: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: 'rgba(93,202,165,0.15)',
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    fontSize: ms(12),
    color: Colors.white,
    minHeight: vs(80),
  },

  /* Bottom spacer */
  bottomSpacer: {
    height: vs(60),
  },
});

export default LogTab;
