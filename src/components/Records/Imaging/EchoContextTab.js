import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const EchoContextTab = () => {
  const renderVisitLink = () => (
    <View style={styles.card}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
        <View style={[styles.iconCircle, {backgroundColor: Colors.blueBg}]}>
          <Icon family="Ionicons" name="person-outline" size={18} color={Colors.blueText} />
        </View>
        <View style={{flex: 1}}>
          <AppText variant="bodyBold">Dr. Suresh Rao</AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
            18 Sep 2025
          </AppText>
        </View>
        <Icon family="Ionicons" name="chevron-forward-outline" size={18} color={Colors.textTertiary} />
      </View>
      <View style={[styles.quoteBox, {marginTop: vs(10)}]}>
        <Icon family="Ionicons" name="chatbubble-outline" size={14} color={Colors.textSecondary} />
        <AppText variant="caption" color={Colors.textSecondary} style={{flex: 1, fontStyle: 'italic'}}>
          "Echo looks reassuring. Systolic function is preserved. The Grade 1 diastolic pattern is expected with your BP history - focus on salt restriction and compliance."
        </AppText>
      </View>
    </View>
  );

  const renderInsight = () => (
    <View style={[styles.insightBox, {backgroundColor: Colors.amberBg}]}>
      <Icon family="Ionicons" name="information-circle-outline" size={18} color={Colors.amberText} />
      <View style={{flex: 1}}>
        <AppText variant="bodyBold" color={Colors.amberText}>
          Grade 1 Diastolic Dysfunction
        </AppText>
        <AppText variant="caption" color={Colors.amberText} style={{marginTop: vs(4)}}>
          This is the mildest form of diastolic impairment, indicating that your heart muscle is slightly slower to relax between beats. It is commonly seen in patients with longstanding hypertension and is not typically associated with symptoms at this stage.
        </AppText>
        <AppText variant="caption" color={Colors.amberText} style={{marginTop: vs(6)}}>
          Maintaining good blood pressure control (target less than 130/80) is the most effective way to prevent progression to higher grades of diastolic dysfunction.
        </AppText>
      </View>
    </View>
  );

  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>Visit Context</AppText>
      {renderVisitLink()}
      <AppText variant="bodyBold" style={{marginBottom: vs(8), marginTop: vs(4)}}>Clinical Insight</AppText>
      {renderInsight()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: s(4),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
    marginBottom: vs(10),
  },
  iconCircle: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    alignItems: 'center',
    justifyContent: 'center',
  },
  quoteBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    padding: ms(10),
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(8),
    padding: ms(12),
    borderRadius: ms(11),
    marginBottom: vs(12),
  },
});

export default EchoContextTab;
