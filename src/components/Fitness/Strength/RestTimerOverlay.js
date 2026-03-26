import React, {useState, useRef, useEffect, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Animated,
  Dimensions,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';

/* ─── Constants ─────────────────────────────────────── */

const PRESETS = [30, 45, 60, 90, 120, 180, 240, 300];

const SNOOZE_PRESETS = [
  {label: '+30s', sec: 30},
  {label: '+1m', sec: 60},
  {label: '+1m30s', sec: 90},
  {label: '+2m', sec: 120},
];

const SCREEN_WIDTH = Dimensions.get('window').width;

/* Timer states: idle | running | paused | warning | done | snoozed */

/* ─── Helpers ───────────────────────────────────────── */

const fmtTime = (totalSec) => {
  const m = Math.floor(Math.abs(totalSec) / 60);
  const sec = Math.abs(totalSec) % 60;
  return `${m}:${sec < 10 ? '0' : ''}${sec}`;
};

const presetLabel = (sec) => {
  if (sec < 60) return `${sec}s`;
  const m = Math.floor(sec / 60);
  const r = sec % 60;
  return r === 0 ? `${m}:00` : `${m}:${r < 10 ? '0' : ''}${r}`;
};

/* ─── Sub-components ────────────────────────────────── */

const PresetButton = ({label, isActive, onPress}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.presetBtn, isActive && styles.presetBtnActive]}>
    <AppText
      variant="caption"
      color={isActive ? Colors.white : Colors.textSecondary}
      style={{fontWeight: isActive ? '700' : '500'}}>
      {label}
    </AppText>
  </TouchableOpacity>
);

const ControlButton = ({label, onPress, bg, textColor, flex}) => (
  <TouchableOpacity
    onPress={onPress}
    style={[styles.controlBtn, {backgroundColor: bg, flex: flex || 1}]}>
    <AppText variant="bodyBold" color={textColor || Colors.white}>
      {label}
    </AppText>
  </TouchableOpacity>
);

const SnoozeButton = ({label, onPress}) => (
  <TouchableOpacity onPress={onPress} style={styles.snoozeBtn}>
    <AppText variant="caption" color={Colors.purple} style={{fontWeight: '600'}}>
      {label}
    </AppText>
  </TouchableOpacity>
);

/* ─── Main Component ───────────────────────────────── */

