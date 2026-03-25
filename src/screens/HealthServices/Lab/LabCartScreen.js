import React, {useState} from 'react';
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

const initialCartItems = [
  {
    id: '1',
    name: 'Glycosylated Haemoglobin (GHb/HbA1c)',
    price: 350,
    mrp: 480,
    discount: 20,
    reportDays: 3,
    qty: 1,
  },
  {
    id: '2',
    name: 'Complete Blood Count (CBC)',
    price: 350,
    mrp: 480,
    discount: 20,
    reportDays: 3,
    qty: 1,
  },
];

const LabCartScreen = () => {
  const navigation = useNavigation();
  const [cartItems, setCartItems] = useState(initialCartItems);

  const updateQty = (id, delta) => {
    setCartItems(prev =>
      prev.map(item =>
        item.id === id
          ? {...item, qty: Math.max(1, item.qty + delta)}
          : item,
      ),
    );
  };

  const itemTotal = cartItems.reduce((sum, item) => sum + item.price * item.qty, 0);
  const promoDiscount = 200;
  const gst = 10;
  const grandTotal = itemTotal - promoDiscount + gst;

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
        <AppText variant="header" color={Colors.white} style={{flex: 1, marginLeft: s(12)}}>Lab Cart</AppText>
        <TouchableOpacity>
          <Icon family="Ionicons" name="share-social-outline" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{paddingBottom: vs(100)}}
        showsVerticalScrollIndicator={false}>

        {/* Address Bar */}
        <View style={styles.addressBar}>
          <Icon family="Ionicons" name="location-outline" size={18} color={Colors.primary} />
          <AppText variant="body" style={{flex: 1, marginLeft: s(8)}} numberOfLines={1}>
            Deliver to: 123 Main Street, Bangalore
          </AppText>
          <TouchableOpacity>
            <AppText variant="bodyBold" color={Colors.primary}>Change</AppText>
          </TouchableOpacity>
        </View>

        {/* Store Card */}
        <View style={styles.storeCard}>
          <View style={styles.storeHeader}>
            <View style={styles.storeBadge}>
              <AppText variant="small" color={Colors.white}>TrustLab Diagnostics</AppText>
            </View>
            <TouchableOpacity>
              <AppText variant="bodyBold" color={Colors.primary}>Add Tests</AppText>
            </TouchableOpacity>
          </View>

          {/* Cart Items */}
          {cartItems.map(item => (
            <View key={item.id} style={styles.cartItem}>
              <View style={styles.cartItemInfo}>
                <AppText variant="bodyBold" numberOfLines={2}>{item.name}</AppText>
                <View style={styles.cartPriceRow}>
                  <AppText variant="bodyBold">{'\u20B9'}{item.price}</AppText>
                  <AppText
                    variant="caption"
                    color={Colors.textSecondary}
                    style={{textDecorationLine: 'line-through', marginLeft: s(6)}}>
                    {'\u20B9'}{item.mrp}
                  </AppText>
                </View>
                <View style={styles.reportBadge}>
                  <Icon family="Ionicons" name="time-outline" size={12} color={Colors.primary} />
                  <AppText variant="small" color={Colors.primary} style={{marginLeft: s(4)}}>
                    Report in {item.reportDays} Days
                  </AppText>
                </View>
              </View>

              {/* Qty Controls */}
              <View style={styles.qtyContainer}>
                <TouchableOpacity
                  onPress={() => updateQty(item.id, -1)}
                  style={styles.qtyBtn}>
                  <AppText variant="bodyBold" color={Colors.white}>-</AppText>
                </TouchableOpacity>
                <AppText variant="bodyBold" color={Colors.white} style={styles.qtyText}>
                  {item.qty}
                </AppText>
                <TouchableOpacity
                  onPress={() => updateQty(item.id, 1)}
                  style={styles.qtyBtn}>
                  <AppText variant="bodyBold" color={Colors.white}>+</AppText>
                </TouchableOpacity>
              </View>
            </View>
          ))}
        </View>

        {/* Apply Coupons */}
        <View style={styles.couponRow}>
          <Icon family="Ionicons" name="ticket-outline" size={20} color={Colors.primary} />
          <AppText variant="body" style={{flex: 1, marginLeft: s(10)}}>Apply coupons</AppText>
          <TouchableOpacity>
            <AppText variant="bodyBold" color={Colors.primary}>Apply</AppText>
          </TouchableOpacity>
        </View>

        {/* Receiver Details */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <AppText variant="bodyBold">Receiver Details</AppText>
            <TouchableOpacity>
              <Icon family="Ionicons" name="create-outline" size={18} color={Colors.primary} />
            </TouchableOpacity>
          </View>
          <View style={styles.receiverRow}>
            <Icon family="Ionicons" name="person-outline" size={16} color={Colors.textSecondary} />
            <AppText variant="body" color={Colors.textSecondary} style={{marginLeft: s(8)}}>
              Rahul Sharma
            </AppText>
          </View>
          <View style={styles.receiverRow}>
            <Icon family="Ionicons" name="call-outline" size={16} color={Colors.textSecondary} />
            <AppText variant="body" color={Colors.textSecondary} style={{marginLeft: s(8)}}>
              +91 98765 43210
            </AppText>
          </View>
        </View>

        {/* Bill Details */}
        <View style={styles.card}>
          <AppText variant="bodyBold" style={{marginBottom: vs(12)}}>Bill Details</AppText>
          <View style={styles.billRow}>
            <AppText variant="body" color={Colors.textSecondary}>Item total</AppText>
            <AppText variant="body">{'\u20B9'}{itemTotal}</AppText>
          </View>
          <View style={styles.billRow}>
            <AppText variant="body" color={Colors.textSecondary}>Promo discount</AppText>
            <AppText variant="body" color={Colors.primary}>-{'\u20B9'}{promoDiscount}</AppText>
          </View>
          <View style={styles.billRow}>
            <AppText variant="body" color={Colors.textSecondary}>GST</AppText>
            <AppText variant="body">{'\u20B9'}{gst}</AppText>
          </View>
          <View style={styles.dashedDivider} />
          <View style={styles.billRow}>
            <AppText variant="bodyBold">Grand Total</AppText>
            <AppText variant="bodyBold">{'\u20B9'}{grandTotal}</AppText>
          </View>
        </View>

        {/* Cancellation Policy */}
        <TouchableOpacity style={styles.policyRow}>
          <Icon family="Ionicons" name="information-circle-outline" size={18} color={Colors.textSecondary} />
          <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(6)}}>
            Cancellation Policy
          </AppText>
          <Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.textSecondary} />
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom Sticky */}
      <View style={styles.bottomBar}>
        <View>
          <AppText variant="bodyBold">{'\u20B9'}{grandTotal}</AppText>
          <AppText variant="caption" color={Colors.textSecondary}>Total Amount</AppText>
        </View>
        <TouchableOpacity
          style={styles.proceedButton}
          onPress={() => navigation.navigate('LabPaymentSuccess')}>
          <AppText variant="bodyBold" color={Colors.white}>Proceed to Book</AppText>
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
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingTop: vs(16),
    paddingHorizontal: s(16),
    paddingBottom: vs(12),
  },
  backButton: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: s(16),
  },
  addressBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(12),
    marginTop: vs(16),
  },
  storeCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(14),
    marginTop: vs(12),
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  storeBadge: {
    backgroundColor: Colors.primary,
    borderRadius: ms(6),
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  cartItemInfo: {
    flex: 1,
  },
  cartPriceRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(4),
  },
  reportBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tealBg,
    borderRadius: ms(6),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    marginTop: vs(6),
    alignSelf: 'flex-start',
  },
  qtyContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ms(6),
    overflow: 'hidden',
  },
  qtyBtn: {
    paddingHorizontal: s(8),
    paddingVertical: vs(6),
  },
  qtyText: {
    paddingHorizontal: s(6),
  },
  couponRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(14),
    marginTop: vs(12),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: ms(16),
    marginTop: vs(12),
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(10),
  },
  receiverRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(6),
  },
  billRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  dashedDivider: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
    borderStyle: 'dashed',
    marginVertical: vs(8),
  },
  policyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(16),
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
  proceedButton: {
    backgroundColor: Colors.primary,
    borderRadius: ms(10),
    paddingHorizontal: s(32),
    paddingVertical: vs(12),
    alignItems: 'center',
  },
});

export default LabCartScreen;
