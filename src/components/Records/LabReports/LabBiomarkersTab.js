import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

/* ─── chip ─── */
const Chip = ({label, bg, color}) => (
  <View style={[styles.chip, {backgroundColor: bg}]}>
    <AppText variant="small" color={color}>{label}</AppText>
  </View>
);

/* ─── sparkline bars ─── */
const SparklineBars = ({bars}) => (
  <View style={styles.sparkRow}>
    {bars.map((bar, i) => (
      <View
        key={i}
        style={[
          styles.sparkBar,
          {
            height: vs(bar.height),
            backgroundColor: bar.color,
          },
        ]}
      />
    ))}
  </View>
);

/* ─── SSV row (Status / Stability / Velocity) ─── */
const SSVRow = ({status, stability, velocity}) => (
  <View style={styles.ssvRow}>
    <View style={[styles.ssvItem, {backgroundColor: status.bg}]}>
      <AppText variant="small" color={status.color}>{status.label}</AppText>
    </View>
    <View style={[styles.ssvItem, {backgroundColor: stability.bg}]}>
      <AppText variant="small" color={stability.color}>{stability.label}</AppText>
    </View>
    <View style={[styles.ssvItem, {backgroundColor: velocity.bg}]}>
      <AppText variant="small" color={velocity.color}>{velocity.label}</AppText>
    </View>
  </View>
);

/* ─── cluster tags ─── */
const ClusterTags = ({tags}) => (
  <View style={styles.tagRow}>
    {tags.map((t, i) => (
      <View key={i} style={[styles.tag, {backgroundColor: t.bg}]}>
        <AppText variant="small" color={t.color}>{t.label}</AppText>
      </View>
    ))}
  </View>
);

/* ─── data ─── */
const barH = {low: 10, med: 18, high: 26, full: 32};

