import React from 'react';
import {moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';

// Import all icon families
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import Feather from 'react-native-vector-icons/Feather';
import FontAwesome from 'react-native-vector-icons/FontAwesome';
import FontAwesome5 from 'react-native-vector-icons/FontAwesome5';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import Entypo from 'react-native-vector-icons/Entypo';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Octicons from 'react-native-vector-icons/Octicons';
import SimpleLineIcons from 'react-native-vector-icons/SimpleLineIcons';
import EvilIcons from 'react-native-vector-icons/EvilIcons';
import Foundation from 'react-native-vector-icons/Foundation';

// Map of all icon families for easy access
const IconFamilies = {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
  Entypo,
  AntDesign,
  Octicons,
  SimpleLineIcons,
  EvilIcons,
  Foundation,
};

// Generic Icon component - use any family + name
// Usage: <Icon family="Ionicons" name="chevron-back" size={22} color="#fff" />
const Icon = ({family = 'Ionicons', name, size = 20, color = Colors.textPrimary}) => {
  const IconComponent = IconFamilies[family];
  if (!IconComponent) return null;
  return <IconComponent name={name} size={ms(size)} color={color} />;
};

export default Icon;

// Also export individual families directly for convenience
// Usage: import { Ionicons, Feather } from '../shared/Icons';
export {
  Ionicons,
  MaterialCommunityIcons,
  Feather,
  FontAwesome,
  FontAwesome5,
  MaterialIcons,
  Entypo,
  AntDesign,
  Octicons,
  SimpleLineIcons,
  EvilIcons,
  Foundation,
};
