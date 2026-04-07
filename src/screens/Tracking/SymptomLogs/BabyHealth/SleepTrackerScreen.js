import React, {useState} from 'react';
import {
  View,
  ScrollView,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  TextInput,
  Platform,
} from 'react-native';
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
// Constants & Data
// ──────────────────────────────────────────────

const TABS = [
  {key: 'log', label: 'Log sleep'},
  {key: 'today', label: 'Today'},
  {key: 'ayu', label: 'Ayu'},
];

const SLEEP_TYPES = [
  {label: 'Night sleep', icon: 'moon-outline'},
  {label: 'Morning nap', icon: 'sunny-outline'},
  {label: 'Afternoon nap', icon: 'partly-sunny-outline'},
  {label: 'Cat nap', icon: 'time-outline'},
];

const SETTLE_OPTIONS = [
  {label: 'Easy', sub: 'Under 10 min'},
  {label: 'Medium', sub: '10-20 min'},
  {label: 'Difficult', sub: '20+ min'},
];

const SAFE_CHECKS = [
  {label: 'Back to sleep', sub: 'Baby placed on back for every sleep', done: true},
  {label: 'Firm flat surface', sub: 'Crib mattress, no incline', done: true},
  {label: 'No loose bedding', sub: 'No pillows, blankets, or toys', done: true},
  {label: 'Room sharing not bed sharing', sub: 'Separate sleep surface in parents room', done: true},
  {label: 'Temperature 18-20°C', sub: 'Room thermometer - optional', done: false},
  {label: 'Pacifier offered', sub: 'At sleep time - reduces SUID risk - optional', done: false},
];

const SLEEP_QUALITY = [
  'Peaceful/quiet', 'Noisy breathing', 'Grunting/straining',
  'Startling/Moro', 'Sweating', 'Smiling in sleep',
];

const SLEEP_BLOCKS = [
  {start: 0, width: 22, shade: '#5A35B2'},   // 12am-~5:15am night sleep
  {start: 24, width: 4, shade: '#C4B5FD'},    // brief wake
  {start: 30, width: 8, shade: '#8B5CF6'},    // morning nap
  {start: 44, width: 10, shade: '#8B5CF6'},   // late morning nap
  {start: 58, width: 12, shade: '#8B5CF6'},   // afternoon nap
  {start: 74, width: 6, shade: '#C4B5FD'},    // cat nap
  {start: 86, width: 10, shade: '#5A35B2'},   // early night segment
];

