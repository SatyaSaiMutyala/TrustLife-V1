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

const filterChips = ['Filters', 'Fast Relief', 'Sugar-Free', 'Suitable'];

const medicines = [
  {
    id: '1',
    name: 'Paracetamol',
    subtitle: '500mg Tablets',
    rating: 4.5,
    mrp: 480,
    discount: 20,
    net: 384,
    image: require('../../../assets/img/medicans.png'),
  },
  {
    id: '2',
    name: 'Ibuprofen',
    subtitle: '500mg Tablets',
    rating: 4.5,
    mrp: 480,
    discount: 20,
    net: 384,
    image: require('../../../assets/img/medicans.png'),
  },
  {
    id: '3',
    name: 'Amoxicillin',
    subtitle: '500mg Tablets',
    rating: 4.5,
    mrp: 480,
    discount: 20,
    net: 384,
    image: require('../../../assets/img/medicans.png'),
  },
  {
    id: '4',
    name: 'Cetirizine',
    subtitle: '500mg Tablets',
    rating: 4.5,
    mrp: 480,
    discount: 20,
    net: 384,
    image: require('../../../assets/img/medicans.png'),
  },
];

const MedicineListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {brand} = route.params || {};
  const [activeFilters, setActiveFilters] = useState([]);
  const [quantities, setQuantities] = useState({});
  const [wishlist, setWishlist] = useState({});
  const [searchText, setSearchText] = useState('');

  const toggleFilter = (filter) => {
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter],
    );
  };

  const toggleWishlist = (id) => {
    setWishlist(prev => ({...prev, [id]: !prev[id]}));
  };

  const addToCart = (id) => {
    setQuantities(prev => ({...prev, [id]: 1}));
  };

  const updateQty = (id, delta) => {
    setQuantities(prev => {
      const current = prev[id] || 0;
      const next = current + delta;
      if (next <= 0) {
        const copy = {...prev};
        delete copy[id];
        return copy;
      }
      return {...prev, [id]: next};
    });
  };

  const renderMedicine = ({item}) => {
    const qty = quantities[item.id];
    const isWished = wishlist[item.id];

    return (
      <TouchableOpacity
        style={styles.medicineCard}
        onPress={() => navigation.navigate('MedicineDetail', {medicine: item})}
        activeOpacity={0.7}>
        {/* Left Side */}
        <View style={styles.medicineLeft}>
          <AppText variant="bodyBold" numberOfLines={1}>{item.name}</AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
            {item.subtitle}
          </AppText>

          {/* Rating */}
          <View style={styles.ratingRow}>
            <Icon family="Ionicons" name="star" size={14} color="#F5A623" />
            <AppText variant="caption" style={{marginLeft: s(4)}}>{item.rating}</AppText>
          </View>

          {/* Pricing Table */}
          <View style={styles.priceTable}>
            <View style={styles.priceRow}>
              <AppText variant="caption" color={Colors.textSecondary}>MRP</AppText>
              <AppText
                variant="caption"
                color={Colors.textSecondary}
                style={{textDecorationLine: 'line-through', marginLeft: s(8)}}>
                {'\u20B9'}{item.mrp}
              </AppText>
            </View>
            <View style={styles.priceRow}>
              <AppText variant="caption" color={Colors.primary}>Discount</AppText>
              <AppText variant="caption" color={Colors.primary} style={{marginLeft: s(8)}}>
                {item.discount}%
              </AppText>
            </View>
            <View style={styles.priceRow}>
              <AppText variant="bodyBold" style={{fontSize: ms(13)}}>Net</AppText>
              <AppText variant="bodyBold" style={{marginLeft: s(8), fontSize: ms(13)}}>
                {'\u20B9'}{item.net}
              </AppText>
            </View>
          </View>
        </View>

        {/* Right Side */}
        <View style={styles.medicineRight}>
          <TouchableOpacity
            onPress={() => toggleWishlist(item.id)}
            style={styles.wishlistBtn}>
            <Icon
              family="Ionicons"
              name={isWished ? 'heart' : 'heart-outline'}
              size={20}
              color={isWished ? Colors.red : Colors.textTertiary}
            />
          </TouchableOpacity>

          <Image source={item.image} style={styles.medicineImage} resizeMode="contain" />

          {qty ? (
            <View style={styles.qtyContainer}>
              <TouchableOpacity
                onPress={() => updateQty(item.id, -1)}
                style={styles.qtyBtn}>
                <AppText variant="bodyBold" color={Colors.white}>-</AppText>
              </TouchableOpacity>
              <AppText variant="bodyBold" color={Colors.white} style={styles.qtyText}>
                {qty}
              </AppText>
              <TouchableOpacity
                onPress={() => updateQty(item.id, 1)}
                style={styles.qtyBtn}>
                <AppText variant="bodyBold" color={Colors.white}>+</AppText>
              </TouchableOpacity>
            </View>
          ) : (
            <TouchableOpacity
              style={styles.addButton}
              onPress={() => addToCart(item.id)}>
              <AppText variant="bodyBold" color={Colors.white}>ADD</AppText>
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>
    );
  };

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
          <AppText variant="header" color={Colors.white} style={{flex: 1, marginLeft: s(12)}}>
            {brand?.name || 'Medicines'}
          </AppText>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon family="Ionicons" name="search" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search medicines..."
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
            const isActive = activeFilters.includes(chip);
            return (
              <TouchableOpacity
                key={chip}
                style={[
                  styles.filterChip,
                  isActive && styles.filterChipActive,
                ]}
                onPress={() => toggleFilter(chip)}>
                {chip === 'Filters' && (
                  <Icon
                    family="Ionicons"
                    name="options-outline"
                    size={14}
                    color={isActive ? Colors.white : Colors.textPrimary}
                  />
                )}
                <AppText
                  variant="caption"
                  color={isActive ? Colors.white : Colors.textPrimary}
                  style={{marginLeft: chip === 'Filters' ? s(4) : 0}}>
                  {chip}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      {/* Brand Logo */}
      {brand?.image && (
        <View style={styles.brandLogoContainer}>
          <Image source={brand.image} style={styles.brandLogo} resizeMode="contain" />
        </View>
      )}

      {/* Medicine List */}
      <FlatList
        data={medicines}
        keyExtractor={item => item.id}
        renderItem={renderMedicine}
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
  brandLogoContainer: {
    alignItems: 'center',
    paddingVertical: vs(12),
  },
  brandLogo: {
    width: ms(80),
    height: ms(40),
  },
  medicineCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(12),
    marginBottom: vs(12),
  },
  medicineLeft: {
    flex: 1,
    paddingRight: s(12),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(4),
  },
  priceTable: {
    marginTop: vs(8),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(2),
  },
  medicineRight: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: ms(100),
  },
  wishlistBtn: {
    alignSelf: 'flex-end',
  },
  medicineImage: {
    width: ms(70),
    height: ms(70),
    marginVertical: vs(8),
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: ms(6),
    paddingHorizontal: s(20),
    paddingVertical: vs(6),
    alignItems: 'center',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ms(6),
    overflow: 'hidden',
  },
  qtyBtn: {
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
  },
  qtyText: {
    paddingHorizontal: s(8),
  },
});

export default MedicineListScreen;
