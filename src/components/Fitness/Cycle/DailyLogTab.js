import React, {useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  TextInput,
  Modal,
  useWindowDimensions,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {
  LOG_TYPE_OPTIONS,
  FLOW_LEVELS,
  FLOW_COLORS,
  SYMPTOM_SCALES,
  SYMPTOM_DEFAULTS,
  MOOD_SCALES,
  PMS_TAGS,
  CM_DETAILED,
  OV_TESTS,
  PCOS_CHECKLIST,
  CYCLE_MEDICATIONS,
  RELATED_CONDITIONS,
  CYCLE_HISTORY_TABLE,
  PHASE_INSIGHTS,
  PERIOD_STATUS_OPTIONS,
  PHYSICAL_SYMPTOMS,
  PAIN_LOCATIONS,
  CRAMP_OPTIONS,
  MOOD_EMOJIS,
  MOOD_TAGS,
  CONTEXT_TAGS,
  SKIN_HAIR_TAGS,
  SEX_OPTIONS,
  CONTRA_OPTIONS,
} from '../../../constants/cycleData';

/* ─── Theme Constants ──────────────────────────────────── */
const PINK = '#c2185b';
const ROSE_DARK = '#6b1237';
const ROSE_BG = '#fce4ec';
const ROSE_TEXT = '#600030';
const ROSE_BORDER = '#f8bbd9';

/* ─── Calendar Phase Data ──────────────────────────────── */
const DAY_LABELS = ['Mon','Tue','Wed','Thu','Fri','Sat','Sun'];
const TODAY_INDEX = 13; // 0-based, day 14

const getPhaseStyle = (dayNum) => {
  if (dayNum >= 1 && dayNum <= 5) return {bg: '#c2185b', text: '#fff'};
  if (dayNum >= 6 && dayNum <= 13) return {bg: '#FFF7EE', text: '#f57f17'};
  if (dayNum >= 14 && dayNum <= 16) return {bg: '#E8F4FD', text: '#1068a8'};
  return {bg: '#F4F3FF', text: '#7b2fbe'};
};

/* ─── Inline Helpers ───────────────────────────────────── */

const SectionLabel = ({children}) => (
  <AppText variant="sectionTitle" color={Colors.textPrimary} style={sty.sectionLabel}>{children}</AppText>
);

const Card = ({children, style}) => (
  <View style={[sty.card, style]}>{children}</View>
);

const Chip = ({label, active, onPress, activeStyle, activeTextStyle}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    style={[sty.chip, active && sty.chipActive, active && activeStyle]}
    onPress={onPress}>
    <Text style={[sty.chipText, active && sty.chipTextActive, active && activeTextStyle]}>
      {label}
    </Text>
  </TouchableOpacity>
);

const Tag = ({label, active, green, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    style={[sty.tag, active && (green ? sty.tagActiveGreen : sty.tagActive)]}
    onPress={onPress}>
    <Text style={[sty.tagText, active && (green ? sty.tagTextActiveGreen : sty.tagTextActive)]}>{label}</Text>
  </TouchableOpacity>
);

const Divider = () => <View style={sty.divider} />;

const SeverityButton = ({val, active, onPress}) => {
  const colors = [
    {bg: '#EEF8F3', text: '#085041'},
    {bg: '#FFF7EE', text: '#854F0B'},
    {bg: '#fce4ec', text: '#600030'},
    {bg: '#b02060', text: '#fff'},
  ];
  const c = colors[val];
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      style={[
        sty.sevBtn,
        active && {backgroundColor: c.bg, borderColor: active && val === 3 ? '#b02060' : c.bg},
      ]}
      onPress={onPress}>
      <Text style={[sty.sevBtnText, active && {color: c.text, fontWeight: '700'}]}>{val}</Text>
    </TouchableOpacity>
  );
};

const SymptomRow = ({item, value, onChange, isLast}) => (
  <View>
    <View style={sty.symptomRow}>
      <View style={sty.symptomLeft}>
        <Text style={sty.symptomIco}>{item.ico}</Text>
        <View style={{flex: 1}}>
          <Text style={sty.symptomName}>{item.name}</Text>
          <Text style={sty.symptomSub}>{item.sub}</Text>
        </View>
      </View>
      <View style={sty.sevRow}>
        {[0, 1, 2, 3].map(v => (
          <SeverityButton key={v} val={v} active={value === v} onPress={() => onChange(v)} />
        ))}
      </View>
    </View>
    {!isLast && <Divider />}
  </View>
);

const LOG_EMOJIS = {
  daily: '\uD83D\uDCCB',
  periodstart: '\uD83D\uDD34',
  periodend: '\uD83C\uDFC1',
  ovday: '\uD83E\uDD5A',
  spotting: '\uD83E\uDEE7',
  medlog: '\uD83D\uDC8A',
  clinic: '\uD83C\uDFE5',
};

/* ─── BBT Chart Component ─────────────────────────────── */

const BBT_DATA = [36.3,36.2,36.2,36.3,36.4,36.4,36.4,36.5,36.4,36.3,36.4,36.4,36.5,36.4,null,null,36.8,36.9,36.8,36.9,36.8,36.8,36.9,36.9,36.8,36.7,36.6,36.3];
const BBT_MIN = 36.0;
const BBT_MAX = 37.2;
const BBT_COVER = 36.5;
const BBT_CHART_H = vs(110);
const BBT_PAD_T = vs(14);
const BBT_PAD_B = vs(22);
const BBT_INNER_H = BBT_CHART_H - BBT_PAD_T - BBT_PAD_B;

const BBTChart = ({chartW}) => {
  const w = chartW || 300;
  const pts = BBT_DATA.map((v, i) => {
    if (v === null) return null;
    return {
      x: (i / 27) * w,
      y: BBT_PAD_T + BBT_INNER_H * (1 - (v - BBT_MIN) / (BBT_MAX - BBT_MIN)),
    };
  });
  const coverY = BBT_PAD_T + BBT_INNER_H * (1 - (BBT_COVER - BBT_MIN) / (BBT_MAX - BBT_MIN));
  const todayX = (13 / 27) * w;
  const ovX = (15 / 27) * w;
  const baseY = BBT_PAD_T + BBT_INNER_H;

  return (
    <View style={bbtSt.card}>
      <View style={bbtSt.hdr}>
        <Text style={bbtSt.hdrTitle}>BBT chart · Cycle 1–28</Text>
        <Text style={bbtSt.hdrSub}>Ovulation line visible</Text>
      </View>
      <View style={[bbtSt.chartArea, {width: w, height: BBT_CHART_H}]}>
        {/* Period shading (days 1-5) */}
        <View style={{position: 'absolute', left: 0, top: BBT_PAD_T, width: (5 / 28) * w, height: BBT_INNER_H, backgroundColor: 'rgba(194,24,91,0.06)'}} />

        {/* Cover line (36.5°C dashed) */}
        <View style={{position: 'absolute', left: 0, top: coverY, width: w, height: 1, borderTopWidth: 1.5, borderStyle: 'dashed', borderColor: 'rgba(107,18,55,0.3)'}} />
        <View style={{position: 'absolute', left: -ms(20), top: coverY - ms(5)}}>
          <Text style={{fontSize: ms(7), color: 'rgba(107,18,55,0.5)'}}>36.5</Text>
        </View>

        {/* Today vertical line */}
        <View style={{position: 'absolute', left: todayX, top: BBT_PAD_T - vs(10), width: 1.5, height: BBT_INNER_H + vs(10), backgroundColor: 'rgba(176,32,96,0.25)'}} />
        <View style={{position: 'absolute', left: todayX - ms(10), top: 0}}>
          <Text style={{fontSize: ms(7), color: 'rgba(176,32,96,0.5)'}}>Today</Text>
        </View>

        {/* OV vertical line */}
        <View style={{position: 'absolute', left: ovX, top: BBT_PAD_T - vs(10), width: 1.5, height: BBT_INNER_H + vs(10), backgroundColor: 'rgba(16,104,168,0.3)'}} />
        <View style={{position: 'absolute', left: ovX - ms(5), top: 0}}>
          <Text style={{fontSize: ms(7), color: 'rgba(16,104,168,0.5)'}}>OV</Text>
        </View>

        {/* BBT line segments */}
        {pts.map((pt, i) => {
          if (i === 0 || !pt) return null;
          const prev = pts[i - 1];
          if (!prev) return null;
          const dx = pt.x - prev.x;
          const dy = pt.y - prev.y;
          const len = Math.sqrt(dx * dx + dy * dy);
          const angle = Math.atan2(dy, dx) * (180 / Math.PI);
          return (
            <View key={`bl${i}`} style={{
              position: 'absolute', left: prev.x, top: prev.y - 1,
              width: len, height: 2, backgroundColor: '#c2185b',
              transform: [{rotate: `${angle}deg`}], transformOrigin: 'left center',
            }} />
          );
        })}

        {/* BBT dots */}
        {pts.map((pt, i) => {
          if (!pt) return null;
          const isToday = i === 13;
          const v = BBT_DATA[i];
          const dotColor = v >= BBT_COVER ? '#7b2fbe' : '#c2185b';
          const sz = isToday ? ms(9) : ms(5);
          return (
            <View key={`bd${i}`} style={{
              position: 'absolute', left: pt.x - sz / 2, top: pt.y - sz / 2,
              width: sz, height: sz, borderRadius: sz / 2,
              backgroundColor: dotColor, borderWidth: 1.5, borderColor: '#fff',
            }} />
          );
        })}

        {/* X-axis labels */}
        {[1, 7, 14, 21, 28].map(d => (
          <View key={d} style={{position: 'absolute', left: ((d - 1) / 27) * w - ms(5), bottom: vs(3)}}>
            <Text style={{fontSize: ms(7), color: '#bbb'}}>D{d}</Text>
          </View>
        ))}

        {/* Y-axis gridlines */}
        {[36.2, 36.4, 36.6, 36.8, 37.0].map(v => {
          const y = BBT_PAD_T + BBT_INNER_H * (1 - (v - BBT_MIN) / (BBT_MAX - BBT_MIN));
          return (
            <View key={v} style={{position: 'absolute', left: 0, top: y, width: w, height: 0.5, backgroundColor: 'rgba(0,0,0,0.04)'}} />
          );
        })}
      </View>

      {/* Legend */}
      <View style={bbtSt.legend}>
        <View style={bbtSt.legendItem}>
          <View style={{width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: '#c2185b'}} />
          <Text style={bbtSt.legendText}>BBT °C</Text>
        </View>
        <View style={bbtSt.legendItem}>
          <View style={{width: ms(14), height: 0, borderTopWidth: 2, borderStyle: 'dashed', borderColor: 'rgba(107,18,55,0.35)'}} />
          <Text style={bbtSt.legendText}>Cover line (36.5°C)</Text>
        </View>
        <View style={bbtSt.legendItem}>
          <View style={{width: ms(8), height: ms(8), borderRadius: ms(4), backgroundColor: '#1068a8'}} />
          <Text style={bbtSt.legendText}>Predicted ovulation</Text>
        </View>
      </View>
    </View>
  );
};

const bbtSt = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#e8c8d8',
    overflow: 'hidden',
    marginBottom: vs(10),
  },
  hdr: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: s(12),
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5e8f0',
  },
  hdrTitle: {fontSize: ms(12), fontWeight: '700', color: '#1a1a1a'},
  hdrSub: {fontSize: ms(10), color: '#888'},
  chartArea: {
    alignSelf: 'center',
    marginVertical: vs(4),
    overflow: 'visible',
  },
  legend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
    padding: s(10),
    paddingTop: vs(4),
    borderTopWidth: 0.5,
    borderTopColor: '#f5e8f0',
  },
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: s(4)},
  legendText: {fontSize: ms(9), color: '#555'},
});

