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

const InsuranceDocumentVerificationScreen = () => {
  const navigation = useNavigation();
  const [identityUploaded, setIdentityUploaded] = useState(false);
  const [addressUploaded, setAddressUploaded] = useState(false);

  const allUploaded = identityUploaded && addressUploaded;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          activeOpacity={0.7}
          onPress={() => navigation.goBack()}>
          <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={{flex: 1, marginLeft: s(12)}}>
          <AppText variant="screenName" color={Colors.white}>Document Verification</AppText>
        </View>
      </View>

      <ScrollView
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}>

        {/* Info Text */}
        <View style={styles.infoCard}>
          <Icon family="Ionicons" name="information-circle-outline" size={20} color={Colors.primary} />
          <AppText variant="caption" color={Colors.textSecondary} style={{flex: 1, marginLeft: s(8)}}>
            Please upload the required documents. Supported formats: PNG, JPG. Maximum file size: 5MB.
          </AppText>
        </View>

        {/* Identity Proof Card */}
        <TouchableOpacity
          style={[
            styles.uploadCard,
            identityUploaded && styles.uploadCardDone,
          ]}
          activeOpacity={0.7}
          onPress={() => setIdentityUploaded(!identityUploaded)}>
          <View style={[styles.uploadIconWrap, identityUploaded && styles.uploadIconWrapDone]}>
            <Icon
              family="Ionicons"
              name={identityUploaded ? 'checkmark-circle' : 'cloud-upload-outline'}
              size={32}
              color={identityUploaded ? Colors.tealText : Colors.textTertiary}
            />
          </View>
          <AppText variant="bodyBold" style={{marginTop: vs(10)}}>
            Identity Proof
          </AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
            Aadhar Card / PAN Card
          </AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(4)}}>
            PNG, JPG (Max 5MB)
          </AppText>
          {identityUploaded && (
            <View style={styles.uploadedBadge}>
              <Icon family="Ionicons" name="checkmark" size={14} color={Colors.tealText} />
              <AppText variant="small" color={Colors.tealText} style={{fontWeight: '600', marginLeft: s(4)}}>Uploaded</AppText>
            </View>
          )}
        </TouchableOpacity>

        {/* Address Proof Card */}
        <TouchableOpacity
          style={[
            styles.uploadCard,
            addressUploaded && styles.uploadCardDone,
          ]}
          activeOpacity={0.7}
          onPress={() => setAddressUploaded(!addressUploaded)}>
          <View style={[styles.uploadIconWrap, addressUploaded && styles.uploadIconWrapDone]}>
            <Icon
              family="Ionicons"
              name={addressUploaded ? 'checkmark-circle' : 'cloud-upload-outline'}
              size={32}
              color={addressUploaded ? Colors.tealText : Colors.textTertiary}
            />
          </View>
          <AppText variant="bodyBold" style={{marginTop: vs(10)}}>
            Address Proof
          </AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
            Utility Bill / Passport / Voter ID
          </AppText>
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(4)}}>
            PNG, JPG (Max 5MB)
          </AppText>
          {addressUploaded && (
            <View style={styles.uploadedBadge}>
              <Icon family="Ionicons" name="checkmark" size={14} color={Colors.tealText} />
              <AppText variant="small" color={Colors.tealText} style={{fontWeight: '600', marginLeft: s(4)}}>Uploaded</AppText>
            </View>
          )}
        </TouchableOpacity>

        <View style={{height: vs(100)}} />
      </ScrollView>

      {/* Bottom Sticky */}
      <View style={styles.bottomBar}>
        <TouchableOpacity
          style={[styles.reviewBtn, !allUploaded && styles.reviewBtnDisabled]}
          activeOpacity={0.8}
          disabled={!allUploaded}
          onPress={() => navigation.navigate('InsurancePaymentSuccess')}>
          <AppText variant="bodyBold" color={Colors.white}>Review & Pay</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingTop: vs(14),
    paddingBottom: vs(14),
  },
  backBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    paddingHorizontal: s(16),
    paddingTop: vs(16),
  },
  infoCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.tealBg,
    borderRadius: ms(12),
    padding: ms(14),
    marginBottom: vs(20),
  },
  uploadCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 1.5,
    borderColor: Colors.borderLight,
    borderStyle: 'dashed',
    padding: ms(20),
    alignItems: 'center',
    marginBottom: vs(14),
  },
  uploadCardDone: {
    borderColor: Colors.teal,
    backgroundColor: Colors.tealBg,
  },
  uploadIconWrap: {
    width: ms(60),
    height: ms(60),
    borderRadius: ms(30),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  uploadIconWrapDone: {
    backgroundColor: Colors.white,
  },
  uploadedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10),
    backgroundColor: Colors.white,
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: s(16),
    paddingVertical: vs(12),
    paddingBottom: vs(24),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  reviewBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  reviewBtnDisabled: {
    opacity: 0.5,
  },
});

export default InsuranceDocumentVerificationScreen;
