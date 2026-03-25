import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const filterSections = [
  {title: 'Gender', options: ['Male', 'Female']},
  {title: 'Age', options: ['Infant', 'Kids', 'Teenage', 'Adults']},
  {title: 'Organs', options: ['Heart', 'Thyroid', 'Lungs', 'Adults']},
  {title: 'Lifestyle', options: ['Smoker', 'Drinker', 'Fitness', 'Obesity']},
  {title: 'Seasonal', options: ['Summer', 'Winter', 'Monsoon', 'Rainy']},
  {title: 'Medical Conditions', options: ['Fever', 'Diabetes', 'Vitamins Deficiency']},
];

const defaultSelected = ['Male', 'Adults', 'Thyroid', 'Fitness', 'Summer', 'Fever'];

const LabFilterScreen = () => {
  const navigation = useNavigation();
  const [selected, setSelected] = useState(defaultSelected);

  const toggleChip = (option) => {
    setSelected(prev =>
      prev.includes(option)
        ? prev.filter(item => item !== option)
        : [...prev, option],
    );
  };

  const handleApply = () => {
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <AppText variant="header" color={Colors.white} style={{flex: 1}}>
          Filters
        </AppText>
        <TouchableOpacity
          style={styles.closeButton}
          onPress={() => navigation.goBack()}>
          <Icon family="Ionicons" name="close" size={22} color={Colors.white} />
        </TouchableOpacity>
      </View>

      <ScrollView
        style={styles.content}
        contentContainerStyle={{paddingBottom: vs(100)}}
        showsVerticalScrollIndicator={false}>

        {filterSections.map(section => (
          <View key={section.title} style={styles.section}>
            <AppText variant="bodyBold" style={{marginBottom: vs(10)}}>
              {section.title}
            </AppText>
            <View style={styles.chipRow}>
              {section.options.map(option => {
                const isActive = selected.includes(option);
                return (
                  <TouchableOpacity
                    key={option}
                    style={[
                      styles.chip,
                      isActive && styles.chipActive,
                    ]}
                    onPress={() => toggleChip(option)}>
                    <AppText
                      variant="caption"
                      color={isActive ? Colors.white : Colors.textPrimary}>
                      {option}
                    </AppText>
                    {isActive && (
                      <Icon
                        family="Ionicons"
                        name="close-circle"
                        size={16}
                        color={Colors.white}
                        style={{marginLeft: s(4)}}
                      />
                    )}
                  </TouchableOpacity>
                );
              })}
            </View>
          </View>
        ))}
      </ScrollView>

      {/* Bottom Sticky Apply */}
      <View style={styles.bottomBar}>
        <TouchableOpacity style={styles.applyButton} onPress={handleApply}>
          <AppText variant="bodyBold" color={Colors.white}>Apply</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.primary,
    paddingTop: vs(16),
    paddingHorizontal: s(16),
    paddingBottom: vs(16),
  },
  closeButton: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: 'rgba(255,255,255,0.15)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  content: {
    flex: 1,
    paddingHorizontal: s(16),
  },
  section: {
    marginTop: vs(20),
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  chip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(22),
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
    marginRight: s(8),
    marginBottom: vs(8),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  bottomBar: {
    backgroundColor: Colors.white,
    paddingHorizontal: s(16),
    paddingVertical: vs(14),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  applyButton: {
    backgroundColor: Colors.primary,
    borderRadius: ms(10),
    paddingVertical: vs(14),
    alignItems: 'center',
  },
});

export default LabFilterScreen;
