import React from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const C = {
  red: '#E24B4A', redBg: '#FCEBEB', redText: '#791F1F', redDark: '#A32D2D',
  amber: '#BA7517', amberBg: '#FAEEDA', amberText: '#633806', amberDark: '#854F0B',
  green: '#1D9E75', greenBg: '#E1F5EE', greenText: '#085041', greenDark: '#0F6E56',
  blue: '#378ADD', blueBg: '#E6F1FB', blueText: '#185FA5',
  purple: '#3C3489', purpleBg: '#EEEDFE',
  tealBg: '#f0f7f4',
};

const DimScoreBar = ({score, color, desc}) => (
  <View style={rs.dimCell}>
    <View style={rs.dimScoreRow}>
      <AppText variant="bodyBold" color={color} style={{minWidth: s(28)}}>{score}</AppText>
      <View style={rs.dimBarBg}>
        <View style={[rs.dimBarFill, {width: `${score}%`, backgroundColor: color}]} />
      </View>
    </View>
    <AppText variant="small" color={Colors.textTertiary}>{desc}</AppText>
  </View>
);

const SparkBars = ({data}) => (
  <View style={rs.sparkRow}>
    {data.map((d, i) => (
      <View key={i} style={[rs.sparkBar, {height: vs(d.h), backgroundColor: d.c}]} />
    ))}
  </View>
);

const StatusPill = ({text, type}) => {
  const bg = type === 'r' ? C.redBg : type === 'a' ? C.amberBg : type === 'g' ? C.greenBg : C.blueBg;
  const color = type === 'r' ? C.redText : type === 'a' ? C.amberText : type === 'g' ? C.greenText : C.blueText;
  return <View style={[rs.statusPill, {backgroundColor: bg}]}><AppText variant="small" color={color} style={{fontWeight: '500'}}>{text}</AppText></View>;
};

const ScoreBarCell = ({pct, color}) => (
  <View style={rs.scoreBarBg}><View style={[rs.scoreBarFill, {width: `${pct}%`, backgroundColor: color}]} /></View>
);

const PopRow = ({label, priyaPos, avgPos, priyaVal, avgVal, priyaColor}) => (
  <View style={rs.popRow}>
    <AppText variant="small" color={Colors.textSecondary} style={{width: s(110)}}>{label}</AppText>
    <View style={rs.popBarWrap}>
      <View style={rs.popBarBg}>
        <View style={[rs.popBarFill, {width: `${avgPos}%`, backgroundColor: C.green, opacity: 0.3}]} />
      </View>
      <View style={[rs.popMarker, {left: `${priyaPos}%`, backgroundColor: priyaColor}]} />
      <View style={[rs.popMarkerDash, {left: `${avgPos}%`}]} />
    </View>
    <View style={{flexDirection: 'row', gap: s(8)}}>
      <View style={{alignItems: 'flex-end'}}>
        <AppText variant="bodyBold" color={priyaColor}>{priyaVal}</AppText>
        <AppText variant="small" color={Colors.textTertiary}>Priya</AppText>
      </View>
      <View style={{alignItems: 'flex-end'}}>
        <AppText variant="bodyBold" color={Colors.textTertiary}>{avgVal}</AppText>
        <AppText variant="small" color={Colors.textTertiary}>Avg</AppText>
      </View>
    </View>
  </View>
);

