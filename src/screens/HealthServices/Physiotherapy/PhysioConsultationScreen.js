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

const physioTypes = [
  {id: '1', name: 'Sports Physiotherapy', image: require('../../../assets/img/phy-one.png')},
  {id: '2', name: 'Orthopedic Therapy', image: require('../../../assets/img/phy-two.png')},
  {id: '3', name: 'Neurological Therapy', image: require('../../../assets/img/phy-three.png')},
  {id: '4', name: 'Pediatric Physiotherapy', image: require('../../../assets/img/phy-four.png')},
  {id: '5', name: 'Post-Surgery Rehab', image: require('../../../assets/img/phy-five.png')},
  {id: '6', name: 'Pain Management', image: require('../../../assets/img/phy-six.png')},
];

const mockSessions = [
  {
    id: 'PS001',
    physioName: 'Dr. Arjun Mehta',
    specialty: 'Sports Physiotherapy',
    date: '2026-03-25',
    time: '10:00 AM',
    status: 'Confirmed',
    sessionType: 'Clinic Visit',
    amount: 800,
    paymentMethod: 'UPI',
    transactionId: 'TXN20260325401',
    address: 'PhysioCare Clinic, Indiranagar, Bangalore',
    rating: 4.9,
  },
  {
    id: 'PS002',
    physioName: 'Dr. Sneha Kulkarni',
    specialty: 'Orthopedic Therapy',
    date: '2026-03-20',
    time: '03:30 PM',
    status: 'Completed',
    sessionType: 'Home Visit',
    amount: 750,
    paymentMethod: 'Card',
    transactionId: 'TXN20260320402',
    address: 'Patient Home, JP Nagar, Bangalore',
    rating: 4.8,
  },
  {
    id: 'PS003',
    physioName: 'Dr. Ravi Shankar',
    specialty: 'Neurological Therapy',
    date: '2026-03-18',
    time: '11:00 AM',
    status: 'Cancelled',
    sessionType: 'Clinic Visit',
    amount: 900,
    paymentMethod: 'UPI',
    transactionId: 'TXN20260318403',
    address: 'NeuroPhysio Centre, Koramangala, Bangalore',
    rating: 4.7,
  },
];

const statusColors = {
  Confirmed: {bg: Colors.tealBg, text: Colors.tealText},
  Completed: {bg: Colors.tealBg, text: Colors.tealText},
  Cancelled: {bg: Colors.redBg, text: Colors.redText},
};

const PhysioSessionsContent = ({navigation}) => (
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
          onPress={() => navigation.navigate('PhysioSessionDetail', {appointment: item})}>
          <View style={styles.sessionHeader}>
            <View style={styles.sessionPhysioRow}>
              <View style={styles.sessionAvatar}>
                <Icon family="Ionicons" name="person-circle-outline" size={32} color={Colors.primary} />
              </View>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold">{item.physioName}</AppText>
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
              <Icon family="Ionicons" name="body-outline" size={14} color={Colors.textSecondary} />
              <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(4)}}>{item.sessionType}</AppText>
            </View>
          </View>
        </TouchableOpacity>
      );
    })}
  </ScrollView>
);

const PhysioConsultationScreen = () => {
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
              {activeTab === 'appointments' ? 'Physio Sessions' : 'Find Your Physiotherapist'}
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
              placeholder="Search physiotherapy, specialties..."
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={{flex: 1, marginTop: ms(20)}}>
        {activeTab === 'main' ? (
          <FlatList
            data={physioTypes}
            numColumns={2}
            keyExtractor={item => item.id}
            contentContainerStyle={styles.gridContainer}
            columnWrapperStyle={styles.gridRow}
            showsVerticalScrollIndicator={false}
            renderItem={({item}) => (
              <TouchableOpacity
                style={styles.physioCard}
                activeOpacity={0.7}
                onPress={() => navigation.navigate('PhysioSpecialistList', {specialtyName: item.name})}>
                <View style={styles.physioImageWrap}>
                  <Image source={item.image} style={styles.physioImage} resizeMode="cover" />
                </View>
                <View style={styles.physioCardFooter}>
                  <View style={styles.physioCardPill}>
                    <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '500'}}>{item.name}</AppText>
                    <Icon family="Ionicons" name="arrow-forward" size={12} color={Colors.textSecondary} />
                  </View>
                </View>
              </TouchableOpacity>
            )}
          />
        ) : (
          <PhysioSessionsContent navigation={navigation} />
        )}
      </View>
      <StandaloneBottomBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mainLabel="Physiotherapy"
        mainIcon="body-outline"
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
  physioCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(20),
    width: '48%',
    overflow: 'hidden',
  },
  physioImageWrap: {
    padding: ms(6),
  },
  physioImage: {
    width: '100%',
    height: ms(90),
    borderRadius: ms(12),
  },
  physioCardFooter: {
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  physioCardPill: {
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
  sessionPhysioRow: {
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

export default PhysioConsultationScreen;
