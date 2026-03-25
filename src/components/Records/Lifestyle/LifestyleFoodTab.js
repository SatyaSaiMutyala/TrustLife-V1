import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const backgroundSecondary = '#F3F4F6';
const borderTertiary = '#d1d5db';

/* ─── Static data ─── */
const CALENDAR_DAYS = [
  {day: 'Mon', date: 20, active: false},
  {day: 'Tue', date: 21, active: false},
  {day: 'Wed', date: 22, active: false},
  {day: 'Thu', date: 23, active: false},
  {day: 'Fri', date: 24, active: true},
];

const MONTHS = [
  {label: 'Jan', active: false},
  {label: 'Feb', active: false},
  {label: 'Mar', active: true},
];

const DAILY_STATS = [
  {label: 'kcal', value: '1,420', bg: Colors.amberBg, color: Colors.amberText},
  {label: 'Avg GI', value: '58', bg: Colors.redBg, color: Colors.redText},
  {label: 'Fibre', value: '42g', bg: Colors.tealBg, color: Colors.tealText},
  {label: 'Meals', value: '2/3', bg: Colors.amberBg, color: Colors.amberText},
];

const MONTHLY_STATS = [
  {label: 'Meals logged', value: '61%', bg: Colors.amberBg, color: Colors.amberText},
  {label: 'Avg GI', value: '58', bg: Colors.redBg, color: Colors.redText},
  {label: 'Avg kcal', value: '1,380', bg: Colors.amberBg, color: Colors.amberText},
  {label: 'Avg fibre', value: '38g', bg: Colors.tealBg, color: Colors.tealText},
];

const BREAKFAST_ITEMS = [
  {name: 'Rolled oats 60g', dotColor: Colors.teal, pill: 'Low GI', pillBg: Colors.tealBg, pillColor: Colors.tealText},
  {name: 'Banana 1 medium', dotColor: Colors.teal, pill: 'Good', pillBg: Colors.tealBg, pillColor: Colors.tealText},
  {name: 'Skimmed milk 200ml', dotColor: Colors.teal, pill: 'Good', pillBg: Colors.tealBg, pillColor: Colors.tealText},
];

const BREAKFAST_NUTRIENTS = [
  {label: 'kcal', value: '380'},
  {label: 'Protein', value: '12g'},
  {label: 'Fibre', value: '8g'},
  {label: 'Sodium', value: '0.4g'},
];

const LUNCH_ITEMS = [
  {name: 'Moong dal 1 bowl', dotColor: Colors.teal, pill: 'Excellent', pillBg: Colors.tealBg, pillColor: Colors.tealText},
  {name: 'Whole wheat roti \u00D72', dotColor: Colors.amber, pill: 'Moderate', pillBg: Colors.amberBg, pillColor: Colors.amberText},
  {name: 'Aloo gobi sabzi', dotColor: Colors.amber, pill: 'Moderate', pillBg: Colors.amberBg, pillColor: Colors.amberText},
];

const LUNCH_NUTRIENTS = [
  {label: 'kcal', value: '620'},
  {label: 'Protein', value: '18g'},
  {label: 'Fibre', value: '6g'},
  {label: 'Sodium', value: '0.9g'},
];

const FOOD_RULES = [
  {label: 'Fenugreek seeds before meals', done: true, status: 'Done', statusColor: Colors.tealText},
  {label: 'Sodium under 2g', done: true, status: '1.3g \u00B7 On track', statusColor: Colors.tealText},
  {label: 'No fruit juice', done: true, status: 'Good', statusColor: Colors.tealText},
];

const HIGH_GI_FOODS = [
  {name: 'White rice', count: '8\u00D7', pillBg: Colors.redBg, pillColor: Colors.redText},
  {name: 'Maida snacks', count: '4\u00D7', pillBg: Colors.amberBg, pillColor: Colors.amberText},
  {name: 'Fruit juice', count: '2\u00D7', pillBg: Colors.redBg, pillColor: Colors.redText},
];

