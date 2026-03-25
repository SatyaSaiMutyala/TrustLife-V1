import React from 'react';
import {View, ScrollView, StyleSheet, StatusBar, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

// ─── Semantic color tokens ─────────────────────────────
const C = {
  redBg: '#FCEBEB', redText: '#791F1F', redDark: '#A32D2D', red: '#E24B4A',
  amberBg: '#FAEEDA', amberText: '#633806', amberDark: '#854F0B', amber: '#BA7517',
  greenBg: '#E1F5EE', greenText: '#085041', greenDark: '#0F6E56', green: '#1D9E75',
  blueBg: '#E6F1FB', blueText: '#0C447C', blueDark: '#185FA5',
  purpleBg: '#EEEDFE', purpleText: '#3C3489',
  pinkBg: '#FBEAF0',
};

// ─── Header icon mapping per key ───────────────────────
const headerMeta = {
  passport:     {icon: 'shield-checkmark-outline', family: 'Ionicons', subtitle: 'Your portable health identity'},
  timeline:     {icon: 'time-outline', family: 'Ionicons', subtitle: 'Your health journey over time'},
  preappt:      {icon: 'clipboard-outline', family: 'Ionicons', subtitle: 'Prepare for your next visit'},
  emergency:    {icon: 'alert-circle-outline', family: 'Ionicons', subtitle: 'Critical info when it matters'},
  nutrition:    {icon: 'nutrition-outline', family: 'Ionicons', subtitle: 'Condition-aware meal guidance'},
  medintel:     {icon: 'medkit-outline', family: 'Ionicons', subtitle: 'Your medication intelligence'},
  mental:       {icon: 'happy-outline', family: 'Ionicons', subtitle: 'Emotional wellbeing tracking'},
  ayupro:       {icon: 'chatbubble-ellipses-outline', family: 'Ionicons', subtitle: 'Proactive health nudges'},
  family:       {icon: 'people-outline', family: 'Ionicons', subtitle: 'Family health hub'},
  goals:        {icon: 'flag-outline', family: 'Ionicons', subtitle: 'Track your health goals'},
  preventive:   {icon: 'analytics-outline', family: 'Ionicons', subtitle: 'Predict & prevent'},
  spending:     {icon: 'wallet-outline', family: 'Ionicons', subtitle: 'Health spending & savings'},
  devices:      {icon: 'watch-outline', family: 'Ionicons', subtitle: 'Connected health devices'},
  doctorportal: {icon: 'person-outline', family: 'Ionicons', subtitle: 'Your doctor\'s view'},
};

// ─── Reusable tiny components ──────────────────────────
const Pill = ({text, bg, color}) => (
  <View style={[st.pill, {backgroundColor: bg}]}>
    <AppText variant="small" color={color} style={{fontWeight: '500'}}>{text}</AppText>
  </View>
);

const InfoBox = ({text, bg = C.greenBg, color = C.greenText, iconName = 'information-circle', iconFamily = 'Ionicons'}) => (
  <View style={[st.infoBox, {backgroundColor: bg}]}>
    <Icon family={iconFamily} name={iconName} size={16} color={color} />
    <AppText variant="caption" color={color} style={{flex: 1}}>{text}</AppText>
  </View>
);

const StatCell = ({value, label, bg = Colors.white}) => (
  <View style={[st.statCell, {backgroundColor: bg}]}>
    <AppText variant="header" color={Colors.textPrimary}>{value}</AppText>
    <AppText variant="small" color={Colors.textSecondary}>{label}</AppText>
  </View>
);

const SectionLabel = ({text}) => (
  <AppText variant="sectionTitle" color={Colors.textSecondary} style={{marginTop: vs(16), marginBottom: vs(8)}}>{text}</AppText>
);

const CtaButton = ({text, bg = Colors.primary, color = Colors.white, iconName, iconFamily = 'Ionicons', outline}) => (
  <TouchableOpacity style={[st.cta, outline ? {borderWidth: 1.5, borderColor: Colors.primary, backgroundColor: 'transparent'} : {backgroundColor: bg}]}>
    {iconName && <Icon family={iconFamily} name={iconName} size={16} color={outline ? Colors.primary : color} />}
    <AppText variant="bodyBold" color={outline ? Colors.primary : color}>{text}</AppText>
  </TouchableOpacity>
);

const Card = ({children, style}) => (
  <View style={[st.card, style]}>{children}</View>
);

const Row = ({iconName, iconFamily = 'Ionicons', iconBg = C.greenBg, iconColor = C.greenText, title, subtitle, right}) => (
  <View style={st.row}>
    <View style={[st.rowIcon, {backgroundColor: iconBg}]}>
      <Icon family={iconFamily} name={iconName} size={16} color={iconColor} />
    </View>
    <View style={{flex: 1}}>
      <AppText variant="bodyBold" color={Colors.textPrimary}>{title}</AppText>
      {subtitle ? <AppText variant="caption" color={Colors.textSecondary}>{subtitle}</AppText> : null}
    </View>
    {right || null}
  </View>
);

const ProgressBar = ({pct, color = C.green, bg = '#e5e7eb'}) => (
  <View style={[st.progBg, {backgroundColor: bg}]}>
    <View style={[st.progFill, {width: `${pct}%`, backgroundColor: color}]} />
  </View>
);

// ─── Content builders per key ──────────────────────────

const PassportContent = () => (
  <View>
    {/* Health Passport Card */}
    <Card style={{backgroundColor: '#0a3d30', borderColor: '#0a3d30'}}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(12)}}>
        <View style={[st.avatar, {backgroundColor: '#1D9E75'}]}>
          <Icon family="Ionicons" name="person" size={22} color={Colors.white} />
        </View>
        <View style={{flex: 1}}>
          <AppText variant="header" color={Colors.white}>Priya Rajesh</AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.6)">Female, 42 yrs  |  Blood: B+</AppText>
        </View>
        <View style={[st.pill, {backgroundColor: 'rgba(255,255,255,0.15)'}]}>
          <AppText variant="small" color={Colors.white} style={{fontWeight: '500'}}>Verified</AppText>
        </View>
      </View>
      {/* Conditions pills */}
      <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(6), marginBottom: vs(12)}}>
        <Pill text="Type 2 Diabetes" bg="rgba(255,255,255,0.12)" color={Colors.white} />
        <Pill text="Hypertension" bg="rgba(255,255,255,0.12)" color={Colors.white} />
        <Pill text="Dyslipidaemia" bg="rgba(255,255,255,0.12)" color={Colors.white} />
      </View>
      {/* Stats grid */}
      <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(12)}}>
        <View style={[st.statCell, {backgroundColor: 'rgba(255,255,255,0.1)', flex: 1}]}>
          <AppText variant="header" color={Colors.white}>62</AppText>
          <AppText variant="small" color="rgba(255,255,255,0.6)">HPS Score</AppText>
        </View>
        <View style={[st.statCell, {backgroundColor: 'rgba(255,255,255,0.1)', flex: 1}]}>
          <AppText variant="header" color="#E24B4A">7.8%</AppText>
          <AppText variant="small" color="rgba(255,255,255,0.6)">HbA1c</AppText>
        </View>
        <View style={[st.statCell, {backgroundColor: 'rgba(255,255,255,0.1)', flex: 1}]}>
          <AppText variant="header" color="#BA7517">138/88</AppText>
          <AppText variant="small" color="rgba(255,255,255,0.6)">BP mmHg</AppText>
        </View>
      </View>
      {/* Allergies */}
      <View style={{marginBottom: vs(8)}}>
        <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginBottom: vs(4)}}>ALLERGIES</AppText>
        <View style={{flexDirection: 'row', gap: s(6)}}>
          <Pill text="Sulfa drugs" bg="rgba(226,75,74,0.2)" color="#F09595" />
          <Pill text="Shellfish" bg="rgba(226,75,74,0.2)" color="#F09595" />
        </View>
      </View>
      {/* Medications */}
      <View style={{marginBottom: vs(8)}}>
        <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginBottom: vs(4)}}>MEDICATIONS</AppText>
        <AppText variant="caption" color="rgba(255,255,255,0.8)">Metformin 500mg BD, Telmisartan 40mg OD, Atorvastatin 10mg OD</AppText>
      </View>
      {/* Emergency contact */}
      <View style={{marginBottom: vs(12)}}>
        <AppText variant="small" color="rgba(255,255,255,0.5)" style={{marginBottom: vs(4)}}>EMERGENCY CONTACT</AppText>
        <AppText variant="caption" color="rgba(255,255,255,0.8)">Raj Rajesh (Husband) +91 98765 43210</AppText>
      </View>
      {/* QR share */}
      <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(6), backgroundColor: 'rgba(255,255,255,0.15)', borderRadius: ms(10), paddingVertical: vs(10)}}>
        <Icon family="Ionicons" name="qr-code-outline" size={18} color={Colors.white} />
        <AppText variant="bodyBold" color={Colors.white}>Share via QR</AppText>
      </TouchableOpacity>
    </Card>

    <View style={{gap: vs(10), marginTop: vs(12)}}>
      <CtaButton text="Share with doctor" iconName="share-outline" />
      <CtaButton text="Download PDF" iconName="download-outline" outline />
    </View>

    <SectionLabel text="INCLUDES" />
    <Card>
      <Row iconName="document-text-outline" iconBg={C.greenBg} iconColor={C.greenText} title="Active conditions & medications" subtitle="Always up to date" />
      <View style={st.divider} />
      <Row iconName="flask-outline" iconBg={C.blueBg} iconColor={C.blueText} title="Latest lab results" subtitle="HbA1c, lipids, kidney panel" />
      <View style={st.divider} />
      <Row iconName="alert-circle-outline" iconBg={C.redBg} iconColor={C.redDark} title="Allergies & alerts" subtitle="Highlighted for safety" />
      <View style={st.divider} />
      <Row iconName="call-outline" iconBg={C.amberBg} iconColor={C.amberDark} title="Emergency contacts" subtitle="Accessible in emergencies" />
    </Card>
  </View>
);

