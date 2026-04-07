import React, {useState, useRef} from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity, TextInput, Platform} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const STEPS = ['Policy', 'Treatment', 'Expenses', 'Documents', 'Review'];
const MEMBERS = [{id: 'priya', name: 'Priya', sub: 'Self', icon: 'woman-outline'}, {id: 'raj', name: 'Raj', sub: 'Spouse', icon: 'man-outline'}, {id: 'aarav', name: 'Aarav', sub: 'Child', icon: 'happy-outline'}];
const CLAIM_TYPES = [
  {id: 'reimburse', name: 'Reimbursement', sub: 'Bills already paid', icon: 'receipt-outline'},
  {id: 'cashless', name: 'Cashless', sub: 'Planned hospital', icon: 'business-outline'},
  {id: 'opd', name: 'OPD', sub: 'Outpatient visit', icon: 'medkit-outline'},
  {id: 'daycare', name: 'Day care', sub: 'Under 24 hours', icon: 'flash-outline'},
];
const DIAGNOSES = ['Type 2 Diabetes (E11)', 'Hypertension (I10)', 'Dyslipidaemia', 'Anaemia (D50)', 'NAFLD', 'Migraine (G43)'];
const NATURE = [{id: 'chronic', name: 'Chronic', sub: 'Pre-existing', icon: 'sync-outline'}, {id: 'acute', name: 'Acute', sub: 'New onset', icon: 'flash-outline'}, {id: 'emergency', name: 'Emergency', sub: 'Urgent', icon: 'alert-circle-outline'}];
const PAYMENT_METHODS = [{id: 'upi', name: 'UPI / Online', sub: 'Google Pay, NEFT', icon: 'phone-portrait-outline'}, {id: 'card', name: 'Card / Cash', sub: 'Debit, credit or cash', icon: 'card-outline'}];

const EXPENSES = [
  {id: 'e1', icon: 'medkit-outline', name: 'Consultation \u00B7 Dr. Kavitha Sharma', sub: 'Apollo Clinic \u00B7 28 Mar 2026', amt: 800, attach: true},
  {id: 'e2', icon: 'flask-outline', name: 'CBC + HbA1c + Lipid panel', sub: 'TrustLab \u00B7 28 Mar 2026', amt: 2400, attach: true},
  {id: 'e3', icon: 'medical-outline', name: 'Metformin + Olmesartan + Ferrous sulphate', sub: 'Apollo Pharmacy \u00B7 28 Mar 2026', amt: 1250, attach: true},
  {id: 'e4', icon: 'scan-outline', name: 'Ultrasound abdomen \u00B7 NAFLD follow-up', sub: 'Apollo Diagnostics \u00B7 28 Mar 2026', amt: 1800, attach: true},
];

const DOC_GROUPS = [
  {title: 'Consultation \u00B7 Dr. Kavitha Sharma', icon: 'medkit-outline', docs: [
    {name: 'Prescription \u00B7 Dr. Kavitha Sharma', sub: 'Apollo Clinic \u00B7 28 Mar 2026 \u00B7 PDF \u00B7 3 medicines', linked: true, icon: 'document-text-outline'},
    {name: 'Clinical notes \u00B7 T2DM + HTN review', sub: 'Apollo Clinic \u00B7 28 Mar 2026 \u00B7 PDF \u00B7 1 page', linked: true, icon: 'document-text-outline'},
  ]},
  {title: 'Lab tests \u00B7 TrustLab', icon: 'flask-outline', docs: [
    {name: 'CBC + HbA1c + Lipid panel report', sub: 'TrustLab NABL \u00B7 28 Mar 2026 \u00B7 PDF \u00B7 6 tests', linked: true, icon: 'flask-outline'},
    {name: 'Iron panel \u00B7 Ferritin + B12 + Folate', sub: 'TrustLab NABL \u00B7 28 Mar 2026 \u00B7 PDF \u00B7 4 tests', linked: true, icon: 'beaker-outline'},
  ]},
  {title: 'Imaging \u00B7 Apollo Diagnostics', icon: 'scan-outline', docs: [
    {name: 'Ultrasound report \u00B7 Abdomen & Pelvis', sub: 'Apollo Diagnostics \u00B7 28 Mar 2026 \u00B7 PDF \u00B7 Dr. Suresh Nair', linked: true, icon: 'body-outline'},
  ]},
];
const OPTIONAL_DOCS = [
  {name: '90-day medication history', sub: 'TrustLife Records \u00B7 Auto-generated summary', icon: 'medical-outline'},
  {name: 'HbA1c trend \u00B7 12 months', sub: 'TrustLife Records \u00B7 Chart + data table', icon: 'analytics-outline'},
];

