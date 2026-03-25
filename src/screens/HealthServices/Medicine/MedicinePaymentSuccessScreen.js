import React, {useEffect} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const MedicinePaymentSuccessScreen = () => {
  const navigation = useNavigation();

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('MedicineOrderPlaced');
    }, 2500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={styles.center}>
        <View style={styles.outerCircle}>
          <View style={styles.checkCircle}>
            <Icon family="Ionicons" name="checkmark" size={48} color={Colors.white} />
          </View>
        </View>

        <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(24)}}>
          {'\u20B9'}620
        </AppText>

        <AppText variant="header" color={Colors.white} style={{marginTop: vs(12)}}>
          Payment Successfully
        </AppText>

        <AppText variant="body" color="rgba(255,255,255,0.7)" style={{marginTop: vs(8), textAlign: 'center'}}>
          Your payment has been processed successfully
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
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: s(32),
  },
  outerCircle: {
    width: ms(120),
    height: ms(120),
    borderRadius: ms(60),
    borderWidth: 3,
    borderColor: 'rgba(255,255,255,0.5)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkCircle: {
    width: ms(90),
    height: ms(90),
    borderRadius: ms(45),
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default MedicinePaymentSuccessScreen;
