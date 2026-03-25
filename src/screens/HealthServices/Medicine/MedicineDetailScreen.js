import React, {useState} from 'react';
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

const tabs = ['Overview', 'Uses', 'Dosage', 'Safety'];

const commonUses = [
  {id: '1', name: 'Fever', icon: 'thermometer-outline'},
  {id: '2', name: 'Headache', icon: 'head-outline'},
  {id: '3', name: 'Body pain', icon: 'body-outline'},
  {id: '4', name: 'Toothache', icon: 'medical-outline'},
  {id: '5', name: 'Cold & flu', icon: 'snow-outline'},
];

const dosageInstructions = [
  {id: '1', title: 'Adults (12 years and above)', detail: 'Take 1-2 tablets every 4-6 hours as needed. Do not exceed 8 tablets in 24 hours.'},
  {id: '2', title: 'Children (6-12 years)', detail: 'Take half to 1 tablet every 4-6 hours. Do not exceed 4 tablets in 24 hours.'},
  {id: '3', title: 'Special Instructions', detail: 'Take with or after food. Swallow whole with water. Do not crush or chew.'},
];

const safetyWarnings = [
  {id: '1', text: 'Do not exceed the recommended dosage. Overdose may cause serious liver damage.'},
  {id: '2', text: 'Consult a doctor before use if you have liver or kidney disease.'},
  {id: '3', text: 'Avoid alcohol consumption while taking this medicine.'},
];

const MedicineDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {medicine} = route.params || {};
  const [activeTab, setActiveTab] = useState('Overview');
  const [qty, setQty] = useState(0);
  const [expandedDosage, setExpandedDosage] = useState({});

  const toggleDosage = (id) => {
    setExpandedDosage(prev => ({...prev, [id]: !prev[id]}));
  };

  const renderStarBar = (stars, count, total) => {
    const pct = (count / total) * 100;
    return (
      <View key={stars} style={styles.starBarRow}>
        <AppText variant="caption" style={{width: s(12)}}>{stars}</AppText>
        <Icon family="Ionicons" name="star" size={12} color="#F5A623" />
        <View style={styles.starBarBg}>
          <View style={[styles.starBarFill, {width: `${pct}%`}]} />
        </View>
        <AppText variant="caption" color={Colors.textSecondary} style={{width: s(30), textAlign: 'right'}}>
          {count}
        </AppText>
      </View>
    );
  };

  const ratingData = [
    {stars: 5, count: 520},
    {stars: 4, count: 280},
    {stars: 3, count: 100},
    {stars: 2, count: 50},
    {stars: 1, count: 50},
  ];
  const totalRatings = ratingData.reduce((sum, r) => sum + r.count, 0);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <ScrollView showsVerticalScrollIndicator={false} bounces={false}>
        {/* Hero Section */}
        <View style={styles.heroSection}>
          <View style={styles.heroHeader}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}>
              <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.white} />
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.cartButton}
              onPress={() => navigation.navigate('MedicineCart')}>
              <Icon family="Ionicons" name="cart-outline" size={22} color={Colors.white} />
              <View style={styles.cartBadge}>
                <AppText variant="small" color={Colors.white} style={{fontSize: ms(10)}}>2</AppText>
              </View>
            </TouchableOpacity>
          </View>

          <Image
            source={require('../../../assets/img/medicans.png')}
            style={styles.heroImage}
            resizeMode="contain"
          />
        </View>

        {/* Content */}
        <View style={styles.contentSection}>
          {/* Discount Badge */}
          <View style={styles.discountBadge}>
            <AppText variant="small" color={Colors.white}>20% OFF</AppText>
          </View>

          {/* Name & Rating */}
          <AppText variant="screenName" style={{marginTop: vs(12)}}>Paracetamol</AppText>
          <AppText variant="body" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
            500mg Tablets
          </AppText>

          <View style={styles.ratingBadge}>
            <Icon family="Ionicons" name="star" size={14} color="#F5A623" />
            <AppText variant="caption" style={{marginLeft: s(4)}}>4.5</AppText>
            <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(6)}}>
              86k Reviews
            </AppText>
          </View>

          {/* Price Row */}
          <View style={styles.priceRow}>
            <View style={styles.priceLeft}>
              <AppText variant="bodyBold">
                Price {'\u20B9'}384
              </AppText>
              <AppText
                variant="caption"
                color={Colors.textSecondary}
                style={{textDecorationLine: 'line-through', marginLeft: s(8)}}>
                MRP {'\u20B9'}480
              </AppText>
            </View>
            {qty > 0 ? (
              <View style={styles.qtyContainer}>
                <TouchableOpacity
                  onPress={() => setQty(q => Math.max(0, q - 1))}
                  style={styles.qtyBtn}>
                  <AppText variant="bodyBold" color={Colors.white}>-</AppText>
                </TouchableOpacity>
                <AppText variant="bodyBold" color={Colors.white} style={styles.qtyText}>
                  {qty}
                </AppText>
                <TouchableOpacity
                  onPress={() => setQty(q => q + 1)}
                  style={styles.qtyBtn}>
                  <AppText variant="bodyBold" color={Colors.white}>+</AppText>
                </TouchableOpacity>
              </View>
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setQty(1)}>
                <AppText variant="bodyBold" color={Colors.white}>ADD</AppText>
              </TouchableOpacity>
            )}
          </View>

          {/* Tab Pills */}
          <View style={styles.tabRow}>
            {tabs.map(tab => (
              <TouchableOpacity
                key={tab}
                style={[styles.tabPill, activeTab === tab && styles.tabPillActive]}
                onPress={() => setActiveTab(tab)}>
                <AppText
                  variant="caption"
                  color={activeTab === tab ? Colors.white : Colors.textPrimary}>
                  {tab}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>

          {/* Description */}
          <AppText variant="body" color={Colors.textSecondary} style={{marginTop: vs(16), lineHeight: ms(22)}}>
            Paracetamol is a widely used medication for reducing fever and relieving mild to moderate pain such as headache, toothache, and body aches. It is generally well-tolerated when taken at recommended doses.
          </AppText>

          {/* Form / Strength Info */}
          <View style={styles.infoChipsRow}>
            <View style={styles.infoChip}>
              <AppText variant="caption" color={Colors.textSecondary}>Form</AppText>
              <AppText variant="bodyBold" style={{marginTop: vs(2)}}>Tablet</AppText>
            </View>
            <View style={styles.infoChip}>
              <AppText variant="caption" color={Colors.textSecondary}>Strength</AppText>
              <AppText variant="bodyBold" style={{marginTop: vs(2)}}>500mg</AppText>
            </View>
          </View>

          {/* Common Uses */}
          <AppText variant="header" style={{marginTop: vs(20)}}>Common Uses</AppText>
          <View style={styles.usesRow}>
            {commonUses.map(use => (
              <View key={use.id} style={styles.useChip}>
                <Icon family="Ionicons" name={use.icon} size={16} color={Colors.primary} />
                <AppText variant="caption" style={{marginLeft: s(6)}}>{use.name}</AppText>
              </View>
            ))}
          </View>

          {/* Dosage Instructions */}
          <AppText variant="header" style={{marginTop: vs(20)}}>Dosage Instructions</AppText>
          {dosageInstructions.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.dosageRow}
              onPress={() => toggleDosage(item.id)}
              activeOpacity={0.7}>
              <View style={styles.dosageHeader}>
                <AppText variant="bodyBold" style={{flex: 1}}>{item.title}</AppText>
                <Icon
                  family="Ionicons"
                  name={expandedDosage[item.id] ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={Colors.textSecondary}
                />
              </View>
              {expandedDosage[item.id] && (
                <AppText variant="body" color={Colors.textSecondary} style={{marginTop: vs(8)}}>
                  {item.detail}
                </AppText>
              )}
            </TouchableOpacity>
          ))}

          {/* Safety & Warnings */}
          <AppText variant="header" style={{marginTop: vs(20)}}>Safety & Warnings</AppText>
          {safetyWarnings.map(item => (
            <View key={item.id} style={styles.warningRow}>
              <Icon family="Ionicons" name="alert-circle" size={18} color={Colors.red} />
              <AppText variant="body" color={Colors.textSecondary} style={styles.warningText}>
                {item.text}
              </AppText>
            </View>
          ))}

          {/* Product Details */}
          <AppText variant="header" style={{marginTop: vs(20)}}>Product Details</AppText>
          <View style={styles.productDetailsCard}>
            <View style={styles.detailGrid}>
              <View style={styles.detailItem}>
                <AppText variant="caption" color={Colors.textSecondary}>Generic Name</AppText>
                <AppText variant="bodyBold" style={{marginTop: vs(2)}}>Paracetamol</AppText>
              </View>
              <View style={styles.detailItem}>
                <AppText variant="caption" color={Colors.textSecondary}>Manufacturer</AppText>
                <AppText variant="bodyBold" style={{marginTop: vs(2)}}>Cipla Ltd.</AppText>
              </View>
              <View style={styles.detailItem}>
                <AppText variant="caption" color={Colors.textSecondary}>Expiry</AppText>
                <AppText variant="bodyBold" style={{marginTop: vs(2)}}>Mar 2028</AppText>
              </View>
              <View style={styles.detailItem}>
                <AppText variant="caption" color={Colors.textSecondary}>Salt Composition</AppText>
                <AppText variant="bodyBold" style={{marginTop: vs(2)}}>Paracetamol 500mg</AppText>
              </View>
            </View>
          </View>

          {/* Reviews */}
          <AppText variant="header" style={{marginTop: vs(20)}}>Reviews</AppText>
          <View style={styles.reviewSummary}>
            <View style={styles.reviewLeft}>
              <AppText variant="screenName" style={{fontSize: ms(36)}}>4.3</AppText>
              <View style={styles.starsRow}>
                {[1, 2, 3, 4].map(i => (
                  <Icon key={i} family="Ionicons" name="star" size={14} color="#F5A623" />
                ))}
                <Icon family="Ionicons" name="star-half" size={14} color="#F5A623" />
              </View>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(4)}}>
                {totalRatings} ratings
              </AppText>
            </View>
            <View style={styles.reviewBars}>
              {ratingData.map(r => renderStarBar(r.stars, r.count, totalRatings))}
            </View>
          </View>

          {/* Review Card */}
          <View style={styles.reviewCard}>
            <View style={styles.reviewCardHeader}>
              <View style={styles.avatarCircle}>
                <AppText variant="bodyBold" color={Colors.white}>RS</AppText>
              </View>
              <View style={{marginLeft: s(10), flex: 1}}>
                <AppText variant="bodyBold">Rahul Sharma</AppText>
                <View style={{flexDirection: 'row', marginTop: vs(2)}}>
                  {[1, 2, 3, 4, 5].map(i => (
                    <Icon key={i} family="Ionicons" name="star" size={12} color="#F5A623" />
                  ))}
                </View>
              </View>
            </View>
            <AppText variant="body" color={Colors.textSecondary} style={{marginTop: vs(8)}}>
              Works great for mild fever and headaches. Fast acting and affordable. Have been using it for years without any side effects.
            </AppText>
          </View>
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
  heroSection: {
    backgroundColor: Colors.primary,
    paddingTop: vs(16),
    paddingBottom: vs(30),
    alignItems: 'center',
  },
  heroHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    width: '100%',
    paddingHorizontal: s(16),
  },
  backButton: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartButton: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: -vs(2),
    right: -s(2),
    backgroundColor: Colors.red,
    borderRadius: ms(8),
    width: ms(16),
    height: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
  },
  heroImage: {
    width: ms(180),
    height: ms(180),
    marginTop: vs(20),
  },
  contentSection: {
    backgroundColor: Colors.background,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    marginTop: -vs(16),
    paddingHorizontal: s(16),
    paddingTop: vs(16),
    paddingBottom: vs(40),
  },
  discountBadge: {
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingHorizontal: s(12),
    paddingVertical: vs(4),
    alignSelf: 'flex-start',
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(8),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(16),
    paddingBottom: vs(16),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  priceLeft: {
    flexDirection: 'row',
    alignItems: 'center',
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
  tabRow: {
    flexDirection: 'row',
    marginTop: vs(16),
  },
  tabPill: {
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    borderRadius: ms(20),
    backgroundColor: Colors.white,
    marginRight: s(8),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  tabPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  infoChipsRow: {
    flexDirection: 'row',
    marginTop: vs(16),
    gap: s(12),
  },
  infoChip: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(12),
  },
  usesRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: vs(12),
    gap: s(8),
  },
  useChip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(20),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  dosageRow: {
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(14),
    marginTop: vs(10),
  },
  dosageHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  warningRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: vs(10),
    backgroundColor: Colors.redBg,
    borderRadius: ms(10),
    padding: ms(12),
  },
  warningText: {
    flex: 1,
    marginLeft: s(10),
    lineHeight: ms(20),
  },
  productDetailsCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(16),
    marginTop: vs(12),
  },
  detailGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  detailItem: {
    width: '50%',
    marginBottom: vs(14),
  },
  reviewSummary: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(16),
    marginTop: vs(12),
  },
  reviewLeft: {
    alignItems: 'center',
    paddingRight: s(20),
    borderRightWidth: 0.5,
    borderRightColor: Colors.borderLight,
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: vs(4),
  },
  reviewBars: {
    flex: 1,
    paddingLeft: s(16),
    justifyContent: 'center',
  },
  starBarRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(4),
  },
  starBarBg: {
    flex: 1,
    height: vs(4),
    backgroundColor: '#e5e7eb',
    borderRadius: ms(2),
    marginHorizontal: s(6),
    overflow: 'hidden',
  },
  starBarFill: {
    height: '100%',
    backgroundColor: '#F5A623',
    borderRadius: ms(2),
  },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(16),
    marginTop: vs(12),
  },
  reviewCardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MedicineDetailScreen;