const MONTHLY_NUTRITION = [
  {label: 'Calories', value: '1,380 avg', target: '1,500', pct: 92, color: Colors.teal},
  {label: 'Fibre', value: '38g avg', target: '45g', pct: 84, color: Colors.amber},
  {label: 'Sodium', value: '1.3g avg', target: '<2g', pct: 65, color: Colors.teal},
  {label: 'Protein', value: '52g avg', target: '60g', pct: 87, color: Colors.amber},
];

// GI heatmap: 31 days of March (null = no data/not logged, or future)
// Each entry: {day, color} where color matches HTML exactly
const GI_HEATMAP = [
  // Row 1: starts on Saturday (Mar 1 = Sat in 2026)
  {day: null}, {day: null}, {day: null}, {day: null}, {day: null}, {day: null}, {day: 1, color: 'grey'},
  // Row 2
  {day: 2, color: 'amber'}, {day: 3, color: 'green'}, {day: 4, color: 'green'}, {day: 5, color: 'green'}, {day: 6, color: 'amber'}, {day: 7, color: 'amber'},
  // Row 3 (no empty start)
  {day: 8, color: 'red'}, {day: 9, color: 'amber'}, {day: 10, color: 'green'}, {day: 11, color: 'green'}, {day: 12, color: 'green'}, {day: 13, color: 'grey'}, {day: 14, color: 'grey'},
  // Row 4
  {day: 15, color: 'amber'}, {day: 16, color: 'amber'}, {day: 17, color: 'red'}, {day: 18, color: 'green'}, {day: 19, color: 'grey'}, {day: 20, color: 'amber'}, {day: 21, color: 'green'},
  // Row 5
  {day: 22, color: 'green'}, {day: 23, color: 'amber'}, {day: 24, color: 'red'},
  // Future days not shown
];

/* ─── Shared sub-components ─── */

const ToggleBar = ({view, setView, dateLabel, monthLabel}) => (
  <View style={sty.toggleWrap}>
    <View style={sty.toggleRow}>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[sty.toggleBtn, view === 'daily' && sty.toggleActive]}
        onPress={() => setView('daily')}>
        <AppText
          variant="caption"
          color={view === 'daily' ? Colors.white : Colors.textSecondary}>
          Daily
        </AppText>
      </TouchableOpacity>
      <TouchableOpacity
        activeOpacity={0.7}
        style={[sty.toggleBtn, view === 'monthly' && sty.toggleActive]}
        onPress={() => setView('monthly')}>
        <AppText
          variant="caption"
          color={view === 'monthly' ? Colors.white : Colors.textSecondary}>
          Monthly
        </AppText>
      </TouchableOpacity>
    </View>
    <View style={sty.dateNav}>
      <TouchableOpacity activeOpacity={0.6} style={sty.arrowBtn}>
        <Icon family="Ionicons" name="chevron-back" size={ms(16)} color={Colors.textSecondary} />
      </TouchableOpacity>
      <AppText variant="bodyBold" color={Colors.textPrimary}>
        {view === 'daily' ? dateLabel : monthLabel}
      </AppText>
      <TouchableOpacity activeOpacity={0.6} style={sty.arrowBtn}>
        <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color={Colors.textSecondary} />
      </TouchableOpacity>
    </View>
  </View>
);

const CalendarStrip = () => (
  <View style={sty.calStrip}>
    {CALENDAR_DAYS.map((d, i) => (
      <TouchableOpacity
        key={i}
        activeOpacity={0.7}
        style={[sty.calDay, d.active && sty.calDayActive]}>
        <AppText variant="small" color={d.active ? Colors.white : Colors.textTertiary}>
          {d.day}
        </AppText>
        <AppText
          variant="bodyBold"
          color={d.active ? Colors.white : Colors.textPrimary}
          style={{marginTop: vs(2)}}>
          {d.date}
        </AppText>
      </TouchableOpacity>
    ))}
  </View>
);

const StatsRow = ({stats}) => (
  <View style={sty.statsRow}>
    {stats.map((st, i) => (
      <View key={i} style={[sty.statCell, {backgroundColor: st.bg}]}>
        <AppText variant="bodyBold" color={st.color}>{st.value}</AppText>
        <AppText variant="small" color={st.color} style={{marginTop: vs(1)}}>{st.label}</AppText>
      </View>
    ))}
  </View>
);

