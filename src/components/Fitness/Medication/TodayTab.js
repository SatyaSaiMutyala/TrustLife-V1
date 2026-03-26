import React, {useMemo, useCallback, useState} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  Modal,
  TextInput,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import {useNavigation} from '@react-navigation/native';

import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';

/* ─── Constants ─────────────────────────────────────── */

const RING_SIZE = ms(170);
const DOT_COUNT = 30;

const PERIOD_MAP = {
  '07:00': 'Morning',
  '08:00': 'Morning',
  '09:00': 'Morning',
  '12:00': 'Afternoon',
  '13:00': 'Afternoon',
  '14:00': 'Afternoon',
  '17:00': 'Evening',
  '18:00': 'Evening',
  '19:00': 'Evening',
  '20:00': 'Evening',
  '21:00': 'Night',
  '22:00': 'Night',
  '23:00': 'Night',
};

const STATUS_CONFIG = {
  taken: {label: 'Taken', color: Colors.accent, bg: Colors.tealBg, ico: '\u2713'},
  pending: {label: 'Pending', color: Colors.amber, bg: Colors.amberBg, ico: '\u23F3'},
  missed: {label: 'Missed', color: Colors.red, bg: Colors.redBg, ico: '\u2717'},
  upcoming: {label: 'Upcoming', color: Colors.blue, bg: Colors.blueBg, ico: '\uD83D\uDD52'},
};

/* ─── Helpers ───────────────────────────────────────── */

const clamp01 = (v) => Math.min(1, Math.max(0, v));

const fmt24to12 = (t24) => {
  const [h, m] = t24.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
};

const getPeriod = (t24) => PERIOD_MAP[t24] || 'Other';

const periodEmoji = (p) => {
  if (p === 'Morning') return '\uD83C\uDF05';
  if (p === 'Afternoon') return '\u2600\uFE0F';
  if (p === 'Evening') return '\uD83C\uDF07';
  if (p === 'Night') return '\uD83C\uDF19';
  return '\uD83D\uDD52';
};

/* ─── Component ─────────────────────────────────────── */

