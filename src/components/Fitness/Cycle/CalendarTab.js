import React, {useState, useMemo, useCallback} from 'react';
import {View, Text, StyleSheet, ScrollView, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {CURRENT_CYCLE_DAY} from '../../../constants/cycleData';

/* ── constants ──────────────────────────────────────── */

const DOW = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// March 2026 cycle data (cycle started Mar 3)
const PERIOD_DAYS = [3, 4, 5, 6, 7];
const FERTILE_DAYS = [17, 18, 19, 20, 21, 22];
const OVULATION_DAY = 20;
const LUTEAL_START = 22;
const TODAY_DATE = 26;

// Symptom dots per day (colored dots below date)
const SYMPTOM_DOTS = {
  1: ['#E24B4A'], 2: ['#E24B4A'], 3: ['#E24B4A','#7b2fbe'], 4: ['#E24B4A','#7b2fbe'],
  5: ['#E24B4A'], 6: ['#E24B4A'], 7: ['#E24B4A'],
  11: ['#1D9E75'], 15: ['#E24B4A'], 16: ['#1D9E75'],
  24: ['#7b2fbe','#BA7517'], 25: ['#7b2fbe'], 27: ['#7b2fbe'],
};

// Heatmap intensity per day (0-3)
const HEATMAP = {
  1:3,2:2,3:2,4:1,5:1,10:1,11:1,15:3,24:2,25:2,27:2,
};

const LEGEND = [
  {label: 'Period', color: 'rgba(176,40,120,0.35)'},
  {label: 'Fertile', color: 'rgba(29,158,117,0.25)'},
  {label: 'Ovulation', color: 'rgba(29,158,117,0.5)'},
  {label: 'Luteal', color: 'rgba(107,26,78,0.15)'},
  {label: 'Predicted', color: 'rgba(176,40,120,0.08)'},
];

const HEATMAP_COLORS = [
  'rgba(176,40,120,0.06)',
  'rgba(176,40,120,0.15)',
  'rgba(176,40,120,0.35)',
  'rgba(176,40,120,0.65)',
];

/* ── helpers ─────────────────────────────────────────── */

const daysInMonth = (m, y) => new Date(y, m + 1, 0).getDate();
const firstDow = (m, y) => new Date(y, m, 1).getDay();

const phaseFor = (day) => {
  if (PERIOD_DAYS.includes(day)) return 'period';
  if (day === OVULATION_DAY) return 'ovulation';
  if (FERTILE_DAYS.includes(day)) return 'fertile';
  if (day >= LUTEAL_START) return 'luteal';
  if (day >= 8 && day <= 15) return 'follicular';
  return null;
};

const cellBg = (day) => {
  const p = phaseFor(day);
  switch (p) {
    case 'period': return 'rgba(176,40,120,0.18)';
    case 'ovulation': return 'rgba(29,158,117,0.35)';
    case 'fertile': return 'rgba(29,158,117,0.12)';
    case 'luteal': return 'rgba(107,26,78,0.08)';
    default: return 'transparent';
  }
};

const phaseLabel = (p) => {
  switch (p) {
    case 'period': return 'Menstruation';
    case 'follicular': return 'Follicular phase';
    case 'fertile': return 'Fertile window';
    case 'ovulation': return 'Ovulation day';
    case 'luteal': return 'Luteal phase';
    default: return '';
  }
};

const phaseDesc = (p, day) => {
  switch (p) {
    case 'period': return 'Menstruation. Flow: Moderate. Cramps: Mild. Paracetamol taken. Continue Metformin if eating normally.';
    case 'follicular': return 'Estrogen rising. Good energy. Glucose sensitivity improving.';
    case 'fertile': return 'Fertile window. Egg-white cervical mucus. BBT normal. Peak fertility window.';
    case 'ovulation': return 'Ovulation. Slight left-sided cramp (Mittelschmerz). BBT 36.8\u00B0C (+0.2\u00B0C). Highest fertility today.';
    case 'luteal': return 'Luteal phase. Progesterone rising. Slight fatigue. Monitor glucose (may be mildly elevated).';
    default: return 'No data logged for this day.';
  }
};

/* ── Calendar Grid ──────────────────────────────────── */

const CalendarGrid = ({month, year, selectedDay, onSelect}) => {
  const dim = daysInMonth(month, year);
  const first = firstDow(month, year);
  const isMarch = month === 2 && year === 2026;

  const cells = useMemo(() => {
    const arr = [];
    for (let i = 0; i < first; i++) arr.push({key: `b${i}`, day: 0});
    for (let d = 1; d <= dim; d++) arr.push({key: `d${d}`, day: d});
    return arr;
  }, [dim, first]);

  return (
    <View style={st.grid}>
      {cells.map((c) => {
        if (c.day === 0) return <View key={c.key} style={st.cellEmpty} />;

        const d = c.day;
        const isToday = isMarch && d === TODAY_DATE;
        const isSel = d === selectedDay;
        const bg = isMarch ? cellBg(d) : 'transparent';
        const dots = isMarch ? (SYMPTOM_DOTS[d] || []) : [];
        const isPeriod = isMarch && PERIOD_DAYS.includes(d);
        const isOv = isMarch && d === OVULATION_DAY;

        return (
          <TouchableOpacity
            key={c.key}
            activeOpacity={0.6}
            onPress={() => onSelect(d)}
            style={st.cell}>
            {/* Cell bg circle */}
            <View style={[
              st.cellCircle,
              {backgroundColor: isToday ? '#6b1a4e' : bg},
              isSel && !isToday && st.cellSelected,
              isOv && st.cellOvulation,
            ]}>
              <Text style={[
                st.cellText,
                isToday && st.cellTextToday,
                isPeriod && st.cellTextPeriod,
                isOv && st.cellTextOv,
                (isSel && !isToday) && {color: Colors.primary},
              ]}>
                {d}
              </Text>
            </View>
            {/* Symptom dots */}
            {dots.length > 0 && (
              <View style={st.dotRow}>
                {dots.map((col, i) => (
                  <View key={i} style={[st.dot, {backgroundColor: col}]} />
                ))}
              </View>
            )}
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

/* ── Heatmap ─────────────────────────────────────────── */

const HeatmapStrip = ({month, year}) => {
  const dim = daysInMonth(month, year);
  return (
    <View style={st.heatmapRow}>
      {Array.from({length: dim}).map((_, i) => {
        const d = i + 1;
        const v = HEATMAP[d] || 0;
        return (
          <View key={d} style={[st.heatmapBox, {backgroundColor: HEATMAP_COLORS[v]}]} />
        );
      })}
    </View>
  );
};

/* ── Main ────────────────────────────────────────────── */

const CalendarTab = () => {
  const [month, setMonth] = useState(2);
  const [year, setYear] = useState(2026);
  const [selectedDay, setSelectedDay] = useState(null);

  const prevMonth = useCallback(() => {
    if (month === 0) { setMonth(11); setYear(y => y - 1); }
    else setMonth(m => m - 1);
    setSelectedDay(null);
  }, [month]);

  const nextMonth = useCallback(() => {
    if (month === 11) { setMonth(0); setYear(y => y + 1); }
    else setMonth(m => m + 1);
    setSelectedDay(null);
  }, [month]);

  const isMarch = month === 2 && year === 2026;
  const selPhase = selectedDay && isMarch ? phaseFor(selectedDay) : null;

  return (
    <ScrollView style={st.scroll} showsVerticalScrollIndicator={false}>

      {/* Month nav */}
      <View style={st.monthNav}>
        <TouchableOpacity onPress={prevMonth} style={st.navBtn} activeOpacity={0.6}>
          <Text style={st.navArrow}>{'\u2039'}</Text>
        </TouchableOpacity>
        <Text style={st.monthTitle}>{MONTHS[month]} {year}</Text>
        <TouchableOpacity onPress={nextMonth} style={st.navBtn} activeOpacity={0.6}>
          <Text style={st.navArrow}>{'\u203A'}</Text>
        </TouchableOpacity>
      </View>

      {/* Day-of-week header */}
      <View style={st.dowRow}>
        {DOW.map((d) => (
          <View key={d} style={st.dowCell}>
            <Text style={st.dowText}>{d}</Text>
          </View>
        ))}
      </View>

      {/* Calendar grid */}
      <CalendarGrid
        month={month}
        year={year}
        selectedDay={selectedDay}
        onSelect={setSelectedDay}
      />

      {/* Legend */}
      <View style={st.legendRow}>
        {LEGEND.map((l) => (
          <View key={l.label} style={st.legendItem}>
            <View style={[st.legendDot, {backgroundColor: l.color}]} />
            <Text style={st.legendText}>{l.label}</Text>
          </View>
        ))}
      </View>

      {/* Symptom intensity heatmap */}
      <View style={st.section}>
        <Text style={st.sectionLabel}>SYMPTOM INTENSITY {'\u00B7'} THIS MONTH</Text>
        <HeatmapStrip month={month} year={year} />
      </View>

      {/* Day detail / Tap prompt */}
      <View style={st.detailCard}>
        {selectedDay && isMarch ? (
          <>
            <Text style={st.detailTitle}>
              {MONTHS[month]} {selectedDay}, {year}
            </Text>
            {selPhase && (
              <View style={[st.phaseBadge, {backgroundColor: selPhase === 'period' ? Colors.redBg : selPhase === 'luteal' ? Colors.purpleBg : Colors.tealBg}]}>
                <Text style={[st.phaseBadgeText, {color: selPhase === 'period' ? Colors.redText : selPhase === 'luteal' ? Colors.purpleText : Colors.tealText}]}>
                  {phaseLabel(selPhase)}
                </Text>
              </View>
            )}
            <Text style={st.detailBody}>
              {phaseDesc(selPhase, selectedDay)}
            </Text>
          </>
        ) : (
          <>
            <Text style={st.detailTitle}>Tap a date to see details</Text>
            <Text style={st.detailBody}>
              Select any date to view logged symptoms, hormonal phase, and health context.
            </Text>
          </>
        )}
      </View>

      {/* March at a glance */}
      <View style={st.summaryCard}>
        <Text style={st.summaryIco}>{'\uD83D\uDCC5'}</Text>
        <Text style={st.summaryText}>
          <Text style={{fontWeight: '700'}}>March at a glance: </Text>
          Period Mar 1{'\u2013'}5 (5 days, moderate) {'\u00B7'} Fertile Mar 17{'\u2013'}22 {'\u00B7'} Ovulation Mar 20 {'\u00B7'} Day 24 now (late luteal) {'\u00B7'} Next period Apr 3 {'\u00B7'} Migraine logged Mar 15 (pre-period window) {'\u00B7'} PMS symptoms expected Mar 25{'\u2013'}29.
        </Text>
      </View>

      <View style={{height: vs(80)}} />
    </ScrollView>
  );
};

/* ── styles ──────────────────────────────────────────── */

const st = StyleSheet.create({
  scroll: {flex: 1},

  /* Month nav */
  monthNav: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  navBtn: {
    width: ms(30),
    height: ms(30),
    justifyContent: 'center',
    alignItems: 'center',
  },
  navArrow: {
    fontSize: ms(22),
    color: '#b02878',
    fontWeight: '300',
  },
  monthTitle: {
    fontSize: ms(16),
    fontWeight: '700',
    color: Colors.textPrimary,
  },

  /* DOW header */
  dowRow: {
    flexDirection: 'row',
    paddingHorizontal: s(16),
    paddingTop: vs(8),
    paddingBottom: vs(4),
    backgroundColor: Colors.white,
  },
  dowCell: {
    flex: 1,
    alignItems: 'center',
  },
  dowText: {
    fontSize: ms(9),
    fontWeight: '700',
    color: '#bbb',
    letterSpacing: 0.5,
  },

  /* Grid */
  grid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: s(10),
    backgroundColor: Colors.white,
    paddingBottom: vs(6),
  },
  cellEmpty: {
    width: '14.285%',
    height: vs(52),
  },
  cell: {
    width: '14.285%',
    height: vs(52),
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: vs(2),
  },
  cellCircle: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    justifyContent: 'center',
    alignItems: 'center',
  },
  cellSelected: {
    borderWidth: 1.5,
    borderColor: '#b02878',
  },
  cellOvulation: {
    borderWidth: 2,
    borderColor: '#1D9E75',
  },
  cellText: {
    fontSize: ms(12),
    fontWeight: '500',
    color: '#555',
  },
  cellTextToday: {
    color: Colors.white,
    fontWeight: '700',
  },
  cellTextPeriod: {
    color: '#b02878',
    fontWeight: '700',
  },
  cellTextOv: {
    color: '#085041',
    fontWeight: '700',
  },
  dotRow: {
    flexDirection: 'row',
    gap: ms(2),
    marginTop: vs(1),
  },
  dot: {
    width: ms(4),
    height: ms(4),
    borderRadius: ms(2),
  },

  /* Legend */
  legendRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: s(8),
    paddingVertical: vs(10),
    paddingHorizontal: s(16),
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  legendItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(4),
  },
  legendDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
  },
  legendText: {
    fontSize: ms(9),
    color: '#888',
  },

  /* Section */
  section: {
    paddingHorizontal: s(16),
    marginTop: vs(16),
  },
  sectionLabel: {
    fontSize: ms(9),
    fontWeight: '700',
    letterSpacing: 0.8,
    color: '#888',
    marginBottom: vs(8),
  },

  /* Heatmap */
  heatmapRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(3),
  },
  heatmapBox: {
    width: ms(11),
    height: ms(11),
    borderRadius: ms(2),
  },

  /* Detail card */
  detailCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    padding: s(14),
    marginHorizontal: s(16),
    marginTop: vs(14),
  },
  detailTitle: {
    fontSize: ms(14),
    fontWeight: '700',
    color: Colors.textPrimary,
  },
  phaseBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(10),
    marginTop: vs(6),
  },
  phaseBadgeText: {
    fontSize: ms(10),
    fontWeight: '600',
  },
  detailBody: {
    fontSize: ms(12),
    color: '#555',
    lineHeight: ms(19),
    marginTop: vs(8),
  },

  /* Summary */
  summaryCard: {
    flexDirection: 'row',
    backgroundColor: '#FEF0F6',
    borderRadius: ms(12),
    padding: s(12),
    marginHorizontal: s(16),
    marginTop: vs(12),
    alignItems: 'flex-start',
  },
  summaryIco: {
    fontSize: ms(16),
    marginRight: s(8),
    marginTop: vs(2),
  },
  summaryText: {
    flex: 1,
    fontSize: ms(11),
    color: '#6B0032',
    lineHeight: ms(18),
  },
});

export default CalendarTab;