const TimelineContent = () => {
  const events = [
    {date: 'Mar 2026', title: 'HbA1c test result', desc: 'HbA1c 7.8% — up from 7.2%', color: C.red, icon: 'flask-outline'},
    {date: 'Sep 2025', title: '100-day streak', desc: '100 consecutive days of tracking + Flu vaccine administered', color: C.green, icon: 'trophy-outline', milestone: true},
    {date: 'Mar 2025', title: 'HbA1c personal best', desc: 'HbA1c 7.2% — best recorded value', color: C.green, icon: 'trending-down-outline'},
    {date: 'Jun 2022', title: 'Dyslipidaemia diagnosed', desc: 'LDL elevated, Atorvastatin 10mg started', color: C.amber, icon: 'add-circle-outline'},
    {date: 'Mar 2021', title: 'Hypertension diagnosed', desc: 'BP 148/92, Telmisartan 40mg started', color: C.amber, icon: 'add-circle-outline'},
    {date: 'Sep 2019', title: 'Type 2 Diabetes diagnosed', desc: 'Origin — HbA1c 9.1%, Metformin started', color: C.red, icon: 'flag-outline'},
  ];
  return (
    <View>
      {/* Stats grid */}
      <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(16)}}>
        <StatCell value="7 yrs" label="Health history" bg={Colors.white} />
        <StatCell value="24" label="Events" bg={Colors.white} />
        <StatCell value="12" label="Doctor visits" bg={Colors.white} />
        <StatCell value="3" label="Milestones" bg={Colors.white} />
      </View>
      {/* Timeline */}
      <Card>
        {events.map((e, i) => (
          <View key={i} style={{flexDirection: 'row', gap: s(12), paddingBottom: i < events.length - 1 ? vs(16) : 0}}>
            {/* Dot and line */}
            <View style={{alignItems: 'center', width: ms(24)}}>
              <View style={{width: ms(12), height: ms(12), borderRadius: ms(6), backgroundColor: e.color, marginTop: vs(2)}} />
              {i < events.length - 1 && <View style={{width: 2, flex: 1, backgroundColor: '#e5e7eb', marginTop: vs(4)}} />}
            </View>
            {/* Content */}
            <View style={{flex: 1, paddingBottom: i < events.length - 1 ? vs(4) : 0}}>
              <AppText variant="small" color={Colors.textTertiary}>{e.date}</AppText>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginTop: vs(2)}}>
                <Icon family="Ionicons" name={e.icon} size={14} color={e.color} />
                <AppText variant="bodyBold" color={Colors.textPrimary}>{e.title}</AppText>
              </View>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{e.desc}</AppText>
              {e.milestone && <Pill text="Milestone" bg={C.greenBg} color={C.greenText} />}
            </View>
          </View>
        ))}
      </Card>
    </View>
  );
};

