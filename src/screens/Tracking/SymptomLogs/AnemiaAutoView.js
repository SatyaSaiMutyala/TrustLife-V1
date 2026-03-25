import React from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Polyline, Rect, Line as SvgLine, Circle as SvgCircle, Text as SvgText} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

/* ───────── static data ───────── */

const CBC_LABS = [
  {label: 'HEMOGLOBIN', value: '10.8', unit: 'g/dL', status: 'LOW', bg: Colors.amberBg, color: Colors.amberText, range: '12.0\u201315.5'},
  {label: 'HEMATOCRIT', value: '33', unit: '%', status: 'LOW', bg: Colors.amberBg, color: Colors.amberText, range: '36\u201346'},
  {label: 'MCV', value: '108', unit: 'fL', status: 'MACROCYTIC \u2191', bg: Colors.redBg, color: Colors.redText, range: '80\u2013100'},
  {label: 'MCH', value: '36', unit: 'pg', status: 'High', bg: Colors.amberBg, color: Colors.amberText, range: '27\u201333'},
  {label: 'RBC COUNT', value: '3.4', unit: 'M/\u00b5L', status: 'Low', bg: Colors.amberBg, color: Colors.amberText, range: '3.8\u20135.1'},
  {label: 'RDW', value: '16.2', unit: '%', status: 'High', bg: Colors.amberBg, color: Colors.amberText, range: '11.5\u201314.5'},
  {label: 'WBC', value: '6.8', unit: 'K/\u00b5L', status: 'Normal', bg: Colors.tealBg, color: Colors.tealText, range: '4.5\u201311.0'},
  {label: 'PLATELET', value: '210', unit: 'K/\u00b5L', status: 'Normal', bg: Colors.tealBg, color: Colors.tealText, range: '150\u2013400'},
  {label: 'RETICULOCYTE', value: '0.8', unit: '%', status: 'Low-normal', bg: Colors.amberBg, color: Colors.amberText, range: '0.5\u20132.5'},
  {label: 'MCHC', value: '33', unit: 'g/dL', status: 'Normal', bg: Colors.tealBg, color: Colors.tealText, range: '32\u201336'},
];

const MCV_ROWS = [
  {label: 'Microcytic', range: '<80 fL', active: false, note: 'Not this'},
  {label: 'Normocytic', range: '80\u2013100 fL', active: false, note: 'Not this'},
  {label: 'Macrocytic', range: '>100 fL', active: true, note: 'Confirmed', causes: ['B12', 'Folate', 'Alcohol', 'Hypothyroid']},
];

const B12_IRON_LABS = [
  {label: 'SERUM B12', value: '147', unit: 'pg/mL', status: 'LOW', bg: Colors.redBg, color: Colors.redText, range: '200\u2013900'},
  {label: 'FOLATE', value: '8.2', unit: 'ng/mL', status: 'Normal', bg: Colors.tealBg, color: Colors.tealText, range: '3\u201317'},
  {label: 'FERRITIN', value: '28', unit: 'ng/mL', status: 'Low-normal', bg: Colors.amberBg, color: Colors.amberText, range: '12\u2013150'},
  {label: 'SERUM IRON/TIBC', value: '85', unit: '\u00b5g/dL', status: 'Low-normal', bg: Colors.amberBg, color: Colors.amberText, range: '60\u2013170'},
  {label: 'LDH', value: '420', unit: 'U/L', status: 'Mildly high', bg: Colors.amberBg, color: Colors.amberText, range: '140\u2013280'},
  {label: 'BILIRUBIN', value: '0.8', unit: 'mg/dL', status: 'Normal', bg: Colors.tealBg, color: Colors.tealText, range: '0.1\u20131.2'},
  {label: 'HOMOCYSTEINE', value: '22', unit: '\u00b5mol/L', status: 'HIGH', bg: Colors.redBg, color: Colors.redText, range: '5\u201315'},
  {label: 'MMA', value: '0.48', unit: '\u00b5mol/L', status: 'HIGH', bg: Colors.redBg, color: Colors.redText, range: '<0.27'},
];

