import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
  TextInput,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const stats = [
  {value: '6500+', label: 'Hospitals'},
  {value: '98%', label: 'Settlement'},
  {value: '2 Years', label: 'Waiting'},
];

const benefitSections = [
  {
    id: 'b1',
    title: 'In-patient Hospitalization',
    icon: 'bed-outline',
    detail: 'Covers room rent, nursing charges, ICU charges, surgeon fees, anaesthesia, blood, oxygen, OT charges, medicines and drugs during hospitalization.',
  },
  {
    id: 'b2',
    title: 'Pre/Post Hospitalization',
    icon: 'medkit-outline',
    detail: 'Expenses incurred 30 days before and 60 days after hospitalization including diagnostics, medicines, and follow-up consultations.',
  },
  {
    id: 'b3',
    title: 'Daycare Procedures',
    icon: 'today-outline',
    detail: 'Covers 500+ daycare procedures that do not require 24-hour hospitalization, including dialysis, chemotherapy, and cataract surgery.',
  },
  {
    id: 'b4',
    title: 'No Claim Bonus',
    icon: 'gift-outline',
    detail: 'Get up to 50% increase in sum insured for every claim-free year. Accumulated bonus is maintained even after a claim.',
  },
  {
    id: 'b5',
    title: 'AYUSH Treatment',
    icon: 'leaf-outline',
    detail: 'Coverage for Ayurveda, Yoga, Unani, Siddha and Homeopathy treatments taken in government or recognized hospitals.',
  },
];

const nearbyHospitals = [
  {id: 'h1', name: 'Apollo Hospital', distance: '2.3 km', cashless: true},
  {id: 'h2', name: 'Fortis Healthcare', distance: '4.1 km', cashless: true},
];

const reviews = [
  {id: 'r1', name: 'Rahul M.', initials: 'RM', rating: 5, text: 'Excellent plan with seamless cashless facility. Claim was settled within 2 hours at Apollo Hospital.'},
  {id: 'r2', name: 'Sneha K.', initials: 'SK', rating: 4, text: 'Good coverage and affordable premium. The pre-hospitalization benefit saved me a lot during my treatment.'},
];

const InsurancePlanDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {plan} = route.params || {};
  const [expandedBenefit, setExpandedBenefit] = useState(null);

  const toggleBenefit = (id) => {
    setExpandedBenefit(expandedBenefit === id ? null : id);
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <ScrollView showsVerticalScrollIndicator={false}>
        {/* Hero Image */}
        <View style={styles.heroWrap}>
          <Image source={plan?.image} style={styles.heroImage} resizeMode="cover" />
          <TouchableOpacity
            style={styles.backBtnOverlay}
            activeOpacity={0.7}
            onPress={() => navigation.goBack()}>
            <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.white} />
          </TouchableOpacity>
        </View>

        {/* Stats Strip */}
        <View style={styles.statsStrip}>
          {stats.map((stat, index) => (
            <View key={index} style={styles.statCol}>
              <AppText variant="bodyBold" color={Colors.primary}>{stat.value}</AppText>
              <AppText variant="small" color={Colors.textSecondary}>{stat.label}</AppText>
            </View>
          ))}
        </View>

        <View style={styles.body}>
          {/* Plan Name & Description */}
          <AppText variant="header">{plan?.name || 'Insurance Plan'}</AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(6)}}>
            {plan?.description || 'Comprehensive health insurance coverage for you and your family.'}
          </AppText>

          <View style={styles.coverageRow}>
            <Icon family="Ionicons" name="shield-checkmark-outline" size={16} color={Colors.primary} />
            <AppText variant="small" color={Colors.primary} style={{fontWeight: '600', marginLeft: s(4)}}>
              Coverage up to Rs. {plan?.coverage || '5L'}
            </AppText>
          </View>

          {/* Plan Benefits */}
          <View style={styles.sectionTitleRow}>
            <Icon family="Ionicons" name="list-outline" size={20} color={Colors.primary} />
            <AppText variant="bodyBold" style={{marginLeft: s(8)}}>Plan Benefits</AppText>
          </View>

          {benefitSections.map((section) => {
            const isExpanded = expandedBenefit === section.id;
            return (
              <TouchableOpacity
                key={section.id}
                style={styles.accordionCard}
                activeOpacity={0.7}
                onPress={() => toggleBenefit(section.id)}>
                <View style={styles.accordionHeader}>
                  <View style={styles.accordionIconWrap}>
                    <Icon family="Ionicons" name={section.icon} size={20} color={Colors.primary} />
                  </View>
                  <AppText variant="body" style={{flex: 1, fontWeight: '500'}}>{section.title}</AppText>
                  <Icon
                    family="Ionicons"
                    name={isExpanded ? 'chevron-up' : 'chevron-down'}
                    size={18}
                    color={Colors.textSecondary}
                  />
                </View>
                {isExpanded && (
                  <View style={styles.accordionBody}>
                    <AppText variant="caption" color={Colors.textSecondary}>{section.detail}</AppText>
                  </View>
                )}
              </TouchableOpacity>
            );
          })}

          {/* Nearby Hospitals */}
          <View style={styles.sectionTitleRow}>
            <Icon family="Ionicons" name="location-outline" size={20} color={Colors.primary} />
            <AppText variant="bodyBold" style={{marginLeft: s(8)}}>Nearby Hospitals</AppText>
          </View>

          <View style={styles.hospitalCard}>
            <View style={styles.hospitalSearchBar}>
              <Icon family="Ionicons" name="search-outline" size={16} color={Colors.textTertiary} />
              <TextInput
                style={styles.hospitalSearchInput}
                placeholder="Search hospitals..."
                placeholderTextColor={Colors.textTertiary}
              />
            </View>

            {nearbyHospitals.map((hospital) => (
              <View key={hospital.id} style={styles.hospitalRow}>
                <View style={styles.hospitalIconWrap}>
                  <Icon family="Ionicons" name="business-outline" size={20} color={Colors.primary} />
                </View>
                <View style={{flex: 1}}>
                  <AppText variant="body" style={{fontWeight: '500'}}>{hospital.name}</AppText>
                  <AppText variant="small" color={Colors.textSecondary}>{hospital.distance}</AppText>
                </View>
                {hospital.cashless && (
                  <View style={styles.cashlessBadge}>
                    <AppText variant="small" color={Colors.tealText} style={{fontWeight: '600'}}>Cashless</AppText>
                  </View>
                )}
              </View>
            ))}
          </View>

          {/* Reviews */}
          <View style={styles.sectionTitleRow}>
            <Icon family="Ionicons" name="chatbubbles-outline" size={20} color={Colors.primary} />
            <AppText variant="bodyBold" style={{marginLeft: s(8)}}>Reviews</AppText>
            <View style={styles.ratingBadge}>
              <Icon family="Ionicons" name="star" size={14} color="#f59e0b" />
              <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '700', marginLeft: s(3)}}>4.8</AppText>
            </View>
          </View>

          {reviews.map((review) => (
            <View key={review.id} style={styles.reviewCard}>
              <View style={styles.reviewHeader}>
                <View style={styles.avatarCircle}>
                  <AppText variant="small" color={Colors.white} style={{fontWeight: '700'}}>{review.initials}</AppText>
                </View>
                <View style={{flex: 1, marginLeft: s(10)}}>
                  <AppText variant="body" style={{fontWeight: '500'}}>{review.name}</AppText>
                  <View style={styles.starsRow}>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <Icon
                        key={star}
                        family="Ionicons"
                        name={star <= review.rating ? 'star' : 'star-outline'}
                        size={14}
                        color="#f59e0b"
                      />
                    ))}
                  </View>
                </View>
              </View>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(8)}}>
                {review.text}
              </AppText>
            </View>
          ))}

          <View style={{height: vs(100)}} />
        </View>
      </ScrollView>

      {/* Bottom Sticky Bar */}
      <View style={styles.bottomBar}>
        <View>
          <AppText variant="small" color={Colors.textSecondary}>Premium</AppText>
          <AppText variant="header" color={Colors.primary}>Rs. {plan?.premium || 500}/mo</AppText>
        </View>
        <TouchableOpacity
          style={styles.buyBtn}
          activeOpacity={0.8}
          onPress={() => navigation.navigate('InsuranceNomineeDetails', {plan})}>
          <AppText variant="bodyBold" color={Colors.white}>Buy Policy Now</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  heroWrap: {
    position: 'relative',
  },
  heroImage: {
    width: '100%',
    height: vs(220),
  },
  backBtnOverlay: {
    position: 'absolute',
    top: vs(14),
    left: s(16),
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  statsStrip: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    marginHorizontal: s(16),
    marginTop: vs(-28),
    paddingVertical: vs(14),
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
  },
  body: {
    paddingHorizontal: s(16),
    paddingTop: vs(16),
  },
  coverageRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(12),
    backgroundColor: Colors.tealBg,
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    alignSelf: 'flex-start',
  },
  sectionTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(24),
    marginBottom: vs(12),
  },
  accordionCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    marginBottom: vs(8),
    overflow: 'hidden',
  },
  accordionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(14),
  },
  accordionIconWrap: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  accordionBody: {
    paddingHorizontal: ms(14),
    paddingBottom: ms(14),
    paddingTop: 0,
  },
  hospitalCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: ms(14),
  },
  hospitalSearchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    paddingHorizontal: s(10),
    paddingVertical: vs(8),
    marginBottom: vs(10),
  },
  hospitalSearchInput: {
    flex: 1,
    marginLeft: s(6),
    fontSize: ms(13),
    color: Colors.textPrimary,
    padding: 0,
  },
  hospitalRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  hospitalIconWrap: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(10),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  cashlessBadge: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(8),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
  },
  ratingBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tealBg,
    borderRadius: ms(10),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    marginLeft: 'auto',
  },
  reviewCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: ms(14),
    marginBottom: vs(10),
  },
  reviewHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  avatarCircle: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(19),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  starsRow: {
    flexDirection: 'row',
    gap: s(2),
    marginTop: vs(2),
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    paddingBottom: vs(24),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  buyBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingHorizontal: s(24),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default InsurancePlanDetailScreen;
