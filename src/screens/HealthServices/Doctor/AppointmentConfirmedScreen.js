import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const AppointmentConfirmedScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const route = useRoute();
  const {appointment} = route.params || {};

  const appointmentId = appointment?.id || 'APT' + Date.now();
  const transactionId = appointment?.transactionId || 'TXN' + Date.now();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <ScrollView
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>

        {/* Top Green Block */}
        <View style={[styles.topBlock, {paddingTop: insets.top}]}>
          <View style={styles.checkCircle}>
            <Icon family="Ionicons" name="checkmark" size={40} color={Colors.white} />
          </View>

          <AppText variant="screenName" style={{marginTop: vs(16)}}>
            Appointment Confirmed
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(6), textAlign: 'center'}}>
            Your appointment has been booked successfully. Please arrive on time.
          </AppText>

          <View style={styles.earlyPill}>
            <Icon family="Ionicons" name="time-outline" size={14} color={Colors.primary} />
            <AppText variant="small" color={Colors.primary} style={{marginLeft: s(4), fontWeight: '600'}}>
              Arrive 10-15 minutes early
            </AppText>
          </View>

          <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(10)}}>
            Appointment ID: {appointmentId}
          </AppText>
        </View>

        {/* Date & Time Card */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Icon family="Ionicons" name="calendar-outline" size={18} color={Colors.primary} />
            <AppText variant="bodyBold" style={{marginLeft: s(8)}}>Date & Time</AppText>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.detailLabel}>Date</AppText>
              <AppText variant="body">{appointment?.date || '2026-03-18'}</AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.detailLabel}>Time</AppText>
              <AppText variant="body">{appointment?.time || '10:00 AM'}</AppText>
            </View>
          </View>
        </View>

        {/* Clinic Address Card */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Icon family="Ionicons" name="location-outline" size={18} color={Colors.primary} />
            <AppText variant="bodyBold" style={{marginLeft: s(8)}}>Clinic Address</AppText>
          </View>
          <View style={styles.cardBody}>
            <AppText variant="body" color={Colors.textSecondary}>
              TrustLife Medical Centre, 4th Floor, HSR Layout, Bangalore - 560102
            </AppText>
            <TouchableOpacity style={styles.directionPill} activeOpacity={0.7}>
              <Icon family="Ionicons" name="navigate-outline" size={16} color={Colors.tealText} />
              <AppText variant="small" color={Colors.tealText} style={{marginLeft: s(4), fontWeight: '600'}}>Direction</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Payment Details Card */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Icon family="Ionicons" name="wallet-outline" size={18} color={Colors.primary} />
            <AppText variant="bodyBold" style={{marginLeft: s(8)}}>Payment Details</AppText>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.detailLabel}>Amount</AppText>
              <AppText variant="bodyBold" color={Colors.primary}>Rs. 620</AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.detailLabel}>Payment via</AppText>
              <AppText variant="body">UPI</AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.detailLabel}>Transaction ID</AppText>
              <AppText variant="body" style={{fontSize: ms(12)}}>{transactionId}</AppText>
            </View>
          </View>
        </View>

        {/* Support */}
        <TouchableOpacity style={styles.supportRow} activeOpacity={0.7}>
          <AppText variant="caption" color={Colors.textSecondary}>Facing an Issue? </AppText>
          <AppText variant="caption" color={Colors.primary} style={{fontWeight: '600'}}>Get Support</AppText>
        </TouchableOpacity>

        <View style={{height: vs(100)}} />
      </ScrollView>

      {/* Bottom Home Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.homeBtn}
          activeOpacity={0.8}
          onPress={() => navigation.reset({index: 0, routes: [{name: 'Home'}]})}>
          <AppText variant="bodyBold" color={Colors.white}>Back to home</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  scrollContent: {
    paddingBottom: vs(24),
  },
  topBlock: {
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    paddingBottom: vs(24),
    paddingHorizontal: s(24),
  },
  checkCircle: {
    width: ms(72),
    height: ms(72),
    borderRadius: ms(36),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  earlyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(20),
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    marginTop: vs(14),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: ms(16),
    marginHorizontal: s(16),
    marginTop: vs(12),
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary,
  },
  cardTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
    paddingBottom: vs(10),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  cardBody: {
    gap: vs(10),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    minWidth: s(90),
  },
  directionPill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    backgroundColor: Colors.tealBg,
    borderRadius: ms(20),
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    marginTop: vs(6),
  },
  supportRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(20),
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    paddingBottom: vs(24),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  homeBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default AppointmentConfirmedScreen;
