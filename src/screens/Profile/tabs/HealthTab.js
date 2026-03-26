import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../../components/shared/AppText';
import Colors from '../../../constants/colors';
import {
  VITALS,
  CONDITIONS,
  MEDICATIONS_LIST,
  ALLERGIES,
  SURGICAL_HISTORY,
  IMMUNISATIONS,
} from '../../../constants/profileData';

const stagePillColors = {
  managed: {bg: Colors.tealBg, color: Colors.accent},
  active: {bg: '#FDF3E7', color: '#B5600E'},
  monitor: {bg: '#EAF2FB', color: '#1A5276'},
  resolved: {bg: '#F2EFE8', color: '#A09E9A'},
};

const SectionCard = ({title, children}) => (
  <View style={styles.card}>
    <View style={styles.sectionHeader}>
      <AppText variant="bodyBold" style={styles.sectionTitle}>{title}</AppText>
    </View>
    <View style={styles.cardBody}>{children}</View>
  </View>
);

const StagePill = ({label, type}) => {
  const c = stagePillColors[type] || stagePillColors.resolved;
  return (
    <View style={[styles.pill, {backgroundColor: c.bg}]}>
      <AppText variant="small" style={{color: c.color, fontSize: ms(10)}}>
        {label}
      </AppText>
    </View>
  );
};

