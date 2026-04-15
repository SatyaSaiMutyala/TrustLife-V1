import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, Platform, TextInput} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../../constants/colors';
import AppText from '../../../../components/shared/AppText';
import Icon from '../../../../components/shared/Icons';

// ──────────────────────────────────────────────
// Constants
// ──────────────────────────────────────────────

const ROSE = '#C2185B';
const ROSE_BG = '#FCE4EC';

const WHERE_INITIAL = [
  {key: 'bp-where-1', icon: 'business-outline', name: 'Apollo Hospital, Jubilee Hills', detail: 'Primary - Dr. Suma Rao - NICU - private room'},
  {key: 'bp-where-2', icon: 'business-outline', name: 'KIMS Hospital, Secunderabad', detail: 'Backup if Apollo full'},
  {key: 'bp-where-3', icon: 'business-outline', name: 'Fernandez Hospital', detail: 'Specialist maternity care'},
];

const BIRTH_PLAN_SECTIONS = [
  {
    title: 'Delivery type preference',
    options: [
      {key: 'bp-type-1', icon: 'female-outline', name: 'Vaginal delivery if possible', detail: ''},
      {key: 'bp-type-2', icon: 'medkit-outline', name: 'Elective Caesarean', detail: ''},
      {key: 'bp-type-3', icon: 'water-outline', name: 'Water birth (if available)', detail: ''},
    ],
  },
  {
    title: 'Birth support',
    options: [
      {key: 'bp-supp-1', icon: 'people-outline', name: 'Partner throughout labour & birth', detail: ''},
      {key: 'bp-supp-2', icon: 'heart-outline', name: 'Mother / MIL for early labour', detail: ''},
      {key: 'bp-supp-3', icon: 'person-outline', name: 'Doula / birth companion', detail: ''},
    ],
  },
  {
    title: 'Newborn preferences',
    options: [
      {key: 'bp-nb-1', icon: 'happy-outline', name: 'Immediate skin-to-skin', detail: 'Minimum 1 hour'},
      {key: 'bp-nb-2', icon: 'time-outline', name: 'Delayed cord clamping', detail: 'Minimum 1 minute'},
      {key: 'bp-nb-3', icon: 'nutrition-outline', name: 'Breastfeed within 1st hour', detail: ''},
      {key: 'bp-nb-4', icon: 'camera-outline', name: 'No photos during pushing / birth', detail: ''},
    ],
  },
];

const LABOUR_SECTIONS = [
  {
    title: 'Pain management',
    options: [
      {key: 'lab-pm-1', icon: 'leaf-outline', name: 'Non-pharmacological first', detail: 'Massage, breathing, warm water'},
      {key: 'lab-pm-2', icon: 'medkit-outline', name: 'Epidural if requested', detail: ''},
      {key: 'lab-pm-3', icon: 'eyedrop-outline', name: 'Pethidine / fentanyl IV', detail: ''},
      {key: 'lab-pm-4', icon: 'close-circle-outline', name: 'No pain meds unless I ask', detail: ''},
    ],
  },
  {
    title: 'During labour',
    options: [
      {key: 'lab-dur-1', icon: 'walk-outline', name: 'Freedom to move / birthing ball', detail: ''},
      {key: 'lab-dur-2', icon: 'hardware-chip-outline', name: 'IV access but no routine drip', detail: ''},
      {key: 'lab-dur-3', icon: 'pulse-outline', name: 'Intermittent foetal monitoring', detail: ''},
      {key: 'lab-dur-4', icon: 'cut-outline', name: 'Avoid episiotomy unless emergency', detail: ''},
    ],
  },
  {
    title: 'If Caesarean is needed',
    options: [
      {key: 'lab-cs-1', icon: 'people-outline', name: 'Partner present in theatre', detail: ''},
      {key: 'lab-cs-2', icon: 'happy-outline', name: 'Skin-to-skin in theatre', detail: ''},
      {key: 'lab-cs-3', icon: 'eye-outline', name: 'Transparent drape for birth', detail: ''},
    ],
  },
];

