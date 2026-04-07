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

const TABS = [
  {id: 'birth', label: 'Birth data'},
  {id: 'screens', label: 'Newborn screens'},
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

  const toggleProc = (idx) => {
    setProcedures((prev) => (prev.includes(idx) ? prev.filter((i) => i !== idx) : [...prev, idx]));
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Header ── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topRow}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
            <TouchableOpacity
              style={st.backBtn}
              onPress={() => navigation.goBack()}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
            </TouchableOpacity>
            <AppText variant="body" color="rgba(255,255,255,0.85)">
              Neonatal record
            </AppText>
          </View>
          <View style={st.savePill}>
            <Icon family="Ionicons" name="checkmark" size={ms(12)} color={Colors.white} />
            <AppText variant="caption" color={Colors.white} style={{fontWeight: '700', marginLeft: s(4)}}>
              Save
            </AppText>
          </View>
        </View>

        <AppText
          variant="caption"
          color="rgba(255,255,255,0.55)"
          style={{fontWeight: '700', letterSpacing: 0.8, marginTop: vs(10), textTransform: 'uppercase', fontSize: ms(10)}}>
          Baby Zara · Neonatal
        </AppText>
        <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(2)}}>
          Neonatal record
        </AppText>
        <AppText variant="caption" color="rgba(255,255,255,0.65)" style={{marginTop: vs(4)}}>
          Birth: 20 Feb 2026 · KIMS Hospital, Hyderabad
        </AppText>

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
            <Section title="Birth record · 20 Feb 2026" />
            <View style={st.grid2}>
              {BIRTH_STATS.map((stat, i) => (
                <View key={i} style={st.statBox}>
                  <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(10), fontWeight: '600'}}>
                    {stat.label}
                  </AppText>
                  <View style={{flexDirection: 'row', alignItems: 'baseline', marginTop: vs(4)}}>
                    <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(20), fontWeight: '800'}}>
                      {stat.value}
                    </AppText>
                    <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(4)}}>
                      {stat.unit}
                    </AppText>
                  </View>
                  <View style={{marginTop: vs(6), alignSelf: 'flex-start'}}>
                    <Pill text={stat.pill} tone="green" />
                  </View>
                </View>
              ))}
            </View>

            {/* APGAR scores */}
            <Section title="APGAR scores" />
            <View style={st.wcard}>
              <View style={[st.apgRow, st.apgHead]}>
                <AppText variant="caption" color={Colors.textSecondary} style={[st.apgCell, {fontWeight: '700'}]}>Criteria</AppText>
                <AppText variant="caption" color={Colors.textSecondary} style={[st.apgCellC, {fontWeight: '700'}]}>1 min</AppText>
                <AppText variant="caption" color={Colors.textSecondary} style={[st.apgCellC, {fontWeight: '700'}]}>5 min</AppText>
              </View>
              {APGAR_ROWS.map((row, i) => (
                <View key={i} style={[st.apgRow, row.total && st.apgTotal]}>
                  <AppText
                    variant="caption"
                    color={Colors.textPrimary}
                    style={[st.apgCell, {fontWeight: row.total ? '800' : '500'}]}>
                    {row.label}
                  </AppText>
                  <View style={st.apgCellC}>
                    <View
                      style={[
                        st.apgScore,
                        row.oneTone === 'amber' ? {backgroundColor: Colors.amberBg} : {backgroundColor: Colors.tealBg},
                      ]}>
                      <AppText
                        variant="caption"
                        color={row.oneTone === 'amber' ? Colors.amberText : Colors.tealText}
                        style={{fontWeight: '800'}}>
                        {row.oneMin}
                      </AppText>
                    </View>
                  </View>
                  <View style={st.apgCellC}>
                    <View
                      style={[
                        st.apgScore,
                        row.fiveTone === 'amber' ? {backgroundColor: Colors.amberBg} : {backgroundColor: Colors.tealBg},
                      ]}>
                      <AppText
                        variant="caption"
                        color={row.fiveTone === 'amber' ? Colors.amberText : Colors.tealText}
                        style={{fontWeight: '800'}}>
                        {row.fiveMin}
                      </AppText>
                    </View>
                  </View>
                </View>
              ))}
            </View>

            {/* Green insight box */}
            <View style={st.greenInsight}>
              <Icon family="Ionicons" name="checkmark-circle" size={ms(18)} color={Colors.tealDark} />
              <AppText variant="caption" color={Colors.tealDark} style={{flex: 1, marginLeft: s(8), lineHeight: ms(17)}}>
                <AppText color={Colors.tealDark} style={{fontWeight: '800'}}>APGAR 9/10 is excellent. </AppText>
                An APGAR of 9-10 at 5 minutes indicates an infant in excellent condition. Score of 1 at 1 min for Appearance (hands/feet blue at birth) is normal...
              </AppText>
            </View>

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

        {activeTab === 'screens' && (
          <>
            {/* Blue insight */}
            <View style={st.blueInsight}>
              <Icon family="Ionicons" name="information-circle" size={ms(18)} color={Colors.blueText} />
              <AppText variant="caption" color={Colors.blueText} style={{flex: 1, marginLeft: s(8), lineHeight: ms(17)}}>
                Newborn screening identifies conditions that can be treated early...
              </AppText>
            </View>

            {/* Mandatory screens */}
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
            <View style={st.greenInsight}>
              <Icon family="Ionicons" name="checkmark-circle" size={ms(18)} color={Colors.tealDark} />
              <AppText variant="caption" color={Colors.tealDark} style={{flex: 1, marginLeft: s(8), lineHeight: ms(17)}}>
                Physiological jaundice resolved by Day 8 without phototherapy...
              </AppText>
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
            <Section title="Today's neonatal check · Day 44" />

            <Section title="Jaundice visual assessment" />
            <AppText
              variant="caption"
              color={Colors.textSecondary}
              style={{fontStyle: 'italic', marginBottom: vs(8)}}>
              Press gently on skin to check colour underneath...
            </AppText>
            <View>
              {JAUNDICE_ZONES.map((z, i) => (
                <TouchableOpacity key={i} style={st.zoneCard} activeOpacity={0.7}>
                  <View style={st.iconBoxGreen}>
                    <Icon family="Ionicons" name="body-outline" size={ms(16)} color={Colors.tealDark} />
                  </View>
                  <View style={{flex: 1, marginLeft: s(10)}}>
                    <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>
                      {z.name}
                    </AppText>
                    <AppText
                      variant="caption"
                      color={Colors.textSecondary}
                      style={{marginTop: vs(2), fontSize: ms(10)}}>
                      {z.bili}
                    </AppText>
                  </View>
                </TouchableOpacity>
              ))}
            </View>

            <View style={st.greenInsight}>
              <Icon family="Ionicons" name="checkmark-circle" size={ms(18)} color={Colors.tealDark} />
              <AppText variant="caption" color={Colors.tealDark} style={{flex: 1, marginLeft: s(8), lineHeight: ms(17)}}>
                <AppText color={Colors.tealDark} style={{fontWeight: '800'}}>Physiological jaundice resolved on Day 8. </AppText>
                No jaundice assessment needed beyond Day 21 for term infants without risk factors. Zara is Day 44 — this log section is for monitoring only...
              </AppText>
            </View>

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
            <Section title="Daily vitals" />
            <View style={st.grid2}>
              <View style={st.statBox}>
                <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(10), fontWeight: '600'}}>
                  Temperature
                </AppText>
                <View style={{flexDirection: 'row', alignItems: 'baseline', marginTop: vs(4)}}>
                  <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(20), fontWeight: '800'}}>
                    36.8
                  </AppText>
                  <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(4)}}>°C</AppText>
                </View>
                <View style={{marginTop: vs(6), alignSelf: 'flex-start'}}>
                  <Pill text="Normal (36.5-37.5)" tone="green" />
                </View>
              </View>
              <View style={st.statBox}>
                <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(10), fontWeight: '600'}}>
                  Resp. rate
                </AppText>
                <View style={{flexDirection: 'row', alignItems: 'baseline', marginTop: vs(4)}}>
                  <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(20), fontWeight: '800'}}>
                    42
                  </AppText>
                  <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(4)}}>/min</AppText>
                </View>
                <View style={{marginTop: vs(6), alignSelf: 'flex-start'}}>
                  <Pill text="Normal (30-60)" tone="green" />
                </View>
              </View>
            </View>

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
