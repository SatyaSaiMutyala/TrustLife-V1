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

const InsurancePaymentSuccessScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const premium = route.params?.premium || 500;

  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.goBack();
    }, 1500);
    return () => clearTimeout(timer);
  }, [navigation]);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#E1F5EE" />

      <View style={styles.centerContent}>
        <View style={styles.checkCircle}>
          <Icon family="Ionicons" name="checkmark" size={48} color={Colors.white} />
        </View>

        <AppText variant="header" color={Colors.primary} style={{marginTop: vs(24), textAlign: 'center'}}>
          Rs. {premium}/mo
        </AppText>

        <AppText variant="screenName" color={Colors.primary} style={{marginTop: vs(10), textAlign: 'center'}}>
          Payment Successfully
        </AppText>

        <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(8), textAlign: 'center'}}>
          Your insurance policy has been activated
        </AppText>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#E1F5EE',
  },
  centerContent: {
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

export default InsurancePaymentSuccessScreen;