const HPSReportScreen = ({navigation}) => {
  return (
    <View style={rs.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={rs.header}>
        <View style={rs.headerTop}>
          <TouchableOpacity style={rs.backBtn} onPress={() => navigation.goBack()}>
            <Icon family="Ionicons" name="chevron-back" size={20} color={Colors.white} />
          </TouchableOpacity>
          <View style={{flex: 1}}>
            <AppText variant="screenName" color={Colors.white}>HPS Insurer Report</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">Confidential · Underwriting Report</AppText>
          </View>
        </View>
      </View>

      <ScrollView style={{flex: 1}} contentContainerStyle={rs.body} showsVerticalScrollIndicator={false}>

        {/* Report Meta */}
        <View style={rs.metaRow}>
          <View>
            <AppText variant="bodyBold" color={Colors.primary}>TrustLife <AppText variant="caption" color={Colors.textTertiary}>Health Intelligence Platform</AppText></AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(2)}}>HPS Insurer Summary Report</AppText>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <View style={rs.reportTypeBadge}><AppText variant="small" color={Colors.white} style={{fontWeight: '500'}}>Underwriting Report</AppText></View>
            <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(3)}}>22 Mar 2026</AppText>
            <AppText variant="small" color={Colors.textSecondary}>Report ID: TL-INS-2026-0322</AppText>
          </View>
        </View>
        <View style={rs.divider} />

        {/* Patient Header + HPS Summary */}
        <View style={rs.patientRow}>
          <View style={{flex: 1}}>
            <AppText variant="header" color={Colors.textPrimary}>Priya Reddy</AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{lineHeight: ms(20), marginTop: vs(4)}}>
              <AppText variant="small" style={{fontWeight: '500'}}>DOB:</AppText> 14 Aug 1987 · 38 yrs · Female{'\n'}
              <AppText variant="small" style={{fontWeight: '500'}}>Blood group:</AppText> B+ · UHI-9823-HYD-2021{'\n'}
              <AppText variant="small" style={{fontWeight: '500'}}>Conditions:</AppText> Type 2 Diabetes · Hypertension · Dyslipidaemia{'\n'}
              <AppText variant="small" style={{fontWeight: '500'}}>Physician:</AppText> Dr. Kavitha Reddy, KIMS
            </AppText>
            <View style={rs.consentRow}>
              <View style={rs.consentDot} />
              <AppText variant="small" color={Colors.textTertiary}>Patient consent provided · Valid to 1 Mar 2027</AppText>
            </View>
          </View>
        </View>

        {/* HPS Summary Block */}
        <View style={rs.hpsSummary}>
          <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '500', textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: vs(8)}}>Health Progress Score</AppText>
          <AppText style={rs.hpsScoreNum}>658</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(10)}}>Range 300–900 · Grade: <AppText variant="small" color={C.amberDark} style={{fontWeight: '500'}}>Fair</AppText></AppText>

          {/* Gradient band using segments */}
          <View style={rs.hpsBandContainer}>
            <View style={rs.hpsBandRow}>
              <View style={[rs.bandSeg, {backgroundColor: C.red, borderTopLeftRadius: ms(4), borderBottomLeftRadius: ms(4)}]} />
              <View style={[rs.bandSeg, {backgroundColor: '#D4691C'}]} />
              <View style={[rs.bandSeg, {backgroundColor: C.amber}]} />
              <View style={[rs.bandSeg, {backgroundColor: '#EF9F27'}]} />
              <View style={[rs.bandSeg, {backgroundColor: '#6BBF4C'}]} />
              <View style={[rs.bandSeg, {backgroundColor: C.green}]} />
              <View style={[rs.bandSeg, {backgroundColor: C.greenText, borderTopRightRadius: ms(4), borderBottomRightRadius: ms(4)}]} />
            </View>
            {/* Marker at 658 position: (658-300)/(900-300) = 59.7% */}
            <View style={rs.hpsBandMarker} />
          </View>

          {/* Labels below band */}
          <View style={rs.hpsBandLabels}>
            <AppText variant="small" color={C.red} style={{fontWeight: '500'}}>300</AppText>
            <AppText variant="small" color={Colors.textTertiary}>450</AppText>
            <AppText variant="small" color={Colors.textTertiary}>600</AppText>
            <AppText variant="small" color={Colors.textTertiary}>750</AppText>
            <AppText variant="small" color={C.greenText} style={{fontWeight: '500'}}>900</AppText>
          </View>

          <AppText variant="bodyBold" color={C.amberDark} style={{marginTop: vs(8)}}>Fair · 600–724 band</AppText>
          <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>↑ +22 pts vs last report (Nov 2025)</AppText>
        </View>

        {/* Risk Classification */}
        <AppText variant="sectionTitle" color={Colors.black} style={rs.sectionTitle}>Risk Classification</AppText>
        <View style={rs.riskGrid}>
          {[
            {label: 'Underwriting class', val: 'Standard+', sub: 'Manageable risk', badge: 'Loading applicable', bg: C.amberBg, color: C.amberText, badgeColor: C.amberDark},
            {label: 'Mortality risk', val: 'Elevated', sub: '3 chronic conditions', badge: '×1.35 multiplier', bg: C.redBg, color: C.redText, badgeColor: C.redDark},
            {label: 'Morbidity risk', val: 'Moderate', sub: 'Rising HbA1c trend', badge: '6-month review', bg: C.amberBg, color: C.amberText, badgeColor: C.amberDark},
            {label: 'Engagement', val: 'High', sub: '7-day streak · 23 sessions', badge: 'Positive signal', bg: C.greenBg, color: C.greenText, badgeColor: C.greenDark},
          ].map((r, i) => (
            <View key={i} style={[rs.riskBox, {backgroundColor: r.bg}]}>
              <AppText variant="small" color={Colors.textTertiary}>{r.label}</AppText>
              <AppText variant="bodyBold" color={r.color} style={{marginTop: vs(3)}}>{r.val}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{r.sub}</AppText>
              <View style={[rs.riskBadge, {borderColor: r.color + '60'}]}>
                <AppText variant="small" color={r.badgeColor} style={{fontWeight: '500'}}>{r.badge}</AppText>
              </View>
            </View>
          ))}
        </View>

        {/* Score Breakdown */}
        <AppText variant="sectionTitle" color={Colors.black} style={rs.sectionTitle}>HPS Score Breakdown</AppText>
        <View style={rs.card}>
          {[
            {name: 'Base (all enrollees)', weight: '—', score: '—', max: '300', earned: '300', calc: 'Fixed', pct: 100, color: Colors.textSecondary},
            {name: 'Biomarker progress', weight: '50%', score: '58', max: '300', earned: '174', calc: '58/100 × 300', pct: 58, color: C.red},
            {name: 'Lifestyle habits', weight: '30%', score: '50', max: '180', earned: '90', calc: '50/100 × 180', pct: 50, color: C.amber},
            {name: 'Medication engagement', weight: '20%', score: '78', max: '120', earned: '94', calc: '78/100 × 120', pct: 78, color: C.green},
          ].map((row, i) => (
            <View key={i} style={[rs.scoreRow, i === 0 && {backgroundColor: C.tealBg}]}>
              <View style={{flex: 1}}>
                <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '500'}}>{row.name}</AppText>
                <AppText variant="small" color={Colors.textTertiary}>{row.calc}</AppText>
              </View>
              <AppText variant="small" color={Colors.textTertiary} style={{width: s(35), textAlign: 'center'}}>{row.weight}</AppText>
              <AppText variant="bodyBold" color={row.color} style={{width: s(40), textAlign: 'center'}}>{row.earned}</AppText>
              {i > 0 ? <View style={{width: s(60)}}><ScoreBarCell pct={row.pct} color={row.color} /></View> : <View style={{width: s(60)}} />}
            </View>
          ))}
          <View style={rs.totalBar}>
            <AppText variant="bodyBold" color="rgba(255,255,255,0.85)">HPS Total = 300+174+90+94</AppText>
            <AppText style={rs.totalVal}>= 658</AppText>
          </View>
        </View>

        {/* Biomarker Detail */}
        <AppText variant="sectionTitle" color={Colors.black} style={rs.sectionTitle}>Biomarker Detail</AppText>
        {[
          {name: 'HbA1c', current: '7.8%', weight: '35%', status: {s: 38, c: C.red, d: '7.8% vs <7.0%'}, stability: {s: 45, c: C.amber, d: 'Rising 3 cycles'}, velocity: {s: 58, c: C.amber, d: '+0.3%/6 months'}, score: 44, scoreColor: C.redDark, contrib: '15.4', spark: [{h:12,c:C.green},{h:13,c:C.green},{h:15,c:C.amber},{h:17,c:C.amber},{h:20,c:C.red}], flag: 'Watch', flagType: 'r'},
          {name: 'Blood glucose', current: 'Avg: 8.4', weight: '25%', status: {s: 46, c: C.amber, d: '8.4 vs <7.0 mmol/L'}, stability: {s: 52, c: C.red, d: '6.8–11.2 range'}, velocity: {s: 68, c: C.amber, d: 'Slow rise'}, score: 52, scoreColor: C.amberDark, contrib: '13.0', spark: [{h:13,c:C.amber},{h:12,c:C.amber},{h:16,c:C.red},{h:15,c:C.amber},{h:18,c:C.red}], flag: 'Monitor', flagType: 'a'},
          {name: 'Blood pressure', current: '138/87 mmHg', weight: '20%', status: {s: 65, c: C.amber, d: 'Stage 1 HTN'}, stability: {s: 72, c: C.amber, d: '±6 mmHg var.'}, velocity: {s: 78, c: C.green, d: 'Flat, controlled'}, score: 70, scoreColor: C.amberDark, contrib: '14.0', spark: [{h:14,c:C.amber},{h:16,c:C.red},{h:13,c:C.amber},{h:14,c:C.amber},{h:14,c:C.amber}], flag: 'Stable', flagType: 'a'},
          {name: 'LDL Cholesterol', current: '118 mg/dL', weight: '10%', status: {s: 82, c: C.green, d: 'Within target'}, stability: {s: 85, c: C.green, d: 'Consistent ↓'}, velocity: {s: 92, c: C.green, d: '−14 mg/dL'}, score: 85, scoreColor: C.greenDark, contrib: '8.5', spark: [{h:20,c:C.amber},{h:17,c:C.amber},{h:15,c:C.green},{h:13,c:C.green},{h:11,c:C.green}], flag: 'Good', flagType: 'g'},
          {name: 'eGFR (Kidney)', current: '74 mL/min', weight: '10%', status: {s: 66, c: C.amber, d: 'Stage G2, mild'}, stability: {s: 72, c: C.amber, d: 'Flat, stable'}, velocity: {s: 76, c: C.amber, d: 'No deterioration'}, score: 70, scoreColor: C.amberDark, contrib: '7.0', spark: [{h:15,c:C.amber},{h:14,c:C.amber},{h:14,c:C.amber},{h:15,c:C.amber},{h:14,c:C.amber}], flag: 'Monitor', flagType: 'a'},
        ].map((bio, i) => (
          <View key={i} style={rs.bioCard}>
            <View style={rs.bioHead}>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold">{bio.name}</AppText>
                <AppText variant="small" color={Colors.textTertiary}>{bio.current} · {bio.weight}</AppText>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <AppText variant="bodyBold" color={bio.scoreColor}>{bio.score}<AppText variant="small" color={Colors.textTertiary}>/100</AppText></AppText>
                <AppText variant="small" color={Colors.textTertiary}>→ {bio.contrib} pts</AppText>
              </View>
            </View>
            <View style={rs.dimRow}>
              <DimScoreBar score={bio.status.s} color={bio.status.c} desc={bio.status.d} />
              <DimScoreBar score={bio.stability.s} color={bio.stability.c} desc={bio.stability.d} />
              <DimScoreBar score={bio.velocity.s} color={bio.velocity.c} desc={bio.velocity.d} />
            </View>
            <View style={rs.bioFooter}>
              <SparkBars data={bio.spark} />
              <StatusPill text={bio.flag} type={bio.flagType} />
            </View>
          </View>
        ))}

        {/* Population Benchmark */}
        <AppText variant="sectionTitle" color={Colors.black} style={rs.sectionTitle}>Population Benchmark</AppText>
        <View style={rs.popCard}>
          <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(10)}}>Cohort: Female · 35–45 yrs · T2D · Hyderabad (n=1,847)</AppText>
          <PopRow label="HPS overall" priyaPos={59} avgPos={68} priyaVal="658" avgVal="702" priyaColor={Colors.primary} />
          <PopRow label="HbA1c score" priyaPos={44} avgPos={62} priyaVal="44" avgVal="61" priyaColor={C.red} />
          <PopRow label="Medication" priyaPos={78} avgPos={64} priyaVal="78" avgVal="64" priyaColor={C.green} />
          <PopRow label="Lifestyle" priyaPos={50} avgPos={59} priyaVal="50" avgVal="59" priyaColor={C.amber} />
        </View>

        {/* Underwriting Recommendation */}
        <AppText variant="sectionTitle" color={Colors.black} style={rs.sectionTitle}>Underwriting Recommendation</AppText>
        <View style={rs.uwCard}>
          <View style={rs.uwTop}>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" color={C.amberText} style={{fontSize: ms(16)}}>Standard+ · Accept with loading</AppText>
              <AppText variant="small" color={C.amberDark} style={{marginTop: vs(2)}}>HPS 658 · Fair · 3 conditions · Rising HbA1c</AppText>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <AppText style={{fontSize: ms(22), fontWeight: '500', color: C.amberText}}>+35%</AppText>
              <AppText variant="small" color={C.amberDark}>Premium loading</AppText>
            </View>
          </View>

          {[
            {dot: C.red, text: 'HbA1c rising trend – 6.9% → 7.8%. Highest future CV/renal risk.', bold: 'HbA1c rising trend'},
            {dot: C.red, text: 'Eye exam overdue – 14 months. Recommend exam before issuance.', bold: 'Eye exam overdue'},
            {dot: C.amber, text: 'Metformin PM adherence 48/100 timing. Hospitalisation risk predictor.', bold: 'Metformin PM'},
            {dot: C.green, text: 'High engagement – 23 Ayu sessions. 18% lower claims in TL data.', bold: 'Positive: Engagement'},
          ].map((r, i) => (
            <View key={i} style={rs.uwReasonRow}>
              <View style={[rs.uwDot, {backgroundColor: r.dot}]} />
              <AppText variant="small" color={C.amberText} style={{flex: 1, lineHeight: ms(18)}}><AppText variant="small" style={{fontWeight: '500'}}>{r.bold}</AppText> – {r.text.split('–')[1] || r.text.split('. ')[1]}</AppText>
            </View>
          ))}

          <View style={rs.uwCondRow}>
            {[
              {text: 'T2D · +18%', bg: C.redBg, color: C.redText, border: '#F09595'},
              {text: 'HTN · +10%', bg: C.redBg, color: C.redText, border: '#F09595'},
              {text: 'Dyslip · +7%', bg: C.redBg, color: C.redText, border: '#F09595'},
              {text: 'Engage · −10%', bg: C.greenBg, color: C.greenText, border: '#9FE1CB'},
              {text: 'LDL ↓ · −5%', bg: C.greenBg, color: C.greenText, border: '#9FE1CB'},
            ].map((c, i) => (
              <View key={i} style={[rs.uwCondPill, {backgroundColor: c.bg, borderColor: c.border}]}>
                <AppText variant="small" color={c.color} style={{fontWeight: '500'}}>{c.text}</AppText>
              </View>
            ))}
          </View>
        </View>

        {/* HPS History */}
        <AppText variant="sectionTitle" color={Colors.black} style={rs.sectionTitle}>HPS Score History</AppText>
        <View style={rs.historyCard}>
          <View style={rs.historyBars}>
            {[
              {val: 582, h: 52, c: C.red, lbl: 'Sep 24'},
              {val: 614, h: 58, c: C.amber, lbl: 'Nov 24'},
              {val: 641, h: 64, c: C.amber, lbl: 'Jan 25'},
              {val: 688, h: 72, c: C.green, lbl: 'Mar 25'},
              {val: 672, h: 68, c: C.amber, lbl: 'May 25'},
              {val: 636, h: 60, c: C.amber, lbl: 'Sep 25'},
              {val: 636, h: 60, c: C.amber, lbl: 'Nov 25'},
              {val: 658, h: 65, c: Colors.primary, lbl: 'Mar 26'},
            ].map((b, i) => (
              <View key={i} style={rs.historyBarCol}>
                <AppText variant="small" color={i === 7 ? Colors.primary : Colors.textSecondary} style={{fontWeight: '500'}}>{b.val}</AppText>
                <View style={[rs.historyBar, {height: vs(b.h), backgroundColor: b.c}]} />
                <AppText variant="small" color={i === 7 ? Colors.primary : Colors.textTertiary} style={{fontWeight: i === 7 ? '500' : '400'}}>{b.lbl}</AppText>
              </View>
            ))}
          </View>
          <View style={rs.historyFooter}>
            <AppText variant="sectionTitle" color={Colors.black}>Range: <AppText variant="small" style={{fontWeight: '500'}}>582–688</AppText></AppText>
            <AppText variant="small" color={C.green} style={{fontWeight: '500'}}>↑ +76 pts</AppText>
          </View>
        </View>

        {/* Data Governance */}
        <AppText variant="sectionTitle" color={Colors.black} style={rs.sectionTitle}>Data Governance & Audit</AppText>
        <View style={rs.govGrid}>
          {[
            {family: 'Ionicons', name: 'bar-chart-outline', title: 'Data source', sub: 'Wearable · Manual · Lab API · EMR'},
            {family: 'Ionicons', name: 'checkmark-circle-outline', title: 'Patient consent', sub: 'Signed Mar 2026 · Revocable'},
            {family: 'MaterialCommunityIcons', name: 'bank-outline', title: 'Regulatory', sub: 'IRDAI · DPDP · HIPAA · ISO 27001'},
            {family: 'Ionicons', name: 'flask-outline', title: 'Model v3.2', sub: 'Validated 1.2M patient-months'},
            {family: 'Ionicons', name: 'clipboard-outline', title: 'Audit trail', sub: 'Every input traceable to source'},
            {family: 'Ionicons', name: 'scale-outline', title: 'Explainability', sub: 'Full calculation · No black box'},
          ].map((g, i) => (
            <View key={i} style={rs.govBox}>
              <Icon family={g.family} name={g.name} size={16} color={Colors.primary} />
              <AppText variant="caption" style={{fontWeight: '500', marginTop: vs(4)}}>{g.title}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{g.sub}</AppText>
            </View>
          ))}
        </View>

        {/* Actuarial Notes */}
        <View style={rs.notesCard}>
          <AppText variant="small" color={Colors.textSecondary} style={{lineHeight: ms(18)}}>
            <AppText variant="small" style={{fontWeight: '500'}}>Actuarial notes:</AppText> HPS is not a standalone underwriting decision tool. It supplements standard judgement. Insurers should apply their own actuarial calibration. Minimum 6-month data period recommended. Scores below 450 or above 850 trigger manual review.
          </AppText>
        </View>

        {/* Footer */}
        <View style={rs.reportFooter}>
          <View>
            <AppText variant="bodyBold" color={Colors.primary}>TrustLife Health Intelligence</AppText>
            <AppText variant="small" color={Colors.textTertiary}>health@trustlife.in</AppText>
          </View>
          <View style={{alignItems: 'flex-end'}}>
            <AppText variant="small" color={Colors.textTertiary}>Report TL-INS-2026-0322-4821</AppText>
            <AppText variant="small" color={Colors.textTertiary}>Confidential · Authorised access only</AppText>
          </View>
        </View>

        <View style={{height: vs(30)}} />
      </ScrollView>
    </View>
  );
};

