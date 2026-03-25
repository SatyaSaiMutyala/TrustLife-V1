import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const cancelReasons = [
  'Schedule conflict',
  'Found another coach',
  'Health issue',
  'Too expensive',
  'No longer needed',
  'Other',
];

const CoachSessionDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {appointment} = route.params || {};
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [selectedReason, setSelectedReason] = useState(null);
  const [feedbackRating, setFeedbackRating] = useState(0);

  const status = appointment?.status || 'Confirmed';
  const isConfirmed = status === 'Confirmed';
  const isCompleted = status === 'Completed';
  const isCancelled = status === 'Cancelled';

  const statusColor = isCancelled
    ? {bg: Colors.redBg, text: Colors.redText}
    : {bg: Colors.tealBg, text: Colors.tealText};

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
          <AppText variant="header" color={Colors.white} numberOfLines={1}>{appointment?.coachName || 'Session Detail'}</AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.6)">{appointment?.date || ''}</AppText>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Session ID & Status */}
        <View style={styles.idRow}>
          <View>
            <AppText variant="caption" color={Colors.textSecondary}>Session ID</AppText>
            <AppText variant="bodyBold">{appointment?.id || 'S001'}</AppText>
          </View>
          <View style={[styles.statusBadge, {backgroundColor: statusColor.bg}]}>
            <AppText variant="small" color={statusColor.text} style={{fontWeight: '600'}}>{status}</AppText>
          </View>
        </View>

        {/* Session Date & Time */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Icon family="Ionicons" name="calendar-outline" size={18} color={Colors.primary} />
            <AppText variant="bodyBold" style={{marginLeft: s(8)}}>Session Date & Time</AppText>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.detailLabel}>Date</AppText>
              <AppText variant="body">{appointment?.date || '2026-03-25'}</AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.detailLabel}>Time</AppText>
              <AppText variant="body">{appointment?.time || '10:00 AM'}</AppText>
            </View>
          </View>
        </View>

        {/* Coach Details */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Icon family="Ionicons" name="person-outline" size={18} color={Colors.primary} />
            <AppText variant="bodyBold" style={{marginLeft: s(8)}}>Coach Details</AppText>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.detailLabel}>Name</AppText>
              <AppText variant="body">{appointment?.coachName || 'Dr. Priya Sharma'}</AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.detailLabel}>Specialty</AppText>
              <AppText variant="body">{appointment?.specialty || 'Nutrition Coach'}</AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.detailLabel}>Rating</AppText>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon family="Ionicons" name="star" size={14} color="#f59e0b" />
                <AppText variant="body" style={{marginLeft: s(4)}}>{appointment?.rating || 4.8}</AppText>
              </View>
            </View>
          </View>
        </View>

        {/* Session Details */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Icon family="Ionicons" name="document-text-outline" size={18} color={Colors.primary} />
            <AppText variant="bodyBold" style={{marginLeft: s(8)}}>Session Details</AppText>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.detailLabel}>Type</AppText>
              <AppText variant="body">{appointment?.sessionType || 'Video Consultation'}</AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.detailLabel}>Address</AppText>
              <AppText variant="body" style={{flex: 1, textAlign: 'right'}} numberOfLines={2}>
                {appointment?.address || 'Online'}
              </AppText>
            </View>
          </View>
        </View>

        {/* Payment Details */}
        <View style={styles.card}>
          <View style={styles.cardTitleRow}>
            <Icon family="Ionicons" name="wallet-outline" size={18} color={Colors.primary} />
            <AppText variant="bodyBold" style={{marginLeft: s(8)}}>Payment Details</AppText>
          </View>
          <View style={styles.cardBody}>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.detailLabel}>Amount</AppText>
              <AppText variant="bodyBold" color={Colors.primary}>
                Rs. {appointment?.amount || 800}
              </AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.detailLabel}>Payment via</AppText>
              <AppText variant="body">{appointment?.paymentMethod || 'UPI'}</AppText>
            </View>
            <View style={styles.detailRow}>
              <AppText variant="caption" color={Colors.textSecondary} style={styles.detailLabel}>Transaction ID</AppText>
              <AppText variant="body" style={{fontSize: ms(12)}}>{appointment?.transactionId || 'TXN20260325001'}</AppText>
            </View>
          </View>
        </View>

        {/* Confirmed Actions */}
        {isConfirmed && (
          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.directionBtn} activeOpacity={0.7}>
              <Icon family="Ionicons" name="navigate-outline" size={18} color={Colors.primary} />
              <AppText variant="bodyBold" color={Colors.primary} style={{marginLeft: s(8)}}>Direction</AppText>
            </TouchableOpacity>
            <TouchableOpacity
              activeOpacity={0.7}
              onPress={() => setShowCancelModal(true)}
              style={{marginTop: vs(12), alignItems: 'center'}}>
              <AppText variant="bodyBold" color={Colors.red}>Cancel Session</AppText>
            </TouchableOpacity>
          </View>
        )}

        {/* Completed Actions */}
        {isCompleted && (
          <View style={styles.actionsSection}>
            <TouchableOpacity style={styles.rescheduleBtn} activeOpacity={0.7}>
              <AppText variant="bodyBold" color={Colors.white}>Reschedule Session</AppText>
            </TouchableOpacity>

            {/* Feedback Section */}
            <View style={styles.feedbackCard}>
              <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>Rate your session</AppText>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4, 5].map(star => (
                  <TouchableOpacity
                    key={star}
                    activeOpacity={0.7}
                    onPress={() => setFeedbackRating(star)}>
                    <Icon
                      family="Ionicons"
                      name={feedbackRating >= star ? 'star' : 'star-outline'}
                      size={32}
                      color={feedbackRating >= star ? '#f59e0b' : Colors.borderLight}
                    />
                  </TouchableOpacity>
                ))}
              </View>
              {feedbackRating > 0 && (
                <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(8), textAlign: 'center'}}>
                  {feedbackRating <= 2 ? 'We will do better next time' : feedbackRating <= 3 ? 'Thank you for your feedback' : 'Glad you had a great session!'}
                </AppText>
              )}
            </View>
          </View>
        )}

        <View style={{height: vs(40)}} />
      </ScrollView>

      {/* Cancel Modal */}
      <Modal
        visible={showCancelModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowCancelModal(false)}>
        <TouchableOpacity
          style={styles.modalOverlay}
          activeOpacity={1}
          onPress={() => setShowCancelModal(false)}>
          <View style={styles.modalSheet} onStartShouldSetResponder={() => true}>
            <View style={styles.modalHandle} />
            <AppText variant="header" style={{marginBottom: vs(4)}}>Cancel Session</AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(16)}}>
              Please let us know why you want to cancel
            </AppText>

            {cancelReasons.map((reason, i) => (
              <TouchableOpacity
                key={i}
                style={styles.reasonRow}
                activeOpacity={0.7}
                onPress={() => setSelectedReason(reason)}>
                <View style={[styles.radio, selectedReason === reason && styles.radioSelected]}>
                  {selectedReason === reason && <View style={styles.radioDot} />}
                </View>
                <AppText variant="body" style={{marginLeft: s(12)}}>{reason}</AppText>
              </TouchableOpacity>
            ))}

            <TouchableOpacity
              style={[styles.cancelConfirmBtn, !selectedReason && {opacity: 0.5}]}
              activeOpacity={0.8}
              disabled={!selectedReason}
              onPress={() => {
                setShowCancelModal(false);
                navigation.goBack();
              }}>
              <AppText variant="bodyBold" color={Colors.white}>Cancel Session</AppText>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>
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
  idRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  statusBadge: {
    paddingHorizontal: s(12),
    paddingVertical: vs(4),
    borderRadius: ms(20),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: ms(16),
    marginBottom: vs(12),
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
  actionsSection: {
    marginTop: vs(8),
  },
  directionBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(13),
    borderRadius: ms(14),
    borderWidth: 1.5,
    borderColor: Colors.primary,
  },
  rescheduleBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  feedbackCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: ms(16),
    marginTop: vs(16),
    alignItems: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: s(8),
  },
  // Cancel Modal
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
    paddingHorizontal: s(20),
    paddingTop: vs(12),
    paddingBottom: vs(32),
  },
  modalHandle: {
    width: ms(40),
    height: ms(4),
    borderRadius: ms(2),
    backgroundColor: Colors.borderLight,
    alignSelf: 'center',
    marginBottom: vs(16),
  },
  reasonRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  radio: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(11),
    borderWidth: 2,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
  },
  radioSelected: {
    borderColor: Colors.primary,
  },
  radioDot: {
    width: ms(12),
    height: ms(12),
    borderRadius: ms(6),
    backgroundColor: Colors.primary,
  },
  cancelConfirmBtn: {
    backgroundColor: Colors.red,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
    marginTop: vs(20),
  },
});

export default CoachSessionDetailScreen;
