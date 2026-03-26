import React, {useState, useCallback} from 'react';
import {
  View,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import {WEARABLES, DATA_PERMISSIONS} from '../../../constants/movementData';

/* ─── Toggle Sub-component ──────────────────────────── */

const Toggle = ({value, onToggle}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={onToggle}
    style={[sty.toggleTrack, value && sty.toggleTrackOn]}>
    <View style={[sty.toggleThumb, value && sty.toggleThumbOn]} />
  </TouchableOpacity>
);

/* ─── Status Badge ──────────────────────────────────── */

const StatusBadge = ({status}) => {
  let bg, text, label;
  switch (status) {
    case 'connected':
      bg = Colors.tealBg;
      text = Colors.tealText;
      label = 'Connected';
      break;
    case 'syncing':
      bg = Colors.amberBg;
      text = Colors.amberText;
      label = 'Syncing...';
      break;
    default:
      bg = Colors.background;
      text = Colors.textTertiary;
      label = 'Connect';
  }
  return (
    <View style={[sty.statusBadge, {backgroundColor: bg}]}>
      <AppText variant="small" color={text} style={{fontWeight: '600'}}>
        {label}
      </AppText>
    </View>
  );
};

/* ─── Main Component ───────────────────────────────── */

const ConnectTab = () => {
  const [phoneTracking, setPhoneTracking] = useState(true);
  const [wearableStates, setWearableStates] = useState(() => {
    const map = {};
    WEARABLES.forEach((w) => {
      map[w.id] = w.status || 'disconnected';
    });
    return map;
  });
  const [permissions, setPermissions] = useState(() => {
    const map = {};
    (DATA_PERMISSIONS || []).forEach((p, idx) => {
      const key = p.id || p.name || idx;
      map[key] = p.on !== undefined ? p.on : (p.defaultOn !== undefined ? p.defaultOn : true);
    });
    return map;
  });
  const [bgSync, setBgSync] = useState(true);
  const [syncOnOpen, setSyncOnOpen] = useState(true);
  const [shareAyu, setShareAyu] = useState(true);

  const handleConnectWearable = useCallback((id) => {
    setWearableStates((prev) => {
      const current = prev[id];
      if (current === 'disconnected') {
        return {...prev, [id]: 'syncing'};
      }
      return prev;
    });
    // Simulate connection completing
    setTimeout(() => {
      setWearableStates((prev) => {
        if (prev[id] === 'syncing') {
          return {...prev, [id]: 'connected'};
        }
        return prev;
      });
    }, 2000);
  }, []);

  const togglePermission = useCallback((id) => {
    setPermissions((prev) => ({...prev, [id]: !prev[id]}));
  }, []);

  return (
    <ScrollView style={sty.container} showsVerticalScrollIndicator={false}>
      {/* ─── 1. Phone Step Tracking Card ───────── */}
      <View style={sty.phoneCard}>
        <View style={sty.phoneHeader}>
          <AppText style={{fontSize: ms(28)}}>{'📱'}</AppText>
          <View style={{flex: 1, marginLeft: s(12)}}>
            <AppText variant="header" color={Colors.white}>
              TrustLife step tracking
            </AppText>
            <View style={sty.liveRow}>
              <View style={sty.liveDot} />
              <AppText variant="small" color={Colors.lightGreen} style={{fontWeight: '600'}}>
                Live
              </AppText>
            </View>
          </View>
          <Toggle value={phoneTracking} onToggle={() => setPhoneTracking(!phoneTracking)} />
        </View>

        <View style={sty.phoneStats}>
          <View style={sty.phoneStat}>
            <AppText variant="small" color="rgba(255,255,255,0.5)">Steps today</AppText>
            <AppText variant="bodyBold" color={Colors.white}>
              {phoneTracking ? '6,842' : '--'}
            </AppText>
          </View>
          <View style={sty.phoneStat}>
            <AppText variant="small" color="rgba(255,255,255,0.5)">Distance</AppText>
            <AppText variant="bodyBold" color={Colors.white}>
              {phoneTracking ? '4.3 km' : '--'}
            </AppText>
          </View>
          <View style={sty.phoneStat}>
            <AppText variant="small" color="rgba(255,255,255,0.5)">Active cal</AppText>
            <AppText variant="bodyBold" color={Colors.white}>
              {phoneTracking ? '312' : '--'}
            </AppText>
          </View>
          <View style={sty.phoneStat}>
            <AppText variant="small" color="rgba(255,255,255,0.5)">Elevation</AppText>
            <AppText variant="bodyBold" color={Colors.white}>
              {phoneTracking ? '8 fl' : '--'}
            </AppText>
          </View>
        </View>
      </View>

      {/* ─── 2. Wearable Integrations ──────────── */}
      <View style={sty.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          Wearable Integrations
        </AppText>
        {WEARABLES.map((wearable) => {
          const state = wearableStates[wearable.id] || 'disconnected';
          const isConnected = state === 'connected';
          const isSyncing = state === 'syncing';
          return (
            <TouchableOpacity
              key={wearable.id}
              activeOpacity={isConnected || isSyncing ? 1 : 0.7}
              onPress={() => {
                if (!isConnected && !isSyncing) {
                  handleConnectWearable(wearable.id);
                }
              }}
              style={[sty.wearableCard, isConnected && sty.wearableCardConnected]}>
              <View style={sty.wearableTop}>
                <AppText style={{fontSize: ms(26)}}>{wearable.ico || wearable.logo}</AppText>
                <View style={{flex: 1, marginLeft: s(12)}}>
                  <AppText variant="bodyBold" color={Colors.textPrimary}>
                    {wearable.name}
                  </AppText>
                  <AppText variant="small" color={Colors.textTertiary}>
                    {wearable.sub || wearable.subtitle}
                  </AppText>
                </View>
                <StatusBadge status={state} />
              </View>

              {/* Data chips */}
              <View style={sty.dataChips}>
                {(wearable.data || wearable.dataTypes || []).map((dt, idx) => (
                  <View key={idx} style={[sty.dataChip, isConnected && sty.dataChipActive]}>
                    <AppText
                      variant="small"
                      color={isConnected ? Colors.tealText : Colors.textTertiary}>
                      {dt}
                    </AppText>
                  </View>
                ))}
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* ─── 3. Data Permissions ───────────────── */}
      <View style={sty.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          Data Permissions
        </AppText>
        <View style={sty.permissionList}>
          {(DATA_PERMISSIONS || []).map((perm, idx) => {
            const key = perm.id || perm.name || idx;
            return (
              <View key={key} style={sty.permissionRow}>
                <AppText style={{fontSize: ms(18)}}>{perm.ico || perm.icon}</AppText>
                <AppText
                  variant="caption"
                  color={Colors.textPrimary}
                  style={{flex: 1, marginLeft: s(10), fontWeight: '500'}}>
                  {perm.name}
                </AppText>
                <Toggle
                  value={permissions[key]}
                  onToggle={() => togglePermission(key)}
                />
              </View>
            );
          })}
        </View>
      </View>

      {/* ─── 4. Auto-sync Settings ─────────────── */}
      <View style={sty.section}>
        <AppText variant="sectionTitle" color={Colors.textSecondary}>
          Auto-sync Settings
        </AppText>
        <View style={sty.syncList}>
          <View style={sty.syncRow}>
            <View style={{flex: 1}}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '500'}}>
                Background sync
              </AppText>
              <AppText variant="small" color={Colors.textTertiary}>
                Sync data automatically in the background
              </AppText>
            </View>
            <Toggle value={bgSync} onToggle={() => setBgSync(!bgSync)} />
          </View>

          <View style={sty.syncDivider} />

          <View style={sty.syncRow}>
            <View style={{flex: 1}}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '500'}}>
                Sync on app open
              </AppText>
              <AppText variant="small" color={Colors.textTertiary}>
                Pull latest data when you open the app
              </AppText>
            </View>
            <Toggle value={syncOnOpen} onToggle={() => setSyncOnOpen(!syncOnOpen)} />
          </View>

          <View style={sty.syncDivider} />

          <View style={sty.syncRow}>
            <View style={{flex: 1}}>
              <AppText variant="caption" color={Colors.textPrimary} style={{fontWeight: '500'}}>
                Share with Ayu
              </AppText>
              <AppText variant="small" color={Colors.textTertiary}>
                Let Ayu use your movement data for health insights
              </AppText>
            </View>
            <Toggle value={shareAyu} onToggle={() => setShareAyu(!shareAyu)} />
          </View>
        </View>
      </View>

      <View style={{height: vs(40)}} />
    </ScrollView>
  );
};

/* ─── Styles ───────────────────────────────────────── */

const sty = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: s(16),
    paddingTop: vs(8),
  },

  /* Toggle */
  toggleTrack: {
    width: s(46),
    height: vs(26),
    borderRadius: ms(13),
    backgroundColor: Colors.borderLight,
    justifyContent: 'center',
    paddingHorizontal: s(3),
  },
  toggleTrackOn: {
    backgroundColor: Colors.accent,
  },
  toggleThumb: {
    width: s(20),
    height: s(20),
    borderRadius: s(10),
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },
  toggleThumbOn: {
    alignSelf: 'flex-end',
  },

  /* Status badge */
  statusBadge: {
    paddingHorizontal: s(10),
    paddingVertical: vs(4),
    borderRadius: ms(10),
  },

  /* Section */
  section: {
    marginTop: vs(22),
  },

  /* ── 1. Phone Card ── */
  phoneCard: {
    borderRadius: ms(16),
    padding: s(16),
    marginTop: vs(4),
    backgroundColor: Colors.tealDark,
    overflow: 'hidden',
  },
  phoneHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(4),
    gap: s(5),
  },
  liveDot: {
    width: s(8),
    height: s(8),
    borderRadius: s(4),
    backgroundColor: Colors.lightGreen,
  },
  phoneStats: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginTop: vs(14),
    paddingTop: vs(12),
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    gap: s(4),
  },
  phoneStat: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.08)',
    borderRadius: ms(10),
    padding: s(10),
    marginBottom: vs(4),
  },

  /* ── 2. Wearable Cards ── */
  wearableCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(14),
    marginTop: vs(8),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  wearableCardConnected: {
    borderColor: Colors.accent,
    borderWidth: 1.5,
  },
  wearableTop: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dataChips: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginTop: vs(10),
  },
  dataChip: {
    backgroundColor: Colors.background,
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
  },
  dataChipActive: {
    backgroundColor: Colors.tealBg,
  },

  /* ── 3. Data Permissions ── */
  permissionList: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  permissionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
    paddingHorizontal: s(14),
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },

  /* ── 4. Auto-sync Settings ── */
  syncList: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    marginTop: vs(10),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    overflow: 'hidden',
  },
  syncRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(14),
    paddingHorizontal: s(14),
  },
  syncDivider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginHorizontal: s(14),
  },
});

export default ConnectTab;
