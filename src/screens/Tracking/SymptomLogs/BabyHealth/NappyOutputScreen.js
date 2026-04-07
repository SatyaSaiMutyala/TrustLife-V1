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

const NAPPY_LOG = [
  {
    dot: '#C8A040',
    main: 'Wet + stool',
    time: '09:35 AM',
    sub: 'Mustard yellow · Seedy · Medium · After feed 1',
  },
  {
    dot: '#BDE0FE',
    main: 'Wet only',
    time: '11:20 AM',
    sub: 'Heavily wet · Clear/pale yellow',
  },
  {
    dot: '#BDE0FE',
    main: 'Wet only',
    time: '12:45 PM',
    sub: 'Heavily wet · After feed 2',
  },
  {
    dot: '#C8A040',
    main: 'Wet + stool',
    time: '02:40 PM',
    sub: 'Mustard yellow · Seedy · Small · After feed 3',
  },
  {
    dot: '#BDE0FE',
    main: 'Wet only',
    time: '04:10 PM',
    sub: 'Moderately wet',
  },
  {
    dot: '#BDE0FE',
    main: 'Wet only',
    time: '06:30 PM',
    sub: 'Heavily wet',
  },
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

  const [wetCount, setWetCount] = useState(8);
  const [stoolCount, setStoolCount] = useState(2);
  const [selectedColor, setSelectedColor] = useState(3);
  const [consistency, setConsistency] = useState(2);
  const [amount, setAmount] = useState(1);

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Fixed Header ── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topRow}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
            <TouchableOpacity
              style={st.backBtn}
              onPress={() => navigation.goBack()}
              hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon
                family="Ionicons"
                name="chevron-back"
                size={18}
                color={Colors.white}
              />
            </TouchableOpacity>
            <AppText
              variant="body"
              color="rgba(255,255,255,0.85)">
              Nappy output
            </AppText>
          </View>
          <View style={st.savePill}>
            <Icon
              family="Ionicons"
              name="checkmark"
              size={ms(12)}
              color={Colors.white}
            />
            <AppText
              variant="caption"
              color={Colors.white}
              style={{fontWeight: '700', marginLeft: s(4)}}>
              Save
            </AppText>
          </View>
        </View>
        <AppText
          variant="caption"
          color="rgba(255,255,255,0.55)"
          style={{
            fontWeight: '700',
            textTransform: 'uppercase',
            letterSpacing: 1,
            marginTop: vs(6),
          }}>
          Baby Zara · Output
        </AppText>
        <AppText
          variant="screenName"
          color={Colors.white}
          style={{marginTop: vs(2)}}>
          Nappy output log
        </AppText>
        <AppText
          variant="caption"
          color="rgba(255,255,255,0.65)"
          style={{marginTop: vs(4)}}>
          Hydration indicator of milk intake adequacy
        </AppText>
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
              <TouchableOpacity
                style={st.counterBtn}
                activeOpacity={0.75}
                onPress={() => setWetCount(n => n + 1)}>
                <Icon
                  family="Ionicons"
                  name="add"
                  size={ms(14)}
                  color={Colors.white}
                />
                <AppText
                  variant="caption"
                  color={Colors.white}
                  style={{fontWeight: '700', marginLeft: s(3)}}>
                  Add wet
                </AppText>
              </TouchableOpacity>
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
              <TouchableOpacity
                style={st.counterBtn}
                activeOpacity={0.75}
                onPress={() => setStoolCount(n => n + 1)}>
                <Icon
                  family="Ionicons"
                  name="add"
                  size={ms(14)}
                  color={Colors.white}
                />
                <AppText
                  variant="caption"
                  color={Colors.white}
                  style={{fontWeight: '700', marginLeft: s(3)}}>
                  Log stool
                </AppText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* ── Hydration status ── */}
        <Section title="Hydration status" />
        <View style={st.wcard}>
          <View style={st.hydrateRow}>
            <AppText
              variant="caption"
              color={Colors.textSecondary}
              style={{fontWeight: '600'}}>
              Today's wet nappies
            </AppText>
            <View style={{flexDirection: 'row', alignItems: 'center'}}>
              <AppText
                variant="bodyBold"
                color={Colors.textPrimary}
                style={{fontWeight: '800'}}>
                {wetCount}
              </AppText>
              <Icon
                family="Ionicons"
                name="checkmark-circle"
                size={ms(14)}
                color="#10B981"
                style={{marginLeft: s(6)}}
              />
              <AppText
                variant="caption"
                color="#10B981"
                style={{fontWeight: '700', marginLeft: s(3)}}>
                Excellent
              </AppText>
            </View>
          </View>

          {/* Gradient progress bar (approximated via segmented colours) */}
          <View style={st.progressTrack}>
            <View style={st.progressFill}>
              <View style={[st.progressSeg, {backgroundColor: '#E24B4A'}]} />
              <View style={[st.progressSeg, {backgroundColor: '#F59E0B'}]} />
              <View style={[st.progressSeg, {backgroundColor: '#10B981'}]} />
            </View>
          </View>

          <View style={st.progressLabels}>
            <AppText variant="subtext" color={Colors.textTertiary}>
              0
            </AppText>
            <AppText
              variant="subtext"
              color={Colors.textSecondary}
              style={{fontWeight: '700'}}>
              6+ = adequate
            </AppText>
            <AppText variant="subtext" color={Colors.textTertiary}>
              10
            </AppText>
          </View>

          <View style={st.hydrateInfo}>
            <Icon
              family="Ionicons"
              name="checkmark-circle"
              size={ms(16)}
              color="#10B981"
              style={{marginTop: vs(1)}}
            />
            <AppText
              variant="caption"
              color="#064E3B"
              style={{flex: 1, marginLeft: s(8), lineHeight: ms(17)}}>
              <AppText style={{fontWeight: '700'}}>{wetCount} heavily wet diapers today</AppText> confirms good milk intake. The gold standard is ≥6 per day. Signs of dehydration: fewer than 4 diapers, dark/concentrated urine (brick-red or orange), sunken fontanelle.
            </AppText>
          </View>
        </View>

        {/* ── Stool characteristics ── */}
        <Section title="Stool characteristics · last entry" />
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
          <View style={st.warnRow}>
            <Icon
              family="Ionicons"
              name="warning-outline"
              size={ms(13)}
              color="#B45309"
            />
            <AppText
              variant="subtext"
              color="#92400E"
              style={{flex: 1, marginLeft: s(6), lineHeight: ms(16)}}>
              Pale/white/clay and blood-red streaks require same-day paediatric review
            </AppText>
          </View>

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

        {/* ── Today's nappy log ── */}
        <Section title="Today's nappy log" />
        <View style={st.wcard}>
          {NAPPY_LOG.map((row, i) => (
            <View
              key={i}
              style={[
                st.logRow,
                i === NAPPY_LOG.length - 1 && {borderBottomWidth: 0},
              ]}>
              <View style={[st.logDot, {backgroundColor: row.dot}]} />
              <View style={{flex: 1}}>
                <AppText
                  variant="caption"
                  color={Colors.textPrimary}
                  style={{fontWeight: '700'}}>
                  {row.main} · {row.time}
                </AppText>
                <AppText
                  variant="subtext"
                  color={Colors.textSecondary}
                  style={{marginTop: vs(1)}}>
                  {row.sub}
                </AppText>
              </View>
            </View>
          ))}
        </View>

        {/* ── What's normal ── */}
        <Section title="What's normal · breastfed · 44 days" />
        <View style={st.insightPurple}>
          <Icon
            family="Ionicons"
            name="bulb-outline"
            size={ms(16)}
            color={Colors.primary}
            style={{marginTop: vs(1)}}
          />
          <AppText
            variant="caption"
            color="#3730A3"
            style={{flex: 1, marginLeft: s(8), lineHeight: ms(17)}}>
            <AppText style={{fontWeight: '700'}}>Mustard yellow and seedy is the gold standard breastfed stool.</AppText> This is not "runny" — it is normal. Formula-fed stools are tan/brown, firmer, and less frequent. Frequency for breastfed babies: 1-10 stools/day in the first 4-6 weeks is entirely normal.
          </AppText>
        </View>

        <View style={st.insightRed}>
          <Icon
            family="Ionicons"
            name="alert-circle-outline"
            size={ms(16)}
            color="#B91C1C"
            style={{marginTop: vs(1)}}
          />
          <AppText
            variant="caption"
            color="#7F1D1D"
            style={{flex: 1, marginLeft: s(8), lineHeight: ms(17)}}>
            <AppText style={{fontWeight: '700'}}>Seek same-day paediatric care if:</AppText> white/clay/pale stools (biliary atresia), blood-red streaks or dark blood in stool, black tarry stool beyond Day 3, green watery stools with distension, or no stools for 5+ days (formula-fed) or 10+ days (breastfed).
          </AppText>
        </View>

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
    paddingBottom: vs(14),
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
  counterBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.35)',
    paddingHorizontal: s(10),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    marginTop: vs(10),
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

  // Hydration
  hydrateRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(10),
  },
  progressTrack: {
    height: ms(10),
    backgroundColor: '#F1EEE8',
    borderRadius: ms(10),
    overflow: 'hidden',
  },
  progressFill: {
    width: '80%',
    height: '100%',
    flexDirection: 'row',
  },
  progressSeg: {flex: 1, height: '100%'},
  progressLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(6),
  },
  hydrateInfo: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ECFDF5',
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: '#6EE7B7',
    padding: ms(10),
    marginTop: vs(12),
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
  warnRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FFF7ED',
    borderRadius: ms(8),
    borderWidth: 0.5,
    borderColor: '#FBB97A',
    padding: ms(8),
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

  // Log rows
  logRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(9),
    borderBottomWidth: 0.5,
    borderBottomColor: '#F1EEE8',
  },
  logDot: {
    width: ms(12),
    height: ms(12),
    borderRadius: ms(12),
    marginRight: s(10),
    borderWidth: 0.5,
    borderColor: 'rgba(0,0,0,0.08)',
  },

  // Insight boxes
  insightPurple: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F4F3FF',
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: '#C7D2FE',
    padding: ms(12),
    marginBottom: vs(8),
  },
  insightRed: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF0F0',
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: '#FDA4A4',
    padding: ms(12),
    marginBottom: vs(8),
  },
  bottomBar: {backgroundColor: Colors.white, paddingHorizontal: s(13), paddingTop: vs(8), paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10), borderTopWidth: 0.5, borderTopColor: '#d1d5db'},
  primaryButton: {flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: vs(13), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
});

export default NappyOutputScreen;
