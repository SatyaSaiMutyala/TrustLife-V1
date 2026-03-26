import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../../components/shared/AppText';
import Colors from '../../../constants/colors';
import {OVERVIEW_STATS, RECENT_ACTIVITY, PROFILE_SUMMARY} from '../../../constants/profileData';

const OverviewTab = () => {
  const p = PROFILE_SUMMARY;

  const summaryRows = [
    {label: 'Full Name', value: `${p.firstName} ${p.lastName}`},
    {label: 'Date of Birth', value: `${p.dob} (Age ${p.age})`},
    {label: 'Gender', value: p.gender},
    {label: 'Blood Group', value: p.bloodGroup},
    {label: 'Nationality', value: p.nationality},
    {label: 'Email', value: p.email, action: 'Verify'},
    {label: 'Phone', value: p.phone, action: 'Change'},
  ];

  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Stats Row */}
      <View style={styles.statsGrid}>
        {OVERVIEW_STATS.map((stat, i) => (
          <View key={i} style={styles.statCard}>
            <AppText variant="header" style={styles.statValue}>
              {stat.value}
            </AppText>
            <AppText variant="small" style={styles.statLabel}>
              {stat.label.toUpperCase()}
            </AppText>
          </View>
        ))}
      </View>

      {/* Profile Summary */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>
            Profile Summary
          </AppText>
          <TouchableOpacity style={styles.ghostButton}>
            <AppText variant="small" color={Colors.primary}>
              Edit
            </AppText>
          </TouchableOpacity>
        </View>
        <View style={styles.cardBody}>
          {summaryRows.map((row, i) => (
            <View
              key={i}
              style={[
                styles.infoRow,
                i === summaryRows.length - 1 && styles.noBorder,
              ]}>
              <AppText variant="small" style={styles.infoLabel}>
                {row.label.toUpperCase()}
              </AppText>
              <View style={styles.infoValueWrap}>
                <AppText variant="body" style={styles.infoValue}>
                  {row.value}
                </AppText>
                {row.action && (
                  <TouchableOpacity style={styles.actionPill}>
                    <AppText variant="small" color={Colors.primary}>
                      {row.action}
                    </AppText>
                  </TouchableOpacity>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* Recent Activity */}
      <View style={styles.card}>
        <View style={styles.sectionHeader}>
          <AppText variant="bodyBold" style={styles.sectionTitle}>
            Recent Activity
          </AppText>
        </View>
        <View style={styles.cardBody}>
          {RECENT_ACTIVITY.map((item, i) => (
            <View
              key={i}
              style={[
                styles.activityItem,
                i === RECENT_ACTIVITY.length - 1 && styles.noBorder,
              ]}>
              <View style={styles.activityDot} />
              <View style={styles.activityContent}>
                <AppText variant="body" style={styles.activityText}>
                  {item.text}
                </AppText>
                <AppText variant="caption" color="#A09E9A">
                  {item.time}
                </AppText>
              </View>
            </View>
          ))}
        </View>
      </View>

      <View style={{height: vs(30)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingTop: vs(12),
  },
  statsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
    marginBottom: vs(12),
  },
  statCard: {
    width: '47%',
    backgroundColor: '#FFFFFF',
    borderRadius: ms(16),
    
    
    padding: s(16),
    alignItems: 'center',
  },
  statValue: {
    fontSize: ms(22),
    color: Colors.primary,
    marginBottom: vs(4),
  },
  statLabel: {
    fontSize: ms(9),
    color: '#A09E9A',
    letterSpacing: 0.5,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: ms(16),
    
    
    marginBottom: vs(12),
    overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(16),
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD6',
  },
  sectionTitle: {
    fontSize: ms(14),
    color: '#1A1814',
  },
  ghostButton: {
    backgroundColor: 'transparent',
    
    
    borderRadius: ms(6),
    paddingHorizontal: s(12),
    paddingVertical: vs(4),
  },
  cardBody: {
    padding: s(16),
  },
  infoRow: {
    flexDirection: 'row',
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD6',
  },
  noBorder: {
    borderBottomWidth: 0,
  },
  infoLabel: {
    width: s(110),
    color: '#A09E9A',
    fontSize: ms(11),
  },
  infoValueWrap: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoValue: {
    flex: 1,
    color: '#1A1814',
    fontSize: ms(13),
  },
  actionPill: {
    borderRadius: ms(20),
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    backgroundColor: Colors.tealBg,
  },
  activityItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD6',
  },
  activityDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: Colors.accent,
    marginTop: vs(4),
    marginRight: s(10),
  },
  activityContent: {
    flex: 1,
  },
  activityText: {
    fontSize: ms(13),
    color: '#1A1814',
    marginBottom: vs(2),
  },
});

export default OverviewTab;
