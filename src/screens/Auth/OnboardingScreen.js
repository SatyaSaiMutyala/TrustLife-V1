import React, {useState, useRef} from 'react';
import {
  View,
  StyleSheet,
  StatusBar,
  TouchableOpacity,
  FlatList,
  Dimensions,
  ScrollView,
} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useNavigation} from '@react-navigation/native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import AppText from '../../components/shared/AppText';
import Icon from '../../components/shared/Icons';

const {width: SCREEN_W, height: SCREEN_H} = Dimensions.get('window');

// ──────────────────────────────────────────────
// Page 1: Splash / Brand
// ──────────────────────────────────────────────

const SplashPage = ({onNext}) => (
  <View style={[pg.container, {backgroundColor: Colors.primary}]}>
    <View style={pg.center}>
      <View style={pg.logoWrap}>
        <AppText style={pg.logoSmall} color="rgba(255,255,255,0.38)">trust</AppText>
        <AppText style={pg.logoBig} color={Colors.paleGreen}>life</AppText>
      </View>

      <AppText style={pg.tagline} color="rgba(255,255,255,0.45)">
        {'Your health.\nConnected. For life.'}
      </AppText>

      <TouchableOpacity style={pg.ctaBtn} onPress={onNext} activeOpacity={0.8}>
        <AppText variant="bodyBold" color={Colors.white} style={{letterSpacing: 0.3}}>
          Begin your record
        </AppText>
      </TouchableOpacity>

      <AppText style={pg.subText} color="rgba(255,255,255,0.22)">
        Already have a record? Sign in
      </AppText>
    </View>
  </View>
);

// ──────────────────────────────────────────────
// Page 2: Brand Story / Life Record
// ──────────────────────────────────────────────

const TIMELINE = [
  {age: 'Age 28', event: 'First full body checkup. HbA1c flagged - caught early.', active: true},
  {age: 'Age 34', event: 'Thyroid panel added. Ayu noticed a 3-year trend.', active: true},
  {age: 'Age 38', event: 'HTN detected. Full cardiac panel auto-recommended.', active: true},
  {age: 'Your next chapter', event: 'Still being written.', active: false},
];

const LifeRecordPage = ({onNext}) => (
  <View style={[pg.container, {backgroundColor: Colors.primary}]}>
    <ScrollView style={{flex: 1}} contentContainerStyle={pg.scrollContent} showsVerticalScrollIndicator={false}>
      <AppText style={pg.eyebrow} color={Colors.paleGreen}>
        YOUR LIFE RECORD
      </AppText>

      <AppText style={pg.headline} color={Colors.white}>
        {'Every test.\nEvery year.\nOne story.'}
      </AppText>

      <AppText style={pg.body} color="rgba(255,255,255,0.5)">
        Most health apps show you last week. TrustLife shows you your whole life - a single, secure, growing record that travels with you forever.
      </AppText>

      <View style={pg.statRow}>
        <View style={pg.statPill}>
          <AppText style={pg.statNum} color={Colors.accent}>--</AppText>
          <AppText style={pg.statLabel} color="rgba(255,255,255,0.35)">Years of records</AppText>
        </View>
        <View style={pg.statPill}>
          <AppText style={pg.statNum} color={Colors.accent}>1</AppText>
          <AppText style={pg.statLabel} color="rgba(255,255,255,0.35)">Place for everything</AppText>
        </View>
        <View style={pg.statPill}>
          <AppText style={pg.statNum} color={Colors.accent}>0</AppText>
          <AppText style={pg.statLabel} color="rgba(255,255,255,0.35)">Records lost</AppText>
        </View>
      </View>

      <AppText style={pg.tlLabel} color="rgba(255,255,255,0.25)">
        YOUR RECORD, OVER A LIFETIME
      </AppText>

      {TIMELINE.map((item, i) => (
        <View key={i} style={pg.tlItem}>
          <View style={pg.tlLineCol}>
            <View style={[pg.tlDot, !item.active && pg.tlDotDim]} />
            {i < TIMELINE.length - 1 && <View style={pg.tlConnector} />}
          </View>
          <View style={{flex: 1}}>
            <AppText
              style={pg.tlAge}
              color={item.active ? Colors.paleGreen : 'rgba(255,255,255,0.3)'}>
              {item.age}
            </AppText>
            <AppText
              style={pg.tlEvent}
              color={item.active ? 'rgba(255,255,255,0.65)' : 'rgba(255,255,255,0.25)'}>
              {item.event}
            </AppText>
          </View>
        </View>
      ))}

      <TouchableOpacity style={pg.navBtn} onPress={onNext} activeOpacity={0.8}>
        <AppText variant="bodyBold" color={Colors.white} style={{letterSpacing: 0.3}}>
          See how Ayu reads your record
        </AppText>
        <Icon family="Ionicons" name="arrow-forward" size={ms(14)} color={Colors.white} style={{marginLeft: s(6)}} />
      </TouchableOpacity>
    </ScrollView>
  </View>
);

