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
          <View style={[styles.tabIconWrap, isFocused && styles.tabIconWrapActive]}>
            <Image
              source={tabImages[tab.name]}
              style={styles.tabIcon}
              resizeMode="contain"
            />
            <Text style={[styles.tabLabelInner, {color: isFocused ? Colors.primary : Colors.textTertiary, fontWeight: isFocused ? '600' : '400'}]}>{tab.label}</Text>
          </View>
        </TouchableOpacity>
      );
    })}
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
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    paddingTop: vs(9),
    paddingBottom: vs(15),
    justifyContent: 'space-around',
  },
  tabItem: {flex: 1, alignItems: 'center'},
  tabIconWrap: {width: ms(56), height: ms(48), borderRadius: ms(14), alignItems: 'center', justifyContent: 'center', gap: vs(2), overflow: 'hidden'},
  tabIconWrapActive: {backgroundColor: 'rgba(10, 92, 71, 0.18)'},
  tabIcon: {width: ms(28), height: ms(28)},
  tabLabelInner: {fontSize: ms(10), fontFamily: Fonts.regular},
});

export default BottomTabNavigator;
