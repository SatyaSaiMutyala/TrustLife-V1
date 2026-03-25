import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';
import FilterBottomSheet from '../../../components/shared/FilterBottomSheet';

const filterSections = [
  {key: 'specialization', label: 'Specialization', options: ['Gym Coach', 'Nutrition Coach', 'Fitness Coach', 'Wellness Coach', 'Sports Coach', 'Mental Health'], multi: true},
  {key: 'experience', label: 'Experience', options: ['1-5 Years', '5-10 Years', '10+ Years'], multi: false},
  {key: 'consultationType', label: 'Consultation Type', options: ['Online', 'In-Person'], multi: true},
  {key: 'rating', label: 'Rating', options: ['4+ Above', '4.5+ Above'], multi: false},
  {key: 'gender', label: 'Gender', options: ['Male', 'Female'], multi: false},
];

const mockCoaches = [
  {
    id: 'C001',
    name: 'Dr. Priya Sharma',
    specialty: 'Nutrition Coach',
    rating: 4.8,
    reviews: 124,
    experience: '8 years',
    isOnline: true,
    consultationType: 'Video & In-Person',
    fee: 800,
    image: require('../../../assets/img/gym-one.png'),
  },
  {
    id: 'C002',
    name: 'Rahul Mehra',
    specialty: 'Fitness Coach',
    rating: 4.5,
    reviews: 89,
    experience: '5 years',
    isOnline: true,
    consultationType: 'In-Person',
    fee: 1200,
    image: require('../../../assets/img/gym-two.png'),
  },
  {
    id: 'C003',
    name: 'Anita Desai',
    specialty: 'Wellness Coach',
    rating: 4.9,
    reviews: 210,
    experience: '12 years',
    isOnline: false,
    consultationType: 'Video',
    fee: 600,
    image: require('../../../assets/img/gym-three.png'),
  },
  {
    id: 'C004',
    name: 'Vikram Patel',
    specialty: 'Sports Coach',
    rating: 4.6,
    reviews: 67,
    experience: '6 years',
    isOnline: true,
    consultationType: 'In-Person',
    fee: 1000,
    image: require('../../../assets/img/gym-one.png'),
  },
  {
    id: 'C005',
    name: 'Sneha Kulkarni',
    specialty: 'Mental Health',
    rating: 4.7,
    reviews: 156,
    experience: '10 years',
    isOnline: false,
    consultationType: 'Video',
    fee: 900,
    image: require('../../../assets/img/gym-two.png'),
  },
  {
    id: 'C006',
    name: 'Arjun Reddy',
    specialty: 'Gym Coach',
    rating: 4.4,
    reviews: 43,
    experience: '3 years',
    isOnline: true,
    consultationType: 'In-Person',
    fee: 700,
    image: require('../../../assets/img/gym-three.png'),
  },
];

const filterChips = ['Experience', 'Consultation Type'];

const CoachSpecialistListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {specialtyName} = route.params || {};
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);

  const coaches = mockCoaches.map(c => ({...c, specialty: specialtyName || c.specialty}));

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
            <AppText variant="screenName" color={Colors.white}>{specialtyName || 'Specialists'}</AppText>
            <AppText variant="caption" color="rgba(255,255,255,0.6)" style={{marginTop: vs(2)}}>
              {coaches.length} coaches available
            </AppText>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon family="Ionicons" name="search-outline" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search by name..."
            placeholderTextColor={Colors.textTertiary}
          />
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filtersRow}>
        {filterChips.map(chip => {
          const isActive = activeFilter === chip;
          return (
            <TouchableOpacity
              key={chip}
              style={[styles.chip, isActive && styles.chipActive]}
              activeOpacity={0.7}
              onPress={() => setActiveFilter(isActive ? null : chip)}>
              <AppText
                variant="caption"
                color={isActive ? Colors.white : Colors.textPrimary}
                style={{fontWeight: '600'}}>{chip}</AppText>
              <Icon
                family="Ionicons"
                name="chevron-down-outline"
                size={14}
                color={isActive ? Colors.white : Colors.textSecondary}
              />
            </TouchableOpacity>
          );
        })}
        <TouchableOpacity
          style={styles.filterIconBtn}
          activeOpacity={0.7}
          onPress={() => setFilterVisible(true)}>
          <Icon family="Ionicons" name="options-outline" size={18} color={Colors.primary} />
        </TouchableOpacity>
      </View>

      {/* Coach Grid */}
      <FlatList
        data={coaches}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.coachCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('CoachProfile', {coach: item})}>
            {/* Online status dot */}
            <View style={[styles.onlineDot, {backgroundColor: item.isOnline ? '#22c55e' : '#9ca3af'}]} />

            <View style={styles.avatarWrap}>
              <Image source={item.image} style={styles.avatarImage} resizeMode="cover" />
            </View>

            <AppText variant="bodyBold" style={styles.coachName} numberOfLines={1}>{item.name}</AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{item.specialty}</AppText>

            <View style={styles.ratingRow}>
              <Icon family="Ionicons" name="star" size={14} color="#f59e0b" />
              <AppText variant="caption" color={Colors.textPrimary} style={{marginLeft: s(3), fontWeight: '600'}}>
                {item.rating}
              </AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{marginLeft: s(3)}}>
                ({item.reviews})
              </AppText>
            </View>

            <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(4)}}>
              {item.experience}
            </AppText>
          </TouchableOpacity>
        )}
      />
      <FilterBottomSheet
        visible={filterVisible}
        onClose={() => setFilterVisible(false)}
        onApply={(filters) => setFilterVisible(false)}
        filterSections={filterSections}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(16),
    paddingTop: vs(14),
    paddingBottom: vs(20),
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
  searchBar: {
    backgroundColor: Colors.white,
    borderRadius: ms(25),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    marginTop: vs(14),
  },
  searchInput: {
    flex: 1,
    marginLeft: s(8),
    fontSize: ms(14),
    color: Colors.textPrimary,
    padding: 0,
  },
  filtersRow: {
    flexDirection: 'row',
    paddingHorizontal: s(16),
    marginTop: vs(14),
    marginBottom: vs(10),
    gap: s(8),
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    backgroundColor: Colors.white,
    borderRadius: ms(20),
    paddingHorizontal: s(14),
    height: ms(34),
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  gridContainer: {
    paddingHorizontal: s(16),
    paddingBottom: vs(24),
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  coachCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    width: '48%',
    alignItems: 'center',
    paddingVertical: vs(16),
    paddingHorizontal: s(10),
    position: 'relative',
  },
  onlineDot: {
    position: 'absolute',
    top: ms(10),
    right: ms(10),
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
  },
  avatarWrap: {
    width: ms(72),
    height: ms(72),
    borderRadius: ms(36),
    overflow: 'hidden',
    marginBottom: vs(8),
  },
  avatarImage: {
    width: ms(72),
    height: ms(72),
    borderRadius: ms(36),
  },
  coachName: {
    textAlign: 'center',
    fontSize: ms(13),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(6),
  },
  filterIconBtn: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },
});

export default CoachSpecialistListScreen;
