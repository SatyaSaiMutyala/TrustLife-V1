import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../../constants/colors';
import AppText from '../../../../components/shared/AppText';
import Icon from '../../../../components/shared/Icons';

// ──────────────────────────────────────────────
// Data
// ──────────────────────────────────────────────

const TABS = ['Teeth map', 'Brushing', 'Visits', 'Ayu'];

// Upper row: L, C, K, M1, M2, M2(faded), M1, K, C, L
const UPPER_TEETH = [
  {label: 'L', state: 'erupted'},
  {label: 'C', state: 'erupted'},
  {label: 'K', state: 'erupting'},
  {label: 'M1', state: 'not'},
  {label: 'M2', state: 'not'},
  {label: 'M2', state: 'faded'},
  {label: 'M1', state: 'not'},
  {label: 'K', state: 'not'},
  {label: 'C', state: 'erupted'},
  {label: 'L', state: 'erupted'},
];

const LOWER_TEETH = [
  {label: 'L', state: 'erupted'},
  {label: 'C', state: 'erupted'},
  {label: 'K', state: 'not'},
  {label: 'M1', state: 'not'},
  {label: 'M2', state: 'not'},
  {label: 'M2', state: 'faded'},
  {label: 'M1', state: 'not'},
  {label: 'K', state: 'not'},
  {label: 'C', state: 'erupted'},
  {label: 'L', state: 'erupted'},
];

const ERUPT_ROWS = [
  {
    name: 'Lower central incisors (\u00d72)',
    range: 'Expected: 6-10 months \u00b7 First teeth to erupt',
    date: '7m \u2713',
    color: '#16A34A',
  },
  {
    name: 'Upper central incisors (\u00d72)',
    range: 'Expected: 8-12 months',
    date: '10m \u2713',
    color: '#16A34A',
  },
  {
    name: 'Lateral incisors (\u00d74)',
    range: 'Expected: 9-16 months',
    date: '16m \u2713',
    color: '#16A34A',
  },
  {
    name: 'Upper canines (\u00d72) - currently erupting',
    range: 'Expected: 16-22 months \u00b7 May cause drooling, fussiness',
    date: '~19m',
    color: '#D97316',
  },
  {
    name: 'First molars (\u00d74)',
    range: 'Expected: 13-19 months',
    date: 'Pending',
    color: '#9CA3AF',
  },
  {
    name: 'Lower canines (\u00d72)',
    range: 'Expected: 17-23 months',
    date: 'Pending',
    color: '#9CA3AF',
  },
  {
    name: 'Second molars (\u00d74)',
    range: 'Expected: 23-31 months \u00b7 Complete primary set',
    date: 'Pending',
    color: '#9CA3AF',
  },
];

const G = '#16A34A'; // green
const X = '#D1D5DB'; // gray (missed)

const BRUSH_WEEKS = [
  {wk: 'Wk 1', days: [G, G, X, G, G, G, X]},
  {wk: 'Wk 2', days: [G, X, G, G, G, G, G]},
  {wk: 'Wk 3', days: [G, G, G, X, G, G, G]},
  {wk: 'Wk 4', days: [G, G, X, G, G, X, X]},
];

const FLUORIDE_FLAGS = [
  {
    icon: 'water-outline',
    title: 'Age 0-2: smear of fluoride toothpaste',
    subTitleTail: ' (size of a grain of rice, 1000ppm)',
    body: 'Start brushing at first tooth eruption. Parent brushes for child until age 7-8.',
  },
  {
    icon: 'water-outline',
    title: 'Age 3-6: pea-sized amount of fluoride toothpaste (1000ppm)',
    body: 'Supervise all brushing until age 7. No fluoride toothpaste swallowing.',
  },
  {
    icon: 'alert-circle-outline',
    title: 'Fluoride supplements: only if Hyderabad water supply is below 0.3 ppm fluoride',
    body: 'Check HMWSSB water quality report. Most urban Hyderabad water has adequate fluoride - supplements may cause fluorosis.',
  },
  {
    icon: 'close-circle-outline',
    title: 'Avoid sugary drinks, including fruit juices, after brushing at night',
    body: 'Even 100% fruit juice causes dental caries when left on teeth overnight. Water is the only safe bedtime drink.',
  },
];

