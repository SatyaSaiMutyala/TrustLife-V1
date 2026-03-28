import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import AppTextField from '../../components/shared/AppTextField';
import Icon from '../../components/shared/Icons';
import {BLOOD_TYPES, HEALTH_CONDITIONS} from '../../constants/authData';

const HealthProfileScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const [selectedBlood, setSelectedBlood] = useState('');
  const [height, setHeight] = useState('');
  const [weight, setWeight] = useState('');
  const [selectedConditions, setSelectedConditions] = useState(new Set());
  const [allergies, setAllergies] = useState('');

  const toggleCondition = label => {
    setSelectedConditions(prev => {
      const next = new Set(prev);
      if (next.has(label)) next.delete(label);
      else next.add(label);
      return next;
    });
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex:1,marginLeft:s(10)}}>
            <AppText variant="screenName" style={st.headerTitle}>Your health profile</AppText>
            <AppText variant="caption" style={st.headerSub}>Helps Ayu give relevant insights. Skip anything {'\u2014'} update later.</AppText>
          </View>
          <AppText variant="small" color="rgba(255,255,255,0.5)">Step 4 of 7</AppText>
        </View>
      </View>

      {/* Progress */}
      <View style={st.progressTrack}>
        <View style={[st.progressFill, {width: '56%'}]} />
      </View>

      <ScrollView
        style={st.scroll}
        contentContainerStyle={st.scrollContent}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled">

        {/* Blood type */}
        <AppText variant="bodyBold" style={st.fieldLabel}>Blood type</AppText>
        <View style={st.pillRow}>
          {BLOOD_TYPES.map(bt => (
            <TouchableOpacity
              key={bt}
              style={[st.pill, selectedBlood === bt && st.pillSelected]}
              onPress={() => setSelectedBlood(bt)}
              activeOpacity={0.7}>
              <AppText
                variant="body"
                color={selectedBlood === bt ? Colors.accent : Colors.textPrimary}>
                {bt}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>

        {/* Height & Weight */}
        <AppText variant="bodyBold" style={st.fieldLabel}>Height & Weight</AppText>
        <View style={st.hwRow}>
          <View style={{flex: 1}}>
            <AppTextField
              value={height}
              onChangeText={setHeight}
              placeholder="170"
              keyboardType="numeric"
              rightText="cm"
            />
          </View>
          <View style={{flex: 1}}>
            <AppTextField
              value={weight}
              onChangeText={setWeight}
              placeholder="65"
              keyboardType="numeric"
              rightText="kg"
            />
          </View>
        </View>

        {/* Conditions */}
        <AppText variant="bodyBold" style={st.fieldLabel}>Existing conditions</AppText>
        <View style={st.conditionGrid}>
          {HEALTH_CONDITIONS.map(c => {
            const sel = selectedConditions.has(c.label);
            return (
              <TouchableOpacity
                key={c.label}
                style={[st.conditionChip, sel && st.conditionChipSel]}
                onPress={() => toggleCondition(c.label)}
                activeOpacity={0.7}>
                <AppText style={{fontSize: ms(18), lineHeight: ms(24)}}>{c.ico}</AppText>
                <AppText
                  variant="body"
                  color={sel ? Colors.accent : Colors.textPrimary}
                  numberOfLines={1}>
                  {c.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Allergies */}
        <AppText variant="bodyBold" style={st.fieldLabel}>Known allergies</AppText>
        <AppTextField
          value={allergies}
          onChangeText={setAllergies}
          placeholder="e.g. Penicillin, Sulpha drugs"
        />

        <View style={{height: vs(80)}} />
      </ScrollView>

      {/* Bottom CTA */}
      <View style={[st.bottomBar, {paddingBottom: insets.bottom + vs(12)}]}>
        <TouchableOpacity
          style={st.ctaBtn}
          onPress={() => navigation.navigate('Medications')}
          activeOpacity={0.7}>
          <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>Continue</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
        </TouchableOpacity>
        <TouchableOpacity
          onPress={() => navigation.navigate('Medications')}
          style={st.skipLink}>
          <AppText variant="caption" color={Colors.textTertiary}>Skip for now</AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingBottom: vs(14), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(6)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center', paddingRight: ms(2)},
  headerTitle: {color: Colors.white, fontSize: ms(18), fontWeight: '700'},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  progressTrack: {height: 3, backgroundColor: Colors.borderLight},
  progressFill: {height: 3, backgroundColor: Colors.accent},
  scroll: {flex: 1},
  scrollContent: {paddingHorizontal: s(20), paddingTop: vs(20), paddingBottom: vs(20)},
  fieldLabel: {color: Colors.textPrimary, marginBottom: vs(6), marginTop: vs(4)},
  pillRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(4), marginBottom: vs(14)},
  pill: {backgroundColor: Colors.white, borderRadius: ms(20), paddingHorizontal: s(14), paddingVertical: vs(8)},
  pillSelected: {backgroundColor: Colors.tealBg, borderWidth: 1, borderColor: Colors.accent},
  hwRow: {flexDirection: 'row', gap: s(12), marginBottom: vs(4)},
  conditionGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(4), marginBottom: vs(14)},
  conditionChip: {width: '48%', flexDirection: 'row', alignItems: 'center', backgroundColor: Colors.white, borderRadius: ms(14), padding: s(12), gap: s(4)},
  conditionChipSel: {backgroundColor: Colors.tealBg, borderWidth: 1, borderColor: Colors.accent},
  bottomBar: {paddingHorizontal: s(20), paddingTop: vs(12), backgroundColor: Colors.background, borderTopWidth: 0.5, borderTopColor: Colors.borderLight},
  ctaBtn: {backgroundColor: Colors.primary, borderRadius: ms(14), paddingVertical: vs(16), alignItems: 'center'},
  skipLink: {alignItems: 'center', marginTop: vs(12)},
});

export default HealthProfileScreen;
