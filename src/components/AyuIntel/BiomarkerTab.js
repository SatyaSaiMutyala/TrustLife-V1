import React, {useState, useMemo} from 'react';
import {View, StyleSheet, TouchableOpacity, ScrollView} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Circle} from 'react-native-svg';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';
import {BIOMARKERS} from '../../constants/ayuIntelData';

const STATUS_MAX = 40;
const STABILITY_MAX = 35;
const VELOCITY_MAX = 25;

const FILTERS = [
  {key: 'all', label: 'All (11)'},
  {key: 'abnormal', label: '\u26A0 Abnormal (6)'},
  {key: 'improving', label: '\u2191 Improving (3)'},
  {key: 'normal', label: '\u2713 Normal (5)'},
];

const hpsColor = hps => hps >= 85 ? '#16A34A' : hps >= 65 ? '#D97706' : '#DC2626';
const stripeColor = hps => hps >= 85 ? '#16A34A' : hps >= 65 ? '#D97706' : '#DC2626';

const statusPill = (val, lo, hi) => {
  if (lo === 0 && val > hi) return {label: 'High', bg: '#FEF2F2', color: '#DC2626'};
  if (val < lo) return {label: 'Low', bg: '#FEF3C7', color: '#D97706'};
  if (val > hi) return {label: 'High', bg: '#FEF2F2', color: '#DC2626'};
  return {label: 'Normal', bg: '#F0FDF4', color: '#16A34A'};
};

const dirPill = dir => {
  switch (dir) {
    case 'improving': return {label: '\u2191 Improving', bg: '#F0FDF4', color: '#16A34A'};
    case 'worsening': return {label: '\u2193 Worsening', bg: '#FEF2F2', color: '#DC2626'};
    default: return {label: '\u2194 Stable', bg: '#F1F5F9', color: '#64748B'};
  }
};

const velPill = (sp, pct) => {
  const label = pct + '%/mo';
  switch (sp) {
    case 'fast': return {label, bg: '#FEF2F2', color: '#DC2626'};
    case 'medium': return {label, bg: '#FEF3C7', color: '#D97706'};
    default: return {label, bg: '#F0FDF4', color: '#16A34A'};
  }
};

const BM_ICONS = {
  hba1c: 'water-outline', fbg: 'sunny-outline', ldl: 'heart-outline',
  tg: 'flame-outline', hdl: 'shield-checkmark-outline', hb: 'fitness-outline',
  vitd: 'sunny-outline', b12: 'leaf-outline', tsh: 'body-outline',
  egfr: 'medical-outline', malb: 'beaker-outline',
};

const ScoreBox = ({label, value, max, labelColor, valueColor, fillColor}) => {
  const pct = Math.round((value / max) * 100);
  return (
    <View style={sty.scoreBox}>
      <AppText style={{fontSize: ms(8), fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, color: labelColor, marginBottom: vs(4)}}>
        {label}
      </AppText>
      <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
        <AppText style={{fontSize: ms(15), fontWeight: '700', color: valueColor, fontFamily: 'monospace'}}>{value}</AppText>
        <AppText style={{fontSize: ms(9), color: valueColor, opacity: 0.5}}>/{max}</AppText>
      </View>
      <View style={sty.scoreBarBg}>
        <View style={[sty.scoreBarFill, {width: `${pct}%`, backgroundColor: fillColor}]} />
      </View>
    </View>
  );
};