const SMEAR_TAGS = [
  {label: 'Macro-ovalocytes', active: true},
  {label: 'Hypersegmented neutrophils', active: true},
  {label: 'Anisocytosis', active: false},
  {label: 'Poikilocytosis', active: false},
  {label: 'Pencil cells', active: false},
  {label: 'Target cells', active: false},
  {label: 'Sickle cells', active: false},
  {label: 'Spherocytes', active: false},
  {label: 'Bite cells', active: false},
  {label: 'Schistocytes', active: false},
  {label: 'Megaloblastic changes', active: true},
  {label: 'Normal smear', active: false},
];

const B12_FOODS = ['Milk/curd', 'Paneer/cheese', 'Egg', 'Chicken', 'Fish', 'Shellfish', 'Liver', 'Fortified cereals'];

const HEME_IRON = ['Chicken liver', 'Red meat', 'Fish', 'Egg yolk'];
const NONHEME_IRON = ['Spinach', 'Lentils', 'Rajma', 'Groundnuts', 'Soybean', 'Jowar/ragi', 'Dried figs', 'Fortified rice'];

const FOLATE_FOODS = ['Green leafy', 'Chickpeas', 'Lentils', 'Avocado', 'Orange', 'Beetroot', 'Fortified wheat'];

const ENHANCERS = [
  {label: 'Vitamin C', checked: true},
  {label: 'Tomatoes', checked: false},
  {label: 'Broccoli', checked: false},
  {label: 'Heme iron', checked: false},
  {label: 'Garlic', checked: false},
];

const INHIBITORS = [
  {label: 'Chai/coffee', checked: true},
  {label: 'Milk/dairy', checked: false},
  {label: 'Phytates', checked: false},
  {label: 'Oxalates', checked: false},
  {label: 'Antacids', checked: false},
  {label: 'Calcium supplements', checked: false},
];

const TIMELINE_EVENTS = [
  {time: '6:00 AM', label: 'Iron supplement', note: 'Best absorption window', dotColor: Colors.tealText, bg: Colors.tealBg},
  {time: '7:00 AM', label: 'Breakfast + Metformin', note: 'With food', dotColor: Colors.amberText, bg: Colors.amberBg},
  {time: '7:30 AM', label: 'Tea/chai INHIBITOR', note: 'Avoid within 1h', dotColor: Colors.redText, bg: Colors.redBg},
  {time: '9:00 AM', label: 'Methylcobalamin B12', note: 'Anytime', dotColor: Colors.tealText, bg: Colors.tealBg},
  {time: '1:00 PM', label: 'Vitamin C with lunch', note: 'Absorption enhancer', dotColor: Colors.blueText, bg: Colors.blueBg},
  {time: '8:00 PM', label: 'Metformin PM', note: 'With dinner', dotColor: Colors.amberText, bg: Colors.amberBg},
];

const SUPPLEMENTS = [
  {
    icon: 'brain-outline',
    name: 'Methylcobalamin 500mcg',
    desc: 'Active form of vitamin B12. Better neural tissue penetration than cyanocobalamin. Sublingual for best absorption bypassing GI tract.',
    badge: 'Taken \u2713 today',
    badgeBg: Colors.tealBg,
    badgeColor: Colors.tealText,
    day: 'Day 9',
  },
  {
    icon: 'water-outline',
    name: 'Iron supplement',
    desc: 'Ferrous sulfate or ferrous bisglycinate. Take on empty stomach with vitamin C. Avoid with tea, coffee, dairy, or calcium.',
    badge: 'Check with doctor',
    badgeBg: '#f3f4f6',
    badgeColor: Colors.textSecondary,
    day: null,
  },
  {
    icon: 'leaf-outline',
    name: 'Folic acid',
    desc: 'Folic acid 5mg. Supports red cell production alongside B12. Do not start without confirming B12 therapy first.',
    badge: 'Monitor',
    badgeBg: Colors.amberBg,
    badgeColor: Colors.amberText,
    day: null,
  },
];

const SIDE_EFFECT_TAGS = [
  {label: 'No side effects', active: true},
  {label: 'Nausea', active: false},
  {label: 'Black stools', active: false},
  {label: 'Constipation', active: false},
  {label: 'Vomiting', active: false},
  {label: 'Heartburn', active: false},
  {label: 'Metallic taste', active: false},
  {label: 'Injection site', active: false},
  {label: 'Forgot supplement', active: false},
];

