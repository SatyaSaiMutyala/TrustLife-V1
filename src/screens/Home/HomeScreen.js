import React from 'react';
import {View, ScrollView, StyleSheet, StatusBar} from 'react-native';
import {scale as s, verticalScale as vs} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import HeroSection from '../../components/Home/HeroSection';
import ActiveConditionsCard from '../../components/Home/ActiveConditionsCard';
import TestReadinessCard from '../../components/Home/TestReadinessCard';
import QuickActions from '../../components/Home/QuickActions';
import ForYouCarousel from '../../components/Home/ForYouCarousel';
import OrganHealthGrid from '../../components/Home/OrganHealthGrid';
import AyuBanner from '../../components/Home/AyuBanner';
import HealthServices from '../../components/Home/HealthServices';

const HomeScreen = ({navigation}) => (
  <View style={styles.container}>
    <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
    <ScrollView style={styles.scroll} showsVerticalScrollIndicator={false} bounces={false}>
      <HeroSection navigation={navigation} />
      <View style={styles.floatZone}>
        <ActiveConditionsCard />
        <TestReadinessCard />
      </View>
      <View style={styles.body}><QuickActions /></View>
      <ForYouCarousel navigation={navigation} />
      <View style={[styles.body, {marginTop: vs(18)}]}>
        <OrganHealthGrid />
        <AyuBanner />
        <HealthServices />
      </View>
      <View style={{height: vs(20)}} />
    </ScrollView>
  </View>
);

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  scroll: {flex: 1},
  floatZone: {marginTop: vs(-14), marginHorizontal: s(12), gap: vs(9), marginBottom: vs(14), zIndex: 2},
  body: {paddingHorizontal: s(12)},
});

export default HomeScreen;
