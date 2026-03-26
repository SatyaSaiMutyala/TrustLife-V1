import React, {useState, useMemo, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';

import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {IMPORT_OPTIONS} from '../../../constants/medicationData';

/* ─── Constants ─────────────────────────────────────── */

const FORM_OPTIONS = ['Tablet', 'Capsule', 'Softgel', 'Syrup', 'Injection', 'Drops', 'Inhaler', 'Patch', 'Powder'];

const FREQUENCY_OPTIONS = [
  'Once daily',
  'Twice daily',
  'Three times daily',
  'Once weekly',
  'As needed',
  'Every other day',
];

const CATEGORY_OPTIONS = [
  'Antidiabetic',
  'Antihypertensive',
  'Statin / Lipid-lowering',
  'Thyroid',
  'Heart',
  'Pain',
  'Antibiotic',
  'Supplement',
  'Other',
];

const AUTO_CAPTURED = [
  'Drug name, dose & form',
  'Frequency & timing',
  'Prescriber details',
  'Refill date & stock count',
  'Drug interaction checks',
];

const fmt24to12 = (t24) => {
  const [h, m] = t24.split(':').map(Number);
  const suffix = h >= 12 ? 'PM' : 'AM';
  const h12 = h === 0 ? 12 : h > 12 ? h - 12 : h;
  return `${h12}:${m.toString().padStart(2, '0')} ${suffix}`;
};

const clamp01 = (v) => Math.min(1, Math.max(0, v));

/* ─── Component ─────────────────────────────────────── */

const MyMedsTab = ({meds, setMeds}) => {
  const navigation = useNavigation();
  // ── State ──────────────────────────────────────────
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    dose: '',
    form: 'Tablet',
    frequency: 'Once daily',
    category: 'Other',
    time: '08:00',
    withFood: false,
    notes: '',
  });
  const [activeFormPicker, setActiveFormPicker] = useState(null);

  // ── Derived lists ──────────────────────────────────
  const prescriptionMeds = useMemo(
    () => meds.filter((m) => m.type === 'prescription'),
    [meds],
  );
  const supplements = useMemo(
    () => meds.filter((m) => m.type === 'supplement'),
    [meds],
  );

  // ── Form helpers ───────────────────────────────────
  const updateField = useCallback((field, value) => {
    setFormData((prev) => ({...prev, [field]: value}));
  }, []);

  const handleAddMed = useCallback(() => {
    if (!formData.name.trim() || !formData.dose.trim()) return;

    const newMed = {
      id: `custom_${Date.now()}`,
      name: formData.name.trim(),
      brand: '',
      dose: formData.dose.trim(),
      form: formData.form.toLowerCase(),
      ico: '\uD83D\uDC8A',
      col: '#6C63FF',
      category: formData.category,
      type: formData.category === 'Supplement' ? 'supplement' : 'prescription',
      times: [{t: formData.time, label: formData.withFood ? 'With food' : '', taken: false}],
      frequency: formData.frequency,
      withFood: formData.withFood,
      prescribedBy: '',
      prescribedDate: new Date().toLocaleDateString('en-IN', {month: 'short', year: 'numeric'}),
      refillDays: 30,
      totalStock: 30,
      usedStock: 0,
      notes: formData.notes.trim(),
      purpose: '',
      sideEffects: '',
      streak: 0,
      adherence: 0,
      history: [],
    };

    setMeds((prev) => [...prev, newMed]);
    setFormData({
      name: '',
      dose: '',
      form: 'Tablet',
      frequency: 'Once daily',
      category: 'Other',
      time: '08:00',
      withFood: false,
      notes: '',
    });
    setShowForm(false);
  }, [formData, setMeds]);

  // ── Dropdown toggle ────────────────────────────────
  const togglePicker = useCallback((picker) => {
    setActiveFormPicker((prev) => (prev === picker ? null : picker));
  }, []);

  // ── Render dropdown ────────────────────────────────
  const renderDropdown = (field, options, current) => (
    <View style={styles.fieldWrap}>
      <AppText variant="caption" color={Colors.textSecondary} style={styles.fieldLabel}>
        {field.charAt(0).toUpperCase() + field.slice(1)}
      </AppText>
      <TouchableOpacity
        style={styles.dropdown}
        onPress={() => togglePicker(field)}
        activeOpacity={0.7}>
        <AppText variant="body">{current}</AppText>
        <AppText variant="caption" color={Colors.textTertiary}>
          {activeFormPicker === field ? '\u25B2' : '\u25BC'}
        </AppText>
      </TouchableOpacity>
      {activeFormPicker === field && (
        <View style={styles.dropdownList}>
          {options.map((opt) => (
            <TouchableOpacity
              key={opt}
              style={[
                styles.dropdownItem,
                opt === current && styles.dropdownItemActive,
              ]}
              onPress={() => {
                updateField(field, opt);
                setActiveFormPicker(null);
              }}>
              <AppText
                variant="body"
                color={opt === current ? Colors.primary : Colors.textPrimary}>
                {opt}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      )}
    </View>
  );

  return (
    <ScrollView
      style={styles.scroll}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}
      keyboardShouldPersistTaps="handled">

      {/* ── 1. IMPORT SECTION ───────────────────────────── */}
      <AppText variant="bodyBold" style={styles.sectionHeading}>
        {'\uD83D\uDCE5'} Import Medication
      </AppText>

      <View style={styles.importGrid}>
        {IMPORT_OPTIONS.map((opt) => (
          <TouchableOpacity
            key={opt.title}
            style={styles.importCard}
            activeOpacity={0.7}>
            <View style={[styles.importIco, {backgroundColor: `${opt.col}15`}]}>
              <AppText style={styles.importEmoji}>{opt.ico}</AppText>
            </View>
            <AppText variant="bodyBold" style={styles.importTitle}>
              {opt.title}
            </AppText>
            <AppText variant="small" color={Colors.textTertiary} style={styles.importSub}>
              {opt.sub}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* ── 2. AUTO-CAPTURED INFO ───────────────────────── */}
      <View style={[styles.card, styles.infoCard]}>
        <AppText variant="bodyBold" color={Colors.primary} style={styles.infoTitle}>
          {'\u2728'} Auto-captured from prescriptions
        </AppText>
        {AUTO_CAPTURED.map((item, idx) => (
          <View key={idx} style={styles.infoRow}>
            <AppText variant="small" color={Colors.accent}>{'\u2713'}</AppText>
            <AppText variant="caption" color={Colors.tealText} style={styles.infoText}>
              {item}
            </AppText>
          </View>
        ))}
      </View>

      {/* ── 3. ADD MEDICATION FORM ──────────────────────── */}
      <TouchableOpacity
        style={styles.addFormToggle}
        activeOpacity={0.7}
        onPress={() => setShowForm(!showForm)}>
        <AppText variant="bodyBold" color={Colors.accent}>
          {showForm ? '\u2212 Hide form' : '+ Add medication manually'}
        </AppText>
      </TouchableOpacity>

      {showForm && (
        <View style={styles.card}>
          <AppText variant="bodyBold" style={styles.formTitle}>
            New Medication
          </AppText>

          {/* Drug name */}
          <View style={styles.fieldWrap}>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.fieldLabel}>
              Drug name
            </AppText>
            <TextInput
              style={styles.input}
              placeholder="e.g. Metformin"
              placeholderTextColor={Colors.textTertiary}
              value={formData.name}
              onChangeText={(v) => updateField('name', v)}
            />
          </View>

          {/* Dose */}
          <View style={styles.fieldWrap}>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.fieldLabel}>
              Dose
            </AppText>
            <TextInput
              style={styles.input}
              placeholder="e.g. 500mg"
              placeholderTextColor={Colors.textTertiary}
              value={formData.dose}
              onChangeText={(v) => updateField('dose', v)}
            />
          </View>

          {/* Form dropdown */}
          {renderDropdown('form', FORM_OPTIONS, formData.form)}

          {/* Frequency dropdown */}
          {renderDropdown('frequency', FREQUENCY_OPTIONS, formData.frequency)}

          {/* Category dropdown */}
          {renderDropdown('category', CATEGORY_OPTIONS, formData.category)}

          {/* Time */}
          <View style={styles.fieldWrap}>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.fieldLabel}>
              Time (24h)
            </AppText>
            <TextInput
              style={styles.input}
              placeholder="e.g. 08:00"
              placeholderTextColor={Colors.textTertiary}
              value={formData.time}
              onChangeText={(v) => updateField('time', v)}
            />
          </View>

          {/* With food toggle */}
          <TouchableOpacity
            style={styles.toggleRow}
            activeOpacity={0.7}
            onPress={() => updateField('withFood', !formData.withFood)}>
            <AppText variant="body">Take with food</AppText>
            <View style={[styles.toggleBox, formData.withFood && styles.toggleBoxOn]}>
              {formData.withFood && (
                <AppText variant="small" color={Colors.white}>{'\u2713'}</AppText>
              )}
            </View>
          </TouchableOpacity>

          {/* Notes */}
          <View style={styles.fieldWrap}>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.fieldLabel}>
              Notes
            </AppText>
            <TextInput
              style={[styles.input, styles.inputMulti]}
              placeholder="Additional instructions..."
              placeholderTextColor={Colors.textTertiary}
              value={formData.notes}
              onChangeText={(v) => updateField('notes', v)}
              multiline
              numberOfLines={3}
            />
          </View>

          {/* Submit */}
          <TouchableOpacity
            style={[
              styles.submitBtn,
              (!formData.name.trim() || !formData.dose.trim()) && styles.submitBtnDisabled,
            ]}
            activeOpacity={0.8}
            onPress={handleAddMed}
            disabled={!formData.name.trim() || !formData.dose.trim()}>
            <AppText variant="bodyBold" color={Colors.white}>
              Add to my medications
            </AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* ── 4. PRESCRIPTION MEDICATIONS ─────────────────── */}
      <AppText variant="bodyBold" style={styles.sectionHeading}>
        {'\uD83D\uDCCB'} Prescription Medications ({prescriptionMeds.length})
      </AppText>

      {prescriptionMeds.map((med) => {
        const remaining = med.totalStock - med.usedStock;
        const stockRatio = clamp01(remaining / med.totalStock);
        const stockDays = med.refillDays;
        const stockColor = stockDays <= 3 ? Colors.red : stockDays <= 7 ? Colors.amber : Colors.accent;

        return (
          <TouchableOpacity key={med.id} style={styles.card} activeOpacity={0.7} onPress={() => navigation.navigate('MedDetail', {med})}>
            {/* Top: icon, name, dose, category */}
            <View style={styles.medHeader}>
              <AppText style={styles.medEmoji}>{med.ico}</AppText>
              <View style={styles.medHeaderInfo}>
                <AppText variant="bodyBold">{med.name}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  {med.dose} {'\u00B7'} {med.form} {'\u00B7'} {med.frequency}
                </AppText>
                {med.brand ? (
                  <AppText variant="small" color={Colors.textTertiary}>
                    {med.brand}
                  </AppText>
                ) : null}
              </View>
              <View style={[styles.catBadge, {backgroundColor: `${med.col}15`}]}>
                <AppText variant="small" color={med.col}>
                  {med.category}
                </AppText>
              </View>
            </View>

            {/* Prescriber */}
            {med.prescribedBy ? (
              <View style={styles.prescriberRow}>
                <AppText variant="small" color={Colors.textTertiary}>
                  {'\uD83D\uDC68\u200D\u2695\uFE0F'} {med.prescribedBy}
                </AppText>
                {med.prescribedDate ? (
                  <AppText variant="small" color={Colors.textTertiary}>
                    {' \u00B7 since '}{med.prescribedDate}
                  </AppText>
                ) : null}
              </View>
            ) : null}

            {/* Streak + adherence */}
            <View style={styles.streakRow}>
              <View style={[styles.streakChip, {backgroundColor: Colors.tealBg}]}>
                <AppText variant="small" color={Colors.tealText}>
                  {'\uD83D\uDD25'} {med.streak} day streak
                </AppText>
              </View>
              <View style={[styles.streakChip, {backgroundColor: Colors.blueBg}]}>
                <AppText variant="small" color={Colors.blueText}>
                  {'\uD83D\uDCCA'} {med.adherence}% adherence
                </AppText>
              </View>
            </View>

            {/* Purpose */}
            {med.purpose ? (
              <View style={styles.purposeBox}>
                <AppText variant="caption" color={Colors.textSecondary}>
                  {med.purpose}
                </AppText>
              </View>
            ) : null}

            {/* Stock bar */}
            <View style={styles.stockSection}>
              <View style={styles.stockHeader}>
                <AppText variant="small" color={Colors.textSecondary}>
                  {'\uD83D\uDCE6'} Stock
                </AppText>
                <AppText variant="small" color={stockColor}>
                  {remaining} tablets {'\u00B7'} {stockDays} days supply
                </AppText>
              </View>
              <View style={styles.stockTrack}>
                <View
                  style={[
                    styles.stockFill,
                    {width: `${stockRatio * 100}%`, backgroundColor: stockColor},
                  ]}
                />
              </View>
            </View>

            {/* Dose time chips */}
            <View style={styles.doseChips}>
              {med.times.map((dose, idx) => {
                const taken = dose.taken;
                const chipBg = taken ? Colors.tealBg : Colors.amberBg;
                const chipColor = taken ? Colors.tealText : Colors.amberText;
                return (
                  <View key={idx} style={[styles.doseChip, {backgroundColor: chipBg}]}>
                    <AppText variant="small" color={chipColor}>
                      {fmt24to12(dose.t)} {'\u00B7'} {taken ? '\u2713 Taken' : '\u23F3 Pending'}
                    </AppText>
                  </View>
                );
              })}
            </View>
          </TouchableOpacity>
        );
      })}

      {/* ── 5. SUPPLEMENTS ──────────────────────────────── */}
      {supplements.length > 0 && (
        <>
          <AppText variant="bodyBold" style={styles.sectionHeading}>
            {'\uD83C\uDF3F'} Supplements ({supplements.length})
          </AppText>

          {supplements.map((med) => {
            const remaining = med.totalStock - med.usedStock;
            const stockRatio = clamp01(remaining / med.totalStock);
            const stockDays = med.refillDays;
            const stockColor = stockDays <= 3 ? Colors.red : stockDays <= 7 ? Colors.amber : Colors.accent;

            return (
              <TouchableOpacity key={med.id} style={styles.card} activeOpacity={0.7} onPress={() => navigation.navigate('MedDetail', {med})}>
                {/* Header */}
                <View style={styles.medHeader}>
                  <AppText style={styles.medEmoji}>{med.ico}</AppText>
                  <View style={styles.medHeaderInfo}>
                    <AppText variant="bodyBold">{med.name}</AppText>
                    <AppText variant="caption" color={Colors.textSecondary}>
                      {med.dose} {'\u00B7'} {med.form} {'\u00B7'} {med.frequency}
                    </AppText>
                  </View>
                  <View style={[styles.catBadge, {backgroundColor: Colors.tealBg}]}>
                    <AppText variant="small" color={Colors.tealText}>
                      {med.category}
                    </AppText>
                  </View>
                </View>

                {/* Streak + adherence */}
                <View style={styles.streakRow}>
                  <View style={[styles.streakChip, {backgroundColor: Colors.tealBg}]}>
                    <AppText variant="small" color={Colors.tealText}>
                      {'\uD83D\uDD25'} {med.streak} day streak
                    </AppText>
                  </View>
                  <View style={[styles.streakChip, {backgroundColor: Colors.blueBg}]}>
                    <AppText variant="small" color={Colors.blueText}>
                      {'\uD83D\uDCCA'} {med.adherence}% adherence
                    </AppText>
                  </View>
                </View>

                {/* Purpose */}
                {med.purpose ? (
                  <View style={styles.purposeBox}>
                    <AppText variant="caption" color={Colors.textSecondary}>
                      {med.purpose}
                    </AppText>
                  </View>
                ) : null}

                {/* Stock bar */}
                <View style={styles.stockSection}>
                  <View style={styles.stockHeader}>
                    <AppText variant="small" color={Colors.textSecondary}>
                      {'\uD83D\uDCE6'} Stock
                    </AppText>
                    <AppText variant="small" color={stockColor}>
                      {remaining} units {'\u00B7'} {stockDays} days supply
                    </AppText>
                  </View>
                  <View style={styles.stockTrack}>
                    <View
                      style={[
                        styles.stockFill,
                        {width: `${stockRatio * 100}%`, backgroundColor: stockColor},
                      ]}
                    />
                  </View>
                </View>

                {/* Dose time chips */}
                <View style={styles.doseChips}>
                  {med.times.map((dose, idx) => {
                    const taken = dose.taken;
                    const chipBg = taken ? Colors.tealBg : Colors.amberBg;
                    const chipColor = taken ? Colors.tealText : Colors.amberText;
                    return (
                      <View key={idx} style={[styles.doseChip, {backgroundColor: chipBg}]}>
                        <AppText variant="small" color={chipColor}>
                          {fmt24to12(dose.t)} {'\u00B7'} {taken ? '\u2713 Taken' : '\u23F3 Pending'}
                        </AppText>
                      </View>
                    );
                  })}
                </View>
              </TouchableOpacity>
            );
          })}
        </>
      )}

      <View style={styles.bottomSpacer} />
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

  sectionHeading: {
    marginBottom: vs(8),
    marginTop: vs(4),
    paddingHorizontal: s(4),
  },

  /* ── 1. Import Section ────────────────────────────────── */
  importGrid: {
    flexDirection: 'row',
    marginBottom: vs(12),
    gap: s(10),
  },
  importCard: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(12),
    alignItems: 'center',
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  importIco: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(8),
  },
  importEmoji: {fontSize: ms(20)},
  importTitle: {fontSize: ms(12), textAlign: 'center', marginBottom: vs(2)},
  importSub: {fontSize: ms(10), textAlign: 'center'},

  /* ── 2. Info Card ─────────────────────────────────────── */
  infoCard: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.lightGreen,
  },
  infoTitle: {marginBottom: vs(8)},
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
    gap: s(8),
  },
  infoText: {flex: 1},

  /* ── 3. Add Form ──────────────────────────────────────── */
  addFormToggle: {
    alignItems: 'center',
    paddingVertical: vs(14),
    marginBottom: vs(12),
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: Colors.lightGreen,
    borderStyle: 'dashed',
  },
  formTitle: {marginBottom: vs(12)},
  fieldWrap: {marginBottom: vs(12)},
  fieldLabel: {marginBottom: vs(4)},
  input: {
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    fontSize: ms(14),
    color: Colors.textPrimary,
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  inputMulti: {
    minHeight: vs(70),
    textAlignVertical: 'top',
  },
  dropdown: {
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  dropdownList: {
    marginTop: vs(4),
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  dropdownItemActive: {
    backgroundColor: Colors.tealBg,
  },
  toggleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(12),
    paddingVertical: vs(4),
  },
  toggleBox: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(6),
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  toggleBoxOn: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  submitBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(14),
    alignItems: 'center',
    marginTop: vs(4),
  },
  submitBtnDisabled: {
    opacity: 0.5,
  },

  /* ── 4 & 5. Med Cards ─────────────────────────────────── */
  medHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(8),
  },
  medEmoji: {fontSize: ms(24), marginRight: s(10), marginTop: vs(2)},
  medHeaderInfo: {flex: 1},
  catBadge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(8),
    marginLeft: s(8),
  },
  prescriberRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  streakRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginBottom: vs(8),
  },
  streakChip: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(8),
  },
  purposeBox: {
    backgroundColor: Colors.background,
    borderRadius: ms(8),
    padding: s(10),
    marginBottom: vs(10),
  },
  stockSection: {
    marginBottom: vs(10),
  },
  stockHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  stockTrack: {
    height: vs(6),
    backgroundColor: Colors.borderLight,
    borderRadius: ms(3),
    overflow: 'hidden',
  },
  stockFill: {
    height: '100%',
    borderRadius: ms(3),
  },
  doseChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  doseChip: {
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: ms(8),
  },

  bottomSpacer: {height: vs(80)},
});

export default MyMedsTab;
