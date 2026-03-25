import React from 'react';
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

const services = [
  {id: '1', name: 'Yoga', icon: 'leaf-outline', bg: Colors.tealBg, duration: '60 min', price: 999},
  {id: '2', name: 'Meditation', icon: 'happy-outline', bg: Colors.blueBg, duration: '60 min', price: 999},
  {id: '3', name: 'Ayurveda', icon: 'flask-outline', bg: Colors.amberBg, duration: '60 min', price: 999},
  {id: '4', name: 'Spa & Massage', icon: 'water-outline', bg: Colors.purpleBg, duration: '60 min', price: 999},
  {id: '5', name: 'Nutrition Counselling', icon: 'nutrition-outline', bg: Colors.tealBg, duration: '60 min', price: 999},
  {id: '6', name: 'Acupuncture', icon: 'pulse-outline', bg: Colors.redBg, duration: '60 min', price: 999},
];

const therapists = [
  {id: '1', name: 'Dr. Meena Kapoor', specialty: 'Ayurvedic Wellness', rating: 4.8, image: require('../../../assets/img/counselling-six.png')},
  {id: '2', name: 'Ravi Shankar', specialty: 'Yoga Therapy', rating: 4.7, image: require('../../../assets/img/counselling-seven.png')},
  {id: '3', name: 'Lakshmi Iyer', specialty: 'Spa & Relaxation', rating: 4.9, image: require('../../../assets/img/counselling-eight.png')},
];

const facilities = [
  {icon: 'wifi-outline', label: 'Wi-Fi'},
  {icon: 'car-outline', label: 'Parking'},
  {icon: 'cafe-outline', label: 'Cafe'},
  {icon: 'water-outline', label: 'Pool'},
];

const reviews = [
  {initials: 'AK', name: 'Anita Kumar', rating: 5, text: 'Amazing experience! The yoga sessions were incredibly relaxing and the staff was very professional.'},
  {initials: 'RS', name: 'Rohit Sharma', rating: 4, text: 'Great wellness center with excellent facilities. The Ayurvedic treatments were top-notch.'},
];

const WellnessDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {center} = route.params || {};

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity
            style={styles.backBtn}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}>
            <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(12)}}>
            <AppText variant="screenName" color={Colors.white} numberOfLines={1}>
              {center?.name || 'Wellness Center'}
            </AppText>
            <View style={styles.headerSubRow}>
              <Icon family="Ionicons" name="location-outline" size={14} color="rgba(255,255,255,0.6)" />
              <AppText variant="caption" color="rgba(255,255,255,0.6)" style={{marginLeft: s(3)}}>
                {center?.location || 'Madhapur'}
              </AppText>
              <View style={styles.headerDot} />
              <Icon family="Ionicons" name="star" size={14} color="#F5A623" />
              <AppText variant="caption" color={Colors.white} style={{marginLeft: s(3), fontWeight: '600'}}>
                {center?.rating || 4.5}
              </AppText>
            </View>
          </View>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Hero Image */}
        <Image
          source={center?.image || require('../../../assets/img/counselling-one.png')}
          style={styles.heroImage}
          resizeMode="cover"
        />

        {/* Info Card */}
        <View style={styles.infoCard}>
          <AppText variant="bodyBold">{center?.name || 'Wellness Center'}</AppText>
          <View style={styles.locationRow}>
            <Icon family="Ionicons" name="location-outline" size={14} color={Colors.textSecondary} />
            <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(3)}}>
              {center?.location || 'Madhapur'}
            </AppText>
          </View>
          <View style={styles.ratingRowInfo}>
            <Icon family="Ionicons" name="star" size={14} color="#F5A623" />
            <AppText variant="caption" style={{marginLeft: s(3), fontWeight: '600'}}>
              {center?.rating || 4.5}
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(4)}}>
              ({center?.reviews || '86k'} reviews)
            </AppText>
            <View style={styles.openBadge}>
              <AppText variant="small" color={Colors.tealText} style={{fontWeight: '600'}}>Open now</AppText>
            </View>
          </View>
        </View>

        {/* Services Offered */}
        <AppText variant="header" style={styles.sectionTitle}>Services Offered</AppText>
        <View style={styles.servicesGrid}>
          {services.map(service => (
            <View key={service.id} style={styles.serviceCard}>
              <View style={[styles.serviceIconCircle, {backgroundColor: service.bg}]}>
                <Icon family="Ionicons" name={service.icon} size={22} color={Colors.textPrimary} />
              </View>
              <AppText variant="bodyBold" style={{marginTop: vs(8)}}>{service.name}</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>{service.duration}</AppText>
              <AppText variant="bodyBold" color={Colors.primary} style={{marginTop: vs(4)}}>
                {'\u20B9'}{service.price}
              </AppText>
            </View>
          ))}
        </View>

        {/* Available Therapists */}
        <AppText variant="header" style={styles.sectionTitle}>Available Therapists</AppText>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.therapistsRow}>
          {therapists.map(therapist => (
            <View key={therapist.id} style={styles.therapistCard}>
              <Image source={therapist.image} style={styles.therapistAvatar} />
              <AppText variant="bodyBold" style={{marginTop: vs(8)}} numberOfLines={1}>
                {therapist.name}
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary} numberOfLines={1}>
                {therapist.specialty}
              </AppText>
              <View style={styles.therapistRatingRow}>
                <Icon family="Ionicons" name="star" size={12} color="#F5A623" />
                <AppText variant="small" style={{marginLeft: s(3), fontWeight: '600'}}>
                  {therapist.rating}
                </AppText>
              </View>
              <TouchableOpacity style={styles.bookPill} activeOpacity={0.7}>
                <AppText variant="small" color={Colors.tealText} style={{fontWeight: '600'}}>Book</AppText>
              </TouchableOpacity>
            </View>
          ))}
        </ScrollView>

        {/* Facilities */}
        <AppText variant="header" style={styles.sectionTitle}>Facilities</AppText>
        <View style={styles.facilitiesRow}>
          {facilities.map((facility, i) => (
            <View key={i} style={styles.facilityItem}>
              <View style={styles.facilityIconCircle}>
                <Icon family="Ionicons" name={facility.icon} size={22} color={Colors.primary} />
              </View>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(4)}}>
                {facility.label}
              </AppText>
            </View>
          ))}
        </View>

        {/* Reviews */}
        <AppText variant="header" style={styles.sectionTitle}>Reviews</AppText>
        {reviews.map((review, i) => (
          <View key={i} style={styles.reviewCard}>
            <View style={styles.reviewHeader}>
              <View style={styles.reviewAvatar}>
                <AppText variant="bodyBold" color={Colors.white}>{review.initials}</AppText>
              </View>
              <View style={{flex: 1, marginLeft: s(10)}}>
                <AppText variant="bodyBold">{review.name}</AppText>
                <View style={styles.reviewStarsRow}>
                  {[1, 2, 3, 4, 5].map(star => (
                    <Icon
                      key={star}
                      family="Ionicons"
                      name={star <= review.rating ? 'star' : 'star-outline'}
                      size={14}
                      color="#F5A623"
                    />
                  ))}
                </View>
              </View>
            </View>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(8)}}>
              {review.text}
            </AppText>
          </View>
        ))}

        <View style={{height: vs(100)}} />
      </ScrollView>

      {/* Bottom Sticky */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.bookBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('WellnessBooking', {center})}>
          <AppText variant="bodyBold" color={Colors.white}>
            Book a Session {'\u2014'} {'\u20B9'}999
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(16),
    paddingTop: vs(14),
    paddingBottom: vs(14),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerSubRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(3),
  },
  headerDot: {
    width: ms(4),
    height: ms(4),
    borderRadius: ms(2),
    backgroundColor: 'rgba(255,255,255,0.4)',
    marginHorizontal: s(8),
  },
  content: {
    paddingBottom: vs(24),
  },
  heroImage: {
    width: '100%',
    height: vs(180),
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary,
    padding: ms(16),
    marginHorizontal: s(16),
    marginTop: vs(-20),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(4),
  },
  ratingRowInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(6),
  },
  openBadge: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(10),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    marginLeft: s(10),
  },
  sectionTitle: {
    marginHorizontal: s(16),
    marginTop: vs(20),
    marginBottom: vs(12),
  },
  servicesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: s(16),
    gap: s(10),
  },
  serviceCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary,
    padding: ms(12),
    width: '47%',
    alignItems: 'center',
  },
  serviceIconCircle: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    alignItems: 'center',
    justifyContent: 'center',
  },
  therapistsRow: {
    paddingHorizontal: s(16),
    gap: s(12),
  },
  therapistCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary,
    padding: ms(12),
    alignItems: 'center',
    width: ms(150),
  },
  therapistAvatar: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
  },
  therapistRatingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(4),
  },
  bookPill: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(14),
    paddingHorizontal: s(16),
    paddingVertical: vs(5),
    marginTop: vs(8),
  },
  facilitiesRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: s(16),
  },
  facilityItem: {
    alignItems: 'center',
  },
  facilityIconCircle: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary,
    padding: ms(14),
    marginHorizontal: s(16),
    marginBottom: vs(10),
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  reviewAvatar: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewStarsRow: {
    flexDirection: 'row',
    marginTop: vs(2),
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
  bookBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default WellnessDetailScreen;
