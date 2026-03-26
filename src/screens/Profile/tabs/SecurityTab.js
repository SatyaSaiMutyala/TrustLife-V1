import React from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../../components/shared/AppText';
import Colors from '../../../constants/colors';
import {SECURITY_ITEMS} from '../../../constants/profileData';

/* ── helpers ────────────────────────────────────────── */

const ICON_BG = {
  green: Colors.tealBg,
  amber: '#FDF3E7',
  rose:  '#FAEAED',
};

const STATUS_STYLE = {
  enabled:  {bg: Colors.tealBg, text: Colors.accent},
  warning:  {bg: '#FDF3E7',     text: '#B5600E'},
  disabled: {bg: '#FAEAED',     text: '#9B3A4A'},
  action:   null, // rendered as button instead
};

/* ── Component ──────────────────────────────────────── */

const SecurityTab = () => {
  return (
    <ScrollView style={styles.root} showsVerticalScrollIndicator={false}>

      {/* ── Account Security ─────────────────────────── */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.cardTitle}>Account Security</AppText>

        {SECURITY_ITEMS.map((item, idx) => {
          const iconBg = ICON_BG[item.bg] || Colors.tealBg;
          const sts = STATUS_STYLE[item.statusType];

          return (
            <View key={idx} style={[styles.secRow, idx < SECURITY_ITEMS.length - 1 && styles.secRowBorder]}>
              {/* Icon box */}
              <View style={[styles.iconBox, {backgroundColor: iconBg}]}>
                <AppText style={styles.iconEmoji}>{item.icon}</AppText>
              </View>

              {/* Text */}
              <View style={styles.secTextCol}>
                <AppText variant="bodyBold" style={styles.secTitle}>{item.title}</AppText>
                <AppText variant="caption" color={Colors.textSecondary} style={styles.secDesc}>
                  {item.desc}
                </AppText>
              </View>

              {/* Status pill or action button */}
              {item.statusType === 'action' ? (
                <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                  <AppText variant="small" color={Colors.accent} style={styles.actionText}>
                    {item.status}
                  </AppText>
                </TouchableOpacity>
              ) : (
                <View style={[styles.statusPill, {backgroundColor: sts.bg}]}>
                  <AppText variant="small" color={sts.text} style={styles.statusText}>
                    {item.status}
                  </AppText>
                </View>
              )}
            </View>
          );
        })}
      </View>

      {/* ── Privacy ──────────────────────────────────── */}
      <View style={styles.card}>
        <AppText variant="bodyBold" style={styles.cardTitle}>Privacy</AppText>

        {/* Profile Visibility */}
        <View style={[styles.privRow, styles.privRowBorder]}>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.privLabel}>Profile Visibility</AppText>
            <AppText variant="body">Private</AppText>
          </View>
        </View>

        {/* Data Export */}
        <View style={[styles.privRow, styles.privRowBorder]}>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.privLabel}>Data Export</AppText>
            <AppText variant="body">Download your data</AppText>
          </View>
          <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
            <AppText variant="small" color={Colors.accent} style={styles.actionText}>Download</AppText>
          </TouchableOpacity>
        </View>

        {/* Account Deletion */}
        <View style={styles.privRow}>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.privLabel}>Account Deletion</AppText>
            <AppText variant="body">Permanently delete your account</AppText>
          </View>
          <TouchableOpacity style={styles.deleteBtn} activeOpacity={0.7}>
            <AppText variant="small" color="#9B3A4A" style={styles.actionText}>Delete</AppText>
          </TouchableOpacity>
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
  cardTitle: {fontSize: ms(15), marginBottom: vs(12)},

  /* Security row */
  secRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
  },
  secRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F0EEEA'},
  iconBox: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(12),
  },
  iconEmoji: {fontSize: ms(16)},
  secTextCol: {flex: 1, marginRight: s(8)},
  secTitle: {fontSize: ms(13)},
  secDesc: {fontSize: ms(11), marginTop: vs(1)},

  /* Status pill */
  statusPill: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(10),
  },
  statusText: {fontSize: ms(10), fontWeight: '600'},

  /* Action button */
  actionBtn: {
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: ms(8),
    backgroundColor: Colors.tealBg,
  },
  actionText: {fontSize: ms(11), fontWeight: '600'},

  /* Delete button */
  deleteBtn: {
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: ms(8),
    backgroundColor: '#FAEAED',
  },

  /* Privacy rows */
  privRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  privRowBorder: {borderBottomWidth: 1, borderBottomColor: '#F0EEEA'},
  privLabel: {fontSize: ms(11), marginBottom: vs(2)},
});

export default SecurityTab;