const RestTimerOverlay = ({visible, onClose, exerciseName}) => {
  const [duration, setDuration] = useState(60);
  const [remaining, setRemaining] = useState(60);
  const [timerState, setTimerState] = useState('idle'); // idle | running | paused | warning | done | snoozed
  const intervalRef = useRef(null);
  const pulseAnim = useRef(new Animated.Value(1)).current;

  /* Cleanup on unmount */
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
        intervalRef.current = null;
      }
    };
  }, []);

  /* Reset when modal closes */
  useEffect(() => {
    if (!visible) {
      stopTimer();
      setTimerState('idle');
      setRemaining(duration);
    }
  }, [visible]);

  /* Pulse animation when done */
  useEffect(() => {
    if (timerState === 'done') {
      Animated.loop(
        Animated.sequence([
          Animated.timing(pulseAnim, {toValue: 1.08, duration: 500, useNativeDriver: true}),
          Animated.timing(pulseAnim, {toValue: 1, duration: 500, useNativeDriver: true}),
        ]),
      ).start();
    } else {
      pulseAnim.stopAnimation();
      pulseAnim.setValue(1);
    }
  }, [timerState]);

  /* ─── Timer logic ────────────────────────── */

  const stopTimer = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  const startTimer = useCallback(() => {
    if (intervalRef.current) return;
    setTimerState('running');
    intervalRef.current = setInterval(() => {
      setRemaining((prev) => {
        if (prev <= 1) {
          clearInterval(intervalRef.current);
          intervalRef.current = null;
          setTimerState('done');
          return 0;
        }
        const next = prev - 1;
        if (next <= 10 && next > 0) {
          setTimerState('warning');
        }
        return next;
      });
    }, 1000);
  }, []);

  const pauseTimer = useCallback(() => {
    stopTimer();
    setTimerState('paused');
  }, [stopTimer]);

  const resetTimer = useCallback(() => {
    stopTimer();
    setRemaining(duration);
    setTimerState('idle');
  }, [stopTimer, duration]);

  const skipTimer = useCallback(() => {
    stopTimer();
    setRemaining(0);
    setTimerState('done');
  }, [stopTimer]);

  const selectPreset = useCallback((sec) => {
    stopTimer();
    setDuration(sec);
    setRemaining(sec);
    setTimerState('idle');
  }, [stopTimer]);

  const snooze = useCallback((extraSec) => {
    setRemaining(extraSec);
    setTimerState('snoozed');
    // Auto-start after snooze
    setTimeout(() => {
      setTimerState('running');
      intervalRef.current = setInterval(() => {
        setRemaining((prev) => {
          if (prev <= 1) {
            clearInterval(intervalRef.current);
            intervalRef.current = null;
            setTimerState('done');
            return 0;
          }
          const next = prev - 1;
          if (next <= 10 && next > 0) {
            setTimerState('warning');
          }
          return next;
        });
      }, 1000);
    }, 100);
  }, []);

  const handleStartPause = useCallback(() => {
    if (timerState === 'running' || timerState === 'warning') {
      pauseTimer();
    } else {
      startTimer();
    }
  }, [timerState, pauseTimer, startTimer]);

  /* ─── Visual state ───────────────────────── */

  const isRunning = timerState === 'running' || timerState === 'warning' || timerState === 'snoozed';
  const isDone = timerState === 'done';

  const timeColor = () => {
    switch (timerState) {
      case 'running':
      case 'snoozed':
        return Colors.accent;
      case 'warning':
        return Colors.amber;
      case 'done':
        return Colors.purple;
      case 'paused':
        return Colors.textTertiary;
      default:
        return Colors.textPrimary;
    }
  };

  const statusMessage = () => {
    switch (timerState) {
      case 'idle': return 'Set your rest duration';
      case 'running': return 'Resting...';
      case 'paused': return 'Timer paused';
      case 'warning': return 'Almost done!';
      case 'done': return 'Rest complete — time to lift!';
      case 'snoozed': return 'Snooze — extra rest';
      default: return '';
    }
  };

  const progressPct = duration > 0 ? (duration - remaining) / duration : 0;

  /* Ring segments (using border approach) */
  const ringSize = s(180);
  const ringBorder = s(8);

  return (
    <Modal
      visible={visible}
      transparent
      animationType="slide"
      onRequestClose={onClose}>
      <View style={styles.backdrop}>
        <TouchableOpacity style={styles.backdropTouch} onPress={onClose} activeOpacity={1} />
        <View style={styles.sheet}>
          {/* Handle */}
          <View style={styles.handle} />

          {/* Header */}
          <View style={styles.headerRow}>
            <AppText variant="header" color={Colors.textPrimary}>Rest Timer</AppText>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <AppText variant="body" color={Colors.textTertiary}>✕</AppText>
            </TouchableOpacity>
          </View>

          {/* Timer Display */}
          <Animated.View style={[styles.timerContainer, {transform: [{scale: pulseAnim}]}]}>
            <View
              style={[
                styles.timerRing,
                {
                  width: ringSize,
                  height: ringSize,
                  borderRadius: ringSize / 2,
                  borderWidth: ringBorder,
                  borderColor: Colors.borderLight,
                },
              ]}>
              {/* Progress overlay using partial border */}
              <View
                style={[
                  styles.timerRingProgress,
                  {
                    width: ringSize,
                    height: ringSize,
                    borderRadius: ringSize / 2,
                    borderWidth: ringBorder,
                    borderColor: 'transparent',
                    borderTopColor: timeColor(),
                    borderRightColor: progressPct > 0.25 ? timeColor() : 'transparent',
                    borderBottomColor: progressPct > 0.5 ? timeColor() : 'transparent',
                    borderLeftColor: progressPct > 0.75 ? timeColor() : 'transparent',
                    transform: [{rotate: `${progressPct * 360}deg`}],
                  },
                ]}
              />
              <View style={styles.timerInner}>
                <AppText
                  style={[styles.timerText, {color: timeColor()}]}>
                  {fmtTime(remaining)}
                </AppText>
                <AppText variant="caption" color={Colors.textTertiary}>
                  {statusMessage()}
                </AppText>
              </View>
            </View>
          </Animated.View>

          {/* Preset Buttons */}
          <View style={styles.presetsContainer}>
            <AppText variant="small" color={Colors.textTertiary} style={{marginBottom: vs(6)}}>
              Duration presets
            </AppText>
            <View style={styles.presetsGrid}>
              {PRESETS.map((sec) => (
                <PresetButton
                  key={sec}
                  label={presetLabel(sec)}
                  isActive={duration === sec && timerState === 'idle'}
                  onPress={() => selectPreset(sec)}
                />
              ))}
            </View>
          </View>

          {/* Control Buttons */}
          <View style={styles.controlsRow}>
            <ControlButton
              label="Reset"
              onPress={resetTimer}
              bg={Colors.background}
              textColor={Colors.textSecondary}
            />
            <ControlButton
              label={isRunning ? 'Pause' : isDone ? 'Done' : 'Start'}
              onPress={isDone ? onClose : handleStartPause}
              bg={isRunning ? Colors.red : isDone ? Colors.purple : Colors.accent}
              textColor={Colors.white}
              flex={2}
            />
            <ControlButton
              label="Skip"
              onPress={skipTimer}
              bg={Colors.background}
              textColor={Colors.textSecondary}
            />
          </View>

          {/* Snooze Buttons (shown when done) */}
          {isDone && (
            <View style={styles.snoozeContainer}>
              <AppText variant="small" color={Colors.textTertiary} style={{marginBottom: vs(6)}}>
                Need more rest?
              </AppText>
              <View style={styles.snoozeRow}>
                {SNOOZE_PRESETS.map((sp) => (
                  <SnoozeButton
                    key={sp.sec}
                    label={sp.label}
                    onPress={() => snooze(sp.sec)}
                  />
                ))}
              </View>
            </View>
          )}

          {/* Context */}
          {exerciseName ? (
            <View style={styles.contextRow}>
              <AppText variant="small" color={Colors.textTertiary}>
                Next: <AppText variant="small" color={Colors.textPrimary} style={{fontWeight: '600'}}>{exerciseName}</AppText>
              </AppText>
            </View>
          ) : null}

          <View style={{height: vs(16)}} />
        </View>
      </View>
    </Modal>
  );
};