const TodayTab = ({meds, setMeds}) => {
  const navigation = useNavigation();

  /* Refill bottom sheet state */
  const [refillSheet, setRefillSheet] = useState({visible: false, med: null});
  const [showRefillForm, setShowRefillForm] = useState(false);
  const [refillForm, setRefillForm] = useState({qty: '', store: '', cost: '', date: ''});

  const openRefillSheet = (med) => {
    setRefillSheet({visible: true, med});
    setShowRefillForm(false);
    setRefillForm({qty: '', store: '', cost: '', date: ''});
  };
  const closeRefillSheet = () => {
    setRefillSheet({visible: false, med: null});
    setShowRefillForm(false);
  };
  const handleRefillSave = () => {
    // Save logic placeholder
    closeRefillSheet();
  };
  // ── Flatten all doses ────────────────────────────────
  const allDoses = useMemo(() => {
    const doses = [];
    meds.forEach((med) => {
      med.times.forEach((dose, idx) => {
        doses.push({
          medId: med.id,
          doseIdx: idx,
          time: dose.t,
          time12: fmt24to12(dose.t),
          period: getPeriod(dose.t),
          label: dose.label,
          taken: dose.taken,
          med,
        });
      });
    });
    return doses.sort((a, b) => a.time.localeCompare(b.time));
  }, [meds]);

  // ── Stats ────────────────────────────────────────────
  const stats = useMemo(() => {
    const total = allDoses.length;
    const taken = allDoses.filter((d) => d.taken).length;
    const now = new Date();
    const nowStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    const pending = allDoses.filter((d) => !d.taken && d.time >= nowStr).length;
    const missed = total - taken - pending;
    const pct = total > 0 ? Math.round((taken / total) * 100) : 0;
    return {total, taken, pending, missed, pct};
  }, [allDoses]);

  // ── Next upcoming dose ───────────────────────────────
  const nextDose = useMemo(() => {
    const now = new Date();
    const nowStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    return allDoses.find((d) => !d.taken && d.time >= nowStr) || null;
  }, [allDoses]);

  // ── Time-grouped schedule ────────────────────────────
  const timeGroups = useMemo(() => {
    const groups = {};
    allDoses.forEach((dose) => {
      const key = dose.time;
      if (!groups[key]) {
        groups[key] = {
          time: key,
          time12: dose.time12,
          period: dose.period,
          doses: [],
        };
      }
      groups[key].doses.push(dose);
    });
    return Object.values(groups).sort((a, b) => a.time.localeCompare(b.time));
  }, [allDoses]);

  // ── Refill alerts ────────────────────────────────────
  const refillAlerts = useMemo(() => {
    return meds
      .filter((m) => m.refillDays <= 7)
      .sort((a, b) => a.refillDays - b.refillDays);
  }, [meds]);

  // ── Mark taken ───────────────────────────────────────
  const markTaken = useCallback(
    (medId, doseIdx) => {
      setMeds((prev) =>
        prev.map((m) =>
          m.id === medId
            ? {
                ...m,
                times: m.times.map((t, i) =>
                  i === doseIdx ? {...t, taken: true} : t,
                ),
              }
            : m,
        ),
      );
    },
    [setMeds],
  );

  // ── Get dose status label ────────────────────────────
  const getDoseStatus = useCallback((dose) => {
    if (dose.taken) return 'taken';
    const now = new Date();
    const nowStr = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    if (dose.time < nowStr) return 'missed';
    // Within 1 hour of scheduled time = upcoming
    const [dh, dm] = dose.time.split(':').map(Number);
    const doseMin = dh * 60 + dm;
    const nowMin = now.getHours() * 60 + now.getMinutes();
    if (doseMin - nowMin <= 60 && doseMin - nowMin >= 0) return 'upcoming';
    return 'pending';
  }, []);

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>

      {/* ── 1. DAILY PROGRESS RING ──────────────────────── */}
      <View style={styles.card}>
        <View style={styles.ringRow}>
          {/* Dot-segment ring */}
          <View style={styles.ringOuter}>
            {Array.from({length: DOT_COUNT}).map((_, i) => {
              const filled = i < Math.round((stats.pct / 100) * DOT_COUNT);
              const angle = (i / DOT_COUNT) * 360 - 90;
              const r = (RING_SIZE - ms(14)) / 2;
              const cx = RING_SIZE / 2 + r * Math.cos((angle * Math.PI) / 180) - ms(5);
              const cy = RING_SIZE / 2 + r * Math.sin((angle * Math.PI) / 180) - ms(5);
              const dotColor = filled ? Colors.primary : Colors.borderLight;
              return (
                <View
                  key={i}
                  style={{
                    position: 'absolute',
                    left: cx,
                    top: cy,
                    width: ms(10),
                    height: ms(10),
                    borderRadius: ms(5),
                    backgroundColor: dotColor,
                  }}
                />
              );
            })}
            <View style={styles.ringInner}>
              <AppText variant="header" style={styles.ringPct}>
                {stats.pct}%
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                taken today
              </AppText>
            </View>
          </View>

          {/* Stat grid */}
          <View style={styles.statGrid}>
            <View style={[styles.statItem, {backgroundColor: Colors.tealBg}]}>
              <AppText variant="header" color={Colors.accent} style={styles.statNum}>
                {stats.taken}
              </AppText>
              <AppText variant="small" color={Colors.tealText}>Taken</AppText>
            </View>
            <View style={[styles.statItem, {backgroundColor: Colors.amberBg}]}>
              <AppText variant="header" color={Colors.amber} style={styles.statNum}>
                {stats.pending}
              </AppText>
              <AppText variant="small" color={Colors.amberText}>Pending</AppText>
            </View>
            <View style={[styles.statItem, {backgroundColor: Colors.redBg}]}>
              <AppText variant="header" color={Colors.red} style={styles.statNum}>
                {stats.missed}
              </AppText>
              <AppText variant="small" color={Colors.redText}>Missed</AppText>
            </View>
          </View>
        </View>
      </View>

      {/* ── 2. UPCOMING ALERT ───────────────────────────── */}
      {nextDose && (
        <View style={[styles.card, styles.upcomingCard]}>
          <View style={styles.upcomingHeader}>
            <View style={styles.upcomingLeft}>
              <AppText variant="small" color={Colors.blueText} style={styles.upcomingLabel}>
                {'\uD83D\uDD52'} NEXT UP
              </AppText>
              <AppText variant="bodyBold" color={Colors.blueText}>
                {nextDose.med.ico} {nextDose.med.name} {nextDose.med.dose}
              </AppText>
              <AppText variant="caption" color={Colors.blue}>
                {nextDose.time12} {'\u00B7'} {nextDose.label}
              </AppText>
            </View>
            <TouchableOpacity
              style={styles.markTakenBtn}
              activeOpacity={0.8}
              onPress={() => markTaken(nextDose.medId, nextDose.doseIdx)}>
              <AppText variant="bodyBold" color={Colors.white}>
                Mark taken
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* ── 3. TIME-GROUPED SCHEDULE ────────────────────── */}
      <AppText variant="bodyBold" style={styles.sectionHeading}>
        Today's Schedule
      </AppText>

      {timeGroups.map((group) => (
        <View key={group.time} style={styles.card}>
          {/* Time header */}
          <View style={styles.timeHeader}>
            <AppText style={styles.timeEmoji}>{periodEmoji(group.period)}</AppText>
            <View>
              <AppText variant="bodyBold">{group.time12}</AppText>
              <AppText variant="small" color={Colors.textTertiary}>{group.period}</AppText>
            </View>
          </View>

          {/* Med cards in this time slot */}
          {group.doses.map((dose, idx) => {
            const status = getDoseStatus(dose);
            const cfg = STATUS_CONFIG[status];
            return (
              <View
                key={`${dose.medId}-${dose.doseIdx}`}
                style={[
                  styles.doseCard,
                  idx > 0 && styles.doseCardBorder,
                ]}>
                <View style={styles.doseTop}>
                  <AppText style={styles.doseEmoji}>{dose.med.ico}</AppText>
                  <View style={styles.doseInfo}>
                    <AppText variant="bodyBold" numberOfLines={1}>
                      {dose.med.name}
                    </AppText>
                    <AppText variant="caption" color={Colors.textSecondary}>
                      {dose.med.dose} {'\u00B7'} {dose.med.form}
                    </AppText>
                    <View style={styles.doseMeta}>
                      {dose.med.withFood && (
                        <View style={[styles.metaChip, {backgroundColor: Colors.amberBg}]}>
                          <AppText variant="small" color={Colors.amberText}>
                            {'\uD83C\uDF5C'} With food
                          </AppText>
                        </View>
                      )}
                      <View style={[styles.metaChip, {backgroundColor: `${dose.med.col}15`}]}>
                        <AppText variant="small" color={dose.med.col}>
                          {dose.med.category}
                        </AppText>
                      </View>
                    </View>
                  </View>

                  {/* Status / action */}
                  <View style={styles.doseAction}>
                    {status === 'taken' ? (
                      <View style={[styles.statusBadge, {backgroundColor: cfg.bg}]}>
                        <AppText variant="small" color={cfg.color}>
                          {cfg.ico} {cfg.label}
                        </AppText>
                      </View>
                    ) : status === 'missed' ? (
                      <View style={[styles.statusBadge, {backgroundColor: cfg.bg}]}>
                        <AppText variant="small" color={cfg.color}>
                          {cfg.ico} {cfg.label}
                        </AppText>
                      </View>
                    ) : (
                      <TouchableOpacity
                        style={styles.takeBtn}
                        activeOpacity={0.8}
                        onPress={() => markTaken(dose.medId, dose.doseIdx)}>
                        <AppText variant="small" color={Colors.white}>
                          Mark taken
                        </AppText>
                      </TouchableOpacity>
                    )}
                  </View>
                </View>

                {/* Dose label / note */}
                {dose.label ? (
                  <AppText variant="small" color={Colors.textTertiary} style={styles.doseNote}>
                    {dose.label}
                  </AppText>
                ) : null}
              </View>
            );
          })}
        </View>
      ))}

      {/* ── 4. REFILL ALERTS ────────────────────────────── */}
      {refillAlerts.length > 0 && (
        <>
          <AppText variant="bodyBold" style={styles.sectionHeading}>
            {'\uD83D\uDCE6'} Refill Alerts
          </AppText>

          {refillAlerts.map((med) => {
            const urgent = med.refillDays <= 3;
            const bgColor = urgent ? Colors.redBg : Colors.amberBg;
            const textColor = urgent ? Colors.redText : Colors.amberText;
            const borderColor = urgent ? Colors.red : Colors.amber;
            const remaining = med.totalStock - med.usedStock;
            const stockRatio = clamp01(remaining / med.totalStock);

            return (
              <TouchableOpacity
                key={med.id}
                activeOpacity={0.85}
                onPress={() => openRefillSheet(med)}
                style={[styles.card, {borderLeftWidth: ms(3), borderLeftColor: borderColor}]}>
                <View style={styles.refillHeader}>
                  <View style={styles.refillLeft}>
                    <AppText variant="bodyBold">
                      {med.ico} {med.name}
                    </AppText>
                    <AppText variant="caption" color={Colors.textSecondary}>
                      {med.dose} {'\u00B7'} {med.form}
                    </AppText>
                  </View>
                  <View style={[styles.refillBadge, {backgroundColor: bgColor}]}>
                    <AppText variant="small" color={textColor}>
                      {urgent ? '\u26A0\uFE0F Urgent' : '\u23F3 Soon'} {'\u00B7'} {med.refillDays}d left
                    </AppText>
                  </View>
                </View>

                {/* Stock bar */}
                <View style={styles.stockRow}>
                  <AppText variant="small" color={Colors.textTertiary}>
                    {remaining} of {med.totalStock} remaining
                  </AppText>
                </View>
                <View style={styles.stockTrack}>
                  <View
                    style={[
                      styles.stockFill,
                      {
                        width: `${stockRatio * 100}%`,
                        backgroundColor: urgent ? Colors.red : Colors.amber,
                      },
                    ]}
                  />
                </View>

                <View style={[styles.refillBtn, {borderColor}]}>
                  <AppText variant="small" color={textColor}>
                    {'\uD83D\uDED2'} Order refill
                  </AppText>
                </View>
              </TouchableOpacity>
            );
          })}
        </>
      )}

      {/* ── Daily summary ───────────────────────────────── */}
      <View style={[styles.card, styles.summaryCard]}>
        <AppText variant="bodyBold" color={Colors.primary}>
          {'\uD83D\uDCCB'} Daily Summary
        </AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={styles.summaryText}>
          {stats.taken} of {stats.total} doses taken today.
          {stats.missed > 0
            ? ` ${stats.missed} dose${stats.missed > 1 ? 's' : ''} missed.`
            : ' No missed doses so far \u2014 keep it up!'}
        </AppText>
        {stats.pct >= 80 && (
          <View style={[styles.summaryBadge, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="small" color={Colors.tealText}>
              {'\u2B50'} Great adherence today!
            </AppText>
          </View>
        )}
      </View>

      <View style={styles.bottomSpacer} />

      {/* ── REFILL BOTTOM SHEET ──────────────────────────── */}
      <Modal
        visible={refillSheet.visible}
        transparent
        animationType="slide"
        onRequestClose={closeRefillSheet}>
        <TouchableOpacity
          style={styles.sheetOverlay}
          activeOpacity={1}
          onPress={closeRefillSheet}>
          <KeyboardAvoidingView
            behavior={Platform.OS === 'ios' ? 'padding' : undefined}
            style={styles.sheetWrap}>
            <TouchableOpacity activeOpacity={1} style={styles.sheetContent}>
              {/* Handle bar */}
              <View style={styles.sheetHandle} />
              <AppText variant="bodyBold" style={{marginBottom: vs(6)}}>
                {refillSheet.med?.ico} {refillSheet.med?.name} Refill
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(14)}}>
                {refillSheet.med?.dose} {'\u00B7'} {refillSheet.med?.refillDays} days remaining
              </AppText>

              {!showRefillForm ? (
                <>
                  <TouchableOpacity
                    style={styles.sheetOption}
                    activeOpacity={0.8}
                    onPress={() => {
                      closeRefillSheet();
                      navigation.navigate('MedicineSearch');
                    }}>
                    <AppText style={{fontSize: ms(18), marginRight: s(10)}}>
                      {'\uD83D\uDED2'}
                    </AppText>
                    <View style={{flex: 1}}>
                      <AppText variant="bodyBold" color={Colors.primary}>Order online</AppText>
                      <AppText variant="small" color={Colors.textTertiary}>
                        Search and order medicines
                      </AppText>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.sheetOption}
                    activeOpacity={0.8}
                    onPress={() => setShowRefillForm(true)}>
                    <AppText style={{fontSize: ms(18), marginRight: s(10)}}>
                      {'\uD83C\uDFEA'}
                    </AppText>
                    <View style={{flex: 1}}>
                      <AppText variant="bodyBold" color={Colors.primary}>Log store purchase</AppText>
                      <AppText variant="small" color={Colors.textTertiary}>
                        Record a purchase from a local store
                      </AppText>
                    </View>
                  </TouchableOpacity>
                </>
              ) : (
                <View>
                  <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
                    Log Purchase
                  </AppText>
                  <View style={styles.formRow}>
                    <AppText variant="small" color={Colors.textSecondary} style={styles.formLabel}>Qty</AppText>
                    <TextInput
                      style={styles.formInput}
                      value={refillForm.qty}
                      onChangeText={(v) => setRefillForm((p) => ({...p, qty: v}))}
                      placeholder="e.g. 30"
                      keyboardType="numeric"
                      placeholderTextColor={Colors.textTertiary}
                    />
                  </View>
                  <View style={styles.formRow}>
                    <AppText variant="small" color={Colors.textSecondary} style={styles.formLabel}>Store</AppText>
                    <TextInput
                      style={styles.formInput}
                      value={refillForm.store}
                      onChangeText={(v) => setRefillForm((p) => ({...p, store: v}))}
                      placeholder="Store name"
                      placeholderTextColor={Colors.textTertiary}
                    />
                  </View>
                  <View style={styles.formRow}>
                    <AppText variant="small" color={Colors.textSecondary} style={styles.formLabel}>Cost</AppText>
                    <TextInput
                      style={styles.formInput}
                      value={refillForm.cost}
                      onChangeText={(v) => setRefillForm((p) => ({...p, cost: v}))}
                      placeholder="e.g. 250"
                      keyboardType="numeric"
                      placeholderTextColor={Colors.textTertiary}
                    />
                  </View>
                  <View style={styles.formRow}>
                    <AppText variant="small" color={Colors.textSecondary} style={styles.formLabel}>Date</AppText>
                    <TextInput
                      style={styles.formInput}
                      value={refillForm.date}
                      onChangeText={(v) => setRefillForm((p) => ({...p, date: v}))}
                      placeholder="DD/MM/YYYY"
                      placeholderTextColor={Colors.textTertiary}
                    />
                  </View>
                  <TouchableOpacity
                    style={styles.formSaveBtn}
                    activeOpacity={0.8}
                    onPress={handleRefillSave}>
                    <AppText variant="bodyBold" color={Colors.white}>Save purchase</AppText>
                  </TouchableOpacity>
                </View>
              )}
            </TouchableOpacity>
          </KeyboardAvoidingView>
        </TouchableOpacity>
      </Modal>
    </ScrollView>
  );
};