const UPCOMING_MILESTONES = [
  {
    amber: true,
    title: 'First dental visit due: Baby Zara \u00b7 within 2 months',
    body: 'Zara now has 4 teeth erupted. First paediatric dental visit is due by 12 months. Dr. Rekha Rao (KIMS paediatric dentistry) or Apollo Children\u2019s Dental Clinic.',
  },
  {
    amber: false,
    title: 'Aarav: 6-month check due October 2026',
    body: 'Last visit: Apr 2026. Orthodontic screening recommended at this visit - identify any crowding before full permanent dentition arrives.',
  },
];

const VISIT_HISTORY = [
  {date: 'Apr 25', type: 'Routine check', finding: 'Normal', findColor: '#16A34A', action: 'Fluoride varnish'},
  {date: 'Oct 24', type: 'Routine check', finding: '1 early cavity', findColor: '#D97316', action: 'Composite filling'},
  {date: 'Apr 24', type: 'Routine check', finding: 'Normal', findColor: '#16A34A', action: 'Scale & polish'},
  {date: 'Oct 23', type: 'Pain complaint', finding: 'Tooth pain', findColor: '#DC2626', action: 'Root canal - primary molar'},
];

const AYU_INSIGHTS = [
  {
    color: '#D97316',
    title: 'Frequency of sugar exposure matters more than total amount.',
    body: ' Sipping sweet drinks (even juice) throughout the day feeds the Streptococcus mutans bacteria that produce cavity-causing acid for 20 minutes after each sugar exposure. Switching to 3 set snack times prevents this repeated acid cycle.',
  },
  {
    color: '#D97316',
    title: 'Maternal T2DM slightly increases child cavity risk',
    body: ' through microbiome inheritance and dietary patterns in the household. Reducing refined sugar in family meals benefits both Priya\u2019s metabolic health and Aarav\u2019s dental health simultaneously.',
  },
  {
    color: '#16A34A',
    title: 'Fluoride varnish application (April 2025) is excellent preventive care.',
    body: ' Professional fluoride varnish reduces cavity risk by 33% in children with moderate-high caries risk. Continue 6-monthly application alongside routine check-ups.',
  },
  {
    color: '#2A5FA0',
    title: 'Orthodontic screening at age 9 is now due.',
    body: ' A paediatric orthodontist can detect: crowding (requiring extractions before permanent teeth arrive), crossbite (treatable with simple appliances at this age vs surgery later), and spacing issues. This is a one-time assessment - not automatic braces.',
  },
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

const Tooth = ({label, state}) => {
  let bg = 'rgba(255,255,255,0.12)';
  let color = 'rgba(255,255,255,0.55)';
  if (state === 'erupted') {
    bg = Colors.white;
    color = Colors.primary;
  } else if (state === 'erupting') {
    bg = '#F59E0B';
    color = Colors.white;
  } else if (state === 'faded') {
    bg = 'rgba(255,255,255,0.06)';
    color = 'rgba(255,255,255,0.3)';
  }
  return (
    <TouchableOpacity
      style={[st.tooth, {backgroundColor: bg}]}
      onPress={() => {}}
      activeOpacity={0.7}>
      <AppText variant="subtext" color={color} style={{fontSize: ms(8), fontWeight: '700'}}>{label}</AppText>
    </TouchableOpacity>
  );
};

// ──────────────────────────────────────────────
// Tabs
// ──────────────────────────────────────────────

const TeethMapTab = () => (
  <View>
    {/* Mouth wrap card */}
    <View style={st.mouthCard}>
      <AppText variant="subtext" color="rgba(255,255,255,0.65)" style={st.mouthSub}>Upper (maxillary)</AppText>
      <View style={st.toothRow}>
        {UPPER_TEETH.map((t, i) => <Tooth key={`u${i}`} label={t.label} state={t.state} />)}
      </View>
      <View style={st.mouthDivider} />
      <View style={st.toothRow}>
        {LOWER_TEETH.map((t, i) => <Tooth key={`l${i}`} label={t.label} state={t.state} />)}
      </View>
      <AppText variant="subtext" color="rgba(255,255,255,0.65)" style={[st.mouthSub, {marginTop: vs(8)}]}>Lower (mandibular)</AppText>

      <View style={st.legendRow}>
        <View style={st.legendItem}>
          <View style={[st.legendDot, {backgroundColor: Colors.white}]} />
          <AppText variant="subtext" color="rgba(255,255,255,0.8)" style={{fontSize: ms(9)}}>Erupted (4)</AppText>
        </View>
        <View style={st.legendItem}>
          <View style={[st.legendDot, {backgroundColor: '#F59E0B'}]} />
          <AppText variant="subtext" color="rgba(255,255,255,0.8)" style={{fontSize: ms(9)}}>Erupting (1)</AppText>
        </View>
        <View style={st.legendItem}>
          <View style={[st.legendDot, {backgroundColor: 'rgba(255,255,255,0.25)'}]} />
          <AppText variant="subtext" color="rgba(255,255,255,0.8)" style={{fontSize: ms(9)}}>Not yet (15)</AppText>
        </View>
      </View>
    </View>

    <Section title="Eruption timeline \u00b7 Baby Zara \u00b7 44 days" />
    <View style={st.card}>
      <View style={{marginBottom: vs(8)}}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>Primary (baby) teeth eruption</AppText>
        <AppText variant="subtext" color={Colors.textSecondary}>Tap any tooth to log date</AppText>
      </View>
      {ERUPT_ROWS.map((row, i) => (
        <View key={i} style={[st.eruptRow, i === ERUPT_ROWS.length - 1 && {borderBottomWidth: 0}]}>
          <View style={st.eruptIcon}>
            <Icon family="Ionicons" name="medical-outline" size={ms(16)} color={Colors.primary} />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{row.name}</AppText>
            <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(9), marginTop: vs(1)}}>{row.range}</AppText>
          </View>
          <AppText variant="subtext" color={row.color} style={{fontWeight: '700', fontSize: ms(10)}}>{row.date}</AppText>
        </View>
      ))}
    </View>
  </View>
);

