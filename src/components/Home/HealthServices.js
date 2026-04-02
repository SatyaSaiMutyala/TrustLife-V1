import React from 'react';
import {View, Image, StyleSheet, TouchableOpacity, useWindowDimensions} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import SectionTitle from '../shared/SectionTitle';
import AppText from '../shared/AppText';

const services = [
  {image: require('../../assets/img/c-lab.png'), label: 'Home lab', bg: Colors.tealBg, screen: 'LabHome'},
  {image: require('../../assets/img/c-doctor.png'), label: 'Doctor', bg: Colors.blueBg, screen: 'DoctorConsultation'},
  {image: require('../../assets/img/c-medicines.png'), label: 'Medicines', bg: Colors.purpleBg, screen: 'MedicineHome'},
  {image: require('../../assets/img/c-tele.png'), label: 'Tele\u00ADmedicine', bg: Colors.amberBg, screen: 'TelemedicineHome'},
  {image: require('../../assets/img/c-coach.png'), label: 'Coach', bg: Colors.tealBg, screen: 'CoachConsultation'},
  {image: require('../../assets/img/c-counselling.png'), label: 'Counselling', bg: Colors.pinkBg, screen: 'CounsellingConsultation'},
  {image: require('../../assets/img/c-nurse.png'), label: 'Nurse', bg: Colors.amberBg, screen: 'NurseConsultation'},
  {image: require('../../assets/img/c-physiotherapy.png'), label: 'Physio\u00ADtherapy', bg: Colors.blueBg, screen: 'PhysioConsultation'},
  {image: require('../../assets/img/c-hospital.png'), label: 'Hospitals', bg: Colors.redBg, screen: 'HospitalList'},
  {image: require('../../assets/img/c-wellness.png'), label: 'Wellness\ncentre', bg: Colors.tealBg, screen: 'WellnessCenter'},
  {image: require('../../assets/img/c-healthinsurance.png'), label: 'Health\ninsurance', bg: Colors.purpleBg, screen: 'HealthInsurance'},
  {image: require('../../assets/img/c-gadgets.png'), label: 'Health\ngadgets', bg: Colors.amberBg, screen: 'HealthGadgets'},
];

const HealthServices = () => {
  const navigation = useNavigation();
  const {width} = useWindowDimensions();
  const btnW = (width - s(12) * 2 - s(7) * 3) / 4;

  const handlePress = (svc) => {
    if (svc.screen) {
      navigation.navigate(svc.screen);
    }
  };

  return (
    <View>
      <SectionTitle title="Health Services" linkText="Explore ›" />
      <View style={styles.grid}>
        {services.map((svc, i) => (
          <TouchableOpacity key={i} style={[styles.btn, {width: btnW}]} onPress={() => handlePress(svc)}>
            <View style={styles.iconWrap}>
              <Image source={svc.image} style={styles.svcImg} resizeMode="contain" />
            </View>
            <AppText variant="small" color={Colors.black} style={styles.label}>{svc.label}</AppText>
          </TouchableOpacity>
        ))}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  grid: {flexDirection: 'row', flexWrap: 'wrap', gap: ms(7), marginBottom: vs(20), marginTop: vs(8)},
  btn: {backgroundColor: Colors.white, borderRadius: ms(13), borderWidth: 0.5, borderColor: Colors.borderLight, paddingVertical: vs(11), paddingHorizontal: s(5), alignItems: 'center', gap: vs(5)},
  iconWrap: {width: ms(36), height: ms(36), alignItems: 'center', justifyContent: 'center'},
  svcImg: {width: ms(32), height: ms(32)},
  label: {textAlign: 'center', lineHeight: ms(12)},
});

export default HealthServices;
