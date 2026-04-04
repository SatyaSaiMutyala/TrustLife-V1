import React from 'react';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import BottomTabNavigator from './BottomTabNavigator';
import ViewAllScreen from '../screens/Home/ViewAllScreen';
import ProfileScreen from '../screens/Home/ProfileScreen';
import EditProfileScreen from '../screens/Profile/EditProfileScreen';
import GoalsScreen from '../screens/Profile/GoalsScreen';
import PersonalInfoScreen from '../screens/Profile/PersonalInfoScreen';
import ContactScreen from '../screens/Profile/ContactScreen';
import PreferencesScreen from '../screens/Profile/PreferencesScreen';
import HealthScreen from '../screens/Profile/HealthScreen';
import FamilyMembersScreen from '../screens/Profile/FamilyMembersScreen';
import ConnectedDevicesScreen from '../screens/Profile/ConnectedDevicesScreen';
import ConsentManagerScreen from '../screens/Profile/ConsentManagerScreen';
import AccessLogScreen from '../screens/Profile/AccessLogScreen';
import DataTransparencyScreen from '../screens/Profile/DataTransparencyScreen';
import TrustReportScreen from '../screens/Profile/TrustReportScreen';
import ReferralScreen from '../screens/Profile/ReferralScreen';
import HealthRewardsScreen from '../screens/Profile/HealthRewardsScreen';
import SecurityScreen from '../screens/Profile/SecurityScreen';
import PrivacyPolicyScreen from '../screens/Profile/PrivacyPolicyScreen';
import SubscriptionScreen from '../screens/Profile/SubscriptionScreen';
import TermsOfServiceScreen from '../screens/Profile/TermsOfServiceScreen';
import ConsentAgreementScreen from '../screens/Profile/ConsentAgreementScreen';
import HelpSupportScreen from '../screens/Profile/HelpSupportScreen';
import EmergencySOSScreen from '../screens/Profile/EmergencySOSScreen';
import HPSReportScreen from '../screens/Progress/HPSReportScreen';
import AyuChatScreen from '../screens/HealthCoach/AyuChatScreen';
import CapabilityDetailScreen from '../screens/HealthCoach/CapabilityDetailScreen';
import CoachConsultationScreen from '../screens/HealthServices/Coach/CoachConsultationScreen';
import CoachSpecialistListScreen from '../screens/HealthServices/Coach/CoachSpecialistListScreen';
import CoachProfileScreen from '../screens/HealthServices/Coach/CoachProfileScreen';
import CoachSessionDetailScreen from '../screens/HealthServices/Coach/CoachSessionDetailScreen';
import CounsellingConsultationScreen from '../screens/HealthServices/Counselling/CounsellingConsultationScreen';
import CounsellingSpecialistListScreen from '../screens/HealthServices/Counselling/CounsellingSpecialistListScreen';
import CounsellingProfileScreen from '../screens/HealthServices/Counselling/CounsellingProfileScreen';
import CounsellingSessionDetailScreen from '../screens/HealthServices/Counselling/CounsellingSessionDetailScreen';
import NurseConsultationScreen from '../screens/HealthServices/Nurse/NurseConsultationScreen';
import NurseSpecialistListScreen from '../screens/HealthServices/Nurse/NurseSpecialistListScreen';
import NurseProfileScreen from '../screens/HealthServices/Nurse/NurseProfileScreen';
import NurseSessionDetailScreen from '../screens/HealthServices/Nurse/NurseSessionDetailScreen';
import PhysioConsultationScreen from '../screens/HealthServices/Physiotherapy/PhysioConsultationScreen';
import PhysioSpecialistListScreen from '../screens/HealthServices/Physiotherapy/PhysioSpecialistListScreen';
import PhysioProfileScreen from '../screens/HealthServices/Physiotherapy/PhysioProfileScreen';
import PhysioSessionDetailScreen from '../screens/HealthServices/Physiotherapy/PhysioSessionDetailScreen';
import DoctorConsultationScreen from '../screens/HealthServices/Doctor/DoctorConsultationScreen';
import DoctorSpecialistListScreen from '../screens/HealthServices/Doctor/DoctorSpecialistListScreen';
import DoctorProfileScreen from '../screens/HealthServices/Doctor/DoctorProfileScreen';
import ReviewAppointmentScreen from '../screens/HealthServices/Doctor/ReviewAppointmentScreen';
import PatientDetailsScreen from '../screens/HealthServices/Doctor/PatientDetailsScreen';
import PaymentSuccessScreen from '../screens/HealthServices/Doctor/PaymentSuccessScreen';
import AppointmentConfirmedScreen from '../screens/HealthServices/Doctor/AppointmentConfirmedScreen';
import DoctorSessionDetailScreen from '../screens/HealthServices/Doctor/DoctorSessionDetailScreen';
import HealthInsuranceScreen from '../screens/HealthServices/Insurance/HealthInsuranceScreen';
import InsurancePlanDetailScreen from '../screens/HealthServices/Insurance/InsurancePlanDetailScreen';
import InsuranceNomineeDetailsScreen from '../screens/HealthServices/Insurance/InsuranceNomineeDetailsScreen';
import InsuranceDocumentVerificationScreen from '../screens/HealthServices/Insurance/InsuranceDocumentVerificationScreen';
import InsurancePaymentSuccessScreen from '../screens/HealthServices/Insurance/InsurancePaymentSuccessScreen';
import MedicineHomeScreen from '../screens/HealthServices/Medicine/MedicineHomeScreen';
import MedicineListScreen from '../screens/HealthServices/Medicine/MedicineListScreen';
import MedicineDetailScreen from '../screens/HealthServices/Medicine/MedicineDetailScreen';
import MedicineSearchScreen from '../screens/HealthServices/Medicine/MedicineSearchScreen';
import MedicineCartScreen from '../screens/HealthServices/Medicine/MedicineCartScreen';
import MedicinePaymentSuccessScreen from '../screens/HealthServices/Medicine/MedicinePaymentSuccessScreen';
import MedicineOrderPlacedScreen from '../screens/HealthServices/Medicine/MedicineOrderPlacedScreen';

