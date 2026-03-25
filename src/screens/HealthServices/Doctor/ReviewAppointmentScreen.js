import React, {useState, useEffect} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const ReviewAppointmentScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {appointment} = route.params || {};
  const [patient, setPatient] = useState(null);

  useEffect(() => {
    if (route.params?.patient) {
      setPatient(route.params.patient);
    }
  }, [route.params?.patient]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}>
          <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={{flex: 1, marginLeft: s(12)}}>
          <AppText variant="header" color={Colors.white}>Review Appointment Details</AppText>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Doctor Card */}
        <View style={styles.card}>
          <View style={styles.doctorRow}>
            <View style={styles.doctorAvatar}>
              <Icon family="Ionicons" name="person-circle-outline" size={42} color={Colors.primary} />
            </View>
            <View style={{flex: 1, marginLeft: s(12)}}>
              <AppText variant="caption" color={Colors.textSecondary}>{appointment?.specialty || 'Cardiologist'}</AppText>
              <AppText variant="bodyBold">{appointment?.doctorName || 'Dr. Priya Sharma'}</AppText>
              <AppText variant="small" color={Colors.textTertiary}>ID: {appointment?.doctorId || 'D001'}</AppText>
            </View>
            <View style={styles.ratingBadge}>
              <Icon family="Ionicons" name="star" size={12} color="#f59e0b" />
              <AppText variant="small" color={Colors.textPrimary} style={{marginLeft: s(3), fontWeight: '600'}}>
                {appointment?.rating || 4.8}
              </AppText>
            </View>
          </View>
        </View>

        {/* Appointment Details */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Icon family="Ionicons" name="calendar-outline" size={18} color={Colors.primary} />
            <AppText variant="bodyBold" style={{marginLeft: s(8)}}>Appointment Details</AppText>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary}>Date</AppText>
              <AppText variant="body">{appointment?.date || '2026-03-18'}</AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary}>Time</AppText>
              <AppText variant="body">{appointment?.time || '10:00 AM'}</AppText>
            </View>
          </View>
          <TouchableOpacity style={styles.changeDatePill} activeOpacity={0.7}>
            <Icon family="Ionicons" name="calendar-outline" size={14} color={Colors.primary} />
            <AppText variant="small" color={Colors.primary} style={{marginLeft: s(4), fontWeight: '600'}}>Change Date</AppText>
          </TouchableOpacity>
        </View>

        {/* Patient Details */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Icon family="Ionicons" name="person-outline" size={18} color={Colors.primary} />
            <AppText variant="bodyBold" style={{marginLeft: s(8)}}>Patient Details</AppText>
          </View>
          {patient ? (
            <View style={styles.cardBody}>
              <View style={styles.detailRow}>
                <AppText variant="caption" color={Colors.textSecondary}>Name</AppText>
                <AppText variant="body">{patient.fullName}</AppText>
              </View>
              <View style={styles.detailRow}>
                <AppText variant="caption" color={Colors.textSecondary}>Date of Birth</AppText>
                <AppText variant="body">{patient.dob}</AppText>
              </View>
              <View style={styles.detailRow}>
                <AppText variant="caption" color={Colors.textSecondary}>Gender</AppText>
                <AppText variant="body">{patient.gender}</AppText>
              </View>
              <View style={styles.detailRow}>
                <AppText variant="caption" color={Colors.textSecondary}>Mobile</AppText>
                <AppText variant="body">{patient.mobile}</AppText>
              </View>
              <TouchableOpacity
                activeOpacity={0.7}
                onPress={() => navigation.navigate('PatientDetails', {appointment})}>
                <AppText variant="small" color={Colors.primary} style={{fontWeight: '600', marginTop: vs(6)}}>Change</AppText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => navigation.navigate('PatientDetails', {appointment})}>
              <AppText variant="bodyBold" color={Colors.primary}>ADD</AppText>
            </TouchableOpacity>
          )}
        </View>

        {/* Price Breakdown */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Icon family="Ionicons" name="wallet-outline" size={18} color={Colors.primary} />
            <AppText variant="bodyBold" style={{marginLeft: s(8)}}>Price Breakdown</AppText>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.detailRow}>
              <AppText variant="body" color={Colors.textSecondary}>Consultation Fee</AppText>
              <AppText variant="body">Rs. 600</AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText variant="body" color={Colors.textSecondary}>Platform Fee</AppText>
              <AppText variant="body">Rs. 20</AppText>
            </View>
            <View style={styles.dashedDivider} />
            <View style={styles.detailRow}>
              <AppText variant="bodyBold">Total</AppText>
              <AppText variant="bodyBold" color={Colors.primary}>Rs. 620</AppText>
            </View>
          </View>
        </View>

        {/* Policies */}
        <TouchableOpacity style={styles.policiesRow} activeOpacity={0.7}>
          <Icon family="Ionicons" name="document-text-outline" size={16} color={Colors.primary} />
          <AppText variant="caption" color={Colors.primary} style={{marginLeft: s(6), fontWeight: '500'}}>
            Cancellation and Refund Policies
          </AppText>
          <Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.primary} />
        </TouchableOpacity>

        <View style={{height: vs(100)}} />
      </ScrollView>

      {/* Bottom Pay Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.payBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('PaymentSuccess', {appointment})}>
          <AppText variant="bodyBold" color={Colors.white}>Pay Rs. 620</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingTop: vs(14),
    paddingBottom: vs(14),
  },
  backBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    padding: s(16),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: ms(16),
    marginBottom: vs(12),
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary,
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  doctorAvatar: {
    width: ms(50),
    height: ms(50),
    borderRadius: ms(25),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tealBg,
    borderRadius: ms(12),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
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
  changeDatePill: {
    flexDirection: 'row',
    alignItems: 'center',
    alignSelf: 'flex-start',
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: ms(20),
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    marginTop: vs(12),
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderStyle: 'dashed',
    borderBottomColor: Colors.borderLight,
    marginVertical: vs(4),
  },
  policiesRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(4),
    gap: s(2),
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
  payBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ReviewAppointmentScreen;
