import React from 'react';
import {View, StyleSheet, ScrollView} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import Fonts from '../../../constants/fonts';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

/* ════════════════════════════════════════════════════
   REUSABLE COMPONENTS
   ════════════════════════════════════════════════════ */

export const HeroCard = ({bigNumber, bigUnit, bigLabel, kpis, chips}) => (
  <View style={st.hero}>
    <View style={st.heroTopRow}>
      <View style={st.heroLeft}>
        <View style={{flexDirection: 'row', alignItems: 'flex-end'}}>
          <AppText color={Colors.white} style={{fontSize: ms(28), fontWeight: '700', fontFamily: 'monospace', lineHeight: ms(32)}}>
            {bigNumber}
          </AppText>
          {bigUnit ? (
            <AppText color="rgba(255,255,255,0.55)" style={{fontSize: ms(15), marginBottom: vs(2), marginLeft: s(1)}}>
              {bigUnit}
            </AppText>
          ) : null}
        </View>
        <AppText color="rgba(255,255,255,0.55)" style={{fontSize: ms(9), lineHeight: ms(13), marginTop: vs(3)}}>
          {bigLabel}
        </AppText>
      </View>
      <View style={st.kpiGrid}>
        <View style={st.kpiRow}>
          {kpis.slice(0, 2).map((k, i) => (
            <View key={i} style={st.kpiBox}>
              <AppText color={Colors.white} style={{fontWeight: '700', fontFamily: 'monospace', fontSize: ms(11), lineHeight: ms(13)}}>
                {k.value}
              </AppText>
              <AppText color="rgba(255,255,255,0.45)" style={{marginTop: vs(2), fontSize: ms(6.5), lineHeight: ms(9)}}>
                {k.label}
              </AppText>
            </View>
          ))}
        </View>
        <View style={st.kpiRow}>
          {kpis.slice(2, 4).map((k, i) => (
            <View key={i} style={st.kpiBox}>
              <AppText color={Colors.white} style={{fontWeight: '700', fontFamily: 'monospace', fontSize: ms(11), lineHeight: ms(13)}}>
                {k.value}
              </AppText>
              <AppText color="rgba(255,255,255,0.45)" style={{marginTop: vs(2), fontSize: ms(6.5), lineHeight: ms(9)}}>
                {k.label}
              </AppText>
            </View>
          ))}
        </View>
      </View>
    </View>
    {chips && chips.length > 0 && (
      <View style={{gap: vs(5), marginTop: vs(8), position: 'relative', zIndex: 1}}>
        {chips.map((c, i) => (
          <View key={i} style={[st.heroChip, {backgroundColor: c.bg}]}>
            <AppText variant="small" color={c.color} style={{lineHeight: Fonts.sizes.small * 1.5}}>
              {c.text}
            </AppText>
          </View>
        ))}
      </View>
    )}
  </View>
);

export const StatStrip = ({items}) => (
  <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginVertical: vs(10)}} contentContainerStyle={{paddingHorizontal: s(2), gap: s(8)}}>
    {items.map((item, i) => (
      <View key={i} style={[st.statStripCard, {borderTopColor: item.color}]}>
        <AppText variant="subtext" color={Colors.textTertiary} style={{textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.5}}>
          {item.label}
        </AppText>
        <AppText variant="header" color={item.color || Colors.textPrimary} style={{fontWeight: '700', fontFamily: 'monospace', marginTop: vs(2)}}>
          {item.value}
        </AppText>
        {item.sub ? (
          <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(2)}}>
            {item.sub}
          </AppText>
        ) : null}
      </View>
    ))}
  </ScrollView>
);

export const SectionLabel = ({text}) => (
  <View style={st.secLblWrap}>
    <AppText variant="small" color={Colors.textTertiary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 1, marginRight: s(8)}}>
      {text}
    </AppText>
    <View style={st.secLblLine} />
  </View>
);

export const AnCard = ({title, subtitle, children, style: extraStyle}) => (
  <View style={[st.anCard, extraStyle]}>
    {title ? (
      <View style={{marginBottom: vs(10)}}>
        <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontWeight: '700'}}>
          {title}
        </AppText>
        {subtitle ? (
          <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(1), lineHeight: Fonts.sizes.small * 1.5}}>
            {subtitle}
          </AppText>
        ) : null}
      </View>
    ) : null}
    {children}
  </View>
);

