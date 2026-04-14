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
import NumpadModal from '../../../../components/BabyHealth/NumpadModal';

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const TABS = [
  {id: 'birth', label: 'Birth data'},
  {id: 'daily', label: 'Daily log'},
];

const BIRTH_STATS = [
  {label: 'Birth weight', value: '3.10', unit: 'kg', pill: 'Normal (>2.5kg)'},
  {label: 'Birth length', value: '50.0', unit: 'cm', pill: '50th percentile'},
  {label: 'Head circumference', value: '35.0', unit: 'cm', pill: '45th percentile'},
  {label: 'Gestational age', value: '39', unit: 'wk 2d', pill: 'Term (>37w)'},
];

const APGAR_ROWS = [
  {label: 'Appearance', oneMin: '1', oneTone: 'amber', fiveMin: '2', fiveTone: 'green'},
  {label: 'Pulse', oneMin: '2', oneTone: 'green', fiveMin: '2', fiveTone: 'green'},
  {label: 'Grimace', oneMin: '2', oneTone: 'green', fiveMin: '2', fiveTone: 'green'},
  {label: 'Activity', oneMin: '2', oneTone: 'green', fiveMin: '2', fiveTone: 'green'},
  {label: 'Respiration', oneMin: '2', oneTone: 'green', fiveMin: '2', fiveTone: 'green'},
  {label: 'TOTAL', oneMin: '9', oneTone: 'amber', fiveMin: '10', fiveTone: 'green', total: true},
];

const DELIVERY_CHIPS = [
  'Normal vaginal delivery',
  'Instrumental',
  'Caesarean (elective)',
  'Caesarean (emergency)',
];

const NEWBORN_PROCEDURES = [
  {label: 'Vitamin K given', hasCheck: true},
  {label: 'Eye prophylaxis given', hasCheck: true},
  {label: 'HepB birth dose given', hasCheck: true},
  {label: 'BCG at birth given', hasCheck: true},
  {label: 'Cord blood banking', hasCheck: false},
];

const MANDATORY_SCREENS = [
  {
    name: 'Congenital Hypothyroidism (TSH)',
    detail: 'Heel prick · Done Day 3 (23 Feb) · TSH: 2.8 mIU/L → Normal (<10)',
    badge: 'Normal',
  },
  {
    name: 'G6PD Deficiency',
    detail: 'Heel prick · Done Day 3 · G6PD activity: 12.4 U/gHb → Normal',
    badge: 'Normal',
  },
  {
    name: 'Hearing screen (OAE)',
    detail: 'Both ears · Done Day 2 · OAE PASS bilateral',
    badge: 'Pass',
  },
];

const BILI_ROWS = [
  {day: 'Day 2', val: '4.2', zone: 'Low', zoneTone: 'green', action: 'Monitor'},
  {day: 'Day 3', val: '8.8', zone: 'Intermediate', zoneTone: 'amber', action: 'Monitor'},
  {day: 'Day 5', val: '11.4', zone: 'Intermediate', zoneTone: 'amber', action: 'Frequent feed'},
  {day: 'Day 8', val: '5.8', zone: 'Low', zoneTone: 'green', action: 'Resolved'},
];

const EXTENDED_SCREENS = [
  {
    name: 'Congenital Heart Disease (pulse oximetry)',
    detail: 'Pre/post-ductal SpO₂ · Day 1 · 99% / 98% → Normal',
    badge: 'Pass',
    tone: 'green',
  },
  {
    name: 'Phenylketonuria (PKU)',
    detail: 'Expanded heel prick · Recommended but not mandatory · Pending collection',
    badge: 'Pending',
    tone: 'purple',
  },
  {
    name: 'Congenital Adrenal Hyperplasia (17-OHP)',
    detail: 'Expanded heel prick · Ask Dr. Preethi Rao at 6-week visit',
    badge: 'Discuss',
    tone: 'purple',
  },
];

const JAUNDICE_ZONES = [
  {name: 'Face / sclerae (whites of eyes)', bili: 'Bilirubin → 4-8 mg/dL if yellow here'},
  {name: 'Chest / upper abdomen', bili: 'Bilirubin → 8-12 mg/dL if yellow here'},
  {name: 'Lower abdomen / thighs', bili: 'Bilirubin → 12-15 mg/dL → seek review'},
  {name: 'Palms and soles → yellow', bili: 'Bilirubin → >15 mg/dL → urgent'},
];