const PreapptContent = () => {
  const changes = [
    {label: 'HbA1c', from: '7.2%', to: '7.8%', status: 'Worse', color: C.redDark, bg: C.redBg, icon: 'trending-up-outline'},
    {label: 'LDL', from: '142', to: '128 mg/dL', status: 'Better', color: C.greenText, bg: C.greenBg, icon: 'trending-down-outline'},
    {label: 'Sleep avg', from: '6.8 hrs', to: '5.9 hrs', status: 'Worse', color: C.redDark, bg: C.redBg, icon: 'trending-up-outline'},
    {label: 'Metformin adherence', from: '92%', to: '71%', status: 'Worse', color: C.redDark, bg: C.redBg, icon: 'trending-up-outline'},
  ];
  const questions = [
    'Should we adjust Metformin dosage given rising HbA1c?',
    'Is my kidney function stable enough for current meds?',
    'Can poor sleep alone explain 0.6% HbA1c rise?',
    'Should I get a retinal screening this year?',
  ];
  return (
    <View>
      <InfoBox text="Ayu has prepared a brief for your appointment with Dr. Kavitha on 28 Mar 2026." bg={C.greenBg} color={C.greenText} />

      <SectionLabel text="WHAT CHANGED SINCE SEP 2025" />
      <Card>
        {changes.map((c, i) => (
          <View key={i}>
            <View style={st.row}>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold" color={Colors.textPrimary}>{c.label}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>{c.from} {'\u2192'} {c.to}</AppText>
              </View>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: s(4)}}>
                <Icon family="Ionicons" name={c.icon} size={14} color={c.color} />
                <Pill text={c.status} bg={c.bg} color={c.color} />
              </View>
            </View>
            {i < changes.length - 1 && <View style={st.divider} />}
          </View>
        ))}
      </Card>

      <SectionLabel text="QUESTIONS AYU SUGGESTS" />
      <Card>
        {questions.map((q, i) => (
          <View key={i}>
            <View style={{flexDirection: 'row', gap: s(8), paddingVertical: vs(6)}}>
              <Icon family="Ionicons" name="help-circle-outline" size={16} color={Colors.primary} />
              <AppText variant="body" color={Colors.textPrimary} style={{flex: 1}}>{q}</AppText>
            </View>
            {i < questions.length - 1 && <View style={st.divider} />}
          </View>
        ))}
      </Card>

      <SectionLabel text="DOCTOR BRIEF" />
      <Card>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(4)}}>Auto-generated summary for Dr. Kavitha</AppText>
        <AppText variant="body" color={Colors.textPrimary}>
          42F with T2D (7 yrs), HTN, Dyslipidaemia. HbA1c worsened 7.2 {'\u2192'} 7.8% over 6 months.
          Primary driver: poor sleep (avg 5.9 hrs) and declining Metformin adherence (71%).
          LDL improved to 128 with Atorvastatin. BP borderline at 138/88.
        </AppText>
      </Card>

      <View style={{marginTop: vs(12)}}>
        <CtaButton text="Share brief with Dr. Kavitha" iconName="share-outline" />
      </View>
    </View>
  );
};

const EmergencyContent = () => (
  <View>
    {/* Dark emergency card */}
    <Card style={{backgroundColor: '#1a1a1a', borderColor: '#333'}}>
      <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(14)}}>
        <View style={[st.avatar, {backgroundColor: '#333'}]}>
          <Icon family="Ionicons" name="person" size={22} color={Colors.white} />
        </View>
        <View style={{flex: 1}}>
          <AppText variant="header" color={Colors.white}>Priya Rajesh</AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.5)">Female, 42 yrs  |  Blood: B+</AppText>
        </View>
      </View>

      {/* Conditions */}
      <View style={{marginBottom: vs(12)}}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(6)}}>
          <Icon family="Ionicons" name="alert-circle" size={14} color={C.red} />
          <AppText variant="small" color="rgba(255,255,255,0.5)" style={{textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.3}}>Conditions</AppText>
        </View>
        <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(6)}}>
          <Pill text="Type 2 Diabetes" bg="rgba(226,75,74,0.15)" color="#F09595" />
          <Pill text="Hypertension" bg="rgba(226,75,74,0.15)" color="#F09595" />
          <Pill text="Dyslipidaemia" bg="rgba(226,75,74,0.15)" color="#F09595" />
        </View>
      </View>

      {/* Medications */}
      <View style={{marginBottom: vs(12)}}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(6)}}>
          <Icon family="Ionicons" name="medkit" size={14} color={C.amber} />
          <AppText variant="small" color="rgba(255,255,255,0.5)" style={{textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.3}}>Medications</AppText>
        </View>
        <AppText variant="caption" color="rgba(255,255,255,0.8)">Metformin 500mg BD</AppText>
        <AppText variant="caption" color="rgba(255,255,255,0.8)">Telmisartan 40mg OD</AppText>
        <AppText variant="caption" color="rgba(255,255,255,0.8)">Atorvastatin 10mg OD</AppText>
      </View>

      {/* Allergies */}
      <View style={{marginBottom: vs(12), borderWidth: 1, borderColor: 'rgba(226,75,74,0.4)', borderRadius: ms(10), padding: ms(10)}}>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(6)}}>
          <Icon family="Ionicons" name="warning" size={14} color={C.red} />
          <AppText variant="small" color={C.red} style={{textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.3}}>Allergies</AppText>
        </View>
        <View style={{flexDirection: 'row', gap: s(6)}}>
          <Pill text="Sulfa drugs" bg="rgba(226,75,74,0.2)" color="#F09595" />
          <Pill text="Shellfish" bg="rgba(226,75,74,0.2)" color="#F09595" />
        </View>
      </View>

      {/* Emergency contacts */}
      <View>
        <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(6)}}>
          <Icon family="Ionicons" name="call" size={14} color={C.green} />
          <AppText variant="small" color="rgba(255,255,255,0.5)" style={{textTransform: 'uppercase', fontWeight: '600', letterSpacing: 0.3}}>Emergency Contacts</AppText>
        </View>
        <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: vs(4)}}>
          <View>
            <AppText variant="body" color={Colors.white}>Raj Rajesh</AppText>
            <AppText variant="caption" color="rgba(255,255,255,0.5)">Husband</AppText>
          </View>
          <TouchableOpacity style={{flexDirection: 'row', alignItems: 'center', gap: s(4), backgroundColor: 'rgba(29,158,117,0.2)', paddingVertical: vs(4), paddingHorizontal: s(10), borderRadius: ms(20)}}>
            <Icon family="Ionicons" name="call" size={14} color={C.green} />
            <AppText variant="caption" color={C.green}>+91 98765 43210</AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Card>

    <InfoBox text="This card can be shown from your lock screen without unlocking your phone." bg={C.blueBg} color={C.blueText} iconName="information-circle" />

    <View style={{marginTop: vs(12)}}>
      <CtaButton text="Set up lock screen card" iconName="phone-portrait-outline" />
    </View>
  </View>
);