const HB_TREND = [
  {x: 10, val: 12.8, label: "Sep'19"},
  {x: 50, val: 12.2, label: "Mar'21"},
  {x: 90, val: 11.8, label: "Sep'22"},
  {x: 130, val: 11.6, label: "Sep'23"},
  {x: 170, val: 11.4, label: "Sep'24"},
  {x: 210, val: 11.2, label: "Mar'25"},
  {x: 250, val: 10.9, label: "Sep'25"},
  {x: 290, val: 10.6, label: 'Mar 15'},
  {x: 330, val: 10.8, label: 'Today'},
];

const LAB_HISTORY = [
  {date: 'Sep 2019', hb: '12.8', mcv: '88', b12: '310', retic: '1.2'},
  {date: 'Mar 2021', hb: '12.2', mcv: '92', b12: '265', retic: '1.0'},
  {date: 'Sep 2022', hb: '11.8', mcv: '96', b12: '220', retic: '0.9'},
  {date: 'Sep 2023', hb: '11.6', mcv: '100', b12: '195', retic: '0.8'},
  {date: 'Sep 2024', hb: '11.4', mcv: '104', b12: '168', retic: '0.7'},
  {date: 'Today', hb: '10.8', mcv: '108', b12: '147', retic: '0.8'},
];

const MILESTONES = [
  {period: 'Day 5\u201310', desc: 'Reticulocyte peak', badge: 'Now \u2014 Day 9', badgeBg: Colors.amberBg, badgeColor: Colors.amberText},
  {period: 'Week 2\u20134', desc: 'Hb begins to rise', badge: 'Upcoming', badgeBg: Colors.blueBg, badgeColor: Colors.blueText},
  {period: 'Week 4\u20136', desc: 'Neurological improvement', badge: 'Upcoming', badgeBg: Colors.blueBg, badgeColor: Colors.blueText},
  {period: 'Month 2\u20133', desc: 'Hb normalisation', badge: 'Target', badgeBg: Colors.tealBg, badgeColor: Colors.tealText},
  {period: 'Lifelong', desc: 'Ongoing B12 monitoring', badge: 'Lifelong', badgeBg: Colors.pinkBg, badgeColor: Colors.redText},
];

const COMPARISON = [
  {label: 'Hemoglobin', mar26: '10.8 g/dL', sep19: '12.8 g/dL', trend: 'down', color: Colors.redText},
  {label: 'MCV', mar26: '108 fL', sep19: '88 fL', trend: 'up', color: Colors.redText},
  {label: 'Serum B12', mar26: '147 pg/mL', sep19: '310 pg/mL', trend: 'down', color: Colors.redText},
  {label: 'Homocysteine', mar26: '22 \u00b5mol/L', sep19: '8 \u00b5mol/L', trend: 'up', color: Colors.redText},
  {label: 'Reticulocytes', mar26: '0.8%', sep19: '1.2%', trend: 'down', color: Colors.amberText},
  {label: 'Fatigue score', mar26: '7/10', sep19: '2/10', trend: 'up', color: Colors.redText},
];

/* ───────── helpers ───────── */

const toY = val => 110 - ((val - 9.5) / (13.5 - 9.5)) * 100;

const LabCell = ({item}) => (
  <View style={st.labCell}>
    <AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontSize: ms(9)}}>
      {item.label}
    </AppText>
    <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(16), marginTop: vs(2)}} numberOfLines={1}>
      {item.value} <AppText variant="caption" color={Colors.textSecondary}>{item.unit}</AppText>
    </AppText>
    <View style={[st.statusBadge, {backgroundColor: item.bg, alignSelf: 'flex-start', marginTop: vs(3)}]}>
      <AppText variant="small" color={item.color}>{item.status}</AppText>
    </View>
    <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
      Ref: {item.range}
    </AppText>
  </View>
);

const FoodTag = ({label, bg, color}) => (
  <View style={[st.tag, {backgroundColor: bg || '#f3f4f6'}]}>
    <AppText variant="small" color={color || Colors.textPrimary}>{label}</AppText>
  </View>
);

/* ───────── component ───────── */