const HealthTab = () => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Current Vitals */}
      <SectionCard title="Current Vitals">
        <View style={styles.vitalsGrid}>
          {VITALS.map((v, i) => (
            <View key={i} style={styles.vitalCard}>
              <AppText variant="header" style={styles.vitalValue}>
                {v.value}
              </AppText>
              <AppText variant="small" style={styles.vitalUnit}>
                {v.unit.toUpperCase()}
              </AppText>
              <AppText variant="small" style={styles.vitalLabel}>
                {v.label}
              </AppText>
              {v.status && (
                <AppText
                  variant="small"
                  style={[
                    styles.vitalStatus,
                    {color: v.statusWarn ? '#E9A23A' : Colors.accent},
                  ]}>
                  {v.status}
                </AppText>
              )}
            </View>
          ))}
        </View>
        <View style={styles.infoRowSimple}>
          <AppText variant="small" style={styles.metaText}>
            Last checkup: 14 Jan 2026
          </AppText>
        </View>
      </SectionCard>

      {/* Conditions */}
      <SectionCard title="Conditions">
        {CONDITIONS.map((c, i) => (
          <View
            key={i}
            style={[
              styles.conditionCard,
              i === CONDITIONS.length - 1 && styles.noBorder,
            ]}>
            <View style={[styles.conditionIcon, {backgroundColor: c.bg}]}>
              <AppText style={styles.conditionEmoji}>{c.icon}</AppText>
            </View>
            <View style={styles.conditionContent}>
              <AppText variant="bodyBold" style={styles.conditionName}>
                {c.name}
              </AppText>
              <AppText variant="small" style={styles.metaText}>
                {c.meta}
              </AppText>
              <StagePill label={c.stage} type={c.stageType} />
            </View>
          </View>
        ))}
      </SectionCard>

      {/* Current Medications */}
      <SectionCard title="Current Medications">
        <View style={styles.tableHeader}>
          <AppText variant="small" style={[styles.thCell, {flex: 1.2}]}>MEDICATION</AppText>
          <AppText variant="small" style={styles.thCell}>DOSE</AppText>
          <AppText variant="small" style={[styles.thCell, {flex: 1.3}]}>FREQUENCY</AppText>
          <AppText variant="small" style={[styles.thCell, {flex: 1.1}]}>FOR</AppText>
          <AppText variant="small" style={[styles.thCell, {flex: 0.5}]}>SINCE</AppText>
        </View>
        {MEDICATIONS_LIST.map((m, i) => (
          <View
            key={i}
            style={[
              styles.tableRow,
              i === MEDICATIONS_LIST.length - 1 && styles.noBorder,
            ]}>
            <AppText variant="small" style={[styles.tdCell, {flex: 1.2, color: '#1A1814'}]}>{m.name}</AppText>
            <AppText variant="small" style={styles.tdCell}>{m.dose}</AppText>
            <AppText variant="small" style={[styles.tdCell, {flex: 1.3}]}>{m.freq}</AppText>
            <AppText variant="small" style={[styles.tdCell, {flex: 1.1}]}>{m.forCondition}</AppText>
            <AppText variant="small" style={[styles.tdCell, {flex: 0.5}]}>{m.since}</AppText>
          </View>
        ))}
      </SectionCard>

      {/* Allergies */}
      <SectionCard title="Allergies">
        <View style={styles.tableHeader}>
          <AppText variant="small" style={[styles.thCell, {flex: 1.2}]}>ALLERGEN</AppText>
          <AppText variant="small" style={styles.thCell}>TYPE</AppText>
          <AppText variant="small" style={[styles.thCell, {flex: 1.3}]}>REACTION</AppText>
          <AppText variant="small" style={styles.thCell}>SEVERITY</AppText>
        </View>
        {ALLERGIES.map((a, i) => (
          <View
            key={i}
            style={[
              styles.tableRow,
              i === ALLERGIES.length - 1 && styles.noBorder,
            ]}>
            <AppText variant="small" style={[styles.tdCell, {flex: 1.2, color: '#1A1814'}]}>{a.allergen}</AppText>
            <AppText variant="small" style={styles.tdCell}>{a.type}</AppText>
            <AppText variant="small" style={[styles.tdCell, {flex: 1.3}]}>{a.reaction}</AppText>
            <View style={{flex: 1}}>
              <StagePill label={a.severity} type={a.sevType} />
            </View>
          </View>
        ))}
      </SectionCard>

      {/* Surgical History */}
      <SectionCard title="Surgical History">
        {SURGICAL_HISTORY.map((item, i) => (
          <View
            key={i}
            style={[
              styles.infoRow,
              i === SURGICAL_HISTORY.length - 1 && styles.noBorder,
            ]}>
            <AppText variant="small" style={styles.infoLabel}>
              {item.year}
            </AppText>
            <AppText variant="body" style={styles.infoValue}>
              {item.desc}
            </AppText>
          </View>
        ))}
      </SectionCard>

      {/* Immunisations */}
      <SectionCard title="Immunisations">
        <View style={styles.tableHeader}>
          <AppText variant="small" style={[styles.thCell, {flex: 1.5}]}>VACCINE</AppText>
          <AppText variant="small" style={[styles.thCell, {flex: 1.3}]}>LAST DOSE</AppText>
          <AppText variant="small" style={styles.thCell}>STATUS</AppText>
        </View>
        {IMMUNISATIONS.map((im, i) => (
          <View
            key={i}
            style={[
              styles.tableRow,
              i === IMMUNISATIONS.length - 1 && styles.noBorder,
            ]}>
            <AppText variant="small" style={[styles.tdCell, {flex: 1.5, color: '#1A1814'}]}>{im.vaccine}</AppText>
            <AppText variant="small" style={[styles.tdCell, {flex: 1.3}]}>{im.lastDose}</AppText>
            <View style={{flex: 1}}>
              <StagePill label={im.status} type={im.statusType} />
            </View>
          </View>
        ))}
      </SectionCard>

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
  cardBody: {
    padding: s(16),
  },
  noBorder: {
    borderBottomWidth: 0,
  },

  /* Vitals Grid */
  vitalsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
  },
  vitalCard: {
    width: '47%',
    backgroundColor: '#FAFAF8',
    borderRadius: ms(12),
    padding: s(12),
    alignItems: 'center',
  },
  vitalValue: {
    fontSize: ms(20),
    color: '#1A1814',
  },
  vitalUnit: {
    fontSize: ms(9),
    color: '#A09E9A',
    letterSpacing: 0.5,
    marginTop: vs(2),
  },
  vitalLabel: {
    fontSize: ms(11),
    color: '#6B6860',
    marginTop: vs(4),
  },
  vitalStatus: {
    fontSize: ms(10),
    marginTop: vs(4),
  },
  infoRowSimple: {
    marginTop: vs(12),
    paddingTop: vs(10),
    borderTopWidth: 1,
    borderTopColor: '#E0DDD6',
  },
  metaText: {
    fontSize: ms(11),
    color: '#A09E9A',
  },

  /* Conditions */
  conditionCard: {
    flexDirection: 'row',
    paddingVertical: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD6',
  },
  conditionIcon: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(12),
  },
  conditionEmoji: {
    fontSize: ms(18),
  },
  conditionContent: {
    flex: 1,
    gap: vs(3),
  },
  conditionName: {
    fontSize: ms(13),
    color: '#1A1814',
  },
  pill: {
    alignSelf: 'flex-start',
    borderRadius: ms(20),
    paddingVertical: vs(3),
    paddingHorizontal: s(10),
    marginTop: vs(2),
  },

  /* Table */
  tableHeader: {
    flexDirection: 'row',
    paddingBottom: vs(8),
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD6',
    marginBottom: vs(4),
  },
  thCell: {
    flex: 1,
    fontSize: ms(9),
    color: '#A09E9A',
    letterSpacing: 0.5,
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD6',
  },
  tdCell: {
    flex: 1,
    fontSize: ms(11),
    color: '#6B6860',
  },

  /* Info rows (surgical history) */
  infoRow: {
    flexDirection: 'row',
    paddingVertical: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: '#E0DDD6',
  },
  infoLabel: {
    width: s(50),
    color: '#A09E9A',
    fontSize: ms(11),
    fontWeight: '600',
  },
  infoValue: {
    flex: 1,
    color: '#1A1814',
    fontSize: ms(13),
  },
});

export default HealthTab;
