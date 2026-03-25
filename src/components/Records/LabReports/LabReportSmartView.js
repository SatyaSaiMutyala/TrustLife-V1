import React from 'react';
import {View, ScrollView, Text, TouchableOpacity, StyleSheet} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

/* ─── Data ─── */

const insightCards = [
  {
    borderColor: Colors.red,
    bg: Colors.redBg,
    iconColor: Colors.redText,
    icon: 'flask-outline',
    title: 'HbA1c 7.8% -- rising',
    arrow: '\u2191',
    detail:
      'PM Metformin adherence dropped to 71% last quarter. Average sleep only 5.9 h -- both drive fasting glucose up.',
  },
  {
    borderColor: Colors.teal,
    bg: Colors.tealBg,
    iconColor: Colors.tealText,
    icon: 'beaker-outline',
    title: 'LDL 118 -- target achieved',
    arrow: '\u2713',
    detail:
      'Atorvastatin 97% adherence over 4 years. LDL consistently below 120 since mid-2023.',
  },
  {
    borderColor: Colors.amber,
    bg: Colors.amberBg,
    iconColor: Colors.amberText,
    icon: 'water-outline',
    title: 'Haemoglobin 11.8 -- mild anaemia',
    arrow: '',
    detail:
      'Likely B12 depletion from 6.5 years on Metformin. Methylcobalamin supplementation started.',
  },
  {
    borderColor: Colors.blue,
    bg: Colors.blueBg,
    iconColor: Colors.blueText,
    icon: 'medical-outline',
    title: 'Kidneys stable -- eGFR 72, ACR 18',
    arrow: '',
    detail:
      'Both within safe range for stage G2. No progression since last check.',
  },
];

const connectionChains = [
  {
    pills: [
      {label: 'HbA1c 7.8%', bg: Colors.redBg, color: Colors.redText},
      {label: 'PM dose 71%', bg: Colors.amberBg, color: Colors.amberText},
      {label: 'Sleep 5.9h', bg: Colors.amberBg, color: Colors.amberText},
    ],
  },
  {
    pills: [
      {label: 'Hb 11.8 \u2193', bg: Colors.amberBg, color: Colors.amberText},
      {label: 'B12 depletion', bg: Colors.purpleBg, color: Colors.purpleText},
      {label: 'Metformin 6.5yr', bg: Colors.blueBg, color: Colors.blueText},
    ],
  },
  {
    pills: [
      {label: 'LDL 118 \u2713', bg: Colors.tealBg, color: Colors.tealText},
      {label: 'Atorva 97%', bg: Colors.tealBg, color: Colors.tealText},
      {label: '4yr consistent', bg: Colors.tealBg, color: Colors.tealText},
    ],
  },
];

const actionItems = [
  {label: 'Methylcobalamin started', status: 'Done', statusBg: Colors.tealBg, statusColor: Colors.tealText, icon: 'checkmark-circle-outline'},
  {label: 'B12 level ordered', status: 'Done', statusBg: Colors.tealBg, statusColor: Colors.tealText, icon: 'checkmark-circle-outline'},
  {label: 'Eye referral booked', status: 'Done', statusBg: Colors.tealBg, statusColor: Colors.tealText, icon: 'checkmark-circle-outline'},
  {label: 'Set PM Metformin alarm', status: 'Urgent !', statusBg: Colors.redBg, statusColor: Colors.redText, icon: 'alert-circle-outline'},
  {label: 'Switch to brown rice', status: 'Pending ~', statusBg: Colors.amberBg, statusColor: Colors.amberText, icon: 'time-outline'},
];

const gridValues = [
  {label: 'HbA1c', value: '7.8%', bg: Colors.redBg, color: Colors.redText, key: 'hba1c'},
  {label: 'FPG', value: '8.4', bg: Colors.redBg, color: Colors.redText, key: 'fpg'},
  {label: 'Hb', value: '11.8', bg: Colors.amberBg, color: Colors.amberText, key: 'hb'},
  {label: 'LDL', value: '118', bg: Colors.tealBg, color: Colors.tealText, key: 'ldl'},
  {label: 'TG', value: '162', bg: Colors.amberBg, color: Colors.amberText, key: 'tg'},
  {label: 'eGFR', value: '72', bg: Colors.tealBg, color: Colors.tealText, key: 'egfr'},
  {label: 'ACR', value: '18', bg: Colors.tealBg, color: Colors.tealText, key: 'acr'},
  {label: 'HDL', value: '48', bg: Colors.amberBg, color: Colors.amberText, key: 'hdl'},
  {label: 'TSH', value: '2.4', bg: Colors.tealBg, color: Colors.tealText, key: 'tsh'},
  {label: 'eAG', value: '11.0', bg: Colors.redBg, color: Colors.redText, key: 'eag'},
  {label: 'Total Chol', value: '194', bg: Colors.tealBg, color: Colors.tealText, key: 'tc'},
  {label: 'Non-HDL', value: '146', bg: Colors.tealBg, color: Colors.tealText, key: 'nhdl'},
  {label: 'Creatinine', value: '0.84', bg: Colors.tealBg, color: Colors.tealText, key: 'cr'},
  {label: 'BUN', value: '14', bg: Colors.tealBg, color: Colors.tealText, key: 'bun'},
  {label: 'WBC', value: '6.2k', bg: Colors.tealBg, color: Colors.tealText, key: 'wbc'},
  {label: 'Platelets', value: '224k', bg: Colors.tealBg, color: Colors.tealText, key: 'plt'},
  {label: 'MCV', value: '88', bg: Colors.tealBg, color: Colors.tealText, key: 'mcv'},
  {label: 'B12', value: 'Pending', bg: Colors.redBg, color: Colors.redText, key: 'b12'},
];

