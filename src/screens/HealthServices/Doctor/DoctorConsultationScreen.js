import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';
import StandaloneBottomBar from '../../../components/shared/StandaloneBottomBar';

const organTypes = [
  {id: '1', name: 'Heart', image: require('../../../assets/img/human-heart.png')},
  {id: '2', name: 'Brain', image: require('../../../assets/img/human-brain.png')},
  {id: '3', name: 'Kidneys', image: require('../../../assets/img/human-kidneys.png')},
  {id: '4', name: 'Liver', image: require('../../../assets/img/human-liver.png')},
  {id: '5', name: 'Lungs', image: require('../../../assets/img/human-lungs.png')},
  {id: '6', name: 'Pancreas', image: require('../../../assets/img/human-pancreas.png')},
  {id: '7', name: 'Gut', image: require('../../../assets/img/human-gut.png')},
  {id: '8', name: 'Skin', image: require('../../../assets/img/human-skin.png')},
  {id: '9', name: 'Eyes', image: require('../../../assets/img/human-eye.png')},
  {id: '10', name: 'Muscle', image: require('../../../assets/img/human-muscle.png')},
  {id: '11', name: 'Thyroid', image: require('../../../assets/img/human-thyroid.png')},
  {id: '12', name: 'Thymus', image: require('../../../assets/img/human-thymus.png')},
  {id: '13', name: 'Vascular', image: require('../../../assets/img/human-vascular.png')},
  {id: '14', name: 'Reproductive', image: require('../../../assets/img/human-reproductive.png')},
];

const mockSessions = [
  {
    id: 'DS001',
    doctorName: 'Dr. Priya Sharma',
    specialty: 'Cardiologist',
    date: '2026-03-25',
    time: '10:00 AM',
    status: 'Confirmed',
    sessionType: 'Video Consultation',
    amount: 600,
    paymentMethod: 'UPI',
    transactionId: 'TXN20260325201',
    address: 'Online',
    rating: 4.8,
  },
  {
    id: 'DS002',
    doctorName: 'Dr. Rahul Mehra',
    specialty: 'Neurologist',
    date: '2026-03-20',
    time: '03:00 PM',
    status: 'Completed',
    sessionType: 'In-Person',
    amount: 800,
    paymentMethod: 'Card',
    transactionId: 'TXN20260320202',
    address: 'Apollo Clinic, Koramangala, Bangalore',
    rating: 4.5,
  },
  {
    id: 'DS003',
    doctorName: 'Dr. Anita Desai',
    specialty: 'Dermatologist',
    date: '2026-03-18',
    time: '11:30 AM',
    status: 'Cancelled',
    sessionType: 'Video Consultation',
    amount: 500,
    paymentMethod: 'UPI',
    transactionId: 'TXN20260318203',
    address: 'Online',
    rating: 4.9,
  },
];

const statusColors = {
  Confirmed: {bg: Colors.tealBg, text: Colors.tealText},
  Completed: {bg: Colors.tealBg, text: Colors.tealText},
  Cancelled: {bg: Colors.redBg, text: Colors.redText},
};