export const InsightBullet = ({color, bg, icon, children}) => (
  <View style={[st.insightBullet, {backgroundColor: bg, borderLeftColor: color}]}>
    {icon ? (
      <Icon family="Ionicons" name={icon} size={13} color={color} />
    ) : null}
    <AppText variant="small" color={color} style={{flex: 1, lineHeight: ms(16)}}>
      {children}
    </AppText>
  </View>
);

export const ProgressRow = ({label, pct, value, color}) => (
  <View style={st.progressRow}>
    <View style={[st.progressDot, {backgroundColor: color}]} />
    <AppText variant="small" color={Colors.textPrimary} style={{width: s(80)}} numberOfLines={1}>
      {label}
    </AppText>
    <View style={st.progressTrack}>
      <View style={[st.progressFill, {width: `${pct}%`, backgroundColor: color}]} />
    </View>
    <AppText variant="small" color={color} style={{width: s(50), textAlign: 'right', fontWeight: '700', fontFamily: 'monospace'}}>
      {value}
    </AppText>
  </View>
);

export const InsightBox = ({children}) => (
  <View style={st.insightBox}>
    <AppText variant="small" color="#4338CA" style={{lineHeight: ms(16)}}>
      {children}
    </AppText>
  </View>
);

export const HeatCell = ({letter, bg, borderColor, textColor, dashed}) => (
  <View style={[st.heatCell, {backgroundColor: bg, borderColor: borderColor || Colors.borderLight}, dashed && {borderStyle: 'dashed'}]}>
    <AppText variant="small" color={textColor || Colors.textPrimary} style={{fontWeight: '800'}}>
      {letter}
    </AppText>
  </View>
);

export const BarChart = ({bars, maxVal, height: barHeight, barWidth, scrollable}) => {
  const bh = barHeight || 80;
  const bw = barWidth || (scrollable ? s(14) : undefined);
  const content = bars.map((b, i) => {
    const h = maxVal ? (b.value / maxVal) * vs(bh - 14) : vs(40);
    return (
      <View key={i} style={[{alignItems: 'center'}, bw ? {width: bw} : {flex: 1}]}>
        {b.topLabel ? (
          <AppText variant="subtext" color={b.color || Colors.accent} style={{fontSize: Fonts.sizes.xs, marginBottom: vs(2), fontFamily: 'monospace'}}>
            {b.topLabel}
          </AppText>
        ) : <View style={{height: vs(12)}} />}
        <View style={{flex: 1, justifyContent: 'flex-end', width: '100%', alignItems: 'center'}}>
          <View style={{width: bw ? bw - s(3) : '70%', height: Math.max(4, h), backgroundColor: (b.color || Colors.accent) + (b.dim ? '88' : ''), borderRadius: ms(3)}} />
        </View>
        <AppText variant="subtext" color={Colors.textTertiary} style={{fontSize: Fonts.sizes.xs, marginTop: vs(2)}} numberOfLines={1}>
          {b.label}
        </AppText>
      </View>
    );
  });
  return (
    <View style={{height: vs(bh), marginTop: vs(6)}}>
      {scrollable ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{flexDirection: 'row', alignItems: 'flex-end', gap: s(2), paddingRight: s(4)}}>
          {content}
        </ScrollView>
      ) : (
        <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: s(4), flex: 1}}>
          {content}
        </View>
      )}
    </View>
  );
};

export const TableRow = ({cells, isHeader, bg}) => (
  <View style={[st.tableRow, isHeader && {backgroundColor: '#F9FAFB'}, bg && {backgroundColor: bg}]}>
    {cells.map((c, i) => (
      <View key={i} style={[st.tableCell, i === 0 && {flex: 1.5}]}>
        <AppText variant={isHeader ? 'subtext' : 'small'} color={isHeader ? Colors.textTertiary : Colors.textPrimary} style={isHeader ? {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5} : {fontFamily: 'monospace'}}>
          {c}
        </AppText>
      </View>
    ))}
  </View>
);