const HOSPITAL_BAG = [
  {key: 'bag-1', icon: 'card-outline', text: 'ID + insurance card'},
  {key: 'bag-2', icon: 'document-text-outline', text: 'Antenatal records'},
  {key: 'bag-3', icon: 'shirt-outline', text: '2 loose nightgowns'},
  {key: 'bag-4', icon: 'shirt-outline', text: 'Dark disposable underwear'},
  {key: 'bag-5', icon: 'woman-outline', text: 'Nursing bras (x3)'},
  {key: 'bag-6', icon: 'fast-food-outline', text: 'Snacks for labour'},
  {key: 'bag-7', icon: 'sparkles-outline', text: 'Toiletries / lip balm'},
  {key: 'bag-8', icon: 'happy-outline', text: 'Baby: vest, suit, nappy'},
  {key: 'bag-9', icon: 'car-outline', text: 'Car seat installed'},
  {key: 'bag-10', icon: 'battery-charging-outline', text: 'Charger / camera'},
];

const RECOVERY_ITEMS = [
  {key: 'rec-1', icon: 'water-outline', name: 'Lochia log'},
  {key: 'rec-2', icon: 'thermometer-outline', name: 'Temperature check'},
  {key: 'rec-3', icon: 'heart-outline', name: 'BP monitoring'},
  {key: 'rec-4', icon: 'nutrition-outline', name: 'Breastfeed log'},
  {key: 'rec-5', icon: 'medkit-outline', name: 'IFA resumed'},
  {key: 'rec-6', icon: 'moon-outline', name: 'Sleep & rest'},
];

const LOCHIA_DOTS = [
  {key: 'l1', label: 'Red', color: '#C0392B'},
  {key: 'l2', label: 'Pink-R', color: '#E8756A'},
  {key: 'l3', label: 'Pink-B', color: '#C4847A'},
  {key: 'l4', label: 'Brown', color: '#A0785A'},
  {key: 'l5', label: 'Yell-B', color: '#C8B090'},
  {key: 'l6', label: 'Yellow', color: '#E8D8C0'},
  {key: 'l7', label: 'White', color: '#F0E8D8'},
];

const PAD_COUNT_OPTS = ['0-2', '3-4', '5-6', '7+'];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const Section = ({title}) => (
  <View style={st.sec}>
    <AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{title}</AppText>
    <View style={st.secLine} />
  </View>
);