const BrushingTab = () => {
  const [morningLogged, setMorningLogged] = useState(true);
  const [eveningLogged, setEveningLogged] = useState(false);
  const [brushDays, setBrushDays] = useState([
    [1, 1, 0, 1, 1, 1, 0],
    [1, 0, 1, 1, 1, 1, 1],
    [1, 1, 1, 0, 1, 1, 1],
    [1, 1, 0, 1, 1, 0, 0],
  ]);

  const toggleBrushDay = (week, day) => {
    setBrushDays(prev => {
      const next = prev.map(w => [...w]);
      next[week][day] = next[week][day] ? 0 : 1;
      return next;
    });
  };

  return (
    <View>
      <Section title="Brushing habit tracker \u00b7 last 4 weeks" />
      <View style={st.card}>
        <AppText variant="subtext" color={Colors.textSecondary} style={{marginBottom: vs(8), fontSize: ms(9)}}>Apr \u00b7 each cell = one day (morning / evening)</AppText>
        {brushDays.map((week, i) => (
          <View key={i} style={st.brushRow}>
            <AppText variant="subtext" color={Colors.textSecondary} style={{width: ms(28), fontSize: ms(9), fontWeight: '700'}}>{BRUSH_WEEKS[i].wk}</AppText>
            {week.map((c, j) => (
              <TouchableOpacity
                key={j}
                style={[st.brushDot, {backgroundColor: c ? G : X}]}
                onPress={() => toggleBrushDay(i, j)}
                activeOpacity={0.7}
              />
            ))}
          </View>
        ))}
        <View style={st.brushLegend}>
          <View style={st.legendItem}>
            <View style={[st.legendDot, {backgroundColor: '#16A34A'}]} />
            <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(9)}}>Both brushes \u2713</AppText>
          </View>
          <View style={st.legendItem}>
            <View style={[st.legendDot, {backgroundColor: '#F59E0B'}]} />
            <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(9)}}>One brush</AppText>
          </View>
          <View style={st.legendItem}>
            <View style={[st.legendDot, {backgroundColor: '#D1D5DB'}]} />
            <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(9)}}>Missed</AppText>
          </View>
        </View>
      </View>

      <Section title="Log today's brushing sessions" />
      <View style={st.card}>
        <View style={st.brushSession}>
          <View style={st.sessIcon}>
            <Icon family="Ionicons" name="sunny-outline" size={ms(18)} color={Colors.primary} />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={Colors.textPrimary}>Morning brush</AppText>
            <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(9)}}>2 minutes \u00b7 fluoride toothpaste (1000ppm for 6m+)</AppText>
          </View>
          <TouchableOpacity
            style={[st.checkBtn, morningLogged ? {backgroundColor: '#16A34A'} : st.checkBtnEmpty]}
            onPress={() => setMorningLogged(!morningLogged)}
            activeOpacity={0.7}>
            {morningLogged && <Icon family="Ionicons" name="checkmark" size={ms(16)} color={Colors.white} />}
          </TouchableOpacity>
        </View>
        <View style={[st.brushSession, {borderBottomWidth: 0}]}>
          <View style={st.sessIcon}>
            <Icon family="Ionicons" name="moon-outline" size={ms(18)} color={Colors.primary} />
          </View>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" color={Colors.textPrimary}>Evening brush</AppText>
            <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(9)}}>Before bed \u00b7 no eating or drinking after</AppText>
          </View>
          <TouchableOpacity
            style={[st.checkBtn, eveningLogged ? {backgroundColor: '#16A34A'} : st.checkBtnEmpty]}
            onPress={() => setEveningLogged(!eveningLogged)}
            activeOpacity={0.7}>
            {eveningLogged && <Icon family="Ionicons" name="checkmark" size={ms(16)} color={Colors.white} />}
          </TouchableOpacity>
        </View>
      </View>

      <Section title="Fluoride & dental hygiene" />
      {FLUORIDE_FLAGS.map((f, i) => (
        <View key={i} style={st.flagRow}>
          <Icon family="Ionicons" name={f.icon} size={ms(16)} color={Colors.primary} />
          <View style={{flex: 1}}>
            <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>
              {f.title}{f.subTitleTail ? <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '400'}}>{f.subTitleTail}</AppText> : null}
            </AppText>
            <AppText variant="subtext" color={Colors.textSecondary} style={{fontSize: ms(9), marginTop: vs(2), lineHeight: ms(13)}}>{f.body}</AppText>
          </View>
        </View>
      ))}
    </View>
  );
};

