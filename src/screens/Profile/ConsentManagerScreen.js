import React, {useState} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  TextInput,
  Switch,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';

import AppText from '../../components/shared/AppText';
import Colors from '../../constants/colors';
import {
  CONSENT_TABS,
  ACTIVE_CONSENTS,
  HISTORY_CONSENTS,
  PARTNERS,
  SCOPE_OPTIONS,
  DURATION_OPTIONS,
  TYPE_COLORS,
} from '../../constants/consentData';

/* ─── Component ─────────────────────────────────────── */

const ConsentManagerScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  /* ── State ──────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState('active');
  const [consents, setConsents] = useState([...ACTIVE_CONSENTS]);
  const [histConsents, setHistConsents] = useState([...HISTORY_CONSENTS]);
  const [detailConsent, setDetailConsent] = useState(null);
  const [revokeTarget, setRevokeTarget] = useState(null);

  // Grant form state
  const [grantPartner, setGrantPartner] = useState('');
  const [grantType, setGrantType] = useState('Healthcare provider');
  const [grantAccess, setGrantAccess] = useState('Read-only');
  const [grantPurpose, setGrantPurpose] = useState('Clinical care');
  const [grantNotes, setGrantNotes] = useState('');
  const [grantScopes, setGrantScopes] = useState([]);
  const [grantDuration, setGrantDuration] = useState('6months');
  const [grantMinutes, setGrantMinutes] = useState(30);

  /* ── Helpers ─────────────────────────────────────────── */
  const revokedCount = histConsents.filter(h => h.status === 'revoked').length;

  const toggleScope = id => {
    setGrantScopes(prev =>
      prev.includes(id) ? prev.filter(x => x !== id) : [...prev, id],
    );
  };

  const handleRevoke = () => {
    if (!revokeTarget) return;
    const now = new Date();
    const dateStr =
      now.getDate() +
      ' ' +
      ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'][now.getMonth()] +
      ' ' +
      now.getFullYear();
    setConsents(prev => prev.filter(c => c.id !== revokeTarget.id));
    setHistConsents(prev => [
      {
        ...revokeTarget,
        status: 'revoked',
        revoked: dateStr,
        reason: 'Manually revoked by user',
      },
      ...prev,
    ]);
    setRevokeTarget(null);
    setDetailConsent(null);
  };

  /* ── Custom Toggle ──────────────────────────────────── */
  const Toggle = ({value, onToggle}) => (
    <TouchableOpacity
      activeOpacity={0.7}
      onPress={onToggle}
      style={[
        styles.toggle,
        {backgroundColor: value ? Colors.accent : Colors.borderLight},
      ]}>
      <View
        style={[
          styles.toggleThumb,
          {transform: [{translateX: value ? s(20) : s(2)}]},
        ]}
      />
    </TouchableOpacity>
  );

  /* ── AppDropdown (simple picker) ────────────────────── */
  const AppDropdown = ({label, value, options, onChange}) => {
    const [open, setOpen] = useState(false);
    return (
      <View style={{marginBottom: vs(12)}}>
        <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(4)}}>
          {label}
        </AppText>
        <TouchableOpacity
          style={styles.dropdown}
          activeOpacity={0.7}
          onPress={() => setOpen(!open)}>
          <AppText variant="body" style={{flex: 1}}>{value}</AppText>
          <AppText variant="small" color={Colors.textTertiary}>
            {open ? '\u25B2' : '\u25BC'}
          </AppText>
        </TouchableOpacity>
        {open && (
          <View style={styles.dropdownList}>
            {options.map((opt, i) => (
              <TouchableOpacity
                key={i}
                style={styles.dropdownItem}
                onPress={() => {
                  onChange(opt);
                  setOpen(false);
                }}>
                <AppText
                  variant="body"
                  style={opt === value ? {color: Colors.primary, fontWeight: '700'} : {}}>
                  {opt}
                </AppText>
              </TouchableOpacity>
            ))}
          </View>
        )}
      </View>
    );
  };

  /* ── Header ──────────────────────────────────────────── */
  const renderHeader = () => (
    <View style={[styles.header, {paddingTop: insets.top}]}>
      <View style={styles.topBar}>
        <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
          <AppText variant="body" style={styles.backText}>
            {'\u2039'} Data Transparency
          </AppText>
        </TouchableOpacity>
        <View style={styles.pillBadge}>
          <AppText variant="small" style={styles.pillBadgeText}>
            {consents.length} active
          </AppText>
        </View>
      </View>
      <AppText variant="screenName" style={styles.headerTitle}>
        Consent Manager
      </AppText>
      <AppText variant="caption" style={styles.headerSubtitle}>
        Control who can access your health data
      </AppText>
    </View>
  );

  /* ── Tab Bar ─────────────────────────────────────────── */
  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {CONSENT_TABS.map(tab => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            style={[styles.tab, isActive && styles.tabActive]}
            activeOpacity={0.7}
            onPress={() => setActiveTab(tab.key)}>
            <AppText
              variant="small"
              style={[styles.tabLabel, isActive && styles.tabLabelActive]}>
              {tab.label}
            </AppText>
          </TouchableOpacity>
        );
      })}
    </View>
  );

  /* ═══════════════════════════════════════════════════════
     ACTIVE TAB
     ═══════════════════════════════════════════════════════ */
  const renderActiveTab = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Summary stats */}
      <View style={styles.statsRow}>
        <View style={[styles.statBox, {backgroundColor: Colors.tealBg}]}>
          <AppText style={[styles.statNum, {color: Colors.accent}]}>{consents.length}</AppText>
          <AppText variant="small" color={Colors.tealText}>Active</AppText>
        </View>
        <View style={[styles.statBox, {backgroundColor: Colors.amberBg}]}>
          <AppText style={[styles.statNum, {color: Colors.amber}]}>0</AppText>
          <AppText variant="small" color={Colors.amberText}>Pending</AppText>
        </View>
        <View style={[styles.statBox, {backgroundColor: Colors.background}]}>
          <AppText style={[styles.statNum, {color: Colors.textSecondary}]}>{revokedCount}</AppText>
          <AppText variant="small" color={Colors.textSecondary}>Revoked</AppText>
        </View>
      </View>

      {/* Section label */}
      <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>
        ACTIVE CONSENTS
      </AppText>

      {/* Consent cards */}
      {consents.map(c => (
        <View key={c.id} style={styles.card}>
          {/* Top row */}
          <View style={styles.cardTopRow}>
            <View style={[styles.iconBox, {backgroundColor: c.col + '18'}]}>
              <AppText style={styles.iconText}>{c.ico}</AppText>
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold">{c.name}</AppText>
              <AppText variant="small" color={Colors.textSecondary}>{c.org}</AppText>
            </View>
            <View style={[styles.typeBadge, {backgroundColor: (TYPE_COLORS[c.type] || Colors.accent) + '18'}]}>
              <AppText variant="small" style={{color: TYPE_COLORS[c.type] || Colors.accent, fontSize: ms(10), fontWeight: '600'}}>
                {c.type}
              </AppText>
            </View>
          </View>

          {/* Status + access + toggle */}
          <View style={styles.cardMidRow}>
            <View style={[styles.statusBadge, {backgroundColor: Colors.tealBg}]}>
              <AppText variant="small" style={{color: Colors.accent, fontWeight: '700', fontSize: ms(11)}}>
                Active
              </AppText>
            </View>
            <AppText variant="small" color={Colors.textSecondary} style={{flex: 1, marginLeft: s(8)}}>
              {c.accessLevel}
            </AppText>
            <Toggle
              value={true}
              onToggle={() => setRevokeTarget(c)}
            />
          </View>

          {/* Scope chips */}
          <View style={styles.chipRow}>
            {c.scopes.map((scope, i) => (
              <View key={i} style={[styles.scopeChip, {backgroundColor: c.col + '14'}]}>
                <AppText variant="small" style={{color: c.col, fontSize: ms(10), fontWeight: '600'}}>
                  {scope}
                </AppText>
              </View>
            ))}
          </View>

          {/* Footer */}
          <View style={styles.cardFooter}>
            <View style={styles.footerCell}>
              <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(9)}}>Accesses</AppText>
              <AppText variant="bodyBold" style={{fontSize: ms(13)}}>{c.accessCount}</AppText>
            </View>
            <View style={[styles.footerCell, styles.footerCellBorder]}>
              <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(9)}}>Granted</AppText>
              <AppText variant="bodyBold" style={{fontSize: ms(13)}}>{c.granted}</AppText>
            </View>
            <TouchableOpacity
              style={styles.footerCell}
              onPress={() => setDetailConsent(c)}>
              <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(9)}}>More</AppText>
              <AppText variant="bodyBold" style={{fontSize: ms(13), color: Colors.primary}}>
                Details {'\u203A'}
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      ))}

      <View style={{height: vs(100)}} />
    </ScrollView>
  );

  /* ═══════════════════════════════════════════════════════
     HISTORY TAB
     ═══════════════════════════════════════════════════════ */
  const renderHistoryTab = () => {
    const totalAll = consents.length + histConsents.length;
    const revokedAll = histConsents.filter(h => h.status === 'revoked').length;
    const expiredAll = histConsents.filter(h => h.status === 'expired').length;

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* All-time stats */}
        <View style={styles.statsRow}>
          <View style={[styles.statBox, {backgroundColor: Colors.background}]}>
            <AppText style={[styles.statNum, {color: Colors.textPrimary}]}>{totalAll}</AppText>
            <AppText variant="small" color={Colors.textSecondary}>Total</AppText>
          </View>
          <View style={[styles.statBox, {backgroundColor: Colors.tealBg}]}>
            <AppText style={[styles.statNum, {color: Colors.accent}]}>{consents.length}</AppText>
            <AppText variant="small" color={Colors.tealText}>Active</AppText>
          </View>
          <View style={[styles.statBox, {backgroundColor: Colors.redBg}]}>
            <AppText style={[styles.statNum, {color: Colors.red}]}>{revokedAll}</AppText>
            <AppText variant="small" color={Colors.redText}>Revoked</AppText>
          </View>
          <View style={[styles.statBox, {backgroundColor: Colors.amberBg}]}>
            <AppText style={[styles.statNum, {color: Colors.amber}]}>{expiredAll}</AppText>
            <AppText variant="small" color={Colors.amberText}>Expired</AppText>
          </View>
        </View>

        {/* Active section */}
        <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>
          ACTIVE
        </AppText>
        {consents.map(c => (
          <View key={c.id} style={styles.historyCard}>
            <View style={styles.cardTopRow}>
              <View style={[styles.iconBox, {backgroundColor: c.col + '18'}]}>
                <AppText style={styles.iconText}>{c.ico}</AppText>
              </View>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold">{c.name}</AppText>
                <AppText variant="small" color={Colors.textSecondary}>
                  Granted {c.granted}
                </AppText>
              </View>
              <View style={[styles.statusBadge, {backgroundColor: Colors.tealBg}]}>
                <AppText variant="small" style={{color: Colors.accent, fontWeight: '700', fontSize: ms(11)}}>
                  Active
                </AppText>
              </View>
            </View>
            <View style={styles.chipRow}>
              {c.scopes.map((scope, i) => (
                <View key={i} style={[styles.scopeChip, {backgroundColor: c.col + '14'}]}>
                  <AppText variant="small" style={{color: c.col, fontSize: ms(10), fontWeight: '600'}}>
                    {scope}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        ))}

        {/* Revoked & Expired */}
        <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>
          REVOKED & EXPIRED
        </AppText>
        {histConsents.map(h => (
          <View key={h.id} style={[styles.historyCard, {opacity: 0.75}]}>
            <View style={styles.cardTopRow}>
              <View style={[styles.iconBox, {backgroundColor: h.col + '18'}]}>
                <AppText style={styles.iconText}>{h.ico}</AppText>
              </View>
              <View style={{flex: 1}}>
                <AppText variant="bodyBold">{h.name}</AppText>
                <AppText variant="small" color={Colors.textSecondary}>
                  {h.status === 'revoked'
                    ? 'Revoked ' + h.revoked + ' \u00B7 ' + h.reason
                    : 'Expired ' + h.expires + (h.note ? ' \u00B7 ' + h.note : '')}
                </AppText>
              </View>
              <View
                style={[
                  styles.statusBadge,
                  {backgroundColor: h.status === 'revoked' ? Colors.redBg : Colors.amberBg},
                ]}>
                <AppText
                  variant="small"
                  style={{
                    color: h.status === 'revoked' ? Colors.red : Colors.amber,
                    fontWeight: '700',
                    fontSize: ms(11),
                  }}>
                  {h.status === 'revoked' ? 'Revoked' : 'Expired'}
                </AppText>
              </View>
            </View>
            <View style={styles.chipRow}>
              {h.scopes.map((scope, i) => (
                <View key={i} style={[styles.scopeChip, {backgroundColor: h.col + '14'}]}>
                  <AppText variant="small" style={{color: h.col, fontSize: ms(10), fontWeight: '600'}}>
                    {scope}
                  </AppText>
                </View>
              ))}
            </View>
          </View>
        ))}

        <View style={{height: vs(100)}} />
      </ScrollView>
    );
  };

  /* ═══════════════════════════════════════════════════════
     GRANT TAB
     ═══════════════════════════════════════════════════════ */
  const renderGrantTab = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Info banner */}
      <View style={styles.infoBanner}>
        <AppText variant="body" style={{color: Colors.tealText}}>
          {'\uD83D\uDD12'} Consent grants are logged on-chain and can be revoked at any time. You remain in full control of your health data.
        </AppText>
      </View>

      {/* Step 1 */}
      <AppText variant="bodyBold" style={styles.stepTitle}>Step 1: Partner & Access</AppText>
      <View style={{marginBottom: vs(12)}}>
        <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(4)}}>
          Partner name
        </AppText>
        <TextInput
          style={styles.textInput}
          value={grantPartner}
          onChangeText={setGrantPartner}
          placeholder="Enter partner or provider name"
          placeholderTextColor={Colors.textTertiary}
        />
      </View>
      <AppDropdown
        label="Partner type"
        value={grantType}
        options={Object.keys(TYPE_COLORS)}
        onChange={setGrantType}
      />
      <AppDropdown
        label="Access level"
        value={grantAccess}
        options={['Read-only', 'Read + Write']}
        onChange={setGrantAccess}
      />

      {/* Step 2 */}
      <AppText variant="bodyBold" style={styles.stepTitle}>Step 2: Purpose</AppText>
      <AppDropdown
        label="Purpose"
        value={grantPurpose}
        options={['Clinical care', 'Prescription management', 'Lab integration', 'Insurance claim', 'Research', 'Other']}
        onChange={setGrantPurpose}
      />
      <View style={{marginBottom: vs(12)}}>
        <AppText variant="small" color={Colors.textSecondary} style={{marginBottom: vs(4)}}>
          Notes (optional)
        </AppText>
        <TextInput
          style={[styles.textInput, {height: vs(60), textAlignVertical: 'top'}]}
          value={grantNotes}
          onChangeText={setGrantNotes}
          placeholder="Additional context..."
          placeholderTextColor={Colors.textTertiary}
          multiline
        />
      </View>

      {/* Step 3 */}
      <AppText variant="bodyBold" style={styles.stepTitle}>Step 3: Data Scopes</AppText>
      <View style={styles.scopeGrid}>
        {SCOPE_OPTIONS.map(opt => {
          const selected = grantScopes.includes(opt.id);
          return (
            <TouchableOpacity
              key={opt.id}
              style={[
                styles.scopeGridItem,
                selected && {backgroundColor: Colors.tealBg, borderColor: Colors.accent},
              ]}
              activeOpacity={0.7}
              onPress={() => toggleScope(opt.id)}>
              <AppText style={{fontSize: ms(20), marginBottom: vs(4)}}>{opt.ico}</AppText>
              <AppText variant="bodyBold" style={{fontSize: ms(12)}}>{opt.label}</AppText>
              <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(9)}}>
                {opt.sub}
              </AppText>
              {selected && (
                <View style={styles.scopeCheck}>
                  <AppText variant="small" style={{color: Colors.white, fontSize: ms(10)}}>
                    {'\u2713'}
                  </AppText>
                </View>
              )}
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Step 4 */}
      <AppText variant="bodyBold" style={styles.stepTitle}>Step 4: Duration</AppText>
      {/* Time-limited stepper */}
      <View style={styles.stepperRow}>
        <AppText variant="body" style={{flex: 1}}>Time-limited access (minutes)</AppText>
        <TouchableOpacity
          style={styles.stepperBtn}
          onPress={() => setGrantMinutes(m => Math.max(5, m - 5))}>
          <AppText variant="bodyBold" style={{color: Colors.primary}}>-</AppText>
        </TouchableOpacity>
        <AppText variant="bodyBold" style={{width: s(40), textAlign: 'center'}}>
          {grantMinutes}
        </AppText>
        <TouchableOpacity
          style={styles.stepperBtn}
          onPress={() => setGrantMinutes(m => m + 5)}>
          <AppText variant="bodyBold" style={{color: Colors.primary}}>+</AppText>
        </TouchableOpacity>
      </View>

      {/* Fixed duration pills */}
      <View style={styles.durationRow}>
        {DURATION_OPTIONS.map(d => {
          const sel = grantDuration === d.key;
          return (
            <TouchableOpacity
              key={d.key}
              style={[styles.durationPill, sel && styles.durationPillActive]}
              activeOpacity={0.7}
              onPress={() => setGrantDuration(d.key)}>
              <AppText
                variant="small"
                style={{
                  color: sel ? Colors.white : Colors.textSecondary,
                  fontWeight: sel ? '700' : '500',
                  fontSize: ms(11),
                }}>
                {d.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Step 5 */}
      <AppText variant="bodyBold" style={styles.stepTitle}>Step 5: Review</AppText>
      <View style={styles.card}>
        <View style={styles.reviewRow}>
          <AppText variant="small" color={Colors.textSecondary}>Partner</AppText>
          <AppText variant="bodyBold">{grantPartner || '---'}</AppText>
        </View>
        <View style={styles.reviewRow}>
          <AppText variant="small" color={Colors.textSecondary}>Type</AppText>
          <AppText variant="body">{grantType}</AppText>
        </View>
        <View style={styles.reviewRow}>
          <AppText variant="small" color={Colors.textSecondary}>Access</AppText>
          <AppText variant="body">{grantAccess}</AppText>
        </View>
        <View style={styles.reviewRow}>
          <AppText variant="small" color={Colors.textSecondary}>Purpose</AppText>
          <AppText variant="body">{grantPurpose}</AppText>
        </View>
        <View style={styles.reviewRow}>
          <AppText variant="small" color={Colors.textSecondary}>Scopes</AppText>
          <AppText variant="body">
            {grantScopes.length > 0
              ? SCOPE_OPTIONS.filter(o => grantScopes.includes(o.id))
                  .map(o => o.label)
                  .join(', ')
              : 'None selected'}
          </AppText>
        </View>
        <View style={[styles.reviewRow, {borderBottomWidth: 0}]}>
          <AppText variant="small" color={Colors.textSecondary}>Duration</AppText>
          <AppText variant="body">
            {DURATION_OPTIONS.find(d => d.key === grantDuration)?.label || grantDuration}
          </AppText>
        </View>
      </View>

      <View style={{height: vs(100)}} />
    </ScrollView>
  );

  /* ═══════════════════════════════════════════════════════
     PARTNERS TAB
     ═══════════════════════════════════════════════════════ */
  const renderPartnersTab = () => {
    const connected = PARTNERS.filter(p => p.connected);
    const available = PARTNERS.filter(p => !p.connected);

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Info banner */}
        <View style={styles.infoBanner}>
          <AppText variant="body" style={{color: Colors.tealText}}>
            {'\uD83E\uDD1D'} Partners are verified healthcare entities that integrate with the TrustLife consent framework.
          </AppText>
        </View>

        {/* Connected */}
        <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>
          CONNECTED
        </AppText>
        {connected.map(p => (
          <View key={p.id} style={styles.partnerCard}>
            <View style={[styles.iconBox, {backgroundColor: (TYPE_COLORS[p.type] || Colors.accent) + '18'}]}>
              <AppText style={styles.iconText}>{p.ico}</AppText>
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
                <AppText variant="bodyBold">{p.name}</AppText>
                {p.verified && (
                  <AppText variant="small" style={{color: Colors.accent, fontSize: ms(12)}}>
                    {'\u2713'}
                  </AppText>
                )}
              </View>
              <AppText variant="small" color={Colors.textSecondary}>{p.type}</AppText>
            </View>
            <View style={[styles.statusBadge, {backgroundColor: Colors.tealBg}]}>
              <AppText variant="small" style={{color: Colors.accent, fontWeight: '700', fontSize: ms(11)}}>
                Active
              </AppText>
            </View>
          </View>
        ))}

        {/* Available */}
        <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>
          AVAILABLE
        </AppText>
        {available.map(p => (
          <View key={p.id} style={styles.partnerCard}>
            <View style={[styles.iconBox, {backgroundColor: (TYPE_COLORS[p.type] || Colors.accent) + '18'}]}>
              <AppText style={styles.iconText}>{p.ico}</AppText>
            </View>
            <View style={{flex: 1}}>
              <View style={{flexDirection: 'row', alignItems: 'center', gap: s(6)}}>
                <AppText variant="bodyBold">{p.name}</AppText>
                {p.verified && (
                  <AppText variant="small" style={{color: Colors.accent, fontSize: ms(12)}}>
                    {'\u2713'}
                  </AppText>
                )}
              </View>
              <AppText variant="small" color={Colors.textSecondary}>{p.type}</AppText>
            </View>
            <View style={[styles.statusBadge, {backgroundColor: Colors.blueBg}]}>
              <AppText variant="small" style={{color: Colors.blue, fontWeight: '700', fontSize: ms(11)}}>
                Connect
              </AppText>
            </View>
          </View>
        ))}

        <View style={{height: vs(100)}} />
      </ScrollView>
    );
  };

  /* ═══════════════════════════════════════════════════════
     TAB CONTENT SWITCH
     ═══════════════════════════════════════════════════════ */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'active':
        return renderActiveTab();
      case 'history':
        return renderHistoryTab();
      case 'grant':
        return renderGrantTab();
      case 'partners':
        return renderPartnersTab();
      default:
        return null;
    }
  };

  /* ═══════════════════════════════════════════════════════
     DETAIL VIEW (full-screen Modal)
     ═══════════════════════════════════════════════════════ */
  const renderDetailModal = () => {
    if (!detailConsent) return null;
    const c = detailConsent;

    return (
      <Modal visible={!!detailConsent} animationType="slide" presentationStyle="fullScreen">
        <View style={[styles.container, {paddingTop: insets.top}]}>
          <StatusBar barStyle="dark-content" backgroundColor={Colors.white} />

          {/* Header */}
          <View style={styles.detailHeader}>
            <TouchableOpacity
              style={styles.backBtn}
              onPress={() => setDetailConsent(null)}>
              <AppText variant="body" style={{color: Colors.primary, fontSize: ms(15)}}>
                {'\u2039'} Back
              </AppText>
            </TouchableOpacity>
            <AppText variant="bodyBold" style={{flex: 1, textAlign: 'center', fontSize: ms(16)}}>
              {c.name}
            </AppText>
            <View style={{width: s(60)}} />
          </View>

          <ScrollView
            style={styles.scrollView}
            contentContainerStyle={styles.scrollContent}
            showsVerticalScrollIndicator={false}>
            {/* Identity card */}
            <View style={styles.card}>
              <View style={{alignItems: 'center', paddingVertical: vs(10)}}>
                <View style={[styles.detailIconBox, {backgroundColor: c.col + '18'}]}>
                  <AppText style={{fontSize: ms(32)}}>{c.ico}</AppText>
                </View>
                <AppText variant="bodyBold" style={{fontSize: ms(18), marginTop: vs(8)}}>
                  {c.name}
                </AppText>
                <AppText variant="small" color={Colors.textSecondary}>{c.org}</AppText>
                <View style={{flexDirection: 'row', alignItems: 'center', gap: s(4), marginTop: vs(4)}}>
                  <AppText variant="small" style={{color: Colors.accent, fontSize: ms(12)}}>
                    {'\u2713'} Verified partner
                  </AppText>
                </View>
              </View>
            </View>

            {/* Consent details */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcoBox}>
                  <AppText style={{fontSize: ms(16)}}>{'\uD83D\uDCCB'}</AppText>
                </View>
                <AppText variant="bodyBold" style={{fontSize: ms(15)}}>
                  Consent Details
                </AppText>
              </View>

              {[
                {label: 'Purpose', value: c.purpose},
                {label: 'Access level', value: c.accessLevel},
                {label: 'Granted', value: c.granted},
                {label: 'Expires', value: c.expires},
                {label: 'Last access', value: c.lastAccess},
                {label: 'Total accesses', value: String(c.accessCount)},
                {label: 'Purpose detail', value: c.purposeDetail},
              ].map((f, i) => (
                <View key={i} style={styles.detailRow}>
                  <AppText variant="small" color={Colors.textSecondary} style={{width: s(100)}}>
                    {f.label}
                  </AppText>
                  <AppText variant="body" style={{flex: 1}}>{f.value}</AppText>
                </View>
              ))}
            </View>

            {/* Data scopes */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcoBox}>
                  <AppText style={{fontSize: ms(16)}}>{'\uD83D\uDD13'}</AppText>
                </View>
                <AppText variant="bodyBold" style={{fontSize: ms(15)}}>
                  Data Scopes
                </AppText>
              </View>
              {c.scopes.map((scope, i) => {
                const scopeOpt = SCOPE_OPTIONS.find(o => o.label === scope);
                return (
                  <View key={i} style={styles.scopeListItem}>
                    <AppText style={{fontSize: ms(16), marginRight: s(10)}}>
                      {scopeOpt ? scopeOpt.ico : '\uD83D\uDCC4'}
                    </AppText>
                    <AppText variant="body">{scope}</AppText>
                  </View>
                );
              })}
            </View>

            {/* Access history */}
            <View style={styles.card}>
              <View style={styles.sectionHeader}>
                <View style={styles.sectionIcoBox}>
                  <AppText style={{fontSize: ms(16)}}>{'\uD83D\uDD52'}</AppText>
                </View>
                <AppText variant="bodyBold" style={{fontSize: ms(15)}}>
                  Access History
                </AppText>
              </View>
              {(c.history || []).map((h, i) => (
                <View key={i} style={styles.timelineRow}>
                  <View style={styles.timelineDotCol}>
                    <View style={[styles.timelineDot, {backgroundColor: i === 0 ? Colors.accent : Colors.borderLight}]} />
                    {i < (c.history || []).length - 1 && <View style={styles.timelineLine} />}
                  </View>
                  <View style={{flex: 1, paddingBottom: vs(12)}}>
                    <AppText variant="body" style={{fontSize: ms(13)}}>{h.action}</AppText>
                    <AppText variant="small" color={Colors.textTertiary}>
                      {h.date} {'\u00B7'} {h.by}
                    </AppText>
                  </View>
                </View>
              ))}
            </View>

            {/* Revoke button */}
            <TouchableOpacity
              style={styles.revokeBtn}
              activeOpacity={0.8}
              onPress={() => setRevokeTarget(c)}>
              <AppText variant="bodyBold" style={{color: Colors.white, fontSize: ms(15)}}>
                Revoke access
              </AppText>
            </TouchableOpacity>

            <View style={{height: vs(40)}} />
          </ScrollView>
        </View>
      </Modal>
    );
  };

  /* ═══════════════════════════════════════════════════════
     REVOKE MODAL (bottom sheet)
     ═══════════════════════════════════════════════════════ */
  const renderRevokeModal = () => (
    <Modal
      visible={!!revokeTarget}
      animationType="slide"
      transparent
      onRequestClose={() => setRevokeTarget(null)}>
      <View style={styles.sheetOverlay}>
        <TouchableOpacity
          style={styles.sheetBackdrop}
          activeOpacity={1}
          onPress={() => setRevokeTarget(null)}
        />
        <View style={[styles.sheetContainer, {paddingBottom: Math.max(insets.bottom, vs(20))}]}>
          {/* Drag handle */}
          <View style={styles.dragHandle} />

          <AppText variant="bodyBold" style={{fontSize: ms(18), marginBottom: vs(8)}}>
            Revoke {'\u2014'} {revokeTarget?.name}?
          </AppText>
          <AppText variant="body" color={Colors.textSecondary} style={{marginBottom: vs(12)}}>
            This will immediately revoke {revokeTarget?.name}'s access to your health data. They will no longer be able to read or write any of the scopes you granted.
          </AppText>

          {/* Warning box */}
          <View style={styles.revokeWarning}>
            <AppText variant="bodyBold" style={{color: Colors.redText, marginBottom: vs(4)}}>
              {'\u26A0\uFE0F'} Data already shared
            </AppText>
            <AppText variant="small" style={{color: Colors.redText}}>
              Any data already accessed or downloaded by {revokeTarget?.name} cannot be recalled. Revoking only prevents future access.
            </AppText>
          </View>

          {/* Buttons */}
          <View style={styles.sheetBtnRow}>
            <TouchableOpacity
              style={styles.cancelBtn}
              activeOpacity={0.7}
              onPress={() => setRevokeTarget(null)}>
              <AppText variant="bodyBold" style={{color: Colors.textSecondary}}>
                Cancel
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={styles.confirmRevokeBtn}
              activeOpacity={0.8}
              onPress={handleRevoke}>
              <AppText variant="bodyBold" style={{color: Colors.white}}>
                Revoke access
              </AppText>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  /* ═══════════════════════════════════════════════════════
     BOTTOM BAR
     ═══════════════════════════════════════════════════════ */
  const renderBottomBar = () => (
    <View style={[styles.bottomBar, {paddingBottom: Math.max(insets.bottom, vs(12))}]}>
      <TouchableOpacity
        style={styles.actionBtn}
        activeOpacity={0.8}
        onPress={() => setActiveTab('grant')}>
        <AppText variant="bodyBold" style={styles.actionBtnText}>
          Grant new consent
        </AppText>
      </TouchableOpacity>
    </View>
  );

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      {renderHeader()}
      {renderTabBar()}
      <View style={styles.content}>{renderTabContent()}</View>
      {renderBottomBar()}
      {renderDetailModal()}
      {renderRevokeModal()}
    </View>
  );
};

