import React, {useState, useEffect, useRef} from 'react';
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
// Constants & Data
// ──────────────────────────────────────────────

const TABS = ['Breastfeed', 'Formula / bottle'];

const FEED_ROWS = [
  {side: 'L', label: 'Breastfeed · Left 18m, Right 14m', time: '09:00 AM · Feed 1', dur: '32 min'},
  {side: 'R', label: 'Breastfeed · Right 15m, Left 12m', time: '11:20 AM · Feed 2', dur: '27 min'},
  {side: 'L', label: 'Breastfeed · Left 20m, Right 15m', time: '01:45 PM · Feed 3', dur: '35 min'},
  {side: 'R', label: 'Breastfeed · Right 17m, Left 14m', time: '04:10 PM · Feed 4', dur: '31 min'},
  {side: 'L', label: 'Breastfeed · Left 22m, Right 17m', time: '07:16 PM · Feed 5', dur: '39 min'},
  {side: null, label: 'Feed 6 — not yet started', time: 'Due ~09:30 PM', dur: '—'},
];

const AFTER_FEED_CHIPS = [
  {label: 'Burped', icon: 'checkmark-circle-outline'},
  {label: 'Settled well'},
  {label: 'Wet nappy after'},
  {label: 'Spit-up small'},
  {label: 'Spit-up large'},
  {label: 'Fussy at breast'},
];

const FEED_TYPES = ['Formula', 'Expressed breast milk'];

const FORMULA_BRANDS = ['Nan Pro 1', 'Aptamil 1', 'Similac Advance', 'Dexolac 1', 'Other'];

const FEED_GO_CHIPS = [
  'Fed eagerly',
  'Refused initially',
  'Fell asleep mid-feed',
  'Left some',
  'Finished all',
  'Spit-up after',
];

// ──────────────────────────────────────────────
// Helpers
// ──────────────────────────────────────────────

const formatTime = (secs) => {
  const m = Math.floor(secs / 60).toString().padStart(2, '0');
  const s2 = (secs % 60).toString().padStart(2, '0');
  return `${m}:${s2}`;
};

// ──────────────────────────────────────────────
// Subcomponents
// ──────────────────────────────────────────────

const Section = ({title}) => (
  <View style={st.sec}>
    <AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>{title}</AppText>
    <View style={st.secLine} />
  </View>
);

// ──────────────────────────────────────────────
// Main Screen
// ──────────────────────────────────────────────

const FeedingTrackerScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();

  const [activeTab, setActiveTab] = useState(0);

  // Breastfeed timer state
  const [running, setRunning] = useState(false);
  const [secs, setSecs] = useState(0);
  const [activeSide, setActiveSide] = useState('L'); // 'L' or 'R'
  const intervalRef = useRef(null);

  useEffect(() => {
    if (running) {
      intervalRef.current = setInterval(() => setSecs(prev => prev + 1), 1000);
    } else if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [running]);

  // After feed chips
  const [afterFeed, setAfterFeed] = useState([0]);

  // Formula tab state
  const [feedType, setFeedType] = useState(0);
  const [formulaBrand, setFormulaBrand] = useState(0);
  const [feedGo, setFeedGo] = useState([]);
  const [volume, setVolume] = useState('90');
  const [volumeNumpad, setVolumeNumpad] = useState(false);

  const toggleMulti = (arr, setArr, idx) => {
    setArr(prev => prev.includes(idx) ? prev.filter(i => i !== idx) : [...prev, idx]);
  };

  const activeSideLabel = activeSide === 'L' ? 'Left breast' : 'Right breast';

  // ────────────────────────────────────────────
  // Render tabs
  // ────────────────────────────────────────────

  const renderBreastfeedTab = () => (
    <View>
      {/* Feed timer hero card */}
      <View style={st.timerCard}>
        <AppText
          color={Colors.white}
          style={{fontSize: ms(54), fontWeight: '800', letterSpacing: 1, textAlign: 'center'}}>
          {formatTime(secs)}
        </AppText>
        <AppText
          variant="subtext"
          color="rgba(255,255,255,0.65)"
          style={{textAlign: 'center', marginTop: vs(2), marginBottom: vs(14)}}>
          {running ? 'Tap pause to stop' : 'Tap a side to start'}
        </AppText>

        <View style={st.sideRow}>
          <TouchableOpacity
            style={[st.sideBtn, activeSide === 'L' && st.sideBtnOn]}
            onPress={() => setActiveSide('L')}
            activeOpacity={0.8}>
            <AppText
              variant="bodyBold"
              color={activeSide === 'L' ? Colors.white : 'rgba(255,255,255,0.85)'}
              style={{fontWeight: '700'}}>
              Left breast
            </AppText>
            <AppText
              variant="caption"
              color={activeSide === 'L' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)'}
              style={{marginTop: vs(2)}}>
              {activeSide === 'L' ? 'Active · Last side used' : 'Last side used'}
            </AppText>
          </TouchableOpacity>

          <TouchableOpacity
            style={[st.sideBtn, activeSide === 'R' && st.sideBtnOn]}
            onPress={() => setActiveSide('R')}
            activeOpacity={0.8}>
            <AppText
              variant="bodyBold"
              color={activeSide === 'R' ? Colors.white : 'rgba(255,255,255,0.85)'}
              style={{fontWeight: '700'}}>
              Right breast
            </AppText>
            <AppText
              variant="caption"
              color={activeSide === 'R' ? 'rgba(255,255,255,0.85)' : 'rgba(255,255,255,0.55)'}
              style={{marginTop: vs(2)}}>
              Alternate next
            </AppText>
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={[st.playBtn, running && st.playBtnRunning]}
          onPress={() => setRunning(prev => !prev)}
          activeOpacity={0.85}>
          <Icon
            family="Ionicons"
            name={running ? 'pause' : 'play'}
            size={ms(30)}
            color={running ? Colors.white : Colors.primary}
          />
        </TouchableOpacity>
      </View>

      {/* After this feed */}
      <Section title="After this feed" />
      <View style={st.chipWrap}>
        {AFTER_FEED_CHIPS.map((chip, i) => {
          const isOn = afterFeed.includes(i);
          return (
            <TouchableOpacity
              key={i}
              style={[st.mchip, isOn && st.mchipOn]}
              onPress={() => toggleMulti(afterFeed, setAfterFeed, i)}
              activeOpacity={0.7}>
              <AppText
                variant="caption"
                color={isOn ? '#064E3B' : '#555'}
                style={{fontWeight: isOn ? '700' : '500'}}>
                {chip.label}
              </AppText>
              {isOn && (
                <Icon
                  family="Ionicons"
                  name="checkmark"
                  size={ms(13)}
                  color="#064E3B"
                  style={{marginLeft: s(4)}}
                />
              )}
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderFormulaTab = () => (
    <View>
      {/* Feed type */}
      <Section title="Feed type" />
      <View style={st.chipWrap}>
        {FEED_TYPES.map((t, i) => {
          const isOn = feedType === i;
          return (
            <TouchableOpacity
              key={i}
              style={[st.mchip, isOn && st.mchipPurpleOn]}
              onPress={() => setFeedType(i)}
              activeOpacity={0.7}>
              <AppText
                variant="caption"
                color={isOn ? '#4C1D95' : '#555'}
                style={{fontWeight: isOn ? '700' : '500'}}>
                {t}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Volume */}
      <Section title="Volume - tap to enter" />
      <TouchableOpacity style={st.volumeBox} activeOpacity={0.8} onPress={() => setVolumeNumpad(true)}>
        <View style={{flex: 1}}>
          <AppText variant="subtext" color={Colors.textSecondary}>Amount given</AppText>
          <AppText color="#6D28D9" style={{fontSize: ms(28), fontWeight: '800', marginTop: vs(2)}}>
            {volume ? `${volume} ml` : 'Tap to enter'}
          </AppText>
        </View>
        <Icon family="Ionicons" name="create-outline" size={ms(22)} color="#6D28D9" />
      </TouchableOpacity>
      <NumpadModal
        visible={volumeNumpad}
        title="Volume (ml)"
        hint="Enter amount in ml"
        initialValue={volume}
        onClose={() => setVolumeNumpad(false)}
        onConfirm={(val) => { setVolume(val); setVolumeNumpad(false); }}
      />

      {/* Formula brand */}
      <Section title="Formula brand (if formula)" />
      <View style={st.chipWrap}>
        {FORMULA_BRANDS.map((b, i) => {
          const isOn = formulaBrand === i;
          return (
            <TouchableOpacity
              key={i}
              style={[st.mchip, isOn && st.mchipPurpleOn]}
              onPress={() => setFormulaBrand(i)}
              activeOpacity={0.7}>
              <AppText
                variant="caption"
                color={isOn ? '#4C1D95' : '#555'}
                style={{fontWeight: isOn ? '700' : '500'}}>
                {b}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* How did it go */}
      <Section title="How did the feed go?" />
      <View style={st.chipWrap}>
        {FEED_GO_CHIPS.map((chip, i) => {
          const isOn = feedGo.includes(i);
          return (
            <TouchableOpacity
              key={i}
              style={[st.mchip, isOn && st.mchipOn]}
              onPress={() => toggleMulti(feedGo, setFeedGo, i)}
              activeOpacity={0.7}>
              <AppText
                variant="caption"
                color={isOn ? '#064E3B' : '#555'}
                style={{fontWeight: isOn ? '700' : '500'}}>
                {chip}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  const renderAyuTab = () => (
    <View>
      {/* Mini Ayu header */}
      <View style={st.ayuHeader}>
        <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(4)}}>
          <Icon family="Ionicons" name="sparkles" size={ms(14)} color={Colors.accent} />
          <AppText
            variant="caption"
            color={Colors.accent}
            style={{fontWeight: '700', marginLeft: s(5), textTransform: 'uppercase', letterSpacing: 0.5}}>
            Ayu Intel · Feeding
          </AppText>
        </View>
        <AppText variant="screenName" color={Colors.white}>Feeding intelligence</AppText>

        <View style={st.kpiStrip}>
          <View style={st.kpiCell}>
            <AppText variant="subtext" color="rgba(255,255,255,0.6)">Frequency</AppText>
            <AppText color={Colors.white} style={{fontSize: ms(16), fontWeight: '800', marginTop: vs(2)}}>8/day</AppText>
            <AppText variant="subtext" color="#6EE7B7" style={{fontWeight: '700'}}>Ideal</AppText>
          </View>
          <View style={st.kpiDivider} />
          <View style={st.kpiCell}>
            <AppText variant="subtext" color="rgba(255,255,255,0.6)">Avg duration</AppText>
            <AppText color={Colors.white} style={{fontSize: ms(16), fontWeight: '800', marginTop: vs(2)}}>32 min</AppText>
            <AppText variant="subtext" color="rgba(255,255,255,0.6)">per feed</AppText>
          </View>
          <View style={st.kpiDivider} />
          <View style={st.kpiCell}>
            <AppText variant="subtext" color="rgba(255,255,255,0.6)">Supply signal</AppText>
            <AppText color={Colors.white} style={{fontSize: ms(16), fontWeight: '800', marginTop: vs(2)}}>Good</AppText>
            <AppText variant="subtext" color="#6EE7B7" style={{fontWeight: '700'}}>8 wet nappies</AppText>
          </View>
        </View>
      </View>

      {/* Breastfeeding adequacy card */}
      <View style={st.wcard}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>Breastfeeding adequacy</AppText>
        <AppText variant="subtext" color={Colors.textSecondary} style={{marginBottom: vs(10)}}>
          Key indicators at 44 days
        </AppText>

        <View style={st.insightRow}>
          <View style={[st.insightDot, {backgroundColor: '#10B981'}]}>
            <Icon family="Ionicons" name="checkmark" size={ms(12)} color={Colors.white} />
          </View>
          <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(17)}}>
            <AppText style={{fontWeight: '700'}}>8 feeds/day</AppText> — excellent frequency for this age.
          </AppText>
        </View>
        <View style={st.insightRow}>
          <View style={[st.insightDot, {backgroundColor: '#10B981'}]}>
            <Icon family="Ionicons" name="checkmark" size={ms(12)} color={Colors.white} />
          </View>
          <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(17)}}>
            <AppText style={{fontWeight: '700'}}>30-35 min duration</AppText> — appropriate for full hindmilk transfer.
          </AppText>
        </View>
        <View style={st.insightRow}>
          <View style={[st.insightDot, {backgroundColor: '#10B981'}]}>
            <Icon family="Ionicons" name="checkmark" size={ms(12)} color={Colors.white} />
          </View>
          <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(17)}}>
            <AppText style={{fontWeight: '700'}}>Left-right alternation</AppText> — correct pattern to balance supply.
          </AppText>
        </View>
        <View style={[st.insightRow, {borderBottomWidth: 0}]}>
          <View style={[st.insightDot, {backgroundColor: '#F59E0B'}]}>
            <Icon family="Ionicons" name="alert" size={ms(12)} color={Colors.white} />
          </View>
          <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(17)}}>
            <AppText style={{fontWeight: '700'}}>Watch for 6-week growth spurts</AppText> — cluster feeding is normal and temporary.
          </AppText>
        </View>
      </View>

      {/* Maternal nutrition card */}
      <View style={st.wcard}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>Maternal nutrition for breastfeeding</AppText>
        <AppText variant="subtext" color={Colors.textSecondary} style={{marginBottom: vs(10)}}>
          What Zara's mother needs
        </AppText>

        <View style={st.insightRow}>
          <View style={[st.insightDot, {backgroundColor: '#10B981'}]}>
            <Icon family="Ionicons" name="restaurant-outline" size={ms(12)} color={Colors.white} />
          </View>
          <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(17)}}>
            <AppText style={{fontWeight: '700'}}>+500 kcal/day</AppText> above baseline to support milk production.
          </AppText>
        </View>
        <View style={st.insightRow}>
          <View style={[st.insightDot, {backgroundColor: '#10B981'}]}>
            <Icon family="Ionicons" name="water-outline" size={ms(12)} color={Colors.white} />
          </View>
          <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(17)}}>
            <AppText style={{fontWeight: '700'}}>3+ litres hydration</AppText> daily — drink a glass with every feed.
          </AppText>
        </View>
        <View style={[st.insightRow, {borderBottomWidth: 0}]}>
          <View style={[st.insightDot, {backgroundColor: '#3B82F6'}]}>
            <Icon family="Ionicons" name="medkit-outline" size={ms(12)} color={Colors.white} />
          </View>
          <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(17)}}>
            <AppText style={{fontWeight: '700'}}>Continue postnatal supplements</AppText> — iron, calcium, vitamin D and B12.
          </AppText>
        </View>
      </View>
    </View>
  );

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Fixed Header ── */}
      <View style={[st.header, {paddingTop: insets.top + vs(10)}]}>
        <View style={st.topRow}>
          <TouchableOpacity
            style={st.backBtn}
            onPress={() => navigation.goBack()}
            hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="screenName" style={{color: Colors.white, fontSize: ms(18), fontWeight: '700'}}>Feeding tracker</AppText>
            <AppText variant="caption" style={{color: 'rgba(255,255,255,0.5)', fontSize: ms(11)}}>Baby Zara - Feed 6 of today</AppText>
          </View>
        </View>

        {/* Tab bar */}
        <View style={st.tabBar}>
          {TABS.map((t, i) => (
            <TouchableOpacity
              key={i}
              style={[st.tabBtn, activeTab === i && st.tabBtnOn]}
              onPress={() => setActiveTab(i)}
              activeOpacity={0.7}>
              <AppText
                variant="subtext"
                color={activeTab === i ? Colors.white : 'rgba(255,255,255,0.55)'}
                style={{fontWeight: '700'}}>
                {t}
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
        {activeTab === 0 && renderBreastfeedTab()}
        {activeTab === 1 && renderFormulaTab()}
        <View style={{height: vs(20)}} />
      </ScrollView>

      {/* ── Save Button ── */}
      <View style={st.bottomBar}>
        <TouchableOpacity style={st.primaryButton} activeOpacity={0.85}>
          <Icon family="Ionicons" name="save-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
            Log feed {'\u00b7'} {activeSideLabel} {'\u00b7'} {formatTime(secs)}
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
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(4)},
  topRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(8)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},

  readyPill: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.14)',
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.25)',
  },
  readyDot: {width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: '#10B981'},

  // Tab bar
  tabBar: {flexDirection: 'row', gap: s(6), marginTop: vs(14)},
  tabBtn: {
    paddingHorizontal: s(14),
    paddingVertical: vs(7),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  tabBtnOn: {backgroundColor: Colors.accent, borderColor: Colors.accent},

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(12)},

  // Section heading
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(16), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Timer hero card
  timerCard: {
    backgroundColor: Colors.primary,
    borderRadius: ms(18),
    padding: ms(18),
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.12)',
    alignItems: 'center',
  },
  sideRow: {flexDirection: 'row', gap: s(10), width: '100%', marginBottom: vs(16)},
  sideBtn: {
    flex: 1,
    paddingVertical: vs(12),
    paddingHorizontal: s(12),
    borderRadius: ms(14),
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
  },
  sideBtnOn: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },
  playBtn: {
    width: ms(70),
    height: ms(70),
    borderRadius: ms(35),
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: {width: 0, height: 2},
    shadowOpacity: 0.2,
    shadowRadius: 6,
  },
  playBtnRunning: {backgroundColor: '#E24B4A'},

  // White card
  wcard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    padding: ms(12),
    marginBottom: vs(4),
  },

  // Feed row
  feedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(9),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5DDD3',
  },
  feedBadge: {
    width: ms(26),
    height: ms(26),
    borderRadius: ms(6),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Stats row
  statsRow: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(10)},
  statCell: {flex: 1, alignItems: 'center'},

  // Good info box
  goodBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#ECFDF5',
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: '#6EE7B7',
    padding: ms(10),
  },

  // Chips
  chipWrap: {flexDirection: 'row', flexWrap: 'wrap', gap: s(5), marginBottom: vs(4)},
  mchip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(11),
    paddingVertical: vs(7),
    borderRadius: ms(20),
    borderWidth: 0.5,
    borderColor: '#E5DDD3',
    backgroundColor: '#fff',
  },
  mchipOn: {backgroundColor: '#ECFDF5', borderColor: '#6EE7B7'},
  mchipPurpleOn: {backgroundColor: '#F4F3FF', borderColor: '#A5B4FC'},

  // Formula tab
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: '#F4F3FF',
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: '#A5B4FC',
    padding: ms(12),
    marginBottom: vs(4),
  },
  volumeBox: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F4F3FF',
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: '#A5B4FC',
    padding: ms(14),
  },

  // Ayu tab
  ayuHeader: {
    backgroundColor: Colors.primary,
    borderRadius: ms(16),
    padding: ms(14),
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
    marginBottom: vs(8),
  },
  kpiStrip: {
    flexDirection: 'row',
    marginTop: vs(12),
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: ms(12),
    padding: ms(10),
    borderWidth: 0.5,
    borderColor: 'rgba(255,255,255,0.15)',
  },
  kpiCell: {flex: 1, alignItems: 'center'},
  kpiDivider: {width: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.2)'},

  insightRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: '#E5DDD3',
  },
  insightDot: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(11),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(9),
  },

  bottomBar: {backgroundColor: Colors.white, paddingHorizontal: s(13), paddingTop: vs(8), paddingBottom: Platform.OS === 'ios' ? vs(24) : vs(10), borderTopWidth: 0.5, borderTopColor: '#d1d5db'},
  primaryButton: {flexDirection: 'row', backgroundColor: Colors.primary, paddingVertical: vs(13), borderRadius: ms(12), alignItems: 'center', justifyContent: 'center'},
});

export default FeedingTrackerScreen;