const MonthStrip = () => (
  <View style={sty.monthStrip}>
    {MONTHS.map((m, i) => (
      <TouchableOpacity
        key={i}
        activeOpacity={0.7}
        style={[sty.monthBtn, m.active && sty.monthBtnActive]}>
        <AppText
          variant="caption"
          color={m.active ? Colors.white : Colors.textSecondary}>
          {m.label}
        </AppText>
      </TouchableOpacity>
    ))}
    <AppText variant="small" color={Colors.textTertiary} style={{marginLeft: s(8)}}>
      2026
    </AppText>
  </View>
);

const InsightCard = ({text, bg, color, iconColor}) => (
  <View style={[sty.insightCard, {backgroundColor: bg}]}>
    <Icon family="Ionicons" name="bulb-outline" size={ms(16)} color={iconColor} />
    <AppText variant="small" color={color} style={{flex: 1, marginLeft: s(8)}}>
      {text}
    </AppText>
  </View>
);

/* ─── Daily View ─── */

const GIGaugeCard = () => (
  <View style={sty.card}>
    <AppText variant="caption" color={Colors.textSecondary} style={sty.cardPad}>
      Glycaemic index score \u00B7 Today
    </AppText>
    <View style={sty.cardPad}>
      <View style={sty.gaugeBar}>
        <View style={[sty.gaugeSegment, {flex: 1, backgroundColor: Colors.teal, borderTopLeftRadius: ms(4), borderBottomLeftRadius: ms(4)}]} />
        <View style={[sty.gaugeSegment, {flex: 1, backgroundColor: Colors.amber}]} />
        <View style={[sty.gaugeSegment, {flex: 1, backgroundColor: Colors.red, borderTopRightRadius: ms(4), borderBottomRightRadius: ms(4)}]} />
      </View>
      <View style={[sty.gaugeMarker, {left: '58%'}]}>
        <View style={sty.gaugeMarkerDot} />
      </View>
      <View style={sty.gaugeLabels}>
        <AppText variant="small" color={Colors.tealText}>Low</AppText>
        <AppText variant="small" color={Colors.amberText}>Medium</AppText>
        <AppText variant="small" color={Colors.redText}>High</AppText>
      </View>
    </View>
    <View style={[sty.cardPad, {alignItems: 'center', paddingBottom: vs(12)}]}>
      <AppText variant="header" color={Colors.redText}>GI 58</AppText>
    </View>
  </View>
);

const MealItemRow = ({item}) => (
  <View style={sty.mealItemRow}>
    <View style={[sty.dot, {backgroundColor: item.dotColor}]} />
    <AppText variant="body" color={Colors.textPrimary} style={{flex: 1}}>
      {item.name}
    </AppText>
    <View style={[sty.pill, {backgroundColor: item.pillBg}]}>
      <AppText variant="small" color={item.pillColor}>{item.pill}</AppText>
    </View>
  </View>
);

const NutrientsGrid = ({nutrients}) => (
  <View style={sty.nutrientsGrid}>
    {nutrients.map((n, i) => (
      <View key={i} style={sty.nutrientCell}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>{n.value}</AppText>
        <AppText variant="small" color={Colors.textSecondary}>{n.label}</AppText>
      </View>
    ))}
  </View>
);

const MealCard = ({title, time, kcal, gi, iconName, iconBg, items, nutrients}) => (
  <View style={sty.card}>
    <View style={sty.mealHeader}>
      <View style={[sty.mealIcon, {backgroundColor: iconBg}]}>
        <Icon family="Ionicons" name={iconName} size={ms(16)} color={Colors.textPrimary} />
      </View>
      <View style={{flex: 1, marginLeft: s(10)}}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>{title}</AppText>
        <AppText variant="small" color={Colors.textSecondary}>
          {time} \u00B7 {kcal} kcal \u00B7 GI {gi}
        </AppText>
      </View>
    </View>
    {items.map((item, i) => (
      <MealItemRow key={i} item={item} />
    ))}
    <NutrientsGrid nutrients={nutrients} />
  </View>
);