const NutritionContent = () => {
  const meals = [
    {name: 'Breakfast', desc: 'Oats upma with vegetables', gi: 52, color: C.green, time: '8:15 AM'},
    {name: 'Lunch', desc: 'Brown rice, dal, sabzi, curd', gi: 61, color: C.amber, time: '1:00 PM'},
    {name: 'Dinner', desc: 'Not logged yet', gi: null, color: Colors.textTertiary, time: '--'},
  ];
  return (
    <View>
      <InfoBox text="Your diet needs adjustment for Type 2 Diabetes and Dyslipidaemia. High-GI foods are spiking post-meal glucose." bg={C.amberBg} color={C.amberDark} iconName="warning-outline" />

      {/* Stats grid */}
      <View style={{flexDirection: 'row', gap: s(8), marginTop: vs(12)}}>
        <StatCell value="1,420" label="kcal today" />
        <StatCell value="58" label="Avg GI score" />
        <StatCell value="42g" label="Fibre intake" />
      </View>

      <SectionLabel text="MEALS TODAY" />
      <Card>
        {meals.map((m, i) => (
          <View key={i}>
            <View style={st.row}>
              <View style={{flex: 1}}>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
                  <AppText variant="bodyBold" color={Colors.textPrimary}>{m.name}</AppText>
                  <AppText variant="small" color={Colors.textTertiary}>{m.time}</AppText>
                </View>
                <AppText variant="caption" color={Colors.textSecondary}>{m.desc}</AppText>
              </View>
              {m.gi !== null && (
                <View style={[st.pill, {backgroundColor: m.color === C.green ? C.greenBg : C.amberBg}]}>
                  <AppText variant="small" color={m.color} style={{fontWeight: '600'}}>GI {m.gi}</AppText>
                </View>
              )}
            </View>
            {i < meals.length - 1 && <View style={st.divider} />}
          </View>
        ))}
      </Card>

      <SectionLabel text="CONDITION-SPECIFIC FOOD RULES" />
      <Card>
        <AppText variant="bodyBold" color={C.greenText} style={{marginBottom: vs(6)}}>
          <Icon family="Ionicons" name="checkmark-circle" size={14} color={C.green} />  Do eat
        </AppText>
        {['Whole grains (brown rice, millets, oats)', 'Leafy greens, bitter gourd, fenugreek', 'Omega-3 fish (salmon, mackerel)', 'Nuts, seeds, legumes'].map((item, i) => (
          <View key={i} style={{flexDirection: 'row', gap: s(6), marginBottom: vs(4)}}>
            <Icon family="Ionicons" name="checkmark" size={12} color={C.green} />
            <AppText variant="caption" color={Colors.textPrimary}>{item}</AppText>
          </View>
        ))}
        <View style={[st.divider, {marginVertical: vs(10)}]} />
        <AppText variant="bodyBold" color={C.redDark} style={{marginBottom: vs(6)}}>
          <Icon family="Ionicons" name="close-circle" size={14} color={C.red} />  Avoid
        </AppText>
        {['White rice, maida, refined carbs', 'Sugary drinks, fruit juices', 'Fried foods, trans fats', 'High-sodium pickles, papads'].map((item, i) => (
          <View key={i} style={{flexDirection: 'row', gap: s(6), marginBottom: vs(4)}}>
            <Icon family="Ionicons" name="close" size={12} color={C.red} />
            <AppText variant="caption" color={Colors.textPrimary}>{item}</AppText>
          </View>
        ))}
      </Card>
    </View>
  );
};

const MedintelContent = () => {
  const meds = [
    {
      name: 'Metformin 500mg', freq: 'Twice daily', purpose: 'First-line therapy for Type 2 Diabetes. Reduces liver glucose production and improves insulin sensitivity.',
      watch: 'GI discomfort (nausea, diarrhoea) in first 2 weeks. Monitor kidney function annually.',
      avoid: 'Alcohol in excess. Hold 48 hrs before contrast dye procedures.',
      color: C.green, bg: C.greenBg,
    },
    {
      name: 'Telmisartan 40mg', freq: 'Once daily (morning)', purpose: 'ARB for hypertension. Also provides kidney protection in diabetes.',
      watch: 'Dizziness on standing. Monitor potassium and creatinine.',
      avoid: 'NSAIDs (ibuprofen). Potassium supplements without doctor advice.',
      color: C.blueDark, bg: C.blueBg,
    },
    {
      name: 'Atorvastatin 10mg', freq: 'Once daily (night)', purpose: 'Statin to lower LDL cholesterol and reduce cardiovascular risk.',
      watch: 'Muscle pain or weakness. Report unexplained fatigue.',
      avoid: 'Grapefruit juice. Excessive alcohol.',
      color: C.purpleText, bg: C.purpleBg,
    },
  ];
  return (
    <View>
      <InfoBox text="No interactions detected between your current medications." bg={C.greenBg} color={C.greenText} iconName="checkmark-circle" />

      <SectionLabel text="YOUR MEDICATIONS" />
      {meds.map((m, i) => (
        <Card key={i} style={{marginBottom: vs(10)}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(10)}}>
            <View style={[st.rowIcon, {backgroundColor: m.bg}]}>
              <Icon family="Ionicons" name="medkit" size={16} color={m.color} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>{m.name}</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>{m.freq}</AppText>
            </View>
          </View>
          <View style={{gap: vs(8)}}>
            <View>
              <AppText variant="small" color={Colors.textTertiary} style={{fontWeight: '600', textTransform: 'uppercase', marginBottom: vs(2)}}>Purpose</AppText>
              <AppText variant="caption" color={Colors.textPrimary}>{m.purpose}</AppText>
            </View>
            <View>
              <AppText variant="small" color={C.amberDark} style={{fontWeight: '600', textTransform: 'uppercase', marginBottom: vs(2)}}>Watch for</AppText>
              <AppText variant="caption" color={Colors.textPrimary}>{m.watch}</AppText>
            </View>
            <View>
              <AppText variant="small" color={C.redDark} style={{fontWeight: '600', textTransform: 'uppercase', marginBottom: vs(2)}}>Avoid</AppText>
              <AppText variant="caption" color={Colors.textPrimary}>{m.avoid}</AppText>
            </View>
          </View>
        </Card>
      ))}

      <CtaButton text="Check new interaction" iconName="search-outline" />
    </View>
  );
};

