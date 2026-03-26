import React, {useMemo} from 'react';
import {View, StyleSheet, ScrollView, TouchableOpacity, StatusBar} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import {AYU_MED_INSIGHTS} from '../../../constants/medicationData';

/* ─── Helpers ───────────────────────────────────────── */

const MONTH_MAP = {
  Jan: 0, Feb: 1, Mar: 2, Apr: 3, May: 4, Jun: 5,
  Jul: 6, Aug: 7, Sep: 8, Oct: 9, Nov: 10, Dec: 11,
};

const parseDate = (str) => {
  try {
    const parts = (str || '').split(' ');
    const day = parseInt(parts[0], 10);
    const mon = MONTH_MAP[parts[1]];
    const year = parseInt(parts[2], 10);
    if (isNaN(day) || mon === undefined || isNaN(year)) return TODAY;
    return new Date(year, mon, day);
  } catch {
    return TODAY;
  }
};

const TODAY = new Date(2026, 2, 26); // March 26, 2026

const daysBetween = (a, b) => Math.floor((b - a) / (1000 * 60 * 60 * 24));

const methodMeta = (method) => {
  switch (method) {
    case 'Delivery':
      return {ico: '\uD83D\uDEB4', bg: Colors.blueBg, text: Colors.blueText};
    case 'Pickup':
      return {ico: '\uD83D\uDEB6', bg: Colors.tealBg, text: Colors.tealText};
    default:
      return {ico: '\uD83C\uDFEC', bg: 'rgba(168,85,247,.1)', text: '#a855f7'};
  }
};

/* ─── Component ─────────────────────────────────────── */