const CLUSTERS = [
  {
    title: 'Glucose control',
    cards: [
      {
        key: 'hba1c',
        iconName: 'flask-outline',
        iconBg: Colors.amberBg,
        iconColor: Colors.amberText,
        name: 'HbA1c',
        fullName: 'Glycated haemoglobin',
        testCount: '8 tests',
        latest: '7.8%',
        latestColor: Colors.redText,
        bars: [
          {height: barH.full, color: Colors.red},
          {height: barH.high, color: Colors.red},
          {height: barH.high, color: Colors.amber},
          {height: barH.med, color: Colors.amber},
          {height: barH.low, color: Colors.teal},
          {height: barH.med, color: Colors.amber},
          {height: barH.high, color: Colors.amber},
          {height: barH.high, color: Colors.red},
        ],
        ssv: {
          status: {label: 'Elevated', bg: Colors.redBg, color: Colors.redText},
          stability: {label: 'Variable', bg: Colors.amberBg, color: Colors.amberText},
          velocity: {label: '\u2191 Worsening', bg: Colors.redBg, color: Colors.redText},
        },
        tags: [
          {label: 'T2DM', bg: Colors.redBg, color: Colors.redText},
          {label: 'Kidney risk', bg: Colors.amberBg, color: Colors.amberText},
          {label: 'Retinopathy', bg: Colors.amberBg, color: Colors.amberText},
          {label: 'Metabolic syndrome', bg: Colors.purpleBg, color: Colors.purpleText},
        ],
      },
      {
        key: 'fpg',
        iconName: 'water-outline',
        iconBg: Colors.amberBg,
        iconColor: Colors.amberText,
        name: 'FPG',
        fullName: 'Fasting plasma glucose',
        testCount: '8 tests',
        latest: '8.4',
        latestColor: Colors.redText,
        bars: [
          {height: barH.full, color: Colors.red},
          {height: barH.high, color: Colors.red},
          {height: barH.med, color: Colors.amber},
          {height: barH.med, color: Colors.amber},
          {height: barH.low, color: Colors.teal},
          {height: barH.med, color: Colors.amber},
          {height: barH.high, color: Colors.red},
          {height: barH.full, color: Colors.red},
        ],
        ssv: {
          status: {label: 'Elevated', bg: Colors.redBg, color: Colors.redText},
          stability: {label: 'Variable', bg: Colors.amberBg, color: Colors.amberText},
          velocity: {label: '\u2191 Worsening', bg: Colors.redBg, color: Colors.redText},
        },
        tags: [
          {label: 'T2DM', bg: Colors.redBg, color: Colors.redText},
          {label: 'Kidney risk', bg: Colors.amberBg, color: Colors.amberText},
          {label: 'Retinopathy', bg: Colors.amberBg, color: Colors.amberText},
          {label: 'Metabolic syndrome', bg: Colors.purpleBg, color: Colors.purpleText},
        ],
      },
    ],
  },
  {
    title: 'Lipid panel',
    cards: [
      {
        key: 'ldl',
        iconName: 'flask-outline',
        iconBg: Colors.tealBg,
        iconColor: Colors.tealText,
        name: 'LDL',
        fullName: 'Low-density lipoprotein',
        testCount: '6 tests',
        latest: '118',
        latestColor: Colors.tealText,
        bars: [
          {height: barH.full, color: Colors.red},
          {height: barH.high, color: Colors.amber},
          {height: barH.high, color: Colors.amber},
          {height: barH.med, color: Colors.amber},
          {height: barH.med, color: Colors.teal},
          {height: barH.low, color: Colors.teal},
          {height: barH.med, color: Colors.amber},
          {height: barH.low, color: Colors.teal},
        ],
        ssv: {
          status: {label: 'Normal', bg: Colors.tealBg, color: Colors.tealText},
          stability: {label: 'Stable', bg: Colors.tealBg, color: Colors.tealText},
          velocity: {label: '\u2193 Improving', bg: Colors.tealBg, color: Colors.tealText},
        },
        tags: [
          {label: 'Cardiovascular', bg: Colors.redBg, color: Colors.redText},
          {label: 'Metabolic syndrome', bg: Colors.purpleBg, color: Colors.purpleText},
        ],
      },
      {
        key: 'hdl',
        iconName: 'flask-outline',
        iconBg: Colors.amberBg,
        iconColor: Colors.amberText,
        name: 'HDL',
        fullName: 'High-density lipoprotein',
        testCount: '6 tests',
        latest: '48',
        latestColor: Colors.amberText,
        bars: [
          {height: barH.low, color: Colors.red},
          {height: barH.low, color: Colors.amber},
          {height: barH.med, color: Colors.amber},
          {height: barH.med, color: Colors.amber},
          {height: barH.med, color: Colors.amber},
          {height: barH.med, color: Colors.amber},
          {height: barH.med, color: Colors.amber},
          {height: barH.med, color: Colors.amber},
        ],
        ssv: {
          status: {label: 'Borderline', bg: Colors.amberBg, color: Colors.amberText},
          stability: {label: 'Stable', bg: Colors.tealBg, color: Colors.tealText},
          velocity: {label: '\u2192 Flat', bg: Colors.amberBg, color: Colors.amberText},
        },
        tags: [
          {label: 'Cardiovascular', bg: Colors.redBg, color: Colors.redText},
        ],
      },
      {
        key: 'triglycerides',
        iconName: 'flask-outline',
        iconBg: Colors.amberBg,
        iconColor: Colors.amberText,
        name: 'Triglycerides',
        fullName: 'Serum triglycerides',
        testCount: '6 tests',
        latest: '162',
        latestColor: Colors.amberText,
        bars: [
          {height: barH.high, color: Colors.red},
          {height: barH.high, color: Colors.amber},
          {height: barH.med, color: Colors.amber},
          {height: barH.med, color: Colors.amber},
          {height: barH.low, color: Colors.teal},
          {height: barH.med, color: Colors.amber},
          {height: barH.med, color: Colors.amber},
          {height: barH.med, color: Colors.amber},
        ],
        ssv: {
          status: {label: 'Borderline', bg: Colors.amberBg, color: Colors.amberText},
          stability: {label: 'Variable', bg: Colors.amberBg, color: Colors.amberText},
          velocity: {label: '\u2191 Rising', bg: Colors.amberBg, color: Colors.amberText},
        },
        tags: [
          {label: 'Cardiovascular', bg: Colors.redBg, color: Colors.redText},
          {label: 'Metabolic syndrome', bg: Colors.purpleBg, color: Colors.purpleText},
        ],
      },
    ],
  },
  {
    title: 'Kidney function',
    cards: [
      {
        key: 'egfr',
        iconName: 'flask-outline',
        iconBg: Colors.tealBg,
        iconColor: Colors.tealText,
        name: 'eGFR',
        fullName: 'Estimated glomerular filtration rate',
        testCount: '4 tests',
        latest: '72',
        latestColor: Colors.tealText,
        bars: [
          {height: barH.high, color: Colors.teal},
          {height: barH.high, color: Colors.teal},
          {height: barH.med, color: Colors.teal},
          {height: barH.med, color: Colors.teal},
          {height: barH.med, color: Colors.teal},
          {height: barH.med, color: Colors.teal},
          {height: barH.med, color: Colors.teal},
          {height: barH.med, color: Colors.teal},
        ],
        ssv: {
          status: {label: 'G2', bg: Colors.tealBg, color: Colors.tealText},
          stability: {label: 'Stable', bg: Colors.tealBg, color: Colors.tealText},
          velocity: {label: '\u2192 Flat', bg: Colors.tealBg, color: Colors.tealText},
        },
        tags: [
          {label: 'Kidney', bg: Colors.amberBg, color: Colors.amberText},
          {label: 'T2DM nephropathy', bg: Colors.redBg, color: Colors.redText},
        ],
      },
      {
        key: 'urine-acr',
        iconName: 'flask-outline',
        iconBg: Colors.tealBg,
        iconColor: Colors.tealText,
        name: 'Urine ACR',
        fullName: 'Albumin-to-creatinine ratio',
        testCount: '3 tests',
        latest: '18',
        latestColor: Colors.tealText,
        bars: [
          {height: barH.low, color: Colors.teal},
          {height: barH.low, color: Colors.teal},
          {height: barH.low, color: Colors.teal},
          {height: barH.low, color: Colors.teal},
          {height: barH.low, color: Colors.teal},
          {height: barH.low, color: Colors.teal},
          {height: barH.low, color: Colors.teal},
          {height: barH.low, color: Colors.teal},
        ],
        ssv: {
          status: {label: 'Normal', bg: Colors.tealBg, color: Colors.tealText},
          stability: {label: 'Stable', bg: Colors.tealBg, color: Colors.tealText},
          velocity: {label: '\u2192 Flat', bg: Colors.tealBg, color: Colors.tealText},
        },
        tags: [
          {label: 'Kidney', bg: Colors.amberBg, color: Colors.amberText},
        ],
      },
    ],
  },
  {
    title: 'Haematology',
    cards: [
      {
        key: 'haemoglobin',
        iconName: 'flask-outline',
        iconBg: Colors.amberBg,
        iconColor: Colors.amberText,
        name: 'Haemoglobin',
        fullName: 'Blood haemoglobin',
        testCount: '5 tests',
        latest: '11.8',
        latestColor: Colors.amberText,
        bars: [
          {height: barH.high, color: Colors.teal},
          {height: barH.high, color: Colors.teal},
          {height: barH.med, color: Colors.teal},
          {height: barH.med, color: Colors.amber},
          {height: barH.med, color: Colors.amber},
          {height: barH.low, color: Colors.amber},
          {height: barH.low, color: Colors.amber},
          {height: barH.low, color: Colors.amber},
        ],
        ssv: {
          status: {label: 'Low-normal', bg: Colors.amberBg, color: Colors.amberText},
          stability: {label: 'Declining', bg: Colors.amberBg, color: Colors.amberText},
          velocity: {label: '\u2193 Declining', bg: Colors.amberBg, color: Colors.amberText},
        },
        tags: [
          {label: 'Anaemia screening', bg: Colors.amberBg, color: Colors.amberText},
        ],
      },
    ],
  },
  {
    title: 'Thyroid',
    cards: [
      {
        key: 'tsh',
        iconName: 'flask-outline',
        iconBg: Colors.tealBg,
        iconColor: Colors.tealText,
        name: 'TSH',
        fullName: 'Thyroid-stimulating hormone',
        testCount: '3 tests',
        latest: '2.4',
        latestColor: Colors.tealText,
        bars: [
          {height: barH.med, color: Colors.teal},
          {height: barH.med, color: Colors.teal},
          {height: barH.med, color: Colors.teal},
          {height: barH.med, color: Colors.teal},
          {height: barH.med, color: Colors.teal},
          {height: barH.med, color: Colors.teal},
          {height: barH.med, color: Colors.teal},
          {height: barH.med, color: Colors.teal},
        ],
        ssv: {
          status: {label: 'Optimal', bg: Colors.tealBg, color: Colors.tealText},
          stability: {label: 'Stable', bg: Colors.tealBg, color: Colors.tealText},
          velocity: {label: '\u2192 Flat', bg: Colors.tealBg, color: Colors.tealText},
        },
        tags: [
          {label: 'Thyroid', bg: Colors.purpleBg, color: Colors.purpleText},
        ],
      },
    ],
  },
  {
    title: 'Micronutrients',
    cards: [
      {
        key: 'b12',
        iconName: 'flask-outline',
        iconBg: Colors.redBg,
        iconColor: Colors.redText,
        name: 'Vitamin B12',
        fullName: 'Serum cobalamin',
        testCount: '2 tests',
        latest: 'Pending',
        latestColor: Colors.redText,
        bars: [
          {height: barH.low, color: Colors.amber},
          {height: barH.low, color: Colors.amber},
          {height: barH.low, color: Colors.amber},
          {height: barH.low, color: Colors.amber},
          {height: barH.low, color: Colors.amber},
          {height: barH.low, color: Colors.amber},
          {height: barH.low, color: Colors.amber},
          {height: barH.low, color: Colors.amber},
        ],
        ssv: {
          status: {label: 'Borderline', bg: Colors.redBg, color: Colors.redText},
          stability: {label: 'Unknown', bg: Colors.amberBg, color: Colors.amberText},
          velocity: {label: 'Pending', bg: Colors.redBg, color: Colors.redText},
        },
        tags: [
          {label: 'Metformin depletion', bg: Colors.amberBg, color: Colors.amberText},
          {label: 'Neuropathy risk', bg: Colors.redBg, color: Colors.redText},
        ],
      },
      {
        key: 'vitamin-d',
        iconName: 'flask-outline',
        iconBg: Colors.amberBg,
        iconColor: Colors.amberText,
        name: 'Vitamin D',
        fullName: '25-hydroxyvitamin D',
        testCount: '2 tests',
        latest: '22',
        latestColor: Colors.amberText,
        bars: [
          {height: barH.low, color: Colors.red},
          {height: barH.low, color: Colors.amber},
          {height: barH.low, color: Colors.amber},
          {height: barH.low, color: Colors.amber},
          {height: barH.low, color: Colors.amber},
          {height: barH.low, color: Colors.amber},
          {height: barH.low, color: Colors.amber},
          {height: barH.med, color: Colors.amber},
        ],
        ssv: {
          status: {label: 'Insufficient', bg: Colors.amberBg, color: Colors.amberText},
          stability: {label: 'Stable', bg: Colors.tealBg, color: Colors.tealText},
          velocity: {label: '\u2191 Improving', bg: Colors.tealBg, color: Colors.tealText},
        },
        tags: [
          {label: 'Bone health', bg: Colors.amberBg, color: Colors.amberText},
          {label: 'Immune function', bg: Colors.purpleBg, color: Colors.purpleText},
        ],
      },
    ],
  },
];

