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

const counsellingTypes = [
  {id: '1', name: 'Stress Counselling', image: require('../../../assets/img/counselling-one.png')},
  {id: '2', name: 'Anxiety Counselling', image: require('../../../assets/img/counselling-two.png')},
  {id: '3', name: 'Relationship Counselling', image: require('../../../assets/img/counselling-three.png')},
  {id: '4', name: 'Lifestyle Counselling', image: require('../../../assets/img/counselling-four.png')},
  {id: '5', name: 'Mental Health', image: require('../../../assets/img/counselling-five.png')},
  {id: '6', name: 'Family Counselling', image: require('../../../assets/img/counselling-one.png')},
];

const mockSessions = [
  {
    id: 'CS001',
    counsellorName: 'Dr. Meera Joshi',
    specialty: 'Stress Counselling',
    date: '2026-03-25',
    time: '10:00 AM',
    status: 'Confirmed',
    sessionType: 'Video Consultation',
    amount: 1200,
    paymentMethod: 'UPI',
    transactionId: 'TXN20260325101',
    address: 'Online',
    rating: 4.9,
  },
  {
    id: 'CS002',
    counsellorName: 'Dr. Anil Kapoor',
    specialty: 'Anxiety Counselling',
    date: '2026-03-20',
    time: '02:30 PM',
    status: 'Completed',
    sessionType: 'In-Person',
    amount: 1500,
    paymentMethod: 'Card',
    transactionId: 'TXN20260320102',
    address: 'Wellness Centre, Indiranagar, Bangalore',
    rating: 4.7,
  },
  {
    id: 'CS003',
    counsellorName: 'Dr. Sunita Rao',
    specialty: 'Relationship Counselling',
    date: '2026-03-18',
    time: '11:00 AM',
    status: 'Cancelled',
    sessionType: 'Video Consultation',
    amount: 1000,
    paymentMethod: 'UPI',
    transactionId: 'TXN20260318103',
    address: 'Online',
    rating: 4.8,
  },
];

const statusColors = {
  Confirmed: {bg: '#E8F5E9', text: '#4CAF50'},
  Completed: {bg: '#E8F5E9', text: '#388E3C'},
  Cancelled: {bg: '#FFCDD2', text: '#E53935'},
};

const CounsellingTypesContent = ({navigation}) => (
  <FlatList
    data={counsellingTypes}
    numColumns={2}
    keyExtractor={item => item.id}
    contentContainerStyle={styles.gridContainer}
    columnWrapperStyle={styles.gridRow}
    showsVerticalScrollIndicator={false}
    renderItem={({item}) => (
      <TouchableOpacity
        style={styles.typeCard}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('CounsellingSpecialistList', {specialtyName: item.name})}>
        <View style={styles.typeImageWrap}>
          <Image source={item.image} style={styles.typeImage} resizeMode="cover" />
        </View>
        <View style={styles.typeFooter}>
          <AppText variant="caption" style={styles.typeCardName} numberOfLines={1}>{item.name}</AppText>
          <Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.textSecondary} />
        </View>
      </TouchableOpacity>
    )}
  />
);

const CounsellingSessionsContent = ({navigation}) => (
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
          onPress={() => navigation.navigate('CounsellingSessionDetail', {appointment: item})}>
          <View style={styles.sessionHeader}>
            <View style={styles.sessionCounsellorRow}>
              <View style={styles.sessionAvatar}>
                <Icon family="Ionicons" name="person-circle-outline" size={32} color={Colors.primary} />
              </View>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold">{item.counsellorName}</AppText>
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
              <Icon family="Ionicons" name="wallet-outline" size={14} color={Colors.textSecondary} />
              <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(4)}}>Rs. {item.amount}</AppText>
            </View>
          </View>
          <View style={styles.sessionActions}>
            {item.status === 'Confirmed' && (
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>View Details</AppText>
              </TouchableOpacity>
            )}
            {item.status === 'Completed' && (
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>Rebook</AppText>
              </TouchableOpacity>
            )}
            {item.status === 'Cancelled' && (
              <TouchableOpacity style={styles.actionBtn} activeOpacity={0.7}>
                <AppText variant="small" color={Colors.primary} style={{fontWeight: '600'}}>Book Again</AppText>
              </TouchableOpacity>
            )}
          </View>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const CounsellingConsultationScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('main');

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
              {activeTab === 'appointments' ? 'Counselling Sessions' : 'Find Your Counsellor'}
            </AppText>
            <AppText variant="subtitle" color="rgba(255,255,255,0.6)" style={{marginTop: vs(3)}}>
              {activeTab === 'appointments' ? 'Your booked sessions' : 'Browse counsellors and book sessions'}
            </AppText>
          </View>
        </View>

        {activeTab === 'main' && (
          <View style={styles.searchBar}>
            <Icon family="Ionicons" name="search-outline" size={18} color={Colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search counsellors, specialties..."
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={{flex: 1, marginTop: ms(20)}}>
        {activeTab === 'main' ? (
          <CounsellingTypesContent navigation={navigation} />
        ) : (
          <CounsellingSessionsContent navigation={navigation} />
        )}
      </View>
      <StandaloneBottomBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mainLabel="Counselling"
        mainIcon="heart-outline"
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
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  searchInput: {
    flex: 1,
    marginLeft: s(8),
    fontSize: ms(14),
    color: Colors.textPrimary,
    padding: 0,
  },
  tabBar: {
    flexDirection: 'row',
    marginHorizontal: s(16),
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: ms(4),
    marginBottom: vs(8),
  },
  tab: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(10),
    borderRadius: ms(10),
  },
  tabActive: {
    backgroundColor: Colors.tealBg,
  },
  gridContainer: {
    paddingHorizontal: s(16),
    paddingBottom: vs(24),
  },
  gridRow: {
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  typeCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(20),
    width: '48%',
    overflow: 'hidden',
  },
  typeImageWrap: {
    padding: ms(10),
    alignItems: 'center',
  },
  typeImage: {
    width: '100%',
    height: vs(110),
    borderRadius: ms(14),
  },
  typeFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.tealBg,
    borderRadius: ms(20),
    marginHorizontal: ms(8),
    marginBottom: ms(10),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
  },
  typeCardName: {
    flex: 1,
    fontWeight: '600',
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
  sessionCounsellorRow: {
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
  sessionActions: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: vs(10),
    marginTop: vs(10),
    alignItems: 'center',
  },
  actionBtn: {
    paddingVertical: vs(4),
    paddingHorizontal: s(16),
  },
});

export default CounsellingConsultationScreen;