const DinnerCard = () => (
  <View style={sty.dinnerCard}>
    <View style={sty.mealHeader}>
      <View style={[sty.mealIcon, {backgroundColor: backgroundSecondary}]}>
        <Icon family="Ionicons" name="moon-outline" size={ms(16)} color={Colors.textTertiary} />
      </View>
      <View style={{flex: 1, marginLeft: s(10)}}>
        <AppText variant="bodyBold" color={Colors.textTertiary}>Dinner</AppText>
        <AppText variant="small" color={Colors.textTertiary}>Not logged yet</AppText>
      </View>
      <TouchableOpacity activeOpacity={0.7} style={sty.logPill}>
        <AppText variant="caption" color={Colors.tealText}>+ Log</AppText>
      </TouchableOpacity>
    </View>
  </View>
);

const FoodRulesCard = () => (
  <View style={sty.card}>
    <AppText variant="bodyBold" color={Colors.textPrimary} style={sty.cardPad}>
      Condition food rules
    </AppText>
    {FOOD_RULES.map((rule, i) => (
      <View
        key={i}
        style={[sty.ruleRow, i < FOOD_RULES.length - 1 && sty.rowBorder]}>
        <Icon
          family="Ionicons"
          name={rule.done ? 'checkmark-circle' : 'close-circle'}
          size={ms(18)}
          color={rule.done ? Colors.teal : Colors.red}
        />
        <AppText variant="body" color={Colors.textPrimary} style={{flex: 1, marginLeft: s(8)}}>
          {rule.label}
        </AppText>
        <AppText variant="small" color={rule.statusColor}>{rule.status}</AppText>
      </View>
    ))}
  </View>
);

const DailyView = () => (
  <View>
    <StatsRow stats={DAILY_STATS} />
    <GIGaugeCard />

    <AppText variant="bodyBold" color={Colors.textPrimary} style={sty.sectionTitle}>
      Meals logged today
    </AppText>

    <MealCard
      title="Breakfast"
      time="7:45 AM"
      kcal="380"
      gi="42"
      iconName="cafe-outline"
      iconBg={Colors.amberBg}
      items={BREAKFAST_ITEMS}
      nutrients={BREAKFAST_NUTRIENTS}
    />
    <MealCard
      title="Lunch"
      time="1:10 PM"
      kcal="620"
      gi="55"
      iconName="restaurant-outline"
      iconBg={Colors.tealBg}
      items={LUNCH_ITEMS}
      nutrients={LUNCH_NUTRIENTS}
    />
    <DinnerCard />
    <FoodRulesCard />

    <InsightCard
      text="Replacing aloo gobi with palak paneer could lower your lunch GI by ~10 points and add iron + calcium to your meal."
      bg={Colors.amberBg}
      color={Colors.amberText}
      iconColor={Colors.amber}
    />
  </View>
);

/* ─── Monthly View ─── */

const HeatmapGrid = () => {
  const colorMap = {
    green: '#1D9E75',
    amber: '#BA7517',
    red: '#E24B4A',
    grey: '#E8E8E8',
  };
  return (
    <View style={sty.card}>
      <View style={sty.cardHeader}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>
          Daily GI score {'\u00B7'} March 2026
        </AppText>
        <AppText variant="small" color={Colors.textTertiary}>
          Green = low GI {'\u00B7'} Red = high GI
        </AppText>
      </View>
      <View style={sty.cardPad}>
        <View style={sty.heatmapGrid}>
          {GI_HEATMAP.map((item, i) => {
            if (!item.day) {
              return <View key={i} style={sty.heatCellEmpty} />;
            }
            const bg = item.color ? colorMap[item.color] : colorMap.grey;
            const isGrey = item.color === 'grey';
            return (
              <View key={i} style={[sty.heatCell, {backgroundColor: bg}]}>
                <Text style={[sty.heatCellText, {color: isGrey ? Colors.textTertiary : '#fff'}]}>
                  {item.day}
                </Text>
              </View>
            );
          })}
        </View>
        <View style={sty.heatLegend}>
          {[
            {label: '<50 Low', color: '#1D9E75'},
            {label: '50\u201365 Medium', color: '#BA7517'},
            {label: '>65 High', color: '#E24B4A'},
            {label: 'Not logged', color: '#E8E8E8'},
          ].map((l, i) => (
            <View key={i} style={sty.legendItem}>
              <View style={[sty.legendDot, {backgroundColor: l.color}]} />
              <AppText variant="small" color={Colors.textSecondary}>{l.label}</AppText>
            </View>
          ))}
        </View>
      </View>
    </View>
  );
};

