import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  FlatList,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';
import StandaloneBottomBar from '../../../components/shared/StandaloneBottomBar';

const specialties = [
  {id: '1', name: 'General Physician', icon: 'medkit-outline'},
  {id: '2', name: 'Dermatologist', icon: 'color-palette-outline'},
  {id: '3', name: 'Pediatrician', icon: 'people-outline'},
  {id: '4', name: 'Gynecologist', icon: 'female-outline'},
  {id: '5', name: 'Psychiatrist', icon: 'happy-outline'},
  {id: '6', name: 'ENT', icon: 'ear-outline'},
  {id: '7', name: 'Orthopedic', icon: 'body-outline'},
  {id: '8', name: 'Cardiologist', icon: 'heart-outline'},
];

const mockSessions = [
  {
    id: 'TS001',
    doctorName: 'Dr. Priya Sharma',
    specialty: 'General Physician',
    date: '2026-03-25',
    time: '10:00 AM',
    status: 'Confirmed',
    sessionType: 'Video Consultation',
    amount: 499,
    paymentMethod: 'UPI',
    transactionId: 'TXN20260325301',
    address: 'Online',
    rating: 4.8,
  },
  {
    id: 'TS002',
    doctorName: 'Dr. Rahul Mehra',
    specialty: 'Dermatologist',
    date: '2026-03-20',
    time: '03:00 PM',
    status: 'Completed',
    sessionType: 'Video Consultation',
    amount: 499,
    paymentMethod: 'Card',
    transactionId: 'TXN20260320302',
    address: 'Online',
    rating: 4.5,
  },
  {
    id: 'TS003',
    doctorName: 'Dr. Anita Desai',
    specialty: 'Psychiatrist',
    date: '2026-03-18',
    time: '11:30 AM',
    status: 'Cancelled',
    sessionType: 'Video Consultation',
    amount: 499,
    paymentMethod: 'UPI',
    transactionId: 'TXN20260318303',
    address: 'Online',
    rating: 4.9,
  },
];

const statusColors = {
  Confirmed: {bg: Colors.tealBg, text: Colors.tealText},
  Completed: {bg: Colors.tealBg, text: Colors.tealText},
  Cancelled: {bg: Colors.redBg, text: Colors.redText},
};

const SessionsContent = ({navigation}) => (
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
                <Icon family="Ionicons" name="videocam-outline" size={24} color={Colors.primary} />
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

const TelemedicineHomeScreen = () => {
  const navigation = useNavigation();
  const [searchText, setSearchText] = useState('');
  const [activeTab, setActiveTab] = useState('main');

  const filteredSpecialties = searchText
    ? specialties.filter(sp => sp.name.toLowerCase().includes(searchText.toLowerCase()))
    : specialties;

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
              {activeTab === 'appointments' ? 'Telemedicine Appointments' : 'Telemedicine'}
            </AppText>
            <AppText variant="subtitle" color="rgba(255,255,255,0.6)" style={{marginTop: vs(3)}}>
              {activeTab === 'appointments' ? 'Your booked video consultations' : 'Consult doctors online via video call'}
            </AppText>
          </View>
        </View>

        {activeTab === 'main' && (
          <View style={styles.searchBar}>
            <Icon family="Ionicons" name="search-outline" size={18} color={Colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search specialties, doctors..."
              placeholderTextColor={Colors.textTertiary}
              value={searchText}
              onChangeText={setSearchText}
            />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={{flex: 1}}>
        {activeTab === 'main' ? (
          <FlatList
            data={filteredSpecialties}
            numColumns={2}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.gridContainer}
            columnWrapperStyle={styles.gridRow}
            showsVerticalScrollIndicator={false}
            ListHeaderComponent={
              <View style={styles.infoCard}>
                <Icon family="Ionicons" name="videocam" size={24} color={Colors.tealText} />
                <AppText variant="body" color={Colors.tealText} style={{flex: 1, marginLeft: s(10)}}>
                  Video consultations available 24/7. Connect with specialists from home.
                </AppText>
              </View>
            }
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.specialtyCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('TelemedicineSpecialistList', {specialtyName: item.name})}>
                <View style={styles.specialtyIconWrap}>
                  <Icon family="Ionicons" name={item.icon} size={ms(32)} color={Colors.tealText} />
                </View>
                <AppText variant="bodyBold" style={styles.specialtyName}>{item.name}</AppText>
                <AppText variant="caption" color={Colors.primary} style={{marginTop: vs(4)}}>Consult Now</AppText>
              </TouchableOpacity>
            )}
          />
        ) : (
          <SessionsContent navigation={navigation} />
        )}
      </View>

      <StandaloneBottomBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mainLabel="Teleconsult"
        mainIcon="videocam-outline"
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
  infoCard: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(14),
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(14),
    marginBottom: vs(16),
  },
  gridContainer: {
    paddingHorizontal: s(16),
    paddingTop: vs(16),
    paddingBottom: vs(24),
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  specialtyCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    width: '48%',
    alignItems: 'center',
    paddingVertical: vs(18),
    paddingHorizontal: s(10),
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary,
  },
  specialtyIconWrap: {
    width: ms(56),
    height: ms(56),
    borderRadius: ms(28),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(10),
  },
  specialtyName: {
    textAlign: 'center',
    fontSize: ms(13),
  },
  sessionsContainer: {
    paddingHorizontal: s(16),
    paddingTop: vs(16),
    paddingBottom: vs(24),
  },
  sessionCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: vs(10),
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary,
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

export default TelemedicineHomeScreen;