// Reusable
const Sec = ({title}) => (<View style={st.secLabel}><AppText variant="small" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.6, marginRight: s(8)}}>{title}</AppText><View style={st.secL} /></View>);
const Field = ({label, value, editable, style: extraStyle}) => (
  <View style={[st.field, extraStyle]}>
    <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.5, paddingHorizontal: ms(13), paddingTop: ms(10)}}>{label}</AppText>
    {editable ? <TextInput style={st.fieldInput} defaultValue={value} /> : <AppText variant="bodyBold" color={Colors.textPrimary} style={{paddingHorizontal: ms(13), paddingBottom: ms(11), paddingTop: ms(5)}}>{value}</AppText>}
  </View>
);

const ProgressBar = ({current, total, labels}) => (
  <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
    {Array.from({length: total}, (_, i) => {
      const step = i + 1; const done = step < current; const active = step === current;
      return (
        <React.Fragment key={i}>
          <View style={{alignItems: 'center'}}>
            <View style={[st.pDot, done && st.pDotDone, active && st.pDotActive]}>
              {done ? <Icon family="Ionicons" name="checkmark" size={ms(13)} color={Colors.white} /> :
              <AppText variant="caption" color={active ? Colors.primary : 'rgba(255,255,255,0.4)'} style={{fontWeight: '700'}}>{step}</AppText>}
            </View>
            <AppText variant="subtext" color={active ? Colors.white : 'rgba(255,255,255,0.4)'} style={{fontWeight: active ? '700' : '400', marginTop: vs(5)}}>{labels[i]}</AppText>
          </View>
          {i < total - 1 && <View style={{flex: 1, justifyContent: 'center', height: ms(28)}}><View style={{height: ms(2), backgroundColor: done ? Colors.accent : 'rgba(255,255,255,0.15)'}} /></View>}
        </React.Fragment>
      );
    })}
  </View>
);