const rs = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.white},
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingTop: vs(14), paddingBottom: vs(16)},
  headerTop: {flexDirection: 'row', alignItems: 'center', gap: s(12)},
  backBtn: {width: ms(36), height: ms(36), borderRadius: ms(18), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  body: {padding: s(16), paddingBottom: vs(40)},
  metaRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: vs(14)},
  reportTypeBadge: {backgroundColor: Colors.primary, paddingHorizontal: s(9), paddingVertical: vs(2), borderRadius: ms(20)},
  divider: {height: 1.5, backgroundColor: Colors.borderSecondary, marginBottom: vs(16)},
  patientRow: {marginBottom: vs(16)},
  consentRow: {flexDirection: 'row', alignItems: 'center', gap: s(5), marginTop: vs(6)},
  consentDot: {width: ms(6), height: ms(6), borderRadius: ms(3), backgroundColor: C.green},

  hpsSummary: {backgroundColor: C.tealBg, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderTertiary, padding: ms(16), marginBottom: vs(16)},
  hpsScoreNum: {fontSize: ms(46), fontWeight: '500', color: Colors.primary, lineHeight: ms(52)},
  hpsBandContainer: {position: 'relative', marginBottom: vs(6), paddingBottom: vs(4)},
  hpsBandRow: {flexDirection: 'row', height: vs(10), borderRadius: ms(5), overflow: 'hidden'},
  bandSeg: {flex: 1},
  hpsBandMarker: {position: 'absolute', top: vs(-3), left: '57.5%', width: ms(16), height: ms(16), borderRadius: ms(8), backgroundColor: C.amber, borderWidth: ms(3), borderColor: Colors.white, elevation: 3, shadowColor: '#000', shadowOffset: {width: 0, height: 1}, shadowOpacity: 0.25, shadowRadius: 2},
  hpsBandLabels: {flexDirection: 'row', justifyContent: 'space-between', paddingHorizontal: s(2)},

  sectionTitle: {textTransform: 'uppercase', letterSpacing: 0.8, marginBottom: vs(8), marginTop: vs(6), paddingBottom: vs(5), borderBottomWidth: 0.5, borderBottomColor: Colors.borderTertiary},

  riskGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8), marginBottom: vs(16)},
  riskBox: {width: '48%', borderRadius: ms(12), padding: ms(12)},
  riskBadge: {marginTop: vs(6), alignSelf: 'flex-start', paddingHorizontal: s(8), paddingVertical: vs(2), borderRadius: ms(20), borderWidth: 0.5},

  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderTertiary, overflow: 'hidden', marginBottom: vs(16)},
  scoreRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), paddingHorizontal: s(12), borderBottomWidth: 0.5, borderBottomColor: Colors.borderTertiary},
  scoreBarBg: {height: vs(4), backgroundColor: Colors.backgroundSecondary, borderRadius: ms(2), overflow: 'hidden'},
  scoreBarFill: {height: '100%', borderRadius: ms(2)},
  totalBar: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', backgroundColor: Colors.primary, padding: ms(12)},
  totalVal: {fontSize: ms(20), fontWeight: '500', color: Colors.white},

  bioCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: Colors.borderTertiary, marginBottom: vs(10), overflow: 'hidden'},
  bioHead: {flexDirection: 'row', alignItems: 'center', padding: ms(12), borderBottomWidth: 0.5, borderBottomColor: Colors.borderTertiary},
  dimRow: {flexDirection: 'row', borderBottomWidth: 0.5, borderBottomColor: Colors.borderTertiary},
  dimCell: {flex: 1, padding: ms(8), alignItems: 'center', borderRightWidth: 0.5, borderRightColor: Colors.borderTertiary},
  dimScoreRow: {flexDirection: 'row', alignItems: 'center', gap: s(4), width: '100%'},
  dimBarBg: {flex: 1, height: vs(3), backgroundColor: Colors.backgroundSecondary, borderRadius: ms(2), overflow: 'hidden'},
  dimBarFill: {height: '100%', borderRadius: ms(2)},
  bioFooter: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: ms(10)},
  sparkRow: {flexDirection: 'row', gap: s(2), alignItems: 'flex-end', height: vs(22)},
  sparkBar: {width: s(8), borderTopLeftRadius: ms(1), borderTopRightRadius: ms(1)},
  statusPill: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(20)},

  popCard: {backgroundColor: Colors.backgroundSecondary, borderRadius: ms(12), padding: ms(14), marginBottom: vs(16)},
  popRow: {flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(8)},
  popBarWrap: {flex: 1, height: vs(8), position: 'relative'},
  popBarBg: {height: '100%', backgroundColor: Colors.white, borderRadius: ms(4), overflow: 'hidden'},
  popBarFill: {height: '100%', borderRadius: ms(4)},
  popMarker: {position: 'absolute', top: vs(-4), width: ms(14), height: ms(14), borderRadius: ms(7), borderWidth: 2.5, borderColor: Colors.white},
  popMarkerDash: {position: 'absolute', top: vs(-4), width: ms(14), height: ms(14), borderRadius: ms(7), borderWidth: 2, borderColor: '#888780', borderStyle: 'dashed', backgroundColor: 'transparent'},

  uwCard: {backgroundColor: C.amberBg, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#FAC775', padding: ms(16), marginBottom: vs(16)},
  uwTop: {flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(14)},
  uwReasonRow: {flexDirection: 'row', gap: s(8), marginBottom: vs(7)},
  uwDot: {width: ms(6), height: ms(6), borderRadius: ms(3), marginTop: vs(5)},
  uwCondRow: {flexDirection: 'row', flexWrap: 'wrap', gap: s(6), marginTop: vs(10)},
  uwCondPill: {paddingHorizontal: s(9), paddingVertical: vs(3), borderRadius: ms(20), borderWidth: 0.5},

  historyCard: {backgroundColor: Colors.backgroundSecondary, borderRadius: ms(12), padding: ms(14), marginBottom: vs(16)},
  historyBars: {flexDirection: 'row', alignItems: 'flex-end', height: vs(100), marginBottom: vs(8)},
  historyBarCol: {flex: 1, alignItems: 'center', gap: vs(3)},
  historyBar: {width: '80%', borderTopLeftRadius: ms(3), borderTopRightRadius: ms(3)},
  historyFooter: {flexDirection: 'row', justifyContent: 'space-between', paddingTop: vs(8), borderTopWidth: 0.5, borderTopColor: Colors.borderTertiary},

  govGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: s(8), marginBottom: vs(16)},
  govBox: {width: '31%', backgroundColor: Colors.backgroundSecondary, borderRadius: ms(10), padding: ms(10)},

  notesCard: {backgroundColor: Colors.backgroundSecondary, borderRadius: ms(12), padding: ms(14), marginBottom: vs(14)},

  reportFooter: {flexDirection: 'row', justifyContent: 'space-between', borderTopWidth: 0.5, borderTopColor: Colors.borderTertiary, paddingTop: vs(14)},
});

export default HPSReportScreen;