const MentalContent = () => {
  const moods = [
    {icon: 'sad-outline', label: 'Bad', color: C.red},
    {icon: 'sad-outline', label: 'Low', color: C.amber},
    {icon: 'remove-circle-outline', label: 'Okay', color: Colors.textTertiary},
    {icon: 'happy-outline', label: 'Good', color: C.green},
    {icon: 'happy-outline', label: 'Great', color: Colors.primary},
  ];
  return (
    <View>
      {/* Wellbeing score card */}
      <Card style={{backgroundColor: Colors.primary, borderColor: Colors.primary}}>
        <View style={{alignItems: 'center', paddingVertical: vs(8)}}>
          <AppText variant="small" color="rgba(255,255,255,0.6)" style={{marginBottom: vs(4)}}>Wellbeing Score</AppText>
          <AppText variant="screenName" color={Colors.white} style={{fontSize: ms(36), lineHeight: ms(42)}}>62</AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.6)">out of 100</AppText>
        </View>
        <View style={{flexDirection: 'row', gap: s(8), marginTop: vs(12)}}>
          <View style={[st.statCell, {backgroundColor: 'rgba(255,255,255,0.1)', flex: 1}]}>
            <AppText variant="bodyBold" color={C.amber}>8</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">PHQ-9</AppText>
          </View>
          <View style={[st.statCell, {backgroundColor: 'rgba(255,255,255,0.1)', flex: 1}]}>
            <AppText variant="bodyBold" color={C.amber}>6</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">GAD-7</AppText>
          </View>
          <View style={[st.statCell, {backgroundColor: 'rgba(255,255,255,0.1)', flex: 1}]}>
            <AppText variant="bodyBold" color={Colors.white}>42ms</AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">HRV</AppText>
          </View>
        </View>
      </Card>

      <SectionLabel text="HOW ARE YOU FEELING?" />
      <Card>
        <View style={{flexDirection: 'row', justifyContent: 'space-around', paddingVertical: vs(8)}}>
          {moods.map((m, i) => (
            <TouchableOpacity key={i} style={{alignItems: 'center', gap: vs(4)}}>
              <View style={{width: ms(40), height: ms(40), borderRadius: ms(20), backgroundColor: i === 3 ? C.greenBg : Colors.background, alignItems: 'center', justifyContent: 'center', borderWidth: i === 3 ? 2 : 0, borderColor: i === 3 ? C.green : 'transparent'}}>
                <Icon family="Ionicons" name={m.icon} size={22} color={m.color} />
              </View>
              <AppText variant="small" color={m.color}>{m.label}</AppText>
            </TouchableOpacity>
          ))}
        </View>
      </Card>

      <SectionLabel text="SUPPORT" />
      <Card>
        <Row iconName="chatbubbles-outline" iconBg={C.purpleBg} iconColor={C.purpleText} title="Talk to a counsellor" subtitle="Free sessions via TrustLife Care" right={<Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.textTertiary} />} />
      </Card>

      <View style={{marginTop: vs(12)}}>
        <CtaButton text="Book counselling session" iconName="calendar-outline" />
      </View>
    </View>
  );
};

const AyuproContent = () => {
  const messages = [
    {title: 'Weekly health brief', desc: 'HbA1c trending up, sleep needs attention. Here\'s your plan.', time: 'Mon 9:00 AM', icon: 'document-text-outline', bg: C.greenBg, color: C.greenText},
    {title: 'Pattern alert', desc: 'PM Metformin missed 3 of last 5 days. Setting up reminder.', time: 'Wed 8:15 PM', icon: 'alert-circle-outline', bg: C.amberBg, color: C.amberDark},
    {title: 'Celebration', desc: 'You hit 8,000+ steps 3 days in a row! Keep it up.', time: 'Thu 6:30 PM', icon: 'trophy-outline', bg: C.greenBg, color: C.greenText},
    {title: 'Pre-test prep', desc: 'HbA1c test in 14 days. Here\'s how to optimise your readings.', time: 'Fri 10:00 AM', icon: 'flask-outline', bg: C.blueBg, color: C.blueText},
  ];
  const toggles = [
    {label: 'Weekly health brief', on: true},
    {label: 'Pattern alerts', on: true},
    {label: 'Celebration messages', on: true},
    {label: 'Pre-test reminders', on: true},
    {label: 'Medication reminders', on: false},
  ];
  return (
    <View>
      <SectionLabel text="AYU'S MESSAGES THIS WEEK" />
      {messages.map((m, i) => (
        <Card key={i} style={{marginBottom: vs(8)}}>
          <View style={{flexDirection: 'row', gap: s(10)}}>
            <View style={[st.rowIcon, {backgroundColor: m.bg}]}>
              <Icon family="Ionicons" name={m.icon} size={16} color={m.color} />
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center'}}>
                <AppText variant="bodyBold" color={Colors.textPrimary}>{m.title}</AppText>
                <AppText variant="small" color={Colors.textTertiary}>{m.time}</AppText>
              </View>
              <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{m.desc}</AppText>
            </View>
          </View>
        </Card>
      ))}

      <SectionLabel text="CONFIGURE MESSAGES" />
      <Card>
        {toggles.map((t, i) => (
          <View key={i}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: vs(8)}}>
              <AppText variant="body" color={Colors.textPrimary}>{t.label}</AppText>
              <View style={{width: ms(40), height: ms(22), borderRadius: ms(11), backgroundColor: t.on ? Colors.primary : '#e5e7eb', justifyContent: 'center', paddingHorizontal: ms(2)}}>
                <View style={{width: ms(18), height: ms(18), borderRadius: ms(9), backgroundColor: Colors.white, alignSelf: t.on ? 'flex-end' : 'flex-start'}} />
              </View>
            </View>
            {i < toggles.length - 1 && <View style={st.divider} />}
          </View>
        ))}
      </Card>
    </View>
  );
};

