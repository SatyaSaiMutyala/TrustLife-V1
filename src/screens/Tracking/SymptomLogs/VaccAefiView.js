import React, {useState} from 'react';
import {View, TouchableOpacity, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

const SEVERITY_OPTIONS = ['Mild', 'Mod', 'Sev', 'None'];
const PRESENT_OPTIONS = ['Present', 'None'];

const LOCAL_REACTIONS = [
  {id: 'pain', name: 'Pain / soreness', desc: 'Tenderness or pain at injection site', icon: 'pulse-outline', iconBg: Colors.amberBg, iconColor: Colors.amber, options: SEVERITY_OPTIONS, default: 'Mild'},
  {id: 'redness', name: 'Redness', desc: 'Erythema around injection site', icon: 'ellipse-outline', iconBg: Colors.pinkBg, iconColor: Colors.red, options: SEVERITY_OPTIONS, default: 'None'},
  {id: 'swelling', name: 'Swelling', desc: 'Localised swelling or induration', icon: 'water-outline', iconBg: Colors.blueBg, iconColor: Colors.blue, options: SEVERITY_OPTIONS, default: 'None'},
  {id: 'abscess', name: 'Abscess', desc: 'Injection-site abscess formation', icon: 'flame-outline', iconBg: Colors.amberBg, iconColor: Colors.amber, options: PRESENT_OPTIONS, default: 'None'},
];

const SYSTEMIC_REACTIONS = [
  {id: 'fever', name: 'Fever', desc: 'Temperature >= 38 C within 48 hrs', icon: 'thermometer-outline', iconBg: Colors.amberBg, iconColor: Colors.amber, options: SEVERITY_OPTIONS, default: 'Mild'},
  {id: 'irritability', name: 'Irritability / crying (infants)', desc: 'Persistent inconsolable crying > 3 hrs', icon: 'moon-outline', iconBg: Colors.blueBg, iconColor: Colors.blue, options: SEVERITY_OPTIONS, default: 'None'},
  {id: 'nausea', name: 'Nausea / vomiting', desc: 'Gastrointestinal upset post-vaccination', icon: 'medical-outline', iconBg: Colors.amberBg, iconColor: Colors.amber, options: SEVERITY_OPTIONS, default: 'None'},
  {id: 'convulsion', name: 'Febrile convulsion', desc: 'Seizure associated with fever post-vaccination', icon: 'flash-outline', iconBg: Colors.redBg, iconColor: Colors.red, options: PRESENT_OPTIONS, default: 'None'},
];

const SERIOUS_REACTIONS = [
  {id: 'anaphylaxis', name: 'Anaphylaxis', desc: 'Acute allergic reaction within minutes', icon: 'alert-circle-outline', iconBg: Colors.redBg, iconColor: Colors.redText, options: PRESENT_OPTIONS, default: 'None'},
  {id: 'encephalitis', name: 'Encephalitis', desc: 'Brain inflammation post-vaccination', icon: 'body-outline', iconBg: Colors.redBg, iconColor: Colors.redText, options: PRESENT_OPTIONS, default: 'None'},
  {id: 'lymphadenitis', name: 'Lymphadenitis (BCG-specific)', desc: 'Suppurative lymph node inflammation', icon: 'fitness-outline', iconBg: Colors.redBg, iconColor: Colors.redText, options: PRESENT_OPTIONS, default: 'None'},
];

const TIMING_OPTIONS = [
  'Within 15 min',
  '15 min \u2013 2 hours',
  'Same day (2\u201324h)',
  'Day 1\u20133',
  'Day 4\u20137',
  'Day 8\u201314',
  '>14 days',
];

const RESOLUTION_OPTIONS = [
  'Resolved on its own',
  'Treated with paracetamol',
  'Doctor visit needed',
  'Emergency treatment',
  'Hospitalised',
  'Ongoing',
];

const SeverityButton = ({label, active, onPress, isSerious}) => {
  const activeBg = isSerious ? Colors.redBg : Colors.tealBg;
  const activeColor = isSerious ? Colors.redText : Colors.tealText;
  return (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onPress}
      style={[
        styles.sevBtn,
        active && {backgroundColor: activeBg, borderColor: activeColor},
      ]}>
      <AppText
        variant="small"
        color={active ? activeColor : Colors.textTertiary}
        style={active ? {fontWeight: '600'} : undefined}>
        {label}
      </AppText>
    </TouchableOpacity>
  );
};

