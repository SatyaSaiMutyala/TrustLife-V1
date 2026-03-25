import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const SUGGESTED_LOGS = [
  {
    icon: 'water-outline',
    label: 'Blood pressure log',
    subtitle: 'Daily home BP readings \u00B7 trend analysis',
  },
  {
    icon: 'flask-outline',
    label: 'Glucose diary',
    subtitle: 'Fasting & post-meal glucose \u00B7 meal links',
  },
  {
    icon: 'heart-outline',
    label: 'Heart rate & HRV',
    subtitle: 'Wearable sync \u00B7 recovery score',
  },
  {
    icon: 'speedometer-outline',
    label: 'Peak flow (asthma)',
    subtitle: 'For Aarav \u00B7 Daily PEF readings',
  },
  {
    icon: 'thermometer-outline',
    label: 'Temperature log',
    subtitle: 'Fever tracking \u00B7 illness episodes',
  },
  {
    icon: 'water-outline',
    label: 'Hydration tracker',
    subtitle: 'Daily water intake \u00B7 target 2.5L',
  },
];

const AddLogTab = () => {
  return (
    <View style={sty.container}>
      {/* Placeholder hero */}
      <View style={sty.heroCard}>
        <Icon
          family="Ionicons"
          name="add-circle-outline"
          size={40}
          color={Colors.primary}
        />
        <AppText
          variant="header"
          color={Colors.textPrimary}
          style={{marginTop: vs(10), textAlign: 'center'}}>
          Add another log type
        </AppText>
        <AppText
          variant="body"
          color={Colors.textSecondary}
          style={{marginTop: vs(6), textAlign: 'center'}}>
          TrustLife can track any health metric over time. Choose a log type to
          start, or create a custom log for anything you want to measure.
        </AppText>
      </View>

      {/* Section header */}
      <AppText
        variant="bodyBold"
        color={Colors.textPrimary}
        style={{marginTop: vs(16), marginBottom: vs(10)}}>
        Suggested logs for your profile
      </AppText>

      {/* 2-column grid */}
      <View style={sty.grid}>
        {SUGGESTED_LOGS.map((item, index) => (
          <TouchableOpacity
            key={index}
            style={sty.optionCard}
            activeOpacity={0.7}>
            <Icon
              family="Ionicons"
              name={item.icon}
              size={20}
              color={Colors.primary}
            />
            <AppText
              variant="bodyBold"
              color={Colors.textPrimary}
              style={{marginTop: vs(6), textAlign: 'center'}}>
              {item.label}
            </AppText>
            <AppText
              variant="caption"
              color={Colors.textSecondary}
              style={{marginTop: vs(3), textAlign: 'center'}}>
              {item.subtitle}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Ghost button */}
      <TouchableOpacity style={sty.ghostButton} activeOpacity={0.7}>
        <Icon
          family="Ionicons"
          name="create-outline"
          size={18}
          color={Colors.primary}
        />
        <AppText
          variant="body"
          color={Colors.primary}
          style={{marginLeft: s(6)}}>
          Create a custom log
        </AppText>
      </TouchableOpacity>

      {/* Blue insight card */}
      <View style={sty.insightCard}>
        <Icon
          family="Ionicons"
          name="bulb-outline"
          size={18}
          color={Colors.blueText}
          style={{marginTop: vs(2)}}
        />
        <AppText
          variant="caption"
          color={Colors.blueText}
          style={{flex: 1, marginLeft: s(8)}}>
          More log types are added regularly. Voice your request to Ayu -- if
          you want to track something specific, just say "I want to log my
          [metric]" and Ayu will set it up.
        </AppText>
      </View>
    </View>
  );
};

const sty = StyleSheet.create({
  container: {
    padding: s(4),
  },
  heroCard: {
    borderWidth: 2,
    borderStyle: 'dashed',
    borderColor: Colors.lightGreen || '#9FE1CB',
    borderRadius: ms(16),
    padding: ms(32),
    alignItems: 'center',
    justifyContent: 'center',
  },
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  optionCard: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: ms(11),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(11),
    alignItems: 'center',
    marginBottom: vs(10),
  },
  ghostButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: '#d4e2db',
    borderRadius: ms(12),
    paddingVertical: vs(11),
    marginTop: vs(6),
    width: '100%',
  },
  insightCard: {
    flexDirection: 'row',
    backgroundColor: Colors.blueBg,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
    padding: ms(12),
    marginTop: vs(12),
  },
});

export default AddLogTab;
