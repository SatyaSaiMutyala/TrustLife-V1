import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet, Platform} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';

const FONT_FAMILY = Platform.select({ios: 'System', android: 'Roboto'});
import AppText from '../shared/AppText';
import Colors from '../../constants/colors';

const AppDropdown = ({
  label,
  value,
  options = [],
  onSelect,
  placeholder = 'Select an option',
  hint,
}) => {
  const [open, setOpen] = useState(false);

  const handleSelect = option => {
    onSelect(option);
    setOpen(false);
  };

  return (
    <View style={[styles.wrapper, open && {zIndex: 999}]}>
      {label ? (
        <AppText
          variant="small"
          color={Colors.textSecondary}
          style={styles.label}>
          {label}
        </AppText>
      ) : null}

      <TouchableOpacity
        activeOpacity={0.7}
        style={styles.trigger}
        onPress={() => setOpen(prev => !prev)}>
        <AppText
          variant="body"
          color={value ? Colors.textPrimary : Colors.textTertiary}
          style={styles.triggerText}>
          {value || placeholder}
        </AppText>
        <AppText
          variant="small"
          color={Colors.textTertiary}
          style={styles.chevron}>
          ▼
        </AppText>
      </TouchableOpacity>

      {open && options.length > 0 ? (
        <View style={styles.optionsList}>
          {options.map((option, index) => {
            const isSelected = option === value;
            const isLast = index === options.length - 1;

            return (
              <TouchableOpacity
                key={option}
                activeOpacity={0.6}
                style={[
                  styles.option,
                  isSelected && styles.selectedOption,
                  !isLast && styles.optionBorder,
                ]}
                onPress={() => handleSelect(option)}>
                <AppText
                  variant="body"
                  color={isSelected ? Colors.primary : Colors.textPrimary}
                  style={isSelected ? styles.selectedText : undefined}>
                  {option}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      ) : null}

      {hint ? (
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
    zIndex: 1,
  },
  label: {
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    fontWeight: '600',
    marginBottom: vs(5),
  },
  trigger: {
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    height: vs(38),
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(12),
  },
  triggerText: {
    flex: 1,
    fontWeight: '500',
    fontFamily: FONT_FAMILY,
    fontSize: ms(13),
  },
  chevron: {
    marginLeft: s(8),
    fontSize: ms(10),
  },
  optionsList: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginTop: vs(2),
    elevation: 6,
    shadowColor: '#000',
    shadowOpacity: 0.12,
    shadowRadius: 10,
    shadowOffset: {width: 0, height: 4},
    overflow: 'hidden',
    zIndex: 999,
  },
  option: {
    paddingVertical: vs(10),
    paddingHorizontal: s(12),
  },
  selectedOption: {
    backgroundColor: Colors.tealBg,
  },
  optionBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  selectedText: {
    fontWeight: '600',
  },
  bottomText: {
    marginTop: vs(3),
  },
});

export default AppDropdown;