const HighGICard = () => (
  <View style={sty.card}>
    <AppText variant="bodyBold" color={Colors.textPrimary} style={sty.cardPad}>
      High-GI foods this month
    </AppText>
    {HIGH_GI_FOODS.map((f, i) => (
      <View
        key={i}
        style={[sty.highGIRow, i < HIGH_GI_FOODS.length - 1 && sty.rowBorder]}>
        <AppText variant="body" color={Colors.textPrimary} style={{flex: 1}}>
          {f.name}
        </AppText>
        <View style={[sty.pill, {backgroundColor: f.pillBg}]}>
          <AppText variant="small" color={f.pillColor}>{f.count}</AppText>
        </View>
      </View>
    ))}
  </View>
);

const MonthlyNutritionCard = () => (
  <View style={sty.card}>
    <AppText variant="bodyBold" color={Colors.textPrimary} style={sty.cardPad}>
      Monthly nutrition adequacy
    </AppText>
    {MONTHLY_NUTRITION.map((n, i) => (
      <View
        key={i}
        style={[sty.nutritionRow, i < MONTHLY_NUTRITION.length - 1 && sty.rowBorder]}>
        <View style={sty.nutritionLabel}>
          <AppText variant="body" color={Colors.textPrimary}>{n.label}</AppText>
          <AppText variant="small" color={Colors.textSecondary}>
            {n.value} / {n.target}
          </AppText>
        </View>
        <View style={sty.nutritionBarBg}>
          <View
            style={[
              sty.nutritionBarFill,
              {width: `${n.pct}%`, backgroundColor: n.color},
            ]}
          />
        </View>
      </View>
    ))}
  </View>
);

const MonthlyView = () => (
  <View>
    <MonthStrip />
    <StatsRow stats={MONTHLY_STATS} />
    <HeatmapGrid />
    <HighGICard />
    <MonthlyNutritionCard />

    <InsightCard
      text="White rice appeared 8 times this month and correlates with your highest post-meal glucose spikes. Consider switching to brown rice or millets."
      bg={Colors.amberBg}
      color={Colors.amberText}
      iconColor={Colors.amber}
    />
  </View>
);

/* ─── Main Component ─── */

const LifestyleFoodTab = () => {
  const [view, setView] = useState('daily');

  return (
    <ScrollView
      style={sty.container}
      contentContainerStyle={sty.content}
      showsVerticalScrollIndicator={false}>
      <ToggleBar
        view={view}
        setView={setView}
        dateLabel="24 Mar 2026"
        monthLabel="Mar 2026"
      />
      {view === 'daily' && <CalendarStrip />}
      {view === 'daily' ? <DailyView /> : <MonthlyView />}
    </ScrollView>
  );
};

/* ─── Styles ─── */