const AnemiaAutoView = ({activePanel}) => {

  /* ══════════════ LABS PANEL ══════════════ */
  const renderLabsPanel = () => (
    <View>
      {/* 1. CBC */}
      <View style={st.section}>
        <AppText variant="sectionTitle" color={Colors.textPrimary}>COMPLETE BLOOD COUNT</AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
          Tap to enter {'\u00b7'} Last: Mar 15, 2026
        </AppText>
        <View style={st.card}>
          <View style={st.labGrid}>
            {CBC_LABS.map((item, idx) => (
              <LabCell key={idx} item={item} />
            ))}
          </View>
        </View>
      </View>

      {/* 2. MCV Classifier */}
      <View style={st.section}>
        <View style={st.card}>
          <AppText variant="bodyBold" color={Colors.textPrimary}>
            MCV 108 fL {'\u2014'} Macrocytic
          </AppText>
          {MCV_ROWS.map((row, idx) => (
            <View
              key={idx}
              style={[
                st.mcvRow,
                row.active && {backgroundColor: Colors.redBg, borderColor: Colors.redText},
              ]}>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold" color={row.active ? Colors.redText : Colors.textPrimary}>
                  {row.label}
                </AppText>
                <AppText variant="small" color={Colors.textSecondary}>{row.range}</AppText>
              </View>
              <View style={[st.statusBadge, {backgroundColor: row.active ? Colors.redBg : '#f3f4f6'}]}>
                <AppText variant="small" color={row.active ? Colors.redText : Colors.textSecondary}>
                  {row.note}
                </AppText>
              </View>
            </View>
          ))}
          {/* Macrocytic causes */}
          <View style={st.causeRow}>
            {MCV_ROWS[2].causes.map((c, i) => (
              <View key={i} style={[st.tag, {backgroundColor: Colors.redBg}]}>
                <AppText variant="small" color={Colors.redText}>{c}</AppText>
              </View>
            ))}
          </View>
        </View>
      </View>

      {/* 3. B12 / Folate / Iron Stores */}
      <View style={st.section}>
        <AppText variant="sectionTitle" color={Colors.textPrimary}>
          B12 {'\u00b7'} FOLATE {'\u00b7'} IRON STORES
        </AppText>
        <View style={st.card}>
          <View style={st.labGrid}>
            {B12_IRON_LABS.map((item, idx) => (
              <LabCell key={idx} item={item} />
            ))}
          </View>
          <View style={[st.insightBox, {backgroundColor: Colors.amberBg, marginTop: vs(10)}]}>
            <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={Colors.amberText} />
            <AppText variant="small" color={Colors.amberText} style={{flex: 1, marginLeft: s(6)}}>
              MMA is most specific for tissue B12 deficiency. Elevated MMA + elevated homocysteine together confirm functional B12 deficiency even when serum B12 is borderline.
            </AppText>
          </View>
        </View>
      </View>

      {/* 4. Peripheral Smear */}
      <View style={st.section}>
        <AppText variant="sectionTitle" color={Colors.textPrimary}>PERIPHERAL SMEAR</AppText>
        <View style={st.card}>
          <View style={st.tagWrap}>
            {SMEAR_TAGS.map((t, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                style={[
                  st.tag,
                  {backgroundColor: t.active ? Colors.redBg : '#f3f4f6'},
                  t.active && {borderColor: Colors.redText, borderWidth: 1},
                ]}>
                <AppText variant="small" color={t.active ? Colors.redText : Colors.textSecondary}>
                  {t.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>

      {/* 5. Blue Insight */}
      <View style={st.section}>
        <View style={[st.insightBox, {backgroundColor: Colors.blueBg}]}>
          <Icon family="Ionicons" name="flask-outline" size={ms(16)} color={Colors.blueText} />
          <AppText variant="small" color={Colors.blueText} style={{flex: 1, marginLeft: s(6)}}>
            Lab interpretation: Macrocytic anemia (MCV 108) with low serum B12 (147), elevated homocysteine (22) and elevated MMA (0.48) confirms B12 deficiency megaloblastic anemia. Peripheral smear shows macro-ovalocytes and hypersegmented neutrophils, classic findings. Most likely cause: Metformin-induced B12 malabsorption.
          </AppText>
        </View>
      </View>
    </View>
  );

  /* ══════════════ DIET PANEL ══════════════ */
  const renderDietPanel = () => (
    <View>
      {/* 1. B12 Food Sources */}
      <View style={st.section}>
        <AppText variant="sectionTitle" color={Colors.textPrimary}>B12 FOOD SOURCES</AppText>
        <View style={st.card}>
          <View style={st.tagWrap}>
            {B12_FOODS.map((f, i) => (
              <FoodTag key={i} label={f} bg={Colors.purpleBg} color={Colors.purpleText} />
            ))}
          </View>
          <View style={[st.insightBox, {backgroundColor: Colors.amberBg, marginTop: vs(10)}]}>
            <Icon family="Ionicons" name="warning-outline" size={ms(16)} color={Colors.amberText} />
            <AppText variant="small" color={Colors.amberText} style={{flex: 1, marginLeft: s(6)}}>
              B12 is found almost exclusively in animal foods. Strict vegetarian or vegan diets require supplementation or fortified foods.
            </AppText>
          </View>
        </View>
      </View>

      {/* 2. Iron Food Sources */}
      <View style={st.section}>
        <AppText variant="sectionTitle" color={Colors.textPrimary}>IRON FOOD SOURCES</AppText>
        <View style={st.card}>
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginBottom: vs(6)}}>
            Heme iron (better absorbed)
          </AppText>
          <View style={st.tagWrap}>
            {HEME_IRON.map((f, i) => (
              <FoodTag key={i} label={f} bg={Colors.redBg} color={Colors.redText} />
            ))}
          </View>
          <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginTop: vs(10), marginBottom: vs(6)}}>
            Non-heme iron
          </AppText>
          <View style={st.tagWrap}>
            {NONHEME_IRON.map((f, i) => (
              <FoodTag key={i} label={f} bg={Colors.tealBg} color={Colors.tealText} />
            ))}
          </View>
        </View>
      </View>

      {/* 3. Folate Foods */}
      <View style={st.section}>
        <AppText variant="sectionTitle" color={Colors.textPrimary}>FOLATE FOODS</AppText>
        <View style={st.card}>
          <View style={st.tagWrap}>
            {FOLATE_FOODS.map((f, i) => (
              <FoodTag key={i} label={f} bg={Colors.tealBg} color={Colors.tealText} />
            ))}
          </View>
        </View>
      </View>

      {/* 4. Enhancers vs Inhibitors */}
      <View style={st.section}>
        <AppText variant="sectionTitle" color={Colors.textPrimary}>ABSORPTION ENHANCERS vs INHIBITORS</AppText>
        <View style={st.card}>
          <View style={st.twoCol}>
            {/* Enhancers */}
            <View style={{flex: 1, marginRight: s(6)}}>
              <AppText variant="bodyBold" color={Colors.tealText} style={{marginBottom: vs(6)}}>
                Enhancers
              </AppText>
              {ENHANCERS.map((e, i) => (
                <View key={i} style={[st.absRow, {backgroundColor: Colors.tealBg}]}>
                  {e.checked && (
                    <Icon family="Ionicons" name="checkmark-circle" size={ms(14)} color={Colors.tealText} />
                  )}
                  <AppText variant="small" color={Colors.tealText} style={{marginLeft: e.checked ? s(4) : 0}}>
                    {e.label}
                  </AppText>
                </View>
              ))}
            </View>
            {/* Inhibitors */}
            <View style={{flex: 1, marginLeft: s(6)}}>
              <AppText variant="bodyBold" color={Colors.redText} style={{marginBottom: vs(6)}}>
                Inhibitors
              </AppText>
              {INHIBITORS.map((e, i) => (
                <View key={i} style={[st.absRow, {backgroundColor: Colors.redBg}]}>
                  {e.checked && (
                    <Icon family="Ionicons" name="close-circle" size={ms(14)} color={Colors.redText} />
                  )}
                  <AppText variant="small" color={Colors.redText} style={{marginLeft: e.checked ? s(4) : 0}}>
                    {e.label}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        </View>
      </View>

      {/* 5. Timing warning */}
      <View style={st.section}>
        <View style={[st.insightBox, {backgroundColor: Colors.amberBg}]}>
          <Icon family="Ionicons" name="time-outline" size={ms(16)} color={Colors.amberText} />
          <AppText variant="small" color={Colors.amberText} style={{flex: 1, marginLeft: s(6)}}>
            Chai with breakfast reduces iron absorption 60\u201390%. Wait at least 1 hour after an iron-rich meal before drinking tea or coffee. Vitamin C (lemon, amla, orange) with meals significantly enhances non-heme iron absorption.
          </AppText>
        </View>
      </View>
    </View>
  );

  /* ══════════════ SUPPLEMENTS PANEL ══════════════ */
  const renderSuppPanel = () => (
    <View>
      {/* 1. Today's Supplement Log */}
      <View style={st.section}>
        <AppText variant="sectionTitle" color={Colors.textPrimary}>TODAY{'\u2019'}S SUPPLEMENT LOG</AppText>
        <View style={st.card}>
          <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(8)}}>
            Timing matters for absorption. Space iron and B12 away from tea, dairy, and calcium.
          </AppText>
          {TIMELINE_EVENTS.map((ev, idx) => (
            <View key={idx} style={st.timelineRow}>
              <View style={st.timelineLeft}>
                <AppText variant="small" color={Colors.textSecondary} style={{width: s(58), textAlign: 'right'}}>
                  {ev.time}
                </AppText>
                <View style={[st.timelineDot, {backgroundColor: ev.dotColor}]} />
                {idx < TIMELINE_EVENTS.length - 1 && <View style={st.timelineLine} />}
              </View>
              <View style={[st.timelineContent, {backgroundColor: ev.bg}]}>
                <AppText variant="bodyBold" color={Colors.textPrimary}>{ev.label}</AppText>
                <AppText variant="small" color={Colors.textSecondary}>{ev.note}</AppText>
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 2. Current Supplements */}
      <View style={st.section}>
        <AppText variant="sectionTitle" color={Colors.textPrimary}>CURRENT SUPPLEMENTS</AppText>
        <View style={st.card}>
          {SUPPLEMENTS.map((sup, idx) => (
            <View key={idx} style={[st.suppRow, idx > 0 && {borderTopWidth: 0.5, borderTopColor: '#d1d5db'}]}>
              <View style={st.suppIconWrap}>
                <Icon family="Ionicons" name={sup.icon} size={ms(20)} color={Colors.primary} />
              </View>
              <View style={{flex: 1, marginLeft: s(10)}}>
                <View style={st.suppHeader}>
                  <AppText variant="bodyBold" color={Colors.textPrimary} style={{flex: 1}}>
                    {sup.name}
                  </AppText>
                  <View style={[st.statusBadge, {backgroundColor: sup.badgeBg}]}>
                    <AppText variant="small" color={sup.badgeColor}>{sup.badge}</AppText>
                  </View>
                </View>
                <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(3), lineHeight: ms(16)}}>
                  {sup.desc}
                </AppText>
                {sup.day && (
                  <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
                    {sup.day}
                  </AppText>
                )}
              </View>
            </View>
          ))}
        </View>
      </View>

      {/* 3. Side Effects */}
      <View style={st.section}>
        <AppText variant="sectionTitle" color={Colors.textPrimary}>SIDE EFFECTS</AppText>
        <View style={st.card}>
          <View style={st.tagWrap}>
            {SIDE_EFFECT_TAGS.map((t, i) => (
              <TouchableOpacity
                key={i}
                activeOpacity={0.7}
                style={[
                  st.tag,
                  {backgroundColor: t.active ? Colors.tealBg : '#f3f4f6'},
                  t.active && {borderColor: Colors.tealText, borderWidth: 1},
                ]}>
                <AppText variant="small" color={t.active ? Colors.tealText : Colors.textSecondary}>
                  {t.label}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        </View>
      </View>
    </View>
  );

  /* ══════════════ HISTORY PANEL ══════════════ */
  const renderHistoryPanel = () => {
    const points = HB_TREND.map(p => `${p.x},${toY(p.val)}`).join(' ');
    const fillPoints = `${HB_TREND[0].x},110 ${points} ${HB_TREND[HB_TREND.length - 1].x},110`;
    const normalY = toY(12.0);

    return (
      <View>
        {/* 1. Hb Trend Chart */}
        <View style={st.section}>
          <AppText variant="sectionTitle" color={Colors.textPrimary}>Hb TREND</AppText>
          <View style={st.card}>
            <Svg width="100%" height={vs(140)} viewBox="0 0 340 120">
              {/* Normal zone */}
              <Rect x="0" y="0" width="340" height={normalY} fill="rgba(10,92,71,0.06)" />
              <SvgText x="4" y={normalY - 3} fontSize="8" fill={Colors.tealText}>Normal {'\u2265'}12.0</SvgText>
              {/* Dashed reference line */}
              <SvgLine x1="0" y1={normalY} x2="340" y2={normalY} stroke={Colors.tealText} strokeWidth="0.8" strokeDasharray="4,3" />
              {/* Red fill area */}
              <Polyline points={fillPoints} fill="rgba(226,75,74,0.10)" stroke="none" />
              {/* Red line */}
              <Polyline points={points} fill="none" stroke={Colors.red} strokeWidth="1.8" />
              {/* Dots and labels */}
              {HB_TREND.map((p, i) => (
                <React.Fragment key={i}>
                  <SvgCircle cx={p.x} cy={toY(p.val)} r="3" fill={Colors.red} />
                  <SvgText x={p.x} y={toY(p.val) - 6} fontSize="7" fill={Colors.textSecondary} textAnchor="middle">
                    {p.val}
                  </SvgText>
                  <SvgText x={p.x} y="118" fontSize="6" fill={Colors.textTertiary} textAnchor="middle">
                    {p.label}
                  </SvgText>
                </React.Fragment>
              ))}
              {/* B12 start marker */}
              <SvgLine
                x1={HB_TREND[HB_TREND.length - 1].x}
                y1={toY(HB_TREND[HB_TREND.length - 1].val) + 6}
                x2={HB_TREND[HB_TREND.length - 1].x}
                y2="108"
                stroke={Colors.primary}
                strokeWidth="0.8"
                strokeDasharray="2,2"
              />
              <SvgText
                x={HB_TREND[HB_TREND.length - 1].x}
                y={toY(HB_TREND[HB_TREND.length - 1].val) + 14}
                fontSize="7"
                fill={Colors.primary}
                textAnchor="middle">
                B12 start
              </SvgText>
            </Svg>
          </View>
        </View>

        {/* 2. Lab History Table */}
        <View style={st.section}>
          <AppText variant="sectionTitle" color={Colors.textPrimary}>LAB HISTORY</AppText>
          <View style={st.card}>
            {/* Header */}
            <View style={st.tableRow}>
              {['Date', 'Hb', 'MCV', 'B12', 'Retic'].map((h, i) => (
                <AppText key={i} variant="small" color={Colors.textSecondary} style={[st.tableCell, i === 0 && {flex: 1.4}]}>
                  {h}
                </AppText>
              ))}
            </View>
            {/* Rows */}
            {LAB_HISTORY.map((row, idx) => (
              <View key={idx} style={[st.tableRow, {backgroundColor: idx % 2 === 0 ? '#f9fafb' : Colors.white}]}>
                <AppText variant="small" color={Colors.textPrimary} style={[st.tableCell, {flex: 1.4}]}>
                  {row.date}
                </AppText>
                <AppText variant="small" color={Colors.textPrimary} style={st.tableCell}>{row.hb}</AppText>
                <AppText variant="small" color={Colors.textPrimary} style={st.tableCell}>{row.mcv}</AppText>
                <AppText variant="small" color={Colors.textPrimary} style={st.tableCell}>{row.b12}</AppText>
                <AppText variant="small" color={Colors.textPrimary} style={st.tableCell}>{row.retic}</AppText>
              </View>
            ))}
            <View style={[st.insightBox, {backgroundColor: Colors.amberBg, marginTop: vs(10)}]}>
              <Icon family="Ionicons" name="trending-down-outline" size={ms(16)} color={Colors.amberText} />
              <AppText variant="small" color={Colors.amberText} style={{flex: 1, marginLeft: s(6)}}>
                Progressive macrocytic anemia over 5+ years of Metformin use. MCV steadily rising while B12 steadily declining. Pattern is classic for Metformin-induced B12 malabsorption.
              </AppText>
            </View>
          </View>
        </View>

        {/* 3. Treatment Milestones */}
        <View style={st.section}>
          <AppText variant="sectionTitle" color={Colors.textPrimary}>TREATMENT MILESTONES</AppText>
          <View style={st.card}>
            {MILESTONES.map((m, idx) => (
              <View key={idx} style={[st.milestoneRow, idx > 0 && {borderTopWidth: 0.5, borderTopColor: '#d1d5db'}]}>
                <View style={{flex: 1}}>
                  <AppText variant="bodyBold" color={Colors.textPrimary}>{m.period}</AppText>
                  <AppText variant="small" color={Colors.textSecondary}>{m.desc}</AppText>
                </View>
                <View style={[st.statusBadge, {backgroundColor: m.badgeBg}]}>
                  <AppText variant="small" color={m.badgeColor}>{m.badge}</AppText>
                </View>
              </View>
            ))}
          </View>
        </View>

        {/* 4. Comparison */}
        <View style={st.section}>
          <AppText variant="sectionTitle" color={Colors.textPrimary}>COMPARISON</AppText>
          <View style={st.card}>
            {/* Header */}
            <View style={st.compRow}>
              <AppText variant="small" color={Colors.textSecondary} style={{flex: 1.2}}>Metric</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{flex: 1}}>Mar 2026</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{flex: 1}}>Sep 2019</AppText>
            </View>
            {COMPARISON.map((c, idx) => (
              <View key={idx} style={[st.compRow, {backgroundColor: idx % 2 === 0 ? '#f9fafb' : Colors.white}]}>
                <AppText variant="small" color={Colors.textPrimary} style={{flex: 1.2}}>{c.label}</AppText>
                <AppText variant="small" color={c.color} style={{flex: 1}}>
                  {c.mar26} {c.trend === 'up' ? '\u2191' : '\u2193'}
                </AppText>
                <AppText variant="small" color={Colors.textSecondary} style={{flex: 1}}>{c.sep19}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* 5. Amber Insight */}
        <View style={st.section}>
          <View style={[st.insightBox, {backgroundColor: Colors.amberBg}]}>
            <Icon family="Ionicons" name="calendar-outline" size={ms(16)} color={Colors.amberText} />
            <AppText variant="small" color={Colors.amberText} style={{flex: 1, marginLeft: s(6)}}>
              Next steps for Apr 4: CBC with reticulocyte count, recheck serum B12, homocysteine, ferritin levels. Discuss sublingual B12 vs intramuscular injections. Plan annual B12 monitoring while on Metformin. Review neurological symptoms and fatigue score.
            </AppText>
          </View>
        </View>
      </View>
    );
  };

  /* ── render active panel ── */
  return (
    <View style={st.container}>
      {activePanel === 'labs' && renderLabsPanel()}
      {activePanel === 'diet' && renderDietPanel()}
      {activePanel === 'supp' && renderSuppPanel()}
      {activePanel === 'history' && renderHistoryPanel()}
    </View>
  );
};

/* ───────── styles ───────── */

const st = StyleSheet.create({
  container: {
    flex: 1,
  },
  section: {
    marginTop: vs(16),
  },
  card: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(14),
    backgroundColor: Colors.white,
    marginTop: vs(8),
  },
  labGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  labCell: {
    width: '50%',
    paddingVertical: vs(8),
    paddingHorizontal: s(6),
  },
  statusBadge: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  mcvRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: s(10),
    borderRadius: ms(10),
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    marginTop: vs(8),
  },
  causeRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: vs(8),
  },
  tagWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  tag: {
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    borderRadius: ms(16),
    marginRight: s(6),
    marginBottom: vs(6),
  },
  insightBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: ms(12),
    borderRadius: ms(12),
  },
  twoCol: {
    flexDirection: 'row',
  },
  absRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(8),
    paddingVertical: vs(5),
    borderRadius: ms(8),
    marginBottom: vs(4),
  },
  timelineRow: {
    flexDirection: 'row',
    marginBottom: vs(4),
    minHeight: vs(44),
  },
  timelineLeft: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    width: s(80),
    paddingTop: vs(4),
  },
  timelineDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    marginLeft: s(6),
    marginTop: vs(2),
  },
  timelineLine: {
    position: 'absolute',
    left: s(68),
    top: vs(16),
    bottom: vs(-4),
    width: 1,
    backgroundColor: '#d1d5db',
  },
  timelineContent: {
    flex: 1,
    marginLeft: s(8),
    paddingVertical: vs(6),
    paddingHorizontal: s(10),
    borderRadius: ms(10),
  },
  suppRow: {
    flexDirection: 'row',
    paddingVertical: vs(10),
  },
  suppIconWrap: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  suppHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  tableRow: {
    flexDirection: 'row',
    paddingVertical: vs(6),
    paddingHorizontal: s(6),
    borderRadius: ms(4),
  },
  tableCell: {
    flex: 1,
  },
  milestoneRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  compRow: {
    flexDirection: 'row',
    paddingVertical: vs(6),
    paddingHorizontal: s(6),
    borderRadius: ms(4),
  },
});

export default AnemiaAutoView;
