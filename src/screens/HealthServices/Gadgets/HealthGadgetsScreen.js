import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  Alert,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const filterChips = ['All', 'Glucometers', 'BP Monitors', 'Fitness Trackers', 'Smart Scales', 'Thermometers'];

const gadgets = [
  {
    id: '1',
    name: 'Accu-Chek Guide',
    category: 'Glucometer',
    price: 1299,
    rating: 4.5,
    feature: 'Auto-sync with TrustLife',
    icon: 'pulse-outline',
    iconBg: Colors.redBg,
    iconColor: Colors.redText,
    filterKey: 'Glucometers',
  },
  {
    id: '2',
    name: 'Omron HEM-7142T1',
    category: 'BP Monitor',
    price: 2499,
    rating: 4.7,
    feature: 'Bluetooth enabled',
    icon: 'heart-outline',
    iconBg: Colors.amberBg,
    iconColor: Colors.amberText,
    filterKey: 'BP Monitors',
  },
  {
    id: '3',
    name: 'Fitbit Charge 6',
    category: 'Fitness Tracker',
    price: 12999,
    rating: 4.6,
    feature: 'Heart rate + SpO2 + Sleep',
    icon: 'watch-outline',
    iconBg: Colors.blueBg,
    iconColor: Colors.blueText,
    filterKey: 'Fitness Trackers',
  },
  {
    id: '4',
    name: 'Withings Body+',
    category: 'Smart Scale',
    price: 5999,
    rating: 4.4,
    feature: 'Weight + BMI + Body fat',
    icon: 'scale-outline',
    iconBg: Colors.purpleBg,
    iconColor: Colors.purpleText,
    filterKey: 'Smart Scales',
  },
  {
    id: '5',
    name: 'FreeStyle Libre 3',
    category: 'CGM Sensor',
    price: 4499,
    rating: 4.8,
    feature: '14-day continuous glucose',
    icon: 'analytics-outline',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    filterKey: 'Glucometers',
  },
  {
    id: '6',
    name: 'Braun ThermoScan',
    category: 'Thermometer',
    price: 3299,
    rating: 4.3,
    feature: 'Ear thermometer + Age Precision',
    icon: 'thermometer-outline',
    iconBg: Colors.amberBg,
    iconColor: Colors.amberText,
    filterKey: 'Thermometers',
  },
];

const HealthGadgetsScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const [activeFilter, setActiveFilter] = useState('All');
  const [searchText, setSearchText] = useState('');

  const filteredGadgets = activeFilter === 'All'
    ? gadgets
    : gadgets.filter(g => g.filterKey === activeFilter);

  const renderGadget = ({item}) => (
    <TouchableOpacity
      style={styles.gadgetCard}
      onPress={() => Alert.alert('Coming soon \u2014 Product details')}
      activeOpacity={0.7}>
      {/* Left Icon */}
      <View style={[styles.iconCircle, {backgroundColor: item.iconBg}]}>
        <Icon family="Ionicons" name={item.icon} size={24} color={item.iconColor} />
      </View>

      {/* Middle Content */}
      <View style={styles.gadgetInfo}>
        <AppText variant="bodyBold" numberOfLines={1}>{item.name}</AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
          {item.category}
        </AppText>
        <AppText variant="bodyBold" color={Colors.primary} style={{marginTop: vs(4)}}>
          {'\u20B9'}{item.price.toLocaleString('en-IN')}
        </AppText>
        <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
          {item.feature}
        </AppText>
        <View style={styles.ratingRow}>
          <Icon family="Ionicons" name="star" size={12} color="#F5A623" />
          <AppText variant="caption" style={{marginLeft: s(4)}}>{item.rating}</AppText>
        </View>
      </View>

      {/* Right Shop Button */}
      <View style={styles.gadgetRight}>
        <TouchableOpacity
          style={styles.shopButton}
          onPress={() => Alert.alert('Coming soon \u2014 Product details')}>
          <AppText variant="caption" color={Colors.tealText}>Shop</AppText>
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
          <View style={{flex: 1, marginLeft: s(12)}}>
            <AppText variant="header" color={Colors.white}>Health Gadgets</AppText>
            <AppText variant="caption" color="rgba(255,255,255,0.7)" style={{marginTop: vs(2)}}>
              Smart devices for better health tracking
            </AppText>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon family="Ionicons" name="search" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search gadgets..."
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

      {/* Gadgets List */}
      <FlatList
        data={filteredGadgets}
        keyExtractor={item => item.id}
        renderItem={renderGadget}
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
  gadgetCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(12),
    marginBottom: vs(12),
  },
  iconCircle: {
    width: ms(48),
    height: ms(48),
    borderRadius: ms(24),
    alignItems: 'center',
    justifyContent: 'center',
  },
  gadgetInfo: {
    flex: 1,
    marginLeft: s(12),
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(4),
  },
  gadgetRight: {
    alignItems: 'center',
    justifyContent: 'center',
    marginLeft: s(8),
  },
  shopButton: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(14),
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
  },
});

export default HealthGadgetsScreen;