/* ─── biomarker card ─── */
const BiomarkerCard = ({card, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() => onPress && onPress(card.key)}
    style={styles.card}>
    {/* Header row */}
    <View style={styles.cardHeader}>
      <View style={[styles.cardIcon, {backgroundColor: card.iconBg}]}>
        <Icon family="Ionicons" name={card.iconName} size={ms(16)} color={card.iconColor} />
      </View>
      <View style={styles.cardContent}>
        <AppText variant="bodyBold">{card.name} <AppText variant="caption" color={Colors.textSecondary}>{card.fullName}</AppText></AppText>
        <View style={[styles.chipRow, {marginTop: vs(4)}]}>
          <Chip label={card.testCount} bg={Colors.blueBg} color={Colors.blueText} />
        </View>
      </View>
      <View style={styles.latestValue}>
        <AppText variant="header" color={card.latestColor}>{card.latest}</AppText>
      </View>
    </View>

    {/* Sparkline */}
    <View style={styles.sparkContainer}>
      <SparklineBars bars={card.bars} />
    </View>

    {/* SSV row */}
    <SSVRow
      status={card.ssv.status}
      stability={card.ssv.stability}
      velocity={card.ssv.velocity}
    />

    {/* Cluster tags */}
    <View style={styles.tagsContainer}>
      <ClusterTags tags={card.tags} />
    </View>
  </TouchableOpacity>
);

