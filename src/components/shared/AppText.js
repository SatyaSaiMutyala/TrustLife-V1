import React from 'react';
import {Text, StyleSheet} from 'react-native';
import {Typography} from '../../constants/fonts';
import Colors from '../../constants/colors';

// Global Text component with typography variants.
//
// Usage:
//   import AppText from '../components/shared/AppText';
//
//   <AppText variant="screenName" color={Colors.white}>Progress</AppText>
//   <AppText variant="header">Daily Trackers</AppText>
//   <AppText variant="subtitle" color={Colors.textSecondary}>Your health journey</AppText>
//   <AppText variant="sectionTitle">ORGAN HEALTH</AppText>
//   <AppText variant="body">Regular text content</AppText>
//   <AppText variant="bodyBold">Bold emphasis</AppText>
//   <AppText variant="caption">Helper text</AppText>
//   <AppText variant="small">Badge label</AppText>
//   <AppText variant="subtext" color={Colors.textTertiary}>Muted info</AppText>
//
// Props:
//   variant   - one of the Typography keys (default: 'body')
//   color     - text color override (default: Colors.textPrimary)
//   style     - additional style overrides
//   ...rest   - all other Text props (numberOfLines, etc.)

const AppText = ({variant = 'body', color, style, children, ...rest}) => {
  const variantStyle = Typography[variant] || Typography.body;
  const textColor = color || Colors.textPrimary;

  // If custom style overrides fontSize larger than variant lineHeight,
  // remove variant lineHeight to prevent clipping
  const flat = StyleSheet.flatten(style) || {};
  const base = flat.fontSize && flat.fontSize > (variantStyle.lineHeight || 0)
    ? {...variantStyle, lineHeight: undefined}
    : variantStyle;

  return (
    <Text style={[base, {color: textColor}, style]} {...rest}>
      {children}
    </Text>
  );
};

export default AppText;