/* ── STYLES ──────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    padding: s(14),
    paddingBottom: vs(40),
  },

  /* Header */
  header: {
    backgroundColor: Colors.primary,
    paddingBottom: vs(16),
    paddingHorizontal: s(16),
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: vs(12),
  },
  backBtn: {
    paddingVertical: vs(4),
    paddingRight: s(12),
  },
  backText: {
    color: Colors.white,
    fontSize: ms(15),
  },
  pillBadge: {
    paddingHorizontal: s(14),
    paddingVertical: vs(6),
    borderRadius: ms(20),
    backgroundColor: 'rgba(93,202,165,0.18)',
    borderWidth: 1,
    borderColor: 'rgba(93,202,165,0.3)',
  },
  pillBadgeText: {
    color: Colors.lightGreen,
    fontSize: ms(12),
    fontWeight: '600',
  },
  headerTitle: {
    color: Colors.white,
    fontSize: ms(24),
    fontWeight: '700',
    marginBottom: vs(4),
  },
  headerSubtitle: {
    color: 'rgba(255,255,255,0.5)',
    fontSize: ms(12),
  },

  /* Tab bar */
  tabBar: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderBottomWidth: 0.5,
    borderColor: Colors.borderLight,
  },
  tab: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(10),
    borderBottomWidth: 2,
    borderBottomColor: 'transparent',
  },
  tabActive: {
    borderBottomColor: Colors.primary,
  },
  tabLabel: {
    fontSize: ms(11),
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  tabLabelActive: {
    color: Colors.primary,
    fontWeight: '700',
  },

  /* Content */
  content: {
    flex: 1,
  },

  /* Stats */
  statsRow: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(14),
  },
  statBox: {
    flex: 1,
    borderRadius: ms(12),
    padding: s(10),
    alignItems: 'center',
  },
  statNum: {
    fontSize: ms(22),
    fontWeight: '800',
  },

  /* Section label */
  sectionLabel: {
    fontSize: ms(11),
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: vs(10),
    marginTop: vs(4),
  },

  /* Card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(12),
  },
  historyCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(10),
  },
  cardTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },
  cardMidRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10),
    marginBottom: vs(8),
  },
  iconBox: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  iconText: {
    fontSize: ms(20),
  },
  typeBadge: {
    borderRadius: ms(8),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
  },
  statusBadge: {
    borderRadius: ms(20),
    paddingHorizontal: s(10),
    paddingVertical: vs(3),
  },

  /* Toggle */
  toggle: {
    width: s(44),
    height: vs(24),
    borderRadius: ms(12),
    justifyContent: 'center',
  },
  toggleThumb: {
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: {width: 0, height: 1},
    shadowOpacity: 0.15,
    shadowRadius: 2,
    elevation: 2,
  },

  /* Scope chips */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginTop: vs(8),
  },
  scopeChip: {
    borderRadius: ms(8),
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
  },

  /* Card footer */
  cardFooter: {
    flexDirection: 'row',
    marginTop: vs(12),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    paddingTop: vs(10),
  },
  footerCell: {
    flex: 1,
    alignItems: 'center',
  },
  footerCellBorder: {
    borderLeftWidth: 0.5,
    borderRightWidth: 0.5,
    borderColor: Colors.borderLight,
  },

  /* Partner card */
  partnerCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(10),
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(10),
  },

  /* Grant form */
  stepTitle: {
    fontSize: ms(15),
    marginBottom: vs(10),
    marginTop: vs(6),
  },
  textInput: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    fontSize: ms(14),
    color: Colors.textPrimary,
  },
  dropdown: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    flexDirection: 'row',
    alignItems: 'center',
  },
  dropdownList: {
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    marginTop: vs(4),
    overflow: 'hidden',
  },
  dropdownItem: {
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },

  /* Scope grid */
  scopeGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginBottom: vs(14),
  },
  scopeGridItem: {
    width: '48%',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: Colors.borderLight,
    padding: s(12),
  },
  scopeCheck: {
    position: 'absolute',
    top: s(8),
    right: s(8),
    width: ms(20),
    height: ms(20),
    borderRadius: ms(10),
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Duration */
  stepperRow: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    padding: s(12),
    marginBottom: vs(12),
  },
  stepperBtn: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  durationRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
    marginBottom: vs(14),
  },
  durationPill: {
    borderRadius: ms(20),
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
    backgroundColor: Colors.white,
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  durationPillActive: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },

  /* Review */
  reviewRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    paddingVertical: vs(8),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },

  /* Info banner */
  infoBanner: {
    backgroundColor: Colors.tealBg,
    borderRadius: ms(12),
    borderWidth: 1,
    borderColor: Colors.teal,
    padding: s(14),
    marginBottom: vs(14),
  },

  /* Detail modal */
  detailHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: s(16),
    paddingVertical: vs(10),
    backgroundColor: Colors.white,
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  detailIconBox: {
    width: ms(64),
    height: ms(64),
    borderRadius: ms(20),
    alignItems: 'center',
    justifyContent: 'center',
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(8),
    marginBottom: vs(12),
  },
  sectionIcoBox: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(10),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  detailRow: {
    flexDirection: 'row',
    paddingVertical: vs(6),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  scopeListItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },

  /* Timeline */
  timelineRow: {
    flexDirection: 'row',
  },
  timelineDotCol: {
    width: s(24),
    alignItems: 'center',
  },
  timelineDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    marginTop: vs(4),
  },
  timelineLine: {
    width: 1,
    flex: 1,
    backgroundColor: Colors.borderLight,
  },

  /* Revoke button */
  revokeBtn: {
    backgroundColor: Colors.red,
    borderRadius: ms(12),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Revoke sheet */
  sheetOverlay: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sheetContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    padding: s(20),
  },
  dragHandle: {
    width: s(40),
    height: vs(4),
    borderRadius: ms(2),
    backgroundColor: Colors.borderLight,
    alignSelf: 'center',
    marginBottom: vs(16),
  },
  revokeWarning: {
    backgroundColor: Colors.redBg,
    borderRadius: ms(12),
    padding: s(14),
    marginBottom: vs(16),
  },
  sheetBtnRow: {
    flexDirection: 'row',
    gap: s(10),
  },
  cancelBtn: {
    flex: 1,
    borderRadius: ms(12),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.background,
  },
  confirmRevokeBtn: {
    flex: 1,
    borderRadius: ms(12),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.red,
  },

  /* Bottom bar */
  bottomBar: {
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    paddingHorizontal: s(16),
    paddingTop: vs(12),
  },
  actionBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(14),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnText: {
    color: Colors.white,
    fontSize: ms(15),
  },
});

export default ConsentManagerScreen;