const VisitsTab = () => (
  <View>
    <View style={[st.insight, {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen}]}>
      <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={Colors.tealText} />
      <AppText variant="caption" color={Colors.tealText} style={{flex: 1, lineHeight: ms(17)}}>
        <AppText style={{fontWeight: '700'}}>First dental visit: within 6 months of first tooth eruption</AppText>
        {' or by age 1 at the latest - whichever comes first. This is the IAP recommendation. Early visits establish the dentist-patient relationship and allow fluoride varnish application before caries develop.'}
      </AppText>
    </View>

    <Section title="Upcoming dental milestones" />
    {UPCOMING_MILESTONES.map((m, i) => (
      <View
        key={i}
        style={[
          st.insight,
          m.amber
            ? {backgroundColor: Colors.amberBg, borderColor: '#FDDCB5'}
            : {backgroundColor: Colors.white, borderColor: '#E5DDD3'},
        ]}>
        <Icon family="Ionicons" name="calendar-outline" size={ms(16)} color={m.amber ? Colors.amberDark : Colors.primary} />
        <View style={{flex: 1}}>
          <AppText variant="caption" color={m.amber ? Colors.amberDark : Colors.textPrimary} style={{fontWeight: '700'}}>{m.title}</AppText>
          <AppText variant="subtext" color={m.amber ? Colors.amberDark : Colors.textSecondary} style={{fontSize: ms(9), marginTop: vs(2), lineHeight: ms(13)}}>{m.body}</AppText>
        </View>
      </View>
    ))}

    <Section title="Dental visit history \u00b7 Aarav \u00b7 9y" />
    <View style={st.card}>
      <View style={st.tableHead}>
        <AppText variant="subtext" color={Colors.textSecondary} style={[st.thDate, st.thText]}>Date</AppText>
        <AppText variant="subtext" color={Colors.textSecondary} style={[st.thType, st.thText]}>Visit type</AppText>
        <AppText variant="subtext" color={Colors.textSecondary} style={[st.thFind, st.thText]}>Findings</AppText>
        <AppText variant="subtext" color={Colors.textSecondary} style={[st.thAction, st.thText]}>Action</AppText>
      </View>
      {VISIT_HISTORY.map((v, i) => (
        <View key={i} style={[st.tableRow, i === VISIT_HISTORY.length - 1 && {borderBottomWidth: 0}]}>
          <AppText variant="subtext" color={Colors.textPrimary} style={[st.thDate, {fontSize: ms(9), fontWeight: '600'}]}>{v.date}</AppText>
          <AppText variant="subtext" color={Colors.textPrimary} style={[st.thType, {fontSize: ms(9)}]}>{v.type}</AppText>
          <AppText variant="subtext" color={v.findColor} style={[st.thFind, {fontSize: ms(9), fontWeight: '700'}]}>{v.finding}</AppText>
          <AppText variant="subtext" color={Colors.textSecondary} style={[st.thAction, {fontSize: ms(9)}]}>{v.action}</AppText>
        </View>
      ))}
    </View>

    <View style={[st.insight, {backgroundColor: Colors.amberBg, borderColor: '#FDDCB5', marginTop: vs(4)}]}>
      <Icon family="Ionicons" name="alert-circle-outline" size={ms(16)} color={Colors.amberDark} />
      <AppText variant="caption" color={Colors.amberDark} style={{flex: 1, lineHeight: ms(17)}}>
        <AppText style={{fontWeight: '700'}}>One cavity and one root canal in the past 18 months.</AppText>
        {' This suggests dietary sugar timing (not total amount) may be an issue. Reducing frequency of sweet snacks and ensuring evening brushing is thorough will have the highest impact on future cavity prevention.'}
      </AppText>
    </View>
  </View>
);

