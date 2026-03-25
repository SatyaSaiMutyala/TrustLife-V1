import React from 'react';
import {View, ScrollView, StyleSheet, TouchableOpacity} from 'react-native';
import {scale as s, verticalScale as vs, moderateScale as ms} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

/* ─── year header ─── */
const YearHeader = ({year, count}) => (
  <View style={styles.yearRow}>
    <View style={styles.yearPill}>
      <AppText variant="small" color={Colors.white}>{year}</AppText>
    </View>
    <View style={styles.yearLine} />
    <AppText variant="small" color={Colors.textTertiary}>{count}</AppText>
  </View>
);

/* ─── chip ─── */
const Chip = ({label, bg, color}) => (
  <View style={[styles.chip, {backgroundColor: bg}]}>
    <AppText variant="small" color={color}>{label}</AppText>
  </View>
);

/* ─── thumbnail ─── */
const Thumbnail = ({bgColor, iconName, label, subLabel, modalityLabel, modalityBg, modalityColor, date}) => (
  <View style={[styles.thumbnail, {backgroundColor: bgColor}]}>
    <View style={[styles.modalityBadge, {backgroundColor: modalityBg}]}>
      <AppText variant="small" color={modalityColor}>{modalityLabel}</AppText>
    </View>
    {date ? (
      <View style={styles.dateBadge}>
        <AppText variant="small" color={Colors.white}>{date}</AppText>
      </View>
    ) : null}
    <Icon family="Ionicons" name={iconName} size={ms(32)} color="rgba(255,255,255,0.5)" />
    <AppText variant="small" color="rgba(255,255,255,0.8)" style={{marginTop: vs(4)}}>{label}</AppText>
    <AppText variant="small" color="rgba(255,255,255,0.5)">{subLabel}</AppText>
  </View>
);

/* ─── data ─── */
const SECTIONS = [
  {
    year: '2025',
    count: '2 scans',
    cards: [
      {
        key: 'xray',
        borderColor: Colors.lightGreen,
        thumb: {
          bgColor: '#0a3d30',
          iconName: 'scan-outline',
          label: 'Chest PA view',
          subLabel: 'DICOM \u00B7 4.2 MB',
          modalityLabel: 'X-Ray \u00B7 PA',
          modalityBg: Colors.blueBg,
          modalityColor: Colors.blueText,
          date: '18 Sep 2025',
        },
        iconName: 'scan-outline',
        iconBg: Colors.blueBg,
        iconColor: Colors.blueText,
        title: 'Chest X-ray \u00B7 PA view',
        subtitle: 'Yashoda Hospitals \u00B7 Dr. Suresh Rao referral',
        rightDate: '18 Sep 2025',
        rightDoctor: 'Dr. Priya Nair',
        rightSize: 'DICOM \u00B7 4.2 MB',
        chips: [
          {label: 'No cardiomegaly \u2713', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'Clear lung fields \u2713', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'Normal mediastinum \u2713', bg: Colors.tealBg, color: Colors.tealText},
        ],
        footer: {label: 'Cardiology review \u00B7 Dr. Suresh Rao', bg: Colors.tealBg, color: Colors.tealText},
      },
      {
        key: 'echo',
        borderColor: Colors.lightGreen,
        thumb: {
          bgColor: '#2a1a40',
          iconName: 'heart-outline',
          label: 'Echocardiogram',
          subLabel: 'Video \u00B7 DICOM \u00B7 28 MB',
          modalityLabel: '2D Echo',
          modalityBg: Colors.purpleBg,
          modalityColor: Colors.purpleText,
          date: null,
        },
        iconName: 'heart-outline',
        iconBg: Colors.purpleBg,
        iconColor: Colors.purpleText,
        title: 'Echocardiogram \u00B7 2D + Doppler',
        subtitle: 'Yashoda Hospitals \u00B7 Cardiac imaging',
        rightDate: null,
        rightDoctor: null,
        rightSize: null,
        chips: [
          {label: 'EF 62% \u2713 Normal', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'LV geometry normal', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'No valve disease', bg: Colors.tealBg, color: Colors.tealText},
        ],
        footer: null,
      },
    ],
  },
  {
    year: '2023',
    count: '1 scan',
    cards: [
      {
        key: 'usg',
        borderColor: Colors.amber,
        thumb: {
          bgColor: '#3d2a0a',
          iconName: 'radio-outline',
          label: 'Abdomen \u00B7 Pelvis',
          subLabel: 'DICOM \u00B7 12 MB',
          modalityLabel: 'USG',
          modalityBg: Colors.amberBg,
          modalityColor: Colors.amberText,
          date: null,
        },
        iconName: 'radio-outline',
        iconBg: Colors.amberBg,
        iconColor: Colors.amberText,
        title: 'Ultrasound abdomen \u00B7 Complete',
        subtitle: 'Kamineni Hospital \u00B7 Fatty liver screening',
        rightDate: null,
        rightDoctor: null,
        rightSize: null,
        chips: [
          {label: 'Grade 1 fatty liver', bg: Colors.amberBg, color: Colors.amberText},
          {label: 'Kidneys normal \u2713', bg: Colors.tealBg, color: Colors.tealText},
          {label: 'No gallstones \u2713', bg: Colors.tealBg, color: Colors.tealText},
        ],
        footer: null,
      },
    ],
  },
];

