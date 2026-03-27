import React, {useState, useRef, useCallback, useEffect} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Modal,
  Alert,
  Animated,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';

import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import {
  MEDICAL_ID,
  TRIGGER_METHODS,
  SOS_SEQUENCE,
  EMERGENCY_CONTACTS,
  NEAREST_HOSPITALS,
  DISPATCH_ITEMS,
  SOS_SETTINGS,
  MEDICAL_ID_GRID,
} from '../../constants/sosData';

/* ─── Component ─────────────────────────────────────── */

const EmergencySOSScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();

  /* ── State ──────────────────────────────────────────── */
  const [isActive, setIsActive] = useState(false);
  const [sosSeconds, setSosSeconds] = useState(0);
  const [holdProgress, setHoldProgress] = useState(0);

  // Modals
  const [showMedIdModal, setShowMedIdModal] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showCancelModal, setShowCancelModal] = useState(false);

  // Settings toggle state
  const [settingsState, setSettingsState] = useState(
    SOS_SETTINGS.map(st => st.on),
  );

  // Refs
  const holdTimer = useRef(null);
  const holdInterval = useRef(null);
  const sosInterval = useRef(null);

  // Animations
  const ring1 = useRef(new Animated.Value(1)).current;
  const ring2 = useRef(new Animated.Value(1)).current;
  const ring3 = useRef(new Animated.Value(1)).current;
  const ringOp1 = useRef(new Animated.Value(0.5)).current;
  const ringOp2 = useRef(new Animated.Value(0.5)).current;
  const ringOp3 = useRef(new Animated.Value(0.5)).current;
  const liveDot = useRef(new Animated.Value(1)).current;

  /* ── Pulse Animations ──────────────────────────────── */
  useEffect(() => {
    const createPulse = (scaleVal, opVal, delay) =>
      Animated.loop(
        Animated.sequence([
          Animated.delay(delay),
          Animated.parallel([
            Animated.timing(scaleVal, {
              toValue: 1.6,
              duration: 1400,
              useNativeDriver: true,
            }),
            Animated.timing(opVal, {
              toValue: 0,
              duration: 1400,
              useNativeDriver: true,
            }),
          ]),
          Animated.parallel([
            Animated.timing(scaleVal, {
              toValue: 1,
              duration: 0,
              useNativeDriver: true,
            }),
            Animated.timing(opVal, {
              toValue: 0.5,
              duration: 0,
              useNativeDriver: true,
            }),
          ]),
        ]),
      );

    const p1 = createPulse(ring1, ringOp1, 0);
    const p2 = createPulse(ring2, ringOp2, 400);
    const p3 = createPulse(ring3, ringOp3, 800);
    p1.start();
    p2.start();
    p3.start();

    return () => {
      p1.stop();
      p2.stop();
      p3.stop();
    };
  }, [ring1, ring2, ring3, ringOp1, ringOp2, ringOp3]);

  /* ── Live dot animation ────────────────────────────── */
  useEffect(() => {
    const pulse = Animated.loop(
      Animated.sequence([
        Animated.timing(liveDot, {
          toValue: 0.3,
          duration: 800,
          useNativeDriver: true,
        }),
        Animated.timing(liveDot, {
          toValue: 1,
          duration: 800,
          useNativeDriver: true,
        }),
      ]),
    );
    pulse.start();
    return () => pulse.stop();
  }, [liveDot]);

  /* ── SOS Timer ─────────────────────────────────────── */
  useEffect(() => {
    if (isActive) {
      setSosSeconds(0);
      sosInterval.current = setInterval(() => {
        setSosSeconds(prev => prev + 1);
      }, 1000);
    } else {
      if (sosInterval.current) {
        clearInterval(sosInterval.current);
        sosInterval.current = null;
      }
      setSosSeconds(0);
    }
    return () => {
      if (sosInterval.current) clearInterval(sosInterval.current);
    };
  }, [isActive]);

  const formatTime = secs => {
    const m = Math.floor(secs / 60);
    const sec = secs % 60;
    return `${m}:${sec < 10 ? '0' : ''}${sec}`;
  };

  /* ── Hold-to-activate ──────────────────────────────── */
  const onPressIn = useCallback(() => {
    setHoldProgress(0);
    let elapsed = 0;
    holdInterval.current = setInterval(() => {
      elapsed += 100;
      setHoldProgress(Math.min(elapsed / 3000, 1));
    }, 100);
    holdTimer.current = setTimeout(() => {
      clearInterval(holdInterval.current);
      setHoldProgress(0);
      setIsActive(true);
    }, 3000);
  }, []);

  const onPressOut = useCallback(() => {
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
    if (holdInterval.current) {
      clearInterval(holdInterval.current);
      holdInterval.current = null;
    }
    setHoldProgress(0);
  }, []);

  const cancelSOS = useCallback(() => {
    setShowCancelModal(false);
    setIsActive(false);
  }, []);

  /* ═══════════════════════════════════════════════════════
     STANDBY HEADER
     ═══════════════════════════════════════════════════════ */
  const renderStandbyHeader = () => (
    <View style={[styles.header, {paddingTop: insets.top}]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <AppText variant="body" style={styles.backText}>
            {'\u2039'} Home
          </AppText>
        </TouchableOpacity>
        <AppText variant="bodyBold" style={styles.headerTitleCenter}>
          Emergency SOS
        </AppText>
        <TouchableOpacity
          activeOpacity={0.7}
          onPress={() => setShowSettingsModal(true)}>
          <AppText
            variant="body"
            style={{color: Colors.white, fontSize: ms(20)}}>
            {'\u2699'}
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ═══════════════════════════════════════════════════════
     ACTIVE HEADER
     ═══════════════════════════════════════════════════════ */
  const renderActiveHeader = () => (
    <View style={[styles.activeHeader, {paddingTop: insets.top}]}>
      <View style={styles.topBar}>
        <View style={styles.activeBadge}>
          <Animated.View
            style={[styles.pulseDotSmall, {opacity: liveDot}]}
          />
          <AppText variant="bodyBold" style={{color: Colors.white}}>
            SOS Active
          </AppText>
        </View>
        <TouchableOpacity
          style={styles.cancelBtn}
          activeOpacity={0.7}
          onPress={() => setShowCancelModal(true)}>
          <AppText variant="small" style={styles.cancelBtnText}>
            Cancel SOS
          </AppText>
        </TouchableOpacity>
      </View>
    </View>
  );

  /* ═══════════════════════════════════════════════════════
     VIEW 1: STANDBY
     ═══════════════════════════════════════════════════════ */
  const renderStandby = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Medical ID Banner */}
      <TouchableOpacity
        style={[styles.card, {backgroundColor: Colors.tealBg}]}
        activeOpacity={0.7}
        onPress={() => setShowMedIdModal(true)}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AppText style={{fontSize: ms(24), marginRight: s(10)}}>
            {'\uD83D\uDED1'}
          </AppText>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" style={{color: Colors.tealText}}>
              {MEDICAL_ID.name} {'\u00B7'} {MEDICAL_ID.age} {'\u00B7'}{' '}
              {MEDICAL_ID.bloodType}
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              Tap to view full Medical ID
            </AppText>
          </View>
          <AppText
            variant="body"
            style={{color: Colors.tealText, fontSize: ms(18)}}>
            {'\u203A'}
          </AppText>
        </View>
        <View style={styles.pillRow}>
          {['T2DM', 'HTN'].map(c => (
            <View key={c} style={[styles.condPill, {backgroundColor: Colors.redBg}]}>
              <AppText variant="small" style={{color: Colors.redText, fontSize: ms(10)}}>
                {c}
              </AppText>
            </View>
          ))}
          {['Metformin', 'Amlodipine'].map(m => (
            <View key={m} style={[styles.condPill, {backgroundColor: Colors.amberBg}]}>
              <AppText variant="small" style={{color: Colors.amberText, fontSize: ms(10)}}>
                {m}
              </AppText>
            </View>
          ))}
          <View style={[styles.condPill, {backgroundColor: Colors.redBg}]}>
            <AppText variant="small" style={{color: Colors.redText, fontSize: ms(10)}}>
              Penicillin allergy
            </AppText>
          </View>
        </View>
      </TouchableOpacity>

      {/* Trigger Methods Strip */}
      <View style={styles.triggerRow}>
        {TRIGGER_METHODS.map((t, i) => (
          <View key={i} style={[styles.triggerCard, {backgroundColor: Colors.redBg}]}>
            <AppText style={{fontSize: ms(20), lineHeight: ms(26), marginBottom: vs(2)}}>
              {t.ico}
            </AppText>
            <AppText variant="small" style={{color: Colors.redText, fontWeight: '600', fontSize: ms(10)}}>
              {t.label}
            </AppText>
          </View>
        ))}
      </View>

      {/* SOS Button */}
      <View style={styles.sosContainer}>
        {/* Pulsing rings */}
        <Animated.View
          style={[
            styles.sosRing,
            {
              width: ms(170),
              height: ms(170),
              borderRadius: ms(85),
              transform: [{scale: ring1}],
              opacity: ringOp1,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.sosRing,
            {
              width: ms(152),
              height: ms(152),
              borderRadius: ms(76),
              transform: [{scale: ring2}],
              opacity: ringOp2,
            },
          ]}
        />
        <Animated.View
          style={[
            styles.sosRing,
            {
              width: ms(142),
              height: ms(142),
              borderRadius: ms(71),
              transform: [{scale: ring3}],
              opacity: ringOp3,
            },
          ]}
        />

        <TouchableOpacity
          style={styles.sosButton}
          activeOpacity={0.85}
          onPressIn={onPressIn}
          onPressOut={onPressOut}>
          {holdProgress > 0 && (
            <View style={styles.holdOverlay}>
              <View
                style={[
                  styles.holdFill,
                  {height: `${holdProgress * 100}%`},
                ]}
              />
            </View>
          )}
          <AppText style={{fontSize: ms(32)}}>
            {'\uD83D\uDEA8'}
          </AppText>
          <AppText
            variant="bodyBold"
            style={{color: Colors.white, fontSize: ms(22), marginTop: vs(2)}}>
            SOS
          </AppText>
          <AppText variant="small" style={{color: 'rgba(255,255,255,0.8)', fontSize: ms(10)}}>
            Hold 3 sec
          </AppText>
        </TouchableOpacity>
      </View>

      <AppText
        variant="caption"
        color={Colors.textTertiary}
        style={{textAlign: 'center', marginTop: vs(10), marginBottom: vs(16)}}>
        Hold 3s {'\u00B7'} Tap once (confirm) {'\u00B7'} Shake 3{'\u00D7'}
      </AppText>

      {/* Auto-Sequence Strip */}
      <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>
        WHAT HAPPENS AUTOMATICALLY
      </AppText>
      <View style={styles.card}>
        {SOS_SEQUENCE.map((item, i) => (
          <View
            key={i}
            style={[
              styles.seqRow,
              i < SOS_SEQUENCE.length - 1 && {
                borderBottomWidth: 1,
                borderBottomColor: Colors.borderLight,
                paddingBottom: vs(10),
                marginBottom: vs(10),
              },
            ]}>
            <View style={styles.seqNum}>
              <AppText variant="small" style={{color: Colors.white, fontWeight: '700', fontSize: ms(10)}}>
                {item.num}
              </AppText>
            </View>
            <View style={{flex: 1, marginLeft: s(10)}}>
              <View style={{flexDirection: 'row', alignItems: 'center', marginBottom: vs(2)}}>
                <AppText style={{fontSize: ms(14), marginRight: s(5)}}>
                  {item.ico}
                </AppText>
                <AppText variant="bodyBold" style={{fontSize: ms(13), flex: 1}}>
                  {item.label}
                </AppText>
              </View>
              <AppText variant="small" color={Colors.textSecondary} style={{fontSize: ms(10)}}>
                {item.sub}
              </AppText>
            </View>
            <View style={styles.delayBadge}>
              <AppText variant="small" style={{color: Colors.redText, fontWeight: '600', fontSize: ms(9)}}>
                {item.delay}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      {/* Emergency Contacts */}
      <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>
        EMERGENCY CONTACTS
      </AppText>
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={{paddingHorizontal: s(16), gap: s(10)}}>
        {EMERGENCY_CONTACTS.map((c, i) => (
          <View key={i} style={styles.contactChip}>
            <View style={[styles.contactAvatar, {backgroundColor: c.icoBg}]}>
              <AppText style={{fontSize: ms(18)}}>{c.ico}</AppText>
            </View>
            <AppText variant="bodyBold" style={{fontSize: ms(12), marginTop: vs(4)}}>
              {c.name}
            </AppText>
            <AppText variant="small" color={Colors.textTertiary} style={{fontSize: ms(9)}}>
              {c.role}
            </AppText>
            <AppText
              variant="small"
              style={{color: Colors.accent, fontWeight: '700', marginTop: vs(4), fontSize: ms(11)}}>
              {c.action}
            </AppText>
          </View>
        ))}
        <TouchableOpacity
          style={[styles.contactChip, {justifyContent: 'center'}]}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Add Contact', 'Coming soon.')}>
          <View style={[styles.contactAvatar, {backgroundColor: Colors.borderLight}]}>
            <AppText style={{fontSize: ms(20), color: Colors.textTertiary}}>+</AppText>
          </View>
          <AppText variant="small" color={Colors.textTertiary} style={{marginTop: vs(4), fontSize: ms(11)}}>
            Add
          </AppText>
        </TouchableOpacity>
      </ScrollView>

      {/* Nearest Hospitals */}
      <AppText variant="small" color={Colors.textTertiary} style={[styles.sectionLabel, {marginTop: vs(16)}]}>
        NEAREST HOSPITALS
      </AppText>
      {NEAREST_HOSPITALS.map((h, i) => (
        <TouchableOpacity
          key={i}
          style={styles.card}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Navigate', `Opening directions to ${h.name}`)}>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.distBadge}>
              <AppText variant="small" style={{color: Colors.white, fontWeight: '700', fontSize: ms(10)}}>
                {h.dist}km
              </AppText>
            </View>
            <View style={{flex: 1, marginLeft: s(10)}}>
              <AppText variant="bodyBold" style={{fontSize: ms(13)}}>
                {h.name}
              </AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{fontSize: ms(10)}}>
                {h.addr} {'\u00B7'} {h.spec}
              </AppText>
            </View>
            <AppText style={{fontSize: ms(18), color: Colors.accent}}>
              {'\u25B7'}
            </AppText>
          </View>
        </TouchableOpacity>
      ))}

      {/* Emergency Call Bar */}
      <View style={[styles.card, {backgroundColor: Colors.redBg, marginTop: vs(6)}]}>
        <View style={{flexDirection: 'row', alignItems: 'center'}}>
          <AppText style={{fontSize: ms(22), marginRight: s(10)}}>
            {'\uD83D\uDEA8'}
          </AppText>
          <View style={{flex: 1}}>
            <AppText variant="bodyBold" style={{color: Colors.redText, fontSize: ms(13)}}>
              True emergency?
            </AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{fontSize: ms(10)}}>
              Call directly
            </AppText>
          </View>
          <TouchableOpacity
            style={styles.call112Btn}
            activeOpacity={0.7}
            onPress={() => Alert.alert('Call 112', 'Dialling emergency services.')}>
            <AppText variant="bodyBold" style={{color: Colors.white, fontSize: ms(13)}}>
              Call 112
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      <View style={{height: vs(100)}} />
    </ScrollView>
  );

  /* ═══════════════════════════════════════════════════════
     VIEW 2: ACTIVE SOS
     ═══════════════════════════════════════════════════════ */
  const renderActive = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Status Card */}
      <View style={[styles.card, {backgroundColor: Colors.redDark}]}>
        <View style={{alignItems: 'center', paddingVertical: vs(8)}}>
          <AppText style={{fontSize: ms(32)}}>
            {'\uD83D\uDEA8'}
          </AppText>
          <AppText
            variant="bodyBold"
            style={{color: Colors.white, fontSize: ms(18), marginTop: vs(4)}}>
            Emergency SOS
          </AppText>
          <AppText
            variant="bodyBold"
            style={{color: Colors.white, fontSize: ms(32), marginTop: vs(4)}}>
            {formatTime(sosSeconds)}
          </AppText>
          <AppText
            variant="caption"
            style={{color: 'rgba(255,255,255,0.8)', textAlign: 'center', marginTop: vs(4), fontSize: ms(11)}}>
            112 dialling {'\u00B7'} Family & care team alerted {'\u00B7'}{' '}
            Location live
          </AppText>
          <AppText
            variant="small"
            style={{color: 'rgba(255,255,255,0.7)', marginTop: vs(6), fontSize: ms(10)}}>
            17.4126{'\u00B0'}N, 78.4071{'\u00B0'}E {'\u00B7'} Banjara Hills,
            Hyderabad
          </AppText>
          <AppText
            variant="small"
            style={{color: 'rgba(255,255,255,0.5)', marginTop: vs(2), fontSize: ms(9)}}>
            Live GPS {'\u00B7'} updating every 30 seconds
          </AppText>
        </View>
      </View>

      {/* Live Map Placeholder */}
      <View style={styles.mapCard}>
        <View style={styles.mapInner}>
          {/* Red pulsing dot center */}
          <View style={styles.mapDotOuter}>
            <Animated.View
              style={[styles.mapDotRing, {opacity: liveDot, transform: [{scale: liveDot}]}]}
            />
            <View style={styles.mapDotCenter} />
          </View>
        </View>
        <View style={styles.mapFooter}>
          <AppText variant="small" style={{color: Colors.white, fontSize: ms(10)}}>
            {'\uD83D\uDCCD'} Banjara Hills, Hyderabad
          </AppText>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <Animated.View
              style={[styles.greenDot, {opacity: liveDot}]}
            />
            <AppText variant="small" style={{color: Colors.white, fontSize: ms(10), marginLeft: s(4)}}>
              Live GPS
            </AppText>
          </View>
        </View>
      </View>

      {/* Dispatch Timeline */}
      <AppText variant="small" color={Colors.textTertiary} style={styles.sectionLabel}>
        ALERT STATUS
      </AppText>
      {DISPATCH_ITEMS.map((item, i) => (
        <View
          key={i}
          style={[
            styles.card,
            {
              backgroundColor: item.cardBg,
              borderWidth: 1,
              borderColor: item.cardBorder,
            },
          ]}>
          <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
            <View style={[styles.dispatchAvatar, {backgroundColor: item.icoBg}]}>
              <AppText style={{fontSize: ms(18)}}>{item.ico}</AppText>
            </View>
            <View style={{flex: 1, marginLeft: s(10)}}>
              <AppText variant="bodyBold" style={{fontSize: ms(13)}}>
                {item.name}
              </AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{fontSize: ms(10), marginTop: vs(1)}}>
                {item.sub}
              </AppText>
              {item.detail ? (
                <AppText
                  variant="small"
                  style={{color: Colors.accent, fontSize: ms(10), marginTop: vs(2)}}>
                  {item.detail}
                </AppText>
              ) : null}
            </View>
            <View style={{alignItems: 'flex-end'}}>
              <View
                style={[
                  styles.statusBadge,
                  {
                    backgroundColor: item.statusBg,
                    borderWidth: 1,
                    borderColor: item.statusBorder,
                  },
                ]}>
                <AppText
                  variant="small"
                  style={{
                    color: item.statusColor,
                    fontWeight: '700',
                    fontSize: ms(9),
                  }}>
                  {item.status}
                </AppText>
              </View>
              <AppText
                variant="small"
                color={Colors.textTertiary}
                style={{fontSize: ms(9), marginTop: vs(3)}}>
                {item.time}
              </AppText>
            </View>
          </View>
        </View>
      ))}

      {/* Medical ID Shared */}
      <View style={[styles.card, {backgroundColor: Colors.redBg, marginTop: vs(6)}]}>
        <AppText variant="bodyBold" style={{color: Colors.redText, fontSize: ms(13), marginBottom: vs(10)}}>
          {'\uD83D\uDED1'} FULL MEDICAL ID {'\u2014'} shared with all contacts
        </AppText>
        <View style={styles.medGrid}>
          {MEDICAL_ID_GRID.map((cell, i) => (
            <View key={i} style={styles.medGridCell}>
              <AppText
                variant="small"
                style={{
                  color: Colors.textTertiary,
                  fontSize: ms(9),
                  textTransform: 'uppercase',
                  fontWeight: '600',
                  marginBottom: vs(2),
                }}>
                {cell.label}
              </AppText>
              <AppText variant="body" style={{fontSize: ms(11)}}>
                {cell.value}
              </AppText>
            </View>
          ))}
        </View>
        <View style={[styles.physicianRow, {marginTop: vs(10)}]}>
          <AppText variant="small" color={Colors.textSecondary} style={{fontSize: ms(10)}}>
            Treating physician: {MEDICAL_ID.physician} {'\u00B7'}{' '}
            {MEDICAL_ID.physicianHospital}
          </AppText>
        </View>
      </View>

      {/* Action Buttons */}
      <View style={{flexDirection: 'row', gap: s(8), marginTop: vs(6)}}>
        <TouchableOpacity
          style={[styles.actionBtn, {backgroundColor: Colors.red, flex: 2}]}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Call 112', 'Dialling emergency services.')}>
          <AppText variant="bodyBold" style={{color: Colors.white, fontSize: ms(13)}}>
            {'\uD83D\uDCDE'} Call 112 Now
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtn, {backgroundColor: Colors.accent, flex: 1}]}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Location', 'Sharing live location.')}>
          <AppText variant="bodyBold" style={{color: Colors.white, fontSize: ms(13)}}>
            {'\uD83D\uDCCD'} Location
          </AppText>
        </TouchableOpacity>
      </View>

      <View style={{flexDirection: 'row', gap: s(8), marginTop: vs(8)}}>
        <TouchableOpacity
          style={[styles.actionBtnSmall, {flex: 1}]}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Navigate', 'Opening hospital navigation.')}>
          <AppText variant="small" style={{color: Colors.accent, fontWeight: '700', fontSize: ms(11)}}>
            {'\uD83C\uDFE5'} Navigate
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtnSmall, {flex: 1}]}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Ayu Brief', 'Generating health brief.')}>
          <AppText variant="small" style={{color: Colors.accent, fontWeight: '700', fontSize: ms(11)}}>
            {'\uD83C\uDF3F'} Ayu brief
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={[styles.actionBtnSmall, {flex: 1}]}
          activeOpacity={0.7}
          onPress={() => Alert.alert('Record', 'Starting audio recording.')}>
          <AppText variant="small" style={{color: Colors.accent, fontWeight: '700', fontSize: ms(11)}}>
            {'\uD83C\uDFA4'} Record log
          </AppText>
        </TouchableOpacity>
      </View>

      <AppText
        variant="small"
        color={Colors.textTertiary}
        style={{textAlign: 'center', marginTop: vs(10), fontSize: ms(9)}}>
        Incident ref: HYD-2026-031847 {'\u00B7'} All actions logged for your
        records
      </AppText>

      <View style={{height: vs(100)}} />
    </ScrollView>
  );

  /* ═══════════════════════════════════════════════════════
     MODAL 1: MEDICAL ID
     ═══════════════════════════════════════════════════════ */
  const renderMedIdModal = () => (
    <Modal
      visible={showMedIdModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowMedIdModal(false)}>
      <View style={styles.sheetOverlay}>
        <TouchableOpacity
          style={styles.sheetBackdrop}
          activeOpacity={1}
          onPress={() => setShowMedIdModal(false)}
        />
        <View
          style={[
            styles.sheetContainer,
            {paddingBottom: Math.max(insets.bottom, vs(20))},
          ]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.dragHandle} />

            <View style={{alignItems: 'center', marginBottom: vs(14)}}>
              <AppText style={{fontSize: ms(32)}}>
                {'\uD83D\uDED1'}
              </AppText>
              <AppText
                variant="bodyBold"
                style={{fontSize: ms(18), marginTop: vs(4)}}>
                Medical ID
              </AppText>
              <AppText variant="caption" color={Colors.textSecondary}>
                {MEDICAL_ID.name} {'\u00B7'} {MEDICAL_ID.age} {'\u00B7'}{' '}
                {MEDICAL_ID.bloodType}
              </AppText>
            </View>

            {/* 2x2 Grid */}
            <View style={styles.medGrid}>
              {MEDICAL_ID_GRID.map((cell, i) => (
                <View key={i} style={styles.medGridCell}>
                  <AppText
                    variant="small"
                    style={{
                      color: Colors.textTertiary,
                      fontSize: ms(9),
                      textTransform: 'uppercase',
                      fontWeight: '600',
                      marginBottom: vs(2),
                    }}>
                    {cell.label}
                  </AppText>
                  <AppText variant="body" style={{fontSize: ms(12)}}>
                    {cell.value}
                  </AppText>
                </View>
              ))}
            </View>

            {/* Physician info */}
            <View
              style={[
                styles.card,
                {backgroundColor: Colors.tealBg, marginTop: vs(14)},
              ]}>
              <AppText variant="bodyBold" style={{color: Colors.tealText, fontSize: ms(13)}}>
                {MEDICAL_ID.physician}
              </AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{fontSize: ms(10)}}>
                {MEDICAL_ID.physicianHospital} {'\u00B7'}{' '}
                {MEDICAL_ID.physicianPhone}
              </AppText>
            </View>

            {/* Buttons */}
            <TouchableOpacity
              style={[styles.modalBtn, {backgroundColor: Colors.accent, marginTop: vs(14)}]}
              activeOpacity={0.7}
              onPress={() => Alert.alert('Share', 'Medical ID share link copied.')}>
              <AppText variant="bodyBold" style={{color: Colors.white, fontSize: ms(14)}}>
                Share link
              </AppText>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.modalBtn, {backgroundColor: Colors.borderLight, marginTop: vs(8)}]}
              activeOpacity={0.7}
              onPress={() => setShowMedIdModal(false)}>
              <AppText variant="bodyBold" style={{fontSize: ms(14)}}>
                Close
              </AppText>
            </TouchableOpacity>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  /* ═══════════════════════════════════════════════════════
     MODAL 2: SETTINGS
     ═══════════════════════════════════════════════════════ */
  const renderSettingsModal = () => (
    <Modal
      visible={showSettingsModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowSettingsModal(false)}>
      <View style={styles.sheetOverlay}>
        <TouchableOpacity
          style={styles.sheetBackdrop}
          activeOpacity={1}
          onPress={() => setShowSettingsModal(false)}
        />
        <View
          style={[
            styles.sheetContainer,
            {paddingBottom: Math.max(insets.bottom, vs(20))},
          ]}>
          <ScrollView showsVerticalScrollIndicator={false}>
            <View style={styles.dragHandle} />

            <AppText
              variant="bodyBold"
              style={{fontSize: ms(18), marginBottom: vs(14)}}>
              {'\u2699'} SOS Settings
            </AppText>

            {SOS_SETTINGS.map((setting, i) => (
              <View
                key={i}
                style={[
                  styles.settingRow,
                  i < SOS_SETTINGS.length - 1 && {
                    borderBottomWidth: 1,
                    borderBottomColor: Colors.borderLight,
                  },
                ]}>
                <View style={styles.settingIcoCircle}>
                  <AppText style={{fontSize: ms(16)}}>{setting.ico}</AppText>
                </View>
                <View style={{flex: 1, marginLeft: s(10)}}>
                  <AppText variant="bodyBold" style={{fontSize: ms(13)}}>
                    {setting.title}
                  </AppText>
                  <AppText
                    variant="small"
                    color={Colors.textSecondary}
                    style={{fontSize: ms(10)}}>
                    {setting.desc}
                  </AppText>
                  {setting.locked && (
                    <AppText
                      variant="small"
                      style={{color: Colors.redText, fontSize: ms(9), marginTop: vs(2)}}>
                      Required {'\u00B7'} cannot be disabled
                    </AppText>
                  )}
                </View>
                <TouchableOpacity
                  activeOpacity={0.7}
                  onPress={() => {
                    if (setting.locked) {
                      Alert.alert(
                        'Locked',
                        'This setting is required and cannot be disabled.',
                      );
                      return;
                    }
                    setSettingsState(prev => {
                      const next = [...prev];
                      next[i] = !next[i];
                      return next;
                    });
                  }}>
                  <View
                    style={[
                      styles.toggle,
                      {
                        backgroundColor: settingsState[i]
                          ? Colors.accent
                          : Colors.borderLight,
                      },
                    ]}>
                    <View
                      style={[
                        styles.toggleKnob,
                        {
                          alignSelf: settingsState[i]
                            ? 'flex-end'
                            : 'flex-start',
                        },
                      ]}
                    />
                  </View>
                </TouchableOpacity>
              </View>
            ))}

            {/* Warning */}
            <View style={[styles.card, {backgroundColor: Colors.redBg, marginTop: vs(14)}]}>
              <AppText variant="small" style={{color: Colors.redText, fontSize: ms(10)}}>
                SOS cannot be fully disabled. Required settings are always
                active.
              </AppText>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  /* ═══════════════════════════════════════════════════════
     MODAL 3: CANCEL CONFIRMATION
     ═══════════════════════════════════════════════════════ */
  const renderCancelModal = () => (
    <Modal
      visible={showCancelModal}
      animationType="slide"
      transparent
      onRequestClose={() => setShowCancelModal(false)}>
      <View style={styles.sheetOverlay}>
        <TouchableOpacity
          style={styles.sheetBackdrop}
          activeOpacity={1}
          onPress={() => setShowCancelModal(false)}
        />
        <View
          style={[
            styles.sheetContainer,
            {paddingBottom: Math.max(insets.bottom, vs(20))},
          ]}>
          <View style={styles.dragHandle} />

          <View style={{alignItems: 'center', marginBottom: vs(14)}}>
            <AppText style={{fontSize: ms(40)}}>
              {'\u26A0\uFE0F'}
            </AppText>
            <AppText
              variant="bodyBold"
              style={{fontSize: ms(18), marginTop: vs(6)}}>
              Cancel Emergency SOS?
            </AppText>
            <AppText
              variant="caption"
              color={Colors.textSecondary}
              style={{textAlign: 'center', marginTop: vs(6)}}>
              Only cancel if the emergency has been resolved and you are safe.
            </AppText>
          </View>

          {/* Red warning box */}
          <View style={[styles.card, {backgroundColor: Colors.redBg}]}>
            <AppText variant="small" style={{color: Colors.redText, fontSize: ms(11)}}>
              Cancelling sends a "resolved" notification to all contacts and 112
              emergency services.
            </AppText>
          </View>

          <TouchableOpacity
            style={[styles.modalBtn, {backgroundColor: Colors.accent, marginTop: vs(14)}]}
            activeOpacity={0.7}
            onPress={cancelSOS}>
            <AppText variant="bodyBold" style={{color: Colors.white, fontSize: ms(14)}}>
              Emergency resolved {'\u2014'} cancel SOS
            </AppText>
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.modalBtn, {backgroundColor: Colors.red, marginTop: vs(8)}]}
            activeOpacity={0.7}
            onPress={() => setShowCancelModal(false)}>
            <AppText variant="bodyBold" style={{color: Colors.white, fontSize: ms(14)}}>
              Keep SOS active
            </AppText>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <View style={styles.container}>
      <StatusBar
        barStyle="light-content"
        backgroundColor={isActive ? Colors.redDark : Colors.primary}
      />
      {isActive ? renderActiveHeader() : renderStandbyHeader()}
      {isActive ? renderActive() : renderStandby()}
      {renderMedIdModal()}
      {renderSettingsModal()}
      {renderCancelModal()}
    </View>
  );
};