export const BenchmarkCell = ({label, value, sub, bg, color}) => (
  <View style={[st.benchCell, {backgroundColor: bg}]}>
    <AppText variant="subtext" color={color} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5}}>
      {label}
    </AppText>
    <AppText variant="header" color={color} style={{fontWeight: '700', fontFamily: 'monospace', marginTop: vs(3)}}>
      {value}
    </AppText>
    {sub ? (
      <AppText variant="subtext" color={color} style={{marginTop: vs(2), opacity: 0.8}}>
        {sub}
      </AppText>
    ) : null}
  </View>
);

export const GanttBar = ({label, startPct, widthPct, color, duration}) => (
  <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(6)}}>
    <AppText variant="subtext" color={Colors.textTertiary} style={{fontWeight: '600', minWidth: s(70)}}>
      {label}
    </AppText>
    <View style={[st.ganttTrack, {flex: 1}]}>
      <View style={[st.ganttFill, {left: `${startPct}%`, width: `${Math.max(2, widthPct)}%`, backgroundColor: color + 'CC'}]} />
    </View>
    {duration ? (
      <AppText variant="subtext" color={Colors.textTertiary} style={{minWidth: s(24), textAlign: 'right'}}>
        {duration}
      </AppText>
    ) : null}
  </View>
);

export const NumberedAction = ({num, title, desc, due, color}) => (
  <View style={{paddingVertical: vs(9), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F8FAFC', flexDirection: 'row', alignItems: 'flex-start', gap: s(9)}}>
    <AppText variant="bodyBold" color={color} style={{fontWeight: '700', minWidth: s(18), marginTop: vs(1)}}>
      {num}.
    </AppText>
    <View style={{flex: 1}}>
      <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '700', marginBottom: vs(3)}}>
        {title}
      </AppText>
      <AppText variant="subtext" color={Colors.textTertiary} style={{lineHeight: ms(14)}}>
        {desc}
      </AppText>
    </View>
    <View style={{backgroundColor: color + '18', paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(5)}}>
      <AppText variant="subtext" color={color} style={{fontWeight: '700'}}>{due}</AppText>
    </View>
  </View>
);

export const StatusRow = ({name, done, note, color}) => (
  <View style={{paddingVertical: vs(9), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F1F5F9', flexDirection: 'row', alignItems: 'flex-start', gap: s(10)}}>
    <View style={{width: ms(10), height: ms(10), borderRadius: ms(3), backgroundColor: color, marginTop: vs(2)}} />
    <View style={{flex: 1}}>
      <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '700', marginBottom: vs(2)}}>{name}</AppText>
      <AppText variant="subtext" color={color}>{note}</AppText>
    </View>
    <View style={{backgroundColor: color + '18', paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(5)}}>
      <AppText variant="subtext" color={color} style={{fontWeight: '700'}}>{done ? '✓ Done' : '⚠ Pending'}</AppText>
    </View>
  </View>
);

export const RankRow = ({rank, init, bg, tx, name, sp, visits, total, maxTotal}) => {
  const pct = maxTotal ? Math.round((total / maxTotal) * 100) : 50;
  return (
    <View style={{flexDirection: 'row', alignItems: 'center', gap: s(9), paddingVertical: vs(8), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.background}}>
      <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '700', minWidth: s(16)}}>#{rank}</AppText>
      <View style={{width: ms(34), height: ms(34), borderRadius: ms(10), backgroundColor: bg, alignItems: 'center', justifyContent: 'center'}}>
        <AppText variant="small" color={tx} style={{fontWeight: '700'}}>{init}</AppText>
      </View>
      <View style={{flex: 1, minWidth: 0}}>
        <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '700'}}>{name}</AppText>
        <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(1), marginBottom: vs(4)}}>{sp} · {visits} visits</AppText>
        <View style={{height: ms(3), backgroundColor: Colors.background, borderRadius: ms(2), overflow: 'hidden'}}>
          <View style={{height: '100%', width: `${pct}%`, backgroundColor: tx, borderRadius: ms(2)}} />
        </View>
      </View>
      <AppText variant="bodyBold" color={tx} style={{fontWeight: '700', fontFamily: 'monospace'}}>₹{total.toLocaleString()}</AppText>
    </View>
  );
};