/* ─── cluster section header ─── */
const ClusterHeader = ({title}) => (
  <View style={styles.clusterRow}>
    <AppText variant="bodyBold" color={Colors.textSecondary}>{title}</AppText>
    <View style={styles.clusterLine} />
  </View>
);

/* ─── main component ─── */
const LabBiomarkersTab = ({onBiomarkerPress}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {/* Insight banner */}
      <View style={styles.insightBanner}>
        <Icon family="Ionicons" name="information-circle-outline" size={ms(16)} color={Colors.amberText} />
        <AppText variant="caption" color={Colors.amberText} style={{flex: 1, marginLeft: s(8)}}>
          Every biomarker ever measured — aggregated across all labs, colour-coded by clinical threshold, with trend velocity and condition clusters.
        </AppText>
      </View>

      {CLUSTERS.map((cluster, ci) => (
        <View key={ci}>
          <ClusterHeader title={cluster.title} />
          {cluster.cards.map((card) => (
            <BiomarkerCard key={card.key} card={card} onPress={onBiomarkerPress} />
          ))}
        </View>
      ))}

      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: s(4),
  },
  /* insight */
  insightBanner: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: Colors.amberBg,
    borderRadius: ms(12),
    paddingHorizontal: ms(12),
    paddingVertical: vs(10),
    marginBottom: vs(10),
  },
  /* cluster header */
  clusterRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(8),
    marginTop: vs(6),
  },
  clusterLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
    marginLeft: s(8),
  },
  /* card */
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    marginBottom: vs(10),
    overflow: 'hidden',
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: ms(13),
    paddingTop: vs(10),
    paddingBottom: vs(6),
  },
  cardIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
    marginTop: vs(2),
  },
  cardContent: {
    flex: 1,
  },
  latestValue: {
    alignItems: 'flex-end',
    marginLeft: s(8),
  },
  /* sparkline */
  sparkContainer: {
    paddingHorizontal: ms(13),
    paddingBottom: vs(8),
  },
  sparkRow: {
    flexDirection: 'row',
    alignItems: 'flex-end',
    height: vs(34),
    gap: ms(4),
  },
  sparkBar: {
    flex: 1,
    borderRadius: ms(3),
  },
  /* SSV */
  ssvRow: {
    flexDirection: 'row',
    paddingHorizontal: ms(13),
    paddingBottom: vs(8),
    gap: ms(6),
  },
  ssvItem: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: vs(4),
    borderRadius: ms(8),
  },
  /* tags */
  tagsContainer: {
    paddingHorizontal: ms(13),
    paddingBottom: vs(10),
  },
  tagRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(6),
  },
  tag: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
  },
  /* chip */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: ms(6),
  },
  chip: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
  },
});

export default LabBiomarkersTab;
