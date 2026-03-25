import React from 'react';
import {Text, Platform} from 'react-native';
import {moderateScale as ms} from 'react-native-size-matters';

const Emoji = ({icon, size = 16}) => (
  <Text
    style={{
      fontSize: ms(size),
      color: Platform.OS === 'android' ? undefined : undefined,
      opacity: 1,
    }}
    allowFontScaling={false}>
    {icon}
  </Text>
);

export default Emoji;
