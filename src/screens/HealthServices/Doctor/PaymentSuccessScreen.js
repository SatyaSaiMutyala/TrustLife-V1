import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const PaymentSuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const {appointment} = route.params || {};

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('AppointmentConfirmed', {appointment});
    }, 2000);
    return () => clearTimeout(timer);
  }, [navigation, appointment]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor={Colors.tealBg} />

      <View style={styles.center}>
        <View style={styles.checkCircle}>
          <Icon family="Ionicons" name="checkmark" size={48} color={Colors.white} />
        </View>

        <AppText variant="screenName" style={{marginTop: vs(24)}}>
          Rs. 620
        </AppText>

        <AppText variant="header" color={Colors.textPrimary} style={{marginTop: vs(12)}}>
          Payment Successfully
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.tealBg,
  },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(32),
  },
  checkCircle: {
    width: ms(90),
    height: ms(90),
    borderRadius: ms(45),
    backgroundColor: Colors.primary,
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default PaymentSuccessScreen;
