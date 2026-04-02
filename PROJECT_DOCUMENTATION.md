# TrustLife App - Project Documentation

> **App Name:** TrustLife  
> **Package Name:** TrustLifeApp  
> **Version:** 0.0.1  
> **Platform:** React Native (iOS & Android)  
> **Last Updated:** April 2026

---

## Table of Contents

1. [Project Overview](#1-project-overview)
2. [Architecture](#2-architecture)
3. [Screen Inventory](#3-screen-inventory-complete-list)
4. [Component Inventory](#4-component-inventory-complete-list)
5. [Constants / Data Files](#5-constantsdata-files)
6. [Navigation Map](#6-navigation-map)
7. [Feature Documentation](#7-feature-documentation)
8. [Design System](#8-design-system)
9. [Reusable Components API](#9-reusable-components-api)
10. [Dependencies](#10-dependencies)
11. [Data Flow](#11-data-flow)
12. [File Count Summary](#12-file-count-summary)

---

## 1. Project Overview

TrustLife is a comprehensive personal health management mobile application built with React Native. It provides users with a unified platform to track vital signs, manage health records, book health services (doctors, labs, medicines, insurance), monitor progress through a Health Performance Score (HPS), and interact with an AI health coach named "Ayu Intel."

### Tech Stack

| Layer | Technology | Version |
|-------|-----------|---------|
| Framework | React Native | 0.75.4 |
| Language | JavaScript (JSX) | ES2020+ |
| React | React | 18.3.1 |
| Navigation | React Navigation (native-stack + bottom-tabs) | 6.x |
| Icons | react-native-vector-icons | 10.3.0 |
| SVG | react-native-svg | 15.15.4 |
| Responsive Sizing | react-native-size-matters | 0.4.2 |
| File System | react-native-fs | 2.20.0 |
| Safe Area | react-native-safe-area-context | 4.10.9 |
| Screens | react-native-screens | 3.34.0 |

### Target Platforms

- **iOS** -- System font (San Francisco)
- **Android** -- Roboto font
- Responsive scaling via `react-native-size-matters` (`scale`, `verticalScale`, `moderateScale`)

---

## 2. Architecture

### Directory Structure

```
TrustLife-V1/
├── App.jsx                          # Root component, AuthContext, navigator switch
├── package.json
├── src/
│   ├── assets/
│   │   └── img/                     # Static images (tab icons, logos)
│   ├── components/                  # 138 component files
│   │   ├── Fitness/                 # Fitness tracker tab components
│   │   │   ├── Cycle/               # Menstrual cycle tabs
│   │   │   ├── Food/                # Food tracker tabs
│   │   │   ├── Lifestyle/           # Lifestyle analytics tabs
│   │   │   ├── Medication/          # Medication tracker tabs
│   │   │   ├── Movement/            # Movement tracker tabs
│   │   │   ├── Sleep/               # Sleep tracker tabs
│   │   │   └── Strength/            # Strength training tabs
│   │   ├── Home/                    # Home screen sections
│   │   ├── Profile/                 # Profile screen cards
│   │   ├── Progress/                # Progress analytics tabs
│   │   ├── Records/                 # Health records sub-tabs
│   │   │   ├── DoctorNotes/         # Visit summary tabs
│   │   │   ├── Imaging/             # Imaging records (X-ray, Echo, USG)
│   │   │   ├── Insurance/           # Insurance record tabs
│   │   │   ├── LabReports/          # Lab report views
│   │   │   ├── Lifestyle/           # Lifestyle record tabs
│   │   │   ├── OtherLogs/           # BMI, Growth trackers
│   │   │   ├── Prescriptions/       # Prescription & medication tabs
│   │   │   ├── Symptoms/            # Symptom analysis tabs
│   │   │   └── Vaccination/         # Vaccination record tabs
│   │   ├── Tracking/                # Tracking screen sections
│   │   └── shared/                  # Reusable UI primitives
│   ├── constants/                   # 25 data/config files
│   ├── navigation/                  # 3 navigator files
│   │   ├── AppNavigator.js          # Main app stack (post-login)
│   │   ├── AuthNavigator.js         # Auth stack (pre-login)
│   │   └── BottomTabNavigator.js    # 5-tab bottom bar
│   └── screens/                     # 178 screen files
│       ├── Auth/                    # 26 auth screens
│       ├── HealthCoach/             # 3 screens
│       ├── HealthServices/          # 44 screens across 10 service types
│       │   ├── Coach/
│       │   ├── Counselling/
│       │   ├── Doctor/
│       │   ├── Gadgets/
│       │   ├── Hospital/
│       │   ├── Insurance/
│       │   ├── Lab/
│       │   ├── Medicine/
│       │   ├── Nurse/
│       │   ├── Physiotherapy/
│       │   ├── Telemedicine/
│       │   └── Wellness/
│       ├── Home/                    # 3 screens
│       ├── Profile/                 # 22 screens + 18 profile tabs
│       ├── Progress/                # 2 screens
│       ├── Records/                 # 2 screens
│       └── Tracking/                # 46 screens
│           ├── Fitness/             # 9 fitness screens
│           └── SymptomLogs/         # 36 symptom log screens + 1 tracking hub
```

### Navigation Hierarchy

```
App.jsx
├── AuthContext.Provider (isLoggedIn state)
└── NavigationContainer
    ├── [!isLoggedIn] AuthNavigator (Stack)
    │   ├── Splash, Welcome
    │   ├── Sign-up: Phone -> OTP -> Personal -> Health -> Medications -> Plan -> Payment -> PaymentMethod -> PaymentProcessing -> Agreement -> Done
    │   ├── Legal: Terms, Consent, PrivacyPolicy
    │   ├── Login: LoginHub -> LoginBio / LoginPin / LoginPassword -> LoginSuccess
    │   └── Forgot: ForgotStep0 -> ForgotStep1 -> ForgotStep2 -> ForgotNewPassword / ForgotNewPin -> ForgotDone
    │
    └── [isLoggedIn] AppNavigator (Stack)
        ├── MainTabs (BottomTabNavigator)
        │   ├── Home        -> HomeScreen
        │   ├── Tracking    -> TrackingScreen
        │   ├── Records     -> RecordsScreen
        │   ├── Progress    -> ProgressScreen
        │   └── Ayu Intel   -> HealthCoachScreen
        │
        ├── Home sub-screens: ViewAll, Profile
        ├── Profile sub-screens: EditProfile, Goals, PersonalInfo, ContactDetails, Preferences, HealthProfile, FamilyMembers, ConnectedDevices, ConsentManager, AccessLog, DataTransparency, TrustReport, Referral, HealthRewards, Security, PrivacyPolicy, Subscription, TermsOfService, ConsentAgreement, HelpSupport, EmergencySOS
        ├── Progress: HPSReport
        ├── Health Coach: AyuChat, CapabilityDetail
        ├── Tracking - Symptom Logs: VaccinationLog, ECGLog, MSKLog, TempLog, MigraineLog, AsthmaLog, WeightLog, GlucoseLog, BPLog, MenstrualLog, SymptomsLog, HeartRateLog, MoodLog, AnemiaLog
        ├── Tracking - Fitness: FitnessTracker, FitnessCategory, StrengthTraining, MovementTracker, LifestyleActivity, SleepTracker, FoodTracker, MedicationTracker, MedDetail, CycleTracker
        └── Health Services: (see Section 6 for full list)
```

### State Management Approach

- **AuthContext** (`App.jsx`): React Context with `isLoggedIn` / `setIsLoggedIn` boolean -- toggles between AuthNavigator and AppNavigator
- **Local component state** (`useState`): All screens manage their own state locally
- **Constants files**: Mock/static data used across screens (no backend API integration yet)
- **Navigation params**: Data passed between screens via `navigation.navigate('ScreenName', { params })`

---

## 3. Screen Inventory (Complete List)

### Auth Screens (26 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/Auth/SplashScreen.js` | Splash | App launch splash with branding |
| 2 | `src/screens/Auth/WelcomeScreen.js` | Welcome | Onboarding welcome with CTA |
| 3 | `src/screens/Auth/PhoneScreen.js` | Phone | Phone number input for signup |
| 4 | `src/screens/Auth/OTPScreen.js` | OTP | OTP verification |
| 5 | `src/screens/Auth/PersonalScreen.js` | Personal | Name, DOB, gender collection |
| 6 | `src/screens/Auth/HealthProfileScreen.js` | Health | Health conditions & allergies |
| 7 | `src/screens/Auth/MedicationsScreen.js` | Medications | Current medications input |
| 8 | `src/screens/Auth/PlanScreen.js` | Plan | Subscription plan selection |
| 9 | `src/screens/Auth/PaymentScreen.js` | Payment | Payment summary |
| 10 | `src/screens/Auth/PaymentMethodScreen.js` | PaymentMethod | Payment method selection |
| 11 | `src/screens/Auth/PaymentProcessingScreen.js` | PaymentProcessing | Payment processing animation |
| 12 | `src/screens/Auth/AgreementScreen.js` | Agreement | Terms & consent agreement |
| 13 | `src/screens/Auth/DoneScreen.js` | Done | Signup completion confirmation |
| 14 | `src/screens/Auth/TermsScreen.js` | Terms | Terms of service (standalone) |
| 15 | `src/screens/Auth/ConsentScreen.js` | Consent | Consent agreement (standalone) |
| 16 | `src/screens/Auth/LoginHubScreen.js` | LoginHub | Login method selection hub |
| 17 | `src/screens/Auth/LoginBioScreen.js` | LoginBio | Biometric login (fingerprint/face) |
| 18 | `src/screens/Auth/LoginPinScreen.js` | LoginPin | PIN-based login |
| 19 | `src/screens/Auth/LoginPasswordScreen.js` | LoginPassword | Password-based login |
| 20 | `src/screens/Auth/LoginSuccessScreen.js` | LoginSuccess | Login success confirmation |
| 21 | `src/screens/Auth/ForgotStep0Screen.js` | ForgotStep0 | Choose forgot password or PIN |
| 22 | `src/screens/Auth/ForgotStep1Screen.js` | ForgotStep1 | Identity verification step 1 |
| 23 | `src/screens/Auth/ForgotStep2Screen.js` | ForgotStep2 | Identity verification step 2 |
| 24 | `src/screens/Auth/ForgotNewPasswordScreen.js` | ForgotNewPassword | Set new password |
| 25 | `src/screens/Auth/ForgotNewPinScreen.js` | ForgotNewPin | Set new PIN |
| 26 | `src/screens/Auth/ForgotDoneScreen.js` | ForgotDone | Reset completion confirmation |

### Home Screens (3 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/Home/HomeScreen.js` | Home (tab) | Main dashboard with hero, conditions, quick actions, services |
| 2 | `src/screens/Home/ProfileScreen.js` | Profile | User profile hub with menu sections |
| 3 | `src/screens/Home/ViewAllScreen.js` | ViewAll | Generic view-all list screen |

### Tracking Screens -- Symptom Logs (37 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/Tracking/TrackingScreen.js` | Tracking (tab) | Main tracking dashboard |
| 2 | `src/screens/Tracking/SymptomLogs/SymptomsLogScreen.js` | SymptomsLog | General symptoms logging |
| 3 | `src/screens/Tracking/SymptomLogs/BPLogScreen.js` | BPLog | Blood pressure log |
| 4 | `src/screens/Tracking/SymptomLogs/BPAutoView.js` | -- | BP auto-reading view |
| 5 | `src/screens/Tracking/SymptomLogs/BPManualView.js` | -- | BP manual entry view |
| 6 | `src/screens/Tracking/SymptomLogs/HeartRateLogScreen.js` | HeartRateLog | Heart rate log |
| 7 | `src/screens/Tracking/SymptomLogs/HRAutoView.js` | -- | Heart rate auto-reading view |
| 8 | `src/screens/Tracking/SymptomLogs/HRManualView.js` | -- | Heart rate manual entry view |
| 9 | `src/screens/Tracking/SymptomLogs/GlucoseLogScreen.js` | GlucoseLog | Blood glucose log |
| 10 | `src/screens/Tracking/SymptomLogs/GlucoseAutoView.js` | -- | Glucose auto-reading view |
| 11 | `src/screens/Tracking/SymptomLogs/GlucoseManualView.js` | -- | Glucose manual entry view |
| 12 | `src/screens/Tracking/SymptomLogs/WeightLogScreen.js` | WeightLog | Weight tracking log |
| 13 | `src/screens/Tracking/SymptomLogs/WeightAutoView.js` | -- | Weight auto-reading view |
| 14 | `src/screens/Tracking/SymptomLogs/WeightManualView.js` | -- | Weight manual entry view |
| 15 | `src/screens/Tracking/SymptomLogs/TempLogScreen.js` | TempLog | Body temperature log |
| 16 | `src/screens/Tracking/SymptomLogs/TempAutoView.js` | -- | Temperature auto-reading view |
| 17 | `src/screens/Tracking/SymptomLogs/TempManualView.js` | -- | Temperature manual entry view |
| 18 | `src/screens/Tracking/SymptomLogs/ECGLogScreen.js` | ECGLog | ECG/EKG log |
| 19 | `src/screens/Tracking/SymptomLogs/ECGAutoView.js` | -- | ECG auto-reading view |
| 20 | `src/screens/Tracking/SymptomLogs/ECGManualView.js` | -- | ECG manual entry view |
| 21 | `src/screens/Tracking/SymptomLogs/MoodLogScreen.js` | MoodLog | Mood tracking log |
| 22 | `src/screens/Tracking/SymptomLogs/MoodAutoView.js` | -- | Mood auto view |
| 23 | `src/screens/Tracking/SymptomLogs/MoodManualView.js` | -- | Mood manual entry view |
| 24 | `src/screens/Tracking/SymptomLogs/MigraineLogScreen.js` | MigraineLog | Migraine tracking log |
| 25 | `src/screens/Tracking/SymptomLogs/MigraineAutoView.js` | -- | Migraine auto view |
| 26 | `src/screens/Tracking/SymptomLogs/MigraineManualView.js` | -- | Migraine manual entry view |
| 27 | `src/screens/Tracking/SymptomLogs/AsthmaLogScreen.js` | AsthmaLog | Asthma tracking log |
| 28 | `src/screens/Tracking/SymptomLogs/AsthmaAutoView.js` | -- | Asthma auto view |
| 29 | `src/screens/Tracking/SymptomLogs/AsthmaManualView.js` | -- | Asthma manual entry view |
| 30 | `src/screens/Tracking/SymptomLogs/AnemiaLogScreen.js` | AnemiaLog | Anemia tracking log |
| 31 | `src/screens/Tracking/SymptomLogs/AnemiaAutoView.js` | -- | Anemia auto view |
| 32 | `src/screens/Tracking/SymptomLogs/AnemiaManualView.js` | -- | Anemia manual entry view |
| 33 | `src/screens/Tracking/SymptomLogs/MSKLogScreen.js` | MSKLog | Musculoskeletal pain log |
| 34 | `src/screens/Tracking/SymptomLogs/MSKAutoView.js` | -- | MSK auto view |
| 35 | `src/screens/Tracking/SymptomLogs/MSKManualView.js` | -- | MSK manual entry view |
| 36 | `src/screens/Tracking/SymptomLogs/MenstrualLogScreen.js` | MenstrualLog | Menstrual cycle log |
| 37 | `src/screens/Tracking/SymptomLogs/VaccinationLogScreen.js` | VaccinationLog | Vaccination record log |
| 38 | `src/screens/Tracking/SymptomLogs/VaccLogView.js` | -- | Vaccination log view |
| 39 | `src/screens/Tracking/SymptomLogs/VaccAefiView.js` | -- | Vaccination AEFI reporting view |
| 40 | `src/screens/Tracking/SymptomLogs/VaccTravelCertsView.js` | -- | Vaccination travel certificates view |
| 41 | `src/screens/Tracking/SymptomLogs/CycleScreen.js` | CycleTracker | Menstrual cycle detailed tracker |

### Tracking Screens -- Fitness (9 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/Tracking/Fitness/FitnessTrackerScreen.js` | FitnessTracker | Fitness tracker hub |
| 2 | `src/screens/Tracking/Fitness/FitnessCategoryScreen.js` | FitnessCategory | Category selection screen |
| 3 | `src/screens/Tracking/Fitness/StrengthTrainingScreen.js` | StrengthTraining | Strength/weight training tracker |
| 4 | `src/screens/Tracking/Fitness/MovementScreen.js` | MovementTracker | Movement/cardio activity tracker |
| 5 | `src/screens/Tracking/Fitness/SleepScreen.js` | SleepTracker | Sleep quality tracker |
| 6 | `src/screens/Tracking/Fitness/FoodScreen.js` | FoodTracker | Food/nutrition tracker |
| 7 | `src/screens/Tracking/Fitness/LifestyleScreen.js` | LifestyleActivity | Lifestyle activity tracker |
| 8 | `src/screens/Tracking/Fitness/MedicationScreen.js` | MedicationTracker | Medication adherence tracker |
| 9 | `src/screens/Tracking/Fitness/MedDetailScreen.js` | MedDetail | Individual medication detail view |

### Records Screens (2 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/Records/RecordsScreen.js` | Records (tab) | Main records hub with tabs |
| 2 | `src/screens/Records/LifestyleScreen.js` | -- | Lifestyle records detail |

### Progress Screens (2 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/Progress/ProgressScreen.js` | Progress (tab) | Progress analytics dashboard |
| 2 | `src/screens/Progress/HPSReportScreen.js` | HPSReport | Detailed HPS report |

### Health Coach / Ayu Intel Screens (3 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/HealthCoach/HealthCoachScreen.js` | Ayu (tab) | Ayu Intel health coach home |
| 2 | `src/screens/HealthCoach/AyuChatScreen.js` | AyuChat | AI chat interface |
| 3 | `src/screens/HealthCoach/CapabilityDetailScreen.js` | CapabilityDetail | Capability detail view |

### Health Services Screens (44 files)

#### Doctor (8 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/HealthServices/Doctor/DoctorConsultationScreen.js` | DoctorConsultation | Doctor consultation home |
| 2 | `src/screens/HealthServices/Doctor/DoctorSpecialistListScreen.js` | DoctorSpecialistList | Specialist doctor listing |
| 3 | `src/screens/HealthServices/Doctor/DoctorProfileScreen.js` | DoctorProfile | Individual doctor profile |
| 4 | `src/screens/HealthServices/Doctor/ReviewAppointmentScreen.js` | ReviewAppointment | Appointment review |
| 5 | `src/screens/HealthServices/Doctor/PatientDetailsScreen.js` | PatientDetails | Patient details for booking |
| 6 | `src/screens/HealthServices/Doctor/PaymentSuccessScreen.js` | PaymentSuccess | Doctor payment confirmation |
| 7 | `src/screens/HealthServices/Doctor/AppointmentConfirmedScreen.js` | AppointmentConfirmed | Booking confirmed |
| 8 | `src/screens/HealthServices/Doctor/DoctorSessionDetailScreen.js` | DoctorSessionDetail | Past session details |

#### Coach (4 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/HealthServices/Coach/CoachConsultationScreen.js` | CoachConsultation | Coach consultation home |
| 2 | `src/screens/HealthServices/Coach/CoachSpecialistListScreen.js` | CoachSpecialistList | Coach listing |
| 3 | `src/screens/HealthServices/Coach/CoachProfileScreen.js` | CoachProfile | Individual coach profile |
| 4 | `src/screens/HealthServices/Coach/CoachSessionDetailScreen.js` | CoachSessionDetail | Session detail view |

#### Counselling (4 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/HealthServices/Counselling/CounsellingConsultationScreen.js` | CounsellingConsultation | Counselling home |
| 2 | `src/screens/HealthServices/Counselling/CounsellingSpecialistListScreen.js` | CounsellingSpecialistList | Counsellor listing |
| 3 | `src/screens/HealthServices/Counselling/CounsellingProfileScreen.js` | CounsellingProfile | Counsellor profile |
| 4 | `src/screens/HealthServices/Counselling/CounsellingSessionDetailScreen.js` | CounsellingSessionDetail | Session detail view |

#### Nurse (4 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/HealthServices/Nurse/NurseConsultationScreen.js` | NurseConsultation | Nurse service home |
| 2 | `src/screens/HealthServices/Nurse/NurseSpecialistListScreen.js` | NurseSpecialistList | Nurse listing |
| 3 | `src/screens/HealthServices/Nurse/NurseProfileScreen.js` | NurseProfile | Individual nurse profile |
| 4 | `src/screens/HealthServices/Nurse/NurseSessionDetailScreen.js` | NurseSessionDetail | Session detail view |

#### Physiotherapy (4 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/HealthServices/Physiotherapy/PhysioConsultationScreen.js` | PhysioConsultation | Physiotherapy home |
| 2 | `src/screens/HealthServices/Physiotherapy/PhysioSpecialistListScreen.js` | PhysioSpecialistList | Physiotherapist listing |
| 3 | `src/screens/HealthServices/Physiotherapy/PhysioProfileScreen.js` | PhysioProfile | Physiotherapist profile |
| 4 | `src/screens/HealthServices/Physiotherapy/PhysioSessionDetailScreen.js` | PhysioSessionDetail | Session detail view |

#### Lab Tests (8 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/HealthServices/Lab/LabHomeScreen.js` | LabHome | Lab test home |
| 2 | `src/screens/HealthServices/Lab/LabTestListScreen.js` | LabTestList | Lab test catalog |
| 3 | `src/screens/HealthServices/Lab/LabTestSearchScreen.js` | LabTestSearch | Lab test search |
| 4 | `src/screens/HealthServices/Lab/LabFilterScreen.js` | LabFilter | Lab filter options |
| 5 | `src/screens/HealthServices/Lab/LabCartScreen.js` | LabCart | Lab test cart |
| 6 | `src/screens/HealthServices/Lab/LabTestDetailScreen.js` | LabTestDetail | Individual test detail |
| 7 | `src/screens/HealthServices/Lab/LabPaymentSuccessScreen.js` | LabPaymentSuccess | Payment confirmation |
| 8 | `src/screens/HealthServices/Lab/LabOrderPlacedScreen.js` | LabOrderPlaced | Order placed confirmation |

#### Medicine / Pharmacy (7 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/HealthServices/Medicine/MedicineHomeScreen.js` | MedicineHome | Pharmacy home |
| 2 | `src/screens/HealthServices/Medicine/MedicineListScreen.js` | MedicineList | Medicine catalog |
| 3 | `src/screens/HealthServices/Medicine/MedicineDetailScreen.js` | MedicineDetail | Medicine detail view |
| 4 | `src/screens/HealthServices/Medicine/MedicineSearchScreen.js` | MedicineSearch | Medicine search |
| 5 | `src/screens/HealthServices/Medicine/MedicineCartScreen.js` | MedicineCart | Medicine shopping cart |
| 6 | `src/screens/HealthServices/Medicine/MedicinePaymentSuccessScreen.js` | MedicinePaymentSuccess | Payment confirmation |
| 7 | `src/screens/HealthServices/Medicine/MedicineOrderPlacedScreen.js` | MedicineOrderPlaced | Order placed confirmation |

#### Insurance (5 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/HealthServices/Insurance/HealthInsuranceScreen.js` | HealthInsurance | Insurance plans home |
| 2 | `src/screens/HealthServices/Insurance/InsurancePlanDetailScreen.js` | InsurancePlanDetail | Plan details view |
| 3 | `src/screens/HealthServices/Insurance/InsuranceNomineeDetailsScreen.js` | InsuranceNomineeDetails | Nominee information |
| 4 | `src/screens/HealthServices/Insurance/InsuranceDocumentVerificationScreen.js` | InsuranceDocumentVerification | Document upload/verification |
| 5 | `src/screens/HealthServices/Insurance/InsurancePaymentSuccessScreen.js` | InsurancePaymentSuccess | Payment confirmation |

#### Telemedicine (3 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/HealthServices/Telemedicine/TelemedicineHomeScreen.js` | TelemedicineHome | Telemedicine home |
| 2 | `src/screens/HealthServices/Telemedicine/TelemedicineSpecialistListScreen.js` | TelemedicineSpecialistList | Specialist listing |
| 3 | `src/screens/HealthServices/Telemedicine/TelemedicineProfileScreen.js` | TelemedicineProfile | Provider profile |

#### Wellness (4 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/HealthServices/Wellness/WellnessCenterScreen.js` | WellnessCenter | Wellness centers listing |
| 2 | `src/screens/HealthServices/Wellness/WellnessDetailScreen.js` | WellnessDetail | Center detail view |
| 3 | `src/screens/HealthServices/Wellness/WellnessBookingScreen.js` | WellnessBooking | Booking flow |
| 4 | `src/screens/HealthServices/Wellness/WellnessSessionDetailScreen.js` | WellnessSessionDetail | Session detail view |

#### Hospital (1 file)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/HealthServices/Hospital/HospitalListScreen.js` | HospitalList | Hospital search/listing |

#### Gadgets (1 file)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/HealthServices/Gadgets/HealthGadgetsScreen.js` | HealthGadgets | Health gadgets marketplace |

### Profile Screens (22 main + 18 tabs = 40 files)

#### Main Profile Screens (22 files)

| # | File | Route Name | Description |
|---|------|-----------|-------------|
| 1 | `src/screens/Profile/EditProfileScreen.js` | EditProfile | Edit user profile |
| 2 | `src/screens/Profile/GoalsScreen.js` | Goals | Health goals management |
| 3 | `src/screens/Profile/PersonalInfoScreen.js` | PersonalInfo | Personal information view |
| 4 | `src/screens/Profile/ContactScreen.js` | ContactDetails | Contact details management |
| 5 | `src/screens/Profile/PreferencesScreen.js` | Preferences | App preferences |
| 6 | `src/screens/Profile/HealthScreen.js` | HealthProfile | Health profile overview |
| 7 | `src/screens/Profile/FamilyMembersScreen.js` | FamilyMembers | Family member management |
| 8 | `src/screens/Profile/ConnectedDevicesScreen.js` | ConnectedDevices | Connected health devices |
| 9 | `src/screens/Profile/ConsentManagerScreen.js` | ConsentManager | Data consent management |
| 10 | `src/screens/Profile/AccessLogScreen.js` | AccessLog | Data access audit log |
| 11 | `src/screens/Profile/DataTransparencyScreen.js` | DataTransparency | Data transparency dashboard |
| 12 | `src/screens/Profile/TrustReportScreen.js` | TrustReport | Trust score report |
| 13 | `src/screens/Profile/ReferralScreen.js` | Referral | Referral program |
| 14 | `src/screens/Profile/HealthRewardsScreen.js` | HealthRewards | Health rewards/points |
| 15 | `src/screens/Profile/SecurityScreen.js` | Security | Security settings |
| 16 | `src/screens/Profile/PrivacyPolicyScreen.js` | PrivacyPolicy | Privacy policy viewer |
| 17 | `src/screens/Profile/SubscriptionScreen.js` | Subscription | Subscription management |
| 18 | `src/screens/Profile/TermsOfServiceScreen.js` | TermsOfService | Terms of service viewer |
| 19 | `src/screens/Profile/ConsentAgreementScreen.js` | ConsentAgreement | Consent agreement viewer |
| 20 | `src/screens/Profile/HelpSupportScreen.js` | HelpSupport | Help & support |
| 21 | `src/screens/Profile/EmergencySOSScreen.js` | EmergencySOS | Emergency SOS configuration |
| 22 | `src/screens/Profile/FamilyMembersScreen.js` | FamilyMembers | Family members management |

#### Profile Tabs (18 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/screens/Profile/tabs/OverviewTab.js` | Profile overview summary |
| 2 | `src/screens/Profile/tabs/PersonalTab.js` | Personal details tab |
| 3 | `src/screens/Profile/tabs/ContactTab.js` | Contact information tab |
| 4 | `src/screens/Profile/tabs/HealthTab.js` | Health data tab |
| 5 | `src/screens/Profile/tabs/BodyCompTab.js` | Body composition tab |
| 6 | `src/screens/Profile/tabs/LifestyleTab.js` | Lifestyle habits tab |
| 7 | `src/screens/Profile/tabs/FamilyHistoryTab.js` | Family medical history tab |
| 8 | `src/screens/Profile/tabs/InsuranceTab.js` | Insurance details tab |
| 9 | `src/screens/Profile/tabs/DependentsTab.js` | Dependents information tab |
| 10 | `src/screens/Profile/tabs/DentalTab.js` | Dental records tab |
| 11 | `src/screens/Profile/tabs/VisionTab.js` | Vision records tab |
| 12 | `src/screens/Profile/tabs/ReproductiveTab.js` | Reproductive health tab |
| 13 | `src/screens/Profile/tabs/GeneticTab.js` | Genetic data tab |
| 14 | `src/screens/Profile/tabs/EnvironmentTab.js` | Environmental factors tab |
| 15 | `src/screens/Profile/tabs/DigitalHealthTab.js` | Digital health records tab |
| 16 | `src/screens/Profile/tabs/SupplementsTab.js` | Supplements tab |
| 17 | `src/screens/Profile/tabs/PreferencesTab.js` | Preferences tab |
| 18 | `src/screens/Profile/tabs/SecurityTab.js` | Security settings tab |

---

## 4. Component Inventory (Complete List)

### Shared / Reusable Components (9 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/shared/AppText.js` | Global typography component with variant system |
| 2 | `src/components/shared/AppTextField.js` | Styled text input with label, hint, error, icon |
| 3 | `src/components/shared/AppDropdown.js` | Dropdown picker with label and inline options |
| 4 | `src/components/shared/Icons.js` | Universal icon component wrapping 12 vector icon families |
| 5 | `src/components/shared/Emoji.js` | Cross-platform emoji renderer |
| 6 | `src/components/shared/SectionTitle.js` | Section header with optional link text |
| 7 | `src/components/shared/FilterBottomSheet.js` | Modal bottom sheet with filter chips |
| 8 | `src/components/shared/MiniBars.js` | Mini bar chart visualization |
| 9 | `src/components/shared/StandaloneBottomBar.js` | Reusable bottom navigation bar for service screens |

### Home Components (8 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Home/HeroSection.js` | Dashboard hero with HPS score and greeting |
| 2 | `src/components/Home/ActiveConditionsCard.js` | Active health conditions card |
| 3 | `src/components/Home/QuickActions.js` | Quick action buttons grid |
| 4 | `src/components/Home/ForYouCarousel.js` | Personalized content carousel |
| 5 | `src/components/Home/HealthServices.js` | Health services grid |
| 6 | `src/components/Home/AyuBanner.js` | Ayu AI coach promotional banner |
| 7 | `src/components/Home/OrganHealthGrid.js` | Organ health status grid |
| 8 | `src/components/Home/TestReadinessCard.js` | Test readiness indicator card |

### Profile Components (8 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Profile/ProfileHeader.js` | Profile screen header with avatar |
| 2 | `src/components/Profile/HealthSummary.js` | Health summary card |
| 3 | `src/components/Profile/MenuSection.js` | Profile menu section list |
| 4 | `src/components/Profile/AyuCard.js` | Ayu AI card in profile |
| 5 | `src/components/Profile/BillingCard.js` | Billing/subscription card |
| 6 | `src/components/Profile/CareTeamCard.js` | Care team overview card |
| 7 | `src/components/Profile/SOSCard.js` | Emergency SOS quick card |
| 8 | `src/components/Profile/TrustReportCard.js` | Trust report summary card |

### Tracking Components (6 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Tracking/DailyProgress.js` | Daily health progress overview |
| 2 | `src/components/Tracking/DayStrip.js` | Horizontal day selector strip |
| 3 | `src/components/Tracking/LogTimeline.js` | Chronological log timeline |
| 4 | `src/components/Tracking/PriorityReadings.js` | Priority health readings cards |
| 5 | `src/components/Tracking/SymptomLogs.js` | Symptom log entry cards |
| 6 | `src/components/Tracking/TrackerGrid.js` | Tracker category grid |

### Progress Components (5 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Progress/HPSScoreTab.js` | Health Performance Score tab |
| 2 | `src/components/Progress/BiomarkersTab.js` | Biomarkers analytics tab |
| 3 | `src/components/Progress/ConditionsTab.js` | Conditions tracking tab |
| 4 | `src/components/Progress/LifestyleTab.js` | Lifestyle analytics tab |
| 5 | `src/components/Progress/MedicationTab.js` | Medication adherence tab |

### Records Components (49 files)

#### Top-Level Records Components (3 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Records/VisitSummaryTab.js` | Visit summary overview tab |
| 2 | `src/components/Records/IndividualRecordsTab.js` | Individual records browser tab |
| 3 | `src/components/Records/ServiceRecordsTab.js` | Service records browser tab |

#### Doctor Notes (8 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Records/DoctorNotes/NotesByDoctorTab.js` | Notes organized by doctor |
| 2 | `src/components/Records/DoctorNotes/NotesChronologicalTab.js` | Notes in chronological order |
| 3 | `src/components/Records/DoctorNotes/VisitSummaryTab.js` | Individual visit summary |
| 4 | `src/components/Records/DoctorNotes/VisitVitalsTab.js` | Visit vitals recording |
| 5 | `src/components/Records/DoctorNotes/VisitFindingsTab.js` | Clinical findings |
| 6 | `src/components/Records/DoctorNotes/VisitInvestigationsTab.js` | Investigations ordered |
| 7 | `src/components/Records/DoctorNotes/VisitPrescriptionTab.js` | Prescriptions from visit |
| 8 | `src/components/Records/DoctorNotes/VisitFollowUpTab.js` | Follow-up plan |

#### Imaging Records (15 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Records/Imaging/ImgAllTab.js` | All imaging records |
| 2 | `src/components/Records/Imaging/ImgByFacilityTab.js` | Imaging by facility |
| 3 | `src/components/Records/Imaging/XraySummaryTab.js` | X-ray summary |
| 4 | `src/components/Records/Imaging/XrayFindingsTab.js` | X-ray findings |
| 5 | `src/components/Records/Imaging/XrayDetailsTab.js` | X-ray details |
| 6 | `src/components/Records/Imaging/XrayClinicalContextTab.js` | X-ray clinical context |
| 7 | `src/components/Records/Imaging/XrayPeerGroupTab.js` | X-ray peer comparison |
| 8 | `src/components/Records/Imaging/EchoSummaryTab.js` | Echocardiogram summary |
| 9 | `src/components/Records/Imaging/EchoMeasurementsTab.js` | Echo measurements |
| 10 | `src/components/Records/Imaging/EchoContextTab.js` | Echo clinical context |
| 11 | `src/components/Records/Imaging/EchoPeerGroupTab.js` | Echo peer comparison |
| 12 | `src/components/Records/Imaging/UsgSummaryTab.js` | Ultrasound summary |
| 13 | `src/components/Records/Imaging/UsgFindingsTab.js` | Ultrasound findings |
| 14 | `src/components/Records/Imaging/UsgContextTab.js` | Ultrasound clinical context |
| 15 | `src/components/Records/Imaging/UsgPeerGroupTab.js` | Ultrasound peer comparison |

#### Lab Reports (6 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Records/LabReports/LabAllReportsTab.js` | All lab reports listing |
| 2 | `src/components/Records/LabReports/LabBiomarkersTab.js` | Biomarker trends |
| 3 | `src/components/Records/LabReports/LabBiomarkerDetailView.js` | Individual biomarker detail |
| 4 | `src/components/Records/LabReports/LabByLabTab.js` | Reports grouped by lab |
| 5 | `src/components/Records/LabReports/LabReportSmartView.js` | AI-powered smart report view |
| 6 | `src/components/Records/LabReports/LabReportTraditionalView.js` | Traditional tabular report view |

#### Insurance Records (6 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Records/Insurance/InsOverviewTab.js` | Insurance overview |
| 2 | `src/components/Records/Insurance/InsBenefitsTab.js` | Benefits breakdown |
| 3 | `src/components/Records/Insurance/InsClaimsTab.js` | Claims history |
| 4 | `src/components/Records/Insurance/InsPremiumTab.js` | Premium details |
| 5 | `src/components/Records/Insurance/InsDocumentsTab.js` | Insurance documents |
| 6 | `src/components/Records/Insurance/InsAnalyticsTab.js` | Insurance analytics |

#### Lifestyle Records (5 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Records/Lifestyle/LifestyleSummaryTab.js` | Lifestyle summary |
| 2 | `src/components/Records/Lifestyle/LifestyleActivityTab.js` | Activity records |
| 3 | `src/components/Records/Lifestyle/LifestyleFoodTab.js` | Food/nutrition records |
| 4 | `src/components/Records/Lifestyle/LifestyleSleepTab.js` | Sleep records |
| 5 | `src/components/Records/Lifestyle/LifestyleMedicationTab.js` | Medication records |

#### Prescriptions (9 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Records/Prescriptions/RxCurrentTab.js` | Current prescriptions |
| 2 | `src/components/Records/Prescriptions/RxHistoryTab.js` | Prescription history |
| 3 | `src/components/Records/Prescriptions/RxByDoctorTab.js` | Prescriptions by doctor |
| 4 | `src/components/Records/Prescriptions/RxInteractionsTab.js` | Drug interactions |
| 5 | `src/components/Records/Prescriptions/MetDrugDetailsTab.js` | Medication drug details |
| 6 | `src/components/Records/Prescriptions/MetHistoryTab.js` | Medication history |
| 7 | `src/components/Records/Prescriptions/MetAdherenceTab.js` | Medication adherence |
| 8 | `src/components/Records/Prescriptions/MetSymptomsTab.js` | Medication side effects/symptoms |
| 9 | `src/components/Records/Prescriptions/MetVisitsTab.js` | Medication-related visits |

#### Symptoms Records (6 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Records/Symptoms/SymDayByDayTab.js` | Day-by-day symptom log |
| 2 | `src/components/Records/Symptoms/SymPatternsTab.js` | Symptom patterns analysis |
| 3 | `src/components/Records/Symptoms/SymTriggersTab.js` | Symptom triggers |
| 4 | `src/components/Records/Symptoms/SymCorrelationsTab.js` | Symptom correlations |
| 5 | `src/components/Records/Symptoms/SymVsLastMonthTab.js` | Month-over-month comparison |
| 6 | `src/components/Records/Symptoms/SymDoctorNotesTab.js` | Doctor notes on symptoms |

#### Vaccination Records (6 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Records/Vaccination/VaxOverviewTab.js` | Vaccination overview |
| 2 | `src/components/Records/Vaccination/VaxScheduleTab.js` | Vaccination schedule |
| 3 | `src/components/Records/Vaccination/VaxAdministrationTab.js` | Administration details |
| 4 | `src/components/Records/Vaccination/VaxSideEffectsTab.js` | Side effects tracking |
| 5 | `src/components/Records/Vaccination/VaxCertificateTab.js` | Vaccination certificates |
| 6 | `src/components/Records/Vaccination/VaxHowItWorksTab.js` | Vaccine information |

#### Other Logs (3 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Records/OtherLogs/BmiTrackerTab.js` | BMI tracker |
| 2 | `src/components/Records/OtherLogs/GrowthTrackerTab.js` | Growth tracker |
| 3 | `src/components/Records/OtherLogs/AddLogTab.js` | Add new log entry |

### Fitness Components (36 files)

#### Strength Training (5 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Fitness/Strength/DailyLogTab.js` | Strength daily log |
| 2 | `src/components/Fitness/Strength/PlannerTab.js` | Workout planner |
| 3 | `src/components/Fitness/Strength/HistoryTab.js` | Workout history |
| 4 | `src/components/Fitness/Strength/SummaryTab.js` | Strength summary |
| 5 | `src/components/Fitness/Strength/AyuOverlay.js` | Ayu AI overlay for strength |
| 6 | `src/components/Fitness/Strength/RestTimerOverlay.js` | Rest timer between sets |

#### Movement (4 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Fitness/Movement/DashboardTab.js` | Movement dashboard |
| 2 | `src/components/Fitness/Movement/LogActivityTab.js` | Log new activity |
| 3 | `src/components/Fitness/Movement/TrendsTab.js` | Movement trends |
| 4 | `src/components/Fitness/Movement/ConnectTab.js` | Connect devices/apps |

#### Sleep (3 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Fitness/Sleep/TonightTab.js` | Tonight's sleep plan |
| 2 | `src/components/Fitness/Sleep/MorningTab.js` | Morning sleep review |
| 3 | `src/components/Fitness/Sleep/TrendsTab.js` | Sleep trends |

#### Food / Nutrition (4 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Fitness/Food/TodayTab.js` | Today's food log |
| 2 | `src/components/Fitness/Food/AddFoodTab.js` | Add food entry |
| 3 | `src/components/Fitness/Food/NutrientsTab.js` | Nutrient breakdown |
| 4 | `src/components/Fitness/Food/TrendsTab.js` | Food/nutrition trends |

#### Menstrual Cycle (4 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Fitness/Cycle/WheelTab.js` | Cycle wheel visualization |
| 2 | `src/components/Fitness/Cycle/CalendarTab.js` | Cycle calendar view |
| 3 | `src/components/Fitness/Cycle/DailyLogTab.js` | Daily cycle log |
| 4 | `src/components/Fitness/Cycle/HistoryTab.js` | Cycle history |

#### Medication Tracker (4 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Fitness/Medication/TodayTab.js` | Today's medication schedule |
| 2 | `src/components/Fitness/Medication/MyMedsTab.js` | My medications list |
| 3 | `src/components/Fitness/Medication/AdherenceTab.js` | Medication adherence stats |
| 4 | `src/components/Fitness/Medication/AyuTab.js` | Ayu AI medication insights |

#### Lifestyle (2 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Fitness/Lifestyle/LogTab.js` | Lifestyle activity log |
| 2 | `src/components/Fitness/Lifestyle/AnalyticsTab.js` | Lifestyle analytics |

#### Shared Fitness Components (7 files)

| # | File | Description |
|---|------|-------------|
| 1 | `src/components/Fitness/StrengthFlow.js` | Strength workout flow manager |
| 2 | `src/components/Fitness/SubcatGrid.js` | Sub-category selection grid |
| 3 | `src/components/Fitness/CardioExtras.js` | Cardio-specific extra fields |
| 4 | `src/components/Fitness/MindBodyExtras.js` | Mind-body exercise extras |
| 5 | `src/components/Fitness/DurationPicker.js` | Duration input picker |
| 6 | `src/components/Fitness/IntensityPicker.js` | Intensity level picker |
| 7 | `src/components/Fitness/NumpadSheet.js` | Numeric keypad bottom sheet |
| 8 | `src/components/Fitness/OutcomeCard.js` | Workout outcome summary card |

---

## 5. Constants / Data Files

| # | File | Contents |
|---|------|----------|
| 1 | `src/constants/colors.js` | Complete color palette (primary, accent, semantic colors, overlays) |
| 2 | `src/constants/fonts.js` | Font families (System/Roboto), font sizes (xs-xlarge), Typography presets |
| 3 | `src/constants/images.js` | Image asset references (Ayu logo) |
| 4 | `src/constants/authData.js` | Authentication-related mock data |
| 5 | `src/constants/profileData.js` | User profile mock data |
| 6 | `src/constants/fitnessData.js` | Fitness categories, exercises, workout data |
| 7 | `src/constants/strengthData.js` | Strength training exercises, muscle groups |
| 8 | `src/constants/movementData.js` | Movement/cardio activity types and data |
| 9 | `src/constants/sleepData.js` | Sleep tracking mock data |
| 10 | `src/constants/foodData.js` | Food items, nutritional data |
| 11 | `src/constants/cycleData.js` | Menstrual cycle tracking data |
| 12 | `src/constants/medicationData.js` | Medication list and schedule data |
| 13 | `src/constants/lifestyleData.js` | Lifestyle habits and activities data |
| 14 | `src/constants/goalsData.js` | Health goals and targets |
| 15 | `src/constants/sosData.js` | Emergency SOS contacts and configuration |
| 16 | `src/constants/subscriptionData.js` | Subscription plans and pricing |
| 17 | `src/constants/referralData.js` | Referral program data |
| 18 | `src/constants/healthRewardsData.js` | Health rewards/points system data |
| 19 | `src/constants/serviceRecordsData.js` | Service records (doctors, labs, etc.) mock data |
| 20 | `src/constants/consentData.js` | Consent management options |
| 21 | `src/constants/consentAgreementData.js` | Consent agreement text content |
| 22 | `src/constants/accessLogData.js` | Data access audit log entries |
| 23 | `src/constants/termsData.js` | Terms of service content |
| 24 | `src/constants/privacyPolicyData.js` | Privacy policy content |
| 25 | `src/constants/supportData.js` | Help & support FAQ and contact data |

---

## 6. Navigation Map

### Auth Flow (AuthNavigator)

```
Splash (fade)
  └── Welcome
        ├── [Sign Up] Phone -> OTP -> Personal -> Health -> Medications
        │     -> Plan -> Payment -> PaymentMethod -> PaymentProcessing (fade)
        │     -> Agreement -> Done (fade)
        │
        ├── [Legal] Terms | Consent | PrivacyPolicy
        │
        └── [Login] LoginHub
              ├── LoginBio (biometric) ─────┐
              ├── LoginPin (4-6 digit PIN) ─┤── LoginSuccess (fade)
              ├── LoginPassword ────────────┘
              │
              └── [Forgot] ForgotStep0 -> ForgotStep1 -> ForgotStep2
                    ├── ForgotNewPassword ──┐
                    └── ForgotNewPin ───────┘── ForgotDone (fade)
```

### Main App Tabs (BottomTabNavigator)

| Tab | Label | Screen | Icon |
|-----|-------|--------|------|
| 1 | Home | HomeScreen | `fhome.png` |
| 2 | Tracking | TrackingScreen | `ftracking.png` |
| 3 | Records | RecordsScreen | `frecords.png` |
| 4 | Progress | ProgressScreen | `fprogress.png` |
| 5 | Ayu Intel | HealthCoachScreen | `ayu-ai.png` |

### All Stack Screen Routes (AppNavigator)

| Route Name | Screen | Animation |
|-----------|--------|-----------|
| MainTabs | BottomTabNavigator | default |
| ViewAll | ViewAllScreen | slide_from_right |
| Profile | ProfileScreen | slide_from_right |
| HPSReport | HPSReportScreen | slide_from_right |
| AyuChat | AyuChatScreen | slide_from_bottom |
| CapabilityDetail | CapabilityDetailScreen | slide_from_right |
| CoachConsultation | CoachConsultationScreen | slide_from_right |
| CoachSpecialistList | CoachSpecialistListScreen | slide_from_right |
| CoachProfile | CoachProfileScreen | slide_from_right |
| CoachSessionDetail | CoachSessionDetailScreen | slide_from_right |
| CounsellingConsultation | CounsellingConsultationScreen | slide_from_right |
| CounsellingSpecialistList | CounsellingSpecialistListScreen | slide_from_right |
| CounsellingProfile | CounsellingProfileScreen | slide_from_right |
| CounsellingSessionDetail | CounsellingSessionDetailScreen | slide_from_right |
| NurseConsultation | NurseConsultationScreen | slide_from_right |
| NurseSpecialistList | NurseSpecialistListScreen | slide_from_right |
| NurseProfile | NurseProfileScreen | slide_from_right |
| NurseSessionDetail | NurseSessionDetailScreen | slide_from_right |
| PhysioConsultation | PhysioConsultationScreen | slide_from_right |
| PhysioSpecialistList | PhysioSpecialistListScreen | slide_from_right |
| PhysioProfile | PhysioProfileScreen | slide_from_right |
| PhysioSessionDetail | PhysioSessionDetailScreen | slide_from_right |
| DoctorConsultation | DoctorConsultationScreen | slide_from_right |
| DoctorSpecialistList | DoctorSpecialistListScreen | slide_from_right |
| DoctorProfile | DoctorProfileScreen | slide_from_right |
| ReviewAppointment | ReviewAppointmentScreen | slide_from_right |
| PatientDetails | PatientDetailsScreen | slide_from_right |
| PaymentSuccess | PaymentSuccessScreen | fade |
| AppointmentConfirmed | AppointmentConfirmedScreen | slide_from_right |
| DoctorSessionDetail | DoctorSessionDetailScreen | slide_from_right |
| HealthInsurance | HealthInsuranceScreen | slide_from_right |
| InsurancePlanDetail | InsurancePlanDetailScreen | slide_from_right |
| InsuranceNomineeDetails | InsuranceNomineeDetailsScreen | slide_from_right |
| InsuranceDocumentVerification | InsuranceDocumentVerificationScreen | slide_from_right |
| InsurancePaymentSuccess | InsurancePaymentSuccessScreen | fade |
| HospitalList | HospitalListScreen | slide_from_right |
| HealthGadgets | HealthGadgetsScreen | slide_from_right |
| TelemedicineHome | TelemedicineHomeScreen | slide_from_right |
| TelemedicineSpecialistList | TelemedicineSpecialistListScreen | slide_from_right |
| TelemedicineProfile | TelemedicineProfileScreen | slide_from_right |
| WellnessCenter | WellnessCenterScreen | slide_from_right |
| WellnessDetail | WellnessDetailScreen | slide_from_right |
| WellnessBooking | WellnessBookingScreen | slide_from_right |
| WellnessSessionDetail | WellnessSessionDetailScreen | slide_from_right |
| LabHome | LabHomeScreen | slide_from_right |
| LabTestList | LabTestListScreen | slide_from_right |
| LabTestSearch | LabTestSearchScreen | slide_from_right |
| LabFilter | LabFilterScreen | slide_from_right |
| LabCart | LabCartScreen | slide_from_right |
| LabTestDetail | LabTestDetailScreen | slide_from_right |
| LabPaymentSuccess | LabPaymentSuccessScreen | fade |
| LabOrderPlaced | LabOrderPlacedScreen | slide_from_right |
| MedicineHome | MedicineHomeScreen | slide_from_right |
| MedicineList | MedicineListScreen | slide_from_right |
| MedicineDetail | MedicineDetailScreen | slide_from_right |
| MedicineSearch | MedicineSearchScreen | slide_from_right |
| MedicineCart | MedicineCartScreen | slide_from_right |
| MedicinePaymentSuccess | MedicinePaymentSuccessScreen | fade |
| MedicineOrderPlaced | MedicineOrderPlacedScreen | slide_from_right |
| VaccinationLog | VaccinationLogScreen | slide_from_right |
| ECGLog | ECGLogScreen | slide_from_right |
| MSKLog | MSKLogScreen | slide_from_right |
| TempLog | TempLogScreen | slide_from_right |
| MigraineLog | MigraineLogScreen | slide_from_right |
| AsthmaLog | AsthmaLogScreen | slide_from_right |
| WeightLog | WeightLogScreen | slide_from_right |
| GlucoseLog | GlucoseLogScreen | slide_from_right |
| BPLog | BPLogScreen | slide_from_right |
| MenstrualLog | MenstrualLogScreen | slide_from_right |
| SymptomsLog | SymptomsLogScreen | slide_from_right |
| HeartRateLog | HeartRateLogScreen | slide_from_right |
| MoodLog | MoodLogScreen | slide_from_right |
| AnemiaLog | AnemiaLogScreen | slide_from_right |
| FitnessTracker | FitnessTrackerScreen | slide_from_right |
| FitnessCategory | FitnessCategoryScreen | slide_from_right |
| StrengthTraining | StrengthTrainingScreen | slide_from_right |
| MovementTracker | MovementScreen | slide_from_right |
| LifestyleActivity | LifestyleScreen | slide_from_right |
| SleepTracker | SleepScreen | slide_from_right |
| FoodTracker | FoodScreen | slide_from_right |
| MedicationTracker | MedicationScreen | slide_from_right |
| MedDetail | MedDetailScreen | slide_from_right |
| CycleTracker | CycleScreen | slide_from_right |
| EditProfile | EditProfileScreen | slide_from_right |
| Goals | GoalsScreen | slide_from_right |
| PersonalInfo | PersonalInfoScreen | slide_from_right |
| ContactDetails | ContactScreen | slide_from_right |
| Preferences | PreferencesScreen | slide_from_right |
| HealthProfile | HealthScreen | slide_from_right |
| FamilyMembers | FamilyMembersScreen | slide_from_right |
| ConnectedDevices | ConnectedDevicesScreen | slide_from_right |
| ConsentManager | ConsentManagerScreen | slide_from_right |
| AccessLog | AccessLogScreen | slide_from_right |
| DataTransparency | DataTransparencyScreen | slide_from_right |
| TrustReport | TrustReportScreen | slide_from_right |
| Referral | ReferralScreen | slide_from_right |
| HealthRewards | HealthRewardsScreen | slide_from_right |
| Security | SecurityScreen | slide_from_right |
| PrivacyPolicy | PrivacyPolicyScreen | slide_from_right |
| Subscription | SubscriptionScreen | slide_from_right |
| TermsOfService | TermsOfServiceScreen | slide_from_right |
| ConsentAgreement | ConsentAgreementScreen | slide_from_right |
| HelpSupport | HelpSupportScreen | slide_from_right |
| EmergencySOS | EmergencySOSScreen | slide_from_right |

---

## 7. Feature Documentation

### 7.1 Authentication

**Signup Flow (12 steps):**
1. Phone number entry with country code
2. OTP verification (SMS)
3. Personal information (name, DOB, gender)
4. Health profile (conditions, allergies)
5. Current medications
6. Subscription plan selection
7. Payment summary
8. Payment method (card, UPI, etc.)
9. Payment processing (animated)
10. Agreement acceptance (Terms, Consent, Privacy)
11. Account creation completion

**Login Methods:**
- **Biometric** (LoginBio) -- Fingerprint/Face ID
- **PIN** (LoginPin) -- 4-6 digit numeric PIN
- **Password** (LoginPassword) -- Traditional password

**Forgot Password/PIN Flow:**
1. Choose what to reset (password or PIN)
2. Identity verification step 1
3. Identity verification step 2
4. Set new password OR new PIN
5. Reset confirmation

### 7.2 Home Dashboard

The HomeScreen is composed of these component sections:
- **HeroSection** -- HPS score display, user greeting, quick stats
- **ActiveConditionsCard** -- Current health conditions with severity
- **QuickActions** -- Grid of quick action buttons (log vitals, book appointment, etc.)
- **ForYouCarousel** -- Personalized health content recommendations
- **HealthServices** -- Grid of 12 health services (Doctor, Lab, Medicine, etc.)
- **AyuBanner** -- AI health coach promotional banner
- **OrganHealthGrid** -- Organ-by-organ health status
- **TestReadinessCard** -- Upcoming test preparation status

### 7.3 Health Tracking

**14 Vital/Symptom Log Types (each with Auto + Manual views):**

| # | Vital | Route | Auto View | Manual View |
|---|-------|-------|-----------|-------------|
| 1 | Blood Pressure | BPLog | BPAutoView | BPManualView |
| 2 | Heart Rate | HeartRateLog | HRAutoView | HRManualView |
| 3 | Blood Glucose | GlucoseLog | GlucoseAutoView | GlucoseManualView |
| 4 | Weight | WeightLog | WeightAutoView | WeightManualView |
| 5 | Body Temperature | TempLog | TempAutoView | TempManualView |
| 6 | ECG | ECGLog | ECGAutoView | ECGManualView |
| 7 | Mood | MoodLog | MoodAutoView | MoodManualView |
| 8 | Migraine | MigraineLog | MigraineAutoView | MigraineManualView |
| 9 | Asthma | AsthmaLog | AsthmaAutoView | AsthmaManualView |
| 10 | Anemia | AnemiaLog | AnemiaAutoView | AnemiaManualView |
| 11 | MSK Pain | MSKLog | MSKAutoView | MSKManualView |
| 12 | Menstrual | MenstrualLog | -- | -- |
| 13 | Symptoms | SymptomsLog | -- | -- |
| 14 | Vaccination | VaccinationLog | VaccLogView, VaccAefiView, VaccTravelCertsView | -- |

**7 Fitness Tracker Categories:**

| # | Category | Route | Tabs |
|---|----------|-------|------|
| 1 | Strength Training | StrengthTraining | DailyLog, Planner, History, Summary + AyuOverlay, RestTimerOverlay |
| 2 | Movement/Cardio | MovementTracker | Dashboard, LogActivity, Trends, Connect |
| 3 | Sleep | SleepTracker | Tonight, Morning, Trends |
| 4 | Food/Nutrition | FoodTracker | Today, AddFood, Nutrients, Trends |
| 5 | Menstrual Cycle | CycleTracker | Wheel, Calendar, DailyLog, History |
| 6 | Medication | MedicationTracker | Today, MyMeds, Adherence, Ayu |
| 7 | Lifestyle | LifestyleActivity | Log, Analytics |

**Supporting Fitness Components:**
- StrengthFlow -- Manages workout flow state
- SubcatGrid -- Sub-category selection (exercise types)
- CardioExtras, MindBodyExtras -- Category-specific input fields
- DurationPicker, IntensityPicker -- Input pickers
- NumpadSheet -- Numeric input bottom sheet
- OutcomeCard -- Workout result summary

### 7.4 Health Records

Three main record tabs:
1. **VisitSummaryTab** -- Doctor visit summaries with sub-tabs: Summary, Vitals, Findings, Investigations, Prescription, Follow-Up; organized by doctor or chronologically
2. **IndividualRecordsTab** -- Individual health record categories:
   - Lab Reports (AllReports, Biomarkers, BiomarkerDetail, ByLab, SmartView, TraditionalView)
   - Imaging (All, ByFacility, X-ray [5 sub-tabs], Echo [4 sub-tabs], USG [4 sub-tabs])
   - Prescriptions (Current, History, ByDoctor, Interactions, plus Med-specific: DrugDetails, History, Adherence, Symptoms, Visits)
   - Symptoms (DayByDay, Patterns, Triggers, Correlations, VsLastMonth, DoctorNotes)
   - Vaccination (Overview, Schedule, Administration, SideEffects, Certificate, HowItWorks)
   - Insurance (Overview, Benefits, Claims, Premium, Documents, Analytics)
   - Lifestyle (Summary, Activity, Food, Sleep, Medication)
   - Other Logs (BMI Tracker, Growth Tracker, Add Log)
3. **ServiceRecordsTab** -- Service-related records

### 7.5 Progress & Analytics

- **HPSScoreTab** -- Health Performance Score with trend visualization
- **BiomarkersTab** -- Key biomarker tracking with trends
- **ConditionsTab** -- Active condition monitoring
- **LifestyleTab** -- Lifestyle analytics dashboard
- **MedicationTab** -- Medication adherence analytics
- **HPSReportScreen** -- Detailed HPS breakdown report

### 7.6 Health Coach / Ayu Intel

- **HealthCoachScreen** -- Main Ayu Intel hub with capability cards
- **CapabilityDetailScreen** -- Detailed view of each AI capability
- **AyuChatScreen** -- Chat interface with Ayu AI (slide_from_bottom animation)

### 7.7 Health Services (12 Service Types)

| # | Service | Screens | Flow |
|---|---------|---------|------|
| 1 | **Doctor** | 8 screens | Consultation -> SpecialistList -> Profile -> ReviewAppointment -> PatientDetails -> PaymentSuccess -> AppointmentConfirmed; SessionDetail |
| 2 | **Coach** | 4 screens | Consultation -> SpecialistList -> Profile -> SessionDetail |
| 3 | **Counselling** | 4 screens | Consultation -> SpecialistList -> Profile -> SessionDetail |
| 4 | **Nurse** | 4 screens | Consultation -> SpecialistList -> Profile -> SessionDetail |
| 5 | **Physiotherapy** | 4 screens | Consultation -> SpecialistList -> Profile -> SessionDetail |
| 6 | **Lab Tests** | 8 screens | Home -> TestList -> TestSearch -> Filter -> TestDetail -> Cart -> PaymentSuccess -> OrderPlaced |
| 7 | **Medicine** | 7 screens | Home -> List -> Search -> Detail -> Cart -> PaymentSuccess -> OrderPlaced |
| 8 | **Insurance** | 5 screens | HealthInsurance -> PlanDetail -> NomineeDetails -> DocumentVerification -> PaymentSuccess |
| 9 | **Telemedicine** | 3 screens | Home -> SpecialistList -> Profile |
| 10 | **Wellness** | 4 screens | Center -> Detail -> Booking -> SessionDetail |
| 11 | **Hospital** | 1 screen | HospitalList |
| 12 | **Gadgets** | 1 screen | HealthGadgets |

### 7.8 Profile & Settings

**Profile Hub** (ProfileScreen in Home/) provides access to:

| Category | Screens | Description |
|----------|---------|-------------|
| Account | EditProfile, PersonalInfo, ContactDetails, Preferences, HealthProfile | Personal data management |
| Family | FamilyMembers | Family member profiles |
| Devices | ConnectedDevices | Health device connections |
| Goals | Goals | Health goals setting |
| Data & Privacy | ConsentManager, AccessLog, DataTransparency, ConsentAgreement | Data governance |
| Trust | TrustReport | Data trust scoring |
| Rewards | HealthRewards, Referral | Gamification and referrals |
| Security | Security | Password, PIN, biometric settings |
| Legal | PrivacyPolicy, TermsOfService | Legal documents |
| Billing | Subscription | Subscription management |
| Support | HelpSupport | FAQs and contact |
| Emergency | EmergencySOS | Emergency contacts and SOS trigger |

**Edit Profile Tabs (18 sub-tabs):**
Overview, Personal, Contact, Health, BodyComp, Lifestyle, FamilyHistory, Insurance, Dependents, Dental, Vision, Reproductive, Genetic, Environment, DigitalHealth, Supplements, Preferences, Security

### 7.9 Emergency SOS

Dedicated `EmergencySOSScreen` with SOS contacts configuration, one-tap emergency activation, and emergency information display. Profile section includes a `SOSCard` component for quick access.

### 7.10 Subscription & Billing

- `PlanScreen` (Auth) -- Plan selection during signup
- `PaymentScreen` / `PaymentMethodScreen` / `PaymentProcessingScreen` (Auth) -- Payment during signup
- `SubscriptionScreen` (Profile) -- Post-signup subscription management
- `BillingCard` (Profile component) -- Billing summary in profile

---

## 8. Design System

### Color Palette

#### Primary Colors

| Name | Hex | Usage |
|------|-----|-------|
| `primary` | `#0a5c47` | Primary brand color, active tab, key CTAs |
| `accent` | `#1D9E75` | Accent highlights, focused input borders |
| `lightGreen` | `#5DCAA5` | Light accent variant |
| `paleGreen` | `#9FE1CB` | Pale accent, progress indicators |
| `background` | `#f0f7f4` | App background |
| `white` | `#FFFFFF` | Card backgrounds, text on dark |
| `black` | `#000000` | Max contrast text |

#### Text Colors

| Name | Hex | Usage |
|------|-----|-------|
| `textPrimary` | `#1a1a1a` | Primary body text |
| `textSecondary` | `#6b7280` | Secondary/muted text |
| `textTertiary` | `#9ca3af` | Placeholder, hints, labels |
| `borderLight` | `#e5e7eb` | Card borders, dividers |

#### Semantic Colors

| Category | Background | Text | Dark | Base |
|----------|-----------|------|------|------|
| **Red** (danger/error) | `#FCEBEB` | `#A32D2D` | `#791F1F` | `#E24B4A` |
| **Amber** (warning) | `#FAEEDA` | `#854F0B` | `#633806` | `#BA7517` |
| **Teal** (success) | `#E1F5EE` | `#085041` | `#0F6E56` | `#1D9E75` |
| **Blue** (info) | `#E6F1FB` | `#0C447C` | -- | `#378ADD` |
| **Purple** (special) | `#EEEDFE` | `#3C3489` | `#26215C` | `#6C63FF` |
| **Pink** | `#FBEAF0` | -- | -- | -- |

#### Overlay Colors

| Name | Value | Usage |
|------|-------|-------|
| `heroOverlay` | `rgba(255,255,255,0.12)` | Hero card overlays |
| `heroBorder` | `rgba(255,255,255,0.18)` | Hero card borders |
| `heroTextMuted` | `rgba(255,255,255,0.6)` | Muted hero text |
| `heroTextSubtle` | `rgba(255,255,255,0.5)` | Subtle hero text |
| `badgeBg` | `rgba(255,255,255,0.1)` | Badge backgrounds |
| `scoreBg` | `rgba(255,255,255,0.15)` | Score card backgrounds |
| `statBg` | `rgba(255,255,255,0.1)` | Stat card backgrounds |

### Typography System

#### Font Families

| Platform | Font |
|----------|------|
| iOS | System (San Francisco) |
| Android | Roboto |

Weights used: `regular`, `medium`, `bold` (all mapped to platform fonts)

#### Font Size Scale (via `moderateScale`)

| Token | Base Size |
|-------|-----------|
| `xs` | `ms(7)` |
| `sm` | `ms(8)` |
| `caption` | `ms(9)` |
| `small` | `ms(10)` |
| `body` | `ms(12)` |
| `title` | `ms(14)` |
| `heading` | `ms(16)` |
| `large` | `ms(18)` |
| `xlarge` | `ms(22)` |

#### Typography Presets

| Variant | Font Size | Weight | Line Height | Usage |
|---------|-----------|--------|-------------|-------|
| `screenName` | `ms(19)` | 800 | `ms(24)` | Screen titles ("Progress", "Records") |
| `header` | `ms(16)` | 600 | `ms(21)` | Section headers |
| `subtitle` | `ms(12)` | 400 | `ms(17)` | Subtitles under headers |
| `sectionTitle` | `ms(13)` | 700 | `ms(17)` | Section labels (uppercase, letter-spacing: 0.3) |
| `body` | `ms(13)` | 400 | `ms(19)` | Regular body text |
| `bodyBold` | `ms(13)` | 500 | `ms(19)` | Bold body text |
| `caption` | `ms(11)` | 400 | `ms(15)` | Helper/caption text |
| `small` | `ms(10)` | 400 | `ms(14)` | Badges, labels |
| `subtext` | `ms(10)` | 400 | `ms(14)` | Muted info text |

### Spacing System

Uses `react-native-size-matters` throughout:
- `scale(n)` / `s(n)` -- Horizontal spacing
- `verticalScale(n)` / `vs(n)` -- Vertical spacing
- `moderateScale(n)` / `ms(n)` -- Font sizes, border radius, icon sizes

Common spacing values:
- Card padding: `s(12)` - `s(16)` horizontal, `vs(10)` - `vs(14)` vertical
- Section margins: `vs(9)` - `vs(14)`
- Border radius: `ms(10)` - `ms(14)`
- Input height: `vs(38)`

### Component Patterns

- **Cards**: White background, `borderRadius: ms(10)`, `borderWidth: 1`, `borderColor: Colors.borderLight`
- **Headers**: `headerShown: false` on all navigators (custom headers per screen)
- **Buttons**: TouchableOpacity with `activeOpacity: 0.7`
- **Inputs**: Rounded borders with focus state (accent border), error state (red border)
- **Bottom Tab**: Custom tab bar with active state background `rgba(10, 92, 71, 0.18)`, icon size `ms(28)`

---

## 9. Reusable Components API

### AppText

**File:** `src/components/shared/AppText.js`

Global text component with typography variant system.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `variant` | `string` | `'body'` | Typography variant: `screenName`, `header`, `subtitle`, `sectionTitle`, `body`, `bodyBold`, `caption`, `small`, `subtext` |
| `color` | `string` | `Colors.textPrimary` | Text color override |
| `style` | `object/array` | -- | Additional style overrides |
| `children` | `node` | -- | Text content |
| `...rest` | -- | -- | All standard React Native `Text` props (`numberOfLines`, etc.) |

**Smart behavior:** If a custom `style.fontSize` exceeds the variant's `lineHeight`, the variant's `lineHeight` is removed to prevent clipping.

```jsx
<AppText variant="screenName" color={Colors.white}>Progress</AppText>
<AppText variant="header">Daily Trackers</AppText>
<AppText variant="caption" color={Colors.textTertiary}>Helper text</AppText>
```

### AppTextField

**File:** `src/components/shared/AppTextField.js`

Styled text input with label, hint, error states, and icon support.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Uppercase label above the input |
| `value` | `string` | -- | Input value |
| `onChangeText` | `function` | -- | Change handler |
| `placeholder` | `string` | -- | Placeholder text |
| `hint` | `string` | -- | Helper text below input |
| `error` | `string` | -- | Error message (red, replaces hint) |
| `readOnly` | `boolean` | `false` | Disables editing, gray background |
| `multiline` | `boolean` | `false` | Enables multiline with min-height |
| `keyboardType` | `string` | -- | Keyboard type |
| `secureTextEntry` | `boolean` | `false` | Password masking |
| `icon` | `string` | -- | Emoji/text icon on the left |
| `rightText` | `string` | -- | Text on the right side of input |

**Border states:** Default (`borderLight`), Focused (`accent`), Error (`red`)

### AppDropdown

**File:** `src/components/shared/AppDropdown.js`

Inline dropdown picker with absolute-positioned options list.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `label` | `string` | -- | Uppercase label above trigger |
| `value` | `string` | -- | Currently selected value |
| `options` | `string[]` | `[]` | Array of option strings |
| `onSelect` | `function` | -- | Selection handler `(option) => void` |
| `placeholder` | `string` | `'Select an option'` | Placeholder when no value |
| `hint` | `string` | -- | Helper text below dropdown |

### Icon

**File:** `src/components/shared/Icons.js`

Universal icon component supporting 12 vector icon families.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `family` | `string` | `'Ionicons'` | Icon family name |
| `name` | `string` | -- | Icon name within the family |
| `size` | `number` | `20` | Icon size (auto-scaled via `ms()`) |
| `color` | `string` | `Colors.textPrimary` | Icon color |

**Available families:** `Ionicons`, `MaterialCommunityIcons`, `Feather`, `FontAwesome`, `FontAwesome5`, `MaterialIcons`, `Entypo`, `AntDesign`, `Octicons`, `SimpleLineIcons`, `EvilIcons`, `Foundation`

Individual families are also exported for direct use:
```jsx
import Icon, { Feather, Ionicons } from '../shared/Icons';
```

### SectionTitle

**File:** `src/components/shared/SectionTitle.js`

Section header row with optional link.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `title` | `string` | -- | Section title text (sectionTitle variant) |
| `linkText` | `string` | -- | Optional link text on the right |
| `onLinkPress` | `function` | -- | Link press handler |

### Emoji

**File:** `src/components/shared/Emoji.js`

Cross-platform emoji renderer.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `icon` | `string` | -- | Emoji character |
| `size` | `number` | `16` | Emoji font size (scaled via `ms()`) |

### FilterBottomSheet

**File:** `src/components/shared/FilterBottomSheet.js`

Modal bottom sheet with multi-select filter chip sections.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `visible` | `boolean` | -- | Controls modal visibility |
| `onClose` | `function` | -- | Close handler |
| `onApply` | `function` | -- | Apply handler with selections object |
| `filterSections` | `array` | `[]` | Array of `{ key, title, options, multi }` |

### MiniBars

**File:** `src/components/shared/MiniBars.js`

Mini bar chart for inline data visualization.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `array` | -- | Array of `{ height, color, day }` objects |

### StandaloneBottomBar

**File:** `src/components/shared/StandaloneBottomBar.js`

Reusable bottom navigation bar for health service screens.

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `activeTab` | `string` | `'main'` | Currently active tab key |
| `onTabChange` | `function` | -- | Tab change handler `(tabKey) => void` |
| `mainLabel` | `string` | `'Doctors'` | Label for the main tab |
| `mainIcon` | `string` | `'medkit-outline'` | Ionicon name for main tab |
| `mainScreen` | `string` | `'DoctorConsultation'` | Navigation target for main tab |

Fixed tabs: Back, [Main], Appointments, More

---

## 10. Dependencies

### Production Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `react` | 18.3.1 | Core React library |
| `react-native` | 0.75.4 | Mobile framework |
| `@react-navigation/native` | ^6.1.18 | Navigation framework core |
| `@react-navigation/native-stack` | ^6.11.0 | Native stack navigator |
| `@react-navigation/bottom-tabs` | ^6.6.1 | Bottom tab navigator |
| `react-native-screens` | ^3.34.0 | Native navigation screen containers |
| `react-native-safe-area-context` | ^4.10.9 | Safe area insets handling |
| `react-native-vector-icons` | ^10.3.0 | Icon library (12 families) |
| `react-native-svg` | ^15.15.4 | SVG rendering support |
| `react-native-size-matters` | ^0.4.2 | Responsive sizing utilities |
| `react-native-fs` | ^2.20.0 | File system access |
| `install` | ^0.13.0 | (Likely accidental dependency) |

### Dev Dependencies

| Package | Version | Purpose |
|---------|---------|---------|
| `@babel/core` | ^7.20.0 | Babel transpiler core |
| `@babel/preset-env` | ^7.20.0 | Babel environment preset |
| `@babel/runtime` | ^7.20.0 | Babel runtime helpers |
| `@react-native/babel-preset` | 0.75.4 | React Native Babel preset |
| `@react-native/eslint-config` | 0.75.4 | React Native ESLint rules |
| `@react-native/gradle-plugin` | ^0.75.4 | Android Gradle integration |
| `@react-native/metro-config` | 0.75.4 | Metro bundler configuration |
| `babel-jest` | ^29.6.3 | Babel integration for Jest |
| `eslint` | ^8.19.0 | JavaScript linter |
| `jest` | ^29.6.3 | Testing framework |
| `prettier` | 2.8.8 | Code formatter |
| `react-test-renderer` | 18.3.1 | React component testing |

### Engine Requirements

- Node.js >= 18

---

## 11. Data Flow

### Authentication State

```
App.jsx
├── AuthContext = createContext()
├── useState: isLoggedIn (boolean)
└── AuthContext.Provider value={{ isLoggedIn, setIsLoggedIn }}
    └── NavigationContainer
        ├── !isLoggedIn → AuthNavigator
        └── isLoggedIn → AppNavigator
```

- Login screens call `setIsLoggedIn(true)` to switch to AppNavigator
- No persistent auth token storage implemented (UI prototype stage)

### Data Sources

All data is currently sourced from **constants files** (mock data):
- Screens import data directly from `src/constants/*.js`
- No REST API calls, no backend integration
- No Redux, MobX, or other state management library
- Each screen manages its own local state via `useState`

### Navigation Parameter Passing

Data flows between screens via React Navigation params:

```jsx
// Sending
navigation.navigate('DoctorProfile', { doctorId: 123, specialty: 'Cardiology' });

// Receiving
const { doctorId, specialty } = route.params;
```

Common param patterns:
- Service screens pass provider/item IDs between list -> detail -> booking
- Tracking screens pass vital type, date, and reading data
- Records screens pass record type and ID for detail views

---

## 12. File Count Summary

| Category | Count |
|----------|-------|
| **Screen Files** | **178** |
| -- Auth Screens | 26 |
| -- Home Screens | 3 |
| -- Tracking Screens (Symptom Logs) | 41 |
| -- Tracking Screens (Fitness) | 9 |
| -- Records Screens | 2 |
| -- Progress Screens | 2 |
| -- Health Coach Screens | 3 |
| -- Health Services Screens | 44 |
| -- Profile Screens (main) | 22 |
| -- Profile Tabs | 18 |
| -- Tracking Hub | 1 |
| **Component Files** | **138** |
| -- Shared/Reusable | 9 |
| -- Home | 8 |
| -- Profile | 8 |
| -- Tracking | 6 |
| -- Progress | 5 |
| -- Records | 49 |
| -- Fitness | 36 |
| **Constants/Data Files** | **25** |
| **Navigation Files** | **3** |
| **Root File (App.jsx)** | **1** |
| | |
| **Total Source Files (.js/.jsx)** | **344** |
| **Total Registered Navigation Routes** | **~95** |
| **Total Health Service Types** | **12** |
| **Total Vital Log Types** | **14** |
| **Total Fitness Tracker Categories** | **7** |
| **Total Profile Edit Tabs** | **18** |

---

*Generated for the TrustLife-V1 project at `c:\techland\TrustLife-V1`*
