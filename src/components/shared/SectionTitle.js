import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {verticalScale as vs} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from './AppText';

const SectionTitle = ({title, linkText, onLinkPress}) => (
  <View style={styles.header}>
    <AppText variant="sectionTitle" color={Colors.textPrimary}>{title}</AppText>
    {linkText && (
      <TouchableOpacity onPress={onLinkPress}>
        <AppText variant="small" color={Colors.tealDark} style={{fontWeight: '500'}}>{linkText}</AppText>
      </TouchableOpacity>
    )}
  </View>
);

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(9),
  },
});

export default SectionTitle;
