import React, {useState} from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../shared/AppText';
import Icon from '../shared/Icons';

const FILTERS = [
  {key: 'all', label: 'All ECGs'},
  {key: 'abnorm', label: 'Abnormal'},
  {key: 'holter', label: 'Holter'},
  {key: 'symp', label: 'Symptomatic'},
  {key: 'trends', label: 'Trends'},
];

const ALL_ENTRIES = [
  {name: 'Normal sinus rhythm', meta: '28 Mar 2026 - 09:41 - Resting - Manual entry', detail: 'HR 72 - PR 158ms - QRS 88ms - QTc 418ms - Axis +42', chips: [{l: 'Normal', bg: Colors.tealBg, c: Colors.tealText}, {l: 'Resting'}], hr: '72', status: 'Normal', statusColor: Colors.accent, iconBg: Colors.tealBg, icon: 'checkmark-circle-outline'},
  {name: 'Normal sinus rhythm', meta: '14 Jan 2026 - 10:15 - Clinical / annual check - KIMS Hospital', detail: 'HR 76 - PR 152ms - QRS 90ms - QTc 424ms - Axis +38', chips: [{l: 'Normal', bg: Colors.tealBg, c: Colors.tealText}, {l: 'Clinical'}, {l: 'Annual review'}], hr: '76', status: 'Normal', statusColor: Colors.accent, iconBg: Colors.tealBg, icon: 'checkmark-circle-outline'},
  {name: 'Sinus tachycardia + borderline QTc', meta: '20 Dec 2025 - 22:18 - During symptoms - Apple Watch', detail: 'HR 108 - PR 142ms - QRS 86ms - QTc 452ms (borderline)', chips: [{l: 'Borderline QTc', bg: Colors.amberBg, c: Colors.amberDark}, {l: 'Tachycardia', bg: Colors.amberBg, c: Colors.amberDark}, {l: 'During palpitations'}], hr: '108', status: 'Borderline', statusColor: '#F97316', iconBg: Colors.amberBg, icon: 'flash-outline'},
  {name: 'Sinus bradycardia - isolated PVC', meta: '5 Nov 2025 - 06:12 - Resting - KardiaMobile', detail: 'HR 52 - PR 168ms - QRS 92ms - QTc 431ms - 1 PVC', chips: [{l: 'Bradycardia', bg: Colors.redBg, c: Colors.redDark}, {l: 'PVC', bg: Colors.redBg, c: Colors.redDark}, {l: 'Reviewed by Dr. Kavitha'}], hr: '52', status: 'Abnormal', statusColor: Colors.red, iconBg: Colors.redBg, icon: 'warning-outline'},
  {name: 'Normal sinus rhythm', meta: '10 Oct 2025 - 14:30 - Post-exercise - Apple Watch', detail: 'HR 94 - PR 140ms - QRS 88ms - QTc 408ms', chips: [{l: 'Normal', bg: Colors.tealBg, c: Colors.tealText}, {l: 'Post-exercise'}], hr: '94', status: 'Normal', statusColor: Colors.accent, iconBg: Colors.tealBg, icon: 'checkmark-circle-outline'},
  {name: 'Normal sinus rhythm', meta: '22 Sep 2025 - 08:45 - Resting - Manual entry', detail: 'HR 68 - PR 154ms - QRS 86ms - QTc 412ms', chips: [{l: 'Normal', bg: Colors.tealBg, c: Colors.tealText}], hr: '68', status: 'Normal', statusColor: Colors.accent, iconBg: Colors.tealBg, icon: 'checkmark-circle-outline'},
];

const ECGRow = ({entry}) => (
  <View style={st.ecgRow}>
    <View style={[st.ecgIcon, {backgroundColor: entry.iconBg}]}>
      <Icon family="Ionicons" name={entry.icon} size={ms(18)} color={entry.statusColor} />
    </View>
    <View style={{flex: 1}}>
      <AppText variant="bodyBold" color={Colors.textPrimary}>{entry.name}</AppText>
      <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(15)}}>{entry.meta}</AppText>
      <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(1)}}>{entry.detail}</AppText>
      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(4), marginTop: vs(6)}}>
        {entry.chips.map((ch, i) => (
          <View key={i} style={[st.chip, ch.bg && {backgroundColor: ch.bg}]}>
            <AppText variant="subtext" color={ch.c || Colors.tealText} style={{fontWeight: '600'}}>{ch.l}</AppText>
          </View>
        ))}
      </View>
    </View>
    <View style={{alignItems: 'flex-end'}}>
      <AppText variant="header" color={Colors.primary} style={{fontWeight: '800', fontSize: ms(20), lineHeight: ms(20)}}>{entry.hr}</AppText>
      <AppText variant="subtext" color={Colors.textSecondary}>bpm</AppText>
      <AppText variant="subtext" color={entry.statusColor} style={{fontWeight: '700', marginTop: vs(2)}}>{entry.status}</AppText>
    </View>
  </View>
);

