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

const coachTypes = [
  {id: '1', name: 'Gym Coach', icon: 'fitness-outline', image: require('../../../assets/img/couch-one.png')},
  {id: '2', name: 'Nutrition Coach', icon: 'nutrition-outline', image: require('../../../assets/img/couch-two.png')},
  {id: '3', name: 'Fitness Coach', icon: 'bicycle-outline', image: require('../../../assets/img/couch-three.png')},
  {id: '4', name: 'Wellness Coach', icon: 'leaf-outline', image: require('../../../assets/img/couch-four.png')},
  {id: '5', name: 'Sports Coach', icon: 'football-outline', image: require('../../../assets/img/couch-five.png')},
  {id: '6', name: 'Mental Health', icon: 'happy-outline', image: require('../../../assets/img/couch-one.png')},
];

const mockSessions = [
  {
    id: 'S001',
    coachName: 'Dr. Priya Sharma',
    specialty: 'Nutrition Coach',
    date: '2026-03-25',
    time: '10:00 AM',
    status: 'Confirmed',
    sessionType: 'Video Consultation',
    amount: 800,
    paymentMethod: 'UPI',
    transactionId: 'TXN20260325001',
    address: 'Online',
    rating: 4.8,
  },
  {
    id: 'S002',
    coachName: 'Rahul Mehra',
    specialty: 'Fitness Coach',
    date: '2026-03-20',
    time: '04:30 PM',
    status: 'Completed',
    sessionType: 'In-Person',
    amount: 1200,
    paymentMethod: 'Card',
    transactionId: 'TXN20260320002',
    address: 'FitLife Studio, Koramangala, Bangalore',
    rating: 4.5,
  },
  {
    id: 'S003',
    coachName: 'Anita Desai',
    specialty: 'Wellness Coach',
    date: '2026-03-18',
    time: '11:00 AM',
    status: 'Cancelled',
    sessionType: 'Video Consultation',
    amount: 600,
    paymentMethod: 'UPI',
    transactionId: 'TXN20260318003',
    address: 'Online',
    rating: 4.9,
  },
];

const statusColors = {
  Confirmed: {bg: Colors.tealBg, text: Colors.tealText},
  Completed: {bg: Colors.tealBg, text: Colors.tealText},
  Cancelled: {bg: Colors.redBg, text: Colors.redText},
};

const CoachTypesContent = ({navigation}) => (
  <FlatList
    data={coachTypes}
    numColumns={2}
    keyExtractor={item => item.id}
    contentContainerStyle={styles.gridContainer}
    columnWrapperStyle={styles.gridRow}
    showsVerticalScrollIndicator={false}
    renderItem={({item}) => (
      <TouchableOpacity
        style={styles.coachCard}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('CoachSpecialistList', {specialtyName: item.name})}>
        <View style={styles.coachImageWrap}>
          <Image source={item.image} style={styles.coachImage} resizeMode="cover" />
        </View>
        <View style={styles.coachCardFooter}>
          <View style={styles.coachCardPill}>
            <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '500'}}>{item.name}</AppText>
            <Icon family="Ionicons" name="arrow-forward" size={12} color={Colors.textSecondary} />
          </View>
        </View>
      </TouchableOpacity>
    )}
  />
);

const CoachSessionsContent = ({navigation}) => (
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
          onPress={() => navigation.navigate('CoachSessionDetail', {appointment: item})}>
          <View style={styles.sessionHeader}>
            <View style={styles.sessionCoachRow}>
              <View style={styles.sessionAvatar}>
                <Icon family="Ionicons" name="person-circle-outline" size={32} color={Colors.primary} />
              </View>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold">{item.coachName}</AppText>
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

const CoachConsultationScreen = () => {
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
              {activeTab === 'appointments' ? 'Coach Sessions' : 'Find Your Coach'}
            </AppText>
            <AppText variant="subtitle" color="rgba(255,255,255,0.6)" style={{marginTop: vs(3)}}>
              {activeTab === 'appointments' ? 'Your booked sessions' : 'Browse specialists and book sessions'}
            </AppText>
          </View>
        </View>

        {activeTab === 'main' && (
          <View style={styles.searchBar}>
            <Icon family="Ionicons" name="search-outline" size={18} color={Colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search coaches, specialties..."
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={{flex: 1, marginTop: ms(20)}}>
        {activeTab === 'main' ? (
          <CoachTypesContent navigation={navigation} />
        ) : (
          <CoachSessionsContent navigation={navigation} />
        )}
      </View>
      <StandaloneBottomBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mainLabel="Coaches"
        mainIcon="fitness-outline"
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
  coachCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(20),
    width: '48%',
    overflow: 'hidden',
  },
  coachImageWrap: {
    padding: ms(6),
  },
  coachImage: {
    width: '100%',
    height: ms(90),
    borderRadius: ms(12),
  },
  coachCardFooter: {
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  coachCardPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: ms(4),
    backgroundColor: '#EFEFEF',
    borderRadius: ms(20),
    paddingHorizontal: ms(12),
    paddingVertical: vs(5),
  },
  coachCardName: {
    textAlign: 'center',
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
  sessionCoachRow: {
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

export default CoachConsultationScreen;