const FileClaimScreen = ({navigation}) => {
  const insets = useSafeAreaInsets();
  const scrollRef = useRef(null);
  const [step, setStep] = useState(1);
  const [member, setMember] = useState('priya');
  const [claimType, setClaimType] = useState('reimburse');
  const [selectedDiag, setSelectedDiag] = useState(['Type 2 Diabetes (E11)', 'Hypertension (I10)']);
  const [nature, setNature] = useState('chronic');
  const [payMethod, setPayMethod] = useState('upi');
  const [optionalDocs, setOptionalDocs] = useState([]);
  const [declChecked, setDeclChecked] = useState(true);
  const [submitted, setSubmitted] = useState(false);

  const total = EXPENSES.reduce((s2, e) => s2 + e.amt, 0);
  const next = () => { if (step < 5) setStep(step + 1); else setSubmitted(true); scrollRef.current?.scrollTo({y: 0}); };
  const back = () => { if (step > 1) setStep(step - 1); scrollRef.current?.scrollTo({y: 0}); };

  if (submitted) {
    return (
      <View style={[st.container, {alignItems: 'center', justifyContent: 'center', padding: s(32)}]}>
        <StatusBar barStyle="dark-content" backgroundColor={Colors.background} />
        <View style={st.successCircle}><Icon family="Ionicons" name="checkmark" size={ms(40)} color={Colors.white} /></View>
        <AppText variant="header" color={Colors.textPrimary} style={{fontSize: ms(22), fontWeight: '800', marginBottom: vs(8)}}>Claim Submitted!</AppText>
        <AppText variant="body" color={Colors.textSecondary} style={{textAlign: 'center', marginBottom: vs(16)}}>Submitted to Star Health Insurance</AppText>
        <View style={st.refCard}>
          <AppText variant="subtext" color={Colors.textSecondary} style={{textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: vs(4)}}>Claim reference</AppText>
          <AppText variant="header" color={Colors.primary} style={{fontSize: ms(18), fontWeight: '800'}}>STH-2026-0328-{Math.floor(1000 + Math.random() * 9000)}</AppText>
        </View>
        <View style={{width: '100%', gap: vs(8), marginBottom: vs(16)}}>
          <View style={st.confirmRow}><Icon family="Ionicons" name="phone-portrait-outline" size={ms(18)} color={Colors.textSecondary} /><View><AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>SMS confirmation sent</AppText><AppText variant="small" color={Colors.textSecondary}>+91 98765 43210</AppText></View></View>
          <View style={[st.confirmRow, {backgroundColor: Colors.tealBg}]}><Icon family="Ionicons" name="cash-outline" size={ms(18)} color={Colors.primary} /><View><AppText variant="caption" color={Colors.primary} style={{fontWeight: '700'}}>{'\u20B9'}{total.toLocaleString('en-IN')} to HDFC 4821</AppText><AppText variant="small" color={Colors.textSecondary}>On approval</AppText></View></View>
        </View>
        <View style={{width: '100%', flexDirection: 'row', gap: s(8)}}>
          <TouchableOpacity style={[st.priBtn, {flex: 1}]} onPress={() => navigation.navigate('TrackClaims')}><AppText variant="bodyBold" color={Colors.white}>Track claim</AppText></TouchableOpacity>
          <TouchableOpacity style={[st.secBtn, {flex: 1}]} onPress={() => navigation.navigate('InsuranceClaims')}><AppText variant="bodyBold" color={Colors.textSecondary}>Done</AppText></TouchableOpacity>
        </View>
      </View>
    );
  }

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      <View style={[st.header, {paddingTop: insets.top + vs(8)}]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{marginBottom: vs(10)}}>
          <AppText variant="caption" color="rgba(255,255,255,0.6)">{'\u2039'} Claims Centre</AppText>
        </TouchableOpacity>
        <AppText variant="subtext" color="rgba(255,255,255,0.38)" style={{textTransform: 'uppercase', fontWeight: '700', letterSpacing: 0.8, marginBottom: vs(4)}}>Insurance {'\u00B7'} Claim</AppText>
        <AppText variant="screenName" color={Colors.white} style={{marginBottom: vs(14)}}>File a Claim</AppText>
        <ProgressBar current={step} total={5} labels={STEPS} />
      </View>

      <ScrollView ref={scrollRef} style={{flex: 1}} contentContainerStyle={{padding: s(13), paddingBottom: vs(40)}} showsVerticalScrollIndicator={false}>

        {/* ── STEP 1: Policy ── */}
        {step === 1 && (
          <View>
            {/* Insurance card */}
            <View style={st.insCard}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(14)}}>
                <View style={{width: ms(38), height: ms(38), borderRadius: ms(10), backgroundColor: Colors.white, alignItems: 'center', justifyContent: 'center'}}>
                  <Icon family="Ionicons" name="star" size={ms(18)} color={Colors.amber} />
                </View>
                <View style={{flex: 1}}>
                  <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(14)}}>Star Health Insurance</AppText>
                  <AppText variant="small" color="rgba(255,255,255,0.6)" style={{marginTop: vs(1)}}>Star Comprehensive {'\u2014'} Family Floater</AppText>
                </View>
                <View style={{backgroundColor: 'rgba(255,255,255,0.15)', paddingHorizontal: s(9), paddingVertical: vs(4), borderRadius: ms(8)}}>
                  <AppText variant="subtext" color="rgba(255,255,255,0.8)" style={{fontWeight: '700'}}>Active</AppText>
                </View>
              </View>
              <View style={st.insGrid}>
                <View style={st.insCell}><AppText style={st.insCellLbl}>Policy No.</AppText><AppText variant="caption" color={Colors.white} style={{fontWeight: '700'}}>P/211124/01/2024/001234</AppText></View>
                <View style={st.insCell}><AppText style={st.insCellLbl}>Sum insured</AppText><AppText variant="bodyBold" color={Colors.white}>{'\u20B9'}10,00,000</AppText></View>
                <View style={st.insCell}><AppText style={st.insCellLbl}>Valid till</AppText><AppText variant="bodyBold" color={Colors.white}>31 Mar 2027</AppText></View>
                <View style={st.insCell}><AppText style={st.insCellLbl}>Balance</AppText><AppText variant="bodyBold" color={Colors.paleGreen}>{'\u20B9'}9,12,400</AppText></View>
              </View>
              <AppText variant="subtext" color="rgba(255,255,255,0.4)" style={{textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(6)}}>Covered members</AppText>
              <View style={{flexDirection: 'row', gap: s(6)}}>
                {MEMBERS.map(m => (
                  <View key={m.id} style={{backgroundColor: m.id === 'priya' ? 'rgba(29,158,117,0.3)' : 'rgba(255,255,255,0.12)', borderRadius: ms(8), paddingHorizontal: s(10), paddingVertical: vs(5)}}>
                    <AppText variant="small" color={m.id === 'priya' ? Colors.paleGreen : 'rgba(255,255,255,0.8)'} style={{fontWeight: '600'}}>{m.name} ({m.sub})</AppText>
                  </View>
                ))}
              </View>
            </View>

            <Sec title="Claim for" />
            <View style={{flexDirection: 'row', gap: s(7), marginBottom: vs(8)}}>
              {MEMBERS.map(m => {
                const on = member === m.id;
                return (<TouchableOpacity key={m.id} style={[st.ctCard, on && st.ctCardOn]} onPress={() => setMember(m.id)} activeOpacity={0.7}>
                  <Icon family="Ionicons" name={m.icon} size={ms(22)} color={on ? Colors.primary : Colors.textSecondary} />
                  <AppText variant="caption" color={on ? Colors.primary : Colors.textPrimary} style={{fontWeight: '700', marginTop: vs(6)}}>{m.name}</AppText>
                  <AppText variant="subtext" color={Colors.textSecondary}>{m.sub}</AppText>
                </TouchableOpacity>);
              })}
            </View>

            <Sec title="Type of claim" />
            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(8), marginBottom: vs(8)}}>
              {CLAIM_TYPES.map(ct => {
                const on = claimType === ct.id;
                return (<TouchableOpacity key={ct.id} style={[st.ctCard, {width: '47%', flexGrow: 1, padding: ms(14)}, on && st.ctCardOn]} onPress={() => setClaimType(ct.id)} activeOpacity={0.7}>
                  <Icon family="Ionicons" name={ct.icon} size={ms(26)} color={on ? Colors.primary : Colors.textSecondary} />
                  <AppText variant="bodyBold" color={on ? Colors.primary : Colors.textPrimary} style={{marginTop: vs(7)}}>{ct.name}</AppText>
                  <AppText variant="subtext" color={Colors.textSecondary}>{ct.sub}</AppText>
                </TouchableOpacity>);
              })}
            </View>

            <Sec title="Dates" />
            <View style={{flexDirection: 'row', gap: s(8)}}>
              <Field label="Treatment date" value="28 Mar 2026" style={{flex: 1}} />
              <Field label="End / discharge" value="28 Mar 2026" style={{flex: 1}} />
            </View>
          </View>
        )}

        {/* ── STEP 2: Treatment ── */}
        {step === 2 && (
          <View>
            <View style={st.prefilled}><Icon family="Ionicons" name="sparkles-outline" size={ms(16)} color={Colors.tealText} /><AppText variant="caption" color={Colors.tealText} style={{flex: 1}}>Patient details pre-filled from your TrustLife profile.</AppText></View>
            <Sec title="Patient details" />
            <Field label="Patient name" value="Priya Reddy" />
            <View style={{flexDirection: 'row', gap: s(8)}}>
              <Field label="Age" value="38 years" style={{flex: 1}} />
              <Field label="Gender" value="Female" style={{flex: 1}} />
            </View>
            <Field label="ABHA / Health ID" value="priya.reddy@abdm" />

            <Sec title="Diagnosis" />
            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: ms(6), marginBottom: vs(8)}}>
              {DIAGNOSES.map(d => {
                const on = selectedDiag.includes(d);
                return (<TouchableOpacity key={d} style={[st.chip, on && st.chipOn]} onPress={() => setSelectedDiag(prev => prev.includes(d) ? prev.filter(x => x !== d) : [...prev, d])} activeOpacity={0.7}>
                  <AppText variant="caption" color={on ? Colors.tealText : Colors.textSecondary} style={{fontWeight: on ? '700' : '500'}}>{d}</AppText>
                </TouchableOpacity>);
              })}
            </View>

            <Sec title="Doctor & hospital" />
            <Field label="Treating doctor" value="Dr. Kavitha Sharma" editable />
            <Field label="MCI registration no." value="AP-45821" editable />
            <Field label="Hospital / clinic" value="Apollo Clinic, Banjara Hills" editable />
            <Field label="City" value="Hyderabad, Telangana" editable />

            <Sec title="Nature of illness" />
            <View style={{flexDirection: 'row', gap: s(7)}}>
              {NATURE.map(n => {
                const on = nature === n.id;
                return (<TouchableOpacity key={n.id} style={[st.ctCard, on && st.ctCardOn]} onPress={() => setNature(n.id)} activeOpacity={0.7}>
                  <Icon family="Ionicons" name={n.icon} size={ms(22)} color={on ? Colors.primary : Colors.textSecondary} />
                  <AppText variant="caption" color={on ? Colors.primary : Colors.textPrimary} style={{fontWeight: '700', marginTop: vs(6)}}>{n.name}</AppText>
                  <AppText variant="subtext" color={Colors.textSecondary}>{n.sub}</AppText>
                </TouchableOpacity>);
              })}
            </View>
          </View>
        )}

        {/* ── STEP 3: Expenses ── */}
        {step === 3 && (
          <View>
            {/* Add source buttons */}
            <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(16)}}>
              <TouchableOpacity style={st.addSrcBtn} activeOpacity={0.7} onPress={() => navigation.navigate('RecordPicker')}>
                <Icon family="Ionicons" name="folder-open-outline" size={ms(26)} color={Colors.primary} />
                <AppText variant="bodyBold" color={Colors.primary} style={{marginTop: vs(6)}}>Add from TrustLife</AppText>
                <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(3)}}>Pick visits, labs & meds</AppText>
              </TouchableOpacity>
              <TouchableOpacity style={st.addSrcBtn} activeOpacity={0.7}>
                <Icon family="Ionicons" name="camera-outline" size={ms(26)} color={Colors.primary} />
                <AppText variant="bodyBold" color={Colors.primary} style={{marginTop: vs(6)}}>Upload bill / invoice</AppText>
                <AppText variant="subtext" color={Colors.textSecondary} style={{marginTop: vs(3)}}>Fill details and photograph</AppText>
              </TouchableOpacity>
            </View>

            <Sec title={`Itemised expenses \u00B7 ${EXPENSES.length} items`} />
            {EXPENSES.map(e => (
              <View key={e.id} style={st.expRow}>
                <Icon family="Ionicons" name={e.icon} size={ms(20)} color={Colors.textSecondary} />
                <View style={{flex: 1, marginLeft: s(10)}}>
                  <AppText variant="bodyBold" color={Colors.textPrimary}>{e.name}</AppText>
                  <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{e.sub}</AppText>
                </View>
                <View style={{alignItems: 'flex-end', gap: vs(4)}}>
                  <AppText variant="bodyBold" color={Colors.primary} style={{fontSize: ms(14), fontWeight: '800'}}>{'\u20B9'}{e.amt.toLocaleString('en-IN')}</AppText>
                  <View style={{flexDirection: 'row', gap: s(5)}}>
                    {e.attach && <Icon family="Ionicons" name="attach-outline" size={ms(13)} color={Colors.textTertiary} />}
                    <Icon family="Ionicons" name="close-outline" size={ms(16)} color={Colors.red} />
                  </View>
                </View>
              </View>
            ))}

            <View style={st.totalBar}>
              <View>
                <AppText variant="caption" color="rgba(255,255,255,0.6)">Total claim amount</AppText>
                <AppText variant="small" color="rgba(255,255,255,0.4)" style={{marginTop: vs(2)}}>Subject to policy limits</AppText>
              </View>
              <AppText variant="header" color={Colors.white} style={{fontSize: ms(22), fontWeight: '800'}}>{'\u20B9'}{total.toLocaleString('en-IN')}</AppText>
            </View>

            <Sec title="Payment method" />
            <View style={{flexDirection: 'row', gap: s(7), marginBottom: vs(8)}}>
              {PAYMENT_METHODS.map(pm => {
                const on = payMethod === pm.id;
                return (<TouchableOpacity key={pm.id} style={[st.ctCard, on && st.ctCardOn]} onPress={() => setPayMethod(pm.id)} activeOpacity={0.7}>
                  <Icon family="Ionicons" name={pm.icon} size={ms(20)} color={on ? Colors.primary : Colors.textSecondary} />
                  <AppText variant="caption" color={on ? Colors.primary : Colors.textPrimary} style={{fontWeight: '700', marginTop: vs(6)}}>{pm.name}</AppText>
                  <AppText variant="subtext" color={Colors.textSecondary}>{pm.sub}</AppText>
                </TouchableOpacity>);
              })}
            </View>

            <Sec title="Reimbursement bank account" />
            <Field label="Account holder" value="Priya Reddy" />
            <Field label="Bank name" value="HDFC Bank" editable />
            <View style={{flexDirection: 'row', gap: s(8)}}>
              <Field label="Account number" value={'\u2022\u2022\u2022\u2022 \u2022\u2022\u2022\u2022 4821'} style={{flex: 1}} />
              <Field label="IFSC" value="HDFC0001234" editable style={{flex: 1}} />
            </View>
          </View>
        )}

        {/* ── STEP 4: Documents ── */}
        {step === 4 && (
          <View>
            <View style={st.prefilled}><Icon family="Ionicons" name="attach-outline" size={ms(16)} color={Colors.tealText} /><AppText variant="caption" color={Colors.tealText} style={{flex: 1, lineHeight: ms(16)}}>These are the medical records linked to your claimed expenses {'\u2014'} lab reports, doctor notes & prescriptions.</AppText></View>

            {DOC_GROUPS.map((group, gi) => (
              <View key={gi}>
                <Sec title={group.title} />
                {group.docs.map((doc, di) => (
                  <View key={di} style={st.docRow}>
                    <View style={[st.docCheck, st.docCheckOn]}><Icon family="Ionicons" name="checkmark" size={ms(12)} color={Colors.white} /></View>
                    <Icon family="Ionicons" name={doc.icon} size={ms(18)} color={Colors.textSecondary} />
                    <View style={{flex: 1}}>
                      <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(12)}}>{doc.name}</AppText>
                      <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(1)}}>{doc.sub}</AppText>
                    </View>
                    <View style={[st.docBadge, {backgroundColor: Colors.tealBg}]}>
                      <AppText variant="subtext" color={Colors.tealText} style={{fontWeight: '600'}}>Linked</AppText>
                    </View>
                  </View>
                ))}
              </View>
            ))}

            <Sec title="Optional" />
            {OPTIONAL_DOCS.map((doc, i) => {
              const on = optionalDocs.includes(doc.name);
              return (
                <TouchableOpacity key={i} style={st.docRow} onPress={() => setOptionalDocs(prev => prev.includes(doc.name) ? prev.filter(d => d !== doc.name) : [...prev, doc.name])} activeOpacity={0.7}>
                  <View style={[st.docCheck, on && st.docCheckOn]}>
                    {on && <Icon family="Ionicons" name="checkmark" size={ms(12)} color={Colors.white} />}
                  </View>
                  <Icon family="Ionicons" name={doc.icon} size={ms(18)} color={Colors.textSecondary} />
                  <View style={{flex: 1}}>
                    <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(12)}}>{doc.name}</AppText>
                    <AppText variant="subtext" color={Colors.textTertiary} style={{marginTop: vs(1)}}>{doc.sub}</AppText>
                  </View>
                  <View style={[st.docBadge, {backgroundColor: '#f0f0f0'}]}>
                    <AppText variant="subtext" color={Colors.textSecondary} style={{fontWeight: '600'}}>Optional</AppText>
                  </View>
                </TouchableOpacity>
              );
            })}

            <Sec title="Add more" />
            <TouchableOpacity style={st.uploadArea} activeOpacity={0.7}>
              <Icon family="Ionicons" name="camera-outline" size={ms(26)} color={Colors.tealText} />
              <AppText variant="bodyBold" color={Colors.tealText} style={{marginTop: vs(6)}}>Upload additional documents</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(3)}}>Discharge summary, referral letters, prior test reports</AppText>
            </TouchableOpacity>
          </View>
        )}

        {/* ── STEP 5: Review ── */}
        {step === 5 && (
          <View>
            {[
              {title: 'Star Health Insurance', icon: 'star-outline', rows: [['Policy No.', 'P/211124/01/2024/001234'], ['Claim type', 'Reimbursement \u00B7 OPD'], ['Claimant', 'Priya Reddy (Self)'], ['Treatment date', '28 Mar 2026']]},
              {title: 'Treatment', icon: 'business-outline', rows: [['Doctor', 'Dr. Kavitha Sharma \u00B7 AP-45821'], ['Hospital', 'Apollo Clinic, Banjara Hills'], ['Diagnosis', 'T2DM (E11) \u00B7 HTN (I10)']]},
            ].map((card, ci) => (
              <View key={ci} style={st.reviewCard}>
                <View style={st.reviewHdr}><AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>{card.title}</AppText></View>
                {card.rows.map((r, ri) => (
                  <View key={ri} style={st.reviewRow}><AppText variant="caption" color={Colors.textSecondary}>{r[0]}</AppText><AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600', textAlign: 'right', maxWidth: '55%'}}>{r[1]}</AppText></View>
                ))}
              </View>
            ))}

            {/* Expense summary */}
            <View style={st.reviewCard}>
              <View style={st.reviewHdr}><AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>Expense summary</AppText></View>
              {EXPENSES.map((e, i) => (
                <View key={i} style={st.reviewRow}><AppText variant="caption" color={Colors.textSecondary}>{e.name}</AppText><AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{'\u20B9'}{e.amt.toLocaleString('en-IN')}</AppText></View>
              ))}
              <View style={[st.reviewRow, {backgroundColor: Colors.background}]}>
                <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>Total</AppText>
                <AppText variant="bodyBold" color={Colors.primary} style={{fontSize: ms(15), fontWeight: '800'}}>{'\u20B9'}{total.toLocaleString('en-IN')}</AppText>
              </View>
            </View>

            {/* Documents review */}
            <View style={st.reviewCard}>
              <View style={st.reviewHdr}><AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>Documents ({DOC_GROUPS.reduce((a, g) => a + g.docs.length, 0)} attached)</AppText></View>
              {DOC_GROUPS.flatMap(g => g.docs).map((doc, i) => (
                <View key={i} style={st.reviewRow}><AppText variant="caption" color={Colors.textSecondary}>{doc.name}</AppText><Icon family="Ionicons" name="checkmark" size={ms(14)} color={Colors.accent} /></View>
              ))}
            </View>

            {/* Reimbursement review */}
            <View style={st.reviewCard}>
              <View style={st.reviewHdr}><AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '700'}}>Reimbursement to</AppText></View>
              {[['Account holder', 'Priya Reddy'], ['Bank', 'HDFC Bank'], ['Account', '\u2022\u2022\u2022\u2022 4821 \u00B7 HDFC0001234']].map((r, i) => (
                <View key={i} style={st.reviewRow}><AppText variant="caption" color={Colors.textSecondary}>{r[0]}</AppText><AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '600'}}>{r[1]}</AppText></View>
              ))}
            </View>

            {/* Declaration */}
            <TouchableOpacity style={st.declBox} onPress={() => setDeclChecked(!declChecked)} activeOpacity={0.7}>
              <View style={[st.declCheck, declChecked && st.declCheckOn]}>
                {declChecked && <Icon family="Ionicons" name="checkmark" size={ms(12)} color={Colors.white} />}
              </View>
              <AppText variant="small" color="#333" style={{flex: 1, lineHeight: ms(16)}}>I, <AppText style={{fontWeight: '700'}}>Priya Reddy</AppText>, declare that the above information is true and correct. I understand false information may result in claim rejection and policy cancellation.</AppText>
            </TouchableOpacity>

            <View style={{backgroundColor: Colors.amberBg, borderRadius: ms(10), padding: ms(9)}}>
              <AppText variant="small" color={Colors.amberDark} style={{lineHeight: ms(16)}}>Processing: 7{'\u2013'}14 working days. Status updates via TrustLife & SMS.</AppText>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Bottom bar */}
      <View style={st.bottomBar}>
        <TouchableOpacity style={[st.priBtn, step === 5 && {backgroundColor: Colors.accent}]} onPress={next} activeOpacity={0.8}>
          <AppText variant="bodyBold" color={Colors.white} style={{fontSize: ms(15)}}>{step === 5 ? 'Submit claim' : `Next \u00B7 ${STEPS[step] || ''}`}</AppText>
        </TouchableOpacity>
        <View style={{flexDirection: 'row', gap: s(8), marginTop: vs(8)}}>
          {step > 1 && <TouchableOpacity style={st.secBtn} onPress={back}><AppText variant="bodyBold" color={Colors.textSecondary}>{'\u2039'} Back</AppText></TouchableOpacity>}
          <TouchableOpacity style={[st.secBtn, step === 1 && {flex: 1}]}><AppText variant="bodyBold" color={Colors.textSecondary}>Save draft</AppText></TouchableOpacity>
        </View>
      </View>
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingBottom: vs(14)},
  pDot: {width: ms(28), height: ms(28), borderRadius: ms(14), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  pDotDone: {backgroundColor: Colors.accent},
  pDotActive: {backgroundColor: Colors.white, elevation: 2},
  pLine: {flex: 1, height: ms(2), backgroundColor: 'rgba(255,255,255,0.15)'},
  pLineDone: {backgroundColor: Colors.accent},
  insCard: {backgroundColor: Colors.primary, borderRadius: ms(18), padding: ms(18), marginBottom: vs(16)},
  insGrid: {flexDirection: 'row', flexWrap: 'wrap', gap: 1, backgroundColor: 'rgba(255,255,255,0.1)', borderRadius: ms(12), overflow: 'hidden', marginBottom: vs(12)},
  insCell: {width: '49%', flexGrow: 1, backgroundColor: 'rgba(0,0,0,0.2)', padding: ms(10)},
  insCellLbl: {fontSize: ms(8), color: 'rgba(255,255,255,0.4)', textTransform: 'uppercase', letterSpacing: 0.4, marginBottom: vs(3)},
  secLabel: {flexDirection: 'row', alignItems: 'center', marginTop: vs(18), marginBottom: vs(8)},
  secL: {flex: 1, height: StyleSheet.hairlineWidth, backgroundColor: '#dde8e2'},
  ctCard: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(11), alignItems: 'center'},
  ctCardOn: {borderColor: Colors.primary, backgroundColor: '#f0f7f4'},
  field: {backgroundColor: Colors.white, borderRadius: ms(13), borderWidth: 0.5, borderColor: '#dde8e2', marginBottom: vs(8), overflow: 'hidden'},
  fieldInput: {fontSize: ms(13), fontWeight: '500', color: Colors.textPrimary, paddingHorizontal: ms(13), paddingBottom: ms(11), paddingTop: ms(5)},
  chip: {paddingHorizontal: s(12), paddingVertical: vs(7), borderRadius: ms(22), borderWidth: 0.5, borderColor: '#dde8e2', backgroundColor: Colors.white},
  chipOn: {backgroundColor: Colors.tealBg, borderColor: Colors.paleGreen},
  prefilled: {backgroundColor: Colors.tealBg, borderRadius: ms(12), borderWidth: 0.5, borderColor: Colors.paleGreen, padding: ms(10), marginBottom: vs(14), flexDirection: 'row', alignItems: 'center', gap: s(8)},
  addSrcBtn: {flex: 1, backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(16), alignItems: 'center'},
  expRow: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(11), marginBottom: vs(7), flexDirection: 'row', alignItems: 'center'},
  totalBar: {backgroundColor: Colors.primary, borderRadius: ms(14), padding: ms(14), flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(8)},
  docRow: {backgroundColor: Colors.white, borderRadius: ms(12), borderWidth: 0.5, borderColor: '#dde8e2', padding: ms(11), marginBottom: vs(7), flexDirection: 'row', alignItems: 'center', gap: s(10)},
  docCheck: {width: ms(20), height: ms(20), borderRadius: ms(6), borderWidth: 0.5, borderColor: '#dde8e2', alignItems: 'center', justifyContent: 'center'},
  docCheckOn: {backgroundColor: Colors.accent, borderColor: Colors.accent},
  docBadge: {paddingHorizontal: s(7), paddingVertical: vs(2), borderRadius: ms(8)},
  uploadArea: {backgroundColor: Colors.background, borderRadius: ms(13), borderWidth: 0.5, borderStyle: 'dashed', borderColor: Colors.paleGreen, padding: ms(16), alignItems: 'center'},
  reviewCard: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#dde8e2', overflow: 'hidden', marginBottom: vs(10)},
  reviewHdr: {backgroundColor: Colors.background, padding: ms(10), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#dde8e2'},
  reviewRow: {flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', padding: ms(9), paddingHorizontal: s(13), borderBottomWidth: 0.5, borderBottomColor: '#f0f4f2'},
  declBox: {backgroundColor: Colors.tealBg, borderRadius: ms(13), borderWidth: 0.5, borderColor: Colors.paleGreen, padding: ms(12), marginBottom: vs(12), flexDirection: 'row', alignItems: 'flex-start', gap: s(10)},
  declCheck: {width: ms(20), height: ms(20), borderRadius: ms(6), borderWidth: 2, borderColor: Colors.accent, alignItems: 'center', justifyContent: 'center', marginTop: vs(1)},
  declCheckOn: {backgroundColor: Colors.accent},
  bottomBar: {backgroundColor: Colors.white, borderTopWidth: 0.5, borderTopColor: '#dde8e2', padding: ms(13), paddingBottom: Platform.OS === 'ios' ? vs(28) : vs(12)},
  priBtn: {backgroundColor: Colors.primary, borderRadius: ms(13), paddingVertical: vs(15), alignItems: 'center', justifyContent: 'center'},
  secBtn: {flex: 1, backgroundColor: Colors.background, borderRadius: ms(11), paddingVertical: vs(12), alignItems: 'center', justifyContent: 'center', borderWidth: 0.5, borderColor: '#dde8e2'},
  successCircle: {width: ms(90), height: ms(90), borderRadius: ms(45), backgroundColor: Colors.accent, alignItems: 'center', justifyContent: 'center', marginBottom: vs(20), elevation: 4},
  refCard: {backgroundColor: Colors.tealBg, borderRadius: ms(12), padding: ms(12), alignItems: 'center', marginBottom: vs(16), width: '100%'},
  confirmRow: {backgroundColor: Colors.background, borderRadius: ms(12), padding: ms(12), flexDirection: 'row', alignItems: 'center', gap: s(10)},
});

export default FileClaimScreen;
