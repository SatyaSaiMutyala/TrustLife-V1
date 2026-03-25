import React, {useState, useEffect} from 'react';
import {
  View,
  Modal,
  TouchableOpacity,
  TouchableWithoutFeedback,
  ScrollView,
  StyleSheet,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from './AppText';
import Icon from './Icons';

const FilterBottomSheet = ({visible, onClose, onApply, filterSections = []}) => {
  const [selections, setSelections] = useState({});

  useEffect(() => {
    if (visible) {
      const initial = {};
      filterSections.forEach(section => {
        initial[section.key] = [];
      });
      setSelections(initial);
    }
  }, [visible]);

  const toggleOption = (sectionKey, option, multi) => {
    setSelections(prev => {
      const current = prev[sectionKey] || [];
      if (multi) {
        const exists = current.includes(option);
        return {
          ...prev,
          [sectionKey]: exists
            ? current.filter(o => o !== option)
            : [...current, option],
        };
      }
      return {
        ...prev,
        [sectionKey]: current.includes(option) ? [] : [option],
      };
    });
  };

  const handleClearAll = () => {
    const cleared = {};
    filterSections.forEach(section => {
      cleared[section.key] = [];
    });
    setSelections(cleared);
  };

  const handleApply = () => {
    onApply && onApply(selections);
    onClose && onClose();
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <TouchableWithoutFeedback onPress={onClose}>
        <View style={styles.overlay}>
          <TouchableWithoutFeedback>
            <View style={styles.sheet}>
              {/* Header */}
              <View style={styles.header}>
                <AppText variant="bodyBold" style={{fontSize: ms(18)}}>Filters</AppText>
                <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                  <Icon family="Ionicons" name="close" size={24} color={Colors.textPrimary} />
                </TouchableOpacity>
              </View>

              {/* Sections */}
              <ScrollView
                style={styles.content}
                showsVerticalScrollIndicator={false}>
                {filterSections.map(section => (
                  <View key={section.key} style={styles.section}>
                    <AppText variant="bodyBold" style={styles.sectionLabel}>
                      {section.label}
                    </AppText>
                    <View style={styles.chipsWrap}>
                      {section.options.map(option => {
                        const isActive = (selections[section.key] || []).includes(option);
                        return (
                          <TouchableOpacity
                            key={option}
                            style={[styles.chip, isActive && styles.chipActive]}
                            activeOpacity={0.7}
                            onPress={() => toggleOption(section.key, option, section.multi)}>
                            <AppText
                              variant="caption"
                              color={isActive ? Colors.white : Colors.textPrimary}
                              style={{fontWeight: '500'}}>
                              {option}
                            </AppText>
                          </TouchableOpacity>
                        );
                      })}
                    </View>
                  </View>
                ))}
              </ScrollView>

              {/* Footer Buttons */}
              <View style={styles.footer}>
                <TouchableOpacity
                  style={styles.clearBtn}
                  activeOpacity={0.7}
                  onPress={handleClearAll}>
                  <AppText variant="body" color={Colors.primary} style={{fontWeight: '600'}}>
                    Clear All
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.applyBtn}
                  activeOpacity={0.7}
                  onPress={handleApply}>
                  <AppText variant="body" color={Colors.white} style={{fontWeight: '600'}}>
                    Apply Filters
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </TouchableWithoutFeedback>
        </View>
      </TouchableWithoutFeedback>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    maxHeight: '80%',
    paddingBottom: vs(20),
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: s(16),
    paddingTop: vs(16),
    paddingBottom: vs(12),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  content: {
    paddingHorizontal: s(16),
  },
  section: {
    marginTop: vs(16),
  },
  sectionLabel: {
    marginBottom: vs(10),
  },
  chipsWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  chip: {
    backgroundColor: Colors.background,
    borderRadius: ms(20),
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  footer: {
    flexDirection: 'row',
    paddingHorizontal: s(16),
    paddingTop: vs(16),
    gap: s(12),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginTop: vs(16),
  },
  clearBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(12),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: Colors.primary,
  },
  applyBtn: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(12),
    borderRadius: ms(12),
    backgroundColor: Colors.primary,
  },
});

export default FilterBottomSheet;