const FamilyContent = () => {
  const members = [
    {name: 'Priya Rajesh', relation: 'You', icon: 'person', hps: 62, color: C.amber},
    {name: 'Raj Rajesh', relation: 'Husband', icon: 'person', hps: 78, color: C.green},
    {name: 'Sunita Rajesh', relation: 'Mother-in-law', icon: 'person', hps: 45, color: C.red, alert: true},
    {name: 'Aarav Rajesh', relation: 'Son, 14 yrs', icon: 'person', hps: 91, color: C.green},
  ];
  return (
    <View>
      <SectionLabel text="FAMILY MEMBERS" />
      {members.map((m, i) => (
        <Card key={i} style={{marginBottom: vs(8)}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10)}}>
            <View style={[st.avatar, {backgroundColor: C.greenBg, width: ms(40), height: ms(40), borderRadius: ms(20)}]}>
              <Icon family="Ionicons" name={m.icon} size={20} color={Colors.primary} />
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
                <AppText variant="bodyBold" color={Colors.textPrimary}>{m.name}</AppText>
                {m.alert && <Icon family="Ionicons" name="alert-circle" size={14} color={C.red} />}
              </View>
              <AppText variant="caption" color={Colors.textSecondary}>{m.relation}</AppText>
            </View>
            <View style={{alignItems: 'center'}}>
              <AppText variant="bodyBold" color={m.color}>{m.hps}</AppText>
              <AppText variant="small" color={Colors.textTertiary}>HPS</AppText>
            </View>
            <Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.textTertiary} />
          </View>
        </Card>
      ))}

      {/* Alert for Sunita */}
      <InfoBox text="Sunita's HPS dropped below 50. She may need a check-up. Tap to view her profile." bg={C.redBg} color={C.redDark} iconName="alert-circle" />

      <SectionLabel text="CAREGIVER ACTIONS" />
      <Card>
        <Row iconName="notifications-outline" iconBg={C.amberBg} iconColor={C.amberDark} title="Set medication reminders" subtitle="For family members you care for" right={<Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.textTertiary} />} />
        <View style={st.divider} />
        <Row iconName="document-text-outline" iconBg={C.blueBg} iconColor={C.blueText} title="View shared health reports" subtitle="Reports shared with you" right={<Icon family="Ionicons" name="chevron-forward" size={16} color={Colors.textTertiary} />} />
      </Card>

      <View style={{marginTop: vs(12)}}>
        <CtaButton text="Add family member" iconName="person-add-outline" />
      </View>
    </View>
  );
};

const GoalsContent = () => {
  const goals = [
    {title: 'Lower HbA1c to 7.0%', current: '7.8%', target: '7.0%', pct: 35, color: C.red, icon: 'flask-outline', bg: C.redBg},
    {title: 'Walk 10,000 steps daily', current: '8,240 avg', target: '10,000', pct: 82, color: C.amber, icon: 'walk-outline', bg: C.amberBg},
    {title: 'Sleep 7.5 hrs nightly', current: '5.9 avg', target: '7.5 hrs', pct: 55, color: C.red, icon: 'moon-outline', bg: C.redBg},
  ];
  const milestones = [
    {title: '100-day tracking streak', date: 'Sep 2025', icon: 'trophy-outline'},
    {title: 'HbA1c personal best 7.2%', date: 'Mar 2025', icon: 'trending-down-outline'},
    {title: 'First 10k step day', date: 'Jan 2025', icon: 'walk-outline'},
  ];
  return (
    <View>
      <SectionLabel text="ACTIVE GOALS" />
      {goals.map((g, i) => (
        <Card key={i} style={{marginBottom: vs(10)}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(8), marginBottom: vs(8)}}>
            <View style={[st.rowIcon, {backgroundColor: g.bg}]}>
              <Icon family="Ionicons" name={g.icon} size={16} color={g.color} />
            </View>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{flex: 1}}>{g.title}</AppText>
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4)}}>
            <AppText variant="caption" color={Colors.textSecondary}>Current: {g.current}</AppText>
            <AppText variant="caption" color={Colors.textSecondary}>Target: {g.target}</AppText>
          </View>
          <ProgressBar pct={g.pct} color={g.color} />
          <AppText variant="small" color={g.color} style={{marginTop: vs(4), fontWeight: '500'}}>{g.pct}% complete</AppText>
        </Card>
      ))}

      <SectionLabel text="MILESTONES ACHIEVED" />
      <Card>
        {milestones.map((m, i) => (
          <View key={i}>
            <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(6)}}>
              <View style={[st.rowIcon, {backgroundColor: C.greenBg}]}>
                <Icon family="Ionicons" name={m.icon} size={16} color={C.green} />
              </View>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold" color={Colors.textPrimary}>{m.title}</AppText>
                <AppText variant="small" color={Colors.textTertiary}>{m.date}</AppText>
              </View>
              <Icon family="Ionicons" name="checkmark-circle" size={18} color={C.green} />
            </View>
            {i < milestones.length - 1 && <View style={st.divider} />}
          </View>
        ))}
      </Card>
    </View>
  );
};

const PreventiveContent = () => {
  const screenings = [
    {name: 'HbA1c blood test', date: '28 Mar 2026', status: 'In 5 days', color: C.amber, icon: 'flask-outline'},
    {name: 'Retinal screening', date: 'Jun 2026', status: 'Scheduled', color: C.green, icon: 'eye-outline'},
    {name: 'Kidney function (eGFR)', date: 'Jun 2026', status: 'Scheduled', color: C.green, icon: 'water-outline'},
    {name: 'Lipid panel', date: 'Sep 2026', status: 'Upcoming', color: C.blueText, icon: 'analytics-outline'},
    {name: 'Foot examination', date: 'Dec 2026', status: 'Upcoming', color: C.blueText, icon: 'footsteps-outline'},
  ];
  return (
    <View>
      {/* CV risk card */}
      <Card style={{backgroundColor: Colors.primary, borderColor: Colors.primary}}>
        <View style={{alignItems: 'center', paddingVertical: vs(8)}}>
          <AppText variant="small" color="rgba(255,255,255,0.6)" style={{marginBottom: vs(4)}}>10-year CV Risk</AppText>
          <AppText variant="screenName" color={Colors.white} style={{fontSize: ms(36), lineHeight: ms(42)}}>14%</AppText>
          <Pill text="Moderate risk" bg="rgba(186,117,23,0.3)" color="#FAC775" />
        </View>
      </Card>

      <SectionLabel text="5-YEAR PROJECTION" />
      <Card>
        <AppText variant="body" color={Colors.textPrimary} style={{marginBottom: vs(6)}}>
          If HbA1c stays at 7.8% and BP remains 138/88:
        </AppText>
        <View style={{gap: vs(6)}}>
          <View style={{flexDirection: 'row', gap: s(6)}}>
            <Icon family="Ionicons" name="trending-up" size={14} color={C.red} />
            <AppText variant="caption" color={Colors.textPrimary}>CV risk rises to ~19% by 2031</AppText>
          </View>
          <View style={{flexDirection: 'row', gap: s(6)}}>
            <Icon family="Ionicons" name="alert-circle" size={14} color={C.amber} />
            <AppText variant="caption" color={Colors.textPrimary}>Kidney disease risk increases with uncontrolled BP</AppText>
          </View>
          <View style={{flexDirection: 'row', gap: s(6)}}>
            <Icon family="Ionicons" name="eye" size={14} color={C.amber} />
            <AppText variant="caption" color={Colors.textPrimary}>Retinopathy screening becomes critical annually</AppText>
          </View>
        </View>
        <View style={[st.divider, {marginVertical: vs(10)}]} />
        <AppText variant="body" color={C.greenText} style={{fontWeight: '500'}}>
          With HbA1c at 7.0% and BP under 130/80, CV risk drops to ~10%.
        </AppText>
      </Card>

      <SectionLabel text="SCREENING CALENDAR 2026" />
      <Card>
        {screenings.map((sc, i) => (
          <View key={i}>
            <View style={st.row}>
              <View style={[st.rowIcon, {backgroundColor: sc.color === C.green ? C.greenBg : sc.color === C.amber ? C.amberBg : C.blueBg}]}>
                <Icon family="Ionicons" name={sc.icon} size={16} color={sc.color} />
              </View>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold" color={Colors.textPrimary}>{sc.name}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>{sc.date}</AppText>
              </View>
              <Pill text={sc.status} bg={sc.color === C.green ? C.greenBg : sc.color === C.amber ? C.amberBg : C.blueBg} color={sc.color} />
            </View>
            {i < screenings.length - 1 && <View style={st.divider} />}
          </View>
        ))}
      </Card>
    </View>
  );
};