const CORD_CHIPS = [
  {label: 'Cord separated (healed)', icon: 'checkmark', tone: 'green'},
  {label: 'Cord still attached', icon: null, tone: 'default'},
  {label: 'Redness / discharge around cord', icon: 'warning', tone: 'warn'},
];

const VIT_D_CHIPS = [
  {label: 'Given today · 400 IU', icon: 'checkmark', tone: 'green'},
  {label: 'Not given yet', icon: null, tone: 'default'},
  {label: 'Not prescribed yet', icon: null, tone: 'default'},
];

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const Section = ({title}) => (
  <View style={st.sec}>
    <AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{title}</AppText>
    <View style={st.secLine} />
  </View>
);

const Pill = ({text, tone = 'green'}) => {
  const styles = {
    green: {bg: Colors.tealBg, color: Colors.tealText},
    amber: {bg: Colors.amberBg, color: Colors.amberText},
    purple: {bg: Colors.purpleBg, color: Colors.purpleText},
  };
  const t = styles[tone] || styles.green;
  return (
    <View style={[st.pill, {backgroundColor: t.bg}]}>
      <AppText variant="caption" color={t.color} style={{fontWeight: '700', fontSize: ms(10)}}>{text}</AppText>
    </View>
  );
};

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const NeonatalRecordScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState('birth');
  const [delivery, setDelivery] = useState(0);
  const [procedures, setProcedures] = useState([0, 1, 2, 3]);
  const [cordIdx, setCordIdx] = useState(0);
  const [vitDIdx, setVitDIdx] = useState(0);
  const [temperature, setTemperature] = useState('36.8');
  const [respRate, setRespRate] = useState('42');

  // Dynamic birth stats
  const [birthWeight, setBirthWeight] = useState('3.10');
  const [birthLength, setBirthLength] = useState('50.0');
  const [birthHC, setBirthHC] = useState('35.0');
  const [gestAge, setGestAge] = useState('39');

  // Numpad
  const [numpadVisible, setNumpadVisible] = useState(false);
  const [numpadField, setNumpadField] = useState(null);
  const [numpadInitial, setNumpadInitial] = useState('');

  const openNumpad = (field, initial) => {
    setNumpadField(field);
    setNumpadInitial(initial);
    setNumpadVisible(true);
  };

  const onNumpadConfirm = (val) => {
    if (numpadField === 'birthWeight') setBirthWeight(val);
    else if (numpadField === 'birthLength') setBirthLength(val);
    else if (numpadField === 'birthHC') setBirthHC(val);
    else if (numpadField === 'gestAge') setGestAge(val);
    else if (numpadField === 'temperature') setTemperature(val);
    else if (numpadField === 'respRate') setRespRate(val);
    setNumpadVisible(false);
  };

  const birthStats = [
    {label: 'Birth weight', value: birthWeight, unit: 'kg', field: 'birthWeight'},
    {label: 'Birth length', value: birthLength, unit: 'cm', field: 'birthLength'},
    {label: 'Head circumference', value: birthHC, unit: 'cm', field: 'birthHC'},
    {label: 'Gestational age', value: gestAge, unit: 'wk', field: 'gestAge'},
  ];

  const toggleProc = (idx) => {
    setProcedures((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Header ── */}
      <View style={[st.header, {paddingTop: insets.top + vs(10)}]}>
        <View style={st.topRow}>
          <TouchableOpacity
            style={st.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={{color: Colors.white, fontSize: ms(18), fontWeight: '700'}}>Neonatal record</AppText>
            <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', fontSize: ms(11)}}>Baby Zara - Born 20 Feb 2026</AppText>
          </View>
        </View>

        {/* Tab bar */}
        <View style={st.tabBar}>
          {TABS.map((tab) => {
            const on = activeTab === tab.id;
            return (
              <TouchableOpacity
                key={tab.id}
                style={[st.tab, on && st.tabOn]}
                onPress={() => setActiveTab(tab.id)}
                activeOpacity={0.7}>
                <AppText
                  variant="caption"
                  color={on ? Colors.white : 'rgba(255,255,255,0.55)'}
                  style={{fontWeight: '700'}}>
                  {tab.label}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* ── Scrollable body ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>

        {activeTab === 'birth' && (
          <>
            {/* Birth record */}
            <Section title="Birth record - tap to edit" />
            <View style={st.grid2}>
              {birthStats.map((stat, i) => (
                <TouchableOpacity key={i} style={st.statBox} activeOpacity={0.8} onPress={() => openNumpad(stat.field, stat.value)}>
                  <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(10), fontWeight: '600'}}>
                    {stat.label}
                  </AppText>
                  <View style={{flexDirection: 'row', alignItems: 'baseline', marginTop: vs(4)}}>
                    <AppText variant="bodyBold" color={stat.value ? Colors.primary : Colors.textTertiary} style={{fontSize: ms(20), fontWeight: '800'}}>
                      {stat.value || '--'}
                    </AppText>
                    <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(4)}}>
                      {stat.unit}
                    </AppText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <NumpadModal
              visible={numpadVisible}
              title={numpadField === 'birthWeight' ? 'Birth weight (kg)' : numpadField === 'birthLength' ? 'Birth length (cm)' : numpadField === 'birthHC' ? 'Head circumference (cm)' : 'Gestational age (weeks)'}
              hint={numpadField === 'birthWeight' ? 'Enter weight in kg' : numpadField === 'birthLength' ? 'Enter length in cm' : numpadField === 'birthHC' ? 'Enter HC in cm' : 'Enter weeks'}
              initialValue={numpadInitial}
              onClose={() => setNumpadVisible(false)}
              onConfirm={onNumpadConfirm}
            />

            {/* Delivery details */}
            <Section title="Delivery details" />
            <View style={st.chipWrap}>
              {DELIVERY_CHIPS.map((c, i) => {
                const on = delivery === i;
                return (
                  <TouchableOpacity
                    key={i}
                    style={[st.chip, on && st.chipOn]}
                    onPress={() => setDelivery(i)}
                    activeOpacity={0.7}>
                    <AppText
                      variant="caption"
                      color={on ? Colors.white : Colors.textSecondary}
                      style={{fontWeight: on ? '700' : '500'}}>
                      {c}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Procedures mchips */}
            <View style={[st.chipWrap, {marginTop: vs(10)}]}>
              {NEWBORN_PROCEDURES.map((p, i) => {
                const on = procedures.includes(i);
                return (
                  <TouchableOpacity
                    key={i}
                    style={[st.mchip, on && st.mchipOn]}
                    onPress={() => toggleProc(i)}
                    activeOpacity={0.7}>
                    {on && (
                      <Icon
                        family="Ionicons"
                        name="checkmark"
                        size={ms(12)}
                        color={Colors.tealText}
                        style={{marginRight: s(4)}}
                      />
                    )}
                    <AppText
                      variant="caption"
                      color={on ? Colors.tealText : Colors.textSecondary}
                      style={{fontWeight: on ? '700' : '500'}}>
                      {p.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>
          </>
        )}

        {false && (
          <>
            {/* Mandatory screens — moved to Records */}
            <Section title="Mandatory IAP / national screens" />
            <View style={st.wcard}>
              {MANDATORY_SCREENS.map((sc, i) => (
                <View
                  key={i}
                  style={[
                    st.screenRow,
                    i < MANDATORY_SCREENS.length - 1 && st.screenRowBorder,
                  ]}>
                  <View style={st.iconBoxGreen}>
                    <Icon family="Ionicons" name="checkmark" size={ms(16)} color={Colors.tealDark} />
                  </View>
                  <View style={{flex: 1, marginLeft: s(10)}}>
                    <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>
                      {sc.name}
                    </AppText>
                    <AppText
                      variant="caption"
                      color={Colors.textSecondary}
                      style={{marginTop: vs(3), lineHeight: ms(15), fontSize: ms(10)}}>
                      {sc.detail}
                    </AppText>
                  </View>
                  <Pill text={sc.badge} tone="green" />
                </View>
              ))}
            </View>

            {/* Neonatal bilirubin */}
            <Section title="Neonatal bilirubin / jaundice" />
            <View style={st.wcard}>
              <View style={[st.biliRow, st.biliHead]}>
                <AppText variant="caption" color={Colors.textSecondary} style={[st.biliC1, {fontWeight: '700'}]}>Day</AppText>
                <AppText variant="caption" color={Colors.textSecondary} style={[st.biliC2, {fontWeight: '700'}]}>Bili (mg/dL)</AppText>
                <AppText variant="caption" color={Colors.textSecondary} style={[st.biliC3, {fontWeight: '700'}]}>Zone</AppText>
                <AppText variant="caption" color={Colors.textSecondary} style={[st.biliC4, {fontWeight: '700'}]}>Action</AppText>
              </View>
              {BILI_ROWS.map((row, i) => (
                <View key={i} style={st.biliRow}>
                  <AppText variant="caption" color={Colors.textPrimary} style={[st.biliC1, {fontWeight: '600'}]}>{row.day}</AppText>
                  <AppText variant="caption" color={Colors.textPrimary} style={[st.biliC2, {fontWeight: '700'}]}>{row.val}</AppText>
                  <View style={st.biliC3}>
                    <Pill text={row.zone} tone={row.zoneTone} />
                  </View>
                  <AppText variant="caption" color={Colors.textSecondary} style={[st.biliC4, {fontSize: ms(10)}]}>{row.action}</AppText>
                </View>
              ))}
            </View>
            {/* Extended screens */}
            <Section title="Extended screens (KIMS · additional)" />
            <View style={st.wcard}>
              {EXTENDED_SCREENS.map((sc, i) => (
                <View
                  key={i}
                  style={[
                    st.screenRow,
                    i < EXTENDED_SCREENS.length - 1 && st.screenRowBorder,
                  ]}>
                  <View
                    style={[
                      st.iconBoxGreen,
                      sc.tone === 'purple' && {backgroundColor: Colors.purpleBg},
                    ]}>
                    <Icon
                      family="Ionicons"
                      name={sc.tone === 'purple' ? 'time' : 'checkmark'}
                      size={ms(16)}
                      color={sc.tone === 'purple' ? Colors.purpleText : Colors.tealDark}
                    />
                  </View>
                  <View style={{flex: 1, marginLeft: s(10)}}>
                    <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>
                      {sc.name}
                    </AppText>
                    <AppText
                      variant="caption"
                      color={Colors.textSecondary}
                      style={{marginTop: vs(3), lineHeight: ms(15), fontSize: ms(10)}}>
                      {sc.detail}
                    </AppText>
                  </View>
                  <Pill text={sc.badge} tone={sc.tone === 'purple' ? 'purple' : 'green'} />
                </View>
              ))}
            </View>
          </>
        )}

        {activeTab === 'daily' && (
          <>
            <Section title="Today's neonatal check - Day 44" />

            {/* Cord */}
            <Section title="Cord / healing check" />
            <View style={st.chipWrap}>
              {CORD_CHIPS.map((c, i) => {
                const on = cordIdx === i;
                const warn = c.tone === 'warn';
                const bg = on
                  ? warn
                    ? Colors.amberBg
                    : Colors.tealBg
                  : Colors.white;
                const color = on
                  ? warn
                    ? Colors.amberText
                    : Colors.tealText
                  : Colors.textSecondary;
                const border = on
                  ? warn
                    ? Colors.amber
                    : Colors.tealText
                  : '#E5DDD3';
                return (
                  <TouchableOpacity
                    key={i}
                    style={[st.mchip, {backgroundColor: bg, borderColor: border}]}
                    onPress={() => setCordIdx(i)}
                    activeOpacity={0.7}>
                    {c.icon && (
                      <Icon
                        family="Ionicons"
                        name={c.icon}
                        size={ms(12)}
                        color={color}
                        style={{marginRight: s(4)}}
                      />
                    )}
                    <AppText variant="caption" color={color} style={{fontWeight: on ? '700' : '500'}}>
                      {c.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
            </View>

            {/* Daily vitals */}
            <Section title="Daily vitals - tap to enter" />
            <View style={st.grid2}>
              <TouchableOpacity style={st.statBox} activeOpacity={0.8} onPress={() => openNumpad('temperature', temperature)}>
                <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(10), fontWeight: '600'}}>
                  Temperature
                </AppText>
                <View style={{flexDirection: 'row', alignItems: 'baseline', marginTop: vs(4)}}>
                  <AppText variant="bodyBold" color={temperature ? Colors.primary : Colors.textTertiary} style={{fontSize: ms(20), fontWeight: '800'}}>
                    {temperature || '--'}
                  </AppText>
                  <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(4)}}>°C</AppText>
                </View>
              </TouchableOpacity>
              <TouchableOpacity style={st.statBox} activeOpacity={0.8} onPress={() => openNumpad('respRate', respRate)}>
                <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(10), fontWeight: '600'}}>
                  Resp. rate
                </AppText>
                <View style={{flexDirection: 'row', alignItems: 'baseline', marginTop: vs(4)}}>
                  <AppText variant="bodyBold" color={respRate ? Colors.primary : Colors.textTertiary} style={{fontSize: ms(20), fontWeight: '800'}}>
                    {respRate || '--'}
                  </AppText>
                  <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(4)}}>/min</AppText>
                </View>
              </TouchableOpacity>
            </View>

            <NumpadModal
              visible={numpadVisible && (numpadField === 'temperature' || numpadField === 'respRate')}
              title={numpadField === 'temperature' ? 'Temperature (°C)' : 'Respiratory rate (/min)'}
              hint={numpadField === 'temperature' ? 'Enter temp in °C' : 'Enter breaths per minute'}
              initialValue={numpadInitial}
              onClose={() => setNumpadVisible(false)}
              onConfirm={onNumpadConfirm}
            />

            {/* Vitamin D drops */}
            <Section title="Vitamin D drops" />
            <View style={st.chipWrap}>
              {VIT_D_CHIPS.map((c, i) => {
                const on = vitDIdx === i;
                const bg = on ? Colors.tealBg : Colors.white;
                const color = on ? Colors.tealText : Colors.textSecondary;
                const border = on ? Colors.tealText : '#E5DDD3';
                return (
                  <TouchableOpacity
                    key={i}
                    style={[st.mchip, {backgroundColor: bg, borderColor: border}]}
                    onPress={() => setVitDIdx(i)}
                    activeOpacity={0.7}>
                    {c.icon && (
                      <Icon
                        family="Ionicons"
                        name={c.icon}
                        size={ms(12)}
                        color={color}
                        style={{marginRight: s(4)}}
                      />
                    )}
                    <AppText variant="caption" color={color} style={{fontWeight: on ? '700' : '500'}}>
                      {c.label}
                    </AppText>
                  </TouchableOpacity>
                );
              })}
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
            Save neonatal record
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
    paddingBottom: vs(4),
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
    borderColor: 'rgba(255,255,255,0.3)',
  },

  // Tab bar
  tabBar: {
    flexDirection: 'row',
    marginTop: vs(14),
    gap: s(4),
  },
  tab: {
    flex: 1,
    paddingVertical: vs(8),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tabOn: {
    backgroundColor: Colors.accent,
  },

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(4)},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(16), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Grid
  grid2: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  statBox: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    padding: ms(12),
  },
  pill: {
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(12),
    alignSelf: 'flex-start',
  },

  // White card
  wcard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    padding: ms(12),
    marginBottom: vs(8),
  },

  // APGAR
  apgRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(7),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5DDD3',
  },
  apgHead: {
    paddingBottom: vs(6),
  },
  apgTotal: {
    backgroundColor: Colors.purpleBg,
    marginHorizontal: -ms(12),
    paddingHorizontal: ms(12),
    borderBottomWidth: 0,
  },
  apgCell: {flex: 2},
  apgCellC: {flex: 1, alignItems: 'center'},
  apgScore: {
    minWidth: ms(28),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Insight boxes
  greenInsight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.tealBg,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: Colors.paleGreen,
    padding: ms(12),
    marginTop: vs(10),
  },
  blueInsight: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.blueBg,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: '#93C5FD',
    padding: ms(12),
    marginTop: vs(10),
  },

  // Chips
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6)},
  chip: {
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    backgroundColor: Colors.white,
  },
  chipOn: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  mchip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(11),
    paddingVertical: vs(7),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    backgroundColor: Colors.white,
  },
  mchipOn: {
    backgroundColor: Colors.tealBg,
    borderColor: Colors.tealText,
  },

  // Screen rows
  screenRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  screenRowBorder: {
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5DDD3',
  },
  iconBoxGreen: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(8),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Bili table
  biliRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5DDD3',
  },
  biliHead: {
    paddingBottom: vs(6),
  },
  biliC1: {flex: 1},
  biliC2: {flex: 1.2, textAlign: 'center'},
  biliC3: {flex: 1.4, alignItems: 'center'},
  biliC4: {flex: 1.2, textAlign: 'right'},

  // Zone card (daily log)
  zoneCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    padding: ms(12),
    marginBottom: vs(6),
  },
  bottomBar: {backgroundColor: Colors.white, paddingHorizontal: s(13), paddingTop: vs(8), paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10), borderTopWidth: 0.5, borderTopColor: '#d1d5db'},
  primaryButton: {flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: vs(13), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
});

export default NeonatalRecordScreen;
