import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const testItems = [
  {
    id: '1',
    name: 'Glycosylated Haemoglobin (GHb/HbA1c)',
    reportDays: 3,
    price: 350,
  },
  {
    id: '2',
    name: 'Complete Blood Count (CBC)',
    reportDays: 3,
    price: 350,
  },
];

const LabOrderPlacedScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <ScrollView
        contentContainerStyle={{paddingBottom: vs(100)}}
        showsVerticalScrollIndicator={false}>

        {/* Success Section */}
        <View style={styles.successSection}>
          <View style={styles.checkCircle}>
            <Icon family="Ionicons" name="checkmark" size={ms(36)} color={Colors.white} />
          </View>
          <AppText variant="header" style={{marginTop: vs(16)}}>Booking Confirmed</AppText>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(6)}}>
            11:30, Mon, 17 Feb, 2026
          </AppText>
          <AppText
            variant="body"
            color={Colors.textSecondary}
            style={{textAlign: 'center', marginTop: vs(8), paddingHorizontal: s(20)}}>
            Your lab test has been booked. Our team will visit for sample collection.
          </AppText>
          <AppText variant="caption" color={Colors.primary} style={{marginTop: vs(8)}}>
            Awaiting collection...
          </AppText>
        </View>

        {/* Test Details Card */}
        <View style={styles.card}>
          <View style={styles.cardHeaderRow}>
            <AppText variant="bodyBold">Test Details</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>2 Tests</AppText>
          </View>
          {testItems.map(item => (
            <View key={item.id} style={styles.testItem}>
              <View style={styles.testIconCircle}>
                <Icon family="Ionicons" name="flask" size={18} color={Colors.tealText} />
              </View>
              <View style={{flex: 1, marginLeft: s(10)}}>
                <AppText variant="body" numberOfLines={2}>{item.name}</AppText>
                <View style={styles.reportBadge}>
                  <AppText variant="small" color={Colors.tealText}>
                    Reports in {item.reportDays} Days
                  </AppText>
                </View>
              </View>
              <AppText variant="bodyBold">{'\u20B9'}{item.price}</AppText>
            </View>
          ))}
          <TouchableOpacity style={{marginTop: vs(8)}}>
            <AppText variant="bodyBold" color={Colors.primary}>View more Details</AppText>
          </TouchableOpacity>
        </View>

        {/* Collection Details Card */}
        <View style={styles.card}>
          <AppText variant="bodyBold" style={{marginBottom: vs(12)}}>Collection Details</AppText>
          <View style={styles.collectionRow}>
            <Icon family="Ionicons" name="person-outline" size={18} color={Colors.textSecondary} />
            <View style={{marginLeft: s(10)}}>
              <AppText variant="body">Raju</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>+91858456749</AppText>
            </View>
          </View>
          <View style={styles.collectionRow}>
            <Icon family="Ionicons" name="location-outline" size={18} color={Colors.textSecondary} />
            <AppText variant="body" style={{flex: 1, marginLeft: s(10)}}>
              #flatno.101, Shiva Appartments, Main Rd, Banjara Hills, Hyderabad
            </AppText>
          </View>
          <View style={styles.collectionRow}>
            <Icon family="Ionicons" name="time-outline" size={18} color={Colors.textSecondary} />
            <AppText variant="body" style={{marginLeft: s(10)}}>
              Collection slot: 7:00 AM - 9:00 AM
            </AppText>
          </View>
        </View>

        {/* Order Summary Card */}
        <View style={styles.card}>
          <AppText variant="bodyBold" style={{marginBottom: vs(12)}}>Order Summary</AppText>
          <View style={styles.summaryRow}>
            <AppText variant="body" color={Colors.textSecondary}>Order ID</AppText>
            <AppText variant="bodyBold">LAB7453473454</AppText>
          </View>
          <View style={styles.summaryRow}>
            <AppText variant="body" color={Colors.textSecondary}>Payment Status</AppText>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <Icon family="Ionicons" name="checkmark-circle" size={16} color={Colors.primary} />
              <AppText variant="bodyBold" color={Colors.primary} style={{marginLeft: s(4)}}>Paid</AppText>
            </View>
          </View>
          <View style={styles.summaryRow}>
            <AppText variant="body" color={Colors.textSecondary}>Amount Paid</AppText>
            <AppText variant="bodyBold">{'\u20B9'}700</AppText>
          </View>
        </View>

        {/* Support Text */}
        <AppText
          variant="caption"
          color={Colors.textSecondary}
          style={{textAlign: 'center', marginTop: vs(20)}}>
          Facing an Issue? Get Support
        </AppText>
      </ScrollView>

      {/* Bottom Button */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={styles.homeButton}
          onPress={() => navigation.reset({index: 0, routes: [{name: 'MainTabs'}]})}>
          <AppText variant="bodyBold" color={Colors.white}>Back to Home</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  successSection: {
    alignItems: 'center',
    paddingTop: vs(40),
    paddingBottom: vs(20),
    paddingHorizontal: s(16),
  },
  checkCircle: {
    width: ms(70),
    height: ms(70),
    borderRadius: ms(35),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(16),
    marginHorizontal: s(16),
    marginTop: vs(12),
  },
  cardHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  testItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  testIconCircle: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  reportBadge: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    alignSelf: 'flex-start',
    marginTop: vs(4),
  },
  collectionRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(12),
  },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(10),
  },
  bottomBar: {
    paddingHorizontal: s(16),
    paddingVertical: vs(14),
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  homeButton: {
    backgroundColor: Colors.primary,
    borderRadius: ms(10),
    paddingVertical: vs(14),
    alignItems: 'center',
  },
});

export default LabOrderPlacedScreen;
