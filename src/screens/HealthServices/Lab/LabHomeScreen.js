import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Image,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const nablLabs = [
  {id: 'n1', name: 'TrustLab', image: require('../../../assets/img/app3dlogo.png')},
  {id: 'n2', name: 'Vijaya', image: require('../../../assets/img/vijayalogo.png')},
  {id: 'n3', name: 'teNET', image: require('../../../assets/img/tenetlogo.png')},
  {id: 'n4', name: 'Apollo', image: require('../../../assets/img/apollologo.png')},
  {id: 'n5', name: 'Metropolis', image: require('../../../assets/img/metropoleslogo.png')},
  {id: 'n6', name: 'Agilus', image: require('../../../assets/img/agiluslogo.png')},
  {id: 'n7', name: 'Ampath', image: require('../../../assets/img/ampatlogo.png')},
  {id: 'n8', name: 'Lucid', image: require('../../../assets/img/lucidlogo.png')},
  {id: 'n9', name: 'Unipath', image: require('../../../assets/img/unipathlogo.png')},
];

const nonNablLabs = [
  {id: 'nn1', name: 'TrustLab', image: require('../../../assets/img/app3dlogo.png')},
  {id: 'nn2', name: 'Vijaya', image: require('../../../assets/img/vijayalogo.png')},
  {id: 'nn3', name: 'teNET', image: require('../../../assets/img/tenetlogo.png')},
  {id: 'nn4', name: 'Apollo', image: require('../../../assets/img/apollologo.png')},
  {id: 'nn5', name: 'Metropolis', image: require('../../../assets/img/metropoleslogo.png')},
  {id: 'nn6', name: 'Agilus', image: require('../../../assets/img/agiluslogo.png')},
  {id: 'nn7', name: 'Ampath', image: require('../../../assets/img/ampatlogo.png')},
  {id: 'nn8', name: 'Lucid', image: require('../../../assets/img/lucidlogo.png')},
  {id: 'nn9', name: 'Unipath', image: require('../../../assets/img/unipathlogo.png')},
];

const LabHomeScreen = () => {
  const navigation = useNavigation();
  const [activeTab, setActiveTab] = useState('NABL');

  const labs = activeTab === 'NABL' ? nablLabs : nonNablLabs;

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}>
            <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(12)}}>
            <AppText variant="header" color={Colors.white}>
              Home Lab Tests
            </AppText>
            <AppText variant="caption" color="rgba(255,255,255,0.7)" style={{marginTop: vs(2)}}>
              Book tests from certified labs
            </AppText>
          </View>
        </View>

        {/* Search Bar */}
        <TouchableOpacity
          style={styles.searchBar}
          onPress={() => navigation.navigate('LabSearch')}>
          <Icon family="Ionicons" name="search" size={18} color={Colors.textTertiary} />
          <AppText variant="body" color={Colors.textTertiary} style={{marginLeft: s(8)}}>
            Search lab tests...
          </AppText>
        </TouchableOpacity>

        {/* NABL / Non-NABL Toggle */}
        <View style={styles.toggleContainer}>
          <TouchableOpacity
            style={[
              styles.toggleTab,
              activeTab === 'NABL' && styles.toggleTabActive,
            ]}
            onPress={() => setActiveTab('NABL')}>
            <AppText
              variant="bodyBold"
              color={Colors.white}
              style={{fontSize: ms(13)}}>
              NABL
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.toggleTab,
              activeTab === 'Non-NABL' && styles.toggleTabActive,
            ]}
            onPress={() => setActiveTab('Non-NABL')}>
            <AppText
              variant="bodyBold"
              color={Colors.white}
              style={{fontSize: ms(13)}}>
              Non-NABL
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{paddingBottom: vs(30)}}
        showsVerticalScrollIndicator={false}>

        {/* Lab Grid */}
        <View style={styles.labGrid}>
          {labs.map(item => (
            <TouchableOpacity
              key={item.id}
              style={styles.labCard}
              onPress={() => navigation.navigate('LabTestList', {lab: item})}>
              <Image source={item.image} style={styles.labImage} resizeMode="contain" />
              <AppText
                variant="small"
                style={{marginTop: vs(8), textAlign: 'center'}}
                numberOfLines={2}>
                {item.name}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    backgroundColor: Colors.primary,
    paddingTop: vs(16),
    paddingHorizontal: s(16),
    paddingBottom: vs(16),
  },
  headerTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backButton: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    marginTop: vs(14),
  },
  toggleContainer: {
    flexDirection: 'row',
    marginTop: vs(14),
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: ms(25),
    padding: ms(3),
  },
  toggleTab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(8),
    borderRadius: ms(22),
  },
  toggleTabActive: {
    backgroundColor: Colors.primary,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.3)',
  },
  content: {
    flex: 1,
    paddingHorizontal: s(16),
  },
  labGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: vs(16),
  },
  labCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    alignItems: 'center',
    justifyContent: 'center',
    padding: ms(12),
    width: (s(328) - s(24)) / 3,
    marginBottom: vs(12),
  },
  labImage: {
    width: ms(65),
    height: ms(65),
  },
});

export default LabHomeScreen;