const ReactionRow = ({item, severity, onSelect, isSerious}) => (
  <View style={styles.reactionRow}>
    <View style={styles.reactionLeft}>
      <View style={[styles.reactionIcon, {backgroundColor: item.iconBg}]}>
        <Icon family="Ionicons" name={item.icon} size={18} color={item.iconColor} />
      </View>
      <View style={{flex: 1}}>
        <AppText variant="bodyBold">{item.name}</AppText>
        <AppText variant="small" color={Colors.textSecondary}>{item.desc}</AppText>
      </View>
    </View>
    <View style={styles.sevRow}>
      {item.options.map(opt => (
        <SeverityButton
          key={opt}
          label={opt}
          active={severity === opt}
          onPress={() => onSelect(item.id, opt)}
          isSerious={isSerious}
        />
      ))}
    </View>
  </View>
);

const Chip = ({label, active, onPress, activeBg, activeColor}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onPress}
    style={[
      styles.chip,
      active && {backgroundColor: activeBg || Colors.tealBg, borderColor: activeColor || Colors.tealText},
    ]}>
    <AppText
      variant="small"
      color={active ? (activeColor || Colors.tealText) : Colors.textSecondary}
      style={active ? {fontWeight: '600'} : undefined}>
      {label}
    </AppText>
  </TouchableOpacity>
);

const SectionHeader = ({label, bgColor, textColor}) => (
  <View style={[styles.sectionHeader, {backgroundColor: bgColor || Colors.tealBg}]}>
    <AppText variant="bodyBold" color={textColor || Colors.tealText}>{label}</AppText>
  </View>
);

