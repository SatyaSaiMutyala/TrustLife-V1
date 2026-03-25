import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

/* ───────── static data ───────── */

const FAMILY_MEMBERS = ['Priya', 'Aarav', 'Raj'];

const DUE_VACCINES = [
  {name: 'Tdap booster', note: 'OVERDUE'},
  {name: 'Typhoid booster', note: 'due Apr 2026'},
  {name: 'HPV-1 Gardasil 9', note: '9-14yr window'},
  {name: 'Influenza annual', note: 'Oct 2026'},
];

const COLLAPSED_GROUPS = [
  'Birth',
  '6 weeks',
  '10 weeks',
  '14 weeks',
  '6 months',
  '9-12 months',
  '15-18 months',
  '2 years',
  '4-6 years',
  '9-10 years',
  '11-12 years',
  '15-16 years',
  'Annual',
  'Adult/catch-up',
];

const DOSE_PILLS = [
  {label: '1', status: 'done'},
  {label: '2', status: 'done'},
  {label: '3', status: 'active'},
  {label: 'B1', status: 'inactive'},
  {label: 'B2', status: 'inactive'},
  {label: 'Annual', status: 'inactive'},
];

const ROUTES = ['IM', 'SC', 'ID', 'Oral', 'Intranasal'];

const INJECTION_SITES = [
  'R.Deltoid',
  'L.Deltoid',
  'R.Ant-lat thigh',
  'L.Ant-lat thigh',
  'Oral drops',
  'ID left arm',
  'ID right thigh',
  'Intranasal',
];

const BATCH_FIELDS = [
  {label: 'Lot', value: 'BN2024-A882K'},
  {label: 'Manufacturer', value: 'Serum Inst. India'},
  {label: 'Expiry', value: 'Dec 2026'},
  {label: 'VVM', value: 'Stage 1 \u2014 OK'},
];

const OBSERVATION_OPTIONS = [
  '15 min observed \u2713',
  '30 min observed',
  'Left early',
];

const CHECKLIST_ITEMS = [
  'No severe allergic reaction',
  'Not immunocompromised (for live vaccines)',
  'No moderate-severe febrile illness',
  'Not pregnant (live vaccines)',
  'Minimum interval maintained',
  'No Grade 3-4 prior AEFI \u00B7 No recent IVIG',
];

const CONSENT_OPTIONS = ['Verbal consent', 'Written consent', 'Parent/guardian'];

/* ───────── component ───────── */