const DoctorSessionsContent = ({navigation}) => (
  <ScrollView
    contentContainerStyle={styles.sessionsContainer}
    showsVerticalScrollIndicator={false}>
    {mockSessions.map(item => {
      const sc = statusColors[item.status] || statusColors.Confirmed;
      return (
        <TouchableOpacity
          key={item.id}
          style={styles.sessionCard}
          activeOpacity={0.7}
          onPress={() => navigation.navigate('DoctorSessionDetail', {appointment: item})}>
          <View style={styles.sessionHeader}>
            <View style={styles.sessionDoctorRow}>
              <View style={styles.sessionAvatar}>
                <Icon family="Ionicons" name="person-circle-outline" size={32} color={Colors.primary} />
              </View>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold">{item.doctorName}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>{item.specialty}</AppText>
              </View>
              <View style={[styles.statusBadge, {backgroundColor: sc.bg}]}>
                <AppText variant="small" color={sc.text} style={{fontWeight: '600'}}>{item.status}</AppText>
              </View>
            </View>
          </View>
          <View style={styles.sessionMeta}>
            <View style={styles.sessionMetaItem}>
              <Icon family="Ionicons" name="calendar-outline" size={14} color={Colors.textSecondary} />
              <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(4)}}>{item.date}</AppText>
            </View>
            <View style={styles.sessionMetaItem}>
              <Icon family="Ionicons" name="time-outline" size={14} color={Colors.textSecondary} />
              <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(4)}}>{item.time}</AppText>
            </View>
            <View style={styles.sessionMetaItem}>
              <Icon family="Ionicons" name="videocam-outline" size={14} color={Colors.textSecondary} />
              <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(4)}}>{item.sessionType}</AppText>
            </View>
          </View>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const DoctorConsultationScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('main');

  const filteredOrgans = searchText
    ? organTypes.filter(o => o.name.toLowerCase().includes(searchText.toLowerCase()))
    : organTypes;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerRow}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <AppText variant="screenName" color={Colors.white}>
              {activeTab === 'appointments' ? 'Doctor Appointments' : 'Find Your Doctor'}
            </AppText>
            <AppText variant="subtitle" color="rgba(255,255,255,0.6)" style={{marginTop: vs(3)}}>
              {activeTab === 'appointments' ? 'Your booked appointments' : 'Browse specialists and book appointments'}
            </AppText>
          </View>
        </View>

        {activeTab === 'main' && (
          <View style={styles.searchBar}>
            <Icon family="Ionicons" name="search-outline" size={18} color={Colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search doctors, specialties..."
              placeholderTextColor={Colors.textTertiary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={{flex: 1, marginTop: ms(20)}}>
        {activeTab === 'main' ? (
          <FlatList
            data={filteredOrgans}
            numColumns={2}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.gridContainer}
            columnWrapperStyle={styles.gridRow}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.organCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('DoctorSpecialistList', {specialtyName: item.name})}>
                <View style={styles.organImageWrap}>
                  <Image source={item.image} style={styles.organImage} resizeMode="contain" />
                </View>
                <View style={styles.organCardFooter}>
                  <View style={styles.organCardPill}>
                    <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '500'}}>{item.name}</AppText>
                    <Icon family="Ionicons" name="arrow-forward" size={12} color={Colors.textSecondary} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <DoctorSessionsContent navigation={navigation} />
        )}
      </View>
      <StandaloneBottomBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mainLabel="Doctors"
        mainIcon="medkit-outline"
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(16),
    paddingTop: vs(14),
    paddingBottom: vs(14),
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(12),
  },
  backBtn: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    backgroundColor: Colors.white,
    borderRadius: ms(25),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    marginTop: vs(14),
  },
  searchInput: {
    flex: 1,
    marginLeft: s(8),
    fontSize: ms(14),
    color: Colors.textPrimary,
    padding: 0,
  },
  gridContainer: {
    paddingHorizontal: s(16),
    paddingBottom: vs(24),
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  organCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(20),
    width: '48%',
    overflow: 'hidden',
  },
  organImageWrap: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingTop: ms(12),
    paddingHorizontal: ms(6),
  },
  organImage: {
    width: '60%',
    height: ms(80),
  },
  organCardFooter: {
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  organCardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
    backgroundColor: '#EFEFEF',
    borderRadius: ms(20),
    paddingHorizontal: ms(12),
    paddingVertical: vs(5),
  },
  sessionsContainer: {
    paddingHorizontal: s(16),
    paddingBottom: vs(24),
  },
  sessionCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: vs(10),
    elevation: 2,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.08,
    shadowRadius: 3,
  },
  sessionHeader: {
    marginBottom: vs(10),
  },
  sessionDoctorRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  sessionAvatar: {
    width: ms(42),
    height: ms(42),
    borderRadius: ms(21),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(20),
  },
  sessionMeta: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(12),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: vs(10),
  },
  sessionMetaItem: {
    flexDirection: 'row',
    alignItems: 'center',
  },
});

export default DoctorConsultationScreen;
