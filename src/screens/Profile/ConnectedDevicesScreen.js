import React from 'react';
import {View, StyleSheet, TouchableOpacity, StatusBar, ScrollView} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';

const SYNC = {live: Colors.accent, idle: '#E9A23A', off: '#BDBDBD'};
const SYNC_LABEL = {live: 'Live sync', idle: 'Synced', off: 'Manual'};

const WEARABLES = [
  {ico: '\u231A', name: 'Apple Watch Series 9 (45mm)', meta: 'Worn daily \u00B7 HR, SpO\u2082, ECG, steps, sleep', sync: 'live', battery: '78%', bg: '#000', fg: '#fff'},
  {ico: '\uD83D\uDC9C', name: 'Fitbit Inspire 3 (Zara)', meta: 'Infant monitor \u00B7 Sleep breathing, movement', sync: 'live', battery: '92%', bg: '#EDE8FD', fg: '#533BA0'},
];

const DEVICES = [
  {ico: '\uD83E\uDE7A', name: 'Omron HEM-7156', meta: 'Blood Pressure Monitor \u00B7 Last: 118/78 mmHg', sync: 'live', bg: '#FAEAED'},
  {ico: '\uD83E\uDE78', name: 'Accu-Chek Instant', meta: 'Glucometer \u00B7 Last: 94 mg/dL', sync: 'idle', bg: '#EAF2FB'},
  {ico: '\uD83C\uDFA8', name: 'Beurer PO 30', meta: 'Pulse Oximeter \u00B7 Last: SpO\u2082 97%', sync: 'off', bg: Colors.tealBg},
  {ico: '\uD83C\uDF21\uFE0F', name: 'Braun ThermoScan 7', meta: 'Ear Thermometer \u00B7 Household use', sync: 'off', bg: '#FDF3E7'},
];

const APPS = [
  {name: 'Apple Health', purpose: 'Aggregator', status: 'Connected', type: 'managed'},
  {name: 'Clue', purpose: 'Cycle tracking', status: 'Connected', type: 'managed'},
  {name: 'MyFitnessPal', purpose: 'Nutrition', status: 'Pending', type: 'active'},
  {name: 'Apollo 24|7', purpose: 'Teleconsult', status: 'Connected', type: 'managed'},
  {name: 'Calm', purpose: 'Meditation', status: 'Disconnected', type: 'resolved'},
];

const CONSENT_ROWS = [
  {label: 'Telemedicine consent', value: 'Granted \u2014 all connected providers'},
  {label: 'Data sharing', value: 'Star Health \u2014 wearable data enabled'},
  {label: 'AI health insights', value: 'TrustLife AI summaries \u2014 enabled'},
  {label: 'Emergency access', value: 'Blood group, allergies, contacts \u2014 without login'},
];

const PILL_COLORS = {
  managed: {bg: Colors.tealBg, color: Colors.accent},
  active: {bg: '#FDF3E7', color: '#B5600E'},
  resolved: {bg: Colors.background, color: Colors.textTertiary},
};

const ConnectedDevicesScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  return (
    <View style={st.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      <View style={[st.header, {paddingTop: insets.top}]}>
        <View style={st.topBar}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={st.backBtn}>
            <AppText variant="body" style={st.backText}>{'\u2039'} Profile</AppText>
          </TouchableOpacity>
          <TouchableOpacity style={st.addPill} activeOpacity={0.7}>
            <AppText variant="small" style={st.addPillText}>+ Connect Device</AppText>
          </TouchableOpacity>
        </View>
        <AppText variant="screenName" style={st.headerTitle}>Connected Devices</AppText>
        <AppText variant="caption" style={st.headerSub}>Wearables, medical devices & health apps</AppText>
      </View>

      <ScrollView style={st.scroll} contentContainerStyle={st.scrollContent} showsVerticalScrollIndicator={false}>

        {/* Wearables */}
        <AppText variant="sectionTitle" style={st.secLabel}>WEARABLES & PASSIVE MONITORING</AppText>
        {WEARABLES.map((w, i) => (
          <View key={i} style={st.deviceCard}>
            <View style={[st.deviceIco, {backgroundColor: w.bg}]}>
              <AppText style={{fontSize: ms(18), color: w.fg}}>{w.ico}</AppText>
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold">{w.name}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{w.meta}</AppText>
              <View style={st.syncRow}>
                <View style={[st.syncDot, {backgroundColor: SYNC[w.sync]}]} />
                <AppText variant="small" color={Colors.textTertiary}>{SYNC_LABEL[w.sync]}</AppText>
              </View>
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <AppText variant="small" color={Colors.textTertiary}>Battery</AppText>
              <AppText variant="bodyBold" color={Colors.accent}>{w.battery}</AppText>
            </View>
          </View>
        ))}

        {/* Medical Devices */}
        <AppText variant="sectionTitle" style={st.secLabel}>MEDICAL DEVICES AT HOME</AppText>
        {DEVICES.map((d, i) => (
          <View key={i} style={st.deviceCard}>
            <View style={[st.deviceIco, {backgroundColor: d.bg}]}>
              <AppText style={{fontSize: ms(18)}}>{d.ico}</AppText>
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold">{d.name}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>{d.meta}</AppText>
              <View style={st.syncRow}>
                <View style={[st.syncDot, {backgroundColor: SYNC[d.sync]}]} />
                <AppText variant="small" color={Colors.textTertiary}>{SYNC_LABEL[d.sync]}</AppText>
              </View>
            </View>
            <TouchableOpacity style={st.viewBtn} activeOpacity={0.7}>
              <AppText variant="small" color={Colors.textSecondary} style={{fontWeight: '600'}}>
                {d.sync === 'off' ? 'Log' : 'History'}
              </AppText>
            </TouchableOpacity>
          </View>
        ))}

        {/* Connected Apps */}
        <AppText variant="sectionTitle" style={st.secLabel}>CONNECTED HEALTH APPS</AppText>
        <View style={st.card}>
          {APPS.map((a, i) => {
            const pill = PILL_COLORS[a.type] || PILL_COLORS.resolved;
            return (
              <View key={i} style={[st.appRow, i < APPS.length - 1 && st.appRowBorder]}>
                <View style={{flex: 1}}>
                  <AppText variant="bodyBold">{a.name}</AppText>
                  <AppText variant="small" color={Colors.textSecondary}>{a.purpose}</AppText>
                </View>
                <View style={[st.statusPill, {backgroundColor: pill.bg}]}>
                  <AppText variant="small" style={{color: pill.color, fontWeight: '600', fontSize: ms(10)}}>{a.status}</AppText>
                </View>
              </View>
            );
          })}
        </View>

        {/* Telemedicine & Consent */}
        <AppText variant="sectionTitle" style={st.secLabel}>TELEMEDICINE & DIGITAL CONSENT</AppText>
        <View style={st.card}>
          {CONSENT_ROWS.map((r, i) => (
            <View key={i} style={[st.consentRow, i < CONSENT_ROWS.length - 1 && st.appRowBorder]}>
              <AppText variant="small" color={Colors.textTertiary} style={st.consentLabel}>{r.label}</AppText>
              <AppText variant="body" style={{flex: 1}}>{r.value}</AppText>
              <TouchableOpacity activeOpacity={0.6}>
                <AppText variant="small" color={Colors.accent} style={{fontWeight: '600'}}>Manage</AppText>
              </TouchableOpacity>
            </View>
          ))}
        </View>

        <View style={{height: vs(40)}} />
      </ScrollView>
    </View>
  );
};

const st = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingBottom: vs(16), paddingHorizontal: s(16)},
  topBar: {flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', marginBottom: vs(12)},
  backBtn: {paddingVertical: vs(4), paddingRight: s(12)},
  backText: {color: Colors.white, fontSize: ms(15)},
  addPill: {paddingHorizontal: s(14), paddingVertical: vs(6), borderRadius: ms(20), backgroundColor: 'rgba(93,202,165,0.18)', borderWidth: 1, borderColor: 'rgba(93,202,165,0.3)'},
  addPillText: {color: Colors.lightGreen, fontSize: ms(11), fontWeight: '600'},
  headerTitle: {color: Colors.white, fontSize: ms(20), fontWeight: '700', marginBottom: vs(4)},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  scroll: {flex: 1},
  scrollContent: {padding: s(16)},
  secLabel: {marginBottom: vs(8), marginTop: vs(6)},

  deviceCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(10),
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(12),
  },
  deviceIco: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
    marginTop: vs(4),
  },
  syncDot: {
    width: ms(7),
    height: ms(7),
    borderRadius: ms(4),
  },
  viewBtn: {
    paddingVertical: vs(5),
    paddingHorizontal: s(12),
    borderRadius: ms(8),
    borderWidth: 0.5,
    borderColor: Colors.borderLight,
    alignSelf: 'center',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(12),
  },
  appRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
  },
  appRowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  statusPill: {
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
    borderRadius: ms(20),
  },
  consentRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(10),
    gap: s(8),
  },
  consentLabel: {
    width: s(90),
    fontWeight: '600',
    textTransform: 'uppercase',
    letterSpacing: 0.4,
    fontSize: ms(10),
  },
});

export default ConnectedDevicesScreen;
