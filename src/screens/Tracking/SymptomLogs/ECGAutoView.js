import React, {useState} from 'react';
import {View, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Svg, {Rect, Line as SvgLine, Polyline, Path} from 'react-native-svg';
import Colors from '../../../constants/colors';
import AppText from '../../../components/shared/AppText';
import Icon from '../../../components/shared/Icons';

/* ───────── static data ───────── */

const DEVICES = [
  {
    id: 'watch',
    icon: 'watch-outline',
    name: 'Apple Watch ECG',
    description: 'Series 4+. Lead I. 30-sec. AFib detection.',
    status: 'Series 9 linked',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
  {
    id: 'kardia',
    icon: 'phone-portrait-outline',
    name: 'KardiaMobile',
    description: 'AliveCor. 1-lead or 6-lead. Medical-grade. Bluetooth.',
    status: 'Pair device',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
  {
    id: 'holter',
    icon: 'bandage-outline',
    name: 'Holter / Patch',
    description: 'Zio Patch / BioTel. 24h\u201314d continuous. Review results.',
    status: 'Import report',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
  {
    id: '12lead',
    icon: 'medical-outline',
    name: '12-lead ECG',
    description: 'Hospital / clinic ECG. Upload PDF or image for AI read.',
    status: 'Upload / scan',
    statusBg: '#f3f4f6',
    statusColor: Colors.textSecondary,
  },
  {
    id: 'wellue',
    icon: 'hardware-chip-outline',
    name: 'Portable 12-lead',
    description: 'Wellue DuoEK / Contec ECG. Bluetooth 12-lead home device.',
    status: 'Pair Wellue',
    statusBg: Colors.amberBg,
    statusColor: Colors.amberText,
  },
  {
    id: 'oximeter',
    icon: 'fitness-outline',
    name: 'Pulse oximeter',
    description: 'iHealth PO3. SpO\u2082 + plethysmography for rhythm check.',
    status: 'iHealth linked',
    statusBg: Colors.tealBg,
    statusColor: Colors.tealText,
  },
];

const HOLTER_DURATIONS = ['24 hours', '48 hours', '7 days', '14 days', '30 days'];

const AFIB_OPTIONS = ['No AFib detected', '<1%', '1-10%', '>10%'];

const LEAD_MAP = [
  {
    label: 'Inferior leads (II, III, aVF)',
    icon: 'heart-outline',
    iconBg: Colors.redBg,
    iconColor: Colors.redText,
    desc: 'RCA territory \u2014 inferior wall of left ventricle. ST elevation here suggests inferior MI.',
  },
  {
    label: 'Lateral leads (I, aVL, V5, V6)',
    icon: 'pulse-outline',
    iconBg: Colors.pinkBg,
    iconColor: '#a8326c',
    desc: 'Circumflex territory \u2014 lateral wall. High lateral changes in I/aVL, low lateral in V5/V6.',
  },
  {
    label: 'Anterior leads (V1\u2013V4)',
    icon: 'shield-outline',
    iconBg: Colors.tealBg,
    iconColor: Colors.tealText,
    desc: 'LAD territory \u2014 anterior wall and septum. ST elevation here is an anterior STEMI.',
  },
  {
    label: 'Right-sided (aVR, V1)',
    icon: 'flash-outline',
    iconBg: Colors.amberBg,
    iconColor: Colors.amberText,
    desc: 'LMCA / proximal LAD \u2014 diffuse ST depression with aVR elevation suggests left-main disease.',
  },
];

/* ───────── component ───────── */

const ECGAutoView = () => {
  const [activeDevice, setActiveDevice] = useState('watch');
  const [activeDuration, setActiveDuration] = useState('48 hours');
  const [activeAfib, setActiveAfib] = useState('No AFib detected');

  /* ── 1. Device Grid ── */
  const renderDeviceGrid = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        CONNECT ECG DEVICE
      </AppText>
      <View style={st.deviceGrid}>
        {DEVICES.map(d => {
          const active = activeDevice === d.id;
          return (
            <TouchableOpacity
              key={d.id}
              activeOpacity={0.7}
              onPress={() => setActiveDevice(d.id)}
              style={[
                st.deviceCard,
                active && {borderColor: Colors.primary, backgroundColor: '#f0f7f4'},
              ]}>
              <Icon
                family="Ionicons"
                name={d.icon}
                size={ms(22)}
                color={active ? Colors.primary : Colors.textSecondary}
              />
              <AppText
                variant="bodyBold"
                color={active ? Colors.primary : Colors.textPrimary}
                style={{marginTop: vs(4)}}>
                {d.name}
              </AppText>
              <AppText
                variant="small"
                color={Colors.textSecondary}
                style={{marginTop: vs(2), lineHeight: ms(15)}}>
                {d.description}
              </AppText>
              <View style={[st.statusBadge, {backgroundColor: d.statusBg}]}>
                <AppText variant="small" color={d.statusColor}>
                  {d.status}
                </AppText>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>
    </View>
  );

  /* ── 2. Apple Watch Panel ── */
  const renderWatchPanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        APPLE WATCH SERIES 9 · ECG RECORDING
      </AppText>

      {/* Dark hero card */}
      <View style={st.darkHero}>
        <View style={st.heroTopRow}>
          <AppText variant="small" color="rgba(255,255,255,0.7)" style={{flex: 1}}>
            Apple Watch Series 9 · ECG App · Lead I (30 sec)
          </AppText>
          <View style={st.liveDot}>
            <View style={[st.dot, {backgroundColor: '#22c55e'}]} />
            <AppText variant="small" color="#22c55e" style={{marginLeft: s(4)}}>
              Recording
            </AppText>
          </View>
        </View>

        {/* 3-column metrics */}
        <View style={st.metricsRow}>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color="#22c55e" style={{fontSize: ms(20)}}>
              72
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">BPM</AppText>
          </View>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color="#22c55e" style={{fontSize: ms(20)}}>
              Sinus
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">Rhythm</AppText>
          </View>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color="#22c55e" style={{fontSize: ms(20)}}>
              418ms
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">QTc</AppText>
          </View>
        </View>

        {/* SVG waveform */}
        <View style={{marginTop: vs(10), borderRadius: ms(8), overflow: 'hidden'}}>
          <Svg width="100%" height={vs(70)} viewBox="0 0 340 70">
            <Rect x="0" y="0" width="340" height="70" fill="#0a1628" />
            {/* Grid lines */}
            <SvgLine x1="0" y1="35" x2="340" y2="35" stroke="rgba(34,197,94,0.15)" strokeWidth="0.5" />
            <SvgLine x1="0" y1="17" x2="340" y2="17" stroke="rgba(34,197,94,0.08)" strokeWidth="0.5" />
            <SvgLine x1="0" y1="52" x2="340" y2="52" stroke="rgba(34,197,94,0.08)" strokeWidth="0.5" />
            {/* PQRST waveform repeating */}
            <Polyline
              points="0,35 15,35 20,33 25,30 30,33 35,35 45,35 48,34 50,28 52,10 54,55 56,25 58,35 65,35 70,32 78,28 85,35 100,35 115,35 120,33 125,30 130,33 135,35 145,35 148,34 150,28 152,10 154,55 156,25 158,35 165,35 170,32 178,28 185,35 200,35 215,35 220,33 225,30 230,33 235,35 245,35 248,34 250,28 252,10 254,55 256,25 258,35 265,35 270,32 278,28 285,35 300,35 315,35 320,33 325,30 330,33 335,35 340,35"
              fill="none"
              stroke="#22c55e"
              strokeWidth="1.5"
            />
          </Svg>
        </View>

        {/* Result card */}
        <View style={st.resultCard}>
          <Icon family="Ionicons" name="checkmark-circle" size={ms(20)} color={Colors.tealText} />
          <View style={{marginLeft: s(8), flex: 1}}>
            <AppText variant="bodyBold" color={Colors.tealText}>
              Sinus rhythm detected
            </AppText>
            <AppText variant="small" color={Colors.tealText} style={{marginTop: vs(2)}}>
              Heart rate 72 BPM. Regular rhythm with normal P waves preceding each QRS complex. No atrial fibrillation detected. QTc within normal limits.
            </AppText>
          </View>
        </View>
      </View>

      {/* Blue insight card */}
      <View style={[st.insightCard, {backgroundColor: Colors.blueBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(18)} color={Colors.blueText} />
          <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6), flex: 1}}>
            Apple Watch ECG — understanding its capabilities
          </AppText>
        </View>
        <AppText variant="small" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          The Apple Watch records a single-lead ECG (Lead I) using the electrical heart sensor. It is FDA-cleared for detecting atrial fibrillation (AFib) and normal sinus rhythm. However, it cannot diagnose ST-segment changes (heart attacks), left ventricular hypertrophy (LVH), bundle branch blocks, or other complex arrhythmias. A normal Apple Watch ECG does not rule out all cardiac conditions. If you have symptoms such as chest pain, dizziness, or palpitations, seek medical evaluation regardless of the Watch result.
        </AppText>
      </View>

      {/* AFib detection card */}
      <View style={st.card}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>
          Background AFib detection · 30 days
        </AppText>
        <View style={[st.afibRow, {marginTop: vs(8)}]}>
          <Icon family="Ionicons" name="shield-checkmark-outline" size={ms(22)} color={Colors.primary} />
          <View style={{marginLeft: s(8), flex: 1}}>
            <AppText variant="body" color={Colors.textPrimary}>
              Sinus rhythm — all 30-day readings
            </AppText>
            <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
              847 background readings · 0 AFib episodes
            </AppText>
          </View>
          <View style={[st.statusBadge, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="small" color={Colors.tealText}>All Normal</AppText>
          </View>
        </View>
      </View>

      {/* Import button */}
      <TouchableOpacity activeOpacity={0.7} style={st.primaryBtn}>
        <Icon family="Ionicons" name="download-outline" size={ms(18)} color={Colors.white} />
        <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
          Import Apple Watch ECG into today's log
        </AppText>
      </TouchableOpacity>
    </View>
  );

  /* ── 3. KardiaMobile Panel ── */
  const renderKardiaPanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        KARDIAMOBILE 6L BY ALIVECOR
      </AppText>

      {/* Blue insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.blueBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(18)} color={Colors.blueText} />
          <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6), flex: 1}}>
            KardiaMobile capabilities
          </AppText>
        </View>
        <AppText variant="small" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          KardiaMobile 6L records six leads simultaneously (I, II, III, aVL, aVR, aVF), providing a more comprehensive view than the Apple Watch single lead. It is FDA-cleared for detecting AFib, bradycardia, tachycardia, and normal rhythm. The 6-lead view can help identify certain ST-segment changes and rhythm abnormalities not visible on Lead I alone. AliveCor's AI analysis (KardiaAI) provides instant interpretation with high sensitivity for AFib detection.
        </AppText>
      </View>

      {/* Dark pairing card */}
      <View style={st.darkHero}>
        <View style={{alignItems: 'center', paddingVertical: vs(10)}}>
          <Icon family="Ionicons" name="phone-portrait-outline" size={ms(36)} color="rgba(255,255,255,0.7)" />
          <AppText variant="bodyBold" color={Colors.white} style={{marginTop: vs(8)}}>
            Pair KardiaMobile
          </AppText>
          <AppText
            variant="small"
            color="rgba(255,255,255,0.6)"
            style={{marginTop: vs(4), textAlign: 'center', paddingHorizontal: s(20)}}>
            Place two or more fingers on the KardiaMobile electrodes, then tap the button below to scan for the device via Bluetooth.
          </AppText>
          <TouchableOpacity activeOpacity={0.7} style={[st.primaryBtn, {marginTop: vs(12), alignSelf: 'center'}]}>
            <Icon family="Ionicons" name="bluetooth-outline" size={ms(16)} color={Colors.white} />
            <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
              Scan for KardiaMobile
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sky insight */}
      <View style={[st.insightCard, {backgroundColor: '#f0f9ff'}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="help-circle-outline" size={ms(18)} color={Colors.blueText} />
          <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6), flex: 1}}>
            When to use KardiaMobile over the Watch
          </AppText>
        </View>
        <AppText variant="small" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          Use KardiaMobile when you need more than a single-lead view. The 6-lead recording is better for evaluating palpitations with a broader electrical perspective, differentiating SVT from VT, assessing frontal-plane axis shifts, and catching inferior/lateral ST changes that Lead I alone may miss. It is also preferred when sharing recordings directly with a cardiologist for telemedicine review, as the multi-lead format is more clinically useful.
        </AppText>
      </View>
    </View>
  );

  /* ── 4. Holter Panel ── */
  const renderHolterPanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        HOLTER / AMBULATORY ECG MONITOR
      </AppText>

      {/* Sky insight */}
      <View style={[st.insightCard, {backgroundColor: '#f0f9ff'}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(18)} color={Colors.blueText} />
          <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6), flex: 1}}>
            Holter monitoring explained
          </AppText>
        </View>
        <AppText variant="small" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          A Holter monitor (or ambulatory ECG patch) records your heart rhythm continuously for 24 hours to 14 days. Devices like the Zio Patch and BioTel Heart monitor are worn on the chest and capture every heartbeat, including intermittent arrhythmias that a 30-second ECG may miss. After the monitoring period, a cardiologist reviews the full recording and provides a detailed report of heart rate trends, arrhythmia burden, and ectopic beat counts.
        </AppText>
      </View>

      {/* Import Holter report card */}
      <View style={st.card}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>
          Import Holter report results
        </AppText>

        {/* Duration chips */}
        <View style={[st.chipRow, {marginTop: vs(8)}]}>
          {HOLTER_DURATIONS.map(d => {
            const active = activeDuration === d;
            return (
              <TouchableOpacity
                key={d}
                activeOpacity={0.7}
                onPress={() => setActiveDuration(d)}
                style={[st.chip, active && st.chipActive]}>
                <AppText variant="small" color={active ? Colors.white : Colors.textSecondary}>
                  {d}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>

        {/* 3-column stat boxes */}
        <View style={[st.metricsRow, {marginTop: vs(10)}]}>
          <View style={st.statBox}>
            <AppText variant="small" color={Colors.textSecondary}>Min HR</AppText>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(18)}}>68</AppText>
          </View>
          <View style={st.statBox}>
            <AppText variant="small" color={Colors.textSecondary}>Avg HR</AppText>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(18)}}>72</AppText>
          </View>
          <View style={st.statBox}>
            <AppText variant="small" color={Colors.textSecondary}>Max HR</AppText>
            <AppText variant="bodyBold" color={Colors.textPrimary} style={{fontSize: ms(18)}}>118</AppText>
          </View>
        </View>

        {/* 2-column stat boxes */}
        <View style={[st.metricsRow, {marginTop: vs(8)}]}>
          <View style={[st.statBox, {backgroundColor: Colors.amberBg}]}>
            <AppText variant="small" color={Colors.amberText}>PVC burden</AppText>
            <AppText variant="bodyBold" color={Colors.amberText} style={{fontSize: ms(18)}}>1.2%</AppText>
          </View>
          <View style={[st.statBox, {backgroundColor: Colors.tealBg}]}>
            <AppText variant="small" color={Colors.tealText}>PAC count</AppText>
            <AppText variant="bodyBold" color={Colors.tealText} style={{fontSize: ms(18)}}>180</AppText>
          </View>
        </View>

        {/* AFib burden chips */}
        <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(10)}}>
          AFib burden
        </AppText>
        <View style={[st.chipRow, {marginTop: vs(4)}]}>
          {AFIB_OPTIONS.map(opt => {
            const active = activeAfib === opt;
            return (
              <TouchableOpacity
                key={opt}
                activeOpacity={0.7}
                onPress={() => setActiveAfib(opt)}
                style={[st.chip, active && st.chipActive]}>
                <AppText variant="small" color={active ? Colors.white : Colors.textSecondary}>
                  {opt}
                </AppText>
              </TouchableOpacity>
            );
          })}
        </View>
      </View>

      {/* Amber insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.amberBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="warning-outline" size={ms(18)} color={Colors.amberText} />
          <AppText variant="bodyBold" color={Colors.amberText} style={{marginLeft: s(6), flex: 1}}>
            PVC burden 1.2% — borderline
          </AppText>
        </View>
        <AppText variant="small" color={Colors.amberText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          A PVC burden of 1.2% is at the borderline between normal ({'<'}1%) and potentially significant ({'>'}1%). While occasional PVCs are common and usually benign, a sustained burden above 1% warrants monitoring. Burdens exceeding 10\u201315% over time can contribute to cardiomyopathy. Discuss this result with your cardiologist, especially if you have symptoms like palpitations, dizziness, or fatigue.
        </AppText>
      </View>
    </View>
  );

  /* ── 5. 12-Lead Import Panel ── */
  const render12LeadPanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        12-LEAD ECG IMPORT
      </AppText>

      {/* Import zone */}
      <View style={st.importZone}>
        <Icon family="Ionicons" name="document-outline" size={ms(32)} color={Colors.textTertiary} />
        <AppText variant="bodyBold" color={Colors.textPrimary} style={{marginTop: vs(8)}}>
          Import 12-lead ECG
        </AppText>
        <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(4)}}>
          Take photo or upload PDF
        </AppText>
        <TouchableOpacity activeOpacity={0.7} style={[st.primaryBtn, {marginTop: vs(10)}]}>
          <Icon family="Ionicons" name="camera-outline" size={ms(16)} color={Colors.white} />
          <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
            Capture or upload
          </AppText>
        </TouchableOpacity>
      </View>

      {/* Lead map card */}
      <View style={st.card}>
        <AppText variant="bodyBold" color={Colors.textPrimary}>
          12-lead ECG — what each lead shows
        </AppText>
        {LEAD_MAP.map((lead, i) => (
          <View key={i} style={[st.leadRow, i === 0 && {marginTop: vs(10)}]}>
            <View style={[st.leadIconWrap, {backgroundColor: lead.iconBg}]}>
              <Icon family="Ionicons" name={lead.icon} size={ms(18)} color={lead.iconColor} />
            </View>
            <View style={{marginLeft: s(10), flex: 1}}>
              <AppText variant="bodyBold" color={Colors.textPrimary}>{lead.label}</AppText>
              <AppText variant="small" color={Colors.textSecondary} style={{marginTop: vs(2), lineHeight: ms(15)}}>
                {lead.desc}
              </AppText>
            </View>
          </View>
        ))}
      </View>

      {/* Blue insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.blueBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(18)} color={Colors.blueText} />
          <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6), flex: 1}}>
            Home 12-lead ECG devices
          </AppText>
        </View>
        <AppText variant="small" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          The Wellue DuoEK S (approximately $300\u2013400) and Contec ECG1200G ($200\u2013500) are portable 12-lead ECG devices that connect via Bluetooth or USB. They allow you to record a full 12-lead ECG at home and share results with your doctor. While not a replacement for hospital-grade equipment, they can be valuable for monitoring known conditions between clinic visits.
        </AppText>
      </View>
    </View>
  );

  /* ── 6. Wellue Panel ── */
  const renderWelluePanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        WELLUE DUOEK · 12-LEAD HOME DEVICE
      </AppText>

      {/* Dark pairing card */}
      <View style={st.darkHero}>
        <View style={{alignItems: 'center', paddingVertical: vs(10)}}>
          <Icon family="Ionicons" name="hardware-chip-outline" size={ms(36)} color="rgba(255,255,255,0.7)" />
          <AppText variant="bodyBold" color={Colors.white} style={{marginTop: vs(8)}}>
            Pair Wellue DuoEK
          </AppText>
          <AppText
            variant="small"
            color="rgba(255,255,255,0.6)"
            style={{marginTop: vs(4), textAlign: 'center', paddingHorizontal: s(20)}}>
            Attach all 10 electrodes as shown in the device manual (4 limb leads + 6 precordial leads). Power on the DuoEK and enable Bluetooth, then tap below to pair.
          </AppText>
          <TouchableOpacity activeOpacity={0.7} style={[st.primaryBtn, {marginTop: vs(12), alignSelf: 'center'}]}>
            <Icon family="Ionicons" name="bluetooth-outline" size={ms(16)} color={Colors.white} />
            <AppText variant="bodyBold" color={Colors.white} style={{marginLeft: s(6)}}>
              Connect Wellue
            </AppText>
          </TouchableOpacity>
        </View>
      </View>

      {/* Sky insight */}
      <View style={[st.insightCard, {backgroundColor: '#f0f9ff'}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="information-circle-outline" size={ms(18)} color={Colors.blueText} />
          <AppText variant="bodyBold" color={Colors.blueText} style={{marginLeft: s(6), flex: 1}}>
            Compatible home 12-lead devices
          </AppText>
        </View>
        <AppText variant="small" color={Colors.blueText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          Wellue DuoEK S ($300\u2013400) \u2014 Bluetooth 12-lead, app-based recording, AI interpretation, PDF export. Contec ECG1200G ($200\u2013500) \u2014 professional-grade portable 12-lead, thermal printout, USB data transfer. Biocare iE300 ($400\u2013600) \u2014 clinical portable ECG with touchscreen, Wi-Fi upload, and HL7/FHIR export. All devices provide standard 12-lead recordings suitable for physician review.
        </AppText>
      </View>
    </View>
  );

  /* ── 7. Pulse Oximeter Panel ── */
  const renderOximeterPanel = () => (
    <View style={st.section}>
      <AppText variant="sectionTitle" color={Colors.textPrimary}>
        IHEALTH PO3 · SPO₂ + PLETHYSMOGRAPHY
      </AppText>

      {/* Dark hero card */}
      <View style={st.darkHero}>
        <View style={st.heroTopRow}>
          <AppText variant="small" color="rgba(255,255,255,0.7)" style={{flex: 1}}>
            iHealth PO3 Pulse Oximeter · Bluetooth · Connected
          </AppText>
          <View style={st.liveDot}>
            <View style={[st.dot, {backgroundColor: '#22c55e'}]} />
            <AppText variant="small" color="#22c55e" style={{marginLeft: s(4)}}>
              Live
            </AppText>
          </View>
        </View>

        {/* 3-column metrics */}
        <View style={st.metricsRow}>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color="#22c55e" style={{fontSize: ms(20)}}>
              97%
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">SpO₂</AppText>
          </View>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color="#22c55e" style={{fontSize: ms(20)}}>
              72
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">HR</AppText>
          </View>
          <View style={st.metricBox}>
            <AppText variant="bodyBold" color="#22c55e" style={{fontSize: ms(20)}}>
              Regular
            </AppText>
            <AppText variant="small" color="rgba(255,255,255,0.6)">Rhythm</AppText>
          </View>
        </View>

        {/* SVG plethysmography waveform */}
        <View style={{marginTop: vs(10), borderRadius: ms(8), overflow: 'hidden'}}>
          <Svg width="100%" height={vs(70)} viewBox="0 0 340 70">
            <Rect x="0" y="0" width="340" height="70" fill="#0a1628" />
            <SvgLine x1="0" y1="35" x2="340" y2="35" stroke="rgba(16,104,168,0.15)" strokeWidth="0.5" />
            <SvgLine x1="0" y1="17" x2="340" y2="17" stroke="rgba(16,104,168,0.08)" strokeWidth="0.5" />
            <SvgLine x1="0" y1="52" x2="340" y2="52" stroke="rgba(16,104,168,0.08)" strokeWidth="0.5" />
            {/* Plethysmography waveform (smoother, rounded peaks) */}
            <Path
              d="M0,50 C10,50 15,48 20,40 C25,28 28,15 32,12 C36,15 38,30 40,40 C42,48 48,52 55,52 C62,52 65,50 70,50 C75,50 80,48 85,40 C90,28 93,15 97,12 C101,15 103,30 105,40 C107,48 113,52 120,52 C127,52 130,50 135,50 C140,50 145,48 150,40 C155,28 158,15 162,12 C166,15 168,30 170,40 C172,48 178,52 185,52 C192,52 195,50 200,50 C205,50 210,48 215,40 C220,28 223,15 227,12 C231,15 233,30 235,40 C237,48 243,52 250,52 C257,52 260,50 265,50 C270,50 275,48 280,40 C285,28 288,15 292,12 C296,15 298,30 300,40 C302,48 308,52 315,52 C322,52 325,50 330,50 C335,50 338,50 340,50"
              fill="none"
              stroke="#1068a8"
              strokeWidth="1.5"
            />
          </Svg>
        </View>
      </View>

      {/* Amber insight */}
      <View style={[st.insightCard, {backgroundColor: Colors.amberBg}]}>
        <View style={st.insightHeader}>
          <Icon family="Ionicons" name="warning-outline" size={ms(18)} color={Colors.amberText} />
          <AppText variant="bodyBold" color={Colors.amberText} style={{marginLeft: s(6), flex: 1}}>
            Pulse oximeter rhythm check — limitations
          </AppText>
        </View>
        <AppText variant="small" color={Colors.amberText} style={{marginTop: vs(4), lineHeight: ms(16)}}>
          A pulse oximeter measures blood oxygen saturation and can display a plethysmography waveform that reflects pulse regularity. However, it is not an ECG and cannot diagnose specific arrhythmias, ST-segment changes, heart blocks, or QT prolongation. An irregular plethysmography waveform may suggest AFib or ectopic beats, but confirmation requires a proper ECG recording. Do not use pulse oximetry as a substitute for ECG when evaluating cardiac symptoms.
        </AppText>
      </View>
    </View>
  );

  /* ── main render ── */
  return (
    <View style={st.container}>
      {renderDeviceGrid()}
      {activeDevice === 'watch' && renderWatchPanel()}
      {activeDevice === 'kardia' && renderKardiaPanel()}
      {activeDevice === 'holter' && renderHolterPanel()}
      {activeDevice === '12lead' && render12LeadPanel()}
      {activeDevice === 'wellue' && renderWelluePanel()}
      {activeDevice === 'oximeter' && renderOximeterPanel()}
    </View>
  );
};

/* ───────── styles ───────── */

const st = StyleSheet.create({
  container: {
    paddingBottom: vs(10),
  },
  section: {
    marginTop: vs(14),
  },

  /* Device grid */
  deviceGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginTop: vs(8),
  },
  deviceCard: {
    width: '48.5%',
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(12),
    marginBottom: vs(8),
    backgroundColor: Colors.white,
  },
  statusBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: s(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
    marginTop: vs(6),
  },

  /* Cards */
  card: {
    borderWidth: 0.5,
    borderColor: '#d1d5db',
    borderRadius: ms(14),
    padding: ms(14),
    backgroundColor: Colors.white,
    marginTop: vs(8),
  },
  darkHero: {
    backgroundColor: '#040d18',
    borderRadius: ms(14),
    padding: ms(14),
    marginTop: vs(8),
  },
  heroTopRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  liveDot: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dot: {
    width: ms(7),
    height: ms(7),
    borderRadius: ms(4),
  },

  /* Metrics */
  metricsRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: vs(10),
  },
  metricBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(6),
    backgroundColor: 'rgba(255,255,255,0.06)',
    borderRadius: ms(10),
    marginHorizontal: s(3),
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(8),
    backgroundColor: '#f9fafb',
    borderRadius: ms(10),
    marginHorizontal: s(3),
    borderWidth: 0.5,
    borderColor: '#e5e7eb',
  },

  /* Result card */
  resultCard: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'rgba(29,158,117,0.12)',
    borderRadius: ms(10),
    padding: ms(10),
    marginTop: vs(10),
  },

  /* Insight cards */
  insightCard: {
    borderRadius: ms(14),
    padding: ms(14),
    marginTop: vs(8),
  },
  insightHeader: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* AFib row */
  afibRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },

  /* Chips */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(6),
  },
  chip: {
    paddingHorizontal: s(10),
    paddingVertical: vs(5),
    borderRadius: ms(8),
    backgroundColor: '#f3f4f6',
  },
  chipActive: {
    backgroundColor: Colors.primary,
  },

  /* Primary button */
  primaryBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: Colors.primary,
    borderRadius: ms(12),
    paddingVertical: vs(12),
    paddingHorizontal: s(16),
    marginTop: vs(10),
  },

  /* Import zone (dashed border) */
  importZone: {
    borderWidth: 1.5,
    borderColor: '#d1d5db',
    borderStyle: 'dashed',
    borderRadius: ms(14),
    padding: ms(20),
    alignItems: 'center',
    marginTop: vs(8),
    backgroundColor: Colors.white,
  },

  /* Lead map */
  leadRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginTop: vs(10),
  },
  leadIconWrap: {
    width: ms(36),
    height: ms(36),
    borderRadius: ms(10),
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ECGAutoView;
