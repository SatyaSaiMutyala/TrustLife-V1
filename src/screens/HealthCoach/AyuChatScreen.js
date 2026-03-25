import React, {useRef, useEffect} from 'react';
import {
  View, Text, StyleSheet, ScrollView, TextInput,
  TouchableOpacity, StatusBar, KeyboardAvoidingView, Platform, Image,
} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../constants/colors';
import Fonts from '../../constants/fonts';
import AppText from '../../components/shared/AppText';
import Emoji from '../../components/shared/Emoji';
import Icon from '../../components/shared/Icons';

const contextChips = [
  {label: 'HbA1c · 14 days', dotColor: '#F09595'},
  {label: 'Sleep avg 5.9h', dotColor: '#FAC775'},
  {label: 'Steps avg 7.8k', dotColor: '#FAC775'},
  {label: 'Meds 71%', dotColor: '#FAC775'},
  {label: '7-day streak', dotColor: Colors.lightGreen},
];

const quickReplies = [
  {icon: '📊', text: 'Show my full risk summary'},
  {icon: '🍽️', text: 'What should I eat today?'},
  {icon: '🧊', text: 'Hydration tips'},
  {icon: '🧘', text: 'Stress & glucose'},
  {icon: '📋', text: 'Test day prep'},
];

const CoachAvatar = () => (
  <View style={styles.coachMsgAvatar}>
    <Image source={require('../../assets/img/ayu-nb.gif')} style={{width: ms(22), height: ms(22)}} resizeMode="contain" />
  </View>
);

const InsightCard = ({icon, title, children}) => (
  <View style={styles.insightBubble}>
    <View style={styles.insightHeader}>
      <Emoji icon={icon} size={14} />
      <AppText variant="caption" color={Colors.textSecondary} style={{fontWeight: '500'}}>{title}</AppText>
    </View>
    {children}
  </View>
);

const MetricBox = ({val, label, bg, valColor, lblColor}) => (
  <View style={[styles.metricBox, {backgroundColor: bg}]}>
    <AppText variant="body" color={valColor} style={styles.mbVal}>{val}</AppText>
    <AppText variant="small" color={lblColor} style={styles.mbLbl}>{label}</AppText>
  </View>
);

const ActionStep = ({num, text}) => (
  <View style={styles.actionItem}>
    <View style={styles.actionNum}><AppText variant="small" color={Colors.white} style={{fontWeight: '500'}}>{num}</AppText></View>
    <Text style={styles.actionText}>{text}</Text>
  </View>
);