const VaccLogView = () => {
  const [selectedMember, setSelectedMember] = useState('Aarav');
  const [selectedVaccine, setSelectedVaccine] = useState(null);
  const [activeDose, setActiveDose] = useState('3');
  const [activeRoute, setActiveRoute] = useState('IM');
  const [activeSite, setActiveSite] = useState('R.Deltoid');
  const [activeObservation, setActiveObservation] = useState('15 min observed \u2713');
  const [activeConsent, setActiveConsent] = useState('Verbal consent');
  const [notes, setNotes] = useState('');

  /* ───── 1  For Whom ───── */
  const renderForWhom = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={st.sectionLabel}>
        LOG A VACCINE
      </AppText>
      <View style={st.chipRow}>
        {FAMILY_MEMBERS.map(name => {
          const active = selectedMember === name;
          return (
            <TouchableOpacity
              key={name}
              style={[st.chip, active && st.chipActive]}
              activeOpacity={0.7}
              onPress={() => setSelectedMember(name)}>
              <AppText
                variant="body"
                color={active ? Colors.white : Colors.textSecondary}>
                {name}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  /* ───── 2  Vaccine Selector ───── */
  const renderVaccineSelector = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={st.sectionLabel}>
        Vaccine *
      </AppText>
      <View style={st.card}>
        {/* Due / Overdue header */}
        <View style={st.dueHeader}>
          <Icon family="Ionicons" name="alert-circle-outline" size={ms(16)} color={Colors.amber} />
          <AppText variant="bodyBold" color={Colors.amberText} style={{marginLeft: s(6)}}>
            DUE/OVERDUE for {selectedMember}
          </AppText>
        </View>
        {DUE_VACCINES.map(v => {
          const active = selectedVaccine === v.name;
          return (
            <TouchableOpacity
              key={v.name}
              style={[st.vaccineItem, active && st.vaccineItemActive]}
              activeOpacity={0.7}
              onPress={() => setSelectedVaccine(v.name)}>
              <Icon
                family="Ionicons"
                name={active ? 'radio-button-on' : 'radio-button-off'}
                size={ms(18)}
                color={active ? Colors.primary : Colors.textTertiary}
              />
              <View style={{marginLeft: s(8), flex: 1}}>
                <AppText
                  variant="body"
                  color={active ? Colors.primary : Colors.textPrimary}>
                  {v.name}
                </AppText>
                <AppText variant="small" color={Colors.textTertiary}>
                  {v.note}
                </AppText>
              </View>
            </TouchableOpacity>
          );
        })}

        {/* Collapsed schedule groups */}
        <View style={st.collapsedContainer}>
          {COLLAPSED_GROUPS.map(g => (
            <TouchableOpacity key={g} style={st.collapsedRow} activeOpacity={0.7}>
              <Icon family="Ionicons" name="chevron-forward" size={ms(14)} color={Colors.textTertiary} />
              <AppText variant="caption" color={Colors.textSecondary} style={{marginLeft: s(4)}}>
                {g}
              </AppText>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
  );

  /* ───── 3  Date + Time ───── */
  const renderDateTime = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={st.sectionLabel}>
        Date & Time
      </AppText>
      <View style={st.row}>
        <TouchableOpacity style={[st.inputBox, {flex: 1, marginRight: s(8)}]} activeOpacity={0.7}>
          <Icon family="Ionicons" name="calendar-outline" size={ms(16)} color={Colors.textSecondary} />
          <AppText variant="body" color={Colors.textPrimary} style={{marginLeft: s(8)}}>
            24 Mar 2026
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity style={[st.inputBox, {flex: 1}]} activeOpacity={0.7}>
          <Icon family="Ionicons" name="time-outline" size={ms(16)} color={Colors.textSecondary} />
          <AppText variant="body" color={Colors.textPrimary} style={{marginLeft: s(8)}}>
            10:30
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ───── 4  Dose Number ───── */
  const renderDoseNumber = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={st.sectionLabel}>
        Dose Number
      </AppText>
      <View style={st.chipRow}>
        {DOSE_PILLS.map(d => {
          const isDone = d.status === 'done';
          const isActive = d.status === 'active';
          const bg = isDone
            ? Colors.teal
            : isActive
            ? Colors.primary
            : 'transparent';
          const border = isDone || isActive ? 'transparent' : '#d1d5db';
          const textColor = isDone || isActive ? Colors.white : Colors.textSecondary;
          return (
            <TouchableOpacity
              key={d.label}
              style={[st.dosePill, {backgroundColor: bg, borderColor: border}]}
              activeOpacity={0.7}
              onPress={() => setActiveDose(d.label)}>
              {isDone && (
                <Icon family="Ionicons" name="checkmark" size={ms(12)} color={Colors.white} />
              )}
              <AppText variant="caption" color={textColor} style={isDone ? {marginLeft: s(2)} : undefined}>
                {d.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  /* ───── 5  Route of Administration ───── */
  const renderRoute = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={st.sectionLabel}>
        Route of Administration
      </AppText>
      <View style={st.chipRow}>
        {ROUTES.map(r => {
          const active = activeRoute === r;
          return (
            <TouchableOpacity
              key={r}
              style={[st.chip, active && st.chipActive]}
              activeOpacity={0.7}
              onPress={() => setActiveRoute(r)}>
              <AppText variant="caption" color={active ? Colors.white : Colors.textSecondary}>
                {r}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
      <AppText variant="small" color={Colors.textTertiary} style={st.helperText}>
        IM: most inactivated {'\u00B7'} SC: MMR, Varicella {'\u00B7'} ID: BCG, fIPV {'\u00B7'} Oral: OPV, Rotavirus
      </AppText>
    </View>
  );

  /* ───── 6  Injection Site ───── */
  const renderInjectionSite = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={st.sectionLabel}>
        Injection Site
      </AppText>
      <View style={st.siteGrid}>
        {INJECTION_SITES.map(site => {
          const active = activeSite === site;
          return (
            <TouchableOpacity
              key={site}
              style={[st.siteCard, active && st.siteCardActive]}
              activeOpacity={0.7}
              onPress={() => setActiveSite(site)}>
              <AppText
                variant="small"
                color={active ? Colors.primary : Colors.textSecondary}
                style={{textAlign: 'center'}}>
                {site}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
      <AppText variant="small" color={Colors.textTertiary} style={st.helperText}>
        Infants {'\u2264'}12m: anterolateral thigh {'\u00B7'} {'>'}12m and adults: deltoid {'\u00B7'} Never inject into buttock
      </AppText>
    </View>
  );

  /* ───── 7  Cold Chain & Batch ───── */
  const renderColdChain = () => (
    <View style={st.section}>
      <View style={[st.card, {backgroundColor: Colors.tealBg, borderColor: Colors.teal}]}>
        {/* Header row */}
        <View style={[st.row, {marginBottom: vs(4)}]}>
          <Icon family="Ionicons" name="snow-outline" size={ms(18)} color={Colors.tealText} />
          <AppText variant="bodyBold" color={Colors.tealText} style={{marginLeft: s(6), flex: 1}}>
            Cold chain & batch details
          </AppText>
        </View>
        <AppText variant="small" color={Colors.tealText} style={{marginBottom: vs(10)}}>
          Required for AEFI tracing
        </AppText>
        {/* 2x2 grid */}
        <View style={st.batchGrid}>
          {BATCH_FIELDS.map(f => (
            <View key={f.label} style={st.batchCell}>
              <AppText variant="small" color={Colors.tealText}>{f.label}</AppText>
              <AppText variant="bodyBold" color={Colors.tealDark} style={{marginTop: vs(2)}}>
                {f.value}
              </AppText>
            </View>
          ))}
        </View>
        <AppText variant="small" color={Colors.tealText} style={{marginTop: vs(8)}}>
          VVM = Vaccine Vial Monitor {'\u00B7'} Discard if inner square {'\u2265'} dark as outer ring
        </AppText>
      </View>
    </View>
  );

  /* ───── 8  Provider ───── */
  const renderProvider = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={st.sectionLabel}>
        Provider
      </AppText>
      <View style={st.row}>
        <View style={[st.inputBox, {flex: 1, marginRight: s(8)}]}>
          <AppText variant="small" color={Colors.textTertiary}>Administered by</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary}>Dr. Srinivas Kumar</AppText>
        </View>
        <View style={[st.inputBox, {flex: 1}]}>
          <AppText variant="small" color={Colors.textTertiary}>Facility</AppText>
          <AppText variant="bodyBold" color={Colors.textPrimary}>Ankura Hospital, Hyd</AppText>
        </View>
      </View>
    </View>
  );

  /* ───── 9  Post-vaccination Observation ───── */
  const renderObservation = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={st.sectionLabel}>
        Post-vaccination Observation
      </AppText>
      <View style={st.chipRow}>
        {OBSERVATION_OPTIONS.map(o => {
          const active = activeObservation === o;
          return (
            <TouchableOpacity
              key={o}
              style={[st.chip, active && st.chipActive]}
              activeOpacity={0.7}
              onPress={() => setActiveObservation(o)}>
              <AppText variant="caption" color={active ? Colors.white : Colors.textSecondary}>
                {o}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
      <AppText variant="small" color={Colors.textTertiary} style={st.helperText}>
        Mandatory 15 min {'\u00B7'} 30 min for high-risk
      </AppText>
    </View>
  );

  /* ───── 10  Pre-vaccination Safety Checklist ───── */
  const renderChecklist = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={st.sectionLabel}>
        PRE-VACCINATION SAFETY CHECKLIST
      </AppText>
      <View style={st.card}>
        {/* Green header bar */}
        <View style={st.checklistHeader}>
          <Icon family="Ionicons" name="shield-checkmark-outline" size={ms(16)} color={Colors.teal} />
          <AppText variant="caption" color={Colors.tealText} style={{marginLeft: s(6), flex: 1}}>
            All items cleared
          </AppText>
        </View>
        {CHECKLIST_ITEMS.map((item, idx) => (
          <View
            key={idx}
            style={[
              st.checkRow,
              idx < CHECKLIST_ITEMS.length - 1 && {borderBottomWidth: 0.5, borderBottomColor: Colors.borderLight},
            ]}>
            <Icon
              family="Ionicons"
              name="checkmark-circle"
              size={ms(20)}
              color={Colors.teal}
            />
            <AppText variant="body" color={Colors.textPrimary} style={{marginLeft: s(8), flex: 1}}>
              {item}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );

  /* ───── 11  Next Dose ───── */
  const renderNextDose = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={st.sectionLabel}>
        Next Dose
      </AppText>
      <View style={st.row}>
        <TouchableOpacity style={[st.inputBox, {flex: 1, marginRight: s(8)}]} activeOpacity={0.7}>
          <AppText variant="small" color={Colors.textTertiary}>Due date</AppText>
          <View style={[st.row, {marginTop: vs(2)}]}>
            <Icon family="Ionicons" name="calendar-outline" size={ms(14)} color={Colors.primary} />
            <AppText variant="bodyBold" color={Colors.primary} style={{marginLeft: s(4)}}>
              Select date
            </AppText>
          </View>
        </TouchableOpacity>
        <TouchableOpacity style={[st.inputBox, {flex: 1}]} activeOpacity={0.7}>
          <AppText variant="small" color={Colors.textTertiary}>Interval</AppText>
          <View style={[st.row, {marginTop: vs(2)}]}>
            <Icon family="Ionicons" name="repeat-outline" size={ms(14)} color={Colors.primary} />
            <AppText variant="bodyBold" color={Colors.primary} style={{marginLeft: s(4)}}>
              Select interval
            </AppText>
          </View>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ───── 12  Consent ───── */
  const renderConsent = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={st.sectionLabel}>
        Consent
      </AppText>
      <View style={st.chipRow}>
        {CONSENT_OPTIONS.map(o => {
          const active = activeConsent === o;
          return (
            <TouchableOpacity
              key={o}
              style={[st.chip, active && st.chipActive]}
              activeOpacity={0.7}
              onPress={() => setActiveConsent(o)}>
              <AppText variant="caption" color={active ? Colors.white : Colors.textSecondary}>
                {o}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  /* ───── 13  Notes ───── */
  const renderNotes = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={st.sectionLabel}>
        Notes
      </AppText>
      <TextInput
        style={st.textArea}
        placeholder="Side effects observed, lot recall notes, special instructions..."
        placeholderTextColor={Colors.textTertiary}
        multiline
        numberOfLines={4}
        textAlignVertical="top"
        value={notes}
        onChangeText={setNotes}
      />
    </View>
  );

  /* ───── main render ───── */
  return (
    <View style={st.container}>
      {renderForWhom()}
      {renderVaccineSelector()}
      {renderDateTime()}
      {renderDoseNumber()}
      {renderRoute()}
      {renderInjectionSite()}
      {renderColdChain()}
      {renderProvider()}
      {renderObservation()}
      {renderChecklist()}
      {renderNextDose()}
      {renderConsent()}
      {renderNotes()}
    </View>
  );
};

/* ───────── styles ───────── */

const st = StyleSheet.create({
  container: {
    paddingVertical: vs(6),
  },

  /* section */
  section: {
    marginBottom: vs(18),
  },
  sectionLabel: {
    marginBottom: vs(8),
  },

  /* generic row */
  row: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* card */
  card: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    backgroundColor: Colors.white,
    padding: ms(14),
  },

  /* chip row */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(8),
  },
  chip: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(20),
    paddingVertical: vs(7),
    paddingHorizontal: s(14),
    backgroundColor: Colors.white,
  },
  chipActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  /* vaccine selector */
  dueHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
    backgroundColor: Colors.amberBg,
    borderRadius: ms(8),
    paddingVertical: vs(6),
    paddingHorizontal: s(10),
  },
  vaccineItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    paddingHorizontal: s(6),
    borderRadius: ms(8),
  },
  vaccineItemActive: {
    backgroundColor: Colors.tealBg,
  },
  collapsedContainer: {
    marginTop: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    paddingTop: vs(8),
  },
  collapsedRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(4),
    paddingHorizontal: s(4),
  },

  /* input box */
  inputBox: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(10),
    backgroundColor: Colors.white,
    paddingVertical: vs(10),
    paddingHorizontal: s(12),
    flexDirection: 'column',
  },

  /* dose pill */
  dosePill: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderRadius: ms(20),
    paddingVertical: vs(7),
    paddingHorizontal: s(10),
    minWidth: ms(40),
  },

  /* injection site 4x2 grid */
  siteGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(8),
  },
  siteCard: {
    width: '23%',
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(12),
    backgroundColor: Colors.white,
    paddingVertical: vs(10),
    paddingHorizontal: s(4),
    alignItems: 'center',
    justifyContent: 'center',
  },
  siteCardActive: {
    borderColor: Colors.primary,
    backgroundColor: Colors.tealBg,
  },

  /* batch grid */
  batchGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  batchCell: {
    width: '50%',
    paddingVertical: vs(6),
    paddingRight: s(8),
  },

  /* checklist */
  checklistHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.tealBg,
    borderRadius: ms(8),
    paddingVertical: vs(8),
    paddingHorizontal: s(10),
    marginBottom: vs(8),
  },
  checkRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },

  /* text area */
  textArea: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    backgroundColor: Colors.white,
    padding: ms(14),
    minHeight: vs(100),
    fontSize: ms(14),
    color: Colors.textPrimary,
  },

  /* helper text */
  helperText: {
    marginTop: vs(6),
    paddingHorizontal: s(2),
  },
});

export default VaccLogView;