/* ─── Main Component ───────────────────────────────────── */

const DailyLogTab = () => {
  // State
  const [logType, setLogType] = useState('daily');
  const [flowLevel, setFlowLevel] = useState(2);
  const [flowColor, setFlowColor] = useState('bright');
  const [clots, setClots] = useState('none');
  const [padCount, setPadCount] = useState('3-4');
  const [bbt, setBbt] = useState('36.4');
  const [cmType, setCmType] = useState('watery');
  const [ovResults, setOvResults] = useState({lh: null, progesterone: null, pregnancy: null});
  const [symptoms, setSymptoms] = useState({...SYMPTOM_DEFAULTS});
  const [moodIndex, setMoodIndex] = useState(2);
  const [energy, setEnergy] = useState('Mid');
  const [anxiety, setAnxiety] = useState(0);
  const [lowMood, setLowMood] = useState(0);
  const [libido, setLibido] = useState('Mid');
  const [pmsTags, setPmsTags] = useState([]);
  const [periodStatus, setPeriodStatus] = useState('noperiod');
  const [activeSymptoms, setActiveSymptoms] = useState(['fatigue']);
  const [activePains, setActivePains] = useState(['none']);
  const [crampLevel, setCrampLevel] = useState('0 None');
  const [quickMood, setQuickMood] = useState(2);
  const [activeMoodTags, setActiveMoodTags] = useState(['irritable']);
  const [sexActivity, setSexActivity] = useState('none');
  const [contraception, setContraception] = useState('none');
  const [contextTags, setContextTags] = useState(['workstress']);
  const [skinTags, setSkinTags] = useState(['nosigns']);
  const [notes, setNotes] = useState('');
  const [showNumpad, setShowNumpad] = useState(false);
  const [numpadVal, setNumpadVal] = useState('36.4');
  const {width: screenW} = useWindowDimensions();

  const bbtNum = parseFloat(bbt) || 36.4;
  const bbtColor = bbtNum < 36.5 ? '#c2185b' : '#7b2fbe';
  const bbtStatus = bbtNum < 36.4 ? 'Pre-ovulation (typical)' : bbtNum < 36.5 ? 'Pre-ovulation borderline' : bbtNum < 37 ? 'Post-ovulation rise detected' : 'Possible fever / illness';

  const openNumpad = () => { setNumpadVal(bbt); setShowNumpad(true); };
  const numpadPress = (d) => {
    setNumpadVal(prev => {
      if (d === '.' && prev.includes('.')) return prev;
      if (prev.replace('.', '').length >= 4) return prev;
      return prev + d;
    });
  };
  const numpadDel = () => setNumpadVal(prev => prev.slice(0, -1) || '');
  const numpadConfirm = () => {
    const v = parseFloat(numpadVal);
    if (!isNaN(v) && v >= 35 && v <= 38.5) {
      setBbt(v.toFixed(1));
      setShowNumpad(false);
    }
  };

  const togglePms = (tag) => {
    setPmsTags(prev => prev.includes(tag) ? prev.filter(t => t !== tag) : [...prev, tag]);
  };
  const toggleMulti = (arr, setArr, id) => {
    setArr(prev => prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id]);
  };

  const updateSymptom = (id, val) => {
    setSymptoms(prev => ({...prev, [id]: val}));
  };

  const setOvResult = (testId, result) => {
    setOvResults(prev => ({...prev, [testId]: result}));
  };

  /* ─── Render ─────────────────────────────────────────── */
  return (
    <ScrollView style={sty.container} showsVerticalScrollIndicator={false}>

      {/* ── 1. Cycle Calendar Strip ── */}
      <SectionLabel>CYCLE DAY CALENDAR</SectionLabel>
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={sty.calStrip}>
        {Array.from({length: 28}, (_, i) => {
          const dayNum = i + 1;
          const phase = getPhaseStyle(dayNum);
          const isToday = i === TODAY_INDEX;
          const dayLabel = DAY_LABELS[i % 7];
          return (
            <View key={i} style={sty.calDay}>
              <Text style={sty.calDayLabel}>{dayLabel}</Text>
              <View style={[
                sty.calCircle,
                {backgroundColor: phase.bg},
                isToday && {borderWidth: 2, borderColor: '#b02060'},
              ]}>
                <Text style={[sty.calNum, {color: phase.text}]}>{dayNum}</Text>
              </View>
              <View style={[sty.calDot, {backgroundColor: phase.bg === '#c2185b' ? '#c2185b' : phase.text}]} />
            </View>
          );
        })}
      </ScrollView>

      {/* ── 2. Cycle Stats Row ── */}
      <Card>
        <View style={sty.statsRow}>
          <View style={[sty.statCol, sty.statBorderR]}>
            <Text style={[sty.statVal, {color: '#c2185b'}]}>29</Text>
            <Text style={sty.statLbl}>Cycle length{'\n'}days avg</Text>
          </View>
          <View style={[sty.statCol, sty.statBorderR]}>
            <Text style={[sty.statVal, {color: '#888'}]}>5</Text>
            <Text style={sty.statLbl}>Period length{'\n'}days avg</Text>
          </View>
          <View style={[sty.statCol, sty.statBorderR]}>
            <Text style={[sty.statVal, {color: '#f57f17'}]}>14</Text>
            <Text style={sty.statLbl}>Cycle day{'\n'}today</Text>
          </View>
          <View style={sty.statCol}>
            <Text style={[sty.statVal, {color: '#1068a8'}]}>12</Text>
            <Text style={sty.statLbl}>Days to next{'\n'}period</Text>
          </View>
        </View>
      </Card>

      {/* ── 3. Today's Log Type ── */}
      <SectionLabel>TODAY'S LOG TYPE</SectionLabel>
      <View style={sty.chipRow}>
        {LOG_TYPE_OPTIONS.map(opt => (
          <Chip
            key={opt.id}
            label={`${LOG_EMOJIS[opt.id] || ''} ${opt.label}`}
            active={logType === opt.id}
            onPress={() => setLogType(opt.id)}
          />
        ))}
      </View>

      {/* ── 4. Menstrual Flow ── */}
      <SectionLabel>MENSTRUAL FLOW</SectionLabel>
      <Card>
        {/* Flow intensity */}
        <Text style={sty.cardSubHead}>Flow intensity</Text>
        <View style={sty.flowRow}>
          {FLOW_LEVELS.map(fl => {
            const active = flowLevel === fl.id;
            return (
              <TouchableOpacity
                key={fl.id}
                activeOpacity={0.7}
                style={[
                  sty.flowItem,
                  active && {backgroundColor: ROSE_BG, borderColor: ROSE_BORDER, borderWidth: 1, borderRadius: ms(10)},
                ]}
                onPress={() => setFlowLevel(fl.id)}>
                <View style={[
                  sty.teardrop,
                  {
                    width: ms(fl.w),
                    height: ms(fl.h),
                    borderRadius: ms(fl.w),
                    backgroundColor: '#f8bbd9',
                    opacity: fl.opacity,
                  },
                ]} />
                <Text style={[sty.flowLabel, active && {color: ROSE_TEXT, fontWeight: '700'}]}>{fl.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Divider />

        {/* Flow colour */}
        <Text style={sty.cardSubHead}>Flow colour</Text>
        <View style={sty.chipRow}>
          {FLOW_COLORS.map(fc => {
            const active = flowColor === fc.id;
            return (
              <TouchableOpacity
                key={fc.id}
                activeOpacity={0.7}
                style={[sty.colorChip, active && {backgroundColor: ROSE_BG, borderColor: ROSE_BORDER}]}
                onPress={() => setFlowColor(fc.id)}>
                <View style={[sty.colorDot, {backgroundColor: fc.color}]} />
                <Text style={[sty.colorChipText, active && {color: ROSE_TEXT, fontWeight: '700'}]}>{fc.label}</Text>
              </TouchableOpacity>
            );
          })}
        </View>

        <Divider />

        {/* Clots + Pads */}
        <View style={sty.bottomFlowRow}>
          <View style={{flex: 1}}>
            <Text style={sty.cardSubHead}>Clots</Text>
            <View style={sty.chipRow}>
              {['None', 'Small', 'Large'].map(c => (
                <Chip key={c} label={c} active={clots === c.toLowerCase()} onPress={() => setClots(c.toLowerCase())} />
              ))}
            </View>
          </View>
          <View style={{flex: 1, marginLeft: s(8)}}>
            <Text style={sty.cardSubHead}>Pads / tampons used</Text>
            <View style={sty.chipRow}>
              {['1-2', '3-4', '5-6', '7+'].map(p => (
                <Chip key={p} label={p} active={padCount === p} onPress={() => setPadCount(p)} />
              ))}
            </View>
          </View>
        </View>
      </Card>

      {/* ── 5. BBT (Basal Body Temperature) ── */}
      <SectionLabel>BASAL BODY TEMPERATURE (BBT)</SectionLabel>

      {/* BBT display card */}
      <View style={sty.bbtCard}>
        <TouchableOpacity style={sty.bbtLeft} activeOpacity={0.7} onPress={openNumpad}>
          <Text style={sty.bbtLabel}>BBT TODAY</Text>
          <Text style={[sty.bbtVal, {color: bbtColor}]}>{bbt}</Text>
          <Text style={sty.bbtSub}>°C · Before getting up · Tap to edit</Text>
        </TouchableOpacity>
        <View style={sty.bbtRight}>
          <Text style={sty.bbtInterpLabel}>INTERPRETATION</Text>
          <Text style={[sty.bbtInterp, {color: bbtNum < 36.5 ? '#f57f17' : '#7b2fbe'}]}>{bbtStatus}</Text>
          <Text style={sty.bbtDesc}>
            BBT typically 36.1–36.4°C before ovulation. A rise of 0.2–0.5°C sustained for 3 days confirms ovulation has occurred.
          </Text>
          <View style={sty.bbtTip}>
            <Text style={sty.bbtTipText}>
              📋 Measure immediately on waking, before moving or drinking
            </Text>
          </View>
        </View>
      </View>

      {/* BBT Chart · Cycle 1–28 */}
      <BBTChart chartW={screenW - s(13) * 2 - s(12) * 2} />

      {/* BBT Numpad Modal */}
      <Modal visible={showNumpad} transparent animationType="slide" onRequestClose={() => setShowNumpad(false)}>
        <TouchableOpacity style={sty.npOverlay} activeOpacity={1} onPress={() => setShowNumpad(false)}>
          <View style={sty.npSheet} onStartShouldSetResponder={() => true}>
            <View style={sty.npHandle} />
            <View style={sty.npHeader}>
              <Text style={sty.npTitle}>Basal body temperature</Text>
              <TouchableOpacity onPress={() => setShowNumpad(false)}>
                <Text style={sty.npClose}>✕</Text>
              </TouchableOpacity>
            </View>
            <Text style={sty.npDisplay}>{numpadVal || '0'}</Text>
            <Text style={sty.npHint}>BBT before getting up · Pre-ovulation: 36.1–36.4°C · Post-ovulation rise: +0.2–0.5°C</Text>
            <Text style={sty.npRange}>Range: 35.0–38.5°C</Text>
            <View style={sty.npGrid}>
              {['1','2','3','4','5','6','7','8','9','.','0','⌫'].map((k) => (
                <TouchableOpacity
                  key={k}
                  style={[sty.npBtn, k === '⌫' && sty.npBtnDel]}
                  activeOpacity={0.6}
                  onPress={() => k === '⌫' ? numpadDel() : numpadPress(k)}>
                  <Text style={[sty.npBtnText, k === '⌫' && {color: '#888', fontSize: ms(16)}]}>{k}</Text>
                </TouchableOpacity>
              ))}
            </View>
            <TouchableOpacity style={sty.npOkBtn} activeOpacity={0.8} onPress={numpadConfirm}>
              <Text style={sty.npOkText}>✓ OK</Text>
            </TouchableOpacity>
          </View>
        </TouchableOpacity>
      </Modal>

      {/* ── 6. Cervical Mucus ── */}
      <SectionLabel>CERVICAL MUCUS</SectionLabel>
      <Card>
        <View style={sty.cmGrid}>
          {CM_DETAILED.map(cm => {
            const active = cmType === cm.id;
            return (
              <TouchableOpacity
                key={cm.id}
                activeOpacity={0.7}
                style={[sty.cmItem, active && sty.cmItemActive]}
                onPress={() => setCmType(cm.id)}>
                <Text style={sty.cmIco}>{cm.ico}</Text>
                <Text style={[sty.cmName, active && {color: ROSE_TEXT}]}>{cm.name}</Text>
                <Text style={sty.cmSub}>{cm.sub}</Text>
              </TouchableOpacity>
            );
          })}
        </View>
        <View style={sty.cmInfoBar}>
          <Text style={sty.cmInfoText}>
            💧 Watery or egg-white mucus indicates your most fertile days. Track consistency daily for pattern recognition.
          </Text>
        </View>
      </Card>

      {/* ── 7. Ovulation & Hormone Tests ── */}
      <SectionLabel>OVULATION & HORMONE TESTS</SectionLabel>
      <Card>
        {OV_TESTS.map((test, idx) => (
          <View key={test.id}>
            <View style={sty.ovRow}>
              <View style={sty.ovLeft}>
                <Text style={sty.ovIco}>{test.ico}</Text>
                <View style={{flex: 1}}>
                  <Text style={sty.ovName}>{test.name}</Text>
                  <Text style={sty.ovSub}>{test.sub}</Text>
                </View>
              </View>
              <View style={sty.ovRight}>
                {test.value ? (
                  <View style={sty.ovValueBadge}>
                    <Text style={sty.ovValueText}>{test.value}</Text>
                  </View>
                ) : (
                  <View style={sty.ovBtnRow}>
                    {test.results.map(r => {
                      const active = ovResults[test.id] === r;
                      const isPeak = r === 'Peak';
                      const isHigh = r === 'High';
                      return (
                        <TouchableOpacity
                          key={r}
                          activeOpacity={0.7}
                          style={[
                            sty.ovBtn,
                            active && isPeak && {backgroundColor: '#c2185b', borderColor: '#c2185b'},
                            active && isHigh && {backgroundColor: '#FFF7EE', borderColor: '#f57f17'},
                            active && !isPeak && !isHigh && {backgroundColor: ROSE_BG, borderColor: ROSE_BORDER},
                          ]}
                          onPress={() => setOvResult(test.id, r)}>
                          <Text style={[
                            sty.ovBtnText,
                            active && isPeak && {color: '#fff', fontWeight: '700'},
                            active && !isPeak && {color: ROSE_TEXT, fontWeight: '700'},
                          ]}>{r}</Text>
                        </TouchableOpacity>
                      );
                    })}
                  </View>
                )}
              </View>
            </View>
            {idx < OV_TESTS.length - 1 && <Divider />}
          </View>
        ))}
      </Card>

      {/* ── 8. Physical Symptoms Today ── */}
      <SectionLabel>PHYSICAL SYMPTOMS TODAY</SectionLabel>
      <Text style={sty.sevLegend}>0=None · 1=Mild · 2=Moderate · 3=Severe</Text>
      <Card>
        {SYMPTOM_SCALES.map((item, idx) => (
          <SymptomRow
            key={item.id}
            item={item}
            value={symptoms[item.id]}
            onChange={(v) => updateSymptom(item.id, v)}
            isLast={idx === SYMPTOM_SCALES.length - 1}
          />
        ))}
      </Card>

      {/* ── 9. Mood & Energy ── */}
      <SectionLabel>MOOD & ENERGY</SectionLabel>
      <Card>
        {/* Mood emoji row */}
        <Text style={sty.cardSubHead}>Overall mood</Text>
        <View style={sty.moodEmojiRow}>
          {['\uD83D\uDE2D', '\uD83D\uDE1E', '\uD83D\uDE10', '\uD83D\uDE0A', '\uD83D\uDE04'].map((emoji, i) => (
            <TouchableOpacity
              key={i}
              activeOpacity={0.7}
              style={[sty.moodCircle, moodIndex === i && sty.moodCircleActive]}
              onPress={() => setMoodIndex(i)}>
              <Text style={sty.moodEmoji}>{emoji}</Text>
            </TouchableOpacity>
          ))}
        </View>

        <Divider />

        {/* Energy level */}
        <View style={sty.moodRow}>
          <View style={sty.moodLabelCol}>
            <Text style={sty.moodIco}>⚡</Text>
            <Text style={sty.moodLabel}>Energy level</Text>
          </View>
          <View style={sty.moodBtnRow}>
            {['Low', 'Mid', 'Good', 'High'].map(opt => (
              <TouchableOpacity
                key={opt}
                activeOpacity={0.7}
                style={[sty.moodBtn, energy === opt && {backgroundColor: ROSE_BG, borderColor: ROSE_BORDER}]}
                onPress={() => setEnergy(opt)}>
                <Text style={[sty.moodBtnText, energy === opt && {color: ROSE_TEXT, fontWeight: '700'}]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        <Divider />

        {/* Anxiety / irritability */}
        <View style={sty.moodRow}>
          <View style={sty.moodLabelCol}>
            <Text style={sty.moodIco}>😰</Text>
            <Text style={sty.moodLabel}>Anxiety / irritability</Text>
          </View>
          <View style={sty.sevRow}>
            {[0, 1, 2, 3].map(v => (
              <SeverityButton key={v} val={v} active={anxiety === v} onPress={() => setAnxiety(v)} />
            ))}
          </View>
        </View>

        <Divider />

        {/* Low mood / tearfulness */}
        <View style={sty.moodRow}>
          <View style={sty.moodLabelCol}>
            <Text style={sty.moodIco}>😢</Text>
            <View>
              <Text style={sty.moodLabel}>Low mood / tearfulness</Text>
              <Text style={sty.moodSubLabel}>PMDD screening</Text>
            </View>
          </View>
          <View style={sty.sevRow}>
            {[0, 1, 2, 3].map(v => (
              <SeverityButton key={v} val={v} active={lowMood === v} onPress={() => setLowMood(v)} />
            ))}
          </View>
        </View>

        <Divider />

        {/* Libido */}
        <View style={sty.moodRow}>
          <View style={sty.moodLabelCol}>
            <Text style={sty.moodIco}>💕</Text>
            <Text style={sty.moodLabel}>Libido</Text>
          </View>
          <View style={sty.moodBtnRow}>
            {['Low', 'Mid', 'High'].map(opt => (
              <TouchableOpacity
                key={opt}
                activeOpacity={0.7}
                style={[sty.moodBtn, libido === opt && {backgroundColor: ROSE_BG, borderColor: ROSE_BORDER}]}
                onPress={() => setLibido(opt)}>
                <Text style={[sty.moodBtnText, libido === opt && {color: ROSE_TEXT, fontWeight: '700'}]}>{opt}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </Card>

      {/* ── 10g. Sexual Activity ── */}
      <SectionLabel>SEXUAL ACTIVITY</SectionLabel>
      <View style={sty.tagWrap}>
        {SEX_OPTIONS.map(opt => (
          <Chip key={opt.id} label={opt.label} active={sexActivity === opt.id} onPress={() => setSexActivity(opt.id)} />
        ))}
      </View>

      {/* ── 10i. Context Tags ── */}
      <SectionLabel>WHAT'S AFFECTING YOU TODAY?</SectionLabel>
      <View style={sty.tagWrap}>
        {CONTEXT_TAGS.map(tag => (
          <Tag key={tag.id} label={tag.label} active={contextTags.includes(tag.id)} onPress={() => toggleMulti(contextTags, setContextTags, tag.id)} />
        ))}
      </View>

      {/* ── 10j. Skin & Hair ── */}
      <SectionLabel>SKIN, HAIR & HORMONAL SIGNS</SectionLabel>
      <View style={sty.tagWrap}>
        {SKIN_HAIR_TAGS.map(tag => {
          const active = skinTags.includes(tag.id);
          const isGreen = tag.id === 'nosigns';
          return (
            <Tag
              key={tag.id}
              label={tag.label}
              active={active}
              green={isGreen && active}
              onPress={() => toggleMulti(skinTags, setSkinTags, tag.id)}
            />
          );
        })}
      </View>





      {/* ── 17. Note ── */}
      <SectionLabel>NOTE</SectionLabel>
      <Card>
        <TextInput
          style={sty.noteInput}
          multiline
          placeholder="Add notes about today... e.g., 'Cramps worse after lunch', 'Took ibuprofen 400mg at 2pm', 'Spotting started in evening', 'Mood improved after walk'"
          placeholderTextColor="#aaa"
          value={notes}
          onChangeText={setNotes}
          textAlignVertical="top"
        />
      </Card>

      {/* Bottom spacer */}
      <View style={{height: vs(100)}} />
    </ScrollView>
  );
};

/* ─── Styles ───────────────────────────────────────────── */

const sty = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: s(16),
  },

  /* Section label */
  sectionLabel: {
    marginTop: vs(16),
    marginBottom: vs(8),
  },

  /* Card */
  card: {
    backgroundColor: '#fff',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#e8c8d8',
    overflow: 'hidden',
    marginBottom: vs(10),
    padding: ms(12),
  },

  /* Chip */
  chip: {
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    marginRight: s(6),
    marginBottom: vs(6),
  },
  chipActive: {
    backgroundColor: ROSE_DARK,
    borderColor: ROSE_DARK,
  },
  chipText: {
    fontSize: ms(11),
    color: '#555',
  },
  chipTextActive: {
    color: '#fff',
    fontWeight: '700',
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },

  /* Tag */
  tag: {
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    marginRight: s(6),
    marginBottom: vs(6),
  },
  tagActive: {
    backgroundColor: ROSE_BG,
    borderColor: ROSE_BORDER,
  },
  tagActiveGreen: {
    backgroundColor: '#EEF8F3',
    borderColor: '#9FE1CB',
  },
  tagText: {
    fontSize: ms(11),
    color: '#555',
  },
  tagTextActive: {
    color: ROSE_TEXT,
    fontWeight: '700',
  },
  tagTextActiveGreen: {
    color: '#085041',
    fontWeight: '700',
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: vs(6),
  },

  divider: {
    height: 0.5,
    backgroundColor: '#eee',
    marginVertical: vs(8),
  },

  /* ── 1. Calendar Strip ── */
  calStrip: {
    marginBottom: vs(10),
  },
  calDay: {
    alignItems: 'center',
    marginRight: s(6),
    width: ms(42),
  },
  calDayLabel: {
    fontSize: ms(9),
    color: '#888',
    marginBottom: vs(3),
  },
  calCircle: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(17),
    alignItems: 'center',
    justifyContent: 'center',
  },
  calNum: {
    fontSize: ms(12),
    fontWeight: '700',
  },
  calDot: {
    width: ms(5),
    height: ms(5),
    borderRadius: ms(3),
    marginTop: vs(3),
  },

  /* ── 2. Stats Row ── */
  statsRow: {
    flexDirection: 'row',
    paddingVertical: vs(4),
  },
  statCol: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(4),
  },
  statBorderR: {
    borderRightWidth: 0.5,
    borderRightColor: '#e8c8d8',
  },
  statVal: {
    fontSize: ms(20),
    fontWeight: '800',
  },
  statLbl: {
    fontSize: ms(9),
    color: '#888',
    textAlign: 'center',
    marginTop: vs(2),
    lineHeight: ms(13),
  },

  /* ── Card sub head ── */
  cardSubHead: {
    fontSize: ms(10),
    fontWeight: '700',
    color: '#666',
    marginBottom: vs(6),
    marginTop: vs(2),
  },

  /* ── 4. Flow ── */
  flowRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: vs(8),
  },
  flowItem: {
    alignItems: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: s(6),
    minWidth: ms(50),
  },
  teardrop: {
    marginBottom: vs(6),
  },
  flowLabel: {
    fontSize: ms(9),
    color: '#888',
    textAlign: 'center',
  },

  colorChip: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    borderRadius: ms(16),
    borderWidth: 1,
    borderColor: '#ddd',
    backgroundColor: '#fafafa',
    marginRight: s(6),
    marginBottom: vs(6),
  },
  colorDot: {
    width: ms(12),
    height: ms(12),
    borderRadius: ms(6),
    marginRight: s(5),
  },
  colorChipText: {
    fontSize: ms(10),
    color: '#555',
  },

  bottomFlowRow: {
    flexDirection: 'row',
  },

  /* ── 5. BBT ── */
  bbtCard: {
    backgroundColor: '#fff',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#e8c8d8',
    padding: s(14),
    marginBottom: vs(10),
    flexDirection: 'row',
    gap: s(12),
  },
  bbtLeft: {
    alignItems: 'center',
    justifyContent: 'center',
    minWidth: s(90),
  },
  bbtLabel: {
    fontSize: ms(9),
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#888',
    marginBottom: vs(5),
  },
  bbtVal: {
    fontSize: ms(48),
    fontWeight: '700',
    lineHeight: ms(50),
  },
  bbtSub: {
    fontSize: ms(10),
    color: '#aaa',
    marginTop: vs(3),
  },
  bbtRight: {
    flex: 1,
  },
  bbtInterpLabel: {
    fontSize: ms(9),
    fontWeight: '700',
    letterSpacing: 0.6,
    color: '#888',
    marginBottom: vs(5),
  },
  bbtInterp: {
    fontSize: ms(12),
    fontWeight: '700',
    marginBottom: vs(4),
  },
  bbtDesc: {
    fontSize: ms(10),
    color: '#888',
    lineHeight: ms(16),
    marginBottom: vs(7),
  },
  bbtTip: {
    backgroundColor: '#f5ede0',
    borderRadius: ms(8),
    padding: ms(8),
  },
  bbtTipText: {
    fontSize: ms(9),
    color: '#7a3500',
    fontWeight: '600',
    lineHeight: ms(14),
  },

  /* ── Numpad ── */
  npOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.55)',
    justifyContent: 'flex-end',
  },
  npSheet: {
    backgroundColor: '#fff',
    borderTopLeftRadius: ms(22),
    borderTopRightRadius: ms(22),
    paddingBottom: vs(28),
  },
  npHandle: {
    width: ms(36),
    height: ms(4),
    backgroundColor: '#ddd',
    borderRadius: ms(2),
    alignSelf: 'center',
    marginTop: vs(10),
    marginBottom: vs(8),
  },
  npHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(20),
    paddingBottom: vs(12),
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  npTitle: {
    fontSize: ms(13),
    fontWeight: '700',
    color: '#1a1a1a',
  },
  npClose: {
    fontSize: ms(20),
    color: '#888',
  },
  npDisplay: {
    fontSize: ms(52),
    fontWeight: '700',
    textAlign: 'center',
    color: '#b02060',
    paddingVertical: vs(12),
    letterSpacing: 3,
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0f0f0',
  },
  npHint: {
    fontSize: ms(10),
    color: '#888',
    textAlign: 'center',
    paddingTop: vs(6),
    paddingHorizontal: s(20),
  },
  npRange: {
    fontSize: ms(9),
    color: '#aaa',
    textAlign: 'center',
    paddingBottom: vs(8),
    borderBottomWidth: 0.5,
    borderBottomColor: '#f5f5f5',
  },
  npGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: s(16),
    paddingTop: vs(8),
  },
  npBtn: {
    width: '33.33%',
    paddingVertical: vs(15),
    alignItems: 'center',
    justifyContent: 'center',
  },
  npBtnDel: {},
  npBtnText: {
    fontSize: ms(22),
    fontWeight: '500',
    color: '#1a1a1a',
  },
  npOkBtn: {
    backgroundColor: '#b02060',
    borderRadius: ms(13),
    marginHorizontal: s(16),
    marginTop: vs(8),
    paddingVertical: vs(14),
    alignItems: 'center',
  },
  npOkText: {
    fontSize: ms(15),
    fontWeight: '700',
    color: '#fff',
  },

  /* ── 6. Cervical Mucus ── */
  cmGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  cmItem: {
    width: '25%',
    alignItems: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: s(4),
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: 'transparent',
  },
  cmItemActive: {
    backgroundColor: ROSE_BG,
    borderColor: ROSE_BORDER,
  },
  cmIco: {
    fontSize: ms(18),
    marginBottom: vs(3),
  },
  cmName: {
    fontSize: ms(10),
    fontWeight: '700',
    color: '#333',
    textAlign: 'center',
  },
  cmSub: {
    fontSize: ms(8),
    color: '#888',
    textAlign: 'center',
    marginTop: vs(1),
  },
  cmInfoBar: {
    backgroundColor: ROSE_BG,
    borderRadius: ms(8),
    padding: ms(8),
    marginTop: vs(8),
  },
  cmInfoText: {
    fontSize: ms(9),
    color: ROSE_TEXT,
    lineHeight: ms(14),
  },

  /* ── 7. Ovulation Tests ── */
  ovRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(6),
  },
  ovLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  ovIco: {
    fontSize: ms(18),
    marginRight: s(8),
  },
  ovName: {
    fontSize: ms(11),
    fontWeight: '700',
    color: '#333',
  },
  ovSub: {
    fontSize: ms(9),
    color: '#888',
    marginTop: vs(1),
  },
  ovRight: {
    marginLeft: s(8),
  },
  ovBtnRow: {
    flexDirection: 'row',
  },
  ovBtn: {
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: s(4),
  },
  ovBtnText: {
    fontSize: ms(9),
    color: '#888',
  },
  ovValueBadge: {
    backgroundColor: ROSE_BG,
    borderRadius: ms(10),
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
  },
  ovValueText: {
    fontSize: ms(10),
    fontWeight: '700',
    color: '#c2185b',
  },

  /* ── 8. Symptoms ── */
  sevLegend: {
    fontSize: ms(9),
    color: '#888',
    marginBottom: vs(6),
    marginTop: vs(-4),
  },
  symptomRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(6),
  },
  symptomLeft: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  symptomIco: {
    fontSize: ms(16),
    marginRight: s(8),
  },
  symptomName: {
    fontSize: ms(11),
    fontWeight: '700',
    color: '#333',
  },
  symptomSub: {
    fontSize: ms(9),
    color: '#888',
    marginTop: vs(1),
  },
  sevRow: {
    flexDirection: 'row',
  },
  sevBtn: {
    width: ms(28),
    height: ms(28),
    borderRadius: ms(14),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: s(4),
    backgroundColor: '#fafafa',
  },
  sevBtnText: {
    fontSize: ms(10),
    color: '#888',
  },

  /* ── 9. Mood ── */
  moodEmojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingVertical: vs(8),
  },
  moodCircle: {
    width: ms(44),
    height: ms(44),
    borderRadius: ms(22),
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1.5,
    borderColor: '#eee',
  },
  moodCircleActive: {
    borderColor: '#c2185b',
    backgroundColor: ROSE_BG,
  },
  moodEmoji: {
    fontSize: ms(22),
  },
  moodRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(6),
  },
  moodLabelCol: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
  },
  moodIco: {
    fontSize: ms(16),
    marginRight: s(8),
  },
  moodLabel: {
    fontSize: ms(11),
    fontWeight: '700',
    color: '#333',
  },
  moodSubLabel: {
    fontSize: ms(8),
    color: '#c2185b',
    fontStyle: 'italic',
    marginTop: vs(1),
  },
  moodBtnRow: {
    flexDirection: 'row',
  },
  moodBtn: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: '#ddd',
    marginLeft: s(4),
  },
  moodBtnText: {
    fontSize: ms(10),
    color: '#888',
  },

  /* ── 11. PCOS ── */
  pcosCard: {
    padding: 0,
  },
  pcosHeader: {
    backgroundColor: ROSE_BG,
    paddingHorizontal: ms(12),
    paddingVertical: vs(10),
  },
  pcosHeaderText: {
    fontSize: ms(13),
    fontWeight: '800',
    color: ROSE_TEXT,
  },
  pcosHeaderSub: {
    fontSize: ms(9),
    color: '#c2185b',
    marginTop: vs(2),
  },
  pcosRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: ms(12),
    paddingVertical: vs(8),
  },
  pcosIco: {
    fontSize: ms(16),
    marginRight: s(8),
    marginTop: vs(2),
  },
  pcosLabel: {
    fontSize: ms(11),
    fontWeight: '700',
    color: '#333',
  },
  pcosDetail: {
    fontSize: ms(9),
    color: '#666',
    marginTop: vs(2),
    lineHeight: ms(14),
  },
  pcosBadge: {
    backgroundColor: ROSE_BG,
    borderRadius: ms(8),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    marginLeft: s(8),
  },
  pcosBadgeText: {
    fontSize: ms(9),
    fontWeight: '700',
    color: '#c2185b',
  },
  pcosAssess: {
    backgroundColor: '#fff3e0',
    paddingHorizontal: ms(12),
    paddingVertical: vs(8),
  },
  pcosAssessText: {
    fontSize: ms(10),
    color: '#854F0B',
    lineHeight: ms(15),
  },

  /* ── 12. Amber Insight ── */
  insightAmber: {
    backgroundColor: '#FFF7EE',
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: '#f5d6a0',
    padding: ms(12),
    marginBottom: vs(10),
  },
  insightAmberText: {
    fontSize: ms(10),
    color: '#854F0B',
    lineHeight: ms(16),
  },

  /* ── 13/14. Medication / Condition Rows ── */
  medRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  medIcoBox: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  medIco: {
    fontSize: ms(16),
  },
  medTitle: {
    fontSize: ms(11),
    fontWeight: '700',
    color: '#333',
  },
  medBody: {
    fontSize: ms(9),
    color: '#666',
    marginTop: vs(2),
    lineHeight: ms(14),
  },
  medBadge: {
    borderRadius: ms(8),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    marginLeft: s(8),
  },
  medBadgeText: {
    fontSize: ms(9),
    fontWeight: '700',
  },

  /* ── 15. Table ── */
  tableHeader: {
    flexDirection: 'row',
    paddingVertical: vs(6),
    borderBottomWidth: 1,
    borderBottomColor: '#e8c8d8',
  },
  tableHCell: {
    fontSize: ms(9),
    fontWeight: '700',
    color: '#888',
    textTransform: 'uppercase',
  },
  tableRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(7),
    borderBottomWidth: 0.5,
    borderBottomColor: '#f0e0e8',
  },
  tableCellText: {
    fontSize: ms(10),
    color: '#333',
  },
  latestDot: {
    width: ms(6),
    height: ms(6),
    borderRadius: ms(3),
    backgroundColor: '#c2185b',
    marginLeft: s(4),
  },
  tableSummary: {
    paddingTop: vs(8),
  },
  tableSummaryText: {
    fontSize: ms(9),
    color: '#888',
    lineHeight: ms(14),
  },

  /* ── 16. Rose Insight ── */
  insightRose: {
    backgroundColor: ROSE_BG,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: ROSE_BORDER,
    padding: ms(12),
    marginBottom: vs(10),
  },
  insightRoseTitle: {
    fontSize: ms(12),
    fontWeight: '800',
    color: ROSE_TEXT,
    marginBottom: vs(6),
  },
  insightRoseText: {
    fontSize: ms(10),
    color: ROSE_TEXT,
    lineHeight: ms(16),
  },

  /* ── 17. Note ── */
  noteInput: {
    minHeight: vs(80),
    fontSize: ms(12),
    color: '#333',
    padding: 0,
    lineHeight: ms(18),
  },

  /* ── Symptom Grid (from old LogTab) ── */
  symGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(7),
    marginBottom: vs(10),
  },
  symBox: {
    width: '31%',
    backgroundColor: '#fff',
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: '#e8c8d8',
    padding: s(10),
    alignItems: 'center',
  },
  symBoxActive: {
    backgroundColor: ROSE_BG,
    borderColor: ROSE_BORDER,
  },
  symIco: {
    fontSize: ms(20),
    marginBottom: vs(4),
  },
  symName: {
    fontSize: ms(10),
    fontWeight: '600',
    color: '#1a1a1a',
    textAlign: 'center',
  },

  /* ── Cramp Row ── */
  crampRow: {
    flexDirection: 'row',
    gap: s(5),
    marginBottom: vs(10),
  },
  crampBtn: {
    flex: 1,
    height: vs(28),
    borderRadius: ms(8),
    borderWidth: 0.5,
    borderColor: '#e8c8d8',
    backgroundColor: '#fdf5f9',
    alignItems: 'center',
    justifyContent: 'center',
  },
  crampBtnActive: {
    backgroundColor: PINK,
    borderColor: PINK,
  },
  crampBtnText: {
    fontSize: ms(10),
    fontWeight: '700',
    color: '#888',
  },

  /* ── Mood Emoji Row ── */
  moodEmojiRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(10),
  },
  moodEmojiBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(8),
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: 'transparent',
    marginHorizontal: s(2),
  },
  moodEmojiBtnActive: {
    backgroundColor: '#f0e8ff',
    borderColor: '#c4a8e8',
  },
  moodEmojiText: {
    fontSize: ms(24),
  },

  /* ── Amber Insight (medication) ── */
  insightAmber: {
    backgroundColor: '#FFF7EE',
    borderRadius: ms(11),
    padding: s(12),
    marginBottom: vs(10),
  },
  insightAmberText: {
    fontSize: ms(11),
    color: '#5C3300',
    lineHeight: ms(18),
  },
});

export default DailyLogTab;
