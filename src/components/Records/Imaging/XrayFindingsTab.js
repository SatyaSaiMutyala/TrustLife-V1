import React from 'react';
import {View, ScrollView, StyleSheet} from 'react-native';
import {
  scale as s,
  verticalScale as vs,
  moderateScale as ms,
} from 'react-native-size-matters';
import Colors from '../../../constants/colors';
import AppText from '../../shared/AppText';
import Icon from '../../shared/Icons';

const BORDER = Colors.borderTertiary || Colors.borderLight || '#e5e7eb';

const findings = [
  {
    system: 'Cardiac silhouette',
    items: [
      {dot: Colors.tealText, text: 'CTR 0.47', tag: 'Normal', tagBg: Colors.tealBg, tagColor: Colors.tealText},
      {dot: Colors.tealText, text: 'Cardiac borders well-defined bilaterally'},
      {dot: Colors.tealText, text: 'Aortic knuckle normal calibre'},
    ],
  },
  {
    system: 'Lung fields',
    items: [
      {dot: Colors.tealText, text: 'Clear lung fields bilaterally'},
      {dot: Colors.tealText, text: 'Normal bronchovascular markings'},
      {dot: Colors.tealText, text: 'Normal bilateral hila'},
    ],
  },
  {
    system: 'Pleura',
    items: [
      {dot: Colors.tealText, text: 'No pleural effusion'},
      {dot: Colors.tealText, text: 'No pneumothorax'},
    ],
  },
  {
    system: 'Mediastinum & bones',
    items: [
      {dot: Colors.tealText, text: 'Trachea central, mediastinum unremarkable'},
      {dot: Colors.tealText, text: 'Ribs intact, no fractures or lytic lesions'},
    ],
  },
];

const verbatimWords = [
  {text: 'PA erect chest radiograph ', color: Colors.primary},
  {text: 'performed on 18 Sep 2025. '},
  {text: 'Heart size normal', color: Colors.tealText},
  {text: ' with a '},
  {text: 'cardiothoracic ratio of 0.47', color: Colors.primary},
  {text: '. '},
  {text: 'Lung fields are clear', color: Colors.tealText},
  {text: ' bilaterally with no evidence of consolidation, mass, or effusion. '},
  {text: 'Bronchovascular markings are normal', color: Colors.tealText},
  {text: '. Hila are '},
  {text: 'normal', color: Colors.tealText},
  {text: ' in size and density. '},
  {text: 'Costophrenic angles are sharp', color: Colors.tealText},
  {text: '. Mediastinal contours are unremarkable. Trachea is '},
  {text: 'central', color: Colors.tealText},
  {text: '. Bony thorax shows '},
  {text: 'no abnormality', color: Colors.tealText},
  {text: '. '},
  {text: 'Impression: Normal chest radiograph.', color: Colors.primary},
];

const measurements = [
  {label: 'CTR', value: '0.47', color: Colors.tealText},
  {label: 'Threshold', value: '<0.5', color: Colors.textPrimary},
  {label: 'kVp', value: '100', color: Colors.textPrimary},
  {label: 'Ribs', value: '10', color: Colors.textPrimary},
];

const XrayFindingsTab = () => {
  const renderFindings = () =>
    findings.map((section, si) => (
      <View key={si} style={{marginBottom: vs(12)}}>
        <View style={styles.systemHeader}>
          <AppText variant="caption" color={Colors.blueText} style={{fontWeight: '600'}}>
            {section.system}
          </AppText>
        </View>
        <View style={styles.card}>
          {section.items.map((item, ii) => (
            <View
              key={ii}
              style={[
                styles.findingRow,
                ii < section.items.length - 1 && styles.rowBorder,
              ]}>
              <View style={[styles.dot, {backgroundColor: item.dot}]} />
              <AppText variant="caption" style={{flex: 1}}>
                {item.text}
              </AppText>
              {item.tag && (
                <View style={[styles.pill, {backgroundColor: item.tagBg}]}>
                  <AppText variant="small" color={item.tagColor}>
                    {item.tag}
                  </AppText>
                </View>
              )}
            </View>
          ))}
        </View>
      </View>
    ));

  const renderVerbatim = () => (
    <View style={{marginBottom: vs(12)}}>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
        Radiologist's verbatim report
      </AppText>
      <View style={styles.verbatimCard}>
        <AppText variant="caption" style={{lineHeight: ms(20)}}>
          {verbatimWords.map((w, i) => (
            <AppText
              key={i}
              variant="caption"
              color={w.color || Colors.textPrimary}
              style={w.color ? {fontWeight: '600'} : undefined}>
              {w.text}
            </AppText>
          ))}
        </AppText>
      </View>
    </View>
  );

  const renderMeasurements = () => (
    <View>
      <AppText variant="bodyBold" style={{marginBottom: vs(8)}}>
        Key measurements
      </AppText>
      <View style={styles.measureGrid}>
        {measurements.map((m, i) => (
          <View key={i} style={styles.measureItem}>
            <AppText variant="caption" color={Colors.textSecondary}>
              {m.label}
            </AppText>
            <AppText
              variant="bodyBold"
              color={m.color}
              style={{marginTop: vs(2)}}>
              {m.value}
            </AppText>
          </View>
        ))}
      </View>
    </View>
  );

  return (
    <ScrollView
      style={styles.container}
      contentContainerStyle={styles.content}
      showsVerticalScrollIndicator={false}>
      {renderFindings()}
      {renderVerbatim()}
      {renderMeasurements()}
      <View style={{height: vs(24)}} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: s(4),
  },
  systemHeader: {
    backgroundColor: Colors.blueBg,
    paddingHorizontal: ms(10),
    paddingVertical: vs(5),
    borderRadius: ms(8),
    marginBottom: vs(4),
    alignSelf: 'flex-start',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
  },
  findingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: vs(8),
    gap: s(8),
  },
  rowBorder: {
    borderBottomWidth: 0.5,
    borderBottomColor: BORDER,
  },
  dot: {
    width: ms(8),
    height: ms(8),
    borderRadius: ms(4),
  },
  pill: {
    paddingHorizontal: ms(8),
    paddingVertical: vs(2),
    borderRadius: ms(10),
  },
  verbatimCard: {
    backgroundColor: Colors.background,
    borderRadius: ms(14),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(13),
  },
  measureGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: s(8),
  },
  measureItem: {
    flex: 1,
    minWidth: '20%',
    backgroundColor: Colors.white,
    borderRadius: ms(12),
    borderWidth: 0.5,
    borderColor: BORDER,
    padding: ms(10),
    alignItems: 'center',
  },
});

export default XrayFindingsTab;
