import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
  FlatList,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const filterChips = ['All', 'Multi-Specialty', 'Eye', 'Cardiac', 'Orthopedic', 'Maternity'];

const hospitals = [
  {
    id: '1',
    name: 'KIMS Hospital',
    area: 'Secunderabad',
    rating: 4.7,
    reviews: '120k',
    image: require('../../../assets/img/hospital-one.png'),
    specialty: 'Multi-Specialty',
    tag: '24/7 Emergency',
  },
  {
    id: '2',
    name: 'Apollo Hospitals',
    area: 'Jubilee Hills',
    rating: 4.8,
    reviews: '200k',
    image: require('../../../assets/img/hospital-two.png'),
    specialty: 'Multi-Specialty',
    tag: 'NABH Accredited',
  },
  {
    id: '3',
    name: 'Yashoda Hospital',
    area: 'Somajiguda',
    rating: 4.5,
    reviews: '95k',
    image: require('../../../assets/img/hospital-one.png'),
    specialty: 'Multi-Specialty',
    tag: '24/7 Emergency',
  },
  {
    id: '4',
    name: 'Continental Hospital',
    area: 'Gachibowli',
    rating: 4.6,
    reviews: '78k',
    image: require('../../../assets/img/hospital-two.png'),
    specialty: 'Multi-Specialty',
    tag: 'JCI Accredited',
  },
  {
    id: '5',
    name: 'Sunshine Hospital',
    area: 'Secunderabad',
    rating: 4.4,
    reviews: '65k',
    image: require('../../../assets/img/hospital-one.png'),
    specialty: 'Orthopedic',
    tag: 'Sports Medicine',
  },
  {
    id: '6',
    name: 'LV Prasad Eye',
    area: 'Banjara Hills',
    rating: 4.9,
    reviews: '150k',
    image: require('../../../assets/img/hospital-two.png'),
    specialty: 'Eye',
    tag: 'WHO Collaborating',
  },
];

const HospitalListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  const filteredHospitals = activeFilter === 'All'
    ? hospitals
    : hospitals.filter(h => h.specialty === activeFilter);

  const renderHospital = ({item}) => (
    <TouchableOpacity
      style={styles.hospitalCard}
      onPress={() => navigation.navigate('DoctorSpecialistList', {specialtyName: item.name})}
      activeOpacity={0.7}>
      {/* Hospital Image */}
      <Image source={item.image} style={styles.hospitalImage} resizeMode="cover" />

      {/* Card Body */}
      <View style={styles.cardBody}>
        <AppText variant="bodyBold" numberOfLines={1}>{item.name}</AppText>

        {/* Location Row */}
        <View style={styles.locationRow}>
          <Icon family="Ionicons" name="location-outline" size={14} color={Colors.textSecondary} />
          <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(4)}}>
            {item.area}
          </AppText>
        </View>

        {/* Specialty Pills */}
        <View style={styles.specialtyRow}>
          <View style={styles.tealPill}>
            <AppText variant="small" color={Colors.tealText}>{item.specialty}</AppText>
          </View>
          <View style={[styles.tealPill, {marginLeft: s(6)}]}>
            <AppText variant="small" color={Colors.tealText}>{item.tag}</AppText>
          </View>
        </View>

        {/* Rating Row */}
        <View style={styles.ratingRow}>
          <Icon family="Ionicons" name="star" size={14} color="#F5A623" />
          <AppText variant="caption" style={{marginLeft: s(4)}}>{item.rating}</AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(6)}}>
            ({item.reviews} reviews)
          </AppText>
        </View>

        {/* Bottom Row */}
        <View style={styles.bottomRow}>
          <TouchableOpacity
            onPress={() => navigation.navigate('DoctorSpecialistList', {specialtyName: item.name})}>
            <AppText variant="caption" color={Colors.primary}>View Details</AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.callButton}
            onPress={() => navigation.navigate('DoctorSpecialistList', {specialtyName: item.name})}>
            <Icon family="Ionicons" name="call-outline" size={16} color={Colors.tealText} />
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(12)}}>
            <AppText variant="header" color={Colors.white}>Hospitals</AppText>
            <AppText variant="caption" color="rgba(255,255,255,0.7)" style={{marginTop: vs(2)}}>
              Find hospitals near you
            </AppText>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon family="Ionicons" name="search" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search hospitals..."
            placeholderTextColor={Colors.textTertiary}
            value={searchText}
            onChangeText={setSearchText}
          />
        </View>
      </View>

      {/* Filter Chips */}
      <View style={styles.filterRow}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {filterChips.map(chip => {
            const isActive = activeFilter === chip;
            return (
              <TouchableOpacity
                key={chip}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
                onPress={() => setActiveFilter(chip)}>
                <AppText
                  variant="caption"
                  color={isActive ? Colors.white : Colors.textPrimary}>
                  {chip}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Hospital List */}
      <FlatList
        data={filteredHospitals}
        keyExtractor={item => item.id}
        renderItem={renderHospital}
        contentContainerStyle={{paddingHorizontal: s(16), paddingBottom: vs(30)}}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: vs(16),
    paddingHorizontal: s(16),
    paddingBottom: vs(16),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    paddingHorizontal: s(14),
    marginTop: vs(14),
  },
  searchInput: {
    flex: 1,
    paddingVertical: vs(10),
    marginLeft: s(8),
    fontSize: ms(14),
    color: Colors.textPrimary,
  },
  filterRow: {
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
  },
  filterChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(20),
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    marginRight: s(8),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  filterChipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  hospitalCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    marginBottom: vs(12),
    overflow: 'hidden',
  },
  hospitalImage: {
    width: '100%',
    height: vs(120),
  },
  cardBody: {
    padding: ms(12),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(4),
  },
  specialtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(8),
  },
  tealPill: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(10),
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(8),
  },
  bottomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(10),
  },
  callButton: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default HospitalListScreen;