/* ═══════════════════════════════════════════════════════
   STYLES
   ═══════════════════════════════════════════════════════ */
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },

  /* ── Headers ─────────────────────────────────────────── */
  header: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(16),
    paddingBottom: vs(12),
  },
  activeHeader: {
    backgroundColor: Colors.redDark,
    paddingHorizontal: s(16),
    paddingBottom: vs(12),
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: vs(8),
  },
  backBtn: {
    paddingVertical: vs(4),
  },
  backText: {
    color: Colors.white,
    fontSize: ms(14),
  },
  headerTitleCenter: {
    color: Colors.white,
    fontSize: ms(16),
    position: 'absolute',
    left: 0,
    right: 0,
    textAlign: 'center',
  },
  activeBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: s(6),
  },
  pulseDotSmall: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    backgroundColor: Colors.red,
  },
  cancelBtn: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: s(12),
    paddingVertical: vs(5),
    borderRadius: ms(8),
  },
  cancelBtnText: {
    color: Colors.white,
    fontWeight: '700',
    fontSize: ms(11),
  },

  /* ── Scroll ──────────────────────────────────────────── */
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingHorizontal: s(16),
    paddingTop: vs(14),
  },

  /* ── Card ────────────────────────────────────────────── */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(10),
  },
  sectionLabel: {
    fontSize: ms(10),
    fontWeight: '700',
    letterSpacing: 0.5,
    marginBottom: vs(8),
    marginLeft: s(2),
  },

  /* ── Medical ID Banner ─────────────────────────────── */
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
    marginTop: vs(8),
  },
  condPill: {
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
  },

  /* ── Trigger Methods ───────────────────────────────── */
  triggerRow: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(16),
  },
  triggerCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(10),
    borderRadius: ms(12),
  },

  /* ── SOS Button ────────────────────────────────────── */
  sosContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    height: ms(200),
    marginBottom: vs(4),
  },
  sosRing: {
    position: 'absolute',
    backgroundColor: Colors.red,
    borderWidth: 2,
    borderColor: Colors.red,
  },
  sosButton: {
    width: ms(132),
    height: ms(132),
    borderRadius: ms(66),
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 8,
    shadowColor: Colors.red,
    shadowOffset: {width: 0, height: 4},
    shadowOpacity: 0.4,
    shadowRadius: 12,
    overflow: 'hidden',
    zIndex: 10,
  },
  holdOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: 'flex-end',
  },
  holdFill: {
    backgroundColor: 'rgba(0,0,0,0.25)',
    width: '100%',
  },

  /* ── Sequence ──────────────────────────────────────── */
  seqRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  seqNum: {
    width: ms(22),
    height: ms(22),
    borderRadius: ms(11),
    backgroundColor: Colors.red,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(2),
  },
  delayBadge: {
    backgroundColor: Colors.redBg,
    paddingHorizontal: s(7),
    paddingVertical: vs(2),
    borderRadius: ms(6),
    marginLeft: s(6),
    marginTop: vs(2),
  },

  /* ── Contacts ──────────────────────────────────────── */
  contactChip: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(12),
    alignItems: 'center',
    width: s(110),
  },
  contactAvatar: {
    width: ms(42),
    height: ms(42),
    borderRadius: ms(21),
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── Hospitals ─────────────────────────────────────── */
  distBadge: {
    backgroundColor: Colors.accent,
    paddingHorizontal: s(8),
    paddingVertical: vs(4),
    borderRadius: ms(8),
  },

  /* ── Emergency Call Bar ────────────────────────────── */
  call112Btn: {
    backgroundColor: Colors.red,
    paddingHorizontal: s(16),
    paddingVertical: vs(8),
    borderRadius: ms(10),
  },

  /* ── Active View ───────────────────────────────────── */
  mapCard: {
    backgroundColor: '#1A3A35',
    borderRadius: ms(14),
    overflow: 'hidden',
    marginBottom: vs(10),
  },
  mapInner: {
    height: vs(150),
    backgroundColor: '#1A3A35',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapDotOuter: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapDotRing: {
    position: 'absolute',
    width: ms(40),
    height: ms(40),
    borderRadius: ms(20),
    backgroundColor: 'rgba(226,75,74,0.3)',
  },
  mapDotCenter: {
    width: ms(14),
    height: ms(14),
    borderRadius: ms(7),
    backgroundColor: Colors.red,
    borderWidth: 2,
    borderColor: Colors.white,
  },
  mapFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
    backgroundColor: 'rgba(0,0,0,0.2)',
  },
  greenDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: '#22C55E',
  },

  /* ── Dispatch ──────────────────────────────────────── */
  dispatchAvatar: {
    width: ms(38),
    height: ms(38),
    borderRadius: ms(19),
    alignItems: 'center',
    justifyContent: 'center',
  },
  statusBadge: {
    paddingHorizontal: s(7),
    paddingVertical: vs(2),
    borderRadius: ms(6),
  },

  /* ── Medical ID Grid ───────────────────────────────── */
  medGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  medGridCell: {
    width: '50%',
    paddingHorizontal: s(6),
    paddingVertical: vs(6),
  },
  physicianRow: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    paddingTop: vs(8),
  },

  /* ── Action Buttons ────────────────────────────────── */
  actionBtn: {
    paddingVertical: vs(14),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  actionBtnSmall: {
    backgroundColor: Colors.tealBg,
    paddingVertical: vs(12),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* ── Settings Modal ────────────────────────────────── */
  settingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(12),
  },
  settingIcoCircle: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },
  toggle: {
    width: ms(44),
    height: ms(24),
    borderRadius: ms(12),
    padding: ms(3),
    justifyContent: 'center',
  },
  toggleKnob: {
    width: ms(18),
    height: ms(18),
    borderRadius: ms(9),
    backgroundColor: Colors.white,
  },

  /* ── Modal Buttons ─────────────────────────────────── */
  modalBtn: {
    paddingVertical: vs(14),
    borderRadius: ms(12),
    alignItems: 'center',
  },

  /* ── Bottom Sheet ──────────────────────────────────── */
  sheetOverlay: {flex: 1, justifyContent: 'flex-end'},
  sheetBackdrop: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.45)',
  },
  sheetContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: ms(20),
    borderTopRightRadius: ms(20),
    padding: s(20),
    maxHeight: '85%',
  },
  dragHandle: {
    width: s(36),
    height: vs(4),
    borderRadius: ms(2),
    backgroundColor: Colors.borderLight,
    alignSelf: 'center',
    marginBottom: vs(14),
  },
});

export default EmergencySOSScreen;