const BpOption = ({option, active, onToggle}) => (
  <TouchableOpacity
    activeOpacity={0.75}
    onPress={onToggle}
    style={[st.bpOption, active && st.bpOptionActive]}>
    <View style={[st.checkbox, active && st.checkboxActive]}>
      {active && <Icon family="Ionicons" name="checkmark" size={ms(14)} color={Colors.white} />}
    </View>
    <Icon family="Ionicons" name={option.icon} size={ms(18)} color={active ? ROSE : Colors.textSecondary} />
    <View style={{flex: 1}}>
      <AppText variant="bodyBold" color={active ? ROSE : Colors.textPrimary} style={{fontSize: ms(13)}}>
        {option.name}
      </AppText>
      {!!option.detail && (
        <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(14)}}>
          {option.detail}
        </AppText>
      )}
    </View>
  </TouchableOpacity>
);

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const BirthPlanScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [whereOptions, setWhereOptions] = useState(WHERE_INITIAL);
  const [newHospital, setNewHospital] = useState('');
  const [bpToggles, setBpToggles] = useState({});
  const [labToggles, setLabToggles] = useState({});

  const addHospital = () => {
    const name = newHospital.trim();
    if (!name) return;
    const key = `bp-where-custom-${Date.now()}`;
    setWhereOptions((prev) => [...prev, {key, icon: 'business-outline', name, detail: 'Added by you'}]);
    setBpToggles((p) => ({...p, [key]: true}));
    setNewHospital('');
  };
  const [bagChecked, setBagChecked] = useState({});
  const [recoveryDone, setRecoveryDone] = useState({});
  const [selectedLochia, setSelectedLochia] = useState(null);
  const [padCount, setPadCount] = useState(0);

  const toggleBp = (key) => setBpToggles((p) => ({...p, [key]: !p[key]}));
  const toggleLab = (key) => setLabToggles((p) => ({...p, [key]: !p[key]}));
  const toggleBag = (key) => setBagChecked((p) => ({...p, [key]: !p[key]}));
  const toggleRecovery = (key) => setRecoveryDone((p) => ({...p, [key]: !p[key]}));

  const bagPacked = Object.values(bagChecked).filter(Boolean).length;
  const recoveryCount = Object.values(recoveryDone).filter(Boolean).length;

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── HEADER ── */}
      <View style={[st.header, {paddingTop: insets.top + vs(10)}]}>
        <View style={st.topRow}>
          <TouchableOpacity
            style={st.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={{color: Colors.white, fontSize: ms(18), fontWeight: '700'}}>Birth plan</AppText>
            <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', fontSize: ms(11)}}>Week 16 - preferences & prep</AppText>
          </View>
        </View>
      </View>

      {/* ── BODY ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>

        {/* Where to deliver */}
        <Section title="Where to deliver" />
        <View style={st.card}>
          {whereOptions.map((opt) => (
            <BpOption
              key={opt.key}
              option={opt}
              active={!!bpToggles[opt.key]}
              onToggle={() => toggleBp(opt.key)}
            />
          ))}
          <View style={st.addRow}>
            <TextInput
              style={st.addInput}
              placeholder="Add your delivery hospital"
              placeholderTextColor={Colors.textTertiary}
              value={newHospital}
              onChangeText={setNewHospital}
              returnKeyType="done"
              onSubmitEditing={addHospital}
            />
            <TouchableOpacity style={st.addBtn} activeOpacity={0.8} onPress={addHospital}>
              <Icon family="Ionicons" name="add" size={ms(16)} color={Colors.white} />
              <AppText variant="subtext" color={Colors.white} style={{fontWeight: '700', marginLeft: s(4)}}>Add</AppText>
            </TouchableOpacity>
          </View>
        </View>

        {/* Birth plan */}
        {BIRTH_PLAN_SECTIONS.map((sec) => (
          <React.Fragment key={sec.title}>
            <Section title={sec.title} />
            <View style={st.card}>
              {sec.options.map((opt) => (
                <BpOption
                  key={opt.key}
                  option={opt}
                  active={!!bpToggles[opt.key]}
                  onToggle={() => toggleBp(opt.key)}
                />
              ))}
            </View>
          </React.Fragment>
        ))}

        {/* Labour */}
        {LABOUR_SECTIONS.map((sec) => (
          <React.Fragment key={sec.title}>
            <Section title={sec.title} />
            <View style={st.card}>
              {sec.options.map((opt) => (
                <BpOption
                  key={opt.key}
                  option={opt}
                  active={!!labToggles[opt.key]}
                  onToggle={() => toggleLab(opt.key)}
                />
              ))}
            </View>
          </React.Fragment>
        ))}

        {/* Hospital bag */}
        <Section title={`Hospital bag · ${bagPacked}/${HOSPITAL_BAG.length} packed`} />
        <View style={st.card}>
          {HOSPITAL_BAG.map((item, i) => {
            const done = !!bagChecked[item.key];
            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.7}
                onPress={() => toggleBag(item.key)}
                style={[st.bagRow, i === HOSPITAL_BAG.length - 1 && {borderBottomWidth: 0}]}>
                <View style={[st.checkbox, done && st.checkboxActive]}>
                  {done && <Icon family="Ionicons" name="checkmark" size={ms(14)} color={Colors.white} />}
                </View>
                <Icon family="Ionicons" name={item.icon} size={ms(16)} color={done ? ROSE : Colors.textSecondary} />
                <AppText variant="caption" color={done ? ROSE : Colors.textPrimary} style={{flex: 1, fontWeight: done ? '700' : '500'}}>
                  {item.text}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Postpartum recovery items */}
        <Section title={`Recovery tracker · ${recoveryCount}/${RECOVERY_ITEMS.length}`} />
        <View style={st.recoveryGrid}>
          {RECOVERY_ITEMS.map((item) => {
            const done = !!recoveryDone[item.key];
            return (
              <TouchableOpacity
                key={item.key}
                activeOpacity={0.7}
                onPress={() => toggleRecovery(item.key)}
                style={[st.recoveryTile, done && st.recoveryTileActive]}>
                <Icon family="Ionicons" name={item.icon} size={ms(22)} color={done ? ROSE : Colors.textSecondary} />
                <AppText variant="subtext" color={done ? ROSE : Colors.textPrimary} style={{fontWeight: done ? '700' : '500', marginTop: vs(6), textAlign: 'center', fontSize: ms(10)}}>
                  {item.name}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* Lochia */}
        <Section title="Lochia colour" />
        <View style={st.card}>
          <View style={st.lochiaRow}>
            {LOCHIA_DOTS.map((d) => {
              const isOn = selectedLochia === d.key;
              return (
                <TouchableOpacity
                  key={d.key}
                  activeOpacity={0.7}
                  onPress={() => setSelectedLochia(d.key)}
                  style={[st.lochiaWrap, isOn && {borderColor: ROSE, borderWidth: 2}]}>
                  <View style={[st.lochiaDot, {backgroundColor: d.color}]} />
                  <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(8), marginTop: vs(3)}}>{d.label}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* Pad count */}
        <Section title="Pads used (last 24h)" />
        <View style={st.card}>
          <View style={st.chipWrap}>
            {PAD_COUNT_OPTS.map((o, i) => {
              const isOn = padCount === i;
              return (
                <TouchableOpacity
                  key={o}
                  style={[st.mchip, isOn && st.mchipOn]}
                  onPress={() => setPadCount(i)}
                  activeOpacity={0.7}>
                  <AppText variant="caption" color={isOn ? ROSE : '#555'} style={{fontWeight: isOn ? '700' : '500'}}>{o}</AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        <View style={{height: vs(20)}} />
      </ScrollView>

      {/* ── Save Button ── */}
      <View style={st.bottomBar}>
        <TouchableOpacity style={st.primaryButton} activeOpacity={0.85}>
          <Icon family="Ionicons" name="save-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
            Save birth plan
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// Styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  // Header
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(12)},
  topRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(8)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(12)},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7), fontSize: ms(9)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Card
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(10), marginBottom: vs(4)},

  // Birth plan option
  bpOption: {flexDirection: 'row', alignItems: 'flex-start', gap: s(10), padding: ms(10), borderRadius: ms(12), backgroundColor: Colors.white, borderWidth: 1, borderColor: '#E5DDD3', marginBottom: vs(6)},
  bpOptionActive: {backgroundColor: ROSE_BG, borderColor: ROSE},
  checkbox: {width: ms(22), height: ms(22), borderRadius: ms(6), borderWidth: 1.5, borderColor: '#D5D5D5', alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.white, marginTop: vs(1)},
  checkboxActive: {backgroundColor: ROSE, borderColor: ROSE},

  // Add custom hospital
  addRow: {flexDirection: 'row', alignItems: 'center', gap: s(8), marginTop: vs(4)},
  addInput: {flex: 1, backgroundColor: '#FAF7F2', borderRadius: ms(10), borderWidth: 1, borderColor: '#E5DDD3', paddingHorizontal: s(12), paddingVertical: Platform.OS === 'ios' ? vs(10) : vs(6), fontSize: ms(12), color: Colors.textPrimary},
  addBtn: {flexDirection: 'row', alignItems: 'center', backgroundColor: ROSE, paddingHorizontal: s(12), paddingVertical: vs(8), borderRadius: ms(10)},

  // Bag
  bagRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(8), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F3EFE8'},

  // Recovery grid
  recoveryGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8)},
  recoveryTile: {width: '31.5%', minHeight: vs(70), backgroundColor: Colors.white, borderRadius: ms(13), borderWidth: 1, borderColor: '#E5DDD3', alignItems: 'center', justifyContent: 'center', paddingVertical: vs(10), paddingHorizontal: s(4)},
  recoveryTileActive: {backgroundColor: ROSE_BG, borderColor: ROSE},

  // Lochia
  lochiaRow: {flexDirection: 'row', justifyContent: 'space-between', flexWrap: 'wrap', gap: s(6)},
  lochiaWrap: {alignItems: 'center', padding: ms(4), borderRadius: ms(10), borderWidth: 0.5, borderColor: 'transparent'},
  lochiaDot: {width: ms(28), height: ms(28), borderRadius: ms(14)},

  // Chips
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(5)},
  mchip: {paddingHorizontal: s(11), paddingVertical: vs(7), borderRadius: ms(20), borderWidth: 0.5, borderColor: '#E5DDD3', backgroundColor: '#fff'},
  mchipOn: {backgroundColor: ROSE_BG, borderColor: ROSE},

  // Bottom
  bottomBar: {backgroundColor: Colors.white, paddingHorizontal: s(13), paddingTop: vs(8), paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10), borderTopWidth: 0.5, borderTopColor: '#d1d5db'},
  primaryButton: {flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: vs(13), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
});

export default BirthPlanScreen;
