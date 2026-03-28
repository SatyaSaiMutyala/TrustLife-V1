import React, {useState, useCallback} from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar, ScrollView, Alert} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import AppTextField from '../../components/shared/AppTextField';
import Icon from '../../components/shared/Icons';
import {DEFAULT_MEDICATIONS, MEDICATION_DATABASE} from '../../constants/authData';

const MedicationsScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [searchQuery, setSearchQuery] = useState('');
  const [medications, setMedications] = useState(DEFAULT_MEDICATIONS);

  const filteredResults = searchQuery.length > 0
    ? MEDICATION_DATABASE.filter(
        m => m.toLowerCase().includes(searchQuery.toLowerCase()) &&
             !medications.find(med => med.name === m),
      )
    : [];

  const addMedication = useCallback((name) => {
    const id = name.toLowerCase().replace(/\s+/g, '_');
    setMedications(prev => [...prev, {id, name, dose: 'Tap to set dosage'}]);
    setSearchQuery('');
  }, []);

  const removeMedication = useCallback((id) => {
    setMedications(prev => prev.filter(m => m.id !== id));
  }, []);

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Green header */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <View style={styles.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex:1,marginLeft:s(10)}}>
            <AppText variant="screenName" style={styles.headerTitle}>Current medications</AppText>
            <AppText variant="caption" style={styles.headerSub}>Add your current medications or skip for now.</AppText>
          </View>
          <AppText variant="small" color="rgba(255,255,255,0.5)">Step 5 of 7</AppText>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: '70%'}]} />
      </View>

      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Search */}
        <AppText variant="sectionTitle" style={styles.fieldLabel}>Search medications</AppText>
        <View style={styles.searchWrapper}>
          <AppTextField
            value={searchQuery}
            onChangeText={setSearchQuery}
            placeholder="Search or type medication name..."
            icon="🔍"
          />
          {filteredResults.length > 0 && (
            <View style={styles.dropdown}>
              {filteredResults.map((item, i) => (
                <TouchableOpacity
                  key={i}
                  style={styles.dropdownItem}
                  onPress={() => addMedication(item)}>
                  <AppText variant="body">{item}</AppText>
                </TouchableOpacity>
              ))}
            </View>
          )}
        </View>

        {/* Medications list */}
        <AppText variant="sectionTitle" style={styles.fieldLabel}>Your medications</AppText>
        {medications.map((med) => (
          <View key={med.id} style={styles.card}>
            <View style={styles.medIcon}><Icon family="MaterialCommunityIcons" name="pill" size={20} color={Colors.accent} /></View>
            <View style={styles.medInfo}>
              <AppText variant="bodyBold">{med.name}</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>{med.dose}</AppText>
            </View>
            <TouchableOpacity onPress={() => removeMedication(med.id)} style={styles.removeBtn}>
              <Icon family="Ionicons" name="close" size={16} color={Colors.textTertiary} />
            </TouchableOpacity>
          </View>
        ))}

        {/* Scan prescription */}
        <AppText variant="sectionTitle" style={styles.fieldLabel}>Import prescription</AppText>
        <TouchableOpacity style={styles.uploadZone} activeOpacity={0.7}>
          <Icon family="Ionicons" name="camera-outline" size={24} color={Colors.textSecondary} />
          <AppText variant="bodyBold" style={styles.uploadTitle}>Scan prescription</AppText>
          <AppText variant="caption" color={Colors.textSecondary}>Auto-extract from photo</AppText>
        </TouchableOpacity>
      </ScrollView>

      {/* Bottom bar */}
      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + vs(12)}]}>
        <TouchableOpacity
          style={styles.ctaBtn}
          onPress={() => navigation.navigate('Plan')}
          activeOpacity={0.7}>
          <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>Continue</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
        </TouchableOpacity>
        <TouchableOpacity onPress={() => navigation.navigate('Plan')} style={styles.skipLink}>
          <AppText variant="caption" color={Colors.textSecondary}>Skip — add later</AppText>
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
  header: {backgroundColor: Colors.primary, paddingBottom: vs(14), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  backText: {color: Colors.white, fontSize: ms(15)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  progressTrack: {height: 3, backgroundColor: Colors.borderLight},
  progressFill: {height: 3, backgroundColor: Colors.accent},
  scroll: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: s(20),
    paddingTop: vs(20),
    paddingBottom: vs(20),
  },
  fieldLabel: {color: Colors.textPrimary, marginBottom: vs(6), marginTop: vs(4)},
  searchWrapper: {
    position: 'relative',
    zIndex: 10,
    marginBottom: vs(4),
  },
  dropdown: {
    position: 'absolute',
    top: '100%',
    left: 0,
    right: 0,
    zIndex: 10,
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    marginTop: vs(4),
    paddingVertical: vs(4),
    elevation: 4,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  dropdownItem: {
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(8),
    flexDirection: 'row',
    alignItems: 'center',
  },
  medIcon: {
    fontSize: ms(20),
    marginRight: s(12),
  },
  medInfo: {
    flex: 1,
  },
  removeBtn: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(14),
    backgroundColor: Colors.redBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  removeText: {
    fontSize: ms(12),
    color: Colors.red,
    fontWeight: '700',
  },
  uploadZone: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(20),
    marginBottom: vs(8),
    alignItems: 'center',
    borderWidth: 1.5,
    borderStyle: 'dashed',
    borderColor: Colors.borderLight,
  },
  cameraIcon: {
    fontSize: ms(28),
    marginBottom: vs(6),
  },
  uploadTitle: {
    marginBottom: vs(2),
  },
  bottomBar: {
    paddingHorizontal: s(20),
    paddingTop: vs(12),
    backgroundColor: Colors.background,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  ctaBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(14),
    paddingVertical: vs(16),
    alignItems: 'center',
  },
  skipLink: {
    alignItems: 'center',
    marginTop: vs(12),
  },
});

export default MedicationsScreen;