const AyuTab = () => (
  <View>
    <View style={st.ayuHeader}>
      <AppText variant="subtext" color="rgba(255,255,255,0.7)" style={{textTransform: 'uppercase', letterSpacing: 0.5, fontSize: ms(9), fontWeight: '700'}}>Ayu Intel \u00b7 Dental</AppText>
      <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(2)}}>Dental intelligence</AppText>
    </View>

    <View style={[st.card, {marginTop: vs(10)}]}>
      <View style={{marginBottom: vs(8)}}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>Cavity risk factors \u00b7 Aarav's profile</AppText>
        <AppText variant="subtext" color={Colors.textSecondary}>2 dental interventions in 18 months</AppText>
      </View>
      {AYU_INSIGHTS.map((ins, i) => (
        <View key={i} style={[st.ayuRow, i === AYU_INSIGHTS.length - 1 && {borderBottomWidth: 0}]}>
          <View style={[st.ayuDot, {backgroundColor: ins.color}]} />
          <AppText variant="caption" color={Colors.textPrimary} style={{flex: 1, lineHeight: ms(17)}}>
            <AppText style={{fontWeight: '700'}}>{ins.title}</AppText>{ins.body}
          </AppText>
        </View>
      ))}
    </View>
  </View>
);

// ──────────────────────────────────────────────
// Main
// ──────────────────────────────────────────────