import HospitalListScreen from '../screens/HealthServices/Hospital/HospitalListScreen';
import HealthGadgetsScreen from '../screens/HealthServices/Gadgets/HealthGadgetsScreen';
import TelemedicineHomeScreen from '../screens/HealthServices/Telemedicine/TelemedicineHomeScreen';
import TelemedicineSpecialistListScreen from '../screens/HealthServices/Telemedicine/TelemedicineSpecialistListScreen';
import TelemedicineProfileScreen from '../screens/HealthServices/Telemedicine/TelemedicineProfileScreen';
import WellnessCenterScreen from '../screens/HealthServices/Wellness/WellnessCenterScreen';
import WellnessDetailScreen from '../screens/HealthServices/Wellness/WellnessDetailScreen';
import WellnessBookingScreen from '../screens/HealthServices/Wellness/WellnessBookingScreen';
import WellnessSessionDetailScreen from '../screens/HealthServices/Wellness/WellnessSessionDetailScreen';
import LabHomeScreen from '../screens/HealthServices/Lab/LabHomeScreen';
import LabTestListScreen from '../screens/HealthServices/Lab/LabTestListScreen';
import LabTestSearchScreen from '../screens/HealthServices/Lab/LabTestSearchScreen';
import LabFilterScreen from '../screens/HealthServices/Lab/LabFilterScreen';
import LabCartScreen from '../screens/HealthServices/Lab/LabCartScreen';
import LabTestDetailScreen from '../screens/HealthServices/Lab/LabTestDetailScreen';
import LabPaymentSuccessScreen from '../screens/HealthServices/Lab/LabPaymentSuccessScreen';
import LabOrderPlacedScreen from '../screens/HealthServices/Lab/LabOrderPlacedScreen';
import VaccinationLogScreen from '../screens/Tracking/SymptomLogs/VaccinationLogScreen';
import ECGLogScreen from '../screens/Tracking/SymptomLogs/ECGLogScreen';
import MSKLogScreen from '../screens/Tracking/SymptomLogs/MSKLogScreen';
import TempLogScreen from '../screens/Tracking/SymptomLogs/TempLogScreen';
import MigraineLogScreen from '../screens/Tracking/SymptomLogs/MigraineLogScreen';
import AsthmaLogScreen from '../screens/Tracking/SymptomLogs/AsthmaLogScreen';
import WeightLogScreen from '../screens/Tracking/SymptomLogs/WeightLogScreen';
import GlucoseLogScreen from '../screens/Tracking/SymptomLogs/GlucoseLogScreen';
import BPLogScreen from '../screens/Tracking/SymptomLogs/BPLogScreen';
import HeartRateLogScreen from '../screens/Tracking/SymptomLogs/HeartRateLogScreen';
import MoodLogScreen from '../screens/Tracking/SymptomLogs/MoodLogScreen';
import DailyLogScreen from '../screens/Tracking/DailyLogScreen';
import AnemiaLogScreen from '../screens/Tracking/SymptomLogs/AnemiaLogScreen';
import MenstrualLogScreen from '../screens/Tracking/SymptomLogs/MenstrualLogScreen';
import SymptomsLogScreen from '../screens/Tracking/SymptomLogs/SymptomsLogScreen';
import FitnessTrackerScreen from '../screens/Tracking/Fitness/FitnessTrackerScreen';
import FitnessCategoryScreen from '../screens/Tracking/Fitness/FitnessCategoryScreen';
import StrengthTrainingScreen from '../screens/Tracking/Fitness/StrengthTrainingScreen';
import MovementScreen from '../screens/Tracking/Fitness/MovementScreen';
import LifestyleScreen from '../screens/Tracking/Fitness/LifestyleScreen';
import SleepScreen from '../screens/Tracking/Fitness/SleepScreen';
import FoodScreen from '../screens/Tracking/Fitness/FoodScreen';
import MedicationScreen from '../screens/Tracking/Fitness/MedicationScreen';
import MedDetailScreen from '../screens/Tracking/Fitness/MedDetailScreen';
import CycleScreen from '../screens/Tracking/SymptomLogs/CycleScreen';
import RecordDetailScreen from '../screens/Records/RecordDetailScreen';

