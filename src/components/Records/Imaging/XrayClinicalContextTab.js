import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const whyOrdered = [
  {
    icon: 'calendar-outline',
    label: 'Annual baseline',
    detail: 'Routine screening for T2DM + HTN patients',
  },
  {
    icon: 'fitness-outline',
    label: 'Exertional breathlessness',
    detail: 'Reported mild breathlessness on stairs since Jun 2025',
  },
  {
    icon: 'medkit-outline',
    label: 'T2DM + HTN baseline',
    detail: 'Cardiac and pulmonary baseline for ongoing management',
  },
];

const connections = [
  {
    condition: 'HTN',
    status: 'Protected',
    icon: 'checkmark-circle-outline',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
    detail: 'No cardiomegaly despite 5+ years of hypertension',
  },
  {
    condition: 'T2DM',
    status: 'Normal',
    icon: 'checkmark-circle-outline',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
    detail: 'No pulmonary oedema or vascular changes',
  },
  {
    condition: 'Breathlessness',
    status: 'Excluded',
    icon: 'checkmark-circle-outline',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
    detail: 'No cardiac or pulmonary cause identified on X-ray',
  },
];

const XrayClinicalContextTab = () => {
  const renderVisitLink = () => (
    <View style={styles.visitCard}>
      <View style={styles.visitHeader}>
        <View style={styles.visitIcon}>
          <Icon
            family="Ionicons"
            name="person-outline"
            size={ms(18)}
            color={Colors.tealText}
          />
        </View>
        <View style={{flex: 1}}>
          <AppText variant="bodyBold" color={Colors.tealText}>
            Dr. Suresh Rao
          </AppText>
          <AppText variant="caption" color={Colors.tealText} style={{opacity: 0.8}}>
            18 Sep 2025 -- Consultation visit
          </AppText>
        </View>
        <Icon
          family="Ionicons"
          name="chevron-forward"
          size={ms(16)}
          color={Colors.tealText}
        />
      </View>
      <View style={styles.quoteBox}>
        <Icon
          family="Ionicons"
          name="chatbubble-outline"
          size={ms(14)}
          color={Colors.tealText}
        />
        <AppText
          variant="caption"
          color={Colors.tealText}
          style={{flex: 1, marginLeft: s(6), fontStyle: 'italic'}}>
          "Chest X-ray is completely normal. No cardiac enlargement or lung
          pathology. Breathlessness is likely deconditioning, not cardiac."
        </AppText>
      </View>
    </View>
  );

  const renderWhyOrdered = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
        Why this X-ray was ordered
      </AppText>
      {whyOrdered.map((item, i) => (
        <View
          key={i}
          style={[
            styles.reasonRow,
            i < whyOrdered.length - 1 && styles.rowBorder,
          ]}>
          <View style={styles.reasonIcon}>
            <Icon
              family="Ionicons"
              name={item.icon}
              size={ms(16)}
              color={Colors.primary}
            />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold">{item.label}</AppText>
            <AppText
              variant="caption"
              color={Colors.textSecondary}
              style={{marginTop: vs(2)}}>
              {item.detail}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  const renderConnections = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
        Condition connections
      </AppText>
      {connections.map((item, i) => (
        <View
          key={i}
          style={[
            styles.connRow,
            i < connections.length - 1 && styles.rowBorder,
          ]}>
          <View style={{flex: 1}}>
            <View style={styles.connHeader}>
              <AppText variant="bodyBold">{item.condition}</AppText>
              <View style={[styles.pill, {backgroundColor: item.statusBg}]}>
                <Icon
                  family="Ionicons"
                  name={item.icon}
                  size={ms(12)}
                  color={item.statusColor}
                />
                <AppText
                  variant="small"
                  color={item.statusColor}
                  style={{marginLeft: s(3)}}>
                  {item.status}
                </AppText>
              </View>
            </View>
            <AppText
              variant="caption"
              color={Colors.textSecondary}
              style={{marginTop: vs(2)}}>
              {item.detail}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {renderVisitLink()}
      {renderWhyOrdered()}
      {renderConnections()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: s(4),
    gap: vs(10),
  },
  visitCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(14),
    padding: ms(13),
  },
  visitHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  visitIcon: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: vs(10),
    paddingTop: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: Colors.tealText + '30',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(10),
    gap: s(10),
  },
  reasonIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  connRow: {
    paddingVertical: vs(10),
  },
  connHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  pill: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
});

export default XrayClinicalContextTab;
