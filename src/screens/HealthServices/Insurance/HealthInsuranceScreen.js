import React from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const insurancePlans = [
  {
    id: '1',
    name: 'Star Health Insurance',
    image: require('../../../assets/img/hospital-one.png'),
    premium: 500,
    coverage: '5L',
    description: 'Comprehensive health coverage with cashless hospitalization across 6500+ hospitals.',
    benefits: [
      'Cashless hospitalization',
      'Pre & post hospitalization cover',
      'No claim bonus up to 50%',
    ],
  },
  {
    id: '2',
    name: 'HDFC ERGO Health Plan',
    image: require('../../../assets/img/hospital-two.png'),
    premium: 750,
    coverage: '10L',
    description: 'Premium health plan with extensive coverage for critical illnesses and daycare procedures.',
    benefits: [
      'Critical illness cover',
      'Daycare procedures included',
      'Restoration benefit available',
    ],
  },
  {
    id: '3',
    name: 'Niva Bupa ReAssure',
    image: require('../../../assets/img/hospital-one.png'),
    premium: 999,
    coverage: '20L',
    description: 'High-value plan with unlimited restoration, AYUSH treatment and global coverage.',
    benefits: [
      'Unlimited restoration benefit',
      'AYUSH treatment covered',
      'Global emergency cover',
    ],
  },
];

const HealthInsuranceScreen = () => {
  const navigation = useNavigation();

  const renderPlanCard = ({item}) => (
    <TouchableOpacity
      style={styles.card}
      activeOpacity={0.7}
      onPress={() => navigation.navigate('InsurancePlanDetail', {plan: item})}>
      <View style={styles.imageWrap}>
        <Image source={item.image} style={styles.cardImage} resizeMode="cover" />
        <View style={styles.premiumBadge}>
          <Icon family="Ionicons" name="wallet-outline" size={14} color={Colors.primary} />
          <AppText variant="small" color={Colors.primary} style={{fontWeight: '700', marginLeft: s(4)}}>
            Rs. {item.premium}/mo
          </AppText>
        </View>
      </View>

      <View style={styles.cardBody}>
        <AppText variant="bodyBold" numberOfLines={1}>{item.name}</AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(4)}} numberOfLines={2}>
          {item.description}
        </AppText>

        <View style={styles.coverageRow}>
          <Icon family="Ionicons" name="shield-checkmark-outline" size={16} color={Colors.primary} />
          <AppText variant="small" color={Colors.primary} style={{fontWeight: '600', marginLeft: s(4)}}>
            Coverage up to Rs. {item.coverage}
          </AppText>
        </View>

        <View style={styles.benefitsWrap}>
          {item.benefits.map((benefit, index) => (
            <View key={index} style={styles.benefitRow}>
              <Icon family="Ionicons" name="checkmark-circle" size={14} color={Colors.teal} />
              <AppText variant="small" color={Colors.textSecondary} style={{marginLeft: s(6), flex: 1}}>
                {benefit}
              </AppText>
            </View>
          ))}
        </View>

        <TouchableOpacity
          style={styles.viewMoreRow}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('InsurancePlanDetail', {plan: item})}>
          <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>View more</AppText>
          <Icon family="Ionicons" name="arrow-forward" size={14} color={Colors.primary} />
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <AppText variant="screenName" color={Colors.white}>Health Insurance</AppText>
            <AppText variant="subtitle" color="rgba(255,255,255,0.6)" style={{marginTop: vs(3)}}>
              Protect your family with the best plans
            </AppText>
          </View>
        </View>

        {/* Search Bar */}
        <View style={styles.searchBar}>
          <Icon family="Ionicons" name="search-outline" size={18} color={Colors.textTertiary} />
          <TextInput
            style={styles.searchInput}
            placeholder="Search insurance plans..."
            placeholderTextColor={Colors.textTertiary}
          />
        </View>
      </View>

      {/* Content */}
      <FlatList
        data={insurancePlans}
        keyExtractor={item => item.id}
        contentContainerStyle={styles.listContent}
        showsVerticalScrollIndicator={false}
        renderItem={renderPlanCard}
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
    paddingBottom: vs(14),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
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
  listContent: {
    paddingHorizontal: s(16),
    paddingTop: vs(16),
    paddingBottom: vs(24),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    overflow: 'hidden',
    marginBottom: vs(14),
  },
  imageWrap: {
    position: 'relative',
  },
  cardImage: {
    width: '100%',
    height: vs(140),
  },
  premiumBadge: {
    position: 'absolute',
    bottom: vs(10),
    left: s(10),
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(20),
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
  },
  cardBody: {
    padding: ms(14),
  },
  coverageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10),
    backgroundColor: Colors.tealBg,
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
  },
  benefitsWrap: {
    marginTop: vs(10),
    gap: vs(6),
  },
  benefitRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewMoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
    marginTop: vs(12),
  },
});

export default HealthInsuranceScreen;
