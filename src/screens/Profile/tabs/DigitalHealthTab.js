import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import AppText from '../../../components/shared/AppText';
import Colors from '../../../constants/colors';

const SectionCard = ({title, children}) => (
  <View style={styles.card}>
    <View style={styles.sectionHeader}>
      <AppText variant="bodyBold" style={styles.sectionTitle}>{title}</AppText>
    </View>
    <View style={styles.cardBody}>{children}</View>
  </View>
);

const FormRow = ({label, value, last}) => (
  <View style={[styles.infoRow, last && styles.noBorder]}>
    <AppText variant="small" style={styles.infoLabel}>{label.toUpperCase()}</AppText>
    <AppText variant="body" style={styles.infoValue}>{value}</AppText>
  </View>
);

const SYNC_COLORS = {live: '#4CAF50', idle: '#E9A23A', off: '#BDBDBD'};

const wearables = [
  {name: 'Apple Watch Series 9', sync: 'live', battery: '78%'},
  {name: 'Fitbit Inspire (infant)', sync: 'live', battery: '92%'},
];

const devices = [
  {name: 'Omron BP Monitor', model: 'HEM-7156', sync: 'live'},
  {name: 'Accu-Chek Guide', model: 'Glucometer', sync: 'idle'},
  {name: 'Beurer PO 30', model: 'Pulse Oximeter', sync: 'off'},
  {name: 'Braun ThermoScan', model: 'Thermometer', sync: 'idle'},
];

const apps = [
  {name: 'Apple Health', status: 'Connected', type: 'managed'},
  {name: 'Clue', status: 'Connected', type: 'managed'},
  {name: 'MyFitnessPal', status: 'Pending', type: 'active'},
  {name: 'Apollo 24|7', status: 'Connected', type: 'managed'},
  {name: 'Calm', status: 'Disconnected', type: 'resolved'},
];

const StatusPill = ({label, type}) => {
  const map = {
    managed: {bg: Colors.tealBg, fg: Colors.accent},
    active: {bg: '#FDF3E7', fg: '#B5600E'},
    resolved: {bg: '#F2EFE8', fg: '#A09E9A'},
  };
  const c = map[type] || map.resolved;
  return (
    <View style={[styles.pill, {backgroundColor: c.bg}]}>
      <AppText variant="small" style={{color: c.fg, fontSize: ms(11)}}>{label}</AppText>
    </View>
  );
};

const SyncDot = ({status}) => (
  <View style={[styles.syncDot, {backgroundColor: SYNC_COLORS[status]}]} />
);

const DigitalHealthTab = () => (
  <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
    {/* Wearables */}
    <SectionCard title="Wearables">
      {wearables.map((w, i) => (
        <View key={i} style={[styles.deviceRow, i === wearables.length - 1 && styles.noBorder]}>
          <SyncDot status={w.sync} />
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="body" style={styles.deviceName}>{w.name}</AppText>
            <AppText variant="small" style={styles.deviceMeta}>
              Live sync  ·  Battery {w.battery}
            </AppText>
          </View>
        </View>
      ))}
    </SectionCard>

    {/* Medical Devices */}
    <SectionCard title="Medical Devices">
      {devices.map((d, i) => (
        <View key={i} style={[styles.deviceRow, i === devices.length - 1 && styles.noBorder]}>
          <SyncDot status={d.sync} />
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText variant="body" style={styles.deviceName}>{d.name}</AppText>
            <AppText variant="small" style={styles.deviceMeta}>{d.model}</AppText>
          </View>
          <AppText variant="small" style={{color: SYNC_COLORS[d.sync], fontSize: ms(11)}}>
            {d.sync === 'live' ? 'Live' : d.sync === 'idle' ? 'Idle' : 'Off'}
          </AppText>
        </View>
      ))}
      <View style={styles.legendRow}>
        {Object.entries(SYNC_COLORS).map(([k, c]) => (
          <View key={k} style={styles.legendItem}>
            <View style={[styles.legendDotSmall, {backgroundColor: c}]} />
            <AppText variant="small" style={styles.legendText}>
              {k.charAt(0).toUpperCase() + k.slice(1)}
            </AppText>
          </View>
        ))}
      </View>
    </SectionCard>

    {/* Connected Apps */}
    <SectionCard title="Connected Apps">
      <View style={styles.tableHeader}>
        <AppText variant="small" style={[styles.thCell, {flex: 2}]}>APP</AppText>
        <AppText variant="small" style={[styles.thCell, {flex: 1, textAlign: 'right'}]}>STATUS</AppText>
      </View>
      {apps.map((a, i) => (
        <View key={i} style={[styles.tableRow, i === apps.length - 1 && styles.noBorder]}>
          <AppText variant="body" style={[styles.tdCell, {flex: 2}]}>{a.name}</AppText>
          <View style={{flex: 1, alignItems: 'flex-end'}}>
            <StatusPill label={a.status} type={a.type} />
          </View>
        </View>
      ))}
    </SectionCard>

    {/* Telemedicine Consent */}
    <SectionCard title="Telemedicine & Consent">
      <FormRow label="Video Consult" value="Enabled" />
      <FormRow label="Data Sharing" value="Treating doctors only" />
      <FormRow label="Cloud Backup" value="Encrypted - active" />
      <FormRow label="Last Review" value="Feb 2026" last />
    </SectionCard>

    <View style={{height: vs(30)}} />
  </ScrollView>
);

const styles = StyleSheet.create({
  container: {flex: 1, paddingHorizontal: s(16), paddingTop: vs(12)},
  card: {
    backgroundColor: '#FFFFFF', borderRadius: ms(16), 
     marginBottom: vs(12), overflow: 'hidden',
  },
  sectionHeader: {
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    padding: s(16), borderBottomWidth: 1, borderBottomColor: '#E0DDD6',
  },
  sectionTitle: {fontSize: ms(14), color: '#1A1814'},
  cardBody: {padding: s(16)},
  infoRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#E0DDD6'},
  noBorder: {borderBottomWidth: 0},
  infoLabel: {width: s(110), color: '#A09E9A', fontSize: ms(11)},
  infoValue: {flex: 1, color: '#1A1814', fontSize: ms(13)},
  pill: {borderRadius: ms(20), paddingVertical: vs(3), paddingHorizontal: s(10)},
  syncDot: {width: s(10), height: s(10), borderRadius: 99, marginTop: vs(4)},
  deviceRow: {flexDirection: 'row', alignItems: 'flex-start', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#E0DDD6'},
  deviceName: {color: '#1A1814', fontSize: ms(13)},
  deviceMeta: {color: '#A09E9A', fontSize: ms(11), marginTop: vs(2)},
  legendRow: {flexDirection: 'row', gap: s(14), marginTop: vs(10)},
  legendItem: {flexDirection: 'row', alignItems: 'center', gap: s(4)},
  legendDotSmall: {width: s(8), height: s(8), borderRadius: 99},
  legendText: {color: '#A09E9A', fontSize: ms(10)},
  tableHeader: {flexDirection: 'row', paddingBottom: vs(8), borderBottomWidth: 1, borderBottomColor: '#E0DDD6'},
  thCell: {color: '#A09E9A', fontSize: ms(10)},
  tableRow: {flexDirection: 'row', alignItems: 'center', paddingVertical: vs(10), borderBottomWidth: 1, borderBottomColor: '#E0DDD6'},
  tdCell: {color: '#1A1814', fontSize: ms(13)},
});

export default DigitalHealthTab;
