import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView, TextInput} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../../components/shared/AppText';
import Colors from '../../../constants/colors';

/* ── inline data ────────────────────────────────────── */

const PREF_FIELDS = [
  {label: 'Email Notifications', value: 'All updates'},
  {label: 'SMS Alerts', value: 'Enabled'},
  {label: 'Language', value: 'English'},
  {label: 'Timezone', value: 'Asia/Kolkata (IST +5:30)'},
  {label: 'Date Format', value: 'DD/MM/YYYY'},
  {label: 'Currency', value: 'INR (\u20B9)'},
];

/* ── Component ──────────────────────────────────────── */

const PreferencesTab = () => {
  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>

      {/* ── Notification Preferences ─────────────────── */}
      <View style={styles.card}>
        <View style={styles.cardHeaderRow}>
          <AppText variant="bodyBold" style={styles.cardTitle}>Notification Preferences</AppText>
          <TouchableOpacity style={styles.saveBtn} activeOpacity={0.7}>
            <AppText variant="small" color={Colors.white} style={styles.saveBtnText}>Save</AppText>
          </TouchableOpacity>
        </View>

        <View style={styles.grid}>
          {PREF_FIELDS.map((field, idx) => (
            <View key={idx} style={styles.gridItem}>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.fieldLabel}>
                {field.label}
              </AppText>
              <View style={styles.inputWrapper}>
                <TextInput
                  style={styles.input}
                  value={field.value}
                  editable={false}
                  pointerEvents="none"
                />
                <AppText style={styles.chevron}>{'\u25BE'}</AppText>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={{height: vs(32)}} />
    </ScrollView>
  );
};

/* ── styles ─────────────────────────────────────────── */

const styles = StyleSheet.create({
  root: {flex: 1, padding: s(16)},

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    
    
    padding: s(16),
    marginBottom: vs(16),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(14),
  },
  cardTitle: {fontSize: ms(15)},

  /* Save button */
  saveBtn: {
    backgroundColor: Colors.accent,
    paddingHorizontal: s(16),
    paddingVertical: vs(6),
    borderRadius: ms(8),
  },
  saveBtnText: {fontSize: ms(11), fontWeight: '600'},

  /* 2-column grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginHorizontal: -s(6),
  },
  gridItem: {
    width: '50%',
    paddingHorizontal: s(6),
    marginBottom: vs(14),
  },
  fieldLabel: {fontSize: ms(11), marginBottom: vs(4)},

  /* Dropdown-style input */
  inputWrapper: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F9F8F5',
    borderRadius: ms(10),
    
    
    paddingHorizontal: s(10),
    paddingVertical: vs(8),
  },
  input: {
    flex: 1,
    fontSize: ms(12),
    color: Colors.textPrimary,
    padding: 0,
    fontWeight: '500',
  },
  chevron: {
    fontSize: ms(12),
    color: Colors.textTertiary,
    marginLeft: s(4),
  },
});

export default PreferencesTab;