const DentalTrackerScreen = () => {
  const navigation = useNavigation();
  const insets = useSafeAreaInsets();
  const [activeTab, setActiveTab] = useState(0);

  const renderTab = () => {
    switch (activeTab) {
      case 0: return <TeethMapTab />;
      case 1: return <BrushingTab />;
      case 2: return <VisitsTab />;
      case 3: return <AyuTab />;
      default: return null;
    }
  };

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* ── Fixed Header ── */}
      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topRow}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
            <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
              <Icon family="Ionicons" name="chevron-back" size={18} color={Colors.white} />
            </TouchableOpacity>
            <AppText variant="body" color="rgba(255,255,255,0.8)">Dental tracker</AppText>
          </View>
          <TouchableOpacity style={st.savePill} activeOpacity={0.7}>
            <AppText variant="subtext" color={Colors.white} style={{fontWeight: '700'}}>Save</AppText>
            <Icon family="Ionicons" name="checkmark" size={ms(13)} color={Colors.white} />
          </TouchableOpacity>
        </View>

        <View style={{paddingTop: vs(6), paddingBottom: vs(6)}}>
          <AppText variant="subtext" color="rgba(255,255,255,0.6)" style={{textTransform: 'uppercase', letterSpacing: 0.6, fontSize: ms(9), fontWeight: '700'}}>Dental health tracker</AppText>
          <AppText variant="screenName" color={Colors.white} style={{marginTop: vs(2)}}>Dental tracker</AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.6)" style={{marginTop: vs(3)}}>Eruption timeline \u00b7 brushing habits \u00b7 fluoride \u00b7 dentist visits</AppText>
        </View>

        {/* Tab bar */}
        <View style={st.tabBar}>
          {TABS.map((t, i) => (
            <TouchableOpacity
              key={t}
              style={[st.tabPill, activeTab === i && st.tabPillActive]}
              onPress={() => setActiveTab(i)}
              activeOpacity={0.7}>
              <AppText
                variant="subtext"
                color={activeTab === i ? Colors.primary : 'rgba(255,255,255,0.75)'}
                style={{fontWeight: '700', fontSize: ms(10)}}>
                {t}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      {/* ── Scrollable Body ── */}
      <ScrollView style={st.body} contentContainerStyle={st.bodyContent} showsVerticalScrollIndicator={false}>
        {renderTab()}
        <View style={{height: vs(20)}} />
      </ScrollView>

      {/* ── Sticky Save Bar ── */}
      <View style={[st.saveBar, {paddingBottom: Math.max(insets.bottom, vs(10))}]}>
        <TouchableOpacity style={st.saveBtn} activeOpacity={0.8}>
          <Icon family="Ionicons" name="save-outline" size={ms(18)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white}>Save dental log</AppText>
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
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(10)},
  topRow: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', paddingVertical: vs(8)},
  backBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  savePill: {flexDirection: 'row', alignItems: 'center', gap: s(4), backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: s(12), paddingVertical: vs(6), borderRadius: ms(14)},

  // Tab bar
  tabBar: {flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.2)', borderRadius: ms(12), padding: ms(3), marginTop: vs(8), gap: s(3)},
  tabPill: {flex: 1, paddingVertical: vs(7), alignItems: 'center', borderRadius: ms(9)},
  tabPillActive: {backgroundColor: Colors.white},

  // Body
  body: {flex: 1},
  bodyContent: {paddingHorizontal: s(13), paddingTop: vs(10)},

  // Section
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(12), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7), fontSize: ms(9)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#E5DDD3'},

  // Card
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#E5DDD3', padding: ms(11), marginBottom: vs(8)},

  // Mouth
  mouthCard: {backgroundColor: Colors.primary, borderRadius: ms(16), padding: ms(14), marginBottom: vs(4)},
  mouthSub: {fontSize: ms(9), textTransform: 'uppercase', letterSpacing: 0.5, fontWeight: '700', marginBottom: vs(6)},
  toothRow: {flexDirection: 'row', justifyContent: 'space-between', gap: s(3)},
  tooth: {flex: 1, aspectRatio: 0.85, borderRadius: ms(6), alignItems: 'center', justifyContent: 'center', minHeight: ms(24)},
  mouthDivider: {height: StyleSheet.hairlineWidth, backgroundColor: 'rgba(255,255,255,0.25)', marginVertical: vs(10)},
  legendRow: {flexDirection: 'row', justifyContent: 'space-around', marginTop: vs(10), paddingTop: vs(10), borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: 'rgba(255,255,255,0.15)'},
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: s(4)},
  legendDot: {width: ms(8), height: ms(8), borderRadius: ms(4)},

  // Erupt rows
  eruptRow: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(8), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F5F0FF'},
  eruptIcon: {width: ms(30), height: ms(30), borderRadius: ms(9), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center'},

  // Brushing
  brushRow: {flexDirection: 'row', alignItems: 'center', gap: s(5), marginBottom: vs(6)},
  brushDot: {flex: 1, height: ms(18), borderRadius: ms(5)},
  brushLegend: {flexDirection: 'row', justifyContent: 'space-between', marginTop: vs(8), paddingTop: vs(8), borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#F0EBE2'},

  brushSession: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(8), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F5F0FF'},
  sessIcon: {width: ms(34), height: ms(34), borderRadius: ms(10), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center'},
  checkBtn: {width: ms(30), height: ms(30), borderRadius: ms(15), alignItems: 'center', justifyContent: 'center'},
  checkBtnEmpty: {borderWidth: 1.5, borderColor: '#D1D5DB', backgroundColor: 'transparent'},

  // Flags
  flagRow: {flexDirection: 'row', gap: s(9), padding: ms(11), backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#E5DDD3', marginBottom: vs(7), alignItems: 'flex-start'},

  // Insight
  insight: {borderRadius: ms(11), borderWidth: 1, padding: ms(10), marginBottom: vs(8), flexDirection: 'row', alignItems: 'flex-start', gap: s(8)},

  // Table
  tableHead: {flexDirection: 'row', paddingBottom: vs(6), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#E5DDD3', marginBottom: vs(4)},
  thText: {fontSize: ms(8), textTransform: 'uppercase', letterSpacing: 0.4, fontWeight: '700'},
  tableRow: {flexDirection: 'row', paddingVertical: vs(7), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F5F0FF', alignItems: 'center'},
  thDate: {width: '16%'},
  thType: {width: '26%'},
  thFind: {width: '26%'},
  thAction: {width: '32%'},

  // Ayu
  ayuHeader: {backgroundColor: Colors.primary, marginHorizontal: s(-13), paddingHorizontal: s(16), paddingTop: vs(12), paddingBottom: vs(14)},
  ayuRow: {flexDirection: 'row', gap: s(9), paddingVertical: vs(9), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F5F0FF', alignItems: 'flex-start'},
  ayuDot: {width: ms(8), height: ms(8), borderRadius: ms(4), marginTop: vs(5)},

  // Save bar
  saveBar: {backgroundColor: Colors.white, borderTopWidth: StyleSheet.hairlineWidth, borderTopColor: '#E5DDD3', paddingHorizontal: s(16), paddingTop: vs(10)},
  saveBtn: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(8), backgroundColor: Colors.primary, paddingVertical: vs(13), borderRadius: ms(14)},
});

export default DentalTrackerScreen;
