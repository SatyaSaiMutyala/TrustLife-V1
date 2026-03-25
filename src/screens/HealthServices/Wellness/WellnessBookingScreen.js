import React, {useState} from 'react';
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

const serviceOptions = [
  {id: '1', name: 'Yoga', icon: 'leaf-outline', bg: Colors.tealBg, duration: '60 min', price: 999},
  {id: '2', name: 'Meditation', icon: 'happy-outline', bg: Colors.blueBg, duration: '60 min', price: 999},
  {id: '3', name: 'Ayurveda', icon: 'flask-outline', bg: Colors.amberBg, duration: '60 min', price: 999},
  {id: '4', name: 'Spa & Massage', icon: 'water-outline', bg: Colors.purpleBg, duration: '60 min', price: 999},
  {id: '5', name: 'Nutrition Counselling', icon: 'nutrition-outline', bg: Colors.tealBg, duration: '60 min', price: 999},
  {id: '6', name: 'Acupuncture', icon: 'pulse-outline', bg: Colors.redBg, duration: '60 min', price: 999},
];

const daysOfWeek = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];

const generateDays = () => {
  const days = [];
  for (let i = 0; i < 7; i++) {
    days.push({
      day: daysOfWeek[i],
      date: 23 + i,
      isToday: i === 1,
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

const WellnessBookingScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {center} = route.params || {};
  const [selectedService, setSelectedService] = useState(null);
  const [selectedDay, setSelectedDay] = useState(1);
  const [selectedSlot, setSelectedSlot] = useState(null);

  const days = generateDays();
  const availableCount = mockTimeSlots.filter(t => t.status === 'available').length;
  const chosenService = serviceOptions.find(s => s.id === selectedService);

  const handleConfirm = () => {
    const slot = mockTimeSlots.find(t => t.id === selectedSlot);
    const appointment = {
      id: 'W' + Date.now(),
      centerName: center?.name || 'Sushma Wellness Center',
      location: center?.location || 'Madhapur',
      rating: center?.rating || 4.5,
      serviceName: chosenService?.name || 'Yoga',
      duration: chosenService?.duration || '60 min',
      therapistName: 'Dr. Meena Kapoor',
      date: `2026-03-${days[selectedDay].date}`,
      time: slot?.time || '10:00 AM',
      status: 'Confirmed',
      amount: chosenService?.price || 999,
      paymentMethod: 'UPI',
      transactionId: 'TXN' + Date.now(),
    };
    navigation.navigate('WellnessSessionDetail', {appointment});
  };

  const canBook = selectedService && selectedSlot;

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
          <AppText variant="screenName" color={Colors.white}>Book Session</AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.6)" style={{marginTop: vs(2)}}>
            {center?.name || 'Sushma Wellness Center'}
          </AppText>
        </View>
      </View>

      <ScrollView
        style={{flex: 1, backgroundColor: Colors.white}}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Select Service */}
        <View style={styles.sectionTitleRow}>
          <Icon family="Ionicons" name="list-outline" size={20} color={Colors.primary} />
          <AppText variant="header" style={{marginLeft: s(8)}}>Select Service</AppText>
        </View>

        {serviceOptions.map(service => {
          const isSelected = selectedService === service.id;
          return (
            <TouchableOpacity
              key={service.id}
              style={[
                styles.serviceOption,
                isSelected && styles.serviceOptionSelected,
              ]}
              activeOpacity={0.7}
              onPress={() => setSelectedService(service.id)}>
              <View style={[styles.serviceIconCircle, {backgroundColor: service.bg}]}>
                <Icon family="Ionicons" name={service.icon} size={20} color={Colors.textPrimary} />
              </View>
              <View style={{flex: 1, marginLeft: s(12)}}>
                <AppText variant="bodyBold">{service.name}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  {service.duration} {'\u2022'} {'\u20B9'}{service.price}
                </AppText>
              </View>
              <View style={[styles.radio, isSelected && styles.radioSelected]}>
                {isSelected && <View style={styles.radioDot} />}
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Choose Session Slot */}
        <View style={[styles.sectionTitleRow, {marginTop: vs(24)}]}>
          <Icon family="Ionicons" name="calendar-outline" size={20} color={Colors.primary} />
          <AppText variant="header" style={{marginLeft: s(8)}}>Choose Session Slot</AppText>
        </View>

        {/* Month Navigator */}
        <View style={styles.monthNav}>
          <TouchableOpacity activeOpacity={0.7}>
            <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.textPrimary} />
          </TouchableOpacity>
          <AppText variant="bodyBold">March 2026</AppText>
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

        {/* Price Summary */}
        {selectedService && (
          <View style={styles.priceSummary}>
            <View style={styles.priceSummaryRow}>
              <AppText variant="bodyBold">{chosenService?.name}</AppText>
              <AppText variant="bodyBold" color={Colors.primary}>
                {'\u20B9'}{chosenService?.price}
              </AppText>
            </View>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(4)}}>
              {chosenService?.duration}
            </AppText>
          </View>
        )}

        <View style={{height: vs(100)}} />
      </ScrollView>

      {/* Bottom Confirm Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.confirmBtn, !canBook && styles.confirmBtnDisabled]}
          activeOpacity={0.8}
          disabled={!canBook}
          onPress={handleConfirm}>
          <AppText variant="bodyBold" color={Colors.white}>Confirm Booking</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
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
    paddingHorizontal: s(16),
    paddingTop: vs(20),
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  serviceOption: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary,
    padding: ms(12),
    marginBottom: vs(8),
  },
  serviceOptionSelected: {
    borderColor: Colors.primary,
    borderWidth: 1.5,
    backgroundColor: Colors.tealBg,
  },
  serviceIconCircle: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    alignItems: 'center',
    justifyContent: 'center',
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
  priceSummary: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary,
    padding: ms(16),
    marginTop: vs(20),
  },
  priceSummaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  confirmBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  confirmBtnDisabled: {
    opacity: 0.5,
  },
});

export default WellnessBookingScreen;