/* ─── Styles ───────────────────────────────────────── */

const styles = StyleSheet.create({
  backdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  backdropTouch: {
    flex: 1,
  },
  sheet: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: ms(24),
    borderTopRightRadius: ms(24),
    paddingHorizontal: s(20),
    paddingTop: vs(8),
    paddingBottom: vs(20),
    maxHeight: '90%',
  },
  handle: {
    width: s(40),
    height: vs(4),
    backgroundColor: Colors.borderLight,
    borderRadius: ms(2),
    alignSelf: 'center',
    marginBottom: vs(12),
  },

  /* Header */
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: vs(16),
  },
  closeBtn: {
    width: s(32),
    height: s(32),
    borderRadius: s(16),
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Timer */
  timerContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: vs(12),
  },
  timerRing: {
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  timerRingProgress: {
    position: 'absolute',
    top: -s(8),
    left: -s(8),
  },
  timerInner: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  timerText: {
    fontSize: ms(48),
    fontWeight: '800',
    lineHeight: ms(56),
  },

  /* Presets */
  presetsContainer: {
    marginTop: vs(8),
    alignItems: 'center',
  },
  presetsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'center',
    gap: s(8),
  },
  presetBtn: {
    paddingHorizontal: s(14),
    paddingVertical: vs(8),
    borderRadius: ms(20),
    backgroundColor: Colors.background,
    borderWidth: 1,
    borderColor: Colors.borderLight,
    minWidth: s(52),
    alignItems: 'center',
  },
  presetBtnActive: {
    backgroundColor: Colors.accent,
    borderColor: Colors.accent,
  },

  /* Controls */
  controlsRow: {
    flexDirection: 'row',
    gap: s(10),
    marginTop: vs(18),
  },
  controlBtn: {
    paddingVertical: vs(14),
    borderRadius: ms(14),
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Snooze */
  snoozeContainer: {
    marginTop: vs(16),
    alignItems: 'center',
  },
  snoozeRow: {
    flexDirection: 'row',
    gap: s(8),
  },
  snoozeBtn: {
    paddingHorizontal: s(14),
    paddingVertical: vs(7),
    borderRadius: ms(16),
    backgroundColor: Colors.purpleBg,
    borderWidth: 1,
    borderColor: Colors.purple,
  },

  /* Context */
  contextRow: {
    marginTop: vs(14),
    alignItems: 'center',
    paddingVertical: vs(6),
    backgroundColor: Colors.background,
    borderRadius: ms(8),
    paddingHorizontal: s(12),
  },
});

export default RestTimerOverlay;