const VaccAefiView = () => {
  const [severities, setSeverities] = useState(() => {
    const init = {};
    [...LOCAL_REACTIONS, ...SYSTEMIC_REACTIONS, ...SERIOUS_REACTIONS].forEach(r => {
      init[r.id] = r.default;
    });
    return init;
  });
  const [timing, setTiming] = useState('Same day (2\u201324h)');
  const [resolution, setResolution] = useState('Resolved on its own');

  const handleSelect = (id, val) => {
    setSeverities(prev => ({...prev, [id]: val}));
  };

  return (
    <View style={styles.container}>

      {/* Info card */}
      <View style={[styles.card, {backgroundColor: Colors.blueBg, borderColor: Colors.blue}]}>
        <View style={styles.infoHeader}>
          <Icon family="Ionicons" name="information-circle-outline" size={20} color={Colors.blueText} />
          <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6)}}>What is AEFI?</AppText>
        </View>
        <AppText variant="small" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(18)}}>
          Any untoward medical occurrence following vaccination that does not necessarily have a causal relationship with the vaccine. The WHO grades AEFI severity from Grade 1 (mild, local only) through Grade 4 (life-threatening). India's NVBDCP requires reporting of all serious and severe AEFIs within 24 hours through the district immunisation officer.
        </AppText>
      </View>

      {/* Vaccine selector */}
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={{marginTop: vs(16), marginBottom: vs(8)}}>
        Log reactions for last vaccine
      </AppText>
      <AppText variant="caption" color={Colors.textSecondary} style={{marginBottom: vs(6)}}>
        After which vaccine?
      </AppText>
      <View style={[styles.card, styles.selectorCard]}>
        <Icon family="Ionicons" name="chevron-down-outline" size={16} color={Colors.textSecondary} />
        <AppText variant="body" style={{marginLeft: s(8), flex: 1}}>
          Tdap booster (Aarav) — today
        </AppText>
        <View style={styles.selectedBadge}>
          <AppText variant="small" color={Colors.tealText} style={{fontWeight: '600'}}>Selected</AppText>
        </View>
      </View>

      {/* Local reactions */}
      <SectionHeader label="Local reactions (at injection site) \u2014 Rate severity" bgColor={Colors.tealBg} textColor={Colors.tealText} />
      <View style={styles.card}>
        {LOCAL_REACTIONS.map((item, idx) => (
          <React.Fragment key={item.id}>
            {idx > 0 && <View style={styles.divider} />}
            <ReactionRow
              item={item}
              severity={severities[item.id]}
              onSelect={handleSelect}
            />
          </React.Fragment>
        ))}
      </View>

      {/* Systemic reactions */}
      <SectionHeader label="Systemic reactions \u2014 Rate severity" />
      <View style={styles.card}>
        {SYSTEMIC_REACTIONS.map((item, idx) => (
          <React.Fragment key={item.id}>
            {idx > 0 && <View style={styles.divider} />}
            <ReactionRow
              item={item}
              severity={severities[item.id]}
              onSelect={handleSelect}
            />
          </React.Fragment>
        ))}
      </View>

      {/* Serious AEFI */}
      <SectionHeader label="Serious AEFI \u2014 Report immediately" bgColor={Colors.redBg} textColor={Colors.redText} />
      <View style={styles.card}>
        {SERIOUS_REACTIONS.map((item, idx) => (
          <React.Fragment key={item.id}>
            {idx > 0 && <View style={styles.divider} />}
            <ReactionRow
              item={item}
              severity={severities[item.id]}
              onSelect={handleSelect}
              isSerious
            />
          </React.Fragment>
        ))}
      </View>

      {/* Timing chips */}
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={{marginTop: vs(16), marginBottom: vs(8)}}>
        When did reactions start?
      </AppText>
      <View style={styles.chipWrap}>
        {TIMING_OPTIONS.map(opt => (
          <Chip key={opt} label={opt} active={timing === opt} onPress={() => setTiming(opt)} />
        ))}
      </View>

      {/* Resolution chips */}
      <AppText variant="sectionTitle" color={Colors.textPrimary} style={{marginTop: vs(16), marginBottom: vs(8)}}>
        Resolution
      </AppText>
      <View style={styles.chipWrap}>
        {RESOLUTION_OPTIONS.map(opt => (
          <Chip key={opt} label={opt} active={resolution === opt} onPress={() => setResolution(opt)} />
        ))}
      </View>

      {/* Report button */}
      <TouchableOpacity activeOpacity={0.7} style={styles.reportBtn}>
        <Icon family="Ionicons" name="warning-outline" size={18} color={Colors.white} />
        <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(8)}}>
          Report Serious AEFI to NVBDCP
        </AppText>
      </TouchableOpacity>

      {/* Helpline */}
      <View style={styles.helpline}>
        <Icon family="Ionicons" name="call-outline" size={16} color={Colors.textSecondary} />
        <AppText variant="small" color={Colors.textSecondary} style={{marginLeft: s(6), flex: 1}}>
          National AEFI Reporting Hotline: 1800-11-6666 (toll-free, 24/7). Report any serious adverse event within 24 hours of onset.
        </AppText>
      </View>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1},
  card: {
    backgroundColor: Colors.white,
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(14),
    marginBottom: vs(10),
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectorCard: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  selectedBadge: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(8),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
  },
  sectionHeader: {
    borderRadius: ms(10),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    marginTop: vs(14),
    marginBottom: vs(8),
  },
  reactionRow: {
    paddingVertical: vs(10),
  },
  reactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
  },
  reactionIcon: {
    width: ms(34),
    height: ms(34),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
  },
  sevRow: {
    flexDirection: 'row',
    gap: s(6),
    paddingLeft: ms(44),
  },
  sevBtn: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    alignItems: 'center',
  },
  divider: {
    height: 0.5,
    backgroundColor: '#e5e7eb',
  },
  chipWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  chip: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(20),
    paddingHorizontal: s(12),
    paddingVertical: vs(6),
  },
  reportBtn: {
    backgroundColor: Colors.red,
    borderRadius: ms(14),
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: vs(14),
    marginTop: vs(20),
  },
  helpline: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: vs(12),
    paddingHorizontal: s(4),
  },
});

export default VaccAefiView;
