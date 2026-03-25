import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Modal,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const testsIncluded = [
  'Hemoglobin A1c',
  'Fasting Blood Sugar',
  'Post Prandial Blood Sugar',
  'Random Blood Sugar',
  'Glucose Tolerance Test',
];

const faqs = [
  {
    question: 'What is an FBS test?',
    answer:
      'Fasting Blood Sugar (FBS) test measures the level of glucose in the blood after an overnight fast. It is used to diagnose diabetes and prediabetes.',
  },
  {
    question: 'Why is the FBS test done?',
    answer:
      'The FBS test is done to screen for diabetes, monitor blood sugar control, and evaluate how well diabetes medications are working.',
  },
  {
    question: 'How should I prepare?',
    answer:
      'You should fast for at least 8-12 hours before the test. Only water is allowed during the fasting period. Avoid alcohol and strenuous exercise.',
  },
  {
    question: 'When is the best time?',
    answer:
      'The best time for an FBS test is early in the morning after an overnight fast. This ensures accurate and consistent results.',
  },
];

const packageCards = [
  {
    id: 'p1',
    name: 'Glucose Fasting and PP test',
    covers: 5,
    price: 20400,
    reportDays: 3,
  },
  {
    id: 'p2',
    name: 'Complete Blood Count',
    covers: 3,
    price: 15200,
    reportDays: 2,
  },
];

const LabTestDetailScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {test} = route.params || {};
  const [isAdded, setIsAdded] = useState(false);
  const [showAllTests, setShowAllTests] = useState(false);
  const [expandedFaq, setExpandedFaq] = useState(0);

  const toggleFaq = (index) => {
    setExpandedFaq(prev => (prev === index ? -1 : index));
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}>
          <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <AppText variant="header" color={Colors.white} style={{flex: 1, marginLeft: s(12)}}>
          Test Details
        </AppText>
        <TouchableOpacity style={styles.headerIconBtn}>
          <Icon family="Ionicons" name="share-social-outline" size={20} color={Colors.white} />
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.headerIconBtn, {marginLeft: s(8)}]}
          onPress={() => navigation.navigate('LabCart')}>
          <Icon family="Ionicons" name="cart-outline" size={20} color={Colors.white} />
          <View style={styles.cartBadge}>
            <AppText variant="small" color={Colors.white} style={{fontSize: ms(9), lineHeight: ms(12)}}>
              2
            </AppText>
          </View>
        </TouchableOpacity>
      </View>

      {/* Address Bar */}
      <TouchableOpacity style={styles.addressBar} activeOpacity={0.7}>
        <Icon family="Ionicons" name="location-outline" size={16} color={Colors.textSecondary} />
        <AppText variant="body" color={Colors.textSecondary} style={{flex: 1, marginLeft: s(6)}} numberOfLines={1}>
          Address: 9-5/5/9 Ameerpet, Hyderabad
        </AppText>
        <Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.textSecondary} />
      </TouchableOpacity>

      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{paddingBottom: vs(isAdded ? 100 : 30)}}
        showsVerticalScrollIndicator={false}>

        {/* Main Content Card */}
        <View style={styles.card}>
          <AppText variant="bodyBold" style={{fontSize: ms(18)}}>
            {test?.name || 'Glycosylated Haemoglobin (GHb/HbA1c)'}
          </AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(4)}}>
            Chosen by 500+ users recently
          </AppText>

          {/* Gender & Availability */}
          <View style={styles.genderRow}>
            <View style={styles.genderItem}>
              <Icon family="Ionicons" name="male-outline" size={18} color={Colors.primary} />
              <AppText variant="caption" style={{marginLeft: s(4)}}>Male</AppText>
            </View>
            <View style={styles.genderItem}>
              <Icon family="Ionicons" name="female-outline" size={18} color={Colors.primary} />
              <AppText variant="caption" style={{marginLeft: s(4)}}>Female</AppText>
            </View>
            <View style={styles.genderItem}>
              <Icon family="Ionicons" name="home-outline" size={18} color={Colors.primary} />
              <AppText variant="caption" style={{marginLeft: s(4)}}>Available</AppText>
            </View>
          </View>

          {/* Details List */}
          <View style={styles.detailsList}>
            <View style={styles.detailItem}>
              <Icon family="Ionicons" name="flask-outline" size={18} color={Colors.primary} />
              <AppText variant="body" style={{marginLeft: s(10)}}>05 Tests Covers</AppText>
            </View>
            <View style={styles.detailItem}>
              <Icon family="Ionicons" name="document-text-outline" size={18} color={Colors.primary} />
              <AppText variant="body" style={{marginLeft: s(10)}}>Reports in 3 Days by 9:00 PM</AppText>
            </View>
            <View style={styles.detailItem}>
              <Icon family="Ionicons" name="time-outline" size={18} color={Colors.primary} />
              <AppText variant="body" style={{marginLeft: s(10)}}>12 Hr Fasting Required</AppText>
            </View>
          </View>

          {/* Price Row */}
          <View style={styles.priceRow}>
            <View style={{flex: 1}}>
              <AppText variant="header" color={Colors.primary}>
                {'\u20B9'}{test?.net || 499}
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                Inclusive of all taxes
              </AppText>
            </View>
            {isAdded ? (
              <TouchableOpacity
                style={styles.removeButton}
                onPress={() => setIsAdded(false)}>
                <Icon family="Ionicons" name="close-outline" size={16} color={Colors.redText} />
                <AppText variant="bodyBold" color={Colors.redText} style={{marginLeft: s(4)}}>
                  Remove
                </AppText>
              </TouchableOpacity>
            ) : (
              <TouchableOpacity
                style={styles.addButton}
                onPress={() => setIsAdded(true)}>
                <AppText variant="bodyBold" color={Colors.white}>ADD</AppText>
              </TouchableOpacity>
            )}
          </View>
        </View>

        {/* About this Test */}
        <View style={styles.card}>
          <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>About this Test</AppText>
          <AppText variant="body" color={Colors.textSecondary}>
            No fasting needed. Drink water, wear loose sleeves, continue regular medicines. Sit relaxed, our team will collect the sample safely at your home.
          </AppText>
        </View>

        {/* Tests Included */}
        <View style={styles.card}>
          <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>Tests Included</AppText>
          {testsIncluded.slice(0, 3).map((name, index) => (
            <View key={index} style={styles.testIncludedItem}>
              <AppText variant="body">{name}</AppText>
            </View>
          ))}
          <TouchableOpacity onPress={() => setShowAllTests(true)} style={{marginTop: vs(8)}}>
            <AppText variant="bodyBold" color={Colors.primary}>View All (5)</AppText>
          </TouchableOpacity>
        </View>

        {/* Recommended By */}
        <View style={[styles.card, {backgroundColor: Colors.amberBg}]}>
          <View style={styles.recommendedBadge}>
            <AppText variant="small" color={Colors.white}>Recommended By</AppText>
          </View>
          <View style={styles.doctorRow}>
            <Icon family="Ionicons" name="person-circle" size={ms(44)} color={Colors.amber} />
            <View style={{marginLeft: s(12)}}>
              <AppText variant="bodyBold">Dr. Sharath</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>Specialist in Blood Studies</AppText>
            </View>
          </View>
        </View>

        {/* Tests Included in Packages */}
        <View style={{marginTop: vs(16), paddingHorizontal: s(16)}}>
          <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>Tests Included in Packages</AppText>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {packageCards.map(pkg => (
              <View key={pkg.id} style={styles.packageCard}>
                <View style={styles.packageLeft}>
                  <View style={styles.packageIcon}>
                    <Icon family="Ionicons" name="flask" size={22} color={Colors.tealText} />
                  </View>
                </View>
                <View style={styles.packageRight}>
                  <View style={styles.packageReportBadge}>
                    <AppText variant="small" color={Colors.tealText}>
                      Reports in {pkg.reportDays} days
                    </AppText>
                  </View>
                  <AppText variant="bodyBold" numberOfLines={2} style={{marginTop: vs(4)}}>
                    {pkg.name}
                  </AppText>
                  <AppText variant="caption" color={Colors.textSecondary}>
                    Covers {pkg.covers} Tests
                  </AppText>
                  <View style={styles.packagePriceRow}>
                    <AppText variant="bodyBold" color={Colors.primary}>
                      {'\u20B9'}{pkg.price.toLocaleString()}
                    </AppText>
                    <TouchableOpacity style={styles.addOutlineButton}>
                      <AppText variant="bodyBold" color={Colors.primary}>ADD</AppText>
                    </TouchableOpacity>
                  </View>
                </View>
              </View>
            ))}
          </ScrollView>
        </View>

        {/* FAQs */}
        <View style={[styles.card, {marginTop: vs(16)}]}>
          <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>FAQs</AppText>
          {faqs.map((faq, index) => (
            <View key={index} style={styles.faqItem}>
              <TouchableOpacity
                style={styles.faqHeader}
                onPress={() => toggleFaq(index)}
                activeOpacity={0.7}>
                <AppText variant="body" style={{flex: 1}}>{faq.question}</AppText>
                <Icon
                  family="Ionicons"
                  name={expandedFaq === index ? 'chevron-up' : 'chevron-down'}
                  size={18}
                  color={Colors.textSecondary}
                />
              </TouchableOpacity>
              {expandedFaq === index && (
                <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(6), paddingBottom: vs(4)}}>
                  {faq.answer}
                </AppText>
              )}
            </View>
          ))}
        </View>
      </ScrollView>

      {/* Bottom Sticky Cart Bar */}
      {isAdded && (
        <View style={styles.bottomBar}>
          <View>
            <AppText variant="bodyBold">{'\u20B9'}{test?.net || 499}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>Inclusive of all taxes</AppText>
          </View>
          <TouchableOpacity
            style={styles.goToCartButton}
            onPress={() => navigation.navigate('LabCart')}>
            <AppText variant="bodyBold" color={Colors.white}>Go to Cart</AppText>
          </TouchableOpacity>
        </View>
      )}

      {/* View All Tests Modal */}
      <Modal
        visible={showAllTests}
        transparent
        animationType="slide"
        onRequestClose={() => setShowAllTests(false)}>
        <View style={styles.modalOverlay}>
          <View style={styles.modalSheet}>
            <View style={styles.modalHandle} />
            <View style={styles.modalHeader}>
              <AppText variant="bodyBold" style={{fontSize: ms(16)}}>Tests Included</AppText>
              <TouchableOpacity onPress={() => setShowAllTests(false)}>
                <Icon family="Ionicons" name="close" size={22} color={Colors.textPrimary} />
              </TouchableOpacity>
            </View>
            {testsIncluded.map((name, index) => (
              <View key={index} style={styles.modalTestItem}>
                <View style={styles.modalTestDot} />
                <AppText variant="body" style={{marginLeft: s(10)}}>{name}</AppText>
              </View>
            ))}
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingTop: vs(16),
    paddingHorizontal: s(16),
    paddingBottom: vs(14),
  },
  backButton: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  headerIconBtn: {
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
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f0f0f0',
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
  },
  scrollView: {
    flex: 1,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(15),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(16),
    marginHorizontal: s(16),
    marginTop: vs(12),
  },
  genderRow: {
    flexDirection: 'row',
    marginTop: vs(12),
  },
  genderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: s(20),
  },
  detailsList: {
    marginTop: vs(12),
  },
  detailItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
    marginBottom: vs(6),
  },
  priceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(14),
    paddingTop: vs(14),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  addButton: {
    backgroundColor: Colors.primary,
    borderRadius: ms(20),
    paddingHorizontal: s(28),
    paddingVertical: vs(10),
    alignItems: 'center',
  },
  removeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.redBg,
    borderRadius: ms(20),
    paddingHorizontal: s(20),
    paddingVertical: vs(10),
  },
  testIncludedItem: {
    backgroundColor: Colors.background,
    borderRadius: ms(10),
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    marginBottom: vs(6),
  },
  recommendedBadge: {
    backgroundColor: Colors.amber,
    borderRadius: ms(12),
    paddingHorizontal: s(12),
    paddingVertical: vs(4),
    alignSelf: 'flex-start',
    marginBottom: vs(10),
  },
  doctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  packageCard: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(12),
    marginRight: s(12),
    width: ms(260),
  },
  packageLeft: {
    justifyContent: 'center',
    marginRight: s(12),
  },
  packageIcon: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  packageRight: {
    flex: 1,
  },
  packageReportBadge: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    alignSelf: 'flex-start',
  },
  packagePriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(6),
  },
  addOutlineButton: {
    borderWidth: 1,
    borderColor: Colors.primary,
    borderRadius: ms(6),
    paddingHorizontal: s(16),
    paddingVertical: vs(4),
  },
  faqItem: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
    paddingVertical: vs(10),
  },
  faqHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
    paddingHorizontal: s(16),
    paddingVertical: vs(14),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  goToCartButton: {
    backgroundColor: Colors.primary,
    borderRadius: ms(10),
    paddingHorizontal: s(28),
    paddingVertical: vs(12),
    alignItems: 'center',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalSheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    padding: ms(20),
    paddingBottom: vs(30),
  },
  modalHandle: {
    width: ms(40),
    height: vs(4),
    backgroundColor: Colors.borderLight,
    borderRadius: ms(2),
    alignSelf: 'center',
    marginBottom: vs(12),
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(16),
  },
  modalTestItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  modalTestDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: Colors.primary,
  },
});

export default LabTestDetailScreen;
