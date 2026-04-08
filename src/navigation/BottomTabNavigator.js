import React from 'react';
import {View, Text, Image, StyleSheet, TouchableOpacity} from 'react-native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../constants/colors';
import Fonts from '../constants/fonts';
import Images from '../constants/images';

import HomeScreen from '../screens/Home/HomeScreen';
import TrackingScreen from '../screens/Tracking/TrackingScreen';
import RecordsScreen from '../screens/Records/RecordsScreen';
import ProgressScreen from '../screens/Progress/ProgressScreen';
import AyuIntelScreen from '../screens/AyuIntel/AyuIntelScreen';

const Tab = createBottomTabNavigator();

const tabImages = {
  Home: require('../assets/img/fhome.png'),
  Tracking: require('../assets/img/ftracking.png'),
  Records: require('../assets/img/frecords.png'),
  Progress: require('../assets/img/fprogress.png'),
  Ayu: Images.ayuLogo,
};

const tabs = [
  {name: 'Home', label: 'Home', component: HomeScreen},
  {name: 'Tracking', label: 'Tracking', component: TrackingScreen},
  {name: 'Records', label: 'Records', component: RecordsScreen},
  {name: 'Ayu', label: 'Ayu Intel', component: AyuIntelScreen},
  {name: 'Progress', label: 'Progress', component: ProgressScreen},
];

const CustomTabBar = ({state, navigation}) => (
  <View style={styles.tabBarWrap}>
    <View style={styles.tabBar}>
      {state.routes.map((route, index) => {
        const isFocused = state.index === index;
        const tab = tabs[index];
        return (
          <TouchableOpacity
            key={route.key}
            onPress={() => {
              const event = navigation.emit({type: 'tabPress', target: route.key, canPreventDefault: true});
              if (!isFocused && !event.defaultPrevented) {
                navigation.navigate(route.name);
              }
            }}
            style={styles.tabItem}
            activeOpacity={0.7}>
            {isFocused && <View style={styles.topIndicator} />}
            <Image
              source={tabImages[tab.name]}
              style={[styles.tabIcon, !isFocused && styles.tabIconInactive]}
              resizeMode="contain"
            />
            <Text
              style={[
                styles.tabLabel,
                {color: isFocused ? Colors.primary : Colors.textTertiary, fontWeight: isFocused ? '700' : '500'},
              ]}>
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  </View>
);

const BottomTabNavigator = () => (
  <Tab.Navigator tabBar={props => <CustomTabBar {...props} />} screenOptions={{headerShown: false}}>
    {tabs.map(tab => (
      <Tab.Screen key={tab.name} name={tab.name} component={tab.component} />
    ))}
  </Tab.Navigator>
);

const styles = StyleSheet.create({
  tabBarWrap: {
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: -2},
    shadowOpacity: 0.05,
    shadowRadius: 6,
    elevation: 8,
  },
  tabBar: {
    flexDirection: 'row',
    paddingTop: vs(6),
    paddingBottom: vs(8),
    paddingHorizontal: ms(4),
    justifyContent: 'space-around',
  },
  tabItem: {flex: 1, alignItems: 'center', justifyContent: 'center', paddingTop: vs(4), position: 'relative'},
  topIndicator: {
    position: 'absolute',
    top: 0,
    width: ms(28),
    height: vs(3),
    borderRadius: ms(2),
    backgroundColor: Colors.primary,
  },
  tabIcon: {width: ms(22), height: ms(22), marginBottom: vs(2)},
  tabIconInactive: {opacity: 0.55},
  tabLabel: {fontSize: ms(9), fontFamily: Fonts.regular},
});

export default BottomTabNavigator;
