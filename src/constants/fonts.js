import {Platform} from 'react-native';
import {moderateScale as ms} from 'react-native-size-matters';

// ─── Font Families ───────────────────────────────────
// Change these to swap fonts across the entire project
const Fonts = {
  regular: Platform.select({ios: 'System', android: 'Roboto'}),
  medium: Platform.select({ios: 'System', android: 'Roboto'}),
  bold: Platform.select({ios: 'System', android: 'Roboto'}),

  // ─── Font Sizes ──────────────────────────────────────
  // Change any value here to update across the entire project
  sizes: {
    xs: ms(7),
    sm: ms(8),
    caption: ms(9),
    small: ms(10),
    body: ms(12),
    title: ms(14),
    heading: ms(16),
    large: ms(18),
    xlarge: ms(22),
  },
};

// ─── Typography Presets ────────────────────────────────
// These define how each text variant looks globally.
// Usage: import { Typography } from '../constants/fonts';
//        <AppText variant="header">Hello</AppText>
//
// Variants:
//   screenName  → Screen title in headers (e.g. "Progress", "Records")
//   header      → Large section header
//   subtitle    → Subtitle under headers (e.g. "Your health journey")
//   sectionTitle→ Section label (e.g. "DAILY TRACKERS")
//   body        → Regular body text
//   bodyBold    → Bold body text (inline emphasis)
//   caption     → Small helper text
//   small       → Smallest text (badges, labels)
//   subtext     → Muted helper text below content

export const Typography = {
  screenName: {
    fontFamily: Platform.select({ios: 'System', android: 'Roboto'}),
    fontSize: ms(19),
    fontWeight: '800',
    lineHeight: ms(24),
  },
  header: {
    fontFamily: Platform.select({ios: 'System', android: 'Roboto'}),
    fontSize: ms(16),
    fontWeight: '600',
    lineHeight: ms(21),
  },
  subtitle: {
    fontFamily: Platform.select({ios: 'System', android: 'Roboto'}),
    fontSize: ms(12),
    fontWeight: '400',
    lineHeight: ms(17),
  },
  sectionTitle: {
    fontFamily: Platform.select({ios: 'System', android: 'Roboto'}),
    fontSize: ms(13),
    fontWeight: '700',
    letterSpacing: 0.3,
    textTransform: 'uppercase',
    lineHeight: ms(17),
  },
  body: {
    fontFamily: Platform.select({ios: 'System', android: 'Roboto'}),
    fontSize: ms(13),
    fontWeight: '400',
    lineHeight: ms(19),
  },
  bodyBold: {
    fontFamily: Platform.select({ios: 'System', android: 'Roboto'}),
    fontSize: ms(13),
    fontWeight: '500',
    lineHeight: ms(19),
  },
  caption: {
    fontFamily: Platform.select({ios: 'System', android: 'Roboto'}),
    fontSize: ms(11),
    fontWeight: '400',
    lineHeight: ms(15),
  },
  small: {
    fontFamily: Platform.select({ios: 'System', android: 'Roboto'}),
    fontSize: ms(10),
    fontWeight: '400',
    lineHeight: ms(14),
  },
  subtext: {
    fontFamily: Platform.select({ios: 'System', android: 'Roboto'}),
    fontSize: ms(10),
    fontWeight: '400',
    lineHeight: ms(14),
  },
};

export default Fonts;