const MedDetailScreen = ({route}) => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const med = route.params.med || {};

  /* ── Computed values ──────────────────────────────── */
  const refills = med.refillHistory || [];
  const dosesPerDay = (med.times || []).length || 1;

  const totalPurchased = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < refills.length; i++) { sum += refills[i].qty || 0; }
    return sum;
  }, [refills]);

  const totalCost = useMemo(() => {
    let sum = 0;
    for (let i = 0; i < refills.length; i++) { sum += refills[i].cost || 0; }
    return sum;
  }, [refills]);

  const firstDate = refills.length > 0 ? parseDate(refills[0].date) : TODAY;
  const daysSinceStart = Math.max(0, daysBetween(firstDate, TODAY));
  const totalConsumed = Math.min(totalPurchased, daysSinceStart * dosesPerDay);
  const currentStock = Math.max(0, totalPurchased - totalConsumed);
  const daysLeft = dosesPerDay > 0 ? Math.floor(currentStock / dosesPerDay) : 0;
  const stockColor = daysLeft > 14 ? Colors.accent : daysLeft > 7 ? Colors.amber : Colors.red;
  const hasGeneric = refills.some((r) => r.generic);

  const batches = useMemo(() => {
    let consumed = totalConsumed;
    return refills.map((r, idx) => {
      const used = Math.min(r.qty, consumed);
      consumed -= used;
      const left = r.qty - used;
      const pct = r.qty > 0 ? Math.round((used / r.qty) * 100) : 0;
      const isCurrent = left > 0 && (idx === refills.length - 1 || consumed <= 0);
      return {...r, used, left, pct, isCurrent};
    });
  }, [refills, totalConsumed]);

  const sortedRefills = useMemo(() => [...refills].reverse(), [refills]);

  /* ── Section: Header ──────────────────────────────── */
  const renderHeader = () => (
    <View style={[styles.header, {paddingTop: insets.top}]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <AppText variant="body" style={styles.backText}>
            {'\u2039'} Back
          </AppText>
        </TouchableOpacity>

        <TouchableOpacity
          style={styles.refillPill}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('MedicineSearch')}>
          <AppText variant="small" style={styles.refillPillText}>
            {'\uD83D\uDC8A'} Refill
          </AppText>
        </TouchableOpacity>
      </View>

      <View style={styles.headerTitleRow}>
        <AppText style={styles.headerEmoji}>{med.ico}</AppText>
        <AppText variant="screenName" style={styles.headerTitle}>
          {med.name}
        </AppText>
      </View>
      <AppText variant="caption" style={styles.headerSubtitle}>
        {med.dose} {'\u00B7'} {med.form} {'\u00B7'} {med.category}
      </AppText>
    </View>
  );

  /* ── Section: Prescription Details ────────────────── */
  const renderPrescription = () => {
    const fields = [
      {ico: '\uD83D\uDC69\u200D\u2695\uFE0F', label: 'Prescribed by', value: med.prescribedBy},
      {ico: '\uD83C\uDFE5', label: 'Hospital / Clinic', value: med.hospital},
      {ico: '\uD83D\uDCC5', label: 'Prescribed date', value: med.prescriptionStartDate},
      {ico: '\uD83D\uDCC6', label: 'Valid until', value: med.prescriptionEndDate},
      {ico: '\uD83D\uDCDD', label: 'Rx number', value: med.rxNumber},
      {ico: '\u23F3', label: 'Duration', value: med.prescriptionDays ? med.prescriptionDays + ' days' : '—'},
    ];

    const dosageFields = [
      {label: 'Dose', value: med.dose},
      {label: 'Form', value: med.form},
      {label: 'Frequency', value: med.frequency},
      {label: 'With food', value: med.withFood ? 'Yes' : 'No'},
      {label: 'Doses/day', value: String(med.times.length)},
      {label: 'Brand', value: med.brand ? med.brand.split('/')[0].trim() : '—'},
    ];

    return (
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcoBox}>
            <AppText style={styles.sectionIco}>{'\uD83D\uDCCB'}</AppText>
          </View>
          <AppText variant="bodyBold" style={styles.sectionTitle}>
            Prescription Details
          </AppText>
        </View>

        {/* Grid */}
        <View style={styles.grid2}>
          {fields.map((f, i) => (
            <View key={i} style={styles.infoBox}>
              <AppText variant="small" style={styles.infoLabel}>
                {f.ico} {f.label}
              </AppText>
              <AppText variant="body" style={styles.infoValue}>
                {f.value || '—'}
              </AppText>
            </View>
          ))}
        </View>

        {/* Dosage instructions */}
        <View style={[styles.dosageBox, {borderColor: med.col, backgroundColor: med.col + '0D'}]}>
          <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
            Dosage Instructions
          </AppText>
          <View style={styles.grid3}>
            {dosageFields.map((d, i) => (
              <View key={i} style={styles.dosageCell}>
                <AppText variant="small" color={Colors.textSecondary}>
                  {d.label}
                </AppText>
                <AppText variant="bodyBold" style={{fontSize: ms(13)}}>
                  {d.value}
                </AppText>
              </View>
            ))}
          </View>
        </View>

        {/* Dose schedule today */}
        <AppText variant="bodyBold" style={{marginTop: vs(12), marginBottom: vs(8)}}>
          Dose schedule today
        </AppText>
        {med.times.map((t, i) => (
          <View key={i} style={styles.doseRow}>
            <View
              style={[
                styles.doseDot,
                {backgroundColor: t.taken ? Colors.accent : Colors.borderLight},
              ]}
            />
            <View style={{flex: 1}}>
              <AppText variant="body">
                {t.t} — {t.label}
              </AppText>
            </View>
            <AppText
              variant="small"
              color={t.taken ? Colors.accent : Colors.amber}
              style={{fontWeight: '600'}}>
              {t.taken ? 'Taken' : 'Pending'}
            </AppText>
          </View>
        ))}

        {/* Notes */}
        {med.notes ? (
          <View style={[styles.noteBox, {borderLeftColor: med.col}]}>
            <AppText variant="small" color={Colors.textSecondary}>
              {med.notes}
            </AppText>
          </View>
        ) : null}
      </View>
    );
  };

  /* ── Section: Purpose & Side Effects ──────────────── */
  const renderPurpose = () => (
    <View style={styles.card}>
      <View style={styles.sectionHeader}>
        <View style={styles.sectionIcoBox}>
          <AppText style={styles.sectionIco}>{'\uD83D\uDCA1'}</AppText>
        </View>
        <AppText variant="bodyBold" style={styles.sectionTitle}>
          Why it's prescribed
        </AppText>
      </View>

      <AppText variant="body" style={{marginBottom: vs(10)}}>
        {med.purpose}
      </AppText>

      {med.sideEffects ? (
        <View style={styles.warningBox}>
          <AppText variant="bodyBold" style={{marginBottom: vs(4)}}>
            {'\u26A0\uFE0F'} Watch for
          </AppText>
          <AppText variant="small" color={Colors.amberText}>
            {med.sideEffects}
          </AppText>
        </View>
      ) : null}
    </View>
  );

  /* ── Section: Purchase & Refill History ───────────── */
  const renderRefillHistory = () => {
    if (sortedRefills.length === 0) return null;

    return (
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcoBox}>
            <AppText style={styles.sectionIco}>{'\uD83E\uDDFE'}</AppText>
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" style={styles.sectionTitle}>
              Purchase & Refill History
            </AppText>
          </View>
          <View style={styles.countBadge}>
            <AppText variant="small" color={Colors.accent} style={{fontWeight: '700'}}>
              {sortedRefills.length}
            </AppText>
          </View>
        </View>

        {/* Summary stats */}
        <View style={styles.grid3}>
          <View style={styles.statBox}>
            <AppText variant="small" color={Colors.textSecondary}>
              Total spent
            </AppText>
            <AppText variant="bodyBold">
              {'\u20B9'}{totalCost}
            </AppText>
          </View>
          <View style={styles.statBox}>
            <AppText variant="small" color={Colors.textSecondary}>
              Tablets bought
            </AppText>
            <AppText variant="bodyBold">{totalPurchased}</AppText>
          </View>
          <View style={styles.statBox}>
            <AppText variant="small" color={Colors.textSecondary}>
              Refills
            </AppText>
            <AppText variant="bodyBold">{sortedRefills.length}</AppText>
          </View>
        </View>

        {/* Refill entries */}
        {sortedRefills.map((r, i) => {
          const isLatest = i === 0;
          const m = methodMeta(r.method);
          return (
            <View key={i} style={[styles.refillCard, isLatest && {borderColor: med.col + '40'}]}>
              {/* Top row: date + cost */}
              <View style={styles.refillTopRow}>
                <View style={{flex: 1}}>
                  <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
                    <AppText variant="bodyBold" style={{fontSize: ms(13)}}>
                      {r.date}
                    </AppText>
                    {isLatest && (
                      <View style={[styles.latestBadge, {backgroundColor: med.col + '18'}]}>
                        <AppText variant="small" style={{color: med.col, fontWeight: '700', fontSize: ms(9)}}>
                          Latest
                        </AppText>
                      </View>
                    )}
                  </View>
                  <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
                    {r.store}
                  </AppText>
                </View>
                <View style={{alignItems: 'flex-end'}}>
                  <AppText variant="bodyBold" style={{fontSize: ms(14)}}>
                    {'\u20B9'}{r.cost}
                  </AppText>
                  <AppText variant="small" color={Colors.textSecondary}>
                    {r.qty} tabs
                  </AppText>
                </View>
              </View>

              {/* Chips row */}
              <View style={styles.refillChips}>
                <View style={[styles.methodChip, {backgroundColor: m.bg}]}>
                  <AppText variant="small" style={{color: m.text, fontSize: ms(10), fontWeight: '600'}}>
                    {m.ico} {r.method}
                  </AppText>
                </View>
                {r.generic && (
                  <View style={[styles.methodChip, {backgroundColor: Colors.tealBg}]}>
                    <AppText variant="small" style={{color: Colors.tealText, fontSize: ms(10), fontWeight: '600'}}>
                      Generic {'\u2713'}
                    </AppText>
                  </View>
                )}
                <AppText variant="small" color={Colors.textTertiary}>
                  {r.invoice}
                </AppText>
              </View>
            </View>
          );
        })}

        {/* Generic tip */}
        {hasGeneric && (
          <View style={[styles.noteBox, {borderLeftColor: Colors.accent, marginTop: vs(10)}]}>
            <AppText variant="small" color={Colors.tealText}>
              {'\uD83D\uDCA1'} Generic alternatives can save 50-70% on medication costs with identical efficacy.
            </AppText>
          </View>
        )}
      </View>
    );
  };

  /* ── Section: Stock Take ──────────────────────────── */
  const renderStock = () => {
    if (refills.length === 0) return null;

    const pctRemaining =
      totalPurchased > 0 ? Math.round((currentStock / totalPurchased) * 100) : 0;

    return (
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <View style={styles.sectionIcoBox}>
            <AppText style={styles.sectionIco}>{'\uD83D\uDCE6'}</AppText>
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" style={styles.sectionTitle}>
              Stock Take
            </AppText>
          </View>
          <TouchableOpacity
            style={styles.refillPillSmall}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('MedicineSearch')}>
            <AppText variant="small" style={{color: Colors.accent, fontWeight: '600', fontSize: ms(11)}}>
              {'\uD83D\uDC8A'} Refill
            </AppText>
          </TouchableOpacity>
        </View>

        {/* Big summary */}
        <View style={[styles.stockSummary, {borderColor: stockColor + '40', backgroundColor: stockColor + '08'}]}>
          <AppText style={{fontSize: ms(36), fontWeight: '800', color: stockColor, textAlign: 'center'}}>
            {currentStock}
          </AppText>
          <AppText variant="body" style={{textAlign: 'center', marginBottom: vs(10)}}>
            tablets left
          </AppText>

          {/* Progress bar */}
          <View style={styles.progressBarBg}>
            <View
              style={[
                styles.progressBarFill,
                {width: pctRemaining + '%', backgroundColor: stockColor},
              ]}
            />
          </View>

          {/* 3 stat boxes */}
          <View style={[styles.grid3, {marginTop: vs(12)}]}>
            <View style={styles.statBox}>
              <AppText variant="small" color={Colors.textSecondary}>
                Supply remaining
              </AppText>
              <AppText variant="bodyBold" style={{color: stockColor}}>
                {daysLeft} days
              </AppText>
            </View>
            <View style={styles.statBox}>
              <AppText variant="small" color={Colors.textSecondary}>
                Daily dose
              </AppText>
              <AppText variant="bodyBold">{dosesPerDay}</AppText>
            </View>
            <View style={styles.statBox}>
              <AppText variant="small" color={Colors.textSecondary}>
                Total consumed
              </AppText>
              <AppText variant="bodyBold">{totalConsumed}</AppText>
            </View>
          </View>
        </View>

        {/* Batch-level view */}
        <AppText variant="bodyBold" style={{marginTop: vs(14), marginBottom: vs(8)}}>
          Batch consumption
        </AppText>

        {batches.map((b, i) => (
          <View key={i} style={[styles.batchCard, b.isCurrent && {borderColor: med.col + '40'}]}>
            <View style={styles.refillTopRow}>
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
                  <AppText variant="bodyBold" style={{fontSize: ms(12)}}>
                    {b.date}
                  </AppText>
                  {b.isCurrent && (
                    <View style={[styles.latestBadge, {backgroundColor: med.col + '18'}]}>
                      <AppText variant="small" style={{color: med.col, fontWeight: '700', fontSize: ms(9)}}>
                        Current
                      </AppText>
                    </View>
                  )}
                </View>
                <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>
                  {b.store}{b.generic ? ' (Generic)' : ''}
                </AppText>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <AppText variant="bodyBold" style={{fontSize: ms(12)}}>
                  {b.qty} bought
                </AppText>
                <AppText variant="small" color={b.isCurrent ? med.col : Colors.textTertiary}>
                  {b.left} left
                </AppText>
              </View>
            </View>

            {/* Consumption bar */}
            <View style={styles.batchBarBg}>
              <View
                style={[
                  styles.batchBarFill,
                  {width: b.pct + '%', backgroundColor: b.isCurrent ? med.col : Colors.borderLight},
                ]}
              />
            </View>
            <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(3)}}>
              {b.used}/{b.qty} used
            </AppText>
          </View>
        ))}

        {/* Running total note */}
        <View style={[styles.noteBox, {borderLeftColor: stockColor, marginTop: vs(10)}]}>
          <AppText variant="small" color={Colors.textSecondary}>
            Running total: {totalPurchased} purchased, {totalConsumed} consumed, {currentStock} in stock.
          </AppText>
        </View>
      </View>
    );
  };

  /* ── Section: Ayu Insight ─────────────────────────── */
  const renderAyuInsight = () => {
    const insight = AYU_MED_INSIGHTS[med.id];
    if (!insight) return null;

    return (
      <View style={styles.ayuCard}>
        <View style={styles.ayuRow}>
          <View style={styles.ayuAvatar}>
            <AppText style={{fontSize: ms(20)}}>{'\uD83C\uDF3F'}</AppText>
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={Colors.tealDark} style={{marginBottom: vs(4)}}>
              Ayu Medication Insight
            </AppText>
            <AppText variant="small" color={Colors.tealText}>
              {insight}
            </AppText>
          </View>
        </View>
      </View>
    );
  };

  /* ── Render ───────────────────────────────────────── */
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      {renderHeader()}

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {renderPrescription()}
        {renderPurpose()}
        {renderRefillHistory()}
        {renderStock()}
        {renderAyuInsight()}
      </ScrollView>
    </View>
  );
};