// ──────────────────────────────────────────────
// Page 3: Track Everything
// ──────────────────────────────────────────────

const VITALS = [
  {icon: 'water-outline', label: 'Glucose', color: Colors.amber},
  {icon: 'heart-outline', label: 'Blood Pressure', color: '#E24B4A'},
  {icon: 'pulse-outline', label: 'Heart Rate', color: '#E24B4A'},
  {icon: 'thermometer-outline', label: 'Temperature', color: '#D97706'},
  {icon: 'scale-outline', label: 'Weight & BMI', color: Colors.accent},
  {icon: 'analytics-outline', label: 'ECG', color: Colors.blue},
];

const LIFESTYLE = [
  {icon: 'moon-outline', label: 'Sleep'},
  {icon: 'restaurant-outline', label: 'Food & Nutrition'},
  {icon: 'happy-outline', label: 'Mood & Stress'},
  {icon: 'medkit-outline', label: 'Medications'},
  {icon: 'walk-outline', label: 'Steps & Activity'},
  {icon: 'bandage-outline', label: 'Symptoms'},
];

const TrackPage = ({onNext}) => (
  <View style={[pg.container, {backgroundColor: Colors.primary}]}>
    <ScrollView style={{flex: 1}} contentContainerStyle={pg.scrollContent} showsVerticalScrollIndicator={false}>
      <AppText style={pg.eyebrow} color={Colors.paleGreen}>
        TRACK EVERYTHING
      </AppText>

      <AppText style={pg.headline} color={Colors.white}>
        {'Your vitals.\nYour habits.\nAll in one place.'}
      </AppText>

      <AppText style={pg.body} color="rgba(255,255,255,0.5)">
        Log blood glucose, BP, heart rate, weight, sleep, mood, medications, and more. Sync from devices or enter manually. TrustLife builds a complete picture of your health over time.
      </AppText>

      <AppText style={pg.miniLabel} color="rgba(255,255,255,0.25)">
        VITALS & CONDITIONS
      </AppText>
      <View style={pg.gridWrap}>
        {VITALS.map((v, i) => (
          <View key={i} style={pg.gridItem}>
            <View style={[pg.gridIcon, {backgroundColor: v.color + '20'}]}>
              <Icon family="Ionicons" name={v.icon} size={ms(16)} color={v.color} />
            </View>
            <AppText variant="small" color="rgba(255,255,255,0.7)" style={{marginTop: vs(4), textAlign: 'center'}}>
              {v.label}
            </AppText>
          </View>
        ))}
      </View>

      <AppText style={[pg.miniLabel, {marginTop: vs(16)}]} color="rgba(255,255,255,0.25)">
        LIFESTYLE & HABITS
      </AppText>
      <View style={{gap: vs(8)}}>
        {LIFESTYLE.map((l, i) => (
          <View key={i} style={pg.listRow}>
            <Icon family="Ionicons" name={l.icon} size={ms(16)} color={Colors.paleGreen} />
            <AppText variant="caption" color="rgba(255,255,255,0.65)" style={{marginLeft: s(10)}}>
              {l.label}
            </AppText>
          </View>
        ))}
      </View>

      <View style={pg.calloutBox}>
        <Icon family="Ionicons" name="bluetooth-outline" size={ms(16)} color={Colors.accent} />
        <AppText variant="small" color="rgba(255,255,255,0.55)" style={{flex: 1, marginLeft: s(10), lineHeight: ms(16)}}>
          Sync from Accu-Chek, Omron, Apple Health, Fitbit, and 20+ devices. Or enter manually - your choice.
        </AppText>
      </View>

      <TouchableOpacity style={pg.navBtn} onPress={onNext} activeOpacity={0.8}>
        <AppText variant="bodyBold" color={Colors.white} style={{letterSpacing: 0.3}}>
          See your health vault
        </AppText>
        <Icon family="Ionicons" name="arrow-forward" size={ms(14)} color={Colors.white} style={{marginLeft: s(6)}} />
      </TouchableOpacity>
    </ScrollView>
  </View>
);

