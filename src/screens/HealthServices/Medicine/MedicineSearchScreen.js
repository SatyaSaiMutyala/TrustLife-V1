import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const providers = [
  {
    id: '1',
    name: 'MedPlus Mart',
    logo: require('../../../assets/img/medpluse.png'),
    mrp: 480,
    discount: 20,
    net: 384,
    image: require('../../../assets/img/medicans.png'),
  },
  {
    id: '2',
    name: 'Apollo Pharmacy',
    logo: require('../../../assets/img/apollologo.png'),
    mrp: 480,
    discount: 18,
    net: 394,
    image: require('../../../assets/img/medicans.png'),
  },
  {
    id: '3',
    name: 'Netmeds',
    logo: require('../../../assets/img/netmeds.png'),
    mrp: 480,
    discount: 15,
    net: 408,
    image: require('../../../assets/img/medicans.png'),
  },
];

const MedicineSearchScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');

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
          <View style={styles.searchBar}>
            <Icon family="Ionicons" name="search" size={18} color={Colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search medicines..."
              placeholderTextColor={Colors.textTertiary}
              value={searchText}
              onChangeText={setSearchText}
              autoFocus
            />
          </View>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{paddingBottom: vs(30)}}
        showsVerticalScrollIndicator={false}>

        {/* Title */}
        <AppText variant="header" style={{marginTop: vs(16)}}>
          Medicine Search Results
        </AppText>

        {/* Description Card */}
        <View style={styles.descriptionCard}>
          <AppText variant="bodyBold" style={{textAlign: 'center'}}>Paracetamol</AppText>
          <AppText
            variant="body"
            color={Colors.textSecondary}
            style={{marginTop: vs(8), textAlign: 'center', lineHeight: ms(20)}}>
            Paracetamol is used to relieve mild to moderate pain and reduce fever. It is one of the most commonly used over-the-counter medications worldwide.
          </AppText>
        </View>

        {/* Provider Section */}
        <AppText variant="header" style={{marginTop: vs(20)}}>
          Medicine Provider
        </AppText>

        {providers.map(provider => (
          <TouchableOpacity
            key={provider.id}
            style={styles.providerCard}
            onPress={() => navigation.navigate('MedicineDetail', {medicine: provider})}
            activeOpacity={0.7}>
            {/* Left Side */}
            <View style={styles.providerLeft}>
              <Image source={provider.logo} style={styles.providerLogo} resizeMode="contain" />
              <View style={styles.providerPricing}>
                <View style={styles.providerPriceRow}>
                  <AppText variant="caption" color={Colors.textSecondary}>MRP</AppText>
                  <AppText
                    variant="caption"
                    color={Colors.textSecondary}
                    style={{textDecorationLine: 'line-through', marginLeft: s(6)}}>
                    {'\u20B9'}{provider.mrp}
                  </AppText>
                </View>
                <View style={styles.providerPriceRow}>
                  <AppText variant="caption" color={Colors.primary}>Discount</AppText>
                  <AppText variant="caption" color={Colors.primary} style={{marginLeft: s(6)}}>
                    {provider.discount}%
                  </AppText>
                </View>
                <View style={styles.providerPriceRow}>
                  <AppText variant="bodyBold">Net</AppText>
                  <AppText variant="bodyBold" style={{marginLeft: s(6)}}>
                    {'\u20B9'}{provider.net}
                  </AppText>
                </View>
              </View>
            </View>

            {/* Right Side */}
            <View style={styles.providerRight}>
              <Image source={provider.image} style={styles.providerImage} resizeMode="contain" />
              <TouchableOpacity style={styles.addButton}>
                <AppText variant="bodyBold" color={Colors.white}>ADD</AppText>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        ))}
      </ScrollView>
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
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    paddingHorizontal: s(14),
    marginLeft: s(12),
  },
  searchInput: {
    flex: 1,
    paddingVertical: vs(10),
    marginLeft: s(8),
    fontSize: ms(14),
    color: Colors.textPrimary,
  },
  content: {
    flex: 1,
    paddingHorizontal: s(16),
  },
  descriptionCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(16),
    marginTop: vs(12),
  },
  providerCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(12),
    marginTop: vs(12),
  },
  providerLeft: {
    flex: 1,
    paddingRight: s(12),
  },
  providerLogo: {
    width: ms(60),
    height: ms(30),
  },
  providerPricing: {
    marginTop: vs(10),
  },
  providerPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(2),
  },
  providerRight: {
    alignItems: 'center',
    justifyContent: 'space-between',
    width: ms(90),
  },
  providerImage: {
    width: ms(65),
    height: ms(65),
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

export default MedicineSearchScreen;