/* ── STYLES ──────────────────────────────────────────── */
const styles = StyleSheet.create({
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: s(16), paddingTop: vs(12)},

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(16),
    marginBottom: vs(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },

  /* ── 1. Progress Ring ─────────────────────────────────── */
  ringRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ringOuter: {
    width: RING_SIZE,
    height: RING_SIZE,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringInner: {alignItems: 'center'},
  ringPct: {fontSize: ms(30), fontWeight: '700', lineHeight: ms(36)},

  statGrid: {
    flex: 1,
    marginLeft: s(16),
  },
  statItem: {
    borderRadius: ms(10),
    paddingVertical: vs(8),
    paddingHorizontal: s(12),
    marginBottom: vs(6),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  statNum: {fontSize: ms(18), fontWeight: '700', lineHeight: ms(22)},

  /* ── 2. Upcoming Alert ────────────────────────────────── */
  upcomingCard: {
    backgroundColor: Colors.blueBg,
    borderColor: Colors.blue,
  },
  upcomingHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  upcomingLeft: {flex: 1, marginRight: s(12)},
  upcomingLabel: {
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: vs(4),
  },
  markTakenBtn: {
    backgroundColor: Colors.blue,
    borderRadius: ms(10),
    paddingVertical: vs(10),
    paddingHorizontal: s(16),
  },

  /* ── 3. Time-grouped Schedule ─────────────────────────── */
  sectionHeading: {
    marginBottom: vs(8),
    marginTop: vs(4),
    paddingHorizontal: s(4),
  },
  timeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  timeEmoji: {fontSize: ms(20), marginRight: s(10)},

  doseCard: {
    paddingVertical: vs(10),
  },
  doseCardBorder: {
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  doseTop: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  doseEmoji: {fontSize: ms(22), marginRight: s(10), marginTop: vs(2)},
  doseInfo: {flex: 1},
  doseMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: vs(4),
    gap: s(6),
  },
  metaChip: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(6),
  },
  doseAction: {
    marginLeft: s(8),
    alignItems: 'flex-end',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: ms(8),
  },
  takeBtn: {
    backgroundColor: Colors.accent,
    borderRadius: ms(8),
    paddingVertical: vs(8),
    paddingHorizontal: s(14),
  },
  doseNote: {
    marginTop: vs(4),
    marginLeft: ms(32),
    fontStyle: 'italic',
  },

  /* ── 4. Refill Alerts ─────────────────────────────────── */
  refillHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    marginBottom: vs(8),
  },
  refillLeft: {flex: 1, marginRight: s(8)},
  refillBadge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(8),
  },
  stockRow: {
    marginBottom: vs(4),
  },
  stockTrack: {
    height: vs(6),
    backgroundColor: Colors.borderLight,
    borderRadius: ms(3),
    overflow: 'hidden',
    marginBottom: vs(10),
  },
  stockFill: {
    height: '100%',
    borderRadius: ms(3),
  },
  refillBtn: {
    borderWidth: 1,
    borderRadius: ms(8),
    paddingVertical: vs(8),
    alignItems: 'center',
  },

  /* ── Summary ──────────────────────────────────────────── */
  summaryCard: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.lightGreen,
  },
  summaryText: {
    marginTop: vs(6),
    lineHeight: ms(18),
  },
  summaryBadge: {
    marginTop: vs(8),
    paddingVertical: vs(6),
    paddingHorizontal: s(12),
    borderRadius: ms(8),
    alignSelf: 'flex-start',
  },

  bottomSpacer: {height: vs(80)},

  /* ── Refill Bottom Sheet ───────────────────────────── */
  sheetOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.4)',
    justifyContent: 'flex-end',
  },
  sheetWrap: {
    justifyContent: 'flex-end',
  },
  sheetContent: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    paddingHorizontal: s(20),
    paddingTop: vs(10),
    paddingBottom: vs(30),
  },
  sheetHandle: {
    width: ms(40),
    height: vs(4),
    borderRadius: ms(2),
    backgroundColor: Colors.borderLight,
    alignSelf: 'center',
    marginBottom: vs(14),
  },
  sheetOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: ms(12),
    padding: s(14),
    marginBottom: vs(10),
  },

  /* ── Refill Form ───────────────────────────────────── */
  formRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  formLabel: {
    width: s(50),
  },
  formInput: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: ms(8),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    fontSize: ms(14),
    color: Colors.textPrimary,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  formSaveBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(10),
    paddingVertical: vs(12),
    alignItems: 'center',
    marginTop: vs(6),
  },
});

export default TodayTab;
