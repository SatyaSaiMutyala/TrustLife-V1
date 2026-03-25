import React, {useState} from 'react';
import {
  View,
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
  {key: 'specialization', label: 'Specialization', options: ['Sports Physiotherapy', 'Orthopedic Therapy', 'Neurological Therapy', 'Pediatric Physiotherapy', 'Post-Surgery Rehab', 'Pain Management'], multi: true},
  {key: 'experience', label: 'Experience', options: ['1-5 Years', '5-10 Years', '10+ Years'], multi: false},
  {key: 'consultationType', label: 'Consultation Type', options: ['Online', 'In-Person'], multi: true},
  {key: 'rating', label: 'Rating', options: ['4+ Above', '4.5+ Above'], multi: false},
  {key: 'gender', label: 'Gender', options: ['Male', 'Female'], multi: false},
];

const physioImages = [
  require('../../../assets/img/phy-one.png'),
  require('../../../assets/img/phy-two.png'),
  require('../../../assets/img/phy-three.png'),
];

const mockPhysios = [
  {
    id: 'P001',
    name: 'Dr. Arjun Mehta',
    specialty: 'Sports Physiotherapy',
    rating: 4.9,
    reviews: 158,
    experience: '12 years',
    isOnline: true,
    sessionType: 'Clinic & Home Visit',
    fee: 800,
    image: physioImages[0],
  },
  {
    id: 'P002',
    name: 'Dr. Sneha Kulkarni',
    specialty: 'Orthopedic Therapy',
    rating: 4.8,
    reviews: 124,
    experience: '9 years',
    isOnline: true,
    sessionType: 'Clinic Visit',
    fee: 750,
    image: physioImages[1],
  },
  {
    id: 'P003',
    name: 'Dr. Ravi Shankar',
    specialty: 'Neurological Therapy',
    rating: 4.7,
    reviews: 189,
    experience: '15 years',
    isOnline: false,
    sessionType: 'Home Visit',
    fee: 900,
    image: physioImages[2],
  },
  {
    id: 'P004',
    name: 'Dr. Pooja Desai',
    specialty: 'Pediatric Physiotherapy',
    rating: 4.6,
    reviews: 97,
    experience: '6 years',
    isOnline: true,
    sessionType: 'Clinic & Home Visit',
    fee: 700,
    image: physioImages[0],
  },
  {
    id: 'P005',
    name: 'Dr. Vikram Patel',
    specialty: 'Post-Surgery Rehab',
    rating: 4.5,
    reviews: 73,
    experience: '5 years',
    isOnline: false,
    sessionType: 'Home Visit',
    fee: 650,
    image: physioImages[1],
  },
  {
    id: 'P006',
    name: 'Dr. Anjali Sharma',
    specialty: 'Pain Management',
    rating: 4.4,
    reviews: 56,
    experience: '4 years',
    isOnline: true,
    sessionType: 'Clinic Visit',
    fee: 550,
    image: physioImages[2],
  },
];

const filterChips = ['Experience', 'Session Type'];

const PhysioSpecialistListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {specialtyName} = route.params || {};
  const [activeFilter, setActiveFilter] = useState(null);
  const [filterVisible, setFilterVisible] = useState(false);

  const physios = mockPhysios.map(p => ({...p, specialty: specialtyName || p.specialty}));

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
              {physios.length} physiotherapists available
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
      </View>

      {/* Physio Grid */}
      <FlatList
        data={physios}
        numColumns={2}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.gridContainer}
        columnWrapperStyle={styles.gridRow}
        showsVerticalScrollIndicator={false}
        renderItem={({item}) => (
          <TouchableOpacity
            style={styles.physioCard}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('PhysioProfile', {physio: item})}>
            {/* Online status dot */}
            <View style={[styles.onlineDot, {backgroundColor: item.isOnline ? '#22c55e' : '#9ca3af'}]} />

            <View style={styles.avatarWrap}>
              <Image source={item.image} style={styles.avatarImage} resizeMode="cover" />
            </View>

            <AppText variant="bodyBold" style={styles.physioName} numberOfLines={1}>{item.name}</AppText>
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
  physioCard: {
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
  physioName: {
    textAlign: 'center',
    fontSize: ms(13),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(6),
  },
});

export default PhysioSpecialistListScreen;
