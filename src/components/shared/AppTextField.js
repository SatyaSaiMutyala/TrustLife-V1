import React, {useState} from 'react';
import {View, TextInput, StyleSheet, Platform} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../shared/AppText';
import Colors from '../../constants/colors';

const FONT_FAMILY = Platform.select({ios: 'System', android: 'Roboto'});

const AppTextField = ({
  label,
  value,
  onChangeText,
  placeholder,
  hint,
  error,
  readOnly = false,
  multiline = false,
  keyboardType,
  secureTextEntry = false,
  icon,
  rightText,
}) => {
  const [focused, setFocused] = useState(false);

  const getBorderColor = () => {
    if (error) return Colors.red;
    if (focused) return Colors.accent;
    return Colors.borderLight;
  };

  return (
    <View style={styles.wrapper}>
      {label ? (
        <AppText
          variant="small"
          color={Colors.textSecondary}
          style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <View
        style={[
          styles.inputContainer,
          {borderColor: getBorderColor()},
          multiline && styles.multilineContainer,
          readOnly && styles.readOnlyContainer,
        ]}>
        {icon ? (
          <AppText style={styles.icon}>{icon}</AppText>
        ) : null}

        <TextInput
          style={[
            styles.input,
            multiline && styles.multilineInput,
            readOnly && styles.readOnlyText,
          ]}
          value={value}
          onChangeText={onChangeText}
          placeholder={placeholder}
          placeholderTextColor={Colors.textTertiary}
          editable={!readOnly}
          multiline={multiline}
          keyboardType={keyboardType}
          secureTextEntry={secureTextEntry}
          onFocus={() => setFocused(true)}
          onBlur={() => setFocused(false)}
          textAlignVertical={multiline ? 'top' : 'center'}
        />

        {rightText ? (
          <AppText
            variant="small"
            color={Colors.textTertiary}
            style={styles.rightText}>
            {rightText}
          </AppText>
        ) : null}
      </View>

      {error ? (
        <AppText variant="small" color={Colors.red} style={styles.bottomText}>
          {error}
        </AppText>
      ) : hint ? (
        <AppText
          variant="small"
          color={Colors.textTertiary}
          style={styles.bottomText}>
          {hint}
        </AppText>
      ) : null}
    </View>
  );
};

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: vs(14),
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
    marginBottom: vs(5),
  },
  inputContainer: {
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    height: vs(38),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(12),
  },
  multilineContainer: {
    height: 'auto',
    minHeight: vs(38),
    alignItems: 'flex-start',
    paddingVertical: vs(8),
  },
  readOnlyContainer: {
    backgroundColor: Colors.background,
  },
  icon: {
    marginRight: s(8),
    fontSize: ms(16),
  },
  input: {
    flex: 1,
    fontSize: ms(13),
    fontWeight: '500',
    fontFamily: FONT_FAMILY,
    color: Colors.textPrimary,
    padding: 0,
  },
  multilineInput: {
    minHeight: vs(60),
    textAlignVertical: 'top',
  },
  readOnlyText: {
    color: Colors.textSecondary,
  },
  rightText: {
    marginLeft: s(8),
  },
  bottomText: {
    marginTop: vs(3),
  },
});

export default AppTextField;
