import React, {useContext} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  StatusBar,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';
import {AuthContext} from '../../../App';

const DoneScreen = () => {
  const insets = useSafeAreaInsets();
  const {setIsLoggedIn} = useContext(AuthContext);

  const now = new Date();
  const timestamp = now.toLocaleString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
  const accountId = `TL-2026-${String(Math.floor(10000 + Math.random() * 90000))}`;

  const details = [
    {label: 'Account ID', value: accountId},
    {label: 'Plan', value: 'Free'},
    {label: 'ToS signed', value: timestamp},
    {label: 'Consent', value: timestamp},
    {label: 'DPDP', value: timestamp},
  ];

  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Green header */}
      <View style={[styles.header, {paddingTop: insets.top}]}>
        <AppText variant="screenName" style={styles.headerTitle}>Welcome to TrustLife</AppText>
        <AppText variant="caption" style={styles.headerSub}>Your account is ready</AppText>
      </View>

      {/* Progress */}
      <View style={styles.progressTrack}>
        <View style={[styles.progressFill, {width: '100%'}]} />
      </View>

      <ScrollView contentContainerStyle={styles.scroll} showsVerticalScrollIndicator={false}>
        {/* Checkmark */}
        <View style={styles.centerContent}>
          <View style={styles.checkCircle}>
            <AppText style={{fontSize: ms(36)}}>{'🌿'}</AppText>
          </View>

          <AppText variant="screenName" style={styles.title}>You're all set!</AppText>
          <AppText variant="body" color={Colors.textSecondary} style={{textAlign: 'center', marginBottom: vs(24)}}>
            Ayu is getting to know you. Your personalised health insights will improve as you add more data.
          </AppText>
        </View>

        {/* Account Details Card */}
        <View style={styles.card}>
          {details.map((item, idx) => (
            <View key={idx} style={[styles.detailRow, idx < details.length - 1 && styles.detailBorder]}>
              <AppText variant="caption" color={Colors.textSecondary}>{item.label}</AppText>
              <AppText variant="bodyBold" style={{textAlign: 'right', flex: 1, marginLeft: s(8)}}>{item.value}</AppText>
            </View>
          ))}
        </View>

        {/* Info Note */}
        <View style={[styles.card, {backgroundColor: Colors.tealBg}]}>
          <AppText variant="body">
            {'🌿 Ayu will start generating personalised insights once you add more health data.'}
          </AppText>
        </View>

        <View style={{height: vs(80)}} />
      </ScrollView>

      {/* CTA */}
      <View style={[styles.bottomBar, {paddingBottom: insets.bottom + vs(12)}]}>
        <TouchableOpacity
          style={styles.ctaButton}
          onPress={() => setIsLoggedIn(true)}
        >
          <View style={{flexDirection:"row",alignItems:"center",gap:s(4)}}><AppText variant="bodyBold" color={Colors.white} style={{lineHeight:ms(16)}}>Enter TrustLife</AppText><Icon family="Ionicons" name="arrow-forward" size={16} color={Colors.white} /></View>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  header: {backgroundColor: Colors.primary, paddingBottom: vs(14), paddingHorizontal: s(16)},
  headerTitle: {color: Colors.white, fontSize: ms(20), fontWeight: '700', marginBottom: vs(3)},
  headerSub: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},
  progressTrack: {height: 3, backgroundColor: Colors.borderLight},
  progressFill: {height: 3, backgroundColor: Colors.accent},
  scroll: {
    paddingHorizontal: s(16),
    paddingTop: vs(20),
  },
  centerContent: {
    alignItems: 'center',
    marginBottom: vs(20),
  },
  checkCircle: {
    width: 88,
    height: 88,
    borderRadius: 44,
    backgroundColor: Colors.tealBg,
    borderWidth: 2,
    borderColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(16),
  },
  title: {
    fontSize: ms(28),
    fontWeight: '800',
    color: Colors.textPrimary,
    textAlign: 'center',
    marginBottom: vs(8),
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    padding: s(14),
    marginBottom: vs(8),
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(8),
  },
  detailBorder: {
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  bottomBar: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: Colors.white,
    paddingHorizontal: s(16),
    paddingTop: vs(12),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  ctaButton: {
    backgroundColor: Colors.accent,
    borderRadius: ms(14),
    paddingVertical: vs(14),
    alignItems: 'center',
  },
});

export default DoneScreen;