export const LoyaltyRow = ({specialty, doctor, pct, streak, color}) => (
  <View style={{paddingVertical: vs(8), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: '#F1F5F9'}}>
    <View style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(5)}}>
      <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '700'}}>{specialty}</AppText>
      <View style={{backgroundColor: color + '18', paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(5)}}>
        <AppText variant="subtext" color={color} style={{fontWeight: '700'}}>{pct}% loyalty</AppText>
      </View>
    </View>
    <AppText variant="subtext" color={Colors.textTertiary} style={{marginBottom: vs(4)}}>{doctor} · {streak}</AppText>
    <View style={{height: ms(4), backgroundColor: Colors.background, borderRadius: ms(2), overflow: 'hidden'}}>
      <View style={{height: '100%', width: `${pct}%`, backgroundColor: color, borderRadius: ms(2)}} />
    </View>
  </View>
);

/* ════════════════════════════════════════════════════
   SHARED STYLES
   ════════════════════════════════════════════════════ */
export const st = StyleSheet.create({
  subPill: {paddingVertical: vs(5), paddingHorizontal: s(12), borderRadius: ms(16), backgroundColor: Colors.white, borderWidth: 1, borderColor: Colors.borderLight},
  subPillActive: {backgroundColor: Colors.accent, borderColor: Colors.accent},

  hero: {backgroundColor: Colors.primary, borderRadius: ms(16), padding: ms(14), marginBottom: vs(4), position: 'relative', overflow: 'hidden'},
  heroTopRow: {flexDirection: 'row', alignItems: 'flex-start', position: 'relative', zIndex: 1},
  heroLeft: {width: '58%', paddingRight: s(8)},
  kpiGrid: {width: '42%', gap: vs(4)},
  kpiRow: {flexDirection: 'row', gap: s(4)},
  kpiBox: {flex: 1, backgroundColor: 'rgba(255,255,255,0.08)', borderRadius: ms(8), paddingVertical: vs(5), paddingHorizontal: s(6)},
  heroChip: {borderRadius: ms(8), paddingVertical: vs(5), paddingHorizontal: s(10)},

  statStripCard: {backgroundColor: Colors.white, borderRadius: ms(12), padding: ms(12), minWidth: s(110), borderWidth: 0.5, borderColor: Colors.borderLight, borderTopWidth: 2.5},

  secLblWrap: {flexDirection: 'row', alignItems: 'center', marginTop: vs(14), marginBottom: vs(10)},
  secLblLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: Colors.borderLight},

  anCard: {backgroundColor: Colors.white, borderRadius: ms(14), padding: ms(14), borderWidth: 0.5, borderColor: Colors.borderLight, marginBottom: vs(10)},

  insightBullet: {flexDirection: 'row', alignItems: 'flex-start', gap: s(8), borderLeftWidth: 3, borderRadius: ms(6), paddingVertical: vs(6), paddingHorizontal: s(10), marginBottom: vs(4)},

  progressRow: {flexDirection: 'row', alignItems: 'center', marginBottom: vs(6), gap: s(6)},
  progressDot: {width: ms(6), height: ms(6), borderRadius: ms(3)},
  progressTrack: {flex: 1, height: ms(6), backgroundColor: Colors.background, borderRadius: ms(3), overflow: 'hidden'},
  progressFill: {height: '100%', borderRadius: ms(3)},

  insightBox: {backgroundColor: '#EEF2FF', borderRadius: ms(8), padding: ms(10), marginTop: vs(8), borderWidth: 0.5, borderColor: '#C7D2FE'},

  heatCell: {width: ms(28), height: ms(28), borderRadius: ms(6), borderWidth: 1.5, alignItems: 'center', justifyContent: 'center', marginVertical: vs(1)},

  tableRow: {flexDirection: 'row', paddingVertical: vs(6), paddingHorizontal: s(4), borderBottomWidth: StyleSheet.hairlineWidth, borderBottomColor: Colors.borderLight},
  tableCell: {flex: 1, justifyContent: 'center'},

  benchGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8), justifyContent: 'space-between'},
  benchCell: {width: '47%', borderRadius: ms(10), padding: ms(10), marginBottom: vs(2)},

  ganttTrack: {height: ms(14), backgroundColor: Colors.background, borderRadius: ms(4), overflow: 'hidden', position: 'relative'},
  ganttFill: {position: 'absolute', top: 0, height: '100%', borderRadius: ms(4)},
});