const sty = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  content: {paddingHorizontal: s(15), paddingBottom: vs(32)},

  /* Toggle */
  toggleWrap: {marginBottom: vs(12)},
  toggleRow: {
    flexDirection: 'row',
    backgroundColor: backgroundSecondary,
    borderRadius: ms(10),
    padding: ms(3),
    marginBottom: vs(10),
  },
  toggleBtn: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(7),
    borderRadius: ms(8),
  },
  toggleActive: {backgroundColor: Colors.primary},
  dateNav: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: s(12),
  },
  arrowBtn: {padding: ms(4)},

  /* Calendar strip */
  calStrip: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(14),
  },
  calDay: {
    alignItems: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: s(12),
    borderRadius: ms(12),
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: borderTertiary,
  },
  calDayActive: {backgroundColor: Colors.primary, borderColor: Colors.primary},

  /* Month strip */
  monthStrip: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(12),
  },
  monthBtn: {
    paddingVertical: vs(6),
    paddingHorizontal: s(14),
    borderRadius: ms(8),
    backgroundColor: backgroundSecondary,
    marginRight: s(6),
  },
  monthBtnActive: {backgroundColor: Colors.primary},

  /* Stats row */
  statsRow: {
    flexDirection: 'row',
    gap: 1,
    marginBottom: vs(12),
    borderRadius: ms(14),
    overflow: 'hidden',
  },
  statCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(10),
  },

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: borderTertiary,
    marginBottom: vs(12),
    overflow: 'hidden',
  },
  cardPad: {paddingHorizontal: s(14), paddingVertical: vs(10)},

  /* GI gauge */
  gaugeBar: {
    flexDirection: 'row',
    height: vs(10),
    borderRadius: ms(4),
    overflow: 'hidden',
    marginBottom: vs(4),
  },
  gaugeSegment: {},
  gaugeMarker: {
    position: 'absolute',
    top: vs(10),
    marginLeft: -ms(5),
  },
  gaugeMarkerDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    backgroundColor: Colors.textPrimary,
    borderWidth: 2,
    borderColor: Colors.white,
    marginTop: vs(26),
  },
  gaugeLabels: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(4),
  },

  /* Section title */
  sectionTitle: {marginBottom: vs(10), marginTop: vs(4)},

  /* Meal card */
  mealHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(14),
    paddingTop: vs(12),
    paddingBottom: vs(8),
  },
  mealIcon: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  mealItemRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(14),
    paddingVertical: vs(5),
    gap: s(8),
  },
  dot: {width: ms(7), height: ms(7), borderRadius: ms(4)},
  pill: {
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
    borderRadius: ms(6),
  },
  nutrientsGrid: {
    flexDirection: 'row',
    borderTopWidth: 0.5,
    borderTopColor: borderTertiary,
    marginTop: vs(8),
  },
  nutrientCell: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(10),
  },

  /* Dinner (unlogged) */
  dinnerCard: {
    borderRadius: ms(14),
    borderWidth: 1,
    borderColor: borderTertiary,
    borderStyle: 'dashed',
    marginBottom: vs(12),
    backgroundColor: Colors.white,
  },
  logPill: {
    paddingHorizontal: s(12),
    paddingVertical: vs(4),
    borderRadius: ms(8),
    backgroundColor: Colors.tealBg,
  },

  /* Rules */
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: borderTertiary,
  },

  /* Insight */
  insightCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    padding: ms(14),
    borderRadius: ms(14),
    marginBottom: vs(12),
  },

  /* Card header */
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(13),
    paddingVertical: vs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderTertiary,
  },

  /* Heatmap */
  heatmapGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(4),
    marginBottom: vs(10),
  },
  heatCell: {
    width: '13%',
    aspectRatio: 1,
    borderRadius: ms(6),
    alignItems: 'center',
    justifyContent: 'center',
    padding: 0,
  },
  heatCellEmpty: {
    width: '13%',
    aspectRatio: 1,
  },
  heatCellText: {
    fontSize: ms(11),
    fontWeight: '700',
    textAlign: 'center',
    includeFontPadding: false,
    textAlignVertical: 'center',
    lineHeight: ms(13),
  },
  heatLegend: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(12),
    paddingBottom: vs(6),
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  legendDot: {width: ms(8), height: ms(8), borderRadius: ms(4)},

  /* High GI */
  highGIRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
  },

  /* Monthly nutrition */
  nutritionRow: {
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
  },
  nutritionLabel: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: vs(6),
  },
  nutritionBarBg: {
    height: vs(6),
    backgroundColor: backgroundSecondary,
    borderRadius: ms(3),
    overflow: 'hidden',
  },
  nutritionBarFill: {
    height: '100%',
    borderRadius: ms(3),
  },
});

export default LifestyleFoodTab;