const WEEK_BARS = [
  {label: 'Mar 29', height: 0.82},
  {label: 'Mar 30', height: 0.9},
  {label: 'Mar 31', height: 0.86},
  {label: 'Apr 1', height: 0.92},
  {label: 'Apr 2', height: 0.84},
  {label: 'Apr 3', height: 0.95},
  {label: 'Today', height: 0.88},
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

const IconChip = ({label, icon, active, onPress}) => (
  <TouchableOpacity
    style={[st.iconChip, active && st.iconChipOn]}
    onPress={onPress}
    activeOpacity={0.7}>
    <Icon
      family="Ionicons"
      name={icon}
      size={ms(14)}
      color={active ? '#5A35B2' : Colors.textSecondary}
    />
    <AppText
      variant="caption"
      color={active ? '#5A35B2' : Colors.textSecondary}
      style={{marginLeft: s(5), fontWeight: active ? '700' : '500'}}>
      {label}
    </AppText>
  </TouchableOpacity>
);

const SettleChip = ({label, sub, active, onPress}) => (
  <TouchableOpacity
    style={[st.settleChip, active && st.settleChipOn]}
    onPress={onPress}
    activeOpacity={0.7}>
    <AppText
      variant="caption"
      color={active ? '#5A35B2' : Colors.textPrimary}
      style={{fontWeight: '700'}}>
      {label}
    </AppText>
    <AppText
      variant="subtext"
      color={active ? '#7C3AED' : Colors.textTertiary}
      style={{fontSize: ms(10), marginTop: vs(2)}}>
      {sub}
    </AppText>
  </TouchableOpacity>
);

const MChip = ({label, active, onPress}) => (
  <TouchableOpacity
    style={[st.mchip, active && st.mchipOn]}
    onPress={onPress}
    activeOpacity={0.7}>
    <AppText
      variant="caption"
      color={active ? '#5A35B2' : Colors.textSecondary}
      style={{fontWeight: active ? '700' : '500'}}>
      {label}
    </AppText>
  </TouchableOpacity>
);

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const SleepTrackerScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const [tab, setTab] = useState('log');
  const [sleepType, setSleepType] = useState(0);
  const [settled, setSettled] = useState(0);
  const [wakings, setWakings] = useState(3);
  const [sleepStart, setSleepStart] = useState('09:00 PM');
  const [wakeTime, setWakeTime] = useState('05:30 AM');
  const [quality, setQuality] = useState([0]);
  const [safeChecks, setSafeChecks] = useState(
    SAFE_CHECKS.map(c => c.done),
  );

  const toggleQuality = (i) => {
    setQuality(prev =>
      prev.includes(i) ? prev.filter(v => v !== i) : [...prev, i],
    );
  };

  const toggleSafeCheck = (i) => {
    setSafeChecks(prev => {
      const next = [...prev];
      next[i] = !next[i];
      return next;
    });
  };

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
              color="rgba(255,255,255,0.8)">
              Sleep tracker
            </AppText>
          </View>
          <TouchableOpacity style={st.savePill} activeOpacity={0.8}>
            <AppText
              variant="caption"
              color={Colors.white}
              style={{fontWeight: '700'}}>
              Save
            </AppText>
            <Icon
              family="Ionicons"
              name="checkmark"
              size={ms(14)}
              color={Colors.white}
              style={{marginLeft: s(4)}}
            />
          </TouchableOpacity>
        </View>
        <AppText
          variant="screenName"
          color={Colors.white}
          style={{marginTop: vs(6)}}>
          Sleep tracker
        </AppText>
        <AppText
          variant="caption"
          color="rgba(255,255,255,0.7)"
          style={{marginTop: vs(3)}}>
          14.5h logged today · 2 naps · Awake since 9:14 PM
        </AppText>

        {/* Tabs */}
        <View style={st.tabRow}>
          {TABS.map(t => (
            <TouchableOpacity
              key={t.key}
              style={[st.tab, tab === t.key && st.tabOn]}
              onPress={() => setTab(t.key)}
              activeOpacity={0.7}>
              <AppText
                variant="caption"
                color={
                  tab === t.key ? Colors.white : 'rgba(255,255,255,0.6)'
                }
                style={{fontWeight: '700'}}>
                {t.label}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView
        style={st.body}
        contentContainerStyle={st.bodyContent}
        showsVerticalScrollIndicator={false}>

        {/* ═══════════ LOG SLEEP TAB ═══════════ */}
        {tab === 'log' && (
          <>
            <Section title="Sleep type" />
            <View style={st.chipWrap}>
              {SLEEP_TYPES.map((t, i) => (
                <IconChip
                  key={i}
                  label={t.label}
                  icon={t.icon}
                  active={sleepType === i}
                  onPress={() => setSleepType(i)}
                />
              ))}
            </View>

            <Section title="Sleep window" />
            <View style={st.row2}>
              <View style={st.col}>
                <AppText
                  variant="subtext"
                  color={Colors.textSecondary}
                  style={{marginBottom: vs(5), fontWeight: '600'}}>
                  Sleep start
                </AppText>
                <TextInput
                  style={st.input}
                  value={sleepStart}
                  onChangeText={setSleepStart}
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
              <View style={st.col}>
                <AppText
                  variant="subtext"
                  color={Colors.textSecondary}
                  style={{marginBottom: vs(5), fontWeight: '600'}}>
                  Wake time
                </AppText>
                <TextInput
                  style={st.input}
                  value={wakeTime}
                  onChangeText={setWakeTime}
                  placeholderTextColor={Colors.textTertiary}
                />
              </View>
            </View>

            {/* Total duration highlight */}
            <View style={st.totalCard}>
              <AppText
                variant="subtext"
                color="#6D28D9"
                style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5}}>
                Total duration
              </AppText>
              <AppText
                color="#5A35B2"
                style={{fontSize: ms(32), fontWeight: '800', marginTop: vs(4)}}>
                8h 30m
              </AppText>
            </View>

            <Section title="How baby settled" />
            <View style={st.chipWrap}>
              {SETTLE_OPTIONS.map((o, i) => (
                <SettleChip
                  key={i}
                  label={o.label}
                  sub={o.sub}
                  active={settled === i}
                  onPress={() => setSettled(i)}
                />
              ))}
            </View>

            <Section title="Night wakings" />
            <View style={st.wakeCard}>
              <View style={st.wakeCounterRow}>
                <TouchableOpacity
                  style={st.counterBtn}
                  onPress={() => setWakings(Math.max(0, wakings - 1))}
                  activeOpacity={0.7}>
                  <Icon
                    family="Ionicons"
                    name="remove"
                    size={ms(20)}
                    color="#5A35B2"
                  />
                </TouchableOpacity>
                <View style={{alignItems: 'center', flex: 1}}>
                  <AppText
                    color="#5A35B2"
                    style={{fontSize: ms(40), fontWeight: '800'}}>
                    {wakings}
                  </AppText>
                  <AppText
                    variant="subtext"
                    color={Colors.textSecondary}
                    style={{fontWeight: '600'}}>
                    wakings last night
                  </AppText>
                </View>
                <TouchableOpacity
                  style={st.counterBtn}
                  onPress={() => setWakings(wakings + 1)}
                  activeOpacity={0.7}>
                  <Icon
                    family="Ionicons"
                    name="add"
                    size={ms(20)}
                    color="#5A35B2"
                  />
                </TouchableOpacity>
              </View>
              <View style={st.wakeFooter}>
                <AppText
                  variant="subtext"
                  color="#6D28D9"
                  style={{fontWeight: '600', textAlign: 'center'}}>
                  3 wakings is normal · 44-day-old babies wake every 2-3h to feed
                </AppText>
              </View>
            </View>

            <Section title="Safe sleep checklist" />

            {/* Red warning box */}
            <View style={st.warnBox}>
              <Icon
                family="Ionicons"
                name="warning"
                size={ms(16)}
                color="#B91C1C"
              />
              <AppText
                variant="caption"
                color="#7F1D1D"
                style={{flex: 1, marginLeft: s(8), lineHeight: ms(17)}}>
                <AppText style={{fontWeight: '700'}}>SUID risk peaks 0-6 months.</AppText>
                {' '}Following safe sleep guidelines reduces sudden unexpected infant death by up to 60%.
              </AppText>
            </View>

            <View style={st.checkCard}>
              {SAFE_CHECKS.map((c, i) => {
                const on = safeChecks[i];
                return (
                  <TouchableOpacity
                    key={i}
                    style={[
                      st.checkRow,
                      i === SAFE_CHECKS.length - 1 && {borderBottomWidth: 0},
                    ]}
                    onPress={() => toggleSafeCheck(i)}
                    activeOpacity={0.7}>
                    <View style={[st.checkBox, on && st.checkBoxOn]}>
                      {on && (
                        <Icon
                          family="Ionicons"
                          name="checkmark"
                          size={ms(13)}
                          color={Colors.white}
                        />
                      )}
                    </View>
                    <View style={{flex: 1, marginLeft: s(10)}}>
                      <AppText
                        variant="caption"
                        color={Colors.textPrimary}
                        style={{fontWeight: '700'}}>
                        {c.label}
                      </AppText>
                      <AppText
                        variant="subtext"
                        color={Colors.textSecondary}
                        style={{marginTop: vs(2)}}>
                        {c.sub}
                      </AppText>
                    </View>
                  </TouchableOpacity>
                );
              })}
            </View>

            <Section title="Sleep quality" />
            <View style={st.chipWrap}>
              {SLEEP_QUALITY.map((q, i) => (
                <MChip
                  key={i}
                  label={q}
                  active={quality.includes(i)}
                  onPress={() => toggleQuality(i)}
                />
              ))}
            </View>
          </>
        )}

        {/* ═══════════ TODAY TAB ═══════════ */}
        {tab === 'today' && (
          <>
            <Section title="Sleep blocks · Apr 5" />
            <View style={st.wcard}>
              <View style={{flexDirection: 'row', alignItems: 'baseline', marginBottom: vs(10)}}>
                <AppText
                  variant="subtext"
                  color={Colors.textSecondary}
                  style={{fontWeight: '600'}}>
                  Total sleep today{' '}
                </AppText>
                <AppText
                  color="#5A35B2"
                  style={{fontSize: ms(18), fontWeight: '800'}}>
                  14.5 hours
                </AppText>
              </View>

              {/* Sleep blocks horizontal bar */}
              <View style={st.blocksTrack}>
                {SLEEP_BLOCKS.map((b, i) => (
                  <View
                    key={i}
                    style={{
                      position: 'absolute',
                      left: `${b.start}%`,
                      width: `${b.width}%`,
                      top: 0,
                      bottom: 0,
                      backgroundColor: b.shade,
                      borderRadius: ms(4),
                    }}
                  />
                ))}
              </View>
              <View style={st.blocksAxis}>
                <AppText variant="subtext" color={Colors.textTertiary} style={{fontSize: ms(9)}}>12am</AppText>
                <AppText variant="subtext" color={Colors.textTertiary} style={{fontSize: ms(9)}}>6am</AppText>
                <AppText variant="subtext" color={Colors.textTertiary} style={{fontSize: ms(9)}}>12pm</AppText>
                <AppText variant="subtext" color={Colors.textTertiary} style={{fontSize: ms(9)}}>6pm</AppText>
                <AppText variant="subtext" color={Colors.textTertiary} style={{fontSize: ms(9)}}>Now</AppText>
              </View>
            </View>

            <View style={st.row2}>
              <View style={[st.col, st.statBox]}>
                <AppText
                  color="#5A35B2"
                  style={{fontSize: ms(22), fontWeight: '800'}}>
                  8h30m
                </AppText>
                <AppText
                  variant="subtext"
                  color={Colors.textSecondary}
                  style={{fontWeight: '600', marginTop: vs(2)}}>
                  Night sleep
                </AppText>
                <View style={{flexDirection: 'row', alignItems: 'center', marginTop: vs(4)}}>
                  <AppText
                    variant="subtext"
                    color="#047857"
                    style={{fontWeight: '700'}}>
                    Good{' '}
                  </AppText>
                  <Icon
                    family="Ionicons"
                    name="checkmark-circle"
                    size={ms(12)}
                    color="#047857"
                  />
                </View>
              </View>
              <View style={[st.col, st.statBox]}>
                <AppText
                  color="#5A35B2"
                  style={{fontSize: ms(22), fontWeight: '800'}}>
                  6h0m
                </AppText>
                <AppText
                  variant="subtext"
                  color={Colors.textSecondary}
                  style={{fontWeight: '600', marginTop: vs(2)}}>
                  Day sleep
                </AppText>
                <AppText
                  variant="subtext"
                  color={Colors.textTertiary}
                  style={{marginTop: vs(4)}}>
                  3 naps
                </AppText>
              </View>
            </View>

            <Section title="7-day sleep average" />
            <View style={st.wcard}>
              <View style={st.weekChart}>
                {WEEK_BARS.map((b, i) => (
                  <View key={i} style={st.weekBarCol}>
                    <View
                      style={[
                        st.weekBar,
                        {
                          height: `${b.height * 100}%`,
                          backgroundColor: i === WEEK_BARS.length - 1 ? '#5A35B2' : '#8B5CF6',
                        },
                      ]}
                    />
                  </View>
                ))}
              </View>
              <View style={st.weekAxis}>
                <AppText variant="subtext" color={Colors.textTertiary} style={{fontSize: ms(9)}}>Mar 29</AppText>
                <AppText variant="subtext" color={Colors.textTertiary} style={{fontSize: ms(9)}}>Today</AppText>
              </View>
              <View style={st.weekFooter}>
                <AppText
                  variant="subtext"
                  color="#6D28D9"
                  style={{fontWeight: '600', textAlign: 'center'}}>
                  7-day average: 14.7h · WHO norm for 44 days: 14-17h{' '}
                  <AppText color="#047857" style={{fontWeight: '700'}}>✓</AppText>
                </AppText>
              </View>
            </View>
          </>
        )}

        {/* ═══════════ AYU TAB ═══════════ */}
        {tab === 'ayu' && (
          <>
            {/* Mini Ayu header */}
            <View style={st.ayuHeader}>
              <View style={{flexDirection: 'row', alignItems: 'center'}}>
                <Icon
                  family="Ionicons"
                  name="sparkles"
                  size={ms(14)}
                  color={Colors.accent}
                />
                <AppText
                  variant="caption"
                  color={Colors.accent}
                  style={{fontWeight: '700', marginLeft: s(5), textTransform: 'uppercase', letterSpacing: 0.5}}>
                  Ayu Intel · Sleep
                </AppText>
              </View>
              <AppText
                variant="screenName"
                color={Colors.white}
                style={{marginTop: vs(4)}}>
                Sleep intelligence
              </AppText>

              {/* KPI strip */}
              <View style={st.kpiStrip}>
                <View style={st.kpi}>
                  <AppText variant="subtext" color="rgba(255,255,255,0.6)" style={{fontSize: ms(9)}}>
                    Daily sleep
                  </AppText>
                  <AppText color={Colors.white} style={{fontSize: ms(16), fontWeight: '800', marginTop: vs(2)}}>
                    14.7h
                  </AppText>
                  <AppText variant="subtext" color="#86EFAC" style={{fontSize: ms(9), fontWeight: '700'}}>
                    7-day avg
                  </AppText>
                </View>
                <View style={st.kpiDivider} />
                <View style={st.kpi}>
                  <AppText variant="subtext" color="rgba(255,255,255,0.6)" style={{fontSize: ms(9)}}>
                    WHO norm
                  </AppText>
                  <AppText color={Colors.white} style={{fontSize: ms(16), fontWeight: '800', marginTop: vs(2)}}>
                    14-17h
                  </AppText>
                  <AppText variant="subtext" color="rgba(255,255,255,0.5)" style={{fontSize: ms(9)}}>
                    44 days old
                  </AppText>
                </View>
                <View style={st.kpiDivider} />
                <View style={st.kpi}>
                  <AppText variant="subtext" color="rgba(255,255,255,0.6)" style={{fontSize: ms(9)}}>
                    Wakings
                  </AppText>
                  <AppText color={Colors.white} style={{fontSize: ms(16), fontWeight: '800', marginTop: vs(2)}}>
                    3/night
                  </AppText>
                  <AppText variant="subtext" color="#86EFAC" style={{fontSize: ms(9), fontWeight: '700'}}>
                    Normal
                  </AppText>
                </View>
              </View>
            </View>

            {/* Sleep pattern assessment */}
            <View style={st.wcard}>
              <AppText
                variant="body"
                color={Colors.textPrimary}
                style={{fontWeight: '700'}}>
                Sleep pattern assessment
              </AppText>
              <AppText
                variant="subtext"
                color={Colors.textSecondary}
                style={{marginTop: vs(2), marginBottom: vs(10)}}>
                44 days · developmentally normal
              </AppText>

              <AyuRow
                color="green"
                icon="checkmark-circle"
                title="14.7h daily sleep is healthy"
                sub="Within WHO norm of 14-17h for 1-2 month olds. Total sleep supports rapid brain development at this stage."
              />
              <AyuRow
                color="green"
                icon="checkmark-circle"
                title="3 wakings is age-appropriate"
                sub="Newborns 0-3 months typically wake 2-4 times per night for feeding. Stomach capacity limits sleep duration."
              />
              <AyuRow
                color="blue"
                icon="information-circle"
                title="Circadian rhythm not yet established"
                sub="Day/night cycle develops around 6-8 weeks. Expect more consolidated night sleep in 2-4 weeks."
              />
              <AyuRow
                color="amber"
                icon="alert-circle"
                title="8-10 week regression expected"
                sub="Brief increase in wakings common around 8-10 weeks as sleep cycles mature. Temporary and normal."
                last
              />
            </View>

            {/* Safe sleep adherence */}
            <View style={st.wcard}>
              <AppText
                variant="body"
                color={Colors.textPrimary}
                style={{fontWeight: '700'}}>
                Safe sleep adherence
              </AppText>
              <AppText
                variant="subtext"
                color={Colors.textSecondary}
                style={{marginTop: vs(2), marginBottom: vs(10)}}>
                4 of 6 checks completed · 2 optional
              </AppText>

              <AyuRow
                color="green"
                icon="shield-checkmark"
                title="Back sleeping reduces SUID 60%"
                sub="Consistent back placement is the single most effective SUID prevention. Great work."
              />
              <AyuRow
                color="amber"
                icon="thermometer-outline"
                title="Room temperature not logged"
                sub="Optimal nursery temperature is 18-20°C (65-68°F). Overheating increases SUID risk. Consider adding a room thermometer."
              />
              <AyuRow
                color="blue"
                icon="information-circle"
                title="Pacifier: 50-70% SUID reduction"
                sub="Offering pacifier at sleep time is associated with major SUID risk reduction once breastfeeding is established (3-4 weeks)."
                last
              />
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
            Save sleep {'\u00b7'} Night {'\u00b7'} 8h 30m
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );
};

// ──────────────────────────────────────────────
// AyuRow subcomponent
// ──────────────────────────────────────────────

const AyuRow = ({color, icon, title, sub, last}) => {
  const palette = {
    green: {bg: '#ECFDF5', border: '#6EE7B7', icon: '#047857', title: '#064E3B'},
    blue: {bg: '#EFF6FF', border: '#93C5FD', icon: '#1D4ED8', title: '#1E3A8A'},
    amber: {bg: '#FFFBEB', border: '#FCD34D', icon: '#B45309', title: '#78350F'},
  }[color];

  return (
    <View
      style={[
        st.ayuRow,
        {backgroundColor: palette.bg, borderColor: palette.border},
        !last && {marginBottom: vs(8)},
      ]}>
      <Icon family="Ionicons" name={icon} size={ms(18)} color={palette.icon} />
      <View style={{flex: 1, marginLeft: s(9)}}>
        <AppText
          variant="caption"
          color={palette.title}
          style={{fontWeight: '700'}}>
          {title}
        </AppText>
        <AppText
          variant="subtext"
          color={palette.title}
          style={{marginTop: vs(2), lineHeight: ms(15), opacity: 0.85}}>
          {sub}
        </AppText>
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
    paddingBottom: vs(10),
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
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.3)',
  },

  // Tabs
  tabRow: {
    flexDirection: 'row',
    marginTop: vs(12),
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: ms(10),
    padding: ms(3),
  },
  tab: {
    flex: 1,
    paddingVertical: vs(8),
    alignItems: 'center',
    borderRadius: ms(8),
  },
  tabOn: {
    backgroundColor: 'rgba(255,255,255,0.18)',
  },

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(4)},

  // Section
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
  secLine: {
    flex: 1,
    height: StyleSheet.hairlineWidth,
    backgroundColor: '#E5DDD3',
  },

  // Chips
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6)},
  iconChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(11),
    paddingVertical: vs(8),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    backgroundColor: Colors.white,
  },
  iconChipOn: {
    backgroundColor: '#F4EEFF',
    borderColor: '#A78BFA',
  },
  mchip: {
    paddingHorizontal: s(11),
    paddingVertical: vs(7),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    backgroundColor: Colors.white,
  },
  mchipOn: {
    backgroundColor: '#F4EEFF',
    borderColor: '#A78BFA',
  },
  settleChip: {
    paddingHorizontal: s(13),
    paddingVertical: vs(8),
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    backgroundColor: Colors.white,
    minWidth: s(95),
  },
  settleChipOn: {
    backgroundColor: '#F4EEFF',
    borderColor: '#A78BFA',
  },

  // Row / Col
  row2: {flexDirection: 'row', gap: s(10)},
  col: {flex: 1},

  // Input
  input: {
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    paddingHorizontal: s(12),
    paddingVertical: vs(10),
    fontSize: ms(14),
    fontFamily: 'DMSans-Regular',
    color: Colors.textPrimary,
    fontWeight: '600',
  },

  // Total duration highlight
  totalCard: {
    backgroundColor: '#F4EEFF',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#C4B5FD',
    padding: ms(14),
    alignItems: 'center',
    marginTop: vs(12),
  },

  // White card
  wcard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    padding: ms(13),
    marginBottom: vs(4),
  },

  // Wake card
  wakeCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    overflow: 'hidden',
  },
  wakeCounterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: ms(14),
  },
  counterBtn: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    backgroundColor: '#F4EEFF',
    borderWidth: 0.5,
    borderColor: '#C4B5FD',
    alignItems: 'center',
    justifyContent: 'center',
  },
  wakeFooter: {
    backgroundColor: '#F4EEFF',
    borderTopWidth: 0.5,
    borderTopColor: '#C4B5FD',
    paddingHorizontal: s(12),
    paddingVertical: vs(9),
  },

  // Warn box
  warnBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#FEF0F0',
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: '#FDA4A4',
    padding: ms(12),
    marginBottom: vs(10),
  },

  // Safe check card
  checkCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    paddingHorizontal: ms(12),
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: vs(11),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5DDD3',
  },
  checkBox: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(6),
    borderWidth: 1.5,
    borderColor: '#C4B5FD',
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(1),
  },
  checkBoxOn: {
    backgroundColor: '#10B981',
    borderColor: '#10B981',
  },

  // Today tab
  blocksTrack: {
    height: vs(26),
    backgroundColor: '#F3F0FA',
    borderRadius: ms(6),
    position: 'relative',
    overflow: 'hidden',
  },
  blocksAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(6),
  },
  statBox: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    padding: ms(13),
    marginTop: vs(10),
  },
  weekChart: {
    flexDirection: 'row',
    height: vs(80),
    alignItems: 'flex-end',
    gap: s(8),
    paddingHorizontal: s(4),
  },
  weekBarCol: {
    flex: 1,
    height: '100%',
    justifyContent: 'flex-end',
  },
  weekBar: {
    width: '100%',
    borderRadius: ms(4),
  },
  weekAxis: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(6),
    paddingHorizontal: s(4),
  },
  weekFooter: {
    backgroundColor: '#F4EEFF',
    borderRadius: ms(10),
    paddingHorizontal: s(10),
    paddingVertical: vs(7),
    marginTop: vs(10),
  },

  // Ayu tab
  ayuHeader: {
    backgroundColor: Colors.primary,
    borderRadius: ms(16),
    padding: ms(14),
    marginTop: vs(12),
    marginBottom: vs(12),
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
  },
  kpiStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(0,0,0,0.2)',
    borderRadius: ms(12),
    padding: ms(10),
    marginTop: vs(12),
  },
  kpi: {flex: 1, alignItems: 'center'},
  kpiDivider: {
    width: StyleSheet.hairlineWidth,
    height: vs(32),
    backgroundColor: 'rgba(255,255,255,0.2)',
  },
  ayuRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: ms(11),
    borderRadius: ms(10),
    borderWidth: 0.5,
  },

  bottomBar: {backgroundColor: Colors.white, paddingHorizontal: s(13), paddingTop: vs(8), paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10), borderTopWidth: 0.5, borderTopColor: '#d1d5db'},
  primaryButton: {flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: vs(13), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
});

export default SleepTrackerScreen;