const AyuChatScreen = ({navigation}) => {
  const scrollRef = useRef(null);

  useEffect(() => {
    setTimeout(() => scrollRef.current?.scrollToEnd({animated: false}), 100);
  }, []);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={vs(0)}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />

      {/* Header */}
      <View style={styles.header}>
        <View style={styles.headerTop}>
          <TouchableOpacity style={styles.backBtn} onPress={() => navigation.goBack()}>
            <Icon family="Ionicons" name="chevron-back" size={22} color={Colors.white} />
          </TouchableOpacity>
          <View style={styles.coachAvatarWrap}>
            <View style={styles.coachAvatar}>
              <Image source={require('../../assets/img/ayu-nb.gif')} style={{width: ms(30), height: ms(30)}} resizeMode="contain" />
            </View>
            <View style={styles.onlineDot} />
          </View>
          <View style={styles.coachInfo}>
            <AppText variant="bodyBold" color={Colors.white}>Ayu · Your health coach</AppText>
            <AppText variant="caption" color={Colors.heroTextMuted} style={styles.coachStatus}>Powered by TrustLife AI · Always available</AppText>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.hdrBtn}>
              <Emoji icon="📋" size={15} />
            </TouchableOpacity>
            <TouchableOpacity style={styles.hdrBtn}>
              <Emoji icon="⚙" size={15} />
            </TouchableOpacity>
          </View>
        </View>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.contextStrip}>
          {contextChips.map((c, i) => (
            <View key={i} style={styles.ctxChip}>
              <View style={[styles.ctxDot, {backgroundColor: c.dotColor}]} />
              <AppText variant="caption" color="#b8e8d6">{c.label}</AppText>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Chat Area */}
      <ScrollView
        ref={scrollRef}
        style={styles.chatArea}
        contentContainerStyle={styles.chatContent}
        showsVerticalScrollIndicator={false}>

        <AppText variant="caption" color={Colors.textTertiary} style={styles.dateSep}>Today · Fri, 21 Mar</AppText>

        {/* Msg 1 - Coach greeting */}
        <View style={styles.msgRow}>
          <CoachAvatar />
          <View style={styles.bubbleWrap}>
            <View style={styles.bubbleCoach}>
              <Text style={styles.bubbleCoachText}>
                Good morning Priya! I've reviewed your health data from yesterday. You have{' '}
                <Text style={styles.bold}>3 active risks</Text> that need attention before your HbA1c test on 4 April. Want me to walk you through what matters most today?
              </Text>
            </View>
            <AppText variant="small" color={Colors.textTertiary} style={styles.coachTime}>9:01 AM</AppText>
          </View>
        </View>

        {/* Msg 2 - User */}
        <View style={styles.msgRowUser}>
          <View style={styles.bubbleUserWrap}>
            <View style={styles.bubbleUser}>
              <Text style={styles.bubbleUserText}>Yes, what should I focus on first?</Text>
            </View>
            <AppText variant="small" color={Colors.textTertiary} style={styles.userTime}>9:02 AM</AppText>
          </View>
        </View>

        {/* Msg 3 - Coach sleep intro */}
        <View style={styles.msgRow}>
          <CoachAvatar />
          <View style={styles.bubbleWrap}>
            <View style={styles.bubbleCoach}>
              <Text style={styles.bubbleCoachText}>
                Your <Text style={styles.bold}>sleep is the highest-risk factor</Text> right now. You've averaged only 5.9 hours this week — well below the 7.5 hrs your body needs. Here's why it matters so much for your test:
              </Text>
            </View>
            <AppText variant="small" color={Colors.textTertiary} style={styles.coachTime}>9:02 AM</AppText>
          </View>
        </View>

        {/* Sleep Insight Card */}
        <InsightCard icon="😴" title="Sleep impact on HbA1c">
          <View style={styles.metricRow}>
            <MetricBox val="5.9h" label="Your avg" bg={Colors.redBg} valColor={Colors.redDark} lblColor={Colors.redText} />
            <MetricBox val="7.5h" label="Target" bg={Colors.tealBg} valColor={Colors.tealText} lblColor={Colors.tealDark} />
            <MetricBox val="+0.4%" label="HbA1c impact" bg={Colors.amberBg} valColor={Colors.amberDark} lblColor={Colors.amberText} />
          </View>
          <Text style={styles.insightText}>
            Poor sleep raises cortisol, which directly spikes your morning glucose. Over 14 days this alone could push your result from{' '}
            <Text style={styles.bold}>7.5% to 7.9%</Text> — above your target range.
          </Text>
          <View style={styles.actionCard}>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.actionCardTitle}>Tonight's sleep plan</AppText>
            <ActionStep num="1" text="Set a wind-down alarm at 9:30 PM" />
            <ActionStep num="2" text="No screens 30 mins before bed" />
            <ActionStep num="3" text="Keep room temperature below 24°C" />
          </View>
        </InsightCard>

        {/* Msg 4 - User steps question */}
        <View style={styles.msgRowUser}>
          <View style={styles.bubbleUserWrap}>
            <View style={styles.bubbleUser}>
              <Text style={styles.bubbleUserText}>What about my steps? I walked 8,240 yesterday</Text>
            </View>
            <AppText variant="small" color={Colors.textTertiary} style={styles.userTime}>9:04 AM</AppText>
          </View>
        </View>

        {/* Msg 5 - Coach steps response */}
        <View style={styles.msgRow}>
          <CoachAvatar />
          <View style={styles.bubbleWrap}>
            <View style={styles.bubbleCoach}>
              <Text style={styles.bubbleCoachText}>
                Good that you're tracking! 8,240 is a solid effort but{' '}
                <Text style={styles.bold}>1,760 short</Text> of the 10,000 target for Type 2 diabetics. The good news — you only need a 20-min evening walk to close that gap.
              </Text>
            </View>
            <AppText variant="small" color={Colors.textTertiary} style={styles.coachTime}>9:05 AM</AppText>
          </View>
        </View>

        {/* Steps Insight Card */}
        <InsightCard icon="🏃" title="Today's step strategy">
          <View style={styles.metricRow}>
            <MetricBox val="8,240" label="Yesterday" bg={Colors.amberBg} valColor={Colors.amberDark} lblColor={Colors.amberText} />
            <MetricBox val="10,500" label="Today's goal" bg={Colors.tealBg} valColor={Colors.tealText} lblColor={Colors.tealDark} />
          </View>
          <View style={styles.actionCard}>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.actionCardTitle}>Suggested breakdown</AppText>
            <ActionStep num="1" text="Morning walk to work or around block · ~2,000 steps" />
            <ActionStep num="2" text="Take stairs, avoid lift all day · ~500 steps" />
            <ActionStep num="3" text="20-min evening walk after dinner · ~2,000 steps" />
          </View>
          <Text style={[styles.insightText, {marginTop: vs(8)}]}>
            Walking after dinner also helps lower post-meal glucose — a double benefit for your HbA1c.
          </Text>
        </InsightCard>

        {/* Msg 6 - User meds question */}
        <View style={styles.msgRowUser}>
          <View style={styles.bubbleUserWrap}>
            <View style={styles.bubbleUser}>
              <Text style={styles.bubbleUserText}>I keep forgetting my evening Metformin. Any tips?</Text>
            </View>
            <AppText variant="small" color={Colors.textTertiary} style={styles.userTime}>9:07 AM</AppText>
          </View>
        </View>

        {/* Msg 7 - Coach meds response */}
        <View style={styles.msgRow}>
          <CoachAvatar />
          <View style={styles.bubbleWrap}>
            <View style={styles.bubbleCoach}>
              <Text style={styles.bubbleCoachText}>
                You've missed your PM Metformin <Text style={styles.bold}>3 times this week</Text>. That evening dose is critical — it suppresses overnight glucose production in your liver. Let's fix this with a system, not willpower:
              </Text>
            </View>
            <AppText variant="small" color={Colors.textTertiary} style={styles.coachTime}>9:07 AM</AppText>
          </View>
        </View>

        {/* Meds Insight Card */}
        <InsightCard icon="💊" title="Medication habit fix">
          <View style={styles.actionCard}>
            <AppText variant="caption" color={Colors.textSecondary} style={styles.actionCardTitle}>3-step habit anchor</AppText>
            <ActionStep num="1" text="Place your Metformin bottle next to your dinner plate — visual trigger" />
            <ActionStep num="2" text='Set a repeating 8:00 PM phone alarm labelled "Metformin PM"' />
            <ActionStep num="3" text="Log it in TrustLife immediately after — takes 2 seconds" />
          </View>
          <View style={styles.purpleNote}>
            <Text style={styles.purpleNoteText}>
              Improving adherence to 100% for 14 days could reduce your fasting glucose by{' '}
              <Text style={styles.bold}>0.3–0.5 mmol/L</Text> — enough to shift your HbA1c estimate from 7.9% to 7.4%.
            </Text>
          </View>
          <View style={styles.suggestionRow}>
            <TouchableOpacity style={styles.purpleSugChip}>
              <AppText variant="caption" color={Colors.purpleText}>Set alarm now ›</AppText>
            </TouchableOpacity>
            <TouchableOpacity style={styles.purpleSugChip}>
              <AppText variant="caption" color={Colors.purpleText}>Log today's dose ›</AppText>
            </TouchableOpacity>
          </View>
        </InsightCard>

        {/* Final coach message */}
        <View style={styles.msgRow}>
          <CoachAvatar />
          <View style={styles.bubbleWrap}>
            <View style={styles.bubbleCoach}>
              <Text style={styles.bubbleCoachText}>
                If you follow all three today — <Text style={styles.bold}>sleep, steps, and medication</Text> — your test readiness score goes from 54 to an estimated{' '}
                <Text style={styles.bold}>72 out of 100</Text>. You have 14 days. That's very achievable, Priya. 💪
              </Text>
            </View>
            <AppText variant="small" color={Colors.textTertiary} style={styles.coachTime}>9:08 AM</AppText>
          </View>
        </View>

        <View style={{height: vs(10)}} />
      </ScrollView>

      {/* Quick Replies */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.quickRepliesWrap} contentContainerStyle={styles.quickReplies}>
        {quickReplies.map((qr, i) => (
          <TouchableOpacity key={i} style={styles.qrChip} activeOpacity={0.7}>
            <Emoji icon={qr.icon} size={11} />
            <AppText variant="caption" color={Colors.textPrimary}>{qr.text}</AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input */}
      <View style={styles.inputRow}>
        <View style={styles.inputWrap}>
          <TouchableOpacity><Emoji icon="📎" size={16} /></TouchableOpacity>
          <TextInput
            style={styles.chatInput}
            placeholder="Ask Ayu anything about your health…"
            placeholderTextColor={Colors.textTertiary}
          />
          <TouchableOpacity><Emoji icon="🎤" size={16} /></TouchableOpacity>
        </View>
        <TouchableOpacity style={styles.sendBtn} activeOpacity={0.8}>
          <Text style={styles.sendIcon}>▶</Text>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );
};

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},

  // Header
  header: {backgroundColor: Colors.primary, paddingHorizontal: s(16), paddingTop: vs(12), paddingBottom: vs(18)},
  headerTop: {flexDirection: 'row', alignItems: 'center', gap: s(10), marginBottom: vs(14)},
  backBtn: {width: ms(36), height: ms(36), borderRadius: ms(18), backgroundColor: 'rgba(255,255,255,0.15)', alignItems: 'center', justifyContent: 'center'},
  coachAvatarWrap: {position: 'relative'},
  coachAvatar: {width: ms(40), height: ms(40), borderRadius: ms(20), backgroundColor: Colors.lightGreen, alignItems: 'center', justifyContent: 'center', borderWidth: 2, borderColor: 'rgba(255,255,255,0.25)'},
  onlineDot: {position: 'absolute', bottom: ms(1), right: ms(1), width: ms(9), height: ms(9), backgroundColor: Colors.paleGreen, borderRadius: ms(5), borderWidth: 1.5, borderColor: Colors.primary},
  coachInfo: {flex: 1},
  coachStatus: {marginTop: vs(1)},
  headerActions: {flexDirection: 'row', gap: s(10)},
  hdrBtn: {width: ms(34), height: ms(34), borderRadius: ms(17), backgroundColor: Colors.heroOverlay, alignItems: 'center', justifyContent: 'center'},

  contextStrip: {gap: s(6), paddingBottom: vs(2)},
  ctxChip: {flexDirection: 'row', alignItems: 'center', gap: s(5), backgroundColor: Colors.heroOverlay, borderWidth: 0.5, borderColor: 'rgba(255,255,255,0.2)', borderRadius: ms(20), paddingVertical: vs(4), paddingHorizontal: s(9)},
  ctxDot: {width: ms(5), height: ms(5), borderRadius: ms(3)},

  // Chat
  chatArea: {flex: 1},
  chatContent: {paddingHorizontal: s(12), paddingVertical: vs(14), gap: vs(12)},
  dateSep: {textAlign: 'center', marginVertical: vs(4)},

  msgRow: {flexDirection: 'row', gap: s(8)},
  msgRowUser: {flexDirection: 'row-reverse'},
  coachMsgAvatar: {width: ms(28), height: ms(28), borderRadius: ms(14), backgroundColor: Colors.tealBg, alignItems: 'center', justifyContent: 'center', marginTop: vs(2)},

  bubbleWrap: {maxWidth: '78%'},
  bubbleCoach: {backgroundColor: Colors.white, borderRadius: ms(16), borderBottomLeftRadius: ms(4), borderWidth: 0.5, borderColor: Colors.borderLight, paddingVertical: vs(10), paddingHorizontal: s(12)},
  bubbleCoachText: {fontSize: Fonts.sizes.body, color: Colors.textPrimary, lineHeight: ms(20), fontFamily: Fonts.regular},
  coachTime: {marginTop: vs(4), paddingLeft: s(36)},

  bubbleUserWrap: {maxWidth: '78%'},
  bubbleUser: {backgroundColor: Colors.primary, borderRadius: ms(16), borderBottomRightRadius: ms(4), paddingVertical: vs(10), paddingHorizontal: s(12)},
  bubbleUserText: {fontSize: Fonts.sizes.body, color: Colors.white, lineHeight: ms(20), fontFamily: Fonts.regular},
  userTime: {marginTop: vs(4), textAlign: 'right'},

  bold: {fontWeight: '500', fontFamily: Fonts.medium},

  // Insight cards
  insightBubble: {backgroundColor: Colors.white, borderWidth: 0.5, borderColor: Colors.borderLight, borderRadius: ms(14), paddingVertical: vs(12), paddingHorizontal: s(13), marginLeft: s(36), maxWidth: '86%'},
  insightHeader: {flexDirection: 'row', alignItems: 'center', gap: s(6), marginBottom: vs(8)},
  insightText: {fontSize: ms(11), color: Colors.textPrimary, lineHeight: ms(17), fontFamily: Fonts.regular},

  metricRow: {flexDirection: 'row', gap: s(6), marginVertical: vs(8)},
  metricBox: {flex: 1, borderRadius: ms(10), paddingVertical: vs(8), alignItems: 'center'},
  mbVal: {fontSize: ms(15), fontWeight: '500'},
  mbLbl: {marginTop: vs(2)},

  actionCard: {backgroundColor: Colors.background, borderRadius: ms(10), paddingVertical: vs(9), paddingHorizontal: s(11), marginTop: vs(8)},
  actionCardTitle: {fontWeight: '500', marginBottom: vs(6)},
  actionItem: {flexDirection: 'row', alignItems: 'center', gap: s(7), paddingVertical: vs(4)},
  actionNum: {width: ms(18), height: ms(18), borderRadius: ms(9), backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center'},
  actionText: {fontSize: ms(11), color: Colors.textPrimary, flex: 1, lineHeight: ms(16), fontFamily: Fonts.regular},

  purpleNote: {backgroundColor: Colors.purpleBg, borderRadius: ms(8), paddingVertical: vs(7), paddingHorizontal: s(9), marginTop: vs(8)},
  purpleNoteText: {fontSize: Fonts.sizes.small, color: Colors.purpleText, lineHeight: ms(16), fontFamily: Fonts.regular},
  suggestionRow: {flexDirection: 'row', gap: s(6), flexWrap: 'wrap', marginTop: vs(8)},
  purpleSugChip: {backgroundColor: Colors.purpleBg, borderWidth: 0.5, borderColor: '#AFA9EC', borderRadius: ms(20), paddingVertical: vs(5), paddingHorizontal: s(10)},

  // Quick replies
  quickRepliesWrap: {flexGrow: 0},
  quickReplies: {paddingVertical: vs(8), paddingHorizontal: s(12), gap: s(6)},
  qrChip: {flexDirection: 'row', alignItems: 'center', gap: s(5), backgroundColor: Colors.white, borderWidth: 0.5, borderColor: Colors.borderLight, borderRadius: ms(20), paddingVertical: vs(6), paddingHorizontal: s(11)},

  // Input
  inputRow: {paddingVertical: vs(10), paddingHorizontal: s(12), backgroundColor: Colors.white, borderTopWidth: 0.5, borderTopColor: Colors.borderLight, flexDirection: 'row', alignItems: 'center', gap: s(8)},
  inputWrap: {flex: 1, backgroundColor: Colors.background, borderRadius: ms(22), borderWidth: 0.5, borderColor: Colors.borderLight, flexDirection: 'row', alignItems: 'center', paddingHorizontal: s(12), gap: s(6)},
  chatInput: {flex: 1, fontSize: Fonts.sizes.body, color: Colors.textPrimary, paddingVertical: vs(10), fontFamily: Fonts.regular},
  sendBtn: {width: ms(38), height: ms(38), borderRadius: ms(19), backgroundColor: Colors.primary, alignItems: 'center', justifyContent: 'center'},
  sendIcon: {fontSize: ms(15), color: Colors.white},
});

export default AyuChatScreen;