const TrendsPanel = () => (
  <View>
    <View style={st.sec}><AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>Heart rate trend - 12 months</AppText><View style={st.secLine} /></View>
    <View style={st.trendCard}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4)}}>
        <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>Resting HR</AppText>
        <AppText variant="small" color={Colors.textSecondary}>Avg 72 bpm - Normal</AppText>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: ms(2), height: vs(40), marginBottom: vs(4)}}>
        {[68,72,65,80,108,76,94,70,72].map((v, i) => (
          <View key={i} style={{flex: 1, height: `${(v / 120) * 100}%`, backgroundColor: v > 100 ? Colors.red : v < 60 ? Colors.red : '#378ADD', borderRadius: ms(3)}} />
        ))}
      </View>
    </View>

    <View style={st.sec}><AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>QTc trend - 12 months</AppText><View style={st.secLine} /></View>
    <View style={st.trendCard}>
      <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4)}}>
        <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>QTc (Bazett)</AppText>
        <AppText variant="small" color={Colors.accent}>Stable - within normal range</AppText>
      </View>
      <View style={{flexDirection: 'row', alignItems: 'flex-end', gap: ms(2), height: vs(40), marginBottom: vs(4)}}>
        {[412,416,408,421,452,424,408,416,418].map((v, i) => (
          <View key={i} style={{flex: 1, height: `${(v / 480) * 100}%`, backgroundColor: v >= 460 ? Colors.red : v >= 440 ? '#F97316' : Colors.accent, borderRadius: ms(3)}} />
        ))}
      </View>
      <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(4)}}>Threshold: {'>'}460ms = prolonged QTc. Your range: 408-452ms.</AppText>
    </View>

    <View style={st.sec}><AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>Rhythm distribution - 12 months</AppText><View style={st.secLine} /></View>
    <View style={st.trendCard}>
      {[{l: 'Normal sinus rhythm (NSR)', pct: 78, c: Colors.accent}, {l: 'Sinus tachycardia', pct: 11, c: '#F97316'}, {l: 'Sinus bradycardia', pct: 5, c: Colors.red}, {l: 'Isolated PVCs', pct: 6, c: '#F0B429'}].map((r, i) => (
        <View key={i} style={{marginBottom: vs(8)}}>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(3)}}>
            <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{r.l}</AppText>
            <AppText variant="caption" color={r.c} style={{fontWeight: '600'}}>{r.pct}%</AppText>
          </View>
          <View style={{height: ms(9), backgroundColor: '#e8f0f8', borderRadius: ms(5), overflow: 'hidden'}}>
            <View style={{width: `${r.pct}%`, height: '100%', backgroundColor: r.c, borderRadius: ms(5)}} />
          </View>
        </View>
      ))}
      <AppText variant="subtext" color={Colors.textSecondary}>n=9 ECGs logged. Based on your logged data.</AppText>
    </View>
  </View>
);

