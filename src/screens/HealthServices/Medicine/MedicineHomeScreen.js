import React from 'react';
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

const pharmacies = [
  {id: '1', name: 'Apollo Pharmacy', image: require('../../../assets/img/apollologo.png')},
  {id: '2', name: 'MedPlus Mart', image: require('../../../assets/img/medpluse.png')},
  {id: '3', name: 'Netmeds', image: require('../../../assets/img/netmeds.png')},
];

const MedicineHomeScreen = () => {
  const navigation = useNavigation();

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
            Medicines
          </AppText>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('MedicineSearch')}>
          <Icon family="Ionicons" name="search" size={18} color={Colors.textTertiary} />
          <AppText variant="body" color={Colors.textTertiary} style={{marginLeft: s(8)}}>
            Search medicines...
          </AppText>
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{paddingBottom: vs(30)}}
        showsVerticalScrollIndicator={false}>

        {/* Section Title */}
        <AppText
          variant="caption"
          color={Colors.textSecondary}
          style={styles.sectionTitle}>
          MEDICAL PHARMA
        </AppText>

        {/* Pharmacy Cards */}
        <View style={styles.pharmacyRow}>
          {pharmacies.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.pharmacyCard}
              onPress={() => navigation.navigate('MedicineList', {brand: item})}>
              <Image source={item.image} style={styles.pharmacyImage} resizeMode="contain" />
              <AppText
                variant="caption"
                style={{marginTop: vs(8), textAlign: 'center'}}
                numberOfLines={2}>
                {item.name}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
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
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    marginTop: vs(14),
  },
  content: {
    flex: 1,
    paddingHorizontal: s(16),
  },
  sectionTitle: {
    textAlign: 'center',
    marginTop: vs(24),
    marginBottom: vs(16),
    letterSpacing: 1.5,
  },
  pharmacyRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  pharmacyCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: ms(12),
    width: (s(328) - s(24)) / 3,
  },
  pharmacyImage: {
    width: ms(85),
    height: ms(85),
  },
});

export default MedicineHomeScreen;