const Stack = createNativeStackNavigator();

const AppNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{headerShown: false}}>
      <Stack.Screen name="MainTabs" component={BottomTabNavigator} />
      <Stack.Screen
        name="ViewAll"
        component={ViewAllScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="Profile"
        component={ProfileScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="HPSReport"
        component={HPSReportScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="AyuChat"
        component={AyuChatScreen}
        options={{animation: 'slide_from_bottom'}}
      />
      <Stack.Screen
        name="CapabilityDetail"
        component={CapabilityDetailScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="CoachConsultation"
        component={CoachConsultationScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="CoachSpecialistList"
        component={CoachSpecialistListScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="CoachProfile"
        component={CoachProfileScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="CoachSessionDetail"
        component={CoachSessionDetailScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="CounsellingConsultation"
        component={CounsellingConsultationScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="CounsellingSpecialistList"
        component={CounsellingSpecialistListScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="CounsellingProfile"
        component={CounsellingProfileScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="CounsellingSessionDetail"
        component={CounsellingSessionDetailScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="NurseConsultation"
        component={NurseConsultationScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="NurseSpecialistList"
        component={NurseSpecialistListScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="NurseProfile"
        component={NurseProfileScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="NurseSessionDetail"
        component={NurseSessionDetailScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="PhysioConsultation"
        component={PhysioConsultationScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="PhysioSpecialistList"
        component={PhysioSpecialistListScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="PhysioProfile"
        component={PhysioProfileScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="PhysioSessionDetail"
        component={PhysioSessionDetailScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="DoctorConsultation"
        component={DoctorConsultationScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="DoctorSpecialistList"
        component={DoctorSpecialistListScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="DoctorProfile"
        component={DoctorProfileScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="ReviewAppointment"
        component={ReviewAppointmentScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="PatientDetails"
        component={PatientDetailsScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="PaymentSuccess"
        component={PaymentSuccessScreen}
        options={{animation: 'fade'}}
      />
      <Stack.Screen
        name="AppointmentConfirmed"
        component={AppointmentConfirmedScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="DoctorSessionDetail"
        component={DoctorSessionDetailScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="HealthInsurance"
        component={HealthInsuranceScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="InsurancePlanDetail"
        component={InsurancePlanDetailScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="InsuranceNomineeDetails"
        component={InsuranceNomineeDetailsScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="InsuranceDocumentVerification"
        component={InsuranceDocumentVerificationScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="InsurancePaymentSuccess"
        component={InsurancePaymentSuccessScreen}
        options={{animation: 'fade'}}
      />
      <Stack.Screen
        name="HospitalList"
        component={HospitalListScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="HealthGadgets"
        component={HealthGadgetsScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="TelemedicineHome"
        component={TelemedicineHomeScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="TelemedicineSpecialistList"
        component={TelemedicineSpecialistListScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="TelemedicineProfile"
        component={TelemedicineProfileScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="WellnessCenter"
        component={WellnessCenterScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="WellnessDetail"
        component={WellnessDetailScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="WellnessBooking"
        component={WellnessBookingScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="WellnessSessionDetail"
        component={WellnessSessionDetailScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="LabHome"
        component={LabHomeScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="LabTestList"
        component={LabTestListScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="LabTestSearch"
        component={LabTestSearchScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="LabFilter"
        component={LabFilterScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="LabCart"
        component={LabCartScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="LabTestDetail"
        component={LabTestDetailScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="LabPaymentSuccess"
        component={LabPaymentSuccessScreen}
        options={{animation: 'fade'}}
      />
      <Stack.Screen
        name="LabOrderPlaced"
        component={LabOrderPlacedScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="MedicineHome"
        component={MedicineHomeScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="MedicineList"
        component={MedicineListScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="MedicineDetail"
        component={MedicineDetailScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="MedicineSearch"
        component={MedicineSearchScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="MedicineCart"
        component={MedicineCartScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="MedicinePaymentSuccess"
        component={MedicinePaymentSuccessScreen}
        options={{animation: 'fade'}}
      />
      <Stack.Screen
        name="MedicineOrderPlaced"
        component={MedicineOrderPlacedScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="VaccinationLog"
        component={VaccinationLogScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="ECGLog"
        component={ECGLogScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="MSKLog"
        component={MSKLogScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="TempLog"
        component={TempLogScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="MigraineLog"
        component={MigraineLogScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="AsthmaLog"
        component={AsthmaLogScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="WeightLog"
        component={WeightLogScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="GlucoseLog"
        component={GlucoseLogScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="BPLog"
        component={BPLogScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="MenstrualLog"
        component={MenstrualLogScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="SymptomsLog"
        component={SymptomsLogScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="HeartRateLog"
        component={HeartRateLogScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="MoodLog"
        component={MoodLogScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="AnemiaLog"
        component={AnemiaLogScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="DailyLog"
        component={DailyLogScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="FitnessTracker"
        component={FitnessTrackerScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="FitnessCategory"
        component={FitnessCategoryScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="StrengthTraining"
        component={StrengthTrainingScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="MovementTracker"
        component={MovementScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="LifestyleActivity"
        component={LifestyleScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="SleepTracker"
        component={SleepScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="FoodTracker"
        component={FoodScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="MedicationTracker"
        component={MedicationScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="MedDetail"
        component={MedDetailScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="CycleTracker"
        component={CycleScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="RecordDetail"
        component={RecordDetailScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="EditProfile"
        component={EditProfileScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="Goals"
        component={GoalsScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="PersonalInfo"
        component={PersonalInfoScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="ContactDetails"
        component={ContactScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="Preferences"
        component={PreferencesScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="HealthProfile"
        component={HealthScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="FamilyMembers"
        component={FamilyMembersScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="ConnectedDevices"
        component={ConnectedDevicesScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="ConsentManager"
        component={ConsentManagerScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="AccessLog"
        component={AccessLogScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="DataTransparency"
        component={DataTransparencyScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="TrustReport"
        component={TrustReportScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="Referral"
        component={ReferralScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="HealthRewards"
        component={HealthRewardsScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="Security"
        component={SecurityScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="PrivacyPolicy"
        component={PrivacyPolicyScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="Subscription"
        component={SubscriptionScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="TermsOfService"
        component={TermsOfServiceScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="ConsentAgreement"
        component={ConsentAgreementScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="HelpSupport"
        component={HelpSupportScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="EmergencySOS"
        component={EmergencySOSScreen}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="BiomarkerDetail"
        component={require('../screens/AyuIntel/BiomarkerDetailScreen').default}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="BiomarkerIntelDetail"
        component={require('../screens/AyuIntel/BiomarkerIntelDetailScreen').default}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="LifestyleDetail"
        component={require('../screens/AyuIntel/LifestyleDetailScreen').default}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="MedicalDetail"
        component={require('../screens/AyuIntel/MedicalDetailScreen').default}
        options={{animation: 'slide_from_right'}}
      />
      <Stack.Screen
        name="SymptomsDetail"
        component={require('../screens/AyuIntel/SymptomsDetailScreen').default}
        options={{animation: 'slide_from_right'}}
      />
    </Stack.Navigator>
  );
};

export default AppNavigator;
