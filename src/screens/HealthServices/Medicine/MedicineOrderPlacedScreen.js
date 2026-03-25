import React from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const orderItems = [
  {
    id: '1',
    name: 'Paracetamol',
    subtitle: '500mg Tablets',
    qty: 1,
    price: 384,
    mrp: 480,
    discount: 20,
    image: require('../../../assets/img/medicans.png'),
  },
  {
    id: '2',
    name: 'Ibuprofen',
    subtitle: '500mg Tablets',
    qty: 1,
    price: 384,
    mrp: 480,
    discount: 20,
    image: require('../../../assets/img/medicans.png'),
  },
];

const MedicineOrderPlacedScreen = () => {
  const navigation = useNavigation();

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <ScrollView
        contentContainerStyle={{paddingBottom: vs(40)}}
        showsVerticalScrollIndicator={false}>

        {/* Top Section */}
        <View style={styles.topSection}>
          <View style={styles.checkCircle}>
            <Icon family="Ionicons" name="checkmark" size={36} color={Colors.white} />
          </View>
          <AppText variant="screenName" style={{marginTop: vs(16)}}>Order Placed</AppText>
          <AppText variant="body" color={Colors.textSecondary} style={{marginTop: vs(6)}}>
            24 Mar 2026, 10:30 AM
          </AppText>
          <AppText
            variant="body"
            color={Colors.textSecondary}
            style={{marginTop: vs(8), textAlign: 'center', paddingHorizontal: s(24)}}>
            Your order has been placed successfully and is being processed.
          </AppText>
          <AppText variant="bodyBold" color={Colors.primary} style={{marginTop: vs(10)}}>
            Waiting for confirmation...
          </AppText>
        </View>

        <View style={styles.contentArea}>
          {/* Items Details */}
          <View style={styles.card}>
            <AppText variant="bodyBold" style={{marginBottom: vs(12)}}>Items Details</AppText>
            {orderItems.map(item => (
              <View key={item.id} style={styles.orderItem}>
                <View style={styles.itemDiscountBadge}>
                  <AppText variant="small" color={Colors.white}>{item.discount}% OFF</AppText>
                </View>
                <Image source={item.image} style={styles.itemImage} resizeMode="contain" />
                <View style={styles.itemInfo}>
                  <AppText variant="bodyBold">{item.qty} x {item.name}</AppText>
                  <AppText variant="caption" color={Colors.textSecondary}>{item.subtitle}</AppText>
                  <View style={styles.itemPriceRow}>
                    <AppText variant="bodyBold">{'\u20B9'}{item.price}</AppText>
                    <AppText
                      variant="caption"
                      color={Colors.textSecondary}
                      style={{textDecorationLine: 'line-through', marginLeft: s(6)}}>
                      {'\u20B9'}{item.mrp}
                    </AppText>
                  </View>
                </View>
              </View>
            ))}
            <TouchableOpacity style={styles.viewMoreRow}>
              <AppText variant="bodyBold" color={Colors.primary}>View more Details</AppText>
            </TouchableOpacity>
          </View>

          {/* Receiver Details */}
          <View style={styles.card}>
            <AppText variant="bodyBold" style={{marginBottom: vs(12)}}>Receiver Details</AppText>
            <View style={styles.receiverRow}>
              <Icon family="Ionicons" name="person-outline" size={18} color={Colors.primary} />
              <View style={{marginLeft: s(10)}}>
                <AppText variant="body">Rahul Sharma</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>+91 98765 43210</AppText>
              </View>
            </View>
            <View style={[styles.receiverRow, {marginTop: vs(10)}]}>
              <Icon family="Ionicons" name="location-outline" size={18} color={Colors.primary} />
              <View style={{marginLeft: s(10), flex: 1}}>
                <AppText variant="body">123 Main Street, Koramangala</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>Bangalore, Karnataka 560034</AppText>
              </View>
            </View>
          </View>

          {/* Order Summary */}
          <View style={styles.card}>
            <AppText variant="bodyBold" style={{marginBottom: vs(12)}}>Order Summary</AppText>
            <View style={styles.summaryRow}>
              <AppText variant="body" color={Colors.textSecondary}>Order ID</AppText>
              <AppText variant="bodyBold">ORD20260324001</AppText>
            </View>
            <View style={styles.summaryRow}>
              <AppText variant="body" color={Colors.textSecondary}>Payment Status</AppText>
              <View style={styles.paidBadge}>
                <Icon family="Ionicons" name="checkmark-circle" size={16} color={Colors.primary} />
                <AppText variant="bodyBold" color={Colors.primary} style={{marginLeft: s(4)}}>
                  Paid
                </AppText>
              </View>
            </View>
            <View style={styles.summaryRow}>
              <AppText variant="body" color={Colors.textSecondary}>Amount Paid</AppText>
              <AppText variant="bodyBold">{'\u20B9'}620</AppText>
            </View>
          </View>

          {/* Support */}
          <TouchableOpacity style={styles.supportRow}>
            <AppText variant="body" color={Colors.textSecondary} style={{textAlign: 'center'}}>
              Facing an Issue? Get Support
            </AppText>
          </TouchableOpacity>
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
  topSection: {
    alignItems: 'center',
    paddingTop: vs(40),
    paddingBottom: vs(24),
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
  contentArea: {
    paddingHorizontal: s(16),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(16),
    marginBottom: vs(12),
  },
  orderItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  itemDiscountBadge: {
    position: 'absolute',
    top: vs(10),
    left: 0,
    backgroundColor: Colors.primary,
    borderRadius: ms(4),
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    zIndex: 1,
  },
  itemImage: {
    width: ms(55),
    height: ms(55),
    marginRight: s(12),
    marginTop: vs(10),
  },
  itemInfo: {
    flex: 1,
  },
  itemPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(4),
  },
  viewMoreRow: {
    alignItems: 'center',
    paddingTop: vs(12),
  },
  receiverRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  summaryRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  paidBadge: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  supportRow: {
    alignItems: 'center',
    paddingVertical: vs(16),
  },
});

export default MedicineOrderPlacedScreen;