const ECGRecordsTab = ({navigation}) => {
  const [filter, setFilter] = useState('all');
  const abnormEntries = ALL_ENTRIES.filter(e => e.status !== 'Normal');
  const sympEntries = [ALL_ENTRIES[2]];

  return (
    <View>
      {/* Stats banner */}
      <View style={st.statsBanner}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(10)}}>
          <View style={st.statsIcon}><Icon family="Ionicons" name="pulse-outline" size={ms(22)} color={Colors.white} /></View>
          <View><AppText variant="bodyBold" color={Colors.white}>ECG history</AppText><AppText variant="small" color="rgba(255,255,255,0.6)">Priya - 9 ECGs logged</AppText></View>
        </View>
        <View style={st.statsGrid}>
          {[{l: 'Last ECG', v: '28 Mar', s2: 'NSR - Normal'}, {l: 'Avg HR', v: '72', s2: 'bpm - 30d', c: '#5fa0d8'}, {l: 'QTc trend', v: '418', s2: 'ms - stable', c: '#F0B429'}, {l: 'Abnormal', v: '2', s2: 'in 12 months', c: '#F0B429'}].map((item, i) => (
            <View key={i} style={st.statCell}>
              <AppText variant="subtext" color="rgba(255,255,255,0.4)" style={{textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(3)}}>{item.l}</AppText>
              <AppText variant="header" color={item.c || Colors.white} style={{fontWeight: '800', fontSize: ms(14)}}>{item.v}</AppText>
              <AppText variant="subtext" color="rgba(255,255,255,0.5)" style={{marginTop: vs(1)}}>{item.s2}</AppText>
            </View>
          ))}
        </View>
      </View>

      {/* Filter pills */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{marginBottom: vs(10)}} contentContainerStyle={{gap: s(5)}}>
        {FILTERS.map(f => {
          const on = filter === f.key;
          return (
            <TouchableOpacity key={f.key} style={[st.pill, on && st.pillOn]} onPress={() => setFilter(f.key)} activeOpacity={0.7}>
              <AppText variant="small" color={on ? Colors.white : Colors.textSecondary} style={{fontWeight: '600'}}>{f.label}</AppText>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Ayu Intel button */}
      <TouchableOpacity style={st.ayuBtn} activeOpacity={0.8} onPress={() => navigation.navigate('SymptomsDetail', {symptomId: 'ecg', initialTab: 'ecgIntel'})}>
        <View style={st.ayuIcon}><Icon family="Ionicons" name="bulb-outline" size={ms(16)} color={Colors.white} /></View>
        <View style={{flex: 1}}>
          <AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>Ayu Intel - ECG & Heart</AppText>
          <AppText variant="subtext" color="rgba(255,255,255,0.7)">AF risk - QTc analysis - Cardiac care plan</AppText>
        </View>
        <Icon family="Ionicons" name="chevron-forward" size={ms(16)} color="rgba(255,255,255,0.6)" />
      </TouchableOpacity>

      {/* Content panels */}
      {filter === 'all' && (
        <View>
          {/* Rhythm Calendar */}
          <View style={st.sec}><AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>Rhythm calendar - Q1 2026</AppText><View style={st.secLine} /></View>
          <View style={st.calCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(6)}}>
              {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map(d => (
                <AppText key={d} variant="subtext" color={Colors.textTertiary} style={{fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.3, flex: 1, textAlign: 'center'}}>{d}</AppText>
              ))}
            </View>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: ms(3)}}>
              {/* March 2026 offset 6 blank days */}
              {Array(6).fill(0).map((_, i) => <View key={`b${i}`} style={st.calDayCell} />)}
              {['nodata','nodata','nodata','nodata','nodata','nodata','nodata','nodata','nodata','nodata','nodata','nodata','nodata','nodata','nodata','borderline','nodata','nodata','normal','nodata','nodata','nodata','nodata','nodata','nodata','nodata','nodata','normal','nodata','nodata','normal'].map((t, i) => {
                const bg = t === 'normal' ? Colors.tealBg : t === 'borderline' ? Colors.amberBg : t === 'abnormal' ? Colors.redBg : '#f0f4f8';
                const c = t === 'normal' ? Colors.tealText : t === 'borderline' ? Colors.amberDark : t === 'abnormal' ? Colors.redDark : '#bbb';
                return (
                  <View key={i} style={[st.calDayCell, {backgroundColor: bg}]}>
                    <AppText variant="subtext" color={c} style={{fontSize: ms(8), fontWeight: '600'}}>{i + 1}</AppText>
                  </View>
                );
              })}
            </View>
            <View style={{flexDirection: 'row', gap: s(10), marginTop: vs(8), flexWrap: 'wrap'}}>
              {[{c: Colors.tealBg, l: 'NSR'}, {c: Colors.amberBg, l: 'Borderline'}, {c: Colors.redBg, l: 'Abnormal'}, {c: '#f0f4f8', l: 'No data'}].map(item => (
                <View key={item.l} style={{flexDirection: 'row', alignItems: 'center', gap: s(4)}}>
                  <View style={{width: ms(10), height: ms(10), borderRadius: ms(3), backgroundColor: item.c}} />
                  <AppText variant="subtext" color={Colors.textSecondary}>{item.l}</AppText>
                </View>
              ))}
            </View>
          </View>

          <View style={st.sec}><AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>All entries</AppText><View style={st.secLine} /></View>
          {ALL_ENTRIES.map((e, i) => <ECGRow key={i} entry={e} />)}
        </View>
      )}
      {filter === 'abnorm' && (
        <View>
          <View style={[st.alertBox, {backgroundColor: Colors.redBg, borderColor: '#FDA4A4'}]}>
            <AppText variant="small" color={Colors.redDark} style={{lineHeight: ms(16)}}><AppText style={{fontWeight: '700'}}>2 abnormal entries in the past 12 months.</AppText> The Nov 2025 bradycardia + PVC was reviewed by Dr. Kavitha and deemed benign. The Dec 2025 sinus tachycardia occurred during palpitation episode.</AppText>
          </View>
          {abnormEntries.map((e, i) => <ECGRow key={i} entry={e} />)}
        </View>
      )}
      {filter === 'holter' && (
        <View>
          <View style={st.sec}><AppText variant="subtext" color={Colors.textSecondary} style={st.secTxt}>Holter monitor results</AppText><View style={st.secLine} /></View>
          <View style={st.holterCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(8)}}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>24-hour Holter - 3 Feb 2026</AppText>
              <AppText variant="small" color={Colors.textSecondary}>Apollo Diagnostics</AppText>
            </View>
            {/* 6-cell grid matching HTML - 3 cols x 2 rows */}
            <View style={st.holterGrid}>
              {[
                {v: '72', l: 'Avg HR', s2: 'bpm'},
                {v: '52', l: 'Min HR', s2: '02:14 AM', c: Colors.accent},
                {v: '112', l: 'Max HR', s2: 'Exercise', c: '#F97316'},
                {v: '1.2%', l: 'PVC burden', s2: 'Borderline', c: '#F97316'},
                {v: '0', l: 'AF episodes', s2: 'None', c: Colors.accent},
                {v: '28', l: 'HRV (rMSSD)', s2: 'ms - low', c: Colors.accent},
              ].map((m, i) => (
                <View key={i} style={st.holterCell}>
                  <AppText variant="header" color={m.c || Colors.textPrimary} style={{fontWeight: '700', fontSize: ms(18), lineHeight: ms(18)}}>{m.v}</AppText>
                  <AppText variant="subtext" color={Colors.textSecondary} style={{fontWeight: '600', textTransform: 'uppercase', letterSpacing: 0.3, marginTop: vs(4)}}>{m.l}</AppText>
                  <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(3)}}>{m.s2}</AppText>
                </View>
              ))}
            </View>
            <View style={[st.alertBox, {backgroundColor: Colors.amberBg, borderColor: '#FDDCB5', flexDirection: 'row', gap: s(8), alignItems: 'flex-start'}]}>
              <Icon family="Ionicons" name="warning-outline" size={ms(14)} color={Colors.amberDark} />
              <AppText variant="small" color={Colors.amberDark} style={{flex: 1, lineHeight: ms(16)}}><AppText style={{fontWeight: '700'}}>PVC burden 1.2% - borderline.</AppText> Reviewed by Dr. Kavitha on 10 Feb 2026. Decision: repeat Holter in 6 months (Aug 2026). No structural cardiac abnormality on echo ordered. PVCs likely related to autonomic neuropathy from T2DM.</AppText>
            </View>
          </View>

          {/* HRV Trend Card */}
          <View style={st.holterCard}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(4)}}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>HRV trend - 30 days</AppText>
              <AppText variant="small" color={Colors.textSecondary}>Heart rate variability</AppText>
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4)}}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>rMSSD (HRV)</AppText>
              <AppText variant="caption" color="#F97316" style={{fontWeight: '700'}}>28 ms - Below normal</AppText>
            </View>
            <View style={{height: ms(9), backgroundColor: '#e8f0f8', borderRadius: ms(5), overflow: 'hidden', marginBottom: vs(4)}}>
              <View style={{width: '28%', height: '100%', borderRadius: ms(5), backgroundColor: '#F97316'}} />
            </View>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(8)}}>
              <AppText variant="subtext" color={Colors.textTertiary}>0</AppText>
              <AppText variant="subtext" color={Colors.textTertiary}>Normal: 40-60ms</AppText>
              <AppText variant="subtext" color={Colors.textTertiary}>100ms</AppText>
            </View>
            <View style={{backgroundColor: '#f5f9ff', borderRadius: ms(8), padding: ms(8)}}>
              <AppText variant="small" color={Colors.textSecondary} style={{lineHeight: ms(16)}}>HRV of 28ms reflects reduced autonomic flexibility - common in T2DM (autonomic neuropathy), chronic stress, and poor sleep. Each 10ms increase in HRV is associated with 8% lower cardiovascular risk. Improving sleep quality and stress management are the primary HRV levers.</AppText>
            </View>
          </View>
        </View>
      )}
      {filter === 'symp' && (
        <View>
          <View style={[st.alertBox, {backgroundColor: Colors.blueBg, borderColor: '#93C5FD'}]}>
            <AppText variant="small" color={Colors.blueText} style={{lineHeight: ms(16)}}><AppText style={{fontWeight: '700'}}>1 symptomatic ECG recorded.</AppText> Palpitation episode on 20 Dec 2025 captured on Apple Watch. Sinus tachycardia confirmed - not atrial fibrillation.</AppText>
          </View>
          {sympEntries.map((e, i) => <ECGRow key={i} entry={e} />)}
        </View>
      )}
      {filter === 'trends' && <TrendsPanel />}
    </View>
  );
};