const SpendingContent = () => {
  const claims = [
    {name: 'Dr. Kavitha consultation', date: 'Sep 2025', amount: '\u20B92,500', status: 'Claimed', color: C.green},
    {name: 'HbA1c lab test', date: 'Sep 2025', amount: '\u20B9800', status: 'Claimed', color: C.green},
    {name: 'Pharmacy (3 months)', date: 'Oct 2025', amount: '\u20B94,200', status: 'Pending', color: C.amber},
  ];
  return (
    <View>
      {/* Spending card */}
      <Card style={{backgroundColor: '#0a3d30', borderColor: '#0a3d30'}}>
        <View style={{alignItems: 'center', paddingVertical: vs(8)}}>
          <AppText variant="small" color="rgba(255,255,255,0.6)" style={{marginBottom: vs(4)}}>Total Health Spend (FY 25-26)</AppText>
          <AppText variant="screenName" color={Colors.white} style={{fontSize: ms(30), lineHeight: ms(36)}}>{'\u20B9'}38,400</AppText>
          <Pill text={'\u20B9'+'25,000 eligible for 80D'} bg="rgba(29,158,117,0.2)" color="#9FE1CB" />
        </View>
      </Card>

      {/* Stats grid */}
      <View style={{flexDirection: 'row', gap: s(8), marginTop: vs(12)}}>
        <StatCell value={'\u20B9'+'14,400'} label="Medicines" />
        <StatCell value={'\u20B9'+'12,000'} label="Consultations" />
        <StatCell value={'\u20B9'+'8,400'} label="Lab tests" />
        <StatCell value={'\u20B9'+'3,600'} label="Devices" />
      </View>

      <SectionLabel text="INSURANCE CLAIMS" />
      <Card>
        {claims.map((cl, i) => (
          <View key={i}>
            <View style={st.row}>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold" color={Colors.textPrimary}>{cl.name}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>{cl.date} {'\u00B7'} {cl.amount}</AppText>
              </View>
              <Pill text={cl.status} bg={cl.color === C.green ? C.greenBg : C.amberBg} color={cl.color === C.green ? C.greenText : C.amberDark} />
            </View>
            {i < claims.length - 1 && <View style={st.divider} />}
          </View>
        ))}
      </Card>

      <View style={{marginTop: vs(12), gap: vs(10)}}>
        <CtaButton text="Download 80D statement" iconName="download-outline" />
        <CtaButton text="Export spending report" iconName="document-outline" outline />
      </View>
    </View>
  );
};

const DevicesContent = () => {
  const connected = [
    {name: 'Fitbit Charge 5', type: 'Wearable', synced: '2 min ago', icon: 'watch-outline', quality: 92},
    {name: 'Accu-Chek Guide', type: 'Glucometer', synced: '1 day ago', icon: 'fitness-outline', quality: 78},
    {name: 'Omron HEM-7156', type: 'BP Monitor', synced: '3 days ago', icon: 'heart-outline', quality: 65},
  ];
  const recommended = [
    {name: 'Continuous Glucose Monitor', reason: 'Recommended for T2D — real-time glucose tracking', icon: 'pulse-outline'},
    {name: 'Smart Scale', reason: 'Track weight and body composition weekly', icon: 'scale-outline'},
  ];
  return (
    <View>
      <SectionLabel text="CONNECTED DEVICES" />
      {connected.map((d, i) => (
        <Card key={i} style={{marginBottom: vs(8)}}>
          <View style={{flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(8)}}>
            <View style={[st.rowIcon, {backgroundColor: C.greenBg}]}>
              <Icon family="Ionicons" name={d.icon} size={16} color={C.greenText} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>{d.name}</AppText>
              <AppText variant="caption" color={Colors.textSecondary}>{d.type} {'\u00B7'} Synced {d.synced}</AppText>
            </View>
            <Icon family="Ionicons" name="checkmark-circle" size={18} color={C.green} />
          </View>
          <View style={{flexDirection: 'row', justifyContent: 'space-between', marginBottom: vs(4)}}>
            <AppText variant="small" color={Colors.textSecondary}>Data quality</AppText>
            <AppText variant="small" color={d.quality >= 80 ? C.greenText : C.amberDark} style={{fontWeight: '500'}}>{d.quality}%</AppText>
          </View>
          <ProgressBar pct={d.quality} color={d.quality >= 80 ? C.green : C.amber} />
        </Card>
      ))}

      <SectionLabel text="RECOMMENDED DEVICES" />
      <Card>
        {recommended.map((r, i) => (
          <View key={i}>
            <View style={st.row}>
              <View style={[st.rowIcon, {backgroundColor: C.blueBg}]}>
                <Icon family="Ionicons" name={r.icon} size={16} color={C.blueText} />
              </View>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold" color={Colors.textPrimary}>{r.name}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>{r.reason}</AppText>
              </View>
              <Icon family="Ionicons" name="add-circle-outline" size={18} color={Colors.primary} />
            </View>
            {i < recommended.length - 1 && <View style={st.divider} />}
          </View>
        ))}
      </Card>
    </View>
  );
};