const BiomarkerTab = () => {
  const navigation = useNavigation();
  const [activeFilter, setActiveFilter] = useState('all');

  const hpsAvg = useMemo(() => Math.round(BIOMARKERS.reduce((a, b) => a + b.hps, 0) / BIOMARKERS.length), []);
  const statusAvg = useMemo(() => Math.round(BIOMARKERS.reduce((a, b) => a + b.st.s, 0) / BIOMARKERS.length), []);
  const stabilityAvg = useMemo(() => Math.round(BIOMARKERS.reduce((a, b) => a + b.stab.s, 0) / BIOMARKERS.length), []);
  const velocityAvg = useMemo(() => Math.round(BIOMARKERS.reduce((a, b) => a + b.vel.s, 0) / BIOMARKERS.length), []);

  const filtered = useMemo(() => {
    let list;
    switch (activeFilter) {
      case 'abnormal': list = BIOMARKERS.filter(b => b.val < b.lo || b.val > b.hi); break;
      case 'improving': list = BIOMARKERS.filter(b => b.stab.dir === 'improving'); break;
      case 'normal': list = BIOMARKERS.filter(b => b.val >= b.lo && b.val <= b.hi); break;
      default: list = [...BIOMARKERS];
    }
    return list.sort((a, b) => a.hps - b.hps);
  }, [activeFilter]);

  return (
    <View>
      {/* HPS Hero */}
      <View style={sty.hero}>
        <View style={sty.heroRow}>
          {/* Score Ring (SVG) */}
          <View style={sty.ring}>
            <Svg width={ms(78)} height={ms(78)} viewBox="0 0 78 78">
              <Circle cx="39" cy="39" r="32" fill="none" stroke="rgba(255,255,255,0.1)" strokeWidth={6.5} />
              <Circle cx="39" cy="39" r="32" fill="none" stroke="#5EEAD4" strokeWidth={6.5}
                strokeDasharray={`${2 * Math.PI * 32}`}
                strokeDashoffset={`${2 * Math.PI * 32 * (1 - hpsAvg / 100)}`}
                strokeLinecap="round"
                transform="rotate(-90 39 39)" />
            </Svg>
            <View style={sty.ringCenter}>
              <AppText style={{fontSize: ms(24), fontWeight: '700', color: '#fff', fontFamily: 'monospace'}}>{hpsAvg}</AppText>
              <AppText style={{fontSize: ms(8), color: 'rgba(255,255,255,0.45)', textTransform: 'uppercase', letterSpacing: 0.5}}>/ 100</AppText>
            </View>
          </View>

          {/* Right info */}
          <View style={{flex: 1, marginLeft: s(13)}}>
            <AppText style={{fontSize: ms(13), fontWeight: '700', color: '#fff', marginBottom: vs(2)}}>Health Progression Score</AppText>
            <AppText style={{fontSize: ms(10), color: 'rgba(255,255,255,0.5)', lineHeight: ms(15), marginBottom: vs(9)}}>
              {BIOMARKERS.length} biomarkers across 3 dimensions
            </AppText>
            <View style={{flexDirection: 'row', gap: s(6)}}>
              <ScoreBox label="Status" value={statusAvg} max={STATUS_MAX} labelColor="#5EEAD4" valueColor="#5EEAD4" fillColor="#5EEAD4" />
              <ScoreBox label="Stability" value={stabilityAvg} max={STABILITY_MAX} labelColor="#A78BFA" valueColor="#A78BFA" fillColor="#A78BFA" />
              <ScoreBox label="Velocity" value={velocityAvg} max={VELOCITY_MAX} labelColor="#60A5FA" valueColor="#60A5FA" fillColor="#60A5FA" />
            </View>
          </View>
        </View>
      </View>

      {/* Filter Pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={sty.filterRow}>
        {FILTERS.map(f => {
          const active = activeFilter === f.key;
          return (
            <TouchableOpacity
              key={f.key}
              style={[sty.filterPill, active && sty.filterActive]}
              onPress={() => setActiveFilter(f.key)}
              activeOpacity={0.7}>
              <AppText style={{fontSize: ms(11), fontWeight: '600', color: active ? '#fff' : '#64748B'}}>{f.label}</AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Biomarker Cards */}
      {filtered.map(bm => {
        const st = statusPill(bm.val, bm.lo, bm.hi);
        const dr = dirPill(bm.stab.dir);
        const vl = velPill(bm.vel.sp, bm.vel.pct);
        const hc = hpsColor(bm.hps);
        const refStr = bm.lo > 0 ? `Ref: ${bm.lo}\u2013${bm.hi}` : `Ref: <${bm.hi}`;

        return (
          <TouchableOpacity
            key={bm.id}
            style={sty.card}
            activeOpacity={0.7}
            onPress={() => navigation.navigate('BiomarkerIntelDetail', {biomarkerId: bm.id})}>
            {/* Stripe */}
            <View style={[sty.stripe, {backgroundColor: stripeColor(bm.hps)}]} />

            <View style={sty.cardBody}>
              {/* Top row: icon + name/cat + value/ref + hps + chevron */}
              <View style={sty.topRow}>
                <View style={[sty.iconCircle, {backgroundColor: bm.col + '18'}]}>
                  <Icon family="Ionicons" name={BM_ICONS[bm.id] || 'pulse-outline'} size={15} color={bm.col} />
                </View>
                <View style={sty.metaCol}>
                  <AppText style={{fontSize: ms(13), fontWeight: '700', color: Colors.textPrimary}}>{bm.name}</AppText>
                  <AppText style={{fontSize: ms(10), color: '#64748B', marginTop: vs(1)}}>{bm.cat}</AppText>
                </View>
                <View style={sty.valCol}>
                  <View style={{flexDirection: 'row', alignItems: 'baseline'}}>
                    <AppText style={{fontSize: ms(19), fontWeight: '700', color: bm.col, fontFamily: 'monospace', lineHeight: ms(22)}}>{bm.val}</AppText>
                    <AppText style={{fontSize: ms(10), color: '#64748B', marginLeft: s(2)}}>{bm.unit}</AppText>
                  </View>
                  <AppText style={{fontSize: ms(9), color: '#94A3B8', marginTop: vs(1)}}>{refStr}</AppText>
                </View>
                {/* HPS mini (SVG) */}
                <View style={{alignItems: 'center', marginLeft: s(8)}}>
                  <View style={{width: ms(42), height: ms(42), alignItems: 'center', justifyContent: 'center'}}>
                    <Svg width={ms(42)} height={ms(42)} viewBox="0 0 42 42">
                      <Circle cx="21" cy="21" r="16" fill="none" stroke={hc + '22'} strokeWidth={5} />
                      <Circle cx="21" cy="21" r="16" fill="none" stroke={hc} strokeWidth={5}
                        strokeDasharray={`${2 * Math.PI * 16}`}
                        strokeDashoffset={`${2 * Math.PI * 16 * (1 - bm.hps / 100)}`}
                        strokeLinecap="round"
                        transform="rotate(-90 21 21)" />
                    </Svg>
                    <View style={{position: 'absolute'}}>
                      <AppText style={{fontSize: ms(10), fontWeight: '700', color: hc, fontFamily: 'monospace'}}>{bm.hps}</AppText>
                    </View>
                  </View>
                  <AppText style={{fontSize: ms(8), color: '#64748B', textTransform: 'uppercase', letterSpacing: 0.4, marginTop: vs(1)}}>HPS</AppText>
                </View>
                {/* Chevron */}
                <AppText style={{fontSize: ms(16), color: '#64748B', marginLeft: s(4)}}>{'\u203A'}</AppText>
              </View>

              {/* Badges row */}
              <View style={sty.badges}>
                <View style={[sty.badge, {backgroundColor: st.bg}]}>
                  <AppText style={{fontSize: ms(10), fontWeight: '700', color: st.color}}>{st.label}</AppText>
                </View>
                <View style={[sty.badge, {backgroundColor: dr.bg}]}>
                  <AppText style={{fontSize: ms(10), fontWeight: '700', color: dr.color}}>{dr.label}</AppText>
                </View>
                <View style={[sty.badge, {backgroundColor: vl.bg}]}>
                  <AppText style={{fontSize: ms(10), fontWeight: '700', color: vl.color}}>{vl.label}</AppText>
                </View>
              </View>
            </View>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

const sty = StyleSheet.create({
  hero: {
    backgroundColor: '#063d2f',
    borderRadius: ms(14),
    padding: ms(13),
    marginBottom: vs(12),
    overflow: 'hidden',
  },
  heroRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ring: {
    width: ms(78),
    height: ms(78),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ringBg: {
    position: 'absolute',
    width: ms(78),
    height: ms(78),
    borderRadius: ms(39),
    borderWidth: ms(6.5),
    borderColor: 'rgba(255,255,255,0.1)',
  },
  ringProgress: {
    position: 'absolute',
    width: ms(78),
    height: ms(78),
    borderRadius: ms(39),
    borderWidth: ms(6.5),
    transform: [{rotate: '-45deg'}],
  },
  ringCenter: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    alignItems: 'center',
    justifyContent: 'center',
  },
  scoreBox: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: ms(9),
    paddingVertical: vs(7),
    paddingHorizontal: s(8),
  },
  scoreBarBg: {
    height: 3,
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 2,
    overflow: 'hidden',
    marginTop: vs(5),
  },
  scoreBarFill: {
    height: 3,
    borderRadius: 2,
  },
  filterRow: {
    gap: s(6),
    marginBottom: vs(12),
  },
  filterPill: {
    paddingVertical: vs(5),
    paddingHorizontal: s(12),
    borderRadius: ms(16),
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: 'rgba(15,118,110,0.13)',
  },
  filterActive: {
    backgroundColor: '#0D9488',
    borderColor: '#0D9488',
  },
  card: {
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: 'rgba(15,118,110,0.13)',
    borderRadius: ms(14),
    overflow: 'hidden',
    marginBottom: vs(9),
  },
  stripe: {
    height: 4,
  },
  cardBody: {
    paddingHorizontal: s(13),
    paddingVertical: vs(10),
  },
  topRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
    marginBottom: vs(7),
  },
  iconCircle: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  metaCol: {
    flex: 1,
    minWidth: 0,
  },
  valCol: {
    alignItems: 'flex-end',
  },
  hpsMini: {
    width: ms(42),
    height: ms(42),
    borderRadius: ms(21),
    borderWidth: ms(5),
    alignItems: 'center',
    justifyContent: 'center',
  },
  hpsMiniProgress: {
    position: 'absolute',
    width: ms(42),
    height: ms(42),
    borderRadius: ms(21),
    borderWidth: ms(5),
    transform: [{rotate: '-45deg'}],
  },
  badges: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(5),
  },
  badge: {
    paddingVertical: vs(2),
    paddingHorizontal: s(8),
    borderRadius: ms(6),
  },
});

export default BiomarkerTab;