// ──────────────────────────────────────────────
// Page 4: Health Vault / Records
// ──────────────────────────────────────────────

const RECORD_TYPES = [
  {icon: 'document-text-outline', title: 'Lab reports', desc: 'Blood work, imaging, pathology - all in one timeline'},
  {icon: 'medical-outline', title: 'Doctor notes', desc: 'Prescriptions, visit summaries, referral letters'},
  {icon: 'shield-checkmark-outline', title: 'Vaccination records', desc: 'Complete immunisation history with due-date alerts'},
  {icon: 'receipt-outline', title: 'Service bills', desc: 'Track every rupee spent on health - OPD, pharmacy, labs'},
  {icon: 'fitness-outline', title: 'Health logs', desc: 'Daily vitals, symptoms, medication adherence over years'},
];

const VaultPage = ({onNext}) => (
  <View style={[pg.container, {backgroundColor: Colors.primary}]}>
    <ScrollView style={{flex: 1}} contentContainerStyle={pg.scrollContent} showsVerticalScrollIndicator={false}>
      <AppText style={pg.eyebrow} color={Colors.paleGreen}>
        YOUR HEALTH VAULT
      </AppText>

      <AppText style={pg.headline} color={Colors.white}>
        {'Every report.\nEvery prescription.\nAlways accessible.'}
      </AppText>

      <AppText style={pg.body} color="rgba(255,255,255,0.5)">
        No more searching WhatsApp for that lab PDF. TrustLife organises every record into a permanent, searchable vault - sorted by date, doctor, condition, and organ.
      </AppText>

      <View style={{gap: vs(10)}}>
        {RECORD_TYPES.map((r, i) => (
          <View key={i} style={pg.vaultRow}>
            <View style={pg.vaultIcon}>
              <Icon family="Ionicons" name={r.icon} size={ms(18)} color={Colors.accent} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="bodyBold" color="rgba(255,255,255,0.85)">
                {r.title}
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.4)" style={{marginTop: vs(2), lineHeight: ms(15)}}>
                {r.desc}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      <View style={pg.calloutBox}>
        <Icon family="Ionicons" name="lock-closed-outline" size={ms(16)} color={Colors.accent} />
        <AppText variant="small" color="rgba(255,255,255,0.55)" style={{flex: 1, marginLeft: s(10), lineHeight: ms(16)}}>
          End-to-end encrypted. DPDP Act 2023 compliant. Your records never leave your control.
        </AppText>
      </View>

      <TouchableOpacity style={pg.navBtn} onPress={onNext} activeOpacity={0.8}>
        <AppText variant="bodyBold" color={Colors.white} style={{letterSpacing: 0.3}}>
          Meet your health companion
        </AppText>
        <Icon family="Ionicons" name="arrow-forward" size={ms(14)} color={Colors.white} style={{marginLeft: s(6)}} />
      </TouchableOpacity>
    </ScrollView>
  </View>
);

// ──────────────────────────────────────────────
// Page 5: Health Services
// ──────────────────────────────────────────────

const SERVICES = [
  {icon: 'medical-outline', title: 'Doctor consultations', desc: 'In-clinic and video consultations with specialists'},
  {icon: 'flask-outline', title: 'Lab tests at home', desc: 'Book blood work, imaging - results straight to your vault'},
  {icon: 'medkit-outline', title: 'Medicine delivery', desc: 'Order prescriptions with refill reminders'},
  {icon: 'videocam-outline', title: 'Telemedicine', desc: 'Talk to a doctor in under 10 minutes'},
  {icon: 'barbell-outline', title: 'Health coaching', desc: 'Nutrition, fitness, and diabetes coaches'},
  {icon: 'chatbubbles-outline', title: 'Mental wellness', desc: 'Counsellors and therapists on demand'},
];

const ServicesPage = ({onNext}) => (
  <View style={[pg.container, {backgroundColor: Colors.primary}]}>
    <ScrollView style={{flex: 1}} contentContainerStyle={pg.scrollContent} showsVerticalScrollIndicator={false}>
      <AppText style={pg.eyebrow} color={Colors.paleGreen}>
        HEALTH SERVICES
      </AppText>

      <AppText style={pg.headline} color={Colors.white}>
        {'Doctors. Labs.\nMedicines. Coaches.\nAll here.'}
      </AppText>

      <AppText style={pg.body} color="rgba(255,255,255,0.5)">
        Book appointments, order tests, get medicines delivered, talk to a coach - without leaving the app. Every interaction feeds into your life record.
      </AppText>

      <View style={pg.serviceGrid}>
        {SERVICES.map((srv, i) => (
          <View key={i} style={pg.serviceCard}>
            <View style={pg.serviceIcon}>
              <Icon family="Ionicons" name={srv.icon} size={ms(18)} color={Colors.accent} />
            </View>
            <AppText variant="caption" color="rgba(255,255,255,0.8)" style={{fontWeight: '600', marginTop: vs(6)}}>
              {srv.title}
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.35)" style={{marginTop: vs(2), lineHeight: ms(14)}}>
              {srv.desc}
            </AppText>
          </View>
        ))}
      </View>

      <TouchableOpacity style={pg.navBtn} onPress={onNext} activeOpacity={0.8}>
        <AppText variant="bodyBold" color={Colors.white} style={{letterSpacing: 0.3}}>
          Meet Ayu, your AI companion
        </AppText>
        <Icon family="Ionicons" name="arrow-forward" size={ms(14)} color={Colors.white} style={{marginLeft: s(6)}} />
      </TouchableOpacity>
    </ScrollView>
  </View>
);

// ──────────────────────────────────────────────
// Page 6: Meet Ayu
// ──────────────────────────────────────────────

const AYU_FEATURES = [
  {icon: 'trending-up-outline', title: 'Trend intelligence', desc: 'Spots patterns across years of data, not just snapshots'},
  {icon: 'notifications-outline', title: 'Proactive alerts', desc: 'Tells you what to test before symptoms appear'},
  {icon: 'analytics-outline', title: 'Health score', desc: 'A single 0-100 score that reflects your total health'},
  {icon: 'chatbubble-outline', title: 'Ask anything', desc: 'Chat with Ayu about your reports, medications, or symptoms'},
  {icon: 'lock-closed-outline', title: 'Yours alone', desc: 'Your record never leaves your control'},
];

const MeetAyuPage = ({onFinish}) => (
  <View style={[pg.container, {backgroundColor: Colors.primary}]}>
    <ScrollView style={{flex: 1}} contentContainerStyle={pg.scrollContent} showsVerticalScrollIndicator={false}>
      <View style={pg.ayuAvatar}>
        <AppText style={{fontSize: ms(22), fontWeight: '700', fontStyle: 'italic', color: Colors.white}}>A</AppText>
      </View>

      <AppText style={pg.eyebrow} color="rgba(255,255,255,0.35)">
        MEET YOUR COMPANION
      </AppText>
      <AppText style={pg.ayuName} color={Colors.white}>Ayu</AppText>
      <AppText style={pg.ayuSub} color="rgba(255,255,255,0.4)">
        The intelligence that reads your life record and guides what comes next.
      </AppText>

      <View style={pg.ayuBubble}>
        <AppText style={pg.ayuBubbleText} color="rgba(255,255,255,0.75)">
          Hi. I've been built to understand health{' '}
          <AppText style={[pg.ayuBubbleText, {color: Colors.paleGreen, fontWeight: '500'}]}>across time</AppText>
          {' '}- not just today's numbers, but how your body has changed over years.{' '}
          <AppText style={[pg.ayuBubbleText, {color: Colors.paleGreen, fontWeight: '500'}]}>Your record is my memory.</AppText>
        </AppText>
      </View>

      <View style={{gap: vs(10), marginTop: vs(4)}}>
        {AYU_FEATURES.map((feat, i) => (
          <View key={i} style={pg.featRow}>
            <View style={pg.featIcon}>
              <Icon family="Ionicons" name={feat.icon} size={ms(14)} color={Colors.accent} />
            </View>
            <View style={{flex: 1}}>
              <AppText variant="caption" color="rgba(255,255,255,0.8)" style={{fontWeight: '500'}}>
                {feat.title}
              </AppText>
              <AppText variant="small" color="rgba(255,255,255,0.4)" style={{marginTop: vs(1), lineHeight: ms(15)}}>
                {feat.desc}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      <TouchableOpacity style={pg.navBtn} onPress={onFinish} activeOpacity={0.8}>
        <AppText variant="bodyBold" color={Colors.white} style={{letterSpacing: 0.3}}>
          Begin my record
        </AppText>
      </TouchableOpacity>
    </ScrollView>
  </View>
);

// ──────────────────────────────────────────────
// Main Onboarding Screen
// ──────────────────────────────────────────────

const PAGES = ['splash', 'liferecord', 'track', 'vault', 'services', 'meetayu'];

const OnboardingScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const flatListRef = useRef(null);
  const [currentPage, setCurrentPage] = useState(0);

  const goToPage = (index) => {
    flatListRef.current?.scrollToIndex({index, animated: true});
  };

  const goNext = () => {
    if (currentPage < PAGES.length - 1) {
      goToPage(currentPage + 1);
    }
  };

  const goToSplash = () => {
    navigation.replace('Splash');
  };

  const onViewableItemsChanged = useRef(({viewableItems}) => {
    if (viewableItems.length > 0) {
      setCurrentPage(viewableItems[0].index);
    }
  }).current;

  const viewabilityConfig = useRef({viewAreaCoveragePercentThreshold: 50}).current;

  const renderPage = ({item}) => {
    switch (item) {
      case 'splash':
        return <SplashPage onNext={goNext} />;
      case 'liferecord':
        return <LifeRecordPage onNext={goNext} />;
      case 'track':
        return <TrackPage onNext={goNext} />;
      case 'vault':
        return <VaultPage onNext={goNext} />;
      case 'services':
        return <ServicesPage onNext={goNext} />;
      case 'meetayu':
        return <MeetAyuPage onFinish={goToSplash} />;
      default:
        return null;
    }
  };

  return (
    <View style={{flex: 1, backgroundColor: Colors.primary}}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {currentPage > 0 && (
        <View style={[st.topBar, {paddingTop: insets.top + vs(10)}]}>
          <View style={st.dotsRow}>
            {PAGES.map((_, i) => (
              <View
                key={i}
                style={[st.dot, currentPage === i && st.dotActive]}
              />
            ))}
          </View>
          <TouchableOpacity onPress={goToSplash} hitSlop={{top: 10, bottom: 10, left: 10, right: 10}}>
            <AppText variant="small" color="rgba(255,255,255,0.3)" style={{letterSpacing: 0.4}}>
              Skip
            </AppText>
          </TouchableOpacity>
        </View>
      )}

      <FlatList
        ref={flatListRef}
        data={PAGES}
        renderItem={renderPage}
        keyExtractor={item => item}
        horizontal
        pagingEnabled
        showsHorizontalScrollIndicator={false}
        bounces={false}
        onViewableItemsChanged={onViewableItemsChanged}
        viewabilityConfig={viewabilityConfig}
        getItemLayout={(_, index) => ({length: SCREEN_W, offset: SCREEN_W * index, index})}
        style={{flex: 1}}
      />
    </View>
  );
};

// ──────────────────────────────────────────────
// Page Styles
// ──────────────────────────────────────────────

const pg = StyleSheet.create({
  container: {
    width: SCREEN_W,
    height: SCREEN_H,
  },
  center: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: s(24),
  },
  scrollContent: {
    paddingHorizontal: s(22),
    paddingTop: vs(60),
    paddingBottom: vs(40),
  },

  // Page 1: Splash
  logoWrap: {
    alignItems: 'flex-start',
    marginBottom: vs(24),
  },
  logoSmall: {
    fontSize: ms(14),
    fontWeight: '700',
    letterSpacing: 1,
    marginBottom: -vs(2),
  },
  logoBig: {
    fontSize: ms(64),
    fontWeight: '800',
    letterSpacing: -1,
    lineHeight: ms(64),
  },
  tagline: {
    fontSize: ms(11),
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    textAlign: 'center',
    lineHeight: ms(20),
    marginBottom: vs(32),
  },
  ctaBtn: {
    backgroundColor: Colors.accent,
    paddingVertical: vs(12),
    paddingHorizontal: s(32),
    borderRadius: ms(50),
  },
  subText: {
    fontSize: ms(10),
    marginTop: vs(14),
    letterSpacing: 0.3,
  },

  // Shared page styles
  eyebrow: {
    fontSize: ms(9),
    letterSpacing: 2,
    textTransform: 'uppercase',
    fontWeight: '500',
    marginBottom: vs(8),
  },
  headline: {
    fontSize: ms(24),
    fontWeight: '700',
    fontStyle: 'italic',
    lineHeight: ms(32),
    marginBottom: vs(14),
  },
  body: {
    fontSize: ms(11),
    lineHeight: ms(20),
    marginBottom: vs(20),
  },
  miniLabel: {
    fontSize: ms(9),
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    fontWeight: '600',
    marginBottom: vs(10),
  },
  navBtn: {
    backgroundColor: Colors.accent,
    borderRadius: ms(50),
    paddingVertical: vs(12),
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: vs(24),
  },

  // Page 2: Life Record
  statRow: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(20),
  },
  statPill: {
    flex: 1,
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: ms(10),
    paddingVertical: vs(10),
    paddingHorizontal: s(8),
  },
  statNum: {
    fontSize: ms(22),
    fontWeight: '800',
    lineHeight: ms(24),
  },
  statLabel: {
    fontSize: ms(9),
    lineHeight: ms(13),
    marginTop: vs(2),
  },
  tlLabel: {
    fontSize: ms(9),
    letterSpacing: 1.5,
    textTransform: 'uppercase',
    marginBottom: vs(10),
  },
  tlItem: {
    flexDirection: 'row',
    gap: s(10),
    alignItems: 'flex-start',
    marginBottom: vs(12),
  },
  tlLineCol: {
    alignItems: 'center',
    marginTop: vs(3),
  },
  tlDot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
    backgroundColor: Colors.accent,
  },
  tlDotDim: {
    backgroundColor: 'rgba(255,255,255,0.15)',
  },
  tlConnector: {
    width: ms(1.5),
    height: vs(28),
    backgroundColor: 'rgba(255,255,255,0.08)',
  },
  tlAge: {
    fontSize: ms(9),
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  tlEvent: {
    fontSize: ms(10),
    lineHeight: ms(15),
    marginTop: vs(1),
  },

  // Page 3: Track
  gridWrap: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(10),
  },
  gridItem: {
    width: '29%',
    alignItems: 'center',
    paddingVertical: vs(10),
    backgroundColor: 'rgba(255,255,255,0.04)',
    borderRadius: ms(10),
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  gridIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
  listRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(6),
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  calloutBox: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: ms(10),
    padding: ms(12),
    marginTop: vs(16),
  },

  // Page 4: Vault
  vaultRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: s(12),
    paddingVertical: vs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: 'rgba(255,255,255,0.06)',
  },
  vaultIcon: {
    width: ms(36),
    height: ms(36),
    backgroundColor: 'rgba(29,158,117,0.15)',
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Page 5: Services
  serviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  serviceCard: {
    width: '47%',
    backgroundColor: 'rgba(255,255,255,0.05)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
    borderRadius: ms(12),
    padding: ms(12),
  },
  serviceIcon: {
    width: ms(32),
    height: ms(32),
    backgroundColor: 'rgba(29,158,117,0.15)',
    borderRadius: ms(8),
    alignItems: 'center',
    justifyContent: 'center',
  },

  // Page 6: Meet Ayu
  ayuAvatar: {
    width: ms(52),
    height: ms(52),
    backgroundColor: Colors.accent,
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(14),
  },
  ayuName: {
    fontSize: ms(30),
    fontWeight: '700',
    fontStyle: 'italic',
    lineHeight: ms(32),
    marginBottom: vs(4),
  },
  ayuSub: {
    fontSize: ms(11),
    lineHeight: ms(17),
    marginBottom: vs(18),
  },
  ayuBubble: {
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.1)',
    borderTopLeftRadius: ms(4),
    borderTopRightRadius: ms(14),
    borderBottomLeftRadius: ms(14),
    borderBottomRightRadius: ms(14),
    padding: ms(13),
    marginBottom: vs(12),
  },
  ayuBubbleText: {
    fontSize: ms(11),
    lineHeight: ms(19),
  },
  featRow: {
    flexDirection: 'row',
    gap: s(10),
    alignItems: 'flex-start',
  },
  featIcon: {
    width: ms(28),
    height: ms(28),
    backgroundColor: 'rgba(29,158,117,0.15)',
    borderRadius: ms(8),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

// ──────────────────────────────────────────────
// Top bar styles
// ──────────────────────────────────────────────

const st = StyleSheet.create({
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    zIndex: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: s(22),
    paddingBottom: vs(8),
  },
  dotsRow: {
    flexDirection: 'row',
    gap: s(5),
  },
  dot: {
    width: ms(14),
    height: ms(3),
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: ms(2),
  },
  dotActive: {
    backgroundColor: Colors.accent,
    width: ms(24),
  },
});

export default OnboardingScreen;
