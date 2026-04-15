import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../../constants/colors';
import AppText from '../../../../components/shared/AppText';
import Icon from '../../../../components/shared/Icons';

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const STOOL_COLORS = [
  {id: 0, color: '#2D1B0A', label: 'Dark brown'},
  {id: 1, color: '#3D4A1A', label: 'Dark green'},
  {id: 2, color: '#6B7A2A', label: 'Olive'},
  {id: 3, color: '#C8A040', label: 'Mustard'},
  {id: 4, color: '#E8C84A', label: 'Golden'},
  {id: 5, color: '#A0B840', label: 'Sage green'},
  {id: 6, color: '#C87840', label: 'Tan'},
  {id: 7, color: '#8B4513', label: 'Brown'},
  {id: 8, color: '#D4B896', label: 'Pale clay', dashed: true},
  {id: 9, color: '#E24B4A', label: 'Red'},
];

const CONSISTENCY = ['Watery', 'Runny', 'Seedy/grainy', 'Soft paste', 'Formed', 'Hard/pellets'];
const AMOUNT = ['Small smear', 'Medium', 'Large/explosive'];
const WETNESS = ['Light', 'Moderate', 'Heavy'];
const NAPPY_TYPES = [
  {id: 'wet', label: 'Wet only', icon: 'water-outline'},
  {id: 'stool', label: 'Stool only', icon: 'ellipse-outline'},
  {id: 'both', label: 'Wet + stool', icon: 'sync-outline'},
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const Section = ({title}) => (
  <View style={st.sec}>
    <AppText
      variant="subtext"
      color={Colors.textSecondary}
      style={st.secTxt}>
      {title}
    </AppText>
    <View style={st.secLine} />
  </View>
);

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const NappyOutputScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [wetCount, setWetCount] = useState(0);
  const [stoolCount, setStoolCount] = useState(0);
  const [nappyType, setNappyType] = useState('wet');
  const [wetness, setWetness] = useState(1);
  const [selectedColor, setSelectedColor] = useState(3);
  const [consistency, setConsistency] = useState(2);
  const [amount, setAmount] = useState(1);

  const showStool = nappyType === 'stool' || nappyType === 'both';
  const showWet = nappyType === 'wet' || nappyType === 'both';

  const inc = setter => setter(n => n + 1);
  const dec = setter => setter(n => Math.max(0, n - 1));

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
            <AppText variant="screenName" style={{color: Colors.white, fontSize: ms(18), fontWeight: '700'}}>Nappy output</AppText>
            <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', fontSize: ms(11)}}>Baby Zara - 44 days</AppText>
          </View>
        </View>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView
        style={st.body}
        contentContainerStyle={st.bodyContent}
        showsVerticalScrollIndicator={false}>
        {/* ── Nappy counter card ── */}
        <View style={st.counterCard}>
          <View style={st.counterGrid}>
            {/* Wet */}
            <View style={st.counterBox}>
              <View style={st.counterIconRow}>
                <Icon
                  family="Ionicons"
                  name="water-outline"
                  size={ms(16)}
                  color="rgba(255,255,255,0.75)"
                />
              </View>
              <AppText style={st.counterNum}>{wetCount}</AppText>
              <AppText
                variant="caption"
                color="rgba(255,255,255,0.75)"
                style={{marginTop: vs(2)}}>
                Wet diapers
              </AppText>
              <View style={st.counterBtnRow}>
                <TouchableOpacity
                  style={st.counterStep}
                  activeOpacity={0.75}
                  onPress={() => dec(setWetCount)}>
                  <Icon
                    family="Ionicons"
                    name="remove"
                    size={ms(14)}
                    color={Colors.white}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={st.counterStep}
                  activeOpacity={0.75}
                  onPress={() => inc(setWetCount)}>
                  <Icon
                    family="Ionicons"
                    name="add"
                    size={ms(14)}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              </View>
            </View>

            {/* Stool */}
            <View style={st.counterBox}>
              <View style={st.counterIconRow}>
                <Icon
                  family="Ionicons"
                  name="ellipse-outline"
                  size={ms(16)}
                  color="rgba(255,255,255,0.75)"
                />
              </View>
              <AppText style={st.counterNum}>{stoolCount}</AppText>
              <AppText
                variant="caption"
                color="rgba(255,255,255,0.75)"
                style={{marginTop: vs(2)}}>
                Stools
              </AppText>
              <View style={st.counterBtnRow}>
                <TouchableOpacity
                  style={st.counterStep}
                  activeOpacity={0.75}
                  onPress={() => dec(setStoolCount)}>
                  <Icon
                    family="Ionicons"
                    name="remove"
                    size={ms(14)}
                    color={Colors.white}
                  />
                </TouchableOpacity>
                <TouchableOpacity
                  style={st.counterStep}
                  activeOpacity={0.75}
                  onPress={() => inc(setStoolCount)}>
                  <Icon
                    family="Ionicons"
                    name="add"
                    size={ms(14)}
                    color={Colors.white}
                  />
                </TouchableOpacity>
              </View>
            </View>
          </View>
        </View>

        {/* ── Nappy type ── */}
        <Section title="Nappy type" />
        <View style={st.wcard}>
          <View style={st.typeRow}>
            {NAPPY_TYPES.map(t => {
              const isOn = nappyType === t.id;
              return (
                <TouchableOpacity
                  key={t.id}
                  style={[st.typeChip, isOn && st.typeChipOn]}
                  onPress={() => setNappyType(t.id)}
                  activeOpacity={0.7}>
                  <Icon
                    family="Ionicons"
                    name={t.icon}
                    size={ms(16)}
                    color={isOn ? Colors.primary : '#666'}
                  />
                  <AppText
                    variant="caption"
                    color={isOn ? Colors.primary : '#555'}
                    style={{fontWeight: isOn ? '700' : '500', marginTop: vs(4)}}>
                    {t.label}
                  </AppText>
                </TouchableOpacity>
              );
            })}
          </View>
        </View>

        {/* ── Wetness level ── */}
        {showWet && (
          <>
            <Section title="Wetness level" />
            <View style={st.wcard}>
              <View style={st.chipWrap}>
                {WETNESS.map((item, i) => {
                  const isOn = wetness === i;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[
                        st.mchip,
                        isOn && {
                          backgroundColor: '#F4F3FF',
                          borderColor: Colors.primary,
                        },
                      ]}
                      onPress={() => setWetness(i)}
                      activeOpacity={0.7}>
                      <AppText
                        variant="caption"
                        color={isOn ? Colors.primary : '#555'}
                        style={{fontWeight: isOn ? '700' : '500'}}>
                        {item}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        )}

        {/* ── Stool characteristics ── */}
        {showStool && (
          <>
            <Section title="Stool characteristics" />
            <View style={st.wcard}>
              <AppText variant="caption" color={Colors.textSecondary} style={st.subLabel}>
                Colour · tap to select
              </AppText>
              <View style={st.colorRow}>
                {STOOL_COLORS.map(c => {
                  const isOn = selectedColor === c.id;
                  return (
                    <TouchableOpacity
                      key={c.id}
                      activeOpacity={0.7}
                      onPress={() => setSelectedColor(c.id)}
                      style={[
                        st.colorRing,
                        isOn && {borderColor: Colors.primary, borderWidth: 2},
                      ]}>
                      <View
                        style={[
                          st.colorDot,
                          {backgroundColor: c.color},
                          c.dashed && {
                            borderWidth: 1,
                            borderStyle: 'dashed',
                            borderColor: '#8B6F47',
                          },
                        ]}
                      />
                    </TouchableOpacity>
                  );
                })}
              </View>
              <AppText
                variant="subtext"
                color={Colors.textSecondary}
                style={{marginBottom: vs(4)}}>
                Selected: {STOOL_COLORS[selectedColor].label}
              </AppText>

              <AppText
                variant="caption"
                color={Colors.textSecondary}
                style={[st.subLabel, {marginTop: vs(12)}]}>
                Consistency
              </AppText>
              <View style={st.chipWrap}>
                {CONSISTENCY.map((item, i) => {
                  const isOn = consistency === i;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[
                        st.mchip,
                        isOn && {
                          backgroundColor: '#F4F3FF',
                          borderColor: Colors.primary,
                        },
                      ]}
                      onPress={() => setConsistency(i)}
                      activeOpacity={0.7}>
                      <AppText
                        variant="caption"
                        color={isOn ? Colors.primary : '#555'}
                        style={{fontWeight: isOn ? '700' : '500'}}>
                        {item}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <AppText
                variant="caption"
                color={Colors.textSecondary}
                style={[st.subLabel, {marginTop: vs(12)}]}>
                Amount
              </AppText>
              <View style={st.chipWrap}>
                {AMOUNT.map((item, i) => {
                  const isOn = amount === i;
                  return (
                    <TouchableOpacity
                      key={i}
                      style={[
                        st.mchip,
                        isOn && {
                          backgroundColor: '#F4F3FF',
                          borderColor: Colors.primary,
                        },
                      ]}
                      onPress={() => setAmount(i)}
                      activeOpacity={0.7}>
                      <AppText
                        variant="caption"
                        color={isOn ? Colors.primary : '#555'}
                        style={{fontWeight: isOn ? '700' : '500'}}>
                        {item}
                      </AppText>
                    </TouchableOpacity>
                  );
                })}
              </View>
            </View>
          </>
        )}

        <View style={{height: vs(20)}} />
      </ScrollView>

      {/* ── Save Button ── */}
      <View style={st.bottomBar}>
        <TouchableOpacity style={st.primaryButton} activeOpacity={0.85}>
          <Icon family="Ionicons" name="save-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
            Save nappy log {'\u00b7'} {wetCount} wet {'\u00b7'} {stoolCount} stools
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
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(16),
    paddingBottom: vs(12),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: vs(8),
  },
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  savePill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.18)',
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.35)',
  },

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(12)},

  // Section header
  sec: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(16),
    marginBottom: vs(8),
  },
  secTxt: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.5,
    marginRight: s(7),
  },
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Counter card
  counterCard: {
    backgroundColor: Colors.primary,
    borderRadius: ms(16),
    padding: ms(14),
  },
  counterGrid: {flexDirection: 'row', gap: s(10)},
  counterBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.18)',
    padding: ms(12),
    alignItems: 'flex-start',
  },
  counterIconRow: {marginBottom: vs(4)},
  counterNum: {
    fontFamily: 'Syne-Bold',
    fontSize: ms(38),
    color: Colors.white,
    lineHeight: ms(44),
  },
  counterBtnRow: {
    flexDirection: 'row',
    gap: s(6),
    marginTop: vs(10),
  },
  counterStep: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(20),
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.35)',
    alignItems: 'center',
    justifyContent: 'center',
  },

  // White card
  wcard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    padding: ms(13),
    marginBottom: vs(8),
  },

  // Type row
  typeRow: {flexDirection: 'row', gap: s(8)},
  typeChip: {
    flex: 1,
    paddingVertical: vs(10),
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    backgroundColor: '#fff',
    alignItems: 'center',
  },
  typeChipOn: {
    backgroundColor: '#F4F3FF',
    borderColor: Colors.primary,
  },

  // Stool colour
  subLabel: {
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.3,
    marginBottom: vs(8),
  },
  colorRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginBottom: vs(10),
  },
  colorRing: {
    width: ms(30),
    height: ms(30),
    borderRadius: ms(30),
    borderWidth: 0.5,
    borderColor: 'transparent',
    alignItems: 'center',
    justifyContent: 'center',
  },
  colorDot: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(22),
  },

  // Chips
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(5)},
  mchip: {
    paddingHorizontal: s(11),
    paddingVertical: vs(7),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    backgroundColor: '#fff',
  },

  bottomBar: {backgroundColor: Colors.white, paddingHorizontal: s(13), paddingTop: vs(8), paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10), borderTopWidth: 0.5, borderTopColor: '#d1d5db'},
  primaryButton: {flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: vs(13), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
});

export default NappyOutputScreen;