const st = StyleSheet.create({
  statsBanner: {backgroundColor: Colors.primary, borderRadius: ms(16), padding: ms(14), marginBottom: vs(10)},
  statsIcon: {width: ms(44), height: ms(44), borderRadius: ms(12), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  statsGrid: {flexDirection: 'row', backgroundColor: 'rgba(0,0,0,0.15)', borderRadius: ms(12), overflow: 'hidden'},
  statCell: {flex: 1, padding: ms(9), backgroundColor: 'rgba(0,0,0,0.2)'},
  pill: {paddingHorizontal: s(13), paddingVertical: vs(7), borderRadius: ms(20), backgroundColor: Colors.white, borderWidth: 1, borderColor: '#dde8e2'},
  pillOn: {backgroundColor: Colors.primary, borderColor: Colors.primary},
  ayuBtn: {flexDirection: 'row', alignItems: 'center', gap: s(8), backgroundColor: Colors.accent, borderRadius: ms(12), padding: ms(12), marginBottom: vs(10)},
  ayuIcon: {width: ms(34), height: ms(34), borderRadius: ms(9), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  sec: {flexDirection: 'row', alignItems: 'center', marginTop: vs(12), marginBottom: vs(8)},
  secTxt: {fontWeight: '700', textTransform: 'uppercase', letterSpacing: 0.5, marginRight: s(7)},
  secLine: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#ccdaeb'},
  calCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#ccdaeb', padding: ms(12), marginBottom: vs(10)},
  calDayCell: {width: '13%', height: ms(24), borderRadius: ms(5), alignItems: 'center', justifyContent: 'center'},
  ecgRow: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#ccdaeb', padding: ms(12), marginBottom: vs(7), flexDirection: 'row', alignItems: 'flex-start', gap: s(11)},
  ecgIcon: {width: ms(36), height: ms(36), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center'},
  chip: {backgroundColor: Colors.tealBg, paddingHorizontal: s(8), paddingVertical: vs(3), borderRadius: ms(8)},
  alertBox: {borderRadius: ms(12), borderWidth: 0.5, padding: ms(11), marginBottom: vs(10)},
  trendCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#ccdaeb', padding: ms(12), marginBottom: vs(10)},
  holterCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#ccdaeb', padding: ms(12), marginBottom: vs(10)},
  holterGrid: {flexDirection: 'row', flexWrap: 'wrap', justifyContent: 'space-between', marginBottom: vs(8)},
  holterCell: {width: '32%', backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#ccdaeb', padding: ms(10), alignItems: 'center', marginBottom: vs(6)},
});

export default ECGRecordsTab;