/* ── STYLES ──────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: s(14),
    paddingBottom: vs(40),
  },

  /* Header */
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
  refillPill: {
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    backgroundColor: 'rgba(93,202,165,0.18)',
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  refillPillText: {
    color: Colors.lightGreen,
    fontSize: ms(12),
    fontWeight: '600',
  },
  refillPillSmall: {
    paddingHorizontal: s(12),
    paddingVertical: vs(4),
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: Colors.accent,
  },
  headerTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginBottom: vs(4),
  },
  headerEmoji: {
    fontSize: ms(24),
  },
  headerTitle: {
    color: Colors.white,
    fontSize: ms(24),
    fontWeight: '700',
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: ms(12),
  },

  /* Cards */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: s(14),
    marginBottom: vs(12),
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginBottom: vs(12),
  },
  sectionIcoBox: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(10),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionIco: {
    fontSize: ms(16),
  },
  sectionTitle: {
    fontSize: ms(15),
  },

  /* Grids */
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  grid3: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  infoBox: {
    width: '48%',
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    padding: s(10),
  },
  infoLabel: {
    color: Colors.textSecondary,
    fontSize: ms(10),
    marginBottom: vs(2),
  },
  infoValue: {
    fontSize: ms(13),
    fontWeight: '600',
  },
  statBox: {
    flex: 1,
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    padding: s(10),
    alignItems: 'center',
  },

  /* Dosage */
  dosageBox: {
    borderRadius: ms(12),
    borderWidth: 1,
    padding: s(12),
    marginTop: vs(12),
  },
  dosageCell: {
    width: '30%',
    marginBottom: vs(8),
  },

  /* Dose schedule */
  doseRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    paddingVertical: vs(6),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  doseDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
  },

  /* Notes */
  noteBox: {
    borderLeftWidth: 3,
    backgroundColor: Colors.background,
    borderRadius: ms(8),
    padding: s(10),
    marginTop: vs(8),
  },

  /* Warning */
  warningBox: {
    backgroundColor: Colors.amberBg,
    borderRadius: ms(10),
    padding: s(12),
  },

  /* Count badge */
  countBadge: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(10),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
  },

  /* Refill cards */
  refillCard: {
    backgroundColor: Colors.background,
    borderRadius: ms(12),
    padding: s(12),
    marginTop: vs(8),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  refillTopRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
  },
  latestBadge: {
    borderRadius: ms(6),
    paddingHorizontal: s(6),
    paddingVertical: vs(1),
  },
  refillChips: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    marginTop: vs(8),
  },
  methodChip: {
    borderRadius: ms(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
  },

  /* Stock */
  stockSummary: {
    borderRadius: ms(14),
    borderWidth: 1,
    padding: s(16),
  },
  progressBarBg: {
    height: vs(8),
    backgroundColor: Colors.borderLight,
    borderRadius: ms(4),
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: ms(4),
  },

  /* Batch */
  batchCard: {
    backgroundColor: Colors.background,
    borderRadius: ms(12),
    padding: s(12),
    marginTop: vs(8),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  batchBarBg: {
    height: vs(6),
    backgroundColor: Colors.borderLight,
    borderRadius: ms(3),
    overflow: 'hidden',
    marginTop: vs(8),
  },
  batchBarFill: {
    height: '100%',
    borderRadius: ms(3),
  },

  /* Ayu */
  ayuCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: Colors.teal,
    padding: s(14),
    marginBottom: vs(12),
  },
  ayuRow: {
    flexDirection: 'row',
    gap: s(12),
    alignItems: 'flex-start',
  },
  ayuAvatar: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MedDetailScreen;