const DoctorportalContent = () => {
  const shared = [
    {name: 'Health Passport', icon: 'shield-checkmark-outline', bg: C.greenBg, color: C.greenText},
    {name: 'Lab results (last 12 months)', icon: 'flask-outline', bg: C.blueBg, color: C.blueText},
    {name: 'Medication list', icon: 'medkit-outline', bg: C.purpleBg, color: C.purpleText},
    {name: 'Daily tracking data', icon: 'bar-chart-outline', bg: C.amberBg, color: C.amberDark},
  ];
  const targets = [
    {label: 'HbA1c', target: '< 7.0%', current: '7.8%', color: C.red},
    {label: 'BP', target: '< 130/80', current: '138/88', color: C.amber},
    {label: 'LDL', target: '< 100 mg/dL', current: '128', color: C.amber},
    {label: 'Steps', target: '10,000 / day', current: '8,240 avg', color: C.amber},
  ];
  return (
    <View>
      <InfoBox text="Dr. Kavitha Nair has access to your shared health data. Next appointment: 28 Mar 2026." bg={C.greenBg} color={C.greenText} />

      <SectionLabel text="WHAT DR. KAVITHA CAN SEE" />
      <Card>
        {shared.map((sh, i) => (
          <View key={i}>
            <View style={st.row}>
              <View style={[st.rowIcon, {backgroundColor: sh.bg}]}>
                <Icon family="Ionicons" name={sh.icon} size={16} color={sh.color} />
              </View>
              <AppText variant="body" color={Colors.textPrimary} style={{flex: 1}}>{sh.name}</AppText>
              <Icon family="Ionicons" name="checkmark-circle" size={16} color={C.green} />
            </View>
            {i < shared.length - 1 && <View style={st.divider} />}
          </View>
        ))}
      </Card>

      <SectionLabel text="CARE PLAN TARGETS" />
      <Card>
        {targets.map((t, i) => (
          <View key={i}>
            <View style={{flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingVertical: vs(8)}}>
              <View>
                <AppText variant="bodyBold" color={Colors.textPrimary}>{t.label}</AppText>
                <AppText variant="caption" color={Colors.textSecondary}>Target: {t.target}</AppText>
              </View>
              <View style={{alignItems: 'flex-end'}}>
                <AppText variant="bodyBold" color={t.color}>{t.current}</AppText>
                <Pill text={t.color === C.red ? 'Off track' : 'Near target'} bg={t.color === C.red ? C.redBg : C.amberBg} color={t.color === C.red ? C.redDark : C.amberDark} />
              </View>
            </View>
            {i < targets.length - 1 && <View style={st.divider} />}
          </View>
        ))}
      </Card>

      <View style={{marginTop: vs(12)}}>
        <CtaButton text="Message Dr. Kavitha" iconName="chatbubble-outline" />
      </View>
    </View>
  );
};

// ─── Content dispatcher ────────────────────────────────
const contentMap = {
  passport: PassportContent,
  timeline: TimelineContent,
  preappt: PreapptContent,
  emergency: EmergencyContent,
  nutrition: NutritionContent,
  medintel: MedintelContent,
  mental: MentalContent,
  ayupro: AyuproContent,
  family: FamilyContent,
  goals: GoalsContent,
  preventive: PreventiveContent,
  spending: SpendingContent,
  devices: DevicesContent,
  doctorportal: DoctorportalContent,
};

// ─── Main screen ───────────────────────────────────────
const CapabilityDetailScreen = ({route, navigation}) => {
  const {key, name} = route.params;
  const meta = headerMeta[key] || {icon: 'apps-outline', family: 'Ionicons', subtitle: ''};
  const ContentComponent = contentMap[key];

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor="#0a5c47" />
      {/* Header */}
      <View style={st.header}>
        <TouchableOpacity style={st.backBtn} onPress={() => navigation.goBack()}>
          <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.white} />
        </TouchableOpacity>
        <View style={st.headerIconWrap}>
          <Icon family={meta.family} name={meta.icon} size={22} color={Colors.white} />
        </View>
        <View style={{flex: 1}}>
          <AppText variant="screenName" color={Colors.white}>{name}</AppText>
          <AppText variant="caption" color="rgba(255,255,255,0.6)">{meta.subtitle}</AppText>
        </View>
      </View>
      {/* Body */}
      <ScrollView style={st.scroll} showsVerticalScrollIndicator={false} contentContainerStyle={st.scrollContent}>
        {ContentComponent ? <ContentComponent /> : (
          <Card>
            <AppText variant="body" color={Colors.textSecondary}>Content for "{key}" coming soon.</AppText>
          </Card>
        )}
      </ScrollView>
    </View>
  );
};

// ─── Styles ────────────────────────────────────────────
const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: '#0a5c47', paddingVertical: vs(14), paddingHorizontal: s(16), flexDirection: 'row', alignItems: 'center', gap: s(10)},
  backBtn: {width: ms(38), height: ms(38), borderRadius: ms(19), backgroundColor: 'rgba(255,255,255,0.2)', alignItems: 'center', justifyContent: 'center'},
  headerIconWrap: {width: ms(36), height: ms(36), borderRadius: ms(18), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  scroll: {flex: 1},
  scrollContent: {padding: ms(14), paddingBottom: vs(32)},
  card: {backgroundColor: Colors.white, borderRadius: ms(14), borderWidth: 0.5, borderColor: '#e5e7eb', padding: ms(14), marginBottom: vs(2)},
  pill: {paddingVertical: vs(2), paddingHorizontal: s(8), borderRadius: ms(20)},
  infoBox: {flexDirection: 'row', gap: s(8), alignItems: 'flex-start', borderRadius: ms(10), padding: ms(12), marginBottom: vs(10)},
  statCell: {backgroundColor: Colors.white, borderRadius: ms(10), padding: ms(10), alignItems: 'center', flex: 1, borderWidth: 0.5, borderColor: '#e5e7eb'},
  rowIcon: {width: ms(32), height: ms(32), borderRadius: ms(10), alignItems: 'center', justifyContent: 'center'},
  row: {flexDirection: 'row', alignItems: 'center', gap: s(10), paddingVertical: vs(6)},
  divider: {height: 0.5, backgroundColor: '#e5e7eb', marginVertical: vs(2)},
  avatar: {width: ms(44), height: ms(44), borderRadius: ms(22), alignItems: 'center', justifyContent: 'center'},
  cta: {flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: s(8), borderRadius: ms(12), paddingVertical: vs(13), paddingHorizontal: s(20)},
  progBg: {height: vs(6), backgroundColor: '#e5e7eb', borderRadius: ms(3), overflow: 'hidden'},
  progFill: {height: '100%', borderRadius: ms(3)},
});

export default CapabilityDetailScreen;
