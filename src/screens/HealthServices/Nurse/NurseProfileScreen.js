import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const generateDays = () => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push({
      day: daysOfWeek[i],
      date: 16 + i,
      isToday: i === 2,
    });
  }
  return days;
};

const mockTimeSlots = [
  {id: 't1', time: '09:00 AM', status: 'available'},
  {id: 't2', time: '09:30 AM', status: 'booked'},
  {id: 't3', time: '10:00 AM', status: 'available'},
  {id: 't4', time: '10:30 AM', status: 'available'},
  {id: 't5', time: '11:00 AM', status: 'booked'},
  {id: 't6', time: '02:00 PM', status: 'available'},
  {id: 't7', time: '02:30 PM', status: 'available'},
  {id: 't8', time: '03:00 PM', status: 'booked'},
];

const NurseProfileScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {nurse} = route.params || {};
  const [selectedDay, setSelectedDay] = useState(2);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const days = generateDays();
  const availableCount = mockTimeSlots.filter(t => t.status === 'available').length;

  const handleBook = () => {
    const slot = mockTimeSlots.find(t => t.id === selectedSlot);
    const appointment = {
      id: 'S' + Date.now(),
      nurseName: nurse?.name || 'Sr. Meera Joshi',
      specialty: nurse?.specialty || 'Pediatric Nurse',
      date: `2026-02-${days[selectedDay].date}`,
      time: slot?.time || '10:00 AM',
      status: 'Confirmed',
      sessionType: 'Home Visit',
      amount: nurse?.fee || 600,
      paymentMethod: 'UPI',
      transactionId: 'TXN' + Date.now(),
      address: 'Home Visit',
      rating: nurse?.rating || 4.9,
    };
    navigation.navigate('NurseSessionDetail', {appointment});
  };

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

        <View style={styles.profileSection}>
          <View style={styles.avatarLarge}>
            {nurse?.image ? (
              <Image source={nurse.image} style={styles.avatarLargeImage} resizeMode="cover" />
            ) : (
              <Icon family="Ionicons" name="person-circle-outline" size={72} color={Colors.white} />
            )}
          </View>
          <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(10)}}>
            {nurse?.name || 'Sr. Meera Joshi'}
          </AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.6)" style={{marginTop: vs(2)}}>
            ID: {nurse?.id || 'N001'}
          </AppText>

          <View style={styles.specialtyPill}>
            <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>
              {nurse?.specialty || 'Pediatric Nurse'}
            </AppText>
          </View>

          <View style={styles.ratingRow}>
            <Icon family="Ionicons" name="star" size={16} color="#f59e0b" />
            <AppText variant="body" color={Colors.white} style={{marginLeft: s(4), fontWeight: '600'}}>
              {nurse?.rating || 4.9}
            </AppText>
            <AppText variant="caption" color="rgba(255,255,255,0.6)" style={{marginLeft: s(4)}}>
              ({nurse?.reviews || 142} reviews)
            </AppText>
          </View>
        </View>
      </View>

      {/* Booking Content */}
      <ScrollView
        style={{flex: 1, backgroundColor: Colors.white}}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Section Title */}
        <View style={styles.sectionTitleRow}>
          <Icon family="Ionicons" name="calendar-outline" size={20} color={Colors.primary} />
          <AppText variant="header" style={{marginLeft: s(8)}}>Choose Session Slot</AppText>
        </View>

        {/* Month Navigator */}
        <View style={styles.monthNav}>
          <TouchableOpacity activeOpacity={0.7}>
            <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <AppText variant="bodyBold">February 2026</AppText>
          <TouchableOpacity activeOpacity={0.7}>
            <Icon family="Ionicons" name="chevron-forward" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
        </View>

        {/* Days Row */}
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.daysRow}>
          {days.map((d, i) => {
            const isSelected = i === selectedDay;
            const isToday = d.isToday && !isSelected;
            return (
              <TouchableOpacity
                key={i}
                style={[
                  styles.dayBubble,
                  isSelected && styles.dayBubbleSelected,
                  isToday && styles.dayBubbleToday,
                ]}
                activeOpacity={0.7}
                onPress={() => setSelectedDay(i)}>
                <AppText
                  variant="small"
                  color={isSelected ? Colors.white : Colors.textSecondary}
                  style={{fontWeight: '500'}}>
                  {d.day}
                </AppText>
                <AppText
                  variant="bodyBold"
                  color={isSelected ? Colors.white : Colors.textPrimary}
                  style={{marginTop: vs(4)}}>
                  {d.date}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>

        {/* Available Slots Header */}
        <View style={styles.slotsHeaderRow}>
          <AppText variant="bodyBold">Available Session Slots</AppText>
          <View style={styles.slotCountBadge}>
            <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>
              {availableCount} slots
            </AppText>
          </View>
        </View>

        {/* Time Slots Grid */}
        <View style={styles.slotsGrid}>
          {mockTimeSlots.map(slot => {
            const isBooked = slot.status === 'booked';
            const isSelected = selectedSlot === slot.id;
            return (
              <TouchableOpacity
                key={slot.id}
                style={[
                  styles.slotItem,
                  isBooked && styles.slotBooked,
                  !isBooked && !isSelected && styles.slotAvailable,
                  isSelected && styles.slotSelected,
                ]}
                activeOpacity={isBooked ? 1 : 0.7}
                disabled={isBooked}
                onPress={() => setSelectedSlot(slot.id)}>
                <AppText
                  variant="caption"
                  color={isBooked ? Colors.white : isSelected ? Colors.primary : Colors.tealText}
                  style={{fontWeight: '600', textAlign: 'center'}}>
                  {slot.time}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Legend */}
        <View style={styles.legendRow}>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: Colors.tealBg}]} />
            <AppText variant="small" color={Colors.textSecondary}>Available</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {backgroundColor: Colors.red}]} />
            <AppText variant="small" color={Colors.textSecondary}>Booked</AppText>
          </View>
          <View style={styles.legendItem}>
            <View style={[styles.legendDot, {borderWidth: 2, borderColor: Colors.primary, backgroundColor: Colors.white}]} />
            <AppText variant="small" color={Colors.textSecondary}>Selected</AppText>
          </View>
        </View>

        <View style={{height: vs(100)}} />
      </ScrollView>

      {/* Bottom Book Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.bookBtn, !selectedSlot && styles.bookBtnDisabled]}
          activeOpacity={0.8}
          disabled={!selectedSlot}
          onPress={handleBook}>
          <AppText variant="bodyBold" color={Colors.white}>Book Session</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(16),
    paddingTop: vs(14),
    paddingBottom: vs(24),
  },
  backBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  profileSection: {
    alignItems: 'center',
    marginTop: vs(12),
  },
  avatarLarge: {
    width: ms(90),
    height: ms(90),
    borderRadius: ms(45),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    overflow: 'hidden',
  },
  avatarLargeImage: {
    width: ms(90),
    height: ms(90),
    borderRadius: ms(45),
  },
  specialtyPill: {
    backgroundColor: Colors.white,
    borderRadius: ms(20),
    paddingHorizontal: s(14),
    paddingVertical: vs(4),
    marginTop: vs(8),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(8),
  },
  content: {
    paddingHorizontal: s(16),
    paddingTop: vs(20),
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  monthNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(14),
    paddingHorizontal: s(8),
  },
  daysRow: {
    gap: s(8),
    paddingBottom: vs(16),
  },
  dayBubble: {
    width: ms(52),
    height: ms(68),
    borderRadius: ms(14),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary,
  },
  dayBubbleSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  dayBubbleToday: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.tealBg,
  },
  slotsHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  slotCountBadge: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(12),
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
  },
  slotsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  slotItem: {
    width: '23%',
    paddingVertical: vs(10),
    borderRadius: ms(10),
    alignItems: 'center',
  },
  slotAvailable: {
    backgroundColor: Colors.tealBg,
  },
  slotBooked: {
    backgroundColor: Colors.red,
  },
  slotSelected: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.primary,
  },
  legendRow: {
    flexDirection: 'row',
    justifyContent: 'center',
    gap: s(20),
    marginTop: vs(16),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(5),
  },
  legendDot: {
    width: ms(12),
    height: ms(12),
    borderRadius: ms(6),
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
  bookBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  bookBtnDisabled: {
    opacity: 0.5,
  },
});

export default NurseProfileScreen;
