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

const wellnessCenters = [
  {
    id: '1',
    name: 'Sushma Wellness Center',
    location: 'Madhapur',
    rating: 4.5,
    reviews: '86k',
    image: require('../../../assets/img/counselling-one.png'),
  },
  {
    id: '2',
    name: 'Varsha Wellness Center',
    location: 'Madhapur',
    rating: 4.5,
    reviews: '86k',
    image: require('../../../assets/img/counselling-two.png'),
  },
  {
    id: '3',
    name: 'MindBody Fitness Studio',
    location: 'Banjara Hills',
    rating: 4.3,
    reviews: '54k',
    image: require('../../../assets/img/counselling-three.png'),
  },
  {
    id: '4',
    name: 'Serenity Yoga & Wellness',
    location: 'Jubilee Hills',
    rating: 4.6,
    reviews: '72k',
    image: require('../../../assets/img/counselling-four.png'),
  },
];

const mockSessions = [
  {
    id: 'W001',
    coachName: 'Dr. Meena Kapoor',
    specialty: 'Ayurvedic Wellness',
    date: '2026-03-25',
    time: '09:00 AM',
    status: 'Confirmed',
    sessionType: 'In-Person',
  },
  {
    id: 'W002',
    coachName: 'Ravi Shankar',
    specialty: 'Yoga Therapy',
    date: '2026-03-20',
    time: '06:00 PM',
    status: 'Completed',
    sessionType: 'Video Consultation',
  },
  {
    id: 'W003',
    coachName: 'Lakshmi Iyer',
    specialty: 'Spa & Relaxation',
    date: '2026-03-18',
    time: '02:00 PM',
    status: 'Cancelled',
    sessionType: 'In-Person',
  },
];

const statusColors = {
  Confirmed: {bg: Colors.tealBg, text: Colors.tealText},
  Completed: {bg: Colors.tealBg, text: Colors.tealText},
  Cancelled: {bg: Colors.redBg, text: Colors.redText},
};

const WellnessListContent = () => {
  const navigation = useNavigation();
  return (
  <FlatList
    data={wellnessCenters}
    keyExtractor={item => item.id}
    contentContainerStyle={styles.listContainer}
    showsVerticalScrollIndicator={false}
    renderItem={({item}) => (
      <TouchableOpacity
        style={styles.centerCard}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('WellnessDetail', {center: item})}>
        <Image source={item.image} style={styles.centerImage} resizeMode="cover" />
        <View style={styles.centerInfo}>
          <View style={styles.centerInfoLeft}>
            <AppText variant="bodyBold">{item.name}</AppText>
            <View style={styles.locationRow}>
              <Icon family="Ionicons" name="location-outline" size={14} color={Colors.textSecondary} />
              <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(3)}}>
                {item.location}
              </AppText>
            </View>
          </View>
          <View style={styles.centerInfoRight}>
            <View style={styles.ratingRow}>
              <Icon family="Ionicons" name="star" size={14} color="#F5A623" />
              <AppText variant="caption" color={Colors.textPrimary} style={{marginLeft: s(3), fontWeight: '600'}}>
                {item.rating}
              </AppText>
            </View>
            <AppText variant="small" color={Colors.textSecondary}>
              {item.reviews} reviews
            </AppText>
          </View>
        </View>
      </TouchableOpacity>
    )}
  />
);
};

const WellnessSessionsContent = () => {
  const navigation = useNavigation();
  return (
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
          onPress={() => navigation.navigate('WellnessSessionDetail', {appointment: item})}>
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
};

const WellnessCenterScreen = () => {
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
              {activeTab === 'appointments' ? 'Wellness Sessions' : 'Wellness Centres'}
            </AppText>
            <AppText variant="subtitle" color="rgba(255,255,255,0.6)" style={{marginTop: vs(3)}}>
              {activeTab === 'appointments' ? 'Your booked sessions' : 'Find wellness & spa centres near you'}
            </AppText>
          </View>
        </View>

        {activeTab === 'main' && (
          <View style={styles.searchBar}>
            <Icon family="Ionicons" name="search-outline" size={18} color={Colors.textTertiary} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search wellness centres..."
              placeholderTextColor={Colors.textTertiary}
            />
          </View>
        )}
      </View>

      {/* Content */}
      <View style={{flex: 1, marginTop: ms(20)}}>
        {activeTab === 'main' ? (
          <WellnessListContent />
        ) : (
          <WellnessSessionsContent />
        )}
      </View>

      <StandaloneBottomBar
        activeTab={activeTab}
        onTabChange={setActiveTab}
        mainLabel="Wellness"
        mainIcon="leaf-outline"
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
  listContainer: {
    paddingHorizontal: s(16),
    paddingBottom: vs(24),
  },
  centerCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(16),
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary,
    overflow: 'hidden',
    marginBottom: vs(12),
  },
  centerImage: {
    width: '100%',
    height: vs(110),
  },
  centerInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    padding: ms(12),
  },
  centerInfoLeft: {
    flex: 1,
    marginRight: s(8),
  },
  locationRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(3),
  },
  centerInfoRight: {
    alignItems: 'flex-end',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  sessionsContainer: {
    paddingHorizontal: s(16),
    paddingBottom: vs(24),
  },
  sessionCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderTertiary,
    padding: ms(14),
    marginBottom: vs(10),
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

export default WellnessCenterScreen;
