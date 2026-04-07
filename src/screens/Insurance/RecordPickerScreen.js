import React, {useState, useMemo} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const FILTERS = [{key: 'all', label: 'All'}, {key: 'lab', label: 'Lab', icon: 'flask-outline'}, {key: 'consult', label: 'Consults', icon: 'medkit-outline'}, {key: 'med', label: 'Meds', icon: 'medical-outline'}, {key: 'imaging', label: 'Imaging', icon: 'scan-outline'}];

const RECORDS = [
  {group: '28 March 2026 \u00B7 Today', items: [
    {id: 'pr1', cat: 'consult', icon: 'medkit-outline', name: 'Consultation \u00B7 Dr. Kavitha Sharma', sub: 'Apollo Clinic \u00B7 28 Mar 2026', amt: 800, attach: 'Prescription will be attached'},
    {id: 'pr2', cat: 'lab', icon: 'flask-outline', name: 'CBC + HbA1c + Lipid panel', sub: 'TrustLab \u00B7 28 Mar 2026', amt: 2400, attach: 'Lab report + iron panel attached'},
    {id: 'pr3', cat: 'med', icon: 'medical-outline', name: 'Metformin + Olmesartan + Ferrous sulphate', sub: 'Apollo Pharmacy \u00B7 28 Mar 2026', amt: 1250, attach: 'Prescription attached'},
    {id: 'pr4', cat: 'imaging', icon: 'scan-outline', name: 'Ultrasound abdomen \u00B7 NAFLD follow-up', sub: 'Apollo Diagnostics \u00B7 28 Mar 2026', amt: 1800, attach: 'Scan report attached'},
  ]},
  {group: '10 January 2026', items: [
    {id: 'pr5', cat: 'lab', icon: 'beaker-outline', name: 'CBC + Iron panel \u00B7 Anaemia workup', sub: 'Thyrocare \u00B7 10 Jan 2026', amt: 1800, attach: 'Full CBC + ferritin + B12 attached'},
    {id: 'pr6', cat: 'consult', icon: 'medkit-outline', name: 'Endocrinology review \u00B7 Dr. Meera Rao', sub: 'KIMS Hospital \u00B7 10 Jan 2026', amt: 1200, attach: 'Consultation notes attached'},
  ]},
  {group: 'March 2025', items: [
    {id: 'pr7', cat: 'lab', icon: 'flask-outline', name: 'HbA1c + Lipid panel \u00B7 Annual', sub: 'SRL Diagnostics \u00B7 12 Mar 2025', amt: 1600, attach: 'Full panel PDF attached'},
    {id: 'pr8', cat: 'med', icon: 'medical-outline', name: 'Topiramate 50mg + Sumatriptan 50mg', sub: 'MedPlus \u00B7 15 Mar 2025', amt: 980, attach: 'Migraine prescription attached'},
  ]},
];

const RecordPickerScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [filter, setFilter] = useState('all');
  const [selected, setSelected] = useState({});

  const toggle = (item) => {
    setSelected(prev => {
      const next = {...prev};
      if (next[item.id]) delete next[item.id];
      else next[item.id] = item;
      return next;
    });
  };

  const count = Object.keys(selected).length;
  const total = Object.values(selected).reduce((s2, v) => s2 + v.amt, 0);

  const filtered = useMemo(() => {
    if (filter === 'all') return RECORDS;
    return RECORDS.map(g => ({...g, items: g.items.filter(i => i.cat === filter)})).filter(g => g.items.length > 0);
  }, [filter]);

  const confirm = () => {
    navigation.goBack();
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={[st.header, {paddingTop: insets.top + vs(8)}]}>
        <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(10)}}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <AppText variant="caption" color="rgba(255,255,255,0.6)">{'\u2039'} Back to claim</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={[st.addBtn, count > 0 && st.addBtnOn]} onPress={confirm} activeOpacity={0.7}>
            <AppText variant="caption" color={count > 0 ? Colors.white : 'rgba(255,255,255,0.5)'} style={{fontWeight: '700'}}>Add selected</AppText>
          </TouchableOpacity>
        </View>
        <AppText variant="subtext" color="rgba(255,255,255,0.38)" style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.8, marginBottom: vs(3)}}>All Records</AppText>
        <AppText variant="header" color={Colors.white} style={{fontSize: ms(17), marginBottom: vs(2)}}>Select records to claim</AppText>
        <AppText variant="caption" color="rgba(255,255,255,0.4)" style={{marginBottom: vs(10)}}>
          {count > 0 ? `${count} record${count !== 1 ? 's' : ''} selected \u00B7 \u20B9${total.toLocaleString('en-IN')}` : 'Tap to select \u00B7 0 selected'}
        </AppText>

        {/* Filter tabs */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{gap: s(6)}}>
          {FILTERS.map(f => {
            const on = filter === f.key;
            return (
              <TouchableOpacity key={f.key} style={[st.tab, on && st.tabOn]} onPress={() => setFilter(f.key)} activeOpacity={0.7}>
                {f.icon && <Icon family="Ionicons" name={f.icon} size={ms(12)} color={on ? Colors.primary : 'rgba(255,255,255,0.5)'} />}
                <AppText variant="caption" color={on ? Colors.primary : 'rgba(255,255,255,0.5)'} style={{fontWeight: '600'}}>{f.label}</AppText>
              </TouchableOpacity>
            );
          })}
        </ScrollView>
      </View>

      <ScrollView style={{flex: 1}} contentContainerStyle={{padding: s(13), paddingBottom: vs(110)}} showsVerticalScrollIndicator={false}>
        {filtered.map((group, gi) => (
          <View key={gi}>
            <View style={st.dateGroup}>
              <AppText variant="small" color={Colors.textSecondary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(8)}}>{group.group}</AppText>
              <View style={{flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'}} />
            </View>
            {group.items.map(item => {
              const on = !!selected[item.id];
              return (
                <TouchableOpacity key={item.id} style={[st.pickerRow, on && st.pickerRowOn]} onPress={() => toggle(item)} activeOpacity={0.7}>
                  <View style={[st.pickerCheck, on && st.pickerCheckOn]}>
                    {on && <Icon family="Ionicons" name="checkmark" size={ms(13)} color={Colors.white} />}
                  </View>
                  <Icon family="Ionicons" name={item.icon} size={ms(20)} color={on ? Colors.primary : Colors.textSecondary} />
                  <View style={{flex: 1}}>
                    <AppText variant="bodyBold" color={Colors.textPrimary}>{item.name}</AppText>
                    <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>{item.sub}</AppText>
                    <View style={{flexDirection: 'row', alignItems: 'center', gap: s(4), marginTop: vs(2)}}>
                      <Icon family="Ionicons" name="attach-outline" size={ms(11)} color={Colors.tealText} />
                      <AppText variant="subtext" color={Colors.tealText}>{item.attach}</AppText>
                    </View>
                  </View>
                  <AppText variant="bodyBold" color={Colors.primary} style={{fontSize: ms(13), fontWeight: '800', flexShrink: 0}}>{'\u20B9'}{item.amt.toLocaleString('en-IN')}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        ))}
      </ScrollView>

      {/* Bottom bar */}
      <View style={st.bottomBar}>
        <AppText variant="caption" color={Colors.textTertiary} style={{textAlign: 'center', marginBottom: vs(8)}}>
          {count > 0 ? `${count} selected \u00B7 \u20B9${total.toLocaleString('en-IN')}` : 'No records selected'}
        </AppText>
        <TouchableOpacity style={[st.confirmBtn, count > 0 && st.confirmBtnOn]} onPress={confirm} activeOpacity={0.7}>
          <AppText variant="bodyBold" color={Colors.white}>
            {count > 0 ? `Add ${count} record${count !== 1 ? 's' : ''} (\u20B9${total.toLocaleString('en-IN')})` : 'Add to claim'}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(12)},
  addBtn: {backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: ms(10), paddingHorizontal: s(14), paddingVertical: vs(7)},
  addBtnOn: {backgroundColor: 'rgba(255,255,255,0.2)'},
  tab: {flexDirection: 'row', alignItems: 'center', gap: s(4), paddingHorizontal: s(12), paddingVertical: vs(7), borderRadius: ms(10), backgroundColor: 'rgba(255,255,255,0.1)', borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.15)'},
  tabOn: {backgroundColor: Colors.white, borderColor: Colors.white},
  dateGroup: {flexDirection: 'row', alignItems: 'center', marginTop: vs(12), marginBottom: vs(8)},
  pickerRow: {backgroundColor: Colors.white, borderRadius: ms(13), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(11), marginBottom: vs(7), flexDirection: 'row', alignItems: 'center', gap: s(10)},
  pickerRowOn: {borderColor: Colors.primary, backgroundColor: '#f0f7f4'},
  pickerCheck: {width: ms(22), height: ms(22), borderRadius: ms(7), borderWidth: 1.5, borderColor: '#dde8e2', alignItems: 'center', justifyContent: 'center'},
  pickerCheckOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  bottomBar: {position: 'absolute', bottom: 0, left: 0, right: 0, backgroundColor: Colors.white, borderTopWidth: 0.5, borderTopColor: '#dde8e2', paddingHorizontal: s(13), paddingTop: vs(10), paddingBottom: Platform.OS === 'ios' ? vs(28) : vs(12)},
  confirmBtn: {backgroundColor: '#a3bfb3', borderRadius: ms(13), paddingVertical: vs(14), alignItems: 'center'},
  confirmBtnOn: {backgroundColor: Colors.primary},
});

export default RecordPickerScreen;