/* ─── imaging card ─── */
const ImagingCard = ({card, onPress}) => (
  <TouchableOpacity
    activeOpacity={0.7}
    onPress={() => onPress && onPress(card.key)}
    style={[styles.card, {borderLeftWidth: 3, borderLeftColor: card.borderColor}]}>
    {/* Thumbnail */}
    <Thumbnail {...card.thumb} />

    {/* Info row */}
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, {backgroundColor: card.iconBg}]}>
        <Icon family="Ionicons" name={card.iconName} size={ms(16)} color={card.iconColor} />
      </View>
      <View style={styles.infoContent}>
        <AppText variant="bodyBold">{card.title}</AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
          {card.subtitle}
        </AppText>
      </View>
      {card.rightDate ? (
        <View style={styles.rightInfo}>
          <AppText variant="small" color={Colors.textSecondary}>{card.rightDate}</AppText>
          <AppText variant="small" color={Colors.textSecondary}>{card.rightDoctor}</AppText>
          <AppText variant="small" color={Colors.textTertiary}>{card.rightSize}</AppText>
        </View>
      ) : null}
    </View>

    {/* Findings chips */}
    <View style={styles.chipRow}>
      {card.chips.map((c, i) => (
        <Chip key={i} label={c.label} bg={c.bg} color={c.color} />
      ))}
    </View>

    {/* Footer */}
    {card.footer ? (
      <View style={styles.footer}>
        <View style={[styles.chip, {backgroundColor: card.footer.bg}]}>
          <AppText variant="small" color={card.footer.color}>{card.footer.label}</AppText>
        </View>
        <Icon family="Ionicons" name="chevron-forward" size={ms(14)} color={Colors.textTertiary} />
      </View>
    ) : null}
  </TouchableOpacity>
);

/* ─── upcoming card ─── */
const UpcomingCard = () => (
  <View style={styles.upcomingCard}>
    <View style={styles.infoRow}>
      <View style={[styles.infoIcon, {backgroundColor: Colors.amberBg}]}>
        <Icon family="Ionicons" name="eye-outline" size={ms(16)} color={Colors.amberText} />
      </View>
      <View style={styles.infoContent}>
        <AppText variant="bodyBold" color={Colors.amberText}>
          Dilated fundus exam {'\u00B7'} Overdue
        </AppText>
        <AppText variant="caption" color={Colors.textSecondary} style={{marginTop: vs(2)}}>
          Sankara Eye Hospital {'\u00B7'} Referral issued 15 Mar 2026
        </AppText>
      </View>
    </View>

    <View style={styles.chipRow}>
      <Chip label="14 months overdue" bg={Colors.redBg} color={Colors.redText} />
      <Chip label="HbA1c 7.8% \u2014 high risk" bg={Colors.amberBg} color={Colors.amberText} />
    </View>

    <View style={styles.footer}>
      <View style={[styles.chip, {backgroundColor: Colors.amberBg}]}>
        <AppText variant="small" color={Colors.amberText}>Book Sankara Eye Hospital urgently</AppText>
      </View>
    </View>
  </View>
);

/* ─── main component ─── */
const ImgAllTab = ({onImagePress}) => {
  return (
    <ScrollView showsVerticalScrollIndicator={false} style={styles.container}>
      {SECTIONS.map((section, si) => (
        <View key={si}>
          <YearHeader year={section.year} count={section.count} />
          {section.cards.map((card) => (
            <ImagingCard key={card.key} card={card} onPress={onImagePress} />
          ))}
        </View>
      ))}

      {/* Upcoming */}
      <YearHeader year="Upcoming" count="1 pending" />
      <UpcomingCard />

      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: s(4),
  },
  /* year header */
  yearRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: vs(10),
    marginTop: vs(6),
  },
  yearPill: {
    backgroundColor: Colors.primary,
    paddingHorizontal: ms(10),
    paddingVertical: vs(3),
    borderRadius: ms(10),
  },
  yearLine: {
    flex: 1,
    height: 1,
    backgroundColor: BORDER,
    marginHorizontal: s(8),
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
  /* thumbnail */
  thumbnail: {
    height: vs(120),
    alignItems: 'center',
    justifyContent: 'center',
    position: 'relative',
  },
  modalityBadge: {
    position: 'absolute',
    top: vs(8),
    left: s(8),
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  dateBadge: {
    position: 'absolute',
    top: vs(8),
    right: s(8),
    backgroundColor: 'rgba(0,0,0,0.5)',
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(8),
  },
  /* info */
  infoRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingHorizontal: ms(13),
    paddingVertical: vs(10),
  },
  infoIcon: {
    width: ms(32),
    height: ms(32),
    borderRadius: ms(16),
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: s(10),
    marginTop: vs(2),
  },
  infoContent: {
    flex: 1,
  },
  rightInfo: {
    alignItems: 'flex-end',
    marginLeft: s(8),
  },
  /* chips */
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    paddingHorizontal: ms(13),
    paddingBottom: vs(8),
    gap: ms(6),
  },
  chip: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(3),
    borderRadius: ms(8),
  },
  /* footer */
  footer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: ms(13),
    paddingVertical: vs(8),
    borderTopWidth: 0.5,
    borderTopColor: BORDER,
  },
  /* upcoming */
  upcomingCard: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 1.5,
    borderColor: Colors.amber,
    borderStyle: 'dashed',
    marginBottom: vs(10),
    overflow: 'hidden',
  },
});

export default ImgAllTab;
