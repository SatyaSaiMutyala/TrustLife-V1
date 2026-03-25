import React from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from './AppText';
import Icon from './Icons';

const StandaloneBottomBar = ({
  activeTab = 'main',
  onTabChange,
  mainLabel = 'Doctors',
  mainIcon = 'medkit-outline',
  mainScreen = 'DoctorConsultation',
}) => {
  const navigation = useNavigation();

  const tabs = [
    {key: 'back', label: 'Back', icon: 'chevron-back'},
    {key: 'main', label: mainLabel, icon: mainIcon},
    {key: 'appointments', label: 'Appointments', icon: 'calendar-outline'},
    {key: 'more', label: 'More', icon: 'ellipsis-horizontal'},
  ];

  const handlePress = (tab) => {
    if (tab.key === 'back') {
      navigation.goBack();
    } else if (tab.key === 'main') {
      onTabChange ? onTabChange('main') : navigation.navigate(mainScreen);
    } else if (tab.key === 'appointments') {
      onTabChange ? onTabChange('appointments') : null;
    } else if (tab.key === 'more') {
      onTabChange ? onTabChange('more') : null;
    }
  };

  return (
    <View style={styles.bar}>
      {tabs.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={styles.tab}
            onPress={() => handlePress(tab)}
            activeOpacity={0.7}>
            <Icon
              family="Ionicons"
              name={tab.icon}
              size={22}
              color={isActive ? Colors.primary : Colors.textTertiary}
            />
            <AppText
              variant="subtext"
              color={isActive ? Colors.primary : Colors.textTertiary}
              style={isActive ? {fontWeight: '600'} : undefined}>
              {tab.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const styles = StyleSheet.create({
  bar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-around',
    paddingVertical: vs(10),
    paddingBottom: vs(14),
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderTertiary,
  },
  tab: {
    alignItems: 'center',
    gap: vs(3),
    flex: 1,
  },
});

export default StandaloneBottomBar;
