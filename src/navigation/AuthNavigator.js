import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import OnboardingScreen from '../screens/Auth/OnboardingScreen';
import SplashScreen from '../screens/Auth/SplashScreen';
import WelcomeScreen from '../screens/Auth/WelcomeScreen';
import PhoneScreen from '../screens/Auth/PhoneScreen';
import OTPScreen from '../screens/Auth/OTPScreen';
import PersonalScreen from '../screens/Auth/PersonalScreen';
import HealthProfileScreen from '../screens/Auth/HealthProfileScreen';
import MedicationsScreen from '../screens/Auth/MedicationsScreen';
import PlanScreen from '../screens/Auth/PlanScreen';
import PaymentScreen from '../screens/Auth/PaymentScreen';
import PaymentMethodScreen from '../screens/Auth/PaymentMethodScreen';
import PaymentProcessingScreen from '../screens/Auth/PaymentProcessingScreen';
import AgreementScreen from '../screens/Auth/AgreementScreen';
import DoneScreen from '../screens/Auth/DoneScreen';
import LoginHubScreen from '../screens/Auth/LoginHubScreen';
import LoginBioScreen from '../screens/Auth/LoginBioScreen';
import LoginPinScreen from '../screens/Auth/LoginPinScreen';
import LoginPasswordScreen from '../screens/Auth/LoginPasswordScreen';
import LoginSuccessScreen from '../screens/Auth/LoginSuccessScreen';
import ForgotStep0Screen from '../screens/Auth/ForgotStep0Screen';
import ForgotStep1Screen from '../screens/Auth/ForgotStep1Screen';
import ForgotStep2Screen from '../screens/Auth/ForgotStep2Screen';
import ForgotNewPasswordScreen from '../screens/Auth/ForgotNewPasswordScreen';
import ForgotNewPinScreen from '../screens/Auth/ForgotNewPinScreen';
import ForgotDoneScreen from '../screens/Auth/ForgotDoneScreen';

/* Reuse existing Profile screens for viewing Terms/Consent/Privacy */
import TermsOfServiceScreen from '../screens/Profile/TermsOfServiceScreen';
import ConsentAgreementScreen from '../screens/Profile/ConsentAgreementScreen';
import PrivacyPolicyScreen from '../screens/Profile/PrivacyPolicyScreen';

const Stack = createNativeStackNavigator();

const AuthNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      {/* Onboarding & Splash */}
      <Stack.Screen name="Onboarding" component={OnboardingScreen} options={{animation: 'fade'}} />
      <Stack.Screen name="Splash" component={SplashScreen} options={{animation: 'fade'}} />
      <Stack.Screen name="Welcome" component={WelcomeScreen} options={{animation: 'slide_from_right'}} />

      {/* Sign Up Flow */}
      <Stack.Screen name="Phone" component={PhoneScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="OTP" component={OTPScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="Personal" component={PersonalScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="Health" component={HealthProfileScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="Medications" component={MedicationsScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="Plan" component={PlanScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="Payment" component={PaymentScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="PaymentMethod" component={PaymentMethodScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="PaymentProcessing" component={PaymentProcessingScreen} options={{animation: 'fade'}} />
      <Stack.Screen name="Agreement" component={AgreementScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="Done" component={DoneScreen} options={{animation: 'fade'}} />

      {/* Reused Profile screens (view-only, goBack returns to auth) */}
      <Stack.Screen name="Terms" component={TermsOfServiceScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="Consent" component={ConsentAgreementScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="PrivacyPolicy" component={PrivacyPolicyScreen} options={{animation: 'slide_from_right'}} />

      {/* Login Flow */}
      <Stack.Screen name="LoginHub" component={LoginHubScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="LoginBio" component={LoginBioScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="LoginPin" component={LoginPinScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="LoginPassword" component={LoginPasswordScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="LoginSuccess" component={LoginSuccessScreen} options={{animation: 'fade'}} />

      {/* Forgot Password / PIN Flow */}
      <Stack.Screen name="ForgotStep0" component={ForgotStep0Screen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="ForgotStep1" component={ForgotStep1Screen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="ForgotStep2" component={ForgotStep2Screen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="ForgotNewPassword" component={ForgotNewPasswordScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="ForgotNewPin" component={ForgotNewPinScreen} options={{animation: 'slide_from_right'}} />
      <Stack.Screen name="ForgotDone" component={ForgotDoneScreen} options={{animation: 'fade'}} />
    </Stack.Navigator>
  );
};

export default AuthNavigator;
