import React, {useEffect} from 'react';
import {View, StyleSheet, StatusBar} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const LabPaymentSuccessScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('LabOrderPlaced');
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.content}>
        {/* Checkmark Circle */}
        <View style={styles.circle}>
          <Icon family="Ionicons" name="checkmark" size={ms(48)} color={Colors.white} />
        </View>

        {/* Amount */}
        <AppText variant="header" color={Colors.white} style={styles.amount}>
          {'\u20B9'}700
        </AppText>

        {/* Status */}
        <AppText variant="bodyBold" color={Colors.white} style={styles.status}>
          Payment Successfully
        </AppText>

        {/* Message */}
        <AppText variant="caption" color={Colors.white} style={styles.message}>
          Your booking has been confirmed. You will receive details shortly.
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(40),
  },
  circle: {
    width: ms(100),
    height: ms(100),
    borderRadius: ms(50),
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  amount: {
    fontSize: ms(32),
    marginTop: vs(20),
  },
  status: {
    fontSize: ms(18),
    marginTop: vs(10),
  },
  message: {
    textAlign: 'center',
    marginTop: vs(10),
    opacity: 0.8,
  },
});

export default LabPaymentSuccessScreen;
