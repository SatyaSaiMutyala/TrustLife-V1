import React, {useState, useRef, useCallback} from 'react';
import {
  View,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  TextInput,
  Modal,
  KeyboardAvoidingView,
  Platform,
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
  FAQ_CATEGORIES,
  CHAT_MESSAGES,
  QUICK_REPLIES,
  AUTO_REPLIES,
  ISSUE_TYPES,
  SEVERITY_LEVELS,
  TICKETS,
} from '../../constants/supportData';

const TABS = [
  {key: 'faqs', label: 'FAQs'},
  {key: 'chat', label: 'Chat'},
  {key: 'report', label: 'Report'},
  {key: 'tickets', label: 'Tickets'},
];

/* ─── Component ─────────────────────────────────────── */

const HelpSupportScreen = () => {
  const insets = useSafeAreaInsets();
  const navigation = useNavigation();
  const chatScrollRef = useRef(null);
  const autoReplyIdx = useRef(0);

  /* ── State ──────────────────────────────────────────── */
  const [activeTab, setActiveTab] = useState('faqs');
  const [showSearch, setShowSearch] = useState(false);
  const [searchText, setSearchText] = useState('');

  // FAQ
  const [expandedCategory, setExpandedCategory] = useState(null);
  const [expandedFaq, setExpandedFaq] = useState(null);
  const [helpfulVotes, setHelpfulVotes] = useState({});

  // Chat
  const [messages, setMessages] = useState(CHAT_MESSAGES);
  const [chatInput, setChatInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);

  // Report
  const [selectedIssueType, setSelectedIssueType] = useState(null);
  const [selectedSeverity, setSelectedSeverity] = useState(null);
  const [issueDescription, setIssueDescription] = useState('');
  const [stepsToReproduce, setStepsToReproduce] = useState('');
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [submittedTicket, setSubmittedTicket] = useState(null);

  // Ticket detail modal
  const [showTicketModal, setShowTicketModal] = useState(false);
  const [selectedTicket, setSelectedTicket] = useState(null);
  const [ticketReply, setTicketReply] = useState('');

  /* ── Helpers ─────────────────────────────────────────── */
  const now = () => {
    const d = new Date();
    let h = d.getHours();
    const m = String(d.getMinutes()).padStart(2, '0');
    const ampm = h >= 12 ? 'PM' : 'AM';
    h = h % 12 || 12;
    return `${h}:${m} ${ampm}`;
  };

  const filteredFaqs = searchText.trim()
    ? FAQ_CATEGORIES.map(cat => ({
        ...cat,
        items: cat.items.filter(
          item =>
            item.q.toLowerCase().includes(searchText.toLowerCase()) ||
            item.a.toLowerCase().includes(searchText.toLowerCase()),
        ),
      })).filter(cat => cat.items.length > 0)
    : [];

  const canSubmitReport =
    selectedIssueType && issueDescription.trim().length >= 10;

  const sendMessage = useCallback(
    text => {
      if (!text.trim()) return;
      const userMsg = {
        id: Date.now(),
        sender: 'user',
        text: text.trim(),
        time: now(),
      };
      setMessages(prev => [...prev, userMsg]);
      setChatInput('');
      setIsTyping(true);

      setTimeout(() => {
        chatScrollRef.current?.scrollToEnd?.({animated: true});
      }, 100);

      setTimeout(() => {
        setIsTyping(false);
        const reply = AUTO_REPLIES[autoReplyIdx.current % AUTO_REPLIES.length];
        autoReplyIdx.current += 1;
        const agentMsg = {
          id: Date.now() + 1,
          sender: 'agent',
          name: 'Divya',
          text: reply,
          time: now(),
        };
        setMessages(prev => [...prev, agentMsg]);
        setTimeout(() => {
          chatScrollRef.current?.scrollToEnd?.({animated: true});
        }, 100);
      }, 2000);
    },
    [],
  );

  const submitReport = () => {
    const issueObj = ISSUE_TYPES.find(i => i.key === selectedIssueType);
    const severityObj = SEVERITY_LEVELS.find(s => s.key === (selectedSeverity || 'medium'));
    const ref = `TL-2026-${Math.floor(1900 + Math.random() * 100)}`;
    setSubmittedTicket({
      ref,
      type: issueObj?.label || 'Other',
      severity: severityObj?.label || 'Medium',
      status: 'Open',
      expectedResponse: '<4 hours',
    });
    setShowSuccessModal(true);
  };

  const resetReport = () => {
    setSelectedIssueType(null);
    setSelectedSeverity(null);
    setIssueDescription('');
    setStepsToReproduce('');
  };

  /* ── Header ──────────────────────────────────────────── */
  const renderHeader = () => (
    <View style={[styles.header, {paddingTop: insets.top}]}>
      <View style={styles.topBar}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => navigation.goBack()}>
          <AppText variant="body" style={styles.backText}>
            {'\u2039'} Profile
          </AppText>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.searchToggle}
          onPress={() => {
            setShowSearch(prev => !prev);
            if (showSearch) setSearchText('');
          }}>
          <AppText style={{color: Colors.white, fontSize: ms(18)}}>
            {showSearch ? '\u2715' : '\uD83D\uDD0D'}
          </AppText>
        </TouchableOpacity>
      </View>
      <AppText variant="screenName" style={styles.headerTitle}>
        Help & Support
      </AppText>
      <AppText variant="caption" style={styles.headerSubtitle}>
        FAQs {'\u00B7'} Chat {'\u00B7'} Report an issue
      </AppText>
    </View>
  );

  /* ── Search Bar ─────────────────────────────────────── */
  const renderSearchBar = () => {
    if (!showSearch) return null;
    return (
      <View style={styles.searchBarWrap}>
        <View style={styles.searchBar}>
          <AppText style={{fontSize: ms(14), marginRight: s(8)}}>
            {'\uD83D\uDD0D'}
          </AppText>
          <TextInput
            style={styles.searchInput}
            placeholder="Search FAQs..."
            placeholderTextColor={Colors.textTertiary}
            value={searchText}
            onChangeText={setSearchText}
            autoFocus
          />
          {searchText.length > 0 && (
            <TouchableOpacity onPress={() => setSearchText('')}>
              <AppText
                variant="body"
                style={{color: Colors.textTertiary, fontSize: ms(16)}}>
                {'\u2715'}
              </AppText>
            </TouchableOpacity>
          )}
        </View>
      </View>
    );
  };

  /* ── Tab Bar ─────────────────────────────────────────── */
  const renderTabBar = () => (
    <View style={styles.tabBar}>
      {TABS.map(tab => {
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
     TAB 1 – FAQs
     ═══════════════════════════════════════════════════════ */
  const renderFaqsTab = () => {
    const isSearching = searchText.trim().length > 0;

    const renderFaqItem = (item, catIdx, itemIdx) => {
      const faqKey = `${catIdx}-${itemIdx}`;
      const isOpen = expandedFaq === faqKey;
      const vote = helpfulVotes[faqKey];

      return (
        <View key={faqKey} style={styles.faqItem}>
          <TouchableOpacity
            style={styles.faqQuestion}
            activeOpacity={0.7}
            onPress={() => setExpandedFaq(isOpen ? null : faqKey)}>
            <AppText
              variant="bodyBold"
              style={{flex: 1, fontSize: ms(13)}}
              numberOfLines={isOpen ? undefined : 2}>
              {item.q}
            </AppText>
            <AppText
              style={{
                fontSize: ms(14),
                color: Colors.textTertiary,
                marginLeft: s(8),
              }}>
              {isOpen ? '\u2303' : '\u2304'}
            </AppText>
          </TouchableOpacity>
          {isOpen && (
            <View style={styles.faqAnswer}>
              <AppText
                variant="body"
                color={Colors.textSecondary}
                style={{fontSize: ms(13), lineHeight: ms(20)}}>
                {item.a}
              </AppText>
              <View style={styles.helpfulRow}>
                <AppText
                  variant="caption"
                  color={Colors.textTertiary}
                  style={{marginRight: s(10)}}>
                  Was this helpful?
                </AppText>
                <TouchableOpacity
                  style={[
                    styles.helpfulBtn,
                    vote === 'yes' && {backgroundColor: Colors.tealBg},
                  ]}
                  onPress={() =>
                    setHelpfulVotes(prev => ({...prev, [faqKey]: 'yes'}))
                  }>
                  <AppText
                    variant="small"
                    style={{
                      color: vote === 'yes' ? Colors.accent : Colors.textTertiary,
                      fontWeight: '600',
                    }}>
                    {'\uD83D\uDC4D'} Yes
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.helpfulBtn,
                    vote === 'no' && {backgroundColor: Colors.redBg},
                  ]}
                  onPress={() =>
                    setHelpfulVotes(prev => ({...prev, [faqKey]: 'no'}))
                  }>
                  <AppText
                    variant="small"
                    style={{
                      color: vote === 'no' ? Colors.red : Colors.textTertiary,
                      fontWeight: '600',
                    }}>
                    {'\uD83D\uDC4E'} No
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>
      );
    };

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Search Results */}
        {isSearching ? (
          <>
            <AppText
              variant="small"
              color={Colors.textTertiary}
              style={styles.sectionLabel}>
              SEARCH RESULTS
            </AppText>
            {filteredFaqs.length === 0 ? (
              <View style={[styles.card, {alignItems: 'center', paddingVertical: vs(30)}]}>
                <AppText style={{fontSize: ms(32), marginBottom: vs(8)}}>
                  {'\uD83D\uDD0D'}
                </AppText>
                <AppText variant="bodyBold" style={{marginBottom: vs(4)}}>
                  No results found
                </AppText>
                <AppText variant="caption" color={Colors.textSecondary}>
                  Try different keywords or start a chat
                </AppText>
              </View>
            ) : (
              filteredFaqs.map((cat, catIdx) => (
                <View key={cat.key}>
                  <AppText
                    variant="small"
                    color={Colors.textTertiary}
                    style={{marginBottom: vs(6), fontWeight: '600'}}>
                    {cat.ico} {cat.name}
                  </AppText>
                  <View style={styles.card}>
                    {cat.items.map((item, itemIdx) =>
                      renderFaqItem(item, catIdx, itemIdx),
                    )}
                  </View>
                </View>
              ))
            )}
          </>
        ) : (
          <>
            {/* Hero Card */}
            <View style={[styles.card, {alignItems: 'center', paddingVertical: vs(20)}]}>
              <AppText
                variant="header"
                style={{fontSize: ms(18), marginBottom: vs(4)}}>
                How can we help?
              </AppText>
              <AppText
                variant="caption"
                color={Colors.textSecondary}
                style={{marginBottom: vs(14), textAlign: 'center'}}>
                Our team typically responds in under 4 hours
              </AppText>
              <View style={{flexDirection: 'row', gap: s(10)}}>
                <TouchableOpacity
                  style={[styles.heroBtn, {backgroundColor: Colors.accent}]}
                  activeOpacity={0.8}
                  onPress={() => setActiveTab('chat')}>
                  <AppText
                    variant="small"
                    style={{color: Colors.white, fontWeight: '700'}}>
                    Start chat
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.heroBtn,
                    {
                      backgroundColor: Colors.white,
                      borderWidth: 1,
                      borderColor: Colors.borderLight,
                    },
                  ]}
                  activeOpacity={0.7}
                  onPress={() => setActiveTab('report')}>
                  <AppText
                    variant="small"
                    style={{color: Colors.textPrimary, fontWeight: '600'}}>
                    Report issue
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>

            {/* Quick Contact Grid */}
            <View style={styles.contactGrid}>
              <View style={[styles.card, styles.contactCard]}>
                <AppText style={{fontSize: ms(20), marginBottom: vs(4)}}>
                  {'\uD83D\uDCAC'}
                </AppText>
                <AppText variant="bodyBold" style={{fontSize: ms(12)}}>
                  Live chat
                </AppText>
                <View
                  style={[
                    styles.contactBadge,
                    {backgroundColor: Colors.tealBg},
                  ]}>
                  <AppText
                    variant="small"
                    style={{
                      color: Colors.accent,
                      fontWeight: '700',
                      fontSize: ms(9),
                    }}>
                    Online
                  </AppText>
                </View>
              </View>
              <View style={[styles.card, styles.contactCard]}>
                <AppText style={{fontSize: ms(20), marginBottom: vs(4)}}>
                  {'\u2709\uFE0F'}
                </AppText>
                <AppText
                  variant="bodyBold"
                  style={{fontSize: ms(12)}}
                  numberOfLines={1}>
                  Email us
                </AppText>
                <AppText
                  variant="small"
                  color={Colors.textTertiary}
                  numberOfLines={1}
                  style={{fontSize: ms(9), marginTop: vs(1)}}>
                  support@trustlife.in
                </AppText>
                <View
                  style={[
                    styles.contactBadge,
                    {backgroundColor: Colors.blueBg},
                  ]}>
                  <AppText
                    variant="small"
                    style={{
                      color: Colors.blue,
                      fontWeight: '700',
                      fontSize: ms(9),
                    }}>
                    {'<'}4 hrs
                  </AppText>
                </View>
              </View>
              <View style={[styles.card, styles.contactCard]}>
                <AppText style={{fontSize: ms(20), marginBottom: vs(4)}}>
                  {'\uD83D\uDCF1'}
                </AppText>
                <AppText
                  variant="bodyBold"
                  style={{fontSize: ms(12)}}
                  numberOfLines={1}>
                  WhatsApp
                </AppText>
                <AppText
                  variant="small"
                  color={Colors.textTertiary}
                  numberOfLines={1}
                  style={{fontSize: ms(9), marginTop: vs(1)}}>
                  +91 9000 000 000
                </AppText>
                <View
                  style={[
                    styles.contactBadge,
                    {backgroundColor: Colors.amberBg},
                  ]}>
                  <AppText
                    variant="small"
                    style={{
                      color: Colors.amber,
                      fontWeight: '700',
                      fontSize: ms(9),
                    }}>
                    9AM-9PM
                  </AppText>
                </View>
              </View>
            </View>

            {/* Browse Topics */}
            <AppText
              variant="small"
              color={Colors.textTertiary}
              style={styles.sectionLabel}>
              BROWSE TOPICS
            </AppText>

            {FAQ_CATEGORIES.map((cat, catIdx) => {
              const isOpen = expandedCategory === cat.key;
              return (
                <View key={cat.key} style={styles.card}>
                  <TouchableOpacity
                    style={styles.categoryHeader}
                    activeOpacity={0.7}
                    onPress={() =>
                      setExpandedCategory(isOpen ? null : cat.key)
                    }>
                    <AppText style={{fontSize: ms(20), marginRight: s(10)}}>
                      {cat.ico}
                    </AppText>
                    <View style={{flex: 1}}>
                      <AppText variant="bodyBold" style={{fontSize: ms(13)}}>
                        {cat.name}
                      </AppText>
                      <AppText variant="small" color={Colors.textTertiary}>
                        {cat.items.length} article{cat.items.length !== 1 ? 's' : ''}
                      </AppText>
                    </View>
                    <AppText
                      style={{
                        fontSize: ms(16),
                        color: Colors.textTertiary,
                      }}>
                      {isOpen ? '\u2303' : '\u2304'}
                    </AppText>
                  </TouchableOpacity>
                  {isOpen &&
                    cat.items.map((item, itemIdx) =>
                      renderFaqItem(item, catIdx, itemIdx),
                    )}
                </View>
              );
            })}

            {/* Still need help card */}
            <View
              style={[
                styles.card,
                {
                  alignItems: 'center',
                  paddingVertical: vs(20),
                  marginTop: vs(6),
                },
              ]}>
              <AppText variant="bodyBold" style={{marginBottom: vs(4)}}>
                Still need help?
              </AppText>
              <AppText
                variant="caption"
                color={Colors.textSecondary}
                style={{marginBottom: vs(14), textAlign: 'center'}}>
                Our support team is here for you
              </AppText>
              <View style={{flexDirection: 'row', gap: s(10)}}>
                <TouchableOpacity
                  style={[styles.heroBtn, {backgroundColor: Colors.accent}]}
                  activeOpacity={0.8}
                  onPress={() => setActiveTab('chat')}>
                  <AppText
                    variant="small"
                    style={{color: Colors.white, fontWeight: '700'}}>
                    Start live chat
                  </AppText>
                </TouchableOpacity>
                <TouchableOpacity
                  style={[
                    styles.heroBtn,
                    {
                      backgroundColor: Colors.white,
                      borderWidth: 1,
                      borderColor: Colors.borderLight,
                    },
                  ]}
                  activeOpacity={0.7}>
                  <AppText
                    variant="small"
                    style={{color: Colors.textPrimary, fontWeight: '600'}}>
                    {'\uD83D\uDCF1'} WhatsApp
                  </AppText>
                </TouchableOpacity>
              </View>
            </View>
          </>
        )}
      </ScrollView>
    );
  };

  /* ═══════════════════════════════════════════════════════
     TAB 2 – Chat
     ═══════════════════════════════════════════════════════ */
  const renderChatTab = () => (
    <KeyboardAvoidingView
      style={{flex: 1}}
      behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      keyboardVerticalOffset={vs(120)}>
      {/* Chat Header Bar */}
      <View style={styles.chatHeader}>
        <View style={styles.agentAvatar}>
          <AppText style={{fontSize: ms(16)}}>{'🧑‍💼'}</AppText>
        </View>
        <View style={{flex: 1, marginLeft: s(10)}}>
          <AppText variant="bodyBold" style={{fontSize: ms(13)}}>
            TrustLife Support
          </AppText>
          <View style={{flexDirection: 'row', alignItems: 'center'}}>
            <View style={styles.onlineDot} />
            <AppText variant="small" color={Colors.accent}>
              Online
            </AppText>
          </View>
        </View>
      </View>

      {/* Messages */}
      <ScrollView
        ref={chatScrollRef}
        style={styles.chatMessages}
        contentContainerStyle={{padding: s(14), paddingBottom: vs(10)}}
        showsVerticalScrollIndicator={false}
        onContentSizeChange={() =>
          chatScrollRef.current?.scrollToEnd?.({animated: false})
        }>
        {messages.map(msg => {
          if (msg.sender === 'system') {
            return (
              <View key={msg.id} style={styles.systemMsg}>
                <AppText
                  variant="small"
                  color={Colors.textTertiary}
                  style={{fontSize: ms(10)}}>
                  {msg.text}
                </AppText>
              </View>
            );
          }
          if (msg.sender === 'agent') {
            return (
              <View key={msg.id} style={styles.agentRow}>
                <View style={styles.agentBubbleAvatar}>
                  <AppText style={{fontSize: ms(10)}}>{'🧑‍💼'}</AppText>
                </View>
                <View style={{flex: 1, marginLeft: s(8)}}>
                  <AppText
                    variant="small"
                    color={Colors.textTertiary}
                    style={{marginBottom: vs(2), fontSize: ms(10)}}>
                    {msg.name}
                  </AppText>
                  <View style={styles.agentBubble}>
                    <AppText variant="body" style={{fontSize: ms(13)}}>
                      {msg.text}
                    </AppText>
                  </View>
                  <AppText
                    variant="small"
                    color={Colors.textTertiary}
                    style={{marginTop: vs(2), fontSize: ms(9)}}>
                    {msg.time}
                  </AppText>
                </View>
              </View>
            );
          }
          // user message
          return (
            <View key={msg.id} style={styles.userRow}>
              <View style={{alignItems: 'flex-end'}}>
                <View style={styles.userBubble}>
                  <AppText
                    variant="body"
                    style={{color: Colors.white, fontSize: ms(13)}}>
                    {msg.text}
                  </AppText>
                </View>
                <AppText
                  variant="small"
                  color={Colors.textTertiary}
                  style={{marginTop: vs(2), fontSize: ms(9)}}>
                  {msg.time}
                </AppText>
              </View>
            </View>
          );
        })}

        {/* Typing Indicator */}
        {isTyping && (
          <View style={styles.agentRow}>
            <View style={styles.agentBubbleAvatar}>
              <AppText style={{fontSize: ms(10)}}>{'🧑‍💼'}</AppText>
            </View>
            <View style={{marginLeft: s(8)}}>
              <AppText
                variant="small"
                color={Colors.textTertiary}
                style={{marginBottom: vs(2), fontSize: ms(10)}}>
                Divya
              </AppText>
              <View style={styles.agentBubble}>
                <AppText variant="body" style={{fontSize: ms(18), letterSpacing: 2}}>
                  {'\u2022\u2022\u2022'}
                </AppText>
              </View>
            </View>
          </View>
        )}
      </ScrollView>

      {/* Quick Replies */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.quickReplies}
        contentContainerStyle={{paddingHorizontal: s(14), gap: s(8)}}>
        {QUICK_REPLIES.map((reply, i) => (
          <TouchableOpacity
            key={i}
            style={styles.quickReplyChip}
            activeOpacity={0.7}
            onPress={() => sendMessage(reply)}>
            <AppText variant="small" style={{color: Colors.accent, fontWeight: '600', fontSize: ms(11)}}>
              {reply}
            </AppText>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Input Bar */}
      <View style={[styles.chatInputBar, {paddingBottom: Math.max(insets.bottom, vs(10))}]}>
        <TouchableOpacity style={styles.attachBtn}>
          <AppText style={{fontSize: ms(18)}}>{'📎'}</AppText>
        </TouchableOpacity>
        <TextInput
          style={styles.chatInput}
          placeholder="Type a message..."
          placeholderTextColor={Colors.textTertiary}
          value={chatInput}
          onChangeText={setChatInput}
          multiline
          maxLength={500}
        />
        <TouchableOpacity
          style={[
            styles.sendBtn,
            {
              backgroundColor: chatInput.trim()
                ? Colors.accent
                : Colors.borderLight,
            },
          ]}
          activeOpacity={0.8}
          onPress={() => sendMessage(chatInput)}
          disabled={!chatInput.trim()}>
          <AppText
            style={{
              color: chatInput.trim() ? Colors.white : Colors.textTertiary,
              fontSize: ms(16),
              fontWeight: '700',
            }}>
            {'\u2191'}
          </AppText>
        </TouchableOpacity>
      </View>
    </KeyboardAvoidingView>
  );

  /* ═══════════════════════════════════════════════════════
     TAB 3 – Report Issue
     ═══════════════════════════════════════════════════════ */
  const renderReportTab = () => (
    <ScrollView
      style={styles.scrollView}
      contentContainerStyle={styles.scrollContent}
      showsVerticalScrollIndicator={false}>
      {/* Issue Type */}
      <AppText
        variant="small"
        color={Colors.textTertiary}
        style={styles.sectionLabel}>
        ISSUE TYPE
      </AppText>
      <View style={styles.issueGrid}>
        {ISSUE_TYPES.map(type => {
          const isSelected = selectedIssueType === type.key;
          return (
            <TouchableOpacity
              key={type.key}
              style={[
                styles.card,
                styles.issueCard,
                isSelected && {
                  borderWidth: 1.5,
                  borderColor: Colors.accent,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => setSelectedIssueType(type.key)}>
              <AppText style={{fontSize: ms(22), marginBottom: vs(4), lineHeight: ms(28)}}>
                {type.ico}
              </AppText>
              <AppText
                variant="bodyBold"
                style={{fontSize: ms(12)}}
                numberOfLines={1}>
                {type.label}
              </AppText>
              <AppText
                variant="small"
                color={Colors.textTertiary}
                numberOfLines={1}
                style={{fontSize: ms(10)}}>
                {type.sub}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Severity */}
      <AppText
        variant="small"
        color={Colors.textTertiary}
        style={styles.sectionLabel}>
        SEVERITY
      </AppText>
      <View style={styles.severityRow}>
        {SEVERITY_LEVELS.map(sev => {
          const isSelected = selectedSeverity === sev.key;
          return (
            <TouchableOpacity
              key={sev.key}
              style={[
                styles.severityBtn,
                isSelected && {
                  backgroundColor: Colors.accent + '15',
                  borderColor: Colors.accent,
                },
              ]}
              activeOpacity={0.7}
              onPress={() => setSelectedSeverity(sev.key)}>
              <AppText style={{fontSize: ms(12), marginRight: s(4)}}>
                {sev.ico}
              </AppText>
              <AppText
                variant="small"
                style={{
                  fontWeight: isSelected ? '700' : '500',
                  color: isSelected ? Colors.accent : Colors.textSecondary,
                  fontSize: ms(11),
                }}>
                {sev.label}
              </AppText>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Description */}
      <AppText
        variant="small"
        color={Colors.textTertiary}
        style={styles.sectionLabel}>
        DESCRIBE THE ISSUE
      </AppText>
      <View style={styles.card}>
        <TextInput
          style={styles.multilineInput}
          placeholder="What happened? Please be as specific as possible..."
          placeholderTextColor={Colors.textTertiary}
          value={issueDescription}
          onChangeText={t => setIssueDescription(t.slice(0, 1000))}
          multiline
          maxLength={1000}
          textAlignVertical="top"
        />
        <AppText
          variant="small"
          color={Colors.textTertiary}
          style={{textAlign: 'right', marginTop: vs(4)}}>
          {issueDescription.length}/1000
        </AppText>
      </View>

      {/* Steps to Reproduce */}
      <AppText
        variant="small"
        color={Colors.textTertiary}
        style={styles.sectionLabel}>
        STEPS TO REPRODUCE
      </AppText>
      <View style={styles.card}>
        <TextInput
          style={[styles.multilineInput, {height: vs(70)}]}
          placeholder="1. Go to...&#10;2. Tap on...&#10;3. See error..."
          placeholderTextColor={Colors.textTertiary}
          value={stepsToReproduce}
          onChangeText={setStepsToReproduce}
          multiline
          textAlignVertical="top"
        />
      </View>

      {/* Attachments */}
      <AppText
        variant="small"
        color={Colors.textTertiary}
        style={styles.sectionLabel}>
        ATTACHMENTS
      </AppText>
      <View style={{flexDirection: 'row', gap: s(8), marginBottom: vs(10)}}>
        {[
          {label: 'Screenshot', ico: '📷'},
          {label: 'Screen recording', ico: '🎥'},
          {label: 'App logs', ico: '📋'},
        ].map((att, i) => (
          <TouchableOpacity
            key={i}
            style={[styles.card, {flex: 1, alignItems: 'center', paddingVertical: vs(10)}]}
            activeOpacity={0.7}>
            <AppText style={{fontSize: ms(22), marginBottom: vs(4), lineHeight: ms(28)}}>
              {att.ico}
            </AppText>
            <AppText
              variant="small"
              color={Colors.textSecondary}
              style={{fontSize: ms(10)}}
              numberOfLines={1}>
              {att.label}
            </AppText>
          </TouchableOpacity>
        ))}
      </View>

      {/* Device Info */}
      <AppText
        variant="small"
        color={Colors.textTertiary}
        style={styles.sectionLabel}>
        DEVICE INFO
      </AppText>
      <View style={styles.card}>
        {[
          {label: 'Device', value: 'iPhone 14 Pro'},
          {label: 'OS', value: 'iOS 17.4'},
          {label: 'App version', value: '2.4.2'},
          {label: 'Account', value: 'Pro plan'},
        ].map((info, i) => (
          <View
            key={i}
            style={[
              styles.billingRow,
              i === 3 && {borderBottomWidth: 0},
            ]}>
            <AppText variant="caption" color={Colors.textSecondary}>
              {info.label}
            </AppText>
            <AppText variant="body" style={{fontSize: ms(13)}}>
              {info.value}
            </AppText>
          </View>
        ))}
      </View>

      {/* Submit Button */}
      <TouchableOpacity
        style={[
          styles.submitBtn,
          {
            backgroundColor: canSubmitReport
              ? Colors.primary
              : Colors.borderLight,
          },
        ]}
        activeOpacity={canSubmitReport ? 0.8 : 1}
        onPress={() => canSubmitReport && submitReport()}
        disabled={!canSubmitReport}>
        <AppText
          variant="bodyBold"
          style={{
            color: canSubmitReport ? Colors.white : Colors.textTertiary,
          }}>
          Submit report
        </AppText>
      </TouchableOpacity>
    </ScrollView>
  );

  /* ═══════════════════════════════════════════════════════
     TAB 4 – Tickets
     ═══════════════════════════════════════════════════════ */
  const renderTicketsTab = () => {
    const openTickets = TICKETS.filter(t => t.status === 'open');
    const resolvedTickets = TICKETS.filter(t => t.status === 'resolved');

    const renderTicketCard = ticket => (
      <TouchableOpacity
        key={ticket.ref}
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => {
          setSelectedTicket(ticket);
          setTicketReply('');
          setShowTicketModal(true);
        }}>
        <View style={{flexDirection: 'row', alignItems: 'flex-start'}}>
          <View
            style={[
              styles.ticketIcon,
              {backgroundColor: ticket.icoBg},
            ]}>
            <AppText style={{fontSize: ms(16)}}>{ticket.ico}</AppText>
          </View>
          <View style={{flex: 1, marginLeft: s(10)}}>
            <AppText
              variant="small"
              color={Colors.textTertiary}
              style={{fontSize: ms(10), marginBottom: vs(2)}}>
              {ticket.ref}
            </AppText>
            <AppText
              variant="bodyBold"
              style={{fontSize: ms(13), marginBottom: vs(4)}}
              numberOfLines={2}>
              {ticket.title}
            </AppText>
            <View style={{flexDirection: 'row', flexWrap: 'wrap', gap: s(6), marginBottom: vs(6)}}>
              <View style={styles.ticketTag}>
                <AppText
                  variant="small"
                  color={Colors.textSecondary}
                  style={{fontSize: ms(10)}}>
                  {ticket.type}
                </AppText>
              </View>
              <View style={styles.ticketTag}>
                <AppText
                  variant="small"
                  color={Colors.textSecondary}
                  style={{fontSize: ms(10)}}>
                  {ticket.severity}
                </AppText>
              </View>
              <View
                style={[
                  styles.statusChip,
                  {
                    backgroundColor: ticket.statusBg,
                    borderWidth: 1,
                    borderColor: ticket.statusBorder,
                  },
                ]}>
                <AppText
                  variant="small"
                  style={{
                    color: ticket.statusColor,
                    fontWeight: '700',
                    fontSize: ms(9),
                  }}>
                  {ticket.statusLabel}
                </AppText>
              </View>
            </View>
            <AppText
              variant="small"
              color={Colors.textTertiary}
              style={{fontSize: ms(10)}}>
              Created {ticket.created}
              {ticket.lastReply ? ` \u00B7 Last reply ${ticket.lastReply}` : ''}
            </AppText>
            {ticket.lastReplyBy && (
              <AppText
                variant="small"
                color={Colors.textTertiary}
                style={{fontSize: ms(10), marginTop: vs(1)}}>
                by {ticket.lastReplyBy}
              </AppText>
            )}
          </View>
        </View>
      </TouchableOpacity>
    );

    return (
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}>
        {/* Open Tickets */}
        <AppText
          variant="small"
          color={Colors.textTertiary}
          style={styles.sectionLabel}>
          OPEN TICKETS ({openTickets.length})
        </AppText>
        {openTickets.length > 0 ? (
          openTickets.map(renderTicketCard)
        ) : (
          <View style={[styles.card, {alignItems: 'center', paddingVertical: vs(20)}]}>
            <AppText style={{fontSize: ms(28), marginBottom: vs(6)}}>
              {'\u2705'}
            </AppText>
            <AppText variant="bodyBold" style={{marginBottom: vs(2)}}>
              No open tickets
            </AppText>
            <AppText variant="caption" color={Colors.textSecondary}>
              All caught up!
            </AppText>
          </View>
        )}

        {/* Resolved Tickets */}
        <AppText
          variant="small"
          color={Colors.textTertiary}
          style={[styles.sectionLabel, {marginTop: vs(6)}]}>
          RESOLVED TICKETS ({resolvedTickets.length})
        </AppText>
        {resolvedTickets.map(renderTicketCard)}
      </ScrollView>
    );
  };

  /* ═══════════════════════════════════════════════════════
     MODAL 1 – Report Success
     ═══════════════════════════════════════════════════════ */
  const renderSuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent
      animationType="fade"
      onRequestClose={() => setShowSuccessModal(false)}>
      <View style={styles.sheetOverlay}>
        <View style={styles.sheetBackdrop} />
        <View style={styles.sheetContainer}>
          <View style={styles.dragHandle} />
          <ScrollView showsVerticalScrollIndicator={false}>
            {/* Success Icon */}
            <View style={{alignItems: 'center', marginBottom: vs(16)}}>
              <View style={styles.successCircle}>
                <AppText style={{color: Colors.white, fontSize: ms(28)}}>
                  {'\u2713'}
                </AppText>
              </View>
              <AppText
                variant="bodyBold"
                style={{fontSize: ms(18), marginTop: vs(12)}}>
                Report submitted!
              </AppText>
              <AppText
                variant="caption"
                color={Colors.textSecondary}
                style={{marginTop: vs(4), textAlign: 'center'}}>
                We'll get back to you within 4 hours
              </AppText>
            </View>

            {/* Ticket Details */}
            {submittedTicket && (
              <View style={styles.card}>
                {[
                  {label: 'Reference', value: submittedTicket.ref},
                  {label: 'Issue type', value: submittedTicket.type},
                  {label: 'Severity', value: submittedTicket.severity},
                  {label: 'Status', value: submittedTicket.status},
                  {
                    label: 'Expected response',
                    value: submittedTicket.expectedResponse,
                  },
                ].map((row, i) => (
                  <View key={i} style={styles.billingRow}>
                    <AppText variant="caption" color={Colors.textSecondary}>
                      {row.label}
                    </AppText>
                    <AppText variant="bodyBold" style={{fontSize: ms(13)}}>
                      {row.value}
                    </AppText>
                  </View>
                ))}
              </View>
            )}

            {/* Buttons */}
            <View style={{flexDirection: 'row', gap: s(10), marginTop: vs(6)}}>
              <TouchableOpacity
                style={[styles.actionBtn, {backgroundColor: Colors.background}]}
                activeOpacity={0.7}
                onPress={() => {
                  setShowSuccessModal(false);
                  setActiveTab('chat');
                }}>
                <AppText variant="bodyBold" color={Colors.textSecondary}>
                  Chat with support
                </AppText>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.actionBtn, {backgroundColor: Colors.primary}]}
                activeOpacity={0.8}
                onPress={() => {
                  setShowSuccessModal(false);
                  resetReport();
                  setActiveTab('tickets');
                }}>
                <AppText variant="bodyBold" style={{color: Colors.white}}>
                  Done
                </AppText>
              </TouchableOpacity>
            </View>
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  /* ═══════════════════════════════════════════════════════
     MODAL 2 – Ticket Detail
     ═══════════════════════════════════════════════════════ */
  const renderTicketModal = () => {
    if (!selectedTicket) return null;

    return (
      <Modal
        visible={showTicketModal}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTicketModal(false)}>
        <View style={styles.sheetOverlay}>
          <View style={styles.sheetBackdrop} />
          <View style={[styles.sheetContainer, {maxHeight: '90%'}]}>
            <View style={styles.dragHandle} />
            <ScrollView showsVerticalScrollIndicator={false}>
              {/* Ticket Header */}
              <AppText
                variant="small"
                color={Colors.textTertiary}
                style={{marginBottom: vs(4)}}>
                {selectedTicket.ref}
              </AppText>
              <AppText
                variant="bodyBold"
                style={{fontSize: ms(16), marginBottom: vs(8)}}>
                {selectedTicket.title}
              </AppText>

              {/* Badges */}
              <View
                style={{
                  flexDirection: 'row',
                  flexWrap: 'wrap',
                  gap: s(6),
                  marginBottom: vs(14),
                }}>
                <View
                  style={[
                    styles.statusChip,
                    {
                      backgroundColor: selectedTicket.statusBg,
                      borderWidth: 1,
                      borderColor: selectedTicket.statusBorder,
                    },
                  ]}>
                  <AppText
                    variant="small"
                    style={{
                      color: selectedTicket.statusColor,
                      fontWeight: '700',
                      fontSize: ms(10),
                    }}>
                    {selectedTicket.statusLabel}
                  </AppText>
                </View>
                <View style={styles.ticketTag}>
                  <AppText
                    variant="small"
                    color={Colors.textSecondary}
                    style={{fontSize: ms(10)}}>
                    {selectedTicket.type}
                  </AppText>
                </View>
                <View style={styles.ticketTag}>
                  <AppText
                    variant="small"
                    color={Colors.textSecondary}
                    style={{fontSize: ms(10)}}>
                    {selectedTicket.severity}
                  </AppText>
                </View>
              </View>

              {/* Conversation */}
              <AppText
                variant="small"
                color={Colors.textTertiary}
                style={[styles.sectionLabel, {marginTop: 0}]}>
                CONVERSATION
              </AppText>

              {selectedTicket.updates.map((update, i) => (
                <View
                  key={i}
                  style={{
                    flexDirection: 'row',
                    marginBottom: vs(12),
                  }}>
                  {/* Timeline dot + line */}
                  <View style={{alignItems: 'center', marginRight: s(10)}}>
                    <View
                      style={[
                        styles.timelineDot,
                        {
                          backgroundColor: update.isUser
                            ? Colors.accent
                            : Colors.blue,
                        },
                      ]}
                    />
                    {i < selectedTicket.updates.length - 1 && (
                      <View style={styles.timelineLine} />
                    )}
                  </View>
                  <View style={{flex: 1}}>
                    <AppText
                      variant="small"
                      style={{
                        fontWeight: '600',
                        color: update.isUser
                          ? Colors.accent
                          : Colors.textPrimary,
                        marginBottom: vs(1),
                      }}>
                      {update.by}
                    </AppText>
                    <AppText
                      variant="small"
                      color={Colors.textTertiary}
                      style={{fontSize: ms(10), marginBottom: vs(4)}}>
                      {update.time}
                    </AppText>
                    <View
                      style={[
                        styles.card,
                        {
                          marginBottom: 0,
                          backgroundColor: update.isUser
                            ? Colors.accent + '08'
                            : Colors.background,
                        },
                      ]}>
                      <AppText
                        variant="body"
                        style={{fontSize: ms(13), lineHeight: ms(19)}}>
                        {update.msg}
                      </AppText>
                    </View>
                  </View>
                </View>
              ))}

              {/* Note */}
              {selectedTicket.note ? (
                <View
                  style={[
                    styles.card,
                    {
                      backgroundColor: Colors.tealBg,
                      marginTop: vs(4),
                    },
                  ]}>
                  <AppText
                    variant="small"
                    style={{color: Colors.tealText, fontSize: ms(11)}}>
                    {selectedTicket.note}
                  </AppText>
                </View>
              ) : null}

              {/* Reply / Close */}
              {selectedTicket.status === 'open' ? (
                <>
                  <View style={[styles.card, {marginTop: vs(10)}]}>
                    <TextInput
                      style={[styles.multilineInput, {height: vs(60)}]}
                      placeholder="Type your reply..."
                      placeholderTextColor={Colors.textTertiary}
                      value={ticketReply}
                      onChangeText={setTicketReply}
                      multiline
                      textAlignVertical="top"
                    />
                  </View>
                  <View style={{flexDirection: 'row', gap: s(10)}}>
                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        {backgroundColor: Colors.background},
                      ]}
                      activeOpacity={0.7}
                      onPress={() => setShowTicketModal(false)}>
                      <AppText
                        variant="bodyBold"
                        color={Colors.textSecondary}>
                        Cancel
                      </AppText>
                    </TouchableOpacity>
                    <TouchableOpacity
                      style={[
                        styles.actionBtn,
                        {
                          backgroundColor: ticketReply.trim()
                            ? Colors.primary
                            : Colors.borderLight,
                        },
                      ]}
                      activeOpacity={0.8}
                      disabled={!ticketReply.trim()}
                      onPress={() => setShowTicketModal(false)}>
                      <AppText
                        variant="bodyBold"
                        style={{
                          color: ticketReply.trim()
                            ? Colors.white
                            : Colors.textTertiary,
                        }}>
                        Send reply
                      </AppText>
                    </TouchableOpacity>
                  </View>
                </>
              ) : (
                <TouchableOpacity
                  style={[
                    styles.actionBtn,
                    {backgroundColor: Colors.primary, marginTop: vs(10)},
                  ]}
                  activeOpacity={0.8}
                  onPress={() => setShowTicketModal(false)}>
                  <AppText variant="bodyBold" style={{color: Colors.white}}>
                    Close
                  </AppText>
                </TouchableOpacity>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    );
  };

  /* ═══════════════════════════════════════════════════════
     TAB ROUTER
     ═══════════════════════════════════════════════════════ */
  const renderTabContent = () => {
    switch (activeTab) {
      case 'faqs':
        return renderFaqsTab();
      case 'chat':
        return renderChatTab();
      case 'report':
        return renderReportTab();
      case 'tickets':
        return renderTicketsTab();
      default:
        return renderFaqsTab();
    }
  };

  /* ═══════════════════════════════════════════════════════
     RENDER
     ═══════════════════════════════════════════════════════ */
  return (
    <View style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor={Colors.primary} />
      {renderHeader()}
      {renderSearchBar()}
      {renderTabBar()}
      <View style={styles.content}>{renderTabContent()}</View>
      {renderSuccessModal()}
      {renderTicketModal()}
    </View>
  );
};

/* ── STYLES ──────────────────────────────────────────── */
const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: Colors.background},
  scrollView: {flex: 1},
  scrollContent: {padding: s(14), paddingBottom: vs(40)},

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
  backBtn: {paddingVertical: vs(4), paddingRight: s(12)},
  backText: {color: Colors.white, fontSize: ms(15)},
  searchToggle: {padding: s(6)},
  headerTitle: {
    color: Colors.white,
    fontSize: ms(24),
    fontWeight: '700',
    marginBottom: vs(4),
  },
  headerSubtitle: {color: 'rgba(255,255,255,0.5)', fontSize: ms(12)},

  /* Search Bar */
  searchBarWrap: {
    backgroundColor: Colors.primary,
    paddingHorizontal: s(16),
    paddingBottom: vs(12),
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    paddingHorizontal: s(12),
    paddingVertical: vs(8),
  },
  searchInput: {
    flex: 1,
    fontSize: ms(13),
    color: Colors.textPrimary,
    padding: 0,
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
  tabActive: {borderBottomColor: Colors.primary},
  tabLabel: {fontSize: ms(11), color: Colors.textTertiary, fontWeight: '500'},
  tabLabelActive: {color: Colors.primary, fontWeight: '700'},

  content: {flex: 1},

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
    marginBottom: vs(10),
  },

  /* Billing rows */
  billingRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: vs(4),
  },

  /* Hero buttons */
  heroBtn: {
    borderRadius: ms(10),
    paddingHorizontal: s(18),
    paddingVertical: vs(9),
  },

  /* Contact grid */
  contactGrid: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(10),
  },
  contactCard: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(12),
    paddingHorizontal: s(6),
  },
  contactBadge: {
    borderRadius: ms(5),
    paddingHorizontal: s(6),
    paddingVertical: vs(2),
    marginTop: vs(6),
  },

  /* FAQ */
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  faqItem: {
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
    marginTop: vs(8),
    paddingTop: vs(8),
  },
  faqQuestion: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  faqAnswer: {
    marginTop: vs(8),
    paddingTop: vs(4),
  },
  helpfulRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: vs(10),
    paddingTop: vs(8),
    borderTopWidth: 1,
    borderTopColor: Colors.borderLight,
  },
  helpfulBtn: {
    borderRadius: ms(8),
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    marginRight: s(6),
    backgroundColor: Colors.background,
  },

  /* Chat */
  chatHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    paddingHorizontal: s(14),
    paddingVertical: vs(10),
    borderBottomWidth: 0.5,
    borderBottomColor: Colors.borderLight,
  },
  agentAvatar: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(18),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
  },
  onlineDot: {
    width: ms(7),
    height: ms(7),
    borderRadius: ms(4),
    backgroundColor: Colors.accent,
    marginRight: s(4),
  },
  chatMessages: {flex: 1, backgroundColor: Colors.background},
  systemMsg: {
    alignSelf: 'center',
    backgroundColor: Colors.borderLight,
    borderRadius: ms(12),
    paddingHorizontal: s(12),
    paddingVertical: vs(4),
    marginBottom: vs(10),
  },
  agentRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: vs(10),
  },
  agentBubbleAvatar: {
    width: ms(24),
    height: ms(24),
    borderRadius: ms(12),
    backgroundColor: Colors.tealBg,
    alignItems: 'center',
    justifyContent: 'center',
    marginTop: vs(14),
  },
  agentBubble: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderTopLeftRadius: ms(4),
    padding: s(10),
    maxWidth: '90%',
  },
  userRow: {
    alignItems: 'flex-end',
    marginBottom: vs(10),
  },
  userBubble: {
    backgroundColor: Colors.accent,
    borderRadius: ms(14),
    borderTopRightRadius: ms(4),
    padding: s(10),
    maxWidth: '80%',
  },
  quickReplies: {
    maxHeight: vs(42),
    backgroundColor: Colors.white,
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
    paddingVertical: vs(8),
  },
  quickReplyChip: {
    borderWidth: 1,
    borderColor: Colors.accent + '40',
    borderRadius: ms(20),
    paddingHorizontal: s(12),
    paddingVertical: vs(5),
    backgroundColor: Colors.accent + '08',
  },
  chatInputBar: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    backgroundColor: Colors.white,
    paddingHorizontal: s(10),
    paddingTop: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: Colors.borderLight,
  },
  attachBtn: {
    padding: s(6),
    marginBottom: vs(2),
  },
  chatInput: {
    flex: 1,
    fontSize: ms(13),
    color: Colors.textPrimary,
    maxHeight: vs(80),
    paddingHorizontal: s(8),
    paddingVertical: vs(6),
  },
  sendBtn: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: vs(2),
  },

  /* Report */
  issueGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: vs(10),
  },
  issueCard: {
    width: '31%',
    alignItems: 'center',
    paddingVertical: vs(12),
    paddingHorizontal: s(4),
    marginBottom: vs(8),
  },
  severityRow: {
    flexDirection: 'row',
    gap: s(8),
    marginBottom: vs(10),
  },
  severityBtn: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.white,
    borderRadius: ms(10),
    paddingVertical: vs(9),
    borderWidth: 1,
    borderColor: Colors.borderLight,
  },
  multilineInput: {
    fontSize: ms(13),
    color: Colors.textPrimary,
    height: vs(100),
    padding: 0,
  },
  submitBtn: {
    borderRadius: ms(12),
    paddingVertical: vs(14),
    alignItems: 'center',
    marginTop: vs(6),
  },

  /* Tickets */
  ticketIcon: {
    width: ms(40),
    height: ms(40),
    borderRadius: ms(12),
    alignItems: 'center',
    justifyContent: 'center',
  },
  ticketTag: {
    backgroundColor: Colors.background,
    borderRadius: ms(5),
    paddingHorizontal: s(8),
    paddingVertical: vs(2),
  },
  statusChip: {
    borderRadius: ms(5),
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
  },

  /* Action button */
  actionBtn: {
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(13),
    alignItems: 'center',
    flex: 1,
  },

  /* Success circle */
  successCircle: {
    width: ms(64),
    height: ms(64),
    borderRadius: ms(32),
    backgroundColor: Colors.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },

  /* Timeline */
  timelineDot: {
    width: ms(10),
    height: ms(10),
    borderRadius: ms(5),
    marginTop: vs(4),
    zIndex: 1,
  },
  timelineLine: {
    width: 2,
    flex: 1,
    backgroundColor: Colors.borderLight,
    marginTop: vs(2),
  },

  /* Bottom sheet */
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

  /* Divider */
  divider: {
    height: 1,
    backgroundColor: Colors.borderLight,
    marginVertical: vs(8),
  },
});

export default HelpSupportScreen;