/* ─── Component ─── */

const LabReportSmartView = ({onValuePress}) => {
  const renderNarrative = () => (
    <View style={styles.narrativeBanner}>
      <AppText variant="bodyBold" color={Colors.white}>
        Your 3 Mar 2026 report
      </AppText>
      <AppText
        variant="caption"
        color="rgba(255,255,255,0.85)"
        style={{marginTop: vs(4)}}>
        18 parameters tested. 4 flagged, 3 borderline, 11 normal. Key areas
        needing attention: glycaemic control and haemoglobin. Lipids and kidney
        function remain stable.
      </AppText>
    </View>
  );

  const renderInsights = () => (
    <View style={{gap: vs(8)}}>
      {insightCards.map((item, i) => (
        <View
          key={i}
          style={[
            styles.insightCard,
            {borderColor: item.borderColor, backgroundColor: item.bg},
          ]}>
          <View style={[styles.insightIcon, {backgroundColor: item.bg}]}>
            <Icon
              family="Ionicons"
              name={item.icon}
              size={ms(18)}
              color={item.iconColor}
            />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={item.iconColor}>
              {item.title}
              {item.arrow ? ` ${item.arrow}` : ''}
            </AppText>
            <AppText
              variant="caption"
              color={item.iconColor}
              style={{marginTop: vs(2), opacity: 0.85}}>
              {item.detail}
            </AppText>
          </View>
        </View>
      ))}
    </View>
  );

  const renderConnectionChain = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        How these findings connect
      </AppText>
      {connectionChains.map((chain, ci) => (
        <View
          key={ci}
          style={[
            styles.chainRow,
            ci < connectionChains.length - 1 && styles.rowBorder,
          ]}>
          {chain.pills.map((pill, pi) => (
            <React.Fragment key={pi}>
              {pi > 0 && (
                <Icon
                  family="Ionicons"
                  name="arrow-forward"
                  size={ms(12)}
                  color={Colors.textTertiary}
                />
              )}
              <View style={[styles.pill, {backgroundColor: pill.bg}]}>
                <Text
                  style={[
                    styles.pillText,
                    {color: pill.color, fontSize: ms(9)},
                  ]}>
                  {pill.label}
                </Text>
              </View>
            </React.Fragment>
          ))}
        </View>
      ))}
    </View>
  );

  const renderActions = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
        Actions
      </AppText>
      {actionItems.map((item, i) => (
        <View
          key={i}
          style={[
            styles.actionRow,
            i < actionItems.length - 1 && styles.rowBorder,
          ]}>
          <View style={[styles.statusPill, {backgroundColor: item.statusBg}]}>
            <AppText variant="small" color={item.statusColor}>
              {item.status}
            </AppText>
          </View>
          <AppText variant="caption" style={{flex: 1, marginLeft: s(8)}}>
            {item.label}
          </AppText>
          <Icon
            family="Ionicons"
            name={item.icon}
            size={ms(16)}
            color={item.statusColor}
          />
        </View>
      ))}
    </View>
  );

  const renderGrid = () => (
    <View style={styles.card}>
      <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
        All 18 values
      </AppText>
      <View style={styles.gridContainer}>
        {gridValues.map((item, i) => (
          <TouchableOpacity
            key={i}
            activeOpacity={0.7}
            onPress={() => onValuePress && onValuePress(item.key)}
            style={[styles.gridCell, {backgroundColor: item.bg}]}>
            <Text
              style={[
                styles.gridValue,
                {color: item.color, includeFontPadding: false},
              ]}>
              {item.value}
            </Text>
            <Text
              style={[
                styles.gridLabel,
                {color: item.color, includeFontPadding: false},
              ]}>
              {item.label}
            </Text>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {renderNarrative()}
      {renderInsights()}
      {renderConnectionChain()}
      {renderActions()}
      {renderGrid()}
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
  narrativeBanner: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    padding: ms(14),
  },
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(10),
    borderWidth: 0.5,
    borderRadius: ms(12),
    padding: ms(12),
  },
  insightIcon: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
  },
  chainRow: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: s(4),
    paddingVertical: vs(8),
  },
  pill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(3),
    borderRadius: ms(10),
  },
  pillText: {
    fontWeight: '600',
    includeFontPadding: false,
  },
  actionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  statusPill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(6),
  },
  gridCell: {
    width: '31.5%',
    alignItems: 'center',
    paddingVertical: vs(10),
    borderRadius: ms(10),
  },
  gridValue: {
    fontSize: ms(14),
    fontWeight: '700',
  },
  gridLabel: {
    fontSize: ms(9),
    fontWeight: '500',
    marginTop: vs(2),
  },
});

export default LabReportSmartView;
