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

const filterChips = ['Filters', 'Men', 'Women', 'Kids'];

const labTests = [
  {
    id: '1',
    name: 'Glycosylated Haemoglobin (GHb/HbA1c)',
    mrp: 480,
    discount: 20,
    net: 350,
    reportDays: 3,
  },
  {
    id: '2',
    name: 'Complete Blood Count (CBC)',
    mrp: 480,
    discount: 20,
    net: 350,
    reportDays: 3,
  },
  {
    id: '3',
    name: 'Thyroid Profile (T3, T4, TSH)',
    mrp: 480,
    discount: 20,
    net: 350,
    reportDays: 3,
  },
  {
    id: '4',
    name: 'Lipid Profile (Cholesterol)',
    mrp: 480,
    discount: 20,
    net: 350,
    reportDays: 3,
  },
  {
    id: '5',
    name: 'Liver Function Test (LFT)',
    mrp: 480,
    discount: 20,
    net: 350,
    reportDays: 3,
  },
];

const LabTestListScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {lab} = route.params || {};
  const [activeFilters, setActiveFilters] = useState([]);
  const [searchText, setSearchText] = useState('');

  const toggleFilter = (filter) => {
    if (filter === 'Filters') {
      navigation.navigate('LabFilter');
      return;
    }
    setActiveFilters(prev =>
      prev.includes(filter)
        ? prev.filter(f => f !== filter)
        : [...prev, filter],
    );
  };

  const renderTest = ({item}) => (
    <TouchableOpacity
      style={styles.testCard}
      onPress={() => navigation.navigate('LabTestDetail', {test: item})}
      activeOpacity={0.7}>
      {/* Left Side */}
      <View style={styles.testLeft}>
        <AppText variant="bodyBold" numberOfLines={2}>{item.name}</AppText>

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
            <AppText variant="bodyBold" style={{fontSize: ms(13)}}>Net Amount</AppText>
            <AppText variant="bodyBold" style={{marginLeft: s(8), fontSize: ms(13)}}>
              {'\u20B9'}{item.net}
            </AppText>
          </View>
        </View>
      </View>

      {/* Right Side */}
      <View style={styles.testRight}>
        <View style={styles.reportBox}>
          <AppText variant="caption" color={Colors.textSecondary}>Report in</AppText>
          <AppText variant="header" color={Colors.textPrimary}>{item.reportDays}</AppText>
          <AppText variant="caption" color={Colors.textSecondary}>Days</AppText>
        </View>
        <TouchableOpacity style={styles.addButton}>
          <AppText variant="bodyBold" color={Colors.white}>ADD</AppText>
        </TouchableOpacity>
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
          <AppText variant="header" color={Colors.white} style={{flex: 1, marginLeft: s(12)}}>
            {lab?.name || 'Lab Tests'}
          </AppText>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon family="Ionicons" name="search" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search tests..."
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

      {/* Lab Logo */}
      {lab?.image && (
        <View style={styles.brandLogoContainer}>
          <Image source={lab.image} style={styles.brandLogo} resizeMode="contain" />
        </View>
      )}

      {/* Test List */}
      <FlatList
        data={labTests}
        keyExtractor={item => item.id}
        renderItem={renderTest}
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
  testCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(12),
    marginBottom: vs(12),
  },
  testLeft: {
    flex: 1,
    paddingRight: s(12),
  },
  priceTable: {
    marginTop: vs(10),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(2),
  },
  testRight: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: ms(90),
  },
  reportBox: {
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
    alignItems: 'center',
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: ms(6),
    paddingHorizontal: s(20),
    paddingVertical: vs(6),
    alignItems: 'center',
    marginTop: vs(8),
  },
});

export default LabTestListScreen;
